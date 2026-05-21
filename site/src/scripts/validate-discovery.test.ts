import { describe, expect, it } from 'vitest';
import { relationRecords, relationTypes } from '../data/relations';
import type { DiscoverySearchRecord, GraphIndex, RelationRecord, RelationTypeRecord } from '../data/discovery.schema';
import { buildDiscoverySearchIndex, buildGraphIndex } from './generate-local-indexes';
import { formatDiscoveryError, validateDiscovery } from './validate-discovery';

function cloneFixture(): {
  relationTypes: RelationTypeRecord[];
  relationRecords: RelationRecord[];
  searchRecords: DiscoverySearchRecord[];
  graphIndex: GraphIndex;
} {
  return {
    relationTypes: structuredClone(relationTypes),
    relationRecords: structuredClone(relationRecords),
    searchRecords: structuredClone(buildDiscoverySearchIndex().records),
    graphIndex: structuredClone(buildGraphIndex()),
  };
}

describe('Graph source integration', () => {
  it('renders the graph overview CTA and source-backed graph index data', async () => {
    const source = await Bun.file(new URL('../pages/graph/index.astro', import.meta.url)).text();

    expect(source).toContain('Open graph overview');
    expect(source).toContain('buildGraphIndex');
    expect(source).toContain('graph.overview.nodes');
  });

  it('renders local context copy and semantic graph node links', async () => {
    const source = await Bun.file(new URL('../components/discovery/GraphNeighborhood.astro', import.meta.url)).text();

    expect(source).toContain('Open local context');
    expect(source).toContain('Nearby nodes show validated next readings and typed relationships generated from static metadata.');
    expect(source).toContain('<a class="graph-node');
    expect(source).toContain('node.href');
  });

  it('marks decorative graph connector SVGs as hidden and unfocusable', async () => {
    const source = await Bun.file(new URL('../components/discovery/GraphNeighborhood.astro', import.meta.url)).text();

    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain('focusable="false"');
  });

  it('uses getStaticPaths over generated graph neighborhoods', async () => {
    const source = await Bun.file(new URL('../pages/graph/[id].astro', import.meta.url)).text();

    expect(source).toContain('export function getStaticPaths()');
    expect(source).toContain('buildGraphIndex().neighborhoods');
  });
});

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
  it('validates the real Phase 4 relation and representative search metadata', () => {
    expect(validateDiscovery()).toMatchObject({ ok: true, errors: [] });
  });

  it('returns JSON-facing totals for paths, relations, graph, search fixtures, and errors', () => {
    expect(validateDiscovery().totals).toMatchObject({
      paths: 5,
      relationTypes: relationTypes.length,
      relations: relationRecords.length,
      searchFixtures: 5,
      errors: 0,
    });
    expect(validateDiscovery().totals.graphNodes).toBeGreaterThan(0);
    expect(validateDiscovery().totals.graphNeighborhoods).toBeGreaterThan(0);
  });

  it('validates representative search fixtures for every required result class', () => {
    const result = validateDiscovery();

    expect(result.ok).toBe(true);
    expect(result.searchFixtures.map((fixture) => fixture.resultType)).toEqual(
      expect.arrayContaining(['Pages', 'Formal Objects', 'Concepts', 'Citations', 'Reading Paths']),
    );
  });

  it('asserts formal-object search fixtures against stable anchor fragments', () => {
    const formalFixture = validateDiscovery().searchFixtures.find(
      (fixture) => fixture.resultType === 'Formal Objects' && fixture.query === 'compound error sensitivity',
    );

    expect(formalFixture?.expectedHrefIncludes).toBe('#reliability.compound-error-bound');
  });

  it('rejects weak search fixtures that only require any non-empty result', () => {
    const fixture = cloneFixture();

    const result = validateDiscovery({
      searchRecords: fixture.searchRecords,
      searchFixtures: [
        {
          query: 'compound error',
          resultType: 'Formal Objects',
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([expect.stringContaining('Search fixture must assert an expected href or anchor')]),
    );
  });

  it('fails when representative search fixtures miss expected pages or anchors', () => {
    const fixture = cloneFixture();
    fixture.searchRecords = fixture.searchRecords.filter((record) => record.stableId !== 'reliability.compound-error-bound');

    const result = validateDiscovery({ searchRecords: fixture.searchRecords });

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Missing expected search result for query'),
        expect.stringContaining('#reliability.compound-error-bound'),
      ]),
    );
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

  it('fails graph nodes with missing labels and missing hrefs', () => {
    const fixture = cloneFixture();
    fixture.graphIndex.neighborhoods[0].current = {
      ...fixture.graphIndex.neighborhoods[0].current,
      label: '',
      href: '',
    };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Missing graph node label'),
        expect.stringContaining('Missing graph node href'),
      ]),
    );
  });

  it('fails graph edges that point at missing node IDs', () => {
    const fixture = cloneFixture();
    fixture.graphIndex.neighborhoods[0].edges[0] = {
      ...fixture.graphIndex.neighborhoods[0].edges[0],
      targetId: 'concept:not-renderable',
    };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([expect.stringContaining('Graph edge target is not renderable')]),
    );
  });

  it('fails graph edges with invalid relation types', () => {
    const fixture = cloneFixture();
    fixture.graphIndex.neighborhoods[0].edges[0] = {
      ...fixture.graphIndex.neighborhoods[0].edges[0],
      relationTypeId: 'not-registered',
    };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([expect.stringContaining('Graph edge relation type does not exist')]),
    );
  });

  it('fails unrenderable neighborhood IDs and path membership references', () => {
    const fixture = cloneFixture();
    fixture.graphIndex.neighborhoods[0] = {
      ...fixture.graphIndex.neighborhoods[0],
      id: 'concept:not-renderable',
      pathMemberships: [{ pathId: 'missing-path', pathTitle: 'Missing path', stopTitle: 'Missing stop', href: '/reading-paths/missing-path/' }],
    };

    const result = validateDiscovery(fixture);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatDiscoveryError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Neighborhood ID does not match a renderable graph node'),
        expect.stringContaining('Graph path membership does not reference a known reading path'),
      ]),
    );
  });
});
