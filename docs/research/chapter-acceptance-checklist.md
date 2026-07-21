# Per-chapter perfect acceptance checklist

**Ticket:** [Define per-chapter perfect acceptance checklist](https://github.com/tt-a1i/agent-atelier/issues/6)  
**Date:** 2026-07-21  
**Status:** Decision recorded

## Context

Destination quality is **perfect, not MVP**. A cognitive-track chapter (§01–§06) may exist as WIP in the repo, but **must not be marked complete** until every hard-gate item below passes.

**Q1 (human, accepted):** checklist is a **hard gate** — any missing item ⇒ chapter is **not done**.

Applies to routes locked in [#2](https://github.com/tt-a1i/agent-atelier/issues/2):

| § | Route |
| --- | --- |
| §01 | `/chapters/01-log-is-the-runtime` |
| §02 | `/chapters/02-evidence-before-compression` |
| §03 | `/chapters/03-compaction-is-a-projection` |
| §04 | `/chapters/04-the-durable-task-loop` |
| §05 | `/chapters/05-self-check-is-not-self-trust` |
| §06 | `/chapters/06-self-iteration-happens-outside-the-runtime` |

Entry `/` is **not** a § chapter; it has its own lighter bar (导读 complete + bilingual + chrome) and is out of this checklist’s “chapter done” definition.

Cites prior locks: [diagram stack](./diagram-animation-stack.md) · [history UX / asides](./history-track-ux.md) · [bilingual workflow](./bilingual-content-workflow.md).

---

## Hard gate (all required)

Mark a chapter **done** only when **every** box below is true for **both** locales (zh default + `/en/…`).

### 1. Narrative

- [ ] Teaches the chapter’s **core question** from Maka’s six-chapter index (not a commit dump or API catalog).
- [ ] Reading path is self-contained enough that a reader arriving from `/` or the previous § can follow without undocumented prerequisites (cross-links OK).
- [ ] Clear section outline; no placeholder “TBD / 待写” sections left in the done build.
- [ ] Distinguishes **Current** vs **Target** where Maka does (do not present Target as shipped).
- [ ] Chinese-first source stabilized, then EN translated ([bilingual](./bilingual-content-workflow.md)); zh wins on drift until re-sync.

### 2. Diagram + motion

- [ ] **≥1 keystone** figure: hand-authored SVG (or equivalent composition) for the chapter opener / signature idea — NewsLiquid tokens (`--bg` / `--accent` / `--hair` / `--soft`; Source Serif 4 / Inter / JetBrains Mono).
- [ ] **≥3 volume flow diagrams** (D2 via `astro-d2` or hand SVG) covering the chapter’s main mechanisms — readable at report density, not a single dump graph.
- [ ] Motion (if any) uses CSS and/or `motion` mini; **gated by `prefers-reduced-motion`** ([diagram stack](./diagram-animation-stack.md)).
- [ ] React Flow / Plot only if the chapter truly needs pan-zoom or quantitative charts — not default.
- [ ] Every figure has bilingual **caption**; meaningful graphics have bilingual **alt** (or adjacent text equivalent).

### 3. History asides

- [ ] At least **one** evolution aside that deep-links into `/history` (or `/en/history/…`) with a real `maka:pr:<n>` (preferred) or `maka:commit:<sha>` present in the archive pin.
- [ ] Budgets respected ([history UX](./history-track-ux.md)): **≤3 asides / section**, **≤8 / chapter** (unless a justified Evolution subsection).
- [ ] Aside tone = caption/footnote; one short sentence + in-atelier link; not a competing H2 or mini-changelog.
- [ ] Locale-correct hrefs (`/history/…` vs `/en/history/…`).

### 4. Accessibility

- [ ] Valid document outline (`h1` once; sections descend without skips).
- [ ] Keyboard: skip link / focus order sane; no keyboard traps in islands.
- [ ] Color contrast adequate on cream/teal chrome; do not rely on color alone for meaning in diagrams.
- [ ] `prefers-reduced-motion` honored for animated diagrams.
- [ ] Decorative SVG marked appropriately; informative SVG exposed via text/alt/caption.

### 5. Bilingual (same ship unit)

- [ ] zh + en ship together — **no** “zh done / en TODO” ([bilingual](./bilingual-content-workflow.md)).
- [ ] Section/heading parity across locales (natural phrasing OK; structure must match).
- [ ] Full EN prose — not stub, summary-only, or raw MT dump labeled done.
- [ ] Locale switcher lands on the paired slug; `lang` and titles correct per locale.

### 6. Chrome / product polish

- [ ] Uses shared report layout (NewsLiquid masthead, § label, prev/next chapter nav).
- [ ] Responsive: readable from ~360px to wide desktop; diagrams don’t clip unreadably (scroll or reflow OK).
- [ ] No stub chrome (fake TOC, “lorem”, broken locale switcher, missing §).
- [ ] Shareable URL stable (`/chapters/NN-slug` / `/en/chapters/NN-slug`).

---

## Explicitly not required for “chapter done”

| Item | Notes |
| --- | --- |
| Full `/history` archive UI | History track has its own tickets; chapter only needs working aside **links** into the pin |
| Every Maka draft in `docs/architecture/` rewritten | Teach the milestone; deep-dives may link out |
| React Flow on every chapter | Opt-in only |
| Translated corpus of all upstream PR titles | UI locale + aside copy suffice |
| Site-wide hosting/CDN | Separate open question on map #1 |
| Entry `/` treated as §07 | Entry is outside this checklist |

---

## WIP vs done (process)

| State | Allowed |
| --- | --- |
| WIP in repo | Yes — unfinished chapters may exist behind clear “草稿 / Draft” labeling |
| Linked as complete from `/` TOC or § nav “完成” | **No** until hard gate passes |
| Partial ship of one locale | **No** |

Optional frontmatter when implementing:

```yaml
status: wip | done
checklistVersion: 1
```

`done` is a lie unless this checklist is satisfied.

---

## Decision summary

**Hard-gate acceptance for §01–§06:** narrative completeness, report-grade diagram+motion (keystone + ≥3 flows, reduced-motion safe), sparse history asides within budgets, a11y, bilingual same-ship parity, and polished NewsLiquid chrome. WIP is fine; marking complete without every gate is not.
