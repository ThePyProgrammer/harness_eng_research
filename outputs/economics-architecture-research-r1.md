# Economics Architecture for AI Coding Agent Harnesses: Classical Optimization, Portfolio Theory, and Information Economics

**Research Round 1: Foundational Frameworks**
**Date: 2026-04-03**

---

## 1. Markowitz Portfolio Theory (1952)

### 1.1 The Mean-Variance Framework

Harry Markowitz introduced modern portfolio theory in his 1952 paper "Portfolio Selection" (The Journal of Finance, 7, 77-91), for which he later received the Nobel Memorial Prize in Economic Sciences. The paper's foundational move was to reject simple expected-return maximization in favor of a two-criterion framework balancing expected return against variance.

Markowitz formulated two competing rules and argued decisively for the second:

> "We first consider the rule that the investor does (or should) maximize discounted expected, or anticipated, returns."

He rejected this rule because it implies no diversification, and proposed instead:

> "We next consider the rule that the investor does (or should) consider expected return a desirable thing and variance of return an undesirable thing."

This second rule, the E-V (Expected return, Variance of return) rule, became the foundation of modern portfolio theory (Markowitz, 1952, pp. 77-78).

### 1.2 Mathematical Formulation

The Markowitz optimization problem is stated as:

    Minimize:  w^T Sigma w
    Subject to: R^T w = mu       (target return constraint)
                sum w_i = 1       (full investment constraint)

where:
- w in R^N is the portfolio weight vector
- Sigma in R^(N x N) is the covariance matrix of asset returns
- R in R^N is the vector of expected returns
- mu is the target expected portfolio return

The portfolio return is additive in its components:

    E(R_p) = sum_i w_i * E(R_i)
    sigma_p^2 = w^T Sigma w = sum_i sum_j w_i w_j sigma_ij

The efficient frontier is the set of portfolios that minimize variance for each level of expected return. Geometrically, it forms the upper boundary of a hyperbolic region in (sigma, mu) space. The Global Minimum Variance Portfolio (GMVP) sits at the vertex of this hyperbola (Markowitz, 1952; Boyd and Johansson, 2022).

This optimization is "easily solved using a Lagrange multiplier" (Wikipedia, "Modern portfolio theory"), yielding a linear system of equations. The Lagrange multiplier on the return constraint has a direct interpretation as the marginal variance cost of an additional unit of expected return.

### 1.3 Application to Token Budget Allocation

The analogy to token budget allocation is direct but imperfect:

| Portfolio Theory | Token Budget Allocation |
|---|---|
| Assets (securities) | Pipeline stages |
| Portfolio weights w_i | Budget share allocated to stage i |
| Expected return E(R_i) | Quality contribution q_i |
| Variance sigma_i^2 | Uncertainty in quality outcome |
| Budget constraint sum w_i = 1 | Token budget constraint sum p_k * r_k <= B |

### 1.4 Key Limitation: Additive vs. Multiplicative Returns

Markowitz's framework assumes additive portfolio returns: E(R_p) = sum w_i E(R_i). This is appropriate for a single period where returns combine linearly. However, our token budget problem has multiplicative quality:

    R = prod_{k=1}^{K} q_k(r_k)

This is a fundamental structural mismatch. In portfolio theory, if one asset returns -100%, the portfolio loses that fraction of wealth. In our problem, if one stage has quality zero, the entire pipeline fails (the product collapses to zero). The series-system reliability structure is inherently multiplicative.

This mismatch is resolved by a log-transformation, which connects Markowitz to Kelly (see Section 2.4).

---

## 2. Kelly Criterion (1956)

### 2.1 Original Formulation

John L. Kelly Jr. published "A New Interpretation of Information Rate" in the Bell System Technical Journal (vol. 35, pp. 917-926, July 1956). The paper was written in terms of a gambling scenario involving bookies, noisy telephone lines, and wiretaps so it could be published by the Bell System Technical Journal (Kelly, 1956).

Kelly's central result connects information theory to optimal betting:

> "If a gambler places bets on the input symbol to a communication channel and bets his money in the same proportion each time a particular symbol is received, his capital will grow (or shrink) exponentially. If the odds are consistent with the probabilities of occurrence of the transmitted symbols (i.e., equal to their reciprocals), the maximum value of this exponential rate of growth will be equal to the rate of transmission of information." (Kelly, 1956)

