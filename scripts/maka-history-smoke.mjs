#!/usr/bin/env node
/** Minimal self-check for data/maka-history snapshot. */
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const dir = resolve(fileURLToPath(new URL('../data/maka-history', import.meta.url)))
const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'))
const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8'))
const commitLines = readFileSync(join(dir, 'commits.ndjson'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
const prLines = readFileSync(join(dir, 'prs.ndjson'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)

assert.equal(meta.schemaVersion, 1)
assert.equal(meta.status, 'ok')
assert.equal(meta.counts.commits, commitLines.length)
assert.equal(meta.counts.prs, prLines.length)
assert.ok(meta.counts.commits >= 2000, 'expected full DAG scale')
assert.ok(meta.counts.prs >= 1000, 'expected merged PR catalog scale')

const pr1298 = prLines.map((l) => JSON.parse(l)).find((p) => p.number === 1298)
assert.ok(pr1298, 'PR #1298 present')
assert.ok(index.prToShas['1298']?.length, 'PR #1298 joined to commits')

const sha = index.prToShas['1298'][0]
assert.ok(index.shaToPrs[sha]?.includes(1298))
const short = Object.entries(index.shortToSha).find(([, s]) => s === sha)?.[0]
assert.ok(short, 'shortToSha reverse lookup')

console.log(
  `ok: pin ${meta.source.sourceShort} · ${meta.counts.commits} commits · ${meta.counts.prs} PRs · #1298 → ${short}`,
)
