# §02 deep outline — Active prune + evidence layers

**Ticket:** [#36](https://github.com/tt-a1i/agent-atelier/issues/36)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline (not a live-chapter rewrite)  
**Working assumption:** Runtime-first depth order (grilling [#35](https://github.com/tt-a1i/agent-atelier/issues/35) still open)

## Goal for the deepened chapter

After reading deepened §02, a reader can teach:

1. Why one Tool Result needs four representations.  
2. What ToolRuntime protects (and what synthetic error results mean).  
3. The difference between **active** and **stale** prune.  
4. The archive-before-placeholder protocol and fail-open matrix.  
5. Current heavy-task compact evidence vs Target TurnEvidence (visibility × authority).  
6. Which invariants must never break when chasing tokens.

Without opening `turn-evidence-tools-active-prune-draft.zh-CN.md`.

## What stays from the current chapter

Keep: scene (80k log), four-reps keystone slogan, Current vs Target stub honesty, bilingual structure.

Replace / expand: “Active prune 只改 Provider messages” single section → full protocol teaching. Add ToolRuntime, stale prune, failure matrix, observability, mechanism asides.

---

## Proposed section map (zh primary → EN same-ship)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `scene` | 从一份巨大的测试日志开始 | Keep; sharpen four simultaneous needs |
| `keystone` | Turn 内的证据流水线 | Keep keystone SVG; caption must say *rewrite path 05 only* |
| `four` | 一个 Tool Result，四种表示 | Expand lifecycle × authority table (not just bullets) |
| `tool-runtime` **NEW** | ToolRuntime 是副作用边界 | 11-step mental model condensed to 6 teachable beats |
| `layers` **NEW** | output / result / artifact 不是同一件事 | Kill common conflation |
| `turn` | 为什么 Turn 是 Evidence 边界 | Keep; add “what Evidence must answer” checklist |
| `active` | Active prune：同 Turn 的 request shaping | Protocol steps + placeholder fields |
| `stale` **NEW** | Stale prune：旧历史的另一条策略 | Contrast table vs active |
| `fail` **NEW** | Fail-open 与失败矩阵 | Correctness > savings |
| `compact-current` **NEW** | Current：Heavy-task compact evidence | What exists today without pretending universal |
| `target-envelope` | Target：TurnEvidence envelope | visibility × authority; source-bearing |
| `invariants` **NEW** | 必须保护的七条不变量 | Numbered; exam-style |
| `observe` **NEW** (optional lean) | 可观测：为什么 request 变小了 | `activePrunedToolResults` / archive failures / tokens saved |
| `asides` | 演进旁注 | Mechanism PRs first; docs-land secondary |

Outline slot in ChapterShell should stop claiming “硬闸门已过 = 深度完成”.

---

## Section specs

### 1. Four representations (expand)

Teach as a table the specimen already has:

| 表示 | 问题 | 权威 | 生命周期 |
| --- | --- | --- | --- |
| Canonical Runtime Fact | 调用/返回了什么 | 交互语义事实 | Durable ledger |
| Raw Artifact | 原文在哪、可否校验 | 原始载荷 | 独立存储 + hash |
| Turn Evidence | 哪些公开观察值得继续消费 | Source-bearing 派生 | Bounded / rebuildable |
| Model Working Context | 下一步最少要看什么 | 临时投影 | 每次 request 重算 |

**Must land line:** Evidence compression 可改变看见方式，不能改变是否发生过。

### 2. ToolRuntime (new)

Condense specimen sequence into teachable beats:

1. Persist `tool_call` / emit start  
2. Guards (loop / availability / concurrency)  
3. Permission evaluate (allow / block / prompt)  
4. Execute `impl` with abort + output deltas  
5. Normalize + persist `tool_result` (pairing)  
6. Best-effort artifact derive (must not mutate result on recorder fail)

**Critical teaching:** guard/permission failures still produce **synthetic error tool results** — no silent unpaired call.

Figure plan: reuse/adapt specimen sequence as atelier SVG (ToolRuntime swimlane). Existing chapter has no ToolRuntime figure — **add**.

### 3. output ≠ result ≠ artifact (new)

Short section, high leverage:

- output delta = streaming progress  
- tool result = structured fact for next model step  
- artifact = independently stored payload / diff / redirect file  

Prevents readers from thinking prune “deletes the tool output.”

### 4. Active prune protocol (rewrite of current `current` section)

Title clarity: *provider request shaping policy, not data retention.*

Protocol (must be numbered on page):

1. Eligible: current Turn completed steps; over estimated-token threshold (default ~2048; **policy not protocol constant**)  
2. Stable-serialize → `bodySha256` / bytes / estimate  
3. Host archive writer must return non-empty `artifactId`  
4. Only then build placeholder  
5. Replace **only** in this `prepareStep` messages view  
6. Ledger / Session persisted result untouched  

Placeholder fields to name on page:

```text
artifactId, turnId, toolCallId, toolName,
bodySha256, originalEstimatedTokens, originalBytes,
rewriteVersion,
reason = active_current_turn_tool_result_pruned_before_next_step
```

**Not:** summarize business meaning; delete ledger; claim placeholder == full evidence.

Figure plan: extend `ActivePruneFlow` with **Archive succeeds? → placeholder : keep original** diamond (specimen mermaid). Current flow is too linear.

### 5. Stale prune (new)

Contrast table:

| | Active | Stale |
| --- | --- | --- |
| When | Same Turn, between steps (`prepareStep`) | Prior-history materialization |
| Target | Just-produced large results | Old oversized tool results in replay |
| Risk if confused | Rewrite history mid-Turn incorrectly | Miss current-Turn pressure |

Mention default-on evolution (`maka:pr:621`) in aside, not as main prose history.

### 6. Fail-open + failure matrix (new)

Reader exam: “archive fails — what happens?” Answer: keep full provider message.

Include condensed matrix rows:

- Permission denied → synthetic error result  
- Tool throws → normalized error + telemetry  
- Artifact derive fails → warning; result continues  
- Active archive fails → keep full message  
- Placeholder corrupt on hydrate → explicit failure, never fake raw  
- Mid-tool process stop → no synthetic success evidence  

Figure plan: small failure-matrix figure or styled table (table OK if readable; not a dashboard).

### 7. Current compact evidence vs Target envelope

**Current (honest):** `heavy-task-evidence` — Bash/Read/Write bounds, omit non-public/verifier, recent window (~8), truncation metadata. Task/attempt-scoped identity; not universal Runtime TurnEvidence.

**Target:** `TurnEvidenceEnvelope` concepts — `source`, `visibility`, `authority`, `integrity` — without freezing TS as product API. Emphasize: projection not proof chain; model must not author authority.

### 8. Seven invariants (new, closing spine)

1. Prune projection, never ledger  
2. Archive before omission  
3. Failure keeps evidence  
4. Evidence must name its source  
5. Tool call/result pairing remains valid  
6. Authority never leaks into visibility  
7. Rewrites are idempotent and diagnosable  

These become the chapter’s “can you recite?” checklist.

### 9. Observability (optional lean)

Name diagnostics:

```text
activePrunedToolResults
activeArchiveFailures
activeEstimatedTokensSaved
```

Purpose: explain *why* a request got smaller — not a substitute for correctness tests. Pointer to cache/request-shape ticket (#38) for miss attribution.

---

## Diagram plan

| Figure | Action |
| --- | --- |
| EvidencePipelineKeystone | Keep; tighten caption (05 rewrite-only) |
| FourRepsFlow | Keep; add authority/lifecycle footnotes in caption or adjacent table |
| ActivePruneFlow | **Extend** with archive fail-open diamond |
| SourceChainFlow | Keep; ensure Target linkage honesty |
| **NEW ToolRuntimeSwimlane** | Produce → guards → permission → impl → result → async artifact |
| **NEW ActiveVsStale** | Two-column contrast |
| **NEW FailureMatrix** (or HTML table) | Protocol failures |

Reduced-motion: keep existing DiagramFigure discipline.

---

## History asides (mechanism-first)

Prefer **one primary** aside (budget) pinning the introduction + archive discipline; secondary links in outline/footer OK.

| Pin | Why |
| --- | --- |
| `maka:pr:316` | Add active tool result pruning (mechanism intro) |
| `maka:pr:319` / commit “require archived active tool pruning” | Archive-before-placeholder / fail discipline |
| `maka:pr:498` | Default-on desktop+headless |
| `maka:pr:621` | Stale prune default-on |
| `maka:pr:1077` | Newest-step / mid-turn capacity interaction (advanced) |
| `maka:pr:769` | Docs land — **secondary**, not the only pin |

Replace today’s sole `769` aside as primary.

---

## Current vs Target labeling rules for the rewrite ticket

- Never say “TurnEvidence is fully landed.”  
- Active prune + RuntimeEvent + ArtifactStore + heavy-task compact evidence = Current building blocks.  
- Unified Turn-scoped envelope + complete source linkage = Target.  
- Default token thresholds = policy knobs, not protocol constants.

---

## EN parity notes

- Same section `#id`s.  
- Keep English key lines: *Prune the context, never prune the evidence.*; *Archive before omission.*; *Fail open.*  
- Placeholder `reason` enum stays English code in both locales.

---

## Out of scope for the §02 rewrite ticket (follow-ons)

- Full cache / `prefixHash` teaching → #38  
- History LLM compaction pipeline → #37  
- Self-check authority deep dive → later after Runtime-first  
- Implementing Target TurnEvidence in Maka (atelier teaches; does not ship Maka)

---

## Suggested implementation ticket (after outline acceptance)

`Task: Deepen §02 narrative + protocol figures (zh→en same-ship)`  

Acceptance:

1. Sections above present (stale + fail matrix + ToolRuntime required).  
2. Reader quiz (internal): can explain archive fail-open without specimen.  
3. Primary aside is a mechanism PR.  
4. No fake “depth done” chrome until map depth bar met.  
5. Structure checklist still green (a11y, bilingual, reduced-motion).

---

## Code map (for writers; optional footnote on page)

Point curious readers (not required for first viewport):

1. `packages/runtime/src/tool-runtime.ts`  
2. `packages/runtime/src/active-tool-result-prune.ts`  
3. `packages/runtime/src/ai-sdk-backend.ts` (`prepareStep` wiring)  
4. `packages/runtime/src/context-budget-policy.ts`  
5. `apps/desktop/src/main/tool-result-archive-artifacts.ts`  
6. `packages/headless/src/heavy-task-evidence.ts`  

Tests: `active-tool-result-prune.test.ts`, archive artifact tests.

---

## Open questions (do not block outline)

1. How much ToolRuntime permission detail belongs in §02 vs §01 spine (#39)? **Recommend:** §02 keeps synthetic-result + pairing; §01 owns permission-as-action worldview.  
2. Mid-turn capacity / newest-step (`#1077`) — main prose or advanced aside? **Recommend:** aside + one sentence under active prune.  
3. Grilling #35 if chooses even-depth — still ship this outline; only reprioritize rewrite scheduling.
