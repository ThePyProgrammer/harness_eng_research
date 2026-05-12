# Formal Economics of Model Selection and Queueing for AI Coding Agent Harnesses

**Formal Methods Round 2**
**Date:** 2026-04-03

---

## 1. Notation and Preliminaries

We establish notation used throughout. All vectors are column vectors; inequalities between vectors are componentwise.

**Models.** Let $\mathcal{M} = \{1, \ldots, M\}$ be a finite set of available language models. Each model $m \in \mathcal{M}$ is characterized by a tuple $(c_m, p_m, l_m, s_m)$ where:

- $c_m \in \mathbb{R}^d_{\geq 0}$ is the **capability vector** across $d$ dimensions (e.g., reasoning, code generation, instruction following, long-context handling)
- $p_m > 0$ is the **cost per token** (dollars per million tokens, input-weighted)
- $l_m > 0$ is the **base latency** (seconds per 1K output tokens)
- $s_m > 0$ is the **token generation speed** (tokens per second)

**Stages.** Let $\mathcal{K} = \{1, \ldots, K\}$ be a finite set of pipeline stages (e.g., context loading, planning, code generation, testing, review). Each stage $k \in \mathcal{K}$ has:

- $c_k^{\min} \in \mathbb{R}^d_{\geq 0}$: the **minimum capability requirement** (componentwise)
- $r_k \geq 0$: the **token allocation** (number of tokens consumed)
- $q_k : \mathcal{M} \times \mathbb{R}_{\geq 0} \to (0, 1]$: the **quality function**, where $q_k(m, r)$ is the probability that stage $k$ produces a correct output when assigned model $m$ and given $r$ tokens

**Quality structure.** Pipeline quality is multiplicative:

$$Q(\sigma, \mathbf{r}) = \prod_{k=1}^{K} q_k(\sigma(k), r_k)$$

where $\sigma : \mathcal{K} \to \mathcal{M}$ is the **assignment function** mapping stages to models, and $\mathbf{r} = (r_1, \ldots, r_K)$ is the token allocation vector.

**Cost structure.** Total cost is additive:

$$C(\sigma, \mathbf{r}) = \sum_{k=1}^{K} p_{\sigma(k)} \cdot r_k$$

---

## 2. The Model Tier Selection Problem (MTSP)

### 2.1 Problem Statement

**Definition 1 (MTSP).** The Model Tier Selection Problem is: given models $\mathcal{M}$, stages $\mathcal{K}$, token demands $\mathbf{r} = (r_1, \ldots, r_K)$, and a global quality floor $Q_{\min} \in (0, 1)$, find an assignment $\sigma^* : \mathcal{K} \to \mathcal{M}$ solving:

$$\min_{\sigma : \mathcal{K} \to \mathcal{M}} \sum_{k=1}^{K} p_{\sigma(k)} \cdot r_k$$

subject to:

1. **(Capability constraint)** $c_{\sigma(k)} \geq c_k^{\min}$ (componentwise) for all $k \in \mathcal{K}$
2. **(Quality floor)** $\prod_{k=1}^{K} q_k(\sigma(k), r_k) \geq Q_{\min}$

[Novel formulation: applying the GAP structure to AI pipeline model assignment]

### 2.2 Feasibility

**Definition 2 (Feasible model set).** For stage $k$, the set of models meeting its capability requirement is:

$$\mathcal{M}_k = \{m \in \mathcal{M} : c_m \geq c_k^{\min}\}$$

If $\mathcal{M}_k = \emptyset$ for any $k$, the MTSP is infeasible: no available model meets that stage's requirements. We assume $\mathcal{M}_k \neq \emptyset$ for all $k$.

An assignment $\sigma$ is **capability-feasible** if $\sigma(k) \in \mathcal{M}_k$ for all $k$. The set of capability-feasible assignments is $\Sigma_{\text{cap}} = \prod_{k=1}^{K} \mathcal{M}_k$, with $|\Sigma_{\text{cap}}| = \prod_{k} |\mathcal{M}_k| \leq M^K$.

### 2.3 Relationship to the Generalized Assignment Problem

**Proposition 1 (MTSP as GAP variant).** The MTSP is a variant of the Generalized Assignment Problem.

[Established theory: Chekuri and Khanna (2005)]

*Proof sketch.* The standard GAP assigns $n$ items to $m$ bins, each with a capacity, maximizing total profit. In MTSP, the $K$ stages are "items" to be assigned to $M$ model "bins." The capability constraint restricts which bin each item may enter (heterogeneous assignment). The standard GAP has per-bin capacity constraints; our variant replaces these with a single global constraint (the quality floor). The cost objective is the same: minimize total assignment cost. This reduction places MTSP within the GAP family, though the multiplicative quality constraint differs from the standard additive structure. $\square$

### 2.4 Complexity

**Theorem 1 (MTSP Hardness).** The decision version of MTSP (does there exist $\sigma$ with $C(\sigma, \mathbf{r}) \leq B$ and $Q(\sigma, \mathbf{r}) \geq Q_{\min}$?) is NP-hard in general.

[Established result: GAP is APX-hard, Chekuri and Khanna (2005)]

*Proof sketch.* The standard 0-1 knapsack problem reduces to MTSP as follows. Given a knapsack instance with $n$ items of weights $w_i$ and values $v_i$ and capacity $W$, construct an MTSP instance with $K = n$ stages and $M = 2$ models (a "cheap" model 1 and an "expensive" model 2). Set $r_k = w_k$, $p_1 = 0$, $p_2 = 1$, and $q_k(1, r_k) = 1$, $q_k(2, r_k) = e^{v_k}$. Set $Q_{\min} = e^V$ for the required total value $V$ and budget $B = W$. Then finding a feasible assignment is equivalent to finding a knapsack packing achieving value $\geq V$ within weight $W$. Since 0-1 knapsack is NP-hard, so is MTSP. $\square$

### 2.5 Practical Tractability via Enumeration

**Proposition 2 (Small-instance tractability).** When $M$ and $K$ are small constants (e.g., $M \leq 5$, $K \leq 10$), MTSP is solvable by enumeration in $O(M^K)$ time.

[Novel observation for this application domain]

*Argument.* The total number of capability-feasible assignments is $|\Sigma_{\text{cap}}| \leq M^K$. For $M = 3$ and $K = 6$, this is $3^6 = 729$ candidates. For $M = 5$ and $K = 10$, this is $5^{10} \approx 9.8 \times 10^6$, still tractable with pruning. For each candidate $\sigma$, checking capability feasibility is $O(Kd)$ and evaluating cost and quality is $O(K)$.

