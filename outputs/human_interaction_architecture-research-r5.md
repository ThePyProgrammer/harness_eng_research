# Bandit Theory and Bayesian Decision Theory for Trust Calibration in AI Coding Harnesses

## Research Report, Round 5 (Formal/Mathematical Dimension)

---

## 1. Thompson Sampling: Original Formulation and Bayesian Foundations

### 1.1 Historical Origin

Thompson Sampling was introduced by William R. Thompson in 1933 in his paper "On the likelihood that one unknown probability exceeds another in view of the evidence of two samples" (Biometrika, 25(3-4):285-294, 1933). The algorithm remained largely dormant for decades, rediscovered and empirically validated by Chapelle and Li (2011) at NeurIPS, with theoretical optimality proofs arriving only in 2012 (Kaufmann, Korda, and Munos at ALT; Agrawal and Goyal at COLT).

### 1.2 The Beta-Bernoulli Bandit

Consider $K$ arms, where arm $k$ produces a reward of 1 with unknown probability $\theta_k$ and 0 with probability $1 - \theta_k$. The mean rewards $\theta_1, \ldots, \theta_K$ are unknown but fixed over time.

**Prior:** Each arm's success probability is given a Beta prior:

$$\theta_k \sim \text{Beta}(\alpha_k, \beta_k)$$

The uniform (non-informative) prior corresponds to $\alpha_k = \beta_k = 1$; the Jeffreys prior to $\alpha_k = \beta_k = 1/2$.

**Posterior update:** After observing $S_k$ successes and $F_k$ failures on arm $k$, the posterior is:

$$\theta_k | \text{data} \sim \text{Beta}(\alpha_k + S_k, \beta_k + F_k)$$

This conjugacy makes the update computationally trivial: a single addition per observation.

### 1.3 The Algorithm

At each time step $t = 1, 2, \ldots$:

1. For each arm $k \in \{1, \ldots, K\}$, sample $\hat{\theta}_k(t) \sim \text{Beta}(\alpha_k + S_k(t), \beta_k + F_k(t))$
2. Play the arm $a(t) = \arg\max_k \hat{\theta}_k(t)$
3. Observe reward $r_t \in \{0, 1\}$ and update: if $r_t = 1$, increment $S_{a(t)}$; if $r_t = 0$, increment $F_{a(t)}$

The key property: arm $k$ is played with probability equal to the posterior probability that arm $k$ is optimal. Formally:

$$P(a(t) = k | \mathcal{H}_t) = \int \mathbb{I}\left[\mathbb{E}[r | \theta, a=k] = \max_{k'} \mathbb{E}[r | \theta, a=k']\right] P(\theta | \mathcal{H}_t) \, d\theta$$

where $\mathcal{H}_t$ is the history up to time $t$.

### 1.4 Why Thompson Sampling Fits Trust Calibration

Thompson Sampling is particularly appropriate for trust calibration in AI coding harnesses for several structural reasons:

**Natural exploration-exploitation balance.** Arms with uncertain posteriors (newly encountered agent-task pairs) produce high-variance samples, causing occasional exploration even when another arm currently appears better. Arms with well-estimated posteriors (agent-task pairs with long histories) produce consistent samples near their true mean, leading to reliable exploitation. This matches the trust calibration requirement: explore (review) unfamiliar situations while exploiting (trusting) well-characterized ones.

**Asymmetric posterior concentration.** After a single catastrophic failure (a trusted action that produced a critical bug), the posterior shifts dramatically. A Beta(10, 1) posterior (strong trust) becomes Beta(10, 2) after one failure, dropping the mean from 0.91 to 0.83 and widening the posterior variance. Thompson Sampling automatically increases exploration after such events, which maps directly to the intuition that trust should weaken after failures and require re-verification.

**Computational simplicity.** Sampling from a Beta distribution is $O(1)$. No optimization, no confidence bound computation, no gradient. This matters for a harness that must make trust decisions on every code action.

---

## 2. Regret Bounds for Thompson Sampling

### 2.1 The Lai-Robbins Lower Bound

The fundamental limit on any consistent bandit algorithm was established by Lai and Robbins (1985) in "Asymptotically Efficient Adaptive Allocation Rules" (Advances in Applied Mathematics, 6(1):4-22). For any algorithm that achieves $o(n^a)$ regret for all $a > 0$ on every bandit instance:

$$\liminf_{T \to \infty} \frac{\mathbb{E}[R(T)]}{\ln T} \geq \sum_{k: \mu_k < \mu^*} \frac{\Delta_k}{\text{KL}(\mu_k, \mu^*)}$$

where $\Delta_k = \mu^* - \mu_k$ is the suboptimality gap for arm $k$, $\mu^*$ is the optimal arm's mean, and $\text{KL}(\mu_k, \mu^*)$ is the Kullback-Leibler divergence between the Bernoulli distributions with means $\mu_k$ and $\mu^*$.

### 2.2 Kaufmann, Korda, and Munos (2012)

In "Thompson Sampling: An Asymptotically Optimal Finite-Time Analysis" (ALT 2012, Springer LNCS 7568), Kaufmann, Korda, and Munos proved the first finite-time regret bound for Thompson Sampling matching the Lai-Robbins lower bound. For the Bernoulli bandit with uniform or Jeffreys prior:

$$\mathbb{E}[R(T)] \leq (1 + \epsilon) \sum_{k: \mu_k < \mu^*} \frac{\Delta_k \ln T}{\text{KL}(\mu_k, \mu^*)} + O\left(\frac{K}{\epsilon^2}\right)$$

This established that Thompson Sampling is asymptotically optimal for Bernoulli rewards.

### 2.3 Agrawal and Goyal (2012, 2013)

Agrawal and Goyal published two landmark papers:

**"Analysis of Thompson Sampling for the Multi-Armed Bandit Problem" (COLT 2012):** The first paper establishing near-optimal bounds using novel martingale-based analysis techniques.

**"Further Optimal Regret Bounds for Thompson Sampling" (AISTATS 2013, PMLR 31:99-107):** This paper provides both:

