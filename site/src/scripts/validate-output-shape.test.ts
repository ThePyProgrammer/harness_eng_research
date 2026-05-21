import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { corpusEntries } from '../data/corpus';
import { validateOutputShape, formatOutputShapeError } from './validate-output-shape';

const testSiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function writeJson(path: string, payload: unknown): void {
  writeFileSync(path, JSON.stringify(payload, null, 2));
}

function writeHtml(path: string, body = ''): void {
  writeFileSync(path, `<!doctype html><html><head><title>Fixture</title></head><body><main id="top">${body}</main></body></html>`);
}

function createCompleteDistFixture(): string {
  mkdirSync(join(testSiteRoot, 'dist'), { recursive: true });
  const distDir = mkdtempSync(join(testSiteRoot, 'dist', 'output-shape-'));

  writeHtml(join(distDir, 'index.html'), '<a href="/corpus/umbrella/">Umbrella</a>');
  for (const entry of corpusEntries) {
    const pageDir = join(distDir, 'corpus', entry.slug);
    mkdirSync(pageDir, { recursive: true });
    writeHtml(join(pageDir, 'index.html'), `<section id="${entry.id}.fixture-anchor"><a href="/glossary/">Glossary</a></section>`);
  }

  for (const route of ['formal-registry', 'glossary', 'reading-paths', 'reading-paths/building-a-harness', 'graph', 'release-readiness']) {
    const pageDir = join(distDir, route);
    mkdirSync(pageDir, { recursive: true });
    writeHtml(join(pageDir, 'index.html'), `<section id="${route}-anchor"><a href="/">Home</a></section>`);
  }

  writeJson(join(distDir, 'corpus-index.json'), { generatedBy: 'fixture', entryCount: corpusEntries.length, entries: corpusEntries });
  writeJson(join(distDir, 'search-index.json'), { generatedBy: 'fixture', recordCount: 1, records: [{ href: '/corpus/umbrella/' }] });
  writeJson(join(distDir, 'relation-index.json'), { generatedBy: 'fixture', typeCount: 1, recordCount: 1, types: [], records: [] });
  writeJson(join(distDir, 'reading-paths-index.json'), { generatedBy: 'fixture', pathCount: 1, paths: [] });
  writeJson(join(distDir, 'graph-index.json'), { generatedBy: 'fixture', overview: { nodes: [], edges: [] }, neighborhoods: [] });
  writeJson(join(distDir, 'coverage-matrix.json'), { generatedBy: 'fixture', ownerCount: 13, owners: [], diagnostics: [] });
  mkdirSync(join(distDir, 'pagefind'), { recursive: true });
  writeFileSync(join(distDir, 'pagefind', 'pagefind.js'), 'export default {};');

  return distDir;
}

function withFixture(run: (distDir: string) => void): void {
  const distDir = createCompleteDistFixture();
  try {
    run(distDir);
  } finally {
    rmSync(distDir, { recursive: true, force: true });
  }
}

describe('validate-output-shape', () => {
  it('passes a complete deployable dist fixture with pages, indexes, coverage JSON, and Pagefind', () => {
    withFixture((distDir) => {
      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.totals.requiredArtifacts).toBeGreaterThanOrEqual(20);
      expect(result.totals.htmlFiles).toBeGreaterThanOrEqual(18);
    });
  });

  it('fails missing coverage-matrix.json with artifact.coverage diagnostics', () => {
    withFixture((distDir) => {
      rmSync(join(distDir, 'coverage-matrix.json'));

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        field: 'artifact.coverage',
        path: 'site/dist/coverage-matrix.json',
      }));
      expect(formatOutputShapeError(result.errors[0])).toContain(result.errors[0].nextStep);
    });
  });

  it('fails missing pagefind/pagefind.js with artifact.pagefind diagnostics', () => {
    withFixture((distDir) => {
      rmSync(join(distDir, 'pagefind', 'pagefind.js'));

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        field: 'artifact.pagefind',
        path: 'site/dist/pagefind/pagefind.js',
      }));
    });
  });

  it('fails a local href pointing at a missing generated page', () => {
    withFixture((distDir) => {
      writeHtml(join(distDir, 'index.html'), '<a href="/missing-page/">Broken local page</a>');

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        entryId: 'index.html',
        field: 'html.href',
        path: 'site/dist/index.html',
      }));
    });
  });

  it('fails a local href pointing at a missing deployable asset', () => {
    withFixture((distDir) => {
      writeHtml(join(distDir, 'index.html'), '<a href="/missing.css">Missing CSS</a>');

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        entryId: 'index.html',
        field: 'html.href',
        path: 'site/dist/index.html',
      }));
    });
  });

  it('accepts extensionless local route hrefs with generated index pages', () => {
    withFixture((distDir) => {
      writeHtml(join(distDir, 'index.html'), '<a href="/glossary">Glossary</a>');

      const result = validateOutputShape({ distDir });

      expect(result.errors).not.toContainEqual(expect.objectContaining({
        entryId: 'index.html',
        field: 'html.href',
        reason: expect.stringContaining('/glossary'),
      }));
    });
  });

  it('fails a local hash link pointing at a missing target anchor', () => {
    withFixture((distDir) => {
      writeHtml(join(distDir, 'index.html'), '<a href="/corpus/umbrella/#missing-anchor">Broken anchor</a>');

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        entryId: 'index.html',
        field: 'html.fragment',
        path: 'site/dist/index.html',
      }));
    });
  });

  it('fails a same-page hash link pointing at a missing target anchor', () => {
    withFixture((distDir) => {
      writeHtml(join(distDir, 'index.html'), '<a href="#not-present">Broken same-page anchor</a>');

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        entryId: 'index.html',
        field: 'html.fragment',
        path: 'site/dist/index.html',
      }));
    });
  });

  it('reports malformed percent-encoded href paths as structured diagnostics', () => {
    withFixture((distDir) => {
      writeHtml(join(distDir, 'index.html'), '<a href="/%E0%A4%A">Malformed path</a>');

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        entryId: 'index.html',
        field: 'html.href',
        path: 'site/dist/index.html',
      }));
    });
  });

  it('reports malformed percent-encoded fragments as structured diagnostics', () => {
    withFixture((distDir) => {
      writeHtml(join(distDir, 'index.html'), '<a href="#%E0%A4%A">Malformed fragment</a>');

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        entryId: 'index.html',
        field: 'html.fragment',
        path: 'site/dist/index.html',
      }));
    });
  });

  it('accepts existing deployable assets referenced from local hrefs', () => {
    withFixture((distDir) => {
      writeFileSync(join(distDir, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"></svg>');
      writeHtml(join(distDir, 'index.html'), '<a href="/favicon.svg">Favicon</a>');

      const result = validateOutputShape({ distDir });

      expect(result.errors).not.toContainEqual(expect.objectContaining({
        field: 'html.href',
        reason: expect.stringContaining('/favicon.svg'),
      }));
    });
  });

  it('fails local hrefs that resolve outside the generated dist directory', () => {
    withFixture((distDir) => {
      writeHtml(join(distDir, 'index.html'), '<a href="/../package.json">Escaped package file</a>');

      const result = validateOutputShape({ distDir });

      expect(result.ok).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        entryId: 'index.html',
        field: 'html.href',
        path: 'site/dist/index.html',
        reason: expect.stringContaining('outside the generated dist directory'),
      }));
    });
  });
});
