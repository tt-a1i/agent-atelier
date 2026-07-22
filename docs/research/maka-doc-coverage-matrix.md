# Maka doc coverage matrix (atelier × maka-agent)

**Date:** 2026-07-22  
**Map:** [#91](https://github.com/tt-a1i/agent-atelier/issues/91) (dig v4; does not trust closed [#90](https://github.com/tt-a1i/agent-atelier/issues/90) / [#34](https://github.com/tt-a1i/agent-atelier/issues/34) without re-pull)  
**Specimen:** `/Users/tushaokun/code/maka-agent` @ `7b2f80a303333bc804a39a5d631a9fc8a33631ef` (dig v3 baseline was `42461f2b`)  
**Inventory:** **128** first-party `*.md` (excludes `node_modules` / `.git`)  
**Method:** regenerate find inventory → diff vs dig v3 matrix → cross-check live chapters/guides → classify taught depth. **Silent `none`/`thin` forbidden**. Dig v4 additionally forbids trusting prior “deep” without spot-check against current source.

## Legend

| Column | Values |
| --- | --- |
| kind | `authority` = current contract / architecture draft / root design docs · `archive` = `docs/archive/*` · `readme` = root/package/app/meta README or process |
| taught? | `deep` = reader can restate protocol/failure modes from atelier alone · `cite-only` = inventoried; cite/how-to-read only · `history-only` = provenance / RE / snapshot — not Destination body · `product-stub` = Current taught as non-claim; Target not invented · `discard` = changelog/campaign/superseded — not design-encoding · `oos` = meta writing skill / license / process (not agent-contract skill bodies) |

**Design-encoding** = every row whose `taught?` is **not** `discard`/`oos`.

### #91 close gate (corpus dig v4)

Close [#91](https://github.com/tt-a1i/agent-atelier/issues/91) **only if** fresh pull + inventory; every design-encoding row is `deep` | `cite-only` | `history-only` | `product-stub`; NEW docs/seams since dig v3 mined or dispositioned; ≥10 prior deep anchors spot-checked; Top seams not slogan-only.

This gate is **not** “product Destination complete”. AHE Target controller / Phase3 reconciler remain **product stubs** (re-confirmed absent at dig v4 HEAD); atelier teaches Current honesty (see `depth-corpus-status.md`).

## Counts (corpus dig v4)

| taught? | Count | % |
| --- | ---: | ---: |
| deep | 90 | 70.3% |
| cite-only | 5 | 3.9% |
| history-only | 18 | 14.1% |
| product-stub | 0 | 0.0% |
| discard | 6 | 4.7% |
| oos | 9 | 7.0% |
| **total** | **128** | **100%** |

Legacy rollup: deep **90** · thin **0** · none **0**. Dig v3 was 127/deep 89; dig v4 +1 authority doc (`deep-research-durable-workspace.md`).

### Design-encoding debt still `none`/`thin` (honest)

**Empty.** Design-encoding rows = **113** → all terminal dispositions.

Product-stub honesty (Current deep + Target non-claim, not a separate taught class):
- `docs/ahe-target-protocol.md` + `docs/architecture/ahe-self-iteration-boundary-draft*` — Target controller/runner/`validateMakaAheChangeEvaluation`
- `docs/runtime-resume-tool-journal-design-draft.zh-CN.md` — Phase3 reconciler

**#91 gate:** MET this session — NEW Deep Research + Plan mode + sandbox diagnostics + harness ops; spot-check prior deep OK; `visual-smoke`→`e2e-fixture` rename fixed. Remaining true blockers for **product Destination** = AHE Target / Phase3 stubs only (not map blockers).

## Full matrix (128)

| path | authority\|archive\|readme | taught? | atelier anchor | disposition / next |
| --- | --- | --- | --- | --- |
| `ARCHITECTURE.md` | authority | deep | §01–§06 TOC 1:1 | keep; worldview map only |
| `ARCHITECTURE.zh-CN.md` | authority | deep | §01–§06 TOC 1:1 | keep; bilingual twin |
| `README.md` | readme | cite-only | Entry + package seams | entry honesty / product surface; worldview taught via ARCHITECTURE + §01–§06 — not Destination body |
| `README.zh-CN.md` | readme | cite-only | Entry + package seams | same as EN README |
| `DESIGN.md` | authority | deep | /guides/desktop-ui #north-star | mined #86 — agent UX contracts, not CSS dump |
| `SECURITY.md` | authority | deep | /guides/security-privacy + §01 #trust | keep; failure stories shipped this pass |
| `CHANGELOG.md` | readme | oos | — | changelog only |
| `apps/desktop/README.md` | readme | deep | /guides/desktop-host | keep; failure stories this pass |
| `apps/desktop/src/renderer/README.md` | readme | deep | /guides/desktop-ui #layers | mined #86 |
| `apps/desktop/tests/smoke.md` | readme | oos | — | process/smoke — not design body |
| `apps/desktop/resources/licenses/cua-driver/LICENSE.md` | readme | oos | — | license only |
| `apps/desktop/resources/bundled-skills/brand-guidelines/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/changelog-generator/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/competitive-ads-extractor/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/content-research-writer/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/copywriting/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/create-plan/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/data-analysis/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/deep-research/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/domain-name-brainstormer/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/drafter-diagram/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/file-organizer/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/frontend-design/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/html-poster/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/html-slides/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/internal-comms/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/invoice-organizer/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/lead-research-assistant/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/maka-skill-creator/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/manim-composer/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/market-research-reports/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/notion-infographic/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/pdf-toolkit/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/responsive-design/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/seo-audit/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/static-site-deploy/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/summarization/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/tailored-resume-generator/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/theme-factory/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `apps/desktop/resources/bundled-skills/xhs-card-designer/SKILL.md` | readme | deep | /guides/skills-corpus | dig v3/#90 — agent contracts mined across all 29 bodies (not oos dump) |
| `docs/README.md` | authority | deep | mine-plan authority rule | keep as authority map |
| `docs/agent-swarm.md` | authority | deep | §04 #swarm + #swarm-failure | failure matrix shipped this pass |
| `docs/expert-team-runtime.md` | authority | deep | §04 #swarm Expert Team | failure matrix shipped this pass |
| `docs/ahe-target-protocol.md` | authority | deep | §06 validators/identity | deep on validators/identity; Target controller/runner/change-evaluation = product-stub — do not invent |
| `docs/execution-evidence-spine.md` | authority | deep | §01 #execution-evidence | dig v3/#90 — body shipped (was dangling-link slogan); dig v4 spot-check OK |
| `docs/deep-research-durable-workspace.md` | authority | deep | /guides/deep-research | **NEW dig v4/#91** — PR #1227 durable workspace; projection + eight tools + handoff |
| `docs/session-task-ledger-lifecycle.md` | authority | deep | §04 #ledger | keep |
| `docs/skill-catalog-policy.md` | authority | deep | §01 #skills + #skills-failure | failure matrix shipped this pass |
| `docs/workspace-privacy-context.md` | authority | deep | /guides/security-privacy | failure stories this pass |
| `docs/runtime-resume-tool-journal-design-draft.zh-CN.md` | authority | deep | §01 #runtime-dual + #recovery/#t1-t2 | deep on sticky SQLITE + Phase2; Phase3 reconciler = product-stub Target — taught as non-claim |
| `docs/codex-cursor-reverse-engineering.md` | authority | history-only | /guides/computer-use #cursor-contrast | external RE provenance; contrast mined (#88); not Runtime protocol |
| `docs/frontend-css-governance.md` | authority | deep | /guides/desktop-ui #css-contracts | mined #86; dig v4 rename visual-smoke→e2e-fixture absorbed |
| `docs/frontend-css-governance.zh-CN.md` | authority | deep | /guides/desktop-ui #css-contracts | same |
| `docs/eval/terminal-bench-2.1-maka-vs-kimi-code-v11.md` | authority | cite-only | §04 #terminal-bench-read | cite-only how-to-read vs Harbor taxonomy (#89); no new protocol |
| `docs/computer-use-foundation-contract.md` | authority | deep | /guides/computer-use #six | companion + package internals (#backend-selection etc.) dig v3 |
| `docs/computer-use-model-loop-foundation.md` | authority | deep | /guides/computer-use #model-loop | companion failure matrix already live |
| `docs/computer-use-evidence-classes.md` | authority | deep | /guides/computer-use #evidence | companion failure matrix already live |
| `docs/computer-use-provider-evidence.md` | authority | deep | /guides/computer-use #evidence | companion failure matrix already live |
| `docs/computer-use-host-events-contract.md` | authority | deep | /guides/computer-use #host-events | companion failure matrix already live |
| `docs/cua-driver-artifact-integrity.md` | authority | deep | /guides/computer-use #artifact | companion + #cua-driver-lifecycle dig v3 |
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
| `docs/architecture/ahe-self-iteration-boundary-draft.md` | authority | deep | §06 | deep on Current boundary; Target controller = product-stub — do not invent |
| `docs/architecture/ahe-self-iteration-boundary-draft.zh-CN.md` | authority | deep | §06 | same; Target controller = product-stub |
| `docs/architecture/runtime-resume-phase0-crash-contract.md` | authority | deep | §01 #recovery | keep |
| `docs/architecture/runtime-resume-phase1-safe-boundary-contract.md` | authority | deep | §01 #recovery | keep |
| `docs/architecture/runtime-recovery-resolver-adr.zh-CN.md` | authority | deep | §01 #t1-t2 | keep |
| `docs/architecture/mcp-runtime-architecture-draft.zh-CN.md` | authority | deep | §01 #mcp + #mcp-failure | failure matrix shipped this pass |
| `docs/architecture/bot-onboarding-runtime.zh-CN.md` | authority | deep | /guides/bot-im | failure stories this pass |
| `docs/archive/README.md` | archive | cite-only | archive-still-teaches-sweep.md | inventory authority only; routes mine-delta vs history/discard |
| `docs/archive/2026-06-24-runtime-ledger-backfill.md` | archive | history-only | — | PR plan provenance; Current = backfill code + tests |
| `docs/archive/composer-mentions-spec-2026-07-14.md` | archive | deep | /guides/desktop-ui #composer-mentions | dig v3 — plain-text @/ mention contract elevated |
| `docs/archive/computer-use-delivery-state.md` | archive | deep | /guides/computer-use #evidence-hardening | absorbed |
| `docs/archive/computer-use-evidence-hardening.md` | archive | deep | /guides/computer-use #evidence-hardening | absorbed |
| `docs/archive/computer-use-executor-hardening.md` | archive | deep | /guides/computer-use #evidence-hardening | absorbed |
| `docs/archive/computer-use-physical-input-guard.md` | archive | deep | /guides/computer-use #host-events / #failures | mined (#87) |
| `docs/archive/computer-use-process-restart-e2e.md` | archive | history-only | — | harness chronicle; PID-reuse non-claim restated in host-events |
| `docs/archive/computer-use-real-ax-model-e2e.md` | archive | history-only | — | real-provider matrix snapshot |
| `docs/archive/computer-use-runtime-hardening.md` | archive | deep | /guides/computer-use #evidence-hardening | absorbed |
| `docs/archive/deepseek-reasonix-cost-runtime-design.md` | archive | deep | §01 #request-shape / #usage-stores | absorbed; no /guides/cost |
| `docs/archive/design-refinement-roadmap-2026-07.md` | archive | deep | /guides/desktop-ui #motion-spacing | dig v3 — D1–D4 decisions elevated; campaign queue stays discard-adjacent |
| `docs/archive/design-system-v0.2-wave-10.md` | archive | discard | — | superseded; DESIGN.md wins |
| `docs/archive/desktop-smoke-plan-legacy.md` | archive | discard | — | superseded by smoke.md |
| `docs/archive/economic-mechanisms-benchmark.md` | archive | deep | §02 synthesis-cache aside | absorbed batch2 |
| `docs/archive/expert-team-implementation.md` | archive | history-only | §04 #swarm history contrast | competitor RE provenance; contrast mined into §04 — archive not Current |
| `docs/archive/expert-team-plan.md` | archive | history-only | — | product research provenance |
| `docs/archive/frontend-simplification-map-2026-07-13.md` | archive | discard | — | knip/app-shell changelog |
| `docs/archive/full-product-test-plan-2026-05.md` | archive | deep | /guides/desktop-host #pr-five | dig v3 — PR five questions + fail gates elevated; month schedule not taught |
| `docs/archive/heavy-task-mainline-system-design.md` | archive | deep | §04 #events / §05 #repair | absorbed batch2 |
| `docs/archive/maka-bug-flow-audit-2026-05-22.md` | archive | history-only | — | fixed-bugs list |
| `docs/archive/maka-capability-audit-v1-2026-05.md` | archive | discard | — | point-in-time; stale refs |
| `docs/archive/maka-core-tech-walkthrough.md` | archive | deep | §01 asides + maka-core-walkthrough-archive-delta | absorbed batch2 |
| `docs/archive/maka-memory-whitebox-contract.md` | archive | deep | /guides/local-memory | absorbed #85 |
| `docs/archive/memory-threat-model-pr-memory-1.md` | archive | history-only | — | contract snapshot; Current product differs |
| `docs/archive/pr-oauth-subscription-0-gate.md` | archive | history-only | — | pre-#1125; SECURITY + credentials store win |
| `docs/archive/pr-pi-agent-loop-0-plan.md` | archive | history-only | — | migration rationale; landed |
| `docs/archive/qoderwork-mcp-reverse-engineering-2026-07-18.md` | archive | history-only | — | external MCP comparison provenance |
| `docs/archive/reference-atlas.md` | archive | history-only | — | Qoder UI RE provenance |
| `docs/archive/reference-settings.md` | archive | history-only | — | Qoder settings RE provenance |
| `docs/archive/runtime-kernel.md` | archive | deep | §01 asides | absorbed batch2 |
| `docs/archive/runtime-mainline-teaching-manual.md` | archive | deep | §01 | absorbed top-3 |
| `docs/archive/runtime-v2-architecture-evolution.md` | archive | deep | §01 #stores aside | absorbed batch2 |
| `docs/archive/runtime-v2-implementation-notes.md` | archive | history-only | — | phase skeleton landed; source owns Current |
| `docs/archive/search-service-threat-model-pr-search-0.md` | archive | history-only | — | snapshot; thread-search + tests own Current |
| `docs/archive/ui-convergence-map-2026-07-09.md` | archive | discard | — | completed campaign |
| `docs/archive/ui-quality-plan-2026-05.md` | archive | discard | — | month-one UI gate |
| `docs/archive/ui-skills-deep-read-2026-06-23.md` | archive | history-only | /guides/desktop-ui #motion-spacing | external skill synthesis provenance; convergent rules absorbed into D1–D4 teaching |
| `docs/archive/ui-skills-deep-read-2026-06-24.md` | archive | history-only | /guides/desktop-ui #motion-spacing | round-2 synthesis provenance; not Current CSS authority |
| `docs/archive/voice-threat-model-pr-voice-0.md` | archive | history-only | — | snapshot; voice.ts owns Current |
| `packages/runtime/README.md` | readme | cite-only | §01 entry / package seam | public-seam pointer; SessionManager/permission/recovery contracts taught in §01 + sandbox README |
| `packages/runtime/src/sandbox/README.md` | readme | deep | §01 #sandbox | README lag caveat already taught |
| `packages/headless/README.md` | readme | deep | §04 #harbor-trust + #harbor-failure + #harness-ab-ops | dig v4 — TASK_IDS / xhigh / concurrency / vision |
| `packages/ui/README.md` | readme | deep | /guides/desktop-ui #layers · #interaction-queue · #composer-input | mined #86; dig v3 queue/input contracts |
| `notes/frontend-architecture-map-2026-07-19.md` | authority | deep | /guides/desktop-ui #boundaries | structure absorbed #86; R1–R8 campaign = history/process |
| `.github/pull_request_template.md` | readme | oos | — | process template |
| `skills/maka-architecture-docs/SKILL.md` | readme | oos | — | meta writing skill |
| `skills/maka-architecture-docs/assets/article-template.md` | readme | oos | — | meta OOS |
| `skills/maka-architecture-docs/references/bilingual-standard.md` | readme | oos | — | meta OOS |
| `skills/maka-architecture-docs/references/quality-gate.md` | readme | oos | — | meta OOS |
| `skills/maka-architecture-docs/references/writing-standard.md` | readme | oos | — | meta OOS |

## This pass decisions (dig v4 / #91)

1. **Fresh find = 128** — +1 vs dig v3: `docs/deep-research-durable-workspace.md` only NEW first-class md.
2. **Do not trust dig v3 closure** — maka advanced `42461f2b → 7b2f80a3` (12 commits) with productized Deep Research + Plan mode + sandbox diagnostics.
3. Mined `/guides/deep-research` CN+EN from authority doc + `deep-research-run` / tools / store + Desktop handoff.
4. Mined `/guides/plan-mode` CN+EN from `collaboration` / `plan.ts` / plan-store / plan-mode / plan-tools / panel (no maka authority md — code+tests are authority).
5. Deepened §01 `#sandbox-diagnostics` (diagnostics snapshot · run-trace projection · turn-tail · SandboxCommandError).
6. Deepened §04 `#harness-ab-ops` (Codex `xhigh`, `MAKA_HARNESS_AB_TASK_IDS`, pair concurrency / arm execution, vision images).
7. Spot-checked ≥10 prior deep anchors — protocol OK; hard fix `visual-smoke` → `e2e-fixture` on desktop-ui/host.
8. AHE Target / Phase3 reconciler still absent — remain product-stub honesty.
9. Remaining `discard` / `oos` dispositions unchanged in spirit.
10. Product Destination still stub-gated — **does not block #91 corpus dig close**.

### Dig v3 / #90 decisions (historical; superseded for closure claims)

See git history of this file at dig v3 close. Skills corpus ×29, elevated archives, `#execution-evidence` body, CU internals, desktop-ui queue/input, `/guides/cli` remain live teaching — re-verified by dig v4 spot-check, not re-mined wholesale.
