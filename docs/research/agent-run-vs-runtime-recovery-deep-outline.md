# Deep outline — AgentRunRecovery vs RuntimeRecovery

**Ticket:** [#80](https://github.com/tt-a1i/agent-atelier/issues/80) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research + narrative shipped §01 `#recovery` (`#agent-run-recovery`) CN+EN · **closed**
**Atelier home:** §01 `#recovery` deepen — dual authority contrast  
**Cross-links:** T1/T2 Resolver · Phase0/1 · §04 crash

## Specimen sources (authority order)

1. **Code:** `packages/runtime/src/agent-run-recovery.ts` · `recovery-resolver.ts` · `session-manager.ts` (`recoverNonTerminalRuns` / `classifyRuntimeEventRecovery` / `applyAgentRunRecovery`) · `runtime-resume.ts`
2. **Tests:** `recovery-resolver.test.ts` · session recovery / AgentRun store crash paths
3. **Docs:** `runtime-recovery-resolver-adr.zh-CN.md` · Phase0/1 archive contracts
4. **Mechanism commit:** `06112db9` Recover sessions from AgentRun ledger · Resolver/T1–T2 via **#1223**

## Goal (reader can teach)

1. Two classifiers answer different questions; collapsing them into “warm resume” is wrong.  
2. `classifyAgentRunRecovery` closes non-terminal **AgentRun** headers from ops events (`app_restarted` failure classes).  
3. `resolveRuntimeRecovery` is sole judgment over **RuntimeEvent** tool boundaries.  
4. SessionManager may prefer a Runtime terminal fact when present; AgentRun classifier fills gaps — never replaces Resolver for tool ops.

## Non-goals

- Re-teaching full Phase0 P0–P11 matrix or T1/T2 CAS  
- Claiming AgentRun recovery restarts mid-tool impl

---

## Teaching spine

| `#id` | Title |
| --- | --- |
| `agent-run-recovery` | Dual authority table + decision reasons |
| (existing) `t1-t2` | Resolver stays tool-boundary sole authority |

## Contrast table

| | AgentRunRecovery | RuntimeRecovery |
| --- | --- | --- |
| Function | `classifyAgentRunRecovery` | `resolveRuntimeRecovery` |
| Ledger | `AgentRunHeader` + ops `AgentRunEvent[]` | Canonical `RuntimeEvent[]` |
| Trigger | Non-terminal header after restart | Tool call/dispatch/response prefix |
| Typical output | `failed` + `failureClass: app_restarted` + diagnostic reason | `completed` / `indeterminate` / `definitely_not_dispatched` / `corruption` |
| Does not | Judge unsettled tool ops | Close Session/Turn projections alone |

## AgentRun diagnostic reasons (code)

- `model_stream_completed_without_runtime_terminal`
- `stale_permission_wait`
- `tool_interrupted` (last event `tool_started`)
- `run_interrupted` (created/running / early lifecycle)
- `non_terminal_run_recovered` (fallback)

## SessionManager order (honest)

1. Ambiguous Runtime terminal ledger → strict throw / skip.  
2. Terminal header missing Runtime terminal fact → repair missing terminal once.  
3. Else `classifyRuntimeEventRecovery` (map Runtime terminal → AgentRun decision) **or** `classifyAgentRunRecovery`.  
4. `applyAgentRunRecovery` commits terminal Run + optional Turn state; embeds `recovered: true` + diagnostic.

## Acceptance

§01 names both functions, shows the contrast table, and states AgentRun recovery ≠ Resolver tool-boundary authority.
