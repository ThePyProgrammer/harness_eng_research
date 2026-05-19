# Phase 3: Curated Corpus Chapters and Formal Registry - Context

**Gathered:** 2026-05-19T06:43:11Z
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 delivers the source-grounded formal content layer for the existing static book site: a curated umbrella framework page, curated chapters for all twelve pillars, consistent formal objects, source-supported derivation walkthroughs, citations, a glossary/concept index, and a formal object registry.

This phase does not build local search, reading-path discovery, graph exploration, advanced relationship views, release hardening, print styling, or final quality gates. Those belong to later phases.

</domain>

<decisions>
## Implementation Decisions

### Chapter Contract
- **D-01:** Every curated pillar chapter must use a full formal contract: problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, citations, and source trail.
- **D-02:** The umbrella framework page should be a unifying opening formal chapter that defines the corpus-wide architecture and explicitly points into each pillar, not merely an executive overview.
- **D-03:** Chapters should include full source-supported derivation walkthroughs where the corpus supports them, using the Phase 2 notebook-style derivation treatment.
- **D-04:** Chapter prose should use an academic explainer style: rigorous but readable research prose that defines terms, explains why the math matters, and avoids oversimplifying claims.

### Formal Registry
- **D-05:** Formal objects should be authored structured-data-first: maintain a typed registry/data source for definitions, theorem-like claims, citations, concepts, IDs, source paths, and owning pages, then render pages and indexes from it.
- **D-06:** Formal object anchors must use semantic stable IDs such as `reliability.compound-error-bound`, including owner plus concept or claim name and remaining stable across page wording changes.
- **D-07:** The registry should model a broad formal set: definitions, assumptions, theorems, propositions, lemmas, corollaries, equations/derivations, citations, glossary concepts, and source trails.
- **D-08:** Registry validation should be strict in Phase 3. Build or validation should fail for duplicate IDs, missing source paths, invalid owner IDs, broken anchors, missing required fields, or relation targets that Phase 3 owns.

### Source Grounding
- **D-09:** Curated chapters may use canonical papers as primary evidence and pillar-local notes/research/reviews plus science synthesis as supporting context when clearly labeled.
- **D-10:** Source trails should be visible inline and at section level: each formal block and major section shows source links, with a chapter-level source trail summarizing canonical and supporting inputs.
- **D-11:** When the canonical paper is thin or ambiguous, supporting notes/research/reviews may fill the section as long as the page labels the material as supporting rather than canonical.
- **D-12:** Source trails must explicitly label source tiers such as canonical, supporting research, synthesis/review, and provenance material so readers know what kind of evidence backs each passage.

### Glossary Concepts
- **D-13:** Glossary/concept entries should normalize recurring cross-corpus concepts across the umbrella and pillars, with aliases, notation, owning pillars, short definitions, and links to formal objects.
- **D-14:** Each glossary/concept entry should be a rich concept card with term, aliases, notation, owning pillar(s), concise definition, source tier links, related formal objects, and related concepts.
- **D-15:** Phase 3 should include simple static reciprocal links between concepts, chapters, and formal objects; graph views and advanced traversal remain Phase 4 scope.
- **D-16:** Concepts that appear under different names across papers should use one canonical glossary term, preserve all aliases, note owning/source contexts, and link aliases back to the canonical concept.

### Claude's Discretion
- No selected area was delegated to Claude discretion. Planner may choose implementation mechanics, but the product decisions above are locked.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning and Requirements
- `.planning/PROJECT.md` — Project purpose, core value, active constraints, and key product decisions.
- `.planning/REQUIREMENTS.md` — Phase 3 maps to FORM-01 through FORM-10.
- `.planning/ROADMAP.md` — Phase 3 goal, scope boundary, success criteria, dependency on Phase 2, and later-phase boundaries.
- `.planning/STATE.md` — Current project state and sequencing context.
- `.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md` — Locked Phase 1 decisions: `site/` boundary, Astro/Starlight baseline, Bun, static math, typed inventory, and provenance validation.
- `.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md` — Locked Phase 2 decisions: scholarly-atlas identity, conceptual book spine, source-detail pages, formal component requirements, visible source trails, and notebook-style derivations.

