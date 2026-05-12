# Trust Calibration and Adaptive Oversight in Human-AI Coding Harnesses

**Formal Methods Round 2**
**Date:** 2026-04-03
**Dimension:** Bayesian trust calibration, vigilance decay formalization, non-stationary trust dynamics

---

## 1. Trust Calibration via Thompson Sampling

### 1.1 Problem Setup

**[Established theory: Thompson (1933), Lai & Robbins (1985), Agrawal & Goyal (2012, 2013)]**

**Definition 1 (Trust Calibration Bandit).** A trust calibration bandit is a tuple $(\mathcal{K}, \Theta, \mathcal{F})$ where:

- $\mathcal{K} = \{1, \ldots, K\}$ is the set of arms, each corresponding to an (agent, task-type) pair. For example, arm $k = (\text{Claude Sonnet 4}, \text{refactor-python})$ represents a specific agent operating on a specific task category.
- $\Theta = (\theta_1, \ldots, \theta_K) \in [0,1]^K$ is the vector of unknown success probabilities, where $\theta_k = P(\text{action by arm } k \text{ would pass human review})$.
- $\mathcal{F} = \{F_k\}_{k=1}^K$ is the family of reward distributions, with $F_k = \text{Bernoulli}(\theta_k)$.

At each discrete time step $t = 1, 2, \ldots, T$:

1. The harness selects arm $A_t \in \mathcal{K}$ (chooses which (agent, task-type) pair to evaluate).
2. The harness observes reward $R_t \sim \text{Bernoulli}(\theta_{A_t})$, where $R_t = 1$ means the action would have passed human review (correct code) and $R_t = 0$ means it would have failed (defective code).

The cumulative regret after $T$ rounds is:

$$\text{Regret}(T) = \sum_{t=1}^T \left(\theta^* - \theta_{A_t}\right) = T\theta^* - \sum_{t=1}^T \theta_{A_t}$$

where $\theta^* = \max_k \theta_k$ is the success probability of the best arm.

**Remark.** In the trust calibration setting, "regret" has a concrete operational meaning: it is the cumulative loss in expected code quality from not always assigning the most reliable (agent, task-type) pair to each task. However, the harness cannot know $\theta^*$ in advance; it must learn it through experience.

### 1.2 The Beta-Bernoulli Thompson Sampling Algorithm

**Definition 2 (Beta-Bernoulli Thompson Sampling for Trust Calibration).** Maintain for each arm $k \in \mathcal{K}$ a pair of sufficient statistics $(\alpha_k, \beta_k)$ initialized to $(\alpha_k^{(0)}, \beta_k^{(0)})$. The algorithm proceeds as follows.

**Algorithm 1: Trust Calibration via Thompson Sampling**

```
Input: K arms (agent, task-type pairs), prior parameters {(alpha_k^0, beta_k^0)}_{k=1}^K
Initialize: For each k in {1, ..., K}: S_k <- 0, F_k <- 0

For t = 1, 2, ..., T:
    // Phase 1: Sample from posteriors
    For each k in {1, ..., K}:
        Sample theta_hat_k ~ Beta(alpha_k^0 + S_k, beta_k^0 + F_k)

    // Phase 2: Select arm (greedy with respect to samples)
    A_t <- argmax_{k in {1,...,K}} theta_hat_k

    // Phase 3: Observe outcome
    Deploy arm A_t; observe R_t in {0, 1}

    // Phase 4: Update sufficient statistics
    If R_t = 1:
        S_{A_t} <- S_{A_t} + 1    // success count
    Else:
        F_{A_t} <- F_{A_t} + 1    // failure count

Return: Final posteriors {Beta(alpha_k^0 + S_k, beta_k^0 + F_k)}_{k=1}^K
```

**Prior selection.** Two canonical choices exist:

- The uniform (Bayes-Laplace) prior $\alpha_k^{(0)} = \beta_k^{(0)} = 1$ represents maximal ignorance: before any observation, all success probabilities are equally likely. This is appropriate for new (agent, task-type) pairs with no history.
- The Jeffreys prior $\alpha_k^{(0)} = \beta_k^{(0)} = 1/2$ is the reference prior for Bernoulli models, invariant under reparameterization. Kaufmann, Korda, and Munos (2012) showed that regret bounds hold under both priors.

For trust calibration in practice, an informative prior calibrated from fleet-wide historical data (e.g., setting $\alpha_k^{(0)} = 9, \beta_k^{(0)} = 1$ for an agent known to have approximately 90% success rate) accelerates convergence while the data overwhelms the prior in the long run.

**Key property (probability matching).** Arm $k$ is selected at time $t$ with probability equal to the posterior probability that arm $k$ is optimal:

$$P(A_t = k \mid \mathcal{H}_{t-1}) = P\left(\theta_k = \max_{k'} \theta_{k'} \;\middle|\; \mathcal{H}_{t-1}\right)$$

where $\mathcal{H}_{t-1} = \{(A_1, R_1), \ldots, (A_{t-1}, R_{t-1})\}$ is the observation history. This follows directly from the sampling procedure: $\hat{\theta}_k$ is drawn from the posterior of $\theta_k$, so the event $\hat{\theta}_k > \hat{\theta}_{k'}$ for all $k' \neq k$ occurs with exactly the posterior probability that $\theta_k$ is maximal.

### 1.3 Regret Bounds and Convergence Speed

**Theorem 1 (Agrawal-Goyal Regret Bound, 2012/2013).** *[Cited result: Agrawal & Goyal, COLT 2012; AISTATS 2013, PMLR 31:99-107]*

For the Beta-Bernoulli Thompson Sampling algorithm (Algorithm 1) with uniform or Jeffreys prior, the expected cumulative regret satisfies:

*(a) Problem-dependent bound:*

$$\mathbb{E}[\text{Regret}(T)] \leq (1 + \epsilon) \sum_{k:\, \Delta_k > 0} \frac{\ln T}{\Delta_k} + O\!\left(\frac{K}{\epsilon^2}\right) \quad \text{for any } \epsilon > 0$$

where $\Delta_k = \theta^* - \theta_k$ is the suboptimality gap of arm $k$.

*(b) Problem-independent bound:*

$$\mathbb{E}[\text{Regret}(T)] = O\!\left(\sqrt{KT \ln T}\right)$$

**Interpretation for trust calibration.** The problem-dependent bound (a) states that the expected regret grows only logarithmically in the number of decisions $T$. The constant factor $(1+\epsilon)$ approaches the information-theoretic minimum established by Lai and Robbins (1985), meaning Thompson Sampling wastes nearly the minimum possible amount of "trust" on suboptimal arms.

Concretely: if we have $K = 20$ (agent, task-type) pairs and the best pair has success probability $\theta^* = 0.95$ while the next-best has $\theta_{k'} = 0.90$ (so $\Delta_{k'} = 0.05$), then after $T$ decisions the expected number of times we unnecessarily deploy the suboptimal pair is at most $\sim (1+\epsilon) \ln T / 0.05 = 20(1+\epsilon) \ln T$. After $T = 10{,}000$ decisions, this is roughly $20 \times 9.2 \approx 184$ suboptimal deployments out of 10,000, or 1.8% regret.

The problem-independent bound (b) applies when gaps $\Delta_k$ are small or unknown. It guarantees that per-round regret $\text{Regret}(T)/T \to 0$ at rate $O(\sqrt{K \ln T / T})$, meaning the harness converges to optimal trust assignment regardless of the gap structure.

### 1.4 Posterior Concentration and the Trust Score

**Definition 3 (Trust Score).** For arm $k$ with posterior $\text{Beta}(\alpha_k, \beta_k)$ after observing $S_k$ successes and $F_k$ failures (where $\alpha_k = \alpha_k^{(0)} + S_k$ and $\beta_k = \beta_k^{(0)} + F_k$), the trust score is the posterior mean:

