# Temporal Architecture of AI Coding Agent Harnesses: Theoretical Foundations

Research Round 1: Historical and Formal Foundations

---

## 1. Stochastic Scheduling Theory

### 1.1 Pinedo's Taxonomy of Scheduling Problems

The standard classification system for scheduling problems uses the three-field notation `alpha | beta | gamma`, originally proposed by Graham, Lawler, Lenstra, and Rinnooy Kan (1979) and subsequently systematized in Michael Pinedo's textbook *Scheduling: Theory, Algorithms, and Systems* (Springer, multiple editions from 1995 onward).

The three fields encode:

- **alpha (machine environment):** The type and number of machines. Examples include `1` (single machine), `Pm` (m identical parallel machines), `Qm` (uniform parallel machines), `Rm` (unrelated parallel machines), `Fm` (flow shop with m stages), `Jm` (job shop), and `Om` (open shop).
- **beta (job characteristics and constraints):** A possibly empty set of constraints including `prec` (precedence constraints forming a DAG), `r_j` (release dates), `d_j` (deadlines), `p_j = 1` (unit processing times), `pmtn` (preemption allowed), and stochastic variants where processing times follow given distributions.
- **gamma (objective function):** The optimization criterion, such as `C_max` (makespan), `sum(C_j)` (total completion time), `sum(w_j C_j)` (weighted completion time), `L_max` (maximum lateness), or `sum(T_j)` (total tardiness).

**Mapping to agent harnesses:** An AI coding agent pipeline can be formalized as `Rm | prec, stoch | E[C_max]`, meaning unrelated parallel machines (heterogeneous agents or models with different capabilities and speeds), precedence constraints (task dependency DAGs), stochastic processing times (LLM inference latency is inherently variable), and the objective of minimizing expected makespan. The stochastic extension, covered in Part II of Pinedo's textbook, introduces policies (online decision rules) rather than fixed schedules, since processing times are revealed only upon task completion.

### 1.2 Graham's List Scheduling Bounds

Ronald L. Graham established the foundational results on approximation bounds for parallel machine scheduling in two seminal papers:

- Graham, R. L. (1966). "Bounds for Certain Multiprocessing Anomalies." *Bell System Technical Journal*, 45(9), 1563-1581.
- Graham, R. L. (1969). "Bounds on Multiprocessing Timing Anomalies." *SIAM Journal on Applied Mathematics*, 17(2), 416-429.

**The List Scheduling Algorithm:** Given a set of tasks with precedence constraints to be executed on m identical machines, list scheduling maintains a priority list of tasks. Whenever a machine becomes free, the highest-priority available (all predecessors completed) task is assigned to it.

**The (2 - 1/m) Bound (Theorem):** For any instance of `Pm | prec | C_max` (m identical parallel machines, precedence constraints, makespan minimization), list scheduling produces a schedule with makespan C_LS satisfying:

```
C_LS / C_OPT <= 2 - 1/m
```

where C_OPT is the optimal makespan. The bound is tight: there exist instances achieving this ratio exactly.

**Proof sketch:** The key insight uses two lower bounds on C_OPT: (1) the critical path length through the precedence DAG, and (2) the total work divided by m. Graham showed that C_LS <= C_OPT + (1 - 1/m) * p_max, where p_max is the longest task duration. Since C_OPT >= p_max, the result follows.

**The Multiprocessing Anomalies:** Graham's papers also established the counterintuitive result that improving any single parameter of a scheduling instance (adding machines, reducing task durations, removing precedence constraints) can *increase* the makespan under a fixed schedule. This demonstrated that scheduling requires adaptive policies, not rigid plans.

**Mapping to agent harnesses:** The (2 - 1/m) bound provides a worst-case guarantee for any greedy task assignment in a multi-agent pipeline. If a harness dispatches tasks to agents using any priority-based heuristic, the resulting execution time is at most (2 - 1/m) times optimal. For a 4-agent system, this means at most 1.75x optimal. The anomaly results are directly relevant: naively adding more agents to a pipeline, or making individual tasks faster, can paradoxically slow the overall workflow when precedence constraints create critical-path dependencies.

