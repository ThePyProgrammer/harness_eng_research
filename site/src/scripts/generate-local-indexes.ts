import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import { corpusEntries } from '../data/corpus';
import type { CorpusEntry } from '../data/corpus.schema';
import { parseDiscoverySearchIndex, parseGraphIndex, type DiscoverySearchIndex, type DiscoverySearchRecord, type GraphEdge, type GraphIndex, type GraphNeighborhood, type GraphNode, type GraphNodeFamily, type GraphPathMembership, type RelationTarget, type SearchResultType } from '../data/discovery.schema';
import { citations, formalRegistry } from '../data/formal-registry';
import { readingPaths } from '../data/reading-paths';
import { relationRecords, relationTypes } from '../data/relations';

export interface CorpusIndex {
  generatedBy: 'site/src/scripts/generate-local-indexes.ts';
  entryCount: number;
  entries: CorpusEntry[];
}

export interface WriteCorpusIndexOptions {
  outputDir?: string;
}

const generatedBy = 'site/src/scripts/generate-local-indexes.ts' as const;
const outputFileName = 'corpus-index.json';
const searchOutputFileName = 'search-index.json';
const graphOutputFileName = 'graph-index.json';
const resultClasses: SearchResultType[] = ['Pages', 'Formal Objects', 'Concepts', 'Citations', 'Reading Paths'];

function siteRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../..');
}

function assertInsideSite(outputDir: string, root: string): string {
  const resolvedOutputDir = isAbsolute(outputDir) ? resolve(outputDir) : resolve(root, outputDir);
  const relativePath = relative(root, resolvedOutputDir);

  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error('Output directory must stay inside site/');
  }

  return resolvedOutputDir;
}

export function buildCorpusIndex(entries: CorpusEntry[] = corpusEntries): CorpusIndex {
  return {
    generatedBy,
    entryCount: entries.length,
    entries: entries.map((entry) => ({ ...entry })),
  };
}

function ownerTitle(ownerId: string): string | undefined {
  return corpusEntries.find((entry) => entry.id === ownerId)?.title;
}

function ownerSlug(ownerId: string): string | undefined {
  return corpusEntries.find((entry) => entry.id === ownerId)?.slug;
}

function pageRecords(entries: CorpusEntry[]): DiscoverySearchRecord[] {
  return entries.map((entry) => ({
    id: `page:${entry.id}`,
    resultType: 'Pages',
    stableId: entry.id,
    title: entry.title,
    href: `/corpus/${entry.slug}/`,
    snippet: `${entry.kind === 'umbrella' ? 'Umbrella framework' : 'Pillar'} page: ${entry.summary}`,
    ownerId: entry.id,
    ownerTitle: entry.title,
    sourceLabel: entry.canonicalTex,
  }));
}

function formalObjectRecords(): DiscoverySearchRecord[] {
  return formalRegistry.map((object) => {
    const slug = ownerSlug(object.ownerId);
    const title = ownerTitle(object.ownerId);
    if (!slug || !title) {
      throw new Error(`Missing corpus owner for formal object ${object.id}`);
    }

    return {
      id: `formal-object:${object.id}`,
      resultType: 'Formal Objects',
      stableId: object.id,
      title: object.title,
      href: `/corpus/${slug}/#${object.id}`,
      snippet: object.statement,
      ownerId: object.ownerId,
      ownerTitle: title,
      objectKind: object.kind,
      aliases: object.notation,
      sourceLabel: object.sourceTrail[0]?.label,
    };
  });
}

function conceptRecords(): DiscoverySearchRecord[] {
  return conceptRegistry.map((concept) => ({
    id: `concept:${concept.id}`,
    resultType: 'Concepts',
    stableId: concept.id,
    title: concept.term,
    href: `/glossary/#${concept.id}`,
    snippet: concept.definition,
    ownerId: concept.ownerIds[0],
    ownerTitle: ownerTitle(concept.ownerIds[0]),
    aliases: concept.aliases,
    sourceLabel: concept.sourceTrail[0]?.label,
  }));
}

function citationRecords(): DiscoverySearchRecord[] {
  return citations.map((citation) => ({
    id: `citation:${citation.id}`,
    resultType: 'Citations',
    stableId: citation.id,
    title: citation.label,
    href: `/formal-registry/#${citation.id}`,
    snippet: citation.sourceTrail.map((source) => source.label).join('; '),
    aliases: citation.sourceTrail.map((source) => source.path),
    sourceLabel: citation.sourceTrail[0]?.path,
  }));
}

function readingPathRecords(): DiscoverySearchRecord[] {
  return readingPaths.map((path) => ({
    id: `reading-path:${path.slug}`,
    resultType: 'Reading Paths',
    stableId: path.slug,
    title: path.title,
    href: `/reading-paths/${path.slug}/`,
    snippet: `${path.theme}. ${path.purpose}`,
    aliases: path.branches.flatMap((branch) => [branch.title, ...branch.stops.map((stop) => stop.title)]),
  }));
}

