---
phase: 01-site-foundation-and-provenance-contract
plan: 04
subsystem: site-foundation
tags: [local-indexes, static-inventory, astro, pagefind, phase-1-ui]

requires:
  - Executable provenance validator from Plan 01-03
  - Typed thirteen-entry corpus inventory from Plan 01-02
  - Bun-scoped Astro/Starlight workspace from Plan 01-01
provides:
  - Deterministic local corpus index emitted under site/dist
  - Static inventory page rendered from the real thirteen-entry inventory
  - Phase 1 UI token stylesheet for provenance/inventory surfaces
  - One-command build chain that validates, builds static HTML, and emits local indexes
affects: [phase-1-foundation, phase-2-book-shell, phase-4-local-search]

tech-stack:
  added: []
  patterns:
    - Deterministic JSON build artifact with no timestamps
    - Guarded build output paths constrained to site/
    - Astro static page rendering directly from typed inventory data
    - UI-SPEC token stylesheet with visible focus and responsive path wrapping

key-files:
  created:
    - site/src/scripts/generate-local-indexes.ts
    - site/src/scripts/generate-local-indexes.test.ts
    - site/src/pages/inventory.astro
    - site/src/styles/phase-1.css
  modified:
    - site/package.json
    - site/src/content/docs/index.mdx

key-decisions:
  - "Keep generated corpus-index.json deterministic and timestamp-free so build output can be compared directly."
  - "Guard the index script so output directories must remain inside site/, and make the package index command tolerate pre-HTML runs before Pagefind has pages to index."
  - "Render the inventory page directly from corpusEntries and sourceStatusLabels rather than duplicating inventory data in MDX."

patterns-established:
  - "Local indexes are generated after provenance validation and static HTML build via bun run build."
  - "Phase 1 inventory UI uses explicit status label text, monospace source paths, and responsive metadata stacking under 720px."

requirements-completed: [FOUND-01, FOUND-02, FOUND-03, FOUND-07]

duration: 8min
completed: 2026-05-14T09:18:40Z
---

# Phase 1 Plan 04: Walking Skeleton Static Inventory Summary

**Validation-first static inventory slice with deterministic corpus JSON output and Phase 1 provenance UI tokens**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-14T09:11:06Z
- **Completed:** 2026-05-14T09:18:40Z
- **Tasks:** 2 completed
- **Files modified:** 4 created, 2 modified

## Accomplishments

- Added `site/src/scripts/generate-local-indexes.test.ts` with TDD coverage for index output shape, `entryCount: 13`, entry ordering, inclusion of `security` and `accretion`, and rejection of `..` output paths with the required diagnostic text.
- Implemented `site/src/scripts/generate-local-indexes.ts` exporting `buildCorpusIndex()` and `writeCorpusIndex()`, writing deterministic two-space `dist/corpus-index.json` with `generatedBy`, `entryCount`, and inventory entries in source order.
- Updated `site/package.json` so `bun run index` creates the JSON artifact and runs Pagefind when static HTML exists, while safely skipping Pagefind for pre-build index-only runs.
- Added `site/src/styles/phase-1.css` with the approved Phase 1 color, spacing, typography, focus, status, monospace path, and responsive metadata rules.
- Added `site/src/pages/inventory.astro` rendering exactly the typed corpus inventory fields from `corpusEntries` and `sourceStatusLabels`: title, kind, slug, status label, canonical `.tex`, PDF, and bibliography when present.
- Updated `site/src/content/docs/index.mdx` to document that `bun run build` validates provenance, produces static HTML, emits `dist/corpus-index.json`, and builds Pagefind local index files, while keeping the `Inspect Corpus Inventory` link.

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate deterministic local corpus index** - `5cff16f` (feat)
2. **Task 2: Render static inventory page with UI-SPEC tokens** - `f1111c4` (feat)

**Plan metadata:** committed separately after summary creation.

## Files Created/Modified

