---
phase: 05-release-quality-and-static-publication-readiness
plan: 01
subsystem: release-readiness
tags: [release, validation, static-publication, diagnostics]
dependency_graph:
  requires: [site/src/scripts/validate-corpus.ts, site/src/scripts/validate-formal-registry.ts, site/src/scripts/validate-discovery.ts]
  provides: [site/src/scripts/release-readiness.ts, site/src/scripts/release-readiness.test.ts, site/package.json release scripts]
  affects: [site/package.json]
tech_stack:
  added: []
  patterns: [typed validator orchestration, grouped CLI diagnostics, JSON release output, informational pending gates]
key_files:
  created:
    - site/src/scripts/release-readiness.ts
    - site/src/scripts/release-readiness.test.ts
  modified:
    - site/package.json
decisions:
  - Composed existing corpus, formal registry, and discovery validators as the first blocking release gate slice.
  - Represented later Phase 5 gates as typed pending informational totals that do not fail Plan 05-01 release readiness.
  - Kept focused validation scripts intact while adding unified plain and JSON release commands under site/.
metrics:
  started: 2026-05-21T05:33:30Z
  completed: 2026-05-21T05:44:30Z
  duration: 11m
  tasks_completed: 3
  files_changed: 3
requirements: [QUAL-01]
commits:
  - 31af5c0
  - d33cf5a
  - 90a3d5c
---

# Phase 05 Plan 01: Release Readiness Vertical Slice Summary

## One-liner

Unified release-readiness command now composes existing publication validators with typed pending Phase 5 gates and grouped actionable diagnostics.

## What Changed

- Added `site/src/scripts/release-readiness.test.ts` contract tests for the release API, success/blocked copy, diagnostic shape, and gate grouping.
- Added `site/src/scripts/release-readiness.ts` with typed release gate names, diagnostics, gate results, readiness totals, plain summary formatting, JSON CLI output, and exit-code behavior.
- Added `release` and `release:json` scripts to `site/package.json` while preserving `validate`, `check`, `build:astro`, `index`, `build`, and `test`.

## Task Results

| Task | Result | Commit |
|------|--------|--------|
| Task 1: Add release-readiness contract tests before implementation | Added failing Vitest contract tests for the public API and grouped diagnostic contract. | 31af5c0 |
| Task 2: Implement unified release-readiness orchestrator | Implemented validator composition for `corpus`, `formal-registry`, and `discovery`, plus pending informational totals for later Phase 5 gates. | d33cf5a |
| Task 3: Wire site release command without hiding focused scripts | Added `bun run release` and `bun run release:json` package scripts under `site/`. | 90a3d5c |

## Verification

- `bun test src/scripts/release-readiness.test.ts` passed with 4 tests and 12 assertions.
- `bun run --cwd site validate` passed existing corpus, formal registry, and discovery validation.
- `bun run --cwd site release:json` passed with 3 implemented gates passed, 5 later Phase 5 gates pending, and 0 diagnostics.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed existing site dependencies in the worktree**
- **Found during:** Task 2 verification
- **Issue:** `bun test src/scripts/release-readiness.test.ts` could not resolve the existing `zod` dependency because this isolated worktree did not have `site/node_modules` installed.
- **Fix:** Ran `bun install --cwd site` for already-declared dependencies only; no package names or dependency manifests were changed.
- **Files modified:** None
- **Commit:** N/A

**2. [Rule 1 - Bug] Updated the contract test for informational pending gates**
- **Found during:** Task 2 verification
- **Issue:** The initial success test asserted the full gate list contained only the three implemented gates, conflicting with the plan requirement to include pending later Phase 5 gates in typed totals.
- **Fix:** Changed the assertion to require the three implemented gates via `arrayContaining` and assert a positive pending total.
- **Files modified:** `site/src/scripts/release-readiness.test.ts`
- **Commit:** d33cf5a

## Known Stubs

None. Later Phase 5 gates are intentionally represented as typed `pending` release totals per Plan 05-01 and do not block this initial existing-validator slice.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: cli-output | site/src/scripts/release-readiness.ts | New release CLI emits grouped publication diagnostics to stdout/stderr; covered by plan threat model T-05-01-02. |

## TDD Gate Compliance

- RED gate commit present: `31af5c0 test(05-01): add release readiness contract tests`.
- GREEN gate commit present after RED: `d33cf5a feat(05-01): implement release readiness orchestrator`.

## Self-Check: PASSED

- Created files exist: `site/src/scripts/release-readiness.ts`, `site/src/scripts/release-readiness.test.ts`.
- Modified package script file exists: `site/package.json`.
- Task commits exist: `31af5c0`, `d33cf5a`, `90a3d5c`.
- Shared orchestrator artifacts were not modified: `.planning/STATE.md` and `.planning/ROADMAP.md` unchanged in this worktree.
