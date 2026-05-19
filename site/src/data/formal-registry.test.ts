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

export const requiredChapterSections = [
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

const forbiddenCurationMarkers = /\b(minimal|placeholder|incomplete|todo|fixme|coming soon|not available)\b/iu;
const theoremLikeKinds = ['theorem', 'proposition', 'lemma', 'corollary'] as const;

const firstBatchOwners = [
  'abstraction',
  'information',
  'reliability',
  'coordination',
  'temporal',
  'economics',
  'model-routing',
] as const;

const firstBatchStableIds = [
  'abstraction.specification-refinement-gap',
  'information.context-degradation',
  'reliability.compound-error-bound',
  'coordination.quality-adjusted-speedup',
  'temporal.verified-iterations-per-hour',
  'economics.cost-value-information-harness',
  'model-routing.stage-specific-routing',
] as const;

const remainingPillarOwners = [
  'human-interaction',
  'quality',
  'security',
  'governance',
  'accretion',
] as const;

const remainingStableIds = [
  'human-interaction.attention-allocation',
  'quality.ai-code-slop',
  'security.prompt-injection-boundary',
  'governance.governance-ratchet',
  'accretion.plausible-local-change',
] as const;

function ownerObjects(ownerId: string) {
  return formalRegistry.filter((entry) => entry.ownerId === ownerId);
}

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
    expect(parseFormalRegistry(formalRegistry)).toEqual(formalRegistry);
    expect(parseChapterRegistry(chapterRegistry)).toEqual(chapterRegistry);
    expect(parseConceptRegistry(conceptRegistry)).toEqual(conceptRegistry);

    expect(formalRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'umbrella.harness-architecture',
          ownerId: 'umbrella',
        }),
      ]),
    );
  });

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
      expect(chapter?.summary).not.toMatch(forbiddenCurationMarkers);
      expect(chapter?.sourceTrail.some((source) => source.tier === 'canonical'), `${ownerId} canonical source trail`).toBe(true); // FORM-09 / D-09.
      expect(chapter?.sourceTrail.every((source) => ['canonical', 'supporting-research', 'synthesis-review', 'archived-provenance'].includes(source.tier)), `${ownerId} labeled tiers`).toBe(true); // D-12.
      expect(chapter?.sourceTrail.every((source) => /\.(tex|pdf|bib|md)$/u.test(source.path)), `${ownerId} source path type`).toBe(true);
      expect(chapter?.formalObjectIds.length, `${ownerId} chapter objects`).toBeGreaterThan(0); // FORM-04 / FORM-05.
      expect(chapter?.conceptIds.length, `${ownerId} chapter concepts`).toBeGreaterThan(0); // FORM-08.
      expect(chapter?.citationIds.length, `${ownerId} chapter citations`).toBeGreaterThan(0); // FORM-07.
      expect(objects.length, `${ownerId} formal objects`).toBeGreaterThan(0);
      expect(objects.some((entry) => entry.kind === 'definition'), `${ownerId} definitions`).toBe(true);
      expect(objects.some((entry) => theoremLikeKinds.includes(entry.kind as (typeof theoremLikeKinds)[number])), `${ownerId} theorem-like anchors`).toBe(ownerId === 'umbrella' ? false : true);
      expect(objects.every((entry) => entry.sourceTrail.length > 0), `${ownerId} object source trail`).toBe(true); // D-10.
      expect(objects.every((entry) => entry.sourceTrail.every((source) => source.tier === 'canonical' || source.tier === 'supporting-research' || source.tier === 'synthesis-review' || source.tier === 'archived-provenance')), `${ownerId} object source tiers`).toBe(true); // D-11 / D-12.
      expect(objects.some((entry) => entry.citationIds.length > 0), `${ownerId} object citations`).toBe(true); // FORM-07.
      expect(ownerConcepts.length, `${ownerId} concepts`).toBeGreaterThan(0); // FORM-08 / D-13.
      expect(ownerConcepts.some((entry) => entry.relatedConceptIds.length > 0), `${ownerId} concept relations`).toBe(true); // D-14 / D-15 / D-16.
      expect(matrixEntries?.length, `${ownerId} derivation matrix`).toBeGreaterThan(0); // FORM-06.

      for (const sectionKey of requiredChapterSections) {
        expect(chapter?.sections[sectionKey]?.trim(), `${ownerId}.${sectionKey}`).toBeTruthy(); // FORM-03 section contract.
        expect(chapter?.sections[sectionKey], `${ownerId}.${sectionKey} no placeholder`).not.toMatch(forbiddenCurationMarkers);
        expect(chapter?.sourceTrail.length, `${ownerId}.${sectionKey} source trail ids`).toBeGreaterThan(0); // D-10 source trail per major section.
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

describe('first-batch pillar chapter coverage', () => {
  it('curates all D-01 section keys for the first seven conceptual-arc owners', () => {
    for (const ownerId of firstBatchOwners) {
      const chapter = chapterRegistry.find((entry) => entry.ownerId === ownerId);

      expect(chapter?.curationStatus, `${ownerId} curation`).toBe('curated');
      expect(chapter?.sourceTrail).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: `${ownerId}-tex`, tier: 'canonical' }),
          expect.objectContaining({ id: `${ownerId}-pdf`, tier: 'canonical' }),
          expect.objectContaining({ id: `${ownerId}-bib`, tier: 'canonical' }),
        ]),
      );

      for (const sectionKey of requiredChapterSections) {
        expect(chapter?.sections[sectionKey], `${ownerId}.${sectionKey}`).toEqual(expect.any(String));
        expect(chapter?.sections[sectionKey].length, `${ownerId}.${sectionKey}`).toBeGreaterThan(80);
      }
    }
  });

  it('contains the exact stable formal-object IDs selected for the first-batch pillars', () => {
    const ids = formalRegistry.map((entry) => entry.id);

    expect(ids).toEqual(expect.arrayContaining([...firstBatchStableIds]));
    expect(ids.some((id) => /^theorem-|^definition-|paper-\d+/u.test(id))).toBe(false);
  });

  it('gives every first-batch owner definitions, theorem-like claims, citations, source trails, and concept relations', () => {
    for (const ownerId of firstBatchOwners) {
      const objects = ownerObjects(ownerId);
      const chapter = chapterRegistry.find((entry) => entry.ownerId === ownerId);
      const concepts = conceptRegistry.filter((entry) => entry.ownerIds.includes(ownerId));

      expect(objects.some((entry) => entry.kind === 'definition'), `${ownerId} definition`).toBe(true);
      expect(objects.some((entry) => theoremLikeKinds.includes(entry.kind as (typeof theoremLikeKinds)[number])), `${ownerId} theorem-like claim`).toBe(true);
      expect(objects.some((entry) => entry.kind === 'citation'), `${ownerId} citation object`).toBe(true);
      expect(objects.every((entry) => entry.sourceTrail.length > 0), `${ownerId} source trails`).toBe(true);
      expect(chapter?.formalObjectIds.every((id) => objects.some((entry) => entry.id === id)), `${ownerId} chapter object links`).toBe(true);
      expect(concepts.some((entry) => entry.formalObjectIds.some((id) => objects.some((object) => object.id === id))), `${ownerId} concept links`).toBe(true);
    }
  });

  it('publishes first-batch derivation coverage with source-supported notebook-style derivations or source-grounded not-supported rationale', () => {
    for (const ownerId of firstBatchOwners) {
      const entries = derivationCoverageByOwner[ownerId];
      const chapter = chapterRegistry.find((entry) => entry.ownerId === ownerId);

      expect(entries.length, `${ownerId} matrix entries`).toBeGreaterThan(0);

      for (const entry of entries) {
        expect(entry.sourcePath, `${ownerId} sourcePath`).toMatch(/^pillars\//u);
        if (entry.status === 'supported') {
          expect(entry.formalObjectIds.length, `${ownerId} supported ids`).toBeGreaterThan(0);
          for (const objectId of entry.formalObjectIds) {
            const object = formalRegistry.find((item) => item.id === objectId);
            expect(object, `${ownerId}.${objectId}`).toBeDefined();
            expect(['derivation', 'equation']).toContain(object?.kind);
            expect(chapter?.sections.derivationContext).toContain(objectId);
          }
          expect(entry.rationale).toBeUndefined();
        } else {
          expect(entry.formalObjectIds).toEqual([]);
          expect(entry.rationale?.length, `${ownerId} not-supported rationale`).toBeGreaterThan(40);
          expect(entry.rationale).toContain(entry.sourcePath);
          expect(chapter?.sections.derivationContext).toContain(entry.rationale as string);
        }
      }
    }
  });

  it('normalizes aliases to canonical concepts instead of duplicating canonical concept IDs', () => {
    const conceptIds = conceptRegistry.map((entry) => entry.id);

    expect(new Set(conceptIds).size).toBe(conceptIds.length);
    expect(conceptRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'compound-error',
          aliases: expect.arrayContaining(['multi-step reliability decay', 'pipeline reliability decay']),
          formalObjectIds: expect.arrayContaining(['reliability.compound-error-bound']),
        }),
        expect.objectContaining({
          id: 'stage-specific-routing',
          aliases: expect.arrayContaining(['stage-aware routing', 'routing by task stage']),
          formalObjectIds: expect.arrayContaining(['model-routing.stage-specific-routing']),
        }),
      ]),
    );
  });
});

