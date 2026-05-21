---
phase: 05-release-quality-and-static-publication-readiness
plan: 04
subsystem: print-readiness
tags: [print, citation-handouts, release-readiness, static-validation]
dependency_graph:
  requires: [site/src/styles/atlas.css, site/src/pages/release-readiness.astro, site/src/pages/corpus/[slug].astro, site/src/components/formal/SourceTrail.astro]
  provides: [site/src/scripts/validate-print-readiness.ts, site/src/scripts/validate-print-readiness.test.ts]
  affects: [site/src/styles/atlas.css]
tech_stack:
  added: []
  patterns: [static CSS contract validation, representative built-page checks, actionable release diagnostics, print-scoped atlas styling]
key_files:
  created:
    - site/src/scripts/validate-print-readiness.ts
    - site/src/scripts/validate-print-readiness.test.ts
  modified:
    - site/src/styles/atlas.css
decisions:
  - Validated print readiness through static CSS and built HTML text checks rather than browser/PDF snapshots or new dependencies.
  - Hid only explicit navigation chrome selectors in print so source trails and provenance-bearing asides remain printable.
  - Expanded link destinations with print URL suffixes while suppressing same-page hash and javascript print-action noise.
metrics:
  started: 2026-05-21T13:52:00Z
  completed: 2026-05-21T13:57:00Z
  duration: 5m
  tasks_completed: 2
  files_changed: 3
requirements: [DESIGN-05]
commits:
  - 3fed997
  - c373d5e
---

# Phase 05 Plan 04: Print/Citation-Friendly Research Handout Summary

## One-liner

Citation-friendly print handouts now preserve formal research content, source trails, citations, coverage rows, and expanded URLs while a static validator blocks print CSS regressions before release.

## What Changed

- Added `site/src/scripts/validate-print-readiness.test.ts` with RED contract tests for missing `@media print`, missing `a[href]::after`, broad provenance-hiding `aside { display: none }`, and real `atlas.css` print signal coverage.
- Added `site/src/scripts/validate-print-readiness.ts` exporting `validatePrintReadiness` and `formatPrintReadinessError` with standard `{ entryId, field, path, reason, nextStep }` diagnostics plus `--json` CLI output.
- Extended `site/src/styles/atlas.css` with print-scoped rules for `@page`, white/grayscale-safe surfaces, navigation chrome suppression, formal/source/citation preservation, coverage matrix readability, and URL expansion.
- Representative built pages are checked when `site/dist` exists: homepage, umbrella chapter, formal registry, glossary, reading paths, graph overview, and release-readiness.

## Task Results

| Task | Result | Commit |
|------|--------|--------|
| Task 1: Add print readiness validation tests | Added failing Vitest contracts for the print-readiness validator and required atlas CSS print signals. | 3fed997 |
| Task 2: Add print CSS and static print validator | Implemented print CSS and static validator with JSON diagnostics and representative built-page checks. | c373d5e |

## Verification

- `bun test src/scripts/validate-print-readiness.test.ts` passed with 4 tests and 18 assertions.
- `bun run --cwd /home/prannayag/harness_eng/.claude/worktrees/gsd-execute-5/site build:astro` passed and built 67 static pages.
- `bun run --cwd /home/prannayag/harness_eng/.claude/worktrees/gsd-execute-5/site src/scripts/validate-print-readiness.ts --json` passed with `"ok": true` and zero errors.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Re-ran build commands with explicit site cwd**
- **Found during:** Task 2 verification
- **Issue:** Running `bun run build:astro` from the repository root failed because `build:astro` is a `site/package.json` script.
- **Fix:** Used `bun run --cwd /home/prannayag/harness_eng/.claude/worktrees/gsd-execute-5/site build:astro` and the same explicit cwd for the print validator, matching the known phase baseline command style.
- **Files modified:** None
- **Commit:** c373d5e

## Known Stubs

None. The validator is wired to real `atlas.css` and checks built `site/dist` pages when present; no placeholder data or mock-only output remains.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: print-visibility-policy | site/src/styles/atlas.css | Print CSS controls which publication evidence appears in handouts; mitigated with explicit source-trail/formal-content preservation and no broad aside hiding. |
| threat_flag: release-validator-cli | site/src/scripts/validate-print-readiness.ts | New CLI emits publication-blocking diagnostics; bounded to static CSS and known representative HTML files with actionable error fields. |

## TDD Gate Compliance

- RED gate commit present: `3fed997 test(05-04): add print readiness contract tests`.
- GREEN gate commit present after RED: `c373d5e feat(05-04): validate print-ready research handouts`.

## Self-Check: PASSED

- Created files exist: `site/src/scripts/validate-print-readiness.ts`, `site/src/scripts/validate-print-readiness.test.ts`.
- Modified style file exists: `site/src/styles/atlas.css`.
- Task commits exist: `3fed997`, `c373d5e`.
- Shared orchestrator artifacts were not modified: `.planning/STATE.md` and `.planning/ROADMAP.md` unchanged in this worktree.
