# Formal Foundations for Multi-Agent Software Engineering Coordination

**Formalization Round 1: Information-Theoretic and Probabilistic Machinery**
**Date:** 2026-04-03

---

## Preamble: Scope and Epistemic Status

This document develops formal mathematical machinery for reasoning about multi-agent software engineering coordination. We distinguish three epistemic categories throughout:

- **Established theory** (marked [E]): results from reliability engineering, graph theory, or information theory applied without modification.
- **Novel synthesis** (marked [S]): known results composed or reframed in a new setting (multi-agent LLM code generation).
- **Conjectured** (marked [C]): claims motivated by empirical data but lacking formal proof.

All notation is LaTeX-ready. Variables are defined at first use and collected in a notation table in Section 6.

---

## 1. Error Amplification Model

### 1.1 Definitions

Let $\mathcal{T} = \{\text{indep}, \text{central}, \text{hier}, \text{iso-merge}\}$ denote the set of coordination topologies. Let $k$ denote the number of agents, and let $\epsilon \in (0,1)$ denote the per-agent error rate on an assigned subtask.

**Definition 1.1** (Error Amplification Factor). *For topology $t \in \mathcal{T}$ with $k$ agents, the error amplification factor is:*

$$A_e(t, k) = \frac{P(\text{system error} \mid t, k)}{P(\text{single-agent error})} = \frac{1 - R_{\text{sys}}(t, k)}{1 - R_{\text{single}}}$$

*where $R_{\text{sys}}(t, k)$ is the system reliability (probability of no error in the composed output) and $R_{\text{single}} = 1 - \epsilon$ is the single-agent reliability.*

### 1.2 Serial Composition Bound [E + S]

**Theorem 1.1** (Error Amplification under Independence). *For $k$ independent agents whose outputs are composed in series (each output feeds the next, or all outputs must be jointly correct), the system reliability is:*

$$R_{\text{sys}}(\text{indep}, k) = (1 - \epsilon)^k$$

*and the error amplification factor satisfies $A_e(\text{indep}, k) \geq k$ for all $\epsilon \in (0, 1)$ and $k \geq 1$.*

*Proof sketch.* The system error probability is $1 - (1-\epsilon)^k$. We need to show:

$$\frac{1 - (1-\epsilon)^k}{\epsilon} \geq k$$

This is equivalent to showing $1 - (1-\epsilon)^k \geq k\epsilon$, which does *not* hold in general (it fails for $k=1$, where both sides equal $\epsilon$, and for $k>1$ with small $\epsilon$, the left side is approximately $k\epsilon - \binom{k}{2}\epsilon^2 < k\epsilon$).

We must be precise. By Bernoulli's inequality, $(1-\epsilon)^k \leq 1 - k\epsilon + \binom{k}{2}\epsilon^2$ for $k \geq 2$, so $1 - (1-\epsilon)^k \geq k\epsilon - \binom{k}{2}\epsilon^2$. Thus:

$$A_e(\text{indep}, k) = \frac{1-(1-\epsilon)^k}{\epsilon} \geq k - \binom{k}{2}\epsilon$$

This gives $A_e \geq k$ only when $\binom{k}{2}\epsilon \leq 0$, which is never true for positive $\epsilon$. The correct statement is:

**Theorem 1.1 (Corrected).** *For independent agents in serial composition:*

$$A_e(\text{indep}, k) = \frac{1 - (1-\epsilon)^k}{\epsilon}$$

*This quantity is strictly increasing in $k$, satisfies $A_e(\text{indep}, 1) = 1$, and for small $\epsilon$:*

$$A_e(\text{indep}, k) \approx k - \binom{k}{2}\epsilon + O(\epsilon^2)$$

*So $A_e$ approaches $k$ from below as $\epsilon \to 0$, and the deficit is $\binom{k}{2}\epsilon$. For practical error rates ($\epsilon \approx 0.2$-$0.3$), $A_e$ is substantially less than $k$ but still grows linearly.* $\square$

