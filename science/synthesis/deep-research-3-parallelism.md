# Deep Research 3: Parallelism and Coordination in AI Coding Agent Harnesses

## The Core Tension

Parallelism in multi-agent coding systems presents a fundamental tradeoff: throughput scales with agent count, but so does error amplification and coordination overhead. Kim et al. (2025) quantified this precisely. Independent agents amplify errors 17.2x compared to a single agent baseline, while centralised coordination reduces amplification to 4.4x. Critically, they identified a capability saturation threshold at roughly 45% single-agent accuracy; beyond that point, adding agents yields diminishing or negative returns. Their predictive model (R^2 = 0.524) correctly identifies optimal coordination strategy for 87% of held-out configurations.

This aligns with Google's 2025 DORA report, which found that 90% AI adoption correlates with a 9% increase in bug rates, 91% longer code review times, and 154% larger pull requests. Speed without coordination degrades quality.

## How Existing Harnesses Navigate This

### GSD: Sequential with Bounded Parallelism

GSD is fundamentally sequential: one phase executes at a time, gated by explicit discuss/plan/execute transitions. Parallelism appears only in research (4 simultaneous researcher agents) and wave-based execution (independent sub-tasks within a phase). The orchestrator maintains a single source of truth through `.planning/` state.

This maps to Kim et al.'s "centralised MAS" topology. The low error amplification (4.4x) applies because the orchestrator acts as a coordination bottleneck that catches errors before they propagate. The cost is throughput; phases run sequentially even when they could theoretically overlap.

### RAPID: Isolated Parallelism via Worktrees

RAPID takes the opposite approach. Each set (workstream) gets an isolated git worktree with its own branch, working directory, and scoped CLAUDE.md. Interface contracts (CONTRACT.json) define file ownership boundaries. Multiple sets execute simultaneously, with merge happening only after completion via DAG-ordered integration.

This is a hybrid topology. Within each worktree, an agent operates independently. But CONTRACT.json imposes structural coordination without runtime communication, effectively creating what could be called "contract-mediated independence." The isolation eliminates the 17.2x error amplification of pure independence because agents literally cannot modify each other's files. The contracts reduce coordination to a merge-time concern rather than an execution-time one.

### Turing: Structural Role Separation

Turing uses two agents with asymmetric permissions: the researcher (read/write) implements changes, the evaluator (read-only) analyses results. This is not parallelism in the throughput sense but rather a separation-of-concerns pattern that prevents the "marking your own homework" failure mode. The evaluator's read-only constraint is a hard safety boundary, not a soft convention.

### Blueprint: Read-Only Parallel Analysis

