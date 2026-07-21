# Archive delta — local memory whitebox (two-switch)

**Date:** 2026-07-21 · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34) · Task [#82](https://github.com/tt-a1i/agent-atelier/issues/82)  
**Source (archive, not Current):** `maka-agent/docs/archive/maka-memory-whitebox-contract.md`  
**Site pointer:** §01 `#request-shape` (prefix-stable table) archive aside  
**Current authority:** `packages/core` / desktop `local-memory*` + Settings — code wins on field names.

## Design encoding worth keeping

1. **Two switches, not one:**
   - `enabled` — file feature on/off (disk may still exist when off).
   - `agentReadEnabled` — whether the agent may consume memory in the system prompt (**default OFF**).
2. **Boundary:** a transparent local Markdown file must **not** become implicit durable memory the agent reads without an explicit read switch (kenji boundary in archive).
3. **Fail-open parse:** malformed HTML-comment metadata still renders content; unknown fields should not break V0.1 readers.
4. **Permissions:** directory `0700`, file `0600`, size cap at parse time (archive cited 128 KB — verify against Current constant).

## What atelier does *not* claim

- TOC does **not** open a dedicated memory chapter this pass.
- V0.2/V0.3 field extensions / Dream Mode / vector search remain open questions in archive — not Destination body.
- Do not teach archive disk-format comments as the live schema without grepping Current parsers.

## Link back

Absorb index: [`archive-mine-delta-absorb-batch2-2026-07-21.md`](./archive-mine-delta-absorb-batch2-2026-07-21.md).