### Current Site Foundation
- `site/astro.config.mjs` — Static output, Starlight integration, math pipeline, custom CSS hook, and book sidebar wiring.
- `site/src/data/corpus.ts` — Explicit umbrella-plus-twelve-pillar inventory with canonical source/PDF/bibliography paths.
- `site/src/data/corpus.schema.ts` — Corpus entry schema, expected corpus IDs, and source status label definitions.
- `site/src/data/book-spine.ts` — Conceptual-arc book spine order and previous/next navigation data.
- `site/src/components/SourceLinkPanel.astro` — Existing source trail panel and material-kind treatment to extend for chapter-level and section-level source trails.
- `site/src/components/BookFooterNav.astro` — Existing previous/next footer navigation for corpus-backed pages.
- `site/src/pages/corpus/[slug].astro` — Current generated source-detail pages that Phase 3 should expand into full curated chapters.
- `site/src/content/docs/provenance-contract.mdx` — Current provenance rules, required inventory fields, canonical path rules, and validation diagnostics.
- `site/src/content/docs/math-fixture.mdx` — Existing math-rendering fixture proving inline and block math pipeline.

### Canonical Corpus Sources
- `science/paper/science.tex` — Canonical umbrella framework source for the unifying opening chapter.
- `science/paper/science.pdf` — Canonical umbrella framework PDF.
- `science/paper/science.bib` — Umbrella bibliography source.
- `pillars/*/paper/*.tex` — Canonical pillar paper sources for all twelve curated pillar chapters.
- `pillars/*/paper/*.pdf` — Canonical pillar PDFs for source trails.
- `pillars/*/paper/*.bib` — Pillar bibliography sources where present.

### Supporting Corpus Sources
- `science/synthesis/` — Cross-pillar synthesis material allowed as clearly labeled supporting context.
- `science/reviews/` — Umbrella and synthesis review material allowed as clearly labeled supporting context.
- `pillars/*/notes/` — Pillar-local notes allowed as clearly labeled supporting context.
- `pillars/*/research/` — Pillar-local research material allowed as clearly labeled supporting context.
- `pillars/*/reviews/` — Pillar-local review material allowed as clearly labeled supporting context.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `site/src/data/corpus.ts`: Existing typed inventory should remain the source for umbrella and pillar ownership, canonical source paths, PDFs, bibliographies, and slugs.
- `site/src/data/book-spine.ts`: Existing conceptual-arc order should drive chapter navigation and page sequencing.
- `site/src/pages/corpus/[slug].astro`: Current generated source-detail page is the natural integration point for expanding source-detail treatment into full curated chapters.
- `site/src/components/SourceLinkPanel.astro`: Existing material-kind and source-status UI can be extended into chapter-level source trails and source tier labels.
- `site/src/components/BookFooterNav.astro`: Existing previous/next navigation should continue to work as chapters replace lightweight source-detail pages.
- `site/src/content/docs/math-fixture.mdx`: Existing math pipeline fixture can be extended or complemented with registry/formal-object fixtures.

### Established Patterns
- Site implementation remains under `site/`; canonical `science/` and `pillars/` files are read-only inputs.
- Static math rendering is already configured through `remark-math`, `rehype-katex`, and KaTeX CSS.
- Existing generated pages and typed data live in TypeScript under `site/src/data` and `site/src/pages`.
- Existing validation hard-fails provenance issues; Phase 3 registry validation should follow the same strict-gate pattern.
- The Phase 2 visual identity is scholarly atlas and must preserve readability, contrast, source-trail clarity, math legibility, and narrow-screen behavior.

### Integration Points
- Add a structured formal registry/data source that can render formal blocks, registry pages, glossary/concept cards, and stable anchors.
- Expand `/corpus/[slug]/` pages from source-detail summaries into curated umbrella and pillar chapters without breaking the existing book spine.
- Extend validation to cover formal object IDs, source paths, owner IDs, required fields, anchors, and Phase 3-owned relation targets.
- Use source tier labels consistently across formal blocks, major sections, chapter source trails, and concept cards.

</code_context>

<specifics>
## Specific Ideas

- Treat the umbrella page as the opening formal chapter that frames the whole corpus and links into all pillars.
- Use semantic stable IDs for formal objects, not paper numbering or source-line IDs as the primary anchor scheme.
- Prefer structured data as the source of truth for formal objects and concepts, then render chapters/indexes from that data.
- Include full derivation walkthroughs where source material supports them, using the notebook-style derivation treatment established in Phase 2.
- Use supporting notes/research/reviews to fill thin canonical sections, but label those source tiers explicitly.
- Add reciprocal static links between chapters, formal objects, and concepts now; leave graph views, advanced traversal, and search UX to Phase 4.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 3-Curated Corpus Chapters and Formal Registry*
*Context gathered: 2026-05-19T06:43:11Z*
