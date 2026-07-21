# Maka doc coverage matrix (atelier × maka-agent)

**Date:** 2026-07-21
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)
**Specimen:** `/Users/tushaokun/code/maka-agent`
**Inventory:** **127** first-party `*.md` (excludes `node_modules` / `.git`)
**Method:** regenerate find inventory → cross-check live chapters/guides/research → classify taught depth.

## Legend

| Column | Values |
| --- | --- |
| kind | `authority` = current contract / architecture draft / root design docs · `archive` = `docs/archive/*` · `readme` = root/package/app/meta README or process |
| taught? | `deep` = reader can restate protocol/failure modes from atelier alone · `thin` = present but incomplete for design claims · `none` = absent / not Destination body |

**Close #34 rule:** only if **no design-encoding** row remains `none`/`thin`. Pure changelog, licenses, bundled SKILL bodies, meta writing skills, and classified discard/history-only archives do **not** block Destination by themselves. Cluster-3 UI docs were mined into `/guides/desktop-ui` (#86). Matrix design-encoding debt is cleared; Destination may still be stub-gated (AHE Target) — do not equate.

## Counts (this verify pass)

| taught? | Count |
| --- | ---: |
| deep | 60 |
| thin | 4 |
| none | 63 |
| **total** | **127** |

**Coverage % (all 127):** deep **47.2%** · thin **3.1%** · none **49.6%**

### Design-encoding debt still `none`/`thin` (honest)

