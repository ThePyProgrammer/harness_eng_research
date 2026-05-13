# Model Routing Architecture: Research Foundations

**Research Report R1 -- Theoretical and Historical Foundations**
**Date:** 2026-04-03

---

## Overview

This document surveys the theoretical foundations underlying a formal treatment of model routing in AI coding agent harnesses. The paper formalizes how a harness selects, configures, and composes multiple AI models across pipeline stages to optimize cost-quality-latency tradeoffs. Five foundational areas are investigated: (1) the assignment problem and Hungarian algorithm, (2) cascade classifier theory, (3) the FKG inequality and correlated failures, (4) copula theory for dependence modeling, and (5) mixture-of-experts architectures. For each, we trace the original results, formal statements, complexity bounds, and their mapping to model routing.

---

## 1. Assignment Problems and the Hungarian Algorithm (Kuhn-Munkres)

### 1.1 Origins and Key Papers

The classical assignment problem was solved by **Harold W. Kuhn** in his 1955 paper:

> **Kuhn, H.W.** (1955). "The Hungarian Method for the Assignment Problem." *Naval Research Logistics Quarterly*, 2, 83--97.

Kuhn named his method "Hungarian" because the algorithm was largely based on the earlier works of two Hungarian mathematicians: **Denes Konig** (1931) on graph theory and minimum covers, and **Jeno Egervary** (1931) on matrix permanents. However, it was later discovered that Carl Gustav Jacobi had solved the assignment problem in the 19th century, with his solution published posthumously in Latin in 1890.

**James Munkres** subsequently reviewed the algorithm:

> **Munkres, J.** (1957). "Algorithms for the Assignment and Transportation Problems." *Journal of the Society for Industrial and Applied Mathematics*, 5, 32--38.

Munkres observed that the algorithm is *strongly polynomial*, meaning its runtime depends only on the dimension of the problem, not on the magnitude of the costs. The combined contributions gave rise to the name "Kuhn-Munkres algorithm."

### 1.2 Formal Problem Statement

**The Linear Sum Assignment Problem (LSAP):** Given an n x n cost matrix C = [c_{ij}], find a permutation sigma of {1, ..., n} that minimizes the total cost:

```
minimize  sum_{i=1}^{n} c_{i,sigma(i)}
```

