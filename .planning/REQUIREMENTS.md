# Requirements: Harness Architecture Book Wiki

**Defined:** 2026-05-13
**Core Value:** Researchers can understand, navigate, and cross-reference the corpus's formal pillar definitions, theorems, and derivations without losing the rigor of the canonical papers.

## v1 Requirements

Requirements for the first release. Each maps to roadmap phases.

### Foundation and Provenance

- [ ] **FOUND-01**: Site implementation lives under a clear project boundary that does not move or replace canonical `science/` or `pillars/` corpus files
- [ ] **FOUND-02**: Site build uses a static-site architecture with no server-side database, CMS, accounts, or hosted search dependency
- [ ] **FOUND-03**: Site has a structured corpus inventory covering the umbrella framework and all twelve pillars
- [ ] **FOUND-04**: Site content schema requires canonical source metadata for pillar chapters and formal objects
- [ ] **FOUND-05**: Site validation fails when required canonical source paths are missing
- [ ] **FOUND-06**: Site validation prevents archive paths from being treated as canonical sources unless explicitly marked as provenance content
- [ ] **FOUND-07**: Site has a documented build command that produces static HTML assets and local indexes reproducibly

### Book Site Experience

- [ ] **BOOK-01**: User can open a polished homepage that introduces the harness architecture corpus and its book/wiki structure
- [ ] **BOOK-02**: User can navigate a linear book spine from overview to umbrella framework to every pillar chapter
- [ ] **BOOK-03**: User can move through chapters using stable sidebar navigation and previous/next navigation
- [ ] **BOOK-04**: User can browse dedicated reading paths for at least building a harness, scaling multi-agent work, cost/latency, production hardening, and AI code degradation
- [ ] **BOOK-05**: User can access canonical PDF and source links from the umbrella page and every pillar page
- [ ] **BOOK-06**: User can distinguish canonical, supporting, synthesis/review, and archived/provenance material in the UI

### Formal Research Content

- [ ] **FORM-01**: User can read a curated umbrella framework page grounded in `science/paper/`
- [ ] **FORM-02**: User can read curated chapter pages for all twelve pillars
- [ ] **FORM-03**: Each pillar chapter includes the pillar problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, and source trail
- [ ] **FORM-04**: User can identify formal definitions through consistent anchorable definition blocks
- [ ] **FORM-05**: User can identify theorems, propositions, lemmas, assumptions, and similar formal claims through consistent anchorable theorem-like blocks
- [ ] **FORM-06**: User can inspect derivation walkthroughs or derivation sections where the canonical corpus supports them
- [ ] **FORM-07**: User can see citation references and bibliography entries in readable academic form
- [ ] **FORM-08**: User can follow a citation or formal block back to the canonical source file, PDF, or supporting source trail
- [ ] **FORM-09**: User can browse a glossary/concept index that normalizes recurring terms, aliases, notation, and owning pillars
- [ ] **FORM-10**: User can browse a formal object registry or equivalent generated index of definitions, theorem-like claims, citations, and concepts

### Search and Graph Exploration

- [ ] **DISC-01**: User can run local static search without a hosted search service
- [ ] **DISC-02**: Search indexes pages, pillar names, definitions, theorem-like statements, glossary entries, citations, and reading paths
- [ ] **DISC-03**: Search results deep-link to stable anchors for formal objects rather than only to page tops
- [ ] **DISC-04**: User can navigate typed related links between pillars, concepts, definitions, theorem-like claims, and citations
- [ ] **DISC-05**: User can view graph-style local context or generated relationship data without requiring a runtime graph database
- [ ] **DISC-06**: Graph/link metadata validates relation types and target IDs at build time

### Visual Design and Accessibility

- [ ] **DESIGN-01**: Site uses an original, stylistic, book-like visual identity rather than cloning another research lab's brand
- [ ] **DESIGN-02**: Site typography supports long academic reading, dense theorem blocks, citations, footnotes, and bibliography entries
- [ ] **DESIGN-03**: Mathematical notation, aligned equations, and derivation sections render legibly on desktop and narrow screens
- [ ] **DESIGN-04**: Site supports keyboard navigation, semantic headings, visible focus states, and accessible contrast
- [ ] **DESIGN-05**: Site has print- or citation-friendly page styling for research use

