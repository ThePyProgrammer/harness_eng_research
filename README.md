# AI Coding Agent Harness Architecture Papers

This repository is a research corpus on **AI coding agent harness architecture**: the systems, controls, metrics, and formal models needed to make agentic software development reliable, secure, governable, economical, and usable.

The main deliverable is a collection of formal papers in [`final_papers/`](final_papers/). The corpus treats an AI coding harness as more than a prompt wrapper around a model. It studies the harness as an engineered system with information flows, verification loops, coordination protocols, cost constraints, temporal dynamics, human oversight, model routing, and security boundaries.

## Canonical paper set

The canonical top-level synthesis is:

| Paper | Source | PDF | Role |
|---|---|---|---|
| **A Formal Framework for AI Coding Agent Harness Architecture** | [`final_papers/science.tex`](final_papers/science.tex) | [`final_papers/science.pdf`](final_papers/science.pdf) | Umbrella framework tying together all eleven architectural dimensions |

The pillar-level papers are:

| Pillar | Source | PDF | Focus |
|---|---|---|---|
| **Abstraction Architecture** | [`final_papers/abstraction_architecture/abstraction_architecture.tex`](final_papers/abstraction_architecture/abstraction_architecture.tex) | [`final_papers/abstraction_architecture/abstraction_architecture.pdf`](final_papers/abstraction_architecture/abstraction_architecture.pdf) | Specification-to-code abstraction gaps, refinement, and formal interfaces |
| **Information Architecture** | [`final_papers/information_architecture/information_architecture.tex`](final_papers/information_architecture/information_architecture.tex) | [`final_papers/information_architecture/information_architecture.pdf`](final_papers/information_architecture/information_architecture.pdf) | Context selection, degradation, tiered memory, and reuse discovery |
| **Reliability Architecture** | [`final_papers/reliability_architecture/reliability_architecture.tex`](final_papers/reliability_architecture/reliability_architecture.tex) | [`final_papers/reliability_architecture/reliability_architecture.pdf`](final_papers/reliability_architecture/reliability_architecture.pdf) | Compound error, verification scheduling, structural enforcement, and adaptive verification |
| **Coordination Architecture** | [`final_papers/coordination_architecture/coordination_architecture.tex`](final_papers/coordination_architecture/coordination_architecture.tex) | [`final_papers/coordination_architecture/coordination_architecture.pdf`](final_papers/coordination_architecture/coordination_architecture.pdf) | Multi-agent decomposition, merge conflicts, ownership, and quality-adjusted speedup |
| **Temporal Architecture** | [`final_papers/temporal_architecture/temporal_architecture.tex`](final_papers/temporal_architecture/temporal_architecture.tex) | [`final_papers/temporal_architecture/temporal_architecture.pdf`](final_papers/temporal_architecture/temporal_architecture.pdf) | Verified iterations per hour, staleness, speculation, caching, and speed-quality tradeoffs |
| **Quality Architecture** | [`final_papers/quality_architecture/quality_architecture.tex`](final_papers/quality_architecture/quality_architecture.tex) | [`final_papers/quality_architecture/quality_architecture.pdf`](final_papers/quality_architecture/quality_architecture.pdf) | AI code slop, layered defense, detection limits, accretion, and cost of quality |
| **Governance Architecture** | [`final_papers/governance_architecture/governance_architecture.tex`](final_papers/governance_architecture/governance_architecture.tex) | [`final_papers/governance_architecture/governance_architecture.pdf`](final_papers/governance_architecture/governance_architecture.pdf) | Governance capacity, ratchets, decision survival, and theory preservation |
| **Economics Architecture** | [`final_papers/economics_architecture/economics_architecture.tex`](final_papers/economics_architecture/economics_architecture.tex) | [`final_papers/economics_architecture/economics_architecture.pdf`](final_papers/economics_architecture/economics_architecture.pdf) | Token budgets, model-tier selection, queueing economics, CVIH, and caching economics |
| **Human Interaction Architecture** | [`final_papers/human_interaction_architecture/human_interaction_architecture.tex`](final_papers/human_interaction_architecture/human_interaction_architecture.tex) | [`final_papers/human_interaction_architecture/human_interaction_architecture.pdf`](final_papers/human_interaction_architecture/human_interaction_architecture.pdf) | Human attention allocation, autonomy boundaries, trust calibration, and supervision decay |
| **Model Routing Architecture** | [`final_papers/model_routing_architecture/model_routing_architecture.tex`](final_papers/model_routing_architecture/model_routing_architecture.tex) | [`final_papers/model_routing_architecture/model_routing_architecture.pdf`](final_papers/model_routing_architecture/model_routing_architecture.pdf) | Stage-specific model assignment, cross-model diversity, cascades, and escalation |
| **Security Architecture** | [`final_papers/security_architecture/security_architecture.tex`](final_papers/security_architecture/security_architecture.tex) | [`final_papers/security_architecture/security_architecture.pdf`](final_papers/security_architecture/security_architecture.pdf) | Sandboxing, credential flow, prompt injection, output filtering, and defense-in-depth |
| **The Accretion Category** | [`final_papers/accretion_category/accretion_category.tex`](final_papers/accretion_category/accretion_category.tex) | [`final_papers/accretion_category/accretion_category.pdf`](final_papers/accretion_category/accretion_category.pdf) | A defect class for individually plausible but collectively harmful AI-generated code |