export function buildDiscoverySearchIndex(entries: CorpusEntry[] = corpusEntries): DiscoverySearchIndex {
  const records = [
    ...pageRecords(entries),
    ...formalObjectRecords(),
    ...conceptRecords(),
    ...citationRecords(),
    ...readingPathRecords(),
  ];

  return parseDiscoverySearchIndex({
    generatedBy,
    recordCount: records.length,
    resultClasses,
    records,
  });
}

function graphNodeId(target: RelationTarget | { family: GraphNodeFamily; id: string }): string {
  return `${target.family}:${target.id}`;
}

function relationTargetToGraphFamily(family: RelationTarget['family']): GraphNodeFamily {
  return family;
}

function graphNodeForTarget(target: RelationTarget): GraphNode {
  const id = graphNodeId({ family: relationTargetToGraphFamily(target.family), id: target.id });

  if (target.family === 'chapter') {
    const entry = corpusEntries.find((item) => item.id === target.id);
    if (!entry) throw new Error(`Missing graph chapter node: ${target.id}`);
    return { id, family: 'chapter', label: entry.title, href: `/corpus/${entry.slug}/`, summary: entry.summary, ownerId: entry.id };
  }

  if (target.family === 'concept') {
    const concept = conceptRegistry.find((item) => item.id === target.id);
    if (!concept) throw new Error(`Missing graph concept node: ${target.id}`);
    return { id, family: 'concept', label: concept.term, href: `/glossary/#${concept.id}`, summary: concept.definition, ownerId: concept.ownerIds[0] };
  }

  if (target.family === 'formal-object') {
    const object = formalRegistry.find((item) => item.id === target.id);
    const owner = object ? corpusEntries.find((item) => item.id === object.ownerId) : undefined;
    if (!object || !owner) throw new Error(`Missing graph formal object node: ${target.id}`);
    return { id, family: 'formal-object', label: object.title, href: `/corpus/${owner.slug}/#${object.id}`, summary: object.statement, ownerId: object.ownerId };
  }

  if (target.family === 'citation') {
    const citation = citations.find((item) => item.id === target.id);
    if (!citation) throw new Error(`Missing graph citation node: ${target.id}`);
    return { id, family: 'citation', label: citation.label, href: `/formal-registry/#${citation.id}`, summary: citation.sourceTrail.map((source) => source.label).join('; ') };
  }

  const path = readingPaths.find((item) => item.slug === target.id);
  if (!path) throw new Error(`Missing graph reading path node: ${target.id}`);
  return { id, family: 'reading-path', label: path.title, href: `/reading-paths/${path.slug}/`, summary: path.purpose };
}

function edgeFromRelation(record: typeof relationRecords[number]): GraphEdge {
  const type = relationTypes.find((item) => item.id === record.typeId);
  if (!type) throw new Error(`Missing graph relation type: ${record.typeId}`);

  return {
    id: `relation:${record.id}`,
    sourceId: graphNodeId({ family: relationTargetToGraphFamily(record.source.family), id: record.source.id }),
    targetId: graphNodeId({ family: relationTargetToGraphFamily(record.target.family), id: record.target.id }),
    relationTypeId: record.typeId,
    label: type.label,
    category: type.category,
    directed: type.directed,
    rationale: record.rationale,
  };
}

function pathMembershipsFor(nodeId: string): GraphPathMembership[] {
  const memberships: GraphPathMembership[] = [];

  for (const path of readingPaths) {
    for (const branch of path.branches) {
      for (const stop of branch.stops) {
        if (graphNodeId({ family: stop.target.type, id: stop.target.id }) === nodeId) {
          memberships.push({
            pathId: path.slug,
            pathTitle: path.title,
            stopTitle: stop.title,
            href: `/reading-paths/${path.slug}/`,
          });
        }
      }
    }
  }

  return memberships;
}

function uniqueNodes(nodes: GraphNode[]): GraphNode[] {
  return Array.from(new Map(nodes.map((node) => [node.id, node])).values()).sort((a, b) => a.label.localeCompare(b.label));
}

function uniqueEdges(edges: GraphEdge[]): GraphEdge[] {
  return Array.from(new Map(edges.map((edge) => [edge.id, edge])).values());
}

function buildNeighborhood(current: GraphNode, edges: GraphEdge[], nodeById: Map<string, GraphNode>): GraphNeighborhood {
  const incoming = edges.filter((edge) => edge.targetId === current.id || (!edge.directed && edge.sourceId === current.id));
  const outgoing = edges.filter((edge) => edge.sourceId === current.id || (!edge.directed && edge.targetId === current.id));
  const localEdges = uniqueEdges([...incoming, ...outgoing]);
  const neighborIds = new Set(localEdges.flatMap((edge) => [edge.sourceId, edge.targetId]).filter((id) => id !== current.id));
  const nodes = uniqueNodes(Array.from(neighborIds).map((id) => nodeById.get(id)).filter((node): node is GraphNode => Boolean(node)));
  const nextHops = uniqueNodes(outgoing.map((edge) => nodeById.get(edge.targetId === current.id ? edge.sourceId : edge.targetId)).filter((node): node is GraphNode => Boolean(node)));

  return {
    id: current.id,
    title: `${current.label} local context`,
    current,
    nodes,
    edges: localEdges,
    incoming,
    outgoing,
    pathMemberships: pathMembershipsFor(current.id),
    nextHops,
  };
}

