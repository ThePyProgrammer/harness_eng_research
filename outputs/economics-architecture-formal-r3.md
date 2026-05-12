# Economics Architecture for AI Coding Agent Harnesses: Jevons Paradox, CVIH Metric, and Empirical Calibration

**Formalization Round 3**
**Date:** 2026-04-03

---

## Preamble

This document provides rigorous formal treatment of three pillars of the economics architecture: (1) the Jevons paradox formalized for LLM token economics, (2) the Cost-adjusted Verified Iterations per Hour (CVIH) metric and its optimization properties, and (3) the empirical calibration framework connecting theoretical results to measurable production data. It builds on the research data from R1-R5, the optimization foundations from R4's submodular and concave programming results, and the queueing-theoretic cost models from R3.

**Epistemic categories:**
- **[E]** Established theory applied without modification
- **[S]** Novel synthesis of known results in the harness setting
- **[C]** Conjectured claims motivated by empirical data but lacking formal proof

**Notation conventions.** All expressions are LaTeX-ready. We write $p(t)$ for the price per token at time $t$, $D(p)$ for token demand as a function of price, $\epsilon$ for price elasticity of demand, $\lambda_{\text{raw}}$ for raw iterations per hour, $p_{\text{verify}}$ for verification pass rate, and $C_{\text{total}}$ for total hourly cost. Other variables are defined at first use.

---

## 1. The Jevons Paradox for Token Economics

### 1.1 Background and Motivation [E]

William Stanley Jevons (1865, *The Coal Question*) observed that improvements in the efficiency of coal use led not to reduced coal consumption but to its massive increase, because efficiency made new applications economically viable. The Khazzoom-Brookes postulate (Saunders, 1992) generalized this under neoclassical growth assumptions: energy efficiency gains increase total energy consumption through direct rebound effects, income effects, and macroeconomic multiplier effects. Sorrell (2009, *Energy Policy* 37(4): 1456-1469) surveyed the empirical evidence and concluded that economy-wide rebound effects are "larger than is conventionally assumed."

The relevance to LLM token economics is now empirically confirmed: token prices fell 99.7% between 2023 and 2026 while enterprise AI spending tripled (NavyaAI, 2026; IDC, 2025). DeepSeek R1's release in January 2025 is the canonical case; Microsoft CEO Satya Nadella declared "Jevons paradox strikes again!" within days of the announcement.

This section formalizes the conditions under which the paradox holds and calibrates the demand elasticity from observed data.

### 1.2 Formal Setup [E + S]

**Definition 1.1** (Token Market). A *token market* is a tuple $(p, D, S)$ where:
- $p: [0, T] \to \mathbb{R}_{>0}$ is the price per token as a function of time, assumed continuously differentiable with $p'(t) < 0$ (prices are falling)
- $D: \mathbb{R}_{>0} \to \mathbb{R}_{>0}$ is the demand function, giving tokens consumed per period as a function of price, with $D'(p) < 0$ (demand decreases as price increases)
- $S(t) = p(t) \cdot D(p(t))$ is the total spend per period

**Definition 1.2** (Price Elasticity of Demand). The *price elasticity of demand* is:

$$\epsilon(p) = -\frac{dD}{dp} \cdot \frac{p}{D(p)}$$

By convention, $\epsilon > 0$ since $dD/dp < 0$. Demand is *elastic* when $\epsilon > 1$, *unit elastic* when $\epsilon = 1$, and *inelastic* when $\epsilon < 1$.

### 1.3 The Jevons Condition [E]

**Theorem 1.1** (Jevons Paradox Condition). *Total spend $S(t)$ increases over time (i.e., $dS/dt > 0$) despite falling prices ($dp/dt < 0$) if and only if the price elasticity of demand exceeds unity: $\epsilon > 1$.*

*Proof.* Compute the time derivative of total spend:

$$\frac{dS}{dt} = \frac{d}{dt}\left[p(t) \cdot D(p(t))\right] = p'(t) \cdot D(p(t)) + p(t) \cdot D'(p(t)) \cdot p'(t)$$

$$= p'(t) \left[D(p(t)) + p(t) \cdot D'(p(t))\right]$$

Since $p'(t) < 0$, the sign of $dS/dt$ is opposite to the sign of the bracketed term. We need $dS/dt > 0$, so we need:

$$D(p) + p \cdot D'(p) < 0$$

Dividing both sides by $D(p) > 0$:

