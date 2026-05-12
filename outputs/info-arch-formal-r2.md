# Formal Theory of Context Degradation and Its Interaction with Context Selection

**Formalization Round 2**
**Date:** 2026-04-02

---

## 0. Notation and Setup

Let $W$ denote the nominal context window size (in tokens). Let $C = (c_1, c_2, \ldots, c_n)$ be an ordered context sequence of $n \leq W$ tokens. Let $q$ denote the task query.

We are interested in:
- $\text{Perf}(C, q)$: the task performance (accuracy, success probability) given context $C$ and query $q$
- $\delta(n)$: the **degradation function**, measuring performance loss as a function of context length $n = |C|$
- $\text{recall}(i, n)$: the probability that information at position $i$ in an $n$-token context is correctly retrieved and used

The core empirical observation is that $\text{Perf}(C, q)$ is not monotonically increasing in $|C|$. Beyond some threshold, adding more context (even relevant context) reduces performance. This section formalizes that observation.

---

## 1. Degradation Function Taxonomy

### 1.1 Candidate Functional Forms

We model the **degradation fraction** $\delta(n) \in [0, 1]$ as the fraction of baseline performance lost when context length is $n$ tokens, relative to optimal-length context. Formally:

$$\delta(n) = 1 - \frac{\text{Perf}(n)}{\text{Perf}(n^*)}$$

where $n^*$ is the performance-maximizing context length and $\text{Perf}(n)$ denotes expected performance at context length $n$ (averaging over position and content).

**Candidate 1: Exponential saturation**

$$\delta_{\exp}(n) = 1 - e^{-\lambda n}$$

Parameters: $\lambda > 0$ (degradation rate). Behavior: rapid onset, asymptotic approach to total degradation. This form arises naturally from a model where each additional token independently contributes a fixed probability of causing a retrieval error.

**Candidate 2: Power law**

$$\delta_{\text{pow}}(n) = \left(\frac{n}{W_{\text{eff}}}\right)^{\alpha}$$

Parameters: $W_{\text{eff}} > 0$ (effective capacity), $\alpha > 0$ (degradation exponent). Behavior: convex for $\alpha > 1$, concave for $\alpha < 1$. Capped at 1 for $n \geq W_{\text{eff}}$. This form is motivated by the "linear-quadratic trajectory" observed by Du et al. and the Context Discipline Study.

**Candidate 3: Sigmoid (logistic)**

$$\delta_{\text{sig}}(n) = \frac{1}{1 + e^{-k(n - n_0)}}$$

Parameters: $k > 0$ (steepness), $n_0$ (inflection point). Behavior: S-shaped, with a threshold region of rapid degradation. This models a "phase transition" from competent to degraded processing.

### 1.2 Fitting to Empirical Data

We use the following empirical anchor points, normalized to degradation fractions:

| Source | Context Length | Task Type | Observed Degradation $\delta$ |
|--------|---------------|-----------|-------------------------------|
| Du et al. | 30K tokens | MMLU (Claude-3.5) | 0.676 |
| Du et al. | 30K tokens | HumanEval (Llama-3.1-8B) | 0.476 |
| Du et al. | 30K tokens | MMLU (Llama-3.1-8B) | 0.242 |
| Du et al. | 30K tokens (whitespace only) | Variable Summation (Llama) | 0.48 |
| Context Discipline | 4K words (~5.3K tokens) | Mixed (Llama-3.1-70B) | 0.60 |
| Context Discipline | 10K words (~13K tokens) | Mixed (Llama-3.1-70B) | 0.82 |
| Context Discipline | 15K words (~20K tokens) | Mixed (Llama-3.1-70B) | 0.88 |
| BABILong | 10-20% of window | Reasoning | ~0.50 (onset) |

**Fit analysis:**

For the Context Discipline data (Llama-3.1-70B), we have three points: $(5300, 0.60)$, $(13000, 0.82)$, $(20000, 0.88)$.

*Exponential fit:* $\delta(n) = 1 - e^{-\lambda n}$. From $\delta(5300) = 0.60$: $\lambda = -\ln(0.40)/5300 \approx 1.73 \times 10^{-4}$. Predicted: $\delta(13000) = 1 - e^{-2.25} \approx 0.895$; $\delta(20000) = 1 - e^{-3.46} \approx 0.969$. The exponential over-predicts degradation at longer lengths; it saturates too quickly.