### 1.3 Mohring's Results on Stochastic DAG Scheduling

Rolf H. Mohring, along with Radermacher and Weiss, established key results on stochastic scheduling with precedence constraints:

- Mohring, R. H., Radermacher, F. J., and Weiss, G. (1984). "Stochastic Scheduling Problems I: General Strategies." *Zeitschrift fur Operations Research*, 28, 193-260.
- Mohring, R. H. (2001). "Scheduling under Uncertainty: Bounding the Makespan Distribution." In *Computational Discrete Mathematics*, Springer LNCS 2122.

**Key Results:**

1. **Instability of deterministic schedules under stochasticity:** A schedule that is optimal for the expected processing times is not necessarily optimal in expectation when processing times are stochastic. This means the optimal deterministic schedule (computed from mean task durations) can be strictly suboptimal compared to the best adaptive policy.

2. **Complexity:** Computing the expected makespan of a stochastic DAG (even with fixed precedence constraints and independent random processing times) is #P-complete in general. This means that even *evaluating* the performance of a given policy is computationally intractable for large DAGs.

3. **Monotonicity and stability:** The paper formalizes conditions under which stochastic scheduling policies behave monotonically (stochastically larger processing times lead to stochastically larger makespans) and identifies stable classes of policies that are robust to distributional perturbations.

4. **Policy classes:** Two formalizations of stochastic scheduling policies were introduced: *static policies* (fixed permutation of tasks) and *dynamic policies* (decisions depend on observed completions). Dynamic policies can strictly dominate static ones.

**The formal problem for agent harnesses:**

```
Minimize E[C_max] subject to:
  - DAG precedence constraints G = (V, E)
  - Task j has random duration X_j ~ F_j with failure probability q_j
  - m heterogeneous agents with different speed profiles
  - Policy pi maps observed history to next task assignment
  - Failed tasks may be retried (with fresh duration draw) or abandoned
```

This formulation captures the core temporal optimization problem of a multi-stage AI coding pipeline: tasks (code generation, testing, review) form a DAG, each task's completion time is stochastic (LLM inference variability, test suite runtime variance), and tasks can fail (compilation errors, test failures), requiring retry or replanning.

---

## 2. Queueing Theory Foundations

### 2.1 Little's Law

**Statement (Theorem):** For any stable queueing system in steady state:

```
L = lambda * W
```

where L is the long-run average number of items in the system, lambda is the long-run average arrival rate, and W is the long-run average time an item spends in the system.

**History:** The relationship was empirically observed and used without proof by Philip M. Morse in 1954, who challenged readers to find a counterexample. John D. C. Little published the first rigorous proof in 1961:

- Little, J. D. C. (1961). "A Proof for the Queuing Formula: L = lambda W." *Operations Research*, 9(3), 383-387.

Subsequently, Jewell (1967) and Eilon (1969) provided simpler proofs, and Stidham (1972) gave a more intuitive derivation. The law is remarkable for its generality: it holds regardless of arrival process distribution, service time distribution, service discipline, number of servers, or network topology. The only requirements are finite means and stationarity (with metrically transitive arrivals).

**Application to subsystems:** Critically, Little's Law applies to any subsystem of a larger system. This means it can be applied independently to each stage of a pipeline, to the queue in front of a bottleneck, or to the entire end-to-end workflow.

**Mapping to agent harnesses:** For a coding agent pipeline processing task requests at rate lambda:

- If L tasks are "in flight" (being processed across all pipeline stages) and W is the average end-to-end latency, then L = lambda * W.
- To reduce latency W while maintaining throughput lambda, one must reduce in-flight work L (pipeline depth) or increase parallelism (effectively splitting the system).
- Conversely, if in-flight work grows (deeper agent chains, more elaborate multi-step reasoning), latency increases proportionally at fixed throughput.
- Little's Law provides the fundamental constraint linking pipeline depth, throughput, and latency in any agent orchestration system.

