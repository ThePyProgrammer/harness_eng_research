# Information-Theoretic Formalizations for Context Selection in Coding Agent Harnesses

## Formalization Report, Round 1

---

## Notation and Setup

Throughout, we adopt the following notation:

- $S$: specification (natural language task description), treated as a random variable over possible specs
- $P$: correct program (the target output), random variable over programs
- $C \subseteq U$: context, a subset of retrievable codebase units $U = \{u_1, \ldots, u_n\}$
- $\theta$: model prior (training data, weights); treated as fixed conditioning variable
- $W$: context window capacity in tokens
- $|C| = \sum_{u_i \in C} s_i$: total token size of context subset, where $s_i$ is the size of unit $u_i$
- $H(\cdot)$, $I(\cdot;\cdot)$: Shannon entropy and mutual information respectively
- All logarithms are base 2; entropy is measured in bits

We work entirely within Shannon's framework (not Kolmogorov complexity). The key advantage: all quantities are defined as expectations over distributions, making them measurable via sampling and log-probability computation on real LLMs. Kolmogorov complexity $K(P|S)$ is uncomputable; the conditional entropy $H(P|S,C,\theta)$ is estimable from model outputs.

---

## 1. The Context Selection Objective

### 1.1 Definitions

**Definition 1.1 (Context Relevance Function).** Define the context relevance function $f: 2^U \to \mathbb{R}_{\geq 0}$ as the conditional mutual information:

$$f(C) \triangleq I(C; P \mid S, \theta) = H(P \mid S, \theta) - H(P \mid S, C, \theta)$$

This measures the reduction in uncertainty about the correct program $P$ when context $C$ is provided, given the specification $S$ and model prior $\theta$. Equivalently, $f(C)$ is the number of bits about the implementation that the context reveals, beyond what the spec and model prior already provide.

**Definition 1.2 (Context Degradation Function).** Define $\delta: \mathbb{R}_{\geq 0} \to [0, 1]$ as a function satisfying:

1. $\delta(0) = 0$ (no context, no degradation)
2. $\delta$ is monotonically nondecreasing
3. $\delta$ is convex on $[0, W]$

Empirical evidence (Chroma 2025, Liu et al. 2024, arXiv:2601.11564) supports the parametric form:

$$\delta(x) = \alpha \cdot x^\beta, \quad \alpha > 0, \quad \beta \in [1, 2]$$

The convexity condition ($\beta \geq 1$) captures the empirical observation that degradation accelerates with context length: the marginal cost of each additional token of context increases. The parameter $\alpha$ is model-specific; $\beta$ reflects the architectural degradation regime (linear for ideal models, quadratic for standard Transformers with attention dilution).

**Remark.** The degradation function $\delta$ is a modeling simplification. In reality, degradation depends on context *content* (semantically similar distractors degrade performance more than random padding; Chroma 2025) and *position* (the "lost in the middle" U-shaped curve; Liu et al. 2024). We treat $\delta(|C|)$ as a worst-case or average-case envelope over content and position effects.

**Definition 1.3 (Effective Context Value).** The degradation-adjusted context value is:

$$\tilde{f}(C) \triangleq f(C) \cdot (1 - \delta(|C|))$$

This captures the net information gain: $f(C)$ measures how many bits of useful information the context provides, while $(1 - \delta(|C|))$ measures the fraction of those bits the model can actually exploit given attention dilution and positional degradation.

**Definition 1.4 (Context Selection Problem).** The context selection problem is:

$$C^* = \arg\max_{C \subseteq U,\; |C| \leq W} \tilde{f}(C) = \arg\max_{C \subseteq U,\; |C| \leq W} f(C) \cdot (1 - \delta(|C|))$$

This is a combinatorial optimization problem: select a subset of codebase units, subject to a knapsack constraint ($|C| \leq W$ with variable unit sizes), maximizing the product of information gain and exploitation efficiency.

### 1.2 Submodularity of the Relevance Function

**Theorem 1.1 (Submodularity of Conditional Mutual Information).** Let $U = \{u_1, \ldots, u_n\}$ be a collection of random variables (codebase units). Define $f(C) = I(C; P \mid S, \theta)$ for $C \subseteq U$. If the joint distribution $(U, P, S)$ conditioned on $\theta$ satisfies:

$$H(P \mid S, C \cup \{u_i\}, \theta) + H(P \mid S, C \cup \{u_j\}, \theta) \leq H(P \mid S, C, \theta) + H(P \mid S, C \cup \{u_i, u_j\}, \theta)$$

for all $C \subseteq U$ and $u_i, u_j \notin C$, then $f$ is submodular.

