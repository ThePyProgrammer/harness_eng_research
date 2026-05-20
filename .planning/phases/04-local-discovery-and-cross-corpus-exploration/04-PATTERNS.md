# Phase 04: Local Discovery and Cross-Corpus Exploration - Pattern Map

**Mapped:** 2026-05-20
**Files analyzed:** 12 new/modified files
**Analogs found:** 12 / 12

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `site/src/data/discovery.schema.ts` | model/config | transform | `site/src/data/formal-registry.schema.ts` | exact |
| `site/src/data/reading-paths.ts` | model/config | transform | `site/src/data/book-spine.ts` | role-match |
| `site/src/data/relations.ts` | model/config | transform | `site/src/data/formal-registry.ts` + `site/src/data/concepts.ts` | role-match |
| `site/src/components/discovery/ReadingPathMap.astro` | component | request-response | `site/src/components/AtlasConstellation.astro` | role-match |
| `site/src/components/discovery/RelatedLinks.astro` | component | request-response | `site/src/components/formal/ConceptCard.astro` | exact |
| `site/src/components/discovery/GraphNeighborhood.astro` | component | request-response | `site/src/components/AtlasConstellation.astro` | role-match |
| `site/src/components/discovery/SearchPanel.astro` | component | request-response | `site/src/components/formal/FormalObjectList.astro` | role-match |
| `site/src/pages/reading-paths/[slug].astro` | route | request-response | `site/src/pages/corpus/[slug].astro` | exact |
| `site/src/pages/graph/index.astro` | route | request-response | `site/src/pages/formal-registry/index.astro` | role-match |
| `site/src/pages/graph/[id].astro` | route | request-response | `site/src/pages/corpus/[slug].astro` | exact |
| `site/src/pages/search.astro` | route | request-response | `site/src/pages/glossary/index.astro` | role-match |
| `site/src/scripts/validate-discovery.ts` | utility | batch | `site/src/scripts/validate-formal-registry.ts` | exact |
| `site/src/scripts/generate-local-indexes.ts` | utility | file-I/O | `site/src/scripts/generate-local-indexes.ts` | exact-modification |
| `site/src/data/discovery.test.ts` | test | batch | `site/src/data/formal-registry.test.ts` | exact |
| `site/src/scripts/validate-discovery.test.ts` | test | batch | `site/src/scripts/validate-formal-registry.test.ts` | exact |
| `site/src/scripts/generate-local-indexes.test.ts` | test | file-I/O | `site/src/scripts/generate-local-indexes.test.ts` | exact-modification |
| `site/src/components/discovery/*.test.ts` | test | batch | `site/src/components/AtlasConstellation.test.ts` | role-match |

## Pattern Assignments

### `site/src/data/discovery.schema.ts` (model/config, transform)

**Analog:** `site/src/data/formal-registry.schema.ts`

**Imports pattern** (lines 1-4):
```typescript
import { z } from 'zod';
import { expectedCorpusIds } from './corpus.schema';

export const ownerIdSchema = z.enum(expectedCorpusIds);
```

**Schema vocabulary pattern** (lines 24-31):
```typescript
const semanticIdPattern = /^(umbrella|abstraction|information|reliability|coordination|temporal|quality|governance|economics|human-interaction|model-routing|security|accretion)\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nonEmptyStringSchema = z.string().trim().min(1);

export const formalObjectIdSchema = z.string().regex(semanticIdPattern);
export const conceptIdSchema = z.string().regex(slugPattern);

export const sourceTrailItemSchema = z.object({
```

**Object/array schema pattern** (lines 45-56):
```typescript
export const formalObjectSchema = z.object({
  id: formalObjectIdSchema,
  ownerId: ownerIdSchema,
  kind: formalObjectKindSchema,
  title: nonEmptyStringSchema,
  statement: nonEmptyStringSchema,
  notation: z.array(nonEmptyStringSchema).default([]),
  sourceTrail: z.array(sourceTrailItemSchema).min(1),
  conceptIds: z.array(conceptIdSchema).default([]),
  citationIds: z.array(conceptIdSchema).default([]),
  relatedObjectIds: z.array(formalObjectIdSchema).default([]),
});
```

**Parse/type export pattern** (lines 96-120):
```typescript
export const formalRegistrySchema = z.array(formalObjectSchema);
export const chapterRegistrySchema = z.array(chapterRecordSchema);
export const conceptRegistrySchema = z.array(conceptRecordSchema);

export type OwnerId = z.infer<typeof ownerIdSchema>;
export type FormalObjectKind = z.infer<typeof formalObjectKindSchema>;
export type SourceTier = z.infer<typeof sourceTierSchema>;
export type CurationStatus = z.infer<typeof curationStatusSchema>;
export type SourceTrailItem = z.infer<typeof sourceTrailItemSchema>;
export type CitationRecord = z.infer<typeof citationRecordSchema>;
export type FormalObject = z.infer<typeof formalObjectSchema>;
export type ChapterRecord = z.infer<typeof chapterRecordSchema>;
export type ConceptRecord = z.infer<typeof conceptRecordSchema>;

export function parseFormalRegistry(registry: unknown): FormalObject[] {
  return formalRegistrySchema.parse(registry);
}

export function parseChapterRegistry(registry: unknown): ChapterRecord[] {
  return chapterRegistrySchema.parse(registry);
}

export function parseConceptRegistry(registry: unknown): ConceptRecord[] {
  return conceptRegistrySchema.parse(registry);
}
```