### 2.2 Kingman's GI/G/1 Approximation

**Statement (Approximation Formula):** For a single-server queue with general independent interarrival times and general service times (the GI/G/1 queue), the mean waiting time in queue is approximately:

```
E[W_q] ~ ((c_a^2 + c_s^2) / 2) * (rho / (1 - rho)) * E[S]
```

where:
- `c_a^2 = Var[A] / E[A]^2` is the squared coefficient of variation (SCV) of interarrival times
- `c_s^2 = Var[S] / E[S]^2` is the SCV of service times
- `rho = E[S] / E[A]` is the server utilization (traffic intensity)
- `E[S]` is the mean service time

**Origin:** Kingman, J. F. C. (1961). "The Single Server Queue in Heavy Traffic." *Mathematical Proceedings of the Cambridge Philosophical Society*, 57(4), 902-904.

Kingman proved that as rho approaches 1, the scaled waiting time (1 - rho) * W converges in distribution to an exponential random variable, using Pollaczek's contour integral representation and transform methods. The formula is asymptotically exact as rho -> 1, and provides relative errors below 10% for rho > 0.8 with moderate variability.

**The VUT decomposition:** Hopp and Spearman reformulated Kingman's result as the "VUT equation": CT_q = V * U * T, where V is the variability factor `(c_a^2 + c_s^2) / 2`, U is the utilization factor `rho / (1 - rho)`, and T is the mean service time `E[S]`. This decomposition makes the three levers for reducing queue time explicit and independent.

**Mapping to agent harnesses:** Each stage of an agent pipeline (code generation, linting, testing, review) acts as a server. The Kingman formula reveals:

1. **Variability amplification:** LLM inference times have high variance (c_s^2 >> 0 due to variable output length, model load, etc.), which directly multiplies queue wait times. Reducing inference variability (through batching, consistent prompt structure, or model distillation) has first-order effects on pipeline latency.
2. **Utilization cliff:** The rho/(1-rho) term means that as any pipeline stage approaches full utilization, waiting times explode nonlinearly. An agent at 90% utilization has 9x the queue delay of one at 50%. This provides the formal basis for capacity margins in agent systems.
3. **The VUT decomposition** makes explicit that pipeline latency can be attacked through three independent levers: reduce variability (more predictable tasks), reduce utilization (add capacity), or reduce service time (faster models).

### 2.3 Bottleneck Analysis and the Theory of Constraints

**Goldratt's Theory of Constraints (TOC):**

Eliyahu M. Goldratt introduced the Theory of Constraints in *The Goal* (1984), with the central thesis that every system has exactly one binding constraint (bottleneck) at any given time, and system throughput can only be improved by improving that constraint. Optimizing non-constraints provides no system-level benefit.

The TOC prescribes a five-step focusing process:
1. **Identify** the system's constraint
2. **Exploit** the constraint (maximize its throughput)
3. **Subordinate** everything else to the constraint
4. **Elevate** the constraint (add capacity)
5. **Repeat** (the constraint may shift)

**Factory Physics (Hopp & Spearman):**

Wallace Hopp and Mark Spearman formalized these intuitions in *Factory Physics* (McGraw-Hill, 1st ed. 2000), deriving several key results:

- **Bottleneck rate (r_b):** The capacity of a system equals the rate of its bottleneck station. The system throughput cannot exceed r_b regardless of how other stations are optimized.
- **Raw process time (T_0):** The sum of mean processing times along the longest path (critical path). This is the minimum cycle time achievable even with zero variability and zero utilization.
- **Critical WIP (W_0):** W_0 = r_b * T_0. This is the minimum WIP needed to achieve maximum throughput. Below W_0, throughput is WIP-limited; above W_0, additional WIP increases cycle time without increasing throughput.
- **Practical Worst Case:** With high variability, cycle time grows linearly with WIP above W_0, providing a worst-case envelope for system performance.

