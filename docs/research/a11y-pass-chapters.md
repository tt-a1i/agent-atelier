# A11y pass — §01–§06 cognitive chapters

**Ticket:** [A11y pass across §01–§06](https://github.com/tt-a1i/agent-atelier/issues/24)  
**Date:** 2026-07-21  
**Status:** Pass recorded (chapters remain WIP for other checklist gates)

## Scope

Hard-gate items from `docs/research/chapter-acceptance-checklist.md` § Accessibility, applied to zh + `/en` chapter routes after #22/#23 figure and prose work.

## Findings

| Check | Result |
| --- | --- |
| Outline | Single `h1` in masthead; body sections are `h2` via `Section.astro` — no level skips |
| Skip link | Present in `ReportLayout`; target `#main` now has `tabindex="-1"` so focus lands |
| Keyboard | Site nav + chapter pager are plain links; history filter island is form/`select`/`input` — no trap found in static review |
| Contrast | `--ink`/`--bg` ≈ 16.7:1; `--mute`/`--bg` ≈ 5.6:1; `--accent`/`--bg` ≈ 5.8:1 (AA for normal text) |
| Reduced motion | All hand SVG keystones/flows gate stage fades behind `prefers-reduced-motion: no-preference`; reduce → opacity 1, no animation |
| Diagram text alternative | Decorative SVG `role="presentation"`; `DiagramFigure` frame `role="img"` + `aria-label` (alt/caption) + `aria-describedby` figcaption |
| Color-only meaning | Flow figures use indices, labels, and dashed/solid strokes — not hue alone |

## Fixes landed with this pass

- `main#main` → `tabindex="-1"` for skip-link focus.
- `DiagramFigure` associates caption via stable `aria-describedby` id (sha1 of caption/alt).

## Explicitly still open (not this ticket)

- Marking chapters `done` / TOC complete (blocked by remaining checklist items)
- Full automated axe/lighthouse CI gate
- `/en/history/pr|c` detail routes (asides may use zh-canonical `/history/…`)
- Nested history mode keyboard polish beyond v1 filters

## Decision

A11y hard-gate for current chapter chrome + diagrams is **met enough to close #24**. Chapters stay **WIP** until asides audit, deploy, and any remaining narrative/chrome items also pass.
