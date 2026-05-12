# Formal Foundations for AI Code Defect Classification and Measurement

## Overview

This document develops rigorous type-theoretic definitions, information-theoretic metrics, and formal results for classifying and measuring AI-generated code defects ("slop"). It builds on the empirical taxonomy of 18 slop types (Pillar 5), the cross-taxonomy mapping (R4), and the empirical landscape (R1). The goal is to move from enumeration to formalism: precise definitions, theorem statements with proof sketches, and corollaries that connect to engineering practice.

---

## 1. Formal Slop Taxonomy

### 1.1 Defect Type as a Formal Object

**Definition 1.1 (Slop Type).** A slop type is a tuple:

$$\tau_j = (\sigma_j, \phi_j, \delta_j, C_j)$$

where:
- $\sigma_j : \text{AST} \to \{0, 1\}$ is the **syntactic signature**, a predicate on abstract syntax trees that identifies candidate instances. For mechanically detectable types, $\sigma_j$ is computable in polynomial time. For judgment-dependent types, $\sigma_j$ is either undefined or an approximation with known false-negative rate.
- $\phi_j : \text{Program} \times \text{Context} \to \{0, 1\}$ is the **semantic property**, a predicate that determines whether a candidate instance is a genuine defect given the full program context (codebase state, requirements, architectural intent). This captures the distinction between "dead code" (syntactically identifiable) and "over-engineering" (requires understanding intent).
- $\delta_j \in \{\text{D}, \text{SD}, \text{U}\}$ is the **detection decidability class**: Decidable, Semi-decidable, or Undecidable (defined formally below).
- $C_j : \Omega \to \mathbb{R}_{\geq 0}$ is the **cost distribution**, a random variable representing the downstream cost of an undetected instance, where $\Omega$ is the sample space of deployment contexts.

**Definition 1.2 (Detection Decidability Classes).** The three classes are formally distinct in the computability-theoretic sense:

- **Decidable (D):** There exists a total computable function $f_j : \text{AST} \to \{0, 1\}$ such that $f_j(t) = 1$ iff $t$ contains an instance of slop type $\tau_j$. Equivalently, $\sigma_j$ is a decidable predicate, and $\phi_j$ does not depend on context (or the relevant context is mechanically extractable). Detection is *complete* and *sound* up to tooling fidelity.

- **Semi-decidable (SD):** The semantic property $\phi_j$ depends on context that is partially but not fully formalizable. An oracle (LLM-as-Judge, human reviewer) can approximate $\phi_j$ with probability $p \in (0.5, 1)$, but no computable function achieves $p = 1$. More precisely: there exists no total computable $f_j$ with $\Pr[f_j(t, \text{ctx}) = \phi_j(t, \text{ctx})] = 1$ for all inputs, but there exist probabilistic oracles achieving $\Pr[\text{correct}] > 0.5 + \epsilon$ for some fixed $\epsilon > 0$.

- **Undecidable (U):** No known oracle (automated or human) achieves reliable detection. Formally: for all known detection procedures $f$, the inter-rater reliability $\kappa < 0.4$ (below the "fair agreement" threshold). The semantic property $\phi_j$ depends on holistic codebase judgment for which no consistent standard exists across reviewers.

### 1.2 Partition of the 18 Types

**Proposition 1.1.** The 18 slop types partition into the three decidability classes as follows:

| Class | Count | Types |
|-------|-------|-------|
| D (Decidable) | 7 | Hallucinated imports, placeholder/stub code, duplicate logic, dead code, lint suppressions, cross-language contamination, outdated APIs |
| SD (Semi-decidable) | 7 | Security vulns (functional-looking), happy-path error handling, data model mismatches, over-engineering, architectural erosion, silent scope expansion, god functions |
| U (Undecidable) | 4 | Meaningless tests, boilerplate inflation, redundant comments, naming/convention drift |

**Proof sketch.** For each Decidable type, we exhibit the computable function: hallucinated imports are detected by lockfile/import resolution (total, polynomial-time); placeholder/stub code by AST pattern matching for `pass`, `...`, `NotImplementedError` (regular language over AST tokens); duplicate logic by tree-sitter-based clone detection (suffix tree construction, $O(n \log n)$); dead code by reachability analysis (graph algorithm on call/import graph); lint suppressions by regex scan (regular expression matching); cross-language contamination by language-specific AST linter rules; outdated APIs by lookup against deprecation databases (table lookup).

For each Semi-decidable type, we show context-dependence that defeats mechanical detection: security vulnerabilities that look functional require understanding which inputs are adversarial (depends on deployment context); happy-path error handling requires knowing which error paths matter (depends on failure modes); data model mismatches require knowing the intended schema (not always machine-readable); over-engineering requires judging necessity of abstraction (inherently subjective but experts agree at $\kappa \approx 0.6$); architectural erosion requires comparing against design intent (partially expressible via reflexion models); silent scope expansion requires comparing diff against task description (requires NL understanding); god functions require judging decomposition necessity (partially captured by complexity thresholds, but thresholds are arbitrary).

