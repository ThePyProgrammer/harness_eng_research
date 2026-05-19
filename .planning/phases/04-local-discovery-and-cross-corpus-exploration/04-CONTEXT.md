# Phase 4: Local Discovery and Cross-Corpus Exploration - Context

**Gathered:** 2026-05-19T09:27:07Z
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 delivers static local discovery over the already-established book/wiki corpus: required thematic reading paths, local search over pages and formal objects, typed related links, and generated graph-style relationship views/data that validate at build time.

This phase does not create the curated umbrella/pillar chapter content, rewrite the formal registry from scratch, add runtime databases, hosted search, accounts, analytics, advanced interactive graph filtering, print styling, or release-grade clean-checkout hardening. Those belong to Phase 3, Phase 5, or v2.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning and Requirements
- `.planning/PROJECT.md` — Project purpose, core value, active constraints, and static book/wiki product direction.
- `.planning/REQUIREMENTS.md` — Phase 4 maps to BOOK-04, DISC-01 through DISC-06, and QUAL-03.
- `.planning/ROADMAP.md` — Phase 4 goal, scope boundary, success criteria, dependency on Phase 3, and Phase 5 boundary.
- `.planning/STATE.md` — Current project state and concern that Phase 4 should keep graph exploration metadata-driven and static.
- `.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md` — Locked Phase 1 decisions: `site/` boundary, Astro/Starlight baseline, Bun, static math, typed inventory, and provenance validation.
- `.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md` — Locked Phase 2 decisions: scholarly-atlas identity, conceptual book spine, source-detail pages, formal component requirements, visible source trails, and notebook-style derivations.
- `.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md` — Locked Phase 3 decisions: structured formal registry, semantic stable IDs, source tiers, glossary/concept cards, reciprocal static links, and Phase 4 boundary for graph/search.

### Current Site Foundation
- `site/package.json` — Bun scripts, Astro/Starlight, Pagefind dependency, validation/index/build commands, and local static search/index baseline.
- `site/astro.config.mjs` — Static output, Starlight integration, math pipeline, atlas CSS hook, and book sidebar wiring.
- `site/src/data/corpus.ts` — Umbrella-plus-twelve-pillar inventory with stable owner IDs, slugs, canonical source paths, PDFs, and bibliographies.
- `site/src/data/book-spine.ts` — Conceptual-arc book spine order and previous/next navigation data.
- `site/src/pages/corpus/[slug].astro` — Current corpus-backed page integration point where Phase 3 chapters and Phase 4 related-link/graph neighborhoods should connect.
- `site/src/components/SourceLinkPanel.astro` — Existing source trail and material-kind UI that Phase 4 related source/provenance links must not obscure.
- `site/src/components/BookFooterNav.astro` — Existing previous/next footer navigation that Phase 4 path discovery should complement, not replace.

### Formal Registry and Discovery Data
- `site/src/data/formal-registry.schema.ts` — Current schemas for owner IDs, formal object IDs, object kinds, source tiers, chapters, concepts, and citations; Phase 4 relation and graph data should extend this style.
- `site/src/data/formal-registry.ts` — Current formal object and citation records with semantic stable IDs and related object seeds.
- `site/src/data/concepts.ts` — Current concept registry with aliases, notation, owners, formal object links, and related concept IDs.
- `site/src/data/chapters.ts` — Current chapter registry with owner IDs, slugs, formal object IDs, concept IDs, citation IDs, and source trails.
- `site/src/scripts/validate-formal-registry.ts` — Existing strict validation pattern for schema shape, owner coverage, duplicate IDs, source trails, and targets; Phase 4 graph/relation validation should follow this hard-fail style.
- `site/src/scripts/generate-local-indexes.ts` — Current local index generation script that writes static JSON into `dist`; Phase 4 should expand the local index surface beyond the corpus inventory.

