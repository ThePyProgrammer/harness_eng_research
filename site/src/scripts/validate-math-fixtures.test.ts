import { describe, expect, it } from 'vitest';
import { formatMathFixtureError, validateMathFixtures, type MathFixture } from './validate-math-fixtures';

const umbrellaFixture: MathFixture = {
  id: 'test.umbrella-missing-snippet',
  ownerId: 'umbrella',
  sourcePath: 'science/paper/science.tex',
  snippet: 'This exact snippet should not exist in the canonical umbrella paper.',
  formalObjectId: 'umbrella.harness-architecture',
};

describe('validateMathFixtures', () => {
  it('validates real umbrella and representative pillar fixtures', () => {
    const result = validateMathFixtures();

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.fixtures.map((fixture) => fixture.ownerId)).toEqual(
      expect.arrayContaining(['umbrella', 'reliability', 'information', 'coordination', 'economics', 'security']),
    );
  });

  it('fails a missing canonical snippet with an actionable snippet diagnostic', () => {
    const result = validateMathFixtures({ fixtures: [umbrellaFixture] });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'test.umbrella-missing-snippet',
          field: 'snippet',
          path: 'science/paper/science.tex',
        }),
      ]),
    );
    expect(result.errors.map(formatMathFixtureError)).toEqual(
      expect.arrayContaining([expect.stringContaining('Expected snippet was not found in canonical source')]),
    );
  });

  it('fails an unknown formal registry object id', () => {
    const result = validateMathFixtures({
      fixtures: [{ ...umbrellaFixture, id: 'test.unknown-formal-object', snippet: '\\title{A Formal Framework for AI Coding Agent Harness Architecture}', formalObjectId: 'umbrella.not-a-real-object' }],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'test.unknown-formal-object',
          field: 'formalObjectId',
          path: 'umbrella.not-a-real-object',
        }),
      ]),
    );
  });

  it('rejects parent traversal source paths before reading files', () => {
    const result = validateMathFixtures({
      fixtures: [{ ...umbrellaFixture, id: 'test.parent-traversal', sourcePath: '../science/paper/science.tex' }],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'test.parent-traversal',
          field: 'sourcePath',
          path: '../science/paper/science.tex',
          reason: 'Path cannot contain parent traversal',
        }),
      ]),
    );
  });
});
