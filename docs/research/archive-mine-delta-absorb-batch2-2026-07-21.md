# Archive mine-delta absorb pass (batch 2)

**Date:** 2026-07-21 · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34) · Task [#82](https://github.com/tt-a1i/agent-atelier/issues/82)  
**Queue source:** [`archive-still-teaches-sweep.md`](./archive-still-teaches-sweep.md) priority list (after top-3)  
**Rule:** Archive is not Current; harvest design encodings; cite Current code/tests in Destination bodies.

## Absorbed this pass (≥5)

### 1. `heavy-task-mainline-system-design.md` → §04 `#events`

| Harvested encoding | Where landed | Current authority |
| --- | --- | --- |
| Three planes: control / model-visible / ledger-projection | §04 CN+EN archive aside at `#events` | headless TaskRun + §05 gate triad |
| Self-check ≠ control terminal ≠ official verifier | reinforced via aside + existing §05 | `heavy-task-self-check-gate.ts` |
| Retry = projection continuation, not checkpoint resume | aside | autonomous loop + TaskRunStore |
| Live state = typed Task Events + projection, not a parallel memory store | aside | Task Event Log |

**Not absorbed as Current:** full 3.8k-line component inventory / sequence dumps that diverge from today’s file names.

### 2. `runtime-v2-architecture-evolution.md` → §01 `#stores`

| Harvested encoding | Where landed | Current authority |
| --- | --- | --- |
| Multi-representation problem (StoredMessage / SessionEvent / AgentRunEvent / RunTrace / telemetry) | §01 `#three-ledgers` archive aside | RuntimeEvent + three-store table |
| Center of gravity → Invocation + RuntimeEvent + projections | same aside | §01 spine + code |

**Not absorbed:** phase migration plan / module-shape proposals as if they were unfinished Current work.

### 3. `runtime-kernel.md` → §01 `#identities`

| Harvested encoding | Where landed | Current authority |
| --- | --- | --- |
| Why extract ToolRuntime / ModelAdapter / AgentRun: post-crash answerability | §01 identity archive aside | `#agent-run-recovery` + AgentRun store |
| Conservative recovery = terminal close, not warm replay | same | `classifyAgentRunRecovery` |

### 4. `maka-core-tech-walkthrough.md` → research note only

| Harvested encoding | Where landed | Current authority |
| --- | --- | --- |
| Readable stack overview / permission matrix teaching intent | [`maka-core-walkthrough-archive-delta.md`](./maka-core-walkthrough-archive-delta.md) | ARCHITECTURE* + code — **layer names in walkthrough may diverge** |

**Not absorbed into Destination body:** outdated call-graph / layer labels that fight Current §01.

### 5. `maka-memory-whitebox-contract.md` → §01 `#request-shape` + research note

| Harvested encoding | Where landed | Current authority |
| --- | --- | --- |
| Two-switch model: `enabled` vs `agentReadEnabled` (default OFF) | §01 prefix-stable table archive aside | `local-memory` packages |
| Transparent file must not become implicit agent-readable durable memory | same + [`memory-whitebox-archive-delta.md`](./memory-whitebox-archive-delta.md) | kenji boundary + Current settings |

**Deferred as TOC debt:** dedicated memory chapter — not opened this pass.

### 6. `economic-mechanisms-benchmark.md` → §02 stale/lifecycle (bonus)

| Harvested encoding | Where landed | Current authority |
| --- | --- | --- |
| Synthesis cache: block replaces raw hydrate on replay; mock A/B −72.9% | §02 archive aside after Active≠Stale≠Compact | `loadSynthesisCache` / `writeSynthesisCache` |
| Single long-turn Harbor may never hit write gate (workload mismatch) | same aside | Harbor cell + context budget env |

## Still queued (not this pass)

- Archive `README.md` inventory (keep as classification index; no new Destination body)
- Any future archive additions reclassified in the sweep table

## Acceptance

Six mine-delta files harvested with landing pointers. Destination **still not complete** — Cluster 1 lean trio deepened under [#81](https://github.com/tt-a1i/agent-atelier/issues/81); archive remainder shrinks but map Destination bar remains open.
