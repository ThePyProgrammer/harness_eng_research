# Roadmap: Harness Architecture Book Wiki

## Overview

Build a static, source-grounded academic book/wiki layer over the existing harness architecture corpus. The work starts by creating a separate site boundary with reproducible static build and provenance validation, then establishes the book shell and formal page system, scales curated formal content across the umbrella framework and all twelve pillars, adds local search and graph-style exploration from stable metadata, and finishes with release-grade quality gates for accessibility, links, citations, search, graph data, and deployable static output.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Site Foundation and Provenance Contract** - Create the isolated static site workspace, corpus inventory, source metadata model, and reproducible validation baseline.
- [x] **Phase 2: Book Shell and Formal Reading Interface** - Deliver the homepage, book navigation, original visual system, and reusable formal reading components. (completed 2026-05-19)
- [ ] **Phase 3: Curated Corpus Chapters and Formal Registry** - Publish the umbrella page, all twelve pillar chapters, glossary/concept index, citations, and formal object registry.
- [ ] **Phase 4: Local Discovery and Cross-Corpus Exploration** - Add local static search, reading paths, typed related links, and generated graph-style relationship data.
- [ ] **Phase 5: Release Quality and Static Publication Readiness** - Harden validation, accessibility, math rendering, print styling, and clean-checkout static build output.

## Phase Details

### Phase 1: Site Foundation and Provenance Contract

**Goal**: The project has a separate, reproducible static site foundation that knows the corpus boundaries and rejects untraceable or archive-backed canonical content.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07
**Success Criteria** (what must be TRUE):

  1. Builder can work inside a clearly bounded static site project without moving or replacing canonical `science/` or `pillars/` corpus files.
  2. Builder can run one documented command that produces static HTML assets and local indexes without a database, CMS, accounts, server runtime, or hosted search dependency.
  3. Builder can inspect a structured inventory covering the umbrella framework and all twelve pillars with required canonical source metadata.
  4. Validation fails when required canonical source paths are missing or when archive paths are used as canonical sources without explicit provenance marking.

**Plans**: 4 plans
**UI hint**: yes

Plans:

- [x] 01-01-PLAN.md — Establish isolated Astro/Starlight site boundary, Bun scripts, static math pipeline, and foundation docs.
- [x] 01-02-PLAN.md — Define typed corpus schema and explicit umbrella-plus-twelve-pillar inventory.
- [x] 01-03-PLAN.md — Implement executable provenance validator and documented failure contract.
- [x] 01-04-PLAN.md — Render inventory page and generate local static index artifacts through the one-command build.

### Phase 2: Book Shell and Formal Reading Interface

**Goal**: Readers can use a polished, accessible, book-like interface with stable navigation and consistent visual treatment for formal academic content.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: BOOK-01, BOOK-02, BOOK-03, BOOK-05, BOOK-06, DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04
**Success Criteria** (what must be TRUE):

  1. User can open a polished homepage that introduces the harness architecture corpus and its book/wiki structure with an original visual identity.
  2. User can navigate the linear book spine from overview to umbrella framework to every pillar chapter using stable sidebar and previous/next navigation.
  3. User can access canonical PDF and source links from the umbrella page and every pillar page.
  4. User can distinguish canonical, supporting, synthesis/review, and archived/provenance material through visible interface treatment.
  5. User can read dense theorem blocks, citations, footnotes, bibliography entries, math notation, aligned equations, and derivation layouts on desktop and narrow screens with keyboard navigation, semantic headings, visible focus states, and accessible contrast.

**Plans**: TBD
**UI hint**: yes

### Phase 3: Curated Corpus Chapters and Formal Registry

**Goal**: Researchers can read the source-grounded umbrella framework and all twelve pillar chapters with consistent formal objects, derivations, citations, glossary concepts, and source trails.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: FORM-01, FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07, FORM-08, FORM-09, FORM-10
**Success Criteria** (what must be TRUE):

  1. User can read a curated umbrella framework page and curated chapter pages for all twelve pillars grounded in canonical corpus sources.
  2. Each pillar chapter presents the pillar problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, and source trail.
  3. User can deep-link to consistent anchorable definition blocks and theorem-like blocks for theorems, propositions, lemmas, assumptions, and related formal claims.
  4. User can inspect source-supported derivation walkthroughs or derivation sections and follow citations or formal blocks back to source files, PDFs, bibliography entries, and supporting source trails.
  5. User can browse a glossary/concept index and a formal object registry covering definitions, theorem-like claims, citations, and concepts with normalized terms, aliases, notation, and owning pillars.

**Plans**: 5 plans
**UI hint**: yes

Plans:
**Wave 1**

- [x] 03-01-PLAN.md — Establish registry-first formal data, umbrella seed content, and strict validation.

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03-02-PLAN.md — Render umbrella chapter, formal registry, and glossary pages from typed data.

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 03-03-PLAN.md — Curate first-batch pillar chapters across the conceptual arc.

**Wave 4** *(blocked on Wave 3 completion)*

- [ ] 03-04-PLAN.md — Curate remaining pillar chapters and close all-owner coverage.

**Wave 5** *(blocked on Wave 4 completion)*

- [ ] 03-05-PLAN.md — Harden Phase 3 requirement, rendering, and scope-boundary regression gates.

### Phase 4: Local Discovery and Cross-Corpus Exploration

**Goal**: Researchers can find and traverse pages, formal objects, citations, concepts, pillars, and reading paths through static local search and validated relationship metadata.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: BOOK-04, DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, DISC-06, QUAL-03
**Success Criteria** (what must be TRUE):

  1. User can browse dedicated reading paths for building a harness, scaling multi-agent work, cost/latency, production hardening, and AI code degradation.
  2. User can run local static search with no hosted service and receive results for pages, pillar names, definitions, theorem-like statements, glossary entries, citations, and reading paths.
  3. Search results deep-link to stable anchors for formal objects instead of only page tops, and representative queries return expected pages or formal-object anchors.
  4. User can navigate typed related links between pillars, concepts, definitions, theorem-like claims, and citations.
  5. User can view graph-style local context or generated relationship data without a runtime graph database, and build validation rejects invalid relation types or missing target IDs.

**Plans**: TBD
**UI hint**: yes

### Phase 5: Release Quality and Static Publication Readiness

**Goal**: The site is ready to publish from a clean checkout with credible academic quality gates, accessible presentation, print-friendly research use, and deployable static output.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: DESIGN-05, QUAL-01, QUAL-02, QUAL-04, QUAL-05
**Success Criteria** (what must be TRUE):

  1. Builder can run release validation that checks internal links, source trails, archive exclusions, citation resolution, graph target IDs, and representative math snippets from the umbrella paper and multiple pillar papers.
  2. Builder can inspect a coverage matrix confirming the umbrella framework and all twelve pillars meet the minimum chapter/content contract.
  3. Builder can start from a clean checkout, install dependencies, build the site, generate local search/graph/citation indexes, and produce deployable static output.
  4. User can use print- or citation-friendly page styling for research reading and sharing.

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Site Foundation and Provenance Contract | 4/4 | Complete | 2026-05-15 |
| 2. Book Shell and Formal Reading Interface | 3/3 | Complete   | 2026-05-19 |
| 3. Curated Corpus Chapters and Formal Registry | 3/5 | In Progress|  |
| 4. Local Discovery and Cross-Corpus Exploration | 0/TBD | Not started | - |
| 5. Release Quality and Static Publication Readiness | 0/TBD | Not started | - |