The files `final_papers/science-assembled.tex`, `final_papers/science_new.tex`, `final_papers/science_backup.tex`, and `final_papers/science_backup_pre_security.tex` are backup, draft, or assembly artifacts. Treat [`final_papers/science.tex`](final_papers/science.tex) as the canonical umbrella source.

## The research program

The umbrella paper, **A Formal Framework for AI Coding Agent Harness Architecture**, organizes the work into eleven architectural dimensions:

1. **Abstraction**: how human intent, specifications, and code relate.
2. **Information**: what context agents should receive, search, hide, or persist.
3. **Reliability**: how errors compound and how verification should interrupt that compounding.
4. **Coordination**: how multiple agents should divide work without amplifying conflicts and defects.
5. **Temporal**: how speed, staleness, speculation, and caching affect verified throughput.
6. **Quality**: how to detect and prevent AI-specific code degradation.
7. **Governance**: how decisions, rules, and architectural theory survive high-velocity change.
8. **Economics**: how token budgets, model prices, latency, and queues shape harness design.
9. **Human Interaction**: how scarce human attention should be allocated across review, calibration, and oversight.
10. **Model Routing**: how heterogeneous models should be selected, cascaded, and cross-checked.
11. **Security**: how to contain an untrusted agent operating near developer credentials and code.

A recurring claim across the corpus is that **instructional control is not enough**. For long-running or high-impact agent pipelines, durable properties need structural mechanisms: sandboxes, permissions, verification gates, typed contracts, review protocols, budget constraints, context boundaries, and governance loops.

## Paper summaries

### A Formal Framework for AI Coding Agent Harness Architecture

The umbrella paper presents the full multi-pillar framework. It argues that harnesses should be analyzed with formal tools rather than treated as ad hoc collections of prompts and scripts. It introduces the eleven dimensions above, identifies cross-pillar couplings, summarizes empirical grounding, extracts design principles, responds to contrarian positions, and indexes the major formal results.

Key themes include the abstraction gap between intent and code, context as a scarce resource, exponential reliability decay across multi-step pipelines, coordination limits in multi-agent systems, verified iteration rate as a temporal objective, layered defense against AI code slop, governance as a capacity-limited control system, cost-adjusted throughput, human attention as a finite channel, heterogeneous model routing, and structural security enforcement.

### Abstraction Architecture

The abstraction paper formalizes the gap between a human specification and an executable program. It defines the abstraction gap as conditional Kolmogorov complexity, studies how the gap changes under refinement, and connects specification, program synthesis, logic, and category theory through a refinement lattice.

Its main claim is that natural language specifications are powerful but intrinsically incomplete for many software tasks. As specifications become sufficiently detailed to eliminate implementation ambiguity, they begin to converge toward code or formal artifacts. Harnesses therefore need multiple abstraction levels: natural language for intent, structured specs for constraints, formal checks for invariants, and executable artifacts for final behavior.