### Quality Gates and Release Readiness

- [ ] **QUAL-01**: Build validates internal links, source trails, archive exclusions, citation resolution, and graph target IDs
- [ ] **QUAL-02**: Build or test fixtures verify representative math snippets from the umbrella paper and multiple pillar papers
- [ ] **QUAL-03**: Search quality checks verify representative queries return expected pages or formal-object anchors
- [ ] **QUAL-04**: Coverage matrix confirms the umbrella framework and all twelve pillars meet the minimum chapter/content contract
- [ ] **QUAL-05**: Clean checkout can install dependencies, build the site, generate local search/graph/citation indexes, and produce deployable static output

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Research Navigation

- **ADV-01**: User can browse full concept relationship pages that aggregate all occurrences, definitions, theorem links, citations, and cross-pillar appearances
- **ADV-02**: User can view cross-pillar comparison pages for recurring patterns such as capacity constraints, degradation dynamics, verification scheduling, and governance ratchets
- **ADV-03**: User can explore citation influence/backlink views across the full corpus
- **ADV-04**: User can use richer interactive graph filtering, layouts, and neighborhood expansion after relationship metadata matures
- **ADV-05**: User can access interactive derivation aids beyond curated static walkthroughs

### Publication Operations

- **OPS-01**: Site supports versioned releases of the research corpus with stable historical snapshots
- **OPS-02**: Site supports automated provenance reports comparing canonical paper changes against curated site pages
- **OPS-03**: Site supports optional analytics that do not compromise the static publication model or reader privacy

## Out of Scope

Explicitly excluded to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Dynamic accounts, comments, or collaborative editing | v1 is a static research publication, not a community platform |
| Server-side database or CMS | Git and canonical corpus files remain the source of truth |
| Hosted search service | v1 requires local static search and no external search dependency |
| Exact Thinking Machines Lab clone | The site should have its own book-like identity |
| Full automatic LaTeX semantic extraction as the only content pipeline | Curated hybrid content is needed for readability and correctness |
| Treating `archive/` material as active source content | Archives are provenance artifacts, not canonical sources |
| Rewriting canonical research papers as part of website work | The website explains and organizes the corpus; research changes belong upstream |
| Live theorem proving or symbolic verification | Valuable only if the corpus is encoded for it; too large for v1 |
| AI-generated ungated explanations | Formal explanations must be source-grounded to avoid hallucinated math or drift |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| FOUND-07 | Phase 1 | Pending |
| BOOK-01 | Phase 2 | Pending |
| BOOK-02 | Phase 2 | Pending |
| BOOK-03 | Phase 2 | Pending |
| BOOK-04 | Phase 4 | Pending |
| BOOK-05 | Phase 2 | Pending |
| BOOK-06 | Phase 2 | Pending |
| FORM-01 | Phase 3 | Pending |
| FORM-02 | Phase 3 | Pending |
| FORM-03 | Phase 3 | Pending |
| FORM-04 | Phase 3 | Pending |
| FORM-05 | Phase 3 | Pending |
| FORM-06 | Phase 3 | Pending |
| FORM-07 | Phase 3 | Pending |
| FORM-08 | Phase 3 | Pending |
| FORM-09 | Phase 3 | Pending |
| FORM-10 | Phase 3 | Pending |
| DISC-01 | Phase 4 | Pending |
| DISC-02 | Phase 4 | Pending |
| DISC-03 | Phase 4 | Pending |
| DISC-04 | Phase 4 | Pending |
| DISC-05 | Phase 4 | Pending |
| DISC-06 | Phase 4 | Pending |
| DESIGN-01 | Phase 2 | Pending |
| DESIGN-02 | Phase 2 | Pending |
| DESIGN-03 | Phase 2 | Pending |
| DESIGN-04 | Phase 2 | Pending |
| DESIGN-05 | Phase 5 | Pending |
| QUAL-01 | Phase 5 | Pending |
| QUAL-02 | Phase 5 | Pending |
| QUAL-03 | Phase 4 | Pending |
| QUAL-04 | Phase 5 | Pending |
| QUAL-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 39 total
- Mapped to phases: 39
- Unmapped: 0

---
*Requirements defined: 2026-05-13*
*Last updated: 2026-05-13 after roadmap creation*