### 2.2 The Kelly Formula

For a binary bet with probability p of winning, probability q = 1 - p of losing, and odds b (net payoff ratio), the optimal fraction of capital to wager is:

    f* = (bp - q) / b = p - q/b

More generally, for a bet where fraction a of the wager is lost on failure and fraction b is gained on success:

    f* = p/a - q/b

The geometric growth rate under repeated betting is:

    r = (1 + fb)^p * (1 - fa)^q

Taking logarithms converts this to the expected log-growth rate:

    G = p * log(1 + fb) + q * log(1 - fa)

which is maximized at f = f*. The maximum growth rate for even-money bets is:

    G_max = 1 + p * log(p) + q * log(q)

This quantity is directly related to the mutual information of the channel (Kelly, 1956; Thorp, 2007).

### 2.3 Fractional Kelly for Risk Aversion

In practice, full Kelly betting is aggressive. "Gamblers would use less than full Kelly in order to reduce the chance of ruin, reduce volatility, and account for model error" (Wikipedia, "Kelly criterion"). Fractional Kelly uses f/n (where n >= 2) instead of f*, sacrificing theoretical optimality for practical robustness against:

- Estimation errors in probabilities p and odds b
- Model misspecification
- Psychological tolerance for drawdowns
- Protection against fat-tailed distributions

For token budget allocation, this suggests that the theoretically optimal allocation should be tempered by uncertainty about the true quality functions q_k(r_k).

### 2.4 The Log-Transformation Bridge: Kelly Meets Markowitz

The connection between Kelly and Markowitz is precisely the log-transformation that resolves our multiplicative quality problem.

**Markowitz** operates in a single-period, additive-returns world, minimizing variance for a given expected return. **Kelly** operates in a multi-period, multiplicative-growth world, maximizing expected logarithmic wealth. The bridge is:

- Capital accumulation is a multiplicative process (Kelly, 1956; Peters, 2009).
- The time-average growth rate of a self-financed portfolio is the logarithm of the geometric mean of the return distribution (Kelly, 1956; Markowitz, 1976).
- If profits are reinvested, "the math changes if winnings are reinvested; the objective becomes finding the opportunity with the highest geometric mean" (Ernie Chan, 2014).

For our problem, the compound quality R = prod q_k(r_k) is a multiplicative objective. Taking the logarithm:

    log(R) = sum_{k=1}^{K} log(q_k(r_k))

This converts the multiplicative objective into an additive one, directly amenable to Lagrange multiplier methods. Each log(q_k(r_k)) plays the role of a "return" in a Markowitz-like framework, and the budget constraint sum p_k * r_k <= B is already linear. This is the key mathematical move that makes the entire optimization tractable.

---

## 3. Howard's Information Value Theory (1966)

### 3.1 The Value of Clairvoyance

Ronald A. Howard published "Information Value Theory" in IEEE Transactions on Systems Science and Cybernetics (vol. 2, pp. 22-26, 1966). The paper introduced the concept of clairvoyance as a formal device for valuing information in decision problems.

Howard's fundamental insight was that Shannon's information theory, while elegant, is insufficient for decision-making:

> "No theory that involves just the probabilities of outcomes without considering their consequences could possibly be adequate in describing the importance of uncertainty to a decision maker." (Howard, 1966)

He proposed that the value of information "arises from considering jointly the probabilistic and economic factors that affect decisions" and that "numerical values can be assigned to the elimination or reduction of any uncertainty" (Howard, 1966).

The key thought experiment is the "clairvoyant" test:

> "If a perfect clairvoyant appeared and offered to eliminate one or both of the uncertainties in the problem, we would be willing to offer him a financial consideration." (Howard, 1966)

### 3.2 Expected Value of Perfect Information (EVPI)

The EVPI measures the maximum amount a decision-maker should pay for perfect information about an uncertain variable. The formula is:

    EVPI = E_theta[ max_a U(a, theta) ] - max_a E_theta[ U(a, theta) ]

where:
- theta is the uncertain state of the world
- a is the decision (action)
- U(a, theta) is the utility of taking action a when the state is theta
- The first term is the expected utility when you can choose the best action *after* seeing theta
- The second term is the expected utility when you must choose the best action *before* seeing theta

