# Maka code-seam inventory (atelier depth map)

**Date:** 2026-07-22  
**Specimen root:** `/Users/tushaokun/code/maka-agent` @ `f9e78d17`  
**Map:** [#92](https://github.com/tt-a1i/agent-atelier/issues/92) (dig v5; precursors [#91](https://github.com/tt-a1i/agent-atelier/issues/91) · [#90](https://github.com/tt-a1i/agent-atelier/issues/90) · [#34](https://github.com/tt-a1i/agent-atelier/issues/34))  
**Companion:** [`maka-corpus-mine-plan.md`](./maka-corpus-mine-plan.md) — corpus classification + priority queue. **This file** goes one layer deeper: Top 15 seams ranked from **source + tests** (docs secondary). Dig v5 adds Swarm Mode / template seams that did not exist at dig v4 HEAD.

## Method

For each seam: read primary `.ts`, paired `__tests__`, and cross-check `docs/architecture/*` / `docs/archive/*` / current contracts. When docs disagree with implementation, **code + contract tests win** (maka `docs/README.md`). PR numbers from `git log --diff-filter=A` / `-S` on the owning paths — not invented from CHANGELOG prose alone.

---

## Top 15 ranked seams

### 1. T1/T2 + RecoveryResolver triad

| | |
| --- | --- |
| **Home** | §01 `#recovery` (deepen) |
| **Atelier depth (pre this pass)** | thin→partial (Phase0/1 layers present; T1/T2 commit boundary under-taught) |
| **Code** | `packages/runtime/src/tool-runtime.ts` (`prepareDurableToolAttempt`) · `runtime-commit-sink.ts` · `recovery-resolver.ts` · `packages/storage/src/sqlite-runtime-store.ts` (T1/T2 + journal projection) · `@maka/core` `TOOL_BOUNDARY_PROTOCOL_V1` |
| **Tests** | `recovery-resolver.test.ts` · `tool-runtime-durable-boundary.test.ts` · `tool-runtime-sqlite-boundary.test.ts` · `sqlite-runtime-crash.test.ts` |
| **Docs** | `docs/architecture/runtime-recovery-resolver-adr.zh-CN.md` · archive Phase0/1 contracts · tool-journal draft |
| **Mechanism PR** | **#1223** (safe-boundary phases 0–2; adds resolver + sink wiring) |

**Protocol (invariants / failures)**

- T1 = atomic `commitToolPrepared`: provider-visible `function_call` (if needed) + non-model-visible `actions.toolDispatch` (`protocol: t1_after_preflight_v1`) + journal/`tool_operations` projection `prepared`. T1 failure → **zero** `impl` calls (`RuntimeCommitBoundaryError` phase `T1` rethrown — runtime fault, not synthetic tool result).
- T2 = `commitToolOutcome` with SQLite compare-and-set (`WHERE current_state='prepared' AND result_event_id IS NULL`); order pinned by test: `t1 → impl → t2 → published-result`.
- RecoveryResolver is sole judgment authority over RuntimeEvent prefixes; Journal is rebuildable projection only.
- Decision statuses: `completed` · `definitely_not_dispatched` (new protocol, call, no dispatch) · `indeterminate` (dispatch w/o response, or legacy missing facts) · `corruption` (orphan/duplicate/identity/protocol_marker_invalid).
- Protocol marker only on run’s **first** canonical event, and only when host wired a real `RuntimeCommitSink` — never inferred from “SQLite exists” or software version.
- Crash harness (`inside_t1` / `after_effect` / `inside_t2` / `after_t2`): kill inside T1 → full rollback; after T1 → unsettled `prepared` (= Resolver `indeterminate`); inside T2 → T1 survives, still `prepared`; after T2 → `outcome_committed`.

---

### 2. Active prune vs Stale prune vs History compact (three lifecycles)

| | Active prune | Stale prune | History compact |
| --- | --- | --- | --- |
| **File** | `active-tool-result-prune.ts` | `tool-result-archive.ts` (`pruneStaleToolResultsBeforeCompact`) | `history-compact*.ts` (+ mid-turn variant) |
| **When** | Same live Turn, `prepareStep` | Just before a compact pass | Turn-boundary / mid-turn projection rewrite |
| **Mutates** | In-memory ModelMessage[] only | Compact **input projection** (not durable ledger authority) | Model-visible projection via checkpoint block |
| **Placeholder** | `maka.active_archived_tool_result` | `maka.archived_tool_result` | `maka.history_compact_checkpoint` |
| **Protect** | `minStepNumber` (default 1) | `minRecentTurnsFull` newest turns | `reserveTailEvents` / safe span |
| **Fail** | `archiveFailures` → **keep original** | mismatched `archiveRef` → keep + count failures | fail-open (`no_safe_completed_span` / summarizer_failed) |

| | |
| --- | --- |
| **Home** | §02 (triad teach) + lean §03 for compact body |
| **Depth** | active **deep**; stale/history as *third lifecycle* was thin |
| **Tests** | `active-tool-result-prune.test.ts` · `active-full-compact*.test.ts` · history-compact* · context-budget-*policy* |
| **Docs** | turn-evidence active-prune draft · llm-compaction projection draft |
| **PRs** | Active **#316** / discipline **#319** / default-on **#498**; archive split **#1237**; compact checkpoints **#729** |

**Extra invariant:** `activeToolResultLineageIdentity()` hashes **raw** serialized body so prune is a representation change, not a divergent lineage for later stale/compact tracking. Stale hydrate re-checks `sha256(serialized) === placeholder.bodySha256` → `corrupt` on mismatch.

---

### 3. Checkpoint V2 prefix digest + mid_turn headAnchor

| | |
| --- | --- |
| **Home** | §03 |
| **Code** | `history-compact-checkpoint.ts` — `sourceDigest`, `phase: pre_turn\|mid_turn`, `headAnchor`, `matchHistoryCompactCheckpointPrefix`, `canReplaceHistoryCompactCheckpoint` |
| **Tests** | `history-compact-checkpoint.test.ts` · `history-compact-mid-turn-checkpoint.test.ts` |
| **Docs** | `docs/execution-evidence-spine.md` Phase 2C |
| **PRs** | **#729** checkpoint V2; **#996** / **#1014** mid_turn + headAnchor |
| **Depth** | **shipped** §03 `#mid-turn` CN+EN · outline `checkpoint-v2-mid-turn-headanchor-deep-outline.md` · [#65](https://github.com/tt-a1i/agent-atelier/issues/65) |

Fail-closed: empty/mixed-session/partial coverage; head anchor not last covered user event of its turn; replace only forward-progress or exact CAS rewrite.

---

### 4. Mid-turn capacity: shaping ≠ verdict

| | |
| --- | --- |
| **Home** | §03 companion (+ lean §01 request-shape) |
| **Code** | `mid-turn-capacity-compact.ts` (doc-comment is primary authority — **no architecture draft**) |
| **Tests** | `mid-turn-capacity-compact.test.ts` · `mid-turn-capacity-backend.test.ts` |
| **PR** | **#996** (title names the invariant); reactive **#1017** |
| **Depth** | **shipped** §03 `#capacity-shaping` CN+EN · outline `mid-turn-capacity-shaping-deep-outline.md` · [#66](https://github.com/tt-a1i/agent-atelier/issues/66) |

Shaper only selects safe covered prefix + builds mid_turn checkpoint (fail-open). **Pass/terminate** (`context_budget_exhausted`) owned by backend final-request estimate after all shaping hooks — verdict is about the request that actually goes out.

---

### 5. providerTools ≠ activeTools (request-shape)

| | |
| --- | --- |
| **Home** | §01 `#request-shape` / `#tool-economy` |
| **Code** | `request-shape.ts` (`canonicalizeToolSet`) · `tool-availability.ts` |
| **Tests** | `request-shape.test.ts` · tool-availability / catalog derive |
| **Depth** | **shipped** §01 `#tool-economy` deepen CN+EN · outline `provider-tools-vs-active-tools-deep-outline.md` · [#67](https://github.com/tt-a1i/agent-atelier/issues/67) |

Dispatch never depends on advertisement visibility. `toolSchemaHash` over **active/visible** subset so unloaded group schema drift does not false-fire `tool_schema_changed`.

---

### 6–15 (shorter)

| Rank | Seam | Home | Key paths | Depth |
| ---: | --- | --- | --- | --- |
| — | ContextBudgetPolicy two-plane DSL | §03 `#budget-dsl` | `context-budget*.ts` · `composePrepareStep` | **shipped** · outline `context-budget-policy-pipeline-deep-outline.md` · [#74](https://github.com/tt-a1i/agent-atelier/issues/74) |
| — | Semantic compact failedOpen / privacy / savings | §03 `#semantic-gates` | `semantic-compact.ts` | **shipped** · outline `semantic-compact-gates-deep-outline.md` · [#75](https://github.com/tt-a1i/agent-atelier/issues/75) |
| — | Permission park/remember vs escalation one-shot | §01 `#park-remember` | `permission-engine.ts` · `sandbox-escalation.ts` | **shipped** · outline `permission-park-remember-escalation-deep-outline.md` · [#76](https://github.com/tt-a1i/agent-atelier/issues/76) |
| 6 | Sandbox PermissionProfile↔Seatbelt/bwrap + diagnostics | §01 `#sandbox` · `#sandbox-diagnostics` | `permission-profile.ts` · `sandbox/**` · `diagnostics.ts` · `errors.ts` · `system-prompt/sandbox-context-prompt.ts` | **deep** dig v4/#91 — dig v5 spot-check OK (prompt path under `system-prompt/`) |
| 7 | Session task ledger ≠ TaskRun | §04 identity | `task-ledger.ts` · `session-task-ledger-lifecycle.md` | **shipped** `#ledger` |
| 8 | Execution evidence spine | §01 `#execution-evidence` (+ cross-cut §02/04/05/06) | `execution-evidence.ts` · `execution-evidence-spine.md` | **deep** dig v3; dig v4 spot-check OK |
| 9 | MCP runtime | companion | `mcp-tools.ts` · mcp package | **shipped** `#mcp` |
| 10 | Computer-use foundation + package internals | `/guides/computer-use` | `packages/computer-use` + 6 CU docs | **deep** dig v3; dig v4 spot-check OK |
| 11 | Swarm + expert team + Swarm Mode | §04 `#swarm` · `#swarm-mode` · `#swarm-template` | `bounded-swarm.ts` · `agent-swarm-tools.ts` · `orchestration.ts` · `swarm-command.ts` · `swarm-mode.ts` · Desktop/CLI/Headless host | **deep** dig v5/#92 — PRs #1325–#1328 |
| 12 | Shell / PTY / workspace executor | §01/§02 | `shell-run-manager.ts` · `pty-*.ts` | shipped §02 `#shell-side-effects` |
| 12b | Filesystem worker / path containment | §02 | `filesystem-worker/**` · `path-containment.ts` | shipped §02 `#filesystem-worker` |
| 12c | Desktop main composition | `/guides/desktop-host` | `apps/desktop/src/main/**` | shipped companion |
| 12d | Desktop UI supervision contracts | `/guides/desktop-ui` | `packages/ui` interaction-queue · chat-input-behavior · composer | **deep** dig v3; dig v4 e2e-fixture rename |
| 12e | CLI session / bootstrap / inspect | `/guides/cli` | `packages/cli` session-driver · runtime-bootstrap · inspect-command | **deep** dig v3; dig v4 spot-check OK |
| 12f | Deep Research durable workspace | `/guides/deep-research` | `deep-research-run.ts` · `deep-research-tools.ts` · `deep-research-store.ts` · Desktop IPC/UI | **NEW deep** dig v4/#91 — PR #1227 |
| 12g | Plan collaboration mode | `/guides/plan-mode` | `collaboration.ts` · `plan.ts` · `plan-store.ts` · `plan-mode.ts` · `plan-tools.ts` · `plan-mode-panel.tsx` | **NEW deep** dig v4/#91 — PR #1305 |
| 13 | Storage ledgers (JSONL+SQLite) | §01 stores | `sqlite-runtime-store.ts` · write-queue | **deep** (#81) |
| 14 | Skill catalog policy + bundled corpus | §01 `#skills` + `/guides/skills-corpus` | runtime `skills.ts` · desktop `skills.ts` / `managed-skill-sources.ts` · SKILL×29 | **deep** dig v3; dig v4 spot-check ×29 OK |
| 15 | Headless trust / Harbor / harness A/B ops | §04 `#harbor-trust` · `#harness-ab-ops` | headless README + Harbor bridge + harness-ab-* | **deep** dig v4 — TASK_IDS / xhigh / concurrency |
| — | Usage / cost telemetry dual-store | §01 `#usage-stores` | `telemetry/*` · `usage-stats-store.ts` · capture | **deep** (#81) |
| — | Runtime-host four-op gateway | §01 `#runtime-host` | `HOST_OPERATION_SPECS` · dependency-boundary | **deep** (#81) |
| — | AgentRunRecovery vs RuntimeRecovery | §01 `#agent-run-recovery` | `agent-run-recovery.ts` | **shipped** |
| — | Autonomous budget × projection | §04 `#budget` | `autonomous-agent-loop.ts` | **shipped** |
| — | Heavy-task gate triad | §05 `#repair` | `heavy-task-self-check-gate.ts` | **shipped** |
| — | AHE scoreAuthority + forbidden patch | §06 | `ahe-evidence-export.ts` · protocol | **shipped** (Target controller still stub) |
| — | e2e-fixture (ex visual-smoke) | process / desktop contracts | `e2e-fixture.ts` · desktop e2e-fixture/** | **oos/process** — rename fixed on site; not Destination protocol |

---

## Architecture docs beyond the six chapters

| Doc | Role |
| --- | --- |
| `docs/architecture/runtime-recovery-resolver-adr.zh-CN.md` | RuntimeEvent sole fact + Resolver sole authority (zh-CN only) |
| `docs/archive/runtime-resume-phase0-crash-contract.md` | P0–P11 failpoints — **still live authority**, archive path is naming tension |
| `docs/archive/runtime-resume-phase1-safe-boundary-contract.md` | Continuation gate + feature flag |
| `docs/runtime-resume-tool-journal-design-draft.zh-CN.md` (and/or architecture sibling) | Journal as projection |
| `docs/execution-evidence-spine.md` | Cross-ledger refs (current) |
| `docs/deep-research-durable-workspace.md` | Deep Research workspace authority (current; dig v4) |
| `docs/session-task-ledger-lifecycle.md` | Ledger ≠ TaskRun (current) |
| Archive teaching manuals | `runtime-mainline-teaching-manual.md` · `runtime-kernel.md` · `runtime-v2-architecture-evolution.md` · cost design — harvest **deltas** vs Current §01 only |

---

## Module → chapter map

| Module | Seam rank | Home |
| --- | ---: | --- |
| `tool-runtime.ts` / `recovery-resolver.ts` / `runtime-commit-sink.ts` / sqlite T1–T2 | 1 | §01 `#recovery` |
| `active-tool-result-prune.ts` | 2 | §02 |
| `tool-result-archive.ts` | 2 | §02 |
| `history-compact.ts` / checkpoint / mid-turn | 2–4 | §02 triad + §03 body |
| `request-shape.ts` / `tool-availability.ts` | 5 | §01 `#request-shape` |
| `sandbox/**` / `permission-profile.ts` | 6 | §01 / guide |
| `task-ledger*.ts` | 7 | §04 |
| `execution-evidence.ts` | 8 | cross-cut |
| `mcp-tools.ts` | 9 | companion |
| `computer-use/**` | 10 | `/guides/computer-use` |
| swarm / expert / team tools | 11 | companion |
| `shell-run-manager.ts` / pty | 12 | §01/§02 |
| `packages/ui` interaction-queue / chat-input | 12d | `/guides/desktop-ui` |
| `packages/cli` session-driver / inspect | 12e | `/guides/cli` |
| `deep-research-*.ts` + Desktop DR wiring | 12f | `/guides/deep-research` |
| `plan*.ts` / `collaboration.ts` / plan-mode-panel | 12g | `/guides/plan-mode` |
| storage write-queue / jsonl | 13 | §01 stores |
| skills / skill-invocation | 14 | §01 + `/guides/skills-corpus` |
| `packages/headless/**` | 15 | §04 `#harbor-trust` · `#harness-ab-ops` |

---

## Corrections vs corpus-mine-plan

1. Corpus plan “Recovery Phase0/1 + journal” and inventory **#1** are **one seam family** — do not split teaching across two half-invariants.  
2. Mid-turn shaping≠verdict and providerTools≠activeTools are **code-primary** (little/no architecture draft).  
3. Phase0/1 contracts under `docs/archive/` remain authoritative for live resume — classify carefully.  
4. Several ADRs are zh-CN-only (resolver, journal, MCP, bot) — bilingual atelier may translate while mining.

---

## Ticket mapping (code-seam lane)

| Seam | Ticket | Kind |
| ---: | --- | --- |
| #1 T1/T2 + RecoveryResolver | [#63](https://github.com/tt-a1i/agent-atelier/issues/63) Task (narrative; completes #48 half) | ship §01 |
| #2 Three prune lifecycles | [#64](https://github.com/tt-a1i/agent-atelier/issues/64) Task | ship §02 |
| #3 Checkpoint V2 + headAnchor | [#65](https://github.com/tt-a1i/agent-atelier/issues/65) | **closed** — outline + §03 `#mid-turn` |
| #4 Mid-turn shaping ≠ verdict | [#66](https://github.com/tt-a1i/agent-atelier/issues/66) | **closed** — outline + §03 `#capacity-shaping` |
| #5 providerTools ≠ activeTools | [#67](https://github.com/tt-a1i/agent-atelier/issues/67) | **closed** — outline + §01 `#tool-economy` deepen |
| ContextBudgetPolicy two-plane DSL | [#74](https://github.com/tt-a1i/agent-atelier/issues/74) | **closed** — outline + §03 `#budget-dsl` |
| Semantic compact gates | [#75](https://github.com/tt-a1i/agent-atelier/issues/75) | **closed** — outline + §03 `#semantic-gates` |
| Park/remember vs escalation one-shot | [#76](https://github.com/tt-a1i/agent-atelier/issues/76) | **closed** — outline + §01 `#park-remember` |

Corpus lane tickets #46–#62 remain the broader frontier — integrate, do not duplicate.
