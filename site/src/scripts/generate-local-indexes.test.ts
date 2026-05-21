import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { corpusEntries } from '../data/corpus';
import { readingPaths } from '../data/reading-paths';
import { buildCorpusIndex, buildDiscoverySearchIndex, buildGraphIndex, writeCorpusIndex, writeDiscoverySearchIndex, writeGraphIndex } from './generate-local-indexes';

const testSiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

describe('SearchPanel source integration', () => {
  it('uses the required placeholder and grouped result labels', async () => {
    const source = await Bun.file(new URL('../components/discovery/SearchPanel.astro', import.meta.url)).text();

    expect(source).toContain('Search pages, formal objects, concepts, citations, and paths');
    expect(source).toContain('Pages');
    expect(source).toContain('Formal Objects');
    expect(source).toContain('Concepts');
    expect(source).toContain('Citations');
    expect(source).toContain('Reading Paths');
  });

  it('renders formal-object metadata in the required order before the anchor action', async () => {
    const source = await Bun.file(new URL('../components/discovery/SearchPanel.astro', import.meta.url)).text();
    const fieldsStart = source.indexOf('const fields = [');
    const objectKind = source.indexOf('record.objectKind', fieldsStart);
    const stableId = source.indexOf('record.stableId', fieldsStart);
    const ownerTitle = source.indexOf('record.ownerTitle', fieldsStart);
    const snippet = source.indexOf('record.snippet', fieldsStart);
    const action = source.indexOf('Open anchored result', fieldsStart);

    expect(objectKind).toBeGreaterThan(-1);
    expect(stableId).toBeGreaterThan(objectKind);
    expect(ownerTitle).toBeGreaterThan(stableId);
    expect(snippet).toBeGreaterThan(ownerTitle);
    expect(action).toBeGreaterThan(snippet);
  });

  it('fetches generated search metadata and joins Pagefind results by href and stable ID', async () => {
    const source = await Bun.file(new URL('../components/discovery/SearchPanel.astro', import.meta.url)).text();

    expect(source).toContain("fetch('/search-index.json')");
    expect(source).toContain('recordsByHref');
    expect(source).toContain('recordsByStableId');
    expect(source).toContain('findGeneratedRecord');
    expect(source).toContain('renderFallbackResult');
  });

  it('does not render unsafe raw Pagefind content as HTML', async () => {
    const source = await Bun.file(new URL('../components/discovery/SearchPanel.astro', import.meta.url)).text();

    expect(source).not.toContain('set:html');
    expect(source).not.toContain('innerHTML');
    expect(source).not.toContain('.content');
  });

  it('adds a static search page shell with Pagefind fallback body content', async () => {
    const source = await Bun.file(new URL('../pages/search.astro', import.meta.url)).text();

    expect(source).toContain("import SearchPanel from '../components/discovery/SearchPanel.astro'");
    expect(source).toContain('<SearchPanel />');
    expect(source).toContain('data-pagefind-body');
    expect(source).toContain('No local results found');
  });
});

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

  it('preserves umbrella first and includes security and accretion entries', () => {
    const index = buildCorpusIndex(corpusEntries);

    expect(index.entries[0]?.id).toBe('umbrella');
    expect(index.entries.map((entry) => entry.id)).toContain('security');
    expect(index.entries.map((entry) => entry.id)).toContain('accretion');
  });

  it('accepts normalized absolute output paths inside the site directory', () => {
    const outputDir = `${testSiteRoot}/dist/../dist/normalized-index`;

    const outputPath = writeCorpusIndex({ outputDir });
    const payload = JSON.parse(readFileSync(outputPath, 'utf-8'));

    expect(payload.entryCount).toBe(13);
  });

  it('refuses output paths outside the provided site output directory', () => {
    expect(() => writeCorpusIndex({ outputDir: '../dist' })).toThrow(
      'Output directory must stay inside site/',
    );
  });

  it('builds discovery search records for all required result classes', () => {
    const index = buildDiscoverySearchIndex();

    expect(new Set(index.resultClasses)).toEqual(
      new Set(['Pages', 'Formal Objects', 'Concepts', 'Citations', 'Reading Paths']),
    );
    expect(new Set(index.records.map((record) => record.resultType))).toEqual(
      new Set(['Pages', 'Formal Objects', 'Concepts', 'Citations', 'Reading Paths']),
    );
  });

  it('emits formal-object records with stable anchor hrefs and owner context', () => {
    const index = buildDiscoverySearchIndex();
    const formalObject = index.records.find((record) => record.stableId === 'reliability.compound-error-bound');

    expect(formalObject).toMatchObject({
      resultType: 'Formal Objects',
      objectKind: 'theorem',
      stableId: 'reliability.compound-error-bound',
      ownerId: 'reliability',
      ownerTitle: 'Reliability',
    });
    expect(formalObject?.href).toContain('#reliability.compound-error-bound');
    expect(formalObject?.snippet).toContain('end-to-end reliability');
  });

  it('covers all 13 corpus owners and all five reading paths', () => {
    const index = buildDiscoverySearchIndex();
    const ownerIds = new Set(index.records.flatMap((record) => record.ownerId ? [record.ownerId] : []));
    const pathIds = new Set(index.records.filter((record) => record.resultType === 'Reading Paths').map((record) => record.stableId));

    expect(ownerIds).toEqual(new Set(corpusEntries.map((entry) => entry.id)));
    expect(pathIds).toEqual(new Set(readingPaths.map((path) => path.slug)));
  });

  it('writes search-index.json inside site/dist and refuses paths outside site', () => {
    mkdirSync(join(testSiteRoot, 'dist'), { recursive: true });
    const outputDir = mkdtempSync(join(testSiteRoot, 'dist', 'search-index-'));

    const outputPath = writeDiscoverySearchIndex({ outputDir });
    const payload = JSON.parse(readFileSync(outputPath, 'utf-8'));

    expect(outputPath.endsWith('search-index.json')).toBe(true);
    expect(payload.records.length).toBeGreaterThan(corpusEntries.length);
    expect(() => writeDiscoverySearchIndex({ outputDir: '../dist' })).toThrow(
      'Output directory must stay inside site/',
    );
  });

  it('builds a high-level graph overview without dumping every object into a global hairball', () => {
    const graph = buildGraphIndex();
    const overviewFamilies = new Set(graph.overview.nodes.map((node) => node.family));

    expect(overviewFamilies).toEqual(new Set(['chapter', 'reading-path', 'relation-category']));
    expect(graph.overview.nodes.length).toBeLessThan(buildDiscoverySearchIndex().records.length);
    expect(graph.overview.nodes.some((node) => node.id === 'chapter:umbrella')).toBe(true);
    expect(graph.overview.nodes.some((node) => node.id === 'reading-path:production-hardening')).toBe(true);
  });

  it('builds local neighborhoods with current nodes, typed relations, path memberships, and next hops', () => {
    const graph = buildGraphIndex();
    const neighborhood = graph.neighborhoods.find((item) => item.id === 'formal-object:reliability.compound-error-bound');

    expect(neighborhood?.current).toMatchObject({
      id: 'formal-object:reliability.compound-error-bound',
      label: 'Compound error sensitivity',
      href: '/corpus/reliability/#reliability.compound-error-bound',
    });
    expect(neighborhood?.edges.some((edge) => edge.relationTypeId === 'next-readings' && edge.targetId === 'reading-path:production-hardening')).toBe(true);
    expect(neighborhood?.pathMemberships.some((path) => path.pathId === 'building-a-harness')).toBe(true);
    expect(neighborhood?.nextHops.some((node) => node.id === 'reading-path:production-hardening')).toBe(true);
  });

  it('gives every graph node a renderable label and href', () => {
    const graph = buildGraphIndex();
    const nodes = [
      ...graph.overview.nodes,
      ...graph.neighborhoods.flatMap((neighborhood) => [neighborhood.current, ...neighborhood.nodes]),
    ];

    for (const node of nodes) {
      expect(node.id).toContain(':');
      expect(node.label.trim().length).toBeGreaterThan(0);
      expect(node.href).toMatch(/^\//u);
    }
  });

  it('writes graph-index.json inside site/dist only', () => {
    mkdirSync(join(testSiteRoot, 'dist'), { recursive: true });
    const outputDir = mkdtempSync(join(testSiteRoot, 'dist', 'graph-index-'));

    const outputPath = writeGraphIndex({ outputDir });
    const payload = JSON.parse(readFileSync(outputPath, 'utf-8'));

    expect(outputPath.endsWith('graph-index.json')).toBe(true);
    expect(payload.neighborhoods.length).toBeGreaterThan(0);
    expect(() => writeGraphIndex({ outputDir: '../dist' })).toThrow('Output directory must stay inside site/');
  });
});
