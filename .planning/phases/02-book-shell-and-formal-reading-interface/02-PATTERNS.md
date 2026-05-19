# Phase 02: Book Shell and Formal Reading Interface - Pattern Map

**Mapped:** 2026-05-19
**Files analyzed:** 15 new/modified files
**Analogs found:** 15 / 15

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `site/astro.config.mjs` | config | static build config | `site/astro.config.mjs` | exact-modification |
| `site/src/data/book-spine.ts` | utility/data | transform | `site/src/data/corpus.ts` + `site/src/data/corpus.schema.ts` | role-match |
| `site/src/data/book-spine.test.ts` | test | batch/transform validation | `site/src/data/corpus.test.ts` | exact |
| `site/src/content/docs/index.mdx` | content/page | static content render | `site/src/content/docs/index.mdx` + `site/src/content/docs/provenance-contract.mdx` | exact-modification |
| `site/src/components/AtlasConstellation.astro` | component | static render / request-response link navigation | `site/src/pages/inventory.astro` | role-match |
| `site/src/pages/corpus/[slug].astro` | route/page | static generation / request-response | `site/src/pages/inventory.astro` | role-match |
| `site/src/components/SourceLinkPanel.astro` | component | static render / source metadata transform | `site/src/pages/inventory.astro` | exact-section |
| `site/src/components/BookFooterNav.astro` | component | static render / previous-next transform | `site/src/pages/inventory.astro` | partial |
| `site/src/components/formal/DefinitionBlock.astro` | component | static render / formal metadata transform | `site/src/pages/inventory.astro` | role-match |
| `site/src/components/formal/TheoremBlock.astro` | component | static render / formal metadata transform | `site/src/pages/inventory.astro` | role-match |
| `site/src/components/formal/DerivationWalkthrough.astro` | component | static render / notebook cell transform | `site/src/content/docs/math-fixture.mdx` + `site/src/styles/phase-1.css` | partial |
| `site/src/components/formal/CitationRef.astro` | component | static render / citation metadata transform | `site/src/pages/inventory.astro` | partial |
| `site/src/components/formal/SourceTrail.astro` | component | static render / source metadata transform | `site/src/pages/inventory.astro` + `site/src/content/docs/provenance-contract.mdx` | exact-section |
| `site/src/content/docs/formal-reading-fixture.mdx` | content/fixture | static content render / math transform | `site/src/content/docs/math-fixture.mdx` | exact |
| `site/src/styles/atlas.css` | config/style | static style cascade | `site/src/styles/phase-1.css` | exact |

## Pattern Assignments

### `site/astro.config.mjs` (config, static build config)

**Analog:** `site/astro.config.mjs`

**Imports pattern** (lines 1-4):
```javascript
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
```

**Static output and math pipeline pattern** (lines 6-11):
```javascript
export default defineConfig({
  output: 'static',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
```

**Starlight custom CSS/sidebar pattern to update** (lines 12-21):
```javascript
  integrations: [
    starlight({
      title: 'Harness Architecture Book Wiki',
      customCss: ['katex/dist/katex.min.css'],
      sidebar: [
        { label: 'Foundation', slug: 'index' },
        { label: 'Math Fixture', slug: 'math-fixture' },
        { label: 'Corpus Inventory', link: '/inventory/' },
      ],
    }),
  ],
```

**Apply:** Keep `output: 'static'` and math plugins unchanged. Replace `customCss` with KaTeX plus `./src/styles/atlas.css`. Replace hard-coded sidebar with a shared import from `site/src/data/book-spine.ts` if Astro config accepts the TypeScript module, or export a config-safe sidebar structure from that module.

---

### `site/src/data/book-spine.ts` (utility/data, transform)

**Analog:** `site/src/data/corpus.ts` and `site/src/data/corpus.schema.ts`

**Typed inventory import/parse pattern** (`site/src/data/corpus.ts` lines 1-3):
```typescript
import { parseCorpusEntries } from './corpus.schema';

export const corpusEntries = parseCorpusEntries([
```

**Corpus entry shape pattern** (`site/src/data/corpus.ts` lines 4-14):
```typescript
  {
    id: 'umbrella',
    kind: 'umbrella',
    title: 'A Formal Framework for AI Coding Agent Harness Architecture',
    slug: 'umbrella',
    summary: 'Umbrella framework tying together all architectural dimensions',
    canonicalTex: 'science/paper/science.tex',
    canonicalPdf: 'science/paper/science.pdf',
    bibliography: 'science/paper/science.bib',
    sourceStatus: 'canonical',
  },
```