Blueprint dispatches up to 21 single-purpose agents, including a 5-agent evaluation team that runs concurrently. The key constraint: all analysis agents are read-only. This sidesteps coordination entirely; read-only operations cannot conflict with each other. The pattern works because architectural analysis is inherently parallelisable (consistency, bug surface, maintainability, testing, Conway's Law are independent concerns).

## RAPID's Isolation Model vs. Kim et al.

Kim et al. tested topologies where agents share a common execution environment and communicate (or fail to communicate) during task execution. RAPID's worktree isolation creates a different category. Agents cannot interfere with each other during execution because they operate on physically separate file trees. This converts the multi-agent problem from "N agents coordinating on shared state" to "N independent agents on disjoint state, with a merge phase."

The error amplification findings still apply, but at merge time rather than execution time. RAPID's 5-level conflict detection (textual, structural, dependency, API, semantic) is the mechanism that absorbs what would otherwise be amplified errors. The confidence-based resolution tiers (deterministic auto-resolve, heuristic patterns, AI-assisted, human escalation) acknowledge that not all conflicts can be resolved automatically, which prevents the system from silently propagating merge errors.

Cursor's experience validates the isolation approach. Their initial locking model (agents competing for shared resources) reduced effective throughput to 2-3 agents even with 20 running. Optimistic concurrency with planner/worker/judge roles performed better, but their architecture still requires runtime coordination. RAPID avoids this entirely by deferring coordination to merge.

## The Merge Problem

Parallel work is worthless if it cannot be safely integrated. Four approaches exist in practice:

1. **Textual merge (git default):** Handles non-overlapping changes but fails on semantic conflicts. Insufficient for agent-generated code where two agents may modify different files but introduce incompatible APIs.

2. **LLM-assisted merge:** ConGra (2024) benchmarked six LLMs on conflict resolution. General-purpose LLMs (Llama3-8B, DeepSeek-V2) outperformed specialised code LLMs, suggesting that merge resolution requires broad reasoning rather than narrow code expertise.

3. **Contract-mediated merge (RAPID):** File ownership contracts prevent most conflicts at the structural level. The 5-level detection catches what contracts miss. This front-loads conflict prevention rather than relying on post-hoc resolution.

4. **Orchestrator-gated merge (GSD):** Sequential phases mean there is no merge problem; each phase commits to main before the next begins. Safe but inherently serial.

RAPID's layered approach is notable: textual conflicts are trivial, structural conflicts require AST analysis, dependency conflicts require graph analysis, API conflicts require contract validation, and semantic conflicts require AI judgement. Each level escalates confidence requirements.

## Optimal Topology Selection

The research suggests four regimes, each favouring a different topology:

| Signal | Recommended Topology | Rationale |
|--------|---------------------|-----------|
| Single-agent accuracy > 45% | Single agent | Capability saturation; coordination overhead exceeds gains |
| Task decomposes into independent sub-problems with clear boundaries | Parallel-isolated (RAPID) | Worktree isolation eliminates runtime coordination; contracts prevent conflicts |
| Sub-problems share state and require real-time coordination | Parallel-coordinated (centralised MAS) | Accepts 4.4x error amplification for throughput gains |
| Task is sequential by nature (each step depends on prior output) | Sequential (GSD) | No parallelism to exploit; forcing it creates artificial merge points |
| Analysis or evaluation (read-only operations) | Parallel read-only (Blueprint) | Zero coordination cost; unlimited safe parallelism |

The key signal is decomposability. If a project partitions cleanly into sets with minimal interface surface, RAPID-style isolation dominates. If the work is tightly coupled, sequential execution with a single agent is safer and often faster than coordinating multiple agents on shared state. Cursor's planner/worker/judge architecture offers a middle path: centralised planning with parallel isolated execution and periodic judge resets to prevent drift.

## Practical Implications for Harness Design

The evidence supports three design principles:

1. **Isolation over coordination.** Preventing conflicts (via worktrees, file ownership, read-only constraints) is cheaper than resolving them. Every harness that tried shared-state coordination (Cursor's locking model, naive multi-agent on shared repos) hit throughput collapse.

2. **Multi-level merge detection is non-negotiable.** Textual merge is necessary but insufficient. Any harness supporting parallel execution needs at minimum structural and API-level conflict detection. RAPID's 5-level model is the current high-water mark.

3. **Topology should be adaptive.** No single topology dominates across all task types. A harness should select topology based on task decomposability, single-agent baseline performance, and interface surface area between components. Kim et al.'s predictive model (87% accuracy on held-out configurations) suggests this selection can eventually be automated.

---

**Sources:**

- [Kim et al., "Towards a Science of Scaling Agent Systems" (2025)](https://arxiv.org/abs/2512.08296)
- [Google DORA 2025 State of AI-Assisted Software Development](https://dora.dev/research/2025/dora-report/)
- [Cursor, "Scaling Long-Running Autonomous Coding"](https://cursor.com/blog/scaling-agents)
- [Osmani, "The Code Agent Orchestra"](https://addyosmani.com/blog/code-agent-orchestra/)
- [ConGra: Benchmarking Automatic Conflict Resolution](https://arxiv.org/html/2409.14121v1)
- [Osmani, "The Future of Agentic Coding: Conductors to Orchestrators"](https://addyosmani.com/blog/future-agentic-coding/)
- [Mitchinson, "Using Git Worktrees for Multi-Feature Development with AI Agents"](https://www.nrmitchi.com/2025/10/using-git-worktrees-for-multi-feature-development-with-ai-agents/)
