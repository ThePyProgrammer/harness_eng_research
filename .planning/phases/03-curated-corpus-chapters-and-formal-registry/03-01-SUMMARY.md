---
phase: 03-curated-corpus-chapters-and-formal-registry
plan: 01
subsystem: formal-registry
tags: [phase-03, formal-registry, validation, chapters, concepts]
dependency_graph:
  requires: [site/src/data/corpus.ts, site/src/data/corpus.schema.ts, site/src/scripts/validate-corpus.ts, science/paper/science.tex, science/paper/science.bib]
  provides: [typed-formal-registry, chapter-registry, concept-registry, formal-validation-gate]
  affects: [site/package.json, site/src/data, site/src/scripts]
tech_stack:
  added: []
  patterns: [Zod schema parsing, Vitest contract tests, collect-all validation diagnostics, static typed data]
key_files:
  created:
    - site/src/data/formal-registry.schema.ts
    - site/src/data/formal-registry.ts
    - site/src/data/chapters.ts
    - site/src/data/concepts.ts
    - site/src/scripts/validate-formal-registry.ts
    - site/src/data/formal-registry.test.ts
    - site/src/scripts/validate-formal-registry.test.ts
  modified:
    - site/package.json
decisions:
  - All non-umbrella owners receive minimal, explicitly provisional build-safe records so route expansion can render without inventing fallback IDs.
  - The umbrella vertical slice is curated now, while later Phase 3 plans are responsible for replacing minimal pillar seeds with full curated chapters.
metrics:
  duration: TBD
  completed_date: 2026-05-19
  tasks_completed: 2
  files_changed: 8
---

# Phase 03 Plan 01: Registry-First Umbrella Vertical Slice Summary

Typed formal registry, concept registry, chapter records, and strict validation gate now establish the Phase 3 content contract before downstream curated chapter rendering expands it.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write failing registry and validation tests for the umbrella vertical slice | d8f6efd | site/src/data/formal-registry.test.ts; site/src/scripts/validate-formal-registry.test.ts |
| 2 | Implement typed umbrella registry data, all-owner minimal records, and strict validation gate | b9a0cf4 | site/src/data/formal-registry.schema.ts; site/src/data/formal-registry.ts; site/src/data/chapters.ts; site/src/data/concepts.ts; site/src/scripts/validate-formal-registry.ts; site/package.json |

## What Changed

- Added Zod schemas and parsed exports for formal objects, chapter records, concepts, citations, source trails, source tiers, curation statuses, and stable owner-prefixed formal IDs.
- Seeded the curated umbrella formal object `umbrella.harness-architecture` and the reliability relation target `reliability.compound-error-bound` with canonical source trails.
- Added build-safe minimal chapter, formal object, and concept records for all twelve pillar owners, explicitly marked `minimal` until enrichment plans replace the provisional prose.
- Added a strict `validateFormalRegistry()` CLI that collects errors for duplicate formal IDs, invalid owner IDs, source path failures, archive canonical misuse, missing sections, invalid curation statuses, and broken formal/concept/citation relation targets.
- Chained formal registry validation into `bun run validate` after the existing corpus validation gate.

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a502ed6bb8eefaa77/site && bun run test -- src/data/formal-registry.test.ts src/scripts/validate-formal-registry.test.ts`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a502ed6bb8eefaa77/site && bun run validate`

Result: 2 formal registry test files passed with 11 tests; corpus and formal registry validation both reported 0 errors.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed locked site dependencies before verification**
- **Found during:** Task 1 RED verification
- **Issue:** `bun run test` could not find `vitest` because `site/node_modules` was absent in the worktree.
- **Fix:** Ran `bun install --frozen-lockfile` using the existing `site/bun.lock`; no package names or dependency versions were changed.
- **Files modified:** None tracked
- **Commit:** N/A

**2. [Rule 1 - Bug] Fixed concept source ownership validation for shared umbrella concepts**
- **Found during:** Task 2 verification
- **Issue:** Multi-owner umbrella concepts were validated once per owner, causing canonical umbrella source paths to be rejected for secondary pillar owners.
- **Fix:** Validate concept source trails against the primary owning context and keep reliability-only concepts grounded in the reliability canonical paper.
- **Files modified:** site/src/scripts/validate-formal-registry.ts; site/src/data/concepts.ts
- **Commit:** b9a0cf4

## Known Stubs

| File | Line/Area | Reason |
|------|-----------|--------|
| site/src/data/chapters.ts | `minimalSections()` and all non-umbrella chapter records | Intentional build-safe minimal records required by Plan 03-01. Later Phase 3 plans 03-03/03-04 must replace these with curated pillar chapters, and Plan 03-05 must fail if minimal status remains. |
| site/src/data/formal-registry.ts | `${owner}.chapter-seed` records | Intentional owner-prefixed minimal formal anchors for all pillars so downstream route rendering never invents IDs before full enrichment. |
| site/src/data/concepts.ts | `${owner}-framework` records | Intentional minimal concept cards for all pillars pending full glossary enrichment. |

These stubs do not block this plan goal because the plan explicitly required validated build-safe minimal records for every corpus owner before route expansion.

## Threat Flags

None. New trust-boundary surfaces were limited to typed static data and a local validation CLI already covered by the plan threat model.

## TDD Gate Compliance

- RED commit present: d8f6efd (`test(03-01): add failing formal registry contract tests`)
- GREEN commit present after RED: b9a0cf4 (`feat(03-01): implement typed formal registry validation`)

## Self-Check: PASSED

- Found created files: `site/src/data/formal-registry.schema.ts`, `site/src/data/formal-registry.ts`, `site/src/data/chapters.ts`, `site/src/data/concepts.ts`, `site/src/scripts/validate-formal-registry.ts`, `site/src/data/formal-registry.test.ts`, `site/src/scripts/validate-formal-registry.test.ts`.
- Found task commits: d8f6efd and b9a0cf4.
- Final verification passed with formal registry tests and `bun run validate`.
