# Cognitive-track depth gap audit (post–v1 checklist)

**Date:** 2026-07-21  
**Live:** https://tt-a1i.github.io/agent-atelier/  
**Specimen:** `maka-agent` — `ARCHITECTURE.zh-CN.md` + `docs/architecture/*` + archive cost/request-shape design  
**Prior (structure only):** `docs/research/chapter-hard-gate-audit-2026-07-21.md` / closed map #1  

## Verdict (do not defend v1 “done”)

User feedback is correct. v1 hard-gate measured **structure** (keystone + ≥3 flows, bilingual, chrome, a11y, history asides). It did **not** measure whether a reader can explain Maka’s real mechanisms and trade-offs.

Current §01–§06 are **concept posters with correct slogans**: log-first, prune≠evidence, compaction=projection, TaskRun envelope, self-check≠trust, AHE outside Runtime. They are **not yet research-report depth** against the specimen architecture chapters.

**Depth bar (new map destination):** for each core invariant, a reader can state *what*, *why*, *Current vs Target*, *failure modes*, and *which PR introduced the mechanism* — without opening Maka’s draft docs.

---

## How this audit was done

Compared atelier chapter prose/diagrams against:

| Specimen | Focus |
| --- | --- |
| `ARCHITECTURE.zh-CN.md` | Six-chapter spine, three-layer model |
| `runtime-core-architecture-draft.zh-CN.md` | Event log, main chain, terminal invariant |
| `turn-evidence-tools-active-prune-draft.zh-CN.md` | Four reps, ToolRuntime, active prune protocol, invariants |
| `llm-compaction-events-log-projection-draft.zh-CN.md` | Checkpoint schema, high water, rolling, fail-open |
| `durable-task-loop-headless-draft.zh-CN.md` | TaskEvent / Attempt / park / resume |
| `self-check-bounded-feedback-loop-draft.zh-CN.md` | Plan/evidence/gates/authority |
| `ahe-self-iteration-boundary-draft.zh-CN.md` | Export / manifest / falsifiability |
| `docs/archive/deepseek-reasonix-cost-runtime-design.md` | Cache / prefixHash / requestShape (archived but still the best cost narrative) |

Site search for mechanism tokens (`prefixHash`, `cache hit/miss`, `bodySha256`, `stale prune`, `PermissionEngine`, `load_tools`, `synthesis cache`, full ToolRuntime sequence) shows **near-total absence** outside a few diagram captions.

---

## Cross-cutting gaps (worst; not owned by one §)

These barely appear on the live site, yet they are where Maka’s “design philosophy” becomes concrete:

| Gap | Why it matters | Suggested home |
| --- | --- | --- |
| **Active prune vs stale prune vs evidence** | Three different policies; site collapses to “prune context” slogan | §02 (+ pointer from §03) |
| **Archive-before-placeholder + fail-open** | Correctness > token savings; archive fail keeps full result | §02 |
| **Compaction as projection with coverage/digest/lineage** | Site says “projection” but under-teaches checkpoint authority | §03 |
| **`prefixHash` / durable prefix vs turn tail** | Explains why “shorter prompt ≠ cheaper” | New §03 companion **or** §01 request-shape section |
| **Cache hit / miss / write diagnostics** | Local request-shape diagnostics ≠ provider cache key | Same as above |
| **Full request shape attribution** | model / system / tools / history projection / current tail | Same |
| **Tool schema as prefix cost; active tools vs dispatch registry** | `load_tools` discipline | §01 spine or §02 ToolRuntime |
| **Tool result layers** | output delta ≠ tool result ≠ artifact ≠ TurnEvidence | §02 |
| **Permission as first-class Runtime action** | Not chat text; park/grant facts | §01 + §04 |
| **Self-check authority boundary** | advisory vs official / source guard / repair budget | §05 (lean OK if explicit) |
| **AHE falsifiability / readonly evidence plane** | cannot patch the scoreboard | §06 |
| **Evolution asides → mechanism PRs** | Most asides point at *docs land* PRs (768/769/…), not the PRs that introduced prune/cache/compact code | all chapters |

---

## §01 — Log Is the Runtime

### What the site already has (shallow-correct)

- Log as truth; state as projection formula  
- RuntimeEvent orthogonal dimensions (list)  
- Semantic / provider-native / bit-exact replay distinction  
- Session / Turn / Run / Invocation  
- Terminal invariant one-liner (header needs terminal event)  
- Aside → `maka:pr:768` (architecture doc land)

### Missing / barely mentioned (depth gaps)

