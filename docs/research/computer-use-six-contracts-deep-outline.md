# Deep outline — Computer-use six-contract suite

**Ticket:** [#47](https://github.com/tt-a1i/agent-atelier/issues/47) under [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline mined from **six current CU docs + `packages/computer-use` + runtime `openai-computer-*` + archive hardening that still teaches**  
**Atelier home (decided):** companion **`/guides/computer-use`** (+ lean pointers from §01 tool surface / §02 evidence) — **not** a seventh worldview chapter  
**Cross-links:** §01 `#permission` (approval ≠ freshness) · §02 evidence classes · §04 throwaway ≠ OS sandbox · sandbox outline (Seatbelt orthogonal)

## Specimen sources (authority order)

1. **Current contracts (A):**
   - `docs/computer-use-foundation-contract.md` — stacked-PR non-breakable foundation (8 clauses + validation matrix)
   - `docs/computer-use-model-loop-foundation.md` — `maka_computer` primary path; native `computer_call` observation-only default
   - `docs/computer-use-evidence-classes.md` — `real-runtime` / `fault-injection` / `hermetic-protocol` / `static-contract`
   - `docs/computer-use-provider-evidence.md` — provider matrix qualification; sanitizer; first real runs
   - `docs/computer-use-host-events-contract.md` — typed host producers + deliberate gaps
   - `docs/cua-driver-artifact-integrity.md` — pin/hash boundary; `distributionReady: false`
2. **Code (wins):**
   - `packages/computer-use/src/{select-backend,cua-driver-*,display-snapshot,computer-use-overlay-hook}.ts`
   - `packages/runtime/src/{openai-computer-loop,openai-computer-codec}.ts` (+ actions/policy tests)
   - Desktop host wiring that selects cua-driver (apps/desktop — cite at narrative time)
3. **Tests-as-spec (E):** `packages/computer-use/src/__tests__/*`, `packages/runtime/src/__tests__/openai-computer-*.test.ts`
4. **Archive that still teaches (C)** — mine durable policies, do not re-litigate PR logs:
   - `computer-use-runtime-hardening.md` — session tombstone, per-session queue, generation release
   - `computer-use-executor-hardening.md` / `evidence-hardening.md` / `physical-input-guard.md`
   - process-restart / real-AX E2E notes as evidence-class illustrations
5. **External reverse-lab** (foundation doc cites; **not** in-repo links) — only for intuition, never as maka authority

## Goal (reader can teach)

1. Observation authority: `frameId + epoch`, capture-local coordinates, no global z-order retarget.  
2. Action binding + exact target validation: stale/replay/unclaimed/malformed/targetless **fail closed**.  
3. Execution ownership: **cua-driver is the only native executor**; agent must not CGEvent / steal focus.  
4. Postcondition: transport success ≠ business success; `verified:true` needs effect/readback.  
5. Approval is **app capability / graded lease**, never proof of observation freshness.  
6. Presentation (cursor/PiP) is **downstream of targeting** — cannot authorize or rewrite coordinates.  
7. Model loop: primary `maka_computer` AX/semantic path; coordinate/pixel paths disabled fail-closed; native OpenAI computer loop observation-only by default.  
8. Evidence classes are **qualification boundaries**, not marketing labels.  
9. Host events only from typed attributable producers; AX/DOM churn ≠ `user_intervened`.  
10. Artifact integrity ≠ notarization / Gatekeeper / reproducible build.

## Non-goals

- Re-teaching full PermissionEngine park/grant (link §01 `#permission`)  
- Claiming Linux/Windows CU, or headless CU (foundation: Desktop primary; headless out of scope)  
- Inventing a seventh cognitive chapter for “desktop agents”  
- Replaying the 73-commit restack history as curriculum  
- Teaching 29 bundled SKILL bodies

---

## Teaching spine (companion `/guides/computer-use`)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `scene` | 为什么 Computer Use 需要合同而不是 demo | TOCTOU / stale claim / focus steal |
| `six` | 六份合同怎么叠 | foundation → model-loop → evidence → provider → host-events → artifact |
| `observation` | Observation authority | frame/epoch/pid/window/page; capture-local coords |
| `bind-validate` | Binding + exact target | claim/fingerprint; occlusion; semantic refetch |
| `executor` | cua-driver ownership | sole native executor; keyboard ownership revoke rules |
| `postcondition` | Fresh observation + verified | consume old frame; no retry of old coords |
| `approval-privacy` | Graded leases + redaction | approval ≠ freshness; secrets out of durable log |
| `presentation` | Presentation isolation | overlay cannot retarget |
| `model-loop` | `maka_computer` vs native computer | AX-first; observation-only native path |
| `evidence` | Four evidence classes | matrix cells; fault-injection cannot qualify real |
| `host-events` | Typed producers + gaps | intervention/lock/blocked_url; no inferred physical input |
| `artifact` | Integrity vs distributionReady | hash pin ≠ notarization |
| `failures` | Fail-closed matrix | stale, occlusion, missing observation_id, unknown outcome |
| `verify` | Tests + E2E commands | cite `__tests__` + `e2e:computer-use-*` |
| `archive` | Hardening lessons (durable) | tombstone, per-session queue, generation release |

Lean chapter pointers:

- §01 after `#tool-economy`: one paragraph + link to guide (CU tools also participate in schema/hash economy).  
- §02: evidence-class vocabulary when discussing tool-result qualification (optional forward link).

---

## Protocol figures (must ship with narrative)

1. **Stack diagram:** model tool → facade → observation bind → cua-driver → postcondition → model.  
2. **Freshness swimlane:** approval lease · observation epoch · action claim · dispatch · invalidate events.  
3. **Evidence-class table:** which class can fill a `real` provider matrix cell.  
4. **Host-event producer map:** typed outcomes → Runtime session state (re-observe / locked / terminal).  
5. **Failure matrix** (below).

---

## Invariants (must survive compression)

1. Coordinates are meaningful only inside the producing frame; dispatch never re-picks topmost window.  
2. Mutations snapshot/normalize/fingerprint/claim **before** first async boundary.  
3. Stale / replay / unclaimed / malformed / targetless → fail closed; **no** bare-pixel or focus-steal fallback.  
4. cua-driver owns discovery, semantic prep, input dispatch, effect readback.  
5. Keyboard ownership bound to `session + turn + generation + pid + windowId + page/frame`; revoked on fail/stale/new observation/intervention/service generation/turn-session end.  
6. Child process exit with unknown outcome → **re-observe**, never auto-replay.  
7. `verified:true` requires action-specific effect/readback; transport OK is insufficient.  
8. Approval is graded short lease by action class; not observation freshness.  
9. Sensitive UI content default-out of durable session log / telemetry / eval reports.  
10. Presentation cannot select, transform, authorize, or alter execution coordinates.  
11. Only `real-runtime` qualifies a provider matrix `real` cell; missing evidence is invalid/inconclusive, never inferred from fixture alone.  
12. `readOnlyHint`-style trust stories do not apply here — CU mutations are mutations.  
13. Artifact check proves pinned bytes/signature structure for local/package inputs — **not** distribution readiness.

---

## Current vs Target / honesty (field-accurate)

| Topic | Current | Open / Target |
| --- | --- | --- |
| Primary model path | `maka_computer` via AiSdkBackend | Keep |
| Coordinate / pixel / CGEvent | Disabled, fail closed | Stay disabled unless new contract |
| Native OpenAI `computer_call` | Observation-only experimental default | Full native batch = separate gated contract |
| Physical intervention producer | Typed driver outcomes; **no** global macOS physical-input producer claimed | Attributable host event source |
| Approval graded leases | Foundation requires; validation matrix historically FAIL→fix in split chain — **code+tests win** | Keep narrative honest to tests |
| Privacy redaction | Contract + sanitizer; foundation matrix tracked gaps | Persistence-level privacy gates |
| Page identity / documentFingerprint | PARTIAL in baseline matrix | Fill fingerprint + document replacement tests |
| Binary provenance | Archive/binary hash pin PASS | `distributionReady` needs notarization/SBOM chain |
| Headless CU | Out of foundation scope | Do not invent |

---

## Failure matrix (teaching table)

| Situation | Result |
| --- | --- |
| Action claims old `frameId` after new observation | stale → fail closed |
| Missing / ambiguous semantic target | reject; no guess |
| Occlusion / geometry / scale / page identity mismatch | reject |
| Model omits `observation_id` on `set_value` | typed tool error; model must re-observe |
| Transport OK but effect readback fails | `supported:true, ok:false` terminal for that action |
| Unknown child outcome / service mismatch | re-observe; no auto-replay |
| Overlay not ready | bounded fail-open on timing only; never rewrite coords |
| Fault-injected `user_intervened` | valid regression; **cannot** fill `real-runtime` cell |
| Hermetic protocol pass | protocol evidence only |
| Artifact hash mismatch | integrity fail; not silent reuse |

---

## Mechanism asides

- Prefer tests + intro PRs that landed frame binding / per-session queue / store:false Responses continuation over docs-land PRs.  
- Archive hardening: tombstone on `clearSession`, observation lease for host-reading actions, generation-aware release (do not clear unrelated session B).  
- Operator commands (evidence classes doc): `e2e:computer-use-real`, `e2e:computer-use-process-restart`, `e2e:computer-use-real-model`.

---

## Glossary collisions

| Phrase | Means | Must say |
| --- | --- | --- |
| “Computer use” | Desktop CU contract suite | Not generic “the agent used a computer” |
| Approval / permission | Graded CU lease **and/or** Runtime PermissionEngine | Name which gate |
| Sandbox | Seatbelt / Headless throwaway / CU fixture isolation | Three different objects |
| Evidence | CU evidence **class** vs §02 tool-result archive | Link carefully |

---

## Acceptance for later Task / live guide

Live zh+en `/guides/computer-use` is done when a reader can:

1. Recite observation → claim → validate → dispatch → postcondition without inventing focus-steal fallbacks.  
2. Explain why approval ≠ freshness.  
3. Fill the evidence-class table for a provider matrix cell.  
4. State host-event deliberate gaps (no inferred physical input).  
5. Distinguish artifact integrity from distribution readiness.

**Outline alone ≠ Destination for this seam; companion narrative must ship.**
