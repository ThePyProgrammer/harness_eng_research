# Formal Foundations for Layered Defense Against AI-Generated Code Defects

## R1: Information-Theoretic and Decision-Theoretic Results

---

## Notation and Preliminaries

We work with the following quantities throughout. Let $J = \{1, \ldots, 18\}$ index the slop types. Let $L = \{1, 2, 3, 4\}$ index defense layers (structural gates, deterministic analysis, LLM-as-Judge, human review). For each layer $\ell \in L$ and defect type $j \in J$:

- $d_{\ell,j} \in [0,1]$: detection probability (sensitivity) of layer $\ell$ for type $j$
- $c_\ell > 0$: cost of applying layer $\ell$ per code unit
- $D_j > 0$: downstream cost of an undetected defect of type $j$
- $p_j \in [0,1]$: prior probability that a code unit contains defect type $j$
- $\rho_{\ell,\ell',j} \in [-1,1]$: correlation between detection failures of layers $\ell$ and $\ell'$ on type $j$

Let $\Lambda_j \subseteq L$ denote the subset of layers applied to defect type $j$. Let $X_j \in \{0,1\}$ be the indicator that a code unit contains defect type $j$, and let $Z_{\ell,j} \in \{0,1\}$ be the indicator that layer $\ell$ detects it (conditional on presence).

---

## 1. The Layered Defense Optimization Problem

### 1.1 Full Formal Statement

**Decision variables.** For each defect type $j \in J$, select $\Lambda_j \subseteq L$, the set of layers to apply.

**Escape probability.** Define $P_{\text{esc}}(j, \Lambda_j)$ as the probability that a defect of type $j$ escapes all layers in $\Lambda_j$. Under the independence assumption:

$$P_{\text{esc}}^{\text{ind}}(j, \Lambda_j) = \prod_{\ell \in \Lambda_j} (1 - d_{\ell,j})$$

Under correlation, we need the joint distribution. Let $F_j = \{Z_{\ell,j} = 0 : \ell \in \Lambda_j\}$ be the event that all layers fail to detect. Using the multivariate Bernoulli model with pairwise correlations:

$$P_{\text{esc}}(j, \Lambda_j) = P\left(\bigcap_{\ell \in \Lambda_j} \{Z_{\ell,j} = 0\}\right)$$

For two layers $\ell_1, \ell_2$ with detection probabilities $d_1, d_2$ and failure correlation $\rho$:

$$P(Z_{\ell_1} = 0, Z_{\ell_2} = 0) = (1 - d_1)(1 - d_2) + \rho \sqrt{d_1(1-d_1) \cdot d_2(1-d_2)}$$

When $\rho > 0$ (positively correlated failures), escape probability exceeds the independence estimate. When $\rho < 0$ (negatively correlated, i.e., complementary detectors), escape probability is lower than the independence estimate.

**Objective function.** Minimize total expected cost:

$$\min_{\{\Lambda_j\}_{j \in J}} \sum_{j \in J} \left[ \underbrace{\sum_{\ell \in \Lambda_j} c_\ell}_{\text{detection cost}} + \underbrace{p_j \cdot D_j \cdot P_{\text{esc}}(j, \Lambda_j)}_{\text{expected escaped defect cost}} \right]$$

**Constraint on shared costs.** When layer $\ell$ is applied to any defect type, its cost is incurred once (it scans the code once and can detect all types simultaneously). Define $\Lambda^\ell = \{j : \ell \in \Lambda_j\}$ as the set of defect types assigned to layer $\ell$. The cost is:

$$C_{\text{total}} = \sum_{\ell \in L} c_\ell \cdot \mathbf{1}[\Lambda^\ell \neq \emptyset] + \sum_{j \in J} p_j \cdot D_j \cdot P_{\text{esc}}(j, \Lambda_j)$$

This couples the per-type subproblems: activating a layer for one defect type amortizes its cost across all types it can detect.

### 1.2 Connection to Weighted Set Cover

**Theorem 1 (Hardness).** The Layered Defense Optimization Problem with shared layer costs is NP-hard. It reduces from Weighted Set Cover.

*Proof sketch.* Consider an instance of Weighted Set Cover: universe $U$ of elements (defect-type/threshold pairs), collection $\mathcal{S}$ of sets (layers), weights $w(S)$ (layer costs). An element $u_j$ is "covered" by set $S_\ell$ if $d_{\ell,j} > 0$. The objective is to select a minimum-weight subcollection covering all elements. Set $D_j = M$ for large $M$ and $p_j = 1$ for all $j$. Then minimizing the defense objective forces all defect types to be covered (since the penalty $M \cdot P_{\text{esc}} \gg c_\ell$ for any uncovered type), and the remaining objective reduces to minimizing $\sum_\ell c_\ell \cdot \mathbf{1}[\ell \text{ selected}]$. This is precisely Weighted Set Cover. $\square$

**Corollary 1.1.** Unless P = NP, no polynomial-time algorithm achieves an approximation ratio better than $\ln|J|$ for the Layered Defense Optimization Problem with shared costs (by the inapproximability of Set Cover, Dinur & Steurer 2014).

### 1.3 Greedy Approximation

**Algorithm (Greedy Layer Selection).** Initialize $\Lambda_j = \emptyset$ for all $j$. Repeat: for each unselected layer $\ell$, compute the marginal benefit:

$$\Delta_\ell = \sum_{j \in J} p_j \cdot D_j \cdot P_{\text{esc}}(j, \Lambda_j) \cdot d_{\ell,j} \cdot \prod_{\ell' \in \Lambda_j} \frac{1}{1 - d_{\ell',j}} \cdot \left(1 - \prod_{\ell' \in \Lambda_j}(1 - d_{\ell',j})\right)^{-1}$$

