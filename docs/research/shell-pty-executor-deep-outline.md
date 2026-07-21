# Deep outline — Shell / PTY / workspace-executor side-effect stack

**Ticket:** [#56](https://github.com/tt-a1i/agent-atelier/issues/56) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline — narrative home = §01 `#sandbox` cross-link + §02 ToolRuntime deepen (not yet full ship)  
**Atelier home:** §02 side-effects deepen + lean pointer from §01 sandbox/spawn  
**Cross-links:** [`sandbox-boundary-deep-outline.md`](./sandbox-boundary-deep-outline.md) · storage shell-run-store (#55)

## Specimen sources (authority order)

1. **Code:** `shell-exec.ts`, `shell-tools.ts`, `shell-run-manager.ts`, `shell-run-tool-result.ts`, `shell-detect.ts`, `workspace-executor.ts`, `pty-*.ts`, `pipe-process-driver.ts`, `builtin-tools.ts` (`sandboxCommand`)  
2. **Storage:** `packages/storage/src/shell-run-store.ts`  
3. **Tests:** `shell-exec.test.ts`, `shell-tools.test.ts`, `shell-run-manager.test.ts`, `shell-run-tool-result.test.ts`, `pty-screen-collector.test.ts`, `workspace-executor.test.ts`

## Goal (reader can teach)

1. Three execution paths: local foreground bash, managed ShellRun, workspace-executor for sync file tools.  
2. Sandbox transform inserts only on managed Bash via `transformCommand` → `SandboxManager.transform`.  
3. Live `emitOutput` ≠ final tool result (bounded live vs retained tail vs model budget).  
4. PTY ⟂ mandatory sandbox argv / fdInputs (fail before spawn).  
5. Workspace executor facts: `isolation: 'none'` — not OS sandbox.

## Non-goals

- Re-teaching full PermissionEngine / Seatbelt generation  
- Harbor-specific maxBuffer history beyond one aside  
- Claiming all bash paths are sandboxed today

---

## Teaching spine

| `#id` | Title | Depth job |
| --- | --- | --- |
| `spawn-tree` | 三条执行路径 | foreground / managed / workspace |
| `sandbox-insert` | transformCommand 插入点 | builtin-tools → SandboxManager |
| `pty-vs-pipes` | 模式与 sandbox 互斥 | PTY rules |
| `live-vs-result` | emitOutput vs terminal/shell_run | protocol figure |
| `bounded-tail` | 保留尾 vs 模型预算 | caps + markers |
| `shell-run-store` | 检查点与 revision | persistence honesty |
| `failures` | 超时/abort/洪水/sandbox denial | matrix |

---

## Spawn decision tree

```text
buildManagedBashTool
  → transformCommand? (sandboxCommand)
  → ShellRunProcessManager
       ├─ Foreground: pipes only → PipeProcessDriver → terminalContent
       └─ Background: pipes | pty → persistObservation + shell_run ref

buildLocalForegroundBashTool → runShellWithBoundedTail (no ShellRun store)
LocalWorkspaceExecutor → Read/Write/Edit/Glob/Grep + optional bash (no sandbox)
```

## Sandbox insertion (Current)

- Non-PTY managed bash: `SandboxManager.transform` → `{ argv, cwd, env, fdInputs, sandboxType }`  
- PTY + escalation grant → unsandboxed  
- PTY + profile requires sandbox → **throw**  
- PTY otherwise → no transform (raw shell command)  
- Manager throws if `mode === 'pty' && (argv || fdInputs)`

## Output channels

| Channel | Bound | Consumer |
| --- | --- | --- |
| Live `emitOutput` | `BASH_MAX_LIVE_EMIT_CHARS` then suppress marker | UI stream |
| Retained tail | `BASH_MAX_RETAINED_CHARS` | Final tool result |
| Foreground result | `shapeTerminalResult` + model truncate | function_response |
| Background result | `shell_run` ref + PTY model text budget | model + Read ref |
| Persisted checkpoint | shell-run-store revision | recovery / UI |

**Key separation:** Live may suppress while command continues; tool result still gets retained tail.

## Failure matrix

| Failure | Surface |
| --- | --- |
| Timeout | exit 124 / `timed_out` |
| Abort | exit 130 / `cancelled` |
| Live flood | suppress marker; result retains tail |
| Sandbox denial (output heuristic) | `sandboxDenial.likely` on terminal |
| PTY + argv/fdInputs | throw before spawn |
| Persist failure | live may lag durable state |

## Current vs Target

| Topic | Current | Teaching |
| --- | --- | --- |
| Sandbox coverage | Managed Bash only | Cross-link Seatbelt honesty / product routing |
| Workspace executor | No OS sandbox | Separate from §01 `#sandbox` |
| PTY | Full emulator; no sandboxed argv | Honest mutual exclusion |

## Acceptance

Reader can draw spawn tree, name transform insertion, and explain live-delta vs tool-result. Full narrative may wait for §02 deepen ticket; outline + §01 sandbox pointer sufficient for research close.
