import { describe, expect, it } from 'vitest';
import {
  defaultReleaseGateOrder,
  formatReleaseDiagnostic,
  runReleaseReadiness,
  summarizeReleaseReadiness,
  type ReleaseCommandRunner,
  type ReleaseGateRunner,
} from './release-readiness';

const expectedGateNames = [
  'corpus',
  'formal-registry',
  'discovery',
  'math-fixtures',
  'astro-check',
  'vitest',
  'astro-build',
  'local-indexes',
  'coverage',
  'accessibility-semantics',
  'print-readiness',
  'output-shape',
];

const successCopy = 'Release readiness passed. Static output, coverage evidence, source trails, citations, graph targets, math fixtures, accessibility checks, and print readiness are publishable.';
const blockedCopy = 'Release readiness blocked. Fix the failing gates below before publishing.';

const passingGate: ReleaseGateRunner = () => ({ ok: true, errors: [] });
const failingGate: ReleaseGateRunner = () => ({
  ok: false,
  errors: [
    {
      entryId: 'umbrella',
      field: 'canonicalSource.path',
      path: 'science/paper/science.tex#framework',
      reason: 'Required release fixture failed',
      nextStep: 'Restore the canonical source fixture before publishing',
    },
  ],
});
const passingCommand: ReleaseCommandRunner = () => ({ ok: true, stdout: 'ok', stderr: '' });
const failingCommand: ReleaseCommandRunner = (command) => ({
  ok: false,
  exitCode: 1,
  stdout: '',
  stderr: `${command} failed`,
});

const allPassingGates = Object.fromEntries(expectedGateNames.map((gate) => [gate, passingGate]));
const allPassingCommands = {
  'bun run check': passingCommand,
  'bun test': passingCommand,
  'bun run build:astro': passingCommand,
  'bun run index': passingCommand,
};

describe('release readiness', () => {
  it('declares every final Phase 5 gate in the default gate order', () => {
    expect(defaultReleaseGateOrder.map((gate) => gate.name)).toEqual(expectedGateNames);
  });

  it('returns ok when all validators, command gates, and generated-output gates pass', () => {
    const result = runReleaseReadiness({
      gates: allPassingGates,
      commands: allPassingCommands,
    });

    expect(result.ok).toBe(true);
    expect(result.diagnostics).toEqual([]);
    expect(result.gates.map((gate) => gate.gate)).toEqual(expectedGateNames);
    expect(result.totals).toMatchObject({ passed: expectedGateNames.length, failed: 0, pending: 0, diagnostics: 0 });
  });

  it('preserves failed validator diagnostic evidence with the gate name', () => {
    const result = runReleaseReadiness({
      gates: { ...allPassingGates, corpus: failingGate },
      commands: allPassingCommands,
    });

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        gate: 'corpus',
        entryId: 'umbrella',
        field: 'canonicalSource.path',
        path: 'science/paper/science.tex#framework',
        reason: 'Required release fixture failed',
        nextStep: 'Restore the canonical source fixture before publishing',
      }),
    ]);
    expect(formatReleaseDiagnostic(result.diagnostics[0])).toContain(
      'Corpus: umbrella failed at science/paper/science.tex#framework. Reason: Required release fixture failed. Next step: Restore the canonical source fixture before publishing.',
    );
  });

  it('normalizes failed command gates into actionable diagnostics', () => {
    const result = runReleaseReadiness({
      gates: allPassingGates,
      commands: { ...allPassingCommands, 'bun run check': failingCommand },
    });

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        gate: 'astro-check',
        entryId: 'bun run check',
        field: 'command.exitCode',
        path: 'bun run check',
        reason: expect.stringContaining('exit code 1'),
        nextStep: 'Run `bun run check` to inspect the focused failure.',
      }),
    ]);
  });

  it('emits exact required pass and blocked summary copy with gate counts', () => {
    const success = runReleaseReadiness({
      gates: allPassingGates,
      commands: allPassingCommands,
    });
    const failure = runReleaseReadiness({
      gates: { ...allPassingGates, corpus: failingGate },
      commands: allPassingCommands,
    });
    const successSummary = summarizeReleaseReadiness(success);
    const failureSummary = summarizeReleaseReadiness(failure);

    expect(successSummary).toContain(successCopy);
    expect(failureSummary).toContain(blockedCopy);
    expect(successSummary).toContain('Gate groups: provenance/source trails 3/3, math fixtures 1/1, clean-checkout/build 4/4, coverage 1/1, accessibility/semantics 1/1, print readiness 1/1, clean-checkout/output shape 1/1.');
    expect(failureSummary).toContain('Gate groups: provenance/source trails 2/3, math fixtures 1/1, clean-checkout/build 4/4, coverage 1/1, accessibility/semantics 1/1, print readiness 1/1, clean-checkout/output shape 1/1.');
  });

  it('groups plain output under all final gate headings', () => {
    const result = runReleaseReadiness({
      gates: { ...allPassingGates, corpus: failingGate },
      commands: allPassingCommands,
    });
    const summary = summarizeReleaseReadiness(result);

    for (const gate of expectedGateNames) {
      expect(summary).toContain(gate);
    }
  });
});
