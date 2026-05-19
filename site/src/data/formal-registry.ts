import { corpusEntries } from './corpus';
import { parseFormalRegistry, type CitationRecord, type FormalObject, type OwnerId, type SourceTrailItem } from './formal-registry.schema';

export interface DerivationCoverageEntry {
  sourcePath: string;
  status: 'supported' | 'not-supported';
  formalObjectIds: string[];
  rationale?: string;
}

type CuratedOwnerId = 'abstraction' | 'information' | 'reliability' | 'coordination' | 'temporal' | 'economics' | 'model-routing';

interface CuratedPillarSeed {
  ownerId: CuratedOwnerId;
  definitionId: string;
  claimId: string;
  derivationId: string;
  citationObjectId: string;
  conceptId: string;
  title: string;
  definitionTitle: string;
  definitionStatement: string;
  claimTitle: string;
  claimKind: 'theorem' | 'proposition' | 'lemma' | 'corollary';
  claimStatement: string;
  derivationTitle: string;
  derivationStatement: string;
  notation: string[];
  relatedConcepts: string[];
  relatedObjects: string[];
  citationStatement: string;
}

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
    { id: `${ownerId}-pdf`, tier: 'canonical', path: entry.canonicalPdf, label: `${entry.title} PDF` },
    ...(entry.bibliography
      ? [{ id: `${ownerId}-bib`, tier: 'canonical' as const, path: entry.bibliography, label: `${entry.title} bibliography` }]
      : []),
  ];
}

