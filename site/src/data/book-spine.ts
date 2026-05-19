import { corpusEntries } from './corpus';
import type { CorpusEntry } from './corpus.schema';

export const pillarArc = [
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
] as const;

const conceptualArc = ['overview', 'umbrella', ...pillarArc] as const;

type CorpusBackedSpineId = CorpusEntry['id'];
export type BookSpineId = (typeof conceptualArc)[number];

export interface BookSpineItem {
  id: BookSpineId;
  title: string;
  href: string;
}

const entriesById = new Map(corpusEntries.map((entry) => [entry.id, entry]));

function getCorpusEntry(id: CorpusBackedSpineId): CorpusEntry {
  const entry = entriesById.get(id);

  if (!entry) {
    throw new Error(`Missing corpus entry for book spine id: ${id}`);
  }

  return entry;
}

function toSpineItem(id: BookSpineId): BookSpineItem {
  if (id === 'overview') {
    return { id, title: 'Overview', href: '/' };
  }

  const entry = getCorpusEntry(id);
  return { id, title: entry.title, href: `/corpus/${entry.slug}/` };
}

export const bookSpine: BookSpineItem[] = conceptualArc.map(toSpineItem);

export const bookSidebar = [
  {
    label: 'Book spine',
    items: bookSpine.map((item) => ({ label: item.title, link: item.href })),
  },
];

export function getPreviousNext(currentId: string): {
  previous: BookSpineItem | null;
  next: BookSpineItem | null;
} {
  const currentIndex = bookSpine.findIndex((item) => item.id === currentId);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: bookSpine[currentIndex - 1] ?? null,
    next: bookSpine[currentIndex + 1] ?? null,
  };
}
