---
phase: 02-book-shell-and-formal-reading-interface
plan: 01
subsystem: book shell and source-detail pages
tags: [astro, starlight, navigation, source-trails, atlas-css]
dependency_graph:
  requires:
    - site/src/data/corpus.ts
    - site/src/data/corpus.schema.ts
    - site/astro.config.mjs
  provides:
    - shared conceptual-arc book spine
    - generated source-detail pages for umbrella and twelve pillars
    - source trail panel with material-kind treatment
    - subtle previous/next footer navigation
  affects:
    - Starlight sidebar navigation
    - static corpus page generation
    - Phase 2 atlas visual system
tech_stack:
  added: []
  patterns:
    - data-driven Astro static routes
    - Starlight sidebar generated from shared TypeScript data
    - Vitest contract tests for locked navigation order
key_files:
  created:
    - site/src/data/book-spine.ts
    - site/src/data/book-spine.test.ts
    - site/src/pages/corpus/[slug].astro
    - site/src/components/SourceLinkPanel.astro
    - site/src/components/BookFooterNav.astro
    - site/src/styles/atlas.css
  modified:
    - site/astro.config.mjs
decisions:
  - Use bookSpine as the single source for sidebar, source-detail page navigation, and previous/next footer links.
  - Keep Phase 2 corpus pages lightweight source-detail pages rather than curated chapter content.
metrics:
  duration: pending
  completed: 2026-05-19T06:13:00Z
  tasks_completed: 2
  files_changed: 7
requirements: [BOOK-02, BOOK-03, BOOK-05, BOOK-06, DESIGN-01, DESIGN-04]
---

# Phase 02 Plan 01: Book Spine and Source-Detail Slice Summary

Built the data-driven book spine and generated source-detail page slice for the Harness Architecture Book Wiki, keeping conceptual ordering, provenance links, source status, material-kind treatment, and footer navigation tied to shared metadata.

## What Changed

### Task 1: Lock the conceptual-arc book spine with tests

- Added `site/src/data/book-spine.ts` with `pillarArc`, `bookSpine`, `bookSidebar`, and `getPreviousNext(currentId: string)`.
- Locked the required conceptual arc: Overview, Umbrella framework, Abstraction, Information, Reliability, Coordination, Temporal, Economics, Model Routing, Human Interaction, Quality, Security, Governance, Accretion.
- Derived all corpus-backed titles and `/corpus/{slug}/` links from `corpusEntries` without duplicating canonical source, PDF, or bibliography paths.
- Added Vitest coverage for order, pillar-only arc membership, corpus-backed links, previous/next behavior, and Starlight sidebar shape.

**Commit:** `59dfdca` — `feat(02-01): lock book spine conceptual arc`

### Task 2: Generate source-detail pages and navigation from the shared spine

- Updated `site/astro.config.mjs` to import `bookSidebar` and include `./src/styles/atlas.css` alongside KaTeX CSS.
- Added `site/src/pages/corpus/[slug].astro` with `getStaticPaths()` over `corpusEntries`, direct `Book spine` navigation with `aria-current="page"`, source-detail summary content, `SourceLinkPanel`, and `BookFooterNav`.
- Added `SourceLinkPanel.astro` with visible source status labels, material-kind treatment for `canonical`, `supporting`, `synthesis/review`, and `archived/provenance`, labelled canonical source/PDF/bibliography links, and project-root-relative paths.
- Added `BookFooterNav.astro` using `getPreviousNext(currentId)` and exact `Previous: {title}` / `Next: {title}` labels.
- Added `atlas.css` tokens, focus states, 44px interactive targets, source-status variants, material-kind variants, responsive one-column reflow under 720px, and subtle footer navigation treatment.

**Commit:** `2806c70` — `feat(02-01): generate source detail pages`

## Verification

Executed from `/home/prannayag/harness_eng/.claude/worktrees/agent-a024e3a07f3f8a02f/site`:

```bash
bun run test -- src/data/book-spine.test.ts && bun run check && bun run build
```

Result:

- `src/data/book-spine.test.ts`: 5 tests passed.
- `astro check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: corpus validation passed and Astro generated 18 pages.
- Verified generated outputs include `dist/corpus/umbrella/index.html` and `dist/corpus/accretion/index.html`.
- Verified source-detail HTML contains `Source trail`, `Material kind`, `canonical`, `supporting`, `synthesis/review`, `archived/provenance`, `Canonical .tex source`, `Canonical PDF`, and applicable previous/next labels.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Installed locked site dependencies for verification**
- **Found during:** Task 1 RED verification
- **Issue:** `bun run test -- src/data/book-spine.test.ts` failed because `vitest` was unavailable in the worktree dependency install state.
- **Fix:** Ran `bun install --frozen-lockfile` in `site/` using the existing lockfile and package manifest. No package names were changed or added.
- **Files modified:** None committed; dependency install output is gitignored.
- **Commit:** Not applicable.

## Auth Gates

None.

## Known Stubs

None. The source-detail pages intentionally remain lightweight per Phase 2 and explicitly defer curated chapter expansion to Phase 3 without blocking the plan goal.

## Threat Flags

None. New reader-facing routes are static pages generated from the validated `corpusEntries` trust boundary already captured in the plan threat model.

## TDD Gate Compliance

- RED gate: failing `book-spine.test.ts` run confirmed missing `./book-spine` implementation before Task 1 GREEN.
- GREEN gate: `59dfdca` implemented the shared spine and passing tests.
- Task 2 reused the Task 1 contract test as the source-detail integration guard and passed full check/build verification.

## Self-Check: PASSED

- Found created files:
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a024e3a07f3f8a02f/site/src/data/book-spine.ts`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a024e3a07f3f8a02f/site/src/data/book-spine.test.ts`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a024e3a07f3f8a02f/site/src/pages/corpus/[slug].astro`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a024e3a07f3f8a02f/site/src/components/SourceLinkPanel.astro`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a024e3a07f3f8a02f/site/src/components/BookFooterNav.astro`
  - `/home/prannayag/harness_eng/.claude/worktrees/agent-a024e3a07f3f8a02f/site/src/styles/atlas.css`
- Found commits: `59dfdca`, `2806c70`.
- Confirmed no `STATE.md` or `ROADMAP.md` updates were made by this worktree agent.