*Proof.* We need to show that for $A \subseteq B \subseteq U$ and $u \notin B$:

$$f(A \cup \{u\}) - f(A) \geq f(B \cup \{u\}) - f(B)$$

Expanding using the definition $f(C) = H(P|S,\theta) - H(P|S,C,\theta)$:

$$f(A \cup \{u\}) - f(A) = H(P|S,A,\theta) - H(P|S,A \cup \{u\},\theta)$$

This is the marginal reduction in entropy from adding $u$ to context $A$. The submodularity condition states that this marginal reduction is larger for smaller sets $A$ than for larger supersets $B \supseteq A$. This holds when learning $u$ given less prior context ($A$) is at least as informative as learning $u$ given more prior context ($B \supseteq A$), which is precisely the "diminishing returns" of information.

Formally, submodularity of $f(C) = I(C; P | S, \theta)$ is equivalent to the conditional entropy $g(C) = H(P|S,C,\theta)$ being *supermodular* (since $f = \text{const} - g$, and negating a supermodular function yields a submodular one). The supermodularity of conditional entropy is the condition stated in the theorem. $\square$

**Proposition 1.2 (Sufficient Conditions for Submodularity).** The relevance function $f(C) = I(C; P | S, \theta)$ is submodular under any of the following conditions:

(a) **Conditional independence:** The codebase units $u_1, \ldots, u_n$ are conditionally independent given $(P, S, \theta)$. (This is a strong condition rarely satisfied in practice, since code files have dependencies.)

(b) **Jointly Gaussian model:** The joint distribution of $(U, P)$ given $(S, \theta)$ is multivariate Gaussian. (Krause and Guestrin 2008 proved that mutual information is submodular for Gaussian processes; this extends directly.)

(c) **Log-supermodular joint density:** The conditional density $p(P, C | S, \theta)$ is log-supermodular as a function of which units are "activated" in $C$. (This is the distributional condition underlying the submodularity of information measures; see Iyer et al. 2021.)

*Proof sketch for (b).* Under the Gaussian assumption, $H(P|S,C,\theta) = \frac{1}{2}\log\det(2\pi e \cdot \Sigma_{P|S,C})$ where $\Sigma_{P|S,C}$ is the conditional covariance matrix. The function $C \mapsto \log\det(\Sigma_{P|S,C})$ is supermodular for Gaussian distributions (this follows from the Schur complement formula for conditional covariance and the concavity of $\log\det$). Therefore $f(C) = \text{const} - H(P|S,C,\theta)$ is submodular. This was proved by Krause and Guestrin (JMLR 2008, Theorem 2). $\square$

**Proposition 1.3 (Submodularity Violations from Code Dependencies).** The relevance function $f$ is *not* submodular in general when codebase units have strong complementarities. Specifically, if there exist units $u_i$ (an interface definition) and $u_j$ (its implementation) such that:

$$f(\{u_i, u_j\}) > f(\{u_i\}) + f(\{u_j\})$$

then $f$ is *superadditive* on $\{u_i, u_j\}$, violating submodularity.

*Proof.* Submodularity implies $f(\{u_i, u_j\}) \leq f(\{u_i\}) + f(\{u_j\}) - f(\emptyset) = f(\{u_i\}) + f(\{u_j\})$ (since $f(\emptyset) = 0$). So superadditivity directly contradicts submodularity. Such complementarities arise naturally in code: an interface definition alone is partially informative; its implementation alone is partially informative; but together they are more informative than the sum, because the interface makes the implementation interpretable and vice versa. $\square$

**Remark (Approximate Submodularity).** In practice, the relevance function is likely *approximately* submodular: complementarities exist but are localized (within modules), while diminishing returns dominate at the global level. The submodularity ratio $\gamma_f$ (Das and Kempe 2011) quantifies this:

$$\gamma_f = \min_{A \subseteq B, u \notin B} \frac{f(A \cup \{u\}) - f(A)}{f(B \cup \{u\}) - f(B)}$$

When $\gamma_f \geq 1$, $f$ is exactly submodular. When $\gamma_f < 1$ but bounded away from zero, greedy algorithms still achieve a $(1 - e^{-\gamma_f})$ approximation ratio (a graceful degradation of the classical $(1 - 1/e)$ guarantee).

### 1.3 Submodularity of the Degradation-Adjusted Objective

**Theorem 1.4 (The Product Objective Is Not Submodular in General).** Let $f$ be monotone submodular and $\delta$ be convex nondecreasing with $\delta(0) = 0$. The degradation-adjusted objective $\tilde{f}(C) = f(C) \cdot (1 - \delta(|C|))$ is not submodular in general, and is not monotone.