Notable constructs include the abstraction gap, spec-code convergence, refinement lattices, Galois connections as abstraction layers, and a specificity-compression metric for comparing specification styles and formal methods.

### Information Architecture

The information paper treats context as a scarce, degrading resource. It formalizes context selection as an optimization problem: given a finite window and a much larger codebase, the harness must choose the subset of information that maximizes task success while accounting for degradation as context grows.

The paper argues against the naive belief that more context is always better. Relevance may be submodular, but degradation can make the objective non-monotone. The result is a context budget theorem: the optimal amount of context is often strictly below the maximum window size. The paper also introduces a three-tier architecture of active, searchable, and hidden information, and frames reuse discovery as approximate nearest-neighbor search over semantic representations.

Notable constructs include context relevance, context degradation, submodularity of relevance, non-monotonicity of degradation-adjusted context, curation over accumulation, structural versus instructional enforcement, and reuse detection.

### Reliability Architecture

The reliability paper models multi-step agent workflows as series reliability systems. Even high per-step success rates can produce poor end-to-end reliability when errors compound across long trajectories. A pipeline with many individually plausible steps can still fail at the system level.

The paper develops formal results for compound error sensitivity, correlated failures, verification scheduling, circular validation bias, and structural enforcement thresholds. It argues for layered verification and for separating code generation from test generation when possible, because same-agent validation can share blind spots with the code it evaluates.

Notable constructs include series reliability, compound error sensitivity, optimal checkpoint counts, circular validation bias, structural enforcement boundaries, greedy efficiency ordering for verification layers, and cascaded detection rates.

### Coordination Architecture

The coordination paper studies multi-agent coding systems as coordination systems rather than simple parallelization engines. It argues that naive agent scaling can amplify error, produce merge conflicts, and reduce quality-adjusted throughput.

The paper models task decomposition as balanced min-cut over coupling graphs or hypergraphs, connects merge conflict probability to cut quality, and analyzes coordination using tools from reliability engineering, concurrency control, assume-guarantee reasoning, and Conway's Law. It introduces Quality-Adjusted Speedup as a metric for determining whether parallelism actually improves outcomes once defects and rework are included.

Notable constructs include error amplification, extended Amdahl-style limits, optimal agent count under coordination overhead, decomposition quality bounds, write skew under snapshot isolation, contract composition, topology dominance, graph-theoretic Conway's Law, and Quality-Adjusted Speedup.

### Temporal Architecture

The temporal paper argues that raw speed is not the same as productivity. The central metric is **Verified Iterations per Hour** (VIH): the rate of completed iterations multiplied by the probability that those iterations survive verification.

The paper models context freshness, staleness decay, speculative execution, cache refresh intervals, stochastic scheduling, execution-mode choice, and speed-quality frontiers. It shows that there is an optimal operating point where additional speed begins to reduce verified throughput because rework and lower verification probability dominate.

Notable constructs include exponential staleness decay, VIH decomposition, VIH optimal speed, speculation ratio tests, speculation depth limits, cache-staleness EOQ, Bayesian execution mode selection, Pareto frontiers, and mixed strategy convexification.

### Quality Architecture

The quality paper studies AI code quality as a layered defense problem. It argues that AI-generated code introduces a broad class of "slop": code that may be syntactically valid and locally plausible but harmful, redundant, brittle, insecure, overgeneralized, or inconsistent with project intent.

The paper formalizes an 18-type slop taxonomy, classifies detection by decidability, formulates layered defense as an optimization problem, and proves detection ceilings for context-poor layers. It also analyzes correlated judge-producer error, where a model used to judge code may share failure modes with the model that produced it.

Notable constructs include decidable, semi-decidable, and undecidable slop classes; layered defense optimization; detection ceilings via information constraints; judge-producer correlation; defect removal efficiency cascades; cost-of-quality modeling; and the accretion category.

### Governance Architecture

The governance paper treats governance as a bounded information channel and a multi-loop control system. Its central claim is that if architecture drift enters faster than governance can detect, interpret, and correct it, divergence is inevitable regardless of intent.

