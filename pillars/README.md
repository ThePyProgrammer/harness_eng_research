# The Ten Pillars of Harness Design

A formal theory of AI coding agent harnesses requires ten pillars, each with its own mathematical framework, empirical calibration, and contrarian stress-test. No single pillar is sufficient; the interaction between pillars determines harness quality.

The original six pillars address the core engineering problem: what the agent sees, how it verifies, how agents coordinate, how fast they iterate, what defects to catch, and how coherence is maintained. Three additional pillars, identified through peer review, address the operational dimensions that practitioners report as their primary constraints: cost optimization, human interaction, and model selection. A tenth pillar, security, was added after peer review unanimously flagged its absence as a major gap: agents operate with developer credentials, and the structural enforcement principle -- the paper's strongest cross-pillar result -- is fundamentally a security principle.

## The Pillars

### Semantic Axis (What the Agent Needs to Know)

| # | Pillar | Formalism | Core Question | Key Metric |
|---|--------|-----------|---------------|------------|
| 1 | [Information Architecture](1-information-architecture.md) | Shannon entropy | What should the agent see? | $H(P \mid S, C, \theta)$ |

### Execution Axis (How the Agent Acts)

| # | Pillar | Formalism | Core Question | Key Metric |
|---|--------|-----------|---------------|------------|
| 2 | [Reliability Architecture](2-reliability-architecture.md) | Reliability theory | How often and how aggressively to verify? | $R(n, p, V)$ end-to-end reliability |
| 3 | [Coordination Architecture](3-coordination-architecture.md) | Graph theory + mechanism design | How do parallel agents coordinate safely? | $A_e(t, k)$ error amplification |
| 4 | [Temporal Architecture](4-temporal-architecture.md) | Queueing theory | How fast can we iterate with verified quality? | VIH (verified iterations/hour) |

### Assurance Axis (How Outcomes Are Verified)

| # | Pillar | Formalism | Core Question | Key Metric |
|---|--------|-----------|---------------|------------|
| 5 | [Quality Architecture](5-quality-architecture.md) | Decision theory | What to verify, how aggressively, with what tools? | $\text{ROI}(\ell, j)$ per layer per defect type |
| 6 | [Governance Architecture](6-governance-architecture.md) | Control theory + survival analysis | How to maintain coherence over time? | $\lambda$ decision decay rate |

### Operational Axis (How the Harness Operates in Practice)

| # | Pillar | Formalism | Core Question | Key Metric |
|---|--------|-----------|---------------|------------|
| 7 | [Economics Architecture](7-economics-architecture.md) | Portfolio theory + queueing economics | How to allocate finite budget across stages? | CVIH (cost-adjusted verified iterations/hr) |
| 8 | [Human Interaction Architecture](8-human-interaction-architecture.md) | Bayesian decision theory + automation supervision | When should humans intervene, and how to allocate their attention? | Marginal detection value per review |
| 9 | [Model Routing Architecture](9-model-routing-architecture.md) | Assignment problems + copula theory | Which model for each stage, and how to enforce verification diversity? | $\Delta_{\text{div}}$ diversity gain |

### Security Axis (How the Harness Contains the Agent)

| # | Pillar | Formalism | Core Question | Key Metric |
|---|--------|-----------|---------------|------------|
| 10 | [Security Architecture](10-security-architecture.md) | Access control theory + information flow control | How to prevent agents from causing security harm? | $(1-\epsilon)^T$ structural enforcement decay |

## How They Interact

The pillars form a system with feedback loops across all four axes:

**Within the original six:**
- **1 to 2:** Better context (P1) reduces per-step error rate, improving reliability (P2)
- **2 to 4:** Verification cadence (P2) directly constrains cycle time (P4)
- **3 to 4:** Parallelism (P3) improves throughput but adds merge overhead to cycle time (P4)
- **4 to 2:** Faster iterations (P4) enable more verification attempts per unit time (P2)
- **5 to 1:** Quality gates (P5) that catch context blindness reduce duplicate logic (P1)
- **6 to 5:** Governance (P6) prevents architectural drift that quality gates alone cannot catch (P5)
- **6 to 3:** ADR validation at planning time (P6) prevents architectural violations in parallel execution (P3)

