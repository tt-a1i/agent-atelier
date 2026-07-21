# Deep outline — Session task ledger ≠ TaskRun

**Ticket:** [#49](https://github.com/tt-a1i/agent-atelier/issues/49)  
**Date:** 2026-07-21  
**Status:** research complete  
**Atelier home (locked):** §04 new section `#ledger` (or deepen after `#session`) — identity contrast; lean glossary fix in §01 if “task” appears ambiguously  
**Cross-links:** §04 TaskRun envelope · §01 Session tools · Goal gate (pointer only)

## Specimen sources (authority order)

1. **Authority doc:** `docs/session-task-ledger-lifecycle.md`  
2. **Code:**  
   - `packages/core/src/task-ledger.ts` — statuses, transitions, evidence, resumeTrust classifier, prompt budget constants  
   - `packages/storage/src/task-ledger-store.ts` — JSONL events + `tasks.json` projection  
   - `packages/runtime/src/task-ledger-tools.ts` — `task_create` / `task_update` / `task_list` / `task_get`  
   - Desktop wiring / UI panel (read model only)  
3. **Tests:** `task-ledger.test.ts`, `task-ledger-store.test.ts`, `task-ledger-tools.test.ts`, desktop contract tests  
4. **Contrast:** Headless `TaskRun` / `TaskEvent` (§04 already deep)

## Goal (reader can teach)

1. “Task” on Maka is **two objects**: session-scoped advisory ledger vs headless durable TaskRun envelope.  
2. Identity: durable UUID `id` + session-local short `key` (`T1`, `T1.1`, …); parent/child key advances exactly one segment.  
3. Status is **advisory control state** — never overrides FS/git/test/tool evidence.  
4. Evidence required for blocked / failed / completed updates.  
5. `resumeTrust` is system diagnostic; not injected into model-visible ledger until recovery owns it.  
6. Tools only mutate/read local session state; they do not dispatch work. Child `agent_spawn(task_id=…)` claims ownership but does not auto-complete the parent task.

## Non-goals

- Workflow engine / cron / PM UI  
- Replacing AgentRun / RuntimeEvent evidence  
- Collapsing Goal evaluator into ledger status

---

## Contrast table (must ship in §04)

| Axis | Session task ledger | Headless TaskRun |
| --- | --- | --- |
| Scope | Interactive session work items | Benchmark / automation execution envelope |
| Identity | `id` UUID + short `key` | `taskRunId` + Attempt ids |
| Durability unit | `task-events.jsonl` + `tasks.json` projection | Task Event Log JSONL per TaskRun |
| Status meaning | Advisory (`pending`…`cancelled`) | Orchestration lifecycle (queued/started/parked/terminal) |
| Model surface | turn-tail injection + four tools | Headless loop / continue policy — not chat todo list |
| Evidence | Compact text reasons; cannot override real evidence | Progress/evidence facts for loop decisions |
| Crash story | `resumeTrust` classifier on projection | Cold-start projectTaskRun + park/grant |
| Relation | May be referenced by child agents / Goal reminder | References Session/AgentRun/RuntimeEvents |

---

## Lifecycle invariants (compressible)

1. Keys allocated in per-session serialized write queue.  
2. No children under terminal parents; parent cannot complete while descendants non-terminal.  
3. Parent/child key depth advances by exactly one segment — skip levels fail closed.  
4. Terminal tasks get `endedAt`; logically archived after 7 days for prompt/UI, never deleted.  
5. Prompt tail ≤ 8 000 chars; prioritizes active branches; omits `resumeTrust` / untrusted tasks.  
6. `MAKA_TASK_LEDGER_TOOLS=false` disables registration.

---

## Status transition sketch (teach compact form)

```text
pending → in_progress | cancelled
in_progress → blocked | completed | failed | cancelled
blocked → in_progress | cancelled | failed
failed → pending | cancelled
completed → in_progress   only explicitReopen
cancelled → pending       only explicitReopen
```

Evidence: blockedReason / failureReason / completionEvidence required on enter.

---

## Glossary fix (atelier debt)

| Bad phrase risk | Fix |
| --- | --- |
| §04 aside “Task ledger / Headless orchestration” | Split: session ledger vs TaskRun; link both |
| Collapsing “task” to TaskRun only | Explicit dual-object sentence in §04 `#ledger` |
| Using ledger status as verifier truth | Point to §05 evidence authority |

---

## Acceptance

Reader can:

1. State id/key hierarchy and why skipped levels fail closed.  
2. Explain advisory status vs evidence authority in one sentence.  
3. Contrast session ledger with TaskRun without opening maka docs.  
4. Say what child agent ownership does and does not complete.
