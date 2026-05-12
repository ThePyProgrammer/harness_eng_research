# Mathematically Formalizable Problems in Harness Design

*Derived from the unified harness architecture. Each problem is stated precisely enough to admit a formal treatment, with the relevant mathematical domain identified.*

---

## I. Context Engineering

### Problem 1: The Context Budget Allocation Problem

**Setting.** An agent has a context window of $W$ tokens. A task requires access to a codebase of $N$ files with total size $T \gg W$. Each file $f_i$ has relevance $r_i \in [0,1]$ to the task (unknown a priori, estimable) and size $s_i$ tokens.

**Formal problem.** Select a subset $C \subseteq \{f_1, \ldots, f_N\}$ to include in context, maximizing task success probability:

$$\max_{C} \; P(\text{success} \mid C) \quad \text{s.t.} \quad \sum_{f_i \in C} s_i \leq W$$

**Complications:**
- Relevance $r_i$ is not independent: including file $f_i$ may make $f_j$ more or less useful (e.g., an interface definition makes its implementation interpretable).
- There is a degradation function $\delta(|C|)$: recall quality decreases as context length increases (the "context rot" phenomenon, measured by Chroma across 18 models).
- So the true objective is $P(\text{success} \mid C) \cdot (1 - \delta(\sum s_i))$, balancing relevance against degradation.

**Mathematical domain:** Submodular optimization under knapsack constraints. If the relevance function $r$ is submodular (diminishing returns from adding more context), greedy algorithms give $(1 - 1/e)$-approximations.

**Open question:** Is the relevance-degradation product still submodular? If $\delta$ is convex (degradation accelerates with context length), the product may not be, requiring different optimization techniques.

**Data available:** Needle-in-a-Haystack benchmarks give $\delta$ curves per model. GSD's fresh-200K pattern gives an empirical upper bound on useful $W$. JetBrains' observation masking study (52% cheaper, 2.6% better) gives evidence that smaller, curated context outperforms full context.

---

### Problem 2: The Reuse Discovery Problem

**Setting.** An executor is about to create a new function $g$ with signature $\sigma_g$. The codebase contains $M$ existing functions $\{f_1, \ldots, f_M\}$ with signatures $\{\sigma_1, \ldots, \sigma_M\}$ and implementations.

**Formal problem.** Determine whether there exists $f_j$ such that $f_j$ is functionally equivalent (or adaptable) to the intended $g$:

$$\exists j : d_{\text{semantic}}(\sigma_g, \sigma_j) < \epsilon \;\wedge\; \text{adapt}(f_j, \sigma_g) < \text{cost}(\text{implement}(g))$$

where $d_{\text{semantic}}$ is a semantic distance between function signatures/descriptions, and $\text{adapt}$ is the cost of adapting the existing function to the new context.

**Mathematical domain:** Approximate nearest-neighbor search in a semantic embedding space, combined with a cost model for adaptation vs. creation.

**Connection to the paper:** This is a computable approximation of the abstraction gap. $d_{\text{semantic}}(\sigma_g, \sigma_j)$ is a proxy for $K(g \mid f_j)$: the information needed to produce $g$ given $f_j$.

**Open question:** What embedding space makes $d_{\text{semantic}}$ correlate best with actual functional equivalence? Code embeddings (CodeBERT, StarCoder embeddings) vs. natural language embeddings of docstrings vs. type-signature structural matching.

---

## II. Compound Error and Verification

### Problem 3: Optimal Verification Cadence

**Setting.** A workflow consists of $n$ sequential steps. Each step has independent success probability $p$. Verification after step $k$ catches errors with probability $v$ and costs $c_v$ (tokens, latency). If an error at step $i$ is not caught until step $j > i$, the rework cost is $c_r(j - i)$, increasing with the number of steps built on the faulty foundation.

**Formal problem.** Choose a verification schedule $V \subseteq \{1, \ldots, n\}$ minimizing expected total cost:

$$\min_{V \subseteq [n]} \; \sum_{k \in V} c_v + \sum_{i=1}^{n} (1-p) \cdot P(\text{not caught before } j(i, V)) \cdot c_r(j(i,V) - i)$$

where $j(i, V) = \min\{k \in V : k \geq i\}$ is the first verification point after step $i$.

**Mathematical domain:** Dynamic programming on intervals. If $c_r$ is linear in delay, this reduces to a classic interval scheduling problem. If $c_r$ is superlinear (compounding errors are worse), the problem is more interesting.

