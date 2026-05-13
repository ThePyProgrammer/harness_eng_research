# Completeness Audit: science.tex vs. 7 Sub-Papers

**Date:** 2026-04-03
**Auditor:** Automated comparison of substantive content (theorems, definitions, proof sketches, empirical calibrations, design principles, contrarian analyses, tables, key examples)

**Summary:** science.tex is a strong synthesis that captures the core formal results from all seven sub-papers. However, each sub-paper contains unique material (extended proofs, additional definitions, deeper empirical calibrations, contrarian analyses, related work discussions, appendix content, and design principles beyond the 11 unified ones) that does not appear in the synthesis. The sub-papers should be considered **companion documents with unique material**, not redundant copies.

---

## 1. Abstraction Architecture

| Content Item | In science.tex? | Missing / Notes |
|---|---|---|
| Abstraction Gap definition (K(P\|S)) | Yes | Fully present |
| Gap Properties theorem (minimality, maximality, monotonicity, additivity) | Yes | Present with proof sketches |
| NID universality theorem | Yes | Present |
| Spec-Code Convergence theorem | Yes | Present with proof sketch |
| Shannon Channel Model | Yes | Present |
| Refinement Lattice (complete lattice theorem) | Yes | Present |
| Galois Connection tower | Yes | Present |
| Curry-Howard-Lambek correspondence table | Yes | Present |
| Specificity-Compression coordinates (sigma, kappa) | Yes | Present |
| Uncanny Valley of Specification | Yes | Present |
| Authentication module example (A4 to C tower) | Yes | Present |
| seL4 example (proof vs. code lines) | Yes | Present (briefly) |
| Agent definition (tuple with policy, tools, actions) | No | Sub-paper defines Agent, SAS, and MAS formally as tuples; science.tex omits these |
| Coordination Metrics (E_c, O, A_e, R definitions from Kim) | No | Sub-paper defines coordination efficiency, overhead, error amplification, redundancy rate formally; science.tex uses them but does not define them in the Abstraction section |
| Multi-Agent Gap Modulation (topology effects on gap) | Partial | science.tex covers this in the Coordination pillar instead; the Abstraction paper's qualitative treatment of how topology modulates the gap is not duplicated |
| Specificity-Compression space: 16 thinkers table | Partial | science.tex includes 5 thinkers (Dijkstra, Hoare, Lamport, Knuth, Brooks); sub-paper includes 16 (adding Martin-Lof, Brady, Meyer, Harel, Parnas, Jackson, Chollet, Kay, Wittgenstein, Suchman, Karpathy) |
| Extended thinker quotes and justifications (Appendix) | No | Detailed justifications for each thinker's placement with primary source quotes |
| Cognitive Factors section (Iverson, Green & Petre cognitive dimensions) | No | Discussion of notation shaping thought and cognitive dimensions of formalisms |
| Contrarian Analysis section (Bitter Lesson, Distributed Cognition, Situated Action, Language Games, Democratisation) | Partial | science.tex mentions the sorted list example and pricing algorithm example but omits the extended contrarian positions from the Abstraction paper (Bitter Lesson, Hutchins' distributed cognition, Suchman's situated action, Wittgenstein's language games, democratisation argument) |
| Empirical Calibration tables (benchmarks: HumanEval, SWE-bench, LiveCodeBench, Dafny) | No | Benchmark pass rate table showing gap at different sigma levels |
| Code Quality Degradation section (17% maintainability drops) | No | Specific GitClear findings framed through abstraction lens |
| Vericoding Pattern (82% success on Dafny specs) | Partial | Mentioned briefly in science.tex but the dedicated analysis of vericoding as the most promising near-term architecture is absent |
| Spec-to-Code Ratios table (Appendix) | No | Real-world project data: Gonzalez YAML, seL4, CompCert, AWS TLA+, enterprise |
| Function Point Backfiring Ratios table (Appendix) | No | LOC/FP ratios from machine code to natural language, deriving sigma values |
| Seven Answers to Gonzalez's Question table (Appendix) | No | How each intellectual tradition answers "Is a sufficiently detailed spec code?" |
| Verification Roadmap (Appendix) | No | Proof assistant targets (Coq, Lean 4, Agda) for mechanizing the theorems |
| Extended Curry-Howard-Lambek table (full 12-row correspondence) | No | science.tex has 6 rows; sub-paper has 12 (adding conjunction, disjunction, true, false, hypothetical, identity, modus ponens) |
| Full proofs of gap properties and convergence | No | Sub-paper appendix has complete formal proofs; science.tex has sketches |
| Agent Decomposition (interpretation gap + generation gap) | Partial | In science.tex's appendix theorem index but not expanded in the main text |
| Design Principles (6 principles) | Partial | Sub-paper has 6 principles including "Use AI as a Formalism Translator" and "Select Coordination Topology by Task Structure"; science.tex merges these into unified principles but omits the formalism-translator principle |
| Testable Prediction (crossover point: sigmoidal decline in pass rates with NCD) | No | Concrete falsifiable prediction about NL specification vs. task complexity |
| Related Work section | No | Detailed positioning against refinement calculus, abstract interpretation, AIT in software, multi-agent coding, formal methods + AI |

---

## 2. Information Architecture

| Content Item | In science.tex? | Missing / Notes |
|---|---|---|
| Context Selection Problem (formal definition) | Yes | Present |
| Context Relevance Function definition | Yes | Present |
| Context Degradation Function definition | Yes | Present |
| Submodularity theorem and proof | Yes | Present |
| Sufficient conditions for submodularity | Yes | Present |
| Code dependencies break submodularity | Yes | Present |
| Non-monotonicity of product objective (theorem + proof) | Partial | science.tex mentions non-monotonicity; sub-paper has the full formal theorem and proof |
| Abstraction Gap Decomposition | Yes | Present |
| Bimodal Gap observation | Yes | Present |
| Context Budget Theorem | Yes | Present |
| Context Curation Theorem | Yes | Present |
| Structural vs. Instructional Enforcement | Yes | Present |
| Fresh Context Dominance | Yes | Present |
| U-shaped Positional Recall Function | Yes | Present |
| Reuse Discovery Problem | Yes | Present |
| Functional Similarity definition | Yes | Present |
| Reuse Map as Compression | Yes | Present |
| Three-Tier Information Architecture | Yes | Present |
| Degradation function fit table (power law vs. exponential vs. sigmoid) | No | Table comparing three candidate functional forms against Llama-3.1-70B data |
| Position Dominance Inequality (formal proposition with eta parameter) | Partial | science.tex mentions position dominance but the formal inequality with relevance sensitivity eta is absent |
| Superlinear Distractor Interference | No | Explanation of why shuffled haystacks outperform coherent ones (quadratic reinforcement term) |
| Why Shannon Not Kolmogorov (methodological discussion) | No | Detailed 4-reason justification for Shannon over Kolmogorov |
| Entropy of Specifications and Code (Shannon, Hindle, Hellendoorn measurements) | Partial | science.tex mentions Hindle; sub-paper includes Shannon (0.6-1.3 bits/char) and Hellendoorn (1.25 bits/token) |
| Cognitive Load Theory Connection (Sweller framework mapped to transformers) | No | Mapping intrinsic/extraneous/germane load to transformer attention; Guo et al. adversarial cognitive load attack |
| Why Naive RAG Fails for Code | No | ByteRover 94.7% irrelevance finding; Factory structural explanation; Polpichai GraphRAG results |
| Greedy Tier 1 Assignment proposition | No | Formal statement of greedy-by-density for active tier |
| Value of Information literature connection | No | Context selection as value of information problem |
| Information Bottleneck connection | No | Context window as information bottleneck (Tishby) |
| Code embedding benchmarks table (CodeBERT, GraphCodeBERT, UniXcoder, CodeT5+) | No | MAP@R scores on POJ-104 |
| The Missing Decision Gate (4-step reuse enforcement protocol) | Partial | science.tex mentions the unsolved problem; sub-paper proposes a concrete 4-step protocol |
| Production Harness Convergence Patterns table | No | Table mapping 5 convergent patterns to harnesses and formal justifications |
| Diminishing Returns of Expansion corollary | Partial | science.tex has the inequality; sub-paper has it as a formally stated corollary |
| Design Principles (6 principles) | Partial | Sub-paper includes "Navigate structure, do not search semantics" and "Place high-value items at boundaries"; these are absent from science.tex's unified principles |
| Jina et al. independent submodular optimization reference | No | Context that another group independently proposed submodular optimization for context engineering |

---

## 3. Reliability Architecture

| Content Item | In science.tex? | Missing / Notes |
|---|---|---|
| Series Reliability theorem | Yes | Present |
| Compound Error Sensitivity theorem | Yes | Present |
| Weakest-Link Priority corollary | Yes | Present |
| Common-Cause Failure Model (Marshall-Olkin) | Yes | Present |
| Optimal Checkpoint Count theorem | Yes | Present |
| Geometric Diminishing Returns theorem | Yes | Present with calibration table |
| Circular Validation Bias definition and theorem | Yes | Present |
| Structural Separation Theorem | Yes | Present |
| Four-Layer Verification Architecture table | Yes | Present |
| Cost-of-Failure Threshold theorem | Yes | Present |
| Adversarial Collapse of Prompt Enforcement | Yes | Present |
| Young-Daly Connection table | Yes | Present |
| Agent Pipeline formal definition (tuple) | No | Formal definition of pipeline as series reliability system with structure function |
| Error Propagation Probability (q_i definition) | No | Probability of producing correct output despite incorrect input |
| Verification Layer formal definition (d, f, c, tau, eta) | No | Formal definition as a 5-tuple |
| Verification Scheduling Problem (formal DP formulation) | Partial | science.tex has the result; sub-paper has the formal DP problem statement |
| Equal-Spacing Optimality theorem (full proof) | Partial | science.tex has the formula; sub-paper has the full Schur-convexity proof |
| Empirical Calibration table (Rajan, METR, Devin, RE-Bench back-solved p values) | Partial | science.tex has the heterogeneous example; sub-paper has the full calibration table |
| Multi-Agent Verification Economics | No | Break-even analysis for two-agent structural separation (~3.2x generation cost; 6.3x with fragmentation penalty) |
| Markov Error Propagation Model (Appendix) | No | Detailed Markov chain model with transition matrix, spectral decomposition, and recovery probability |
| LLM-Verifier Convergence Theorem (Appendix; Chen et al. absorbing Markov chain) | No | Almost-sure convergence, expected iteration bound, exponential tail bound |
| Information-Theoretic Verification Bounds (Appendix; Fano's inequality, DPI) | Partial | science.tex references DPI in Quality pillar; sub-paper has a dedicated treatment with Fano's inequality |
| Beta-Binomial Calibration (Appendix) | No | Heterogeneous per-step success rates via Beta prior; calibrated parameters for 4 benchmarks |
| Goodhart's Law Taxonomy (Appendix; Manheim's 4 mechanisms) | Partial | science.tex mentions Goodhart briefly; sub-paper applies all four mechanisms to agent gaming |
| Adaptive Verification switching thresholds table | Partial | science.tex has the formula; sub-paper has the concrete threshold table with delta-c and delta-d |
| Cascaded Detection Rate theorem | Yes | Present |
| Design Principles (8 principles) | Partial | Sub-paper includes "The verifier must be structurally read-only" (P7) and "Three verification rounds, then stop" (P4), which are more specific than science.tex's unified principles |
| Greedy Efficiency Ordering theorem (fractional knapsack proof) | Partial | science.tex states it; sub-paper has the explicit proof via fractional knapsack |

---

## 4. Coordination Architecture

| Content Item | In science.tex? | Missing / Notes |
|---|---|---|
| Error Amplification Factor definition | Yes | Present |
| Error Amplification under Independence (theorem + expansion) | Partial | science.tex has the definition; sub-paper has the full binomial expansion and deficit analysis |
| Information-Sharing Reduction Factor | Yes | Present |
| Capability Saturation Crossover conjecture | Yes | Present |
| Extended Amdahl's Law with Reliability | Yes | Present |
| Universal Scalability Law Extension | Yes | Present |
| Task Decomposition as Balanced Min-Cut | Yes | Present |
| Cut-Conflict Bridge lemma | Yes | Present |
| Five-Level Merge Conflict Taxonomy | Yes | Present |
| Database Concurrency Control Analogy (isolation levels table) | Yes | Present |
| Write Skew as critical anomaly | Yes | Present |
| Assume-Guarantee Contracts | Yes | Present |
| Contract Composition theorem | Yes | Present |
| Conway's Law (graph-theoretic form) | Yes | Present |
| Inverse Conway for Agents | Yes | Present |
| Quality-Adjusted Speedup definition | Yes | Present |
| QAS < 1 demonstration | Yes | Present |
| Coupling Graph formal definition | Yes | Present |
| Coordination Contract formal definition | No | Full tuple definition with owned file sets, interface specifications, and export mapping |
| Topology Space definition | No | Formal enumeration of 4 topology types |
| Epistemic status markers ([Established], [Synthesis], [Conjecture]) | No | Sub-paper marks each result's epistemic status explicitly; science.tex does not |
| NP-Hardness of balanced partition | Partial | science.tex mentions NP-hardness; sub-paper has the reduction from 3-partition |
| Cheeger Inequality (discrete) | Partial | Mentioned in science.tex's appendix theorem index; sub-paper has the full statement and higher-order extensions |
| Practical algorithms survey (KL, FM, METIS) | No | Detailed description of Kernighan-Lin, Fiduccia-Mattheyses, METIS algorithms with runtime bounds |
| Hypergraph Model for Software | No | Why hypergraph model is more appropriate than standard graph for shared interfaces |
| Probabilistic Graphical Model for conflicts | No | Full PGM with per-level conflict probability formulas |
| Quadratic Scaling lemma | Partial | science.tex mentions O(k^2); sub-paper has the formal lemma with proof |
| Strong vs. Weak Correctness definitions | No | Serializable vs. compile+test correctness |
| Correctness Hierarchy theorem | No | Strong implies weak, but not conversely (with counterexample) |
| Achievability under Snapshot + Contracts theorem | No | Quantitative probability bound with calibration |
| Per-Topology success/time/cost expressions | No | Closed-form expressions for P(success), T(t), and C(t) for each topology |
| Topology Dominance conditions proposition | No | Formal conditions under which each topology dominates |
| Throughput Crossover Analysis | No | Formal crossover condition G(k) > 1 + M(k) with sensitivity analysis |
| QAS calibration against DORA and Kim data | Partial | science.tex has the DORA paragraph; sub-paper has full worked examples for independent and centralized architectures |
| Coupling Density Dynamics (stochastic process model) | No | Coupling growth model with alpha, beta, noise; partition half-life definition |
| Error amplification parameters table (with 95% CIs) | No | Full table with A_e values, CIs, and conditions for 4 topologies |
| Merge conflict rate parameters table | No | Textual conflict rates (17-20%), build conflict rates (1-10%), trivial resolution rate (75%) |
| Throughput and productivity parameters table | No | Parallel throughput mult, practitioner-reported, PR/review/size/bug changes |
| Design Principles (6 principles) | Partial | Sub-paper includes "Check before scaling" (P1) and specific numerical guidance (P^* ~ 0.45) not in science.tex |

---

## 5. Temporal Architecture

| Content Item | In science.tex? | Missing / Notes |
|---|---|---|
| Context Fidelity definition and Exponential Staleness Decay | Yes | Present |
| VIH definition and decomposition | Yes | Present |
| VIH Optimality (unit-elasticity condition) | Yes | Present |
| Amdahl's Law Bound on VIH | Yes | Present |
| Speculation Ratio Test | Yes | Present |
| Speculation Depth Limit | Yes | Present |
| Cache-Staleness EOQ Theorem | Yes | Present |
| Competitive analysis (2-competitive, 1.58-competitive) | Yes | Present |
| Three Caching Layers | Yes | Present |
| Bayesian Mode Selection | Yes | Present |
| Bainbridge's Ironies | Yes | Present |
| Speed-Quality Pareto Frontier (3-regime structure) | Yes | Present |
| Convexification by Mixing theorem | Yes | Present |
| VIH Tangency Condition | Yes | Present |
| Spectre Analogy | Yes | Present |
| Agent Pipeline as Stochastic DAG (formal definition with Pinedo classification) | No | Pipeline as stochastic DAG G = (V, E, D, q); Pinedo classification Rm|prec,stoch|E[C_max] |
| GSD pipeline stage parameters table (mu, sigma, q, distribution) | No | Estimated per-stage parameters for context loading, research, planning, execution, verification, review |
| Classical results section (Graham's bound, Little's Law, Kingman's approximation) | No | Formal statements of classical scheduling/queueing results applied to agent pipelines |
| Sequential Makespan theorem | No | E[M_seq] = sum of mu_i; calibrated at 56.5 minutes |
| Expected Makespan with Geometric Retries | No | E[M_fail] = sum of mu_i/p_i; calibrated at 61.5 minutes |
| Speculation Policy formal definition | No | Binary decision function pi: V -> {0,1} |
| Speed-Quality Tradeoff proposition (with empirical support) | Partial | science.tex mentions; sub-paper has the formal proposition with DORA/GitClear/Yerkes-Dodson evidence |
| Pipeline Speedup Analysis table (4 strategies with time saved, quality impact, VIH impact) | No | Persistent state (-17.1%), speculative pipelining (+19%), tiered verification (+7.6%), async governance (+17%) |
| Token Economics analysis | No | Input-to-output ratio 100:1, cache economics, "token snowball" effect, cost per verified iteration |
| Diminishing Returns in Multi-Agent Iteration | No | +14.9, +13.5, +11.2 pp per additional agent; k* ~ 4 |
| Cache-Quality Tension (hypothesis) | Partial | science.tex mentions; sub-paper develops it as a formal conjecture with break-even analysis |
| Contrarian positions (7 positions) | No | "Speed kills quality" (with Yerkes-Dodson), "VIH is the wrong metric" (Reinertsen), "Caching is a false economy", "Mode selection is hard to automate", etc. |
| Multi-Exponential Context Decay (Appendix) | Partial | science.tex mentions the extension in a remark; sub-paper has the full formula |
| VIH with Rework Cycles (Appendix) | No | VIH_eff formula with rework penalty |
| Sequential Mode Escalation via SPRT (Appendix) | No | Wald's Sequential Probability Ratio Test for adaptive mode selection |
| Verification Roadmap (5 experiments; Appendix) | No | 5 concrete experiments to validate VIH, speculation threshold, cache refresh, mode misclassification, context fidelity |
| Design Principles (6 principles) | Partial | Sub-paper includes "Treat the 12.3% threshold as a gate for persistent state" (P6); this specific threshold is absent from science.tex |

---

## 6. Quality Architecture

| Content Item | In science.tex? | Missing / Notes |
|---|---|---|
| Slop Type formal definition (tuple) | Yes | Present |
| 18 types in 3 decidability classes table | Yes | Present |
| Decidability class definitions (D, SD, U) | Yes | Present |
| Three Generative Factors (F1, F2, F3) | Yes | Present |
| Layered Defense Optimization (NP-hardness) | Yes | Present |
| Greedy Approximation (1-1/e) | Yes | Present |
| Detection Ceiling theorem (DPI) | Yes | Present |
| FKG Correlated Judge-Producer Errors | Yes | Present |
| Diversity Gain definition | Yes | Present |
| Connection to Littlewood-Strigini | Yes | Present |
| ROI Ordering theorem | Yes | Present |
| Turing Enforcement Principle (Rice's theorem) | Yes | Present |
| Enforcement Gap theorem | Yes | Present |
| Codebase Entropy definition | Yes | Present |
| Accretion Rate definition | Yes | Present |
| Compound Degradation theorem | Yes | Present |
| Accretion Defect definition | Yes | Present |
| Refactoring Ratio Threshold corollary | Yes | Present |
| DRE Cascade (independence + Gaussian copula) | Yes | Present |
| Cost-of-Quality Model (CoQ) | Yes | Present |
| Optimal Quality Level theorem | Yes | Present |
| Appraisal Compression Problem | Yes | Present |
| Detection Probability Matrix table (selected types x 4 layers) | No | Full table with detection ranges and confidence levels (H/M/L/E) |
| Cost per PR by defense layer table | No | Time, cost/PR, and FP rate for each layer |
| Layer Assignment by ROI (detailed prescriptions) | No | Which types justify which layers, with specific ROI numbers; "never cost-effective at L4" for dead code and redundant comments |
| Sensitivity analysis of detection estimates | No | Perturbation analysis: what happens when E/L estimates shift +/- 50% |
| Validation Against Deployments (6 calibration points) | Partial | science.tex has some; sub-paper has all 6 (Spotify Honk, METR, AgentSpec, Veracode, CodeRabbit, Apollo Research) with specific calibration numbers |
| No Free Lunch for Context-Poor Layers theorem | Partial | science.tex mentions detection ceiling; sub-paper has the dedicated theorem with the concrete scope expansion example |
| Correlation Breaks ROI Ordering proposition | Partial | science.tex mentions it; sub-paper has a full worked counterexample |
| Detection decidability proof sketch (per-type computable functions) | Partial | science.tex summarizes; sub-paper lists the specific detection algorithm for each decidable type |
| Approximate Orthogonality hypothesis (with ISSRE dataset reference) | Partial | science.tex mentions approximate orthogonality; sub-paper frames it as a testable hypothesis with a specific dataset |
| Relationship to Classical Taxonomies (IEEE 1044, ODC, Beizer, CWE) | Partial | science.tex mentions the taxonomic gap; sub-paper has detailed comparison showing which types map poorly to which taxonomy |
| Tragedy of the Commons analogy (Pigouvian taxation, Coasian property rights) | No | Formal economic interpretation of the quality stack |
| Capers Jones' 95% Law Explained proposition | Partial | science.tex cites Capers Jones; sub-paper proves why 3 diverse techniques are needed via the copula model |
| False positive cost trap analysis | No | At 100 PRs/week with 25% FP rate, ~1.3 FTEs spent investigating false findings |
| Correlation Adjustment Factors (Appendix; beta factors) | No | Estimated pairwise correlation factors between layers |
| Contrarian positions ("Slop is acceptable", "Prompt-based rules work well enough", "LLM-as-Judge is unreliable", "The 18 types are not the right taxonomy") | Partial | science.tex addresses some in the Empirical section; sub-paper has dedicated contrarian engagement |
| Design Principles (10 principles) | Partial | Sub-paper includes "Opacity to the agent" (P4: quality gates must be invisible, 43x visibility amplification), "Accept what you cannot detect" (P6), "Maintain the refactoring ratio" (P8); these are absent or only partially present in science.tex |

---

## 7. Governance Architecture

| Content Item | In science.tex? | Missing / Notes |
|---|---|---|
| Theory Loss as Rate-Distortion | Yes | Present |
| Theory Extraction Bound | Yes | Present |
| Tacit Divergence Conjecture | Yes | Present |
| Collins's Tacit Knowledge Taxonomy table | Yes | Present |
| False Confidence Problem | Yes | Present |
| Double Bottleneck Theorem (DPI applied twice) | Yes | Present |
| Governance Capacity Bound | Yes | Present |
| Multi-Granularity Governance (3 loops as cascade control) | Yes | Present |
| Cascade Governance Stability theorem | Yes | Present |
| Nyquist Sampling Requirements | Yes | Present |
| Governance Bifurcation theorem | Yes | Present |
| Ratchet as closure operator | Yes | Present |
| Ratchet Convergence theorem | Yes | Present |
| Ossification Risk theorem | Yes | Present |
| Controlled Relaxation with Evidence Expiry | Yes | Present |
| Decision Survival Analysis (competing risks, Weibull) | Yes | Present |
| Theory Preservation Problem | Yes | Present |
| Architectural Drift definition (KL divergence) | Partial | Sub-paper defines drift as KL divergence between P and Q_t; science.tex does not use this specific formalization |
| Reflexion Models (Murphy et al.) | No | Formal definition of convergence, divergence, absence in reflexion models |
| Incompressibility theorem (Kolmogorov-random tacit components) | Partial | Mentioned in science.tex's appendix theorem index; not developed in main text |
| Governance Implication corollary (artifact inspection insufficient) | No | Formal statement that no artifact-based governance detects loss of incompressible tacit knowledge |
| Governance Channel formal definition (DMC model) | No | Explicit definition as discrete memoryless channel with (X, p(Y|X), Y) |
| Capacity Decomposition proposition | Partial | science.tex mentions layered capacity; sub-paper has the formal proposition |
| AI Velocity Corollary | Partial | science.tex states governance must scale; sub-paper has the formal corollary |
| Automated Governance Necessity corollary | Partial | Implicit in science.tex; explicit formal corollary in sub-paper |
| Critical Governance Capacity theorem (G >= gamma/mu * R) | No | Linear scaling requirement theorem separate from the bifurcation |
| Governance Ossification formal definition | No | Allowed(S) = empty set |
| Controlled Descent theorem | Partial | science.tex mentions it; sub-paper has the full theorem statement |
| Governance Information Budget (Appendix; 4 simultaneous constraints) | Partial | science.tex has the GIB as a proposition (5 constraints); sub-paper appendix has a different 4-constraint formulation (extraction, drift, capacity, fidelity) |
| Notation Summary table (Appendix) | No | 20+ symbol definitions specific to governance |
| Empirical Data Sources table (Appendix) | No | 5-source calibration table with methodology and confidence ratings |
| Empirical Calibration and Gaps table | No | 7-row quality assessment of governance data categories with explicit "Very low" ratings |
| Contrarian positions (5 steelmanned positions) | Partial | science.tex does not engage the governance contrarian positions: "Governance Is Overhead" (crossover at 5-10 devs), "ADRs Are Documentation Theater" (no empirical quality evidence), "Naur Is Right" (lossy compression still useful), "Conway's Law Makes Governance Futile" (inverse Conway maneuver), "The Ratchet Is Too Rigid" (relaxation addresses it) |
| Dreyfus model application | Partial | science.tex mentions it; sub-paper applies it more extensively to explain why expert knowledge resists externalization |
| Tsoukas's critique of Nonaka-Takeuchi | No | Tacit and explicit knowledge as two dimensions of all knowing, not convertible pools |
| Conway's Law related work (Nagappan 85% prediction, MacCormack mirroring, Skelton Team Topologies) | No | Empirical validation of Conway's Law and the inverse maneuver |
| ADR and fitness function related work (Nygard, Harmel-Law, Ford, ArchUnit, Archgate) | No | Specific governance tooling landscape |
| Agent Decision Records (AgDR format) | No | Extension of ADRs with agent-specific metadata |
| Measurement problem (Goodhart + metric rotation defense) | Partial | science.tex mentions Goodhart; sub-paper adds metric rotation and triangulation defenses |
| Design Principles (10 principles) | Partial | Sub-paper includes "Make logs rich" (P7), "Track decision age, not just decision content" (P8), "Measure governance, not just architecture" (P9), "Acknowledge the empirical gap" (P10); these are not present in science.tex's unified principles |

---

## Cross-Cutting Observations

### What science.tex adds that sub-papers lack:
1. **Cross-pillar synthesis** (Section 9): abstraction gap chain, compound error cascade, structural enforcement principle, governance capacity as macro constraint, shared formal machinery table, shared empirical sources table, five additional cross-pillar connections, human correction cycle, Governance Information Budget with 5 simultaneous constraints
2. **Unified notation conventions** table disambiguating overloaded symbols
3. **Empirical verification roadmap** with 5 detailed experiments including falsification criteria, data collection protocols, and resource estimates
4. **Unified design principles** (11 principles synthesized from all pillars)
5. **Evidence Quality Assessment** table rating 16 data categories

### What the sub-papers collectively contain that science.tex lacks:
1. **Extended formal definitions**: Agent/SAS/MAS tuples, Verification Layer tuples, Coordination Contract tuples, Coupling Graph, Topology Space, Speculation Policy, Pipeline DAG (Pinedo classification)
2. **Deeper proofs**: Full proofs in appendices (gap properties, convergence, Markov error propagation, Beta-Binomial calibration, NP-hardness reductions)
3. **Contrarian analyses**: ~25 contrarian positions engaged across the 7 papers vs. minimal contrarian engagement in science.tex
4. **Empirical calibration tables**: degradation function fits, detection probability matrices, cost-per-PR tables, error amplification parameter tables with CIs, merge conflict rate tables, benchmark comparison tables, spec-to-code ratio tables, function point backfiring ratios
5. **Design principles**: ~52 design principles across the 7 papers (with overlap), vs. 11 in science.tex; many specific actionable recommendations are lost (e.g., "opacity to the agent", "navigate structure not semantics", "treat the 12.3% threshold as a gate", "three verification rounds then stop")
6. **Related Work sections**: All 7 sub-papers have substantial related work sections positioning against prior art; science.tex has none
7. **Extended examples and worked calibrations**: Multi-agent verification economics break-even analysis, pipeline speedup analysis, token economics, throughput crossover analysis, QAS calibration against DORA/Kim
8. **Appendix content**: Extended CHL correspondence table, verification roadmaps (proof assistants, experiments), full detection probability matrices, ROI derivations, correlation adjustment factors, notation summaries, Markov models, Beta-Binomial fits, Goodhart taxonomy

### Verdict:
The sub-papers contain **substantial unique material** that is not present in science.tex. The synthesis captures the core theorems, definitions, and proof sketches but omits most of the empirical calibration detail, all contrarian analyses, all related work positioning, most appendix content, and roughly 75% of the design principles. The sub-papers should be treated as **essential companion documents**, not as superseded by the synthesis.