const curatedPillars: CuratedPillarSeed[] = [
  {
    ownerId: 'abstraction',
    definitionId: 'abstraction.specification-refinement-gap',
    claimId: 'abstraction.refinement-interface-contract',
    derivationId: 'abstraction.gap-decomposition-equation',
    citationObjectId: 'abstraction.canonical-paper-citation',
    conceptId: 'specification-refinement-gap',
    title: 'Abstraction',
    definitionTitle: 'Specification-refinement gap',
    definitionStatement: 'The specification-refinement gap is the distance between an intended specification S and an implemented program P after translation through agent prompts, intermediate representations, and refinement interfaces; the Abstraction paper frames harness design as making this gap observable and constrainable rather than hoping prompt prose is enough.',
    claimTitle: 'Refinement interface contract',
    claimKind: 'proposition',
    claimStatement: 'A harness reduces abstraction failure when it turns informal intent into explicit interfaces, invariants, and refinement checks, because each refinement boundary gives the agent a typed obligation that can be inspected against the canonical abstraction model.',
    derivationTitle: 'Gap decomposition equation',
    derivationStatement: 'Notebook derivation: start with the paper-level gap notation G(S,P); decompose implementation error into specification ambiguity, interface loss, and refinement drift; then read harness controls as terms that shrink or expose those components before code is accepted.',
    notation: ['\\mathcal{G}(S,P)', 'S', 'P'],
    relatedConcepts: ['harness-architecture', 'semantic-axis', 'context-degradation'],
    relatedObjects: ['umbrella.harness-architecture', 'information.context-degradation'],
    citationStatement: 'Canonical citation record for the Abstraction pillar paper and its bibliography trail under pillars/abstraction/paper/.',
  },
  {
    ownerId: 'information',
    definitionId: 'information.context-degradation',
    claimId: 'information.relevance-selection-bound',
    derivationId: 'information.context-loss-equation',
    citationObjectId: 'information.canonical-paper-citation',
    conceptId: 'context-degradation',
    title: 'Information',
    definitionTitle: 'Context degradation',
    definitionStatement: 'Context degradation is the loss of task-relevant information as a harness selects, compresses, orders, and reuses source material for an agent; the Information paper treats context as a managed resource whose quality changes across retrieval and prompt assembly.',
    claimTitle: 'Relevance selection bound',
    claimKind: 'proposition',
    claimStatement: 'Harnesses improve information reliability when they rank and tier source context by relevance, freshness, and reuse value, because the agent receives fewer irrelevant tokens while preserving the facts that carry formal obligations.',
    derivationTitle: 'Context loss equation',
    derivationStatement: 'Notebook derivation: write delivered context as selected relevant information minus omitted relevant information plus distracting irrelevant information; the context-degradation term grows with omission and distraction, motivating tiered memory and reuse discovery.',
    notation: ['C_{task}', 'I_{relevant}', 'D_{context}'],
    relatedConcepts: ['harness-architecture', 'semantic-axis', 'specification-refinement-gap'],
    relatedObjects: ['umbrella.harness-architecture', 'abstraction.specification-refinement-gap'],
    citationStatement: 'Canonical citation record for the Information pillar paper and its bibliography trail under pillars/information/paper/.',
  },
  {
    ownerId: 'reliability',
    definitionId: 'reliability.compound-error',
    claimId: 'reliability.compound-error-bound',
    derivationId: 'reliability.pipeline-reliability-equation',
    citationObjectId: 'reliability.canonical-paper-citation',
    conceptId: 'compound-error',
    title: 'Reliability',
    definitionTitle: 'Compound error',
    definitionStatement: 'Compound error is the end-to-end failure risk created when several individually plausible agent steps must all succeed for a software change to be correct; the Reliability paper turns this into a harness scheduling and verification problem.',
    claimTitle: 'Compound error sensitivity',
    claimKind: 'theorem',
    claimStatement: 'For a pipeline of n independent agent steps with per-step reliability p, the end-to-end reliability scales as R = p^n, so the marginal value of improving a step or inserting verification grows with pipeline length.',
    derivationTitle: 'Pipeline reliability equation',
    derivationStatement: 'Notebook derivation: assume n required steps, each succeeds independently with probability p; multiply the success probabilities to obtain R = p^n; differentiating log R with respect to log p gives elasticity n, exposing why long harness pipelines need verification gates.',
    notation: ['R=p^n', 'p', 'n'],
    relatedConcepts: ['harness-architecture', 'execution-axis', 'verification-scheduling'],
    relatedObjects: ['umbrella.harness-architecture', 'coordination.quality-adjusted-speedup'],
    citationStatement: 'Canonical citation record for the Reliability pillar paper and bibliography trail under pillars/reliability/paper/.',
  },
  {
    ownerId: 'coordination',
    definitionId: 'coordination.agent-decomposition',
    claimId: 'coordination.quality-adjusted-speedup',
    derivationId: 'coordination.speedup-adjustment-equation',
    citationObjectId: 'coordination.canonical-paper-citation',
    conceptId: 'quality-adjusted-speedup',
    title: 'Coordination',
    definitionTitle: 'Agent decomposition',
    definitionStatement: 'Agent decomposition is the division of a software task into multiple agent-owned work units with explicit merge, ownership, and review boundaries; the Coordination paper studies when parallelism helps rather than merely multiplying conflict surfaces.',
    claimTitle: 'Quality-adjusted speedup',
    claimKind: 'theorem',
    claimStatement: 'Parallel harness execution is useful only when raw speedup is discounted by merge conflicts, coordination overhead, and quality loss; quality-adjusted speedup captures that the fastest multi-agent plan is not necessarily the best harness plan.',
    derivationTitle: 'Speedup adjustment equation',
    derivationStatement: 'Notebook derivation: begin with ideal parallel speedup, subtract coordination overhead and expected merge repair, then multiply by a quality-retention term; the remaining expression is the quality-adjusted speedup available to the harness.',
    notation: ['S_q', 'O_{coord}', 'Q_{retained}'],
    relatedConcepts: ['harness-architecture', 'execution-axis', 'compound-error'],
    relatedObjects: ['umbrella.harness-architecture', 'reliability.compound-error-bound'],
    citationStatement: 'Canonical citation record for the Coordination pillar paper and its bibliography trail under pillars/coordination/paper/.',
  },
  {
    ownerId: 'temporal',
    definitionId: 'temporal.iteration-cadence',
    claimId: 'temporal.verified-iterations-per-hour',
    derivationId: 'temporal.viph-equation',
    citationObjectId: 'temporal.canonical-paper-citation',
    conceptId: 'verified-iterations-per-hour',
    title: 'Temporal',
    definitionTitle: 'Iteration cadence',
    definitionStatement: 'Iteration cadence is the rate at which a harness can complete meaningful agent work cycles while keeping verification attached to each cycle; the Temporal paper distinguishes raw speed from verified progress.',
    claimTitle: 'Verified iterations per hour',
    claimKind: 'proposition',
    claimStatement: 'A harness should optimize verified iterations per hour rather than prompt completions per hour, because staleness, speculation, cache reuse, and delayed checks can make unverified speed a misleading proxy for research progress.',
    derivationTitle: 'VIPH equation',
    derivationStatement: 'Notebook derivation: count completed iterations, multiply by the fraction that pass verification, and divide by elapsed wall-clock hours; the resulting VIPH metric exposes the speed-quality tradeoff in temporal harness design.',
    notation: ['VIPH', 'V/H', 'T_{verify}'],
    relatedConcepts: ['harness-architecture', 'execution-axis', 'compound-error'],
    relatedObjects: ['umbrella.harness-architecture', 'reliability.compound-error-bound'],
    citationStatement: 'Canonical citation record for the Temporal pillar paper and its bibliography trail under pillars/temporal/paper/.',
  },
  {
    ownerId: 'economics',
    definitionId: 'economics.harness-budget',
    claimId: 'economics.cost-value-information-harness',
    derivationId: 'economics.cvih-equation',
    citationObjectId: 'economics.canonical-paper-citation',
    conceptId: 'cost-value-information-harness',
    title: 'Economics',
    definitionTitle: 'Harness budget',
    definitionStatement: 'A harness budget is the allocation of token, latency, model-tier, cache, and human-review resources across an agent workflow; the Economics paper treats these choices as optimization variables rather than incidental operating costs.',
    claimTitle: 'Cost-value information for harnesses',
    claimKind: 'proposition',
    claimStatement: 'A harness action is economically justified when the expected value of the information or quality improvement it produces exceeds its token, latency, queueing, and model-tier costs.',
    derivationTitle: 'CVIH equation',
    derivationStatement: 'Notebook derivation: compare expected value gained from better information, lower error probability, or faster completion against marginal harness cost; positive CVIH indicates that retrieval, verification, or escalation is worth paying for.',
    notation: ['CVIH', 'E[V]', 'C_{token}'],
    relatedConcepts: ['harness-architecture', 'stage-specific-routing', 'verified-iterations-per-hour'],
    relatedObjects: ['umbrella.harness-architecture', 'model-routing.stage-specific-routing', 'temporal.verified-iterations-per-hour'],
    citationStatement: 'Canonical citation record for the Economics pillar paper and its bibliography trail under pillars/economics/paper/.',
  },
  {
    ownerId: 'model-routing',
    definitionId: 'model-routing.routing-policy',
    claimId: 'model-routing.stage-specific-routing',
    derivationId: 'model-routing.stage-utility-equation',
    citationObjectId: 'model-routing.canonical-paper-citation',
    conceptId: 'stage-specific-routing',
    title: 'Model Routing',
    definitionTitle: 'Routing policy',
    definitionStatement: 'A routing policy assigns model tiers to task stages such as planning, implementation, verification, and escalation; the Model Routing paper frames routing as a stage-aware harness control surface.',
    claimTitle: 'Stage-specific routing',
    claimKind: 'theorem',
    claimStatement: 'Stage-specific routing dominates one-size-fits-all model selection when stages differ in reasoning demand, uncertainty, verification availability, and cost sensitivity, because each stage has a distinct utility-cost profile.',
    derivationTitle: 'Stage utility equation',
    derivationStatement: 'Notebook derivation: express each candidate model choice by expected quality gain minus latency and token cost for a given stage; choose the model with maximum stage utility and escalate when uncertainty or risk crosses the stage threshold.',
    notation: ['U(m,s)', 'Q_m', 'C_m'],
    relatedConcepts: ['harness-architecture', 'cost-value-information-harness', 'verified-iterations-per-hour'],
    relatedObjects: ['umbrella.harness-architecture', 'economics.cost-value-information-harness', 'temporal.verified-iterations-per-hour'],
    citationStatement: 'Canonical citation record for the Model Routing pillar paper and its bibliography trail under pillars/model-routing/paper/.',
  },
];

