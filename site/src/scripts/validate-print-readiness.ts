import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface PrintReadinessError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface PrintReadinessResult {
  ok: boolean;
  errors: PrintReadinessError[];
}

export interface PrintReadinessOptions {
  siteRoot?: string;
  cssText?: string;
  distRoot?: string;
  skipDistValidation?: boolean;
}

interface CssSignal {
  field: string;
  pattern: RegExp;
  description: string;
  nextStep: string;
}

interface RepresentativePage {
  entryId: string;
  path: string;
  requiredSignals: string[];
}

const cssPath = 'site/src/styles/atlas.css';
const requiredCssSignals: CssSignal[] = [
  {
    field: 'css.@media-print',
    pattern: /@media\s+print\b/u,
    description: 'Missing @media print block',
    nextStep: 'Add print-scoped rules to site/src/styles/atlas.css.',
  },
  {
    field: 'css.@page',
    pattern: /@page\s*\{/u,
    description: 'Missing @page margin rule',
    nextStep: 'Add @page { margin: 0.75in; } inside the print readiness CSS.',
  },
  {
    field: 'css.url-expansion',
    pattern: /a\[href\]::after\s*\{[^}]*attr\(href\)/su,
    description: 'Missing a[href]::after URL expansion',
    nextStep: 'Expose link destinations in print with a[href]::after content using attr(href).',
  },
  {
    field: 'css.hide-book-spine',
    pattern: /\.book-spine-panel[\s\S]*?display\s*:\s*none/u,
    description: 'Missing print rule for .book-spine-panel navigation chrome',
    nextStep: 'Hide .book-spine-panel within @media print without hiding all asides.',
  },
  {
    field: 'css.hide-footer-nav',
    pattern: /\.book-footer-nav[\s\S]*?display\s*:\s*none/u,
    description: 'Missing print rule for .book-footer-nav navigation chrome',
    nextStep: 'Hide .book-footer-nav within @media print.',
  },
  {
    field: 'css.hide-graph-cta',
    pattern: /\.graph-neighborhood__cta[\s\S]*?display\s*:\s*none/u,
    description: 'Missing print rule for .graph-neighborhood__cta navigation chrome',
    nextStep: 'Hide graph CTA controls within @media print while keeping graph context text printable.',
  },
  {
    field: 'css.preserve-source-trail',
    pattern: /\.formal-source-trail[\s\S]*?display\s*:\s*(block|grid)/u,
    description: 'Missing explicit print preservation for .formal-source-trail',
    nextStep: 'Add .formal-source-trail to the print preservation selectors.',
  },
  {
    field: 'css.preserve-formal-block',
    pattern: /\.formal-block[\s\S]*?display\s*:\s*(block|grid)/u,
    description: 'Missing explicit print preservation for .formal-block',
    nextStep: 'Add .formal-block to the print preservation selectors.',
  },
  {
    field: 'css.preserve-citation',
    pattern: /\.formal-citation[\s\S]*?display\s*:\s*(block|grid)/u,
    description: 'Missing explicit print preservation for .formal-citation',
    nextStep: 'Add .formal-citation to the print preservation selectors.',
  },
  {
    field: 'css.preserve-release-readiness',
    pattern: /\.release-readiness__/u,
    description: 'Missing release-readiness print selectors',
    nextStep: 'Keep release-readiness summary and diagnostics visible in print.',
  },
  {
    field: 'css.preserve-coverage-matrix',
    pattern: /\.coverage-matrix__/u,
    description: 'Missing coverage-matrix print selectors',
    nextStep: 'Keep coverage matrix rows and evidence visible in print.',
  },
];

const representativePages: RepresentativePage[] = [
  { entryId: 'home', path: 'index.html', requiredSignals: ['<h1', 'href='] },
  { entryId: 'umbrella', path: 'corpus/umbrella/index.html', requiredSignals: ['formal-source-trail', 'Canonical .tex source', 'Citation'] },
  { entryId: 'formal-registry', path: 'formal-registry/index.html', requiredSignals: ['Browse formal registry', 'Anchor link'] },
  { entryId: 'glossary', path: 'glossary/index.html', requiredSignals: ['Glossary', 'Concept cards'] },
  { entryId: 'reading-paths', path: 'reading-paths/index.html', requiredSignals: ['Reading paths', 'href='] },
  { entryId: 'graph', path: 'graph/index.html', requiredSignals: ['Graph overview', 'graph-neighborhood__cta'] },
  { entryId: 'release-readiness', path: 'release-readiness/index.html', requiredSignals: ['Release readiness', 'coverage-matrix__table', 'Print research handout'] },
];

function defaultSiteRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../..');
}

