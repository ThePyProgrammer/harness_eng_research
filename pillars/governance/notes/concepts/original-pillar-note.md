# Pillar 6: Governance Architecture

## What This Pillar Is

The study of architectural drift, decision debt, theory preservation (Naur), evidence expiry, and the decision velocity problem. This pillar determines how a harness maintains architectural coherence over time as AI agents make changes faster than humans can evaluate their implications.

## Why It Must Exist

Analysis of 200M+ lines shows an 8x increase in duplicated blocks after mass AI adoption, with refactoring activity dropping 40% (InfoQ). AI-generated code is "optimized for completion, not cohesion" (AIT). Each change passes its tests; the system slowly loses coherence. Sylvester (2026) calls this "context drift": the agent's working model diverges from the actual architecture with every generation.

The core tension is temporal. Human architects think in trajectories (where is this system heading?). AI agents think in snapshots (what does this prompt need right now?). Drift is the integral of that gap over time.

## The Formal Problems

### Architectural Drift Detection

Given an invariant $\phi$ from an accepted ADR and violation counts $v_t$ over commits $t = 1, \ldots, T$, distinguish:
- $H_0$: $v_t$ is stationary (random fluctuations, no systematic drift)
- $H_1$: $v_t$ has a positive trend (systematic erosion)

This is change-point detection (CUSUM or Bayesian online change-point detection), producing drift alerts with false-positive rate guarantees.

### Decision Debt and Evidence Expiry

Model decision validity as a survival function:

$$P(\text{valid at } t) = P(\text{valid at } t_0) \cdot e^{-\lambda(t - t_0)}$$

Blueprint data: 23% of evidence goes stale within 2 months, giving $\lambda \approx 0.13$/month, half-life ~5.3 months.

### Theory Extraction

Given an executor conversation log $L$ (100K+ tokens), extract structured output $(D, A, R)$ (decisions, assumptions, rejected alternatives). This is structured summarization with a fidelity constraint: do the extracted propositions faithfully represent the reasoning in $L$?

## The Right Mathematical Framework

**Control theory + survival analysis.** Key quantities:
- $v_t$: violation count at time $t$ (drift detection)
- $\lambda$: decision decay rate (evidence expiry)
- $\text{TCR}$: theory capture rate (fraction of decisions extractable from logs)

## What Existing Research Shows

- **Architectural drift:** 8x duplication increase, 40% refactoring drop post-AI adoption (InfoQ). ITBrief reports 2026 enterprise reset toward architecture-first AI tools.
- **Blueprint data:** 23% of evidence stale within 2 months. Reflexion model conformance checking detects convergences, divergences, and absences.
- **Archgate:** Turns ADRs into executable CI rules. "Ratchet" model: every violation found during review becomes a permanent automated rule. Governance strictness monotonically increases.
- **Agent Decision Records (AgDR):** Extends ADR format for AI agent decisions, addressing traceability gaps.
- **Naur (1985):** The theory behind a program cannot be fully externalized. When AI generates 41% of code, the theory was never in anyone's head, creating "theoretically orphaned implementations."
- **Bounded autonomy (2026 guardrails literature):** Clear operational limits, escalation paths, governance agents monitoring other agents.

## How Existing Harnesses Handle This

### Blueprint (the gold standard for governance)

- ADR lifecycle state machine: Proposed, Accepted, Audited, Enforced, Revisited
- 21 specialized agents (researcher, devil's advocate, forces evaluator, compliance auditor, drift detector, Conway's Law analyzer, etc.)
- Continuous governance: trajectory analysis (not snapshots), evidence expiry, decision debt tracking
- Reflexion model conformance: compares intended architecture against actual source
- Adversarial challenge: no ADR reaches Accepted without devil's advocate review
- 15 architecture paradigms (ATAM, DCAR, Wardley Mapping, DDD, C4, arc42, 4+1 views, Technology Radar)
- Config as domain language (TOML): testable, diffable, versionable

### GSD

- Phase artifacts: PLAN.md, VERIFICATION.md, RESEARCH.md
- Theory lives in planning documents; execution is mechanical
- Weakness: theory fragments across phase boundaries

### RAPID

- HANDOFF.md for inter-set context transfer
- CONTRACT.json for interface specifications
- CONTEXT.md for vision preservation
- Strength: contract-based approach for API boundaries
- Weakness: emergent architectural properties resist contract specification

### Turing

- hypotheses.yaml with novelty guards and experiment lineage
- MEMORY.md for cross-session persistence
- Theory preserved as falsifiable claims, not design rationale
- Strength: hypothesis-first suits research workflows
- Weakness: maps poorly to production architecture

