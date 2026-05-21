# Phase 5: Release Quality and Static Publication Readiness - Pattern Map

**Mapped:** 2026-05-21
**Files analyzed:** 9 new/modified files
**Analogs found:** 9 / 9

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `site/package.json` | config | batch | `site/package.json` | exact-existing |
| `site/src/scripts/release-readiness.ts` | utility/orchestrator | batch | `site/src/scripts/validate-discovery.ts` | role-match |
| `site/src/scripts/generate-coverage-matrix.ts` | utility/generator | transform + file-I/O | `site/src/scripts/generate-local-indexes.ts` | exact |
| `site/src/scripts/validate-output-shape.ts` | utility/validator | file-I/O | `site/src/scripts/validate-corpus.ts` | role-match |
| `site/src/scripts/validate-math-fixtures.ts` | utility/validator | file-I/O | `site/src/scripts/validate-formal-registry.ts` | role-match |
| `site/src/scripts/validate-print-readiness.ts` | utility/validator | file-I/O | `site/src/scripts/validate-corpus.ts` | role-match |
| `site/src/pages/release-readiness.astro` | page/component | transform | `site/src/pages/formal-registry/index.astro` | role-match |
| `site/src/styles/atlas.css` | style/config | transform | `site/src/styles/atlas.css` | exact-existing |
| `site/src/scripts/*.test.ts` for new release scripts | test | batch | `site/src/scripts/generate-local-indexes.test.ts` | exact |

## Pattern Assignments

### `site/package.json` (config, batch)

**Analog:** `site/package.json`

**Script orchestration pattern** (lines 6-13):
```json
"scripts": {
  "dev": "astro dev",
  "build:astro": "astro build",
  "check": "astro check",
  "validate": "bun run src/scripts/validate-corpus.ts && bun run src/scripts/validate-formal-registry.ts && bun run src/scripts/validate-discovery.ts",
  "index": "bun run src/scripts/generate-local-indexes.ts && if find dist -name '*.html' | grep -q .; then pagefind --site dist; else echo 'Skipping Pagefind: no static HTML found in dist yet.' >&2; fi",
  "build": "bun run validate && bun run build:astro && bun run index",
  "test": "vitest run"
}
```

**Apply:** Add a focused `release` or `release:check` script that calls `bun run src/scripts/release-readiness.ts`. Preserve individual `validate`, `check`, `build:astro`, `index`, and `test` commands for debugging.

---

### `site/src/scripts/release-readiness.ts` (utility/orchestrator, batch)

**Analog:** `site/src/scripts/validate-discovery.ts`

**Imports pattern** (lines 1-18):
```typescript
import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import { citations, formalRegistry } from '../data/formal-registry';
import {
  relationRecordSchema,
  relationTypeRecordSchema,
  type DiscoverySearchRecord,
  type GraphEdge,
  type GraphIndex,
  type GraphNode,
  type SearchResultType,
  type RelationRecord,
  type RelationTarget,
  type RelationTypeRecord,
} from '../data/discovery.schema';
import { readingPaths } from '../data/reading-paths';
import { relationRecords as defaultRelationRecords, relationTypes as defaultRelationTypes } from '../data/relations';
import { buildDiscoverySearchIndex, buildGraphIndex } from './generate-local-indexes';
```

**Diagnostic shape pattern** (lines 20-27):
```typescript
export interface DiscoveryValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}
```

**Validation result pattern** (lines 45-50):
```typescript
export interface DiscoveryValidationResult {
  ok: boolean;
  errors: DiscoveryValidationError[];
  searchFixtures: DiscoverySearchFixture[];
  totals: DiscoveryValidationTotals;
}
```

**Error accumulation pattern** (lines 60-69):
```typescript
function addError(
  errors: DiscoveryValidationError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}
```

