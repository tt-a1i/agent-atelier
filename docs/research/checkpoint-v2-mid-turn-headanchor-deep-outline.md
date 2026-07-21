# Deep outline — Checkpoint V2 prefix digest + mid_turn headAnchor

**Ticket:** [#65](https://github.com/tt-a1i/agent-atelier/issues/65)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34) · inventory seam #3  
**Date:** 2026-07-21  
**Status:** research complete → narrative shipped in §03 `#mid-turn` (CN+EN)  
**Atelier home (locked):** deepen §03; lean cross-link from §02 three-lifecycles  
**Related:** [#66](https://github.com/tt-a1i/agent-atelier/issues/66) shaping ≠ verdict · [#50](https://github.com/tt-a1i/agent-atelier/issues/50) execution-evidence spine Phase 2C

## Specimen sources (authority order)

1. **Code (wins):**  
   - `packages/runtime/src/history-compact-checkpoint.ts` — schema, `sourceDigest`, `phase`, `headAnchor`, `matchHistoryCompactCheckpointPrefix`, `canReplaceHistoryCompactCheckpoint`, `projectHistoryCompactCheckpointReplay`  
   - `packages/runtime/src/mid-turn-capacity-compact.ts` — builds `phase: mid_turn` checkpoints (orchestration only; verdict elsewhere)  
2. **Tests:**  
   - `history-compact-checkpoint.test.ts` — prefix match, CAS replace, empty/mixed-session/partial reject, bounded recovery  
   - `history-compact-mid-turn-checkpoint.test.ts` — headAnchor fail-closed, replay `[block, anchor, tail]`, pre_turn id stability  
3. **Docs (secondary):** `docs/execution-evidence-spine.md` Phase 2C — `runtime_event_projection` cursors + policy version bind the covered prefix without claiming AgentRun append-log identity

## Goal (reader can teach)

1. V2 `sourceDigest` is a **byte-identity** over the stable-serialized covered RuntimeEvent prefix — not summary quality.  
2. `phase: mid_turn` folds a prefix that **reaches into the current turn**; coverage still includes the head-anchor user event.  
3. `headAnchor` must be the **compacted turn’s user event** (= last covered event’s turn, `role=user` / `author=user`) — not “any covered user”.  
4. Replay is deterministic: `pre_turn` → `[block, …tail]`; `mid_turn` → `[block, verbatim head anchor, …tail]`.  
5. Match/replace are **fail-closed**; corrupt anchor → `coverage_miss`, not silent drop of the current prompt.

## Non-goals

- Re-teaching the full pre_turn rolling pipeline (already in §03 `#pipeline` / `#rolling`)  
- Mid-turn **capacity verdict** ownership (that is [#66](https://github.com/tt-a1i/agent-atelier/issues/66))  
- Claiming bit-exact provider wire replay

---

## Conceptual schema delta (vs §03 five field groups)

```text
HistoryCompactCheckpoint (V2)
  … existing identity / high water / coverage / projection / lineage …
  coverage.sourceDigest   # sha256:… over length-prefixed stableStringify(event) stream
  source?                 # evidence-spine: runtime_event_projection cursors + policyVersion
  phase?                  # absent | pre_turn | mid_turn  (absent ≡ pre_turn for legacy)
  headAnchor?             # { runtimeEventId, turnId } — required iff phase === mid_turn
```

Teaching beats:

| Field | Proves | Does **not** prove |
| --- | --- | --- |
| `sourceDigest` | Covered prefix bytes unchanged since build | Summary completeness / natural-language truth |
| `source.coverage` cursors | Low/high event ids + policy-versioned projection stream | That Compaction input is an AgentRun append log |
| `phase: mid_turn` | Fold reached into the active turn | That the turn is finished |
| `headAnchor` | Which covered user event is re-rendered verbatim | That the summary “remembers” that prompt |

---

## Fail-closed build rules (`buildHistoryCompactCheckpoint`)

Must throw (no durable candidate):

1. Empty covered set  
2. Mixed `sessionId` across covered events  
3. Any `partial === true` in coverage (streaming snapshot is later replaced/deleted → digest would never replay)  
4. Blank summary  
5. `phase: mid_turn` without `headAnchor`  
6. `headAnchor.runtimeEventId` not in covered set  
7. Anchor is **not** the compacted turn’s user event:
   - `anchored.turnId !== headAnchor.turnId`, or  
   - `anchored.turnId !== lastCovered.turnId`, or  
   - `role !== 'user'` / `author !== 'user'`  
   Subtlety: a self-consistent prior-turn user event inside coverage is still illegal — it would silently drop the real current prompt on replay.

`checkpointId` hashes phase/anchor **only when set**, so legacy `pre_turn` ids stay stable when phase is absent vs explicit `pre_turn`.

---

## Fail-closed match rules (`matchHistoryCompactCheckpointPrefix`)

Returns zero coverage + reason (never fuzzy reuse):

| Reason | Trigger |
| --- | --- |
| `invalid_checkpoint` | Shape validation fails (incl. mid_turn without headAnchor fields) |
| `coverage_miss` | Count / session / through boundary / source cursor miss; **or** mid_turn headAnchor corrupted / wrong turn / not user |
| `source_hash_mismatch` | Recomputed digest ≠ `coverage.sourceDigest` |

Mid_turn match re-checks the same “last covered turn’s user” rule so a tampered durable record cannot replay without the current prompt.

---

## Replace rules (`canReplaceHistoryCompactCheckpoint`)

Accept only:

1. **Forward progress** — candidate `eventCount` > current, or no current; or  
2. **Exact same-coverage CAS rewrite** — equal counts / through / digest / source cursors, and `previousCheckpointId === current.checkpointId`.

Reject:

- Source-bound current replaced by legacy candidate lacking `source`  
- Source stream policy/streamId mismatch  
- Equal count without being an explicit successor of the same coverage

---

## Replay projection

```text
pre_turn  → [synthetic compact block, ...uncoveredTail]
mid_turn  → [synthetic compact block, verbatim headAnchor event, ...uncoveredTail]
```

Coverage still **includes** the head-anchor event for digest math (contiguous prefix). Projection **re-inserts** it so the model sees the exact current-turn user message after the lossy block. Specimens: `projectHistoryCompactCheckpointReplay` / `midTurnHeadAnchorEvent`.

---

## Evidence-spine Phase 2C (one paragraph)

Compaction operates on the session/model-context Runtime Event **projection**, not a single AgentRun append log. Checkpoint `source` carries `kind: runtime_event_projection`, policy `maka.compactable_runtime_event_projection.v1`, and inclusive low/high cursors. Digest still validates the complete ordered prefix; successors remain raw. Legacy V2 without `source` stays readable; a source-bound tip must not hide behind an unprovable legacy record.

---

## Mechanism PR pins

| Aside | Role |
| --- | --- |
| `maka:pr:729` | Replace history compact artifacts with **ledger checkpoints** (V2) |
| `maka:pr:996` | Mid-turn capacity compaction + mid_turn checkpoint phase (introduces headAnchor path) |
| `maka:pr:1014` | Reland merges — keeps mid_turn/headAnchor protocol after snapshot squash |

Docs-land secondary; do not elevate over code/tests.

---

## Diagram brief (shipped)

**`MidTurnHeadAnchorFlow`:** ordered pool → covered prefix (includes anchor) → synthetic block + verbatim anchor + tail; fail-closed callout for wrong-turn user.

---

## Acceptance checklist

- [x] Fail-closed match/replace rules listed  
- [x] headAnchor “last covered user of turn” subtlety taught  
- [x] PRs #729 / #996 / #1014 pinned  
- [x] Narrative home §03 `#mid-turn` CN+EN (not outline-only)
