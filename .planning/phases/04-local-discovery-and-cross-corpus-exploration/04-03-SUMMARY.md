---
phase: 04-local-discovery-and-cross-corpus-exploration
plan: 03
subsystem: search
tags: [astro, pagefind, static-search, discovery-index, vitest]

requires:
  - phase: 04-local-discovery-and-cross-corpus-exploration
    provides: Reading path and related-link registries used as typed search sources
provides:
  - Anchor-aware discovery search records for pages, formal objects, concepts, citations, and reading paths
  - Static grouped local search page backed by Pagefind and generated metadata
  - Representative deterministic search quality fixtures with expected href and anchor checks
affects: [phase-04-discovery, phase-05-release-quality, local-search, pagefind]

tech-stack:
  added: []
  patterns:
    - Generated static JSON discovery indexes under site/dist
    - Safe client-side Pagefind joining by href and stable ID
    - Deterministic search fixture validation over generated records

key-files:
  created:
    - site/src/components/discovery/SearchPanel.astro
    - site/src/pages/search.astro
  modified:
    - site/src/data/discovery.schema.ts
    - site/src/scripts/generate-local-indexes.ts
    - site/src/scripts/generate-local-indexes.test.ts
    - site/src/scripts/validate-discovery.ts
    - site/src/scripts/validate-discovery.test.ts
    - site/src/styles/atlas.css

key-decisions:
  - "Use generated discovery metadata as the grouping and formal-object context layer on top of Pagefind results."
  - "Keep Pagefind result rendering text-only and fallback-safe rather than injecting raw result content."

patterns-established:
  - "DiscoverySearchRecord: shared typed record for local search result grouping, owner context, anchors, snippets, and source labels."
  - "Search fixtures must assert expected hrefs or stable IDs; non-empty-only fixtures are rejected."

requirements-completed: [DISC-01, DISC-02, DISC-03, QUAL-03]

duration: 15min
completed: 2026-05-21
---

# Phase 04 Plan 03: Local Search and Discovery Index Summary

**Grouped local Pagefind search now uses generated anchor-aware discovery records for pages, formal objects, concepts, citations, and reading paths.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-05-21T02:01:00Z
- **Completed:** 2026-05-21T02:16:10Z
- **Tasks:** 3 completed
- **Files modified:** 8

## Accomplishments

- Added `search-index.json` generation with typed records for all required result classes and direct formal-object anchor hrefs.
- Added `/search/` with a grouped `SearchPanel` that fetches generated metadata, joins Pagefind results by href/stable ID, and renders safe text fallbacks for unmatched results.
- Extended discovery validation with representative quality fixtures across pages, formal objects, concepts, citations, and reading paths, including rejection of weak non-empty-only fixtures.

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate anchor-aware discovery search records**
   - `7a32ce5` test: add failing search index coverage
   - `3d15520` feat: generate discovery search index
2. **Task 2: Add grouped local search page and safe Pagefind UI**
   - `7dfbef6` test: add failing grouped search UI coverage
   - `4b195ef` feat: add grouped local search page
3. **Task 3: Validate representative search quality fixtures**
   - `c6461b6` test: add failing search quality fixtures
   - `c3e38f4` feat: validate representative search fixtures

_Note: TDD tasks have paired test and feature commits._

## Files Created/Modified

- `site/src/data/discovery.schema.ts` - Adds typed discovery search index and record schemas.
- `site/src/scripts/generate-local-indexes.ts` - Builds and writes `corpus-index.json` plus `search-index.json` under the existing site output guard.
- `site/src/scripts/generate-local-indexes.test.ts` - Covers required result classes, formal anchors, all owners, reading paths, search UI source contracts, and output guard behavior.
- `site/src/components/discovery/SearchPanel.astro` - Provides grouped static local search UI with Pagefind API loading, generated metadata joins, formal-object metadata ordering, safe fallback rendering, and displayed result limits.
- `site/src/pages/search.astro` - Adds the static `/search/` page with Pagefind fallback body copy.
- `site/src/styles/atlas.css` - Adds atlas-consistent search page, controls, grouped result, focus, and mobile styles.
- `site/src/scripts/validate-discovery.ts` - Adds deterministic QUAL-03 search fixture validation over generated search records.
- `site/src/scripts/validate-discovery.test.ts` - Covers representative search fixtures and failure diagnostics.

