# Static hosting / CDN deploy — bilingual atelier

**Ticket:** [Lock static hosting / CDN deploy pipeline](https://github.com/tt-a1i/agent-atelier/issues/25)  
**Date:** 2026-07-21  
**Status:** Decision recorded — **GitHub Pages** (repo publicized)

## Constraints

- Astro static output (`astro build` → `dist/`)
- zh default (no prefix) + `/en/…`
- Thousands of `/history/pr|c/…` pages — pure static OK
- Project Pages URL requires `base: '/agent-atelier/'` and `import.meta.env.BASE_URL` / `withBase()` for root-absolute links

## Decision

**Primary host: GitHub Pages** via GitHub Actions (`dist` → Pages):

1. Repository visibility: **public** (required for Pages on current plan).
2. Production URL: `https://tt-a1i.github.io/agent-atelier/`
3. Astro config: `site: 'https://tt-a1i.github.io'`, `base: '/agent-atelier/'`
4. Workflow: `.github/workflows/deploy-pages.yml` — `withastro/action` build + `actions/deploy-pages`
5. Trailing-slash directory indexes (Astro default); no SPA fallback

**Why not Cloudflare Pages first (earlier draft):** User chose option 2 — publicize + GitHub Pages. Cloudflare remains a valid alternate if root-path hosting (`/`) is preferred later without a `base` prefix.

## Pipeline shipped in repo

- `.github/workflows/deploy-pages.yml`: push/`workflow_dispatch` on `main` → build + deploy to Pages; PRs build only
- Local publish check: `npm run build && npm run preview`

## Locale / slash notes

- Emitted as directory `index.html` (`/agent-atelier/chapters/01-…/`, `/agent-atelier/en/chapters/01-…/`)
- No SPA fallback required
- Locale switcher + `hreflang` already in `ReportLayout` (base-aware via `stripBase` / `localePath`)
- History detail remains zh-canonical `/history/pr|c/…` (under base) until `/en/history/…` detail routes exist

## Out of scope

- Custom domain / root-path hosting without `base`
- SSR adapters