The paper formalizes program theory, architectural drift, governance channel capacity, cascade governance, ratchets, controlled relaxation, and decision survival over time. It frames architectural decision records, reviews, evidence expiry, and phase gates as mechanisms for preserving theory under high-velocity agentic change.

Notable constructs include theory extraction bounds, tacit divergence, governance capacity, critical governance thresholds, governance bifurcation, ratchet convergence, ossification risk, and decision survival analysis.

### Economics Architecture

The economics paper makes cost a first-class architectural concern. AI coding harnesses consume tokens across planning, generation, review, verification, repair, and governance stages, while model prices and quality differ sharply by task and provider.

The paper formulates token allocation and model tier selection problems, studies interactive and autonomous queueing regimes, introduces cost-adjusted verified iterations per hour, and proves a cache-first principle. Its practical message is that harnesses should optimize quality-per-dollar and verified throughput, not raw model capability.

Notable constructs include the Token Budget Allocation Problem, Equal Marginal Rate theorem, Weakest-Link theorem, Model Tier Selection Problem, queueing economics, Jevons-style token demand effects, CVIH, budget separation, and cache-first optimization.

### Human Interaction Architecture

The human interaction paper treats human oversight as a finite-capacity subsystem. Human review is not a binary gate that can simply be added to any workflow. It consumes attention, creates queues, suffers vigilance decay, and must be allocated where it has the highest marginal value.

The paper models review as signal detection, attention allocation as constrained optimization, autonomy boundaries as Bayesian decision thresholds, and trust calibration as a bandit problem. It also formalizes the automation supervision paradox: as automation improves and human review becomes less frequent or less engaged, human detection can degrade.

Notable constructs include optimal risk-ranked triage, autonomy thresholds, capacity-constrained review, trust calibration bandits, vigilance decay, optimal probe rates, human interaction budgets, complementarity conditions, and learning-to-defer equivalence.

### Model Routing Architecture

The model routing paper argues that a harness should not assume one model for every task. Different models have different strengths, costs, latencies, context behavior, and correlated failure modes. Routing is therefore an architectural optimization problem.

The paper studies heterogeneous stage assignment, cross-model diversity, pipeline crossover between cheap repeated attempts and expensive single attempts, adaptive escalation, cascade routing, and routing collapse. A major claim is that a weaker independent verifier can outperform a stronger but highly correlated same-family verifier in some regimes.

Notable constructs include the Heterogeneous Stage Assignment Problem, capacity-constrained assignment, Gaussian copula models of cross-model diversity, weak-independent versus strong-correlated verification, pipeline crossover, sequential probability ratio escalation, cascade expected cost, regret with switching costs, and routing collapse mitigation.

### Security Architecture

The security paper treats the AI coding agent as untrusted code operating near high-value assets. Because agents may receive adversarial instructions through prompts, files, issue text, webpages, dependencies, or generated artifacts, the agent itself should not be inside the Trusted Computing Base.

The paper grounds harness security in access control, information flow, sandboxing, credential isolation, prompt-injection robustness, output filtering, and defense-in-depth. Its central claim is that prompt-based security decays over long trajectories, while structural enforcement depends on the correctness of external controls.

Notable constructs include sandbox restriction operators, capability sets, HRU-style access control limits, credential noninterference, structural enforcement decay, alignment-impossibility arguments, output filtering as channel restriction, correlated defense bounds, and TCB correctness sufficiency.

### The Accretion Category

The accretion paper defines a defect class especially relevant to AI-generated code: changes that are individually plausible, locally correct, and reviewable, but collectively harmful because they add unnecessary structure, coupling, indirection, duplication, or maintenance burden over time.

The paper argues that point-in-time review cannot reliably detect accretion, because any individual change may be defensible. Instead, accretion must be monitored longitudinally through structural metrics, process control, coupling growth, clone frequency, refactoring ratios, and fan-out trends.

Notable constructs include the accretion defect definition, coupling complexity, accretion rate, compound degradation, refactoring-ratio thresholds, individual undecidability of accretion detection, aggregate statistical detection, layered defense, detection ceilings, and cost-of-quality tradeoffs.

## Cross-cutting concepts

Several ideas recur across the papers:

