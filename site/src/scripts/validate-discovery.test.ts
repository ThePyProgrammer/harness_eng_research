import { describe, expect, it } from 'vitest';
import { relationRecords, relationTypes } from '../data/relations';
import type { RelationRecord, RelationTypeRecord } from '../data/discovery.schema';
import { formatDiscoveryError, validateDiscovery } from './validate-discovery';

function cloneFixture(): {
  relationTypes: RelationTypeRecord[];
  relationRecords: RelationRecord[];
} {
  return {
    relationTypes: structuredClone(relationTypes),
    relationRecords: structuredClone(relationRecords),
  };
}

describe('RelatedLinks source integration', () => {
  it('renders the required related links heading and row fields', async () => {
    const source = await Bun.file(new URL('../components/discovery/RelatedLinks.astro', import.meta.url)).text();

    expect(source).toContain('Related links');
    expect(source).toContain('relation.type.label');
    expect(source).toContain('relation.target.title');
    expect(source).toContain('relation.target.familyLabel');
    expect(source).toContain('relation.record.rationale');
    expect(source).toContain('relation.target.href');
  });

  it('renders the required empty related-link copy only inside RelatedLinks', async () => {
    const relatedSource = await Bun.file(new URL('../components/discovery/RelatedLinks.astro', import.meta.url)).text();
    const chapterSource = await Bun.file(new URL('../pages/corpus/[slug].astro', import.meta.url)).text();

    expect(relatedSource).toContain('No typed relations have been registered for this item yet.');
    expect(chapterSource).not.toContain('No typed relations have been registered for this item yet.');
  });

  it('keeps chapter provenance and footer navigation while rendering RelatedLinks', async () => {
    const source = await Bun.file(new URL('../pages/corpus/[slug].astro', import.meta.url)).text();

    expect(source).toContain("import RelatedLinks from '../../components/discovery/RelatedLinks.astro'");
    expect(source).toContain('<RelatedLinks source={{ family: \'chapter\', id: entry.id }}');
    expect(source).toContain('<SourceLinkPanel entry={entry} />');
    expect(source).toContain('<BookFooterNav currentId={entry.id} />');
  });

  it('renders formal-object scoped typed related links from FormalObjectList', async () => {
    const source = await Bun.file(new URL('../components/formal/FormalObjectList.astro', import.meta.url)).text();

    expect(source).toContain("import RelatedLinks from '../discovery/RelatedLinks.astro'");
    expect(source).toContain('<RelatedLinks source={{ family: \'formal-object\', id: object.id }}');
  });
});

describe('validateDiscovery', () => {
  it('validates the real Phase 4 relation metadata', () => {
    expect(validateDiscovery()).toEqual({ ok: true, errors: [] });
  });

  it('covers conceptual, source-provenance, and learning-path categories', () => {
    expect(new Set(relationTypes.map((type) => type.category))).toEqual(
      new Set(['conceptual', 'source-provenance', 'learning-path']),
    );
  });

  it('requires relation type records to carry display and family metadata', () => {
    for (const relationType of relationTypes) {
      expect(relationType.id).toBeTruthy();
      expect(relationType.label).toBeTruthy();
      expect(relationType.category).toBeTruthy();
      expect(typeof relationType.directed).toBe('boolean');
      expect(relationType.allowedSourceFamilies.length).toBeGreaterThan(0);
      expect(relationType.allowedTargetFamilies.length).toBeGreaterThan(0);
    }
  });

  it('includes valid formal-object scoped relation data', () => {
    expect(
      relationRecords.some(
        (record) => record.source.family === 'formal-object' || record.target.family === 'formal-object',
      ),
    ).toBe(true);
  });

  it('fails duplicate relation type IDs and malformed type definitions', () => {
    const fixture = cloneFixture();
    fixture.relationTypes.push({ ...fixture.relationTypes[0] });
    fixture.relationTypes[1] = {
      ...fixture.relationTypes[1],
      label: '',
      allowedSourceFamilies: [],
    };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Duplicate relation type id'),
        expect.stringContaining('Invalid relation type definition'),
      ]),
    );
  });

  it('fails relation records that use an invalid type ID', () => {
    const fixture = cloneFixture();
    fixture.relationRecords[0] = { ...fixture.relationRecords[0], typeId: 'not-registered' };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([expect.stringContaining('Relation type does not exist')]),
    );
  });

  it('fails missing display labels on relation records', () => {
    const fixture = cloneFixture();
    fixture.relationRecords[0] = { ...fixture.relationRecords[0], label: '' };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([expect.stringContaining('Missing display label')]),
    );
  });

  it('fails invalid source IDs and invalid target IDs', () => {
    const fixture = cloneFixture();
    fixture.relationRecords[0] = {
      ...fixture.relationRecords[0],
      source: { family: 'chapter', id: 'missing-chapter' },
    };
    fixture.relationRecords[1] = {
      ...fixture.relationRecords[1],
      target: { family: 'formal-object', id: 'umbrella.missing-object' },
    };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Relation source target does not exist'),
        expect.stringContaining('Relation destination target does not exist'),
      ]),
    );
  });

  it('fails invalid directionality and family combinations', () => {
    const fixture = cloneFixture();
    fixture.relationRecords[0] = {
      ...fixture.relationRecords[0],
      direction: 'reverse',
    };
    fixture.relationRecords[1] = {
      ...fixture.relationRecords[1],
      typeId: 'cited-by',
      source: { family: 'concept', id: 'harness-architecture' },
      target: { family: 'reading-path', id: 'building-a-harness' },
    };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Invalid direction for relation type'),
        expect.stringContaining('Relation family is not allowed'),
      ]),
    );
  });
});
