# Deep outline — Workspace privacy + SECURITY contract

**Ticket:** [#59](https://github.com/tt-a1i/agent-atelier/issues/59) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline + companion shipped — lean §01 `#trust` + `/guides/security-privacy` (zh+en)  
**Atelier home:** lean §01 `#trust` + companion [`/guides/security-privacy`](../../src/pages/guides/security-privacy.astro)  
**Cross-links:** §01 `#permission` / `#sandbox` · bot IM input surface (#58)

## Specimen sources (authority order)

1. **Authority docs:** root `SECURITY.md`, `docs/workspace-privacy-context.md`  
2. **Code:** `packages/core/src/incognito.ts`, `apps/desktop/src/main/main.ts` (`getWorkspacePrivacyContext`), consumer gates (web-search, thread-search, local-memory, plan-reminders, automation)  
3. **Sandbox honesty:** `packages/runtime/src/sandbox/README.md` + SECURITY §2.2  
4. **Tests:** `incognito.test.ts`, `thread-search.test.ts`, `web-search-boundary.test.ts`, `web-search-agent-tool.test.ts`, `local-memory-service.test.ts`, `memory.test.ts`

## Goal (reader can teach)

1. Load-bearing LLM boundary = **OS user account**; permission/redaction/allowlists are UX heuristics.  
2. Seatbelt exists in code; **not** a product boundary until compositions route through it (SECURITY honesty).  
3. `WorkspacePrivacyContext = { incognitoActive }` — main owns truth; malformed never defaults to `false`.  
4. `incognitoActive: false` ≠ blanket allow; each consumer still applies own gates.  
5. Token boundary: cleartext never main→renderer; credentials.json 0o700/0o600 OS-account boundary.

## Non-goals

- Security theater (claiming PermissionEngine contains adversarial LLM)  
- Duplicating full consumer inventory in docs (composition + tests own it)  
- Teaching threat-model archives as Current (#60 history-only)

---

## Teaching spine

| `#id` | Title |
| --- | --- |
| `os-boundary` | 唯一 load-bearing 边界 |
| `heuristics` | Permission / redact / URL / WebSearch fail-closed |
| `seatbelt-honesty` | Code ≠ product boundary today |
| `privacy-context` | Main authority + validator |
| `consumer-rule` | false ≠ allow |
| `token-boundary` | IPC mask + credentials store |
| `report-scope` | In-scope vs ordinary issues |

## Honesty trilogy

| Doc | Job |
| --- | --- |
| `SECURITY.md` | Trust model + report scope |
| `workspace-privacy-context.md` | Tiny privacy contract |
| sandbox README | Platform transform Current |

## Consumer inventory (cite tests, do not freeze in prose)

WebSearch, thread search, local memory, plan reminders, automation can-fire, memory write validator — all fail-closed when `incognitoActive` or invalid authority snapshot.

## Failure matrix

| Input / claim | Result |
| --- | --- |
| Malformed privacy context | reject; consumers fail closed |
| PermissionEngine bypass report | in-scope security |
| redactSecrets miss novel format | out-of-scope advisory (ordinary issue) |
| Cleartext IPC leak | in-scope |

## Acceptance

Live §01 lean callout states OS boundary + Seatbelt honesty + privacy context rule without theater. Companion optional.
