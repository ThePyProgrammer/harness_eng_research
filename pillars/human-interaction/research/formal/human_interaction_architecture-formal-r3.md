# Human Interaction Architecture: Interaction Metrics, Empirical Calibration, and the Unified Human Interaction Budget

**Formal Development Round 3**
**Date:** 2026-04-03

---

## Preamble: Scope and Epistemic Status

This document develops the formal apparatus for measurable interaction quantities in human-AI coding harness interaction. It connects the theoretical models established in Formal Rounds 1 and 2 (bandit-based trust calibration, signal detection theory, Bayesian decision rules) to empirical calibration, defines a unified human interaction budget, formalizes complementarity conditions and learning-to-defer, and introduces interaction efficiency metrics. Section 7 acknowledges formally what the optimization framework cannot capture.

**Notation conventions.** Random variables are capitalized italic ($X$); their realizations are lowercase ($x$). Vectors are bold ($\mathbf{x}$). Expectations are $\mathbb{E}[\cdot]$; probabilities are $P(\cdot)$ or $\Pr(\cdot)$. The indicator function is $\mathbb{I}[\cdot]$. All logarithms are natural unless otherwise noted. Definitions, propositions, theorems, and corollaries are numbered sequentially across the entire document.

**What is novel vs. cited.** Novel contributions are flagged with **(Novel)**. Results adapted from the literature are flagged with **(Adapted from [source])**. Standard results stated without proof are flagged with **(Standard)**.

---

## 1. The Human Interaction Budget

### 1.1 Primitive Quantities

**Definition 1** (Human Review Capacity). Let $H$ denote the *effective human review capacity*, measured in *reviewable units per unit time*. A reviewable unit is one atomic code output (a file, a function, or a code hunk, depending on the harness granularity). $H$ depends on the reviewer's expertise $e$, current cognitive load, and the complexity distribution of the outputs under review. $H$ is directly measurable from review session logs as the number of outputs reviewed per hour, but varies within and across sessions.

**Definition 2** (Session Duration). Let $T$ denote the total time available for human interaction with agent outputs in a given work session, measured in hours. $T$ is directly observable.

**Definition 3** (Total Interaction Budget). The total human interaction budget for a session is:

$$B = H \cdot T$$

measured in reviewable units. This represents the maximum number of outputs a human can meaningfully inspect during the session. **(Novel)**

**Remark.** $B$ is an idealization. In practice, $H$ degrades over $T$ due to vigilance decay (Section 2.3), so the effective budget is $B_{\text{eff}} = \int_0^T H(t) \, dt < H(0) \cdot T$. The constant-$H$ formulation is used for the budget decomposition; Section 2.3 provides the time-varying refinement.

### 1.2 Budget Decomposition

The total budget must be allocated among three competing demands, each serving a distinct function in maintaining system reliability.

**Definition 4** (Review Budget). $B_{\text{review}}$ is the number of budget units allocated to *risk-based triage review*: inspecting outputs selected by the triage policy (bandit-based or otherwise) based on estimated defect risk. The purpose of $B_{\text{review}}$ is to catch defects before they enter the codebase.

**Definition 5** (Calibration Budget). $B_{\text{cal}}$ is the number of budget units allocated to *exploration reviews*: inspecting outputs from agent-task pairs that the trust model currently rates as high-reliability (i.e., outputs that the triage policy would not normally select for review). The purpose of $B_{\text{cal}}$ is to maintain the accuracy of trust estimates by sampling from the "trusted" arms, preventing the prevalence effect (Wolfe et al., 2005) from degrading calibration and detecting trust model drift.

**Definition 6** (Vigilance Budget). $B_{\text{vig}}$ is the number of budget units allocated to *vigilance probes*: reviewing outputs that are known (or suspected) to contain defects, injected into the review stream to maintain the reviewer's detection sensitivity $d'$ and criterion placement $c$. This is the direct analogue of Threat Image Projection (TIP) in aviation security screening (Schwaninger et al., 2005). The purpose of $B_{\text{vig}}$ is to counteract the vigilance decrement and the prevalence effect.

**Definition 7** (Budget Constraint). The three components exhaust the total budget:

$$B = B_{\text{review}} + B_{\text{cal}} + B_{\text{vig}}$$

Equivalently, defining the allocation fractions $\phi_r, \phi_c, \phi_v \geq 0$ with $\phi_r + \phi_c + \phi_v = 1$:

$$B_{\text{review}} = \phi_r B, \quad B_{\text{cal}} = \phi_c B, \quad B_{\text{vig}} = \phi_v B$$

**(Novel)**

### 1.3 Defect Escape Rate Under Budget Allocation

Let $N$ denote the total number of agent outputs in the session. Let $p$ be the base defect rate (fraction of outputs containing defects). Let $d_{\text{human}}(\phi_v)$ be the human reviewer's detection probability, which depends on the vigilance allocation through the mechanism described below. Let $d_{\text{auto}}$ be the combined detection probability of automated layers (Layers 1-3 in the quality architecture).

**Definition 8** (Defect Escape Rate). The expected defect escape rate is the probability that a defective output survives all defense layers:

$$\mathcal{E}(\phi_r, \phi_c, \phi_v) = p \cdot (1 - d_{\text{auto}}) \cdot \left[(1 - f_r) + f_r \cdot (1 - d_{\text{human}}(\phi_v))\right]$$

where $f_r = B_{\text{review}} / N = \phi_r B / N$ is the fraction of outputs that receive human review through the triage policy. **(Adapted from the inspection theory in R4, Section 9.4)**

The first factor $p$ is the base defect rate. The second factor $(1 - d_{\text{auto}})$ is the probability that automated layers miss the defect. The bracketed expression accounts for uninspected outputs (defects always escape) and inspected outputs where the human may miss the defect.

### 1.4 Dependence of Detection on Vigilance Allocation

The key modeling assumption connecting the three budget components: human detection probability $d_{\text{human}}$ depends on the vigilance allocation $\phi_v$ through the prevalence effect and vigilance maintenance.

**Proposition 1** (Vigilance-Detection Relationship). **(Novel)** Let $d_0$ be the reviewer's baseline detection probability under optimal conditions (fresh, calibrated, adequate signal prevalence). The effective detection probability under allocation $(\phi_r, \phi_c, \phi_v)$ is:

$$d_{\text{human}}(\phi_v) = d_0 \cdot \Phi(\phi_v)$$

where $\Phi: [0, 1] \to (0, 1]$ is a *vigilance maintenance function* satisfying:

1. $\Phi(0) = \Phi_{\min} > 0$ (even without probes, detection does not vanish)
2. $\Phi$ is strictly increasing and concave on $[0, 1]$
3. $\lim_{\phi_v \to \phi_v^{\max}} \Phi(\phi_v) = 1$ (sufficient probes restore full sensitivity)

A parametric form consistent with the empirical literature (See et al., 1995; Wolfe et al., 2005) is:

$$\Phi(\phi_v) = 1 - (1 - \Phi_{\min}) \cdot e^{-\kappa \phi_v}$$

where $\kappa > 0$ is the vigilance restoration rate, calibrated from the prevalence effect data.

*Justification.* The concavity reflects diminishing returns: the first vigilance probes have the largest effect on maintaining detection (counteracting the prevalence-driven criterion shift from $\beta > 1$ back toward $\beta = 1$), while additional probes beyond the restoration point yield little further improvement. The exponential form is standard for dose-response curves and fits the binary shape of the prevalence effect data: rapid improvement from 30% miss rate to near-baseline as probe frequency increases from 0% to approximately 5-10% of the review stream. $\square$

### 1.5 Trust Calibration Error and the Calibration Budget

The calibration budget $B_{\text{cal}}$ affects the triage policy's ability to correctly identify which outputs need review. Define the trust calibration error.

