# Research Report: Submodularity, Diminishing Returns, and Optimization Theory for Token Budget Allocation

## Research Dimension R4 -- Economics Architecture

**Date:** 2026-04-03
**Scope:** Mathematical foundations for the token budget allocation problem: submodular maximization, concave optimization under linear constraints, the log-transform trick, weakest-link structure, Pareto frontiers, water-filling, non-monotone effects, and stochastic knapsack formulations.

---

## 1. Submodular Function Maximization

### 1.1 Definitions and Diminishing Returns

A set function f: 2^N -> R is **submodular** if for all A, B subseteq N:

    f(A) + f(B) >= f(A cup B) + f(A cap B)

An equivalent characterization (for monotone functions) is the **diminishing returns** property: for all A subseteq B subseteq N and e not in B:

    f(A cup {e}) - f(A) >= f(B cup {e}) - f(B)

Adding an element to a smaller set yields at least as much marginal gain as adding it to a larger set. This is the discrete analogue of concavity and captures the intuition that additional tokens (or additional context, or additional compute) provide decreasing marginal value (Nemhauser, Wolsey, and Fisher, 1978; Krause and Golovin, 2014).

### 1.2 The Greedy Guarantee Under Cardinality Constraints

**Theorem (Nemhauser, Wolsey, Fisher, 1978).** Let f: 2^N -> R be a non-negative monotone submodular function. The greedy algorithm, which iteratively adds the element with the largest marginal gain, produces a set S_K of size K satisfying:

    f(S_K) >= (1 - 1/e) * f(OPT_K)

where OPT_K is the optimal set of size K. The factor (1 - 1/e) approximately equals 0.632.

**Proof sketch.** At each step i, the greedy element has marginal gain at least (f(OPT) - f(S_i)) / K by submodularity. This yields the recurrence f(OPT) - f(S_{i+1}) <= (1 - 1/K)(f(OPT) - f(S_i)), which telescopes to give f(S_K) >= (1 - (1 - 1/K)^K) f(OPT) >= (1 - 1/e) f(OPT).

**Tightness.** This bound is optimal in the value oracle model: no algorithm making polynomially many queries to a value oracle can achieve a ratio better than (1 - 1/e) (Nemhauser and Wolsey, 1978).

**Application to token allocation.** When the set of "items" corresponds to information chunks (context snippets, retrieved code, documentation), and f measures usefulness for a pipeline stage, the greedy algorithm for context selection inherits this guarantee.

### 1.3 Extension to Knapsack Constraints

When items have heterogeneous costs (as tokens from different sources have different per-token costs or different information densities), the cardinality constraint generalizes to a knapsack constraint: sum c_i x_i <= B.

**Theorem (Sviridenko, 2004).** For maximizing a non-negative monotone submodular function subject to a knapsack constraint, a modified greedy algorithm (which enumerates all triples of elements, then greedily fills the remainder) achieves the optimal (1 - 1/e) approximation ratio. The algorithm requires O(n^5) function evaluations.

This is directly relevant to our problem: each pipeline stage can be viewed as selecting a subset of available information under a token budget, where different information sources have different token costs.

### 1.4 Mutual Information as a Submodular Function

A canonical example of submodularity in machine learning is mutual information. For a set of random variables X_A = {X_i : i in A}:

    f(A) = I(X_A; Y)

is submodular in A for fixed Y (Krause, Singh, and Guestrin, 2008). This follows from the chain rule for mutual information and the fact that conditioning reduces entropy.

**Connection.** If we model the "information gathered" by a pipeline stage as a set of observations, and the "quality" of the stage output as mutual information between observations and the target, then the quality function inherits submodularity. The greedy algorithm for observation selection (deciding which context to include) thus enjoys the (1 - 1/e) guarantee.

---

## 2. Concave Maximization Under Linear Constraints

### 2.1 The Continuous Relaxation

Our core problem has the structure:

    max sum_{k=1}^K f_k(x_k)   subject to   sum_{k=1}^K c_k x_k <= B,   x_k >= 0

