# Deep outline — Heavy-task self-check gate (evidence → repair → official)

**Ticket:** [#77](https://github.com/tt-a1i/agent-atelier/issues/77) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research + narrative shipped §05 `#repair` CN+EN · **closed**
**Atelier home:** §05 `#repair` (triad actions) · lean §06 scoreAuthority  
**Cross-links:** §05 `#semantic` · §06 `#authority` · execution-evidence freshness

## Specimen sources

1. **Code:** `packages/headless/src/heavy-task-self-check-gate.ts` · `task-agent-controller.ts` (gate → repair Turn → re-gate) · `heavy-task-self-check.ts` · `heavy-task-finalization.ts`
2. **Tests:** `task-agent-controller.test.ts` (action `allow_official_verifier_after_bounded_attempt`) · `result-export.test.ts`
3. **Mechanism PR:** **#427** Add heavy-task self-check gate

## Goal

1. Gate has **three** actions — not “allow / repair / stop”.  
2. `allow_finalize` ≠ official pass (still advisory).  
3. Cap exhaustion → `allow_official_verifier_after_bounded_attempt` (handoff), never self-mint.  
4. Checklist is derived from plan/todos/task-family hints — public only.

## Decision triad

| Action | When | Meaning |
| --- | --- | --- |
| `allow_finalize` | Heavy-task off, or semantic complete + accepted pass evidence | Proceed finalize path; **advisory forever** |
| `repair_prompt` | Blocked and `repairAttemptsUsed < max` (default 1) | Same Attempt, new Turn with checklist prompt |
| `allow_official_verifier_after_bounded_attempt` | Still blocked after cap | Stop self-repair; let **official** verifier/scorer run |

## Failure modes (gate blockers)

Missing accepted self-check · not public · stale freshness · status ≠ pass · zero evidence · strong-pass hygiene blocker · required artifact not addressed · semantic incomplete reason.

## Acceptance

§05 names all three actions verbatim; diagram end state is official handoff, not “infinite stop without authority story”.