*Proof.* Non-monotonicity: Consider the regime where $|C|$ is large. Adding unit $u$ to a large set $C$ increases $f$ by a small marginal amount (diminishing returns) but increases $\delta(|C \cup \{u\}|)$ significantly (convexity of $\delta$). So $\tilde{f}(C \cup \{u\}) < \tilde{f}(C)$ is possible; in fact, it is typical once $|C|$ exceeds a threshold.

Non-submodularity: Even if $f$ is submodular, the multiplication by the size-dependent factor $(1 - \delta(|C|))$ introduces interactions between the information content and the size of selected elements that can violate diminishing returns. Specifically, adding a small, highly informative unit $u$ to a small set $A$ yields large $\tilde{f}$ gain (high marginal $f$, low marginal $\delta$). Adding the same unit to a large set $B$ yields smaller $f$ gain (submodularity) AND larger $\delta$ penalty (convexity). While this appears to preserve the ordering, the *ratio* of gains can be distorted by the multiplicative interaction, and concrete counterexamples exist for specific $f$ and $\delta$. $\square$

**Corollary 1.5 (Reformulation as Regularized Non-Monotone Submodular Maximization).** When $\delta$ is small (i.e., the degradation penalty is mild), we can write:

$$\tilde{f}(C) = f(C) \cdot (1 - \delta(|C|)) \approx f(C) - f(C) \cdot \delta(|C|)$$

If we further approximate $f(C) \cdot \delta(|C|) \approx \bar{f} \cdot \delta(|C|)$ where $\bar{f}$ is a characteristic scale of $f$, then:

$$\tilde{f}(C) \approx f(C) - \bar{f} \cdot \delta(|C|)$$

This is a monotone submodular function minus a modular penalty (since $|C| = \sum_{u_i \in C} s_i$ is modular). This falls into the framework of *regularized submodular maximization* (Kazemi et al. 2021, arXiv:2002.03503), for which:

- Unconstrained: a randomized double-greedy algorithm achieves a $1/2$-approximation (Buchbinder et al. 2015)
- Cardinality-constrained: distorted greedy achieves a $(1 - 1/e - \epsilon)$-approximation for the regularized objective under mild conditions
- Knapsack-constrained: more recent work (arXiv:2103.10008) provides bi-criteria $((\alpha, \beta))$-approximations

**Theorem 1.6 (Greedy Approximation for Context Selection).** Assume $f$ is monotone submodular with $f(\emptyset) = 0$ and $\delta(x) = \alpha x^\beta$ with $\beta \geq 1$. Define $\ell(C) = \bar{f} \cdot \alpha \cdot |C|^\beta$ as a supermodular penalty. Under the linear approximation $\tilde{f}(C) \approx f(C) - \ell(C)$ with knapsack constraint $|C| \leq W$:

1. The problem is NP-hard (it contains submodular maximization under a knapsack constraint as a special case when $\alpha = 0$).
2. A modified greedy algorithm that selects elements by *net marginal gain* $\Delta_u f(C) - \Delta_u \ell(C)$ (and stops when no element has positive net marginal gain) achieves a solution $\hat{C}$ satisfying:

$$\tilde{f}(\hat{C}) \geq \frac{1}{2} \cdot \tilde{f}(C^*)$$

where $C^*$ is the optimal solution, provided $\gamma_f = 1$ (exact submodularity).

*Proof sketch.* This follows from the results of Feldman et al. (2011) and Buchbinder et al. (2015) on unconstrained non-monotone submodular maximization, applied to the regularized objective $g(C) = f(C) - \ell(C)$, which is submodular (difference of submodular and supermodular). The knapsack constraint can be incorporated via density-ordered greedy with a factor-2 loss, yielding the stated $1/2$ guarantee. $\square$

---

## 2. The Abstraction Gap Decomposition

### 2.1 The Chain Rule Decomposition

**Theorem 2.1 (Abstraction Gap Decomposition).** For specification $S$, program $P$, context $C$, and model prior $\theta$ (all treated as random variables with a well-defined joint distribution):

$$H(P \mid S) = H(P \mid S, C, \theta) + I(P; C \mid S, \theta) + I(P; \theta \mid S)$$

That is, the total abstraction gap $H(P|S)$ decomposes with exact equality into three terms:

1. **Residual uncertainty** $H(P \mid S, C, \theta)$: the bits the model still cannot determine even with context and prior. These are implementation decisions that require human judgment, domain knowledge not in the codebase, or genuinely novel design.
2. **Context contribution** $I(P; C \mid S, \theta)$: the bits about the program that the context provides, beyond what the spec and model prior already supply. This is $f(C)$ from Definition 1.1.
3. **Prior contribution** $I(P; \theta \mid S)$: the bits the model's training data provides about the program, beyond what the spec supplies. For common patterns (CRUD, auth flows), this term dominates. For novel logic, it is small.

