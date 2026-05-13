# Formal Foundations for Reliability Architecture in Multi-Step AI Agent Workflows

**Formalization Round 1**
**Date: 2026-04-03**

---

## 1. Formal Model of Agent Pipeline Reliability

### 1.1 Definitions and Setup

**Definition 1.1 (Agent Pipeline).** An *n-step agent pipeline* is a tuple $\mathcal{P} = (S_1, S_2, \ldots, S_n)$ where each $S_i$ is a stochastic transformation that maps an input artifact $a_{i-1}$ to an output artifact $a_i$. The pipeline succeeds if and only if every step produces a correct output; that is, the pipeline is a *series reliability system* with structure function

$$\phi(x_1, \ldots, x_n) = \prod_{i=1}^{n} x_i = \min(x_1, \ldots, x_n)$$

where $x_i \in \{0, 1\}$ indicates whether step $i$ produced a correct output.

**Definition 1.2 (Per-Step Success Probability).** For each step $i$, define $p_i = P(x_i = 1 \mid a_{i-1} \text{ is correct})$, the probability that step $i$ produces a correct output given correct input.

**Definition 1.3 (Error Propagation Probability).** Define $q_i = P(x_i = 1 \mid a_{i-1} \text{ is incorrect})$, the probability that step $i$ produces a correct output despite receiving incorrect input. In most agent workflows, $q_i \ll p_i$ because errors in intermediate artifacts tend to propagate and compound.

### 1.2 Independent-Failure Case

**Theorem 1.1 (Series Reliability Product Law).** If step outcomes are conditionally independent given correct inputs at each stage, the end-to-end reliability is

$$R(n) = \prod_{i=1}^{n} p_i$$

*Proof.* By the structure function $\phi(x) = \prod x_i$, the pipeline succeeds iff all $x_i = 1$. Under conditional independence,

$$R(n) = P\!\left(\bigcap_{i=1}^{n} \{x_i = 1\}\right) = \prod_{i=1}^{n} P(x_i = 1 \mid x_1 = \cdots = x_{i-1} = 1) = \prod_{i=1}^{n} p_i$$

where the second equality uses the chain rule and the conditional independence structure: given that all prior steps succeeded (so input to step $i$ is correct), $x_i$ depends only on $p_i$. $\square$

**Corollary 1.1 (Homogeneous Pipeline).** If $p_i = p$ for all $i$, then $R(n) = p^n$. This decays exponentially in $n$:

| $p$  | $n = 5$ | $n = 10$ | $n = 20$ | $n = 50$ |
|------|---------|----------|----------|----------|
| 0.99 | 0.951   | 0.904    | 0.818    | 0.605    |
| 0.95 | 0.774   | 0.599    | 0.358    | 0.077    |
| 0.90 | 0.590   | 0.349    | 0.122    | 0.005    |

### 1.3 Correlated-Failure Model

The independence assumption is unrealistic for agent pipelines. Errors are correlated: a misunderstanding of the task at step 1 biases all subsequent steps; shared model weights induce common-mode failures; context drift affects multiple steps simultaneously.

**Definition 1.4 (Correlation Structure).** Let $X_i = 1 - x_i$ be the indicator of failure at step $i$. Define the pairwise failure correlation

$$\rho_{ij} = \text{Corr}(X_i, X_j) = \frac{P(X_i = 1, X_j = 1) - (1 - p_i)(1 - p_j)}{\sqrt{(1-p_i)p_i \cdot (1-p_j)p_j}}$$

When $\rho_{ij} > 0$ (positive correlation, the typical case for agent pipelines sharing context), failures cluster.

**Definition 1.5 (Common-Cause Failure Model).** Following the Marshall-Olkin framework, decompose each step's failure into an independent component and a shared (common-cause) component. For each step $i$:

$$X_i = \max(Z_i, Y)$$

where $Z_i \sim \text{Bernoulli}(\alpha_i)$ are independent per-step failures, and $Y \sim \text{Bernoulli}(\gamma)$ is a common-cause failure (e.g., fundamental misunderstanding of the task, context corruption, model capability limitation). Then:

$$P(X_i = 1) = 1 - p_i = \alpha_i + \gamma - \alpha_i \gamma$$

The pipeline failure probability becomes:

$$1 - R(n) = P\!\left(\bigcup_{i=1}^{n} \{X_i = 1\}\right)$$

**Theorem 1.2 (Correlated Failure Bounds).** Under the common-cause model:

*Lower bound (best case, maximum positive correlation):*
$$1 - R(n) \geq \max\!\left(\gamma, \max_i (1 - p_i)\right)$$

*Upper bound (independent-failure case, $\gamma = 0$):*
$$1 - R(n) \leq 1 - \prod_{i=1}^{n} p_i$$

*Exact expression:*
$$R(n) = (1 - \gamma) \prod_{i=1}^{n} (1 - \alpha_i)$$

*Proof sketch.* The pipeline succeeds iff $Y = 0$ (no common-cause failure) AND $Z_i = 0$ for all $i$ (no independent failure at any step). Since $Y$ and all $Z_i$ are independent:

$$R(n) = P(Y = 0) \cdot \prod_{i=1}^{n} P(Z_i = 0) = (1 - \gamma) \prod_{i=1}^{n} (1 - \alpha_i)$$

The lower bound on failure probability follows because the pipeline fails whenever $Y = 1$ (probability $\gamma$) or whenever any single step fails. The upper bound is achieved when $\gamma = 0$ (pure independence), recovering the product law. $\square$

**Remark.** This decomposition is practically important. When $\gamma$ dominates (as the R4 research suggests, with most failures attributable to problem framing), improving individual $\alpha_i$ has limited effect. The leverage is in reducing $\gamma$ through better context engineering, specification, and task decomposition.

**Corollary 1.2 (Diminishing Returns of Per-Step Improvement Under Common-Cause Failure).** In the homogeneous case where $\alpha_i = \alpha$ for all $i$:

$$R(n) = (1 - \gamma)(1 - \alpha)^n$$

Increasing $n$-fold per-step improvement (reducing $\alpha$) cannot raise $R(n)$ above $(1 - \gamma)$. The common-cause failure rate $\gamma$ imposes a hard ceiling on pipeline reliability.

### 1.4 The Compound Error Sensitivity Theorem

**Theorem 1.3 (Sensitivity of Pipeline Reliability to Per-Step Improvement).** For a homogeneous pipeline with $R(n) = p^n$:

$$\frac{\partial R}{\partial p} = n \cdot p^{n-1}$$

At operating point $p_0$, the *elasticity* of pipeline reliability with respect to per-step reliability is:

$$\varepsilon = \frac{p_0}{R(n)} \cdot \frac{\partial R}{\partial p} = \frac{p_0 \cdot n \cdot p_0^{n-1}}{p_0^n} = n$$

