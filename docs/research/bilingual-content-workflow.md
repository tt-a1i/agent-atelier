# Bilingual content workflow (CN + EN)

**Ticket:** [Lock bilingual content workflow](https://github.com/tt-a1i/agent-atelier/issues/5)  
**Date:** 2026-07-21  
**Status:** Decision recorded

## Context

Destination requires a **perfect CN+EN** atelier — bilingual must not become a half-finished afterthought. Cognitive IA and history UX are already locked; this note locks source language, locale URLs, translation timing, and the page-level “done” bar.

**Q1 (human):** source language = **A Chinese-first**, then translate to English; English proper nouns / established terms may remain in CN prose.

Remaining axes decided from Destination + strong recommendation (URL scheme).

---

## Decision package

### 1. Source of truth = Chinese-first (accepted)

| Rule | Spec |
| --- | --- |
| Author | Write and edit **zh** until the teaching argument is stable |
| Translate | Produce **en** from the locked zh (human or assisted; output must read as intentional EN, not raw MT dump) |
| Terms | Keep English proper nouns / API / package names (`Runtime`, `maka-agent`, tool ids) in both locales as needed |
| Conflict | If locales drift, **zh wins** until deliberately re-synced; fix by updating zh then re-translating, not by forking narratives |

---

### 2. Locale URL scheme = default CN unprefixed + `/en/...`

| Locale | Prefix | Examples |
| --- | --- | --- |
| **zh (default)** | none | `/`, `/chapters/01-…`, `/history`, `/history/pr/1298` |
| **en** | `/en` | `/en`, `/en/chapters/01-…`, `/en/history`, `/en/history/pr/1298` |

**Why (strong rec):** Chinese-first authoring + Destination’s primary teaching audience → default locale should be the shortest URLs. Matches Astro `i18n.defaultLocale` + `prefixDefaultLocale: false`. Avoids doubling every CN link with `/zh`.

**Also lock:**

- Slugs stay **English ARCHITECTURE titles** in both locales (IA already locked) — only chrome/prose/locale UI strings change.
- Locale switcher: same path with/without `/en` prefix; preserve query on `/history` filters when possible.
- Do **not** use `?lang=` as the primary scheme; do **not** require `/zh` prefix for default.

Illustrative Astro config (not applied in this ticket):

```js
i18n: {
  defaultLocale: 'zh',
  locales: ['zh', 'en'],
  routing: { prefixDefaultLocale: false },
}
```

---

### 3. Translation timing = same ship unit

A page/chapter is **one bilingual ship unit**:

1. Stabilize zh narrative + structure (headings, asides, figure slots).  
2. Translate to en **before** marking the unit done.  
3. Never merge “zh done / en TODO” as a finished chapter.

WIP is allowed in the repo; **labeling or linking a chapter as complete** requires both locales. Partial EN stubs (machine-only placeholders, “Translation forthcoming”) are **not** done.

---

### 4. Page-level “done” bar (bilingual)

For any cognitive or history page that claims bilingual completeness:

| Check | Required |
| --- | --- |
| **Parity** | Same section outline / heading tree in zh and en (modulo natural phrasing) |
| **Full EN** | Complete prose — not summary-only or stub |
| **Shared media** | Diagrams/SVG/D2 shared where language-neutral; captions/alt in **both** locales |
| **Asides** | Evolution asides present in both; same `maka:pr` / `maka:commit` targets; locale-correct `/` vs `/en/…` hrefs |
| **Chrome** | `lang`, titles, nav, locale switcher, a11y names correct per locale |
| **No orphan locale** | No en-only or zh-only “done” route for that slug |

History archive UI chrome follows the same locale rules; PR/commit **titles** may remain upstream English with zh surrounding UI — call that out in copy, not a second translated corpus of all PR titles for v1.

---

### 5. Content layout (implementation hint)

Prefer parallel content keyed by locale, e.g. content collections or `src/content/**/zh|en`, rather than one file with both languages interleaved. Exact folder shape can follow Astro i18n when wiring starts; this ticket only locks behavior.

---

### 6. What NOT to do

| Anti-pattern | Why |
| --- | --- |
| Ship CN-complete chapters with EN “coming soon” as done | Violates Destination perfect bilingual bar |
| Default English at `/` with CN under `/zh` | Fights Chinese-first + audience |
| Dual `/zh` + `/en` always-prefixed | Noisy CN URLs; no benefit given default zh |
| Divergent chapter structures per locale | Breaks switcher and teaching parity |
| Maintaining a full translated PR-title corpus as launch gate | History pin is upstream English; UI locale is enough for v1 |

---

## Decision summary

**Chinese-first authoring → English translation; default URLs unprefixed (zh), English under `/en/…`; same ship unit for both locales; page done only with structural parity, full EN, bilingual captions/asides/chrome.** Refuse CN-only “done” and stub EN.
