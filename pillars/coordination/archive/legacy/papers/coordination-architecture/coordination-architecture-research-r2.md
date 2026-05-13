# Coordination Architecture Research Round 2: Graph Partitioning and Task Decomposition Theory

## Motivation

When multiple AI agents work on a codebase in parallel, the central problem is decomposition: how to split a large coding task into sub-tasks that can be executed concurrently with minimal interference. This is structurally equivalent to partitioning a file-coupling graph G = (F, E) where files are vertices, edges represent coupling (structural, logical, or semantic), and edge weights encode coupling strength. A good partition minimizes inter-task coupling (the cut), which directly minimizes the probability of merge conflicts, duplicated work, and semantic disagreements at integration time.

This document surveys the foundational graph partitioning algorithms, their complexity and quality guarantees, empirical software clustering research, and coupling metrics, then connects each to the specific problem of decomposing coding tasks for parallel AI agents.

---

## 1. Spectral Graph Partitioning

### Foundational Work

**Fiedler, M. (1973). "Algebraic connectivity of graphs." Czechoslovak Mathematical Journal, 23(98), 298-305.**

Miroslav Fiedler introduced the concept of algebraic connectivity: the second-smallest eigenvalue (lambda_2) of the graph Laplacian matrix L = D - A, where D is the diagonal degree matrix and A is the adjacency matrix. The eigenvector corresponding to lambda_2 is called the Fiedler vector. Partitioning the graph by the sign of Fiedler vector entries (positive vs. negative components) yields a bisection that tends to cut few edges.

### Cheeger's Inequality: The Approximation Guarantee

The discrete Cheeger inequality connects the spectral gap to graph conductance:

```
lambda_2 / 2  <=  phi(G)  <=  sqrt(2 * lambda_2)
```

where phi(G) is the minimum conductance (sparsest cut ratio) over all non-trivial subsets S of V:

```
phi(G) = min_S  |E(S, complement(S))| / min(vol(S), vol(complement(S)))
```

and vol(S) is the sum of degrees of vertices in S. The left inequality (easy direction) says the spectral gap lower-bounds conductance. The right inequality (hard direction, proven via sweep cuts on the Fiedler vector) says the spectral algorithm finds a cut whose conductance is at most sqrt(2 * lambda_2). This is a quadratic approximation: if the optimal conductance is epsilon, spectral bisection finds a cut with conductance at most sqrt(2 * epsilon).

**Source:** Spielman, D. "Conductance, the Normalized Laplacian, and Cheeger's Inequality." Yale CS 561 Lecture Notes (2018). Also: Kwok, T.C. et al. (2013). "Improved Cheeger's Inequality: Analysis of Spectral Partitioning Algorithms through Higher Order Spectral Gap." arXiv:1301.5584.

### Higher-Order Extensions

For k-way partitioning, the improved Cheeger inequality (Lee, Oveis Gharan, Trevisan, 2012) states:

```
phi_k(G) = O(k) * lambda_2 / sqrt(lambda_k)
```

This means spectral methods give constant-factor approximations when there are few well-separated clusters (lambda_k is bounded away from zero).

### Complexity

Computing the Fiedler vector requires solving an eigenvalue problem on the Laplacian, typically O(|E| * iterations) using Lanczos or power iteration. For sparse software dependency graphs (where |E| is roughly linear in |V|), this is practical for codebases up to tens of thousands of files.

### Connection to AI Agent Coordination

Spectral partitioning is attractive because the Fiedler vector provides a continuous relaxation of the discrete partitioning problem, and the Cheeger bound gives a provable quality guarantee. For a file-coupling graph, computing the Fiedler vector and doing a sweep cut yields partitions where the inter-partition coupling is bounded relative to the optimal. The limitation is that Cheeger gives a quadratic gap, so the cut quality can be substantially worse than optimal for graphs with subtle cluster structure.

---

## 2. Kernighan-Lin Algorithm (1970)

### Citation

**Kernighan, B.W. and Lin, S. (1970). "An efficient heuristic procedure for partitioning graphs." Bell System Technical Journal, 49(2), 291-307.**

### Algorithm

KL is an iterative improvement heuristic for graph bisection. Given an initial partition of n vertices into two equal sets A and B, KL repeatedly:

