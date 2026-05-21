import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import { citations, formalRegistry } from '../data/formal-registry';
import {
  relationRecordSchema,
  relationTypeRecordSchema,
  type RelationRecord,
  type RelationTarget,
  type RelationTypeRecord,
} from '../data/discovery.schema';
import { readingPaths } from '../data/reading-paths';
import { relationRecords as defaultRelationRecords, relationTypes as defaultRelationTypes } from '../data/relations';

export interface DiscoveryValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface DiscoveryValidationResult {
  ok: boolean;
  errors: DiscoveryValidationError[];
}

interface DiscoveryFixture {
  relationTypes?: RelationTypeRecord[];
  relationRecords?: RelationRecord[];
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

export function validateDiscovery(fixture: DiscoveryFixture = {}): DiscoveryValidationResult {
  const errors: DiscoveryValidationError[] = [];
  const relationTypes = fixture.relationTypes ?? defaultRelationTypes;
  const relationRecords = fixture.relationRecords ?? defaultRelationRecords;

  validateTypeDefinitions(relationTypes, errors);
  validateRecordSemantics(relationRecords, relationTypes, errors);

  return { ok: errors.length === 0, errors };
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
      total_relation_types: defaultRelationTypes.length,
      total_relation_records: defaultRelationRecords.length,
      total_errors: result.errors.length,
      errors: result.errors,
    };
    const output = JSON.stringify(payload, null, 2);
    if (result.ok) {
      console.log(output);
    } else {
      console.error(output);
    }
  } else if (result.ok) {
    console.log(`OK: ${defaultRelationTypes.length} relation types and ${defaultRelationRecords.length} relation records validated, 0 errors found.`);
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
