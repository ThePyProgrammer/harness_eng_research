import { corpusEntries } from './corpus';
import { derivationCoverageByOwner } from './formal-registry';
import { parseChapterRegistry, type ChapterRecord, type OwnerId, type SourceTrailItem } from './formal-registry.schema';

const d01SectionLabels = {
  problem: 'Problem',
  coreModel: 'Core model',
  keyNotation: 'Key notation',
  definitions: 'Definitions',
  formalClaims: 'Formal claims',
  derivationContext: 'Derivation context',
  interpretation: 'Interpretation',
  relatedPillars: 'Related pillars',
  citations: 'Citations',
  sourceTrail: 'Source trail',
} as const;

interface CuratedChapterSeed {
  ownerId: 'abstraction' | 'information' | 'reliability' | 'coordination' | 'temporal' | 'economics' | 'model-routing';
  summary: string;
  formalObjectIds: string[];
  conceptIds: string[];
  citationIds: string[];
  sections: ChapterRecord['sections'];
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

function minimalSections(title: string, summary: string) {
  return Object.fromEntries(
    Object.entries(d01SectionLabels).map(([key, label]) => [
      key,
      `${label}: minimal build-safe ${title} chapter seed grounded in the canonical paper. ${summary}. This record is intentionally incomplete until later Phase 3 enrichment plans replace the provisional prose.`,
    ]),
  ) as ChapterRecord['sections'];
}

function supportedDerivationText(ownerId: keyof typeof derivationCoverageByOwner): string {
  return derivationCoverageByOwner[ownerId]
    .map((entry) => entry.status === 'supported'
      ? `The canonical source ${entry.sourcePath} supports notebook-style registry derivations ${entry.formalObjectIds.join(', ')}.`
      : entry.rationale)
    .join(' ');
}

const curatedChapters: CuratedChapterSeed[] = [
  {
    ownerId: 'abstraction',
    summary: 'Curated formal chapter on specification-to-code gaps, refinement boundaries, and explicit interface contracts for agent harnesses.',
    formalObjectIds: ['abstraction.specification-refinement-gap', 'abstraction.refinement-interface-contract', 'abstraction.gap-decomposition-equation', 'abstraction.canonical-paper-citation'],
    conceptIds: ['specification-refinement-gap', 'semantic-axis', 'harness-architecture'],
    citationIds: ['abstraction-paper'],
    sections: {
      problem: 'Abstraction fails when the agent receives intent as prose but must produce code whose obligations are sharper than the prompt. The chapter frames the practical problem as specification-to-code drift: important invariants, interfaces, and refinement steps can disappear unless the harness makes them explicit.',
      coreModel: 'The core model treats the harness as a refinement mediator between specification S and program P. It introduces explicit interfaces, checked assumptions, and reviewable refinement boundaries so that the abstraction gap is not an invisible property of a generated patch.',
      keyNotation: 'Primary notation includes the abstraction gap \\mathcal{G}(S,P), the source specification S, the produced program P, and decomposition terms for ambiguity, interface loss, and refinement drift. These symbols are carried by the formal object abstraction.specification-refinement-gap.',
      definitions: 'The central definition is abstraction.specification-refinement-gap: the distance between intended specification and implemented behavior after translation through prompts, intermediate representations, and refinement interfaces. This gives the glossary a canonical term instead of duplicating gap-like aliases.',
      formalClaims: 'The chapter-critical claim abstraction.refinement-interface-contract states that harnesses reduce abstraction failure when informal intent is turned into explicit interface and invariant obligations. The claim is a proposition rather than a universal theorem because it depends on the harness actually checking those obligations.',
      derivationContext: `${supportedDerivationText('abstraction')} The walkthrough abstraction.gap-decomposition-equation reads \\mathcal{G}(S,P) as a decomposable quantity and explains how ambiguity, interface loss, and refinement drift become notebook-style terms rather than decorative notation.`,
      interpretation: 'For readers, the useful lesson is not that a harness can eliminate ambiguity. It is that a research-grade harness can name where ambiguity enters, attach source trails to those claims, and create interface checkpoints before code is treated as a faithful refinement.',
      relatedPillars: 'Abstraction links forward to Information because context selection determines what the agent can refine, and to Reliability because refinement checks become verification gates. The chapter therefore shares concepts with semantic-axis, context-degradation, and harness-architecture.',
      citations: 'The citation trail is manually curated from pillars/abstraction/paper/abstraction_architecture.tex, pillars/abstraction/paper/abstraction_architecture.pdf, and pillars/abstraction/paper/abstraction_architecture.bib via abstraction-paper.',
      sourceTrail: 'Canonical source trail: pillars/abstraction/paper/abstraction_architecture.tex for the source, pillars/abstraction/paper/abstraction_architecture.pdf for the paper artifact, and pillars/abstraction/paper/abstraction_architecture.bib for citations.',
    },
  },
  {
    ownerId: 'information',
    summary: 'Curated formal chapter on context degradation, relevance selection, tiered memory, and reuse discovery as managed harness resources.',
    formalObjectIds: ['information.context-degradation', 'information.relevance-selection-bound', 'information.context-loss-equation', 'information.canonical-paper-citation'],
    conceptIds: ['context-degradation', 'semantic-axis', 'specification-refinement-gap'],
    citationIds: ['information-paper'],
    sections: {
      problem: 'Information failures appear when an agent has enough tokens but not the right evidence. The chapter treats retrieval, compression, ordering, and reuse as formal harness decisions because a missing invariant and a distracting file can both degrade the delivered context.',
      coreModel: 'The core model represents context as a selected and ordered information bundle whose relevance, freshness, and reuse value determine whether the agent can act faithfully. Harness design is therefore a resource-allocation problem over source facts rather than a generic prompt-size problem.',
      keyNotation: 'Key notation includes task context C_{task}, relevant information I_{relevant}, and a degradation term D_{context}. These terms support the stable object information.context-degradation and connect the information pillar back to the semantic axis.',
      definitions: 'The central definition information.context-degradation names the loss of task-relevant information as the harness selects, compresses, orders, and reuses source material. Aliases such as context loss and information decay point back to this canonical concept.',
      formalClaims: 'The proposition information.relevance-selection-bound records the chapter-critical claim: ranking and tiering context by relevance, freshness, and reuse value improves harness reliability by reducing omissions and distractions in the prompt supplied to the agent.',
      derivationContext: `${supportedDerivationText('information')} The object information.context-loss-equation walks through delivered context as selected relevant information minus omitted relevant information plus distracting irrelevant information, making the degradation term inspectable.`,
      interpretation: 'For researchers, the Information chapter is the antidote to treating context windows as magic. The rigorous move is to ask which facts were selected, which facts were omitted, and how the selection policy changes the downstream formal claims.',
      relatedPillars: 'Information follows Abstraction in the conceptual arc because refinement quality depends on delivered evidence. It also links to Economics, where context retrieval has cost, and to Model Routing, where information quality can trigger escalation.',
      citations: 'The citation trail is manually curated from pillars/information/paper/information_architecture.tex, pillars/information/paper/information_architecture.pdf, and pillars/information/paper/information_architecture.bib via information-paper.',
      sourceTrail: 'Canonical source trail: pillars/information/paper/information_architecture.tex for the source, pillars/information/paper/information_architecture.pdf for the paper artifact, and pillars/information/paper/information_architecture.bib for citations.',
    },
  },
  {
    ownerId: 'reliability',
    summary: 'Curated formal chapter on compound error, pipeline reliability, structural enforcement, and verification scheduling.',
    formalObjectIds: ['reliability.compound-error', 'reliability.compound-error-bound', 'reliability.pipeline-reliability-equation', 'reliability.canonical-paper-citation'],
    conceptIds: ['compound-error', 'verification-scheduling', 'execution-axis'],
    citationIds: ['reliability-paper'],
    sections: {
      problem: 'Reliability fails multiplicatively in agent workflows: a sequence of plausible local steps can still produce an incorrect final change. The chapter frames harness reliability as the problem of bounding compound error through structure and verification.',
      coreModel: 'The core model starts from multi-step pipelines where every required step must succeed. Harnesses add verification scheduling, structural enforcement, and adaptive checks so the pipeline is not merely a chain of unchecked model outputs.',
      keyNotation: 'Key notation includes R=p^n, per-step reliability p, pipeline length n, and verification schedules that alter effective step reliability. The stable theorem-like object is reliability.compound-error-bound.',
      definitions: 'The chapter defines compound error as the end-to-end failure risk created by several individually plausible agent steps. It also relates verification scheduling to the placement and frequency of checks that reduce that risk.',
      formalClaims: 'The theorem reliability.compound-error-bound states that independent per-step reliability p compounds as R=p^n, making long pipelines fragile. This owner-prefixed semantic ID preserves D-06 stability and avoids paper-number anchors.',
      derivationContext: `${supportedDerivationText('reliability')} The object reliability.pipeline-reliability-equation multiplies independent success probabilities and differentiates the log reliability expression to show why verification leverage grows with n.`,
      interpretation: 'The interpretation is deliberately sobering: a harness can look impressive at each local step while failing at the pipeline level. Reliability work therefore belongs in the architecture, not as a late manual QA patch.',
      relatedPillars: 'Reliability depends on Abstraction for explicit obligations, Information for correct evidence, Coordination for multi-agent merge surfaces, and Temporal for verified iteration cadence. It owns the cross-corpus compound-error concept.',
      citations: 'The citation trail is manually curated from pillars/reliability/paper/reliability_architecture.tex, pillars/reliability/paper/reliability_architecture.pdf, and pillars/reliability/paper/reliability_architecture.bib via reliability-paper.',
      sourceTrail: 'Canonical source trail: pillars/reliability/paper/reliability_architecture.tex for the source, pillars/reliability/paper/reliability_architecture.pdf for the paper artifact, and pillars/reliability/paper/reliability_architecture.bib for citations.',
    },
  },
  {
    ownerId: 'coordination',
    summary: 'Curated formal chapter on multi-agent decomposition, merge conflict surfaces, ownership, and quality-adjusted speedup.',
    formalObjectIds: ['coordination.agent-decomposition', 'coordination.quality-adjusted-speedup', 'coordination.speedup-adjustment-equation', 'coordination.canonical-paper-citation'],
    conceptIds: ['quality-adjusted-speedup', 'execution-axis', 'compound-error'],
    citationIds: ['coordination-paper'],
    sections: {
      problem: 'Coordination becomes dangerous when parallel agents appear faster but create hidden merge conflicts, ownership ambiguity, and quality loss. The chapter asks when decomposition produces actual research progress rather than a pile of incompatible patches.',
      coreModel: 'The core model treats multi-agent work as decomposition plus coordination overhead. Work units, ownership boundaries, merge surfaces, and review gates determine whether raw parallelism survives contact with integration.',
      keyNotation: 'Key notation includes quality-adjusted speedup S_q, coordination overhead O_{coord}, and quality-retention factors Q_{retained}. These terms are attached to coordination.quality-adjusted-speedup.',
      definitions: 'The definition coordination.agent-decomposition names the division of a software task into agent-owned units with explicit merge, ownership, and review boundaries. It turns collaboration from vibes into a formal harness object.',
      formalClaims: 'The theorem coordination.quality-adjusted-speedup states that parallel harness execution should discount ideal speedup by merge conflicts, coordination overhead, and quality loss. The claim is linked reciprocally to compound error because concurrent work can multiply failure modes.',
      derivationContext: `${supportedDerivationText('coordination')} The object coordination.speedup-adjustment-equation starts with ideal parallel speedup, subtracts coordination and merge repair terms, and applies a quality-retention multiplier.`,
      interpretation: 'The point is not to avoid multi-agent harnesses. It is to stop pretending that more agents automatically mean more throughput; quality-adjusted speedup is the metric that makes coordination debt visible.',
      relatedPillars: 'Coordination sits after Reliability because multi-agent work expands the reliability surface. It also feeds Temporal metrics, Economics cost tradeoffs, and Model Routing decisions about which stages deserve stronger models.',
      citations: 'The citation trail is manually curated from pillars/coordination/paper/coordination_architecture.tex, pillars/coordination/paper/coordination_architecture.pdf, and pillars/coordination/paper/coordination_architecture.bib via coordination-paper.',
      sourceTrail: 'Canonical source trail: pillars/coordination/paper/coordination_architecture.tex for the source, pillars/coordination/paper/coordination_architecture.pdf for the paper artifact, and pillars/coordination/paper/coordination_architecture.bib for citations.',
    },
  },
  {
    ownerId: 'temporal',
    summary: 'Curated formal chapter on verified iterations per hour, staleness, speculation, caching, and speed-quality tradeoffs.',
    formalObjectIds: ['temporal.iteration-cadence', 'temporal.verified-iterations-per-hour', 'temporal.viph-equation', 'temporal.canonical-paper-citation'],
    conceptIds: ['verified-iterations-per-hour', 'execution-axis', 'compound-error'],
    citationIds: ['temporal-paper'],
    sections: {
      problem: 'Temporal harness failures occur when speed is optimized without asking whether completed iterations are verified, fresh, or still relevant. The chapter separates raw agent activity from verified progress over time.',
      coreModel: 'The core model measures cycles of agent work, verification delay, cache reuse, speculation, and staleness. A temporal harness is good when it increases the rate of verified useful iterations, not merely the number of model calls.',
      keyNotation: 'Key notation includes VIPH, elapsed hours H, verified iteration count V, and verification latency T_{verify}. These symbols ground temporal.verified-iterations-per-hour and temporal.viph-equation.',
      definitions: 'The chapter defines iteration cadence as the rate of meaningful agent work cycles that preserve verification. It also normalizes verified iterations per hour as the canonical concept for speed-quality reasoning.',
      formalClaims: 'The proposition temporal.verified-iterations-per-hour states that harnesses should optimize verified iterations per hour rather than prompt completions per hour because staleness and delayed checks can make raw speed misleading.',
      derivationContext: `${supportedDerivationText('temporal')} The object temporal.viph-equation counts completed iterations, multiplies by verification pass rate, and divides by wall-clock time to expose the speed-quality tradeoff.`,
      interpretation: 'Temporal design is where the book stops flattering fast demos. If the result is stale, speculative, or unchecked, the apparent acceleration does not count as verified research progress.',
      relatedPillars: 'Temporal links to Reliability through verification scheduling, Coordination through parallel iteration cycles, Economics through latency cost, and Model Routing through escalation choices that trade time for quality.',
      citations: 'The citation trail is manually curated from pillars/temporal/paper/temporal_architecture.tex, pillars/temporal/paper/temporal_architecture.pdf, and pillars/temporal/paper/temporal_architecture.bib via temporal-paper.',
      sourceTrail: 'Canonical source trail: pillars/temporal/paper/temporal_architecture.tex for the source, pillars/temporal/paper/temporal_architecture.pdf for the paper artifact, and pillars/temporal/paper/temporal_architecture.bib for citations.',
    },
  },
  {
    ownerId: 'economics',
    summary: 'Curated formal chapter on token budgets, model-tier choice, queueing economics, CVIH, and caching economics.',
    formalObjectIds: ['economics.harness-budget', 'economics.cost-value-information-harness', 'economics.cvih-equation', 'economics.canonical-paper-citation'],
    conceptIds: ['cost-value-information-harness', 'stage-specific-routing', 'verified-iterations-per-hour'],
    citationIds: ['economics-paper'],
    sections: {
      problem: 'Economics failures happen when harnesses spend tokens, latency, model calls, and human attention without comparing those costs to the value of better information or lower error. The chapter makes cost a first-class formal object.',
      coreModel: 'The core model treats retrieval, verification, escalation, caching, and model-tier selection as marginal investments. Each action has cost, expected value, and queueing effects that should be compared rather than hidden in operational budgets.',
      keyNotation: 'Key notation includes CVIH, expected value E[V], token cost C_{token}, and latency or queueing cost terms. These terms ground economics.cost-value-information-harness and its derivation object.',
      definitions: 'The chapter defines a harness budget as the allocation of token, latency, model-tier, cache, and human-review resources across an agent workflow. The canonical concept is cost-value information for harnesses.',
      formalClaims: 'The proposition economics.cost-value-information-harness states that a harness action is justified when expected information or quality value exceeds its marginal token, latency, queueing, and model-tier costs.',
      derivationContext: `${supportedDerivationText('economics')} The object economics.cvih-equation compares expected value gained from better information, lower error probability, or faster completion against marginal harness cost.`,
      interpretation: 'The practical reading is that cheap is not automatically good and expensive is not automatically rigorous. Economics supplies the discipline for deciding when verification, retrieval, caching, or escalation is worth its cost.',
      relatedPillars: 'Economics binds Information retrieval, Temporal delay, and Model Routing choices. It also supports Human Interaction in later chapters because human attention is one of the most expensive harness resources.',
      citations: 'The citation trail is manually curated from pillars/economics/paper/economics_architecture.tex, pillars/economics/paper/economics_architecture.pdf, and pillars/economics/paper/economics_architecture.bib via economics-paper.',
      sourceTrail: 'Canonical source trail: pillars/economics/paper/economics_architecture.tex for the source, pillars/economics/paper/economics_architecture.pdf for the paper artifact, and pillars/economics/paper/economics_architecture.bib for citations.',
    },
  },
  {
    ownerId: 'model-routing',
    summary: 'Curated formal chapter on stage-specific model assignment, cross-model diversity, cascades, and escalation.',
    formalObjectIds: ['model-routing.routing-policy', 'model-routing.stage-specific-routing', 'model-routing.stage-utility-equation', 'model-routing.canonical-paper-citation'],
    conceptIds: ['stage-specific-routing', 'cost-value-information-harness', 'verified-iterations-per-hour'],
    citationIds: ['model-routing-paper'],
    sections: {
      problem: 'Model Routing failures occur when every stage of a harness uses the same model despite different reasoning demands, costs, uncertainties, and verification options. The chapter turns model choice into an explicit stage-level policy.',
      coreModel: 'The core model assigns candidate models to task stages such as planning, implementation, verification, and escalation. A routing decision compares expected quality gain, uncertainty reduction, latency, and token cost for each stage.',
      keyNotation: 'Key notation includes utility U(m,s) for model m at stage s, quality contribution Q_m, and cost C_m. These symbols attach to model-routing.stage-specific-routing and model-routing.stage-utility-equation.',
      definitions: 'The chapter defines a routing policy as the assignment of model tiers to task stages with escalation thresholds. Aliases such as stage-aware routing and routing by task stage normalize to stage-specific-routing.',
      formalClaims: 'The theorem model-routing.stage-specific-routing states that stage-specific routing dominates one-size-fits-all model selection when stages differ in reasoning demand, uncertainty, verification availability, and cost sensitivity.',
      derivationContext: `${supportedDerivationText('model-routing')} The object model-routing.stage-utility-equation expresses expected quality gain minus latency and token cost for each model-stage pair, then selects the maximum utility or escalates on risk.`,
      interpretation: 'Model routing is the operational face of the formal registry: the harness should know when a cheap model is sufficient, when diversity helps, and when a stage deserves escalation because correctness or uncertainty dominates cost.',
      relatedPillars: 'Model Routing depends on Economics for cost-value tradeoffs, Temporal for latency and verified iteration rates, Reliability for verification stages, and Information for context quality signals that may trigger escalation.',
      citations: 'The citation trail is manually curated from pillars/model-routing/paper/model_routing_architecture.tex, pillars/model-routing/paper/model_routing_architecture.pdf, and pillars/model-routing/paper/model_routing_architecture.bib via model-routing-paper.',
      sourceTrail: 'Canonical source trail: pillars/model-routing/paper/model_routing_architecture.tex for the source, pillars/model-routing/paper/model_routing_architecture.pdf for the paper artifact, and pillars/model-routing/paper/model_routing_architecture.bib for citations.',
    },
  },
];

const minimalChapters: ChapterRecord[] = corpusEntries
  .filter((entry) => entry.kind === 'pillar' && !curatedChapters.some((chapter) => chapter.ownerId === entry.id))
  .map((entry) => ({
    ownerId: entry.id,
    slug: entry.slug,
    title: entry.title,
    curationStatus: 'minimal',
    summary: `${entry.summary}. Minimal validated seed for static route expansion.`,
    sections: minimalSections(entry.title, entry.summary),
    formalObjectIds: [`${entry.id}.chapter-seed`],
    conceptIds: [`${entry.id}-framework`],
    citationIds: [`${entry.id}-paper`],
    sourceTrail: canonicalSources(entry.id),
  }));

export const chapterRegistry = parseChapterRegistry([
  {
    ownerId: 'umbrella',
    slug: 'umbrella',
    title: 'Harness Architecture Framework',
    curationStatus: 'curated',
    summary: 'Opening formal chapter that frames AI coding agent harness architecture as a source-grounded system of semantic, execution, assurance, operational, and security axes.',
    sections: {
      problem: 'AI coding agents now perform multi-step software engineering work, but the surrounding harness decisions for context, verification, coordination, governance, economics, routing, human supervision, and security remain too ad hoc for research-grade reasoning.',
      coreModel: 'The umbrella model treats the harness as the mediating architecture between human intent and agent execution, decomposed into semantic, execution, assurance, operational, and security axes that connect all pillar papers.',
      keyNotation: 'Key notation includes the abstraction gap \\mathcal{G}(S,P), compound pipeline reliability R=p^n, verified iteration metrics, and the governance capacity condition R_{\\text{drift}} < C_{\\text{gov}}.',
      definitions: 'Harness architecture is defined as the structured environment that supplies source context, constrains actions, verifies outputs, coordinates work, and preserves architectural information for AI coding agents.',
      formalClaims: 'The umbrella slice records the harness-architecture definition and the compound-error theorem seed, including the p^n sensitivity claim used to connect umbrella exposition to reliability.',
      derivationContext: 'The opening chapter points to the canonical paper for derivations of the abstraction gap, compound reliability, structural enforcement dominance, and governance capacity bounds; later plans expand those derivations into notebook-style walkthroughs.',
      interpretation: 'The useful reading is not that the pillars are exhaustive, but that the decomposition is productive: it gives researchers stable terms, IDs, and source trails for comparing harness design choices.',
      relatedPillars: 'The chapter links to all twelve pillar owners and normalizes cross-corpus concepts so later graph and search work can consume stable object and concept IDs.',
      citations: 'The primary citation trail is science/paper/science.tex, science/paper/science.pdf, and science/paper/science.bib, with the umbrella bibliography carrying the external evidence base.',
      sourceTrail: 'Canonical source trail: science/paper/science.tex for source, science/paper/science.pdf for the paper artifact, and science/paper/science.bib for citations.',
    },
    formalObjectIds: ['umbrella.harness-architecture', 'reliability.compound-error-bound'],
    conceptIds: ['harness-architecture', 'semantic-axis', 'execution-axis', 'assurance-axis'],
    citationIds: ['science-paper'],
    sourceTrail: canonicalSources('umbrella'),
  },
  ...curatedChapters.map((chapter) => {
    const entry = corpusEntry(chapter.ownerId);
    return {
      ownerId: chapter.ownerId as OwnerId,
      slug: entry.slug,
      title: entry.title,
      curationStatus: 'curated' as const,
      summary: chapter.summary,
      sections: chapter.sections,
      formalObjectIds: chapter.formalObjectIds,
      conceptIds: chapter.conceptIds,
      citationIds: chapter.citationIds,
      sourceTrail: canonicalSources(chapter.ownerId),
    };
  }),
  ...minimalChapters,
]);