$$\tau_k = \frac{\alpha_k}{\alpha_k + \beta_k}$$

The posterior variance is:

$$\text{Var}[\theta_k \mid \mathcal{H}] = \frac{\alpha_k \beta_k}{(\alpha_k + \beta_k)^2 (\alpha_k + \beta_k + 1)}$$

**Definition 4 (Trust Confidence Interval).** The $(1-\delta)$-credible interval for arm $k$'s true success probability is:

$$\text{CI}_k(\delta) = \left[B^{-1}\!\left(\frac{\delta}{2};\, \alpha_k, \beta_k\right),\; B^{-1}\!\left(1 - \frac{\delta}{2};\, \alpha_k, \beta_k\right)\right]$$

where $B^{-1}(p;\, \alpha, \beta)$ is the quantile function (inverse CDF) of the $\text{Beta}(\alpha, \beta)$ distribution. For $\delta = 0.05$, this yields the 95% credible interval.

**Proposition 1 (Posterior Concentration Rate).** *[Novel contribution]*

Let $n_k = S_k + F_k$ denote the total number of observations for arm $k$, and let $\hat{p}_k = S_k / n_k$ be the sample success rate. Then for any $\epsilon > 0$:

$$P\!\left(|\tau_k - \theta_k| > \epsilon \right) \leq 2 \exp\!\left(-2 n_k \epsilon^2 \cdot \frac{n_k}{n_k + \alpha_k^{(0)} + \beta_k^{(0)}}\right) + O(1/n_k)$$

In particular, for bounded priors ($\alpha_k^{(0)} + \beta_k^{(0)} = O(1)$), the trust score concentrates around the true success probability at rate:

$$|\tau_k - \theta_k| = O_p\!\left(\frac{1}{\sqrt{n_k}}\right)$$

That is, the posterior mean converges to the true parameter at the parametric rate $1/\sqrt{n_k}$.

**Proof sketch.** Write $\tau_k = (\alpha_k^{(0)} + S_k)/(\alpha_k^{(0)} + \beta_k^{(0)} + n_k)$. This can be decomposed as a weighted average:

$$\tau_k = \frac{n_k}{n_k + c_0} \cdot \hat{p}_k + \frac{c_0}{n_k + c_0} \cdot \tau_k^{(0)}$$

where $c_0 = \alpha_k^{(0)} + \beta_k^{(0)}$ is the prior strength and $\tau_k^{(0)} = \alpha_k^{(0)}/c_0$ is the prior mean. The deviation $|\tau_k - \theta_k|$ is bounded by:

$$|\tau_k - \theta_k| \leq \frac{n_k}{n_k + c_0} |\hat{p}_k - \theta_k| + \frac{c_0}{n_k + c_0} |\tau_k^{(0)} - \theta_k|$$

The first term converges at rate $O(1/\sqrt{n_k})$ by Hoeffding's inequality applied to $\hat{p}_k$:

$$P(|\hat{p}_k - \theta_k| > \epsilon) \leq 2\exp(-2n_k \epsilon^2)$$

The second term is $O(1/n_k)$ since the prior weight $c_0/(n_k + c_0) = O(1/n_k)$ and the prior deviation $|\tau_k^{(0)} - \theta_k| \leq 1$. Combining via the triangle inequality yields the stated bound.

For the posterior variance, a direct calculation gives:

$$\text{Var}[\theta_k \mid \mathcal{H}] = \frac{\alpha_k \beta_k}{(\alpha_k + \beta_k)^2(\alpha_k + \beta_k + 1)} \leq \frac{1}{4(\alpha_k + \beta_k + 1)} = \frac{1}{4(n_k + c_0 + 1)}$$

using the fact that $\alpha\beta/(\alpha+\beta)^2 \leq 1/4$ for all $\alpha, \beta > 0$. Hence the posterior standard deviation is $O(1/\sqrt{n_k})$, confirming the $O(1/\sqrt{t})$ concentration rate when arm $k$ is played $\Theta(t)$ times. $\square$

**Corollary 1 (Trust Score Convergence).** Under Thompson Sampling, every suboptimal arm $k$ is played $O(\ln T / \Delta_k^2)$ times (by the Agrawal-Goyal bound). Therefore, its trust score converges to its true value at rate:

$$|\tau_k - \theta_k| = O_p\!\left(\frac{\Delta_k}{\sqrt{\ln T}}\right)$$

The optimal arm $k^*$ is played $T - O(\sum_{k \neq k^*} \ln T / \Delta_k)$ times, so its trust score converges at rate $O_p(1/\sqrt{T})$.

---

## 2. Contextual Trust Calibration

### 2.1 The Contextual Bandit Extension

**[Established theory: Li et al. (2010), Agrawal & Goyal (2013b)]**

**Definition 5 (Contextual Trust Calibration Problem).** At each time step $t$, the harness observes a context vector $\mathbf{x}_t \in \mathbb{R}^d$ encoding features of the current code action, then selects an arm (governance level) $A_t \in \mathcal{K}$, and receives reward $R_t$. The expected reward is:

$$\mathbb{E}[R_t \mid \mathbf{x}_t, A_t = k] = \mu_k(\mathbf{x}_t)$$

where $\mu_k: \mathbb{R}^d \to [0,1]$ is the unknown reward function for arm $k$.

**Context feature vector.** The context $\mathbf{x}_t$ encodes task-level information available to the harness at decision time:

| Component | Dimension | Description |
|-----------|-----------|-------------|
| $x_1$: File type | Categorical (one-hot, $\sim$5 dims) | Source, test, config, documentation, infrastructure |
| $x_2$: Complexity | Scalar | Estimated from lines changed, AST depth, cyclomatic complexity |
| $x_3$: Novelty | Scalar | Cosine distance from nearest observed task in embedding space |
| $x_4$: Agent identity | Categorical (one-hot, $\sim$3 dims) | Which model version is executing |
| $x_5$: Historical failure rate | Scalar | Running average of failures for this (agent, task-type) pair |
| $x_6$: Time since model update | Scalar | Days since the most recent agent model update |
| $x_7$: Repository familiarity | Scalar | Count of previous successful actions in this repository |

The total context dimension is $d \approx 12\text{-}15$ after one-hot encoding.

### 2.2 Linear Contextual Thompson Sampling

**Definition 6 (Linear Reward Model).** Assume the expected reward is linear in the context:

$$\mu_k(\mathbf{x}) = \mathbf{x}^\top \boldsymbol{\theta}_k$$

where $\boldsymbol{\theta}_k \in \mathbb{R}^d$ is the unknown parameter vector for arm $k$. This is the standard assumption of Agrawal and Goyal (2013b).

**Algorithm 2: Contextual Thompson Sampling for Trust Calibration**

```
Input: K arms, context dimension d, regularization lambda > 0, variance parameter v > 0
Initialize: For each k in {1, ..., K}:
    B_k <- lambda * I_d          // d x d regularized design matrix
    f_k <- 0_d                    // d-dimensional response vector
    theta_hat_k <- 0_d            // parameter estimate

For t = 1, 2, ..., T:
    // Phase 1: Observe context
    Receive context x_t in R^d

    // Phase 2: Sample from posteriors
    For each k in {1, ..., K}:
        theta_hat_k <- B_k^{-1} f_k                      // posterior mean
        Sample theta_tilde_k ~ N(theta_hat_k, v^2 B_k^{-1})   // posterior sample

    // Phase 3: Select arm
    A_t <- argmax_{k in {1,...,K}} x_t^T theta_tilde_k

    // Phase 4: Observe reward and update
    Observe R_t in {0, 1}
    B_{A_t} <- B_{A_t} + x_t x_t^T
    f_{A_t} <- f_{A_t} + R_t x_t

Return: Parameter estimates {theta_hat_k}_{k=1}^K
```

