import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { formatPrintReadinessError, validatePrintReadiness } from './validate-print-readiness';

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const requiredPrintSignals = [
  '@media print',
  '@page',
  'a[href]::after',
  '.formal-source-trail',
  '.book-spine-panel',
  '.book-footer-nav',
  '.graph-neighborhood__cta',
  '.formal-block',
  '.formal-citation',
  '.release-readiness__',
];

const completePrintCss = `
@media print {
  @page { margin: 0.75in; }

  html,
  body,
  .atlas-page {
    background: #fff;
    color: #000;
  }

  .book-spine-panel,
  .book-footer-nav,
  .graph-neighborhood__cta,
  .search-panel,
  .route-map {
    display: none !important;
  }

  .formal-source-trail,
  .formal-block,
  .formal-derivation,
  .formal-citation,
  .formal-footnote,
  .formal-bibliography-entry,
  .source-panel,
  .release-readiness__summary,
  .coverage-matrix__table {
    display: block;
  }

  a[href]::after { content: " (" attr(href) ")"; }
}
`;

describe('validatePrintReadiness', () => {
  it('validates the real atlas print contract', () => {
    const result = validatePrintReadiness({ siteRoot });
    const atlasCss = readFileSync(resolve(siteRoot, 'src/styles/atlas.css'), 'utf8');

    for (const signal of requiredPrintSignals) {
      expect(atlasCss).toContain(signal);
    }
    expect(result.errors.map(formatPrintReadinessError)).toEqual([]);
    expect(result).toEqual({ ok: true, errors: [] });
  });

  it('fails when static output is absent', () => {
    const distRoot = resolve(siteRoot, 'dist', 'print-readiness-missing-output');

    const result = validatePrintReadiness({ distRoot, cssText: completePrintCss });

    expect(result.ok).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({
      entryId: 'dist',
      field: 'distRoot',
      path: 'site/dist',
    }));
  });

  it('fails when print media rules are missing', () => {
    const result = validatePrintReadiness({ cssText: '.formal-source-trail { display: block; }', skipDistValidation: true });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entryId: 'atlas-css',
          field: 'css.@media-print',
          path: 'site/src/styles/atlas.css',
          reason: expect.stringContaining('@media print'),
        }),
      ]),
    );
  });

  it('fails when print URL expansion is missing', () => {
    const result = validatePrintReadiness({
      cssText: completePrintCss.replace('a[href]::after { content: " (" attr(href) ")"; }', ''),
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'css.url-expansion',
          path: 'site/src/styles/atlas.css',
          reason: expect.stringContaining('a[href]::after'),
        }),
      ]),
    );
  });

  it('rejects broad print rules that hide provenance asides', () => {
    const result = validatePrintReadiness({
      cssText: completePrintCss.replace(
        '.search-panel,\n  .route-map {',
        '.search-panel,\n  .route-map {\n    display: none !important;\n  }\n\n  aside {',
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'css.provenance-visibility',
          path: 'site/src/styles/atlas.css',
          reason: expect.stringContaining('aside { display: none }'),
        }),
      ]),
    );
  });
});