*Problem-dependent bound:*

$$\mathbb{E}[R(T)] \leq (1 + \epsilon) \sum_{i: \Delta_i > 0} \frac{\ln T}{\Delta_i} + O\left(\frac{K}{\epsilon^2}\right)$$

*Problem-independent bound:*

$$\mathbb{E}[R(T)] = O\left(\sqrt{KT \ln T}\right)$$

The latter solves the COLT 2012 open problem posed by Chapelle and Li (2011), establishing the first near-optimal problem-independent regret bound for Thompson Sampling.

The key technical innovation is a martingale-based analysis: conditioned on any execution history, the probability of playing any suboptimal arm is bounded by a linear function of the probability of playing the optimal arm.

### 2.4 Comparison with UCB1

Auer, Cesa-Bianchi, and Fischer (2002) established the UCB1 regret bound in "Finite-Time Analysis of the Multiarmed Bandit Problem" (Machine Learning, 47:235-256):

$$\mathbb{E}[R_{\text{UCB1}}(T)] \leq 8 \sum_{i: \mu_i < \mu^*} \frac{\ln T}{\Delta_i} + \left(1 + \frac{\pi^2}{3}\right) \sum_{j=1}^{K} \Delta_j$$

The UCB1 selection rule at round $t$ is:

$$a(t) = \arg\max_k \left[ \hat{\mu}_k + \sqrt{\frac{2 \ln t}{n_k(t)}} \right]$$

**Asymptotic comparison:** Both Thompson Sampling and UCB1 achieve $O(\ln T)$ problem-dependent regret, matching the Lai-Robbins lower bound up to constants. However:

| Property | Thompson Sampling | UCB1 |
|---|---|---|
| Problem-dependent bound | $(1+\epsilon) \sum \frac{\ln T}{\Delta_i}$ | $8 \sum \frac{\ln T}{\Delta_i} + O(K)$ |
| Problem-independent bound | $O(\sqrt{KT \ln T})$ | $O(\sqrt{KT \ln T})$ |
| Constant factor | Near-optimal (approaches 1) | 8 (much larger) |
| Delayed feedback robustness | High (Chapelle & Li, 2011) | Low (degrades significantly) |
| Computational cost per step | $O(K)$ (sample from K posteriors) | $O(K)$ (compute K UCBs) |

**Practical convergence difference:** Chapelle and Li (2011) in "An Empirical Evaluation of Thompson Sampling" (NeurIPS 2011) demonstrated that Thompson Sampling empirically converges faster than UCB1, particularly with delayed or batched feedback. When feedback was delayed by one hour (common in code review settings where test results take time), Thompson Sampling significantly outperformed UCB variants. The randomized nature of Thompson Sampling makes it naturally robust to delay, while the deterministic UCB strategy suffers because delayed feedback means confidence bounds are temporarily miscalibrated.

### 2.5 Information-Theoretic Analysis (Russo and Van Roy, 2016)

Russo and Van Roy ("An Information-Theoretic Analysis of Thompson Sampling," JMLR 17(68):1-30, 2016) introduced the information ratio framework, factoring Bayesian regret into:

$$\text{BayesRegret}(T) \leq \sqrt{\Gamma^* \cdot H(\theta^*) \cdot T}$$

where $\Gamma^*$ is the information ratio (the ratio between the squared expected regret per round and the mutual information gained about the optimal arm) and $H(\theta^*)$ is the entropy of the optimal action under the prior. For Thompson Sampling, $\Gamma^* \leq K/2$, yielding a Bayesian regret bound of $O(\sqrt{KH(\theta^*)T})$.

Their analysis also introduced Information-Directed Sampling (IDS), which directly minimizes the information ratio and achieves strictly better information ratios than Thompson Sampling in some settings.

---

## 3. Contextual Bandits and Trust with Side Information

### 3.1 LinUCB (Li et al., 2010)

Li, Chu, Langford, and Schapire introduced LinUCB in "A Contextual-Bandit Approach to Personalized News Article Recommendation" (WWW 2010, ACM). The setting generalizes the multi-armed bandit: at each round $t$, the learner observes a context vector $\mathbf{x}_t$ and must choose an arm $a_t$.

LinUCB assumes a linear payoff model:

$$\mathbb{E}[r_{t,a} | \mathbf{x}_t] = \mathbf{x}_t^\top \boldsymbol{\theta}_a$$

The algorithm maintains, for each arm $a$, a design matrix $\mathbf{A}_a$ and response vector $\mathbf{b}_a$, updated via ridge regression:

$$\hat{\boldsymbol{\theta}}_a = \mathbf{A}_a^{-1} \mathbf{b}_a$$

The selection rule incorporates an upper confidence bound:

$$a(t) = \arg\max_a \left[ \hat{\boldsymbol{\theta}}_a^\top \mathbf{x}_t + \alpha \sqrt{\mathbf{x}_t^\top \mathbf{A}_a^{-1} \mathbf{x}_t} \right]$$

where $\alpha$ controls the exploration-exploitation tradeoff.

In their empirical evaluation on Yahoo's front page recommendation system (33+ million events), LinUCB achieved a 12.5% click-through rate improvement over context-free bandits.

### 3.2 Contextual Thompson Sampling

Agrawal and Goyal ("Thompson Sampling for Contextual Bandits with Linear Payoffs," ICML 2013, PMLR 28(3):127-135) extended Thompson Sampling to the linear contextual setting. The algorithm samples $\tilde{\boldsymbol{\theta}}_a$ from the posterior distribution over the regression coefficients:

$$\tilde{\boldsymbol{\theta}}_a \sim \mathcal{N}\left(\hat{\boldsymbol{\theta}}_a, v^2 \mathbf{A}_a^{-1}\right)$$

and selects $a(t) = \arg\max_a \tilde{\boldsymbol{\theta}}_a^\top \mathbf{x}_t$.

The regret bound is $O(d\sqrt{T} \ln^{3/2}(T))$, where $d$ is the context dimension, matching minimax-optimal rates for linear bandits up to logarithmic factors.

