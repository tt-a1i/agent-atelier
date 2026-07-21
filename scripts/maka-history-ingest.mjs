#!/usr/bin/env node
/**
 * Maka history ingest — sync commit/PR lineage into data/maka-history/.
 *
 * Spec: docs/research/maka-history-ingest.md
 *
 * Usage:
 *   node scripts/maka-history-ingest.mjs --dry-meta
 *   node scripts/maka-history-ingest.mjs
 *   MAKA_AGENT_REPO=/path/to/maka-agent node scripts/maka-history-ingest.mjs
 *   node scripts/maka-history-ingest.mjs --skip-prs
 *
 * Caps (documented in meta.caps):
 *   - body truncated at BODY_MAX_BYTES (2 KiB)
 *   - pathPrefixes capped at PATH_PREFIXES_MAX (40) per commit
 *   - full DAG stored; PR join via subject (#N) + mergeCommitSha (no live
 *     GraphQL associatedPullRequests pass — optional later if gaps matter)
 */

import { spawnSync } from 'node:child_process'
import {
  mkdirSync,
  writeFileSync,
  existsSync,
  createWriteStream,
} from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { finished } from 'node:stream/promises'

const ROOT_SHA = '8fd91a43cc64cdde58cfbd046256effce0cfa6f8'
const DEFAULT_CLONE =
  process.env.MAKA_AGENT_REPO ?? '/Users/tushaokun/code/maka-agent'
const REPO_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const OWNER = 'maka-agent'
const REPO = 'maka-agent'
const BODY_MAX_BYTES = 2048
const PATH_PREFIXES_MAX = 40
const PR_PAGE_SIZE = 100
const RECORD_SEP = '\x1e'

