# Deep outline — Autonomous loop budget × projection

**Ticket:** [#79](https://github.com/tt-a1i/agent-atelier/issues/79) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research + narrative shipped §04 `#budget` deepen CN+EN · **closed**
**Atelier home:** §04 `#budget`  
**Cross-links:** `#continue` · `#crash` · Harbor trust

## Specimen sources

1. **Code:** `packages/headless/src/autonomous-agent-loop.ts` (`budgetSnapshot`, `enforceCaps`, `appendDecision`, `appendBudgetTerminal`, `runAutonomousTask`) · `task-run-store.ts` projection of decisions
2. **Contracts:** `AutonomousLoopBudget` · `LoopBudgetSnapshot` · `autonomous_decision_recorded` · `task_run_budget_exhausted`
3. **Tests:** autonomous loop / task-run-store decision projection tests

## Goal

1. Hard caps dominate custom decision policy (`enforceCaps`).  
2. Each decision records a **snapshot** of budget into Task Events — auditable.  
3. Live `startedAt` / running counters / decision closure are **not** fully reconstructible as a cold-start resume protocol (Target: durable budget accounting).  
4. Budget exhaustion may park for extension when intervention policy allows — else terminal event.

## Protocol table

| Fact | Where | Cold-start honest? |
| --- | --- | --- |
| Attempt count | Task Events + snapshot.attemptsUsed | Yes (rebuildable) |
| Runtime steps used | Summed from ResultRecord.steps into live counter; also in snapshot | Partial — snapshot history yes; live accumulator needs care |
| Wall elapsed | `now - startedAt` in live loop | **No** — startedAt is process-local |
| Decision + reason | `autonomous_decision_recorded` | Yes |
| Cap terminal | `task_run_budget_exhausted` (+ optional inbox) | Yes |

## Acceptance

§04 shows live vs projected vs enforceCaps planes; does not claim full loop counter resume.