const pillarSummaries = corpusEntries.filter((entry) => entry.kind === 'pillar');

const minimalObjects: FormalObject[] = pillarSummaries
  .filter((entry) => !curatedPillars.some((pillar) => pillar.ownerId === entry.id))
  .map((entry) => ({
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

const curatedObjects: FormalObject[] = curatedPillars.flatMap((pillar) => [
  {
    id: pillar.definitionId,
    ownerId: pillar.ownerId,
    kind: 'definition',
    title: pillar.definitionTitle,
    statement: pillar.definitionStatement,
    notation: pillar.notation,
    sourceTrail: canonicalSources(pillar.ownerId),
    conceptIds: [pillar.conceptId, ...pillar.relatedConcepts],
    citationIds: [`${pillar.ownerId}-paper`],
    relatedObjectIds: [pillar.claimId, ...pillar.relatedObjects],
  },
  {
    id: pillar.claimId,
    ownerId: pillar.ownerId,
    kind: pillar.claimKind,
    title: pillar.claimTitle,
    statement: pillar.claimStatement,
    notation: pillar.notation,
    sourceTrail: canonicalSources(pillar.ownerId),
    conceptIds: [pillar.conceptId, ...pillar.relatedConcepts],
    citationIds: [`${pillar.ownerId}-paper`],
    relatedObjectIds: [pillar.definitionId, pillar.derivationId, ...pillar.relatedObjects],
  },
  {
    id: pillar.derivationId,
    ownerId: pillar.ownerId,
    kind: 'derivation',
    title: pillar.derivationTitle,
    statement: pillar.derivationStatement,
    notation: pillar.notation,
    sourceTrail: canonicalSources(pillar.ownerId),
    conceptIds: [pillar.conceptId],
    citationIds: [`${pillar.ownerId}-paper`],
    relatedObjectIds: [pillar.claimId],
  },
  {
    id: pillar.citationObjectId,
    ownerId: pillar.ownerId,
    kind: 'citation',
    title: `${pillar.title} canonical citation`,
    statement: pillar.citationStatement,
    notation: [],
    sourceTrail: canonicalSources(pillar.ownerId),
    conceptIds: [pillar.conceptId],
    citationIds: [`${pillar.ownerId}-paper`],
    relatedObjectIds: [pillar.definitionId, pillar.claimId],
  },
]);

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

export const derivationCoverageByOwner: Record<CuratedOwnerId, DerivationCoverageEntry[]> = Object.fromEntries(
  curatedPillars.map((pillar) => {
    const entry = corpusEntry(pillar.ownerId);
    return [
      pillar.ownerId,
      [
        {
          sourcePath: entry.canonicalTex,
          status: 'supported',
          formalObjectIds: [pillar.derivationId],
        },
      ],
    ];
  }),
) as Record<CuratedOwnerId, DerivationCoverageEntry[]>;

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
  ...curatedObjects,
  ...minimalObjects,
]);

export const firstBatchFormalObjectIds = curatedPillars.map((pillar) => pillar.claimId);
export const firstBatchOwners = curatedPillars.map((pillar) => pillar.ownerId) as OwnerId[];