1. Computes the gain D(v) = external_cost(v) - internal_cost(v) for each vertex.
2. Greedily selects pairs (a_i, b_i) from A and B that maximize the reduction in cut size.
3. Locks swapped vertices so each vertex moves at most once per pass.
4. After all pairs are considered, applies only the prefix of swaps that yields maximum cumulative gain.
5. Repeats until no pass produces improvement.

### Complexity

Each pass runs in O(n^2 log n) time. For sparse graphs stored as adjacency lists, this improves to O(mn) per pass where m = |E|, which is O(n^2) for sparse graphs. The number of passes is typically small (constant in practice), though no formal bound exists.

### Quality Guarantees

KL provides no approximation guarantees. It is a local search heuristic that can get trapped in local optima. The quality depends on the initial partition. However, empirical studies in VLSI design showed it produces good results on structured graphs, typically within 5-15% of optimal for moderate-sized instances.

### Limitations

- Handles only unit vertex weights (equal-sized partitions).
- Cannot handle hypergraphs (a file participating in multiple logical groups).
- Only performs bisection; k-way partitioning requires recursive application.

### Connection to AI Agent Coordination

KL is relevant as a refinement step. After an initial decomposition (e.g., from spectral methods or developer-specified boundaries), KL can iteratively improve the partition by swapping files between agent task sets to reduce coupling. The O(n^2) per-pass cost is acceptable for codebases of a few thousand files. The lack of quality guarantees is a real concern; for safety-critical decomposition, KL should be combined with methods that provide bounds.

---

## 3. Fiduccia-Mattheyses Algorithm (1982)

### Citation

**Fiduccia, C.M. and Mattheyses, R.M. (1982). "A linear-time heuristic for improving network partitions." Proceedings of the 19th Design Automation Conference, 175-181.**

### Key Innovation

FM improves on KL in two critical ways:

1. **Linear-time passes:** By using bucket priority queues indexed by gain values, FM achieves O(p) time per pass, where p is the total number of pins (sum of hyperedge sizes). For standard graphs, p = 2|E|, so each pass is O(|E|). This is a substantial improvement over KL's O(n^2 log n).

2. **Hypergraph support:** FM operates on hypergraphs, where a hyperedge connects an arbitrary number of vertices. This is the natural model for software systems: a header file or interface may be imported by many modules, creating a hyperedge connecting all of them.

### Why Hypergraphs Matter for Software

In a standard graph model, if file X is used by files A, B, C, D, this is modeled as four separate edges. Cutting any one of them has unit cost. But in a hypergraph model, {X, A, B, C, D} form a single hyperedge. The cut cost depends on how many partitions the hyperedge spans, which more accurately reflects the reality that a change to X affects all consumers simultaneously. This distinction matters for AI agent task decomposition: if agent 1 modifies a shared interface, all agents consuming that interface may need to reconcile their work, regardless of how many individual edges are cut.

### Complexity

O(p) per pass, where p = sum of hyperedge sizes. For software dependency graphs where the average import list has k entries, p ~ k * |F| where |F| is the number of files. Typical codebases have p in the range of 10x to 50x the file count.

### Connection to AI Agent Coordination

FM is the most directly applicable classic algorithm for software task decomposition. The hypergraph model captures shared dependencies accurately, and linear-time passes make it practical for large codebases (100k+ files). The main limitation remains the lack of quality guarantees; like KL, it is a local search heuristic.

---

## 4. METIS: Multilevel Graph Partitioning (1998)

### Citation

**Karypis, G. and Kumar, V. (1998). "A fast and high quality multilevel scheme for partitioning irregular graphs." SIAM Journal on Scientific Computing, 20(1), 359-392. DOI: 10.1137/S1064827595287997**

### Algorithm

METIS uses a three-phase multilevel approach:

1. **Coarsening:** Repeatedly contract the graph by merging vertices connected by heavy edges (the heavy-edge matching heuristic). This reduces a graph of n vertices to a much smaller graph of O(n/2^levels) vertices while preserving the essential structure.

2. **Initial partitioning:** Partition the small coarsened graph using a direct method (e.g., KL or spectral bisection on the small graph).

3. **Uncoarsening and refinement:** Progressively expand the graph back to full size, applying KL/FM-style refinement at each level.

### Scalability Results

