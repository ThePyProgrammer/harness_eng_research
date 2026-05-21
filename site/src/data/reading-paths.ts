import { chapterRegistry } from './chapters';
import { conceptRegistry } from './concepts';
import { corpusEntries } from './corpus';
import { citations, formalRegistry } from './formal-registry';
import { parseReadingPaths, type DiscoveryTargetRef, type ReadingPath } from './discovery.schema';
import type { OwnerId } from './formal-registry.schema';

const corpusById = new Map(corpusEntries.map((entry) => [entry.id, entry]));
const chaptersByOwner = new Map(chapterRegistry.map((chapter) => [chapter.ownerId, chapter]));
const conceptsById = new Map(conceptRegistry.map((concept) => [concept.id, concept]));
const formalObjectsById = new Map(formalRegistry.map((object) => [object.id, object]));
const citationsById = new Map(citations.map((citation) => [citation.id, citation]));

const routeSlugs = [
  'building-a-harness',
  'scaling-multi-agent-work',
  'cost-latency',
  'production-hardening',
  'ai-code-degradation',
] as const;

export type ReadingPathSlug = (typeof routeSlugs)[number];

function assertKnownReadingPath(id: string): void {
  if (!routeSlugs.includes(id as ReadingPathSlug)) {
    throw new Error(`Missing reading path target: ${id}`);
  }
}

function chapterTarget(id: OwnerId): DiscoveryTargetRef {
  const entry = corpusById.get(id);
  if (!entry || !chaptersByOwner.has(id)) {
    throw new Error(`Missing chapter target: ${id}`);
  }

  return { type: 'chapter', id, href: `/corpus/${entry.slug}/` };
}

function conceptTarget(id: string): DiscoveryTargetRef {
  if (!conceptsById.has(id)) {
    throw new Error(`Missing concept target: ${id}`);
  }

  return { type: 'concept', id, href: `/glossary/#${id}` };
}

function formalTarget(id: string): DiscoveryTargetRef {
  const object = formalObjectsById.get(id);
  if (!object) {
    throw new Error(`Missing formal-object target: ${id}`);
  }
  const owner = corpusById.get(object.ownerId);
  if (!owner) {
    throw new Error(`Missing owner for formal-object target: ${id}`);
  }

  return { type: 'formal-object', id, href: `/corpus/${owner.slug}/#${id}` };
}

function citationTarget(id: string): DiscoveryTargetRef {
  if (!citationsById.has(id)) {
    throw new Error(`Missing citation target: ${id}`);
  }

  return { type: 'citation', id, href: `/formal-registry/#${id}` };
}

function readingPathTarget(id: ReadingPathSlug): DiscoveryTargetRef {
  assertKnownReadingPath(id);

  return { type: 'reading-path', id, href: `/reading-paths/${id}/` };
}