**Core orchestration pattern** (lines 333-360):
```typescript
export function validateDiscovery(fixture: DiscoveryFixture = {}): DiscoveryValidationResult {
  const errors: DiscoveryValidationError[] = [];
  const relationTypes = fixture.relationTypes ?? defaultRelationTypes;
  const relationRecords = fixture.relationRecords ?? defaultRelationRecords;
  const searchRecords = fixture.searchRecords ?? buildDiscoverySearchIndex().records;
  const searchFixtures = fixture.searchFixtures ?? defaultSearchFixtures;
  const graphIndex = fixture.graphIndex ?? buildGraphIndex();

  validateTypeDefinitions(relationTypes, errors);
  validateRecordSemantics(relationRecords, relationTypes, errors);
  validateSearchFixtures(searchRecords, searchFixtures, errors);
  validateGraphIndex(graphIndex, relationRecords, relationTypes, errors);

  const graphNodeIds = new Set([
    ...graphIndex.overview.nodes.map((node) => node.id),
    ...graphIndex.neighborhoods.flatMap((neighborhood) => [neighborhood.current.id, ...neighborhood.nodes.map((node) => node.id), ...neighborhood.nextHops.map((node) => node.id)]),
  ]);
  const totals: DiscoveryValidationTotals = {
    paths: readingPaths.length,
    relations: relationRecords.length,
    relationTypes: relationTypes.length,
    graphNodes: graphNodeIds.size,
    graphNeighborhoods: graphIndex.neighborhoods.length,
    searchFixtures: searchFixtures.length,
    errors: errors.length,
  };

  return { ok: errors.length === 0, errors, searchFixtures, totals };
}
```

**CLI output/error pattern** (lines 367-400):
```typescript
function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validateDiscovery();

  if (json) {
    const payload = {
      ok: result.ok,
      totals: result.totals,
      total_errors: result.totals.errors,
      errors: result.errors,
    };
    const output = JSON.stringify(payload, null, 2);
    if (result.ok) {
      console.log(output);
    } else {
      console.error(output);
    }
  } else if (result.ok) {
    console.log(`OK: ${result.totals.paths} reading paths, ${result.totals.relationTypes} relation types, ${result.totals.relations} relation records, ${result.totals.graphNodes} graph nodes, ${result.totals.graphNeighborhoods} graph neighborhoods, and ${result.totals.searchFixtures} search fixtures validated, 0 errors found.`);
  } else {
    console.error(`ERRORS: ${result.errors.length} discovery validation error(s):`);
    for (const error of result.errors) {
      console.error(formatDiscoveryError(error));
    }
  }

  return result.ok ? 0 : 1;
}
```

**Apply:** Import existing validators (`validateCorpus`, `validateFormalRegistry`, `validateDiscovery`) and new gate functions; normalize all failures to the `{ entryId, field, path, reason, nextStep }` diagnostic shape with an added `gate` field; print summary first, grouped diagnostics second; `process.exit(1)` on any gate failure.

---

### `site/src/scripts/generate-coverage-matrix.ts` (utility/generator, transform + file-I/O)

**Analog:** `site/src/scripts/generate-local-indexes.ts`

**Imports pattern** (lines 1-10):
```typescript
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { conceptRegistry } from '../data/concepts';
import { corpusEntries } from '../data/corpus';
import type { CorpusEntry } from '../data/corpus.schema';
import { citations, formalRegistry } from '../data/formal-registry';
import { readingPaths } from '../data/reading-paths';
import { relationRecords, relationTypes } from '../data/relations';
```

**Generated artifact interface pattern** (lines 12-18, 22-28, 30-35):
```typescript
export interface CorpusIndex {
  generatedBy: 'site/src/scripts/generate-local-indexes.ts';
  entryCount: number;
  entries: CorpusEntry[];
}

export interface RelationIndex {
  generatedBy: 'site/src/scripts/generate-local-indexes.ts';
  typeCount: number;
  recordCount: number;
  types: typeof relationTypes;
  records: typeof relationRecords;
}
```