function overviewCategoryNode(category: string): GraphNode {
  const label = category.split('-').map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(' ');
  return { id: `relation-category:${category}`, family: 'relation-category', label, href: `/graph/#${category}`, summary: `High-level ${label.toLowerCase()} graph relations.` };
}

export function buildGraphIndex(): GraphIndex {
  const relationNodes = relationRecords.flatMap((record) => [graphNodeForTarget(record.source), graphNodeForTarget(record.target)]);
  const pathStopNodes = readingPaths.flatMap((path) => path.branches.flatMap((branch) => branch.stops.map((stop) => graphNodeForTarget({ family: stop.target.type, id: stop.target.id }))));
  const nodeById = new Map(uniqueNodes([...relationNodes, ...pathStopNodes]).map((node) => [node.id, node]));
  const relationEdges = relationRecords.map(edgeFromRelation);
  const pathEdges = readingPaths.flatMap((path) => path.branches.flatMap((branch) => branch.stops.map((stop) => ({
    id: `path:${path.slug}:${branch.id}:${stop.id}`,
    sourceId: `reading-path:${path.slug}`,
    targetId: graphNodeId({ family: stop.target.type, id: stop.target.id }),
    relationTypeId: 'next-readings',
    label: 'next readings',
    category: 'learning-path' as const,
    directed: true,
    rationale: stop.why,
  }))));
  const allEdges = uniqueEdges([...relationEdges, ...pathEdges]);

  for (const path of readingPaths) {
    const pathNode = graphNodeForTarget({ family: 'reading-path', id: path.slug });
    nodeById.set(pathNode.id, pathNode);
  }

  const overviewNodes = uniqueNodes([
    ...corpusEntries.map((entry) => graphNodeForTarget({ family: 'chapter', id: entry.id })),
    ...readingPaths.map((path) => graphNodeForTarget({ family: 'reading-path', id: path.slug })),
    ...relationTypes.map((type) => overviewCategoryNode(type.category)),
  ]);
  const overviewEdges = uniqueEdges([
    ...readingPaths.map((path) => ({
      id: `overview:path:${path.slug}`,
      sourceId: 'chapter:umbrella',
      targetId: `reading-path:${path.slug}`,
      relationTypeId: 'next-readings',
      label: 'next readings',
      category: 'learning-path' as const,
      directed: true,
      rationale: path.purpose,
    })),
    ...relationTypes.map((type) => ({
      id: `overview:category:${type.category}`,
      sourceId: 'chapter:umbrella',
      targetId: `relation-category:${type.category}`,
      relationTypeId: type.id,
      label: type.label,
      category: type.category,
      directed: true,
      rationale: type.description,
    })),
  ]);
  const neighborhoodNodes = Array.from(nodeById.values()).filter((node) => node.family !== 'relation-category');

  return parseGraphIndex({
    generatedBy,
    overview: { nodes: overviewNodes, edges: overviewEdges },
    neighborhoods: neighborhoodNodes.map((node) => buildNeighborhood(node, allEdges, nodeById)),
  });
}

export function writeCorpusIndex(options: WriteCorpusIndexOptions = {}): string {
  const root = siteRoot();
  const outputDir = options.outputDir ?? 'dist';
  const safeOutputDir = assertInsideSite(outputDir, root);
  const outputPath = resolve(safeOutputDir, outputFileName);
  const payload = `${JSON.stringify(buildCorpusIndex(), null, 2)}\n`;

  mkdirSync(safeOutputDir, { recursive: true });
  writeFileSync(outputPath, payload, 'utf-8');

  return outputPath;
}

export function writeDiscoverySearchIndex(options: WriteCorpusIndexOptions = {}): string {
  const root = siteRoot();
  const outputDir = options.outputDir ?? 'dist';
  const safeOutputDir = assertInsideSite(outputDir, root);
  const outputPath = resolve(safeOutputDir, searchOutputFileName);
  const payload = `${JSON.stringify(buildDiscoverySearchIndex(), null, 2)}\n`;

  mkdirSync(safeOutputDir, { recursive: true });
  writeFileSync(outputPath, payload, 'utf-8');

  return outputPath;
}

export function writeGraphIndex(options: WriteCorpusIndexOptions = {}): string {
  const root = siteRoot();
  const outputDir = options.outputDir ?? 'dist';
  const safeOutputDir = assertInsideSite(outputDir, root);
  const outputPath = resolve(safeOutputDir, graphOutputFileName);
  const payload = `${JSON.stringify(buildGraphIndex(), null, 2)}\n`;

  mkdirSync(safeOutputDir, { recursive: true });
  writeFileSync(outputPath, payload, 'utf-8');

  return outputPath;
}

function runCli(): number {
  try {
    writeCorpusIndex();
    writeDiscoverySearchIndex();
    writeGraphIndex();
    console.error('Successfully created: dist/corpus-index.json');
    console.error('Successfully created: dist/search-index.json');
    console.error('Successfully created: dist/graph-index.json');
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: Failed to save output: ${message}`);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
