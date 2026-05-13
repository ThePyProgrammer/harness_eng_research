# Architectural Governance and Theory Preservation in AI Coding Agent Harnesses

## 1. The Architectural Drift Problem

Analysis of over 200 million lines of code shows an [8x increase in duplicated blocks](https://www.infoq.com/news/2025/11/ai-code-technical-debt/) after mass AI adoption, with refactoring activity dropping 40%. The aggregate effect is what Ox Security's "Army of Juniors" report characterizes as code that is "highly functional but systematically lacking in architectural judgment." Each generated function passes its tests; the system as a whole slowly loses coherence.

AI-generated code is [optimized for completion, not cohesion](https://ait.inc/tech-stuffs/how-ai-generated-code-is-reshaping-software-architecture/). It satisfies the local prompt without considering how a change interacts with other modules or respects layering boundaries. Sylvester (2026) calls this ["context drift"](https://medium.com/@TimSylvester/the-architecture-is-the-plan-fixing-agent-context-drift-78095b67d838), where the agent's working model diverges from the actual architecture with every generation. ITBrief reports a [2026 reset toward architecture-first AI coding tools](https://itbrief.asia/story/ai-coding-tools-face-2026-reset-towards-architecture), with enterprises demanding tools that respect internal abstractions.

The core tension is temporal. Human architects think in trajectories (where is this system heading?), while AI agents think in snapshots (what does this prompt need right now?). Drift is the integral of that gap over time.

## 2. Blueprint's Governance Model

Blueprint attacks drift through a formal lifecycle state machine for Architecture Decision Records: Proposed, Accepted, Audited, Enforced, Revisited. This is not mere documentation; it is a governance protocol with 21 specialized agents performing distinct roles (researcher, devil's advocate, forces evaluator, compliance auditor, drift detector, Conway's Law analyzer, and others).

Three mechanisms distinguish this from conventional ADR practice:

**Continuous governance.** Drift detection operates via git trajectory analysis, not point-in-time audits. The reflexion model compares intended architecture (from ADRs and ARCHITECTURE.md) against actual source structure, reporting convergences, divergences, and absences with file-level evidence. Evidence expiry tracking flags that roughly 23% of supporting evidence goes stale within two months, triggering automatic revisitation.

**Adversarial challenge.** No ADR reaches Accepted status without passing through a devil's advocate agent that probes for unconsidered alternatives, hidden risks, and faulty assumptions. The DCAR forces evaluator systematically weighs arguments and scores decisions as confirmed or needs-re-evaluation.

**Multi-paradigm analysis.** Blueprint integrates 15 architecture paradigms (ATAM, Wardley Mapping, DDD bounded contexts, C4, arc42, 4+1 views, Technology Radar) rather than committing to a single framework. This matters because different paradigms illuminate different failure modes.

The closest external analog is [Archgate](https://archgate.dev/), which turns ADRs into executable rules enforced in CI and pre-commit hooks. Archgate's "ratchet" model (every violation found during review becomes a permanent automated rule) is complementary to Blueprint's agent-based approach; [O'Reilly's coverage of agentic architecture governance](https://www.oreilly.com/radar/how-agentic-ai-empowers-architecture-governance/) suggests the convergence of these approaches is inevitable. The [Agent Decision Record (AgDR) project](https://github.com/me2resh/agent-decision-record) extends the ADR format specifically for AI agent decisions, addressing the traceability gap Blueprint handles through its compliance auditor.

## 3. Theory Preservation: Naur's Challenge

Naur's 1985 insight remains [stubbornly relevant](https://www.nutrient.io/blog/peter-naur-legacy-mental-models-age-ai-coding/): the theory behind a program cannot be fully externalized into artifacts. The code is a lossy representation. When AI generates 41% of that code, the theory was never in anyone's head to begin with, creating what we might call "theoretically orphaned implementations."

Each harness attempts partial externalization through different strategies:

**GSD** uses PLAN.md, VERIFICATION.md, and RESEARCH.md as phase-scoped artifacts. The theory lives in the planning documents; execution is mechanical. This works when phases are small enough that intent remains legible, but the theory fragments across phase boundaries.

**RAPID** addresses cross-boundary theory loss through HANDOFF.md (inter-set context transfer), CONTRACT.json (interface specifications), and CONTEXT.md (vision preservation). The contract-based approach is strongest for API boundaries but weakest for emergent architectural properties that resist specification.

**Turing** takes a hypothesis-first approach: hypotheses.yaml with novelty guards, experiment lineage, and MEMORY.md for cross-session persistence. Theory is preserved as falsifiable claims rather than design rationale, which suits research workflows but maps poorly to production architecture.

**Blueprint** comes closest to systematic theory preservation through ADRs that capture not just the decision but the rejected alternatives, the evidence supporting the choice, the trigger conditions for revisitation, and the forces that shaped the tradeoff. The decision rationale section is explicitly a theory externalization mechanism. Its weakness is that ADRs capture decision-level theory but not the connective tissue between decisions.

No harness fully solves Naur's problem. The most honest assessment is that [theory-building requires human presence](https://cekrem.github.io/posts/programming-as-theory-building-naur/), and the best a harness can do is minimize the rate of theory loss through structured externalization.

## 4. The Decision Velocity Problem

AI agents can propose and implement architectural changes faster than humans can evaluate their implications. Blueprint's answer (adversarial challenge via devil's advocate before acceptance) is one of several emerging patterns:

**Executable specification guardrails.** [Spec-driven development](https://www.infoq.com/articles/spec-driven-development/) turns architecture into a runtime invariant. The specification is both the design document and the enforcement mechanism. Drift detection becomes continuous validation rather than periodic audit.

**Ratchet enforcement.** Archgate's model where [every violation becomes a permanent rule](https://archgate.dev/) means governance strictness monotonically increases. The system learns from mistakes without requiring human rule-writing.

**Bounded autonomy.** The [guardrails literature for 2026](https://authoritypartners.com/insights/ai-agent-guardrails-production-guide-for-2026/) converges on "bounded autonomy" architectures: clear operational limits, escalation paths, and governance agents monitoring other agents. The key decision is [when guardrails run relative to generation](https://toolhalla.ai/blog/ai-agent-guardrails-io-validation-2026): synchronous (blocking but safe), asynchronous (fast but risky), or hybrid.

**Deterministic anchoring.** The emerging consensus is to [anchor autonomy at the deterministic layer](https://www.querypie.com/features/documentation/white-paper/28/ai-agent-guardrails-governance-2026) and surround it with zero-trust evaluation, rather than delegating final authority on probabilistic decisions until guardrails mature to match innovation velocity.

## 5. Governance Architecture for a Best-of-Breed Harness

The research suggests a layered governance model operating at three granularities:

**Per-generation (synchronous).** Every code generation should be validated against executable architectural rules before acceptance. This is the Archgate/spec-driven layer. Cost: latency. Benefit: drift prevention at the source. Implementation: pre-commit hooks, inline rule evaluation, context injection of active ADRs into agent prompts.

**Per-phase (asynchronous).** At phase boundaries (GSD phases, RAPID sets, Turing experiments), run compliance audits, reflexion model checks, and evidence freshness validation. This is where Blueprint's 21-agent ensemble operates most naturally. Cost: compute. Benefit: catching emergent drift that per-generation checks miss.

**Per-milestone (deliberative).** At milestone boundaries, run full ATAM tradeoff analysis, Wardley Map strategic alignment, Conway's Law organizational fit, and decision debt review. This is human-in-the-loop territory; the harness surfaces findings but humans make judgment calls.

The enforcement mechanism should follow a ratchet pattern: permissive initially, with every detected violation becoming a permanent automated check. Combined with adversarial challenge for new ADRs and evidence expiry for existing ones, this creates a governance system that tightens over time without requiring constant human attention.

The critical missing piece across all current harnesses is theory-aware diffing: the ability to detect when a code change is locally correct but globally incoherent with the system's architectural theory. Reflexion models are the closest approximation, but they compare structure against structure, not intent against implementation. Closing that gap is the next frontier.

---

Sources:
- [AI-Generated Code Creates New Wave of Technical Debt (InfoQ)](https://www.infoq.com/news/2025/11/ai-code-technical-debt/)
- [How AI-generated code is reshaping software architecture (AIT)](https://ait.inc/tech-stuffs/how-ai-generated-code-is-reshaping-software-architecture/)
- [The Architecture Is The Plan: Fixing Agent Context Drift (Sylvester, 2026)](https://medium.com/@TimSylvester/the-architecture-is-the-plan-fixing-agent-context-drift-78095b67d838)
- [AI coding tools face 2026 reset towards architecture (ITBrief)](https://itbrief.asia/story/ai-coding-tools-face-2026-reset-towards-architecture)
- [Archgate: Executable ADRs for AI Governance](https://archgate.dev/)
- [How Agentic AI Empowers Architecture Governance (O'Reilly)](https://www.oreilly.com/radar/how-agentic-ai-empowers-architecture-governance/)
- [Agent Decision Records (GitHub)](https://github.com/me2resh/agent-decision-record)
- [Peter Naur's legacy: Mental models in the age of AI coding (Nutrient)](https://www.nutrient.io/blog/peter-naur-legacy-mental-models-age-ai-coding/)
- [Programming as Theory Building: Why Senior Developers Are More Valuable Than Ever](https://cekrem.github.io/posts/programming-as-theory-building-naur/)
- [Spec Driven Development: When Architecture Becomes Executable (InfoQ)](https://www.infoq.com/articles/spec-driven-development/)
- [AI Agent Guardrails: Production Guide for 2026](https://authoritypartners.com/insights/ai-agent-guardrails-production-guide-for-2026/)
- [Guardrail Design in the AI Agent Era (2026 Edition)](https://www.querypie.com/features/documentation/white-paper/28/ai-agent-guardrails-governance-2026)
- [AI Agent Guardrails & Output Validation in 2026 (ToolHalla)](https://toolhalla.ai/blog/ai-agent-guardrails-io-validation-2026)
- [Architectural Governance at AI Speed (InfoQ)](https://www.infoq.com/articles/architectural-governance-ai-speed/)
- [Accelerating ADRs with Generative AI (Equal Experts)](https://www.equalexperts.com/blog/our-thinking/accelerating-architectural-decision-records-adrs-with-generative-ai/)
