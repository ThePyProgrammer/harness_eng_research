# Formal Methods for Architectural Drift Detection and Decision Decay

**Research Dimension:** Formal Methods for Drift & Decay
**Date:** 2026-04-03

---

## 1. Change-Point Detection for Architectural Drift

### 1.1 CUSUM (Cumulative Sum Control Charts)

**Origin.** E.S. Page introduced CUSUM in his 1954 Biometrika paper "Continuous Inspection Schemes" (Page, 1954). Unlike Shewhart charts, which examine only the most recent observation, CUSUM accumulates the full history of deviations from a target value, making it far more sensitive to small, persistent shifts.

**Formal Definition.** The tabular (two-sided) CUSUM maintains paired statistics:

$$C_i^+ = \max\bigl[0,\; x_i - (\mu_0 + K) + C_{i-1}^+\bigr]$$

$$C_i^- = \max\bigl[0,\; (\mu_0 - K) - x_i + C_{i-1}^-\bigr]$$

where $\mu_0$ is the target (in-control) mean, $K$ is the reference value (slack, typically set to $\delta\sigma/2$ for detecting a shift of size $\delta$), and both $C_0^+ = C_0^- = 0$. An out-of-control signal fires when $C_i^+$ or $C_i^-$ exceeds a decision threshold $h$.

The single-sided recursive form is:

$$S_0 = 0, \quad S_{n+1} = \max(0,\; S_n + x_{n+1} - \omega_n)$$

A change is declared when $S > h$.

**Average Run Length (ARL).** The primary performance metric for CUSUM is the Average Run Length, which measures the expected number of samples before an alarm. Two quantities matter:

- $\text{ARL}_0 = 1/\alpha$: the in-control ARL (should be large to minimize false alarms)
- $\text{ARL}_1$: the out-of-control ARL (should be small for rapid detection)

ARL calculations for CUSUM involve solving integral equations or using Markov chain approximations; closed-form solutions do not exist for most configurations. Performance tables parameterized by standardized values $k_s = (\mu - K)/(\sigma/\sqrt{n})$ and $h_s = h/(\sigma/\sqrt{n})$ are used in practice (NIST Engineering Statistics Handbook).

**Application to Architectural Metrics.** Consider a time series of architectural violation counts $\{v_1, v_2, \ldots, v_t\}$ indexed by commit or sprint. Under stable architecture, the violation rate has an expected value $\mu_0$. CUSUM detects when the process mean has shifted (e.g., new developers introducing coupling violations, or a library upgrade breaking dependency rules). The key advantage over Shewhart charts is sensitivity to gradual drift: a steady increase of 0.5 violations per sprint might take a Shewhart chart dozens of observations to catch, while CUSUM with $K = 0.25\sigma$ will accumulate evidence and alarm much sooner.

**Strengths.** Optimal for detecting small, sustained shifts; well-understood statistical properties; ARL guarantees can be computed a priori; low computational cost for online monitoring.

**Limitations.** Assumes independent, identically distributed observations (software metrics are often autocorrelated); parametric assumptions about the distribution; requires knowing the target $\mu_0$ and desired shift size $\delta$ in advance; not well suited to detecting transient spikes that revert.

### 1.2 Bayesian Online Change-Point Detection (BOCPD)

**Origin.** Adams and MacKay (2007) introduced BOCPD in their paper "Bayesian Online Changepoint Detection" (arXiv:0710.3742). The method computes an exact posterior over the "run length" (time since the last changepoint) using a recursive message-passing algorithm.

**Formal Model.** Let $r_t$ denote the run length at time $t$. The algorithm maintains the joint distribution:

$$p(r_t, \mathbf{x}_{1:t}) = \sum_{r_{t-1}} p(x_t \mid r_t, \mathbf{x}^{(\ell)}) \; p(r_t \mid r_{t-1}) \; p(r_{t-1}, \mathbf{x}_{1:t-1})$$

This decomposes into three factors: (1) the predictive likelihood of the current observation given the current run, (2) the changepoint prior (transition probability), and (3) the previous message.

