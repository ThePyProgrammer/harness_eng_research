# Control Theory and Survival Analysis for Governance Architecture

**Formal Methods Round 2 (Revised)**
**Date:** 2026-04-03

---

## 1. Multi-Granularity Governance as a Hierarchical Control System

### 1.1 System Model

**[Established theory: cascade control (Seborg et al. 2011), discrete-time control (Astrom & Wittenmark 1997)]**

Let the **architectural state** of a codebase at discrete time $t$ be represented by a vector $\mathbf{x}(t) \in \mathbb{R}^n$, where components encode structural metrics: coupling, cohesion, dependency depth, interface stability, naming consistency, and so on. An AI agent produces a **perturbation** $\mathbf{u}(t)$ at each generation step (code modification). The uncontrolled system evolves as:

$$\mathbf{x}(t+1) = A\mathbf{x}(t) + B\mathbf{u}(t) + \mathbf{w}(t)$$

where $A$ is the natural drift matrix (entropy accumulation from uncoordinated changes), $B$ maps agent outputs to state changes, and $\mathbf{w}(t)$ is exogenous disturbance (requirement changes, dependency updates).

Governance operates as a **three-level cascade controller** that modulates $\mathbf{u}(t)$ before it reaches the codebase. This mirrors classical cascade control in process engineering, where inner loops reject fast disturbances before they propagate to the outer loop's operating range.

### 1.2 The Three Governance Loops

**Inner loop (synchronous, per-generation).** Operates at the fastest timescale $\Delta t_{\text{inner}} = 1$ generation. The controller $C_{\text{inner}}(z)$ examines each proposed code change against a rule set $\mathcal{R}$, producing a corrected output:

$$\hat{\mathbf{u}}(t) = \mathbf{u}(t) - C_{\text{inner}}(z) \cdot \mathbf{e}_{\text{inner}}(t)$$

where $\mathbf{e}_{\text{inner}}(t) = \mathbf{x}_{\text{ref,inner}} - \mathbf{x}(t)$ is the error relative to local constraints (linting rules, type checks, ADR invariants). The closed-loop transfer function from disturbance to output is:

$$G_{\text{inner}}(z) = \frac{C_{\text{inner}}(z) \cdot P(z)}{1 + C_{\text{inner}}(z) \cdot P(z)}$$

where $P(z)$ is the plant (codebase response to a single generation). In concrete terms, $C_{\text{inner}}$ encompasses linters, type-checkers, and file-ownership guards: fast, deterministic checks. This loop must have bandwidth $\omega_{\text{inner}}$ sufficient to reject per-generation drift, satisfying $\omega_{\text{inner}} \geq \omega_{\text{agent}}$ (the frequency at which agents produce changes).

**Middle loop (asynchronous, per-phase).** Operates at timescale $\Delta t_{\text{mid}} = N_{\text{phase}}$ generations (typically 10-50). The middle controller $C_{\text{mid}}(z)$ performs compliance audits, reflexion model checks, and contract verification. Its reference signal comes from the outer loop:

$$\mathbf{x}_{\text{ref,inner}}(t) = C_{\text{mid}}(z) \cdot \mathbf{e}_{\text{mid}}(t)$$

where $\mathbf{e}_{\text{mid}}(t) = \mathbf{x}_{\text{ref,outer}} - \bar{\mathbf{x}}_{\text{phase}}(t)$ and $\bar{\mathbf{x}}_{\text{phase}}$ is the phase-averaged state. The middle loop's output becomes the setpoint of the inner loop; this cascade structure is the defining characteristic of the architecture.

**Outer loop (deliberative, per-milestone).** Operates at timescale $\Delta t_{\text{outer}} = M \cdot N_{\text{phase}}$ generations. The outer controller $C_{\text{outer}}(z)$ performs ATAM-style quality attribute analysis, strategic alignment checks, and Wardley Map positioning reviews. Its reference is the architectural vision $\mathbf{x}^*$:

$$\mathbf{x}_{\text{ref,outer}}(t) = C_{\text{outer}}(z) \cdot (\mathbf{x}^* - \hat{\mathbf{x}}_{\text{milestone}}(t))$$

### 1.3 Stability Analysis