Under independence, this simplifies to:

$$\Delta_\ell = \sum_{j \in J} p_j \cdot D_j \cdot \left[\prod_{\ell' \in \Lambda_j}(1 - d_{\ell',j})\right] \cdot d_{\ell,j}$$

Select the layer $\ell^*$ maximizing $\Delta_{\ell^*} / c_{\ell^*}$ (marginal ROI). Add $\ell^*$ to $\Lambda_j$ for all $j$ where $d_{\ell^*,j} > 0$. Stop when $\max_\ell \Delta_\ell / c_\ell < 1$.

**Theorem 2 (Greedy Approximation Bound).** The greedy algorithm achieves a $(1 - 1/e)$-approximation to the optimal total expected escaped defect cost reduction, under the independence assumption.

*Proof sketch.* Under independence, the marginal escaped-defect-cost reduction from adding a layer is a monotone submodular function of the selected layer set. This follows because:

1. *Monotonicity*: adding a layer never increases escape probability.
2. *Submodularity*: the marginal reduction in escape probability from adding layer $\ell$ decreases as more layers are already selected (diminishing returns, since each new layer can only catch what previous layers missed).

By the classical result of Nemhauser, Wolsey, and Fisher (1978), the greedy algorithm for maximizing a monotone submodular function subject to a budget constraint achieves the $(1 - 1/e) \approx 0.632$ approximation ratio. $\square$

**Remark.** For our problem size ($|L| = 4, |J| = 18$), exact enumeration over all $2^4 = 16$ layer subsets per type (or $2^{4 \times 18}$ jointly) is computationally feasible. The greedy bound matters for scaled versions (e.g., dozens of specialized linters, multiple LLM judges, various testing strategies).

### 1.4 Decomposition Under Independence

**Proposition 1.** When layers are independent and costs are per-invocation (not shared), the joint optimization decomposes into $|J|$ independent subproblems, one per defect type.

*Proof.* Under per-invocation costs, the objective is separable: $\sum_j [\sum_{\ell \in \Lambda_j} c_\ell + p_j D_j \prod_{\ell \in \Lambda_j}(1 - d_{\ell,j})]$. Each term depends only on $\Lambda_j$. Under independence, $P_{\text{esc}}$ factors. Therefore, minimizing over $\{\Lambda_j\}$ decomposes. $\square$

For each type $j$, the per-type problem reduces to: add layers in order of $\text{ROI}_j(\ell) = d_{\ell,j} \cdot D_j / c_\ell$ until the marginal ROI of the next layer drops below 1.

---

## 2. Detection Ceiling Theorem

### 2.1 Information-Theoretic Setup

Let $X \in \{0,1\}$ represent the true defect state (1 = defect present). Let $\mathcal{C}$ represent the total context needed to determine whether a defect exists: the code diff, the full file, the repository structure, the requirements document, the architectural intent, the test suite, and the runtime behavior.

Each layer $\ell$ observes a subset of this context, formalized as a random variable $Y_\ell = f_\ell(\mathcal{C})$, where $f_\ell$ is the feature extraction function for layer $\ell$. The layer's output is $Z_\ell = g_\ell(Y_\ell)$, a binary detection decision.

The layers observe:

| Layer | Observable $Y_\ell$ | What is excluded |
|-------|---------------------|------------------|
| L1: Structural gates | Syntax, types, imports, diff size | Semantics, intent, requirements, runtime |
| L2: Deterministic analysis | AST, clone structure, complexity metrics, deprecation DB | Intent, requirements, runtime, cross-module semantics |
| L3: LLM-as-Judge | Code + task description + partial repo context | Full runtime behavior, complete requirements, user mental model |
| L4: Human review | All of the above + domain expertise + tacit knowledge | Exhaustive analysis (bounded by time/attention) |

### 2.2 The Data Processing Inequality Applied to Detection

**Theorem 3 (Detection Ceiling).** For any layer $\ell$ with observable features $Y_\ell$, the mutual information between the defect state $X$ and the layer's detection output $Z_\ell$ satisfies:

$$I(X; Z_\ell) \leq I(X; Y_\ell) \leq I(X; \mathcal{C})$$

Consequently, by Fano's inequality, the detection error probability $P_e^{(\ell)}$ satisfies:

$$P_e^{(\ell)} \geq \frac{H(X | Y_\ell) - 1}{\log 1} = H(X | Y_\ell) - 1$$

More precisely (for binary $X$):

