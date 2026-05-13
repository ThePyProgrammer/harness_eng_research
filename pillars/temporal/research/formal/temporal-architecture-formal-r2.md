# Temporal Architecture of AI Coding Agent Harnesses: Formal Metrics, Calibration, and Verification

**Formalization Round 2: Pareto Frontiers, Pipeline Calibration, Token Economics, Convergence, and Experimental Verification**
**Date:** 2026-04-03

---

## Preamble

This document develops formal metrics, empirically calibrated models, and verification approaches for the temporal architecture of AI coding agent harnesses. It builds on the research data from R1-R4 and the mathematical foundations from R4's formalizations of stochastic scheduling, cache invalidation, mode selection, and VIH decomposition.

**Epistemic categories:**
- **[E]** Established theory applied without modification
- **[S]** Novel synthesis of known results in the harness setting
- **[C]** Conjectured claims motivated by empirical data but lacking formal proof

**Notation conventions:** Variables are defined at first use. All expressions are LaTeX-ready. We write $\text{E}[\cdot]$ for expectation, $\text{Var}(\cdot)$ for variance, and use standard probability notation throughout.

---

## 1. Speed-Quality Pareto Frontier Formalization

### 1.1 Definitions and Setup [E]

Let $\mathcal{C}$ denote the set of all feasible harness configurations, where each configuration $c \in \mathcal{C}$ specifies a mode (Fast, Standard, Governed), parallelism level, speculation depth, cache policy, and verification strategy.

**Definition 1.1** (Speed). *The speed $S(c)$ of configuration $c$ is the expected number of completed iterations per hour:*

$$S(c) = \frac{\text{E}[N_{\text{total}}]}{T_{\text{wall}}}$$

*where $N_{\text{total}}$ counts all iterations (passing and failing) and $T_{\text{wall}}$ is wall-clock time in hours.*

**Definition 1.2** (Quality). *The quality $Q(c)$ of configuration $c$ is the probability that a completed iteration passes all verification checks:*

$$Q(c) = P(\text{iteration passes verification} \mid c)$$

*In practice, this is estimated as $Q(c) = N_{\text{verified}} / N_{\text{total}}$.*

**Definition 1.3** (Pareto Dominance). *Configuration $c_1$ dominates $c_2$ (written $c_1 \succ_P c_2$) iff $S(c_1) \geq S(c_2)$ and $Q(c_1) \geq Q(c_2)$, with at least one strict inequality.*

**Definition 1.4** (Pareto Frontier). *The Pareto frontier is:*

$$\mathcal{F} = \{c \in \mathcal{C} : \nexists\, c' \in \mathcal{C} \text{ s.t. } c' \succ_P c\}$$

*Projecting onto the objective space, $F = \{(S(c), Q(c)) : c \in \mathcal{F}\}$.*

### 1.2 Frontier Shape: Convex and Concave Regions [S]

Let the frontier be parameterized as $Q = f(S)$ where $f: [0, S_{\max}] \to [0, 1]$ is decreasing. The marginal rate of substitution (MRS) is:

$$\text{MRS}(S) = -f'(S)$$

measuring quality sacrificed per unit speed gained.

**Proposition 1.1** (Mixed Frontier Shape). *The empirical Pareto frontier $F$ contains both convex regions ($f''(S) < 0$, MRS increasing) and concave regions ($f''(S) > 0$, MRS decreasing).*

**Argument from empirical data [C]:** The frontier has at least three identifiable regimes, each with distinct curvature:

**Regime 1 (Low speed, $S \in [0, S_1]$): Concave.** At very low speeds (heavy governance, full re-reads, exhaustive verification), quality is near-maximal. Increasing speed from this regime initially costs little quality because the first gains come from eliminating redundant checks and idle time. The MRS is small and decreasing. Evidence: GSD's governed mode achieves high quality at ~1 iteration/hour; removing one verification pass saves 8-12 minutes while quality drops minimally.

**Regime 2 (Moderate speed, $S \in [S_1, S_2]$): Convex.** In the middle regime, easy speed gains have been exhausted. Each additional unit of speed requires skipping progressively more important verification steps: first linting, then type-checking, then test execution, then human review. Quality degrades acceleratingly. Evidence: SWE-Effi data shows that "Agentless" (slower, more careful) achieves 48% resolve rate with high token efficiency, while "SWE-Agent" (faster, more iterations) achieves lower effectiveness scores per resource unit.

**Regime 3 (High speed, $S > S_2$): Concave again.** At very high speeds, the system transitions to a statistical quality regime. Individual iterations are low-quality, but the sheer volume enables statistical filtering: run many cheap iterations and select the best via majority voting or test-suite filtering. The pass rate stabilizes at some floor $Q_{\min} > 0$ while speed continues to increase. Evidence: Best-of-N sampling in SWE-bench shows that Pass@5 substantially exceeds Pass@1, meaning running 5x more iterations at lower quality per iteration yields higher effective quality. The DeepSeek-v2.5 data point ($0.003/issue at competitive resolve rates) suggests this regime exists in practice.

**Remark.** The concavity in Regime 3 is the key structural insight. It means the frontier is non-convex overall, which has consequences for mixing strategies (Section 1.3).

### 1.3 Mixing Strategies and Convex Hull [E + S]

**Theorem 1.2** (Convexification by Randomization). *Let $(S_1, Q_1)$ and $(S_2, Q_2)$ be two points on the frontier $F$. The randomized strategy that selects $(S_1, Q_1)$ with probability $\alpha$ and $(S_2, Q_2)$ with probability $1 - \alpha$ achieves the expected outcome:*

$$(S_{\text{mix}}, Q_{\text{mix}}) = (\alpha S_1 + (1-\alpha) S_2,\; \alpha Q_1 + (1-\alpha) Q_2)$$

*This point lies on the line segment between $(S_1, Q_1)$ and $(S_2, Q_2)$.*

*Proof.* By linearity of expectation. The mixing is over independent draws from the two configurations; the expected speed is the mixture of speeds, and the expected quality is the mixture of qualities, since quality is defined as a probability (hence also linear in mixing). $\square$

**Corollary 1.3** (Concave Regions: Mixing Dominates). *In a concave region of $F$ (where the frontier curves away from the origin), the line segment between two frontier points lies above the frontier. Therefore, the mixed strategy achieves $(S, Q)$ pairs that Pareto-dominate every pure strategy in that region.*

**Corollary 1.4** (Convex Regions: Pure Strategies Dominate). *In a convex region of $F$, the line segment lies below the frontier. Pure strategies on the frontier dominate all mixtures of nearby points.*

**Definition 1.5** (Effective Frontier). *The effective frontier $\hat{F}$ under mixing is the upper boundary of the convex hull of $F$:*

$$\hat{F} = \text{upper-conv}(\text{conv}(F))$$

*This is the frontier a rational agent faces when it can randomize between configurations.*

**Practical interpretation [S]:** For a harness that can switch between a "Governed" operating point $(S_G, Q_G)$ and a "Fast" operating point $(S_F, Q_F)$, where both lie in a concave region, the optimal strategy is to probabilistically alternate between them rather than searching for a single intermediate configuration. The mixing fraction $\alpha$ is a design parameter that can be tuned to the current workload's speed-quality preference.

This is the direct analogue of the classical result in multi-objective optimization: the weighted-sum scalarization method can only find points on the convex parts of the frontier. Points in concave regions require either the epsilon-constraint method, the Chebyshev scalarization, or randomized strategies (Ehrgott, 2005, "Multicriteria Optimization," Springer).

### 1.4 VIH Maximization on the Frontier [S]

**Definition 1.6** (VIH). *Verified Iterations per Hour:*

$$\text{VIH} = S \cdot Q$$

**Proposition 1.5** (Iso-VIH Curves). *The locus of points $(S, Q)$ with constant VIH = $v$ is the rectangular hyperbola:*