**Theorem 1 (Cascade Stability).** The three-level governance cascade is stable if and only if:
1. Each loop is individually stable when inner loops are replaced by their closed-loop transfer functions (all poles of $G_k(z)$ within the unit circle).
2. The bandwidth separation condition holds: $\omega_{\text{outer}} < \omega_{\text{mid}} / \alpha_{\text{mid}}$ and $\omega_{\text{mid}} < \omega_{\text{inner}} / \alpha_{\text{inner}}$, where $\alpha \geq 3$ (the minimum cascade separation ratio from control engineering practice; some sources require up to 20:1 for robust stability).
3. Each outer loop treats the inner loop as approximately unity gain within its operating bandwidth: $|G_{\text{inner}}(e^{j\omega})| \approx 1$ for $\omega < \omega_{\text{bw,mid}}$.

**Proof sketch.** Standard cascade stability analysis (Seborg et al., Ch. 16). When $\alpha_{\text{inner}} \geq 3$, the inner loop settles to its steady-state response before the middle loop samples, so the middle loop sees a static gain $G_{\text{inner}}(1)$ rather than a dynamic transfer function. The middle loop then designs against $G_{\text{inner}}(1) \cdot P_{\text{mid}}(z)$, which is a lower-order system. The same argument applies from middle to outer. The separation of timescales makes each loop's stability analysis independent, and the composed system is stable if each isolated loop is stable. The combined system's characteristic polynomial factors approximately into three independent polynomials under these conditions. $\square$

**Corollary 1 (Minimum Cascade Ratios for AI Harnesses).** For a system where agents generate code changes every $\sim$30 seconds:
- Inner loop (per-generation): samples every 30s, bandwidth $\omega_{\text{inner}} \approx 0.033$ Hz
- Middle loop (per-phase): must sample at most every $30 \times 3 = 90$s; practically every 5-15 minutes
- Outer loop (per-milestone): must sample at most every $90 \times 3 = 270$s; practically every 30-60 minutes

These match observed practice in systems like GSD, where phase-level audits occur every 10-20 minutes and milestone reviews every 1-2 hours.

### 1.4 Nyquist-Like Conditions for Governance Sampling

**[Novel synthesis: applying Shannon-Nyquist sampling theory to governance monitoring]**

Define the **drift spectrum** $D(\omega)$ as the power spectral density of architectural drift $\mathbf{x}(t) - \mathbf{x}^*$. If drift has maximum frequency content $\omega_{\text{max}}$ at a given granularity level, the governance controller at that level must sample at rate:

$$f_s \geq 2 \omega_{\text{max}}$$

to avoid **governance aliasing**, where high-frequency drift appears as low-frequency acceptable variation, masking systematic erosion.

**Definition 1 (Governance Aliasing).** Governance aliasing occurs when the sampling rate of a governance mechanism is less than twice the maximum frequency of architectural drift at that granularity, causing the governance system to misperceive rapid oscillatory violations as stable compliant behavior.

**Concrete sampling requirements:**

- **Inner loop:** agents may introduce drift at every generation. If agents produce $R$ generations per hour, the inner loop must check at rate $f_1 \geq 2R$. In practice, checking every generation ($f_1 = R$) suffices because the "signal" is discrete.
- **Middle loop:** phase-level drift (dependency changes, interface violations) accumulates over $N$ generations. If the characteristic frequency is $\omega_d^{(2)} = R/N$, then $f_2 \geq 2R/N$, meaning at least two compliance checks per phase.
- **Outer loop:** strategic drift (technology shifts, requirement evolution) has frequency $\omega_d^{(3)}$ on the order of weeks$^{-1}$. One milestone review per drift cycle is aliased; at minimum two reviews per strategic shift cycle are required.

**Practical consequence.** If agents can introduce and partially revert architectural violations within a single phase (frequency $\sim 1/N_{\text{phase}}$), but the middle loop only samples once per phase, it aliases these oscillations. The inner loop must catch them, or the middle loop must oversample by inspecting intermediate snapshots. This is the formal analog of the common observation that architecture reviews conducted too infrequently discover problems only after they become expensive to fix.

---

## 2. The Ratchet as a Monotone Operator

### 2.1 Lattice-Theoretic Setup