- Computes k-way partitions in O(|E|) time, a factor of O(log k) faster than recursive bisection.
- Graphs with 450,000 vertices and 3.3 million edges partitioned into 256 domains in under 40 seconds (1998 hardware).
- 128-way partitioning of million-vertex graphs in ~2 seconds on 128-processor Cray T3D.
- 10x to 40x faster than multilevel spectral bisection.
- 40x to 160x faster than spectral bisection for k-way partitioning.

### Quality Comparison

METIS partitions produce edge cuts that are consistently 10% to 50% better than spectral partitioning and 5% to 15% better than competing multilevel methods (Chaco). For mesh-like graphs (structured dependencies), METIS strongly dominates. For power-law graphs (social networks, some open-source dependency graphs), spectral methods can achieve higher quality, though at much higher computational cost.

### Connection to AI Agent Coordination

METIS is the practical tool of choice for partitioning large software dependency graphs. Its O(|E|) runtime means it can partition a million-file monorepo's dependency graph in seconds. The multilevel approach is particularly well-suited to software graphs, which exhibit hierarchical structure (packages within modules within services). The coarsening phase naturally discovers and exploits this hierarchy. For an AI agent harness, METIS (or its hypergraph variant hMETIS) can be used as a preprocessing step to generate candidate task decompositions, which can then be refined by domain-specific constraints (e.g., keeping test files with their implementation files).

---

## 5. Balanced Min-Cut: Formal Problem and Hardness

### Formal Definition

**Input:** An undirected graph G = (F, E) with edge weights w: E -> R+, and a target number of partitions k.

**Objective:** Find a partition {T_1, T_2, ..., T_k} of F such that:
- Balance constraint: |T_i| <= (1 + epsilon) * (|F| / k) for all i (where epsilon is the allowed imbalance)
- Minimize the total cut: sum of w(e) for all edges e crossing between partitions

**The (k, 1+epsilon) balanced partition problem** seeks a minimum-cost partition with each component containing at most (1+epsilon) * (n/k) nodes.

### NP-Hardness

The problem is NP-hard in general. Stronger results:

- **(k, 1)-balanced partitioning** (exactly equal parts) admits no polynomial-time approximation with any finite factor unless P = NP. This is proven by reduction from 3-partition, which is NP-hard in the strong sense.
- Even for planar graphs and grids, balanced partitioning is NP-hard to approximate within any satisfactory ratio (Feldmann and Foschini, 2012, arXiv:1111.6745).
- Minimum bisection ((2,1) case) is NP-complete.

### Known Approximation Results

When the balance constraint is relaxed (epsilon > 0):

- **Andreev and Racke (2006):** "Balanced Graph Partitioning." Theory of Computing Systems, 39(6), 929-939. For any constant nu > 1, they achieve O(log^1.5 n) approximation ratio in polynomial time with a (k, nu)-balanced partition.
- **Even, Naor, Rao, Schieber:** O(log n) bicriteria approximation for arbitrary k when nu >= 2, using spreading metrics.
- **Leighton and Rao (1999):** O(log n) approximation for sparsest cut via multicommodity flow relaxation.
- **Arora, Rao, Vazirani (2009):** O(sqrt(log n)) approximation for sparsest cut using semidefinite programming.

### Connection to AI Agent Coordination

The hardness results are sobering: finding the optimal decomposition of coding tasks is NP-hard, and even approximating it within any constant factor requires relaxing the balance constraint. In practice, this means:

1. Any task decomposition algorithm for AI agents will be heuristic, not optimal.
2. Allowing slight imbalance in task sizes (some agents get 10-20% more work) enables much better approximation ratios.
3. The O(log n) approximation from spreading metrics suggests that for a codebase of 10,000 files, the best polynomial-time algorithm might produce cuts ~13x worse than optimal. This motivates the use of METIS-style heuristics, which empirically perform much better than worst-case bounds suggest.

---

## 6. Software Module Clustering

### Bunch: Search-Based Modularization

**Mancoridis, S., Mitchell, B.S., Rorres, C., Chen, Y., and Gansner, E.R. (1998). "Using automatic clustering to produce high-level system organizations of source code." Proceedings of the 6th International Workshop on Program Comprehension (IWPC), 45-52.**

**Mitchell, B.S. and Mancoridis, S. (2006). "On the automatic modularization of software systems using the Bunch tool." IEEE Transactions on Software Engineering, 32(3), 193-208.**

