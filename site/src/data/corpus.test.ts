import { describe, expect, it } from 'vitest';
import { corpusEntries } from './corpus';
import {
  corpusEntrySchema,
  expectedCorpusIds,
  parseCorpusEntries,
  sourceStatusSchema,
} from './corpus.schema';

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

  it('accepts only finite source statuses from the source contract', () => {
    expect(sourceStatusSchema.safeParse('canonical').success).toBe(true);
    expect(sourceStatusSchema.safeParse('missing-source').success).toBe(true);
    expect(sourceStatusSchema.safeParse('archive-blocked').success).toBe(true);
    expect(sourceStatusSchema.safeParse('provenance-only').success).toBe(true);
    expect(sourceStatusSchema.safeParse('archived').success).toBe(false);
  });

  it('requires canonical source paths for every corpus entry', () => {
    const result = corpusEntrySchema.safeParse({
      id: 'umbrella',
      kind: 'umbrella',
      title: 'A Formal Framework for AI Coding Agent Harness Architecture',
      slug: 'umbrella',
      summary: 'Umbrella framework tying together all architectural dimensions',
      canonicalPdf: 'science/paper/science.pdf',
      bibliography: 'science/paper/science.bib',
      sourceStatus: 'canonical',
    });

    expect(result.success).toBe(false);
  });
});

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

  it('starts every inventory entry as canonical', () => {
    expect(corpusEntries.every((entry) => entry.sourceStatus === 'canonical')).toBe(true);
  });
});