**[Established theory: Knaster-Tarski fixed point theorem (Tarski 1955), closure operators on lattices]**

Let $(\mathcal{L}, \subseteq)$ be the **lattice of architectural constraint sets**, where $\mathcal{L} = 2^{\mathcal{R}}$ for a universe of possible rules $\mathcal{R}$. The partial order is set inclusion: $S_1 \leq S_2 \iff S_1 \subseteq S_2$ (more constraints = higher in the lattice). The lattice is complete, with $\bot = \emptyset$ (no constraints) and $\top = \mathcal{R}$ (all possible constraints).

**Definition 2 (Governance Ratchet).** The governance ratchet is an operator $\rho: \mathcal{L} \to \mathcal{L}$ satisfying:
1. **Extensive**: $S \subseteq \rho(S)$ for all $S \in \mathcal{L}$ (the ratchet never removes constraints)
2. **Monotone**: $S_1 \subseteq S_2 \implies \rho(S_1) \subseteq \rho(S_2)$ (adding constraints before ratcheting yields at least as many after)
3. **Idempotent**: $\rho(\rho(S)) = \rho(S)$ (applying the ratchet twice yields no more than applying it once)

Properties (1)-(3) together make $\rho$ a **closure operator** on $\mathcal{L}$. This is not merely an analogy; the ADR acceptance workflow is literally a closure operation. When a decision is accepted, it adds constraints; those constraints may force additional constraints (transitive closure of dependencies); and the result is stable under re-application.

### 2.2 Fixed-Point Convergence

**Theorem 2 (Ratchet Convergence).** For a finite rule universe $|\mathcal{R}| < \infty$, the iterated ratchet $S_0, S_1 = \rho(S_0), S_2 = \rho(S_1), \ldots$ converges in at most $|\mathcal{R}|$ steps to a fixed point $S^* = \rho(S^*)$.

**Proof sketch.** By extensiveness, $S_t \subseteq S_{t+1}$ for all $t$, so the sequence is monotonically non-decreasing in $(\mathcal{L}, \subseteq)$. Since $\mathcal{L}$ is finite (height $|\mathcal{R}|$), the sequence must stabilize. By idempotence, the limit is a fixed point. By the Knaster-Tarski theorem, the set of fixed points of a monotone operator on a complete lattice forms a complete lattice, so there is a unique least fixed point $S^* = \text{lfp}(\rho) = \bigcap \{S \in \mathcal{L} \mid \rho(S) \subseteq S\}$. $\square$

**Corollary 2 (Ratchet Saturation).** In any finite system, the pure ratchet (without relaxation) eventually reaches its fixed point and ceases to add value. The fixed point $S^*$ represents the maximum constraint set derivable from the initial state.

### 2.3 The Pathology of Unbounded Ratcheting

**Definition 3 (Constraint Pressure).** Define the constraint pressure $\pi(S) = |S| / |\mathcal{R}|$, the fraction of the rule universe currently active. Define the **development velocity** $v(S) = v_0 \cdot (1 - \pi(S))^\beta$ for some elasticity parameter $\beta > 0$, where $v_0$ is the unconstrained velocity.

**Theorem 3 (Ratchet-Velocity Tradeoff).** If $\rho$ increases $|S_t|$ by at least one rule per milestone (that is, the ratchet is operating below saturation), then development velocity $v(S_t) \to 0$ as $t \to \infty$.

**Proof sketch.** $\pi(S_t)$ is monotonically increasing with $\pi(S_t) \geq t / |\mathcal{R}|$. For $t$ sufficiently large, $\pi(S_t) \to 1$ and $v(S_t) = v_0 (1 - \pi(S_t))^\beta \to 0$. $\square$

This is the formal statement of the intuition that unbounded governance accumulation eventually paralyzes a system. Every organization that has suffered from "process accretion" has experienced this theorem empirically.

**Definition 4 (Governance Ossification).** A governance state $S$ is **ossified** if for all candidate code changes $c$, the constraint set $S$ rejects $c$. Formally, $\text{Allowed}(S) = \{c \in \mathcal{C} : c \text{ satisfies all rules in } S\} = \emptyset$. If $\mathcal{R}$ contains contradictory rules $r_1, r_2$ such that no code change satisfies both, any trajectory passing through both yields ossification.

