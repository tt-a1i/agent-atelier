# Deep outline — ContextBudgetPolicy as projection-pipeline DSL

**Ticket:** [#74](https://github.com/tt-a1i/agent-atelier/issues/74)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research complete → narrative shipped in §03 `#budget-dsl` (CN+EN); lean pointer from §02 three-lifecycles  
**Atelier home (locked):** §03 companion to `#pipeline` / `#capacity-shaping`; do **not** invent a seventh chapter  
**Related:** [#64](https://github.com/tt-a1i/agent-atelier/issues/64) three prune lifecycles · [#66](https://github.com/tt-a1i/agent-atelier/issues/66) shaping≠verdict · [#75](https://github.com/tt-a1i/agent-atelier/issues/75) semantic gates

## Specimen sources (authority order)

1. **Code (wins):**  
   - `packages/runtime/src/context-budget.ts` — `ContextBudgetPolicy` interface + `applyRuntimeEventContextBudget`  
   - `packages/runtime/src/context-budget-policy.ts` — `buildDefaultContextBudgetPolicy` (surface-shared defaults)  
   - `packages/runtime/src/ai-sdk-backend.ts` — `composePrepareStep` **doc-comment is the order contract**  
   - `packages/runtime/src/ai-sdk-compaction.ts` — prepareStep builders (active prune / semantic / mid-turn)
2. **Tests:**  
   - `context-budget*.test.ts` · `context-budget-mid-turn-policy.test.ts` · `context-budget-semantic-compact-policy.test.ts`  
   - mid-turn / active-prune backend tests that pin precedence
3. **Docs secondary** — architecture drafts do not own prepareStep order.

## Goal (reader can teach)

1. `ContextBudgetPolicy` is a **projection-pipeline DSL**: optional knobs that compose ordered shaping stages — not a bag of unrelated flags.  
2. There are **two execution planes** with different owners and order contracts:  
   - **Prior-replay** (`applyRuntimeEventContextBudget`) — shapes RuntimeEvent → budgeted prior history.  
   - **Same-turn prepareStep** (`composePrepareStep`) — shapes provider-visible `ModelMessage[]` before the next step.  
3. Order is load-bearing: mid-turn capacity runs **before** active prune and semantic/active-full so later hooks re-converge on its projection; on a capacity-replaced step, semantic **yields** (`mid_turn_capacity_precedence`).  
4. Defaults: historyCompact (+ derived midTurn) on by default; semanticCompact **opt-in**; `MAKA_CONTEXT_BUDGET=off` disables the whole policy.

## Non-goals

- Re-teaching three prune lifecycles (link §02)  
- Re-teaching mid-turn shaping≠verdict (link `#capacity-shaping`)  
- Enumerating every env knob as chapter prose

---

## Plane A — Prior-replay (`applyRuntimeEventContextBudget`)

Contract order inside the function (code):

```text
RuntimeEvents (prior turns)
  → 1. staleToolResultPrune   (compact-input projection; keep on archive failure)
  → 2. historyCompact         (checkpoint / blocks replay + optional write path upstream)
  → 3. turn retention         (maxHistoryTurns / maxHistoryEstimatedTokens + minRecentTurns)
  → BudgetedRuntimeContext { events, diagnostic, historyCompactBlocks? }
```

Optional siblings loaded/hydrated around this path (not all inside the same function body): archive retrieval, history search, synthesis cache, historyRewrite gate diagnostics. Teaching truth: they are **replay-side** enrichments of the prior projection, not same-turn prepareStep hooks.

`token cap` beats `minRecentTurns` wish — never keep “at least N turns” past the estimate budget.

---

## Plane B — Same-turn prepareStep (`composePrepareStep`)

Authoritative order (module doc-comment + filter list):

```text
1. toolAvailability          # advertise / load_tools snapshot (not compaction)
2. midTurnCapacityCompact    # SHAPER only — never issues context_budget_exhausted
3. activeToolResultPrune     # re-archives large results in rebuilt tail
4. activeFullCompact         # semanticCompact ⊕ activeFullCompact (composed)
       └─ on mid-turn replaced step → YIELD (mid_turn_capacity_precedence)
→ AFTER whole pipeline: buildMidTurnFinalRequestVerdict (pass/terminate owner)
```

Why this order:

| Earlier | Later benefit |
| --- | --- |
| Mid-turn fold first | Active prune sees compacted tail; re-archives oversized tool results there |
| Active prune before semantic | Semantic summarizer does not chew raw megabyte tool blobs first |
| Semantic after mid-turn | Hard window invariant owns the step; two summarizers never fight one request |

Every hook **only shapes**. Verdict ownership stays with `#capacity-shaping`.

---

## Policy object as DSL

`buildDefaultContextBudgetPolicy(connection, { env, modelId, name })` is the single owner of defaults across CLI/desktop/headless surfaces (#1018 / issue #882 PR 3). Notable composition:

| Knob | Default posture | Plane |
| --- | --- | --- |
| `historyCompact` (+ `midTurn` derived from window−reserve) | on (unless env off) | A + B (midTurn) |
| `staleToolResultPrune` | on | A |
| `activeToolResultPrune` | on | B |
| `semanticCompact` | **off** until explicit opt-in | B |
| `archiveRetrieval` / `historySearch` / `synthesisCache` | off until env on | A (optional) |
| `MAKA_CONTEXT_BUDGET=off` | whole policy `undefined` | both |

Reserve tokens: classic 16384 capped by known window/4 — avoids 1-token high water on small windows.

Manual `/compact` uses `buildManualCompactLookupPolicy` overlay (lookup-only, tiny highWater) so CLI and desktop do not diverge.

---

## Mechanism PR pins

| Aside | Role |
| --- | --- |
| `maka:pr:1018` | Runtime-owned context compaction defaults across surfaces |
| `maka:pr:996` | Mid-turn capacity + single final-payload verdict (order companion) |
| `maka:pr:1237` | Context-budget domain leaf split (archive / compact ownership) |
| `maka:pr:316` / `#498` | Active prune (plane B) |
| `maka:pr:986` | Semantic compact experiment (plane B; opt-in) |

---

## Site placement

| Slot | Job |
| --- | --- |
| §03 `#budget-dsl` **NEW** | Two-plane DSL + order contract + diagram |
| §03 `#pipeline` | Keep prior-messages 1–10; add one sentence pointing to `#budget-dsl` for prepareStep plane |
| §02 three-lifecycles | Lean pointer: “who runs when” → §03 `#budget-dsl` |
| §03 `#capacity-shaping` / `#kinds` | Already own verdict / kind contrast — link, do not duplicate |

## Diagram brief

Two horizontal swimlanes (Prior-replay vs prepareStep) with numbered stages; footer: “hooks shape · one verdict owner after plane B”.