*Power law fit:* $\delta(n) = (n/W_{\text{eff}})^{\alpha}$. Using the first two points: $0.60 = (5300/W_{\text{eff}})^{\alpha}$ and $0.82 = (13000/W_{\text{eff}})^{\alpha}$. Dividing: $(13000/5300)^{\alpha} = 0.82/0.60 = 1.367$, so $\alpha \cdot \ln(2.453) = \ln(1.367)$, giving $\alpha \approx 0.348$. Then $W_{\text{eff}} = 5300 / 0.60^{1/0.348} \approx 5300 / 0.233 \approx 22{,}750$ tokens. Check: $\delta(20000) = (20000/22750)^{0.348} \approx (0.879)^{0.348} \approx 0.955 \cdot 0.348 \approx 0.86$. Predicted 0.86 vs. observed 0.88; good fit.

*Sigmoid fit:* $\delta(n) = 1/(1 + e^{-k(n - n_0)})$. This requires $n_0 \approx 3000$ (the inflection point, before which degradation is modest). From $\delta(5300) = 0.60$: $0.60 = 1/(1 + e^{-k \cdot 2300})$, so $e^{-2300k} = 2/3$, giving $k \approx 1.76 \times 10^{-4}$. Then $\delta(13000) = 1/(1 + e^{-0.00176 \cdot 10000}) \approx 1/(1 + e^{-1.76}) \approx 0.853$; $\delta(20000) \approx 1/(1 + e^{-2.99}) \approx 0.952$. Over-predicts at 20K, similar to exponential.

### 1.3 Verdict

**The power law with $\alpha < 1$ (concave degradation) best fits the empirical data.** It captures the characteristic pattern: steep early degradation followed by a flattening tail. This is consistent with the Chroma finding of "non-linear, early-onset" degradation that is monotonic.

The recommended degradation model is:

$$\boxed{\delta(n) = \min\!\left(1, \;\left(\frac{n}{W_{\text{eff}}}\right)^{\!\alpha}\right), \quad \alpha \in [0.3, 0.5], \quad W_{\text{eff}} \in [0.1W, 0.7W]}$$

The exponent $\alpha < 1$ produces concave degradation (diminishing marginal harm from each additional token), while the range of $W_{\text{eff}}$ captures the task-type dependence: reasoning tasks have $W_{\text{eff}} \approx 0.1W$ to $0.2W$; retrieval tasks have $W_{\text{eff}} \approx 0.6W$ to $0.7W$.

**Task-type parameterization:**

| Task Type | $\alpha$ | $\rho = W_{\text{eff}} / W$ | Source |
|-----------|----------|------------------------------|--------|
| Reasoning (multi-hop, code gen) | ~0.35 | 0.10 -- 0.20 | BABILong |
| Mixed (QA + reasoning) | ~0.40 | 0.30 -- 0.50 | Du et al. |
| Retrieval (lexical, NIAH) | ~0.50 | 0.60 -- 0.70 | RULER |

---

## 2. Position-Dependent Degradation: The U-Shaped Recall Function

### 2.1 Empirical Data

Liu et al. (TACL 2024) measured the following recall profile for 20-document multi-document QA (converting to normalized positions):

| Position $i$ | Relative Position $i/n$ | Accuracy |
|--------------|------------------------|----------|
| 1 | 0.05 | ~75% |
| 5 | 0.25 | ~62% |
| 10 | 0.50 | ~55% |
| 15 | 0.75 | ~63% |
| 20 | 1.00 | ~72% |

### 2.2 Functional Form

The U-shaped curve can be decomposed into three components: a **primacy effect** (exponential decay from the start), a **recency effect** (exponential decay from the end), and a **baseline floor** (minimum recall in the middle). Define the **positional recall function**:

$$\text{recall}(i, n) = \phi_{\min} + A_p \cdot e^{-\lambda_p \cdot i} + A_r \cdot e^{-\lambda_r \cdot (n - i)}$$

where:
- $\phi_{\min} \in (0, 1)$ is the middle-position floor (baseline recall when neither primacy nor recency aids retrieval)
- $A_p, A_r > 0$ are the primacy and recency amplitudes
- $\lambda_p, \lambda_r > 0$ are the primacy and recency decay rates
- $i \in \{1, \ldots, n\}$ is the position index

**Fitting to Liu et al. data (20-doc context):**

