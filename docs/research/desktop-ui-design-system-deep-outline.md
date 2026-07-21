# Deep outline — Desktop UI design system (agent UX contracts)

**Ticket:** [#86](https://github.com/tt-a1i/agent-atelier/issues/86) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** **shipped** companion `/guides/desktop-ui` (CN+EN)  
**Atelier home:** `/guides/desktop-ui` · lean pointers from `/guides/desktop-host` + entry depth note  
**Cross-links:** [`desktop-main-composition-deep-outline.md`](./desktop-main-composition-deep-outline.md) · [`trust-privacy-security-deep-outline.md`](./trust-privacy-security-deep-outline.md) · [`permission-park-remember-escalation-deep-outline.md`](./permission-park-remember-escalation-deep-outline.md)

## Decision (#86)

**Open a UI / product-shell companion track** — not defer. Cluster-3 docs encode design that changes how agents are supervised (streaming, tool timeline, permission surfaces). Destination still does **not** absorb a full CSS dump or Storybook catalog.

## Specimen sources (authority order)

1. **Code (wins):**  
   - Streaming: `packages/ui/src/smooth-stream.ts`, `assistant-stream.ts`, `thinking-stream.ts`, `tool-output-stream.ts`, `live-turn-projection.ts`, `materialize.ts` (`overlayLiveTurn`, turn timeline)  
   - Tool chrome: `packages/ui/src/tool-activity.tsx` (`ToolTrow`), `tool-activity/presentation.ts`, `trow-summary.ts`, `tool-row-motion.ts`  
   - Permission UI: `packages/ui/src/permission-dialog.tsx` (`PermissionPrompt`), renderer `chat-composer-region.tsx` / `app-shell-overlays.tsx` (composer takeover)  
   - Shell: `apps/desktop/src/renderer/app-shell.tsx` + `app-shell-*` slices; `ChatView` / `Composer` / `SessionListPanel`  
2. **Contract tests:** `smooth-stream.test.ts`, `assistant-stream.test.ts`, `live-turn-projection.test.ts`, `materialize*.test.ts`, `tool-trow-*`, `tool-activity-presentation.test.ts`, `streaming-timeline-render-contract.test.ts`, `permission-composer-takeover-contract.test.ts`, `permission-response-*`, `renderer-style-layer-cascade-contract.test.ts`, `foreground-tier-contract.test.ts`, `renderer-important-audit-contract.test.ts`, `chat-chrome-no-gradient-contract.test.ts`  
3. **Authority docs:** `DESIGN.md`, `docs/frontend-css-governance.md` (+ zh-CN), `packages/ui/README.md`, `apps/desktop/src/renderer/README.md`  
4. **Scratch map (structure only):** `notes/frontend-architecture-map-2026-07-19.md` — absorb AppShell / layer / convergence direction; **campaign R1–R8 checklists = history/process**, not Destination body

## Goal (reader can teach)

1. Product north star is **Companion Command Center**: task-central, inspectable agent activity, calm continuity — not chat-bubble ornament or AI-glow chrome.  
2. Layer stack: `maka-tokens.css` (token SoT) → `@maka/ui` primitives/features → renderer `AppShell` (state + IPC wiring). Hand-rolled CSS is transitional; extend primitives first.  
3. Live turn is a **projection**: `SessionEvent` → `applyLiveTurnEvent` → `LiveTurnProjection` → `overlayLiveTurn` / turn timeline — not “bind raw deltas to Markdown”.  
4. Streaming chrome contracts: secondary `redactSecrets`, caps (assistant head-keep vs thinking/tool tail-keep), smooth-stream RAF + reduced-motion snap, processing vs continuing indicators.  
5. Tool timeline = Codex-style **flat `ToolTrow`**: one disclosure root for contiguous tools; permission opens disclosure; errors stay collapsed with summary signal; settle without stacked fades.  
6. Permission UI owns the composer interaction slot (Composer stays mounted/`hidden`, draft preserved); tone follows reason; `rememberForTurn` only when allowed; destructive defaults focus deny.  
7. CSS governance that affects agent UX: entry-file contract, unlayered override list, `!important` audit, foreground wash≠text tiers — CI guards are part of the contract.

## Non-goals

- Dumping Tailwind recipes, radius tables, or every `.maka-*` selector  
- Storybook / visual-smoke scenario catalogs as Destination depth  
- Desktop **main** composition (→ `/guides/desktop-host`)  
- Claiming PermissionEngine is a sandbox (→ `/guides/security-privacy`)  
- Campaign refactor rounds as teaching spine

---

## Teaching spine

| `#id` | Title | Depth job |
| --- | --- | --- |
| `scene` | 为什么开 UI companion | agent UX ≠ CSS dump; orthogonal to main |
| `north-star` | Companion Command Center | DESIGN.md named rules |
| `layers` | tokens → ui → AppShell | package/README + renderer README |
| `streaming` | Live turn + stream trust boundary | projection + redact + caps + smooth |
| `tool-timeline` | ToolTrow contracts | disclosure / attention / settle |
| `permission-ui` | PermissionPrompt + composer takeover | slot ownership + remember |
| `css-contracts` | Governance that binds agent chrome | cascade / tokens / tiers |
| `boundaries` | vs desktop-host / privacy / §01 permission | matrix |
| `failure` | Failure stories | wrong chrome / race / skip |

---

## Layer map (Current)

```text
DESIGN.md  (product intent snapshot; refresh from source when diverges)
    ↓
maka-tokens.css          # runtime token SoT (+ transitional recipes)
styles.css               # entry only: @import / @theme / orchestration
styles/**/*.css          # per-surface recipes (chat-*, composer, …)
    ↓
@maka/ui
  primitives/            # target layer + data-slot hooks
  ui.tsx                 # transitional Base UI wrappers
  feature components     # ChatView, Composer, PermissionPrompt, ToolTrow, …
    ↓
renderer AppShell
  session state + IPC invoke
  ChatView (timeline) + Composer slot + PermissionPrompt takeover
  SessionWorkbar (task ledger / browser / artifacts) lazy
```

**Hard rules from docs+code:**

- Renderer never constructs `SessionManager` (desktop-host).  
- New chrome: primitive / Tailwind first; CSS last; no raw color/radius/z.  
- Barrel promotion: cross-package or explicit public API only (`packages/ui/README.md`).  
- `--foreground-N` washes are surfaces; prose uses 3-tier text aliases (`foreground` / `secondary` / `muted`).

## Streaming / live-turn contracts

| Concern | Contract |
| --- | --- |
| Event → projection | `applyLiveTurnEvent` folds thinking/text/tools/permission into `LiveTurnProjection` steps + `contentOrder` |
| History + live | `materializeTurns` + `overlayLiveTurn`; live wins except interrupted-vs-in-flight race |
| Assistant stream | `applyAssistantDelta`: redact → delta cap (tail-keep) → append → **cross-delta redact** → total cap (**head-keep**) |
| Thinking stream | Tail-keep affordance (“what is the model thinking *now*”) |
| Tool output stream | Secondary redact + per-chunk / per-tool caps; chunks transient (not JSONL) |
| Smooth display | `useSmoothStreamContent`: EMA CPS, grapheme-safe, RAF single-owner, complete flush budget, `snap` for reduced-motion / history |
| Chrome honesty | `processingIndicator` (first-token wait) ≠ `continuingIndicator` (mid-turn lull) |

## ToolTrow contracts

| Rule | Why |
| --- | --- |
| Contiguous tools share one disclosure root | Second tool appends; no replace expanded→collapsed group |
| `needsAttention` = `waiting_permission` only | Errors collapse; summary carries failure (“N 个失败”) |
| Manual disclosure survives ordinary status changes | User choice not reset by settle |
| Group icon/summary from first-seen bucket when multi-running | Stops mid-run icon/summary jitter |
| Settle fade once per group if ever seen running | No stacked opacity fades on parallel finish |

## Permission UI contracts

| Rule | Evidence |
| --- | --- |
| Prompt in composer interaction slot; Composer `hidden` not unmounted | `permission-composer-takeover-contract` |
| Await `onRespond` / reset pending on settle or reject | `permission-dialog.tsx` |
| `rememberForTurn` only when `rememberForTurnAllowed` and decision=`allow` | same |
| Reason → tone (`destructive` / `caution` / `info`); focus deny on open | same |
| Args / WriteStdin details redacted for display | `redactSecrets` / `formatRedactedJson` |

## CSS governance (agent-UX-relevant only)

Teach as **guardrails**, not style guide:

1. `styles.css` is entry-only.  
2. Named unlayered overrides (nav-row / settings refresh buttons) stay after Tailwind — contract-tested.  
3. `!important` allowlist + `Justified:` comment.  
4. Dead CSS check + baseline.  
5. Cascade / chrome contracts forbid decorative AI gradients on chat chrome.

## Failure matrix

| Mis-claim / bug | Result |
| --- | --- |
| Bind raw `text_delta` to Markdown | Jumpy chrome; secrets may land in React state |
| Skip cross-delta redact | Secret spanning deltas survives into live projection |
| Unmount Composer on permission | Draft / uncontrolled textarea destroyed |
| Card-stack every tool call | Violates trow language; attention buried |
| Treat CSS dump as Destination | Silent skip of agent UX contracts |
| Equate UI permission prompt with OS sandbox | Trust model theater |

## Acceptance

- Live `/guides/desktop-ui` CN+EN teaches spine above with code+test citations.  
- Matrix Cluster-3 rows (`DESIGN.md`, frontend-css×2, `packages/ui/README.md`, renderer README, notes frontend map) → **deep** (structure absorbed; campaign checklist history-only).  
- Close #86 with decision recorded: **mine into companion**, not defer.  
- Do **not** close #34 (other design-encoding debt + Target stubs remain).
