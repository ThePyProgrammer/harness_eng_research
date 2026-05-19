# Phase 02: Book Shell and Formal Reading Interface - Research

**Researched:** 2026-05-18  
**Domain:** Astro/Starlight static book shell, accessible formal-reading UI, source-detail corpus pages  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BOOK-01 | User can open a polished homepage that introduces the harness architecture corpus and its book/wiki structure | Use the Starlight/Astro foundation and replace the current foundation homepage with a rich constellation-led atlas homepage plus introductory essay. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] [VERIFIED: /home/prannayag/harness_eng/site/astro.config.mjs] |
| BOOK-02 | User can navigate a linear book spine from overview to umbrella framework to every pillar chapter | Define one conceptual-arc order and use it for Starlight sidebar plus generated source-detail pages. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] [CITED: https://starlight.astro.build/reference/configuration/] |
| BOOK-03 | User can move through chapters using stable sidebar navigation and previous/next navigation | Use Starlight sidebar config for primary navigation and implement subtle footer previous/next links from the same spine data. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] [CITED: https://starlight.astro.build/reference/configuration/] |
| BOOK-05 | User can access canonical PDF and source links from the umbrella page and every pillar page | Generate source-detail pages from `corpusEntries` so canonical `.tex`, PDF, and bibliography links stay single-sourced. [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.ts] |
| BOOK-06 | User can distinguish canonical, supporting, synthesis/review, and archived/provenance material in the UI | Extend the Phase 1 source-status treatment into richer badges/callouts while preserving archive-as-provenance rules. [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.schema.ts] [VERIFIED: /home/prannayag/harness_eng/site/src/content/docs/provenance-contract.mdx] |
| DESIGN-01 | Site uses an original, stylistic, book-like visual identity rather than cloning another research lab's brand | Implement a scholarly-atlas identity with map/constellation motifs, original palette/tokens, and no close clone of another lab brand. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] |
| DESIGN-02 | Site typography supports long academic reading, dense theorem blocks, citations, footnotes, and bibliography entries | Use sans-forward interface/prose tokens plus dedicated math, code/path, citation, and formal-block styling. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] |
| DESIGN-03 | Mathematical notation, aligned equations, and derivation sections render legibly on desktop and narrow screens | Build on existing `remark-math` + `rehype-katex` + KaTeX CSS; add formal fixtures for aligned equations and notebook derivations. [VERIFIED: /home/prannayag/harness_eng/site/astro.config.mjs] [CITED: https://github.com/KaTeX/KaTeX/blob/main/docs/api.md] |
| DESIGN-04 | Site supports keyboard navigation, semantic headings, visible focus states, and accessible contrast | Apply WCAG keyboard, focus, headings, contrast, reflow, and text-spacing criteria to homepage, sidebar, source pages, and formal components. [CITED: https://www.w3.org/WAI/WCAG22/quickref/] |
</phase_requirements>

## Summary

Phase 2 should not re-platform the site: the Phase 1 implementation already provides an isolated `site/` workspace, Astro/Starlight static output, Bun scripts, typed corpus inventory, provenance validation, KaTeX math rendering, Vitest tests, and Pagefind local indexing. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-01-SUMMARY.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-04-SUMMARY.md] The planner should treat Phase 2 as a thin vertical reader-experience slice: a polished atlas homepage, a stable book spine, generated umbrella/pillar source-detail pages, and reusable formal-reading components with fixtures. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]

The highest-risk planning decision is the shared navigation/source-detail data model. The locked product requirement says the pillar order must be conceptual-arc, not current inventory or alphabetical order, and the same order must drive the homepage constellation, Starlight sidebar, source-detail page order, and footer previous/next links. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] Put that order in one typed module, not in four separate UI files. [ASSUMED]

**Primary recommendation:** Build one `bookSpine`/`corpusPresentation` data layer from `corpusEntries`, then use it to render the atlas homepage, Starlight sidebar, generated source-detail pages, and formal component fixtures without duplicating canonical source metadata. [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.ts] [ASSUMED]

## Project Constraints (from CLAUDE.md)