$$1 + \frac{p \cdot D'(p)}{D(p)} < 0$$

$$1 - \epsilon < 0$$

$$\epsilon > 1 \qquad \square$$

**Remark 1.1.** The condition $\epsilon > 1$ is necessary and sufficient. When $\epsilon = 1$, total spend is constant regardless of price (the demand increase exactly offsets the price decrease). When $\epsilon < 1$, total spend falls as prices fall. The Jevons paradox is precisely the regime $\epsilon > 1$.

### 1.4 Empirical Calibration of Elasticity [S]

**Proposition 1.2** (Elasticity Estimation from Aggregate Data). *Given observed price ratio $p_1/p_0$, spending ratio $S_1/S_0$, and the constant-elasticity demand model $D(p) = A \cdot p^{-\epsilon}$, the elasticity is:*

$$\epsilon = 1 + \frac{\log(S_1/S_0)}{\log(p_0/p_1)}$$

*Proof.* Under the constant-elasticity (isoelastic) demand model $D(p) = A \cdot p^{-\epsilon}$:

$$S = p \cdot D(p) = A \cdot p^{1 - \epsilon}$$

Taking the ratio:

$$\frac{S_1}{S_0} = \left(\frac{p_1}{p_0}\right)^{1 - \epsilon}$$

Taking logarithms:

$$\log\left(\frac{S_1}{S_0}\right) = (1 - \epsilon) \cdot \log\left(\frac{p_1}{p_0}\right)$$

Since $p_1 < p_0$, we have $\log(p_1/p_0) < 0$, so:

$$1 - \epsilon = \frac{\log(S_1/S_0)}{\log(p_1/p_0)} = -\frac{\log(S_1/S_0)}{\log(p_0/p_1)}$$

$$\epsilon = 1 + \frac{\log(S_1/S_0)}{\log(p_0/p_1)} \qquad \square$$

**Application.** Using the empirical data (R5):
- Price ratio: $p_0/p_1 \approx 300$ (GPT-4 at \$30/MTok in March 2023 to Flash-Lite at \$0.10/MTok in March 2026)
- Spending ratio: $S_1/S_0 \approx 3$ (enterprise AI spending tripled from \$11.5B to \$37B)

$$\epsilon = 1 + \frac{\log(3)}{\log(300)} = 1 + \frac{1.099}{5.704} \approx 1.19$$

**Interpretation.** The estimated aggregate elasticity $\epsilon \approx 1.19$ is modestly above unity, consistent with the Jevons paradox. Every 1% decrease in token price generates approximately 1.19% increase in token consumption, yielding approximately 0.19% increase in total spending.

**Remark 1.2** (Sensitivity). The elasticity estimate is sensitive to the choice of price index and spending measure. Using frontier-only prices ($p_0/p_1 \approx 12$, from \$30 to \$2.50):

$$\epsilon_{\text{frontier}} = 1 + \frac{\log(3)}{\log(12)} = 1 + \frac{1.099}{2.485} \approx 1.44$$

The higher elasticity for frontier models reflects that organizations using frontier models are more price-sensitive (they would adopt cheaper models if available), while the commodity price index reflects a broader market including new entrants.

### 1.5 The Demand Decomposition: Intensive and Extensive Margins [S]

**Definition 1.3** (Margin Decomposition). Decompose total demand into two components:

$$D(p) = n(p) \cdot d(p)$$

where:
- $n(p)$ is the *extensive margin*: the number of distinct tasks attempted using LLM tokens
- $d(p)$ is the *intensive margin*: the average number of tokens consumed per task

**Proposition 1.3** (Aggregate Elasticity Decomposition). *The aggregate elasticity decomposes additively:*

$$\epsilon = \epsilon_n + \epsilon_d$$

*where $\epsilon_n = -(dn/dp)(p/n)$ is the extensive-margin elasticity and $\epsilon_d = -(dd/dp)(p/d)$ is the intensive-margin elasticity.*

*Proof.* By the product rule:

$$\frac{dD}{dp} = n'(p) \cdot d(p) + n(p) \cdot d'(p)$$

Multiplying by $-p/D = -p/(n \cdot d)$:

$$\epsilon = -\frac{n'(p) \cdot d(p)}{n(p) \cdot d(p)} \cdot p - \frac{n(p) \cdot d'(p)}{n(p) \cdot d(p)} \cdot p = -\frac{n'(p)}{n(p)} \cdot p - \frac{d'(p)}{d(p)} \cdot p = \epsilon_n + \epsilon_d \qquad \square$$

**Empirical Hypothesis [C].** The extensive margin dominates the aggregate elasticity: $\epsilon_n \gg \epsilon_d$. The reasoning:

1. *Intensive margin is approximately inelastic ($\epsilon_d \approx 0$).* The number of tokens per task is primarily determined by task complexity, not token price. A code refactoring task requires roughly the same amount of context and reasoning regardless of whether the model costs \$30/MTok or \$0.10/MTok.

2. *Extensive margin is elastic ($\epsilon_n > 1$).* Each price threshold unlocks qualitatively new use cases. At \$30/MTok, only premium single-query workflows are economical. At \$0.10/MTok, always-on multi-agent systems become rational. The NavyaAI (2026) data documents this threshold structure explicitly (see R5, Section 1.3).

3. *Agentic amplification.* Agentic workflows consume 50-500x more tokens per "task" than single queries (AICosts.ai, 2026), but this amplification is itself a consequence of the extensive margin: agentic workflows are new task categories that became viable only at lower price points.

**Implication for Harness Design.** Since the extensive margin dominates, falling prices do not merely make existing workflows cheaper; they create demand for qualitatively new (and more resource-intensive) workflows. Cost optimization infrastructure is therefore not made obsolete by falling prices; it becomes more necessary, because the usage expansion outpaces the price reduction. This is the formal basis for the "Jevons Awareness" design principle.

### 1.6 The Rebound Rate [S]

**Definition 1.4** (Rebound Rate). Given a price decrease from $p_0$ to $p_1$, the *rebound rate* $R$ measures how much of the theoretical cost savings is consumed by increased demand:

$$R = 1 - \frac{S_1}{S_0 \cdot (p_1/p_0)^0} = 1 - \frac{S_1}{S_0}$$

Wait, this standard definition needs care. The *engineering rebound rate* (Sorrell, 2009) is defined as:

$$R = \frac{\text{Actual consumption} - \text{Expected consumption at old demand}}{\text{Expected consumption at old demand}}$$

For token economics, if demand had remained at $D(p_0)$, the new spend would be $p_1 \cdot D(p_0)$. The actual spend is $p_1 \cdot D(p_1)$. The rebound is:

$$R = \frac{D(p_1) - D(p_0)}{D(p_0)} \bigg/ \frac{p_0 - p_1}{p_0}$$

Under the isoelastic model with $p_1/p_0 = 1/300$ and $\epsilon = 1.19$:

$$\frac{D(p_1)}{D(p_0)} = \left(\frac{p_0}{p_1}\right)^{\epsilon} = 300^{1.19} \approx 300 \cdot 300^{0.19} \approx 300 \cdot 4.07 \approx 1221$$

So demand increases by a factor of approximately 1221 (from a 300x price decrease), while "efficient" demand at constant consumption would remain flat. The rebound rate is approximately $(1221 - 1) / (1 - 1/300) \approx 1222$, far exceeding 100% (full "backfire" in the energy economics terminology). This is consistent with the empirical observation that total spend tripled despite a 300x unit cost reduction.

**Theorem 1.4** (Backfire Condition). *Under isoelastic demand, the Jevons paradox produces "backfire" (rebound rate > 100%, meaning total consumption increases more than proportionally to the efficiency gain) if and only if $\epsilon > 1$. The rebound rate under isoelastic demand and a price reduction factor $\phi = p_0/p_1 > 1$ is:*

$$R = \frac{\phi^{\epsilon} - 1}{\phi - 1} \cdot \frac{1}{\phi}$$

*When $\epsilon > 1$ and $\phi$ is large, $R \approx \phi^{\epsilon - 1} / \phi \to \infty$.*

*Proof sketch.* Direct substitution of $D(p_1)/D(p_0) = \phi^{\epsilon}$ into the rebound formula and algebraic simplification. The divergence follows because $\phi^{\epsilon - 1} \to \infty$ when $\epsilon > 1$ and $\phi \to \infty$. $\square$

---

## 2. The Demand Elasticity Model: Two Economic Regimes

### 2.1 The Interactive-Autonomous Decomposition [S]

**[Building on: R3 (queueing economics), R5 (contrarian position 3)]**

A critical structural feature of the token market is that it comprises two qualitatively distinct demand regimes.

**Definition 2.1** (Regime Classification). A token-consuming task operates in one of two regimes:
- **Interactive regime ($\mathcal{R}_I$):** A developer is blocked waiting for the agent's output. The cost function includes both token cost and developer idle time.
- **Autonomous regime ($\mathcal{R}_A$):** No developer is waiting. Token cost is the sole marginal cost.

**Definition 2.2** (Regime-Specific Cost Functions). The total cost per task in each regime is:

$$C_I(m) = c_{\text{token}}(m) + c_w \cdot W(m) + c_{\text{switch}} \cdot P_{\text{switch}}(W(m)) \cdot T_{\text{recovery}}$$

$$C_A(m) = c_{\text{token}}(m)$$

where:
- $m$ is the model selection
- $c_{\text{token}}(m)$ is the token cost for model $m$ on the task
- $c_w$ is the developer's hourly rate (typically \$80-\$200/hr fully loaded)
- $W(m)$ is the expected wait time under model $m$
- $P_{\text{switch}}(W)$ is the probability of a context switch given wait time $W$ (approximately 0 for $W < 30s$, approximately 1 for $W > 300s$)
- $T_{\text{recovery}} \approx 23$ minutes (Mark, Gudith, and Klocke, 2008)

**Proposition 2.1** (Regime-Optimal Model Selection). *In the interactive regime, the cost-minimizing model satisfies:*

$$m_I^* = \arg\min_m \left[c_{\text{token}}(m) + c_w \cdot W(m)\right]$$

*In the autonomous regime:*

$$m_A^* = \arg\min_m \left[\frac{c_{\text{token}}(m)}{p_{\text{correct}}(m)}\right]$$

*where $p_{\text{correct}}(m)$ is the probability of producing a correct result on the first attempt with model $m$.*

*Proof sketch.* For $\mathcal{R}_I$, the result follows from minimizing $C_I$ with respect to $m$, noting that $c_w \gg c_{\text{token}}/W$ for most model choices (R3, Section 4.2 showed that even at \$10/hr, expensive models are NPV-positive when review costs are included). For $\mathcal{R}_A$, the effective cost per correct result is $c_{\text{token}}(m) / p_{\text{correct}}(m)$, and no waiting cost enters. $\square$

**Corollary 2.2** (The Dual-Regime Principle). *Generically, $m_I^* \neq m_A^*$. The interactive-optimal model is typically a frontier model (high capability, fast response, expensive tokens), while the autonomous-optimal model is typically a budget model (lower capability, possibly slower, cheap tokens). A harness using a single model for both regimes is cost-suboptimal.*

### 2.2 Elasticity by Regime [S]

The aggregate elasticity $\epsilon \approx 1.19$ decomposes by regime:

$$D_{\text{total}}(p) = D_I(p) + D_A(p)$$

$$\epsilon = \frac{D_I}{D_{\text{total}}} \cdot \epsilon_I + \frac{D_A}{D_{\text{total}}} \cdot \epsilon_A$$

**Empirical Hypothesis [C].** $\epsilon_I < 1$ (inelastic) and $\epsilon_A > 1$ (elastic). The reasoning:

- Interactive demand is driven by developer behavior patterns (number of prompts per hour, context per prompt). These are relatively insensitive to token price because the developer's time cost dominates.
- Autonomous demand is the primary channel for the extensive margin: new CI/CD automations, batch processing pipelines, and multi-agent architectures that become viable as prices fall.

As the autonomous share of total demand grows (which it does as prices fall, since $\epsilon_A > 1$ and $\epsilon_I < 1$), the aggregate elasticity increases, accelerating the Jevons effect. This creates a positive feedback loop: falling prices shift demand toward autonomous use, which has higher elasticity, which increases total spend, which funds further infrastructure investment, which drives prices lower.

---

## 3. Cost-Adjusted Verified Iterations per Hour (CVIH)

### 3.1 Definitions [S]

**[Building on: Temporal Architecture (R2, Section 1.4); Pillar 7 specification]**

**Definition 3.1** (Raw Iteration Rate). The *raw iteration rate* $\lambda_{\text{raw}}$ is the number of completed agent iterations per hour, regardless of outcome quality:

$$\lambda_{\text{raw}} = \frac{N_{\text{total}}}{T_{\text{wall}}}$$

This is the speed metric from the Temporal pillar (Definition 1.1 in Temporal Formal R2).

**Definition 3.2** (Verification Pass Rate). The *verification pass rate* $p_{\text{verify}}$ is the probability that a completed iteration passes all verification checks:

$$p_{\text{verify}} = P(\text{iteration passes} \mid \text{iteration completed})$$

This is the quality metric from the Temporal pillar (Definition 1.2).

**Definition 3.3** (Verified Iteration Rate). The *verified iteration rate* (VIH) is:

$$\text{VIH} = \lambda_{\text{raw}} \cdot p_{\text{verify}}$$

*Units: verified iterations per hour.* This is the product-form metric introduced in Temporal Architecture R2.

**Definition 3.4** (Total Hourly Cost). The *total hourly cost* $C_{\text{total}}$ includes all operational costs of running the harness:

$$C_{\text{total}} = C_{\text{token}} + C_{\text{infra}} + C_{\text{dev}}$$

where:
- $C_{\text{token}}$: token costs per hour (sum of input/output token costs across all API calls)
- $C_{\text{infra}}$: infrastructure costs per hour (compute, storage, networking, not including API costs)
- $C_{\text{dev}}$: developer costs per hour (nonzero only in interactive regime)

In autonomous mode, $C_{\text{dev}} = 0$ and $C_{\text{total}} = C_{\text{token}} + C_{\text{infra}}$.

**Definition 3.5** (Cost-Adjusted Verified Iterations per Hour). The *CVIH metric* is:

$$\text{CVIH} = \frac{\text{VIH}}{C_{\text{total}}} = \frac{\lambda_{\text{raw}} \cdot p_{\text{verify}}}{C_{\text{total}}}$$

*Units: verified iterations per dollar-hour.* CVIH measures the rate of producing verified work per unit of cost. Maximizing CVIH means maximizing the efficiency of converting dollars into verified outputs.

### 3.2 Relationship to the Cost-Quality Pareto Frontier [S]

**[Building on: R4 (Pareto frontier analysis); Temporal Formal R2 (Section 1)]**

Recall that the cost-quality Pareto frontier (R4, Section 5) is defined by:

$$Q^*(B) = \max_{\{r_k\}} \prod_{k=1}^{K} q_k(r_k) \quad \text{subject to} \quad \sum_{k=1}^{K} p_k \cdot r_k \leq B$$

The CVIH metric operates on a different Pareto frontier: the VIH-Cost frontier.

**Definition 3.6** (VIH-Cost Frontier). Define the *VIH-cost frontier* as the function:

$$V^*(C) = \max_{\text{config}} \;\text{VIH}(\text{config}) \quad \text{subject to} \quad C_{\text{total}}(\text{config}) \leq C$$

where the maximization is over all harness configurations (model selection, parallelism, caching strategy, verification depth).

**Proposition 3.1** (Concavity of VIH-Cost Frontier). *Under standard assumptions (concave quality functions, diminishing returns to additional compute), $V^*(C)$ is a concave function of $C$.*

*Proof sketch.* Let $C_1 < C_2$ be two budget levels with optimal configurations achieving $V^*(C_1)$ and $V^*(C_2)$. For $\alpha \in [0,1]$, consider the budget $C_\alpha = \alpha C_1 + (1-\alpha) C_2$. The convex combination of the two optimal configurations is feasible at budget $C_\alpha$ (costs are additive). By concavity of the constituent quality and throughput functions:

$$V^*(C_\alpha) \geq \alpha V^*(C_1) + (1-\alpha) V^*(C_2)$$

This is the definition of concavity. $\square$

**Theorem 3.2** (CVIH Maximization on the Frontier). *The CVIH is maximized at the unique point $C^*$ on the VIH-cost frontier where the ray from the origin is tangent to the frontier. Formally:*

$$C^* = \arg\max_C \frac{V^*(C)}{C}$$

*At this point, the marginal VIH per dollar equals the average VIH per dollar:*

$$\frac{dV^*}{dC}\bigg|_{C^*} = \frac{V^*(C^*)}{C^*}$$

*Proof.* Define $\text{CVIH}(C) = V^*(C) / C$. Taking the derivative and setting it to zero:

$$\frac{d}{dC}\left[\frac{V^*(C)}{C}\right] = \frac{C \cdot (dV^*/dC) - V^*(C)}{C^2} = 0$$

$$\Rightarrow \frac{dV^*}{dC} = \frac{V^*(C)}{C}$$

That is, the slope of the frontier equals the slope of the ray from the origin to the point $(C, V^*(C))$. Geometrically, this is the tangent point of a ray from the origin to the concave frontier curve. Uniqueness follows from the strict concavity of $V^*$ (which holds under strict concavity of the constituent functions).

To verify this is a maximum (not a minimum), note that for small $C$, $V^*(C) / C$ is increasing (the frontier rises steeply from the origin), and for large $C$, $V^*(C) / C$ is decreasing (the frontier flattens while cost grows linearly). By continuity, the maximum is achieved at an interior point. $\square$

**Remark 3.1** (Geometric Interpretation). In the $(C, V)$ plane, CVIH is the slope of the line from the origin to the point $(C, V^*(C))$. The maximum-CVIH point is where this line has the steepest slope while still touching the frontier. This is the standard "bang-for-buck" optimization.

### 3.3 CVIH as a Quasi-Concave Function of Budget [S]

**Theorem 3.3** (Quasi-Concavity of CVIH). *Under the concavity of $V^*(C)$ and the boundary conditions $V^*(0) = 0$ and $\lim_{C \to \infty} V^*(C) < \infty$, the function $\text{CVIH}(C) = V^*(C)/C$ is quasi-concave in $C$ on $(0, \infty)$.*

*Proof.* A function $f$ is quasi-concave if its superlevel sets $\{x : f(x) \geq \alpha\}$ are convex for all $\alpha$.

Since $V^*(C)$ is concave with $V^*(0) = 0$, the function $V^*(C)/C$ has a single peak. To see this: for any $\alpha > 0$, the superlevel set $\{C : V^*(C)/C \geq \alpha\}$ equals $\{C : V^*(C) \geq \alpha C\}$. Since $V^*$ is concave and $\alpha C$ is linear, the set where a concave function exceeds a linear function is an interval (possibly empty). Intervals are convex, so $\text{CVIH}$ is quasi-concave.

More explicitly: $V^*(C)/C$ is increasing for $C < C^*$ (where the marginal return exceeds the average return) and decreasing for $C > C^*$ (where the marginal return falls below the average). This single-peaked structure is quasi-concavity. $\square$

**Corollary 3.4** (Existence of Optimal Budget). *There exists a unique budget $C^* > 0$ that maximizes CVIH. Spending either too little or too much reduces CVIH.*

- *Too little ($C < C^*$):* Insufficient budget forces use of weak models or inadequate verification, reducing $p_{\text{verify}}$ faster than costs are saved.
- *Too much ($C > C^*$):* Excess budget encounters diminishing returns in both $\lambda_{\text{raw}}$ and $p_{\text{verify}}$, while costs grow linearly.

### 3.4 Relationship Between CVIH-Optimal and Quality-Optimal Budgets [S]

**Definition 3.7** (Quality-Optimal Budget). The *quality-optimal budget* $B_q^*$ is the budget that maximizes the pipeline quality function $Q^*(B) = \max \prod q_k(r_k)$ from the TBAP (Token Budget Allocation Problem, R4). Under concavity of each $q_k$, this is the point where the marginal quality of additional budget approaches zero:

$$\frac{dQ^*}{dB}\bigg|_{B_q^*} \approx 0$$

In practice, $B_q^*$ is finite when quality functions have an interior maximum (non-monotone quality, R4 Section 7) and may be infinite when quality monotonically increases (in which case $B_q^*$ is defined as the point where the marginal gain falls below some threshold $\eta$).

**Theorem 3.5** (CVIH-Optimal Budget is Below Quality-Optimal). *The CVIH-maximizing budget $C^*$ satisfies $C^* \leq B_q^*$, with equality only in degenerate cases (e.g., when the frontier is linear).*

*Proof sketch.* At $C^*$, the marginal VIH per dollar equals the average VIH per dollar (Theorem 3.2). At $B_q^*$, the marginal quality per dollar is approximately zero. Since $V^*$ is concave:

$$\frac{dV^*}{dC}\bigg|_{C^*} = \frac{V^*(C^*)}{C^*} > 0$$

but

$$\frac{dV^*}{dC}\bigg|_{B_q^*} \approx 0$$

Since $dV^*/dC$ is decreasing (by concavity of $V^*$), we need $C^* < B_q^*$ for the marginal return at $C^*$ to exceed the marginal return at $B_q^*$. $\square$

**Corollary 3.6** (The Efficiency-Quality Tradeoff). *Maximizing efficiency (CVIH) and maximizing quality (VIH or $Q^*$) are distinct objectives. A cost-constrained harness should target $C^*$, not $B_q^*$. Spending beyond $C^*$ improves quality but at a rate that does not justify the cost.*

**Practical Interpretation.** If the quality-optimal budget for a code review task is \$5.00 (using a frontier model with extensive context and multiple verification passes), the CVIH-optimal budget might be \$1.50 (using a mid-tier model with focused context and a single verification pass). The \$1.50 configuration produces fewer verified iterations per hour in absolute terms, but more verified iterations per dollar-hour. The choice depends on whether the organization is budget-constrained (optimize CVIH) or throughput-constrained (optimize VIH).

---

## 4. The Budget Sufficiency Condition

### 4.1 Setup [S]

**Definition 4.1** (Budget Gap). Given the quality-optimal budget $B_q^*$ (from the Information pillar's context optimization) and the financial budget $B_f$ (hard constraint from the Economics pillar), the *budget gap* is:

$$\Delta = B_q^* - B_f$$

Three cases arise:
- **Slack ($\Delta \leq 0$):** The financial budget exceeds the quality-optimal budget. The economics constraint does not bind; optimize quality freely.
- **Binding ($\Delta > 0$):** The financial budget is more restrictive. The economics pillar's allocation matters.
- **Critical ($\Delta / B_q^* > 0.5$):** The financial budget is less than half the quality optimum. Severe quality degradation is expected.

### 4.2 Graceful Degradation Bound [S]

**Theorem 4.1** (Quality Degradation Bound). *Let $Q^*(B)$ be the Pareto-optimal quality at budget $B$, with $Q^*$ concave and $Q^*(0) = 0$. Then for any financial budget $B_f < B_q^*$:*

$$Q^*(B_f) \geq Q^*(B_q^*) \cdot \frac{B_f}{B_q^*}$$

*That is, quality degrades at most linearly with the budget gap.*

*Proof.* By concavity of $Q^*$ and the condition $Q^*(0) = 0$:

For any $\alpha \in [0, 1]$, concavity gives:

$$Q^*(\alpha \cdot B_q^*) \geq \alpha \cdot Q^*(B_q^*) + (1 - \alpha) \cdot Q^*(0) = \alpha \cdot Q^*(B_q^*)$$

Setting $\alpha = B_f / B_q^*$ (which lies in $[0, 1]$ since $B_f < B_q^*$):

$$Q^*(B_f) \geq \frac{B_f}{B_q^*} \cdot Q^*(B_q^*) \qquad \square$$

**Remark 4.1.** The linear bound is tight when $Q^*$ is linear (the worst case for a concave function passing through the origin). In practice, the concavity of $Q^*$ means that the actual degradation is sublinear: a 50% budget cut causes less than 50% quality loss. The tighter bound depends on the curvature of $Q^*$.

**Theorem 4.2** (Tighter Bound with Curvature). *If $Q^*(B)$ satisfies the power-law form $Q^*(B) = Q_{\max} \cdot (B/B_q^*)^{\alpha}$ for some $\alpha \in (0, 1)$ (concavity requires $\alpha < 1$), then:*

$$Q^*(B_f) = Q^*(B_q^*) \cdot \left(\frac{B_f}{B_q^*}\right)^{\alpha}$$

*For $\alpha = 0.5$ (square-root scaling, consistent with the "first 20% captures ~60% of quality" empirical pattern):*

$$Q^*(0.5 \cdot B_q^*) = Q^*(B_q^*) \cdot \sqrt{0.5} \approx 0.71 \cdot Q^*(B_q^*)$$

*A 50% budget cut causes only a 29% quality loss.*

*Proof.* Direct substitution into the power-law model. The exponent $\alpha$ is estimated from the empirical observation: if 20% of budget yields 60% of quality, then $(0.2)^{\alpha} = 0.6$, giving $\alpha = \log(0.6) / \log(0.2) = (-0.511) / (-1.609) \approx 0.317$. Under this calibration, a 50% budget cut yields $Q^*(0.5 B_q^*) = Q^*(B_q^*) \cdot 0.5^{0.317} \approx 0.80 \cdot Q^*(B_q^*)$, a 20% quality loss. $\square$

**Practical Significance.** The sublinear degradation bound is the formal basis for the claim that intelligent budget allocation can absorb significant cost constraints with modest quality impact. The exponent $\alpha$ (estimated at 0.3-0.5 from empirical data) quantifies the "diminishing returns buffer": because the first dollars are the most productive, budget cuts primarily eliminate low-marginal-value spending.

---

## 5. The Caching Leverage Theorem

### 5.1 Caching Cost Model [E + S]

**Definition 5.1** (Multi-Stage Cost with Caching). Consider a $K$-stage pipeline where stage $k$ consumes $r_k$ tokens at base price $p_k$. With caching, the effective cost is:

$$C_{\text{cached}} = \sum_{k=1}^{K} p_k \cdot r_k \cdot \left[(1 - \rho_k) + \rho_k \cdot \delta_k\right]$$

where:
- $\rho_k \in [0, 1]$ is the cache hit rate at stage $k$
- $\delta_k \in (0, 1)$ is the cache discount ratio at stage $k$ (the fraction of the full price charged for a cache hit; typically 0.1 for a 90% cache discount)

**Definition 5.2** (Cost Reduction Factor). The *cost reduction factor* at stage $k$ is:

$$\phi_k = (1 - \rho_k) + \rho_k \cdot \delta_k = 1 - \rho_k(1 - \delta_k)$$

The total cost with caching is $C_{\text{cached}} = \sum_k p_k r_k \phi_k$, and the aggregate cost reduction relative to no caching is:

$$\Phi = \frac{C_{\text{cached}}}{C_{\text{no\text{-}cache}}} = \frac{\sum_k p_k r_k \phi_k}{\sum_k p_k r_k}$$

### 5.2 Uniform Caching Analysis [E]

**Proposition 5.1** (Uniform Caching Reduction). *When all stages have the same cache hit rate $\rho$ and cache discount $\delta$, the cost reduction factor is:*

$$\Phi = 1 - \rho(1 - \delta)$$

**Calibration from empirical data (R2, Section 2.1):**
- Claude Code achieves $\rho = 0.92$, $\delta = 0.10$ (90% cache discount)
- $\Phi = 1 - 0.92 \cdot 0.90 = 1 - 0.828 = 0.172$

This matches the reported 81% cost reduction (since $1 - 0.172 = 0.828 \approx 81\%$, within rounding of the published 81% figure).

**At the provider-universal 90% cache discount ($\delta = 0.10$):**

| Cache Hit Rate $\rho$ | Cost Reduction Factor $\Phi$ | Percent Savings |
|------------------------|------------------------------|-----------------|
| 0.50 | 0.55 | 45% |
| 0.70 | 0.37 | 63% |
| 0.80 | 0.28 | 72% |
| 0.90 | 0.19 | 81% |
| 0.92 | 0.172 | 82.8% |
| 0.95 | 0.145 | 85.5% |

### 5.3 Marginal ROI of Cache Improvement [S]

**Proposition 5.2** (Marginal Value of Cache Hit Rate). *The marginal cost reduction from improving the cache hit rate by $d\rho$ is:*

$$\frac{d\Phi}{d\rho} = -(1 - \delta)$$

*This is constant in $\rho$: each additional percentage point of cache hit rate provides the same absolute cost reduction, regardless of the current hit rate.*

*Proof.* Differentiating $\Phi = 1 - \rho(1 - \delta)$ with respect to $\rho$:

$$\frac{d\Phi}{d\rho} = -(1 - \delta) \qquad \square$$

**Remark 5.1.** While the marginal absolute reduction is constant, the marginal *relative* reduction increases with $\rho$. Going from $\rho = 0.50$ to $\rho = 0.51$ saves $0.9\%$ of original cost, reducing the bill from 55% to 54.1% of baseline (a 1.6% relative improvement). Going from $\rho = 0.90$ to $\rho = 0.91$ also saves $0.9\%$ of original cost, but reduces the bill from 19% to 18.1% of baseline (a 4.7% relative improvement).

### 5.4 The Caching Leverage Theorem [S]

**Theorem 5.3** (Cache-First Principle). *For a fixed quality level $Q$, let the available cost-reduction levers be: (a) cache hit rate improvement, (b) model downgrade (substituting a cheaper model), and (c) context reduction (reducing tokens per stage). Assume:*

1. *Cache improvement has zero quality impact (caching changes cost, not content)*
2. *Model downgrade reduces quality by $\Delta Q_m > 0$ per tier*
3. *Context reduction reduces quality by $\Delta Q_c > 0$ per unit of context removed*

*Then for any target cost reduction $\Delta C$, the cache-first strategy (maximize $\rho$ before applying other levers) achieves the highest quality among all strategies achieving $\Delta C$.*

*Proof.* The key observation is that caching is the only cost lever with zero quality impact. Formally, define the cost-quality tradeoff ratio for each lever:

- Cache improvement: $\text{TQ}_{\text{cache}} = \Delta C / \Delta Q = \Delta C / 0 = \infty$ (infinite quality-per-dollar-saved)
- Model downgrade: $\text{TQ}_{\text{model}} = \Delta C_m / \Delta Q_m < \infty$
- Context reduction: $\text{TQ}_{\text{context}} = \Delta C_c / \Delta Q_c < \infty$

Any strategy achieving cost reduction $\Delta C$ must choose some combination of these levers. Since cache improvement has an infinite quality-per-dollar-saved ratio (until the cache hit rate reaches its feasible maximum $\rho_{\max}$), it should be exhausted first before engaging quality-degrading levers.

Formally, let $\Delta C_{\text{cache}} = C_{\text{no\text{-}cache}} \cdot \rho_{\max} \cdot (1 - \delta)$ be the maximum achievable cost reduction from caching alone. If $\Delta C \leq \Delta C_{\text{cache}}$, the entire cost reduction can be achieved with zero quality loss. If $\Delta C > \Delta C_{\text{cache}}$, the remaining $\Delta C - \Delta C_{\text{cache}}$ must be obtained from quality-degrading levers, but the quality impact is minimized by maximizing the cache contribution first. $\square$

**Corollary 5.4** (Cache as Quality Shield). *Improving cache hit rate from $\rho_0$ to $\rho_1$ "buys" a quality budget of:*

$$\Delta B_{\text{quality}} = C_{\text{base}} \cdot (\rho_1 - \rho_0)(1 - \delta)$$

*This freed budget can be redirected to more capable models or additional verification passes, improving quality at constant total cost.*

**Practical Calibration.** For a harness spending \$5,000/month on tokens, improving cache hit rate from 70% to 90% (achievable by careful prompt structure, per Lumer et al., 2026) saves:

$$\Delta B_{\text{quality}} = 5000 \cdot 0.20 \cdot 0.90 = \$900/\text{month}$$

This \$900 can fund approximately 60 additional Opus 4.6 calls per month (at \$15/MTok output, ~1M tokens output each) or 3,600 additional Haiku calls. The quality impact of redirecting this budget to verification passes or frontier-model reviews is substantial.

---

## 6. The Empirical Calibration Framework

### 6.1 The Calibration Problem [S]

The formal results in Sections 1-5 and in the prior formalizations (R4's TBAP, R3's queueing models) depend on several functions and parameters that must be estimated from empirical data:

| Parameter | Symbol | Source | Estimation Method |
|-----------|--------|--------|-------------------|
| Quality function per stage | $q_k(r_k)$ | Production telemetry | Parametric regression |
| Price per token per stage | $p_k$ | Provider pricing tables | Direct observation |
| Cache hit rate per stage | $\rho_k$ | Production telemetry | Rolling average |
| Cache discount ratio | $\delta_k$ | Provider pricing tables | Direct observation |
| Developer hourly rate | $c_w$ | Salary surveys | Organizational data |
| Verification pass rate | $p_{\text{verify}}$ | CI/CD logs | Rolling average |
| Raw iteration rate | $\lambda_{\text{raw}}$ | Harness telemetry | Rolling average |
| Demand elasticity | $\epsilon$ | Usage growth vs. price data | Regression (Proposition 1.2) |

### 6.2 Quality Function Calibration [S]

The quality function $q_k(r_k)$ is the most critical and hardest to estimate. We propose two parametric families and discuss their empirical fit.

**Family 1: Exponential Saturation.**

$$q_k(r_k) = 1 - e^{-\alpha_k r_k}$$

Properties:
- $q_k(0) = 0$ (zero tokens, zero quality)
- $q_k(\infty) = 1$ (infinite tokens, perfect quality)
- $q_k'(r_k) = \alpha_k e^{-\alpha_k r_k} > 0$ (monotonically increasing)
- $q_k''(r_k) = -\alpha_k^2 e^{-\alpha_k r_k} < 0$ (concave)
- Single parameter $\alpha_k$ controls the "steepness" of quality gain

The exponential saturation model captures diminishing returns but not non-monotonicity. It is appropriate for stages where quality monotonically improves with tokens (e.g., test generation, where more test cases are always weakly better).

**Calibration.** If stage $k$ achieves quality $q_k^{(1)} = 0.60$ at token allocation $r_k^{(1)}$ and quality $q_k^{(2)} = 0.90$ at $r_k^{(2)}$, then:

$$\alpha_k = \frac{\log(1 - q_k^{(1)}) - \log(1 - q_k^{(2)})}{r_k^{(2)} - r_k^{(1)}} = \frac{\log(0.40) - \log(0.10)}{r_k^{(2)} - r_k^{(1)}} = \frac{1.386}{r_k^{(2)} - r_k^{(1)}}$$

**Family 2: Hill Function (Sigmoid).**

$$q_k(r_k) = \frac{r_k^{\beta_k}}{r_k^{\beta_k} + K_k^{\beta_k}}$$

Properties:
- $q_k(0) = 0$ (zero tokens, zero quality)
- $q_k(\infty) = 1$ (infinite tokens, perfect quality)
- $q_k(K_k) = 0.5$ (half-maximal quality at $r_k = K_k$)
- Concave for $r_k > K_k \cdot [(\beta_k - 1)/(\beta_k + 1)]^{1/\beta_k}$ (for $\beta_k > 1$)
- Convex near zero for $\beta_k > 1$ (S-shaped)
- Two parameters: $K_k$ (half-saturation point) and $\beta_k$ (steepness)

The Hill function captures the "minimum viable token" phenomenon: quality is negligible until a threshold of tokens is reached (the convex portion), then rises steeply, then saturates (the concave portion). This matches empirical observations for stages requiring a minimum context load (e.g., code generation requires loading the target file, relevant imports, and test expectations before any useful output is possible).

**Calibration.** Given three quality measurements at different token allocations $(r^{(1)}, q^{(1)}), (r^{(2)}, q^{(2)}), (r^{(3)}, q^{(3)})$, fit $K_k$ and $\beta_k$ by nonlinear least squares:

$$\min_{K_k, \beta_k} \sum_{i=1}^{3} \left(q^{(i)} - \frac{(r^{(i)})^{\beta_k}}{(r^{(i)})^{\beta_k} + K_k^{\beta_k}}\right)^2$$

**Family 3: Non-Monotone Quality (for stages exhibiting context rot).**

$$q_k(r_k) = \left(1 - e^{-\alpha_k r_k}\right) \cdot e^{-\gamma_k \cdot \max(0, r_k - r_k^{\text{thresh}})}$$

This is the product of an exponential saturation (benefit) and an exponential decay (degradation beyond threshold $r_k^{\text{thresh}}$). The quality peaks at the interior maximum:

$$r_k^* = r_k^{\text{thresh}} + \frac{1}{\gamma_k} \cdot \log\left(\frac{\alpha_k}{\gamma_k}\right) \quad \text{(when } \alpha_k > \gamma_k \text{)}$$

This family is appropriate for stages where excess context degrades performance (Gao et al., 2025: 13.9%-85% performance degradation from context length alone; Chroma, 2025: context rot across 18 frontier models).

### 6.3 Functional Form Selection: Empirical Criteria [S]

**Proposition 6.1** (Model Selection Criterion). *The appropriate quality function family for stage $k$ is determined by the following empirical test:*

1. *Measure quality at three or more token allocations: $\{(r^{(i)}, q^{(i)})\}_{i=1}^n$.*
2. *If quality is monotonically non-decreasing in the measured range: use exponential saturation (Family 1) for simplicity, or Hill function (Family 2) if there is evidence of a minimum viable token threshold.*
3. *If quality peaks and then declines: use non-monotone quality (Family 3).*
4. *Model selection via AIC or BIC across the three families, with complexity penalty preventing overfitting on sparse data.*

**Remark 6.1.** In practice, most stages exhibit monotone quality within the practically relevant token range (1K-100K tokens). Non-monotone quality (Family 3) is primarily relevant for stages that consume very large contexts (100K+ tokens), where context rot empirically manifests.

### 6.4 Cost Calibration [E]

Token prices $p_k$ are directly observable from provider pricing tables (R2, Section 1). The effective price at stage $k$ incorporates caching:

$$p_k^{\text{eff}} = p_k \cdot \phi_k = p_k \cdot [1 - \rho_k(1 - \delta_k)]$$

For a stage using Claude Opus 4.6 with 90% cache hit rate and 90% cache discount:

$$p_k^{\text{eff}} = 5.00 \cdot [1 - 0.90 \cdot 0.90] = 5.00 \cdot 0.19 = \$0.95/\text{MTok}$$

This effective price (less than \$1/MTok) brings frontier-model costs into the range of mid-tier models without caching, underscoring the leverage of caching (Theorem 5.3).

### 6.5 The Calibration Protocol [S]

**Protocol 6.1** (Measure-Fit-Optimize-Verify). The empirical calibration follows a four-phase protocol:

**Phase 1: Measure.** Instrument the harness to collect, for each stage $k$:
- Token counts $r_k$ per iteration
- Quality outcomes $q_k$ (binary pass/fail or graded score)
- Cache hit counts and miss counts
- Wall-clock times $t_k$
- Model identity $m_k$
- Total API cost $c_k$

Minimum sample size: 100 iterations per stage for reliable parameter estimation. The Central Limit Theorem ensures that sample means of pass rates converge to population means at rate $O(1/\sqrt{n})$.

**Phase 2: Fit.** For each stage $k$:
1. Bin iterations by token allocation (e.g., deciles)
2. Compute mean quality per bin
3. Fit each parametric family (Families 1, 2, 3) to the binned data
4. Select the best family by AIC
5. Estimate confidence intervals on parameters via bootstrap

**Phase 3: Optimize.** Using the fitted quality functions $\hat{q}_k(r_k)$ and current prices $p_k^{\text{eff}}$:
1. Solve the TBAP: $\max \prod \hat{q}_k(r_k)$ subject to $\sum p_k^{\text{eff}} r_k \leq B$
2. Compute the CVIH-optimal budget $C^*$ (Theorem 3.2)
3. Determine the optimal model-tier assignment (R4, Section 8)
4. Compute the expected quality $Q^*$ and cost $C^*$

**Phase 4: Verify.** Deploy the optimized configuration and measure:
1. Actual quality vs. predicted quality (calibration check)
2. Actual cost vs. predicted cost
3. Actual CVIH vs. predicted CVIH
4. If predicted-actual gap exceeds 10%, return to Phase 2 with updated data

**Recalibration triggers:** The calibration should be repeated when:
- A new model generation is released (typically quarterly)
- Provider pricing changes by more than 20%
- Measured cache hit rates drift by more than 5 percentage points
- Measured quality at fixed token allocation changes by more than 10%

---

## 7. Design Principles Derived from the Formal Results

### 7.1 The Theorem-Principle-Guideline Mapping

The following table maps each formal result to a design principle and a concrete implementation guideline.

---

**Theorem 1.1: Jevons Paradox Condition** ($\epsilon > 1 \Rightarrow$ total spend increases as prices fall)

*Design Principle: Jevons Awareness.* Budget for demand increase when unit costs fall. Do not assume that cheaper tokens mean lower bills.

*Implementation Guideline:* When token prices drop by a factor $\phi$, provision budget capacity for a spend increase of $\phi^{\epsilon - 1}$. With $\epsilon \approx 1.19$, a 10x price drop should be accompanied by a $10^{0.19} \approx 1.55$x budget increase projection. Implement usage dashboards that track both unit cost and total consumption to detect Jevons-driven budget overruns.

---

**Proposition 1.3: Aggregate Elasticity Decomposition** ($\epsilon = \epsilon_n + \epsilon_d$, with extensive margin dominant)

*Design Principle: Extensive Margin Monitoring.* Track not just tokens-per-task but tasks-attempted-per-period. The primary driver of cost growth is new use cases, not deeper use of existing ones.

*Implementation Guideline:* Instrument the harness to distinguish between token growth from more tasks ($n(p)$ increasing) and token growth from richer context per task ($d(p)$ increasing). Alert when new task categories appear (e.g., first use of autonomous CI/CD agents), as these represent step-function demand increases.

---

**Corollary 2.2: Dual-Regime Principle** ($m_I^* \neq m_A^*$ in general)

*Design Principle: Regime-Aware Model Selection.* Use different models for interactive and autonomous workloads. Interactive tasks optimize for latency (frontier models); autonomous tasks optimize for cost-per-correct-result (budget models).

*Implementation Guideline:* Classify each incoming task as interactive or autonomous based on whether a developer session is attached. Apply the optimal service rate formula (R3, Model 2): $\mu^* = \lambda + \sqrt{c_w \lambda / c_s}$. When $c_w = 0$ (autonomous), $\mu^* = \lambda$; use the cheapest model that keeps up with demand. When $c_w > 0$ (interactive), $\mu^*$ is large; use the fastest capable model.

---

**Theorem 3.2: CVIH Maximization** (CVIH maximized where marginal VIH/dollar = average VIH/dollar)

*Design Principle: Efficiency-Optimal Budgeting.* There exists a specific budget level that maximizes verified output per dollar. Both underspending and overspending reduce this efficiency.

*Implementation Guideline:* Empirically estimate the VIH-cost frontier by running the harness at 3-5 different budget levels and measuring VIH. Plot the frontier, compute CVIH at each point, and identify the peak. Set the default budget at $C^*$, with overrides for quality-critical tasks (spend up to $B_q^*$).

---

**Theorem 3.5: CVIH-Optimal Below Quality-Optimal** ($C^* \leq B_q^*$)

*Design Principle: Cost-Optimal is Not Quality-Optimal.* The budget that maximizes efficiency is strictly below the budget that maximizes quality. Acknowledge this tradeoff explicitly in harness configuration.

*Implementation Guideline:* Expose two budget presets: "Efficient" (targets $C^*$, maximizes CVIH) and "Quality" (targets $B_q^*$, maximizes VIH). Let users select based on whether the current task is cost-sensitive (routine code, batch processing) or quality-sensitive (security review, production deployment).

---

**Theorem 4.1: Graceful Degradation Bound** ($Q^*(B_f) \geq Q^*(B_q^*) \cdot (B_f / B_q^*)$)

*Design Principle: Sublinear Degradation.* Budget cuts cause less-than-proportional quality loss due to diminishing returns. Intelligent allocation protects quality under budget pressure.

*Implementation Guideline:* When budgets are cut, do not apply uniform reductions across all stages. Instead, re-solve the TBAP (R4, Theorem 3: log-transform optimality condition) with the new budget to optimally reallocate. The equal marginal principle ensures that the first dollars cut are the lowest-marginal-value dollars.

---

**Theorem 5.3: Cache-First Principle** (Caching is the only cost lever with zero quality impact)

*Design Principle: Maximize Cache Hit Rate Before Other Optimizations.* Caching provides cost reduction without quality degradation. All other cost levers (model downgrade, context reduction) sacrifice quality.

*Implementation Guideline:* Structure prompts to maximize the static prefix fraction. Load system prompts, tool definitions, and project rules first; place dynamic content (user query, tool results) last. Measure cache hit rates and target $\rho \geq 0.85$. Only after caching is optimized should model routing or context reduction be considered.

---

**R4 Theorem 3: Equal Marginal Rate** ($q_k'(r_k^*) / (q_k(r_k^*) \cdot p_k) = \lambda^*$ for all active stages)

*Design Principle: Equalize Quality-Per-Dollar Across Stages.* At the optimum, the last dollar spent on any stage produces the same marginal improvement in log-quality. If one stage offers higher marginal returns, budget should flow toward it.

*Implementation Guideline:* Monitor the quantity $q_k'(r_k) / (q_k(r_k) \cdot p_k)$ at each stage. When this ratio differs across stages by more than 2x, reallocate budget from the low-ratio stage (diminishing returns) to the high-ratio stage (high marginal returns). In practice, this means the lowest-quality stage should receive budget increases first ("raise the floor").

---

**R4 Theorem 4: AM-GM / Weakest Link** (Product is maximized by equalizing qualities)

*Design Principle: Invest in the Lowest-Quality Stage First.* Since pipeline quality is multiplicative ($Q = \prod q_k$), a small improvement in the weakest stage has more impact than a large improvement in the strongest stage.

*Implementation Guideline:* Compute per-stage quality estimates. If any stage has $q_k < 0.7$ while others exceed $0.9$, prioritize budget reallocation to the weak stage. The product $0.7 \times 0.95 = 0.665$ improves more from raising 0.7 to 0.8 (new product: 0.76) than from raising 0.95 to 1.0 (new product: 0.70).

---

**R4 Section 7: Non-Monotone Quality** (Quality peaks, then degrades with excess tokens)

*Design Principle: Set Maximum Useful Budget Per Stage.* Beyond a certain token allocation, additional tokens degrade quality (context rot). Enforce hard caps.

*Implementation Guideline:* For each stage, empirically determine the peak-quality token allocation $r_k^*$ using Family 3 calibration (Section 6.2). Set hard caps at $r_k^{\max} = 1.2 \cdot r_k^*$ (20% margin above the estimated peak). Do not allow budget allocation beyond this cap, even when total budget is abundant. Redirect excess budget to other stages or to additional verification passes.

---

### 7.2 Summary of Novelty Status

| Result | Status | Source |
|--------|--------|--------|
| Jevons Paradox Condition (Theorem 1.1) | **[E]** Established microeconomics | Marshall (1890), Jevons (1865) |
| Elasticity Estimation (Proposition 1.2) | **[E]** Standard econometrics | Textbook constant-elasticity model |
| Margin Decomposition (Proposition 1.3) | **[E]** Standard decomposition | Labor economics (Heckman, 1993) |
| Empirical calibration $\epsilon \approx 1.19$ | **[S]** Novel application | Our calculation from AI market data |
| Extensive margin dominance hypothesis | **[C]** Conjectured | Motivated by threshold analysis (R5) |
| Dual-Regime Principle (Corollary 2.2) | **[S]** Novel synthesis | Combines queueing theory (R3) with market structure |
| CVIH Definition (3.5) | **[S]** Novel metric | Extends VIH (Temporal pillar) with cost normalization |
| CVIH Maximization (Theorem 3.2) | **[E]** Standard efficiency optimization | Analogous to Sharpe ratio maximization |
| Quasi-Concavity of CVIH (Theorem 3.3) | **[E]** Standard result | Ratio of concave to linear function |
| CVIH-Optimal Below Quality-Optimal (Theorem 3.5) | **[S]** Novel observation | Follows from frontier concavity |
| Graceful Degradation Bound (Theorem 4.1) | **[E]** Concavity property | Standard convex optimization |
| Power-law Degradation (Theorem 4.2) | **[S]** Novel calibration | Connects "20/60" empirical pattern to exponent $\alpha$ |
| Caching Cost Model (Section 5.1) | **[E]** Standard cost accounting | Direct from provider documentation |
| Cache-First Principle (Theorem 5.3) | **[S]** Novel design principle | Formal justification of practitioner heuristic |
| Quality function families (Section 6.2) | **[S]** Novel application | Exp saturation (E), Hill function (E), non-monotone composition (S) |
| Calibration Protocol (Protocol 6.1) | **[S]** Novel methodology | Measure-Fit-Optimize-Verify for AI harness economics |

---

## 8. Cross-Pillar Integration

### 8.1 Information Pillar Connection

The Information pillar's context curation theorem (Info-Arch Formal R3, Section 2) establishes the quality-optimal context size. The Economics pillar adds a cost constraint: when the quality-optimal context costs more than the budget allows, the budget gap (Definition 4.1) determines the quality loss. The graceful degradation bound (Theorem 4.1) guarantees that this loss is sublinear, providing a safety margin for cost-constrained operation.

The equal marginal rate condition (R4, Theorem 3) unifies both pillars: at the optimum, the marginal information value per dollar (Information pillar's contribution) equals the marginal quality per dollar (Economics pillar's constraint). The shadow price $\lambda^*$ serves as the exchange rate between these two perspectives.

### 8.2 Temporal Pillar Connection

The CVIH metric (Definition 3.5) directly extends the Temporal pillar's VIH metric by incorporating cost. The VIH-cost frontier (Definition 3.6) is the economic analog of the speed-quality Pareto frontier (Temporal Formal R2, Section 1). The key insight: the Temporal pillar's optimal operating point (maximum VIH) and the Economics pillar's optimal operating point (maximum CVIH) generally differ, with CVIH-optimal being at a lower budget than VIH-optimal (Theorem 3.5). The harness must navigate this tension based on whether the current constraint is throughput (use Temporal optimum) or budget (use Economics optimum).

### 8.3 Quality Pillar Connection

The Quality pillar's defect detection architecture defines per-stage verification costs and detection rates. The ROI function $\text{ROI}(\ell, j) = d_{\ell,j} \cdot D_j / c_\ell$ (from the Quality pillar) is the quality contribution per dollar invested in verification layer $\ell$ for defect type $j$. The Economics pillar's equal marginal rate condition requires that this ROI be equalized across all active verification layers, providing the formal criterion for deciding how many verification layers to employ and how much to invest in each.

### 8.4 Coordination Pillar Connection

Parallel agent execution (Coordination pillar) multiplies token costs by the parallelism factor. For $N$ parallel agents on independent tasks:

$$C_{\text{parallel}} = N \cdot C_{\text{single}}$$

The CVIH under parallelism becomes:

$$\text{CVIH}_{\text{parallel}} = \frac{N \cdot \text{VIH}_{\text{single}}}{N \cdot C_{\text{single}}} = \frac{\text{VIH}_{\text{single}}}{C_{\text{single}}} = \text{CVIH}_{\text{single}}$$

That is, CVIH is invariant to parallelism when agents are independent. Parallelism increases total throughput ($N \cdot$ VIH) and total cost ($N \cdot C$) proportionally. The economic value of parallelism comes from reduced wall-clock time (relevant for the Temporal pillar and developer waiting costs), not from improved cost efficiency per se. However, parallelism enables batch API discounts (50% at all major providers), which would increase CVIH by reducing the denominator.

---

## 9. Open Questions

### 9.1 Dynamic Elasticity

The isoelastic demand model (constant $\epsilon$) is a simplification. In reality, elasticity varies with the price level, the technology adoption curve, and the competitive landscape. A more realistic model would use a variable elasticity function $\epsilon(p, t)$ that accounts for:
- Adoption saturation at low prices (eventually, all tasks that can use AI tokens are using them, reducing $\epsilon$)
- Technology discontinuities (a new model architecture can shift the demand curve)
- Competitive dynamics (provider pricing strategies interact with demand)

### 9.2 Multi-Provider Optimization

The current framework assumes a single provider or a price-taking harness. In practice, the harness can arbitrage across providers, routing tasks to the cheapest capable provider. This introduces a game-theoretic dimension: provider pricing depends on aggregate demand, which depends on harness routing decisions. The equilibrium properties of this market are unexplored.

### 9.3 Temporal Discounting of Quality

The current model treats all quality equally. In practice, quality on urgent tasks (production incidents) is worth more than quality on routine tasks (code style fixes). Incorporating task-urgency weighting into the CVIH metric would create a priority-weighted efficiency measure, connecting to the c-mu rule from queueing theory (R3, Model 4).

### 9.4 Learning and Exploration

The calibration protocol (Protocol 6.1) assumes a static environment. In a non-stationary environment (new models, changing codebases, evolving team practices), the harness faces an exploration-exploitation tradeoff: should it exploit the current optimal configuration or explore alternative configurations that might be better? This connects to the multi-armed bandit literature and Bayesian optimization.

---

## 10. Notation Reference

| Symbol | Definition | Units | First Defined |
|--------|-----------|-------|---------------|
| $p(t)$ | Token price at time $t$ | \$/token | Definition 1.1 |
| $D(p)$ | Token demand as function of price | tokens/period | Definition 1.1 |
| $S(t)$ | Total spend per period | \$/period | Definition 1.1 |
| $\epsilon$ | Price elasticity of demand | dimensionless | Definition 1.2 |
| $n(p)$ | Extensive margin (tasks per period) | tasks/period | Definition 1.3 |
| $d(p)$ | Intensive margin (tokens per task) | tokens/task | Definition 1.3 |
| $\epsilon_n$ | Extensive-margin elasticity | dimensionless | Proposition 1.3 |
| $\epsilon_d$ | Intensive-margin elasticity | dimensionless | Proposition 1.3 |
| $R$ | Rebound rate | dimensionless | Definition 1.4 |
| $\lambda_{\text{raw}}$ | Raw iteration rate | iterations/hour | Definition 3.1 |
| $p_{\text{verify}}$ | Verification pass rate | dimensionless | Definition 3.2 |
| $\text{VIH}$ | Verified iterations per hour | verified-iter/hour | Definition 3.3 |
| $C_{\text{total}}$ | Total hourly cost | \$/hour | Definition 3.4 |
| $\text{CVIH}$ | Cost-adjusted VIH | verified-iter/(\$-hour) | Definition 3.5 |
| $V^*(C)$ | VIH-cost frontier | verified-iter/hour | Definition 3.6 |
| $C^*$ | CVIH-optimal budget | \$/hour | Theorem 3.2 |
| $B_q^*$ | Quality-optimal budget | \$/task | Definition 3.7 |
| $\Delta$ | Budget gap | \$/task | Definition 4.1 |
| $\rho_k$ | Cache hit rate at stage $k$ | dimensionless | Definition 5.1 |
| $\delta_k$ | Cache discount ratio | dimensionless | Definition 5.1 |
| $\phi_k$ | Cost reduction factor | dimensionless | Definition 5.2 |
| $q_k(r_k)$ | Quality function at stage $k$ | dimensionless $\in [0,1]$ | Section 6.2 |
| $\alpha_k$ | Exponential saturation rate parameter | 1/token | Section 6.2 |
| $K_k$ | Hill function half-saturation point | tokens | Section 6.2 |
| $\beta_k$ | Hill function steepness | dimensionless | Section 6.2 |

---

## References

### Foundational Economics
- Jevons, W.S. (1865). *The Coal Question*. Macmillan.
- Marshall, A. (1890). *Principles of Economics*. Macmillan.
- Saunders, H.D. (1992). The Khazzoom-Brookes postulate and neoclassical growth. *The Energy Journal*, 13(4), 131-148.
- Sorrell, S. (2009). Jevons' Paradox revisited: The evidence for backfire from improved energy efficiency. *Energy Policy*, 37(4), 1456-1469.

### Optimization Theory
- Boyd, S. and Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press.
- Nemhauser, G.L., Wolsey, L.A., and Fisher, M.L. (1978). An analysis of approximations for maximizing submodular set functions. *Mathematical Programming*, 14(1), 265-294.

### Queueing Theory
- Kleinrock, L. (1975). *Queueing Systems, Vol. 1: Theory*. Wiley.
- Mark, G., Gudith, D., and Klocke, U. (2008). The Cost of Interrupted Work: More Speed and Stress. *CHI 2008 Proceedings*, 107-110.

### AI Token Economics
- TokenCost (2026). AI Price Index: LLM Costs Dropped 300x (2023-2026).
- NavyaAI (2026). Tokens got 99.7% cheaper. So why did your AI bill triple?
- AICosts.ai (2026). The AI Agent Cost Crisis.
- Anthropic (2026). Prompt Caching Documentation.
- Lumer et al. (2026). Don't Break the Cache. *arXiv:2601.06007*.
- Zhang et al. (2025). Agentic Plan Caching. *arXiv:2506.14852*. NeurIPS 2025.

### Model Routing
- Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. *arXiv:2305.05176*.
- Ong, I. et al. (2025). RouteLLM. *ICLR 2025*.
- Madaan, A. et al. (2024). AutoMix. *NeurIPS 2024*.

### Empirical Quality Evidence
- Gao et al. (2025). Context Length Alone Hurts LLM Performance. *EMNLP 2025 Findings*.
- Chroma Research (2025). Context Rot.

### Cross-Pillar References
- Information Architecture Formal R3 (this project): Context curation theorem, tier assignment.
- Temporal Architecture Formal R2 (this project): VIH metric, speed-quality Pareto frontier.
- Economics Architecture Research R4 (this project): Submodular maximization, TBAP, Pareto frontier.
- Economics Architecture Research R3 (this project): Queueing cost models, dual regime.
- Economics Architecture Research R5 (this project): Jevons paradox data, contrarian positions.
