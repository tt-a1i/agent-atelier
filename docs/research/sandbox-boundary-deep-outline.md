# Deep outline — Runtime sandbox boundary (PermissionProfile → platform transform)

**Ticket:** (corpus mine under [#34](https://github.com/tt-a1i/agent-atelier/issues/34))  
**Date:** 2026-07-21  
**Status:** research outline mined from **code + local README + tests** — not yet live chapter rewrite  
**Atelier home (proposed):** deepen §01 after `#permission` with `#sandbox` companion section **or** `/guides/sandbox` if §01 length explodes  
**Cross-links:** §01 PermissionEngine (approval) · §04 throwaway workspace ≠ OS sandbox · §05 hygiene “sandbox root” (different word!)

## Specimen sources (authority order)

1. **Code (wins):**  
   - `packages/core/src/permission-profile.ts` (+ compiler)  
   - `packages/runtime/src/sandbox/{types,sandbox-manager,macos-seatbelt,linux-sandbox,default-sandbox-manager}.ts`  
   - Callers: workspace/shell execution paths that invoke `SandboxManager.transform`  
2. **Local README:** `packages/runtime/src/sandbox/README.md` (current contract summary)  
3. **Tests-as-spec:** `permission-profile*.test.ts`, `sandbox-manager.test.ts`, `macos-seatbelt.test.ts`, `macos-seatbelt-smoke.test.ts`, export/default-manager tests  
4. **Tracking:** maka issue #843 (remaining enforcement) — do not invent shipped claims

## Goal (reader can teach)

1. Approval ≠ sandboxing: `PermissionEngine` decides allow/prompt/block; sandbox only transforms argv when a profile requires platform isolation.  
2. Pure language lives in `@maka/core`; platform SBPL / (future) Linux backends live in `@maka/runtime`.  
3. `auto` / `require` / `forbid` preferences and fail-closed typed failures (`backend_not_available`, `backend_not_implemented`, `unsupported_platform`, …).  
4. Managed restricted profiles sandbox; unrestricted / disabled / external do not stack Maka local sandbox.  
5. macOS Seatbelt Current; Linux selection exists but transform returns `backend_not_implemented` today.  
6. Path context is caller-owned; backends must not guess workspace roots.  
7. Word collision: Heavy-task “sandbox root” / throwaway fixture dir ≠ OS Seatbelt sandbox.

## Non-goals

- Worktree copy sandboxing, Windows sandbox, managed network proxy/domain allowlists  
- Second permission language  
- Claiming Linux enforcement ships  
- Re-teaching full PermissionEngine park/grant (link §01 `#permission`)

---

## Teaching spine (proposed section map)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `sandbox` | 沙箱是执行变换，不是批准 | Ownership split Engine vs SandboxManager |
| `profile-language` | PermissionProfile 三型 | managed / disabled / external + FS/network policy |
| `selection` | auto / require / forbid | Selection matrix + fail-closed |
| `seatbelt` | macOS Seatbelt 变换 | `sandbox-exec` wrap, SBPL base + roots + deny_write metadata |
| `linux-gap` | Linux Current honesty | selected but not implemented |
| `path-context` | PathContext 归属 | workspaceRoots / tmp / runtimeReadable / executable |
| `word-collision` | 三个「sandbox」不要混 | OS · throwaway workspace · hygiene report |
| `failures` | 失败矩阵 | typed reasons; never silent host downgrade |
| `verify` | 用测试钉合同 | cite test files as asides |

---

## Protocol figures (must ship with narrative)

1. **Ownership swimlane:** PermissionEngine (allow/prompt/block) → optional SandboxManager.transform → process spawn owner (shell/PTY/executor).  
2. **Selection matrix table:** profile kind × preference → sandboxType or typed failure.  
3. **Seatbelt wrap diagram:** inner argv → `/usr/bin/sandbox-exec` + policy blob; show path-context parameterization.  
4. **Word-collision triptych:** OS sandbox vs TaskRun throwaway dir vs Self-check hygiene sandbox root.

---

## Invariants (must survive compression)

1. Sandbox selection does **not** grant approval.  
2. Required sandbox + missing/unavailable backend → **fail closed**, never silent host exec.  
3. `forbid` is orchestration input, not proof of approval.  
4. `PermissionProfile.External` means environment supplies FS isolation; Maka does not stack local platform sandbox.  
5. Callers own canonical cwd + `SandboxPathContext`.  
6. SandboxManager does not spawn, retry unsandboxed, emit UI, or own telemetry.  
7. Protected metadata deny-write (`.git`, `.agents`, `.codex`) is policy in profile language, enforced in Seatbelt generation.  
8. Additional one-call permissions merge into profile for **that transform only**.

---

## Current vs Target (field-accurate)

| Topic | Current | Target / open |
| --- | --- | --- |
| macOS | Seatbelt backend; fail closed if unavailable | Keep; #843 remaining enforcement |
| Linux | Backend selectable; transform `backend_not_implemented` | Real Linux sandbox |
| Windows | `unsupported_platform` when required | Explicit non-goal today |
| Network | Profile has restricted/enabled; Seatbelt translates; no managed proxy allowlist product | Non-goal per README |
| Headless throwaway dir | Isolation of fixture mutation, not OS sandbox | Keep honesty in §04 |

---

## Failure matrix (teaching table)

| Situation | Result |
| --- | --- |
| Restricted managed + `auto` + darwin + backend registered | `macos-seatbelt` transform ok |
| Same + backend not registered | `backend_not_available` fail |
| Restricted + `auto` + linux + registered | select `linux` then `backend_not_implemented` on transform |
| Unrestricted / disabled / external + `auto` | `sandboxType: none` |
| `require` on unsupported platform | `unsupported_platform` |
| Invalid/unsupported profile at backend | typed failure; **no** silent host downgrade |
| `forbid` | host path; still needs Engine approval separately |

---

## Mechanism asides (prefer tests + intro PRs)

- Cite sandbox README + maka #843 for open enforcement.  
- Prefer history asides that introduced Seatbelt / profile language (lookup at narrative time against maka history ingest) over architecture-doc PRs.  
- Always link test files in “Verification” subsection.

---

## Glossary collisions to fix on atelier

| Phrase on site today | Means | Must say |
| --- | --- | --- |
| §05 “sandbox root” | Heavy-task execution hygiene report | Not OS Seatbelt |
| §04 “not an OS security sandbox” | Throwaway workspace | Keep; add forward link to `#sandbox` when live |
| §01 Permission | Control-flow park/grant | Orthogonal to platform transform |

---

## Acceptance for later Task ticket

Live zh+en section (or guide) is done when a reader can:

1. Draw the Engine vs SandboxManager swimlane from memory.  
2. Fill the selection matrix for managed-restricted vs external.  
3. State Linux Current honesty without claiming shipped enforcement.  
4. Explain why “sandbox” in Self-check hygiene is a different object.

**This outline alone does not deepen the live site.**
