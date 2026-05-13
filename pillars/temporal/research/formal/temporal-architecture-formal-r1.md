# Temporal Architecture of AI Coding Agent Harnesses: Formal Mathematical Machinery

**Formalization Round 1**
**Date: 2026-04-03**

---

## Preamble: Scope and Epistemic Status

This document develops the formal mathematical machinery for the temporal architecture pillar of the paper. We cover five formalizations: (1) an information-theoretic model of context freshness and staleness; (2) the Verified Iterations per Hour metric with decomposition and optimization; (3) a stochastic pipeline model with speculative execution; (4) a cache-staleness tradeoff theorem with an EOQ-analog closed form; and (5) mode selection as hypothesis testing under asymmetric costs.

Epistemic markers throughout:

- **[E]** Established theory applied without modification.
- **[S]** Novel synthesis: known results composed in the agent harness setting.
- **[C]** Conjectured: motivated by empirical data but lacking formal proof.

All logarithms are base 2; entropy is in bits. LaTeX notation is used throughout.

---

## 1. Information-Theoretic Model of Context Freshness

### 1.1 Setup and Definitions [S]

We model the agent's interaction with the codebase as an information-theoretic channel. Let:

- $\mathcal{X}$: the true codebase state at time $t$, a random variable over the space of all possible codebase configurations
- $\mathcal{Y}$: the agent's internal representation of the codebase (its context)
- $C$: the context window capacity in tokens
- $\lambda$: the codebase change rate (expected number of file-level changes per unit time)

The codebase evolves stochastically. We model file-level changes as a Poisson process with rate $\lambda$, so the number of files modified in interval $[0, t]$ follows $N(t) \sim \text{Poisson}(\lambda t)$.

**Definition 1.1 (Context as a Channel).** At the moment the agent reads the codebase, its context window establishes a noisy channel $\mathcal{X} \to \mathcal{Y}$ with finite capacity $C$ (in bits). The capacity constraint arises from two sources:

1. **Token budget:** The agent can load at most $W$ tokens of codebase content. If the full codebase has $N_{\text{total}}$ tokens, the fraction observed is $W / N_{\text{total}} \leq 1$, so the channel cannot convey all of $H(\mathcal{X})$.
2. **Attention degradation:** Even within the $W$-token window, the effective information extraction degrades with context length (Chroma 2025; Liu et al. 2024). The effective channel capacity is $C_{\text{eff}} = C \cdot (1 - \delta(W))$, where $\delta$ is the degradation function from Definition 1.2 of the information architecture formalization.

**Definition 1.2 (Fresh Context Mutual Information).** When the agent performs a full, fresh read of the codebase at time $t_0$, the mutual information between its context $\mathcal{Y}$ and the true codebase state $\mathcal{X}$ is:

$$I_{\text{fresh}} = I(\mathcal{X}; \mathcal{Y}) = H(\mathcal{X}) - H(\mathcal{X} \mid \mathcal{Y})$$

This represents the maximum information the agent can have about the codebase, constrained by the channel capacity:

$$I_{\text{fresh}} \leq C_{\text{eff}}$$

The residual uncertainty $H(\mathcal{X} \mid \mathcal{Y})$ is nonzero whenever $C_{\text{eff}} < H(\mathcal{X})$, i.e., whenever the agent cannot fit the entire codebase in context with perfect fidelity. This is the typical regime: codebases have far more information than any context window can hold.

### 1.2 Context Staleness Model [S]

After the initial read at $t_0$, the codebase continues evolving while the agent's context remains frozen. The true state drifts away from the cached representation.

**Theorem 1.1 (Exponential Staleness Decay).** *Assume codebase changes follow a Poisson process with rate $\lambda$, and that each change independently invalidates a fraction $\alpha$ of the agent's cached context (where $\alpha$ is the average "information disruption" per change event). Then the mutual information between the agent's stale context and the true codebase state at time $t > t_0$ is:*

$$I_{\text{stale}}(t) = I_{\text{fresh}} \cdot e^{-\lambda \alpha (t - t_0)}$$

*Proof.* Let $\Delta t = t - t_0$. The number of change events in $[t_0, t]$ is $N(\Delta t) \sim \text{Poisson}(\lambda \Delta t)$. Each change independently invalidates a fraction $\alpha$ of the cached information. After $k$ independent changes, the fraction of context still valid is $(1 - \alpha)^k$, so the surviving mutual information is $I_{\text{fresh}} \cdot (1 - \alpha)^k$.

Taking the expectation over the Poisson-distributed number of changes:

$$I_{\text{stale}}(\Delta t) = I_{\text{fresh}} \cdot E\!\left[(1 - \alpha)^{N(\Delta t)}\right]$$

The probability generating function of a Poisson random variable $N \sim \text{Poisson}(\mu)$ evaluated at $z$ is $E[z^N] = e^{\mu(z - 1)}$. Setting $\mu = \lambda \Delta t$ and $z = 1 - \alpha$:

$$I_{\text{stale}}(\Delta t) = I_{\text{fresh}} \cdot e^{\lambda \Delta t \cdot ((1 - \alpha) - 1)} = I_{\text{fresh}} \cdot e^{-\lambda \alpha \Delta t}$$

$\square$

**Corollary 1.1 (Effective Decay Rate).** The effective information decay rate is $\Lambda = \lambda \alpha$, the product of the change frequency and the per-change disruption fraction. A codebase with high churn ($\lambda$ large) but localized changes ($\alpha$ small) may have the same effective decay as one with low churn but sweeping changes.

**Remark.** The exponential decay model is a simplification. In reality, some cached information is more robust than others (architectural patterns change rarely; implementation details change frequently). A more refined model would partition the cached information into $K$ strata with different disruption rates $\alpha_k$:

$$I_{\text{stale}}(\Delta t) = \sum_{k=1}^{K} I_k \cdot e^{-\lambda \alpha_k \Delta t}$$

where $\sum_k I_k = I_{\text{fresh}}$. This multi-exponential decay captures the empirical observation that some context remains useful for a long time (function signatures, module structure) while other context becomes stale quickly (variable states, recent edits).

### 1.3 The Context Fidelity Metric [S]

**Definition 1.3 (Context Fidelity).** The *context fidelity* at time $t$ is the normalized ratio of current mutual information to fresh mutual information:

$$\Phi(t) = \frac{I_{\text{stale}}(t)}{I_{\text{fresh}}} = e^{-\Lambda (t - t_0)}$$

Properties:
1. $\Phi(t_0) = 1$ (perfect fidelity immediately after a fresh read)
2. $\Phi(t) \to 0$ as $t \to \infty$ (complete staleness eventually)
3. $\Phi$ is monotonically decreasing and convex
4. The *half-life* of context fidelity is $t_{1/2} = \ln(2) / \Lambda$

**Definition 1.4 (Fidelity-Weighted Context Value).** The effective information available to the agent at time $t$ with context $C$ is:

$$\tilde{I}(t) = \Phi(t) \cdot f(C) \cdot (1 - \delta(|C|))$$

where $f(C)$ is the context relevance function (Definition 1.1 from the information architecture formalization), $\delta(|C|)$ is the attention degradation, and $\Phi(t)$ is the temporal fidelity. This three-factor decomposition separates: (a) what was selected ($f(C)$), (b) how well the model exploits it ($1 - \delta$), and (c) how current it is ($\Phi$).

### 1.4 The 17.1% Fresh Eyes Advantage: Information-Theoretic Interpretation [S]

The empirical observation that fresh context outperforms accumulated context by 17.1% (Suzgun and Kalai 2024; GSD's "Fresh Eyes" pattern) can be interpreted within this framework as follows.

Let $\Phi_{\text{inc}}$ denote the average context fidelity of an incremental approach (context carried forward across iterations), and let $\Phi_{\text{fresh}} = 1$ denote the fidelity after a full re-read. The accuracy advantage of fresh context is proportional to the fidelity gap:

$$\Delta_{\text{accuracy}} \propto \Phi_{\text{fresh}} - \Phi_{\text{inc}} = 1 - \Phi_{\text{inc}}$$

From the empirical 17.1% advantage, we infer:

$$1 - \Phi_{\text{inc}} \approx 0.171 \implies \Phi_{\text{inc}} \approx 0.829$$

This means the incremental approach retains about 82.9% of the information value of a fresh read. Using the decay model $\Phi_{\text{inc}} = e^{-\Lambda \bar{t}}$, where $\bar{t}$ is the average time since the last full read, we can estimate the effective decay:

$$\Lambda \bar{t} \approx -\ln(0.829) \approx 0.188$$

If a typical cycle takes $\bar{t} = 50$ minutes $\approx 0.83$ hours, the effective decay rate is $\Lambda \approx 0.226$ per hour; equivalently, the context half-life is $t_{1/2} \approx 3.07$ hours. This is a plausible value: it says that after about 3 hours of incremental work without a full re-read, the agent's context has lost half its information value.

**Proposition 1.2 (Conditions Favoring Fresh Eyes).** *The accuracy advantage of fresh reads over incremental context exceeds a threshold $\Delta_{\min}$ whenever:*

$$\Lambda \bar{t} > -\ln(1 - \Delta_{\min})$$

*For $\Delta_{\min} = 0.10$ (10% advantage), this requires $\Lambda \bar{t} > 0.105$. For $\Delta_{\min} = 0.05$ (5% advantage), $\Lambda \bar{t} > 0.051$. Since $\Lambda = \lambda \alpha$ is the product of change rate and disruption fraction, fresh reads are most valuable when either the codebase changes rapidly or changes are structurally disruptive.*

### 1.5 Optimal Refresh Policy Under Fidelity Constraints [S]

**Problem 1.1 (Refresh Timing).** Given a minimum acceptable fidelity threshold $\Phi_{\min}$, what is the maximum interval between full reads?

**Solution.** Setting $\Phi(t) \geq \Phi_{\min}$:

$$e^{-\Lambda t} \geq \Phi_{\min} \implies t \leq \frac{-\ln(\Phi_{\min})}{\Lambda}$$

So the maximum refresh interval is:

$$T_{\max} = \frac{-\ln(\Phi_{\min})}{\Lambda}$$

For $\Phi_{\min} = 0.9$ (accept at most 10% information loss): $T_{\max} = 0.105 / \Lambda$.
For $\Phi_{\min} = 0.8$: $T_{\max} = 0.223 / \Lambda$.

With $\Lambda \approx 0.226$ per hour (the value inferred from Fresh Eyes data), these give $T_{\max} \approx 28$ minutes (for 10% loss) or $T_{\max} \approx 59$ minutes (for 20% loss). The latter aligns with GSD's 45-60 minute cycle: each cycle pays the fresh-read cost, and 59 minutes is approximately the maximum interval before 20% fidelity loss.

---

## 2. Verified Iterations per Hour (VIH)

### 2.1 Formal Definition [S]

The raw iteration rate of an agent (edits per hour, cycles per hour) is a misleading speed metric because unverified iterations may produce incorrect output that requires rework. We define a verification-aware metric.

**Definition 2.1 (Verified Iterations per Hour).** For a model-harness pair $m$ operating over wall-clock time $T_{\text{wall}}$, the Verified Iterations per Hour is:

$$\text{VIH}(m) = \frac{n_{\text{verified}}(m)}{T_{\text{wall}}}$$

where $n_{\text{verified}}(m)$ counts only those iterations (edit-test-verify cycles) that pass all verification gates (compilation, tests, lint, type-check, and any harness-specific quality gates).

### 2.2 Decomposition [S]

**Theorem 2.1 (VIH Decomposition).** *VIH admits the following product decomposition:*

$$\text{VIH} = \lambda_{\text{raw}} \cdot p_{\text{verify}}$$

*where:*
- *$\lambda_{\text{raw}} = 1 / E[\tau_{\text{cycle}}]$ is the raw iteration rate (cycles per hour), with $\tau_{\text{cycle}}$ the random cycle time*
- *$p_{\text{verify}} = P(\text{iteration passes verification})$ is the verification success probability*

*Proof.* The total number of iterations in time $T_{\text{wall}}$ is $n_{\text{total}} = \lambda_{\text{raw}} \cdot T_{\text{wall}}$ (by definition of rate). Of these, a fraction $p_{\text{verify}}$ pass verification (in expectation, by the law of large numbers as $T_{\text{wall}} \to \infty$). Therefore:

$$n_{\text{verified}} = n_{\text{total}} \cdot p_{\text{verify}} = \lambda_{\text{raw}} \cdot p_{\text{verify}} \cdot T_{\text{wall}}$$

Dividing both sides by $T_{\text{wall}}$:

$$\text{VIH} = \lambda_{\text{raw}} \cdot p_{\text{verify}}$$

$\square$

### 2.3 The Speed-Quality Tradeoff [S]

**Proposition 2.1 (Speed vs. Verification Rate Tradeoff).** *In general, $p_{\text{verify}}$ is a decreasing function of $\lambda_{\text{raw}}$. That is, increasing the raw iteration rate (by reducing planning time, skipping research, using smaller models, or truncating context) tends to decrease the probability that each iteration passes verification.*

*Justification [C].* This is an empirical claim supported by the following evidence:

1. The DORA 2024/2025 finding that AI-augmented speed (21% more tasks) correlates with reduced stability (7.2% delivery stability drop per 25% AI adoption increase)
2. The GitClear 2025 data showing increased code churn (code revised within two weeks) correlating with AI tool adoption
3. The Yerkes-Dodson law argument: faster cycles create implicit time pressure that degrades quality on complex tasks (R3 contrarian analysis)

We model this tradeoff as:

$$p_{\text{verify}}(\lambda_{\text{raw}}) = p_0 \cdot g(\lambda_{\text{raw}})$$

where $p_0$ is the baseline verification rate at the natural (unforced) iteration speed, and $g: \mathbb{R}_{>0} \to (0, 1]$ is a degradation function satisfying $g(\lambda_0) = 1$ (at natural speed), $g'(\lambda) < 0$ for $\lambda > \lambda_0$ (faster degrades quality), and $g''(\lambda) < 0$ (degradation accelerates, i.e., $g$ is concave on $[\lambda_0, \infty)$).

A natural parametric form, motivated by the exponential relationship between speed and error rates in human factors research, is:

$$g(\lambda_{\text{raw}}) = \exp\!\left(-\beta \cdot \max(0,\; \lambda_{\text{raw}} - \lambda_0)\right)$$

where $\beta > 0$ controls sensitivity to speed increases beyond the natural rate $\lambda_0$.

### 2.4 Optimal Operating Point [S]

**Theorem 2.2 (VIH Optimal Speed).** *Let $\text{VIH}(\lambda) = \lambda \cdot p_{\text{verify}}(\lambda)$ where $p_{\text{verify}}$ is differentiable with $p_{\text{verify}}'(\lambda) < 0$ for $\lambda > \lambda_0$. The VIH-maximizing raw iteration rate $\lambda^*$ satisfies:*

$$\frac{d\,\text{VIH}}{d\lambda}\bigg|_{\lambda^*} = 0 \implies p_{\text{verify}}(\lambda^*) + \lambda^* \cdot p_{\text{verify}}'(\lambda^*) = 0$$

*Equivalently:*

$$\frac{p_{\text{verify}}'(\lambda^*)}{p_{\text{verify}}(\lambda^*)} = -\frac{1}{\lambda^*}$$

*The left side is the elasticity of the verification rate with respect to speed. The optimum occurs where a 1% increase in raw speed causes exactly a 1% decrease in verification rate; further speed gains produce net VIH losses.*

*Proof.* Differentiate $\text{VIH}(\lambda) = \lambda \cdot p_{\text{verify}}(\lambda)$ using the product rule:

$$\frac{d\,\text{VIH}}{d\lambda} = p_{\text{verify}}(\lambda) + \lambda \cdot p_{\text{verify}}'(\lambda)$$

Setting this to zero and rearranging:

$$p_{\text{verify}}'(\lambda^*) = -\frac{p_{\text{verify}}(\lambda^*)}{\lambda^*}$$

Dividing both sides by $p_{\text{verify}}(\lambda^*)$:

$$\frac{p_{\text{verify}}'(\lambda^*)}{p_{\text{verify}}(\lambda^*)} = -\frac{1}{\lambda^*}$$

The left side is $\frac{d}{d\lambda}\ln p_{\text{verify}}(\lambda^*)$, confirming this is an elasticity condition. $\square$

**Corollary 2.1 (Exponential Degradation Case).** *Under the exponential model $p_{\text{verify}}(\lambda) = p_0 \exp(-\beta(\lambda - \lambda_0))$ for $\lambda \geq \lambda_0$, the optimal rate is:*

$$\lambda^* = \frac{1}{\beta}$$

*Proof.* We have $p_{\text{verify}}'(\lambda) = -\beta \cdot p_{\text{verify}}(\lambda)$, so the optimality condition becomes $-\beta = -1/\lambda^*$, giving $\lambda^* = 1/\beta$. $\square$

*Interpretation:* The optimal speed is inversely proportional to the quality sensitivity parameter $\beta$. Highly quality-sensitive domains (large $\beta$) should iterate slowly; quality-insensitive domains (small $\beta$, e.g., prototyping) can iterate faster.

**Corollary 2.2 (Second-Order Condition).** *The critical point $\lambda^*$ is a maximum (not a minimum) provided:*

$$2 p_{\text{verify}}'(\lambda^*) + \lambda^* \cdot p_{\text{verify}}''(\lambda^*) < 0$$

*Under the exponential model, $\frac{d^2\text{VIH}}{d\lambda^2}\big|_{\lambda^*} = -2\beta p_{\text{verify}}(\lambda^*) + \beta^2 \lambda^* p_{\text{verify}}(\lambda^*) = p_{\text{verify}}(\lambda^*)(- 2\beta + \beta^2/\beta) = -\beta \cdot p_{\text{verify}}(\lambda^*) < 0$, confirming $\lambda^*$ is indeed a maximum.*

### 2.5 Connection to Amdahl's Law [E + S]

Amdahl's Law (1967) states that if a fraction $f$ of a computation is inherently serial, the maximum speedup from parallelizing the remaining fraction on $k$ processors is:

$$S(k) = \frac{1}{f + (1 - f)/k}$$

As $k \to \infty$, $S(k) \to 1/f$.

**Proposition 2.2 (Amdahl's Law for VIH).** *If verification is a serial fraction $f$ of the cycle time (it cannot be parallelized with execution because it must run after execution completes), and the non-verification fraction $(1-f)$ can be sped up by a factor $k$ (through parallelism, faster models, caching), then:*

$$\text{VIH}(k) = \frac{p_{\text{verify}}}{f \cdot \tau_{\text{cycle}} + (1 - f) \cdot \tau_{\text{cycle}} / k}$$

*The maximum raw iteration rate, as $k \to \infty$, is:*

$$\lambda_{\text{raw}}^{\max} = \frac{1}{f \cdot \tau_{\text{cycle}}}$$

*and therefore:*

$$\text{VIH}^{\max} = \frac{p_{\text{verify}}}{f \cdot \tau_{\text{cycle}}}$$

*Empirical calibration:* From the GSD cycle data (R2), verification takes 8-12 minutes of a 50-minute cycle, giving $f \approx 0.20$. With $p_{\text{verify}} \approx 0.67$ (Devin's 67% PR merge rate as a proxy), the maximum VIH is approximately $0.67 / (0.20 \times 50/60) \approx 4.0$ verified iterations per hour, regardless of how fast the non-verification phases become.

### 2.6 VIH Under Rework [S]

Failed iterations are not free; they consume wall-clock time without producing verified output. Moreover, failures may require rework that consumes additional cycles.

**Definition 2.2 (Effective VIH with Rework).** Let $r$ be the average number of rework cycles per failed iteration. The effective VIH accounting for rework overhead is:

$$\text{VIH}_{\text{eff}} = \frac{n_{\text{verified}}}{T_{\text{wall}} + n_{\text{failed}} \cdot r \cdot E[\tau_{\text{cycle}}]}$$

Simplifying:

$$\text{VIH}_{\text{eff}} = \frac{\lambda_{\text{raw}} \cdot p_{\text{verify}}}{1 + (1 - p_{\text{verify}}) \cdot r}$$

When $r = 0$ (failed iterations are simply discarded), this reduces to $\text{VIH}_{\text{eff}} = \text{VIH}$. When $r > 0$, rework penalizes low $p_{\text{verify}}$ more severely: the denominator grows as $p_{\text{verify}}$ decreases.

---

## 3. Stochastic Pipeline Model

### 3.1 Pipeline Definition [S]

**Definition 3.1 (Agent Pipeline DAG).** An agent pipeline is a stochastic DAG $G = (V, E, \mathbf{D}, \mathbf{q}, \mathcal{E}_{\text{dep}})$ where:

- $V = \{v_1, v_2, \ldots, v_n\}$ is the set of pipeline stages, with canonical naming:

$$V = \{\text{context\_load},\; \text{research},\; \text{planning},\; \text{execution},\; \text{verification},\; \text{review}\}$$

- $E \subseteq V \times V$ is the set of precedence edges ($(v_i, v_j) \in E$ means $v_i$ must commit before $v_j$ may start, under sequential scheduling)
- $\mathbf{D} = (D_1, D_2, \ldots, D_n)$, where $D_i$ is the duration distribution of stage $v_i$; we write $t_i \sim D_i$ with mean $\mu_i$ and variance $\sigma_i^2$
- $\mathbf{q} = (q_1, q_2, \ldots, q_n)$, where $q_i \in [0, 1]$ is the failure probability of stage $v_i$
- $\mathcal{E}_{\text{dep}}$: the dependency structure (which stages depend on which)

**The canonical pipeline DAG** for a GSD-style harness is a chain (series graph):

$$\text{context\_load} \to \text{research} \to \text{planning} \to \text{execution} \to \text{verification} \to \text{review}$$

with the following empirical distributions (from R2 data):

| Stage | $\mu_i$ (min) | $\sigma_i$ (min) | $q_i$ | Distribution family |
|-------|---------------|-------------------|--------|---------------------|
| context_load | 10 | 2 | 0.02 | Log-normal |
| research | 7.5 | 2.5 | 0.05 | Log-normal |
| planning | 6.5 | 1.5 | 0.08 | Log-normal |
| execution | 12.5 | 2.5 | 0.15 | Log-normal |
| verification | 10 | 2 | 0.10 | Log-normal |
| review | 10 | 5 | 0.05 | Highly variable |

**Remark (Distribution choice).** Log-normal distributions are standard for task durations in software engineering (Sackman et al. 1968; DeMarco and Lister 1987). They are supported on $(0, \infty)$, right-skewed (occasional very long tasks), and closed under multiplication (the product of independent log-normals is log-normal, relevant for multiplicative accumulation of delays).

### 3.2 Sequential Makespan [E]

**Theorem 3.1 (Sequential Makespan).** *For a series pipeline under sequential execution (no speculation), the makespan conditioned on all stages succeeding is:*

$$M_{\text{seq}} = \sum_{i=1}^{n} t_i$$

*with expected value and variance:*

$$E[M_{\text{seq}}] = \sum_{i=1}^{n} \mu_i, \quad \text{Var}(M_{\text{seq}}) = \sum_{i=1}^{n} \sigma_i^2$$

*(the latter under independence of stage durations).*

*Proof.* Immediate from the linearity of expectation and the independence assumption. $\square$

*Empirical calibration:* $E[M_{\text{seq}}] = 10 + 7.5 + 6.5 + 12.5 + 10 + 10 = 56.5$ minutes, consistent with the observed 45-60 minute GSD cycle range.

### 3.3 Makespan with Failures and Restarts [S]

When a stage $v_i$ fails (with probability $q_i$), the pipeline must restart from a checkpoint. Let $c(i)$ be the restart point for a failure at stage $i$ (the earliest stage that must be re-executed). In a simple model, $c(i) = i$ (restart only the failed stage). In a more realistic model, $c(i) < i$ (failure invalidates downstream work, requiring restart from an earlier stage).

**Theorem 3.2 (Expected Makespan with Failures).** *Under the restart-from-failed-stage model ($c(i) = i$) with independent failures:*

$$E[M_{\text{fail}}] = \sum_{i=1}^{n} \frac{\mu_i}{p_i}$$

*where $p_i = 1 - q_i$ is the success probability of stage $i$.*

*Proof.* Each stage is attempted independently until it succeeds. The number of attempts for stage $i$ follows a geometric distribution with parameter $p_i$, so the expected number of attempts is $1/p_i$. Each attempt takes expected time $\mu_i$. By linearity of expectation:

$$E[M_{\text{fail}}] = \sum_{i=1}^{n} \frac{\mu_i}{p_i}$$

$\square$

*Empirical calibration:* $E[M_{\text{fail}}] = 10/0.98 + 7.5/0.95 + 6.5/0.92 + 12.5/0.85 + 10/0.90 + 10/0.95 \approx 10.2 + 7.9 + 7.1 + 14.7 + 11.1 + 10.5 = 61.5$ minutes. The overhead from failures adds approximately 5 minutes (8.8%) to the expected cycle time.

### 3.4 Speculative Execution [S]

Under speculative execution, stage $v_j$ begins before its predecessor $v_i$ commits, executing speculatively on the assumption that $v_i$ will succeed.

**Definition 3.2 (Speculation Policy).** A speculation policy $\pi_{\text{spec}}: V \to \{0, 1\}$ assigns to each stage a binary decision: $\pi_{\text{spec}}(v_j) = 1$ if $v_j$ begins speculatively (before its predecessor commits), and $\pi_{\text{spec}}(v_j) = 0$ otherwise.

**Theorem 3.3 (Two-Stage Speculation).** *For adjacent stages $(v_i, v_j)$ where $v_j$ speculates on $v_i$'s success:*

$$E[T_{\text{spec}}(i, j)] = p_i \cdot E[\max(t_i, t_j)] + q_i \cdot (E[d_i] + E[\mu_i / p_i] + E[t_j])$$

*where $d_i$ is the failure detection time for stage $i$. The sequential baseline is:*

$$E[T_{\text{seq}}(i, j)] = \mu_i / p_i + \mu_j / p_j$$

*Speculation is EV-positive when $E[T_{\text{spec}}] < E[T_{\text{seq}}]$.*

*Proof.* With probability $p_i$, stage $i$ succeeds on the first try. The speculative work on $j$ is valid, and both stages complete at time $\max(t_i, t_j)$. With probability $q_i$, stage $i$ fails. Detection takes $d_i$ time, then stage $i$ must be re-attempted (expected time $\mu_i/p_i$ total for all retries), after which stage $j$ restarts. The expected time in the failure case is $d_i + \mu_i/p_i + t_j$. Combining:

$$E[T_{\text{spec}}] = p_i \cdot E[\max(t_i, t_j)] + q_i \cdot (E[d_i] + \mu_i/p_i + \mu_j)$$

$\square$

**The Speculation Ratio Test (from R4, restated).** Define the parallelism benefit $B = E[t_i] + E[t_j] - E[\max(t_i, t_j)] = E[\min(t_i, t_j)]$ and the rollback penalty $R = E[d_i] + E[t_i^{\text{retry}}]$. Speculation is EV-positive when:

$$\frac{p_i}{q_i} > \frac{R}{B}$$

That is, the odds ratio of success must exceed the penalty-to-benefit ratio.

### 3.5 Multi-Stage Speculation in the Full Pipeline [S]

**Definition 3.3 (Speculation Depth).** The speculation depth $k$ is the number of uncommitted predecessor stages behind which a given stage speculatively executes. At depth $k$, stage $v_{i+k}$ begins execution while stages $v_i, v_{i+1}, \ldots, v_{i+k-1}$ have not yet committed.

**Theorem 3.4 (Speculation Depth Limit).** *For a chain pipeline where each stage has success probability $p$ (homogeneous case), the probability that speculative work at depth $k$ survives (all $k$ predecessors succeed) is:*

$$P(\text{survive at depth } k) = p^k$$

*The optimal speculation depth $k^*$ maximizes expected net savings:*

$$k^* = \arg\max_{k \geq 0}\; \left\{ p^k \cdot B(k) - (1 - p^k) \cdot R(k) \right\}$$

*where $B(k) = \sum_{j=1}^{k} E[\min(t_j, t_{j+1})]$ is the cumulative parallelism benefit and $R(k) = \sum_{j=1}^{k} (E[d_j] + E[t_j^{\text{retry}}])$ is the cumulative rollback cost.*

*For the homogeneous case with constant $B_0$ per stage overlap and constant $R_0$ per stage rollback:*

$$\text{Net}(k) = p^k \cdot k B_0 - (1 - p^k) \cdot k R_0 = k \left[ p^k (B_0 + R_0) - R_0 \right]$$

*Setting $\text{Net}(k) > 0$:*

$$p^k > \frac{R_0}{B_0 + R_0}$$

$$k < \frac{\ln(R_0 / (B_0 + R_0))}{\ln(p)} = \frac{-\ln(1 + B_0/R_0)}{-\ln(1/p)} = \frac{\ln(1 + B_0/R_0)}{\ln(1/p)}$$

*For $p = 0.85$ and $B_0/R_0 = 2$: $k < \ln(3) / \ln(1/0.85) = 1.099 / 0.163 \approx 6.7$, so $k^* \leq 6$. For $p = 0.70$ and $B_0/R_0 = 1$: $k < \ln(2) / \ln(1/0.70) = 0.693 / 0.357 \approx 1.94$, so $k^* \leq 1$ (speculate at most one stage ahead).*

**Corollary 3.1 (No Speculation Threshold).** *Speculation at any depth is EV-negative when $R_0 > p \cdot (B_0 + R_0)$, i.e., when $p < R_0 / (B_0 + R_0)$. For $B_0 = R_0$, this threshold is $p < 0.5$: do not speculate when stages fail more often than they succeed.*

### 3.6 Expected Makespan: Speculative vs. Sequential [S]

**Theorem 3.5 (Makespan Comparison).** *For a chain pipeline of $n$ stages with speculation policy $\pi_{\text{spec}}$ applied to a contiguous set of stages $\{v_j, \ldots, v_{j+k-1}\}$ (speculation depth $k$ starting at stage $j$), the expected makespan is:*

$$E[M_{\pi}] = \sum_{i < j} \frac{\mu_i}{p_i} + E[T_{\text{spec}}(j, \ldots, j+k-1)] + \sum_{i > j+k-1} \frac{\mu_i}{p_i}$$

*The net savings over fully sequential execution is:*

$$\Delta M = E[M_{\text{seq}}] - E[M_{\pi}] = \sum_{i=j}^{j+k-1} \frac{\mu_i}{p_i} - E[T_{\text{spec}}(j, \ldots, j+k-1)]$$

*This is positive (speculation saves time) when the speculated stages have a favorable speculation ratio.*

---

## 4. Cache-Staleness Tradeoff Theorem

### 4.1 Cost Model [S]

**Definition 4.1 (Cache Refresh Costs).** An agent maintaining a cached codebase representation faces the following costs:

- $R$: cost of a full re-read (in tokens consumed, or equivalently in time; $R$ includes the token cost of reading the full codebase state plus the latency of file I/O and context loading)
- $r$: cost of an incremental update ($r \ll R$; checking for changes, loading only modified files)
- $s(t)$: staleness probability at time $t$ since last full read; the probability that the cache is materially stale (i.e., the agent's cached state differs from the true state in a way that would affect task outcomes)
- $E_{\text{stale}}$: expected cost of acting on stale context (includes debugging time, rework, rollback, and the opportunity cost of the wasted cycle)

### 4.2 Staleness Growth [S]

Under the Poisson change model with rate $\lambda$:

$$s(t) = 1 - e^{-\lambda t}$$

For small $\lambda t$ (changes are infrequent relative to the refresh interval):

$$s(t) \approx \lambda t - \frac{(\lambda t)^2}{2} + O((\lambda t)^3)$$

The linear approximation $s(t) \approx \lambda t$ is valid for $\lambda t \ll 1$.

### 4.3 Optimal Refresh Interval [S]

**Theorem 4.1 (Optimal Refresh Interval; EOQ Analog).** *Consider a policy that performs a full re-read every $T$ time units, with incremental updates between re-reads. The amortized cost per unit time is:*

$$J(T) = \frac{R}{T} + \frac{1}{T}\int_0^T s(t) \cdot E_{\text{stale}}\, dt$$

*The first term is the amortized re-read cost. The second term is the average expected error cost over the refresh interval. Under the linear staleness approximation $s(t) = \lambda t$:*

$$J(T) = \frac{R}{T} + \frac{1}{T}\int_0^T \lambda t \cdot E_{\text{stale}}\, dt = \frac{R}{T} + \frac{\lambda E_{\text{stale}} T}{2}$$

*Minimizing $J(T)$ by differentiation:*

$$J'(T) = -\frac{R}{T^2} + \frac{\lambda E_{\text{stale}}}{2} = 0$$

$$T^* = \sqrt{\frac{2R}{\lambda E_{\text{stale}}}}$$

*The minimum amortized cost is:*

$$J(T^*) = \sqrt{2 R \lambda E_{\text{stale}}}$$

*Proof.* Standard calculus optimization. The cost function $J(T) = R/T + \lambda E_{\text{stale}} T / 2$ is the sum of a term decreasing in $T$ (amortized fixed cost) and a term increasing in $T$ (accumulating risk cost). The minimum is at the geometric mean, analogous to the Economic Order Quantity formula from inventory theory (Harris 1913, Wilson 1934). The second derivative $J''(T^*) = 2R/(T^*)^3 > 0$ confirms this is a minimum. $\square$

### 4.4 Interpretation and Calibration [S]

The $T^*$ formula has the same structure as the EOQ formula $Q^* = \sqrt{2DK/h}$, with the following correspondence:

| EOQ Variable | Cache Refresh Variable | Meaning |
|-------------|----------------------|---------|
| $K$ (ordering cost) | $R$ (full re-read cost) | Fixed cost per refresh |
| $h$ (holding cost per unit per time) | $\lambda E_{\text{stale}}$ (staleness cost rate) | Cost of holding stale cache |
| $D$ (demand rate) | 1 (normalized) | Tasks per unit time |
| $Q^*$ (optimal order quantity) | $T^*$ (optimal refresh interval) | Optimal batch size |

**Empirical calibration.** Using values from the temporal research:

- $R = 10$ minutes (GSD context loading time)
- $\lambda = 0.5$ changes/hour (moderate codebase change rate during active development)
- $E_{\text{stale}} = 50$ minutes (a full wasted cycle when acting on stale context)

$$T^* = \sqrt{\frac{2 \times 10}{0.5/60 \times 50}} \approx \sqrt{\frac{20}{0.417}} \approx \sqrt{48} \approx 6.9 \text{ minutes}$$

Wait; let us be careful with units. If all costs are in minutes and $\lambda$ is in changes per minute:

- $R = 10$ min
- $\lambda = 0.5 / 60 \approx 0.0083$ changes/min
- $E_{\text{stale}} = 50$ min

$$T^* = \sqrt{\frac{2 \times 10}{0.0083 \times 50}} = \sqrt{\frac{20}{0.417}} = \sqrt{48.0} \approx 6.9 \text{ min}$$

This suggests refreshing every ~7 minutes, which seems too frequent. However, this assumes every staleness event costs a full 50-minute rework cycle. A more realistic model distinguishes the staleness probability from the conditional error cost.

### 4.5 Extended Model: Staleness Does Not Always Cause Errors [S]

**Definition 4.2 (Conditional Error Model).** Not every stale cache entry causes an error. Let $\delta$ be the probability that staleness causes a task failure (conditional on the cache being stale and the agent acting on it). The expected error cost per unit time at time $t$ since last refresh is:

$$c(t) = s(t) \cdot \delta \cdot E_{\text{stale}}$$

Under this refinement:

$$T^* = \sqrt{\frac{2R}{\lambda \delta E_{\text{stale}}}}$$

With $\delta = 0.2$ (only 20% of stale contexts cause actual task failures):

$$T^* = \sqrt{\frac{2 \times 10}{0.0083 \times 0.2 \times 50}} = \sqrt{\frac{20}{0.083}} = \sqrt{241} \approx 15.5 \text{ min}$$

This is more reasonable: refresh roughly every 15 minutes, or about 3-4 times per GSD cycle.

### 4.6 The General Case (Exact Poisson Staleness) [S]

**Theorem 4.2 (Exact Optimal Refresh Interval).** *Under the exact Poisson staleness model $s(t) = 1 - e^{-\lambda t}$ (without the linear approximation), the amortized cost is:*

$$J(T) = \frac{R}{T} + \frac{\delta E_{\text{stale}}}{T}\int_0^T (1 - e^{-\lambda t})\, dt = \frac{R}{T} + \delta E_{\text{stale}}\left(1 - \frac{1 - e^{-\lambda T}}{\lambda T}\right)$$

*The optimal $T^*$ satisfies the transcendental equation:*

$$\frac{R}{(T^*)^2} = \frac{\delta E_{\text{stale}}}{\lambda (T^*)^2}\left(\lambda T^* e^{-\lambda T^*} - 1 + e^{-\lambda T^*}\right) + \frac{\delta E_{\text{stale}}}{\lambda T^*}(1 - e^{-\lambda T^*})$$

*This has no closed-form solution but can be solved numerically. For $\lambda T \ll 1$, it reduces to the EOQ formula of Theorem 4.1. For $\lambda T \gg 1$ (high change rates), $J(T) \to R/T + \delta E_{\text{stale}}$, and the optimal policy is to refresh as often as affordable: $T^* \to 0$.*

### 4.7 Connection to Competitive Analysis [E + S]

The cache refresh problem is a variant of the ski-rental problem (Karlin et al. 1994). "Renting" corresponds to using incremental (possibly stale) context; "buying" corresponds to paying for a full re-read.

**Proposition 4.1 (Competitive Ratio of Periodic Refresh).** *The periodic refresh policy with interval $T^*$ (from Theorem 4.1) achieves competitive ratio at most 2 against an offline adversary that knows the exact change times.*

*Proof sketch.* This follows from the break-even structure of the EOQ/ski-rental solution. The amortized cost $J(T^*) = \sqrt{2R\lambda\delta E_{\text{stale}}}$ is at most twice the offline optimal cost. The offline optimal knows exactly when changes occur and refreshes immediately before the agent would act on stale data; its cost is $\lambda \cdot R$ (one refresh per change event, but only if the change would cause an error). The ratio $J(T^*) / (\lambda \delta E_{\text{stale}}) = \sqrt{2R/(\lambda\delta E_{\text{stale}})} = T^*$, and by the EOQ structure, $T^* \leq 2 T_{\text{OPT}}$ in the worst case (a standard result in inventory theory). $\square$

---

## 5. Mode Selection as Hypothesis Testing

### 5.1 Setup [S]

The harness must select an execution mode for each incoming task. We frame this as a binary hypothesis test (the extension to three modes follows by pairwise comparison).

**Definition 5.1 (Hypotheses).**

- $H_0$: the task is simple (Fast mode is appropriate; risk of quality failure is low)
- $H_1$: the task is complex (Governed mode is needed; skipping governance risks quality failure)

The harness observes a feature vector $\mathbf{x} \in \mathbb{R}^d$ characterizing the task (number of files affected, change scope, test coverage, dependency depth, etc.) and must decide between $H_0$ and $H_1$.

### 5.2 Error Types and Costs [S]

**Definition 5.2 (Error Costs).**

| | $H_0$ true (simple task) | $H_1$ true (complex task) |
|---|---|---|
| Choose Fast ($H_0$) | Correct: cost 0 | **Type II error (miss)**: cost $c_{II}$ |
| Choose Governed ($H_1$) | **Type I error (false alarm)**: cost $c_I$ | Correct: cost 0 |

The critical asymmetry: $c_{II} \gg c_I$.

- $c_I$ (unnecessary governance): the harness runs extra verification, planning, and review stages for a task that did not need them. Cost: the time overhead of Governed mode over Fast mode, typically $\Delta\tau = \tau_{\text{gov}} - \tau_{\text{fast}}$. From the R2 data: $\tau_{\text{gov}} \approx 50$ min, $\tau_{\text{fast}} \approx 5$ min, so $c_I \approx 45$ minutes.
- $c_{II}$ (missed complexity): the harness runs in Fast mode on a complex task, producing inadequately verified output that causes downstream failures. Cost includes: rework time, debugging, potential production incidents, architectural damage. From the DORA data: AI-coauthored PRs show 1.7x more issues, and production incidents can cost 10-100x the original development time. Estimate: $c_{II} \approx 450$ minutes (10x the cycle time, conservative).

The cost ratio is $c_{II} / c_I \approx 10$.

### 5.3 Neyman-Pearson Framework [E + S]

**Theorem 5.1 (Neyman-Pearson Lemma, 1933).** *Consider testing $H_0: \mathbf{x} \sim f_0(\mathbf{x})$ against $H_1: \mathbf{x} \sim f_1(\mathbf{x})$. Among all tests with Type I error rate $P(\text{reject } H_0 \mid H_0) \leq \alpha$, the one that minimizes Type II error rate $P(\text{accept } H_0 \mid H_1)$ is the likelihood ratio test:*

$$\text{Reject } H_0 \iff \frac{f_1(\mathbf{x})}{f_0(\mathbf{x})} > \eta(\alpha)$$

*where the threshold $\eta(\alpha)$ is chosen to satisfy the size constraint $P(\text{reject } H_0 \mid H_0) = \alpha$.*

*Proof.* Classical; see Neyman and Pearson (1933) or Lehmann and Romano (2005, Theorem 3.2.1). The key insight is that among all critical regions of size $\alpha$, the likelihood ratio test includes the points $\mathbf{x}$ that provide the most evidence per unit of Type I error "spent." $\square$

### 5.4 Bayesian Decision Rule [E + S]

**Theorem 5.2 (Bayes-Optimal Mode Selection).** *Under Bayesian decision theory with prior $\pi_0 = P(H_0)$, $\pi_1 = P(H_1) = 1 - \pi_0$, and the asymmetric loss structure above, the Bayes-optimal decision rule chooses Governed mode when:*

$$P(H_1 \mid \mathbf{x}) > \frac{c_I}{c_I + c_{II}}$$

*Equivalently, in terms of the likelihood ratio:*

$$\frac{f_1(\mathbf{x})}{f_0(\mathbf{x})} > \frac{\pi_0}{\pi_1} \cdot \frac{c_I}{c_{II}}$$

*Proof.* The Bayes risk of choosing action $a \in \{\text{Fast}, \text{Governed}\}$ given observation $\mathbf{x}$ is:

$$\rho(\text{Fast} \mid \mathbf{x}) = c_{II} \cdot P(H_1 \mid \mathbf{x})$$
$$\rho(\text{Governed} \mid \mathbf{x}) = c_I \cdot P(H_0 \mid \mathbf{x})$$

Choose Governed when $\rho(\text{Governed} \mid \mathbf{x}) < \rho(\text{Fast} \mid \mathbf{x})$:

$$c_I \cdot P(H_0 \mid \mathbf{x}) < c_{II} \cdot P(H_1 \mid \mathbf{x})$$

$$c_I (1 - P(H_1 \mid \mathbf{x})) < c_{II} \cdot P(H_1 \mid \mathbf{x})$$

$$c_I < (c_I + c_{II}) \cdot P(H_1 \mid \mathbf{x})$$

$$P(H_1 \mid \mathbf{x}) > \frac{c_I}{c_I + c_{II}}$$

Using Bayes' theorem $P(H_1 \mid \mathbf{x}) / P(H_0 \mid \mathbf{x}) = (\pi_1 / \pi_0) \cdot (f_1(\mathbf{x}) / f_0(\mathbf{x}))$, we obtain the likelihood ratio form. $\square$

### 5.5 Implications of Asymmetric Costs [S]

**Corollary 5.1 (Low Decision Threshold).** *With $c_I = 45$ min and $c_{II} = 450$ min:*

$$\frac{c_I}{c_I + c_{II}} = \frac{45}{495} \approx 0.091$$

*The harness should choose Governed mode whenever there is more than a ~9% posterior probability that the task is complex. This is a very low threshold, meaning the system should strongly favor over-governance (false alarms) to avoid under-governance (misses).*

**Corollary 5.2 (Neyman-Pearson $\alpha$ Selection).** *In the Neyman-Pearson framework, the asymmetric cost structure implies the optimal significance level $\alpha$ (Type I error rate) should be chosen to balance expected costs:*

$$\alpha^* = \arg\min_\alpha \left\{ c_I \cdot \alpha \cdot \pi_0 + c_{II} \cdot \beta(\alpha) \cdot \pi_1 \right\}$$

*where $\beta(\alpha) = P(\text{Type II error} \mid \alpha)$ is the miss rate at significance level $\alpha$ (a decreasing function of $\alpha$, since accepting more false alarms reduces misses).*

*Differentiating with respect to $\alpha$ and using the chain rule:*

$$c_I \cdot \pi_0 + c_{II} \cdot \beta'(\alpha^*) \cdot \pi_1 = 0$$

$$\beta'(\alpha^*) = -\frac{c_I \pi_0}{c_{II} \pi_1}$$

*Since $c_{II} / c_I \approx 10$ and (assuming equal priors $\pi_0 = \pi_1 = 0.5$):*

$$\beta'(\alpha^*) = -\frac{1}{10}$$

*This means at the optimal operating point, a unit increase in the false alarm rate should produce a tenfold reduction in the miss rate. The ROC curve's slope at $\alpha^*$ equals $c_I \pi_0 / (c_{II} \pi_1) = 0.1$, a point far to the right of typical hypothesis testing practice (where $\alpha = 0.05$), reflecting the strong preference for over-governance.*

### 5.6 The Three-Mode Extension [S]

**Theorem 5.3 (Optimal Three-Mode Selection).** *For the full mode set $\mathcal{M} = \{\text{Fast}, \text{Standard}, \text{Governed}\}$ with cost matrix $C(i, j)$ (cost of choosing mode $i$ when mode $j$ is optimal), the Bayes-optimal decision is:*

$$m^*(\mathbf{x}) = \arg\min_{i \in \mathcal{M}}\; \sum_{j \in \mathcal{M}} C(i, j) \cdot P(y = j \mid \mathbf{x})$$

*Using the cost matrix from R4 (Section 3.2):*

- $C(\text{Fast}, \text{Governed}) = c_{FG} \approx 450$ min (catastrophic under-governance)
- $C(\text{Governed}, \text{Fast}) = c_{GF} \approx 45$ min (unnecessary overhead)
- $C(\text{Fast}, \text{Standard}) = c_{FS} \approx 100$ min (moderate under-governance)
- $C(\text{Standard}, \text{Governed}) = c_{SG} \approx 200$ min (partial under-governance)
- $C(\text{Governed}, \text{Standard}) = c_{GS} \approx 20$ min (mild overhead)
- $C(\text{Standard}, \text{Fast}) = c_{SF} \approx 25$ min (mild overhead)

*The decision boundaries in the posterior simplex $(P_F, P_S, P_G)$ where $P_F + P_S + P_G = 1$ are piecewise-linear, with the Governed region dominating a large portion of the simplex due to the asymmetric costs.*

### 5.7 Sequential Testing: SPRT for Adaptive Mode Escalation [E + S]

Rather than making a one-shot mode decision, the harness can gather evidence sequentially and escalate modes as complexity indicators accumulate. This maps to Wald's Sequential Probability Ratio Test (SPRT).

**Theorem 5.4 (SPRT for Mode Escalation; Wald 1945).** *The agent observes features $x_1, x_2, \ldots$ sequentially (e.g., number of files touched so far, errors encountered, test failures). It maintains the cumulative log-likelihood ratio:*

$$\Lambda_n = \sum_{i=1}^{n} \ln \frac{f_1(x_i)}{f_0(x_i)}$$

*The SPRT decision rule is:*

$$\begin{cases} \text{Choose Governed (reject } H_0\text{)} & \text{if } \Lambda_n \geq \ln(B) \\ \text{Choose Fast (accept } H_0\text{)} & \text{if } \Lambda_n \leq \ln(A) \\ \text{Continue gathering evidence} & \text{if } \ln(A) < \Lambda_n < \ln(B) \end{cases}$$

*where $A = \beta / (1 - \alpha)$ and $B = (1 - \beta) / \alpha$, with $\alpha$ and $\beta$ chosen per the asymmetric cost analysis of Corollary 5.2.*

*Properties (Wald 1945):*
1. *The SPRT terminates with probability 1.*
2. *Among all sequential tests with the same Type I and Type II error rates, the SPRT minimizes the expected sample size under both $H_0$ and $H_1$ (optimality theorem).*
3. *The expected number of observations before termination is $E[N \mid H_0] = (\alpha \ln B + (1-\alpha) \ln A) / E[\ln(f_0(x)/f_1(x)) \mid H_0]$.*

*Application to harness design:* The SPRT provides a principled mechanism for the "start fast, escalate if needed" pattern. The agent begins in Fast mode and accumulates evidence of complexity. When the log-likelihood ratio crosses the upper threshold, it escalates to Governed mode. The asymmetric costs (Corollary 5.2) push the thresholds so that escalation happens early and often, consistent with the "better safe than sorry" principle for complex tasks.

---

## 6. Notation Summary

| Symbol | Definition | Section |
|--------|-----------|---------|
| $\mathcal{X}$ | True codebase state | 1.1 |
| $\mathcal{Y}$ | Agent's context representation | 1.1 |
| $C$ | Context window capacity (bits) | 1.1 |
| $\lambda$ | Codebase change rate (changes/time) | 1.1 |
| $\alpha$ | Per-change information disruption fraction | 1.2 |
| $\Lambda = \lambda\alpha$ | Effective information decay rate | 1.2 |
| $I_{\text{fresh}}$ | Mutual information at time of fresh read | 1.2 |
| $I_{\text{stale}}(t)$ | Mutual information at time $t$ after read | 1.2 |
| $\Phi(t)$ | Context fidelity metric | 1.3 |
| $\text{VIH}$ | Verified Iterations per Hour | 2.1 |
| $\lambda_{\text{raw}}$ | Raw iteration rate (cycles/hour) | 2.2 |
| $p_{\text{verify}}$ | Verification success probability | 2.2 |
| $\beta$ | Quality sensitivity to speed | 2.3 |
| $f$ | Serial verification fraction (Amdahl) | 2.5 |
| $G = (V, E)$ | Pipeline DAG | 3.1 |
| $D_i$ | Duration distribution of stage $i$ | 3.1 |
| $q_i$ | Failure probability of stage $i$ | 3.1 |
| $M$ | Pipeline makespan | 3.2 |
| $R$ | Full re-read cost | 4.1 |
| $r$ | Incremental update cost | 4.1 |
| $s(t)$ | Staleness probability at time $t$ | 4.2 |
| $E_{\text{stale}}$ | Expected cost of stale-context error | 4.1 |
| $T^*$ | Optimal refresh interval | 4.3 |
| $\delta$ | Conditional error probability given staleness | 4.5 |
| $H_0, H_1$ | Simple/complex task hypotheses | 5.1 |
| $c_I, c_{II}$ | Type I (false alarm) and Type II (miss) costs | 5.2 |
| $\Lambda_n$ | Cumulative log-likelihood ratio (SPRT) | 5.7 |

---

## 7. Cross-References to Other Formalizations

| This document | Related formalization | Connection |
|--------------|----------------------|------------|
| Context fidelity (Section 1) | Info-arch-formal-r1: Context Selection Problem (Definition 1.4) | Fidelity adds a temporal dimension to the static context selection objective |
| VIH (Section 2) | Reliability-formal-r1: Pipeline Reliability (Theorem 1.1) | VIH's $p_{\text{verify}}$ is connected to the pipeline reliability $R(n) = \prod p_i$ |
| Stochastic pipeline (Section 3) | Temporal-research-r1: Pinedo's scheduling taxonomy | The pipeline is an instance of $\text{Rm} \mid \text{prec, stoch} \mid E[C_{\max}]$ |
| Cache-staleness (Section 4) | Temporal-research-r4: Ski rental and EOQ | Extends the competitive analysis with the Poisson staleness model |
| Mode selection (Section 5) | Temporal-research-r4: Bayesian decision framework | Reframes the cost-sensitive classification as a formal hypothesis test with SPRT extension |

---

## 8. Open Problems

1. **Empirical estimation of $\Lambda$.** The effective decay rate $\Lambda = \lambda\alpha$ has been inferred indirectly from the 17.1% Fresh Eyes advantage. Direct measurement would require tracking cache fidelity over time in a controlled experiment (feeding an agent known-stale vs. fresh context and measuring task success rates).

2. **Non-stationary $\lambda$.** The Poisson model assumes a constant change rate. In practice, $\lambda$ varies dramatically (high during active development, near-zero during code freeze). An adaptive refresh policy would need online estimation of $\lambda(t)$, connecting to change-point detection theory.

3. **Multi-agent VIH.** The VIH decomposition assumes a single agent. For parallel multi-agent pipelines (RAPID-style), the verified throughput depends on merge conflict rates and inter-agent interference. The extension is non-trivial because $p_{\text{verify}}$ becomes correlated across agents.

4. **Speculation with partial information.** The speculation ratio test assumes the predecessor's success probability $p_i$ is known. In practice, $p_i$ is estimated from historical data and varies by task type. A robust version would use confidence intervals on $p_i$ and speculate only when the lower bound of $p_i/(1-p_i)$ exceeds $R/B$.

5. **Adaptive SPRT thresholds.** The SPRT thresholds in Section 5.7 are fixed based on the cost estimates. If costs are uncertain (which they are), a robust Bayesian extension would place priors on $c_I$ and $c_{II}$ and marginalize, yielding a decision rule that is less sensitive to cost misspecification.