describe('complete corpus coverage for remaining pillars', () => {
  it('curates all D-01 section keys for the remaining five pillar owners', () => {
    for (const ownerId of remainingPillarOwners) {
      const chapter = chapterRegistry.find((entry) => entry.ownerId === ownerId);

      expect(chapter?.curationStatus, `${ownerId} curation`).toBe('curated');
      expect(chapter?.sourceTrail).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: `${ownerId}-tex`, tier: 'canonical' }),
          expect.objectContaining({ id: `${ownerId}-pdf`, tier: 'canonical' }),
          expect.objectContaining({ id: `${ownerId}-bib`, tier: 'canonical' }),
        ]),
      );

      for (const sectionKey of requiredChapterSections) {
        expect(chapter?.sections[sectionKey], `${ownerId}.${sectionKey}`).toEqual(expect.any(String));
        expect(chapter?.sections[sectionKey].length, `${ownerId}.${sectionKey}`).toBeGreaterThan(80);
      }
    }
  });

  it('contains exact stable formal-object IDs for the remaining five pillar anchors', () => {
    const ids = formalRegistry.map((entry) => entry.id);

    expect(ids).toEqual(expect.arrayContaining([...remainingStableIds]));
  });

  it('FORM-06 and D-03: publishes an all-owner derivation coverage matrix keyed to source-supported derivation coverage, not where-curated semantics', () => {
    expect(Object.keys(derivationCoverageByOwner)).toEqual([...expectedCorpusIds]);

    for (const ownerId of expectedCorpusIds) {
      const entries = derivationCoverageByOwner[ownerId];
      const chapter = chapterRegistry.find((entry) => entry.ownerId === ownerId);

      expect(entries.length, `${ownerId} matrix entries`).toBeGreaterThan(0);

      for (const entry of entries) {
        expect(entry.sourcePath, `${ownerId} sourcePath`).toMatch(/^(science|pillars)\//u);
        if (entry.status === 'supported') {
          expect(entry.formalObjectIds.length, `${ownerId} supported ids`).toBeGreaterThan(0);
          for (const objectId of entry.formalObjectIds) {
            const object = formalRegistry.find((item) => item.id === objectId);
            expect(object, `${ownerId}.${objectId}`).toBeDefined();
            expect(['derivation', 'equation']).toContain(object?.kind);
            expect(chapter?.sections.derivationContext).toContain(objectId);
          }
          expect(entry.rationale).toBeUndefined();
        } else {
          expect(entry.formalObjectIds).toEqual([]);
          expect(entry.rationale?.length, `${ownerId} not-supported rationale`).toBeGreaterThan(40);
          expect(entry.rationale).toContain(entry.sourcePath);
          expect(chapter?.sections.derivationContext).toContain(entry.rationale as string);
        }
      }
    }
  });

  it('FORM-08 and D-08: uses valid reciprocal static concept links for concepts that reference each other', () => {
    for (const concept of conceptRegistry) {
      for (const relatedId of concept.relatedConceptIds) {
        const related = conceptRegistry.find((entry) => entry.id === relatedId);
        expect(related, `${concept.id} -> ${relatedId}`).toBeDefined();
        expect(related?.relatedConceptIds, `${relatedId} reciprocal link to ${concept.id}`).toContain(concept.id);
      }
    }
  });
});
