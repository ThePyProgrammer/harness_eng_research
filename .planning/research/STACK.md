# Stack Research

**Domain:** Static academic book/wiki website for a Markdown/LaTeX research corpus
**Researched:** 2026-05-13
**Confidence:** HIGH for Astro/Starlight/Pagefind/Markdown/MDX/math; MEDIUM for citation and graph-link implementation details

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Node.js | 22.12.0+ LTS/even-numbered only | JavaScript runtime for the static site build | Astro's current docs require Node v22.12.0+ and explicitly do not support odd-numbered releases. Use this baseline now instead of inheriting the repo's older optional Node 18+ guidance. | HIGH |
| pnpm | 10.x | Package manager | Use pnpm for deterministic installs, fast workspace behavior, and less dependency sprawl. npm is acceptable, but this repo is adding a new web app surface; pick one package manager and lock it. | MEDIUM |
| Astro | 6.3.x | Static site framework | Astro is the right base because this is content-first, static, and needs Markdown/MDX pipelines with custom components but not a client-side app shell. Astro defaults to static output and supports remark/rehype plugins and content collections. | HIGH |
| Astro Starlight | 0.39.x | Documentation/book site framework on Astro | Starlight gives the boring-but-correct spine: sidebar navigation, docs routing, page metadata, accessibility, responsive docs UX, source/edit links, custom CSS, plugins, and built-in Pagefind search. Start here instead of hand-rolling a book shell. | HIGH |
| Astro content collections | Astro 6 built-in | Typed content model for chapters, glossary, definitions, theorems, citations, and concept pages | The corpus needs more than loose Markdown pages. Collections with Zod schemas let roadmap phases enforce fields like source file, pillar, citation keys, theorem IDs, related concepts, and canonical PDF/source links. | HIGH |
| Markdown + MDX | `@astrojs/mdx` 5.0.x | Curated research chapters with embedded components | Markdown is the natural authoring layer; MDX is needed for theorem boxes, derivation components, source trails, graph widgets, citation lists, and callouts without making authors write full Astro pages. | HIGH |
| Pagefind | 1.5.x | Local/static full-text search | Pagefind has no server component, indexes the built static HTML, and is Starlight's default search provider. It fits the explicit no-hosted-search/no-database requirement. | HIGH |
| KaTeX via remark/rehype | `remark-math` 6.0.x + `rehype-katex` 7.0.x | Mathematical notation rendering | This is the standard Markdown math pipeline: parse `$...$`/`$$...$$` with remark-math and render fast static HTML with KaTeX. Use MathJax only if KaTeX coverage is insufficient for specific LaTeX macros. | HIGH |
| rehype-citation + Citation.js | `rehype-citation` 2.3.x + `citation-js` 0.7.x | Bibliography and in-page citations from BibTeX/CSL data | The existing canonical papers already have BibTeX. rehype-citation works in the rehype pipeline, supports BibTeX/CSL-JSON/CFF, common CSL styles, and bibliography generation. Validate against the actual `.bib` files early because citation pipelines are always where polished docs stacks start lying to you. | MEDIUM |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| `@astrojs/mdx` | 5.0.x | MDX integration for Astro | Use for all curated pages that need theorem/definition/source/citation components. Plain `.md` is fine for simple landing pages. | HIGH |
| `remark-math` | 6.0.x | Parse inline and display math in Markdown/MDX | Enable globally for Markdown and MDX content. | HIGH |
| `rehype-katex` | 7.0.x | Render parsed math as KaTeX HTML | Use as the default renderer; include KaTeX CSS globally. | HIGH |
| `rehype-citation` | 2.3.x | Convert citation syntax into formatted citations and bibliographies | Use for chapter pages and bibliography pages. Prefer a single generated/normalized bibliography file per corpus or per pillar. | MEDIUM |
| `citation-js` | 0.7.x | Bibliography parsing/conversion engine | Use in preprocessing scripts to normalize `.bib` files to CSL-JSON if rehype-citation integration needs stricter inputs. | MEDIUM |
| `remark-gfm` | 4.0.x | GitHub-flavored Markdown, footnotes, tables | Use because notes and citations commonly need tables and footnotes; rehype-citation note-style citations expect GFM footnotes. | HIGH |
| `shiki` | 4.0.x | Syntax highlighting | Astro/Starlight already uses modern highlighting patterns; use Shiki for consistent static code highlighting where needed. | HIGH |
| `mermaid` | 11.15.x | Lightweight diagrams in docs | Use sparingly for roadmap/architecture diagrams if generated SVG diagrams are needed. Do not make it core to theorem/corpus navigation. | MEDIUM |
| `d3` | 7.9.x | Custom graph-style concept map | Use for a bespoke, static concept graph when Starlight pages need richer cross-link visualization than backlinks. Generate graph data at build time. | MEDIUM |
| `cytoscape` | 3.33.x | Alternative graph visualization engine | Use instead of D3 only if force-directed graph interaction becomes a real feature, not decorative chrome. It is heavier but more graph-native. | MEDIUM |
| `gray-matter` | 4.0.x | Frontmatter parsing in custom scripts | Use in build-time extraction scripts if Astro content collections are not enough for source-map generation. | MEDIUM |
| `unist-util-visit` | 5.1.x | AST traversal for remark/rehype plugins | Use when writing custom plugins for theorem IDs, source-link injection, concept backlinks, or citation/source validation. | HIGH |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| TypeScript | Type-safe site configuration, content schemas, and build scripts | Use strict TypeScript for `astro.config`, content schemas, graph extraction, and citation normalization. This avoids stringly-typed corpus metadata rot. |
| Zod | Schema validation for content collections | Astro exposes Zod for collection schemas. Require fields like `title`, `pillar`, `source`, `canonicalPdf`, `tags`, and `related`. |
| ESLint + Prettier | Keep TypeScript/MDX support code readable | Configure lightly. Do not spend a roadmap phase bikeshedding formatting. |
| LaTeX toolchain / Pandoc | Existing source conversion/reference support | Keep existing LaTeX as canonical. Use Pandoc only as an assistive conversion tool, not as the authoritative website generator. |
| Custom extraction scripts | Build graph/source/citation indexes | Write small TypeScript scripts that read curated frontmatter and explicit cross-link fields first; only later add deeper LaTeX parsing. |