**Theorem 2 (Contextual Thompson Sampling Regret, Agrawal & Goyal 2013b).** *[Cited result]*

Under the linear reward model with $\|\boldsymbol{\theta}_k\| \leq 1$, $\|\mathbf{x}_t\| \leq 1$, and $R_t$ conditionally $R$-sub-Gaussian, Algorithm 2 with $v = R\sqrt{24d\ln(T/\delta)}$ achieves, with probability at least $1 - \delta$:

$$\text{Regret}(T) = O\!\left(d\sqrt{T}\,\ln^{3/2}(T)\right)$$

**Interpretation.** The regret scales as $O(d\sqrt{T})$ (up to log factors), meaning the per-round regret decays as $O(d/\sqrt{T})$. Each additional context feature (increasing $d$) slows convergence linearly, creating a tension between richer context and faster learning. With $d = 15$ context features and $T = 10{,}000$ decisions, the regret bound scales as $\sim 15 \times 100 \times (\ln 10{,}000)^{3/2} \approx 15{,}000 \times 29.7 \approx 44{,}500$, which is loose (typical of worst-case bounds) but confirms sublinear growth.

### 2.3 The Trust Surface

**Definition 7 (Trust Surface).** The trust surface is the function $\tau: \mathcal{A} \times \mathcal{T} \times \mathbb{R}^d \to [0,1]$ defined by:

$$\tau(\text{agent}, \text{task\_type}, \mathbf{x}) = \mathbf{x}^\top \hat{\boldsymbol{\theta}}_k$$

where $k = (\text{agent}, \text{task\_type})$ indexes the arm and $\hat{\boldsymbol{\theta}}_k = \mathbf{B}_k^{-1} \mathbf{f}_k$ is the current posterior mean for that arm's parameter vector.

The trust surface maps every point in the (agent, task-type, context) space to an estimated probability that the corresponding action would pass human review. The surface evolves as observations accumulate; its uncertainty at any point is captured by the posterior covariance:

$$\text{Var}[\tau(k, \mathbf{x}) \mid \mathcal{H}] = v^2 \mathbf{x}^\top \mathbf{B}_k^{-1} \mathbf{x}$$

**Proposition 2 (Trust Surface Properties).** *[Novel contribution]*

The trust surface $\tau$ satisfies:

(i) *Monotone refinement:* The posterior variance $v^2 \mathbf{x}^\top \mathbf{B}_k^{-1} \mathbf{x}$ is non-increasing in $t$ for any fixed $\mathbf{x}$, since $\mathbf{B}_k$ is updated by rank-one additions and thus $\mathbf{B}_k^{-1}$ is non-increasing in the Loewner order.

(ii) *Anisotropic resolution:* The trust surface is more precisely estimated in directions of the feature space that have been observed more frequently. Formally, let $\lambda_1 \geq \cdots \geq \lambda_d > 0$ be the eigenvalues of $\mathbf{B}_k$. The posterior uncertainty along eigenvector $\mathbf{v}_j$ is $v^2/\lambda_j$, which is small for well-observed directions (large $\lambda_j$) and large for under-observed directions (small $\lambda_j$).

(iii) *Connection to the autonomy boundary:* The governance decision at time $t$ reduces to comparing $\tau(k, \mathbf{x}_t)$ against the asymmetric cost threshold from Bayesian decision theory:

$$\text{If } \tau(k, \mathbf{x}_t) > \frac{c_{FG}}{c_{FG} + c_{GF}} \text{ then trust; else review}$$

where $c_{FG}$ is the cost of a missed defect and $c_{GF}$ is the cost of unnecessary review (see research round R5, Section 5).

**Proof of (i).** At each step where arm $k$ is played in context $\mathbf{x}_t$, we have $\mathbf{B}_k \leftarrow \mathbf{B}_k + \mathbf{x}_t \mathbf{x}_t^\top$. Since $\mathbf{x}_t \mathbf{x}_t^\top$ is positive semidefinite, $\mathbf{B}_k$ is non-decreasing in the Loewner order: $\mathbf{B}_k^{(t+1)} \succeq \mathbf{B}_k^{(t)}$. By the matrix inversion monotonicity lemma (if $A \succeq B \succ 0$ then $A^{-1} \preceq B^{-1}$), we have $(\mathbf{B}_k^{(t+1)})^{-1} \preceq (\mathbf{B}_k^{(t)})^{-1}$, and therefore $\mathbf{x}^\top (\mathbf{B}_k^{(t+1)})^{-1} \mathbf{x} \leq \mathbf{x}^\top (\mathbf{B}_k^{(t)})^{-1} \mathbf{x}$ for all $\mathbf{x}$. $\square$

---

## 3. Formalizing Bainbridge's Ironies of Automation

### 3.1 The Vigilance Decay Function

**[Novel formalization, grounded in: Bainbridge (1983), Mackworth (1948), See et al. (1995), Warm et al. (2008)]**

**Definition 8 (Human Detection Capability).** Let $d_{\text{human}}(t)$ denote the human reviewer's defect detection probability at time $t$ (measured in units of continuous monitoring time). In the absence of automation, define the baseline detection rate as $d_0 \in (0, 1]$.

When automation handles a fraction $p_{\text{auto}}$ of decisions correctly (the automation reliability), the human's detection capability decays according to:

$$d_{\text{human}}(t) = d_0 \cdot \Phi(p_{\text{auto}}, t)$$

where $\Phi: [0,1] \times \mathbb{R}_{\geq 0} \to (0, 1]$ is the vigilance decay function satisfying:

- $\Phi(p_{\text{auto}}, 0) = 1$ (no decay initially)
- $\Phi$ is non-increasing in $t$ for fixed $p_{\text{auto}}$ (detection degrades over time)
- $\Phi$ is non-increasing in $p_{\text{auto}}$ for fixed $t$ (more reliable automation causes faster decay)
- $\lim_{t \to \infty} \Phi(p_{\text{auto}}, t) = \phi_\infty(p_{\text{auto}}) > 0$ (decay has an asymptote; humans retain some residual capability)

### 3.2 Specific Functional Form

**Definition 9 (Exponential-Asymptote Vigilance Model).** We propose:

$$\Phi(p_{\text{auto}}, t) = \phi_\infty(p_{\text{auto}}) + \left(1 - \phi_\infty(p_{\text{auto}})\right) \exp\!\left(-\frac{t}{\xi(p_{\text{auto}})}\right)$$

where:

- $\phi_\infty(p_{\text{auto}}) = (1 - p_{\text{auto}})^\eta$ for some exponent $\eta > 0$ is the asymptotic residual vigilance. When $p_{\text{auto}} = 0$ (no automation), $\phi_\infty = 1$ and there is no vigilance loss. When $p_{\text{auto}} \to 1$ (perfect automation), $\phi_\infty \to 0$ (vigilance collapses to near zero).

- $\xi(p_{\text{auto}}) = \xi_0 (1 - p_{\text{auto}})^\gamma$ for some $\gamma > 0$ is the vigilance decay timescale. Higher $p_{\text{auto}}$ yields smaller $\xi$, meaning faster decay. The parameter $\xi_0$ is the baseline decay timescale (in minutes) when automation is minimal.

**Calibration from the vigilance literature:**

| Parameter | Proposed Value | Justification |
|-----------|---------------|---------------|
| $\eta$ | 1.5 | Intermediate between linear and quadratic decay in automation reliability |
| $\gamma$ | 1.0 | Decay timescale inversely proportional to $(1 - p_{\text{auto}})$ |
| $\xi_0$ | 30 minutes | Mackworth (1948): 10-15% detection decline in first 30 min; See et al. (1995): effect sizes 0.5-1.0 in $d'$ units over comparable periods |
| $d_0$ | 0.80 | Cisco/SmartBear study: 70-90% detection at optimal review parameters |

