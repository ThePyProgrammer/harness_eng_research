# Pillar 3: Coordination Architecture

## What This Pillar Is

The study of how multiple agents (or multiple invocations of a single agent) coordinate on shared codebases. This covers parallelism, topology selection, task decomposition, merge conflict detection, and the fundamental tradeoff between throughput and error amplification.

## Why It Must Exist

Parallelism is the primary lever for reducing wall-clock time on large projects. But naive parallelism destroys quality. Kim et al. (2025) quantified this: independent agents amplify errors 17.2x; centralised coordination reduces to 4.4x. Cursor's failed experiment with 20 agents on shared state produced effective throughput of only 2-3. Google's DORA 2025 report found 90% AI adoption correlates with 9% more bugs, 91% longer code reviews, and 154% larger PRs.

The question is not "should we parallelize?" but "how do we parallelize safely?"

## The Formal Problems

### Task Decomposition for Parallel Execution

Given a file coupling graph $G = (F, E)$ with edge weights $w_{ij}$ measuring coupling, find a partition $\{T_1, \ldots, T_k\}$ minimizing inter-task coupling (balanced min-cut):

$$\min_{\{T_1, \ldots, T_k\}} \; \sum_{\ell=1}^{k} \sum_{\substack{f_i \in T_\ell \\ f_j \notin T_\ell}} w_{ij}$$

NP-hard in general; spectral methods and Kernighan-Lin give good approximations.

### Merge Conflict Probability

Given parallel diffs $\Delta_1, \ldots, \Delta_k$, estimate conflict probability across 5 levels (textual, structural, dependency, API, semantic):

$$P(\text{conflict}) = 1 - \prod_{\ell < \ell'} P(\text{compatible}(\Delta_\ell, \Delta_{\ell'}))$$

Probabilistic graphical model calibrated from merge history.

### Topology Selection

Given task properties (files $m$, coupling density $\rho$, single-agent success $p_{\text{single}}$, deadline $\tau$), select topology $t$ maximizing success-per-time-per-cost:

$$\max_{t} \; P(\text{success} \mid t) \cdot \frac{1}{\text{time}(t)} - \text{cost}(t)$$

## The Right Mathematical Framework

**Graph theory + mechanism design.** Key quantities:
- $\rho(G)$: coupling density (edges/nodes in the dependency graph)
- $A_e(t, k)$: error amplification for topology $t$ with $k$ agents
- $P_{\text{conflict}}$: merge conflict probability given task decomposition
- Capability saturation threshold (~45% single-agent accuracy)

## What Existing Research Shows

- **Kim et al. (2025, arXiv:2512.08296):** Independent MAS: 17.2x error amplification. Centralised MAS: 4.4x. Capability saturation at ~45% single-agent accuracy ($\beta = -0.408, p < 0.001$). Predictive model correctly identifies optimal topology for 87% of held-out configurations.
- **Google DORA 2025:** 90% AI adoption = 9% more bugs, 91% longer reviews, 154% larger PRs.
- **Cursor:** Locking model (20 agents) collapsed to effective throughput of 2-3. Optimistic concurrency with planner/worker/judge performed better.
- **ConGra (2024):** General-purpose LLMs outperform code-specialized LLMs at merge conflict resolution. Broad reasoning > narrow code expertise for merges.

## How Existing Harnesses Handle This

| Harness | Topology | Isolation Mechanism | Merge Strategy |
|---------|----------|-------------------|----------------|
| **GSD** | Centralised sequential | Phase-level serialization | No merge needed (sequential commits) |
| **RAPID** | Parallel-isolated | Git worktrees + CONTRACT.json file ownership | 5-level conflict detection with confidence-based resolution |
| **Turing** | Two-agent role separation | Tool permission asymmetry | Not applicable (single codebase, no parallel writes) |
| **Blueprint** | Parallel read-only | All analysis agents are read-only | Not applicable (no writes from analysis agents) |

## RAPID's Key Innovation

RAPID's worktree isolation creates a category Kim et al. did not test. It converts the problem from "N agents coordinating on shared state" (error amplification during execution) to "N independent agents on disjoint state with a merge phase" (error concentrated at merge time).

CONTRACT.json is the coordination primitive: it declares which files each set owns, preventing concurrent modification. The harness enforces this via PreToolUse hooks that reject writes to unowned files. This is structural, not prompt-based.

The 5-level merge detection absorbs residual conflicts:
1. **Textual:** Direct file overlap (blocked by contracts; should not occur)
2. **Structural:** AST-level conflicts (e.g., both modify the same function's signature)
3. **Dependency:** Conflicting package additions/removals
4. **API:** One set changes a function signature another calls
5. **Semantic:** Behaviorally incompatible changes (requires AI judgment)

Confidence-based resolution: levels 1-2 auto-resolved; level 3 heuristic; levels 4-5 escalated.

## Key Contrarian Positions to Engage

1. **"Sequential with fast cycles beats parallel with merge overhead."** If cycle time drops from 45 to 10 minutes (see Pillar 4), sequential execution may deliver features faster than parallel execution with merge reconciliation overhead. Research needed: measure end-to-end throughput (features/hour) for both approaches on the same task set.

2. **"Contracts are too rigid."** File ownership sometimes forces unnatural task decompositions (splitting a feature along file boundaries rather than logical boundaries). Soft coordination (shared state with conflict detection, like git itself) might outperform hard isolation for tightly coupled changes.

3. **"Coupling is not static."** The file coupling graph changes as the codebase evolves. A decomposition optimal today may be suboptimal next week. Dynamic re-decomposition is possible but adds overhead. Research needed: how fast does $\rho(G)$ change?

4. **"Single agent is usually sufficient."** Kim et al.'s capability saturation at ~45% means that for tasks where single-agent accuracy exceeds this threshold, adding agents actively degrades performance. For most routine development tasks, a well-configured single agent in a good harness may be optimal.

## What Another Agent Needs to Know

- Never parallelize without structural isolation (worktrees, file ownership, or read-only constraints)
- CONTRACT.json file ownership is the minimum viable coordination primitive for parallel execution
- Merge detection must operate at multiple abstraction levels (textual is necessary but insufficient)
- Topology selection should be based on task decomposability and single-agent baseline accuracy
- Kim et al.'s 87% topology prediction accuracy suggests automated selection is feasible
- The coupling graph from static analysis is the input to the task decomposition algorithm
- Read-only operations (analysis, review, auditing) can always be parallelized safely with zero coordination cost

## Sources

- Kim et al.: Towards a Science of Scaling Agent Systems (arXiv:2512.08296, 2025)
- Google DORA 2025 Report
- Cursor: Scaling Long-Running Autonomous Coding
- ConGra: Benchmarking Automatic Conflict Resolution (arXiv:2409.14121, 2024)
- Osmani: The Code Agent Orchestra / Future of Agentic Coding
- Mitchinson: Git Worktrees for Multi-Feature Development with AI Agents