**Changepoint Prior via Hazard Function.** The transition probabilities encode the prior belief about changepoint frequency:

$$p(r_t \mid r_{t-1}) = \begin{cases}
H(r_{t-1} + 1) & \text{if } r_t = 0 \text{ (changepoint)} \\
1 - H(r_{t-1} + 1) & \text{if } r_t = r_{t-1} + 1 \text{ (growth)} \\
0 & \text{otherwise}
\end{cases}$$

where $H(\tau) = f(\tau)/S(\tau)$ is the hazard function, $f(\tau)$ is the probability mass function of the inter-changepoint interval, and $S(\tau) = P(T \geq \tau)$ is the survival function. A common choice is constant hazard $H(\tau) = 1/\lambda$, corresponding to a geometric prior on run lengths.

**Growth and Changepoint Probabilities.** At each step:

- Growth: $p(r_t = \ell, \mathbf{x}_{1:t}) = p(r_{t-1}, \mathbf{x}_{1:t-1}) \cdot \pi_{t-1}^{(\ell)} \cdot (1 - H(r_{t-1}))$
- Changepoint: $p(r_t = 0, \mathbf{x}_{1:t}) = \sum_{r_{t-1}} p(r_{t-1}, \mathbf{x}_{1:t-1}) \cdot \pi_{t-1}^{(\ell)} \cdot H(r_{t-1})$

where $\pi_{t-1}^{(\ell)} = p(x_t \mid \nu_{t-1}^{(\ell)}, \chi_{t-1}^{(\ell)})$ is the predictive likelihood under conjugate sufficient statistics.

**Sufficient Statistic Updates.** For exponential family models, conjugate updates are:

$$\nu_t^{(0)} = \nu_{\text{prior}}, \quad \chi_t^{(0)} = \chi_{\text{prior}}$$
$$\nu_t^{(\ell)} = \nu_{t-1}^{(\ell-1)} + 1, \quad \chi_t^{(\ell)} = \chi_{t-1}^{(\ell-1)} + u(x_t)$$

**Predictive Distribution.** Optimal predictions marginalize over all run lengths:

$$p(x_{t+1} \mid \mathbf{x}_{1:t}) = \sum_{\ell=0}^{t} p(x_{t+1} \mid r_t = \ell, \mathbf{x}_{(t-\ell):t}) \; p(r_t = \ell \mid \mathbf{x}_{1:t})$$

**Application to Software Metrics.** BOCPD is particularly attractive for architectural drift detection because: (a) it produces a full posterior over changepoint locations rather than a binary alarm; (b) the hazard function can encode domain knowledge (e.g., "we expect architectural shifts roughly every 6 months after major releases"); (c) it handles non-stationary processes naturally. For commit-indexed metrics (cyclomatic complexity, coupling between modules, conformance scores), BOCPD can identify the exact commit range where drift began, with calibrated uncertainty.

**Strengths.** Fully Bayesian with principled uncertainty quantification; online (constant memory per run-length); flexible via choice of hazard function and likelihood model; no need to pre-specify shift size.

**Limitations.** Computational cost grows linearly with the maximum run length (can be truncated); the constant-hazard assumption may be too simple for software processes with periodic release cycles; requires choosing the underlying probabilistic model for observations.

### 1.3 Statistical Power and False-Positive Guarantees

Both methods provide formal guarantees, but in different forms:

- **CUSUM:** ARL-based guarantees. For a given threshold $h$ and reference $K$, the in-control $\text{ARL}_0$ is deterministic (though computed numerically). This translates to a false-positive rate of $\alpha = 1/\text{ARL}_0$ per observation. With $h = 5$ and $K = 0.5$, typical $\text{ARL}_0$ values exceed 400, giving $\alpha < 0.0025$.
- **BOCPD:** Posterior probability calibration. Rather than controlling a false-alarm rate, BOCPD reports $p(r_t = 0 \mid \mathbf{x}_{1:t})$, and users set their own threshold. Under well-specified models, these posteriors are calibrated. Miscalibration under model misspecification is the primary risk.

