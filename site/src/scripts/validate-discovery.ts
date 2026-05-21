import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import { citations, formalRegistry } from '../data/formal-registry';
import {
  relationRecordSchema,
  relationTypeRecordSchema,
  type DiscoverySearchRecord,
  type GraphEdge,
  type GraphIndex,
  type GraphNode,
  type SearchResultType,
  type RelationRecord,
  type RelationTarget,
  type RelationTypeRecord,
} from '../data/discovery.schema';
import { readingPaths } from '../data/reading-paths';
import { relationRecords as defaultRelationRecords, relationTypes as defaultRelationTypes } from '../data/relations';
import { buildDiscoverySearchIndex, buildGraphIndex } from './generate-local-indexes';

export interface DiscoveryValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface DiscoverySearchFixture {
  query: string;
  resultType: SearchResultType;
  expectedHrefIncludes?: string;
  expectedStableId?: string;
}

export interface DiscoveryValidationTotals {
  paths: number;
  relations: number;
  relationTypes: number;
  graphNodes: number;
  graphNeighborhoods: number;
  searchFixtures: number;
  errors: number;
}

export interface DiscoveryValidationResult {
  ok: boolean;
  errors: DiscoveryValidationError[];
  searchFixtures: DiscoverySearchFixture[];
  totals: DiscoveryValidationTotals;
}

interface DiscoveryFixture {
  relationTypes?: RelationTypeRecord[];
  relationRecords?: RelationRecord[];
  searchRecords?: DiscoverySearchRecord[];
  searchFixtures?: DiscoverySearchFixture[];
  graphIndex?: GraphIndex;
}

function addError(
  errors: DiscoveryValidationError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}

function targetLabel(target: RelationTarget): string {
  return `${target.family}:${target.id}`;
}

function knownTargetIds(): Record<RelationTarget['family'], Set<string>> {
  return {
    chapter: new Set(chapterRegistry.map((chapter) => chapter.ownerId)),
    concept: new Set(conceptRegistry.map((concept) => concept.id)),
    'formal-object': new Set(formalRegistry.map((object) => object.id)),
    citation: new Set(citations.map((citation) => citation.id)),
    'reading-path': new Set(readingPaths.map((path) => path.slug)),
  };
}

function targetToGraphId(target: RelationTarget): string {
  return `${target.family}:${target.id}`;
}

function validateTypeDefinitions(types: RelationTypeRecord[], errors: DiscoveryValidationError[]): void {
  const counts = new Map<string, number>();

  for (const type of types) {
    const result = relationTypeRecordSchema.safeParse(type);
    if (!result.success) {
      addError(
        errors,
        type.id ?? 'relation-type',
        'relationTypes.schema',
        type.id ?? 'unknown',
        'Invalid relation type definition',
        'Provide id, label, category, directed flag, allowed source families, allowed target families, and description.',
      );
    }
    counts.set(type.id, (counts.get(type.id) ?? 0) + 1);
  }

  for (const [id, count] of counts.entries()) {
    if (count > 1) {
      addError(errors, id, 'relationTypes.id', id, 'Duplicate relation type id', 'Keep relation type IDs globally unique.');
    }
  }
}

function validateRecordShape(record: RelationRecord, errors: DiscoveryValidationError[]): void {
  const result = relationRecordSchema.safeParse(record);
  if (!result.success) {
    addError(errors, record.id ?? 'relation-record', 'relationRecords.schema', record.id ?? 'unknown', result.error.message, 'Fix the relation record shape.');
  }
  if (!record.label?.trim()) {
    addError(errors, record.id, 'label', record.id, 'Missing display label', 'Use the readable label from the registered relation type.');
  }
}

function validateTargetExists(
  record: RelationRecord,
  side: 'source' | 'target',
  idsByFamily: Record<RelationTarget['family'], Set<string>>,
  errors: DiscoveryValidationError[],
): void {
  const target = record[side];
  if (!idsByFamily[target.family]?.has(target.id)) {
    addError(
      errors,
      record.id,
      side,
      targetLabel(target),
      side === 'source' ? 'Relation source target does not exist' : 'Relation destination target does not exist',
      'Add the referenced discovery target or remove the relation record.',
    );
  }
}

const defaultSearchFixtures: DiscoverySearchFixture[] = [
  {
    query: 'Reliability',
    resultType: 'Pages',
    expectedStableId: 'reliability',
    expectedHrefIncludes: '/corpus/reliability/',
  },
  {
    query: 'compound error sensitivity',
    resultType: 'Formal Objects',
    expectedStableId: 'reliability.compound-error-bound',
    expectedHrefIncludes: '#reliability.compound-error-bound',
  },
  {
    query: 'context degradation',
    resultType: 'Concepts',
    expectedStableId: 'context-degradation',
    expectedHrefIncludes: '#context-degradation',
  },
  {
    query: 'security canonical paper',
    resultType: 'Citations',
    expectedStableId: 'security-paper',
    expectedHrefIncludes: '#security-paper',
  },
  {
    query: 'production hardening',
    resultType: 'Reading Paths',
    expectedStableId: 'production-hardening',
    expectedHrefIncludes: '/reading-paths/production-hardening/',
  },
];