**Remark.** Kim et al. (2025) measured $A_e(\text{indep}, k) = 17.2$ for their independent MAS configuration. If $k=5$ agents at $\epsilon \approx 0.3$, the formula gives $A_e = (1-0.7^5)/0.3 = (1-0.168)/0.3 = 2.77$, far below the empirical 17.2. This discrepancy implies that independence is a poor model: real agent errors are correlated and cascading, not independent. The 17.2x figure reflects error *propagation* and *compounding*, not merely the probability of at least one error.

### 1.3 Information-Sharing Reduction Factor [S]

**Definition 1.2** (Coordination Benefit Function). *For topology $t$ with information-sharing capacity $I(t)$ bits per coordination round, define the effective per-agent error rate under coordination as:*

$$\epsilon_t = \epsilon \cdot g(I(t))$$

*where $g: \mathbb{R}_+ \to (0, 1]$ is a monotonically decreasing function with $g(0) = 1$ (no sharing, no benefit) and $\lim_{I \to \infty} g(I) = g_{\min} > 0$ (coordination cannot eliminate intrinsic errors).*

A natural choice is $g(I) = e^{-\alpha I}$ for some topology-dependent rate $\alpha > 0$, giving exponential decay in error rate with information shared. Under this model:

$$R_{\text{sys}}(t, k) = (1 - \epsilon \cdot g(I(t)))^k$$

**Calibration from Kim et al.:** With $A_e(\text{central}, k) = 4.4$ and $A_e(\text{indep}, k) = 17.2$, the ratio $4.4/17.2 \approx 0.256$ gives the relative error reduction from centralized coordination. If we model this as $g(I(\text{central})) / g(0) = 0.256$, then for the exponential model, $\alpha \cdot I(\text{central}) \approx 1.36$ nats.

### 1.4 Capability Saturation as Phase Transition [S + C]

Kim et al. report a saturation threshold at single-agent accuracy $P_{\text{SA}} \approx 0.45$, above which $\partial P / \partial k < 0$ (adding agents hurts).

**Definition 1.3** (Saturation Threshold). *The capability saturation threshold $P^*$ is the single-agent accuracy at which the marginal value of an additional agent transitions from positive to negative:*

$$P^* = \inf \left\{ P_{\text{SA}} \in [0,1] : \frac{\partial}{\partial k} S_{\text{eff}}(k, P_{\text{SA}}) \Big|_{k=1} \leq 0 \right\}$$

**Conjecture 1.1** (Phase Transition). *For fixed topology $t$ and error model, the system exhibits a sharp phase transition: there exists $P^*(t) \in (0,1)$ such that for $P_{\text{SA}} < P^*$, the optimal agent count $k^* > 1$, and for $P_{\text{SA}} > P^*$, $k^* = 1$. The transition width shrinks as the coordination overhead coefficient increases.*

This is analogous to phase transitions in percolation theory: below the threshold, the "coordination benefit" phase percolates through the system; above it, the "overhead penalty" phase dominates. The empirical $P^* \approx 0.45$ from Kim et al. provides a single data point; the conjecture is that this threshold is a structural feature of the error-overhead tradeoff, not an artifact of their specific benchmarks.

---

## 2. Extended Amdahl's Law with Error

### 2.1 Classical Amdahl's Law [E]

For a task with serial fraction $s \in (0,1)$ and $n$ parallel processors:

$$S(n) = \frac{1}{s + \frac{1-s}{n}}$$

As $n \to \infty$, $S(n) \to 1/s$.

### 2.2 Reliability Factor [S]

**Definition 2.1** (Effective Speedup with Error). *The effective speedup accounts for the probability that the parallel output is correct and usable:*

$$S_{\text{eff}}(n) = S(n) \cdot R(n)$$

*where $R(n)$ is the reliability factor, i.e., the probability that no rework is needed.*

