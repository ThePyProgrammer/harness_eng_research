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

const pillarConcepts: ConceptRecord[] = [
  {
    id: 'specification-refinement-gap',
    term: 'Specification-refinement gap',
    aliases: ['abstraction gap', 'specification-to-code gap', 'refinement drift'],
    notation: ['\\mathcal{G}(S,P)'],
    ownerIds: ['abstraction'],
    definition: 'The distance between intended specification and produced program after translation through prompts, interfaces, and refinement steps.',
    sourceTrail: canonicalSources('abstraction'),
    formalObjectIds: ['abstraction.specification-refinement-gap', 'abstraction.refinement-interface-contract', 'abstraction.gap-decomposition-equation'],
    relatedConceptIds: ['harness-architecture'],
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
    relatedConceptIds: ['harness-architecture', 'verification-scheduling'],
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
    relatedConceptIds: ['compound-error', 'harness-architecture'],
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
    relatedConceptIds: ['harness-architecture'],
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
    relatedConceptIds: ['harness-architecture'],
  },
  {
    id: 'ai-code-slop',
    term: 'AI code slop',
    aliases: ['generated code slop', 'quality slop', 'plausible low-quality code'],
    notation: ['C_q', 'p_{defect}'],
    ownerIds: ['quality'],
    definition: 'Plausible generated code that appears acceptable locally while adding maintainability, semantic, or architectural defects to the repository.',
    sourceTrail: canonicalSources('quality'),
    formalObjectIds: ['quality.ai-code-slop', 'quality.layered-defense-detection', 'quality.defect-cost-equation'],
    relatedConceptIds: ['harness-architecture'],
  },
  {
    id: 'governance-ratchet',
    term: 'Governance ratchet',
    aliases: ['ratcheting governance load', 'decision enforcement ratchet'],
    notation: ['R_{drift}', 'C_{gov}'],
    ownerIds: ['governance'],
    definition: 'The increase in future enforcement obligations caused by accepted decisions and generated changes that must remain architecturally coherent.',
    sourceTrail: canonicalSources('governance'),
    formalObjectIds: ['governance.governance-capacity', 'governance.governance-ratchet', 'governance.capacity-ratchet-equation'],
    relatedConceptIds: ['harness-architecture'],
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
    relatedConceptIds: ['harness-architecture'],
  },
  {
    id: 'attention-allocation',
    term: 'Attention allocation',
    aliases: ['human attention budget', 'review allocation', 'supervision allocation'],
    notation: ['A_h', 'B_{attention}'],
    ownerIds: ['human-interaction'],
    definition: 'The distribution of scarce human review and steering effort across autonomy boundaries where judgment changes harness risk.',
    sourceTrail: canonicalSources('human-interaction'),
    formalObjectIds: ['human-interaction.attention-allocation', 'human-interaction.autonomy-boundary', 'human-interaction.attention-budget-equation'],
    relatedConceptIds: ['harness-architecture'],
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
    relatedConceptIds: ['harness-architecture'],
  },
  {
    id: 'prompt-injection-boundary',
    term: 'Prompt injection boundary',
    aliases: ['untrusted prompt boundary', 'instruction trust boundary', 'prompt boundary'],
    notation: ['B_{prompt}', 'T_{untrusted}'],
    ownerIds: ['security'],
    definition: 'The trust boundary where untrusted text or tool output can influence agent instructions and must be isolated from privileged harness control.',
    sourceTrail: canonicalSources('security'),
    formalObjectIds: ['security.prompt-injection-boundary', 'security.defense-in-depth-sandbox', 'security.attack-surface-equation'],
    relatedConceptIds: ['harness-architecture'],
  },
  {
    id: 'plausible-local-change',
    term: 'Plausible local change',
    aliases: ['locally plausible patch', 'individually acceptable generated change', 'local plausibility'],
    notation: ['\\Delta_t', 'D_{accretion}'],
    ownerIds: ['accretion'],
    definition: 'An AI-generated modification that appears acceptable in isolation while contributing to collectively harmful drift as similar changes accumulate.',
    sourceTrail: canonicalSources('accretion'),
    formalObjectIds: ['accretion.plausible-local-change', 'accretion.collective-harm-threshold', 'accretion.accumulation-drift-equation'],
    relatedConceptIds: ['harness-architecture'],
  },
];

export const conceptRegistry = parseConceptRegistry([
  {
    id: 'harness-architecture',
    term: 'Harness architecture',
    aliases: ['AI coding agent harness', 'agent harness'],
    notation: ['H'],
    ownerIds: ['umbrella'],
    definition: 'The structured environment around AI coding agents that supplies context, constrains execution, verifies outputs, coordinates work, and preserves architectural intent.',
    sourceTrail: canonicalSources('umbrella'),
    formalObjectIds: ['umbrella.harness-architecture', 'umbrella.harness-axis-equation'],
    relatedConceptIds: pillarConcepts.map((concept) => concept.id),
  },
  ...pillarConcepts,
]);