**Output safety pattern** (lines 44-57):
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

**Data-first generation pattern** (lines 154-169):
```typescript
export function buildDiscoverySearchIndex(entries: CorpusEntry[] = corpusEntries): DiscoverySearchIndex {
  const records = [
    ...pageRecords(entries),
    ...formalObjectRecords(),
    ...conceptRecords(),
    ...citationRecords(),
    ...readingPathRecords(),
  ];

  return parseDiscoverySearchIndex({
    generatedBy,
    recordCount: records.length,
    resultClasses,
    records,
  });
}
```

**Write artifact pattern** (lines 363-374):
```typescript
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

**CLI error handling pattern** (lines 438-449):
```typescript
function runCli(): number {
  try {
    const outputPaths = writeAllLocalIndexes();
    for (const outputPath of outputPaths) {
      console.error(`Successfully created: ${relative(siteRoot(), outputPath)}`);
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: Failed to save output: ${message}`);
    return 1;
  }
}
```

**Apply:** Build one typed `CoverageMatrix` from `corpusEntries`, `chapterRegistry`, `conceptRegistry`, `formalRegistry`, `citations`, derivation coverage, reading paths, and generated discovery indexes. Write JSON under `site/dist` only. Reuse the same data model for validation and for the Astro report page.

---

### `site/src/scripts/validate-output-shape.ts` (utility/validator, file-I/O)

**Analog:** `site/src/scripts/validate-corpus.ts`

**Imports pattern** (lines 1-5):
```typescript
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpusEntries } from '../data/corpus';
import { expectedCorpusIds, parseCorpusEntries, type CorpusEntry } from '../data/corpus.schema';
```

**Validator result pattern** (lines 7-18):
```typescript
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

**Repo root/default path pattern** (lines 30-36):
```typescript
function defaultRepoRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
}

function hasParentTraversal(pathValue: string): boolean {
  return pathValue.split(/[\\/]+/).includes('..');
}
```

**Existence check/error pattern** (lines 179-189):
```typescript
const resolvedPath = resolve(repoRoot, pathValue.split('/').join(sep));
if (!existsSync(resolvedPath)) {
  addError(
    errors,
    entry.id,
    field,
    pathValue,
    'Required canonical source path does not exist',
    'Restore the file or update the inventory to the canonical paper path',
  );
}
```

**Plain formatter pattern** (lines 225-239):
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

**Apply:** After `build:astro` and `index`, walk `site/dist` and assert required deployable artifacts: `index.html`, corpus pages, formal registry, glossary, graph, reading paths, generated JSON indexes, Pagefind assets, and coverage JSON/page. For internal links, parse generated HTML text for local `href`s and IDs; report missing path/fragment using the standard diagnostic shape.

---

### `site/src/scripts/validate-math-fixtures.ts` (utility/validator, file-I/O)

**Analog:** `site/src/scripts/validate-formal-registry.ts`

**Imports pattern** (lines 1-19):
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
```

**Required coverage constants pattern** (lines 42-54):
```typescript
const archivePathPattern = /(^|\/)archive(\/|$)/;
const requiredChapterSections = [
  'problem',
  'coreModel',
  'keyNotation',
  'definitions',
  'formalClaims',
  'derivationContext',
  'interpretation',
  'relatedPillars',
  'citations',
  'sourceTrail',
] as const;
```

**Source validation pattern** (lines 90-128):
```typescript
function validateSourceTrail(
  entryId: string,
  ownerId: string,
  sourceTrail: SourceTrailItem[],
  repoRoot: string,
  errors: FormalRegistryValidationError[],
): void {
  if (sourceTrail.length === 0) {
    addError(errors, entryId, 'sourceTrail', entryId, 'Missing required source trail', 'Add at least one labeled source trail item.');
  }

  for (const source of sourceTrail) {
    if (isAbsolute(source.path)) {
      addError(errors, entryId, 'sourceTrail.path', source.path, 'Path must be project-root-relative', 'Replace the absolute path with a repository-relative path.');
      continue;
    }

    if (hasParentTraversal(source.path)) {
      addError(errors, entryId, 'sourceTrail.path', source.path, 'Path cannot contain parent traversal', 'Use a canonical or explicitly labeled support path inside the repository.');
      continue;
    }

    const resolvedPath = resolve(repoRoot, source.path.split('/').join(sep));
    if (!existsSync(resolvedPath)) {
      addError(errors, entryId, 'sourceTrail.path', source.path, 'Required source path does not exist', 'Restore the source file or update the registry path.');
    }
  }
}
```

**Derivation coverage pattern** (lines 203-239):
```typescript
function validateDerivationCoverage(
  formalObjects: FormalObject[],
  chapters: ChapterRecord[],
  coverageByOwner: Record<string, DerivationCoverageEntry[]>,
  errors: FormalRegistryValidationError[],
): void {
  const formalObjectById = new Map(formalObjects.map((object) => [object.id, object]));

  for (const ownerId of expectedCorpusIds) {
    const entries = coverageByOwner[ownerId];
    const chapter = chapters.find((entry) => entry.ownerId === ownerId);
    if (!entries?.length) {
      addError(errors, ownerId, 'derivationCoverageByOwner', ownerId, 'Missing owner in derivation coverage matrix', 'Add a supported derivation/equation entry or source-grounded not-supported rationale.');
      continue;
    }

    for (const entry of entries) {
      if (entry.status === 'supported') {
        if (entry.formalObjectIds.length === 0) {
          addError(errors, ownerId, 'derivationCoverageByOwner.formalObjectIds', entry.sourcePath, 'Supported derivation has no formal object IDs', 'Link supported sources to derivation or equation objects.');
        }
      } else {
        if (entry.formalObjectIds.length > 0 || !entry.rationale?.includes(entry.sourcePath) || entry.rationale.length <= 40) {
          addError(errors, ownerId, 'derivationCoverageByOwner.rationale', entry.sourcePath, 'Unsupported derivation lacks source-grounded rationale', 'Provide a source-path-specific rationale and no formal object IDs.');
        }
      }
    }
  }
}
```

**Apply:** Define fixture records for umbrella plus representative pillars. Check canonical `.tex` files exist and contain exact math/source snippets; check corresponding formal registry IDs and rendered `dist` anchors exist. Use source-grounded diagnostics when snippets are absent or registry/rendering drift occurs.

---

### `site/src/scripts/validate-print-readiness.ts` (utility/validator, file-I/O)

**Analog:** `site/src/scripts/validate-corpus.ts` + `site/src/styles/atlas.css`

**Validator shape:** Copy the `ValidationError`/`ValidationResult` pattern from `validate-corpus.ts` lines 7-18.

**CSS source classes to preserve in print** (`site/src/styles/atlas.css` lines 466-484):
```css
.formal-block,
.formal-citation,
.formal-footnote,
.formal-bibliography-entry,
.formal-source-trail {
  background: color-mix(in srgb, var(--atlas-color-secondary), white 8%);
  border: 1px solid color-mix(in srgb, var(--atlas-color-accent), transparent 68%);
  border-radius: 18px;
  box-shadow: 0 16px 40px color-mix(in srgb, var(--atlas-color-accent), transparent 90%);
  color: var(--atlas-color-text);
  display: grid;
  font-family: var(--atlas-font-family-sans);
  font-size: var(--atlas-font-size-body);
  font-weight: 400;
  gap: var(--atlas-space-md);
  line-height: 1.5;
  margin: var(--atlas-space-xl) 0;
  padding: var(--atlas-space-lg);
}
```

**Navigation chrome selectors to hide in print** (`site/src/styles/atlas.css` lines 225-239, 447-460, 1292-1311):
```css
.book-spine-panel {
  align-self: start;
  padding: var(--atlas-space-lg);
  position: sticky;
  top: var(--atlas-space-lg);
}

.book-footer-nav {
  border-top: 1px solid color-mix(in srgb, var(--atlas-color-accent), transparent 72%);
  display: flex;
  gap: var(--atlas-space-md);
  justify-content: space-between;
  padding-top: var(--atlas-space-lg);
}

.graph-neighborhood__cta {
  background: var(--atlas-color-accent);
  border-radius: 999px;
  color: var(--atlas-color-dominant);
  justify-content: center;
  padding: var(--atlas-space-sm) var(--atlas-space-lg);
  text-decoration: none;
  width: fit-content;
}
```

**Apply:** Static validator should read `site/src/styles/atlas.css` and representative built pages. Required signals: `@media print`, `@page`, URL expansion (`a[href]::after` or scoped equivalent), explicit rules for `.book-spine-panel` and `.book-footer-nav`, and preservation/non-hiding of `.formal-source-trail`, `.formal-block`, citations, and source paths.

---

### `site/src/pages/release-readiness.astro` (page/component, transform)

**Analog:** `site/src/pages/formal-registry/index.astro`

**Imports/data pattern** (lines 1-6):
```astro
---
import FormalObjectList from '../../components/formal/FormalObjectList.astro';
import { corpusEntries } from '../../data/corpus';
import { formalRegistry } from '../../data/formal-registry';
import type { FormalObject } from '../../data/formal-registry.schema';
import '../../styles/atlas.css';
---
```

**HTML shell pattern** (lines 23-35):
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

**Registry grouping pattern** (lines 37-53):
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

**Alternative page inventory pattern:** `site/src/pages/inventory.astro` lines 15-23 shows a report-like shell with summary and source metadata:
```astro
<body class="phase-inventory">
  <main class="phase-inventory__shell" data-pagefind-body>
    <header class="phase-inventory__header">
      <p class="phase-inventory__eyebrow">Phase 1 provenance contract</p>
      <h1>Corpus Inventory</h1>
      <p class="phase-inventory__summary">
        13 corpus entries render from the typed inventory: the umbrella framework and all twelve pillar papers.
        Each entry keeps a source trail to repository-relative canonical artifacts only.
      </p>
    </header>
```

**Apply:** Render a compact coverage grid grouped by corpus owner. Link owner rows to chapter pages, formal anchors, source trails, and diagnostics. Import/build coverage data from TypeScript source if static, or from generated JSON only if Astro can consume it at build time without runtime fetching.

---

### `site/src/styles/atlas.css` (style/config, transform)

**Analog:** `site/src/styles/atlas.css`

**Design token pattern** (lines 1-22):
```css
:root {
  --atlas-color-dominant: #F7F3EA;
  --atlas-color-secondary: #E8DDC8;
  --atlas-color-accent: #7A3E1D;
  --atlas-color-destructive: #B42318;
  --atlas-color-text: #1F2933;
  --atlas-color-muted: #475569;
  --atlas-color-success: #166534;
  --atlas-space-xs: 4px;
  --atlas-space-sm: 8px;
  --atlas-space-md: 16px;
  --atlas-space-lg: 24px;
  --atlas-space-xl: 32px;
  --atlas-space-2xl: 48px;
  --atlas-space-3xl: 64px;
  --atlas-font-size-body: 16px;
  --atlas-font-size-label: 14px;
  --atlas-font-size-heading: 20px;
  --atlas-font-size-display: 28px;
  --atlas-font-family-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --atlas-font-family-mono: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}
```

**Formal/source visual pattern** (lines 490-553):
```css
.formal-block__header,
.formal-derivation__header,
.formal-source-trail__header {
  align-items: start;
  display: flex;
  gap: var(--atlas-space-md);
  justify-content: space-between;
}

.formal-block__source-link,
.formal-citation a,
.formal-source-trail a,
.formal-registry-row__anchor,
.concept-card a {
  align-items: center;
  color: var(--atlas-color-accent);
  display: inline-flex;
  min-height: 44px;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
```

**Responsive/media-query placement pattern** (lines 1447-1546):
```css
@media (max-width: 720px) {
  .atlas-constellation {
    margin: var(--atlas-space-xl) 0;
    padding: var(--atlas-space-lg);
  }

  .book-spine-panel {
    position: static;
  }

  .related-links__row,
  .search-panel__controls,
  .search-result-item__metadata div,
  .source-panel__header,
  .source-panel__row,
  .material-kind-legend,
  .book-footer-nav,
  .formal-block__header,
  .formal-derivation__header,
  .formal-source-trail__header,
  .formal-block__meta-row,
  .formal-source-trail__row,
  .formal-registry-row__metadata div,
  .concept-card__metadata div {
    display: grid;
    grid-template-columns: 1fr;
  }
}
```

**Apply:** Add `@media print` near existing media queries. Use existing variables, preserve formal blocks/source trails, remove navigational chrome, expand URLs for citation-friendly handouts, and avoid broad `aside { display: none }` rules that could hide provenance.

---

### `site/src/scripts/*.test.ts` for new release scripts (test, batch)

**Analog:** `site/src/scripts/generate-local-indexes.test.ts`

**Imports/setup pattern** (lines 1-10):
```typescript
import { existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { corpusEntries } from '../data/corpus';
import { readingPaths } from '../data/reading-paths';
import { relationRecords, relationTypes } from '../data/relations';
import { buildCorpusIndex, buildDiscoverySearchIndex, buildGraphIndex, buildReadingPathsIndex, buildRelationIndex, writeAllLocalIndexes, writeCorpusIndex, writeDiscoverySearchIndex, writeGraphIndex, writeReadingPathsIndex, writeRelationIndex } from './generate-local-indexes';

const testSiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
```

**Filesystem artifact test pattern** (lines 68-85):
```typescript
describe('generate-local-indexes', () => {
  it('writes all generated Phase 4 artifacts in a single bounded invocation', () => {
    mkdirSync(join(testSiteRoot, 'dist'), { recursive: true });
    const outputDir = mkdtempSync(join(testSiteRoot, 'dist', 'all-indexes-'));

    const outputPaths = writeAllLocalIndexes({ outputDir });

    expect(outputPaths.map((path) => path.split('/').at(-1))).toEqual([
      'corpus-index.json',
      'search-index.json',
      'relation-index.json',
      'reading-paths-index.json',
      'graph-index.json',
    ]);
    for (const fileName of ['corpus-index.json', 'search-index.json', 'relation-index.json', 'reading-paths-index.json', 'graph-index.json']) {
      expect(existsSync(join(outputDir, fileName)), fileName).toBe(true);
    }
  });
```

**Output safety test pattern** (lines 97-105):
```typescript
it('writes relation and reading path indexes inside site/dist only', () => {
  mkdirSync(join(testSiteRoot, 'dist'), { recursive: true });
  const outputDir = mkdtempSync(join(testSiteRoot, 'dist', 'discovery-indexes-'));

  expect(writeRelationIndex({ outputDir }).endsWith('relation-index.json')).toBe(true);
  expect(writeReadingPathsIndex({ outputDir }).endsWith('reading-paths-index.json')).toBe(true);
  expect(() => writeRelationIndex({ outputDir: '../dist' })).toThrow('Output directory must stay inside site/');
  expect(() => writeReadingPathsIndex({ outputDir: '../dist' })).toThrow('Output directory must stay inside site/');
});
```

**Diagnostic test pattern:** `site/src/scripts/validate-corpus.test.ts` lines 21-32:
```typescript
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
```

**Apply:** For each new script, test: real data passes; representative bad fixture fails with exact diagnostic fields; generated output stays under `site/dist`; print validator catches missing `@media print`; output-shape validator catches missing index/page; math validator catches missing source snippet.

## Shared Patterns

### Structured actionable diagnostics
**Source:** `site/src/scripts/validate-corpus.ts` lines 7-18, 38-47, 225-239; `site/src/scripts/validate-discovery.ts` lines 20-27, 60-69, 363-400
**Apply to:** All new validators and release orchestrator
```typescript
export interface ValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

function addError(errors: ValidationError[], entryId: string, field: string, path: string, reason: string, nextStep: string): void {
  errors.push({ entryId, field, path, reason, nextStep });
}

export function formatValidationError(error: ValidationError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}
```

### Repository-relative path and archive discipline
**Source:** `site/src/scripts/validate-corpus.ts` lines 20-29, 119-165; `site/src/scripts/validate-formal-registry.ts` lines 101-127
**Apply to:** Output-shape, math fixtures, coverage source trails
```typescript
if (isAbsolute(pathValue)) {
  addError(errors, entry.id, field, pathValue, 'Path must be project-root-relative', 'Replace the absolute path with a path relative to the repository root');
  return;
}

if (hasParentTraversal(pathValue)) {
  addError(errors, entry.id, field, pathValue, 'Path cannot contain parent traversal', 'Use a canonical path inside science/paper/ or pillars/*/paper/');
  return;
}

if (!isProvenanceArchive && archivePathPattern.test(pathValue)) {
  addError(errors, entry.id, field, pathValue, 'Archive paths cannot be canonical sources', archiveNextStep(entry));
}
```

### Generated static artifact safety
**Source:** `site/src/scripts/generate-local-indexes.ts` lines 44-57, 363-374, 428-435
**Apply to:** Coverage JSON generation and any release artifact writer
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

### Data-first indexes/reports
**Source:** `site/src/scripts/generate-local-indexes.ts` lines 154-169, 305-360
**Apply to:** Coverage matrix/report and release diagnostics
```typescript
export function buildDiscoverySearchIndex(entries: CorpusEntry[] = corpusEntries): DiscoverySearchIndex {
  const records = [
    ...pageRecords(entries),
    ...formalObjectRecords(),
    ...conceptRecords(),
    ...citationRecords(),
    ...readingPathRecords(),
  ];

  return parseDiscoverySearchIndex({
    generatedBy,
    recordCount: records.length,
    resultClasses,
    records,
  });
}
```

### Static page shell and pagefind body
**Source:** `site/src/pages/formal-registry/index.astro` lines 23-35; `site/src/pages/corpus/[slug].astro` lines 115-143
**Apply to:** `site/src/pages/release-readiness.astro`
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
      </header>
```

### Test fixture style
**Source:** `site/src/scripts/validate-corpus.test.ts` lines 10-32; `site/src/scripts/generate-local-indexes.test.ts` lines 68-85
**Apply to:** Tests for coverage, output shape, math fixtures, print readiness, release orchestrator
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
    expect(result.errors).toEqual(expect.arrayContaining([expect.objectContaining({ entryId: 'security' })]));
  });
});
```

## No Analog Found

No files lack analogs. The codebase already has matching patterns for TypeScript validators, generated static indexes, strict path/output safety, Astro report pages, CSS extension, package script orchestration, and Vitest coverage.

## Metadata

**Analog search scope:** `/home/prannayag/harness_eng/site/src/**/*.ts`, `/home/prannayag/harness_eng/site/src/**/*.astro`, `/home/prannayag/harness_eng/site/src/**/*.css`, `/home/prannayag/harness_eng/site/package.json`
**Files scanned:** 40 site source/config files listed via `find`
**Project skills:** No `.claude/skills/` or `.agents/skills/` directory found in project
**Pattern extraction date:** 2026-05-21
