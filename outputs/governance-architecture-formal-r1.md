# Information-Theoretic Foundations of Governance Architecture

**Formalization Round 1 (Revised)**
**Date: 2026-04-03**

---

## Preamble: Scope and Epistemic Status

This document develops formal information-theoretic machinery for reasoning about governance architecture in AI coding harnesses. The central problem: when AI agents modify codebases faster than humans can evaluate, architectural coherence depends on governance mechanisms whose capacity is fundamentally bounded. We formalize these bounds.

Epistemic categories:

- **Established theory** (marked [E]): standard results from information theory, rate-distortion theory, or algorithmic information theory applied without modification.
- **Novel synthesis** (marked [S]): known results composed or reframed for the governance architecture setting.
- **Conjectured** (marked [C]): claims motivated by the analogy but lacking formal proof.

All notation is LaTeX-ready. Variables are defined at first use and collected in the notation summary (Section 6).

---

## 1. Theory Loss as Information Loss

### 1.1 Setup and Definitions [S]

Naur (1985) argues that the "theory" behind a program, the programmer's mental model of how the problem maps to code, cannot be fully captured in documentation, comments, or any external artifact. Polanyi (1966) makes the parallel claim for tacit knowledge generally: "we can know more than we can tell." We formalize this using rate-distortion theory.

**Definition 1.1 (Program Theory).** A *program theory* $T$ is a random variable over a measurable space $(\mathcal{T}, \Sigma_{\mathcal{T}})$ representing the totality of a developer's (or agent's) mental model of a program. Following Naur's three-aspect decomposition, $T$ comprises:

- $T_{\text{map}}$: the mapping from problem domain to code structure (reality-mapping knowledge)
- $T_{\text{just}}$: the rationale for design decisions (design justification)
- $T_{\text{mod}}$: the causal model of how changes propagate (modification intelligence)

**Definition 1.2 (Theory Distortion Measure).** A *distortion function* $d: \mathcal{T} \times \hat{\mathcal{T}} \to [0, \infty)$ decomposes along Naur's three aspects:

$$d(T, \hat{T}) = w_1 \cdot d_{\text{map}}(T, \hat{T}) + w_2 \cdot d_{\text{just}}(T, \hat{T}) + w_3 \cdot d_{\text{mod}}(T, \hat{T})$$

where $w_i > 0$, $\sum_i w_i = 1$, and $d(t, \hat{t}) = 0$ if and only if $\hat{t}$ is a perfect reconstruction of $t$.

**Definition 1.3 (Extraction Channel).** An *extraction channel* is a conditional distribution $p(\hat{T} \mid T)$ representing the process of externalizing theory $T$ into an artifact $\hat{T}$ (documentation, ADRs, commit messages, structured logs). The artifact $\hat{T}$ takes values in a reconstruction space $(\hat{\mathcal{T}}, \Sigma_{\hat{\mathcal{T}}})$. The full system is: $T \xrightarrow{p(\hat{T}|T)} \hat{T} \xrightarrow{g} T'$, where $g$ is the reconstruction decoder.

### 1.2 Rate-Distortion Formulation [E + S]

The rate-distortion function (Shannon, 1959) gives the minimum number of bits required to represent the source with average distortion at most $D$:

$$R(D) = \min_{p(\hat{T} \mid T): \, \mathbb{E}[d(T, \hat{T})] \leq D} I(T; \hat{T})$$

where $I(T; \hat{T})$ is the mutual information between the original theory and its externalized reconstruction.

**Theorem 1.1 (Theory Extraction as Rate-Distortion Problem)** [S]. *The process of extracting program theory into documentation is a lossy source coding problem. For any extraction mechanism $p(\hat{T} \mid T)$ that achieves average distortion $D$, the extraction must produce at least $R(D)$ bits of structured output. Conversely, for any rate $R > R(D)$, there exists an extraction mechanism achieving distortion $\leq D$.*

*Proof sketch.* Direct application of Shannon's rate-distortion theorem. The extraction channel $p(\hat{T} \mid T)$ is a (possibly stochastic) encoder. The artifact $\hat{T}$ serves as the compressed representation. The theorem guarantees that no extraction method can beat the rate-distortion bound. $\square$

### 1.3 The Tacit Knowledge Divergence [S + C]

