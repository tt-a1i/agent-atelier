# Deep outline — MCP runtime architecture

**Ticket:** [#51](https://github.com/tt-a1i/agent-atelier/issues/51) under [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline mined from architecture draft + `@maka/mcp` + `mcp-tools.ts` + tests  
**Atelier home (decided):** lean **§01 `#mcp`** (tool economy / trust) + optional later `/guides/mcp` if §01 explodes  
**Cross-links:** §01 `#permission` · `#tool-economy` · `#skills` · desktop product shell (out of Destination core)

## Specimen sources (authority order)

1. **Architecture draft (B):** `docs/architecture/mcp-runtime-architecture-draft.zh-CN.md` — V1 implemented 2026-07-18  
2. **Code (wins):**  
   - `packages/mcp/src/index.ts` — `McpClientManager` (stdio / Streamable HTTP / SSE)  
   - `packages/runtime/src/mcp-tools.ts` — `buildMcpTools` projection to `MakaTool[]`  
   - `@maka/core/mcp` contracts; `@maka/storage` owner-only `mcp.json`  
   - Desktop main: singleton manager; renderer never holds client/child  
3. **Tests-as-spec:** `packages/mcp/src/__tests__/manager.test.ts`, `packages/runtime/src/__tests__/mcp-tools.test.ts`  
4. **Archive (optional compare):** `docs/archive/qoderwork-mcp-reverse-engineering-2026-07-18.md` — external compare only

## Goal (reader can teach)

1. MCP is **not** a second agent loop — tools project into existing `MakaTool` / ToolRuntime boundary.  
2. Manager owns connect/discover/call; adapter owns schema/content → MakaTool.  
3. Automatic inheritance: permission gating, event log, telemetry, persistence, abort, loop gate.  
4. Transports: local stdio, Streamable HTTP, legacy SSE (+ fallback).  
5. Security: stdio env allowlist; **all MCP tools `categoryHint: network_send`**; `readOnlyHint` untrusted.  
6. Naming: `mcp__{serverId}__{toolName}` with collision detection / hash suffix at 64 chars.  
7. Config: workspace `mcp.json` `mcpServers` map; fingerprint reconciliation; enabled≠authorized≠connected.  
8. Lifecycle: one active connect promise per server; list_changed refreshes one server; backend cache invalidation after active run.  
9. Rich content bounds; audio/resource blobs not dumped into model context.  
10. V1 vs V2: no OAuth browser flow / resources UI / loopback proxy in V1.

## Non-goals

- Teaching MCP market UI chrome in depth  
- OAuth 2.1 product tutorial  
- Claiming resources/subscriptions ship in V1  
- Replacing PermissionEngine with server annotations

---

## Teaching spine (§01 `#mcp`)

| `#id` | Title | Depth job |
| --- | --- | --- |
| `mcp` | 同一条 ToolRuntime，不是第二套 loop | Ownership swimlane |
| `project` | Discovery → `buildMcpTools` | Dynamic MakaTool[] |
| `trust` | annotations 不可信 | always `network_send` |
| `name` | proxy tool naming | 64-char / hash / collision |
| `lifecycle` | sync / list_changed / invalidate | turn boundary honesty |
| `config` | mcp.json fingerprint | enabled vs connected |
| `failures` | timeout / isError / stderr tail | diagnostics matrix |
| `v2` | Explicit non-claims | OAuth / resources |

---

## Protocol figures

1. **Swimlane:** Desktop IPC → McpConfigStore → McpClientManager → transport → buildMcpTools → AiSdkBackend → ToolRuntime → Manager.callTool.  
2. **Trust table:** server `readOnlyHint` vs Maka `categoryHint` vs PermissionEngine decision.  
3. **Lifecycle timeline:** config change → reconcile → finish active run → new backend snapshot.  
4. **Failure matrix** (below).

---

## Invariants

1. No second agent loop for MCP.  
2. Renderer never owns MCP client or child process.  
3. MCP annotations cannot lower permission policy.  
4. Deny rules always win; MCP tools never `permissionRequired: false` by default path.  
5. stdio inherits only allowlisted env; explicit `env` overrides last.  
6. Config write atomic + POSIX `0600` / dir `0700` (owner-only).  
7. Written config ≠ authorized ≠ connected (setup templates stay disabled until user enables).  
8. Install cancel is transactional: abort connect, settle write, remove + reconcile (no resurrection).  
9. `isError` enters Maka error path with server/tool context.  
10. Aggregate model-output bounds on text/images/summaries; unknown/audio/resource blobs summarized or omitted.

---

## Current vs Target

| Topic | Current (V1) | V2 backlog |
| --- | --- | --- |
| Transports | stdio, Streamable HTTP, SSE fallback | — |
| Auth | headers in mcp.json (owner-only file) | OAuth 2.1 + PKCE + Keychain |
| Resources | protocol content contracts; no UI | browse/subscribe UI |
| Permissions | all `network_send` | finer trusted-server policy (Maka-side config) |
| Recovery | connect fail closes half-open; no auto crash backoff product | health/backoff |
| Catalog | pinned reviewed versions; credential templates disabled | signed remote catalog |

---

## Failure matrix

| Situation | Result |
| --- | --- |
| Concurrent connect same server | single active promise |
| Connect fail | close half-open client/transport; status error |
| `tools/list_changed` | refresh that server’s tool cache |
| Config fingerprint change | disconnect + reconnect affected server |
| Tool call abort | caller abort > timeout |
| MCP `isError` | Maka error path with context |
| stdio crash | stderr tail ≤10 lines, redacted/truncated |
| Proxy name collision | throw at build time |
| `readOnlyHint: true` on mutating tool | still `network_send`; explore mode fail-closed |
| Cancel mid-install | no config resurrection; tools invisible |

---

## Defaults (cite in teaching)

| Timeout | Default |
| --- | --- |
| remote connect | 30s |
| stdio connect | 60s |
| list tools | 15s |
| call tool | 10min |

---

## Mechanism asides

- Prefer manager/mcp-tools tests over UI screenshots.  
- Reverse-eng archive is comparison only.  
- Link §01 `#tool-economy`: MCP tools join visible schema set → affect `toolSchemaHash` when connected.

---

## Acceptance

Reader can:

1. Draw “same ToolRuntime” swimlane.  
2. Explain why `readOnlyHint` cannot downgrade policy.  
3. State enabled ≠ connected.  
4. Name V2 non-claims without inventing them as Current.

**Live §01 `#mcp` section should ship with this research close; full `/guides/mcp` optional.**
