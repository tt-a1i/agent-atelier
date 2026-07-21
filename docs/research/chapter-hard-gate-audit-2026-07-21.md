# §01–§06 hard-gate audit (post–Pages)

**Date:** 2026-07-21  
**Live:** https://tt-a1i.github.io/agent-atelier/  
**Checklist:** `docs/research/chapter-acceptance-checklist.md`  
**Prior sweep:** [#29](https://github.com/tt-a1i/agent-atelier/issues/29) (blocked on deploy URL; [#25](https://github.com/tt-a1i/agent-atelier/issues/25) now closed)

## Matrix

| Gate | §01 | §02 | §03 | §04 | §05 | §06 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Narrative (core Q, self-contained, no TBD, Current≠Target, zh→en) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2 Keystone + ≥3 volume flows + reduced-motion + captions/alt | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 3 History asides (budget, pin, locale hrefs) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 4 Accessibility (#24) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 5 Bilingual same-ship (#23 + §04–§06 EN) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 6 Chrome / shareable `base` URL on Pages | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Diagram counts (keystone + flows)

| § | Keystone | Volume flows (≥3) |
| --- | --- | --- |
| §01 | LogIsRuntime | EventProduceConsume, ReplayLayers, IdentityLayers |
| §02 | EvidencePipeline | FourReps, ActivePrune, SourceChain |
| §03 | CompactionProjection | HighWaterCompact, RollingCheckpoint, CompactKinds |
| §04 | DurableTask | DurableBoundary, AttemptContinue, BudgetLayers |
| §05 | SelfCheck | AuthoritySplit, RepairBudget, PlanThenEvidence |
| §06 | AheBoundary | ReadonlyEvidencePlane, EvidenceExport, ManifestEvaluate |

## What was blocking “done” after #29

1. **Shareable deploy URL** — resolved by #25 (`site` + `base: /agent-atelier/`, live Pages).
2. **Stub chrome honesty lag** — masthead/WIP banners and outline “待补 / Still open” still claimed missing EN/a11y/flows after those gates had landed. Closing that lag is chrome polish, not new narrative work.
3. **EN shell banner** — still said “full EN prose is not shipped” after same-ship prose existed.

## Explicitly not required for chapter done

- Full `/history` nested-PR / orphan-bucket polish (history track tickets)
- `/en/history/pr|c` detail routes (asides may stay zh-canonical)
- D2 install (#13) while hand SVG meets volume
- Extra optional figures beyond ≥3 (cold-start recovery, archive failure, …)
- HITL depth preference for Headless / Self-check / AHE vs Runtime chapters (map fog)

## Verdict

All six cognitive chapters **meet the hard gate** and may be marked `status: done` in UI/docs. Entry `/` stays outside chapter-done; history track keeps its own WIP notes where advanced modes are unfinished.
