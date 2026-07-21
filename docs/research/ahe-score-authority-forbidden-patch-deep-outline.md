# Deep outline — AHE scoreAuthority + forbidden patch surface

**Ticket:** [#78](https://github.com/tt-a1i/agent-atelier/issues/78) · Map [#34](https://github.com/tt-a1i/agent-atelier/issues/34)  
**Date:** 2026-07-21  
**Status:** research + narrative shipped §06 `#authority` / `#manifest` CN+EN · **closed**
**Atelier home:** §06  
**Cross-links:** §05 gate handoff · execution-lineage

## Specimen sources

1. **Code:** `ahe-evidence-export.ts` (`scoreAuthority`, `resultStatus`) · `ahe-target-protocol.ts` (`MAKA_AHE_SCORE_AUTHORITIES`, `validateMakaAheRunResult`, `validatePatch` / `unsafePatchPathReason`, `maka-runtime-evidence` editable:false)
2. **Tests:** `ahe-evidence-export.test.ts` · `ahe-target-protocol.test.ts`
3. **Mechanism PRs:** **#413** evidence export · **#417** official result export

## Goal

1. Export derives `scoreAuthority` from official Harbor verifier/scorer markers, else self-check, else analysis_only.  
2. Validator: `official_pass` / `official_fail` **require** `official_verifier` | `official_scorer`.  
3. Patch only `applyMode: "staged_patch"`; forbidden prefixes/parts; must be editable component `sourceRefs`.  
4. `maka-runtime-evidence` is non-editable — evidence plane cannot be candidate-patched.

## scoreAuthority ladder

```
score.authority authoritative + source official_harbor_verifier → official_scorer
else verifier same → official_verifier
else self-check evidence present → self_check
else → analysis_only
```

`resultStatus`: excluded / infra_failed first; then official_* only under official authorities; else self_check_only or unscored. Warning when non-authoritative pass evidence exported outside official buckets.

## Forbidden patch surface

| Reject | Reason |
| --- | --- |
| Absolute / `\` / `..` | Must be repo-relative POSIX |
| `.git/` · `node_modules/` · `dist/` prefixes/parts | Generated / VCS / deps |
| Path ∉ editable component sourceRefs | Not admitted surface |
| `applyMode ≠ staged_patch` | Only staged admission |
| Component `maka-runtime-evidence` | `editable: false` |

## Acceptance

§06 teaches derivation ladder + validator coupling + forbidden matrix; does not claim patch executor exists.
