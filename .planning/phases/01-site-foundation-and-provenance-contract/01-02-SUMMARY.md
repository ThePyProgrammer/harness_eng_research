---
phase: 01-site-foundation-and-provenance-contract
plan: 02
subsystem: site-foundation
tags: [corpus-inventory, zod, typescript, vitest, provenance]

requires:
  - Bun-scoped Astro/Starlight workspace under site/
provides:
  - Typed corpus schema with finite source statuses and expected corpus ids
  - Explicit umbrella plus twelve-pillar inventory with canonical provenance metadata
  - Vitest coverage for schema fields, source statuses, expected ids, and inventory coverage
affects: [phase-1-provenance-validation, phase-2-book-shell, phase-4-local-search]

tech-stack:
  added: []
  patterns:
    - Zod runtime schema paired with exported TypeScript types
    - Explicit typed inventory instead of filesystem scan output
    - TDD coverage for provenance contract invariants

key-files:
  created:
    - site/src/data/corpus.schema.ts
    - site/src/data/corpus.ts
    - site/src/data/corpus.test.ts
  modified:
    - .gitignore

key-decisions:
  - "Represent source status as a finite Zod enum with Canonical, Missing source, Archive blocked, and Provenance-only labels."
  - "Keep the initial corpus inventory explicit and project-root-relative, covering the umbrella paper and all twelve pillars exactly once."
  - "Ignore site/.astro because Astro check generates local type-check state that should not be committed."

patterns-established:
  - "Inventory data flows through parseCorpusEntries so later validator, page, and index work consume the same schema contract."
  - "Coverage tests compare corpusEntries ids directly to expectedCorpusIds to catch duplicate, missing, or reordered entries."

requirements-completed: [FOUND-03, FOUND-04]

duration: 6min
completed: 2026-05-14T08:51:35Z
---

# Phase 1 Plan 02: Typed Corpus Inventory and Provenance Schema Summary

**Typed thirteen-entry corpus inventory with Zod provenance schema and TDD coverage for source contract invariants**

## Performance

- **Duration:** 6 min
- **Started:** 2026-05-14T08:45:56Z
- **Completed:** 2026-05-14T08:51:35Z
- **Tasks:** 2 completed
- **Files modified:** 3 created, 1 modified

## Accomplishments

- Added `site/src/data/corpus.schema.ts` with finite `sourceStatusSchema`, labels, `corpusKindSchema`, `expectedCorpusIds`, `corpusEntrySchema`, `corpusEntriesSchema`, exported TypeScript types, and `parseCorpusEntries()`.
- Added TDD tests proving the exact thirteen expected ids, finite status set, rejection of `archived`, and required `canonicalTex` metadata.
- Authored `site/src/data/corpus.ts` as an explicit inventory for the umbrella framework plus all twelve pillars, with project-root-relative `canonicalTex`, `canonicalPdf`, bibliography paths, summaries, slugs, kinds, and canonical source status.
- Extended tests so `corpusEntries` parses through the schema, has length 13, contains every expected id exactly once, and starts every entry as `canonical`.
- Added `.gitignore` coverage for `site/.astro/`, which Astro check generates as local tooling state.

## Task Commits

Each task was committed atomically:

1. **Task 1: Define corpus schema and coverage tests** - `18263ea` (test)
2. **Task 2: Author explicit thirteen-entry inventory** - `44b44de` (feat)

Additional generated-output hygiene commit:

- **Ignore Astro generated state** - `e078a56` (chore)

**Plan metadata:** committed separately after summary creation.

## Files Created/Modified

- `site/src/data/corpus.schema.ts` - Zod source status, kind, entry, and entries schemas; expected corpus ids; status labels; parser; exported TypeScript types.
- `site/src/data/corpus.ts` - Explicit umbrella plus twelve-pillar typed inventory with canonical source, PDF, bibliography, summary, slug, kind, and source status metadata.
- `site/src/data/corpus.test.ts` - Vitest coverage for finite source statuses, required metadata, expected ids, parsed inventory length, duplicate prevention, and canonical initial status.
- `.gitignore` - Added `site/.astro/` to keep generated Astro check state out of commits.

## Decisions Made

- Used `parseCorpusEntries()` in `corpus.ts` so schema validation happens where the literal inventory is exported, rather than leaving validation only to downstream scripts.
- Kept inventory entries as explicit literals and did not scan the filesystem, preserving the Phase 1 source contract as a deliberate provenance choice.
- Added `.gitignore` rather than committing `site/.astro/`; generated type-check state is a local runtime artifact, not source.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed site dependencies before RED verification**
- **Found during:** Task 1
- **Issue:** `bun run test -- src/data/corpus.test.ts` failed because `vitest` was not installed in the worktree-local `site/node_modules`.
- **Fix:** Ran `bun install` inside `site/`, restoring the dependency set declared by Plan 01 without changing package manifests.
- **Files modified:** None tracked.
- **Commit:** N/A

**2. [Rule 3 - Blocking] Ignored generated Astro check state**
- **Found during:** Task 2
- **Issue:** `bun run check` generated untracked `site/.astro/` state, which would otherwise leave the worktree dirty after verification.
- **Fix:** Added `site/.astro/` to `.gitignore`.
- **Files modified:** `.gitignore`
- **Commit:** `e078a56`

## Issues Encountered

- The required RED checks failed as expected before implementation: first because `corpus.schema.ts` was absent, then because `corpus.ts` was absent.
- No authentication gates or external service setup were encountered.

## User Setup Required

None.

## Known Stubs

None found in created/modified files.

## Threat Flags

None - the plan introduced build-time typed data and schemas only. It did not add network endpoints, authentication paths, file mutation logic, or new runtime trust boundaries beyond the planned typed inventory to validator/pages surface.

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a6804892bdd8a7f9d/site && bun run test -- src/data/corpus.test.ts` - 6 tests passed.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a6804892bdd8a7f9d/site && bun run check` - 0 errors, 0 warnings, 0 hints.
- Acceptance grep/file checks for finite source status enum, expected ids, human-interaction/model-routing ids, `canonicalTex`, rejection of `archived`, thirteen inventory ids, umbrella/security/accretion canonical paths, inventory length assertion, and canonical source statuses.

## Self-Check: PASSED

- FOUND: `site/src/data/corpus.schema.ts`
- FOUND: `site/src/data/corpus.ts`
- FOUND: `site/src/data/corpus.test.ts`
- FOUND: `.gitignore`
- FOUND: task commit `18263ea`
- FOUND: task commit `44b44de`
- FOUND: hygiene commit `e078a56`

## Next Phase Readiness

Plan 03 can build the provenance validator against `corpusEntries`, `expectedCorpusIds`, and `parseCorpusEntries()` without inventing inventory shape or source status semantics.

---
*Phase: 01-site-foundation-and-provenance-contract*
*Completed: 2026-05-14T08:51:35Z*
