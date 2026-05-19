import { corpusEntries } from './corpus';
import { parseConceptRegistry, type ConceptRecord, type SourceTrailItem } from './formal-registry.schema';

function corpusEntry(ownerId: string) {
  const entry = corpusEntries.find((item) => item.id === ownerId);
  if (!entry) {
    throw new Error(`Missing corpus entry for ${ownerId}`);
  }
  return entry;
}

function canonicalSources(ownerId: string): SourceTrailItem[] {
  const entry = corpusEntry(ownerId);

  return [
    { id: `${ownerId}-tex`, tier: 'canonical', path: entry.canonicalTex, label: `${entry.title} LaTeX source` },
  ];
}

const curatedConcepts: ConceptRecord[] = [
  {
    id: 'specification-refinement-gap',
    term: 'Specification-refinement gap',
    aliases: ['abstraction gap', 'specification-to-code gap', 'refinement drift'],
    notation: ['\\mathcal{G}(S,P)'],
    ownerIds: ['abstraction'],
    definition: 'The distance between intended specification and produced program after translation through prompts, interfaces, and refinement steps.',
    sourceTrail: canonicalSources('abstraction'),
    formalObjectIds: ['abstraction.specification-refinement-gap', 'abstraction.refinement-interface-contract', 'abstraction.gap-decomposition-equation'],
    relatedConceptIds: ['semantic-axis', 'context-degradation', 'harness-architecture'],
  },
  {
    id: 'context-degradation',
    term: 'Context degradation',
    aliases: ['context loss', 'information decay', 'retrieval degradation'],
    notation: ['D_{context}', 'C_{task}'],
    ownerIds: ['information'],
    definition: 'The loss or distortion of task-relevant information caused by selection, compression, ordering, or reuse choices in the harness context pipeline.',
    sourceTrail: canonicalSources('information'),
    formalObjectIds: ['information.context-degradation', 'information.relevance-selection-bound', 'information.context-loss-equation'],
    relatedConceptIds: ['semantic-axis', 'specification-refinement-gap', 'cost-value-information-harness'],
  },
  {
    id: 'quality-adjusted-speedup',
    term: 'Quality-adjusted speedup',
    aliases: ['quality adjusted parallel speedup', 'coordination-adjusted speedup', 'multi-agent effective speedup'],
    notation: ['S_q', 'Q_{retained}'],
    ownerIds: ['coordination'],
    definition: 'The useful speedup remaining after multi-agent parallelism is discounted by coordination overhead, merge repair, and quality loss.',
    sourceTrail: canonicalSources('coordination'),
    formalObjectIds: ['coordination.quality-adjusted-speedup', 'coordination.speedup-adjustment-equation'],
    relatedConceptIds: ['execution-axis', 'compound-error', 'verified-iterations-per-hour'],
  },
  {
    id: 'verified-iterations-per-hour',
    term: 'Verified iterations per hour',
    aliases: ['VIPH', 'verified iteration rate', 'verification-adjusted cadence'],
    notation: ['VIPH', 'V/H'],
    ownerIds: ['temporal'],
    definition: 'A temporal harness metric that counts completed iterations that pass verification per unit of wall-clock time.',
    sourceTrail: canonicalSources('temporal'),
    formalObjectIds: ['temporal.verified-iterations-per-hour', 'temporal.viph-equation'],
    relatedConceptIds: ['execution-axis', 'compound-error', 'quality-adjusted-speedup', 'cost-value-information-harness'],
  },
  {
    id: 'cost-value-information-harness',
    term: 'Cost-value information for harnesses',
    aliases: ['CVIH', 'harness cost-value information', 'cost-value tradeoff'],
    notation: ['CVIH', 'E[V]', 'C_{token}'],
    ownerIds: ['economics'],
    definition: 'The comparison between expected information or quality value gained by a harness action and the marginal cost of tokens, latency, queueing, model tier, or review.',
    sourceTrail: canonicalSources('economics'),
    formalObjectIds: ['economics.cost-value-information-harness', 'economics.cvih-equation'],
    relatedConceptIds: ['stage-specific-routing', 'verified-iterations-per-hour', 'context-degradation'],
  },
  {
    id: 'stage-specific-routing',
    term: 'Stage-specific routing',
    aliases: ['stage-aware routing', 'routing by task stage', 'stage-specific model assignment'],
    notation: ['U(m,s)', 'Q_m', 'C_m'],
    ownerIds: ['model-routing'],
    definition: 'A routing policy that assigns model tiers by workflow stage according to reasoning demand, uncertainty, verification availability, latency, and cost.',
    sourceTrail: canonicalSources('model-routing'),
    formalObjectIds: ['model-routing.stage-specific-routing', 'model-routing.stage-utility-equation'],
    relatedConceptIds: ['cost-value-information-harness', 'verified-iterations-per-hour', 'harness-architecture'],
  },
];

const ownersWithCuratedConcepts = new Set([
  ...curatedConcepts.flatMap((concept) => concept.ownerIds),
  'reliability',
]);

const pillarConcepts: ConceptRecord[] = corpusEntries
  .filter((entry) => entry.kind === 'pillar' && !ownersWithCuratedConcepts.has(entry.id))
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
    relatedConceptIds: ['semantic-axis', 'execution-axis', 'assurance-axis', 'stage-specific-routing'],
  },
  {
    id: 'semantic-axis',
    term: 'Semantic axis',
    aliases: ['abstraction and information axis'],
    notation: ['\\mathcal{G}(S,P)'],
    ownerIds: ['umbrella', 'abstraction', 'information'],
    definition: 'The part of harness architecture concerned with what the agent needs to know: specification-to-code abstraction and context information delivery.',
    sourceTrail: canonicalSources('umbrella'),
    formalObjectIds: ['umbrella.harness-architecture', 'abstraction.specification-refinement-gap', 'information.context-degradation'],
    relatedConceptIds: ['harness-architecture', 'specification-refinement-gap', 'context-degradation'],
  },
  {
    id: 'execution-axis',
    term: 'Execution axis',
    aliases: ['reliability, coordination, and temporal axis'],
    notation: ['R=p^n', 'VIPH'],
    ownerIds: ['umbrella', 'reliability', 'coordination', 'temporal'],
    definition: 'The part of harness architecture concerned with how agents act over multi-step pipelines, concurrent decomposition, and verified iteration timing.',
    sourceTrail: canonicalSources('umbrella'),
    formalObjectIds: ['umbrella.harness-architecture', 'reliability.compound-error-bound', 'coordination.quality-adjusted-speedup', 'temporal.verified-iterations-per-hour'],
    relatedConceptIds: ['harness-architecture', 'compound-error', 'quality-adjusted-speedup', 'verified-iterations-per-hour'],
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
    aliases: ['multi-step reliability decay', 'pipeline reliability decay'],
    notation: ['R=p^n'],
    ownerIds: ['reliability'],
    definition: 'The reliability decay that occurs when multiple agent steps each have non-perfect success probability and the pipeline succeeds only when all required steps succeed.',
    sourceTrail: canonicalSources('reliability'),
    formalObjectIds: ['reliability.compound-error', 'reliability.compound-error-bound', 'reliability.pipeline-reliability-equation'],
    relatedConceptIds: ['verification-scheduling', 'execution-axis', 'quality-adjusted-speedup'],
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
    relatedConceptIds: ['compound-error', 'verified-iterations-per-hour'],
  },
  ...curatedConcepts,
  ...pillarConcepts,
]);