### Canonical Corpus Sources
- `science/paper/science.tex` — Canonical umbrella framework source that anchors the global graph overview and cross-pillar relationships.
- `science/paper/science.pdf` — Canonical umbrella framework PDF.
- `science/paper/science.bib` — Umbrella bibliography source for citation search/linking.
- `pillars/*/paper/*.tex` — Canonical pillar paper sources whose chapters, concepts, formal objects, and citations feed search and graph metadata.
- `pillars/*/paper/*.pdf` — Canonical pillar PDFs for source trails and citation/source result links.
- `pillars/*/paper/*.bib` — Pillar bibliography sources where present.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `site/src/data/corpus.ts`: Continue using corpus owner IDs, slugs, titles, summaries, and canonical source metadata as the base identity layer for search, paths, relation targets, and graph nodes.
- `site/src/data/book-spine.ts`: Use the conceptual book spine as a navigation backbone that reading paths and graph context complement rather than duplicate.
- `site/src/data/formal-registry.schema.ts`: Extend the existing Zod schema style for relation records, graph nodes/edges, reading-path records, and search metadata.
- `site/src/data/formal-registry.ts`, `site/src/data/concepts.ts`, and `site/src/data/chapters.ts`: Treat these registries as the first source for formal object IDs, concept IDs, chapter owners, citation IDs, and stable anchors.
- `site/src/scripts/validate-formal-registry.ts`: Reuse the strict validation pattern for relation target/type validation, graph ID checks, and expected search fixture checks.
- `site/src/scripts/generate-local-indexes.ts`: Expand local index generation from corpus-only JSON to include search, reading path, relationship, graph, and formal-object discovery artifacts.
- `site/src/pages/corpus/[slug].astro`: Natural integration point for typed related-link sections and local graph neighborhoods on chapter pages.
- `site/src/components/SourceLinkPanel.astro`: Existing source-trail treatment can inform source/provenance relationship rendering.

### Established Patterns
- Site implementation stays under `site/`; canonical `science/` and `pillars/` files remain read-only inputs.
- Static build remains the core execution model: no hosted search, database, CMS, accounts, or runtime graph service.
- Validation should hard-fail for malformed metadata, missing targets, invalid source trails, and broken generated artifacts.
- Semantic stable IDs are already owner-prefixed for formal objects and slug-like for concepts; Phase 4 should build on those IDs rather than inventing parallel identifiers.
- The Phase 2 atlas identity should remain readable and source-grounded; graph/route-map visuals must not reduce contrast, keyboard access, source clarity, or narrow-screen readability.

### Integration Points
- Add structured reading-path data for the five required paths and render it as branching route maps.
- Extend local search/index generation so pages, pillars, formal objects, glossary entries, citations, and reading paths can be searched and deep-linked.
- Add a relation taxonomy/data model that can connect pillars, concepts, formal objects, citations, chapters, and reading paths with typed links.
- Render typed related-link sections on chapter/formal-object pages without hiding visible source trails.
- Generate static local graph artifacts/pages for local neighborhoods and a high-level global overview, then validate IDs, relation types, labels, and renderability.

</code_context>

<specifics>
## Specific Ideas

- Reading paths should be branching atlas-style route maps, not essays or flat link indexes.
- Reading-path stops should keep the map lightweight: explain why the stop matters and provide a direct link.
- Required reading paths are: building a harness, scaling multi-agent work, cost/latency, production hardening, and AI code degradation.
- Search results should be grouped by type and formal-object hits should expose type, stable ID/title, owner context, snippet, and anchor link.
- Representative search tests should assert expected anchors for important queries, especially formal-object anchors.
- Relationship taxonomy should span conceptual, source/provenance, and learning relationships, while staying extensible.
- Local graph neighborhoods should emphasize path discovery, while the global overview should remain high-level enough not to become a dense object hairball.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 4-Local Discovery and Cross-Corpus Exploration*
*Context gathered: 2026-05-19T09:27:07Z*