Equivalently, find a permutation matrix P that minimizes Tr(PC), subject to the constraint that P is a doubly stochastic matrix with binary entries (by Birkhoff's theorem, the LP relaxation has integral optima).

**Optimality condition (dual formulation):** The algorithm maintains a potential function y satisfying y(i) + y(j) <= c(i,j) for all edges. An edge is called "tight" when y(i) + y(j) = c(i,j). The algorithm finds a perfect matching consisting entirely of tight edges; because the matching cost equals the potential value, complementary slackness guarantees optimality.

### 1.3 Complexity Results

| Variant | Complexity | Reference |
|---------|-----------|-----------|
| Kuhn's original (1955) | O(n^4) | Kuhn (1955) |
| Munkres' refinement (1957) | O(n^4), strongly polynomial | Munkres (1957) |
| Improved (Edmonds-Karp, Tomizawa) | **O(n^3)** | Edmonds & Karp (1972); Tomizawa (1971) |
| Sparse graphs (m edges) | O(n^2 m) | Various |

The O(n^3) bound is tight for dense cost matrices and represents the best known complexity for the LSAP.

### 1.4 Mapping to Model Routing

The classical assignment maps directly to model routing: given M available models and K pipeline stages, assign each stage to a model minimizing total cost. However, three objective types arise in practice, each with different computational character:

**Additive objectives (cost, tokens consumed):** This is the classical LSAP. If each model-stage pair has cost c_{ij}, total cost is the sum. Solvable in O(n^3) by Hungarian algorithm.

**Multiplicative objectives (quality, reliability):** If overall pipeline quality is the *product* of per-stage qualities q_{i,sigma(i)}, we have:

```
maximize  product_{i=1}^{K} q_{i,sigma(i)}
```

This is equivalent to maximizing sum of log(q_{i,sigma(i)}), so a log-transform reduces it to LSAP (assuming all q > 0). The multiplicative case is therefore also O(n^3).

**Bottleneck objectives (latency):** The bottleneck assignment problem minimizes the maximum assignment cost:

```
minimize  max_{i} c_{i,sigma(i)}
```

This is the **Linear Bottleneck Assignment Problem (LBAP)**. Unlike the additive case, the objective is minimax. The formal statement:

> Find a bijection f: A -> T such that max_{a in A} C(a, f(a)) is minimized.

The single-objective LBAP is solvable in polynomial time (roughly O(n^{2.5}) via threshold-based binary search combined with bipartite matching). However, the **multi-level bottleneck assignment problem** (MBAP), with multiple bottleneck objectives, is NP-hard (Burkard & Rendl, 1991).

**Multi-objective formulation:** In model routing, we face all three simultaneously: minimize cost (additive), maximize quality (multiplicative, reducible to additive via log), and bound latency (bottleneck). The multi-objective assignment problem is generally NP-hard, requiring Pareto-optimal tradeoff analysis. Recent work formalizes this for LLMs:

> **de Koninck et al.** (2024). "A Unified Approach to Routing and Cascading for LLMs." *ICML 2025*; arXiv:2410.10347.

Their Theorem 1 establishes that the optimal routing strategy selects the model maximizing tau_i(x, lambda) = q_hat_i(x) - lambda * c_hat_i(x), where lambda is a Lagrange multiplier controlling the cost-quality tradeoff. This reduces the multi-objective problem to a parametric single-objective selection.

### 1.5 Key Formal Results for the Paper

1. **LSAP is in P**, solvable in O(n^3). Additive cost assignment of models to stages is tractable.
2. **Multiplicative objectives reduce to additive** via logarithm; still O(n^3).
3. **Single bottleneck (latency) is in P** but multi-objective bottleneck is NP-hard.
4. **The combined cost-quality-latency problem** requires Pareto analysis or scalarization (e.g., de Koninck's lambda-parametric approach).

---

## 2. Cascade Classifier Theory (Viola-Jones and Extensions)

### 2.1 The Original Viola-Jones Cascade

The foundational work is:

> **Viola, P. & Jones, M.** (2001). "Rapid Object Detection using a Boosted Cascade of Simple Features." *CVPR 2001*.

> **Viola, P. & Jones, M.** (2004). "Robust Real-Time Face Detection." *International Journal of Computer Vision*, 57(2), 137--154.

The paper introduces three key ideas: (1) the integral image for fast Haar-like feature computation, (2) AdaBoost-based feature selection, and (3) the attentional cascade of classifiers.

### 2.2 The Cascade Paradigm

The cascade arranges classifiers in a sequence of increasing complexity. The core design principle:

> "A series of classifiers are applied to every sub-window. The initial classifier eliminates a large number of negative examples with very little processing. Subsequent layers eliminate additional negatives but require additional computation." (Viola & Jones, 2001)

Each stage acts as a binary filter:
- **"Definitely not a face"** (rejected; processing stops immediately)
- **"Might be a face"** (passed to next stage)

The first stage, called the *attentional operator*, uses only two Haar features to achieve approximately 0% false negatives and 40% false positives. This single classifier eliminates roughly half of all candidate sub-windows before any subsequent processing occurs.

### 2.3 Formal Cascade Mathematics

For a cascade with K stages, where stage i has detection rate d_i and false positive rate f_i:

**Overall detection rate:**
```
D = product_{i=1}^{K} d_i
```

**Overall false positive rate:**
```
F = product_{i=1}^{K} f_i
```

**Key consequence:** Individual stages can tolerate surprisingly poor performance. For a 32-stage cascade targeting 10^{-6} overall false positive rate, each stage needs only ~65% false positive rate (since 0.65^32 ~ 10^{-6}). Conversely, to maintain ~90% overall detection, each stage requires ~99.7% detection rate (since 0.997^32 ~ 0.91).

**Expected computation:** The expected number of features evaluated per sub-window is:

```
E[features] = sum_{i=1}^{K} n_i * product_{j=1}^{i-1} f_j
```

where n_i is the number of features in stage i. Because most sub-windows are rejected early (f_1 is small), the expected computation is dominated by the first few stages.

### 2.4 Extensions: Saberian & Vasconcelos (2014)

> **Saberian, M.J. & Vasconcelos, N.** (2014). "Boosting Algorithms for Detector Cascade Learning." *Journal of Machine Learning Research*, 15, 2569--2605.

Their key contribution is **FCBoost** (Fast Cascade Boosting), which minimizes a Lagrangian risk that jointly accounts for classification accuracy and speed:

```
L = R_classification + lambda * C_computation
```

where R is the classification risk and C is the expected computational cost of the cascade. The Lagrangian multiplier lambda trades off accuracy against speed. This is solved via gradient descent, providing a principled framework for *jointly optimizing detection performance and computational efficiency*, rather than training stages independently as in the original Viola-Jones approach.

Saberian & Vasconcelos also introduced **SBBoost** (Structurally Biased Boosting) for multi-resolution cascades, where early stages are binary target-vs-non-target detectors (cheap rejection), late stages are multiclass classifiers (fine discrimination), and middle stages have intermediate numbers of classes determined in a data-driven manner.

### 2.5 Mapping to Model Routing

The cascade paradigm maps directly to LLM routing:

| Viola-Jones Cascade | Model Routing Cascade |
|----|-----|
| Cheap Haar feature classifier | Small/fast model (e.g., Haiku, GPT-4o-mini) |
| Expensive ensemble classifier | Large/expensive model (e.g., Opus, GPT-4) |
| Sub-window = candidate face region | Task = coding subtask (edit, review, test) |
| Rejection = "not a face" | Confidence threshold = "model is confident" |
| Pass to next stage | Escalation = "route to more capable model" |

The key insight is identical: **most inputs are "easy" and can be handled cheaply; only hard cases require expensive processing.** If a cheap model produces a high-confidence output, accept it. Otherwise, escalate.

**Formal connection (de Koninck et al., 2024):** Cascade routing unifies routing (select one model per query) with cascading (sequentially try models until confidence is achieved). Their Theorem 2 extends the optimal routing result to cascading:

> "A cascading strategy is a sequence of routing strategies (s^(1), ..., s^(k)) such that s^(j) routes between supermodels M_{1:j-1}, ..., M_{1:k}."

The optimal cascade strategy exists with step-specific lambda parameters lambda_1, ..., lambda_K, and cascade routing achieves up to 14% performance improvement over static routing on SWE-Bench.

**Critical requirement:** "For routing, reliable ex-ante quality estimation is essential. For cascading, robust post-hoc quality estimation is critical." (de Koninck et al., 2024). Good quality estimators are the critical factor for the success of model selection paradigms.

---

## 3. The FKG Inequality and Correlated Detection Failures

### 3.1 Origins and Original Paper

> **Fortuin, C.M., Kasteleyn, P.W. & Ginibre, J.** (1971). "Correlation Inequalities on Some Partially Ordered Sets." *Communications in Mathematical Physics*, 22, 89--103. DOI: 10.1007/BF01651330.

The inequality arose from investigations into correlation properties of Ising ferromagnet spin systems. It generalized the earlier **Harris inequality**:

> **Harris, T.E.** (1960). "A Lower Bound for the Critical Probability in a Certain Percolation Process." *Mathematical Proceedings of the Cambridge Philosophical Society*, 56, 13--20.

Harris proved the special case for product measures on Boolean lattices; Fortuin, Kasteleyn, and Ginibre generalized to arbitrary distributive lattices with log-supermodular measures.

### 3.2 Formal Statement of the FKG Inequality

**Setting:** Let (X, <=) be a finite distributive lattice. Let mu be a nonneg measure on X satisfying the **lattice condition** (log-supermodularity):

```
mu(x wedge y) * mu(x vee y) >= mu(x) * mu(y)    for all x, y in X
```

where x wedge y is the meet (greatest lower bound) and x vee y is the join (least upper bound).

**Theorem (FKG Inequality, 1971):** For any two monotonically increasing functions f, g: X -> R:

```
[sum_{x in X} f(x)g(x)mu(x)] * [sum_{x in X} mu(x)] >= [sum_{x in X} f(x)mu(x)] * [sum_{x in X} g(x)mu(x)]
```

Equivalently, in probabilistic notation with probability measure P derived from mu:

```
E[fg] >= E[f] * E[g]
```

or for increasing events A, B (up-sets in the lattice):

> **P(A intersection B) >= P(A) * P(B)**

This is the "positive correlation" result: increasing events are positively correlated under log-supermodular measures.

### 3.3 The Harris Inequality (Special Case)

**Theorem (Harris, 1960):** If A and B are increasing events on the Boolean lattice {0,1}^n with product measure (i.e., independent Bernoulli variables), then:

```
P(A intersection B) >= P(A) * P(B)
```

An *increasing event* (up-set) A in {0,1}^n satisfies: if x in A and x <= y coordinatewise, then y in A. Intuitively, adding more "1" bits never removes you from the event.

### 3.4 Application to Correlated Model Failures

The FKG inequality provides the theoretical basis for understanding why cross-model verification is necessary, and why models from the same family provide weaker verification than independent models.

**The setup:** Consider two AI models M_1 and M_2 reviewing code for defects. Let:
- E_1 = event that M_1 misses (escapes) a defect
- E_2 = event that M_2 misses the same defect

If the models are **independent**, the probability that both miss the defect is:

```
P(E_1 intersection E_2) = P(E_1) * P(E_2)
```

But if models share training data, architecture, or pretraining methodology, the events E_1 and E_2 are **positively correlated** (they are increasing events on a shared failure lattice, as harder inputs systematically cause both models to fail). By the FKG inequality:

> **P(E_1 intersection E_2) >= P(E_1) * P(E_2)**

This means the probability that BOTH models miss a defect is **strictly higher** than independence would predict. The shared "blind spots" from common training data, RLHF procedures, and architectural inductive biases create positive correlation in failure modes.

**Empirical validation (2025):** A large-scale study provides direct empirical support:

> **"Correlated Errors in Large Language Models"** (2025). arXiv:2506.07962.

Key findings from analysis of 349+ models:
- On the Helm leaderboard, model pairs agree on errors approximately **60% of the time** (vs. 33% random baseline)
- On HuggingFace, mean pairwise error agreement reaches **42.3%** (vs. 12.7% random)
- Models from the same developer show **0.066 higher** agreement
- Models sharing base architecture show **0.076 higher** agreement
- Critically: "More accurate models have highly correlated errors, even with distinct architectures and providers"
- 100% of model pairs on HuggingFace exceeded random baseline agreement

**Implication for model routing:** If a harness uses two models from the same family (e.g., two GPT-4 variants) for verification, the FKG inequality warns that the joint escape probability is worse than the naive P(E_1)*P(E_2) estimate. Cross-family verification (e.g., Claude + GPT-4 + Gemini) provides stronger guarantees precisely because it reduces the positive correlation in failure events.

### 3.5 Quantifying the Correlation Penalty

For two models with individual escape probabilities p_1 and p_2, and a correlation coefficient rho in [0,1] measuring shared failure tendency:

```
P(both escape) = p_1 * p_2 + rho * sqrt(p_1(1-p_1) * p_2(1-p_2))
```

When rho = 0 (independent), this reduces to p_1 * p_2. When rho > 0 (positively correlated, as guaranteed by FKG for models in the same family), the joint escape probability exceeds the independent estimate. The "correlation penalty" is:

```
Delta = rho * sqrt(p_1(1-p_1) * p_2(1-p_2))
```

For models with p_1 = p_2 = 0.1 and rho = 0.3 (moderate same-family correlation):
- Independent estimate: 0.01
- Correlated estimate: 0.01 + 0.3 * 0.09 = 0.037
- **The actual miss rate is 3.7x higher than the independent assumption.**

---

## 4. Copula Theory and Sklar's Theorem

### 4.1 Origins

> **Sklar, A.** (1959). "Fonctions de repartition a n dimensions et leurs marges." *Publications de l'Institut de Statistique de l'Universite de Paris*, 8, 229--231.

The term "copula" comes from the Latin for "link" or "tie." Sklar introduced it in 1959 in response to a query from Maurice Frechet about the relationship between multivariate distribution functions and their marginals. Sklar's original paper, written in French, contained five theorems whose combination yields what is now known as Sklar's Theorem.

The standard modern reference is:

> **Nelsen, R.B.** (2006). *An Introduction to Copulas*, 2nd ed. Springer Series in Statistics. (Contains 116 examples, 54 figures, 167 exercises.)

### 4.2 Formal Statement of Sklar's Theorem

**Definition (Copula):** A d-dimensional copula is a function C: [0,1]^d -> [0,1] satisfying:
1. C(u_1, ..., u_d) = 0 if any u_i = 0 (grounding)
2. C(1, ..., 1, u_i, 1, ..., 1) = u_i for all i (marginal uniformity)
3. C is d-non-decreasing (the C-volume of every hyperrectangle in [0,1]^d is nonnegative)

**Theorem (Sklar, 1959):** Let H be an n-dimensional cumulative distribution function with one-dimensional margins F_1, ..., F_n. Then there exists an n-dimensional copula C such that for all x_1, ..., x_n in the extended reals:

```
H(x_1, ..., x_n) = C(F_1(x_1), ..., F_n(x_n))
```

**Uniqueness:** If F_1, ..., F_n are all continuous, then C is unique. Otherwise, C is uniquely determined on Ran(F_1) x ... x Ran(F_n).

**Converse:** For any copula C and any univariate CDFs F_1, ..., F_n, the function H(x_1, ..., x_n) = C(F_1(x_1), ..., F_n(x_n)) is a valid n-dimensional CDF with margins F_1, ..., F_n.

The theorem's power lies in its decomposition: any joint distribution = marginals + dependence structure (copula). The copula is "marginal-distribution-free" and captures only the dependence.

### 4.3 Frechet-Hoeffding Bounds

For any copula C and (u_1, ..., u_d) in [0,1]^d:

```
W(u_1, ..., u_d) <= C(u_1, ..., u_d) <= M(u_1, ..., u_d)
```

where:
- **Lower bound (countermonotonic):** W(u_1, ..., u_d) = max(1 - d + sum u_i, 0)
- **Upper bound (comonotonic):** M(u_1, ..., u_d) = min(u_1, ..., u_d)

The upper bound M is always a valid copula (perfect positive dependence). The lower bound W is a valid copula only in two dimensions (perfect negative dependence).

### 4.4 The Gaussian Copula

**Definition:** The Gaussian copula with correlation matrix R is:

```
C_R^{Gauss}(u_1, ..., u_d) = Phi_R(Phi^{-1}(u_1), ..., Phi^{-1}(u_d))
```

where:
- Phi^{-1} is the inverse CDF of the standard normal distribution
- Phi_R is the joint CDF of a multivariate normal distribution with mean zero and correlation matrix R

In the bivariate case with correlation parameter rho:

```
C_rho^{Gauss}(u, v) = Phi_rho(Phi^{-1}(u), Phi^{-1}(v))
```

**How rho controls dependence:**
- rho = 0: independence (C = u * v, the product copula)
- rho -> 1: perfect positive dependence (C -> M, the comonotonic copula)
- rho -> -1: perfect negative dependence (C -> W, the countermonotonic copula)

The Gaussian copula has the advantage of being parametrically simple (dependence is fully characterized by R) and computationally tractable. Its key limitation is **zero tail dependence**: it cannot model situations where extreme co-movements are more likely than the normal distribution would predict.

### 4.5 Application to Model Routing: Correlated Escape Probabilities

**The modeling framework:** Consider d models, each with a marginal escape probability distribution F_i (the probability that model i misses a defect of a given difficulty). The joint escape probability, accounting for dependence, is:

```
H(e_1, ..., e_d) = C(F_1(e_1), ..., F_d(e_d))
```

Using the Gaussian copula, the dependence between models i and j is captured by rho_{ij}, the entry of the correlation matrix R. Models from the same family (same base architecture, similar training) have rho_{ij} close to 1; models from different families have rho_{ij} closer to 0.

**Computing joint escape probability:** The probability that all d models simultaneously miss a defect at difficulty level t is:

```
P(all escape at level t) = C(F_1(t), ..., F_d(t))
```

With the Gaussian copula:

```
P(all escape) = Phi_R(Phi^{-1}(p_1), ..., Phi^{-1}(p_d))
```

where p_i = F_i(t) = P(model i escapes at difficulty t).

**Key insight for model selection:** Minimizing the joint escape probability requires minimizing the copula value. For a given set of marginal escape rates, this means minimizing the correlation entries rho_{ij} in R. The optimal verification ensemble therefore selects models with **minimal pairwise correlation**, which empirically means selecting across different model families, training regimes, and architectural paradigms.

**Copula-based reliability analysis** is well established in engineering:

> Copula-based reliability analysis frameworks model dependent component failures by separating the marginal degradation distributions from the dependence structure. The joint probability density function decomposes as: h(x_1, ..., x_d) = c(F_1(x_1), ..., F_d(x_d)) * f_1(x_1) * ... * f_d(x_d), where c is the copula density and f_i are marginal densities.

This decomposition is directly applicable to modeling the reliability of multi-model verification pipelines.

### 4.6 Connection to the FKG Inequality

The FKG inequality (Section 3) tells us *qualitatively* that escape events are positively correlated for related models: P(E_1 intersection E_2) >= P(E_1) * P(E_2).

Copula theory gives us the *quantitative* framework for modeling exactly how much the joint escape probability exceeds independence, via the correlation parameter rho. The Gaussian copula with rho > 0 is the natural parametric model for the positive dependence guaranteed by FKG.

Together:
- **FKG:** Tells us that same-family models WILL have positively correlated failures
- **Copula:** Tells us exactly HOW MUCH worse the joint failure probability is, as a function of rho
- **Model routing implication:** The routing optimizer must account for the copula structure when composing verification ensembles

---

## 5. Mixture of Experts and Model Selection

### 5.1 Origins: Jacobs et al. (1991)

The MoE concept originates from:

> **Jacobs, R.A., Jordan, M.I., Nowlan, S.J. & Hinton, G.E.** (1991). "Adaptive Mixtures of Local Experts." *Neural Computation*, 3(1), 79--87. DOI: 10.1162/neco.1991.3.1.79.

This paper introduced a supervised learning procedure for systems composed of many separate networks, each learning to handle a subset of training cases. The system consists of:
- **Expert networks** E_1, ..., E_n, each a specialist
- **A gating network** that determines which expert(s) to activate for each input

The gating network produces a probability distribution over experts, and the system output is a weighted combination of expert outputs. The key insight is competitive specialization: experts naturally divide the input space, each becoming responsible for a region.

### 5.2 Shazeer et al. (2017): Sparsely-Gated MoE

> **Shazeer, N. et al.** (2017). "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer." *ICLR 2017*; arXiv:1701.06538.

This paper scaled MoE to "up to thousands of feed-forward sub-networks" with a trainable gating network that produces a *sparse* combination. The key contribution is the noisy top-k gating mechanism.

**Formal gating function:**

The MoE layer output is:

```
y(x) = sum_{i=1}^{n} G(x)_i * E_i(x)
```

where G(x)_i is the gate value for expert i on input x, and E_i(x) is expert i's output.

**Noisy Top-K Gating:**

1. Compute noisy logits: H(x) = W_g * x + epsilon * softplus(W_noise * x), where epsilon ~ N(0, I)
2. Apply top-k selection: KeepTopK(v, k)_i = v_i if v_i is in the top k values, else -infinity
3. Compute gate values: G(x) = Softmax(KeepTopK(H(x), k))

The noise term encourages exploration of different experts and helps with load balancing. The top-k selection (typically k=2) ensures sparsity: only k experts are active per input.

**Load balancing loss:** To prevent expert collapse (all inputs routed to the same few experts), an auxiliary loss encourages uniform expert utilization:

```
L_importance = CV(Importance(X))^2
```

where Importance(X)_i = sum_x G(x)_i is the total gating weight assigned to expert i across a batch.

**Key result:** The approach achieved "greater than 1000x improvements in model capacity with only minor losses in computational efficiency on modern GPU clusters."

### 5.3 Fedus et al. (2022): Switch Transformers

> **Fedus, W., Zoph, B. & Shazeer, N.** (2022). "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity." *Journal of Machine Learning Research*, 23, 1--40; arXiv:2101.03961.

Switch Transformers simplify the MoE routing by sending each token to exactly one expert (top-1 instead of top-k):

```
Route(x) = argmax(x * W_r)
```

**Auxiliary load-balancing loss:**

```
L_aux = alpha * sum_{i=1}^{N} f_i * P_i
```

where f_i is the fraction of tokens routed to expert i, P_i is the average routing probability for expert i, and alpha is a loss coefficient.

**Key quote on simplification:** "We argue that top-1 routing with a simpler auxiliary loss is sufficient to obtain the benefits of an expert model" (Fedus et al., 2022).

**Results:** Switch Transformers achieved 7x pre-training speedups over T5-Base and successfully scaled to trillion-parameter models. They also demonstrated that large sparse models can be trained with lower precision (bfloat16) formats.

### 5.4 Intra-Model vs. Inter-Model Routing: The Key Analogy

**Intra-model routing (MoE):** Within a single neural network, a gating mechanism routes each input token to specialized expert sub-networks. The routing is at the *token level*, happens within a single forward pass, and all experts share the same training objective.

**Inter-model routing (model selection):** Across multiple distinct LLMs, a routing mechanism assigns each *task* to the most suitable model. The routing is at the *task level*, involves selecting between independently trained models, and models may have fundamentally different capabilities, costs, and failure modes.

**Formal analogy:**

| MoE (Intra-Model) | Model Routing (Inter-Model) |
|----|-----|
| Token x | Task/query x |
| Expert E_i | Model M_i |
| Gate G(x)_i | Router R(x)_i |
| Output: sum G_i * E_i(x) | Output: M_{argmax R(x)}(x) |
| k experts per token | Usually 1 model per task |
| Shared training | Independent training |
| Same cost across experts | Variable cost per model |
| Same latency | Variable latency per model |

**Key differences:**

1. **Cost heterogeneity:** In MoE, all experts have roughly equal compute cost. In inter-model routing, costs vary by orders of magnitude (Haiku vs. Opus, GPT-4o-mini vs. GPT-4).

2. **Failure correlation:** In MoE, experts within the same model share training data and likely have correlated failures (Section 3, FKG). In inter-model routing, models from different families may have lower correlation, enabling stronger verification.

3. **Training coupling:** MoE experts are jointly trained with end-to-end backpropagation through the gating network. Inter-model routing must work with fixed, pre-trained models.

4. **Routing granularity:** MoE operates per-token; model routing typically operates per-task or per-pipeline-stage.

5. **Quality estimation:** MoE routing is learned implicitly through training loss. Inter-model routing requires explicit quality estimation, which de Koninck et al. (2024) identify as the critical success factor.

### 5.5 The MoE-to-Routing Bridge

The conceptual bridge is that both problems solve the same abstract question: *given an input and a set of processing options with different specializations, which option(s) should handle this input?* The formal frameworks share:

- A router/gating function mapping inputs to processor selections
- A load-balancing concern (in MoE: expert utilization; in routing: cost distribution)
- A quality objective (in MoE: task loss; in routing: output quality)
- Sparse activation as an efficiency mechanism

Recent work explicitly connects these:

> MoE frameworks introduce conditional computation, where "not all parts of the model are activated for every input. Instead, each input token is routed to a small subset of specialized experts, enabling models to have billions or even trillions of parameters while keeping per-token compute affordable."

The same principle applies at the harness level: not all models need to be invoked for every task. A well-designed router keeps the expected cost low by activating expensive models only when needed, mirroring MoE's sparse activation.

---

## 6. Synthesis: How the Foundations Compose

The five theoretical foundations interlock in the model routing architecture:

```
                    ┌─────────────────────────────────┐
                    │  ASSIGNMENT PROBLEM (Section 1)  │
                    │  Assigns M models to K stages    │
                    │  O(n^3) for additive cost        │
                    └──────────────┬──────────────────-┘
                                   │
                    ┌──────────────▼──────────────────-┐
                    │  CASCADE THEORY (Section 2)       │
                    │  Sequential cheap-then-expensive  │
                    │  F = prod(f_i), D = prod(d_i)    │
                    └──────────────┬──────────────────-┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
   ┌──────────▼──────────┐  ┌─────▼────────────┐  ┌────▼──────────────┐
   │  FKG INEQUALITY     │  │  COPULA THEORY   │  │  MoE / ROUTING    │
   │  (Section 3)        │  │  (Section 4)     │  │  (Section 5)      │
   │  WHY verification   │  │  HOW MUCH        │  │  HOW to route     │
   │  with same-family   │  │  correlation     │  │  inputs to models │
   │  models is weak     │  │  penalty via rho │  │  (sparse gating)  │
   └─────────────────────┘  └──────────────────┘  └───────────────────┘
```

**The complete picture:**

1. **Assignment theory** provides the tractability result: static model-to-stage assignment is polynomial for additive/multiplicative objectives.

2. **Cascade theory** provides the dynamic routing structure: try cheap first, escalate only when confidence is low, achieving sub-linear expected cost.

3. **FKG inequality** provides the qualitative warning: models from the same family have positively correlated failures, so same-family verification is weaker than it appears.

4. **Copula theory** provides the quantitative framework: the Gaussian copula with parameter rho models exactly how much worse correlated verification is, enabling the router to select maximally diverse model ensembles.

5. **MoE theory** provides the routing mechanism: sparse gating with load balancing as the intra-model analog of inter-model routing, with the key differences being cost heterogeneity, failure correlation, and training coupling.

---

## References

### Assignment Problem
- Kuhn, H.W. (1955). "The Hungarian Method for the Assignment Problem." *Naval Research Logistics Quarterly*, 2, 83--97.
- Munkres, J. (1957). "Algorithms for the Assignment and Transportation Problems." *Journal of the SIAM*, 5, 32--38.
- Edmonds, J. & Karp, R.M. (1972). "Theoretical Improvements in Algorithmic Efficiency for Network Flow Problems." *Journal of the ACM*, 19, 248--264.
- Burkard, R.E. & Rendl, F. (1991). "Lexicographic Bottleneck Problems." *Operations Research Letters*, 10, 303--308.

### Cascade Classifiers
- Viola, P. & Jones, M. (2001). "Rapid Object Detection using a Boosted Cascade of Simple Features." *CVPR 2001*.
- Viola, P. & Jones, M. (2004). "Robust Real-Time Face Detection." *IJCV*, 57(2), 137--154.
- Saberian, M.J. & Vasconcelos, N. (2014). "Boosting Algorithms for Detector Cascade Learning." *JMLR*, 15, 2569--2605.

### FKG Inequality
- Harris, T.E. (1960). "A Lower Bound for the Critical Probability in a Certain Percolation Process." *Math. Proc. Cambridge Phil. Soc.*, 56, 13--20.
- Fortuin, C.M., Kasteleyn, P.W. & Ginibre, J. (1971). "Correlation Inequalities on Some Partially Ordered Sets." *Commun. Math. Phys.*, 22, 89--103.
- "Correlated Errors in Large Language Models." (2025). arXiv:2506.07962.

### Copula Theory
- Sklar, A. (1959). "Fonctions de repartition a n dimensions et leurs marges." *Publ. Inst. Statist. Univ. Paris*, 8, 229--231.
- Nelsen, R.B. (2006). *An Introduction to Copulas*, 2nd ed. Springer Series in Statistics.
- Embrechts, P., McNeil, A. & Straumann, D. (2002). "Correlation and Dependence in Risk Management: Properties and Pitfalls." In *Risk Management: Value at Risk and Beyond*, Cambridge Univ. Press.

### Mixture of Experts
- Jacobs, R.A., Jordan, M.I., Nowlan, S.J. & Hinton, G.E. (1991). "Adaptive Mixtures of Local Experts." *Neural Computation*, 3(1), 79--87.
- Shazeer, N. et al. (2017). "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer." *ICLR 2017*; arXiv:1701.06538.
- Fedus, W., Zoph, B. & Shazeer, N. (2022). "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity." *JMLR*, 23, 1--40.

### LLM Routing
- de Koninck, L. et al. (2024). "A Unified Approach to Routing and Cascading for LLMs." *ICML 2025*; arXiv:2410.10347.
- Hu, E.J. et al. (2024). "RouterBench: A Benchmark for Multi-LLM Routing System." arXiv.