---

## 2. Survival Analysis for Decision Validity

### 2.1 Decision Validity as a Survival Function

A technical decision made at time $t_0$ can be modeled as a "subject" whose "death" is the moment the decision becomes invalid (requiring revision or replacement). The survival function is:

$$S(t) = P(\text{decision valid at } t) = P(T > t)$$

Under exponential (memoryless) decay, this simplifies to:

$$S(t) = \exp\bigl(-\lambda(t - t_0)\bigr)$$

where $\lambda$ is the hazard rate. The half-life of a decision is $t_{1/2} = \ln(2)/\lambda$.

More realistically, decisions exhibit non-constant hazard. The Weibull distribution generalizes the exponential:

$$h(t) = \frac{k}{\lambda}\left(\frac{t}{\lambda}\right)^{k-1}$$

where $k > 1$ indicates increasing hazard (decisions become more fragile over time, consistent with technology aging) and $k < 1$ indicates infant mortality (decisions most likely to fail early). Software evolution research by Herraiz et al. found that fine-grained code elements exhibit both infant mortality and age-related decay patterns, suggesting $k$ varies by decision type.

### 2.2 Empirical Evidence on Decision Decay Rates

Direct empirical data on architectural decision half-lives is sparse, but related studies provide evidence:

- **Architectural decay studies** (Le et al., 2018, IEEE SANER) documented that architectural changes accumulate at roughly constant rates in open-source systems, with median lifetimes of architectural elements varying by 2-10x depending on component type.
- **Code element lifetimes** (Herraiz et al., PeerJ CS, 2021) found that new lines of code exhibit infant mortality (high early change rate) followed by decreasing hazard, fitting a Weibull model with $k < 1$ for the survival of individual code lines.
- **Technical debt accumulation** (Besker et al., JSS, 2021) found that architectural design decisions that incur technical debt have shorter effective lifetimes, with foundational technology decisions driven by corporate strategy rather than technical merit decaying fastest.

### 2.3 Domain-Specific Decay Rates

While rigorous empirical half-life data by decision category is limited, practitioner experience and ecosystem analysis suggest the following ordering (from shortest to longest expected validity):

| Decision Category | Estimated Half-Life | Primary Decay Driver |
|---|---|---|
| Frontend framework choice | 2-4 years | Ecosystem churn, community migration |
| Build tooling / CI config | 2-3 years | Toolchain evolution, deprecation |
| API design (REST, GraphQL) | 3-6 years | Protocol evolution, client needs |
| Database technology choice | 5-10 years | Data model stability, migration cost |
| Core language / runtime | 5-15 years | LTS cycles, performance requirements |
| Cryptographic algorithm choice | 5-10 years | Security research, compliance mandates |

These estimates reflect ecosystem dynamics rather than intrinsic quality; a frontend decision is not "worse" but rather exists in a faster-evolving environment.

### 2.4 Competing Risks Models

A decision can become invalid for multiple independent reasons, making competing risks models (Fine and Gray, 1999) appropriate. The cause-specific hazard function for risk $j$ is:

$$h_j(t) = \lim_{\Delta t \to 0} \frac{P(t \leq T < t + \Delta t, \; J = j \mid T \geq t)}{\Delta t}$$

For architectural decisions, competing risks include:

1. **Technology obsolescence:** The chosen technology loses community support.
2. **Requirements drift:** Business requirements evolve beyond what the decision supports.
3. **Scale invalidation:** The system outgrows the assumptions behind the decision.
4. **Security vulnerability:** A security flaw makes the chosen approach untenable.
5. **Team capability shift:** The team composition changes such that the technology no longer fits available expertise.

The cumulative incidence function (CIF) for each risk $j$ is:

$$F_j(t) = \int_0^t S(u^-) \, h_j(u) \, du$$

where $S(u^-)$ is the overall survival function. The key insight is that traditional Kaplan-Meier estimation is biased upward in the presence of competing risks; the CIF provides unbiased incidence estimates (Pintilie, 2006).