| Concept | Specimen depth | Site today |
| --- | --- | --- |
| Execution spine `SessionManager → RuntimeKernel → AgentRun → RuntimeRunner → AiSdkFlow → Backend → ModelAdapter/ToolRuntime` | Full component responsibilities | Named once in diagrams/elsewhere? **Not taught as spine** |
| Dual stream: SessionEvent vs RuntimeEvent; Flow as semantic bridge | Detailed | Omitted |
| Single-terminal invariant + late-event drain after abort | Critical | One sentence, no failure story |
| Permission / usage / artifact as **actions**, not chat | Tables + examples | Listed in event dims only |
| Preflight / InvocationResult / structured failure taxonomy | Runner contract | Omitted |
| Crash / recovery: what is durable before exit | Separate recovery docs | Mentioned as consumer only |
| Request materialization vs message facts | bit-exact Target | Mentions request shape once; **no diagnostics model** |
| Provider-visible vs local-only state | Cost design pressure | Omitted |

**Depth verdict:** Good **slogan chapter**. Missing **runtime spine + terminal/permission/recovery mechanisms**.

---

## §02 — Evidence Before Compression

### What the site already has

- Four representations + pipeline keystone  
- Slogan: prune context, never evidence  
- Active prune “rewrites provider messages only”  
- Current vs Target TurnEvidence envelope label  
- Aside → `maka:pr:769`

### Missing / barely mentioned

| Concept | Specimen depth | Site today |
| --- | --- | --- |
| ToolRuntime as side-effect boundary (guards, permission, loop gate, synthetic error results) | ~11-step sequence + sequence diagram | One sentence name-drop |
| output delta vs tool result vs artifact | Explicit | Omitted |
| **Archive before placeholder** protocol (hash, artifactId gate) | Step protocol + mermaid | Diagram hint only; no field-level teaching |
| Placeholder payload (`bodySha256`, `rewriteVersion`, reason codes) | Concrete | Omitted |
| Fail-open matrix (archive throw / empty id / wrong shape → keep original) | Table | Caption only |
| Idempotent rewrite / no double-archive | Protocol | Omitted |
| **Active vs stale** prune (current Turn prepareStep vs prior history) | Explicit split | Active only; stale almost absent |
| Heavy-task compact evidence rules (Bash/Read/Write bounds, 8-envelope window) | Current implementation | One vague sentence |
| Target: visibility × authority; source-bearing envelope fields | Type sketch + invariants | Stub paragraph |
| Failure matrix (permission denied, mid-tool crash, corrupt hydrate) | Full table | Absent |
| Diagnostics for rewrite / token savings | Required invariant | Absent |

**Depth verdict:** Strongest **visual** chapter; still a **poster**. Reader cannot restate prune protocol or evidence layers after one read.

---

## §03 — Compaction Is a Projection

### What the site already has

- Projection formula; three layers (log / checkpoint / provider messages)  
- High water trigger (semantics, not magic numbers as protocol)  
- Rolling checkpoint + `sourceDigest` + durable-before-replace  
- Three compact kinds (history LLM / active prune / semanticCompact)  
- Fail-open list + “not memory / not delete / not proof”  
- Asides → `maka:pr:772` (+ a few later PRs)

### Missing / barely mentioned

| Concept | Specimen depth | Site today |
| --- | --- | --- |
| Full `HistoryCompactCheckpoint` schema (identity, high water, coverage, projection, lineage) | Field list | Coverage/digest mentioned; schema not taught |
| `buildPriorMessages` pipeline order (stale prune → high water → validate → roll → materialize) | Numbered pipeline | Collapsed |
| Checkpoint as **synthetic** RuntimeEvent in projection only | Explicit | Missing |
| V1 `HistoryCompactBlock` vs V2 ledger checkpoint path | Compatibility story | Stub only |
| Synthesis cache / archive retrieval in prior path | Steps 9–10 | Absent |
| Interaction with **provider cache locality** (folding changes history projection → miss) | Cost archive | **Absent** |
| Tail selection edge cases (giant Turn → keep last call/response pair) | Policy detail | Mentioned lightly |
| Who owns authority: LLM vs Runtime | Good sentence exists | Needs worked example |

**Depth verdict:** Best **conceptual** chapter of the six, still missing **pipeline + schema + cache interaction**.

---

## §04 — The Durable Task Loop

### What the site already has

- TaskRun as outer durable envelope  
- Session ≠ TaskRun  
- Ledger owns control-plane facts; workspace/live stream not guaranteed  
- Attempt continue / budgets / park resume notes  
- Cold-start resume flow (recent addition)  
- Aside → `maka:pr:773`

### Missing / barely mentioned

| Concept | Specimen depth | Site today |
| --- | --- | --- |
| TaskEvent kinds & projection rules (`projectTaskRun`) | Detailed | Named, not enumerated |
| Permission **fail-closed** + parked grant facts on resume | Contracts | Bullet-level |
| Workspace lease / executor ownership | Target/ADR material | Boundary diagram only |
| Recovery resolver / crash contracts (phase0/1 docs) | Separate ADRs | Cold-start figure helps; not contract-deep |
| How Task refs RuntimeEvents without becoming second truth | Architecture | Slogan-level |
| Budget layers as **policy objects**, not UI meters | Draft | Figure exists; little protocol |