const curatedReadingPaths = [
  {
    slug: 'building-a-harness',
    title: 'Building a harness',
    theme: 'Harness architecture from intent to verified execution',
    purpose: 'Trace the atlas route from the umbrella framework into the abstraction, information, reliability, and security controls that make an AI coding harness inspectable.',
    branches: [
      {
        id: 'architecture-spine',
        title: 'Architecture spine',
        summary: 'Start with the formal shape of the harness before choosing individual controls.',
        stops: [
          {
            id: 'harness-framework',
            title: 'Harness architecture framework',
            target: formalTarget('umbrella.harness-architecture'),
            why: 'This definition names the full system around the agent, preventing the route from collapsing into a prompt-engineering checklist.',
          },
          {
            id: 'specification-gap',
            title: 'Specification-refinement gap',
            target: formalTarget('abstraction.specification-refinement-gap'),
            why: 'Abstraction explains where informal intent loses force before code exists, which is the first boundary a harness must make visible.',
          },
          {
            id: 'context-degradation',
            title: 'Context degradation',
            target: conceptTarget('context-degradation'),
            why: 'A harness cannot refine what it failed to retrieve; this concept ties route design to source selection and omission risk.',
          },
        ],
      },
      {
        id: 'verification-boundaries',
        title: 'Verification and authority boundaries',
        summary: 'Follow the route through checks, contained authority, and source-backed evidence.',
        stops: [
          {
            id: 'compound-error-bound',
            title: 'Compound error sensitivity',
            target: formalTarget('reliability.compound-error-bound'),
            why: 'The reliability theorem shows why a harness needs scheduled checks instead of trusting plausible intermediate steps.',
          },
          {
            id: 'prompt-boundary',
            title: 'Prompt injection boundary',
            target: formalTarget('security.prompt-injection-boundary'),
            why: 'Security marks where untrusted text can steer authority-bearing behavior, a critical route stop before tool access or credential flow.',
          },
          {
            id: 'science-citation',
            title: 'Umbrella source trail',
            target: citationTarget('science-paper'),
            why: 'The route remains a source-grounded atlas by ending at the canonical paper trail rather than an untraceable summary.',
          },
        ],
      },
    ],
  },
  {
    slug: 'scaling-multi-agent-work',
    title: 'Scaling multi-agent work',
    theme: 'Coordination, verified cadence, and routing under parallelism',
    purpose: 'Compare the route where more agents help against the route where ownership, verification delay, and model assignment erase the apparent speedup.',
    branches: [
      {
        id: 'parallelism-payoff',
        title: 'Parallelism payoff',
        summary: 'Use coordination math to decide whether splitting work actually buys useful throughput.',
        stops: [
          {
            id: 'agent-decomposition',
            title: 'Agent decomposition',
            target: formalTarget('coordination.agent-decomposition'),
            why: 'This definition forces the split to include ownership, merge, and review boundaries instead of merely launching more workers.',
          },
          {
            id: 'quality-adjusted-speedup',
            title: 'Quality-adjusted speedup',
            target: conceptTarget('quality-adjusted-speedup'),
            why: 'The speedup concept discounts the route by conflict repair and quality loss, giving researchers a non-naive scaling lens.',
          },
          {
            id: 'coordination-chapter',
            title: 'Coordination chapter',
            target: chapterTarget('coordination'),
            why: 'The chapter collects the multi-agent route map with the source trail and formal objects in one place.',
          },
        ],
      },
      {
        id: 'cadence-and-routing',
        title: 'Cadence and routing',
        summary: 'Ask whether parallel work remains verified, fresh, and assigned to the right model tier.',
        stops: [
          {
            id: 'verified-iterations',
            title: 'Verified iterations per hour',
            target: formalTarget('temporal.verified-iterations-per-hour'),
            why: 'This route stop separates raw activity from verified progress, which is the cranky but necessary scaling metric.',
          },
          {
            id: 'stage-specific-routing',
            title: 'Stage-specific routing',
            target: formalTarget('model-routing.stage-specific-routing'),
            why: 'Routing shows when planning, implementation, verification, and escalation deserve different model choices under parallel load.',
          },
          {
            id: 'production-hardening-bridge',
            title: 'Bridge into production hardening',
            target: readingPathTarget('production-hardening'),
            why: 'Once scaling introduces more surfaces, the next route is hardening the checks, policies, and security boundaries around them.',
          },
        ],
      },
    ],
  },
  {
    slug: 'cost-latency',
    title: 'Cost and latency',
    theme: 'Economic discipline for retrieval, verification, routing, and attention',
    purpose: 'Map the tradeoffs that decide when spending tokens, latency, model tiers, cache budget, or human review is justified.',
    branches: [
      {
        id: 'budget-equations',
        title: 'Budget equations',
        summary: 'Begin with the formal cost-value vocabulary before optimizing knobs.',
        stops: [
          {
            id: 'harness-budget',
            title: 'Harness budget',
            target: formalTarget('economics.harness-budget'),
            why: 'The economics definition makes cost a first-class harness resource rather than an after-the-fact invoice.',
          },
          {
            id: 'cvih',
            title: 'Cost-value information for harnesses',
            target: formalTarget('economics.cost-value-information-harness'),
            why: 'CVIH is the route stop for asking whether a retrieval, verification, or escalation action is worth its marginal cost.',
          },
          {
            id: 'economics-chapter',
            title: 'Economics chapter',
            target: chapterTarget('economics'),
            why: 'The chapter keeps token, latency, queueing, caching, and model-tier choices in one source-trailed frame.',
          },
        ],
      },
      {
        id: 'latency-and-attention',
        title: 'Latency and attention',
        summary: 'Route from machine latency into the scarce human review budget.',
        stops: [
          {
            id: 'viph-equation',
            title: 'VIPH equation',
            target: formalTarget('temporal.viph-equation'),
            why: 'Temporal cost only matters if it changes verified iteration rate, so this anchor ties latency to research progress.',
          },
          {
            id: 'routing-utility',
            title: 'Stage utility equation',
            target: formalTarget('model-routing.stage-utility-equation'),
            why: 'Routing utility connects quality gain to latency and token cost at each stage instead of applying one model everywhere.',
          },
          {
            id: 'attention-allocation',
            title: 'Attention allocation',
            target: conceptTarget('attention-allocation'),
            why: 'Human review is the expensive resource many cost models conveniently forget; this stop fixes that omission.',
          },
        ],
      },
    ],
  },
  {
    slug: 'production-hardening',
    title: 'Production hardening',
    theme: 'Reliability, governance, human approval, and security under real authority',
    purpose: 'Follow the route from checks and policies to trust boundaries so the static corpus can explain deployable harness discipline without adding runtime services.',
    branches: [
      {
        id: 'assurance-stack',
        title: 'Assurance stack',
        summary: 'Layer verification, quality defenses, and governance before relying on agent output.',
        stops: [
          {
            id: 'compound-error',
            title: 'Compound error',
            target: conceptTarget('compound-error'),
            why: 'Production hardening starts by admitting that locally plausible steps compound into system-level failure risk.',
          },
          {
            id: 'layered-defense',
            title: 'Layered defense detection limit',
            target: formalTarget('quality.layered-defense-detection'),
            why: 'Quality defenses need layers because no single detector sees every slop or correctness failure mode.',
          },
          {
            id: 'governance-ratchet',
            title: 'Governance ratchet',
            target: formalTarget('governance.governance-ratchet'),
            why: 'Production changes create future enforcement obligations; this stop explains why policy capacity matters.',
          },
        ],
      },
      {
        id: 'authority-stack',
        title: 'Authority stack',
        summary: 'Bind autonomy, credentials, and untrusted input to explicit approval and containment routes.',
        stops: [
          {
            id: 'autonomy-boundary',
            title: 'Autonomy boundary condition',
            target: formalTarget('human-interaction.autonomy-boundary'),
            why: 'Hardening needs a reasoned boundary for where human approval remains mandatory and where autonomy is reversible enough.',
          },
          {
            id: 'sandbox-condition',
            title: 'Defense-in-depth sandbox condition',
            target: formalTarget('security.defense-in-depth-sandbox'),
            why: 'The security theorem ties prompt boundaries, sandboxes, credentials, and output filtering into one deployable route.',
          },
          {
            id: 'security-paper',
            title: 'Security canonical paper',
            target: citationTarget('security-paper'),
            why: 'The hardening route should end with the canonical source for authority and trust-boundary claims.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ai-code-degradation',
    title: 'AI code degradation',
    theme: 'From plausible local code to accumulated architecture damage',
    purpose: 'Study the route where plausible generated code becomes quality debt, governance overload, and accreted architectural drift.',
    branches: [
      {
        id: 'local-plausibility',
        title: 'Local plausibility',
        summary: 'Inspect the individual generated change before it becomes part of the aggregate damage pattern.',
        stops: [
          {
            id: 'ai-code-slop',
            title: 'AI code slop',
            target: formalTarget('quality.ai-code-slop'),
            why: 'This definition names generated code that looks acceptable while hiding maintainability or semantic defects.',
          },
          {
            id: 'plausible-local-change',
            title: 'Plausible local change',
            target: conceptTarget('plausible-local-change'),
            why: 'Accretion begins when each local patch can be defended in isolation, which is precisely the dangerous route branch.',
          },
          {
            id: 'quality-chapter',
            title: 'Quality chapter',
            target: chapterTarget('quality'),
            why: 'The quality chapter places slop, detection limits, and cost of quality into a single formal reading surface.',
          },
        ],
      },
      {
        id: 'aggregate-drift',
        title: 'Aggregate drift',
        summary: 'Follow the damage as plausible patches accumulate beyond review and repair capacity.',
        stops: [
          {
            id: 'collective-harm',
            title: 'Collective harm threshold',
            target: formalTarget('accretion.collective-harm-threshold'),
            why: 'This lemma is the route stop where individual plausibility stops being persuasive because aggregate harm dominates.',
          },
          {
            id: 'capacity-ratchet',
            title: 'Capacity ratchet equation',
            target: formalTarget('governance.capacity-ratchet-equation'),
            why: 'Governance capacity determines whether the organization can enforce the theory that generated patches keep eroding.',
          },
          {
            id: 'hardening-bridge',
            title: 'Bridge into production hardening',
            target: readingPathTarget('production-hardening'),
            why: 'The repair route for degradation is layered hardening: assurance, authority boundaries, and source-grounded policy.',
          },
        ],
      },
    ],
  },
] satisfies ReadingPath[];

export const readingPaths = parseReadingPaths(curatedReadingPaths);

export function getReadingPathBySlug(slug: string): ReadingPath | undefined {
  return readingPaths.find((path) => path.slug === slug);
}
