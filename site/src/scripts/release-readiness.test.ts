import { describe, expect, it } from 'vitest';
import {
  formatReleaseDiagnostic,
  runReleaseReadiness,
  summarizeReleaseReadiness,
  type ReleaseGateRunner,
} from './release-readiness';

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

describe('release readiness', () => {
  it('returns ok when corpus, formal registry, and discovery validators pass', () => {
    const result = runReleaseReadiness({
      gates: {
        corpus: passingGate,
        'formal-registry': passingGate,
        discovery: passingGate,
      },
    });

    expect(result.ok).toBe(true);
    expect(result.diagnostics).toEqual([]);
    expect(result.gates.map((gate) => gate.gate)).toEqual(
      expect.arrayContaining(['corpus', 'formal-registry', 'discovery']),
    );
    expect(result.totals.pending).toBeGreaterThan(0);
  });

  it('preserves failed gate diagnostic evidence with the gate name', () => {
    const result = runReleaseReadiness({
      gates: {
        corpus: failingGate,
        'formal-registry': passingGate,
        discovery: passingGate,
      },
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

  it('emits the required pass and blocked summary copy', () => {
    const success = runReleaseReadiness({
      gates: {
        corpus: passingGate,
        'formal-registry': passingGate,
        discovery: passingGate,
      },
    });
    const failure = runReleaseReadiness({
      gates: {
        corpus: failingGate,
        'formal-registry': passingGate,
        discovery: passingGate,
      },
    });

    expect(summarizeReleaseReadiness(success)).toContain('Release readiness passed.');
    expect(summarizeReleaseReadiness(failure)).toContain('Release readiness blocked.');
  });

  it('groups plain output under existing gate headings', () => {
    const result = runReleaseReadiness({
      gates: {
        corpus: failingGate,
        'formal-registry': passingGate,
        discovery: passingGate,
      },
    });
    const summary = summarizeReleaseReadiness(result);

    expect(summary).toContain('corpus');
    expect(summary).toContain('formal-registry');
    expect(summary).toContain('discovery');
  });
});
