# §01 deep outline — Log-first spine + terminal / permission

**Ticket:** [#39](https://github.com/tt-a1i/agent-atelier/issues/39)  
**Map:** [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline (not a live-chapter rewrite)  
**Depth posture:** Even depth ([#35](https://github.com/tt-a1i/agent-atelier/issues/35)); schedule in parallel with §02/§03/cache — not “optional follow after Runtime-first”  
**Related:** [#38](https://github.com/tt-a1i/agent-atelier/issues/38) cache/request-shape (hosted here) · [#36](https://github.com/tt-a1i/agent-atelier/issues/36) §02 · [#37](https://github.com/tt-a1i/agent-atelier/issues/37) §03

## Goal for the deepened chapter

After reading deepened §01, a reader can teach:

1. Why log-first is a **mechanism** (produce → durable append → project → consume), not only a slogan.  
2. The execution spine responsibilities from `SessionManager` through `ToolRuntime`.  
3. Dual streams: `SessionEvent` vs `RuntimeEvent`, and `AiSdkFlow` as the semantic bridge.  
4. Single-terminal invariant + late-event drain after abort (with a failure story).  
5. Permission / usage / artifact as **actions**, not chat text.  
6. What recovery consumers do (and do not) on crash — state repair ≠ warm resume.  
7. How request materialization hooks into the cache/request-shape teaching plan (#38).

Without opening `runtime-core-architecture-draft.zh-CN.md`.

## What stays from the current chapter

Keep: scene (failed tests → fix → re-run), keystone formula + log-centered SVG, produce/consume flow, RuntimeEvent orthogonal dimensions list, Session/Turn/Run/Invocation identity, three replay layers, terminal invariant one-liner, bilingual structure.

Replace / expand: spine named vaguely → component responsibility teaching; terminal one-liner → race + late drain story; actions listed in dimensions only → permission/usage/artifact as control flow; recovery “consumer only” → durable-before-exit + header/ledger mismatch; bit-exact honesty → hook to #38 cost spine; primary aside `768` → mechanism-first pins.

---

## Proposed section map (zh primary → EN same-ship)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `scene` | 从一个看似简单的请求开始 | Keep; list open-loop pressures |
| `keystone` | 状态不是一张表，而是日志的函数 | Keep SVG + formula |
| `spine-consume` | 生产、提交、投影、消费 | Keep produce→consume; clarify consumers |
| `identities` | 四个不要混的身份 | Keep Session/Turn/Run/Invocation |
| `event` | 一条 RuntimeEvent 保存了什么 | Keep dimensions; sharpen Actions |
| `exec-spine` **NEW** | 执行主链：谁保护什么稳定性 | Component map + responsibilities |
| `dual-stream` **NEW** | SessionEvent 与 RuntimeEvent | Flow bridge; migration honesty |
| `loop` **NEW** | 模型 ↔ 工具如何推进 | Sequence condensed from specimen |
| `permission` **NEW** | 权限是 Runtime 控制流 | allow / block / prompt + park |
| `terminal` **NEW** | 单终态与迟到事件 | Race story; header vs ledger |
| `stores` **NEW** | 三套存储的权威边界 | Session / AgentRun / RuntimeEvent |
| `recovery` **NEW** | 崩溃后修复什么 | Not warm tool resume |
| `replay` | 语义 / provider-native / bit-exact | Expand; hook #38 |
| `request-shape` **NEW** (from #38) | Request materialization & cost spine | See teaching plan — host cluster |
| `invariants` **NEW** | 必须保护的不变量 | Numbered exam list |
| `asides` | 演进旁注 | Mechanism PRs first |

`request-shape` cluster content is specified in [`cache-request-shape-teaching-plan.md`](./cache-request-shape-teaching-plan.md); this outline only reserves the home and spine hook.

---

## Section specs

### 1. Execution spine (`exec-spine` NEW)

Teach the chain as **stability boundaries**, not class tourism:

```text
Caller
  → SessionManager          # product façade
  → RuntimeKernel           # active-run control plane
  → AgentRun                # durable execution envelope
  → RuntimeRunner           # Invocation protocol
  → AiSdkFlow               # SessionEvent → RuntimeEvent bridge
  → AgentBackend (AiSdkBackend)
       → ModelAdapter       # provider stream normalization
       → ToolRuntime        # side-effect boundary
```

Responsibility table (condensed for the page):

| Component | Owns | Must not own |
| --- | --- | --- |
| SessionManager | Stable `sendMessage` / stop / recover entry | Request-shape math, tool loop |
| RuntimeKernel | Create/register Run, route stop/permission, assemble Runner+Flow, ensure finalize | Provider stream details |
| AgentRun | Header lifecycle, initial user RuntimeEvent, history construct, terminal commit | Choosing next tool |
| RuntimeRunner | Preflight rules, require terminal, structured `InvocationResult` | Calling provider/tools |
| AiSdkFlow | Map Backend events → canonical facts; **one terminal** | Re-implementing the model loop |
| AiSdkBackend | Prompt/history/tools/step loop/usage attach | Declaring Session-wide active runs |
| ToolRuntime | Guards, permission, execute, synthetic error results, artifacts | UI transcript authority |

Figure plan: **NEW ExecSpineFlow** — left-to-right; caption “each layer protects a different stability.”

Note honesty: Runner preflight seam exists; production Kernel may not inject an independent gate yet — label Current capability vs wired entry.

### 2. Dual stream (`dual-stream` NEW)

| Stream | Audience | Role today |
| --- | --- | --- |
| `SessionEvent` | Renderer / legacy consumers | Backend still emits these |
| `RuntimeEvent` | Canonical semantic log | Preferred for completed replay |

`AiSdkFlow` mapping beats:

- text / thinking → model content  
- tool_start / tool_result → function call / response  
- permission request/decision → actions  
- usage → action  
- error / abort / complete → failure or terminal facts  

Migration honesty: Flow is still a legacy-to-canonical adapter; Backend does not yet natively emit only RuntimeEvents. Cost of dual maintenance is a real Current boundary, not a footnote shame.

### 3. Model/tool loop (`loop` NEW)

Condensed sequence (one figure):

1. Kernel starts Turn → AgentRun.begin  
2. Runner runs Flow → Backend.send  
3. streamText → thinking/text/tool call  
4. ToolRuntime.execute → tool result  
5. Next step with results  
6. Final text + finish → SessionEvents  
7. Flow emits RuntimeEvents + **exactly one** terminal  
8. AgentRun commits terminal fact + finalize projections  

Teaching extras:

- Persist per-step assistant text/thinking (not one giant final blob).  
- Tool calls carry step IDs for replay reassembly.  
- During tools, pause model idle watchdog (silence is expected); tool/run timeouts still apply.  
- Default step cap (Current policy, e.g. 50) — if still tool-calling at cap, keep results + deterministic continue hint rather than empty UI.

### 4. Permission as action (`permission` NEW)

Three outcomes from PermissionEngine:

| Result | Runtime behavior | Ledger |
| --- | --- | --- |
| allow | Execute impl | Decision recorded as needed by policy |
| block | **No** real side effect; **synthetic error tool result** | Denial + paired result |
| prompt | Emit permission request; pause watchdog; Session → `waiting_for_user`; Run keeps identity | Request fact; later decision fact |

Routing: `RuntimeKernel.respondToPermission()` → Backend → ToolRuntime writes decision → continue or deny.

Must land lines:

- Permission is not “UI paused a modal.”  
- Replay/diagnostics can answer why the run stopped and how control returned.  
- Pairing with §02: synthetic error results preserve call/result pairing (detail protocol in §02).

Figure plan: **NEW PermissionControlFlow** — allow/block/prompt diamond.

### 5. Terminal invariant + late drain (`terminal` NEW)

Keystone (keep, then deepen):

> A terminated Run must have exactly one valid terminal RuntimeEvent; the Run header must be backed by that fact.

Failure stories to teach:

1. **Double terminal:** Backend emits `abort` then `complete(user_stop)` → Flow accepts first; **silently drains** late events; aborted semantics win.  
2. **Header without ledger:** `run.json` says completed but no terminal RuntimeEvent → do not trust header; repair toward `missing_terminal_event` failure.  
3. **Ledger without header update:** terminal event durable, process dies before header → read model treats terminal event as stronger; recovery repairs header.  
4. **Stop then late complete:** Kernel marks stopped + Backend.stop; late provider complete/error cannot resurrect “completed successfully.”

Runner rules worth naming:

- Preflight fail → do not start Flow / do not fake a started invocation.  
- Initial user RuntimeEvent before Flow events.  
- Flow throw / no terminal / permission denied / abort / incomplete finish → structured failure.  
- Success requires non-empty final model text (Current contract).

Figure plan: **NEW TerminalRace** — timeline with late complete dashed and rejected.

### 6. Three stores (`stores` NEW)

| Store | Answers | Not for |
| --- | --- | --- |
| SessionStore (`StoredMessage`) | UI / compat / in-flight projection | Sole authority for completed semantics |
| AgentRunStore (`run.json` + operational events) | Run lifecycle ops index | Replacing interaction semantics |
| RuntimeEventStore (`runtime-events.jsonl`) | Canonical AI interaction facts | Unlimited partial delta spam |

Directory sketch (file-backed Current):

```text
sessions/<sessionId>/
  ... session projection ...
  runs/<runId>/
    run.json
    events.jsonl
    runtime-events.jsonl
    runtime-partials/
```

Partial streams: bounded replaceable snapshots; final non-partial covers the semantic slot.

### 7. Recovery (`recovery` NEW)

Startup recovery **does**:

- Scan non-terminal Runs + ledgers  
- Detect stale model stream / tool tail / permission wait / corrupt ops events  
- Conservatively commit failed/cancelled + repair Session/Turn projections  

Startup recovery **does not**:

- Re-invoke the model mid-tool  
- Warm-resume from the next line of a side effect  
- Guess what the model “was about to do” without durable facts  

Label: **state repair**, foundation for future checkpoint resume — not warm resume today. Point §04 for TaskRun/Attempt durability across processes.

### 8. Replay layers + request-shape hook (`replay` expand → `request-shape`)

Keep three layers:

1. **Semantic** — Current from RuntimeEvent  
2. **Provider-native** — capability-gated plan (pairing, signatures, degradation)  
3. **Bit-exact wire** — not claimable from message log alone  

Then open the #38 cluster (summarized here for outline completeness):

- Durable prefix vs turn tail  
- `prefixHash` / `requestShapeHash` local diagnostics  
- Usage hit/miss/write provenance  
- Attribution ladder  
- Active tools vs registry  

Full prose/figures: [`cache-request-shape-teaching-plan.md`](./cache-request-shape-teaching-plan.md).

### 9. Invariants (`invariants` NEW)

1. Log is source of truth; state is a materialized view.  
2. UI transcript is never canonical for completed semantics.  
3. Exactly one valid terminal RuntimeEvent per terminated Invocation/Run.  
4. Terminal header commit requires durable terminal fact (or explicit repair path).  
5. Late events cannot override an accepted terminal.  
6. Permission/usage/artifact travel as actions, not chat masquerade.  
7. Tool call/result pairing remains reconstructible.  
8. Partial stream facts are replaceable; durable facts are not silent deltas forever.  
9. Recovery repairs projections from durable facts; it does not invent success.  
10. Request materialization may evolve; message facts stay stable (#38).  

---

## Diagram plan

| Figure | Action |
| --- | --- |
| LogIsRuntimeKeystone | Keep |
| EventProduceConsumeFlow | Keep; caption consumers |
| IdentityLayersFlow | Keep |
| ReplayLayersFlow | Keep; add materialization → cost spine arrow |
| **NEW ExecSpineFlow** | Component chain |
| **NEW DualStreamBridge** | SessionEvent → Flow → RuntimeEvent |
| **NEW ModelToolLoop** | Sequence (tools pause watchdog) |
| **NEW PermissionControlFlow** | allow/block/prompt |
| **NEW TerminalRace** | Late drain |
| From #38 | PrefixVsShape + AttributionLadder (hosted in this chapter) |

---

## History asides (mechanism-first)

| Pin | Why |
| --- | --- |
| `maka:pr:9` | Wire AiSdkFlow into SessionManager runtime path |
| `maka:pr:6` | Runner/Flow contracts |
| `maka:pr:14` / `maka:pr:11` | RuntimeEvent as semantic source / prefer for history |
| `maka:pr:410` | Repair missing terminal runtime ledgers |
| `maka:pr:435` | Preserve stop semantics for synthetic terminals |
| `maka:pr:21` / `maka:pr:23` | Request-shape / cache diagnostics (with #38 cluster) |
| `maka:pr:1223` | Durable safe-boundary resume phases (recovery evolution; advanced) |
| `maka:pr:768` | Docs land — **secondary** |

Replace today’s sole primary `768` aside.

---

## Boundary with other chapters / tickets

| Concern | §01 | Elsewhere |
| --- | --- | --- |
| ToolRuntime 11-step + archive prune | Permission + synthetic error + pairing mention | Full protocol in §02 (#36) |
| Compaction pipeline / checkpoint schema | Consumer of log; pointer | §03 (#37) |
| Cache / prefixHash / load_tools ladder | **Hosts** teaching | Plan in #38; callouts in §02/§03 |
| TaskRun park/grant across Attempts | Permission-as-action worldview | Envelope depth in §04 |
| Self-check authority | Terminal/verifier not upgraded by chatter | §05 |

---

## Current vs Target labeling

- Dual SessionEvent+RuntimeEvent path = Current migration reality.  
- RuntimeEvent-preferring completed replay = Current.  
- Bit-exact wire replay / full request snapshot in ledger = Target.  
- Warm mid-tool resume = Target / not Current startup recovery.  
- Independent production preflight gate wired in Kernel = capability exists, entry may be unwired — say so.

---

## EN parity notes

- Same `#id`s.  
- Keep: *Log is the source of truth; state is a materialized view.*; *One terminal.*; *Permission is control flow.*  
- Type/event names stay English in both locales.

---

## Out of scope for the §01 rewrite ticket

- Full prune/archive matrix → §02  
- Full compaction schema/pipeline → §03  
- TaskRun Attempt machine → §04  
- Shipping Maka resume phases (teach Current honesty only)

---

## Suggested implementation ticket

`Task: Deepen §01 spine + terminal/permission + host cost spine (zh→en same-ship)`

Acceptance:

1. Exec spine + dual stream + terminal race + permission control flow present.  
2. Reader quiz: explain late `complete` after abort without specimen.  
3. #38 cluster present or explicitly linked as same-ship subsection.  
4. Primary aside is mechanism PR (`9`/`410`/`21` class), not only `768`.  
5. Structure checklist still green.

---

## Code map (for writers)

1. `packages/runtime/src/session-manager.ts`  
2. `packages/runtime/src/runtime-kernel.ts`  
3. `packages/runtime/src/agent-run.ts`  
4. `packages/runtime/src/runtime-runner.ts`  
5. `packages/runtime/src/ai-sdk-flow.ts`  
6. `packages/runtime/src/ai-sdk-backend.ts`  
7. `packages/runtime/src/model-adapter.ts`  
8. `packages/runtime/src/tool-runtime.ts`  
9. `packages/core/src/runtime-event.ts`  
10. `packages/storage/src/agent-run-store.ts`  
11. `packages/runtime/src/request-shape.ts` (cost spine)

Tests: `runtime-runner.test.ts`, `ai-sdk-flow.test.ts`, `session-manager.test.ts`, `session-manager-terminal-ledger.test.ts`, `agent-run-store.test.ts`, `request-shape.test.ts`.

---

## Open questions (do not block outline)

1. How much ToolRuntime sequence belongs here vs §02? **Recommend:** §01 = control-flow + synthetic pairing; §02 = full 6-beat execute + archive.  
2. Should `stores` be a full section or a compact table under `terminal`? **Recommend:** short dedicated section — authority bugs are classic.  
3. Ship cost spine in the same §01 deepen PR as spine/terminal? **Recommend:** yes if bandwidth; else sequenced commits under one task ticket — never leave §01 deepen without at least the hook paragraph + link to teaching plan.
