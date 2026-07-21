# Deep outline — Headless trust posture / Harbor isolation

**Ticket:** [#54](https://github.com/tt-a1i/agent-atelier/issues/54) under [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline mined from `packages/headless/README.md` + isolation/harbor sources + tests  
**Atelier home (decided):** deepen **§04 `#harbor-trust`** (alongside existing `#workspace` / Harbor Turn continue) — Harbor is **eval isolation carrier**, not a separate worldview chapter  
**Cross-links:** §04 TaskRun · sandbox Seatbelt outline (OS transform ≠ Harbor) · §05 hygiene “sandbox root” word collision · §06 AHE export

## Specimen sources (authority order)

1. **Package README (D/A):** `packages/headless/README.md` — trust posture, CLI, grading, Harbor smoke/A/B  
2. **Code (wins):**  
   - `packages/headless/src/isolation.ts` — `RealBackendIsolation`, `IsolatedToolExecutor`, `buildIsolatedHeadlessTools`  
   - `packages/headless/src/harbor-cell.ts` (+ tool-executor, context-budget-env)  
   - `packages/headless/src/harbor-cli.ts`, `harbor-task-runner.ts`, `harbor-failure-policy.ts`  
   - `packages/headless/src/harbor-official-artifacts.ts`  
   - `packages/headless/harbor/*` — Terminal-Bench smoke / harness A/B / adapters (ops surface)  
3. **Tests-as-spec:** `harbor-*.test.ts`, isolation/tools tests, failure-policy tests  
4. **§04 existing teaching:** Harbor Cell Turn vs Autonomous Attempt vs parked CLI — keep; this ticket adds **trust/isolation** depth

## Goal (reader can teach)

1. `eval` is **untrusted by construction** — config under test must not reach host credentials.  
2. Without OS-level isolation → **fail closed by default** (CLI wires inert `fake` only).  
3. Real-model programmatic eval requires explicit `realBackendIsolation` + `registerBackends`.  
4. Isolation record is an **assertion**, not magic: label non-empty; tools routed through executor.  
5. `buildIsolatedHeadlessTools`: Bash + Read/Write/Edit/Glob/Grep through boundary; reject abs paths / `..` / abs globs.  
6. Read/Edit contracts stay headless-owned (line numbers / binary guard / single edit matcher) even when executor is remote.  
7. Throwaway workspace ≠ OS Seatbelt ≠ Harbor container (three isolations).  
8. Harbor modes: cell vs task-run host-bridge (`MAKA_HARBOR_MODE`); credentials never enter task containers in A/B posture.  
9. Failure policy: infra vs agent_incomplete vs budget — only infra should throw for benchmark classification.  
10. Grading: `protectedPaths` required restore-before-verify; exit 0 on agent fail-verification, non-zero on infra.

## Non-goals

- Replacing §04 TaskRun essay  
- Full Terminal-Bench 2.1 ops runbook as Destination  
- Claiming Seatbelt on Linux headless  
- Teaching competitor CLI internals beyond isolation contrast

---

## Teaching spine (§04 `#harbor-trust`)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `harbor-trust` | Eval 默认不信任 | fake-only CLI; isolation assertion |
| `real-backend` | RealBackendIsolation | external kind + label + executor |
| `tools` | Isolated tool surface | path reject; Read/Edit ownership |
| `three-sandbox` | 三种隔离不要混 | throwaway · Seatbelt · Harbor |
| `harbor-modes` | cell vs task-run bridge | who runs controller |
| `grade` | protectedPaths | forge-resistant verify |
| `fail-class` | infra vs incomplete vs budget | shouldThrow matrix |
| `cred` | Credential posture in A/B | proxy capability ≠ token |
| `vs-continue` | Trust ≠ resume semantics | link `#continue` |

---

## Protocol figures

1. **Trust gate flowchart:** model-backed? → isolation record valid? → register backends / else refuse.  
2. **Three-isolation triptych:** local throwaway copy · macOS Seatbelt transform · Harbor/Docker executor.  
3. **Harbor task-run bridge:** host TaskRun controller ↔ container tool exec; container installs nothing.  
4. **Failure classification table** from `harbor-failure-policy.ts`.  
5. **Grading timeline:** agent mutates → restore protectedPaths → run verify command.

---

## Invariants

1. Eval default never exposes host credentials to the measured agent.  
2. Truthy accidental object ≠ isolation — non-empty `label` required.  
3. Headless does not **infer** safety from Docker being “probably there.”  
4. Absolute path / `..` / absolute glob rejected before dispatch.  
5. Read always through line-number/binary-guard contract; Edit matcher stays single source of truth.  
6. Verification command after protected restore; agent cannot grade itself by rewriting tests.  
7. Infra failure ≠ failed verification (exit codes differ).  
8. Harbor A/B: arms get proxy capability only — never access/refresh token or key file path in container.  
9. Oracle evidence advisory — never silently changes task selection or blocks A/B (per README).  
10. TaskRunStore does not own external workspace fencing (link `#workspace`).

---

## Current vs Target

| Topic | Current | Target / open |
| --- | --- | --- |
| CLI eval backends | fake only | operational trusted host mode = different posture (documented future) |
| Real model | programmatic + isolation record | keep fail-closed |
| Harbor | cell + task-run host-bridge | — |
| Unified resume | still Target in §04 | do not claim Harbor fixes it |
| OS Seatbelt in headless | not the Harbor story | link sandbox outline |

---

## Failure matrix

| Situation | Result |
| --- | --- |
| Spec asks real backend via CLI without isolation | non-zero refuse |
| Missing/empty isolation label | validation fail |
| Agent rewrites tests under protectedPaths | restored; verify sees pristine |
| Agent fails verification | valid result data; process exit 0 |
| Invalid spec / crash before result | infra; non-zero |
| `isolation_required` / `setup_failed` taxonomy | infra_failure; shouldThrow |
| Budget / timeout patterns | budget_exhausted; shouldThrow false |
| Agent incomplete / tool_failed | agent_incomplete; shouldThrow false |
| Path escape in isolated tools | reject before exec |

---

## Mechanism asides

- Cite `harbor-failure-policy.test.ts`, isolation/tools tests, `harbor-cell-bash` / file-tools tests.  
- Smoke: `harbor/run-terminal-bench-smoke.mjs --dry-run`.  
- History: TaskRun / Harbor intro PRs already linked in §04 — add isolation-specific tests as asides.

---

## Acceptance

Reader can:

1. State eval fail-closed default.  
2. Explain what `RealBackendIsolation` asserts vs what executor must fulfill.  
3. Separate three “sandbox” meanings.  
4. Classify infra vs agent_incomplete vs budget.  
5. Link Harbor trust to `#workspace` / `#continue` without collapsing them.

**Live §04 `#harbor-trust` should ship with this research close. Harbor stays under §04 — not a random seventh page.**