function validateRecordSemantics(
  records: RelationRecord[],
  types: RelationTypeRecord[],
  errors: DiscoveryValidationError[],
): void {
  const typeById = new Map(types.map((type) => [type.id, type]));
  const idsByFamily = knownTargetIds();

  for (const record of records) {
    validateRecordShape(record, errors);
    const type = typeById.get(record.typeId);
    if (!type) {
      addError(errors, record.id, 'typeId', record.typeId, 'Relation type does not exist', 'Register the relation type before using it.');
      continue;
    }

    if (record.label !== type.label) {
      addError(errors, record.id, 'label', record.label, 'Display label does not match relation type', 'Use the registered relation type label instead of an ad hoc row label.');
    }

    if (!type.directed && record.direction !== 'bidirectional') {
      addError(errors, record.id, 'direction', record.direction, 'Invalid direction for relation type', 'Use bidirectional for undirected relation types.');
    }
    if (type.directed && record.direction !== 'directed') {
      addError(errors, record.id, 'direction', record.direction, 'Invalid direction for relation type', 'Use directed for directed relation types.');
    }

    if (!type.allowedSourceFamilies.includes(record.source.family) || !type.allowedTargetFamilies.includes(record.target.family)) {
      addError(errors, record.id, 'family', `${record.source.family}->${record.target.family}`, 'Relation family is not allowed', 'Choose a relation type whose allowed source and target families match the record.');
    }

    validateTargetExists(record, 'source', idsByFamily, errors);
    validateTargetExists(record, 'target', idsByFamily, errors);
  }
}

