---
phase: 04-local-discovery-and-cross-corpus-exploration
plan: 02
subsystem: discovery-ui
tags: [astro, typescript, zod, vitest, static-discovery, related-links]

requires:
  - phase: 04-local-discovery-and-cross-corpus-exploration
    provides: Phase 4 reading paths and target registries from plan 04-01
  - phase: 03-curated-corpus-chapters-and-formal-registry
    provides: chapter, concept, formal-object, citation, and source-trail registries
provides:
  - Extensible typed relation taxonomy for conceptual, source/provenance, and learning-path links
  - Build-time discovery validation for relation type records, relation records, targets, labels, directionality, and family constraints
  - RelatedLinks Astro component rendered on corpus chapter pages and formal-object registry rows
affects: [phase-04-graph-context, phase-04-local-search, phase-05-release-validation]

tech-stack:
  added: []
  patterns:
    - Zod schemas plus strict CLI validation for discovery metadata
    - Source-tested Astro integration assertions for static related-link surfaces
    - Metadata-driven related-link rendering with readable labels instead of raw relation IDs

key-files:
  created:
    - site/src/data/relations.ts
    - site/src/scripts/validate-discovery.ts
    - site/src/scripts/validate-discovery.test.ts
    - site/src/components/discovery/RelatedLinks.astro
  modified:
    - site/package.json
    - site/src/data/discovery.schema.ts
    - site/src/components/formal/FormalObjectList.astro
    - site/src/pages/corpus/[slug].astro
    - site/src/styles/atlas.css

key-decisions:
  - "Relation records use a validated open taxonomy: authors can add new relation types when they provide label, category, directionality, family constraints, and description."
  - "RelatedLinks resolves display titles and hrefs from existing static registries so chapter and formal-object pages do not duplicate canonical source metadata."
  - "Formal-object related links render only when object-scoped relation data exists, avoiding noisy empty panels on every formal registry row."

patterns-established:
  - "Discovery validation follows validate-formal-registry structure: typed result, structured errors, format helper, and hard-fail CLI mode."
  - "Source/provenance relationships complement SourceLinkPanel and formal source tiers; they do not replace canonical provenance UI."
  - "Relation category is communicated through text labels and readable chips, not color alone."

requirements-completed: [DISC-04, DISC-06]

duration: 28min
completed: 2026-05-21T02:02:48Z
---

# Phase 04 Plan 02: Typed Related Links and Discovery Validation Summary

**Validated typed relation metadata with chapter and formal-object related-link navigation across conceptual, source/provenance, and learning-path relationships**

## Performance

- **Duration:** 28 min
- **Started:** 2026-05-21T01:34:00Z
- **Completed:** 2026-05-21T02:02:48Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Added discovery schemas for relation target families, relation type records, relation records, categories, directionality, and parser helpers.
- Created curated relation metadata spanning conceptual, source/provenance, and learning-path categories with formal-object scoped records.
- Implemented `validateDiscovery()` plus CLI diagnostics and added it to the site build validation chain.
- Added TDD coverage for real metadata success and malformed type, invalid type ID, missing label, missing source/target, invalid directionality, and invalid family fixtures.
- Rendered typed related links on chapter pages and formal-object rows while preserving `SourceLinkPanel`, source tiers, stable IDs, anchor links, and `BookFooterNav`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add relation taxonomy and validator with negative fixtures**
   - `28920f5` test: add failing discovery relation validation tests
   - `5885471` feat: validate typed discovery relations
2. **Task 2: Render typed related links on chapter and formal-object surfaces**
   - `044071d` test: add related link rendering source assertions
   - `e0f7d0a` feat: render typed related links on corpus pages

**Plan metadata:** committed separately after this summary.

_Note: TDD tasks have separate test and feature commits._

## Files Created/Modified

