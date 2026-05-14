import type { CorpusEntry } from '../data/corpus.schema';

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

export function validateCorpus(entries?: CorpusEntry[], options?: { repoRoot?: string }): ValidationResult {
  void entries;
  void options;

  return { ok: true, errors: [] };
}

export function formatValidationError(error: ValidationError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}
