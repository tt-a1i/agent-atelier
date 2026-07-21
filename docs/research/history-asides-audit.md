# History asides budget audit — §01–§06

**Ticket:** [Audit history asides budgets and locale hrefs](https://github.com/tt-a1i/agent-atelier/issues/26)  
**Date:** 2026-07-21  
**Status:** Pass recorded

## Budgets (from history UX)

- ≤3 asides / section  
- ≤8 asides / chapter  
- PR preferred; caption/footnote tone; locale-correct hrefs

## Counts (zh + en)

| Chapter | Asides / chapter | Max / section | Refs |
| --- | ---: | ---: | --- |
| §01 | 1 | 1 | `maka:pr:768` |
| §02 | 1 | 1 | `maka:pr:769` |
| §03 | 1 | 1 | `maka:pr:772` (+ related 729, 955, 1090 in same aside) |
| §04 | 1 | 1 | `maka:pr:773` (+ 567) |
| §05 | 1 | 1 | `maka:pr:774` (+ 954) |
| §06 | 1 | 1 | `maka:pr:776` (+ 411, 413) |

All within budget. Tone is one short paragraph + in-atelier links.

## Pin presence

All cited PR numbers exist in `data/maka-history/prs.ndjson`:  
411, 413, 567, 729, 768, 769, 772, 773, 774, 776, 954, 955, 1090.

## Locale hrefs

- zh chapters → `/history/pr/<n>`
- en chapters → `/history/pr/<n>` (**zh-canonical detail**), matching [#12](https://github.com/tt-a1i/agent-atelier/issues/12) until `/en/history/pr|c` routes exist

## Decision

Asides gate **passes** for current chapter set. Do not mark chapters checklist-complete solely from this audit.
