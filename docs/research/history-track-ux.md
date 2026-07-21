# History-track UX: timeline, filters, and cross-links

**Ticket:** [Lock history-track UX: timeline, filters, and cross-links](https://github.com/tt-a1i/agent-atelier/issues/8)  
**Date:** 2026-07-21  
**Status:** Decision recorded  
**Depends on:** [Define Maka history ingest…](https://github.com/tt-a1i/agent-atelier/issues/4) → `docs/research/maka-history-ingest.md`

## Context

Destination: dual track = **milestone mainline** + **`/history` full lineage** + **in-chapter evolution asides**. Cognitive narrative must stay milestone-shaped; history must be complete and cross-linkable without drowning readers in CI/refactor noise. Ingest already stores the full commit DAG + PR join under a pin — UX chooses *presentation*, not *data completeness*.

Human Q1 (default timeline density): accepted recommendation **C PR-first**, with advanced toggles A/B. Remaining axes decided from Destination (“围绕目标你来推荐”).

---

## Decision package

### 1. Default timeline = PR-first (C)

| Mode | Role | Approx. rows |
| --- | --- | --- |
| **Default: PR-first** | Primary teaching view — each merged PR is one row; member commits nest (collapsed by default) | ~1022 |
| **Advanced: first-parent (A)** | Cleaner `main` skim for “what landed on mainline” | ~1740 |
| **Advanced: full DAG (B)** | Expert/debug — every commit + parents | ~2249 |

**Default sort:** newest `mergedAt` (PR mode) / newest committer date (A/B) at top; archive pin shown in chrome (`meta.sourceShort` · `extractedAt`).

**Orphan commits** (no PR association): still reachable in A/B; in PR-first they appear in a trailing “Unlinked commits” bucket (collapsed), never silently dropped.

**Routes (locked):**

| Target | Path |
| --- | --- |
| Archive index | `/history` |
| PR detail | `/history/pr/<n>` |
| Commit detail | `/history/c/<short>` |

IDs remain `maka:pr:<n>` / `maka:commit:<fullsha>` (ingest). Short sha in URL resolves via `index.shortToSha`; unknown → atelier 404 (no live GitHub fallback as primary).

---

### 2. Filters (lean, path-prefix grounded)

Filters apply to the **active mode’s rows** (PR rows inherit union of member commits’ prefixes).

| Filter | Source | Notes |
| --- | --- | --- |
| **Package / area** | `pathPrefixes` → top packages (`packages/runtime`, `apps/desktop`, …) | Multi-select OR within area; empty = all |
| **Author** | PR author login (PR mode) / commit author (A/B) | Typeahead; not a wall of avatars |
| **Time range** | `mergedAt` / commit date | Presets: 30d / 90d / year / all + optional custom |
| **Search** | Title / subject substring | Client or SSG-chunk; no fuzzy dependency required for v1 |

**Do not ship as default chrome:** GitHub label clouds, reaction counts, CI status, file-level path trees. Labels may show on PR detail only.

Filter state may live in URL query (`?area=packages/runtime&q=…`) so asides and share links can deep-link a filtered index.

---

### 3. Density rules

**Index (`/history`):**

- One composition: chronological list, not a dashboard of cards/stat strips.
- PR row: `#N · title · author · mergedAt · area chips (≤3)`.
- Nested commits: hidden until expand; show `short · subject` only.
- Pagination or virtualized window: **~50 rows / page** (or equivalent scroll window) — perfect quality ≠ infinite unpaginated wall.
- Pin banner once at top; no sticky filter bar thicker than one line of controls.

**Detail (`/history/pr/N`, `/history/c/short`):**

- Report-page chrome (NewsLiquid): title, metadata hairline, member commit list, outbound GitHub for patches.
- No full diff embed in atelier (ingest policy); GitHub is the patch viewer.

**Motion:** list reveals may use existing site motion policy later; history is content-first — no decorative timeline gizmos.

---

### 4. Chapter aside cross-link pattern

**Goal:** evolution asides enrich a milestone without becoming a second TOC.

| Rule | Spec |
| --- | --- |
| **Placement** | Inline `<aside>` (or MDX component) adjacent to the claim they evidence — not a chapter-end dump |
| **Budget** | **≤3 asides per chapter section**; **≤8 per full chapter** unless a dedicated “Evolution” subsection is justified |
| **Primary cite** | Prefer **`maka:pr:<n>`** (narrative unit). Add commit only when the teaching point is commit-specific |
| **Visible pattern** | One short sentence + one in-atelier link (`/history/pr/N` or `/history/c/short`). Optional secondary “on GitHub” |
| **Tone** | Caption / footnote energy — never a competing H2 |
| **Missing pin** | If cited ID absent from snapshot, build warning in authoring; published page shows “not in archive pin” + no fake row |

**Illustrative MDX:**

```mdx
<aside data-history="maka:pr:1298">
  演进：proxy 测试与 undici fetch 对齐 —
  <a href="/history/pr/1298">PR #1298</a>。
</aside>
```

Cognitive track stays milestone-shaped; asides are **pointers into `/history`**, not inline commit logs.

---

### 5. What NOT to do

| Anti-pattern | Why |
| --- | --- |
| Default = full commit dump | Drowns “发展链路”; Destination wants teachable archive |
| Cards / stat strips / heatmap hero on `/history` | Dashboard chrome fights NewsLiquid report |
| Asides listing >3 PRs in one block | Turns chapters into changelogs |
| Live GitHub as the in-page timeline | Breaks pin/rebuild story from #4 |
| History as cognitive TOC | Out of scope per map #1 |

---

## Decision summary

**Default `/history` = PR-first timeline** with nested commits; advanced toggles for first-parent and full DAG. Filters: area (path prefix), author, time, search — query-serializable. Density: paginated/windowed list, collapsed nests, detail pages without embedded diffs. Chapter asides: sparse, PR-primary, link into `/history/pr|c/…`, hard budgets so milestones stay readable.