**Mapping to agent harnesses:** In a typical coding agent pipeline (plan -> generate -> test -> fix -> review), exactly one stage is the bottleneck at any time. For current LLM-based systems, this is typically the code generation or fix stage (highest latency, most variable). The TOC framework prescribes:

- Identify the bottleneck stage empirically (highest utilization, longest queues)
- Maximize its throughput (optimal prompt engineering, batching, caching)
- Subordinate other stages (do not produce work faster than the bottleneck can consume)
- Elevate (add parallel agents at the bottleneck, use faster models, implement speculative generation)
- After elevation, the bottleneck may shift to testing or review, requiring re-identification

The critical WIP result (W_0 = r_b * T_0) tells harness designers exactly how many concurrent tasks to maintain: fewer starves throughput, more increases latency without benefit.

---

## 3. Speculative Execution History

### 3.1 Tomasulo's Algorithm (1967)

Robert Tomasulo developed his algorithm for dynamic instruction scheduling at IBM, first implemented in the IBM System/360 Model 91 floating-point unit:

- Tomasulo, R. M. (1967). "An Efficient Algorithm for Exploiting Multiple Arithmetic Units." *IBM Journal of Research and Development*, 11(1), 25-33.

**Key innovations:**
1. **Register renaming** in hardware, eliminating false dependencies (WAW and WAR hazards) that prevent out-of-order execution
2. **Reservation stations** for each execution unit, buffering instructions waiting for operands
3. **Common Data Bus (CDB)** for broadcasting computed results to all waiting reservation stations simultaneously

Tomasulo's algorithm allows instructions to execute out of order (as soon as operands are available) while maintaining the illusion of sequential execution through in-order commitment. Robert Tomasulo received the Eckert-Mauchly Award in 1997 for this work.

**Mapping to agent harnesses:** Tomasulo's algorithm is the hardware analog of dependency-driven task scheduling in agent pipelines. The key principles transfer directly:

- **Register renaming -> workspace isolation:** Multiple agents can work on overlapping code regions if each operates on a renamed copy (branch or workspace), with results merged at commit time.
- **Reservation stations -> task queues per agent:** Each agent has a local queue; tasks are dispatched when all dependencies (test results, review approvals, generated code) are available.
- **Common Data Bus -> event bus:** A publish-subscribe mechanism broadcasts completed task results to all waiting agents simultaneously, enabling maximum parallelism.

### 3.2 Branch Prediction Evolution

**Static prediction:** The simplest approach, always predicting taken (or not-taken). Used in early pipelined processors. Accuracy roughly 60-70% for typical programs.

**Dynamic prediction (Smith, 1981):** James E. Smith introduced saturating counter-based dynamic branch predictors:

- Smith, J. E. (1981). "A Study of Branch Prediction Strategies." *Proceedings of the 8th International Symposium on Computer Architecture*, 135-148.

A 2-bit saturating counter per branch tracks recent outcomes, requiring two consecutive mispredictions to change the prediction. This simple scheme achieves approximately 85-90% accuracy. Two-bit predictors were independently developed by Tom McWilliams and Curt Widdoes at LLNL in 1977 for the S-1 supercomputer.

**Two-level adaptive prediction (Yeh & Patt, 1991):** Tse-Yu Yeh and Yale Patt introduced correlation-based prediction using two levels of history:

- Yeh, T.-Y. and Patt, Y. N. (1991). "Two-Level Adaptive Training Branch Prediction." *Proceedings of the 24th International Symposium on Microarchitecture*, 51-61.
- Yeh, T.-Y. and Patt, Y. N. (1992). "Alternative Implementations of Two-Level Adaptive Branch Prediction." *Proceedings of the 19th International Symposium on Computer Architecture*, 124-134.

