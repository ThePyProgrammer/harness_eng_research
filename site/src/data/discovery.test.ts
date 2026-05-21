import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { chapterRegistry } from './chapters';
import { conceptRegistry } from './concepts';
import { citations, formalRegistry } from './formal-registry';
import { parseReadingPaths } from './discovery.schema';
import { readingPaths } from './reading-paths';
import { relationTypes } from './relations';

const requiredSlugs = [
  'building-a-harness',
  'scaling-multi-agent-work',
  'cost-latency',
  'production-hardening',
  'ai-code-degradation',
] as const;

const chapterIds = new Set(chapterRegistry.map((chapter) => chapter.ownerId));
const conceptIds = new Set(conceptRegistry.map((concept) => concept.id));
const formalObjectIds = new Set(formalRegistry.map((object) => object.id));
const citationIds = new Set(citations.map((citation) => citation.id));
const readingPathIds = new Set(requiredSlugs);

const sourceFiles = {
  readingPathPage: readFileSync(fileURLToPath(new URL('../pages/reading-paths/[slug].astro', import.meta.url)), 'utf8'),
  readingPathMap: readFileSync(fileURLToPath(new URL('../components/discovery/ReadingPathMap.astro', import.meta.url)), 'utf8'),
  searchPanel: readFileSync(fileURLToPath(new URL('../components/discovery/SearchPanel.astro', import.meta.url)), 'utf8'),
  searchPage: readFileSync(fileURLToPath(new URL('../pages/search.astro', import.meta.url)), 'utf8'),
  relatedLinks: readFileSync(fileURLToPath(new URL('../components/discovery/RelatedLinks.astro', import.meta.url)), 'utf8'),
  formalObjectList: readFileSync(fileURLToPath(new URL('../components/formal/FormalObjectList.astro', import.meta.url)), 'utf8'),
  corpusPage: readFileSync(fileURLToPath(new URL('../pages/corpus/[slug].astro', import.meta.url)), 'utf8'),
  graphOverviewPage: readFileSync(fileURLToPath(new URL('../pages/graph/index.astro', import.meta.url)), 'utf8'),
  graphNeighborhoodPage: readFileSync(fileURLToPath(new URL('../pages/graph/[id].astro', import.meta.url)), 'utf8'),
  graphNeighborhood: readFileSync(fileURLToPath(new URL('../components/discovery/GraphNeighborhood.astro', import.meta.url)), 'utf8'),
  indexScript: readFileSync(fileURLToPath(new URL('../scripts/generate-local-indexes.ts', import.meta.url)), 'utf8'),
  validationScript: readFileSync(fileURLToPath(new URL('../scripts/validate-discovery.ts', import.meta.url)), 'utf8'),
  styles: readFileSync(fileURLToPath(new URL('../styles/atlas.css', import.meta.url)), 'utf8'),
};

function hasKnownTarget(type: string, id: string): boolean {
  if (type === 'chapter') return chapterIds.has(id as never);
  if (type === 'concept') return conceptIds.has(id);
  if (type === 'formal-object') return formalObjectIds.has(id);
  if (type === 'citation') return citationIds.has(id);
  if (type === 'reading-path') return readingPathIds.has(id as never);
  return false;
}

