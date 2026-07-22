# Corpus depth status (honest)

**Date:** 2026-07-22  
**Map:** [#92](https://github.com/tt-a1i/agent-atelier/issues/92) (dig v5) · closed precursors [#91](https://github.com/tt-a1i/agent-atelier/issues/91) (dig v4) · [#90](https://github.com/tt-a1i/agent-atelier/issues/90) (dig v3) · [#34](https://github.com/tt-a1i/agent-atelier/issues/34) (dig v2)  
**Against:** [`maka-corpus-mine-plan.md`](./maka-corpus-mine-plan.md) · [`maka-code-seam-inventory.md`](./maka-code-seam-inventory.md) · [`maka-doc-coverage-matrix.md`](./maka-doc-coverage-matrix.md) · [`skills-corpus-mine-outline.md`](./skills-corpus-mine-outline.md)  
**Live:** https://tt-a1i.github.io/agent-atelier/

## Specimen baseline (dig v5)

| Field | Value |
| --- | --- |
| Specimen | `/Users/tushaokun/code/maka-agent` |
| Dig v4 HEAD (do not trust closure) | `7b2f80a303333bc804a39a5d631a9fc8a33631ef` |
| Dig v5 HEAD after `fetch` + `pull --ff-only` | `f9e78d17e1ae42e3428390baf9d458cf4f30a00b` |
| Pull | ff-only ok (`7b2f80a3..f9e78d17`, **4** commits); tracked tree clean |

### Commits since dig v4

1. `9c4dd9ca` feat(runtime): add swarm orchestration contract (#1325)
2. `ee0001de` feat(cli): add swarm mode commands (#1326)
3. `02f175e3` feat: add desktop and headless swarm mode parity (#1327)
4. `f9e78d17` feat: add swarm prompt template expansion (#1328)

## Verdict

**Corpus dig v5 gate MET for map #92** — after fresh pull, inventory delta, mining NEW/changed swarm seams, and spot-checking **≥15** prior “deep” anchors. Product Destination remains stub-gated — do not equate map close with Target invention.

Dig v4/#91 closed while maka HEAD sat at `7b2f80a3`. User rejected complacent “already done” without re-pull proof. Dig v5 found **real product seams absent from dig v4 teaching**: Swarm Mode orchestration (`orchestrationMode` / `EffectiveOrchestration` / `agentSwarmAuthorization`), host parity (`/swarm` + Desktop IPC + Headless), and homogeneous `prompt_template` + `{{item}}` batches.

## Destination gate vs #92 close gate

| Gate | Question | Criteria | Result |
| --- | --- | --- | --- |
| **#92 / corpus dig v5** | Can the map close? | Fresh pull + inventory; every design-encoding matrix row terminal; NEW/changed docs/seams mined or dispositioned; ≥15 prior deep anchors spot-checked; Top seams not slogan-only. | **MET** |
| **Product Destination** | Is Maka’s Target surface Current? | AHE controller / runner / `validateMakaAheChangeEvaluation` + tool-journal Phase3 reconciler exist as product Current. | **NOT MET** — product stubs (re-confirmed absent at dig v5 HEAD) |

## 中文状态：NEW / shallow → mined（dig v5 证明）

| 类别 | 内容 | 处置 |
| --- | --- | --- |
| **文档数** | first-class `*.md` = **128**（与 dig v4 相同；无新路径） | inventory 闭合 |
| **Changed 文档** | `docs/agent-swarm.md`（+19：模板批 / `prompt_template`） | **deepened** → §04 `#swarm-mode` · `#swarm-template` CN+EN |
| **NEW 代码 seam** | `orchestration.ts` · `swarm-command.ts` · `swarm-mode.ts` + Desktop/CLI/Headless 对等 | **deep** → 同上 |
| **Changed 代码** | `agent-swarm-tools.ts` 模板展开；session header `orchestrationMode`；ToolRuntime 可信 allow | **deep** |
| **Spot-check ≥15** | 见下表 | 无协议 DRIFT |
| **仍 stub** | AHE Target controller / Phase3 reconciler | 诚实非宣称 — 未发明 |

### Spot-check list（≥15 prior deep anchors @ `f9e78d17`）

| # | Anchor | Result |
| ---: | --- | --- |
| 1 | `docs/execution-evidence-spine.md` | OK |
| 2 | `docs/deep-research-durable-workspace.md` + run/tools/store | OK |
| 3 | Sandbox `diagnostics.ts` / `errors.ts` | OK |
| 4 | `system-prompt/sandbox-context-prompt.ts`（路径在 inventory 旁注；文件在） | OK |
| 5 | Plan `collaboration.ts` / `plan.ts` / plan-mode / plan-tools | OK |
| 6 | Bundled skills ×29 | OK |
| 7 | `docs/skill-catalog-policy.md` | OK |
| 8 | Headless Harbor / `TASK_IDS` surface | OK |
| 9 | `docs/computer-use-foundation-contract.md` | OK |
| 10 | `docs/session-task-ledger-lifecycle.md` | OK |
| 11 | `docs/frontend-css-governance.md` | OK |
| 12 | `docs/workspace-privacy-context.md` | OK |
| 13 | CLI `session-driver.ts` | OK |
| 14 | UI interaction-queue + `composer.tsx` | OK |
| 15 | `e2e-fixture` present; no `visual-smoke` revival | OK |
| 16 | `docs/ahe-target-protocol.md` present; `validateMakaAheChangeEvaluation` **absent** | stub honesty OK |
| 17 | Phase3 reconciler **absent** | stub honesty OK |

## What dig v5 mined

| Deliverable | Anchor |
| --- | --- |
| Swarm Mode orchestration + host parity + template batches (CN+EN) | §04 `#swarm` · `#swarm-mode` · `#swarm-template` · failure rows |
| Research outline refresh | `agent-swarm-expert-team-deep-outline.md` |
| Matrix + seam inventory retarget | map #92 / HEAD `f9e78d17` |
| Entry chrome retarget | dig v5 / map #92 |

## Doc coverage snapshot (128)

| taught? | Count | % |
| --- | ---: | ---: |
| deep | 90 | 70.3% |
| cite-only | 5 | 3.9% |
| history-only | 18 | 14.1% |
| product-stub | 0 | 0% |
| discard | 6 | 4.7% |
| oos | 9 | 7.0% |

Legacy rollup: deep **90** · thin **0** · none **0**. Design-encoding debt `none`/`thin`: **empty**. No new md paths; `docs/agent-swarm.md` depth raised in place.

## Code seams (Top 15+ re-audit dig v5)

| Seam family | Verdict |
| --- | --- |
| Prior deep anchors (spot-check sample ≥15) | **OK** — no protocol DRIFT at `f9e78d17` |
| Swarm orchestration / Swarm Mode / template batch | **NEW deep** §04 `#swarm-mode` · `#swarm-template` |
| Deep Research / Plan / sandbox diagnostics (dig v4) | spot-check OK |
| AHE Target / Phase3 | **still product stubs** |

## Ticket frontier

- Map **#92**: corpus dig v5 — **close** (corpus dig ≠ product Destination).  
- Closed precursors: [#91](https://github.com/tt-a1i/agent-atelier/issues/91), [#90](https://github.com/tt-a1i/agent-atelier/issues/90), [#34](https://github.com/tt-a1i/agent-atelier/issues/34).

## What “done” means (five levels)

1. **Corpus dig v2 / #34** — silent none eliminated — **closed; user rejected as complacent**.  
2. **Corpus dig v3 / #90** — Skills corpus + elevated archives + Top-15+ deepenings — **closed; user rejected without re-pull proof**.  
3. **Corpus dig v4 / #91** — re-pull · inventory delta · mine NEW · spot-check prior deep — **closed; user rejected without fresh proof**.  
4. **Corpus dig v5 / #92** — re-pull · inventory · mine swarm orchestration · spot-check ≥15 — **MET**.  
5. **Product Destination** — Target stubs become product Current — **open**, owned by maka-agent product.