function searchableText(record: DiscoverySearchRecord): string {
  return [record.title, record.stableId, record.snippet, record.ownerTitle, record.objectKind, ...(record.aliases ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function validateGraphNode(node: GraphNode, errors: DiscoveryValidationError[]): void {
  if (!node.id?.trim()) {
    addError(errors, 'graph-node', 'graph.node.id', node.label ?? 'unknown', 'Missing graph node ID', 'Give every graph node a stable family-prefixed ID.');
  }
  if (!node.label?.trim()) {
    addError(errors, node.id || 'graph-node', 'graph.node.label', node.id || 'unknown', 'Missing graph node label', 'Resolve node labels from the corpus, path, formal, concept, or citation registry.');
  }
  if (!node.href?.startsWith('/')) {
    addError(errors, node.id || 'graph-node', 'graph.node.href', node.href || 'missing', 'Missing graph node href', 'Provide a static href for every graph node.');
  }
}

function validateGraphEdge(
  edge: GraphEdge,
  nodeIds: Set<string>,
  relationTypeIds: Set<string>,
  errors: DiscoveryValidationError[],
): void {
  if (!nodeIds.has(edge.sourceId)) {
    addError(errors, edge.id, 'graph.edge.sourceId', edge.sourceId, 'Graph edge source is not renderable', 'Point graph edges only at generated graph nodes.');
  }
  if (!nodeIds.has(edge.targetId)) {
    addError(errors, edge.id, 'graph.edge.targetId', edge.targetId, 'Graph edge target is not renderable', 'Point graph edges only at generated graph nodes.');
  }
  if (!relationTypeIds.has(edge.relationTypeId)) {
    addError(errors, edge.id, 'graph.edge.relationTypeId', edge.relationTypeId, 'Graph edge relation type does not exist', 'Use a registered relation type ID.');
  }
}

function validateGraphIndex(
  graphIndex: GraphIndex,
  relationRecords: RelationRecord[],
  relationTypes: RelationTypeRecord[],
  errors: DiscoveryValidationError[],
): void {
  const allNodes = [
    ...graphIndex.overview.nodes,
    ...graphIndex.neighborhoods.flatMap((neighborhood) => [neighborhood.current, ...neighborhood.nodes, ...neighborhood.nextHops]),
  ];
  const nodeIds = new Set(allNodes.map((node) => node.id));
  const relationTypeIds = new Set(relationTypes.map((type) => type.id));

  for (const node of allNodes) {
    validateGraphNode(node, errors);
  }

  for (const relation of relationRecords) {
    if (!nodeIds.has(targetToGraphId(relation.source)) || !nodeIds.has(targetToGraphId(relation.target))) {
      addError(errors, relation.id, 'graph.relation.renderability', `${targetToGraphId(relation.source)}->${targetToGraphId(relation.target)}`, 'Relation record is not renderable in graph artifacts', 'Generate graph nodes for every validated relation endpoint.');
    }
  }

  for (const edge of [...graphIndex.overview.edges, ...graphIndex.neighborhoods.flatMap((neighborhood) => neighborhood.edges)]) {
    validateGraphEdge(edge, nodeIds, relationTypeIds, errors);
  }

  for (const neighborhood of graphIndex.neighborhoods) {
    if (neighborhood.id !== neighborhood.current.id || !nodeIds.has(neighborhood.id)) {
      addError(errors, neighborhood.id, 'graph.neighborhood.id', neighborhood.current.id, 'Neighborhood ID does not match a renderable graph node', 'Build local graph routes from generated current node IDs only.');
    }
    for (const membership of neighborhood.pathMemberships) {
      if (!readingPaths.some((path) => path.slug === membership.pathId)) {
        addError(errors, neighborhood.id, 'graph.pathMemberships.pathId', membership.pathId, 'Graph path membership does not reference a known reading path', 'Use only registered reading path slugs.');
      }
    }
  }
}

function validateSearchFixtures(
  records: DiscoverySearchRecord[],
  fixtures: DiscoverySearchFixture[],
  errors: DiscoveryValidationError[],
): void {
  for (const fixture of fixtures) {
    if (!fixture.expectedHrefIncludes && !fixture.expectedStableId) {
      addError(
        errors,
        `search:${fixture.query}`,
        'searchFixtures.expected',
        fixture.query,
        'Search fixture must assert an expected href or anchor',
        'Add expectedHrefIncludes or expectedStableId so QUAL-03 catches drift instead of accepting any non-empty result.',
      );
      continue;
    }

    const queryTokens = fixture.query.toLowerCase().split(/\s+/u).filter(Boolean);
    const match = records.find((record) => {
      if (record.resultType !== fixture.resultType) {
        return false;
      }
      if (fixture.expectedStableId && record.stableId !== fixture.expectedStableId) {
        return false;
      }
      if (fixture.expectedHrefIncludes && !record.href.includes(fixture.expectedHrefIncludes)) {
        return false;
      }
      const text = searchableText(record);
      return queryTokens.every((token) => text.includes(token));
    });

    if (!match) {
      addError(
        errors,
        `search:${fixture.query}`,
        'searchFixtures.expectedResult',
        fixture.expectedHrefIncludes ?? fixture.expectedStableId ?? fixture.query,
        `Missing expected search result for query "${fixture.query}" in ${fixture.resultType}`,
        'Update the generated search record or fixture target so the expected page or anchor is discoverable.',
      );
    }
  }
}

export function validateDiscovery(fixture: DiscoveryFixture = {}): DiscoveryValidationResult {
  const errors: DiscoveryValidationError[] = [];
  const relationTypes = fixture.relationTypes ?? defaultRelationTypes;
  const relationRecords = fixture.relationRecords ?? defaultRelationRecords;
  const searchRecords = fixture.searchRecords ?? buildDiscoverySearchIndex().records;
  const searchFixtures = fixture.searchFixtures ?? defaultSearchFixtures;
  const graphIndex = fixture.graphIndex ?? buildGraphIndex();

  validateTypeDefinitions(relationTypes, errors);
  validateRecordSemantics(relationRecords, relationTypes, errors);
  validateSearchFixtures(searchRecords, searchFixtures, errors);
  validateGraphIndex(graphIndex, relationRecords, relationTypes, errors);

  const graphNodeIds = new Set([
    ...graphIndex.overview.nodes.map((node) => node.id),
    ...graphIndex.neighborhoods.flatMap((neighborhood) => [neighborhood.current.id, ...neighborhood.nodes.map((node) => node.id), ...neighborhood.nextHops.map((node) => node.id)]),
  ]);
  const totals: DiscoveryValidationTotals = {
    paths: readingPaths.length,
    relations: relationRecords.length,
    relationTypes: relationTypes.length,
    graphNodes: graphNodeIds.size,
    graphNeighborhoods: graphIndex.neighborhoods.length,
    searchFixtures: searchFixtures.length,
    errors: errors.length,
  };

  return { ok: errors.length === 0, errors, searchFixtures, totals };
}

export function formatDiscoveryError(error: DiscoveryValidationError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validateDiscovery();

  if (json) {
    const payload = {
      ok: result.ok,
      totals: result.totals,
      total_paths: result.totals.paths,
      total_relation_types: result.totals.relationTypes,
      total_relation_records: result.totals.relations,
      total_graph_nodes: result.totals.graphNodes,
      total_graph_neighborhoods: result.totals.graphNeighborhoods,
      total_search_fixtures: result.totals.searchFixtures,
      total_errors: result.totals.errors,
      errors: result.errors,
    };
    const output = JSON.stringify(payload, null, 2);
    if (result.ok) {
      console.log(output);
    } else {
      console.error(output);
    }
  } else if (result.ok) {
    console.log(`OK: ${result.totals.paths} reading paths, ${result.totals.relationTypes} relation types, ${result.totals.relations} relation records, ${result.totals.graphNodes} graph nodes, ${result.totals.graphNeighborhoods} graph neighborhoods, and ${result.totals.searchFixtures} search fixtures validated, 0 errors found.`);
  } else {
    console.error(`ERRORS: ${result.errors.length} discovery validation error(s):`);
    for (const error of result.errors) {
      console.error(formatDiscoveryError(error));
    }
  }

  return result.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
