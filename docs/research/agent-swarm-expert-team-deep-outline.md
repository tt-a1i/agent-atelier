# Deep outline — Agent Swarm + Expert Team (subagents)

**Ticket:** [#52](https://github.com/tt-a1i/agent-atelier/issues/52) under [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline mined from `agent-swarm.md` + `expert-team-runtime.md` + core/runtime code + tests  
**Atelier home (decided):** deepen **§04 `#swarm`** (multi-agent / fan-out) — companion only if §04 explodes  
**Cross-links:** §04 TaskRun ≠ session task ledger (#49 still empty) · §01 permission · child `AgentRun` evidence

## Specimen sources (authority order)

1. **Current docs (A):**  
   - `docs/agent-swarm.md`  
   - `docs/expert-team-runtime.md`  
2. **Code (wins):**  
   - `packages/core/src/agent-swarm.ts` — result projection  
   - `packages/core/src/expert-team.ts` — label prefix / lead fragment helpers  
   - `packages/runtime/src/bounded-swarm.ts` — all-settled worker pool  
   - `packages/runtime/src/agent-swarm-tools.ts` — `agent_swarm` tool  
   - `packages/runtime/src/{expert-catalog,expert-tools,agent-team-tools}.ts`  
   - child spawn: `session-manager` `spawnChildAgent` path  
3. **Tests-as-spec:** `bounded-swarm.test.ts`, `agent-swarm-tools.test.ts`, `expert-team.test.ts`, `agent-team-tools.test.ts`, desktop `agent-swarm-host-contract.test.ts`  
4. **Archive:** `docs/archive/expert-team-implementation.md` — implementation chronicle; cross-check Current

## Goal (reader can teach)

1. Swarm = **bounded foreground fan-out** over ordinary child `AgentRun`s — not a workflow engine.  
2. No `SwarmRun`, second event ledger, checkpoint, or background owner.  
3. Child toolsets exclude `agent_swarm` (no nested batches).  
4. Choosing model: direct / sequential `agent_spawn` / `agent_swarm` / Expert Team / Rive.  
5. Three concurrency boundaries: subagent tool admission · local swarm concurrency · shared child-run permits.  
6. Partial failure keeps successful siblings; cancel joins and returns cancelled rows for never-started items.  
7. Presentation projects bounded summaries + child run/turn refs — never raw child prompts/args/output.  
8. Expert Team = lead persona + members under archetypes that may **narrow never widen** tools.  
9. Members: mailbox + atomic self-claim on Task Ledger items owned by parent lead run; lead adjudicates.  
10. Role mailbox ≠ invocation-private channel; cursors are caller-owned.

## Non-goals

- Teaching Rive / DAG orchestration as shipped  
- Detached cross-machine members  
- Equating Swarm with TaskRun durability  
- Mining 29 SKILL bodies

---

## Teaching spine (§04 `#swarm`)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `swarm` | 有界扇出，不是第二套 Runtime | No SwarmRun ledger |
| `choose` | 何时 spawn / swarm / team | Decision table |
| `bounds` | 三道并发边界 | admission / local / shared permit |
| `settle` | all-settled + cancel join | ordered projection |
| `evidence` | 投影 vs child authority | runId/turnId refs |
| `team` | Expert Team lead/member | narrow-only tools |
| `mailbox` | role address + cursor | durable handoff honesty |
| `ledger-claim` | team_task_claim | one claim; lead completes |
| `vs-taskrun` | Swarm ≠ TaskRun | glossary |
| `failures` | nested swarm / widen tools / claim conflict | fail closed |

---

## Protocol figures

1. **Decision table** (from agent-swarm.md Choosing section).  
2. **Three-boundary diagram:** turn admission → local worker pool → shared child permits.  
3. **Swarm settle timeline:** validate all → queue/start → all-settled ordered rows → parent synthesizes.  
4. **Team swimlane:** lead `expert_dispatch` → child AgentDefinition `expert:team:member` → mailbox/claim → bounded summary fan-in.  
5. **Identity split:** TaskRun (headless durable) vs child AgentRun (swarm/team) vs session task ledger (separate ticket).

---

## Invariants

1. Every started swarm item is an ordinary child `AgentRun`.  
2. Parent tool result is ordered projection over child facts.  
3. No nested `agent_swarm`.  
4. Entire input validated before any child starts (`1..32` items).  
5. Local concurrency default 3, cap 5; shared permits across spawn/dispatch/swarm.  
6. Cancel: signal active, prevent queued starts, join, explicit cancelled rows.  
7. Telemetry/UI: bounded summaries only.  
8. Expert tools ⊆ archetype tools (narrow-only).  
9. Members never receive `expert_dispatch`.  
10. Mailbox scoped by team + parent lead `AgentRun`; new lead run ≠ inherit old messages.  
11. Claim conflicts fail closed; members lack general task mutation/completion tools.  
12. Lead retains completion / adjudication authority.

---

## Current vs Target / deferred

| Topic | Current | Deferred |
| --- | --- | --- |
| Swarm | Shipped bounded tool | — |
| Team mailbox + claim | Shipped collaboration slice | auto wake/injection (poll inbox) |
| Worktree writing members | Fail-closed today | worktree-isolated writers |
| UI team picker | IPC start/list | renderer panel |
| Marketplace / IM colleagues | — | out of Destination |

---

## Failure matrix

| Situation | Result |
| --- | --- |
| Nested `agent_swarm` in child | tool excluded / unavailable |
| Invalid item before start | whole call fails; no partial start |
| One child fails | siblings kept; aggregate status reflects mix |
| Parent cancel mid-batch | active signalled; queued never start; cancelled rows |
| Expert widens tools beyond archetype | definition/build rejects (narrow-only) |
| Claim already taken | fail closed |
| Fresh member omits `after_seq` | reads role history from start of **current** lead run |
| Corrupt mailbox log | fail closed |
| Treat swarm as durable TaskRun | **teaching error** — different identity |

---

## Mechanism asides

- Cite `bounded-swarm.test.ts` for cancel-join / order.  
- Cite `agent-swarm-tools.test.ts` for projection + nesting.  
- Expert team tests for narrow tools + mailbox cursor.  
- History: intro PRs for swarm/team tools when mining history track — not docs-land.

---

## Acceptance

Reader can:

1. Explain “structured concurrency convenience over child AgentRuns.”  
2. Fill the choose-model table.  
3. Name three concurrency boundaries.  
4. Contrast Swarm vs Expert Team vs TaskRun.  
5. State narrow-only + lead adjudication.

**Live §04 `#swarm` should ship with this research close.**