Bunch treats software modularization as an optimization problem on the Module Dependency Graph (MDG). The fitness function is Modularization Quality (MQ):

```
MQ = sum over k clusters of MF_k
MF_k = (intra_edges_k) / (intra_edges_k + 0.5 * inter_edges_k)
```

MQ balances cohesion (intra-cluster edges) against coupling (inter-cluster edges). Bunch uses hill climbing, genetic algorithms, and simulated annealing to search the partition space. Key empirical findings:

- Applied to 17 real-world systems, Bunch's decompositions aligned well with developer-intended module boundaries in most cases.
- Hill climbing with random restarts was the most effective strategy, often matching or exceeding genetic algorithm quality at lower computational cost.
- Multi-objective variants (optimizing MQ and other quality attributes simultaneously) produced significantly better solutions than single-objective approaches across empirical studies.

### Software Reflexion Models

**Murphy, G.C., Notkin, D., and Sullivan, K. (1995). "Software reflexion models: bridging the gap between source and high-level models." Proceedings of the 3rd ACM SIGSOFT Symposium on the Foundations of Software Engineering, 18-28.**

**Murphy, G.C., Notkin, D., and Sullivan, K. (2001). "Software reflexion models: bridging the gap between design and implementation." IEEE Transactions on Software Engineering, 27(4), 364-380.**

Reflexion models take a different approach: rather than discovering structure automatically, they compare an engineer's hypothesized high-level model against the actual source code. The tool computes three types of relationships:

- **Convergences:** The high-level model and source agree (expected dependency exists).
- **Divergences:** Source contains dependencies not in the high-level model (unexpected coupling).
- **Absences:** High-level model specifies dependencies not found in source (missing implementation).

This is directly relevant to AI agent coordination because it provides a verification mechanism: after decomposing tasks based on a coupling graph, a reflexion model can identify where the decomposition violates the intended architecture, flagging potential conflict zones before agents begin work.

### Empirical Alignment

Studies show that automatic clustering recovers developer-intended module boundaries with moderate accuracy (typically 50-70% agreement on large systems), with the primary failure mode being "utility" modules that are coupled to everything. This suggests that purely graph-theoretic decomposition should be augmented with domain knowledge about shared utilities, framework code, and cross-cutting concerns.

### Connection to AI Agent Coordination

Bunch's MQ metric can be adapted directly for agent task decomposition: replace "subsystem" with "agent task set" and optimize for high intra-task cohesion and low inter-task coupling. The reflexion model approach suggests a verification loop: decompose, check against intended architecture, adjust, then dispatch to agents.

---

## 7. Coupling Metrics for Software

### Structural Coupling (Static Analysis)

**Martin, R.C. (1994). "OO Design Quality Metrics: An Analysis of Dependencies." Report on Object Analysis and Design, 1(3).**

Martin defined package-level metrics:

- **Afferent Coupling (Ca):** Number of external classes that depend on classes within this package. High Ca means the package is widely depended upon; changes are high-risk.
- **Efferent Coupling (Ce):** Number of external classes this package depends on. High Ce means the package is sensitive to external changes.
- **Instability (I):** Ce / (Ca + Ce). Range [0,1]. I=0 means maximally stable (many dependents, few dependencies). I=1 means maximally unstable.

Fan-in and fan-out metrics (Henry and Kafura, 1981) follow power-law distributions in real systems: most modules have low coupling, but a few "hub" modules have extremely high fan-in, creating bottlenecks for any partitioning scheme.

### Co-Change Coupling (Version History)

**Gall, H., Hajek, K., and Jazayeri, M. (1998). "Detection of logical coupling based on product release history." Proceedings of the International Conference on Software Maintenance (ICSM), 190-198.**

Co-change coupling measures how frequently two files are committed together in version history. Key findings from empirical studies:

- Co-change coupling captures dependencies invisible to static analysis (e.g., files that must change together due to implicit contracts, shared assumptions, or coordinated configuration).
- Change couplings are far more effective than structural couplings for predicting change propagation (the files that will actually need modification when a feature changes).
- Not all co-changed pairs are structurally linked; approximately 30-40% of strong co-change pairs have no direct import/dependency relationship.

### Semantic Coupling

