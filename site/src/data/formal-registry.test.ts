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
import { formalRegistry } from './formal-registry';

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

describe('formal registry data contract', () => {
  it('parses the real Phase 3 registries and includes the umbrella vertical slice', () => {
    expect(parseFormalRegistry(formalRegistry)).toBe(formalRegistry);
    expect(parseChapterRegistry(chapterRegistry)).toBe(chapterRegistry);
    expect(parseConceptRegistry(conceptRegistry)).toBe(conceptRegistry);

    expect(formalRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'umbrella.harness-architecture',
          ownerId: 'umbrella',
        }),
      ]),
    );
  });

  it('provides a build-safe minimal chapter, formal object, concept, source trail, and curation status for every owner', () => {
    for (const ownerId of expectedCorpusIds) {
      const chapter = chapterRegistry.find((entry) => entry.ownerId === ownerId);
      const ownerObjects = formalRegistry.filter((entry) => entry.ownerId === ownerId);
      const ownerConcepts = conceptRegistry.filter((entry) => entry.ownerIds.includes(ownerId));

      expect(chapter, `${ownerId} chapter`).toBeDefined();
      expect(chapter?.sourceTrail.some((source) => source.tier === 'canonical')).toBe(true);
      expect(['minimal', 'curated']).toContain(chapter?.curationStatus);
      expect(chapter?.formalObjectIds.length).toBeGreaterThan(0);
      expect(chapter?.conceptIds.length).toBeGreaterThan(0);
      expect(ownerObjects.length, `${ownerId} formal objects`).toBeGreaterThan(0);
      expect(ownerConcepts.length, `${ownerId} concepts`).toBeGreaterThan(0);

      for (const sectionKey of [
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
      ] as const) {
        expect(chapter?.sections[sectionKey]?.trim(), `${ownerId}.${sectionKey}`).toBeTruthy();
      }
    }
  });

  it('uses the canonical umbrella source trail and formal object seed required by D-05 through D-13', () => {
    const umbrellaChapter = chapterRegistry.find((entry) => entry.ownerId === 'umbrella');
    const umbrellaObject = formalRegistry.find((entry) => entry.id === 'umbrella.harness-architecture');

    expect(umbrellaChapter?.sourceTrail).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'science/paper/science.tex', tier: 'canonical' }),
        expect.objectContaining({ path: 'science/paper/science.pdf', tier: 'canonical' }),
        expect.objectContaining({ path: 'science/paper/science.bib', tier: 'canonical' }),
      ]),
    );
    expect(umbrellaObject?.sourceTrail).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'science/paper/science.tex', tier: 'canonical' }),
      ]),
    );
  });
});