- **Information is the common currency.** Specifications, context windows, governance logs, human attention, credentials, and verification signals are all treated as bounded information channels.
- **Local correctness is not system correctness.** Correct individual steps, patches, or reviews can still compose into failure through compounding error, coordination conflict, drift, accretion, or stale context.
- **Structural enforcement beats instruction following for durable constraints.** Prompts can guide behavior, but sandboxes, permissions, typed contracts, deterministic checks, budgets, and gates enforce boundaries.
- **Optimization targets must include verification and cost.** The relevant objective is not maximum model capability or maximum speed, but verified, cost-adjusted, risk-adjusted throughput.
- **Human oversight is scarce.** Review should be allocated by risk, calibrated over time, and protected from vigilance decay.
- **Multi-agent systems need topology, not just parallelism.** Decomposition, ownership, contracts, and merge semantics determine whether agent teams help or hurt.
- **AI code quality has temporal structure.** Some defects, especially accretion and architectural drift, are only visible across sequences of changes.

## Suggested reading paths

### Fast overview

1. [`final_papers/science.pdf`](final_papers/science.pdf)
2. The theorem index and design principles in the same paper
3. Any pillar paper matching your immediate concern

### Building an agent harness

1. Abstraction Architecture
2. Information Architecture
3. Reliability Architecture
4. Security Architecture
5. Human Interaction Architecture
6. Governance Architecture

### Scaling to multi-agent workflows

1. Coordination Architecture
2. Reliability Architecture
3. Temporal Architecture
4. Model Routing Architecture
5. Quality Architecture

### Reducing cost and latency

1. Economics Architecture
2. Temporal Architecture
3. Model Routing Architecture
4. Information Architecture

### Hardening production use

1. Security Architecture
2. Reliability Architecture
3. Governance Architecture
4. Quality Architecture
5. Human Interaction Architecture

### Studying AI-generated code degradation

1. Quality Architecture
2. The Accretion Category
3. Governance Architecture
4. Temporal Architecture

## Repository structure

```text
final_papers/
  science.tex                         # canonical umbrella paper source
  science.pdf                         # canonical umbrella paper PDF
  abstraction_architecture/           # pillar paper source, bibliography, PDF
  information_architecture/
  reliability_architecture/
  coordination_architecture/
  temporal_architecture/
  quality_architecture/
  governance_architecture/
  economics_architecture/
  human_interaction_architecture/
  model_routing_architecture/
  security_architecture/
  accretion_category/                 # standalone defect-class paper
outputs/                              # intermediate research and review artifacts
papers/, research/, concepts/          # supporting notes and source material
```

Most pillar directories contain:

```text
<slug>.tex       # LaTeX source
<slug>.bib       # bibliography
<slug>.pdf       # rendered paper
```

Some newer papers also include provenance files recording generation and verification metadata.

## Building the PDFs

The PDFs in `final_papers/` are already rendered. To rebuild a paper, install a LaTeX engine such as `tectonic`, then compile from the paper directory:

```bash
cd final_papers/model_routing_architecture
tectonic -Z continue-on-errors model_routing_architecture.tex
```

For the umbrella paper:

```bash
cd final_papers
tectonic -Z continue-on-errors science.tex
```

The papers use the `googledeepmind` LaTeX class. Several pillar directories include local copies of `googledeepmind.cls` and `logo.pdf`; root-level copies also exist in the repository.

## How to use this corpus

Use the corpus as:

- a **research map** for AI coding harness architecture,
- a **design checklist** for production agent systems,
- a **formal vocabulary** for discussing agent reliability, security, quality, and governance,
- a **source of metrics** such as VIH, CVIH, Quality-Adjusted Speedup, accretion rate, and governance capacity,
- a **set of hypotheses** to empirically test against real harness telemetry.

The papers are theory and position papers with empirical calibration where available. Many idealized metrics use uncomputable or partially observable quantities, such as Kolmogorov complexity, true defect probability, or complete architectural theory. The practical value is in the derived approximations, design principles, and architectural constraints, not in treating every formal object as directly measurable.

## Citation and attribution

The papers use anonymized author placeholders and the affiliation `Pragnition Labs` in the LaTeX sources. See each paper's `.bib` file for cited literature.