The EVPI is always non-negative (seeing the future can never hurt you) and equals zero when the optimal action is the same regardless of the uncertain state.

### 3.3 Expected Value of Imperfect Information (EVII)

In practice, information sources are noisy. For an imperfect signal s related to the true state theta through a likelihood model P(s|theta), the EVII is:

    EVII = E_s[ max_a E_theta[ U(a, theta) | s ] ] - max_a E_theta[ U(a, theta) ]

This satisfies 0 <= EVII <= EVPI, with the upper bound achieved when s is a perfect signal (Blackwell sufficiency, connecting to Section 5). The difference EVPI - EVII quantifies the cost of signal noise.

### 3.4 Application to Token Budget Allocation

Howard's framework maps directly onto the "should I research more or proceed?" decision that arises at every pipeline stage:

| Decision Theory | Token Budget Allocation |
|---|---|
| Uncertain state theta | True codebase state, bug location, test requirements |
| Action a | Code generation, test writing, refactoring |
| Information signal s | Context loading, file reading, grep results |
| Cost of information | Tokens spent on context loading |
| EVPI | Maximum value of loading all relevant context |
| EVII | Actual value of loading partial, noisy context |

The EVPI formula provides a principled upper bound on how many tokens should be spent on context loading for any stage: the allocation to information gathering should never exceed the EVPI. When EVPI is small (the optimal action is robust to uncertainty), the stage should proceed with minimal context. When EVPI is large (the outcome is highly sensitive to unknown state), investing tokens in research is justified.

---

## 4. Stigler's Economics of Information (1961)

### 4.1 The Cost of Search

George J. Stigler published "The Economics of Information" in the Journal of Political Economy (vol. 69, no. 3, pp. 213-225, 1961). The paper was among the first to formally treat information as an economic good with a cost of acquisition, founding what became known as search theory.

Stigler's key insight was that price dispersion (the same good selling for different prices) is not a market failure but a natural consequence of costly information: "The Law of One Price will fail to hold whenever it is costly to collect price data" (Stigler, 1961, as paraphrased by Barreto).

### 4.2 The Fixed-Sample Search Model

Stigler modeled a consumer who decides in advance to visit n firms and then purchases from the one offering the lowest price. For a uniform price distribution on [0, 1], the expected minimum price after visiting n firms is:

    E[P_min(n)] = 1 / (n + 1)

The consumer's total expected cost includes both the price paid and the cost of search:

    TotalCost(n) = q / (n + 1) + c * n

where q is the quantity purchased (scaling the price into dollars) and c is the cost per search. The optimality condition sets marginal savings equal to marginal cost:

    q / (n + 1)^2 = c

Solving for the optimal number of searches:

    n* = sqrt(q / c) - 1

This demonstrates diminishing returns to search: each additional price quote provides smaller marginal price reductions than the previous one. An optimizing consumer will "generally stop before he obtains the lowest price in the market" (Stigler, 1961, as described by Barreto).

### 4.3 The Sequential Search Extension: Reservation Prices

McCall (1970) and others extended Stigler's fixed-sample model to sequential search with the reservation price concept. The optimal stopping rule states: continue searching until you find a price below the reservation price r(c), where r(c) satisfies:

    c = E[max(0, r(c) - P)]

That is, the marginal cost of one more search c equals the expected benefit from finding a price below the current threshold. The reservation price decreases as search costs decrease, connecting search intensity to budget availability.

### 4.4 Application to Context Loading

Stigler's framework maps onto the context-loading phase of an AI coding harness:

| Search Theory | Context Loading |
|---|---|
| Searching firms for prices | Loading files into context |
| Cost per search c | Tokens consumed per file/grep |
| Expected minimum price E[P_min] | Expected quality of context coverage |
| Reservation price r(c) | Minimum relevance threshold for including a file |
| Optimal n* | Optimal number of files to load |

The key result is that context loading has diminishing returns. The first few highly relevant files contribute substantially to task quality. As loading continues to less relevant files, the marginal benefit falls while the marginal cost (in tokens) remains constant. The optimal stopping point is where the marginal quality improvement from one more file equals the marginal token cost.

Furthermore, n* = sqrt(q/c) - 1 implies that the optimal number of files to load scales as the square root of the task importance q divided by the per-file token cost c. High-importance tasks justify more context loading; high token costs justify less.

---

