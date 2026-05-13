# Project Research Summary

**Project:** Harness Architecture Book Wiki
**Domain:** Static academic book/wiki website for a Markdown/LaTeX research corpus
**Researched:** 2026-05-13
**Confidence:** HIGH for stack and source-boundary recommendations; MEDIUM for graph/citation implementation detail until tested against the corpus

## Executive Summary

This project is best treated as a static academic publication layer over an existing research corpus, not as a CMS, community wiki, or app. The canonical LaTeX/Markdown corpus remains upstream in `science/paper/` and `pillars/*/paper/`; the website should add curated, web-native chapters, source trails, formal object metadata, local search, and graph-style exploration downstream.

The recommended implementation path is Astro + Starlight with Markdown/MDX, typed content collections, local Pagefind search, math rendering through a tested KaTeX/MathJax decision, and build-time validation for source paths, citations, concept IDs, graph links, and archive exclusions. Start with source inventory and a whole-corpus book spine before investing in visual polish or graph visualization.

The main risk is silent drift: curated website definitions, theorems, derivations, citations, or notation can diverge from the canonical papers. Mitigate that by making provenance a first-class data model: every formal page and formal block needs source metadata, stable IDs, visible source badges, and build-time checks that fail on missing sources or archive-as-canonical references.

## Key Findings

### Recommended Stack

Use Astro 6 + Starlight 0.39 as the static documentation/book framework. This gives a content-first static build, sidebar/book navigation, accessibility defaults, MDX support, Starlight docs UX, and built-in Pagefind integration without building a client-side app shell.

Use Markdown/MDX plus Astro content collections for curated chapters and formal objects. Content collections should validate required metadata for source files, canonical PDFs, pillars, related concepts, theorem IDs, citation keys, and graph edges. For math, start with `remark-math` + `rehype-katex`, but run real corpus fixtures early; switch to MathJax if custom macros or derivations exceed KaTeX compatibility. For citations, validate `rehype-citation`/Citation.js against the actual `.bib` files before relying on it.

**Core technologies:**
- Node.js 22.12.0+ — required baseline for current Astro versions
- pnpm 10.x — deterministic package management for the new site boundary
- Astro 6.x — static content-first site generation
- Astro Starlight 0.39.x — book/docs shell, navigation, accessibility, and Pagefind integration
- Astro content collections + Zod — typed schemas for chapters, pillars, formal objects, citations, and graph links
- Markdown + MDX — curated pages with reusable theorem, definition, source, citation, and graph components
- Pagefind 1.5.x — local static search with no hosted service or database
- `remark-math` + `rehype-katex`, with MathJax fallback if fixtures require it — math rendering
- `rehype-citation` + Citation.js — citation and bibliography rendering after corpus validation

### Expected Features

The v1 site must cover the umbrella framework and all twelve pillars, provide book-like chapter navigation, render formal definitions and theorem/proposition/lemma blocks, expose derivations where the corpus supports them, preserve source trails to canonical files, provide local static search, and normalize terminology through a glossary/concept index.

Graph-style exploration is valuable, but it should come from typed metadata and stable concept IDs rather than a decorative global hairball. Start with explicit related-concept panels and validated graph data; expose richer graph visualization only after the semantic model is stable.

**Must have (table stakes):**
- Full corpus coverage — umbrella paper plus all twelve pillars
- Book-style chapter navigation — stable reading order, sidebar, next/previous links
- Pillar landing/chapter pages — problem, model, formal objects, implications, sources
- Formal definition blocks — anchorable, source-linked, visually distinct definitions
- Theorem/proposition/lemma blocks — statements, assumptions, derivation/proof pointers, stable anchors
- Derivation sections/pages — enough detail for researcher audit where corpus supports it
- Citation rendering and bibliography pages — readable references and stable anchors
- Source trails — canonical `.tex`, `.bib`, PDF, and supporting source links
- Local static search — pages, definitions, theorem statements, glossary entries, citations, and pillars
- Glossary/concept index — normalized terminology, aliases, source ownership, related concepts
- Reading paths — intent-based routes such as production hardening, multi-agent scaling, cost/latency, and code degradation
- Responsive academic layout — typography and math readability first
- Archive/provenance distinction — archives excluded by default and labeled when referenced

**Should have (competitive):**
- Formal object registry — first-class definitions, theorems, assumptions, equations, citations, and relationships
- Claim-to-source traceability — block-level provenance for formal claims
- Notation index — symbol meanings, overloads, owning pillars, and first use
- Cross-pillar concept graph — curated typed edges after IDs are stable
- Concept relationship pages — aggregate definitions, theorem links, pillar occurrences, citations
- Cross-pillar comparison pages — synthesis across repeated patterns and metrics
- Printable/citation-friendly pages — clean print CSS, metadata, canonical URLs
- Research status badges — canonical/supporting/synthesis/review/archive state

