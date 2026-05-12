# Temporal Architecture of AI Coding Agent Harnesses: Formal Methods and Optimization Approaches

**Research Round 4: Mathematical Foundations**

---

## 1. Stochastic DAG Scheduling with Speculative Rollback

### 1.1 Problem Formalization

Let G = (V, E) be a directed acyclic graph representing pipeline stages, where V = {v_1, ..., v_n} are stages and E encodes precedence constraints. Each stage v_i has:

- **Stochastic duration** t_i ~ D_i (drawn from distribution D_i with mean mu_i and variance sigma_i^2)
- **Failure probability** q_i in [0, 1], with success probability p_i = 1 - q_i
- **Failure detection time** d_i (time until failure is observed)

The **makespan** M(G) is the completion time of the final stage. In the deterministic case, the makespan equals the length of the critical path. In the stochastic case, the critical path itself is a random variable, since different realizations of {t_i} can activate different paths through the DAG.

**Objective:** Find a scheduling policy pi that minimizes E_pi[M(G)], the expected makespan under policy pi.

### 1.2 Stochastic PERT/CPM Background

Classical PERT models each activity duration as a beta distribution with parameters derived from optimistic (a), most likely (m), and pessimistic (b) estimates:

    E[t_i] = (a_i + 4m_i + b_i) / 6
    Var(t_i) = ((b_i - a_i) / 6)^2

The expected project duration under PERT is E[M] = sum of E[t_i] along the critical path, and the variance of the critical path is:

    Var(M_CP) = sum_{i in CP} Var(t_i)

This relies on the assumption of independence among activity durations. PERT then approximates the project completion distribution as normal by the Central Limit Theorem, yielding:

    P(M <= T) = Phi((T - E[M_CP]) / sqrt(Var(M_CP)))

**Known limitation:** PERT considers only a single deterministic critical path and ignores the probability that near-critical paths may become critical under different realizations. This systematically underestimates expected makespan (the "PERT bias" or "merge event bias").

### 1.3 The Speculative Execution Variant

In standard scheduling, a stage v_j cannot begin until all predecessors {v_i : (v_i, v_j) in E} have committed (completed successfully). In speculative scheduling, v_j may begin before predecessor v_i commits, executing speculatively on the assumption that v_i will succeed.

**If v_i succeeds** (probability p_i): the speculative work on v_j is valid, and we save the time that would have been spent waiting.

**If v_i fails** (probability q_i): all speculative work on v_j (and its downstream dependents) must be rolled back, and v_j must restart after v_i is re-executed or the pipeline aborts.

For a single predecessor-successor pair (v_i, v_j), the expected time under speculation is:

    E[T_spec] = p_i * max(t_i, t_j) + q_i * (d_i + t_i^retry + t_j)

Compare to the sequential baseline:

    E[T_seq] = E[t_i] + E[t_j]

Speculation is EV-positive when E[T_spec] < E[T_seq], which expands to:

    p_i * E[max(t_i, t_j)] + q_i * (E[d_i] + E[t_i^retry] + E[t_j]) < E[t_i] + E[t_j]

Rearranging, speculation is beneficial when:

    p_i * (E[t_i] + E[t_j] - E[max(t_i, t_j)]) > q_i * (E[d_i] + E[t_i^retry])

The left side is the expected time saved through parallelism (weighted by success probability). The right side is the expected wasted work from rollback (weighted by failure probability). Denoting the overlap benefit as B = E[t_i] + E[t_j] - E[max(t_i, t_j)] = E[min(t_i, t_j)] and the rollback penalty as R = E[d_i] + E[t_i^retry], the condition simplifies to:

    p_i * B > q_i * R

Or equivalently:

    p_i / q_i > R / B

This is the **speculation ratio test**: speculate when the odds ratio of success exceeds the penalty-to-benefit ratio.

### 1.4 Connection to Speculative Actions in Agentic Systems

Recent work by Putta et al. (2025) formalizes speculative actions for agentic AI systems. Under assumptions of exponential latency distributions Exp(alpha) for the speculator and Exp(beta) for the actor, with speculation accuracy p, the asymptotic speedup ratio converges to:

    lim_{T -> inf} E[T_spec] / E[T_seq] = 1 - (p / (1 + p)) * (alpha / (alpha + beta))

