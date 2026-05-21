import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { corpusEntries } from '../data/corpus';
import { readingPaths } from '../data/reading-paths';
import { buildCorpusIndex, buildDiscoverySearchIndex, writeCorpusIndex, writeDiscoverySearchIndex } from './generate-local-indexes';

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
});
