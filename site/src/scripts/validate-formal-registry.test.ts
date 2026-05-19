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

describe('validateFormalRegistry', () => {
  it('validates the real Phase 3 registry data', () => {
    expect(validateFormalRegistry()).toEqual({ ok: true, errors: [] });
  });

  it('fails duplicate formal ids with the exact diagnostic', () => {
    const fixture = cloneFixture();
    fixture.formalObjects.push({ ...fixture.formalObjects[0] });

    const result = validateFormalRegistry(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatFormalRegistryError)).toEqual(
      expect.arrayContaining([expect.stringContaining('Duplicate formal object id')]),
    );
  });

  it('fails invalid owner ids and invalid curation statuses', () => {
    const fixture = cloneFixture();
    fixture.formalObjects[0] = { ...fixture.formalObjects[0], ownerId: 'not-a-pillar' as FormalObject['ownerId'] };
    fixture.chapters[0] = { ...fixture.chapters[0], curationStatus: 'draft' as ChapterRecord['curationStatus'] };

    const result = validateFormalRegistry(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatFormalRegistryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Invalid owner id'),
        expect.stringContaining('Invalid curation status'),
      ]),
    );
  });

  it('fails missing required source paths and archive paths used as canonical sources', () => {
    const fixture = cloneFixture();
    fixture.formalObjects[0] = {
      ...fixture.formalObjects[0],
      sourceTrail: [{ id: 'missing', tier: 'canonical', path: 'science/paper/does-not-exist.tex', label: 'Missing' }],
    };
    fixture.chapters[0] = {
      ...fixture.chapters[0],
      sourceTrail: [
        { id: 'archived', tier: 'canonical', path: 'science/archive/drafts/science-assembled.tex', label: 'Archived' },
      ],
    };

    const result = validateFormalRegistry(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatFormalRegistryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Required source path does not exist'),
        expect.stringContaining('Archive paths cannot be canonical sources'),
      ]),
    );
  });

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

  it('collects all owned target diagnostics for concepts, citations, chapter object references, and broken concept relations', () => {
    const fixture = cloneFixture();
    fixture.formalObjects[0] = {
      ...fixture.formalObjects[0],
      conceptIds: ['missing-concept'],
      citationIds: ['missing-citation'],
    };
    fixture.chapters[0] = {
      ...fixture.chapters[0],
      formalObjectIds: ['umbrella.nope'],
      conceptIds: ['missing-chapter-concept'],
    };
    fixture.concepts[0] = {
      ...fixture.concepts[0],
      relatedConceptIds: ['missing-related-concept'],
    };

    const result = validateFormalRegistry(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(5);
    expect(result.errors.map(formatFormalRegistryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Concept target does not exist'),
        expect.stringContaining('Citation target does not exist'),
        expect.stringContaining('Chapter formal object target does not exist'),
        expect.stringContaining('Chapter concept target does not exist'),
        expect.stringContaining('Concept relation target does not exist'),
      ]),
    );
  });

  it('fails missing required formal object fields through strict schema diagnostics', () => {
    const fixture = cloneFixture();
    fixture.formalObjects[0] = {
      ...fixture.formalObjects[0],
      title: '',
      statement: '',
      sourceTrail: [],
    };

    const result = validateFormalRegistry(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatFormalRegistryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Fix the formal object shape'),
        expect.stringContaining('Missing required source trail'),
      ]),
    );
  });

  it('fails invalid derivation coverage entries for supported IDs, target kinds, and unsupported rationales', () => {
    const fixture = cloneFixture();
    fixture.derivationCoverage.abstraction = [
      { sourcePath: 'pillars/abstraction/paper/abstraction.tex', status: 'supported', formalObjectIds: [] },
      { sourcePath: 'pillars/abstraction/paper/abstraction.tex', status: 'supported', formalObjectIds: ['abstraction.specification-refinement-gap'] },
      { sourcePath: 'pillars/abstraction/paper/abstraction.tex', status: 'not-supported', formalObjectIds: ['abstraction.gap-decomposition-equation'] },
    ];

    const result = validateFormalRegistry(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatFormalRegistryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Supported derivation has no formal object IDs'),
        expect.stringContaining('Supported derivation target must be a derivation or equation object'),
        expect.stringContaining('Unsupported derivation lacks source-grounded rationale'),
      ]),
    );
  });
});