The expected time saved per correct speculation is:

    E[(B - A)_+] = alpha / (beta * (alpha + beta))

where B is actor latency and A is speculator latency. Under ideal conditions (p = 1, alpha -> inf), end-to-end latency reduction reaches 50%, with multi-step pipelining potentially exceeding this bound.

### 1.5 Multi-Stage Speculation in DAGs

For general DAGs, the analysis extends recursively. Define the speculation depth k as the number of uncommitted predecessors a stage is willing to execute behind. The expected rollback probability grows multiplicatively:

    P(rollback at depth k) = 1 - prod_{j=1}^{k} p_j

For k stages each with success probability p, this becomes 1 - p^k, which approaches 1 rapidly for even moderate k and imperfect p. This establishes a natural speculation horizon: the depth beyond which speculation becomes EV-negative.

**Optimal speculation depth k* satisfies:**

    k* = argmax_k { sum_{j=1}^{k} p^j * B_j - (1 - p^k) * R_k }

where B_j is the parallelism benefit of speculating at depth j and R_k is the cumulative rollback cost.

---

## 2. Cache Invalidation as Online Optimization

### 2.1 Problem Setup

An AI coding agent maintains a cached representation of codebase state. At each discrete time step t = 1, 2, ..., the agent must choose between:

- **Full re-read** (action F): Cost R (in tokens/time), guarantees zero staleness
- **Incremental update** (action I): Cost r, where r << R, but incurs staleness with probability s_t

Staleness has a downstream cost: if the cache is stale and the agent acts on it, the resulting action has probability delta of being incorrect, requiring rework at cost W.

The effective cost per step under each action:

    C(F) = R
    C(I) = r + s_t * delta * W

The agent does not know s_t in advance (it depends on whether the codebase changed since the last read), making this an online problem.

### 2.2 Connection to the Ski Rental Problem

This is structurally a generalized rent-or-buy problem. "Renting" corresponds to incremental updates (cheap per step, but accumulating risk). "Buying" corresponds to a full re-read (expensive, but resets risk to zero).

In the classical ski rental problem, a skier pays $1/day to rent or $b to buy. The optimal deterministic policy is the break-even algorithm: rent for (b - 1) days, then buy on day b if still skiing. This achieves competitive ratio 2 - 1/b (approaching 2 for large b).

**Theorem (Karlin et al., 1994):** The optimal randomized algorithm for ski rental achieves competitive ratio e/(e - 1) approximately 1.58, which is tight against oblivious adversaries. The algorithm buys on day i with probability:

    p_i = ((b-1)/b)^(b-i) * 1 / (b * (1 - (1 - 1/b)^b))    for i <= b

### 2.3 Mapping to Cache Invalidation

Define the ratio rho = R / r (relative cost of full re-read vs. incremental update). The break-even policy becomes: perform incremental updates for (rho - 1) consecutive steps, then do a full re-read on step rho. This is 2-competitive in the worst case.

However, the coding agent has additional information: the change rate lambda of the codebase (changes per unit time). If changes follow a Poisson process with rate lambda, the staleness probability after k steps without a full read is:

    s_k = 1 - e^{-lambda * k}

The optimal deterministic refresh interval k* minimizes expected cost per step:

    k* = argmin_k { R/k + sum_{j=1}^{k} (r + (1 - e^{-lambda * j}) * delta * W) / k }

For the continuous approximation with small lambda:

    k* approximately sqrt(2R / (lambda * delta * W))

This has the same structure as the Economic Order Quantity (EOQ) formula, with R playing the role of fixed ordering cost and lambda * delta * W as the holding cost rate.

### 2.4 Competitive Analysis of Adaptive Policies

**Policy 1: Periodic refresh at fixed interval k.**
Competitive ratio depends on the actual change pattern. Against adversarial changes:

    CR(periodic_k) = max(k * (r + delta * W), R) / OPT

where OPT is the offline optimal that knows exactly when changes occur.

**Policy 2: Change-rate-adaptive refresh.**
Estimate lambda_hat from observed changes. Refresh when estimated staleness exceeds threshold theta:

    Refresh when 1 - e^{-lambda_hat * (t - t_last)} > theta

Setting theta = r / (delta * W) gives the myopically optimal policy. The competitive ratio of this adaptive policy against the offline optimal is bounded by:

    CR(adaptive) <= 1 + epsilon

