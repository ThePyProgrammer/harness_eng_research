import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpusEntries } from '../data/corpus';
import { formalRegistry } from '../data/formal-registry';
import type { OwnerId } from '../data/formal-registry.schema';

export interface MathFixture {
  id: string;
  ownerId: OwnerId;
  sourcePath: string;
  snippet: string;
  formalObjectId: string;
  renderedHref?: string;
  requireRendered?: boolean;
}

export interface MathFixtureError {
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface MathFixtureValidationResult {
  ok: boolean;
  errors: MathFixtureError[];
  fixtures: MathFixture[];
}

interface MathFixtureValidationInput {
  fixtures?: MathFixture[];
}

interface MathFixtureValidationOptions {
  repoRoot?: string;
}

const defaultFixtures: MathFixture[] = [
  {
    id: 'umbrella.harness-axis-source',
    ownerId: 'umbrella',
    sourcePath: 'science/paper/science.tex',
    snippet: 'The framework is organized into eleven pillars across five axes:',
    formalObjectId: 'umbrella.harness-axis-equation',
    renderedHref: '/corpus/umbrella/#umbrella.harness-axis-equation',
  },
  {
    id: 'reliability.compound-error-source',
    ownerId: 'reliability',
    sourcePath: 'pillars/reliability/paper/reliability_architecture.tex',
    snippet: 'per-step success rates compound multiplicatively, producing exponential decay in end-to-end reliability',
    formalObjectId: 'reliability.pipeline-reliability-equation',
    renderedHref: '/corpus/reliability/#reliability.pipeline-reliability-equation',
  },
  {
    id: 'information.context-selection-source',
    ownerId: 'information',
    sourcePath: 'pillars/information/paper/information_architecture.tex',
    snippet: 'context selection under degradation',
    formalObjectId: 'information.context-loss-equation',
    renderedHref: '/corpus/information/#information.context-loss-equation',
  },
  {
    id: 'coordination.quality-adjusted-speedup-source',
    ownerId: 'coordination',
    sourcePath: 'pillars/coordination/paper/coordination_architecture.tex',
    snippet: 'Quality-Adjusted Speedup (QAS) metric',
    formalObjectId: 'coordination.speedup-adjustment-equation',
    renderedHref: '/corpus/coordination/#coordination.speedup-adjustment-equation',
  },
  {
    id: 'economics.cvih-source',
    ownerId: 'economics',
    sourcePath: 'pillars/economics/paper/economics_architecture.tex',
    snippet: 'The CVIH metric',
    formalObjectId: 'economics.cvih-equation',
    renderedHref: '/corpus/economics/#economics.cvih-equation',
  },
  {
    id: 'security.structural-enforcement-source',
    ownerId: 'security',
    sourcePath: 'pillars/security/paper/security_architecture.tex',
    snippet: 'prompt-based security compliance decays as $(1-\\epsilon)^T$',
    formalObjectId: 'security.attack-surface-equation',
    renderedHref: '/corpus/security/#security.attack-surface-equation',
  },
];

function defaultRepoRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
}

function siteRoot(repoRoot: string): string {
  return resolve(repoRoot, 'site');
}

function hasParentTraversal(pathValue: string): boolean {
  return pathValue.split(/[\\/]+/).includes('..');
}

function addError(
  errors: MathFixtureError[],
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  errors.push({ entryId, field, path, reason, nextStep });
}

function resolveRepositoryPath(sourcePath: string, repoRoot: string): string | null {
  if (isAbsolute(sourcePath) || hasParentTraversal(sourcePath)) {
    return null;
  }

  const resolvedPath = resolve(repoRoot, sourcePath.split('/').join(sep));
  const repoRelative = relative(repoRoot, resolvedPath);
  if (repoRelative === '..' || repoRelative.startsWith(`..${sep}`) || isAbsolute(repoRelative)) {
    return null;
  }

  return resolvedPath;
}

function expectedCanonicalSource(ownerId: OwnerId): string | undefined {
  return corpusEntries.find((entry) => entry.id === ownerId)?.canonicalTex;
}