## 5. Blackwell's Comparison of Experiments (1953)

### 5.1 The Informativeness Ordering

David Blackwell first proved his comparison theorem in 1951 ("The Comparison of Experiments") and generalized it in 1953 ("Equivalent Comparisons of Experiments," Annals of Mathematical Statistics, vol. 24, no. 2, pp. 265-272). This is one of the deepest results in statistical decision theory, establishing when one information source is strictly more valuable than another.

### 5.2 Formal Statement

Blackwell's theorem establishes the equivalence of three orderings on information structures. Given information structures sigma and sigma' with signal spaces S and S', state space Omega, and action space A:

**Condition 1 (Expected Utility Dominance):** For every decision problem (action space, utility function), the expected utility under optimal use of sigma is at least as great as under optimal use of sigma':

    W(sigma') <= W(sigma) for all decision problems

**Condition 2 (Garbling):** There exists a stochastic map (Markov kernel) gamma such that:

    sigma'(s' | omega) = sum_{s in S} gamma(s, s') * sigma(s | omega)

for all s' in S' and omega in Omega, with sum_{s'} gamma(s, s') = 1 for all s. Intuitively, sigma' can be obtained from sigma by adding noise.

**Condition 3 (Feasibility):** The set of feasible decision strategies under sigma' is a subset of those feasible under sigma:

    Phi_{sigma'} subset Phi_sigma

Blackwell's theorem states that these three conditions are equivalent, defining the Blackwell order (denoted sigma' <=_B sigma). This is a partial order: not all pairs of experiments are comparable.

### 5.3 Garbling as Noise Addition

The garbling condition is conceptualized as "adding noise to an information structure" (Wikipedia, "Blackwell's informativeness theorem"). If sigma' is a garbling of sigma, then sigma is strictly more informative: any decision you can make well with sigma' you can make at least as well with sigma, but sigma may additionally support decisions that sigma' cannot.

### 5.4 Application to Choosing Between Context Sources

Blackwell's theorem provides a formal criterion for comparing information sources in the context-loading phase:

| Blackwell Theory | Context Loading |
|---|---|
| Experiment sigma | Context source (code file, documentation, test output) |
| Signal s | Content extracted from the source |
| Garbling | Lossy summarization, truncation, or compression of context |
| Blackwell dominance | One source is strictly more useful for all possible tasks |

The practical implication is powerful: if source A Blackwell-dominates source B (i.e., B is a garbling of A), then A should always be preferred when budget permits. For example, a full file read Blackwell-dominates a truncated read (the truncation is a garbling). An AST parse plus the source code Blackwell-dominates the source code alone (supplementary structure cannot hurt).

However, Blackwell's ordering is partial. A code file and its test file are generally incomparable in the Blackwell sense: each contains information the other lacks, and the relative value depends on the specific task. This is precisely why the allocation problem is nontrivial.

---

## 6. Lagrange Multiplier Methods and the Shadow Price Interpretation

### 6.1 The Constrained Optimization Problem

The token budget allocation problem is:

    maximize   prod_{k=1}^{K} q_k(r_k)
    subject to sum_{k=1}^{K} p_k * r_k <= B
               r_k >= 0  for all k

where q_k(r_k) is the quality contribution of stage k as a function of tokens r_k consumed at per-token price p_k, and B is the total budget.

### 6.2 Log-Transformation to Concave Program

Applying the log-transformation (justified by Kelly/geometric mean theory, Section 2.4):

    maximize   sum_{k=1}^{K} log(q_k(r_k))
    subject to sum_{k=1}^{K} p_k * r_k <= B
               r_k >= 0  for all k

If each q_k is concave and positive, then log(q_k) is concave (composition of concave with concave non-decreasing log). The constraint is linear. This is a convex optimization problem (maximizing a concave function over a convex set), which is tractable and has a unique global optimum under mild regularity conditions.

### 6.3 KKT Conditions and the First-Order Optimality

The Karush-Kuhn-Tucker (KKT) conditions for this problem are:

**Stationarity:** For each stage k,

    q_k'(r_k) / q_k(r_k) - lambda * p_k - mu_k = 0

where lambda >= 0 is the multiplier on the budget constraint and mu_k >= 0 is the multiplier on the non-negativity constraint r_k >= 0.

**Primal Feasibility:**

    sum_{k=1}^{K} p_k * r_k <= B,  r_k >= 0

**Dual Feasibility:**

    lambda >= 0,  mu_k >= 0

**Complementary Slackness:**

    lambda * (B - sum p_k * r_k) = 0
    mu_k * r_k = 0  for all k

### 6.4 The Equal Marginal Principle

For stages receiving positive allocation (r_k > 0), complementary slackness gives mu_k = 0, and the stationarity condition becomes:

    q_k'(r_k) / (q_k(r_k) * p_k) = lambda   for all active k

This is the **equal marginal principle** (Gossen's Second Law, 1854; generalized by Lagrange): at the optimum, the marginal log-quality per dollar of token budget is equal across all active stages. The quantity q_k'(r_k) / q_k(r_k) is the elasticity of quality with respect to tokens, and dividing by the per-token price p_k normalizes it to a per-dollar basis.

The economic interpretation is direct: if stage A offered higher marginal log-quality per dollar than stage B, then shifting a dollar from B to A would improve total quality; hence the allocation could not have been optimal. At the true optimum, no such profitable reallocation exists.

### 6.5 The Shadow Price lambda*

The Lagrange multiplier lambda* has a precise interpretation as the **shadow price of the budget constraint**: it represents the marginal improvement in log(R) per additional dollar of token budget (Luenberger, 1969; Boyd and Vandenberghe, 2004). Formally:

    lambda* = d/dB [ max sum log(q_k(r_k)) subject to sum p_k r_k <= B ]

If lambda* is large, the budget is severely constraining and additional tokens would yield substantial quality improvements. If lambda* is small, the budget is loose and additional tokens have diminishing value. This provides a principled measure of "how budget-constrained is this task?"

The complementary slackness condition lambda * (B - sum p_k r_k) = 0 implies that if the budget is not fully spent (sum p_k r_k < B), then lambda = 0: the marginal value of additional budget is zero, and the allocation is already unconstrained.

### 6.6 Sufficiency Conditions

The KKT conditions are both necessary and sufficient for optimality when (Boyd and Vandenberghe, 2004):
- The objective function is concave (guaranteed by concavity of log(q_k))
- Inequality constraints are convex (the budget constraint is linear, hence convex)
- Equality constraints are affine (none in our problem)
- Slater's condition holds: there exists a strictly feasible point (any allocation with sum p_k r_k < B)

---

## 7. Connecting the Frameworks to the Paper's Formal Problems

### 7.1 Problem 1: Token Budget Allocation

The paper's central optimization problem is:

    maximize   R = prod_{k=1}^{K} q_k(r_k)
    subject to sum_{k=1}^{K} p_k * r_k <= B

The log-transformation converts this to:

    maximize   log(R) = sum_{k=1}^{K} log(q_k(r_k))
    subject to sum_{k=1}^{K} p_k * r_k <= B

This is a standard concave maximization under a linear constraint, solvable by Lagrange multipliers. The first-order condition for each active stage k is:

    q_k'(r_k) / (q_k(r_k) * p_k) = lambda*

where lambda* is the common shadow price of the budget constraint. The quantity q_k'(r_k) / q_k(r_k) = d/dr_k [log q_k(r_k)] is the marginal log-quality at stage k.

### 7.2 Interpretation Through Each Framework

**Markowitz lens:** The allocation problem is analogous to portfolio construction, where each stage is an "asset" with a quality "return." The efficient frontier in (cost, quality) space traces the Pareto-optimal allocations. The budget constraint B selects a point on this frontier.

**Kelly lens:** Because quality is multiplicative (compound reliability), the natural objective is to maximize the geometric mean of stage qualities. Kelly's insight that log-transformation converts multiplicative growth into additive returns is precisely what makes the problem tractable. The optimal allocation maximizes expected log-quality, which is the analog of the log-optimal portfolio.

**Howard lens:** The EVPI for each stage measures the maximum value of perfect context before acting. If EVPI_k is small, the stage should receive fewer tokens for context loading and more for execution. If EVPI_k is large, additional context tokens are justified. The budget allocation should reflect the information structure of each stage.

**Stigler lens:** Each stage's context loading exhibits diminishing returns. The optimal number of files to load into context follows a square-root law: n* ~ sqrt(importance / cost). Beyond this point, the marginal tokens are better spent on execution or verification.

**Blackwell lens:** When choosing between context sources, prefer the one that Blackwell-dominates. When sources are incomparable, the choice depends on the specific task, and the allocation must be task-adaptive.

**Lagrange lens:** At the optimum, every dollar of token budget generates the same marginal log-quality regardless of which stage it is spent on. The shadow price lambda* measures how binding the budget constraint is.

---

## 8. Contradictions and Tensions Between Frameworks

### 8.1 Single-Period vs. Multi-Period: Markowitz vs. Kelly

The most fundamental tension is between Markowitz's single-period, variance-minimizing approach and Kelly's multi-period, growth-maximizing approach. Markowitz minimizes risk for a target return; Kelly maximizes long-run growth regardless of interim volatility. In our problem, a single task execution is essentially single-period (the pipeline runs once), but the harness runs many tasks over its lifetime (multi-period). Which framework applies depends on whether we optimize per-task or across the lifetime of the harness.

**Resolution:** For a single task, the log-transformed problem is equivalent under both frameworks (since a single-period geometric mean reduces to a single multiplication). The tension only arises when considering repeated task execution with learning, where Kelly's growth-optimal strategy may diverge from Markowitz's risk-adjusted strategy.

### 8.2 Additive Cost vs. Multiplicative Quality

The budget constraint is additive (costs sum), but quality is multiplicative (reliabilities multiply). This creates an asymmetry that standard portfolio theory does not address. The log-transformation resolves this at the objective level, but the constraint remains linear, creating a mixed structure: additive in the constraint space, additive in the transformed objective space, but fundamentally multiplicative in the original quality space.

### 8.3 Information Value vs. Search Cost

Howard's EVPI provides an upper bound on the value of context loading, while Stigler's search theory provides a stopping rule for when to stop loading. These are complementary but can conflict: Howard says "this information is worth X tokens," while Stigler says "but the diminishing returns say stop after Y tokens." When X > Y, the search cost exceeds the practical stopping point even though the information remains theoretically valuable. This gap represents a form of "information regret" where budget constraints prevent acquiring all justified information.

### 8.4 Blackwell's Partial Order vs. the Need for Total Ordering

Blackwell's comparison of experiments is a partial order: many information sources are incomparable. But the allocation problem requires a total ordering (or at least a numerical scoring) of how tokens should be distributed. The resolution is that Blackwell provides qualitative dominance results (always prefer A over B when A dominates), while the quantitative allocation comes from the Lagrange multiplier framework. Blackwell prunes the search space; Lagrange optimizes within it.

### 8.5 Perfect Rationality vs. Estimation Error

All frameworks assume known parameters: known quality functions q_k(r_k) (Lagrange), known return distributions (Markowitz), known probabilities (Kelly), known utility functions (Howard). In practice, the harness must estimate these from limited data. This motivates fractional Kelly (conservative allocation under parameter uncertainty) and robust optimization variants of the Markowitz framework.

---

## 9. Key Results for Paper

The following five results form the formal backbone of the economics architecture:

### Result 1: Log-Transformation Theorem

The multiplicative quality objective R = prod q_k(r_k) under additive budget constraint sum p_k r_k <= B is equivalent, via log-transformation, to the concave program max sum log(q_k(r_k)) subject to sum p_k r_k <= B. This is a standard convex optimization problem with a unique global optimum (assuming concave q_k). The transformation is justified by Kelly's geometric mean maximization principle: maximizing log of the product equals maximizing the sum of logs, which is the natural objective for multiplicative processes.

### Result 2: Equal Marginal Principle (First-Order Condition)

At the optimal allocation, the marginal log-quality per dollar is equal across all active stages:

    q_k'(r_k*) / (q_k(r_k*) * p_k) = lambda*   for all k with r_k* > 0

This is the token budget analog of Gossen's Second Law and the equimarginal principle in economics. It provides both a characterization of optimality and an algorithmic target: iteratively adjust allocations until marginal returns equalize.

### Result 3: Shadow Price of Budget

The Lagrange multiplier lambda* = d(log R*)/dB measures the marginal value of additional token budget. This provides a principled answer to "how constrained is this task?" and enables comparison across tasks: tasks with higher lambda* are more budget-constrained and would benefit more from additional tokens.

### Result 4: Information Value Bounds on Context Loading

Howard's EVPI provides an upper bound on tokens that should be spent on context loading at any stage:

    tokens_context(k) <= EVPI_k / p_k

where EVPI_k is the expected value of perfect information for stage k, measured in quality units, and p_k is the per-token price. Stigler's stopping rule provides the practical allocation within this bound, with the optimal number of context items scaling as sqrt(importance / cost).

### Result 5: Blackwell Dominance for Context Source Selection

When comparing context sources, Blackwell's theorem provides a task-independent selection criterion: if source A Blackwell-dominates source B (B is a garbling of A), then A is preferred for any task. This reduces the combinatorial problem of context selection to a dominance-pruned subset, which can then be optimized quantitatively using the Lagrange framework.

---

## 10. Sources

### Primary Sources

- Markowitz, H. (1952). "Portfolio Selection." *The Journal of Finance*, 7(1), 77-91.
- Kelly, J. L. Jr. (1956). "A New Interpretation of Information Rate." *Bell System Technical Journal*, 35(4), 917-926.
- Howard, R. A. (1966). "Information Value Theory." *IEEE Transactions on Systems Science and Cybernetics*, 2(1), 22-26.
- Stigler, G. J. (1961). "The Economics of Information." *Journal of Political Economy*, 69(3), 213-225.
- Blackwell, D. (1953). "Equivalent Comparisons of Experiments." *Annals of Mathematical Statistics*, 24(2), 265-272.
- Blackwell, D. (1951). "The Comparison of Experiments." *Proceedings of the Second Berkeley Symposium on Mathematical Statistics and Probability*, 93-102.

### Secondary Sources

- Boyd, S. and Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press.
- Thorp, E. O. (2007). "The Kelly Criterion in Blackjack, Sports Betting, and the Stock Market." Chapter in *Handbook of Asset and Liability Management*.
- McCall, J. J. (1970). "Economics of Information and Job Search." *Quarterly Journal of Economics*, 84(1), 113-126.
- Raiffa, H. and Schlaifer, R. (1961). *Applied Statistical Decision Theory*. Harvard University Press.
- Peters, O. (2009). "Optimal Leverage from Non-Ergodicity." *arXiv:0902.2965*.
- Luenberger, D. G. (1969). *Optimization by Vector Space Methods*. Wiley.
- Gossen, H. H. (1854). *Entwickelung der Gesetze des menschlichen Verkehrs*.
- Boyd, S. and Johansson, K. (2022). "Markowitz Portfolio Construction at Seventy." Working paper, Stanford University.

### Web Sources Consulted

- [Kelly Criterion, Wikipedia](https://en.wikipedia.org/wiki/Kelly_criterion)
- [Modern Portfolio Theory, Wikipedia](https://en.wikipedia.org/wiki/Modern_portfolio_theory)
- [Blackwell's Informativeness Theorem, Wikipedia](https://en.wikipedia.org/wiki/Blackwell%27s_informativeness_theorem)
- [KKT Conditions, Wikipedia](https://en.wikipedia.org/wiki/Karush%E2%80%93Kuhn%E2%80%93Tucker_conditions)
- [Shadow Price, Wikipedia](https://en.wikipedia.org/wiki/Shadow_price)
- [Kelly Criterion derivation, Stanford](https://crypto.stanford.edu/~blynn/pr/kelly.html)
- [Value of Information, Nowozin](https://www.nowozin.net/sebastian/blog/the-fair-price-to-pay-a-spy-an-introduction-to-the-value-of-information.html)
- [Blackwell comparison, Pettigrew](https://richardpettigrew.substack.com/p/david-blackwell-on-the-comparison)
- [Stigler fixed sample search, Barreto](https://socialsci.libretexts.org/Bookshelves/Economics/Intermediate_Microeconomics_with_Excel_(Barreto)/07:_Search_Theory/7.01:_Fixed_Sample_Search)
- [Equimarginal Principle, Intelligent Economist](https://www.intelligenteconomist.com/equimarginal-principle/)
- [Kelly vs. Markowitz, Ernie Chan](http://epchan.blogspot.com/2014/08/kelly-vs-markowitz-portfolio.html)
- [Kelly Criterion, Thorp (Williams College)](https://web.williams.edu/Mathematics/sjmiller/public_html/341/handouts/Thorpe_KellyCriterion2007.pdf)
