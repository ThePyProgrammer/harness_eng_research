# Pillar Synthesis Notes

Structured summaries of all seven HTX Harness Engineering pillar papers, extracted for unified paper synthesis.

---

## 1. Abstraction Architecture

**Title:** Abstraction Architecture for AI Coding Agent Harnesses

**Bibliography file:** `main`

### Section Structure

- Section 1: Introduction
- Section 2: Preliminaries and Definitions (`sec:preliminaries`)
  - 2.1: Agent Systems
  - 2.2: Coordination Metrics
  - 2.3: The Specification-Code Pair
- Section 3: The Abstraction Gap: Information-Theoretic Foundations (`sec:information-theory`)
  - 3.1: Kolmogorov Complexity of Specifications and Code
  - 3.2: The Normalised Information Distance
  - 3.3: Convergence Theorem
  - 3.4: The Shannon Channel Model
- Section 4: The Refinement Lattice (`sec:refinement-lattice`)
  - 4.1: Specifications as a Complete Lattice
  - 4.2: The Curry-Howard-Lambek Bridge
  - 4.3: Galois Connections as Abstraction Layers
- Section 5: Application to Multi-Agent Systems (`sec:multi-agent`)
  - 5.1: The Agent-Mediated Abstraction Gap
  - 5.2: Multi-Agent Gap Modulation
- Section 6: The Specificity-Compression Metric and Thinker Placement (`sec:thinker-placement`)
  - 6.1: Two Dimensions of Abstraction
  - 6.2: Placement of Major Thinkers
  - 6.3: The Uncanny Valley of Specification
- Section 7: Cognitive Factors (`sec:cognitive`)
- Section 8: Contrarian Analysis: The Case for Natural Language (`sec:contrarian`)
- Section 9: Empirical Calibration (`sec:empirical`)
- Section 10: Related Work (`sec:related-work`)
- Section 11: Design Principles for AI Coding Agent Harnesses (`sec:design-principles`)
- Section 12: Limitations
- Section 13: Conclusion
- Appendix: Verification Roadmap (`app:verification`)

### Theorems, Definitions, and Formal Results

| Label | Type | Name/Content |
|-------|------|--------------|
| (unnumbered) | Definition | Agent: tuple $(\Phi, \mathfrak{A}, \mathcal{T}, \pi)$ |
| (unnumbered) | Definition | Single-Agent System (SAS) |
| (unnumbered) | Definition | Multi-Agent System (MAS): tuple $(A, \mathcal{E}, \mathcal{C}, \Omega)$ with four topologies |
| (unnumbered) | Definition | Coordination Efficiency $E_c$, Coordination Overhead $O$, Error Amplification $A_e$, Redundancy Rate $R$ |
| (unnumbered) | Definition | Specification as predicate transformer (Dijkstra WP calculus) |
| (unnumbered) | Definition | Program as deterministic, feasible specification |
| (unnumbered) | Definition | Implementation Relation: $P \models S$ iff $S \sqsubseteq P$ |
| (unnumbered) | Definition | Abstraction Gap: $\mathcal{G}(S, P) = K(P \mid S)$ |
| `thm:gap-properties` | Theorem | Properties of the Abstraction Gap: minimality, maximality, monotonicity, additivity |
| (unnumbered) | Definition | Abstraction Distance (Normalised Information Distance): $d(S,P)$ |
| `thm:nid` | Theorem | Universality of NID (Li-Vitanyi): $d$ is a universal metric |
| `thm:convergence` | Theorem | Spec-Code Convergence: for incompressible $P$, $|S| \geq |P| - O(\log |P|)$ |
| (unnumbered) | Definition | Spec-to-Code Channel with capacity $C$ |
| `thm:lattice` | Theorem | Refinement Lattice: specifications form a complete lattice under refinement |
| (unnumbered) | Definition | Abstraction Layer as Galois connection $(\alpha, \gamma)$ |
| (unnumbered) | Remark | Agent Decomposition: $\mathcal{G}(S,P) \leq \mathcal{G}(S, \hat{S}) + \mathcal{G}(\hat{S}, P) + O(\log n)$ |
| (unnumbered) | Definition | Specificity-Compression Space: $(\sigma, \kappa) \in [0,1]^2$ |

### Key Formal Objects

- $\mathcal{G}(S, P) = K(P \mid S)$: abstraction gap (conditional Kolmogorov complexity)
- $d(S, P)$: normalised information distance
- $(\sigma, \kappa)$: specificity-compression metric
- $\sigma(S) = 1 - \log|\llbracket S \rrbracket_N| / \log|\text{Prog}_N|$: specificity
- $\kappa(S) = \max(0, 1 - |S|/K(P))$: compression
- Refinement ordering $\sqsubseteq$ on specifications
- Galois connections $(\alpha, \gamma)$ forming a tower of abstractions

### Cross-references to Other Pillars