**Defer (v2+):**
- Dynamic accounts, comments, or collaborative editing — unnecessary operational burden
- Server-side CMS/database — would create a second source of truth
- Hosted search — violates local/static preference and adds dependency
- Exact visual cloning of Thinking Machines Lab — use original identity
- Live theorem proving or symbolic checking — huge scope increase
- AI-generated ungated explanations — unacceptable source-drift risk

### Architecture Approach

Use a one-way publication pipeline: canonical corpus files feed curated site content; curated content and structured metadata feed build-time generators; generators output static HTML/CSS/JS, local search indexes, graph JSON, bibliography pages, and linked PDFs/source trails. The site should be additive under a new `site/` boundary and must not absorb or replace `science/` or `pillars/` as the source of truth.

**Major components:**
1. Canonical corpus — existing `science/paper/` and `pillars/*/paper/` source/PDF/BibTeX files
2. Supporting corpus — existing notes, research, reviews, and synthesis used as contextual inputs
3. Site content workspace — curated book, wiki, glossary, bibliography, and reading-path pages
4. Source-trail manifest — structured mappings from pages/formal objects to canonical files and PDFs
5. Concept/formal object registry — stable IDs for definitions, theorems, assumptions, metrics, and citations
6. Navigation model — explicit book order, sidebar groups, reading paths, and related links
7. Math and citation renderer — configured and tested against representative corpus fixtures
8. Search and graph indexers — build-time generation from content and metadata
9. Static renderer and visual system — original academic/book interface with theorem, source, citation, and graph components
10. Quality gates — schema, source, archive, citation, link, search, graph, and build reproducibility checks

### Critical Pitfalls

1. **Website pages become an untraceable fork of canonical papers** — require source metadata and visible source badges on every formal page/block; fail builds on missing source paths.
2. **Citation and bibliography links rot silently** — build a corpus-wide citation registry, detect unresolved/duplicate keys, and generate bibliography output from source data.
3. **Math rendering works for demos but not the corpus** — create representative math fixtures from the umbrella and pillar papers before finalizing KaTeX vs MathJax settings.
4. **Search indexes pages but not research intent** — index semantic units such as definitions, theorem statements, citations, glossary terms, and pillars with stable anchors.
5. **Graph links become decorative spaghetti** — define typed relationships and stable IDs before building graph UI.
6. **Content maintainability collapses under twelve pillars** — define a pillar page contract and coverage matrix before producing all pages.
7. **Archive material leaks into active site content** — default-deny archive paths and require explicit provenance exceptions.
8. **Visual identity damages formal readability** — design from dense math pages, not the homepage.
9. **Build reproducibility is optional** — pin packages and make one clean build command include rendering, validation, and search indexing.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Site Foundation, Source Inventory, and Provenance Contract
**Rationale:** Source boundaries must exist before content production, search, or graph work; otherwise the site forks the research corpus immediately.
**Delivers:** `site/` scaffold, package boundary, build command, corpus inventory for umbrella + twelve pillars, source-trail schema, content collection schemas, archive exclusion rules, canonical source badge, representative math/citation fixtures, and validation that source paths exist.
**Addresses:** full corpus coverage spine, source trails, stable metadata, build reproducibility, archive/provenance distinction.
**Avoids:** untraceable website fork, archive leakage, math renderer mismatch, nonreproducible builds.

### Phase 2: Book Shell, Visual System, and Formal Page Templates
**Rationale:** Researchers need a readable, original, book-like experience, but templates and formal components must come before all-pillar content scaling.
**Delivers:** Starlight/MDX book layout, homepage, sidebar/book order, overview chapter, pillar page template, theorem/definition/derivation/source/citation components, typography tokens, dense formal content styling, placeholder pages for all pillars.
**Uses:** Astro, Starlight, MDX, content collections, math renderer decision, source badge component.
**Implements:** site content workspace, navigation model, visual system, formal block semantics.

### Phase 3: All-Pillar Curated Content and Formal Object Registry
**Rationale:** The core value is all-pillar research comprehension; graph/search are weak unless the pages and stable formal objects exist.
**Delivers:** curated umbrella page and twelve pillar chapters; definitions, theorem/proposition/lemma blocks; derivation sections where supported; glossary/concept entries; notation/citation metadata; coverage matrix showing each pillar meets the formal-content contract.
**Addresses:** all-pillar coverage, formal definitions, theorem blocks, derivations, glossary/concept index, source trails.
**Avoids:** one polished pillar demo, inconsistent page structure, source drift.