- `site/src/data/discovery.schema.ts` - Adds relation category, direction, target family, type record, and relation record schemas/types.
- `site/src/data/relations.ts` - Defines extensible relation taxonomy and curated relation records across chapters, concepts, formal objects, citations, and reading paths.
- `site/src/scripts/validate-discovery.ts` - Validates relation type definitions, duplicate IDs, record labels, known targets, directionality, and allowed family combinations with CLI diagnostics.
- `site/src/scripts/validate-discovery.test.ts` - Covers discovery validation and source assertions for related-link UI integration.
- `site/src/components/discovery/RelatedLinks.astro` - Groups relation records by category/type and renders readable labels, target titles, target family/type, rationale, and direct links.
- `site/src/components/formal/FormalObjectList.astro` - Renders object-scoped related links without replacing source tiers, stable IDs, or anchor links.
- `site/src/pages/corpus/[slug].astro` - Renders chapter-scoped related links before canonical source trail and footer navigation.
- `site/src/styles/atlas.css` - Adds related-link panel, group, chip, row, and responsive styles using Phase 4 atlas tokens.
- `site/package.json` - Adds `validate-discovery.ts` to `bun run validate` so malformed relation metadata hard-fails the static build.

## Decisions Made

- Relation labels shown to readers come from registered relation type records; relation rows must match those labels to prevent ad hoc or spoofed user-facing labels.
- The relation taxonomy remains extensible by data rather than hardcoded component branches, but validation enforces category, directionality, and family constraints.
- Formal-object related-link surfaces suppress empty panels unless relation data exists, matching the UI-SPEC guidance to avoid noisy empty surfaces.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed locked site dependencies in the worktree**
- **Found during:** Task 1 verification
- **Issue:** `bun test src/scripts/validate-discovery.test.ts` could not resolve `zod` because the isolated worktree did not have `site/node_modules` installed.
- **Fix:** Ran `bun install --frozen-lockfile` in `site/` using the existing lockfile. No package names were changed and no new dependency was introduced.
- **Files modified:** None tracked
- **Verification:** `bun test src/scripts/validate-discovery.test.ts` passed after install.
- **Committed in:** Not applicable; dependency install only populated ignored local `node_modules`.

**2. [Rule 2 - Missing Critical] Added discovery validation to the build validation chain**
- **Found during:** Task 2 verification
- **Issue:** The plan required static build failure for malformed relation metadata, but `bun run build` originally only invoked corpus and formal-registry validators.
- **Fix:** Updated `site/package.json` validate script to include `bun run src/scripts/validate-discovery.ts` before Astro build and index generation.
- **Files modified:** `site/package.json`
- **Verification:** `bun test src/scripts/validate-discovery.test.ts && bun run build` passed and build output showed discovery validation running.
- **Committed in:** `e0f7d0a`

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both were required for correctness in the isolated worktree and for D-12 build-time hard-fail behavior. No scope creep.

## Issues Encountered

- The first RED test failed because `site/src/data/relations.ts` did not exist yet, which was the expected TDD failure.
- The second RED test failed because `RelatedLinks.astro` and its integrations did not exist yet, which was the expected TDD failure.
- Astro build emits the existing Starlight docs 404 and sitemap `site` warnings; these are pre-existing/out-of-scope warnings and did not block the plan.

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a958fa2251a9a88d3/site && bun test src/scripts/validate-discovery.test.ts`
  - 13 tests passed.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a958fa2251a9a88d3/site && bun run build`
  - Corpus validation passed.
  - Formal registry validation passed.
  - Discovery validation passed with 5 relation types and 8 relation records.
  - Astro static build and Pagefind/local index generation completed.
- Confirmed built corpus pages contain typed related-link output including chapter and formal-object scoped related links.

## Known Stubs

None found in files created or modified by this plan. The empty copy `No typed relations have been registered for this item yet.` is intentional UI-SPEC copy inside `RelatedLinks.astro` and is suppressed for formal-object rows without relation data.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 04-03 graph context can consume `relationTypes`, `relationRecords`, and `validateDiscovery()` as the validated edge source.
- Plan 04 search/index work can expose relation metadata as static local discovery records without adding runtime services.

## Self-Check: PASSED

- Created files exist: `site/src/data/relations.ts`, `site/src/scripts/validate-discovery.ts`, `site/src/scripts/validate-discovery.test.ts`, `site/src/components/discovery/RelatedLinks.astro`.
- Modified integration files exist: `site/src/data/discovery.schema.ts`, `site/src/components/formal/FormalObjectList.astro`, `site/src/pages/corpus/[slug].astro`, `site/src/styles/atlas.css`, `site/package.json`.
- Task commits exist: `28920f5`, `5885471`, `044071d`, `e0f7d0a`.
- No `STATE.md` or `ROADMAP.md` changes were made by this worktree agent.

---
*Phase: 04-local-discovery-and-cross-corpus-exploration*
*Completed: 2026-05-21T02:02:48Z*