**Case 1: Independent agents.**

$$R_{\text{indep}}(n) = (1 - \epsilon)^n$$

Each of $n$ agents introduces errors independently with probability $\epsilon$. The system output requires all $n$ subtask outputs to be correct.

**Case 2: Coordinated agents.**

$$R_{\text{coord}}(n, t) = \left(1 - \frac{\epsilon}{f(t)}\right)^n$$

where $f(t) \geq 1$ is the *coordination benefit factor* for topology $t$. From Kim et al.'s data: $f(\text{central}) \approx 17.2/4.4 \approx 3.9$, $f(\text{hier}) \approx 17.2/7.8 \approx 2.2$.

### 2.3 Optimal Agent Count [S]

**Theorem 2.1** (Existence of Optimal $n^*$). *For $S_{\text{eff}}(n) = S(n) \cdot R(n)$ with $R(n) = (1-\delta)^n$ for any $\delta \in (0,1)$, there exists a unique $n^* \geq 1$ that maximizes $S_{\text{eff}}$.*

*Proof sketch.* Write:

$$S_{\text{eff}}(n) = \frac{(1-\delta)^n}{s + \frac{1-s}{n}}$$

Taking the logarithm and differentiating with respect to $n$ (treating $n$ as continuous):

$$\frac{d}{dn} \ln S_{\text{eff}} = \ln(1-\delta) + \frac{(1-s)}{n^2 \left(s + \frac{1-s}{n}\right)}$$

Setting to zero:

$$\frac{(1-s)}{n^2 s + n(1-s)} = -\ln(1-\delta) \approx \delta$$

For small $s$, this simplifies to $1/n^2 \approx \delta$, giving:

$$n^* \approx \frac{1}{\sqrt{\delta}}$$

**Corollary 2.1.** *For independent agents ($\delta = \epsilon$) with $\epsilon = 0.2$: $n^* \approx 2.2$. For centralized coordination ($\delta = \epsilon/f(\text{central})$) with $f \approx 3.9$: $n^* \approx 4.4$. Coordination roughly doubles the optimal team size.*

**Corollary 2.2.** *The maximum achievable effective speedup is:*

$$S_{\text{eff}}(n^*) \approx \frac{(1-\delta)^{1/\sqrt{\delta}}}{s + (1-s)\sqrt{\delta}}$$

*For $\delta = 0.05$ (low error), $S_{\text{eff}}^* \approx 3.1$ with $s=0.1$. For $\delta = 0.2$ (moderate error), $S_{\text{eff}}^* \approx 1.5$. Error rates dominate parallelism gains.*

### 2.4 Incorporating the USL Coherency Penalty [E + S]

Combining Gunther's Universal Scalability Law with the reliability factor:

$$S_{\text{eff}}(n) = \frac{n}{1 + \sigma(n-1) + \kappa n(n-1)} \cdot (1-\delta)^n$$