**Pruning strategies** reduce the effective search space:

1. **Dominance pruning.** If model $m_1$ is cheaper, faster, and at least as capable as $m_2$ on every dimension ($c_{m_1} \geq c_{m_2}$, $p_{m_1} \leq p_{m_2}$), then $m_2$ is dominated and can be removed from consideration.
2. **Quality pruning.** If the current best cost $C^*$ is known, prune any partial assignment whose cost already exceeds $C^*$.
3. **Quality-floor pruning.** If the product of maximum achievable qualities for unassigned stages, multiplied by the qualities already committed, falls below $Q_{\min}$, prune the branch.

**Worked example.** Consider $M = 3$ tiers and $K = 6$ stages with the following data:

| Model | $p_m$ ($/MTok) | Capability $c_m$ (scalar) |
|-------|-----------------|---------------------------|
| Haiku (H) | $1.00 | 0.6 |
| Sonnet (S) | $3.00 | 0.85 |
| Opus (O) | $5.00 | 0.95 |

| Stage | $c_k^{\min}$ | $r_k$ (KTok) | $q_k(H)$ | $q_k(S)$ | $q_k(O)$ |
|-------|---------------|---------------|-----------|-----------|-----------|
| 1 (Context) | 0.5 | 50 | 0.90 | 0.95 | 0.98 |
| 2 (Planning) | 0.8 | 20 | -- | 0.88 | 0.95 |
| 3 (Coding) | 0.8 | 100 | -- | 0.82 | 0.93 |
| 4 (Testing) | 0.5 | 30 | 0.85 | 0.92 | 0.96 |
| 5 (Review) | 0.8 | 40 | -- | 0.90 | 0.95 |
| 6 (Commit) | 0.3 | 10 | 0.95 | 0.97 | 0.99 |

Dashes indicate the model fails the capability constraint for that stage. Setting $Q_{\min} = 0.50$.

The feasible model sets are: $\mathcal{M}_1 = \{H, S, O\}$, $\mathcal{M}_2 = \{S, O\}$, $\mathcal{M}_3 = \{S, O\}$, $\mathcal{M}_4 = \{H, S, O\}$, $\mathcal{M}_5 = \{S, O\}$, $\mathcal{M}_6 = \{H, S, O\}$.

Total feasible assignments: $3 \times 2 \times 2 \times 3 \times 2 \times 3 = 216$.

**Cheapest feasible assignment** (minimize cost, ignoring quality floor): assign Haiku wherever feasible, Sonnet otherwise.

$\sigma_{\text{cheap}} = (H, S, S, H, S, H)$

Cost: $(50 \times 1 + 20 \times 3 + 100 \times 3 + 30 \times 1 + 40 \times 3 + 10 \times 1) / 1000 = (50 + 60 + 300 + 30 + 120 + 10) / 1000 = \$0.570$

Quality: $0.90 \times 0.88 \times 0.82 \times 0.85 \times 0.90 \times 0.95 = 0.472$

This fails the quality floor ($0.472 < 0.50$).

**Upgrade the weakest stage.** Stage 3 (Coding) has the lowest quality at 0.82. Upgrading from Sonnet to Opus:

$\sigma_1 = (H, S, O, H, S, H)$

Cost: $(50 + 60 + 500 + 30 + 120 + 10) / 1000 = \$0.770$

Quality: $0.90 \times 0.88 \times 0.93 \times 0.85 \times 0.90 \times 0.95 = 0.535$

This meets the quality floor ($0.535 \geq 0.50$) at cost $\$0.770$.

**Alternative: upgrade Planning instead.**

$\sigma_2 = (H, O, S, H, S, H)$

Cost: $(50 + 100 + 300 + 30 + 120 + 10) / 1000 = \$0.610$

Quality: $0.90 \times 0.95 \times 0.82 \times 0.85 \times 0.90 \times 0.95 = 0.510$

This also meets the quality floor ($0.510 \geq 0.50$) at lower cost $\$0.610$. Despite Coding being the weakest stage, upgrading Planning is cheaper because Stage 2 consumes only 20K tokens vs. Stage 3's 100K tokens. The cost-effectiveness of an upgrade depends on both the quality improvement and the stage's token consumption.

This illustrates that the "upgrade the weakest link" heuristic must be cost-weighted: the correct criterion is the quality improvement per dollar spent.

---

## 3. The Joint Allocation-Selection Problem (JASP)

### 3.1 Problem Statement

**Definition 3 (JASP).** The Joint Allocation-Selection Problem simultaneously optimizes model assignment and token allocation:

$$\min_{\sigma, \mathbf{r}} \; C(\sigma, \mathbf{r}) = \sum_{k=1}^{K} p_{\sigma(k)} \cdot r_k$$

subject to:

1. $c_{\sigma(k)} \geq c_k^{\min}$ for all $k$
2. $Q(\sigma, \mathbf{r}) = \prod_{k=1}^{K} q_k(\sigma(k), r_k) \geq Q_{\min}$
3. $r_k \geq r_k^{\min}$ for all $k$ (minimum token requirement per stage)

The dual form is:

$$\max_{\sigma, \mathbf{r}} \; Q(\sigma, \mathbf{r}) = \prod_{k=1}^{K} q_k(\sigma(k), r_k) \quad \text{subject to} \quad C(\sigma, \mathbf{r}) \leq B$$

[Novel formulation: combining MTSP with the Token Budget Allocation Problem (TBAP)]

### 3.2 Decomposition Structure

**Theorem 2 (JASP Decomposition).** The JASP decomposes into an outer combinatorial problem and an inner convex problem. For any fixed assignment $\sigma$, the inner token allocation problem:

$$\max_{\mathbf{r} \geq \mathbf{r}^{\min}} \; \prod_{k=1}^{K} q_k(\sigma(k), r_k) \quad \text{subject to} \quad \sum_{k} p_{\sigma(k)} r_k \leq B$$

is a convex optimization problem (after log-transformation) with a unique global optimum, provided each $q_k(m, \cdot)$ is concave and positive for all $m$.

[Established theory: Boyd and Vandenberghe (2004), Sections 4.2-4.4; Novel synthesis: applying this decomposition to AI pipeline optimization]

*Proof.* Fix $\sigma$. Let $\tilde{q}_k(r_k) = q_k(\sigma(k), r_k)$. The log-transformed problem is:

$$\max_{\mathbf{r} \geq \mathbf{r}^{\min}} \sum_{k=1}^{K} \log \tilde{q}_k(r_k) \quad \text{subject to} \quad \sum_{k} p_{\sigma(k)} r_k \leq B$$

Each $\log \tilde{q}_k$ is concave (since $\tilde{q}_k$ is concave and positive; see Proposition 5 in Research R4). The sum of concave functions is concave. The constraints are linear, hence convex. By Slater's condition (any allocation with $\sum p_{\sigma(k)} r_k < B$ is strictly feasible), strong duality holds and the KKT conditions are necessary and sufficient. $\square$

### 3.3 The KKT Conditions for the Inner Problem

**Proposition 3 (Optimality of the inner TBAP).** At the optimal token allocation $\mathbf{r}^*$ for fixed $\sigma$, the KKT conditions yield:

$$\frac{q_k'(\sigma(k), r_k^*)}{q_k(\sigma(k), r_k^*) \cdot p_{\sigma(k)}} = \lambda^* \quad \text{for all } k \text{ with } r_k^* > r_k^{\min}$$

where $q_k' = \partial q_k / \partial r_k$ and $\lambda^* \geq 0$ is the Lagrange multiplier on the budget constraint.

[Established theory: KKT conditions, Boyd and Vandenberghe (2004)]

*Interpretation.* The quantity on the left is the **relative marginal quality per dollar**: the proportional quality gain from one additional token at stage $k$, divided by that token's cost. At the optimum, this ratio is equalized across all active stages. This is the equal marginal principle (Gossen's Second Law, 1854) applied to the log-quality objective.

**The shadow price** $\lambda^* = d(\log Q^*)/dB$ measures the marginal improvement in log-quality per additional dollar of budget. When $\lambda^*$ is large, the budget is severely binding; when $\lambda^* \approx 0$, additional budget has negligible value.

### 3.4 Solving the Full JASP

**Algorithm 1 (Enumerate-and-Optimize).**

```
Input: Models M, Stages K, budget B, quality floor Q_min
Output: Optimal (sigma*, r*)

1. Generate Sigma_cap = {sigma : sigma(k) in M_k for all k}
2. C_best = infinity; sigma* = null; r* = null
3. For each sigma in Sigma_cap:
   a. Solve inner TBAP: r(sigma) = argmax_{r >= r_min, C(sigma,r) <= B} Q(sigma, r)
   b. If Q(sigma, r(sigma)) >= Q_min and C(sigma, r(sigma)) < C_best:
      C_best = C(sigma, r(sigma))
      sigma* = sigma; r* = r(sigma)
4. Return (sigma*, r*)
```

**Complexity.** The outer loop runs $|\Sigma_{\text{cap}}| \leq M^K$ times. Each inner TBAP solve, being a $K$-variable convex program with one linear constraint, requires $O(K \log(1/\epsilon))$ iterations of Newton's method (Boyd and Vandenberghe, 2004, Chapter 9), each costing $O(K)$. Total: $O(M^K \cdot K^2 \log(1/\epsilon))$.

For $M = 3, K = 6$: approximately $729 \times 36 \times 15 \approx 394{,}000$ operations, trivially solvable.

For $M = 5, K = 10$: approximately $10^7 \times 100 \times 20 = 2 \times 10^{10}$, requiring pruning but still tractable for an offline optimization.

### 3.5 Greedy Heuristic for Large Instances

**Algorithm 2 (Cost-Effective Greedy Upgrade).**

```
Input: Models M, Stages K, budget B, quality floor Q_min
Output: Assignment sigma, allocation r

1. Initialize: sigma(k) = argmin_{m in M_k} p_m for all k  (cheapest feasible)
2. Solve inner TBAP for sigma to get r; compute Q(sigma, r)
3. While Q(sigma, r) < Q_min:
   a. For each stage k, for each model m in M_k with m != sigma(k):
      Compute delta_Q(k, m) = quality improvement from upgrading stage k to model m
      Compute delta_C(k, m) = cost increase from the upgrade
      Score(k, m) = delta_Q(k, m) / delta_C(k, m)
   b. Select (k*, m*) = argmax Score(k, m)
   c. Set sigma(k*) = m*; re-solve inner TBAP; update Q, r
4. Return (sigma, r)
```

This greedy heuristic runs in $O(K \cdot M)$ upgrade steps (at most $K \cdot (M-1)$ upgrades possible), each requiring one TBAP solve. Total complexity: $O(K^2 M \cdot K \log(1/\epsilon)) = O(K^3 M \log(1/\epsilon))$, which is polynomial and practical for any reasonable instance size.

The greedy approach lacks a worst-case approximation guarantee for the multiplicative quality constraint. However, for the practical case where quality functions are well-behaved (concave, monotone in model capability), it produces near-optimal results because the upgrade scoring directly targets the cost-quality ratio.

---

## 4. The Dual-Regime Queueing Model

### 4.1 Setup

[Established theory: Kleinrock (1975, 1976); M/M/1 queue cost optimization]

**Definition 4 (Task arrival process).** Developer tasks arrive at the harness as a Poisson process with rate $\lambda$ (tasks per hour). Each task requires processing by a model, producing output in time $S$ (a random variable depending on model and task).

**Definition 5 (Service cost function).** The cost per task when using model $m$ with token allocation $r$ is:

$$c_s(m, r) = p_m \cdot r$$

