# Phase 04: Local Discovery and Cross-Corpus Exploration - Research

**Researched:** 2026-05-20
**Domain:** Static Astro/Starlight discovery, Pagefind local search, typed relationship metadata, static graph artifacts
**Confidence:** HIGH for existing stack and Pagefind/Astro mechanics; MEDIUM for graph rendering format because exact artifact format remains an implementation choice

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
## Implementation Decisions

### Reading Paths
- **D-01:** Each required reading path should primarily feel like a route map, consistent with the Phase 2 scholarly-atlas identity, rather than a plain essay or compact index.
- **D-02:** Reading paths should be branching maps instead of a single fixed sequence, so researchers can traverse a theme through multiple route branches while still seeing a coherent map.
- **D-03:** Each node/stop in a reading-path map should expose lightweight guidance by default: why the stop matters and a direct link to the relevant chapter, concept, formal object, citation, or anchor.
- **D-04:** Reading paths should be authored as curated structured data, not generated first from relationship metadata. The planner should preserve editorial intent for the five required paths: building a harness, scaling multi-agent work, cost/latency, production hardening, and AI code degradation.

### Search Behavior
- **D-05:** Local search should optimize for balanced discovery across pages, pillar names, formal objects, glossary/concepts, citations, and reading paths, rather than prioritizing only exact formal lookup or only broad concept exploration.
- **D-06:** Search results should be grouped by result type, such as Pages, Formal Objects, Concepts, Citations, and Reading Paths, so researchers can distinguish what kind of object they found.
- **D-07:** Formal-object search hits should show the object type, stable ID or title, owner chapter/pillar context, matched snippet, and direct anchor link before the user clicks.
- **D-08:** Search quality checks should assert expected pages or formal-object anchors for representative queries across required result classes, not merely that some result appears.

### Related-Link Semantics
- **D-09:** Phase 4 should support a full relationship taxonomy spanning conceptual, source/provenance, and learning-path relationships.
- **D-10:** The taxonomy should be extensible rather than a permanently closed set. Start with a defined set of relation records/types, but allow downstream authors to add new relation labels when validated and documented.
- **D-11:** Related links should appear as typed sections on chapter and formal-object pages, using readable labels such as builds on, contrasts with, cited by, next readings, or similar labels from the relation taxonomy.
- **D-12:** Relationship metadata validation should cover relation type definitions, source IDs, target IDs, directionality, and display labels. It should fail for invalid targets or malformed relation type records.

### Graph Context View
- **D-13:** Graph-style context should expose both local neighborhoods and a high-level global overview in v1, while remaining static and metadata-driven.
- **D-14:** Graph surfaces should be static generated pages/diagrams or HTML with clickable nodes and links. Do not introduce a runtime graph database or heavyweight client graph engine.
- **D-15:** Local graph neighborhoods should emphasize path discovery: what a reader can visit next and how nearby concepts/formal objects connect to route-map branches, rather than presenting a dense schema visualization.
- **D-16:** Graph validation should guarantee node IDs, relation targets/types, required node labels, and renderability of generated graph artifacts/pages.

### Claude's Discretion
- No selected area was delegated to Claude discretion. Planner may choose implementation mechanics, exact component boundaries, and graph artifact format, but the product decisions above are locked.

