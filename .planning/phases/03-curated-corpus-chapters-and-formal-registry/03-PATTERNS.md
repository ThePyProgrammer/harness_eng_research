# Phase 03: Curated Corpus Chapters and Formal Registry - Pattern Map

**Mapped:** 2026-05-19
**Files analyzed:** 16 new/modified files
**Analogs found:** 16 / 16

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `site/src/data/formal-registry.schema.ts` | model/schema | transform | `site/src/data/corpus.schema.ts` | exact |
| `site/src/data/formal-registry.ts` | model/data registry | transform | `site/src/data/corpus.ts` | exact |
| `site/src/data/chapters.ts` | model/data registry | transform | `site/src/data/book-spine.ts` | role-match |
| `site/src/data/concepts.ts` | model/data registry | transform | `site/src/data/corpus.ts` | exact |
| `site/src/components/formal/TheoremBlock.astro` | component | request-response/static render | `site/src/components/formal/DefinitionBlock.astro` | exact |
| `site/src/components/formal/FormalObjectList.astro` | component | request-response/static render | `site/src/components/formal/DefinitionBlock.astro` | role-match |
| `site/src/components/formal/ConceptCard.astro` | component | request-response/static render | `site/src/components/SourceLinkPanel.astro` | role-match |
| `site/src/components/formal/SourceTrail.astro` | component | request-response/static render | `site/src/components/formal/SourceTrail.astro` | exact-modify |
| `site/src/pages/corpus/[slug].astro` | route/page | request-response/static generation | `site/src/pages/corpus/[slug].astro` | exact-modify |
| `site/src/pages/formal-registry/index.astro` | route/page | request-response/static generation | `site/src/pages/inventory.astro` | exact |
| `site/src/pages/glossary/index.astro` | route/page | request-response/static generation | `site/src/pages/inventory.astro` | exact |
| `site/src/scripts/validate-formal-registry.ts` | utility/validation script | file-I/O + transform | `site/src/scripts/validate-corpus.ts` | exact |
| `site/package.json` | config | batch | `site/package.json` | exact-modify |
| `site/src/data/formal-registry.test.ts` | test | batch | `site/src/data/corpus.test.ts` | exact |
| `site/src/scripts/validate-formal-registry.test.ts` | test | batch | `site/src/scripts/validate-corpus.test.ts` | exact |
| `site/src/components/formal/formal-components.test.ts` | test | batch | `site/src/components/formal/formal-components.test.ts` | exact-modify |

## Pattern Assignments

### `site/src/data/formal-registry.schema.ts` (model/schema, transform)

**Analog:** `site/src/data/corpus.schema.ts`

**Imports pattern** (lines 1-1):
```typescript
import { z } from 'zod';
```

**Enum + labels pattern** (lines 3-14):
```typescript
export const sourceStatusSchema = z.enum(['canonical', 'missing-source', 'archive-blocked', 'provenance-only']);

export const sourceStatusLabels = {
  canonical: 'Canonical',
  'missing-source': 'Missing source',
  'archive-blocked': 'Archive blocked',
  'provenance-only': 'Provenance-only',
} as const;

export const corpusKindSchema = z.enum(['umbrella', 'pillar']);
```

**Expected ID source pattern** (lines 14-28):
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

**Schema + inferred type + parser pattern** (lines 30-51):
```typescript
const nonEmptyStringSchema = z.string().trim().min(1);

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

**Apply:** Copy this file shape for formal object kind enums, source tier/material-kind enums, stable ID regex, owner ID enum via `expectedCorpusIds`, relation arrays with defaults, citation schemas, concept schemas, and `parseFormalRegistry(...)` helpers. Keep schemas centralized; do not scatter ad hoc validation in Astro pages.

---

### `site/src/data/formal-registry.ts` (model/data registry, transform)

**Analog:** `site/src/data/corpus.ts`

**Imports + parse-at-definition pattern** (lines 1-3):
```typescript
import { parseCorpusEntries } from './corpus.schema';

