# Deep outline — Desktop main composition (SessionManager / Runtime / IPC)

**Ticket:** [#72](https://github.com/tt-a1i/agent-atelier/issues/72) · Task [#73](https://github.com/tt-a1i/agent-atelier/issues/73) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** **shipped** companion `/guides/desktop-host` (CN+EN) via Task [#73](https://github.com/tt-a1i/agent-atelier/issues/73)  
**Atelier home:** `/guides/desktop-host` + lean pointer from entry / §01 spine  
**Cross-links:** [`ch01-log-runtime-deep-outline.md`](./ch01-log-runtime-deep-outline.md) · [`runtime-host-gateway-deep-outline.md`](./runtime-host-gateway-deep-outline.md) · [`bot-im-onboarding-deep-outline.md`](./bot-im-onboarding-deep-outline.md) · [`filesystem-worker-path-containment-deep-outline.md`](./filesystem-worker-path-containment-deep-outline.md)

## Specimen sources (authority order)

1. **Code:** `apps/desktop/src/main/main.ts`, `tool-assembly.ts`, `session-stream.ts`, `sessions-ipc-main.ts`, `session-entry-ipc-main.ts`, `chat-readiness.ts`, `project-root-controller.ts`, `app-lifecycle.ts`  
2. **Package façades:** `@maka/runtime` (`SessionManager`, `PermissionEngine`, `BackendRegistry`, `ShellRunProcessManager`, …), `@maka/storage` store factories, `@maka/mcp`  
3. **Tests:** desktop contract tests under `apps/desktop/src/main/__tests__/*` that pin wiring (session lifecycle, task-ledger, single-instance, …) — cite by mechanism, not exhaustively  
4. **Docs:** `apps/desktop/README.md` (product shell) — secondary to code

## Goal (reader can teach)

1. Desktop **main** is the product composition root: stores → tools → backends → `SessionManager` → IPC.  
2. Renderer never constructs Runtime; preload IPC is the trust boundary (secrets stay in main).  
3. `assembleDesktopTools` owns sandbox + filesystem-worker + deferred tool economy before `SessionManager` exists.  
4. `createAiSdkBackendFactory` closes over tools/MCP/permission/telemetry; `BackendRegistry` last-write-wins (E2E override).  
5. `registerIpc()` is a **cluster of typed registrars**, not one mega-handler — sessions/entry/permissions/settings/…  

## Non-goals

- Renderer UI chrome, CSS, Storybook, visual-smoke scenario catalogs as Destination depth  
- Full Bot/IM onboarding narrative (→ `/guides/bot-im`)  
- Full Computer-use six contracts (→ `/guides/computer-use`)  
- Claiming desktop main ≡ `packages/runtime-host` gateway (different product; host is thin unix-socket orchestration)

---

## Teaching spine

| `#id` | Title | Depth job |
| --- | --- | --- |
| `why-main` | 为什么组合根在 main | single writer + OS trust |
| `store-plane` | storage factories | session / run / shell / artifact / settings |
| `tool-plane` | assembleDesktopTools | sandbox, FS worker, economy |
| `runtime-plane` | SessionManager ctor | deps honesty |
| `backend-plane` | ai-sdk factory + E2E | last-write-wins |
| `ipc-plane` | registerIpc cluster | surface map |
| `boundaries` | vs runtime-host / headless | matrix |

---

## Composition layers

```text
app ready / userData / single-instance
  → openRuntimeEventPersistence + create*Store(…)
  → PermissionEngine + ShellRunProcessManager
  → assembleDesktopTools(…)          # sandbox, FS worker, CU, deferred groups
  → BackendRegistry.register('ai-sdk', createAiSdkBackendFactory(…))
  → SessionManager({ store, runStore, backends, shellRuns, … })
  → bot / onboarding / plan / daily-review services (close over runtime)
  → registerIpc()                    # typed registrars → renderer
  → session streamers push SessionEvent / shell-runs updates
```

**Hard rule:** composition order matters — e.g. onboarding binds `listSessions` **after** `runtime` exists; botIncoming is assigned after SessionManager construction.

## SessionManager construction (contracts)

Desktop passes (non-exhaustive, teach the shape):

| Dep | Role |
| --- | --- |
| `store` / `runStore` / `runtimeEventStore` | durable session + agent-run + events |
| `toolBoundaryProtocol` (optional) | from runtimeCommitStore when present |
| `shellRuns` | managed Bash / PTY process manager |
| `backends` | BackendRegistry (ai-sdk / fake) |
| `childTools` | child-agent tool surface |
| continuation inspectors | local safety / background ops probe |
| `listArtifactsForTurn` / compact cleanup | artifact plane hooks |
| `generateSessionTitle` | uses ready connection + subscription fetch |

Product façade methods used by IPC: `sendMessage`, `listSessions`, `getMessages`, stop/recover paths, `refreshIdleBackends` (MCP tool snapshot changes).

## Tool assembly (contracts)

`assembleDesktopTools` (issue #37 economy split):

1. `createBuiltinSandboxManager` + optional `FilesystemWorkerClient` (darwin)  
2. Deferred capability groups (Rive / Office / browser / CU / agent orchestration) via `load_tools`  
3. `buildBuiltinTools` (+ shellRuns, sandbox, filesystemWorker flags)  
4. Skill tool + task ledger / automation / goal tools  
5. `buildHostCapabilitiesFromBinding` + `assertProductBindingCatalogClean('desktop', …)`  
6. Child agents: file-oriented builtin subset (no parent runtime refs)

## IPC surface honesty (Current)

Registrar modules (examples — teach clustering, not every channel):

| Registrar | Owns |
| --- | --- |
| `registerSessionsIpc` | session CRUD / send / stream / artifacts / CU overlay hooks |
| `registerSessionEntryIpc` | entry / quick-chat / onboarding-gated create |
| `registerPermissionsIpc` | permission mode / bot / CU capability input |
| `registerSettingsIpc` | settings patch + runtime effects |
| `registerMcpIpcMain` | MCP config + manager + idle backend refresh |
| `registerAppIpc` / project root | window + project-root controller |
| gateway / subscription / connections / git / workspace-* | product satellites |

**Push channels (main→renderer):** e.g. `shell-runs:update`, `mcp:changed`, `settings:bots:statusChanged`, session change emitters — never plaintext secrets.

## Boundaries

| Surface | Role | Not |
| --- | --- | --- |
| Desktop main | Product composition + IPC | Thin unix host |
| `packages/runtime-host` | Optional local host: 4 ops | Full session/tool API |
| Headless / Harbor | Eval / CLI composition | Electron preload |
| Renderer | Presentation + invoke | SessionManager owner |

## Failure / honesty matrix

| Topic | Current teaching |
| --- | --- |
| E2E | Requires isolated userData; may override ai-sdk → FakeBackend |
| Packaged vs dev FS worker | Resource location differs; see FS outline |
| Second instance | Lock before real profile pollution |
| MCP tool churn | refreshIdleBackends on snapshot change |

## Acceptance

Reader can draw composition layers, name who owns SessionManager, and explain IPC trust without opening renderer CSS. Full narrative = `/guides/desktop-host`.
