# Maka corpus mine plan (atelier depth map #34)

**Date:** 2026-07-21  
**Specimen root:** `/Users/tushaokun/code/maka-agent`  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Companion honesty note:** [`depth-gap-audit-pass2.md`](./depth-gap-audit-pass2.md)  
**Code-seam ranking (Top 15 + module map):** [`maka-code-seam-inventory.md`](./maka-code-seam-inventory.md) — source+tests dig; does not replace this corpus plan.

## Verdict (do not fake Destination)

Raising the bar to **entire maka-agent corpus** (every first-party doc + design-bearing code) makes Destination **not complete**. The six ARCHITECTURE chapter essays on atelier were protocol-deepened against the six architecture drafts; that is **one seam cluster**, not the mine.

**Authority rule (from maka `docs/README.md`):** when docs disagree with implementation, **code + contract tests win**. Archive is not current guidance — but archive that still encodes design must be mined for teaching, then cross-checked against Current code.

---

## Inventory counts (2026-07-21, first-party)

| Bucket | Count | Notes |
| --- | ---: | --- |
| **All first-party `*.md` / `*.mdx`** | **127** | Excludes `node_modules` / `.git` |
| Root authority | 7 | `ARCHITECTURE*.md`, `README*.md`, `DESIGN.md`, `SECURITY.md`, `CHANGELOG.md` |
| `docs/` current (non-archive) | ~27 | Contracts + index; includes computer-use suite, swarm, skills, ledgers, AHE protocol |
| `docs/architecture/` | 17 | Six-chapter drafts (± EN/ZH) + recovery ADRs + MCP + bot onboarding |
| `docs/archive/` | 40 | Not current contracts; several still teach (cost, CU hardening, runtime v2 manuals) |
| Package READMEs (first-party) | 4 | `runtime`, `runtime/src/sandbox`, `headless`, `ui` |
| Apps / smoke | 3 | `apps/desktop/README.md`, renderer README, `tests/smoke.md` |
| Meta writing skill | 5 | `skills/maka-architecture-docs/**` |
| Bundled product skills | 29 | `apps/desktop/resources/bundled-skills/*/SKILL.md` — product surface, not Runtime theory |
| Notes / misc | 2 | `notes/…`, `.github/pull_request_template.md` |
| Design-bearing TS (excl. tests, approx.) | ~780+ | `runtime` 180 · `headless` 105 · `core` 81 · `storage` 30 · `computer-use` 10 · `runtime-host` 18 · `cli` 28 · `desktop/src` 326 · `mcp` 2 |

**Classification legend used below**

| Class | Meaning |
| --- | --- |
| **A — current authority** | Listed in maka `docs/README.md` or root/package README as live contract |
| **B — architecture draft** | `docs/architecture/*` chapter / ADR (may lag code; still primary teaching spine for §01–§06) |
| **C — archive that still teaches** | Superseded as contract, durable ideas remain |
| **D — package / app README** | Public seam + ownership |
| **E — tests-as-spec** | `__tests__/*` lock invariants; must be cited when mining |
| **F — product skill surface** | Bundled SKILL.md; teach only if atelier covers Skills product |
| **G — design-bearing code** | Source is primary; docs secondary |

---

## Teaching homes on atelier

| Home | Use |
| --- | --- |
| §01–§06 cognitive chapters | Worldview + protocol for Runtime / evidence / compact / TaskRun / self-check / AHE |
| Lean callouts | One causal sentence + link (never re-teach full foreign chapter) |
| New companion pages (optional) | `/guides/*` or seventh-track pages — **only** when a seam cannot honestly live in §01–§06 without exploding IA |
| Research notes here | `docs/research/*-deep-outline.md` → later narrative tickets |
| History asides | Mechanism PRs, not docs-land PRs |

**IA constraint:** map keeps 1:1 with Maka six chapters. Fat seams (computer-use, sandbox, MCP, swarm) get **research → outline → deepen home chapter or companion guide**, not silent omission.

---

## Master seam table

Status: **empty** = absent/near-absent on live atelier · **thin** = slogan or one mention · **deep** = reader can restate protocol/failure modes without opening maka drafts · **outline** = research note exists, narrative not shipped.

### Cluster 0 — Six architecture chapters (already worked)

