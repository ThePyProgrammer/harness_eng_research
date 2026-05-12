# Research Plan: Coordination Architecture for Multi-Agent Software Engineering

## Topic

How multiple AI agents coordinate on shared codebases: parallelism topologies, task decomposition algorithms, merge conflict detection, error amplification dynamics, and the formal tradeoffs governing throughput vs. correctness in agentic software development.

## Research Questions

1. **Error amplification dynamics:** What are the formal relationships between agent count, topology, and error rate? Under what conditions does adding agents degrade rather than improve outcomes? (Kim et al.'s capability saturation threshold; extending beyond their tested configurations.)

2. **Task decomposition optimality:** How do spectral methods, Kernighan-Lin, and hypergraph partitioning compare for decomposing file coupling graphs into parallel-safe task sets? What approximation guarantees hold in practice for real codebases?

3. **Merge conflict probability models:** Can conflict probability across the 5 abstraction levels (textual, structural, dependency, API, semantic) be modeled as a probabilistic graphical model? What calibration data exists from large-scale merge histories?

4. **Topology selection as mechanism design:** Can topology selection (hub-and-spoke, peer-to-peer, hierarchical, isolated-then-merge) be formalized as a mechanism design problem where agents have private information about task difficulty?

5. **Isolation vs. coordination cost:** What is the formal tradeoff between isolation overhead (worktree creation, merge reconciliation) and coordination overhead (locking, shared-state conflict)? Where does the crossover point lie as coupling density varies?

6. **Sequential vs. parallel throughput:** Under what cycle-time assumptions does sequential execution with fast feedback outperform parallel execution with merge overhead, measured in features/hour?

7. **Coupling graph dynamics:** How rapidly does the file coupling graph evolve during active development? What is the half-life of a "good" decomposition, and when does re-decomposition overhead exceed its benefit?

8. **Contract-based coordination primitives:** How do structural enforcement mechanisms (file ownership contracts, hook-based write rejection) compare to prompt-based coordination in terms of violation rates, throughput, and developer experience?

## Key Thinkers and Works

- **Kim, Bang, et al. (2025):** "Towards a Science of Scaling Agent Systems" (arXiv:2512.08296). Core empirical work on error amplification and topology selection.
- **Kernighan & Lin (1970):** Graph partitioning heuristic. Foundation for task decomposition.
- **Karypis & Kumar (1998):** METIS multilevel graph partitioning. Practical scalable decomposition.
- **Fiduccia & Mattheyses (1982):** Improved KL partitioning for hypergraphs.
- **Conway (1968):** Conway's Law. Organizational topology mirrors system architecture.
- **Bernstein, Hadzilacos, Goodman (1987):** Concurrency control in distributed systems. Theoretical foundation for isolation levels.
- **Google DORA Team (2025):** State of DevOps report. Empirical data on AI adoption and quality metrics.
- **Cursor Engineering (2025):** Scaling long-running autonomous coding. Practical lessons on locking vs. optimistic concurrency.
- **ConGra (Zhu et al., 2024):** Merge conflict resolution benchmarks (arXiv:2409.14121).
- **Osmani (2025):** Code Agent Orchestra, agentic coding patterns.
- **Mitchinson (2025):** Git worktrees for multi-feature AI agent development.
- **Lamport (1978):** Time, clocks, and ordering of events. Foundation for distributed coordination.
- **Herlihy & Shavit (2008):** Art of Multiprocessor Programming. Linearizability, progress guarantees.
- **Amdahl (1967):** Amdahl's Law. Fundamental limit on parallel speedup.
- **Gustafson (1988):** Gustafson's Law. Scaled speedup for parallel workloads.

## Agent Strategy (5 Parallel Researchers)

### R1: Error Amplification and Topology Theory
- Kim et al. deep dive: full methodology, statistical models, limitations
- Multi-agent system theory (distributed AI, swarm intelligence)
- Error propagation in cascaded systems (reliability engineering)
- Amdahl's Law and its extensions for error-prone parallel agents

### R2: Graph Partitioning and Task Decomposition
- Spectral partitioning, KL, METIS for software dependency graphs
- Balanced min-cut theory, approximation bounds
- Hypergraph partitioning (files can belong to multiple logical units)
- Empirical studies on software module clustering and decomposition

### R3: Merge Conflict Theory and Detection
- Textual, structural, semantic merge conflict taxonomies
- Probabilistic models of merge conflict frequency
- ConGra and related benchmarks
- AST-level and program analysis approaches to conflict detection
- Operational transformation and CRDTs as alternative merge models

### R4: Distributed Coordination Theory
- Concurrency control: pessimistic (locking) vs. optimistic (validation)
- Isolation levels (serializable, snapshot, read committed) applied to agent coordination
- Mechanism design for topology selection (truthful reporting of task properties)
- Conway's Law and organizational topology

### R5: Empirical Evidence and Practitioner Reports
- DORA 2025 findings on AI adoption and quality
- Cursor's scaling experiments (locking model, planner/worker/judge)
- Real-world worktree-based isolation (RAPID, Devin, similar tools)
- Throughput measurements: features/hour for sequential vs. parallel approaches
- Contract-based vs. prompt-based coordination violation rates

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources
- Contradictions between sources explicitly identified
- At least one formal theorem or proof sketch per core section
- Empirical calibration data for key parameters (error amplification factor, conflict probability, coupling density evolution rate)
- Clear identification of what is established theory vs. novel synthesis
