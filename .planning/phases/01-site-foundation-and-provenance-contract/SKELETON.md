# Walking Skeleton — Harness Architecture Book Wiki

**Phase:** 1
**Generated:** 2026-05-14

## Capability Proven End-to-End

A builder can run `bun run build` inside `site/` and get validated static HTML plus local index artifacts generated from a typed inventory of the umbrella framework and all twelve pillars, with canonical corpus files treated as read-only inputs.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Astro 6.3.2 with Starlight 0.39.2 | Matches D-05 and provides a static documentation/book baseline without custom routing or server runtime. |
| Package manager | Bun 1.3.12 scoped to `site/` | Matches D-06 and keeps all application/package files out of the repository root per D-01. |
| Data layer | Explicit TypeScript inventory in `site/src/data/corpus.ts` validated by Zod schema in `site/src/data/corpus.schema.ts` | Matches D-10/D-12 and makes provenance metadata executable instead of inferred from filesystem scans. |
| Auth | None | Phase 1 is a public static research site foundation with no accounts, sessions, CMS, or server-side database per FOUND-02. |
| Search/index baseline | Pagefind over built static HTML plus generated `dist/corpus-index.json` | Satisfies FOUND-07 local index output while leaving search UX and rich search quality to Phase 4. |
| Math rendering | Build-time `remark-math` + `rehype-katex` + local KaTeX CSS import | Matches D-08 and prevents runtime-only math rendering from becoming the foundation. |
| Deployment target | Local static output only through `site/dist/` | Matches D-03; hosting and release deployment are deferred to Phase 5. |
| Directory layout | All site code and package files under top-level `site/`; canonical corpus remains under `science/` and `pillars/` | Enforces D-01/D-02 and avoids root package sprawl or `docs/`-hosted app files. |

## Stack Touched in Phase 1

- [x] Project scaffold (framework, build, lint/check, test runner)
- [x] Routing — foundation landing route and `/inventory/`
- [x] Data — typed read-only corpus inventory and generated local JSON index
- [x] UI — static landing CTA and inventory page rendered from real inventory entries
- [x] Deployment — documented local full-stack static run command: `cd site && bun run build`

## Out of Scope (Deferred to Later Slices)

- Full reader-facing book shell, chapter prose layout, sidebar spine, previous/next chapter navigation, and polished book design beyond Phase 1 UI tokens.
- Full formal object registry, stable section anchors, theorem/definition anchors, derivation walkthrough pages, and citation rendering beyond proving build-time math support.
- Search UX, representative query quality checks, graph-style exploration, typed relationship browsing, and runtime graph visualization.
- Hosting configuration, deployment-specific wiring, analytics, accounts, CMS integration, server runtime, and database setup.
- Moving, rewriting, replacing, or taking ownership of `science/` or `pillars/` canonical files.

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: Readers can use the book shell, navigation, source-link treatment, and formal reading interface on top of the validated inventory.
- Phase 3: Researchers can read curated umbrella and twelve-pillar chapters with formal objects, derivations, citations, glossary, and source trails.
- Phase 4: Researchers can search and traverse pages, formal objects, citations, concepts, reading paths, and generated relationship metadata through static local discovery.
- Phase 5: Builders can publish from a clean checkout with release-grade validation, accessibility, math, print styling, and deployable static output.
