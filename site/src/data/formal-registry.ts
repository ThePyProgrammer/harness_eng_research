import { corpusEntries } from './corpus';
import { parseFormalRegistry, type CitationRecord, type FormalObject } from './formal-registry.schema';

function canonicalSources(ownerId: string) {
  const entry = corpusEntries.find((item) => item.id === ownerId);
  if (!entry) {
    throw new Error(`Missing corpus entry for ${ownerId}`);
  }

  return [
    { id: `${ownerId}-tex`, tier: 'canonical' as const, path: entry.canonicalTex, label: `${entry.title} LaTeX source` },
    { id: `${ownerId}-pdf`, tier: 'canonical' as const, path: entry.canonicalPdf, label: `${entry.title} PDF` },
    ...(entry.bibliography
      ? [{ id: `${ownerId}-bib`, tier: 'canonical' as const, path: entry.bibliography, label: `${entry.title} bibliography` }]
      : []),
  ];
}

const pillarSummaries = corpusEntries.filter((entry) => entry.kind === 'pillar');

const minimalObjects: FormalObject[] = pillarSummaries.map((entry) => ({
  id: `${entry.id}.chapter-seed`,
  ownerId: entry.id,
  kind: 'definition',
  title: `${entry.title} chapter seed`,
  statement: `Build-safe minimal formal record for the ${entry.title} pillar. This preserves owner-prefixed anchors and canonical source trails until the full curated derivations are expanded in later Phase 3 plans.`,
  notation: [],
  sourceTrail: canonicalSources(entry.id),
  conceptIds: [`${entry.id}-framework`],
  citationIds: [`${entry.id}-paper`],
  relatedObjectIds: ['umbrella.harness-architecture'],
}));

export const citations: CitationRecord[] = [
  {
    id: 'science-paper',
    label: 'A Formal Framework for AI Coding Agent Harness Architecture',
    sourceTrail: canonicalSources('umbrella'),
  },
  ...pillarSummaries.map((entry) => ({
    id: `${entry.id}-paper`,
    label: `${entry.title} canonical paper`,
    sourceTrail: canonicalSources(entry.id),
  })),
];

export const formalRegistry = parseFormalRegistry([
  {
    id: 'umbrella.harness-architecture',
    ownerId: 'umbrella',
    kind: 'definition',
    title: 'Harness architecture framework',
    statement: 'Harness architecture is the surrounding system that mediates human intent, context, agent execution, verification, coordination, governance, economics, human attention, model routing, and security across AI coding agents.',
    notation: ['\\mathcal{G}(S,P)', 'R=p^n', 'R_{\\text{drift}} < C_{\\text{gov}}'],
    sourceTrail: canonicalSources('umbrella'),
    conceptIds: ['harness-architecture', 'semantic-axis', 'execution-axis', 'assurance-axis'],
    citationIds: ['science-paper'],
    relatedObjectIds: ['reliability.compound-error-bound'],
  },
  {
    id: 'reliability.compound-error-bound',
    ownerId: 'reliability',
    kind: 'theorem',
    title: 'Compound error sensitivity',
    statement: 'For a pipeline of n independent agent steps with per-step reliability p, the end-to-end reliability scales as R = p^n and the elasticity of reliability with respect to p is n.',
    notation: ['R=p^n', 'n'],
    sourceTrail: canonicalSources('umbrella'),
    conceptIds: ['compound-error', 'verification-scheduling'],
    citationIds: ['science-paper'],
    relatedObjectIds: ['umbrella.harness-architecture'],
  },
  ...minimalObjects,
]);