**Const array pattern** (`site/src/data/corpus.schema.ts` lines 14-28):
```typescript
export const expectedCorpusIds = [
  'umbrella',
  'abstraction',
  'information',
  'reliability',
  'coordination',
  'temporal',
  'quality',
  'governance',
  'economics',
  'human-interaction',
  'model-routing',
  'security',
  'accretion',
] as const;
```

**Validation helper export pattern** (`site/src/data/corpus.schema.ts` lines 46-51):
```typescript
export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type CorpusEntry = z.infer<typeof corpusEntrySchema>;

export function parseCorpusEntries(entries: unknown): CorpusEntry[] {
  return corpusEntriesSchema.parse(entries);
}
```

**Apply:** Implement `pillarArc` as `as const`, derive entries from `corpusEntries`, and export `bookSpine`, previous/next helpers, and `bookSidebar`. Do not duplicate canonical paths; use entry IDs/slugs from `corpusEntries`.

---

### `site/src/data/book-spine.test.ts` (test, batch/transform validation)

**Analog:** `site/src/data/corpus.test.ts`

**Vitest import pattern** (lines 1-8):
```typescript
import { describe, expect, it } from 'vitest';
import { corpusEntries } from './corpus';
import {
  corpusEntrySchema,
  expectedCorpusIds,
  parseCorpusEntries,
  sourceStatusSchema,
} from './corpus.schema';
```

**Order assertion pattern** (lines 10-28):
```typescript
describe('corpus schema contract', () => {
  it('defines the expected umbrella and pillar ids in source order', () => {
    expect(expectedCorpusIds).toEqual([
      'umbrella',
      'abstraction',
      'information',
      'reliability',
      'coordination',
      'temporal',
      'quality',
      'governance',
      'economics',
      'human-interaction',
      'model-routing',
      'security',
      'accretion',
    ]);
    expect(expectedCorpusIds).toHaveLength(13);
  });
```

**Inventory completeness pattern** (lines 54-69):
```typescript
describe('corpus inventory contract', () => {
  it('parses explicit corpus entries through the schema', () => {
    expect(parseCorpusEntries(corpusEntries)).toHaveLength(13);
    expect(corpusEntries).toHaveLength(13);
  });

  it('contains every expected corpus id exactly once', () => {
    const ids = corpusEntries.map((entry) => entry.id);

    expect(ids).toEqual([...expectedCorpusIds]);
    expect(new Set(ids).size).toBe(expectedCorpusIds.length);
  });
```

**Apply:** Test that `bookSpine` is `[overview, umbrella, ...12 pillars]`, that the pillar arc follows the UI contract order, that all source-detail URLs are `/corpus/{slug}/`, and that `getPreviousNext()` returns subtle footer neighbors from the same array.

---

### `site/src/content/docs/index.mdx` (content/page, static content render)

**Analog:** `site/src/content/docs/index.mdx`

**Frontmatter pattern** (lines 1-3):
```mdx
---
title: Site Foundation
---
```

**Page structure pattern** (lines 5-9):
```mdx
# Site Foundation

This foundation establishes the static site boundary for the Harness Architecture Book Wiki. The implementation lives under `site/`, while the canonical research corpus remains a read-only input owned by the repository’s existing paper structure.

The site may link to and validate canonical corpus inputs, but builds must not move, replace, or take ownership of files in `science/paper/` or `pillars/*/paper/`. Archive material remains provenance material unless an explicit future page discusses it as provenance.
```

**Internal link pattern** (lines 29-33):
```mdx
## Corpus boundary

The umbrella framework source starts at `science/paper/`. Pillar chapters start at `pillars/*/paper/`. Later inventory and provenance pages must trace each reader-facing page back to those canonical paths instead of becoming untraceable forks.

[Inspect Corpus Inventory](/inventory/)
```