### Deferred Ideas (OUT OF SCOPE)
## Deferred Ideas

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BOOK-04 | User can browse dedicated reading paths for building a harness, scaling multi-agent work, cost/latency, production hardening, and AI code degradation. | Use curated `reading-paths.ts` data and Astro static routes/components for branching route maps. [VERIFIED: CONTEXT.md][CITED: https://docs.astro.build/en/reference/routing-reference/] |
| DISC-01 | User can run local static search without a hosted search service. | Keep Pagefind as the local static search engine already wired in `site/package.json` build/index scripts. [VERIFIED: codebase+npm registry][CITED: https://pagefind.app/docs/] |
| DISC-02 | Search indexes pages, pillar names, definitions, theorem-like statements, glossary entries, citations, and reading paths. | Generate dedicated searchable pages/anchor surfaces plus enriched static JSON indexes from existing corpus, formal, concept, citation, and reading-path registries. [VERIFIED: codebase][CITED: https://pagefind.app/docs/indexing/] |
| DISC-03 | Search results deep-link to stable anchors for formal objects rather than only to page tops. | Pagefind API result data includes `sub_results`, and documented sub-results can include anchor-scoped URLs such as `/#id-of-the-h2`; Phase 4 should expose formal-object anchor pages/sections so Pagefind has anchor targets. [CITED: https://pagefind.app/docs/api/] |
| DISC-04 | User can navigate typed related links between pillars, concepts, definitions, theorem-like claims, and citations. | Add relation taxonomy and relation records validated against existing owner/formal/concept/citation IDs, then render typed related sections on chapter/formal pages. [VERIFIED: codebase][VERIFIED: CONTEXT.md] |
| DISC-05 | User can view graph-style local context or generated relationship data without requiring a runtime graph database. | Generate static Astro graph overview/neighborhood pages and JSON artifacts at build time; no server/database is needed for Astro SSG routes/endpoints. [CITED: https://docs.astro.build/en/guides/endpoints/][CITED: https://docs.astro.build/en/reference/routing-reference/] |
| DISC-06 | Graph/link metadata validates relation types and target IDs at build time. | Extend the existing Zod schema plus `validate-formal-registry.ts` hard-fail pattern for relation types, node IDs, labels, and generated artifact checks. [VERIFIED: codebase][CITED: https://zod.dev/] |
| QUAL-03 | Search quality checks verify representative queries return expected pages or formal-object anchors. | Add Vitest fixtures for generated search documents/index entries and, where practical, build-level Pagefind fixture checks against expected URL fragments. [VERIFIED: codebase][CITED: https://pagefind.app/docs/api/] |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- Site content must remain source-grounded in `science/paper/` and `pillars/*/paper/`, and website pages must link back to those canonical sources. [VERIFIED: CLAUDE.md]
- v1 must include the umbrella paper and all twelve pillars, so Phase 4 discovery must cover all 13 owners rather than a one-pillar demo. [VERIFIED: CLAUDE.md][VERIFIED: REQUIREMENTS.md]
- v1 remains static, with no server runtime, hosted search service, database, CMS, accounts, or hosted search dependency. [VERIFIED: CLAUDE.md][VERIFIED: REQUIREMENTS.md]
- Navigation must support both book-chapter reading and wiki/graph-style exploration. [VERIFIED: CLAUDE.md]
- Local/static search is required for v1. [VERIFIED: CLAUDE.md][VERIFIED: REQUIREMENTS.md]
- The visual identity should remain original and book-like, not a close clone of another research lab. [VERIFIED: CLAUDE.md]
- Do not treat `archive/` material as active source unless provenance is explicitly relevant. [VERIFIED: CLAUDE.md]
- Implementation work belongs under `site/`; canonical `science/` and `pillars/` files are read-only inputs for this phase. [VERIFIED: CONTEXT.md][VERIFIED: codebase]
- Use the existing TypeScript strict-mode, 2-space, semicolon, single-quote style in site code. [VERIFIED: CLAUDE.md]
- Prefer small focused modules and plain object/array payloads for testable TypeScript data. [VERIFIED: CLAUDE.md]
- Use `try/catch` around CLI/build boundaries and print CLI errors to stderr with non-zero exits on failure. [VERIFIED: CLAUDE.md][VERIFIED: codebase]

## Summary

Phase 4 should extend the completed Phase 3 registry-first architecture instead of replacing it: the existing `corpus.ts`, `chapters.ts`, `formal-registry.ts`, `concepts.ts`, and validation scripts already provide the stable IDs and canonical source trails needed for search, typed relations, reading paths, and graph neighborhoods. [VERIFIED: codebase] The standard implementation path is to add curated structured data for reading paths and relations, render static Astro pages/components from that data, expand generated local JSON indexes, and keep Pagefind as the static search engine already present in `site/package.json`. [VERIFIED: codebase][CITED: https://docs.astro.build/en/reference/routing-reference/][CITED: https://pagefind.app/docs/]

The most important planning constraint is that discovery surfaces must be vertical slices: each path/search/related-link/graph task should ship data, rendering, validation, and representative tests for one or more user-visible discovery behaviors. [VERIFIED: CONTEXT.md] Horizontal-only tasks such as “define all graph data” without a rendered neighborhood or validation fixture will leave the phase hard to verify against BOOK-04 and DISC-01 through DISC-06. [ASSUMED]

**Primary recommendation:** Use Pagefind for static full-text search, custom Astro-rendered discovery pages for grouped/typed result affordances, Zod-validated `relations.ts` and `reading-paths.ts` registries, and generated static JSON/HTML graph artifacts; do not add a runtime graph engine, hosted search, or database. [VERIFIED: codebase][VERIFIED: CONTEXT.md][CITED: https://pagefind.app/docs/][CITED: https://zod.dev/]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Reading path data | Static data/build tier | Browser / Client | Curated route maps should be authored as structured data and rendered into static pages; browser only handles navigation and disclosure behavior. [VERIFIED: CONTEXT.md][CITED: https://docs.astro.build/en/reference/routing-reference/] |
| Reading path UI | Static Astro pages/components | Browser / Client | Astro can prerender routes from data, while semantic HTML/CSS preserves accessibility and Phase 2 atlas identity. [CITED: https://docs.astro.build/en/reference/routing-reference/][VERIFIED: codebase] |
| Local search index | Static build tier | Browser / Client | Pagefind runs after the static Astro build and emits a static search bundle; the browser loads/query results without a hosted service. [CITED: https://pagefind.app/docs/] |
| Grouped search UX | Browser / Client | Static build tier | Pagefind’s browser API supports custom search interfaces; build-time metadata/filter fields should supply result type and owner context. [CITED: https://pagefind.app/docs/api/][CITED: https://pagefind.app/docs/metadata/] |
| Typed relationship metadata | Static data/build tier | — | Relation records and relation-type records should be validated before build output is trusted. [VERIFIED: CONTEXT.md][CITED: https://zod.dev/] |
| Related-link rendering | Static Astro pages/components | Browser / Client | Chapter/formal pages can render typed sections directly from validated records, with no runtime API. [VERIFIED: codebase][CITED: https://docs.astro.build/en/reference/routing-reference/] |
| Graph overview/neighborhoods | Static build tier | Browser / Client | Static pages or JSON artifacts meet the v1 graph requirement without a runtime graph database or heavyweight client graph engine. [VERIFIED: CONTEXT.md][CITED: https://docs.astro.build/en/guides/endpoints/] |
| Search quality validation | Test/build tier | Static build tier | Representative queries/fixtures should fail CI/build checks when expected pages or anchor targets disappear. [VERIFIED: CONTEXT.md][VERIFIED: codebase] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` [VERIFIED: codebase+npm registry] | installed `^6.3.2`; registry latest `6.3.6`; modified 2026-05-20 [VERIFIED: npm registry] | Static site generation, dynamic prerendered routes, and build-time endpoints. [CITED: https://docs.astro.build/en/reference/routing-reference/][CITED: https://docs.astro.build/en/guides/endpoints/] | Existing site foundation already uses Astro with `output: 'static'`; Phase 4 needs more generated static pages/data, not a new app framework. [VERIFIED: codebase] |
| `@astrojs/starlight` [VERIFIED: codebase+npm registry] | installed/latest `^0.39.2`; modified 2026-05-08 [VERIFIED: npm registry] | Documentation/book shell integration. [VERIFIED: codebase+npm registry] | Existing book/wiki site already uses Starlight sidebar wiring; Phase 4 discovery should complement the book spine rather than replace it. [VERIFIED: codebase][VERIFIED: CONTEXT.md] |
| `pagefind` [VERIFIED: official docs+npm registry] | installed/latest `^1.5.2`; modified 2026-04-12 [VERIFIED: npm registry] | Static local full-text search bundle and browser API. [CITED: https://pagefind.app/docs/][CITED: https://pagefind.app/docs/api/] | Pagefind is already in `site/package.json`, runs after `astro build`, and is designed to be baked into static sites without a server component. [VERIFIED: codebase][CITED: https://pagefind.app/docs/] |
| `zod` [VERIFIED: official docs+npm registry] | installed/latest `^4.4.3`; modified 2026-05-04 [VERIFIED: npm registry] | TypeScript-first schema validation with static type inference. [CITED: https://zod.dev/] | Existing Phase 3 schemas use Zod; relation and graph records should extend that validation style. [VERIFIED: codebase] |
| `vitest` [WARNING: slopcheck flagged as suspicious — verify before using.] | installed `^4.1.6`; registry latest `4.1.7`; modified 2026-05-20 [VERIFIED: npm registry] | Unit tests for data builders, validators, and generated index functions. [VERIFIED: codebase+npm registry] | Existing site tests already use Vitest for data/scripts/components, so Phase 4 should add tests there rather than introduce another runner. [VERIFIED: codebase] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `katex`, `remark-math`, `rehype-katex` [VERIFIED: codebase+npm registry] | `katex ^0.16.46`, `remark-math ^6.0.0`, `rehype-katex ^7.0.1` [VERIFIED: codebase] | Existing math rendering pipeline. [VERIFIED: codebase] | Preserve existing math behavior when new discovery pages display formal snippets or theorem statements. [VERIFIED: codebase] |
| Astro static endpoints [CITED: https://docs.astro.build/en/guides/endpoints/] | Framework feature | Generate static JSON artifacts such as `relations.json`, `graph-index.json`, or `search-fixtures.json`. [CITED: https://docs.astro.build/en/guides/endpoints/] | Use for machine-readable graph/search data instead of filesystem writes when the artifact should be routed as a public static URL. [CITED: https://docs.astro.build/en/guides/endpoints/] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pagefind custom browser API | Pagefind Component UI | Component UI is faster to add, but locked D-06/D-07 require grouped result types and formal-object context; Pagefind API gives more control. [CITED: https://pagefind.app/docs/ui/][VERIFIED: CONTEXT.md] |
| Static HTML/SVG graph pages | Heavy client graph library | Heavy graph engines contradict D-14 and risk dense “hairball” visuals; static artifacts are enough for v1 neighborhoods and overview. [VERIFIED: CONTEXT.md] |
| Build-time Zod validation | Runtime-only checks in components | Runtime-only checks would allow invalid relation metadata into generated pages; build-time validation matches existing hard-fail validator style. [VERIFIED: codebase][CITED: https://zod.dev/] |
| Curated reading-path data | Auto-generated paths from relation graph | D-04 explicitly locks curated reading paths to preserve editorial intent. [VERIFIED: CONTEXT.md] |

**Installation:** No new package installation is recommended for Phase 4; use the existing site dependencies. [VERIFIED: codebase]

```bash
cd site
bun install --frozen-lockfile
```

**Version verification:** Verified with `npm view pagefind`, `npm view astro`, `npm view @astrojs/starlight`, `npm view zod`, and `npm view vitest` on 2026-05-20. [VERIFIED: npm registry]

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `pagefind` | npm | Existing package; registry modified 2026-04-12 [VERIFIED: npm registry] | Not collected [ASSUMED] | `github.com/Pagefind/pagefind` [VERIFIED: npm registry] | OK [VERIFIED: slopcheck] | Approved; already installed in `site/package.json`. [VERIFIED: codebase] |
| `astro` | npm | Existing package; registry modified 2026-05-20 [VERIFIED: npm registry] | Not collected [ASSUMED] | `github.com/withastro/astro` [VERIFIED: npm registry] | OK [VERIFIED: slopcheck] | Approved; already installed in `site/package.json`. [VERIFIED: codebase] |
| `@astrojs/starlight` | npm | Existing package; registry modified 2026-05-08 [VERIFIED: npm registry] | Not collected [ASSUMED] | `github.com/withastro/starlight` [VERIFIED: npm registry] | OK [VERIFIED: slopcheck] | Approved; already installed in `site/package.json`. [VERIFIED: codebase] |
| `zod` | npm | Existing package; registry modified 2026-05-04 [VERIFIED: npm registry] | Not collected [ASSUMED] | `github.com/colinhacks/zod` [VERIFIED: npm registry] | OK [VERIFIED: slopcheck] | Approved; already installed in `site/package.json`. [VERIFIED: codebase] |
| `vitest` | npm | Existing package; registry modified 2026-05-20 [VERIFIED: npm registry] | Not collected [ASSUMED] | `github.com/vitest-dev/vitest` [VERIFIED: npm registry] | SUS: “Suspiciously close to 'vite'” [VERIFIED: slopcheck] | Keep because it is an existing project devDependency and existing tests use it; planner should not add a new install, but should add a human-verify checkpoint if changing test dependencies. [VERIFIED: codebase][VERIFIED: slopcheck] |

**Packages removed due to slopcheck [SLOP] verdict:** none. [VERIFIED: slopcheck]
**Packages flagged as suspicious [SUS]:** `vitest` only. [VERIFIED: slopcheck]
**Postinstall scripts:** `npm view <pkg> scripts.postinstall` returned no postinstall script output for the audited packages. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```text
Curated Phase 3 registries
(corpus, chapters, formal objects, concepts, citations)
        |
        v
Phase 4 curated data
(reading paths, relation types, relation records)
        |
        v
Build-time validation gate
(Zod schema shape + source/target/type/label/renderability checks)
        | pass
        v
Static generation
        |--------------------|---------------------|--------------------|
        v                    v                     v                    v
Reading path pages      Related-link sections  Graph pages/JSON     Search documents/metadata
        |                    |                     |                    |
        |                    |                     |                    v
        |                    |                     |              Astro build output
        |                    |                     |                    |
        |                    |                     |                    v
        |                    |                     |              Pagefind indexing
        |                    |                     |                    |
        v                    v                     v                    v
Reader follows route    Reader jumps across    Reader views static  Reader searches locally
map branches            typed relations        neighborhood/global  and opens page/anchor
```

This diagram uses build-time data flow because Phase 4 discovery must stay static and metadata-driven. [VERIFIED: CONTEXT.md]

### Recommended Project Structure

```text
site/src/
├── data/
│   ├── discovery.schema.ts       # Zod schemas for reading paths, relation types, graph/search records [VERIFIED: codebase pattern]
│   ├── reading-paths.ts          # Curated five required route maps [VERIFIED: CONTEXT.md]
│   └── relations.ts              # Extensible typed relation taxonomy and relation records [VERIFIED: CONTEXT.md]
├── components/discovery/
│   ├── ReadingPathMap.astro      # Branching route-map rendering [ASSUMED]
│   ├── RelatedLinks.astro        # Typed related-link sections [ASSUMED]
│   ├── GraphNeighborhood.astro   # Static local neighborhood visualization/list [ASSUMED]
│   └── SearchPanel.astro         # Custom grouped Pagefind search UI [ASSUMED]
├── pages/
│   ├── reading-paths/[slug].astro # Static pages for route maps [CITED: https://docs.astro.build/en/reference/routing-reference/]
│   ├── graph/index.astro          # Global overview [VERIFIED: CONTEXT.md]
│   ├── graph/[id].astro           # Local neighborhoods [VERIFIED: CONTEXT.md]
│   └── search.astro               # Local grouped search interface [ASSUMED]
└── scripts/
    ├── validate-discovery.ts      # Hard-fail validation for paths/relations/graph/search fixtures [VERIFIED: codebase pattern]
    └── generate-local-indexes.ts  # Expand existing static JSON index writer [VERIFIED: codebase]
```

### Pattern 1: Registry-First Discovery Data

**What:** Define relation types, relation records, reading paths, and graph/search projections as typed data derived from existing owner/formal/concept/citation IDs. [VERIFIED: codebase][VERIFIED: CONTEXT.md]

**When to use:** Use for every Phase 4 artifact that references a chapter, pillar, concept, formal object, citation, or reading-path stop. [VERIFIED: CONTEXT.md]

**Example:**

```typescript
// Source: existing Zod schema style in site/src/data/formal-registry.schema.ts and Zod docs https://zod.dev/
export const relationTypeSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  label: z.string().trim().min(1),
  category: z.enum(['conceptual', 'source-provenance', 'learning-path']),
  directed: z.boolean(),
});
```

### Pattern 2: Custom Pagefind Search UI Over Static Metadata

**What:** Use Pagefind’s browser API to query the generated static index, load result data lazily, group results by custom metadata/result type, and render formal-object context and sub-result anchors. [CITED: https://pagefind.app/docs/api/][CITED: https://pagefind.app/docs/metadata/]

**When to use:** Use for D-06/D-07 grouped search results because the default UI is less suited to custom per-result formal metadata. [VERIFIED: CONTEXT.md][CITED: https://pagefind.app/docs/ui/]

**Example:**

```typescript
// Source: Pagefind JS API docs https://pagefind.app/docs/api/
const pagefind = await import('/pagefind/pagefind.js');
const search = await pagefind.search(term, { filters: { type: selectedTypes } });
const loaded = await Promise.all(search.results.slice(0, 20).map((result) => result.data()));
```

### Pattern 3: Static Route Generation for Path and Graph Pages

**What:** Use Astro dynamic routes with `getStaticPaths()` to generate one page per reading path and one page per graph neighborhood from validated data. [CITED: https://docs.astro.build/en/reference/routing-reference/]

**When to use:** Use when a discovery artifact needs a stable public URL, deep links, and Pagefind indexing. [CITED: https://docs.astro.build/en/reference/routing-reference/][CITED: https://pagefind.app/docs/indexing/]

**Example:**

```typescript
// Source: Astro routing docs https://docs.astro.build/en/reference/routing-reference/
export function getStaticPaths() {
  return readingPaths.map((path) => ({
    params: { slug: path.slug },
    props: { path },
  }));
}
```

### Anti-Patterns to Avoid

- **Generating reading paths entirely from graph edges:** This violates D-04; route maps need curated editorial intent. [VERIFIED: CONTEXT.md]
- **Treating Pagefind as the only discovery index:** Pagefind handles text search, but relation/graph/search-quality validation needs explicit typed JSON/data fixtures. [CITED: https://pagefind.app/docs/api/][VERIFIED: CONTEXT.md]
- **Adding a graph database or heavy graph client:** D-14 forbids a runtime graph database or heavyweight client graph engine for v1. [VERIFIED: CONTEXT.md]
- **Using opaque relation labels without a type registry:** D-12 requires relation type definitions, display labels, target checks, and directionality validation. [VERIFIED: CONTEXT.md]
- **Indexing only page tops:** DISC-03 requires anchor-level formal-object hits; formal blocks must remain stable anchor targets and search results should surface sub-results/anchors where possible. [VERIFIED: REQUIREMENTS.md][CITED: https://pagefind.app/docs/api/]
- **Letting generated artifacts escape `site/`:** Existing `generate-local-indexes.ts` refuses output paths outside `site/`; keep this guard for new JSON outputs. [VERIFIED: codebase]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Static full-text search indexing | A custom inverted index/tokenizer/ranker | Pagefind | Pagefind already generates a static search bundle, has browser API search, filters, metadata, ranking controls, and sub-results. [CITED: https://pagefind.app/docs/][CITED: https://pagefind.app/docs/api/][CITED: https://pagefind.app/docs/ranking/] |
| Schema validation | Ad hoc `if` chains scattered across render components | Zod schemas plus one validator script | Existing registry validation is centralized and hard-fails with structured errors; Zod gives schema validation and static type inference. [VERIFIED: codebase][CITED: https://zod.dev/] |
| Static JSON generation | Runtime API server | Astro static endpoints or existing `generate-local-indexes.ts` | Astro endpoints are called at build time to produce static files; existing script already writes `dist/corpus-index.json`. [CITED: https://docs.astro.build/en/guides/endpoints/][VERIFIED: codebase] |
| Graph persistence/querying | Neo4j/SQLite/runtime graph service | Validated TypeScript data plus generated static JSON/pages | Phase 4 explicitly requires graph-style context without a runtime graph database. [VERIFIED: REQUIREMENTS.md][VERIFIED: CONTEXT.md] |
| Route/page generation | Manual duplicated HTML files | Astro `getStaticPaths()` | Astro dynamic routes prerender multiple pages from data and pass props into pages. [CITED: https://docs.astro.build/en/reference/routing-reference/] |

**Key insight:** This phase is a metadata integrity problem plus static rendering problem; custom runtime infrastructure would create more failure modes than value for v1. [VERIFIED: CONTEXT.md][ASSUMED]

## Common Pitfalls

### Pitfall 1: Pagefind body scoping silently excludes pages

**What goes wrong:** If any page uses `data-pagefind-body`, pages without that attribute are not indexed. [CITED: https://pagefind.app/docs/indexing/]
**Why it happens:** Pagefind narrows indexing to elements marked with `data-pagefind-body` once that pattern is used. [CITED: https://pagefind.app/docs/indexing/]
**How to avoid:** Ensure new reading-path/searchable graph pages include appropriate `data-pagefind-body`, or deliberately exclude pages with an explicit test. [CITED: https://pagefind.app/docs/indexing/]
**Warning signs:** A built page exists but never appears in Pagefind results. [ASSUMED]

### Pitfall 2: Formal-object hits collapse to chapter tops

**What goes wrong:** Search returns only `/corpus/<slug>/` instead of `#formal-object-id` anchors. [VERIFIED: REQUIREMENTS.md]
**Why it happens:** Pagefind indexes page content and can expose sub-results/anchor URLs, but stable anchorable headings/sections must exist and searchable content must be near them. [CITED: https://pagefind.app/docs/api/]
**How to avoid:** Render formal-object search surfaces with anchor IDs and metadata; validate representative queries against expected `url` or `sub_results.url` fragments. [CITED: https://pagefind.app/docs/api/][VERIFIED: CONTEXT.md]
**Warning signs:** QUAL-03 checks pass only because “some result” appears, not because the expected anchor appears. [VERIFIED: CONTEXT.md]

### Pitfall 3: Relation taxonomy grows without validation

**What goes wrong:** New relation labels appear in data but are not documented, directional, displayable, or target-valid. [VERIFIED: CONTEXT.md]
**Why it happens:** Extensible taxonomy can degrade into arbitrary strings if relation-type records are not required. [ASSUMED]
**How to avoid:** Validate relation records against a relation-type registry containing ID, category, display label, directionality, and allowed source/target families. [VERIFIED: CONTEXT.md]
**Warning signs:** Related-link sections show raw IDs or invalid links. [ASSUMED]

### Pitfall 4: Graph overview becomes a dense hairball

**What goes wrong:** Global graph view tries to show every formal object/concept/citation edge at once and stops helping readers. [VERIFIED: CONTEXT.md]
**Why it happens:** DISC-05 asks for graph-style context, but D-15 narrows local neighborhoods toward path discovery rather than schema visualization. [VERIFIED: CONTEXT.md]
**How to avoid:** Use a high-level global overview and local neighborhoods scoped by current page/path/concept; show typed next hops rather than all edges. [VERIFIED: CONTEXT.md]
**Warning signs:** The diagram is visually dense, low-contrast, or not keyboard/link navigable. [ASSUMED]

### Pitfall 5: Search quality tests depend on Pagefind internals too early

**What goes wrong:** Tests become brittle if they assert internal binary/index files instead of expected public search behavior or generated search documents. [ASSUMED]
**Why it happens:** Pagefind result loading is asynchronous and generated after site build; pure unit tests are better for deterministic data projections. [CITED: https://pagefind.app/docs/api/]
**How to avoid:** Split validation into deterministic Vitest checks for generated search records and a smaller build-level fixture check for representative Pagefind queries when the dist bundle exists. [VERIFIED: codebase][ASSUMED]
**Warning signs:** Unit tests require a full `astro build && pagefind` cycle for every small data edit. [ASSUMED]

## Code Examples

### Pagefind custom search with sub-result anchors

```typescript
// Source: Pagefind JS API docs https://pagefind.app/docs/api/
const pagefind = await import('/pagefind/pagefind.js');
const search = await pagefind.search(query);
const firstPage = await Promise.all(search.results.slice(0, 10).map((result) => result.data()));
const anchors = firstPage.flatMap((result) => result.sub_results ?? []);
```

### Astro static endpoint for generated graph data

```typescript
// Source: Astro endpoint docs https://docs.astro.build/en/guides/endpoints/
export function GET() {
  return new Response(JSON.stringify(graphIndex), {
    headers: { 'content-type': 'application/json' },
  });
}
```

### Astro static route for graph neighborhoods

```typescript
// Source: Astro routing docs https://docs.astro.build/en/reference/routing-reference/
export function getStaticPaths() {
  return graphNeighborhoods.map((neighborhood) => ({
    params: { id: neighborhood.id },
    props: { neighborhood },
  }));
}
```

### Zod schema validation for relation records

```typescript
// Source: Zod docs https://zod.dev/ and existing formal-registry.schema.ts pattern
export const relationRecordSchema = z.object({
  id: z.string().trim().min(1),
  typeId: relationTypeIdSchema,
  sourceId: discoveryNodeIdSchema,
  targetId: discoveryNodeIdSchema,
  rationale: z.string().trim().min(1),
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pagefind Default UI | Pagefind Component UI and browser API for custom interfaces | Pagefind docs state 1.5.0 introduced Component UI replacing Default UI. [CITED: https://pagefind.app/docs/ui/] | Use the browser API for custom grouped results; do not assume old default UI is the best integration point. [CITED: https://pagefind.app/docs/api/] |
| Runtime search service for docs | Static search bundle baked into built site | Pagefind documentation describes running after site build and baking search into a static site. [CITED: https://pagefind.app/docs/] | Meets DISC-01 without hosted search. [VERIFIED: REQUIREMENTS.md] |
| Server endpoints for JSON | Astro static endpoints called at build time | Current Astro docs describe endpoints called at build time to produce static files. [CITED: https://docs.astro.build/en/guides/endpoints/] | Supports graph/search artifacts without server runtime. [CITED: https://docs.astro.build/en/guides/endpoints/] |

**Deprecated/outdated:**
- Treating search as only page-level text lookup is insufficient for Phase 4 because DISC-03 requires formal-object anchor deep links. [VERIFIED: REQUIREMENTS.md]
- Treating related links as freeform prose is insufficient because DISC-06/D-12 require build-time validation of relation types and target IDs. [VERIFIED: REQUIREMENTS.md][VERIFIED: CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Vertical-slice planning is safer than horizontal-only planning for this phase. | Summary | Planner might create too many infrastructure-only tasks and delay user-visible validation. |
| A2 | Proposed component filenames under `components/discovery/` are suitable. | Recommended Project Structure | Planner may need to rename files to match implementation preferences. |
| A3 | Static HTML/SVG/list graph artifacts will satisfy user expectations for “graph-style local context.” | Standard Stack / Patterns | If users expect richer interaction, scope discussion may be needed; D-14 still forbids heavyweight graph engines. |
| A4 | Pagefind fixture tests should be split between deterministic generated data checks and smaller build-level search checks. | Common Pitfalls | Planner may choose a different test boundary if Pagefind test utilities are available. |
| A5 | Package download counts were not needed because no new package install is recommended. | Package Legitimacy Audit | If planner adds packages, a fresh audit with downloads and slopcheck is required. |

## Open Questions

1. **Should graph artifacts be rendered primarily as accessible HTML lists, inline SVG, or both?**
   - What we know: D-14 allows static generated pages/diagrams or HTML with clickable nodes and links. [VERIFIED: CONTEXT.md]
   - What's unclear: The exact artifact format is not locked. [VERIFIED: CONTEXT.md]
   - Recommendation: Plan accessible HTML neighborhoods first, with optional lightweight SVG overview only if it remains readable and testable. [ASSUMED]

2. **How many representative search queries are enough for QUAL-03?**
   - What we know: D-08 requires expected pages or formal-object anchors across required result classes. [VERIFIED: CONTEXT.md]
   - What's unclear: The exact fixture count is not specified. [VERIFIED: CONTEXT.md]
   - Recommendation: Use at least one query per required result class plus anchor-focused queries for key formal objects such as `quality.ai-code-slop`, `reliability.compound-error-bound`, and `security.prompt-injection-boundary`. [VERIFIED: codebase][ASSUMED]

3. **Should the search page use Pagefind filters or purely client-side grouping after results load?**
   - What we know: Pagefind supports filters and custom API results. [CITED: https://pagefind.app/docs/api/]
   - What's unclear: The current content metadata may need extra `data-pagefind-meta`/filter fields to make filters useful. [CITED: https://pagefind.app/docs/metadata/]
   - Recommendation: Generate/type result-category metadata first, then group client-side; add filters after metadata is validated. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Site install/scripts/tests/build | ✓ | 1.3.12 [VERIFIED: command output] | Node/npm can inspect packages, but project scripts are Bun-based. [VERIFIED: codebase] |
| Node.js | Astro/Pagefind toolchain | ✓ | v24.14.0 [VERIFIED: command output] | None needed. |
| Pagefind CLI | `bun run index` after build | ✓ via `bunx pagefind` | 1.5.2 [VERIFIED: command output] | Use `bun run index`; global CLI is not installed. [VERIFIED: command output][VERIFIED: codebase] |
| Vitest | Unit tests for validators/data/index builders | ✓ via site dependencies | 4.1.6 installed range in `package.json`; tests ran successfully. [VERIFIED: codebase][VERIFIED: command output] | None needed. |
| Astro | Static pages/endpoints | ✓ via site dependencies | `^6.3.2` installed range; registry latest 6.3.6. [VERIFIED: codebase][VERIFIED: npm registry] | None needed. |

**Missing dependencies with no fallback:** none found for Phase 4 planning. [VERIFIED: command output]

**Missing dependencies with fallback:** global `pagefind` binary is missing, but `bunx pagefind --version` works and project scripts can run local dependencies. [VERIFIED: command output][VERIFIED: codebase]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts or authentication in v1 static site. [VERIFIED: REQUIREMENTS.md] |
| V3 Session Management | no | No sessions in v1 static site. [VERIFIED: REQUIREMENTS.md] |
| V4 Access Control | no | Public static content; protect build/source discipline via validation rather than runtime authorization. [VERIFIED: REQUIREMENTS.md][ASSUMED] |
| V5 Input Validation | yes | Zod validates relation/path/graph metadata and Pagefind query strings are treated as client input. [CITED: https://zod.dev/][ASSUMED] |
| V6 Cryptography | no | No cryptographic feature planned for Phase 4. [VERIFIED: CONTEXT.md] |
| V9 Communications | no | No server communication is required for local static search. [CITED: https://pagefind.app/docs/][VERIFIED: REQUIREMENTS.md] |
| V14 Configuration | yes | Build scripts must hard-fail on invalid metadata, broken targets, archive misuse, and generated artifact problems. [VERIFIED: codebase][VERIFIED: CONTEXT.md] |

### Known Threat Patterns for Astro static discovery stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Raw Pagefind `content` or metadata rendered without escaping | XSS / Tampering | Use Pagefind `excerpt`/`plain_excerpt` as documented safe encoded fields; escape raw `content`/`meta` before rendering. [CITED: https://pagefind.app/docs/api/] |
| Broken relation targets create misleading links | Tampering / Integrity | Validate source IDs, target IDs, relation types, labels, and directionality at build time. [VERIFIED: CONTEXT.md] |
| Archive paths surfaced as active canonical sources | Integrity / Repudiation | Reuse source-trail validation that rejects archive paths as canonical unless explicitly provenance-labeled. [VERIFIED: codebase][VERIFIED: CLAUDE.md] |
| Search query fixture drift hides discovery regressions | Integrity | QUAL-03 fixture tests should assert expected pages or anchor URLs, not merely non-empty results. [VERIFIED: CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `/home/prannayag/harness_eng/CLAUDE.md` — project constraints, stack, conventions, no active archive-source discipline. [VERIFIED: file read]
- `/home/prannayag/harness_eng/.planning/phases/04-local-discovery-and-cross-corpus-exploration/04-CONTEXT.md` — locked Phase 4 product decisions. [VERIFIED: file read]
- `/home/prannayag/harness_eng/.planning/REQUIREMENTS.md` — BOOK-04, DISC-01 through DISC-06, QUAL-03. [VERIFIED: file read]
- `/home/prannayag/harness_eng/.planning/ROADMAP.md` — Phase 4 dependency and success criteria. [VERIFIED: file read]
- `/home/prannayag/harness_eng/.planning/STATE.md` — Phase 4 concern to keep graph exploration static and metadata-driven. [VERIFIED: file read]
- `/home/prannayag/harness_eng/site/package.json` — existing Astro/Starlight/Pagefind/Zod/Vitest stack and scripts. [VERIFIED: file read]
- `/home/prannayag/harness_eng/site/src/data/formal-registry.schema.ts` — existing Zod schema style and stable ID patterns. [VERIFIED: file read]
- `/home/prannayag/harness_eng/site/src/scripts/validate-formal-registry.ts` — existing hard-fail validation pattern. [VERIFIED: file read]
- `/home/prannayag/harness_eng/site/src/scripts/generate-local-indexes.ts` — existing local index generation pattern. [VERIFIED: file read]
- Pagefind docs — static indexing, API, metadata, ranking, and UI behavior. [CITED: https://pagefind.app/docs/][CITED: https://pagefind.app/docs/api/][CITED: https://pagefind.app/docs/metadata/][CITED: https://pagefind.app/docs/ranking/][CITED: https://pagefind.app/docs/ui/]
- Astro docs — static routes, `getStaticPaths()`, and static endpoints. [CITED: https://docs.astro.build/en/reference/routing-reference/][CITED: https://docs.astro.build/en/guides/endpoints/]
- Zod docs — TypeScript-first schema validation and static type inference. [CITED: https://zod.dev/]

### Secondary (MEDIUM confidence)

- `npm view` package metadata for current registry versions, repository URLs, modification dates, and postinstall checks. [VERIFIED: npm registry]
- `slopcheck install pagefind @astrojs/starlight astro zod vitest` output: Pagefind/Astro/Starlight/Zod OK and Vitest SUS due name similarity to Vite. [VERIFIED: slopcheck]
- Local command probes: Bun 1.3.12, Node v24.14.0, `bunx pagefind` 1.5.2, `bun run validate` success, relevant Vitest tests success. [VERIFIED: command output]

### Tertiary (LOW confidence)

- Component filenames and exact graph rendering format recommendations are planner-facing implementation assumptions, not locked decisions. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — existing dependencies and scripts were verified in `site/package.json`, npm registry metadata was checked, and Pagefind/Astro/Zod docs were fetched. [VERIFIED: codebase][VERIFIED: npm registry][CITED: https://pagefind.app/docs/]
- Architecture: HIGH — Phase 4 decisions require static metadata-driven search/relations/graph, and Astro/Pagefind support the needed static generation/search model. [VERIFIED: CONTEXT.md][CITED: https://docs.astro.build/en/reference/routing-reference/][CITED: https://pagefind.app/docs/]
- Pitfalls: MEDIUM — core Pagefind indexing/API pitfalls are documented, while test-boundary and graph-density pitfalls combine locked product constraints with engineering judgment. [CITED: https://pagefind.app/docs/indexing/][ASSUMED]

**Research date:** 2026-05-20
**Valid until:** 2026-06-19 for stable architecture decisions; re-check package versions/Pagefind API within 7 days before dependency changes. [ASSUMED]