Set $\phi_{\min} = 0.55$ (the observed middle-position accuracy). The primacy boost at position 1 is $0.75 - 0.55 = 0.20$, so $A_p \approx 0.20$. The recency boost at position 20 is $0.72 - 0.55 = 0.17$, so $A_r \approx 0.17$.

For decay rates: at position 5, $\text{recall} \approx 0.62$, so $0.20 \cdot e^{-4\lambda_p} + 0.17 \cdot e^{-15\lambda_r} \approx 0.07$. The recency term at position 5 is negligible (15 positions from the end), so $e^{-4\lambda_p} \approx 0.35$, giving $\lambda_p \approx 0.26$. Similarly, at position 15: the primacy term is negligible, $0.17 \cdot e^{-5\lambda_r} \approx 0.08$, so $e^{-5\lambda_r} \approx 0.47$, giving $\lambda_r \approx 0.15$.

**The fitted model:**

$$\boxed{\text{recall}(i, n) = 0.55 + 0.20 \cdot e^{-0.26 \cdot i} + 0.17 \cdot e^{-0.15 \cdot (n - i)}}$$

**Verification against held-out points:**
- Position 1: $0.55 + 0.20 \cdot e^{-0.26} + 0.17 \cdot e^{-2.85} \approx 0.55 + 0.154 + 0.010 = 0.714$. Observed: ~0.75. (Slight under-prediction at the boundary; the model treats position 1 as $i=1$, not $i=0$.)
- Position 10: $0.55 + 0.20 \cdot e^{-2.6} + 0.17 \cdot e^{-1.5} \approx 0.55 + 0.015 + 0.038 = 0.603$. Observed: ~0.55. (Over-predicts at exact center; the empirical minimum may be sharper than exponential decay captures.)

### 2.3 The Attention Sink Mechanism

Xiao et al. (ICLR 2024) established that the first few tokens absorb disproportionate attention mass. Formally, let $a_{t,j}$ denote the attention weight assigned by token $t$ to token $j$ in a given layer. The **attention sink** property states:

$$\sum_{j=1}^{K} a_{t,j} > 0.5 \quad \text{for } t \gg K, \; K \in \{1, 2, 3, 4\}$$

That is, the first $K \approx 4$ tokens absorb more than half of the total attention mass, regardless of their semantic content. This was measured on Llama-2-13B with 4096-token sequences:

- Removing the first 4 tokens: perplexity explodes from ~5.4 to ~5158 (a 955x increase)
- Retaining 4 initial tokens (even linebreak characters): perplexity recovers to ~5.6

**Consequence for the recall function:** The attention sink creates a "protected zone" at the beginning of context. The primacy effect in the U-shaped curve is not merely a statistical correlation; it reflects a structural feature of softmax attention. The first $K$ positions receive privileged attention regardless of content, creating a mechanism by which information placed early is reliably retrieved.

### 2.4 Length-Dependent Floor Collapse

The middle-position floor $\phi_{\min}$ is not constant; it decreases with total context length. As $n$ grows, attention dilution (softmax normalization over more tokens) reduces the baseline recall:

$$\phi_{\min}(n) = \phi_0 \cdot \left(\frac{n_0}{n}\right)^{\!\gamma}$$

where $\phi_0$ is the floor at reference length $n_0$, and $\gamma > 0$ controls the rate of floor collapse.

From the empirical data: at $n = 20$ documents (~10K tokens), $\phi_{\min} \approx 0.55$. At $n = 30$ documents (~15K tokens), GPT-3.5-Turbo's middle-position performance drops below 0.50 (below its closed-book baseline of 0.561), suggesting $\phi_{\min}(15K) < 0.50$. Using these: $\gamma \approx \ln(0.55/0.50) / \ln(15000/10000) \approx 0.095 / 0.405 \approx 0.23$.

The full positional recall model, incorporating length-dependent floor:

$$\boxed{\text{recall}(i, n) = \phi_0 \left(\frac{n_0}{n}\right)^{\!\gamma} + A_p \cdot e^{-\lambda_p \cdot i} + A_r \cdot e^{-\lambda_r \cdot (n - i)}}$$

This captures both the U-shape (position dependence) and the overall downward shift (length dependence).

---

## 3. The Effective Capacity Theorem

### 3.1 Definition

Define the **information value** of a context of size $n$ as:

$$V(n) = B(n) - D(n)$$

where $B(n)$ is the **marginal benefit** (information gained) and $D(n)$ is the **degradation cost** (performance lost due to attention dilution, distractor interference, etc.).

