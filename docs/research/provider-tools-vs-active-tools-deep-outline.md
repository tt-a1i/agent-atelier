# Deep outline — providerTools ≠ activeTools (request-shape / tool economy)

**Ticket:** [#67](https://github.com/tt-a1i/agent-atelier/issues/67)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34) · inventory seam #5  
**Date:** 2026-07-21  
**Status:** research complete → narrative deepen shipped in §01 `#tool-economy` / `#request-shape` (CN+EN)  
**Atelier home (locked):** §01 cost spine; companion notes already in `cache-request-shape-teaching-plan.md`  
**Related:** [#38](https://github.com/tt-a1i/agent-atelier/issues/38) cache teaching plan · [#66](https://github.com/tt-a1i/agent-atelier/issues/66) mid-turn may count schema growth

## Specimen sources (authority order)

1. **Code (wins):**  
   - `packages/runtime/src/request-shape.ts` — `canonicalizeToolSet`, `computeRequestShapeDiagnostic`, `toolSchemaHash` over **visible** subset, `toolSchemaCharsForDiagnostics`  
   - `packages/runtime/src/tool-availability.ts` — `ToolAvailabilityRuntime`, economy inert when no gated groups, `load_tools` connector, ledger seed, `prepareStep`  
2. **Tests:**  
   - `request-shape.test.ts` — allow-list visibility; providerTools full registry; inactive schema drift ignored; activation fires `tool_schema_changed`  
   - `tool-availability.test.ts` — full mode / economy / seed / diagnostics / connector robustness  
   - (adjacent) `deferred-tools-*.test.ts` — prepareStep / wire legacy paths

## Gap vs prior §01 text

Already on site: ActiveVsRegistry diagram; bullet list “economy / load ≠ permission / toolSchemaHash visible-only”.

**Remaining protocol (this deepen):**

1. Dispatch vs advertise as two axes with explicit types (`CanonicalToolSet`).  
2. `canonicalizeToolSet(activeNames?)` — omit allow-list ⇒ full surface; invalid repair tool in providerTools but never advertised.  
3. Economy is **inert** when `economy: true` but no hideable groups (`gatedNames.size === 0`) — falls back to full mode (no connector, no gating, no diagnostics).  
4. Same-turn activation only honors live `load_tools`; historical connector names seed from ledger only.  
5. `toolSchemaHash` / char diagnostics hash **provider-visible** tools only — unloaded group schema drift must not false-fire; load must be distinguishable from churn.  
6. PermissionEngine remains orthogonal (advertise ≠ authorize ≠ load).

**Narrative Task recommendation:** gap closed by this deepen — **no separate follow-up Task** required unless a later corpus raise adds MCP-visible schema interactions beyond the lean MCP outline pointer.

---

## Invariants (exam-ready)

1. **Dispatch never depends on advertisement.** A gated-and-unloaded tool stays in `providerTools` so it remains executable once its group loads.  
2. **Wire schemas = `activeTools`.** AI SDK serializes the model-visible subset; withheld schemas stay off the wire.  
3. **`toolSchemaHash` ⊂ active/visible.** Inactive schema edits do not change the hash; activating a hidden tool does.  
4. **Economy bites only when there is something to hide.** No gated members ⇒ full surface even if the config flag is on.  
5. **Load is a Runtime fact.** Same-turn via `prepareStep`; cross-turn via ledger seed of connector calls.  
6. **Load ≠ permission grant.** Execute-boundary gating tracks the step-start active snapshot; PermissionEngine still authorizes.  
7. **Historical connectors are seed-only.** `load_tool` / `connect_tool_source` rehydrate prior activations; same-turn activation ignores them.  
8. **Invalid/repair tool is dispatchable but never advertised.**

---

## Dual-axis table (must ship)

| Axis | Type / carrier | Changes when | Affects |
| --- | --- | --- | --- |
| Dispatch registry | `providerTools: MakaTool[]` | Catalog composition (+ connector + invalid) | Local execute / repair targets |
| Advertise / wire | `activeTools: string[]` | Economy groups + `load_tools` + `prepareStep` | Provider schemas, `toolSchemaHash`, prefixHash |
| Authorize | PermissionEngine | User/policy grants | Whether an advertised call may run |
| Economy switch | `ToolAvailabilityConfig.economy` | Config; inert if no groups | Whether connector/gating exist |

---

## `canonicalizeToolSet` protocol

```text
visibleTools = tools \ {invalid} , sorted by name
activeTools  = visibleTools filtered by activeNames? (omit ⇒ all visible)
providerTools = [...visibleTools, invalid]
```

Comments in source are teaching authority: dispatch never depends on visibility; activeTools is what the SDK puts on the wire.

---

## Economy runtime sketch

```text
economy effective = config.economy && gatedNames.size > 0
full mode → advertise all; diagnostics undefined; no prepareStep
economy mode → alwaysActive = ungrouped ∪ {load_tools}
                step0 active = alwaysActive ∪ seeded groups
                prepareStep recomputes from send-global steps (monotonic per send)
```

Diagnostics report active subset, enabled/available groups, schema-char reduction vs full surface — only in economy mode.

---

## Hash interaction with cost spine

`computeRequestShapeDiagnostic`:

- `toolSchemaHash = stableHash({ activeTools, providerVisibleTools(providerTools, activeTools).map(shape) })`  
- Inactive deferred tool schema change → hash **stable** (no false `tool_schema_changed`)  
- Activating a hidden tool → hash **moves** + `tool_schema_changed`  
- Mid-turn capacity trigger (seam #4) may count same-turn schema growth from `load_tools` — still about the outgoing request, not a second cache key

---

## Mechanism PR pins

| Aside | Role |
| --- | --- |
| `maka:pr:30` | Layer-1 deferred loading (`load_tool`) — historical |
| `maka:pr:34` | Tool Source Economy v1 (`connect_tool_source`) — historical |
| `maka:pr:41` | Unify deferred + economy into `ToolAvailabilityRuntime` / `load_tools` |
| `maka:pr:21` / `maka:pr:23` | Request-shape / cache diagnostics (existing §01 aside) |

---

## Test filename index

| File | Pins |
| --- | --- |
| `request-shape.test.ts` | allow-list; full registry; inactive drift ignored; activation changes hash |
| `tool-availability.test.ts` | full/economy/inert; prepareStep; ledger seed; historical names; diagnostics |
| `deferred-tools-prepare-step.test.ts` | same-turn wire activation (adjacent) |
| `deferred-tools-wire.test.ts` | SDK activeTools surface (adjacent) |

---

## Acceptance checklist

- [x] Invariants + test filenames listed  
- [x] Deltas vs prior `#tool-economy` / `#request-shape` named  
- [x] Recommend: **no further narrative Task** after this deepen  
- [x] §01 CN+EN deepened (not outline-only)
