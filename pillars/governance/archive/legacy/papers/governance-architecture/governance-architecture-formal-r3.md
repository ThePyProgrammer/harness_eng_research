# Metrics, Empirical Calibration, and Verification for Governance Architecture

**Dimension:** Empirical grounding, metric definitions, and verification approaches
**Date:** 2026-04-03
**Role:** Formalization research (metrics and calibration)

---

## 1. Empirical Calibration Data for Governance Models

### 1.1 Code Duplication Under AI Assistance

GitClear's 2025 research report, analyzing 211 million changed lines of code authored between January 2020 and December 2024, provides the most comprehensive quantitative baseline for AI-era code quality shifts:

- **Copy/paste (clone) rate:** Rose from 8.3% of changed lines (2021) to 12.3% (2024). Code blocks with 5+ duplicated lines increased by approximately 8x during 2024.
- **Moved lines vs. cloned lines:** 2024 was the first year when the count of copy/pasted lines exceeded the count of moved lines, indicating a structural preference for duplication over refactoring.
- **Rapid revision rate:** The proportion of new code revised within two weeks of initial commit grew from 3.1% (2020) to 5.7% (2024), suggesting lower initial quality.

**Methodology:** Static analysis of commit-level diffs across a mixture of commercial customers and popular open-source repositories (Google, Microsoft, Meta, enterprise C-corps). Classification into moved, deleted, copy/pasted, and new lines based on diff heuristics. Total corpus: approximately one billion lines analyzed over five years.

**Confidence assessment:** High sample size (211M lines) but potential selection bias in the repository mix. The classification heuristic for "copy/paste" vs. "independent re-derivation" is inherently approximate; two developers solving the same problem may produce similar code without copying. The 8x figure for 5+ line blocks is more robust than percentage-based metrics since longer blocks are less likely to be coincidental.