## Installation

```bash
# In the future site package/directory
pnpm create astro@latest
pnpm add @astrojs/starlight @astrojs/mdx pagefind

# Markdown, math, citations, and content processing
pnpm add remark-math rehype-katex remark-gfm rehype-citation citation-js unist-util-visit gray-matter

# Optional graph/diagram support
pnpm add d3 mermaid
pnpm add -D @types/d3 typescript prettier eslint
```

If the site is created as a subdirectory, use a dedicated lockfile and document the site root. Do not smear Node dependencies across the existing LaTeX corpus without a clear package boundary.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro + Starlight | Docusaurus 3.10.x | Use Docusaurus only if React-specific interactivity, mature docs versioning, or a large plugin ecosystem matters more than minimal static output. It is heavier and more app-like than this corpus needs. |
| Astro + Starlight | VitePress 1.6.x | Use VitePress if the team already wants Vue and a conventional docs/book site. It is less compelling for a heavily customized academic wiki with typed content collections and bespoke components. |
| Astro + Starlight | Quartz | Use Quartz if the project is actually an Obsidian/digital-garden publication with wikilinks/backlinks/graph as the primary model. This repo is a curated academic corpus with canonical LaTeX papers, so Quartz's note-first assumptions are close but not quite right. |
| Pagefind | Algolia DocSearch | Use Algolia only if public hosted search quality becomes a major requirement and external service dependency is acceptable. It violates the v1 local/static search preference. |
| Pagefind | Typesense DocSearch | Use only if self-hosted search becomes necessary. It adds infrastructure the v1 explicitly does not need. |
| KaTeX | MathJax | Use MathJax if KaTeX cannot render required LaTeX constructs/macros. Otherwise KaTeX is faster and simpler for static pages. |
| Curated MDX pages | Fully automatic LaTeX-to-HTML conversion | Use automatic conversion only as a draft accelerator. The project explicitly needs readable curated chapters with source trails, not a mechanically converted paper dump. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Server-side CMS, database, comments, user accounts | The source of truth is already git plus canonical LaTeX/Markdown. A CMS creates a second authority and operational burden. | Static Astro/Starlight content in the repo. |
| Hosted search as the default | The requirement says local/static search. Hosted search adds accounts, indexing pipelines, and failure modes for no v1 benefit. | Pagefind. |
| Fully automatic LaTeX semantic extraction as the v1 pipeline | It will produce brittle, unreadable pages and burn time on macro edge cases. This is exactly the sort of clever automation that looks productive until the bibliography and theorem numbering explode. | Curated MDX pages with explicit source links; add extraction only for validation/indexing later. |
| Raw HTML site generator or hand-rolled navigation | Book navigation, search, accessibility, and mobile docs UX are solved problems. Rebuilding them is vanity engineering. | Starlight sidebar, routes, and Pagefind. |
| Docusaurus by default | Good product, wrong center of gravity: React app/docs platform with more client/runtime surface than a static academic corpus needs. | Astro + Starlight. |
| Quartz as the primary stack | Strong for Obsidian-style notes, but this project is not asking to publish a vault; it is asking for an academic book/wiki over canonical LaTeX papers. | Astro + Starlight with custom graph/backlink data. |
| Treating archive files as content inputs | Archives are provenance artifacts, not active sources. Including them will pollute search and concept graphs. | Index only `science/paper/`, `pillars/*/paper/`, pillar READMEs, and selected active notes/research. |

