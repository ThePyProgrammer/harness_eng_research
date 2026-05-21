---
phase: 04-local-discovery-and-cross-corpus-exploration
plan: 04
subsystem: discovery-graph
tags: [astro, static-graph, discovery-metadata, validation, accessibility]

requires:
  - phase: 04-local-discovery-and-cross-corpus-exploration
    provides: reading paths, typed relations, local search metadata, corpus/formal/concept/citation registries
provides:
  - static graph-index.json generation from validated discovery metadata
  - high-level /graph/ overview page
  - local /graph/[id]/ neighborhood pages
  - accessible GraphNeighborhood component with semantic list fallback
  - validation for graph IDs, labels, hrefs, relation types, targets, path memberships, and renderability
affects: [phase-04-discovery, phase-05-release-readiness, static-navigation, graph-style-exploration]

tech-stack:
  added: []
  patterns:
    - static Astro graph pages backed by generated TypeScript metadata
    - schema-first graph projection and validation
    - decorative SVG connectors with semantic HTML links as the accessible source of interaction

key-files:
  created:
    - site/src/components/discovery/GraphNeighborhood.astro
    - site/src/pages/graph/index.astro
    - site/src/pages/graph/[id].astro
  modified:
    - site/src/data/discovery.schema.ts
    - site/src/scripts/generate-local-indexes.ts
    - site/src/scripts/generate-local-indexes.test.ts
    - site/src/scripts/validate-discovery.ts
    - site/src/scripts/validate-discovery.test.ts
    - site/src/styles/atlas.css

key-decisions:
  - "Keep global graph data high-level by limiting overview nodes to corpus owners, reading paths, and relation categories."
  - "Generate local graph neighborhoods from existing registries and relation/path metadata rather than adding a graph runtime."
  - "Make graph SVG connectors decorative only; links and list fallbacks remain semantic HTML."

patterns-established:
  - "Graph node IDs use family-prefixed strings such as chapter:umbrella and formal-object:reliability.compound-error-bound."
  - "Graph artifacts are generated under site/dist by the existing local-index script."
  - "Graph validation treats renderability as a build-time correctness gate."

requirements-completed: [DISC-04, DISC-05, DISC-06]

duration: 18min
completed: 2026-05-21T02:27:48Z
---

# Phase 04 Plan 04: Static Graph-Style Context Summary

**Static graph overview and local graph neighborhoods generated from validated discovery metadata, with accessible Astro pages and build-time renderability checks.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-05-21T02:09:00Z
- **Completed:** 2026-05-21T02:27:48Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Added graph schema types plus `buildGraphIndex()` / `writeGraphIndex()` to project reading paths and typed relations into static graph data.
- Extended discovery validation so invalid graph labels, hrefs, relation types, endpoints, path memberships, and unrenderable neighborhoods fail before artifacts are trusted.
- Created `/graph/` and `/graph/[id]/` static Astro pages using an accessible `GraphNeighborhood` component with semantic links and decorative-only SVG connectors.
- Preserved the project constraint: no runtime graph database, server endpoint, or heavyweight client graph engine was introduced.

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate and validate graph neighborhoods from discovery metadata**
   - `8177a3b` test: add failing graph metadata coverage
   - `e2f94d4` feat: generate static graph metadata
2. **Task 2: Render static graph overview and local context pages**
   - `9ec84de` test: add failing graph page assertions
   - `0504dbf` feat: render static graph context pages

**Plan metadata:** pending final metadata commit

_Note: TDD tasks used separate RED and GREEN commits._

## Files Created/Modified

- `site/src/data/discovery.schema.ts` - Added graph node, edge, overview, neighborhood, and path-membership schemas/types.
- `site/src/scripts/generate-local-indexes.ts` - Added graph projection and graph-index writing alongside corpus/search indexes.
- `site/src/scripts/generate-local-indexes.test.ts` - Added graph projection and output-location coverage.
- `site/src/scripts/validate-discovery.ts` - Added graph renderability, label, href, target, type, and membership validation.
- `site/src/scripts/validate-discovery.test.ts` - Added validation failure coverage and graph page source assertions.
- `site/src/components/discovery/GraphNeighborhood.astro` - Created static accessible local graph neighborhood component.
- `site/src/pages/graph/index.astro` - Created high-level global graph overview page.
- `site/src/pages/graph/[id].astro` - Created static local graph context routes from generated neighborhoods.
- `site/src/styles/atlas.css` - Added graph layout, node, connector, relation, and mobile styles.

## Decisions Made

- Global overview stays intentionally coarse: owners, reading paths, and relation categories only, avoiding a global formal/concept/citation hairball.
- Local neighborhoods may include direct formal, concept, citation, chapter, and reading-path nodes where they are direct relation/path next hops.
- Graph rendering remains static Astro/HTML/CSS/SVG backed by generated JSON; validation, not runtime code, guards graph correctness.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed locked site dependencies for verification**
- **Found during:** Task 1 RED verification
- **Issue:** `bun test` could not resolve `zod` because the isolated worktree lacked `site/node_modules`.
- **Fix:** Ran `bun install --frozen-lockfile` in `site/`, using the existing lockfile and without adding new dependencies.
- **Files modified:** none tracked
- **Verification:** Subsequent `bun test` reached the intended failing graph exports, then all tests passed after implementation.
- **Committed in:** not applicable; dependency directory is ignored/generated.

---

**Total deviations:** 1 auto-fixed (Rule 3)
**Impact on plan:** Verification environment setup only; no scope expansion and no package substitution.

## Issues Encountered

- Astro emitted the existing sitemap warning because `astro.config` has no `site` option. This is pre-existing release configuration noise and did not block graph page generation.

## User Setup Required

None - no external service configuration required.

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a08bb81f44d5eb148/site && bun test src/scripts/generate-local-indexes.test.ts src/scripts/validate-discovery.test.ts`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a08bb81f44d5eb148/site && bun run build`
- Confirmed generated artifacts/pages:
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a08bb81f44d5eb148/site/dist/graph-index.json`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a08bb81f44d5eb148/site/dist/graph/index.html`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a08bb81f44d5eb148/site/dist/graph/formal-object:reliability.compound-error-bound/index.html`

## Known Stubs

None found in files created or modified by this plan.

## Threat Flags

None. The plan's declared graph metadata and static navigation trust boundaries cover the newly introduced graph artifact/page surface.

## TDD Gate Compliance

- RED commits present: `8177a3b`, `9ec84de`
- GREEN commits present after RED: `e2f94d4`, `0504dbf`

## Next Phase Readiness

Phase 4 now has static graph-style exploration: researchers can inspect the high-level graph, open local graph neighborhoods, follow typed next-hop links, and rely on validation to reject invalid graph metadata before publication.

## Self-Check: PASSED

- Created files exist: `GraphNeighborhood.astro`, `/graph/index.astro`, `/graph/[id].astro`, and `04-04-SUMMARY.md`.
- Task commits exist: `8177a3b`, `e2f94d4`, `9ec84de`, `0504dbf`.
- Required verification passed and graph artifacts were generated under `site/dist`.

---
*Phase: 04-local-discovery-and-cross-corpus-exploration*
*Completed: 2026-05-21T02:27:48Z*