Caserta et al. (2015) applied competing risks analysis to COTS-based enterprise systems, distinguishing between client-error and vendor-error failures, demonstrating the methodology's applicability to software decision analysis.

**Strengths.** Provides principled time-to-event modeling; accommodates censoring (decisions still in effect); competing risks capture the multi-causal nature of decision invalidation; Weibull and Cox models are well-supported by standard statistical software.

**Limitations.** Requires historical data on decision lifetimes, which few organizations systematically collect; the exponential model's memoryless property is unrealistic for most decisions; competing risks models assume independence of risks, which may not hold (e.g., technology obsolescence and team capability shift are correlated).

---

## 3. Reflexion Models (Murphy, Notkin, Sullivan)

### 3.1 Formal Definition

The reflexion model was introduced by Murphy, Notkin, and Sullivan at FSE 1995 and elaborated in IEEE TSE 2001 (Vol. 27, pp. 364-380). The technique compares two structural models of a software system to reveal where they agree and disagree.

**Inputs:**

- **High-Level Model (HM):** An engineer-defined abstract model consisting of entities and relationships (e.g., a box-and-arrow diagram showing intended module dependencies). Formally, $HM = (E_H, R_H)$ where $E_H$ is a set of high-level entities and $R_H \subseteq E_H \times E_H$ is the set of intended relationships.

- **Source Model (SM):** A model automatically extracted from source code, typically a dependency graph. Formally, $SM = (E_S, R_S)$ where $E_S$ is the set of source-level entities (files, classes, functions) and $R_S \subseteq E_S \times E_S$ is the set of actual dependencies (calls, imports, inheritance).

- **Mapping (M):** A relation $M \subseteq E_S \times E_H$ that assigns source entities to high-level entities. This is defined by the engineer and can be many-to-one (multiple source files mapping to one high-level component).

**Computation.** The reflexion model $RM$ is computed by lifting the source model through the mapping:

1. For each pair $(e_i, e_j) \in E_H \times E_H$, compute $\hat{R}(e_i, e_j) = \{(s_a, s_b) \in R_S \mid M(s_a) = e_i \wedge M(s_b) = e_j\}$.
2. Compare $\hat{R}$ against $R_H$ to classify each high-level relationship.

**Classification into three categories:**

- **Convergence:** A relationship $(e_i, e_j) \in R_H$ and $\hat{R}(e_i, e_j) \neq \emptyset$. The intended dependency exists in both the high-level model and the source code. The architecture is being followed.

- **Divergence:** $\hat{R}(e_i, e_j) \neq \emptyset$ but $(e_i, e_j) \notin R_H$. Source-level dependencies exist that are not sanctioned by the high-level model. These represent architectural violations (unexpected couplings, layer breaches, circular dependencies).

- **Absence:** $(e_i, e_j) \in R_H$ but $\hat{R}(e_i, e_j) = \emptyset$. The high-level model specifies a dependency that does not exist in source code. This may indicate dead architecture, incomplete implementation, or an inaccurate high-level model.

### 3.2 Automated Conformance Checking

Several tools have operationalized reflexion models for continuous use:

- **SAVE (Software Architecture Visualization and Evaluation):** Implements the reflexion model technique with visualization of convergences, divergences, and absences.
- **Lattix LDM:** Uses Dependency Structure Matrices (DSM) as an alternative representation, where allowed vs. actual dependencies are compared.
- **Rulzor:** Fully automatic architectural conformance checking integrated with version control; analysis runs on each commit.
- **SEI Automated Design Conformance (2022):** The Carnegie Mellon SEI developed a prototype that checks architectural rules within CI pipelines, detecting nonconformances "within minutes, instead of the months or years it takes today."

Three main approaches exist for static conformance checking: Reflexion Models (RM), Source Code Query Languages (SCQL), and Dependency Structure Matrices (DSM). These can be combined for complementary coverage.

### 3.3 Extensions