**Empirical calibration:** The research found 62% of errors caught in 1 verification iteration, 96.5% by iteration 3. This gives $v \approx 0.62$ for single-pass verification and motivates bounded retry (max 2-3 iterations, as in the unified harness design).

**Key insight from research:** Phase-boundary verification outperforms per-step verification in cost-effectiveness. This suggests $|V| \ll n$ is optimal, with verification concentrated at natural boundaries (wave completion, phase transitions).

---

### Problem 4: Adaptive Verification Intensity

**Setting.** After an executor produces code $P$ from spec $S$, we estimate the "information gap" $\hat{g}(S, P)$ (e.g., via token ratio, NCD, or embedding distance). We must choose a verification intensity $\ell \in \{1, 2, 3, 4\}$ (from the four-layer quality architecture: structural gates, deterministic analysis, LLM-as-Judge, human review).

**Formal problem.** Given a gap estimate $\hat{g}$ and a cost-error tradeoff, choose $\ell$ to minimize:

$$\min_{\ell} \; c(\ell) + \lambda \cdot P(\text{undetected defect} \mid \hat{g}, \ell)$$

where $c(\ell)$ is the verification cost at intensity $\ell$ and $\lambda$ is the cost of a shipped defect.

**Mathematical domain:** Decision theory / classification with asymmetric costs. The gap estimate $\hat{g}$ serves as a risk score; the problem is choosing a threshold function $\ell(\hat{g})$ that minimizes expected total cost.

**Open question:** What is the functional form of $P(\text{defect} \mid \hat{g})$? The paper's convergence theorem predicts it should increase monotonically with $\hat{g}$, but the shape (linear? sigmoidal? step-function?) determines the optimal threshold policy.

---

## III. Parallelism and Coordination

### Problem 5: Optimal Task Decomposition for Parallel Execution

**Setting.** A feature requires modifying files $F = \{f_1, \ldots, f_m\}$. We must partition $F$ into $k$ disjoint sets (tasks) $T_1, \ldots, T_k$ such that tasks can execute in parallel with minimal merge conflict risk.

**Formal problem.** Define a coupling graph $G = (F, E)$ where edge weight $w_{ij}$ measures the coupling between files $f_i$ and $f_j$ (shared imports, API calls, data flow). Find a partition minimizing inter-task coupling:

$$\min_{\{T_1, \ldots, T_k\}} \; \sum_{\ell=1}^{k} \sum_{\substack{f_i \in T_\ell \\ f_j \notin T_\ell}} w_{ij} \quad \text{s.t. each } T_\ell \text{ is connected in } G$$

**Mathematical domain:** Graph partitioning (balanced min-cut). This is NP-hard in general, but spectral methods and the Kernighan-Lin heuristic give good approximations.

**Connection to RAPID:** CONTRACT.json is the output of this problem. Currently, the Planner does this decomposition heuristically. A formal solution would produce provably better task splits.

**Key constraint:** Each $T_\ell$ must be self-contained enough for an executor to work on it in isolation without knowing what the other executors are doing. This adds a "comprehensibility" constraint: $|T_\ell|$ should be bounded, and each $T_\ell$ should contain the files needed to understand the changes.

---

### Problem 6: Merge Conflict Probability and Resolution

**Setting.** $k$ parallel executors produce diffs $\Delta_1, \ldots, \Delta_k$ against a common base. Despite file ownership contracts, semantic conflicts can arise (e.g., two executors extend the same interface in incompatible ways).

**Formal problem.** Given a task decomposition and file ownership, estimate the probability of a semantic conflict at merge time:

$$P(\text{conflict}) = 1 - \prod_{\ell < \ell'} P(\text{compatible}(\Delta_\ell, \Delta_{\ell'}))$$