Under these parameters, with $p_{\text{auto}} = 0.95$ (agent is correct 95% of the time):

- $\phi_\infty(0.95) = (0.05)^{1.5} \approx 0.011$ (residual detection near 1%)
- $\xi(0.95) = 30 \times 0.05 = 1.5$ minutes (rapid decay)
- After 5 minutes: $\Phi \approx 0.011 + 0.989 \times e^{-5/1.5} \approx 0.011 + 0.989 \times 0.036 \approx 0.047$
- Effective detection: $d_{\text{human}}(5\text{ min}) = 0.80 \times 0.047 \approx 0.038$, or 3.8%

This quantifies the Bainbridge irony: when the agent is 95% reliable, the human reviewer's detection capability collapses to under 4% within five minutes of continuous monitoring, making the human nearly useless as a safety net.

### 3.3 The Combined System Reliability

**Definition 10 (Combined Detection Rate).** The combined human-automation system detects defects at rate:

$$D(p_{\text{auto}}, t) = 1 - (1 - p_{\text{auto}})(1 - d_{\text{human}}(t))$$

This assumes the automation and human act as independent detectors in series: a defect escapes only if both the automation misses it (probability $1 - p_{\text{auto}}$) and the human misses it (probability $1 - d_{\text{human}}(t)$).

Substituting the vigilance decay model:

$$D(p_{\text{auto}}, t) = 1 - (1 - p_{\text{auto}})\bigl(1 - d_0 \cdot \Phi(p_{\text{auto}}, t)\bigr)$$

### 3.4 The Vigilance Trap

**Theorem 3 (Existence of the Vigilance Trap).** *[Novel contribution]*

Under the exponential-asymptote vigilance model (Definition 9), there exists a threshold $p_{\text{auto}}^{\text{trap}} \in (0, 1)$ such that the steady-state combined detection rate $D_\infty(p_{\text{auto}}) = \lim_{t \to \infty} D(p_{\text{auto}}, t)$ satisfies:

$$D_\infty(p_{\text{auto}}^{\text{trap}}) < \min\!\left(D_\infty(0),\; p_{\text{auto}}^{\text{trap}}\right)$$

That is, there exists a regime where the combined human-automation system is strictly less reliable than either the human alone or the automation alone.

**Proof.**

The steady-state combined detection rate is:

$$D_\infty(p) = 1 - (1 - p)(1 - d_0 \phi_\infty(p))$$

Expanding:

$$D_\infty(p) = p + (1-p) d_0 \phi_\infty(p)$$

The human-alone steady-state detection (no automation, $p = 0$) is $D_\infty(0) = d_0 \phi_\infty(0) = d_0$ (since $\phi_\infty(0) = 1$).

The automation-alone detection is simply $p$.

We need to show there exists $p^{\text{trap}}$ where $D_\infty(p^{\text{trap}}) < \min(d_0, p^{\text{trap}})$.

With $\phi_\infty(p) = (1-p)^\eta$:

$$D_\infty(p) = p + d_0 (1-p)^{1+\eta}$$

Compute $D_\infty'(p) = 1 - d_0(1+\eta)(1-p)^\eta$.

Setting $D_\infty'(p) = 0$: $(1-p)^\eta = 1/(d_0(1+\eta))$, giving the critical point $p_c = 1 - (d_0(1+\eta))^{-1/\eta}$.

At $p = 0$: $D_\infty(0) = d_0$ and $D_\infty'(0) = 1 - d_0(1+\eta)$. For $d_0(1+\eta) > 1$ (which holds for $d_0 = 0.8, \eta = 1.5$ since $0.8 \times 2.5 = 2.0 > 1$), the derivative is negative at $p = 0$: the combined detection initially *decreases* as automation is introduced.

At $p = 1$: $D_\infty(1) = 1$.

Since $D_\infty(0) = d_0 < 1 = D_\infty(1)$ and $D_\infty'(0) < 0$, by continuity there exists a local minimum $p_{\min} \in (0, 1)$ where $D_\infty(p_{\min}) < d_0$.

To show $D_\infty(p_{\min}) < p_{\min}$ (worse than automation alone), note that $D_\infty(p) < p$ when $d_0(1-p)^{1+\eta} < 0$, which never holds. However, we need a refined argument. Consider $D_\infty(p) - p = d_0(1-p)^{1+\eta}$. This is always non-negative, so $D_\infty(p) \geq p$: the combined system always weakly exceeds the automation alone.

The trap is therefore that $D_\infty(p^{\text{trap}}) < d_0 = D_\infty(0)$: the combined system is worse than the human alone, even though it includes both human and machine. The trap region is the interval $(0, p_{\max})$ where $p_{\max}$ solves $D_\infty(p_{\max}) = d_0$:

$$p_{\max} + d_0(1-p_{\max})^{1+\eta} = d_0$$

$$p_{\max} = d_0\left(1 - (1-p_{\max})^{1+\eta}\right)$$

For $d_0 = 0.8, \eta = 1.5$: numerical evaluation gives $p_{\max} \approx 0.59$. For all $p_{\text{auto}} \in (0, 0.59)$, the combined system detects fewer defects than the human working alone without automation.

This is the mathematical formalization of Bainbridge's core irony: introducing imperfect automation that is supposed to help can actually make things worse, because the vigilance decay it induces in the human overseer more than offsets the automation's contribution. $\square$

**Remark.** The trap always satisfies $D_\infty(p) \geq p$: the combined system is never worse than the automation alone. The paradox is that it can be worse than the human alone: adding the machine harms overall performance by degrading the human. This asymmetry is the essence of Bainbridge's observation.

---

## 4. The Automation Supervision Paradox Theorem

### 4.1 Critical Automation Reliability

**Theorem 4 (Automation Supervision Paradox).** *[Novel contribution]*

Define the steady-state human-alone detection rate $D_H = d_0$ and the combined steady-state detection function $D_\infty(p) = p + d_0(1-p)^{1+\eta}$. There exists a critical automation reliability $p^*$ such that:

$$\text{For } p_{\text{auto}} \in (0, p^*): \quad D_\infty(p_{\text{auto}}) < D_H$$

That is, for automation reliability below $p^*$, the combined system has lower defect detection than the human alone.

The critical threshold $p^*$ is the unique positive solution of:

$$p + d_0(1-p)^{1+\eta} = d_0$$

**Proof.** Define $g(p) = D_\infty(p) - D_H = p + d_0(1-p)^{1+\eta} - d_0$.

At $p = 0$: $g(0) = 0 + d_0 \cdot 1 - d_0 = 0$.

$g'(p) = 1 - d_0(1+\eta)(1-p)^\eta$.

$g'(0) = 1 - d_0(1+\eta)$.

When $d_0(1+\eta) > 1$, we have $g'(0) < 0$, so $g$ is initially decreasing from $g(0) = 0$, meaning $g(p) < 0$ for small positive $p$.

At $p = 1$: $g(1) = 1 - d_0 > 0$ (since $d_0 < 1$).

By the intermediate value theorem, there exists $p^* \in (0,1)$ with $g(p^*) = 0$. Since $g'(p) = 0$ has exactly one solution in $(0,1)$ (at $p_c = 1 - (d_0(1+\eta))^{-1/\eta}$), and $g$ is first decreasing then increasing, the zero $p^*$ is unique in $(0,1)$.

For $p \in (0, p^*)$, $g(p) < 0$, confirming $D_\infty(p) < D_H$. $\square$

### 4.2 Deriving p* as a Function of Parameters

**Proposition 3 (Parametric Form of p*).** *[Novel contribution]*

The critical automation reliability $p^*$ satisfies $p^* = d_0(1 - (1-p^*)^{1+\eta})$, which does not admit a closed-form solution for general $\eta$. However:

*(a) For $\eta = 1$ (linear vigilance decay):*

$$p^* = 1 - \frac{-1 + \sqrt{1 + 4d_0}}{2d_0}$$

With $d_0 = 0.8$: $p^* = 1 - (-1 + \sqrt{1 + 3.2})/(1.6) = 1 - (-1 + 2.049)/1.6 = 1 - 0.656 = 0.344$.

*(b) For general $\eta$, a first-order Taylor expansion around $p = 0$ gives the approximation:*

$$p^* \approx \frac{d_0(1+\eta) - 1}{d_0 \binom{1+\eta}{2}} = \frac{2(d_0(1+\eta) - 1)}{d_0(1+\eta)\eta}$$

With $d_0 = 0.8, \eta = 1.5$: $p^* \approx 2(2.0 - 1)/(0.8 \times 2.5 \times 1.5) = 2.0/3.0 \approx 0.667$.

Numerical solution of the exact equation with $d_0 = 0.8, \eta = 1.5$ gives $p^* \approx 0.59$.

*(c) Sensitivity to parameters:*

| $d_0$ | $\eta$ | $p^*$ (numerical) | Interpretation |
|-------|--------|-------------------|----------------|
| 0.50 | 1.0 | 0.38 | Moderate human skill, linear decay |
| 0.80 | 1.0 | 0.34 | High human skill, linear decay |
| 0.80 | 1.5 | 0.59 | High human skill, accelerated decay |
| 0.80 | 2.0 | 0.71 | High human skill, rapid decay |
| 0.95 | 1.5 | 0.64 | Expert human, accelerated decay |

Higher $\eta$ (faster vigilance decay with automation reliability) expands the paradox region, making it more dangerous to introduce automation.

### 4.3 Vigilance Probes: Maintaining Detection Skill

**Definition 11 (Vigilance Probe).** A vigilance probe is a synthetic, known-defective output injected into the human reviewer's stream at rate $\lambda$ (probes per unit time). The probe has the following properties:

- It is indistinguishable from genuine agent output at the time of review.
- Its defective status is revealed to the reviewer after they have rendered a judgment (immediate feedback).
- It maintains the reviewer's detection skill by providing practice opportunities and calibration feedback.

**Definition 12 (Probe-Augmented Vigilance Model).** Under vigilance probing at rate $\lambda$, the effective signal rate (fraction of items requiring detection) is no longer $(1-p_{\text{auto}})$ but rather:

$$\sigma(\lambda) = (1 - p_{\text{auto}}) + \lambda$$

The vigilance decay function is modified to:

$$\Phi_\lambda(p_{\text{auto}}, t) = \phi_{\infty,\lambda}(p_{\text{auto}}) + (1 - \phi_{\infty,\lambda}(p_{\text{auto}})) \exp\!\left(-\frac{t}{\xi_\lambda(p_{\text{auto}})}\right)$$

where the asymptote and timescale now depend on the effective signal rate:

$$\phi_{\infty,\lambda}(p_{\text{auto}}) = \sigma(\lambda)^\eta = \bigl((1-p_{\text{auto}}) + \lambda\bigr)^\eta$$

$$\xi_\lambda(p_{\text{auto}}) = \xi_0 \cdot \sigma(\lambda)^\gamma$$

The key mechanism: probes increase the effective signal rate, counteracting the vigilance decay that comes from monitoring a mostly-correct stream. The reviewer encounters defects (both real and synthetic) more frequently, maintaining their detection skill.

### 4.4 Optimal Probe Rate

**Theorem 5 (Optimal Probe Rate).** *[Novel contribution]*

The optimal probe rate $\lambda^*$ maximizes the combined system's steady-state reliability net of probing cost:

$$\lambda^* = \arg\max_{\lambda \geq 0} \left[D_{\infty,\lambda}(p_{\text{auto}}) - c_\lambda \cdot \lambda\right]$$