export const corpusEntries = parseCorpusEntries([
```

**Canonical source metadata shape** (lines 4-14):
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

**All-owners coverage pattern** (lines 15-147):
```typescript
  {
    id: 'abstraction',
    kind: 'pillar',
    title: 'Abstraction',
    slug: 'abstraction',
    summary: 'Specification-to-code abstraction gaps, refinement, and formal interfaces',
    canonicalTex: 'pillars/abstraction/paper/abstraction_architecture.tex',
    canonicalPdf: 'pillars/abstraction/paper/abstraction_architecture.pdf',
    bibliography: 'pillars/abstraction/paper/abstraction_architecture.bib',
    sourceStatus: 'canonical',
  },
```

**Apply:** Registry data should export one parsed constant, e.g. `formalRegistry = parseFormalRegistry([...])`. Entries must use semantic IDs like `reliability.compound-error-bound`, owner IDs from `expectedCorpusIds`, source paths from canonical/supporting material, relation IDs, concept IDs, citation keys, and rendered anchor IDs. All thirteen owners should be represented by Phase 3 chapter-critical formal objects.

---

### `site/src/data/chapters.ts` (model/data registry, transform)

**Analog:** `site/src/data/book-spine.ts`

**Import direct concrete modules pattern** (lines 1-2):
```typescript
import { corpusEntries } from './corpus';
import type { CorpusEntry } from './corpus.schema';
```

**Explicit ordered contract pattern** (lines 4-19):
```typescript
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

const conceptualArc = ['overview', 'umbrella', ...pillarArc] as const;
```

**Lookup with hard failure for missing data** (lines 30-40):
```typescript
const entriesById = new Map(corpusEntries.map((entry) => [entry.id, entry]));

function getCorpusEntry(id: CorpusBackedSpineId): CorpusEntry {
  const entry = entriesById.get(id);

  if (!entry) {
    throw new Error(`Missing corpus entry for book spine id: ${id}`);
  }

  return entry;
}
```

**Projection helper pattern** (lines 42-51):
```typescript
function toSpineItem(id: BookSpineId): BookSpineItem {
  if (id === 'overview') {
    return { id, title: 'Overview', href: '/' };
  }

  const entry = getCorpusEntry(id);
  return { id, title: entry.title, href: `/corpus/${entry.slug}/` };
}

export const bookSpine: BookSpineItem[] = conceptualArc.map(toSpineItem);
```

**Apply:** Use a required chapter contract keyed by corpus owner. Provide helpers like `getChapterByOwner(ownerId)` and fail fast for missing chapters. Required pillar sections should map directly to D-01: problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, citations, and source trail. Umbrella may use an adjusted opening-framework contract but should still be owner keyed.

---

### `site/src/data/concepts.ts` (model/data registry, transform)

**Analog:** `site/src/data/corpus.ts`

**Parse-at-export pattern** (lines 1-3):
```typescript
import { parseCorpusEntries } from './corpus.schema';

export const corpusEntries = parseCorpusEntries([
```

**Rich card metadata source pattern** (lines 15-25):
```typescript
  {
    id: 'abstraction',
    kind: 'pillar',
    title: 'Abstraction',
    slug: 'abstraction',
    summary: 'Specification-to-code abstraction gaps, refinement, and formal interfaces',
    canonicalTex: 'pillars/abstraction/paper/abstraction_architecture.tex',
    canonicalPdf: 'pillars/abstraction/paper/abstraction_architecture.pdf',
    bibliography: 'pillars/abstraction/paper/abstraction_architecture.bib',
    sourceStatus: 'canonical',
  },
```

**Apply:** Concept data should be structured first, not page-local prose. Each concept should include stable ID, term, aliases, notation, owning pillars, concise definition, related formal object IDs, related concept IDs, and source trail IDs. Use the same schema/parser pattern as `corpus.ts` and `formal-registry.ts`.

---

### `site/src/components/formal/TheoremBlock.astro` (component, request-response/static render)

**Analog:** `site/src/components/formal/TheoremBlock.astro` and `DefinitionBlock.astro`

**Current props pattern to extend** (`TheoremBlock.astro` lines 1-10):
```astro
---
interface Props {
  id: string;
  label: string;
  owner: string;
  sourceHref: string;
}

const { id, label, owner, sourceHref } = Astro.props;
---
```

**Anchor + metadata pattern** (`TheoremBlock.astro` lines 12-30):
```astro
<article id={id} class="formal-block formal-block--claim" aria-labelledby={`${id}-heading`}>
  <header class="formal-block__header">
    <div>
      <p class="formal-block__type">Claim</p>
      <h2 id={`${id}-heading`} class="formal-block__title">{label}</h2>
    </div>
    <a class="formal-block__source-link" href={sourceHref}>Canonical .tex source</a>
  </header>

  <dl class="formal-block__metadata" aria-label="Claim metadata">
    <div class="formal-block__meta-row">
      <dt>Stable ID</dt>
      <dd><code>{id}</code></dd>
    </div>
    <div class="formal-block__meta-row">
      <dt>Owner</dt>
      <dd>{owner}</dd>
    </div>
  </dl>
```

**Slot pattern** (`DefinitionBlock.astro` lines 32-37):
```astro
  <div class="formal-block__body">
    <slot />
  </div>

  <slot name="source-trail" />
</article>
```

**Apply:** Add a typed `kind` prop for theorem/proposition/lemma/assumption/corollary/claim, derive the visible type label from it, and preserve exact ID/heading/source-trail behavior so registry IDs become rendered anchors. Do not generate alternate slugs.

---

### `site/src/components/formal/FormalObjectList.astro` (component, request-response/static render)

**Analog:** `site/src/components/formal/DefinitionBlock.astro`

**Formal block visible identity pattern** (lines 12-18):
```astro
<article id={id} class="formal-block formal-block--definition" aria-labelledby={`${id}-heading`}>
  <header class="formal-block__header">
    <div>
      <p class="formal-block__type">Definition</p>
      <h2 id={`${id}-heading`} class="formal-block__title">{label}</h2>
    </div>
    <a class="formal-block__source-link" href={sourceHref}>Canonical .tex source</a>
```

**Metadata rows pattern** (lines 21-30):
```astro
  <dl class="formal-block__metadata" aria-label="Definition metadata">
    <div class="formal-block__meta-row">
      <dt>Stable ID</dt>
      <dd><code>{id}</code></dd>
    </div>
    <div class="formal-block__meta-row">
      <dt>Owner</dt>
      <dd>{owner}</dd>
    </div>
  </dl>
```

**Apply:** For registry/list projections, show object kind, stable ID, owner, label, and links to owner chapter anchors. Reuse `formal-block__metadata` / `formal-block__meta-row` class naming for consistent atlas styling. This is a list/projection component, so props should accept typed registry objects instead of arbitrary freeform rows.

---

### `site/src/components/formal/ConceptCard.astro` (component, request-response/static render)

**Analog:** `site/src/components/SourceLinkPanel.astro`

**Typed props import pattern** (lines 1-9):
```astro
---
import { sourceStatusLabels } from '../data/corpus.schema';
import type { CorpusEntry } from '../data/corpus.schema';

interface Props {
  entry: CorpusEntry;
}

const { entry } = Astro.props;
```

**Card/list rendering pattern** (lines 97-105):
```astro
  <div class="material-kind-legend" aria-label="Material kind treatment legend">
    {materialKinds.map((kind) => (
      <article class={`material-kind-card material-kind-card--${kind.id}`}>
        <h3><span class={`material-kind material-kind--${kind.id}`}>{kind.label}</span></h3>
        <p>{kind.description}</p>
      </article>
    ))}
  </div>
</section>
```

**Metadata row pattern** (lines 52-67):
```astro
  <dl class="source-panel__metadata">
    <div class="source-panel__row">
      <dt>Material kind</dt>
      <dd>
        <span class="material-kind material-kind--canonical">canonical</span>
        <span class="source-panel__note">Current entry is rendered from canonical corpus metadata.</span>
      </dd>
    </div>
    <div class="source-panel__row">
      <dt>Kind</dt>
      <dd>{entry.kind}</dd>
    </div>
```

**Apply:** Concept cards should present term, aliases, notation, owner(s), concise definition, source-tier labels, related formal objects, and related concepts with reciprocal links. Follow the typed-props + `<dl>` metadata + card grid pattern rather than raw HTML blobs.

---

### `site/src/components/formal/SourceTrail.astro` (component, request-response/static render)

**Analog:** `site/src/components/formal/SourceTrail.astro`

**Material kind type pattern** (lines 1-15):
```astro
---
import { sourceStatusLabels, type SourceStatus } from '../../data/corpus.schema';

type MaterialKind = 'canonical' | 'supporting' | 'synthesis/review' | 'archived/provenance';

interface Props {
  owner: string;
  canonicalTex: string;
  canonicalPdf: string;
  bibliography?: string;
  sourceStatus: SourceStatus;
  locator?: string;
  note?: string;
  materialKind?: MaterialKind;
}
```

**Repository-link helper pattern** (lines 28-34):
```astro
const materialKindClass = materialKind.replace('/', '-');

const repositoryBaseUrl = 'https://github.com/ThePyProgrammer/harness_eng_research/blob/main/';

function repositoryHref(path: string): string {
  return new URL(path, repositoryBaseUrl).toString();
}
```

**Visible source rows pattern** (lines 43-91):
```astro
  <dl class="formal-source-trail__metadata">
    <div class="formal-source-trail__row">
      <dt>Owner</dt>
      <dd>{owner}</dd>
    </div>
    <div class="formal-source-trail__row">
      <dt>Material kind</dt>
      <dd><span class={`material-kind material-kind--${materialKindClass}`}>{materialKind}</span></dd>
    </div>
    <div class="formal-source-trail__row">
      <dt>Canonical .tex source</dt>
      <dd>
        <a href={repositoryHref(canonicalTex)}>Canonical .tex source</a>
        <code>{canonicalTex}</code>
      </dd>
    </div>
```

**Apply:** Extend only if registry entries need source trail IDs or noncanonical supporting paths, but preserve visible material-kind/source-status rows. Source tier labels must remain visible inline and at section/formal-block level.

---

### `site/src/pages/corpus/[slug].astro` (route/page, request-response/static generation)

**Analog:** `site/src/pages/corpus/[slug].astro`

**Imports pattern** (lines 1-6):
```astro
---
import BookFooterNav from '../../components/BookFooterNav.astro';
import SourceLinkPanel from '../../components/SourceLinkPanel.astro';
import { bookSpine } from '../../data/book-spine';
import { corpusEntries } from '../../data/corpus';
import '../../styles/atlas.css';
```

**Static dynamic route pattern** (lines 8-17):
```astro
export function getStaticPaths() {
  return corpusEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const pageTitle = `${entry.title} | Harness Architecture Book Wiki`;
---
```

**Book spine current-page pattern** (lines 27-45):
```astro
      <aside class="book-spine-panel" aria-labelledby="book-spine-heading">
        <p class="book-spine-panel__eyebrow">Book spine</p>
        <h2 id="book-spine-heading">Book spine</h2>
        <nav aria-label="Book spine">
          <ol class="book-spine-list">
            {bookSpine.map((item) => {
              const isCurrent = item.id === entry.id;
              return (
                <li>
                  <a class={`book-spine-list__link${isCurrent ? ' book-spine-list__link--current' : ''}`} href={item.href} aria-current={isCurrent ? 'page' : undefined}>
                    <span>{item.title}</span>
                    {isCurrent && <span class="book-spine-list__current-marker">Current page</span>}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>
```

**Existing integration points to preserve** (lines 47-63):
```astro
      <main class="source-detail" data-pagefind-body>
        <header class="source-detail__header">
          <p class="source-detail__eyebrow">Source-detail page</p>
          <h1>{entry.title}</h1>
          <p class="source-detail__summary">{entry.summary}</p>
        </header>

        <section class="source-detail__overview" aria-labelledby="source-detail-overview-heading">
          <h2 id="source-detail-overview-heading">Phase 2 source detail</h2>
          <p>
            This lightweight page preserves source traceability for the canonical corpus entry. Phase 3 can expand it into a curated chapter without changing the shared book spine or provenance links.
          </p>
        </section>

        <SourceLinkPanel entry={entry} />
        <BookFooterNav currentId={entry.id} />
```

**Apply:** Expand `getStaticPaths()` props to include `chapter`, owner formal objects, and owner concepts. Replace the Phase 2 source-detail overview with the full curated chapter contract, but preserve the shell, book spine, `data-pagefind-body`, `SourceLinkPanel`, and `BookFooterNav` integration.

---

### `site/src/pages/formal-registry/index.astro` (route/page, request-response/static generation)

**Analog:** `site/src/pages/inventory.astro`

**Page imports/count pattern** (lines 1-7):
```astro
---
import '../styles/phase-1.css';
import { corpusEntries } from '../data/corpus';
import { sourceStatusLabels } from '../data/corpus.schema';

const entryCount = corpusEntries.length;
---
```

**Static HTML shell pattern** (lines 9-24):
```astro
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Corpus Inventory | Harness Architecture Book Wiki</title>
  </head>
  <body class="phase-inventory">
    <main class="phase-inventory__shell" data-pagefind-body>
      <header class="phase-inventory__header">
        <p class="phase-inventory__eyebrow">Phase 1 provenance contract</p>
        <h1>Corpus Inventory</h1>
        <p class="phase-inventory__summary">
          13 corpus entries render from the typed inventory: the umbrella framework and all twelve pillar papers.
          Each entry keeps a source trail to repository-relative canonical artifacts only.
        </p>
```

**Grid projection pattern** (lines 32-45):
```astro
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
              </div>
```

**Apply:** Generate one static index of formal objects from `formal-registry.ts`. Use cards or grouped sections by owner/kind; include stable ID, kind, label, owner, source tier/material kind, and links to `/corpus/{slug}/#{object.id}`. Prefer atlas/formal classes where available; no runtime fetching.

---

### `site/src/pages/glossary/index.astro` (route/page, request-response/static generation)

**Analog:** `site/src/pages/inventory.astro`

**Empty-state + grid pattern** (lines 26-73):
```astro
      {entryCount === 0 ? (
        <section class="phase-inventory__empty" aria-labelledby="empty-heading">
          <h2 id="empty-heading" class="phase-inventory__title">No corpus entries found</h2>
          <p>Add the umbrella framework and all twelve pillar entries to the typed inventory before running the static build.</p>
        </section>
      ) : (
        <section class="phase-inventory__grid" aria-label={`${entryCount} corpus entries`}>
          {corpusEntries.map((entry) => (
            <article class="phase-inventory__card">
```

**Metadata row pattern** (lines 45-68):
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
```

**Apply:** Generate `/glossary/` from `concepts.ts`, likely rendering `ConceptCard.astro` for each concept. Include term, aliases, notation, owning pillars, concise definition, related formal objects, related concepts, and source tier links. Keep it static and searchable via `data-pagefind-body`.

---

### `site/src/scripts/validate-formal-registry.ts` (utility/validation script, file-I/O + transform)

**Analog:** `site/src/scripts/validate-corpus.ts`

**Imports + interfaces pattern** (lines 1-18):
```typescript
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpusEntries } from '../data/corpus';
import { expectedCorpusIds, parseCorpusEntries, type CorpusEntry } from '../data/corpus.schema';

export interface ValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}
```

**Central addError pattern** (lines 38-47):
```typescript
function addError(
  errors: ValidationError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}
```

**Path safety pattern** (lines 119-189):
```typescript
  if (isAbsolute(pathValue)) {
    addError(
      errors,
      entry.id,
      field,
      pathValue,
      'Path must be project-root-relative',
      'Replace the absolute path with a path relative to the repository root',
    );
    return;
  }

  if (hasParentTraversal(pathValue)) {
    addError(
      errors,
      entry.id,
      field,
      pathValue,
      'Path cannot contain parent traversal',
      'Use a canonical path inside science/paper/ or pillars/*/paper/',
    );
    return;
  }
```

**Schema parse and collect-all-errors pattern** (lines 192-223):
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
```

**CLI behavior pattern** (lines 225-267):
```typescript
export function formatValidationError(error: ValidationError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validateCorpus();

  if (json) {
    const payload = {
      ok: result.ok,
      total_entries: corpusEntries.length,
      total_errors: result.errors.length,
      errors: result.errors,
    };
```

**Apply:** Build `validateFormalRegistry(...)` to collect all errors and exit non-zero. Validate duplicate formal IDs, stable ID regex, owner IDs, source paths exist, source tiers/material kinds, required chapter sections for all thirteen owners, rendered anchor IDs, relation targets, concept targets, citation references, and no active-source use of `archive/` unless provenance-only.

---

### `site/package.json` (config, batch)

**Analog:** `site/package.json`

**Script pattern** (lines 6-14):
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

**Dependency constraint pattern** (lines 15-29):
```json
  "dependencies": {
    "@astrojs/starlight": "^0.39.2",
    "astro": "^6.3.2",
    "katex": "^0.16.46",
    "pagefind": "^1.5.2",
    "rehype-katex": "^7.0.1",
    "remark-math": "^6.0.0",
    "zod": "^4.4.3"
  },
```

**Apply:** Integrate formal validation into `validate`, for example by chaining `bun run src/scripts/validate-corpus.ts && bun run src/scripts/validate-formal-registry.ts`. Do not add new packages for Phase 3.

---

### `site/src/data/formal-registry.test.ts` (test, batch)

**Analog:** `site/src/data/corpus.test.ts`

**Vitest imports pattern** (lines 1-8):
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

**Schema finite-values pattern** (lines 30-36):
```typescript
  it('accepts only finite source statuses from the source contract', () => {
    expect(sourceStatusSchema.safeParse('canonical').success).toBe(true);
    expect(sourceStatusSchema.safeParse('missing-source').success).toBe(true);
    expect(sourceStatusSchema.safeParse('archive-blocked').success).toBe(true);
    expect(sourceStatusSchema.safeParse('provenance-only').success).toBe(true);
    expect(sourceStatusSchema.safeParse('archived').success).toBe(false);
  });
```

**Inventory contract pattern** (lines 54-70):
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

**Apply:** Test formal object kind enums, source tier/material-kind enums, stable ID regex acceptance/rejection, parser success on real registry, owner coverage, duplicate-free IDs, concepts resolving to formal objects, and chapter contracts covering all expected owner IDs.

---

### `site/src/scripts/validate-formal-registry.test.ts` (test, batch)

**Analog:** `site/src/scripts/validate-corpus.test.ts`

**Imports + clone fixture pattern** (lines 1-8):
```typescript
import { describe, expect, it } from 'vitest';
import { corpusEntries } from '../data/corpus';
import type { CorpusEntry } from '../data/corpus.schema';
import { formatValidationError, validateCorpus } from './validate-corpus';

function cloneEntries(): CorpusEntry[] {
  return structuredClone(corpusEntries);
}
```

**Real data must pass pattern** (lines 10-15):
```typescript
describe('validateCorpus', () => {
  it('validates the real corpus inventory', () => {
    const result = validateCorpus();

    expect(result).toEqual({ ok: true, errors: [] });
  });
```

**Diagnostic assertion pattern** (lines 35-52):
```typescript
  it('fails with the exact archive-as-canonical diagnostic', () => {
    const entries = cloneEntries().map((entry) =>
      entry.id === 'security'
        ? {
            ...entry,
            canonicalTex: 'pillars/security/archive/security_architecture.tex',
            sourceStatus: 'canonical' as const,
          }
        : entry,
    );

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatValidationError)).toContain(
      'Entry security: canonicalTex points to pillars/security/archive/security_architecture.tex. Archive paths cannot be canonical sources. Move the reference to pillars/security/paper/.',
    );
  });
```

**Collect-all-errors pattern** (lines 170-203):
```typescript
  it('collects all validation errors for invalid fixtures', () => {
    const entries = cloneEntries().map((entry) => {
      if (entry.id === 'umbrella') {
        return { ...entry, canonicalTex: 'science/paper/does-not-exist.tex' };
      }

      if (entry.id === 'security') {
        return {
          ...entry,
          canonicalTex: 'pillars/security/archive/security_architecture.tex',
          sourceStatus: 'canonical' as const,
        };
      }

      return entry;
    });

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
```

**Apply:** Build fixtures by cloning registry/chapter/concept arrays and mutating one field at a time. Assert exact diagnostics for duplicate IDs, invalid owner, missing source path, archive-as-canonical, broken relation target, missing required chapter section, and invalid stable ID. Keep tests deterministic and file-system-aware via `repoRoot` option where needed.

---

### `site/src/components/formal/formal-components.test.ts` (test, batch)

**Analog:** `site/src/components/formal/formal-components.test.ts`

**Read source fixture pattern** (lines 1-15):
```typescript
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readFixture(path: string): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8');
}

const definitionSource = readFixture('./DefinitionBlock.astro');
const theoremSource = readFixture('./TheoremBlock.astro');
const derivationSource = readFixture('./DerivationWalkthrough.astro');
const citationSource = readFixture('./CitationRef.astro');
const sourceTrailSource = readFixture('./SourceTrail.astro');
const fixtureSource = readFixture('../../content/docs/formal-reading-fixture.mdx');
```

**Component contract pattern** (lines 30-50):
```typescript
  it('components expose labels, anchors, owner metadata, canonical source links, and visible source trails', () => {
    expect(definitionSource).toContain('<article id={id}');
    expect(definitionSource).toContain('Definition');
    expect(definitionSource).toContain('Stable ID');
    expect(definitionSource).toContain('Owner');
    expect(definitionSource).toContain('Canonical .tex source');
    expect(definitionSource).toContain('<slot name="source-trail"');

    expect(theoremSource).toContain('<article id={id}');
    expect(theoremSource).toContain('Claim');
    expect(theoremSource).toContain('Stable ID');
    expect(theoremSource).toContain('Owner');
    expect(theoremSource).toContain('Canonical .tex source');
    expect(theoremSource).toContain('<slot name="source-trail"');
```

**Source trail material-kind test pattern** (lines 52-65):
```typescript
  it('source trail supports exactly the required material-kind labels and visible rows', () => {
    expect(sourceTrailSource).not.toContain('<details');
    expect(sourceTrailSource).not.toContain('<summary');
    expect(sourceTrailSource).toContain("'canonical' | 'supporting' | 'synthesis/review' | 'archived/provenance'");
    expect(sourceTrailSource).toContain('Material kind');
    expect(sourceTrailSource).toContain('Canonical .tex source');
    expect(sourceTrailSource).toContain('Canonical PDF');
    expect(sourceTrailSource).toContain('Bibliography source');
    expect(sourceTrailSource).toContain('Source status');
```

**Apply:** Extend tests to assert theorem-kind prop support, `FormalObjectList.astro` imports/renders stable IDs, `ConceptCard.astro` shows aliases/notation/owners/related links, and source-trail rows stay visible. Keep fixture pages out of search indexing if adding new fixtures.

## Shared Patterns

### Typed registry-first data
**Source:** `site/src/data/corpus.schema.ts` and `site/src/data/corpus.ts`
**Apply to:** `formal-registry.schema.ts`, `formal-registry.ts`, `chapters.ts`, `concepts.ts`
```typescript
export const corpusEntriesSchema = z.array(corpusEntrySchema);

export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type CorpusEntry = z.infer<typeof corpusEntrySchema>;

export function parseCorpusEntries(entries: unknown): CorpusEntry[] {
  return corpusEntriesSchema.parse(entries);
}
```
Use Zod parse-at-definition data modules. The registry, concept, and chapter data should be invalid at import time if the shape is wrong.

### Static route generation from typed data
**Source:** `site/src/pages/corpus/[slug].astro`
**Apply to:** chapter route expansion and generated registry/glossary pages
```astro
export function getStaticPaths() {
  return corpusEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
```
Use Astro static data projection, not runtime fetches or a CMS.

### Book spine preservation
**Source:** `site/src/pages/corpus/[slug].astro` and `site/src/data/book-spine.ts`
**Apply to:** all curated chapter route changes
```astro
<SourceLinkPanel entry={entry} />
<BookFooterNav currentId={entry.id} />
```
```typescript
export const bookSpine: BookSpineItem[] = conceptualArc.map(toSpineItem);
```
Keep current `/corpus/[slug]/` URLs, sidebar order, previous/next navigation, and `SourceLinkPanel` behavior while replacing source-detail body content.

### Visible source-trail and source-tier labels
**Source:** `site/src/components/formal/SourceTrail.astro` and `site/src/components/SourceLinkPanel.astro`
**Apply to:** formal blocks, chapter sections, concept cards, source panels
```astro
<dt>Material kind</dt>
<dd><span class={`material-kind material-kind--${materialKindClass}`}>{materialKind}</span></dd>
```
```astro
<span class={`source-status source-status--${entry.sourceStatus}`}>
  {sourceStatusLabels[entry.sourceStatus]}
</span>
```
Do not hide provenance behind collapsible details; source tier/material kind is part of the reading contract.

### Repository source links
**Source:** `site/src/components/formal/SourceTrail.astro`
**Apply to:** all components linking canonical/supporting source paths
```typescript
const repositoryBaseUrl = 'https://github.com/ThePyProgrammer/harness_eng_research/blob/main/';

function repositoryHref(path: string): string {
  return new URL(path, repositoryBaseUrl).toString();
}
```
Centralize or copy this helper instead of hard-coding inconsistent repository URLs.

### Strict validation gate
**Source:** `site/src/scripts/validate-corpus.ts`
**Apply to:** `validate-formal-registry.ts`, `site/package.json`
```typescript
if (!result.ok) {
  for (const error of result.errors) {
    console.error(formatValidationError(error));
  }
}

return result.ok ? 0 : 1;
```
Formal registry validation should collect all errors and fail the build, matching existing provenance validation discipline.

### Test style
**Source:** `site/src/scripts/validate-corpus.test.ts`, `site/src/data/corpus.test.ts`, `site/src/components/formal/formal-components.test.ts`
**Apply to:** new registry, validation, and component tests
```typescript
const result = validateCorpus();

expect(result).toEqual({ ok: true, errors: [] });
```
```typescript
expect(result.errors).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      entryId: 'security',
      field: 'canonicalTex',
      reason: 'Archive paths cannot be canonical sources',
    }),
  ]),
);
```
Test both real-data success and mutated-fixture failure diagnostics.

## No Analog Found

All identified Phase 3 files have close analogs in the existing site codebase. No files require planner fallback to research-only patterns.

## Metadata

**Analog search scope:** `/home/prannayag/harness_eng/site/src`, `/home/prannayag/harness_eng/site/package.json`, `/home/prannayag/harness_eng/site/astro.config.mjs`
**Files scanned:** 24 source/config files listed under `site/src` and site config
**Analogs read:** 15 files
**Pattern extraction date:** 2026-05-19
