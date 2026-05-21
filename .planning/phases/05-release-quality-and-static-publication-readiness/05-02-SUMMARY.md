---
phase: 05-release-quality-and-static-publication-readiness
plan: 02
subsystem: release-readiness
tags: [release, coverage-matrix, static-publication, diagnostics]
dependency_graph:
  requires: [site/src/data/corpus.ts, site/src/data/chapters.ts, site/src/data/concepts.ts, site/src/data/formal-registry.ts, site/src/scripts/generate-local-indexes.ts]
  provides: [site/src/scripts/generate-coverage-matrix.ts, site/src/scripts/generate-coverage-matrix.test.ts, site/src/pages/release-readiness.astro]
  affects: [site/src/styles/atlas.css]
tech_stack:
  added: []
  patterns: [typed coverage artifact generation, bounded static JSON writes, build-time Astro report rendering, atlas-token report styling]
key_files:
  created:
    - site/src/scripts/generate-coverage-matrix.ts
    - site/src/scripts/generate-coverage-matrix.test.ts
    - site/src/pages/release-readiness.astro
  modified:
    - site/src/styles/atlas.css
decisions:
  - Built release coverage from the existing typed corpus, chapter, concept, formal registry, citation, reading-path, relation, search, and graph data instead of duplicating owner lists.
  - Used exact reader-facing limited-support labels for thin and unsupported derivation states while keeping the source data default supported where canonical derivations exist.
  - Rendered the release-readiness page at Astro build time from the TypeScript coverage generator rather than fetching generated JSON at runtime.
metrics:
  started: 2026-05-21T13:35:00Z
  completed: 2026-05-21T13:48:00Z
  duration: 13m
  tasks_completed: 2
  files_changed: 4
requirements: [QUAL-04]
commits:
  - 8a3a069
  - d96e367
  - 93664f4
  - 5912f5a
---

# Phase 05 Plan 02: Coverage Evidence Vertical Slice Summary

## One-liner

Source-grounded release coverage matrix and static `/release-readiness/` report now prove umbrella-plus-twelve-pillar publication coverage from the same typed data model.

## What Changed

- Added `site/src/scripts/generate-coverage-matrix.test.ts` contract tests for the coverage generator, bounded artifact writes, exact limited derivation labels, and release-readiness page copy/style contracts.
- Added `site/src/scripts/generate-coverage-matrix.ts` with typed coverage matrix rows for all 13 corpus owners, including chapter sections, formal objects, concepts, citations, source trails, derivation coverage/rationale, discovery/index presence, diagnostics, formal anchors, and source trails.
- Added `site/src/pages/release-readiness.astro`, a build-time static report page that imports `buildCoverageMatrix()` directly and renders the required summary, proof labels, compact coverage table, drilldowns, and diagnostics anchors without runtime JSON fetching.
- Extended `site/src/styles/atlas.css` with `release-readiness__` and `coverage-matrix__` selectors using existing atlas tokens, responsive behavior, accessible targets, and compact report styling.

## Task Results

| Task | Result | Commit |
|------|--------|--------|
| Task 1: Add coverage matrix tests and generator | Added RED tests and implemented bounded coverage matrix generation over corpus, chapter, concept, formal registry, citation, reading-path, relation, search, and graph data. | 8a3a069, d96e367 |
| Task 2: Render human-readable release readiness coverage page | Added RED page/style contracts, then implemented the static Astro report and atlas styling. | 93664f4, 5912f5a |

## Verification

- `bun test src/scripts/generate-coverage-matrix.test.ts` passed with 7 tests and 47 assertions.
- `bun run --cwd /home/prannayag/harness_eng/.claude/worktrees/gsd-execute-5/site build:astro` passed and built `/release-readiness/index.html`.
- Built page checks passed for `Owner`, `Chapter sections`, `Formal objects`, `Concepts`, `Citations`, `Source trails`, `Derivation coverage`, `Discovery/index presence`, `Diagnostics`, `Print research handout`, `Clean-checkout proof`, and `Deployable static output`.
- `bun run --cwd /home/prannayag/harness_eng/.claude/worktrees/gsd-execute-5/site src/scripts/generate-coverage-matrix.ts` passed and generated `site/dist/coverage-matrix.json`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected the release page contract test import assertion**
- **Found during:** Task 2 implementation verification
- **Issue:** The initial static source assertion required an exact single named import string, but the page legitimately imports `buildCoverageMatrix` and the `OwnerCoverage` type from the same module.
- **Fix:** Split the assertion into checks for the named `buildCoverageMatrix` import and module source path while preserving the no-runtime-`fetch(` requirement.
- **Files modified:** `site/src/scripts/generate-coverage-matrix.test.ts`
- **Commit:** 5912f5a

## Known Stubs

None. The coverage page includes pending proof copy for later Phase 5 gates (`Clean-checkout proof`, `Deployable static output`) as required release-summary labels, but the coverage evidence slice itself is wired to real typed registry and discovery data.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: static-artifact-write | site/src/scripts/generate-coverage-matrix.ts | New generator writes `coverage-matrix.json`; bounded by the `Output directory must stay inside site/` guard and regression tests for `../dist`. |
| threat_flag: publication-evidence-rendering | site/src/pages/release-readiness.astro | New static page renders generated source trails and diagnostics as publication evidence; data comes from existing public registry inputs and no runtime fetch is introduced. |

## TDD Gate Compliance

- RED gate commits present: `8a3a069 test(05-02): add coverage matrix contract tests`, `93664f4 test(05-02): add release readiness page contracts`.
- GREEN gate commits present after RED: `d96e367 feat(05-02): generate coverage matrix evidence`, `5912f5a feat(05-02): render release readiness coverage page`.

## Self-Check: PASSED

- Created files exist: `site/src/scripts/generate-coverage-matrix.ts`, `site/src/scripts/generate-coverage-matrix.test.ts`, `site/src/pages/release-readiness.astro`.
- Modified style file exists: `site/src/styles/atlas.css`.
- Task commits exist: `8a3a069`, `d96e367`, `93664f4`, `5912f5a`.
- Shared orchestrator artifacts were not modified: `.planning/STATE.md` and `.planning/ROADMAP.md` unchanged in this worktree.
