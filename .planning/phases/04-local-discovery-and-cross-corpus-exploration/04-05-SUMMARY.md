---
phase: 04-local-discovery-and-cross-corpus-exploration
plan: 05
subsystem: discovery-validation
tags: [astro, bun, vitest, static-search, graph, reading-paths]
requires:
  - phase: 04-local-discovery-and-cross-corpus-exploration
    provides: reading path, search, relation, and graph discovery surfaces from plans 04-01 through 04-04
provides:
  - consolidated Phase 4 validation gate for relations, paths, graph artifacts, and representative search fixtures
  - one-command static index generation for corpus, search, relation, reading-path, and graph JSON artifacts
  - source-level contract tests mapping locked decisions D-01 through D-16 to implementation hooks
  - chapter-page local graph context CTA that complements related links and source trails
affects: [phase-05-release-quality, discovery, local-search, graph-context]
tech-stack:
  added: []
  patterns:
    - bounded static JSON artifact generation under site/dist
    - source assertions for UI copy, accessibility, and decision traceability
key-files:
  created:
    - .planning/phases/04-local-discovery-and-cross-corpus-exploration/04-05-SUMMARY.md
  modified:
    - site/src/scripts/generate-local-indexes.ts
    - site/src/scripts/generate-local-indexes.test.ts
    - site/src/scripts/validate-discovery.ts
    - site/src/scripts/validate-discovery.test.ts
    - site/src/data/discovery.test.ts
    - site/src/pages/corpus/[slug].astro
    - site/src/styles/atlas.css
key-decisions:
  - "Keep discovery artifact generation static and bounded to checked registry data; no hosted service, package install, graph database, or runtime backend was added."
  - "Expose chapter graph local context as a CTA near related links while preserving SourceLinkPanel and BookFooterNav as canonical provenance and book navigation surfaces."
patterns-established:
  - "Discovery CLI validation reports totals for paths, relation types, relation records, graph nodes, graph neighborhoods, search fixtures, and errors."
  - "Final Phase 4 contracts are enforced with Vitest source assertions rather than prose-only checklists."
requirements-completed: [BOOK-04, DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, DISC-06, QUAL-03]
duration: 39min
completed: 2026-05-21
---

# Phase 04 Plan 05: Final Discovery Validation and Contract Hardening Summary

**Static discovery validation now gates Phase 4 reading paths, search, related links, graph context, and generated artifacts end to end.**

## Performance

- **Duration:** 39 min
- **Started:** 2026-05-21T10:01:00Z
- **Completed:** 2026-05-21T10:40:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Expanded local index generation so one bounded script writes corpus, search, relation, reading-path, and graph JSON artifacts under `site/dist`.
- Extended discovery validation reporting with JSON-facing totals for paths, relation types, relation records, graph nodes, graph neighborhoods, search fixtures, and errors.
- Added final Phase 4 source contract coverage mapping locked decisions D-01 through D-16 to implementation hooks, UI copy, accessibility selectors, mobile collapse behavior, and D-11 related-link preservation requirements.
- Added a chapter-page local graph context CTA near related links without removing `SourceLinkPanel`, `BookFooterNav`, source tiers, stable IDs, or anchor links.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire discovery validation and index generation into site scripts** - `5c26223` (feat)
2. **Task 2: Add final source/UI contract coverage for Phase 4 surfaces** - `5689bb2` (test)

**Plan metadata:** pending final docs commit

## Files Created/Modified

- `site/src/scripts/generate-local-indexes.ts` - Adds relation and reading-path index builders/writers plus `writeAllLocalIndexes()` and stderr logging for every generated artifact.
- `site/src/scripts/generate-local-indexes.test.ts` - Verifies one-command artifact generation and relation/reading-path index output bounds.
- `site/src/scripts/validate-discovery.ts` - Adds validation totals covering required Phase 4 discovery dimensions.
- `site/src/scripts/validate-discovery.test.ts` - Asserts validation totals and malformed fixture failures.
- `site/src/data/discovery.test.ts` - Adds final D-01 through D-16, UI copy, accessibility, mobile, and D-11 source-preservation contract tests.
- `site/src/pages/corpus/[slug].astro` - Adds source-grounded local graph context CTA beside typed related links.
- `site/src/styles/atlas.css` - Styles chapter graph context and consolidates route-stop link accessibility styling.
- `.planning/phases/04-local-discovery-and-cross-corpus-exploration/04-05-SUMMARY.md` - Execution summary for plan 04-05.

