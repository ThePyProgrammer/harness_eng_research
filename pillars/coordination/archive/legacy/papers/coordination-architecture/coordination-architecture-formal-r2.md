# Type-Theoretic and Contract-Based Formalization for Multi-Agent Software Engineering Coordination

**Formal Methods Round 2**
**Date:** 2026-04-03

---

## 1. Assume-Guarantee Contracts for Agent Coordination

### 1.1 Formal Setup

**[Established theory: Meyer (1992), Henzinger et al. (2002), Benveniste et al. (2018)]**

Let $\mathcal{A} = \{A_1, \ldots, A_k\}$ be a set of $k$ agents operating on a codebase $\mathcal{F} = \{f_1, \ldots, f_n\}$. A **coordination contract** $\mathcal{C}$ is a tuple:

$$\mathcal{C} = (\{F_i\}_{i=1}^k, \; \{I_j\}_{j=1}^m, \; \sigma)$$

where:

- $F_i \subseteq \mathcal{F}$ is the **owned file set** of agent $A_i$, with $F_i \cap F_j = \emptyset$ for $i \neq j$ (disjointness)
- $\{I_j\}_{j=1}^m$ is a set of **interface specifications**, each $I_j = (\text{name}_j, \text{sig}_j, \text{module}_j)$ specifying a function name, its type signature, and its containing module
- $\sigma: \mathcal{F} \to 2^{\{I_1,\ldots,I_m\}}$ maps each file to the set of interfaces it exports

This directly formalizes the CONTRACT.json artifact used in systems like RAPID, where file ownership and interface declarations are specified before agent dispatch.

### 1.2 Per-Agent Contracts

