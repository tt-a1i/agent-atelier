#!/usr/bin/env node
/**
 * Maka history ingest — sync commit/PR lineage into data/maka-history/.
 *
 * Spec: docs/research/maka-history-ingest.md
 *
 * Usage:
 *   node scripts/maka-history-ingest.mjs --dry-meta
 *   node scripts/maka-history-ingest.mjs              # full extract (TODO)
 *   MAKA_AGENT_REPO=/path/to/maka-agent node scripts/maka-history-ingest.mjs
 *
 * Full NDJSON extract is intentionally stubbed until history UX (#8) locks
 * filter density; this skeleton validates the clone pin and writes meta.
 */

import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_SHA = '8fd91a43cc64cdde58cfbd046256effce0cfa6f8'
const DEFAULT_CLONE =
  process.env.MAKA_AGENT_REPO ?? '/Users/tushaokun/code/maka-agent'
const REPO_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))

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
  --skip-prs           Commits only (when full extract lands)
`)
      process.exit(0)
    } else {
      console.error(`Unknown arg: ${a}`)
      process.exit(2)
    }
  }
  return out
}

function git(clone, args) {
  const r = spawnSync('git', ['-C', clone, ...args], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  if (r.status !== 0) {
    throw new Error(
      `git ${args.join(' ')} failed: ${(r.stderr || r.stdout || '').trim()}`,
    )
  }
  return (r.stdout || '').trim()
}

function main() {
  const opts = parseArgs(process.argv)

  if (!existsSync(join(opts.clone, '.git'))) {
    console.error(`Not a git clone: ${opts.clone}`)
    process.exit(1)
  }

  const root = git(opts.clone, ['rev-list', '--max-parents=0', 'HEAD'])
  if (!root.split('\n').includes(ROOT_SHA)) {
    console.error(
      `Expected root ${ROOT_SHA} in ${opts.clone}; found: ${root || '(none)'}`,
    )
    process.exit(1)
  }

  const sourceSha = git(opts.clone, ['rev-parse', opts.sourceSha])
  const sourceShort = git(opts.clone, ['rev-parse', '--short=7', sourceSha])

  // Root has no parent — never use ROOT^..range. Confirm ancestry, then count.
  const ancestor = spawnSync(
    'git',
    ['-C', opts.clone, 'merge-base', '--is-ancestor', ROOT_SHA, sourceSha],
  )
  if (ancestor.status !== 0) {
    console.error(`${ROOT_SHA} is not an ancestor of ${sourceSha}`)
    process.exit(1)
  }

  const commitCount = Number(git(opts.clone, ['rev-list', '--count', sourceSha]))
  const firstParent = Number(
    git(opts.clone, ['rev-list', '--first-parent', '--count', sourceSha]),
  )

  mkdirSync(opts.outDir, { recursive: true })

  const meta = {
    schemaVersion: 1,
    source: {
      owner: 'maka-agent',
      repo: 'maka-agent',
      defaultBranch: 'main',
      rootSha: ROOT_SHA,
      sourceSha,
      sourceShort,
      clonePathHint: opts.clone,
    },
    extractedAt: new Date().toISOString(),
    counts: {
      commits: opts.dryMeta ? 0 : commitCount,
      prs: 0,
      firstParent: opts.dryMeta ? 0 : firstParent,
      cloneCommitCount: commitCount,
      cloneFirstParent: firstParent,
    },
    status: opts.dryMeta
      ? 'dry-meta'
      : 'stub — full NDJSON extract not implemented yet',
  }

  writeFileSync(join(opts.outDir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`)

  if (opts.dryMeta || meta.status.startsWith('stub')) {
    writeFileSync(join(opts.outDir, 'commits.ndjson'), '')
    writeFileSync(join(opts.outDir, 'prs.ndjson'), '')
    writeFileSync(
      join(opts.outDir, 'index.json'),
      `${JSON.stringify({ shaToPrs: {}, prToShas: {}, shortToSha: {} }, null, 2)}\n`,
    )
  }

  // TODO: full extract
  // 1. git log --reverse ROOT^..sourceSha → commits.ndjson (+ numstat / pathPrefixes)
  // 2. subject (#N) + gh GraphQL associatedPullRequests → prNumbers
  // 3. gh merged PR catalog → prs.ndjson + index.json
  if (!opts.dryMeta) {
    console.error(
      'Full extract not implemented yet. Re-run with --dry-meta to write pin metadata, or implement NDJSON writers (see docs/research/maka-history-ingest.md).',
    )
    console.error(`Validated clone pin ${sourceShort} (${commitCount} commits, ${firstParent} first-parent).`)
    console.error(`Wrote ${join(opts.outDir, 'meta.json')}`)
    process.exit(0)
  }

  console.log(`Wrote dry meta for pin ${sourceShort} → ${opts.outDir}`)
}

main()