### 3.3 Application to Trust Calibration: The Autonomy Boundary Selection Problem

In an AI coding harness, the trust calibration decision is inherently contextual. The "arms" are trust levels (e.g., $\{$autonomous, supervised, governed$\}$), and the context encodes features of the current action:

**Context features for trust calibration:**

| Feature | Type | Rationale |
|---|---|---|
| File type (source, config, test) | Categorical | Tests carry less risk than production code |
| Estimated complexity (lines changed, AST depth) | Continuous | Complex changes are riskier |
| Agent identity (model version, system prompt) | Categorical | Different agents have different reliability profiles |
| Task novelty (distance from training distribution) | Continuous | Unfamiliar tasks warrant more oversight |
| Historical failure rate for (agent, task-type) pair | Continuous | Direct reliability signal |
| Time since last model update | Continuous | Reliability may drift after updates |
| Repository familiarity (previous successful actions in this repo) | Continuous | Agent may be better calibrated to familiar codebases |

**The contextual bandit formulation for the autonomy boundary:** At each time step, the harness observes context $\mathbf{x}_t$ (the features above), selects a governance level $a_t \in \{$trust, review, block$\}$, and receives reward $r_t$ encoding the outcome quality minus the governance overhead cost. The contextual Thompson Sampling algorithm learns a posterior over the mapping from context to optimal governance level, naturally exploring governance levels that are uncertain while exploiting governance levels that have proven effective.

### 3.4 The EXP4 Connection: Adversarial Contexts

When the environment may be adversarial (an agent might strategically exploit trust), the EXP4 algorithm (Auer et al., "The Non-stochastic Multiarmed Bandit Problem," JCSS 65(2):284-298, 2002) provides worst-case guarantees. EXP4 maintains a probability distribution over $N$ expert policies, each mapping contexts to arms, and achieves $O(\sqrt{KT \ln N})$ regret against the best expert in hindsight. In the trust calibration setting, each "expert" could be a different trust policy (e.g., "always review Python files," "trust agent A on test files"), and EXP4 would converge to the best such policy without stochastic assumptions.

---

## 4. Bayesian Decision Theory and Asymmetric Costs

### 4.1 The Berger Framework

James O. Berger's "Statistical Decision Theory and Bayesian Analysis" (2nd edition, Springer, 1985) provides the canonical treatment. The framework consists of:

- A **state space** $\Theta$ (e.g., "this code action is correct" or "this code action contains a bug")
- An **action space** $\mathcal{A}$ (e.g., $\{$trust, review$\}$)
- A **loss function** $L(\theta, a)$ specifying the cost of taking action $a$ when the true state is $\theta$

The **Bayes risk** of a decision rule $\delta$ under prior $\pi$ is:

$$r(\pi, \delta) = \int_\Theta \int_\mathcal{X} L(\theta, \delta(x)) p(x|\theta) \, dx \, \pi(\theta) \, d\theta$$

The **Bayes optimal** decision rule minimizes the posterior expected loss:

$$\delta^*(x) = \arg\min_{a \in \mathcal{A}} \sum_{\theta \in \Theta} L(\theta, a) \, P(\theta | x)$$

A decision rule is **admissible** if no other rule has uniformly lower risk across all $\theta$. Berger (1985, Section 4.8) proves that every Bayes rule with respect to a strictly positive prior is admissible, and conversely, every admissible rule is either a Bayes rule or a limit of Bayes rules (complete class theorem).

The **minimax** decision rule minimizes the worst-case risk:

$$\delta^{\text{mm}} = \arg\min_\delta \max_\theta R(\theta, \delta)$$

Minimax rules are appropriate when we lack a trustworthy prior, which may apply during cold-start phases of trust calibration.

### 4.2 The Trust-Review Decision as a Binary Decision Problem

Define the binary state: $\theta = 1$ (the code action requires human review; i.e., it would introduce a defect if trusted) and $\theta = 0$ (the code action is safe to trust). The available actions: $a \in \{G, F\}$ where $G$ = governed (review) and $F$ = free (trust).

The loss matrix:

|  | $\theta = 0$ (safe) | $\theta = 1$ (defective) |
|---|---|---|
| $a = F$ (trust) | 0 | $c_{FG}$ (missed defect) |
| $a = G$ (review) | $c_{GF}$ (unnecessary review) | 0 |

Here, $c_{FG}$ is the cost of a false negative (trusting defective code, which may cause production incidents, security vulnerabilities, or cascading errors), and $c_{GF}$ is the cost of a false positive (reviewing safe code, which wastes developer attention).

The fundamental asymmetry: $c_{FG} \gg c_{GF}$. A missed critical bug deployed to production might cost hours or days of incident response, while an unnecessary review costs minutes of developer time. Typical cost ratios in practice might range from $c_{FG}/c_{GF} \approx 10$ (for non-critical code) to $c_{FG}/c_{GF} \approx 100$ or more (for security-sensitive or infrastructure code).

---

## 5. Asymmetric Cost Decision Rules and the Optimal Trust Threshold

### 5.1 Derivation of the Optimal Threshold

Given the loss matrix above, the posterior expected loss for each action is:

$$\mathbb{E}[L(\theta, F) | x] = c_{FG} \cdot P(\theta = 1 | x)$$

$$\mathbb{E}[L(\theta, G) | x] = c_{GF} \cdot P(\theta = 0 | x) = c_{GF} \cdot (1 - P(\theta = 1 | x))$$

The Bayes-optimal rule selects $a = G$ (review) when:

$$\mathbb{E}[L(\theta, G) | x] < \mathbb{E}[L(\theta, F) | x]$$

$$c_{GF} \cdot (1 - P(\theta = 1 | x)) < c_{FG} \cdot P(\theta = 1 | x)$$

Solving for the threshold:

$$c_{GF} - c_{GF} \cdot P(\theta = 1 | x) < c_{FG} \cdot P(\theta = 1 | x)$$

$$c_{GF} < (c_{FG} + c_{GF}) \cdot P(\theta = 1 | x)$$