**Provenance language to preserve** (`site/src/content/docs/provenance-contract.mdx` lines 5-9):
```mdx
# Provenance Contract

The book wiki treats `science/paper/` and `pillars/*/paper/` as the executable source-of-truth boundary for canonical corpus material. The website may explain, quote, and cross-link the corpus, but every inventory entry must keep a traceable path back to the canonical paper files.

`bun run validate` is the provenance gate. It validates the typed inventory before static publication, and `bun run build` runs validation before Astro emits static HTML and before local indexes are generated. A build that cannot prove corpus provenance should fail loudly rather than publish a page with a vague or archived source trail.
```

**Apply:** Keep Starlight MDX frontmatter. Import `AtlasConstellation.astro` at the top if needed. Replace foundation copy with the required homepage eyebrow, constellation-led corpus map, `Explore the corpus map` CTA, and introductory essay. Preserve source-of-truth wording.

---

### `site/src/components/AtlasConstellation.astro` (component, static render / request-response link navigation)

**Analog:** `site/src/pages/inventory.astro`

**Astro frontmatter/import pattern** (lines 1-6):
```astro
---
import '../styles/phase-1.css';
import { corpusEntries } from '../data/corpus';
import { sourceStatusLabels } from '../data/corpus.schema';

const entryCount = corpusEntries.length;
---
```

**Collection render pattern** (lines 31-43):
```astro
      ) : (
        <section class="phase-inventory__grid" aria-label={`${entryCount} corpus entries`}>
          {corpusEntries.map((entry) => (
            <article class="phase-inventory__card">
              <div class="phase-inventory__card-header">
                <div>
                  <h2 class="phase-inventory__title">{entry.title}</h2>
                  <p class="phase-inventory__description">{entry.summary}</p>
                </div>
                <span class={`phase-inventory__status phase-inventory__status--${entry.sourceStatus}`}>
                  {sourceStatusLabels[entry.sourceStatus]}
                </span>
```

**Accessible empty state pattern** (lines 26-30):
```astro
      {entryCount === 0 ? (
        <section class="phase-inventory__empty" aria-labelledby="empty-heading">
          <h2 id="empty-heading" class="phase-inventory__title">No corpus entries found</h2>
          <p>Add the umbrella framework and all twelve pillar entries to the typed inventory before running the static build.</p>
        </section>
```

**Apply:** Import `bookSpine`/presentation entries instead of raw `corpusEntries` so keyboard order follows the conceptual arc. Render real `<a>` links with visible labels. Use `aria-label` on the constellation region and avoid hover-only hotspots.

---

### `site/src/pages/corpus/[slug].astro` (route/page, static generation / request-response)

**Analog:** `site/src/pages/inventory.astro`

**Astro page shell pattern** (lines 9-16):
```astro
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Corpus Inventory | Harness Architecture Book Wiki</title>
  </head>
  <body class="phase-inventory">
    <main class="phase-inventory__shell" data-pagefind-body>
```

**Header/content pattern** (lines 17-24):
```astro
      <header class="phase-inventory__header">
        <p class="phase-inventory__eyebrow">Phase 1 provenance contract</p>
        <h1>Corpus Inventory</h1>
        <p class="phase-inventory__summary">
          13 corpus entries render from the typed inventory: the umbrella framework and all twelve pillar papers.
          Each entry keeps a source trail to repository-relative canonical artifacts only.
        </p>
      </header>
```

**Metadata/source rows pattern** (lines 45-68):
```astro
              <dl class="phase-inventory__metadata">
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Kind</dt>
                  <dd>{entry.kind}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Slug</dt>
                  <dd>{entry.slug}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Canonical .tex</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalTex}</code></dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">PDF</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalPdf}</code></dd>
                </div>
                {entry.bibliography && (
                  <div class="phase-inventory__meta-row">
                    <dt class="phase-inventory__meta-label">Bibliography</dt>
                    <dd><code class="phase-inventory__path">{entry.bibliography}</code></dd>
                  </div>
                )}
              </dl>
```

**Apply:** Add `getStaticPaths()` over `corpusEntries` as recommended in research. Use `SourceLinkPanel` and `BookFooterNav` instead of duplicating source rows and previous/next logic. Page content must stay source-detail only, not full Phase 3 chapters.

---

### `site/src/components/SourceLinkPanel.astro` (component, static render / source metadata transform)

**Analog:** `site/src/pages/inventory.astro`

**Source status label import pattern** (lines 1-4):
```astro
---
import '../styles/phase-1.css';
import { corpusEntries } from '../data/corpus';
import { sourceStatusLabels } from '../data/corpus.schema';
```

**Status chip pattern** (lines 40-42):
```astro
                <span class={`phase-inventory__status phase-inventory__status--${entry.sourceStatus}`}>
                  {sourceStatusLabels[entry.sourceStatus]}
                </span>
```

**Definition-list metadata pattern** (lines 45-68):
```astro
              <dl class="phase-inventory__metadata">
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Kind</dt>
                  <dd>{entry.kind}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Slug</dt>
                  <dd>{entry.slug}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Canonical .tex</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalTex}</code></dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">PDF</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalPdf}</code></dd>
                </div>
                {entry.bibliography && (
                  <div class="phase-inventory__meta-row">
                    <dt class="phase-inventory__meta-label">Bibliography</dt>
                    <dd><code class="phase-inventory__path">{entry.bibliography}</code></dd>
                  </div>
                )}
              </dl>
```

**Apply:** Convert path rows into labelled links: `Canonical .tex source`, `Canonical PDF`, optional `Bibliography source`. Keep visible path text in `<code>` when useful, but link labels must not be URL-only. Source status must include exact label text.

---

### `site/src/components/BookFooterNav.astro` (component, static render / previous-next transform)

**Analog:** `site/src/pages/inventory.astro` and `site/src/data/corpus.test.ts`

**Data-driven rendering pattern** (`site/src/pages/inventory.astro` lines 31-34):
```astro
      ) : (
        <section class="phase-inventory__grid" aria-label={`${entryCount} corpus entries`}>
          {corpusEntries.map((entry) => (
            <article class="phase-inventory__card">
```

**Order validation pattern to mirror in helper tests** (`site/src/data/corpus.test.ts` lines 60-64):
```typescript
  it('contains every expected corpus id exactly once', () => {
    const ids = corpusEntries.map((entry) => entry.id);

    expect(ids).toEqual([...expectedCorpusIds]);
    expect(new Set(ids).size).toBe(expectedCorpusIds.length);
```

**Focus style source** (`site/src/styles/phase-1.css` lines 161-170):
```css
.phase-inventory a {
  color: inherit;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.phase-inventory a:focus-visible {
  outline: 2px solid var(--phase-color-accent);
  outline-offset: 2px;
}
```

**Apply:** Component should accept `currentId` and call a helper from `book-spine.ts`. Labels must follow `Previous: {title}` / `Next: {title}`. Do not create a second hard-coded order inside the component.

---

### `site/src/components/formal/DefinitionBlock.astro` (component, static render / formal metadata transform)

**Analog:** `site/src/pages/inventory.astro`

**Card/article pattern** (lines 34-43):
```astro
            <article class="phase-inventory__card">
              <div class="phase-inventory__card-header">
                <div>
                  <h2 class="phase-inventory__title">{entry.title}</h2>
                  <p class="phase-inventory__description">{entry.summary}</p>
                </div>
                <span class={`phase-inventory__status phase-inventory__status--${entry.sourceStatus}`}>
                  {sourceStatusLabels[entry.sourceStatus]}
                </span>
              </div>
```

**Metadata row pattern** (lines 45-56):
```astro
              <dl class="phase-inventory__metadata">
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Kind</dt>
                  <dd>{entry.kind}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Slug</dt>
                  <dd>{entry.slug}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Canonical .tex</dt>
```

**Apply:** Use an anchorable `<article id={id}>` or labelled section. Top metadata must visibly expose `Definition`, stable ID/label, owner, and source link. Slot content follows the header; include or require a visible `SourceTrail` slot/prop.

---

### `site/src/components/formal/TheoremBlock.astro` (component, static render / formal metadata transform)

**Analog:** `site/src/pages/inventory.astro`

**Reusable title/status shape** (lines 35-42):
```astro
              <div class="phase-inventory__card-header">
                <div>
                  <h2 class="phase-inventory__title">{entry.title}</h2>
                  <p class="phase-inventory__description">{entry.summary}</p>
                </div>
                <span class={`phase-inventory__status phase-inventory__status--${entry.sourceStatus}`}>
                  {sourceStatusLabels[entry.sourceStatus]}
                </span>
```

**Apply:** Copy the formal block shell from `DefinitionBlock`, but default visible type label to `Claim`. Allow prop label text for theorem/proposition/lemma/assumption if needed, while preserving source and owner metadata by default.

---

### `site/src/components/formal/DerivationWalkthrough.astro` (component, static render / notebook cell transform)

**Analog:** `site/src/content/docs/math-fixture.mdx` and `site/src/styles/phase-1.css`

**Math fixture pattern** (`site/src/content/docs/math-fixture.mdx` lines 5-15):
```mdx
# Math Fixture

This page proves the Phase 1 build-time math pipeline is active.

Inline mass-energy notation renders as $E = mc^2$.

The arithmetic-series identity renders as block math:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

**Responsive single-column CSS pattern** (`site/src/styles/phase-1.css` lines 172-187):
```css
@media (max-width: 720px) {
  .phase-inventory {
    padding: var(--space-xl) var(--space-md);
  }

  .phase-inventory__card-header,
  .phase-inventory__meta-row {
    display: grid;
    gap: var(--space-sm);
    grid-template-columns: 1fr;
  }

  .phase-inventory__status {
    justify-self: start;
  }
}
```

**Apply:** Derivation component should provide notebook-style wrapper and cells; math/code cells need contained horizontal overflow. Do not force sans fonts onto KaTeX glyphs. Keep source trail visible by default.

---

### `site/src/components/formal/CitationRef.astro` (component, static render / citation metadata transform)

**Analog:** `site/src/pages/inventory.astro`

**Inline path/code metadata pattern** (lines 54-66):
```astro
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Canonical .tex</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalTex}</code></dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">PDF</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalPdf}</code></dd>
                </div>
                {entry.bibliography && (
                  <div class="phase-inventory__meta-row">
                    <dt class="phase-inventory__meta-label">Bibliography</dt>
                    <dd><code class="phase-inventory__path">{entry.bibliography}</code></dd>
                  </div>
```

**Apply:** Render citation references as readable academic text with explicit `Citation` label where used in fixtures. If linking bibliography paths, use `Bibliography source` label and source metadata from `corpusEntries`/props.

---

### `site/src/components/formal/SourceTrail.astro` (component, static render / source metadata transform)

**Analog:** `site/src/pages/inventory.astro` and `site/src/content/docs/provenance-contract.mdx`

**Source trail contract language** (`site/src/content/docs/provenance-contract.mdx` lines 11-25):
```mdx
## Required inventory fields

Every entry in `site/src/data/corpus.ts` must provide these fields:

| Field | Contract |
|---|---|
| `id` | Stable corpus id. The inventory must include the umbrella framework and all twelve expected pillar ids exactly once. |
| `kind` | `umbrella` or `pillar`. |
| `title` | Reader-facing title for the corpus entry. |
| `slug` | Static site slug for the entry. |
| `summary` | Short corpus summary used by inventory and later index generation. |
| `canonicalTex` | Project-root-relative path to the canonical `.tex` source. |
| `canonicalPdf` | Project-root-relative path to the rendered canonical `.pdf`. |
| `bibliography` | Project-root-relative path to the canonical `.bib` file when the entry has one. |
| `sourceStatus` | Provenance status label source: canonical, missing source, archive blocked, or provenance-only. |
```

**Canonical path rule language** (`site/src/content/docs/provenance-contract.mdx` lines 27-33):
```mdx
## Canonical path rules

Canonical source paths must point into `science/paper/` for the umbrella framework or `pillars/*/paper/` for pillar papers. They must be project-root-relative, must not be absolute filesystem paths, and must not contain `..` parent traversal segments.

Archive directories are preservation areas, not active canonical sources. Paths containing `archive/` cannot be used for `canonicalTex`, `canonicalPdf`, or `bibliography` unless the entry is explicitly `provenance-only` per D-16. That exception is for pages that discuss provenance or history; it is not a shortcut for replacing canonical source paths.

Local-only build assets follow the same narrow exception style as the LaTeX asset contract: ignored files such as local `logo.pdf` copies may exist beside papers for compilation, but they are not inventory provenance fields.
```