## Stack Patterns by Variant

**Baseline v1: static academic book**
- Use Astro 6 + Starlight 0.39 + Pagefind 1.5 + MDX + KaTeX.
- Pages are curated under a site content tree, with frontmatter linking back to canonical `.tex`, `.bib`, and `.pdf` sources.
- Because this gives immediate book navigation, local search, math rendering, and source trails without building infrastructure.

**If graph-style cross-links are mostly navigational:**
- Use explicit frontmatter fields (`related`, `dependsOn`, `defines`, `cites`, `sourceFiles`) plus generated JSON graph data.
- Render backlinks/related links as static Starlight components first.
- Because static link panels are more useful than a hairball force graph for serious reading.

**If graph-style exploration becomes a differentiator:**
- Add D3 or Cytoscape as an island component fed by build-generated JSON.
- Keep the graph client-side and optional; do not make it the content model.
- Because the graph should visualize the corpus, not become a second database.

**If citation formatting is unreliable against the corpus `.bib` files:**
- Normalize BibTeX to CSL-JSON using Citation.js in a prebuild step.
- Feed the normalized file to rehype-citation or render bibliography pages from data.
- Because academic citation plugins often fail on messy BibTeX faster than they fail loudly.

**If LaTeX macros exceed KaTeX support:**
- Add a macro compatibility layer first.
- Switch selected pages or the whole pipeline to MathJax only if necessary.
- Because MathJax increases runtime weight and complexity; do not pay that tax speculatively.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Astro 6.3.x | Node 22.12.0+ | Astro's current setup docs require Node v22.12.0+ and reject odd-numbered releases such as v23. |
| Starlight 0.39.x | Astro 6.x | Starlight is an Astro docs framework and should track Astro's current major. Pin both in the lockfile. |
| Pagefind 1.5.x | Starlight 0.39.x static builds | Starlight's default search provider is Pagefind. Pagefind cannot be enabled when prerender/static behavior is disabled. |
| `@astrojs/mdx` 5.0.x | Astro 6.x | MDX integration supports remark/rehype plugin configuration. Configure math/citation plugins in Astro/MDX settings, not ad hoc per page. |
| `remark-math` 6.0.x | `rehype-katex` 7.0.x | Standard unified pipeline: parse math in remark, render with rehype. Include KaTeX CSS. |
| `rehype-citation` 2.3.x | `citation-js` 0.7.x and `remark-gfm` 4.0.x | rehype-citation uses citeproc/citation-js; note-style citations need GFM footnotes. Validate with local `.bib` files in Phase 1. |
| D3 7.9.x | Browser island component | Use only for an optional graph visualization. Build graph data statically. |
| Cytoscape 3.33.x | Browser island component | Use if graph UX requires pan/zoom/layout beyond simple D3 rendering. |

