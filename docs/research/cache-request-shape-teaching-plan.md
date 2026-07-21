# Teaching plan — Provider cache / prefixHash / request shape

**Ticket:** [#38](https://github.com/tt-a1i/agent-atelier/issues/38)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research teaching plan (not a live-chapter rewrite)  
**Depth posture:** Even depth + cross-cutting cache required ([#35](https://github.com/tt-a1i/agent-atelier/issues/35))  
**Specimen (archived, extract durable ideas only):** `maka-agent/docs/archive/deepseek-reasonix-cost-runtime-design.md`  
**Current accuracy anchors:** architecture ch.1–3 + `packages/runtime/src/request-shape.ts` + usage/cost telemetry helpers

## Goal

Turn the archived cost-runtime design into a **teachable atelier plan**: where it lives on the cognitive track, which invariants readers must learn, which figures, which mechanism PRs — without inventing DeepSeek’s internal cache key.

After a later narrative ticket implements this plan, a reader can explain:

1. Why shorter prompts can raise bills under cache-sensitive pricing.  
2. Durable prefix vs turn tail (why cwd/date in system prompt destroy locality).  
3. Local `prefixHash` / request-shape diagnostics ≠ provider cache key.  
4. Usage split: hit / miss / write / output / reasoning; miss counter provenance.  
5. Attribution ladder when miss rises.  
6. Active tools vs full dispatch registry / `load_tools`.  
7. Fail-open: never delete facts to chase cache hits.

---

## Decision: teaching home (recorded)

### Recommendation (for map Decision)

**Primary home: deepen §01 with a dedicated section cluster**  
`#request-shape` (+ lean subsections) — *Request materialization & cost spine*.

**Companion callouts (not full re-teach):**

| Chapter | Callout job |
| --- | --- |
| §02 | Active/stale prune changes provider-visible messages → may move `historyProjectionHash`; archive fail-open beats cache chasing |
| §03 | History fold / checkpoint replay changes history projection; pointer back to §01 cost spine |
| §04+ | Only if TaskRun surfaces expose the same usage fields — one sentence max |

### Why not the alternatives

| Option | Verdict |
| --- | --- |
| §03 companion as primary | Rejected as sole home — cache locality is about **full request assembly** (model, system, tools, options, history, tail), not only compaction |
| Short cross-chapter callouts only | Rejected as sole strategy — too scattered; readers never learn the attribution ladder |
| New seventh cognitive chapter | Rejected — map keeps 1:1 with Maka’s six chapters; cache is a **cross-cutting spine**, not a new worldview chapter |
| Standalone `/guides/cost` page | Optional later; not required for depth map destination |

### Grilling override note

If a future grilling overrides this home, keep the **same invariants and figures**; only relocate the primary prose. §02/§03 callouts remain regardless.

---

## Explicit non-goals

1. Do **not** define or invent DeepSeek (or any provider) internal cache key.  
2. Do **not** present `prefixHash` / `requestShapeHash` as the provider’s cache key.  
3. Do **not** invent a parallel `CostRuntime` / second tool loop in teaching (archive rejected this).  
4. Do **not** claim history budget / prune / compact always save money.  
5. Do **not** merge Harbor verifier / benchmark reward into Runtime terminal semantics.  
6. Do **not** swallow full local-memory product design — only prompt-placement implications.  
7. Do **not** re-teach full §02 archive protocol or §03 checkpoint schema — link out.

Archived doc status line must appear once in narrative: *extract durable ideas; not current authority.*

---

## Proposed section map (lives inside deepened §01)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `request-shape` | Provider 看见的请求，不等于 ledger 里的消息 | Bridge from bit-exact Target honesty |
| `prefix-vs-tail` | Durable prefix vs turn tail | cwd/date/git pollution story |
| `hashes` | `prefixHash` 与 `requestShapeHash` | Local diagnostics model |
| `usage-split` | Cache hit / miss / write / output / reasoning | Normalization + derived miss |
| `attribution` | Miss 上升时的归因梯 | Component-hash ladder |
| `tool-economy` | Active tools ≠ dispatch registry | `load_tools` discipline |
| `cost-fail-open` | 不为 cache 删除事实 | Cross-link §02/§03 |

Keep §01’s existing worldview sections; this cluster attaches **after** replay layers (or as expansion of the current “bit-exact wire replay” honesty paragraph).

---

## Invariants readers must learn

1. **Usage before compression claims** — measure hit/miss/write/output/reasoning before celebrating shorter prompts.  
2. **Two diagnostic layers** — durable prefix vs full request shape.  
3. **Local ≠ provider** — Maka hashes diagnose *our* stable serialization; provider may hash differently.  
4. **Volatile facts belong in turn tail** — date, cwd, git status, fresh memory updates.  
5. **History is projection** — optimize the view; do not destroy the ledger for cache.  
6. **Schema visibility ≠ permission** — `load_tools` advertises; PermissionEngine authorizes.  
7. **Active schema hash uses provider-visible tools only** — not the full local registry.  
8. **Fail-open correctness** — archive/compact/hydration failures keep source-derived safety over cache locality.  
9. **Single assembly authority** — diagnostics attach to the real `AiSdkBackend` request path; no shadow loop.  
10. **Derived miss must be labeled** — if miss is computed as `input − hit − write`, provenance is `derived`, not provider-native.

---

## Section specs

### 1. Request materialization bridge (`request-shape`)

Connect to §01 replay honesty:

- Semantic replay from RuntimeEvent = Current.  
- Bit-exact wire replay = Target / incomplete (system prompt, tool catalog, projection policy, provider options participate).  
- Cost spine teaches the **diagnostic model** of that materialization — not a claim of full wire snapshot in the ledger.

Scene hook (archive pressure #1): history budget lowered total input tokens while **cache miss and estimated cost rose**.

### 2. Durable prefix vs turn tail (`prefix-vs-tail`)

```text
provider-visible request
  durable prefix
    model / provider identity
    system prompt
    provider options
    active tool schema
  history projection          # prior messages view
  current user content
  turn tail                   # volatile facts
```

| Goes in durable system prompt | Goes in turn tail |
| --- | --- |
| Stable behavior rules | Current cwd |
| Long-lived user preferences | Git status |
| Workspace / skills instructions | Date / platform |
| Opt-in active local memory (stable) | Fresh memory updates this Turn |

Failure story: team believes “system prompt unchanged” while date/cwd rewrite it every Turn → `prefixHash` chatters → miss rises → root cause misattributed to history.

### 3. Two hashes (`hashes`)

From Current `computeRequestShapeDiagnostic`:

**`prefixHash`** ← stableHash of:

- `modelProviderHash`
- `systemPromptHash`
- `providerOptionsHash`
- `toolSchemaHash` (active/visible tools only)

**`requestShapeHash`** ← stableHash of the above **plus** `historyProjectionHash`.

Change classifiers (teach as reasons, not exhaustive UI copy):

| Reason | Typical meaning |
| --- | --- |
| `first_turn` | No prior diagnostic |
| `model_or_provider_changed` | Connection/model identity |
| `system_prompt_changed` | Durable prompt bytes |
| `tool_schema_changed` / `tool_source_enabled` / `tool_source_state_changed` | Active schema / economy load |
| `provider_options_changed` | Options blob |
| `history_projection_changed` | Prior messages view (compact/prune/tail growth) |
| `stable` | No component change detected |

Must land line: **These are Maka-local diagnostics.**

Optional advanced: `capturePreparedProviderRequest` segment order (tools → system → messages; provider options retained but not claimed cacheable) + `findFirstChangedCacheableSegment` — aside or footnote, not first viewport.

### 4. Usage split (`usage-split`)

Internal counters readers should name:

| Counter | Role |
| --- | --- |
| cache hit (cache read) input tokens | Provider reported reuse |
| cache miss input tokens | Fresh input — **check provenance** |
| cache write input tokens | Tokens written into provider cache |
| output tokens | Completion |
| reasoning tokens (when present) | Separate from ordinary output when provider exposes |

Miss provenance:

- Provider-native miss field when present.  
- Else **derived**: `max(0, input − hit − write)` with `cacheMissInputSource = derived`.  
- Never invent counters when usage is missing — record diagnostic gap.

Cost teaching (light): separate unit prices for miss / read / write / output; do not pretend a single “input price” explains DeepSeek-class bills.

### 5. Attribution ladder (`attribution`)

When miss rises, walk **in order**:

1. Model / provider identity changed?  
2. System prompt changed (volatile pollution)?  
3. Provider options changed?  
4. Active tool schema changed (`load_tools` / economy)?  
5. History projection changed (compact, prune, natural growth, hydration)?  
6. Current turn tail / user content only? (full shape moves; prefix may be stable)

Interpretation patterns:

| Observation | Likely story |
| --- | --- |
| `prefixHash` stable, `requestShapeHash` changed | History/tail churn; prefix locality may still help |
| `prefixHash` changed + `system_prompt_changed` | Placement bug or intentional prompt edit |
| `prefixHash` changed + tool schema reason | Economy load or catalog churn |
| Total input ↓ but miss ↑ | Classic false win — measure before celebrating |

### 6. Tool schema economy (`tool-economy`)

```text
Full dispatch registry     → local execute capability (providerTools)
Provider-visible activeTools → schemas on the wire this step
```

Teaching beats:

- Economy mode: ungrouped visible; groups hidden until `load_tools`.  
- Load is an explicit Runtime fact; next Turn can reseed from ledger.  
- Execute-boundary guard: cannot call a tool in the same step before it is in the step-start active set.  
- **Load ≠ permission grant.**  
- `toolSchemaHash` must hash **visible** tools only — hashing the full registry would false-fire changes and hide loads.

### 7. Cost fail-open (`cost-fail-open`)

Cross-link, do not duplicate protocols:

- §02: archive fail → keep full tool result message.  
- §03: compact fail → safe source-derived context; no false coverage.  
- Hydration fail → never fake raw bytes.  
- Cache hit is never a reason to delete ledger facts or skip integrity checks.

Keystone line:

> Optimize the provider-visible view; never destroy the source to chase a hit rate.

---

## Suggested figures

| Figure | Content |
| --- | --- |
| **PrefixVsShape** | Two nested rectangles: durable prefix inside full request shape; turn tail + history outside prefix |
| **AttributionLadder** | Vertical ladder of the six questions; branches to “prefix stable / prefix moved” |
| **ActiveVsRegistry** | Full registry vs active wire set; `load_tools` arrow; permission engine orthogonal |
| Optional **UsageSplitBars** | Hit / miss / write / output (not a dashboard — one composition teaching figure) |

Reuse §01 replay-layers figure: add a callout that materialization feeds the cost spine.

---

## Mechanism-PR aside candidates

| Pin | Why |
| --- | --- |
| `maka:pr:21` | Request-shape prefix diagnostics (mechanism intro) |
| `maka:pr:23` | Cache-aware request shape diagnostics |
| Tool-economy / `load_tools` wiring PRs | Prefer mechanism PR that introduced economy active set (pin at rewrite time via history ingest) |
| `maka:pr:316` / `maka:pr:729` | Only as **secondary** cross-links from §02/§03 — not primary cache aside |

Docs-land architecture PRs are secondary.

---

## Placement relative to other research tickets

| Ticket | Boundary |
| --- | --- |
| [#39](https://github.com/tt-a1i/agent-atelier/issues/39) §01 spine | Owns SessionManager→ToolRuntime, terminal race, permission-as-action; **hosts** this cluster |
| [#36](https://github.com/tt-a1i/agent-atelier/issues/36) §02 | Owns archive-before-placeholder; points here for miss attribution |
| [#37](https://github.com/tt-a1i/agent-atelier/issues/37) §03 | Owns checkpoint pipeline; lean `cache-pointer` section points here |

Implementation order suggestion (even-depth parallel OK): land this plan’s Decision on map #34 → narrative can ship with §01 deepen ticket or as a focused “§01 cost-spine” task that also drops §02/§03 callout paragraphs.

---

## Suggested implementation ticket

`Task: Teach request-shape / prefixHash cost spine in §01 (+ §02/§03 callouts)`

Acceptance:

1. Home section present in §01 with hashes + attribution ladder + non-goal callout.  
2. Reader quiz: can explain “shorter but more expensive” without archive doc.  
3. Explicit sentence: `prefixHash` is not provider cache key.  
4. §02 and §03 each have ≤1 short pointer paragraph.  
5. Primary aside pins `21`/`23` class mechanism PRs.  
6. No seventh chapter; no invented provider internals.

---

## Code map (for writers)

1. `packages/runtime/src/request-shape.ts` — `computeRequestShapeDiagnostic`, `canonicalizeToolSet`, prepared capture  
2. `packages/runtime/src/tool-availability.ts` — economy / `load_tools` / active set  
3. `packages/runtime/src/telemetry/record-llm-call.ts` — miss derivation + provenance  
4. `packages/runtime/src/telemetry/cost.ts` — split pricing  
5. `packages/runtime/src/ai-sdk-backend.ts` — assembly + diagnostic attach point  
6. Desktop prompt placement: `buildSystemPrompt` / `buildTurnTailPrompt` (host)  

Tests: `request-shape.test.ts` (+ availability/economy tests as found).

---

## Open questions (do not block plan)

1. Exact length of cost spine inside §01 vs a collapsible “advanced” block — **Recommend:** full ladder in main prose; prepared-segment first-diff as advanced.  
2. Whether EN key terms stay English (`prefixHash`, `cacheMissInputSource`) — **Yes.**  
3. Map #34 should append this home Decision when #38 closes.
