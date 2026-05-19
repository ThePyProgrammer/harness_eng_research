import { z } from 'zod';
import { expectedCorpusIds } from './corpus.schema';

export const ownerIdSchema = z.enum(expectedCorpusIds);
export const formalObjectKindSchema = z.enum([
  'definition',
  'assumption',
  'theorem',
  'proposition',
  'lemma',
  'corollary',
  'equation',
  'derivation',
  'citation',
]);
export const sourceTierSchema = z.enum([
  'canonical',
  'supporting-research',
  'synthesis-review',
  'archived-provenance',
]);
export const curationStatusSchema = z.enum(['minimal', 'curated']);

const semanticIdPattern = /^(umbrella|abstraction|information|reliability|coordination|temporal|quality|governance|economics|human-interaction|model-routing|security|accretion)\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nonEmptyStringSchema = z.string().trim().min(1);

export const formalObjectIdSchema = z.string().regex(semanticIdPattern);
export const conceptIdSchema = z.string().regex(slugPattern);

export const sourceTrailItemSchema = z.object({
  id: nonEmptyStringSchema,
  tier: sourceTierSchema,
  path: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  locator: nonEmptyStringSchema.optional(),
});

export const citationRecordSchema = z.object({
  id: conceptIdSchema,
  label: nonEmptyStringSchema,
  sourceTrail: z.array(sourceTrailItemSchema).min(1),
});

export const formalObjectSchema = z.object({
  id: formalObjectIdSchema,
  ownerId: ownerIdSchema,
  kind: formalObjectKindSchema,
  title: nonEmptyStringSchema,
  statement: nonEmptyStringSchema,
  notation: z.array(nonEmptyStringSchema).default([]),
  sourceTrail: z.array(sourceTrailItemSchema).min(1),
  conceptIds: z.array(conceptIdSchema).default([]),
  citationIds: z.array(conceptIdSchema).default([]),
  relatedObjectIds: z.array(formalObjectIdSchema).default([]),
});

export const chapterSectionSchema = z.object({
  problem: nonEmptyStringSchema,
  coreModel: nonEmptyStringSchema,
  keyNotation: nonEmptyStringSchema,
  definitions: nonEmptyStringSchema,
  formalClaims: nonEmptyStringSchema,
  derivationContext: nonEmptyStringSchema,
  interpretation: nonEmptyStringSchema,
  relatedPillars: nonEmptyStringSchema,
  citations: nonEmptyStringSchema,
  sourceTrail: nonEmptyStringSchema,
});

export const chapterRecordSchema = z.object({
  ownerId: ownerIdSchema,
  slug: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  curationStatus: curationStatusSchema,
  summary: nonEmptyStringSchema,
  sections: chapterSectionSchema,
  formalObjectIds: z.array(formalObjectIdSchema).min(1),
  conceptIds: z.array(conceptIdSchema).min(1),
  citationIds: z.array(conceptIdSchema).default([]),
  sourceTrail: z.array(sourceTrailItemSchema).min(1),
});

export const conceptRecordSchema = z.object({
  id: conceptIdSchema,
  term: nonEmptyStringSchema,
  aliases: z.array(nonEmptyStringSchema).default([]),
  notation: z.array(nonEmptyStringSchema).default([]),
  ownerIds: z.array(ownerIdSchema).min(1),
  definition: nonEmptyStringSchema,
  sourceTrail: z.array(sourceTrailItemSchema).min(1),
  formalObjectIds: z.array(formalObjectIdSchema).default([]),
  relatedConceptIds: z.array(conceptIdSchema).default([]),
});

export const formalRegistrySchema = z.array(formalObjectSchema);
export const chapterRegistrySchema = z.array(chapterRecordSchema);
export const conceptRegistrySchema = z.array(conceptRecordSchema);

export type OwnerId = z.infer<typeof ownerIdSchema>;
export type FormalObjectKind = z.infer<typeof formalObjectKindSchema>;
export type SourceTier = z.infer<typeof sourceTierSchema>;
export type CurationStatus = z.infer<typeof curationStatusSchema>;
export type SourceTrailItem = z.infer<typeof sourceTrailItemSchema>;
export type CitationRecord = z.infer<typeof citationRecordSchema>;
export type FormalObject = z.infer<typeof formalObjectSchema>;
export type ChapterRecord = z.infer<typeof chapterRecordSchema>;
export type ConceptRecord = z.infer<typeof conceptRecordSchema>;

export function parseFormalRegistry(registry: unknown): FormalObject[] {
  return formalRegistrySchema.parse(registry);
}

export function parseChapterRegistry(registry: unknown): ChapterRecord[] {
  return chapterRegistrySchema.parse(registry);
}

export function parseConceptRegistry(registry: unknown): ConceptRecord[] {
  return conceptRegistrySchema.parse(registry);
}