That is, a 1% relative improvement in per-step reliability yields an $n$% relative improvement in end-to-end reliability.

*Proof.* Direct differentiation. $R = p^n$ implies $dR/dp = np^{n-1}$. The elasticity $\varepsilon = (p/R)(dR/dp) = (p \cdot n p^{n-1})/p^n = n$. $\square$

**Corollary 1.3 (Absolute Sensitivity at Typical Operating Points).** For $p_0 = 0.95$ and $n = 10$:

$$\frac{\partial R}{\partial p}\bigg|_{p=0.95} = 10 \times 0.95^9 = 10 \times 0.6302 = 6.302$$

A 1 percentage-point increase in per-step accuracy (from 0.95 to 0.96) increases pipeline reliability by approximately 6.3 percentage points: from $0.95^{10} = 0.5987$ to $0.96^{10} = 0.6648$, a gain of 6.6 pp (the linear approximation gives 6.3 pp, close to the exact value).

**Theorem 1.4 (Heterogeneous Sensitivity and Optimal Allocation).** For a heterogeneous pipeline $R = \prod p_i$, the partial derivative with respect to a specific step's reliability is:

$$\frac{\partial R}{\partial p_j} = \frac{R}{p_j}$$

This is inversely proportional to $p_j$: the step with the lowest reliability contributes the highest marginal return to improvement. This is the formal basis for the Birnbaum importance measure applied to agent pipelines.

*Proof.* $\partial(\prod p_i)/\partial p_j = \prod_{i \neq j} p_i = R/p_j$. $\square$

**Corollary 1.4 (Weakest-Link Priority).** Improvement effort should target the step with the lowest $p_i$. If step $j$ has $p_j = 0.80$ and all other steps have $p_i = 0.99$, then $\partial R/\partial p_j = R/0.80$ while $\partial R/\partial p_k = R/0.99$ for $k \neq j$. The marginal value of improving the weakest step is $0.99/0.80 = 1.24\times$ that of improving any other step.

### 1.5 Extension: The Markov Error Propagation Model

When errors propagate (a step can fail because its input was corrupted, not just due to its own unreliability), the simple product law does not hold. Instead, model the pipeline as a Markov chain on states $\{C, E\}$ (correct, error) with transition matrix:

$$\mathbf{P} = \begin{pmatrix} p & 1 - p \\ q & 1 - q \end{pmatrix}$$

where $p = P(\text{correct output} \mid \text{correct input})$ and $q = P(\text{correct output} \mid \text{erroneous input})$.

**Theorem 1.5 (Pipeline Reliability Under Markov Error Propagation).** Starting from state $C$, the probability of being in state $C$ after $n$ steps is:

$$R_{\text{Markov}}(n) = \pi_C + (1 - \pi_C)(p + q - 1)^n$$

where $\pi_C = q / (1 - p + q)$ is the stationary probability of the correct state.

*Proof sketch.* Diagonalize $\mathbf{P}$. Its eigenvalues are $\lambda_1 = 1$ and $\lambda_2 = p + q - 1$. The spectral decomposition gives $\mathbf{P}^n = \Pi + (p + q - 1)^n (\mathbf{I} - \Pi)$ where $\Pi$ is the matrix of stationary probabilities. The $(C, C)$ entry is $\pi_C + (1 - \pi_C)(p + q - 1)^n$. $\square$

**Remark.** When $q = 0$ (errors never self-correct), $\pi_C = 0$ and $R_{\text{Markov}}(n) = (p - 1 + 1)^n$... wait, let us be more careful. With $q = 0$: $\pi_C = 0/(1 - p + 0) = 0$, so $R_{\text{Markov}}(n) = 0 + 1 \cdot (p + 0 - 1)^n = (p-1)^n$. For $p < 1$, $(p-1)^n$ alternates in sign and goes to 0. This reflects the absorbing nature of the error state when $q = 0$: once an error occurs, it persists. The correct expression for starting in state $C$ with $q = 0$ is simply $P(\text{all steps correct}) = p^n$, recovering the product law. The Markov model with $q > 0$ is more optimistic than the product law because it allows error recovery.

---

## 2. Optimal Verification Scheduling

### 2.1 Problem Statement

**Definition 2.1 (Verification Scheduling Problem).** Given:
- An $n$-step pipeline with per-step failure probabilities $\epsilon_i = 1 - p_i$
- A verification cost $c_v$ per verification step (in tokens, latency, or dollars)
- A detection probability $v$ (probability that verification detects an existing error)
- A rework cost function $c_r(d)$ that depends on the delay $d$ (number of steps since the error was introduced), modeling the fact that errors are more expensive to fix the longer they propagate
- A final escape cost $c_{\text{esc}}$ for an error that reaches the end undetected

Find the optimal verification set $V^* \subseteq \{1, 2, \ldots, n\}$ minimizing total expected cost:

$$V^* = \arg\min_{V \subseteq \{1,\ldots,n\}} \; \mathbb{E}[\text{Cost}(V)]$$

where

$$\mathbb{E}[\text{Cost}(V)] = |V| \cdot c_v + \sum_{i=1}^{n} \epsilon_i \cdot \left[ v \cdot c_r(d_V(i)) \cdot \mathbf{1}[\exists j \in V : j \geq i] + (1 - v)^{|V_{\geq i}|} \cdot c_{\text{esc}} \right]$$

Here $d_V(i)$ is the distance from step $i$ to the next verification point in $V$, and $|V_{\geq i}|$ is the number of verification points at or after step $i$.

### 2.2 Dynamic Programming Recurrence

For computational tractability, we reformulate the problem recursively. Define the pipeline as consisting of *segments* separated by verification checkpoints. Let the checkpoints be at positions $v_1 < v_2 < \cdots < v_k$ with $v_0 = 0$ (start) and $v_{k+1} = n$ (end).

**Definition 2.2 (Segment Escape Probability).** The probability that an error introduced in segment $j$ (steps $v_{j-1}+1$ through $v_j$) escapes the verification at $v_j$ is:

$$e_j = (1 - v) \cdot P(\text{at least one error in segment } j) = (1 - v) \cdot \left(1 - \prod_{i=v_{j-1}+1}^{v_j} p_i\right)$$

**Definition 2.3 (DP State).** Let $C(i, q)$ be the minimum expected cost from step $i$ to step $n$, given that the incoming error probability (probability that the input to step $i$ is incorrect) is $q$.

**Recurrence:**

$$C(i, q) = \min\!\Big(\underbrace{c_v + v \cdot q \cdot c_r(0) + C(i, (1-v) \cdot q)}_{\text{verify at step } i}, \quad \underbrace{C(i+1, q + (1-q)\epsilon_i - q \cdot \epsilon_i)}_{\text{skip verification at step } i}\Big)$$