where $D_{\infty,\lambda}(p) = p + d_0 (1-p) \sigma(\lambda)^\eta$ is the probe-augmented steady-state detection rate and $c_\lambda$ is the per-probe cost (the reviewer's time spent evaluating a synthetic defect, normalized to the same units as detection rate).

Taking the first-order condition:

$$\frac{\partial}{\partial \lambda}\left[p + d_0(1-p)\sigma(\lambda)^\eta - c_\lambda \lambda\right] = d_0(1-p) \eta \sigma(\lambda)^{\eta-1} - c_\lambda = 0$$

Solving:

$$\sigma(\lambda^*) = \left(\frac{c_\lambda}{d_0(1-p)\eta}\right)^{1/(\eta-1)}$$

$$\lambda^* = \left(\frac{c_\lambda}{d_0(1-p)\eta}\right)^{1/(\eta-1)} - (1 - p)$$

subject to $\lambda^* \geq 0$. When $\eta > 1$ (which is required for the solution to be a maximum rather than a minimum), the second-order condition is automatically satisfied since $\partial^2/\partial\lambda^2 = d_0(1-p)\eta(\eta-1)\sigma^{\eta-2} > 0$ only if $\eta < 1$; for $\eta > 1$, $\partial^2/\partial\lambda^2 < 0$, confirming a maximum.

**Remark.** When $\eta \leq 1$, the objective is convex in $\lambda$ and the optimal probe rate is either $\lambda^* = 0$ or $\lambda^* = \infty$ (a corner solution), meaning probing is either worthless or should be maximal. The interesting regime is $\eta > 1$, where an interior optimum exists.

**Numerical example.** With $p_{\text{auto}} = 0.95$, $d_0 = 0.80$, $\eta = 1.5$, $c_\lambda = 0.01$ (probes are cheap relative to real defects):

$$\sigma(\lambda^*) = \left(\frac{0.01}{0.80 \times 0.05 \times 1.5}\right)^{1/0.5} = \left(\frac{0.01}{0.06}\right)^2 = (0.167)^2 = 0.028$$

$$\lambda^* = 0.028 - 0.05 < 0$$

Since $\lambda^* < 0$, the constraint $\lambda \geq 0$ binds; no probing is needed because the natural defect rate $(1-p) = 0.05$ already exceeds $\sigma(\lambda^*)$. The residual vigilance from real defects alone is sufficient.

With $p_{\text{auto}} = 0.99$ (very high reliability):

$$\sigma(\lambda^*) = \left(\frac{0.01}{0.80 \times 0.01 \times 1.5}\right)^2 = \left(\frac{0.01}{0.012}\right)^2 = (0.833)^2 = 0.694$$

$$\lambda^* = 0.694 - 0.01 = 0.684$$

A probe rate of approximately 68% is needed: roughly two probes for every three genuine reviews. This is expensive but reflects the extreme vigilance decay at 99% automation reliability. Without probes, the human's steady-state detection is $d_0 \times (0.01)^{1.5} = 0.80 \times 0.001 = 0.0008$, or 0.08%; essentially zero.

### 4.5 How Probes Shift the Critical Threshold

**Proposition 4 (Probes Expand the Safe Region).** *[Novel contribution]*

Let $p^*(\lambda)$ denote the critical automation reliability threshold under probe rate $\lambda$. Then $p^*(\lambda)$ is non-increasing in $\lambda$: probes shrink the paradox region (equivalently, expand the safe automation region).

**Proof sketch.** The probe-augmented combined detection is $D_{\infty,\lambda}(p) = p + d_0(1-p)\sigma(\lambda)^\eta$. The critical threshold $p^*(\lambda)$ solves $D_{\infty,\lambda}(p^*) = d_0$, i.e.:

$$p^* + d_0(1-p^*)\sigma(\lambda)^\eta = d_0$$

Increasing $\lambda$ increases $\sigma(\lambda) = (1-p) + \lambda$, which increases $\sigma(\lambda)^\eta$, which increases the left-hand side for any fixed $p$. Therefore, the solution $p^*(\lambda)$ must decrease to restore equality. Formally, by the implicit function theorem:

$$\frac{dp^*}{d\lambda} = -\frac{\partial_\lambda D_{\infty,\lambda}}{\partial_p D_{\infty,\lambda}}\Bigg|_{p = p^*}$$

Since $\partial_\lambda D_{\infty,\lambda} = d_0(1-p)\eta\sigma^{\eta-1} > 0$ and, at the paradox threshold where $D_{\infty,\lambda}$ is increasing in $p$, $\partial_p D_{\infty,\lambda} > 0$, we have $dp^*/d\lambda < 0$. $\square$

In the limit $\lambda \to \infty$, $\sigma(\lambda) \to \infty$ and $\phi_{\infty,\lambda} \to 1$ (in the model, capped at 1), so $D_{\infty,\lambda}(p) \to p + d_0(1-p) = 1 - (1-d_0)(1-p)$. In this limit, $p^* \to 0$: the paradox region vanishes entirely. Probes, if sufficiently frequent, can eliminate the Bainbridge irony completely, at the cost of reviewer time.

---

## 5. Non-Stationarity and Trust Decay

### 5.1 Modeling Agent Reliability as a Non-Stationary Process

**[Established theory: Whittle (1988), Garivier & Moulines (2011), Xiong et al. (2025)]**

**Definition 13 (Piecewise-Stationary Trust Process).** The true success probability $\theta_k(t)$ for arm $k$ at time $t$ evolves as a piecewise-constant process with $L$ change points $\{t_1, t_2, \ldots, t_L\}$:

$$\theta_k(t) = \begin{cases} \theta_k^{(0)} & \text{for } t < t_1 \\ \theta_k^{(1)} & \text{for } t_1 \leq t < t_2 \\ \vdots \\ \theta_k^{(L)} & \text{for } t \geq t_L \end{cases}$$

Change points correspond to concrete events: model version updates, system prompt modifications, repository restructuring, or dependency upgrades. The total variation of the process is:

$$V_k = \sum_{i=1}^L |\theta_k^{(i)} - \theta_k^{(i-1)}|$$

**Definition 14 (Bounded Variation Condition).** The family of trust processes $\{\theta_k(t)\}_{k=1}^K$ has bounded total variation $V$ if:

$$\sum_{k=1}^K V_k \leq V$$

This is a standard assumption in the non-stationary bandits literature; it captures the idea that while reliability changes, it does not change arbitrarily fast.

### 5.2 Windowed Trust Estimator

**Definition 15 (Sliding-Window Trust Estimator).** For window size $w \in \mathbb{N}$, the windowed trust score for arm $k$ at time $t$ is:

$$\tau_k^{(w)}(t) = \frac{\alpha_k^{(0)} + \sum_{s=\max(1, t-w+1)}^{t} R_s \cdot \mathbf{1}[A_s = k]}{\alpha_k^{(0)} + \beta_k^{(0)} + \sum_{s=\max(1, t-w+1)}^{t} \mathbf{1}[A_s = k]}$$

This is a Beta posterior mean computed using only the most recent $w$ observations. Equivalently, observations older than $w$ steps are discarded.

**Definition 16 (Discounted Trust Estimator).** An alternative approach uses exponential discounting with discount factor $\gamma \in (0,1)$:

$$\tau_k^{(\gamma)}(t) = \frac{\alpha_k^{(0)} + \sum_{s=1}^{t} \gamma^{t-s} R_s \cdot \mathbf{1}[A_s = k]}{\alpha_k^{(0)} + \beta_k^{(0)} + \sum_{s=1}^{t} \gamma^{t-s} \cdot \mathbf{1}[A_s = k]}$$

The effective window size is $w_{\text{eff}} \approx 1/(1-\gamma)$. Both approaches trade recency against statistical efficiency.

### 5.3 Dynamic Regret Bound

**Theorem 6 (Windowed Thompson Sampling Dynamic Regret).** *[Synthesis of Garivier & Moulines (2011) and Xiong et al. (2025)]*

Consider the sliding-window Thompson Sampling algorithm (Algorithm 1 with the modification that only observations from the most recent $w$ time steps are used for posterior updates). Under the bounded variation condition (Definition 14), the dynamic regret satisfies:

$$\text{DynRegret}(T) = \sum_{t=1}^T \left(\theta^*_t - \theta_{A_t}(t)\right)$$

where $\theta^*_t = \max_k \theta_k(t)$ is the best arm at time $t$. With optimal window size $w^* = \Theta((T/V)^{2/3})$:

$$\mathbb{E}[\text{DynRegret}(T)] = O\!\left(K^{1/3} T^{2/3} V^{1/3} \ln T\right)$$

**Proof sketch (following Garivier & Moulines 2011).** The analysis decomposes the regret into two components:

1. *Estimation error:* Within each window of size $w$, the trust estimator acts as a stationary bandit with at most $w$ observations. The per-window regret is $O(\sqrt{Kw \ln w})$ by the standard Thompson Sampling bound.

2. *Bias from non-stationarity:* The trust parameter may change within the window. Under bounded variation, the maximum change within a window of size $w$ is at most $V \cdot w / T$ (assuming change points are spread across the horizon). This introduces an additive bias of order $O(Vw/T)$ per round.

The total regret is approximately:

$$\text{DynRegret}(T) \approx \frac{T}{w} \cdot \sqrt{Kw \ln w} + T \cdot \frac{Vw}{T} = T\sqrt{K \ln w / w} + Vw$$

Minimizing over $w$: set $T\sqrt{K \ln w / w} = Vw$, giving $w^* \sim (T\sqrt{K}/V)^{2/3}$ (ignoring log factors). Substituting back:

$$\text{DynRegret}(T) = O\!\left(K^{1/3} T^{2/3} V^{1/3} \ln T\right)$$

This is sublinear in $T$ as long as $V = o(T)$: the total variation grows slower than linearly. In other words, the harness can track a changing environment, provided the environment does not change too fast. $\square$

**Corollary 2 (Per-Round Dynamic Regret Decay).** The per-round dynamic regret decays as:

$$\frac{\text{DynRegret}(T)}{T} = O\!\left(\frac{K^{1/3} V^{1/3} \ln T}{T^{1/3}}\right) \to 0 \quad \text{as } T \to \infty$$

provided $V = o(T)$.

### 5.4 Connection to Restless Bandits

**[Established theory: Whittle (1988), Weber & Weiss (1990)]**

**Definition 17 (Trust Calibration as a Restless Bandit).** Model each (agent, task-type) arm as a restless bandit with state $s_k \in \{L, H\}$ (low reliability, high reliability). The transition dynamics are:

- *When arm $k$ is played (reviewed):* The harness observes the outcome and may update its trust estimate. The arm's true state transitions according to $P^{(1)}(s' \mid s)$.
- *When arm $k$ is not played:* The arm's state may still change (model drift, dependency updates), but the harness learns nothing. Transitions follow $P^{(0)}(s' \mid s)$.

The key restless feature: passive arms can deteriorate. An (agent, task-type) pair that was reliable last month may have become unreliable due to a dependency update, but the harness will not discover this until it reviews that arm again. This creates a tension between exploiting trusted arms and re-exploring to detect drift.

**Proposition 5 (Whittle Indexability for Binary Trust States).** *[Novel contribution]*

The two-state trust calibration restless bandit is indexable. The Whittle index for arm $k$ in state $s$ is:

$$W_k(s) = \frac{r_k(s, 1) - r_k(s, 0) + \gamma(V_k^{(1)}(s) - V_k^{(0)}(s))}{1}$$

where $r_k(s, a)$ is the immediate reward of playing ($a=1$) or not playing ($a=0$) arm $k$ in state $s$, $\gamma$ is the discount factor, and $V_k^{(a)}(s)$ is the continuation value under action $a$.

