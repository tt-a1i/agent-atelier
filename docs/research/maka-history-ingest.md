# Maka history ingest for the `/history` track

**Ticket:** [Define Maka history ingest for the /history track](https://github.com/tt-a1i/agent-atelier/issues/4)  
**Date:** 2026-07-21  
**Status:** Decision recorded (research + stub script; full snapshot not generated in this ticket)

## Context

Agent Atelier’s dual-track IA is locked: **milestone mainline** + **`/history` archive** + **in-chapter evolution asides**. Cognitive chapters stay milestone-shaped; the history track must support **full commit/PR lineage** browsing from origin → HEAD, and asides must deep-link into that lineage.

Specimen:

| Role | Location |
| --- | --- |
| Local clone (authoring extract) | `/Users/tushaokun/code/maka-agent` |
| Upstream | [`maka-agent/maka-agent`](https://github.com/maka-agent/maka-agent) (`main`) |
| Root commit | `8fd91a43cc64cdde58cfbd046256effce0cfa6f8` (*Scaffold Maka v0.1*) |
| Scale (2026-07-21) | ~2249 commits (~1740 first-parent); ~1022 merged PRs; `.git` ≈ 75 MB |

**Constraint:** atelier releases must **not** be coupled to maka-agent’s monorepo cadence. Shipping atelier never requires “catch up to maka HEAD today.”

---

## Recommendation (lean)

| Layer | Pick | Role |
| --- | --- | --- |
| **Runtime source of truth** | **Committed snapshot** under `data/maka-history/` | Static Astro build reads only atelier git; zero live GitHub / zero maka checkout at deploy |
| **Extract primary** | **`git log` / `git rev-list`** against a local clone | Complete, offline, deterministic commit DAG |
| **PR enrichment** | **`gh` GraphQL + REST** (offline job only) | Merged PR index + `associatedPullRequests` / `(#N)` subject parse |
| **Rebuild** | **`node scripts/maka-history-ingest.mjs`** (manual / optional CI PR) | Pins `sourceSha`; append-friendly NDJSON |
| **Cross-links** | Stable IDs `maka:commit:<sha>` / `maka:pr:<n>` | Asides + future `/history/...` routes (#8) |

**Do not:** git submodule maka as a runtime/deploy dependency; call GitHub at page-request time; vendor the maka working tree; store full patches in atelier.

---

## 1. Data model

Three artifacts, one pin. All paths relative to atelier repo root.

### `data/maka-history/meta.json`

```json
{
  "schemaVersion": 1,
  "source": {
    "owner": "maka-agent",
    "repo": "maka-agent",
    "defaultBranch": "main",
    "rootSha": "8fd91a43cc64cdde58cfbd046256effce0cfa6f8",
    "sourceSha": "<full sha of HEAD when extracted>",
    "sourceShort": "<7+ char>",
    "clonePathHint": "/Users/tushaokun/code/maka-agent"
  },
  "extractedAt": "2026-07-21T00:00:00.000Z",
  "counts": { "commits": 0, "prs": 0, "firstParent": 0 }
}
```

`sourceSha` is the **pin**. Atelier builds and deploys against this pin even if upstream has moved.

### `data/maka-history/commits.ndjson`

One JSON object per line (append-friendly diffs):

| Field | Notes |
| --- | --- |
| `sha` | Full 40-char |
| `short` | Abbrev (≥7, unambiguous at extract time) |
| `parents` | `string[]` (empty = root) |
| `subject` | First line |
| `body` | Optional; truncate at ~2 KiB if huge |
| `author` | `{ name, email, date }` ISO-8601 |
| `committer` | `{ name, email, date }` |
| `prNumbers` | `number[]` from subject `(#N)` **and** GraphQL association |
| `pathPrefixes` | Top-2 path segments touched (`packages/runtime`, `apps/desktop`, …), de-duped; **cap 40** per commit |
| `stats` | `{ files, additions, deletions }` from `git log --numstat` summary |

Omit file-level patch text. Link out to GitHub for diffs:

`https://github.com/maka-agent/maka-agent/commit/<sha>`

### `data/maka-history/prs.ndjson`

One merged PR per line (open PRs out of scope for v1 archive):

| Field | Notes |
| --- | --- |
| `number` | PR number |
| `title` | |
| `url` | Canonical GitHub URL |
| `author` | login |
| `mergedAt` | ISO-8601 |
| `baseRef` / `headRef` | |
| `mergeCommitSha` | When available |
| `commitShas` | Atelier-side join: commits whose `prNumbers` contain this number (filled at extract) |
| `labels` | names only |

### `data/maka-history/index.json`

Small lookup tables for asides and routing (regenerated each extract):

```json
{
  "shaToPrs": { "<fullsha>": [1298] },
  "prToShas": { "1298": ["<fullsha>", "..."] },
  "shortToSha": { "42461f2": "<fullsha>" }
}
```

**Size ballpark (current scale):** commits NDJSON ~0.6–1.5 MB with path prefixes + stats; PR NDJSON ~0.3–0.8 MB; index hundreds of KB. Fine in git; prefer NDJSON over one giant pretty-printed array so re-syncs stay reviewable.

---

## 2. Extract method

### Pipeline (build/author machine — not Astro `astro build`)

```
local maka clone ──git fetch──► origin/main
        │
        ├─ git rev-list --reverse <sourceSha>            (full DAG; root has no parent — avoid root^..)
        ├─ git log --format + --numstat / name-only       → commits.ndjson
        │
        ├─ parse subject (#N) + gh GraphQL associatedPullRequests (paged)
        ├─ gh api merged PR list (or GraphQL pagination)   → prs.ndjson
        │
        └─ join + write meta.json + index.json
```

**Env / flags (stub already accepts):**

| Input | Default |
| --- | --- |
| `MAKA_AGENT_REPO` | `/Users/tushaokun/code/maka-agent` |
| `--source-sha` | `HEAD` of that clone |
| `--out` | `data/maka-history` |
| `--skip-prs` | commits-only (offline / no `gh`) |

**Commit completeness:** store the **full DAG** (`parents`), not only first-parent. UI may *display* first-parent or PR-grouped views (#8); ingest must not throw away merge topology.

**PR association strategy (layered):**

1. Regex on subject: `\(#(\d+)\)` — already covers a large share of recent squash merges on `main`.
2. GraphQL `Commit.associatedPullRequests` over history pages — fills gaps (merge commits, atypical subjects).
3. Merged-PR catalog from GitHub — authoritative titles/authors/`mergedAt` even when a PR maps to multiple commits.

Do **not** rely on GraphQL alone without a local git pass: API pagination + rate limits are fine for a sync job, brittle as a build-blocking deploy step.

### Stub script

Skeleton: [`scripts/maka-history-ingest.mjs`](../../scripts/maka-history-ingest.mjs)

- Validates clone path + root sha.
- Writes `meta.json` + empty NDJSON placeholders when run with `--dry-meta` (or full extract when implemented).
- Documents the target schema; full extract can land in a follow-up execution ticket once #8 locks UX density needs (whether `pathPrefixes` / `stats` are mandatory for filters).

Suggested package script (add when wiring CI/docs):

```json
"history:ingest": "node scripts/maka-history-ingest.mjs"
```

---

## 3. Storage shape in atelier

```
data/maka-history/
  meta.json
  commits.ndjson
  prs.ndjson
  index.json
scripts/maka-history-ingest.mjs
```

**Astro consumption (later):** import/read these files at build time (content collection, `getStaticPaths`, or a thin `src/lib/maka-history.ts` loader). No runtime fetch. Prefer streaming NDJSON parse over bundling the whole file into the client; history pages can be static HTML or paginated SSG routes.

**Git hygiene:** commit the snapshot. Optional `.gitattributes` linguist-generated later if noise bothers diffs — not required now.

---

## 4. Rebuild cadence (decoupled from releases)

| Trigger | Action |
| --- | --- |
| Authoring need | Human/agent runs ingest when an aside needs a newer sha/PR than `meta.sourceSha` |
| Periodic hygiene | Optional weekly/manual sync → commit snapshot on a branch → review → merge |
| Atelier release / deploy | **Never** requires re-ingest; build uses last committed snapshot |
| Upstream force-push / rewrite | Re-run full extract; `schemaVersion` bump only if model changes |

**Lag is a feature:** cognitive asides can cite a known pin; history pages show “Archive pin: `sourceShort` · extractedAt” so readers know the snapshot boundary. Catch-up is a content/ops choice, not a release gate.

---

## 5. Cross-link IDs for milestone asides

Stable identifiers (store in MDX / frontmatter; independent of route bikesheds in #8):

| Kind | ID | Example |
| --- | --- | --- |
| Commit | `maka:commit:<fullsha>` | `maka:commit:42461f2b261da71ab2551a86d9c15bd64896d13c` |
| PR | `maka:pr:<number>` | `maka:pr:1298` |

**Resolution rules:**

1. Prefer full sha in stored content; `short` only for display / URL slugs after `index.shortToSha` resolve.
2. If both PR and commit are known, aside may cite **PR as primary** (narrative unit) and list member commits — ingest keeps both join directions.
3. Proposed URL targets for #8 (not locked here): `/history/c/<short>` and `/history/pr/<n>` → 404 if missing from snapshot (don’t silently hit live GitHub).
4. External fallback link (optional footnote): GitHub commit/PR URL — secondary to in-atelier history pages.

**Aside authoring sketch** (illustrative):

```mdx
<aside data-history="maka:pr:1298">
  Evolution: undici fetch alignment for proxy tests —
  see <a href="/history/pr/1298">PR #1298</a>.
</aside>
```

---

## 6. What NOT to do

| Anti-pattern | Why |
| --- | --- |
| **git submodule / subtree of maka as runtime dependency** | 75 MB+ `.git`, couples clone/CI/deploy to monorepo; atelier is a teaching site, not a maka workspace |
| **Live GitHub API in `astro build` or client** | Rate limits, flaky CI, non-reproducible builds, couples release to API availability |
| **Vendor maka source tree into atelier** | Wrong artifact; history needs metadata + links, not another copy of packages |
| **Store full diffs / blame in snapshot** | Size & churn explode; GitHub remains the patch viewer |
| **First-parent-only ingest** | Throws away topology; UI can filter, data layer must not |
| **Require pin == upstream HEAD to ship** | Violates the cadence-decoupling constraint |
| **Open / draft PRs in v1 archive** | Noise; cognitive asides cite landed lineage |

---

## 7. Alternatives considered

| Option | Verdict |
| --- | --- |
| A. Committed NDJSON snapshot + local `git`/`gh` sync job | **Adopt** |
| B. Submodule maka, read `.git` at build | Reject — deploy/CI coupling, huge checkout |
| C. Build-time clone shallow + API | Reject — network in critical path; shallow loses history |
| D. Client-side infinite scroll via GitHub API | Reject — not static, not rebuildable, ToS/rate risk |
| E. Mirror only PR list, skip commits | Reject — destination requires full commit lineage |

---

## Implementation checklist (follow-up, not this ticket)

1. Flesh out `scripts/maka-history-ingest.mjs` to emit real NDJSON + index (commits first, then PR join).  
2. Land initial snapshot under `data/maka-history/` in a dedicated sync commit.  
3. Add `src/lib/maka-history.ts` loader + smoke test (parse meta, resolve one known sha/PR).  
4. Lock presentation in [Lock history-track UX: timeline, filters, and cross-links](https://github.com/tt-a1i/agent-atelier/issues/8) against this model.  
5. Wire optional CI workflow that opens a sync PR (never blocks atelier deploy).

---

## Decision summary

**Ingest Maka lineage as a pinned, rebuildable snapshot in `data/maka-history/`** (NDJSON commits + PRs + join index), produced by a local `git` + offline `gh` sync script. Atelier builds only from that snapshot. Cross-links use `maka:commit:<sha>` / `maka:pr:<n>`. Reject submodule, live API, and release-time coupling to maka HEAD.