## The Three-Granularity Governance Model

**Per-generation (synchronous):** Every code generation validated against executable architectural rules before acceptance. Pre-commit hooks, inline rule evaluation, active ADR injection into agent context. This is the Archgate/spec-driven layer. Cost: latency. Benefit: drift prevention at the source.

**Per-phase (asynchronous):** At phase boundaries, run compliance audits, reflexion model checks, evidence freshness validation. This is where Blueprint's agent ensemble operates naturally. Cost: compute. Benefit: catching emergent drift that per-generation checks miss.

**Per-milestone (deliberative):** Full ATAM tradeoff analysis, Wardley Map strategic alignment, Conway's Law organizational fit, decision debt review. Human-in-the-loop; the harness surfaces findings, humans make judgment calls.

**Ratchet enforcement:** Every detected violation becomes a permanent automated check. Combined with adversarial challenge (new ADRs) and evidence expiry (existing ones), governance tightens over time without constant human attention.

## The Theory Preservation Problem

Naur's position is stronger than "save more metadata." He argued the theory held in programmers' minds *cannot* be fully captured in any artifact. The best a harness can do is minimize the rate of theory loss:

| Artifact | What It Captures | What It Misses |
|----------|-----------------|----------------|
| PLAN.md | What will be built and how | Why this approach, not others |
| THEORY.md (proposed) | Decisions, assumptions, rejected alternatives | Tacit judgment, context-dependent reasoning |
| ADRs | Decision rationale, forces, consequences | The "connective tissue" between decisions |
| hypotheses.yaml (Turing) | Falsifiable claims with lineage | Design intent beyond the experiment |
| Conversation logs | Everything, unstructured | Nothing, if not extracted and curated |

The Recorder agent (from the unified harness design) extracts structured THEORY.md from executor logs. This is the best current approximation, with the explicit acknowledgment that the residual (information lost in extraction) is non-zero and possibly significant.

## Key Contrarian Positions to Engage

1. **"Governance is overhead that slows development."** For small teams and early-stage projects, governance may cost more than the drift it prevents. Research: at what team size and codebase scale does governance have positive ROI?

2. **"ADRs are documentation theater."** Most ADRs are written once and never revisited. Does continuous governance actually prevent drift, or does it produce more documents? Research: compare drift rates in codebases with and without continuous governance.

3. **"Naur is right and the problem is unsolvable."** If theory cannot be externalized, THEORY.md is a lossy compression that creates false confidence. Acting on extracted "decisions" may be worse than having no documentation. Research: measure fidelity of automated theory extraction against ground-truth developer interviews.

4. **"Conway's Law makes governance futile."** If architecture mirrors org structure, architectural governance without organizational governance treats the symptom. Research: does drift correlate more with team structure changes or codebase changes?

5. **"The ratchet is too rigid."** Monotonically increasing strictness may eventually prevent legitimate architectural evolution. There must be a mechanism for relaxing rules when the architecture intentionally changes (which is what Blueprint's Revisited state and evidence expiry address).

## What Another Agent Needs to Know

- Architectural drift is the integral of the trajectory-snapshot gap over time. Point-in-time audits are insufficient; trajectory analysis is required.
- Evidence has a half-life (~5.3 months for technical decisions, faster for frontend frameworks, slower for database engines)
- The ratchet pattern (every violation becomes a permanent rule) is the most effective enforcement mechanism
- Blueprint's ADR lifecycle with adversarial challenge is the gold standard; take the data model and lifecycle, not necessarily the 42-skill interaction surface
- Theory preservation is a hard problem with no complete solution. The Recorder agent extracting THEORY.md is the best current approximation.
- Governance should operate at three granularities: synchronous (per-generation), asynchronous (per-phase), deliberative (per-milestone)
- Read-only governance agents (Blueprint pattern) can run in parallel with zero coordination cost

## Sources

- AI-Generated Code Creates New Wave of Technical Debt (InfoQ, 2025)
- How AI-Generated Code Is Reshaping Software Architecture (AIT)
- The Architecture Is The Plan: Fixing Agent Context Drift (Sylvester, 2026)
- AI Coding Tools Face 2026 Reset (ITBrief)
- Archgate: Executable ADRs for AI Governance
- How Agentic AI Empowers Architecture Governance (O'Reilly)
- Agent Decision Records (GitHub: me2resh/agent-decision-record)
- Peter Naur's Legacy: Mental Models in the Age of AI Coding (Nutrient)
- Programming as Theory Building: Why Senior Developers Are More Valuable Than Ever
- Spec Driven Development: When Architecture Becomes Executable (InfoQ)
- AI Agent Guardrails: Production Guide for 2026
