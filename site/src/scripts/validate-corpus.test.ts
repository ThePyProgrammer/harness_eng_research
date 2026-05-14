import { describe, expect, it } from 'vitest';
import { corpusEntries } from '../data/corpus';
import type { CorpusEntry } from '../data/corpus.schema';
import { formatValidationError, validateCorpus } from './validate-corpus';

function cloneEntries(): CorpusEntry[] {
  return structuredClone(corpusEntries);
}

describe('validateCorpus', () => {
  it('validates the real corpus inventory', () => {
    const result = validateCorpus();

    expect(result).toEqual({ ok: true, errors: [] });
  });

  it('fails when a required corpus entry is missing', () => {
    const entries = cloneEntries().filter((entry) => entry.id !== 'security');

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'security',
          field: 'id',
          path: 'security',
          reason: expect.stringContaining('Missing required corpus entry'),
        }),
      ]),
    );
  });

  it('fails with the exact archive-as-canonical diagnostic', () => {
    const entries = cloneEntries().map((entry) =>
      entry.id === 'security'
        ? {
            ...entry,
            canonicalTex: 'pillars/security/archive/security_architecture.tex',
            sourceStatus: 'canonical' as const,
          }
        : entry,
    );

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatValidationError)).toContain(
      'Entry security: canonicalTex points to pillars/security/archive/security_architecture.tex. Archive paths cannot be canonical sources. Move the reference to pillars/security/paper/.',
    );
  });

  it('fails when a required canonical source path is missing', () => {
    const entries = cloneEntries().map((entry) =>
      entry.id === 'umbrella'
        ? { ...entry, canonicalTex: 'science/paper/does-not-exist.tex' }
        : entry,
    );

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors.map(formatValidationError)).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'Entry umbrella: canonicalTex points to science/paper/does-not-exist.tex.',
        ),
      ]),
    );
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'umbrella',
          field: 'canonicalTex',
          path: 'science/paper/does-not-exist.tex',
        }),
      ]),
    );
  });

  it('fails when canonical fields point outside the owning paper directory', () => {
    const entries = cloneEntries().map((entry) => {
      if (entry.id === 'umbrella') {
        return { ...entry, canonicalTex: 'README.md' };
      }

      if (entry.id === 'security') {
        return { ...entry, canonicalTex: 'pillars/security/notes/security_architecture.tex' };
      }

      return entry;
    });

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'umbrella',
          field: 'canonicalTex',
          reason: 'Path must point into the canonical paper directory',
        }),
        expect.objectContaining({
          entryId: 'security',
          field: 'canonicalTex',
          reason: 'Path must point into the canonical paper directory',
        }),
      ]),
    );
  });

  it('fails when provenance-only entries use archive paths in canonical fields', () => {
    const entries = cloneEntries().map((entry) =>
      entry.id === 'security'
        ? {
            ...entry,
            canonicalTex: 'pillars/security/archive/security_architecture.tex',
            sourceStatus: 'provenance-only' as const,
          }
        : entry,
    );

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'security',
          field: 'canonicalTex',
          reason: 'Archive paths cannot be canonical sources',
        }),
      ]),
    );
  });

  it('fails for absolute paths and parent traversal segments', () => {
    const entries = cloneEntries().map((entry) => {
      if (entry.id === 'umbrella') {
        return { ...entry, canonicalTex: '/science/paper/science.tex' };
      }

      if (entry.id === 'security') {
        return { ...entry, canonicalTex: '../pillars/security/paper/security_architecture.tex' };
      }

      return entry;
    });

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'umbrella',
          field: 'canonicalTex',
          reason: 'Path must be project-root-relative',
        }),
        expect.objectContaining({
          entryId: 'security',
          field: 'canonicalTex',
          reason: 'Path cannot contain parent traversal',
        }),
      ]),
    );
  });

  it('collects all validation errors for invalid fixtures', () => {
    const entries = cloneEntries().map((entry) => {
      if (entry.id === 'umbrella') {
        return { ...entry, canonicalTex: 'science/paper/does-not-exist.tex' };
      }

      if (entry.id === 'security') {
        return {
          ...entry,
          canonicalTex: 'pillars/security/archive/security_architecture.tex',
          sourceStatus: 'canonical' as const,
        };
      }

      return entry;
    });

    const result = validateCorpus(entries);

    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'umbrella',
          reason: 'Required canonical source path does not exist',
        }),
        expect.objectContaining({
          entryId: 'security',
          reason: 'Archive paths cannot be canonical sources',
        }),
      ]),
    );
  });
});
