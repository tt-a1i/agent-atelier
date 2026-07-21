# Diagram & animation stack for report-grade visuals

**Ticket:** [Recommend diagram and animation stack for report-grade visuals](https://github.com/tt-a1i/agent-atelier/issues/3)  
**Date:** 2026-07-21  
**Status:** Decision recorded (research only — deps not installed in this ticket)

## Context

Agent Atelier is an Astro 7 + MDX site with NewsLiquid research-report chrome:

| Token | Value |
| --- | --- |
| Background | `#FBFAF7` (`--bg`) |
| Accent | `#0E6E6E` (`--accent`) |
| Hairline | `#E7E3DA` (`--hair`) |
| Soft fill | `#F4F1EA` (`--soft`) |
| Type | Source Serif 4 / Inter / JetBrains Mono |

Destination quality is **perfect, not MVP**. The cognitive track needs **many** readable flow / architecture diagrams. Libraries may be added freely once chosen; prefer open source, maintainable, Astro/Vite-friendly.

## Recommended stack (lean)

| Layer | Pick | Role |
| --- | --- | --- |
| **Volume diagrams** | **D2** via **`astro-d2`** | Text-to-SVG at build time for the majority of chapter flows |
| **Hero / keystone diagrams** | **Hand-authored SVG** (Astro components / `.svg` imports) | Pixel-perfect NewsLiquid composition for chapter openers & signature figures |
| **Interactive exploration** | **`@xyflow/react`** (React Flow) as an **opt-in island** | Pan/zoom/focus on dense graphs only — not the default path |
| **Data charts** | **`@observablehq/plot`** (add when first needed) | Token/cost/timeline-style report charts; SVG-first |
| **Motion** | **CSS** + **`motion` mini** (`import { animate, inView } from "motion"`) | Reveals, staggered labels, light SVG draw-on; gate with `prefers-reduced-motion` |

Do **not** install everything on day one. Install in this order as content demands it:

1. `astro-d2` (+ D2 binary **or** `experimental.useD2js`) when the first MDX flow lands  
2. `motion` when the first non-CSS reveal needs sequencing  
3. `@astrojs/react` + `@xyflow/react` only when a diagram truly needs pan/zoom  
4. `@observablehq/plot` when the first quantitative figure is authored  

---

## 1. Flow / architecture diagrams — D2 + hand SVG

### Why D2 (`astro-d2` ^0.13, peer `astro >= 7`)

- **Visual quality:** Out-of-the-box layout and theming beat Mermaid for architecture/flow figures; closer to report-grade defaults.
- **Build-time SVG:** Zero client JS for the common case; no FOUC; print/PDF/share snapshots stay correct.
- **Astro 7 fit:** `astro-d2@0.13.1` explicitly peers on Astro ≥ 7; uses `@terrastruct/d2` (WASM wrapper available).
- **Theming hooks:** Theme IDs + custom `.ttf` fonts in config → align Inter / Source Serif; colors can track cream/teal/hair rather than generic blue dashboards.
- **Layouts:** `dagre` for simple flows; prefer **`elk`** for nested containers and denser agent pipelines. (OSS engines only — skip paid TALA unless we later buy it.)
- **Authoring velocity:** Fenced ` ```d2 ` blocks in MDX keep dozens of diagrams maintainable in git.

Suggested config direction (when implementing):

```js
// astro.config.mjs — illustrative; not applied in this research ticket
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import astroD2 from 'astro-d2'

export default defineConfig({
  integrations: [
    astroD2({
      // Put d2 BEFORE mdx
      layout: 'elk',
      sketch: false,           // report chrome ≠ hand-sketch
      pad: 64,
      inline: true,            // style with page CSS; site is light-only today
      theme: { default: '0', dark: false },
      // fonts: { regular: '…/Inter-Regular.ttf', bold: '…' },
      // experimental: { useD2js: true }, // CI without installing d2 binary
    }),
    mdx(),
  ],
})
```

**NewsLiquid styling practice:** Treat D2 output as a base SVG, then wrap in a figure with site CSS (`border-top: 1px solid var(--hair)`, serif captions, accent strokes via D2 vars / post-CSS). Prefer cream fills and teal emphasis over neon/dark “tech” themes.

### Why hand-authored SVG for keystones

Volume diagrams can be “good D2.” Signature chapter diagrams must be **compositionally intentional** — typography hierarchy, label placement, and hairline grammar matching the masthead. Astro can import `.svg` as components and style with CSS variables. Animate selected paths/groups with CSS or `motion` without a client diagram runtime.

**Rule of thumb:**

- **D2** — most § flows, sequence-ish pipelines, container nesting, “many and readable.”  
- **Hand SVG** — chapter hero figure, homepage specimen map, any diagram that must win a brand test after nav is removed.  
- **React Flow island** — only when the reader must explore a dense graph (zoom, focus node, toggle layers).

---

## 2. Charts — Observable Plot (when needed)

For later token/cost/latency style figures:

| Criterion | Plot | Notes |
| --- | --- | --- |
| Aesthetic | Journalism / research SVG | Matches report chrome better than dashboard canvases |
| Bundle | Modest, tree-shakeable marks | Add only when a chapter needs quantitative viz |
| Astro | Framework-agnostic; mount in a small island or build SVG at build time | Prefer static SVG when data is fixed |

Defer install until the first real dataset figure exists. Do not pre-load a chart ecosystem “just in case.”

---

## 3. Animation — CSS + Motion mini

| Concern | Approach |
| --- | --- |
| Hovers, hairline fades, simple expands | Pure CSS `transition` / `@keyframes` |
| Scroll reveal, stagger labels, SVG stroke-draw | `motion` **mini** API (`animate`, `inView`, optionally `scroll`) ~ few kB |
| Complex multi-scene chapter storytelling | Revisit **GSAP** only if Motion timelines prove insufficient |

Use:

```js
import { animate, inView } from 'motion'
// or: import { animate, inView } from 'motion/mini'
```

Do **not** default to `motion/react` — that pulls React islands for every animated figure. Islands stay reserved for true interactivity (React Flow, exploratory Plot).

### Accessibility / `prefers-reduced-motion`

Mandatory policy for all diagram motion:

1. **CSS:** wrap decorative motion in `@media (prefers-reduced-motion: no-preference) { … }`. Under `reduce`, show the final state immediately (opacity 1, no translate).
2. **JS (`motion`):** before calling `animate` / registering `inView`, check  
   `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — if true, skip or jump to end state.
3. **SVG draw-on / parallax / large pans:** disable under reduced motion; keep static readable diagram.
4. **React Flow:** default to non-animated fit; disable animated edge/node transitions when reduced motion is set.
5. **Meaning ≠ decoration:** never encode information only in motion (e.g. a step that only appears via animation). Caption + static structure must stand alone.
6. **Focus:** interactive diagrams need keyboard-reachable controls and an accessible name (`figure` + `figcaption` / `aria-label`).

Astro View Transitions (if enabled later) already hammer-disable under reduced motion in recent Astro; custom diagram motion still needs explicit gates.

---

## Rejected alternatives (near-misses)

### Diagrams

| Option | Verdict | Why rejected as primary |
| --- | --- | --- |
| **Mermaid** (+ client or `rehype-mermaid`/Playwright) | Reject as default | Defaults fight NewsLiquid; client bundle is heavy (~hundreds of KB) or SSR needs Playwright; FOUC risk. Keep only for GitHub README convenience, not site figures. |
| **PlantUML** | Reject | UML-centric syntax; dated visual grammar; weak fit for narrative agent flows. |
| **Graphviz alone** | Reject as authoring UX | Excellent engines, poor default aesthetics and content ergonomics vs D2. (ELK inside D2 covers hard layouts.) |
| **Structurizr / C4 DSL** | Reject for now | Strong for enterprise C4; over-constrained vs Maka pedagogical flows; another toolchain. |
| **Excalidraw runtime** | Reject as renderer | Friendly authoring, but sketch aesthetic clashes with report chrome; OK as **export-to-SVG** authoring if someone prefers it offline. |
| **React Flow for every diagram** | Reject as default | Superb interactive editor DNA; client JS + React tax on every page; wrong default for a static research site. Opt-in island only. |
| **Raw D3 for diagrams** | Reject for volume | Maximum control, minimum throughput for dozens of chapter figures. |

### Charts

| Option | Verdict | Why rejected as primary |
| --- | --- | --- |
| **Chart.js** | Reject | Canvas-first; dashboard look; weaker typographic/SVG integration for print-like reports. |
| **Apache ECharts** | Reject for sparse report charts | Kitchen-sink power and weight; overkill until we need Sankey-at-scale or huge canvases. |
| **Recharts / Nivo** | Reject as default | React-only tax; Plot covers report charts without committing every figure to an island. |
| **Plotly** | Reject | Large footprint; science-dashboard vibe. |
| **Vega-Lite** | Hold / secondary | Excellent spec-driven charts; slightly more ceremony than Plot for our expected sparse figures. Reconsider if many LLM-generated specs appear. |

### Animation

| Option | Verdict | Why rejected as primary |
| --- | --- | --- |
| **GSAP as default** | Defer | Production-proven timelines, but heavier mental + bundle cost; license/plugin surface larger than we need for first motion system. Escalate later if chapters need filmic scrubbing. |
| **Full `motion/react` (Framer) everywhere** | Reject as default | Requires React islands broadly; mini/vanilla API is enough. |
| **Anime.js** | Near-miss | Fine library; Motion’s WAAPI-based mini path + current maintenance/ecosystem edges it out for Astro. |
| **Lottie / Rive as system** | Reject as infrastructure | Great for illustration moments; not a diagram or chapter-flow system. Optional later for a single hero motif. |
| **AutoAnimate alone** | Insufficient | Nice for list reflow; does not cover SVG choreography or scroll-tied diagram reveals. |

---

## How it plugs into Astro

```
MDX chapter
  ├─ ```d2  ──► astro-d2 (build) ──► inline/static SVG ──► figure + CSS
  ├─ <HeroFlow /> ──► Astro SVG component (tokens via CSS vars)
  ├─ <ExploreGraph client:visible /> ──► React island (@xyflow/react)  [rare]
  └─ <CostChart client:visible /> ──► Plot island or prebuilt SVG     [when data]

global.css
  └─ @media (prefers-reduced-motion: …) + diagram figure chrome

script (island or layout)
  └─ motion mini: inView reveals only if reduced-motion = no-preference
```

**Vite/Astro notes:**

- Keep `astro-d2` **before** `mdx()` in `integrations`.
- Prefer **build-time** diagram SVG so cognitive-track pages stay mostly zero-JS.
- Islands: `client:visible` (or stricter) for React Flow / Plot — never `client:load` on every chapter.
- CI: either install the `d2` binary **or** enable `experimental.useD2js` (WASM via `@terrastruct/d2`) so deploys don’t depend on a global binary.

---

## Package fitness snapshot (researched 2026-07-21)

| Package | Version checked | License / notes |
| --- | --- | --- |
| `astro-d2` | 0.13.1 | Peer `astro >= 7`; wraps D2; optional WASM |
| `@terrastruct/d2` | 0.1.33 | D2.js WASM wrapper used by integration |
| `motion` | 12.x | MIT core; use mini/vanilla imports |
| `@observablehq/plot` | 0.6.x | ISC; SVG marks |
| `@xyflow/react` | 12.x | MIT; React 17–19 |

Site today: `astro@^7.1.3`, `@astrojs/mdx@^7.0.3` only — recommendation-only; no deps added in this ticket.

---

## Implementation checklist (follow-up work, not this ticket)

1. Add `astro-d2` with NewsLiquid-tuned theme/fonts; document authoring conventions in a short `docs/` note or ADR when first diagram ships.  
2. Create `src/components/diagrams/` for hand SVG keystones + a shared `<DiagramFigure>` chrome (caption, hairline, optional lightbox).  
3. Add a tiny `prefersReducedMotion()` helper used by any `motion` / island code.  
4. Pilot one § chapter with 3–5 D2 flows + one hand SVG hero before widening.  
5. Add Plot / React Flow only on demonstrated need.

---

## Decision summary

**Adopt a two-speed diagram system:** D2 build-time SVG for volume, hand SVG for keystones; Motion mini + CSS for motion; Plot and React Flow as opt-in islands. Reject Mermaid/ECharts/GSAP/React-Flow-everywhere as defaults — they optimize for the wrong aesthetic, bundle, or interaction model for a NewsLiquid-grade Astro report site.
