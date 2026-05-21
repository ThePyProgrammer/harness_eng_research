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

export const relationTargetFamilySchema = discoveryTargetTypeSchema;
export const relationCategorySchema = z.enum(['conceptual', 'source-provenance', 'learning-path']);
export const relationDirectionSchema = z.enum(['directed', 'bidirectional']);
export const relationTypeIdSchema = slugIdSchema;

export const relationTargetSchema = z.object({
  family: relationTargetFamilySchema,
  id: z.string().trim().min(1),
});

export const relationTypeRecordSchema = z.object({
  id: relationTypeIdSchema,
  label: nonEmptyStringSchema,
  category: relationCategorySchema,
  directed: z.boolean(),
  allowedSourceFamilies: z.array(relationTargetFamilySchema).min(1),
  allowedTargetFamilies: z.array(relationTargetFamilySchema).min(1),
  description: nonEmptyStringSchema,
});

export const relationRecordSchema = z.object({
  id: slugIdSchema,
  typeId: relationTypeIdSchema,
  label: nonEmptyStringSchema,
  source: relationTargetSchema,
  target: relationTargetSchema,
  direction: relationDirectionSchema,
  rationale: nonEmptyStringSchema,
});

export const relationTypeRegistrySchema = z.array(relationTypeRecordSchema);
export const relationRecordRegistrySchema = z.array(relationRecordSchema);

export const searchResultTypeSchema = z.enum([
  'Pages',
  'Formal Objects',
  'Concepts',
  'Citations',
  'Reading Paths',
]);

export const discoverySearchRecordSchema = z.object({
  id: nonEmptyStringSchema,
  resultType: searchResultTypeSchema,
  stableId: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  href: hrefSchema,
  snippet: nonEmptyStringSchema,
  ownerId: ownerIdSchema.optional(),
  ownerTitle: nonEmptyStringSchema.optional(),
  objectKind: nonEmptyStringSchema.optional(),
  aliases: z.array(nonEmptyStringSchema).default([]),
  sourceLabel: nonEmptyStringSchema.optional(),
});

export const discoverySearchIndexSchema = z.object({
  generatedBy: nonEmptyStringSchema,
  recordCount: z.number().int().nonnegative(),
  resultClasses: z.array(searchResultTypeSchema).min(1),
  records: z.array(discoverySearchRecordSchema),
});

export const graphNodeFamilySchema = z.enum([
  'chapter',
  'concept',
  'formal-object',
  'citation',
  'reading-path',
  'relation-category',
]);

export const graphNodeSchema = z.object({
  id: nonEmptyStringSchema,
  family: graphNodeFamilySchema,
  label: nonEmptyStringSchema,
  href: hrefSchema,
  summary: nonEmptyStringSchema.optional(),
  ownerId: ownerIdSchema.optional(),
});

export const graphEdgeSchema = z.object({
  id: nonEmptyStringSchema,
  sourceId: nonEmptyStringSchema,
  targetId: nonEmptyStringSchema,
  relationTypeId: relationTypeIdSchema,
  label: nonEmptyStringSchema,
  category: relationCategorySchema,
  directed: z.boolean(),
  rationale: nonEmptyStringSchema,
});

export const graphPathMembershipSchema = z.object({
  pathId: slugIdSchema,
  pathTitle: nonEmptyStringSchema,
  stopTitle: nonEmptyStringSchema,
  href: hrefSchema,
});

export const graphNeighborhoodSchema = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  current: graphNodeSchema,
  nodes: z.array(graphNodeSchema),
  edges: z.array(graphEdgeSchema),
  incoming: z.array(graphEdgeSchema),
  outgoing: z.array(graphEdgeSchema),
  pathMemberships: z.array(graphPathMembershipSchema),
  nextHops: z.array(graphNodeSchema),
});

export const graphOverviewSchema = z.object({
  nodes: z.array(graphNodeSchema),
  edges: z.array(graphEdgeSchema),
});

export const graphIndexSchema = z.object({
  generatedBy: nonEmptyStringSchema,
  overview: graphOverviewSchema,
  neighborhoods: z.array(graphNeighborhoodSchema),
});

export type DiscoveryTargetType = z.infer<typeof discoveryTargetTypeSchema>;
export type DiscoveryTargetRef = z.infer<typeof discoveryTargetRefSchema>;
export type ReadingPathStop = z.infer<typeof readingPathStopSchema>;
export type ReadingPathBranch = z.infer<typeof readingPathBranchSchema>;
export type ReadingPath = z.infer<typeof readingPathSchema>;
export type RelationTargetFamily = z.infer<typeof relationTargetFamilySchema>;
export type RelationCategory = z.infer<typeof relationCategorySchema>;
export type RelationDirection = z.infer<typeof relationDirectionSchema>;
export type RelationTarget = z.infer<typeof relationTargetSchema>;
export type RelationTypeRecord = z.infer<typeof relationTypeRecordSchema>;
export type RelationRecord = z.infer<typeof relationRecordSchema>;
export type SearchResultType = z.infer<typeof searchResultTypeSchema>;
export type DiscoverySearchRecord = z.infer<typeof discoverySearchRecordSchema>;
export type DiscoverySearchIndex = z.infer<typeof discoverySearchIndexSchema>;
export type GraphNodeFamily = z.infer<typeof graphNodeFamilySchema>;
export type GraphNode = z.infer<typeof graphNodeSchema>;
export type GraphEdge = z.infer<typeof graphEdgeSchema>;
export type GraphPathMembership = z.infer<typeof graphPathMembershipSchema>;
export type GraphNeighborhood = z.infer<typeof graphNeighborhoodSchema>;
export type GraphOverview = z.infer<typeof graphOverviewSchema>;
export type GraphIndex = z.infer<typeof graphIndexSchema>;

export function parseReadingPaths(paths: unknown): ReadingPath[] {
  return readingPathRegistrySchema.parse(paths);
}

export function parseRelationTypes(types: unknown): RelationTypeRecord[] {
  return relationTypeRegistrySchema.parse(types);
}

export function parseRelationRecords(records: unknown): RelationRecord[] {
  return relationRecordRegistrySchema.parse(records);
}

export function parseDiscoverySearchIndex(index: unknown): DiscoverySearchIndex {
  return discoverySearchIndexSchema.parse(index);
}

export function parseGraphIndex(index: unknown): GraphIndex {
  return graphIndexSchema.parse(index);
}
