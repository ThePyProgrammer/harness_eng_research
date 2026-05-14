import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { corpusEntries } from '../data/corpus';
import { buildCorpusIndex, writeCorpusIndex } from './generate-local-indexes';

describe('generate-local-indexes', () => {
  it('writes corpus-index.json under the provided output directory with entryCount 13', () => {
    mkdirSync(join(process.cwd(), 'dist'), { recursive: true });
    const outputDir = mkdtempSync(join(process.cwd(), 'dist', 'corpus-index-'));

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

  it('refuses output paths outside the provided site output directory', () => {
    expect(() => writeCorpusIndex({ outputDir: '../dist' })).toThrow(
      'Output directory must stay inside site/',
    );
  });
});
