import { existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildCoverageMatrix, writeAllCoverageArtifacts, writeCoverageMatrix } from './generate-coverage-matrix';

const testSiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

describe('generate-coverage-matrix', () => {
  it('builds umbrella plus twelve-pillar coverage from real registry data', () => {
    const matrix = buildCoverageMatrix();

    expect(matrix.generatedBy).toBe('site/src/scripts/generate-coverage-matrix.ts');
    expect(matrix.ownerCount).toBe(13);
    expect(matrix.owners).toHaveLength(13);
    expect(matrix.owners[0]).toMatchObject({
      ownerId: 'umbrella',
      ownerTitle: 'A Formal Framework for AI Coding Agent Harness Architecture',
      chapterHref: '/corpus/umbrella/',
    });
    expect(new Set(matrix.owners.map((owner) => owner.ownerId))).toEqual(
      new Set([
        'umbrella',
        'abstraction',
        'information',
        'reliability',
        'coordination',
        'temporal',
        'quality',
        'governance',
        'economics',
        'human-interaction',
        'model-routing',
        'security',
        'accretion',
      ]),
    );
  });

  it('reports required chapter, formal, citation, source, derivation, and discovery fields per owner', () => {
    const matrix = buildCoverageMatrix();
    const reliability = matrix.owners.find((owner) => owner.ownerId === 'reliability');

    expect(reliability?.chapterSections.map((section) => section.key)).toEqual([
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
    ]);
    expect(reliability?.chapterSections.every((section) => section.present)).toBe(true);
    expect(reliability?.formalObjectCount).toBeGreaterThan(0);
    expect(reliability?.conceptCount).toBeGreaterThan(0);
    expect(reliability?.citationCount).toBeGreaterThan(0);
    expect(reliability?.sourceTrailCount).toBeGreaterThan(0);
    expect(reliability?.derivationCoverage.label).toBe('Supported');
    expect(reliability?.derivationCoverage.rationale).toContain('pillars/reliability/paper/reliability_architecture.tex');
    expect(reliability?.discoveryPresence).toMatchObject({
      search: true,
      graph: true,
      readingPaths: true,
      relations: true,
    });
    expect(reliability?.diagnostics).toEqual([]);
  });

  it('preserves exact limited derivation labels when source data contains non-full support states', () => {
    const matrix = buildCoverageMatrix({
      derivationCoverageByOwner: {
        reliability: [
          {
            sourcePath: 'pillars/reliability/paper/reliability_architecture.tex',
            status: 'not-supported',
            formalObjectIds: [],
            rationale: 'pillars/reliability/paper/reliability_architecture.tex names reliability risks but does not support this derivation.',
          },
        ],
        security: [
          {
            sourcePath: 'pillars/security/paper/security_architecture.tex',
            status: 'thin-support',
            formalObjectIds: [],
            rationale: 'pillars/security/paper/security_architecture.tex has thin source support for this equation and needs an explicit limitation.',
          },
        ],
      },
    });

    expect(matrix.owners.find((owner) => owner.ownerId === 'reliability')?.derivationCoverage.label).toBe('Not supported by canonical source');
    expect(matrix.owners.find((owner) => owner.ownerId === 'security')?.derivationCoverage.label).toBe('Thin source support');
  });

  it('writes coverage-matrix.json inside site/dist only', () => {
    mkdirSync(join(testSiteRoot, 'dist'), { recursive: true });
    const outputDir = mkdtempSync(join(testSiteRoot, 'dist', 'coverage-matrix-'));

    const outputPath = writeCoverageMatrix({ outputDir });
    const payload = JSON.parse(readFileSync(outputPath, 'utf-8'));

    expect(outputPath.endsWith('coverage-matrix.json')).toBe(true);
    expect(payload.generatedBy).toBe('site/src/scripts/generate-coverage-matrix.ts');
    expect(payload.ownerCount).toBe(13);
    expect(() => writeCoverageMatrix({ outputDir: '../dist' })).toThrow('Output directory must stay inside site/');
  });

  it('writes all coverage artifacts in one bounded invocation', () => {
    mkdirSync(join(testSiteRoot, 'dist'), { recursive: true });
    const outputDir = mkdtempSync(join(testSiteRoot, 'dist', 'coverage-artifacts-'));

    const outputPaths = writeAllCoverageArtifacts({ outputDir });

    expect(outputPaths.map((path) => path.split('/').at(-1))).toEqual(['coverage-matrix.json']);
    expect(existsSync(join(outputDir, 'coverage-matrix.json'))).toBe(true);
  });

  it('keeps release readiness page copy and grid contract static at build time', async () => {
    const source = await Bun.file(new URL('../pages/release-readiness.astro', import.meta.url)).text();

    expect(source).toContain('Release readiness evidence');
    expect(source).toContain('Release readiness');
    expect(source).toContain('Run Release Check');
    expect(source).toContain('Review Coverage Matrix');
    expect(source).toContain('Print research handout');
    expect(source).toContain('Clean-checkout proof');
    expect(source).toContain('Deployable static output');
    expect(source).toContain('No release diagnostics yet');
    expect(source).toContain('Owner');
    expect(source).toContain('Chapter sections');
    expect(source).toContain('Formal objects');
    expect(source).toContain('Concepts');
    expect(source).toContain('Citations');
    expect(source).toContain('Source trails');
    expect(source).toContain('Derivation coverage');
    expect(source).toContain('Discovery/index presence');
    expect(source).toContain('Diagnostics');
    expect(source).toContain('Thin source support — release allowed only with the recorded source-grounded limitation.');
    expect(source).toContain('Not supported by canonical source — do not present as a full derivation.');
    expect(source).toContain("import { buildCoverageMatrix");
    expect(source).toContain("from '../scripts/generate-coverage-matrix'");
    expect(source).not.toContain('fetch(');
  });

  it('adds release readiness and coverage matrix atlas selectors', async () => {
    const css = await Bun.file(new URL('../styles/atlas.css', import.meta.url)).text();

    expect(css).toContain('.release-readiness__');
    expect(css).toContain('.coverage-matrix__');
  });
});