**[Novel synthesis: applying Henzinger et al.'s assume-guarantee framework to agent coordination]**

Each agent $A_i$ operates under a contract $(Asm_i, Guar_i)$:

**Assumptions** $Asm_i$:

- (A1) No other agent modifies any file in $F_i$: $\forall j \neq i, \; \text{WriteSet}(A_j) \cap F_i = \emptyset$
- (A2) All interfaces $I_j$ referenced by $A_i$ but owned by other agents remain stable: if $f \notin F_i$ and $A_i$ calls $I_j$ where $I_j \in \sigma(f)$, then $\text{sig}_j$ is unchanged by other agents' modifications
- (A3) The snapshot $S_i$ provided to $A_i$ at dispatch time is a consistent state (compiles, passes tests)

**Guarantees** $Guar_i$:

- (G1) Agent $A_i$ modifies only files in $F_i$: $\text{WriteSet}(A_i) \subseteq F_i$
- (G2) For every interface $I_j \in \sigma(f)$ where $f \in F_i$, the post-modification signature matches $\text{sig}_j$ (interface preservation)
- (G3) The modifications, applied to $S_i$, produce a state that compiles and passes all tests scoped to $F_i$

### 1.3 Composition Theorem

**Theorem 1 (Contract Composition).** If every agent $A_i$ satisfies its contract, that is, assuming $Asm_i$ holds, $A_i$ establishes $Guar_i$, then the composed system (all agents' modifications merged) satisfies:

1. No write-write conflicts exist (from disjointness of $F_i$ and G1)
2. All specified interfaces are preserved (from G2 across all agents)
3. The merged codebase compiles (from G3 and interface preservation)

**Proof sketch** (rely-guarantee reasoning, following Jones 1983):

*Step 1.* By the disjointness condition $F_i \cap F_j = \emptyset$ and guarantee G1, each agent's write set is disjoint from every other agent's write set. This establishes the **rely condition** for each agent: the environment (all other agents) does not modify $A_i$'s files, satisfying A1.

*Step 2.* By G2, each agent preserves all interfaces in its owned files. Since A2 requires that interfaces outside $F_i$ remain stable, and G2 ensures interfaces inside every $F_j$ remain stable, every agent's A2 assumption is satisfied by the conjunction of all other agents' G2 guarantees. This is the **circular rely-guarantee discharge**: $Guar_j$ for $j \neq i$ collectively implies $Asm_i$.

*Step 3.* For compilation correctness, observe that each agent's modifications compile in isolation (G3) with respect to the interfaces they consume (A2, which is now discharged). Since the merged codebase preserves all interfaces, every call site remains type-consistent. By compositionality of type checking, the merged result type-checks. $\square$

**Remark.** This proof is modular: adding agent $A_{k+1}$ with a fresh $F_{k+1}$ disjoint from existing sets requires only verifying $A_{k+1}$'s contract, not re-verifying existing agents. This is the key advantage of assume-guarantee reasoning over monolithic verification.

### 1.4 Contract Coverage and Residual Risk

**[Novel synthesis]**

Define **contract coverage** $\gamma \in [0, 1]$ as the fraction of cross-module call sites covered by interface specifications in $\mathcal{C}$:

$$\gamma = \frac{|\{(f, I_j) : f \text{ calls } I_j \text{ and } I_j \in \mathcal{C}\}|}{|\{(f, g) : f \text{ calls any function in } g, \; f \in F_a, \; g \in F_b, \; a \neq b\}|}$$

When $\gamma = 1$, the composition theorem guarantees full interface preservation. When $\gamma < 1$, uncovered call sites represent potential semantic conflicts that the contract cannot prevent. The residual conflict probability for uncovered sites follows the pairwise model from the merge conflict literature (Brun et al., 2011):

$$P(\text{semantic conflict}) \leq (1 - \gamma) \cdot \rho \cdot \binom{k}{2}$$

where $\rho$ is the per-pair, per-uncovered-site conflict probability and $k$ is the agent count.

---

## 2. Isolation Levels as a Type System

### 2.1 Mapping Database Isolation to Agent Coordination

**[Established theory: Berenson et al. (1995), Fekete et al. (2005); novel application to agent coordination]**

We define four isolation levels for multi-agent code generation, each corresponding to a database isolation level and a concrete implementation mechanism:

| Isolation Level | Database Analog | Agent Mechanism | Anomalies Prevented | Anomalies Permitted |
|----------------|----------------|-----------------|---------------------|---------------------|
| $\mathsf{ReadUncommitted}$ | Read Uncommitted | Shared workspace, no branches | None | Dirty reads, non-repeatable reads, phantoms, write skew |
| $\mathsf{ReadCommitted}$ | Read Committed | Git branches, periodic pulls from main | Dirty reads | Non-repeatable reads, phantoms, write skew |
| $\mathsf{Snapshot}$ | Snapshot Isolation | Git worktrees (frozen at dispatch) | Dirty reads, non-repeatable reads, phantoms | Write skew |
| $\mathsf{Serializable}$ | Serializable | Sequential execution (one agent at a time) | All | None |

### 2.2 Anomalies in Code Terms

**Dirty Read.** Agent $A_i$ reads a file that $A_j$ is currently modifying but has not committed. The read reflects a half-finished, possibly inconsistent state. In a shared workspace, $A_i$ might import a function whose signature $A_j$ is in the middle of changing.

**Non-Repeatable Read.** Agent $A_i$ reads file $f$ at time $t_1$, then reads it again at $t_2 > t_1$, observing different content because $A_j$ committed a change in between. Under $\mathsf{ReadCommitted}$, this can occur when $A_i$ pulls from main mid-task.

**Phantom.** Agent $A_i$ queries the codebase for "all files matching pattern $P$" at time $t_1$, then again at $t_2$, and the set has changed because $A_j$ created a new file. Under $\mathsf{Snapshot}$, this cannot happen because the worktree is frozen.

**Write Skew.** The critical anomaly. Agents $A_i$ and $A_j$ both read an overlapping set of files, then make disjoint modifications based on what they read. Neither modifies the other's files, so no write-write conflict is detected. However, each agent's modifications are predicated on assumptions that the other agent's changes invalidate.

### 2.3 Write Skew as the Critical Anomaly

**[Novel synthesis]**

**Theorem 2.** Under $\mathsf{Snapshot}$ isolation (git worktrees), write skew is the only permitted anomaly class, and it corresponds exactly to semantic merge conflicts.

*Proof sketch.* Worktrees provide each agent a frozen, consistent snapshot at dispatch time, preventing dirty reads and non-repeatable reads. The snapshot is a complete copy, preventing phantoms. Write-write conflicts on the same file are detected by git's merge mechanism (first-committer-wins or textual conflict). The remaining anomaly is write skew: agent $A_i$ modifies $f_a \in F_i$ based on reading $f_b \in F_j$, while $A_j$ modifies $f_b$ based on reading $f_a$. Both commits succeed because they touch disjoint files, but the combined state is inconsistent. $\square$

**Corollary.** Contracts eliminate write skew for covered interfaces. If both $f_a$'s dependence on $f_b$ and $f_b$'s dependence on $f_a$ are captured as interface specifications in $\mathcal{C}$, then G2 ensures both interfaces are preserved, and write skew cannot produce an inconsistency at those call sites.

This yields a **type-theoretic interpretation**: define a type judgment $\Gamma \vdash_\gamma e : \tau$ where $\Gamma$ is the interface environment, $\gamma$ is the contract coverage, and well-typedness at coverage $\gamma = 1$ implies semantic conflict freedom. At $\gamma < 1$, the judgment is partial: well-typed up to uncovered dependencies.

---

## 3. Coordination Cost Algebra

### 3.1 Cost Function Definition

**[Novel synthesis, building on Kim et al. (2025) and Gunther (2008)]**

Define the **coordination cost** $C(t, k, \rho)$ as a function of topology $t \in \{\mathsf{Ind}, \mathsf{Cen}, \mathsf{Hier}, \mathsf{IsoMerge}\}$, agent count $k$, and coupling density $\rho \in [0, 1]$ (the fraction of file pairs across agent boundaries that are coupled).

Let $\mu$ denote per-message cost (in tokens or time), $\omega$ denote per-worktree setup cost, and $\gamma$ denote contract coverage as before.

### 3.2 Per-Topology Cost Formulas

**Independent topology** ($\mathsf{Ind}$):

$$C_{\text{exec}}(\mathsf{Ind}, k, \rho) = 0$$
$$C_{\text{merge}}(\mathsf{Ind}, k, \rho) = \binom{k}{2} \cdot \rho \cdot c_{\text{resolve}}$$

No coordination during execution; all conflict resolution is deferred to merge. Pairwise compatibility checking yields $O(k^2 \cdot \rho)$ merge cost. This matches the 17.2x error amplification observed by Kim et al. (2025) for independent architectures.

**Centralized topology** ($\mathsf{Cen}$):

$$C_{\text{exec}}(\mathsf{Cen}, k, \rho) = k \cdot \mu \cdot r$$
$$C_{\text{merge}}(\mathsf{Cen}, k, \rho) = k \cdot c_{\text{integrate}}$$

where $r$ is the number of coordination rounds. Each agent communicates with the hub $r$ times; the hub serializes integration. This matches the 4.4x error amplification (lower, due to hub-mediated error correction) at 285% overhead from Kim et al.

**Hierarchical topology** ($\mathsf{Hier}$):

$$C_{\text{exec}}(\mathsf{Hier}, k, \rho) = k \cdot \log_b(k) \cdot \mu \cdot r$$
$$C_{\text{merge}}(\mathsf{Hier}, k, \rho) = k \cdot \log_b(k) \cdot c_{\text{integrate}}$$

where $b$ is the branching factor. Communication travels $O(\log_b k)$ hops up the tree. This interpolates between centralized (low error amplification) and independent (low overhead).

**Isolated-then-Merge with Contracts** ($\mathsf{IsoMerge}$, the RAPID model):

$$C_{\text{setup}}(\mathsf{IsoMerge}, k) = k \cdot \omega$$
$$C_{\text{exec}}(\mathsf{IsoMerge}, k, \rho) = 0$$
$$C_{\text{merge}}(\mathsf{IsoMerge}, k, \rho, \gamma) = \binom{k}{2} \cdot (1 - \gamma) \cdot \rho \cdot c_{\text{resolve}} + k \cdot c_{\text{verify}}$$

### 3.3 The Contract Reduction Theorem

**Theorem 3.** As contract coverage $\gamma \to 1$, the merge cost of $\mathsf{IsoMerge}$ reduces from $O(k^2 \cdot \rho)$ to $O(k)$.

*Proof.* In the merge cost formula, the first term is $\binom{k}{2}(1-\gamma)\rho \cdot c_{\text{resolve}}$. As $\gamma \to 1$, this term vanishes: $(1 - \gamma) \to 0$. The remaining term $k \cdot c_{\text{verify}}$ is linear in $k$ (each agent's output is verified against its contract independently). Therefore $C_{\text{merge}} \to O(k)$. $\square$

**Corollary (Total cost comparison).** For $\gamma$ sufficiently close to 1, $\mathsf{IsoMerge}$ has the lowest total cost among all topologies:

$$C_{\text{total}}(\mathsf{IsoMerge}) = k\omega + k \cdot c_{\text{verify}} + \epsilon$$

where $\epsilon = \binom{k}{2}(1-\gamma)\rho \cdot c_{\text{resolve}}$ is small. This is $O(k)$, compared to $O(k \cdot \mu \cdot r)$ for centralized and $O(k^2 \cdot \rho)$ for independent.

### 3.4 Cost Sensitivity Analysis

The crossover point where $\mathsf{IsoMerge}$ becomes cheaper than $\mathsf{Cen}$ satisfies:

$$k\omega + \binom{k}{2}(1-\gamma)\rho \cdot c_{\text{resolve}} < k \cdot \mu \cdot r + k \cdot c_{\text{integrate}}$$

Solving for $\gamma$:

$$\gamma > 1 - \frac{2(\mu \cdot r + c_{\text{integrate}} - \omega)}{(k-1) \cdot \rho \cdot c_{\text{resolve}}}$$

For large $k$ and moderate $\rho$, even modest contract coverage ($\gamma > 0.5$) makes $\mathsf{IsoMerge}$ cheaper. This formalizes the empirical intuition that contracts are most valuable as team size grows.

---

## 4. Correctness Conditions

### 4.1 Definitions

**[Established theory: Herlihy and Wing (1990); novel application]**

**Definition (Strong correctness, linearizability analog).** A multi-agent execution $\mathcal{E} = \{A_1(\Delta_1), \ldots, A_k(\Delta_k)\}$ producing diffs $\Delta_1, \ldots, \Delta_k$ is **strongly correct** if there exists a sequential ordering $\pi$ of the agents such that applying $\Delta_{\pi(1)}, \Delta_{\pi(2)}, \ldots, \Delta_{\pi(k)}$ in sequence (each agent seeing the results of all prior agents) produces the same final state as the merged result of parallel execution.

Strong correctness is equivalent to serializability. It is a very demanding condition: it requires that the parallel execution could have been performed sequentially with the same outcome.

**Definition (Weak correctness).** A multi-agent execution is **weakly correct** if the merged result:

- (W1) Compiles without errors
- (W2) Passes all pre-existing tests plus any new tests added by agents
- (W3) Preserves all interface specifications in contract $\mathcal{C}$

Weak correctness does not require equivalence to any sequential execution. It permits outcomes that no sequential execution would produce, so long as those outcomes are functionally valid.

### 4.2 Relationship Between Conditions

**Theorem 4.** Strong correctness implies weak correctness, but not conversely.

*Proof.* The forward direction is immediate: any serializable execution compiles, passes tests, and preserves interfaces (since each sequential step does). For the converse, consider two agents that both add a utility function with the same name but different implementations. The merged result (with one renamed during conflict resolution) compiles and passes tests, but corresponds to no sequential execution where both agents are aware of each other's additions. $\square$

### 4.3 Achievability Under Snapshot Isolation + Contracts

**Theorem 5.** Under $\mathsf{Snapshot}$ isolation with contract coverage $\gamma$ and 5-level merge detection (textual, structural, dependency, API, semantic), weak correctness holds with probability at least:

$$P(\text{weak correct}) \geq 1 - (1-\gamma) \cdot \rho \cdot \binom{k}{2} \cdot (1 - d_5)$$

where $d_5$ is the detection rate of the 5-level merge pipeline for semantic conflicts.

*Proof sketch.* Snapshot isolation eliminates dirty reads, non-repeatable reads, and phantoms (Theorem 2). Contract coverage $\gamma$ eliminates write skew for covered interfaces (Corollary to Theorem 2). For uncovered interfaces, each cross-boundary file pair has probability $\rho$ of coupling and probability $(1 - d_5)$ of the semantic conflict going undetected. There are $\binom{k}{2}$ agent pairs. Taking the union bound over all potential conflict sites yields the stated bound. $\square$

**Calibration.** Using empirical values: $\rho \approx 0.15$ (from merge conflict rate data; Kasi and Sarma, 2013), $d_5 \approx 0.75$ (from SafeMerge's 75% verification rate; Sousa et al., 2018), $k = 5$ agents, $\gamma = 0.8$ (80% interface coverage):

$$P(\text{weak correct}) \geq 1 - 0.2 \cdot 0.15 \cdot 10 \cdot 0.25 = 1 - 0.075 = 0.925$$

A 92.5% probability of weak correctness, improvable by increasing $\gamma$ or $d_5$.

---

## 5. Conway's Law as a Typing Constraint

### 5.1 Graph-Theoretic Formalization

**[Established theory: Conway (1968), MacCormack et al. (2012); novel formalization]**

**Definition.** The **communication graph** induced by agent topology $T$ is $G_T = (\mathcal{A}, E_T)$, where $(A_i, A_j) \in E_T$ if and only if agents $A_i$ and $A_j$ can exchange messages under topology $T$.

- $\mathsf{Ind}$: $E_T = \emptyset$ (no edges)
- $\mathsf{Cen}$: $E_T = \{(A_i, A_{\text{hub}}) : i \neq \text{hub}\}$ (star graph)
- $\mathsf{Hier}$: $E_T$ forms a tree
- $\mathsf{Mesh}$: $E_T = \mathcal{A} \times \mathcal{A} \setminus \{(A_i, A_i)\}$ (complete graph)

**Definition.** The **module dependency graph** of the codebase is $G_M = (\mathcal{M}, E_M)$, where $\mathcal{M} = \{M_1, \ldots, M_p\}$ are modules (packages, services, bounded contexts) and $(M_a, M_b) \in E_M$ if module $M_a$ depends on module $M_b$.

**Definition.** The **assignment function** $\alpha: \mathcal{M} \to \mathcal{A}$ maps modules to agents. This induces a **required communication graph** $G_R = (\mathcal{A}, E_R)$ where:

$$(A_i, A_j) \in E_R \iff \exists (M_a, M_b) \in E_M \text{ with } \alpha(M_a) = A_i, \; \alpha(M_b) = A_j, \; i \neq j$$

### 5.2 Conway's Law, Formalized

**Theorem 6 (Conway's Law, graph-theoretic form).** If the required communication graph $G_R$ is not a subgraph of the topology communication graph $G_T$ (that is, $E_R \not\subseteq E_T$), then for every edge $(A_i, A_j) \in E_R \setminus E_T$, the agents managing the dependent modules cannot coordinate, producing a semantic conflict with probability proportional to the coupling strength of the underlying module dependency.

In plain terms: if two modules are coupled but their agents cannot communicate, the resulting code will reflect that communication gap as an integration defect.

### 5.3 Optimal Topology and Mismatch Cost

**[Novel synthesis]**

**Definition (Topology-module mismatch cost).** Given assignment $\alpha$, topology $T$, and module graph $G_M$ with edge weights $w: E_M \to \mathbb{R}^+$ (coupling strength):

$$\text{Mismatch}(\alpha, T, G_M) = \sum_{(A_i, A_j) \in E_R \setminus E_T} \sum_{\substack{(M_a, M_b) \in E_M \\ \alpha(M_a)=A_i, \alpha(M_b)=A_j}} w(M_a, M_b)$$

This sums the coupling weights of all module dependencies whose agents cannot communicate. Mismatch = 0 when $E_R \subseteq E_T$, which is the necessary condition for Conway-aligned coordination.

**Theorem 7 (Inverse Conway for Agents).** The assignment $\alpha^*$ minimizing $\text{Mismatch}(\alpha, T, G_M)$ for a given topology $T$ is the solution to a weighted graph partitioning problem: partition $G_M$ into $k$ parts (one per agent) minimizing cross-partition edge weight for edges not covered by $E_T$.

*Proof sketch.* Each assignment $\alpha$ induces a $k$-partition of $\mathcal{M}$. Cross-partition edges correspond to inter-agent dependencies. Those covered by $E_T$ have zero mismatch cost; those not covered contribute their weight. Minimizing total mismatch is therefore equivalent to minimizing the uncovered cross-partition cut weight, which is a constrained balanced min-cut problem (NP-hard in general; see Section 5 of Research Round 2). $\square$

### 5.4 Special Cases

**For $\mathsf{Ind}$ topology** ($E_T = \emptyset$): Mismatch equals the total cross-partition coupling weight, since no inter-agent communication exists. Minimizing mismatch reduces to the standard balanced min-cut on $G_M$. This is why task decomposition quality is critical for independent agents.

**For $\mathsf{Mesh}$ topology** ($E_T$ is complete): Mismatch = 0 for any assignment, since all agent pairs can communicate. However, the communication overhead is $O(k^2)$, which Kim et al. (2025) showed produces 263% coordination overhead.

**For $\mathsf{IsoMerge}$ with contracts**: Communication is replaced by contracts. The mismatch cost for uncovered dependencies is:

$$\text{Mismatch}_{\gamma}(\alpha, G_M) = (1 - \gamma) \cdot \sum_{(A_i, A_j) \in E_R} \sum_{\substack{(M_a, M_b) \in E_M \\ \alpha(M_a)=A_i, \alpha(M_b)=A_j}} w(M_a, M_b)$$

Contracts act as a **static communication channel**: they convey interface information without runtime message passing. As $\gamma \to 1$, the effective mismatch approaches zero regardless of the underlying topology's communication graph, because all cross-boundary dependencies are specified.

---

## Summary of Formal Results

| # | Statement | Type | Depends On |
|---|-----------|------|------------|
| **Thm 1** | Contract composition preserves interfaces under disjoint ownership | Established framework, novel application | Jones (1983), Meyer (1992) |
| **Thm 2** | Under snapshot isolation, write skew is the sole permitted anomaly | Novel synthesis | Berenson et al. (1995) |
| **Thm 3** | Contracts reduce merge cost from $O(k^2)$ to $O(k)$ as $\gamma \to 1$ | Novel | Thm 1 |
| **Thm 4** | Strong correctness implies weak correctness (strict) | Novel definition | Herlihy and Wing (1990) |
| **Thm 5** | Probabilistic weak correctness bound under snapshot + contracts | Novel | Thms 2, 3 |
| **Thm 6** | Conway's Law as communication graph containment | Novel formalization | Conway (1968) |
| **Thm 7** | Inverse Conway reduces to constrained balanced min-cut | Novel | Thm 6, R2 hardness results |

---

## References

- Benveniste, A., et al. (2018). "Contracts for System Design." Foundations and Trends in EDA, 12(2-3), 124-400.
- Berenson, H., et al. (1995). "A Critique of ANSI SQL Isolation Levels." SIGMOD 1995.
- Brun, Y., et al. (2011). "Proactive Detection of Collaboration Conflicts." ESEC/FSE 2011.
- Conway, M.E. (1968). "How Do Committees Invent?" Datamation, 14(4), 28-31.
- Fekete, A., et al. (2005). "Making Snapshot Isolation Serializable." ACM TODS, 30(2), 492-528.
- Gunther, N.J. (2008). "A General Theory of Computational Scalability." arXiv:0808.1431.
- Henzinger, T., Qadeer, S., and Rajamani, S. (2002). "You Assume, We Guarantee." CAV 2002, LNCS 2404.
- Herlihy, M. and Wing, J. (1990). "Linearizability: A Correctness Condition for Concurrent Objects." ACM TOPLAS, 12(3), 463-492.
- Jones, C.B. (1983). "Specification and Design of (Parallel) Programs." IFIP Congress 1983.
- Kasi, B.K. and Sarma, A. (2013). "Cassandra: Proactive conflict minimization." ICSE 2013.
- Kim, Y., et al. (2025). "Towards a Science of Scaling Agent Systems." arXiv:2512.08296.
- MacCormack, A., Baldwin, C., and Rusnak, J. (2012). "Exploring the Duality between Product and Organizational Architectures." Research Policy, 41(8), 1309-1324.
- Meyer, B. (1992). "Applying Design by Contract." Computer, 25(10), 40-51.
- Sousa, M., Dillig, I., and Lahiri, S.K. (2018). "Verifying Semantic Conflict-Freedom in Three-Way Program Merges." OOPSLA 2018.