The scheme uses a Branch History Register (BHR) recording the outcomes of the last k branches, indexing into a Pattern History Table (PHT) of 2^k saturating counters. This captures correlations between branches, achieving 95-97% accuracy.

### 3.3 Burton Smith and Speculative Parallelism

Burton J. Smith (1941-2018) pioneered multithreaded architectures that exploited speculative parallelism at scale:

- The **Denelcor HEP** (1982): One of the first machines to use hardware multithreading to hide memory latency, executing threads from different contexts on every cycle.
- The **Tera MTA** (founded 1987, delivered late 1990s): A radical architecture with no data caches, relying entirely on fine-grained thread switching (every cycle) to tolerate memory latency. The Tera MTA exploited parallelism at all levels: instruction-level within a processor, parallel programming across processors, and multiprogramming across applications.

Smith received the Eckert-Mauchly Award in 1991 and the Seymour Cray Award in 2003.

**Key insight from Smith's work:** Speculative parallelism is most effective when the cost of maintaining multiple speculative threads (memory, compute) is low relative to the latency being hidden. The Tera MTA proved that with sufficient threads, speculation can entirely eliminate memory latency stalls.

### 3.4 The Formal Conditions for Profitable Speculation

Speculation has positive expected value when:

```
E[benefit] > E[cost]

That is: p_correct * T_saved > p_incorrect * T_wasted
```

where:
- `p_correct` = probability that the speculative path is the one actually needed
- `T_saved` = time saved by having precomputed the result (typically the full latency of the speculative task)
- `p_incorrect` = 1 - p_correct
- `T_wasted` = resources consumed on the wrong path (compute time, memory, any rollback cost)

Rearranging, speculation is profitable when:

```
p_correct > T_wasted / (T_saved + T_wasted)
```

For branch prediction in CPUs, T_saved is the full pipeline depth (10-20 cycles in modern processors), while T_wasted is the pipeline flush penalty (roughly equal to pipeline depth). This yields a breakeven at p_correct > 0.5, explaining why even crude static predictors (60-70% accuracy) are profitable.

For deeper speculation (speculating across multiple branches), the expected value becomes:

```
E[net] = p_correct^n * T_saved_total - (1 - p_correct^n) * T_wasted_total
```

where n is the speculation depth. This exponential decay in p_correct^n places a natural limit on useful speculation depth.

**Mapping to agent harnesses:** Speculative execution in agent pipelines takes several forms:

1. **Speculative code generation:** Begin generating code for multiple possible approaches before the planning stage commits to one. Profitable when generation latency is high and approach selection accuracy is moderate.
2. **Speculative test execution:** Start running tests on partially complete code, predicting that the remainder will not affect the tests being run. Profitable when test suite latency is the bottleneck and tests are relatively independent.
3. **Speculative fix generation:** When a test failure seems likely (based on code complexity or history), begin generating a fix before the test result arrives. The breakeven calculation is: if fix generation takes time T_fix and the probability of failure is p_fail, speculation is profitable when p_fail > T_fix / (T_fix + T_test), where T_test is the time that would otherwise be idle waiting for test results.

The exponential decay in p_correct^n means that deep speculation chains (speculate on the fix for a speculated test failure of speculated code) are rarely profitable. The practical limit for agent pipelines is typically one level of speculation.

---

## 4. Cache Theory

### 4.1 Belady's Optimal Replacement Algorithm

Laszlo Belady introduced the optimal page replacement algorithm (also called OPT, MIN, or the clairvoyant algorithm):

- Belady, L. A. (1966). "A Study of Replacement Algorithms for a Virtual-Storage Computer." *IBM Systems Journal*, 5(2), 78-101.

**The algorithm:** When a page fault occurs and the cache is full, evict the page whose next access is furthest in the future. If a page is never accessed again, it is the ideal eviction candidate.