function renderedTarget(renderedHref: string, root: string): { htmlPath: string; anchor: string } {
  const [hrefPath, anchor = ''] = renderedHref.split('#');
  const normalizedPath = hrefPath.replace(/^\//, '');
  const htmlPath = normalizedPath.endsWith('.html')
    ? resolve(siteRoot(root), 'dist', normalizedPath)
    : resolve(siteRoot(root), 'dist', normalizedPath, 'index.html');

  return { htmlPath, anchor };
}

function containsAnchor(html: string, anchor: string): boolean {
  if (!anchor) {
    return true;
  }

  const escapedAnchor = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\sid=["']${escapedAnchor}["']`).test(html);
}

function validateSourcePath(fixture: MathFixture, repoRoot: string, errors: MathFixtureError[]): string | null {
  if (isAbsolute(fixture.sourcePath)) {
    addError(errors, fixture.id, 'sourcePath', fixture.sourcePath, 'Path must be project-root-relative', 'Replace the absolute path with a repository-relative path.');
    return null;
  }

  if (hasParentTraversal(fixture.sourcePath)) {
    addError(errors, fixture.id, 'sourcePath', fixture.sourcePath, 'Path cannot contain parent traversal', 'Use a canonical source path inside science/paper/ or pillars/<owner>/paper/.');
    return null;
  }

  const resolvedPath = resolveRepositoryPath(fixture.sourcePath, repoRoot);
  if (!resolvedPath) {
    addError(errors, fixture.id, 'sourcePath', fixture.sourcePath, 'Path must stay inside the repository', 'Use a checked repository-relative canonical source path.');
    return null;
  }

  const expectedSource = expectedCanonicalSource(fixture.ownerId);
  if (expectedSource && fixture.sourcePath !== expectedSource) {
    addError(errors, fixture.id, 'sourcePath', fixture.sourcePath, 'Fixture source path does not match owner canonical paper', `Use ${expectedSource} for owner ${fixture.ownerId}.`);
  }

  if (!existsSync(resolvedPath)) {
    addError(errors, fixture.id, 'sourcePath', fixture.sourcePath, 'Required source path does not exist', 'Restore the canonical source file or update the fixture sourcePath.');
    return null;
  }

  return resolvedPath;
}

function validateSnippet(fixture: MathFixture, resolvedPath: string, errors: MathFixtureError[]): void {
  const source = readFileSync(resolvedPath, 'utf8');
  if (!source.includes(fixture.snippet)) {
    addError(errors, fixture.id, 'snippet', fixture.sourcePath, 'Expected snippet was not found in canonical source', 'Update the fixture to a current canonical snippet or restore the source claim before publishing.');
  }
}

function validateFormalObject(fixture: MathFixture, errors: MathFixtureError[]): void {
  const object = formalRegistry.find((entry) => entry.id === fixture.formalObjectId);
  if (!object) {
    addError(errors, fixture.id, 'formalObjectId', fixture.formalObjectId, 'Formal registry object does not exist', 'Add the formal object to formalRegistry or update the fixture formalObjectId.');
    return;
  }

  if (object.ownerId !== fixture.ownerId) {
    addError(errors, fixture.id, 'formalObjectId', fixture.formalObjectId, 'Formal registry object owner does not match fixture owner', 'Use a formal object owned by the same canonical source owner.');
  }
}

function validateRenderedAnchor(fixture: MathFixture, repoRoot: string, errors: MathFixtureError[]): void {
  const distPath = resolve(siteRoot(repoRoot), 'dist');
  if (!fixture.renderedHref) {
    if (fixture.requireRendered) {
      addError(errors, fixture.id, 'renderedHref', fixture.id, 'Rendered anchor is required but no href was provided', 'Add renderedHref for fixtures that require built output validation.');
    }
    return;
  }

  if (!existsSync(distPath) && !fixture.requireRendered) {
    return;
  }

  const { htmlPath, anchor } = renderedTarget(fixture.renderedHref, repoRoot);
  if (!existsSync(htmlPath)) {
    addError(errors, fixture.id, 'renderedHref', fixture.renderedHref, 'Rendered HTML target does not exist', 'Run the static site build or update renderedHref to the page containing the formal object anchor.');
    return;
  }

  const html = readFileSync(htmlPath, 'utf8');
  if (!containsAnchor(html, anchor)) {
    addError(errors, fixture.id, 'renderedHref', fixture.renderedHref, 'Rendered anchor target does not exist', 'Ensure the formal object renders with a stable id matching the fixture anchor.');
  }
}

export function validateMathFixtures(
  input: MathFixtureValidationInput = {},
  options: MathFixtureValidationOptions = {},
): MathFixtureValidationResult {
  const errors: MathFixtureError[] = [];
  const fixtures = input.fixtures ?? defaultFixtures;
  const repoRoot = options.repoRoot ?? defaultRepoRoot();

  for (const fixture of fixtures) {
    const resolvedPath = validateSourcePath(fixture, repoRoot, errors);
    if (resolvedPath) {
      validateSnippet(fixture, resolvedPath, errors);
    }
    validateFormalObject(fixture, errors);
    validateRenderedAnchor(fixture, repoRoot, errors);
  }

  return { ok: errors.length === 0, errors, fixtures };
}

export function formatMathFixtureError(error: MathFixtureError): string {
  return `Entry ${error.entryId}: ${error.field} points to ${error.path}. ${error.reason}. ${error.nextStep}.`;
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = validateMathFixtures();

  if (json) {
    const payload = {
      ok: result.ok,
      total_fixtures: result.fixtures.length,
      total_errors: result.errors.length,
      fixtures: result.fixtures,
      errors: result.errors,
    };
    const output = JSON.stringify(payload, null, 2);
    if (result.ok) {
      console.log(output);
    } else {
      console.error(output);
    }
  } else if (result.ok) {
    console.log(`OK: ${result.fixtures.length} math fixtures validated, 0 errors found.`);
  } else {
    console.error(`ERRORS: ${result.errors.length} math fixture validation error(s):`);
    for (const error of result.errors) {
      console.error(formatMathFixtureError(error));
    }
  }

  return result.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