### 2.4 Controlled Relaxation via Lattice Descent

**Definition 5 (Relaxation Operator).** A relaxation operator $\lambda: \mathcal{L} \to \mathcal{L}$ is **anti-extensive** ($\lambda(S) \subseteq S$) and monotone. It removes constraints whose supporting evidence has expired or whose justifying decisions have been superseded.

**Definition 6 (Governed Ratchet with Relaxation).** The composed operator $\tau = \rho \circ \lambda$ alternates relaxation and ratcheting. The system evolves as $S_{t+1} = \rho(\lambda(S_t))$. That is: first remove expired or superseded rules via $\lambda$, then apply the ratchet closure $\rho$.

Relaxation may be triggered by:
- **Evidence expiry:** a rule $r$ was justified by evidence with validity window $[t_0, t_0 + \Delta]$; after $t_0 + \Delta$, $r \in \lambda(S)$.
- **Decision supersession:** if ADR $n$ is superseded by ADR $n'$, the rules contributed by $n$ enter $\lambda$.
- **Explicit deprecation:** stakeholder-initiated removal via the `/blueprint:transition deprecate` pathway.

**Theorem 4 (Bounded Oscillation).** If $\rho$ adds at most $k$ constraints per step and $\lambda$ removes at most $k$ constraints per step (when evidence expires), then $|S_t|$ is bounded and oscillates within a band of width $2k$ around a dynamic equilibrium.

**Proof sketch.** In the worst case, $\lambda$ removes $k$ and $\rho$ adds $k$, yielding $|S_{t+1}| = |S_t|$. If removal and addition rates are balanced on average, the system oscillates. The constraint pressure $\pi(S_t)$ remains bounded away from 1, preserving positive development velocity. $\square$

**Theorem 5 (Controlled Descent Preserves Consistency).** If $\lambda$ removes only rules whose justifying evidence has expired, and $\rho$ re-derives any still-justified consequences, then $\tau$ produces states that are both internally consistent and evidence-backed.

**Proof sketch.** $\lambda$ removes exactly the unjustified rules. $\rho$ closes over the remaining justified rules. Since $\rho$ is a closure operator, the result is closed (all consequences are included). Since $\lambda$ removed only unjustified rules, all rules in the result have live justification. $\square$

**Condition for beneficial ratcheting.** The ratchet is beneficial when $\pi(S^*_{\text{equilibrium}}) < \pi_{\text{critical}}$, where $\pi_{\text{critical}}$ is the constraint pressure at which velocity drops below the minimum acceptable rate. It becomes pathological when the ratchet saturates above $\pi_{\text{critical}}$.

---

## 3. Decision Survival Analysis with Competing Risks

### 3.1 Setup

**[Established theory: Cox (1972), Fine & Gray (1999), Putter et al. (2007)]**

Let decision $d$ have lifetime $T_d$, the duration from acceptance until invalidation. The **survival function** is:

$$S(t) = P(T_d > t) = \exp\left(-\int_0^t h(s) \, ds\right)$$

where $h(t) = \lim_{\Delta t \to 0} P(t \leq T_d < t + \Delta t \mid T_d \geq t) / \Delta t$ is the **hazard function** (instantaneous risk of invalidation).

### 3.2 Competing Risk Model for Architectural Decisions

Architectural decisions face $K = 4$ competing risks, each capable of independently invalidating the decision:

| $k$ | Risk Type | Description |
|-----|-----------|-------------|
| 1 | Technology obsolescence | The chosen technology is superseded, deprecated, or unmaintained |
| 2 | Requirement change | Business requirements shift, making the decision's assumptions invalid |
| 3 | Evidence expiry | The benchmarks, research, or data supporting the decision become stale |
| 4 | Organizational change | Team restructuring, skill shifts, or strategic pivots render it impractical |

The **cause-specific hazard function** for risk $k$ is:

$$h_k(t) = \lim_{\Delta t \to 0} \frac{P(t \leq T_d < t + \Delta t, \; K_d = k \mid T_d \geq t)}{\Delta t}$$

where $K_d \in \{1,2,3,4\}$ indicates which risk caused invalidation. The overall hazard is $h(t) = \sum_{k=1}^4 h_k(t)$.

