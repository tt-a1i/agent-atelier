# Deep outline — Bot onboarding / IM bridges

**Ticket:** [#58](https://github.com/tt-a1i/agent-atelier/issues/58) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** **shipped** companion `/guides/bot-im` (CN+EN) via Task [#69](https://github.com/tt-a1i/agent-atelier/issues/69) · research [#58](https://github.com/tt-a1i/agent-atelier/issues/58) 
**Atelier home:** companion `/guides/bot-im` · lean §01 input-surface pointer via trust/privacy  
**Cross-links:** [`trust-privacy-security-deep-outline.md`](./trust-privacy-security-deep-outline.md) · SECURITY input surfaces

## Specimen sources (authority order)

1. **Doc:** `docs/architecture/bot-onboarding-runtime.zh-CN.md` (V1 implemented)  
2. **Code:** `packages/core/src/bot-onboarding.ts`, `apps/desktop/src/main/bot-onboarding-main.ts`, `packages/runtime/src/bots/**`, `bot-incoming-main.ts`, `settings-runtime-effects.ts`  
3. **Tests:** `bot-onboarding-main.test.ts`, e2e `bot-onboarding.spec.ts`, bots `__tests__/*`, `bot-incoming-*.test.ts`

## Goal (reader can teach)

1. Onboarding (ephemeral QR/session) ≠ runtime bridge (long-lived).  
2. Secrets stay in main; renderer holds opaque `sessionId` + redacted snapshot.  
3. Credential commit + cancel rollback via `SettingsStore.updateIf` (CAS; volatile status fields excluded).  
4. Runtime maps platform payloads → `BotMessageEvent` → SessionManager; onboarding does not write session JSONL.  
5. Non-goals: platform revoke, multi-account, Keychain, remote pairing.

## Non-goals for Destination

- Full IM product UX tour  
- Treating bot bridges as Runtime chapter worldview

---

## Teaching spine

| `#id` | Title |
| --- | --- |
| `two-paths` | QR onboarding vs manual config |
| `four-layers` | core contract → BotOnboardingService → settings effects → runtime bots |
| `state-machine` | waiting → scanned → connecting → connected / cancelled |
| `rollback-cas` | updateIf + volatile fields |
| `message-boundary` | BotMessageEvent → turn |
| `nongoals` | Keychain / pairing / platform revoke |

## Onboarding vs runtime

```text
Renderer modal → IPC → BotOnboardingService → SettingsStore
  → applySettingsRuntimeEffects → BotRegistry → bridges
  → BotMessageEvent → bot-incoming-main → SessionManager
```

Onboarding session map is memory-only; ledger for agent turns starts only after incoming message path.

## Failure / honesty

| Topic | Current |
| --- | --- |
| Credential saved, bridge not running | `warning`, not fake connected |
| Cancel mid-commit | guarded rollback of owned fields only |
| Transient poll errors | backoff; terminal after consecutive failures |
| Allowlist | `allowedUserIds` — no remote pairing approval |

## Acceptance

Outline + mine-plan status sufficient for research close. Narrative = companion page later; do not inflate §01–§06.
