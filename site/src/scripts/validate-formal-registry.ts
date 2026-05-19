import { existsSync } from 'node:fs';
import { dirname, isAbsolute, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import { expectedCorpusIds } from '../data/corpus.schema';
import { citations, derivationCoverageByOwner as defaultDerivationCoverageByOwner, formalRegistry, type DerivationCoverageEntry } from '../data/formal-registry';
import {
  chapterRecordSchema,
  conceptRecordSchema,
  curationStatusSchema,
  formalObjectSchema,
  ownerIdSchema,
  type ChapterRecord,
  type CitationRecord,
  type ConceptRecord,
  type FormalObject,
  type SourceTrailItem,
} from '../data/formal-registry.schema';

export interface FormalRegistryValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface FormalRegistryValidationResult {
  ok: boolean;
  errors: FormalRegistryValidationError[];
}

interface RegistryFixture {
  formalObjects?: FormalObject[];
  chapters?: ChapterRecord[];
  concepts?: ConceptRecord[];
  citations?: CitationRecord[];
  derivationCoverage?: Record<string, DerivationCoverageEntry[]>;
}

const archivePathPattern = /(^|\/)archive(\/|$)/;
const requiredChapterSections = [
  'problem',
  'coreModel',
  'keyNotation',
  'definitions',
  'formalClaims',
  'derivationContext',
  'interpretation',
  'relatedPillars',
  'citations',
  'sourceTrail',
] as const;

function defaultRepoRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
}

function hasParentTraversal(pathValue: string): boolean {
  return pathValue.split(/[\\/]+/).includes('..');
}

function addError(
  errors: FormalRegistryValidationError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}