$$Q = v / S$$

*These curves are convex, decreasing, and asymptotic to both axes.*

**Theorem 1.6** (VIH Tangency Condition). *VIH is maximized on the frontier $F$ at the point $(S^*, Q^*)$ where the iso-VIH hyperbola is tangent to $F$. At this tangency point:*

$$\left.\frac{dQ}{dS}\right|_F = -\frac{Q^*}{S^*}$$

*Proof.* We maximize $\text{VIH}(S) = S \cdot f(S)$ where $Q = f(S)$ parameterizes the frontier. Setting the derivative to zero:

$$\frac{d\text{VIH}}{dS} = f(S) + S \cdot f'(S) = 0$$

$$\Rightarrow f'(S^*) = -\frac{f(S^*)}{S^*} = -\frac{Q^*}{S^*}$$

The slope of the frontier at the optimum equals the slope of the iso-VIH curve, which is $-Q/S$ (from differentiating $Q = v/S$). $\square$

**Corollary 1.7** (Unit Elasticity Condition). *At the VIH-maximizing point, the elasticity of quality with respect to speed is exactly $-1$:*

$$\varepsilon_{Q,S} = \frac{dQ}{dS} \cdot \frac{S}{Q} = -1$$

*Interpretation: a 1% increase in speed causes exactly a 1% decrease in quality. Below this point ($|\varepsilon| < 1$), speed gains improve VIH. Above it ($|\varepsilon| > 1$), speed gains degrade VIH.*

**Theorem 1.8** (VIH on the Effective Frontier). *If the VIH-maximizing point $(S^*, Q^*)$ lies in a concave region of $F$, then on the effective frontier $\hat{F}$ (the convex hull), the VIH-maximizing strategy is a mixture of two pure strategies $(S_a, Q_a)$ and $(S_b, Q_b)$ that bracket the concave region. The optimal mixing fraction is:*

$$\alpha^* = \frac{S^* - S_b}{S_a - S_b}$$

*where $S^*$ is determined by the tangency condition on the convexified frontier.*

*Proof sketch.* On the convex hull, the concave region is replaced by a chord connecting $(S_a, Q_a)$ and $(S_b, Q_b)$. The tangency condition on this chord (which is linear) gives a unique $S^*$ in $[S_b, S_a]$, and the corresponding mixing fraction follows from the convex combination. $\square$

### 1.5 Sufficient Conditions for Interior Maximum [E + S]

**Proposition 1.9** (Log-Concavity and Uniqueness). *If $f$ is log-concave (i.e., $\log f(S)$ is concave), then $\text{VIH}(S) = S \cdot f(S)$ has a unique interior maximum.*

*Proof.* $\log \text{VIH}(S) = \log S + \log f(S)$. The function $\log S$ is strictly concave. The sum of a strictly concave function and a concave function is strictly concave. A strictly concave function on a compact interval has a unique maximum. $\square$

**Proposition 1.10** (Exponential Quality Decay Model). *If $Q = f(S) = Q_0 \cdot e^{-\beta(S - S_0)}$ for some $Q_0, \beta, S_0 > 0$, then:*

$$S^* = 1/\beta$$

$$\text{VIH}^* = Q_0 \cdot e^{-(1/\beta - S_0)\beta} / \beta = Q_0 \cdot e^{-1 + \beta S_0} / \beta$$

*This model is log-linear (hence log-concave), so the maximum is unique.*

---

## 2. Empirical Calibration of the Pipeline Model

### 2.1 Stage Duration Distributions [S]

Using the GSD cycle time data, we model each pipeline stage with a log-normal distribution. The log-normal is chosen because: (a) stage durations are strictly positive, (b) they exhibit right-skew (occasional long tails from retries, API timeouts, complex tasks), and (c) the product of many independent factors (prompt length, model load, task complexity) produces log-normal durations by the multiplicative central limit theorem.

**Stage parameters (fitted from reported ranges):**

For a log-normal distribution $X \sim \text{LogNormal}(\mu, \sigma^2)$, the mean is $e^{\mu + \sigma^2/2}$ and the variance is $(e^{\sigma^2} - 1) \cdot e^{2\mu + \sigma^2}$. We calibrate $\mu$ and $\sigma$ from the reported min-max ranges, assuming the range covers approximately the 10th to 90th percentile (a factor of $e^{2 \cdot 1.28\sigma}$ between endpoints).

| Stage | Range (min) | Midpoint | $\mu$ (log-min) | $\sigma$ | $\text{E}[T]$ (min) | $\text{CV}$ |
|-------|-------------|----------|------------------|----------|----------------------|-------------|
| Context Loading | 8-12 | 10.0 | 2.28 | 0.16 | 10.0 | 0.16 |
| Research | 5-10 | 7.5 | 1.95 | 0.27 | 7.6 | 0.27 |
| Planning | 5-8 | 6.5 | 1.85 | 0.19 | 6.5 | 0.19 |
| Execution | 10-15 | 12.5 | 2.49 | 0.16 | 12.5 | 0.16 |
| Verification | 8-12 | 10.0 | 2.28 | 0.16 | 10.0 | 0.16 |
| Human Review | 5-15 | 10.0 | 2.16 | 0.44 | 10.2 | 0.46 |

**Calibration notes:**

The coefficient of variation (CV) captures stage-to-stage predictability. Human review has the highest CV (0.46), consistent with its dependence on developer availability, change complexity, and attention. Research has the next highest CV (0.27), reflecting the inherent variability in codebase analysis tasks. The other stages cluster around CV ~ 0.16-0.19.

An alternative model uses the gamma distribution $\text{Gamma}(k, \theta)$, which also supports positive-valued, right-skewed durations. The gamma shape parameter $k = 1/\text{CV}^2$ gives: Context Loading $k \approx 39$, Human Review $k \approx 4.7$. The high $k$ for context loading means it is nearly deterministic (most of the time is file I/O), while the low $k$ for human review means it is highly variable.

### 2.2 Sequential Makespan [E + S]

Under sequential execution, the total cycle time is:

$$T_{\text{seq}} = \sum_{i=1}^{6} T_i$$

where $T_i$ are the stage durations. By linearity of expectation:

$$\text{E}[T_{\text{seq}}] = \sum_{i=1}^{6} \text{E}[T_i] = 10.0 + 7.6 + 6.5 + 12.5 + 10.0 + 10.2 = 56.8 \text{ min}$$

The variance, assuming independence:

$$\text{Var}(T_{\text{seq}}) = \sum_{i=1}^{6} \text{Var}(T_i) = \sum_{i=1}^{6} (\text{CV}_i \cdot \text{E}[T_i])^2$$

$$= (1.6)^2 + (2.05)^2 + (1.24)^2 + (2.0)^2 + (1.6)^2 + (4.69)^2$$

$$= 2.56 + 4.20 + 1.54 + 4.00 + 2.56 + 22.00 = 36.86 \text{ min}^2$$

$$\text{SD}(T_{\text{seq}}) = 6.07 \text{ min}$$

The 90th percentile cycle time (assuming approximate normality by CLT, which is reasonable for the sum of 6 independent stages):

$$T_{\text{seq}}^{(90)} \approx 56.8 + 1.28 \times 6.07 = 64.6 \text{ min}$$

This aligns well with the reported "45-60 minute practical center" (our model gives the mean at 56.8 and the 10th-90th range as roughly 49-65 minutes).

### 2.3 Speculative Pipelining: Overlapped Makespan [S]

Speculative pipelining overlaps stages that have precedence dependencies. Two primary overlaps are architecturally feasible:

**Overlap 1: Planning with Execution.** Begin execution speculatively while planning is still being refined. If the plan changes, discard and restart execution. The overlap benefit is $\text{E}[\min(T_{\text{plan}}, T_{\text{exec}})]$.

