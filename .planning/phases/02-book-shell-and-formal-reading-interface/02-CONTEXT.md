# Phase 2: Book Shell and Formal Reading Interface - Context

**Gathered:** 2026-05-18T04:46:13Z
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 delivers the reader-facing book shell for the existing static site: a polished homepage, stable linear book navigation, source-detail pillar pages, an original scholarly-atlas visual identity, and reusable formal-reading components for definitions, theorem-like claims, derivations, citations, and source trails.

This phase does not fill the full umbrella/pillar chapter corpus, build the formal registry or glossary, add reading-path discovery, implement local search UX beyond the existing foundation, create graph exploration, or complete final release hardening. Those belong to later phases.

</domain>

<decisions>
## Implementation Decisions

### Homepage Framing
- **D-01:** The homepage should lead with a visual corpus map rather than a text-first orientation or manifesto opening.
- **D-02:** The leading map should be a rich pillar constellation: the umbrella framework visually anchors the twelve pillars, with each pillar presented as part of the corpus-wide research map.
- **D-03:** In Phase 2, clicking a pillar in the homepage constellation should route to inventory/source-detail treatment rather than full curated chapter content. Full chapter substance belongs to Phase 3.
- **D-04:** The homepage constellation should be supported by an introductory essay that frames the corpus and why the book/wiki exists.

### Book Navigation
- **D-05:** The main book spine should prioritize the route from overview to umbrella framework to the twelve pillars.
- **D-06:** The twelve pillar entries should follow a conceptual-arc order rather than the current inventory order or alphabetical order. Downstream planning should define that arc explicitly and use it consistently in sidebar and previous/next navigation.
- **D-07:** Phase 2 pillar pages should be source detail pages: each pillar gets a lightweight book-spine page with summary, canonical PDF/source links, source-status treatment, and previous/next navigation. These pages should be ready for Phase 3 to expand into full curated chapters.
- **D-08:** Previous/next navigation should be subtle footer navigation, with the sidebar carrying the primary navigation weight.

### Visual Identity
- **D-09:** The visual direction should be a scholarly atlas: map-like, source-grounded, academic, and original rather than a clone of another research lab brand.
- **D-10:** The atlas identity should be rich, with distinctive cartographic/constellation treatments, bespoke page polish, and strong visual character.
- **D-11:** Typography should be sans-interface-forward rather than serif-body-forward. Use sans typography for most interface and prose, while preserving excellent math, code/path, citation, and formal-block legibility.
- **D-12:** Readability is non-negotiable. Decorative atlas effects must never reduce contrast, keyboard focus visibility, math legibility, source-trail clarity, or narrow-screen readability.

### Formal Blocks
- **D-13:** Phase 2 should deliver a reusable formal-reading component library, not just CSS examples. It should include components for definition blocks, theorem-like claim blocks, derivation walkthroughs, citations, and source trails, with fixtures that prove rendering.
- **D-14:** Every formal block should visibly expose at least its block type/label, stable ID or label, owning pillar/page context, and canonical source link.
- **D-15:** Derivation walkthroughs should use a notebook-style visual treatment with alternating explanatory prose and math/code-like cells, rather than a proof rail or compact appendix style.
- **D-16:** Source trails inside formal blocks should be always detailed, not hidden behind expandable-only affordances. The design may make details visually structured, but source provenance should be visible by default.

### Claude's Discretion
- No selected area was delegated to Claude discretion. Planner may choose implementation mechanics, but the product decisions above are locked.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning and Requirements
- `.planning/PROJECT.md` — Project purpose, core value, active constraints, and key product decisions.
- `.planning/REQUIREMENTS.md` — Phase 2 maps to BOOK-01, BOOK-02, BOOK-03, BOOK-05, BOOK-06, DESIGN-01, DESIGN-02, DESIGN-03, and DESIGN-04.
- `.planning/ROADMAP.md` — Phase 2 goal, scope boundary, success criteria, dependency on Phase 1, and later-phase boundaries.
- `.planning/STATE.md` — Current project state and active focus on Phase 2.
- `.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md` — Locked Phase 1 decisions: `site/` boundary, Astro/Starlight baseline, Bun, static math, typed inventory, and provenance validation.

### Codebase Maps
- `.planning/codebase/CONVENTIONS.md` — General TypeScript/style conventions and error-handling patterns.
- `.planning/codebase/STRUCTURE.md` — Repository structure and canonical corpus locations.
- `.planning/codebase/STACK.md` — Pre-Phase-1 stack map; useful as baseline context, but current `site/` files supersede its “no site runtime” observations.

