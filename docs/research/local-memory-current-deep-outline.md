# Deep outline — Local memory Current whitebox

**Ticket:** [#85](https://github.com/tt-a1i/agent-atelier/issues/85) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research + companion `/guides/local-memory` CN+EN  
**Atelier home:** Companion + §01 `#request-shape` lean pointer  
**Archive aside only:** [`memory-whitebox-archive-delta.md`](./memory-whitebox-archive-delta.md)

## Specimen sources (Current wins)

1. `packages/core/src/local-memory.ts` + `__tests__/local-memory.test.ts`
2. `apps/desktop/src/main/local-memory-service.ts` + service/UI contract tests
3. Injection: `apps/desktop/src/main/system-prompt-main.ts` (`buildLocalMemoryPromptFragment` / turn-tail updates)
4. Privacy: `WorkspacePrivacyContext.incognitoActive` → `incognito_blocked`

## Design encoding (do not invent Dream/vector)

1. **Two switches:** `enabled` (file feature; default true) · `agentReadEnabled` (prompt inject; default **false**; normalize fail-closed — only `=== true` enables).
2. **Disk:** `<workspace>/memory/MEMORY.md` + `PENDING.md`; dir `0o700`, files `0o600`; atomic write + chmod.
3. **Caps:** `LOCAL_MEMORY_MAX_BYTES = 128KiB` → parse `safeMode`/`oversize`; prompt body `LOCAL_MEMORY_PROMPT_MAX_CHARS = 12000` + truncation marker.
4. **Parse fail-open:** heading entries without metadata still show; unknown HTML-comment fields ignored; oversize → safeMode (no active inject).
5. **Prompt:** only `status=active` (or default active) entries; metadata comments omitted from body; secrets redacted.
6. **Lifecycle:** manual append · proposal in PENDING · approve/reject · archive/restore · backups on save/reset/restore.
7. **Incognito:** blocks read/write; forces `agentReadEnabled: false` in state.
8. **Prefix vs tail:** durable `<local-memory>` only when `agentReadEnabled && status==='ok'`; fresh updates go turn-tail `<memory-update>` (does not promote to system rules).

## Non-claims

- Not a seventh worldview chapter / not TOC memory chapter.
- No embeddings, vector recall, Dream Mode, or agent tool that silently writes durable memory without approval surfaces.
- Archive whitebox is history aside; field names follow Current parsers.

## Acceptance

Companion teaches two-switch + disk + caps + inject boundary; §01 pointer updated; Destination still open.