**None remaining that encode design.** Cluster-3 UI (#86) + #87–#89 + expert-team contrast are mined/decided.

Non-blocking thin leftovers (not design-encoding Destination body):
- `docs/archive/README.md` → inventory authority only
- `README.md` / `README.zh-CN.md` → entry honesty only
- `packages/runtime/README.md` → seam pointer only

**#34 / Destination:** matrix design-encoding rows cleared; Destination still **not** complete while AHE Target controller / Phase3 reconciler remain product stubs (see `depth-corpus-status.md`). Do not fake-close Destination.

## Full matrix (127)

| path | authority\|archive\|readme | taught? (deep/thin/none) | atelier anchor | next action |
| --- | --- | --- | --- | --- |
| `ARCHITECTURE.md` | authority | deep | §01–§06 TOC 1:1 | keep; worldview map only |
| `ARCHITECTURE.zh-CN.md` | authority | deep | §01–§06 TOC 1:1 | keep; bilingual twin |
| `README.md` | readme | thin | Entry + package seams | entry honesty only; not Destination body |
| `README.zh-CN.md` | readme | thin | Entry + package seams | same as EN README |
| `DESIGN.md` | authority | deep | /guides/desktop-ui #north-star | mined #86 — agent UX contracts, not CSS dump |
| `SECURITY.md` | authority | deep | /guides/security-privacy + §01 #trust | keep; failure stories shipped this pass |
| `CHANGELOG.md` | readme | none | — | changelog only — no teaching debt |
| `apps/desktop/README.md` | readme | deep | /guides/desktop-host | keep; failure stories this pass |
| `apps/desktop/src/renderer/README.md` | readme | deep | /guides/desktop-ui #layers | mined #86 |
| `apps/desktop/tests/smoke.md` | readme | none | — | process/smoke — not Destination design body |
| `apps/desktop/resources/licenses/cua-driver/LICENSE.md` | readme | none | — | license only |
| `apps/desktop/resources/bundled-skills/brand-guidelines/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/changelog-generator/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/competitive-ads-extractor/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/content-research-writer/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/copywriting/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/create-plan/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/data-analysis/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/deep-research/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/domain-name-brainstormer/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/drafter-diagram/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/file-organizer/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/frontend-design/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/html-poster/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/html-slides/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/internal-comms/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/invoice-organizer/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/lead-research-assistant/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/maka-skill-creator/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/manim-composer/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/market-research-reports/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/notion-infographic/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/pdf-toolkit/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/responsive-design/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/seo-audit/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/static-site-deploy/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/summarization/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/tailored-resume-generator/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/theme-factory/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `apps/desktop/resources/bundled-skills/xhs-card-designer/SKILL.md` | readme | none | §01 #skills (mechanism only) | product content OOS; catalog mechanism deep |
| `docs/README.md` | authority | deep | mine-plan authority rule | keep as authority map |
| `docs/agent-swarm.md` | authority | deep | §04 #swarm + #swarm-failure | failure matrix shipped this pass |
| `docs/expert-team-runtime.md` | authority | deep | §04 #swarm Expert Team | failure matrix shipped this pass |
| `docs/ahe-target-protocol.md` | authority | deep | §06 validators/identity | Target controller still stub — product |
| `docs/execution-evidence-spine.md` | authority | deep | §01 #execution-evidence | keep |
| `docs/session-task-ledger-lifecycle.md` | authority | deep | §04 #ledger | keep |
| `docs/skill-catalog-policy.md` | authority | deep | §01 #skills + #skills-failure | failure matrix shipped this pass |
| `docs/workspace-privacy-context.md` | authority | deep | /guides/security-privacy | failure stories this pass |
| `docs/runtime-resume-tool-journal-design-draft.zh-CN.md` | authority | deep | §01 #runtime-dual + #recovery/#t1-t2 | sticky SQLITE + Phase2/3 honesty mined this pass; Phase3 Target remains |
| `docs/codex-cursor-reverse-engineering.md` | authority | deep | /guides/computer-use #cursor-contrast | history contrast absorbed (#88) |
| `docs/frontend-css-governance.md` | authority | deep | /guides/desktop-ui #css-contracts | mined #86 — governance that binds agent chrome |
| `docs/frontend-css-governance.zh-CN.md` | authority | deep | /guides/desktop-ui #css-contracts | mined #86 |
| `docs/eval/terminal-bench-2.1-maka-vs-kimi-code-v11.md` | authority | deep | §04 #terminal-bench-read | cite-only + how-to-read (#89); no new protocol |
| `docs/computer-use-foundation-contract.md` | authority | deep | /guides/computer-use #six | companion failure matrix already live |
| `docs/computer-use-model-loop-foundation.md` | authority | deep | /guides/computer-use #model-loop | companion failure matrix already live |
| `docs/computer-use-evidence-classes.md` | authority | deep | /guides/computer-use #evidence | companion failure matrix already live |
| `docs/computer-use-provider-evidence.md` | authority | deep | /guides/computer-use #evidence | companion failure matrix already live |
| `docs/computer-use-host-events-contract.md` | authority | deep | /guides/computer-use #host-events | companion failure matrix already live |
| `docs/cua-driver-artifact-integrity.md` | authority | deep | /guides/computer-use #artifact | companion failure matrix already live |
| `docs/architecture/runtime-core-architecture-draft.md` | authority | deep | §01 | keep |
| `docs/architecture/runtime-core-architecture-draft.zh-CN.md` | authority | deep | §01 | keep |
| `docs/architecture/turn-evidence-tools-active-prune-draft.md` | authority | deep | §02 | keep |
| `docs/architecture/turn-evidence-tools-active-prune-draft.zh-CN.md` | authority | deep | §02 | keep |
| `docs/architecture/llm-compaction-events-log-projection-draft.md` | authority | deep | §03 | keep |
| `docs/architecture/llm-compaction-events-log-projection-draft.zh-CN.md` | authority | deep | §03 | keep |
| `docs/architecture/durable-task-loop-headless-draft.md` | authority | deep | §04 | keep |
| `docs/architecture/durable-task-loop-headless-draft.zh-CN.md` | authority | deep | §04 | keep |
| `docs/architecture/self-check-bounded-feedback-loop-draft.md` | authority | deep | §05 | keep |
| `docs/architecture/self-check-bounded-feedback-loop-draft.zh-CN.md` | authority | deep | §05 | keep |
| `docs/architecture/ahe-self-iteration-boundary-draft.md` | authority | deep | §06 | Target controller stub — product |
| `docs/architecture/ahe-self-iteration-boundary-draft.zh-CN.md` | authority | deep | §06 | same |
| `docs/architecture/runtime-resume-phase0-crash-contract.md` | authority | deep | §01 #recovery | keep |
| `docs/architecture/runtime-resume-phase1-safe-boundary-contract.md` | authority | deep | §01 #recovery | keep |
| `docs/architecture/runtime-recovery-resolver-adr.zh-CN.md` | authority | deep | §01 #t1-t2 | keep |
| `docs/architecture/mcp-runtime-architecture-draft.zh-CN.md` | authority | deep | §01 #mcp + #mcp-failure | failure matrix shipped this pass |
| `docs/architecture/bot-onboarding-runtime.zh-CN.md` | authority | deep | /guides/bot-im | failure stories this pass |
| `docs/archive/README.md` | archive | thin | archive-still-teaches-sweep.md | inventory authority only |
| `docs/archive/2026-06-24-runtime-ledger-backfill.md` | archive | none | — | history-only PR plan |
| `docs/archive/composer-mentions-spec-2026-07-14.md` | archive | none | — | discard shipped UI |
| `docs/archive/computer-use-delivery-state.md` | archive | deep | /guides/computer-use #evidence-hardening | absorbed |
| `docs/archive/computer-use-evidence-hardening.md` | archive | deep | /guides/computer-use #evidence-hardening | absorbed |
| `docs/archive/computer-use-executor-hardening.md` | archive | deep | /guides/computer-use #evidence-hardening | absorbed |
| `docs/archive/computer-use-physical-input-guard.md` | archive | deep | /guides/computer-use #host-events / #failures | mined (#87) |
| `docs/archive/computer-use-process-restart-e2e.md` | archive | none | — | history-only harness |
| `docs/archive/computer-use-real-ax-model-e2e.md` | archive | none | — | history-only matrix |
| `docs/archive/computer-use-runtime-hardening.md` | archive | deep | /guides/computer-use #evidence-hardening | absorbed |
| `docs/archive/deepseek-reasonix-cost-runtime-design.md` | archive | deep | §01 #request-shape / #usage-stores | absorbed; no /guides/cost |
| `docs/archive/design-refinement-roadmap-2026-07.md` | archive | none | — | discard queues |
| `docs/archive/design-system-v0.2-wave-10.md` | archive | none | — | discard; DESIGN.md wins |
| `docs/archive/desktop-smoke-plan-legacy.md` | archive | none | — | discard superseded |
| `docs/archive/economic-mechanisms-benchmark.md` | archive | deep | §02 synthesis-cache aside | absorbed batch2 |
| `docs/archive/expert-team-implementation.md` | archive | deep | §04 #swarm history contrast | competitor RE contrast absorbed |
| `docs/archive/expert-team-plan.md` | archive | none | — | history-only product research |
| `docs/archive/frontend-simplification-map-2026-07-13.md` | archive | none | — | discard changelog |
| `docs/archive/full-product-test-plan-2026-05.md` | archive | none | — | discard delivery contract |
| `docs/archive/heavy-task-mainline-system-design.md` | archive | deep | §04 #events / §05 #repair | absorbed batch2 |
| `docs/archive/maka-bug-flow-audit-2026-05-22.md` | archive | none | — | history-only bug list |
| `docs/archive/maka-capability-audit-v1-2026-05.md` | archive | none | — | discard stale |
| `docs/archive/maka-core-tech-walkthrough.md` | archive | deep | §01 asides + maka-core-walkthrough-archive-delta | absorbed batch2 |
| `docs/archive/maka-memory-whitebox-contract.md` | archive | deep | /guides/local-memory | absorbed #85 |
| `docs/archive/memory-threat-model-pr-memory-1.md` | archive | none | — | history-only; Current differs |
| `docs/archive/pr-oauth-subscription-0-gate.md` | archive | none | — | history-only; SECURITY wins |
| `docs/archive/pr-pi-agent-loop-0-plan.md` | archive | none | — | history-only landed |
| `docs/archive/qoderwork-mcp-reverse-engineering-2026-07-18.md` | archive | none | — | history-only external compare |
| `docs/archive/reference-atlas.md` | archive | none | — | history-only UI RE |
| `docs/archive/reference-settings.md` | archive | none | — | history-only settings RE |
| `docs/archive/runtime-kernel.md` | archive | deep | §01 asides | absorbed batch2 |
| `docs/archive/runtime-mainline-teaching-manual.md` | archive | deep | §01 | absorbed top-3 |
| `docs/archive/runtime-v2-architecture-evolution.md` | archive | deep | §01 #stores aside | absorbed batch2 |
| `docs/archive/runtime-v2-implementation-notes.md` | archive | none | — | history-only phase skeleton |
| `docs/archive/search-service-threat-model-pr-search-0.md` | archive | none | — | history-only snapshot |
| `docs/archive/ui-convergence-map-2026-07-09.md` | archive | none | — | discard campaign |
| `docs/archive/ui-quality-plan-2026-05.md` | archive | none | — | discard UI gate |
| `docs/archive/ui-skills-deep-read-2026-06-23.md` | archive | none | — | discard external research |
| `docs/archive/ui-skills-deep-read-2026-06-24.md` | archive | none | — | discard round-2 |
| `docs/archive/voice-threat-model-pr-voice-0.md` | archive | none | — | history-only; voice.ts owns Current |
| `packages/runtime/README.md` | readme | thin | §01 entry / package seam | seam pointer only |
| `packages/runtime/src/sandbox/README.md` | readme | deep | §01 #sandbox | README lag caveat already taught |
| `packages/headless/README.md` | readme | deep | §04 #harbor-trust + #harbor-failure | failure matrix this pass |
| `packages/ui/README.md` | readme | deep | /guides/desktop-ui #layers | mined #86 |
| `notes/frontend-architecture-map-2026-07-19.md` | authority | deep | /guides/desktop-ui #boundaries | structure absorbed #86; R1–R8 campaign = history/process |
| `.github/pull_request_template.md` | readme | none | — | process template |
| `skills/maka-architecture-docs/SKILL.md` | readme | none | — | meta writing skill OOS |
| `skills/maka-architecture-docs/assets/article-template.md` | readme | none | — | meta OOS |
| `skills/maka-architecture-docs/references/bilingual-standard.md` | readme | none | — | meta OOS |
| `skills/maka-architecture-docs/references/quality-gate.md` | readme | none | — | meta OOS |
| `skills/maka-architecture-docs/references/writing-standard.md` | readme | none | — | meta OOS |

## This pass decisions

1. **Prior verify pass:** sticky SQLITE + Phase2/3 journal honesty; failure matrices; companions; `/guides/cost` not opened; tickets #86–#89.
2. **#87 mined:** CU physical-input-guard → `/guides/computer-use` `#host-events` + `#failures` (CN+EN).
3. **#88 decided + taught:** Codex FogCursor RE → `/guides/computer-use` `#cursor-contrast`.
4. **#89 cite-only:** Terminal-Bench writeup → §04 `#terminal-bench-read`.
5. **Extra mine:** `expert-team-implementation.md` → §04 `#swarm` competitor RE contrast.
6. **#86 mined:** opened companion `/guides/desktop-ui` (CN+EN) — DESIGN / CSS governance / `@maka/ui` / renderer README / notes frontend map structure → agent UX contracts (streaming / ToolTrow / permission slot / lean CSS guards). Outline: `desktop-ui-design-system-deep-outline.md`. **Not** a CSS dump. Cluster-3 design-encoding rows → deep.
7. **Matrix design-encoding debt cleared.** Destination still incomplete (AHE Target stubs) — do not equate matrix-clear with Destination-done.