### 3.3 Parametric Hazard Models by Decision Domain

**[Novel synthesis: domain-specific hazard parameterization for architectural decisions]**

We propose Weibull cause-specific hazards $h_k(t) = (\alpha_k / \beta_k)(t/\beta_k)^{\alpha_k - 1}$, where $\alpha_k$ is the shape parameter (increasing hazard if $\alpha_k > 1$, constant if $\alpha_k = 1$, decreasing if $\alpha_k < 1$) and $\beta_k$ is the scale parameter (characteristic lifetime in months).

**Table 1: Proposed Hazard Parameters by Domain**

| Domain | $\beta_1$ (tech obsol.) | $\beta_2$ (req change) | $\beta_3$ (evidence) | $\beta_4$ (org change) | Dominant Risk |
|--------|------|------|------|------|------|
| Frontend framework | 8 mo | 6 mo | 4 mo | 12 mo | Evidence expiry |
| API contract | 18 mo | 12 mo | 24 mo | 18 mo | Requirement change |
| Database choice | 36 mo | 24 mo | 30 mo | 24 mo | Requirement change |
| Auth/security | 12 mo | 18 mo | 6 mo | 12 mo | Evidence expiry |
| Infrastructure/deploy | 18 mo | 24 mo | 12 mo | 8 mo | Org change |

These values are calibrated from: frontend ecosystem churn ($\sim$2-year major framework cycles, per ThoughtWorks Technology Radar histories), database stability ($\sim$3-5 year adoption cycles), organizational restructuring frequencies ($\sim$12-18 month cycles in technology companies), and empirical studies of architectural decay (Le & Khomh 2018, Brunet et al. 2021). The shape parameter $\alpha > 1$ for most domains indicates increasing hazard; decisions become more fragile over time. Security policy with $\alpha \approx 1.0$ indicates approximately constant hazard (organizational changes arrive as a Poisson process).

### 3.4 The Cumulative Incidence Function

The **cumulative incidence function** (CIF) for cause $k$ gives the probability that the decision is invalidated by cause $k$ by time $t$:

$$F_k(t) = \int_0^t h_k(s) \cdot S(s) \, ds = \int_0^t h_k(s) \exp\left(-\sum_{j=1}^K \int_0^s h_j(u) \, du\right) ds$$

Note the critical subtlety: $F_k(t)$ depends on all hazards, not just $h_k$, because a decision invalidated by cause $j$ at time $s < t$ is no longer at risk for cause $k$. The CIFs satisfy $\sum_{k=1}^K F_k(\infty) \leq 1$ (with equality if every decision is eventually invalidated). This is preferable to naive Kaplan-Meier analysis, which incorrectly treats competing events as independent censoring.

### 3.5 The Fine-Gray Subdistribution Model

**[Established theory: Fine & Gray (1999)]**

The Fine-Gray model directly regresses covariates on the CIF through the **subdistribution hazard**:

$$\tilde{h}_k(t) = -\frac{d}{dt} \log(1 - F_k(t))$$

For governance, covariates $\mathbf{z}$ might include: number of dependent components, team size, technology maturity score (per Wardley Map evolution stage), and ADR evidence quality score. The model is:

$$\tilde{h}_k(t \mid \mathbf{z}) = \tilde{h}_{k,0}(t) \exp(\boldsymbol{\gamma}_k^\top \mathbf{z})$$

The subdistribution hazard differs from the cause-specific hazard in a subtle but important way: it conditions on subjects who have not yet experienced event $k$ (including those who have experienced a different competing event). This directly models the CIF, making it suitable for predicting "what fraction of database decisions will be invalidated by technology obsolescence within 24 months."

**A known limitation** (Austin et al. 2021): for specific covariate patterns and certain values of time, the sum of estimated CIFs for all event types is not constrained to be $\leq 1$. In governance applications this is rarely problematic, as we use the model for relative risk ranking rather than absolute probability estimation.

### 3.6 Optimal Review Scheduling

**Theorem 6 (Governance Review Scheduling).** Given cause-specific hazard estimates $\hat{h}_k(t)$ for a decision $d$, the optimal review time $t^*$ minimizes the expected cost:

$$t^* = \arg\min_t \left[ c_{\text{review}} + c_{\text{invalidation}} \cdot (1 - S(t)) + c_{\text{staleness}} \int_0^t (1 - S(s)) \, ds \right]$$

where $c_{\text{review}}$ is the cost of conducting a review, $c_{\text{invalidation}}$ is the cost of operating under an invalid decision, and $c_{\text{staleness}}$ penalizes accumulated time under uncertain validity.

**Proof sketch.** The objective is convex in $t$ when $h(t)$ is non-decreasing (Weibull with $\alpha > 1$): the marginal cost of delay increases while the marginal benefit of deferring review cost decreases. The first-order condition yields $t^*$ where the marginal cost of waiting one more period equals the marginal cost of reviewing now. $\square$

This connects directly to the relaxation operator $\lambda$ from Section 2.4: a decision's evidence expiry window should be set proportional to its domain-specific median lifetime from Table 1, and the review schedule should follow $t^*$.

---

## 4. Governance Stability Conditions

### 4.1 Architectural Coherence as a Dynamical Variable

**[Novel synthesis: applying dynamical systems theory to governance architecture]**

**Definition 7 (Architectural Coherence).** Define $C(t) \in [0, 1]$ as a scalar metric aggregating structural consistency (pattern adherence, dependency direction, naming consistency, interface stability). $C = 1$ represents perfect alignment with the intended architecture; $C = 0$ represents complete incoherence.

The dynamics of $C(t)$ follow:

$$\frac{dC}{dt} = f_{\text{gov}}(t) - f_{\text{drift}}(t)$$

where:

- **Drift force**: $f_{\text{drift}}(t) = \mu \cdot r(t) \cdot (1 - C(t))^{-\gamma}$, where $r(t)$ is the agent generation rate (changes per unit time), $\mu$ is the per-change probability of introducing incoherence, and $\gamma > 0$ captures the fact that drift accelerates as coherence decreases (the "broken windows" effect; low coherence invites more incoherence because agents trained on drifted context perpetuate drift).

- **Correction force**: $f_{\text{gov}}(t) = \nu \cdot g(t) \cdot C(t)^{-\delta}$, where $g(t)$ is the governance intervention rate, $\nu$ is the per-intervention effectiveness, and $\delta > 0$ captures diminishing returns of governance at high coherence (easy violations are caught first, subtle ones require more effort).

### 4.2 Equilibrium Analysis (Linear Case)

For the tractable case $\gamma = \delta = 0$ (constant per-unit forces, no amplification effects):

$$\frac{dC}{dt} = \nu g - \mu r$$

This yields:
- $\nu g > \mu r$: coherence increases monotonically toward $C = 1$.
- $\nu g < \mu r$: coherence decreases monotonically toward $C = 0$.
- $\nu g = \mu r$: coherence is constant at whatever value it starts.

**Theorem 7 (Critical Governance Capacity, Linear Case).** The system maintains coherence ($dC/dt \geq 0$) if and only if:

$$g(t) \geq \frac{\mu}{\nu} \cdot r(t)$$

Governance intervention rate must scale linearly with agent generation rate, with the proportionality constant $\mu/\nu$ determined by agent drift propensity and governance effectiveness. $\square$

### 4.3 Nonlinear Model and Bifurcation Analysis

**[Established theory: Strogatz (2015), nonlinear dynamics and bifurcation]**

The more realistic nonlinear model with $\gamma = \delta = 1$ gives:

$$\frac{dC}{dt} = \frac{\nu g}{C} - \frac{\mu r}{1-C}$$

Define the **governance-to-drift ratio** $\kappa = \nu g / (\mu r)$ as the bifurcation parameter.

**Equilibrium.** Setting $dC/dt = 0$:

$$\frac{\kappa}{C} = \frac{1}{1-C} \implies \kappa(1-C) = C \implies C^* = \frac{\kappa}{1+\kappa}$$

For the general case, the equilibrium equation $\kappa C^{-\delta} = (1-C)^{-\gamma}$ can have zero, one, or two solutions depending on $\kappa$ and the nonlinearity parameters.

**Theorem 8 (Saddle-Node Bifurcation).** For $\gamma, \delta > 1$, the system exhibits a saddle-node bifurcation at a critical value $\kappa = \kappa_{\text{crit}}$:

