# Deep outline — Runtime recovery failpoints + RecoveryResolver

**Ticket:** [#48](https://github.com/tt-a1i/agent-atelier/issues/48)  
**Date:** 2026-07-21  
**Status:** research complete (code + Phase0/1 contracts + RecoveryResolver ADR)  
**Atelier home (locked):** deepen §01 `#recovery`; lean pointer from §04 `#crash`  
**Cross-links:** §01 stores / terminal · §02 tool pairing · §04 TaskRun crash ≠ Runtime resume

## Specimen sources (authority order)

1. **Code (wins):**  
   - `packages/runtime/src/runtime-resume.ts` — `RUNTIME_RESUME_FAILPOINTS`, Phase0 plan, Phase1 planner/executor  
   - `packages/runtime/src/recovery-resolver.ts` — sole tool-recovery decision authority  
   - `packages/runtime/src/runtime-kernel.ts` / `agent-run-recovery.ts` — startup repair consumers  
   - Tests: `runtime-resume.test.ts`, `runtime-resume-crash.test.ts`, `recovery-resolver.test.ts`  
2. **Contracts:**  
   - `docs/architecture/runtime-resume-phase0-crash-contract.md`  
   - `docs/architecture/runtime-resume-phase1-safe-boundary-contract.md`  
   - `docs/architecture/runtime-recovery-resolver-adr.zh-CN.md`  
   - `docs/runtime-resume-tool-journal-design-draft.zh-CN.md` (journal = projection; do not teach as second ledger)

## Goal (reader can teach)

1. Three different “recoveries”: **startup state repair**, **Phase0 prefix decision** (`safe_replay` / `blocked`), **Phase1 safe-boundary continuation** (new Invocation/Run).  
2. Phase0 reasons only over the last fully committed RuntimeEvent prefix — not T1/T2 journal existence.  
3. P0–P11 failpoint catalog collapses to four prefix classes with deterministic dispositions.  
4. RecoveryResolver is the only authority for call / dispatch / response combinations; unknown → fail-closed.  
5. T1 dispatch RuntimeEvent marks “unsafe to assume impl did not run”; Journal is rebuildable projection (ADR).  
6. Warm mid-tool resume remains Target for default path; Phase1 is opt-in (`MAKA_RUNTIME_SAFE_BOUNDARY_RESUME=1`).

## Non-goals

- Teaching SQLite tool journal as a competing truth source  
- Claiming automatic side-effect reconcile ships for indeterminate tools  
- Replacing §04 TaskRun cold-start teaching  
- Inventing power-loss / fsync guarantees (Phase0 harness is SIGKILL process crash)

---

## Teaching spine for §01 `#recovery`

| Subsection | Depth job |
| --- | --- |
| Layers of recovery | Startup repair ≠ Phase0 plan ≠ Phase1 continuation |
| Phase0 failpoint matrix | P0–P11 → prefix → disposition |
| Phase1 safe boundary | Gates + fresh identity + flag honesty |
| RecoveryResolver | Decision table + fail-closed |
| T1 / journal honesty | Dispatch event vs projection; Current vs Phase2.5+ |
| What recovery never does | Warm mid-tool invent |

---

## Phase0 failpoint → prefix → decision (must ship as table)

From `RUNTIME_RESUME_FAILPOINTS` + Phase0 contract:

| IDs | Injection boundary (summary) | Committed prefix | Disposition |
| --- | --- | --- | --- |
| P0 | Before tool preparation (T1) | `before_function_call` | `safe_replay` (no tool op) |
| P1–P4 | Call committed → impl / side-effect before T2 outcome | `after_function_call` | `blocked` · `dangling_tool_state` · indeterminate |
| P5–P8 | Response committed → result delivery / terminal event | `after_function_response` | `safe_replay` (paired) |
| P9–P11 | Terminal header / recovery decision / continuation create | `after_terminal_event` | Same tool decision as prior; terminal fact stays |

Extra invariant: expected high-water ≠ reopened prefix → `runtime_offset_mismatch`. Torn JSON row = storage corruption, not a legal prefix.

---

## Phase1 safe-boundary (Current honesty)

```text
safe_replay + host safety facts
  → new Invocation / Run / Turn
  → continuation-start RuntimeEvent (durable before provider)
  → provider replay without duplicate user message
```

Planner parks on any missing/contradictory fact (unresolved tool, permission wait, cwd/workspace mismatch, unsettled children, tool catalog gap, …). Execution revalidates immediately before start. Flag-gated; without flag, happy path unchanged.

---

## RecoveryResolver decision table (must ship)

| RuntimeEvent facts | Decision |
| --- | --- |
| call + matching response, no dispatch | `completed` (pre-T1 synthetic or legacy complete) |
| call + dispatch + matching response | `completed` |
| call + dispatch, no response | `indeterminate` / reconcile_required |
| call, no dispatch, no response, new protocol marker | `definitely_not_dispatched` |
| call, no dispatch, no response, legacy/unknown | `indeterminate` |
| orphan dispatch / orphan response / identity conflict / duplicates | `corruption` |

Protocol marker `toolBoundary: t1_after_preflight_v1` only on first canonical event when durable commit sink is actually wired — not inferred from software version.

---

## Current vs Target

| Topic | Current | Target / later |
| --- | --- | --- |
| Startup recovery | Conservative failed/cancelled + projection repair | Keep |
| Phase0 | Deterministic prefix decision + SIGKILL harness | Keep |
| Phase1 | Flag-gated safe continuation | Broader host adoption |
| RecoveryResolver | Pure decision over RuntimeEvents | Phase3 writers append `tool_recovery_decided` |
| Journal T1/T2 | Projection of RuntimeEvent facts (ADR) | Do not teach as second ledger |
| Auto re-run side-effect tools | Not default | Reconcile paths after park |

---

## Acceptance

Reader can:

1. Name the three recovery layers without collapsing them.  
2. Map P0–P11 to four prefixes and say why `after_function_call` blocks.  
3. State RecoveryResolver outcomes for dispatch-without-response vs new-protocol call-only.  
4. Refuse to claim warm mid-tool resume as default Current.
