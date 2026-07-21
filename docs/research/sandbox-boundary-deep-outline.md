# Deep outline — Runtime sandbox boundary (PermissionProfile → platform transform)

**Ticket:** [#46](https://github.com/tt-a1i/agent-atelier/issues/46) → Task [#62](https://github.com/tt-a1i/agent-atelier/issues/62)  
**Date:** 2026-07-21  
**Status:** research complete (code + tests re-mined); home decision locked  
**Atelier home (locked):** §01 `#sandbox` immediately after `#permission` (CN+EN same-ship). Not a separate `/guides/sandbox` — ownership is a sibling of PermissionEngine, not an orthogonal product surface.  
**Cross-links:** §01 PermissionEngine · §04 throwaway workspace ≠ OS sandbox · §05 hygiene “sandbox root”

## Specimen sources (authority order)

1. **Code (wins):**  
   - `packages/core/src/permission-profile.ts` (+ compiler)  
   - `packages/runtime/src/sandbox/{types,sandbox-manager,macos-seatbelt,linux-sandbox,linux-capability,default-sandbox-manager}.ts`  
   - `packages/runtime/src/sandbox-escalation.ts` + PermissionEngine grant consume path  
   - Callers: shell / ToolRuntime paths that invoke `SandboxManager.transform`  
2. **Local README:** `packages/runtime/src/sandbox/README.md` — **partially stale** on Linux (claims `backend_not_implemented`; code registers `LinuxBubblewrapBackend`). Prefer tests.  
3. **Tests-as-spec:** `permission-profile*.test.ts`, `sandbox-manager.test.ts`, `macos-seatbelt*.test.ts`, `sandbox-escalation.test.ts`, `tool-runtime-sandbox-escalation.test.ts`, export/default-manager tests  
4. **Tracking:** maka issue #843 (remaining enforcement) — do not invent shipped claims beyond code

## Goal (reader can teach)

1. Approval ≠ sandboxing: `PermissionEngine` decides allow/prompt/block; sandbox only transforms argv when a profile requires platform isolation.  
2. Pure language lives in `@maka/core`; platform SBPL / bubblewrap live in `@maka/runtime`.  
3. `auto` / `require` / `forbid` preferences and fail-closed typed failures.  
4. Managed restricted profiles sandbox; unrestricted / disabled / external do not stack Maka local sandbox.  
5. **macOS Seatbelt Current**; **Linux bubblewrap Current when capability available** (registered by default manager); unavailable → typed fail, never silent host.  
6. Path context is caller-owned; backends must not guess workspace roots.  
7. Escalation one-shot: Bash `require_escalated` → prompt → grant bound to exact command/cwd/intent → **single consume**; mismatch / second consume / TTL fail closed.  
8. Word collision: Heavy-task “sandbox root” / throwaway fixture dir ≠ OS Seatbelt / bwrap sandbox.

## Non-goals

- Worktree copy sandboxing, Windows sandbox, managed network proxy/domain allowlists  
- Second permission language  
- Claiming every Linux host has bwrap (capability-gated)  
- Re-teaching full PermissionEngine park/grant (link §01 `#permission`)

---

## Home decision

| Option | Verdict |
| --- | --- |
| `/guides/sandbox` | Rejected for now — seam is Runtime control-plane sibling of permission, fits §01 without exploding IA |
| §01 `#sandbox` after `#permission` | **Accepted** — one swimlane + selection matrix + escalation + word-collision |

---

## Teaching spine (section map for live chapter)

| `#id` / subsection | Title | Depth job |
| --- | --- | --- |
| `sandbox` | 沙箱是执行变换，不是批准 | Ownership split Engine vs SandboxManager |
| (inline) profile language | PermissionProfile 三型 | managed / disabled / external + FS/network |
| (inline) selection | auto / require / forbid | Selection matrix + fail-closed |
| (inline) seatbelt / linux | 平台后端 | Seatbelt wrap · Linux bubblewrap honesty |
| (inline) escalation | 一次性提权 | one-shot grant consume |
| (inline) word-collision | 三个「sandbox」 | OS · throwaway · hygiene |
| (inline) verify | 测试钉合同 | cite test files |

---

## Protocol figures (must ship)

1. **Ownership swimlane:** PermissionEngine → optional SandboxManager.transform → process spawn owner.  
2. **Selection matrix table:** profile kind × preference → sandboxType or typed failure.  
3. **Seatbelt / bwrap wrap:** inner argv → wrapper + policy; path-context parameterization.  
4. **Escalation one-shot:** proposal → prompt → grant → consume-once.  
5. **Word-collision triptych:** OS sandbox vs TaskRun throwaway dir vs Self-check hygiene sandbox root.

---

## Invariants

1. Sandbox selection does **not** grant approval.  
2. Required sandbox + missing/unavailable backend → **fail closed**, never silent host exec.  
3. `forbid` is orchestration input, not proof of approval.  
4. `PermissionProfile.External` means environment supplies FS isolation; Maka does not stack local platform sandbox.  
5. Callers own canonical cwd + `SandboxPathContext`.  
6. SandboxManager does not spawn, retry unsandboxed, emit UI, or own telemetry.  
7. Protected metadata deny-write (`.git`, `.agents`, `.codex`) is policy in profile language, enforced in backends.  
8. `additionalPermissions` merge into profile for **that transform only**.  
9. Escalation grant is one-shot, command/cwd/intent-bound, TTL-bounded; `rememberForTurnAllowed: false`.

---

## Current vs Target (field-accurate, code-checked 2026-07-21)

| Topic | Current | Target / open |
| --- | --- | --- |
| macOS | Seatbelt backend; fail closed if unregistered/unavailable | Keep; #843 remaining enforcement |
| Linux | `LinuxBubblewrapBackend` registered in `createDefaultSandboxManager`; transform builds `bwrap` argv when capability available; missing bwrap / unsupported arch / deny entries → typed failure | Broader host coverage; README sync |
| Windows | `unsupported_platform` when required | Explicit non-goal today |
| Network | Profile restricted/enabled; Seatbelt + Linux seccomp translate; no managed proxy allowlist product | Non-goal per README |
| Escalation | Bash `require_escalated` one-shot grants via PermissionEngine | Keep honesty: not a standing unsandboxed mode |
| Headless throwaway dir | Isolation of fixture mutation, not OS sandbox | Keep honesty in §04 |

**README drift note:** `packages/runtime/src/sandbox/README.md` still says Linux transform returns `backend_not_implemented`. Code + `sandbox-manager.test.ts` contradict that — atelier teaches code.

---

## Failure matrix (teaching table)

| Situation | Result |
| --- | --- |
| Restricted managed + `auto` + darwin + backend registered | `macos-seatbelt` transform ok |
| Same + backend not registered | `backend_not_available` fail |
| Restricted + `auto` + linux + bwrap available | `linux` bubblewrap transform ok |
| Same + bwrap unavailable | `backend_not_available` (capability) |
| Linux profile with path `deny` entries | `canEnforce` false / `invalid_request` |
| Unrestricted / disabled / external + `auto` | `sandboxType: none` |
| `require` on unsupported platform | `unsupported_platform` |
| Invalid/unsupported profile at backend | typed failure; **no** silent host downgrade |
| `forbid` | host path; still needs Engine approval separately |
| Escalation grant reused / command changed / expired | `grant_consumed` / `command_mismatch` / `grant_expired` |

---

## Escalation one-shot (must teach)

Source: `sandbox-escalation.ts` + PermissionEngine consume path + tests.

```text
Bash args.sandbox_permissions.mode = require_escalated
  → planDeclaredBashSandboxEscalation (explore blocks; bypass skips)
  → PermissionEngine prompt (event.kind = sandbox_escalation; rememberForTurnAllowed = false)
  → allow → grant {command, cwd, intentHash, commandHash, TTL}
  → consumeSandboxEscalationGrant once for exact match
  → second consume / mismatch / TTL → typed SandboxEscalationError
```

Risk summary on proposal is honest: unsandboxedExecution, unrestricted FS/network, protectedMetadataExposed.

---

## Acceptance for Task #62

Live zh+en section is done when a reader can:

1. Draw the Engine vs SandboxManager swimlane from memory.  
2. Fill the selection matrix for managed-restricted vs external.  
3. State Linux Current honesty (bubblewrap when available; fail-closed otherwise) without claiming Windows.  
4. Explain escalation one-shot vs standing unsandboxed mode.  
5. Explain why “sandbox” in Self-check hygiene / §04 throwaway is a different object.