**Sources:** [GitClear AI Code Quality 2025 Research](https://www.gitclear.com/ai_assistant_code_quality_2025_research), [GitClear 2025 PDF Report](https://gitclear-public.s3.us-west-2.amazonaws.com/GitClear-AI-Copilot-Code-Quality-2025.pdf)

### 1.2 Refactoring Activity Decline

From the same GitClear dataset:

- **Refactoring share of changes:** Dropped from 25% of changed lines (2021) to less than 10% (2024), a decline exceeding 60%.
- **Interpretation:** Before AI assistants, roughly one in four code changes involved improving existing code (cleaning abstractions, consolidating duplicated logic, simplifying class hierarchies). This "slow, unglamorous work that keeps a codebase healthy" is being displaced by net-new code generation.

This is the single most important calibration datum for governance architecture. If refactoring drops by 60%, the half-life of architectural decisions shortens proportionally, because the maintenance activity that keeps code aligned with decisions is disappearing.

**Sources:** [GitClear AI Code Quality 2025 Research](https://www.gitclear.com/ai_assistant_code_quality_2025_research), [The New Stack: AI-Generated Code Needs Refactoring](https://thenewstack.io/ai-generated-code-needs-refactoring-say-76-of-developers/)

### 1.3 DORA Metrics and Delivery Stability

The DORA 2024 and 2025 reports provide organizational-level data on AI adoption effects:

- **AI usage:** 90% of respondents report using AI at work (up 14% from prior year), with median daily usage of 2 hours.
- **Throughput boost:** 21% more tasks completed, 98% more pull requests merged when using AI.
- **Stability paradox:** AI adoption has a negative relationship with software delivery stability. The acceleration exposes weaknesses downstream; more changes ship faster, but each change is slightly more likely to break something.
- **Context switching:** Developers using AI interact with 9% more task contexts and 47% more pull requests daily.
- **Developer sentiment:** Stack Overflow's 2025 survey showed a 12% decline in developer favorability toward AI tools (from 72% to 60%).

The DORA data confirms a critical hypothesis for governance architecture: velocity without governance produces instability. The throughput/stability decoupling is precisely the failure mode that architectural governance is designed to prevent.

**Sources:** [DORA Report 2025 Key Takeaways](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025), [Google Cloud: 2025 DORA Report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report), [GitClear DORA Summary](https://www.gitclear.com/research/google_dora_2024_summary_ai_impact)

### 1.4 ADR Compliance Rates

Empirical data on ADR compliance remains sparse. The available evidence:

- **ADR-E Framework study:** Mixed-methods evaluation (workshops, scenario-based simulations, surveys, interviews, operational metrics) found a 30% reduction in mean time to resolution and transparency scores above 4.6/5 when using an extended ADR framework with explainability features.
- **Action research (ECSA 2024):** ADRs were "perceived as useful by development teams" and "increase the awareness that documentation is beneficial even in agile development contexts," but compliance rates were not quantified.
- **Key research gap:** There is currently a lack of empirical research on ADR compliance rates specifically. Most studies focus on adoption and perceived usefulness rather than measuring conformance between accepted decisions and actual code.

**Confidence assessment:** Low. The ADR literature is predominantly prescriptive (how to write ADRs) rather than empirical (do teams follow them). This is itself a significant finding: governance approaches are being promoted without calibration data on their effectiveness.

**Sources:** [ECSA 2024 Action Research Study](https://rebekkaa.github.io/files/2024_ECSA.pdf), [ResearchGate: ADR-E Framework](https://www.researchgate.net/publication/399078245_Explainability_in_Software_Architectural_Decisions_The_ADR-E_Framework_and_Empirical_Evaluation)

### 1.5 Decision Decay and Architectural Drift Velocity

No standardized measurement of decision decay rates exists in the literature. Qualitative observations:

- **Knowledge decay pattern:** The reasoning behind decisions (alternatives considered, tradeoffs debated, assumptions made) "evaporates after the decision is made, living temporarily in communication channels before gradually decaying."
- **Staleness cascade:** 60% of enterprise RAG projects fail due to inability to maintain data freshness at scale, providing an analogous calibration point for decision freshness.
- **Drift measurement:** Architectural drift is described as "the silent killer of engineering velocity." Tools like Sonargraph and Structure101 measure structural entropy via tangle indices and dependency depth, but no longitudinal studies quantify drift velocity (violations per week) across a representative sample of codebases.

**Confidence assessment:** Very low. Decision decay is widely acknowledged but almost never measured. This represents a critical gap for any formal governance model.

---

## 2. Governance Metrics Taxonomy

### 2.1 Structural Metrics

**Coupling Between Objects (CBO):**

$$\text{CBO}(c) = |\{c' \in C \setminus \{c\} : \exists \text{ dependency between } c \text{ and } c'\}|$$

Measures the number of classes to which a class $c$ is coupled. Lower values indicate better encapsulation. Tools: SonarQube, NDepend, JDepend. Limitation: counts all dependencies equally; a stable interface dependency and a volatile implementation dependency have the same weight.

**Lack of Cohesion of Methods (LCOM4):**

$$\text{LCOM4}(c) = |\text{connected components in } G_c|$$

where $G_c$ is the graph with methods as nodes and edges connecting methods that share instance variables. $\text{LCOM4} = 1$ indicates a cohesive class; $\text{LCOM4} > 1$ suggests the class should be split. Limitation: does not account for method-to-method calls, only shared state.

**Instability:**

$$I(p) = \frac{C_e(p)}{C_a(p) + C_e(p)}$$

where $C_e$ is efferent coupling (outgoing dependencies) and $C_a$ is afferent coupling (incoming dependencies). Ranges from 0 (maximally stable) to 1 (maximally unstable). Robert C. Martin's Stable Dependencies Principle states that packages should depend in the direction of stability: $I(\text{depender}) \geq I(\text{dependee})$.

**Layer Violation Count:**

$$V_L = |\{(a, b) : a \in L_i, b \in L_j, j > i, \text{dependency}(a, b)\}|$$

Counts dependencies that skip or invert defined layers. Measurable via ArchUnit, Archgate, or custom static analysis. Limitation: requires an explicit layer definition, which is itself an architectural decision subject to drift.

### 2.2 Drift Metrics

**Conformance Score:**

$$\text{CS}(t) = 1 - \frac{|\text{divergences}(t)| + |\text{absences}(t)|}{|\text{expected relationships}|}$$

Derived from Murphy and Notkin's reflexion model (SIGSOFT 1995). Compares an intended architecture (high-level model) against actual source structure. Divergences are unexpected dependencies; absences are expected dependencies not found. Applied successfully to NetBSD (250,000 LOC) and demonstrated practical utility in a few hours of analysis.

**Drift Velocity:**

$$\dot{D}(t) = \frac{d}{dt}\left(1 - \text{CS}(t)\right) = \frac{\Delta V_{\text{violations}}}{\Delta t}$$

The rate of change of non-conformance over time. Positive drift velocity indicates erosion; negative indicates recovery. No published longitudinal datasets exist for calibration, but the metric itself is well-defined and computable from any tool that tracks violation counts over successive commits.

**Structural Entropy (Tangle Index):**

$$T(G) = \frac{|\text{edges in cyclic subgraph of } G|}{|\text{edges in } G|}$$

Measures the proportion of dependencies participating in cycles. A single snapshot has limited meaning; the delta $\Delta T$ between releases indicates whether structural health is improving or degrading.

### 2.3 Decision Metrics

**Decision Age:**

$$A_d = t_{\text{now}} - t_{\text{accepted}}$$

Simple but essential. Older decisions have higher probability of context invalidation. No empirical decay curve has been published, but information theory suggests exponential decay as a baseline model: the probability that a decision's context remains valid decreases exponentially with time in rapidly evolving domains.

**Evidence Freshness:**

$$F_d = \frac{1}{|E_d|} \sum_{e \in E_d} \mathbb{1}[t_{\text{now}} - t_e < \tau_{\text{fresh}}]$$

The fraction of evidence items $E_d$ supporting decision $d$ that were verified within freshness threshold $\tau_{\text{fresh}}$. Requires explicit tracking of when each piece of supporting evidence was last validated.

**Review Recency:**

$$R_d = t_{\text{now}} - t_{\text{last\_review}}(d)$$

Time since last human review of decision $d$. Governance systems should trigger review when $R_d$ exceeds a domain-specific threshold. For fast-moving domains (frontend frameworks, AI/ML libraries), reasonable thresholds might be 3-6 months; for stable domains (database schemas, network protocols), 12-24 months.

### 2.4 Process Metrics

**Theory Capture Rate:**

$$\text{TCR} = \frac{|\text{decisions with recorded rationale}|}{|\text{significant architectural changes}|}$$

Requires defining "significant architectural change," which is itself undecidable in general. Practical approximation: changes touching 3+ modules or introducing new dependencies.

**Governance Response Time:**

$$\text{GRT} = t_{\text{violation\_resolved}} - t_{\text{violation\_detected}}$$

How quickly the governance system responds to detected violations. Fast detection with slow response is equivalent to no governance; the violation accumulates while waiting for resolution.

**Escalation Frequency:**

$$\text{EF} = \frac{|\text{violations requiring human judgment}|}{|\text{total violations detected}|}$$

A high EF suggests fitness functions are too coarse (generating ambiguous signals); a low EF suggests either excellent automation or insufficient detection sensitivity.

---

## 3. Verification Approaches for Governance Claims

### 3.1 The Fundamental Challenge

Verifying that governance *prevents* drift (rather than merely detecting it) requires reasoning about counterfactuals: what would have happened without governance? This is structurally identical to the challenge of demonstrating that security measures prevent breaches, or that safety systems prevent accidents. The absence of evidence (no drift observed) is not evidence of absence (governance caused the non-drift).

### 3.2 Reflexion Model Verification

Murphy and Notkin's reflexion model (1995) provides the most rigorous approach to point-in-time conformance verification. The process:

1. An engineer defines a high-level structural model (the intended architecture).
2. A mapping specifies how high-level components correspond to source entities.
3. A tool computes convergences (expected and found), divergences (found but not expected), and absences (expected but not found).

This produces a formal conformance report, but it verifies the *current state*, not the *causal efficacy* of governance. A codebase might conform perfectly despite having no governance (the developers independently made good choices), or drift badly despite having governance (the governance was ignored).

**Source:** [Murphy & Notkin, SIGSOFT 1995](https://dl.acm.org/doi/10.1145/222124.222136)

### 3.3 Controlled Experiments

The gold standard for causal claims would be controlled experiments comparing governed and ungoverned codebases. Practical challenges:

- **Sample size:** Software projects are complex enough that meaningful statistical power requires many projects, not just many commits within one project.
- **Randomization:** Randomly assigning governance to teams raises ethical and practical concerns (knowingly withholding potentially beneficial tools from control groups).
- **Duration:** Architectural drift manifests over months to years; short-term experiments may miss the effects.
- **Confounds:** Teams assigned governance may also receive other interventions (training, tooling, attention effects).

The closest analogue is the MERL Center's research on A/B testing in software engineering, which identifies the difficulty of isolating architectural variables from the broader sociotechnical context.

### 3.4 Agent-Based Simulation

Agent-based modeling (ABM) offers a simulation-based alternative. The MIS Quarterly published research on "The Evolution of Information Systems Architecture: An Agent-Based Simulation Model," which found that enterprise architecture management (EAM) moderates negative effects of complexity. Organizations lacking adequate EAM face large increases in technological complexity.

A governance verification simulation would model:

- **Developer agents** making local decisions (add dependency, duplicate code, introduce abstraction).
- **Governance agents** intercepting violations and enforcing constraints.
- **Evolution dynamics** over hundreds of simulated iterations.
- **Comparison runs** with and without governance agents active.

This approach cannot prove real-world efficacy, but it can identify parameter regimes where governance provides the largest benefit and calibrate the sensitivity of governance effectiveness to factors like enforcement delay, false positive rates, and developer compliance.

**Source:** [MIS Quarterly: IS Architecture Evolution](https://misq.umn.edu/the-evolution-of-information-systems-architecture-an-agent-based-simulation-model.html)

### 3.5 The Counterfactual Problem

Formally, governance effectiveness is:

$$E_G = \mathbb{E}[\text{Drift}(\text{no governance})] - \mathbb{E}[\text{Drift}(\text{with governance})]$$

The first term is unobservable in governed systems. Practical approximations:

1. **Before/after comparison:** Measure drift velocity before governance adoption and after. Confounded by temporal effects (team maturity, codebase age).
2. **Cross-project comparison:** Compare drift across governed and ungoverned projects. Confounded by selection effects (teams that adopt governance may be more disciplined regardless).
3. **Removal experiments:** Temporarily disable governance and measure drift acceleration. Ethically problematic; operationally risky.
4. **Synthetic counterfactuals:** Use simulation to estimate the ungoverned trajectory. Requires validated simulation models (which themselves need calibration data).

None of these is fully satisfactory. Governance effectiveness, like security effectiveness, may be fundamentally resistant to rigorous quantification.

---

## 4. Fitness Function Design Patterns

### 4.1 ADR-to-Invariant Mapping

Each accepted ADR should map to one or more testable invariants. The mapping pattern:

| ADR Decision | Fitness Function | Tool |
|---|---|---|
| "Services communicate only via events" | No direct HTTP calls between service packages | ArchUnit dependency rules |
| "Domain logic must not depend on infrastructure" | Domain package has zero imports from infra package | ArchUnit / Archgate |
| "All public APIs require authentication" | Every controller method has an auth annotation | Custom AST check |
| "Database access only through repository layer" | No direct JDBC/SQL imports outside repository package | ArchUnit layer rules |

**ArchUnit examples (JVM):**

- Cycle freedom: `slices().matching("com.myapp.(*).").should().beFreeOfCycles()`
- Layer enforcement: `layeredArchitecture()` with declarative layer definitions
- API/impl separation: `noClasses().that().resideInAPackage("..api.").should().dependOnClassesThat().resideInAPackage("..impl.")`
- Naming conventions: `classes().that().resideInAPackage("..controller..").should().haveSimpleNameEndingWith("Controller")`

**Source:** [ArchUnit User Guide](https://www.archunit.org/userguide/html/000_Index.html), [InfoQ: Fitness Functions for Your Architecture](https://www.infoq.com/articles/fitness-functions-architecture/)

### 4.2 Composition

Individual fitness functions compose into system-level governance through conjunction:

$$\text{SystemHealth} = \bigwedge_{i=1}^{n} f_i(\text{codebase})$$

where each $f_i$ returns pass/fail. This is a strict composition: any single failure blocks the build. Weighted compositions are possible:

$$\text{GovernanceScore} = \sum_{i=1}^{n} w_i \cdot f_i(\text{codebase})$$

with threshold $\theta$ for pass/fail. Weighted scores allow graceful degradation but introduce the problem of weight calibration: who decides that cycle freedom is worth 0.3 and layer compliance is worth 0.2?

### 4.3 False Positive/Negative Tradeoffs

- **False positives** (violations flagged but architecturally acceptable) erode developer trust and create "alert fatigue." Teams begin ignoring or suppressing governance signals.
- **False negatives** (real violations not detected) provide false confidence. The governance system's silence is misinterpreted as approval.
- **Calibration strategy:** Start with high-precision rules (few false positives, possibly many false negatives) and expand coverage incrementally. The Archgate "ratchet model" implements this: each newly discovered violation type becomes a permanent rule, monotonically increasing coverage.

### 4.4 Performance Impact

Synchronous fitness function evaluation (blocking CI on every commit) introduces latency. ArchUnit tests on a medium-sized Java project (100K LOC) typically execute in 2-10 seconds. For larger codebases:

- **Incremental evaluation:** Only check files changed in the current commit against relevant fitness functions. Requires a mapping from files to applicable rules.
- **Tiered execution:** Fast structural checks on every commit; slower whole-codebase analysis on nightly builds or pre-merge.
- **Caching:** Cache the dependency graph between runs; invalidate only subgraphs affected by changed files.

---

## 5. The Measurement Problem

### 5.1 Goodhart's Law in Governance

Goodhart's Law, originally formulated for monetary policy (1975): "Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes." Commonly restated: "When a measure becomes a target, it ceases to be a good measure."

Applied to governance metrics:

- **Coupling targets:** If CBO is targeted, developers restructure code to reduce measured coupling while introducing unmeasured coupling through shared configuration, ambient context, or implicit conventions.
- **Coverage targets:** If fitness function coverage is targeted, teams write trivial fitness functions that pass easily, inflating coverage without improving governance.
- **Velocity targets:** If governance response time is targeted, teams auto-close violations without investigation.

The defense against Goodhart's Law is metric rotation (changing which metrics receive attention), metric triangulation (using multiple independent metrics so gaming one degrades others), and cultural alignment (making genuine architectural health more rewarding than metric optimization).

**Sources:** [CodePulseHQ: Goodhart's Law in Software](https://codepulsehq.com/guides/goodharts-law-engineering-metrics), [Jellyfish: Goodhart's Law in Software Engineering](https://jellyfish.co/blog/goodharts-law-in-software-engineering-and-how-to-avoid-gaming-your-metrics/)

### 5.2 Observer Effects

Measuring architectural quality changes developer behavior through several mechanisms:

- **Hawthorne effect:** Teams under architectural scrutiny write better-structured code, independent of the specific governance rules.
- **Teaching effect:** Fitness function failure messages educate developers about architectural intent, producing long-term behavioral changes even if the functions are later removed.
- **Chilling effect:** Overly strict governance discourages experimentation and innovation, producing architecturally "correct" but stagnant systems.

These effects complicate causal inference. If a governance system improves architectural quality, is it the enforcement that helped, or the education? If the latter, a lighter-weight intervention (documentation, training) might achieve the same result at lower cost.

### 5.3 Uncomputability of Idealized Metrics

"True" architectural quality, in any holistic sense, is undecidable. This follows from several observations:

1. **Fitness for purpose** requires knowing the future evolution of requirements, which is unknowable.
2. **Optimal decomposition** for a given set of requirements is NP-hard in general (the module partitioning problem).
3. **Semantic coupling** (two modules that must change together due to shared domain concepts, not shared code) is undetectable by static analysis alone.

Practical governance metrics are therefore always approximations. The important question is not whether they are perfect, but whether their failure modes are understood and tolerable. A coupling metric that misses semantic coupling is still useful if the team knows to supplement it with domain-aware review.

### 5.4 Known Failure Modes

| Metric | Failure Mode | Consequence |
|---|---|---|
| CBO | Misses coupling through shared config/env vars | False sense of decoupling |
| LCOM4 | Penalizes utility classes and facades | False positives on legitimate patterns |
| Layer violations | Requires correct layer definition | Outdated layer model produces meaningless results |
| Drift velocity | Sensitive to violation classification threshold | Small threshold changes produce large velocity swings |
| Decision age | Age alone says nothing about validity | Ancient decisions may be perfectly valid; recent ones may already be obsolete |
| Fitness function coverage | Coverage != quality | 100% coverage with trivial functions provides no governance |

---

## 6. Synthesis: Data Quality Assessment

| Data Category | Quality | Key Gap |
|---|---|---|
| Code duplication rates (AI era) | High (211M lines, 5-year longitudinal) | Selection bias in repo sample |
| Refactoring decline | High (same dataset) | Causal attribution to AI vs. other factors |
| DORA stability metrics | High (large survey, peer-reviewed) | Self-reported AI usage; no controlled experiment |
| ADR compliance rates | Very low (no quantitative studies) | Fundamental measurement gap |
| Decision decay rates | Very low (qualitative only) | No decay curve published |
| Architectural drift velocity | Low (tools exist, no longitudinal studies) | No cross-project baseline |
| Fitness function effectiveness | Low (case studies, no controlled trials) | Confounded by selection effects |

The honest assessment: governance architecture as a field has strong conceptual foundations and increasingly sophisticated tooling, but almost no empirical calibration. The GitClear and DORA datasets provide the best available evidence that the *problem* is real (quality degrades under AI acceleration), but the evidence that *governance solves it* remains largely anecdotal. The most important research contribution would be a longitudinal controlled study comparing drift trajectories in governed vs. ungoverned codebases, with careful attention to confounds and counterfactuals.

---

**Sources (consolidated):**

- [GitClear AI Code Quality 2025 Research](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
- [DORA Report 2025](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025)
- [Google Cloud: 2025 DORA Report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)
- [ECSA 2024: ADRs in Practice](https://rebekkaa.github.io/files/2024_ECSA.pdf)
- [Murphy & Notkin: Software Reflexion Models (1995)](https://dl.acm.org/doi/10.1145/222124.222136)
- [MIS Quarterly: IS Architecture Evolution ABM](https://misq.umn.edu/the-evolution-of-information-systems-architecture-an-agent-based-simulation-model.html)
- [ArchUnit](https://www.archunit.org/)
- [InfoQ: Fitness Functions for Architecture](https://www.infoq.com/articles/fitness-functions-architecture/)
- [Archgate CLI](https://github.com/archgate/cli)
- [CodePulseHQ: Goodhart's Law in Software](https://codepulsehq.com/guides/goodharts-law-engineering-metrics)
- [The New Stack: AI Code Needs Refactoring](https://thenewstack.io/ai-generated-code-needs-refactoring-say-76-of-developers/)
- [Sonar: The Architecture Gap](https://www.sonarsource.com/blog/the-architecture-gap-why-your-code-becomes-hard-to-change/)
- [ScienceDirect: Architecture Drift Analysis](https://www.sciencedirect.com/science/article/pii/S0920548923000557)