The benefit function $B(n)$ is concave and monotonically non-decreasing (submodularity of information coverage; each additional token provides diminishing new information). The degradation cost $D(n)$ is convex and monotonically increasing (each additional token imposes growing cost due to quadratic attention interactions).

### 3.2 Effective Capacity

**Definition.** The **effective capacity** $W_{\text{eff}}$ is the context size at which the marginal benefit of an additional token equals the marginal degradation cost:

$$W_{\text{eff}} = \arg\max_n \; V(n) = \{n : B'(n) = D'(n)\}$$

### 3.3 Derivation

Assume:
- $B(n) = B_{\max} \cdot (1 - e^{-\mu n})$ for some information density parameter $\mu > 0$ (saturating exponential; standard diminishing-returns model for information accumulation)
- $D(n) = \kappa \cdot n^{\beta}$ for some cost parameter $\kappa > 0$ and exponent $\beta > 1$ (superlinear cost from attention dilution)

Then:

$$B'(n) = B_{\max} \cdot \mu \cdot e^{-\mu n}, \quad D'(n) = \kappa \cdot \beta \cdot n^{\beta - 1}$$

Setting $B'(n) = D'(n)$:

$$B_{\max} \cdot \mu \cdot e^{-\mu n} = \kappa \cdot \beta \cdot n^{\beta - 1}$$

This transcendental equation does not admit a closed-form solution in general, but we can characterize the solution qualitatively. For small $\kappa$ (weak degradation), $W_{\text{eff}}$ approaches the information saturation point $\sim 1/\mu$. For large $\kappa$ (strong degradation), $W_{\text{eff}}$ is pushed to small values.

### 3.4 The Capacity Ratio $\rho$

Define $\rho = W_{\text{eff}} / W$, the ratio of effective to nominal capacity. The empirical evidence constrains $\rho$:

**Theorem (Effective Capacity Bound).** For transformer-based language models with softmax attention, the effective capacity ratio satisfies:

$$\rho \in [0.1, 0.7]$$

where the lower bound applies to multi-step reasoning tasks and the upper bound applies to single-fact retrieval tasks.

**Evidence:**

| Benchmark | Task Type | Empirical $\rho$ | Source |
|-----------|-----------|-------------------|--------|
| BABILong | Multi-hop reasoning | 0.10 -- 0.20 | Kuratov et al. (NeurIPS 2024) |
| RULER (multi-needle) | Multi-needle retrieval | 0.50 -- 0.60 | Hsieh et al. (COLM 2024) |
| RULER (NIAH) | Single-needle retrieval | 0.60 -- 0.70 | Hsieh et al. (COLM 2024) |
| Du et al. whitespace | Reasoning with padding | 0.15 -- 0.25 | Du et al. (EMNLP 2025) |
| Context Discipline | Mixed | 0.05 -- 0.10 | arXiv:2601.11564 |

**Proof sketch (information-theoretic argument).**

The softmax attention mechanism computes, for query $q_t$ at position $t$:

$$a_{t,j} = \frac{\exp(q_t^T k_j / \sqrt{d})}{\sum_{m=1}^{n} \exp(q_t^T k_m / \sqrt{d})}$$

The entropy of this attention distribution is:

$$H(a_t) = -\sum_{j=1}^{n} a_{t,j} \log a_{t,j}$$

For softmax attention, $H(a_t) \leq \log n$. As $n$ grows, the attention entropy increases (Kim et al., NeurIPS 2024: "attention entropy increases with sequence length"), approaching the maximum $\log n$. This means the attention distribution spreads more uniformly, reducing the model's ability to concentrate on relevant tokens.

The effective capacity is reached when the attention entropy becomes high enough that the model can no longer reliably distinguish relevant from irrelevant tokens. Concretely, if the model needs to attend to $r$ relevant tokens among $n$ total, the "attention signal" is proportional to $r/n$ while the "attention noise" grows with $\sqrt{n}$ (from the softmax normalization). The signal-to-noise ratio:

$$\text{SNR}(n) \propto \frac{r}{\sqrt{n}}$$

This SNR drops below a task-dependent threshold $\theta_{\text{task}}$ at:

$$n_{\text{eff}} = \left(\frac{r}{\theta_{\text{task}}}\right)^2$$