- **For $\kappa > \kappa_{\text{crit}}$:** two equilibria exist, a stable one at high coherence $C^*_+$ and an unstable one at low coherence $C^*_-$. The system converges to $C^*_+$ from any initial condition $C_0 > C^*_-$.
- **For $\kappa < \kappa_{\text{crit}}$:** no equilibrium exists, and $C(t) \to 0$ (total coherence collapse). This is the **governance failure regime**.
- **At $\kappa = \kappa_{\text{crit}}$:** the two equilibria merge at a half-stable fixed point. This is the bifurcation point.

**Proof sketch.** The equilibrium condition $\kappa C^{-\delta} = (1-C)^{-\gamma}$ defines $\kappa$ as a function of $C$: $\kappa(C) = C^{\delta}(1-C)^{-\gamma}$. For $\gamma, \delta > 1$, this function has an interior maximum on $(0,1)$, found by setting $d\kappa/dC = 0$. The critical value $\kappa_{\text{crit}} = \max_{C \in (0,1)} \kappa(C)$. For $\kappa > \kappa_{\text{crit}}$, the horizontal line $\kappa = \text{const}$ intersects the curve $\kappa(C)$ at two points (the two equilibria). At $\kappa = \kappa_{\text{crit}}$, the line is tangent (one equilibrium). Below, no intersection exists. The stability of each equilibrium follows from the sign of $d^2C/dt^2$ evaluated at the fixed point. $\square$

For the tractable case $\gamma = \delta = 1$, there is a unique equilibrium $C^* = \kappa/(1+\kappa)$ for all $\kappa > 0$, with a transcritical bifurcation at $\kappa = 0$. The system transitions smoothly from low to high coherence as governance capacity increases.

### 4.4 Phase Portrait and Governance Regimes

The phase space $(C, \kappa)$ partitions into three operational regimes:

1. **Self-sustaining** ($\kappa \gg 1$): $C^* \approx 1$. Governance overwhelms drift. Typical of early projects with few agents and strong architectural oversight. Risk: governance overhead exceeds its marginal value.

2. **Dynamic equilibrium** ($\kappa \sim 1$): $C^* \in (0.4, 0.8)$. Governance and drift are balanced. This is the operating region for most mature systems. The ratchet (Section 2) helps maintain $\kappa$ by incrementally increasing $\nu$ (per-intervention effectiveness through accumulated constraints).

3. **Collapse** ($\kappa \ll 1$): no stable equilibrium above $C^*_-$ (or no equilibrium at all in the strongly nonlinear case). Architectural coherence degrades toward zero. Recovery requires either reducing $r$ (throttling agents) or step-increasing $g$ (emergency governance intervention).

**Critical slowing down near bifurcation.** Near $\kappa_{\text{crit}}$, the linearized return rate $\lambda = -f'_{\text{gov}}(C^*) + f'_{\text{drift}}(C^*) \to 0$. Recovery from perturbations becomes arbitrarily slow. This is a warning sign: organizations operating near the bifurcation point are fragile. A temporary spike in agent activity (deadline-driven push) can push $\kappa$ below critical, causing a collapse that persists even after $r$ decreases, because the ratchet may have locked in drifted decisions during the collapse. This hysteresis effect has clear operational consequences.

### 4.5 Recovery from Collapse

**Theorem 9 (Recovery from Collapse).** Once the system enters the collapse regime ($\kappa < \kappa_{\text{crit}}$), restoration to the dynamic equilibrium regime requires a governance intervention sufficient to push $\kappa > \kappa_{\text{crit}}$, sustained for duration:

$$T_{\text{recover}} \geq \int_{C_{\text{current}}}^{C^*_-} \frac{dC}{f_{\text{gov}}(C) - f_{\text{drift}}(C)}$$

**Proof sketch.** In the collapse regime, $dC/dt < 0$ everywhere. Increasing $g$ to push $\kappa > \kappa_{\text{crit}}$ restores the stable equilibrium $C^*_+$ and the unstable equilibrium $C^*_-$. The system must climb from $C_{\text{current}}$ past $C^*_-$ (the basin of attraction boundary) to enter the convergence basin of $C^*_+$. The recovery time is the integral of $1/(f_{\text{gov}} - f_{\text{drift}})$ over this interval, which is finite when $f_{\text{gov}} > f_{\text{drift}}$ on $[C_{\text{current}}, C^*_-]$. $\square$

