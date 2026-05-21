import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { formatAccessibilitySemanticsError, validateAccessibilitySemantics } from './validate-accessibility-semantics';

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const completeCss = ':focus-visible { outline: 2px solid #7A3E1D; outline-offset: 2px; }';
const completeHtml = `<!doctype html>
<html lang="en">
  <body>
    <main>
      <h1>Release readiness</h1>
      <section aria-labelledby="summary"><h2 id="summary">Summary</h2><p>Passed</p></section>
      <table><thead><tr><th scope="col">Owner</th></tr></thead><tbody><tr><td>Pass</td></tr></tbody></table>
      <ul><li>Thin source support</li><li>Not supported</li></ul>
      <a href="/corpus/umbrella/">Umbrella chapter</a>
      <button>Run Release Check</button>
      <details><summary>Review Coverage Matrix</summary><p>Fail diagnostics</p></details>
    </main>
  </body>
</html>`;

function withDistFixture(run: (distRoot: string) => void): void {
  mkdirSync(join(siteRoot, 'dist'), { recursive: true });
  const distRoot = mkdtempSync(join(siteRoot, 'dist', 'accessibility-semantics-'));
  writePage(distRoot, 'index.html', completeHtml);
  writePage(distRoot, 'release-readiness/index.html', completeHtml);

  try {
    run(distRoot);
  } finally {
    rmSync(distRoot, { recursive: true, force: true });
  }
}

function writePage(distRoot: string, pagePath: string, html: string): void {
  const absolutePath = join(distRoot, pagePath);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, html);
}

describe('validateAccessibilitySemantics', () => {
  it('passes complete representative pages with semantic structure and focus CSS', () => {
    withDistFixture((distRoot) => {
      const result = validateAccessibilitySemantics({ distRoot, cssText: completeCss });

      expect(result).toEqual({ ok: true, errors: [] });
    });
  });

  it('fails missing main landmark with html.semantic-landmark diagnostics', () => {
    withDistFixture((distRoot) => {
      writePage(distRoot, 'index.html', completeHtml.replace('<main>', '<div>').replace('</main>', '</div>'));

      const result = validateAccessibilitySemantics({ distRoot, cssText: completeCss });

      expect(result.ok).toBe(false);
      expect(result.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({
          entryId: 'home',
          field: 'html.semantic-landmark',
          path: 'site/dist/index.html',
        }),
      ]));
      expect(result.errors.map(formatAccessibilitySemanticsError).join('\n')).toContain('main');
    });
  });

  it('fails missing h1 with html.heading diagnostics', () => {
    withDistFixture((distRoot) => {
      writePage(distRoot, 'index.html', completeHtml.replace('<h1>Release readiness</h1>', ''));

      const result = validateAccessibilitySemantics({ distRoot, cssText: completeCss });

      expect(result.ok).toBe(false);
      expect(result.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({
          entryId: 'home',
          field: 'html.heading',
          path: 'site/dist/index.html',
        }),
      ]));
    });
  });

  it('fails color-only status indicators with html.status-text diagnostics', () => {
    withDistFixture((distRoot) => {
      writePage(distRoot, 'index.html', completeHtml.replace('Passed', '').replace('Pass', '').replace('Fail', '').replace('Thin source support', '').replace('Not supported', ''));

      const result = validateAccessibilitySemantics({ distRoot, cssText: completeCss });

      expect(result.ok).toBe(false);
      expect(result.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({
          entryId: 'home',
          field: 'html.status-text',
          path: 'site/dist/index.html',
        }),
      ]));
    });
  });

  it('fails interactive controls without accessible names', () => {
    withDistFixture((distRoot) => {
      writePage(distRoot, 'index.html', completeHtml.replace('<button>Run Release Check</button>', '<button class="icon-only"></button>'));

      const result = validateAccessibilitySemantics({ distRoot, cssText: completeCss });

      expect(result.ok).toBe(false);
      expect(result.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({
          entryId: 'home',
          field: 'html.accessible-name',
          path: 'site/dist/index.html',
          reason: expect.stringContaining('button'),
        }),
      ]));
    });
  });
});