For two independent log-normals $X \sim \text{LN}(\mu_X, \sigma_X^2)$ and $Y \sim \text{LN}(\mu_Y, \sigma_Y^2)$:

$$\text{E}[\min(X, Y)] = \text{E}[X] + \text{E}[Y] - \text{E}[\max(X, Y)]$$

Computing $\text{E}[\max(X,Y)]$ exactly for log-normals requires numerical integration. Using the approximation for the case where both distributions are similar:

$$\text{E}[\min(X, Y)] \approx \frac{\text{E}[X] \cdot \text{E}[Y]}{\text{E}[X] + \text{E}[Y]} \cdot 2 = \frac{2 \cdot 6.5 \cdot 12.5}{6.5 + 12.5} = \frac{162.5}{19.0} = 8.55 \text{ min}$$

(This uses the harmonic-mean-based approximation valid for moderate CV; for a more precise estimate, we would need the joint distribution.)

More directly: $\text{E}[\max(X,Y)] \approx \text{E}[X] + \text{E}[Y] - \text{E}[\min(X,Y)]$. For the overlap, the parallel execution time is $\text{E}[\max(T_{\text{plan}}, T_{\text{exec}})]$ rather than $\text{E}[T_{\text{plan}}] + \text{E}[T_{\text{exec}}]$. The saving is:

$$\Delta_1 = \text{E}[T_{\text{plan}}] + \text{E}[T_{\text{exec}}] - \text{E}[\max(T_{\text{plan}}, T_{\text{exec}})]$$

$$= \text{E}[\min(T_{\text{plan}}, T_{\text{exec}})]$$

Since $T_{\text{plan}}$ has the shorter mean (6.5 vs. 12.5), the overlap saving is approximately $\text{E}[\min(T_{\text{plan}}, T_{\text{exec}})] \approx 5.5$ min (planning completes within execution most of the time, so the overlap is roughly the planning duration minus the probability-weighted portion where execution finishes first).

A conservative estimate: $\Delta_1 \approx 5.0$ min, requiring success probability $p_1$ for the speculated execution to be valid.