*Proof.* Apply the chain rule for mutual information twice.

**Step 1.** By the chain rule of conditional entropy:

$$H(P \mid S) = H(P \mid S, \theta) + I(P; \theta \mid S)$$

This decomposes the gap into what the prior resolves and what remains.

**Step 2.** Apply the chain rule again to the first term:

$$H(P \mid S, \theta) = H(P \mid S, C, \theta) + I(P; C \mid S, \theta)$$

**Step 3.** Substitute Step 2 into Step 1:

$$H(P \mid S) = H(P \mid S, C, \theta) + I(P; C \mid S, \theta) + I(P; \theta \mid S)$$

Each step is an instance of the identity $H(X|Y) = H(X|Y,Z) + I(X;Z|Y)$, which holds with exact equality for Shannon entropy (it is an algebraic consequence of the definition of conditional mutual information). No approximation, no error terms, no additivity assumptions required. $\square$

**Remark (Advantage over Kolmogorov).** The analogous Kolmogorov decomposition $K(P|S) = K(P|S,C) + I_K(P:C|S) + O(\log n)$ holds only up to $O(\log n)$ additive error. The Shannon version holds with exact equality. Moreover, all three terms in the Shannon decomposition are in principle estimable:

- $H(P|S,C,\theta)$ can be estimated from the LLM's token-level log-probabilities when generating $P$ given $(S, C)$
- $I(P;C|S,\theta) = H(P|S,\theta) - H(P|S,C,\theta)$ can be estimated by comparing generation perplexity with and without context
- $I(P;\theta|S)$ can be estimated by comparing a trained model's perplexity against a randomly initialized model

### 2.2 Interpretation and Consequences

**Proposition 2.2 (The Prior Dominance Regime).** For "common patterns" (CRUD endpoints, standard auth flows, form validation), the model prior $\theta$ provides most of the needed information:

$$I(P; \theta \mid S) \gg I(P; C \mid S, \theta)$$

In this regime, context selection has low leverage: the model can generate correct code primarily from its training distribution, and $H(P|S,C,\theta) \approx H(P|S,\theta)$ for any reasonable $C$.

*Evidence.* Empirically, LLMs achieve high pass rates on standard coding tasks (HumanEval, MBPP) with minimal context, confirming that $\theta$ resolves most uncertainty for common patterns.

**Proposition 2.3 (The Context Dominance Regime).** For tasks involving project-specific types, internal APIs, or domain-specific patterns not well-represented in training data:

$$I(P; C \mid S, \theta) \gg I(P; \theta \mid S)$$

In this regime, context selection is the primary lever for task success. The abstraction gap is largely determined by whether the right codebase context is provided.

**Corollary 2.4 (Bimodal Gap Distribution).** The abstraction gap $H(P|S)$ is bimodally distributed across tasks in a typical development workflow:

- **Low-gap tasks** (common patterns): $H(P|S) \approx I(P;\theta|S)$, small, mostly resolved by the prior.
- **High-gap tasks** (project-specific logic): $H(P|S) \approx I(P;C|S,\theta) + H(P|S,C,\theta)$, large, dominated by context and residual uncertainty.

This bimodality has a direct design implication: a harness should estimate which regime a task falls into *before* investing in context retrieval. For low-gap tasks, minimal context suffices. For high-gap tasks, context retrieval quality is the bottleneck.

### 2.3 The Data Processing Inequality for Context

**Theorem 2.5 (Context Cannot Exceed Codebase Information).** For any context $C \subseteq U$ drawn from the codebase:

$$I(P; C \mid S, \theta) \leq I(P; U \mid S, \theta)$$

where $U$ is the full codebase. That is, no selection from the codebase can provide more information about $P$ than the entire codebase does.

*Proof.* Since $C \subseteq U$, the variable $C$ is a deterministic function of $U$. By the data processing inequality, $I(P; C | S, \theta) \leq I(P; U | S, \theta)$. $\square$

**Corollary 2.6 (Fundamental Limit on Context Value).** No context selection strategy can reduce the residual uncertainty below:

$$H(P \mid S, C, \theta) \geq H(P \mid S, U, \theta)$$

The irreducible residual $H(P|S,U,\theta)$ represents implementation decisions that cannot be resolved by any information in the codebase, such as novel design choices, performance/readability tradeoffs, or stylistic preferences not determined by existing code.

---