describe('reading path data contract', () => {
  it('parses the curated reading path registry with exactly the five required BOOK-04 themes', () => {
    expect(parseReadingPaths(readingPaths)).toEqual(readingPaths);
    expect(readingPaths.map((path) => path.slug)).toEqual([...requiredSlugs]);
  });

  it('renders each reading path as a branching route map with stops', () => {
    for (const path of readingPaths) {
      expect(path.branches.length, `${path.slug} branch count`).toBeGreaterThanOrEqual(2);
      expect(path.purpose, `${path.slug} purpose`).toEqual(expect.any(String));
      expect(path.purpose.length, `${path.slug} purpose length`).toBeGreaterThan(80);

      for (const branch of path.branches) {
        expect(branch.stops.length, `${path.slug}/${branch.id} stop count`).toBeGreaterThan(0);
        expect(branch.summary, `${path.slug}/${branch.id} summary`).toEqual(expect.any(String));
      }
    }
  });

  it('gives every stop guidance text plus a direct target reference and href', () => {
    for (const path of readingPaths) {
      for (const branch of path.branches) {
        for (const stop of branch.stops) {
          expect(stop.title.trim(), `${stop.id} title`).toBeTruthy();
          expect(stop.target.type, `${stop.id} target type`).toMatch(/^(chapter|concept|formal-object|citation|reading-path)$/u);
          expect(stop.target.id.trim(), `${stop.id} target id`).toBeTruthy();
          expect(stop.target.href, `${stop.id} target href`).toMatch(/^\//u);
          expect(stop.why, `${stop.id} why`).toEqual(expect.any(String));
          expect(stop.why.length, `${stop.id} why length`).toBeGreaterThan(60);
        }
      }
    }
  });

  it('resolves every stop target to a known chapter, concept, formal object, citation, or path id', () => {
    for (const path of readingPaths) {
      for (const branch of path.branches) {
        for (const stop of branch.stops) {
          expect(
            hasKnownTarget(stop.target.type, stop.target.id),
            `${path.slug}/${branch.id}/${stop.id} -> ${stop.target.type}:${stop.target.id}`,
          ).toBe(true);
        }
      }
    }
  });
});

describe('reading path page and component source contracts', () => {
  it('generates static route pages from the curated readingPaths registry', () => {
    expect(sourceFiles.readingPathPage).toContain('export function getStaticPaths()');
    expect(sourceFiles.readingPathPage).toMatch(/readingPaths\.map/u);
  });

  it('marks reading path content as local-search body content', () => {
    expect(sourceFiles.readingPathPage).toContain('data-pagefind-body');
  });

  it('keeps required route-stop guidance and link labels visible in source', () => {
    expect(sourceFiles.readingPathMap).toContain('Why this stop matters');
    expect(sourceFiles.readingPathMap).toContain('Open stop');
  });

  it('marks decorative connector SVG as hidden and unfocusable', () => {
    expect(sourceFiles.readingPathMap).toContain('aria-hidden="true"');
    expect(sourceFiles.readingPathMap).toContain('focusable="false"');
  });
});

describe('Phase 4 final source and UI contract coverage', () => {
  it('maps locked decisions D-01 through D-16 to concrete implementation hooks', () => {
    const decisionHooks: Record<string, string[]> = {
      'D-01': [sourceFiles.readingPathMap, 'reading-path-map'],
      'D-02': [sourceFiles.readingPathMap, 'path.branches.map'],
      'D-03': [sourceFiles.readingPathMap, 'Why this stop matters', sourceFiles.readingPathMap, 'Open stop'],
      'D-04': [sourceFiles.readingPathPage, 'readingPaths.map'],
      'D-05': [sourceFiles.indexScript, 'pageRecords', sourceFiles.indexScript, 'formalObjectRecords', sourceFiles.indexScript, 'conceptRecords', sourceFiles.indexScript, 'citationRecords', sourceFiles.indexScript, 'readingPathRecords'],
      'D-06': [sourceFiles.searchPanel, 'Pages', sourceFiles.searchPanel, 'Formal Objects', sourceFiles.searchPanel, 'Concepts', sourceFiles.searchPanel, 'Citations', sourceFiles.searchPanel, 'Reading Paths'],
      'D-07': [sourceFiles.searchPanel, 'record.objectKind', sourceFiles.searchPanel, 'record.stableId', sourceFiles.searchPanel, 'record.ownerTitle', sourceFiles.searchPanel, 'record.snippet', sourceFiles.searchPanel, 'Open anchored result'],
      'D-08': [sourceFiles.validationScript, 'expectedHrefIncludes', sourceFiles.validationScript, 'expectedStableId'],
      'D-09': [sourceFiles.relatedLinks, 'categoryLabels'],
      'D-10': [sourceFiles.validationScript, 'validateTypeDefinitions'],
      'D-11': [sourceFiles.corpusPage, '<RelatedLinks source={{ family: \'chapter\'', sourceFiles.formalObjectList, '<RelatedLinks source={{ family: \'formal-object\''],
      'D-12': [sourceFiles.validationScript, 'validateRecordSemantics', sourceFiles.validationScript, 'validateTargetExists'],
      'D-13': [sourceFiles.graphOverviewPage, 'graph.overview.nodes', sourceFiles.graphNeighborhoodPage, 'buildGraphIndex().neighborhoods'],
      'D-14': [sourceFiles.graphOverviewPage, 'buildGraphIndex', sourceFiles.graphNeighborhood, '<a class="graph-node'],
      'D-15': [sourceFiles.graphNeighborhood, 'pathMemberships', sourceFiles.graphNeighborhood, 'nextHops'],
      'D-16': [sourceFiles.validationScript, 'validateGraphNode', sourceFiles.validationScript, 'validateGraphEdge'],
    };

    for (const [decision, hooks] of Object.entries(decisionHooks)) {
      for (let index = 0; index < hooks.length; index += 2) {
        const source = hooks[index];
        const hook = hooks[index + 1];
        expect(source, `${decision} source`).toContain(hook);
      }
    }
  });

  it('keeps UI-SPEC required copy visible across discovery surfaces', () => {
    expect(sourceFiles.searchPanel).toContain('Search pages, formal objects, concepts, citations, and paths');
    expect(sourceFiles.searchPanel).toContain('Search corpus');
    expect(sourceFiles.searchPanel).toContain('Searching local index...');
    expect(sourceFiles.searchPanel).toContain('No local results found');
    expect(sourceFiles.searchPanel).toContain('Try a pillar name, formal object ID, concept alias, citation key, or reading path theme.');
    expect(sourceFiles.searchPanel).toContain('Pages');
    expect(sourceFiles.searchPanel).toContain('Formal Objects');
    expect(sourceFiles.searchPanel).toContain('Concepts');
    expect(sourceFiles.searchPanel).toContain('Citations');
    expect(sourceFiles.searchPanel).toContain('Reading Paths');
    expect(sourceFiles.readingPathPage).toContain('Reading path');
    expect(sourceFiles.readingPathMap).toContain('Why this stop matters');
    expect(sourceFiles.readingPathMap).toContain('Open stop');
    expect(sourceFiles.relatedLinks).toContain('Related links');
    expect(sourceFiles.relatedLinks).toContain('No typed relations have been registered for this item yet.');
    expect(sourceFiles.graphOverviewPage).toContain('Open graph overview');
    expect(sourceFiles.corpusPage).toContain('Open local context');
    expect(sourceFiles.corpusPage).toContain('Nearby nodes show validated next readings and typed relationships generated from static metadata.');
  });

  it('source-asserts focus styles, 44px targets, and max-width 720px one-column collapse for discovery classes', () => {
    expect(sourceFiles.styles).toContain(':where(a, button, [tabindex]):focus-visible');
    expect(sourceFiles.styles).toContain('outline: 2px solid var(--atlas-color-accent)');
    for (const className of ['.search-panel__input', '.search-panel__button', '.search-result-item__anchor', '.reading-path-stop__link', '.related-links__row-meta a', '.graph-node', '.graph-neighborhood__cta']) {
      expect(sourceFiles.styles, className).toContain(className);
    }
    for (const minHeightRule of [
      '.search-panel__input,\n.search-panel__button,\n.search-result-item__anchor,\n.search-result-item__title',
      '.reading-path-stop__link {',
      '.related-links__row-meta a {',
      '.graph-neighborhood__cta,\n.graph-node',
    ]) {
      const index = sourceFiles.styles.indexOf(minHeightRule);
      expect(index, minHeightRule).toBeGreaterThan(-1);
      expect(sourceFiles.styles.slice(index, index + 2200), minHeightRule).toContain('min-height: 44px');
    }
    const mobileBlock = sourceFiles.styles.slice(sourceFiles.styles.indexOf('@media (max-width: 720px)'));
    expect(mobileBlock).toContain('.related-links__row');
    expect(mobileBlock).toContain('.search-panel__controls');
    expect(mobileBlock).toContain('.reading-path-map__branch-list');
    expect(mobileBlock).toContain('.graph-neighborhood__canvas');
    expect(mobileBlock).toContain('grid-template-columns: 1fr');
  });

  it('keeps corpus pages source-grounded while adding related links and graph local context affordance', () => {
    expect(sourceFiles.corpusPage).toContain('<RelatedLinks source={{ family: \'chapter\', id: entry.id }}');
    expect(sourceFiles.corpusPage).toContain('buildGraphIndex().neighborhoods.find');
    expect(sourceFiles.corpusPage).toContain('Open local context');
    expect(sourceFiles.corpusPage).toContain('<SourceLinkPanel entry={entry} />');
    expect(sourceFiles.corpusPage).toContain('<BookFooterNav currentId={entry.id} />');
    expect(sourceFiles.corpusPage.indexOf('<RelatedLinks source={{ family: \'chapter\', id: entry.id }}')).toBeLessThan(sourceFiles.corpusPage.indexOf('<SourceLinkPanel entry={entry} />'));
  });

  it('proves D-11 formal-object related links preserve formal source tiers, stable IDs, and anchors', () => {
    expect(sourceFiles.relatedLinks).toContain('relation.type.label');
    expect(sourceFiles.relatedLinks).toContain('relation.target.title');
    expect(sourceFiles.relatedLinks).toContain('relation.target.familyLabel');
    expect(sourceFiles.relatedLinks).toContain('relation.record.rationale');
    expect(sourceFiles.relatedLinks).toContain('relation.target.href');
    expect(sourceFiles.formalObjectList).toContain('<RelatedLinks source={{ family: \'formal-object\', id: object.id }}');
    expect(sourceFiles.formalObjectList).toContain('Source tier');
    expect(sourceFiles.formalObjectList).toContain('Stable ID');
    expect(sourceFiles.formalObjectList).toContain('Anchor link');
  });

  it('keeps the relation taxonomy broad and documented through validated records', () => {
    expect(new Set(relationTypes.map((type) => type.category))).toEqual(new Set(['conceptual', 'source-provenance', 'learning-path']));
    for (const relationType of relationTypes) {
      expect(relationType.description.length).toBeGreaterThan(20);
      expect(relationType.allowedSourceFamilies.length).toBeGreaterThan(0);
      expect(relationType.allowedTargetFamilies.length).toBeGreaterThan(0);
    }
  });
});