$$\boxed{P(\theta = 1 | x) > \frac{c_{GF}}{c_{FG} + c_{GF}} \implies \text{Review}}$$

This is the **asymmetric cost decision threshold**. When $c_{FG} \gg c_{GF}$, the threshold is very low, meaning we should review even when there is a small probability of defect.

**Numerical example:** If $c_{FG} = 100$ (cost of missed defect) and $c_{GF} = 1$ (cost of unnecessary review), the threshold is $1/(100 + 1) \approx 0.0099$. The harness should review whenever there is even a 1% chance the code is defective.

### 5.2 Connection to the Neyman-Pearson Lemma

The Neyman-Pearson lemma (Neyman and Pearson, 1933) establishes that the likelihood ratio test is the uniformly most powerful test at any given significance level $\alpha$. The optimal test rejects the null hypothesis (safe code) when:

$$\frac{p(\mathbf{x} | \theta = 1)}{p(\mathbf{x} | \theta = 0)} > k(\alpha)$$

where $k(\alpha)$ is chosen to achieve false positive rate $\alpha$.

The Bayesian decision rule with asymmetric costs is related but distinct: it incorporates prior probabilities and cost ratios, yielding a threshold on the posterior rather than the likelihood ratio. When the prior is known, the Bayesian approach is strictly more informative. The Neyman-Pearson approach is appropriate when costs and priors are unavailable, corresponding to the minimax perspective (Berger, 1985, Chapter 5).

In the trust calibration setting, we generally have access to empirical priors (base rates of defective code from historical data), making the Bayesian threshold preferred. The Neyman-Pearson approach serves as a fallback during cold-start.

### 5.3 The Cost Ratio as a Governance Dial

The ratio $c_{GF} / c_{FG}$ serves as a single tunable parameter controlling the autonomy boundary. This maps directly to organizational risk appetite:

| Context | $c_{FG}/c_{GF}$ | Threshold | Interpretation |
|---|---|---|---|
| Test file in dev branch | 5 | 0.167 | Moderate autonomy |
| Production source code | 50 | 0.020 | Low threshold; review most actions |
| Security-critical code | 200 | 0.005 | Review almost everything |
| Documentation / comments | 2 | 0.333 | High autonomy |

---

## 6. Restless Bandits and Non-Stationary Trust

### 6.1 Whittle's Formulation

Whittle (1988), in "Restless Bandits: Activity Allocation in a Changing World" (Journal of Applied Probability, 25:287-298), generalized the classic bandit problem to the restless setting where arm states evolve whether or not the arm is played. Formally:

- $N$ arms, each with state $s_n \in \mathcal{S}$
- At each time, the decision maker activates $M \leq N$ arms
- Each arm evolves according to transition kernels: $P_n^{(1)}(s' | s)$ when active, $P_n^{(0)}(s' | s)$ when passive
- Objective: maximize $\sum_{t=1}^T \sum_{n=1}^N r_n(s_{n,t}, a_{n,t})$ subject to $\sum_n a_{n,t} \leq M$

**Why static trust is insufficient:** In the AI coding harness setting, agent reliability changes over time due to model updates, distribution shift in the codebase, evolving coding standards, and accumulated context degradation. A trust calibration system that treats arm (agent-task) rewards as stationary will eventually diverge from reality.

### 6.2 The Whittle Index and Indexability

Whittle proposed a Lagrangian relaxation approach. Rather than enforcing $\sum_n a_{n,t} \leq M$ as a hard constraint, he introduced a subsidy $\lambda$ for passivity, leading to $N$ decoupled single-arm problems:

$$\max_{\pi_n} \mathbb{E}\left[\sum_{t=0}^{\infty} \gamma^t \left(r_n(s_{n,t}, a_{n,t}) - \lambda a_{n,t}\right)\right]$$

The **Whittle index** $W_n(s)$ is the value of $\lambda$ at which it becomes equally attractive to activate or not activate arm $n$ in state $s$:

$$W_n(s) = \inf\{\lambda : Q_{n,\lambda}(s, 0) = Q_{n,\lambda}(s, 1)\}$$

**Indexability condition:** An arm is indexable if the set of states where the passive action is optimal is monotonically increasing in $\lambda$. When all arms are indexable, the Whittle index policy (activate the $M$ arms with highest Whittle indices) is asymptotically optimal as $N \to \infty$ (Weber and Weiss, 1990).

### 6.3 Non-Stationary Extensions

Recent work by Xiong et al. ("Online Learning of Whittle Indices for Restless Bandits with Non-Stationary Transition Kernels," arXiv:2506.18186, 2025) addresses the setting where transition kernels $P_{n,t}$ change over time, subject to a total variation budget:

$$\max_{(s,a)} \sum_{s' \in \mathcal{S}} |P_{n,t}(s'|s,a) - P_{n,t-1}(s'|s,a)| \leq V_n / T$$

Their Sliding-Window Online Whittle (SW-Whittle) policy achieves dynamic regret:

$$\text{Reg}(T) \leq \tilde{O}\left(T^{2/3} \tilde{V}^{1/3} + T^{4/5}\right)$$

where $\tilde{V} = \max_n V_n$ is the total variation. The $T^{4/5}$ term dominates when variation is small (nearly stationary), while $T^{2/3}\tilde{V}^{1/3}$ captures the cost of environmental drift.

**Application to trust calibration:** When an AI model is updated (e.g., from Claude Sonnet 4 to a hypothetical successor), the transition kernel for every (agent, task) arm changes. The sliding-window approach forgets old data at the appropriate rate, adapting trust levels to the new model's reliability profile without requiring a full trust reset.

---

## 7. Clinical Trial Design Analogues

### 7.1 The Structural Analogy

Clinical trials face a decision problem structurally isomorphic to trust calibration:

| Clinical Trial | Trust Calibration |
|---|---|
| Patient assignment to treatment | Code action assignment to governance level |
| Treatment efficacy (unknown) | Agent reliability (unknown) |
| Ethical constraint: minimize patient harm | Cost constraint: minimize escaped defects |
| Statistical constraint: maintain power | Statistical constraint: maintain exploration |
| Stopping rule: halt trial early | Stopping rule: freeze trust level |

### 7.2 The Randomized Play-the-Winner Rule

Wei and Durham (1978) proposed the Randomized Play-the-Winner (RPW) rule using an urn model. The urn contains balls of two types (one per treatment). Each allocation is made by drawing a ball; the urn composition is updated based on the response:

- A success on treatment A adds type-A balls
- A failure on treatment A adds type-B balls

This creates a positive feedback loop: treatments with higher observed success rates receive more patients. In the trust calibration analogue: governance levels that produce good outcomes (autonomous actions that pass review, reviewed actions that catch real bugs) should be allocated more frequently.

### 7.3 Group Sequential Designs and Stopping Rules

Clinical trials use group sequential designs with generalized likelihood ratio (GLR) stopping rules (Lai, 1987; Bartroff and Lai, 2010). Patients are enrolled in groups, and at each interim analysis, the trial may stop for:

- **Efficacy:** The treatment is clearly superior (GLR statistic exceeds threshold $a_\alpha$)
- **Futility:** The treatment is clearly inferior (comparison statistic exceeds $b_\alpha$)

The asymptotic lower bound on expected sample size per arm is:

$$\mathbb{E}_\theta[T_k] \geq \frac{(1 + o(1)) |\ln \alpha|}{I(\theta, \theta_0)}$$

where $I(\theta, \theta_0)$ is the Kullback-Leibler divergence between the true and null parameter values, and $\alpha$ is the significance level.

**Application to trust calibration:** After sufficient evidence, the harness can "stop" exploring a governance level for a particular (agent, task-type) pair: either permanently trusting (if reliability is convincingly high) or permanently reviewing (if reliability is convincingly low). The KL-based sample size bound tells us how many observations are needed before such a decision is statistically justified.

### 7.4 Ethical Constraints as Forced Sampling

Bartroff and Lai (2010, "Efficient Adaptive Randomization and Stopping Rules in Multi-arm Clinical Trials," Sequential Analysis, 31(4):310-334) enforce a minimum allocation constraint:

$$p_{i,t} \geq \epsilon \quad \text{for some } 0 < \epsilon \leq \frac{1}{k+1}$$

This "forced sampling" requirement, borrowed from bandit literature, prevents patients from being systematically denied potentially beneficial treatments based on incomplete data. In the trust calibration analogue, it prevents the harness from permanently trusting (or permanently reviewing) before accumulating sufficient evidence; a minimum fraction of actions must receive each governance level.

### 7.5 Forward-Looking Gittins Index

Villar, Bowden, and Wason ("Multi-armed Bandit Models for the Optimal Design of Clinical Trials: Benefits and Challenges," Statistical Science, 30(2):199-215, 2015) introduced the Forward-Looking Gittins Index (FLGI) for clinical trials. Unlike the classic Gittins index (Gittins, 1979, "Bandit Processes and Dynamic Allocation Indices," JRSS-B, 41(2):148-177), which is optimal only for infinite-horizon discounted problems, the FLGI adapts to finite horizons and incorporates randomization. Their results showed that bandit-based designs simultaneously optimize statistical power and patient benefit, achieving a favorable balance between exploration and exploitation that neither pure bandit algorithms nor pure sequential designs achieve alone.

---

## 8. Online Learning with Expert Advice and Sleeping Experts

### 8.1 The Sleeping Experts Problem

Kleinberg, Niculescu-Mizil, and Sharma ("Regret Bounds for Sleeping Experts and Bandits," Machine Learning, 80(2-3):245-272, 2010) formalized the sleeping experts problem: an online decision problem where the set of available actions varies over time. In each round $t$:

1. A subset $\mathcal{A}_t \subseteq \{1, \ldots, K\}$ of actions is "awake" (available)
2. The learner selects $a_t \in \mathcal{A}_t$
3. Rewards are revealed (full-information or bandit feedback)

The benchmark is the best ordering of actions: the best fixed function mapping subsets of awake actions to a ranking, with the algorithm's performance compared against always playing the highest-ranked awake action.

### 8.2 Key Results

Kleinberg et al. provided nearly information-theoretically optimal regret bounds for both the full-information and bandit settings, both stochastic and adversarial. Their framework handles:

- Actions that become temporarily unavailable (an agent is down for maintenance, a model version is deprecated)
- Variable action sets (new agents are added, old ones retired)
- Non-uniform availability patterns (some agents only handle certain file types)

However, Kanade and Steinke (2014, "Learning Hurdles for Sleeping Experts," ACM TOCT, 6(3):11:1-11:16) showed that efficiently achieving the optimal regret bound is computationally hard: an efficient no-regret sleeping experts algorithm would imply efficient PAC learning of DNF formulas, a long-standing open problem in computational learning theory.

### 8.3 Connection to Dynamic Trust Calibration

In the harness setting, "sleeping" arises naturally:

- An agent (model version) is temporarily unavailable during an API outage
- Certain governance levels are disabled for specific file types (e.g., security-critical files always require review; the "trust" arm is asleep)
- Task types appear and disappear based on the developer's current work (no image processing tasks this sprint)

The sleeping experts framework guarantees that the trust calibration algorithm remains competitive even when the action space changes, without requiring a restart or re-initialization of learned trust parameters.

### 8.4 Specialist Experts

Freund et al. ("An Efficient Boosting Algorithm for Combining Preferences," JMLR, 2003) introduced specialist experts: experts that make predictions only on inputs they are qualified for. This maps to the trust calibration setting where different governance policies specialize in different contexts (e.g., "trust the agent on test files" is a specialist that is active only when the current action involves test files).

---

## 9. Bayesian Optimization, Active Learning, and the Attention Allocation Problem

### 9.1 Active Learning as Selective Review

Active learning addresses the question: given a limited budget of human labels, which items should we select for labeling? This is precisely the review allocation problem in a harness. The developer's attention is the limited resource; the harness must select which code actions to present for review to maximize the value of that attention.

### 9.2 BALD: Bayesian Active Learning by Disagreement

Houlsby, Huszar, Ghahramani, and Lengyel ("Bayesian Active Learning for Classification and Preference Learning," arXiv:1112.5745, 2011) introduced BALD, which selects the data point maximizing the mutual information between the prediction and the model parameters:

$$\alpha_{\text{BALD}}(\mathbf{x}) = \mathbb{H}[y | \mathbf{x}, \mathcal{D}] - \mathbb{E}_{p(\boldsymbol{\theta} | \mathcal{D})} \left[\mathbb{H}[y | \mathbf{x}, \boldsymbol{\theta}]\right]$$

Intuitively, BALD selects the input $\mathbf{x}$ for which the model is marginally most uncertain about the output (high first term) but individually confident under each parameter setting (low second term). In other words, it finds the point where the model's posterior disagrees the most, indicating maximum epistemic uncertainty.

**Trust calibration interpretation:** Select for review the code action where the trust model is most uncertain. If the posterior over "is this action safe?" has high variance (the model might be reliable here, or might not), that action is the most informative to review. The review outcome (was the code actually correct?) provides maximum information about the agent's reliability in this context.

### 9.3 Entropy Search and Information-Theoretic Acquisition Functions

Hennig and Schuler ("Entropy Search for Information-Efficient Global Optimization," JMLR, 13:1809-1837, 2012) introduced Entropy Search (ES), which selects the evaluation point maximizing the expected reduction in entropy of the optimizer's location:

$$\alpha_{\text{ES}}(\mathbf{x}) = \mathbb{H}[p(\mathbf{x}^*)] - \mathbb{E}_{p(y|\mathbf{x},\mathcal{D})}[\mathbb{H}[p(\mathbf{x}^* | \mathcal{D} \cup \{(\mathbf{x}, y)\})]]$$

Hernandez-Lobato, Hoffman, and Ghahramani ("Predictive Entropy Search for Efficient Global Optimization of Black-box Functions," NeurIPS 2014) simplified this via the symmetry of mutual information:

$$\alpha_{\text{PES}}(\mathbf{x}) = \mathbb{H}[p(y | \mathcal{D}, \mathbf{x})] - \mathbb{E}_{p(\mathbf{x}^* | \mathcal{D})}[\mathbb{H}[p(y | \mathcal{D}, \mathbf{x}, \mathbf{x}^*)]]$$

Wang and Jegelka ("Max-value Entropy Search for Efficient Bayesian Optimization," ICML 2017) further simplified by focusing on the optimal value rather than the optimal location, reducing dimensionality:

$$\alpha_{\text{MES}}(\mathbf{x}) = \mathbb{H}[p(y | \mathcal{D}, \mathbf{x})] - \mathbb{E}[\mathbb{H}[p(y | \mathcal{D}, \mathbf{x}, y^*)]]$$

**Trust calibration connection:** The "optimal location" in the trust setting is the optimal governance policy (the mapping from contexts to governance levels). Each review provides one observation. The information-theoretic acquisition function tells us which action to review next to maximally reduce our uncertainty about the optimal policy, rather than just the optimal action for the current instance.

---

## 10. Empirical Applications of Bandits to Human-AI Systems

### 10.1 Dynamic Trust Calibration Using Contextual Bandits (Henrique et al., 2025)

The most directly relevant empirical work is Henrique et al. ("Dynamic Trust Calibration Using Contextual Bandits," arXiv:2509.23497, 2025), which formalizes trust calibration as a contextual bandit problem.

**Formulation:** The Trust Calibration Distance measures the gap between optimal and actual team performance:

$$T(\tau_t) = \left|\sum_t R(o^*_t, \mathbf{x}_t) - \sum_t r(o_t, \mathbf{x}_t)\right|$$

where $o^*_t$ is the optimal opinion and $o_t$ is the actually adopted opinion. Perfect calibration occurs when $T = 0$.

**Augmented context:** The context vector combines decision features with agent opinions: $\mathbf{x}^{(c)} = \{x_1, \ldots, x_J, o_1, \ldots, o_M, o\}$, where $o_i$ are individual agent opinions and $o$ is the team consensus.

**Algorithms tested:** LinUCB, decision tree bandits, and neural network bandits. LinUCB uses the standard formulation with UCB:

$$\text{UCB}_{o,t} = \hat{\boldsymbol{\theta}}_o^\top \mathbf{x}_t^{(c)} + \sqrt{(\mathbf{x}_t^{(c)})^\top \mathbf{A}_o^{-1} \mathbf{x}_t^{(c)}}$$

**Key results across three datasets:**

| Domain | Baseline Reward | CB Best Result | Improvement | Trust Distance Reduction |
|---|---|---|---|---|
| Speed Dating (High Agreement) | 1,537/2,400 | 2,263/2,400 | 47% | 84% |
| Criminal Risk Assessment | 635,340/1.1M | 726,313/1.1M | 14% | -- |
| Medical Diagnosis | 5,979/8,619 | 7,858/8,619 | 31% | 71% |

No single algorithm consistently dominated across domains; LinUCB excelled in speed dating, decision trees in risk assessment, and neural networks in medical diagnosis.

### 10.2 Human-AI Collaboration with Bandit Feedback (Gao et al., 2021)

Gao, Saar-Tsechansky, De-Arteaga, Han, Lee, and Lease ("Human-AI Collaboration with Bandit Feedback," IJCAI 2021, pp. 1722-1728) addressed the complementarity problem: neither humans nor AI dominate across all instances. Their bandit-based routing system learns which tasks to route to humans versus algorithms, receiving only bandit feedback (reward for the selected action, not the counterfactual).

**Key finding:** The bandit-based routing system outperformed both the human alone and the algorithm alone. Furthermore, personalized routing (different policies for different human decision-makers) further improved team performance. This validates the contextual bandit approach to trust calibration: the system learns not just when to trust the AI, but when to trust which specific human-AI pairing.

### 10.3 Human-AI Learning Performance in Multi-Armed Bandits (Pandya et al., 2019)

Pandya et al. ("Human-AI Learning Performance in Multi-Armed Bandits," AAAI/ACM AIES 2019) used multi-armed bandits as a controlled environment to study human-AI collaboration. Their counterintuitive finding: an agent's solo performance does not necessarily predict human-agent team performance. A drop in agent performance can sometimes improve team performance, suggesting that imperfect AI agents may prompt more critical human engagement.

---

## 11. Worked Example: Thompson Sampling for Trust Calibration

### Setup

Consider a coding harness with a single AI agent and two governance levels:

- **Arm 1: Trust** (let the agent's code pass without review)
- **Arm 2: Review** (send the code for human review)

The true, unknown probabilities:

- $P(\text{good outcome} | \text{Trust}) = \theta_1 = 0.92$ (the agent produces correct code 92% of the time)
- $P(\text{good outcome} | \text{Review}) = \theta_2 = 0.99$ (review catches most errors; 99% good outcomes)

But reviews are expensive: the reward for a good outcome under Trust is $r = 1$, while the reward for a good outcome under Review is $r = 0.7$ (accounting for developer time cost). A bad outcome under Trust yields $r = -5$ (production bug); a bad outcome under Review yields $r = -0.3$ (minor cost of reviewing safe code).

Expected rewards:

- $\mu_1 = 0.92 \cdot 1 + 0.08 \cdot (-5) = 0.92 - 0.40 = 0.52$
- $\mu_2 = 0.99 \cdot 0.7 + 0.01 \cdot (-0.3) = 0.693 - 0.003 = 0.69$

So reviewing is actually optimal here (due to the high cost of missed bugs), but the harness does not know this initially.

### Simulation (20 rounds)

We use Beta(1,1) uniform priors for both arms (rescaled to the reward range).

For simplicity, we model each arm as a Bernoulli with "success" = good outcome. The Thompson Sampling agent must learn which governance level yields higher expected reward.

| Round | $\text{Beta}_1$ (Trust) | $\text{Beta}_2$ (Review) | Sample$_1$ | Sample$_2$ | Action | Outcome | Reward |
|---|---|---|---|---|---|---|---|
| 1 | (1,1) | (1,1) | 0.73 | 0.41 | Trust | Good | +1.0 |
| 2 | (2,1) | (1,1) | 0.88 | 0.62 | Trust | Good | +1.0 |
| 3 | (3,1) | (1,1) | 0.61 | 0.78 | Review | Good | +0.7 |
| 4 | (3,1) | (2,1) | 0.79 | 0.55 | Trust | Good | +1.0 |
| 5 | (4,1) | (2,1) | 0.91 | 0.93 | Review | Good | +0.7 |
| 6 | (4,1) | (3,1) | 0.85 | 0.72 | Trust | **Bad** | -5.0 |
| 7 | (4,2) | (3,1) | 0.56 | 0.81 | Review | Good | +0.7 |
| 8 | (4,2) | (4,1) | 0.72 | 0.69 | Trust | Good | +1.0 |
| 9 | (5,2) | (4,1) | 0.44 | 0.88 | Review | Good | +0.7 |
| 10 | (5,2) | (5,1) | 0.78 | 0.77 | Trust | Good | +1.0 |

**After round 6:** The single bad outcome under Trust shifts the posterior from Beta(4,1) (mean 0.80) to Beta(4,2) (mean 0.67). Thompson Sampling now samples lower values for Trust, naturally increasing the probability of selecting Review. This is the Bayesian update in action: a single failure under high-cost conditions reshapes the posterior enough to change behavior.

**By round 20:** After roughly 12 Trust selections (11 good, 1 bad) and 8 Review selections (8 good, 0 bad), the posteriors are approximately Beta(12, 2) for Trust (mean 0.857) and Beta(9, 1) for Review (mean 0.9). The algorithm has begun to favor Review, reflecting the true expected-reward ordering.

**Convergence behavior:** Unlike UCB1, which would deterministically lock onto one arm once the confidence bounds separate, Thompson Sampling continues to occasionally sample the suboptimal arm when the posterior produces an unusually high sample. This persistent exploration provides insurance against model drift and non-stationarity.

---

## 12. Synthesis: A Unified Framework for Bandit-Based Trust Calibration

### 12.1 The Full Architecture

Combining the formal results surveyed above, the trust calibration system in an AI coding harness can be structured as:

1. **State estimation** (Bayesian posterior): Maintain a posterior distribution over each (agent, task-type, context) tuple's reliability, updated via Beta-Bernoulli (or Gaussian for continuous rewards) conjugate models.

2. **Action selection** (contextual Thompson Sampling): At each decision point, sample from each governance level's posterior expected reward (conditioned on context features), and select the governance level with the highest sample.

3. **Threshold modulation** (asymmetric cost Bayesian decision rule): Before applying the Thompson sample, apply the asymmetric cost threshold. If $P(\text{defect} | \mathbf{x}) > c_{GF}/(c_{FG} + c_{GF})$ under the current posterior, override to Review regardless of the Thompson sample. This ensures that the exploration inherent in Thompson Sampling never causes catastrophic failures when the cost asymmetry is extreme.

4. **Non-stationarity adaptation** (sliding window): Use a sliding window of recent observations to compute posteriors, forgetting old data at rate proportional to the expected rate of environmental change (model updates, codebase drift). The window size $w$ balances recency (small $w$, fast adaptation) against stability (large $w$, lower variance).

5. **Cold-start** (minimax + forced sampling): During cold-start (new agent, new task type, new repository), use the minimax decision rule (default to Review) with forced sampling to guarantee minimum exploration of the Trust arm. The minimum allocation $\epsilon \geq 1/(K+1)$ from the clinical trial literature ensures that trust can be established but only at a rate proportional to accumulated evidence.

6. **Sleeping arms** (Kleinberg et al., 2010): When agents or governance levels become unavailable (API outage, policy change, file-type restriction), use the sleeping experts framework to maintain valid regret guarantees without reinitializing trust parameters.

### 12.2 Regret Guarantees for the Combined System

Under the contextual Thompson Sampling framework with $d$-dimensional context, $K$ governance levels, and horizon $T$:

- **Stationary setting:** $O(d\sqrt{KT} \ln^{3/2} T)$ regret (Agrawal and Goyal, 2013)
- **Non-stationary setting with total variation $V$:** $\tilde{O}(T^{2/3} V^{1/3} + T^{4/5})$ dynamic regret (Xiong et al., 2025)
- **Adversarial setting:** $O(\sqrt{KT \ln N})$ via EXP4 with $N$ expert policies (Auer et al., 2002)

### 12.3 Open Questions

1. **Cost ratio estimation.** The asymmetric threshold $c_{GF}/(c_{FG} + c_{GF})$ requires knowing the cost ratio. In practice, this must be estimated or elicited. Bayesian approaches to cost estimation (placing priors on the cost ratio itself and updating from observed incident data) are theoretically clean but empirically unstudied in this domain.

2. **Curse of dimensionality in context.** With many context features, the contextual bandit convergence slows as $O(d\sqrt{T})$. Feature selection or dimensionality reduction for trust-relevant context is an open engineering problem.

3. **Multi-objective regret.** Trust calibration has multiple objectives (minimize escaped defects, minimize review burden, maximize developer satisfaction). Multi-objective bandit theory (Drugan and Nowe, 2013) could provide Pareto-optimal trust policies, but this is largely unexplored.

4. **Strategic agents.** If the AI agent can observe and adapt to the trust calibration policy (a realistic concern with future agent architectures), the stochastic bandit assumption breaks. Adversarial bandit formulations (EXP4) or mechanism design approaches may be necessary.

---

## References

1. Thompson, W. R. (1933). On the likelihood that one unknown probability exceeds another in view of the evidence of two samples. *Biometrika*, 25(3-4):285-294.

2. Lai, T. L. and Robbins, H. (1985). Asymptotically efficient adaptive allocation rules. *Advances in Applied Mathematics*, 6(1):4-22.

3. Whittle, P. (1988). Restless bandits: Activity allocation in a changing world. *Journal of Applied Probability*, 25:287-298.

4. Berger, J. O. (1985). *Statistical Decision Theory and Bayesian Analysis*, 2nd edition. Springer.

5. Gittins, J. C. (1979). Bandit processes and dynamic allocation indices. *Journal of the Royal Statistical Society, Series B*, 41(2):148-177.

6. Auer, P., Cesa-Bianchi, N., and Fischer, P. (2002). Finite-time analysis of the multiarmed bandit problem. *Machine Learning*, 47:235-256.

7. Auer, P., Cesa-Bianchi, N., Freund, Y., and Schapire, R. E. (2002). The non-stochastic multiarmed bandit problem. *SIAM Journal on Computing*, 32(1):48-77.

8. Li, L., Chu, W., Langford, J., and Schapire, R. E. (2010). A contextual-bandit approach to personalized news article recommendation. *WWW 2010*, ACM.

9. Kleinberg, R., Niculescu-Mizil, A., and Sharma, Y. (2010). Regret bounds for sleeping experts and bandits. *Machine Learning*, 80(2-3):245-272.

10. Chapelle, O. and Li, L. (2011). An empirical evaluation of Thompson sampling. *NeurIPS 2011*.

11. Houlsby, N., Huszar, F., Ghahramani, Z., and Lengyel, M. (2011). Bayesian active learning for classification and preference learning. *arXiv:1112.5745*.

12. Hennig, P. and Schuler, C. J. (2012). Entropy search for information-efficient global optimization. *JMLR*, 13:1809-1837.

13. Kaufmann, E., Korda, N., and Munos, R. (2012). Thompson sampling: An asymptotically optimal finite-time analysis. *ALT 2012*, Springer LNCS 7568.

14. Agrawal, S. and Goyal, N. (2012). Analysis of Thompson sampling for the multi-armed bandit problem. *COLT 2012*.

15. Agrawal, S. and Goyal, N. (2013a). Further optimal regret bounds for Thompson sampling. *AISTATS 2013*, PMLR 31:99-107.

16. Agrawal, S. and Goyal, N. (2013b). Thompson sampling for contextual bandits with linear payoffs. *ICML 2013*, PMLR 28(3):127-135.

17. Russo, D. and Van Roy, B. (2016). An information-theoretic analysis of Thompson sampling. *JMLR*, 17(68):1-30.

18. Wei, L. J. and Durham, S. (1978). The randomized play-the-winner rule in medical trials. *Journal of the American Statistical Association*, 73(364):840-843.

19. Bartroff, J. and Lai, T. L. (2010). Efficient adaptive randomization and stopping rules in multi-arm clinical trials for testing a new treatment. *Sequential Analysis*, 31(4):310-334.

20. Villar, S. S., Bowden, J., and Wason, J. (2015). Multi-armed bandit models for the optimal design of clinical trials: Benefits and challenges. *Statistical Science*, 30(2):199-215.

21. Gao, R., Saar-Tsechansky, M., De-Arteaga, M., Han, L., Lee, M. K., and Lease, M. (2021). Human-AI collaboration with bandit feedback. *IJCAI 2021*, pp. 1722-1728.

22. Henrique, B. M. et al. (2025). Dynamic trust calibration using contextual bandits. *arXiv:2509.23497*.

23. Pandya, R. et al. (2019). Human-AI learning performance in multi-armed bandits. *AAAI/ACM AIES 2019*.

24. Xiong, Z. et al. (2025). Online learning of Whittle indices for restless bandits with non-stationary transition kernels. *arXiv:2506.18186*.

25. Kanade, V. and Steinke, T. (2014). Learning hurdles for sleeping experts. *ACM Transactions on Computation Theory*, 6(3):11:1-11:16.

26. Hernandez-Lobato, J. M., Hoffman, M. W., and Ghahramani, Z. (2014). Predictive entropy search for efficient global optimization of black-box functions. *NeurIPS 2014*.

27. Wang, Z. and Jegelka, S. (2017). Max-value entropy search for efficient Bayesian optimization. *ICML 2017*.
