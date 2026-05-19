---
phase: 02-book-shell-and-formal-reading-interface
plan: 02
subsystem: homepage atlas and constellation navigation
tags: [astro, starlight, homepage, constellation, atlas-css, accessibility]
dependency_graph:
  requires:
    - site/src/data/book-spine.ts
    - site/src/data/corpus.ts
    - site/src/pages/corpus/[slug].astro
  provides:
    - atlas-led homepage framing for the book/wiki
    - accessible constellation navigation to umbrella and twelve pillar source-detail pages
    - scholarly-atlas visual polish for homepage and corpus map
  affects:
    - Starlight homepage content
    - Phase 2 atlas visual system
    - Pagefind-indexed static homepage
tech_stack:
  added: []
  patterns:
    - MDX homepage rendering Astro component before essay prose
    - bookSpine-driven static anchor navigation
    - CSS-only cartographic and constellation treatment
key_files:
  created:
    - site/src/components/AtlasConstellation.astro
    - site/src/components/AtlasConstellation.test.ts
  modified:
    - site/src/content/docs/index.mdx
    - site/src/styles/atlas.css
decisions:
  - Drive homepage constellation order and hrefs from bookSpine rather than a homepage-local pillar list.
  - Keep the Phase 2 homepage explicitly source-detail oriented and defer curated chapter substance to Phase 3.
metrics:
  duration: pending
  completed: 2026-05-19T14:23:30Z
  tasks_completed: 2
  files_changed: 4
requirements: [BOOK-01, BOOK-02, DESIGN-01, DESIGN-04]
---

# Phase 02 Plan 02: Homepage Atlas and Constellation Navigation Summary

Built the homepage vertical slice as a scholarly atlas: a source-grounded book/wiki opening, a constellation map before the introductory essay, and accessible book-spine links to the umbrella framework plus all twelve pillar source-detail pages.

## What Changed

### Task 1: Add the constellation-led homepage path

- Replaced the Phase 1 foundation homepage with Phase 2 book/wiki framing and required copy: `Scholarly atlas of harness architecture`, `Harness Architecture Corpus Map`, `Explore the corpus map`, and `A book/wiki for source-grounded harness research`.
- Added `AtlasConstellation.astro`, driven by `bookSpine`, with the umbrella framework visually separated from the twelve pillar links.
- Routed all constellation anchors to existing Phase 2 source-detail pages such as `/corpus/umbrella/` and `/corpus/accretion/` rather than Phase 3 curated chapter placeholders.
- Preserved source-of-truth prose stating that canonical content comes from `science/paper/` and `pillars/*/paper/`, and that the site links back instead of forking sources.
- Added `AtlasConstellation.test.ts` to lock homepage copy placement and ensure the component uses the shared spine contract.

**Commit:** `420e025` — `feat(02-02): add constellation-led homepage path`

### Task 2: Apply scholarly-atlas polish without harming accessibility

- Extended `atlas.css` with homepage and constellation selectors for a paper-map background, central umbrella card, visible pillar cards, static SVG constellation lines, coordinate-like eyebrows, and source-grounded card surfaces.
- Preserved visible text labels without hover-only hotspots, 44px minimum interactive targets, and the existing 2px Accent focus outline.
- Added single-column narrow-screen reflow under `@media (max-width: 720px)` so the constellation becomes a readable ordered card stack.
- Kept the treatment static and did not introduce runtime dependencies, hosted services, animation, analytics, or third-party scripts.

**Commit:** `e221a51` — `feat(02-02): polish scholarly atlas homepage`

## Verification

Executed from `/home/prannayag/harness_eng/.claude/worktrees/agent-a443395c210953e79/site`:

```bash
bun run test -- src/components/AtlasConstellation.test.ts && bun run check && bun run build
```

Result:

- `src/components/AtlasConstellation.test.ts`: 2 tests passed.
- `astro check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: corpus validation passed, Astro generated 18 pages, and Pagefind indexed 17 pages.
- Verified generated homepage HTML contains `Open umbrella framework`, `Open Accretion source detail`, `/corpus/umbrella/`, and `/corpus/accretion/`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Installed locked site dependencies for verification**
- **Found during:** Task 1 RED verification
- **Issue:** `bun run test -- src/components/AtlasConstellation.test.ts` failed because `vitest` was unavailable in the worktree dependency install state.
- **Fix:** Ran `bun install --frozen-lockfile` in `site/` using the existing lockfile and package manifest. No package names were changed or added.
- **Files modified:** None committed; dependency install output is gitignored.
- **Commit:** Not applicable.

## Auth Gates

None.

## Known Stubs

None. The homepage links to real Phase 2 source-detail pages and explicitly describes full curated chapters as later work rather than pretending they already exist.

## Threat Flags

None. The new reader-facing homepage and constellation are static surfaces using existing `bookSpine` and source-detail routes already covered by the plan threat model.

## TDD Gate Compliance

- RED gate: `AtlasConstellation.test.ts` failed before implementation because `AtlasConstellation.astro` did not exist.
- GREEN gate: `420e025` implemented the constellation-led homepage path and passing contract tests.
- Task 2 was verified with full Astro check/build and homepage output assertions.

## Self-Check: PASSED

- Found created/modified files:
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a443395c210953e79/site/src/content/docs/index.mdx`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a443395c210953e79/site/src/components/AtlasConstellation.astro`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a443395c210953e79/site/src/components/AtlasConstellation.test.ts`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a443395c210953e79/site/src/styles/atlas.css`
- Found commits: `420e025`, `e221a51`.
- Confirmed no `STATE.md` or `ROADMAP.md` updates were made by this worktree agent.
