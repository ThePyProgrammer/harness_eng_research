---
phase: 04-local-discovery-and-cross-corpus-exploration
plan: 01
subsystem: ui
tags: [astro, zod, vitest, pagefind, static-discovery]

requires:
  - phase: 03-curated-corpus-chapters-and-formal-registry
    provides: Curated chapter, concept, citation, and formal-object registries used as reading-path targets
provides:
  - Typed reading-path and discovery target schemas
  - Five curated branching reading paths for the required BOOK-04 themes
  - Static searchable Astro reading-path pages with accessible route-map rendering
affects: [local-discovery, search, graph-context, related-links]

tech-stack:
  added: []
  patterns:
    - Registry-backed route stops with schema validation and source-level contract tests
    - Static Astro route generation from curated discovery data

key-files:
  created:
    - site/src/data/discovery.schema.ts
    - site/src/data/reading-paths.ts
    - site/src/data/discovery.test.ts
    - site/src/components/discovery/ReadingPathMap.astro
    - site/src/pages/reading-paths/[slug].astro
  modified:
    - site/src/styles/atlas.css

key-decisions:
  - "Reading paths are curated structured route maps, not generated from relation metadata."
  - "Route stops resolve against existing chapter, concept, formal-object, citation, or reading-path registries before rendering."
  - "Reading-path pages use static Astro generation and Pagefind-scoped HTML rather than runtime search or graph services."

patterns-established:
  - "Discovery schemas mirror the formal-registry Zod parser/export pattern."
  - "Accessible route maps keep decorative connectors in aria-hidden SVG and real navigation in semantic nav/ol/a elements."

requirements-completed: [BOOK-04, DISC-02, DISC-04]

duration: 7min
completed: 2026-05-21
---

# Phase 04 Plan 01: Reading Path Route Maps Summary

**Five registry-backed branching reading-path maps rendered as static searchable Astro pages.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-05-21T01:44:00Z
- **Completed:** 2026-05-21T01:51:15Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Added `discovery.schema.ts` with typed Zod schemas for discovery target references, route stops, branches, and reading-path records.
- Curated exactly five required BOOK-04 reading paths: building a harness, scaling multi-agent work, cost/latency, production hardening, and AI code degradation.
- Added tests proving each path branches, every stop has why-it-matters guidance, and every stop target resolves to an existing registry-backed chapter, concept, formal object, citation, or reading path.
- Implemented `ReadingPathMap.astro` with semantic `nav`, ordered route branches, visible `Why this stop matters` copy, `Open stop` links, and hidden decorative SVG connectors.
- Added static `/reading-paths/[slug]/` pages generated from `readingPaths`, scoped with `data-pagefind-body` for local Pagefind indexing.
- Extended the atlas stylesheet for route-map cards, branch layout, 44px links, focus compatibility, and one-column mobile collapse.

## Task Commits

Each task was committed atomically:

1. **Task 1: Define and test the curated reading-path contract** - `e18b500` (feat)
2. **Task 2: Render reading paths as accessible static route maps** - `9a67771` (feat)

**Plan metadata:** committed separately after this summary.

## Files Created/Modified

- `site/src/data/discovery.schema.ts` - Typed schemas and parser for discovery targets, route stops, branches, and path records.
- `site/src/data/reading-paths.ts` - Five curated reading-path records with registry-derived direct target hrefs.
- `site/src/data/discovery.test.ts` - Data and source-contract tests for required paths, branch/stop shape, target resolution, static routes, search scope, and accessibility copy.
- `site/src/components/discovery/ReadingPathMap.astro` - Accessible branching route-map renderer.
- `site/src/pages/reading-paths/[slug].astro` - Static reading-path route generated from `readingPaths`.
- `site/src/styles/atlas.css` - Discovery route-map styling and mobile collapse rules.

## Decisions Made

- Followed D-04 by authoring reading paths as curated data rather than deriving them from relation metadata.
- Derived links through existing registries so invalid curated target IDs fail early.
- Kept decorative map connectors non-interactive and marked `aria-hidden="true"` / `focusable="false"`; all actual navigation is semantic HTML.
- Kept implementation static and local-search compatible with `data-pagefind-body`, avoiding hosted search, runtime graph services, or new dependencies.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] Installed existing locked site dependencies**
- **Found during:** Task 1 verification
- **Issue:** `bun test src/data/discovery.test.ts` could not resolve the already-declared `zod` dependency because `site/node_modules` was absent in the worktree.
- **Fix:** Ran `bun install --frozen-lockfile` using the existing `site/bun.lock`; no package names or lockfile contents were changed.
- **Files modified:** None tracked.
- **Verification:** `bun test src/data/discovery.test.ts` and `bun run build` both passed afterward.
- **Committed in:** Not applicable; dependency install produced no tracked changes.

---

**Total deviations:** 1 auto-fixed (Rule 3)
**Impact on plan:** No scope change; the install only restored the locked verification environment required by the plan.

## Issues Encountered

- Task 1 TDD was split into data tests first; page/component source assertions were added during Task 2 once those files existed. The final `discovery.test.ts` covers both tasks.
- Astro build emitted a pre-existing warning that the sitemap integration needs the `site` config option. It did not block static page generation and is outside this plan's scope.

## User Setup Required

None - no external service configuration required.

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a1613e9562b5606b3/site && bun test src/data/discovery.test.ts`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a1613e9562b5606b3/site && bun run build`
- Build output generated all five required pages:
  - `/reading-paths/building-a-harness/`
  - `/reading-paths/scaling-multi-agent-work/`
  - `/reading-paths/cost-latency/`
  - `/reading-paths/production-hardening/`
  - `/reading-paths/ai-code-degradation/`

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: static-link-surface | `site/src/data/reading-paths.ts` | Curated target references become public links, mitigated by registry-backed target validation and tests. |

## Known Stubs

None.

## Deferred Issues

- The existing Astro sitemap warning remains for a later release-readiness plan.

## Next Phase Readiness

Phase 4 can now connect local search, relation metadata, and graph context to stable reading-path IDs and generated reading-path pages. Future discovery work should reuse `DiscoveryTargetRef` and the route-stop href patterns rather than inventing a parallel target model.

## Self-Check: PASSED

- Files exist: `site/src/data/discovery.schema.ts`, `site/src/data/reading-paths.ts`, `site/src/data/discovery.test.ts`, `site/src/components/discovery/ReadingPathMap.astro`, `site/src/pages/reading-paths/[slug].astro`, and this summary.
- Task commits exist: `e18b500` and `9a67771`.

---
*Phase: 04-local-discovery-and-cross-corpus-exploration*
*Completed: 2026-05-21*