### Phase 4: Local Search, Reading Paths, and Graph-Style Cross-Links
**Rationale:** Search and graph features depend on stable content, anchors, object IDs, and typed relationships created earlier.
**Delivers:** Pagefind/static search indexed by content type; query quality checks; reading paths from README themes; typed related-concept panels; generated graph JSON; optional lightweight local graph views; bibliography pages and citation backlinks.
**Uses:** Pagefind, generated indexes, concept registry, navigation data, citation registry.
**Implements:** search indexer, link graph/indexer, bibliography renderer, reading path navigation.

### Phase 5: Publication Hardening and Release QA
**Rationale:** A formal academic site is only credible if it builds cleanly, links accurately, renders math accessibly, and remains readable across devices.
**Delivers:** CI/release build, broken-link/source/citation/graph/search validation, responsive and accessibility QA, print styles, sitemap/metadata, deployment-ready static artifact, final visual polish.
**Addresses:** reproducibility, search quality, visual readability, accessibility, release confidence.
**Avoids:** broken deployed search, citation rot, math overflow, inaccessible formal pages.

### Phase Ordering Rationale

- Provenance and source validation come first because curated content without source metadata becomes unreviewable.
- The book shell and formal templates come before all-pillar production so twelve chapters share one maintainable contract.
- Content and formal object IDs come before search/graph because those features need stable anchors and semantic metadata.
- Search and graph come before final hardening so they can be tested against real corpus content.
- Visual polish is distributed but final refinement waits until dense formal pages exist; designing only from a homepage would optimize the wrong thing.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Math renderer compatibility and citation tooling need validation against real corpus `.tex` and `.bib` files.
- **Phase 2:** Accessibility and academic typography for dense theorem/derivation pages should be checked against implementation-specific Starlight customization patterns.
- **Phase 4:** Pagefind filtering/faceting and graph visualization choices may need targeted docs research once the metadata shape exists.
- **Phase 5:** Static deployment target and CI workflow should be researched once the site package boundary is chosen.

Phases with standard patterns:
- **Phase 3:** Content production follows the schema/template from Phases 1–2; research should focus on corpus content, not tooling.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Astro/Starlight/Pagefind/MDX/math recommendations were checked against current docs and package versions; citation/graph details remain MEDIUM until tested locally. |
| Features | MEDIUM | Feature set is strongly grounded in project goals and common academic/wiki patterns; external competitor crawl was not performed. |
| Architecture | HIGH | Source-boundary and build-order recommendations directly follow the repository structure and project constraints. |
| Pitfalls | HIGH | Core risks are specific to this repo: source drift, archive leakage, citation rot, math rendering, search relevance, and all-pillar maintainability. |

**Overall confidence:** HIGH for roadmap direction; MEDIUM for exact renderer/citation implementation choices until Phase 1 fixtures prove them.

### Gaps to Address

- **Math renderer choice:** Run real snippets from `science/paper/` and multiple `pillars/*/paper/` files through KaTeX/MathJax before committing.
- **Citation pipeline:** Validate corpus `.bib` files with `rehype-citation`/Citation.js and decide whether to normalize to CSL-JSON.
- **Graph relation taxonomy:** Define a small relation set before metadata production; do not infer everything from links.
- **Content coverage depth:** The corpus may not expose derivations uniformly across all pillars; mark source-supported derivations versus curated explanatory derivations clearly.
- **Deployment target:** Not yet selected; keep v1 static so any static host works.

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — stack recommendations, versions, and alternatives.
- `.planning/research/ARCHITECTURE.md` — source-boundary architecture and build order.
- `.planning/research/PITFALLS.md` — repo-specific risk analysis and mitigation.
- `.planning/PROJECT.md` — project scope, audience, constraints, and out-of-scope decisions.
- `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/STRUCTURE.md` — existing corpus layout and canonical source boundaries.
- `README.md` and `pillars/README.md` — pillar list, reading paths, and folder contract.

### Secondary (MEDIUM confidence)
- `.planning/research/FEATURES.md` — feature landscape based on project context and common academic/wiki patterns.
- Official Astro, Starlight, Pagefind, remark/rehype, KaTeX/MathJax, and citation tooling docs cited in the research files.

### Tertiary (LOW confidence)
- None used as roadmap-critical evidence; graph visualization details should be validated during Phase 4 planning.

---
*Research completed: 2026-05-13*
*Ready for roadmap: yes*