where compatibility requires:
- No textual overlap (file-level disjointness, enforced by CONTRACT.json)
- No structural conflict (no two diffs modify the same AST node type)
- No dependency conflict (no diff adds a dependency another removes)
- No API conflict (no diff changes a function signature another calls)
- No semantic conflict (no diff introduces behavior that contradicts another's assumptions)

**Mathematical domain:** Probabilistic graphical model. The five conflict levels form a hierarchy; lower-level compatibility implies (with high probability) higher-level compatibility. The model can be calibrated from merge history data.

**Connection to Kim et al.:** Error amplification ($17.2\times$ for independent, $4.4\times$ for centralised) is the empirical measurement of $P(\text{conflict})$ under different topologies. RAPID's 5-level detection is a structured approach to estimating and resolving conflicts at each level.

---

### Problem 7: Topology Selection as a Decision Problem

**Setting.** A task has measurable properties: number of files $m$, coupling density $\rho$ (edges/nodes in the dependency graph), estimated single-agent success probability $p_{\text{single}}$, and deadline pressure $\tau$.

**Formal problem.** Select a coordination topology $t \in \{\text{single}, \text{parallel-isolated}, \text{centralised-MAS}, \text{sequential}\}$ maximizing:

$$\max_{t} \; P(\text{success} \mid t) \cdot \frac{1}{\text{time}(t)} - \text{cost}(t)$$

where:
- $P(\text{success} \mid \text{single}) = p_{\text{single}}$
- $P(\text{success} \mid \text{parallel}) = 1 - (1 - p_{\text{single}})^k / A_e(k)$ (with error amplification factor $A_e$)
- $\text{time}(t)$ depends on $k$ (parallelism degree) and coordination overhead
- $\text{cost}(t)$ is total tokens consumed

**Mathematical domain:** Multi-objective optimization with empirically estimated parameters. Kim et al.'s data provides $A_e$ values; the harness's metrics/ directory provides $p_{\text{single}}$ estimates from historical data.

**Key finding from research:** Capability saturation at ~45% single-agent accuracy means: if $p_{\text{single}} > 0.45$, multi-agent approaches offer diminishing returns. The unified harness's three-mode system is a coarse approximation of this; a formal solution would be a continuous function.

---

## IV. Speed Optimization

### Problem 8: Pipeline Scheduling with Speculative Execution

**Setting.** The harness pipeline has stages $\{S_1, \ldots, S_m\}$ with dependencies. Stage $S_i$ takes time $t_i$ and may fail with probability $q_i$. Some stages can overlap speculatively (e.g., start planning wave N+1 while executing wave N).

**Formal problem.** Find a schedule $\sigma: \{S_1, \ldots, S_m\} \to \mathbb{R}_{\geq 0}$ (start times) minimizing expected completion time:

$$\min_{\sigma} \; \mathbb{E}[\max_i (\sigma(S_i) + t_i)] \quad \text{s.t. dependency constraints and speculative rollback costs}$$

If a speculatively started stage $S_j$ depends on $S_i$ and $S_i$ fails, the work on $S_j$ is wasted (cost $t_j$). The tradeoff: speculative overlap saves time when $S_i$ succeeds but wastes tokens when it fails.

**Mathematical domain:** Stochastic scheduling with recourse. Related to speculative execution in processor design (branch prediction).

**Empirical data:** Research found 55% next-action prediction accuracy for speculative actions. This means speculative pipelining has positive expected value when $t_{\text{saved}} \cdot 0.55 > t_{\text{wasted}} \cdot 0.45$, i.e., when saved time exceeds wasted time by a ratio of ~0.82.

---

### Problem 9: Caching and Incremental Context

**Setting.** Between tasks, some codebase state changes and some remains stable. Re-reading the full codebase costs $R$ tokens. Incremental update costs $r \ll R$ tokens but may miss changes (stale cache probability $s$).

**Formal problem.** Choose a caching strategy $\pi$ that minimizes expected cost per task:

$$\min_{\pi} \; \mathbb{E}[c_{\text{context}}(\pi) + c_{\text{error}}(\pi)]$$

where $c_{\text{context}}$ is the cost of context loading (full read vs. incremental) and $c_{\text{error}}$ is the expected cost of errors caused by stale cached state.

**Mathematical domain:** Online learning / caching theory. The optimal strategy depends on the rate of codebase change between tasks, which can be estimated from git history.

**Connection to GSD's "Fresh Eyes":** GSD always pays $R$ (full re-read). The question is whether incremental approaches can achieve comparable quality at cost $r \ll R$. Suzgun & Kalai's 17.1% advantage for fresh context may partially be a confound with context rot (stale accumulated context), not with incremental updates per se.

---

## V. Quality and Slop Prevention

### Problem 10: Layered Defense Optimization

**Setting.** There are $L$ defense layers (structural gates, deterministic analysis, LLM-as-Judge, human review), each with detection probability $d_\ell$ for defect type $j$ and cost $c_\ell$. A defect of type $j$ occurs with probability $p_j$ and has downstream cost $D_j$ if undetected.

**Formal problem.** For each defect type $j$, select which layers to apply (a subset $\Lambda_j \subseteq \{1, \ldots, L\}$) minimizing total expected cost:

$$\min_{\{\Lambda_j\}} \; \sum_{j} \left[ \sum_{\ell \in \Lambda_j} c_\ell + p_j \cdot D_j \cdot \prod_{\ell \in \Lambda_j} (1 - d_{\ell,j}) \right]$$

**Mathematical domain:** Set cover with costs, or more precisely, a multi-class detection problem with layered independent classifiers.

**Empirical data:** The 18 slop types have known detection rates by layer:
- 7 mechanically detectable ($d_1 \approx 0.95$ for structural gates)
- 7 requiring LLM judgment ($d_3 \approx 0.75$ for LLM-as-Judge; Spotify's 25% veto rate is a calibration point)
- 4 with no reliable detection ($d_\ell < 0.3$ for all automated layers; requires human review)

**Key insight:** For the 7 mechanically detectable types, the optimal strategy is always to apply layer 1 (cheap, high detection rate). For the 4 undetectable types, no automated layer is cost-effective; human review is the only option. The interesting optimization is for the 7 LLM-judgment types, where the cost-benefit tradeoff between layers 2-4 depends on $D_j$.

---

### Problem 11: The Circular Validation Problem

**Setting.** An executor produces code $P$ and tests $T$. If the same agent produces both, there is a correlation: $P(\text{T passes} \mid P \text{ is buggy}) > 0$ because the agent may write tests that validate its own mistakes.

**Formal problem.** Quantify the "circular validation bias":

$$\beta = P(\text{T passes} \mid P \text{ buggy, same author}) - P(\text{T passes} \mid P \text{ buggy, different author})$$

**Mathematical domain:** Causal inference / experimental design. The generalized Turing principle (separate producer and verifier) is the treatment; $\beta$ is the treatment effect.

**Open question:** How large is $\beta$ in practice? METR's finding that ~50% of test-passing SWE-bench PRs would not be merged suggests $\beta$ is substantial, but this conflates circular validation with other quality issues.

**Harness implication:** If $\beta > 0$ (which it almost certainly is), structural separation of code authorship and test authorship has positive expected value. The unified harness enforces this via tool permissions. The question is whether the cost of separation (two executor invocations instead of one) is justified by the reduction in undetected defects.

---

## VI. Governance and Drift

### Problem 12: Architectural Drift Detection

**Setting.** An accepted ADR $A$ specifies an invariant $\phi$ (e.g., "the API layer never imports from the persistence layer"). Over $T$ commits, the codebase state evolves: $\mathcal{C}_0, \mathcal{C}_1, \ldots, \mathcal{C}_T$. Define violation count $v_t = |\{f \in \mathcal{C}_t : f \text{ violates } \phi\}|$.

**Formal problem.** Detect drift early: distinguish between:
- $H_0$: $v_t$ is stationary (random fluctuations, no systematic drift)
- $H_1$: $v_t$ has a positive trend (systematic architectural erosion)

**Mathematical domain:** Change-point detection / time series analysis. CUSUM (cumulative sum control chart) or Bayesian online change-point detection.

**Connection to Blueprint:** Blueprint uses git trajectory analysis (not point-in-time snapshots) for drift detection. This is exactly the $H_0$ vs $H_1$ test above. Formalizing it would produce quantitative drift alerts with false-positive rate guarantees.

**Open question:** What is the right granularity? Per-commit? Per-PR? Per-sprint? The answer depends on the base rate of violations and the acceptable detection latency.

---

### Problem 13: Decision Debt and Evidence Expiry

**Setting.** An ADR was accepted at time $t_0$ based on evidence $E$ with estimated validity period $\tau$. At time $t > t_0 + \tau$, the evidence may be stale.

**Formal problem.** Model the probability that a decision remains valid as a function of time and external change rate:

$$P(\text{valid at } t) = P(\text{valid at } t_0) \cdot e^{-\lambda(t - t_0)}$$

where $\lambda$ is the "decision decay rate" depending on the technology domain (fast-moving domains have higher $\lambda$).

**Mathematical domain:** Survival analysis / reliability theory. The evidence expiry problem is formally identical to component reliability with exponential failure distribution.

**Empirical data:** Blueprint found 23% of evidence goes stale within 2 months, giving $\lambda \approx -\ln(0.77) / 2 \approx 0.13$ per month, or a half-life of ~5.3 months. This varies by domain (frontend frameworks decay faster than database engines).

**Harness implication:** The Guardian should prioritize re-evaluation of ADRs whose evidence is past its estimated half-life. The re-evaluation cost must be weighed against the risk of acting on stale decisions.

---

### Problem 14: Theory Extraction as Summarization

**Setting.** An executor produces a conversation log $L$ (potentially 100K+ tokens) containing interleaved reasoning, code generation, and tool calls. The Recorder must extract a structured THEORY.md containing decisions $D$, assumptions $A$, and rejected alternatives $R$.

**Formal problem.** This is an extractive/abstractive summarization problem with structured output. Define:

$$\text{THEORY}(L) = (D, A, R) \quad \text{where} \quad D, A, R \subseteq \text{propositions}(L)$$

The quality measure is: do the extracted propositions faithfully represent the reasoning in $L$? Formally, is there a low-distortion mapping from $L$ to $(D, A, R)$?

**Mathematical domain:** Information extraction / structured summarization. The challenge is that decisions, assumptions, and rejected alternatives are often implicit in the log (the agent doesn't say "I am assuming X"; it just acts as if X is true).

**Connection to Naur:** Naur argued the theory cannot be fully externalized. Formally, this means there exists a residual $L \setminus \text{THEORY}(L)$ that contains information not captured by any structured extraction. The question is how large this residual is and whether it matters for practical purposes.

---

## VII. The Meta-Problem

### Problem 15: Harness Self-Improvement as Online Learning

**Setting.** The harness accumulates metrics over $T$ tasks: success rate $s_t$, slop score $q_t$, verification cost $v_t$, cycle time $\tau_t$. The CONSTITUTION.md contains $n$ rules $\{r_1, \ldots, r_n\}$ that constrain agent behavior.

**Formal problem.** Learn which rules to add, remove, or modify to improve future performance:

$$\max_{\{r_1, \ldots, r_n\}} \; \mathbb{E}_{t > T}[s_t - \alpha q_t - \beta v_t - \gamma \tau_t]$$

where $\alpha, \beta, \gamma$ are tradeoff weights reflecting the user's preferences.

**Mathematical domain:** Online convex optimization / bandit algorithms. Each rule $r_i$ has an unknown effect on the objective. Adding/removing rules is an explore-exploit tradeoff: trying a new rule risks short-term degradation but may improve long-term performance.

**The key constraint:** Rules must be interpretable and auditable (humans must understand and approve changes to CONSTITUTION.md). This rules out black-box optimization and requires the learning algorithm to propose discrete, human-readable rule changes with justification.

**Connection to Turing:** This is the same meta-problem Turing solves for ML experiments (hypothesis -> test -> keep/discard), generalized to harness configuration. The self-improving harness is Turing's experiment loop applied to its own rules.

---

## Summary: The Research Agenda

| # | Problem | Domain | Data Needed | Hardness |
|---|---------|--------|-------------|----------|
| 1 | Context budget allocation | Submodular optimization | Relevance-degradation curves per model | Poly-time approx |
| 2 | Reuse discovery | Approximate nearest-neighbor | Code embedding benchmarks | Tractable |
| 3 | Verification cadence | Dynamic programming | Error rates per stage, rework costs | Tractable |
| 4 | Adaptive verification intensity | Decision theory | Defect probability as function of gap | Calibration needed |
| 5 | Task decomposition for parallelism | Graph partitioning (min-cut) | File coupling graph from static analysis | NP-hard, good heuristics |
| 6 | Merge conflict probability | Probabilistic graphical model | Merge history data | Calibration needed |
| 7 | Topology selection | Multi-objective optimization | Kim et al. + harness metrics | Tractable |
| 8 | Pipeline scheduling | Stochastic scheduling | Stage durations and failure rates | Tractable |
| 9 | Caching strategy | Online learning / caching | Codebase change rate from git | Tractable |
| 10 | Layered defense optimization | Set cover with costs | Detection rates per layer per slop type | Tractable |
| 11 | Circular validation bias | Causal inference | Paired experiments (same vs diff author) | Needs experiments |
| 12 | Drift detection | Change-point detection | Violation counts over time | Tractable |
| 13 | Evidence expiry | Survival analysis | Decision validity over time | Calibration needed |
| 14 | Theory extraction | Structured summarization | Conversation logs with ground-truth theories | ML problem |
| 15 | Harness self-improvement | Online optimization / bandits | Accumulated task metrics | Hard (explore-exploit) |

The tractable problems (1-4, 7-10, 12) can be solved with known algorithms given empirical calibration data. The hard problems (5, 15) require heuristics. The calibration problems (4, 6, 13) require data collection from running harnesses. The experimental problem (11) requires controlled studies. The ML problem (14) requires training data.

The most impactful problems to solve first: **3** (verification cadence, because compound errors are the single biggest quality driver), **5** (task decomposition, because it unlocks safe parallelism), and **10** (layered defense, because it makes quality investment efficient).