for stationary change processes, where epsilon depends on the estimation error of lambda_hat. For non-stationary processes, the competitive ratio degrades to O(log T) in the worst case, matching known lower bounds for online learning against adversarial sequences.

### 2.5 The Two-Level Extension

In practice, the agent faces a two-level cache problem: file-level caches and project-level caches. This maps to the two-level ski rental problem studied by Zhang et al. (2021), where the competitive ratio for the optimal deterministic algorithm is 4 - 2/b_1 - 2/b_2, and randomized algorithms achieve e^2/(e - 1)^2 approximately 2.50.

---

## 3. Decision-Theoretic Mode Selection

### 3.1 Formalization as Cost-Sensitive Classification

The harness must select an execution mode m in M = {Fast, Standard, Governed} for each task. This is a classification problem where:

- **Features x in R^d:** number of files changed (x_1), scope of changes (x_2), ADR impact score (x_3), test coverage fraction (x_4), change entropy (x_5)
- **True optimal mode y in M:** the mode that would be selected by an omniscient observer balancing speed and quality
- **Decision function h: R^d -> M:** the mode selector

### 3.2 Asymmetric Misclassification Costs

The cost matrix C(i, j) represents the cost of choosing mode i when mode j is optimal:

```
                Optimal mode
                Fast    Standard    Governed
Chosen  Fast      0       c_FS       c_FG
        Std     c_SF        0        c_SG
        Gov     c_GF      c_GS         0
```

The critical asymmetry: c_FG >> c_GF. Choosing Fast when Governed is needed risks undetected quality problems (architectural violations, untested integrations), while choosing Governed when Fast suffices merely wastes time.

Concretely, let:
- c_FG = expected rework cost from quality failure (can be 10x-100x the task time)
- c_GF = excess time spent on governance overhead (typically 2x-5x the task time)

The ratio c_FG / c_GF >> 1 means the optimal decision boundary should be biased toward Governed, accepting more false-positive governance triggers to avoid catastrophic quality failures.

### 3.3 Bayesian Decision Framework

Under Bayesian decision theory, the optimal decision minimizes the expected loss (Bayes risk). For features x, the optimal mode is:

    h*(x) = argmin_{i in M} sum_{j in M} C(i, j) * P(y = j | x)

where P(y = j | x) is the posterior probability of the true optimal mode given features x.

For the binary simplification (Fast vs. Governed), the decision rule reduces to:

    Choose Governed iff P(y = Governed | x) > c_GF / (c_FG + c_GF)

Since c_FG >> c_GF, the threshold c_GF / (c_FG + c_GF) is small (say, 0.05 to 0.1), meaning we should choose Governed even when the probability of needing it is quite low. This is the minimax-rational response to asymmetric costs.

### 3.4 Feature Model

The posterior P(y | x) can be modeled via logistic regression or a generative model. Using the logistic model:

    log(P(y = Governed | x) / P(y = Fast | x)) = beta_0 + beta_1 * x_1 + ... + beta_d * x_d

The optimal threshold in log-odds space is:

    tau = log(c_GF / c_FG)

which is negative (since c_GF < c_FG), shifting the boundary to favor Governed. The expected cost under optimal Bayesian mode selection is:

    E[Cost] = E_x[min_i sum_j C(i, j) * P(y = j | x)]

This is the Bayes envelope, representing the minimum achievable expected cost given the feature information.

### 3.5 Connection to Cost-Sensitive Classification Literature

Elkan (2001) established the foundations of cost-sensitive learning, showing that the optimal cost-sensitive classifier can be obtained from a probability estimator by adjusting the decision threshold. The key result: for binary classification with costs c_01 (false negative) and c_10 (false positive), the optimal threshold on the posterior is:

    t* = c_10 / (c_01 + c_10)

This generalizes to multiclass via the expected cost minimization above. Recent work on "Tailored Bayes" (Bracher et al., 2022) extends this framework to hierarchical risk models where misclassification costs themselves are uncertain, requiring integration over cost distributions.

### 3.6 Sequential Mode Selection as a Bandit Problem

When the cost matrix is unknown a priori and must be learned from experience, mode selection becomes a contextual bandit problem. The agent observes features x_t, selects mode m_t, and observes cost c_t. The regret after T rounds is:

    Regret(T) = sum_{t=1}^{T} c_t - sum_{t=1}^{T} c_t^*