**Apply:** Put relation-type, relation-record, reading-path, graph-node, graph-edge, and search-record schemas here. Reuse `ownerIdSchema`, formal object IDs, concept IDs, source trails, `z.enum`, `.trim().min(1)`, `.default([])`, and parser helpers.

---

### `site/src/data/reading-paths.ts` (model/config, transform)

**Analog:** `site/src/data/book-spine.ts`

**Imports and derived data pattern** (lines 1-22):
```typescript
import { corpusEntries } from './corpus';
import type { CorpusEntry } from './corpus.schema';

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

type CorpusBackedSpineId = CorpusEntry['id'];
export type BookSpineId = (typeof conceptualArc)[number];
```

**Lookup validation pattern** (lines 30-40):
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

**Plain export pattern** (lines 42-58):
```typescript
function toSpineItem(id: BookSpineId): BookSpineItem {
  if (id === 'overview') {
    return { id, title: 'Overview', href: '/' };
  }

  const entry = getCorpusEntry(id);
  return { id, title: entry.title, href: `/corpus/${entry.slug}/` };
}

export const bookSpine: BookSpineItem[] = conceptualArc.map(toSpineItem);

export const bookSidebar = [
  {
    label: 'Book spine',
    items: bookSpine.map((item) => ({ label: item.title, link: item.href })),
  },
];
```

**Apply:** Author the five required reading paths as plain typed objects, export route-map arrays, derive hrefs from `corpusEntries`/formal/concept registries, and throw early if curated stops reference missing IDs.

---

### `site/src/data/relations.ts` (model/config, transform)

**Analog:** `site/src/data/formal-registry.schema.ts` and existing registry relation fields.

**Existing relationship field pattern** (lines 45-56):
```typescript
export const formalObjectSchema = z.object({
  id: formalObjectIdSchema,
  ownerId: ownerIdSchema,
  kind: formalObjectKindSchema,
  title: nonEmptyStringSchema,
  statement: nonEmptyStringSchema,
  notation: z.array(nonEmptyStringSchema).default([]),
  sourceTrail: z.array(sourceTrailItemSchema).min(1),
  conceptIds: z.array(conceptIdSchema).default([]),
  citationIds: z.array(conceptIdSchema).default([]),
  relatedObjectIds: z.array(formalObjectIdSchema).default([]),
});
```

**Concept relationship pattern** (lines 84-94):
```typescript
export const conceptRecordSchema = z.object({
  id: conceptIdSchema,
  term: nonEmptyStringSchema,
  aliases: z.array(nonEmptyStringSchema).default([]),
  notation: z.array(nonEmptyStringSchema).default([]),
  ownerIds: z.array(ownerIdSchema).min(1),
  definition: nonEmptyStringSchema,
  sourceTrail: z.array(sourceTrailItemSchema).min(1),
  formalObjectIds: z.array(formalObjectIdSchema).default([]),
  relatedConceptIds: z.array(conceptIdSchema).default([]),
});
```

**Apply:** Keep relation records extensible but not freeform: relation types should carry ID, readable label, category, directionality, and target-family constraints. Relation records should reference stable owner/formal/concept/citation/reading-path IDs and be validated by `validate-discovery.ts`.

---

### `site/src/components/discovery/ReadingPathMap.astro` (component, request-response)

**Analog:** `site/src/components/AtlasConstellation.astro`

**Frontmatter import/derived-state pattern** (lines 1-9):
```astro
---
import { bookSpine } from '../data/book-spine';

const umbrella = bookSpine.find((item) => item.id === 'umbrella');
const pillars = bookSpine.filter((item) => item.id !== 'overview' && item.id !== 'umbrella');

if (!umbrella) {
  throw new Error('Atlas constellation requires an umbrella spine item.');
}
---
```

**Accessible map structure pattern** (lines 12-22):
```astro
<section class="atlas-constellation" aria-labelledby="atlas-map-heading">
  <div class="atlas-constellation__header">
    <p class="atlas-constellation__eyebrow">Scholarly atlas of harness architecture</p>
    <h2 id="atlas-map-heading">Harness Architecture Corpus Map</h2>
    <p>
      The umbrella framework anchors twelve source-backed research pillars. Follow the map in book-spine order to inspect
      Phase 2 source-detail pages before the full curated chapters arrive.
    </p>
  </div>

  <nav class="atlas-constellation__map" aria-label="Harness Architecture Corpus Map links">
```

**Clickable node pattern** (lines 28-43):
```astro
<a class="atlas-constellation__node atlas-constellation__node--umbrella" href={umbrella.href}>
  <span class="atlas-constellation__node-kicker">Umbrella framework</span>
  <span class="atlas-constellation__node-title">{umbrella.title}</span>
  <span class="atlas-constellation__node-action">Open umbrella framework</span>
</a>

<ol class="atlas-constellation__pillar-list" aria-label="Pillars in book spine order">
  {pillars.map((pillar, index) => (
    <li class={`atlas-constellation__pillar atlas-constellation__pillar--${index + 1}`}>
      <a class="atlas-constellation__node atlas-constellation__node--pillar" href={pillar.href} aria-label={`Open ${pillar.title} source detail`}>
        <span class="atlas-constellation__node-kicker">Pillar {String(index + 1).padStart(2, '0')}</span>
        <span class="atlas-constellation__node-title">{pillar.title}</span>
        <span class="atlas-constellation__node-action">Open {pillar.title} source detail</span>
      </a>
    </li>
  ))}
</ol>
```