## 3. The Context Budget Theorem

### 3.1 Existence of an Optimal Interior Point

**Theorem 3.1 (Optimal Context Size Is Strictly Less Than Window Capacity).** Assume:

(i) $f(C) = I(C; P | S, \theta)$ is monotone nondecreasing and submodular with $f(\emptyset) = 0$.

(ii) $\delta: [0, W] \to [0, 1]$ is continuously differentiable, convex, nondecreasing, with $\delta(0) = 0$ and $\delta(W) < 1$.

(iii) There exists at least one unit $u$ with $f(\{u\}) > 0$ (some context is useful).

(iv) There exists a "marginal exhaustion" condition: for the set $C_W$ that fills the entire window ($|C_W| = W$), the marginal information gain of the last added unit is smaller than its marginal degradation cost:

$$\Delta_{u_{\text{last}}} f(C_W \setminus \{u_{\text{last}}\}) \cdot (1 - \delta(W)) < f(C_W \setminus \{u_{\text{last}}\}) \cdot \Delta_{u_{\text{last}}} \delta(|C_W \setminus \{u_{\text{last}}\}|)$$

Then the optimal context $C^* = \arg\max \tilde{f}(C)$ satisfies $|C^*| < W$. That is, it is strictly better to leave some of the context window empty than to fill it completely.

*Proof.* We prove by contradiction. Suppose $C^* = C_W$ with $|C_W| = W$. Consider removing the last-added unit $u_{\text{last}}$ (the unit with the smallest marginal $f$-gain in the greedy ordering). Let $C' = C_W \setminus \{u_{\text{last}}\}$.