where c_t^* is the cost under the optimal policy. UCB-style algorithms achieve regret O(sqrt(dT log T)) where d is the feature dimension, converging to the Bayes-optimal policy.

---

## 4. VIH as a Composite Metric

### 4.1 Formal Definition

**Verified Iterations per Hour (VIH)** measures the rate at which an AI coding agent completes verification-passing iterations:

    VIH = N_verified / T_wall

where N_verified is the count of iterations that pass all verification checks and T_wall is the elapsed wall-clock time in hours.

### 4.2 Decomposition

VIH decomposes multiplicatively:

    VIH = (N_total / T_wall) * (N_verified / N_total) = lambda * rho

where:
- lambda = N_total / T_wall is the **raw throughput** (iterations per hour)
- rho = N_verified / N_total is the **verification pass rate** (quality fraction)

This decomposition reveals the fundamental tension: increasing lambda (going faster) may decrease rho (lower quality), and the product lambda * rho has a non-trivial maximum.

### 4.3 The Speed-Quality Tradeoff in VIH

Model the verification pass rate as a decreasing function of throughput:

    rho(lambda) = rho_0 * e^{-alpha * (lambda - lambda_0)}

where rho_0 is the pass rate at baseline throughput lambda_0, and alpha > 0 captures how aggressively quality degrades with speed. Then:

    VIH(lambda) = lambda * rho_0 * e^{-alpha * (lambda - lambda_0)}

Taking the derivative and setting to zero:

    dVIH/dlambda = rho_0 * e^{-alpha * (lambda - lambda_0)} * (1 - alpha * lambda) = 0

    lambda* = 1 / alpha

This is the throughput that maximizes VIH. Pushing throughput beyond 1/alpha decreases VIH despite increasing raw speed.

### 4.4 Connection to Amdahl's Law

Amdahl's Law states that the speedup from parallelizing a fraction f of a computation across N processors is:

    S(N) = 1 / ((1 - f) + f/N)

In the harness context, f is the fraction of pipeline time that can be parallelized (e.g., independent file reads, parallel test execution), and (1 - f) is the irreducibly serial fraction (e.g., sequential LLM calls, commit operations).

The connection to VIH: even if we parallelize all parallelizable work perfectly, the serial fraction bounds the achievable throughput:

    lambda_max = 1 / T_serial

where T_serial is the wall-clock time of the serial fraction per iteration. Therefore:

    VIH_max = rho(lambda_max) / T_serial

Amdahl's Law thus bounds VIH from above. For a pipeline with serial fraction (1 - f), achieving k-fold parallel speedup on the parallelizable fraction gives:

    lambda(k) = 1 / ((1 - f) * T_iter + f * T_iter / k)

and VIH(k) = lambda(k) * rho(lambda(k)).

### 4.5 Connection to Little's Law

Little's Law (L = lambda * W) relates:
- L: average number of iterations in progress (concurrency)
- lambda: throughput (iterations per unit time)
- W: average time per iteration (latency)

Applied to the harness pipeline:

    L = VIH / rho * W_avg

Or rearranging:

    VIH = rho * L / W_avg

