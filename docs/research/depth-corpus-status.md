# Corpus depth status (honest)

**Date:** 2026-07-22  
**Map:** [#91](https://github.com/tt-a1i/agent-atelier/issues/91) (dig v4) · closed precursors [#90](https://github.com/tt-a1i/agent-atelier/issues/90) (dig v3) · [#34](https://github.com/tt-a1i/agent-atelier/issues/34) (dig v2)  
**Against:** [`maka-corpus-mine-plan.md`](./maka-corpus-mine-plan.md) · [`maka-code-seam-inventory.md`](./maka-code-seam-inventory.md) · [`maka-doc-coverage-matrix.md`](./maka-doc-coverage-matrix.md) · [`skills-corpus-mine-outline.md`](./skills-corpus-mine-outline.md)  
**Live:** https://tt-a1i.github.io/agent-atelier/

## Specimen baseline (dig v4)

| Field | Value |
| --- | --- |
| Specimen | `/Users/tushaokun/code/maka-agent` |
| Dig v3 HEAD (do not trust closure) | `42461f2b261da71ab2551a86d9c15bd64896d13c` |
| Dig v4 HEAD after `fetch` + `pull --ff-only` | `7b2f80a303333bc804a39a5d631a9fc8a33631ef` |
| Pull | ff-only ok (`42461f2b..7b2f80a3`, 12 commits); tracked tree clean; untracked local `docs/maka-architecture.*` ignored |

## Verdict

**Corpus dig v4 gate MET for map #91** — after fresh pull, inventory delta, mining NEW seams, and spot-checking ≥10 prior “deep” anchors. Product Destination remains stub-gated — do not equate map close with Target invention.

Dig v3/#90 closed while maka HEAD sat at `42461f2b`. User rejected complacent “already done” without re-pull proof. Dig v4 found **real product seams absent from dig v3 teaching**: durable Deep Research workspace, Plan collaboration mode, sandbox diagnostics/errors/context prompt, headless harness ops deltas, and `visual-smoke`→`e2e-fixture` rename drift on site.

## Destination gate vs #91 close gate

| Gate | Question | Criteria | Result |
| --- | --- | --- | --- |
| **#91 / corpus dig v4** | Can the map close? | Fresh pull + inventory; every design-encoding matrix row `deep` \| `cite-only` \| `history-only` \| `product-stub` \| explicit `discard`/`oos`; NEW docs/seams mined or dispositioned; ≥10 prior deep anchors spot-checked; Top seams not slogan-only. | **MET** |
| **Product Destination** | Is Maka’s Target surface Current? | AHE controller / runner / `validateMakaAheChangeEvaluation` + tool-journal Phase3 reconciler exist as product Current. | **NOT MET** — product stubs (re-confirmed: symbols still absent) |

## 中文状态：NEW / shallow → mined

| 类别 | 内容 | 处置 |
| --- | --- | --- |
| **NEW 文档** | `docs/deep-research-durable-workspace.md` | **deep** → `/guides/deep-research` CN+EN |
| **NEW 代码 seam** | Deep Research run/tools/store + Desktop progress/handoff | **deep** → 同上 |
| **NEW 代码 seam** | Plan `collaboration` / `plan.ts` / plan-store / plan-mode / plan-tools / panel | **deep** → `/guides/plan-mode` CN+EN |
| **NEW 代码 seam** | Sandbox `diagnostics` / `errors` / `sandbox-context-prompt` | **deep** → §01 `#sandbox-diagnostics` CN+EN |
| **Changed ops** | Headless harness TASK_IDS / pair concurrency / Codex `xhigh` / vision images | **deep** → §04 `#harness-ab-ops` |
| **Rename drift** | site still said `visual-smoke` | **fixed** → `e2e-fixture` (desktop-ui / desktop-host CN+EN) |
| **Spot-check OK** | recovery/T1T2 · execution-evidence · sandbox select · skills · active/stale · mid-turn · capacity · CU · interaction-queue · composer · CLI · skills×29 · AHE/Phase3 stubs | no protocol DRIFT |
| **仍 stub** | AHE Target controller / Phase3 reconciler | 诚实非宣称 — 未发明 |

## What dig v4 mined

| Deliverable | Anchor |
| --- | --- |
| Deep Research companion (CN+EN) | `/guides/deep-research` — authority split · lifecycle · eight tools · resume/fail-closed · handoff |
| Plan collaboration companion (CN+EN) | `/guides/plan-mode` — tool surface · ledger CAS · SubmitPlan/update/cancel · Desktop projection |
| Sandbox diagnostics deepen | §01 `#sandbox-diagnostics` |
| Harness A/B ops deepen | §04 `#harness-ab-ops` |
| e2e-fixture rename | desktop-ui / desktop-host |
| Entry chrome retarget | dig v4 / map #91 + new companion links |

## Doc coverage snapshot (128)

| taught? | Count | % |
| --- | ---: | ---: |
| deep | 90 | 70.3% |
| cite-only | 5 | 3.9% |
| history-only | 18 | 14.1% |
| product-stub | 0 | 0% |
| discard | 6 | 4.7% |
| oos | 9 | 7.0% |

Legacy rollup: deep **90** · thin **0** · none **0**. Design-encoding debt `none`/`thin`: **empty**.

Remaining `oos` / `discard` unchanged in spirit (changelog, license, smoke, PR template, meta architecture-docs skill; superseded campaigns).

## Code seams (Top 15+ re-audit dig v4)

| Seam family | Verdict |
| --- | --- |
| Prior Top-15 dig v3 anchors (spot-check sample ≥10) | **OK** — no protocol DRIFT at `7b2f80a3` |
| Deep Research durable workspace | **NEW deep** `/guides/deep-research` |
| Plan collaboration mode | **NEW deep** `/guides/plan-mode` |
| Sandbox diagnostics / structured errors / turn-tail | **deepened** §01 `#sandbox-diagnostics` |
| Headless harness ops (TASK_IDS / xhigh / concurrency) | **deepened** §04 `#harness-ab-ops` |
| e2e-fixture (ex visual-smoke) | disposition: process harness — site rename fixed; not Destination protocol |
| AHE Target / Phase3 | **still product stubs** |

## Ticket frontier

- Map **#91**: corpus dig v4 — **close** (corpus dig ≠ product Destination).  
- Closed precursors: [#90](https://github.com/tt-a1i/agent-atelier/issues/90), [#34](https://github.com/tt-a1i/agent-atelier/issues/34).

## What “done” means (four levels)

1. **Corpus dig v2 / #34** — silent none eliminated — **closed; user rejected as complacent**.  
2. **Corpus dig v3 / #90** — Skills corpus + elevated archives + Top-15+ deepenings — **closed; user rejected without re-pull proof**.  
3. **Corpus dig v4 / #91** — re-pull · inventory delta · mine NEW · spot-check prior deep — **MET**.  
4. **Product Destination** — Target stubs become product Current — **open**, owned by maka-agent product.