| Seam | Sources | Class | Atelier home | Status |
| --- | --- | --- | --- | --- |
| Log / exec spine / terminal / permission-as-action | `runtime-core-architecture-draft*`, `permission-engine.ts`, `runtime-runner.ts`, `TerminalRace` | B+G | §01 | **deep** (shipped `6eeef22`) |
| Request-shape / prefixHash / cache diagnostics | archive cost design + `request-shape.ts` + telemetry | C+G | §01 `#request-shape` | **deep** teaching home; optional `/guides/cost` still fog |
| Active/stale prune + evidence layers | `turn-evidence-tools-active-prune-draft*`, `active-tool-result-prune.ts`, `tool-runtime.ts` | B+G | §02 | **deep** (`d10f8c6`) |
| Compaction projection | `llm-compaction-events-log-projection-draft*`, `history-compact*.ts` | B+G | §03 | **deep** (`9969fbc`) |
| Durable Task Loop | `durable-task-loop-headless-draft*`, headless TaskRun | B+G | §04 | **deep** (`68ac5d4`) + session ledger contrast `#ledger` |
| Self-check authority | `self-check-bounded-feedback-loop-draft*` | B+G | §05 | **deep** (`fd777d5`) |
| AHE boundary | `ahe-self-iteration-boundary-draft*`, `ahe-target-protocol.md`, headless export | A+B+G | §06 | **deep** (`3c94e3c`) on boundary; Target controller still honest stub |

### Cluster 1 — Fat unmined contracts (priority)

