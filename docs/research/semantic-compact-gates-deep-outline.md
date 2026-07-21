# Deep outline — Semantic compact failedOpen / privacy / savings gates

**Ticket:** [#75](https://github.com/tt-a1i/agent-atelier/issues/75)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research complete → narrative shipped in §03 `#semantic-gates` (CN+EN); `#kinds` table tightened  
**Atelier home (locked):** §03 after `#kinds`; contrast with historyCompact durable acceptance  
**Related:** [#74](https://github.com/tt-a1i/agent-atelier/issues/74) budget DSL · [#66](https://github.com/tt-a1i/agent-atelier/issues/66) mid-turn fail-open

## Specimen sources (authority order)

1. **Code:** `packages/runtime/src/semantic-compact.ts` — `rewriteSemanticCompactInMessages`, `SemanticCompactDecision`, savings/privacy helpers  
2. **Policy:** `context-budget-policy.ts` `buildSemanticCompactPolicy` — opt-in defaults  
3. **Tests:** `semantic-compact.test.ts` · `context-budget-semantic-compact-policy.test.ts`  
4. **PRs:** `#986` attention-first semantic compaction · `#1069` high-water 128K · defaults via `#1018` / issue #882 PR 3

## Goal (reader can teach)

1. Semantic compact is an **opt-in attention-first experiment**, distinct from historyCompact’s durable coverage contract.  
2. Three gate postures (must not collapse into one “fail-open” slogan):  
   - **failedOpen** — keep raw messages + diagnostic (`head_anchor_mismatch`, source validation fail, selection `failedOpen`).  
   - **Hard reject** (`unchanged`) — e.g. `private_verifier_surface`, summarizer/truncation/budget failures; no replacement.  
   - **Soft savings warning** — `below_min_savings_*` / ratio / net **accepts** `replaced` with warning reason on the block + diagnostic counts.  
3. Privacy gate: summary must not **newly surface** hidden/private verifier material absent from public provider-visible source text.  
4. Controller brake: consecutive invalid summaries → cooldown steps (`semantic_compact_cooldown`).  
5. On a mid-turn capacity-replaced step, semantic **yields** (`mid_turn_capacity_precedence`) — link `#budget-dsl`.

## Non-goals

- Claiming semantic shares V2 durable checkpoint CAS with historyCompact (still Target)  
- Re-teaching mid-turn headAnchor protocol  
- Product marketing of desktop “default on” historical experiments without Current code posture

---

## Decision matrix

| Outcome | When | Provider messages | Acceptance / diagnostic |
| --- | --- | --- | --- |
| `failedOpen` | No usable head anchor; source validation fail; selection failedOpen | **Unchanged** (raw) | `failOpenReason` on compaction decision |
| `unchanged` (reject) | Disabled / brake / dry-run modes; summarizer fail; truncated; `private_verifier_surface`; projection budget exceeded; … | Unchanged | reason + optional invalid-summary counters |
| `replaced` | Gates pass (savings may still warn) | Replacement projection | `accepted`; savings shortfalls as **warning reason**, not hard refuse |
| dry-run modes | `validate_only` / `prepare_step_dry_run` | Unchanged | block built for diagnostics only |

Critical honesty vs older slogans: function name `semanticSavingsRejectionReason` is historical — Current tests pin **accept with warning** when signed savings miss the margin (`accepts with a warning when signed savings…`).

Savings checks (after estimating post-replacement + net = saved − weighted compact-call tokens):

- `minSavingsTokens` (default 256)  
- `minSavingsRatio` (default 0.05)  
- `minNetSavingsTokens` (default 256)

Privacy check (`PRIVATE_VERIFIER_PATTERN`): reject when summary introduces “hidden/private/official verifier|evaluation|…” language **not** present in selected public source text. Prompt also instructs the summarizer not to invent private verifier material.

---

## Opt-in posture

`buildDefaultContextBudgetPolicy`: historyCompact stays on; `semanticCompact` omitted unless:

- `MAKA_CONTEXT_SEMANTIC_COMPACT` truthy, **or**  
- `MAKA_CONTEXT_SEMANTIC_COMPACT_MODE` is a non-`off` mode  

Explicit `off` keeps it out. Default high-water dormancy: ~128K `maxActiveEstimatedTokens` with `highWaterRatio` 1 until crossed.

---

## Mechanism PR pins

| Aside | Role |
| --- | --- |
| `maka:pr:986` | Attention-first semantic compaction |
| `maka:pr:1069` | Lower semantic high water to 128K |
| `maka:pr:1018` | Runtime-owned defaults; semantic stays opt-in |

---

## Site placement

| Slot | Job |
| --- | --- |
| §03 `#semantic-gates` **NEW** | Decision matrix + privacy/savings honesty + diagram |
| §03 `#kinds` | Tighten semantic row: savings = warn-on-accept; privacy = hard reject; failedOpen ≠ reject |
| §03 `#fail` | One cross-link — do not duplicate full matrix |

## Diagram brief

Three columns: failedOpen (keep raw) · hard reject (privacy/summarizer) · soft savings (replace + warn). Footer: opt-in · mid-turn precedence yield.
