import { existsSync } from 'node:fs';
import { dirname, isAbsolute, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpusEntries } from '../data/corpus';
import { expectedCorpusIds, parseCorpusEntries, type CorpusEntry } from '../data/corpus.schema';

export interface ValidationError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}

type PathField = 'canonicalTex' | 'canonicalPdf' | 'bibliography';

const pathFields = ['canonicalTex', 'canonicalPdf', 'bibliography'] as const;
const archivePathPattern = /(^|\/)archive(\/|$)/;
const extensionByField: Record<PathField, string> = {
  canonicalTex: '.tex',
  canonicalPdf: '.pdf',
  bibliography: '.bib',
};

function defaultRepoRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
}

function hasParentTraversal(pathValue: string): boolean {
  return pathValue.split(/[\\/]+/).includes('..');
}

function addError(
  errors: ValidationError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}

function archiveNextStep(entry: CorpusEntry): string {
  if (entry.id === 'security') {
    return 'Move the reference to pillars/security/paper/';
  }

  return 'Move the reference to the owning paper/ directory';
}

function canonicalPaperNextStep(entry: CorpusEntry): string {
  if (entry.kind === 'umbrella') {
    return 'Use science/paper/ for umbrella canonical paths';
  }

  return `Use pillars/${entry.id}/paper/ for ${entry.id} canonical paths`;
}

function isCanonicalPaperPath(entry: CorpusEntry, pathValue: string): boolean {
  if (entry.kind === 'umbrella') {
    return pathValue.startsWith('science/paper/');
  }

  return pathValue.startsWith(`pillars/${entry.id}/paper/`);
}

function validateExpectedIds(entries: CorpusEntry[], errors: ValidationError[]): void {
  const ids = new Map<string, number>();

  for (const entry of entries) {
    ids.set(entry.id, (ids.get(entry.id) ?? 0) + 1);
  }

  for (const expectedId of expectedCorpusIds) {
    if (!ids.has(expectedId)) {
      addError(
        errors,
        expectedId,
        'id',
        expectedId,
        'Missing required corpus entry',
        'Add the entry to site/src/data/corpus.ts with canonical source metadata',
      );
    }
  }

  for (const [id, count] of ids.entries()) {
    if (count > 1) {
      addError(
        errors,
        id,
        'id',
        id,
        'Duplicate corpus entry id',
        'Keep exactly one inventory entry for each expected corpus id',
      );
    }
  }
}

function validatePathField(
  entry: CorpusEntry,
  field: PathField,
  repoRoot: string,
  errors: ValidationError[],
): void {
  const pathValue = entry[field];

  if (!pathValue) {
    return;
  }

  if (isAbsolute(pathValue)) {
    addError(
      errors,
      entry.id,
      field,
      pathValue,
      'Path must be project-root-relative',
      'Replace the absolute path with a path relative to the repository root',
    );
    return;
  }

  if (hasParentTraversal(pathValue)) {
    addError(
      errors,
      entry.id,
      field,
      pathValue,
      'Path cannot contain parent traversal',
      'Use a canonical path inside science/paper/ or pillars/*/paper/',
    );
    return;
  }

  const isProvenanceArchive = entry.sourceStatus === 'provenance-only' && archivePathPattern.test(pathValue);

  if (!isProvenanceArchive && !isCanonicalPaperPath(entry, pathValue)) {
    addError(
      errors,
      entry.id,
      field,
      pathValue,
      'Path must point into the canonical paper directory',
      canonicalPaperNextStep(entry),
    );
  }

  if (!isProvenanceArchive && archivePathPattern.test(pathValue)) {
    addError(
      errors,
      entry.id,
      field,
      pathValue,
      'Archive paths cannot be canonical sources',
      archiveNextStep(entry),
    );
  }

  const requiredExtension = extensionByField[field];
  if (!pathValue.endsWith(requiredExtension)) {
    addError(
      errors,
      entry.id,
      field,
      pathValue,
      `Path must point to a ${requiredExtension} file`,
      `Update ${field} to reference the canonical ${requiredExtension} artifact`,
    );
  }

  const resolvedPath = resolve(repoRoot, pathValue.split('/').join(sep));
  if (!existsSync(resolvedPath)) {
    addError(
      errors,
      entry.id,
      field,
      pathValue,
      'Required canonical source path does not exist',
      'Restore the file or update the inventory to the canonical paper path',
    );
  }
}

export function validateCorpus(
  entries: CorpusEntry[] = corpusEntries,
  options: { repoRoot?: string } = {},
): ValidationResult {
  const errors: ValidationError[] = [];
  const repoRoot = options.repoRoot ?? defaultRepoRoot();

  let parsedEntries: CorpusEntry[];
  try {
    parsedEntries = parseCorpusEntries(entries);
  } catch (error) {
    addError(
      errors,
      'corpus',
      'schema',
      'site/src/data/corpus.ts',
      error instanceof Error ? error.message : 'Corpus entries failed schema validation',
      'Fix the inventory shape so it matches corpus.schema.ts',
    );
    return { ok: false, errors };
  }

  validateExpectedIds(parsedEntries, errors);

  for (const entry of parsedEntries) {
    for (const field of pathFields) {
      validatePathField(entry, field, repoRoot, errors);
    }
  }

  return { ok: errors.length === 0, errors };
}

export function formatValidationError(error: ValidationError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function printPlainResult(result: ValidationResult, entryCount: number): void {
  if (result.ok) {
    console.log(`OK: ${entryCount} corpus entries validated, 0 errors found.`);
    return;
  }

  console.error(`ERRORS: ${result.errors.length} corpus validation error(s):`);
  for (const error of result.errors) {
    console.error(formatValidationError(error));
  }
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validateCorpus();

  if (json) {
    const payload = {
      ok: result.ok,
      total_entries: corpusEntries.length,
      total_errors: result.errors.length,
      errors: result.errors,
    };
    const output = JSON.stringify(payload, null, 2);
    if (result.ok) {
      console.log(output);
    } else {
      console.error(output);
    }
  } else {
    printPlainResult(result, corpusEntries.length);
  }

  return result.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