- **Behavioral Reflexion Models** (Ackermann, 2009, NASA): Extended the structural reflexion model to state machine models, checking whether a hypothetical state machine corresponds to actual runtime behavior.
- **ReflexML** (Buckley et al., 2011): UML-based architecture-to-code traceability and consistency checking, extending reflexion models to richer architectural description languages.
- **Logic Meta-Programming:** De Roover et al. proposed encoding architectural rules as logic programs, automating conformance checking through Prolog-like queries over source code facts.

**Strengths.** Intuitive visual output; handles partial specifications (the engineer need not model everything); iterative refinement loop; well-suited to continuous integration.

**Limitations.** Requires manual creation of the high-level model and mapping; mapping maintenance is ongoing labor; only captures structural (dependency) conformance by default, not behavioral or quality properties; divergences may be false positives if the high-level model is incomplete.

---

## 4. Control Theory Applied to Software Governance

### 4.1 The Control Theory Analogy

Hellerstein, Diao, Parekh, and Tilbury (2004) provided the foundational treatment of feedback control for computing systems in their book "Feedback Control of Computing Systems" (Wiley). The core idea: treat a software governance system as a closed-loop controller where:

- **Plant:** The software development process (codebase evolving through commits)
- **Sensor:** Metrics extraction (violation counts, complexity scores, conformance ratios)
- **Controller:** The governance mechanism (code reviews, automated checks, ADR enforcement)
- **Actuator:** The actions taken (blocking merges, raising alerts, triggering refactoring)
- **Reference signal:** The desired state (target violation count, maximum coupling, conformance threshold)

The error signal $e(t) = r(t) - y(t)$ measures the gap between the desired architectural state $r(t)$ and the observed state $y(t)$.

### 4.2 Transfer Functions for Governance

In discrete time (indexed by commits or sprints), a governance system can be modeled as:

$$Y(z) = \frac{G(z) \cdot C(z)}{1 + G(z) \cdot C(z)} R(z) + \frac{1}{1 + G(z) \cdot C(z)} D(z)$$

where $G(z)$ is the plant transfer function (how development effort translates to metric changes), $C(z)$ is the controller transfer function (how governance responds to errors), $R(z)$ is the reference (target quality), and $D(z)$ is the disturbance (uncontrolled changes, new requirements, team turnover).

A PID controller in discrete form would be:

$$u(t) = K_p e(t) + K_i \sum_{\tau=0}^{t} e(\tau) + K_d [e(t) - e(t-1)]$$

where $u(t)$ is the governance intervention intensity, $K_p$ is the proportional gain (immediate response to current violations), $K_i$ is the integral gain (accumulated debt triggers escalating action), and $K_d$ is the derivative gain (rapid increase in violations triggers early warning).

### 4.3 Stability Analysis

A governance system is BIBO (Bounded-Input, Bounded-Output) stable if bounded disturbances produce bounded deviations from the target. Formally, stability requires all poles of the closed-loop transfer function $G(z)C(z)/(1 + G(z)C(z))$ to lie inside the unit circle in the $z$-plane.

Instability can manifest as:

- **Oscillation:** Over-aggressive governance ($K_p$ too high) causes developers to over-correct, then under-correct, creating quality oscillations between releases.
- **Drift:** Insufficient gain (all $K$ values too low) allows gradual degradation with no corrective action.
- **Overshoot:** Sudden enforcement of new rules causes a burst of refactoring that introduces new bugs, temporarily worsening the metric before improving it.

The steady-state error for a Type 0 system (no integrator) is $e_{ss} = r/(1 + K_p)$, meaning proportional-only governance always allows some residual drift. Adding integral action ($K_i > 0$) eliminates steady-state error but risks overshoot and oscillation if not properly tuned.

### 4.4 What the Analogy Buys Us

The control theory framing provides:

1. **Stability conditions:** Formal criteria (Routh-Hurwitz in continuous time, Jury test in discrete time) for determining whether a governance configuration will prevent runaway drift.
2. **Frequency-domain analysis:** Bode plots can characterize which "frequencies" of architectural change the governance system can respond to (e.g., can it catch sprint-level drift, or only release-level drift?).
3. **Gain margin and phase margin:** Quantify how much the governance can be tightened or loosened before instability occurs.
4. **Disturbance rejection:** Formal bounds on how much external disruption (team changes, requirement shifts) the governance can absorb without losing conformance.