**Operational pillars bridge theory to practice:**
- **7 to ALL:** The economics pillar imposes budget constraints that bind every other pillar's optimization. The quality-optimal context budget (P1) may be financially infeasible; the cost engine resolves this.
- **8 to 2,5:** Human review is Layer 4 of the verification stack (P2) and the only detection mechanism for undecidable slop types (P5). The human interaction pillar determines when and how to deploy this scarce resource.
- **8 to 6:** The governance pillar's per-milestone deliberative loop requires human strategic judgment. The human pillar determines how to maintain the human's capability to provide it (Bainbridge's ironies).
- **9 to 2,5:** Cross-model diversity (P9) is required for reliable Layer 3 verification (P2) because same-model judging has correlated blind spots (P5's FKG inequality).
- **9 to 7:** Model routing is the highest-leverage cost lever (P7): 60x price range between tiers with task-dependent capability gaps. Correct routing saves 50-80% of token costs.
- **7 to 8:** Developer idle time during agent execution is a hidden cost (P7) that changes the human's optimal engagement pattern (P8): if the developer is blocked waiting, paying 3x for a faster model is NPV-positive.

**Security pillar bridges all axes:**
- **10 to 2:** The structural enforcement principle (P10) is the foundation of verification reliability (P2). Security invariants that are structurally enforced do not suffer $(1-\epsilon)^T$ decay.
- **10 to 5:** Security vulnerabilities are a slop type (P5 type #2) with the highest downstream cost $D_j$. The quality stack's layered defense applies, but security defects require structural enforcement at Layer 1, not probabilistic detection at Layer 3.
- **10 to 3:** Multi-agent coordination (P3) multiplies the attack surface. Each agent is a separate subject in the access control matrix; credential isolation between agents prevents lateral movement.
- **10 to 1:** Context assembly (P1) must respect security labels. High-security content must not flow into low-clearance agent contexts. The information architecture pillar's context budget is constrained by the security pillar's information flow policy.
- **10 to 8:** Human approval gates (P8) are the escape hatch for operations that exceed the agent's structural capability boundary. Security-sensitive operations (deployment, credential access) require human confirmation regardless of agent confidence.
- **10 to 7:** Security enforcement has costs (sandbox setup, credential vaulting, output filtering), but these costs are dominated by API latency in practice. The economics pillar (P7) should account for security overhead but it is rarely the binding constraint.

## Provenance

Each pillar document contains:
- **What it is** and **why it must exist** (with quantitative evidence)
- **The formal problems** (mathematically stated, with known hardness)
- **The right mathematical framework** (with key quantities defined)
- **What existing research shows** (with citations)
- **How existing harnesses handle it** (GSD, RAPID, Blueprint, Turing)
- **Key contrarian positions** (the strongest objections to the pillar's assumptions)
- **What another agent needs to know** (actionable guidance for implementation)

## Origin

The original six pillars were derived from:
- A 6-perspective peer review of the formal framework paper (science.tex)
- 7 deep research axes with evidence from 50+ sources
- Analysis of 4 Pragnition Labs systems (GSD, RAPID, Blueprint, Turing) and 6 external frameworks
- 15 formalizable problems identified in `outputs/formalizable-problems.md`
- The research roadmap in `outputs/formal-harness-theory-roadmap.md`

The three operational pillars (7-9) were identified through:
- A 5-reviewer simulated peer review panel (outputs/r1-r5 reviews)
- Consensus finding that cost, human interaction, and model routing are the practitioner's primary constraints
- Architectural analysis of RAPID (~/pragnition/RAPID) and Blueprint (~/pragnition/blueprint)
- The consolidated review and revision plan (outputs/ai-harness-science-review.md)

The security pillar (10) was added after:
- Unanimous peer review flagging security as a MAJOR gap in the framework
- Recognition that the structural enforcement principle -- the paper's strongest cross-pillar result -- is fundamentally a security principle
- Evidence from NIST CAISI, Apollo Research, and METR documenting agent misbehavior that only structural containment prevents

## Recommended Reading Order

**For implementers:** 10 (security) then 2 (reliability) then 5 (quality) then 7 (economics) then 1 (context) then 9 (model routing) then 4 (speed) then 8 (human interaction) then 3 (coordination) then 6 (governance). Start with what contains the agent, then what kills quality, then what prevents it, then what constrains everything, then what feeds it, then what selects the tools, then what speeds it up, then what engages the human, then what scales it, then what maintains it.

**For theorists:** 1 (information) then 2 (reliability) then 10 (security) then 3 (coordination) then 6 (governance) then 5 (quality) then 4 (speed) then 7 (economics) then 8 (human interaction) then 9 (model routing). Follow the information flow from input to output, then the security boundary that constrains it, to verification to maintenance, then the operational constraints that shape deployment.

**For the new pillars specifically:** Start with 7 (economics), as it imposes the meta-constraint on everything else. Then 10 (security), as it formalizes the structural enforcement principle that underpins all other safety guarantees. Then 9 (model routing), as it is the highest-leverage cost lever. Then 8 (human interaction), as it addresses the most philosophically challenging dimension.
