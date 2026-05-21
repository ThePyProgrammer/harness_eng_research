import { validateCorpus, type ValidationError, type ValidationResult } from './validate-corpus';
import { validateDiscovery, type DiscoveryValidationError, type DiscoveryValidationResult } from './validate-discovery';
import { validateFormalRegistry, type FormalRegistryValidationError, type FormalRegistryValidationResult } from './validate-formal-registry';

export type ReleaseGateName =
  | 'corpus'
  | 'formal-registry'
  | 'discovery'
  | 'coverage-matrix'
  | 'accessibility'
  | 'print-readiness'
  | 'clean-checkout'
  | 'static-output';

export interface ReleaseDiagnostic {
  gate: ReleaseGateName;
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
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

export type ExistingValidatorError = ValidationError | FormalRegistryValidationError | DiscoveryValidationError;
export type ExistingValidatorResult = ValidationResult | FormalRegistryValidationResult | Pick<DiscoveryValidationResult, 'ok' | 'errors'>;
export type ReleaseGateRunner = () => ExistingValidatorResult;

export interface RunReleaseReadinessOptions {
  gates?: Partial<Record<'corpus' | 'formal-registry' | 'discovery', ReleaseGateRunner>>;
}

const successSummary = 'Release readiness passed. Static output, coverage evidence, source trails, citations, graph targets, math fixtures, accessibility checks, and print readiness are publishable.';
const blockedSummary = 'Release readiness blocked. Fix the failing gates below before publishing.';
const existingGateOrder = ['corpus', 'formal-registry', 'discovery'] as const;
const pendingGateNames: ReleaseGateName[] = [
  'coverage-matrix',
  'accessibility',
  'print-readiness',
  'clean-checkout',
  'static-output',
];
const defaultGates: Record<(typeof existingGateOrder)[number], ReleaseGateRunner> = {
  corpus: validateCorpus,
  'formal-registry': validateFormalRegistry,
  discovery: validateDiscovery,
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

export function formatReleaseDiagnostic(diagnostic: ReleaseDiagnostic): string {
  return `${gateLabel(diagnostic.gate)}: ${diagnostic.entryId} failed at ${diagnostic.path}. Reason: ${diagnostic.reason}. Next step: ${diagnostic.nextStep}.`;
}

function buildExistingGateResult(gate: (typeof existingGateOrder)[number], runner: ReleaseGateRunner): ReleaseGateResult {
  const result = runner();
  const diagnostics = result.errors.map((error) => normalizeDiagnostic(gate, error));

  return {
    gate,
    status: result.ok ? 'passed' : 'failed',
    totalDiagnostics: diagnostics.length,
    diagnostics,
  };
}

function buildPendingGateResult(gate: ReleaseGateName): ReleaseGateResult {
  return {
    gate,
    status: 'pending',
    totalDiagnostics: 0,
    diagnostics: [],
  };
}

export function runReleaseReadiness(options: RunReleaseReadinessOptions = {}): ReleaseReadinessResult {
  const gates = { ...defaultGates, ...options.gates };
  const gateResults: ReleaseGateResult[] = [
    ...existingGateOrder.map((gate) => buildExistingGateResult(gate, gates[gate])),
    ...pendingGateNames.map(buildPendingGateResult),
  ];
  const diagnostics = gateResults.flatMap((gate) => gate.diagnostics);
  const failed = gateResults.filter((gate) => gate.status === 'failed').length;
  const passed = gateResults.filter((gate) => gate.status === 'passed').length;
  const pending = gateResults.filter((gate) => gate.status === 'pending').length;

  return {
    ok: failed === 0,
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

export function summarizeReleaseReadiness(result: ReleaseReadinessResult): string {
  const lines = [
    result.ok ? successSummary : blockedSummary,
    `Totals: ${result.totals.passed} passed, ${result.totals.failed} failed, ${result.totals.pending} pending, ${result.totals.diagnostics} diagnostics.`,
    '',
    'Gates:',
  ];

  for (const gate of result.gates) {
    lines.push(`- ${formatGateHeading(gate)}`);
    for (const diagnostic of gate.diagnostics) {
      lines.push(`  - ${formatReleaseDiagnostic(diagnostic)}`);
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