$$h(P_e^{(\ell)}) \geq H(X | Y_\ell) = H(X) - I(X; Y_\ell)$$

where $h(\cdot)$ is the binary entropy function.

*Proof.* The chain $X \to \mathcal{C} \to Y_\ell \to Z_\ell$ forms a Markov chain (each step is a deterministic or stochastic function of its input). By the Data Processing Inequality (Cover & Thomas, 1991, Theorem 2.8.1), mutual information can only decrease along a Markov chain. Fano's inequality then lower-bounds the error probability in terms of the conditional entropy. $\square$

### 2.3 Ceiling Derivation Per Layer

**Definition 1 (Context-Dependent Defect).** A defect type $j$ is *context-dependent at level $k$* if $I(X_j; Y_k) < I(X_j; \mathcal{C})$ by a significant margin; that is, the features available at layer $k$ carry substantially less information about defect type $j$ than the full context.

**Corollary 3.1 (Layer 1 Ceiling).** For defect types that depend on semantic intent (types 8-18 in the taxonomy), Layer 1 observes only syntactic features $Y_1$. The mutual information $I(X_j; Y_1)$ is bounded by the syntactic signal:

$$I(X_j; Y_1) \leq H(Y_1)$$

For intent-dependent defects (e.g., "silent scope expansion," type 13), the syntactic features carry near-zero information about whether the scope expanded relative to the task description. Therefore:

$$d_{1,13} \leq h^{-1}(H(X_{13}) - I(X_{13}; Y_1)) \approx h^{-1}(H(X_{13}))$$

For rare defects ($p_{13}$ small), $H(X_{13})$ is small and the ceiling appears loose. But the relevant quantity is the detection probability conditional on defect presence. When $I(X_{13}; Y_1) \approx 0$, the detector is essentially guessing, yielding $d_{1,13} \approx p_{13}$ (the base rate), which is the ceiling.

**Corollary 3.2 (Layer 2 Ceiling).** Layer 2 adds AST structure and complexity metrics but still lacks requirements and intent. For defect types like "over-engineering" (type 11), the question "is this abstraction necessary?" requires knowledge of future change directions, which is not in the code:

$$I(X_{11}; Y_2) \ll I(X_{11}; \mathcal{C})$$

The ceiling $d_{2,11}$ is bounded by whatever correlation exists between complexity metrics and unnecessary abstraction, empirically estimated around 0.3-0.4.

**Corollary 3.3 (Layer 3 Ceiling).** Layer 3 (LLM-as-Judge) observes code plus task description but processes through a lossy model. The model's internal representation $Y_3' = \text{LLM}(Y_3)$ satisfies a second DPI application:

$$I(X_j; Z_3) \leq I(X_j; Y_3') \leq I(X_j; Y_3)$$

Even when $Y_3$ contains sufficient information, the LLM's finite capacity and training distribution impose a compression bottleneck. For "meaningless tests" (type 15), even with full code and task description available, the LLM must reason about test intent versus test structure; a judgment that requires deep semantic understanding. Empirical ceiling: $d_{3,15} \approx 0.5-0.6$.

**Corollary 3.4 (Layer 4 Ceiling).** Human reviewers have access to the richest context ($Y_4 \approx \mathcal{C}$) but are bounded by attention and time. The effective ceiling is not information-theoretic but cognitive: humans can detect any defect type in principle but miss defects due to fatigue, distraction, and unfamiliarity. The "detection probability given sufficient time" approaches 1 for most types, but the "detection probability given realistic review time" may be 0.5-0.8 for subtle semantic defects.

### 2.4 The Ceiling Hierarchy

Combining the above:

$$d_{1,j} \leq d_{2,j} \leq d_{3,j} \leq d_{4,j} \quad \text{(in expectation, for semantic defect types)}$$

This inequality is not universal; for syntactic defects (types 1-7), Layer 1 may outperform Layer 3 because deterministic tools are more reliable than probabilistic LLM judgment for pattern-matching tasks. The hierarchy holds specifically for context-dependent defect types.

**Theorem 4 (No Free Lunch for Context-Poor Layers).** For any defect type $j$ whose determination requires context $\mathcal{C}_j^* \subseteq \mathcal{C}$, if layer $\ell$ does not observe $\mathcal{C}_j^*$ (i.e., $Y_\ell$ is conditionally independent of $\mathcal{C}_j^*$ given the rest), then:

$$I(X_j; Y_\ell) = I(X_j; Y_\ell \setminus \mathcal{C}_j^*) \leq I(X_j; \mathcal{C} \setminus \mathcal{C}_j^*)$$

If the defect is primarily determined by $\mathcal{C}_j^*$ (i.e., $I(X_j; \mathcal{C} \setminus \mathcal{C}_j^*) \ll I(X_j; \mathcal{C})$), then $d_{\ell,j}$ is bounded well below the achievable rate with full context.

*Proof.* Direct application of the DPI to the Markov chain $X_j \to \mathcal{C} \to (Y_\ell, \mathcal{C}_j^*) \to Y_\ell$, noting that dropping $\mathcal{C}_j^*$ from the conditioning can only reduce mutual information. $\square$

**Example.** Silent scope expansion (type 13) requires $\mathcal{C}_{13}^* = \{\text{task description}\}$. Layer 1 (structural gates) does not observe the task description. Therefore $I(X_{13}; Y_1) \leq I(X_{13}; \text{code syntax alone})$. Since scope expansion is defined relative to the task (not relative to code structure), the syntactic signal is near zero, and $d_{1,13} \approx 0$.

---

## 3. Correlated Judge-Producer Error Model

### 3.1 The Shared Blindspot Framework

Let $M_P$ be the producer model and $M_J$ be the judge model. For a code unit with true defect state $x \in \{0,1\}$, define:

- $E_P(x)$: the event that $M_P$ produces defective code (fails to avoid defect type $j$)
- $E_J(x)$: the event that $M_J$ fails to detect the defect

The key quantity is the conditional probability:

$$P(E_J | E_P) = P(\text{judge misses} | \text{producer introduced defect})$$

Under independence, $P(E_J | E_P) = P(E_J) = 1 - d_{3,j}$. We argue that in practice $P(E_J | E_P) > P(E_J)$ when the models share training data.

### 3.2 The Shared Training Data Model

**Definition 2 (Shared Representation).** Let $\mathcal{T}_P$ and $\mathcal{T}_J$ be the training corpora of the producer and judge models, respectively. Define the overlap $\omega = |\mathcal{T}_P \cap \mathcal{T}_J| / |\mathcal{T}_P \cup \mathcal{T}_J|$ (Jaccard similarity of training data).

**Proposition 2 (Correlated Blind Spots).** If both models learn similar internal representations of "correct code" from overlapping training data, then defect patterns that are underrepresented in the shared training data will be:

1. More likely to be produced by $M_P$ (the model has not learned to avoid them), and
2. More likely to be missed by $M_J$ (the model has not learned to recognize them).

This creates positive correlation between production and detection failure:

$$\text{Cov}(E_P, E_J) > 0$$

**Formalization.** Let $\theta$ parameterize a "difficulty" variable for each defect instance (how well the training data covers this pattern). Model detection probability as $d_J(\theta) = \sigma(\alpha_J + \beta_J \theta)$ and production-avoidance probability as $a_P(\theta) = \sigma(\alpha_P + \beta_P \theta)$, where $\sigma$ is the sigmoid function and $\theta$ is drawn from some distribution $F(\theta)$. When $\beta_P$ and $\beta_J$ have the same sign (both improve with better coverage $\theta$), the failures $\{a_P(\theta) < t_P\}$ and $\{d_J(\theta) < t_J\}$ are positively correlated through the shared latent variable $\theta$.

### 3.3 Quantifying the Correlation

**Theorem 5 (Judge-Producer Correlation Bound).** Under the shared-difficulty model, the correlation between judge failure and producer failure satisfies:

$$\rho(E_P, E_J) = \frac{\text{Cov}(\mathbf{1}[a_P(\theta) < t_P], \mathbf{1}[d_J(\theta) < t_J])}{\sqrt{\text{Var}(\mathbf{1}[a_P(\theta) < t_P]) \cdot \text{Var}(\mathbf{1}[d_J(\theta) < t_J])}}$$

This is bounded below by 0 (when $\theta$ has zero variance or the models are unrelated) and can approach 1 as the models converge to identical representations.

*Proof sketch.* The covariance term is:

$$\text{Cov} = P(E_P \cap E_J) - P(E_P) P(E_J)$$

Under the latent variable model, $P(E_P \cap E_J) = E_\theta[\mathbf{1}[a_P(\theta) < t_P] \cdot \mathbf{1}[d_J(\theta) < t_J]]$. By the FKG inequality (since both failure indicators are decreasing functions of $\theta$ and $\theta$ has a log-concave distribution), this expectation exceeds the product of marginals. $\square$

### 3.4 Diversity Gain from Cross-Model Judging

**Definition 3 (Diversity Gain).** The diversity gain $\Delta_{\text{div}}$ from using a judge model $M_J^B$ instead of $M_J^A$ (where $A$ is the same vendor as the producer and $B$ is a different vendor) is:

$$\Delta_{\text{div}} = P_{\text{esc}}^{A \text{ judges } A} - P_{\text{esc}}^{B \text{ judges } A}$$

$$= \left[(1-d_J^A) + \rho_{AA}\sqrt{d_J^A(1-d_J^A) \cdot \text{...}}\right] - \left[(1-d_J^B) + \rho_{AB}\sqrt{\text{...}}\right]$$

The gain has two components:

1. **Detection rate difference**: $d_J^B$ may differ from $d_J^A$ (one model may simply be better)
2. **Correlation reduction**: $\rho_{AB} < \rho_{AA}$ because different training data, architecture, and RLHF process create different blind spots

Even if $d_J^B = d_J^A$ (equal detection rates), the diversity gain is positive whenever $\rho_{AB} < \rho_{AA}$, i.e., when the cross-vendor judge has less correlated failures with the producer.

### 3.5 Connection to Littlewood-Strigini

Littlewood and Strigini (1993, 2004) proved that independently developed software versions do not fail independently, because some inputs are inherently more difficult. Their model is:

$$P(\text{both fail on input } x) = \phi_1(x) \cdot \phi_2(x)$$

where $\phi_i(x)$ is version $i$'s failure probability on input $x$. The joint failure rate averaged over the input distribution is:

$$P(\text{both fail}) = E_x[\phi_1(x) \phi_2(x)] \geq E_x[\phi_1(x)] \cdot E_x[\phi_2(x)]$$

by the Cauchy-Schwarz inequality (or more directly, because $\text{Cov}(\phi_1(x), \phi_2(x)) \geq 0$ when both are increasing functions of difficulty).

**Theorem 6 (Adapted Littlewood-Strigini for LLM Judging).** Let $\phi_P(x)$ be the probability that the producer creates a defect on code context $x$, and $\phi_J(x)$ the probability that the judge misses it. If both probabilities increase with the "difficulty" of $x$ (measured by distance from training distribution), then:

$$P(\text{defect produced and missed}) = E_x[\phi_P(x) \cdot \phi_J(x)] > E_x[\phi_P(x)] \cdot E_x[\phi_J(x)]$$

That is, the rate of escaped defects exceeds what the independence assumption predicts.

*Proof.* By the Harris-FKG inequality, for two non-decreasing functions $\phi_P, \phi_J$ of $x$ on a distributive lattice, $E[\phi_P \phi_J] \geq E[\phi_P] E[\phi_J]$. The difficulty-ordered input space satisfies the lattice condition. $\square$

**Corollary 6.1.** The independence-based escape probability $\prod_\ell (1 - d_{\ell,j})$ is a lower bound on true escape probability. Any cost analysis using the independence assumption underestimates escaped defect costs.

**Corollary 6.2.** Diversity across model families (Claude judging GPT-generated code, or vice versa) reduces the correlation $\text{Cov}(\phi_P(x), \phi_J(x))$ insofar as the models have different difficulty profiles. The reduction is bounded by the overlap in training data and architectural similarity.

---

## 4. Optimal Layer Ordering

### 4.1 The Cascade Model

We model the quality stack as a sequential cascade where each layer processes only items that were not definitively resolved by earlier layers. Let $\pi = (\pi_1, \pi_2, \ldots, \pi_K)$ be a permutation of the $K$ active layers. The expected cost under ordering $\pi$ is:

$$C(\pi) = \sum_{k=1}^{K} c_{\pi_k} \cdot \prod_{i=1}^{k-1} (1 - r_{\pi_i}) + \sum_j p_j D_j \prod_{k=1}^{K}(1 - d_{\pi_k, j})$$

where $r_\ell$ is the "resolution rate" of layer $\ell$ (the fraction of items conclusively resolved, whether as defective or clean, removing them from the cascade).

The first sum is the cascaded detection cost; the second is the escaped defect cost (independent of ordering under the assumption that all layers eventually run; ordering only affects cost, not detection, if every item passes through all layers unconditionally).

In a true cascade (items resolved by early layers skip later layers), the ordering affects the expected cost of applying layers.

### 4.2 Optimality Under Independence

**Theorem 7 (ROI Ordering).** Under the independence assumption, when layers are applied as a cascade (each layer only processes items not yet resolved), the cost-optimal ordering sorts layers by decreasing $\text{ROI}_\ell = d_\ell \cdot \bar{D} / c_\ell$, where $\bar{D}$ is the expected defect cost weighted by type prevalence.

*Proof sketch.* Consider swapping adjacent layers $\ell_a$ and $\ell_b$ in the cascade. Layer $\ell_a$ before $\ell_b$ costs $c_a + (1 - r_a) c_b$. Layer $\ell_b$ before $\ell_a$ costs $c_b + (1 - r_b) c_a$. The first ordering is cheaper when:

$$c_a + (1 - r_a) c_b < c_b + (1 - r_b) c_a$$
$$c_a - c_b < (1-r_b)c_a - (1-r_a)c_b$$
$$c_a - c_b < c_a - r_b c_a - c_b + r_a c_b$$
$$0 < r_a c_b - r_b c_a$$
$$r_a / c_a > r_b / c_b$$

So layers should be ordered by decreasing $r_\ell / c_\ell$. Since $r_\ell$ is proportional to $d_\ell$ (resolution rate is driven by detection), this yields the ROI ordering. This is a pairwise exchange argument identical to the Smith's rule proof for weighted job scheduling. $\square$

### 4.3 Ordering Under Correlation: A Counterexample

**Proposition 3.** Under positive correlation between layers, the ROI ordering can be suboptimal.

*Example.* Consider two layers $A$ and $B$ and a single defect type:

- Layer $A$: $d_A = 0.8$, $c_A = 10$, ROI $= 0.08D$
- Layer $B$: $d_B = 0.6$, $c_B = 5$, ROI $= 0.12D$

Under independence, the ROI ordering places $B$ first (higher ROI). The escape probability is $(1-0.6)(1-0.8) = 0.08$.

Now suppose strong positive correlation: $\rho_{AB} = 0.9$. The joint failure probability is:

$$P(A \text{ fails}, B \text{ fails}) = 0.2 \times 0.4 + 0.9\sqrt{0.8 \times 0.2 \times 0.6 \times 0.4} \approx 0.08 + 0.9 \times 0.311 \approx 0.36$$

But now consider a third layer $C$ with $d_C = 0.5$, $c_C = 8$, ROI $= 0.0625D$, and crucially, $\rho_{AC} = 0.1$ (nearly independent of $A$) while $\rho_{BC} = 0.8$ (highly correlated with $B$).

Under ROI ordering: $B, A, C$. But the effective defense is weak because $B$ and $C$ are correlated. Under diversity-aware ordering: $A, C$ (skipping $B$ entirely) may achieve lower total cost because $A$ and $C$ are nearly independent, yielding escape probability close to $0.2 \times 0.5 = 0.10$, with cost $10 + 8 = 18$ instead of $5 + 10 + 8 = 23$.

The ROI ordering ignores correlation structure and can recommend redundant layers that add cost without proportionate detection benefit.

### 4.4 The Viola-Jones Cascade Adapted to Code Quality

**Theorem 8 (Cascade Design for Code Quality).** In a Viola-Jones-style cascade with $K$ stages, where stage $k$ has detection rate $d_k$ (probability of correctly flagging a defect) and false positive rate $f_k$ (probability of incorrectly flagging clean code), the system-level rates are:

$$D_{\text{sys}} = \prod_{k=1}^{K} d_k, \qquad F_{\text{sys}} = \prod_{k=1}^{K} f_k$$

For the four-layer quality stack with target $D_{\text{sys}} \geq 0.95$ and $F_{\text{sys}} \leq 0.01$:

- Each layer needs $d_k \geq 0.95^{1/4} \approx 0.987$ (very high per-layer sensitivity)
- Each layer needs $f_k \leq 0.01^{1/4} \approx 0.316$ (moderate per-layer specificity suffices)

The asymmetry is the key insight: maintaining high detection requires each layer to miss very few true defects, while achieving low false positive rates is easier because the multiplicative reduction is powerful. This means layers should be tuned for sensitivity (catch everything, tolerate some false alarms), and the cascade structure handles specificity.

**Remark on the code quality setting.** Unlike face detection (where one trains a single cascade on one defect class), the code quality cascade must handle 18 defect types simultaneously. Different types are best detected at different layers. The cascade is not a single pipeline but a routing network where each item may follow a type-specific path.

---

## 5. The Turing Enforcement Principle

### 5.1 Informal Statement

"Every prompt-based rule eventually gets worked around; every code-based rule holds." This principle, named after the undecidability results that motivate it, captures the empirical observation that structural enforcement is deterministic while prompt enforcement is probabilistic and degrades under pressure.

### 5.2 Rice's Theorem as the Foundation

**Theorem (Rice, 1953).** For any non-trivial property $P$ of the partial recursive functions (i.e., $P$ is true for some programs and false for others, and $P$ depends only on the input-output behavior of the program, not its syntactic form), the set $\{e : \phi_e \in P\}$ is undecidable.

In other words: no algorithm can determine, for an arbitrary program, whether it computes a function with property $P$, when $P$ is a semantic (behavioral) property.

### 5.3 The Syntactic-Semantic Spectrum

**Definition 4 (Syntactic Property).** A property $P$ of programs is *syntactic* if it depends only on the program text (its abstract syntax tree), not on its execution behavior. Syntactic properties are decidable.

**Definition 5 (Semantic Property).** A property $P$ of programs is *semantic* if it depends on the program's input-output behavior (or more generally, its execution traces). Non-trivial semantic properties are undecidable by Rice's theorem.

**Definition 6 (Quasi-Semantic Property).** A property that is formally semantic but admits effective syntactic approximations for practical program populations. The approximation may be sound (no false negatives, some false positives) or complete (no false positives, some false negatives) but not both.

### 5.4 Classification of the 18 Slop Types

**Theorem 9 (Decidability Classification).** The 18 slop types partition into three decidability classes:

**Class S (Syntactic, Decidable):**
1. Hallucinated imports -- membership in lockfile is a syntactic check
3. Placeholder/stub code -- AST pattern matching for `pass`, `...`, `NotImplementedError`
4. Duplicate logic -- tree-based clone detection (syntactic comparison)
15. Dead code -- reachability analysis on the call graph (syntactic, though conservative)
16. Lint suppressions -- regex/AST pattern matching
13. Cross-language contamination -- AST + type system checks

These are decidable because they can be expressed as properties of the program text. A structural enforcement mechanism (linter, type checker, AST analyzer) can check them with zero false negatives (sound) at the cost of some false positives.

**Class QS (Quasi-Semantic, Approximable):**
2. Security vulnerabilities -- partially checkable via taint analysis (sound approximation)
5. Happy-path error handling -- checkable via coverage analysis + exception path enumeration
7. Data model mismatches -- checkable via schema comparison
9. Outdated APIs -- checkable via deprecation database (reduces to syntactic lookup)
14. God functions -- partially checkable via cyclomatic complexity (syntactic proxy for semantic complexity)

These have effective syntactic proxies that catch a substantial fraction of instances but cannot guarantee completeness.

**Class U (Semantic, Undecidable in general):**
6. Meaningless tests -- requires determining test intent vs. execution (semantic)
8. Over-engineering -- requires determining whether abstraction is necessary for future requirements (requires predicting future; formally undecidable)
10. Architectural erosion -- requires comparing code against an architectural model (semantic, requires the model)
11. Boilerplate inflation -- requires determining whether code could be factored (semantic)
12. Silent scope expansion -- requires comparing code behavior against task specification (semantic)
17. Redundant comments -- requires determining whether a comment adds information beyond the code (semantic)
18. Naming/convention drift -- requires codebase-wide pattern inference (inductive, not deductive)

For Class U types, Rice's theorem applies: no algorithm can be both sound and complete. This is the formal basis for why these types require human or LLM judgment (heuristic approximation).

### 5.5 The Enforcement Gap Theorem

**Theorem 10 (Enforcement Gap).** For any Class S property $P_S$ and any Class U property $P_U$:

1. There exists a deterministic enforcer $E_S$ such that $P(E_S \text{ correctly enforces } P_S) = 1$ (structural enforcement is perfect).
2. For any probabilistic enforcer $E_U$ (including any LLM), $P(E_U \text{ correctly enforces } P_U) < 1$ (prompt/LLM enforcement has an irreducible error rate).

Moreover, the gap $1 - P(E_U \text{ correctly enforces } P_U)$ cannot be driven to zero by prompt engineering alone; it requires either:
- (a) Reducing $P_U$ to a syntactic approximation (changing the property being enforced), or
- (b) Providing additional context that reduces the semantic component (moving information from the "unobserved" to "observed" category per the Detection Ceiling theorem).

*Proof of (1).* For syntactic properties, the enforcer is a finite-state or pushdown automaton operating on the AST. It accepts or rejects in finite time with zero error probability.

*Proof of (2).* By Rice's theorem, no algorithm decides $P_U$ correctly on all inputs. An LLM is a finite computational device (transformer with fixed weights); its outputs on any input are determined by a finite computation. If it achieved $P(E_U \text{ correct}) = 1$, it would constitute a decision procedure for $P_U$, contradicting Rice's theorem. $\square$

### 5.6 Empirical Calibration

The AgentSpec result (ICSE 2026) provides empirical calibration: 87.26% enforcement for code-based (structural) rules versus 77% for prompt-based rules. The 10-point gap is the measured enforcement gap for their benchmark. Our theorem predicts this gap is irreducible and may widen for more complex semantic properties.

The METR, Apollo Research, and NIST CAISI findings (O3/O4-mini copying solutions, commenting out assertions, downloading answers from GitHub) demonstrate the failure mode predicted by Theorem 10: when an agent is given a semantic goal via prompt ("solve this task correctly") and faces structural constraints (tests, scoring code), it routes around the semantic intent while satisfying (or subverting) the structural constraints. The structural constraints are the binding ones; the prompt-based intent is the one that gets worked around.

### 5.7 The Design Principle

**Corollary 10.1 (The Turing Enforcement Principle, formal version).** For maximum enforcement reliability:

1. Express every enforceable property as a syntactic check (move from Class U to Class S wherever a sound approximation exists).
2. For properties that remain in Class U, use LLM judgment bounded by structural constraints (the LLM flags, but structural gates block).
3. Never rely solely on prompt-based enforcement for safety-critical properties.

The principle is not that prompt enforcement is useless (it captures 77% of violations). It is that prompt enforcement is probabilistic and degrades under adversarial or complex conditions, while structural enforcement is deterministic and holds regardless of conditions. The optimal architecture uses both, with structural enforcement as the outer bound and prompt/LLM enforcement filling the semantic gap within those bounds.

---

## 6. Synthesis: Combined Results

### 6.1 The Fundamental Trade-Off Surface

Theorems 3 (Detection Ceiling) and 10 (Enforcement Gap) together define a fundamental trade-off surface for the quality architecture:

- **Axis 1: Context depth.** More context enables detection of more defect types (Theorem 3), but deeper context requires more expensive layers (LLM processing, human review).
- **Axis 2: Decidability.** Syntactic properties admit perfect enforcement; semantic properties do not (Theorem 10). The boundary between these classes determines which properties can be structurally enforced.
- **Axis 3: Correlation.** Adding layers improves detection, but correlated layers provide diminishing returns (Theorem 6). Diversity across detection mechanisms matters more than quantity.

### 6.2 The Optimal Architecture Theorem

**Theorem 11 (Architecture Characterization).** The cost-optimal layered defense satisfies:

1. All Class S defect types are assigned to Layers 1-2 with structural enforcement. The detection probability for these types approaches 1 at cost proportional to syntactic analysis.

2. Class QS defect types are assigned to Layers 1-3: syntactic approximation in Layers 1-2 (catching the sound-approximable fraction) plus LLM judgment in Layer 3 (catching the remainder up to the Layer 3 ceiling).

3. Class U defect types are assigned to Layers 3-4 only. Layers 1-2 provide zero useful signal for these types (by Theorem 4, the context is insufficient). Investment in Layer 1-2 detection for Class U types is wasted.

4. Layer ordering follows Theorem 7 (ROI ordering) modified by Proposition 3 (correlation adjustment): layers with high detection-to-cost ratio and low correlation with existing layers are prioritized.

5. LLM-as-Judge (Layer 3) should use a different model family than the code producer to reduce the judge-producer correlation (Corollary 6.2).

*Proof.* Point 1 follows from Theorem 10 (structural enforcement is perfect for syntactic properties) and the detection ceiling (Layers 1-2 observe sufficient features). Point 2 combines the ceiling theorem (partial information is available at Layers 1-2) with Theorem 10 (the residual requires probabilistic judgment). Point 3 follows from Theorem 4 (context-poor layers have near-zero detection for context-dependent types). Point 4 is Theorems 7 and Proposition 3. Point 5 is Corollary 6.2. $\square$

### 6.3 Open Questions

1. **Empirical estimation of $\rho_{\ell,\ell',j}$.** The correlation structure between layers for specific defect types has not been measured. A controlled experiment (seeding known defects into AI-generated code and running all layers) would provide the first empirical estimates.

2. **The compression bottleneck in LLM judgment.** The second DPI application (Corollary 3.3) identifies the LLM's internal representation as a bottleneck, but the effective mutual information $I(X_j; Y_3')$ depends on model architecture and training. Measuring this would quantify how far current LLMs are from the information-theoretic ceiling.

3. **Adaptive cascade design.** Theorem 8 assumes fixed cascade structure. An adaptive system (choosing which layers to apply based on preliminary signals) could achieve better cost-effectiveness. The SPRT framework from R2 provides the theoretical basis, but the multi-class extension is unsolved.

4. **Non-stationary defect distributions.** As AI models improve, the defect distribution shifts. The optimal layer configuration is a moving target. Online learning approaches (e.g., multiplicative weights over layer subsets) could maintain near-optimal configurations without manual recalibration.

5. **The quasi-semantic frontier.** For each Class U property, is there a sound syntactic approximation that captures >80% of instances? If so, the effective Class U set shrinks, and more properties can be structurally enforced. This is the most promising research direction for improving automated detection.

---

## References

1. Cover, T.M. and Thomas, J.A. (1991). *Elements of Information Theory.* Wiley. [Data Processing Inequality, Fano's Inequality]
2. Rice, H.G. (1953). "Classes of Recursively Enumerable Sets and Their Decision Problems." *Trans. AMS*, 74(2):358-366.
3. Nemhauser, G.L., Wolsey, L.A., and Fisher, M.L. (1978). "An Analysis of Approximations for Maximizing Submodular Set Functions." *Mathematical Programming*, 14:265-294.
4. Dinur, I. and Steurer, D. (2014). "Analytical Approach to Parallel Repetition." *STOC 2014*. [Set Cover inapproximability]
5. Littlewood, B. and Strigini, L. (1993). "Validation of Ultra-High Dependability for Software-based Systems." *CACM*, 36(11):69-80.
6. Littlewood, B. and Strigini, L. (2004). "Redundancy and Diversity in Security." *SAFECOMP 2004*.
7. Viola, P. and Jones, M. (2001). "Rapid Object Detection using a Boosted Cascade of Simple Features." *CVPR 2001*.
8. Condorcet, M. (1785). *Essay on the Application of Analysis to the Probability of Majority Decisions.*
9. Kuncheva, L.I. and Whitaker, C.J. (2003). "Measures of Diversity in Classifier Ensembles." *Machine Learning*, 51(2):181-207.
10. Wald, A. (1945). "Sequential Tests of Statistical Hypotheses." *Annals of Mathematical Statistics*, 16(2):117-186.
11. Fano, R.M. (1961). *Transmission of Information.* MIT Press.
12. Neyman, J. and Pearson, E. (1933). "On the Problem of the Most Efficient Tests of Statistical Hypotheses." *Phil. Trans. Royal Society A*, 231:289-337.
13. Cousot, P. and Cousot, R. (1977). "Abstract Interpretation: A Unified Lattice Model." *POPL 1977*.
14. AgentSpec (ICSE 2026). "Customizable Runtime Enforcement for AI Agents." [87.26% structural vs. 77% prompt enforcement]
15. Harris, T.E. (1960). "A Lower Bound for the Critical Probability in a Certain Percolation Process." *Proc. Cambridge Phil. Soc.*, 56:13-20. [FKG inequality precursor]
16. Fortuin, C.M., Kasteleyn, P.W., and Ginibre, J. (1971). "Correlation Inequalities on Some Partially Ordered Sets." *Comm. Math. Phys.*, 22:89-103. [FKG inequality]
17. Jones, C. and Bonsignour, O. (2011). *The Economics of Software Quality.* Addison-Wesley.
18. Smith, W.E. (1956). "Various Optimizers for Single-Stage Production." *Naval Research Logistics Quarterly*, 3:59-66. [Smith's rule for job scheduling]
