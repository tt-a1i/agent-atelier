# Deep outline — Usage / cost telemetry beyond #request-shape

**Ticket:** [#61](https://github.com/tt-a1i/agent-atelier/issues/61) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline — subsection shipped under §01 `#request-shape` (`#usage-stores`)  
**Atelier home:** §01 `#request-shape` → `#usage-stores` · optional `/guides/cost` still fog  
**Cross-links:** existing hit/miss/write teaching · archive `deepseek-reasonix-cost-runtime-design.md` (mine-delta) · storage (#55)

## Specimen sources (authority order)

1. **Runtime telemetry:** `packages/runtime/src/telemetry/{record-llm-call,record-tool-invocation,pricing,builtin-pricing,cost}.ts`  
2. **Stores:** `packages/storage/src/telemetry-repo.ts`, `usage-stats-store.ts`, `provider-request-capture-artifact.ts`  
3. **Wiring:** desktop `session-stream.ts`, headless `harbor-cell.ts`, CLI `runtime-bootstrap.ts`  
4. **Tests:** `telemetry-repo.test.ts`, `settings-store-usage.test.ts`, `provider-request-capture-artifact.test.ts`, `web-search-telemetry-scrub-contract.test.ts`

## Goal (reader can teach)

1. Dual stores: `telemetry.json` (TelemetryRepo) vs session JSONL aggregation (`usage-stats-store`) — Settings UI uses the latter.  
2. Pricing key = `` `${providerId}:${modelId}` ``; overrides in telemetry.json; missing → **$0** not error.  
3. Cache miss derivation already taught — do not invent provider cache keys.  
4. Provider request capture = artifact + ledger event for debug/replay; **not** billing telemetry; hidden in desktop UI.  
5. WebSearch `argsSummary` scrubbed at record boundary (privacy).

## Non-goals

- Re-teaching prefixHash / attribution ladder  
- Inventing DeepSeek (or any) internal cache key algorithm  
- Claiming builtin pricing is always up to date

---

## Teaching spine

| `#id` | Title |
| --- | --- |
| `dual-stores` | telemetry.json vs session JSONL usage |
| `pricing-key` | providerId:modelId + overrides |
| `compute-cost` | miss/read/write/output components; zero if unknown |
| `capture` | provider_request_capture ≠ usage |
| `scrub` | WebSearch query never logged |
| `link-shape` | pointer back to hit/miss diagnostics |

## Store comparison

| Store | Written by | Read by | Role |
| --- | --- | --- | --- |
| TelemetryRepo (`telemetry.json`) | `recordLlmCall` / `recordToolInvocation` | summary / buckets / logs / pricing CRUD | Full records + overrides |
| usage-stats-store | — (reads sessions) | Settings `usageStats()` | Aggregate token_usage / tool rows |
| provider_request_capture artifact | capture path | headless trace / debug | Serialized request JSON |

## Invariants

1. Async best-effort queueMicrotask — failures do not block turn.  
2. `cacheMissInputSource: 'derived'` when provider omits native miss.  
3. Do not invent provider cache keys — local hashes are diagnostics only.  
4. Capture visibility: desktop artifact UI hides `provider_request_capture`.

## Current vs Target

| Topic | Current | Teaching |
| --- | --- | --- |
| Builtin pricing | Snapshot (dated) | Overrides for special tiers |
| UI usage | Session JSONL path | Dual-store honesty |
| Archive cost design | Narrative mine-delta **absorbed 2026-07-21** (`deepseek-reasonix…` → §01 `#request-shape` CostRuntime honesty) | Cross-check §01; not Current authority — see [`archive-mine-delta-absorb-2026-07-21.md`](./archive-mine-delta-absorb-2026-07-21.md) |

## Acceptance

§01 `#usage-stores` states dual-store + pricing key + capture ≠ billing. Hit/miss tables remain upstream subsections.