**Definition 6 (Waiting cost function).** When a developer is blocked waiting for output, the waiting cost per unit time is $c_w$ (the developer's fully loaded hourly rate, typically \$80-\$200/hr for senior engineers).

### 4.2 Interactive Regime (Developer Blocked)

**Definition 7 (Interactive regime).** In the interactive regime, the developer submits a task and waits for the result. The system is modeled as an M/M/1 queue with arrival rate $\lambda$ and service rate $\mu$ (tasks per hour).

[Established theory: M/M/1 queue, Kleinrock (1975)]

The expected time in system is $W = 1/(\mu - \lambda)$, requiring $\mu > \lambda$ for stability.

The **total cost rate** (dollars per hour) is:

$$C_{\text{int}}(\mu) = c_s(\mu) \cdot \lambda + c_w \cdot \lambda \cdot W(\mu)$$

where $c_s(\mu)$ is the expected token cost per task at service rate $\mu$, and $\lambda \cdot W(\mu)$ is the expected number of tasks in system (by Little's Law: $L = \lambda W$), with each in-system task incurring developer waiting cost $c_w$ per hour.

More precisely, modeling the service cost as $c_s \cdot \mu$ (cost per unit of service rate capacity) and waiting cost as $c_w \cdot L$:

$$C_{\text{int}}(\mu) = c_s \cdot \mu + c_w \cdot \frac{\lambda}{\mu - \lambda}$$

**Theorem 3 (Optimal interactive service rate).** The service rate minimizing $C_{\text{int}}(\mu)$ for $\mu > \lambda$ is:

$$\mu^* = \lambda + \sqrt{\frac{c_w \cdot \lambda}{c_s}}$$

[Established result: Kleinrock (1975); Hillier and Lieberman (2021)]

*Proof.* Differentiate and set to zero:

$$\frac{dC_{\text{int}}}{d\mu} = c_s - \frac{c_w \cdot \lambda}{(\mu - \lambda)^2} = 0$$

$$(\mu - \lambda)^2 = \frac{c_w \cdot \lambda}{c_s}$$

$$\mu^* - \lambda = \sqrt{\frac{c_w \cdot \lambda}{c_s}}$$

The second derivative $d^2C/d\mu^2 = 2 c_w \lambda / (\mu - \lambda)^3 > 0$ confirms this is a minimum. $\square$

**Corollary 1 (High-cost developer regime).** As $c_w \to \infty$ (very expensive developer), $\mu^* \to \infty$: the optimal strategy uses arbitrarily fast (and expensive) service. As $c_w \to 0$ (no waiting cost), $\mu^* \to \lambda$: the optimal strategy provides just enough capacity to keep up with demand.

**Corollary 2 (Optimal total cost).** The minimum total cost rate is:

$$C_{\text{int}}^* = c_s \cdot \lambda + 2\sqrt{c_w \cdot c_s \cdot \lambda}$$

*Proof.* Substitute $\mu^* = \lambda + \sqrt{c_w \lambda / c_s}$:

$$C_{\text{int}}^* = c_s \left(\lambda + \sqrt{\frac{c_w \lambda}{c_s}}\right) + c_w \cdot \frac{\lambda}{\sqrt{c_w \lambda / c_s}}$$

$$= c_s \lambda + c_s \sqrt{\frac{c_w \lambda}{c_s}} + c_w \lambda \cdot \sqrt{\frac{c_s}{c_w \lambda}}$$

$$= c_s \lambda + \sqrt{c_w c_s \lambda} + \sqrt{c_w c_s \lambda}$$

$$= c_s \lambda + 2\sqrt{c_w c_s \lambda} \quad \square$$

### 4.3 Autonomous Regime (Developer Not Waiting)

**Definition 8 (Autonomous regime).** In the autonomous regime (CI/CD pipelines, batch processing, overnight runs), no developer waits for results. The total cost rate is:

$$C_{\text{aut}}(\mu) = c_s \cdot \mu$$

**Proposition 4 (Optimal autonomous service rate).** In the autonomous regime, the cost-minimizing strategy is to use the cheapest model meeting the quality floor, at the minimum service rate ensuring throughput matches demand: $\mu = \lambda + \epsilon$ for arbitrarily small $\epsilon > 0$.

*Proof.* $C_{\text{aut}}$ is monotonically increasing in $\mu$, so the minimum cost is achieved at the smallest feasible $\mu$. Stability requires $\mu > \lambda$, so the optimal $\mu^* = \lambda + \epsilon$. Within this constraint, minimize $c_s$ by choosing the cheapest model. $\square$

### 4.4 Regime Switching

**Definition 9 (Regime indicator).** Let $\delta \in \{0, 1\}$ be a binary state variable: $\delta = 1$ when a developer is actively waiting for the result (interactive), $\delta = 0$ otherwise (autonomous).

The **unified cost function** is:

$$C(\mu, \delta) = c_s \cdot \mu + \delta \cdot c_w \cdot \frac{\lambda}{\mu - \lambda}$$

**Theorem 4 (Regime-dependent optimal service rate).** The optimal service rate is:

$$\mu^*(\delta) = \begin{cases} \lambda + \sqrt{c_w \lambda / c_s} & \text{if } \delta = 1 \text{ (interactive)} \\ \lambda + \epsilon & \text{if } \delta = 0 \text{ (autonomous)} \end{cases}$$

[Novel synthesis: combining the two classical results into a single regime-switching model]

The ratio of interactive to autonomous service rate excess (above $\lambda$) is:

$$\frac{\mu^*_{\text{int}} - \lambda}{\mu^*_{\text{aut}} - \lambda} = \frac{\sqrt{c_w \lambda / c_s}}{\epsilon} \to \infty$$

This demonstrates the qualitative difference between regimes: interactive mode demands service rates far exceeding the arrival rate, while autonomous mode needs only marginal excess capacity.

### 4.5 Worked Example: Interactive vs. Autonomous Economics

**Parameters:**
- Developer hourly rate: $c_w = \$150/\text{hr}$
- Task arrival rate: $\lambda = 12$ tasks/hr (one every 5 minutes)
- Service cost parameter for Sonnet: $c_s^{(S)} = \$0.003$ per unit service rate
- Service cost parameter for Haiku: $c_s^{(H)} = \$0.001$ per unit service rate

**Interactive regime with Sonnet:**

$$\mu^*_S = 12 + \sqrt{\frac{150 \times 12}{0.003}} = 12 + \sqrt{600{,}000} = 12 + 775 = 787 \text{ tasks/hr}$$

This extreme result (requiring 787 tasks/hr capacity for 12 tasks/hr demand) reflects the model's sensitivity to the cost parameters. In practice, $c_s$ should be interpreted as the marginal cost of increasing service rate by one unit, including infrastructure costs. If we recalibrate $c_s$ to the per-task cost level:

With $c_s = \$0.50$ per unit service rate increase per hour (reflecting the cost of provisioning faster infrastructure):

$$\mu^*_S = 12 + \sqrt{\frac{150 \times 12}{0.50}} = 12 + \sqrt{3600} = 12 + 60 = 72 \text{ tasks/hr}$$

Expected waiting time: $W = 1/(72 - 12) = 1/60 \text{ hr} = 1 \text{ minute}$

Total cost rate: $0.50 \times 72 + 150 \times 12/(72 - 12) = \$36 + \$30 = \$66/\text{hr}$

**Autonomous regime with Haiku:**

$$\mu^* = 12 + \epsilon \approx 12 \text{ tasks/hr}$$

Total cost rate: $c_s^{(H)} \times 12 = 0.001 \times 12 = \$0.012/\text{hr}$

**Cost ratio:** Interactive/Autonomous $= 66 / 0.012 = 5{,}500\times$

This enormous ratio (over three orders of magnitude) quantifies why a harness that uses the same model configuration for both regimes is deeply suboptimal.

---

## 5. The c-mu Priority Scheduling Rule

### 5.1 Setup

[Established theory: Cox and Smith (1961); Van Mieghem (1995)]

**Definition 10 (Two-class queueing system).** Consider a single server processing two classes of tasks:

- **Class 1 (Interactive):** Arrival rate $\lambda_1$, service rate $\mu_1$, waiting cost per unit time $c_1 = c_w$ (developer hourly rate)
- **Class 2 (Autonomous):** Arrival rate $\lambda_2$, service rate $\mu_2$, waiting cost per unit time $c_2 \approx 0$ (no human waiting)

The total traffic intensity is $\rho = \lambda_1/\mu_1 + \lambda_2/\mu_2 < 1$ (stability condition).

### 5.2 The c-mu Rule

**Theorem 5 (c-mu optimality).** In a single-server system with multiple job classes, each with linear holding cost $c_i$ per unit time per job, the scheduling policy that minimizes total expected holding cost serves jobs in decreasing order of $c_i \mu_i$ (waiting cost times service rate).

[Established result: Cox and Smith (1961); see also Pinedo (2016), Scheduling: Theory, Algorithms, and Systems]

*Proof sketch (for two classes).* Under preemptive priority, the expected number of Class i jobs in system depends on the priority ordering. Under Priority 1 > Priority 2:

$$L_1 = \frac{\rho_1}{1 - \rho_1} \quad \text{(unaffected by Class 2)}$$

$$L_2 = \frac{\rho_2}{(1 - \rho_1)(1 - \rho_1 - \rho_2)}$$

Under Priority 2 > Priority 1, the formulas swap. The total weighted holding cost is $c_1 L_1 + c_2 L_2$.

Priority 1 > Priority 2 is optimal when:

$$c_1 L_1^{(1>2)} + c_2 L_2^{(1>2)} \leq c_1 L_1^{(2>1)} + c_2 L_2^{(2>1)}$$

By algebraic manipulation (see Van Mieghem, 1995), this reduces to $c_1 \mu_1 \geq c_2 \mu_2$. $\square$

### 5.3 Application to Harness Scheduling

**Proposition 5 (Interactive tasks always have priority).** In a mixed workload with interactive ($\delta = 1$, $c_1 = c_w$) and autonomous ($\delta = 0$, $c_2 \approx 0$) tasks, the c-mu rule yields:

$$c_1 \mu_1 \gg c_2 \mu_2$$

since $c_1 / c_2 \to \infty$. Therefore, interactive tasks should always receive priority, regardless of their service rates.

[Novel application: mapping the c-mu rule to AI harness scheduling]

**Corollary 3 (Model assignment under priority scheduling).** The optimal combined strategy is:

- **Interactive tasks:** Assign to the fastest capable model (maximizing $\mu$) to minimize developer waiting time. Use the priority queue position to ensure immediate service.
- **Autonomous tasks:** Assign to the cheapest capable model (minimizing $c_s$). These tasks are served only when no interactive tasks are waiting.

### 5.4 Cost Savings from Priority Scheduling

**Proposition 6 (Value of priority scheduling).** Compared to FIFO (first-in-first-out) scheduling that treats all tasks equally, priority scheduling reduces total holding cost by:

$$\Delta C = c_w \cdot \lambda_1 \cdot \left(\frac{\rho_2}{\mu_2(1-\rho)(1-\rho_1)} \right)$$

[Novel derivation for this application]

*Derivation.* Under FIFO, Class 1 jobs experience waiting from both Class 1 and Class 2 jobs ahead of them. Under priority, Class 1 jobs only wait behind other Class 1 jobs. The difference in Class 1 expected sojourn time is the expected waiting due to Class 2 work in progress. Multiplying by $c_w \lambda_1$ gives the holding cost savings. $\square$

**Worked example.** Consider:
- $\lambda_1 = 6$ interactive tasks/hr, $\mu_1 = 20$ tasks/hr ($\rho_1 = 0.30$)
- $\lambda_2 = 10$ autonomous tasks/hr, $\mu_2 = 15$ tasks/hr ($\rho_2 = 0.67$)
- $\rho = 0.97$ (heavily loaded system)
- $c_w = \$150$/hr

Under FIFO, expected waiting for interactive tasks is heavily inflated by the autonomous task backlog. Under priority scheduling, interactive tasks see only $\rho_1 = 0.30$ utilization and experience minimal waits. The approximate savings:

$$\Delta C \approx 150 \times 6 \times \frac{0.67}{15 \times 0.03 \times 0.70} = 150 \times 6 \times \frac{0.67}{0.315} = 150 \times 6 \times 2.13 = \$1{,}914/\text{hr}$$

At organizational scale (8 working hours), this is approximately \$15,300 per day in recovered developer productivity.

---

## 6. The Latency-Cost-Quality Trilemma

### 6.1 Effective Token Price

**Definition 11 (Effective token price).** When a developer is blocking on the result, the total cost of a token includes both its direct price and the developer time consumed in generating it. The effective price per token for model $m$ in the interactive regime is:

$$p_m^{\text{eff}} = p_m + \frac{c_w}{s_m}$$

where $s_m$ is the model's generation speed (tokens per second) and $c_w$ is the developer's cost per second.

[Novel formulation]

*Derivation.* Each token costs $p_m$ to purchase and takes $1/s_m$ seconds to generate. During that $1/s_m$ seconds, the blocked developer costs $c_w / s_m$. Total per-token cost: $p_m + c_w/s_m$. $\square$

### 6.2 Model Reranking Under Effective Price

**Theorem 6 (Effective price reranking).** Let models $m_1, m_2$ have $p_{m_1} > p_{m_2}$ (model 1 is more expensive per token) but $s_{m_1} > s_{m_2}$ (model 1 is faster). There exists a crossover developer rate $c_w^*$ above which model 1 has a lower effective price:

$$c_w^* = \frac{(p_{m_1} - p_{m_2}) \cdot s_{m_1} \cdot s_{m_2}}{s_{m_1} - s_{m_2}}$$

For $c_w > c_w^*$, $p_{m_1}^{\text{eff}} < p_{m_2}^{\text{eff}}$, and the expensive model becomes the cheaper choice.

[Novel result]

*Proof.* Set $p_{m_1}^{\text{eff}} = p_{m_2}^{\text{eff}}$:

$$p_{m_1} + \frac{c_w}{s_{m_1}} = p_{m_2} + \frac{c_w}{s_{m_2}}$$

$$c_w \left(\frac{1}{s_{m_1}} - \frac{1}{s_{m_2}}\right) = p_{m_2} - p_{m_1}$$

Since $s_{m_1} > s_{m_2}$, the left side is negative, and $p_{m_2} - p_{m_1} < 0$, so:

$$c_w \cdot \frac{s_{m_2} - s_{m_1}}{s_{m_1} s_{m_2}} = p_{m_2} - p_{m_1}$$

$$c_w^* = \frac{(p_{m_1} - p_{m_2}) \cdot s_{m_1} \cdot s_{m_2}}{s_{m_1} - s_{m_2}} \quad \square$$

**Worked example.** Compare:
- Haiku: $p_H = \$1.00/\text{MTok}$, $s_H = 200$ tok/s
- Opus: $p_O = \$5.00/\text{MTok}$, $s_O = 80$ tok/s
- Sonnet: $p_S = \$3.00/\text{MTok}$, $s_S = 150$ tok/s

Convert $c_w$ from $/hr to $/sec: at \$150/hr, $c_w = \$0.0417/\text{sec}$.

Effective prices at $c_w = \$150/\text{hr} = \$0.0417/\text{sec}$:

- Haiku: $p_H^{\text{eff}} = 1.00 + 0.0417 \times 10^6 / 200 = 1.00 + 208.50 = \$209.50/\text{MTok}$
- Sonnet: $p_S^{\text{eff}} = 3.00 + 0.0417 \times 10^6 / 150 = 3.00 + 278.00 = \$281.00/\text{MTok}$
- Opus: $p_O^{\text{eff}} = 5.00 + 0.0417 \times 10^6 / 80 = 5.00 + 521.25 = \$526.25/\text{MTok}$

In this case, developer waiting cost utterly dominates token cost (by a factor of 100x-200x), and Haiku's speed advantage makes it the cheapest effective option for all tasks where its capability suffices. The direct token price difference (\$1 vs. \$5) is irrelevant compared to the waiting cost difference (\$208 vs. \$521).

**Crossover rate** for Haiku vs. Sonnet (where Sonnet becomes cheaper on effective price despite being 3x more expensive per token):

This only occurs when Sonnet is faster than Haiku, which it is not in this example. When the expensive model is both slower and pricier, no crossover exists in the interactive regime; the cheap fast model always wins on effective price.

**The practical implication:** In the interactive regime, model selection should minimize $p_m^{\text{eff}} = p_m + c_w/s_m$, not $p_m$ alone. For developers at typical rates (\$80-\$200/hr), the speed term $c_w/s_m$ dominates the token cost term $p_m$ by one to two orders of magnitude. This formally justifies the intuition that "fast beats cheap" for interactive use.

### 6.3 The Quality-Adjusted Effective Price

When models differ in both speed and quality, the effective price must account for retries due to quality failures.

**Definition 12 (Quality-adjusted effective price).** Let $q_m$ be the probability that model $m$ produces a correct result on the first attempt. The expected number of attempts is $1/q_m$ (geometric distribution). The quality-adjusted effective price is:

$$\hat{p}_m^{\text{eff}} = \frac{p_m + c_w/s_m}{q_m} = \frac{p_m^{\text{eff}}}{q_m}$$

[Novel formulation]

**Theorem 7 (Quality-speed-cost crossover).** Model $m_1$ is preferred over $m_2$ (lower quality-adjusted effective price) when:

$$\frac{p_{m_1} + c_w / s_{m_1}}{q_{m_1}} < \frac{p_{m_2} + c_w / s_{m_2}}{q_{m_2}}$$

This creates a three-way crossover surface in the $(c_w, q, s)$ space.

**Worked example with quality adjustment:**

- Haiku: $p_H = \$1.00$, $s_H = 200$ tok/s, $q_H = 0.65$ (65% first-attempt success)
- Sonnet: $p_S = \$3.00$, $s_S = 150$ tok/s, $q_S = 0.85$
- Opus: $p_O = \$5.00$, $s_O = 80$ tok/s, $q_O = 0.95$

At $c_w = \$150$/hr:

- Haiku: $\hat{p}_H^{\text{eff}} = 209.50 / 0.65 = \$322.31/\text{MTok}$
- Sonnet: $\hat{p}_S^{\text{eff}} = 281.00 / 0.85 = \$330.59/\text{MTok}$
- Opus: $\hat{p}_O^{\text{eff}} = 526.25 / 0.95 = \$554.00/\text{MTok}$

With quality adjustment, Haiku still wins slightly over Sonnet in this parameterization, but the gap narrows from $209.50 vs. $281.00 (25% cheaper) to $322.31 vs. $330.59 (2.5% cheaper). If Haiku's first-attempt success rate drops below about 63%, Sonnet becomes the cheaper effective option.

In the autonomous regime ($c_w = 0$):

- Haiku: $\hat{p}_H^{\text{eff}} = 1.00 / 0.65 = \$1.54/\text{MTok}$
- Sonnet: $\hat{p}_S^{\text{eff}} = 3.00 / 0.85 = \$3.53/\text{MTok}$
- Opus: $\hat{p}_O^{\text{eff}} = 5.00 / 0.95 = \$5.26/\text{MTok}$

Now Haiku wins decisively (cheapest by 2.3x), confirming that in autonomous mode, the cheapest model dominates whenever it meets the quality floor.

---

## 7. The Caching Economics Model

### 7.1 Setup

[Established technology: Anthropic (2026), OpenAI (2025), Google (2025); Novel formalization]

**Definition 13 (Cached pricing model).** For a model with base input price $p$ (per token), prompt caching introduces a three-tier pricing structure:

- **Cache write:** $p_w = \alpha_w \cdot p$ where $\alpha_w \geq 1$ is the write premium factor (e.g., $\alpha_w = 1.25$ for Anthropic's 5-minute TTL)
- **Cache read:** $p_r = \alpha_r \cdot p$ where $0 < \alpha_r < 1$ is the read discount factor (e.g., $\alpha_r = 0.10$ for Anthropic, giving a 90% discount)
- **Uncached input:** $p$ (base price)

### 7.2 Effective Cost Per Token with Caching

**Definition 14 (Static prefix fraction).** Let $\phi \in [0, 1]$ be the fraction of the prompt that is static across turns (system prompt, tool definitions, project context). The remaining $1 - \phi$ fraction is dynamic (user input, tool results, conversation history).

**Proposition 7 (Effective cost with caching).** In a multi-turn interaction with $T$ turns, each with $N$ total input tokens, the effective cost per input token is:

$$p^{\text{eff}} = \frac{\phi \cdot (p_w + (T-1) \cdot p_r)}{T} + (1 - \phi) \cdot p$$

For large $T$, this converges to:

$$p^{\text{eff}} \approx \phi \cdot p_r + (1 - \phi) \cdot p = p \cdot (\phi \cdot \alpha_r + 1 - \phi) = p \cdot (1 - \phi(1 - \alpha_r))$$

[Novel derivation]

*Proof.* In the first turn, the static prefix ($\phi N$ tokens) is written to cache at cost $p_w \cdot \phi N$. In each subsequent turn $t = 2, \ldots, T$, the static prefix is read from cache at cost $p_r \cdot \phi N$. The dynamic portion ($(1-\phi)N$ tokens) is always charged at full price $p$. Total cost:

$$C = \phi N \cdot p_w + (T-1) \cdot \phi N \cdot p_r + T \cdot (1-\phi) N \cdot p$$

Per-token average:

$$p^{\text{eff}} = \frac{C}{T \cdot N} = \frac{\phi(p_w + (T-1)p_r)}{T} + (1-\phi)p$$

As $T \to \infty$, $p_w/T \to 0$ and $(T-1)/T \to 1$, giving $p^{\text{eff}} \to \phi \cdot p_r + (1-\phi) \cdot p$. $\square$

### 7.3 The Caching Discount Factor

**Definition 15 (Caching discount factor).** The overall cost reduction from caching is:

$$\Delta = 1 - \frac{p^{\text{eff}}}{p} = \phi(1 - \alpha_r)$$

This is linear in $\phi$ and $(1 - \alpha_r)$.

**Worked example.** With Anthropic's pricing ($\alpha_r = 0.10$, so $1 - \alpha_r = 0.90$):

| Static fraction $\phi$ | Discount $\Delta$ | Effective price (Opus, $p = \$5$) |
|------------------------|-------------------|-----------------------------------|
| 0.20 | 18% | $4.10/MTok |
| 0.50 | 45% | $2.75/MTok |
| 0.80 | 72% | $1.40/MTok |
| 0.92 (Claude Code) | 83% | $0.87/MTok |

At $\phi = 0.92$ (Claude Code's empirical cache hit rate), Opus's effective input cost drops from $\$5.00$ to $\$0.87$/MTok, making it cheaper than Sonnet's uncached price (\$3.00). This demonstrates that prompt structure is as important as model selection for cost optimization.

### 7.4 Optimal Prompt Structure

**Proposition 8 (Caching makes prompt restructuring a first-order cost lever).** The marginal cost reduction from increasing $\phi$ by $\Delta\phi$ (moving $\Delta\phi \cdot N$ tokens from dynamic to static) is:

$$\frac{d p^{\text{eff}}}{d\phi} = -p(1 - \alpha_r)$$

For Anthropic ($\alpha_r = 0.10$): each 1% increase in static prefix fraction reduces effective price by $0.9\%$ of the base price.

[Novel observation formalized]

*Implication.* Consider two prompt designs for the same task:

- **Design A:** $\phi = 0.50$ (half the prompt is static)
- **Design B:** $\phi = 0.80$ (restructured to push dynamic content to the end)

The cost ratio is:

$$\frac{p^{\text{eff}}_A}{p^{\text{eff}}_B} = \frac{1 - 0.50 \times 0.90}{1 - 0.80 \times 0.90} = \frac{0.55}{0.28} = 1.96$$

Design A costs nearly 2x Design B. This is achievable through pure prompt engineering (no model change, no quality loss) by placing static content at the beginning and dynamic content at the end.

### 7.5 Caching and Model Selection Interaction

**Theorem 8 (Caching inverts model cost ordering).** Let models $m_1$ (expensive) and $m_2$ (cheap) have base prices $p_{m_1} > p_{m_2}$ and cache read factors $\alpha_r^{(1)}, \alpha_r^{(2)}$. There exists a static prefix fraction $\phi^*$ above which $m_1$'s effective price is lower than $m_2$'s uncached price:

$$\phi^* = \frac{p_{m_1} - p_{m_2}}{p_{m_1}(1 - \alpha_r^{(1)})}$$

provided $\phi^* \leq 1$ (i.e., $p_{m_2} \geq p_{m_1} \cdot \alpha_r^{(1)}$).

[Novel result]

*Proof.* Set $p_{m_1}^{\text{eff}}(\phi) = p_{m_2}$:

$$p_{m_1}(1 - \phi(1 - \alpha_r^{(1)})) = p_{m_2}$$

$$\phi^* = \frac{p_{m_1} - p_{m_2}}{p_{m_1}(1 - \alpha_r^{(1)})} \quad \square$$

**Worked example.** Opus ($p_{m_1} = \$5.00$, $\alpha_r = 0.10$) vs. Sonnet ($p_{m_2} = \$3.00$, uncached):

$$\phi^* = \frac{5.00 - 3.00}{5.00 \times 0.90} = \frac{2.00}{4.50} = 0.444$$

When more than 44.4% of the prompt is cacheable, Opus with caching is cheaper per input token than Sonnet without caching. Since well-structured agent prompts routinely achieve $\phi > 0.80$, this threshold is easily met. Combined with Opus's superior quality, this creates a strong economic argument for using the frontier model with good prompt caching rather than a mid-tier model without caching.

---

## 8. Integration: The Full Economic Optimization

### 8.1 The Master Cost Function

Combining all preceding elements, the full cost function for a harness processing task $t$ with regime indicator $\delta$ is:

**Definition 16 (Master cost function).**

$$\mathcal{C}(\sigma, \mathbf{r}, \delta) = \sum_{k=1}^{K} p_{\sigma(k)}^{\text{eff}}(\phi_k) \cdot r_k + \delta \cdot c_w \cdot W(\sigma, \mathbf{r})$$

where:
- $p_{\sigma(k)}^{\text{eff}}(\phi_k) = p_{\sigma(k)} \cdot (1 - \phi_k(1 - \alpha_r^{(\sigma(k))}))$ is the cache-adjusted effective price
- $W(\sigma, \mathbf{r})$ is the expected wall-clock time, which depends on model speeds and token counts

The full optimization is:

$$\min_{\sigma, \mathbf{r}} \; \mathcal{C}(\sigma, \mathbf{r}, \delta) \quad \text{subject to} \quad Q(\sigma, \mathbf{r}) \geq Q_{\min}, \;\; c_{\sigma(k)} \geq c_k^{\min} \;\; \forall k$$

### 8.2 Regime-Specific Simplifications

**Interactive regime** ($\delta = 1$): The waiting cost term dominates. The optimization effectively becomes: choose the fastest models that meet capability requirements, then allocate tokens to maximize quality within the total time budget. Token cost is secondary.

**Autonomous regime** ($\delta = 0$): The waiting cost term vanishes. The optimization reduces to the JASP (Section 3): choose the cheapest models meeting capability requirements, then allocate tokens to maximize quality within the financial budget.

**Proposition 9 (Regime determines optimization structure).** The interactive and autonomous regimes produce qualitatively different optimal solutions:

| Dimension | Interactive ($\delta = 1$) | Autonomous ($\delta = 0$) |
|-----------|---------------------------|---------------------------|
| Primary objective | Minimize $W$ (wall-clock time) | Minimize $C$ (token cost) |
| Model preference | Fastest capable model | Cheapest capable model |
| Token allocation | Minimize tokens (reduce latency) | Maximize quality per dollar |
| Caching strategy | Maximize $\phi$ (reduce TTFT) | Batch API (50% discount) |
| Scheduling priority | Highest | Lowest |

[Novel synthesis]

---

## 9. Summary of Formal Results

| # | Result | Type | Status |
|---|--------|------|--------|
| 1 | MTSP as GAP variant (Prop. 1) | Structural | Novel application |
| 2 | MTSP is NP-hard (Thm. 1) | Complexity | Established (via reduction) |
| 3 | Small-instance tractability via enumeration (Prop. 2) | Algorithmic | Novel observation |
| 4 | JASP decomposition into outer combinatorial + inner convex (Thm. 2) | Structural | Novel synthesis |
| 5 | KKT optimality for inner TBAP (Prop. 3) | Optimality | Established theory, novel application |
| 6 | Optimal interactive service rate $\mu^* = \lambda + \sqrt{c_w\lambda/c_s}$ (Thm. 3) | Optimality | Established (Kleinrock) |
| 7 | Regime-dependent optimal service rate (Thm. 4) | Optimality | Novel synthesis |
| 8 | c-mu priority rule for mixed workloads (Thm. 5) | Optimality | Established (Cox, Smith) |
| 9 | Cost savings from priority scheduling (Prop. 6) | Quantitative | Novel derivation |
| 10 | Effective token price with developer waiting (Def. 11) | Definition | Novel formulation |
| 11 | Effective price reranking and crossover rate (Thm. 6) | Structural | Novel result |
| 12 | Quality-adjusted effective price (Thm. 7) | Structural | Novel result |
| 13 | Caching discount factor (Props. 7-8) | Quantitative | Novel formalization |
| 14 | Caching inverts model cost ordering (Thm. 8) | Structural | Novel result |
| 15 | Regime determines optimization structure (Prop. 9) | Qualitative | Novel synthesis |

**Established foundations cited:** Generalized Assignment Problem (Chekuri and Khanna, 2005), M/M/1 queueing cost optimization (Kleinrock, 1975), c-mu priority rule (Cox and Smith, 1961; Van Mieghem, 1995), KKT conditions (Boyd and Vandenberghe, 2004), Little's Law (Little, 1961).

**Novel contributions:** The JASP decomposition theorem, the effective token price formulation incorporating developer waiting cost, the crossover analysis for model reranking, the caching discount formalization, and the regime-switching framework that unifies interactive and autonomous economics into a single model.

---

## 10. References

### Queueing Theory and Service Economics
- Kleinrock, L. (1975). *Queueing Systems, Vol. 1: Theory*. Wiley.
- Kleinrock, L. (1976). *Queueing Systems, Vol. 2: Computer Applications*. Wiley.
- Cox, D.R. and Smith, W.L. (1961). *Queues*. Methuen.
- Van Mieghem, J.A. (1995). Dynamic scheduling with convex delay costs. *Annals of Applied Probability*, 5(3), 809-833.
- Little, J.D.C. (1961). A proof for the queuing formula: L = lambda W. *Operations Research*, 9(3), 383-387.
- Hillier, F.S. and Lieberman, G.J. (2021). *Introduction to Operations Research*, 11th ed. McGraw-Hill.
- Pinedo, M.L. (2016). *Scheduling: Theory, Algorithms, and Systems*, 5th ed. Springer.

### Optimization and Assignment
- Boyd, S. and Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press.
- Chekuri, C. and Khanna, S. (2005). A polynomial time approximation scheme for the multiple knapsack problem. *SIAM Journal on Computing*, 35(3), 713-728.
- Nemhauser, G.L., Wolsey, L.A., and Fisher, M.L. (1978). An analysis of approximations for maximizing submodular set functions. *Mathematical Programming*, 14, 265-294.

### LLM Economics and Routing
- Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance. *arXiv:2305.05176*.
- Ong, I. et al. (2025). RouteLLM: Learning to Route LLMs with Preference Data. *ICLR 2025*.
- Madaan, A. et al. (2024). AutoMix: Automatically Mixing Language Models. *NeurIPS 2024*.
- Lumer, E. et al. (2026). Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks. *arXiv:2601.06007*.

### Pricing Data
- Anthropic. (2026). Claude API Pricing. https://platform.claude.com/docs/en/about-claude/pricing
- OpenAI. (2026). API Pricing. https://openai.com/api/pricing/
- Google. (2026). Gemini API Pricing. https://ai.google.dev/gemini-api/docs/pricing
- TokenCost. (2026). AI Price Index: LLM Costs Dropped 300x (2023-2026). https://tokencost.app/blog/ai-price-index

### Developer Productivity
- Mark, G., Gudith, D., and Klocke, U. (2008). The Cost of Interrupted Work: More Speed and Stress. *CHI 2008 Proceedings*, 107-110.
- Leroy, S. (2009). Why Is It So Hard to Do My Work? *Organizational Behavior and Human Decision Processes*, 109(2), 168-181.