**Depth verdict:** Hybrid pass made it **less thin** than §05/§06, still not “can implement from the page.”

---

## §05 — Self-Check Is Not Self-Trust

### What the site already has

- Feedback plane vs authority plane  
- Plan-before-evidence; schema caps; repair budget  
- Current advisory vs Target executor-owned evidence  
- Aside → `maka:pr:774` / freshness `954`

### Missing / barely mentioned

| Concept | Specimen depth | Site today |
| --- | --- | --- |
| Source Guard rules (what counts as public task material) | Policy detail | Named |
| Hygiene / consistency audit (scratch vs deliverable pollution) | Steps | Listed in keystone only |
| Strong-pass gates (`missing_self_check_plan`, etc.) | Enumerated | One example |
| Score / official verifier authority vs model report | Boundary with §02/§06 | Thin |
| Boundedness numbers / when loop must stop | Caps | “budget” without mechanism |
| How self-check evidence must remain source-bearing under prune | Cross-link to §02 | One sentence |

**Depth verdict:** Correct **authority slogan**; thin on **gates and failure taxonomy**. Acceptable to stay lean **after** Runtime mechanisms are deep — not as a substitute for them.

---

## §06 — Self-Iteration Happens Outside the Runtime

### What the site already has

- Runtime plane vs Evolution plane  
- Export chain via TaskRun projection  
- Readonly `maka-runtime-evidence`; target snapshot identity  
- Manifest → independent eval → accept/rollback (Target honesty)  
- Aside → `maka:pr:776` / export PRs

### Missing / barely mentioned

| Concept | Specimen depth | Site today |
| --- | --- | --- |
| Change surface / allowed components as protocol | Snapshot components | Named list |
| Falsifiable predictions vs narrative “fixed” | Manifest semantics | Slogan |
| Candidate evaluation harness boundary | Draft | One flow figure |
| Rollback lineage mechanics | Draft | Word only |
| Why evidence plane must be non-writable (attack: edit the scoreboard) | Explicit | Good paragraph — keep, deepen with example |
| Relation to Prompt Optimization Loop (adjacent ≠ AHE complete) | Honesty note | Stub |

**Depth verdict:** Boundary is clear; **controller protocol** still poster-level. Defer after Runtime-first pass unless user chooses even depth.

---

## Diagrams: mechanism vs decoration

| Chapter | Diagrams teach… | Still decorative / incomplete |
| --- | --- | --- |
| §01 | Log-centered projection | No spine sequence; no terminal race |
| §02 | Four reps + prune rewrite | No archive-before-placeholder decision diamond with fail-open; no stale path |
| §03 | Projection + rolling | No full prior-messages pipeline; no cache-miss side-effect |
| §04 | Envelope + cold start | Park/grant and workspace lease under-drawn |
| §05 | Feedback plane | Gate taxonomy not visualized |
| §06 | Two planes | Lineage/rollback not mechanistic |

---

## History asides: wrong depth of pointer

Most cognitive asides cite **architecture documentation land PRs** (768–776). Useful for “when we wrote the chapter,” weak for “when the mechanism entered the runtime.”

Depth pass should prefer asides that pin **mechanism introduction / tightening PRs** (prune, checkpoint V2, cache diagnostics, self-check freshness, etc.), with docs-land PRs as secondary.

---

## Relation to closed #33 Hybrid

[#33](https://github.com/tt-a1i/agent-atelier/issues/33) locked Hybrid: thicken §04, keep §05–§06 lean for **checklist completion**. That decision optimized **v1 structure closure**, not **mechanism depth**.

This audit **does not reopen #33 as if unanswered**. It opens a **new** depth map. Recommended default: **Runtime-first deep pass** (§02 prune/evidence → §03 compaction → request-shape/cache → §01 spine) before even-depth on §04–§06.

---

## Recommended ticket order (frontier)

1. **Grilling:** depth priority — Runtime-first vs even depth all six (recommend Runtime-first).  
2. **Research:** §02 active prune + evidence layers deep outline (worst gap).  
3. **Research:** §03 compaction projection deep outline (pipeline + schema).  
4. **Research:** provider cache / `prefixHash` / request-shape teaching home + outline.  
5. **Research (optional follow):** §01 log-first spine + terminal/permission deeper.  
6. Later: §04 contracts, §05 gates, §06 falsifiability — after Runtime mechanisms stand.

---

## Acceptance of “depth done” (draft; lock on new map)

A chapter is depth-done only when:

1. Reader can teach the mechanism without opening Maka drafts.  
2. Current vs Target is field-accurate, not slogan-accurate.  
3. At least one figure encodes a **protocol / failure matrix**, not only a metaphor.  
4. History aside points at a **mechanism PR**, not only a docs PR.  
5. Cross-cutting terms (prune / evidence / compaction / cache / permission / self-check / AHE) stay glossary-consistent.

Structure checklist remains necessary but **never sufficient**.