**Optimality:** OPT minimizes the total number of page faults for any given access sequence. A short proof of this was given by van Vliet (2003, Stanford CS264 notes; see also Mattson et al., 1970 for the inclusion property).

**Uncomputability in online settings:** OPT requires knowledge of all future accesses, making it impossible to implement as an online algorithm. In the formal framework of competitive analysis, OPT serves as the offline adversary against which online algorithms are measured. The gap between OPT and the best online algorithm quantifies the inherent cost of uncertainty about the future.

### 4.2 Sleator & Tarjan's Competitive Analysis of LRU

Daniel Sleator and Robert Tarjan introduced competitive analysis and established tight bounds for online paging algorithms:

- Sleator, D. D. and Tarjan, R. E. (1985). "Amortized Efficiency of List Update and Paging Rules." *Communications of the ACM*, 28(2), 202-208.

**Key results:**

1. **LRU is k-competitive:** The Least Recently Used replacement policy incurs at most k times as many page faults as OPT on any access sequence, where k is the cache size (number of slots).

```
cost_LRU(sigma) <= k * cost_OPT(sigma) + k
```

for any access sequence sigma.

2. **Deterministic lower bound:** No deterministic online paging algorithm can achieve a competitive ratio better than k. The adversarial proof constructs a sequence where the online algorithm always faults (requesting one of n > k pages, always the one not in cache), while OPT faults only every k steps by evicting the page used furthest in the future.

3. **Resource augmentation:** If LRU has cache size k and the offline optimum uses cache size h <= k, then LRU is k/(k-h+1)-competitive. In particular, with twice the cache of OPT (k = 2h), LRU is 2-competitive. This "resource augmentation" perspective is often more practically relevant than worst-case competitive ratios.

**Subsequent work:** Fiat, Karp, Luby, McGeoch, Sleator, and Young (1991) showed that randomized algorithms can achieve O(log k)-competitive ratios, exponentially better than the deterministic k lower bound. The MARKING algorithm achieves this.

### 4.3 Denning's Working Set Model

Peter Denning introduced the working set model for memory management:

- Denning, P. J. (1968). "The Working Set Model for Program Behavior." *Communications of the ACM*, 11(5), 323-333.

**The locality principle:** Programs pass through a sequence of *locality sets*, referencing only a relatively small, slowly-changing subset of their total address space during any interval of execution. Denning formalized this as three observations: (1) processes pass through a sequence of locality sets and reference only within them; (2) locality sets can be inferred by applying a distance function to the program's address trace within a backward window; (3) memory management is optimal when each process's locality set is guaranteed to be resident in fast memory.

**The working set W(t, tau):** At time t, with window parameter tau, the working set is the set of distinct pages referenced in the interval [t - tau, t]. The working set size |W(t, tau)| estimates the current memory demand of the process.

**Thrashing prevention:** Denning showed that multiprogramming without working-set-based memory allocation leads to *thrashing*, a state where the system spends nearly all its time swapping pages rather than doing useful work, with throughput collapsing to near zero. Working set memory management prevents thrashing by guaranteeing each process enough memory for its current locality set before admitting it for execution.

**Mapping to agent harnesses (all cache results):**

The classical cache theory results map onto three distinct caching layers in LLM agent systems:

**Layer 1: KV-Cache Reuse (Attention Cache)**

The KV-cache stores computed key-value pairs from the transformer's attention mechanism. When prompts share a common prefix (system prompt, tool definitions, conversation history), the KV-cache for that prefix can be reused across requests, avoiding redundant computation.

- Belady's OPT maps to: given perfect knowledge of future agent requests, cache exactly those KV prefixes that will be reused soonest. This is uncomputable online (we don't know future requests), so practical systems use LRU or frequency-based policies.
- Sleator-Tarjan's k-competitive bound: an LRU eviction policy for KV-cache slots is at most k times worse than optimal, where k is the number of cache slots. The resource augmentation result is more relevant in practice: provisioning 2x the KV-cache memory needed by OPT makes LRU only 2x suboptimal.
- Recent work (KVFlow, 2025) introduces workflow-aware eviction policies that use agent execution order to prioritize cache entries, conceptually moving from generic LRU toward domain-specific approximations of Belady's OPT.

