# Deep outline — Storage ledgers (JSONL / SQLite / artifacts)

**Ticket:** [#55](https://github.com/tt-a1i/agent-atelier/issues/55) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research outline mined from **code + contract tests** — narrative deepen shipped lean into §01 `#stores`  
**Atelier home:** deepen §01 `#stores` (+ durability subsection); optional `/guides/storage-ledgers` if §01 explodes  
**Cross-links:** §01 recovery (torn JSON ≠ legal prefix) · §04 TaskRun durability · execution-evidence spine (#50)

## Specimen sources (authority order)

1. **Code (wins):**  
   - `packages/storage/src/root-authority.ts` — storage root marker, interactive lock, leases  
   - `packages/storage/src/jsonl-append.ts`, `json-prefix.ts`, `stable-storage.ts`, `write-queue.ts`  
   - `session-store.ts`, `agent-run-store.ts`, `sqlite-runtime-store.ts`, `runtime-event-transfer.ts`  
   - `shell-run-store.ts`, `task-ledger-store.ts`, `artifact-store.ts`, `usage-stats-store.ts`, `execution-stores.ts`
2. **Docs:** `docs/execution-evidence-spine.md`, `docs/session-task-ledger-lifecycle.md`, Phase0/1 resume contracts  
3. **Tests-as-spec:** `execution-stores.test.ts`, `agent-run-store.test.ts`, `session-store.test.ts`, `sqlite-runtime-*.test.ts`, `root-authority.test.ts`, `write-queue.test.ts`

## Goal (reader can teach)

1. Three-store triangle answers different questions; projections are derived.  
2. What `durable: true` actually does (file sync + directory chain) vs best-effort append.  
3. Torn JSONL repair: truncate incomplete prefix; invalid tail fails closed on append.  
4. RuntimeEvent dual backplane: per-run JSONL default vs `runtime.sqlite` when present.  
5. Task / ShellRun / Artifact / Usage are not the interaction semantic ledger.

## Non-goals

- Re-teaching Session task ledger ≠ TaskRun (#49)  
- Full SQLite schema walkthrough  
- Claiming session message append is fsync-durable (it is not)

---

## Teaching spine

| `#id` | Title | Depth job |
| --- | --- | --- |
| `root-gate` | 存储根与单写者 | marker, lock, lease |
| `layout` | 盘上布局 | session / run / runtime / task / artifact |
| `three-ledgers` | Session / AgentRun / RuntimeEvent | authority table (existing) |
| `durable-flag` | 什么真正 fsync | durable matrix |
| `jsonl-repair` | 尾修复协议 | classifyJsonRecord |
| `runtime-dual` | JSONL vs SQLite | openRuntimeEventPersistence |
| `derived-stores` | Task / ShellRun / Artifact / Usage | canonical vs derived |
| `failures` | 失败矩阵 | torn / corrupt / mismatch |

---

## Authority boundaries

| Store | Canonical for | Derived / best-effort |
| --- | --- | --- |
| SessionStore | Transcript + header (`session.jsonl`) | Tail preview; soft corrupt notes on normal read |
| AgentRunStore | `run.json` + ops `events.jsonl` + admissions | `projections/*` |
| RuntimeEventStore (JSONL) | `runtime-events.jsonl` | `runtime-partials/*` |
| SqliteRuntimeStore | Same semantic ledger + tool journal tables | partial snapshots table; legacy JSONL import |
| task-ledger-store | `task-events.jsonl` | `tasks.json` projection — **no fsync path** |
| shell-run-store | Per-run `state.jsonl` rewrite | Live process in runtime manager — **no fsync** |
| artifact-store | Blobs + `metadata.jsonl` | In-memory cache — **no fsync** |
| usage-stats-store | Nothing (read-only scan of sessions) | Aggregate for Settings UI |

## Durability matrix

| Write path | `durable: true` | Honest Current |
| --- | --- | --- |
| `appendJsonl` | `handle.sync()` + `syncDirectoryChain` | Terminal RuntimeEvent / root-turn admission use this |
| Session message append | — | **No** durable flag by default |
| Task / ShellRun / Artifact | — | Atomic rename at best; not dir-synced |
| SQLite | `PRAGMA synchronous=FULL` + WAL | Transaction boundaries |

**Invariant:** `syncDirectoryChain` refuses paths escaping `durabilityRoot`.

## JSONL torn / repair

1. Before append, if no trailing `\n`, reverse-scan last record.  
2. `complete` → separator; `incomplete-prefix` → **truncate** then append; `invalid` → throw.  
3. Normal session read: soft `system_note`; recovery / RuntimeEvent read: **strict throw**.  
4. Phase0: torn JSON row = storage corruption, not recovery fact.

## Current vs Target

| Topic | Current | Target / teaching |
| --- | --- | --- |
| RuntimeEvent canonical | Dual JSONL / SQLite | Teach dual honestly; SQLite adds tool journal |
| Session fsync | Best-effort transcript | Product UI store ≠ execution ledger |
| Task ledger | Event-sourced, no fsync | Contract complete; durability gap honest |

## Failure matrix

| Failure | Behavior | Test anchor |
| --- | --- | --- |
| Unterminated JSONL tail | Truncate + append | `execution-stores.test.ts` |
| Invalid JSONL tail | Append rejected | `jsonl-append` |
| Corrupt durable line (strict) | Throw with line | `readMessagesForRecovery` |
| Terminal RuntimeEvent mismatch | Throw | agent-run + sqlite tests |
| Root identity drift | `StorageRootAuthorityError` | `root-authority.test.ts` |
| Concurrent same-key writes | `chainWrite` serialize | `write-queue.test.ts` |

## Protocol figures (for later narrative)

1. On-disk layout sketch (extend existing).  
2. Durable vs best-effort table (ship now in §01).  
3. JSONL repair swimlane (optional companion).

## Acceptance

Reader can state: which store answers which question; which writes fsync; what happens to torn JSON; JSONL vs SQLite dual. Live §01 `#stores` must include durability honesty — not slogan “everything is durable.”
