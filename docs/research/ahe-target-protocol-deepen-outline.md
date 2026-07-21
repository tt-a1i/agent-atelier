# Deep outline — AHE Target protocol surface (honest vs controller)

**Ticket:** [#84](https://github.com/tt-a1i/agent-atelier/issues/84) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research + narrative deepen §06 CN+EN  
**Atelier home:** §06 `#target` / `#export` / `#evaluation` / `#current`  
**Specimen:** `packages/headless/src/ahe-target-protocol.ts` · `docs/ahe-target-protocol.md` · `ahe-evidence-export.ts`

## Goal

Teach Current **file protocol + validators** to protocol depth. Keep **controller / runner / patch executor / change-evaluation validator** as honest Target stubs — types may exist without admission code.

## Current validators (module exports)

| Function | What it admits |
| --- | --- |
| `validateMakaAheTargetComponents` | id uniqueness, known category, sourceRefs ≥1 |
| `validateMakaAheTargetSnapshot` | v1\|v2; v2 requires `sourceManifest` + content-addressed `snapshotId`; v1 forbids sourceManifest reinterpretation |
| `validateMakaAheExecutionLineage` | `maka.ahe.execution_lineage.v1`; attempt/task/target ownership; rawRuntimeEvents enum; gap codes |
| `validateMakaAheChangeManifest` | staged_patch only; editable components; `editedSurface` matches changed categories; evidence/predicted/risk/rollback mins; forbidden paths |
| `validateMakaAheRunResult` | status×authority coupling; optional schemaVersion + executionLineageRef |

## Explicitly absent in same module

- `validateMakaAheChangeEvaluation` — **type exists** (`MakaAheChangeEvaluation` + transition enum); **no validator export**
- Patch apply / candidate workspace executor
- keep/discard controller + iteration WAL
- Import / candidate-eval CLI (docs: outside this contract)

## Snapshot identity (v2)

`makaAheTargetSnapshotId(components, sourceManifest)` hashes:

- `protocolVersion: maka.ahe-target.v2`
- canonical component topology
- `sourceManifest.algorithm` + `sourceManifest.digest`

**Does not affect id:** `createdAt`, `sourceLabel`, optional `git` metadata.

`sourceManifest.entries` must **exactly cover** component `sourceRefs` (componentId/path/exportName). Digest of entries must match `sourceManifest.digest`.

## File protocol (export writes)

`target-snapshot.json` · `harness-results.json` · `trace-index.json` · per-run traces + `execution-lineage.json` · optional `failure-digest.json`.

Controller-facing docs also name `change-manifest.json` / `change-evaluation.json` as **protocol shapes**; Current CLI export does **not** run AHE or apply patches.

## ChangeEvaluation fields (type-level)

`cells[].transition` ∈ `fail_to_pass` | `fail_to_fail` | `pass_to_pass` | `pass_to_fail` | `new_pass` | `new_fail` | `infra_or_excluded`  
Plus accounting: `predictedFixesObserved` / `predictedFixesMissed` / `regressions` / `excludedTaskIds` / `infraFailedTaskIds` / `selfCheckOnlyTaskIds`.

## Acceptance

§06 teaches validator presence matrix + identity non-inputs + evaluation type-without-validator; stub remains for closed loop.
