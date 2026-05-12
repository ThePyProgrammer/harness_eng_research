# Formal Foundations for Token Budget Allocation in AI Coding Agent Harnesses

**Formalization Round 1: Optimization Theory, Information Economics, and Non-Monotone Extensions**
**Date:** 2026-04-03

---

## Preamble: Scope and Epistemic Status

This document develops the rigorous mathematical framework for the Token Budget Allocation Problem (TBAP), which governs how an AI coding agent harness distributes a finite token budget across pipeline stages to maximize end-to-end quality. We synthesize results from convex optimization, information theory, portfolio theory, and decision analysis into a coherent formal treatment.

Three epistemic categories are used throughout:

- **[E] Established theory**: results from optimization, information theory, or economics applied without modification.
- **[S] Novel synthesis**: known results composed, reframed, or applied to the AI coding harness setting for the first time.
- **[C] Conjectured**: claims motivated by empirical data or analogy but not yet formally proved in full generality.

All notation is LaTeX-compatible. Variables are defined at first use and collected in the notation table in Section 8.

---

## 1. The Token Budget Allocation Problem (TBAP)

### 1.1 Pipeline Model

**Definition 1.1** (Pipeline). *A pipeline is a tuple $\Pi = (K, \mathbf{p}, \{q_k\}_{k=1}^K, B)$ where:*

- *$K \in \mathbb{N}$ is the number of stages, indexed $k \in \{1, \ldots, K\}$.*
- *$\mathbf{p} = (p_1, \ldots, p_K) \in \mathbb{R}_{>0}^K$ is the price vector, where $p_k$ is the cost per token at stage $k$ (in dollars per token).*
- *$q_k: \mathbb{R}_{\geq 0} \to (0, 1]$ is the quality function for stage $k$.*
- *$B \in \mathbb{R}_{>0}$ is the total token budget (in dollars).*

*The allocation vector $\mathbf{r} = (r_1, \ldots, r_K) \in \mathbb{R}_{\geq 0}^K$ specifies the number of tokens assigned to each stage. The cost of an allocation is $C(\mathbf{r}) = \sum_{k=1}^K p_k r_k$.*

**Remark 1.1.** The budget $B$ is measured in dollars, not tokens, because stages may use different models with different per-token prices. When all stages share a single model (so $p_k = p$ for all $k$), the dollar budget $B$ is equivalent to a token budget $B/p$.

### 1.2 Quality Function Axioms

**Definition 1.2** (Admissible Quality Function). *A function $q: \mathbb{R}_{\geq 0} \to (0, 1]$ is an admissible quality function if it satisfies:*

- *(Q1) Boundary: $q(0) = q_0 \in (0, 1)$ (zero tokens yield positive but sub-maximal quality; the stage has some baseline capability).*
- *(Q2) Monotonicity on $[0, r^{\max}]$: $q$ is non-decreasing on $[0, r^{\max}]$ for some $r^{\max} \in (0, \infty]$ (more tokens help, up to a point).*
- *(Q3) Boundedness: $\sup_{r \geq 0} q(r) \leq 1$ (quality is normalized to the unit interval).*
- *(Q4) Concavity on $[0, r^{\max}]$: $q$ is concave on $[0, r^{\max}]$ (diminishing marginal returns).*
- *(Q5) Differentiability: $q$ is continuously differentiable on $(0, r^{\max})$.*

*A quality function is strictly admissible if $q$ is strictly concave on $[0, r^{\max}]$.*

**Remark 1.2.** Axiom (Q1) asserts that $q(0) > 0$: even with zero token allocation, a stage contributes non-zero quality. This models the fact that an LLM has intrinsic capability from pre-training. If a stage were omitted entirely (not merely starved of tokens), the pipeline would need to be redefined with $K-1$ stages. The condition $q(0) < 1$ ensures that additional tokens are beneficial.

**Remark 1.3.** Axiom (Q2) permits a finite saturation point $r^{\max}$. In the non-monotone extension (Section 6), quality decreases beyond $r^{\max}$. The basic TBAP assumes $r^{\max} = \infty$ (monotonicity everywhere); Section 6 relaxes this.

### 1.3 The Optimization Problem

**Definition 1.3** (Token Budget Allocation Problem, TBAP). *Given a pipeline $\Pi = (K, \mathbf{p}, \{q_k\}, B)$ with admissible quality functions, the TBAP is:*

$$\max_{\mathbf{r} \in \mathbb{R}_{\geq 0}^K} \; Q(\mathbf{r}) = \prod_{k=1}^K q_k(r_k) \quad \text{subject to} \quad \sum_{k=1}^K p_k r_k \leq B$$

**Remark 1.4** (Multiplicative Structure). The multiplicative objective $Q = \prod q_k$ models the serial composition of pipeline stages: the overall probability that the pipeline produces a correct output is the product of stage-level correctness probabilities under conditional independence. This is the standard series-system reliability model (Barlow and Proschan, 1975). If one stage fails ($q_k \to 0$), the entire pipeline fails ($Q \to 0$), regardless of how well other stages perform. This "weakest link" structure is the defining feature of the TBAP.

### 1.4 The Log-Transformed Problem

**Proposition 1.1** (Log-Transformation Equivalence) [E]. *Since $\log$ is strictly increasing on $\mathbb{R}_{>0}$ and each $q_k > 0$, the TBAP is equivalent to:*

$$\max_{\mathbf{r} \in \mathbb{R}_{\geq 0}^K} \; L(\mathbf{r}) = \sum_{k=1}^K \log q_k(r_k) \quad \text{subject to} \quad \sum_{k=1}^K p_k r_k \leq B$$

*Proof.* Monotonicity of $\log$: $\mathbf{r}^*$ maximizes $Q$ if and only if it maximizes $\log Q = \sum \log q_k(r_k) = L$. $\square$

**Proposition 1.2** (Concavity of Transformed Objective) [E]. *If each $q_k$ is admissible (in particular, concave and positive on $\mathbb{R}_{\geq 0}$), then $f_k(r) := \log q_k(r)$ is concave on $\mathbb{R}_{\geq 0}$, and $L(\mathbf{r}) = \sum f_k(r_k)$ is concave in $\mathbf{r}$.*

