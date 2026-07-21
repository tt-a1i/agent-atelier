# Diagram system proof — Tool loop / §02 keystone

**Ticket:** [Prove the diagram system on the Tool loop milestone](https://github.com/tt-a1i/agent-atelier/issues/7)  
**Date:** 2026-07-21  
**Status:** Prototype landed

## Metaphor policy (locked from user feedback)

Diagram **metaphors are scene-local** — chosen per chapter / figure to teach that scene’s invariant.  
What stays fixed is the **visual system**: NewsLiquid tokens, hand SVG keystones + D2 volume flows, CSS/`motion` with `prefers-reduced-motion`, `<DiagramFigure>` chrome.

Do **not** adopt one global metaphor (e.g. “everything is a pipeline” or “everything is a state machine”) for the whole site.

## Specimen for #7

| Choice | Value |
| --- | --- |
| Route | `/chapters/02-evidence-before-compression` |
| Scene metaphor | Turn-level **evidence pipeline** (matches §02 invariant) |
| Artifact | Hand SVG `EvidencePipelineKeystone.astro` + `DiagramFigure` |
| Motion | Staggered opacity fade; disabled under `prefers-reduced-motion: reduce` |

Components:

- `src/components/diagrams/DiagramFigure.astro`
- `src/components/diagrams/EvidencePipelineKeystone.astro`
- `src/pages/chapters/02-evidence-before-compression.astro`

Chapter body remains WIP; this ticket only proves the visual system in-product.
