import { spawnSync } from 'node:child_process';
import { validateCorpus, type ValidationError, type ValidationResult } from './validate-corpus';
import { validateDiscovery, type DiscoveryValidationError, type DiscoveryValidationResult } from './validate-discovery';
import { validateFormalRegistry, type FormalRegistryValidationError, type FormalRegistryValidationResult } from './validate-formal-registry';
import { validateMathFixtures, type MathFixtureError, type MathFixtureValidationResult } from './validate-math-fixtures';
import { writeCoverageMatrix, buildCoverageMatrix, type CoverageDiagnostic, type CoverageMatrix } from './generate-coverage-matrix';
import { validateAccessibilitySemantics, type AccessibilitySemanticsError, type AccessibilitySemanticsResult } from './validate-accessibility-semantics';
import { validatePrintReadiness, type PrintReadinessError, type PrintReadinessResult } from './validate-print-readiness';
import { validateOutputShape, type OutputShapeError, type OutputShapeResult } from './validate-output-shape';

export type ReleaseGateName =
  | 'corpus'
  | 'formal-registry'
  | 'discovery'
  | 'math-fixtures'
  | 'astro-check'
  | 'vitest'
  | 'astro-build'
  | 'local-indexes'
  | 'coverage'
  | 'accessibility-semantics'
  | 'print-readiness'
  | 'output-shape';

export interface ReleaseDiagnostic {
  gate: ReleaseGateName;
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
  stdout?: string;
  stderr?: string;
}

export interface ReleaseGateResult {
  gate: ReleaseGateName;
  status: 'passed' | 'failed' | 'pending';
  totalDiagnostics: number;
  diagnostics: ReleaseDiagnostic[];
}

export interface ReleaseReadinessResult {
  ok: boolean;
  gates: ReleaseGateResult[];
  diagnostics: ReleaseDiagnostic[];
  totals: {
    passed: number;
    failed: number;
    pending: number;
    diagnostics: number;
  };
}

export interface ReleaseCommandResult {
  ok: boolean;
  exitCode?: number | null;
  stdout?: string;
  stderr?: string;
  error?: string;
}

export type ExistingValidatorError =
  | ValidationError
  | FormalRegistryValidationError
  | DiscoveryValidationError
  | MathFixtureError
  | CoverageDiagnostic
  | AccessibilitySemanticsError
  | PrintReadinessError
  | OutputShapeError;
export type ExistingValidatorResult =
  | ValidationResult
  | FormalRegistryValidationResult
  | Pick<DiscoveryValidationResult, 'ok' | 'errors'>
  | MathFixtureValidationResult
  | Pick<CoverageMatrix, 'diagnostics'> & { ok: boolean; errors: CoverageDiagnostic[] }
  | AccessibilitySemanticsResult
  | PrintReadinessResult
  | Pick<OutputShapeResult, 'ok' | 'errors'>;
export type ReleaseGateRunner = () => ExistingValidatorResult;
export type ReleaseCommandRunner = (command: string) => ReleaseCommandResult;

export interface RunReleaseReadinessOptions {
  gates?: Partial<Record<ReleaseGateName, ReleaseGateRunner>>;
  commands?: Partial<Record<string, ReleaseCommandRunner>>;
  commandRunner?: ReleaseCommandRunner;
}

interface ReleaseGateDefinition {
  name: ReleaseGateName;
  kind: 'validator' | 'command';
  command?: string;
  nextStep?: string;
}

const successSummary = 'Release readiness passed. Static output, coverage evidence, source trails, citations, graph targets, math fixtures, accessibility checks, and print readiness are publishable.';
const blockedSummary = 'Release readiness blocked. Fix the failing gates below before publishing.';
const commandNextSteps: Record<string, string> = {
  'bun run check': 'Run `bun run check` to inspect the focused failure.',
  'bun test': 'Run `bun test` to inspect the focused failure.',
  'bun run build:astro': 'Run `bun run build:astro` to inspect the focused failure.',
  'bun run index': 'Run `bun run index` to inspect local index or Pagefind generation failures.',
};

export const defaultReleaseGateOrder: ReleaseGateDefinition[] = [
  { name: 'corpus', kind: 'validator' },
  { name: 'formal-registry', kind: 'validator' },
  { name: 'discovery', kind: 'validator' },
  { name: 'math-fixtures', kind: 'validator' },
  { name: 'astro-check', kind: 'command', command: 'bun run check' },
  { name: 'vitest', kind: 'command', command: 'bun test' },
  { name: 'astro-build', kind: 'command', command: 'bun run build:astro' },
  { name: 'local-indexes', kind: 'command', command: 'bun run index' },
  { name: 'coverage', kind: 'validator' },
  { name: 'accessibility-semantics', kind: 'validator' },
  { name: 'print-readiness', kind: 'validator' },
  { name: 'output-shape', kind: 'validator' },
];

function validateCoverageGate(): ExistingValidatorResult {
  writeCoverageMatrix({ outputDir: 'dist' });
  const matrix = buildCoverageMatrix();
  return { ok: matrix.diagnostics.length === 0, errors: matrix.diagnostics, diagnostics: matrix.diagnostics };
}

const defaultGates: Record<ReleaseGateName, ReleaseGateRunner> = {
  corpus: validateCorpus,
  'formal-registry': validateFormalRegistry,
  discovery: validateDiscovery,
  'math-fixtures': validateMathFixtures,
  coverage: validateCoverageGate,
  'accessibility-semantics': validateAccessibilitySemantics,
  'print-readiness': validatePrintReadiness,
  'output-shape': validateOutputShape,
  'astro-check': () => ({ ok: true, errors: [] }),
  vitest: () => ({ ok: true, errors: [] }),
  'astro-build': () => ({ ok: true, errors: [] }),
  'local-indexes': () => ({ ok: true, errors: [] }),
};

