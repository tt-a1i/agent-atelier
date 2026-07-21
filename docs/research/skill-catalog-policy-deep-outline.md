# Deep outline — Skill catalog policy + invocation

**Ticket:** [#53](https://github.com/tt-a1i/agent-atelier/issues/53) under [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline mined from `skill-catalog-policy.md` + `skills.ts` / `skill-invocation.ts` + tests  
**Atelier home (decided):** lean **§01 `#skills`** (tool surface / prompt economy) — mechanism only  
**Cross-links:** §01 `#tool-economy` · `#permission` · `#mcp` · desktop bundled catalog (product, not Destination)

## Specimen sources (authority order)

1. **Current contract (A):** `docs/skill-catalog-policy.md`  
2. **Code (wins):**  
   - `packages/runtime/src/skills.ts` — scan, gate, budgeted catalog fragment, lazy `Skill` tool  
   - `packages/runtime/src/skill-invocation.ts` — explicit `/skill:` / chip composition contract  
   - Desktop: `managed-skill-sources.ts`, `bundled-skill-catalog.generated.ts` — governance **outside** runtime authority  
3. **Tests-as-spec:** `skills.test.ts`, `skill-invocation.test.ts`, desktop skills/bundled-catalog tests  
4. **Product surface (F — dig v3):** `apps/desktop/resources/bundled-skills/*/SKILL.md` ×29 — agent-contract patterns mined at `/guides/skills-corpus` (map #90); mechanism still this outline + §01 `#skills`
5. **Archive:** `ui-skills-deep-read-2026-06-2{3,4}.md` — UI chronicle only if needed

## Goal (reader can teach)

1. Skill **bodies stay out** of always-on system prompt; prompt holds bounded **catalog** only.  
2. Read-only `Skill` tool lazy-loads full instructions when matched.  
3. Deterministic discovery order: project → workspace compat → user; first-found wins on id; within dir by display name.  
4. Disable + host capability gates (`required-tools` / `required-capabilities`) before budget truncation.  
5. `allowed-tools` / `declaredTools` are **informational** — never grant permission.  
6. Catalog budget: 2% of model context window, clamped 4k–8k tokens @ 4 chars/token; fallback `MAX_SKILLS_PROMPT_CHARS = 18000`.  
7. Model context window is **explicit prompt input**, not implicit provider lookup inside scanner.  
8. Budget omission lists omitted ids; omitted enabled+compatible skills remain loadable by id/name.  
9. Explicit invocation (`skill-invocation`) injects trust-framed `<invoked-skill>` blocks; lower priority than system/developer/safety/permission; cannot grant tools.  
10. Runtime vs Desktop: runtime owns scan/catalog/load; desktop owns lock/provenance/managed sources.

## Non-goals

- Dumping each skill’s full workflow essay into §01 (that lives at `/guides/skills-corpus`)  
- Office seeding / marketplace UX deep dive  
- Claiming skills bypass PermissionEngine

---

## Teaching spine (§01 `#skills`)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `skills` | Catalog ≠ body | Always-on vs lazy load |
| `discover` | Source precedence | first-found wins |
| `gate` | Host capabilities | required vs allowed |
| `budget` | 2% clamp | model window as input |
| `invoke` | Explicit invocation | trust frame; no Skill re-call |
| `permission` | declaredTools ≠ grant | Engine authority |
| `desktop-split` | Runtime vs governance | ownership |
| `failures` | disabled / missing host / body too large | matrix |

---

## Protocol figures

1. **Pipeline:** discover → exclude disabled → host gate → fill catalog until budget → omit list → lazy Skill / explicit invoke.  
2. **Trust stack:** system/developer/safety/permission ≫ skill instructions ≫ model improvisation.  
3. **Budget formula table:** contextWindow → token clamp → chars.  
4. **Parallel to MCP:** both inject tools/content without becoming a second loop; both cannot self-authorize.

---

## Invariants

1. Always-on prompt never embeds full skill bodies by default path.  
2. PermissionEngine remains sole grant authority.  
3. `allowed-tools` never grants.  
4. Host gate runs **before** budget truncation (incompatible skills never advertised).  
5. Omission ≠ disable: load-by-id still works for eligible skills.  
6. Explicit invocation tells model not to call Skill again for those ids.  
7. Per-request load failures do not block other invocations or the send.  
8. Skill instructions subject to separate lazy-load body size limit.  
9. Path containment / safe skill ids enforced at scan.

---

## Current vs Target

| Topic | Current | Notes |
| --- | --- | --- |
| Catalog budget | 2% clamp 4–8k tokens | Fallback 18000 chars |
| Host gate | optional `HostCapabilities` | undefined = legacy no-gate |
| Desktop governance | lock/provenance/managed | Not runtime truth |
| Bundled catalog | generated + seeded | Product surface |

---

## Failure matrix

| Situation | Result |
| --- | --- |
| Skill disabled | excluded from catalog and invoke list |
| `required-tools` missing on host | hidden (`required_tools_missing`); not advertised |
| Budget exceeded | later entries omitted; ids listed; still loadable |
| Unknown invoke name | per-request failure; others proceed |
| Body too large | validation error / load fail |
| Skill claims `allowed-tools: Bash` | informational only; Engine still gates |
| Duplicate id across sources | first-found wins |

---

## Mechanism asides

- Cite `skills.test.ts` budget + gate order.  
- Cite `skill-invocation.test.ts` trust framing.  
- Do not aside every bundled SKILL.md.

---

## Acceptance

Reader can:

1. Explain catalog vs body.  
2. Recite discovery precedence + first-found.  
3. State budget formula and why model window is an input.  
4. Explain allowed/declared tools ≠ permission.  
5. Distinguish runtime mechanism from desktop governance.

**Live §01 `#skills` should ship with this research close.**