**Definition 9** (Trust Calibration Error). For $K$ agent-task-type pairs indexed by $k$, let $\tau_k$ be the estimated trust (posterior mean of the Beta distribution for arm $k$ in the Thompson Sampling model) and let $p_k$ be the true reliability (probability that arm $k$'s output is defect-free). The Trust Calibration Error is:

$$\text{TCE} = \frac{1}{K} \sum_{k=1}^{K} |\tau_k - p_k|$$

TCE is not directly observable (since $p_k$ is unknown), but can be estimated from held-out data or double-review studies. **(Novel)**

**Proposition 2** (Calibration Budget and Triage Efficiency). **(Novel)** Let $\text{TCE}(\phi_c)$ denote the trust calibration error as a function of the calibration allocation. When $\phi_c = 0$ (no exploration reviews), the trust model is updated only from triage-selected reviews (biased sample). When $\phi_c > 0$, the trust model also receives unbiased samples from "trusted" arms, reducing calibration error.

Under the Beta-Bernoulli trust model with Thompson Sampling, the posterior variance for arm $k$ after $n_k$ observations is:

$$\text{Var}(\theta_k | \text{data}) = \frac{(\alpha_k + S_k)(\beta_k + F_k)}{(\alpha_k + S_k + \beta_k + F_k)^2 (\alpha_k + S_k + \beta_k + F_k + 1)}$$

Exploration reviews from the calibration budget contribute observations to high-trust arms that would otherwise receive zero updates, preventing posterior over-concentration and maintaining the triage policy's discriminative ability.

The effective triage efficiency (fraction of triage-selected outputs that actually contain defects) increases as TCE decreases:

$$\text{Efficiency}_{\text{triage}} \approx 1 - \text{TCE} / p$$

for small $\text{TCE}$ relative to $p$. $\square$

### 1.6 The Budget Optimization Problem

Combining the components, the defect escape rate as a function of the allocation is:

$$\mathcal{E}(\phi_r, \phi_c, \phi_v) = p \cdot (1 - d_{\text{auto}}) \cdot \left[(1 - \phi_r \cdot B/N) + \phi_r \cdot B/N \cdot (1 - d_0 \cdot \Phi(\phi_v)) \cdot (1 + g(\phi_c))\right]$$

where $g(\phi_c) \geq 0$ is a non-negative penalty term reflecting triage inefficiency due to miscalibration: when $\phi_c$ is small, the triage policy wastes some of $B_{\text{review}}$ on non-defective outputs, effectively reducing the defect-targeted review fraction.

For analytical tractability, we parametrize $g(\phi_c) = g_0 \cdot e^{-\lambda \phi_c}$ where $g_0$ is the cold-start miscalibration penalty and $\lambda > 0$ governs how quickly calibration reviews reduce the penalty.

**Theorem 1** (Existence and Uniqueness of Optimal Budget Allocation). **(Novel)** Consider the optimization problem:

$$\min_{\phi_r, \phi_c, \phi_v \geq 0} \; \mathcal{E}(\phi_r, \phi_c, \phi_v) \quad \text{subject to} \quad \phi_r + \phi_c + \phi_v = 1$$

Under the following conditions:

(a) $\Phi(\phi_v)$ is strictly increasing and strictly concave on $[0,1]$

(b) $g(\phi_c)$ is strictly decreasing and strictly convex on $[0,1]$

(c) $B/N < 1$ (the human cannot review everything; the capacity-constrained regime)

(d) $d_0 > 0$, $p > 0$, $d_{\text{auto}} < 1$

there exists a unique optimal allocation $(\phi_r^*, \phi_c^*, \phi_v^*)$ in the interior of the simplex $\{(\phi_r, \phi_c, \phi_v) : \phi_r + \phi_c + \phi_v = 1, \phi_i > 0\}$.

*Proof sketch.* The feasible set is the 2-simplex, which is compact and convex. $\mathcal{E}$ is continuous on the simplex, so a minimum exists by the extreme value theorem.

For uniqueness and interiority, we use the method of Lagrange multipliers. Substituting $\phi_r = 1 - \phi_c - \phi_v$ into $\mathcal{E}$ and differentiating:

The partial derivative with respect to $\phi_v$ contains two opposing terms: (i) a negative term from improved detection ($d_0 \cdot \Phi'(\phi_v) > 0$ reduces the miss rate on reviewed outputs), and (ii) a positive term from reduced review coverage ($\partial \phi_r / \partial \phi_v = -1$ reduces $f_r$). At $\phi_v = 0$, term (i) dominates because $\Phi'(0) = \kappa(1 - \Phi_{\min})$ is large (steep initial improvement). At $\phi_v$ near 1, term (ii) dominates because $\Phi'(\phi_v)$ is small (diminishing returns) but the review budget is nearly zero. By the intermediate value theorem, there exists an interior $\phi_v^*$ where the marginal benefit of detection improvement equals the marginal cost of lost review coverage.

Similarly, the partial derivative with respect to $\phi_c$ balances improved triage efficiency ($-g'(\phi_c) > 0$) against reduced review coverage. The strict convexity of $g$ and strict concavity of $\Phi$ ensure the first-order conditions have a unique solution.

The bordered Hessian of the Lagrangian is negative definite on the constraint surface (verified by checking that the relevant principal minors alternate in sign, which follows from the strict concavity of $\Phi$ and strict convexity of $g$), confirming that the critical point is a strict minimum. $\square$

**Corollary 1** (The Vigilance-Review Tradeoff). **(Novel)** At the optimum, the marginal defect escape reduction from one additional unit of vigilance budget equals the marginal defect escape increase from one fewer unit of review budget:

$$\underbrace{d_0 \cdot \Phi'(\phi_v^*) \cdot \phi_r^* \cdot B/N}_{\text{marginal benefit of vigilance}} = \underbrace{(1 - d_0 \cdot \Phi(\phi_v^*) \cdot (1 + g(\phi_c^*))) \cdot B/N}_{\text{marginal cost of lost review}}$$

This formalizes the core tradeoff: increasing $B_{\text{vig}}$ improves $d_{\text{human}}$ (making each review more effective) but decreases $B_{\text{review}}$ (leaving more outputs uninspected). The optimum balances review quality against review quantity.

### 1.7 Comparative Statics

**Proposition 3** (Sensitivity to Agent Quality). **(Novel)** As the base defect rate $p$ increases (agent quality degrades):

1. $\phi_r^*$ increases (more budget to review)
2. $\phi_v^*$ decreases (less budget to vigilance probes, because the natural defect prevalence already counteracts the prevalence effect)
3. $\phi_c^*$ decreases (less budget to calibration, because there is ample signal from triage reviews)

Conversely, as $p \to 0$ (highly reliable agent), $\phi_v^*$ and $\phi_c^*$ increase as the dominant failure modes shift from defect volume to detection degradation and trust miscalibration.

*Proof sketch.* By implicit differentiation of the first-order conditions. As $p$ increases, the prevalence of true defects in the review stream increases naturally, reducing the marginal value of artificial probes ($\partial \Phi / \partial \phi_v$ contributes less to $\mathcal{E}$ relative to the direct review coverage term). The first-order condition for $\phi_v$ shifts the optimal point leftward. The argument for $\phi_c$ is analogous: high $p$ provides abundant signal for trust model updating through triage reviews alone. $\square$

---

## 2. Empirical Calibration Framework

This section specifies how each model parameter can be estimated from observable data, with concrete ranges from the empirical literature.

### 2.1 Human Detection Probability: $d_{\text{human}}$

**Estimation Method.** The gold-standard method is the *double-review study* (adapted from European mammography screening protocols; Gilbert et al., 2008). Two independent reviewers examine the same set of code outputs. Defects identified by either reviewer are verified (e.g., by a senior developer or by constructing a test that exposes the defect). Then:

$$\hat{d}_{\text{human}} = \frac{\text{defects found by a single reviewer}}{\text{total verified defects}}$$

This is directly measurable given appropriate study design. The denominator is approximated by the union of findings from both reviewers plus any additional defects found later in production.

**Empirical ranges (from published studies):**

| Condition | $d_{\text{human}}$ | Source | Confidence |
|-----------|-------------------|--------|------------|
| Formal Fagan inspection, 150 LOC/hr | 0.60-0.82 | Fagan (1976); Jones (1996) | **H** (multiple replications, 12,000+ projects) |
| Cisco study, optimal conditions (<200 LOC, <60 min) | 0.70-0.90 | Cohen (2006), 2,500 reviews, 3.2M LOC | **H** |
| Informal inspection | <0.50 | Jones (1996) | **H** |
| Under time pressure / high review rate (>500 LOC/hr) | 0.25-0.40 | Cohen (2006); Jureczko et al. (2020) | **M** |
| AI-generated code review (no specific study) | 0.30-0.60 | Extrapolated; see note | **L** |

**Note on AI-generated code review.** No published study has directly measured $d_{\text{human}}$ for AI-generated code. The lower estimate reflects: (1) AI-generated defects may differ in kind from human-authored defects (more subtle, less pattern-recognizable); (2) the prevalence effect (most AI output is correct, driving criterion shift); (3) the Sonar 2026 finding that only 48% of developers verify AI code before committing, suggesting operational $d_{\text{human}}$ may be substantially below the formal inspection ceiling.

**Measurability status:** Directly measurable via double-review study design, but requires deliberate experimental setup. Operational $d_{\text{human}}$ (in everyday use) is harder to measure and likely lower than controlled-study values.

### 2.2 Automated Detection Probability: $d_{\text{auto}}$

**Estimation Method.** Inject known-defective outputs (a curated corpus of agent-generated code with verified defects) through the automated pipeline (Layers 1-3). The detection rate is:

$$\hat{d}_{\text{auto}} = \frac{\text{defects flagged by any automated layer}}{\text{total injected defects}}$$

This is directly measurable. The corpus should be stratified by defect type, since detectability varies enormously across types (see Quality Architecture Formal R3, Section 1).

**Empirical ranges (from the detection matrix):**

| Defect Type | $d_{\text{auto}}$ | Layers | Source | Confidence |
|-------------|-------------------|--------|--------|------------|
| Hallucinated imports | 0.92-0.99 | L1+L2 | Lockfile validation, AgentSpec 87% | **H** |
| Placeholder/stub code | 0.88-0.97 | L1+L2 | AST pattern matching | **H** |
| Security vulnerabilities | 0.15-0.35 | L1+L2+L3 | SAST 13% recall; LLM judge 50-70% | **M** |
| Architectural erosion | 0.10-0.30 | L2+L3 | Reflexion models partial; LLM context unreliable | **L** |
| Aggregate (all types, weighted) | 0.40-0.65 | L1+L2+L3 | Weighted by empirical type distribution | **M** |

**Measurability status:** Directly measurable via known-defect injection. The challenge is constructing a representative defect corpus; the estimates above may be biased toward easy-to-construct defect types.

### 2.3 Vigilance Decay Function: $\Phi(t)$

**Estimation Method.** Measure detection rates over time during continuous review sessions. Partition a review session into intervals (e.g., 10-minute blocks). Compute $d_{\text{human}}(t)$ for each interval, using either double-review or known-defect injection within each block. The ratio $\Phi(t) = d_{\text{human}}(t) / d_{\text{human}}(0)$ gives the vigilance function over time.

**Empirical ranges:**

| Time into session | $\Phi(t)$ relative to baseline | Source | Confidence |
|-------------------|-------------------------------|--------|------------|
| $t = 0$ | 1.00 (by definition) | -- | -- |
| $t = 15$ min (high-demand) | 0.90-0.95 | Warm et al. (2008); Skinner & Giesbrecht (2024) | **M** |
| $t = 30$ min | 0.85-0.90 | Mackworth (1948), 10-15% decline | **H** |
| $t = 60$ min | 0.70-0.85 | Cohen (2006); Mackworth (1948) | **H** |
| $t = 90$ min | 0.60-0.75 | Mackworth (1948), continued decline | **M** |
| $t = 120$ min | 0.50-0.70 | Mackworth (1948), up to 35% total drop | **M** |

**Parametric calibration.** Fitting the exponential decay model $\Phi(t) = \Phi_{\min} + (1 - \Phi_{\min}) e^{-\delta t}$ to Mackworth's data:

With $\Phi(30) \approx 0.875$ (midpoint of 0.85-0.90) and $\Phi(120) \approx 0.60$:

$$0.875 = \Phi_{\min} + (1 - \Phi_{\min}) e^{-30\delta}$$
$$0.60 = \Phi_{\min} + (1 - \Phi_{\min}) e^{-120\delta}$$

Solving numerically: $\delta \approx 0.0085$ min$^{-1}$, $\Phi_{\min} \approx 0.52$. This implies a half-life of $\ln(2)/\delta \approx 82$ minutes for the decaying component, meaning detection degrades to the midpoint between baseline and floor in roughly 80 minutes of continuous review.

**Distinction from $\Phi(\phi_v)$.** Note that Section 1.4 defines $\Phi$ as a function of the vigilance budget allocation (how probes improve detection), while this section defines $\Phi$ as a function of time (how detection decays). The two are related: vigilance probes partially counteract the time-based decay by maintaining signal prevalence and providing calibration feedback. A unified model is:

$$d_{\text{human}}(t, \phi_v) = d_0 \cdot \left[\Phi_{\min} + (1 - \Phi_{\min}) \cdot e^{-\delta t} \cdot (1 - (1 - r_{\text{probe}}) \cdot e^{-\kappa \phi_v})\right]$$

where $r_{\text{probe}} \in (0, 1)$ is the fraction of time-based decay that probes can prevent. This is a two-dimensional generalization; the budget optimization in Section 1 uses the time-averaged version.

**Measurability status:** $\Phi(t)$ is directly measurable from time-series data during review sessions, but requires either double-review or known-defect injection to establish the detection rate at each time point. Without these, only proxy measures (review time per output, comment density) are available, and these may not correlate perfectly with actual detection probability.

### 2.4 Trust Model Parameters: Beta Distribution Shape

**Estimation Method.** For each agent-task-type pair $k$, the Beta posterior parameters $(\alpha_k, \beta_k)$ are updated from binary outcomes (defect-free / defective). The prior hyperparameters can be set empirically:

**Prior elicitation from historical data.** Given a historical dataset of $n_k^{\text{hist}}$ observations for pair $k$ with $s_k^{\text{hist}}$ successes:

$$\alpha_k^{(0)} = s_k^{\text{hist}} + 1, \quad \beta_k^{(0)} = n_k^{\text{hist}} - s_k^{\text{hist}} + 1$$

(adding 1 for the Laplace correction). For cold-start with no historical data, use the population prior:

$$\alpha_k^{(0)} = \alpha_{\text{pop}}, \quad \beta_k^{(0)} = \beta_{\text{pop}}$$

where $\alpha_{\text{pop}} / (\alpha_{\text{pop}} + \beta_{\text{pop}})$ equals the population-level defect-free rate across all agent-task pairs.

**Empirical ranges for agent reliability:**

| Agent-Task Context | Defect-Free Rate $p_k$ | Implied Prior | Source | Confidence |
|-------------------|----------------------|---------------|--------|------------|
| Strong model, simple task (test files, docs) | 0.95-0.99 | Beta(19, 1) to Beta(99, 1) | METR (2026): ~50% merge rate implies ~50% defect-free for complex tasks; extrapolated upward for simple tasks | **L** |
| Strong model, moderate task (feature code) | 0.85-0.95 | Beta(17, 3) to Beta(19, 1) | Interpolated from METR + DORA data | **L** |
| Strong model, complex task (architecture, refactoring) | 0.50-0.85 | Beta(10, 10) to Beta(17, 3) | METR: ~50% merge rate on SWE-bench tasks | **M** |
| Any model, security-critical code | 0.70-0.85 | Beta(14, 6) to Beta(17, 3) | CodeRabbit: 2.74x more security vulnerabilities in AI code | **M** |

**Measurability status:** Directly computable from logged outcomes. The challenge is defining what counts as a "defect": binary classification of code quality is an approximation. In practice, defects range from critical security vulnerabilities to minor style issues, and the trust model should ideally maintain separate posteriors for different severity levels.

### 2.5 DORA/Sonar Calibration Points

Several aggregate statistics from industry surveys provide calibration anchors:

**Definition 10** (Review Capacity Gap). The ratio of review demand to review capacity:

$$\text{RCG} = \frac{N_{\text{outputs}}}{B} = \frac{\text{agent outputs per session}}{\text{human review capacity per session}}$$

**Empirical values:**

| Metric | Value | Implication for RCG | Source |
|--------|-------|-------------------|--------|
| PR size growth | +154% | Review demand $\sim 2.5 \times$ baseline | DORA 2025 |
| Code review time growth | +91% | Review supply $\sim 1.9 \times$ baseline (but this includes longer per-review time, not more reviews) | DORA 2025 + Faros AI |
| Verification rate | 48% always verify | Effective $f_r \approx 0.48$ at best | Sonar 2026 |
| AI code share of committed code | 42% | $N_{\text{AI}} \approx 0.42 N_{\text{total}}$ | Sonar 2026 |
| Expected AI code share by 2027 | 65% | $N_{\text{AI}} \approx 0.65 N_{\text{total}}$ (projected) | Sonar 2026 |

These numbers imply that $\text{RCG} > 1$ in many current development environments, meaning human review capacity is already insufficient to review all agent output. The budget optimization problem (Theorem 1) is therefore in the capacity-constrained regime (condition (c)), confirming the practical relevance of the allocation framework.

---

## 3. Complementarity Conditions

### 3.1 Setup

**Definition 11** (Complementarity Index). Consider a binary classification task: each code output is either defective ($y = 1$) or correct ($y = 0$). The human reviewer, the AI system (automated layers), and the team (human + AI) each produce a binary classification. Define:

$$C = P(\text{team correct}) - \max\left(P(\text{human correct}), P(\text{AI correct})\right)$$

$C > 0$ indicates complementarity: the team outperforms the better individual component. $C \leq 0$ indicates the team provides no benefit over the stronger component alone. **(Adapted from Bansal et al., 2021)**

### 3.2 Decomposition via Error Correlation

**Proposition 4** (Complementarity via Error Independence). **(Novel, building on standard SDT results)** Let $E_H$ be the event that the human reviewer misses a defect, and $E_A$ the event that the automated system misses the same defect. Define:

- $d_H = P(\text{human detects} | \text{defect present}) = 1 - P(E_H)$
- $d_A = P(\text{AI detects} | \text{defect present}) = 1 - P(E_A)$
- $\rho_{HA} = \text{Corr}(E_H, E_A)$, the correlation between human and AI misses

Under a simple "OR" combination (defect is caught if either the human or the AI detects it):

$$P(\text{team detects} | \text{defect}) = 1 - P(E_H \cap E_A) = 1 - \left[P(E_H) P(E_A) + \rho_{HA} \sqrt{P(E_H)(1 - P(E_H)) P(E_A)(1 - P(E_A))}\right]$$

The complementarity index (for the detection task, conditional on a defect being present) is:

$$C_{\text{detect}} = P(\text{team detects}) - \max(d_H, d_A)$$

*Proof.* By the definition of Pearson correlation for binary variables:

$$P(E_H \cap E_A) = P(E_H) P(E_A) + \rho_{HA} \sqrt{P(E_H)(1 - P(E_H)) P(E_A)(1 - P(E_A))}$$

The team detection probability under the OR rule is $1 - P(E_H \cap E_A)$. Without loss of generality, assume $d_A \geq d_H$ (the AI is the stronger detector). Then:

$$C_{\text{detect}} = [1 - P(E_H \cap E_A)] - d_A = P(E_A) - P(E_H \cap E_A) = P(E_A)(1 - P(E_H)) - \rho_{HA}\sqrt{\cdots}$$

For $C_{\text{detect}} > 0$, we need:

$$P(E_A)(1 - P(E_H)) > \rho_{HA} \sqrt{P(E_H)(1 - P(E_H)) P(E_A)(1 - P(E_A))}$$

Dividing both sides by $\sqrt{P(E_A)(1 - P(E_H))}$ (both positive since neither detector is perfect or useless):

$$\sqrt{P(E_A)(1 - P(E_H))} > \rho_{HA} \sqrt{P(E_H)(1 - P(E_A))}$$

Squaring:

$$P(E_A)(1 - P(E_H)) > \rho_{HA}^2 \cdot P(E_H)(1 - P(E_A))$$

This holds when $\rho_{HA}$ is sufficiently small (errors are sufficiently uncorrelated). $\square$

**Theorem 2** (Conditions for Positive Complementarity). **(Novel)** The human-AI team has positive complementarity ($C_{\text{detect}} > 0$) if and only if:

$$\rho_{HA} < \sqrt{\frac{P(E_A)(1 - P(E_H))}{P(E_H)(1 - P(E_A))}} = \sqrt{\frac{(1 - d_A) \cdot d_H}{(1 - d_H) \cdot d_A}}$$

In particular:

(a) If $\rho_{HA} = 0$ (independent errors), complementarity is always positive whenever both detectors are imperfect ($0 < d_H, d_A < 1$).

(b) If $\rho_{HA} = 1$ (perfectly correlated errors), complementarity is zero: the team is no better than the stronger component.

(c) The maximum possible complementarity is achieved at $\rho_{HA} = 0$ and equals $\min(d_H, d_A) \cdot \max(d_H, d_A) / [d_H + d_A - d_H d_A]$ (this is the standard formula for the improvement from independent double inspection).

*Proof.* Direct from Proposition 4. The bound on $\rho_{HA}$ follows from the inequality derived above. Conditions (a) and (b) are the boundary cases. Condition (c): under independence, $P(\text{team detects}) = 1 - (1 - d_H)(1 - d_A) = d_H + d_A - d_H d_A$, so $C = d_H + d_A - d_H d_A - \max(d_H, d_A) = \min(d_H, d_A)(1 - \max(d_H, d_A))$. $\square$

### 3.3 Calibration and Complementarity

Theorem 2 gives necessary and sufficient conditions for detection complementarity. But Bansal et al. (2021) showed empirically that calibrated confidence is also necessary for the team to outperform individual components in the *decision* task (not just detection). The issue is that the human must decide when to override the AI, and this requires knowing the AI's reliability per-instance.

**Proposition 5** (Calibration Requirement for Decision Complementarity). **(Adapted from Bansal et al., 2021 and Vodrahalli et al., 2022)** Let $s(x)$ be the AI's reported confidence score for output $x$, and let $p(x) = P(\text{output } x \text{ is correct})$ be the true correctness probability. Define the calibration gap:

$$\Delta_{\text{cal}}(x) = s(x) - p(x)$$

If the human uses a threshold strategy (override when $s(x) < t$ for some threshold $t$), then the team's performance is maximized when $\Delta_{\text{cal}}(x) = 0$ for all $x$ (perfect calibration).

When $\Delta_{\text{cal}}(x) > 0$ systematically (overconfident AI), the human under-overrides, accepting incorrect outputs. When $\Delta_{\text{cal}}(x) < 0$ systematically (underconfident AI), the human over-overrides, wasting budget on unnecessary reviews.

*Remark.* Vodrahalli et al. (2022) showed that human decision-makers do not behave as rational Bayesian threshold agents: overconfident AI can sometimes improve team performance because it triggers "activation" of the human's attention. This complicates the formal picture; the proposition above holds for an idealized threshold decision-maker but may not hold for behaviorally realistic human reviewers. This gap between the formal model and actual human behavior is addressed in Section 7.

### 3.4 Numerical Illustration

Using the empirical calibration ranges from Section 2:

| Configuration | $d_H$ | $d_A$ | $\rho_{HA}$ | $C_{\text{detect}}$ | Assessment |
|--------------|--------|--------|-------------|---------------------|------------|
| Expert reviewer + strong automated pipeline | 0.80 | 0.55 | 0.20 | 0.28 | Strong complementarity |
| Casual reviewer + strong pipeline | 0.40 | 0.55 | 0.15 | 0.22 | Moderate complementarity |
| Expert reviewer + weak pipeline | 0.80 | 0.20 | 0.10 | 0.16 | Moderate complementarity |
| Expert reviewer + strong pipeline, correlated errors | 0.80 | 0.55 | 0.80 | 0.03 | Weak complementarity |
| Any reviewer + strong pipeline, perfect correlation | 0.80 | 0.55 | 1.00 | 0.00 | No complementarity |

The key insight: complementarity is robust to variation in individual detection rates but fragile to increases in error correlation. If the human and AI make the same kinds of mistakes (e.g., both struggle with security vulnerabilities in complex code), the team provides little improvement over the AI alone.

---

## 4. Learning-to-Defer Formalization

### 4.1 The Mozannar-Sontag Objective

**Definition 12** (System with Deferral). **(Adapted from Mozannar & Sontag, 2020)** Let $\mathcal{X}$ be the input space (code outputs with features), $\mathcal{Y} = \{0, 1\}$ the label space (correct / defective), and $\mathcal{M}$ the space of expert (human) decisions. A learning-to-defer system consists of:

- A classifier $h: \mathcal{X} \to \mathcal{Y}$ (the automated judgment)
- A rejector $r: \mathcal{X} \to \{0, 1\}$ ($r(x) = 0$: use classifier; $r(x) = 1$: defer to human)

The system 0-1 loss is:

$$L_{0\text{-}1}(h, r) = \mathbb{E}_{(x, y) \sim \mathcal{D}} \left[\mathbb{I}[h(x) \neq y] \cdot \mathbb{I}[r(x) = 0] + \mathbb{I}[m(x) \neq y] \cdot \mathbb{I}[r(x) = 1]\right]$$

where $m(x)$ is the human expert's decision on instance $x$, drawn from the conditional distribution $M | (x, y)$.

The optimal deferral policy is:

$$(h^*, r^*) = \arg\min_{h, r} L_{0\text{-}1}(h, r)$$

### 4.2 Bayes-Optimal Deferral

**Proposition 6** (Bayes-Optimal Rejector). **(Standard; Mozannar & Sontag, 2020)** The Bayes-optimal rejector defers on instance $x$ if and only if the human expert's expected error on $x$ is less than the classifier's expected error:

$$r^*(x) = \begin{cases} 1 & \text{if } P(m(x) \neq y | x) < \min_{y'} P(y \neq y' | x) \\ 0 & \text{otherwise} \end{cases}$$

Equivalently, defer when the human is more likely to be correct than the best classifier prediction.

### 4.3 Specialization to the Autonomy Boundary

**Proposition 7** (Autonomy Boundary as Deferral). **(Novel)** In the coding harness setting, the "classifier" $h$ is the automated pipeline's judgment (trust the output / flag as defective), and the "deferral" is sending the output for human review. The Mozannar-Sontag objective specializes as:

$$L_{\text{harness}}(h, r) = \mathbb{E}\left[\underbrace{c_{\text{miss}} \cdot \mathbb{I}[x \text{ defective}] \cdot \mathbb{I}[h(x) = \text{trust}] \cdot \mathbb{I}[r(x) = 0]}_{\text{escaped defect: auto trusts, no deferral}} + \underbrace{c_{\text{review}} \cdot \mathbb{I}[r(x) = 1]}_{\text{review cost}} + \underbrace{c_{\text{miss}} \cdot \mathbb{I}[x \text{ defective}] \cdot \mathbb{I}[m(x) = \text{trust}] \cdot \mathbb{I}[r(x) = 1]}_{\text{escaped defect: human misses after deferral}}\right]$$

where $c_{\text{miss}}$ and $c_{\text{review}}$ are the costs of a missed defect and a review, respectively.

Under the asymmetric cost structure from Formal Round 1 (Section 5), this reduces to the Bayesian decision rule: defer to human review when:

$$P(x \text{ defective} | \mathbf{features}(x)) > \frac{c_{\text{review}}}{c_{\text{miss}} \cdot (d_{\text{human}} - d_{\text{auto}}^{\text{eff}}) + c_{\text{review}}}$$

where $d_{\text{auto}}^{\text{eff}}$ is the effective detection probability of the automated pipeline for the specific defect type.

### 4.4 Equivalence to Bayesian Mode Selection

**Theorem 3** (Deferral-Threshold Equivalence). **(Novel)** Under the following conditions:

(a) The cost structure is the asymmetric binary loss from Definition 8 in Formal R1 ($c_{FG}$ for missed defects, $c_{GF}$ for unnecessary reviews)

(b) The AI's defect probability estimate $\hat{p}(x)$ is well-calibrated ($\hat{p}(x) = P(\text{defective} | x)$)

(c) The human reviewer has a constant detection probability $d_{\text{human}}$ (independent of instance)

the Mozannar-Sontag optimal rejector $r^*(x)$ is equivalent to the Bayesian mode selection threshold:

$$r^*(x) = \mathbb{I}\left[\hat{p}(x) > \tau^*\right] \quad \text{where} \quad \tau^* = \frac{c_{GF}}{c_{FG} \cdot d_{\text{human}} + c_{GF}}$$

*Proof sketch.* The system loss decomposes into: (i) cost of escaped defects when not deferred: $c_{FG} \cdot \hat{p}(x) \cdot (1 - d_{\text{auto}}^{\text{eff}}) \cdot \mathbb{I}[r(x) = 0]$; (ii) cost of review: $c_{GF} \cdot \mathbb{I}[r(x) = 1]$; (iii) cost of escaped defects when deferred but human misses: $c_{FG} \cdot \hat{p}(x) \cdot (1 - d_{\text{human}}) \cdot \mathbb{I}[r(x) = 1]$.

Deferral is optimal when (ii) + (iii) < (i):

$$c_{GF} + c_{FG} \hat{p}(x)(1 - d_{\text{human}}) < c_{FG} \hat{p}(x)(1 - d_{\text{auto}}^{\text{eff}})$$

$$c_{GF} < c_{FG} \hat{p}(x) \left[(1 - d_{\text{auto}}^{\text{eff}}) - (1 - d_{\text{human}})\right] = c_{FG} \hat{p}(x)(d_{\text{human}} - d_{\text{auto}}^{\text{eff}})$$

$$\hat{p}(x) > \frac{c_{GF}}{c_{FG}(d_{\text{human}} - d_{\text{auto}}^{\text{eff}})}$$

When $d_{\text{auto}}^{\text{eff}} = 0$ (no automated detection, so all detection comes from human review), this simplifies to $\tau^* = c_{GF} / (c_{FG} \cdot d_{\text{human}})$, which has the same form as the Bayesian mode selection threshold from Formal R1. Note this is only valid when $d_{\text{human}} > d_{\text{auto}}^{\text{eff}}$; otherwise, deferral to the human never improves over the automated pipeline and $r^*(x) = 0$ for all $x$. $\square$

### 4.5 The Autonomy-Safety Pareto Frontier

**Definition 13** (Autonomy-Safety Frontier). Let the *autonomy rate* be $A = 1 - \mathbb{E}[r(x)]$ (fraction of outputs handled without human review) and the *safety level* be $S = 1 - \mathcal{E}$ (one minus the defect escape rate). The Pareto frontier is the set of $(A, S)$ pairs achievable by some deferral policy $(h, r)$, such that no other policy achieves both higher autonomy and higher safety.

**Proposition 8** (Frontier Shape). **(Novel)** Under the model of Section 1 with a single defect type and constant detection probabilities, the Pareto frontier is convex and monotonically decreasing. Specifically:

$$S(A) = 1 - p(1 - d_{\text{auto}})\left[A + (1 - A)(1 - d_{\text{human}})\right]$$

$$= 1 - p(1 - d_{\text{auto}})\left[1 - (1 - A) \cdot d_{\text{human}}\right]$$

This is linear in $A$ with slope $p(1 - d_{\text{auto}}) \cdot d_{\text{human}}$, meaning each unit of autonomy traded for safety yields a constant marginal improvement. With heterogeneous risk levels (some outputs riskier than others), the frontier becomes strictly convex: the first outputs deferred to human review are the riskiest, yielding the largest safety gains per unit of autonomy sacrificed.

*Proof sketch.* The linear case follows from direct substitution. For the heterogeneous case, let outputs be ordered by defect probability $p(x)$. The optimal deferral policy reviews outputs in decreasing order of $p(x)$, so the marginal safety improvement from reviewing one more output decreases as we move to lower-risk outputs. This produces strict convexity by the rearrangement inequality. $\square$

---

## 5. Interaction Efficiency Metrics

### 5.1 Review Yield

**Definition 14** (Review Yield). The fraction of human reviews that detect at least one defect:

$$Y = \frac{|\{x : x \text{ reviewed} \wedge x \text{ defective} \wedge \text{defect detected}\}|}{|\{x : x \text{ reviewed}\}|}$$

An effective triage policy maximizes $Y$ by concentrating reviews on likely-defective outputs. Under perfect triage (all reviewed outputs are truly defective) with detection probability $d_{\text{human}}$:

$$Y_{\max} = d_{\text{human}}$$

Under random sampling of outputs with base defect rate $p$:

$$Y_{\text{random}} = p \cdot d_{\text{human}}$$

The triage improvement ratio is $Y_{\text{triage}} / Y_{\text{random}}$, measuring how much better the triage policy is than random review selection. **(Novel)**

### 5.2 Attention ROI

**Definition 15** (Marginal Attention Return). The marginal defect detection per unit of human attention allocated to the $k$-th priority output:

$$\text{MAR}(k) = p_{(k)} \cdot d_{\text{human}} \cdot (1 - d_{\text{auto},k})$$

where $p_{(k)}$ is the defect probability of the $k$-th highest-risk output (the outputs are sorted in decreasing risk order by the triage policy). The cumulative Attention ROI for reviewing $n$ outputs is:

$$\text{AROI}(n) = \frac{\sum_{k=1}^{n} \text{MAR}(k)}{n}$$

AROI is decreasing in $n$ when outputs are triaged optimally (highest risk first), reflecting diminishing returns from reviewing lower-risk outputs. **(Novel)**

### 5.3 Trust Calibration Error

**Definition 16** (Trust Calibration Error, restated with estimation procedure). Given observed outcomes $(o_{k,1}, \ldots, o_{k,n_k})$ for agent-task pair $k$ (where $o = 1$ indicates defect-free), the estimated trust is:

$$\hat{\tau}_k = \frac{\alpha_k + \sum_{i} o_{k,i}}{\alpha_k + \beta_k + n_k}$$

(the posterior mean of the Beta distribution). The empirical reliability is:

$$\hat{p}_k = \frac{1}{n_k} \sum_{i=1}^{n_k} o_{k,i}$$

The sample Trust Calibration Error is:

$$\widehat{\text{TCE}} = \frac{1}{K} \sum_{k=1}^{K} |\hat{\tau}_k - \hat{p}_k|$$

For large $n_k$, $\hat{\tau}_k \to \hat{p}_k$ (the prior is overwhelmed), so $\widehat{\text{TCE}} \to 0$. TCE is non-trivial in the finite-sample regime where the prior has material influence, which is precisely the cold-start and low-observation regime where calibration matters most.

**Measurability status:** Directly computable from logged interaction data (agent, task type, outcome).

### 5.4 Vigilance Maintenance Cost

**Definition 17** (Vigilance Maintenance Cost). The fraction of the total interaction budget consumed by vigilance probes:

$$\text{VMC} = \frac{B_{\text{vig}}}{B} = \phi_v$$

This is a pure overhead: vigilance probes detect no *new* defects (the defects are planted), and their sole purpose is maintaining the reviewer's detection capability. Lower VMC at equal detection performance indicates a more efficient vigilance maintenance strategy.

**Measurability status:** Directly observable (count of probes / total reviews).

### 5.5 Relationships Between Metrics

**Theorem 4** (TCE-Yield Relationship). **(Novel)** Under the triage policy that reviews all outputs with estimated defect probability above threshold $\tau^*$ (from the Bayesian decision rule):

$$Y \geq p \cdot d_{\text{human}} \cdot \frac{1}{p + \text{TCE}}$$

That is, Review Yield is bounded below by a function that increases as TCE decreases.

*Proof sketch.* The triage policy reviews output $x$ when $\hat{p}_{\text{defect}}(x) > \tau^*$. With perfect calibration (TCE = 0), the set of reviewed outputs contains exactly those with true defect probability above $\tau^*$, and the yield is determined by $d_{\text{human}}$ applied to this set. With miscalibration (TCE > 0), some outputs with true defect probability below $\tau^*$ are incorrectly included (wasting reviews), and some with true probability above $\tau^*$ are incorrectly excluded. The net effect is that the defect density among reviewed outputs is diluted by a factor proportional to TCE, reducing yield.

More precisely, let $F_{\text{defective}}(\tau)$ and $F_{\text{clean}}(\tau)$ be the CDFs of estimated defect probability for truly defective and clean outputs, respectively. The yield is:

$$Y = d_{\text{human}} \cdot \frac{p \cdot (1 - F_{\text{defective}}(\tau^*))}{p(1 - F_{\text{defective}}(\tau^*)) + (1 - p)(1 - F_{\text{clean}}(\tau^*))}$$

When TCE = 0, $F_{\text{clean}}(\tau^*) \approx 1$ (clean outputs have low estimated defect probability) and $Y \approx d_{\text{human}}$. As TCE increases, $1 - F_{\text{clean}}(\tau^*)$ grows (more clean outputs cross the threshold), diluting $Y$. $\square$

**Proposition 9** (VMC-AROI Relationship). **(Novel)** The Attention ROI over all reviewed outputs (including probes) is:

$$\text{AROI}_{\text{total}} = (1 - \phi_v) \cdot \text{AROI}_{\text{triage}} + \phi_v \cdot 0 = (1 - \phi_v) \cdot \text{AROI}_{\text{triage}}$$

since probes contribute zero new defect detections. Higher VMC directly reduces the measured AROI, creating a tension: vigilance probes are necessary to maintain $d_{\text{human}}$ (which enters AROI through the detection probability), but they also dilute AROI by consuming budget without yielding detections. The optimal $\phi_v^*$ from Theorem 1 balances this tension.

---

## 6. Developer Experience Moderation

### 6.1 The Expertise Parameter

**Definition 18** (Expertise Level). Let $e \in [0, 1]$ represent the developer's expertise level, where $e = 0$ is a complete novice and $e = 1$ is a domain expert. $e$ is not directly measurable but can be estimated from observable proxies:

- Years of experience in the relevant language/framework (ordinal, mapped to $[0,1]$)
- Historical code review accuracy (fraction of defects caught in past double-review studies)
- Familiarity with the specific codebase (measured by prior commit history)
- Self-reported confidence (weakly calibrated; the METR study shows developers overestimate their efficiency by 24-39 percentage points)

**Measurability status:** Not directly measurable. Proxy-based estimation with substantial uncertainty. The mapping from proxies to $e$ is itself a modeling choice that may introduce systematic bias.

### 6.2 Expertise-Moderated Parameters

**Proposition 10** (Expertise Moderation). **(Novel, calibrated from empirical data)** The expertise level $e$ modifies three key parameters:

**(a) Detection probability.** Expert reviewers have higher baseline detection:

$$d_0(e) = d_{\min} + (d_{\max} - d_{\min}) \cdot e^{\gamma_d}$$

where $d_{\min} \approx 0.25$ (novice detection rate, from Jones 1996: informal inspection $< 50\%$, halved for novices), $d_{\max} \approx 0.85$ (expert detection under optimal conditions, from Cohen 2006), and $\gamma_d > 0$ governs the concavity of the skill curve (Dreyfus model predicts $\gamma_d > 1$, reflecting the non-linear jump from rule-following to intuitive perception at expert levels).

**(b) Vigilance decay rate.** Novices experience faster vigilance decay because the review task is more cognitively demanding (Warm et al., 2008: task difficulty accelerates resource depletion):

$$\delta(e) = \delta_{\max} - (\delta_{\max} - \delta_{\min}) \cdot e$$

where $\delta_{\max}$ is the novice decay rate (faster) and $\delta_{\min}$ is the expert decay rate (slower). Empirical calibration: if experts sustain effective review for 60 minutes and novices for 30 minutes before reaching the same relative degradation level, $\delta_{\max} \approx 2 \delta_{\min}$.

**(c) Trust prior.** Novices should start with more conservative (lower-trust) priors, reflecting higher uncertainty about their ability to evaluate agent output:

$$\alpha_k^{(0)}(e) = \max\left(1, \; \alpha_k^{(0)} \cdot e\right), \quad \beta_k^{(0)}(e) = \beta_k^{(0)} + (1 - e) \cdot \beta_{\text{conservative}}$$

where $\beta_{\text{conservative}} > 0$ adds pseudo-failures to the prior for less experienced developers, making the trust model more conservative (lower initial trust, more review required). This reflects the empirical finding that novices are more susceptible to accepting incorrect AI output (cognitive offloading study: $r = +0.72$ for AI use and cognitive offloading, with younger developers showing the strongest effect).

### 6.3 Empirical Calibration for Expertise Effects

| Parameter | Novice ($e \approx 0.2$) | Mid-level ($e \approx 0.5$) | Expert ($e \approx 0.9$) | Source | Confidence |
|-----------|-------------------------|----------------------------|-------------------------|--------|------------|
| $d_0$ | 0.25-0.40 | 0.45-0.65 | 0.70-0.85 | Jones (1996); Cohen (2006) | **M** |
| Effective review time before degradation | 20-30 min | 40-50 min | 60-90 min | Extrapolated from Mackworth + Cohen | **L** |
| Accretion rate (defects accepted per hour) | 3-4x expert rate | 1.5-2x expert rate | 1x (baseline) | See note below | **L** |
| Context budget (fraction of working time spent understanding context) | ~0.50 | ~0.25 | ~0.08 | Estimated from task analysis literature | **L** |
| Cognitive offloading susceptibility | High ($r \approx 0.72$) | Moderate | Low | Cognitive offloading study ($n = 666$) | **M** |

**Note on accretion rates.** The "3-4x higher accretion rates for juniors" is estimated from multiple converging signals: (1) the cognitive offloading study showing younger developers with the strongest effect; (2) the METR finding that experienced developers reject >56% of AI output while (by implication) less experienced developers reject less; (3) the Fastly survey showing juniors ship less AI code but edit it less, suggesting lower quality filtering. The 3-4x figure is a rough composite; no single study directly measures accretion rate stratified by experience.

### 6.4 Optimal Policy Shift with Expertise

**Corollary 2** (Conservative Policy for Novices). **(Novel)** Under the budget optimization of Theorem 1, substituting the expertise-moderated parameters:

For low $e$ (novices):
- $\phi_r^*$ increases (more review needed because $d_0$ is lower, so more outputs must be inspected to achieve the same detection rate)
- $\phi_v^*$ increases (faster vigilance decay requires more probes to maintain detection)
- $\phi_c^*$ may increase or decrease depending on whether the novice's trust model diverges faster (more calibration needed) or the added review budget provides sufficient signal

For high $e$ (experts):
- $\phi_r^*$ decreases (higher $d_0$ means each review is more effective, so fewer reviews achieve the same detection level)
- $\phi_v^*$ decreases (slower decay, less need for probes)
- The optimal policy permits higher autonomy (lower $\tau^*$ threshold)

This formalizes the intuition that harnesses should be more conservative for junior developers and more permissive for senior developers. The quantitative shift depends on the expertise-parameter calibration, which is currently low-confidence (see measurability caveats above).

---

## 7. Situated Action Reconciliation: The Formalization Gap

### 7.1 What the Framework Cannot Capture

The preceding sections develop an optimization framework for tactical interaction: per-output triage, budget allocation, detection probability, deferral thresholds. This section formally acknowledges the boundary of this framework's applicability.

**Definition 19** (Formalization Gap). The *formalization gap* is the set of interaction qualities that have no representation in any finite-dimensional parametric model of gate-based human-agent interaction. These include, but are not limited to:

(a) *Shared understanding* (Clark, 1996): the progressive grounding of mutual belief about what the code does, why it was written this way, and what alternatives were considered. This is a dialogic process with no fixed-point representation.

(b) *Theory building* (Naur, 1985): the construction and maintenance of the programmer's mental model of the system. Theory is "inextricably bound to human beings" and cannot be captured in any code metric.

(c) *Contextual adaptation* (Suchman, 1987/2007): the ongoing, situated adjustment of goals, methods, and interpretations in response to unfolding circumstances. The developer's objectives are constructed through the interaction, not specified in advance.

(d) *Tacit knowledge deployment* (Polanyi, 1966; Dreyfus & Dreyfus, 1986): the expert's intuitive recognition of code quality, architectural appropriateness, and design coherence, which operates through perception rather than rule application.

(e) *Systemic cognition* (Hutchins, 1995): the emergent cognitive properties of the human-agent-harness-codebase system that are not reducible to any component's individual properties.

### 7.2 Limitation Theorem

**Theorem 5** (Incompleteness of Gate-Based Interaction Models). **(Novel; adapted from Suchman, 1987/2007 and the arguments in R3)** No model that represents human-agent interaction solely through discrete decision gates (approve/reject/defer, with associated probabilities and costs) can capture the following properties of effective coding collaboration:

(a) *Goal evolution:* The developer's specification of what they want changes as a result of seeing what the agent produces. A fixed utility function cannot represent an objective that is being constructed through the interaction.

(b) *Comprehension externalities:* The most valuable outcome of code review may be the reviewer's improved understanding of the system (theory building), not the defects caught. This externality is positive, non-rival, and has no natural representation in the defect-escape-rate objective.

(c) *Breakdown informativeness:* Failures and misunderstandings between human and agent may be more informative than successes, because they reveal divergences in interpretation that, once resolved, produce deeper shared understanding. A model that minimizes failures may be optimizing away the most valuable learning opportunities.

(d) *Contextual non-stationarity:* The relevant parameters ($d_{\text{human}}$, trust priors, cost ratios) depend on the developer's current cognitive state, which is itself a product of the recent interaction history. This creates a reflexive loop: the model's parameters depend on the model's outputs, violating the exogeneity assumptions of the optimization framework.

*Proof sketch (for (a)).* Suppose the interaction can be modeled as $\min_{\pi} \mathbb{E}_{\pi}[L(\theta, a)]$ for some fixed loss function $L$ and prior over states $\theta$. Under Suchman's situated action framework, the loss function $L$ is itself a function of the interaction history $\mathcal{H}_t$: $L = L(\theta, a; \mathcal{H}_t)$. But $\mathcal{H}_t$ depends on the policy $\pi$, so the optimization becomes $\min_{\pi} \mathbb{E}_{\pi}[L(\theta, a; \mathcal{H}_t^{\pi})]$, where the objective depends on the policy. This is a bilevel optimization problem with the additional complication that $L$ is not known in advance but is revealed through the interaction. Standard Bayesian decision theory assumes a fixed loss function; the situated-action framework denies this assumption. $\square$

### 7.3 Tactical vs. Strategic Interaction

**Definition 20** (Interaction Taxonomy). We distinguish two modes of human-agent interaction, arguing they require fundamentally different formalisms:

**(a) Tactical interaction.** Per-output decisions: review this output? Trust this agent for this task? Allocate attention to this file or that one? These are well-modeled by the optimization framework developed in Sections 1-6. They are amenable to Bayesian decision theory, bandit algorithms, and signal detection theory because they involve repeated decisions with observable outcomes and stable (or slowly drifting) parameters.

**(b) Strategic interaction.** Per-milestone deliberation: what should we build? Is this the right architecture? Does this approach serve the project's long-term goals? These require conversation, shared understanding, and theory building. They are not well-modeled by any gate-based framework because they involve goal construction, not goal optimization.

**Proposition 11** (Distinct Formalism Requirement). **(Novel)** Tactical and strategic interactions have different formal requirements:

| Property | Tactical | Strategic |
|----------|----------|-----------|
| Decision structure | Discrete gates (approve/reject/defer) | Open-ended dialogue |
| Objective | Minimize defect escape rate | Maximize shared understanding |
| Time horizon | Per-output (seconds to minutes) | Per-milestone (hours to days) |
| Parameters | Observable, estimable | Partially tacit, reflexive |
| Appropriate formalism | Bayesian decision theory, bandits, SDT | Grounding theory (Clark), distributed cognition (Hutchins), language games (Wittgenstein) |
| Optimization | Tractable (Theorem 1) | Ill-defined (Theorem 5) |

The formal apparatus of this paper applies to tactical interaction. Strategic interaction requires a different approach that we do not develop here; we note only that conflating the two (e.g., trying to optimize milestone-level architecture discussions using per-output triage metrics) will produce systematically misleading recommendations.

### 7.4 Goodhart Vulnerability

**Proposition 12** (Metric Corruption Risk). **(Adapted from Scott, 1998 and Goodhart, 1975)** Every metric defined in Section 5 (Review Yield, Attention ROI, TCE, VMC) is vulnerable to Goodhart's Law: when the metric becomes a target, it ceases to be a good metric.

Specific failure modes:

(a) *Review Yield as target:* Triage policy learns to only review outputs it is nearly certain contain defects, ignoring uncertain cases. Yield increases; actual defect escape rate may worsen.

(b) *AROI as target:* Budget shifts toward easy-to-detect defects (high AROI per review), neglecting hard-to-detect defects (low AROI per review but high cost per escape).

(c) *TCE as target:* Trust model may be tuned to minimize calibration error in-distribution while failing to generalize to novel agent-task pairs.

These failure modes do not invalidate the metrics. They caution against optimizing metrics directly without maintaining the qualitative checks (strategic interaction, periodic deep review, human judgment about system health) that the formal model cannot represent.

---

## 8. Summary of Measurability

| Quantity | Directly Measurable? | Estimation Method | Current Data Availability | Confidence |
|----------|---------------------|-------------------|--------------------------|------------|
| $H$ (review capacity) | Yes | Session logs: outputs reviewed per hour | Available from any instrumented harness | **H** |
| $T$ (session duration) | Yes | Clock time | Trivially available | **H** |
| $B = H \cdot T$ | Yes | Computed from above | Available | **H** |
| $d_{\text{human}}$ | Yes (with study design) | Double-review + verification | Requires deliberate study; no published AI-specific data | **M** |
| $d_{\text{auto}}$ | Yes | Known-defect injection | Requires curated defect corpus | **M** |
| $\Phi(t)$ (vigilance decay) | Yes (with instrumentation) | Time-series detection rates | Mackworth/See et al. provide baselines; no code-review-specific data | **M** |
| $\Phi(\phi_v)$ (probe effect) | Partially | Controlled experiment varying probe frequency | No published data for code review | **L** |
| $p$ (base defect rate) | Partially | Historical defect counts / agent outputs | Available from logged outcomes but definition-dependent | **M** |
| $\tau_k$ (trust estimates) | Yes | Beta posterior computation from outcomes | Directly computable | **H** |
| $p_k$ (true reliability) | No (latent) | Approximated by long-run frequency | Improves with data volume | **M** |
| TCE | Partially | Comparison of $\hat{\tau}_k$ and $\hat{p}_k$ | Computable but depends on sample size | **M** |
| $e$ (expertise) | No | Proxy-based estimation | Crude proxies available; systematic bias likely | **L** |
| $\rho_{HA}$ (error correlation) | Partially | Double-review + automated pipeline comparison | No published data; requires coordinated study | **L** |
| $c_{FG}/c_{GF}$ (cost ratio) | No | Expert elicitation + incident cost data | Organization-specific; order of magnitude estimable | **L** |
| Review Yield ($Y$) | Yes | Defects found / reviews conducted | Directly computable from logs | **H** |
| AROI | Partially | Requires ranked risk estimates + outcomes | Computable with triage policy instrumentation | **M** |
| VMC | Yes | Probe count / total reviews | Directly observable | **H** |

---

## 9. Consolidated Definitions, Theorems, and Propositions

For reference, the formal results in this document are:

| # | Type | Name | Section | Status |
|---|------|------|---------|--------|
| 1 | Definition | Human Review Capacity | 1.1 | Novel |
| 2 | Definition | Session Duration | 1.1 | Novel |
| 3 | Definition | Total Interaction Budget | 1.1 | Novel |
| 4 | Definition | Review Budget | 1.2 | Novel |
| 5 | Definition | Calibration Budget | 1.2 | Novel |
| 6 | Definition | Vigilance Budget | 1.2 | Novel |
| 7 | Definition | Budget Constraint | 1.2 | Novel |
| 8 | Definition | Defect Escape Rate | 1.3 | Adapted |
| 9 | Definition | Trust Calibration Error | 1.5 | Novel |
| 10 | Definition | Review Capacity Gap | 2.5 | Novel |
| 11 | Definition | Complementarity Index | 3.1 | Adapted |
| 12 | Definition | System with Deferral | 4.1 | Adapted |
| 13 | Definition | Autonomy-Safety Frontier | 4.5 | Novel |
| 14 | Definition | Review Yield | 5.1 | Novel |
| 15 | Definition | Marginal Attention Return | 5.2 | Novel |
| 16 | Definition | Trust Calibration Error (estimation) | 5.3 | Novel |
| 17 | Definition | Vigilance Maintenance Cost | 5.4 | Novel |
| 18 | Definition | Expertise Level | 6.1 | Novel |
| 19 | Definition | Formalization Gap | 7.1 | Novel |
| 20 | Definition | Interaction Taxonomy | 7.3 | Novel |
| 1 | Proposition | Vigilance-Detection Relationship | 1.4 | Novel |
| 2 | Proposition | Calibration Budget and Triage Efficiency | 1.5 | Novel |
| 3 | Proposition | Sensitivity to Agent Quality | 1.7 | Novel |
| 4 | Proposition | Complementarity via Error Independence | 3.2 | Novel |
| 5 | Proposition | Calibration Requirement for Decision Complementarity | 3.3 | Adapted |
| 6 | Proposition | Bayes-Optimal Rejector | 4.2 | Standard |
| 7 | Proposition | Autonomy Boundary as Deferral | 4.3 | Novel |
| 8 | Proposition | Frontier Shape | 4.5 | Novel |
| 9 | Proposition | VMC-AROI Relationship | 5.5 | Novel |
| 10 | Proposition | Expertise Moderation | 6.2 | Novel |
| 11 | Proposition | Distinct Formalism Requirement | 7.3 | Novel |
| 12 | Proposition | Metric Corruption Risk | 7.4 | Adapted |
| 1 | Theorem | Optimal Budget Allocation | 1.6 | Novel |
| 2 | Theorem | Conditions for Positive Complementarity | 3.2 | Novel |
| 3 | Theorem | Deferral-Threshold Equivalence | 4.4 | Novel |
| 4 | Theorem | TCE-Yield Relationship | 5.5 | Novel |
| 5 | Theorem | Incompleteness of Gate-Based Models | 7.2 | Novel |
| 1 | Corollary | Vigilance-Review Tradeoff | 1.6 | Novel |
| 2 | Corollary | Conservative Policy for Novices | 6.4 | Novel |

---

## References

### Formal Foundations and Decision Theory

1. Berger, J. O. (1985). *Statistical Decision Theory and Bayesian Analysis*, 2nd edition. Springer.
2. Neyman, J. and Pearson, E. S. (1933). On the problem of the most efficient tests of statistical hypotheses. *Philosophical Transactions of the Royal Society A*, 231:289-337.
3. Chow, C. K. (1970). On optimum recognition error and reject tradeoff. *IEEE Transactions on Information Theory*, 16(1):41-46.

### Bandit Theory and Trust Calibration

4. Thompson, W. R. (1933). On the likelihood that one unknown probability exceeds another. *Biometrika*, 25(3-4):285-294.
5. Agrawal, S. and Goyal, N. (2013). Thompson sampling for contextual bandits with linear payoffs. *ICML 2013*, PMLR 28(3):127-135.
6. Kaufmann, E., Korda, N., and Munos, R. (2012). Thompson sampling: An asymptotically optimal finite-time analysis. *ALT 2012*.
7. Russo, D. and Van Roy, B. (2016). An information-theoretic analysis of Thompson Sampling. *JMLR*, 17(68):1-30.
8. Whittle, P. (1988). Restless bandits: Activity allocation in a changing world. *Journal of Applied Probability*, 25:287-298.

### Signal Detection Theory and Vigilance

9. Green, D. M. and Swets, J. A. (1966). *Signal Detection Theory and Psychophysics*. Wiley.
10. Mackworth, N. H. (1948). The breakdown of vigilance during prolonged visual search. *Quarterly Journal of Experimental Psychology*, 1:6-21.
11. See, J. E., Warm, J. S., Dember, W. N., and Howe, S. R. (1995). Meta-analysis of the sensitivity decrement in vigilance. *Psychological Bulletin*, 117:230-249.
12. Warm, J. S., Parasuraman, R., and Matthews, G. (2008). Vigilance requires hard mental work and is stressful. *Human Factors*, 50:433-441.
13. Wolfe, J. M., Horowitz, T. S., and Kenner, N. M. (2005). Rare items often missed in visual searches. *Nature*, 435:439-440.

### Sampling Inspection

14. Dodge, H. F. and Romig, H. G. (1959). *Sampling Inspection Tables*, 2nd edition. Wiley.
15. MIL-STD-105E (1989). Sampling Procedures and Tables for Inspection by Attributes.
16. Schwaninger, A., Hardmeier, D., and Hofer, F. (2005). Aviation security screeners: Visual abilities and visual knowledge measurement. *IEEE ICCST*.

### Human-AI Teaming and Learning to Defer

17. Mozannar, H. and Sontag, D. A. (2020). Consistent estimators for learning to defer to an expert. *ICML 2020*, PMLR 119.
18. Bansal, G. et al. (2021). Does the whole exceed its parts? The effect of AI explanations on complementary team performance. *CHI 2021*.
19. Vodrahalli, K. et al. (2022). Uncalibrated models can improve human-AI collaboration. *NeurIPS 2022*.
20. Madras, D., Pitassi, T., and Zemel, R. (2018). Predict responsibly: Improving fairness and accuracy by learning to defer. *NeurIPS 2018*.
21. Raghu, M. et al. (2019). The algorithmic automation problem. *arXiv:1903.12220*.
22. Gao, R. et al. (2021). Human-AI collaboration with bandit feedback. *IJCAI 2021*.
23. Henrique, B. et al. (2025). Dynamic trust calibration using contextual bandits. *arXiv:2509.23497*.

### Code Review Empirical Studies

24. Fagan, M. E. (1976). Design and code inspections to reduce errors in program development. *IBM Systems Journal*, 15(3):182-211.
25. Cohen, J. (2006). *Best Kept Secrets of Peer Code Review*. SmartBear Software.
26. Jones, C. (1996). *Applied Software Measurement*, 2nd edition. McGraw-Hill.
27. Jureczko, M. et al. (2020). Code inspection and review effectiveness. Confirming 200 LOC/hr rate.
28. Beller, M. et al. (2014). Modern code reviews in open-source projects. *MSR 2014*.

### Industry Data

29. DORA 2025. State of AI-Assisted Software Development. Google Cloud / Faros AI.
30. Sonar 2026. State of Code Developer Survey.
31. METR (2026). Many SWE-bench passing PRs would not be merged into main.
32. GitClear (2025). AI coding tools quality analysis: longitudinal code churn data.
33. Fastly (2025). Developer AI survey ($n = 791$).
34. CodeRabbit (2025/2026). AI code review analysis: 1.7x major issues, 2.74x security vulnerabilities.

### Situated Action and HCI Theory

35. Suchman, L. (1987/2007). *Plans and Situated Actions / Human-Machine Reconfigurations*. Cambridge University Press.
36. Naur, P. (1985). Programming as theory building. *Microprocessing and Microprogramming*, 15(5):253-261.
37. Clark, H. H. (1996). *Using Language*. Cambridge University Press.
38. Hutchins, E. (1995). *Cognition in the Wild*. MIT Press.
39. Polanyi, M. (1966). *The Tacit Dimension*. Doubleday.
40. Dreyfus, H. L. and Dreyfus, S. E. (1986). *Mind Over Machine*. Free Press.
41. Scott, J. C. (1998). *Seeing Like a State*. Yale University Press.
42. Bainbridge, L. (1983). Ironies of automation. *Automatica*, 19(6):775-779.

### Radiology and Screening Analogues

43. Gilbert, F. J. et al. (2008). Single reading with computer-aided detection for screening mammography. *New England Journal of Medicine*, 359(16):1675-1684.
44. Skinner, T. A. and Giesbrecht, B. (2024). Vigilance decrements in the continuous temporal expectancy task. *Psychonomic Bulletin & Review*.

### Additional

45. Goodhart, C. A. E. (1975). Problems of monetary management: The U.K. experience. *Papers in Monetary Economics*, Reserve Bank of Australia.
46. Pandya, R. et al. (2019). Human-AI learning performance in multi-armed bandits. *AAAI/ACM AIES 2019*.