## Decisions Made

- Used generated `DiscoverySearchRecord` metadata as the authoritative grouping/context layer, because Pagefind alone does not encode the product-specific result classes and formal-object owner context required by D-06 and D-07.
- Kept unmatched Pagefind results visible through plain text fallback rendering, because silently dropping unmatched results would make the search feel broken and would hide valid Pagefind hits.
- Required every search quality fixture to assert an expected stable ID or href/anchor substring, because QUAL-03 explicitly rejects merely non-empty result checks.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] Installed locked site dependencies**
- **Found during:** Task 1
- **Issue:** `bun test` could not resolve existing dependency `zod` because `site/node_modules` was absent in the isolated worktree.
- **Fix:** Ran `bun install --frozen-lockfile` using the existing lockfile; no dependency versions or package files changed.
- **Files modified:** None tracked
- **Verification:** Subsequent Bun tests ran normally.
- **Committed in:** Not applicable; no tracked file changes.

**2. [Rule 1 - Bug] Prevented Vite from bundling runtime Pagefind asset import**
- **Found during:** Task 2 build verification
- **Issue:** Astro/Vite attempted to resolve `/pagefind/pagefind.js` during static build, but Pagefind assets are emitted after build/index and must be loaded at runtime.
- **Fix:** Converted the dynamic import to use a runtime string with Vite ignore so the browser loads `/pagefind/pagefind.js` after indexing.
- **Files modified:** `site/src/components/discovery/SearchPanel.astro`
- **Verification:** `bun test src/scripts/generate-local-indexes.test.ts && bun run build && bun run index` passed.
- **Committed in:** `4b195ef`

---

**Total deviations:** 2 auto-fixed (1 Rule 3, 1 Rule 1)
**Impact on plan:** Both fixes were required for the planned tests/build to execute in the worktree and for the static Pagefind UI to build correctly. No scope expansion.

## Issues Encountered

- Initial RED tests failed as expected because `buildDiscoverySearchIndex`, `writeDiscoverySearchIndex`, `SearchPanel.astro`, `/search/`, and search fixture validation did not exist yet.
- Astro build initially failed on the absolute Pagefind dynamic import; resolved by leaving Pagefind as a runtime static asset load.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None found. The generated search index is wired to the current corpus, formal registry, concepts, citations, and reading paths; the search page fetches the generated index and Pagefind static bundle.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: browser-search-rendering | site/src/components/discovery/SearchPanel.astro | New browser rendering surface for Pagefind payloads; mitigated by textContent-only rendering and no raw HTML injection. |

## Verification

Final verification passed:

```bash
cd /home/prannayag/harness_eng/.claude/worktrees/agent-ad41c3c27a32eb262/site && bun test src/scripts/generate-local-indexes.test.ts src/scripts/validate-discovery.test.ts && bun run build && bun run index && test -f dist/search-index.json && grep -q 'Formal Objects' dist/search-index.json && grep -q '#reliability.compound-error-bound' dist/search-index.json && test -d dist/pagefind
```

## Self-Check: PASSED

- Created files exist: `site/src/components/discovery/SearchPanel.astro`, `site/src/pages/search.astro`, `.planning/phases/04-local-discovery-and-cross-corpus-exploration/04-03-SUMMARY.md`.
- Task commits exist: `7a32ce5`, `3d15520`, `7dfbef6`, `4b195ef`, `c6461b6`, `c3e38f4`.
- Shared orchestrator artifacts were not modified.

## Next Phase Readiness

The next Phase 4 work can consume `search-index.json` and the typed discovery schemas for graph/search validation. Phase 5 release checks should include clean-build verification that `/search/`, `/search-index.json`, and `/pagefind/` are emitted together.

---
*Phase: 04-local-discovery-and-cross-corpus-exploration*
*Completed: 2026-05-21*
