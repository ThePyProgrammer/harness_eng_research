---
phase: 05-release-quality-and-static-publication-readiness
plan: 03
subsystem: release-readiness
tags: [release, validation, math-fixtures, canonical-sources, diagnostics]
dependency_graph:
  requires: [site/src/scripts/validate-formal-registry.ts, site/src/data/formal-registry.ts, site/src/data/corpus.ts, science/paper/science.tex, pillars/*/paper/*.tex]
  provides: [site/src/scripts/validate-math-fixtures.ts, site/src/scripts/validate-math-fixtures.test.ts]
  affects: [site/src/scripts/release-readiness.ts, site/package.json]
tech_stack:
  added: []
  patterns: [repository-relative path validation, canonical source snippet fixtures, optional dist anchor validation, structured release diagnostics]
key_files:
  created:
    - site/src/scripts/validate-math-fixtures.ts
    - site/src/scripts/validate-math-fixtures.test.ts
  modified: []
decisions:
  - Used exact canonical source snippets from the umbrella paper plus Reliability, Information, Coordination, Economics, and Security pillar papers rather than generated or mocked source excerpts.
  - Required fixture formal object IDs to exist in `formalRegistry` and match the fixture owner, so source support cannot silently point at another pillar's registry object.
  - Made rendered anchor validation opportunistic when `site/dist` is absent and blocking only when a fixture explicitly sets `requireRendered: true`.
metrics:
  started: 2026-05-21T14:00:00Z
  completed: 2026-05-21T14:14:00Z
  duration: 14m
  tasks_completed: 2
  files_changed: 2
requirements: [QUAL-02]
commits:
  - 79b71b7
  - 3b0a39e
---

# Phase 05 Plan 03: Representative Math Fixture Gate Summary

## One-liner

Representative umbrella-plus-pillar math fixtures now validate canonical LaTeX snippets, same-owner formal registry IDs, and optional rendered anchors with release-ready diagnostics.

## What Changed

- Added `site/src/scripts/validate-math-fixtures.test.ts` with Vitest coverage for passing default fixtures and failures for missing snippets, unknown formal object IDs, and parent traversal source paths.
- Added `site/src/scripts/validate-math-fixtures.ts` exporting `validateMathFixtures`, `formatMathFixtureError`, and typed fixture/error/result contracts for later release orchestrator integration.
- Defined six default canonical fixtures covering `umbrella`, `reliability`, `information`, `coordination`, `economics`, and `security` from checked `.tex` sources.
- Implemented repository-relative path safety, source existence checks, exact snippet matching, same-owner formal registry validation, optional rendered anchor checks when `site/dist` exists, and `--json` CLI output.

## Task Results

| Task | Result | Commit |
|------|--------|--------|
| Task 1: Add math fixture validator tests | Added RED contract tests for real representative fixtures and failure diagnostics. | 79b71b7 |
| Task 2: Implement representative canonical math fixture gate | Implemented the validator, CLI, default fixtures, path safety, formal registry checks, and optional rendered anchor validation. | 3b0a39e |

## Verification

- `bun test src/scripts/validate-math-fixtures.test.ts` passed with 4 tests and 10 assertions.
- `bun run --cwd /home/prannayag/harness_eng/.claude/worktrees/gsd-execute-5/site src/scripts/validate-math-fixtures.ts --json` passed and emitted JSON containing `"ok": true`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Adjusted CLI verification to the active worktree path**
- **Found during:** Task 2 verification
- **Issue:** The plan's sample command referenced `/home/prannayag/harness_eng/site`, but this sequential executor is running in `/home/prannayag/harness_eng/.claude/worktrees/gsd-execute-5`; running the script without the worktree-aware cwd made Bun resolve `src/scripts/validate-math-fixtures.ts` from the wrong directory.
- **Fix:** Re-ran the CLI verification with `bun run --cwd /home/prannayag/harness_eng/.claude/worktrees/gsd-execute-5/site src/scripts/validate-math-fixtures.ts --json`.
- **Files modified:** None
- **Commit:** N/A

## Known Stubs

None. The default fixtures are wired to real canonical `.tex` snippets and existing formal registry IDs. Empty default option objects and local error arrays in the validator are implementation initialization patterns, not UI-facing stubs.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: filesystem-read-validator | site/src/scripts/validate-math-fixtures.ts | New release validator reads fixture-selected repository files; mitigated by absolute path rejection, parent traversal rejection, and repository containment checks before file reads. |
| threat_flag: publication-evidence-anchor-validation | site/src/scripts/validate-math-fixtures.ts | Optional validation reads built `site/dist` HTML to prove formal anchors exist when output is available or explicitly required. |

## TDD Gate Compliance

- RED gate commit present: `79b71b7 test(05-03): add math fixture validator contracts`.
- GREEN gate commit present after RED: `3b0a39e feat(05-03): validate canonical math fixtures`.

## Self-Check: PASSED

- Created files exist: `site/src/scripts/validate-math-fixtures.ts`, `site/src/scripts/validate-math-fixtures.test.ts`.
- Task commits exist: `79b71b7`, `3b0a39e`.
- Shared orchestrator artifacts were not modified: `.planning/STATE.md` and `.planning/ROADMAP.md` unchanged in this worktree.
