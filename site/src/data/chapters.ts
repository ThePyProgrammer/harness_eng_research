import { corpusEntries } from './corpus';
import { derivationCoverageByOwner } from './formal-registry';
import { parseChapterRegistry, type ChapterRecord, type OwnerId, type SourceTrailItem } from './formal-registry.schema';

interface ChapterSeed {
  ownerId: OwnerId;
  summary: string;
  formalObjectIds: string[];
  conceptIds: string[];
  citationIds: string[];
  focus: string;
  model: string;
  notation: string;
  definition: string;
  claim: string;
  interpretation: string;
  related: string;
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

function supportedDerivationText(ownerId: OwnerId): string {
  return derivationCoverageByOwner[ownerId]
    .map((entry) => entry.status === 'supported'
      ? `The canonical source ${entry.sourcePath} supports notebook-style registry derivations ${entry.formalObjectIds.join(', ')}.`
      : entry.rationale)
    .join(' ');
}

const chapterSeeds: ChapterSeed[] = [
  {
    ownerId: 'umbrella',
    summary: 'Opening formal chapter that frames AI coding agent harness architecture as a source-grounded system of semantic, execution, assurance, operational, human, routing, security, and accretion dimensions.',
    formalObjectIds: ['umbrella.harness-architecture', 'umbrella.harness-axis-equation', 'reliability.compound-error-bound'],
    conceptIds: ['harness-architecture'],
    citationIds: ['science-paper'],
    focus: 'AI coding agents now perform multi-step software engineering work, but the surrounding harness decisions for context, verification, coordination, governance, economics, routing, human supervision, and security remain too ad hoc for research-grade reasoning.',
    model: 'The umbrella model treats the harness as the mediating architecture between human intent and agent execution, decomposed into stable axes that connect all pillar papers without replacing their canonical sources.',
    notation: 'Key notation includes the abstraction gap \\mathcal{G}(S,P), compound pipeline reliability R=p^n, verified iteration metrics, and governance capacity conditions such as R_{drift} < C_{gov}.',
    definition: 'Harness architecture is defined as the structured environment that supplies source context, constrains actions, verifies outputs, coordinates work, and preserves architectural information for AI coding agents.',
    claim: 'The umbrella claim is that a typed, source-trailed harness architecture lets researchers compare semantic, execution, assurance, operational, human, routing, security, and accretion decisions under one registry.',
    interpretation: 'The useful reading is not that the pillars are exhaustive, but that the decomposition gives researchers stable terms, IDs, and source trails for comparing harness design choices.',
    related: 'The opening chapter points to all twelve pillars and normalizes cross-corpus concepts so later graph and search work can consume stable object and concept IDs.',
  },
  {
    ownerId: 'abstraction',
    summary: 'Curated formal chapter on specification-to-code gaps, refinement boundaries, and explicit interface contracts for agent harnesses.',
    formalObjectIds: ['abstraction.specification-refinement-gap', 'abstraction.refinement-interface-contract', 'abstraction.gap-decomposition-equation', 'abstraction.canonical-paper-citation'],
    conceptIds: ['specification-refinement-gap', 'harness-architecture'],
    citationIds: ['abstraction-paper'],
    focus: 'Abstraction fails when the agent receives intent as prose but must produce code whose obligations are sharper than the prompt. The chapter frames the practical problem as specification-to-code drift that needs explicit harness boundaries.',
    model: 'The core model treats the harness as a refinement mediator between specification S and program P, adding interfaces, checked assumptions, and reviewable refinement boundaries.',
    notation: 'Primary notation includes the abstraction gap \\mathcal{G}(S,P), the source specification S, the produced program P, and decomposition terms for ambiguity, interface loss, and refinement drift.',
    definition: 'The central definition abstraction.specification-refinement-gap names the distance between intended specification and implemented behavior after translation through prompts and refinement interfaces.',
    claim: 'The proposition abstraction.refinement-interface-contract states that harnesses reduce abstraction failure when informal intent is turned into explicit interface and invariant obligations.',
    interpretation: 'A research-grade harness cannot eliminate ambiguity, but it can name where ambiguity enters and attach checkpoints before generated code is accepted as faithful refinement.',
    related: 'Abstraction links to Information because context selection determines what can be refined, and to Reliability because refinement checks become verification gates.',
  },
  {
    ownerId: 'information',
    summary: 'Curated formal chapter on context degradation, relevance selection, tiered memory, and reuse discovery as managed harness resources.',
    formalObjectIds: ['information.context-degradation', 'information.relevance-selection-bound', 'information.context-loss-equation', 'information.canonical-paper-citation'],
    conceptIds: ['context-degradation', 'harness-architecture'],
    citationIds: ['information-paper'],
    focus: 'Information failures appear when an agent has enough tokens but not the right evidence. Retrieval, compression, ordering, and reuse are formal harness decisions rather than generic prompt-size concerns.',
    model: 'The core model represents context as a selected and ordered information bundle whose relevance, freshness, and reuse value determine whether the agent can act faithfully.',
    notation: 'Key notation includes task context C_{task}, relevant information I_{relevant}, and a degradation term D_{context}.',
    definition: 'The central definition information.context-degradation names the loss of task-relevant information as the harness selects, compresses, orders, and reuses source material.',
    claim: 'The proposition information.relevance-selection-bound records that ranking and tiering context by relevance, freshness, and reuse value reduces omissions and distractions.',
    interpretation: 'The rigorous move is to ask which facts were selected, which facts were omitted, and how that policy changes downstream formal claims.',
    related: 'Information follows Abstraction in the conceptual arc and links to Economics, where retrieval has cost, and Model Routing, where information quality can trigger escalation.',
  },
  {
    ownerId: 'reliability',
    summary: 'Curated formal chapter on compound error, pipeline reliability, structural enforcement, and verification scheduling.',
    formalObjectIds: ['reliability.compound-error', 'reliability.compound-error-bound', 'reliability.pipeline-reliability-equation', 'reliability.canonical-paper-citation'],
    conceptIds: ['compound-error', 'verification-scheduling', 'harness-architecture'],
    citationIds: ['reliability-paper'],
    focus: 'Reliability fails multiplicatively in agent workflows: a sequence of plausible local steps can still produce an incorrect final change.',
    model: 'The core model starts from multi-step pipelines where every required step must succeed, then adds verification scheduling, structural enforcement, and adaptive checks.',
    notation: 'Key notation includes R=p^n, per-step reliability p, pipeline length n, and verification schedules that alter effective step reliability.',
    definition: 'The chapter defines compound error as the end-to-end failure risk created by several individually plausible agent steps.',
    claim: 'The theorem reliability.compound-error-bound states that independent per-step reliability p compounds as R=p^n, making long pipelines fragile.',
    interpretation: 'A harness can look impressive at each local step while failing at the pipeline level, so reliability belongs in architecture rather than late manual QA.',
    related: 'Reliability depends on Abstraction for obligations, Information for evidence, Coordination for merge surfaces, and Temporal for verified cadence.',
  },
  {
    ownerId: 'coordination',
    summary: 'Curated formal chapter on multi-agent decomposition, merge conflict surfaces, ownership, and quality-adjusted speedup.',
    formalObjectIds: ['coordination.agent-decomposition', 'coordination.quality-adjusted-speedup', 'coordination.speedup-adjustment-equation', 'coordination.canonical-paper-citation'],
    conceptIds: ['quality-adjusted-speedup', 'harness-architecture'],
    citationIds: ['coordination-paper'],
    focus: 'Coordination becomes dangerous when parallel agents appear faster but create hidden merge conflicts, ownership ambiguity, and quality loss.',
    model: 'The core model treats multi-agent work as decomposition plus coordination overhead: work units, ownership boundaries, merge surfaces, and review gates.',
    notation: 'Key notation includes quality-adjusted speedup S_q, coordination overhead O_{coord}, and quality-retention factors Q_{retained}.',
    definition: 'The definition coordination.agent-decomposition names the division of a software task into agent-owned units with explicit merge, ownership, and review boundaries.',
    claim: 'The theorem coordination.quality-adjusted-speedup states that parallel harness execution should discount ideal speedup by merge conflicts, coordination overhead, and quality loss.',
    interpretation: 'The point is not to avoid multi-agent harnesses; it is to stop pretending that more agents automatically mean more throughput.',
    related: 'Coordination sits after Reliability because multi-agent work expands the reliability surface and feeds Temporal, Economics, and Model Routing choices.',
  },
  {
    ownerId: 'temporal',
    summary: 'Curated formal chapter on verified iterations per hour, staleness, speculation, caching, and speed-quality tradeoffs.',
    formalObjectIds: ['temporal.iteration-cadence', 'temporal.verified-iterations-per-hour', 'temporal.viph-equation', 'temporal.canonical-paper-citation'],
    conceptIds: ['verified-iterations-per-hour', 'harness-architecture'],
    citationIds: ['temporal-paper'],
    focus: 'Temporal harness failures occur when speed is optimized without asking whether completed iterations are verified, fresh, or still relevant.',
    model: 'The core model measures cycles of agent work, verification delay, cache reuse, speculation, and staleness to separate raw activity from verified progress.',
    notation: 'Key notation includes VIPH, elapsed hours H, verified iteration count V, and verification latency T_{verify}.',
    definition: 'The chapter defines iteration cadence as the rate of meaningful agent work cycles that preserve verification.',
    claim: 'The proposition temporal.verified-iterations-per-hour states that harnesses should optimize verified iterations per hour rather than prompt completions per hour.',
    interpretation: 'If the result is stale, speculative, cached past its evidence horizon, or unchecked, apparent acceleration does not count as verified research progress.',
    related: 'Temporal links to Reliability through verification scheduling, Coordination through parallel cycles, Economics through latency cost, and Model Routing through escalation.',
  },
  {
    ownerId: 'quality',
    summary: 'Curated formal chapter on AI code slop, layered defense, detection limits, accretion, and cost of quality.',
    formalObjectIds: ['quality.ai-code-slop', 'quality.layered-defense-detection', 'quality.defect-cost-equation', 'quality.canonical-paper-citation'],
    conceptIds: ['ai-code-slop', 'harness-architecture'],
    citationIds: ['quality-paper'],
    focus: 'Quality failures arise when generated code is plausible enough to merge yet still erodes maintainability, semantic correctness, or architectural clarity.',
    model: 'The core model treats generated defects as probabilistic quality debt filtered through layered defenses: static checks, tests, review, invariants, and provenance-aware evaluation.',
    notation: 'Key notation includes expected quality cost C_q, defect probability p_{defect}, defense layers L_{defense}, and downstream repair loss.',
    definition: 'The central definition quality.ai-code-slop names plausible generated code that carries latent maintainability or architectural defects.',
    claim: 'The proposition quality.layered-defense-detection states that no single detector catches all slop modes, so harnesses need layered defenses with explicit evidence.',
    interpretation: 'Quality is the chapter where local plausibility is treated as suspicious rather than sufficient; the harness must ask what kind of defect each gate is able to see.',
    related: 'Quality links to Reliability for error propagation, Governance for enforcement capacity, Economics for cost of quality, and Accretion for accumulated harm.',
  },
  {
    ownerId: 'governance',
    summary: 'Curated formal chapter on governance capacity, ratchets, decision survival, and theory preservation.',
    formalObjectIds: ['governance.governance-capacity', 'governance.governance-ratchet', 'governance.capacity-ratchet-equation', 'governance.canonical-paper-citation'],
    conceptIds: ['governance-ratchet', 'harness-architecture'],
    citationIds: ['governance-paper'],
    focus: 'Governance failures occur when agent throughput exceeds the organization ability to preserve decisions, enforce constraints, and keep architectural theory coherent.',
    model: 'The core model compares governance capacity against ratcheting obligations created by accepted decisions and generated changes.',
    notation: 'Key notation includes ratchet load R_{drift}, governance capacity C_{gov}, and decision-survival state D_t.',
    definition: 'The chapter defines governance capacity as the ability to preserve decisions, enforce constraints, and keep architectural intent alive under high generated-change volume.',
    claim: 'The theorem governance.governance-ratchet states that each accepted decision can increase future enforcement obligations until ratchet load exceeds governance capacity.',
    interpretation: 'Governance is not paperwork bolted onto an agent system; it is the mechanism that prevents local changes from erasing the theory the harness depends on.',
    related: 'Governance links to Quality for enforcement, Economics for review budgets, Human Interaction for attention limits, and Accretion for drift accumulation.',
  },
  {
    ownerId: 'economics',
    summary: 'Curated formal chapter on token budgets, model-tier choice, queueing economics, CVIH, and caching economics.',
    formalObjectIds: ['economics.harness-budget', 'economics.cost-value-information-harness', 'economics.cvih-equation', 'economics.canonical-paper-citation'],
    conceptIds: ['cost-value-information-harness', 'harness-architecture'],
    citationIds: ['economics-paper'],
    focus: 'Economics failures happen when harnesses spend tokens, latency, model calls, and human attention without comparing cost to value.',
    model: 'The core model treats retrieval, verification, escalation, caching, and model-tier selection as marginal investments with cost, expected value, and queueing effects.',
    notation: 'Key notation includes CVIH, expected value E[V], token cost C_{token}, and latency or queueing cost terms.',
    definition: 'The chapter defines a harness budget as allocation of token, latency, model-tier, cache, and human-review resources across an agent workflow.',
    claim: 'The proposition economics.cost-value-information-harness states that a harness action is justified when expected quality or information value exceeds marginal cost.',
    interpretation: 'Cheap is not automatically good and expensive is not automatically rigorous; economics supplies the discipline for choosing verification, retrieval, caching, or escalation.',
    related: 'Economics binds Information retrieval, Temporal delay, Model Routing choices, and Human Interaction because human attention is an expensive harness resource.',
  },
  {
    ownerId: 'human-interaction',
    summary: 'Curated formal chapter on human attention allocation, autonomy boundaries, trust calibration, and supervision decay.',
    formalObjectIds: ['human-interaction.attention-allocation', 'human-interaction.autonomy-boundary', 'human-interaction.attention-budget-equation', 'human-interaction.canonical-paper-citation'],
    conceptIds: ['attention-allocation', 'harness-architecture'],
    citationIds: ['human-interaction-paper'],
    focus: 'Human Interaction failures appear when supervision is treated as always available even though human attention is scarce, interruptible, and vulnerable to trust miscalibration.',
    model: 'The core model allocates finite attention across review points, autonomy boundaries, and escalation decisions according to expected risk reduction and reversibility.',
    notation: 'Key notation includes human attention A_h, attention budget B_{attention}, risk reduction R_{human}, and autonomy boundary thresholds.',
    definition: 'The definition human-interaction.attention-allocation names the distribution of scarce human review and steering effort across agent work.',
    claim: 'The proposition human-interaction.autonomy-boundary states that autonomy expands safely only where trust calibration, review evidence, and reversibility justify removing direct supervision.',
    interpretation: 'A serious harness does not romanticize the human-in-the-loop. It schedules scarce judgment where it matters and avoids turning people into decorative approvers.',
    related: 'Human Interaction links to Economics because attention has cost, Governance because decisions need accountable owners, and Security because sensitive actions need escalation.',
  },
  {
    ownerId: 'model-routing',
    summary: 'Curated formal chapter on stage-specific model assignment, cross-model diversity, cascades, and escalation.',
    formalObjectIds: ['model-routing.routing-policy', 'model-routing.stage-specific-routing', 'model-routing.stage-utility-equation', 'model-routing.canonical-paper-citation'],
    conceptIds: ['stage-specific-routing', 'harness-architecture'],
    citationIds: ['model-routing-paper'],
    focus: 'Model Routing failures occur when every stage uses the same model despite different reasoning demands, costs, uncertainties, and verification options.',
    model: 'The core model assigns candidate models to task stages such as planning, implementation, verification, and escalation by comparing expected quality, uncertainty, latency, and token cost.',
    notation: 'Key notation includes utility U(m,s) for model m at stage s, quality contribution Q_m, and cost C_m.',
    definition: 'The chapter defines a routing policy as assignment of model tiers to task stages with escalation thresholds.',
    claim: 'The theorem model-routing.stage-specific-routing states that stage-specific routing dominates one-size-fits-all model selection when stages differ in reasoning demand and cost sensitivity.',
    interpretation: 'The harness should know when a cheap model is sufficient, when diversity helps, and when correctness or uncertainty dominates cost.',
    related: 'Model Routing depends on Economics for cost-value tradeoffs, Temporal for latency, Reliability for verification stages, and Information for context quality signals.',
  },
  {
    ownerId: 'security',
    summary: 'Curated formal chapter on sandboxing, credential flow, prompt injection, output filtering, and defense-in-depth.',
    formalObjectIds: ['security.prompt-injection-boundary', 'security.defense-in-depth-sandbox', 'security.attack-surface-equation', 'security.canonical-paper-citation'],
    conceptIds: ['prompt-injection-boundary', 'harness-architecture'],
    citationIds: ['security-paper'],
    focus: 'Security failures happen when untrusted content, tool outputs, credentials, and generated code cross trust boundaries without containment.',
    model: 'The core model separates privileged harness control from untrusted context channels, sandboxed execution, scoped credentials, and filtered outputs.',
    notation: 'Key notation includes attack surface A_{surface}, untrusted context T_{untrusted}, and prompt boundary B_{prompt}.',
    definition: 'The definition security.prompt-injection-boundary identifies where untrusted text or tool output can influence agent instructions and must be isolated from privileged control.',
    claim: 'The theorem security.defense-in-depth-sandbox states that prompt injection defenses, sandboxing, credential scoping, and output filtering must be layered.',
    interpretation: 'Security is a harness architecture property, not a warning label on prompts; every authority-bearing edge needs a visible boundary and source-grounded rationale.',
    related: 'Security links to Human Interaction for approval gates, Governance for policy enforcement, Reliability for containment checks, and Information for untrusted context handling.',
  },
  {
    ownerId: 'accretion',
    summary: 'Curated formal chapter on individually plausible but collectively harmful AI-generated code.',
    formalObjectIds: ['accretion.plausible-local-change', 'accretion.collective-harm-threshold', 'accretion.accumulation-drift-equation', 'accretion.canonical-paper-citation'],
    conceptIds: ['plausible-local-change', 'harness-architecture'],
    citationIds: ['accretion-paper'],
    focus: 'Accretion failures arise when many generated changes look locally acceptable but collectively damage architecture, readability, and maintenance cost.',
    model: 'The core model sums plausible local changes over time and compares accumulated drift against detection, governance, and repair capacity.',
    notation: 'Key notation includes local change \\Delta_t, accretion drift D_{accretion}, and repair capacity C_{repair}.',
    definition: 'The definition accretion.plausible-local-change names an AI-generated modification that appears acceptable in isolation but contributes to collectively harmful drift.',
    claim: 'The lemma accretion.collective-harm-threshold states that aggregate harm can exceed review capacity even when each accepted change seemed defensible alone.',
    interpretation: 'Accretion is the cranky lesson of the corpus: local plausibility is not an architectural proof, and without aggregate accounting the codebase slowly loses its shape.',
    related: 'Accretion links back to Quality, Governance, Reliability, and Abstraction because local defects accumulate through every weak boundary in the harness.',
  },
];

function toChapter(seed: ChapterSeed): ChapterRecord {
  const entry = corpusEntry(seed.ownerId);
  const derivationText = supportedDerivationText(seed.ownerId);
  return {
    ownerId: seed.ownerId,
    slug: entry.slug,
    title: entry.title,
    curationStatus: 'curated',
    summary: seed.summary,
    sections: {
      problem: seed.focus,
      coreModel: seed.model,
      keyNotation: seed.notation,
      definitions: seed.definition,
      formalClaims: seed.claim,
      derivationContext: `${derivationText} The chapter keeps the derivation visible in registry form so readers can inspect source-supported equations or source-grounded non-support rationales instead of relying on where-curated prose.`,
      interpretation: seed.interpretation,
      relatedPillars: seed.related,
      citations: `The citation trail is manually curated from ${entry.canonicalTex}, ${entry.canonicalPdf}, and ${entry.bibliography} via ${seed.citationIds.join(', ')}.`,
      sourceTrail: `Canonical source trail: ${entry.canonicalTex} for the source, ${entry.canonicalPdf} for the paper artifact, and ${entry.bibliography} for citations.`,
    },
    formalObjectIds: seed.formalObjectIds,
    conceptIds: seed.conceptIds,
    citationIds: seed.citationIds,
    sourceTrail: canonicalSources(seed.ownerId),
  };
}

export const chapterRegistry = parseChapterRegistry(chapterSeeds.map(toChapter));