**Layer 2: Prompt Caching**

Provider-level prompt caching (Anthropic, OpenAI) stores and reuses the server-side computation for common prompt prefixes. The "Don't Break the Cache" paper (2025) showed that for long-horizon agentic tasks, strategic cache boundary control (caching only stable content like system prompts and tool definitions, excluding volatile tool results) outperforms naive full-context caching.

- Denning's working set model applies directly: an agent's "locality set" is the set of prompt components actively being reused. If the cache window (TTL) is too small, frequently used prefixes get evicted (thrashing). If too large, stale entries waste cache capacity. The working set parameter tau corresponds to the cache TTL.

**Layer 3: Plan Template Caching**

Agentic Plan Caching (APC), presented at NeurIPS 2025 by Zhang et al., introduces test-time memory that extracts, stores, and reuses structured plan templates from completed agent executions:

- Zhang et al. (2025). "Agentic Plan Caching: Test-Time Memory for Fast and Cost-Efficient LLM Agents." *NeurIPS 2025*.

The system extracts plan templates from completed agent workflows, uses keyword-based matching to find relevant templates for new requests, and employs lightweight models to adapt cached templates to new contexts. APC reduces serving costs by approximately 50% and latency by approximately 27% while maintaining 96.6% of optimal performance.

- This is a higher-level analog of instruction caching in CPUs: rather than caching data (KV pairs), it caches *control flow* (plan templates). The competitive analysis framework applies: how much worse is an online plan-caching policy compared to one with perfect foreknowledge of all future task requests?
- The working set model predicts that plan cache effectiveness depends on temporal locality in the request stream. Projects with repetitive tasks (CI pipelines, similar bug fixes, standard feature implementations) have high locality and benefit most from plan caching. Exploratory, one-off tasks have low locality and benefit little.

---

## Cross-Cutting Synthesis

The four theoretical domains converge on a unified view of temporal architecture for agent harnesses:

| Domain | Core Result | Agent Harness Implication |
|--------|-------------|--------------------------|
| Scheduling | Graham's (2-1/m) bound | Greedy task dispatch to agents is within 1.75x optimal for 4 agents |
| Scheduling | Mohring's #P-completeness | Exact makespan optimization for stochastic agent DAGs is intractable; heuristic policies are necessary |
| Queueing | Little's Law L = lambda W | Pipeline depth, throughput, and latency are locked in a triad; improving one degrades another |
| Queueing | Kingman's VUT formula | LLM inference variability directly multiplies queue wait times; the utilization cliff demands capacity margins |
| Queueing | Goldratt's TOC | Only bottleneck-stage improvements increase system throughput |
| Speculation | Tomasulo's register renaming | Workspace isolation enables out-of-order agent execution |
| Speculation | Branch prediction evolution | Historical success rates enable profitable speculative generation |
| Speculation | p > T_wasted/(T_saved + T_wasted) | Sets the formal threshold for when speculative agent work pays off |
| Cache | Belady's OPT uncomputability | Perfect caching requires future knowledge; online policies are inherently suboptimal |
| Cache | Sleator-Tarjan k-competitiveness | LRU KV-cache is at most k-times worse than optimal; 2x memory makes it 2x-competitive |
| Cache | Denning's working set model | Cache TTL must match the agent's task locality window to avoid thrashing |

The central tension in temporal architecture is between **utilization** (keeping agents busy) and **responsiveness** (low latency). Kingman's formula makes this tension precise: queue time grows as rho/(1-rho), so operating near full utilization sacrifices responsiveness. The resolution comes from Goldratt's TOC: focus capacity investment at the bottleneck, and tolerate idle capacity at non-bottleneck stages. Speculation (Section 3) offers a way to productively use that idle capacity by precomputing likely future results, subject to the expected-value constraint of Section 3.4.

