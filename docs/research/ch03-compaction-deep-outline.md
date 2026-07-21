# §03 deep outline — Compaction as projection

**Ticket:** [#37](https://github.com/tt-a1i/agent-atelier/issues/37)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline (not a live-chapter rewrite)  
**Depth posture:** Even depth across all six chapters + cross-cutting cache (grilling [#35](https://github.com/tt-a1i/agent-atelier/issues/35))  
**Related:** [#36](https://github.com/tt-a1i/agent-atelier/issues/36) §02 prune · [#38](https://github.com/tt-a1i/agent-atelier/issues/38) cache/request-shape · [#39](https://github.com/tt-a1i/agent-atelier/issues/39) §01 spine

## Goal for the deepened chapter

After reading deepened §03, a reader can teach:

1. Why compaction is a **lossy projection** of the Runtime Events Log — not mutation, memory, or proof.  
2. The full `HistoryCompactCheckpoint` conceptual schema (identity / high water / coverage / projection / lineage).  
3. The ordered `buildPriorMessages` pipeline and why each step exists.  
4. Rolling successor rules; **never expand coverage on failure**.  
5. LLM as projection **value** generator vs Runtime as projection **authority** (with a worked example).  
6. How V1 block vs V2 ledger paths coexist without lying about Current.  
7. Where compaction intersects provider cache locality — and where teaching defers to [#38](https://github.com/tt-a1i/agent-atelier/issues/38).

Without opening `llm-compaction-events-log-projection-draft.zh-CN.md`.

## What stays from the current chapter

Keep: scene (two-hour session), keystone projection formula + SVG, three-layer slogan, high-water semantics (numbers as policy), rolling sketch, three compact kinds table, “not memory / not delete / not proof”, bilingual structure.

Replace / expand: coverage mentioned-but-not-schema → full schema teaching; collapsed pipeline → numbered prior-messages path; fail-open list → failure matrix with “no false coverage”; authority sentence → worked example; cache interaction absent → short pointer + one causal sentence; primary aside `772` → mechanism-first pins.

---

## Proposed section map (zh primary → EN same-ship)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `scene` | 从一个长期会话开始 | Keep; sharpen “continuation view ≠ delete facts” |
| `keystone` | Compaction 不是 mutation，而是 projection | Keep formula + SVG; caption must say *source log immutable* |
| `three-layers` | 三个不可互换的对象 | Keep; expand into schema-ready questions |
| `schema` **NEW** | HistoryCompactCheckpoint 概念 schema | Full field groups; digest ≠ content correctness |
| `pipeline` **NEW** | `buildPriorMessages` 投影流水线 | Numbered 1–10; stale prune before fold |
| `synthetic` **NEW** | Checkpoint 如何进入模型历史 | Synthetic RuntimeEvent; projection-only |
| `high-water` | High water 决定是否投影 | Keep semantics; deepen tail-selection edge cases |
| `llm-role` **NEW** | LLM 写摘要，Runtime 定权威 | Worked example: goal/done vs coverage claim |
| `rolling` | Rolling checkpoint | Keep; add CAS rewrite + durable-before-replace |
| `fail` **NEW** | Fail-open 与失败矩阵 | Never invent coverage; observable diagnostics |
| `v1-v2` **NEW** | V1 block vs V2 ledger | Compatibility honesty; reclaim-only cleanup |
| `kinds` | 三种 compact 边界 | Keep table; deepen failure/durability contrast |
| `cache-pointer` **NEW** (lean) | 折叠历史会改变 request shape | One paragraph + link to cache teaching plan |
| `invariants` **NEW** | 必须保护的十条不变量 | Numbered; exam-style |
| `asides` | 演进旁注 | Mechanism PRs first; docs-land secondary |

Outline slot in ChapterShell should stop claiming “硬闸门已过 = 深度完成”.

---

## Section specs

### 1. Three layers → schema questions (expand `three-layers`)

Keep the three-row table (Log / Checkpoint / Provider messages). Immediately ask the reader what a bare string summary cannot answer — then hand off to `schema`.

Must land lines:

- Checkpoint ≈ materialized view, not WAL truncation.  
- Summary text is content; **coverage** is eligibility to replace a prefix.

### 2. Full checkpoint conceptual schema (`schema` NEW)

Teach specimen field groups without freezing TypeScript as product API:

```text
HistoryCompactCheckpoint
  identity
    checkpointId, sessionId, createdAt
  high water
    highWaterName, highWaterSeq
  coverage
    eventCount, turnCount
    through { runId, turnId, runtimeEventId }
    sourceDigest          # SHA-256 of stable-serialized covered prefix
  projection
    summary, limitations, estimatedTokens
  lineage
    previousCheckpointId?
```

Teaching beats:

| Field group | What it proves | What it does **not** prove |
| --- | --- | --- |
| `coverage.through` + counts | Which ordered prefix is claimed | Summary completeness |
| `sourceDigest` | Same bytes of source events as when built | Natural-language accuracy |
| `lineage` | Legal successor / same-coverage CAS rewrite | That older raw events were deleted |
| `limitations` | Replay-time honesty to the model | Authority upgrade |

Prefix-match gate (`matchHistoryCompactCheckpointPrefix` mental model):

1. event count sufficient  
2. last `runId / turnId / runtimeEventId` matches  
3. digest exact  

Any miss → `coverage_miss` / `source_hash_mismatch` diagnostics; **no fuzzy reuse**.

Figure plan: **NEW CheckpointSchema** — five labeled boxes; digest arrow back to log prefix.

### 3. `buildPriorMessages` pipeline (`pipeline` NEW)

Numbered on page (specimen order; teach as protocol):

1. Exclude current `turnId` → prior Runtime context  
2. Prepare context-budget policy  
3. Load newest V2 checkpoint; V1 blocks only as fallback  
4. **Stale** oversized tool-result prune (pointer to §02; do not re-teach archive protocol)  
5. Compute high water + retained raw tail  
6. Validate checkpoint against source prefix (counts / through / digest)  
7. If fold needed → LLM rolling successor  
8. Materialize checkpoint as **synthetic** RuntimeEvent + uncovered raw suffix  
9. Optional history search / archive retrieval / synthesis cache  
10. Build provider replay plan → `ModelMessage[]`

Two landing truths:

- Compaction lives in **model-history projection**, not in the RuntimeEvent append path.  
- Checkpoint is not yet a provider message; it still passes replay planning + capability gates.

Figure plan: **NEW PriorMessagesPipeline** — vertical numbered steps; highlight step 4 (stale) vs step 7 (LLM) vs step 8 (synthetic).

Overlap note: steps 9–10 mention synthesis/archive — one sentence each; full archive/hydrate teaching stays in §02 / cost plan.

### 4. Synthetic RuntimeEvent (`synthetic` NEW)

Short, high leverage:

- Role/author presentation: typically `role=user`, `author=system` continuation envelope (teach intent, not dump XML).  
- Exists **only** in the current projection.  
- Must **not** be appended back as an original interaction event into the RuntimeEvent ledger.  
- Durable acceptance of a new V2 checkpoint is a separate `AgentRunEvent`: `history_compact_checkpoint_recorded` — projection accepted as an operational fact, not as covered source.

Contrast table:

| Object | Ledger | Meaning |
| --- | --- | --- |
| Covered RuntimeEvents | RuntimeEventStore | Canonical interaction facts |
| `history_compact_checkpoint_recorded` | AgentRunStore | System accepted this projection |
| Synthetic checkpoint event | Ephemeral projection | What the model sees this request |

### 5. High water + tail selection (expand `high-water`)

Keep trigger semantics; make policy numbers explicitly **not** protocol constants (defaults: history reserve, ratio, max checkpoint tokens, etc. — cite as Current defaults, env-overridable).

Edge cases that must appear:

- Tail selects whole Turns newest-first (do not split ordinary tool call/result pairs).  
- Giant newest Turn over budget → keep newest complete function call/response pair; else last event.  
- `minRecentTurns` is aspiration; **token cap wins**.

### 6. LLM vs Runtime authority (`llm-role` NEW) — worked example

**Scenario:** Prior events include a failed test run and a later successful re-run. Summarizer writes “tests are green.”

Teach:

| Actor | Allowed | Forbidden |
| --- | --- | --- |
| LLM summarizer | Produce Goal / Done / Decisions / Next / Critical Context text | Decide coverage, digest, durability, whether checkpoint may replace prefix |
| Runtime | Select fold prefix & tail; compute digest; durable-append gate; current-policy replay gate | Treat summary sentence as verifier/terminal authority |

Worked lines for the page:

1. Summary may say tests passed — still a **lossy view** of source events.  
2. Official pass/fail remains in tool results / verifier / terminal facts (§05).  
3. If digest mismatches, Runtime discards the checkpoint even if the prose looks right.

Figure plan: optional small swimlane **Summarizer vs Authority** (two columns).

### 7. Rolling + durable-before-replace (expand `rolling`)

Keep rolling formula:

```text
Checkpoint N+1 = S(Checkpoint N.summary, newly folded events)
coverage = full prefix [0..m]
previousCheckpointId = N
sourceDigest recomputed over full covered prefix
```

Must add:

- **Durable-before-replace:** candidate enters same-request provider view only after `history_compact_checkpoint_recorded` append succeeds.  
- Same-coverage rewrite requires explicit successor (`previousCheckpointId`) + identical digest/through/counts (CAS, not silent overwrite).  
- Bounded AgentRun projection update **after** canonical append; append fail ⇒ projection must not keep the candidate; projection fail ⇒ cold start recovers from ledgers.

### 8. Fail-open matrix (`fail` NEW)

Reader exam: “Rolling summarizer fails after newly evicted events exist — what happens?”

Answer pattern: reuse old matching checkpoint + as much raw Turn tail as fits; **do not** claim coverage over newly evicted events.

Condensed matrix (on page):

| Failure | Current behavior | Must not happen |
| --- | --- | --- |
| Below high water | No invented early summary | Premature unscoped summary |
| Empty LLM summary | No new checkpoint; first compact → safe raw tail + visible fail-open note | Empty projection as covered history |
| Rolling summarizer fail | Reuse old checkpoint if still valid; append fittable raw Turns | Old summary claims new events |
| Durable append fail | Discard candidate; fallback | Undurable projection in model then “recoverable” claim |
| Prefix / digest mismatch | Reject checkpoint | Approximate match |
| Over current budget | Skip replay of that checkpoint | Bypass because “it worked yesterday” |
| Bounded projection corrupt | Rescan AgentRun ledgers; repair best-effort | Cache as sole truth |
| User abort manual compact | Abort summarizer/write; no next-Turn poison | Late write reuses abort state |

Keystone line:

> Fail open to a **safe source-derived** context, not to an invented summary.

Figure plan: **NEW CompactionFailureMatrix** (table OK if readable).

### 9. V1 vs V2 (`v1-v2` NEW)

| | V1 `HistoryCompactBlock` | V2 `HistoryCompactCheckpoint` |
| --- | --- | --- |
| Provenance style | Per-event `sourceRefs` (+ artifacts) | Prefix metadata + digest over ledger |
| Size behavior | Can grow with event count (MB-class) | Bounded checkpoint identity |
| Current role | Read-only compatibility fallback | Preferred main path |
| Cleanup | Reclaim when V2 covers same prefix | N/A |

Honesty: reclaim-only cleanup failures must not break replay.

### 10. Three compact kinds (expand `kinds`)

Keep site table; deepen **failure / durability** column:

| Mechanism | Durable acceptance | Fail-open posture |
| --- | --- | --- |
| History LLM compaction | Must durable-append before accepted replacement | Safe raw/old checkpoint; no false coverage |
| Active tool-result prune (§02) | Archive before placeholder; ledger untouched | Keep full provider message |
| `semanticCompact` | Best-effort diagnostic block; invocation-local accept | Signed savings / cache miss are diagnostics, not hard reject; head/protocol gates are hard |

Do not collapse all three into “summary.” Point mid-turn / capacity PRs to asides.

### 11. Cache / request-shape pointer (`cache-pointer` NEW, lean)

One short section — **do not** duplicate [#38](https://github.com/tt-a1i/agent-atelier/issues/38):

- Folding / replacing a history prefix changes `historyProjectionHash` → often `requestShapeChangeReason = history_projection_changed` while `prefixHash` may stay stable.  
- Shorter history ≠ cheaper if cache miss rises.  
- Full attribution ladder, `prefixHash` non-goals, tool-schema economy → cache teaching plan.

### 12. Ten invariants (`invariants` NEW)

Mirror specimen (atelier wording OK):

1. Source immutability  
2. Projection coverage (ordered prefix + through + digest)  
3. No durability, no replacement  
4. Monotonic high water (or explicit same-coverage successor)  
5. Current-policy validation on every replay  
6. Raw recent tail within budget  
7. No false coverage on rolling failure  
8. Projection rebuildable from canonical ledgers  
9. Failure observable in diagnostics  
10. Authority preserved (summary ≠ verifier/terminal upgrade)

These become the chapter’s “can you recite?” checklist.

---

## Diagram plan

| Figure | Action |
| --- | --- |
| CompactionProjectionKeystone | Keep; tighten caption (immutable log) |
| HighWaterCompactFlow | Keep; annotate policy-not-protocol |
| RollingCheckpointFlow | Keep; add durable-append gate diamond |
| CompactKindsFlow | Keep; caption durability contrast |
| **NEW CheckpointSchema** | Field groups + digest loop |
| **NEW PriorMessagesPipeline** | Numbered 1–10 with stale/LLM/synthetic callouts |
| **NEW CompactionFailureMatrix** | Protocol failures |
| **Optional SummarizerAuthority** | Two-column worked example |

Reduced-motion: keep DiagramFigure discipline.

---

## History asides (mechanism-first)

Prefer **one primary** aside; secondary links in outline/footer OK.

| Pin | Why |
| --- | --- |
| `maka:pr:729` | Replace history compact artifacts with **ledger checkpoints** (V2 mechanism) |
| `maka:pr:955` | Bind checkpoints to **source coverage** |
| `maka:pr:40` / `maka:pr:43` | Deterministic replay + host persistence foundation (optional deeper pin) |
| `maka:pr:575` | Manual `/compact` wired to LLM summarizer |
| `maka:pr:1090` | Align history compaction with replay capacity |
| `maka:pr:1017` | Reactive context-overflow compact-and-retry (advanced) |
| `maka:pr:772` | Docs land — **secondary**, not the only pin |

Replace today’s sole primary `772` aside.

---

## Overlap with cache / request-shape (#38) — avoid double-teaching

| Topic | Lives in §03 | Lives in #38 plan |
| --- | --- | --- |
| Folding changes history projection | Causal one-liner + pointer | Full durable-prefix vs shape teaching |
| `prefixHash` / component hashes | Mention names only | Full diagnostics model |
| Usage cache hit/miss/write | Optional footnote | Primary |
| Tool schema / `load_tools` | Out of scope | Primary |
| Fail-open never invents summary | Full matrix | Cost fail-open “never delete facts” |

---

## Current vs Target labeling rules for the rewrite ticket

- V2 ledger checkpoint path = Current preferred.  
- V1 artifact blocks = compatibility fallback, not “legacy we pretend gone.”  
- Default token thresholds = policy knobs.  
- Summary quality gate / summarizer identity in manifest = Target/future (specimen “代价与边界”); do not fake-ship.  
- Unified “all LLM compacts share identical durable coverage contract” for semanticCompact = Target direction, not Current.

---

## EN parity notes

- Same section `#id`s.  
- Keep English key lines: *compaction is the Events Log's projection.*; *Fail open to a safe source-derived context.*; *LLM generates value; Runtime owns authority.*  
- Event type names (`history_compact_checkpoint_recorded`, reason codes) stay English in both locales.

---

## Out of scope for the §03 rewrite ticket (follow-ons)

- Full cache / `prefixHash` teaching → #38  
- Active prune archive protocol → #36 / §02  
- Runtime spine / terminal race → #39 / §01  
- Implementing Target summary-quality gates in Maka (atelier teaches; does not ship Maka)

---

## Suggested implementation ticket (after outline acceptance)

`Task: Deepen §03 narrative + pipeline/schema figures (zh→en same-ship)`

Acceptance:

1. Sections above present (schema + pipeline + failure matrix + LLM/Runtime example required).  
2. Reader quiz: can explain rolling fail-open without specimen.  
3. Primary aside is a mechanism PR (`729`/`955` class).  
4. Cache content limited to pointer section (no fake seventh chapter inside §03).  
5. Structure checklist still green (a11y, bilingual, reduced-motion).

---

## Code map (for writers; optional footnote on page)

1. `packages/runtime/src/ai-sdk-backend.ts` — `buildPriorMessages` orchestration  
2. `packages/runtime/src/context-budget.ts` / `context-budget-policy.ts` — high water, tail, replay gate  
3. `packages/runtime/src/history-compact-checkpoint.ts` — schema, digest, synthetic event  
4. `packages/runtime/src/history-compact-summarizer.ts` — rolling LLM input  
5. `packages/runtime/src/history-compact-ledger.ts` — bounded projection + recovery selection  
6. `packages/runtime/src/agent-run.ts` — `history_compact_checkpoint_recorded`  
7. `packages/runtime/src/history-compact-artifacts.ts` — V1 compatibility  
8. `packages/runtime/src/compaction-boundary.ts` — cross-kind boundary diagnostics  
9. `packages/storage/src/agent-run-store.ts` — append-then-projection order  

Tests: `history-compact-checkpoint.test.ts`, `history-compact-summarizer.test.ts`, `context-budget.test.ts`, `ai-sdk-backend.test.ts` (replacement / fail-open / V1 fallback).

---

## Open questions (do not block outline)

1. How large should `semanticCompact` grow inside §03 vs a later attention-shaping aside? **Recommend:** keep contrast table + one durability paragraph; mid-turn details in asides (`996`/`1017`).  
2. Should pipeline figure include synthesis cache boxes? **Recommend:** dashed optional step, not full hydrate teaching.  
3. Map Decision for cache home (#38) — §03 only needs the lean pointer regardless of final home.