**Apply:** Render branching path stops as semantic `nav`/`ol` route maps with lightweight guidance and direct links. Use CSS classes under the atlas/discovery namespace; avoid canvas-only or JS-only graph behavior.

---

### `site/src/components/discovery/RelatedLinks.astro` (component, request-response)

**Analog:** `site/src/components/formal/ConceptCard.astro`

**Props/lookup pattern** (lines 2-15):
```astro
---
import type { ConceptRecord, FormalObject, OwnerId, SourceTier } from '../../data/formal-registry.schema';

type OwnerLookup = Partial<Record<OwnerId, { title: string; slug: string }>>;
type FormalObjectLookup = Partial<Record<string, FormalObject>>;
type ConceptLookup = Partial<Record<string, ConceptRecord>>;

interface Props {
  concept: ConceptRecord;
  ownerLookup: OwnerLookup;
  formalObjectLookup: FormalObjectLookup;
  conceptLookup: ConceptLookup;
}

const { concept, ownerLookup, formalObjectLookup, conceptLookup } = Astro.props;
```

**Typed label pattern** (lines 17-24):
```astro
const sourceTierLabels: Record<SourceTier, string> = {
  canonical: 'Canonical',
  'supporting-research': 'Supporting research',
  'synthesis-review': 'Synthesis/review',
  'archived-provenance': 'Archived provenance',
};

const sourceTiers = Array.from(new Set(concept.sourceTrail.map((source) => source.tier)));
```

**Related-links rendering pattern** (lines 60-81):
```astro
<div>
  <dt>Related formal objects</dt>
  <dd>
    {concept.formalObjectIds.length > 0
      ? concept.formalObjectIds.map((objectId) => {
        const object = formalObjectLookup[objectId];
        const owner = object ? ownerLookup[object.ownerId] : undefined;
        return <a href={owner ? `/corpus/${owner.slug}/#${objectId}` : `#${objectId}`}><code>{objectId}</code></a>;
      })
      : 'None registered'}
  </dd>
</div>
<div>
  <dt>Related concepts</dt>
  <dd>
    {concept.relatedConceptIds.length > 0
      ? concept.relatedConceptIds.map((conceptId) => {
        const related = conceptLookup[conceptId];
        return <a href={`#${conceptId}`}>{related?.term ?? conceptId}</a>;
      })
      : 'None registered'}
  </dd>
</div>
```

**Apply:** Group relation records by relation type label/category, display readable labels, and emit direct links to `/corpus/<slug>/#<formal-id>`, `/glossary/#<concept-id>`, reading-path pages, or citation anchors. Keep fallback text for empty groups.

---

### `site/src/components/discovery/GraphNeighborhood.astro` (component, request-response)

**Analog:** `site/src/components/AtlasConstellation.astro`

**Static SVG/list hybrid pattern** (lines 22-27):
```astro
<nav class="atlas-constellation__map" aria-label="Harness Architecture Corpus Map links">
  <svg class="atlas-constellation__lines" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <circle cx="50" cy="50" r="31" pathLength="1" />
    <path d="M50 50 L50 14 M50 50 L68 18 M50 50 L84 34 M50 50 L86 58 M50 50 L72 80 M50 50 L54 88 M50 50 L32 82 M50 50 L16 66 M50 50 L14 42 M50 50 L28 20 M50 50 L46 12 M50 50 L84 74" />
  </svg>
```

**Accessible clickable-node pattern** (lines 34-45):
```astro
<ol class="atlas-constellation__pillar-list" aria-label="Pillars in book spine order">
  {pillars.map((pillar, index) => (
    <li class={`atlas-constellation__pillar atlas-constellation__pillar--${index + 1}`}>
      <a class="atlas-constellation__node atlas-constellation__node--pillar" href={pillar.href} aria-label={`Open ${pillar.title} source detail`}>
        <span class="atlas-constellation__node-kicker">Pillar {String(index + 1).padStart(2, '0')}</span>
        <span class="atlas-constellation__node-title">{pillar.title}</span>
        <span class="atlas-constellation__node-action">Open {pillar.title} source detail</span>
      </a>
    </li>
  ))}
</ol>
```

**Apply:** Keep graph render static and navigable. Use SVG only as decorative/context lines and put real navigation in links/lists. For dense neighborhoods, prefer typed next-hop lists over every edge.

---

### `site/src/components/discovery/SearchPanel.astro` (component, request-response)

**Analog:** `site/src/components/formal/FormalObjectList.astro`

**Props and labels pattern** (lines 2-20):
```astro
---
import type { FormalObject, OwnerId, SourceTier } from '../../data/formal-registry.schema';
import type { SourceStatus } from '../../data/corpus.schema';

type OwnerLookup = Partial<Record<OwnerId, { title: string; slug: string; sourceStatus: SourceStatus }>>;

interface Props {
  objects: FormalObject[];
  ownerLookup: OwnerLookup;
  heading?: string;
}

const { objects, ownerLookup, heading = 'Formal objects' } = Astro.props;

const sourceTierLabels: Record<SourceTier, string> = {
  canonical: 'Canonical',
  'supporting-research': 'Supporting research',
  'synthesis-review': 'Synthesis/review',
  'archived-provenance': 'Archived provenance',
};
```

**Empty state pattern** (lines 45-50):
```astro
{objects.length === 0 ? (
  <div class="formal-registry-empty" role="status">
    <h3>No formal objects registered yet</h3>
    <p>This chapter has a source trail, but its definitions, claims, citations, and concepts have not been curated into the registry yet. Add registry entries before marking the chapter complete.</p>
  </div>
) : (
```