**Strengths.** Provides rigorous stability guarantees; well-developed mathematical toolkit; natural framing for governance system design; connects to robust control theory for handling model uncertainty.

**Limitations.** Software development processes are highly nonlinear, making linear control models approximate at best; the plant model $G(z)$ is difficult to identify empirically; human factors (developer morale, cognitive load) are hard to model as transfer functions; assumes continuous, measurable outputs, while software quality is often discrete and noisy.

---

## 5. Statistical Process Control in Software Engineering

### 5.1 Control Charts for Software Metrics

Statistical Process Control (SPC) was developed by Walter Shewhart in the 1920s at Bell Labs. The fundamental idea is distinguishing between common-cause variation (inherent to the process) and special-cause variation (indicating a real change requiring action).

Three main chart families apply to software metrics:

**Shewhart Charts.** Plot individual observations or subgroup means with control limits at $\mu \pm L\sigma$ (typically $L = 3$ for 99.73% coverage). Decision rule: any point outside the control limits, or specific patterns (runs, trends), signal an out-of-control condition.

$$\text{UCL} = \bar{x} + 3\frac{\sigma}{\sqrt{n}}, \quad \text{LCL} = \bar{x} - 3\frac{\sigma}{\sqrt{n}}$$

**EWMA Charts.** The Exponentially Weighted Moving Average chart smooths observations with a forgetting factor $\lambda$:

$$z_t = \lambda x_t + (1 - \lambda) z_{t-1}, \quad z_0 = \mu_0$$

Control limits widen over time (accounting for variance accumulation) and stabilize:

$$\text{UCL}_t = \mu_0 + L\sigma \sqrt{\frac{\lambda}{2 - \lambda}\bigl[1 - (1-\lambda)^{2t}\bigr]}$$

$$\text{LCL}_t = \mu_0 - L\sigma \sqrt{\frac{\lambda}{2 - \lambda}\bigl[1 - (1-\lambda)^{2t}\bigr]}$$

Typical values: $\lambda = 0.2$, $L = 3$. EWMA is more sensitive to small, sustained shifts than Shewhart charts.

**CUSUM Charts.** As described in Section 1.1, CUSUM accumulates deviations and is optimal for detecting persistent mean shifts of known size.

### 5.2 In-Control vs. Out-of-Control

A process is "in control" when only common-cause variation is present; observed fluctuations are consistent with the established distribution. A process is "out of control" when special causes are acting, indicated by:

- A point beyond the $3\sigma$ control limits
- Eight consecutive points on one side of the center line (Western Electric rules)
- Six consecutive points trending upward or downward
- Systematic patterns (cycles, stratification)

For software metrics, "in control" means the development process is producing code of consistent quality. "Out of control" signals events like: a new team member introducing unfamiliar patterns, a dependency upgrade breaking assumptions, or an AI code generator changing its output distribution.

### 5.3 Choosing the Right Chart

| Chart Type | Best For | Sensitivity | Software Use Case |
|---|---|---|---|
| Shewhart | Large, sudden shifts (> $2\sigma$) | Low for small shifts | Build breakage, critical test failures |
| EWMA | Small, sustained shifts ($0.5{-}1.5\sigma$) | High with small $\lambda$ | Gradual complexity creep, coupling drift |
| CUSUM | Known-size persistent shifts | Highest for target shift | Conformance score degradation |

### 5.4 Application to AI-Generated Code Quality Monitoring

The rise of AI code generation (estimated at 41% of new code in some organizations) creates a pressing need for SPC-based monitoring. Key metrics suitable for control charting include:

- **Code churn rate:** Percentage of code rewritten within 14 days of generation. Reports indicate AI-generated code doubles churn rates relative to human code.
- **Defect density:** Defects per KLOC in AI-generated vs. human-generated code.
- **Cyclomatic complexity:** Mean complexity per function, tracked separately for AI and human contributions.
- **Test coverage delta:** Change in test coverage attributable to AI-generated code.

