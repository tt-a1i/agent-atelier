# Deep outline — Filesystem worker / path containment / workspace-executor facts

**Ticket:** [#70](https://github.com/tt-a1i/agent-atelier/issues/70) · Task [#71](https://github.com/tt-a1i/agent-atelier/issues/71) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** **shipped** §02 `#filesystem-worker` (CN+EN) via Task [#71](https://github.com/tt-a1i/agent-atelier/issues/71)  
**Atelier home:** §02 `#filesystem-worker` + lean pointers from §01 `#sandbox` / `#trust`  
**Cross-links:** [`shell-pty-executor-deep-outline.md`](./shell-pty-executor-deep-outline.md) (#56/#68) · [`sandbox-boundary-deep-outline.md`](./sandbox-boundary-deep-outline.md) · [`trust-privacy-security-deep-outline.md`](./trust-privacy-security-deep-outline.md)

## Specimen sources (authority order)

1. **Code:** `packages/runtime/src/path-containment.ts`, `workspace-executor.ts`, `filesystem-worker/{protocol,client,operations,process-runner,launch-spec,worker-entry}.ts`, `builtin-tools.ts` (filesystemWorker branch), `apps/desktop/src/main/tool-assembly.ts`  
2. **Tests:** `path-containment.test.ts`, `workspace-executor.test.ts`, `filesystem-worker.test.ts`, `filesystem-worker-client.test.ts`, `filesystem-worker-smoke.test.ts`, `builtin-tools-file-worker.test.ts`, `containment-guard-contract.test.ts`  
3. **Docs:** none standalone — teach from code; do not re-merge into Shell/PTY spawn tree as if identical

## Goal (reader can teach)

1. `isPathInside` is the **single leaf authority** for path containment (runtime + desktop main + headless; only `node:path`).  
2. Two file-tool backends: `LocalWorkspaceExecutor` (`isolation: 'none'`) vs `FilesystemWorkerClient` (sandboxed child + protocol v2).  
3. Worker request carries `permissionsHash` + `expectedTarget` — worker re-checks TOCTOU (`path_changed`).  
4. Desktop wires worker only when `process.platform === 'darwin' && sandboxManager`.  
5. Path containment ≠ OS sandbox ≠ PermissionEngine approval (three orthogonal layers).

## Non-goals

- Re-teaching managed Bash / PTY spawn tree (#68)  
- Full Seatbelt profile generation (point at §01 `#sandbox`)  
- Claiming Linux/Windows Desktop currently runs the filesystem worker  
- UI chrome for file pickers

---

## Teaching spine

| `#id` | Title | Depth job |
| --- | --- | --- |
| `path-authority` | `isPathInside` 单权威 | separator-aware `..` + Windows cross-drive |
| `two-backends` | Local vs Worker | facts vs sandboxed protocol path |
| `protocol-v2` | request / response | hash + expectedTarget TOCTOU |
| `desktop-gate` | darwin + sandboxManager | product honesty |
| `layers` | containment ≠ sandbox ≠ approval | matrix |
| `failures` | path_denied / path_changed / … | matrix |

---

## Path containment authority

```text
isPathInside(root, target)
  → relative(root, target)
  → reject absolute relative (Windows cross-drive)
  → reject exact ".." or "..${sep}..." only
  → allow names that merely start with ".." (e.g. ..rules)  // #1145
```

**Callers:** skill reader, managed skill-source store, filesystem worker ops, `LocalWorkspaceExecutor` resolve*InsideCwd, desktop/headless consumers via `@maka/runtime` (no reverse deps).

**Identifier safety:** `isSafeSkillId` — separate from path containment.

## Two backends (file tools)

```text
buildBuiltinTools
  ├─ filesystemWorker provided?
  │    → FilesystemWorkerClient.execute (Read/Write/Edit/Glob/Grep/…)
  │         validate → canRead/WritePath → sandboxManager.transform(worker)
  │         → stdin JSON request → child process → parse response
  └─ else LocalWorkspaceExecutor
         resolve*InsideCwd (isPathInside) → direct fs / rg
         facts = { isolation: 'none', writesAffectHost: true, … }
```

| Backend | Isolation facts | Containment | OS sandbox |
| --- | --- | --- | --- |
| `LocalWorkspaceExecutor` | `LOCAL_WORKSPACE_EXECUTOR_FACTS` (`isolation: 'none'`) | `isPathInside` on cwd | **none** |
| `FilesystemWorkerClient` | Worker profile derived for Seatbelt/bwrap transform | Client `canRead/WritePath` + worker re-check + `isPathInside` | **Yes** (transform on worker process) |

**Key honesty:** Workspace-executor facts already taught under `#shell-side-effects` as "not OS sandbox". This seam adds the **sandboxed worker alternative** and the shared path leaf.

## Protocol v2 (Current)

- `FILESYSTEM_WORKER_PROTOCOL_VERSION = 2`  
- Request: `{ version, requestId, operation, operationPermission, permissionsHash, expectedTarget }`  
- `permissionsHash` must match `hashAdditionalPermissionProfile(operationPermission)` (client + worker)  
- `expectedTarget`: `{ enforcementPath, access, scope, targetType }` — worker `assertTargetUnchanged` → `path_changed`  
- Ops: `read` | `write` | `edit` | `format_json` | `glob` | `grep`  
- Error codes: `invalid_request`, `path_denied`, `path_changed`, `not_found`, `edit_conflict`, `grep_unavailable`, `filesystem_denied`, `filesystem_error`  
- Client stages: `validation` | `transform` | `launch` | `protocol` | `operation`  
- Max request bytes: `16 MiB`

## Desktop wiring (product)

`tool-assembly.ts`:

```text
sandboxManager = createBuiltinSandboxManager()
filesystemWorker = (darwin && sandboxManager)
  ? new FilesystemWorkerClient({ sandboxManager, getLaunchSpec: … })
  : undefined
buildBuiltinTools({ filesystemWorker?, enableFileToolAdditionalPermissions: true, … })
```

Launch spec: Electron packaged vs runtime resource location; worker entry bundle must resolve or client fails `worker_bundle_unavailable`.

## Failure matrix

| Failure | Surface |
| --- | --- |
| Escape / outside cwd (local) | throw from resolve*InsideCwd |
| Profile deny (client) | `path_denied` stage validation |
| Hash mismatch | `invalid_request` |
| Target type/path changed | `path_changed` |
| Sandbox transform fail | client stage `transform` |
| Spawn/timeout/crash | `spawn_failed` / `timeout` / `worker_crashed` |
| Grep missing in worker | `grep_unavailable` |
| Non-darwin Desktop | falls back to LocalWorkspaceExecutor |

## Current vs Target

| Topic | Current | Teaching |
| --- | --- | --- |
| Worker platforms | Desktop darwin-gated | Do not claim universal worker |
| Local executor | Always `isolation: 'none'` | Keep separate from Seatbelt story |
| Additional permissions | Worker path enables file-tool grants | Point at additional-permissions; don't expand here |

## Acceptance

Reader can draw two backends, name `isPathInside` as leaf authority, explain protocol TOCTOU fields, and state Desktop darwin gate. Narrative lives in §02 `#filesystem-worker`.
