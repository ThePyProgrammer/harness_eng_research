import { corpusEntries } from './corpus';
import { parseConceptRegistry, type ConceptRecord } from './formal-registry.schema';

function canonicalSources(ownerId: string) {
  const entry = corpusEntries.find((item) => item.id === ownerId);
  if (!entry) {
    throw new Error(`Missing corpus entry for ${ownerId}`);
  }

  return [
    { id: `${ownerId}-tex`, tier: 'canonical' as const, path: entry.canonicalTex, label: `${entry.title} LaTeX source` },
  ];
}

const pillarConcepts: ConceptRecord[] = corpusEntries
  .filter((entry) => entry.kind === 'pillar')
  .map((entry) => ({
    id: `${entry.id}-framework`,
    term: `${entry.title} framework`,
    aliases: [entry.title],
    notation: [],
    ownerIds: [entry.id],
    definition: `Minimal concept card for the ${entry.title} pillar, kept deliberately provisional until the full curated chapter replaces this build-safe seed.`,
    sourceTrail: canonicalSources(entry.id),
    formalObjectIds: [`${entry.id}.chapter-seed`],
    relatedConceptIds: ['harness-architecture'],
  }));

export const conceptRegistry = parseConceptRegistry([
  {
    id: 'harness-architecture',
    term: 'Harness architecture',
    aliases: ['AI coding agent harness', 'agent harness'],
    notation: [],
    ownerIds: ['umbrella'],
    definition: 'The structured environment around AI coding agents that supplies context, constrains execution, verifies outputs, and preserves architectural intent.',
    sourceTrail: canonicalSources('umbrella'),
    formalObjectIds: ['umbrella.harness-architecture'],
    relatedConceptIds: ['semantic-axis', 'execution-axis', 'assurance-axis'],
  },
  {
    id: 'semantic-axis',
    term: 'Semantic axis',
    aliases: ['abstraction and information axis'],
    notation: ['\\mathcal{G}(S,P)'],
    ownerIds: ['umbrella', 'abstraction', 'information'],
    definition: 'The part of harness architecture concerned with what the agent needs to know: specification-to-code abstraction and context information delivery.',
    sourceTrail: canonicalSources('umbrella'),
    formalObjectIds: ['umbrella.harness-architecture'],
    relatedConceptIds: ['harness-architecture'],
  },
  {
    id: 'execution-axis',
    term: 'Execution axis',
    aliases: ['reliability, coordination, and temporal axis'],
    notation: ['R=p^n'],
    ownerIds: ['umbrella', 'reliability', 'coordination', 'temporal'],
    definition: 'The part of harness architecture concerned with how agents act over multi-step pipelines, concurrent decomposition, and verified iteration timing.',
    sourceTrail: canonicalSources('umbrella'),
    formalObjectIds: ['umbrella.harness-architecture', 'reliability.compound-error-bound'],
    relatedConceptIds: ['harness-architecture', 'compound-error'],
  },
  {
    id: 'assurance-axis',
    term: 'Assurance axis',
    aliases: ['quality and governance axis'],
    notation: ['R_{\\text{drift}} < C_{\\text{gov}}'],
    ownerIds: ['umbrella', 'quality', 'governance'],
    definition: 'The part of harness architecture concerned with detecting quality defects and preserving architectural information through governance capacity.',
    sourceTrail: canonicalSources('umbrella'),
    formalObjectIds: ['umbrella.harness-architecture'],
    relatedConceptIds: ['harness-architecture'],
  },
  {
    id: 'compound-error',
    term: 'Compound error',
    aliases: ['multi-step reliability decay'],
    notation: ['R=p^n'],
    ownerIds: ['reliability'],
    definition: 'The reliability decay that occurs when multiple agent steps each have non-perfect success probability and the pipeline succeeds only when all required steps succeed.',
    sourceTrail: canonicalSources('reliability'),
    formalObjectIds: ['reliability.compound-error-bound'],
    relatedConceptIds: ['verification-scheduling', 'execution-axis'],
  },
  {
    id: 'verification-scheduling',
    term: 'Verification scheduling',
    aliases: ['adaptive verification'],
    notation: [],
    ownerIds: ['reliability'],
    definition: 'The placement and frequency of checks that bound compound agent error while respecting cost and latency constraints.',
    sourceTrail: canonicalSources('reliability'),
    formalObjectIds: ['reliability.compound-error-bound'],
    relatedConceptIds: ['compound-error'],
  },
  ...pillarConcepts,
]);
