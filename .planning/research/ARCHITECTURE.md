# Architecture Research

**Domain:** Static academic book/wiki generated from a Markdown/LaTeX research corpus
**Researched:** 2026-05-13
**Confidence:** HIGH for repository-specific source boundaries and build-order recommendations; MEDIUM for generator-agnostic implementation patterns because no specific static-site framework has been selected yet.

## Standard Architecture

### System Overview

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                         Canonical Research Corpus                           │
├───────────────────────┬───────────────────────┬────────────────────────────┤
│ Umbrella paper source │ Pillar paper sources  │ Supporting source material │
│ science/paper/        │ pillars/*/paper/      │ notes/research/reviews     │
└───────────┬───────────┴───────────┬───────────┴──────────────┬─────────────┘
            │                       │                          │
            │ read-only inputs      │ read-only inputs         │ contextual inputs
            ▼                       ▼                          ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                          Site Content Workspace                             │
├───────────────────────┬───────────────────────┬────────────────────────────┤
│ Curated chapter pages │ Concept/index records │ Source-trail manifests     │
│ site/content/...      │ definitions/theorems  │ source refs + provenance   │
└───────────┬───────────┴───────────┬───────────┴──────────────┬─────────────┘
            │                       │                          │
            │ normalized content    │ structured metadata       │ citations/links
            ▼                       ▼                          ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         Static Site Build Pipeline                          │
├───────────────────────┬───────────────────────┬────────────────────────────┤
│ Markdown/MDX renderer │ Math/citation renderer│ Search and graph indexers  │
│ pages + navigation    │ KaTeX/MathJax/BibTeX  │ JSON indexes, link graph   │
└───────────┬───────────┴───────────┬───────────┴──────────────┬─────────────┘
            │                       │                          │
            ▼                       ▼                          ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                              Static Artifact                                │
├───────────────────────┬───────────────────────┬────────────────────────────┤
│ HTML/CSS/JS pages     │ PDFs and source links │ Static indexes/assets      │
│ book/wiki experience  │ canonical trails      │ search, graph, glossary    │
└───────────────────────┴───────────────────────┴────────────────────────────┘
```

The right structure is a one-way publication pipeline. Canonical LaTeX and Markdown corpus files remain upstream. The website adds a curated explanatory layer and generated indexes downstream. The website must never become the authority for theorem text, definitions, citations, or paper claims unless that content has an explicit source reference back to `science/paper/` or `pillars/*/paper/`.

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Canonical corpus | Owns authoritative research claims, paper structure, theorem statements, citations, PDFs, and pillar boundaries | Existing `science/paper/` and `pillars/*/paper/` trees; treated as read-only inputs by the site pipeline |
| Supporting corpus | Supplies explanatory context, derivation notes, reviews, and research background | Existing `science/synthesis/`, `science/reviews/`, `pillars/*/notes/`, `pillars/*/research/`, `pillars/*/reviews/` |
| Site content workspace | Owns web-native chapters, pillar landing pages, glossary pages, reading paths, and editorial introductions | A new site subtree such as `site/content/` or `docs/site/content/`; contains curated Markdown/MDX with mandatory source metadata |
| Source-trail manifest | Maps each web page and extracted concept back to canonical files, section labels, line ranges where stable, PDFs, and supporting notes | YAML/JSON/TS data files such as `site/data/sources.yml`, plus per-page frontmatter fields |
| Concept registry | Gives stable IDs to definitions, assumptions, propositions, theorems, lemmas, metrics, and cross-pillar concepts | Structured data under `site/data/concepts/` or colocated frontmatter blocks in content pages |
| Navigation model | Defines book order, pillar order, reading paths, previous/next links, and wiki cross-links | Explicit navigation config, not inferred entirely from filenames |
| Math renderer | Renders inline/display math and theorem-like blocks without changing canonical notation | Static-site math plugin using KaTeX or MathJax; theorem blocks represented as semantic components/shortcodes |
| Citation/bibliography renderer | Presents citations and bibliography entries while linking back to canonical `.bib` sources | Build-time bibliography extraction or curated citation data generated from `science/paper/*.bib` and `pillars/*/paper/*.bib` |
| Search indexer | Builds local static search over pages, definitions, theorem titles/statements, glossary entries, citations, and pillar metadata | Build-time JSON index consumed by client-side search library; no database or hosted search required for v1 |
| Link graph/indexer | Builds graph-style relationships between pillars, concepts, definitions, theorems, and source files | Build-time graph JSON from concept registry and explicit `related:` metadata |
| Static renderer | Turns curated content and indexes into deployable HTML/CSS/JS | Any static site generator selected later; architecture should not depend on server runtime |
| Visual system | Owns typography, layout, callouts, theorem styling, source badges, graph/search UI, and responsive behavior | Theme files/components inside the site subtree; original academic/book identity |
| Quality gates | Prevent broken source trails, orphan pages, broken links, missing search records, and accidental archive promotion | Build scripts or tests that validate frontmatter, source paths, canonical links, and generated indexes |

## Recommended Project Structure

The site should be additive. Do not move canonical papers into the site tree and do not edit archive material as active input.

```text
harness_eng/
├── science/                         # Existing canonical umbrella corpus; upstream input
│   └── paper/                       # Canonical umbrella LaTeX/PDF/BibTeX
├── pillars/                         # Existing canonical pillar corpus; upstream input
│   └── <pillar>/
│       ├── paper/                   # Canonical pillar LaTeX/PDF/BibTeX
│       ├── notes/                   # Contextual source material
│       ├── research/                # Contextual source material
│       ├── reviews/                 # Validation/contextual material
│       └── archive/                 # Preservation only, not active source
├── assets/                          # Existing shared LaTeX assets; upstream for PDFs
├── site/                            # New static site implementation; downstream publication layer
│   ├── content/
│   │   ├── book/                    # Linear book chapters and reading-path pages
│   │   │   ├── index.md[x]
│   │   │   ├── science.md[x]
│   │   │   └── pillars/
│   │   │       └── <pillar>.md[x]   # Curated pillar chapter, not canonical replacement
│   │   ├── wiki/                    # Concept, theorem, definition, metric, citation pages
│   │   ├── glossary/                # Stable terminology entries
│   │   └── bibliography/            # Web bibliography pages or generated citation views
│   ├── data/
│   │   ├── corpus.yml               # Umbrella and pillar inventory
│   │   ├── sources.yml              # Source-trail mappings to canonical files/PDFs
│   │   ├── concepts.yml             # Stable concept IDs and relationships
│   │   ├── navigation.yml           # Book order, reading paths, sidebar groups
│   │   └── redirects.yml            # Optional stable URL migration map
│   ├── components/                  # Theorem, definition, source badge, citation, graph widgets
│   ├── scripts/
│   │   ├── build-indexes.*          # Generate search/graph/citation indexes
│   │   ├── validate-sources.*       # Fail build on missing canonical source trails
│   │   └── validate-links.*         # Fail build on broken internal/source links
│   ├── public/
│   │   ├── papers/                  # Copied or linked PDFs for site output
│   │   └── indexes/                 # Generated search and graph JSON
│   └── theme/                       # Typography, layout, book/wiki visual identity
└── .planning/research/              # Planning research outputs, not site content
```

### Structure Rationale

- **`science/` and `pillars/` stay upstream:** They are the source-of-truth corpus. The website consumes them; it does not absorb or replace them.
- **`site/content/` is curated, not canonical:** Web pages can explain, reorganize, and cross-link the research, but every substantive claim should carry a source trail.
- **`site/data/` separates structure from prose:** Navigation, source mappings, concept IDs, and graph edges will churn differently from chapter prose. Keeping them structured makes validation and index generation possible.
- **`site/components/` owns presentation semantics:** Theorem, definition, citation, and source-trail blocks should be reusable components so academic conventions are consistent across all twelve pillars.
- **`site/scripts/` owns reproducibility:** Search, graph, bibliography, and source validation should be generated at build time, not hand-maintained in browser code.
- **`archive/` remains excluded by default:** Archive content is provenance material. Include it only through explicit provenance pages, never as a default corpus source.

## Architectural Patterns

### Pattern 1: Canonical-Upstream, Curated-Downstream Publication

**What:** Treat `science/paper/` and `pillars/*/paper/` as authoritative upstream inputs, then write web-native curated pages downstream with explicit source references. The website is a lens over the corpus, not another corpus.

**When to use:** Use this for all pillar chapters, theorem explanations, derivation walkthroughs, reading paths, and glossary entries.

**Trade-offs:**
- Pros: preserves academic source trails, supports readable web prose, avoids brittle full LaTeX-to-HTML conversion as the only path.
- Cons: requires discipline to keep curated pages synchronized with canonical sources; needs validation scripts and source metadata.

**Example source metadata:**

```yaml
---
title: Reliability Architecture
kind: pillar-chapter
pillar: reliability
canonical_sources:
  - path: pillars/reliability/paper/reliability_architecture.tex
    role: canonical-paper-source
  - path: pillars/reliability/paper/reliability_architecture.pdf
    role: canonical-rendered-paper