Semantic coupling measures similarity of identifier names, comments, and code structure between modules. Studies (Poshyvanyk et al., 2009; Bavota et al., 2013) found that semantic coupling correlates with but does not subsume structural or logical coupling; it captures a distinct dimension of relatedness.

### Which Metrics Best Predict Merge Conflicts?

**Kasi, B.K. and Sarma, A. (2013). "Cassandra: Proactive conflict minimization through optimized task scheduling." Proceedings of ICSE, 732-741.**

**Accioly, P., Borba, P., and Cavalcanti, G. (2018). "Understanding semi-structured merge conflict characteristics in open-source Java projects." Empirical Software Engineering, 23(4), 2051-2085.**

Empirical evidence on merge conflict prediction:

- Code associated with a merge conflict is **2x more likely** to contain a bug.
- When merge conflicts require manual resolution, the resulting code is **26x more likely** to have a bug (Lesenich et al., 2017).
- Co-change coupling is the strongest single predictor of merge conflicts, because it captures the actual pattern of coordinated changes.
- Structural coupling (imports/dependencies) is necessary but not sufficient; many merge conflicts occur between files with no direct structural link but high co-change coupling.
- The combination of structural coupling, co-change coupling, and file proximity (directory distance) provides the best predictive model for merge conflicts.

### Connection to AI Agent Coordination

For building the edge weights in a file-coupling graph for agent task decomposition, the evidence strongly suggests using a composite metric:

1. **Structural coupling** (imports, function calls) as the base signal.
2. **Co-change coupling** from git history as the primary signal for merge conflict risk.
3. **Semantic coupling** as a secondary signal for detecting implicit dependencies.

Weighting co-change coupling most heavily is supported by the empirical finding that it outperforms structural coupling for change propagation prediction. The 26x bug multiplier for manual merge conflict resolution provides a clear cost function: the penalty for a bad partition (one that causes merge conflicts requiring manual resolution) is severe.

---

## Synthesis: Implications for Multi-Agent Task Decomposition

### The Formal Problem

Given a file-coupling graph G = (F, E) with composite edge weights w_ij (combining structural, co-change, and semantic coupling), find a partition {T_1, ..., T_k} that:

1. Minimizes sum of w_ij for all edges (i,j) where i in T_a and j in T_b with a != b (inter-task coupling / merge conflict risk).
2. Satisfies |T_i| <= (1 + epsilon) * (|F| / k) for all i (balanced workload).
3. Respects must-link constraints (test files with implementation files, tightly-coupled pairs).

This is exactly the balanced min-cut problem, which is NP-hard. No polynomial algorithm achieves a finite approximation ratio for perfectly balanced partitions.

### Practical Algorithm Pipeline

Based on this survey, the recommended approach for an AI agent harness is:

1. **Graph construction:** Build a hypergraph from static analysis (imports, call graphs) weighted by co-change coupling from git history. Use hyperedges for shared interfaces.

2. **Partitioning:** Use METIS or hMETIS for the initial partition. METIS achieves O(|E|) runtime and empirically produces cuts 10-50% better than spectral methods. Allow 10-20% imbalance (epsilon = 0.1 to 0.2) to unlock better approximation.

3. **Refinement:** Apply FM-style local search with domain-specific constraints (must-link, must-not-link). The linear-time passes make this practical even for large codebases.

4. **Verification:** Use reflexion models to check the partition against intended architecture. Flag divergences as high-risk zones requiring agent coordination protocols.

5. **Monitoring:** Track co-change coupling during agent execution. If two files in different partitions are being modified simultaneously, escalate to a coordination mechanism.

### Key Quantitative Bounds

| Property | Bound | Source |
|----------|-------|--------|
| Spectral bisection quality | phi <= sqrt(2 * lambda_2) | Cheeger inequality |
| Balanced partition approximation | O(log^1.5 n) with relaxed balance | Andreev and Racke (2006) |
| Sparsest cut approximation | O(sqrt(log n)) | Arora, Rao, Vazirani (2009) |
| METIS runtime | O(\|E\|) | Karypis and Kumar (1998) |
| FM pass runtime | O(p) where p = total pins | Fiduccia and Mattheyses (1982) |
| KL pass runtime | O(n^2 log n) | Kernighan and Lin (1970) |
| Merge conflict bug multiplier | 26x for manual resolution | Lesenich et al. (2017) |
| Automatic clustering accuracy | 50-70% vs. developer intent | Bunch empirical studies |

