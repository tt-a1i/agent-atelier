# Deep outline — Execution Identity & Evidence Spine

**Ticket:** [#50](https://github.com/tt-a1i/agent-atelier/issues/50) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline + live §01 `#execution-evidence` (zh+en) + lean cross-chapter pointers  
**Atelier home:** substantial §01 `#execution-evidence`; lean callouts §02 / §04 / §05 / §06  
**Cross-links:** §01 `#stores` / `#identities` · §03 Compaction projection cursors · §04 TaskRun · §05 freshness · §06 `execution-lineage.json`

## Specimen sources (authority order)

1. **Authority doc:** `docs/execution-evidence-spine.md` (Phase 0–3A delivery boundary)  
2. **Code:** `packages/core/src/execution-evidence.ts` — `ExecutionEvidenceRef`, cursor compare, validate  
3. **Tests:** `packages/core/src/__tests__/execution-evidence.test.ts`  
4. **Integrations (cite, do not re-own facts):** headless Task Event `task_attempt_execution_linked` / `heavy_task_evidence_provenance_linked`; Compaction `maka.compactable_runtime_event_projection.v1`; AHE `maka.ahe.execution_lineage.v1`; `maka eval task-run inspect`

## Goal (reader can teach)

1. Spine is a **reference protocol**, not a third event log or truth store.  
2. Two principal append-only lanes: Runtime Event vs Task Event; Task may reference Runtime, never copy it.  
3. `ExecutionEvidenceRef` separates execution vs task identity lanes; optional fields = honest partial knowledge.  
4. Cursor rules: `sequence` orders; `eventId` audits; cross-stream = `incomparable`; same seq different ids = `conflict`.  
5. Coverage / freshness / provenance claims must be checkable against owning ledgers; missing response ≠ invent success.  
6. Phase honesty: what 0–3A shipped vs deferred (AHE lineage partial; no general `maka inspect` resolver yet).

## Non-goals

- Inventing a second Runtime history inside Task Events  
- Teaching Phase numbers as slogans without contracts  
- Claiming bit-exact workspace attestation from evidence refs alone

---

## Teaching spine

| `#id` | Title | Depth job |
| --- | --- | --- |
| `not-a-log` | 指向事实，不重写事实 | Slogan → invariant |
| `two-lanes` | Runtime ledger × Task ledger | Authority table |
| `ref-shape` | `ExecutionEvidenceRef` | Required lanes + optionals |
| `cursors` | Cursor / coverage contract | compare API semantics |
| `phases` | Phase 0→3A delivery | Honest Current boundary |
| `freshness` | current / stale / unknown | Self-check + workspace mutation |
| `failures` | Fail-closed matrix | Tool gap, conflict, projection claim |
| `cross` | Where chapters consume the spine | Lean pointers |

## Identity hierarchy (Runtime lane)

```text
sessionId > invocationId > agentRunId > turnId
```

`agentRunId` ≡ `AgentRunHeader.runId` / `RuntimeEvent.runId`. Production may reuse values for `invocationId` and `agentRunId` — consumers must not rely on that coincidence.

## Cursor contract (exam items)

1. `sequence` is zero-based append ordinal within `(ledger, streamId)`.  
2. Only `sequence` orders; `eventId` never orders.  
3. Different ledgers/streams → `incomparable`.  
4. Same position, different explicit `eventId` → `conflict`.  
5. `runtime_event_projection` cursors need adjacent policy version (`maka.compactable_runtime_event_projection.v1`); incomparable with canonical `runtime_event` even if boundary ids match.  
6. Coverage is inclusive; `eventCount` may be < ordinal span when gaps exist.  
7. Validate: `runtimeCoverage.highWater.streamId` must match `execution.agentRunId` when both present (same for task).

## Phase map (cite spine doc; do not invent)

| Phase | Shipped teaching point |
| --- | --- |
| 0 | Shared contract + validation + cursor compare; no storage migration |
| 1 | Headless `task_attempt_execution_linked`; Attempt may link multiple AgentRuns; legacy ResultRecord = identity-only |
| 2A | Compact evidence provenance via matching `function_call`/`function_response`; missing response → no provenance |
| 2B | Self-check freshness replay-derived: `current` / `stale` / `unknown`; stale rejects completion gate |
| 2C | Compaction checkpoint bound to projection cursors + digest; successor events explicit |
| 3A | `maka eval task-run inspect` — identities/cursors/health, not raw payloads; call-without-response = unknown outcome |

Deferred: general workspace observations outside Runtime tools; durable recovery for ambiguous external side effects; general `maka inspect` resolver.

## Failure matrix

| Claim / input | Result |
| --- | --- |
| Ref with neither execution nor task lane | invalid |
| Cross-stream cursor compare | `incomparable` |
| Same seq, conflicting `eventId` | `conflict` |
| Provenance without committed `function_response` | no provenance claim |
| Stale Self-check at completion gate | reject |
| Tool call, no response at inspect | unknown outcome (side effects may have occurred) |
| Projection claims unprovable coverage | must not claim |

## Acceptance

Reader explains `ExecutionEvidenceRef`, freshness, and lineage without inventing a second truth store. Live §01 section + lean §02/§04/§05/§06 pointers cite code paths + tests.