function parseArgs(argv) {
  const out = {
    clone: DEFAULT_CLONE,
    outDir: join(REPO_ROOT, 'data', 'maka-history'),
    sourceSha: 'HEAD',
    dryMeta: false,
    skipPrs: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dry-meta') out.dryMeta = true
    else if (a === '--skip-prs') out.skipPrs = true
    else if (a === '--clone') out.clone = argv[++i]
    else if (a === '--out') out.outDir = resolve(argv[++i])
    else if (a === '--source-sha') out.sourceSha = argv[++i]
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node scripts/maka-history-ingest.mjs [options]
  --clone <path>       Maka clone (default: $MAKA_AGENT_REPO or ${DEFAULT_CLONE})
  --out <dir>          Output directory (default: data/maka-history)
  --source-sha <sha>   Pin SHA (default: HEAD of clone)
  --dry-meta           Write meta.json + empty NDJSON/index only
  --skip-prs           Commits + index only (offline / no gh)
`)
      process.exit(0)
    } else {
      console.error(`Unknown arg: ${a}`)
      process.exit(2)
    }
  }
  return out
}

function git(clone, args, opts = {}) {
  const r = spawnSync('git', ['-C', clone, ...args], {
    encoding: 'utf8',
    maxBuffer: opts.maxBuffer ?? 256 * 1024 * 1024,
  })
  if (r.status !== 0) {
    throw new Error(
      `git ${args.join(' ')} failed: ${(r.stderr || r.stdout || '').trim()}`,
    )
  }
  return r.stdout ?? ''
}

function truncateBody(body) {
  if (!body) return ''
  const buf = Buffer.from(body, 'utf8')
  if (buf.length <= BODY_MAX_BYTES) return body
  return `${buf.subarray(0, BODY_MAX_BYTES).toString('utf8')}…`
}

function pathPrefix(filePath) {
  const parts = filePath.split('/').filter(Boolean)
  if (parts.length === 0) return null
  if (parts.length === 1) return parts[0]
  return `${parts[0]}/${parts[1]}`
}

function parseSubjectPrs(subject) {
  const nums = []
  const re = /\(#(\d+)\)/g
  let m
  while ((m = re.exec(subject))) {
    nums.push(Number(m[1]))
  }
  return [...new Set(nums)]
}

function addToMapSet(map, key, value) {
  let arr = map.get(key)
  if (!arr) {
    arr = []
    map.set(key, arr)
  }
  if (!arr.includes(value)) arr.push(value)
}

/**
 * Parse `git log` with RS + NUL-separated fields + trailing numstat.
 *
 * Body may contain newlines, so fields are NUL-terminated (not line-based):
 *   RS sha\\0 parents\\0 short\\0 subject\\0 an\\0 ae\\0 aI\\0 cn\\0 ce\\0 cI\\0 body\\0
 *   then numstat lines until next RS.
 */
function extractCommits(clone, sourceSha) {
  // Body last so multiline subjects/bodies cannot break field alignment.
  const format =
    `${RECORD_SEP}%H%x00%P%x00%h%x00%s%x00` +
    `%an%x00%ae%x00%aI%x00%cn%x00%ce%x00%cI%x00%b%x00`

  // Root has no parent — log sourceSha includes root; never ROOT^..
  const raw = git(
    clone,
    ['log', '--reverse', '--numstat', `--format=${format}`, sourceSha],
    { maxBuffer: 512 * 1024 * 1024 },
  )

  const commits = []
  const chunks = raw.split(RECORD_SEP)
  for (const chunk of chunks) {
    if (!chunk) continue

    const fields = []
    let start = 0
    for (let i = 0; i < chunk.length && fields.length < 11; i++) {
      if (chunk.charCodeAt(i) === 0) {
        fields.push(chunk.slice(start, i))
        start = i + 1
      }
    }
    if (fields.length < 11) {
      console.warn(
        `Skipping malformed commit record (${fields.length}/11 fields)`,
      )
      continue
    }
    const rest = chunk.slice(start)
    const [
      sha,
      parentsRaw,
      short,
      subject,
      aname,
      aemail,
      adate,
      cname,
      cemail,
      cdate,
      body,
    ] = fields

    let files = 0
    let additions = 0
    let deletions = 0
    const prefixSet = new Set()
    for (const line of rest.split('\n')) {
      if (!line.trim()) continue
      // numstat: additions\tdeletions\tpath  (binary: -\t-\tpath)
      const tab1 = line.indexOf('\t')
      if (tab1 === -1) continue
      const tab2 = line.indexOf('\t', tab1 + 1)
      if (tab2 === -1) continue
      const a = line.slice(0, tab1)
      const d = line.slice(tab1 + 1, tab2)
      const filePath = line.slice(tab2 + 1)
      files += 1
      if (a !== '-') additions += Number(a) || 0
      if (d !== '-') deletions += Number(d) || 0
      const pref = pathPrefix(filePath)
      if (pref) prefixSet.add(pref)
    }

    const pathPrefixes = [...prefixSet].sort().slice(0, PATH_PREFIXES_MAX)
    commits.push({
      sha,
      short,
      parents: parentsRaw ? parentsRaw.split(' ').filter(Boolean) : [],
      subject,
      body: truncateBody(body.replace(/\r/g, '')),
      author: { name: aname, email: aemail, date: adate },
      committer: { name: cname, email: cemail, date: cdate },
      prNumbers: parseSubjectPrs(subject),
      pathPrefixes,
      stats: { files, additions, deletions },
    })
  }
  return commits
}

function ghJson(args) {
  const r = spawnSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  if (r.status !== 0) {
    throw new Error(
      `gh ${args.join(' ')} failed: ${(r.stderr || r.stdout || '').trim()}`,
    )
  }
  return JSON.parse(r.stdout)
}

function fetchMergedPrs() {
  const prs = []
  let cursor = null
  let page = 0
  for (;;) {
    page += 1
    const afterClause = cursor ? `, after: ${JSON.stringify(cursor)}` : ''
    const query = `
      query {
        repository(owner: "${OWNER}", name: "${REPO}") {
          pullRequests(
            states: MERGED
            first: ${PR_PAGE_SIZE}
            orderBy: { field: UPDATED_AT, direction: DESC }
            ${afterClause}
          ) {
            pageInfo { hasNextPage endCursor }
            nodes {
              number
              title
              url
              mergedAt
              baseRefName
              headRefName
              mergeCommit { oid }
              author { login }
              labels(first: 20) { nodes { name } }
            }
          }
        }
      }`
    process.stderr.write(`  fetching merged PRs page ${page}…\n`)
    const data = ghJson(['api', 'graphql', '-f', `query=${query}`])
    if (data.errors?.length) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }
    const conn = data.data.repository.pullRequests
    for (const n of conn.nodes) {
      if (!n.mergedAt) continue
      prs.push({
        number: n.number,
        title: n.title,
        url: n.url,
        author: n.author?.login ?? 'ghost',
        mergedAt: n.mergedAt,
        baseRef: n.baseRefName,
        headRef: n.headRefName,
        mergeCommitSha: n.mergeCommit?.oid ?? null,
        labels: (n.labels?.nodes ?? []).map((l) => l.name),
        commitShas: [],
      })
    }
    if (!conn.pageInfo.hasNextPage) break
    cursor = conn.pageInfo.endCursor
  }
  // Newest mergedAt first for PR-first UI default
  prs.sort((a, b) => (a.mergedAt < b.mergedAt ? 1 : a.mergedAt > b.mergedAt ? -1 : 0))
  return prs
}

function joinPrs(commits, prs) {
  const shaToPrs = new Map()
  const prToShas = new Map()
  const shortToSha = new Map()
  const commitBySha = new Map()

  for (const c of commits) {
    commitBySha.set(c.sha, c)
    shortToSha.set(c.short, c.sha)
    for (const n of c.prNumbers) {
      addToMapSet(shaToPrs, c.sha, n)
      addToMapSet(prToShas, String(n), c.sha)
    }
  }

  for (const pr of prs) {
    if (pr.mergeCommitSha && commitBySha.has(pr.mergeCommitSha)) {
      addToMapSet(shaToPrs, pr.mergeCommitSha, pr.number)
      addToMapSet(prToShas, String(pr.number), pr.mergeCommitSha)
      const c = commitBySha.get(pr.mergeCommitSha)
      if (!c.prNumbers.includes(pr.number)) c.prNumbers.push(pr.number)
    }
  }

  // Fill commitShas on PR records from join map
  for (const pr of prs) {
    pr.commitShas = prToShas.get(String(pr.number)) ?? []
  }

  // Ensure every subject-linked PR number has a commit entry even if catalog missed it
  for (const c of commits) {
    c.prNumbers = [...new Set(c.prNumbers)].sort((a, b) => a - b)
  }

  return {
    shaToPrs: Object.fromEntries(
      [...shaToPrs.entries()].map(([k, v]) => [k, v.sort((a, b) => a - b)]),
    ),
    prToShas: Object.fromEntries(prToShas.entries()),
    shortToSha: Object.fromEntries(shortToSha.entries()),
  }
}

async function writeNdjson(path, rows) {
  const stream = createWriteStream(path, { encoding: 'utf8' })
  for (const row of rows) {
    if (!stream.write(`${JSON.stringify(row)}\n`)) {
      await new Promise((r) => stream.once('drain', r))
    }
  }
  stream.end()
  await finished(stream)
}

async function main() {
  const opts = parseArgs(process.argv)

  if (!existsSync(join(opts.clone, '.git'))) {
    console.error(`Not a git clone: ${opts.clone}`)
    process.exit(1)
  }

  const root = git(opts.clone, ['rev-list', '--max-parents=0', 'HEAD']).trim()
  if (!root.split('\n').includes(ROOT_SHA)) {
    console.error(
      `Expected root ${ROOT_SHA} in ${opts.clone}; found: ${root || '(none)'}`,
    )
    process.exit(1)
  }

  const sourceSha = git(opts.clone, ['rev-parse', opts.sourceSha]).trim()
  const sourceShort = git(opts.clone, [
    'rev-parse',
    '--short=7',
    sourceSha,
  ]).trim()

  const ancestor = spawnSync('git', [
    '-C',
    opts.clone,
    'merge-base',
    '--is-ancestor',
    ROOT_SHA,
    sourceSha,
  ])
  if (ancestor.status !== 0) {
    console.error(`${ROOT_SHA} is not an ancestor of ${sourceSha}`)
    process.exit(1)
  }

  const cloneCommitCount = Number(
    git(opts.clone, ['rev-list', '--count', sourceSha]).trim(),
  )
  const cloneFirstParent = Number(
    git(opts.clone, [
      'rev-list',
      '--first-parent',
      '--count',
      sourceSha,
    ]).trim(),
  )

  mkdirSync(opts.outDir, { recursive: true })

  const caps = {
    bodyMaxBytes: BODY_MAX_BYTES,
    pathPrefixesMax: PATH_PREFIXES_MAX,
    prAssociation: [
      'subject (#N)',
      'mergeCommitSha from merged PR catalog',
    ],
    notes:
      'Full DAG stored. Patches omitted — link to GitHub. Open/draft PRs out of scope.',
  }

  if (opts.dryMeta) {
    const meta = {
      schemaVersion: 1,
      source: {
        owner: OWNER,
        repo: REPO,
        defaultBranch: 'main',
        rootSha: ROOT_SHA,
        sourceSha,
        sourceShort,
        clonePathHint: opts.clone,
      },
      extractedAt: new Date().toISOString(),
      counts: {
        commits: 0,
        prs: 0,
        firstParent: 0,
        cloneCommitCount,
        cloneFirstParent,
      },
      caps,
      status: 'dry-meta',
    }
    writeFileSync(
      join(opts.outDir, 'meta.json'),
      `${JSON.stringify(meta, null, 2)}\n`,
    )
    writeFileSync(join(opts.outDir, 'commits.ndjson'), '')
    writeFileSync(join(opts.outDir, 'prs.ndjson'), '')
    writeFileSync(
      join(opts.outDir, 'index.json'),
      `${JSON.stringify({ shaToPrs: {}, prToShas: {}, shortToSha: {} }, null, 2)}\n`,
    )
    console.log(`Wrote dry meta for pin ${sourceShort} → ${opts.outDir}`)
    return
  }

  process.stderr.write(
    `Extracting commits for pin ${sourceShort} (${cloneCommitCount} expected)…\n`,
  )
  const commits = extractCommits(opts.clone, sourceSha)
  process.stderr.write(`  got ${commits.length} commits\n`)

  let prs = []
  if (!opts.skipPrs) {
    process.stderr.write('Fetching merged PR catalog via gh GraphQL…\n')
    prs = fetchMergedPrs()
    process.stderr.write(`  got ${prs.length} merged PRs\n`)
  } else {
    process.stderr.write('Skipping PR catalog (--skip-prs)\n')
  }

  const index = joinPrs(commits, prs)

  await writeNdjson(join(opts.outDir, 'commits.ndjson'), commits)
  await writeNdjson(join(opts.outDir, 'prs.ndjson'), prs)
  writeFileSync(
    join(opts.outDir, 'index.json'),
    `${JSON.stringify(index, null, 2)}\n`,
  )

  const meta = {
    schemaVersion: 1,
    source: {
      owner: OWNER,
      repo: REPO,
      defaultBranch: 'main',
      rootSha: ROOT_SHA,
      sourceSha,
      sourceShort,
      clonePathHint: opts.clone,
    },
    extractedAt: new Date().toISOString(),
    counts: {
      commits: commits.length,
      prs: prs.length,
      firstParent: cloneFirstParent,
      cloneCommitCount,
      cloneFirstParent,
    },
    caps,
    status: opts.skipPrs ? 'commits-only' : 'ok',
  }
  writeFileSync(
    join(opts.outDir, 'meta.json'),
    `${JSON.stringify(meta, null, 2)}\n`,
  )

  console.log(
    `Wrote snapshot pin ${sourceShort}: ${commits.length} commits, ${prs.length} PRs → ${opts.outDir}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
