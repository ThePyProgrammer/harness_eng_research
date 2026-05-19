---
phase: 03-curated-corpus-chapters-and-formal-registry
plan: 04
subsystem: curated corpus registry data
tags: [formal-registry, chapters, glossary, derivations]
dependency_graph:
  requires: [03-03]
  provides: [complete-umbrella-plus-twelve-chapter-coverage, all-owner-derivation-coverage]
  affects: [site/src/data/formal-registry.ts, site/src/data/chapters.ts, site/src/data/concepts.ts, site/src/data/formal-registry.test.ts, site/src/scripts/validate-formal-registry.ts]
tech_stack:
  added: []
  patterns: [typed-registry-first-data, parse-at-export-validation, static-source-trail-curation]
key_files:
  created: []
  modified:
    - site/src/data/formal-registry.test.ts
    - site/src/data/formal-registry.ts
    - site/src/data/chapters.ts
    - site/src/data/concepts.ts
    - site/src/scripts/validate-formal-registry.ts
decisions:
  - Expanded derivation coverage validation into the formal registry gate so all expected corpus owners must resolve supported entries to derivation or equation objects.
metrics:
  duration: "8h09m"
  completed_date: "2026-05-19T17:59:00Z"
  tasks_completed: 3
  files_modified: 5
---

# Phase 03 Plan 04: Complete Curated Corpus Coverage Summary

Completed umbrella-plus-twelve curated chapter coverage with source-grounded registry, glossary, citation, source-trail, and all-owner derivation matrix validation.

## What Changed

- Added complete-coverage tests asserting every `expectedCorpusIds` owner has curated chapters, formal objects, citations, source trails, concepts, and derivation matrix entries.
- Expanded the typed formal registry to cover Human Interaction, Quality, Security, Governance, and Accretion with stable semantic IDs including `human-interaction.attention-allocation`, `quality.ai-code-slop`, `security.prompt-injection-boundary`, `governance.governance-ratchet`, and `accretion.plausible-local-change`.
- Reworked chapter and concept data so all thirteen corpus owners are curated, source-trailed, citation-linked, and represented in reciprocal static glossary links.
- Strengthened `validate-formal-registry.ts` so all-owner derivation coverage is a build-time validation requirement, not only a unit-test assertion.

## Task Commits

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Add failing complete-coverage tests | d478cad | site/src/data/formal-registry.test.ts |
| 2 | Curate Human Interaction, Quality, and Security data | 0df9a75 | site/src/data/formal-registry.ts, site/src/data/chapters.ts, site/src/data/concepts.ts |
| 3 | Curate Governance and Accretion data and close all-owner coverage | b7c2b01 | site/src/scripts/validate-formal-registry.ts |

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a274b3aefa1fc97a1/site && bun run test -- src/data/formal-registry.test.ts` — passed, 14 tests.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a274b3aefa1fc97a1/site && bun run validate` — passed, 13 corpus entries and 50 formal objects / 13 chapters / 14 concepts validated.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a274b3aefa1fc97a1/site && bun run build` — passed, 21 pages built and Pagefind index generated.
- Built output was checked for remaining-pillar pages and registry/glossary entries including Human Interaction, Security, Governance, Accretion, and exact stable IDs.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed existing site dependencies from lockfile**
- **Found during:** Task 1 verification
- **Issue:** `bun run test -- src/data/formal-registry.test.ts` failed because `vitest` was unavailable; `site/node_modules` was absent in the worktree.
- **Fix:** Ran `bun install` in `site/` using the existing `package.json` and `bun.lock`; no new packages or dependency names were introduced.
- **Files modified:** None tracked.
- **Commit:** N/A

**2. [Rule 1 - Bug] Fixed non-reciprocal glossary relation**
- **Found during:** Task 2 verification
- **Issue:** The new reciprocal concept-link test exposed `verification-scheduling` linking only to `compound-error`, while `harness-architecture` linked to all pillar concepts.
- **Fix:** Added the reciprocal `harness-architecture` related concept to `verification-scheduling`.
- **Files modified:** site/src/data/concepts.ts
- **Commit:** 0df9a75

**3. [Rule 2 - Critical] Promoted all-owner derivation matrix coverage into validation**
- **Found during:** Task 3
- **Issue:** Tests enforced all-owner derivation coverage, but the formal registry validator did not yet require matrix completeness or supported derivation/equation targets.
- **Fix:** Added `validateDerivationCoverage` to the validation gate, checking every expected owner, supported derivation/equation target kinds, and chapter derivation-context references.
- **Files modified:** site/src/scripts/validate-formal-registry.ts
- **Commit:** b7c2b01

## Known Stubs

None. Stub-pattern scan found only intentional empty defaults in validator function parameters and local error arrays, not UI-facing placeholder data.

## Threat Flags

None. This plan expanded static typed data and validation only; it introduced no new network endpoint, auth path, file access trust boundary, or schema beyond the existing static registry validation surface described in the plan threat model.

## TDD Gate Compliance

- RED gate commit present: d478cad `test(03-04): add failing complete corpus coverage tests`.
- GREEN/implementation commits present after RED: 0df9a75 and b7c2b01.

## Self-Check: PASSED

- Found modified files: `site/src/data/formal-registry.test.ts`, `site/src/data/formal-registry.ts`, `site/src/data/chapters.ts`, `site/src/data/concepts.ts`, `site/src/scripts/validate-formal-registry.ts`.
- Found task commits: d478cad, 0df9a75, b7c2b01.
- Confirmed SUMMARY exists at `.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-04-SUMMARY.md`.
