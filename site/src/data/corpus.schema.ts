import { z } from 'zod';

export const sourceStatusSchema = z.enum(['canonical', 'missing-source', 'archive-blocked', 'provenance-only']);

export const sourceStatusLabels = {
  canonical: 'Canonical',
  'missing-source': 'Missing source',
  'archive-blocked': 'Archive blocked',
  'provenance-only': 'Provenance-only',
} as const;

export const corpusKindSchema = z.enum(['umbrella', 'pillar']);

export const expectedCorpusIds = [
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
] as const;

const nonEmptyStringSchema = z.string().trim().min(1);

export const corpusEntrySchema = z.object({
  id: z.enum(expectedCorpusIds),
  kind: corpusKindSchema,
  title: nonEmptyStringSchema,
  slug: nonEmptyStringSchema,
  summary: nonEmptyStringSchema,
  canonicalTex: nonEmptyStringSchema,
  canonicalPdf: nonEmptyStringSchema,
  bibliography: nonEmptyStringSchema.optional(),
  sourceStatus: sourceStatusSchema,
});

export const corpusEntriesSchema = z.array(corpusEntrySchema);

export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type CorpusEntry = z.infer<typeof corpusEntrySchema>;

export function parseCorpusEntries(entries: unknown): CorpusEntry[] {
  return corpusEntriesSchema.parse(entries);
}