*Proof sketch.* Compute the second derivative: $f_k''(r) = q_k''(r)/q_k(r) - (q_k'(r))^2 / (q_k(r))^2$. The first term is non-positive (by concavity of $q_k$ and positivity), and the second term is non-positive. Hence $f_k'' \leq 0$. Concavity of $L$ follows because a sum of concave functions is concave (Boyd and Vandenberghe, 2004, Section 3.2). $\square$

**Remark 1.5.** The concavity of $f_k = \log \circ \, q_k$ under concavity and positivity of $q_k$ is a standard result. The broader sufficient condition is that $q_k$ itself be log-concave (i.e., $\log q_k$ is directly concave). Every concave positive function is log-concave, but some log-concave functions (e.g., Gaussian densities) are not globally concave (Bagnoli and Bergstrom, 2005).

**Corollary 1.1** (Convex Program) [E]. *The log-transformed TBAP is a convex optimization problem: maximize a concave objective subject to a linear inequality constraint and non-negativity constraints. Strong duality holds (Slater's condition is satisfied by any interior feasible point $\mathbf{r}$ with $\sum p_k r_k < B$).*

### 1.5 First-Order Optimality Conditions

**Theorem 1.1** (KKT Conditions for the TBAP) [E + S]. *Let each $q_k$ be admissible. At an optimal allocation $\mathbf{r}^*$, there exists a Lagrange multiplier $\lambda^* \geq 0$ such that:*

$$\frac{q_k'(r_k^*)}{q_k(r_k^*)} \leq \lambda^* p_k \quad \text{for all } k = 1, \ldots, K$$

*with equality whenever $r_k^* > 0$. Equivalently, for all active stages (those with $r_k^* > 0$):*

$$\frac{q_k'(r_k^*)}{q_k(r_k^*) \cdot p_k} = \lambda^* \tag{1}$$

*The budget constraint binds at optimality: $\sum p_k r_k^* = B$.*

*Proof sketch.* The Lagrangian of the log-transformed problem is $\mathcal{L}(\mathbf{r}, \lambda) = \sum_{k=1}^K \log q_k(r_k) - \lambda(\sum p_k r_k - B)$. The KKT stationarity condition $\partial \mathcal{L} / \partial r_k = 0$ gives $q_k'(r_k) / q_k(r_k) = \lambda p_k$ at interior points ($r_k > 0$). For boundary points ($r_k = 0$), the KKT condition with non-negativity constraint gives $q_k'(0) / q_k(0) \leq \lambda p_k$. The budget constraint binds because $L$ is strictly increasing in at least one $r_k$ (by $q_k'(0) > 0$ from the boundary condition $q_k(0) < 1$ and monotonicity). $\square$

**Remark 1.6** (Interpretation). The quantity $q_k'(r_k) / q_k(r_k)$ is the logarithmic derivative of $q_k$, sometimes called the hazard rate in a reliability context. Dividing by the price $p_k$ yields the "relative marginal quality per dollar." Condition (1) states that at the optimum, this rate is equalized across all active stages.

### 1.6 Uniqueness

**Theorem 1.2** (Uniqueness under Strict Concavity) [E]. *If each $q_k$ is strictly admissible (strictly concave and positive), then the optimal allocation $\mathbf{r}^*$ is unique.*

*Proof sketch.* Under strict concavity of each $q_k$, the functions $f_k = \log \circ \, q_k$ are strictly concave (the second derivative $f_k'' < 0$ wherever $q_k' \neq 0$). The sum $L(\mathbf{r}) = \sum f_k(r_k)$ is then strictly concave over the convex feasible set $\{\mathbf{r} \geq 0 : \sum p_k r_k \leq B\}$. A strictly concave function over a convex set has at most one maximum (Boyd and Vandenberghe, 2004, Section 4.2.2). Existence follows from compactness of the feasible set (which is closed and bounded: each $r_k \leq B/p_k$) and continuity of $L$, by the extreme value theorem. $\square$

**Remark 1.7.** When quality functions are merely concave (not strictly), the optimal allocation may not be unique, but the optimal quality $Q^*$ is unique. The set of optimal allocations forms a convex set.

---

## 2. The Equal Marginal Rate Theorem

**Theorem 2.1** (Equal Marginal Rate) [S]. *Let $\Pi = (K, \mathbf{p}, \{q_k\}, B)$ be a TBAP with admissible quality functions. Let $\mathbf{r}^*$ be an optimal allocation with active set $\mathcal{A} = \{k : r_k^* > 0\}$. Then there exists a constant $\lambda^* > 0$ such that:*

$$\frac{q_k'(r_k^*)}{q_k(r_k^*) \cdot p_k} = \lambda^* \quad \text{for all } k \in \mathcal{A} \tag{2}$$

*and*

$$\frac{q_k'(0)}{q_k(0) \cdot p_k} \leq \lambda^* \quad \text{for all } k \notin \mathcal{A} \tag{3}$$

*Moreover, $\lambda^* = \partial L^* / \partial B$, the shadow price of the budget.*

*Proof.* This is a direct restatement of the KKT conditions from Theorem 1.1, with the economic interpretation that $\lambda^*$ is the marginal value of an additional dollar of budget (the envelope theorem; see Mas-Colell, Whinston, and Green, 1995, Chapter 3). The strict positivity $\lambda^* > 0$ follows from the binding budget constraint (complementary slackness). $\square$

**Economic Interpretation.** Equation (2) is the "equal marginal rate" condition. It states that an optimally managed harness equalizes the *relative marginal quality per dollar* across all active pipeline stages. The quantity $q_k'(r_k) / q_k(r_k)$ is the elasticity-like measure: the percentage improvement in quality per additional token. Dividing by $p_k$ normalizes for price differences.

If stage $j$ had a higher rate than stage $i$, i.e., $q_j'(r_j) / (q_j(r_j) p_j) > q_i'(r_i) / (q_i(r_i) p_i)$, then transferring a marginal dollar from stage $i$ to stage $j$ would increase $L = \sum \log q_k$ (the log-quality would decrease by $q_i'/(q_i p_i)$ from stage $i$ and increase by $q_j'/(q_j p_j)$ from stage $j$, for a net gain). This contradicts optimality.

**Corollary 2.1** (Inactive Stage Condition) [E + S]. *Stage $k$ receives zero allocation ($r_k^* = 0$) if and only if its initial marginal rate is below the threshold:*

$$\frac{q_k'(0)}{q_k(0) \cdot p_k} \leq \lambda^*$$

*This occurs when the stage is too expensive (high $p_k$), has low marginal benefit at zero allocation (low $q_k'(0)$), or already has high baseline quality (high $q_k(0)$ making the relative gain small).*

**Corollary 2.2** (Connection to Kelly Criterion) [S]. *The equal marginal rate condition (2) is the multi-asset generalization of the Kelly criterion applied to multiplicative wealth growth. In Kelly's framework, the optimal fraction of wealth to bet on each opportunity equalizes the "edge per unit of risk" across all active bets. Here, the "edge" is $q_k'(r_k)/q_k(r_k)$ (the growth rate of quality) and the "risk" is $p_k$ (the cost per unit of allocation). The TBAP thus solves the multi-dimensional Kelly problem for a pipeline of concurrent opportunities with a shared budget constraint.*

*This connection was first noted implicitly by Markowitz (1976), who showed that maximizing expected log-wealth in a single-period portfolio problem yields the Kelly optimal portfolio. The TBAP extends this to a setting where "assets" (pipeline stages) contribute to a multiplicative product rather than a sum.*

---

## 3. The Weakest-Link Theorem

### 3.1 AM-GM Foundation

**Theorem 3.1** (AM-GM Inequality) [E]. *For non-negative reals $a_1, \ldots, a_K$:*

$$\left(\prod_{k=1}^K a_k\right)^{1/K} \leq \frac{1}{K} \sum_{k=1}^K a_k$$

*with equality if and only if $a_1 = a_2 = \cdots = a_K$.*

### 3.2 The Equalization Principle

**Theorem 3.2** (Weakest-Link Theorem for Multiplicative Quality) [S]. *Consider the TBAP with identical quality functions $q_k = q$ for all $k$ and identical prices $p_k = p$ for all $k$. Then the unique optimal allocation is the uniform allocation $r_k^* = B / (Kp)$ for all $k$, and the optimal quality is:*

$$Q^* = q\!\left(\frac{B}{Kp}\right)^K$$

*Proof.* By the first-order condition (Theorem 2.1), at the optimum, $q'(r_k^*) / q(r_k^*)$ must be equal across all $k$ (since $p_k = p$ for all $k$). Under strict concavity of $\log \circ \, q$, this implies $r_k^*$ is equal across all $k$, giving $r_k^* = B/(Kp)$ from the budget constraint.

Alternatively, by the AM-GM inequality: for any allocation with $\sum r_k = B/p$, we have $\prod q(r_k) \leq q(\bar{r})^K$ where $\bar{r} = B/(Kp)$, provided $q$ is concave. This follows because:

$$\frac{1}{K}\sum_{k=1}^K \log q(r_k) \leq \log q\!\left(\frac{1}{K}\sum_{k=1}^K r_k\right) = \log q(\bar{r})$$

by Jensen's inequality applied to the concave function $\log \circ \, q$. Exponentiating gives $(\prod q(r_k))^{1/K} \leq q(\bar{r})$, hence $\prod q(r_k) \leq q(\bar{r})^K$, with equality iff all $r_k$ are equal. $\square$

### 3.3 The Heterogeneous Case

**Theorem 3.3** (Approximate Equalization for Heterogeneous Stages) [S]. *For a general TBAP with distinct quality functions $\{q_k\}$ and prices $\{p_k\}$, the optimal allocation $\mathbf{r}^*$ satisfies:*

$$\frac{q_k'(r_k^*)}{q_k(r_k^*)} = \lambda^* p_k \quad \text{for all active } k$$

*When quality functions have similar shape (e.g., $q_k(r) = 1 - e^{-\alpha_k r}$ with similar $\alpha_k$), the optimal quality levels $q_k(r_k^*)$ are approximately equalized across stages. Specifically, stages with lower baseline quality receive proportionally larger allocations.*

*Proof sketch.* Consider the simplified case $q_k(r) = 1 - e^{-\alpha_k r}$ with $p_k = p$ for all $k$. The first-order condition gives:

$$\frac{\alpha_k e^{-\alpha_k r_k^*}}{1 - e^{-\alpha_k r_k^*}} = \lambda^* p$$

For two stages $i, j$ with $\alpha_i < \alpha_j$ (stage $i$ is "harder," requiring more tokens per unit quality), the equation requires $r_i^* > r_j^*$ to compensate, driving $q_i(r_i^*)$ toward $q_j(r_j^*)$. In the limit of large budget $B$, both approach 1 and the gap vanishes. For finite $B$, the gap is determined by the heterogeneity of the $\alpha_k$ and the budget level.

The "raise the floor" principle follows directly: the first-order condition (1) implies that a stage with lower current quality $q_k(r_k)$ needs a higher marginal improvement $q_k'(r_k)$ to satisfy the equation, which (given concavity) occurs at a lower allocation level. The optimizer responds by increasing $r_k$ until the rate condition is satisfied, thereby raising the quality of the weakest stage. $\square$

### 3.4 Quantitative Floor-Raising Bound

**Proposition 3.1** (Multiplicative Sensitivity to Minimum Quality) [S]. *For any allocation $\mathbf{r}$, the overall quality $Q(\mathbf{r}) = \prod q_k(r_k)$ satisfies:*

$$Q(\mathbf{r}) \leq \left(\min_k q_k(r_k)\right) \cdot \left(\max_k q_k(r_k)\right)^{K-1}$$

*In particular, $Q \leq q_{\min} \cdot 1^{K-1} = q_{\min}$ when $K-1$ stages are perfect. The overall quality is bounded above by the quality of the worst stage.*

*Proof.* Order the qualities so $q_{(1)} \leq q_{(2)} \leq \cdots \leq q_{(K)}$. Then $\prod q_{(k)} \leq q_{(1)} \cdot q_{(K)}^{K-1}$ since each factor in the product is at most $q_{(K)}$. The bound $Q \leq q_{\min}$ follows from $q_k \leq 1$ for all $k$. $\square$

**Corollary 3.1** (Marginal Value of Floor-Raising) [S]. *Improving the quality of the worst stage by $\delta$ (from $q_{\min}$ to $q_{\min} + \delta$) improves overall quality by at least $\delta \cdot \prod_{k \neq k_{\min}} q_k(r_k)$. Improving any other stage by $\delta$ improves overall quality by at most $\delta \cdot \prod_{j \neq i} q_j(r_j)$. When the worst stage is much worse than the others ($q_{\min} \ll q_k$ for $k \neq k_{\min}$), the relative improvement from floor-raising is proportionally larger:*

$$\frac{\Delta Q / Q}{\delta / q_{\min}} = 1 \quad \text{(floor-raising)}$$

*versus*

$$\frac{\Delta Q / Q}{\delta / q_i} = 1 \quad \text{(improving stage } i \text{ with } q_i > q_{\min}\text{)}$$

*Both are elasticity-one, but $\delta / q_{\min} > \delta / q_i$ for the same absolute improvement $\delta$, so the absolute relative gain is larger for floor-raising.*

---

## 4. The Pareto Frontier Characterization

### 4.1 Definition

**Definition 4.1** (Cost-Quality Pareto Frontier). *The Pareto frontier of a pipeline $\Pi$ is the function $Q^*: \mathbb{R}_{>0} \to (0, 1]$ defined by:*

$$Q^*(B) = \max_{\substack{\mathbf{r} \geq 0 \\ \sum p_k r_k \leq B}} \prod_{k=1}^K q_k(r_k)$$

*Equivalently, define $L^*(B) = \log Q^*(B) = \max_{\sum p_k r_k \leq B} \sum \log q_k(r_k)$.*

### 4.2 Monotonicity

**Proposition 4.1** (Monotonicity of the Frontier) [E]. *$Q^*(B)$ is non-decreasing in $B$.*

*Proof.* For $B_1 < B_2$, the feasible set at budget $B_1$ is a subset of the feasible set at budget $B_2$. Hence $Q^*(B_1) \leq Q^*(B_2)$. $\square$

### 4.3 Concavity

**Theorem 4.1** (Log-Concavity of the Pareto Frontier) [E + S]. *If each $q_k$ is admissible (concave and positive), then $L^*(B) = \log Q^*(B)$ is concave in $B$. Consequently, $Q^*(B)$ is log-concave in $B$.*

*Proof.* Let $B_1, B_2 > 0$ and $\alpha \in [0,1]$. Let $\mathbf{r}^{(1)}, \mathbf{r}^{(2)}$ be optimal allocations at budgets $B_1, B_2$ respectively. The convex combination $\tilde{\mathbf{r}} = \alpha \mathbf{r}^{(1)} + (1-\alpha) \mathbf{r}^{(2)}$ is feasible at budget $\alpha B_1 + (1-\alpha) B_2$ because:

$$\sum p_k \tilde{r}_k = \alpha \sum p_k r_k^{(1)} + (1-\alpha) \sum p_k r_k^{(2)} \leq \alpha B_1 + (1-\alpha) B_2$$

Therefore:

$$L^*(\alpha B_1 + (1-\alpha) B_2) \geq L(\tilde{\mathbf{r}}) = \sum_{k=1}^K \log q_k(\tilde{r}_k)$$

By concavity of $\log \circ \, q_k$ (Proposition 1.2):

$$\log q_k(\tilde{r}_k) \geq \alpha \log q_k(r_k^{(1)}) + (1-\alpha) \log q_k(r_k^{(2)})$$

Summing over $k$:

$$L(\tilde{\mathbf{r}}) \geq \alpha L(\mathbf{r}^{(1)}) + (1-\alpha) L(\mathbf{r}^{(2)}) = \alpha L^*(B_1) + (1-\alpha) L^*(B_2)$$

Hence $L^*(\alpha B_1 + (1-\alpha) B_2) \geq \alpha L^*(B_1) + (1-\alpha) L^*(B_2)$, establishing concavity of $L^*$ in $B$. $\square$

**Corollary 4.1** (Concavity of $Q^*$) [E + S]. *Since $Q^*(B) = e^{L^*(B)}$ and $e^x$ is convex and non-decreasing, the composition $Q^* = \exp \circ \, L^*$ where $L^*$ is concave does not directly yield concavity of $Q^*$. However, log-concavity ($L^*$ concave) does imply that $Q^*$ is quasi-concave, and for functions mapping $\mathbb{R} \to \mathbb{R}_{>0}$, log-concavity implies concavity when the function is also non-decreasing and the domain is an interval.*

*More precisely: $Q^*$ is concave on $[0, B_{\max}]$ if each $q_k$ is concave. This follows from the fact that the maximum of a concave function (the product $\prod q_k$, which is concave when viewed as a function of its arguments under the log-transform) over a linear constraint set is concave in the right-hand side of the constraint (Rockafellar, 1970, Theorem 32.2 on concavity of the optimal value function).*

**Remark 4.1.** The subtle point here is worth elaborating. The function $Q^* = \prod q_k(r_k^*)$ is NOT necessarily concave as a direct consequence of log-concavity. Log-concavity ($\log Q^*$ concave) is the precisely correct statement. For practical purposes, log-concavity implies:

1. $Q^*$ is quasi-concave (all upper level sets are convex).
2. $Q^*$ is unimodal.
3. $(\log Q^*)'$ is non-increasing, so the marginal return $Q^{*\prime}(B) / Q^*(B)$ is non-increasing.

The concavity of $Q^*$ itself holds under additional conditions (e.g., when all $q_k$ are bounded below by a positive constant, which we have from Axiom Q1). But log-concavity is the more fundamental and precisely provable property.

### 4.4 The Slope Equals the Shadow Price

**Theorem 4.2** (Envelope Theorem for TBAP) [E + S]. *Under the conditions of Theorem 1.1, the log-frontier satisfies:*

$$\frac{dL^*}{dB} = \lambda^*(B) \tag{4}$$

*where $\lambda^*(B)$ is the optimal Lagrange multiplier at budget $B$. For the original frontier:*

$$\frac{dQ^*}{dB} = \lambda^*(B) \cdot Q^*(B) \tag{5}$$

*Proof.* Equation (4) is the standard result from parametric optimization: the derivative of the optimal value with respect to the right-hand side of a binding constraint equals the Lagrange multiplier (Danskin's theorem; see Bertsekas, 1999, Proposition 6.1.1). Equation (5) follows by the chain rule: $dQ^*/dB = d(e^{L^*})/dB = e^{L^*} \cdot dL^*/dB = Q^* \cdot \lambda^*$. $\square$

**Economic Interpretation.** The shadow price $\lambda^*(B)$ is the marginal value of budget: how much log-quality improves per additional dollar. At low budgets, $\lambda^*$ is large (the harness is "starved," and additional budget is very valuable). As $B$ increases, $\lambda^*$ decreases (diminishing returns at the portfolio level). The condition for "enough budget" is $\lambda^*(B) < \lambda_{\min}$, where $\lambda_{\min}$ is the organization's minimum acceptable return on token spending.

### 4.5 Diminishing Returns

**Corollary 4.2** (Diminishing Returns on Budget) [E + S]. *The shadow price $\lambda^*(B)$ is non-increasing in $B$. That is:*

$$\frac{d^2 L^*}{dB^2} \leq 0$$

*Equivalently, the marginal return on budget is non-increasing: each additional dollar of budget yields (weakly) less log-quality improvement than the previous dollar.*

*Proof.* This is an immediate consequence of the concavity of $L^*$ (Theorem 4.1). $\square$

---

## 5. The Value of Information Extension

### 5.1 Decision-Theoretic Setup

**Definition 5.1** (Information State). *An information state $I$ is a probability distribution over the unknown aspects of the current task: the true quality functions $\{q_k\}$, the ideal allocation $\mathbf{r}^*$, and the achievable quality $Q^*$. The initial information state $I_0$ reflects prior beliefs before any context has been loaded.*

**Definition 5.2** (Information Acquisition). *An information acquisition action at cost $c_{\text{info}}$ tokens (or $c_{\text{info}} \cdot p_{\text{info}}$ dollars) transforms the information state from $I$ to $I'$ by conditioning on a noisy signal $s$ drawn from a likelihood model $P(s | \theta)$, where $\theta$ represents the unknown task parameters. The updated information state is $I' = I \,|\, s$.*

### 5.2 Expected Value of Imperfect Information

**Definition 5.3** (EVII for Token Allocation) [S]. *Given an information state $I$ and a budget $B$, define:*

- *$V(I, B)$: the expected optimal log-quality achievable with information $I$ and budget $B$:*
  $$V(I, B) = \mathbb{E}_{\theta \sim I}\left[\max_{\mathbf{r}} \sum_k \log q_k(r_k; \theta) \;\middle|\; \sum p_k r_k \leq B\right]$$
  *(This is the expected posterior value: optimize after seeing $\theta$.)*
- *$V_0(I, B) = \max_{\mathbf{r}} \mathbb{E}_{\theta \sim I}\left[\sum_k \log q_k(r_k; \theta)\right]$ subject to $\sum p_k r_k \leq B$.*
  *(This is the prior value: optimize under uncertainty about $\theta$.)*

*Then the Expected Value of Perfect Information is:*

$$\text{EVPI}(I, B) = V(I, B) - V_0(I, B) \geq 0$$

*For an imperfect signal $s$ with likelihood $P(s|\theta)$, the Expected Value of Imperfect Information is:*

$$\text{EVII}(I, B, s) = \mathbb{E}_s\left[V_0(I|s, B)\right] - V_0(I, B) \tag{6}$$

*where $V_0(I|s, B)$ is the optimal value under the posterior information state $I|s$.*

**Proposition 5.1** (Bounds on EVII) [E]. *For any signal structure:*

$$0 \leq \text{EVII} \leq \text{EVPI}$$

*The lower bound is achieved by a completely uninformative signal (independent of $\theta$). The upper bound is achieved when $s$ perfectly reveals $\theta$ (Blackwell, 1953).*

*Proof.* The lower bound: if $s$ is uninformative, $I|s = I$, so $\mathbb{E}_s[V_0(I|s, B)] = V_0(I, B)$, giving EVII = 0. The upper bound: by the law of iterated expectations and Jensen's inequality, $\mathbb{E}_s[V_0(I|s, B)] \leq \mathbb{E}_s[\max_{\mathbf{r}} \mathbb{E}[\sum \log q_k | s]] \leq V(I, B)$, since the posterior optimal value cannot exceed the value with perfect information. $\square$

### 5.3 The Information Acquisition Criterion

**Theorem 5.1** (Optimal Information Acquisition) [S]. *It is optimal to acquire signal $s$ at cost $c_{\text{info}} \cdot p_{\text{info}}$ if and only if:*

$$\text{EVII}(I, B - c_{\text{info}} \cdot p_{\text{info}}, s) > 0 \tag{7}$$

*where the budget is reduced to account for the cost of information. A stronger, more practical condition: acquire information iff:*

$$\text{EVII}(I, B, s) > c_{\text{info}} \cdot p_{\text{info}} \cdot \lambda^*(B) \tag{8}$$

*The right-hand side is the opportunity cost: the information tokens could instead have been allocated to pipeline stages, yielding $\lambda^*(B)$ units of log-quality per dollar.*

*Proof sketch.* The net value of acquiring information is:

$$\Delta V = \text{EVII}(I, B - c, s) - 0$$

where $c = c_{\text{info}} \cdot p_{\text{info}}$. This is positive iff the log-quality gain from better allocation decisions (enabled by information) exceeds the log-quality loss from the reduced budget. For marginal information acquisitions ($c \ll B$), the budget reduction cost is approximately $c \cdot \lambda^*(B)$ by the envelope theorem (Theorem 4.2), giving condition (8). $\square$

**Remark 5.1** (Connection to Howard, 1966). Howard's original EVPI/EVII framework was formulated for single-stage decision problems. Definition 5.3 extends it to the multi-stage TBAP, where the information acquired may improve allocation decisions across multiple stages simultaneously. The key insight from Howard: "no theory that involves just the probabilities of outcomes without considering their consequences could possibly be adequate" applies directly; Shannon information (how many bits does the signal provide?) is insufficient. What matters is how those bits improve the allocation decision.

**Corollary 5.1** (Blackwell Ordering of Signals) [E + S]. *Among two signals $s_1, s_2$ about the same uncertain parameter $\theta$, signal $s_1$ Blackwell-dominates $s_2$ if $s_2$ is a garbling of $s_1$ (i.e., $s_2 = g(s_1, \eta)$ for some noise $\eta$ independent of $\theta$). In the TBAP context:*

$$s_1 \succeq_{\text{Blackwell}} s_2 \implies \text{EVII}(I, B, s_1) \geq \text{EVII}(I, B, s_2)$$

*This provides a partial ordering over context-loading strategies: strategy $s_1$ (e.g., reading the full file) dominates strategy $s_2$ (e.g., reading only the first 100 lines) if $s_2$ can be derived from $s_1$ by discarding information. However, if $s_1$ costs more tokens than $s_2$, the cost-adjusted comparison may favor $s_2$ (see condition 8).*

---

## 6. The Non-Monotone Quality Extension

### 6.1 Motivation

Empirical evidence demonstrates that quality is not always monotonically increasing in token consumption. Context rot (Chroma, 2025) shows measurable degradation at every input length increment across 18 frontier models. The "lost in the middle" phenomenon (Liu et al., 2024) documents over 30% accuracy drops when relevant information appears in middle positions. Coding agent research identifies a 35-minute threshold after which all agents show degraded success, with failure rates quadrupling when task time doubles.

### 6.2 The Degradation-Augmented Quality Function

**Definition 6.1** (Non-Monotone Quality Function). *A non-monotone quality function $q_k: \mathbb{R}_{\geq 0} \to (0, 1]$ has the decomposition:*

$$q_k(r) = q_k^+(r) - d_k(r) \tag{9}$$

*where:*
- *$q_k^+: \mathbb{R}_{\geq 0} \to (0, 1]$ is the benefit function, satisfying Axioms (Q1)-(Q5) with $r^{\max} = \infty$ (the "ideal" quality function without degradation).*
- *$d_k: \mathbb{R}_{\geq 0} \to [0, 1)$ is the degradation function, satisfying $d_k(0) = 0$, $d_k$ is non-decreasing, convex, and continuously differentiable.*
- *The combined function $q_k$ satisfies $q_k(r) > 0$ for all relevant $r$ (quality never reaches zero from degradation alone).*

**Definition 6.2** (Maximum Useful Budget). *The maximum useful budget for stage $k$ is:*

$$r_k^{\max} = \arg\max_{r \geq 0} q_k(r) \tag{10}$$

*At $r_k^{\max}$, the marginal benefit equals the marginal degradation:*

$$(q_k^+)'(r_k^{\max}) = d_k'(r_k^{\max}) \tag{11}$$

**Remark 6.1.** The maximum useful budget exists and is finite when $(q_k^+)'(0) > d_k'(0) = 0$ (benefit initially exceeds degradation) and $(q_k^+)'(r) \to 0$ as $r \to \infty$ while $d_k'(r) \to \delta_k > 0$ (degradation rate eventually dominates). Under these conditions, the intermediate value theorem guarantees a crossing point.

### 6.3 The Non-Monotone TBAP

**Definition 6.3** (Non-Monotone TBAP). *The non-monotone token budget allocation problem is:*

$$\max_{\mathbf{r} \geq 0} \prod_{k=1}^K q_k(r_k) \quad \text{subject to} \quad \sum p_k r_k \leq B$$

*where each $q_k$ is a non-monotone quality function (Definition 6.1).*

**Theorem 6.1** (Effective Budget Cap) [S]. *At the optimum of the non-monotone TBAP, $r_k^* \leq r_k^{\max}$ for all $k$.*

*Proof.* Suppose $r_k^* > r_k^{\max}$ for some $k$. Since $q_k$ is decreasing on $(r_k^{\max}, \infty)$, reducing $r_k$ to $r_k^{\max}$ increases $q_k(r_k)$ (and hence $Q$) while also reducing cost ($\sum p_k r_k$ decreases), leaving more budget for other stages. This contradicts optimality of $\mathbf{r}^*$. $\square$

**Corollary 6.1** (Effective Feasible Set) [S]. *The non-monotone TBAP is equivalent to the monotone TBAP with the additional constraints $r_k \leq r_k^{\max}$:*

$$\max_{\mathbf{r}} \prod q_k(r_k) \quad \text{s.t.} \quad \sum p_k r_k \leq B, \quad 0 \leq r_k \leq r_k^{\max} \;\forall k$$

*This is a concave maximization problem with linear and box constraints, solvable by standard methods. The box constraint $r_k \leq r_k^{\max}$ introduces an additional Lagrange multiplier $\mu_k^* \geq 0$ for each stage, and the modified first-order condition becomes:*

$$\frac{q_k'(r_k^*)}{q_k(r_k^*) \cdot p_k} = \lambda^* - \frac{\mu_k^*}{p_k}$$

*with $\mu_k^* > 0$ only if $r_k^* = r_k^{\max}$ (the cap binds).*

### 6.4 The Non-Monotone Submodular Connection

**Proposition 6.1** (Worst-Case Guarantees) [E]. *When the discrete version of the TBAP is viewed as non-monotone submodular maximization (context selection where including excess context degrades quality), a randomized linear-time algorithm achieves a $1/2$-approximation to the optimum (Buchbinder, Feldman, Naor, and Schwartz, 2015). This bound is tight in the value oracle model (Feige, Mirrokni, and Vondrak, 2011).*

*Relevance:* The $1/2$-approximation provides a worst-case safety net for the heuristic of capping each stage's budget at $r_k^{\max}$ and then solving the residual monotone problem. Even without precisely estimating $r_k^{\max}$, a randomized approach guarantees at least half the optimal quality.

---

## 7. The Cost-Adjusted Value of Information per Hour (CVIH) Metric

### 7.1 Definition

**Definition 7.1** (CVIH). *The Cost-Adjusted Value of Information per Hour is defined as:*

$$\text{CVIH} = \frac{\lambda_{\text{raw}} \cdot p_{\text{verify}}}{C_{\text{total}}} \tag{12}$$

*where:*
- *$\lambda_{\text{raw}}$ is the raw (unnormalized) shadow price of the budget constraint at the current allocation, measuring the marginal log-quality improvement per dollar.*
- *$p_{\text{verify}}$ is the cost of one unit of verification (the price of confirming whether the quality improvement was realized), normalizing the shadow price to a verifiable scale.*
- *$C_{\text{total}}$ is the total cost incurred by the current allocation.*

**Remark 7.1.** CVIH is a "bang per buck" metric: it measures the quality improvement attainable per dollar of total expenditure, normalized by the cost of verifying that improvement. High CVIH indicates that the harness is in a regime where additional spending yields large, verifiable quality gains relative to current expenditure. Low CVIH indicates diminishing returns or over-spending.

### 7.2 Connection to Quality-Per-Dollar Optimization

**Theorem 7.1** (CVIH and Efficiency Frontier) [S]. *Maximizing $Q/C$ (overall quality per dollar), subject to achieving some minimum quality threshold, is equivalent to finding the point on the Pareto frontier $Q^*(B)$ where the line from the origin is tangent to the frontier.*

*Proof.* The ratio $Q^*(B) / B$ is maximized when:

$$\frac{d}{dB}\left[\frac{Q^*(B)}{B}\right] = \frac{Q^{*\prime}(B) \cdot B - Q^*(B)}{B^2} = 0$$

This gives $Q^{*\prime}(B) = Q^*(B) / B$, i.e., the marginal quality equals the average quality. Geometrically, this is the point where the ray from the origin is tangent to the $Q^*$ curve. By Theorem 4.2, $Q^{*\prime}(B) = \lambda^*(B) \cdot Q^*(B)$, so the tangency condition becomes:

$$\lambda^*(B) \cdot Q^*(B) = \frac{Q^*(B)}{B} \implies \lambda^*(B) = \frac{1}{B} \tag{13}$$

At the efficiency-maximizing budget, the shadow price equals the reciprocal of the budget. $\square$

**Corollary 7.1** (CVIH at the Efficient Point) [S]. *At the quality-per-dollar-maximizing budget $B_{\text{eff}}$, where $\lambda^*(B_{\text{eff}}) = 1/B_{\text{eff}}$:*

$$\text{CVIH}(B_{\text{eff}}) = \frac{p_{\text{verify}}}{B_{\text{eff}}^2}$$

*This provides a calibration target: a harness operating at CVIH significantly above this level is under-spending (could profitably invest more); a harness significantly below is over-spending.*

### 7.3 Operational Interpretation

**Proposition 7.1** (CVIH as a Steering Signal) [S]. *For a harness dynamically adjusting its budget across tasks, the CVIH trajectory provides three decision signals:*

1. *CVIH $\gg 1/B$: The harness is in the "high return" regime. Increase budget until CVIH falls to $1/B$.*
2. *CVIH $\approx 1/B$: The harness is at the efficiency frontier. Hold budget.*
3. *CVIH $\ll 1/B$: The harness is in the "diminishing returns" regime. Reduce budget or reallocate across stages.*

*The transitions between these regimes correspond to movement along the Pareto frontier $Q^*(B)$, with CVIH acting as the local gradient indicator.*

---

## 8. Notation Table

| Symbol | Definition | Section |
|--------|-----------|---------|
| $K$ | Number of pipeline stages | 1.1 |
| $k$ | Stage index, $k \in \{1, \ldots, K\}$ | 1.1 |
| $\mathbf{r} = (r_1, \ldots, r_K)$ | Token allocation vector | 1.1 |
| $\mathbf{p} = (p_1, \ldots, p_K)$ | Price vector (dollars per token) | 1.1 |
| $q_k(r_k)$ | Quality function for stage $k$ | 1.2 |
| $B$ | Total budget (dollars) | 1.1 |
| $Q(\mathbf{r}) = \prod q_k(r_k)$ | Overall pipeline quality (multiplicative) | 1.3 |
| $L(\mathbf{r}) = \sum \log q_k(r_k)$ | Log-transformed quality | 1.4 |
| $\lambda^*$ | Optimal Lagrange multiplier (shadow price of budget) | 1.5 |
| $\mathcal{A}$ | Active set: stages with $r_k^* > 0$ | 2 |
| $Q^*(B)$ | Pareto frontier: optimal quality at budget $B$ | 4.1 |
| $L^*(B) = \log Q^*(B)$ | Log-Pareto frontier | 4.1 |
| $I$ | Information state (distribution over unknowns) | 5.1 |
| $\text{EVPI}$ | Expected Value of Perfect Information | 5.2 |
| $\text{EVII}$ | Expected Value of Imperfect Information | 5.2 |
| $q_k^+(r)$ | Benefit component of non-monotone quality | 6.2 |
| $d_k(r)$ | Degradation component | 6.2 |
| $r_k^{\max}$ | Maximum useful budget for stage $k$ | 6.2 |
| $\text{CVIH}$ | Cost-Adjusted Value of Information per Hour | 7.1 |
| $p_{\text{verify}}$ | Cost of one unit of verification | 7.1 |

---

## 9. Summary of Formal Results

| # | Result | Type | Status | Key Source |
|---|--------|------|--------|------------|
| Def 1.1 | Pipeline model | Definition | [S] Novel formulation | --- |
| Def 1.2 | Admissible quality function (5 axioms) | Definition | [S] Novel axiomatization | --- |
| Def 1.3 | Token Budget Allocation Problem | Definition | [S] Novel formulation | --- |
| Prop 1.1 | Log-transformation equivalence | Proposition | [E] Standard | Boyd and Vandenberghe (2004) |
| Prop 1.2 | Concavity of log-transformed objective | Proposition | [E] Standard | Boyd and Vandenberghe (2004) |
| Cor 1.1 | TBAP is a convex program | Corollary | [E] Standard | Slater's condition |
| Thm 1.1 | KKT conditions for TBAP | Theorem | [E+S] Standard KKT, novel application | Bertsekas (1999) |
| Thm 1.2 | Uniqueness of optimal allocation | Theorem | [E] Standard strict concavity | Boyd and Vandenberghe (2004) |
| Thm 2.1 | Equal Marginal Rate theorem | Theorem | [S] Novel synthesis | Kelly (1956), Markowitz (1976) |
| Cor 2.1 | Inactive stage criterion | Corollary | [E+S] | KKT complementary slackness |
| Cor 2.2 | Connection to Kelly criterion | Corollary | [S] Novel connection | Kelly (1956), Markowitz (1976) |
| Thm 3.1 | AM-GM inequality | Theorem | [E] Classical | --- |
| Thm 3.2 | Weakest-link (identical stages) | Theorem | [S] Novel application | Jensen's inequality |
| Thm 3.3 | Approximate equalization (heterogeneous) | Theorem | [S] Novel result | First-order conditions |
| Prop 3.1 | Sensitivity to minimum quality | Proposition | [S] Novel bound | --- |
| Cor 3.1 | Marginal value of floor-raising | Corollary | [S] Novel | --- |
| Def 4.1 | Cost-quality Pareto frontier | Definition | [S] Novel formulation | --- |
| Prop 4.1 | Monotonicity of frontier | Proposition | [E] Standard | Subset feasibility |
| Thm 4.1 | Log-concavity of Pareto frontier | Theorem | [E+S] Standard technique, novel application | Rockafellar (1970) |
| Thm 4.2 | Envelope theorem for TBAP | Theorem | [E+S] Standard, novel context | Danskin's theorem |
| Cor 4.2 | Diminishing returns on budget | Corollary | [E+S] | Concavity of $L^*$ |
| Def 5.1-5.3 | Information state, acquisition, EVII | Definitions | [S] Novel extension of Howard (1966) | Howard (1966) |
| Prop 5.1 | Bounds on EVII | Proposition | [E] Standard | Blackwell (1953) |
| Thm 5.1 | Optimal information acquisition | Theorem | [S] Novel criterion | Howard (1966) |
| Cor 5.1 | Blackwell ordering of signals | Corollary | [E+S] | Blackwell (1953) |
| Def 6.1-6.3 | Non-monotone quality, max useful budget | Definitions | [S] Novel formalization | Chroma (2025), Liu et al. (2024) |
| Thm 6.1 | Effective budget cap | Theorem | [S] Novel | --- |
| Cor 6.1 | Reduction to box-constrained monotone problem | Corollary | [S] Novel | --- |
| Prop 6.1 | Non-monotone submodular guarantees | Proposition | [E] Established | Buchbinder et al. (2015) |
| Def 7.1 | CVIH metric | Definition | [S] Novel metric | --- |
| Thm 7.1 | CVIH and efficiency frontier tangency | Theorem | [S] Novel | --- |
| Cor 7.1 | CVIH calibration at efficient point | Corollary | [S] Novel | --- |
| Prop 7.1 | CVIH as operational steering signal | Proposition | [S] Novel | --- |

**Status legend:** [E] = Established theory applied directly; [E+S] = Established technique in novel application; [S] = Novel synthesis or result; [C] = Conjectured.

---

## 10. References

- Bagnoli, M. and Bergstrom, T. (2005). "Log-Concave Probability and Its Applications." *Economic Theory*, 26(2), 445-469.
- Barlow, R.E. and Proschan, F. (1975). *Statistical Theory of Reliability and Life Testing*. Holt, Rinehart and Winston.
- Bertsekas, D.P. (1999). *Nonlinear Programming*, 2nd ed. Athena Scientific.
- Blackwell, D. (1953). "Equivalent Comparisons of Experiments." *Annals of Mathematical Statistics*, 24(2), 265-272.
- Boyd, S. and Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press.
- Buchbinder, N., Feldman, M., Naor, J., and Schwartz, R. (2015). "A Tight Linear Time (1/2)-Approximation for Unconstrained Submodular Maximization." *SIAM Journal on Computing*, 44(5), 1384-1402.
- Chroma (2025). "Context Rot: Evaluating Frontier Model Performance at Scale." Technical Report.
- Cover, T.M. and Thomas, J.A. (2006). *Elements of Information Theory*, 2nd ed. Wiley.
- Feige, U., Mirrokni, V.S., and Vondrak, J. (2011). "Maximizing Non-Monotone Submodular Functions." *SIAM Journal on Computing*, 40(4), 1133-1153.
- Howard, R.A. (1966). "Information Value Theory." *IEEE Transactions on Systems Science and Cybernetics*, SSC-2(1), 22-26.
- Kelly, J.L. Jr. (1956). "A New Interpretation of Information Rate." *Bell System Technical Journal*, 35(4), 917-926.
- Liu, N.F. et al. (2024). "Lost in the Middle: How Language Models Use Long Contexts." *Transactions of the ACL*, 12, 157-173.
- Markowitz, H. (1952). "Portfolio Selection." *Journal of Finance*, 7(1), 77-91.
- Markowitz, H. (1976). "Investment for the Long Run: New Evidence for an Old Rule." *Journal of Finance*, 31(5), 1273-1286.
- Mas-Colell, A., Whinston, M.D., and Green, J.R. (1995). *Microeconomic Theory*. Oxford University Press.
- Nemhauser, G.L., Wolsey, L.A., and Fisher, M.L. (1978). "An Analysis of Approximations for Maximizing Submodular Set Functions." *Mathematical Programming*, 14(1), 265-294.
- Rockafellar, R.T. (1970). *Convex Analysis*. Princeton University Press.
- Sviridenko, M. (2004). "A Note on Maximizing a Submodular Set Function Subject to a Knapsack Constraint." *Operations Research Letters*, 32(1), 41-43.