- `site/src/scripts/generate-local-indexes.ts` - Deterministic corpus index builder/writer, guarded output directory resolution, CLI success/failure stderr messages, and default `dist/corpus-index.json` generation.
- `site/src/scripts/generate-local-indexes.test.ts` - Vitest coverage for JSON output, stable ordering, required entries, and parent traversal rejection.
- `site/src/pages/inventory.astro` - Static Astro inventory page importing `corpusEntries`, `sourceStatusLabels`, and the Phase 1 stylesheet directly.
- `site/src/styles/phase-1.css` - UI-SPEC tokens and inventory component styling for colors, spacing, typography, status labels, focus outlines, path wrapping, and mobile stacking.
- `site/package.json` - Updated `index` script to generate the JSON artifact and run Pagefind only when HTML exists.
- `site/src/content/docs/index.mdx` - Documented the one-command build outputs and retained the `Inspect Corpus Inventory` CTA.

## Decisions Made

- Used deterministic JSON with no generated timestamp because the local index is a reproducible static build artifact, not an audit log.
- Added a Pagefind guard in `site/package.json` so Task 1's required `bun run index` command succeeds before the inventory HTML page exists; the full `bun run build` still runs Pagefind after Astro generates pages.
- Kept inventory rendering data-driven from the typed inventory and schema labels so future status changes have one source of truth.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed site dependencies before RED verification**
- **Found during:** Task 1
- **Issue:** `bun run test -- src/scripts/generate-local-indexes.test.ts` failed because `vitest` was not installed in the worktree-local `site/node_modules`.
- **Fix:** Ran `bun install` inside `site/`, restoring dependencies declared by prior plans without changing dependency manifests.
- **Files modified:** None tracked.
- **Commit:** N/A

**2. [Rule 3 - Blocking] Guarded Pagefind for index-only runs**
- **Found during:** Task 1
- **Issue:** `bun run index` generated `dist/corpus-index.json` but failed because Pagefind cannot build a search index from an otherwise empty `dist/` before Astro has produced HTML.
- **Fix:** Updated the `index` script to run Pagefind only when `dist` contains HTML, while still running Pagefind during the full `bun run build` sequence after static pages are generated.
- **Files modified:** `site/package.json`
- **Commit:** `5cff16f`

## Issues Encountered

- RED verification failed as expected before `generate-local-indexes.ts` existed.
- `bun run build` still emits the known non-blocking Starlight 404 message and sitemap warning because no deployment `site` URL is configured; static output and Pagefind generation complete successfully.
- No authentication gates or external service setup were encountered.

## User Setup Required

None.

## Known Stubs

None found in created/modified files.

## Threat Flags

None - the plan implemented the declared static trust boundaries only: validated inventory to JSON, validated inventory to HTML, and generated HTML to local Pagefind artifacts. No network endpoints, authentication paths, file mutation paths outside `site/dist`, or private data surfaces were added.

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-ab2d0cdd8fe87dd9d/site && bun run test -- src/scripts/generate-local-indexes.test.ts` - 3 tests passed.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-ab2d0cdd8fe87dd9d/site && bun run index` - wrote `dist/corpus-index.json`; Pagefind skipped only when no HTML existed yet.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-ab2d0cdd8fe87dd9d/site && bun run build` - provenance validation passed, 5 static pages built, `dist/corpus-index.json` emitted, and Pagefind indexed 4 pages.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-ab2d0cdd8fe87dd9d/site && bun run test && bun run build` - all 15 Vitest tests passed and full static build completed.
- Acceptance checks passed for required generator strings, UI-SPEC colors/focus/path wrapping/media query, inventory imports, `13 corpus entries`, `Inspect Corpus Inventory`, and existence of `dist/index.html`, `dist/inventory/index.html`, and `dist/corpus-index.json` after build.

## Self-Check: PASSED

- FOUND: `site/src/scripts/generate-local-indexes.ts`
- FOUND: `site/src/scripts/generate-local-indexes.test.ts`
- FOUND: `site/src/pages/inventory.astro`
- FOUND: `site/src/styles/phase-1.css`
- FOUND: `site/package.json`
- FOUND: `site/src/content/docs/index.mdx`
- FOUND: `.planning/phases/01-site-foundation-and-provenance-contract/01-04-SUMMARY.md`
- FOUND: task commit `5cff16f`
- FOUND: task commit `f1111c4`

## Next Phase Readiness

Phase 2 can build the book shell on top of a working static foundation: one command validates provenance, renders the real inventory page, writes deterministic local corpus metadata, and produces Pagefind local search artifacts under `site/dist` without touching canonical corpus directories.

---
*Phase: 01-site-foundation-and-provenance-contract*
*Completed: 2026-05-14T09:18:40Z*