---

## References

### Scheduling Theory
- Graham, R. L. (1966). "Bounds for Certain Multiprocessing Anomalies." *Bell System Technical Journal*, 45(9), 1563-1581.
- Graham, R. L. (1969). "Bounds on Multiprocessing Timing Anomalies." *SIAM Journal on Applied Mathematics*, 17(2), 416-429.
- Graham, R. L., Lawler, E. L., Lenstra, J. K., and Rinnooy Kan, A. H. G. (1979). "Optimization and Approximation in Deterministic Sequencing and Scheduling: A Survey." *Annals of Discrete Mathematics*, 5, 287-326.
- Mohring, R. H., Radermacher, F. J., and Weiss, G. (1984). "Stochastic Scheduling Problems I: General Strategies." *Zeitschrift fur Operations Research*, 28, 193-260.
- Mohring, R. H. (2001). "Scheduling under Uncertainty: Bounding the Makespan Distribution." In *Computational Discrete Mathematics*, Springer LNCS 2122.
- Pinedo, M. L. (2016). *Scheduling: Theory, Algorithms, and Systems*, 5th ed. Springer.

### Queueing Theory
- Little, J. D. C. (1961). "A Proof for the Queuing Formula: L = lambda W." *Operations Research*, 9(3), 383-387.
- Kingman, J. F. C. (1961). "The Single Server Queue in Heavy Traffic." *Mathematical Proceedings of the Cambridge Philosophical Society*, 57(4), 902-904.
- Stidham, S. (1972). "L = lambda W: A Discounted Analogue and a New Proof." *Operations Research*, 20(6), 1115-1126.
- Goldratt, E. M. (1984). *The Goal: A Process of Ongoing Improvement*. North River Press.
- Hopp, W. J. and Spearman, M. L. (2000). *Factory Physics*, 2nd ed. McGraw-Hill.

### Speculative Execution
- Tomasulo, R. M. (1967). "An Efficient Algorithm for Exploiting Multiple Arithmetic Units." *IBM Journal of Research and Development*, 11(1), 25-33.
- Smith, J. E. (1981). "A Study of Branch Prediction Strategies." *Proceedings of the 8th ISCA*, 135-148.
- Yeh, T.-Y. and Patt, Y. N. (1991). "Two-Level Adaptive Training Branch Prediction." *Proceedings of the 24th MICRO*, 51-61.
- Yeh, T.-Y. and Patt, Y. N. (1992). "Alternative Implementations of Two-Level Adaptive Branch Prediction." *Proceedings of the 19th ISCA*, 124-134.

### Cache Theory
- Belady, L. A. (1966). "A Study of Replacement Algorithms for a Virtual-Storage Computer." *IBM Systems Journal*, 5(2), 78-101.
- Denning, P. J. (1968). "The Working Set Model for Program Behavior." *Communications of the ACM*, 11(5), 323-333.
- Sleator, D. D. and Tarjan, R. E. (1985). "Amortized Efficiency of List Update and Paging Rules." *Communications of the ACM*, 28(2), 202-208.
- Fiat, A., Karp, R. M., Luby, M., McGeoch, L. A., Sleator, D. D., and Young, N. E. (1991). "Competitive Paging Algorithms." *Journal of Algorithms*, 12(4), 685-699.

### LLM Agent Caching
- Zhang et al. (2025). "Agentic Plan Caching: Test-Time Memory for Fast and Cost-Efficient LLM Agents." *NeurIPS 2025*.
- "Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks." arXiv:2601.06007, 2025.
- "KVFlow: Efficient Prefix Caching for Accelerating LLM-Based Multi-Agent Workflows." arXiv:2507.07400, 2025.
