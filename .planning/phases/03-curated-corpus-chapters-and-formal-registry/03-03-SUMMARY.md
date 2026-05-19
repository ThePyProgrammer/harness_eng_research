---
phase: 03-curated-corpus-chapters-and-formal-registry
plan: 03
subsystem: curated corpus chapters and formal registry
tags: [phase-03, formal-registry, chapters, concepts, derivations]
dependency_graph:
  requires: [03-02]
  provides: [first-batch-pillar-chapters, derivation-coverage-matrix, normalized-concepts]
  affects: [site/src/data/formal-registry.ts, site/src/data/chapters.ts, site/src/data/concepts.ts, site/src/data/formal-registry.test.ts]
tech_stack:
  added: []
  patterns: [typed-registry-data, parse-at-export, source-grounded-static-chapters, derivation-coverage-matrix]
key_files:
  created: []
  modified:
    - site/src/data/formal-registry.test.ts
    - site/src/data/formal-registry.ts
    - site/src/data/chapters.ts
    - site/src/data/concepts.ts
decisions:
  - First-batch pillar chapters use source-grounded TypeScript registry data rather than page-local prose.
  - Source-supported derivation coverage is represented as an owner/source matrix with linked derivation objects.
  - Aliases normalize into canonical concept IDs instead of duplicate glossary entries.
metrics:
  duration: approximately 9 minutes
  completed: 2026-05-19T09:48:00Z
  tasks: 3
  files_modified: 4
---

# Phase 03 Plan 03: First-Batch Pillar Chapters and Formal Registry Summary

## One-Liner

Registry-backed curated chapters for Abstraction, Information, Reliability, Coordination, Temporal, Economics, and Model Routing with source-supported derivation coverage and normalized glossary concepts.

## What Changed

- Added failing Vitest coverage for the first seven conceptual-arc pillar owners, including D-01 section coverage, stable semantic IDs, derivation matrix requirements, and alias normalization.
- Replaced minimal first-batch pillar seeds with curated chapter records, formal definitions, theorem-like claims, derivation objects, citation objects, source trails, and concept links.
- Exported `derivationCoverageByOwner` so each supported owner/source points to notebook-style derivation objects that are also referenced in chapter derivation sections.
- Normalized first-batch glossary aliases into canonical concept IDs such as `compound-error`, `stage-specific-routing`, and `cost-value-information-harness`.

## Tasks Completed

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Add failing coverage tests for first-batch pillar chapters and derivation matrix | d84057d | `site/src/data/formal-registry.test.ts` |
| 2 | Curate Abstraction, Information, Reliability, and Coordination data | 797b39a | `site/src/data/formal-registry.ts`, `site/src/data/chapters.ts`, `site/src/data/concepts.ts` |
| 3 | Curate Temporal, Economics, and Model Routing data | 22aee25 | `site/src/data/chapters.ts` |

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a221441981a58e714/site && bun run test -- src/data/formal-registry.test.ts` passed.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a221441981a58e714/site && bun run validate` passed.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a221441981a58e714/site && bun run build` passed.
- Built corpus pages include `/corpus/abstraction/`, `/corpus/reliability/`, and `/corpus/model-routing/` with stable formal object anchors.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed existing site dependencies from the committed lockfile**
- **Found during:** Task 1 RED verification
- **Issue:** `bun run test -- src/data/formal-registry.test.ts` failed because `vitest` was not present in `site/node_modules` in the fresh worktree.
- **Fix:** Ran `bun install --frozen-lockfile` under `site/`, using only existing `bun.lock` dependencies and adding no packages.
- **Files modified:** None tracked.
- **Commit:** Not applicable.

## Known Stubs

- Existing minimal seeds remain for owners outside this plan's first-batch scope: `quality`, `governance`, `human-interaction`, `security`, and `accretion`. They are intentionally preserved for later Phase 3 plans and do not block this plan's first-batch objective.

## Threat Flags

None. Changes remain static typed data and do not introduce new network endpoints, auth paths, file access behavior, or runtime trust boundaries beyond the planned canonical-source-to-curated-data boundary.

## Self-Check: PASSED

- Found modified files: `site/src/data/formal-registry.test.ts`, `site/src/data/formal-registry.ts`, `site/src/data/chapters.ts`, and `site/src/data/concepts.ts`.
- Found task commits: `d84057d`, `797b39a`, and `22aee25`.
- Confirmed no shared orchestrator artifacts (`.planning/STATE.md`, `.planning/ROADMAP.md`) were modified.