**Definition-list source row pattern** (`site/src/pages/inventory.astro` lines 45-68):
```astro
              <dl class="phase-inventory__metadata">
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Kind</dt>
                  <dd>{entry.kind}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Slug</dt>
                  <dd>{entry.slug}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Canonical .tex</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalTex}</code></dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">PDF</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalPdf}</code></dd>
                </div>
                {entry.bibliography && (
                  <div class="phase-inventory__meta-row">
                    <dt class="phase-inventory__meta-label">Bibliography</dt>
                    <dd><code class="phase-inventory__path">{entry.bibliography}</code></dd>
                  </div>
                )}
              </dl>
```

**Apply:** Source trails are detailed and visible by default, never expandable-only. Use definition-list rows for owner, canonical `.tex`, PDF, bibliography, source status, and optional note/locator.

---

### `site/src/content/docs/formal-reading-fixture.mdx` (content/fixture, static content render / math transform)

**Analog:** `site/src/content/docs/math-fixture.mdx`

**Fixture frontmatter and heading pattern** (lines 1-7):
```mdx
---
title: Math Fixture
---

# Math Fixture

This page proves the Phase 1 build-time math pipeline is active.
```

**Inline and block math fixture pattern** (lines 9-15):
```mdx
Inline mass-energy notation renders as $E = mc^2$.

The arithmetic-series identity renders as block math:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

**Apply:** Use MDX imports for `DefinitionBlock`, `TheoremBlock`, `DerivationWalkthrough`, `CitationRef`, and `SourceTrail`. Include one aligned/display equation and one deliberately wide math/code-like cell to prove contained overflow.

---

### `site/src/styles/atlas.css` (config/style, static style cascade)

**Analog:** `site/src/styles/phase-1.css`

**Token pattern** (lines 1-23):
```css
:root {
  --phase-color-dominant: #F7F3EA;
  --phase-color-secondary: #E8DDC8;
  --phase-color-accent: #7A3E1D;
  --phase-color-destructive: #B42318;
  --phase-color-text: #1f2933;
  --phase-color-muted: #475569;
  --phase-color-success: #166534;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --font-size-body: 16px;
  --font-size-label: 14px;
  --font-size-heading: 20px;
  --font-size-display: 28px;
  --font-family-prose: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-family-label: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-family-mono: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}