where $\sigma$ is the serialization coefficient and $\kappa$ is the coherency (crosstalk) penalty. The three terms in the denominator capture serialization, contention, and the $(1-\delta)^n$ captures reliability. This triple penalty explains why empirical optimal team sizes are small (3-5 agents, per Osmani's practitioner guidance).

---

## 3. Merge Conflict Probability: A Probabilistic Graphical Model

### 3.1 Setup

Let $k$ agents produce diffs $\Delta_1, \ldots, \Delta_k$ concurrently. Define the conflict event at level $\ell \in \mathcal{L} = \{$textual, structural, dependency, API, semantic$\}$ between agents $i$ and $j$ as $C_{ij}^\ell$.

### 3.2 The PGM [S]

**Model 3.1** (Multi-Level Conflict Graph). *The joint probability of all conflicts factors as:*

$$P(C \mid \Delta_1, \ldots, \Delta_k) = \prod_{i < j} P(C_{ij} \mid \Delta_i, \Delta_j)$$

*assuming pairwise conditional independence given the diffs. Each pairwise conflict probability decomposes across levels:*

$$P(C_{ij} \mid \Delta_i, \Delta_j) = 1 - \prod_{\ell \in \mathcal{L}} \left(1 - P(C_{ij}^\ell \mid \Delta_i, \Delta_j)\right)$$

*This assumes conditional independence across conflict levels given the diffs. The per-level probabilities depend on the overlap structure:*

- **Textual:** $P(C_{ij}^{\text{text}}) = 1 - (1 - \rho_{ij}^{\text{file}})^{m}$ where $\rho_{ij}^{\text{file}}$ is the probability of touching the same file and $m$ is the expected number of modified files per agent.
- **Structural:** $P(C_{ij}^{\text{struct}}) = P(C_{ij}^{\text{text}}) \cdot p_{\text{struct}}$ where $p_{\text{struct}}$ is the conditional probability of structural conflict given textual overlap.
- **Dependency:** $P(C_{ij}^{\text{dep}}) = \rho_{ij}^{\text{dep}} \cdot p_{\text{break}}$ where $\rho_{ij}^{\text{dep}}$ is dependency coupling and $p_{\text{break}}$ is the probability a coupled change breaks a dependency.
- **API:** $P(C_{ij}^{\text{API}}) = \rho_{ij}^{\text{API}} \cdot p_{\text{sig}}$ where $\rho_{ij}^{\text{API}}$ is the probability both agents touch endpoints of the same API, and $p_{\text{sig}}$ is the probability of signature incompatibility.
- **Semantic:** $P(C_{ij}^{\text{sem}}) = \rho_{ij}^{\text{sem}} \cdot p_{\text{behav}}$ where $\rho_{ij}^{\text{sem}}$ is semantic coupling (behavioral dependence without structural link) and $p_{\text{behav}}$ is the probability of behavioral incompatibility.

### 3.3 Quadratic Growth [E + S]

**Lemma 3.1** (Quadratic Scaling). *The expected number of pairwise conflicts grows as $O(k^2)$:*

$$\mathbb{E}\left[\sum_{i<j} \mathbf{1}[C_{ij}]\right] = \binom{k}{2} \cdot \bar{p}_{\text{conflict}}$$

*where $\bar{p}_{\text{conflict}}$ is the average pairwise conflict probability. With $k$ agents, there are $k(k-1)/2$ pairs.*

*Proof.* By linearity of expectation. Each pair $(i,j)$ has conflict probability $P(C_{ij})$. Summing over all $\binom{k}{2}$ pairs and noting that the average is $\bar{p}_{\text{conflict}}$ gives the result. $\square$

**Remark.** For $k=5$ agents and $\bar{p}_{\text{conflict}} = 0.15$ (consistent with Kasi and Sarma's 7.6%-19.3% range), the expected conflict count is $10 \times 0.15 = 1.5$. For $k=10$: $45 \times 0.15 = 6.75$. The quadratic growth is what makes naive scaling prohibitive.

### 3.4 Conflict Reduction via File Ownership Contracts [S]

**Theorem 3.1** (Ownership Reduces Conflict Order). *Under exclusive file ownership contracts (each file is assigned to at most one agent), the textual, structural, and API conflict probabilities drop to zero for all pairs, and the total conflict probability reduces from $O(k^2)$ to:*

$$P(\text{conflict}) = 1 - \prod_{i<j} \left(1 - P(C_{ij}^{\text{dep}}) - P(C_{ij}^{\text{sem}})\right)$$

*If semantic coupling $\rho_{ij}^{\text{sem}}$ is bounded by the inter-partition coupling $w_{\text{cut}}$ of the task decomposition (Section 5), and the partition minimizes cut weight, then for well-separated partitions:*

$$P(\text{conflict}) = O(k \cdot w_{\text{cut}})$$

*which is $O(k)$ when $w_{\text{cut}}$ is bounded (good partition) and approaches $O(1)$ when partitions are fully decoupled ($w_{\text{cut}} \to 0$).*

*Proof sketch.* Exclusive file ownership eliminates write-write conflicts on the same file, setting $\rho_{ij}^{\text{file}} = 0$ for all $i \neq j$. This zeroes out textual, structural, and API conflict probabilities. The remaining conflicts (dependency and semantic) occur only across partition boundaries, where coupling is bounded by the cut weight. If the coupling graph has bounded degree (each agent's files couple to at most $d$ other agents' files), the number of conflict-prone pairs is $O(k \cdot d)$ rather than $O(k^2)$, and with good partitioning $d$ is small. $\square$

**Corollary 3.1** (Contract Value). *The reduction from $O(k^2)$ to $O(k)$ pairwise conflicts is the formal justification for file ownership contracts. The 26x bug multiplier for manually-resolved conflicts (Lesenich et al., 2017) makes each prevented conflict extremely high-value.*

---

## 4. Topology Selection as Constrained Optimization

### 4.1 Objective Function [S]

**Definition 4.1** (Topology Selection Problem). *Given task parameters $(k, \rho, p_{\text{single}}, \tau)$ where $k$ is agent count, $\rho$ is average inter-task coupling density, $p_{\text{single}}$ is single-agent success probability, and $\tau$ is the time budget, select:*

$$t^* = \arg\max_{t \in \mathcal{T}} \frac{P(\text{success} \mid t)}{T(t) \cdot C(t)}$$

*where $P(\text{success} \mid t)$ is the probability of a correct final output, $T(t)$ is wall-clock time, and $C(t)$ is total compute cost (tokens consumed).*

### 4.2 Per-Topology Expressions [S]

For each topology, we express the three quantities as functions of $(k, \rho, \epsilon, \tau)$ where $\epsilon = 1 - p_{\text{single}}$.

**Independent ($t = \text{indep}$):**

$$P_{\text{indep}} = (1-\epsilon)^k \cdot (1-\rho)^{\binom{k}{2}}$$

The first term: all agents succeed. The second: no pairwise conflicts (each pair avoids conflict with probability $1-\rho$).

$$T_{\text{indep}} = \tau_{\text{single}} + \tau_{\text{merge}}(k) \quad ; \quad C_{\text{indep}} = k \cdot c_{\text{single}}$$

Wall-clock time is one parallel round plus merge. Cost is linear in $k$.

**Centralized ($t = \text{central}$):**

$$P_{\text{central}} = (1-\epsilon_{\text{coord}})^{k+1} \cdot (1-\rho/f_c)^{\binom{k}{2}}$$

The coordinator contributes one additional failure point (the $k+1$ exponent). The coordination benefit $f_c \approx 3.9$ reduces conflict probability.

$$T_{\text{central}} = \tau_{\text{plan}} + \tau_{\text{single}} + \tau_{\text{integrate}} \quad ; \quad C_{\text{central}} = (k+1) \cdot c_{\text{single}} + k \cdot c_{\text{coord}}$$

Planning and integration add latency. Coordination messages add cost.

**Hierarchical ($t = \text{hier}$):**

$$P_{\text{hier}} = (1-\epsilon)^k \cdot (1-\epsilon_{\text{mgr}})^{\lceil k/b \rceil} \cdot (1-\rho/f_h)^{k \cdot d_{\text{avg}}}$$

where $b$ is the branching factor, $\epsilon_{\text{mgr}}$ is the manager error rate, and $d_{\text{avg}}$ is the average number of cross-subtree dependencies per agent.

$$T_{\text{hier}} = d \cdot \tau_{\text{coord}} + \tau_{\text{single}} \quad ; \quad C_{\text{hier}} = k \cdot c_{\text{single}} + \lceil k/b \rceil \cdot c_{\text{mgr}}$$

Depth $d = \lceil \log_b k \rceil$ coordination rounds. Managers add cost but not as much as full centralization.

**Isolated-then-Merge ($t = \text{iso-merge}$):**

$$P_{\text{iso}} = (1-\epsilon)^k \cdot P_{\text{merge}}(k, \rho)$$

where $P_{\text{merge}}$ is the probability that the merge phase succeeds. For $k$ independent diffs with coupling $\rho$:

$$P_{\text{merge}}(k, \rho) = (1-\rho)^{\binom{k}{2}} \cdot p_{\text{resolve}}^{N_{\text{conflicts}}}$$

where $p_{\text{resolve}}$ is the automated conflict resolution success rate ($\approx 0.88$ per IntelliMerge) and $N_{\text{conflicts}}$ is the expected number of conflicts.

$$T_{\text{iso}} = \tau_{\text{single}} + \tau_{\text{merge}}(k) \quad ; \quad C_{\text{iso}} = k \cdot c_{\text{single}} + c_{\text{merge}}(k)$$

### 4.3 Dominance Conditions [S]

**Proposition 4.1** (Topology Dominance). *Under the above model:*

1. *Independent dominates when $\rho \approx 0$ and $\epsilon$ is small: tasks are decoupled and agents are reliable. The coordination overhead of other topologies is wasted.*
2. *Centralized dominates when $\rho$ is moderate-to-high and $\epsilon$ is moderate: the coordination benefit $f_c$ on conflict reduction outweighs the overhead and coordinator failure risk.*
3. *Hierarchical dominates when $k$ is large (say $k > 8$) and $\rho$ is moderate: the centralized coordinator becomes a bottleneck, while hierarchy distributes coordination load.*
4. *Isolated-then-merge dominates when $\rho$ is low, $\epsilon$ is high, and $p_{\text{resolve}}$ is high: agents benefit from isolation (no coordination overhead) and automated merge handles the few conflicts.*

*More precisely, centralized beats independent when:*

$$f_c \cdot \binom{k}{2} \cdot \rho > c_{\text{coord}} / c_{\text{single}} + \epsilon_{\text{coord}}$$

*i.e., the conflict reduction benefit (left side) exceeds the coordination cost and coordinator error penalty (right side).*

---

## 5. Task Decomposition Optimality

### 5.1 Formal Problem [E + S]

**Definition 5.1** (Coupling Graph). *Given a codebase, construct an undirected weighted graph $G = (F, E, w)$ where $F$ is the set of files, $E$ is the set of coupling relationships, and $w: E \to \mathbb{R}_+$ encodes coupling strength (composite of structural coupling, co-change coupling, and semantic coupling).*

**Definition 5.2** (Task Decomposition as Balanced Min-Cut). *A task decomposition for $k$ agents is a partition $\pi = \{T_1, \ldots, T_k\}$ of $F$ that solves:*

$$\min_\pi \sum_{(u,v) \in E : u \in T_i, v \in T_j, i \neq j} w(u,v)$$

*subject to $|T_i| \leq (1+\varepsilon) \cdot |F|/k$ for all $i$ (balance constraint).*

This is the balanced min-cut problem, which is NP-hard (Section 5 of R2). No polynomial-time algorithm achieves a finite approximation ratio for exactly balanced partitions. With relaxed balance ($\varepsilon > 0$), the best known approximation is $O(\sqrt{\log n})$ via semidefinite programming (Arora, Rao, Vazirani, 2009).

### 5.2 Cheeger Inequality and Partition Quality [E]

**Theorem 5.1** (Cheeger Inequality, Discrete). *For graph $G$ with normalized Laplacian eigenvalues $0 = \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_n$, the minimum conductance $\phi(G)$ satisfies:*

$$\frac{\lambda_2}{2} \leq \phi(G) \leq \sqrt{2\lambda_2}$$

*The spectral bisection algorithm (partition by sign of the Fiedler vector $v_2$) achieves a cut with conductance at most $\sqrt{2\lambda_2}$.*

**Corollary 5.1.** *If $\phi^*$ is the optimal conductance, the spectral partition achieves conductance at most $\sqrt{2\phi^*} \cdot \sqrt{2} = 2\sqrt{\phi^*}$ (using the left Cheeger bound to relate $\lambda_2$ to $\phi^*$). This is a quadratic approximation.*

### 5.3 Connection to Merge Conflict Probability [S]

**Lemma 5.1** (Cut-Conflict Bridge). *The pairwise conflict probability between agents $i$ and $j$ is bounded by:*

$$P(C_{ij}^{\text{dep}} + C_{ij}^{\text{sem}}) \leq \alpha \cdot \sum_{(u,v) \in E : u \in T_i, v \in T_j} w(u,v)$$

*for some constant $\alpha > 0$ that depends on the coupling-to-conflict conversion rate. Therefore, the total expected conflict count is bounded by:*

$$\mathbb{E}[N_{\text{conflicts}}] \leq \alpha \cdot W_{\text{cut}}(\pi)$$

*where $W_{\text{cut}}(\pi)$ is the total cut weight of partition $\pi$.*

*Proof sketch.* Each cross-partition edge $(u,v)$ with weight $w(u,v)$ represents coupling that may cause a conflict. The probability of a conflict arising from this edge is at most proportional to the coupling weight (by definition of the composite coupling metric, which is calibrated to predict conflicts). Summing over all cut edges gives the bound. $\square$

**Theorem 5.2** (Decomposition Quality Bounds Conflict Rate). *Let $\pi^*$ be the optimal balanced $k$-partition (minimizing cut weight) and $\hat{\pi}$ be the partition returned by a spectral or METIS-based algorithm with approximation ratio $\beta$. Then:*

$$\mathbb{E}[N_{\text{conflicts}}(\hat{\pi})] \leq \beta \cdot \mathbb{E}[N_{\text{conflicts}}(\pi^*)]$$

*For spectral bisection, $\beta = O(\sqrt{\log n})$ via Cheeger. For METIS, $\beta$ has no worst-case guarantee but empirically achieves cuts within 10-50% of optimal (i.e., $\beta \approx 1.1$-$1.5$).*

This theorem closes the loop: the quality of task decomposition directly determines the merge conflict rate, and the approximation guarantees of partitioning algorithms translate directly into conflict rate guarantees.

---

## 6. Notation Summary

| Symbol | Meaning |
|--------|---------|
| $k$ | Number of agents |
| $\epsilon$ | Per-agent error rate ($1 - p_{\text{single}}$) |
| $t \in \mathcal{T}$ | Coordination topology |
| $A_e(t,k)$ | Error amplification factor |
| $R(n)$ | Reliability factor |
| $S(n)$ | Amdahl speedup |
| $S_{\text{eff}}(n)$ | Effective speedup (Amdahl $\times$ reliability) |
| $\delta$ | Effective per-agent error rate under coordination ($\epsilon / f(t)$) |
| $f(t)$ | Coordination benefit factor for topology $t$ |
| $\rho$ | Average inter-task coupling density |
| $\sigma$ | USL serialization coefficient |
| $\kappa$ | USL coherency (crosstalk) coefficient |
| $s$ | Serial fraction (Amdahl) |
| $\phi(G)$ | Graph conductance (sparsest cut ratio) |
| $\lambda_2$ | Fiedler value (algebraic connectivity) |
| $W_{\text{cut}}(\pi)$ | Total cut weight of partition $\pi$ |
| $C_{ij}^\ell$ | Conflict event between agents $i,j$ at level $\ell$ |
| $P^*$ | Capability saturation threshold |

---

## 7. Discussion: What the Formalism Reveals

### 7.1 The Fundamental Inequality

Combining Sections 1-5, the central inequality of multi-agent coordination is:

$$S_{\text{eff}} = \underbrace{\frac{n}{1 + \sigma(n-1) + \kappa n(n-1)}}_{\text{USL throughput}} \cdot \underbrace{(1-\delta)^n}_{\text{reliability}} \cdot \underbrace{(1 - \alpha W_{\text{cut}})}_{\text{integration success}}$$

This product of three terms captures the three forces: parallelism gains (increases with $n$), error accumulation (decreases exponentially in $n$), and integration risk (decreases with cut weight, which tends to grow with $n$ since more agents means more partitions means more cut edges).

### 7.2 Implications

1. **Small teams are optimal.** The exponential reliability decay $(1-\delta)^n$ dominates the linear parallelism gain for moderate $\delta$, forcing $n^*$ to be small. This is consistent with Osmani's 3-5 agent recommendation and Cursor's planner/worker/judge pattern.

2. **Decomposition quality is a first-order concern.** The $W_{\text{cut}}$ term means a bad partition can destroy all parallelism gains through integration failures. Investing compute in better partitioning (METIS, hypergraph methods) pays off directly as fewer conflicts.

3. **Coordination reduces error rate at the cost of overhead.** The coordination benefit $f(t)$ reduces $\delta$ but adds $\sigma$ and $\kappa$. The optimal topology balances these: centralized coordination is worth it when $\rho$ is high enough that the conflict reduction pays for the overhead.

4. **The saturation threshold is real and topology-dependent.** For each topology, there is a $P^*$ above which the single agent dominates. The formalism predicts that better topologies (lower $\kappa$, higher $f(t)$) push $P^*$ higher, widening the region where multi-agent coordination helps.

### 7.3 Limitations of This Formalism

- **Independence assumptions.** The PGM in Section 3 assumes pairwise conditional independence of conflicts given the diffs. Real conflicts exhibit higher-order dependencies (a shared utility file creates correlated conflicts across many pairs).
- **Static model.** The formalism treats decomposition and execution as a one-shot process. Iterative refinement loops (generate, test, fix) change the calculus by amortizing error costs.
- **Error model simplicity.** The $(1-\delta)^n$ reliability model assumes identically distributed, independent errors. Kim et al.'s 17.2x amplification suggests correlated, cascading errors that this model underestimates.
- **Coupling metric calibration.** The constant $\alpha$ in Lemma 5.1 (coupling-to-conflict conversion) is not empirically calibrated for agent-generated code. Existing calibration data is from human developers.

---

## References

1. Kim, Y., Gu, K., Park, C., et al. (2025). "Towards a Science of Scaling Agent Systems." arXiv:2512.08296.
2. Gunther, N.J. (2008). "A General Theory of Computational Scalability Based on Rational Functions." arXiv:0808.1431.
3. Amdahl, G.M. (1967). "Validity of the single processor approach to achieving large scale computing capabilities." AFIPS '67.
4. Arora, S., Rao, S., and Vazirani, U. (2009). "Expander flows, geometric embeddings and graph partitioning." J. ACM 56(2).
5. Karypis, G. and Kumar, V. (1998). "A fast and high quality multilevel scheme for partitioning irregular graphs." SIAM J. Sci. Comput. 20(1).
6. Fiedler, M. (1973). "Algebraic connectivity of graphs." Czechoslovak Math. J. 23(98).
7. Kasi, B.K. and Sarma, A. (2013). "Cassandra: Proactive conflict minimization through optimized task scheduling." ICSE 2013.
8. Lesenich et al. (2017). Merge conflict bug correlation study (cited in Accioly et al., 2018).
9. Shen, B. et al. (2019). "IntelliMerge: a refactoring-aware software merging technique." OOPSLA 2019.
10. Sousa, M., Dillig, I., and Lahiri, S.K. (2018). "Verifying Semantic Conflict-Freedom in Three-Way Program Merges." OOPSLA 2018.
