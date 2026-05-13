# Coordination Architecture: Metrics, Empirical Calibration, and Verification

**Formal Development Round 3**
**Date:** 2026-04-03

---

## 1. Empirical Calibration Table

All quantitative parameters extracted from the research corpus are collected here with source attribution, sample characteristics, confidence intervals (where available), and applicability conditions. Parameters are grouped by the phenomenon they characterize.

### 1.1 Error Amplification Parameters

| Parameter | Value | 95% CI | Source | Sample | Conditions |
|-----------|-------|--------|--------|--------|------------|
| $A_e$ (Independent MAS) | 17.2x | [14.3, 20.1] | Kim et al. (2025) | 180 configs, 5 architectures, 3 LLM families, 4 benchmarks | Agents share no state; no error-correction mechanism; standardized tool/prompt budgets |
| $A_e$ (Centralized MAS) | 4.4x | [3.8, 5.0] | Kim et al. (2025) | Same as above | Hub coordinator routes all communication; 285% token overhead |
| $A_e$ (Decentralized MAS) | 7.8x | Not reported | Kim et al. (2025) | Same as above | Peer-to-peer communication; 263% overhead |
| $A_e$ (Hybrid MAS) | 5.1x | Not reported | Kim et al. (2025) | Same as above | Combined centralized + decentralized; 515% overhead |
| Bug multiplier (merge conflict code) | 2x | Not reported | Lesenich et al. (2017), via R3 | Multi-project empirical study | Code associated with any merge conflict |
| Bug multiplier (manual merge resolution) | 26x | Not reported | Lesenich et al. (2017), via R3 | Same study | Code requiring manual human intervention to resolve conflict |

### 1.2 Capability Saturation Parameters

| Parameter | Value | p-value | Source | Conditions |
|-----------|-------|---------|--------|------------|
| $\beta_{P_{SA} \times \log(1+n_a)}$ | -0.408 | $< 0.001$ | Kim et al. (2025) | Mixed-effects regression, 20 predictors |
| Saturation threshold $P_{SA}^*$ | ~0.45 (45%) | Derived | Kim et al. (2025) | Point where $\partial P / \partial n_a < 0$ |
| Model $R^2_{CV}$ | 0.513 | -- | Kim et al. (2025) | 5-fold cross-validation |
| Architecture prediction accuracy | 87% | -- | Kim et al. (2025) | Held-out configurations |
| Leave-one-domain-out $R^2$ | 0.89 | -- | Kim et al. (2025) | Domain generalization test |
| Out-of-sample MAE (GPT-5.2) | 0.071 | -- | Kim et al. (2025) | Temporal out-of-sample validation |

### 1.3 Merge Conflict Rate Parameters

| Parameter | Value / Range | Source | Sample | Conditions |
|-----------|---------------|--------|--------|------------|
| Textual conflict rate (baseline) | ~17-20% of merges | Brun et al. (2011); Ghiotto et al. (2018) | 3.4M LOC / 550K versions; 2,731 Java projects | Open-source projects, branch-based workflows |
| Project-level conflict range | 7.6-19.3% | Kasi & Sarma (2013) | Multiple OSS projects | Varies by project coupling density |
| Build conflict rate | 1-10% | Brun et al. (2011) | 9 projects | Additional to textual conflicts |
| Trivial resolution fraction | 75% | Ghiotto et al. (2018) | 2,731 Java projects | Resolved by choosing one version |
| Genuine integration fraction | 25% | Ghiotto et al. (2018) | Same | Requires synthesizing both changes |

### 1.4 Constraint Enforcement Parameters

| Parameter | Value | Source | Conditions |
|-----------|-------|--------|------------|
| Prompt-based constraint violation rate | ~72% | Prompt Flow Integrity study (R5) | ReAct agent on AgentDojo; no structural enforcement |
| Structural enforcement success (AgentSpec) | 90%+ | AgentSpec, ICSE 2026 (R5) | Runtime enforcement; millisecond overhead |
| Structural enforcement success (Progent) | 100% (attack prevention) | Progent (R5) | Tool-level privilege control |
| IntelliMerge precision | 88.48% | Shen et al. (2019), via R3 | Java; refactoring-aware merge |
| IntelliMerge recall | 90.22% | Shen et al. (2019), via R3 | Same |
| JDime conflict reduction | 39% | Apel et al. (2012), via R3 | Structured vs. textual merge, Java |
| IntelliMerge conflict reduction vs. git | 58.90% | Shen et al. (2019), via R3 | Compared to GitMerge |