### Current Site Foundation
- `site/package.json` — Astro/Starlight, Bun scripts, KaTeX, Pagefind, Zod, Vitest, build/validate/index/test commands, and dependency overrides.
- `site/astro.config.mjs` — Static output, remark/rehype math pipeline, Starlight integration, current title, custom CSS hook, and initial sidebar.
- `site/src/content.config.ts` — Starlight docs collection configuration for MDX content pages.
- `site/src/content/docs/index.mdx` — Current foundation homepage/content page and build contract prose.
- `site/src/content/docs/math-fixture.mdx` — Existing math-rendering fixture proving inline and block math pipeline.
- `site/src/content/docs/provenance-contract.mdx` — Current provenance rules, required inventory fields, canonical path rules, and validation diagnostics.
- `site/src/pages/inventory.astro` — Current inventory page implementation and source-status visual treatment.
- `site/src/styles/phase-1.css` — Existing warm paper-toned Phase 1 style variables and inventory styling to replace or evolve for the richer Phase 2 identity.

### Corpus Inventory and Provenance Data
- `site/src/data/corpus.ts` — Explicit umbrella-plus-twelve-pillar inventory, current source summaries, slugs, and canonical source/PDF/bibliography paths.
- `site/src/data/corpus.schema.ts` — Corpus entry schema, expected corpus IDs, and source status label definitions.
- `science/paper/science.tex` — Canonical umbrella framework source for source-detail links and future chapter expansion.
- `science/paper/science.pdf` — Canonical umbrella PDF for source-detail links.
- `science/paper/science.bib` — Umbrella bibliography source.
- `pillars/*/paper/*.tex` — Canonical pillar paper sources referenced by the inventory and pillar source-detail pages.
- `pillars/*/paper/*.pdf` — Canonical pillar PDFs referenced by the inventory and pillar source-detail pages.
- `pillars/*/paper/*.bib` — Pillar bibliography sources where present.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `site/astro.config.mjs`: Existing Starlight sidebar and `customCss` integration points for replacing the foundation sidebar with a conceptual-arc book spine and richer visual system.
- `site/src/data/corpus.ts`: Existing typed corpus entries can drive the homepage constellation, source-detail pages, and pillar links without duplicating corpus metadata.
- `site/src/data/corpus.schema.ts`: Existing source status labels and expected IDs can support source-status badges and validation-aware UI treatment.
- `site/src/pages/inventory.astro`: Current page already renders all corpus entries with source paths and status labels; Phase 2 can evolve this into detail pages or reuse its rendering logic.
- `site/src/content/docs/math-fixture.mdx`: Existing math fixture should be expanded or complemented with formal-block component fixtures.
- `site/src/content/docs/provenance-contract.mdx`: Existing provenance contract anchors the source-trail language and must remain consistent with any formal block or source-detail UI.
- `site/src/styles/phase-1.css`: Existing paper-tone variables and accessible inventory card styles provide a starting point but should not constrain the richer scholarly-atlas identity.

### Established Patterns
- Site implementation is isolated under `site/`; canonical `science/` and `pillars/` files remain read-only inputs.
- `bun run build` validates provenance before Astro emits static HTML and Pagefind local indexes.
- Static math rendering is already configured through `remark-math`, `rehype-katex`, and KaTeX CSS.
- Current content uses Starlight MDX docs plus Astro pages; Phase 2 can use MDX/Astro components without adding a server runtime.
- Provenance rules reject archive-backed canonical paths unless explicitly marked provenance-only.

### Integration Points
- Homepage work should replace or substantially evolve the current foundation landing content in `site/src/content/docs/index.mdx` or an Astro-backed homepage while staying within static output.
- Sidebar/book-spine work should update Starlight configuration and/or content structure so overview, umbrella, and pillar source-detail pages share one conceptual-arc order.
- Formal block work should integrate with MDX content so Phase 3 chapter authors can use reusable components directly.
- Source-detail pages should read from or be generated from `corpusEntries`, avoiding a second metadata source for canonical paths, PDFs, bibliographies, source status, and summaries.

</code_context>

<specifics>
## Specific Ideas

- The homepage should feel like a research atlas: a pillar constellation first, followed by an introductory essay.
- The conceptual arc for pillar ordering must be explicitly chosen during planning; do not silently inherit inventory order if it conflicts with the desired reading sequence.
- Pillar clicks from the constellation should land in source-detail/inventory treatment for Phase 2, not full curated chapters.
- Formal blocks should make source trails detailed and visible by default, even if the visual design uses compact structure to keep reading pleasant.
- The rich atlas identity may use constellation lines, cartographic textures, coordinate-like framing, or bespoke ornaments, but must remain readable first.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 2-Book Shell and Formal Reading Interface*
*Context gathered: 2026-05-18T04:46:13Z*