where each f_k is concave. After negation, this is a convex minimization problem, solvable exactly by standard methods (interior-point, KKT conditions).

### 2.2 First-Order Optimality (KKT Conditions)

**Theorem.** At the optimum (x_1*, ..., x_K*), there exists a multiplier lambda* >= 0 such that for each k:

    f_k'(x_k*) = lambda* c_k    if x_k* > 0
    f_k'(x_k*) <= lambda* c_k    if x_k* = 0

**Interpretation: the equal marginal rate condition.** At optimality, the marginal return per unit cost is equalized across all active (non-zero-allocation) stages:

    f_k'(x_k*) / c_k = lambda*    for all k with x_k* > 0

This says: the last dollar spent on any stage produces exactly the same marginal benefit. If one stage offered a higher marginal return per dollar, budget should be shifted toward it, contradicting optimality.

**The shadow price.** The multiplier lambda* equals df*/dB, the marginal value of relaxing the budget constraint by one unit. Economically, lambda* is the "price of a token dollar": how much total quality improves if the budget increases by one unit (Bertsekas, 1999; Boyd and Vandenberghe, 2004).

### 2.3 Application to Token Allocation

Translating to our setting: if stage k has quality function f_k(r_k) (concave in token allocation r_k) and cost p_k per token, the additive optimization problem max sum f_k(r_k) subject to sum p_k r_k <= B has the solution characterized by:

    f_k'(r_k*) / p_k = lambda*

for all active stages. The stage with the steepest quality curve at low allocations receives proportionally more budget.

---

## 3. The Log-Transform Trick for Multiplicative Objectives

### 3.1 The Transformation

Our actual problem is multiplicative:

    max prod_{k=1}^K q_k(r_k)   subject to   sum p_k r_k <= B

Taking logarithms converts this to:

    max sum_{k=1}^K log(q_k(r_k))   subject to   sum p_k r_k <= B

### 3.2 When Does the Log-Transform Preserve Concavity?

We need log(q_k(r)) to be concave in r. By the composition rule for concave functions (Boyd and Vandenberghe, 2004, Section 3.2.4):

**Proposition.** If h: R -> R is concave and non-decreasing, and g: R -> R is concave, then h(g(x)) is concave. Since log is concave and non-decreasing on R_{>0}, we need q_k to be concave and positive.

However, there is a subtlety. The composition rule states: h(g(x)) is concave if h is concave and non-decreasing and g is concave. The log function is concave and non-decreasing on its domain, so:

**Theorem (Log-Concavity Preservation).** If q_k: R_{>=0} -> R_{>0} is concave and positive, then log(q_k(r)) is concave in r.

