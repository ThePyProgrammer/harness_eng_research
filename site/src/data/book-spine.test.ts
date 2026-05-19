import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bookSidebar, bookSpine, getPreviousNext, pillarArc } from './book-spine';
import { corpusEntries } from './corpus';

const sourceLinkPanelSource = readFileSync(
  fileURLToPath(new URL('../components/SourceLinkPanel.astro', import.meta.url)),
  'utf8',
);

const conceptualArcIds = [
  'overview',
  'umbrella',
  'abstraction',
  'information',
  'reliability',
  'coordination',
  'temporal',
  'economics',
  'model-routing',
  'human-interaction',
  'quality',
  'security',
  'governance',
  'accretion',
];

describe('book spine conceptual arc', () => {
  it('locks overview, umbrella, and all pillars in conceptual-arc order', () => {
    expect(bookSpine.map((item) => item.id)).toEqual(conceptualArcIds);
  });

  it('defines exactly twelve pillar ids and excludes umbrella and overview', () => {
    expect(pillarArc).toEqual([
      'abstraction',
      'information',
      'reliability',
      'coordination',
      'temporal',
      'economics',
      'model-routing',
      'human-interaction',
      'quality',
      'security',
      'governance',
      'accretion',
    ]);
    expect(pillarArc).toHaveLength(12);
    expect(pillarArc).not.toContain('umbrella');
    expect(pillarArc).not.toContain('overview');
  });

  it('derives every corpus-backed href from corpus entry slugs', () => {
    const entriesById = new Map(corpusEntries.map((entry) => [entry.id, entry]));
    const corpusBackedItems = bookSpine.filter((item) => item.id !== 'overview');

    for (const item of corpusBackedItems) {
      const entry = entriesById.get(item.id);

      expect(entry).toBeDefined();
      expect(item.href).toBe(`/corpus/${entry?.slug}/`);
    }
  });

  it('returns previous and next neighbors from the shared spine', () => {
    expect(getPreviousNext('umbrella')).toEqual({
      previous: expect.objectContaining({ id: 'overview', title: 'Overview' }),
      next: expect.objectContaining({ id: 'abstraction', title: 'Abstraction' }),
    });
    expect(getPreviousNext('overview').previous).toBeNull();
    expect(getPreviousNext('accretion').next).toBeNull();
  });

  it('exposes a Book spine sidebar group from the same href and title data', () => {
    expect(bookSidebar).toEqual([
      {
        label: 'Book spine',
        items: bookSpine.map((item) => ({ label: item.title, link: item.href })),
      },
    ]);
  });

  it('routes source-detail provenance links to browsable repository sources', () => {
    expect(sourceLinkPanelSource).toContain('https://github.com/ThePyProgrammer/harness_eng_research/blob/main/');
  });

  it('does not publish the formal reading fixture as sidebar chapter content', () => {
    const sidebarLinks = bookSidebar.flatMap((group) => group.items.map((item) => item.link));

    expect(sidebarLinks).not.toContain('/formal-reading-fixture/');
  });
});