The key claim, connecting Naur and Polanyi, is that program theory contains components for which the rate-distortion function diverges.

**Definition 1.4 (Tacit-Explicit Decomposition).** Decompose the program theory as $T = (T_e, T_\tau)$, where $T_e$ denotes aspects expressible in formal notation (algorithms, data structures, API contracts, type signatures, documented constraints) and $T_\tau$ denotes aspects that resist formalization (design intuitions, aesthetic judgments about code quality, the causal understanding of why alternatives were rejected, modification heuristics encoding pairwise interaction effects).

**Assumption 1.1 (Polanyi Irreducibility).** Any attempt to formalize a component of $T_\tau$ disrupts subsidiary awareness (Polanyi's from-to structure), such that:

$$K(T_\tau \mid F) \geq K(T_\tau) - o(K(T_\tau))$$

for any finite formal description $F$. That is, conditioning on any finite externalization reduces the Kolmogorov complexity of $T_\tau$ by at most a sublinear amount.

**Theorem 1.2 (Divergence of $R(D)$ for Tacit Knowledge)** [S]. *Under Assumption 1.1, and assuming $T_e$ and $T_\tau$ are conditionally independent given the program text:*

1. *The rate-distortion function for the full theory satisfies $\lim_{D \to 0} R(D) = \infty$.*

2. *More precisely, $R(D) \geq R_e(D_e) + R_\tau(D_\tau)$ where $D = w_e D_e + w_\tau D_\tau$, and $R_\tau(D_\tau) = \Omega(\log(1/D_\tau))$ diverges as $D_\tau \to 0$.*

3. *For the explicit component, $R_e(0) = H(T_e) < \infty$ since $T_e$ can be perfectly described in finite bits.*

*Proof sketch.* By the independence assumption, $I(T; \hat{T}) \geq I(T_e; \hat{T}) + I(T_\tau; \hat{T})$, so $R(D) \geq R_e(D_e) + R_\tau(D_\tau)$. For $T_e$, the rate-distortion function is well-behaved: $K(T_e) < \infty$ ensures $R_e(0) < \infty$. For $T_\tau$, Assumption 1.1 implies that no finite description $\hat{T}$ can reduce distortion to zero. The conditional entropy $H(T_\tau \mid \hat{T}) > 0$ for all $\hat{T}$ with finite $H(\hat{T})$. By the Shannon lower bound $R(D) \geq h(T) - h(D)$ (for continuous sources with differential entropy $h$), and the fact that $h(T_\tau)$ remains unbounded relative to any finite description, the divergence follows. For a Gaussian source with squared-error distortion, $R(D) = \frac{1}{2}\log\frac{\sigma^2}{D}$, giving the $\Omega(\log(1/D))$ rate; for heavier-tailed sources (modeling the long tail of design rationale), divergence can be faster. $\square$

**Corollary 1.1 (The Governance Distortion Floor)** [S]. *For any governance system producing artifacts of bounded size $|\hat{T}| \leq B$:*

$$\mathbb{E}[d(T, T')] \geq D^*(B) > 0$$

*where $D^*(B)$ is the distortion-rate function (the inverse of $R(D)$). Perfect architectural knowledge reconstruction is impossible from finite artifacts.*

### 1.4 Connection to Kolmogorov Complexity [E + S]

**Definition 1.5 (Kolmogorov Complexity of Theory).** For a fixed universal Turing machine $U$, the Kolmogorov complexity of a theory instance $t$ is $K(t) = \min\{|p| : U(p) = t\}$.

**Theorem 1.3 (Incompressibility of Tacit Knowledge)** [S]. *If $T_\tau$ contains components that are Kolmogorov-random relative to any formal language $\mathcal{L}$ used for documentation, then for those components $t_\tau$:*

$$K(t_\tau) \geq |t_\tau| - O(1)$$

*No description in $\mathcal{L}$ is shorter than the component itself. Since $|t_\tau|$ may grow with experience, context, and project history, perfect externalization requires unbounded description length.*

*Proof sketch.* By the incompressibility theorem, a fraction of at least $1 - 2^{-c}$ of all strings of length $n$ satisfy $K(x) \geq n - c$. If the tacit components are drawn from a distribution placing non-negligible mass on incompressible strings (relative to the documentation language), then with high probability they cannot be compressed. By Chaitin's incompleteness theorem, for any formal system $F$ of complexity $K(F)$, we cannot prove "$K(x) > K(F) + O(1)$" within $F$, so we cannot even certify that a given tacit component has been fully captured. $\square$

**Proposition 1.4 (Incompressibility of Modification Intelligence)** [S]. *Among Naur's three aspects, modification intelligence ($T_{\text{mod}}$) is the most resistant to compression:*

$$K(T_{\text{mod}}) = \Omega(n \cdot \log n)$$

*where $n$ is the number of program components, because modification intelligence requires encoding pairwise interaction effects: how changing component $i$ affects component $j$, for all coupled pairs $(i,j)$. The number of such pairs grows as $O(n^2)$ in the worst case and as $O(n \log n)$ for typical sparse coupling structures.*

*Remark.* This connects to Naur's observation that program "death" manifests specifically as inability to respond intelligently to modification requests. The mapping-to-reality component ($T_{\text{map}}$) can often be recovered from requirements documents; design justification ($T_{\text{just}}$) can be partially recovered from ADRs; but modification intelligence ($T_{\text{mod}}$) requires understanding the full interaction structure, which grows combinatorially.

**Corollary 1.2 (Governance Implication)** [S]. *No governance mechanism based on artifact inspection alone can detect the loss of tacit knowledge components with $K(t_\tau) \geq |t_\tau| - O(1)$. Governance must include mechanisms that probe the theory holder directly (code review conversations, design critiques, architectural challenges) rather than relying solely on documentation.*

---

## 2. Drift as Divergence

### 2.1 Architecture as Distribution [S]

**Definition 2.1 (Architectural State Distribution).** Let $\mathcal{S} = \{s_1, \ldots, s_m\}$ be the space of architectural states, where each $s_i$ represents a complete assignment of module boundaries, dependency directions, interface contracts, and invariant satisfaction. The intended architecture defines a reference distribution $P$ over $\mathcal{S}$, concentrating mass on states consistent with accepted ADRs. The actual architecture at time $t$ defines $Q_t$ over $\mathcal{S}$, estimated empirically by sampling the codebase state.

**Definition 2.2 (Architectural Drift).** The *drift* at time $t$ is:

$$\Delta(t) = D_{\text{KL}}(P \,\|\, Q_t) = \sum_{s \in \mathcal{S}} P(s) \log \frac{P(s)}{Q_t(s)}$$

We use $D_{\text{KL}}(P \| Q_t)$ (not $D_{\text{KL}}(Q_t \| P)$) because we measure how well the actual distribution $Q_t$ covers the intended states $P$. If $P$ assigns mass to a state that $Q_t$ does not support ($Q_t(s) = 0$ for some $s$ with $P(s) > 0$), this is a severe conformance violation, and the KL divergence correctly assigns infinite penalty.

### 2.2 Drift Dynamics [S]

**Definition 2.3 (Drift Rate).** The instantaneous drift rate is:

$$\rho(t) = \frac{d}{dt} D_{\text{KL}}(P \| Q_t) = -\sum_{s \in \mathcal{S}} P(s) \cdot \frac{\dot{Q}_t(s)}{Q_t(s)}$$

In the discrete (commit-level) setting, replace with drift increments $\rho_k = D_{\text{KL}}(P \| Q_{t_k}) - D_{\text{KL}}(P \| Q_{t_{k-1}})$.

**Theorem 2.1 (Drift Dynamics Under Agent Modifications)** [S]. *Let agents produce modifications at rate $\lambda$ (changes per unit time), each introducing drift increment $\delta_i$. Let governance correct drift at rate $\mu$ with per-correction reduction $\bar{c}$. If increments are i.i.d. with $\mathbb{E}[\delta_i] = \bar{\delta}$, then:*

$$\frac{d\mathbb{E}[\Delta(t)]}{dt} = \lambda \bar{\delta} - \mu \bar{c}$$

*The architecture is stable if and only if $\mu \bar{c} \geq \lambda \bar{\delta}$.*

*Proof sketch.* By linearity of expectation, the expected drift change per unit time is the sum of drift introduced (rate $\lambda$, magnitude $\bar{\delta}$ each) minus drift removed (rate $\mu$, magnitude $\bar{c}$ each). $\square$

**Theorem 2.2 (Drift Accumulation Under Unmonitored Execution)** [S]. *For $n$ unmonitored agent commits with i.i.d. drift increments $\rho_k$, $\mathbb{E}[\rho_k] = \mu_\rho > 0$, $\text{Var}(\rho_k) = \sigma^2$:*

$$\mathbb{E}[\Delta(t_n)] = \Delta(t_0) + n\mu_\rho$$

$$\Pr\left[\Delta(t_n) > \Delta(t_0) + n\mu_\rho + z\sigma\sqrt{n}\right] \leq \Phi(-z)$$

*Drift grows linearly in the number of unmonitored commits. The i.i.d. assumption is conservative; in practice, correlated increments (a bad architectural choice making subsequent bad choices more likely) cause superlinear growth.*

*Proof sketch.* Direct application of CLT to $\Delta(t_n) = \Delta(t_0) + \sum_{k=1}^n \rho_k$. $\square$

### 2.3 Irreversibility Threshold [S + C]

**Definition 2.4 (Irreversibility Threshold).** Define $\Delta^*$ as the drift level beyond which the cost of correction exceeds the cost of reimplementation:

$$\Delta^* = \inf\left\{\Delta : C_{\text{correct}}(\Delta) > C_{\text{rewrite}}\right\}$$

For a bounded, symmetric measure suitable for threshold detection, use the Jensen-Shannon divergence:

$$D_{\text{JS}}(P \| Q_t) = \frac{1}{2} D_{\text{KL}}(P \| M) + \frac{1}{2} D_{\text{KL}}(Q_t \| M), \quad M = \frac{P + Q_t}{2}$$

Since $D_{\text{JS}} \in [0, 1]$ (for base-2 logarithms), a practical alarm fires when $D_{\text{JS}}(P \| Q_t) > \tau$ for threshold $\tau \in (0, 1)$.

**Conjecture 2.1 (Drift Irreversibility)** [C]. *For governance systems operating below channel capacity (Section 3), there exists a critical time $t^*$ such that $\Delta(t^*) = \Delta^*$ and for $t > t^*$, the expected cost of architectural recovery grows superlinearly in $t - t^*$. The superlinear growth arises because drift is self-reinforcing: a codebase that has diverged from its intended architecture becomes harder to modify in compliance with that architecture, creating a positive feedback loop.*

### 2.4 Change-Point Detection for Drift [E + S]

**Definition 2.5 (CUSUM for Drift Detection).** Apply Page's CUSUM test (1954) to drift increments $\{\rho_k\}$:

$$S_k = \max(0, \; S_{k-1} + \rho_k - \nu), \quad S_0 = 0$$

where $\nu > 0$ is the allowable baseline drift rate. Alarm when $S_k > h$ for threshold $h > 0$.

**Theorem 2.3 (CUSUM Detection Delay)** [E]. *By Moustakides (1986), CUSUM minimizes the worst-case expected detection delay among all procedures with a given false alarm rate. For a shift from baseline drift rate $\nu$ to elevated rate $\mu_1 > \nu$, the expected delay satisfies:*

$$\mathbb{E}[\text{delay}] \approx \frac{h}{\mu_1 - \nu}$$

*By Wald's identity. Smaller $h$ yields faster detection at the cost of more false alarms.*

**Definition 2.6 (BOCPD for Drift Regime Detection)** [E + S]. *For Bayesian settings, maintain a posterior over run length $r_t$ (observations since last change point):*

$$P(r_t \mid \rho_{1:t}) \propto P(\rho_t \mid r_t, \rho_{1:t-1}) \cdot P(r_t \mid r_{t-1}) \cdot P(r_{t-1} \mid \rho_{1:t-1})$$

*Trigger governance review when $\max_{r_t < k} P(r_t \mid \rho_{1:t}) > 1 - \alpha$, indicating high posterior probability of a recent change point (a shift in drift regime).*

*Remark.* CUSUM is optimal for detecting a single shift to a known post-change distribution. BOCPD is preferable when the change-point is modeled as random, when multiple regime changes may occur, or when the post-change distribution is unknown. In the governance context, BOCPD is more natural: architectural drift may undergo multiple phase transitions (e.g., steady state, gradual erosion, rapid degradation) that BOCPD can detect sequentially.

---

## 3. Governance Channel Capacity

### 3.1 The Governance Channel [S]

**Definition 3.1 (Governance Channel).** Model governance as a discrete memoryless channel $(X, p(Y \mid X), Y)$ where:

- $X$ is the input alphabet: architectural intent signals (ADRs, fitness functions, review decisions, lint rules, type constraints)
- $Y$ is the output alphabet: actual code states after agent execution (compliant changes, ignored feedback, misunderstood corrections)
- $p(Y \mid X)$: the transition probability, capturing noise from: (a) ambiguity in natural-language ADRs, (b) LLM hallucination and specification misinterpretation, (c) context window limitations preventing full intent transmission, (d) emergent interactions between concurrent agent sessions

**Definition 3.2 (Governance Channel Capacity).** The governance channel capacity is:

$$C_{\text{gov}} = \max_{p(X)} I(X; Y) = \max_{p(X)} [H(Y) - H(Y \mid X)]$$

the maximum rate (bits per governance cycle) at which architectural intent can be reliably transmitted to code reality.

### 3.2 The Fundamental Governance Theorem [S]

**Theorem 3.1 (Governance Capacity Bound).** *Let $R_{\text{drift}}$ be the rate of architectural drift (bits per unit time). Let $C_{\text{gov}}$ be the governance channel capacity (bits per unit time). Then:*

1. *If $R_{\text{drift}} < C_{\text{gov}}$: there exists a governance coding scheme (combination of ADRs, fitness functions, review protocols, automated checks) that maintains architectural coherence with arbitrarily small residual drift.*

2. *If $R_{\text{drift}} > C_{\text{gov}}$: no governance scheme can prevent drift from growing without bound. The minimum residual drift accumulation rate is $R_{\text{drift}} - C_{\text{gov}}$.*

3. *The critical ratio $R_{\text{drift}} / C_{\text{gov}}$ determines the governance regime:*
   - $R_{\text{drift}} / C_{\text{gov}} < 1$: **sustainable governance** (corrections outpace drift)
   - $R_{\text{drift}} / C_{\text{gov}} = 1$: **marginal governance** (corrections barely keep pace)
   - $R_{\text{drift}} / C_{\text{gov}} > 1$: **governance failure** (drift outpaces correction capacity)

*Proof sketch.* This is a direct analogue of Shannon's noisy channel coding theorem (1948). The drift rate corresponds to the source rate $R$; the governance channel capacity corresponds to $C$. Shannon proved that reliable communication is possible if and only if $R < C$. Here, "reliable communication" means architectural intent is faithfully instantiated in code. Part (1): when drift rate is below capacity, layered governance (automated linting catches syntactic drift, CI tests catch behavioral drift, human review catches semantic drift, ADRs catch strategic drift) provides sufficient redundancy. Part (2): by the converse of the channel coding theorem, when drift rate exceeds capacity, the probability of governance failure is bounded away from zero regardless of governance sophistication. $\square$

### 3.3 Capacity Decomposition and the AI Speed Problem [S]

**Proposition 3.1 (Governance Capacity Decomposition).** *The effective governance capacity decomposes across mechanisms:*

$$C_{\text{eff}} = \sum_{i} C_i \cdot \eta_i$$

*where $C_i$ is the raw capacity of mechanism $i$ and $\eta_i \in [0, 1]$ is its efficiency. With equality when mechanisms operate on non-overlapping aspects of architecture; strictly less when they overlap (redundant governance).*

| Mechanism | Capacity $C_i$ | Efficiency $\eta_i$ | Notes |
|-----------|----------------|---------------------|-------|
| Type system / compiler | High | 0.95-1.0 | Rejects nonconforming states at compile time |
| Fitness functions (CI) | Medium | 0.6-0.9 | Coverage-dependent; invariant-specific |
| Lint rules | Medium | 0.7-0.95 | Effective for syntactic/structural invariants |
| ADR documentation | Low | 0.2-0.5 | Requires agent retrieval, parsing, compliance |
| Human review | Variable | 0.3-0.8 | Bottlenecked by reviewer throughput |

**Corollary 3.1 (The AI Speed Problem)** [S]. *When AI agents increase modification rate by factor $k$ while governance capacity $C_{\text{gov}}$ remains constant:*

$$\frac{R'_{\text{drift}}}{R_{\text{drift}}} = k, \quad \frac{R'_{\text{drift}}}{C_{\text{gov}}} = k \cdot \frac{R_{\text{drift}}}{C_{\text{gov}}}$$

*A system in the sustainable regime ($R_{\text{drift}}/C_{\text{gov}} < 1$) transitions to governance failure when $k > C_{\text{gov}} / R_{\text{drift}}$. This formalizes the central problem: AI agents can push drift rate beyond governance channel capacity, making architectural degradation inevitable without proportional investment in governance capacity.*

**Corollary 3.2 (Automated Governance Necessity)** [S]. *Maintaining $R_{\text{drift}} < C_{\text{gov}}$ under increasing $\lambda$ requires increasing $C_{\text{gov}}$ at a commensurate rate. Since human review capacity is bounded, automated governance layers (fitness functions, architectural tests, invariant checkers) are necessary, not merely convenient. The automation must itself be correct with respect to architectural intent, creating a recursive governance problem.*

---

## 4. Theory Capture Rate and Extraction Fidelity

### 4.1 The Extraction Problem [S]

AI coding agents produce verbose execution logs $L$ (often $10^4$ to $10^6$ tokens) containing decisions, assumptions, rejected alternatives, reasoning traces, tool calls, and backtracking events. The governance system must extract structured knowledge from these logs.

**Definition 4.1 (Structured Extraction).** The extraction function $\phi: \mathcal{L} \to \mathcal{D} \times \mathcal{A}_d \times \mathcal{R}$ maps a log to a triple $(D, A_d, R)$ where:

- $D$: decisions made (what was chosen and why)
- $A_d$: assumptions relied upon (what was taken as given)
- $R$: rejected alternatives (what was considered and discarded, with rationale)

This is a lossy compression: $|L| \gg |(D, A_d, R)|$, typically by a factor of 50 to 200. The extraction forms a Markov chain:

$$T \to L \to (D, A_d, R)$$

where $T$ is the underlying program theory that generated the log.

### 4.2 Fidelity Bounds from the Data Processing Inequality [E + S]

**Definition 4.2 (Extraction Fidelity).** The extraction fidelity is:

$$\mathcal{F} = I(L; (D, A_d, R)) = H(D, A_d, R) - H(D, A_d, R \mid L)$$

Perfect fidelity ($\mathcal{F} = H(D, A_d, R)$) means the extraction is a deterministic function of the log; zero fidelity means the extraction carries no information about the log content.

**Theorem 4.1 (Data Processing Inequality for Extraction)** [E]. *For the Markov chain $T \xrightarrow{\text{agent}} L \xrightarrow{\phi} (D, A_d, R) \xrightarrow{\psi} T'$:*

$$I(T; T') \leq I(T; (D, A_d, R)) \leq I(T; L) \leq H(T)$$

*Each processing step can only lose information. Consequently:*

1. **The agent bottleneck**: $I(T; L) < H(T)$ because the agent does not externalize all aspects of its reasoning (many token-level decisions are not logged; the mapping from theory to action is lossy).

2. **The extraction bottleneck**: $I(T; (D, A_d, R)) < I(T; L)$ because $\phi$ discards most of the log by design (compression ratio 50-200x).

3. **The reconstruction bottleneck**: $I(T; T') \leq I(T; (D, A_d, R))$ because reconstructing theory from structured records loses further context.

*Proof.* The data processing inequality states that for any Markov chain $X \to Y \to Z$, $I(X; Z) \leq I(X; Y)$. This follows from the non-negativity of conditional mutual information: $I(X; Y \mid Z) \geq 0$ implies $I(X; Y, Z) \geq I(X; Z)$, and since $X \to Y \to Z$ gives $I(X; Y, Z) = I(X; Y)$, we obtain $I(X; Y) \geq I(X; Z)$. Apply this twice to the four-stage chain. $\square$

**Corollary 4.1 (Minimum Log Requirements)** [S]. *For a target governance fidelity $\mathcal{F}^*$, the log must satisfy $H(L) \geq I(L; (D, A_d, R)) \geq \mathcal{F}^*$. If the agent's logging is too sparse ($H(L)$ too low), no extraction function can achieve the target fidelity. This provides a formal argument for structured logging: agents must be instrumented to emit logs with sufficient entropy to support downstream governance extraction.*

### 4.3 The Compression-Fidelity Tradeoff [S]

**Definition 4.3 (Extraction Distortion).** Define the extraction distortion as:

$$d_{\text{extract}}(T, (D, A_d, R)) = H(T \mid D, A_d, R)$$

the conditional entropy of the theory given the extraction (residual uncertainty about $T$ after observing the structured output).

**Theorem 4.2 (Extraction Rate-Distortion Bound)** [S]. *The minimum description length of the structured extraction needed to achieve distortion at most $D_0$ (measured as conditional entropy) is:*

$$R(D_0) = H(T) - D_0$$

*Reducing residual uncertainty by one bit requires at least one additional bit in the structured output.*

*Proof sketch.* $I(T; (D, A_d, R)) = H(T) - H(T \mid (D, A_d, R)) = H(T) - d_{\text{extract}}$. For $d_{\text{extract}} \leq D_0$, we need $I(T; (D, A_d, R)) \geq H(T) - D_0$. The rate of the structured output must be at least this mutual information. $\square$

**Proposition 4.3 (Information Bottleneck Formulation)** [S]. *Define the compression ratio $\gamma = |(D, A_d, R)| / |L|$. The optimal extraction function maximizes fidelity subject to the compression constraint:*

$$\phi^* = \arg\max_{\phi: |\phi(L)| \leq \gamma |L|} I(L; \phi(L))$$

*This is the information bottleneck problem (Tishby et al., 1999). The solution traces a curve in the $(\gamma, \mathcal{F})$ plane; governance systems must choose their operating point on this curve, balancing extraction conciseness against information preservation.*

**Proposition 4.4 (Sufficient Statistics for Governance)** [S]. *If $(D, A_d, R) = \phi(L)$ is a sufficient statistic for $T$ in the sense that $I(T; L \mid \phi(L)) = 0$, then no information about the original theory is lost through extraction. In practice, sufficiency is unachievable (by Theorem 1.2, the tacit component of $T$ is not recoverable from any finite artifact). The practical goal is approximate sufficiency: minimize the residual $I(T; L \mid \phi(L))$.*

---

## 5. Synthesis: The Governance Information Budget

**Theorem 5.1 (Governance Feasibility Condition)** [S]. *A governance architecture is feasible if and only if:*

$$C_{\text{eff}} > R_{\text{drift}} - R_{\text{self}}$$

*where $R_{\text{drift}}$ is the total drift rate, $R_{\text{self}}$ is the self-correcting drift rate (drift that agents correct autonomously via fitness functions and type checking), and $C_{\text{eff}} = \sum_i C_i \cdot \eta_i$ is the effective governance channel capacity.*

*This unifies all four formalizations:*

1. **Theory loss** (Section 1) establishes an upper bound on $C_{\text{eff}}$: no governance system can transmit more than $H(T_e)$ bits of architectural intent, because the tacit component $T_\tau$ is fundamentally uncapturable ($R_\tau(D) \to \infty$ as $D \to 0$).

2. **Drift** (Section 2) provides the measurable divergence: $R_{\text{drift}} = \lambda \bar{\delta}$, with change-point detection (CUSUM, BOCPD) providing early warning when drift rate shifts.

3. **Channel capacity** (Section 3) provides the corrective throughput bound: $C_{\text{gov}}$, the maximum rate at which governance can push code reality toward architectural intent.

4. **Extraction fidelity** (Section 4) determines how efficiently raw execution data is converted into governance-usable information, directly affecting $\eta_i$ for documentation-based governance mechanisms through the data processing inequality chain $I(T; T') \leq I(T; (D, A_d, R)) \leq I(T; L)$.

**The central thesis** follows from this synthesis: AI coding agents increase $R_{\text{drift}}$ by orders of magnitude (through speed and parallelism) while $C_{\text{eff}}$ remains approximately constant (bounded by human review throughput and the quality of automated enforcement). The governance architecture must therefore: (a) maximize $C_{\text{eff}}$ through automated, high-fidelity enforcement mechanisms, (b) minimize effective $R_{\text{drift}}$ through agent-side constraints (structured output, mandatory ADR consultation, pre-commit fitness checks), and (c) increase $R_{\text{self}}$ by embedding architectural constraints directly into the agent's execution environment (type systems, linters, fitness functions that run before commit).

---

## 6. Notation Summary

| Symbol | Meaning |
|--------|---------|
| $T$ | Program theory (mental model); decomposes as $(T_e, T_\tau)$ |
| $T_e$ | Explicit (formalizable) component of theory |
| $T_\tau$ | Tacit (resistant to formalization) component of theory |
| $T_{\text{map}}, T_{\text{just}}, T_{\text{mod}}$ | Naur's three aspects: mapping, justification, modification |
| $\hat{T}, T'$ | Reconstructed theory from artifacts |
| $d(t, \hat{t})$ | Distortion between original and reconstructed theory |
| $R(D)$ | Rate-distortion function |
| $K(t)$ | Kolmogorov complexity of theory instance $t$ |
| $P$ | Intended architecture distribution |
| $Q_t$ | Actual architecture distribution at time $t$ |
| $\Delta(t)$ | Architectural drift ($D_{\text{KL}}(P \| Q_t)$) |
| $\Delta^*$ | Irreversibility threshold |
| $\rho(t), \rho_k$ | Drift rate (continuous) or drift increment (discrete) |
| $\lambda$ | Agent modification rate |
| $\mu$ | Governance correction rate |
| $\bar{\delta}$ | Expected drift per modification |
| $\bar{c}$ | Expected drift reduction per correction |
| $C_{\text{gov}}$ | Governance channel capacity |
| $C_{\text{eff}}$ | Effective governance capacity ($\sum_i C_i \eta_i$) |
| $R_{\text{drift}}$ | Drift rate in bits per unit time |
| $R_{\text{self}}$ | Self-correcting drift rate (automated mechanisms) |
| $L$ | Executor log |
| $(D, A_d, R)$ | Structured extraction (decisions, assumptions, rejected alternatives) |
| $\phi$ | Extraction function ($L \to (D, A_d, R)$) |
| $\mathcal{F}$ | Extraction fidelity ($I(L; (D, A_d, R))$) |
| $I(X; Y)$ | Mutual information |
| $H(X)$ | Shannon entropy |
| $H(X \mid Y)$ | Conditional entropy |
| $D_{\text{KL}}$ | Kullback-Leibler divergence |
| $D_{\text{JS}}$ | Jensen-Shannon divergence |
| $S_k$ | CUSUM statistic |
| $r_t$ | BOCPD run length |
| $\gamma$ | Compression ratio ($|(D,A_d,R)| / |L|$) |

---

## References

- Adams, R.P. and MacKay, D.J.C. (2007). "Bayesian Online Changepoint Detection." arXiv:0710.3742.
- Chaitin, G.J. (1974). "Information-theoretic limitations of formal systems." JACM, 21(3), 403-424.
- Cover, T.M. and Thomas, J.A. (2006). *Elements of Information Theory*, 2nd ed. Wiley.
- Moustakides, G.V. (1986). "Optimal stopping times for detecting changes in distributions." Annals of Statistics, 14(4), 1379-1387.
- Naur, P. (1985). "Programming as Theory Building." Microprocessing and Microprogramming, 15(5), 253-261.
- Page, E.S. (1954). "Continuous Inspection Schemes." Biometrika, 41(1/2), 100-115.
- Polanyi, M. (1966). *The Tacit Dimension*. Doubleday.
- Shannon, C.E. (1948). "A Mathematical Theory of Communication." Bell System Technical Journal, 27(3), 379-423.
- Shannon, C.E. (1959). "Coding theorems for a discrete source with a fidelity criterion." IRE National Convention Record, 7(4), 142-163.
- Tishby, N., Pereira, F.C., and Bialek, W. (1999). "The Information Bottleneck Method." Proceedings of the 37th Allerton Conference.
- Vereshchagin, N. and Vitanyi, P. (2010). "Rate Distortion and Denoising of Individual Data Using Kolmogorov Complexity." IEEE Trans. Information Theory, 56(7), 3438-3454.