**Result row metadata pattern** (lines 51-87):
```astro
<ol class="formal-registry-list__items">
  {objects.map((object) => {
    const owner = ownerLookup[object.ownerId];
    const tier = primarySourceTier(object);
    const href = owner ? `/corpus/${owner.slug}/#${object.id}` : `#${object.id}`;

    return (
      <li class="formal-registry-row">
        <a class="formal-registry-row__anchor" href={href}>Anchor link</a>
        <div class="formal-registry-row__content">
          <p class="formal-registry-row__kind">{kindLabels[object.kind]}</p>
          <h3 class="formal-registry-row__title">{object.title}</h3>
          <dl class="formal-registry-row__metadata">
            <div>
              <dt>Stable ID</dt>
              <dd><code>{object.id}</code></dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{owner?.title ?? object.ownerId}</dd>
            </div>
            <div>
              <dt>Source tier</dt>
              <dd><span class={`source-tier source-tier--${tier}`}>{sourceTierLabels[tier]}</span></dd>
            </div>
```

**Apply:** For custom Pagefind UI, preserve grouped result sections and show type, stable ID/title, owner context, snippet/excerpt, and anchor link. Client script may use Pagefind, but rendered HTML should remain safe and accessible.

---

### `site/src/pages/reading-paths/[slug].astro` (route, request-response)

**Analog:** `site/src/pages/corpus/[slug].astro`

**Imports/page setup pattern** (lines 1-18):
```astro
---
import BookFooterNav from '../../components/BookFooterNav.astro';
import SourceLinkPanel from '../../components/SourceLinkPanel.astro';
import DefinitionBlock from '../../components/formal/DefinitionBlock.astro';
import TheoremBlock from '../../components/formal/TheoremBlock.astro';
import DerivationWalkthrough from '../../components/formal/DerivationWalkthrough.astro';
import CitationRef from '../../components/formal/CitationRef.astro';
import SourceTrail from '../../components/formal/SourceTrail.astro';
import FormalObjectList from '../../components/formal/FormalObjectList.astro';
import ConceptCard from '../../components/formal/ConceptCard.astro';
import { bookSpine } from '../../data/book-spine';
import { corpusEntries } from '../../data/corpus';
import { sourceStatusLabels } from '../../data/corpus.schema';
import { chapterRegistry } from '../../data/chapters';
import { conceptRegistry } from '../../data/concepts';
import { citations, formalRegistry } from '../../data/formal-registry';
import type { FormalObject, OwnerId, SourceTier } from '../../data/formal-registry.schema';
import '../../styles/atlas.css';
```

**Static route generation pattern** (lines 83-106):
```astro
export function getStaticPaths() {
  return corpusEntries.map((entry) => {
    const chapter = getChapterByOwner(entry.id);
    const formalObjects = chapter.formalObjectIds.map((objectId) => {
      const object = formalObjectLookup[objectId];
      if (!object) {
        throw new Error(`Missing formal registry object ${objectId} for ${entry.id}`);
      }
      return object;
    });
    const concepts = chapter.conceptIds.map((conceptId) => {
      const concept = conceptLookup[conceptId];
      if (!concept) {
        throw new Error(`Missing concept registry object ${conceptId} for ${entry.id}`);
      }
      return concept;
    });

    return {
      params: { slug: entry.slug },
      props: { entry, chapter, formalObjects, concepts },
    };
  });
}
```

**Page body/search indexing pattern** (lines 112-145):
```astro
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
  </head>
  <body class="atlas-page source-detail-page">
    <div class="source-detail-shell">
      <aside class="book-spine-panel" aria-labelledby="book-spine-heading">
        <p class="book-spine-panel__eyebrow">Book spine</p>
        <h2 id="book-spine-heading">Book spine</h2>
        <nav aria-label="Book spine">
```

**Apply:** Use `getStaticPaths()` over `readingPaths`; validate referenced stops before returning props; include `data-pagefind-body` on route-map content so reading paths are searchable.

---

### `site/src/pages/graph/index.astro` (route, request-response)

**Analog:** `site/src/pages/formal-registry/index.astro`

**Registry page import pattern** (lines 1-7):
```astro
---
import FormalObjectList from '../../components/formal/FormalObjectList.astro';
import { corpusEntries } from '../../data/corpus';
import { formalRegistry } from '../../data/formal-registry';
import type { FormalObject } from '../../data/formal-registry.schema';
import '../../styles/atlas.css';
```

**Searchable static page shell pattern** (lines 23-35):
```astro
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Browse formal registry | Harness Architecture Book Wiki</title>
  </head>
  <body class="atlas-page">
    <main class="registry-page" data-pagefind-body>
      <header class="registry-page__header">
        <p class="source-detail__eyebrow">Stable formal object anchors</p>
        <h1>Browse formal registry</h1>
        <p>Browse formal objects grouped by corpus owner and kind. Each row links back to the rendered chapter block through its stable semantic ID.</p>
      </header>
```

**Grouped sections pattern** (lines 37-53):
```astro
{corpusEntries.map((entry) => {
  const ownerObjects = formalRegistry.filter((object) => object.ownerId === entry.id);
  return (
    <section class="registry-page__owner" aria-labelledby={`${entry.id}-registry-heading`}>
      <h2 id={`${entry.id}-registry-heading`}>{entry.title}</h2>
      {kindOrder.map((kind) => {
        const objects = ownerObjects.filter((object) => object.kind === kind);
        return objects.length > 0 ? (
          <section class="registry-page__kind" aria-labelledby={`${entry.id}-${kind}-registry-heading`}>
            <h3 id={`${entry.id}-${kind}-registry-heading`}>{kindLabels[kind]}</h3>
            <FormalObjectList objects={objects} ownerLookup={ownerLookup} heading={`${entry.title}: ${kindLabels[kind]}`} />
          </section>
        ) : null;
      })}
    </section>
  );
})}
```

**Apply:** Render high-level graph overview grouped by corpus owner, relation category, or path family. Keep the global overview high-level and searchable.

---

### `site/src/pages/graph/[id].astro` (route, request-response)

**Analog:** `site/src/pages/corpus/[slug].astro`

**Lookup helper and hard-fail pattern** (lines 52-58):
```typescript
export function getChapterByOwner(ownerId: OwnerId) {
  const chapter = chapterRegistry.find((item) => item.ownerId === ownerId);
  if (!chapter) {
    throw new Error(`Missing chapter registry record for owner: ${ownerId}`);
  }
  return chapter;
}
```

**Static route props pattern** (lines 101-105):
```typescript
return {
  params: { slug: entry.slug },
  props: { entry, chapter, formalObjects, concepts },
};
```

**Apply:** Generate one neighborhood page per graph node/neighborhood ID. Fail if source node, target node, or label data is missing. Include both local typed links and source-grounded context.

---

### `site/src/pages/search.astro` (route, request-response)

**Analog:** `site/src/pages/glossary/index.astro`

**Imports/lookup pattern** (lines 1-10):
```astro
---
import ConceptCard from '../../components/formal/ConceptCard.astro';
import { corpusEntries } from '../../data/corpus';
import { conceptRegistry } from '../../data/concepts';
import { formalRegistry } from '../../data/formal-registry';
import '../../styles/atlas.css';

const ownerLookup = Object.fromEntries(corpusEntries.map((item) => [item.id, item]));
const formalObjectLookup = Object.fromEntries(formalRegistry.map((item) => [item.id, item]));
const conceptLookup = Object.fromEntries(conceptRegistry.map((item) => [item.id, item]));
```

**Searchable page body pattern** (lines 13-25):
```astro
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Glossary | Harness Architecture Book Wiki</title>
  </head>
  <body class="atlas-page">
    <main class="registry-page glossary-page" data-pagefind-body>
      <header class="registry-page__header">
        <p class="source-detail__eyebrow">Concept index</p>
        <h1>Glossary</h1>
        <p>Concept cards expose canonical terms, alias links, notation, owning pillars, source tier links, related formal objects, and reciprocal related concepts from the typed registry.</p>
      </header>
```

**Anchor index pattern** (lines 27-34):
```astro
<section class="glossary-page__aliases" aria-labelledby="glossary-alias-heading">
  <h2 id="glossary-alias-heading">Alias links</h2>
  <ul>
    {conceptRegistry.flatMap((concept) => concept.aliases.map((alias) => (
      <li><a href={`#${concept.id}`}>{alias}</a> points to {concept.term}</li>
    )))}
  </ul>
</section>
```

**Apply:** Search page should host the grouped Pagefind UI and include static fallback/index text for result types. Use `data-pagefind-body` deliberately and avoid rendering unescaped raw Pagefind `content`.

---

### `site/src/scripts/validate-discovery.ts` (utility, batch)

**Analog:** `site/src/scripts/validate-formal-registry.ts`

**Imports and types pattern** (lines 1-27):
```typescript
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import { expectedCorpusIds } from '../data/corpus.schema';
import { citations, derivationCoverageByOwner as defaultDerivationCoverageByOwner, formalRegistry, type DerivationCoverageEntry } from '../data/formal-registry';
import {
  chapterRecordSchema,
  conceptRecordSchema,
  curationStatusSchema,
  formalObjectSchema,
  ownerIdSchema,
  type ChapterRecord,
  type CitationRecord,
  type ConceptRecord,
  type FormalObject,
  type SourceTrailItem,
} from '../data/formal-registry.schema';

export interface FormalRegistryValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}
```

**Error accumulation pattern** (lines 64-73):
```typescript
function addError(
  errors: FormalRegistryValidationError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}