- References coordination metrics from Kim et al. (2025), shared with Coordination Architecture
- "Preserve the Theory" design principle connects to Governance Architecture (Naur's theory building)
- Abstraction gap $\mathcal{G}$ decomposition relates to Information Architecture's $H(P|S)$

### Key Citations

Dijkstra (1978), Gonzalez (2026), Kim et al. (2025), Kolmogorov (1965), Chaitin (1966), Li and Vitanyi (2004, 2019), Martin-Lof (1979), Back (1980), Morgan (1994), Cousot and Cousot (1977), Shannon (1948), Hindle et al. (2012), Naur (1985), Suchman (1987), Wittgenstein (1953), Newcombe et al. (2015 -- TLA+ at AWS), Kleppmann (2025), Wadler (2015), Lambek (1986)

---

## 2. Information Architecture

**Title:** Information Architecture for AI Coding Agent Harnesses

**Bibliography file:** `info-arch`

### Section Structure

- Section 1: Introduction (`sec:introduction`)
- Section 2: Preliminaries and Definitions (`sec:preliminaries`)
  - 2.1: Notation
  - 2.2: Why Shannon, Not Kolmogorov
  - 2.3: The Entropy of Specifications and Code
- Section 3: The Context Selection Problem (`sec:context-selection`)
  - 3.1: Formal Statement
  - 3.2: Submodularity Analysis
  - 3.3: The Degradation-Adjusted Objective
- Section 4: The Abstraction Gap Decomposition (`sec:abstraction-gap`)
  - 4.1: The Bimodal Gap (`sec:bimodal`)
  - 4.2: Advantage Over Kolmogorov
- Section 5: Context Degradation: Empirical Characterization (`sec:degradation`)
  - 5.1: Universal Degradation
  - 5.2: The U-Shaped Positional Recall Function
  - 5.3: Degradation Function Fit
  - 5.4: Position Dominates Relevance
  - 5.5: Superlinear Distractor Interference
- Section 6: The Context Budget Theorem (`sec:budget`)
- Section 7: The Three-Tier Information Architecture (`sec:tiered`)
  - 7.1: Formal Model
  - 7.2: Context Curation Theorem
  - 7.3: Structural vs. Instructional Enforcement
  - 7.4: Fresh Context Advantage
- Section 8: The Reuse Discovery Problem (`sec:reuse`)
  - 8.1: Formal Statement
  - 8.2: State of the Art in Code Embeddings
  - 8.3: The Missing Decision Gate
  - 8.4: The Reuse Map as Compression
- Section 9: Empirical Calibration from Production Harnesses (`sec:empirical`)
- Section 10: Related Work (`sec:related`)
- Section 11: Design Principles (`sec:design`)
- Section 12: Conclusion (`sec:conclusion`)

### Theorems, Definitions, and Formal Results

| Label | Type | Name/Content |
|-------|------|--------------|
| `def:relevance` | Definition | Context Relevance Function: $f(C) = I(C; P \mid S, \theta)$ |
| `def:degradation` | Definition | Context Degradation Function: $\delta(x) = (x/W_{\text{eff}})^{\alpha_d}$ |
| `def:csp` | Definition | Context Selection Problem: maximize $f(C) \cdot (1 - \delta(|C|))$ |
| `thm:submodularity` | Theorem | Submodularity of Context Relevance |
| `prop:sufficient` | Proposition | Sufficient conditions for submodularity |
| `prop:break` | Proposition | Code Dependencies Break Submodularity |
| `thm:nonmonotone` | Theorem | Non-Monotonicity of the Product Objective |
| `thm:greedy` | Proposition | Greedy Approximation: $1/2$-approximation for non-monotone objective |
| `thm:decomposition` | Theorem | Abstraction Gap Decomposition: $H(P|S) = H(P|S,C,\theta) + I(P;C|S,\theta) + I(P;\theta|S)$ |
| `def:recall` | Definition | Positional Recall Function (double-exponential with length-dependent floor) |
| `prop:position` | Proposition | Position Dominance Inequality |
| `thm:budget` | Theorem | Optimal Context Is Less Than Capacity: $|C^*| < W$ |
| `cor:budget` | Corollary | Practical Budget Rule: $|C^*| \approx 0.15W$ to $0.40W$ |
| `def:tiers` | Definition | Three-Tier Partition: Active, Searchable, Hidden |
| `thm:curation` | Theorem | Curation Beats Accumulation |
| `thm:compliance` | Theorem | Multi-Step Compliance Decay: $(1-\epsilon)^T$ |
| `thm:fresh` | Proposition | Fresh Context Dominance |
| (unnumbered) | Definition | Functional Similarity (normalised mutual information) |
| (unnumbered) | Definition | Reuse Detection Problem |

### Key Formal Objects

- $f(C) = I(C; P \mid S, \theta)$: context relevance (mutual information)
- $\delta(|C|) = (|C|/W_{\text{eff}})^\alpha$: degradation function, $\alpha \in [0.3, 0.5]$
- $\tilde{f}(C) = f(C) \cdot (1 - \delta(|C|))$: degradation-adjusted objective
- $H(P|S) = H(P|S,C,\theta) + I(P;C|S,\theta) + I(P;\theta|S)$: abstraction gap decomposition
- Three-tier partition $T_1 \sqcup T_2 \sqcup T_3$ (Active/Searchable/Hidden)
- Instructional compliance decay $(1-\epsilon)^T$

### Cross-references to Other Pillars

- Explicitly uses Shannon analog of Abstraction Architecture's $K(P|S)$, framing $H(P|S)$ as the computable counterpart
- Structural vs. instructional enforcement shared with Reliability Architecture
- Context degradation connects to Temporal Architecture's context freshness model
- Reuse discovery connects to Quality Architecture's duplicate logic (slop type)

### Key Citations

Chroma (2025), Liu (2024 "Lost in the Middle"), Du et al. (2025), Gloaguen et al. (2026 AGENTS.md), JetBrains (2025), Shannon (1951), Hindle et al. (2012), Krause and Guestrin (2008), Jina (2025), Anthropic (2025 context engineering), Spotify Honk (2025), HumanLayer (2025), Tishby (2000 information bottleneck), Sweller (1988 cognitive load)

---

## 3. Reliability Architecture

**Title:** Reliability Architecture for AI Coding Agent Harnesses

**Bibliography file:** `main`

### Section Structure

- Section 1: Introduction (`sec:intro`)
- Section 2: Preliminaries and Definitions (`sec:prelim`)
- Section 3: Compound Error Dynamics (`sec:compound`)
  - 3.1: The Series Reliability Product Law
  - 3.2: The Compound Error Sensitivity Theorem
  - 3.3: Correlated Failures: The Common-Cause Model
  - 3.4: Empirical Calibration
- Section 4: Optimal Verification Scheduling (`sec:verification`)
  - 4.1: Problem Formulation
  - 4.2: Equal-Spacing Optimality
  - 4.3: Diminishing Returns of Verification Rounds
- Section 5: Circular Validation Bias (`sec:circular`)
  - 5.1: Formal Definition
  - 5.2: The Blind-Spot Model
  - 5.3: Connection to the METR Merge-Gap Finding
- Section 6: The Structural Enforcement Boundary (`sec:structural`)
  - 6.1: Definitions
  - 6.2: The Cost-of-Failure Threshold
  - 6.3: Multi-Step Amplification
  - 6.4: Agent Gaming and the Adversarial Collapse
- Section 7: Adaptive Verification Architecture (`sec:adaptive`)
  - 7.1: The Four-Layer Model
  - 7.2: Adaptive Verification Intensity
  - 7.3: Multi-Agent Verification Economics
- Section 8: Related Work (`sec:related`)
- Section 9: Design Principles (`sec:principles`)
- Section 10: Conclusion (`sec:conclusion`)
- Appendix A: Proofs and Extended Results (`app:proofs`)

### Theorems, Definitions, and Formal Results

| Label | Type | Name/Content |
|-------|------|--------------|
| (unnumbered) | Definition | Agent Pipeline: $n$-step tuple $(S_1, \ldots, S_n)$, series reliability system |
| (unnumbered) | Definition | Per-Step Success Probability $p_i$ |
| (unnumbered) | Definition | Error Propagation Probability $q_i$ |
| (unnumbered) | Definition | Verification Layer: $(d(\ell), f(\ell), c(\ell), \tau(\ell))$, efficiency $\eta = d/c$ |
| `thm:series` | Theorem | Series Reliability: $R(n) = \prod p_i$ |
| (corollary) | Corollary | Homogeneous Pipeline: $R(n) = p^n$ |
| `thm:sensitivity` | Theorem | Compound Error Sensitivity: elasticity equals pipeline length $n$ |
| `cor:weakest` | Corollary | Weakest-Link Priority: improve the step with lowest $p_i$ |
| `def:commoncause` | Definition | Common-Cause Failure Model (Marshall-Olkin): $X_i = \max(Z_i, Y)$ |
| `thm:correlated` | Theorem | Correlated Failure Reliability: $R(n) = (1-\gamma)\prod(1-\alpha_i)$ |
| (unnumbered) | Definition | Verification Scheduling Problem |
| `thm:equalspacing` | Theorem | Equal-Spacing Optimality for homogeneous pipelines |
| `thm:optcheckpoints` | Theorem | Optimal Checkpoint Count: $k^* \approx \lfloor\sqrt{n(1-p)c_0/c_v}\rfloor$ (Young-Daly analog) |
| `thm:diminishing` | Theorem | Geometric Diminishing Returns: $\Delta M(k) = N_0 v (1-v)^{k-1}$ |
| (unnumbered) | Definition | Circular Validation Bias $\beta$ |
| (unnumbered) | Definition | Blind-Spot Set $B_A$ |
| `thm:bias` | Theorem | Bias Decomposition: $\beta = \beta_A(1 - \beta_{A'})$ |
| (corollary) | Corollary | Self-Verification Provides Zero Bias Reduction |
| `thm:separation` | Theorem | Structural Separation Theorem |
| (unnumbered) | Definition | Structural Enforcement: $\sigma(a) \notin \mathcal{C}$ for all $a$ |
| (unnumbered) | Definition | Prompt Enforcement: compliance probability $1 - \delta$ |
| `thm:threshold` | Theorem | Structural Enforcement Threshold: $L^* = (c_s - c_p)/(\delta - \delta_s)$ |
| `thm:compounding` | Theorem | Compounding Non-Compliance: $L_n^* \approx L^*/n$ |
| (unnamed) | Theorem | Greedy Efficiency Ordering for verification layers |
| (unnamed) | Theorem | Cascaded Detection Rate: $d_{\text{combined}} = 1 - \prod(1-d(\ell_j))$ |
| (appendix) | Theorem | Pipeline Reliability Under Markov Error Propagation |
| (appendix) | Theorem | LLM-Verifier Convergence |

### Key Formal Objects

- $R(n) = p^n$: pipeline reliability (series system)
- Elasticity $\varepsilon = n$: 1% per-step improvement yields $n$% end-to-end
- Common-cause model: $\gamma$ (shared failure), $\alpha_i$ (independent failures)
- Verification scheduling: $k^* \approx \sqrt{n(1-p)c_0/c_v}$
- Circular validation bias $\beta = \beta_A(1 - \beta_{A'})$
- Enforcement threshold $L^* = (c_s - c_p)/(\delta - \delta_s)$
- Four-layer verification: efficiencies $\eta = 0.95, 0.16, 0.014, 0.002$
- Adaptive verification: switching threshold $\tau(\ell-1 \to \ell)$

### Cross-references to Other Pillars

- Structural vs. prompt enforcement shared with Information Architecture and Quality Architecture
- The four-layer verification model parallels Quality Architecture's four-layer defense stack
- Common-cause failures relate to Coordination Architecture's error amplification
- Verification scheduling (Young-Daly analog) connects to Temporal Architecture's pipeline scheduling

### Key Citations

Marshall and Olkin (1967), Young (1974), Daly (2006), Barlow and Proschan (1965), Hariharan et al. (2025), METR (2026), Wang et al. (2026 AgentSpec), Apollo Research (2025), NIST CAISI (2025), Rajan (2026), Cognition/Devin (2025), Google (2025 scaling), Fano (1961)

---

## 4. Coordination Architecture

**Title:** Coordination Architecture for AI Coding Agent Harnesses

**Bibliography file:** `coord-main`

### Section Structure

- Section 1: Introduction (`sec:intro`)
- Section 2: Preliminaries and Definitions (`sec:prelim`)
- Section 3: Error Amplification and Scaling Limits (`sec:error`)
  - 3.1: Error Amplification under Independence
  - 3.2: Information-Sharing Reduction Factor
  - 3.3: Capability Saturation Crossover
  - 3.4: Extended Amdahl's Law with Reliability Factor
  - 3.5: Incorporating the Universal Scalability Law
- Section 4: Task Decomposition as Balanced Min-Cut (`sec:decomp`)
  - 4.1: Formal Problem
  - 4.2: NP-Hardness and Approximation
  - 4.3: Cheeger Inequality and Spectral Methods
  - 4.4: Practical Algorithms
  - 4.5: Hypergraph Model for Software
  - 4.6: Cut-Conflict Bridge
- Section 5: Merge Conflict Probability Model (`sec:merge`)
  - 5.1: Five-Level Taxonomy
  - 5.2: Probabilistic Graphical Model
  - 5.3: Quadratic Growth
  - 5.4: Contract Reduction to $O(k)$
- Section 6: Coordination as Concurrency Control (`sec:concurrency`)
  - 6.1: The Database Analogy
  - 6.2: Write Skew as the Critical Anomaly
  - 6.3: Assume-Guarantee Contracts
  - 6.4: Composition Theorem
  - 6.5: Correctness Conditions
- Section 7: Topology Selection (`sec:topology`)
  - 7.1: Formal Objective
  - 7.2: Per-Topology Expressions
  - 7.3: Dominance Conditions
  - 7.4: Conway's Law as Communication Graph Containment
- Section 8: Quality-Adjusted Speedup (`sec:qas`)
  - 8.1: Definition
  - 8.2: Throughput Crossover Analysis
  - 8.3: Calibration against DORA Data
  - 8.4: Calibration against Kim et al. Data
  - 8.5: Demonstration: QAS < 1
- Section 9: Empirical Calibration and Design Principles (`sec:empirical`)
  - 9.1: Calibration Tables
  - 9.2: Coupling Density Dynamics
  - 9.3: Six Design Principles
- Section 10: Related Work (`sec:related`)
- Section 11: Conclusion (`sec:conclusion`)
- Appendix A: Extended Proofs (`app:proofs`)

### Theorems, Definitions, and Formal Results

| Label | Type | Name/Content |
|-------|------|--------------|
| `def:coupling-graph` | Definition | Coupling Graph: $G = (F, E, w)$ with composite coupling metric |
| `def:error-amp` | Definition | Error Amplification Factor: $A_e(t,k)$ |
| `def:topology` | Definition | Topology Space: $\{\text{indep, central, hier, iso-merge}\}$ |
| `def:contract` | Definition | Coordination Contract: $(\{F_i\}, \{I_j\}, \sigma)$ |
| `def:isolation` | Definition | Isolation Levels for Agents (4 levels, database analogy) |
| `thm:error-amp` | Theorem | Error Amplification under Independence: $A_e = (1-(1-\epsilon)^k)/\epsilon$ |
| `def:coord-benefit` | Definition | Coordination Benefit Function: $\epsilon_t = \epsilon \cdot g(I(t))$ |
| `def:saturation` | Definition | Saturation Threshold $P^*$ |
| `conj:phase` | Conjecture | Saturation Crossover at $P^* \approx 0.45$ |
| `thm:amdahl` | Theorem | Extended Amdahl's Law: $S_{\text{eff}}(n) = [1/(s + (1-s)/n)] \cdot (1-\delta)^n$ |
| `thm:nstar` | Theorem | Optimal Agent Count: $n^* \approx 1/\sqrt{\delta}$ |
| `def:decomp` | Definition | Task Decomposition as balanced min-cut |
| `thm:nphard` | Theorem | NP-Hardness of balanced partition |
| `thm:cheeger` | Theorem | Discrete Cheeger Inequality |
| `lem:bridge` | Lemma | Cut-Conflict Bridge: $\mathbb{E}[N_{\text{conflicts}}] \leq \alpha \cdot W_{\text{cut}}(\pi)$ |
| `thm:decomp-quality` | Theorem | Decomposition Quality Bounds Conflict Rate |
| `def:conflict-pgm` | Definition | Multi-Level Conflict Model (probabilistic graphical model) |
| `lem:quadratic` | Lemma | Quadratic Scaling: $O(k^2)$ conflict growth |
| `thm:contract-reduction` | Theorem | Ownership Reduces Conflict Order: $O(k^2) \to O(k)$ |
| `thm:write-skew` | Theorem | Write Skew under Snapshot Isolation |
| `thm:composition` | Theorem | Contract Composition (assume-guarantee) |
| `thm:correctness` | Theorem | Correctness Hierarchy: Strong implies Weak |
| `thm:achievability` | Theorem | Achievability under Snapshot + Contracts |
| (unnumbered) | Definition | Topology Selection Problem |
| `prop:dominance` | Proposition | Topology Dominance conditions |
| `thm:conway` | Theorem | Conway's Law, Graph-Theoretic Form |
| `thm:inverse-conway` | Theorem | Inverse Conway for Agents (constrained balanced min-cut) |
| `def:qas` | Definition | Quality-Adjusted Speedup: $\text{QAS}(k) = S(k) \cdot (1-d(k))/(1-d(1))$ |
| `prop:qas-negative` | Proposition | Conditions for QAS < 1 (parallelism net-negative) |
| (unnumbered) | Definition | Partition Half-Life $\tau_{1/2}$ |

### Key Formal Objects

- $A_e(t,k)$: error amplification factor
- $S_{\text{eff}}(n) = [1/(s+(1-s)/n)] \cdot (1-\delta)^n$: Extended Amdahl's Law
- $n^* \approx 1/\sqrt{\delta}$: optimal agent count
- Coupling graph $G = (F, E, w)$ with balanced min-cut partition
- Five-level conflict taxonomy (textual, structural, dependency, API, semantic)
- $\text{QAS}(k) = S(k) \cdot (1-d(k))/(1-d(1))$: quality-adjusted speedup
- Conway's Law as $E_R \subseteq E_T$ (graph containment)
- USL extension: $S_{\text{eff}} = n/(1 + \sigma(n-1) + \kappa n(n-1)) \cdot (1-\delta)^n$
- Assume-guarantee contracts: $(Asm_i, Guar_i)$

### Cross-references to Other Pillars

- Error amplification model extends Reliability Architecture's compound error model
- Structural enforcement principle shared with Reliability Architecture and Information Architecture
- Quality-Adjusted Speedup connects to Temporal Architecture's VIH metric
- Conway's Law treatment links to Governance Architecture's organizational analysis
- Kim et al. (2025) data shared with Abstraction Architecture

### Key Citations

Kim et al. (2025), DORA (2025), Cursor (2026), Osmani (2025), Amdahl (1967), Gunther (2008 USL), Kernighan-Lin (1970), Fiduccia-Mattheyses (1982), Karypis-Kumar (1998 METIS), Fiedler (1973), Cheeger/Lee et al. (2012), Bernstein-Hadzilacos (1987), Berenson (1995), Meyer (1992), Henzinger (2002), Jones (1983 rely-guarantee), Conway (1968), Lehman (1980), Brun (2011), Kasi-Sarma (2013), Ghiotto (2018), Sousa (2018 SafeMerge), Accioly (2018)

---

## 5. Temporal Architecture

**Title:** Temporal Architecture for AI Coding Agent Harnesses

**Bibliography file:** `temporal-architecture`

### Section Structure

- Section 1: Introduction (`sec:intro`)
- Section 2: Preliminaries and Definitions (`sec:prelim`)
  - 2.1: The Agent Pipeline as a Stochastic DAG
  - 2.2: Key Classical Results
- Section 3: Context Freshness and Information Decay (`sec:freshness`)
  - 3.1: The Context Channel Model
  - 3.2: Illustrative Calibration
- Section 4: Verified Iterations per Hour (`sec:vih`)
  - 4.1: Definition and Decomposition
  - 4.2: The Speed-Quality Tradeoff
  - 4.3: Amdahl's Law Bound on VIH
- Section 5: Stochastic Pipeline Scheduling (`sec:scheduling`)
  - 5.1: Sequential Makespan
  - 5.2: Makespan with Failures
- Section 6: Speculative Execution in Agent Pipelines (`sec:speculation`)
  - 6.1: The Speculation Ratio Test
  - 6.2: Speculation Depth Limit
  - 6.3: The Spectre Analogy and Hidden Costs
- Section 7: Caching and the Staleness Tradeoff (`sec:caching`)
  - 7.1: The Cache Refresh Problem
  - 7.2: Competitive Analysis
  - 7.3: Three Caching Layers
  - 7.4: The Cache-Quality Tension
- Section 8: Execution Mode Selection (`sec:modes`)
  - 8.1: Decision-Theoretic Framework
  - 8.2: Bainbridge's Ironies
- Section 9: The Speed-Quality Pareto Frontier (`sec:pareto`)
  - 9.1: Frontier Structure
  - 9.2: Mixing Strategies
  - 9.3: VIH Maximization
- Section 10: Illustrative Calibration (`sec:calibration`)
- Section 11: Related Work (`sec:related`)
- Section 12: Design Principles (`sec:principles`)
- Section 13: Contrarian Positions and Limitations (`sec:contrarian`)
- Section 14: Conclusion (`sec:conclusion`)
- Appendix A: Verification Roadmap (`app:verification`)
- Appendix B: Extended Proofs (`app:proofs`)

### Theorems, Definitions, and Formal Results

| Label | Type | Name/Content |
|-------|------|--------------|
| `def:pipeline` | Definition | Agent Pipeline DAG: $G = (V, E, \mathbf{D}, \mathbf{q})$ |
| `def:fidelity` | Definition | Context Fidelity: $\Phi(t) = e^{-\Lambda(t-t_0)}$ |
| `thm:staleness` | Theorem | Exponential Staleness Decay |
| `def:vih` | Definition | VIH: $n_{\text{verified}} / T_{\text{wall}}$ |
| `thm:vih-decomp` | Theorem | VIH Decomposition: $\text{VIH} = \lambda_{\text{raw}} \cdot p_{\text{verify}}$ |
| `prop:tradeoff` | Proposition | Speed-Quality Tradeoff: $p_{\text{verify}}$ decreasing in $\lambda_{\text{raw}}$ |
| `thm:vih-opt` | Theorem | VIH Optimal Speed: unit-elasticity condition, $\lambda^* = 1/\beta$ |
| `thm:seq` | Theorem | Sequential Makespan: $\E[M_{\text{seq}}] = \sum \mu_i$ |
| `thm:failures` | Theorem | Expected Makespan with Geometric Retries: $\E[M_{\text{fail}}] = \sum \mu_i/p_i$ |
| `def:spec` | Definition | Speculation Policy |
| `thm:spec-ratio` | Theorem | Speculation Ratio Test: speculate iff $p_i/q_i > R/B$ |
| `thm:depth` | Theorem | Speculation Depth Limit: $k^* < \ln(1+B_0/R_0)/\ln(1/p)$ |
| `thm:cache-eoq` | Theorem | Cache-Staleness EOQ Theorem: $T^* = \sqrt{2R/(\lambda\alpha \cdot E_{\text{stale}})}$ |
| `thm:mode` | Theorem | Bayesian Mode Selection (Fast vs. Governed threshold) |
| `def:pareto` | Definition | Pareto Frontier |
| `prop:shape` | Proposition | Mixed Frontier Shape (three regimes) |
| `thm:convex` | Theorem | Convexification via mixed strategies |
| `thm:tangency` | Theorem | VIH Tangency Condition: elasticity $\varepsilon_{Q,S} = -1$ |

### Key Formal Objects

- $\text{VIH} = \lambda_{\text{raw}} \cdot p_{\text{verify}}$: verified iterations per hour
- $\Phi(t) = e^{-\Lambda(t-t_0)}$: context fidelity (exponential decay)
- $\Lambda = \lambda\alpha$: effective decay rate; half-life $t_{1/2} = \ln 2 / \Lambda$
- Speculation ratio test: $p/q > R/B$
- $T^* = \sqrt{2R/(\lambda\alpha \cdot E_{\text{stale}})}$: optimal cache refresh (EOQ analog)
- Bayesian mode selection threshold: $P(\text{Governed}|\mathbf{x}) > c_{GF}/(c_{FG} + c_{GF})$
- Pareto frontier with VIH iso-hyperbola tangency
- Pipeline DAG $G = (V, E, \mathbf{D}, \mathbf{q})$

### Cross-references to Other Pillars

- Context freshness directly connects to Information Architecture's degradation function
- VIH relates to Coordination Architecture's Quality-Adjusted Speedup
- Speed-quality tradeoff parallels Reliability Architecture's compound error model
- References Amdahl's Law, also used in Coordination Architecture
- Governance loops in the temporal dimension connect to Governance Architecture's cascade control

### Key Citations

Graham (1966), Little (1961), Kingman (1961), Amdahl (1967), Pinedo (2016), Tomasulo (1967), Smith (1981), Belady (1966), Sleator-Tarjan (1985), Denning (1968), Shannon (1948), Suzgun et al. (2024 meta-prompting), DORA (2025), GitClear (2025), Cognition/Devin (2025), Anthropic (2026 agentic), Zhou et al. (2025 speculative), Bainbridge (1983), Spectre (2018), SWE-Effi (2025)

---

## 6. Quality Architecture

**Title:** Quality Architecture for AI Coding Agent Harnesses

**Bibliography file:** `quality-architecture-ai-slop`

### Section Structure

- Section 1: Introduction (`sec:intro`)
- Section 2: Preliminaries and Definitions (`sec:prelim`)
  - 2.1: Notation
  - 2.2: The Four Defense Layers
- Section 3: Formal Slop Taxonomy (`sec:taxonomy`)
  - 3.1: Defect Type as a Formal Object
  - 3.2: Partition of the 18 Types
  - 3.3: Latent Factor Structure
  - 3.4: Relationship to Classical Taxonomies
- Section 4: The Layered Defense Optimization Problem (`sec:optimization`)
  - 4.1: Problem Statement
- Section 5: Detection Ceiling Theorem (`sec:ceilings`)
- Section 6: Correlated Judge-Producer Error Model (`sec:correlation`)
  - 6.1: The Shared Blindspot Framework
  - 6.2: Diversity Gain
  - 6.3: Connection to Littlewood-Strigini
- Section 7: Optimal Layer Ordering (`sec:ordering`)
- Section 8: The Turing Enforcement Principle (`sec:turing`)
  - 8.1: Rice's Theorem Applied to Enforcement
- Section 9: Compound Degradation and the Accretion Category (`sec:degradation`)
  - 9.1: Codebase Entropy
  - 9.2: The Accretion Category
- Section 10: Defect Removal Efficiency Composition (`sec:dre`)
- Section 11: Empirical Calibration (`sec:calibration`)
  - 11.1: Detection Probability Matrix
  - 11.2: Cost Structure
  - 11.3: Layer Assignment by ROI
  - 11.4: Validation Against Deployments
- Section 12: Cost-of-Quality Model for AI Code (`sec:coq`)
  - 12.1: The Four Cost Categories
  - 12.2: Optimal Quality Level
  - 12.3: The Appraisal Compression Problem
- Section 13: Related Work (`sec:related`)
- Section 14: Design Principles (`sec:principles`)
- Section 15: Discussion and Limitations (`sec:discussion`)
- Section 16: Conclusion (`sec:conclusion`)

### Theorems, Definitions, and Formal Results

| Label | Type | Name/Content |
|-------|------|--------------|
| `def:sloptype` | Definition | Slop Type: tuple $(\sigma_j, \phi_j, \delta_j, C_j)$ |
| `def:decidability` | Definition | Detection Decidability Classes: D, SD, U |
| `prop:partition` | Proposition | Decidability Partition of 18 slop types (7 D, 7 SD, 4 U) |
| (unnumbered) | Definition | Context Blindness (F1), Completion Bias (F2), Training Distribution Leakage (F3) |
| `prop:orthogonal` | Proposition | Approximate Orthogonality of three factors (hypothesis) |
| (corollary) | Corollary | Intervention Independence |
| `thm:nphard` | Theorem | Hardness: Layered Defense Optimization is NP-hard (via Weighted Set Cover) |
| `cor:inapprox` | Corollary | No better than $\ln|J|$ approximation unless P=NP |
| `thm:greedy` | Theorem | Greedy Approximation: $(1-1/e)$-approximation via submodularity |
| `prop:decomp` | Proposition | Decomposition into per-type subproblems under per-invocation costs |
| `thm:ceiling` | Theorem | Detection Ceiling: $I(X;Z_\ell) \leq I(X;Y_\ell) \leq I(X;\mathcal{C})$ (Data Processing Inequality) |
| `thm:nofreelunch` | Theorem | No Free Lunch for Context-Poor Layers |
| `prop:correlated` | Proposition | Correlated Blind Spots: $\text{Cov}(E_P, E_J) > 0$ |
| `thm:fkg` | Theorem | Judge-Producer Correlation via FKG inequality |
| `cor:underestimate` | Corollary | Independence Underestimates Escape probability |
| (unnumbered) | Definition | Diversity Gain $\Delta_{\text{div}}$ |
| `thm:ordering` | Theorem | ROI Ordering: sort by decreasing $r_\ell/c_\ell$ |
| `prop:corrbreaks` | Proposition | Correlation Breaks ROI Ordering |
| (Rice 1953) | Theorem | Rice's Theorem |
| (unnumbered) | Definition | Enforcement Classes: Syntactic, Quasi-semantic, Semantic |
| `thm:gap` | Theorem | Enforcement Gap: syntactic properties enforceable with $P=1$; semantic properties strictly less |
| `def:entropy` | Definition | Codebase Entropy: $H(\mathcal{C}) = (1/n)\sum \log_2 |\mu(f_i)|$ |
| (unnumbered) | Definition | Accretion Rate $\alpha(t)$ |
| `thm:compound` | Theorem | Compound Degradation: superlinear entropy growth from individually CI-passing changes |
| (corollary) | Corollary | The Ratchet Effect (entropy monotonically non-decreasing) |
| `cor:refactoring` | Corollary | Refactoring Ratio Threshold: pre-AI $r \approx 0.24$, post-AI $r \approx 0.095$ |
| `def:accretion` | Definition | Accretion Defect: correct, superfluous, individually defensible, aggregately harmful |
| `prop:taxgap` | Proposition | Taxonomic Gap: no classical taxonomy covers accretion |
| `thm:drecascade` | Theorem | DRE Cascade under Independence |
| `thm:copula` | Theorem | DRE under Gaussian Copula Correlation |
| `cor:diversity` | Corollary | Diversity Premium: weak independent > strong correlated |
| `prop:jones` | Proposition | Capers Jones' 95% Law: requires 3+ diverse techniques |
| `thm:optquality` | Theorem | Optimal Quality Level: closed-form $q^*$ |

### Key Formal Objects

- 18 slop types in 3 decidability classes (D, SD, U)
- 3 generative factors: Context Blindness, Completion Bias, Training Distribution Leakage
- 4 defense layers (structural gates, deterministic analysis, LLM-as-Judge, human review)
- $P_{\text{esc}}(j, \Lambda_j)$: escape probability under layer assignment
- Detection ceiling via Data Processing Inequality
- FKG inequality for judge-producer correlation
- Codebase entropy $H(\mathcal{C})$, accretion rate $\alpha(t)$
- Accretion defect category (novel)
- DRE composition under Gaussian copula
- Optimal quality level $q^* = (1/\beta)\ln(c_F \lambda_0 \beta / (c_P + c_A))$
- Cost of Quality: $\text{CoQ} = C_P + C_A + C_{IF} + C_{EF}$

### Cross-references to Other Pillars

- Four defense layers parallel Reliability Architecture's four verification layers
- Structural vs. prompt enforcement shared with Reliability Architecture and Information Architecture
- Codebase entropy connects to Governance Architecture's architectural drift
- FKG inequality for correlated errors relates to Reliability Architecture's circular validation bias
- Accretion and refactoring ratio connect to Governance Architecture's GitClear findings

### Key Citations

Rice (1953), Cover and Thomas (2006), Nemhauser et al. (1978), FKG (1971), Littlewood-Strigini (1993, 2000), Capers Jones (2012), CodeRabbit (2025), GitClear (2025), Spotify Honk (2025), METR (2025), Apollo Research (2025), AgentSpec/Wang et al. (2026), Veracode (2025), NIST CAISI (2026), IEEE 1044, Chillarege (1992 ODC), Beizer (1990), Lehman (1980), Cousot-Cousot (1977), GitHub RCT (2024), Sonar (2026), Dinur-Steurer (2014), Smith (1956)

---

## 7. Governance Architecture

**Title:** Governance Architecture for AI Coding Agent Harnesses

**Bibliography file:** `governance-architecture`

### Section Structure

- Section 1: Introduction (`sec:intro`)
- Section 2: Preliminaries and Definitions (`sec:prelim`)
  - 2.1: Program Theory (Naur)
  - 2.2: Tacit Knowledge Taxonomy
  - 2.3: Architectural State and Drift
  - 2.4: Reflexion Models
- Section 3: Information-Theoretic Foundations (`sec:info-theory`)
  - 3.1: Theory Loss as a Rate-Distortion Problem
  - 3.2: Incompressibility of Tacit Components
  - 3.3: Extraction Fidelity and the Double Bottleneck
- Section 4: Governance Channel Capacity (`sec:capacity`)
- Section 5: Multi-Granularity Governance (`sec:control`)
  - 5.1: Three Governance Loops
  - 5.2: Stability
  - 5.3: Nyquist-Like Sampling Requirements
  - 5.4: Governance Stability Conditions
- Section 6: The Ratchet (`sec:ratchet`)
  - 6.1: Lattice of Architectural Constraints
  - 6.2: Ossification
  - 6.3: Controlled Relaxation
- Section 7: Decision Survival Analysis (`sec:survival`)
  - 7.1: Survival Function
  - 7.2: Competing Risks
  - 7.3: Empirical Calibration
- Section 8: The Theory Preservation Problem (`sec:theory`)
  - 8.1: Collins's Taxonomy Applied to Governance
  - 8.2: The False Confidence Problem
- Section 9: Related Work (`sec:related`)
- Section 10: Empirical Calibration and Gaps (`sec:gaps`)
- Section 11: Engaging Contrarian Positions (`sec:contrarian`)
  - 11.1: "Governance Is Overhead"
  - 11.2: "ADRs Are Documentation Theater"
  - 11.3: "Naur Is Right and the Problem Is Unsolvable"
  - 11.4: "Conway's Law Makes Governance Futile"
  - 11.5: "The Ratchet Is Too Rigid"
- Section 12: Design Principles (`sec:principles`)
- Section 13: Conclusion (`sec:conclusion`)
- Appendix A: Governance Information Budget (`app:budget`)
- Appendix B: Notation Summary (`app:notation`)
- Appendix C: Empirical Data Sources (`app:data`)

### Theorems, Definitions, and Formal Results

| Label | Type | Name/Content |
|-------|------|--------------|
| `def:theory` | Definition | Program Theory $T$: random variable over $(\mathcal{T}, \Sigma_{\mathcal{T}})$ |
| `def:drift` | Definition | Architectural Drift: $\Delta(t) = D_{\text{KL}}(P \| Q_t)$ |
| (unnumbered) | Definition | Extraction Channel: $p(\hat{T} \mid T)$ |
| `thm:extraction` | Theorem | Theory Extraction Bound: rate-distortion function $R(D)$ |
| `conj:tacit` | Conjecture | Tacit Divergence: $\lim_{D \to 0} R_{\text{tacit}}(D) = \infty$ |
| `thm:incompress` | Theorem | Incompressibility: $K(t_\tau) \geq |t_\tau| - O(1)$ for Kolmogorov-random components |
| `cor:governance` | Corollary | Governance Implication: artifact inspection alone cannot detect tacit knowledge loss |
| `thm:bottleneck` | Theorem | Double Bottleneck: $I(T;G) \leq I(T;(D,A,R)) \leq I(T;L)$ |
| (unnumbered) | Definition | Governance Channel: $(X, p(Y|X), Y)$ |
| (unnumbered) | Definition | Governance Channel Capacity: $C_{\text{gov}} = \max_{p(X)} I(X;Y)$ |
| `thm:capacity` | Theorem | Governance Capacity Bound: if $R_{\text{drift}} > C_{\text{gov}}$, no scheme prevents unbounded divergence |
| `prop:decomp` | Proposition | Capacity Decomposition: $C_{\text{gov}} \leq \sum C_\ell$ |
| `cor:velocity` | Corollary | AI Velocity Problem: increasing $\lambda$ eventually overwhelms fixed $C_{\text{gov}}$ |
| (corollary) | Corollary | Automated Governance Necessity |
| `thm:cascade` | Theorem | Cascade Governance Stability: three conditions for stable three-loop system |
| (Nyquist) | Requirement | $f_k \geq 2\omega_d^{(k)}$ for each governance loop |
| `thm:critical` | Theorem | Critical Governance Capacity: $G(t) \geq (\gamma/\mu) \cdot R(t)$ |
| `thm:bifurcation` | Theorem | Governance Bifurcation: transcritical bifurcation at $\mu G / \gamma R = 1$ |
| `def:ratchet` | Definition | Governance Ratchet: closure operator (extensive, monotone, idempotent) |
| `thm:ratchet` | Theorem | Ratchet Convergence: converges in at most $|\mathcal{R}|$ steps |
| (unnumbered) | Definition | Governance Ossification |
| `thm:ossification` | Theorem | Ossification Risk: contradictory rules produce empty allowed set |
| (unnamed) | Theorem | Controlled Descent (relaxation + ratchet = consistent, evidence-backed states) |
| (survival) | Function | Weibull hazard $h(t) = (k/\lambda)(t/\lambda)^{k-1}$, competing risks $h_k(t)$ |
| (appendix) | Theorem | Governance Information Budget: four simultaneous constraints |

### Key Formal Objects

- $T$: program theory (Naur), random variable
- $\Delta(t) = D_{\text{KL}}(P \| Q_t)$: architectural drift
- $R(D)$: rate-distortion function for theory extraction
- $C_{\text{gov}} = \max_{p(X)} I(X;Y)$: governance channel capacity
- $R_{\text{drift}}$: drift rate (bits per unit time)
- Three governance loops: inner (per-generation), middle (per-phase), outer (per-milestone)
- $G_{\text{inner}}(z) = C_1 P_1 / (1 + C_1 P_1)$: cascade control transfer function
- Coherence dynamics: $dC/dt = \mu G(1-C)^\beta - \gamma R(1-C)$
- Governance ratchet $\rho$: closure operator on lattice $(2^{\mathcal{R}}, \subseteq)$
- Relaxation operator $\delta$, combined operator $\Gamma(S) = \rho(S \setminus \delta(S))$
- Weibull survival $S(t) = e^{-\lambda(t-t_0)}$, competing risks $h_k(t)$
- Domain-specific decision half-lives (frontend: 1-4 mo.; DB schema: 12-36 mo.)

### Cross-references to Other Pillars

- Naur's "theory building" connects to Abstraction Architecture's "Preserve the Theory" principle
- Governance capacity bound is the macro-level analog of Reliability Architecture's compound error model
- Ratchet convergence relates to Quality Architecture's compound degradation and entropy
- Three governance loops map onto Temporal Architecture's pipeline scheduling
- Conway's Law treatment shared with Coordination Architecture
- GitClear data on refactoring decline shared with Quality Architecture
- KL divergence drift metric connects to Information Architecture's information-theoretic framework

### Key Citations

Naur (1985), Polanyi (1966), Collins (2010), Tsoukas (2003), Shannon (1948, 1959), Cover and Thomas (2006), Chaitin (1974), Murphy et al. (1995, 2001), Ryle (1949), Seborg et al. (2004), Hellerstein et al. (2004), Kazman et al. (2000 ATAM), Conway (1968), Nagappan et al. (2008), MacCormack et al. (2008), Skelton and Pais (2019 Team Topologies), Tarski (1955), Ford et al. (2017 fitness functions), Nygard (2011 ADRs), Harmel-Law (2023 Advice Process), GitClear (2025), DORA (2025), Le et al. (2018), Herraiz et al. (2021), Goodhart (1975), Dreyfus (1986), Fine-Gray (1999), Cox (1972)

---

## Cross-Pillar Summary

### Shared Formal Machinery

| Technique | Pillars Using It |
|-----------|-----------------|
| Shannon information theory ($H$, $I$, DPI) | Information, Quality, Governance, Abstraction |
| Kolmogorov complexity ($K$) | Abstraction, Governance |
| Series reliability / compound errors ($p^n$) | Reliability, Coordination |
| Structural vs. prompt enforcement | Reliability, Information, Quality, Coordination |
| Submodularity and greedy approximation | Information, Quality |
| Control theory (cascade, stability) | Governance |
| Lattice theory | Abstraction (refinement), Governance (ratchet) |
| Concurrency control / isolation levels | Coordination |
| Survival analysis | Governance |
| Scheduling theory (Amdahl, stochastic DAG) | Temporal, Coordination |
| FKG / correlation inequalities | Quality, Reliability (circular bias) |
| Graph partitioning (min-cut, Cheeger) | Coordination |
| Rate-distortion theory | Governance |
| Queueing theory | Temporal |
| Speculative execution theory | Temporal |
| Cache competitive analysis | Temporal |

### Shared Empirical Sources

| Source | Pillars Citing It |
|--------|------------------|
| Kim et al. (2025) multi-agent scaling | Abstraction, Coordination |
| DORA 2025 report | Coordination, Temporal, Governance, Quality |
| GitClear (2025) 211M lines | Quality, Governance, Temporal |
| METR (2026) SWE-bench merge gap | Reliability, Quality, Abstraction |
| AgentSpec / Wang et al. (2026) | Reliability, Quality |
| Apollo Research (2025) scheming | Reliability, Quality |
| NIST CAISI (2025/2026) cheating | Reliability, Quality |
| Spotify Honk (2025) | Information, Quality |
| Cognition/Devin (2025) | Reliability, Temporal |
| Chroma (2025) context rot | Information, Temporal |
| JetBrains (2025) complexity | Information |
| CodeRabbit (2025) | Quality |
| Veracode (2025) | Quality |
| Gloaguen et al. (2026) AGENTS.md | Information |

### Key Cross-Pillar Connections

1. **Abstraction Gap chain:** Abstraction defines $\mathcal{G}(S,P) = K(P|S)$; Information operationalizes it as $H(P|S) = H(P|S,C,\theta) + I(P;C|S,\theta) + I(P;\theta|S)$; Quality addresses what happens when the gap is traversed poorly (slop).

2. **Compound error cascade:** Reliability proves $R(n) = p^n$ for pipelines; Coordination extends this to multi-agent systems with $A_e$ amplification; Temporal frames the tradeoff as VIH = speed x quality.

3. **Structural enforcement principle:** Appears in Reliability (enforcement threshold $L^*$), Information (compliance decay $(1-\epsilon)^T$), Quality (Turing enforcement principle), and Coordination (file ownership contracts).

4. **Governance capacity as the macro constraint:** Governance proves the capacity bound ($R_{\text{drift}} > C_{\text{gov}}$ implies unbounded divergence); this is the system-level analog of Reliability's compound error sensitivity and Quality's compound degradation.

5. **Four-layer verification/defense:** Reliability's four verification layers (structural, deterministic, LLM-judge, human) and Quality's four defense layers are essentially the same architecture, approached from different angles (reliability vs. quality).

6. **Information as the unifying currency:** All seven pillars ultimately reason about information flow: from spec to code (Abstraction), through context (Information), across pipeline steps (Reliability), between agents (Coordination), over time (Temporal), against defect patterns (Quality), and through governance channels (Governance).