- Canonical content comes from `science/paper/` and `pillars/*/paper/`; website pages must link back to these sources rather than becoming untraceable forks. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md]
- v1 must include the umbrella paper and all twelve pillars; a narrow one-pillar demo is insufficient. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md]
- v1 should include full derivations where the corpus supports them; Phase 2 supplies the reusable formal-reading interface and fixtures, while full curated chapter substance belongs to Phase 3. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]
- v1 must remain static and avoid unnecessary server/runtime complexity. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md]
- Navigation must support book-chapter reading and wiki/graph-style exploration; Phase 2 covers the linear book spine, while graph-style exploration is later scope. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md] [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]
- Search must be local/static with no hosted search service or database for v1; Phase 2 must not add hosted search. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md]
- Visual identity should be original and book-like, inspired by high-end research/editorial sites but not a close clone. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md]
- Do not treat `archive/` material as active source unless a page explicitly discusses provenance. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md]
- Site implementation remains under `site/`; do not add root package files or move canonical corpus files. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-SUMMARY.md unavailable because the requested aggregate summary path does not exist; plan summaries verified individually]
- Before file-changing implementation work, use GSD workflow entry points; this research was requested by the GSD phase workflow and writes only the requested planning artifact. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Atlas homepage | Static build system | Browser / Client | Astro/Starlight emits static HTML; browser renders CSS-only constellation interactions and links. [CITED: https://docs.astro.build/en/core-concepts/astro-pages/] [ASSUMED] |
| Book spine navigation | Static build system | Browser / Client | Starlight sidebar is configured at build time; footer previous/next links should be generated from the same typed order. [CITED: https://starlight.astro.build/reference/configuration/] [ASSUMED] |
| Umbrella and pillar source-detail pages | Static build system | Repository filesystem | Astro dynamic routes can generate static pages from local data; `corpusEntries` owns canonical source/PDF/bib paths. [CITED: https://docs.astro.build/en/reference/routing-reference/] [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.ts] |
| Formal block component library | Static build system | Browser / Client | MDX supports importing JSX/components into Markdown content, so formal blocks can be authored as reusable Astro/MDX components and rendered statically. [CITED: https://mdxjs.com/docs/what-is-mdx/] |
| Math rendering | Static build system | Browser / Client | The existing pipeline uses `remark-math`, `rehype-katex`, and KaTeX CSS during Astro build; CSS controls responsive overflow/readability. [VERIFIED: /home/prannayag/harness_eng/site/astro.config.mjs] |
| Source/provenance status UI | Static build system | Repository filesystem | Source status labels already exist in schema and inventory UI; Phase 2 should enrich the presentation without creating a second source-of-truth. [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.schema.ts] [VERIFIED: /home/prannayag/harness_eng/site/src/pages/inventory.astro] |
| Accessibility semantics/focus/contrast | Browser / Client | Static build system | Semantic markup and CSS are delivered statically; WCAG criteria apply to the resulting HTML/CSS behavior. [CITED: https://www.w3.org/WAI/WCAG22/quickref/] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | installed `^6.3.2`; latest 6.3.3, modified 2026-05-14 | Static pages, Astro components, dynamic source-detail routes | Existing site is Astro static output; Astro pages support file-based routing and data-driven dynamic routes. [VERIFIED: /home/prannayag/harness_eng/site/package.json] [VERIFIED: npm registry] [CITED: https://docs.astro.build/en/core-concepts/astro-pages/] |
| `@astrojs/starlight` | installed/latest 0.39.2, modified 2026-05-08 | Docs/book shell, sidebar, page chrome, search integration | Existing site uses Starlight; Starlight config supports sidebar arrays, custom CSS, table of contents, title/logo, and Pagefind. [VERIFIED: /home/prannayag/harness_eng/site/package.json] [VERIFIED: npm registry] [CITED: https://starlight.astro.build/reference/configuration/] |
| `typescript` | installed `^6.0.3` | Typed book spine, presentation metadata, component props, tests | Existing site is TypeScript-based and project conventions require type-safe TypeScript where TypeScript is used. [VERIFIED: /home/prannayag/harness_eng/site/package.json] [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md] |
| `zod` | installed/latest 4.4.3, modified 2026-05-04 | Runtime schema validation for corpus/presentation/formal fixtures | Existing inventory schema already uses Zod; extending schema coverage avoids ad-hoc metadata validation. [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.schema.ts] [VERIFIED: npm registry] |
| `katex` | installed `^0.16.46`; latest 0.16.47, modified 2026-05-16 | Math HTML/CSS rendering for theorem and derivation fixtures | Existing Astro config uses KaTeX via `rehype-katex`; KaTeX supports server-side/render-to-string HTML output and many math functions, with unsupported commands documented. [VERIFIED: /home/prannayag/harness_eng/site/astro.config.mjs] [VERIFIED: npm registry] [CITED: https://github.com/KaTeX/KaTeX/blob/main/docs/api.md] |
| `remark-math` | installed/latest 6.0.0, modified 2023-11-20 | Markdown math parsing | Existing static math pipeline uses it. [VERIFIED: /home/prannayag/harness_eng/site/astro.config.mjs] [VERIFIED: npm registry] |
| `rehype-katex` | installed/latest 7.0.1, modified 2024-08-19 | Markdown math to KaTeX HTML transform | Existing static math pipeline uses it. [VERIFIED: /home/prannayag/harness_eng/site/astro.config.mjs] [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vitest` | installed/latest 4.1.6, modified 2026-05-11 | Unit tests for book spine order, metadata derivation, component fixture data | Use for pure data and helper tests; existing `bun run test` passes 18 tests. [VERIFIED: /home/prannayag/harness_eng/site/package.json] [VERIFIED: local command `bun run test`] |
| `@astrojs/check` | installed/latest 0.9.9, modified 2026-04-28 | Astro/TypeScript diagnostics | Use before/after adding Astro pages and components; existing `bun run check` passes. [VERIFIED: /home/prannayag/harness_eng/site/package.json] [VERIFIED: local command `bun run check`] |
| `pagefind` | installed `^1.5.2` | Static search index generation after build | Keep as existing build artifact only; full search UX tuning is Phase 4. [VERIFIED: /home/prannayag/harness_eng/site/package.json] [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Starlight sidebar | Custom router/layout from scratch | Do not hand-roll the book shell; Starlight already owns docs/sidebar chrome and is installed. [CITED: https://starlight.astro.build/reference/configuration/] [VERIFIED: /home/prannayag/harness_eng/site/package.json] |
| Astro dynamic route pages | Thirteen hand-authored `.mdx` placeholder pages | Dynamic routes reduce source-link duplication and ensure every source-detail page uses inventory metadata; hand-authored pages are acceptable only for curated Phase 3 content. [CITED: https://docs.astro.build/en/reference/routing-reference/] [ASSUMED] |
| New UI framework | React/Svelte component library | Not needed for Phase 2; Astro components plus MDX are enough for static formal blocks unless interactive widgets are later required. [ASSUMED] |
| Runtime MathJax | Browser-side math rendering | Existing build-time KaTeX pipeline is already configured and fits static output; do not add runtime math unless KaTeX lacks a needed command in a verified fixture. [VERIFIED: /home/prannayag/harness_eng/site/astro.config.mjs] [CITED: https://github.com/KaTeX/KaTeX/blob/main/docs/support_table.md] |

**Installation:**
```bash
cd /home/prannayag/harness_eng/site
bun install
# No new dependency is required for the recommended Phase 2 stack.
```

**Version verification:** Package versions above were checked with `npm view [package] version time.modified` on 2026-05-18. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```text
Typed corpus inventory (`site/src/data/corpus.ts`)
        |
        v
Presentation/book-spine module (`bookSpine` conceptual-arc order)
        |
        +--> Starlight sidebar config (overview -> umbrella -> 12 pillars)
        |
        +--> Atlas homepage constellation
        |       |
        |       +--> Pillar click links to Phase 2 source-detail route
        |
        +--> Astro dynamic source-detail routes
        |       |
        |       +--> Summary
        |       +--> Canonical .tex / PDF / bibliography links
        |       +--> Source-status treatment
        |       +--> Footer previous/next from same book spine
        |
        +--> Formal fixture page(s)
                |
                +--> DefinitionBlock / TheoremBlock / DerivationWalkthrough
                +--> CitationRef / SourceTrail with visible provenance
                +--> Existing KaTeX static math pipeline

Developer runs `bun run build`
        |
        +--> `bun run validate` proves canonical source paths
        +--> Astro emits static HTML
        +--> Pagefind indexes generated static pages
```

### Recommended Project Structure

```text
site/
├── astro.config.mjs                     # Starlight sidebar imports the shared book spine
├── src/
│   ├── components/
│   │   ├── AtlasConstellation.astro      # Homepage pillar constellation
│   │   ├── BookFooterNav.astro           # Subtle previous/next navigation
│   │   ├── SourceLinkPanel.astro         # Canonical PDF/source/bib/source-status links
│   │   └── formal/
│   │       ├── DefinitionBlock.astro
│   │       ├── TheoremBlock.astro
│   │       ├── DerivationWalkthrough.astro
│   │       ├── CitationRef.astro
│   │       └── SourceTrail.astro
│   ├── data/
│   │   ├── corpus.ts                     # Existing canonical inventory; do not duplicate paths
│   │   ├── corpus.schema.ts              # Existing status labels/schema
│   │   └── book-spine.ts                 # Conceptual-arc order + previous/next helpers
│   ├── content/docs/
│   │   ├── index.mdx                     # Polished atlas homepage
│   │   └── formal-reading-fixture.mdx    # Rendering fixture for all formal components
│   ├── pages/
│   │   ├── inventory.astro               # Existing inventory may remain or link from source-detail pages
│   │   └── corpus/[slug].astro           # Generated umbrella/pillar source-detail pages
│   └── styles/
│       └── atlas.css                     # Phase 2 tokens, Starlight overrides, formal-block CSS
```

### Pattern 1: One Shared Book Spine

**What:** Add a typed `bookSpine` module that orders overview, umbrella, and all twelve pillars in the locked conceptual arc. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]

**When to use:** Use the module for sidebar config, homepage constellation ordering, source-detail route links, and previous/next helpers. [ASSUMED]

**Example:**
```typescript
// Source: Phase 2 D-05/D-06 and existing corpusEntries inventory.
import { corpusEntries } from './corpus';

export const pillarArc = [
  'abstraction',
  'information',
  'reliability',
  'coordination',
  'temporal',
  'economics',
  'model-routing',
  'human-interaction',
  'quality',
  'security',
  'governance',
  'accretion',
] as const;

const byId = new Map(corpusEntries.map((entry) => [entry.id, entry]));

export const bookSpine = [
  { id: 'overview', title: 'Overview', href: '/' },
  { id: 'umbrella', title: byId.get('umbrella')!.title, href: '/corpus/umbrella/' },
  ...pillarArc.map((id) => {
    const entry = byId.get(id)!;
    return { id, title: entry.title, href: `/corpus/${entry.slug}/` };
  }),
];
```

**Planning note:** The sample arc above is a recommended conceptual flow from foundations to information/reliability, scaling/economics/routing/human interaction, and then quality/security/governance/accretion; because D-06 locks only “conceptual-arc order,” planners may adjust the exact order if they document the rationale and use one shared module. [ASSUMED]

### Pattern 2: Generated Source-Detail Pages from Inventory

**What:** Use an Astro dynamic route with `getStaticPaths()` over `corpusEntries` to generate one umbrella page and twelve pillar source-detail pages. [CITED: https://docs.astro.build/en/reference/routing-reference/] [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.ts]

**When to use:** Use for Phase 2 source-detail pages; do not hand-author full curated chapters yet. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]

**Example:**
```astro
---
// Source: Astro getStaticPaths docs and existing corpusEntries inventory.
import { corpusEntries } from '../../data/corpus';
import SourceLinkPanel from '../../components/SourceLinkPanel.astro';
import BookFooterNav from '../../components/BookFooterNav.astro';

export function getStaticPaths() {
  return corpusEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---
<main data-pagefind-body>
  <p class="atlas-eyebrow">{entry.kind}</p>
  <h1>{entry.title}</h1>
  <p>{entry.summary}</p>
  <SourceLinkPanel entry={entry} />
  <BookFooterNav currentId={entry.id} />
</main>
```

### Pattern 3: MDX-Importable Formal Components

**What:** Implement formal blocks as reusable components that can be imported into MDX fixtures and later Phase 3 chapters. [CITED: https://mdxjs.com/docs/what-is-mdx/]

**When to use:** Use for definitions, theorem-like claims, derivation walkthroughs, citations, and source trails; every block must expose type/label, stable ID, owner context, and canonical source link. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]

**Example:**
```mdx
import DefinitionBlock from '../../components/formal/DefinitionBlock.astro'
import SourceTrail from '../../components/formal/SourceTrail.astro'

<DefinitionBlock
  id="fixture-definition-harness"
  label="Definition 0.1"
  owner="umbrella"
  sourceHref="/science/paper/science.tex"
>
  A fixture definition proves the formal block shell, anchor, metadata row, and visible source trail.

  <SourceTrail
    canonicalTex="science/paper/science.tex"
    canonicalPdf="science/paper/science.pdf"
    note="Fixture only; curated formal content is Phase 3."
  />
</DefinitionBlock>
```

### Pattern 4: Responsive Math and Notebook Derivations

**What:** Wrap dense math and derivation cells in components/styles that preserve KaTeX output, allow horizontal scrolling for unavoidable wide equations, and keep explanatory prose alternating with math/code-like cells. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] [ASSUMED]

**When to use:** Use in the formal fixture page and later Phase 3 derivations. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]

**Example:**
```css
/* Source: WCAG 2.2 Reflow/Text Spacing requirements and existing KaTeX CSS pipeline. */
.formal-math-cell {
  overflow-x: auto;
  padding: var(--space-md);
  border: 1px solid var(--atlas-border);
  background: var(--atlas-surface-raised);
}

.formal-math-cell .katex-display {
  margin: 0;
  min-width: max-content;
}
```

### Anti-Patterns to Avoid

- **Duplicating canonical links:** Do not copy source/PDF/bib paths into MDX pages when `corpusEntries` already owns them. [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.ts]
- **Inventory order leakage:** Do not silently use current `corpusEntries` order as the book order; D-06 requires a conceptual arc. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]
- **Homepage as manifesto:** Do not lead with a text-first opening; D-01 requires a visual corpus map first. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]
- **Decorative atlas over readability:** Do not use low-contrast grid lines, tiny labels, focus-obscuring effects, or narrow-screen two-axis layouts. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] [CITED: https://www.w3.org/WAI/WCAG22/quickref/]
- **Full curated chapters in Phase 2:** Do not write full pillar content; source-detail pages are placeholders ready for Phase 3 expansion. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]
- **Hidden provenance:** Do not hide source trails behind expandable-only UI; D-16 requires detailed source trails visible by default. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Documentation/book chrome | Custom router, custom sidebar, custom page shell | Starlight sidebar and static docs shell | Starlight already provides configurable sidebar, page chrome, custom CSS hooks, TOC, and Pagefind integration. [CITED: https://starlight.astro.build/reference/configuration/] |
| Source-detail route generation | Thirteen manually duplicated pages | Astro dynamic route with `getStaticPaths()` over `corpusEntries` | Keeps canonical metadata single-sourced and build-time static. [CITED: https://docs.astro.build/en/reference/routing-reference/] [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.ts] |
| Formal-object rendering primitives | One-off CSS examples in arbitrary MDX | Reusable Astro/MDX components with fixtures | D-13 explicitly requires a component library, not just CSS examples. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md] |
| Math rendering | Regex TeX parsing or browser-only math rendering | Existing `remark-math` + `rehype-katex` + KaTeX CSS pipeline | The pipeline is already configured and verified by the Phase 1 math fixture. [VERIFIED: /home/prannayag/harness_eng/site/astro.config.mjs] [VERIFIED: /home/prannayag/harness_eng/site/src/content/docs/math-fixture.mdx] |
| Accessibility checks | Visual inspection only | WCAG-derived acceptance checks plus `bun run check`/fixtures | Keyboard, focus, contrast, reflow, headings, and text spacing are explicit requirements. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] [CITED: https://www.w3.org/WAI/WCAG22/quickref/] |

**Key insight:** The book interface should be data-driven, not page-copy-driven. The same spine and corpus metadata must render homepage links, sidebar, source-detail pages, source panels, and footer navigation. [ASSUMED]

## Common Pitfalls

### Pitfall 1: Building a beautiful but inaccessible atlas
**What goes wrong:** Constellation lines, map textures, and tiny labels reduce contrast, obscure focus rings, or break on narrow screens. [ASSUMED]
**Why it happens:** Decorative identity work can outpace accessibility constraints. [ASSUMED]
**How to avoid:** Treat WCAG 2.2 keyboard, focus visible, contrast, non-text contrast, reflow, text spacing, headings, and bypass-blocks criteria as acceptance checks for every polished surface. [CITED: https://www.w3.org/WAI/WCAG22/quickref/]
**Warning signs:** Text below readable size, focus outlines overridden, constellation links only discoverable by hover, or horizontal page scrolling at 320 CSS px. [CITED: https://www.w3.org/WAI/WCAG22/quickref/]

### Pitfall 2: Duplicating navigation order
**What goes wrong:** Sidebar, homepage, and previous/next links drift from each other. [ASSUMED]
**Why it happens:** Starlight sidebar config, homepage UI, and footer nav are implemented independently. [ASSUMED]
**How to avoid:** Create one typed `bookSpine` module and import it into config/components. [ASSUMED]
**Warning signs:** A plan edits `astro.config.mjs`, homepage links, and footer links with separate hard-coded arrays. [ASSUMED]

### Pitfall 3: Accidentally doing Phase 3 content work
**What goes wrong:** Phase 2 expands into full curated pillar chapters and formal registry work. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]
**Why it happens:** Source-detail pages are close to chapter pages, so placeholders invite content expansion. [ASSUMED]
**How to avoid:** Keep each pillar page to summary, canonical links, source status, and navigation; put formal content only in fixtures proving reusable components. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]
**Warning signs:** Tasks mention glossary, formal object registry, full derivation extraction, or complete pillar interpretation sections. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]

### Pitfall 4: Treating formal blocks as decorative callouts
**What goes wrong:** Blocks look nice but lack stable IDs, owning context, source links, or detailed source trails. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]
**Why it happens:** Designers model blocks after generic admonitions instead of formal research objects. [ASSUMED]
**How to avoid:** Make required props/markup enforce type, label, anchor, owner, and source trail in the component contract. [ASSUMED]
**Warning signs:** The fixture contains `<aside class="theorem">` without `id`, source, or owner metadata. [ASSUMED]

### Pitfall 5: Wide equations breaking mobile reading
**What goes wrong:** Aligned equations and KaTeX display blocks force the whole page wider than the viewport. [ASSUMED]
**Why it happens:** Display math often has natural width beyond narrow mobile screens. [ASSUMED]
**How to avoid:** Scope horizontal overflow to math cells only, preserve semantic headings/prose width, and fixture-test aligned equations on narrow screens. [ASSUMED] [CITED: https://www.w3.org/WAI/WCAG22/quickref/]
**Warning signs:** `body` or main content scrolls horizontally; `.katex-display` lacks a contained overflow strategy. [ASSUMED]

## Code Examples

### Starlight sidebar from shared spine
```javascript
// Source: Starlight sidebar config docs and Phase 2 book-spine requirement.
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { bookSidebar } from './src/data/book-spine';

export default defineConfig({
  output: 'static',
  integrations: [
    starlight({
      title: 'Harness Architecture Book Wiki',
      customCss: ['katex/dist/katex.min.css', './src/styles/atlas.css'],
      sidebar: bookSidebar,
    }),
  ],
});
```

### Astro dynamic source-detail route
```astro
---
// Source: Astro getStaticPaths routing docs.
import { corpusEntries } from '../../data/corpus';

export function getStaticPaths() {
  return corpusEntries.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}

const { entry } = Astro.props;
---
<h1>{entry.title}</h1>
<a href={`/${entry.canonicalPdf}`}>Canonical PDF</a>
<a href={`/${entry.canonicalTex}`}>Canonical source</a>
```

### MDX formal block fixture
```mdx
import TheoremBlock from '../components/formal/TheoremBlock.astro'

<TheoremBlock
  id="fixture-theorem-verified-iteration"
  label="Fixture Theorem"
  owner="temporal"
  sourceHref="/pillars/temporal/paper/temporal_architecture.tex"
>
  If verification capacity is constrained, iteration speed and quality must be interpreted together.
</TheoremBlock>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hand-authored docs navigation | Data/config-driven Starlight sidebar and generated pages | Current Starlight docs support configured sidebar arrays and groups. [CITED: https://starlight.astro.build/reference/configuration/] | Use shared spine data instead of duplicated links. |
| Static site pages only as hand-written files | Astro dynamic routes generated at build time from local data | Current Astro docs describe `getStaticPaths()` for generating prerendered routes from data. [CITED: https://docs.astro.build/en/reference/routing-reference/] | Generate source-detail pages from the validated inventory. |
| Markdown-only formal callouts | MDX-imported reusable components | MDX docs state markdown can use JSX/components via imports. [CITED: https://mdxjs.com/docs/what-is-mdx/] | Formal blocks can have typed props, anchors, metadata, and visible source trails. |
| Generic responsive docs styling | WCAG-informed formal reading interface | WCAG 2.2 quick reference lists keyboard, focus, contrast, reflow, headings, and text-spacing criteria. [CITED: https://www.w3.org/WAI/WCAG22/quickref/] | Design acceptance must include accessibility behavior, not only visual polish. |

**Deprecated/outdated:**
- Hosted search or runtime search service for Phase 2: violates v1 static/local constraints and is not needed for the locked Phase 2 scope. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]
- Replacing Starlight with a bespoke app shell: contradicts the working Phase 1 foundation and increases implementation surface without a verified blocker. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-04-SUMMARY.md]
- Treating source-detail pages as full chapters: Phase 2 explicitly stops at lightweight source-detail treatment; Phase 3 owns curated chapter substance. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Put conceptual-arc order in one typed module, not separate UI files. | Summary / Architecture Patterns | Medium; if Astro config cannot import the module cleanly, duplicate generation may require a build-time adapter. |
| A2 | Browser renders CSS-only constellation interactions and links. | Architectural Responsibility Map | Low; richer client interaction may be acceptable, but MVP does not require it. |
| A3 | Dynamic routes reduce source-link duplication compared with thirteen hand-authored pages. | Alternatives Considered | Low; hand-authored pages can still import metadata, but dynamic pages are simpler for Phase 2 source-detail scope. |
| A4 | Astro components plus MDX are enough for static formal blocks without React/Svelte. | Alternatives Considered | Medium; if Starlight/MDX integration imposes component constraints, implementation may need minor adaptation. |
| A5 | The recommended pillar arc sample is a reasonable conceptual flow. | Pattern 1 | Medium; planner should document or revise the final arc before implementation. |
| A6 | Wide display math needs contained horizontal overflow on narrow screens. | Pitfalls / Pattern 4 | Low; exact CSS may vary, but the mobile risk is real for dense equations. |
| A7 | Source-detail route should probably live under `/corpus/[slug]/`. | Architecture Patterns | Low; planner may choose another stable path if sidebar and links use it consistently. |

## Open Questions

All Phase 2 research questions are resolved for planning. The resolved decisions below are binding for the existing PLAN.md files unless a later user decision supersedes them.

1. **RESOLVED — Exact conceptual-arc order.**
   - Resolution: Use this order everywhere the Phase 2 book spine, homepage constellation, source-detail page navigation, and footer previous/next links need corpus order: Overview, Umbrella framework, Abstraction, Information, Reliability, Coordination, Temporal, Economics, Model Routing, Human Interaction, Quality, Security, Governance, Accretion.
   - Rationale: This matches the UI design contract and follows a foundations-to-operations conceptual arc while honoring D-05 and D-06.

2. **RESOLVED — Source-detail page shell choice.**
   - Resolution: Use Astro-generated `/corpus/[slug]/` pages from `corpusEntries`, but render the shared `bookSpine` navigation directly on those pages so the stable `Book spine` and current-page state are present even though the route is not a hand-authored Starlight docs page.
   - Rationale: Dynamic Astro pages keep canonical source metadata single-sourced and satisfy D-07, while the explicit shared spine sidebar closes the chrome gap that plain Astro pages would otherwise create.

3. **RESOLVED — MVP polish scope.**
   - Resolution: Implement rich static scholarly-atlas polish with CSS/static SVG/HTML constellation, cartographic framing, source cards, and formal-reading surfaces; avoid animation unless nonessential and disabled under `prefers-reduced-motion: reduce`.
   - Rationale: This satisfies D-09 and D-10 without violating D-12 readability, keyboard focus, contrast, math legibility, source-trail clarity, or narrow-screen reflow.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Package manager/build runner | yes | 1.3.12 | None needed; existing scripts use Bun. [VERIFIED: local command] |
| Node.js | Astro/npm tooling | yes | v24.14.0 | Bun runtime for package scripts. [VERIFIED: local command] |
| npm | Version verification | yes | 11.9.0 | Bun for implementation. [VERIFIED: local command] |
| Astro/Starlight site workspace | Phase 2 implementation | yes | `site/` with Astro/Starlight config | None; use existing workspace. [VERIFIED: /home/prannayag/harness_eng/site/package.json] |
| Existing tests | Regression validation | yes | Vitest 4.1.6; 18 tests passed | Add focused tests if new helpers are introduced. [VERIFIED: local command `bun run test`] |
| Astro check | Type/content validation | yes | `@astrojs/check` 0.9.9; 0 errors/warnings/hints | None. [VERIFIED: local command `bun run check`] |
| Planning graph | Optional graph context | no | `.planning/graphs/graph.json` absent | Used direct planning/codebase reads. [VERIFIED: local command] |

**Missing dependencies with no fallback:**
- None for the recommended Phase 2 plan. [VERIFIED: local environment]

**Missing dependencies with fallback:**
- Planning graph is absent; direct planning files and site source reads provided the needed context. [VERIFIED: local command]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts, login, or identity features are in Phase 2 scope. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V3 Session Management | no | Static site has no sessions. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V4 Access Control | no | Phase 2 publishes public static documentation pages only. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V5 Input Validation | yes | Continue Zod/schema validation for corpus/presentation data and avoid unsafe path/link construction. [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.schema.ts] |
| V6 Cryptography | no | No cryptographic functionality is in scope; do not hand-roll cryptography. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |

### Known Threat Patterns for Static Research Site UI

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Canonical source spoofing through duplicated links | Spoofing / Tampering | Render source/PDF/bib links from validated `corpusEntries`, not copied page literals. [VERIFIED: /home/prannayag/harness_eng/site/src/data/corpus.ts] |
| Archive content presented as active canonical material | Tampering / Repudiation | Preserve Phase 1 archive rejection/provenance-only source-status treatment. [VERIFIED: /home/prannayag/harness_eng/site/src/content/docs/provenance-contract.mdx] |
| Accessibility failure hiding content from keyboard or low-vision users | Denial of Service | WCAG keyboard, focus, contrast, reflow, headings, and text-spacing criteria must be acceptance checks. [CITED: https://www.w3.org/WAI/WCAG22/quickref/] |
| Unnecessary third-party script/service added for visual polish | Information Disclosure / Availability | Keep atlas effects static/CSS/SVG and avoid analytics, hosted search, CDN-only math, or runtime service dependencies in Phase 2. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] [ASSUMED] |

## Sources

### Primary (HIGH confidence)
- `/home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md` — locked Phase 2 product decisions, scope, code insights, and deferred boundaries. [VERIFIED: local file]
- `/home/prannayag/harness_eng/.planning/REQUIREMENTS.md` — requirement definitions and Phase 2 traceability. [VERIFIED: local file]
- `/home/prannayag/harness_eng/.planning/ROADMAP.md` — Phase 2 goal, MVP mode, dependency, success criteria, and later-phase scope. [VERIFIED: local file]
- `/home/prannayag/harness_eng/.planning/STATE.md` — current project state and Phase 2 focus. [VERIFIED: local file]
- `/home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md` and individual Plan 01-04 summaries — Phase 1 locked decisions and implementation outputs. [VERIFIED: local files]
- `/home/prannayag/harness_eng/site/package.json`, `astro.config.mjs`, `src/data/corpus.ts`, `src/data/corpus.schema.ts`, `src/pages/inventory.astro`, `src/styles/phase-1.css` — existing implementation foundation. [VERIFIED: local files]
- Starlight docs via Context7/WebFetch — sidebar, custom CSS, table of contents, Pagefind, title/logo configuration. [CITED: https://starlight.astro.build/reference/configuration/]
- Astro docs via Context7/WebFetch — pages, dynamic routes, `getStaticPaths()`, static endpoint generation. [CITED: https://docs.astro.build/en/core-concepts/astro-pages/] [CITED: https://docs.astro.build/en/reference/routing-reference/] [CITED: https://docs.astro.build/en/guides/endpoints/]
- MDX docs via Context7/WebFetch — importing and using JSX/components inside Markdown. [CITED: https://mdxjs.com/docs/what-is-mdx/]
- KaTeX docs via Context7 — server/render output and supported functions table. [CITED: https://github.com/KaTeX/KaTeX/blob/main/docs/api.md] [CITED: https://github.com/KaTeX/KaTeX/blob/main/docs/support_table.md]
- WCAG 2.2 quick reference via WebFetch — keyboard, focus, headings, contrast, reflow, text spacing criteria. [CITED: https://www.w3.org/WAI/WCAG22/quickref/]
- npm registry — current versions and modified timestamps for core packages. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)
- System-provided project `CLAUDE.md` content — actionable project constraints; direct filesystem read returned file-not-found in this session, but the system reminder provided the content. [VERIFIED: system-provided /home/prannayag/harness_eng/CLAUDE.md]

### Tertiary (LOW confidence)
- Assumptions listed in the Assumptions Log; mostly implementation mechanics, exact visual approach, and conceptual arc recommendation. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — existing Phase 1 site stack is implemented and package versions were verified against npm. [VERIFIED: /home/prannayag/harness_eng/site/package.json] [VERIFIED: npm registry]
- Architecture: HIGH — Phase 2 scope and Phase 1 dependency are explicit in CONTEXT/ROADMAP and the existing site files. [VERIFIED: local planning files] [VERIFIED: local site files]
- Pitfalls: MEDIUM — scope, source, and accessibility pitfalls are verified, but implementation warning signs are partly planning heuristics. [VERIFIED: local planning files] [CITED: https://www.w3.org/WAI/WCAG22/quickref/] [ASSUMED]

**Research date:** 2026-05-18  
**Valid until:** 2026-05-25 for package-version freshness; Phase 2 product constraints remain valid until CONTEXT.md or ROADMAP.md changes. [ASSUMED]
