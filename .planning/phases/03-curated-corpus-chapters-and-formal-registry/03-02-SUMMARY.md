---
phase: 03-curated-corpus-chapters-and-formal-registry
plan: 02
subsystem: curated corpus chapter reader
tags: [astro, formal-registry, glossary, static-site]
dependency_graph:
  requires: [03-01]
  provides: [registry-backed-chapter-route, formal-registry-index, glossary-index]
  affects: [site/src/components/formal, site/src/pages/corpus, site/src/styles/atlas.css]
tech_stack:
  added: []
  patterns: [typed Astro props, strict registry lookup, static reciprocal links]
key_files:
  created:
    - site/src/components/formal/FormalObjectList.astro
    - site/src/components/formal/ConceptCard.astro
    - site/src/pages/formal-registry/index.astro
    - site/src/pages/glossary/index.astro
  modified:
    - site/src/components/formal/TheoremBlock.astro
    - site/src/components/formal/formal-components.test.ts
    - site/src/pages/corpus/[slug].astro
    - site/src/styles/atlas.css
    - site/src/data/corpus.schema.ts
    - site/src/data/book-spine.test.ts
    - site/src/scripts/validate-formal-registry.test.ts
decisions:
  - Exported route-level lookup helpers in the Astro page frontmatter because Astro prerender chunks require helpers referenced by getStaticPaths/render closures to remain available after compilation.
  - Tightened corpus entry IDs to the expected owner enum so Plan 03-01 typed owner records compose safely with formal registry owner IDs.
metrics:
  duration: 12 minutes
  completed: 2026-05-19T09:35:15Z
  tasks: 2
  files_changed: 12
requirements: [FORM-01, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07, FORM-08, FORM-09, FORM-10]
---

# Phase 03 Plan 02: Registry-Backed Chapters and Formal Indexes Summary

Registry-backed corpus chapters now render formal objects, source trails, concepts, a formal registry index, and a glossary from typed static data with stable semantic anchor links.

## What Changed

- Extended formal reading components so theorem-like blocks render the requested kind labels and visible source tier metadata instead of hard-coding every theorem-like object as `Claim`.
- Added `FormalObjectList.astro` and `ConceptCard.astro` for structured registry and glossary presentation with stable IDs, owner metadata, source tiers, source status, aliases, notation, related formal objects, and related concepts.
- Replaced the Phase 2 corpus placeholder route with strict `getChapterByOwner(entry.id)` chapter rendering from typed chapter/formal/concept registries.
- Added `/formal-registry/` grouped by owner and kind, linking each row back to `/corpus/{slug}/#{object.id}`.
- Added `/glossary/` from `conceptRegistry`, including alias links back to canonical concept cards.
- Preserved the book spine sidebar, `SourceLinkPanel`, `BookFooterNav`, `data-pagefind-body`, static-only behavior, and local Pagefind indexing.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 RED | Add failing registry component contract | 5a39906 | site/src/components/formal/formal-components.test.ts |
| 1 GREEN | Render formal registry components | 138ba11 | site/src/components/formal/TheoremBlock.astro, site/src/components/formal/FormalObjectList.astro, site/src/components/formal/ConceptCard.astro, site/src/components/formal/formal-components.test.ts, site/src/styles/atlas.css |
| 2 | Publish registry-backed chapter pages | 50fa69a | site/src/pages/corpus/[slug].astro, site/src/pages/formal-registry/index.astro, site/src/pages/glossary/index.astro, site/src/styles/atlas.css, site/src/data/corpus.schema.ts, site/src/data/book-spine.test.ts, site/src/scripts/validate-formal-registry.test.ts |

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a13830314a61be706/site && bun run test -- src/components/formal/formal-components.test.ts`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a13830314a61be706/site && bun run check`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a13830314a61be706/site && bun run build`
- Acceptance grep checks confirmed:
  - `dist/corpus/umbrella/index.html` contains all ten required chapter headings.
  - `dist/corpus/umbrella/index.html` contains `umbrella.harness-architecture` and no longer contains `Phase 2 source detail`.
  - Built output includes all 13 corpus chapter pages.
  - Minimal owner pages visibly show incomplete/minimal curation status.
  - `dist/formal-registry/index.html` contains `Browse formal registry`, `umbrella.harness-architecture`, and `#umbrella.harness-architecture`.
  - `dist/glossary/index.html` contains `Aliases`, `Notation`, and `Related formal objects`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed locked site dependencies**