### 1.5 Throughput and Productivity Parameters

| Parameter | Value | Source | Sample | Conditions |
|-----------|-------|--------|--------|------------|
| Parallel throughput multiplier | 2.2x | M1-Parallel (academic) | Sequential multi-step tasks | With early termination; accuracy preserved |
| Practitioner-reported throughput | ~3x | Osmani (R5) | Anecdotal | 3 focused agents vs. 1 generalist |
| DORA: tasks completed / developer | +21% | DORA 2025 | ~5,000 professionals | AI-assisted (any tool) |
| DORA: PRs merged | +98% | DORA 2025 + Faros AI | 10,000+ developers | Objective telemetry |
| DORA: code review time | +91% | DORA 2025 + Faros AI | Same | Downstream cost of larger PRs |
| DORA: PR size | +154% | DORA 2025 + Faros AI | Same | AI-generated code is bulkier |
| DORA: bug rate | +9% | DORA 2025 + Faros AI | Same | Absolute bug count increase |
| DORA: org delivery metrics | Flat | DORA 2025 | Same | Despite individual gains |
| Optimal agent team size | 3-5 | Osmani (R5) | Practitioner consensus | Beyond this, coordination overhead dominates |

### 1.6 Communication Scaling Parameters

| Parameter | Value | Source | Conditions |
|-----------|-------|--------|------------|
| Turn count power law | $T = 2.72 \cdot (n + 0.5)^{1.724}$ | Kim et al. (2025) | $R^2 = 0.974$; exponent significantly super-linear ($p < 0.001$) |
| Coordination overhead (Independent) | 58% | Kim et al. (2025) | Token consumption increase |
| Coordination overhead (Centralized) | 285% | Kim et al. (2025) | Token consumption increase |
| Coordination overhead (Decentralized) | 263% | Kim et al. (2025) | Token consumption increase |
| Coordination overhead (Hybrid) | 515% | Kim et al. (2025) | Token consumption increase |

---

## 2. Coupling Density Dynamics

### 2.1 Definitions

Let $G = (V, E)$ be the file dependency graph of a codebase, where $V$ is the set of source files and $E$ is the set of coupling edges (structural, co-change, or semantic). Define the **coupling density**:

$$\rho(G) = \frac{|E|}{|V|}$$

This is the average degree divided by 2 for undirected graphs, or equivalently the mean number of coupling relationships per file. For a partition $\mathcal{P} = \{T_1, \ldots, T_k\}$ of $V$, define the **inter-partition coupling density**:

$$\rho_{\text{inter}}(\mathcal{P}) = \frac{|\{(u, v) \in E : u \in T_i, v \in T_j, i \neq j\}|}{|V|}$$

A partition is effective for multi-agent coordination when $\rho_{\text{inter}}$ is small relative to $\rho(G)$. Define the **coupling containment ratio**:

$$\gamma(\mathcal{P}) = 1 - \frac{\rho_{\text{inter}}(\mathcal{P})}{\rho(G)}$$

where $\gamma = 1$ means all coupling is intra-partition (perfect isolation) and $\gamma = 0$ means all coupling crosses partition boundaries (worst case).

### 2.2 Stochastic Evolution Model

Software systems grow and accumulate coupling over time. Lehman's Laws of Software Evolution (Lehman, 1980; Lehman & Ramil, 2003) establish empirically that:

- **Law of Continuing Change:** A system must be continually adapted or it becomes progressively less satisfactory.
- **Law of Increasing Complexity:** As a system evolves, its complexity increases unless work is done to maintain or reduce it.

Model $\rho(G_t)$ as a stochastic process indexed by development time $t$ (measured in commits or calendar weeks):

$$\rho(G_{t+1}) = \rho(G_t) + \alpha \cdot \Delta F_t - \beta \cdot R_t + \xi_t$$