supporting_sources:
  - path: pillars/reliability/notes/
    role: contextual-notes
source_status: curated-from-canonical
---
```

### Pattern 2: Stable Concept IDs Before Graph UI

**What:** Give each important definition, theorem, lemma, assumption, metric, and cross-pillar concept a stable ID before building search, graph views, backlinks, or glossary pages.

**When to use:** Use for definitions such as harness architecture dimensions, pillar-specific metrics, theorem statements, assumptions, and recurring concepts that appear in more than one pillar.

**Trade-offs:**
- Pros: stable URLs, reliable graph edges, better search filters, easier future refactors.
- Cons: up-front taxonomy work; bad IDs become annoying if invented too casually.

**Example concept record:**

```yaml
id: reliability.compound-error
label: Compound Error
kind: concept
pillar: reliability
canonical_source:
  path: pillars/reliability/paper/reliability_architecture.tex
related:
  - quality.ai-code-slop
  - coordination.multi-agent-decomposition
  - governance.verification-ratchet
appears_in:
  - site/content/book/pillars/reliability.mdx
  - site/content/wiki/compound-error.mdx
```

### Pattern 3: Explicit Navigation, Not Filesystem Inference

**What:** Maintain book order and reading paths in structured navigation data rather than deriving all navigation from directories.

**When to use:** Use for the umbrella-to-pillar order, thematic reading paths, previous/next links, sidebar hierarchy, and landing-page grouping.

**Trade-offs:**
- Pros: supports both book-like linear reading and wiki-style associative navigation; prevents accidental reorder from filename changes.
- Cons: one more file to maintain; needs validation to catch pages missing from navigation.

### Pattern 4: Build-Time Index Generation

**What:** Generate search, graph, glossary, and bibliography indexes during the static build from `site/content/` and `site/data/`.

**When to use:** Use for local static search, concept backlinks, theorem lists, source-trail indexes, and citation pages.

**Trade-offs:**
- Pros: no server, no database, reproducible output, easy static deployment.
- Cons: index size and client-side search performance need monitoring as the corpus grows.

### Pattern 5: Source-Trail Quality Gates

**What:** Fail the build when a substantive page lacks canonical source metadata, points at a missing file, links to archive material as canonical, or includes a concept without a stable ID.

**When to use:** Use from phase 1 onward. Retrofitting source validation after dozens of pages exist is tedious and error-prone.

**Trade-offs:**
- Pros: prevents silent forking and protects trust in the academic publication.
- Cons: slows early content drafting unless templates and examples are provided.

## Data Flow

### Publication Flow

```text
[Canonical LaTeX/PDF/BibTeX]
    science/paper/ and pillars/*/paper/
        │
        │ read as authoritative source; never overwritten by site build
        ▼
[Curated Site Pages]
    site/content/book, site/content/wiki, site/content/glossary
        │
        │ frontmatter declares canonical_sources and concept IDs
        ▼
[Structured Site Data]
    site/data/corpus.yml, sources.yml, concepts.yml, navigation.yml
        │
        │ validation scripts check paths, archive exclusions, broken links
        ▼
[Build-Time Generators]
    render pages, math, citations; generate search/graph/bibliography indexes
        │
        ▼
[Static Site Artifact]
    HTML/CSS/JS + copied PDFs + generated JSON indexes
```

### Source-of-Truth Flow

```text
Research change needed
    ↓
Edit canonical source first:
  - umbrella claim: science/paper/science.tex
  - pillar claim: pillars/<pillar>/paper/*.tex
  - supporting note: pillars/<pillar>/notes|research|reviews
    ↓
Rebuild or refresh PDF if needed
    ↓
Update curated site page to explain the new canonical content
    ↓
Update source-trail and concept metadata
    ↓
Run static build + validation
```

Direction is intentionally one-way for publication:

```text
Canonical corpus → curated site content → generated indexes → static artifact
```

The reverse direction is governance, not build flow:

```text
Site gap discovered → update canonical corpus if research changed → then update site
```

Do not let web-page edits become the only copy of a research claim.

### Reader Flow

```text
[Homepage]
    ↓
[Book overview / umbrella framework]
    ├── linear next/previous chapter navigation
    ├── pillar landing pages
    ├── thematic reading paths
    └── search / graph / glossary entry points
            ↓
[Definition/Theorem/Concept page]
    ├── explanation
    ├── source badge linking to canonical .tex/.pdf
    ├── related concepts and backlinks
    └── citation/bibliography context
```

### State Management

```text
Git repository state
    ├── canonical corpus files
    ├── curated site content
    ├── structured metadata
    └── generated artifacts only if intentionally committed
```

There is no runtime application state in v1. State is the repository plus deterministic build output. User accounts, comments, CMS editing, and server-side databases are outside the architecture for this milestone.

### Key Data Flows

1. **Canonical paper to web chapter:** LaTeX/PDF files under `science/paper/` and `pillars/*/paper/` inform curated `site/content/book/...` pages. The curated page records canonical source paths and links to the PDF.
2. **Supporting material to explanatory context:** Notes, research, and reviews can inform interpretations, caveats, and derivation explanations, but should be marked as supporting rather than canonical.
3. **Curated content to concept index:** The build reads frontmatter and concept data to generate glossary, theorem lists, backlinks, graph data, and search facets.
4. **Bibliography to citation UI:** Canonical `.bib` files or curated citation metadata generate bibliography pages and citation search records.
5. **Navigation data to book experience:** `navigation.yml` determines chapter order, reading paths, sidebars, and next/previous links independent of filesystem order.
6. **Validation to build pass/fail:** Source-trail, link, and metadata validation runs before or during static generation. Broken canonical references should fail the build.

## Build Order Implications

### Recommended Phase Sequence

1. **Corpus inventory and source-trail schema**
   - Define the umbrella plus twelve-pillar inventory in structured data.
   - Decide required frontmatter fields for pages: `title`, `kind`, `pillar`, `canonical_sources`, `supporting_sources`, `concept_ids`, and `source_status`.
   - Add validation for missing paths and accidental archive-as-canonical references.
   - Rationale: without this, the site will fork the corpus immediately.

2. **Static site shell and navigation spine**
   - Create the site subtree, homepage, book layout, pillar landing template, typography baseline, and navigation config.
   - Include placeholder pages for the umbrella and all twelve pillars.
   - Rationale: v1 must cover the whole corpus; a polished one-pillar demo gives false confidence.

3. **Canonical source badges and PDF/source links**
   - Add reusable source-trail components before writing substantial prose.
   - Each chapter should visibly link to canonical `.tex` and `.pdf` sources.
   - Rationale: source trust is a product feature, not an afterthought.

4. **Curated umbrella and pillar chapters**
   - Write web-native explanations for the umbrella framework and all twelve pillars.
   - Start with consistent page structure: overview, core problem, formal objects, definitions, theorem/proposition summary, derivation notes, implications, related pillars, source trail.
   - Rationale: establishes complete book coverage before advanced graph polish.

5. **Concept registry, glossary, and theorem/definition pages**
   - Extract stable IDs and page stubs for definitions, assumptions, metrics, lemmas, theorems, and propositions.
   - Link concepts from pillar pages.
   - Rationale: graph and search need stable semantic objects.

6. **Local static search**
   - Generate indexes over page text, glossary entries, definitions, theorem statements, citations, and pillar metadata.
   - Add filters by pillar and object kind.
   - Rationale: search quality depends on structured content from earlier phases.

7. **Graph-style cross-links and reading paths**
   - Generate backlinks and related-concept graph views from explicit metadata.
   - Add thematic reading paths such as building a harness, scaling multi-agent work, cost/latency, production hardening, and AI code degradation.
   - Rationale: graph UI should come after concept IDs and relationships exist.

8. **Visual refinement and publication hardening**
   - Refine academic typography, theorem styling, responsive layout, print/PDF affordances, metadata, broken-link checks, and deploy workflow.
   - Rationale: polish after content and validation boundaries are stable.

### Minimum Viable Architecture Slice

The first shippable architecture slice should include:

- Site scaffold and static build command.
- `site/data/corpus.yml` listing the umbrella and all twelve pillars.
- `site/data/sources.yml` or equivalent source-trail schema.
- One reusable source badge component.
- Homepage, umbrella page, and twelve pillar placeholder pages.
- Build validation that fails on missing canonical sources.

Do not start with graph visualization, fancy search, or full LaTeX extraction. Those depend on stable content IDs and source trails.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current corpus / v1 | A single static site build with structured YAML/JSON metadata is enough. Prioritize source validation, complete pillar coverage, and local search. |
| Larger internal corpus | Split concept metadata by pillar, add incremental index generation, add stronger schema validation, and introduce content linting for source trails and duplicate IDs. |
| Public long-lived publication | Add stable URL policy, redirects, generated sitemap, versioned source links, archived release snapshots, CI link checking, and content provenance reports. |

### Scaling Priorities

1. **First bottleneck: source drift.** Curated pages will diverge from canonical papers unless source trails and validation exist early. Fix with required source metadata and visible source badges.
2. **Second bottleneck: concept sprawl.** Definitions and theorem names will become inconsistent across pillars. Fix with stable concept IDs and one concept registry.
3. **Third bottleneck: navigation entropy.** Book order, pillar pages, glossary pages, and graph links will diverge if inferred ad hoc. Fix with explicit navigation and generated indexes.
4. **Fourth bottleneck: client-side search size.** If indexes become large, split indexes by kind or pillar before introducing hosted search. Hosted search is unnecessary for v1.

## Anti-Patterns

### Anti-Pattern 1: Forking Canonical Research into the Site

**What people do:** Copy theorem statements, derivations, or definitions into site pages and then edit them only in the site tree.

**Why it's wrong:** The paper corpus stops being authoritative. Readers cannot tell whether the website or the LaTeX is correct. Future paper edits will silently diverge from the web version.

**Do this instead:** Edit canonical research claims in `science/paper/` or `pillars/*/paper/` first. Then update curated site prose with source metadata linking back to the canonical file/PDF.

### Anti-Pattern 2: Treating Archive Material as Active Source

**What people do:** Pull content from `archive/`, `science/archive/`, or `pillars/*/archive/` because it looks useful or more complete.

**Why it's wrong:** Archive folders preserve drafts, backups, duplicate versions, and ambiguous artifacts. Promoting them silently breaks the repository's canonical-source contract.

**Do this instead:** Exclude archive paths from default source discovery. If an archive artifact matters, create an explicit provenance page that labels it historical and links to the active canonical source.

### Anti-Pattern 3: Building Graph UI Before Stable IDs

**What people do:** Generate a visual graph from page links or headings before deciding stable IDs for concepts, definitions, and theorem-like objects.

**Why it's wrong:** The graph becomes a pretty rendering of unstable headings. Renames break URLs, backlinks, and search results.

**Do this instead:** Define concept IDs and relationship metadata first. Generate graph data from the registry, not from incidental heading text alone.

### Anti-Pattern 4: Full Automatic LaTeX Conversion as the Only Pipeline

**What people do:** Try to convert every LaTeX paper directly into the website and call that the book/wiki.

**Why it's wrong:** Direct conversion preserves proximity but usually produces poor explanatory structure, awkward navigation, weak source context, and brittle math/citation handling. The project explicitly needs curated academic prose, not just HTML-shaped papers.

**Do this instead:** Use curated hybrid content. Extract or quote canonical statements where useful, but write web-native chapters with source badges and validation.

### Anti-Pattern 5: Navigation by Directory Accident

**What people do:** Let route order, sidebar order, and reading paths emerge from filenames.

**Why it's wrong:** The corpus has conceptual order: umbrella first, then pillars, then thematic reading paths and wiki objects. Filename order will not capture research pedagogy.

**Do this instead:** Maintain explicit navigation and reading-path data, validated against actual pages.

### Anti-Pattern 6: Adding Runtime Infrastructure for a Publication Problem

**What people do:** Add a CMS, database, authentication, server-rendered app, comments, or hosted search before static publication exists.

**Why it's wrong:** The repository is a source-controlled research corpus. Runtime infrastructure adds operational burden without addressing the hard problem: preserving rigorous source trails while making the corpus navigable.

**Do this instead:** Keep v1 static. Use git as the content workflow, build-time generation for indexes, and client-side local search.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Static hosting | Deploy generated static artifact | No server-side runtime required for v1. Any static host can serve HTML/CSS/JS/PDF/index JSON. |
| Browser search UI | Client consumes generated JSON index | Keep index local/static. Add filters for pillar, object kind, and citation/concept/theorem entries. |
| Math rendering library | Static-site plugin or build-time renderer | Choose during stack phase. Architecture requires consistent inline/display math and theorem blocks. |
| Citation tooling | Build-time extraction or curated BibTeX-derived data | Prefer canonical `.bib` files as upstream inputs; do not hand-maintain divergent citation text if avoidable. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Canonical corpus → site content | Read-only source references | Site build may read/copy/link; it must not mutate canonical paper files. |
| Supporting corpus → site content | Curated contextual references | Supporting notes can inform prose but should not override canonical paper claims. |
| Site content → generated indexes | Build-time extraction | Search, graph, glossary, and bibliography indexes should be deterministic build outputs. |
| Site data → navigation/UI | Structured config | Book order and reading paths should be explicit and reviewed as architecture, not hidden in components. |
| Archive → site | Explicit provenance-only links | Archive material is excluded by default and included only when clearly labeled historical. |
| PDFs → site artifact | Copy or link at build time | Preserve direct links to canonical rendered papers listed in README and pillar READMEs. |

## How to Avoid Forking Canonical Research Content

1. **Declare a source hierarchy:** canonical paper `.tex` and `.pdf` files are authoritative; supporting notes/research/reviews are contextual; archives are historical only.
2. **Require source metadata on every substantive page:** no pillar chapter, theorem page, definition page, or derivation page should build without canonical source references.
3. **Make source trails visible to readers:** use source badges or provenance panels, not hidden comments.
4. **Validate paths in CI/build scripts:** fail on missing canonical files, archive-as-canonical references, duplicate concept IDs, and pages absent from navigation.
5. **Use stable concept IDs:** avoid duplicating definitions under slightly different names across pillars.
6. **Keep generated indexes disposable:** search/graph/bibliography JSON should be rebuildable from content and data, not edited as source.
7. **Route research changes upstream:** if the site reveals a research correction, update the LaTeX/source corpus first and only then refresh site prose.
8. **Label quotations and interpretations differently:** quote canonical theorem/definition text when exactness matters; use curated interpretation sections for explanation.
9. **Exclude archives from automatic discovery:** require an explicit allowlist for historical/provenance pages.
10. **Review source trails with content changes:** every page PR or commit should be checked for source accuracy, not just visual rendering.

## Sources

- Repository project context: `/home/prannayag/harness_eng/.planning/PROJECT.md` — source-of-truth constraints, v1 scope, static-site requirements, out-of-scope runtime features.
- Existing architecture map: `/home/prannayag/harness_eng/.planning/codebase/ARCHITECTURE.md` — current canonical corpus layers, source boundaries, archive constraints, and data flow.
- Existing structure map: `/home/prannayag/harness_eng/.planning/codebase/STRUCTURE.md` — directory layout and canonical file locations.
- Repository README: `/home/prannayag/harness_eng/README.md` — umbrella paper, pillar list, reading paths, archive status.
- Pillars README: `/home/prannayag/harness_eng/pillars/README.md` — pillar folder contract and canonical/support/archive boundaries.

---
*Architecture research for: static academic book/wiki website for a Markdown/LaTeX research corpus*
*Researched: 2026-05-13*