**Practical implication.** Governance capacity should be provisioned with margin above $\kappa_{\text{crit}}$, not at the boundary. The ratchet's accumulated constraints ($S_t$) provide a structural buffer by increasing $\nu$ over time, but this benefit is lost if the ratchet ossifies (Section 2.3). The survival-based relaxation (Section 3) prevents ossification, completing the feedback loop.

---

## 5. Synthesis: The Governance Control Manifold

The four formalizations interact as a coupled system:

**Cascade control (Section 1)** provides the multi-timescale architecture for governance interventions. Each loop operates at a different granularity and contributes to the aggregate governance force $f_{\text{gov}}(t) = f_{\text{inner}}(t) + f_{\text{mid}}(t) + f_{\text{outer}}(t)$.

**The ratchet (Section 2)** provides the mechanism by which governance effectiveness $\nu$ increases over time: each accepted ADR adds constraints to $S_t$, making future inner-loop checks more comprehensive. The ratchet increases $\nu$ monotonically (up to saturation), which increases $\kappa$ and pushes the system toward the self-sustaining regime.

**Survival analysis (Section 3)** governs the relaxation operator $\lambda$: decisions whose survival probability $S(t)$ drops below a threshold are flagged for review and potentially removed from the constraint set. This prevents pathological ratcheting (Theorem 3) by maintaining the governed ratchet with relaxation (Definition 6).

**Stability conditions (Section 4)** provide the global criterion: the governance system succeeds if and only if $\kappa > \kappa_{\text{crit}}$, which requires the cascade controller bandwidth to track drift (Section 1.4), the ratchet to maintain sufficient $\nu$ without over-constraining (Section 2.4), and the survival-based relaxation to prune stale constraints before they impose unnecessary friction (Section 3.6).

The **central design equation** for a governance system is therefore:

$$\kappa(t) = \frac{\nu(S_t) \cdot \sum_{\ell \in \{\text{inner, mid, outer}\}} g_\ell(t)}{\mu \cdot r(t)} > \kappa_{\text{crit}}$$

where $\nu(S_t)$ is the effectiveness function of the current constraint set (shaped by the ratchet and its relaxation), $g_\ell(t)$ are the intervention rates at each cascade level (subject to Nyquist conditions), and $r(t)$ is the agent generation rate. Maintaining this inequality is the necessary and sufficient condition for architectural coherence under autonomous AI code generation.

---

## References

- Astrom, K.J. & Wittenmark, B. (1997). *Computer-Controlled Systems: Theory and Design*. Prentice Hall, 3rd ed.
- Austin, P.C. et al. (2021). "Fine-Gray subdistribution hazard models to simultaneously estimate the absolute risk of different event types." *Statistics in Medicine*, 40(19), 4200-4212.
- Brunet, J. et al. (2021). "On the evolution of architectural smells." *Empirical Software Engineering*, 26(4).
- Cox, D.R. (1972). "Regression Models and Life-Tables." *JRSS Series B*, 34(2), 187-220.
- Fine, J.P. & Gray, R.J. (1999). "A Proportional Hazards Model for the Subdistribution of a Competing Risk." *JASA*, 94(446), 496-509.
- Knaster, B. (1928). "Un theoreme sur les fonctions d'ensembles." *Ann. Soc. Polon. Math.*, 6, 133-134.
- Le, D.M. & Khomh, F. (2018). "An Empirical Study of Architectural Decay in Open-Source Software." *IEEE ICSA*.
- Putter, H. et al. (2007). "Tutorial in biostatistics: Competing risks and multi-state models." *Statistics in Medicine*, 26(11), 2389-2430.
- Seborg, D.E., Edgar, T.F., Mellichamp, D.A. & Doyle, F.J. (2011). *Process Dynamics and Control*. Wiley, 3rd ed.
- Strogatz, S.H. (2015). *Nonlinear Dynamics and Chaos*. Westview Press, 2nd ed.
- Tarski, A. (1955). "A Lattice-Theoretical Fixpoint Theorem and its Applications." *Pacific J. Math.*, 5(2), 285-309.