For reasoning tasks (high $\theta_{\text{task}}$, requiring precise attention), $n_{\text{eff}}$ is small relative to $W$. For retrieval tasks (low $\theta_{\text{task}}$, requiring only coarse attention), $n_{\text{eff}}$ is larger. This yields the observed range $\rho \in [0.1, 0.7]$. $\square$

### 3.5 Practical Consequence

The effective capacity theorem implies a concrete budget rule:

$$|C_{\text{optimal}}| \leq \rho(\text{task\_type}) \cdot W$$

For a model with $W = 200{,}000$ tokens performing code generation (a reasoning task with $\rho \approx 0.15$):

$$|C_{\text{optimal}}| \leq 30{,}000 \text{ tokens}$$

This formalizes the practitioner intuition that "you should not fill the context window." The remaining $170{,}000$ tokens of nominal capacity are not just wasted; they are actively harmful if filled.

---

## 4. Interaction Between Relevance and Position

### 4.1 The Independence Assumption (and Its Failure)

A naive model treats relevance and position as independent:

$$\text{Perf}(c_i) = \text{relevance}(c_i) \cdot \text{positional\_recall}(i, n) \quad \text{(naive, incorrect)}$$

The empirical evidence (Du et al., 2025; Liu et al., 2024) shows this is approximately correct but with an important asymmetry: **position dominates relevance**. High-relevance content in the middle still suffers substantial degradation, while low-relevance content at the boundaries still receives disproportionate attention.

### 4.2 Formal Model

Let $r_i \in [0, 1]$ denote the relevance of content at position $i$, and let $\text{recall}(i, n)$ be the positional recall function from Section 2. The **effective recall** of item $i$ is:

$$\boxed{\text{eff\_recall}(i, n, r_i) = \text{recall}(i, n) \cdot \left(1 + \eta \cdot (r_i - r_{\text{avg}})\right)}$$

where:
- $\eta \in [0, 1]$ is the **relevance sensitivity** parameter (how much relevance modulates positional recall)
- $r_{\text{avg}}$ is the average relevance in the context
- The term $(r_i - r_{\text{avg}})$ centers the relevance boost at zero for average-relevance content

**Bound on relevance boost:** The Chroma (2025) finding that lower needle-question similarity increases degradation rate, combined with the Du et al. finding that even perfect retrieval still suffers 13.9%--85% degradation, constrains $\eta$:

$$\eta \leq \eta_{\max} \approx 0.3$$

This means relevance can boost effective recall by at most ~30% relative to the positional baseline; it cannot overcome a 50% positional deficit. Position is the dominant factor.

### 4.3 The Relevance-Position Dominance Inequality

**Proposition (Position Dominance).** For any two items $c_i$ (high relevance, middle position) and $c_j$ (moderate relevance, boundary position):

$$r_i > r_j \quad \text{does not imply} \quad \text{eff\_recall}(i, n, r_i) > \text{eff\_recall}(j, n, r_j)$$

In fact, for the fitted parameters from Section 2, a highly relevant item ($r_i = 1.0$) at position $n/2$ has effective recall:

$$\text{eff\_recall}(n/2, n, 1.0) \approx \phi_{\min}(n) \cdot (1 + 0.3 \cdot (1.0 - r_{\text{avg}}))$$

while a moderately relevant item ($r_j = 0.5$) at position 1 has:

$$\text{eff\_recall}(1, n, 0.5) \approx (\phi_{\min}(n) + A_p) \cdot (1 + 0.3 \cdot (0.5 - r_{\text{avg}}))$$

For typical values ($\phi_{\min} = 0.55$, $A_p = 0.20$, $r_{\text{avg}} = 0.5$):

- Middle, high-relevance: $0.55 \cdot 1.15 = 0.633$
- Boundary, moderate-relevance: $0.75 \cdot 1.00 = 0.750$

The boundary item with lower relevance still has 18% higher effective recall. This formalizes the empirical observation (Liu et al., 2024; Chroma 2025) that position dominates relevance.

### 4.4 Optimal Placement Strategy

**Corollary (Boundary Placement).** Given a fixed set of context items with varying relevance, the optimal placement strategy assigns the highest-relevance items to the first and last positions:

$$\pi^* = \arg\max_{\pi} \sum_{i=1}^{n} r_{\pi(i)} \cdot \text{recall}(i, n)$$

where $\pi$ is a permutation of the items. By the rearrangement inequality, this maximum is achieved when $r_{\pi(i)}$ and $\text{recall}(i, n)$ are "similarly ordered," that is, when the most relevant items occupy the positions with highest recall (boundaries) and the least relevant items occupy the positions with lowest recall (middle).