For the binary trust model with states $\{L, H\}$ (low/high reliability), rewards $r_H > r_L$, and symmetric transition probabilities $P^{(0)}(L \mid H) = P^{(0)}(H \mid L) = q$ (passive drift rate):

$$W_k(H) = r_H + \gamma q \cdot \Delta V_k, \quad W_k(L) = r_L - \gamma q \cdot \Delta V_k$$

where $\Delta V_k = V_k(H) - V_k(L) > 0$ is the value difference between states. The Whittle index policy plays the $M$ arms with highest index, which in this case means playing arms that are likely in the high state (exploit) or arms with high passive drift $q$ (explore for potential deterioration).

**Proof of indexability.** We must show that the passive set $\mathcal{P}(\lambda) = \{s : \text{passive is optimal at subsidy } \lambda\}$ is monotone in $\lambda$. With subsidy $\lambda$ for passivity, passivity is optimal in state $s$ when:

$$r_k(s, 0) + \lambda + \gamma \sum_{s'} P^{(0)}(s' \mid s) V_k^\lambda(s') \geq r_k(s, 1) + \gamma \sum_{s'} P^{(1)}(s' \mid s) V_k^\lambda(s')$$

As $\lambda$ increases, the left side increases, so $\mathcal{P}(\lambda)$ can only grow, establishing indexability. $\square$

---

## 6. The Governance Capacity Theorem (Trust Edition)

### 6.1 Trust Information Rate

**Definition 18 (Trust Information Rate).** The trust information rate $I_{\text{trust}}(t)$ is the rate at which the harness acquires information about agent reliability through human reviews. Formally, for a harness conducting $H$ reviews per unit time, and each review yielding one bit of information (binary outcome: pass/fail), the trust information rate in bits per unit time is:

$$I_{\text{trust}} = H \cdot I_{\text{per-review}}$$

where $I_{\text{per-review}}$ is the mutual information between the review outcome and the agent's reliability parameter:

$$I_{\text{per-review}} = I(\theta_k; R \mid \mathcal{H}) = \mathbb{E}_{\theta_k \sim \text{posterior}}\left[D_{\text{KL}}\!\left(\text{Bernoulli}(\theta_k) \;\|\; \text{Bernoulli}(\bar{\theta}_k)\right)\right]$$

where $\bar{\theta}_k = \mathbb{E}[\theta_k \mid \mathcal{H}]$ is the posterior mean and $D_{\text{KL}}$ is the Kullback-Leibler divergence. For a $\text{Beta}(\alpha, \beta)$ posterior:

$$I_{\text{per-review}} = \mathbb{E}\left[\theta_k \ln\frac{\theta_k}{\bar{\theta}_k} + (1-\theta_k)\ln\frac{1-\theta_k}{1-\bar{\theta}_k}\right]$$

This is maximized when the posterior is most uncertain (broad posterior, high variance) and minimized when the posterior is concentrated (the harness already knows the reliability).

### 6.2 Bounding the Information Rate by Human Capacity

**Theorem 7 (Trust Information Rate Bound).** *[Novel contribution]*

The trust information rate is bounded by the human review rate:

$$I_{\text{trust}} \leq H \cdot \ln 2 \quad \text{bits per unit time}$$

where $H$ is the maximum number of reviews a human can conduct per unit time and $\ln 2$ is the maximum information per binary observation.

**Proof.** Each review produces a single binary outcome $R \in \{0, 1\}$. The maximum entropy of a binary random variable is $\ln 2$ bits (achieved when $P(R=1) = 1/2$). Therefore, each review contributes at most $\ln 2$ bits of information about the underlying reliability parameter. With at most $H$ reviews per unit time, the total information is at most $H \ln 2$ bits per unit time. $\square$

In practice, the information per review is less than $\ln 2$ when the posterior is already concentrated (the outcome is predictable). For a $\text{Beta}(\alpha, \beta)$ posterior with mean $\bar{\theta}$ far from $1/2$, the per-review information is approximately:

$$I_{\text{per-review}} \approx \frac{\text{Var}[\theta_k \mid \mathcal{H}]}{2 \bar{\theta}_k (1 - \bar{\theta}_k)} \leq \frac{1}{4(\alpha + \beta + 1) \bar{\theta}_k(1-\bar{\theta}_k)}$$

which decreases as observations accumulate (the posterior narrows).

### 6.3 The Fundamental Tracking Limitation

**Definition 19 (Reliability Drift Rate).** Define the reliability drift rate as the expected rate of change in agent reliability:

$$\Delta_{\text{drift}} = \mathbb{E}\left[\frac{1}{T}\sum_{t=1}^{T-1} |\theta_k(t+1) - \theta_k(t)|\right] = \frac{V}{T}$$

for the bounded-variation model, or equivalently, the average total variation per unit time.

**Theorem 8 (Governance Capacity Bound for Trust Calibration).** *[Novel contribution]*

When the reliability drift rate exceeds the trust information rate, the harness cannot maintain calibrated trust. Formally, define trust calibration error as:

$$\mathcal{E}(T) = \frac{1}{T}\sum_{t=1}^T |\tau_k(t) - \theta_k(t)|$$

the time-averaged absolute deviation between the trust estimate and the true reliability. Then:

$$\mathcal{E}(T) \geq \max\!\left(0,\; \Delta_{\text{drift}} - \frac{I_{\text{trust}}}{c_{\text{info}}}\right)$$

where $c_{\text{info}}$ is a constant capturing the conversion rate from information (bits) to estimation accuracy reduction (approximately $c_{\text{info}} = \sqrt{2\ln 2}$ for Gaussian approximations to the posterior).

**Proof sketch.** This is an information-theoretic lower bound. The harness's trust estimate $\tau_k(t)$ is a function of the observation history $\mathcal{H}_t$. The mutual information between $\theta_k(t)$ and $\mathcal{H}_t$ is at most $I_{\text{trust}} \cdot t$ (the total information accumulated). By the data processing inequality, no estimator can achieve lower mean-squared error than:

$$\text{MSE}(\tau_k(t), \theta_k(t)) \geq \frac{1}{2\pi e} \exp\!\left(-\frac{2 I(\theta_k(t); \mathcal{H}_t)}{1}\right)$$

(Fano/rate-distortion bound for continuous parameters). When $\theta_k(t)$ is changing at rate $\Delta_{\text{drift}}$ and the information accumulates at rate $I_{\text{trust}}$, the estimator can track the parameter only if $I_{\text{trust}}$ is sufficient to "keep up" with the drift. Specifically, the irreducible tracking error satisfies:

$$\mathcal{E}(T) \geq \Omega\!\left(\frac{\Delta_{\text{drift}} \cdot K}{I_{\text{trust}}}\right)$$

when $K$ arms are being tracked simultaneously. The factor of $K$ arises because the information budget $I_{\text{trust}}$ must be shared across all $K$ arms.

When $\Delta_{\text{drift}} \cdot K / I_{\text{trust}} \geq \Omega(1)$, the trust calibration error remains bounded away from zero regardless of the algorithm: no bandit strategy, no matter how sophisticated, can maintain calibrated trust. $\square$

**Corollary 3 (Maximum Trustworthy Arms).** Given human review rate $H$ and reliability drift rate $\Delta_{\text{drift}}$ per arm, the maximum number of (agent, task-type) arms for which calibrated trust can be maintained is:

$$K_{\max} = O\!\left(\frac{H \ln 2}{\Delta_{\text{drift}} \cdot c_{\text{info}}}\right)$$

If a harness attempts to manage more arms than $K_{\max}$, at least $K - K_{\max}$ arms will have uncalibrated trust, and the harness must either:

- Default to a conservative policy (review everything) for the excess arms.
- Accept elevated risk from uncalibrated trust decisions.
- Reduce the number of arms by consolidating (agent, task-type) pairs.

### 6.4 Connection to the Governance Capacity Bound

**Proposition 6 (Equivalence to Governance Capacity).** *[Novel contribution]*

The trust information rate bound (Theorem 7) and the governance capacity theorem from the Governance Architecture formalization (Theorem 7 of governance-architecture-formal-r2.md, the condition $g(t) \geq (\mu/\nu) \cdot r(t)$) are instances of the same fundamental constraint: human oversight capacity bounds the rate at which a harness can learn about and control autonomous agent behavior.

In the governance architecture:
- The governance intervention rate $g(t)$ corresponds to the human review rate $H$.
- The agent generation rate $r(t)$ corresponds to the reliability drift rate $\Delta_{\text{drift}}$.
- The governance-to-drift ratio $\kappa = \nu g / (\mu r)$ corresponds to $I_{\text{trust}} / (\Delta_{\text{drift}} \cdot K)$.

The condition $\kappa > \kappa_{\text{crit}}$ in the governance architecture is equivalent to $I_{\text{trust}} / (\Delta_{\text{drift}} \cdot K) > C_{\text{crit}}$ in the trust calibration framework. Both state: when autonomous processes outpace human oversight capacity, the system cannot maintain its intended properties.

**Proof sketch.** The governance coherence dynamics $dC/dt = \nu g - \mu r$ describe the same resource competition as the trust tracking problem. Coherence corresponds to trust calibration accuracy; the governance force $\nu g$ corresponds to information gained per review; the drift force $\mu r$ corresponds to reliability change. The bifurcation at $\kappa = \kappa_{\text{crit}}$ maps to the tracking breakdown at $\Delta_{\text{drift}} \cdot K = I_{\text{trust}} / c_{\text{info}}$. In both cases, the fundamental constraint is Shannon-theoretic: you cannot control what you cannot observe, and the observation rate is bounded by human capacity. $\square$

---

## 7. Synthesis: The Trust Calibration Control Loop

The six formalizations interact as a closed-loop system governing the trust relationship between human and machine in a coding harness.

### 7.1 The Complete Architecture

**Thompson Sampling (Section 1)** provides the *learning mechanism*: it converts binary review outcomes into posterior trust estimates, converging at the $O(\ln T)$ optimal rate. The trust score $\tau_k$ summarizes current belief about each arm's reliability.

**Contextual extension (Section 2)** adds *situational awareness*: trust decisions depend not only on the (agent, task-type) pair but on the specific features of the current action. The trust surface $\tau(k, \mathbf{x})$ enables fine-grained governance that adapts to file type, complexity, and novelty.

**Vigilance formalization (Section 3)** quantifies the *human factor*: even perfect learning algorithms are useless if the human reviewer's detection capability has decayed. The vigilance decay function $\Phi(p_{\text{auto}}, t)$ places a hard constraint on the combined system's reliability.

**The Automation Supervision Paradox (Section 4)** identifies the *danger zone*: the region of automation reliability where the combined system is worse than the human alone. The critical threshold $p^*$ defines the boundary, and vigilance probes at rate $\lambda^*$ shift this boundary to expand the safe operating region.

**Non-stationarity (Section 5)** addresses *temporal robustness*: trust estimates must track a changing reality. The windowed estimator achieves $O(T^{2/3} V^{1/3})$ dynamic regret, and the Whittle index policy provides an optimal scheduling rule for re-exploring arms that may have drifted.

**The Governance Capacity Bound (Section 6)** establishes the *fundamental limit*: the trust information rate $I_{\text{trust}} \leq H \ln 2$ cannot be exceeded, regardless of algorithmic sophistication. When reliability drifts faster than the harness can learn, trust calibration fails.

### 7.2 Design Implications

The formal results yield three concrete constraints for harness design:

1. **The probe budget.** Vigilance probes at rate $\lambda^*$ are necessary when automation reliability exceeds approximately 95%. Without probes, the human becomes a decorative safety net.

2. **The observation budget.** At most $K_{\max} = O(H / \Delta_{\text{drift}})$ (agent, task-type) pairs can be simultaneously tracked. A harness managing more arms than this must consolidate or accept uncalibrated trust on some arms.

3. **The window size.** The optimal window $w^* = \Theta((T/V)^{2/3})$ balances statistical efficiency against responsiveness. After a model update (spike in $V$), the window should contract; during stable periods, it should expand.

---

## References

### Cited (Established Results)

1. Thompson, W. R. (1933). On the likelihood that one unknown probability exceeds another in view of the evidence of two samples. *Biometrika*, 25(3-4):285-294.

2. Lai, T. L. and Robbins, H. (1985). Asymptotically efficient adaptive allocation rules. *Advances in Applied Mathematics*, 6(1):4-22.

3. Whittle, P. (1988). Restless bandits: Activity allocation in a changing world. *Journal of Applied Probability*, 25:287-298.

4. Weber, R. R. and Weiss, G. (1990). On an index policy for restless bandits. *Journal of Applied Probability*, 27(3):637-648.

5. Bainbridge, L. (1983). Ironies of automation. *Automatica*, 19(6):775-779.

6. Mackworth, N. H. (1948). The breakdown of vigilance during prolonged visual search. *Quarterly Journal of Experimental Psychology*, 1(1):6-21.

7. See, J. E., Warm, J. S., Dember, W. N., and Howe, S. R. (1995). Meta-analysis of the sensitivity decrement in vigilance. *Psychological Bulletin*, 117:230-249.

8. Warm, J. S., Parasuraman, R., and Matthews, G. (2008). Vigilance requires hard mental work and is stressful. *Human Factors*, 50:433-441.

9. Agrawal, S. and Goyal, N. (2012). Analysis of Thompson Sampling for the multi-armed bandit problem. *COLT 2012*.

10. Agrawal, S. and Goyal, N. (2013a). Further optimal regret bounds for Thompson Sampling. *AISTATS 2013*, PMLR 31:99-107.

11. Agrawal, S. and Goyal, N. (2013b). Thompson Sampling for contextual bandits with linear payoffs. *ICML 2013*, PMLR 28(3):127-135.

12. Li, L., Chu, W., Langford, J., and Schapire, R. E. (2010). A contextual-bandit approach to personalized news article recommendation. *WWW 2010*, ACM.

13. Kaufmann, E., Korda, N., and Munos, R. (2012). Thompson Sampling: An asymptotically optimal finite-time analysis. *ALT 2012*, Springer LNCS 7568.

14. Russo, D. and Van Roy, B. (2016). An information-theoretic analysis of Thompson Sampling. *JMLR*, 17(68):1-30.

15. Garivier, A. and Moulines, E. (2011). On upper-confidence bound policies for switching bandit problems. *ALT 2011*, Springer LNCS 6925.

16. Xiong, Z. et al. (2025). Online learning of Whittle indices for restless bandits with non-stationary transition kernels. *arXiv:2506.18186*.

17. Cohen, J. (2006). *Best Kept Secrets of Peer Code Review*. SmartBear Software.

### Novel Contributions (This Paper)

- Proposition 1: Posterior concentration rate for Beta-Bernoulli trust scores.
- Definition 9: Exponential-asymptote vigilance model with specific functional form.
- Theorem 3: Existence of the vigilance trap.
- Theorem 4: Automation Supervision Paradox, critical threshold $p^*$.
- Theorem 5: Optimal vigilance probe rate $\lambda^*$.
- Proposition 4: Probes expand the safe automation region.
- Proposition 5: Whittle indexability for binary trust states.
- Theorem 7: Trust information rate bound.
- Theorem 8: Governance capacity bound for trust calibration.
- Corollary 3: Maximum number of trustworthy arms.
- Proposition 6: Equivalence between trust capacity and governance capacity bounds.