function addError(
  errors: PrintReadinessError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}

function readAtlasCss(siteRoot: string): string {
  return readFileSync(resolve(siteRoot, 'src/styles/atlas.css'), 'utf8');
}

function printBlocks(cssText: string): string[] {
  const blocks: string[] = [];
  const mediaPattern = /@media\s+print\s*\{/gu;
  let match: RegExpExecArray | null;

  while ((match = mediaPattern.exec(cssText)) !== null) {
    let depth = 1;
    let cursor = mediaPattern.lastIndex;
    while (cursor < cssText.length && depth > 0) {
      const char = cssText[cursor];
      if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
      }
      cursor += 1;
    }
    blocks.push(cssText.slice(match.index, cursor));
  }

  return blocks;
}

function validateCss(cssText: string, errors: PrintReadinessError[]): void {
  const printCss = printBlocks(cssText).join('\n');

  for (const signal of requiredCssSignals) {
    const target = signal.field === 'css.@media-print' ? cssText : printCss;
    if (!signal.pattern.test(target)) {
      addError(errors, 'atlas-css', signal.field, cssPath, signal.description, signal.nextStep);
    }
  }

  if (/\baside\s*\{[^}]*display\s*:\s*none\b/su.test(printCss)) {
    addError(
      errors,
      'atlas-css',
      'css.provenance-visibility',
      cssPath,
      'Print CSS contains broad aside { display: none } that can hide provenance/source trails',
      'Hide explicit navigation selectors such as .book-spine-panel instead of all aside elements.',
    );
  }
}

function validateRepresentativePages(distRoot: string, errors: PrintReadinessError[], skipDistValidation = false): void {
  if (!existsSync(distRoot)) {
    if (!skipDistValidation) {
      addError(
        errors,
        'dist',
        'distRoot',
        'site/dist',
        'Static output directory does not exist',
        'Run bun run build:astro before validating generated accessibility or print readiness.',
      );
    }
    return;
  }

  for (const page of representativePages) {
    const absolutePath = resolve(distRoot, page.path);
    if (!existsSync(absolutePath)) {
      continue;
    }

    const html = readFileSync(absolutePath, 'utf8');
    for (const signal of page.requiredSignals) {
      if (!html.includes(signal)) {
        addError(
          errors,
          page.entryId,
          'page.print-structure',
          `site/dist/${page.path}`,
          `Representative page is missing print-critical signal: ${signal}`,
          'Rebuild the static page with visible titles, source trails, citations, URLs, or coverage structures before publishing.',
        );
      }
    }
  }
}

export function validatePrintReadiness(options: PrintReadinessOptions = {}): PrintReadinessResult {
  const errors: PrintReadinessError[] = [];
  const siteRoot = options.siteRoot ?? defaultSiteRoot();
  const cssText = options.cssText ?? readAtlasCss(siteRoot);
  const distRoot = options.distRoot ?? resolve(siteRoot, 'dist');

  validateCss(cssText, errors);

  validateRepresentativePages(distRoot, errors, options.skipDistValidation);

  return { ok: errors.length === 0, errors };
}

export function formatPrintReadinessError(error: PrintReadinessError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function printPlainResult(result: PrintReadinessResult): void {
  if (result.ok) {
    console.log('OK: print readiness CSS and representative static pages validated, 0 errors found.');
    return;
  }

  console.error(`ERRORS: ${result.errors.length} print readiness validation error(s):`);
  for (const error of result.errors) {
    console.error(formatPrintReadinessError(error));
  }
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validatePrintReadiness();

  if (json) {
    const payload = {
      ok: result.ok,
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
    printPlainResult(result);
  }

  return result.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