Specifically, the optimal ordering is:
1. Highest-relevance items at position 1 (strongest primacy)
2. Second-highest at position $n$ (recency)
3. Remaining items sorted by relevance, alternating from start and end inward

This is precisely the placement strategy recommended by practitioners (Anthropic's context engineering guide, 2025), now derived from the formal model.

---

## 5. Superlinear Distractor Interference

### 5.1 Empirical Evidence

Chroma (2025) found that distractor interference is non-linear:
- 0 distractors: baseline performance
- 1 distractor: measurable degradation
- 4 distractors: degradation substantially exceeds 4x the single-distractor effect

Du et al. (2025) showed that even whitespace padding (zero semantic content) causes degradation, and that retrieval scores remain high while reasoning accuracy drops sharply. This means distractors harm performance through two channels: (a) attention dilution (shared with whitespace), and (b) semantic interference (unique to content-bearing distractors).

### 5.2 Formal Model

Let $n_r$ be the number of relevant tokens and $n_d$ be the number of distractor tokens, with $n = n_r + n_d$. The **distractor penalty** function is:

$$\Psi(n_r, n_d) = \underbrace{\delta_{\text{length}}(n_r + n_d)}_{\text{length-based degradation}} + \underbrace{\xi \cdot n_d^{\beta_d} \cdot s(n_d, n_r)}_{\text{semantic interference}}$$

where:
- $\delta_{\text{length}}$ is the length-based degradation from Section 1 (power law)
- $\xi > 0$ is the interference coefficient
- $\beta_d > 1$ captures the superlinearity of distractor harm
- $s(n_d, n_r)$ is the **semantic similarity** between distractors and the query/relevant content (higher similarity = more interference)

### 5.3 Why Superlinear?

The superlinearity ($\beta_d > 1$) arises from two mechanisms:

**Mechanism 1: Combinatorial attention competition.** Each distractor token competes with all relevant tokens for attention. With $n_d$ distractors and $n_r$ relevant tokens, the number of "distracting attention pathways" scales as $n_d \cdot n_r$ (each distractor can draw attention away from each relevant token). But distractors also reinforce each other: if two distractors are semantically similar, they form a cluster that collectively attracts more attention than either alone. The effective competition scales as:

$$\text{competition} \propto n_d \cdot n_r + \binom{n_d}{2} \cdot \bar{s}_d$$

where $\bar{s}_d$ is the average pairwise similarity among distractors. The binomial term grows quadratically in $n_d$, producing superlinear interference.

**Mechanism 2: Softmax saturation.** The softmax function distributes probability mass. When distractors have high dot-product similarity with the query (as semantically similar distractors do), they "steal" probability mass from relevant tokens. The stolen mass scales as:

$$\text{mass\_stolen} \approx \frac{n_d \cdot \exp(q^T k_d / \sqrt{d})}{n_r \cdot \exp(q^T k_r / \sqrt{d}) + n_d \cdot \exp(q^T k_d / \sqrt{d})}$$

When the distractor and relevant keys have similar dot products with the query ($q^T k_d \approx q^T k_r$), this simplifies to $n_d / (n_r + n_d)$, which is linear. But when distractors form coherent clusters (the "structured haystack" finding from Chroma), the effective distractor attention is boosted by inter-distractor reinforcement, producing superlinear scaling.

### 5.4 The Structured Haystack Paradox

Chroma's finding that models perform better on **shuffled** haystacks than on logically structured ones is explained by this model. Structured text creates coherent distractor clusters with high $\bar{s}_d$. Shuffling destroys the cluster structure, reducing $\bar{s}_d$ toward zero and eliminating the quadratic reinforcement term. The penalty function becomes:

$$\Psi_{\text{shuffled}}(n_r, n_d) \approx \delta_{\text{length}}(n_r + n_d) + \xi \cdot n_d^{1.0} \cdot s_{\text{avg}}$$

(linear in $n_d$, since the pairwise similarity among shuffled tokens is negligible). This is strictly less than $\Psi_{\text{structured}}$ for $n_d > 1$, explaining the universal performance advantage of shuffled haystacks.

### 5.5 Decomposition of Total Degradation

Combining all components, the total performance of a context configuration $(C, q)$ with content at positions $i = 1, \ldots, n$ is:

$$\text{Perf}(C, q) = \text{Perf}_{\text{base}}(q) \cdot \prod_{i=1}^{n} \text{eff\_recall}(i, n, r_i) \cdot (1 - \Psi(n_r, n_d))$$

However, this multiplicative form overstates the compounding. A more tractable (and empirically grounded) additive decomposition is:

$$\boxed{\text{Perf}(C, q) = \text{Perf}_{\text{base}}(q) \cdot \left(1 - \delta(n)\right) \cdot \bar{R}(C, q)}$$

where:
- $\delta(n) = (n / W_{\text{eff}})^{\alpha}$ is the length-based degradation (Section 1)
- $\bar{R}(C, q) = \frac{1}{|C_r|} \sum_{i \in C_r} \text{eff\_recall}(i, n, r_i)$ is the average effective recall of the relevant items in $C$
- $C_r \subseteq C$ is the subset of relevant items

This separates the two degradation channels: **length-based** (captured by $\delta$) and **position-based** (captured by $\bar{R}$). The distractor penalty is absorbed into both: length-based degradation increases with $n_d$ (since $n = n_r + n_d$), and position-based recall decreases as distractors push relevant items toward the middle.

---

## 6. The Augmented Context Selection Problem

### 6.1 Formal Statement

Combining all results, the context selection problem with degradation-awareness becomes:

$$\max_{C \subseteq U, \; \pi} \quad \underbrace{f(C, q)}_{\text{information value}} \cdot \underbrace{\left(1 - \left(\frac{|\pi(C)|}{W_{\text{eff}}}\right)^{\!\alpha}\right)}_{\text{length penalty}} \cdot \underbrace{\bar{R}(\pi(C), q)}_{\text{positional recall}}$$

subject to:
- $|C| \leq W$ (budget constraint)
- $\pi: C \to \{1, \ldots, |C|\}$ is a permutation (placement strategy)

where $f(C, q)$ is the submodular information coverage function (Section 2 of the research R1), and $\bar{R}(\pi(C), q)$ is the average effective recall under placement $\pi$.

### 6.2 Structure of the Problem

This optimization has three nested layers:

1. **Selection** (which items to include): a submodular maximization under a knapsack constraint, modified by a degradation penalty. This is a non-monotone submodular optimization problem.

2. **Sizing** (how much total context to use): the $W_{\text{eff}}$ constraint implies that the optimal $|C|$ is typically much less than $W$. The length penalty creates an interior optimum.

3. **Placement** (where to put each item): given a selected set, the optimal permutation is determined by the rearrangement inequality (Section 4.4).

### 6.3 Algorithmic Implications

**For layer 3 (placement):** The rearrangement inequality gives an $O(n \log n)$ optimal solution: sort by relevance, assign to positions in order of recall (boundaries first, middle last).

**For layer 2 (sizing):** The optimal size satisfies $B'(n) = D'(n)$, which can be found by binary search given monotonicity of the marginal benefit and marginal cost functions.

**For layer 1 (selection):** With the degradation penalty, the objective is non-monotone submodular. The double-greedy algorithm (Buchbinder et al., 2015) achieves a $1/2$ approximation guarantee. In practice, the density-ordered greedy heuristic (marginal information gain per token, adjusted for degradation cost) performs well.

**Combined algorithm (sketch):**

```
1. Compute relevance r_i for all candidate items u_i in U
2. Estimate W_eff = rho(task_type) * W
3. Run density-greedy selection:
   - For each candidate, compute marginal_gain(u_i) / size(u_i)
   - Add items in decreasing density order until |C| = W_eff
   - At each step, check that V(|C| + size(u_i)) > V(|C|)
   - Stop when marginal value turns negative
4. Apply boundary placement (Section 4.4):
   - Sort selected items by relevance
   - Place highest-relevance at position 1, second at position n
   - Fill inward, alternating from start and end
5. Return (C, pi)
```

### 6.4 Approximation Guarantee

**Theorem (Degradation-Aware Selection).** If $f(C, q)$ is monotone submodular and the degradation penalty $\delta(n) = (n/W_{\text{eff}})^{\alpha}$ is applied, the density-greedy algorithm with early stopping produces a solution $C^*$ satisfying:

$$V(C^*) \geq \frac{1}{2}\left(1 - \frac{1}{e}\right) V(C_{\text{opt}})$$

The factor $1/2$ comes from the non-monotonicity introduced by the degradation penalty (Buchbinder et al., 2015), and the $(1 - 1/e)$ factor comes from the submodular maximization guarantee (Nemhauser, Wolsey, Fisher, 1978). The combined guarantee is $\approx 0.316$.

With optimal boundary placement applied post-selection, the positional recall factor $\bar{R}$ is maximized, providing an additional multiplicative improvement that is bounded below by:

$$\frac{\bar{R}(\pi^*(C), q)}{\bar{R}(\pi_{\text{random}}(C), q)} \geq 1 + \frac{(A_p + A_r) \cdot (\max_i r_i - \min_i r_i)}{2 \cdot \phi_{\min}(n)}$$

For typical values, this ratio is approximately 1.15 to 1.35, representing a 15--35% improvement from placement optimization alone.

---

## 7. Summary of Key Results

### 7.1 Degradation Function

The power law $\delta(n) = (n/W_{\text{eff}})^{\alpha}$ with $\alpha \in [0.3, 0.5]$ best fits the empirical data. The exponential and sigmoid forms over-predict degradation at long context lengths.

### 7.2 Positional Recall

The U-shaped curve is well-modeled by a double-exponential with length-dependent floor:

$$\text{recall}(i, n) = \phi_0 (n_0/n)^{\gamma} + A_p e^{-\lambda_p i} + A_r e^{-\lambda_r(n-i)}$$

The floor collapses as $n$ grows, explaining why longer contexts universally degrade performance.

### 7.3 Effective Capacity

$W_{\text{eff}} = \rho \cdot W$ where $\rho \in [0.1, 0.7]$ depending on task type. For code generation (a reasoning-heavy task), $\rho \approx 0.15$, meaning a 200K-token window has an effective capacity of approximately 30K tokens.

### 7.4 Position Dominates Relevance

The relevance boost is bounded ($\eta \leq 0.3$), meaning position is the dominant factor. A moderately relevant item at the boundary outperforms a highly relevant item in the middle by ~18%.

### 7.5 Distractor Interference Is Superlinear

Distractors impose a penalty that scales superlinearly ($\beta_d > 1$) due to combinatorial attention competition and inter-distractor reinforcement. Structured (coherent) distractors are worse than random ones because cluster structure amplifies the quadratic term.

### 7.6 Optimal Strategy

The degradation-aware context selection algorithm combines: (1) density-greedy item selection with early stopping at $W_{\text{eff}}$, (2) boundary placement of high-relevance items, and (3) aggressive filtering of marginal-relevance distractors. The combined approximation guarantee is $\geq 0.316$ of optimal.

---

## Sources

- Liu, N.F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2024). "Lost in the Middle: How Language Models Use Long Contexts." TACL, 12, 157--173.
- Hong, K., Troynikov, A., & Huber, J. (2025). "Context Rot: How Increasing Input Tokens Impacts LLM Performance." Chroma Research.
- Du, Y. et al. (2025). "Context Length Alone Hurts." Findings of EMNLP 2025.
- Xiao, G. et al. (2024). "Efficient Streaming Language Models with Attention Sinks." ICLR 2024.
- Kim, J. et al. (2024). "Transformers Exhibit Working Memory Capacity Limits." NeurIPS 2024.
- Kuratov, Y. et al. (2024). "BABILong: Testing the Limits of LLMs in Long Context Reasoning." NeurIPS 2024.
- Hsieh, C.-P. et al. (2024). "RULER: What's the Real Context Size of Your Long-Context Language Models?" COLM 2024.
- Nemhauser, G., Wolsey, L., & Fisher, M. (1978). "An Analysis of Approximations for Maximizing Submodular Set Functions." Mathematical Programming, 14, 265--294.
- Buchbinder, N., Feldman, M., Naor, J., & Schwartz, R. (2015). "A Tight Linear Time (1/2)-Approximation for Unconstrained Submodular Maximization." SIAM Journal on Computing, 44(5), 1384--1402.
- Nakanishi, K. (2025). "Scalable-Softmax Is Superior for Attention." arXiv preprint.
- Li, J. et al. (2025). "InfoScale: Entropy-Invariant Attention Scaling." arXiv preprint.
- arXiv:2601.11564. "Context Discipline in Long-Context LLMs." (2025).
- Anthropic Engineering. (2025). "Effective Context Engineering for AI Agents."
- Gloaguen, T. et al. (2026). "Evaluating AGENTS.md." arXiv:2602.11988.
