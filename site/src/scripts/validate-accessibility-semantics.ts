import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface AccessibilitySemanticsError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface AccessibilitySemanticsResult {
  ok: boolean;
  errors: AccessibilitySemanticsError[];
}

export interface AccessibilitySemanticsOptions {
  siteRoot?: string;
  distRoot?: string;
  cssText?: string;
}

interface RepresentativePage {
  entryId: string;
  path: string;
  requireCoverageStructure?: boolean;
}

const representativePages: RepresentativePage[] = [
  { entryId: 'home', path: 'index.html' },
  { entryId: 'umbrella', path: 'corpus/umbrella/index.html' },
  { entryId: 'formal-registry', path: 'formal-registry/index.html' },
  { entryId: 'glossary', path: 'glossary/index.html' },
  { entryId: 'reading-paths', path: 'reading-paths/index.html' },
  { entryId: 'graph', path: 'graph/index.html' },
  { entryId: 'release-readiness', path: 'release-readiness/index.html', requireCoverageStructure: true },
];

const statusLabels = [
  'Passed',
  'Blocked',
  'Pass',
  'Fail',
  'Present',
  'Missing',
  'Thin source support',
  'Not supported',
  'No release diagnostics yet',
];
const displayDistPrefix = 'site/dist';

function defaultSiteRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../..');
}

function addError(
  errors: AccessibilitySemanticsError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/gu, ' ').replace(/\s+/gu, ' ').trim();
}

function hasAttribute(tag: string, attribute: string): boolean {
  return new RegExp(`\\s${attribute}(?:\\s*=|\\s|>)`, 'iu').test(tag);
}

function attributeValue(tag: string, attribute: string): string | null {
  const match = tag.match(new RegExp(`\\s${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'isu'));
  return match?.[2]?.trim() ?? null;
}

function hasAccessibleName(tag: string, visibleText: string): boolean {
  const ariaLabel = attributeValue(tag, 'aria-label');
  const ariaLabelledBy = attributeValue(tag, 'aria-labelledby');

  return visibleText.length > 0 || Boolean(ariaLabel) || Boolean(ariaLabelledBy) || hasAttribute(tag, 'title');
}

function validateFocusCss(cssText: string, errors: AccessibilitySemanticsError[]): void {
  if (!/:focus-visible\s*\{[^}]*outline\s*:/isu.test(cssText)) {
    addError(
      errors,
      'atlas-css',
      'css.focus-visible',
      'site/src/styles/atlas.css',
      'Visible focus CSS must include :focus-visible with an outline',
      'Restore the atlas focus-visible outline rule before publishing.',
    );
  }
}

function validateInteractiveNames(entryId: string, displayPath: string, html: string, errors: AccessibilitySemanticsError[]): void {
  const interactivePattern = /<(a|button|summary)\b([^>]*)>([\s\S]*?)<\/\1>/giu;
  let match: RegExpExecArray | null;

  while ((match = interactivePattern.exec(html)) !== null) {
    const tagName = match[1].toLowerCase();
    const openingTag = `<${match[1]}${match[2]}>`;
    const visibleText = stripTags(match[3]);

    if (tagName === 'a' && !hasAttribute(openingTag, 'href')) {
      continue;
    }

    if (!hasAccessibleName(openingTag, visibleText)) {
      addError(
        errors,
        entryId,
        'html.accessible-name',
        displayPath,
        `Interactive ${tagName} control is missing visible text, aria-label, aria-labelledby, or title`,
        'Add a visible label or aria label that names the control action.',
      );
    }
  }

  const disclosurePattern = /<[^>]+\b(?:role=["']button["']|aria-expanded=)[^>]*>/giu;
  while ((match = disclosurePattern.exec(html)) !== null) {
    const tag = match[0];
    const followingText = stripTags(html.slice(match.index, Math.min(html.length, match.index + 240)));
    if (!hasAccessibleName(tag, followingText)) {
      addError(
        errors,
        entryId,
        'html.accessible-name',
        displayPath,
        'Disclosure-like control is missing visible text, aria-label, aria-labelledby, or title',
        'Add visible disclosure text or an aria label that names the control action.',
      );
    }
  }
}

function validatePage(page: RepresentativePage, distRoot: string, errors: AccessibilitySemanticsError[]): void {
  const absolutePath = resolve(distRoot, page.path);
  if (!existsSync(absolutePath)) {
    return;
  }

  const displayPath = `${displayDistPrefix}/${page.path}`;
  const html = readFileSync(absolutePath, 'utf8');
  const h1Matches = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/giu) ?? [];

  if (!/<main\b/iu.test(html)) {
    addError(errors, page.entryId, 'html.semantic-landmark', displayPath, 'Representative page is missing a semantic main landmark', 'Wrap primary page content in a <main> landmark.');
  }

  if (h1Matches.length < 1 || h1Matches.every((heading) => stripTags(heading).length === 0)) {
    addError(errors, page.entryId, 'html.heading', displayPath, 'Representative page must contain a usable h1 heading', 'Add one visible h1 that names the page.');
  }

  const statusClassMatches = Array.from(html.matchAll(/class=["']([^"']*(?:status|badge|pass|fail|blocked|support)[^"']*)["']/giu));
  const statusClasses = statusClassMatches.map((match) => match[1]).filter((className) => !/source|supporting|curation-status|status-quo/iu.test(className));
  if (statusClasses.length > 0 && !statusLabels.some((label) => html.includes(label))) {
    addError(errors, page.entryId, 'html.status-text', displayPath, 'Status indicators must include visible text labels instead of relying on color or classes alone', 'Render status text such as Passed, Blocked, Pass, Fail, Thin source support, or Not supported.');
  }

  if (page.requireCoverageStructure && !/<table\b/iu.test(html) && !/<ul\b/iu.test(html)) {
    addError(errors, page.entryId, 'html.structure', displayPath, 'Release readiness coverage and diagnostics need semantic table or list structure', 'Render coverage and diagnostic evidence with tables or lists rather than unstructured visual blocks.');
  }

  validateInteractiveNames(page.entryId, displayPath, html, errors);
}

export function validateAccessibilitySemantics(options: AccessibilitySemanticsOptions = {}): AccessibilitySemanticsResult {
  const errors: AccessibilitySemanticsError[] = [];
  const siteRoot = options.siteRoot ?? defaultSiteRoot();
  const distRoot = options.distRoot ?? resolve(siteRoot, 'dist');
  const cssText = options.cssText ?? readFileSync(resolve(siteRoot, 'src/styles/atlas.css'), 'utf8');

  validateFocusCss(cssText, errors);

  if (existsSync(distRoot)) {
    for (const page of representativePages) {
      validatePage(page, distRoot, errors);
    }
  }

  return { ok: errors.length === 0, errors };
}

export function formatAccessibilitySemanticsError(error: AccessibilitySemanticsError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function printPlainResult(result: AccessibilitySemanticsResult): void {
  if (result.ok) {
    console.log('OK: accessibility semantics validated, 0 errors found.');
    return;
  }

  console.error(`ERRORS: ${result.errors.length} accessibility/semantics validation error(s):`);
  for (const error of result.errors) {
    console.error(formatAccessibilitySemanticsError(error));
  }
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validateAccessibilitySemantics();

  if (json) {
    const output = JSON.stringify({ ok: result.ok, total_errors: result.errors.length, errors: result.errors }, null, 2);
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