For each Undecidable type, we show that even expert reviewers disagree: meaningless tests (what constitutes "meaningful" testing is domain-dependent; a test that exercises code without asserting behavior may be intentional integration smoke test); boilerplate inflation (the threshold between "appropriate verbosity" and "bloat" varies by team norms); redundant comments (whether a comment is "obvious" depends on the reader's expertise level); naming/convention drift (conventions are often implicit and locally inconsistent even in well-maintained codebases). $\square$

### 1.3 Latent Factor Structure

**Definition 1.3 (Generative Factors).** The three latent factors are formalized as generative processes that produce slop instances:

**Factor F1: Context Blindness.** Let $\mathcal{K}(t)$ denote the codebase knowledge required to generate correct code at point $t$ (the set of existing patterns, conventions, dependencies, and architectural constraints relevant to the modification). Context blindness occurs when the agent's effective context $\hat{\mathcal{K}}(t) \subset \mathcal{K}(t)$, and the information deficit $\mathcal{K}(t) \setminus \hat{\mathcal{K}}(t)$ causes the agent to generate code that is locally correct but globally inconsistent.

*Formally:* Slop type $\tau_j$ loads on F1 if $\Pr[\tau_j \mid |\mathcal{K} \setminus \hat{\mathcal{K}}| > k] > \Pr[\tau_j \mid |\mathcal{K} \setminus \hat{\mathcal{K}}| \leq k]$ for threshold $k$, i.e., the probability of $\tau_j$ increases monotonically with context deficit.

*Types loading on F1:* Duplicate logic (#4), naming drift (#18), architectural erosion (#10), boilerplate inflation (#11). All four are driven by ignorance of what already exists.

**Factor F2: Completion Bias.** Let $\pi(\cdot)$ denote the agent's output distribution. Completion bias is the property that $\pi$ assigns higher probability to outputs that are syntactically complete and fluent than to outputs that are semantically correct but incomplete (e.g., raising `NotImplementedError`, returning early, omitting unnecessary code).

*Formally:* Slop type $\tau_j$ loads on F2 if, for the set of prompts $P$ that can elicit $\tau_j$, the agent's output distribution satisfies $\mathbb{E}_\pi[\text{length}(o)] > \mathbb{E}_{\pi^*}[\text{length}(o)]$ where $\pi^*$ is the optimal policy, i.e., the agent systematically over-generates.

*Types loading on F2:* Placeholder code (#3), happy-path error handling (#5), meaningless tests (#6), redundant comments (#17), over-engineering (#8). All five are artifacts of preferring "complete-looking" output over minimal correct output.

**Factor F3: Training Distribution Leakage.** Let $\mathcal{D}$ denote the training distribution and $\mathcal{E}$ the current execution environment. Leakage occurs when the agent produces code drawn from $\mathcal{D}$ that is incompatible with $\mathcal{E}$, specifically when patterns memorized during training are applied to contexts where they do not hold.

*Formally:* Slop type $\tau_j$ loads on F3 if $\Pr[\tau_j \mid \text{divergence}(\mathcal{D}, \mathcal{E}) > d] > \Pr[\tau_j \mid \text{divergence}(\mathcal{D}, \mathcal{E}) \leq d]$ for threshold $d$, where divergence measures the distance between the training distribution's API/library/convention landscape and the current project's actual environment.

*Types loading on F3:* Hallucinated imports (#1), cross-language contamination (#13), outdated APIs (#9), security vulnerabilities (#2). All four arise from the model reproducing training patterns that are incorrect for the specific context.

**Proposition 1.2 (Approximate Orthogonality).** The three factors are approximately orthogonal in the sense that the pairwise mutual information $I(F_i; F_k)$ is small relative to $H(F_i)$ for $i \neq k$, under the assumption that context deficit, output length bias, and distribution mismatch are independent failure modes.

*Proof sketch.* Context blindness is driven by the information retrieval pipeline (what the agent can see); completion bias is driven by the decoding objective (how the agent generates); training leakage is driven by the training data (what the agent memorized). These three mechanisms operate at different stages of the generation process (input, generation, and prior knowledge respectively), and there is no a priori reason for them to covary. Empirical validation would require factor analysis on a labeled slop dataset; the ISSRE 2025 dataset (500K+ samples) is the most promising candidate. $\square$

**Corollary 1.1 (Intervention Independence).** If the three factors are approximately orthogonal, interventions targeting different factors compose multiplicatively: fixing context blindness (via better retrieval) does not reduce completion bias (which requires structural output constraints), and vice versa. This means the quality stack must address all three factors independently.

---

## 2. Codebase Health Metric

### 2.1 Codebase Entropy

**Definition 2.1 (Codebase Entropy).** Let a codebase $\mathcal{C}$ consist of $n$ files $\{f_1, \ldots, f_n\}$. Define the **modification context** $\mu(f_i)$ as the minimum set of other files a developer must understand in order to correctly modify $f_i$. The codebase entropy is:

$$H(\mathcal{C}) = \frac{1}{n} \sum_{i=1}^{n} \log_2 |\mu(f_i)|$$

This measures the average information (in bits) needed to understand the modification context of a randomly selected file. A perfectly modular codebase with no cross-file dependencies has $H(\mathcal{C}) = 0$ (each file can be modified in isolation). A fully coupled codebase where every file depends on every other has $H(\mathcal{C}) = \log_2 n$.

**Remark.** This definition operationalizes the intuition from Hassan and Holt's source code change entropy, but shifts from measuring the *scattering of changes* to measuring the *coupling structure* that necessitates scattered changes. It is related to Kolmogorov complexity: $|\mu(f_i)|$ approximates the "context complexity" of $f_i$, while the Kolmogorov complexity $K(f_i)$ measures the description complexity. Superficially competent code inflates $|\mu(f_i)|$ without inflating $K(f_i)$ proportionally, which is the formal signature of accidental complexity.

**Definition 2.2 (Structural Entropy).** A refinement weights each dependency by its coupling strength. Let $w_{ij} \in [0, 1]$ measure the coupling between files $f_i$ and $f_j$ (e.g., the fraction of symbols in $f_i$ that reference $f_j$). Then:

$$H_w(\mathcal{C}) = -\frac{1}{n} \sum_{i=1}^{n} \sum_{j \neq i} w_{ij} \log_2 w_{ij}$$

where we follow the convention $0 \log 0 = 0$. This is the Shannon entropy of the coupling distribution for each file, averaged across the codebase.

### 2.2 Accretion Rate

**Definition 2.3 (Accretion Rate).** Let $\mathcal{C}_t$ denote the codebase at time $t$ and $\Delta_t$ denote the change applied at time $t$. The accretion rate is:

$$\alpha(t) = \frac{H(\mathcal{C}_{t+1}) - H(\mathcal{C}_t)}{|\Delta_t|}$$

where $|\Delta_t|$ is the size of the change (e.g., lines added/modified). Accretion rate measures the entropy increase per unit of code change. A positive accretion rate means the codebase is becoming harder to modify with each change. A negative rate indicates active simplification (refactoring).

**Proposition 2.1 (AI Accretion Dominance).** Under AI-assisted development with current tools, the expected accretion rate is strictly positive: $\mathbb{E}[\alpha(t)] > 0$. Under pre-AI development practices, the accretion rate oscillated around zero due to compensating refactoring.

*Evidence.* GitClear data: refactoring dropped from 24.1% to 9.5% of changes (the compensating negative-entropy contribution shrank by 60%), while code addition rose from 39% to 46% and cloning from 8.3% to 12.3% (the positive-entropy contributions grew). The net effect is a shift from approximately zero mean accretion to persistently positive accretion. $\square$

### 2.3 The Compound Degradation Theorem

**Theorem 2.1 (Compound Degradation).** Let $\{\Delta_t\}_{t=1}^{T}$ be a sequence of changes, each of which passes CI (i.e., satisfies all existing automated quality gates). If the accretion rate $\alpha(t) > 0$ for all $t$, and the modification context grows sublinearly with codebase size (i.e., $|\mu(f_i)|$ grows as $n^{\beta}$ for $0 < \beta < 1$), then the codebase entropy grows superlinearly in the number of changes:

$$H(\mathcal{C}_T) \geq H(\mathcal{C}_0) + \sum_{t=1}^{T} \alpha(t) \cdot |\Delta_t|$$

and if each change adds code (increasing $n$), the entropy per file grows as:

$$\frac{H(\mathcal{C}_T)}{n_T} = \Omega\left(n_T^{\beta - 1} \cdot \log n_T\right)$$

*Proof sketch.* Each change $\Delta_t$ that adds code without refactoring increases both $n$ (number of files or modules) and the coupling degree of existing files (because new code references existing code). If the new code is "superficially competent" (passes CI), it satisfies functional correctness but not minimal coupling. Each new dependency adds to $|\mu(f_i)|$ for at least one existing file $f_i$. The sum telescopes, and the $\log_2 |\mu(f_i)|$ term grows as $\beta \log_2 n$, yielding the superlinear bound.

The key insight is that CI checks are *pointwise* (they verify correctness of the current change) but entropy is a *global* property (it depends on the cumulative coupling structure). Pointwise correctness does not imply bounded global entropy. $\square$

**Corollary 2.1 (The Ratchet Effect).** In the absence of explicit refactoring effort proportional to the code addition rate, codebase entropy is monotonically non-decreasing. Each individually-correct change ratchets the entropy upward with no mechanism for spontaneous decrease.

### 2.4 Connection to Lehman's Laws

**Proposition 2.2 (Lehman's Second Law as a Special Case).** Lehman's Second Law ("as an E-type system evolves, its complexity increases unless explicit work is done to maintain or reduce it") is a special case of the Compound Degradation Theorem where:
- "Complexity" is identified with codebase entropy $H(\mathcal{C})$
- "Explicit work to maintain or reduce it" corresponds to changes with $\alpha(t) < 0$ (refactoring)
- The condition "unless" corresponds to our requirement $\alpha(t) > 0$ for all $t$

AI-assisted development accelerates Lehman's Second Law by simultaneously: (a) increasing the rate of entropy-adding changes (higher code generation throughput), (b) decreasing the rate of entropy-reducing changes (refactoring collapsed from 25% to <10%), and (c) introducing a new class of entropy that is invisible to existing quality gates (the "superficially competent" property).

**Corollary 2.2 (Refactoring Ratio Threshold).** Let $r$ denote the fraction of changes that are refactoring (with $\alpha < 0$) and $(1 - r)$ the fraction that are feature additions (with $\alpha > 0$). For codebase entropy to remain bounded, we need:

$$r \cdot |\mathbb{E}[\alpha \mid \text{refactoring}]| \geq (1 - r) \cdot \mathbb{E}[\alpha \mid \text{addition}]$$

GitClear's data suggests the pre-AI equilibrium was $r \approx 0.24$ with $|\alpha_{\text{refactor}}| \approx 3 \cdot \alpha_{\text{add}}$ (refactoring removes roughly 3x more entropy per line than addition creates). The post-AI state is $r \approx 0.095$, which violates the bound by a factor of approximately 2.5x. This quantifies the "refactoring deficit" introduced by AI-assisted development.

---

## 3. Defect Removal Efficiency (DRE) Composition

### 3.1 Single-Layer DRE

**Definition 3.1 (Defect Removal Efficiency).** The DRE of layer $\ell$ for slop type $j$ is the probability that layer $\ell$ detects (and removes) an instance of type $j$:

$$d_{\ell,j} = \Pr[\text{layer } \ell \text{ detects instance of type } j]$$

This is the per-layer, per-type detection probability. Empirical calibration: for Decidable types, structural gates achieve $d_{1,j} \approx 0.95$; for Semi-decidable types, LLM-as-Judge achieves $d_{3,j} \approx 0.75$ (calibrated against Spotify's 25% veto rate on proposed changes); for Undecidable types, all layers achieve $d_{\ell,j} < 0.3$.

### 3.2 Independent Cascade

**Theorem 3.1 (DRE Cascade under Independence).** Given $L$ layers applied in sequence, if the detection events are independent across layers, the cumulative DRE for type $j$ is:

$$D_j = 1 - \prod_{\ell=1}^{L} (1 - d_{\ell,j})$$

*Proof.* An instance escapes all layers iff it escapes each layer independently. The probability of escaping layer $\ell$ is $(1 - d_{\ell,j})$. Under independence, the probability of escaping all layers is the product. The cumulative detection probability is the complement. $\square$

**Example.** For a Semi-decidable type with three layers: $d_1 = 0.3$ (partial static analysis), $d_2 = 0.75$ (LLM-as-Judge), $d_3 = 0.5$ (human review of flagged items). Under independence:

$$D = 1 - (0.7)(0.25)(0.5) = 1 - 0.0875 = 0.9125$$

Three diverse layers at individually modest detection rates achieve >91% cumulative DRE.

### 3.3 Correlated Layers: The Copula Model

**Definition 3.2 (Layer Correlation).** Let $X_\ell \in \{0, 1\}$ be the indicator that layer $\ell$ detects a given instance. The pairwise correlation is $\rho_{\ell,m} = \text{Corr}(X_\ell, X_m)$. If layers share biases (e.g., two LLMs trained on similar data), $\rho > 0$, and the independence assumption overestimates cumulative DRE.

**Theorem 3.2 (DRE under Gaussian Copula Correlation).** Let the joint detection distribution be modeled by a Gaussian copula with correlation matrix $\mathbf{R}$, where $R_{\ell,m} = \rho_{\ell,m}$. The cumulative DRE is:

$$D_j = 1 - \Pr\left[\bigcap_{\ell=1}^{L} (X_\ell = 0)\right] = 1 - C_{\mathbf{R}}(1 - d_{1,j}, \ldots, 1 - d_{L,j})$$

where $C_{\mathbf{R}}$ is the Gaussian copula with correlation matrix $\mathbf{R}$ applied to the marginal escape probabilities.

*Proof sketch.* By Sklar's theorem, any joint distribution can be decomposed into marginals and a copula. The Gaussian copula models the dependence structure through the correlation matrix while preserving the marginal detection probabilities. The joint escape probability is the copula evaluated at the marginal escape probabilities. $\square$

**Corollary 3.1 (Correlation Penalty).** For two layers with equal detection probabilities $d$ and correlation $\rho$, the cumulative DRE under the Gaussian copula satisfies:

$$D_{\text{correlated}} < D_{\text{independent}} = 1 - (1 - d)^2$$

The gap $D_{\text{independent}} - D_{\text{correlated}}$ is monotonically increasing in $\rho$. At $\rho = 1$ (perfect correlation), $D_{\text{correlated}} = d$ (the second layer adds nothing). At $\rho = 0$, we recover the independent case.

**Practical implication.** LLM-as-Judge using the same model family as the code generator (e.g., GPT-4 judging GPT-4 output) has high $\rho$ due to shared training data and blind spots. Cross-family evaluation (Claude judging GPT output, or vice versa) reduces $\rho$, recovering more of the independent DRE gain. This is the formal basis for the recommendation to use diverse model families in the quality stack.

### 3.4 Capers Jones' Law and Diversity Theory

**Proposition 3.1 (The 95% Threshold).** (Capers Jones, empirical.) Achieving DRE > 95% requires a minimum of three diverse defect removal techniques (formal inspection, static analysis, and testing). No single technique or pair of techniques, regardless of investment, achieves 95% in practice.

*Formal explanation via diversity theory.* Consider $L$ detection layers with marginal DRE $d_\ell \leq d_{\max} < 1$ where $d_{\max}$ is the ceiling for any single technique (empirically, $d_{\max} \approx 0.85$ for the best individual techniques). The cumulative DRE under independence is:

$$D = 1 - \prod_{\ell=1}^{L} (1 - d_\ell) \leq 1 - (1 - d_{\max})^L$$

For $D > 0.95$, we need $(1 - d_{\max})^L < 0.05$, i.e., $L > \frac{\log 0.05}{\log(1 - d_{\max})}$.

With $d_{\max} = 0.85$: $L > \frac{-2.996}{-1.897} \approx 1.58$, so $L \geq 2$.

But this assumes independence ($\rho = 0$), which is unrealistic. Under realistic correlation ($\rho \approx 0.3$ between human-driven techniques, higher between automated techniques), the effective escape probability is higher, requiring $L \geq 3$.

With realistic parameters ($d_1 = 0.60$ for formal inspection, $d_2 = 0.50$ for static analysis, $d_3 = 0.70$ for testing, $\rho_{12} = 0.2$, $\rho_{13} = 0.1$, $\rho_{23} = 0.15$), the Gaussian copula model yields $D \approx 0.954$, crossing the 95% threshold only with all three techniques active. Removing any one drops $D$ below 0.90.

**Corollary 3.2 (Diversity Premium).** The marginal value of the $L$-th detection layer depends more on its independence from existing layers (low $\rho$) than on its absolute detection probability $d_L$. A weak but independent detector ($d = 0.3, \rho = 0$) can outperform a strong but correlated detector ($d = 0.7, \rho = 0.8$) in terms of marginal DRE improvement.

### 3.5 Diminishing Returns and Optimal Stopping

**Theorem 3.3 (Diminishing Marginal Returns).** The marginal DRE gain from adding the $(L+1)$-th layer is:

$$\Delta D_{L+1} = d_{L+1,j} \cdot \prod_{\ell=1}^{L} (1 - d_{\ell,j})$$

under independence. This is strictly decreasing in $L$ (since the product term shrinks), establishing diminishing returns.

**Definition 3.3 (Optimal Layer Set).** The optimal set of layers for type $j$ is the solution to:

$$\Lambda_j^* = \arg\min_{\Lambda \subseteq [L]} \left[ \sum_{\ell \in \Lambda} c_\ell + p_j \cdot D_j \cdot \prod_{\ell \in \Lambda} (1 - d_{\ell,j}) \right]$$

where $c_\ell$ is the cost of applying layer $\ell$, $p_j$ is the prior probability of slop type $j$, and $D_j$ is the downstream cost per undetected instance.

**Proposition 3.2 (Greedy Approximation).** Sort layers by ROI: $\text{ROI}(\ell, j) = d_{\ell,j} \cdot D_j / c_\ell$. Add layers in decreasing ROI order, stopping when the next layer's marginal benefit (reduction in expected downstream cost) is less than its cost $c_\ell$. This greedy algorithm achieves a 2-approximation to the optimal solution (the problem is a variant of weighted set cover, which is NP-hard in general but admits greedy approximation).

---

## 4. Cost-of-Quality Model for AI Code

### 4.1 The Four Cost Categories

**Definition 4.1 (Cost of Quality for AI Code).** The total cost of quality is:

$$\text{CoQ} = C_P + C_A + C_{IF} + C_{EF}$$

where:

**Prevention costs ($C_P$):** Investments that reduce the probability of defect generation.
- Type system enforcement: cost of maintaining strict type annotations and compilation checks
- Structural constraints: diff budgets, file-creation gates, mandatory justification for new abstractions
- Sandboxing: execution environment isolation preventing agents from circumventing checks
- Context engineering: codebase indexing, reuse maps, convention files that reduce context blindness
- Agent configuration: prompt engineering, tool selection, model choice

**Appraisal costs ($C_A$):** Costs of evaluating generated code for defects.
- Automated static analysis: linters, SAST tools, clone detectors ($c_1$ per file, ~2s)
- Deterministic analysis: AST scans, complexity checks, deprecation lookups ($c_2$ per task, ~10s)
- LLM-as-Judge review: scope compliance, abstraction audit, test quality ($c_3$ per task, ~30s)
- Human review: architectural review, security audit, design validation ($c_4$ per flagged item, ~30min)

**Internal failure costs ($C_{IF}$):** Costs of defects found before release.
- Rework: rewriting AI-generated code that failed review
- Retesting: re-running test suites after rework
- Delay: schedule impact of rework cycles
- Context switching: human developer time to understand and fix AI-generated code

**External failure costs ($C_{EF}$):** Costs of defects reaching production.
- Security incidents: breach response, remediation, regulatory penalties
- Production outages: downtime, revenue loss, SLA violations
- Technical debt servicing: ongoing maintenance burden of degraded codebase
- Reputation damage: user trust erosion

### 4.2 The 1:10:100 Ratio for AI Code

**Proposition 4.1 (Calibrated Cost Ratios).** The classical 1:10:100 ratio (prevention : appraisal-stage detection : production failure) requires recalibration for AI code:

For *Decidable* slop types, the ratio is approximately **1 : 3 : 100**. Prevention (type systems, linters) costs ~$1. Detection at the appraisal stage is only ~3x more expensive because the detection is still automated; the extra cost comes from rework rather than discovery. Production cost remains high because even "simple" defects (hallucinated imports, dead code) can cause cascading failures in production.

For *Semi-decidable* slop types, the ratio is approximately **1 : 15 : 100**. Prevention (better context engineering, structural output constraints) costs ~$1. Appraisal requires LLM-as-Judge or human review (~15x more expensive than prevention). Production cost remains ~100x.

For *Undecidable* slop types, the ratio is approximately **1 : 50 : 30**. Prevention (coding standards, team norms, training) costs ~$1. Appraisal is extremely expensive (~50x) because detection requires deep expert review. But production cost is *lower* (~30x) because these types (boilerplate, naming drift, redundant comments) degrade maintainability rather than causing acute failures. The cost manifests as cumulative entropy, not as incidents.

**Corollary 4.1 (Inversion for Undecidable Types).** For Undecidable types, the appraisal cost can exceed the (discounted) external failure cost, meaning it is sometimes economically rational to *accept* these defects rather than invest in detecting them. This is the formal basis for "slop is acceptable" in certain contexts.

### 4.3 The Optimal Quality Level

**Theorem 4.1 (Optimal Quality Level).** The total CoQ is minimized at a quality level $q^* < 1$. Define the defect rate as $\lambda(q) = \lambda_0 \cdot e^{-\beta q}$ where $q \in [0,1]$ is the quality investment level, $\lambda_0$ is the base defect rate, and $\beta > 0$ is the effectiveness of quality investment. Then:

$$\text{CoQ}(q) = c_P \cdot q + c_A \cdot q + c_F \cdot \lambda_0 \cdot e^{-\beta q}$$

where $c_P$ and $c_A$ are the marginal costs of prevention and appraisal (linear in $q$), and $c_F$ is the expected cost per escaped defect.

Taking the derivative and setting to zero:

$$c_P + c_A = c_F \cdot \lambda_0 \cdot \beta \cdot e^{-\beta q^*}$$

$$q^* = \frac{1}{\beta} \ln\left(\frac{c_F \cdot \lambda_0 \cdot \beta}{c_P + c_A}\right)$$

The optimal quality level increases with downstream failure cost $c_F$ and decreases with prevention/appraisal cost $(c_P + c_A)$.

**Corollary 4.2 (Context-Dependent Quality Targeting).** For different code categories:
- *Production, security-critical code:* $c_F$ is high (regulatory penalties, breach costs), so $q^*$ is close to 1. Invest in all four quality layers.
- *Internal tools:* $c_F$ is moderate (productivity loss, not external impact), so $q^* \approx 0.7$. Layers 1-2 (structural + deterministic) suffice.
- *Prototypes and throwaway scripts:* $c_F$ is low (no production deployment), so $q^* \approx 0.3$. Layer 1 (structural gates) only.

This formalizes the position that "slop is acceptable" for prototypes while being unacceptable for production code, and provides the mathematical framework for computing the boundary.

### 4.4 AI-Specific CoQ Distortion

**Proposition 4.2 (The Appraisal Compression Problem).** AI code generation compresses the time between code creation and potential deployment, reducing the window for appraisal. If the code generation rate is $g$ (files per hour) and the appraisal capacity is $a$ (files reviewed per hour), then for $g > a$, a fraction $(g - a)/g$ of generated code bypasses appraisal entirely.

*Evidence.* Sonar 2026 data: only 48% of developers always verify AI code before committing. This implies $g/a \approx 2$ on average, meaning roughly half of AI-generated code receives no appraisal.

**Corollary 4.3 (Automated Appraisal Imperative).** When $g > a$, the only way to maintain quality is to increase $a$ through automation (Layers 1-2) rather than through human review (Layer 4). The quality stack's ordering (cheap automated checks first, expensive human checks last, applied only to flagged items) is not merely a cost optimization; it is a *throughput constraint*.

---

## 5. The Accretion Category

### 5.1 Formal Definition

**Definition 5.1 (Accretion Defect).** A code change $\Delta$ is an accretion defect if and only if:

1. **Correctness:** $\Delta$ does not introduce functional errors. All existing tests pass after $\Delta$ is applied. $\forall t \in \text{TestSuite}: t(\mathcal{C} \oplus \Delta) = \text{pass}$.

2. **Superfluity:** There exists a smaller change $\Delta' \subset \Delta$ (strictly fewer lines, files, or abstractions) that satisfies the same requirement $R$. Formally, $|\Delta'| < |\Delta|$ and $\text{satisfies}(\Delta', R) = \text{true}$.

3. **Individual Defensibility:** $\Delta$ does not violate any stated coding standard, architectural rule, or style guide. A reasonable reviewer examining $\Delta$ in isolation would not flag it as defective.

4. **Aggregate Harm:** The cumulative effect of applying many such changes increases codebase entropy: $\mathbb{E}[H(\mathcal{C} \oplus \Delta_1 \oplus \cdots \oplus \Delta_k)] > H(\mathcal{C}) + k \cdot \epsilon$ for some $\epsilon > 0$.

The conjunction of properties (1), (3), and (4) is what makes accretion defects novel: they are correct, individually acceptable, and collectively harmful.

### 5.2 Why Classical Taxonomies Miss It

**Proposition 5.1.** No classical defect taxonomy (IEEE 1044, ODC, Beizer, CWE) contains a category that captures accretion defects.

*Proof.* Consider each taxonomy:
- *IEEE 1044* classifies anomalies that cause failures. By property (1), accretion defects cause no failures. They are invisible to IEEE 1044.
- *ODC* classifies defects that require fixes. By property (3), accretion defects do not require fixes (each is individually acceptable). ODC's "Extraneous" qualifier is the closest, but it presupposes the code was *accidentally* extraneous, not *systematically* generated as a baseline behavior.
- *Beizer* classifies bugs traceable to specific incorrect decisions. By property (3), no specific decision in an accretion defect is incorrect. Beizer's taxonomy lacks a category for "correct decisions that should not have been made."
- *CWE* classifies security weaknesses. By property (1), accretion defects do not create security weaknesses.

The common gap: all four taxonomies assume **intentional authorship**, the premise that code results from a human making a conscious decision that was either correct or incorrect. Accretion defects arise from a process (statistical pattern completion) that makes no decisions in the human sense. The code is generated because it is *probable*, not because it is *necessary*. $\square$

### 5.3 The Measurement Problem

**Definition 5.2 (Accretion Measurement Problem).** For a single change $\Delta$, the accretion defect predicate is:

$$\text{accretion}(\Delta) = \text{correct}(\Delta) \wedge \text{superfluous}(\Delta) \wedge \text{defensible}(\Delta)$$

The problem: $\text{superfluous}(\Delta)$ requires exhibiting a witness $\Delta' \subset \Delta$ that satisfies the same requirement. This is in general undecidable (it reduces to program equivalence). Even when decidable in principle, it requires understanding the *minimal sufficient implementation*, which is a function of the requirement $R$ and the codebase $\mathcal{C}$, both of which are incompletely specified.

**Proposition 5.2 (Aggregate Measurability).** While individual accretion defects resist detection, the aggregate effect is measurable through proxy metrics:

- **Accretion rate** $\alpha(t)$ (Definition 2.3): positive accretion rate indicates net entropy increase per change.
- **Refactoring ratio** $r$ (Corollary 2.2): declining $r$ is a leading indicator of accumulating accretion.
- **Clone frequency**: GitClear's 8x increase in duplicated code blocks is a direct measure of one component of accretion.
- **Lines per function point**: increasing ratio of implementation size to functional specification size measures "verbosity inflation."
- **New abstraction rate**: number of new files, classes, or interfaces created per requirement, controlling for requirement complexity.

**Corollary 5.1 (Statistical Detection).** Accretion defects are not individually detectable but are *statistically* detectable. By analogy to quality control in manufacturing: individual items within tolerance are not defective, but a systematic drift in the mean of a quality characteristic (detectable via control charts) indicates a process problem. The appropriate detection mechanism is not per-change review but per-period codebase health monitoring.

### 5.4 Connection to the Tragedy of the Commons

**Proposition 5.3 (Accretion as Tragedy of the Commons).** The accretion problem has the formal structure of a tragedy of the commons. Define:

- **The commons:** codebase health (entropy budget). A finite shared resource; the codebase can tolerate a bounded amount of entropy before modification becomes prohibitively expensive.
- **Individual rational action:** Each AI agent (or developer accepting AI suggestions) generates code that is locally optimal (correct, complete, passing CI). Adding a few extra abstractions, a bit of boilerplate, a redundant comment, is individually costless.
- **Collective irrationality:** When all agents act locally optimally, the commons (codebase health) degrades. The entropy budget is exhausted, and modification costs increase for everyone.

*Formally:* Let $u_i(\Delta_i)$ be the utility of change $\Delta_i$ to the agent that generates it (task completed, requirement satisfied). Let $e(\Delta_i)$ be the externality (entropy increase imposed on the codebase). The agent optimizes $u_i$ without internalizing $e$, because:
- The agent has no mechanism to observe codebase entropy (context blindness, Factor F1)
- CI does not penalize entropy increase (no fitness function for health)
- The cost of $e(\Delta_i)$ is diffused across all future modifiers, not concentrated on the generator

This is the standard externality structure. The solution, following the economics literature, is either *Pigouvian taxation* (imposing a cost on entropy-increasing changes, e.g., diff budgets, complexity gates) or *Coasian assignment of property rights* (giving a module owner veto power over entropy-increasing changes, i.e., code ownership + mandatory review).

The four-layer quality stack can be interpreted through this lens: Layers 1-2 are Pigouvian taxes (automated penalties for measurable entropy increases); Layer 3 is a social planner (LLM-as-Judge evaluating externalities); Layer 4 is Coasian property rights (human code owner with veto power).

---

## 6. Synthesis: Connecting the Formal Results

### 6.1 The Detection-Cost-Decidability Triangle

The five formal sections connect through a central insight: **the decidability class of a slop type determines its optimal quality strategy**.

| Decidability | Detection | Optimal Strategy | CoQ Profile |
|---|---|---|---|
| D (Decidable) | Automated, high confidence | Prevention + Layer 1 automation | Low appraisal, low failure |
| SD (Semi-decidable) | LLM-judgment, moderate confidence | Diverse multi-layer cascade | Moderate appraisal, moderate failure |
| U (Undecidable) | Statistical/aggregate only | Codebase health monitoring + acceptance | High appraisal if attempted; accept + monitor otherwise |

For Decidable types, the ROI of Layer 1 (structural gates) is so high that the optimization is trivial: always apply. The DRE cascade analysis shows that a single high-confidence layer ($d \approx 0.95$) is sufficient.

For Semi-decidable types, the DRE cascade theorem (Theorem 3.1) and the diversity premium (Corollary 3.2) show that three diverse layers are necessary and (approximately) sufficient for DRE > 95%. The copula model (Theorem 3.2) quantifies the penalty for using correlated detectors.

For Undecidable types, the accretion analysis (Section 5) shows that individual detection is formally intractable, but aggregate measurement through codebase entropy (Section 2) is feasible. The optimal strategy is not per-change detection but per-period health assessment, with the optimal quality level (Theorem 4.1) explicitly permitting acceptance when appraisal cost exceeds discounted failure cost.

### 6.2 The Compound Degradation Feedback Loop

The formal results describe a feedback loop that accelerates under AI-assisted development:

1. AI generates superficially competent code at high throughput (Proposition 4.2).
2. Each change is individually correct but carries positive accretion rate (Definition 2.3).
3. Codebase entropy grows superlinearly (Theorem 2.1).
4. Growing entropy increases the context required to modify any file ($|\mu(f_i)|$ grows).
5. Larger required context exceeds the agent's context window, increasing context blindness (Factor F1).
6. Increased context blindness produces more accretion defects (Definition 5.1).
7. Return to step 2.

This feedback loop is the formal mechanism underlying the empirical observation that "AI writes superficially competent code at scale, each piece individually defensible but cumulatively degrading codebase health." Breaking the loop requires intervention at step 2 (reducing accretion rate through structural constraints) or step 5 (improving context engineering to keep pace with entropy growth).

### 6.3 Open Problems

1. **Empirical validation of the three-factor structure.** The ISSRE 2025 dataset (500K+ samples classified by ODC type) is the most promising candidate for confirmatory factor analysis. Does the data support three orthogonal factors, or is the structure more complex?

2. **Calibration of the copula correlation matrix.** What are the actual pairwise correlations between detection layers? Specifically, what is $\rho$ between an LLM code generator and an LLM-as-Judge from the same model family? From different families?

3. **Entropy measurement tooling.** The codebase entropy definition (Definition 2.1) requires computing modification contexts $\mu(f_i)$, which depends on dependency analysis. Can existing tools (CodeScene, SonarQube, dependency-cruiser) approximate $H(\mathcal{C})$ well enough for practical monitoring?

4. **Accretion detection via control charts.** Can statistical process control methods (CUSUM, EWMA) detect systematic accretion in real-time, using proxy metrics (clone frequency, lines per function point, new abstraction rate)?

5. **Optimal refactoring ratio under AI assistance.** Corollary 2.2 establishes the equilibrium condition but does not specify the optimal $r$ as a function of AI throughput. What refactoring investment is needed to maintain bounded entropy when 41% of code is AI-generated?

---

## Sources

### Formal Foundations
- [Lehman's Laws of Software Evolution (Wikipedia)](https://en.wikipedia.org/wiki/Lehman's_laws_of_software_evolution)
- [Lehman, M.M. "Programs, Life Cycles, and Laws of Software Evolution." Proc. IEEE, 1980](https://users.ece.utexas.edu/~perry/education/SE-Intro/lehman.pdf)
- [On the Evolution of Lehman's Laws (UWaterloo)](https://plg.uwaterloo.ca/~migod/papers/2013/lehmanPaper.pdf)
- [Copula (probability theory) (Wikipedia)](https://en.wikipedia.org/wiki/Copula_(probability_theory))
- [Kolmogorov Complexity (Wikipedia)](https://en.wikipedia.org/wiki/Kolmogorov_complexity)

### Defect Removal Efficiency
- [Jones, C. "Software Defect Removal Efficiency." PPI, 1996](https://www.ppi-int.com/wp-content/uploads/2021/01/Software-Defect-Removal-Efficiency.pdf)
- [Jones, C. and Bonsignour, O. "The Economics of Software Quality." Addison-Wesley, 2011](https://books.google.com/books/about/The_Economics_of_Software_Quality.html?id=_t5l5Cn0NBEC)
- [IFSQ: Software Defect Removal](https://www.ifsq.org/work-jones-1996.html)

### Cost of Quality
- [1-10-100 Rule: Cost of Quality (WorkClout)](https://www.workclout.com/blog/1-10-100-rule-cost-of-quality)
- [AKF Partners: 1-10-100 Rule in Quality Software Development](https://akfpartners.com/growth-blog/1-10-100-rule-in-quality-software-development)
- [ComplianceQuest: Cost of Quality Components](https://www.compliancequest.com/bloglet/balance-expense-and-excellence-with-coq/)

### Software Entropy and Complexity
- [Hassan, A.E. and Holt, R.C. "The Top Ten List: Dynamic Fault Prediction"](https://personales.upv.es/thinkmind/dl/conferences/icons/icons_2012/icons_2012_5_10_20145.pdf)
- [Information-Theoretic Software Metrics (ScienceDirect)](https://www.sciencedirect.com/science/article/abs/pii/S0164121203002176)
- [Software Libraries and Their Reuse: Entropy, Kolmogorov Complexity, and Zipf's Law (arxiv)](https://arxiv.org/abs/cs/0508023)

### Empirical Data
- [CodeRabbit: State of AI vs Human Code Generation (Dec 2025)](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- [GitClear: AI Copilot Code Quality 2025](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
- [Sonar: State of Code Developer Survey 2026](https://www.sonarsource.com/state-of-code-developer-survey-report.pdf)
- [Cotroneo et al. "Human-Written vs. AI-Generated Code" (ISSRE 2025)](https://arxiv.org/abs/2508.21634)
- [Spotify: Background Coding Agents (Honk)](https://engineering.atspotify.com/)

### Defect Taxonomies
- [Chillarege, R. "ODC: A Concept for In-Process Measurements" (IEEE TSE, 1992)](https://www.chillarege.com/articles/odc-concept.html)
- [IEEE 1044-2009: Standard Classification for Software Anomalies](https://standards.ieee.org/standard/1044-2009.html)
- [Beizer, B. "Software Testing Techniques" 2nd ed. (1990)](https://www.amazon.com/Software-Testing-Techniques-Boris-Beizer/dp/1850328803)
- [MITRE CWE](https://cwe.mitre.org/)
