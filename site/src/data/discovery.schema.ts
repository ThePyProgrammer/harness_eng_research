import { z } from 'zod';
import { expectedCorpusIds } from './corpus.schema';

export const ownerIdSchema = z.enum(expectedCorpusIds);
export const discoveryTargetTypeSchema = z.enum([
  'chapter',
  'concept',
  'formal-object',
  'citation',
  'reading-path',
]);

const semanticIdPattern = /^(umbrella|abstraction|information|reliability|coordination|temporal|quality|governance|economics|human-interaction|model-routing|security|accretion)\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nonEmptyStringSchema = z.string().trim().min(1);

export const formalObjectIdSchema = z.string().regex(semanticIdPattern);
export const slugIdSchema = z.string().regex(slugPattern);
export const hrefSchema = z.string().regex(/^\/[a-z0-9/#.-]+$/u);

export const discoveryTargetRefSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('chapter'),
    id: ownerIdSchema,
    href: hrefSchema,
  }),
  z.object({
    type: z.literal('concept'),
    id: slugIdSchema,
    href: hrefSchema,
  }),
  z.object({
    type: z.literal('formal-object'),
    id: formalObjectIdSchema,
    href: hrefSchema,
  }),
  z.object({
    type: z.literal('citation'),
    id: slugIdSchema,
    href: hrefSchema,
  }),
  z.object({
    type: z.literal('reading-path'),
    id: slugIdSchema,
    href: hrefSchema,
  }),
]);

export const readingPathStopSchema = z.object({
  id: slugIdSchema,
  title: nonEmptyStringSchema,
  target: discoveryTargetRefSchema,
  why: nonEmptyStringSchema,
});

export const readingPathBranchSchema = z.object({
  id: slugIdSchema,
  title: nonEmptyStringSchema,
  summary: nonEmptyStringSchema,
  stops: z.array(readingPathStopSchema).min(1),
});

export const readingPathSchema = z.object({
  slug: slugIdSchema,
  title: nonEmptyStringSchema,
  theme: nonEmptyStringSchema,
  purpose: nonEmptyStringSchema,
  branches: z.array(readingPathBranchSchema).min(2),
});

export const readingPathRegistrySchema = z.array(readingPathSchema);

export type DiscoveryTargetType = z.infer<typeof discoveryTargetTypeSchema>;
export type DiscoveryTargetRef = z.infer<typeof discoveryTargetRefSchema>;
export type ReadingPathStop = z.infer<typeof readingPathStopSchema>;
export type ReadingPathBranch = z.infer<typeof readingPathBranchSchema>;
export type ReadingPath = z.infer<typeof readingPathSchema>;

export function parseReadingPaths(paths: unknown): ReadingPath[] {
  return readingPathRegistrySchema.parse(paths);
}