- **Found during:** Task 1 RED verification
- **Issue:** `bun run test -- src/components/formal/formal-components.test.ts` failed because `vitest` was unavailable in the worktree without installed dependencies.
- **Fix:** Ran `bun install --frozen-lockfile` under `site/` using the existing lockfile and package names only; no package names or versions were changed.
- **Files modified:** None
- **Commit:** Not applicable

**2. [Rule 3 - Blocking] Tightened corpus entry ID typing**
- **Found during:** Task 2 verification
- **Issue:** `astro check` exposed that formal/chapter/concept registries used strict owner ID unions while `corpusEntries` still inferred `id` as `string`, breaking all-owner strict lookup composition.
- **Fix:** Changed `corpusEntrySchema.id` to `z.enum(expectedCorpusIds)` and updated existing tests that deliberately construct invalid owner fixtures to use explicit casts.
- **Files modified:** site/src/data/corpus.schema.ts, site/src/data/book-spine.test.ts, site/src/scripts/validate-formal-registry.test.ts
- **Commit:** 50fa69a

**3. [Rule 3 - Blocking] Exported Astro route helpers used during prerender**
- **Found during:** Task 2 build
- **Issue:** Astro prerender chunking dropped non-exported helpers/constants referenced by `getStaticPaths()` and render closures, causing runtime `ReferenceError` failures for `getChapterByOwner`, lookup maps, repository URL helpers, and source tier labels.
- **Fix:** Exported the route helper functions/constants from `site/src/pages/corpus/[slug].astro` so static generation preserves them.
- **Files modified:** site/src/pages/corpus/[slug].astro
- **Commit:** 50fa69a

## Known Stubs

| File | Line/Area | Reason |
|------|-----------|--------|
| site/src/data/chapters.ts | Plan 03-01 minimal owner records rendered by the corpus route | Intentional upstream phase seed: non-umbrella owners are visibly labeled `Incomplete/minimal curation status` and are scheduled for later Phase 3 enrichment. This does not block Plan 03-02 because the plan explicitly requires minimal owners to render as incomplete while preserving strict schema-valid source trails. |
| site/src/data/formal-registry.ts | `*.chapter-seed` minimal formal objects | Intentional upstream phase seed for all twelve pillar owners until later enrichment plans replace provisional formal objects. |
| site/src/data/concepts.ts | `*-framework` minimal concept cards | Intentional upstream phase seed for all twelve pillar owners until later enrichment plans replace provisional concept cards. |

## Threat Flags

None. Changes remain static-rendered Astro pages/components, do not add network endpoints, hosted services, runtime fetches, auth paths, file write surfaces, or new dependencies.

## TDD Gate Compliance

- RED commit present: 5a39906 `test(03-02): add failing registry component contract`
- GREEN commit present after RED: 138ba11 `feat(03-02): render formal registry components`

## Self-Check: PASSED

Checked created/modified file presence and commit presence before writing this summary:

- FOUND: site/src/components/formal/TheoremBlock.astro
- FOUND: site/src/components/formal/FormalObjectList.astro
- FOUND: site/src/components/formal/ConceptCard.astro
- FOUND: site/src/components/formal/SourceTrail.astro
- FOUND: site/src/components/formal/formal-components.test.ts
- FOUND: site/src/pages/corpus/[slug].astro
- FOUND: site/src/pages/formal-registry/index.astro
- FOUND: site/src/pages/glossary/index.astro
- FOUND: site/src/styles/atlas.css
- FOUND: site/src/data/corpus.schema.ts
- FOUND: site/src/data/book-spine.test.ts
- FOUND: site/src/scripts/validate-formal-registry.test.ts
- FOUND: 5a39906
- FOUND: 138ba11
- FOUND: 50fa69a
