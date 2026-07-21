# Deep outline — Mid-turn capacity shaping ≠ final-request verdict

**Ticket:** [#66](https://github.com/tt-a1i/agent-atelier/issues/66)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34) · inventory seam #4  
**Date:** 2026-07-21  
**Status:** research complete → narrative shipped in §03 `#capacity-shaping` (CN+EN); lean pointer from §01 `#request-shape`  
**Atelier home (locked):** §03 companion to `#mid-turn`; do **not** invent an architecture draft upstream of code  
**Related:** [#65](https://github.com/tt-a1i/agent-atelier/issues/65) mid_turn headAnchor protocol · [#67](https://github.com/tt-a1i/agent-atelier/issues/67) tool schema on the wire

## Specimen sources (authority order)

1. **Code (wins) — module doc-comment is primary authority:**  
   - `packages/runtime/src/mid-turn-capacity-compact.ts` — pure shaper: estimate, safe boundary, `planMidTurnCapacityCompaction`  
   - Backend final-request estimate owner (streaming AI SDK backend) — issues `context_budget_exhausted` **after** all shaping hooks  
2. **Tests:**  
   - `mid-turn-capacity-compact.test.ts` — measurement, safe boundary, plan decisions (`skip` / `fail_open` / `compacted`), **no post-fold window verdict in the planner**  
   - `mid-turn-capacity-backend.test.ts` — verdict after prune; load_tools schema growth in trigger; refuse non-shrinking fold; INPUT-token baseline; volatile turn tail; default-on guards

## Goal (reader can teach)

1. The mid-turn module **only shapes**: select largest safe covered prefix → build `mid_turn` checkpoint → emit replacement projection.  
2. On inability to fold, it **fails open** (`fail_open`) — never terminates the turn.  
3. Pass/terminate (`context_budget_exhausted`) is owned by the backend’s **final-request estimate** over the payload that actually goes out.  
4. Safe boundary never straddles a tool call/result pair, never covers partials, retreats before pinned same-turn steering text.  
5. Trigger measurement anchors on last request’s **INPUT** tokens + signed char delta (credits shrink after compaction).

## Non-goals

- Replacing §03 pre_turn high-water teaching  
- Claiming semanticCompact shares the same durable coverage contract (still Target)  
- Documenting every backend review finding as chapter prose (cite tests)

---

## Two owners, one invariant

```text
                    ┌─────────────────────────────────────┐
  estimate trigger  │ mid-turn-capacity-compact (SHAPER)  │
  (high water)  ──► │  selectMidTurnSafeBoundary          │
                    │  planMidTurnCapacityCompaction      │
                    │  decisions: skip | fail_open |      │
                    │             compacted               │
                    │  NEVER issues context_budget_…      │
                    └──────────────┬──────────────────────┘
                                   │ replacement / raw keep
                                   ▼
                    ┌─────────────────────────────────────┐
  after prune +     │ backend FINAL-REQUEST estimate      │
  all shaping  ──►  │  measures outgoing (messages,tools) │
                    │  → continue OR context_budget_…     │
                    └─────────────────────────────────────┘
```

Reader-ready distinction:

| Layer | May say | Must not say |
| --- | --- | --- |
| Shaper | `below_high_water` / `fail_open` / `compacted` | `context_budget_exhausted` |
| Backend final estimate | continue / `context_budget_exhausted` | Pretend a raw-ledger re-estimate after fold equals the outgoing payload |

Why no post-fold verdict in the shaper: after a previous compacted request, the raw covered span was never in that request — subtracting it would over-credit the fold. The backend applies the shape only when the materialized replacement **actually shrinks** the request, then re-measures.

---

## Safe boundary protocol (`selectMidTurnSafeBoundary`)

Largest contiguous cut `coveredCount` such that:

1. Ends on an immutable, non-partial event; any partial in the pool retreats the max cut to before the first partial.  
2. Never straddles a tool call/result pair (provider protocol unit).  
   - Open call (response not yet in pool): any cut past the call is unsafe.  
   - Response without call in pool: inert (call lives before pool).  
3. Leaves `reserveTailEvents` uncovered as verbatim tail (default 1 in planner).  
4. Optional `isPinned`: retreat before first pinned event — used for current-turn `steering: true` text (injection accumulator re-appends live directives; covering them desyncs measurement from the real request).

`no_safe_completed_span` → planner `fail_open` (not a provider error). Backend may still later terminate if the unshaped payload exceeds the window.

Planner also requires: head-anchor index found, `coveredCount > headAnchorIndex`, `coveredCount >= 2` (folding only the anchor saves nothing — it is re-rendered verbatim).

---

## Trigger measurement (`estimateNextRequestTokens`)

| Case | Formula |
| --- | --- |
| Prior usage usable | `floor(priorUsageTokens) + signedChars/charsPerToken` |
| Cold start / unusable input count | whole-payload `coldStartChars` (or appendedChars) / charsPerToken |

Signed negative `appendedChars` **credits** shrink after compaction/prune. `exceedsHighWater` = estimate > `contextWindow - reserve`; hard cap = estimate > raw window. Backend tests pin: usage baseline is last request’s **INPUT** tokens (output not double-counted); cold-start covers full provider input including system prompt; same-turn `load_tools` schema growth counts toward the trigger.

---

## Plan decisions (`planMidTurnCapacityCompaction`)

| Decision | Meaning |
| --- | --- |
| `skip` / `below_high_water` | No fold attempt |
| `fail_open` / `no_safe_completed_span` | Keep raw projection + diagnostic |
| `fail_open` / `summarizer_failed` | Keep raw; typed diagnostic when `HistoryCompactSummarizerError` |
| `compacted` | Durable mid_turn checkpoint candidate + `[block, headAnchor, tail]` replacement |

Rolling: when previous checkpoint is an exact prefix of the new covered set, summarizer only reads newly folded span; full coverage digest still recomputed.

---

## Backend-owned verdict highlights (from tests)

- Verdict issued **after** pruning — a prune-rescuable step is not exhausted.  
- Fold that cannot shrink the real payload is refused (`failedOpen`), not applied (runaway summary).  
- Unrescuable over-window turn → explicit `context_budget_exhausted` stopReason.  
- Default-on guards: no known context window → do not fire; no persisted head anchor (child sessions) → no seam; reserve must not clamp tiny windows to 1-token high water.

---

## Mechanism PR pins

| Aside | Role |
| --- | --- |
| `maka:pr:996` | Title names the invariant: mid-turn capacity + **single final-payload verdict owner** |
| `maka:pr:1014` | Reland mid_turn protocol after squash |
| `maka:pr:1017` | Reactive context-overflow compact-and-retry (adjacent; not the shaper/verdict split itself) |

---

## Diagram brief (shipped)

**`ShapingVsVerdictFlow`:** shaper lane (fail-open) vs backend final-request lane (terminate); safe-boundary constraints as footer.

---

## Lean §01 pointer

Under `#request-shape` / cost spine: mid-turn shaping can change `historyProjectionHash` and active tool schema size; the **window verdict** remains about the outgoing request after shaping — do not teach mid-turn as a second cache-key system.

---

## Acceptance checklist

- [x] Reader-ready shaper fail-open vs `context_budget_exhausted`  
- [x] Safe boundary: no tool-pair straddle, pin steering  
- [x] Cite #996 / #1014 / #1017  
- [x] Code-primary (no invented architecture draft)  
- [x] Narrative home §03 `#capacity-shaping` CN+EN
