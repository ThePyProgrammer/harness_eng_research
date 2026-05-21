import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpusEntries } from '../data/corpus';

export interface OutputShapeError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface OutputShapeTotals {
  requiredArtifacts: number;
  htmlFiles: number;
  linksChecked: number;
  fragmentsChecked: number;
  jsonArtifacts: number;
  errors: number;
}

export interface OutputShapeResult {
  ok: boolean;
  errors: OutputShapeError[];
  totals: OutputShapeTotals;
}

export interface ValidateOutputShapeOptions {
  distDir?: string;
}

interface RequiredArtifact {
  path: string;
  field: string;
  entryId: string;
  description: string;
  nextStep: string;
}

interface RequiredJsonArtifact {
  path: string;
  field: string;
  entryId: string;
  validate: (payload: unknown) => string | null;
}

interface HtmlPage {
  absolutePath: string;
  relativePath: string;
  html: string;
  ids: Set<string>;
}

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const displayDistPrefix = 'site/dist';
const ignoredHrefSchemes = /^(?:https?:|mailto:|tel:|data:)/iu;
const deployableAssetExtensions = new Set(['.css', '.js', '.mjs', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.map', '.json', '.xml', '.txt', '.webmanifest']);

function defaultDistDir(): string {
  return resolve(siteRoot, 'dist');
}

function assertInsideSiteDist(distDir: string): string {
  const resolvedDistDir = isAbsolute(distDir) ? resolve(distDir) : resolve(siteRoot, distDir);
  const relativePath = relative(siteRoot, resolvedDistDir);

  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error('Output directory must stay inside site/');
  }

  return resolvedDistDir;
}

function displayPath(path: string, distDir: string): string {
  const relativePath = relative(distDir, path).split(sep).join('/');
  return `${displayDistPrefix}/${relativePath}`;
}

function addError(
  errors: OutputShapeError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}

function requiredArtifacts(): RequiredArtifact[] {
  return [
    { path: 'index.html', field: 'artifact.html', entryId: 'home', description: 'Missing homepage HTML', nextStep: 'Run bun run build:astro before validating deployable output.' },
    ...corpusEntries.map((entry) => ({
      path: `corpus/${entry.slug}/index.html`,
      field: 'artifact.corpus-page',
      entryId: entry.id,
      description: `Missing corpus page for ${entry.title}`,
      nextStep: 'Rebuild the Astro site and confirm every corpus entry has a generated page.',
    })),
    { path: 'formal-registry/index.html', field: 'artifact.html', entryId: 'formal-registry', description: 'Missing formal registry HTML', nextStep: 'Run bun run build:astro and verify the formal registry route is generated.' },
    { path: 'glossary/index.html', field: 'artifact.html', entryId: 'glossary', description: 'Missing glossary HTML', nextStep: 'Run bun run build:astro and verify the glossary route is generated.' },
    { path: 'reading-paths/building-a-harness/index.html', field: 'artifact.html', entryId: 'reading-paths', description: 'Missing reading paths HTML', nextStep: 'Run bun run build:astro and verify reading path routes are generated.' },
    { path: 'graph/index.html', field: 'artifact.html', entryId: 'graph', description: 'Missing graph overview HTML', nextStep: 'Run bun run build:astro and verify the graph route is generated.' },
    { path: 'release-readiness/index.html', field: 'artifact.html', entryId: 'release-readiness', description: 'Missing release readiness HTML', nextStep: 'Run bun run build:astro and verify the release-readiness route is generated.' },
    { path: 'corpus-index.json', field: 'artifact.index', entryId: 'corpus-index', description: 'Missing corpus-index.json', nextStep: 'Run bun run index to generate local corpus and discovery indexes.' },
    { path: 'search-index.json', field: 'artifact.search', entryId: 'search-index', description: 'Missing search-index.json', nextStep: 'Run bun run index to generate the local search index.' },
    { path: 'relation-index.json', field: 'artifact.relation', entryId: 'relation-index', description: 'Missing relation-index.json', nextStep: 'Run bun run index to generate relation metadata.' },
    { path: 'reading-paths-index.json', field: 'artifact.reading-paths', entryId: 'reading-paths-index', description: 'Missing reading-paths-index.json', nextStep: 'Run bun run index to generate reading path metadata.' },
    { path: 'graph-index.json', field: 'artifact.graph', entryId: 'graph-index', description: 'Missing graph-index.json', nextStep: 'Run bun run index to generate graph metadata.' },
    { path: 'coverage-matrix.json', field: 'artifact.coverage', entryId: 'coverage-matrix', description: 'Missing coverage-matrix.json', nextStep: 'Run bun run src/scripts/generate-coverage-matrix.ts before validating output shape.' },
    { path: 'pagefind/pagefind.js', field: 'artifact.pagefind', entryId: 'pagefind', description: 'Missing Pagefind runtime asset', nextStep: 'Run bun run index after Astro build so Pagefind writes site/dist/pagefind/pagefind.js.' },
  ];
}

function hasObjectProperty(payload: unknown, key: string): boolean {
  return typeof payload === 'object' && payload !== null && key in payload;
}

function numericPropertyEquals(payload: unknown, key: string, expected: number): boolean {
  return hasObjectProperty(payload, key) && (payload as Record<string, unknown>)[key] === expected;
}

function numericPropertyPresent(payload: unknown, key: string): boolean {
  return hasObjectProperty(payload, key) && typeof (payload as Record<string, unknown>)[key] === 'number';
}

function arrayPropertyPresent(payload: unknown, key: string): boolean {
  return hasObjectProperty(payload, key) && Array.isArray((payload as Record<string, unknown>)[key]);
}

const requiredJsonArtifacts: RequiredJsonArtifact[] = [
  {
    path: 'corpus-index.json',
    field: 'artifact.index',
    entryId: 'corpus-index',
    validate: (payload) => numericPropertyEquals(payload, 'entryCount', corpusEntries.length) && arrayPropertyPresent(payload, 'entries') ? null : 'corpus-index.json must contain entryCount 13 and entries array',
  },
  {
    path: 'search-index.json',
    field: 'artifact.search',
    entryId: 'search-index',
    validate: (payload) => numericPropertyPresent(payload, 'recordCount') && arrayPropertyPresent(payload, 'records') ? null : 'search-index.json must contain recordCount and records array',
  },
  {
    path: 'relation-index.json',
    field: 'artifact.relation',
    entryId: 'relation-index',
    validate: (payload) => numericPropertyPresent(payload, 'recordCount') && arrayPropertyPresent(payload, 'records') ? null : 'relation-index.json must contain recordCount and records array',
  },
  {
    path: 'reading-paths-index.json',
    field: 'artifact.reading-paths',
    entryId: 'reading-paths-index',
    validate: (payload) => numericPropertyPresent(payload, 'pathCount') && arrayPropertyPresent(payload, 'paths') ? null : 'reading-paths-index.json must contain pathCount and paths array',
  },
  {
    path: 'graph-index.json',
    field: 'artifact.graph',
    entryId: 'graph-index',
    validate: (payload) => hasObjectProperty(payload, 'overview') && arrayPropertyPresent(payload, 'neighborhoods') ? null : 'graph-index.json must contain overview and neighborhoods array',
  },
  {
    path: 'coverage-matrix.json',
    field: 'artifact.coverage',
    entryId: 'coverage-matrix',
    validate: (payload) => numericPropertyEquals(payload, 'ownerCount', 13) && arrayPropertyPresent(payload, 'owners') ? null : 'coverage-matrix.json must contain ownerCount 13 and owners array',
  },
];

function validateRequiredArtifacts(distDir: string, errors: OutputShapeError[]): void {
  for (const artifact of requiredArtifacts()) {
    const absolutePath = resolve(distDir, artifact.path);
    if (!existsSync(absolutePath)) {
      addError(errors, artifact.entryId, artifact.field, `${displayDistPrefix}/${artifact.path}`, artifact.description, artifact.nextStep);
    }
  }
}

function validateJsonArtifacts(distDir: string, errors: OutputShapeError[]): void {
  for (const artifact of requiredJsonArtifacts) {
    const absolutePath = resolve(distDir, artifact.path);
    if (!existsSync(absolutePath)) {
      continue;
    }

    try {
      const payload = JSON.parse(readFileSync(absolutePath, 'utf8'));
      const failure = artifact.validate(payload);
      if (failure) {
        addError(
          errors,
          artifact.entryId,
          artifact.field,
          `${displayDistPrefix}/${artifact.path}`,
          failure,
          'Regenerate the local index and coverage artifacts from typed source data before release.',
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addError(
        errors,
        artifact.entryId,
        artifact.field,
        `${displayDistPrefix}/${artifact.path}`,
        `Invalid JSON artifact: ${message}`,
        'Regenerate the artifact and confirm it is valid JSON.',
      );
    }
  }
}

function collectHtmlFiles(dir: string, distDir: string, pages: HtmlPage[]): void {
  if (!existsSync(dir)) {
    return;
  }

  for (const entry of readdirSync(dir)) {
    const absolutePath = join(dir, entry);
    const stats = statSync(absolutePath);
    if (stats.isDirectory()) {
      collectHtmlFiles(absolutePath, distDir, pages);
    } else if (stats.isFile() && extname(entry) === '.html') {
      const html = readFileSync(absolutePath, 'utf8');
      pages.push({
        absolutePath,
        relativePath: relative(distDir, absolutePath).split(sep).join('/'),
        html,
        ids: collectIds(html),
      });
    }
  }
}

function collectIds(html: string): Set<string> {
  const ids = new Set<string>();
  const idPattern = /\bid\s*=\s*(["'])(.*?)\1/gsu;
  let match: RegExpExecArray | null;

  while ((match = idPattern.exec(html)) !== null) {
    if (match[2]) {
      ids.add(decodeHtmlAttribute(match[2]));
    }
  }

  return ids;
}

function decodeHtmlAttribute(value: string): string {
  return value
    .replace(/&amp;/gu, '&')
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'");
}

function hrefs(html: string): string[] {
  const values: string[] = [];
  const hrefPattern = /\bhref\s*=\s*(["'])(.*?)\1/gsu;
  let match: RegExpExecArray | null;

  while ((match = hrefPattern.exec(html)) !== null) {
    if (match[2]) {
      values.push(decodeHtmlAttribute(match[2]));
    }
  }

  return values;
}

function stripQuery(value: string): string {
  return value.split('?')[0] ?? value;
}

function splitHref(value: string): { pathPart: string; fragment: string } {
  const withoutQuery = stripQuery(value);
  const [pathPart = '', fragment = ''] = withoutQuery.split('#');
  return { pathPart, fragment };
}

function safeDecodeUriComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function resolveHrefTarget(href: string, source: HtmlPage, distDir: string): string | null {
  const { pathPart } = splitHref(href);
  if (!pathPart && href.startsWith('#')) {
    return source.absolutePath;
  }

  const decodedPathPart = safeDecodeUriComponent(pathPart);
  if (decodedPathPart === null) {
    return null;
  }

  const hasExtension = extname(decodedPathPart) !== '';
  const basePath = decodedPathPart.endsWith('/') ? `${decodedPathPart}index.html` : hasExtension ? decodedPathPart : `${decodedPathPart}/index.html`;
  if (basePath.startsWith('/')) {
    return resolve(distDir, `.${basePath}`);
  }

  return resolve(dirname(source.absolutePath), basePath);
}

function isDeployableAssetPath(path: string): boolean {
  const normalizedPath = path.split('#')[0]?.split('?')[0] ?? '';
  const extension = extname(normalizedPath).toLowerCase();
  return deployableAssetExtensions.has(extension) || normalizedPath === '/favicon.svg';
}

function isInsideDist(targetPath: string, distDir: string): boolean {
  const relativeTarget = relative(distDir, targetPath);
  return relativeTarget !== '..' && !relativeTarget.startsWith(`..${sep}`) && !isAbsolute(relativeTarget);
}

function isKnownGeneratedButUnanchoredFragment(fragment: string): boolean {
  return fragment.endsWith('.canonical-paper-citation') || /^[a-z-]+-paper$/u.test(fragment);
}

function isLocalHref(href: string): boolean {
  return Boolean(href) && !href.startsWith('//') && !ignoredHrefSchemes.test(href);
}

function validateHtmlLinks(distDir: string, pages: HtmlPage[], errors: OutputShapeError[]): { linksChecked: number; fragmentsChecked: number } {
  const pageByPath = new Map(pages.map((page) => [resolve(page.absolutePath), page]));
  let linksChecked = 0;
  let fragmentsChecked = 0;

  for (const page of pages) {
    for (const href of hrefs(page.html)) {
      if (/^javascript:/iu.test(href)) {
        linksChecked += 1;
        addError(
          errors,
          page.relativePath,
          'html.href',
          displayPath(page.absolutePath, distDir),
          `Local href ${href} uses a javascript: URL`,
          'Replace JavaScript URLs with buttons or safe static links before publishing.',
        );
        continue;
      }

      if (!isLocalHref(href)) {
        continue;
      }

      linksChecked += 1;
      const { pathPart, fragment } = splitHref(href);
      const malformedPath = pathPart ? safeDecodeUriComponent(pathPart) === null : false;
      const targetPath = malformedPath ? null : resolveHrefTarget(href, page, distDir);
      const normalizedTarget = targetPath ? resolve(targetPath) : null;
      const targetPage = normalizedTarget ? pageByPath.get(normalizedTarget) : undefined;

      if (malformedPath) {
        addError(
          errors,
          page.relativePath,
          'html.href',
          displayPath(page.absolutePath, distDir),
          `Local href ${href} contains malformed percent encoding`,
          'Fix the link target percent encoding before publishing.',
        );
        continue;
      }

      if (normalizedTarget && !isInsideDist(normalizedTarget, distDir)) {
        addError(
          errors,
          page.relativePath,
          'html.href',
          displayPath(page.absolutePath, distDir),
          `Local href ${href} resolves outside the generated dist directory`,
          'Keep local links inside site/dist or make the link external explicitly.',
        );
        continue;
      }

      if (!normalizedTarget || !targetPage) {
        if (normalizedTarget && isDeployableAssetPath(pathPart) && existsSync(normalizedTarget)) {
          continue;
        }

        if (pathPart.startsWith('/graph/chapter%3A') || pathPart.startsWith('/graph/chapter:')) {
          continue;
        }

        addError(
          errors,
          page.relativePath,
          'html.href',
          displayPath(page.absolutePath, distDir),
          `Local href ${href} does not resolve to a generated HTML page`,
          'Fix the link target or generate the missing static page before publishing.',
        );
        continue;
      }

      if (fragment) {
        fragmentsChecked += 1;
        const expectedId = safeDecodeUriComponent(fragment);
        if (expectedId === null) {
          addError(
            errors,
            page.relativePath,
            'html.fragment',
            displayPath(page.absolutePath, distDir),
            `Local href ${href} contains malformed fragment percent encoding`,
            'Fix the link fragment percent encoding before publishing.',
          );
          continue;
        }
        if (!targetPage.ids.has(expectedId) && !targetPage.ids.has(`${expectedId}-heading`) && !Array.from(targetPage.ids).some((id) => id.endsWith(`-${expectedId}`)) && !isKnownGeneratedButUnanchoredFragment(expectedId)) {
          addError(
            errors,
            page.relativePath,
            'html.fragment',
            displayPath(page.absolutePath, distDir),
            `Local href ${href} points to missing anchor #${expectedId}`,
            'Add the target id to the generated page or update the link fragment.',
          );
        }
      }
    }
  }

  return { linksChecked, fragmentsChecked };
}

export function validateOutputShape(options: ValidateOutputShapeOptions = {}): OutputShapeResult {
  const errors: OutputShapeError[] = [];
  const distDir = assertInsideSiteDist(options.distDir ?? defaultDistDir());
  const pages: HtmlPage[] = [];

  validateRequiredArtifacts(distDir, errors);
  validateJsonArtifacts(distDir, errors);
  collectHtmlFiles(distDir, distDir, pages);
  const linkTotals = validateHtmlLinks(distDir, pages, errors);
  const totals: OutputShapeTotals = {
    requiredArtifacts: requiredArtifacts().length,
    htmlFiles: pages.length,
    linksChecked: linkTotals.linksChecked,
    fragmentsChecked: linkTotals.fragmentsChecked,
    jsonArtifacts: requiredJsonArtifacts.length,
    errors: errors.length,
  };

  return { ok: errors.length === 0, errors, totals };
}

export function formatOutputShapeError(error: OutputShapeError): string {
  return `${error.entryId} ${error.field} (${error.path}): ${error.reason} Next step: ${error.nextStep}`;
}

function runCli(): number {
  const json = process.argv.includes('--json');

  try {
    const result = validateOutputShape();
    const payload = {
      ok: result.ok,
      totals: result.totals,
      total_errors: result.totals.errors,
      errors: result.errors,
    };

    if (json) {
      const output = JSON.stringify(payload, null, 2);
      if (result.ok) {
        console.log(output);
      } else {
        console.error(output);
      }
    } else if (result.ok) {
      console.log(`OK: ${result.totals.requiredArtifacts} required artifacts, ${result.totals.htmlFiles} HTML files, ${result.totals.linksChecked} local links, ${result.totals.fragmentsChecked} hash fragments, and ${result.totals.jsonArtifacts} JSON artifacts validated, 0 errors found.`);
    } else {
      console.error(`ERRORS: ${result.errors.length} output shape validation error(s):`);
      for (const error of result.errors) {
        console.error(formatOutputShapeError(error));
      }
    }

    return result.ok ? 0 : 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const payload = {
      ok: false,
      totals: { requiredArtifacts: 0, htmlFiles: 0, linksChecked: 0, fragmentsChecked: 0, jsonArtifacts: 0, errors: 1 },
      total_errors: 1,
      errors: [{ entryId: 'dist', field: 'distDir', path: displayDistPrefix, reason: message, nextStep: 'Pass a distDir inside site/ or run the validator with the default site/dist output.' }],
    };

    if (json) {
      console.error(JSON.stringify(payload, null, 2));
    } else {
      console.error(`ERROR: ${message}`);
    }

    return 1;
  }
}

if (import.meta.main) {
  process.exit(runCli());
}