where:
- $\alpha > 0$ is the coupling growth rate per new feature ($\Delta F_t$ = features added at time $t$)
- $\beta > 0$ is the coupling reduction rate from refactoring ($R_t$ = refactoring effort at time $t$)
- $\xi_t \sim \mathcal{N}(0, \sigma^2)$ is a noise term capturing stochastic coupling evolution

Empirical estimates from software evolution studies suggest:
- $\alpha \approx 0.02\text{--}0.05$ edges per file per feature (Gall et al., 1998; D'Ambros et al., 2009)
- $\beta$ is highly project-dependent; active refactoring can achieve $\beta \approx \alpha$, but most projects exhibit $\beta < 0.5\alpha$ (Lehman & Ramil, 2003)
- Without active refactoring, $\rho(G_t)$ grows approximately linearly in $t$

### 2.3 Partition Half-Life

Define the **partition half-life** $\tau_{1/2}$ as the expected time before a partition's inter-partition coupling exceeds a critical threshold $\rho_{\text{inter}}^*$:

$$\tau_{1/2} = \inf\{t : \rho_{\text{inter}}(\mathcal{P}, G_t) > \rho_{\text{inter}}^*\}$$

If coupling grows linearly at rate $\dot{\rho} = \alpha \cdot \bar{F} - \beta \cdot \bar{R}$ (where $\bar{F}$ and $\bar{R}$ are mean feature and refactoring rates), and new coupling crosses partition boundaries with probability $p_{\text{cross}} = 1 - \gamma(\mathcal{P})$, then:

$$\mathbb{E}[\tau_{1/2}] \approx \frac{\rho_{\text{inter}}^* - \rho_{\text{inter}}(t_0)}{\dot{\rho} \cdot p_{\text{cross}}}$$

For a well-partitioned codebase ($\gamma = 0.8$, so $p_{\text{cross}} = 0.2$), with $\dot{\rho} \approx 0.01$ edges/file/week and a threshold of $\rho_{\text{inter}}^* = 0.5$, starting from $\rho_{\text{inter}}(t_0) = 0.1$:

$$\mathbb{E}[\tau_{1/2}] \approx \frac{0.5 - 0.1}{0.01 \cdot 0.2} = 200 \text{ weeks}$$

For a poorly-partitioned codebase ($\gamma = 0.4$, $p_{\text{cross}} = 0.6$):

$$\mathbb{E}[\tau_{1/2}] \approx \frac{0.4}{0.01 \cdot 0.6} \approx 67 \text{ weeks}$$

This implies that task decompositions must be recomputed on the order of every 1--4 years for well-partitioned systems, but potentially every few months for poorly-partitioned ones. METIS runs in $O(|E|)$ time, so re-partitioning is computationally cheap; the real cost is reassigning agent workflows.

---

## 3. Throughput Model

### 3.1 Definitions and Units

| Symbol | Definition | Unit |
|--------|-----------|------|
| $\Theta$ | Effective throughput | features / wall-clock-hour |
| $k$ | Number of parallel agents | dimensionless |
| $p_{\text{single}}$ | Single-agent feature completion probability per cycle | dimensionless, $\in [0,1]$ |
| $t_{\text{cycle}}$ | Time for one agent to complete one development cycle | hours |
| $t_{\text{merge}}(k)$ | Merge and integration time for $k$ agent outputs | hours |
| $R(k)$ | Reliability factor: probability all $k$ outputs are conflict-free | dimensionless, $\in [0,1]$ |
| $q(k)$ | Quality factor: fraction of features without defects | dimensionless, $\in [0,1]$ |

### 3.2 Sequential Throughput

A single agent completes features at rate:

$$\Theta_{\text{seq}} = \frac{p_{\text{single}} \cdot q(1)}{t_{\text{cycle}}}$$

There is no merge cost and no coordination overhead. Quality factor $q(1)$ represents the single-agent defect-free rate.

### 3.3 Parallel Throughput

For $k$ agents working in parallel on decomposed sub-tasks:

$$\Theta_{\text{par}}(k) = \frac{k \cdot p_{\text{single}} \cdot R(k) \cdot q(k)}{t_{\text{cycle}} + t_{\text{merge}}(k)}$$

where:
- $R(k)$ captures the probability that all outputs merge without conflict. Using the pairwise conflict model from R3: $R(k) = \prod_{i < j} (1 - p_{\text{conflict}}^{(ij)})$. For uniform pairwise conflict probability $p_c$: $R(k) = (1 - p_c)^{\binom{k}{2}}$
- $q(k)$ captures quality degradation from parallelism (calibrated in Section 5)
- $t_{\text{merge}}(k)$ is the integration cost, which grows with $k$

### 3.4 Merge Cost Model

Based on the empirical data, model merge cost as:

$$t_{\text{merge}}(k) = t_0 + t_1 \cdot \binom{k}{2}$$

where $t_0$ is the fixed overhead of the merge pipeline and $t_1$ is the per-pair merge cost. The $\binom{k}{2}$ term reflects pairwise compatibility checking. For structured merge tools with $O(1)$ per-pair cost (GumTree at 20--74ms), $t_1$ is small. For semantic verification (SafeMerge), $t_1$ is larger.

### 3.5 Crossover Analysis

The crossover point where $\Theta_{\text{par}}(k) > \Theta_{\text{seq}}$ occurs when:

$$\frac{k \cdot R(k) \cdot q(k)}{t_{\text{cycle}} + t_{\text{merge}}(k)} > \frac{q(1)}{t_{\text{cycle}}}$$

Rearranging:

$$k \cdot R(k) \cdot \frac{q(k)}{q(1)} > 1 + \frac{t_{\text{merge}}(k)}{t_{\text{cycle}}}$$

Define the **quality-adjusted parallelism gain** $G(k) = k \cdot R(k) \cdot q(k) / q(1)$ and the **merge overhead ratio** $M(k) = t_{\text{merge}}(k) / t_{\text{cycle}}$. Then the crossover condition is:

$$G(k) > 1 + M(k)$$

### 3.6 Sensitivity Analysis

**Sensitivity to $t_{\text{merge}}$:** For fixed $k = 3$, $p_c = 0.15$ (mid-range from Kasi & Sarma), and $q(k)/q(1) = 0.95$:

- $R(3) = (1 - 0.15)^3 = 0.614$
- $G(3) = 3 \times 0.614 \times 0.95 = 1.750$

Crossover requires $M(3) < 0.750$, meaning merge time must be less than 75% of cycle time. If $t_{\text{cycle}} = 2$ hours, merge must complete in under 1.5 hours.

**Sensitivity to $R(k)$:** For $k = 5$ and $p_c = 0.10$:

- $R(5) = (1 - 0.10)^{10} = 0.349$
- $G(5) = 5 \times 0.349 \times 0.95 = 1.658$

Even with 5 agents, the gain is modest because the conflict probability across $\binom{5}{2} = 10$ pairs substantially erodes throughput. At $p_c = 0.20$: $R(5) = (1 - 0.20)^{10} = 0.107$, yielding $G(5) = 0.508$, which is below 1 regardless of merge cost. **Five agents with 20% pairwise conflict probability are slower than one agent.**

This result is consistent with Kim et al.'s finding that the optimal agent count is 3--4 and with Osmani's 3--5 recommendation.

---

## 4. Quality-Adjusted Speedup Metric

### 4.1 Definition

Standard speedup $S(k) = \Theta_{\text{par}}(k) / \Theta_{\text{seq}}$ does not account for the quality cost of parallelism. Define the **Quality-Adjusted Speedup**:

$$\text{QAS}(k) = S(k) \cdot \frac{1 - d(k)}{1 - d(1)}$$

where $d(k)$ is the defect rate when using $k$ agents and $d(1)$ is the single-agent defect rate. This normalizes speedup by the relative quality: if parallelism introduces more defects, the speedup is penalized.

Equivalently:

$$\text{QAS}(k) = \frac{\Theta_{\text{par}}(k)}{\Theta_{\text{seq}}} \cdot \frac{1 - d(k)}{1 - d(1)}$$

### 4.2 QAS < 1: When Parallelism Is Net Negative

$\text{QAS}(k) < 1$ when the quality penalty outweighs the throughput gain. This occurs when:

$$S(k) < \frac{1 - d(1)}{1 - d(k)}$$

If $d(1) = 0.10$ (single-agent defect rate) and $d(k) = 0.35$ (multi-agent defect rate with poor coordination), then the quality ratio is $0.90 / 0.65 = 1.385$, meaning speedup must exceed 1.385x just to break even. Any coordination scenario yielding $S(k) < 1.385$ is net negative.

### 4.3 Calibration with DORA Data

The DORA 2025 data provides a partial calibration:

- PRs merged increased by 98% (roughly $S \approx 2.0$ in throughput terms)
- Bug rate increased by 9%, but PR volume nearly doubled

To estimate the per-unit defect rate change: if PRs doubled and total bugs increased by 9%, then per-PR bug rate decreased slightly. Let $B_0$ be the original bug rate per PR. After AI adoption:

$$B_{\text{AI}} = \frac{1.09 \cdot B_0 \cdot N}{1.98 \cdot N} = 0.551 \cdot B_0$$

So per-PR defect rate actually improved by ~45%. However, the DORA data also shows review time increased 91% and PR size increased 154%. The downstream cost is not captured in raw defect counts but in review burden and maintenance complexity.

For the QAS calculation using DORA aggregate numbers (treating AI-assisted development as a form of agent parallelism):

$$\text{QAS}_{\text{DORA}} = 1.98 \times \frac{1 - 1.09 \cdot d_0}{1 - d_0}$$

For $d_0 = 0.05$ (baseline 5% defect rate per PR):

$$\text{QAS}_{\text{DORA}} = 1.98 \times \frac{1 - 0.0545}{1 - 0.05} = 1.98 \times \frac{0.9455}{0.95} = 1.98 \times 0.9953 = 1.971$$

This suggests QAS is close to raw speedup when per-PR quality is maintained. The paradox is that organizational delivery metrics remain flat (DORA reports no improvement), implying that other bottlenecks (review, integration, testing) absorb the throughput gains.

### 4.4 Calibration with Kim et al. Data

For the independent architecture ($A_e = 17.2$, meaning error rate is 17.2x the single-agent rate):

If $d(1) = 0.20$ (single-agent error rate on benchmark tasks), then $d(k)_{\text{independent}} = \min(1, 17.2 \times 0.20) = 1.0$ (saturated). This yields:

$$\text{QAS}_{\text{independent}} = S(k) \times \frac{1 - 1.0}{1 - 0.20} = 0$$

Independent multi-agent systems with high error amplification produce zero quality-adjusted value. This is consistent with Kim et al.'s finding that independent agents degrade performance on non-parallelizable tasks by 39--70%.

For the centralized architecture ($A_e = 4.4$):

$$d(k)_{\text{centralized}} = \min(1, 4.4 \times 0.20) = 0.88$$

$$\text{QAS}_{\text{centralized}} = S(k) \times \frac{1 - 0.88}{1 - 0.20} = S(k) \times 0.15$$

Even with the best coordination topology, $S(k)$ must exceed $1 / 0.15 = 6.67$ for QAS to reach 1.0. This is infeasible for small $k$, confirming that multi-agent coordination is only valuable when the task is highly parallelizable (Kim et al.'s +80.8% on Finance-Agent) and error amplification is controlled.

### 4.5 The QAS Surface

QAS is a function of both $k$ and the coordination quality parameter $\alpha_{\text{coord}} \in [0, 1]$ (where 0 = no coordination, 1 = perfect coordination):

$$d(k, \alpha_{\text{coord}}) = d(1) \cdot (1 + A_e(\alpha_{\text{coord}}) \cdot (k - 1) / k)$$

$$A_e(\alpha_{\text{coord}}) = A_{\max} \cdot (1 - \alpha_{\text{coord}})$$

where $A_{\max} = 17.2$ (independent) and perfect coordination yields $A_e = 0$. The QAS surface has a ridge along the $\alpha_{\text{coord}}$ axis: only systems with sufficiently high coordination quality achieve QAS > 1 at any $k > 1$.

---

## 5. Verification Roadmap

Each formal result in the paper falls into one of three epistemic categories: **(a) grounded** in existing empirical data, **(b) theoretical prediction** awaiting validation, or **(c) novel synthesis** of existing theory applied to a new domain. The table below classifies every major result and specifies what evidence would verify or falsify it.

### 5.1 Classification of Results

| Result | Category | Grounding | Verification / Falsification |
|--------|----------|-----------|------------------------------|
| Error amplification factors (17.2x, 4.4x) | (a) Grounded | Kim et al. (2025), 180 configs | Replicate on code-generation benchmarks (SWE-Bench, HumanEval); if $A_e$ differs by >2x, the generalization fails |
| Capability saturation at 45% | (a) Grounded | Kim et al. regression model | Test on coding tasks: measure $\partial P / \partial n_a$ as a function of $P_{SA}$; threshold may shift for code |
| Merge conflict rates 7.6--19.3% | (a) Grounded | Kasi & Sarma (2013), Ghiotto (2018) | Measure conflict rates for agent-generated (not human-authored) parallel changes; rates may differ due to boilerplate overlap |
| 26x bug multiplier for manual merge | (a) Grounded | Lesenich et al. (2017) | Replicate in AI-agent context; may be lower if agents produce more structured code |
| Prompt constraint violation ~72% | (a) Grounded | PFI study, AgentSpec | Test with current models (capability improves over time); re-measure annually |
| Structural enforcement >90% | (a) Grounded | AgentSpec, Progent | Verify on multi-agent coding (not just safety benchmarks) |
| Throughput multiplier 2.2--3x | (a/c) Partial | M1-Parallel, practitioner reports | **Critical gap:** no controlled experiment on identical task sets; proposed experiment below |
| DORA productivity paradox | (a) Grounded | DORA 2025, Faros telemetry | Longitudinal tracking; if review tooling improves, paradox may resolve |
| Coupling density dynamics ($\tau_{1/2}$) | (b) Prediction | Model based on Lehman's Laws | Measure $\rho(G_t)$ over 6--12 months in real projects; fit $\alpha, \beta$ parameters |
| Partition half-life estimates | (b) Prediction | Derived from evolution model | Track actual partition quality decay in deployed multi-agent systems |
| QAS < 1 regime | (c) Synthesis | Combines Kim et al. + DORA + reliability theory | Measure QAS directly in controlled multi-agent experiments |
| Throughput crossover formula | (c) Synthesis | Combines Amdahl/USL + conflict probability | Calibrate $p_c$, $t_{\text{merge}}$, $R(k)$ empirically per codebase |

### 5.2 Proposed Calibration Experiments

**Experiment 1: Agent-Specific Conflict Rate.** Run $k \in \{1, 2, 3, 5, 8\}$ agents on the same feature set across 10+ repositories of varying coupling density. Measure: (i) textual conflict rate, (ii) build conflict rate, (iii) semantic conflict rate (detected by test suite), (iv) wall-clock merge time. This calibrates $p_c$, $t_{\text{merge}}(k)$, and $R(k)$.

**Experiment 2: QAS Measurement.** For the same task set, run sequential single-agent and parallel multi-agent configurations. Measure: (i) features completed per hour, (ii) defects per feature (detected within 48 hours), (iii) review time per PR. Compute QAS directly. Minimum sample: 50 tasks per configuration to achieve statistical power for detecting 20% QAS differences ($\alpha = 0.05$, $\beta = 0.80$).

**Experiment 3: Coupling Density Evolution.** Instrument 5+ active repositories with weekly coupling graph snapshots (computed from static analysis + git co-change). Fit the stochastic evolution model ($\alpha$, $\beta$, $\sigma$) over 6 months. Test whether $\tau_{1/2}$ predictions match observed partition decay.

**Experiment 4: Error Amplification on Code Tasks.** Replicate Kim et al.'s methodology on coding-specific benchmarks (SWE-Bench Verified, HumanEval+, MBPP+). Measure $A_e$ for Independent, Centralized, and Hierarchical topologies. Key hypothesis: $A_e$ for code generation is higher than for the general benchmarks in Kim et al. because code has tighter coupling and stricter correctness requirements.

**Experiment 5: Structural vs. Prompt Enforcement in Coding.** Compare prompt-based file ownership ("do not modify files X, Y, Z") against structural enforcement (filesystem permissions on worktrees) across 100+ agent task executions. Measure violation rate, defect rate, and throughput. This calibrates the ~72% violation rate for the specific domain of multi-agent coding.

### 5.3 Unknown Parameters Requiring Calibration

| Parameter | Current Status | Required Experiment |
|-----------|---------------|---------------------|
| $p_c$ for agent-generated code | Unknown; human data gives 7.6--19.3% | Experiment 1 |
| $t_{\text{merge}}(k)$ with AST tools | Estimated at 20--74ms per pair (GumTree); unvalidated for agent output | Experiment 1 |
| $A_e$ for code-generation tasks | Unknown; proxy from Kim et al.'s general benchmarks | Experiment 4 |
| $\alpha, \beta$ coupling evolution rates | Rough estimates from Lehman/Gall; not calibrated for modern repos | Experiment 3 |
| QAS for real multi-agent systems | Not measured directly anywhere in the literature | Experiment 2 |
| Prompt enforcement violation rate for coding | ~72% from security domain; may differ for coding constraints | Experiment 5 |

---

## Summary of Key Formal Results

1. **Empirical calibration** establishes that error amplification ranges from 4.4x (centralized) to 17.2x (independent), with confidence intervals available only for the extremes. The 45% capability saturation threshold is well-grounded ($p < 0.001$) but untested on code-generation tasks specifically.

2. **Coupling density dynamics** predict partition half-lives of 1--4 years for well-partitioned systems and months for poorly-partitioned ones. These are theoretical estimates requiring empirical calibration of the growth rate $\alpha$ and refactoring rate $\beta$.

3. **The throughput model** shows that parallelism is beneficial only when $G(k) > 1 + M(k)$. At pairwise conflict rates of 20%, five agents produce negative throughput. The practical sweet spot is 3--4 agents with conflict rates below 15%.

4. **Quality-Adjusted Speedup** can be less than 1, meaning parallelism produces worse outcomes than sequential execution. The independent architecture yields QAS $\approx 0$ on high-error-rate tasks. Even centralized coordination requires speedup exceeding 6.7x to break even at $d(1) = 0.20$.

5. **The verification roadmap** identifies 6 unknown parameters that no existing study has measured for the specific context of multi-agent code generation. Five experiments are proposed to close these gaps, with Experiment 2 (direct QAS measurement) being the highest priority.

---

## References

- Amdahl, G.M. (1967). "Validity of the single processor approach." AFIPS '67.
- Apel, S. et al. (2012). "Structured merge with auto-tuning." ASE 2012.
- Brun, Y. et al. (2011). "Proactive Detection of Collaboration Conflicts." ESEC/FSE 2011.
- D'Ambros, M. et al. (2009). "On the evolution of source code coupling." CSMR 2009.
- DORA (2025). "State of AI-Assisted Software Development." Google Cloud.
- Gall, H., Hajek, K., & Jazayeri, M. (1998). "Detection of logical coupling." ICSM 1998.
- Ghiotto, G. et al. (2018). "On the Nature of Merge Conflicts." IEEE TSE.
- Gunther, N.J. (2008). "A General Theory of Computational Scalability." arXiv:0808.1431.
- Kasi, B.K. & Sarma, A. (2013). "Cassandra: Proactive conflict minimization." ICSE 2013.
- Kim, Y. et al. (2025). "Towards a Science of Scaling Agent Systems." arXiv:2512.08296.
- Lehman, M.M. (1980). "Programs, Life Cycles, and Laws of Software Evolution." Proc. IEEE.
- Lehman, M.M. & Ramil, J.F. (2003). "Software evolution." J. Software Maintenance and Evolution.
- Lesenich, S. et al. (2017). Merge conflict and bug correlation study (via Accioly et al., 2018).
- Osmani, A. (2026). "The Code Agent Orchestra." addyosmani.com.
- Shen, B. et al. (2019). "IntelliMerge." OOPSLA 2019.
