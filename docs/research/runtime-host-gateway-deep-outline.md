# Deep outline — Runtime-host gateway protocol

**Ticket:** [#57](https://github.com/tt-a1i/agent-atelier/issues/57) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** **deep shipped** 2026-07-21 — §01 `#runtime-host` four-op contract + trust boundary + failure codes (CN+EN); Task #81  
**Atelier home:** §01 `#runtime-host` (nested under `#stores`) · companion `/guides/runtime-host` optional  
**Cross-links:** storage root-authority (#55) · §01 recovery / root-turn admission

## Specimen sources (authority order)

1. **Code:** `packages/runtime-host/src/protocol/*`, `server/host-kernel.ts`, `operation-dispatcher.ts`, `execution-composition.ts`, `root-turn-coordinator.ts`, `transport/framed-transport.ts`, `client/*`, `control/*`  
2. **Tests:** `dependency-boundary.test.ts`, `protocol.test.ts`, `host-kernel.test.ts`, `execution-host.test.ts`  
3. **Docs:** none standalone — teach from code; registration under OS cache `runtime-hosts`

## Goal (reader can teach)

1. Host is a **thin orchestration shell**, not a full Runtime RPC surface.  
2. Only four operations: `host.status`, `turn.start`, `turn.query`, `turn.stop`.  
3. Trust: local InteractiveRootOwner + unix socket; client/protocol must not import `@maka/runtime`.  
4. `turn.start` admits root-turn **durable** before run creation; durability failure drains host.  
5. Headless/CLI may bypass host entirely.

## Non-goals

- Exposing messages/permission/shell via gateway (they are not Current)  
- Treating host as multi-tenant remote SaaS boundary  
- Replacing desktop preload IPC teaching

---

## Teaching spine

| `#id` | Title | Depth job |
| --- | --- | --- |
| `why-host` | 单写者进程动机 | storage lock + election |
| `trust-boundary` | Host vs `@maka/runtime` | dependency wall |
| `protocol-surface` | 四操作诚实清单 | Current honesty |
| `lifecycle` | ready / draining / idle | states |
| `root-turn` | admission durability | couple to stores |
| `failures` | error codes + retry | matrix |

---

## Trust boundary

```text
Client → unix socket + hello
  → Host authenticates InteractiveRootOwner
  → Admission by HostLifecycleState + residency
  → Server-only composition: SessionManager + execution stores
```

**Host owns:** interactive write lock, registration, operation admission, composition hook.  
**Host does not own:** tool loop, Permission UI, full session API, settings, shell runs.

**Hard test:** `dependency-boundary.test.ts` — only `server/` reaches `@maka/runtime` + execution-stores; public server entry must not expose execution-composition.

## Protocol surface (Current)

| Op | Mode | Admission | Purpose |
| --- | --- | --- | --- |
| `host.status` | query | bootstrap | epoch, state, counts |
| `turn.start` | command | session | text → TurnSnapshot |
| `turn.query` | query | ready | poll |
| `turn.stop` | control | session | cancel |

TurnSnapshot: `admitted` → `created` → `running` → `waiting_permission` → terminal.

## Failure matrix

| Code / failure | Client sees |
| --- | --- |
| `host_draining` / `host_not_ready` | wait / spawn |
| `session_busy` | one active root turn |
| `session_archived` | reject start |
| Pre-start durable failure | turn.start error + host drain |
| Epoch mismatch | re-read registration |

## Current vs Target

| Topic | Current | Honest teaching |
| --- | --- | --- |
| Scope | Thin turn CRUD | Not “the Runtime gateway” |
| Product | Desktop single-owner election | Optional path |
| Composition | Internal to execution candidate | Not public API |

## Acceptance

Reader can list four ops, name trust boundary, and refuse to invent missing RPC. Live atelier needs at least a lean §01 note — companion optional.