This reveals three levers for improving VIH:
1. **Increase concurrency L**: run more iterations in parallel (subject to Amdahl's bound)
2. **Decrease latency W_avg**: make each iteration faster (e.g., caching, faster models)
3. **Increase pass rate rho**: improve quality so fewer iterations are wasted

Little's Law also constrains the system: if W_avg has a lower bound W_min (irreducible latency), then for fixed concurrency L:

    VIH <= rho * L / W_min

### 4.6 VIH Under Mixed Strategies

If the harness alternates between Fast mode (throughput lambda_F, pass rate rho_F) and Governed mode (throughput lambda_G, pass rate rho_G), with fraction alpha in Fast mode, the expected VIH is:

    VIH_mix = alpha * lambda_F * rho_F + (1 - alpha) * lambda_G * rho_G

The optimal mixing fraction alpha* depends on the relative magnitudes. If VIH_F = lambda_F * rho_F > VIH_G = lambda_G * rho_G, then alpha* = 1 (pure Fast). But this ignores the sequential dependency: Fast-mode failures may require Governed-mode rework. The corrected formula is:

    VIH_eff = alpha * lambda_F * rho_F + (1 - alpha) * lambda_G * rho_G - alpha * (1 - rho_F) * C_rework / T_wall

where C_rework is the cost of fixing a Fast-mode failure.

---

## 5. The Speed-Quality Pareto Frontier

### 5.1 Formal Definition

Define a two-dimensional objective space with:
- **Speed** S in [0, S_max]: iterations completed per unit time
- **Quality** Q in [0, 1]: fraction of iterations that are correct/verified

A configuration c (specifying mode, parallelism, speculation depth, cache policy, etc.) maps to a point (S(c), Q(c)) in this space.

**Definition (Pareto dominance):** Configuration c_1 dominates c_2 (written c_1 >_P c_2) iff S(c_1) >= S(c_2) and Q(c_1) >= Q(c_2), with at least one strict inequality.

**Definition (Pareto frontier):** The Pareto frontier F is the set of all non-dominated configurations:

    F = {c : not exists c' such that c' >_P c}

### 5.2 Non-Linearity of the Frontier

The Pareto frontier in (S, Q) space is generally non-linear. We can characterize its shape through the marginal rate of substitution:

    MRS(S, Q) = -dQ/dS |_F

This measures how much quality must be sacrificed for a marginal increase in speed, along the frontier.

**Proposition:** The frontier contains both convex and concave regions.

*Convex regions* (MRS increasing in S): Each additional unit of speed costs progressively more quality. This occurs when easy speed gains have been exhausted and further speedups require skipping important verification steps.

*Concave regions* (MRS decreasing in S): Initial speed gains are expensive in quality, but further gains become cheaper. This occurs when the system crosses a phase transition (e.g., achieving enough parallelism to amortize verification costs, or reaching a throughput where statistical quality assurance becomes viable).

### 5.3 Mixing Strategies and Convexification

**Theorem (Convexification by Mixing):** Let c_1 = (S_1, Q_1) and c_2 = (S_2, Q_2) be two Pareto-optimal configurations. The randomized strategy that uses c_1 with probability alpha and c_2 with probability (1 - alpha) achieves:

    (S_mix, Q_mix) = (alpha * S_1 + (1 - alpha) * S_2, alpha * Q_1 + (1 - alpha) * Q_2)

This lies on the line segment between (S_1, Q_1) and (S_2, Q_2).

**Corollary:** In concave regions of the frontier, the line segment between two frontier points lies above the frontier, meaning the mixed strategy achieves (S, Q) pairs that dominate every pure strategy in that region. In convex regions, the line segment lies below the frontier, and pure strategies dominate mixtures.

This is the direct analogue of the classical result in game theory: mixed strategies expand the achievable set to the convex hull of pure-strategy outcomes. The effective Pareto frontier under mixing is the upper envelope of the convex hull of all achievable (S, Q) points.

### 5.4 VIH on the Pareto Frontier

Since VIH = S * Q (speed times quality), the iso-VIH curves in (S, Q) space are rectangular hyperbolas:

    Q = VIH / S

The maximum VIH is achieved at the point on the Pareto frontier where an iso-VIH hyperbola is tangent to the frontier. At this tangency point:

    dQ/dS |_F = -Q/S

Or equivalently, the elasticity of quality with respect to speed equals -1:

    (dQ/dS) * (S/Q) = -1

This means VIH is maximized where a 1% increase in speed causes exactly a 1% decrease in quality. Below this point, speed gains improve VIH; above it, they degrade VIH.

### 5.5 Formal Conditions for VIH Maximization

Let the Pareto frontier be parameterized as Q = f(S) where f is decreasing. Then:

    VIH(S) = S * f(S)

    dVIH/dS = f(S) + S * f'(S) = 0

    f(S*) = -S* * f'(S*)

**Condition 1 (Interior maximum):** VIH has an interior maximum on the frontier iff f is strictly concave at some point, i.e., there exists S such that f(S) + S * f'(S) > 0 for S < S* and < 0 for S > S*.

**Condition 2 (Uniqueness):** If f is log-concave (i.e., log f(S) is concave), then VIH(S) = S * f(S) has a unique maximum on the frontier.

**Condition 3 (Mixing optimality):** If the VIH-maximizing point (S*, Q*) lies in a concave region of the frontier, then the optimal strategy is a pure strategy. If it lies in a convex region that has been convexified by mixing, the optimal strategy alternates between the bracketing pure strategies.

### 5.6 Connection to Multi-Objective Optimization

The speed-quality tradeoff is an instance of bi-objective optimization. Standard results apply:

- The **weighted-sum method** (minimize -w_S * S - w_Q * Q) traces out the convex hull of the frontier. Points in non-convex regions cannot be found by weighted-sum scalarization alone.

- The **epsilon-constraint method** (maximize S subject to Q >= Q_min) can find all frontier points, including those in non-convex regions.

- The **achievement scalarizing function** (minimize max_i {(f_i* - f_i) / w_i}) finds any Pareto-optimal point, including those in non-convex regions.

For the harness, VIH = S * Q is itself a scalarizing function (the Nash product), which has the geometric property of finding the point on the frontier that maximizes the area of the rectangle inscribed between the origin and the frontier. This is equivalent to maximizing the geometric mean of the two objectives, providing a natural balance between speed and quality.

---

## Summary of Key Results

| Topic | Core Result | Key Formula |
|-------|-------------|-------------|
| Speculative scheduling | Speculate when success odds exceed penalty-to-benefit ratio | p/q > R/B |
| Cache invalidation | Break-even refresh is 2-competitive; randomized is e/(e-1)-competitive | k* ~ sqrt(2R / (lambda * delta * W)) |
| Mode selection | Bayesian optimal threshold biased toward costly-to-miss mode | Choose Governed iff P(Gov\|x) > c_GF/(c_FG + c_GF) |
| VIH decomposition | VIH = throughput * pass_rate, maximized at lambda* = 1/alpha | VIH <= rho * L / W_min (Little's Law bound) |
| Pareto frontier | VIH maximized where speed-quality elasticity = -1 | f(S*) = -S* * f'(S*) |

---

## Sources

- [Stochastic DAG Scheduling Using a Monte Carlo Approach](https://www.sciencedirect.com/science/article/abs/pii/S0743731513001573)
- [Minimizing Expected Makespan with Stochastic Activity Durations (Springer)](https://link.springer.com/article/10.1007/s10951-015-0421-5)
- [PERT 21: Fitting PERT/CPM for the 21st Century (Trietsch)](http://mba.tuck.dartmouth.edu/pss/Notes/PERT21.pdf)
- [Speculative Actions: A Lossless Framework for Faster Agentic Systems (Putta et al., 2025)](https://arxiv.org/abs/2510.04371)
- [Sherlock: Reliable and Efficient Agentic Workflow Execution](https://arxiv.org/pdf/2511.00330)
- [Ski Rental Problem (Wikipedia)](https://en.wikipedia.org/wiki/Ski_rental_problem)
- [Competitive Analysis: Rent or Buy Problems (Duke CS530)](https://courses.cs.duke.edu/fall13/compsci530/notes/lec23.pdf)
- [Competitive Analysis for Two-Level Ski-Rental Problem (AAAI)](https://cdn.aaai.org/ojs/17429/17429-13-20923-1-2-20210518.pdf)
- [The Foundations of Cost-Sensitive Learning (Elkan, 2001)](https://www.researchgate.net/publication/2365611_The_Foundations_of_Cost-Sensitive_Learning)
- [Tailored Bayes: Risk Modeling Under Unequal Misclassification Costs (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9748575/)
- [Amdahl's Law (Wikipedia)](https://en.wikipedia.org/wiki/Amdahl's_law)
- [Amdahl's Law and Little's Law: Foundational Principles for System Design](https://rahulkavale.github.io/posts/little-and-amhdals-law/)
- [Multi-Objective Optimization (Wikipedia)](https://en.wikipedia.org/wiki/Multi-objective_optimization)
- [Pareto Front (Wikipedia)](https://en.wikipedia.org/wiki/Pareto_front)
- [A Pareto Multi-Objective Optimization Approach for Time-Cost-Quality Tradeoffs](https://www.researchgate.net/publication/233101401_A_Pareto_Multi-Objective_Optimization_Approach_for_Solving_Time-Cost-Quality_Tradeoff_Problems)
- [Game-Theoretic Understandings of Multi-Agent Systems with Multiple Objectives](https://arxiv.org/pdf/2509.23026)