## Recommended Content/Data Model

Use content collections instead of relying on folder names alone:

| Collection | Records | Required fields |
|------------|---------|-----------------|
| `chapters` | Overview and book-like chapter pages | `title`, `description`, `order`, `sourceFiles`, `canonicalPdf`, `pillar?`, `related` |
| `pillars` | One page per pillar | `title`, `slug`, `focus`, `paperSource`, `paperPdf`, `bibFile`, `readingPath`, `relatedPillars` |
| `definitions` | Formal definitions and glossary terms | `term`, `statement`, `sourceFile`, `sourceAnchor?`, `pillar`, `related`, `citationKeys` |
| `theorems` | Theorems, propositions, lemmas, assumptions | `kind`, `label`, `statement`, `assumptions`, `derivationPage`, `sourceFile`, `pillar`, `citationKeys` |
| `bibliography` | Normalized citation records | `key`, `title`, `authors`, `year`, `sourceBib`, `usedBy` |

This is the line in the sand: source trails must be data, not prose promises. If a page cannot point back to canonical source files, it is an unreviewable fork.

## Sources

- Context7 `/withastro/docs` — verified Astro Markdown/MDX plugin configuration, content collection loader patterns, and remark/rehype integration. Confidence: HIGH.
- Context7 `/withastro/starlight` — verified Starlight Pagefind configuration, search exclusion frontmatter, and Pagefind constraints. Confidence: HIGH.
- Astro official docs, install/setup — Node v22.12.0+ requirement, local install guidance, package manager support. Confidence: HIGH.
- Astro official docs, static output/configuration — default static output and server output distinction. Confidence: HIGH.
- Astro official docs, content collections — schema validation, loaders, type safety, and collection use cases. Confidence: HIGH.
- Astro official docs, MDX integration — `@astrojs/mdx`, components in MDX, remark/rehype plugin configuration. Confidence: HIGH.
- Starlight official docs, sidebar/configuration/components/plugins — sidebar navigation, Pagefind, custom CSS, edit links, plugin API, and MDX custom components. Confidence: HIGH.
- Pagefind official docs — static search with no server component, indexing built output, Pagefind 1.5 component UI. Confidence: HIGH.
- `remark-math` / `rehype-katex` official GitHub README — Markdown math parsing and KaTeX/MathJax rendering pipeline. Confidence: HIGH.
- `rehype-citation` official GitHub README — BibTeX/CSL/CFF inputs, citeproc/citation-js support, bibliography insertion, styles, v2.3.2 release clue. Confidence: HIGH for capabilities, MEDIUM for project-specific fit until tested on local `.bib` files.
- Docusaurus official docs — docs/MDX/versioning/search capabilities and v3.10.1 visible version. Confidence: HIGH.
- VitePress official docs — static docs/book site capability and Markdown/Vue model. Confidence: MEDIUM-HIGH.
- Quartz official docs — Obsidian compatibility, graph view, wikilinks, backlinks, and search. Confidence: MEDIUM-HIGH.
- npm package metadata checked 2026-05-13 — current versions: Astro 6.3.1, Starlight 0.39.2, Pagefind 1.5.2, `@astrojs/mdx` 5.0.4, `rehype-katex` 7.0.1, `remark-math` 6.0.0, `rehype-citation` 2.3.2, `citation-js` 0.7.22, Mermaid 11.15.0, D3 7.9.0, Cytoscape 3.33.3, VitePress 1.6.4, Docusaurus 3.10.1. Confidence: HIGH.

---
*Stack research for: static academic book/wiki website for the harness architecture corpus*
*Researched: 2026-05-13*