**Overlap 2: Verification with next-cycle Context Loading.** Begin the next cycle's context loading while verification runs on the current cycle. This overlap is safer because context loading is independent of the current cycle's outcome (assuming the context to load is the project state, not the current cycle's results).

$$\Delta_2 = \text{E}[\min(T_{\text{verify}}, T_{\text{context}})] \approx \min(10.0, 10.0) - \text{E}[\max(T_{\text{verify}}, T_{\text{context}})] + 10.0$$

Since both have mean 10.0 and CV ~0.16:

$$\Delta_2 \approx 10.0 \cdot (2 - \sqrt{1 + \text{CV}^2}) \approx 10.0 \cdot 0.49 = 4.9 \text{ min}$$

(Using the approximation $\text{E}[\min(X,Y)] \approx \text{E}[X](1 - \text{CV}/\sqrt{2\pi})$ for identically distributed variables with small CV.)

More precisely, for two i.i.d. log-normals with $\mu = 2.28$ and $\sigma = 0.16$:

$$\text{E}[\max(X,Y)] = 2\Phi(\sigma/\sqrt{2}) \cdot e^{\mu + \sigma^2/2} = 2\Phi(0.113) \cdot 10.0 \approx 2 \times 0.545 \times 10.0 = 10.9 \text{ min}$$

$$\Delta_2 = 2 \times 10.0 - 10.9 = 9.1 \text{ min}$$

This seems too high; the correct formula for $\text{E}[\max]$ of two i.i.d. log-normals is:

$$\text{E}[\max(X_1, X_2)] = 2 e^{\mu + \sigma^2/2} \Phi(\sigma/\sqrt{2})$$

$$= 2 \times 10.0 \times \Phi(0.113) = 2 \times 10.0 \times 0.545 = 10.9$$

So $\Delta_2 = 20.0 - 10.9 = 9.1$ min. But this is the saving from running them in parallel rather than sequentially, which counts the full overlap. Since they overlap at the cycle boundary, the per-cycle saving is approximately half this: $\Delta_2 \approx 4.5$ min (the next cycle starts 4.5 minutes earlier because context loading overlapped with verification).

**Speculative makespan:**

$$\text{E}[T_{\text{spec}}] = \text{E}[T_{\text{seq}}] - p_1 \cdot \Delta_1 - \Delta_2$$

$$= 56.8 - p_1 \cdot 5.0 - 4.5$$

For speculation accuracy $p_1 = 0.80$ (conservative; the planning-execution overlap has high accuracy when the plan is mostly complete before execution starts):

$$\text{E}[T_{\text{spec}}] = 56.8 - 4.0 - 4.5 = 48.3 \text{ min}$$

For $p_1 = 0.90$:

$$\text{E}[T_{\text{spec}}] = 56.8 - 4.5 - 4.5 = 47.8 \text{ min}$$

**Penalty for misprediction:** When the plan-execution speculation fails (probability $1 - p_1$), execution must restart, adding approximately $\text{E}[T_{\text{exec}}] = 12.5$ min. The expected penalty is $(1 - p_1) \times 12.5$ min. For $p_1 = 0.80$, this is $0.20 \times 12.5 = 2.5$ min. The net saving is $5.0 \times 0.80 - 2.5 = 1.5$ min from Overlap 1, which is still positive.

### 2.4 Speedup from the Four Target Strategies [S + C]

We quantify the theoretical speedup from each of the paper's four proposed strategies:

**Strategy 1: Persistent State.** Eliminates redundant context loading between consecutive cycles when working on related tasks. Saves $\text{E}[T_{\text{context}}] \times (1 - p_{\text{new}})$, where $p_{\text{new}}$ is the probability that the next task requires a completely new context.

Estimated saving: with $p_{\text{new}} = 0.30$ (70% of consecutive tasks share sufficient context), the saving is $10.0 \times 0.70 = 7.0$ min/cycle.

However, persistent state degrades quality per the "fresh eyes" effect (17.1% accuracy advantage for fresh context). The VIH impact depends on the tradeoff:

$$\Delta\text{VIH}_{\text{persist}} = \frac{1}{T_{\text{seq}} - 7.0} \cdot (Q_0 - 0.171 \cdot Q_0) - \frac{Q_0}{T_{\text{seq}}}$$

$$= Q_0 \left(\frac{0.829}{49.8} - \frac{1.0}{56.8}\right) = Q_0 (0.01665 - 0.01761) = -0.00096 \cdot Q_0$$

This is slightly negative, meaning persistent state (with the full 17.1% quality penalty) actually decreases VIH. The strategy is only VIH-positive if the quality penalty is less than:

$$\Delta Q_{\text{max}} = Q_0 \left(1 - \frac{T_{\text{seq}} - 7.0}{T_{\text{seq}}}\right) = Q_0 \cdot \frac{7.0}{56.8} = 0.123 \cdot Q_0$$

So the quality penalty must be below 12.3% for persistent state to be VIH-positive. The reported 17.1% exceeds this threshold, suggesting that naive persistent state is VIH-negative. Context compaction (retaining relevant state while discarding noise) may reduce the quality penalty below this threshold.

**Strategy 2: Speculative Pipelining.** As computed in Section 2.3, the expected saving is 8.5-9.0 min/cycle with minimal quality impact (the overlapped stages do not compromise verification thoroughness).

Speedup factor: $56.8 / 47.8 = 1.19\times$ (19% reduction in cycle time).

VIH improvement: Since quality is preserved, $\Delta\text{VIH} = Q_0 \cdot (1/47.8 - 1/56.8) = Q_0 \cdot 0.00332/\text{min} = Q_0 \cdot 0.199/\text{hr}$.

**Strategy 3: Tiered Verification.** Replace full verification (8-12 min) with a tiered approach: fast checks (lint, type-check, 2 min) for low-risk changes; full verification for high-risk changes.

Let $p_{\text{low}} = 0.60$ be the fraction of low-risk changes. The expected verification time becomes:

$$\text{E}[T_{\text{verify}}^{\text{tiered}}] = p_{\text{low}} \cdot 2.0 + (1 - p_{\text{low}}) \cdot 10.0 = 1.2 + 4.0 = 5.2 \text{ min}$$

Saving: $10.0 - 5.2 = 4.8$ min. But tiered verification may miss defects in "low-risk" changes that are misclassified (Type II error from the mode selection framework). Let $q_{\text{miss}}$ be the probability that a tiered-fast check misses a defect that full verification would catch. The effective quality under tiered verification:

$$Q_{\text{tiered}} = Q_0 - p_{\text{low}} \cdot q_{\text{miss}} \cdot (1 - Q_0)$$

For $q_{\text{miss}} = 0.10$ and $Q_0 = 0.80$:

$$Q_{\text{tiered}} = 0.80 - 0.60 \times 0.10 \times 0.20 = 0.80 - 0.012 = 0.788$$

VIH comparison: $\text{VIH}_{\text{tiered}} = 0.788 / (52.0/60) = 0.909/\text{hr}$ vs. $\text{VIH}_{\text{full}} = 0.80 / (56.8/60) = 0.845/\text{hr}$. Net improvement: 7.6%.

**Strategy 4: Async Governance.** Run human review asynchronously; the agent proceeds to the next task while the human reviews. This eliminates $\text{E}[T_{\text{review}}] = 10.2$ min from the critical path, but requires maintaining multiple concurrent contexts.

Effective cycle time for the agent: $56.8 - 10.2 = 46.6$ min. Human review runs in parallel and provides feedback that may require rework. Let $p_{\text{rework}} = 0.25$ (25% of reviews request changes) with rework cost $\text{E}[T_{\text{rework}}] = 8$ min.

Effective throughput under async governance:

$$\lambda_{\text{async}} = \frac{1}{46.6 + p_{\text{rework}} \cdot T_{\text{rework}}} = \frac{1}{46.6 + 2.0} = \frac{1}{48.6} \text{ cycles/min}$$

Speedup: $56.8 / 48.6 = 1.17\times$.

**Combined speedup (all four strategies, avoiding double-counting):**

The strategies are not fully additive because some savings overlap. A conservative combined estimate:

$$\text{E}[T_{\text{combined}}] \approx 56.8 - 5.0_{\text{persist}} - 8.5_{\text{speculative}} - 4.8_{\text{tiered}} - 8.0_{\text{async}} + 3.0_{\text{overlap\,correction}}$$

$$= 56.8 - 23.3 = 33.5 \text{ min}$$

But with quality adjustments for persistent state, the VIH-optimal combination likely excludes naive persistent state, giving:

$$\text{E}[T_{\text{VIH-opt}}] \approx 56.8 - 8.5 - 4.8 - 8.0 + 2.0 = 37.5 \text{ min}$$

Speedup: $56.8 / 37.5 = 1.51\times$, a 34% reduction in cycle time with minimal quality impact.

---

## 3. Token Economics Model

### 3.1 Basic Cost Model [E + S]

The cost of a single iteration is:

$$C = p_{\text{input}} \cdot T_{\text{input}} + p_{\text{output}} \cdot T_{\text{output}} + p_{\text{cache}} \cdot T_{\text{cached}}$$

where:
- $p_{\text{input}}$: price per token for uncached input (e.g., $3.00/MTok for Claude Sonnet)
- $p_{\text{output}}$: price per token for output (e.g., $15.00/MTok)
- $p_{\text{cache}}$: price per token for cached input (e.g., $0.30/MTok)
- $T_{\text{input}}$: uncached input tokens
- $T_{\text{output}}$: output tokens
- $T_{\text{cached}}$: cached input tokens

**The 100:1 ratio [empirical].** Production agent workflows exhibit $R_{io} = T_{\text{input}} / T_{\text{output}} \approx 100$. This is because context (project state, file contents, tool definitions, conversation history) vastly exceeds the structured output (function calls, code patches, status messages). Manus AI reports this ratio; Claude Code's production telemetry confirms it.

### 3.2 Cache Hit Rate Model [S]

**Definition 3.1** (Cache Hit Rate). *The cache hit rate $h$ is the fraction of input tokens served from cache:*

$$h = \frac{T_{\text{cached}}}{T_{\text{cached}} + T_{\text{input}}} = 1 - \frac{T_{\text{input}}}{T_{\text{total\,input}}}$$

The hit rate depends on context stability between consecutive API calls. Let $T_{\text{total}}$ be the total prompt tokens and $T_{\text{changed}}$ be the tokens that differ from the previous call (new messages, updated tool results, etc.). Since KV-cache invalidation is prefix-based (a single changed token invalidates all subsequent tokens), the effective hit rate is:

$$h = \frac{\text{position of first change}}{T_{\text{total}}}$$

For a well-structured prompt (static system prompt and tool definitions first, then conversation history, then current input), the static prefix is typically 60-80% of total tokens, giving a baseline $h \geq 0.60$. Claude Code achieves $h = 0.92$ in production by careful prompt assembly.

**Context stability model:** Let $\delta = T_{\text{changed}} / T_{\text{total}}$ be the change fraction. For append-only prompts (each turn adds tokens but does not modify previous ones):

$$h = 1 - \delta$$

where $\delta$ decreases as the conversation progresses (each new turn is a smaller fraction of the growing total). For a conversation of $n$ turns, each adding $T_{\text{turn}}$ tokens to a base of $T_{\text{base}}$ tokens:

$$h(n) = 1 - \frac{T_{\text{turn}}}{T_{\text{base}} + n \cdot T_{\text{turn}}}$$

This is increasing in $n$ and approaches 1, explaining why cache hit rates improve over longer sessions.

### 3.3 Cost Reduction from Caching [E + S]

The cost per iteration without caching:

$$C_{\text{no-cache}} = p_{\text{input}} \cdot T_{\text{total\,input}} + p_{\text{output}} \cdot T_{\text{output}}$$

With caching at hit rate $h$:

$$C_{\text{cached}} = p_{\text{input}} \cdot (1-h) \cdot T_{\text{total\,input}} + p_{\text{cache}} \cdot h \cdot T_{\text{total\,input}} + p_{\text{output}} \cdot T_{\text{output}}$$

The cost reduction on input tokens:

$$\Delta C = (p_{\text{input}} - p_{\text{cache}}) \cdot h \cdot T_{\text{total\,input}}$$

The fractional saving on total cost:

$$\frac{\Delta C}{C_{\text{no-cache}}} = \frac{(p_{\text{input}} - p_{\text{cache}}) \cdot h \cdot T_{\text{total\,input}}}{p_{\text{input}} \cdot T_{\text{total\,input}} + p_{\text{output}} \cdot T_{\text{output}}}$$

$$= \frac{(1 - p_{\text{cache}}/p_{\text{input}}) \cdot h}{1 + (p_{\text{output}}/p_{\text{input}}) \cdot (T_{\text{output}}/T_{\text{total\,input}})}$$

With the empirical values ($p_{\text{cache}}/p_{\text{input}} = 0.10$, $p_{\text{output}}/p_{\text{input}} = 5.0$, $R_{io} = 100$, so $T_{\text{output}}/T_{\text{total\,input}} = 0.01$):

$$\frac{\Delta C}{C_{\text{no-cache}}} = \frac{0.90 \cdot h}{1 + 5.0 \times 0.01} = \frac{0.90 h}{1.05} = 0.857 h$$

For $h = 0.92$ (Claude Code production): fractional saving $= 0.857 \times 0.92 = 0.789$, i.e., **78.9% cost reduction**.

For $h \to 1$: fractional saving $\to 0.857$, i.e., maximum **85.7% cost reduction**. The limit is below 90% because output tokens (which are not cached) contribute 5% of total cost.

**Remark.** The commonly cited "up to 90% saving" applies to input token costs specifically. The total cost saving is bounded by approximately 86% because output tokens are irreducible.

### 3.4 VIH-Adjusted Cost [S]

The cost per verified iteration combines the token cost with the verification pass rate:

$$C_{\text{verified}} = \frac{C}{p_{\text{verify}} \cdot \lambda_{\text{raw}}}$$

where $p_{\text{verify}} = Q$ is the verification pass rate and $\lambda_{\text{raw}} = S$ is the raw iteration rate. More directly:

$$C_{\text{per-VIH}} = \frac{C}{\text{VIH}} = \frac{C}{S \cdot Q}$$

This metric reveals the true unit economics: the cost of one verified iteration. A system that is cheap per token but has low VIH (slow, or low quality) may cost more per verified iteration than a system that is expensive per token but has high VIH.

**Numerical example.** Using SWE-Effi data:

| System | Cost/Issue | Resolve Rate | Cost per Resolved Issue |
|--------|-----------|-------------|------------------------|
| Claude 3.5 Sonnet (OpenHands) | $0.30 | 27% | $1.11 |
| DeepSeek-v2.5 (OpenHands) | $0.003 | ~25% (est.) | $0.012 |
| Sonar Foundation Agent | $1.26 | ~40% (est.) | $3.15 |

The 100x cost difference between Claude and DeepSeek per issue narrows to roughly 90x per resolved issue due to similar resolve rates. But if we add the "failed attempt" token snowball (Section 4.4), the gap narrows further because cheaper models may attempt more iterations before succeeding.

### 3.5 The Cache-Quality Tension [S + C]

Caching requires context stability. Quality requires context freshness. These are in direct tension.

**Formalization.** Let $h(t)$ be the cache hit rate after $t$ steps without a context reset, and let $Q(t)$ be the quality after $t$ steps. From the agent drift data (arXiv:2601.04170):

$$Q(t) \approx Q_0 \cdot (1 - \gamma \cdot t^{1.2})$$

where $\gamma$ is a decay constant calibrated to the empirical drift onset at $t \approx 73$ interactions.

The cost-quality product (negative cost, positive quality) is:

$$\text{Value}(t) = Q(t) \cdot \frac{1}{C(t)} \propto Q(t) \cdot \frac{1}{1 - 0.857 \cdot h(t)}$$

This product initially increases (caching savings dominate drift) then decreases (drift dominates). The optimal reset interval $t^*$ is where $d\text{Value}/dt = 0$.

For the simplified model where $h(t) = 1 - 1/t$ (cache hit rate improving as the static prefix becomes a larger fraction) and $Q(t) = Q_0 e^{-\gamma t}$:

$$\text{Value}(t) \propto e^{-\gamma t} \cdot t$$

$$\frac{d\text{Value}}{dt} = e^{-\gamma t}(1 - \gamma t) = 0 \implies t^* = 1/\gamma$$

With drift onset at approximately 73 interactions and assuming exponential decay with $Q(73) = Q_0/2$:

$$\gamma = \ln(2)/73 \approx 0.0095$$

$$t^* = 1/0.0095 \approx 105 \text{ interactions}$$

This suggests the optimal reset point is around 105 interactions, after which the cost savings from caching no longer compensate for quality loss. For a GSD-style cycle with ~47 tool calls per session (Anthropic 2026 data), this corresponds to roughly 2-3 cycles before a full context reset is optimal.

---

## 4. Convergence and Diminishing Returns

### 4.1 Multi-Agent Diminishing Returns Model [S]

The empirical data on multi-agent code verification shows diminishing marginal gains per additional agent:

| Agent Count | Cumulative Improvement | Marginal Gain |
|-------------|----------------------|---------------|
| 1 (baseline) | 0 | -- |
| 2 | +14.9 pp | +14.9 pp |
| 3 | +28.4 pp | +13.5 pp |
| 4 | +39.6 pp | +11.2 pp |

**Model 1: Saturating Exponential [E].**

$$Q(n) = Q_{\max} \cdot (1 - e^{-\alpha n})$$

where $Q_{\max}$ is the asymptotic maximum quality and $\alpha$ is the learning/verification rate.

Fitting to the data (setting $Q(0) = Q_{\text{baseline}}$ and interpreting the improvements as $\Delta Q(n) = Q(n) - Q_{\text{baseline}}$):

$$\Delta Q(n) = Q_{\infty} \cdot (1 - e^{-\alpha n})$$

From the three data points:
- $\Delta Q(1) = 14.9 = Q_\infty(1 - e^{-\alpha})$
- $\Delta Q(2) = 28.4 = Q_\infty(1 - e^{-2\alpha})$
- $\Delta Q(3) = 39.6 = Q_\infty(1 - e^{-3\alpha})$

Dividing $\Delta Q(2)/\Delta Q(1)$:

$$\frac{1 - e^{-2\alpha}}{1 - e^{-\alpha}} = \frac{28.4}{14.9} = 1.906$$

Let $x = e^{-\alpha}$. Then $(1 - x^2)/(1 - x) = 1 + x = 1.906$, giving $x = 0.906$ and $\alpha = -\ln(0.906) = 0.0987$.

From $\Delta Q(1)$: $Q_\infty = 14.9 / (1 - 0.906) = 14.9 / 0.094 = 158.5$ pp.

This implies $Q_\infty \approx 158.5$ percentage points of improvement, which is unrealistically large (quality cannot exceed 100%). The exponential model is a local approximation valid for small $n$ but should not be extrapolated.

**Model 2: Logistic (bounded) [E + S].**

A more realistic model bounds quality at $Q_{\max} = 1$:

$$Q(n) = \frac{Q_{\max}}{1 + \left(\frac{Q_{\max}}{Q_0} - 1\right) e^{-\alpha n}}$$

With $Q_0 = 0.50$ (single-agent baseline from drift paper), $Q_{\max} = 0.95$:

Fitting $Q(2) = 0.50 + 0.149 = 0.649$, $Q(3) = 0.50 + 0.284 = 0.784$, $Q(4) = 0.50 + 0.396 = 0.896$:

$$0.649 = \frac{0.95}{1 + 0.9 \cdot e^{-2\alpha}}$$

$$1 + 0.9 \cdot e^{-2\alpha} = 0.95/0.649 = 1.464$$

$$e^{-2\alpha} = 0.515 \implies \alpha = 0.332$$

Verification against $Q(4)$: $Q(4) = 0.95 / (1 + 0.9 \cdot e^{-4 \times 0.332}) = 0.95 / (1 + 0.9 \times 0.265) = 0.95 / 1.239 = 0.767$.

The predicted $Q(4) = 0.767$ vs. observed $0.896$; the logistic underestimates. This suggests the actual convergence is faster than logistic, which is consistent with a "phase transition" effect where multi-agent verification becomes qualitatively better once enough agents can form a majority vote.

**Model 3: Power law [C].**

$$\Delta Q(n) = A \cdot n^{-\beta + 1} \quad (\text{marginal gain at step } n)$$

The marginal gains (14.9, 13.5, 11.2) are well fit by $\Delta Q_{\text{marginal}}(n) = C \cdot n^{-0.45}$:

- $n=1$: $C \cdot 1.0 = 14.9 \implies C = 14.9$
- $n=2$: $14.9 \times 2^{-0.45} = 14.9 \times 0.731 = 10.9$ (observed: 13.5)
- $n=3$: $14.9 \times 3^{-0.45} = 14.9 \times 0.587 = 8.7$ (observed: 11.2)

The power law underestimates. A better fit uses $\beta = 0.20$:

- $n=2$: $14.9 \times 2^{-0.20} = 14.9 \times 0.871 = 13.0$ (observed: 13.5)
- $n=3$: $14.9 \times 3^{-0.20} = 14.9 \times 0.803 = 12.0$ (observed: 11.2)

With $\beta \approx 0.20$, the cumulative gain is:

$$\Delta Q_{\text{cum}}(n) = \sum_{k=1}^{n} 14.9 \cdot k^{-0.20} \approx 14.9 \cdot \frac{n^{0.80}}{0.80}$$

This diverges slowly, so quality would eventually exceed 100%, again requiring a cap. The practical model is:

$$Q(n) = \min(Q_{\max},\; Q_0 + 14.9 \cdot \sum_{k=1}^{n} k^{-0.20} / 100)$$

### 4.2 Optimal Iteration Count for VIH [S]

Under the saturating exponential model (valid locally), VIH as a function of iteration count $n$ is:

$$\text{VIH}(n) = \frac{Q(n)}{T(n)} = \frac{Q_0 + Q_\infty(1 - e^{-\alpha n})}{T_0 + n \cdot T_{\text{iter}}}$$

where $T_0$ is the fixed setup cost and $T_{\text{iter}}$ is the time per additional iteration.

Setting $d\text{VIH}/dn = 0$:

$$Q_\infty \alpha e^{-\alpha n} \cdot (T_0 + n T_{\text{iter}}) = (Q_0 + Q_\infty(1 - e^{-\alpha n})) \cdot T_{\text{iter}}$$

This is a transcendental equation with no closed-form solution. Let $x = e^{-\alpha n}$:

$$Q_\infty \alpha x \cdot (T_0 - \frac{\ln x}{\alpha} T_{\text{iter}}) = (Q_0 + Q_\infty(1-x)) \cdot T_{\text{iter}}$$

For the special case $Q_0 = 0$ (all quality comes from iteration), $T_0 = 0$ (no setup cost), this simplifies to:

$$\alpha x \cdot n = 1 - x$$

$$\alpha n \cdot e^{-\alpha n} = 1 - e^{-\alpha n}$$

Let $u = \alpha n$: $u e^{-u} = 1 - e^{-u}$, giving $u = (e^u - 1)/e^u \cdot 1/u$, which by numerical solution gives $u^* \approx 1.28$, so $n^* \approx 1.28/\alpha$.

With $\alpha = 0.0987$: $n^* \approx 13.0$ iterations. This is the VIH-optimal number of iterations when all quality comes from iteration.

When there is a nonzero baseline quality $Q_0$ and setup cost $T_0$, the optimal $n^*$ decreases (because there is less marginal quality to gain from additional iterations relative to their time cost).

### 4.3 VIH-Maximizing Number of Agents [S]

For multi-agent verification where quality $Q(k)$ increases with agent count $k$ but time increases as $T(k) = T_1 + (k-1) \cdot T_{\text{agent}}$ (sequential agent calls), the VIH is:

$$\text{VIH}(k) = \frac{Q(k)}{T(k)/60}$$

Using the empirical data and linear time model ($T_{\text{agent}} = 5$ min per additional agent verification round):

| $k$ | $Q(k)$ | $T(k)$ (min) | VIH |
|-----|---------|---------------|-----|
| 1 | 0.500 | 56.8 | 0.528 |
| 2 | 0.649 | 61.8 | 0.630 |
| 3 | 0.784 | 66.8 | 0.704 |
| 4 | 0.896 | 71.8 | 0.749 |
| 5 | 0.940 (est.) | 76.8 | 0.734 |
| 6 | 0.955 (est.) | 81.8 | 0.700 |

VIH peaks at $k^* = 4$ agents. Adding a 5th agent yields $\Delta Q = +0.044$ but costs 5 minutes, dropping VIH. The 4th agent is the last one whose marginal quality gain ($+0.112$) exceeds the marginal time cost in VIH terms.

**General optimality condition:** Add agent $k+1$ iff:

$$\frac{\Delta Q(k+1)}{T_{\text{agent}}} > \frac{Q(k)}{T(k)}$$

That is, the marginal quality-per-minute from the new agent exceeds the current VIH (converted to quality-per-minute). This is the "VIH marginal condition."

### 4.4 Token Snowball Effect [S]

The SWE-Effi data establishes that failed attempts consume dramatically more tokens than successful ones:

| System | Ratio ($C_{\text{fail}} / C_{\text{success}}$) |
|--------|----------------------------------------------|
| SWE-Agent + GPT-4o-mini | 4.7x (tokens) |
| AutoCodeRover + Qwen3-32B | 13.1x (input tokens) |
| OpenHands + Llama-3.3-70B | 3.0x (wall time) |

**Model:** Let $p$ be the probability of success on a given attempt, and let $C_s$ and $C_f = k \cdot C_s$ be the costs of success and failure respectively, with $k \in [3, 13]$.

The expected cost per eventual success (geometric distribution):

$$\text{E}[C_{\text{total}}] = \frac{C_s}{p} + \frac{(1-p)}{p} \cdot C_f = \frac{C_s + (1-p) \cdot k \cdot C_s}{p} = \frac{C_s(1 + (1-p)k)}{p}$$

Wait, more precisely. Each attempt succeeds with probability $p$ (cost $C_s$) or fails with probability $1-p$ (cost $C_f = kC_s$). The expected number of attempts until first success is $1/p$, with $(1-p)/p$ failures before the success. So:

$$\text{E}[C_{\text{total}}] = C_s + \frac{1-p}{p} \cdot k \cdot C_s = C_s \left(1 + \frac{(1-p)k}{p}\right) = \frac{C_s(p + (1-p)k)}{p}$$

**Numerical examples:**

For $p = 0.50$ (moderate difficulty), $k = 5$ (median snowball factor):

$$\text{E}[C_{\text{total}}] = C_s \cdot \frac{0.5 + 0.5 \times 5}{0.5} = C_s \cdot 6.0$$

For $p = 0.27$ (SWE-bench Lite resolve rate with Claude 3.5 Sonnet), $k = 5$:

$$\text{E}[C_{\text{total}}] = C_s \cdot \frac{0.27 + 0.73 \times 5}{0.27} = C_s \cdot \frac{3.92}{0.27} = 14.5 \cdot C_s$$

The token snowball effect means that low-quality systems (low $p$) have disproportionately high costs, because most of their token budget is consumed by failed attempts that are individually more expensive than successes.

**VIH-adjusted cost with snowball:**

$$C_{\text{per-VIH}} = \frac{\text{E}[C_{\text{total}}]}{\text{VIH}} = \frac{C_s(p + (1-p)k)}{p \cdot S \cdot Q}$$

Since $Q \approx p$ (quality is roughly the success probability):

$$C_{\text{per-VIH}} = \frac{C_s(p + (1-p)k)}{p^2 \cdot S}$$

This is convex in $p$ for $k > 1$, meaning there are increasing returns to quality improvement: each percentage point increase in $p$ saves disproportionately more on total cost.

**The "quality premium" [C]:** Investing in higher-quality (more expensive per token) models can reduce total cost by reducing the snowball effect. The break-even condition for a model that costs $\phi$ times as much per token but has success rate $p'$ vs. baseline $p$ is:

$$\phi \cdot C_s \cdot \frac{p' + (1-p')k}{p'} \leq C_s \cdot \frac{p + (1-p)k}{p}$$

$$\phi \leq \frac{p'}{p} \cdot \frac{p + (1-p)k}{p' + (1-p')k}$$

For $p = 0.27$, $p' = 0.40$ (Opus 4.5's higher resolve rate), $k = 5$:

$$\phi \leq \frac{0.40}{0.27} \cdot \frac{0.27 + 0.73 \times 5}{0.40 + 0.60 \times 5} = 1.48 \times \frac{3.92}{3.40} = 1.48 \times 1.153 = 1.71$$

The more expensive model can cost up to 1.71x per token and still be cheaper overall, thanks to the snowball reduction.

---

## 5. Verification Approach for the Theory

### 5.1 Prediction 1: VIH Is Maximized at Intermediate Speed [S]

**Theoretical prediction:** VIH = S * Q has an interior maximum at $S^* = 1/\beta$ under the exponential quality decay model. Pushing throughput beyond $S^*$ decreases VIH despite increasing raw speed.

**Experimental setup:**

1. Select a benchmark suite (SWE-bench Lite, 300 problems) as the workload.
2. Configure the same agent (e.g., OpenHands + Claude Sonnet) at 5 different speed settings by varying:
   - Maximum iterations allowed per problem (1, 3, 5, 10, 20)
   - Time budget per problem (1 min, 3 min, 5 min, 10 min, 30 min)
   - Verification depth (none, lint-only, lint+typecheck, full test suite)
3. For each setting, record: wall-clock time, iterations completed, iterations passing verification, tokens consumed.
4. Compute $(S, Q, \text{VIH})$ for each setting. Plot the Pareto frontier.

**Measurements:**
- $S_i$: iterations per hour for setting $i$
- $Q_i$: verification pass rate for setting $i$
- $\text{VIH}_i = S_i \cdot Q_i$

**Success criteria:**
- The plot of VIH vs. $S$ is non-monotonic (rises then falls), with p < 0.05 for the quadratic term in a polynomial regression $\text{VIH} = a + bS + cS^2$.
- The VIH-maximizing speed $S^*$ is strictly less than $S_{\max}$ (the fastest setting).
- The frontier exhibits the three-regime shape predicted in Section 1.2.

**Alternative outcomes and interpretations:**
- If VIH is monotonically increasing in $S$, then quality does not degrade fast enough with speed to offset throughput gains. This would mean "go as fast as possible" is optimal, invalidating the interior-maximum prediction.
- If VIH is monotonically decreasing in $S$, then quality degrades faster than speed increases. This would mean verification-heavy approaches dominate, and the Pareto frontier is trivially convex.

### 5.2 Prediction 2: Speculative Pipelining Threshold [S]

**Theoretical prediction:** Speculative pipelining (overlapping planning with execution) has positive expected value when the speculation accuracy $p$ satisfies:

$$p > \frac{R}{B + R} = \frac{T_{\text{exec}}}{T_{\text{plan}} + T_{\text{exec}}} \cdot \frac{1}{1 + B/R}$$

From the speculation ratio test (R4, Section 1.3), speculation is EV-positive when $p/q > R/B$, i.e.:

$$p > \frac{R}{R + B}$$

With $R = \text{E}[T_{\text{exec}}] = 12.5$ min (the rollback penalty, since failed speculation requires restarting execution) and $B = \text{E}[\min(T_{\text{plan}}, T_{\text{exec}})] \approx 5.0$ min (the parallelism benefit):

$$p_{\text{threshold}} = \frac{12.5}{12.5 + 5.0} = 0.714$$

**Experimental setup:**

1. Run 100 GSD cycles on a real project with the speculative planning-execution overlap enabled.
2. Record, for each cycle: whether the initial plan was unchanged after full planning completed ("speculation hit"), and the wall-clock time for the cycle.
3. Compute the empirical speculation accuracy $\hat{p}$.

**Measurements:**
- Speculation hit rate: $\hat{p} = \text{count(plan unchanged)} / \text{total cycles}$
- Time saving per hit: $\Delta t_{\text{hit}} = T_{\text{seq}} - T_{\text{spec}}$ for cycles where speculation hit
- Time penalty per miss: $\Delta t_{\text{miss}} = T_{\text{spec}} - T_{\text{seq}}$ for cycles where speculation missed
- Net EV: $\text{E}[\Delta t] = \hat{p} \cdot \Delta t_{\text{hit}} - (1-\hat{p}) \cdot \Delta t_{\text{miss}}$

**Success criteria:**
- $\hat{p} > 0.714$ (above the threshold), and $\text{E}[\Delta t] > 0$ (positive expected saving).
- The 95% confidence interval for $\text{E}[\Delta t]$ excludes zero.

**Sensitivity analysis:** Repeat with different task types (bug fixes vs. feature additions vs. refactoring) to test whether the threshold varies by domain, as the DualSpec paper (arXiv:2603.07416) suggests.

### 5.3 Prediction 3: Optimal Cache Refresh Follows the Square Root Formula [E + S]

**Theoretical prediction:** The optimal deterministic cache refresh interval follows:

$$k^* \approx \sqrt{\frac{2R}{\lambda \cdot \delta \cdot W}}$$

where $R$ is the full re-read cost, $\lambda$ is the codebase change rate, $\delta$ is the probability that a stale cache leads to an incorrect action, and $W$ is the rework cost.

This has the same structure as the Economic Order Quantity (EOQ) formula, with $R$ as the fixed ordering cost and $\lambda \delta W$ as the holding cost rate.

**Experimental setup:**

1. Instrument a production agent (Claude Code or GSD) to log:
   - Cache refresh events (when a full re-read occurs)
   - Codebase changes between refreshes (files modified, lines changed)
   - Errors attributable to stale context (agent acted on outdated file contents)
2. Run over 500 sessions (approximately 2 weeks of team usage).
3. Vary the refresh interval systematically: fixed intervals of $k = 5, 10, 20, 50, 100$ interactions.

**Measurements:**
- For each $k$: error rate from staleness, total cost (re-read cost + rework cost), throughput.
- Estimate $\lambda$ from the observed codebase change rate.
- Estimate $\delta$ from the conditional error rate given a stale cache.
- Estimate $W$ from the average rework time when a staleness error occurs.

**Success criteria:**
- The empirically optimal $k^*_{\text{obs}}$ (the interval minimizing total cost) is within a factor of 2 of the predicted $k^*_{\text{theory}} = \sqrt{2R/(\lambda \delta W)}$.
- The cost-vs-interval curve has the predicted U-shape (too frequent refreshes waste time; too infrequent refreshes waste rework).
- $R^2 > 0.7$ for the regression of observed optimal interval on $\sqrt{R/(\lambda \delta W)}$ across different projects (varying $\lambda$).

### 5.4 Prediction 4: Mode Misclassification Cost Asymmetry [S]

**Theoretical prediction:** The cost of Type II errors (using Fast mode when Governed mode is needed) dominates the cost of Type I errors (using Governed mode when Fast mode would suffice). Specifically:

$$c_{FG} / c_{GF} \gg 1$$

where $c_{FG}$ is the cost of choosing Fast when Governed is optimal (missed quality failures, rework, architectural violations) and $c_{GF}$ is the cost of choosing Governed when Fast is optimal (wasted governance overhead).

The Bayesian optimal decision threshold is:

$$\tau = \frac{c_{GF}}{c_{FG} + c_{GF}}$$

For $c_{FG}/c_{GF} = 10$: $\tau = 1/11 \approx 0.091$. This means the harness should choose Governed mode whenever the probability of needing it exceeds 9.1%.

**Experimental setup:**

1. Annotate 200 completed tasks with ground-truth optimal mode (determined retrospectively by expert review):
   - Fast: task was simple, correct on first attempt, no architectural impact
   - Governed: task required multiple revisions, had architectural impact, or introduced a defect caught later
2. For each task, record the mode that was actually used and the outcome:
   - Correct mode: task completed successfully at appropriate cost
   - Type I (Governed when Fast optimal): task completed successfully but with excess overhead
   - Type II (Fast when Governed optimal): task completed but with defects, rework, or architectural violations discovered later
3. Measure costs: overhead time for Type I, rework time + defect cost for Type II.

**Measurements:**
- $c_{GF}$: mean excess time for Type I errors (minutes)
- $c_{FG}$: mean total cost for Type II errors (rework time + downstream defect remediation, in minutes)
- The ratio $c_{FG}/c_{GF}$

**Success criteria:**
- $c_{FG}/c_{GF} > 5$ (the asymmetry is at least 5x), confirming the Bayesian threshold should be well below 0.50.
- A mode selector trained with cost-sensitive classification (using the observed cost matrix) outperforms a mode selector trained with symmetric classification (0-1 loss), measured by total cost on a held-out set.
- The cost-sensitive mode selector assigns Governed mode approximately $1 - \tau$ of the time for ambiguous tasks, consistent with the theoretical threshold.

### 5.5 Cross-Cutting Validation: End-to-End VIH Improvement [S + C]

**Theoretical prediction:** The combined effect of Predictions 1-4, implemented as an integrated temporal architecture, yields a VIH improvement of 1.5-2.0x over the sequential baseline (from Section 2.4's calibration: 1.51x from time savings alone, with additional gains from cost-sensitive mode selection).

**Experimental setup:**

1. Deploy two harness configurations on the same team for 4 weeks (A/B test):
   - Control: sequential GSD pipeline (56.8 min average cycle)
   - Treatment: optimized temporal architecture (speculative pipelining + tiered verification + async governance + cost-sensitive mode selection)
2. Both configurations work on the same task backlog (randomly assigned).

**Measurements:**
- VIH for each configuration (primary metric)
- Defect escape rate (defects discovered post-merge per iteration)
- Developer satisfaction (survey)
- Total token cost per verified iteration

**Success criteria:**
- Treatment VIH is 1.3x or higher than Control VIH (conservative threshold; the model predicts 1.51x).
- Treatment defect escape rate is not statistically higher than Control (one-sided test, p < 0.05).
- Treatment cost per verified iteration is lower than Control.

### 5.6 Falsification Conditions

The theory makes several falsifiable claims. If any of the following are observed, the corresponding model component must be revised:

| Observation | Falsified Component |
|-------------|-------------------|
| VIH monotonically increases with speed across all settings | Interior maximum (Section 1.4); the quality decay rate $\beta$ is overestimated |
| Speculative pipelining has negative EV even with $p > 0.80$ | Speculation model (Section 2.3); rollback costs are underestimated or there are hidden costs (state pollution, debugging difficulty per R3 contrarian) |
| Optimal cache refresh does not follow $\sqrt{}$ scaling | EOQ analogy breaks down; change process is not Poisson, or staleness cost is nonlinear |
| $c_{FG}/c_{GF} < 2$ (near-symmetric costs) | Mode selection asymmetry (Section 5.4); governed mode overhead is higher than estimated, or fast mode failures are less costly than expected |
| Combined treatment shows no VIH improvement | Interactions between strategies are negative (e.g., speculation + tiered verification creates compounding error modes) |

---

## 6. Notation Summary

| Symbol | Meaning |
|--------|---------|
| $S$ | Speed (iterations per hour) |
| $Q$ | Quality (verification pass rate) |
| $\text{VIH}$ | Verified Iterations per Hour ($= S \cdot Q$) |
| $\mathcal{F}$ | Pareto frontier (set of non-dominated configurations) |
| $\hat{F}$ | Effective frontier (convex hull of $\mathcal{F}$) |
| $f(S)$ | Quality as a function of speed on the frontier |
| $\text{MRS}$ | Marginal rate of substitution ($= -f'(S)$) |
| $\varepsilon_{Q,S}$ | Elasticity of quality w.r.t. speed |
| $\beta$ | Quality decay rate in exponential model |
| $T_i$ | Duration of pipeline stage $i$ |
| $\mu, \sigma$ | Log-normal parameters for stage durations |
| $\text{CV}$ | Coefficient of variation |
| $h$ | Cache hit rate |
| $\delta$ | Change fraction (tokens changed / total tokens) |
| $p_{\text{input}}, p_{\text{output}}, p_{\text{cache}}$ | Token prices |
| $R_{io}$ | Input-to-output token ratio |
| $C$ | Cost per iteration |
| $C_{\text{verified}}$ | Cost per verified iteration |
| $\alpha$ (Sec 1) | Mixing fraction between configurations |
| $\alpha$ (Sec 4) | Learning/verification rate in saturation model |
| $n$ | Number of iterations or agents |
| $n^*$ | VIH-optimal iteration/agent count |
| $k$ | Token snowball factor ($C_{\text{fail}} / C_{\text{success}}$) |
| $p$ | Success probability per attempt |
| $\lambda$ | Codebase change rate (changes per unit time) |
| $R$ | Full re-read cost (tokens or time) |
| $W$ | Rework cost from stale cache |
| $c_{FG}, c_{GF}$ | Misclassification costs (Fast-when-Governed, Governed-when-Fast) |
| $\tau$ | Bayesian decision threshold |
| $\gamma$ | Quality drift decay constant |
| $t^*$ | Optimal context reset interval |

---

## 7. Key Quantitative Predictions (Summary Table)

| Prediction | Formula | Calibrated Value | Confidence |
|-----------|---------|-----------------|------------|
| VIH-optimal speed | $S^* = 1/\beta$ | Interior to observed range | [C] |
| Sequential makespan | $\text{E}[T_{\text{seq}}]$ | 56.8 min | [S] |
| Speculative makespan | $\text{E}[T_{\text{spec}}]$ | 47.8 min (16% faster) | [S] |
| Combined optimization makespan | $\text{E}[T_{\text{opt}}]$ | 37.5 min (34% faster) | [C] |
| Speculation accuracy threshold | $p > R/(R+B)$ | $p > 0.714$ | [S] |
| Cache refresh interval | $k^* \approx \sqrt{2R/(\lambda\delta W)}$ | ~105 interactions | [S] |
| Maximum cost saving from caching | $0.857h$ | 78.9% at $h=0.92$ | [E] |
| VIH-optimal agent count | Marginal VIH condition | $k^* = 4$ agents | [S] |
| Quality premium break-even | $\phi \leq (p'/p) \cdot (p+(1-p)k)/(p'+(1-p')k)$ | 1.71x for $p: 0.27 \to 0.40$ | [S] |
| Persistent state VIH threshold | $\Delta Q < T_{\text{saved}}/T_{\text{total}}$ | Quality penalty must be < 12.3% | [S] |
| Mode selection threshold | $\tau = c_{GF}/(c_{FG}+c_{GF})$ | $\tau \approx 0.091$ for 10x asymmetry | [E] |
| Optimal context reset | $t^* = 1/\gamma$ | ~105 interactions (~2-3 cycles) | [C] |

---

## Sources

- Ehrgott, M. (2005). *Multicriteria Optimization*. Springer.
- Elkan, C. (2001). "The Foundations of Cost-Sensitive Learning." IJCAI.
- Putta et al. (2025). "Speculative Actions for Agentic AI Systems." arXiv:2510.04371.
- Ji et al. (2026). "DualSpec: Heterogeneous Speculation for Research Agents." arXiv:2603.07416.
- Bian et al. (2025). "What Limits Agentic Systems Efficiency?" arXiv:2510.16276.
- Liang et al. (2026). "Don't Break the Cache." arXiv:2601.06007.
- Zhang et al. (2025). "Agentic Plan Caching." arXiv:2506.14852 (NeurIPS 2025).
- Suzgun & Kalai (2024). "Meta-Prompting." arXiv:2401.12954.
- Chroma Research (2025). "Context Rot."
- Agent Drift study (2025). arXiv:2601.04170.
- SWE-Effi benchmark (2025). arXiv:2509.09853.
- Manus AI (2025). "Context Engineering for AI Agents."
- Anthropic (2026). "Effective Context Engineering for AI Agents."
- Anthropic (2026). "2026 Agentic Coding Trends Report."
- Google DORA (2025). "Accelerate State of DevOps Report."
- Karlin, M. et al. (1994). Competitive analysis of ski rental (randomized algorithms).
- Cognition (2025). "Devin Annual Performance Review."