**Proof.** We verify concavity of the composition directly. For the scalar case, (log circ q_k)''(r) = q_k''(r)/q_k(r) - (q_k'(r))^2/(q_k(r))^2. Since q_k is concave (q_k'' <= 0) and positive (q_k > 0), the first term is non-positive; the second term is always non-positive. Hence (log circ q_k)'' <= 0.

**Remark.** The condition "q_k concave and positive" is sufficient but not necessary. A broader sufficient condition is log-concavity of q_k, meaning log(q_k) is directly concave. Every concave positive function is log-concave, but some log-concave functions (such as the Gaussian density) are not globally concave.

### 3.3 The Transformed First-Order Condition

Applying the KKT conditions to the log-transformed problem:

    d/dr_k [log(q_k(r_k))] = lambda* p_k

    q_k'(r_k*) / q_k(r_k*) = lambda* p_k

Rearranging:

    q_k'(r_k*) / (q_k(r_k*) * p_k) = lambda*

**Interpretation: equalize the relative marginal quality per dollar.** At the optimum, the *elasticity-like* quantity (marginal quality divided by current quality, per dollar spent) is the same across all stages. Stages with lower current quality get proportionally more investment because the same absolute improvement represents a larger relative gain.

This is the formal mechanism behind the "raise the floor" principle.

---

## 4. The Weakest-Link Structure and AM-GM

### 4.1 The Product is Maximized by Equality

**Theorem (AM-GM Inequality).** For non-negative reals q_1, ..., q_K:

    (q_1 * q_2 * ... * q_K)^{1/K} <= (q_1 + q_2 + ... + q_K) / K

with equality if and only if q_1 = q_2 = ... = q_K.

**Corollary.** Among all allocations (r_1, ..., r_K) with a fixed sum of qualities sum q_k(r_k) = Q, the product prod q_k(r_k) is maximized when all qualities are equal: q_k = Q/K for all k.

### 4.2 The Minimum Structure

If quality were defined as Q = min_k q_k(r_k) (the "weakest link" model), the optimal allocation would trivially equalize q_k across stages, since any inequality means budget is wasted on a non-binding stage.

For the product structure Q = prod q_k(r_k), the optimality condition in Section 3.3 shows that the product objective *approximately* behaves like the minimum. The first-order condition q_k'(r_k*) / (q_k(r_k*) p_k) = lambda* means that stages with lower q_k receive higher priority (lower q_k in the denominator makes the ratio larger for a given marginal improvement, so the optimizer invests more to equalize).

### 4.3 The "Raise the Floor" Principle

**Proposition.** In the multiplicative quality model, for any pair of stages i, j, a marginal transfer of budget from stage i to stage j improves total quality if and only if:

    q_i'(r_i) / (q_i(r_i) * p_i)  <  q_j'(r_j) / (q_j(r_j) * p_j)

That is, budget should flow toward stages where the relative marginal quality per dollar is highest. When quality functions are similar across stages, this systematically favors the lowest-quality stage, implementing the "raise the floor" heuristic.

**Practical implication.** In a multi-stage AI coding pipeline, if the test-generation stage has quality 0.7 while the code-generation stage has quality 0.95, the marginal dollar on testing produces a larger relative improvement. The product 0.7 * 0.95 = 0.665 would improve more from raising 0.7 to 0.75 (new product: 0.75 * 0.95 = 0.7125) than from raising 0.95 to 1.0 (new product: 0.7 * 1.0 = 0.70).

---

## 5. Pareto Frontier Properties

### 5.1 Definition

The **cost-quality Pareto frontier** is the set of (B, Q*) pairs where Q*(B) = max prod q_k(r_k) subject to sum p_k r_k <= B. It represents the optimal quality achievable at each budget level.

### 5.2 Concavity of the Frontier

**Theorem.** If each q_k is concave and positive, then Q*(B) is a concave function of B (equivalently, the Pareto frontier in (B, Q*) space is a concave curve).

**Proof sketch.** Consider two budgets B_1 < B_2 with optimal allocations r^{(1)}, r^{(2)}. For any alpha in [0,1], the convex combination alpha r^{(1)} + (1-alpha) r^{(2)} is feasible at budget alpha B_1 + (1-alpha) B_2 (by linearity of the cost constraint). By concavity of each log(q_k) and the fact that log(Q*) = sum log(q_k(r_k*)):

    log Q*(alpha B_1 + (1-alpha) B_2) >= alpha log Q*(B_1) + (1-alpha) log Q*(B_2)

This establishes log-concavity of Q* in B. Since log-concavity implies concavity for positive functions on convex domains, Q* is concave in B.

### 5.3 The Slope is the Lagrange Multiplier

**Theorem.** The slope of the Pareto frontier at budget B equals the optimal Lagrange multiplier:

    dQ*/dB = lambda*(B) * Q*(B)

(Note: for the log-transformed problem, d(log Q*)/dB = lambda*.)

**Economic interpretation.** lambda* is the marginal rate of substitution between budget and (log) quality. At low budgets, lambda* is large (additional budget is very valuable); as budget increases, lambda* decreases (diminishing returns at the portfolio level). This gives a principled way to determine "when to stop spending": when lambda* falls below the organization's willingness-to-pay for quality.

---

## 6. Water-Filling and Its Generalizations

### 6.1 The Classical Water-Filling Solution

The paradigmatic water-filling problem arises in information theory (Cover and Thomas, 2006, Chapter 10). Given K parallel Gaussian channels with noise powers N_1, ..., N_K and a total power constraint P, the capacity-maximizing power allocation is:

    P_k = (nu - N_k)^+

where (x)^+ = max(0, x) and nu is chosen so that sum P_k = P.

The optimality condition is:

    1 / (N_k + P_k) = 1/nu    for all k with P_k > 0

This is the equal marginal return condition: the marginal capacity gain per unit power is 1/(N_k + P_k), and at optimality this is equalized across all active channels.

### 6.2 Visual Intuition

Imagine K containers with floor levels N_1, ..., N_K. Pour water (budget) into the system; it fills from the bottom up. At equilibrium, the water level nu is equal across all containers that have water (active channels). Containers with floors above nu remain empty (channels too noisy to be worth using).

### 6.3 Connection to Token Budget Allocation

Each pipeline stage k is a "channel" with:
- "Noise level" inversely related to the base quality of the stage (how much budget it needs to achieve useful output)
- "Power allocation" P_k corresponding to the token budget r_k for that stage
- "Capacity" corresponding to log(q_k(r_k))

The water-filling solution tells us:
1. Not all stages need equal budget (those with low base quality need more)
2. Some stages may optimally receive zero budget if their base quality is too low relative to the budget level (analogous to turning off noisy channels)
3. As total budget increases, additional stages become "active" (the water level rises above their floor)

### 6.4 Generalization to Non-Identical Costs

When stages have different per-token costs p_k, the water-filling analogy extends: the "floor" of container k is N_k / p_k (cost-adjusted noise), and the equal marginal return condition becomes q_k'(r_k) / (q_k(r_k) * p_k) = lambda*, matching Section 3.3 exactly.

---

## 7. Non-Monotone Submodular Maximization: When More Tokens Hurt

### 7.1 Empirical Evidence for Non-Monotonicity

Recent empirical work demonstrates that quality is not always monotonically increasing in token consumption:

- **Context rot (Chroma, 2025):** Testing 18 frontier models (GPT-4.1, Claude Opus 4, Gemini 2.5), researchers found measurable performance degradation at every input length increment tested, even well below context window limits. Models with 200K-token windows show significant degradation at 50K tokens.
- **Lost in the middle (Liu et al., 2024):** In multi-document QA, accuracy drops by over 30% when relevant information appears in middle positions (positions 5-15) versus the start or end of context.
- **Coding agent performance:** Research shows a 35-minute threshold after which all agents show degraded success; doubling task time quadruples failure rate, indicating non-linear degradation in extended coding sessions. Agents spend over 60% of their first turn retrieving context, with 10x token variance on equivalent tasks.

These findings suggest that q_k(r_k) has an interior maximum: quality increases with tokens up to a point, then degrades.

### 7.2 Formal Framework

Model the quality function as:

    q_k(r_k) = q_k^+(r_k) - d_k(r_k)

where q_k^+(r_k) is the benefit from information (concave, non-decreasing) and d_k(r_k) is the degradation from excess context (convex, non-decreasing, d_k(0) = 0). The quality function q_k is then concave up to the peak, then decreasing.

**First-order condition for the interior maximum:**

    (q_k^+)'(r_k^max) = d_k'(r_k^max)

This defines a **maximum useful budget** r_k^max for each stage, beyond which additional tokens are harmful.

### 7.3 Approximation Guarantees for Non-Monotone Objectives

**Theorem (Buchbinder, Feldman, Naor, Schwartz, 2015).** For unconstrained maximization of a non-negative submodular function, a randomized linear-time algorithm achieves a 1/2-approximation. This is tight: no algorithm using subexponentially many value oracle queries can exceed 1/2 (Feige, Mirrokni, and Vondrak, 2011).

**Theorem (Feige, Mirrokni, Vondrak, 2011).** For maximizing a general non-negative (non-monotone) submodular function:
- A deterministic local-search algorithm achieves a 1/3-approximation
- A randomized algorithm achieves a 2/5-approximation
- A uniformly random set gives a 1/4-approximation
- For symmetric submodular functions, a random set gives a 1/2-approximation (tight)

**Connection to token allocation.** If the quality function is non-monotone (has a peak), the unconstrained problem "find the best token allocation for a single stage" is a non-monotone optimization. The 1/2-approximation guarantee means that even without finding the exact peak, a simple randomized strategy gets at least half the optimal quality. For the constrained multi-stage problem, these results inform the worst-case guarantees available.

---

## 8. The Stochastic Knapsack and Model Tier Selection

### 8.1 Problem Formulation

The model tier selection problem assigns one of M available models to each of K pipeline stages. Each model m has:
- Capability c_m (quality ceiling)
- Cost per token p_m

Each stage k has a minimum capability requirement c_k^min. The problem:

    max prod_{k=1}^K q_k(r_k, m_k)    subject to    sum p_{m_k} r_k <= B,   c_{m_k} >= c_k^min for all k

where m_k in {1, ..., M} is the model assignment and r_k is the token allocation. This is a joint discrete-continuous optimization.

### 8.2 Connection to the Generalized Assignment Problem

The **Generalized Assignment Problem (GAP)** assigns n items to m bins, each with a capacity, maximizing total profit. Our model selection problem is a variant: K stages (items) must be assigned to M model tiers (bins), with the global budget constraint replacing per-bin capacities.

**Theorem (Chekuri and Khanna, 2005).** The GAP is APX-hard; the best polynomial-time approximation achieves a factor of (1 - 1/e) for certain variants. For the multiple knapsack problem (a special case), a PTAS exists.

**Practical approach for our problem.** Since M (number of model tiers) is typically small (3-5: e.g., small/medium/large/frontier), we can enumerate all M^K assignments (feasible for K <= 10 stages and M <= 5 tiers) and solve the continuous budget allocation for each assignment, selecting the best. For larger instances, the cost-effective greedy heuristic (assign the cheapest model meeting c_k^min, then upgrade greedily using remaining budget) performs well in practice.

### 8.3 The Stochastic Extension

When model capabilities or stage requirements are uncertain (stochastic), the problem becomes a **stochastic knapsack problem**.

**Theorem (Dean, Goemans, Vondrak, 2008).** For the adaptive stochastic knapsack, a polynomial-time algorithm computes a non-adaptive policy whose expected value approximates the optimal adaptive policy within a factor of 4; an adaptive algorithm achieves a (3 + epsilon)-approximation. More recent work achieves (2 + epsilon).

In our setting, stochasticity arises because:
- The actual token consumption of a stage is uncertain before execution
- The quality achieved by a model on a particular task is stochastic
- The difficulty of sub-tasks varies across instances

---

## 9. Theorems to Include in Paper

The following 7 formal results are the most important for the economics architecture paper, listed with full statements:

### Theorem 1: Greedy Approximation for Monotone Submodular Maximization (Nemhauser, Wolsey, Fisher, 1978)

For a non-negative monotone submodular function f and cardinality constraint |S| <= K, the greedy algorithm achieves f(S_greedy) >= (1 - 1/e) f(OPT). This is optimal in the value oracle model.

*Relevance:* Establishes worst-case guarantees for context selection within a single pipeline stage.

### Theorem 2: Equal Marginal Rate Optimality (KKT for Concave Separable Programs)

For max sum f_k(x_k) subject to sum c_k x_k <= B, x_k >= 0, with each f_k concave, the optimal solution satisfies f_k'(x_k*) / c_k = lambda* for all active k. The multiplier lambda* = df*/dB is the shadow price of the budget.

*Relevance:* Characterizes the optimal token allocation when quality is additive.

### Theorem 3: Log-Transform Optimality for Multiplicative Objectives

For max prod q_k(r_k) subject to sum p_k r_k <= B, with each q_k concave and positive, the optimal allocation satisfies q_k'(r_k*) / (q_k(r_k*) p_k) = lambda* for all active k. This equalizes the relative marginal quality per dollar across stages.

*Relevance:* This is our central optimality condition, governing how budget flows across pipeline stages.

### Theorem 4: AM-GM and the Raise-the-Floor Principle

prod_{k=1}^K q_k <= (sum q_k / K)^K with equality iff q_1 = ... = q_K. Therefore, for a fixed total quality budget, the product is maximized by equalizing qualities across stages.

*Relevance:* Provides the intuitive and formal justification for investing disproportionately in the weakest pipeline stage.

### Theorem 5: Concavity of the Pareto Frontier

If each q_k is concave and positive, then Q*(B) = max_{sum p_k r_k <= B} prod q_k(r_k) is log-concave (and hence concave) in B. The slope satisfies d(log Q*)/dB = lambda*.

*Relevance:* Establishes diminishing returns at the portfolio level and links the Lagrange multiplier to the observable cost-quality tradeoff.

### Theorem 6: Non-Monotone Submodular Approximation (Buchbinder et al., 2015; Feige et al., 2011)

For unconstrained maximization of a non-negative submodular function, a 1/2-approximation is achievable in linear time and is tight in the value oracle model.

*Relevance:* Governs the case where quality peaks and then degrades with excess tokens (context rot), providing worst-case guarantees.

### Theorem 7: Sviridenko's Knapsack Extension (Sviridenko, 2004)

For maximizing a non-negative monotone submodular function subject to a knapsack constraint sum c_i x_i <= B, a modified greedy algorithm achieves the optimal (1 - 1/e) approximation.

*Relevance:* Extends Theorem 1 to heterogeneous token costs, which is the realistic setting where different context sources have different token prices.

---

## 10. Novelty Assessment: What Is Ours vs. What Is Established

### Established Results (Cited from Literature)

1. **The (1-1/e) greedy bound** (Nemhauser, Wolsey, Fisher, 1978) and its knapsack extension (Sviridenko, 2004): classical combinatorial optimization.
2. **KKT conditions and equal marginal rate**: standard convex optimization (Boyd and Vandenberghe, 2004; Bertsekas, 1999).
3. **Water-filling solution**: classical information theory (Cover and Thomas, 2006).
4. **AM-GM inequality**: elementary mathematics, though its application to product-form quality objectives is a standard optimization technique.
5. **Non-monotone submodular maximization**: Feige, Mirrokni, Vondrak (2011); Buchbinder, Feldman, Naor, Schwartz (2015).
6. **Generalized assignment problem**: Chekuri and Khanna (2005); well-studied in combinatorial optimization.
7. **Context rot / lost-in-the-middle**: Liu et al. (2024); Chroma (2025).
8. **Log-concavity preservation under composition**: Boyd and Vandenberghe (2004), Section 3.5; Bagnoli and Bergstrom (2005).

### Novel Contributions (Our Application and Synthesis)

1. **The multiplicative quality model for pipeline stages.** While product-form objectives appear in reliability engineering (series systems) and information theory (parallel channels), applying the multiplicative model to AI coding agent pipelines where quality compounds across stages (planning, coding, testing, reviewing) is, to our knowledge, novel.

2. **The transformed optimality condition q_k'(r_k) / (q_k(r_k) p_k) = lambda* as a design principle.** The "equalize relative marginal quality per dollar" rule, while following directly from the log-transform of a known optimization structure, has not been articulated as a harness design principle. We give it operational meaning: the harness should monitor the quality-cost ratio at each stage and dynamically reallocate tokens.

3. **The non-monotone quality model with degradation.** The decomposition q_k(r_k) = q_k^+(r_k) - d_k(r_k) and the resulting notion of a "maximum useful budget" per stage synthesize the empirical findings on context rot with the formal framework of non-monotone submodular maximization. The specific connection between the 1/2-approximation guarantee and the practical heuristic of capping token budgets is novel.

4. **The water-filling analogy for pipeline stages.** While water-filling is a standard information-theoretic solution, its application to token budget allocation across pipeline stages (with the "noise level" interpreted as the inherent difficulty or base inefficiency of each stage, and "capacity" as log-quality) is a novel analogy that provides both visual intuition and computational methodology.

5. **The joint model-selection-and-allocation problem as a structured GAP variant.** Formulating the combined problem of choosing model tiers and allocating tokens as a generalized assignment problem with a multiplicative objective is novel. The practical observation that small M allows exhaustive enumeration of the discrete component, reducing to a set of continuous optimization subproblems, is a useful structural insight.

6. **The Pareto frontier characterization with shadow price interpretation for AI systems.** Proving that the cost-quality Pareto frontier is log-concave in budget, and interpreting the Lagrange multiplier as the marginal "price of quality" that a harness operator can use for budget decisions, synthesizes standard optimization theory into a novel decision framework for AI engineering economics.

---

## 11. Key References

| Citation | Contribution | Used In |
|----------|-------------|---------|
| Nemhauser, Wolsey, Fisher (1978) | (1-1/e) greedy bound for submodular maximization | Sections 1, 9 (Theorem 1) |
| Sviridenko (2004) | Optimal approximation for submodular + knapsack | Sections 1.3, 9 (Theorem 7) |
| Krause, Singh, Guestrin (2008) | Mutual information as submodular; sensor placement | Section 1.4 |
| Golovin, Krause (2011) | Adaptive submodularity; JAIR | Section 1.1 |
| Boyd, Vandenberghe (2004) | Convex optimization; composition rules | Sections 2, 3 |
| Bertsekas (1999) | Nonlinear programming; KKT conditions | Section 2 |
| Cover, Thomas (2006) | Water-filling; parallel Gaussian channels | Section 6 |
| Feige, Mirrokni, Vondrak (2011) | Non-monotone submodular maximization hardness | Section 7.3 |
| Buchbinder, Feldman, Naor, Schwartz (2015) | Tight 1/2-approximation for non-monotone unconstrained | Section 7.3 |
| Dean, Goemans, Vondrak (2008) | Stochastic knapsack approximation | Section 8.3 |
| Chekuri, Khanna (2005) | GAP and multiple knapsack PTAS | Section 8.2 |
| Liu et al. (2024) | Lost-in-the-middle effect | Section 7.1 |
| Chroma (2025) | Context rot; empirical degradation across 18 models | Section 7.1 |
| Bagnoli, Bergstrom (2005) | Log-concavity in economic applications | Section 3.2 |

---

## 12. Open Questions and Directions

1. **Empirical estimation of q_k.** The entire framework depends on having estimates of the quality functions q_k(r_k). How should these be estimated from observational data? Bayesian approaches with Gaussian process priors on q_k could provide uncertainty-aware budget allocation.

2. **Dynamic budget reallocation.** The static optimization assumes all allocations are decided upfront. In practice, a harness observes intermediate results and can reallocate remaining budget. This connects to adaptive submodularity (Golovin and Krause, 2011) and online optimization.

3. **Correlated stage qualities.** The multiplicative model assumes stages are independent given their allocations. In reality, a poor planning stage affects the code generation stage through the quality of its output, not just through the product. Modeling these dependencies requires a more sophisticated graphical model.

4. **Non-concave regions.** Some quality functions may have sigmoid shapes (convex at low budgets, concave at high budgets) due to minimum viable token thresholds. The optimization landscape becomes non-convex, requiring different techniques (e.g., branch-and-bound, or convex-concave procedures).

5. **Multi-objective extensions.** Beyond quality and cost, other objectives (latency, reliability, interpretability) create a multi-objective Pareto frontier. The tradeoffs between these dimensions are not yet formally characterized for AI coding agents.