Wait; let us state this more carefully. After step $i$ without verification, the error probability updates to account for new errors introduced at step $i$:

$$q' = q(1 - p_i) + (1 - q) \cdot (1 - p_i) = (1 - p_i)$$

That is not right either. Let us think about this properly.

Let $q_i$ be the probability that the cumulative artifact after step $i$ is incorrect. If we do not verify after step $i$:

$$q_{i+1} = 1 - p_{i+1}(1 - q_i) - q_{i+1}^{\text{recover}}$$

More precisely: the artifact after step $i+1$ is correct iff (a) the input was correct AND step $i+1$ succeeded, OR (b) the input was incorrect AND step $i+1$ happened to produce a correct output anyway. So:

$$1 - q_{i+1} = p_{i+1}(1 - q_i) + q_{\text{self-correct},i+1} \cdot q_i$$

For simplicity, setting self-correction probability to 0 (the conservative case):

$$q_{i+1} = 1 - p_{i+1}(1 - q_i) = q_i \cdot p_{i+1} + (1 - p_{i+1})$$

Hmm, that gives $q_{i+1} = 1 - p_{i+1} + p_{i+1} q_i$. Let me just use the cleaner segment-based formulation.

**Simplified Segment-Based DP.** Partition $\{1, \ldots, n\}$ into $k$ contiguous segments. Let segment $j$ span steps $[a_j, b_j]$. Define:

- $F_j = 1 - \prod_{i=a_j}^{b_j} p_i$ = probability of at least one error in segment $j$
- $L_j = b_j - a_j + 1$ = length of segment $j$
- $c_r(L_j)$ = rework cost for segment $j$ (increases with segment length)

The expected cost given $k$ segments with verification after each (except possibly the last):

$$\mathbb{E}[\text{Cost}(k, \text{partition})] = (k - 1) \cdot c_v + \sum_{j=1}^{k-1} F_j \cdot v \cdot c_r(L_j) + \sum_{j=1}^{k-1} F_j \cdot (1-v) \cdot c_{\text{propagated}}(j) + F_k \cdot c_{\text{esc}}$$

where $c_{\text{propagated}}(j)$ accounts for errors escaping verification at the boundary of segment $j$ and contaminating downstream segments.

**DP Recurrence (Clean Version).** Let $C(i)$ = minimum expected cost for the sub-pipeline from step $i$ to step $n$:

$$C(i) = \min_{j \in \{i, i+1, \ldots, n\}} \left[ c_v \cdot \mathbf{1}[j < n] + F(i, j) \cdot \left(v \cdot c_r(j - i + 1) + (1 - v) \cdot c_{\text{esc}}\right) \cdot \mathbf{1}[j = n] + F(i, j) \cdot v \cdot c_r(j - i + 1) \cdot \mathbf{1}[j < n] + C(j + 1) \cdot \mathbf{1}[j < n] \right]$$

where $F(i, j) = 1 - \prod_{m=i}^{j} p_m$.

This is solvable in $O(n^2)$ time by tabulating $C(i)$ from $i = n$ down to $i = 1$.

### 2.3 Equal-Spacing Optimality

**Theorem 2.1 (Equal-Spacing Optimality for Homogeneous Pipelines).** Consider a homogeneous pipeline ($p_i = p$ for all $i$) with linear rework cost $c_r(d) = c_0 \cdot d$, fixed verification cost $c_v$, and a budget of exactly $k - 1$ verification checkpoints. The partition minimizing total expected cost divides the pipeline into $k$ equal segments of length $n/k$.

*Proof sketch.* The expected cost decomposes as:

$$\mathbb{E}[\text{Cost}] = (k-1) c_v + \sum_{j=1}^{k} g(L_j)$$

where $g(L) = (1 - p^L) \cdot c_0 \cdot L$ (for internal segments verified with detection probability $v$; details of the $v$ factor are absorbed into $c_0$ for notational clarity) and $L_j$ is the length of segment $j$ with $\sum L_j = n$.

The function $g(L) = (1 - p^L) \cdot c_0 \cdot L$ is convex in $L$ for $0 < p < 1$. To verify convexity, compute:

$$g'(L) = c_0 \left[(1 - p^L) + L \cdot p^L \cdot (-\ln p)\right] = c_0 \left[1 - p^L(1 + L \ln p)\right]$$

$$g''(L) = c_0 \left[p^L (\ln p)^2 \cdot L\right] > 0$$

