# Distributed Coordination Theory Applied to Multi-Agent Software Engineering

**Research Round 4: Coordination Architecture Foundations**
**Date:** 2026-04-03

---

## 1. Concurrency Control Theory: Pessimistic vs. Optimistic

### Source Material

- Bernstein, P.A., Hadzilacos, V., & Goodman, N. (1987). *Concurrency Control and Recovery in Database Systems*. Addison-Wesley. [Freely available from Microsoft Research](https://www.microsoft.com/en-us/research/people/philbe/book/).
- Kung, H.T. & Robinson, J.T. (1981). "On Optimistic Methods for Concurrency Control." *ACM Transactions on Database Systems*, 6(2), 213-226. [DOI: 10.1145/319566.319567](https://dl.acm.org/doi/10.1145/319566.319567).

### Key Formal Results

Bernstein et al. established the foundational **serializability theorem**: a schedule is serializable if and only if its conflict graph (also called a serialization graph) is acyclic. This result underpins all concurrency control mechanisms.

**Two-Phase Locking (2PL)** guarantees serializability by requiring that all lock acquisitions precede all lock releases. The *Strict 2PL* variant holds all exclusive locks until transaction commit, additionally preventing cascading aborts.

**Optimistic Concurrency Control (OCC)**, formalized by Kung and Robinson (1981), divides transaction execution into three phases: (1) a *read phase* where data is accessed and modified in a private workspace, (2) a *validation phase* where serializability is checked against concurrent transactions, and (3) a *write phase* where changes are committed if validation succeeds, otherwise the transaction aborts and restarts. The protocol maintains read sets and write sets for each transaction, using backward validation to detect conflicts.

### Mapping to Multi-Agent Code Generation

The analogy is remarkably direct. Under pessimistic coordination (analogous to 2PL), agents acquire exclusive ownership of files or modules *before* beginning work. No two agents may concurrently modify overlapping resources. This is the approach taken by systems like RAPID's CONTRACT.json, where file ownership is declared upfront and enforced throughout execution.

Under optimistic coordination (analogous to OCC), agents work in isolated environments (git worktrees serve as private workspaces, precisely the "read phase"), then attempt to merge their changes. The merge step is the validation phase: if conflicts are detected (overlapping write sets), the agent's work is rejected and must be retried. This maps directly to the "develop on branch, merge to main" workflow used by tools like Cursor's multi-agent mode and the ccswarm framework.

### Limitations of the Analogy

Database transactions are short-lived (milliseconds to seconds); agent tasks may run for minutes. The cost of abort and retry is dramatically higher in the agent setting, since LLM inference is expensive. This shifts the calculus: even if conflicts are rare, the retry cost makes optimistic approaches less attractive than they are in databases, unless the conflict detection happens *before* expensive computation (e.g., pre-validating that file sets are disjoint before dispatching agents).

Additionally, database concurrency control assumes a well-defined "commit point." In agent workflows, the boundary between reading and writing is blurry; agents iteratively read, reason, and write throughout their execution.

---

## 2. Isolation Levels Applied to Agents

### Source Material

- Berenson, H., Bernstein, P., Gray, J., Melton, J., O'Neil, E., & O'Neil, P. (1995). "A Critique of ANSI SQL Isolation Levels." *Proceedings of the 1995 ACM SIGMOD International Conference on Management of Data*, 1-10. [DOI: 10.1145/223784.223785](https://dl.acm.org/doi/10.1145/223784.223785).
- Fekete, A., Liarokapis, D., O'Neil, E., O'Neil, P., & Shasha, D. (2005). "Making Snapshot Isolation Serializable." *ACM Transactions on Database Systems*, 30(2), 492-528.

### Key Formal Results

Berenson et al. (1995) demonstrated that the ANSI SQL-92 standard's definitions of isolation levels were ambiguous and incomplete. They introduced formal definitions based on *phenomena* (dirty reads, non-repeatable reads, phantoms) and identified **write skew** as an anomaly that occurs under snapshot isolation but not under serializable execution.

**Write skew** occurs when two transactions concurrently read an overlapping data set, make disjoint updates based on what they read, and both commit. Neither sees the other's write. Under serializable execution, one transaction would have seen the other's update, potentially changing its behavior.

**Snapshot isolation** gives each transaction a consistent view of the database as of its start time. It enforces the *first-committer-wins* rule: if two concurrent transactions write to the same item, only the first to commit succeeds. Critically, snapshot isolation prohibits write-write conflicts on the *same* item but permits write skew on *different* items.

### Mapping to Multi-Agent Code Generation

When agents work on git worktrees, they operate under something structurally similar to snapshot isolation. Each agent's worktree is a snapshot of the repository at branch creation time. The agent reads from this snapshot and writes to its own branch. At merge time, git detects textual write-write conflicts (overlapping modifications to the same file regions) but does *not* detect write skew.

**Write skew in codebases** is a semantic conflict: Agent A modifies function `validate()` in `auth.py`, while Agent B modifies function `process()` in `handler.py` that calls `validate()` with assumptions about its behavior. Neither agent touched the other's file, so git merges cleanly. But the combined result is broken because Agent B's code relies on pre-modification semantics of `validate()`.

**Phantom reads** in the agent context correspond to a new file or module appearing (created by one agent) that another agent's code should reference but does not, because the creating agent's changes were not visible at snapshot time.

### Limitations of the Analogy

Git's merge mechanism is purely textual, not semantic. Database isolation levels reason about logical consistency; git reasons about text overlap. A true "serializable" isolation level for agent coordination would require semantic analysis of code dependencies, which is undecidable in the general case. Practical approximations (dependency graphs, interface contracts, type-checking the merged result) can catch many but not all semantic conflicts.

---

## 3. Mechanism Design for Topology Selection

### Source Material

- Vickrey, W. (1961). "Counterspeculation, Auctions, and Competitive Sealed Tenders." *Journal of Finance*, 16(1), 8-37.
- Clarke, E.H. (1971). "Multipart Pricing of Public Goods." *Public Choice*, 11, 17-33.
- Groves, T. (1973). "Incentives in Teams." *Econometrica*, 41(4), 617-631.
- Nisan, N. & Ronen, A. (2001). "Algorithmic Mechanism Design." *Games and Economic Behavior*, 35(1-2), 166-196. [DOI: 10.1006/game.1999.0790](https://doi.org/10.1006/game.1999.0790).

### Key Formal Results

The **Vickrey-Clarke-Groves (VCG) mechanism** is a family of truthful mechanisms for social welfare maximization. The key theorem: in a VCG mechanism, each agent's payment equals the externality they impose on others (the difference in others' welfare with and without the agent's participation). Under this payment scheme, **truthful revelation is a dominant strategy**: each agent maximizes its own payoff by reporting its true valuation, regardless of what others report. This is the strongest form of incentive compatibility.

The **Gibbard-Satterthwaite theorem** (1973/1975) establishes that for unrestricted preference domains, the only strategy-proof social choice functions are dictatorial ones, *unless* monetary transfers are allowed. VCG mechanisms sidestep this impossibility by introducing payments.

### Mapping to Multi-Agent Code Generation

Consider the topology selection problem: a coordinator must assign tasks to agents and choose a coordination topology (hub-and-spoke, pipeline, swarm). Each agent has private information about (a) its capability for specific tasks, (b) its estimate of task difficulty, and (c) coupling density between its assigned module and others.

This can be formulated as a mechanism design problem. The coordinator is the mechanism; agents report their private information (task difficulty estimates, coupling assessments). The mechanism selects a topology that maximizes "social welfare" (overall code quality, minimized conflicts, fastest completion). Under a VCG-like mechanism, agents would be incentivized to report truthfully because misreporting would increase their "payment" (additional coordination overhead, rework cost).

Concretely: if an agent underreports coupling density to avoid coordination overhead, and a merge conflict results, the rework cost is borne by that agent (a natural "payment" that aligns incentives with truthful reporting).

### Limitations of the Analogy

VCG mechanisms require quasi-linear utility functions and monetary transfers. In agent systems, there is no natural "currency" for transfers (though compute budget could serve as a proxy). More fundamentally, current LLM agents do not have strategic incentives to misreport; they lack preferences. The mechanism design framing becomes relevant only in settings where agents are operated by different parties with misaligned objectives (e.g., a multi-vendor agent marketplace), or as a formal framework for analyzing information aggregation even in cooperative settings.

---

## 4. Conway's Law and Agent Topologies

### Source Material

- Conway, M.E. (1968). "How Do Committees Invent?" *Datamation*, 14(4), 28-31. [Available at melconway.com](https://www.melconway.com/Home/Conways_Law.html).
- MacCormack, A., Baldwin, C., & Rusnak, J. (2012). "Exploring the Duality between Product and Organizational Architectures: A Test of the Mirroring Hypothesis." *Research Policy*, 41(8), 1309-1324.

### Key Formal Results

Conway's original claim: "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations." This was initially rejected by the Harvard Business Review for lacking proof, but subsequent empirical work has validated it repeatedly.

MacCormack, Baldwin, and Rusnak (2012) formalized the **mirroring hypothesis** and tested it by comparing open-source and commercial software products. They found strong evidence that tightly-coupled organizational structures produce tightly-coupled architectures, and loosely-coupled organizations (like open-source communities) produce more modular architectures.

The **Inverse Conway Maneuver** (coined by LeRoy and Simons, 2010) deliberately structures teams to encourage a desired architecture, rather than letting organizational structure dictate architecture passively.

### Mapping to Multi-Agent Code Generation

When "organizations" are agent topologies, Conway's Law predicts that the coordination structure of agents will be reflected in the code they produce. A hub-and-spoke topology (one orchestrator, multiple workers) will tend to produce systems with a central coordinator and satellite modules. A mesh topology where all agents communicate freely will tend to produce more tightly-coupled code. A pipeline topology will produce systems with clear sequential data flow.

This insight is operationally significant: the choice of agent topology is also, implicitly, an architectural decision about the resulting software. The Inverse Conway Maneuver for agents means choosing agent topology to match the *desired* code architecture, not the other way around. If you want microservices, assign one agent per service with minimal inter-agent communication.

### Limitations of the Analogy

Conway's Law describes emergent organizational behavior over long time horizons. Agent tasks are short-lived and centrally orchestrated; the "communication structure" is explicitly designed rather than emergent. The analogy is strongest when agents have autonomy over design decisions within their scope, and weakest when a detailed specification fully determines the architecture regardless of agent topology.

---

## 5. Lamport Clocks and Task Ordering

### Source Material

- Lamport, L. (1978). "Time, Clocks, and the Ordering of Events in a Distributed System." *Communications of the ACM*, 21(7), 558-565. [DOI: 10.1145/359545.359563](https://dl.acm.org/doi/10.1145/359545.359563).

### Key Formal Results

Lamport defined the **happened-before** relation (denoted `->`) as the smallest relation satisfying: (1) if `a` and `b` are events in the same process and `a` comes before `b`, then `a -> b`; (2) if `a` is the send of a message and `b` is the receipt of that message, then `a -> b`; (3) transitivity. Events not ordered by `->` are concurrent.

A **logical clock** is a function `C` mapping events to natural numbers such that if `a -> b` then `C(a) < C(b)`. Lamport's algorithm increments a counter on each local event and takes the maximum of the local counter and the received timestamp (plus one) upon message receipt. This produces a total order consistent with the partial order, using process IDs to break ties.

### Mapping to Multi-Agent Code Generation

Agent tasks have data dependencies that form a partial order. If Task B depends on the output of Task A (e.g., B implements a function whose signature is defined by A), then A must happen before B. Tasks with no dependency relationship are concurrent and can be assigned to parallel agents.

Lamport timestamps provide a mechanism for tracking causal ordering in agent workflows. When Agent 1 completes Task A and notifies the coordinator, it attaches a logical timestamp. The coordinator assigns Task B to Agent 2 with a timestamp strictly greater than A's. This ensures that Agent 2's workspace includes Agent 1's committed changes, preventing stale reads.

The **critical path** through the task dependency graph determines the minimum wall-clock time; concurrent tasks off the critical path represent the parallelization opportunity. Lamport's framework formalizes when reordering is safe (concurrent events) versus when it violates correctness (causally ordered events).

### Limitations of the Analogy

Lamport clocks capture causal ordering but not the *degree* of dependency. In code, two tasks may be causally ordered but only weakly coupled (a minor interface change) or strongly coupled (a fundamental architectural dependency). The happened-before relation is binary, while code dependencies exist on a spectrum. Vector clocks (Fidge 1988, Mattern 1989) provide richer information about concurrency but still do not capture semantic coupling strength.

---

## 6. Linearizability and Progress Guarantees

### Source Material

- Herlihy, M. & Wing, J. (1990). "Linearizability: A Correctness Condition for Concurrent Objects." *ACM Transactions on Programming Languages and Systems*, 12(3), 463-492.
- Herlihy, M. (1991). "Wait-Free Synchronization." *ACM Transactions on Programming Languages and Systems*, 13(1), 124-149. [DOI: 10.1145/114005.102808](https://dl.acm.org/doi/10.1145/114005.102808).
- Herlihy, M. & Shavit, N. (2008). *The Art of Multiprocessor Programming*. Morgan Kaufmann.

### Key Formal Results

**Linearizability** requires that every concurrent execution is equivalent to some sequential execution that respects the real-time ordering of non-overlapping operations. It is the gold standard for concurrent object correctness.

Herlihy (1991) defined a hierarchy of progress guarantees:

- **Wait-freedom**: every operation completes in a bounded number of steps, regardless of other threads' behavior. The strongest guarantee; no thread can be starved.
- **Lock-freedom**: the system as a whole makes progress in a bounded number of steps (some operation completes), but individual threads may starve.
- **Obstruction-freedom**: a thread makes progress if it eventually runs in isolation (no contention). The weakest non-blocking guarantee.

The **consensus number hierarchy** (Herlihy 1991) is a landmark impossibility result: atomic read/write registers have consensus number 1 (they cannot solve consensus for 2 or more processes). Compare-and-swap has consensus number infinity. No object at level k can implement an object at level k+1 in a wait-free manner.

### Mapping to Multi-Agent Code Generation

Agent coordination protocols can be analyzed through this lens:

- A **wait-free** agent protocol guarantees that every agent completes its task in bounded time, regardless of other agents' behavior (failures, slowness). This is extremely strong; achieving it requires that no agent depends on any other agent's output.
- A **lock-free** protocol guarantees that *some* agent always makes progress, even if individual agents may be blocked waiting for dependencies. A pipeline where the next stage can always pick up the first available completed task provides this guarantee.
- An **obstruction-free** protocol guarantees that an agent makes progress if given exclusive access to shared resources. This matches the "one agent at a time on contested files" fallback used when optimistic merging fails.

The consensus number hierarchy implies that coordination primitives matter. A shared file system with atomic read/write (consensus number 1) cannot solve coordination problems requiring agreement among agents. This is why merge conflicts require a *separate coordination mechanism* (an orchestrator with compare-and-swap-like authority to accept or reject merges).

### Limitations of the Analogy

Progress guarantees in multiprocessor programming assume adversarial scheduling; agent coordination typically assumes a cooperative (or at least non-adversarial) scheduler. The practical concern is less about worst-case starvation and more about expected throughput. Furthermore, agent "operations" are not atomic in the processor sense; they are complex, stateful, and interruptible.

---

## 7. Consensus Protocols: Paxos and Raft

### Source Material

- Lamport, L. (1998). "The Part-Time Parliament." *ACM Transactions on Computer Systems*, 16(2), 133-169. [DOI: 10.1145/279227.279229](https://dl.acm.org/doi/10.1145/279227.279229).
- Ongaro, D. & Ousterhout, J. (2014). "In Search of an Understandable Consensus Algorithm." *Proceedings of the 2014 USENIX Annual Technical Conference*, 305-319. [Available at raft.github.io](https://raft.github.io/raft.pdf).
- Fischer, M.J., Lynch, N.A., & Paterson, M.S. (1985). "Impossibility of Distributed Consensus with One Faulty Process." *Journal of the ACM*, 32(2), 374-382. [DOI: 10.1145/3149.214121](https://dl.acm.org/doi/10.1145/3149.214121).

### Key Formal Results

The **FLP impossibility result** (Fischer, Lynch, and Paterson, 1985) proves that no deterministic protocol can guarantee consensus in an asynchronous system if even one process may crash. This is the fundamental impossibility result of distributed computing. Any consensus protocol must either sacrifice determinism (use randomization), sacrifice asynchrony (use timeouts/failure detectors), or sacrifice termination (allow infinite executions).

**Paxos** (Lamport, 1998) guarantees *safety* (agreement and validity) in all executions but guarantees *liveness* (termination) only under partial synchrony assumptions. The protocol proceeds in three phases: prepare, accept, and learn. It tolerates up to f failures among 2f+1 nodes.

**Raft** (Ongaro and Ousterhout, 2014) provides equivalent safety and liveness guarantees to Paxos but decomposes the problem into leader election, log replication, and safety. Its strong leader model simplifies reasoning: all writes go through the leader, and log entries flow in one direction (leader to followers).

### Mapping to Multi-Agent Code Generation

**When agents need consensus:** Agents need agreement when modifying shared state that must be consistent, specifically shared configuration files, API contracts, database schemas, or any artifact where inconsistency would break the system. The orchestrator in a hub-and-spoke topology acts as the Raft leader: it serializes all changes to shared artifacts, and agents (followers) accept the leader's decisions.

**When agents can operate independently:** When tasks are fully decomposed with disjoint file ownership, agents operate as independent state machines with no shared state. No consensus is needed. This is the common case in well-partitioned multi-agent workflows.

**The FLP impossibility and its implications:** In an asynchronous agent system where an agent may crash (LLM timeout, rate limit, OOM), it is impossible to guarantee that all agents will agree on the state of shared artifacts in bounded time. Practical systems use timeouts (partial synchrony assumption) to detect agent failures and reassign tasks.

Raft's leader-based model maps naturally to orchestrated multi-agent systems. The orchestrator is the leader; it maintains the authoritative "log" of changes to the codebase (the main branch). Agents propose changes (like Raft's log entries), and the orchestrator accepts or rejects them. Leader election corresponds to orchestrator failover.

### Limitations of the Analogy

Consensus protocols optimize for small messages (proposed values) replicated across many nodes. Agent coordination involves large, complex artifacts (code changes) with semantic content. The overhead of running a full consensus protocol for every code change would be prohibitive. In practice, multi-agent systems approximate consensus through much simpler mechanisms: sequential merges to a main branch, with the merge operation itself serving as the "commit" in the consensus sense.

---

## 8. Contract-Based Coordination: Design by Contract and Assume-Guarantee Reasoning

### Source Material

- Meyer, B. (1992). "Applying 'Design by Contract.'" *Computer*, 25(10), 40-51. [DOI: 10.1109/2.161279](https://doi.org/10.1109/2.161279).
- Henzinger, T., Qadeer, S., & Rajamani, S. (2002). "You Assume, We Guarantee: Methodology and Case Studies." *Proceedings of CAV 2002*, LNCS 2404, 440-451.
- Benveniste, A., Caillaud, B., Nickovic, D., Passerone, R., Raclet, J.B., Reinkemeier, P., Sangiovanni-Vincentelli, A., Damm, W., Henzinger, T., & Larsen, K.G. (2018). "Contracts for System Design." *Foundations and Trends in Electronic Design Automation*, 12(2-3), 124-400.

### Key Formal Results

Meyer's **Design by Contract** formalizes the obligations between a caller and a callee as a triple: *preconditions* (what the caller must guarantee), *postconditions* (what the callee must guarantee), and *invariants* (what both must maintain). This is semantically equivalent to Hoare triples `{P} S {Q}`, providing a foundation for compositional reasoning.

**Assume-guarantee reasoning** extends this to concurrent and compositional settings. Component A's guarantee becomes Component B's assumption, and vice versa. The key theorem: if each component satisfies its contract in isolation (assuming its environment satisfies the environment's contract), then the composed system satisfies the global specification. This enables *modular verification*, where each component is verified independently.

Benveniste et al. (2018) provide a comprehensive theory of contracts for system design, formalizing contract composition, refinement, and the relationship between assume-guarantee contracts and interface theories.

### Mapping to Multi-Agent Code Generation

CONTRACT.json in systems like RAPID is a direct implementation of assume-guarantee contracts for multi-agent coordination. Each agent's contract specifies:

- **Assumptions (preconditions):** what files/interfaces the agent expects to exist and their expected signatures or behaviors.
- **Guarantees (postconditions):** what files/interfaces the agent will create or modify, and the properties they will satisfy.
- **File ownership:** an exclusive write set, preventing write-write conflicts by construction.

This decomposition enables modular work: each agent can be verified independently against its contract. If Agent A guarantees that `auth.py` exports a function `validate(token: str) -> bool`, and Agent B assumes this interface exists, then as long as both agents satisfy their contracts, the composed system is correct.

The assume-guarantee framework also clarifies the failure modes. A **contract violation** occurs when an agent's output does not match its guaranteed postconditions (e.g., the function has a different signature). A **stale assumption** occurs when the contract itself is inconsistent with the actual codebase (the contract says `validate` exists, but it was renamed in a previous iteration).

### Limitations of the Analogy

Formal assume-guarantee reasoning requires precise, machine-checkable specifications. In practice, agent contracts are informal or semi-formal (JSON schemas describing file ownership and rough interface descriptions, not full behavioral specifications). The gap between the formal theory and practical implementation is substantial. Additionally, assume-guarantee reasoning assumes a fixed set of components with stable interfaces; agent workflows may dynamically discover new dependencies or require interface changes mid-execution.

---

## Cross-Cutting Synthesis

Several themes emerge across these eight theoretical dimensions:

**The isolation-coordination spectrum.** Every framework addresses the tension between independence (agents working in isolation for maximum parallelism) and coordination (agents synchronizing to prevent conflicts). Pessimistic locking, strict isolation levels, and exclusive file contracts sit at one end; optimistic concurrency, snapshot isolation, and late-stage merge validation sit at the other. The optimal point depends on conflict probability and retry cost.

**Impossibility results constrain the design space.** FLP impossibility means asynchronous agent systems cannot guarantee both safety and liveness without additional assumptions (timeouts, failure detectors). Herlihy's consensus hierarchy means simple shared state (read/write registers, i.e., files) cannot solve coordination problems requiring agreement. These results are not merely theoretical curiosities; they explain *why* multi-agent coding systems need orchestrators, sequential merge queues, and health-check timeouts.

**Contracts as the bridge between theory and practice.** Assume-guarantee contracts provide the most immediately applicable framework. They are already implemented (in simplified form) in real multi-agent systems, they enable compositional reasoning about correctness, and they naturally decompose the coordination problem into per-agent obligations. The gap between current practice (informal file ownership) and the theoretical ideal (machine-checkable behavioral contracts) represents the most promising direction for improving multi-agent code quality.

**Conway's Law as a design principle.** Unlike the other frameworks (which are primarily analytical), Conway's Law is *prescriptive* for topology selection. The choice of agent coordination topology should be driven by the desired software architecture, not by convenience. This inverts the usual question from "how do we coordinate agents?" to "what architecture do we want, and what agent topology will naturally produce it?"

---

## Sources

- [Bernstein, Hadzilacos, & Goodman (1987) - Concurrency Control and Recovery in Database Systems](https://www.sigmod.org/publications/dblp/db/books/dbtext/bernstein87.html)
- [Kung & Robinson (1981) - On Optimistic Methods for Concurrency Control](https://dl.acm.org/doi/10.1145/319566.319567)
- [Berenson et al. (1995) - A Critique of ANSI SQL Isolation Levels](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-95-51.pdf)
- [Vickrey-Clarke-Groves Mechanism - Wikipedia](https://en.wikipedia.org/wiki/Vickrey%E2%80%93Clarke%E2%80%93Groves_mechanism)
- [VCG Mechanisms - Stanford (Levin)](https://web.stanford.edu/~jdlevin/Econ%20285/Vickrey%20Auction.pdf)
- [Conway (1968) - How Do Committees Invent?](https://www.melconway.com/Home/Conways_Law.html)
- [Conway's Law - Martin Fowler](https://martinfowler.com/bliki/ConwaysLaw.html)
- [MacCormack, Baldwin, & Rusnak (2012) - Mirroring Hypothesis](https://en.wikipedia.org/wiki/Conway's_law)
- [Lamport (1978) - Time, Clocks, and the Ordering of Events](https://dl.acm.org/doi/10.1145/359545.359563)
- [Herlihy (1991) - Wait-Free Synchronization](https://cs.brown.edu/~mph/Herlihy91/p124-herlihy.pdf)
- [Herlihy & Shavit (2008) - The Art of Multiprocessor Programming](https://dl.acm.org/doi/book/10.5555/2385452)
- [Lamport (1998) - The Part-Time Parliament (Paxos)](https://lamport.azurewebsites.net/pubs/lamport-paxos.pdf)
- [Ongaro & Ousterhout (2014) - In Search of an Understandable Consensus Algorithm (Raft)](https://raft.github.io/raft.pdf)
- [Fischer, Lynch, & Paterson (1985) - FLP Impossibility](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf)
- [Meyer (1992) - Applying Design by Contract](https://en.wikipedia.org/wiki/Design_by_contract)
- [Benveniste et al. (2018) - Contracts for System Design](https://link.springer.com/chapter/10.1007/978-3-030-85315-0_9)
- [Snapshot Isolation - Jepsen](https://jepsen.io/consistency/models/snapshot-isolation)
- [Multi-Agent Coding: Parallel Development Guide](https://www.digitalapplied.com/blog/multi-agent-coding-parallel-development)
- [Addy Osmani - The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/)