The SPC approach treats AI code generation as a manufacturing process with measurable quality characteristics. An EWMA chart on defect density with $\lambda = 0.2$ can detect a 15% increase in defect rate within 5-8 observations, providing early warning that the AI model's output quality has degraded (perhaps due to prompt drift, model updates, or context window limitations).

**The CMM Controversy.** The Software Engineering Institute's Capability Maturity Model (CMM, 1988) suggested SPC could apply to software processes, but this remains controversial. Software development is knowledge-intensive, non-repetitive work with inherent variation that cannot be fully eliminated. The counterargument is that while individual tasks vary, aggregate metrics (defect rates, complexity distributions) can exhibit statistical regularity amenable to SPC, especially when measured over sufficiently large time windows.

**Strengths.** Well-established theory with decades of manufacturing experience; visual and intuitive; strong distinction between common and special causes; applicable to any metric with sufficient data points; readily automatable in CI/CD pipelines.

**Limitations.** Assumes approximate normality and independence of observations (software metrics are often skewed and autocorrelated); requires a stable "Phase I" baseline period to estimate control limits; the $3\sigma$ convention is arbitrary for non-normal distributions; may generate excessive false alarms for highly variable processes.

---

## 6. Composing a Multi-Method Governance Framework

The five methods above are not alternatives but complementary layers that compose into a comprehensive architectural governance system:

### Layer 1: Structural Conformance (Reflexion Models)

At the foundation, reflexion models provide the ground truth comparison between intended and actual architecture. This is a point-in-time snapshot producing three sets: convergences (architecture being followed), divergences (violations), and absences (intended but missing dependencies). Run on every commit or PR via CI integration.

**Output:** A divergence count $d_t$ at each time step $t$.

### Layer 2: Trend Detection (SPC + Change-Point Detection)

Feed the divergence count series $\{d_1, d_2, \ldots, d_t\}$ into statistical monitors:

- **EWMA chart** for early detection of sustained quality shifts (small $\lambda$ for sensitivity).
- **CUSUM** for detecting drift toward a specific degradation threshold.
- **BOCPD** for identifying regime changes with full posterior uncertainty.

**Output:** Alarms when architectural conformance is degrading, with statistical confidence bounds.

### Layer 3: Decision Lifecycle Management (Survival Analysis)

Model each ADR as a survival subject. Track the hazard function based on:

- Time since decision
- Ecosystem events (major version releases of dependent technologies)
- Competing risks (obsolescence, requirements drift, scale invalidation)

Proactively surface decisions approaching their expected half-life for review.

**Output:** A decision health dashboard with estimated remaining validity and recommended review dates.

### Layer 4: Governance Stability (Control Theory)

Model the overall governance system as a feedback controller. Analyze:

- Is the governance gain sufficient to prevent steady-state drift?
- Is the response fast enough to catch sprint-level degradation?
- Are there oscillation risks from over-aggressive enforcement?

Tune the governance parameters (alert thresholds, review frequency, enforcement strictness) to maintain BIBO stability.

**Output:** Governance configuration recommendations and stability guarantees.

### Integration

Together, these layers form a closed-loop governance system:

```
Reference (ADRs) --> [Controller: Governance Rules] --> [Plant: Development Process]
                           ^                                     |
                           |                                     v
                     [SPC/BOCPD Alarms] <-- [Sensor: Reflexion Model + Metrics]
                           |
                     [Survival Model: Decision Health]
```

The reflexion model measures conformance. SPC and change-point detection identify when conformance is degrading. Survival analysis predicts when decisions themselves need renewal. Control theory ensures the governance system responding to all of this remains stable and effective.

---

## References