```

**Target validation pattern** (lines 242-296):
```typescript
function validateTargets(
  formalObjects: FormalObject[],
  chapters: ChapterRecord[],
  concepts: ConceptRecord[],
  citationsInput: CitationRecord[],
  errors: FormalRegistryValidationError[],
): void {
  const formalIds = new Set(formalObjects.map((object) => object.id));
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const citationIds = new Set(citationsInput.map((citation) => citation.id));

  for (const object of formalObjects) {
    for (const relatedId of object.relatedObjectIds) {
      if (!formalIds.has(relatedId)) {
        addError(errors, object.id, 'relatedObjectIds', relatedId, 'Relation target does not exist', 'Add the target formal object or remove the relation.');
      }
    }
```

**Validation orchestrator pattern** (lines 298-329):
```typescript
export function validateFormalRegistry(
  fixture: RegistryFixture = {},
  options: { repoRoot?: string } = {},
): FormalRegistryValidationResult {
  const errors: FormalRegistryValidationError[] = [];
  const formalObjects = fixture.formalObjects ?? formalRegistry;
  const chapters = fixture.chapters ?? chapterRegistry;
  const concepts = fixture.concepts ?? conceptRegistry;
  const citationInput = fixture.citations ?? citations;
  const coverageByOwner = fixture.derivationCoverage ?? defaultDerivationCoverageByOwner;
  const repoRoot = options.repoRoot ?? defaultRepoRoot();

  validateSchemaShapes(formalObjects, chapters, concepts, errors);
  validateExpectedOwners(chapters, formalObjects, concepts, errors);
  validateDuplicateFormalIds(formalObjects, errors);
  validateChapterSections(chapters, errors);

  for (const object of formalObjects) {
    validateSourceTrail(object.id, object.ownerId, object.sourceTrail, repoRoot, errors);
  }
```

**CLI hard-fail pattern** (lines 331-368):
```typescript
export function formatFormalRegistryError(error: FormalRegistryValidationError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validateFormalRegistry();

  if (json) {
    const payload = {
      ok: result.ok,
      total_formal_objects: formalRegistry.length,
      total_chapters: chapterRegistry.length,
      total_concepts: conceptRegistry.length,
      total_errors: result.errors.length,
      errors: result.errors,
    };
    const output = JSON.stringify(payload, null, 2);
    if (result.ok) {
      console.log(output);
    } else {
      console.error(output);
    }
  } else if (result.ok) {
    console.log(`OK: ${formalRegistry.length} formal objects, ${chapterRegistry.length} chapters, and ${conceptRegistry.length} concepts validated, 0 errors found.`);
  } else {
    console.error(`ERRORS: ${result.errors.length} formal registry validation error(s):`);
    for (const error of result.errors) {
      console.error(formatFormalRegistryError(error));
    }
  }

  return result.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
```

**Apply:** Validate relation type definitions, relation sources/targets, reading-path stop targets, graph node labels, graph edge targets, duplicate IDs, required five paths, and search fixtures. Return structured errors and non-zero CLI exit.

---

### `site/src/scripts/generate-local-indexes.ts` (utility, file-I/O)

**Analog:** existing `site/src/scripts/generate-local-indexes.ts`

**Imports/output type pattern** (lines 1-18):
```typescript
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpusEntries } from '../data/corpus';
import type { CorpusEntry } from '../data/corpus.schema';

export interface CorpusIndex {
  generatedBy: 'site/src/scripts/generate-local-indexes.ts';
  entryCount: number;
  entries: CorpusEntry[];
}

export interface WriteCorpusIndexOptions {
  outputDir?: string;
}

const generatedBy = 'site/src/scripts/generate-local-indexes.ts' as const;
const outputFileName = 'corpus-index.json';
```

**Site-boundary safety pattern** (lines 20-33):
```typescript
function siteRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../..');
}

function assertInsideSite(outputDir: string, root: string): string {
  const resolvedOutputDir = isAbsolute(outputDir) ? resolve(outputDir) : resolve(root, outputDir);
  const relativePath = relative(root, resolvedOutputDir);

  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error('Output directory must stay inside site/');
  }

  return resolvedOutputDir;
}
```

**Build/write pattern** (lines 35-54):
```typescript
export function buildCorpusIndex(entries: CorpusEntry[] = corpusEntries): CorpusIndex {
  return {
    generatedBy,
    entryCount: entries.length,
    entries: entries.map((entry) => ({ ...entry })),
  };
}

export function writeCorpusIndex(options: WriteCorpusIndexOptions = {}): string {
  const root = siteRoot();
  const outputDir = options.outputDir ?? 'dist';
  const safeOutputDir = assertInsideSite(outputDir, root);
  const outputPath = resolve(safeOutputDir, outputFileName);
  const payload = `${JSON.stringify(buildCorpusIndex(), null, 2)}\n`;

  mkdirSync(safeOutputDir, { recursive: true });
  writeFileSync(outputPath, payload, 'utf-8');

  return outputPath;
}
```

**CLI error pattern** (lines 56-70):
```typescript
function runCli(): number {
  try {
    writeCorpusIndex();
    console.error('Successfully created: dist/corpus-index.json');
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: Failed to save output: ${message}`);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
```

**Apply:** Extend this script rather than adding a competing writer. Add builders/writers for discovery indexes (`search-index.json`, `relations-index.json`, `graph-index.json`, reading-path index) while keeping all writes inside `site/dist`.

---

## Test Pattern Assignments

### `site/src/data/discovery.test.ts` (test, batch)

**Analog:** `site/src/data/formal-registry.test.ts`

**Imports and fixture constants pattern** (lines 1-12):
```typescript
import { describe, expect, it } from 'vitest';
import { expectedCorpusIds } from './corpus.schema';
import { chapterRegistry } from './chapters';
import { conceptRegistry } from './concepts';
import {
  formalObjectIdSchema,
  parseChapterRegistry,
  parseConceptRegistry,
  parseFormalRegistry,
  sourceTierSchema,
} from './formal-registry.schema';
import { derivationCoverageByOwner, formalRegistry } from './formal-registry';
```

**Schema contract pattern** (lines 70-86):
```typescript
describe('formal registry schema contract', () => {
  it('accepts semantic owner-prefixed ids and rejects paper or line-number ids', () => {
    expect(formalObjectIdSchema.safeParse('reliability.compound-error-bound').success).toBe(true);
    expect(formalObjectIdSchema.safeParse('theorem-1').success).toBe(false);
    expect(formalObjectIdSchema.safeParse('science.tex:42').success).toBe(false);
  });

  it('defines the exact Phase 3 source tier labels', () => {
    expect(sourceTierSchema.options).toEqual([
      'canonical',
      'supporting-research',
      'synthesis-review',
      'archived-provenance',
    ]);
    expect(sourceTierSchema.safeParse('archive').success).toBe(false);
  });
});
```

**Coverage loop pattern** (lines 104-139):
```typescript
it('FORM-01 through FORM-10 and D-05 through D-16: provides all-owner chapter, registry, citation, source, concept, and derivation coverage', () => {
  expect(expectedCorpusIds).toHaveLength(13);
  expect(chapterRegistry.filter((entry) => entry.ownerId === 'umbrella')).toHaveLength(1); // FORM-01 / D-02 umbrella chapter.
  expect(chapterRegistry.filter((entry) => entry.ownerId !== 'umbrella')).toHaveLength(12); // FORM-02 all twelve pillars.

  for (const ownerId of expectedCorpusIds) {
    const chapter = chapterRegistry.find((entry) => entry.ownerId === ownerId);
    const objects = ownerObjects(ownerId);
    const ownerConcepts = conceptRegistry.filter((entry) => entry.ownerIds.includes(ownerId));
    const matrixEntries = derivationCoverageByOwner[ownerId];

    expect(chapter, `${ownerId} chapter`).toBeDefined(); // FORM-01 / FORM-02
    expect(chapter?.curationStatus, `${ownerId} curation`).toBe('curated'); // FORM-03 / D-04 final prose gate.
```

**Apply:** Assert exactly five required reading paths, required result classes, valid relation categories, all 13 owners covered in discovery graph/search surfaces, and stable IDs/anchors preserved.

---

### `site/src/scripts/validate-discovery.test.ts` (test, batch)

**Analog:** `site/src/scripts/validate-formal-registry.test.ts`

**Clone fixture pattern** (lines 1-20):
```typescript
import { describe, expect, it } from 'vitest';
import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import type { ChapterRecord, ConceptRecord, FormalObject } from '../data/formal-registry.schema';
import { derivationCoverageByOwner, formalRegistry } from '../data/formal-registry';
import { formatFormalRegistryError, validateFormalRegistry } from './validate-formal-registry';

function cloneFixture(): {
  formalObjects: FormalObject[];
  chapters: ChapterRecord[];
  concepts: ConceptRecord[];
  derivationCoverage: typeof derivationCoverageByOwner;
} {
  return {
    formalObjects: structuredClone(formalRegistry),
    chapters: structuredClone(chapterRegistry),
    concepts: structuredClone(conceptRegistry),
    derivationCoverage: structuredClone(derivationCoverageByOwner),
  };
}
```

**Real data validation pattern** (lines 22-25):
```typescript
describe('validateFormalRegistry', () => {
  it('validates the real Phase 3 registry data', () => {
    expect(validateFormalRegistry()).toEqual({ ok: true, errors: [] });
  });
```

**Diagnostic assertion pattern** (lines 79-99):
```typescript
it('fails missing required chapter sections and broken relation targets', () => {
  const fixture = cloneFixture();
  fixture.chapters[0] = {
    ...fixture.chapters[0],
    sections: { ...fixture.chapters[0].sections, formalClaims: '' },
  };
  fixture.formalObjects[0] = {
    ...fixture.formalObjects[0],
    relatedObjectIds: ['umbrella.missing-target'],
  };

  const result = validateFormalRegistry(fixture);

  expect(result.ok).toBe(false);
  expect(result.errors.map(formatFormalRegistryError)).toEqual(
    expect.arrayContaining([
      expect.stringContaining('Missing required chapter section'),
      expect.stringContaining('Relation target does not exist'),
    ]),
  );
});
```

**Apply:** Add negative tests for duplicate relation type IDs, invalid target IDs, missing labels, malformed directionality, missing five paths, broken graph renderability labels, and missing expected search fixture anchors.

---

### `site/src/scripts/generate-local-indexes.test.ts` (test, file-I/O)

**Analog:** existing `site/src/scripts/generate-local-indexes.test.ts`

**Temporary dist write pattern** (lines 1-21):
```typescript
import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { corpusEntries } from '../data/corpus';
import { buildCorpusIndex, writeCorpusIndex } from './generate-local-indexes';

const testSiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

describe('generate-local-indexes', () => {
  it('writes corpus-index.json under the provided output directory with entryCount 13', () => {
    mkdirSync(join(testSiteRoot, 'dist'), { recursive: true });
    const outputDir = mkdtempSync(join(testSiteRoot, 'dist', 'corpus-index-'));

    const outputPath = writeCorpusIndex({ outputDir });
    const payload = JSON.parse(readFileSync(outputPath, 'utf-8'));

    expect(payload.generatedBy).toBe('site/src/scripts/generate-local-indexes.ts');
    expect(payload.entryCount).toBe(13);
    expect(payload.entries).toHaveLength(13);
  });
```

**Boundary refusal pattern** (lines 40-44):
```typescript
it('refuses output paths outside the provided site output directory', () => {
  expect(() => writeCorpusIndex({ outputDir: '../dist' })).toThrow(
    'Output directory must stay inside site/',
  );
});
```

**Apply:** Add tests for each new generated file, counts by type, required result classes, formal-object anchor URLs, graph node/edge counts, and the existing outside-`site/` write guard.

---

### `site/src/components/discovery/*.test.ts` (test, batch)

**Analog:** `site/src/components/AtlasConstellation.test.ts`

**Source inspection test pattern** (lines 1-12):
```typescript
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const componentSource = readFileSync(
  fileURLToPath(new URL('./AtlasConstellation.astro', import.meta.url)),
  'utf8',
);
const homepageSource = readFileSync(
  fileURLToPath(new URL('../content/docs/index.mdx', import.meta.url)),
  'utf8',
);
```

**Contract assertions pattern** (lines 14-33):
```typescript
describe('AtlasConstellation homepage contract', () => {
  it('renders the atlas before the introductory essay', () => {
    expect(homepageSource).toContain('Scholarly atlas of harness architecture');
    expect(homepageSource).toContain('Harness Architecture Corpus Map');
    expect(homepageSource).toContain('Explore the corpus map');
    expect(homepageSource).toContain('A book/wiki for source-grounded harness research');
    expect(homepageSource.indexOf('<AtlasConstellation />')).toBeLessThan(
      homepageSource.indexOf('## A book/wiki for source-grounded harness research'),
    );
  });

  it('uses the shared book spine and source-detail links', () => {
    expect(componentSource).toContain("import { bookSpine }");
    expect(componentSource).not.toContain('const pillarArc');
    expect(componentSource).toContain("item.id === 'umbrella'");
    expect(componentSource).toContain('pillars = bookSpine.filter');
    expect(componentSource).toContain('Open umbrella framework');
    expect(componentSource).toContain('Open {pillar.title} source detail');
  });
});
```

**Apply:** Use source-level component contract tests where Astro rendering is unnecessary: assert components import shared discovery data, preserve direct links, include ARIA labels, and do not hard-code duplicate route/path registries.

## Shared Patterns

### Static, searchable Astro pages

**Source:** `site/src/pages/corpus/[slug].astro`
**Apply to:** reading path pages, graph pages, search page, formal-object search surfaces
```astro
<main class="source-detail chapter-page" data-pagefind-body>
```
Lines 140-145 show that searchable content is explicitly scoped with `data-pagefind-body` and page headers carry semantic titles/summaries.

### Stable anchor and deep-link pattern

**Source:** `site/src/components/formal/FormalObjectList.astro`
**Apply to:** search results, related links, graph nodes, reading path stops
```astro
const href = owner ? `/corpus/${owner.slug}/#${object.id}` : `#${object.id}`;

return (
  <li class="formal-registry-row">
    <a class="formal-registry-row__anchor" href={href}>Anchor link</a>
```
Lines 53-60 are the pattern for anchor-level formal-object links required by DISC-03.

### Source trail and archive discipline

**Source:** `site/src/scripts/validate-formal-registry.ts`
**Apply to:** discovery validation, relation source/provenance links, graph/search artifacts
```typescript
if (source.tier === 'canonical') {
  if (archivePathPattern.test(source.path)) {
    addError(errors, entryId, 'sourceTrail.path', source.path, 'Archive paths cannot be canonical sources', 'Relabel as archived-provenance or use the owning paper directory.');
  }

  const sourceOwner = sourceOwnerFromPath(source.path);
  if (sourceOwner !== ownerId && !(entryId === 'reliability.compound-error-bound' && sourceOwner === 'umbrella')) {
    addError(errors, entryId, 'sourceTrail.path', source.path, 'Canonical source path does not match owner', 'Use science/paper/ for umbrella or pillars/<owner>/paper/ for pillar records.');
  }
}
```
Lines 112-121 must be copied conceptually for discovery provenance checks: archive paths are not active canonical sources.

### Centralized validation result/error shape

**Source:** `site/src/scripts/validate-formal-registry.ts`
**Apply to:** `validate-discovery.ts`
```typescript
export interface FormalRegistryValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface FormalRegistryValidationResult {
  ok: boolean;
  errors: FormalRegistryValidationError[];
}
```
Lines 21-31 establish the structured diagnostics the planner should reuse.

### Safe generated file output

**Source:** `site/src/scripts/generate-local-indexes.ts`
**Apply to:** every JSON index/artifact writer
```typescript
function assertInsideSite(outputDir: string, root: string): string {
  const resolvedOutputDir = isAbsolute(outputDir) ? resolve(outputDir) : resolve(root, outputDir);
  const relativePath = relative(root, resolvedOutputDir);

  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error('Output directory must stay inside site/');
  }

  return resolvedOutputDir;
}
```
Lines 24-33 are mandatory for generated discovery artifacts.

### Vitest fixture style

**Source:** `site/src/scripts/validate-formal-registry.test.ts`
**Apply to:** all discovery data/validator/index tests
```typescript
const result = validateFormalRegistry(fixture);

expect(result.ok).toBe(false);
expect(result.errors.map(formatFormalRegistryError)).toEqual(
  expect.arrayContaining([
    expect.stringContaining('Missing required chapter section'),
    expect.stringContaining('Relation target does not exist'),
  ]),
);
```
Lines 90-99 show the diagnostic-focused test style.

## No Analog Found

None. Every planned Phase 4 file has an existing site analog. The weakest matches are `SearchPanel.astro` and graph components because Pagefind browser API and graph pages are new surfaces, but their static rendering, grouping, anchor, and validation patterns are covered by existing registry/formal components and scripts.

## Metadata

**Analog search scope:** `/home/prannayag/harness_eng/site/src` plus project instructions in `/home/prannayag/harness_eng/CLAUDE.md`.
**Files scanned:** 27 site source files listed; 14 files read for concrete analogs.
**Pattern extraction date:** 2026-05-20