| Seam | Sources | Class | Atelier home | Status |
| --- | --- | --- | --- | --- |
| **Sandbox boundary** | `packages/runtime/src/sandbox/**`, `@maka/core` `permission-profile*.ts`, sandbox tests | A+D+G+E | §01 `#sandbox` | **deep** (home locked #46; shipped #62) |
| **Computer-use suite** | 6 current CU docs + `packages/computer-use` + `openai-computer-*.ts` + archive CU hardening | A+C+G | Companion `/guides/computer-use` + lean §01 pointer | **outline+shipped** → [`computer-use-six-contracts-deep-outline.md`](./computer-use-six-contracts-deep-outline.md) · live guide |
| **Recovery Phase 0/1 + tool journal** | `runtime-resume-phase0*`, `phase1*`, `runtime-recovery-resolver-adr*`, `runtime-resume-tool-journal*`, `recovery-resolver.ts`, `runtime-resume.ts` | A+B+G | §01 `#recovery` deepen + §04 crash | **deep** (failpoint matrix + Resolver; #48) |
| **Execution evidence spine** | `execution-evidence-spine.md`, `packages/core` execution-evidence | A+G | §01 `#execution-evidence` + lean §02/§04/§05/§06 | **deep** → [`execution-evidence-deep-outline.md`](./execution-evidence-deep-outline.md); live zh+en |
| **Session task ledger** (≠ TaskRun) | `session-task-ledger-lifecycle.md`, `task-ledger-store.ts`, `task-ledger-tools.ts` | A+G | §04 `#ledger` | **deep** (contrast section; #49) |
| **MCP runtime** | `mcp-runtime-architecture-draft.zh-CN.md`, `mcp-tools.ts`, `packages/mcp` | B+G | §01 `#mcp` | **outline+shipped** → [`mcp-runtime-deep-outline.md`](./mcp-runtime-deep-outline.md) |
| **Agent swarm + expert team** | `agent-swarm.md`, `expert-team-runtime.md`, swarm/team tools | A+G | §04 `#swarm` | **outline+shipped** → [`agent-swarm-expert-team-deep-outline.md`](./agent-swarm-expert-team-deep-outline.md) |
| **Skill catalog policy** | `skill-catalog-policy.md`, `skills.ts`, `skill-invocation.ts` | A+G | §01 `#skills` | **outline+shipped** → [`skill-catalog-policy-deep-outline.md`](./skill-catalog-policy-deep-outline.md) |
| **Headless trust / Harbor isolation** | `packages/headless/README.md`, harbor/*, eval adapters | D+G | §04 `#harbor-trust` | **outline+shipped** → [`headless-harbor-trust-deep-outline.md`](./headless-harbor-trust-deep-outline.md) |
| **Storage ledgers** | `packages/storage/**` (JSONL, sqlite-runtime, task/artifact stores) | G+D | §01 `#stores` + `#durability` | **outline** → [`storage-ledgers-deep-outline.md`](./storage-ledgers-deep-outline.md); lean durability shipped |
| **Usage / cost telemetry code** | `telemetry/*`, `usage-stats-store.ts`, provider-request telemetry | G | §01 `#request-shape` → `#usage-stores` | **outline** → [`usage-cost-telemetry-deep-outline.md`](./usage-cost-telemetry-deep-outline.md); dual-store/pricing shipped |
| **Shell / PTY / workspace executor** | `shell-*.ts`, `pty-*.ts`, `workspace-executor.ts` | G | §02 `#shell-side-effects` + §01 sandbox pointer | **deep** (shipped #68) → [`shell-pty-executor-deep-outline.md`](./shell-pty-executor-deep-outline.md) |
| **Filesystem worker / path containment** | `filesystem-worker/**`, `path-containment.ts` | G | §01/§02 | **empty** |
| **Runtime-host / gateway** | `packages/runtime-host/**` | G | §01 `#runtime-host` lean; companion fog | **outline** → [`runtime-host-gateway-deep-outline.md`](./runtime-host-gateway-deep-outline.md); lean note shipped |
| **Bot onboarding / IM bridges** | `bot-onboarding-runtime.zh-CN.md`, `runtime/src/bots/**` | B+G | Companion `/guides/bot-im` | **deep** (shipped #69) → [`bot-im-onboarding-deep-outline.md`](./bot-im-onboarding-deep-outline.md) · live guide |
| **Workspace privacy + SECURITY** | `workspace-privacy-context.md`, `SECURITY.md` | A | §01 `#trust` + `/guides/security-privacy` | **outline+shipped** → [`trust-privacy-security-deep-outline.md`](./trust-privacy-security-deep-outline.md) · live companion |
| **Desktop main composition** | `apps/desktop/src/main/**`, desktop/renderer READMEs | D+G | Entry or companion “product shell” | **empty** |

### Cluster 2 — Archive that still teaches (must not skip)

**Full 40-file classification:** [`archive-still-teaches-sweep.md`](./archive-still-teaches-sweep.md) (2026-07-21) — **14 mine-delta · 15 history-only · 11 discard**.  
**Top-3 absorb:** [`archive-mine-delta-absorb-2026-07-21.md`](./archive-mine-delta-absorb-2026-07-21.md) (teaching manual + cost design + CU hardening).

| Archive | Why mine | Atelier obligation |
| --- | --- | --- |
| `deepseek-reasonix-cost-runtime-design.md` | Best cost narrative | **absorbed** → §01 `#request-shape` honesty |
| `runtime-mainline-teaching-manual.md` / `runtime-kernel.md` / v2 evolution | Overlapping teaching narrative | **manual absorbed**; kernel/v2 still delta-only |
| `heavy-task-mainline-system-design.md` | Heavy-task chronicle | Cross-check §04/§05 Current |
| Computer-use archive hardening suite | Incident → policy lessons | **absorbed** → CU `#evidence-hardening` |
| Threat-model archives (memory/search/voice) | Security posture snapshots | Only if atelier teaches those products |
| `maka-memory-whitebox-contract.md` | Memory boundary | Companion if memory enters TOC |
| Reverse-eng (codex/cursor, qoderwork) | External comparison | History track or aside only |

### Cluster 3 — Explicitly lower priority for Destination (still inventoried)

| Seam | Why lower | Status |
| --- | --- | --- |
| Frontend CSS governance / DESIGN.md | Product UI, not Runtime mechanism depth | Out of cognitive Destination unless UI track opens |
| Bundled SKILL.md ×29 | Product content | F — catalog policy mines the *mechanism*; skills themselves optional |
| Eval benchmark writeups | Results snapshots | Cite from §04/headless if needed |
| Meta architecture-docs skill | How maka writes docs | Agent ops, not reader Destination |

---

## Code-first mine order (recommended)

Even-depth map posture remains, but **corpus dig** is queue-ordered by “atelier empty × mechanism fatness”:

1. Sandbox + PermissionProfile ↔ Seatbelt (**started** — outline)  
2. Recovery failpoint matrix + Phase1 safe boundary  
3. Session task ledger ≠ TaskRun  
4. Execution evidence spine  
5. Computer-use foundation (companion page likely)  
6. Headless trust / Harbor  
7. Storage JSONL/SQLite authority  
8. Shell/PTY/workspace executor  
9. MCP + skills catalog  
10. Swarm / expert team  
11. Runtime-host / bots / privacy  
12. Archive delta sweeps  

Parallel research tickets OK; narrative tickets must cite **code paths + tests**, not docs alone.

---

## Acceptance for a seam (corpus-level)

A seam is mined enough for Destination only when:

1. Reader can teach *what / why / Current vs Target / failure modes* from atelier.  
2. At least one figure or table encodes a **protocol or fail-closed matrix**.  
3. Asides pin **mechanism PRs or test files**, not only docs-land PRs.  
4. Specimens list both **authority doc** and **code path**; archive labeled as archive.  
5. Cross-links to §01–§06 stay glossary-consistent.

**Structure checklist ≠ corpus depth.** Six chapters deep ≠ Destination.

---

## Ticket frontier (opened under #34)

| # | Title | Notes |
| --- | --- | --- |
| [#46](https://github.com/tt-a1i/agent-atelier/issues/46) | Sandbox outline → narrative home | **closed** — home = §01 `#sandbox` |
| [#62](https://github.com/tt-a1i/agent-atelier/issues/62) | Task: ship sandbox teaching | **closed** — live zh+en |
| [#47](https://github.com/tt-a1i/agent-atelier/issues/47) | Computer-use suite teaching plan | **closed** — outline + `/guides/computer-use` |
| [#48](https://github.com/tt-a1i/agent-atelier/issues/48) | Recovery Phase0/1 + tool journal | **closed** — outline + §01 `#recovery` |
| [#49](https://github.com/tt-a1i/agent-atelier/issues/49) | Session task ledger ≠ TaskRun | **closed** — outline + §04 `#ledger` |
| [#50](https://github.com/tt-a1i/agent-atelier/issues/50) | Execution-evidence spine | **closed** — outline + §01 `#execution-evidence` + lean cross-links |
| [#51](https://github.com/tt-a1i/agent-atelier/issues/51) | MCP runtime | **closed** — outline + §01 `#mcp` |
| [#52](https://github.com/tt-a1i/agent-atelier/issues/52) | Agent swarm + expert team | **closed** — outline + §04 `#swarm` |
| [#53](https://github.com/tt-a1i/agent-atelier/issues/53) | Skill catalog policy | **closed** — outline + §01 `#skills` |
| [#54](https://github.com/tt-a1i/agent-atelier/issues/54) | Headless trust / Harbor | **closed** — outline + §04 `#harbor-trust` |
| [#55](https://github.com/tt-a1i/agent-atelier/issues/55) | Storage ledgers | **outline + lean §01 durability** |
| [#56](https://github.com/tt-a1i/agent-atelier/issues/56) | Shell/PTY/workspace-executor | **closed** research · [#68](https://github.com/tt-a1i/agent-atelier/issues/68) shipped §02 |
| [#57](https://github.com/tt-a1i/agent-atelier/issues/57) | Runtime-host gateway | **outline + lean §01 note** |
| [#58](https://github.com/tt-a1i/agent-atelier/issues/58) | Bot onboarding / IM | **closed** research · [#69](https://github.com/tt-a1i/agent-atelier/issues/69) shipped `/guides/bot-im` |
| [#59](https://github.com/tt-a1i/agent-atelier/issues/59) | Workspace privacy + SECURITY | **closed** research + companion `/guides/security-privacy` shipped |
| [#60](https://github.com/tt-a1i/agent-atelier/issues/60) | Archive-that-still-teaches sweep | **done** + top-3 absorb → `archive-mine-delta-absorb-2026-07-21.md` |
| [#61](https://github.com/tt-a1i/agent-atelier/issues/61) | Usage/cost telemetry beyond request-shape | **outline + §01 `#usage-stores`** |

Research → `docs/research/*`; Task → live zh+en.

---

## What this file is not

- Not a claim that Destination is done.  
- Not a license to invent provider internals.  
- Not a seventh cognitive worldview chapter by default — companions are for **orthogonal product surfaces** (CU, sandbox guide, MCP) when six chapters cannot absorb them honestly.