### Open Questions

1. **Dynamic re-partitioning:** As agents modify files, the coupling graph changes. How frequently should the partition be recomputed? The cost of METIS is low, but the cost of reassigning work mid-execution is high.

2. **Heterogeneous agent capabilities:** The balanced partition assumption treats all agents as equal. In practice, some agents may handle more complex tasks. This requires weighted partitioning with non-uniform capacity constraints.

3. **Hypergraph vs. graph:** The theoretical and practical case for hypergraph partitioning (FM, hMETIS) is strong for software systems with shared interfaces, but most empirical software clustering work uses standard graphs. More empirical work is needed comparing hypergraph-based task decomposition against graph-based decomposition for merge conflict minimization.

4. **Coupling metric calibration:** The optimal weighting of structural, co-change, and semantic coupling for the specific objective of minimizing merge conflicts in AI agent workflows has not been empirically established. This is a concrete research opportunity.

---

## References

1. Fiedler, M. (1973). "Algebraic connectivity of graphs." Czechoslovak Mathematical Journal, 23(98), 298-305.
2. Kernighan, B.W. and Lin, S. (1970). "An efficient heuristic procedure for partitioning graphs." Bell System Technical Journal, 49(2), 291-307.
3. Fiduccia, C.M. and Mattheyses, R.M. (1982). "A linear-time heuristic for improving network partitions." Proc. 19th Design Automation Conference, 175-181.
4. Karypis, G. and Kumar, V. (1998). "A fast and high quality multilevel scheme for partitioning irregular graphs." SIAM J. Scientific Computing, 20(1), 359-392. DOI: 10.1137/S1064827595287997.
5. Andreev, K. and Racke, H. (2006). "Balanced Graph Partitioning." Theory of Computing Systems, 39(6), 929-939. DOI: 10.1007/s00224-006-1350-7.
6. Arora, S., Rao, S., and Vazirani, U. (2009). "Expander flows, geometric embeddings and graph partitioning." J. ACM, 56(2), Article 5.
7. Leighton, T. and Rao, S. (1999). "Multicommodity max-flow min-cut theorems and their use in designing approximation algorithms." J. ACM, 46(6), 787-832.
8. Feldmann, A.E. and Foschini, L. (2012). "Fast Balanced Partitioning is Hard, Even on Grids and Trees." arXiv:1111.6745.
9. Lee, J.R., Oveis Gharan, S., and Trevisan, L. (2012). "Multiway spectral partitioning and higher-order Cheeger inequalities." J. ACM, 61(6), Article 37. arXiv:1301.5584.
10. Mancoridis, S., Mitchell, B.S., et al. (1998). "Using automatic clustering to produce high-level system organizations of source code." Proc. IWPC, 45-52.
11. Mitchell, B.S. and Mancoridis, S. (2006). "On the automatic modularization of software systems using the Bunch tool." IEEE TSE, 32(3), 193-208.
12. Murphy, G.C., Notkin, D., and Sullivan, K. (1995). "Software reflexion models: bridging the gap between source and high-level models." Proc. 3rd ACM SIGSOFT FSE, 18-28.
13. Murphy, G.C., Notkin, D., and Sullivan, K. (2001). "Software reflexion models: bridging the gap between design and implementation." IEEE TSE, 27(4), 364-380.
14. Martin, R.C. (1994). "OO Design Quality Metrics: An Analysis of Dependencies." Report on Object Analysis and Design, 1(3).
15. Henry, S. and Kafura, D. (1981). "Software structure metrics based on information flow." IEEE TSE, SE-7(5), 510-518.
16. Gall, H., Hajek, K., and Jazayeri, M. (1998). "Detection of logical coupling based on product release history." Proc. ICSM, 190-198.
17. Kasi, B.K. and Sarma, A. (2013). "Cassandra: Proactive conflict minimization through optimized task scheduling." Proc. ICSE, 732-741.
18. Accioly, P., Borba, P., and Cavalcanti, G. (2018). "Understanding semi-structured merge conflict characteristics in open-source Java projects." Empirical Software Engineering, 23(4), 2051-2085.
19. Papa, D.A. and Markov, I.L. (2007). "Hypergraph partitioning and clustering." Handbook of Approximation Algorithms and Metaheuristics, Chapman and Hall/CRC.