1. Page, E.S. (1954). "Continuous Inspection Schemes." *Biometrika*, 41(1/2), 100-115.
2. Adams, R.P. and MacKay, D.J.C. (2007). "Bayesian Online Changepoint Detection." arXiv:0710.3742.
3. Murphy, G.C., Notkin, D., and Sullivan, K. (1995). "Software Reflexion Models: Bridging the Gap between Source and High-Level Models." *Proc. FSE*, 18-28.
4. Murphy, G.C., Notkin, D., and Sullivan, K. (2001). "Software Reflexion Models: Bridging the Gap between Design and Implementation." *IEEE TSE*, 27(4), 364-380.
5. Hellerstein, J.L., Diao, Y., Parekh, S., and Tilbury, D.M. (2004). *Feedback Control of Computing Systems*. Wiley.
6. Fine, J.P. and Gray, R.J. (1999). "A Proportional Hazards Model for the Subdistribution of a Competing Risk." *JASA*, 94(446), 496-509.
7. Le, D.M., Carrillo, C., Capilla, R., and Medvidovic, N. (2018). "An Empirical Study of Architectural Decay in Open-Source Software." *IEEE SANER*.
8. Herraiz, I. et al. (2021). "Software Evolution: the Lifetime of Fine-Grained Elements." *PeerJ CS*, 7, e372.
9. Besker, T. et al. (2021). "Architectural Design Decisions that Incur Technical Debt: An Industrial Case Study." *JSS*, 180, 111021.
10. Caserta, P. et al. (2015). "Technical Debt and the Reliability of Enterprise Software Systems: A Competing Risks Analysis." *ResearchGate*.
11. Shewhart, W.A. (1931). *Economic Control of Quality of Manufactured Product*. Van Nostrand.
12. Roberts, S.W. (1959). "Control Chart Tests Based on Geometric Moving Averages." *Technometrics*, 1(3), 239-250.
13. SEI (2022). "Automated Design Conformance during Continuous Integration." Carnegie Mellon University.
14. NIST/SEMATECH. *e-Handbook of Statistical Methods*. Section 6.3.2.3.1: CUSUM Average Run Length.
15. Pintilie, M. (2006). *Competing Risks: A Practical Perspective*. Wiley.

---

## Sources

- [CUSUM Wikipedia](https://en.wikipedia.org/wiki/CUSUM)
- [NIST CUSUM ARL](https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc3231.htm)
- [Adams & MacKay BOCPD (arXiv)](https://arxiv.org/abs/0710.3742)
- [Gundersen BOCPD Tutorial](https://gregorygundersen.com/blog/2019/08/13/bocd/)
- [Murphy Reflexion Models (UBC)](https://www.cs.ubc.ca/~murphy/papers/rm/fse95.html)
- [Murphy et al. 2001 (IEEE Xplore)](https://ieeexplore.ieee.org/iel5/32/19823/00917525.pdf)
- [Hellerstein et al. Feedback Control of Computing Systems (Wiley)](https://onlinelibrary.wiley.com/doi/book/10.1002/047166880X)
- [Control Theory Applied to Computing (UMich)](https://www.eecs.umich.edu/courses/eecs571/reading/control-to-computer-zaher.pdf)
- [SEI Automated Design Conformance (2022)](https://insights.sei.cmu.edu/annual-reviews/2021-research-review/automated-design-conformance-during-continuous-integration/)
- [ASQ Statistical Process Control](https://asq.org/quality-resources/statistical-process-control)
- [EWMA Chart Wikipedia](https://en.wikipedia.org/wiki/EWMA_chart)
- [Le et al. Architectural Decay (IEEE)](https://ieeexplore.ieee.org/document/8417151/)
- [Herraiz et al. Software Evolution Lifetimes (PeerJ)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7959608/)
- [Competing Risks in Software (ResearchGate)](https://www.researchgate.net/publication/272349692_Technical_Debt_and_the_Reliability_of_Enterprise_Software_Systems_A_Competing_Risks_Analysis)
- [SPC for AI-Generated Code Quality](https://www.vibesparking.com/en/blog/ai/2026-02-13-statistical-process-control-ai-code-quality/)
- [State of CUSUM 70 Years After Page (Biometrika 2024)](https://academic.oup.com/biomet/article-abstract/111/2/367/7486557)
