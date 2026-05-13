# Coordination Architecture for Multi-Agent Software Engineering: Research Foundations

**Research Round 1 -- Error Amplification, Topology Theory, and Scaling Limits**
**Date:** 2026-04-03

---

## 1. Kim et al. (2025): Towards a Science of Scaling Agent Systems

**Source:** Yubin Kim, Ken Gu, Chanwoo Park, et al. "Towards a Science of Scaling Agent Systems." arXiv:2512.08296, December 2025. ([arxiv.org/abs/2512.08296](https://arxiv.org/abs/2512.08296))

### 1.1 Methodology

Kim et al. conducted a controlled evaluation spanning **180 configurations**, constructed from the cross-product of:

- **5 architectures:** Single-Agent System (SAS), Independent MAS, Centralized MAS, Decentralized MAS, Hybrid MAS
- **3 LLM families:** OpenAI (GPT-5 variants), Google (Gemini variants), Anthropic (Claude Sonnet variants)
- **4 benchmarks:** BrowseComp-Plus (web navigation), Finance-Agent (quantitative reasoning), PlanCraft (spatiotemporal planning), Workbench (tool-use tasks)

Critically, the study **standardized tools, prompt structures, and token budgets** across all configurations. This isolates architectural effects from confounding variables like prompt engineering quality or model capability differences.

### 1.2 Statistical Model

The core predictive model is a **mixed-effects regression with 20 parameters** (Equation 1 in the paper). Key coefficients:

| Predictor | Beta | p-value | Interpretation |
|-----------|------|---------|---------------|
| Intelligence (I) | -0.180 | 0.008 | Raw intelligence alone is insufficient |
| Intelligence squared (I^2) | 0.256 | 0.010 | Non-linear capability gains at higher levels |
| log(1 + Tools) | 0.535 | < 0.001 | Tool access is the strongest positive predictor |
| Single-agent baseline (P_SA) | 0.319 | < 0.001 | Strong baseline performance matters |
| **Baseline paradox (P_SA x log(1+n_a))** | **-0.408** | **< 0.001** | **The critical finding: coordination becomes net-negative above ~45% single-agent accuracy** |
| Efficiency-tools trade-off (E_c x T) | -0.330 | < 0.001 | Dominant inhibitory mechanism |
| Overhead x tools (O% x T) | -0.141 | < 0.001 | Overhead penalizes tool-heavy tasks |
| Error amplification x tools (A_e x T) | -0.097 | 0.007 | Error amplification compounds with tool use |

Model validation: 5-fold cross-validation yielded R^2_CV = 0.513, MAE = 0.089 +/- 0.011, RMSE = 0.112 +/- 0.014. Architecture prediction accuracy on held-out configurations: **87%**. Leave-one-domain-out R^2 = 0.89. Out-of-sample validation on GPT-5.2 achieved MAE = 0.071.

### 1.3 Error Amplification Results

The error amplification metric A_e = E_MAS / E_SAS measures how much multi-agent coordination multiplies the error rate relative to a single agent:

| Architecture | Error Amplification | 95% CI | Coordination Overhead |
|-------------|--------------------|---------|-----------------------|
| Independent | **17.2x** | [14.3, 20.1] | 58% |
| Decentralized | 7.8x | -- | 263% |
| Centralized | **4.4x** | [3.8, 5.0] | 285% |
| Hybrid | 5.1x | -- | 515% |

The Independent architecture produces the highest error amplification (17.2x) because agents operate without any error-correction mechanism. Centralized coordination reduces this to 4.4x by routing through a coordinator that can catch inconsistencies, but at the cost of 285% overhead in token consumption.

### 1.4 Capability Saturation

The beta = -0.408 coefficient on the interaction term P_SA x log(1+n_a) reveals a **capability saturation threshold at approximately 45% single-agent accuracy**. Below this threshold, coordination helps because agents are individually weak and benefit from diverse perspectives. Above it, coordination becomes net-negative: the overhead and error amplification outweigh the marginal benefit of additional agents.

Mathematically, the partial derivative of performance with respect to agent count (dP/dn_a) becomes negative when P_SA exceeds ~0.45.

### 1.5 Turn Count Scaling

Turn count follows a **power-law**: T = 2.72 x (n + 0.5)^1.724, R^2 = 0.974. The exponent of 1.724 significantly exceeds linear scaling (p < 0.001), meaning communication cost grows super-linearly with agent count.

### 1.6 Task-Specific Findings

- **Parallelizable tasks (Finance-Agent):** Centralized coordination achieved +80.8% improvement over single agent
- **Web navigation (BrowseComp-Plus):** Decentralized coordination achieved +9.2% (centralized only +0.2%)
- **Sequential reasoning (PlanCraft):** All multi-agent variants degraded performance by **-39% to -70%**

### 1.7 Limitations

- Only 4 benchmarks tested; generalizability to code generation tasks is assumed but not demonstrated
- Model-dependent coordination preferences suggest incompletely characterized mechanisms
- Token budget matching, while methodologically sound, may not reflect real-world deployments where budgets vary
- The R^2_CV of 0.513 means roughly half the variance remains unexplained
- No longitudinal evaluation (single-shot tasks, not iterative development workflows)

### 1.8 Relevance to Multi-Agent Code Generation

The 45% saturation threshold is directly actionable: if a single LLM can already solve a coding subtask with >45% accuracy, adding more agents will likely hurt. The 17.2x independent error amplification explains why naive "fan-out" architectures (e.g., generating code in parallel then merging) produce integration nightmares. The finding that sequential reasoning tasks degrade by 39-70% is alarming for code generation, which frequently requires long chains of dependent reasoning.

---

## 2. Error Propagation in Cascaded and Parallel Systems

**Sources:**
- Xie, Lin, Mary Ann Lundteigen, and Yiliu Liu. "Reliability and barrier assessment of series-parallel systems subject to cascading failures." *Proc. IMechE Part O: J. Risk and Reliability* 234(5), 2020. ([doi:10.1177/1748006X19899235](https://journals.sagepub.com/doi/10.1177/1748006X19899235))
- Lin, Y.-H., Li, Y.-F., and Zio, E. "System Reliability Assessment Based on Failure Propagation Processes." *Complexity*, 2018. ([doi:10.1155/2018/9502953](https://onlinelibrary.wiley.com/doi/10.1155/2018/9502953))
- Cortland University. "Understanding Series and Parallel Systems Reliability." START, Vol. 11, No. 5. ([web.cortland.edu](https://web.cortland.edu/matresearch/SerieslParallelSTART.pdf))

### 2.1 Foundational Formulas

**Series system** (all components must succeed): R_series = product(R_i) for i = 1..n. If each component has reliability p, then R = p^n. For p = 0.9 and n = 5, system reliability drops to 0.59.

**Parallel system** (at least one must succeed): R_parallel = 1 - product(1 - R_i). For identical components: R = 1 - (1 - p)^n. This improves reliability, but only for independent, redundant components solving the same sub-problem.

**Series-parallel (hybrid):** Most real systems combine both patterns. The system reliability depends on which components are redundant (parallel) versus sequential dependencies (series).

### 2.2 Cascading Failure Dynamics

In series-parallel structures, failures propagate not only within the same parallel sub-structure but also between different sub-structures (Xie et al., 2020). A recursive aggregation method based on extended reliability block diagrams can model these cascading effects.

The key insight: **error propagation probability** is the probability that an error arising in one component propagates to others, potentially reaching the system output. In software systems with concurrent execution, multiple error propagation paths exist simultaneously, making the analysis significantly more complex than hardware reliability models assume.

### 2.3 Application to Agent Coordination

Multi-agent code generation maps onto series-parallel reliability as follows:

- **Series components:** Sequential pipeline stages (planning, coding, review, integration). Each stage must succeed. If each stage has accuracy p, the pipeline accuracy is p^n, which degrades rapidly.
- **Parallel components:** Multiple agents generating code for independent modules. The system succeeds if all parallel outputs are correct (unlike traditional parallel redundancy where any one success suffices). This is actually a **series** reliability model disguised as parallelism: P_all_correct = p^n, not 1 - (1-p)^n.

This distinction is critical. In traditional reliability engineering, parallel redundancy improves reliability because any one working component suffices. In multi-agent code generation, all parallel outputs must be correct and compatible, which means parallelism actually follows series reliability math, not parallel. This explains Kim et al.'s 17.2x error amplification for independent agents.

### 2.4 The Voting Exception

When multiple agents solve the **same** sub-problem and a majority vote selects the answer, the parallel redundancy formula applies. Triple Modular Redundancy (TMR) yields: R_TMR = R_v (3R_m^2 - 2R_m^3), where R_v is voter reliability and R_m is module reliability. For R_m > 0.5, this improves reliability. More generally, for n independent voters with accuracy p > 0.5, the Condorcet Jury Theorem guarantees that majority-vote accuracy approaches 1 as n grows. However, this requires: (1) genuine independence of errors, (2) individual accuracy > 50%, and (3) the problem has a single correct answer amenable to voting.

---

## 3. Amdahl's Law Extended for Error-Prone Agents

**Sources:**
- Amdahl, Gene M. "Validity of the single processor approach to achieving large scale computing capabilities." *AFIPS '67*, 1967.
- Gustafson, John L. "Reevaluating Amdahl's law." *Communications of the ACM* 31(5), 1988.
- Shi, Yuan. "Reevaluating Amdahl's Law and Gustafson's Law." Temple University CIS. ([cis.temple.edu](https://cis.temple.edu/~shi/wwwroot/shi/public_html/docs/amdahl/amdahl.html))
- Gunther, Neil J. "A General Theory of Computational Scalability Based on Rational Functions." arXiv:0808.1431, 2008.

### 3.1 Classical Amdahl's Law

Speedup(n) = 1 / (s + (1 - s) / n), where s is the serial fraction and n is the number of parallel processors. As n approaches infinity, speedup approaches 1/s. With 10% serial work, maximum speedup is 10x regardless of parallelism.

### 3.2 Gustafson's Extension

Gustafson observed that problem size typically grows with available resources, yielding scaled speedup: S(n) = n - s(n - 1). This is more optimistic, but **neither Amdahl's nor Gustafson's Law accounts for communication costs** (Shi, Temple CIS). In practice, communication overhead causes both laws to overestimate actual speedup.

### 3.3 The Universal Scalability Law (USL)

Gunther's USL adds a **coherency penalty** to Amdahl's Law:

C(n) = n / (1 + sigma(n - 1) + kappa * n(n - 1))

Where sigma is the serialization coefficient and kappa is the coherency (crosstalk) coefficient. The kappa term is quadratic in n, meaning that beyond some optimal n*, adding more processors actually decreases throughput. This produces a characteristic "retrograde" curve that matches Kim et al.'s findings.

### 3.4 Proposed Extension for Error-Prone Agents

Classical parallelism theory assumes processors are reliable. For error-prone agents, we can extend the USL by introducing an error penalty term. Let e(n) be the probability of at least one error occurring across n agents working on interdependent tasks:

e(n) = 1 - (1 - epsilon)^n, where epsilon is per-agent error rate.

The **effective throughput** considering both parallelism gains and error costs becomes:

T_eff(n) = C(n) * (1 - e(n)) * (1 - r(n))

Where C(n) is the USL throughput, e(n) is the error probability, and r(n) is the rework cost when errors are detected. This formulation predicts:

1. **An optimal agent count n*** that maximizes effective throughput (lower than the USL optimum)
2. **Rapid degradation** beyond n* as error probability approaches 1
3. **Error-rate sensitivity:** for high epsilon, n* may be 1 (a single agent is optimal)

For code generation specifically, epsilon is high (LLMs have significant error rates on complex tasks), and the rework cost r(n) is super-linear because integration errors from multiple agents require debugging across module boundaries.

### 3.5 Brooks's Law Connection

Brooks's Law ("Adding manpower to a late software project makes it later") formalizes the communication overhead as n(n-1)/2 pairwise channels for n workers. Recent analyses (McKinney, "The Mythical Agent-Month," 2026; Buffalolab, "Agentic AI and The Mythical Agent-Month," 2026) argue this applies directly to LLM agents:

- Agents do not escape Brooks's Law; they hit the wall of state-space explosion faster than humans
- Agent scaling is only helpful if the task gains more from parallelism than it loses to coordination overhead
- Kim et al.'s power-law turn scaling (exponent 1.724) is empirical confirmation of super-linear communication growth

**Source:** McKinney, Wes. "The Mythical Agent-Month." O'Reilly Radar, 2026. ([oreilly.com/radar](https://www.oreilly.com/radar/the-mythical-agent-month/))

---

## 4. Multi-Agent System Theory from Distributed AI

**Sources:**
- Cemri, Mert, Melissa Z. Pan, Shuyi Yang, et al. "Why Do Multi-Agent LLM Systems Fail?" arXiv:2503.13657, March 2025. ([arxiv.org/abs/2503.13657](https://arxiv.org/abs/2503.13657))
- "Multi-Agent Collaboration Mechanisms: A Survey of LLMs." arXiv:2501.06322, January 2025. ([arxiv.org/abs/2501.06322](https://arxiv.org/abs/2501.06322))
- "A Taxonomy of Hierarchical Multi-Agent Systems: Design Patterns, Coordination Mechanisms, and Industrial Applications." arXiv:2508.12683, August 2025. ([arxiv.org/abs/2508.12683](https://arxiv.org/abs/2508.12683))

### 4.1 Empirical Failure Taxonomy (MAST)

Cemri et al. (2025) introduced MAST (Multi-Agent System Failure Taxonomy), the first empirically grounded failure taxonomy for multi-agent LLM systems. Based on 1,600+ annotated traces across 7 frameworks, with inter-annotator agreement of Cohen's Kappa = 0.88, they identified **14 unique failure modes** organized into 3 categories:

1. **Specification issues:** Failures stemming from how tasks are defined and decomposed
2. **Inter-agent misalignment:** Failures in agent-to-agent communication, conflicting assumptions, or incompatible outputs
3. **Task verification:** Failures in validating correctness of intermediate and final results

Models tested included GPT-4, Claude 3, Qwen2.5, and CodeLlama across coding, math, and general agent tasks.

### 4.2 Coordination Overhead as Fundamental Limit

The distributed systems literature establishes that coordination overhead grows with the number of agents according to the communication topology:

- **Fully connected (peer-to-peer):** O(n^2) message complexity for consensus
- **Star/hub-spoke:** O(n) message complexity, but single point of failure
- **Hierarchical/tree:** O(n log n) message complexity, balanced trade-off

Classical consensus protocols (Paxos, Raft) require O(n) messages per decision round, with 2f + 1 total nodes needed to tolerate f failures. These bounds translate directly to agent coordination: achieving consensus among n agents on a code integration decision requires at minimum O(n) communication rounds.

### 4.3 Swarm Intelligence Principles

Swarm intelligence (Bonabeau et al., 1999) produces emergent collective behavior from simple local rules without central control. Key mechanisms include:

- **Stigmergy:** Indirect coordination through shared environment modifications (analogous to shared code repositories)
- **Positive feedback:** Successful patterns attract more agents (analogous to test-passing code getting integrated)
- **Negative feedback:** Failed attempts are abandoned (analogous to failing tests causing rollback)

The swarm model predicts that **decentralized, locally-interacting agents can converge to good solutions without global coordination**, but convergence is slow and non-deterministic. Kim et al.'s finding that decentralized agents achieve only +9.2% on web navigation (and degrade on sequential tasks) suggests that code generation tasks have too much sequential dependency for pure swarm approaches.

### 4.4 The Information Gain Perspective

Kim et al. introduce an information-theoretic framing: coordination is valuable when it produces **information gain** (Bayesian posterior variance reduction). Their data shows strong correlation between information gain and MAS benefit on parallelizable tasks (r = 0.71, p < 0.001 for Finance-Agent), but weak/non-significant correlation on tasks that are inherently sequential.

This suggests a principled decision rule: measure the expected information gain from adding agents before scaling up. If the task decomposition does not increase the total information available (because sub-tasks are tightly coupled), adding agents is net-negative.

---

## 5. Topology Classification and Formal Properties

**Sources:**
- Network topology literature (Wikipedia, Pearson IT Certification, infraon.io)
- Kim et al. (2025) architecture definitions
- "Agent Orchestration Patterns: Swarm vs Mesh vs Hierarchical." gurusup.com, 2025. ([gurusup.com/blog/agent-orchestration-patterns](https://gurusup.com/blog/agent-orchestration-patterns))

### 5.1 Topology Comparison Matrix

| Property | Hub-and-Spoke (Centralized) | Peer-to-Peer (Mesh/Independent) | Hierarchical (Tree) | Isolated-then-Merge |
|----------|---------------------------|--------------------------------|---------------------|---------------------|
| **Latency** | Low (1-2 hops) | Variable (multi-hop) | Moderate (log n hops) | Minimal during work; high at merge |
| **Message complexity** | O(n) per round | O(n^2) fully connected | O(n log n) | O(1) during work; O(n) at merge |
| **Fault tolerance** | Low (hub is SPOF) | High (no single point) | Moderate (root is SPOF) | High during work; low at merge |
| **Error propagation** | Contained by hub (4.4x) | Uncontained (17.2x) | Contained per level | Deferred to merge phase |
| **Throughput** | Limited by hub bandwidth | High theoretical max | Balanced | High during work; bottleneck at merge |
| **Coordination overhead** | 285% (Kim et al.) | 58% (Kim et al.) | ~263% (approx. decentralized) | Near-zero until merge |
| **Best for** | Parallelizable, well-decomposed tasks | Simple, independent tasks | Complex hierarchical decomposition | Embarrassingly parallel tasks |

### 5.2 Hub-and-Spoke (Centralized)

A coordinator agent receives the task, decomposes it, distributes sub-tasks to worker agents, and integrates results. All communication passes through the hub.

**Strengths:** The coordinator can catch inconsistencies, enforce interface contracts, and resolve conflicts. Kim et al. show 4.4x error amplification (lowest among MAS variants) and +80.8% improvement on parallelizable tasks.

**Weaknesses:** The hub is a single point of failure and a throughput bottleneck. Overhead is 285% in token consumption. If the coordinator makes an error, it cascades to all workers.

**Formal property:** Error propagation is bounded by the hub's error-detection capability. If the hub has detection probability d, then the effective error rate is approximately: E_system = E_hub + (1 - d) * sum(E_worker_i).

### 5.3 Peer-to-Peer (Independent/Mesh)

Agents operate independently or communicate freely in a mesh topology. No central coordinator.

**Strengths:** Maximum parallelism, no single point of failure, lowest coordination overhead (58%).

**Weaknesses:** 17.2x error amplification because there is no error-correction mechanism. Agents may produce incompatible outputs that only fail at integration time. Communication complexity is O(n^2) for full mesh.

**Formal property:** For n independent agents each with error rate epsilon, the probability of at least one error is 1 - (1 - epsilon)^n, which approaches 1 rapidly. For epsilon = 0.3 and n = 5: P(error) = 0.83.

### 5.4 Hierarchical (Tree)

Agents are organized in a tree structure with managers at internal nodes and workers at leaves. Each manager coordinates a small team, with results aggregated up the tree.

**Strengths:** Balances coordination quality with scalability. Each manager only coordinates k children (bounded fan-out), keeping local coordination overhead manageable. Error propagation is contained within subtrees.

**Weaknesses:** Root node is still a single point of failure. Latency grows with tree depth. Kim et al.'s "decentralized" architecture (7.8x error amplification, 263% overhead) approximates this pattern.

**Formal property:** For a balanced tree of depth d with branching factor k, the total agent count is n = (k^(d+1) - 1) / (k - 1), and communication latency is O(d) = O(log_k(n)). Error containment probability at each level reduces propagation geometrically.

### 5.5 Isolated-then-Merge

Agents work in complete isolation, producing independent outputs that are merged in a final integration phase. This is a degenerate case of hub-and-spoke where the hub only operates at the end.

**Strengths:** Zero coordination overhead during the work phase. Maximum independence. Easy to parallelize. If sub-tasks are truly independent, this is optimal.

**Weaknesses:** All integration complexity is deferred to the merge phase, where it hits at once. If sub-tasks are not truly independent (shared interfaces, shared state), the merge phase encounters the full 17.2x error amplification. The merge itself becomes a sequential bottleneck subject to Amdahl's Law.

**Formal property:** Work-phase throughput is n * T_single (linear scaling). Merge-phase cost is at minimum O(n) and at worst O(n^2) for pairwise compatibility checking. The overall speedup is bounded by: S = T_single / (T_single/n + T_merge(n)).

---

## 6. Synthesis: Implications for Multi-Agent Code Generation

### 6.1 The Fundamental Tension

The research converges on a single tension: **parallelism increases throughput but also increases error rate, and these effects work against each other**. The optimal operating point depends on:

1. **Task decomposability:** How cleanly the task splits into independent sub-tasks (high decomposability favors more agents)
2. **Per-agent accuracy:** How reliable each agent is on its sub-task (high accuracy tolerates more agents)
3. **Integration cost:** How expensive it is to detect and fix errors at merge time (high integration cost favors fewer agents)

### 6.2 Quantitative Decision Framework

Combining Kim et al.'s saturation threshold with reliability theory:

- **If single-agent accuracy > 45%:** Do not add agents; invest in improving the single agent (better prompts, more context, stronger model)
- **If single-agent accuracy < 45% and task is parallelizable:** Use centralized coordination (4.4x error amplification, +80.8% potential gain)
- **If single-agent accuracy < 45% and task is sequential:** Do not use multi-agent coordination (all variants degrade performance by 39-70%)
- **For code review/verification:** Use majority voting with 3+ agents (Condorcet Jury Theorem applies when accuracy > 50%)

### 6.3 The Effective Throughput Formula

Combining the USL with error penalties:

T_eff(n) = n / (1 + sigma(n-1) + kappa * n(n-1)) * (1-epsilon)^n

Where:
- n = number of agents
- sigma = serialization fraction
- kappa = coherency/crosstalk penalty
- epsilon = per-agent error rate

This formula has a unique maximum at some n* that decreases as epsilon increases. For a code generation scenario with sigma = 0.1, kappa = 0.01, epsilon = 0.2: the optimal agent count is approximately n* = 3-4, with effective throughput peaking at roughly 2x a single agent (not 3-4x, due to error penalties).

### 6.4 Open Questions

1. **Does the 45% saturation threshold hold for code generation specifically?** Kim et al. tested on 4 benchmarks, none of which were code generation.
2. **Can hierarchical topologies beat centralized ones at scale?** Kim et al.'s "decentralized" category is coarse; a well-designed hierarchy might achieve lower error amplification than 7.8x.
3. **What is the optimal merge strategy for isolated-then-merge?** LLM-based merge (having an LLM integrate the outputs) versus structured merge (AST-level, type-checked merge) likely have very different error profiles.
4. **How does iterative refinement change the calculus?** All results above are for single-shot tasks; iterative loops (generate, test, fix) may amortize coordination costs differently.

---

## Sources

- [Kim et al. "Towards a Science of Scaling Agent Systems." arXiv:2512.08296](https://arxiv.org/abs/2512.08296)
- [Google Research blog post on the paper](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/)
- [Cemri, Pan, Yang et al. "Why Do Multi-Agent LLM Systems Fail?" arXiv:2503.13657](https://arxiv.org/abs/2503.13657)
- [Towards Data Science: "Why Your Multi-Agent System is Failing: Escaping the 17x Error Trap"](https://towardsdatascience.com/why-your-multi-agent-system-is-failing-escaping-the-17x-error-trap-of-the-bag-of-agents/)
- [McKinney, "The Mythical Agent-Month." O'Reilly Radar, 2026](https://www.oreilly.com/radar/the-mythical-agent-month/)
- [Buffalolab, "Agentic AI and The Mythical Agent-Month," 2026](http://muratbuffalo.blogspot.com/2026/01/agentic-ai-and-mythical-agent-month.html)
- [Xie, Lundteigen, Liu. "Reliability and barrier assessment of series-parallel systems subject to cascading failures." 2020](https://journals.sagepub.com/doi/10.1177/1748006X19899235)
- [Lin, Li, Zio. "System Reliability Assessment Based on Failure Propagation Processes." 2018](https://onlinelibrary.wiley.com/doi/10.1155/2018/9502953)
- [Shi, "Reevaluating Amdahl's Law and Gustafson's Law." Temple University](https://cis.temple.edu/~shi/wwwroot/shi/public_html/docs/amdahl/amdahl.html)
- [Gunther, "A General Theory of Computational Scalability." arXiv:0808.1431](https://arxiv.org/abs/0808.1431)
- [Triple Modular Redundancy, Wikipedia](https://en.wikipedia.org/wiki/Triple_modular_redundancy)
- [Cortland University, "Understanding Series and Parallel Systems Reliability"](https://web.cortland.edu/matresearch/SerieslParallelSTART.pdf)
- ["Multi-Agent Collaboration Mechanisms: A Survey of LLMs." arXiv:2501.06322](https://arxiv.org/abs/2501.06322)
- ["A Taxonomy of Hierarchical Multi-Agent Systems." arXiv:2508.12683](https://arxiv.org/abs/2508.12683)
- [Agent Orchestration Patterns: Swarm vs Mesh vs Hierarchical](https://gurusup.com/blog/agent-orchestration-patterns)
- ["Self-Organized Agents: LLM Multi-Agent Framework." arXiv:2404.02183](https://arxiv.org/abs/2404.02183)
- ["Enhancing LLM Code Generation: Multi-Agent Collaboration." arXiv:2505.02133](https://arxiv.org/abs/2505.02133)