## Decisions Made

- Kept all discovery hardening static and local: generated JSON artifacts plus Astro pages, no runtime database or heavy client graph engine.
- Used final source assertions for Phase 4 acceptance criteria because the plan explicitly required concrete implementation hooks instead of a prose checklist.
- Placed chapter local graph context after related links and before source trails so path discovery complements, rather than replaces, provenance and footer navigation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Installed existing site dependencies for verification**
- **Found during:** Task 1
- **Issue:** `bun test` could not resolve the existing `zod` dependency because `site/node_modules` was absent in the fresh worktree.
- **Fix:** Ran `bun install` in `site/` using the existing `package.json` dependency set; no dependency or package manager change was introduced.
- **Files modified:** none tracked
- **Verification:** `bun test src/scripts/validate-discovery.test.ts src/scripts/generate-local-indexes.test.ts && bun run validate`
- **Committed in:** not applicable; no tracked file changes

**2. [Rule 2 - Missing Critical Functionality] Added chapter local graph context CTA**
- **Found during:** Task 2
- **Issue:** Corpus pages rendered typed related links but did not expose the graph local-context affordance required by the plan acceptance criteria and UI-SPEC.
- **Fix:** Added a static graph-neighborhood lookup and `Open local context` CTA near related links while preserving `SourceLinkPanel` and `BookFooterNav`.
- **Files modified:** `site/src/pages/corpus/[slug].astro`, `site/src/styles/atlas.css`, `site/src/data/discovery.test.ts`
- **Verification:** `bun test src/data/discovery.test.ts src/scripts/validate-discovery.test.ts && bun run build && bun run index`
- **Committed in:** `5689bb2`

---

**Total deviations:** 2 auto-fixed (Rule 3: 1, Rule 2: 1)
**Impact on plan:** Both fixes were necessary to complete planned verification and enforce the locked discovery UI contract. No scope creep or new dependencies were introduced.

## Issues Encountered

- Initial verification failed because dependencies were not installed in the worktree; resolved with `bun install` against existing package metadata.
- Source assertion windows for CSS min-height checks initially missed grouped selector rules; resolved by making the tests assert explicit selector groups and consolidating route-stop link styling.

## User Setup Required

None - no external service configuration required.

## Verification

Final verification passed:

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-ac5bbef0bc819d4ca/site && bun test`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-ac5bbef0bc819d4ca/site && bun run validate`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-ac5bbef0bc819d4ca/site && bun run build`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-ac5bbef0bc819d4ca/site && bun run index`

Generated artifacts include:

- `site/dist/corpus-index.json`
- `site/dist/search-index.json`
- `site/dist/relation-index.json`
- `site/dist/reading-paths-index.json`
- `site/dist/graph-index.json`

## Known Stubs

None found in files modified by this plan.

## Threat Flags

None. The plan touched static build/validation scripts, static Astro pages, tests, and CSS only; no network endpoint, auth path, file access trust boundary beyond bounded `site/dist` artifact writing, or schema change was introduced outside the plan threat model.

## Next Phase Readiness

Phase 4 discovery is ready for execution verification: standard validation covers malformed discovery metadata, the build/index workflow emits all local artifacts, and source tests trace locked Phase 4 decisions and UI/accessibility requirements to concrete implementation hooks.

## Self-Check: PASSED

- Found modified files listed above.
- Found task commits `5c26223` and `5689bb2` in git history.
- Confirmed no canonical `science/` or `pillars/` files were modified.

---
*Phase: 04-local-discovery-and-cross-corpus-exploration*
*Completed: 2026-05-21*