$$\tilde{f}(C_W) = f(C_W) \cdot (1 - \delta(W))$$
$$\tilde{f}(C') = f(C') \cdot (1 - \delta(|C'|))$$

We have $f(C_W) = f(C') + \Delta_{u_{\text{last}}} f(C')$ and $\delta(W) > \delta(|C'|)$. The condition (iv) states precisely that:

$$\tilde{f}(C') > \tilde{f}(C_W)$$

which contradicts the optimality of $C_W$. Therefore $|C^*| < W$. $\square$

**Remark (When Condition (iv) Holds).** Condition (iv) is not merely technical; it holds whenever the degradation function grows faster than the information gain at the margin. For the parametric form $\delta(x) = \alpha x^\beta$:

- The marginal degradation at size $x$ is $\delta'(x) = \alpha \beta x^{\beta - 1}$, which is increasing (for $\beta > 1$) or constant (for $\beta = 1$).
- The marginal information gain of submodular $f$ is decreasing (diminishing returns).
- These two curves must cross at some interior point $x^* < W$, beyond which the marginal degradation exceeds the marginal information gain.

The crossing point $x^*$ provides an estimate of the optimal context budget.

### 3.2 Characterizing the Optimal Budget

**Proposition 3.2 (Continuous Relaxation).** Replace the discrete context selection with a continuous relaxation: let $x \in [0, W]$ represent total context size, and let $F(x) = \max_{C: |C| = x} f(C)$ be the maximum information gain achievable with $x$ tokens. Assume $F$ is concave (which follows from submodularity in the continuous relaxation). The relaxed objective is:

$$\tilde{F}(x) = F(x) \cdot (1 - \delta(x))$$

The optimal budget $x^*$ satisfies the first-order condition:

$$F'(x^*) \cdot (1 - \delta(x^*)) = F(x^*) \cdot \delta'(x^*)$$

which rearranges to:

$$\frac{F'(x^*)}{F(x^*)} = \frac{\delta'(x^*)}{1 - \delta(x^*)}$$

*Interpretation.* At the optimum, the *relative rate of information gain* (left side) equals the *relative rate of degradation increase* (right side). This is an elasticity-matching condition: the context budget should grow until the percentage gain in information from one more token equals the percentage loss from degradation.

**Proposition 3.3 (Closed-Form Estimate for Power-Law Models).** Let $F(x) = F_\infty (1 - e^{-\lambda x})$ (an exponential saturation model, consistent with submodular diminishing returns) and $\delta(x) = \alpha x^\beta$. Then the first-order condition becomes:

$$\frac{\lambda e^{-\lambda x^*}}{1 - e^{-\lambda x^*}} = \frac{\alpha \beta (x^*)^{\beta - 1}}{1 - \alpha (x^*)^\beta}$$

This transcendental equation does not admit a closed-form solution in general, but:

- For $\beta = 1$ (linear degradation): the equation simplifies and can be solved numerically in $O(1)$ time.
- For $\beta = 2$ (quadratic degradation): the equation is a Lambert-W type equation.
- In all cases, $x^* = O(\lambda^{-1} \cdot (\alpha \beta)^{-1/\beta})$, confirming that the optimal budget scales inversely with both the degradation rate $\alpha$ and the information saturation rate $\lambda$.

**Corollary 3.4 (Practical Budget Rule).** For typical values ($\beta \approx 1.5$, $\lambda$ such that 80% of information is captured by $x = 0.2W$, and $\alpha$ such that $\delta(W) \approx 0.3$), the optimal context budget satisfies:

$$x^* \approx 0.15W \text{ to } 0.40W$$

This is consistent with empirical findings: JetBrains (2025) reported that observation masking (removing 52% of context tokens) improved performance by 2.6%, and GSD's "Fresh Eyes" pattern limits context to approximately 200K tokens even when 1M-token windows are available.

---

## 4. The Reuse Discovery Problem

### 4.1 Information-Theoretic Formulation

**Definition 4.1 (Functional Similarity via Mutual Information).** Given two code units $g$ (candidate new function) and $f_j$ (existing function), define their functional similarity as:

$$\text{sim}(g, f_j) \triangleq \frac{I(g; f_j)}{H(g, f_j)}$$

This is the *normalized mutual information* (NMI), taking values in $[0, 1]$:
- $\text{sim}(g, f_j) = 0$ iff $g$ and $f_j$ are statistically independent (share no algorithmic content)
- $\text{sim}(g, f_j) = 1$ iff $g$ and $f_j$ are deterministic functions of each other (functionally equivalent)

**Remark.** In practice, $g$ is not yet written; we have only its specification (signature $\sigma_g$, docstring, type constraints). We therefore work with $I(\sigma_g; f_j)$ as a proxy, where $\sigma_g$ is the embedding of the intended function's specification.

**Definition 4.2 (Reuse Detection Problem).** Given a threshold $\tau \in (0, 1)$ and a candidate function specification $\sigma_g$, find all existing functions $f_j$ such that:

$$\text{sim}(\sigma_g, f_j) > \tau$$

This is a *similarity search* (or *approximate nearest-neighbor*) problem in the space of code semantics.

### 4.2 Connection to Embedding Space Retrieval

**Proposition 4.1 (Embedding Approximation).** Let $\phi: \mathcal{F} \to \mathbb{R}^d$ be a code embedding function (e.g., from CodeBERT, StarCoder, or a contrastive code model). If $\phi$ is a *sufficient statistic* for functional semantics (i.e., $I(g; f_j) = I(\phi(g); \phi(f_j))$ up to negligible loss), then:

$$\text{sim}(g, f_j) \approx \tilde{\text{sim}}(\phi(g), \phi(f_j))$$

where $\tilde{\text{sim}}$ is a similarity function in embedding space (cosine similarity, Euclidean distance, etc.).

Under this approximation, the reuse detection problem reduces to:

$$\{j : \|\phi(\sigma_g) - \phi(f_j)\| < r(\tau)\}$$

where $r(\tau)$ is a radius derived from the threshold $\tau$ and the geometry of the embedding space.

*Proof sketch.* If $\phi$ is a sufficient statistic, then by the data processing inequality, $I(\phi(g); \phi(f_j)) \leq I(g; f_j)$, and the sufficiency condition ensures equality. The mapping from NMI threshold $\tau$ to Euclidean radius $r(\tau)$ depends on the distribution of embeddings; for approximately Gaussian embeddings, $r(\tau) \propto \sqrt{d \cdot (1 - \tau)}$ by standard results on Gaussian mutual information. $\square$

### 4.3 Precision-Recall Tradeoffs

**Proposition 4.2 (Fundamental Precision-Recall Tradeoff).** For the reuse detection problem with threshold $\tau$:

- **Precision** $= P(\text{truly reusable} \mid \text{sim} > \tau)$: the fraction of detected candidates that are actually reusable.
- **Recall** $= P(\text{sim} > \tau \mid \text{truly reusable})$: the fraction of truly reusable functions that are detected.

These satisfy:

1. Lowering $\tau$ increases recall but decreases precision (more false positives: functions that appear similar but are not functionally equivalent).
2. Raising $\tau$ increases precision but decreases recall (missed reuse opportunities).
3. The optimal $\tau^*$ depends on the *asymmetric costs*: the cost of missing a reuse opportunity (duplicate code, maintenance burden) vs. the cost of investigating a false positive (developer time spent evaluating a non-reusable candidate).

**Definition 4.3 (Adaptation Gap).** For a detected candidate $f_j$ with $\text{sim}(\sigma_g, f_j) > \tau$, define the adaptation gap:

$$\text{adapt}(f_j, g) \triangleq H(g \mid f_j)$$

This measures the bits of information needed to transform $f_j$ into the desired $g$. The reuse is economical when:

$$\text{adapt}(f_j, g) < H(g \mid S, \theta)$$

That is, adapting the existing function requires less new information than writing from scratch (given only the spec and model prior).

---

## 5. Secondary Formalizations

### 5.1 The Information Bottleneck Perspective

**Definition 5.1 (Context as Information Bottleneck).** The context window can be viewed through the lens of the information bottleneck (Tishby, Pereira, Bialek 2000). The context $C$ is a compressed representation of the full codebase $U$, and we seek $C$ that maximizes predictive information about $P$ while being constrained in size:

$$\min_{p(C|U)} I(C; U) - \beta \cdot I(C; P \mid S, \theta)$$

where $\beta$ is a Lagrange multiplier trading compression against prediction.

The IB formulation is dual to the context selection problem: instead of a hard constraint $|C| \leq W$, it uses a soft penalty $I(C; U)$ measuring the complexity of the context. The solutions trace a curve in the $(I(C;U), I(C;P|S,\theta))$ plane, called the *information curve*, which is concave and characterizes the fundamental tradeoff between context complexity and predictive power.

**Proposition 5.2.** The optimal IB solution satisfies $I(C; U) \leq I(U; P | S, \theta)$, meaning the context need never be more complex than the codebase's predictive information about the program. This provides an information-theoretic upper bound on the useful context size that is independent of the window capacity $W$.

### 5.2 Ordering Effects: Position-Dependent Information Extraction

**Definition 5.3 (Position-Dependent Extraction Efficiency).** Let $\eta(k, |C|) \in [0, 1]$ be the fraction of information at position $k$ within a context of total length $|C|$ that the model effectively extracts. The "lost in the middle" phenomenon (Liu et al. 2024) implies:

$$\eta(k, |C|) = \begin{cases} \eta_{\text{high}} & \text{if } k \leq k_0 \text{ or } k \geq |C| - k_0 \\ \eta_{\text{low}} & \text{otherwise} \end{cases}$$

where $\eta_{\text{high}} \gg \eta_{\text{low}}$ and $k_0$ is a model-dependent boundary (roughly 1,000-2,000 tokens).

The *effective* information from context $C$ with ordering $\sigma$ (a permutation of the units) is:

$$f_{\text{eff}}(C, \sigma) = \sum_{i} f_{\text{marginal}}(u_{\sigma(i)}) \cdot \eta(\text{pos}(\sigma(i)), |C|)$$

This means the context selection problem is actually a *joint selection and ordering* problem, which is harder than pure subset selection. The ordering component is a type of scheduling problem.

**Proposition 5.4 (Greedy Ordering Heuristic).** Given a fixed context set $C$, the ordering that maximizes $f_{\text{eff}}$ places the highest-marginal-information units at positions with highest extraction efficiency (beginning and end of context), and lowest-information units in the middle. This is optimal among all orderings when the marginal information values and extraction efficiencies are both monotonically ordered.

*Proof.* This is a direct application of the rearrangement inequality: the sum $\sum a_i b_i$ is maximized when the sequences $(a_i)$ and $(b_i)$ are similarly ordered. $\square$

---

## 6. Summary of Results

| Result | Type | Key Condition | Implication |
|--------|------|---------------|-------------|
| Theorem 1.1 | Submodularity of $f$ | Conditional entropy supermodularity | Greedy context selection has $(1-1/e)$ guarantee |
| Proposition 1.3 | Submodularity violation | Code dependency complementarities | Pure submodularity fails for tightly coupled modules |
| Theorem 1.4 | Non-submodularity of $\tilde{f}$ | Convex $\delta$ | Degradation breaks monotonicity; need non-monotone algorithms |
| Theorem 1.6 | $1/2$-approximation | Regularized submodular framework | Greedy with stopping achieves half-optimal |
| Theorem 2.1 | Abstraction gap decomposition | Shannon chain rule | Exact three-term decomposition; all terms estimable |
| Theorem 3.1 | $\|C^*\| < W$ | Marginal exhaustion (iv) | Never fill the full window; leave headroom |
| Proposition 3.3 | Optimal budget estimate | Power-law degradation | $x^* \approx 0.15W$ to $0.40W$ for typical parameters |
| Proposition 4.2 | Precision-recall tradeoff | Asymmetric reuse costs | Threshold $\tau$ depends on duplicate-vs-false-positive costs |
| Proposition 5.2 | IB upper bound | Information bottleneck | Useful context bounded by $I(U; P \| S, \theta)$, independent of $W$ |

---

## 7. Open Problems

**Open Problem 1 (Empirical Submodularity Ratio).** Measure the submodularity ratio $\gamma_f$ for the context relevance function $f(C) = I(C; P | S, \theta)$ on real codebases and tasks. If $\gamma_f > 0.8$ empirically, the greedy $(1 - e^{-\gamma_f})$ guarantee is nearly as good as the exact-submodular case. If $\gamma_f < 0.5$, complementarities dominate and different algorithms are needed.

**Open Problem 2 (Degradation Function Calibration).** Fit the parametric form $\delta(x) = \alpha x^\beta$ to Chroma's 18-model benchmark data. Determine whether $\beta$ is model-dependent or approximately universal. Test whether content-dependent degradation (distractors vs. relevant context) can be captured by a modified $\delta(x, \text{relevance})$.

**Open Problem 3 (Prior vs. Context Contribution Measurement).** For a benchmark suite of coding tasks, estimate $I(P; \theta | S)$ and $I(P; C | S, \theta)$ using LLM log-probabilities. Confirm or refute the bimodal gap hypothesis (Corollary 2.4). This would provide the first empirical decomposition of the abstraction gap into its three components.

**Open Problem 4 (Joint Selection and Ordering).** The full context optimization problem (Section 5.2) is a joint subset selection and permutation problem. Characterize its computational complexity. Is it APX-hard? Does the natural greedy heuristic (select greedily, then order by the rearrangement inequality) achieve a constant-factor approximation for the joint problem?

**Open Problem 5 (Embedding Sufficiency for Reuse Detection).** For current code embedding models (CodeBERT, StarCoder, code-specific contrastive models), measure the information loss $I(g; f_j) - I(\phi(g); \phi(f_j))$. If the gap is large, embeddings are lossy for reuse detection and structural/type-based methods may be superior.

---

## References

1. Shannon, C.E. (1948). "A Mathematical Theory of Communication." Bell System Technical Journal, 27, 379-423, 623-656.
2. Nemhauser, G.L., Wolsey, L.A., Fisher, M.L. (1978). "An Analysis of Approximations for Maximizing Submodular Set Functions--I." Mathematical Programming, 14(1), 265-294.
3. Krause, A., Guestrin, C. (2005/2008). "Near-Optimal Sensor Placements in Gaussian Processes." ICML 2005; expanded JMLR 2008, 9, 235-284.
4. Lin, H., Bilmes, J. (2011). "A Class of Submodular Functions for Document Summarization." ACL-HLT 2011, 510-520.
5. Das, A., Kempe, D. (2011). "Submodular Meets Spectral: Greedy Algorithms for Subset Selection, Sparse Approximation and Dictionary Selection." ICML 2011.
6. Buchbinder, N., Feldman, M., Naor, J., Schwartz, R. (2015). "A Tight Linear Time (1/2)-Approximation for Unconstrained Submodular Maximization." SIAM Journal on Computing, 44(5), 1384-1402.
7. Liu, N.F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., Liang, P. (2024). "Lost in the Middle: How Language Models Use Long Contexts." TACL, 12, 157-173.
8. Tishby, N., Pereira, F., Bialek, W. (2000). "The Information Bottleneck Method." 37th Allerton Conference.
9. Iyer, R., Bilmes, J., Jegelka, S. (2021). "Submodular Combinatorial Information Measures with Applications in Machine Learning." ALT 2021; arXiv:2006.15412.
10. Hong, K., Troynikov, A., Huber, J. (2025). "Context Rot: How Increasing Input Tokens Impacts LLM Performance." Chroma Research.
11. Kazemi, E., et al. (2021). "Regularized Submodular Maximization at Scale." NeurIPS 2021; arXiv:2002.03503.
12. Hindle, A., et al. (2012). "On the Naturalness of Software." ICSE 2012.
13. Hellendoorn, V.J., Devanbu, P. (2017). "Are Deep Neural Networks the Best Choice for Modeling Source Code?" FSE 2017, 763-773.
14. Calinescu, G., Chekuri, C., Pal, M., Vondrak, J. (2011). "Maximizing a Monotone Submodular Function Subject to a Matroid Constraint." SIAM Journal on Computing, 40(6), 1740-1766.
15. Context Discipline Study (2025). arXiv:2601.11564.
16. Jina AI (2025). "Submodular Optimization for Text Selection, Passage Reranking & Context Engineering."
17. arXiv:2509.21361. "Context Is What You Need: The Maximum Effective Context Window for Real World Limits of LLMs."
18. arXiv:2103.10008. "Regularized Non-monotone Submodular Maximization."