function sourceOwnerFromPath(pathValue: string): string | null {
  if (pathValue.startsWith('science/paper/')) {
    return 'umbrella';
  }

  const match = pathValue.match(/^pillars\/([^/]+)\/paper\//);
  return match?.[1] ?? null;
}

function validateOwner(ownerId: string, entryId: string, errors: FormalRegistryValidationError[]): void {
  if (!ownerIdSchema.safeParse(ownerId).success) {
    addError(errors, entryId, 'ownerId', ownerId, 'Invalid owner id', 'Use an owner from expectedCorpusIds.');
  }
}

function validateSourceTrail(
  entryId: string,
  ownerId: string,
  sourceTrail: SourceTrailItem[],
  repoRoot: string,
  errors: FormalRegistryValidationError[],
): void {
  if (sourceTrail.length === 0) {
    addError(errors, entryId, 'sourceTrail', entryId, 'Missing required source trail', 'Add at least one labeled source trail item.');
  }

  for (const source of sourceTrail) {
    if (isAbsolute(source.path)) {
      addError(errors, entryId, 'sourceTrail.path', source.path, 'Path must be project-root-relative', 'Replace the absolute path with a repository-relative path.');
      continue;
    }

    if (hasParentTraversal(source.path)) {
      addError(errors, entryId, 'sourceTrail.path', source.path, 'Path cannot contain parent traversal', 'Use a canonical or explicitly labeled support path inside the repository.');
      continue;
    }

    if (source.tier === 'canonical') {
      if (archivePathPattern.test(source.path)) {
        addError(errors, entryId, 'sourceTrail.path', source.path, 'Archive paths cannot be canonical sources', 'Relabel as archived-provenance or use the owning paper directory.');
      }

      const sourceOwner = sourceOwnerFromPath(source.path);
      if (sourceOwner !== ownerId && !(entryId === 'reliability.compound-error-bound' && sourceOwner === 'umbrella')) {
        addError(errors, entryId, 'sourceTrail.path', source.path, 'Canonical source path does not match owner', 'Use science/paper/ for umbrella or pillars/<owner>/paper/ for pillar records.');
      }
    }

    const resolvedPath = resolve(repoRoot, source.path.split('/').join(sep));
    if (!existsSync(resolvedPath)) {
      addError(errors, entryId, 'sourceTrail.path', source.path, 'Required source path does not exist', 'Restore the source file or update the registry path.');
    }
  }
}

function validateSchemaShapes(
  formalObjects: FormalObject[],
  chapters: ChapterRecord[],
  concepts: ConceptRecord[],
  errors: FormalRegistryValidationError[],
): void {
  for (const object of formalObjects) {
    const result = formalObjectSchema.safeParse(object);
    if (!result.success) {
      addError(errors, object.id ?? 'formal-object', 'schema', object.id ?? 'unknown', result.error.message, 'Fix the formal object shape.');
    }
    validateOwner(object.ownerId, object.id, errors);
  }

  for (const chapter of chapters) {
    const result = chapterRecordSchema.safeParse(chapter);
    if (!result.success) {
      addError(errors, chapter.ownerId ?? 'chapter', 'schema', chapter.slug ?? 'unknown', result.error.message, 'Fix the chapter record shape.');
    }
    validateOwner(chapter.ownerId, chapter.ownerId, errors);
    if (!curationStatusSchema.safeParse(chapter.curationStatus).success) {
      addError(errors, chapter.ownerId, 'curationStatus', String(chapter.curationStatus), 'Invalid curation status', 'Use minimal or curated.');
    }
  }

  for (const concept of concepts) {
    const result = conceptRecordSchema.safeParse(concept);
    if (!result.success) {
      addError(errors, concept.id ?? 'concept', 'schema', concept.id ?? 'unknown', result.error.message, 'Fix the concept record shape.');
    }
    for (const ownerId of concept.ownerIds) {
      validateOwner(ownerId, concept.id, errors);
    }
  }
}

function validateExpectedOwners(chapters: ChapterRecord[], formalObjects: FormalObject[], concepts: ConceptRecord[], errors: FormalRegistryValidationError[]): void {
  for (const ownerId of expectedCorpusIds) {
    if (!chapters.some((chapter) => chapter.ownerId === ownerId)) {
      addError(errors, ownerId, 'chapter', ownerId, 'Missing required chapter record', 'Add a build-safe chapter seed for every expected corpus owner.');
    }
    if (!formalObjects.some((object) => object.ownerId === ownerId)) {
      addError(errors, ownerId, 'formalObjects', ownerId, 'Missing required formal object record', 'Add at least one formal object for every expected corpus owner.');
    }
    if (!concepts.some((concept) => concept.ownerIds.includes(ownerId))) {
      addError(errors, ownerId, 'concepts', ownerId, 'Missing required concept record', 'Add at least one concept for every expected corpus owner.');
    }
  }
}

function validateDuplicateFormalIds(formalObjects: FormalObject[], errors: FormalRegistryValidationError[]): void {
  const counts = new Map<string, number>();
  for (const object of formalObjects) {
    counts.set(object.id, (counts.get(object.id) ?? 0) + 1);
  }

  for (const [id, count] of counts.entries()) {
    if (count > 1) {
      addError(errors, id, 'id', id, 'Duplicate formal object id', 'Keep formal object IDs globally unique.');
    }
  }
}

function validateChapterSections(chapters: ChapterRecord[], errors: FormalRegistryValidationError[]): void {
  for (const chapter of chapters) {
    for (const sectionKey of requiredChapterSections) {
      if (!chapter.sections?.[sectionKey]?.trim()) {
        addError(errors, chapter.ownerId, `sections.${sectionKey}`, sectionKey, 'Missing required chapter section', 'Populate every D-01 section key before rendering.');
      }
    }
  }
}

function validateDerivationCoverage(
  formalObjects: FormalObject[],
  chapters: ChapterRecord[],
  coverageByOwner: Record<string, DerivationCoverageEntry[]>,
  errors: FormalRegistryValidationError[],
): void {
  const formalObjectById = new Map(formalObjects.map((object) => [object.id, object]));

  for (const ownerId of expectedCorpusIds) {
    const entries = coverageByOwner[ownerId];
    const chapter = chapters.find((entry) => entry.ownerId === ownerId);
    if (!entries?.length) {
      addError(errors, ownerId, 'derivationCoverageByOwner', ownerId, 'Missing owner in derivation coverage matrix', 'Add a supported derivation/equation entry or source-grounded not-supported rationale.');
      continue;
    }

    for (const entry of entries) {
      if (entry.status === 'supported') {
        if (entry.formalObjectIds.length === 0) {
          addError(errors, ownerId, 'derivationCoverageByOwner.formalObjectIds', entry.sourcePath, 'Supported derivation has no formal object IDs', 'Link supported sources to derivation or equation objects.');
        }
        for (const objectId of entry.formalObjectIds) {
          const object = formalObjectById.get(objectId);
          if (!object || !['derivation', 'equation'].includes(object.kind)) {
            addError(errors, ownerId, 'derivationCoverageByOwner.formalObjectIds', objectId, 'Supported derivation target must be a derivation or equation object', 'Create a notebook-style derivation/equation formal object for the source-supported entry.');
          }
          if (!chapter?.sections.derivationContext.includes(objectId)) {
            addError(errors, ownerId, 'sections.derivationContext', objectId, 'Derivation context does not mention supported formal object', 'Reference the derivation or equation ID in the chapter derivation context.');
          }
        }
      } else {
        if (entry.formalObjectIds.length > 0 || !entry.rationale?.includes(entry.sourcePath) || entry.rationale.length <= 40) {
          addError(errors, ownerId, 'derivationCoverageByOwner.rationale', entry.sourcePath, 'Unsupported derivation lacks source-grounded rationale', 'Provide a source-path-specific rationale and no formal object IDs.');
        }
      }
    }
  }
}

function validateTargets(
  formalObjects: FormalObject[],
  chapters: ChapterRecord[],
  concepts: ConceptRecord[],
  citationsInput: CitationRecord[],
  errors: FormalRegistryValidationError[],
): void {
  const formalIds = new Set(formalObjects.map((object) => object.id));
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const citationIds = new Set(citationsInput.map((citation) => citation.id));

  for (const object of formalObjects) {
    for (const relatedId of object.relatedObjectIds) {
      if (!formalIds.has(relatedId)) {
        addError(errors, object.id, 'relatedObjectIds', relatedId, 'Relation target does not exist', 'Add the target formal object or remove the relation.');
      }
    }
    for (const conceptId of object.conceptIds) {
      if (!conceptIds.has(conceptId)) {
        addError(errors, object.id, 'conceptIds', conceptId, 'Concept target does not exist', 'Add the target concept or remove the reference.');
      }
    }
    for (const citationId of object.citationIds) {
      if (!citationIds.has(citationId)) {
        addError(errors, object.id, 'citationIds', citationId, 'Citation target does not exist', 'Add the citation record or remove the reference.');
      }
    }
  }

  for (const chapter of chapters) {
    for (const formalObjectId of chapter.formalObjectIds) {
      if (!formalIds.has(formalObjectId)) {
        addError(errors, chapter.ownerId, 'formalObjectIds', formalObjectId, 'Chapter formal object target does not exist', 'Add the formal object before linking the chapter.');
      }
    }
    for (const conceptId of chapter.conceptIds) {
      if (!conceptIds.has(conceptId)) {
        addError(errors, chapter.ownerId, 'conceptIds', conceptId, 'Chapter concept target does not exist', 'Add the concept before linking the chapter.');
      }
    }
  }

  for (const concept of concepts) {
    for (const formalObjectId of concept.formalObjectIds) {
      if (!formalIds.has(formalObjectId)) {
        addError(errors, concept.id, 'formalObjectIds', formalObjectId, 'Concept formal object target does not exist', 'Add the formal object or remove the concept link.');
      }
    }
    for (const relatedConceptId of concept.relatedConceptIds) {
      if (!conceptIds.has(relatedConceptId)) {
        addError(errors, concept.id, 'relatedConceptIds', relatedConceptId, 'Concept relation target does not exist', 'Add the related concept or remove the link.');
      }
    }
  }
}

export function validateFormalRegistry(
  fixture: RegistryFixture = {},
  options: { repoRoot?: string } = {},
): FormalRegistryValidationResult {
  const errors: FormalRegistryValidationError[] = [];
  const formalObjects = fixture.formalObjects ?? formalRegistry;
  const chapters = fixture.chapters ?? chapterRegistry;
  const concepts = fixture.concepts ?? conceptRegistry;
  const citationInput = fixture.citations ?? citations;
  const coverageByOwner = fixture.derivationCoverage ?? defaultDerivationCoverageByOwner;
  const repoRoot = options.repoRoot ?? defaultRepoRoot();

  validateSchemaShapes(formalObjects, chapters, concepts, errors);
  validateExpectedOwners(chapters, formalObjects, concepts, errors);
  validateDuplicateFormalIds(formalObjects, errors);
  validateChapterSections(chapters, errors);

  for (const object of formalObjects) {
    validateSourceTrail(object.id, object.ownerId, object.sourceTrail, repoRoot, errors);
  }
  for (const chapter of chapters) {
    validateSourceTrail(chapter.ownerId, chapter.ownerId, chapter.sourceTrail, repoRoot, errors);
  }
  for (const concept of concepts) {
    validateSourceTrail(concept.id, concept.ownerIds[0], concept.sourceTrail, repoRoot, errors);
  }

  validateDerivationCoverage(formalObjects, chapters, coverageByOwner, errors);
  validateTargets(formalObjects, chapters, concepts, citationInput, errors);

  return { ok: errors.length === 0, errors };
}

export function formatFormalRegistryError(error: FormalRegistryValidationError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validateFormalRegistry();

  if (json) {
    const payload = {
      ok: result.ok,
      total_formal_objects: formalRegistry.length,
      total_chapters: chapterRegistry.length,
      total_concepts: conceptRegistry.length,
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
    console.log(`OK: ${formalRegistry.length} formal objects, ${chapterRegistry.length} chapters, and ${conceptRegistry.length} concepts validated, 0 errors found.`);
  } else {
    console.error(`ERRORS: ${result.errors.length} formal registry validation error(s):`);
    for (const error of result.errors) {
      console.error(formatFormalRegistryError(error));
    }
  }

  return result.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