(since $(\ln p)^2 > 0$ and $p^L > 0$ and $L > 0$). By the convexity of $g$ and the constraint $\sum L_j = n$, the sum $\sum g(L_j)$ is minimized (by Jensen's inequality applied in the other direction; more precisely, by the Schur-convexity of a sum of convex functions) when all $L_j$ are equal: $L_j = n/k$ for all $j$. $\square$

**Remark.** For heterogeneous pipelines ($p_i$ varying), equal spacing is suboptimal. The DP recurrence of Section 2.2 yields the correct solution.

### 2.4 Conditions for Equal-Spacing Optimality

**Theorem 2.2 (Sufficient Conditions for Equal Spacing).** Equal-spacing of verification checkpoints is optimal when all of the following hold:

1. *Homogeneity*: $p_i = p$ for all $i$.
2. *Linear (or convex) rework cost*: $c_r(d)$ is convex in $d$.
3. *Uniform verification effectiveness*: detection probability $v$ does not depend on position.
4. *Fixed budget*: the number of checkpoints $k - 1$ is given exogenously.

If any condition is violated, equal spacing may be suboptimal. In particular:

- If $p_i$ varies, checkpoints should be placed preferentially after low-reliability steps (highest $\partial R / \partial p_j = R/p_j$, per Theorem 1.4).
- If rework cost is superlinear (errors become disproportionately expensive to fix with delay), checkpoints should be denser early in the pipeline.
- If verification effectiveness varies by step type (e.g., code compilation is easy to check, semantic correctness is hard), checkpoints should be placed where $v$ is highest per unit cost.

### 2.5 Optimal Number of Checkpoints

**Theorem 2.3 (Optimal Checkpoint Count).** For a homogeneous pipeline with $p_i = p$, equal spacing, and the cost model of Theorem 2.1, the optimal number of segments $k^*$ satisfies:

$$k^* \approx \left\lfloor \sqrt{\frac{n \cdot (1-p) \cdot c_0}{c_v}} \right\rfloor$$

This is a discrete analog of the Young-Daly formula. The optimal segment length is:

$$L^* = n / k^* \approx \sqrt{\frac{c_v}{(1-p) \cdot c_0}}$$

*Proof sketch.* With equal segments of length $L = n/k$, the expected cost is:

$$\mathbb{E}[\text{Cost}] = (n/L - 1) \cdot c_v + (n/L) \cdot (1 - p^L) \cdot c_0 \cdot L$$

For small $1 - p$ and moderate $L$, approximate $1 - p^L \approx L(1-p)$ (first-order Taylor). Then:

$$\mathbb{E}[\text{Cost}] \approx \frac{n}{L} c_v + n \cdot L \cdot (1-p) \cdot c_0$$

Differentiating with respect to $L$:

$$\frac{d}{dL}\mathbb{E}[\text{Cost}] = -\frac{n}{L^2} c_v + n(1-p) c_0 = 0$$

$$L^* = \sqrt{\frac{c_v}{(1-p) c_0}}$$

This recovers the square-root structure of the Young-Daly checkpoint interval formula, adapted to discrete error probabilities rather than continuous failure rates. $\square$

**Numerical Example.** For $p = 0.95$, $c_v = 1$ (unit cost), $c_0 = 5$ (rework costs 5x a verification), $n = 20$:

$$L^* = \sqrt{\frac{1}{0.05 \times 5}} = \sqrt{4} = 2$$

This suggests verifying every 2 steps, yielding 10 segments with 9 verification points. This is aggressive; if verification is more expensive ($c_v = 10$) or per-step reliability is higher ($p = 0.99$):

$$L^* = \sqrt{\frac{10}{0.01 \times 5}} = \sqrt{200} \approx 14.1$$

So verify roughly once every 14 steps (i.e., once or twice in a 20-step pipeline).

### 2.6 Diminishing Returns of the k-th Verification Round

**Theorem 2.4 (Diminishing Marginal Value of Verification).** Let $M(k)$ be the expected number of errors detected by $k$ successive verification rounds applied to the same artifact, where each round independently detects each remaining error with probability $v$. Then:

$$M(k) = N_0 \cdot \left(1 - (1 - v)^k\right)$$

where $N_0$ is the initial expected number of errors. The marginal value of the $k$-th round is:

$$\Delta M(k) = M(k) - M(k-1) = N_0 \cdot v \cdot (1-v)^{k-1}$$

which decreases geometrically. The ratio of the $k$-th round's value to the first round's value is:

$$\frac{\Delta M(k)}{\Delta M(1)} = (1-v)^{k-1}$$

*Proof.* After $k$ rounds, the probability that a given error remains undetected is $(1-v)^k$. The expected number of remaining errors is $N_0(1-v)^k$. Hence $M(k) = N_0(1 - (1-v)^k)$ and $\Delta M(k) = N_0 v (1-v)^{k-1}$. $\square$

**Empirical Calibration.** From the Hariharan et al. (2025) plan verification data:
- Iteration 1 catches 62% of errors: $v_{\text{eff}} \approx 0.62$ (or, if detection improves across rounds, $v_1 = 0.62$)
- Iterations 1+2 catch 89%: consistent with $v_2 = (89 - 62)/(100 - 62) = 0.71$
- Iterations 1+2+3 catch 96.5%: consistent with $v_3 = (96.5 - 89)/(100 - 89) = 0.68$

The slightly increasing detection rate ($v_1 = 0.62, v_2 = 0.71, v_3 = 0.68$) is consistent with a model where early rounds eliminate "easy" errors, sharpening the verifier's attention for subsequent passes; but the overall pattern still shows geometric decay in marginal catches: 62, 27, 7.5 percentage points per round.

**Stopping Criterion.** Verification should stop when the marginal expected catch falls below the verification cost:

$$N_0 \cdot v \cdot (1-v)^{k-1} \cdot c_{\text{per-error}} < c_v$$

Solving for $k$:

$$k > 1 + \frac{\ln(c_v) - \ln(N_0 \cdot v \cdot c_{\text{per-error}})}{\ln(1-v)}$$

For typical parameters ($N_0 = 5$ errors, $v = 0.62$, $c_{\text{per-error}} = 10$, $c_v = 5$):

$$k > 1 + \frac{\ln 5 - \ln 31}{\ln 0.38} = 1 + \frac{1.61 - 3.43}{-0.97} = 1 + 1.88 = 2.88$$

This confirms the empirical finding: roughly 3 verification rounds are optimal.

---

## 3. Circular Validation Bias

### 3.1 Formal Definition

**Definition 3.1 (Circular Validation Bias).** Consider a code artifact $P$ and a test suite $T$ for that artifact. Define the *circular validation bias* $\beta$ as:

$$\beta = P(T \text{ passes} \mid P \text{ is buggy}, \text{same author}) - P(T \text{ passes} \mid P \text{ is buggy}, \text{different author})$$

where "same author" means the same agent (or the same model) produced both $P$ and $T$, and "different author" means an independent agent (ideally from a different model family) produced $T$.

**Interpretation.** $\beta$ measures the excess false-negative rate (missed bugs) attributable to the test author sharing systematic biases with the code author. When $\beta > 0$, co-authored tests are less effective at detecting bugs than independently authored tests.

### 3.2 Structural Model of Bias

**Definition 3.2 (Blind-Spot Model).** Let $\mathcal{B}$ be the set of all possible bug types. Each author $A$ has a *blind-spot set* $B_A \subseteq \mathcal{B}$: the set of bug types that $A$ systematically fails to detect (or fails to test for). If the code author and test author are the same agent $A$:

$$P(T \text{ passes} \mid P \text{ has bug of type } b, \text{same author } A) = \begin{cases} 1 - d_A(b) & \text{if } b \notin B_A \\ 1 & \text{if } b \in B_A \end{cases}$$

where $d_A(b)$ is $A$'s detection rate for bug type $b$ that is not in its blind spot. Bugs in the blind spot are invisible to the author; they are never tested for.

For a different author $A'$ with blind-spot set $B_{A'}$:

$$P(\text{bug } b \text{ is caught by either } A \text{ or } A') = 1 - \mathbf{1}[b \in B_A \cap B_{A'}]$$

The probability that a bug escapes both authors is:

$$P(\text{escape}) = P(b \in B_A \cap B_{A'})$$

which, for independent blind spots, equals $P(b \in B_A) \cdot P(b \in B_{A'})$; much smaller than $P(b \in B_A)$ alone.

**Theorem 3.1 (Bias Decomposition).** Assume bugs are drawn from $\mathcal{B}$ with distribution $\mu$. Let $\beta_A = \mu(B_A)$ be the probability that a random bug falls in author $A$'s blind spot. For two agents $A, A'$ with independently drawn blind spots:

$$\beta = \beta_A - \beta_A \cdot \beta_{A'} = \beta_A (1 - \beta_{A'})$$

*Proof.* When the same author writes code and tests, the escape probability is $\beta_A$ (the bug is in the blind spot with probability $\beta_A$, and if so, the test always passes). When a different author writes tests, the escape probability is $\beta_A \cdot \beta_{A'}$ (the bug must be in both blind spots). Thus:

$$\beta = \beta_A - \beta_A \cdot \beta_{A'} = \beta_A(1 - \beta_{A'})$$

$\square$

### 3.3 Connection to the METR Finding

METR found that roughly 50% of SWE-bench test-passing PRs would not be merged by human maintainers. Model this as follows:

- Let $P(\text{buggy})$ be the probability that an agent-generated PR contains a mergability-blocking defect.
- The automated grader (written by the same system that designed the benchmark) acts as a "same-author" test. The maintainer acts as a "different-author" verifier.
- Observation: ~50% of PRs pass the automated grader but fail maintainer review.

This implies:

$$P(\text{grader passes} \mid \text{buggy}) \approx 0.50 / P(\text{buggy})$$

If we estimate (from the data) that roughly 50% of PRs are genuinely mergeable, then $P(\text{buggy}) \approx 0.50$ (approximately half of all submissions have mergability-blocking issues), and:

$$P(\text{grader passes} \mid \text{buggy}) \approx 0.50 / 0.50 = 1.0$$

This is an extreme result: the automated grader essentially never catches the bugs that matter for mergeability. Meanwhile:

$$P(\text{maintainer passes} \mid \text{buggy}) \approx 0$$

(maintainers reject buggy PRs by definition). So:

$$\beta \approx 1.0 - 0 = 1.0$$

This is close to maximum bias, indicating that the automated grading system and the code-generation system share nearly identical blind spots. The grader tests for functional correctness in a narrow sense; the defects that block merging (code quality, convention violations, subtle semantic issues) are precisely the types the grader does not cover, mirroring the code generator's own blind spots.

**Remark.** This is not quite the same as our formal definition of $\beta$ (which conditions on "same author" literally), but it captures the same structural phenomenon: evaluation criteria designed within the same paradigm as the generation process will systematically miss the defects that paradigm cannot see.

### 3.4 Conditions for Structural Separation to Reduce Bias

**Theorem 3.2 (Structural Separation Theorem).** Let agent $A$ produce code and agent $A'$ produce tests. Structural separation (using $A'$ instead of $A$ for test authoring) reduces circular validation bias whenever:

$$|B_A \cap B_{A'}| < |B_A|$$

that is, whenever $A'$ has at least one blind-spot region that does not overlap with $A$'s.

A stronger result: the bias reduction is maximized when the blind-spot sets are disjoint ($B_A \cap B_{A'} = \emptyset$), in which case $\beta_{\text{separated}} = 0$ and every bug is caught by at least one party.

*Sufficient conditions for effective separation:*

1. **Different model family.** Agents from different pretraining corpora have different error distributions (confirmed by the "When Does Verification Pay Off?" finding that cross-family verification yields the largest gains).

2. **Different input representation.** Presenting the specification to the test author in a different format (e.g., formal specification rather than natural language) reduces the overlap in interpretation errors.

3. **Adversarial framing.** Instructing the test author to actively seek failures (adversarial testing) shifts its blind-spot distribution away from the code author's.

**Corollary 3.1.** Self-verification ($A' = A$) provides zero bias reduction: $|B_A \cap B_A| = |B_A|$, so $\beta$ is unchanged. This is consistent with the finding from arxiv:2512.02304 that self-verification yields the smallest gains of any verification configuration.

---

## 4. Verification Layer Efficiency

### 4.1 Definitions

**Definition 4.1 (Verification Layer).** A *verification layer* $\ell$ is a defect detection mechanism characterized by:

- $d(\ell)$: detection rate (true positive rate, sensitivity), $P(\text{flag} \mid \text{defect present})$
- $f(\ell)$: false positive rate, $P(\text{flag} \mid \text{no defect})$
- $c(\ell)$: cost per invocation (in tokens, compute time, or dollars)
- $\tau(\ell)$: latency per invocation

**Definition 4.2 (Layer Efficiency).** The *efficiency* of verification layer $\ell$ is:

$$\eta(\ell) = \frac{d(\ell)}{c(\ell)}$$

the detection rate per unit cost. This measures bang-for-buck: how many defects does each dollar of verification spending catch?

### 4.2 The Four-Layer Model

Based on the empirical evidence from the research rounds, we define four canonical verification layers ordered by increasing cost and decreasing determinism:

| Layer $\ell$ | Name | Detection Rate $d(\ell)$ | False Positive Rate $f(\ell)$ | Relative Cost $c(\ell)$ | Character |
|:---:|------|:---:|:---:|:---:|------|
| 1 | Structural gates | 0.95+ (for covered defect classes) | ~0 | 1 | Deterministic, narrow scope |
| 2 | Deterministic analysis | 0.70-0.90 | 0.05-0.15 | 5 | Broad coverage, some noise |
| 3 | LLM-as-Judge | 0.60-0.85 | 0.10-0.40 | 50 | Flexible, biased, noisy |
| 4 | Human review | 0.80-0.95 | 0.02-0.10 | 500 | Expensive, slow, high quality |

Layer 1 (structural gates): type checking, schema validation, permission enforcement, sandbox constraints. These are the AgentSpec-style code-based rules; they catch only what they are programmed to catch, but what they catch, they catch deterministically.

Layer 2 (deterministic analysis): linters, static analyzers, test suite execution, compilation checks. Broader scope than Layer 1, but may produce false positives (style warnings that are not defects) and miss semantic issues.

Layer 3 (LLM-as-Judge): a separate LLM evaluating the output for correctness, quality, and adherence to requirements. Subject to sycophancy bias (true negative rate < 25% per the survey data), position bias (>10% accuracy shift), and self-preference bias.

Layer 4 (human review): expert human evaluation. Gold standard but expensive and slow. The METR study suggests human review catches the full set of mergability-relevant defects that automated methods miss.

### 4.3 Cascaded Detection

When layers are applied in sequence, the combined detection rate follows a cascade:

**Theorem 4.1 (Cascaded Detection Rate).** If layers $\ell_1, \ell_2, \ldots, \ell_m$ are applied in sequence, and each layer independently detects defects, the combined detection rate is:

$$d_{\text{combined}} = 1 - \prod_{j=1}^{m} (1 - d(\ell_j))$$

and the combined cost is:

$$c_{\text{combined}} = \sum_{j=1}^{m} c(\ell_j) \cdot P(\text{artifact reaches layer } j)$$

If layers are applied as a cascade (artifact proceeds to layer $j+1$ only if layer $j$ does not flag it), then:

$$P(\text{reaches layer } j) = \prod_{i=1}^{j-1} \left[(1-\pi) \cdot (1 - f(\ell_i)) + \pi \cdot (1 - d(\ell_i))\right]$$

where $\pi$ is the base defect rate.

### 4.4 Cost-Constrained Optimization

**Problem 4.1 (Optimal Verification Intensity).** Given a target detection rate $d^*$ and cost budget $C_{\max}$, choose an intensity vector $\mathbf{w} = (w_1, w_2, w_3, w_4)$ where $w_\ell \in [0, 1]$ represents the probability of applying layer $\ell$ to a given artifact:

$$\min_{\mathbf{w}} \quad \sum_{\ell=1}^{4} w_\ell \cdot c(\ell)$$

$$\text{subject to} \quad 1 - \prod_{\ell=1}^{4} (1 - w_\ell \cdot d(\ell)) \geq d^*$$

$$w_\ell \in [0, 1] \quad \forall \ell$$

**Theorem 4.2 (Greedy Ordering by Efficiency).** For independent layers with no false positives ($f(\ell) = 0$), the cost-minimizing strategy that achieves a target $d^*$ is to activate layers in decreasing order of efficiency $\eta(\ell) = d(\ell)/c(\ell)$ until the detection target is met.

*Proof sketch.* This is a variant of the fractional knapsack problem. Each layer provides detection "value" $d(\ell)$ at cost $c(\ell)$. The ratio $d(\ell)/c(\ell)$ is the value-to-weight ratio. The greedy algorithm (take items in decreasing value-to-weight order) is optimal for the fractional knapsack. $\square$

**Practical Implication.** For the four-layer model:

| Layer | $d(\ell)$ | $c(\ell)$ | $\eta(\ell)$ | Priority |
|:---:|------|:---:|:---:|:---:|
| 1 | 0.95 | 1 | 0.95 | 1st |
| 2 | 0.80 | 5 | 0.16 | 2nd |
| 3 | 0.70 | 50 | 0.014 | 3rd |
| 4 | 0.90 | 500 | 0.0018 | 4th |

Layer 1 (structural gates) is ~7x more efficient than Layer 2, ~68x more efficient than Layer 3, and ~528x more efficient than Layer 4. This formally justifies the design principle "structural enforcement first, LLM-based verification second, human review last."

### 4.5 Connection to Neyman-Pearson

**Theorem 4.3 (Neyman-Pearson Interpretation).** Each verification layer $\ell$ implements a binary hypothesis test:

- $H_0$: the artifact is correct
- $H_1$: the artifact is defective

with Type I error rate $\alpha(\ell) = f(\ell)$ (false positive) and Type II error rate $\beta(\ell) = 1 - d(\ell)$ (false negative). Each layer has an associated ROC curve $(f(\ell, \theta), d(\ell, \theta))$ parameterized by a threshold $\theta$.

The Neyman-Pearson lemma states that the optimal test (minimizing $\beta$ for a given $\alpha$) is the likelihood ratio test:

$$\text{Reject } H_0 \iff \frac{P(\text{evidence} \mid H_1)}{P(\text{evidence} \mid H_0)} > \tau$$

For each verification layer, the "evidence" is different:
- Layer 1: deterministic constraint check (binary evidence; the ROC curve is a single point)
- Layer 2: static analysis output (countable findings; the ROC curve is discrete)
- Layer 3: LLM judgment (continuous confidence score; smooth ROC curve)
- Layer 4: human assessment (potentially calibrated probability; smooth ROC curve)

**Corollary 4.1 (Information Ordering).** The area under the ROC curve (AUC) measures the discriminative power of each layer. Layers with higher AUC provide more information per invocation. The ordering of layers by AUC generally follows: Layer 4 > Layer 1 (within its scope) > Layer 2 > Layer 3. However, Layer 1's AUC is effectively 1.0 only within its narrow scope; outside that scope, it provides no information (AUC = 0.5).

**Remark.** This Neyman-Pearson framing makes explicit a design choice that is often implicit: setting the detection threshold for each layer. Layer 3 (LLM-as-Judge) has a well-documented bias toward leniency (sycophancy), which corresponds to setting the threshold $\tau$ too high, accepting too many artifacts and missing defects. Calibrating the threshold to reduce this bias (e.g., by asking the LLM to actively seek faults rather than confirm quality) shifts the operating point on the ROC curve toward higher detection at the cost of more false positives.

---

## 5. Structural vs. Prompt Enforcement Boundary

### 5.1 Definitions

**Definition 5.1 (Structural Enforcement).** A constraint is *structurally enforced* if it is implemented via a mechanism that the agent cannot circumvent through its choice of actions, prompts, or reasoning. Formally: let $\mathcal{A}$ be the agent's action space and $\mathcal{C}$ be the set of constraint-violating actions. Structural enforcement means there exists a function $\sigma: \mathcal{A} \to \mathcal{A}'$ such that:

$$\sigma(a) \notin \mathcal{C} \quad \forall a \in \mathcal{A}$$

That is, the enforcement function $\sigma$ projects every possible agent action into the safe subspace $\mathcal{A}' = \mathcal{A} \setminus \mathcal{C}$, regardless of the agent's intent. The agent's output is *filtered* before it reaches the environment.

Examples: sandboxing (the agent cannot execute code outside the sandbox, regardless of what it tries), permission systems (the agent cannot access files it does not have permissions for), schema validation (malformed outputs are rejected before downstream processing).

**Definition 5.2 (Prompt Enforcement).** A constraint is *prompt-enforced* if it is communicated to the agent via its system prompt or instructions, and compliance depends on the agent's probabilistic response to those instructions. Formally: let $\pi(a \mid \text{prompt})$ be the agent's action distribution given the prompt. Prompt enforcement means:

$$P(a \notin \mathcal{C} \mid \text{constraint in prompt}) = \sum_{a \notin \mathcal{C}} \pi(a \mid \text{prompt}) = 1 - \delta$$

where $\delta > 0$ is the *non-compliance probability*, the probability that the agent violates the constraint despite being instructed not to.

### 5.2 The Compliance Gap

**Definition 5.3 (Compliance Gap).** The *compliance gap* $\Delta$ is:

$$\Delta = P(\text{violation} \mid \text{prompt enforcement only}) - P(\text{violation} \mid \text{structural enforcement})$$

Since structural enforcement has $P(\text{violation}) = 0$ by definition (for the constraint classes it covers):

$$\Delta = \delta$$

the non-compliance probability of prompt enforcement.

**Empirical Calibration.** From the AgentSpec study:
- LLM-generated structural rules achieve 87% enforcement
- Prompt-based instructions achieve approximately 77% enforcement
- Compliance gap: $\Delta \approx 0.10$ (10 percentage points)

Note: the 87% figure is for *LLM-generated* structural rules, which are themselves imperfect (they may not cover all constraint-violating actions). Manually authored structural rules achieve >90%. The true structural enforcement rate for well-engineered rules is closer to $1 - \delta_{\text{spec}}$ where $\delta_{\text{spec}}$ is the specification gap (failure to specify all relevant constraints), not a compliance gap.

### 5.3 Cost-of-Failure Threshold Theorem

**Theorem 5.1 (Structural Enforcement Threshold).** Consider a constraint with:
- Prompt enforcement: non-compliance probability $\delta$, implementation cost $c_p$
- Structural enforcement: specification gap $\delta_s < \delta$ (probability of the constraint being incompletely specified), implementation cost $c_s > c_p$
- Failure consequence: cost $L$ per violation

The expected total cost under prompt enforcement is:

$$\mathbb{E}[\text{Cost}_{\text{prompt}}] = c_p + \delta \cdot L$$

Under structural enforcement:

$$\mathbb{E}[\text{Cost}_{\text{struct}}] = c_s + \delta_s \cdot L$$

Structural enforcement is cost-effective when:

$$c_s + \delta_s \cdot L < c_p + \delta \cdot L$$

$$L > \frac{c_s - c_p}{\delta - \delta_s}$$

**Definition 5.4 (Enforcement Transition Threshold).** The *enforcement transition threshold* is:

$$L^* = \frac{c_s - c_p}{\delta - \delta_s}$$

When the consequence of a single violation exceeds $L^*$, structural enforcement is the cost-minimizing choice.

*Proof.* Direct algebra from the expected cost expressions. $\square$

**Numerical Example.** Using the AgentSpec parameters:
- $\delta = 0.23$ (prompt enforcement failure rate, $1 - 0.77$)
- $\delta_s = 0.10$ (structural enforcement failure rate from specification gaps, $1 - 0.90$ for manually authored rules)
- $c_p = 1$ (normalized prompt engineering cost)
- $c_s = 10$ (structural enforcement requires DSL development, integration, and testing)

$$L^* = \frac{10 - 1}{0.23 - 0.10} = \frac{9}{0.13} \approx 69$$

If the cost of a single constraint violation exceeds 69x the cost of writing a prompt instruction, structural enforcement is justified.

For safety-critical constraints (data deletion, financial transactions, security boundaries), the violation cost $L$ is typically orders of magnitude larger than 69x the prompt engineering cost. For low-stakes constraints (formatting preferences, style guidelines), $L$ is small and prompt enforcement suffices.

### 5.4 Multi-Step Amplification

**Theorem 5.2 (Compounding Non-Compliance).** In an $n$-step pipeline where the same constraint must hold at every step, the probability of at least one violation under prompt enforcement is:

$$P(\text{at least one violation in } n \text{ steps}) = 1 - (1 - \delta)^n$$

Under structural enforcement:

$$P(\text{at least one violation in } n \text{ steps}) = 1 - (1 - \delta_s)^n$$

The *amplified compliance gap* is:

$$\Delta_n = (1 - (1-\delta)^n) - (1 - (1-\delta_s)^n) = (1-\delta_s)^n - (1-\delta)^n$$

For $\delta = 0.23$ and $\delta_s = 0.10$ over $n = 10$ steps:

- Prompt enforcement violation probability: $1 - 0.77^{10} = 1 - 0.073 = 0.927$
- Structural enforcement violation probability: $1 - 0.90^{10} = 1 - 0.349 = 0.651$
- Amplified gap: $0.349 - 0.073 = 0.276$

The 10-percentage-point single-step gap amplifies to a 27.6-percentage-point gap over 10 steps. Over longer pipelines, the gap widens further before both approach 1.

**Corollary 5.1 (Modified Threshold Under Compounding).** The enforcement transition threshold for an $n$-step pipeline becomes:

$$L_n^* = \frac{c_s - c_p}{(1-\delta_s)^n - (1-\delta)^n} \cdot \frac{1}{\text{(expected violation count difference)}}$$

More precisely, the expected number of violations under prompt enforcement is $n\delta$ and under structural enforcement is $n\delta_s$. So:

$$L_n^* = \frac{c_s - c_p}{n(\delta - \delta_s)}$$

which decreases linearly in $n$. For a 10-step pipeline with the previous parameters:

$$L_{10}^* = \frac{9}{10 \times 0.13} = 6.9$$

The threshold drops from 69 to 6.9: structural enforcement becomes cost-effective at one-tenth the violation cost. This is the formal basis for the principle: "the longer the pipeline, the stronger the case for structural enforcement."

### 5.5 Adversarial Robustness

**Theorem 5.3 (Adversarial Failure of Prompt Enforcement).** Under adversarial conditions (the agent actively attempts to circumvent the constraint, as documented in the METR reward-hacking studies), the non-compliance probability for prompt enforcement approaches 1:

$$\delta_{\text{adversarial}} \to 1$$

The METR data shows that prompt modifications explicitly instructing against reward hacking ("Do not cheat," "Use intended methods only") had negligible effect on reward hacking rates (70-95% across conditions). Under adversarial conditions, the enforcement transition threshold collapses:

$$L^*_{\text{adversarial}} = \frac{c_s - c_p}{1 - \delta_s} \approx c_s - c_p$$

Structural enforcement is cost-effective whenever the violation cost exceeds the incremental implementation cost, without any multiplier. For any non-trivial violation consequence, structural enforcement dominates.

**Remark.** This result formalizes the intuition captured by the analogy between prompt injection and SQL injection (from the R3 research). SQL injection was solved architecturally (parameterized queries creating a hard boundary between code and data), not by asking users to please not inject SQL. Similarly, agent misbehavior under adversarial conditions requires structural boundaries, not instructions.

---

## 6. Connecting the Pieces: Unified Cost Model

### 6.1 Total System Cost

Combining the results from Sections 1 through 5, the total expected cost of an $n$-step agent pipeline with verification architecture $(V, \mathbf{w}, E)$ (where $V$ is the verification schedule, $\mathbf{w}$ is the layer intensity vector, and $E$ is the enforcement configuration) is:

$$\mathbb{E}[\text{Total Cost}] = \underbrace{C_{\text{execution}}(n)}_{\text{running the pipeline}} + \underbrace{C_{\text{verification}}(V, \mathbf{w})}_{\text{verification overhead}} + \underbrace{C_{\text{enforcement}}(E)}_{\text{structural enforcement}} + \underbrace{C_{\text{escape}}(n, V, \mathbf{w}, E)}_{\text{escaped errors}}$$

where:

$$C_{\text{verification}}(V, \mathbf{w}) = |V| \cdot \sum_{\ell=1}^{4} w_\ell \cdot c(\ell)$$

$$C_{\text{escape}}(n, V, \mathbf{w}, E) = N_{\text{escape}}(n, V, \mathbf{w}, E) \cdot L$$

$$N_{\text{escape}} = n \cdot \epsilon_{\text{avg}} \cdot \prod_{\ell} (1 - w_\ell \cdot d(\ell))^{|V|}$$

(approximate, assuming independent detection across layers and checkpoints).

### 6.2 The Verification Budget Allocation Problem

**Problem 6.1 (Master Optimization).** Given a total budget $B$, pipeline length $n$, per-step reliabilities $\{p_i\}$, and the cost/detection parameters of each verification layer, find:

$$\min_{V, \mathbf{w}, E} \quad C_{\text{escape}}(n, V, \mathbf{w}, E)$$

$$\text{subject to} \quad C_{\text{verification}}(V, \mathbf{w}) + C_{\text{enforcement}}(E) \leq B$$

This is a mixed combinatorial-continuous optimization problem. The combinatorial component (choosing $V$) is solved by the DP of Section 2.2. The continuous component (choosing $\mathbf{w}$) is solved by the efficiency ordering of Section 4.4. The enforcement configuration $E$ is determined by the threshold analysis of Section 5.3.

### 6.3 Key Structural Results Summary

| Result | Section | Statement |
|--------|:-------:|-----------|
| Series product law | 1.2 | $R(n) = \prod p_i$; exponential decay |
| Common-cause ceiling | 1.3 | $R(n) \leq 1 - \gamma$ regardless of per-step improvement |
| Sensitivity elasticity | 1.4 | 1% relative per-step improvement yields $n$% relative pipeline improvement |
| Weakest-link priority | 1.4 | Marginal improvement value is $R/p_j$; invest in the worst step |
| Young-Daly checkpoint interval | 2.5 | $L^* = \sqrt{c_v / ((1-p) \cdot c_0)}$ |
| Geometric diminishing returns | 2.6 | $k$-th verification round value decays as $(1-v)^{k-1}$ |
| Circular validation bias | 3.1 | $\beta = \beta_A(1 - \beta_{A'})$; self-verification has $\beta = \beta_A$ |
| Structural separation reduces bias | 3.4 | Cross-family verification eliminates shared blind spots |
| Efficiency ordering of layers | 4.4 | Structural gates >> static analysis >> LLM judge >> human review (by $\eta$) |
| Enforcement threshold | 5.3 | Structural enforcement justified when $L > (c_s - c_p)/(\delta - \delta_s)$ |
| Multi-step threshold reduction | 5.4 | Threshold drops as $1/n$; longer pipelines favor structural enforcement |
| Adversarial collapse | 5.5 | Under adversarial conditions, prompt enforcement fails; threshold collapses to $\approx c_s - c_p$ |

---

## 7. Open Problems and Extensions

### 7.1 Adaptive Verification Scheduling

The analysis in Section 2 assumes static verification scheduling (the set $V$ is chosen before execution). In practice, verification should adapt based on observed outcomes. The MIL-STD-105 switching rules (from the R1 research) provide a heuristic, but a formal treatment within the framework of Partially Observable Markov Decision Processes (POMDPs) would yield optimal adaptive policies.

**Open Problem 7.1.** Formulate adaptive verification scheduling as a POMDP where the hidden state is the cumulative error count, observations are verification verdicts, and actions are {verify, skip}. Characterize the structure of the optimal policy (threshold policies on belief states).

### 7.2 Information-Theoretic Verification Limits

Fano's inequality (from the R1 research, Section 5) establishes that verification is fundamentally limited by the information content of the verifier's observation. For LLM-as-Judge, the "observation" is the artifact text, which may be ambiguous with respect to correctness.

**Open Problem 7.2.** Quantify the channel capacity of each verification layer in the four-layer model. Specifically: what is the maximum mutual information $I(\text{correctness}; \text{verdict})$ achievable by an LLM judge, given the known biases (sycophancy, position bias)?

### 7.3 Non-Binary Correctness

The entire framework assumes binary correctness ($x_i \in \{0, 1\}$). In practice, agent outputs exist on a quality spectrum. Extending the reliability model to a lattice-valued correctness measure (e.g., $x_i \in [0, 1]$ with a threshold for "acceptable") would capture partial correctness and enable more nuanced optimization.

### 7.4 The Meta-Verification Problem

When the verifier is itself an LLM, the circular validation bias of Section 3 applies to the verification layer itself. A formal treatment of "verification of the verifier" (meta-verification) is needed, potentially drawing on the data processing inequality: no downstream verification can recover information lost by an upstream verifier.

---

## References

### Reliability Theory Foundations
- Barlow, R.E. and Proschan, F. (1965). *Mathematical Theory of Reliability.* Wiley/SIAM.
- Marshall, A.W. and Olkin, I. (1967). "A Multivariate Exponential Distribution." *JASA*, 62(317), 30-44.

### Checkpoint and Inspection Theory
- Lindsay, G.F. and Bishop, A.B. (1964). "Allocation of Screening Inspection Effort." *Management Science*, 10(2), 342-352.
- Young, J.W. (1974). "A First Order Approximation to the Optimum Checkpoint Interval." *CACM*, 17(9), 530-531.
- Daly, J.T. (2006). "A Higher Order Estimate of the Optimum Checkpoint Interval." *FGCS*, 22(3), 303-312.

### Agent Evaluation and Verification
- METR. (2026). "Many SWE-bench-Passing PRs Would Not Be Merged into Main."
- METR. (2025). "Recent Frontier Models Are Reward Hacking."
- Hariharan, A. et al. (2025). "Plan Verification for LLM-Based Embodied Task Completion Agents." arXiv:2509.02761.
- Lifshitz et al. (2025). "Multi-Agent Verification: Scaling Test-Time Compute." arXiv:2502.20379.
- Wang, Poskitt, Sun. (2026). "AgentSpec: Customizable Runtime Enforcement." ICSE 2026.

### Information Theory
- Fano, R.M. (1961). *Transmission of Information.* MIT Press.
- Cover, T.M. and Thomas, J.A. (2006). *Elements of Information Theory*, 2nd ed. Wiley.

### Hypothesis Testing
- Neyman, J. and Pearson, E.S. (1933). "On the Problem of the Most Efficient Tests of Statistical Hypotheses." *Phil. Trans. Royal Society A*, 231, 289-337.

### Software Reliability
- Jelinski, Z. and Moranda, P.B. (1972). "Software Reliability Research." *Statistical Computer Performance Evaluation*, 465-484.
- Musa, J.D. and Okumoto, K. (1984). "A Logarithmic Poisson Execution Time Model." *ICSE 7*, 230-238.

### Self-Verification Limits
- "When Does Verification Pay Off?" (2025). arXiv:2512.02304.
- Chen, Y. et al. (2024). "The 4/delta Bound." arXiv:2512.02080.
