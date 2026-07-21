# Static hosting / CDN deploy — bilingual atelier

**Ticket:** [Lock static hosting / CDN deploy pipeline](https://github.com/tt-a1i/agent-atelier/issues/25)  
**Date:** 2026-07-21  
**Status:** Decision recorded — **HITL** to attach a public host (Pages blocked on current private plan)

## Constraints

- Astro static output (`astro build` → `dist/`)
- zh default (no prefix) + `/en/…`
- Thousands of `/history/pr|c/…` pages — pure static OK
- Absolute site paths today are rooted at `/` — **avoid** GitHub project-page `base: /repo/` unless the whole link surface moves to `import.meta.env.BASE_URL`
- Repo is **private**; GitHub API returns: *current plan does not support GitHub Pages for this repository*

## Decision

**Primary host: Cloudflare Pages** (or equivalent) with root path `/`:

1. Connect this GitHub repo in Cloudflare Pages (production branch `main`, build `npm run build`, output `dist`, Node 22).
2. Keep trailing-slash directory indexes (Astro default).
3. Record the `*.pages.dev` (or custom domain) URL on map #1 Decisions when live.

**Why not GitHub Pages first:** private-repo Pages is unavailable on the current plan (422 from REST). Making the repo public or upgrading GitHub would unblock Pages with root/`custom domain` — still valid alternate once policy allows.

**Why not `username.github.io/agent-atelier/` project path:** would require `base: '/agent-atelier/'` and rewriting every absolute `/…` href.

## Pipeline shipped in repo

- `.github/workflows/deploy-pages.yml` (named CI build): on PR/`main` push → `npm ci` + `npm run build`, upload `dist` artifact for 7 days (handoff to any host).
- Local publish check: `npm run build && npm run preview`

## Locale / slash notes

- Emitted as directory `index.html` (`/chapters/01-…/`, `/en/chapters/01-…/`)
- No SPA fallback required
- Locale switcher + `hreflang` already in `ReportLayout`
- History detail remains zh-canonical `/history/pr|c/…` until `/en/history/…` detail routes exist

## HITL remaining

- Create Cloudflare Pages project (or publicize repo / upgrade for GitHub Pages)
- Paste preview URL into map #1 Decisions
- Optional: add `CLOUDFLARE_API_TOKEN` + deploy action later — not required if dashboard Git integration is used

## Out of scope

- Refactoring all absolute paths for project-page subpath hosting
- SSR adapters