```

**Card/status treatment pattern** (lines 87-125):
```css
.phase-inventory__card {
  background: var(--phase-color-secondary);
  border: 1px solid color-mix(in srgb, var(--phase-color-accent), transparent 70%);
  border-radius: 14px;
  display: grid;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.phase-inventory__card-header {
  align-items: start;
  display: flex;
  gap: var(--space-md);
  justify-content: space-between;
}

.phase-inventory__title {
  margin: 0;
  font-family: var(--font-family-prose);
  font-size: var(--font-size-heading);
  font-weight: 600;
  line-height: 1.2;
}

.phase-inventory__description {
  margin: var(--space-sm) 0 0;
}

.phase-inventory__status {
  align-items: center;
  background: var(--phase-color-dominant);
  border: 1px solid var(--phase-color-accent);
  border-radius: 999px;
  color: var(--phase-color-accent);
  display: inline-flex;
  min-height: 44px;
  padding: var(--space-sm) var(--space-md);
  white-space: nowrap;
}
```

**Status variants pattern** (lines 127-136):
```css
.phase-inventory__status--missing-source,
.phase-inventory__status--archive-blocked {
  border-color: var(--phase-color-destructive);
  color: var(--phase-color-destructive);
}

.phase-inventory__status--provenance-only {
  border-color: var(--phase-color-muted);
  color: var(--phase-color-muted);
}
```

**Responsive/focus pattern** (lines 167-187):
```css
.phase-inventory a:focus-visible {
  outline: 2px solid var(--phase-color-accent);
  outline-offset: 2px;
}

@media (max-width: 720px) {
  .phase-inventory {
    padding: var(--space-xl) var(--space-md);
  }

  .phase-inventory__card-header,
  .phase-inventory__meta-row {
    display: grid;
    gap: var(--space-sm);
    grid-template-columns: 1fr;
  }

  .phase-inventory__status {
    justify-self: start;
  }
}
```

**Apply:** Evolve tokens to Phase 2 `--atlas-*` names or keep compatible aliases. Change prose font to sans-forward per UI spec. Preserve 44px interactive target, visible 2px focus outline, status label variants, and responsive one-column reflow.

## Shared Patterns

### Static Site Boundary
**Source:** `site/astro.config.mjs` lines 6-11 and `site/package.json` lines 6-13  
**Apply to:** All Phase 2 files
```javascript
export default defineConfig({
  output: 'static',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
```
```json
  "scripts": {
    "dev": "astro dev",
    "build:astro": "astro build",
    "check": "astro check",
    "validate": "bun run src/scripts/validate-corpus.ts",
    "index": "bun run src/scripts/generate-local-indexes.ts && if find dist -name '*.html' | grep -q .; then pagefind --site dist; else echo 'Skipping Pagefind: no static HTML found in dist yet.' >&2; fi",
    "build": "bun run validate && bun run build:astro && bun run index",
    "test": "vitest run"
  },
```

### Single Source of Corpus Metadata
**Source:** `site/src/data/corpus.ts` lines 1-14 and `site/src/data/corpus.schema.ts` lines 32-51  
**Apply to:** `book-spine.ts`, `AtlasConstellation.astro`, `[slug].astro`, `SourceLinkPanel.astro`, `SourceTrail.astro`
```typescript
import { parseCorpusEntries } from './corpus.schema';

export const corpusEntries = parseCorpusEntries([
  {
    id: 'umbrella',
    kind: 'umbrella',
    title: 'A Formal Framework for AI Coding Agent Harness Architecture',
    slug: 'umbrella',
    summary: 'Umbrella framework tying together all architectural dimensions',
    canonicalTex: 'science/paper/science.tex',
    canonicalPdf: 'science/paper/science.pdf',
    bibliography: 'science/paper/science.bib',
    sourceStatus: 'canonical',
  },
```
```typescript
export const corpusEntrySchema = z.object({
  id: nonEmptyStringSchema,
  kind: corpusKindSchema,
  title: nonEmptyStringSchema,
  slug: nonEmptyStringSchema,
  summary: nonEmptyStringSchema,
  canonicalTex: nonEmptyStringSchema,
  canonicalPdf: nonEmptyStringSchema,
  bibliography: nonEmptyStringSchema.optional(),
  sourceStatus: sourceStatusSchema,
});

export const corpusEntriesSchema = z.array(corpusEntrySchema);

export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type CorpusEntry = z.infer<typeof corpusEntrySchema>;

export function parseCorpusEntries(entries: unknown): CorpusEntry[] {
  return corpusEntriesSchema.parse(entries);
}
```

### Source Status Labels
**Source:** `site/src/data/corpus.schema.ts` lines 3-10 and `site/src/styles/phase-1.css` lines 127-136  
**Apply to:** Source panels, inventory/status badges, formal source trails
```typescript
export const sourceStatusSchema = z.enum(['canonical', 'missing-source', 'archive-blocked', 'provenance-only']);

export const sourceStatusLabels = {
  canonical: 'Canonical',
  'missing-source': 'Missing source',
  'archive-blocked': 'Archive blocked',
  'provenance-only': 'Provenance-only',
} as const;
```
```css
.phase-inventory__status--missing-source,
.phase-inventory__status--archive-blocked {
  border-color: var(--phase-color-destructive);
  color: var(--phase-color-destructive);
}

.phase-inventory__status--provenance-only {
  border-color: var(--phase-color-muted);
  color: var(--phase-color-muted);
}
```

### Accessible Metadata Panels
**Source:** `site/src/pages/inventory.astro` lines 45-68  
**Apply to:** `SourceLinkPanel.astro`, `SourceTrail.astro`, formal block headers
```astro
              <dl class="phase-inventory__metadata">
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Kind</dt>
                  <dd>{entry.kind}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Slug</dt>
                  <dd>{entry.slug}</dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">Canonical .tex</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalTex}</code></dd>
                </div>
                <div class="phase-inventory__meta-row">
                  <dt class="phase-inventory__meta-label">PDF</dt>
                  <dd><code class="phase-inventory__path">{entry.canonicalPdf}</code></dd>
                </div>
                {entry.bibliography && (
                  <div class="phase-inventory__meta-row">
                    <dt class="phase-inventory__meta-label">Bibliography</dt>
                    <dd><code class="phase-inventory__path">{entry.bibliography}</code></dd>
                  </div>
                )}
              </dl>
```

### Validation/Error Handling
**Source:** `site/src/scripts/validate-corpus.ts` lines 192-223 and 225-239  
**Apply to:** Any new helper tests and data validation helpers
```typescript
export function validateCorpus(
  entries: CorpusEntry[] = corpusEntries,
  options: { repoRoot?: string } = {},
): ValidationResult {
  const errors: ValidationError[] = [];
  const repoRoot = options.repoRoot ?? defaultRepoRoot();

  let parsedEntries: CorpusEntry[];
  try {
    parsedEntries = parseCorpusEntries(entries);
  } catch (error) {
    addError(
      errors,
      'corpus',
      'schema',
      'site/src/data/corpus.ts',
      error instanceof Error ? error.message : 'Corpus entries failed schema validation',
      'Fix the inventory shape so it matches corpus.schema.ts',
    );
    return { ok: false, errors };
  }

  validateExpectedIds(parsedEntries, errors);

  for (const entry of parsedEntries) {
    for (const field of pathFields) {
      validatePathField(entry, field, repoRoot, errors);
    }
  }

  return { ok: errors.length === 0, errors };
}
```
```typescript
export function formatValidationError(error: ValidationError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function printPlainResult(result: ValidationResult, entryCount: number): void {
  if (result.ok) {
    console.log(`OK: ${entryCount} corpus entries validated, 0 errors found.`);
    return;
  }

  console.error(`ERRORS: ${result.errors.length} corpus validation error(s):`);
  for (const error of result.errors) {
    console.error(formatValidationError(error));
  }
}
```

### Test Style
**Source:** `site/src/scripts/validate-corpus.test.ts` lines 10-33 and `site/src/data/corpus.test.ts` lines 54-69  
**Apply to:** `book-spine.test.ts`
```typescript
describe('validateCorpus', () => {
  it('validates the real corpus inventory', () => {
    const result = validateCorpus();

    expect(result).toEqual({ ok: true, errors: [] });
  });

  it('fails when a required corpus entry is missing', () => {
    const entries = cloneEntries().filter((entry) => entry.id !== 'security');

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'security',
          field: 'id',
          path: 'security',
          reason: expect.stringContaining('Missing required corpus entry'),
        }),
      ]),
    );
  });
```
```typescript
describe('corpus inventory contract', () => {
  it('parses explicit corpus entries through the schema', () => {
    expect(parseCorpusEntries(corpusEntries)).toHaveLength(13);
    expect(corpusEntries).toHaveLength(13);
  });

  it('contains every expected corpus id exactly once', () => {
    const ids = corpusEntries.map((entry) => entry.id);

    expect(ids).toEqual([...expectedCorpusIds]);
    expect(new Set(ids).size).toBe(expectedCorpusIds.length);
  });
```

### Focus, Responsive Layout, and Status Contrast
**Source:** `site/src/styles/phase-1.css` lines 115-187  
**Apply to:** `atlas.css`, homepage constellation, source pages, formal blocks
```css
.phase-inventory__status {
  align-items: center;
  background: var(--phase-color-dominant);
  border: 1px solid var(--phase-color-accent);
  border-radius: 999px;
  color: var(--phase-color-accent);
  display: inline-flex;
  min-height: 44px;
  padding: var(--space-sm) var(--space-md);
  white-space: nowrap;
}
```
```css
.phase-inventory a:focus-visible {
  outline: 2px solid var(--phase-color-accent);
  outline-offset: 2px;
}

@media (max-width: 720px) {
  .phase-inventory {
    padding: var(--space-xl) var(--space-md);
  }

  .phase-inventory__card-header,
  .phase-inventory__meta-row {
    display: grid;
    gap: var(--space-sm);
    grid-template-columns: 1fr;
  }

  .phase-inventory__status {
    justify-self: start;
  }
}
```

## No Analog Found

No files are fully without analog. The weakest matches are the formal-reading components because Phase 1 has no reusable Astro component library yet; use the inventory page's Astro markup, metadata rows, status labels, and CSS card patterns as the local analog, then apply the research/UI contract for formal-specific props and notebook derivation behavior.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `site/src/components/formal/DerivationWalkthrough.astro` | component | static render / notebook cell transform | No existing notebook-style component exists; combine math fixture and CSS overflow patterns. |
| `site/src/components/formal/CitationRef.astro` | component | static render / citation metadata transform | No citation component exists; use source metadata/link patterns. |

## Metadata

**Analog search scope:** `/home/prannayag/harness_eng/site/src`, `/home/prannayag/harness_eng/site/astro.config.mjs`, `/home/prannayag/harness_eng/site/package.json`  
**Files scanned:** 12 source/config/test files plus required planning/UI files  
**Project skills:** No `.claude/skills/` or `.agents/skills/` project skills found  
**Pattern extraction date:** 2026-05-19
