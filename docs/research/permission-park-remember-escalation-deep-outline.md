# Deep outline — PermissionEngine park/remember vs sandbox escalation one-shot

**Ticket:** [#76](https://github.com/tt-a1i/agent-atelier/issues/76)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research complete → §01 `#permission` deepen (CN+EN); `#sandbox` already owns escalation mechanics — add contrast link only  
**Atelier home (locked):** §01 `#permission` immediately before `#sandbox`  
**Related:** sandbox outline [#46](https://github.com/tt-a1i/agent-atelier/issues/46) / Task [#62](https://github.com/tt-a1i/agent-atelier/issues/62) · inventory seam #6

## Thinness assessment

§01 already teaches allow/block/prompt and a full `#sandbox` Escalation one-shot paragraph. Remaining gap: **park + rememberForTurn protocol** vs **one-shot grants that forbid remember** — not another Seatbelt matrix.

## Specimen sources (authority order)

1. **Code:** `packages/runtime/src/permission-engine.ts` — turn `remembered` set, `TurnScopedAwaitRegistry` park, `recordResponse` auto-resolve siblings  
2. **Code:** `packages/runtime/src/sandbox-escalation.ts` + additional-permissions one-shot consume path  
3. **Tests:** `permission-engine.test.ts` · `permission-engine-additional-permissions.test.ts` · `sandbox-escalation.test.ts`  
4. **PRs:** `#1016` one-shot sandbox escalation · `#969` additional permission grants

## Goal (reader can teach)

1. `prompt` parks a Promise in a **turn-scoped** registry keyed by `requestId`; Kernel `respondToPermission` resolves it — Run identity preserved.  
2. Ordinary tool permission may set `rememberForTurnAllowed: true`; user allow + `rememberForTurn` adds `scopeKey` to the turn’s remembered set and **auto-resolves other parked prompts with the same scope** (parallel tool batch UX).  
3. Sandbox escalation and additional-permission proposals set `rememberForTurnAllowed: false`; responses that carry `rememberForTurn` **throw**; grants bind toolUseId + intent/command/cwd and are **consume-once** (TTL).  
4. Approval ≠ unsandboxed standing mode; approval ≠ Seatbelt transform (link `#sandbox`).

## Non-goals

- Re-teaching Seatbelt/bwrap selection matrix  
- §04 TaskRun park/Inbox (different object — link only)  
- Claiming PermissionEngine contains adversarial LLM (`#trust`)

---

## Contrast table (load-bearing)

| Axis | Ordinary permission (remember allowed) | Sandbox escalation / additional grant |
| --- | --- | --- |
| Park | Yes — `decision.parked` Promise | Yes — same registry, different event.kind |
| `rememberForTurnAllowed` | often `true` | **always `false`** |
| User `rememberForTurn: true` | scope remembered for turn; sibling parks auto-allow | **rejected** (`One-shot permission responses cannot use rememberForTurn`) |
| Grant lifetime | remembered scope until turn end | TTL + **single consume**; mismatch → typed error |
| Bound identity | tool intent `scopeKey` | exact command/cwd/intentHash (escalation) or permissionsHash (additional) |
| After allow | execute under normal sandbox profile | may skip sandbox transform for that one call only |

Turn end: still-parked requests reject as user_stop / escalation_aborted — no silent allow.

---

## Mechanism PR pins

| Aside | Role |
| --- | --- |
| `maka:pr:1016` | One-shot sandbox escalation + auto review |
| `maka:pr:969` | One-shot additional permission grants |

---

## Site placement

| Slot | Job |
| --- | --- |
| §01 `#permission` | Add `#park-remember` subhead + contrast table + lean diagram |
| §01 `#sandbox` Escalation | Keep mechanics; add one sentence “contrast with remember-for-turn → `#permission`” |

## Diagram brief

Two lanes after PROMPT park: remember-for-turn (scope set + sibling resolve) vs one-shot grant (consume · no remember).