function gateLabel(gate: ReleaseGateName): string {
  return gate
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeDiagnostic(gate: ReleaseGateName, error: ExistingValidatorError): ReleaseDiagnostic {
  return {
    gate,
    entryId: error.entryId,
    field: error.field,
    path: error.path,
    reason: error.reason,
    nextStep: error.nextStep,
  };
}

function truncateOutput(value = ''): string {
  const trimmed = value.trim();
  return trimmed.length > 1200 ? `${trimmed.slice(0, 1200)}…` : trimmed;
}

function commandDiagnostic(gate: ReleaseGateName, command: string, result: ReleaseCommandResult): ReleaseDiagnostic {
  const reason = result.error
    ? `Command failed: ${result.error}`
    : `Command exited with exit code ${result.exitCode ?? 'unknown'}`;

  return {
    gate,
    entryId: command,
    field: 'command.exitCode',
    path: command,
    reason,
    nextStep: commandNextSteps[command] ?? `Run \`${command}\` to inspect the focused failure.`,
    stdout: truncateOutput(result.stdout),
    stderr: truncateOutput(result.stderr),
  };
}

export function formatReleaseDiagnostic(diagnostic: ReleaseDiagnostic): string {
  return `${gateLabel(diagnostic.gate)}: ${diagnostic.entryId} failed at ${diagnostic.path}. Reason: ${diagnostic.reason}. Next step: ${diagnostic.nextStep}.`;
}

function buildValidatorGateResult(gate: ReleaseGateName, runner: ReleaseGateRunner): ReleaseGateResult {
  const result = runner();
  const diagnostics = result.errors.map((error) => normalizeDiagnostic(gate, error));

  return {
    gate,
    status: result.ok ? 'passed' : 'failed',
    totalDiagnostics: diagnostics.length,
    diagnostics,
  };
}

function runShellCommand(command: string): ReleaseCommandResult {
  try {
    const result = spawnSync(command, { shell: true, encoding: 'utf8', stdio: 'pipe' });
    return {
      ok: result.status === 0,
      exitCode: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error?.message,
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function buildCommandGateResult(gate: ReleaseGateName, command: string, runner: ReleaseCommandRunner): ReleaseGateResult {
  const result = runner(command);
  const diagnostics = result.ok ? [] : [commandDiagnostic(gate, command, result)];

  return {
    gate,
    status: result.ok ? 'passed' : 'failed',
    totalDiagnostics: diagnostics.length,
    diagnostics,
  };
}

export function runReleaseReadiness(options: RunReleaseReadinessOptions = {}): ReleaseReadinessResult {
  const gates = { ...defaultGates, ...options.gates };
  const commandRunner = options.commandRunner ?? runShellCommand;
  const gateResults = defaultReleaseGateOrder.map((definition) => {
    if (definition.kind === 'command') {
      const command = definition.command ?? '';
      return buildCommandGateResult(definition.name, command, options.commands?.[command] ?? commandRunner);
    }

    return buildValidatorGateResult(definition.name, gates[definition.name]);
  });
  const diagnostics = gateResults.flatMap((gate) => gate.diagnostics);
  const failed = gateResults.filter((gate) => gate.status === 'failed').length;
  const passed = gateResults.filter((gate) => gate.status === 'passed').length;
  const pending = gateResults.filter((gate) => gate.status === 'pending').length;

  return {
    ok: failed === 0 && pending === 0,
    gates: gateResults,
    diagnostics,
    totals: {
      passed,
      failed,
      pending,
      diagnostics: diagnostics.length,
    },
  };
}

function formatGateHeading(result: ReleaseGateResult): string {
  return `${result.gate}: ${result.status} (${result.totalDiagnostics} diagnostic${result.totalDiagnostics === 1 ? '' : 's'})`;
}

function passedIn(result: ReleaseReadinessResult, gates: ReleaseGateName[]): number {
  return result.gates.filter((gate) => gates.includes(gate.gate) && gate.status === 'passed').length;
}

function formatGateGroups(result: ReleaseReadinessResult): string {
  const groups: Array<[string, ReleaseGateName[]]> = [
    ['provenance/source trails', ['corpus', 'formal-registry', 'discovery']],
    ['math fixtures', ['math-fixtures']],
    ['clean-checkout/build', ['astro-check', 'vitest', 'astro-build', 'local-indexes']],
    ['coverage', ['coverage']],
    ['accessibility/semantics', ['accessibility-semantics']],
    ['print readiness', ['print-readiness']],
    ['clean-checkout/output shape', ['output-shape']],
  ];

  return `Gate groups: ${groups.map(([label, gates]) => `${label} ${passedIn(result, gates)}/${gates.length}`).join(', ')}.`;
}

export function summarizeReleaseReadiness(result: ReleaseReadinessResult): string {
  const lines = [
    result.ok ? successSummary : blockedSummary,
    `Totals: ${result.totals.passed} passed, ${result.totals.failed} failed, ${result.totals.pending} pending, ${result.totals.diagnostics} diagnostics.`,
    formatGateGroups(result),
    '',
    'Gates:',
  ];

  for (const gate of result.gates) {
    lines.push(`- ${formatGateHeading(gate)}`);
    for (const diagnostic of gate.diagnostics) {
      lines.push(`  - ${formatReleaseDiagnostic(diagnostic)}`);
      if (diagnostic.stderr) {
        lines.push(`    stderr: ${diagnostic.stderr}`);
      }
    }
  }

  return lines.join('\n');
}

function runCli(): number {
  const json = process.argv.includes('--json');
  const result = runReleaseReadiness();
  const output = json ? JSON.stringify(result, null, 2) : summarizeReleaseReadiness(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
  }

  return result.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
