# Historical & Foundational Security Theory for AI Agent Harnesses

**Research Dimension:** Historical & Foundational Security Theory
**Date:** 2026-04-03
**Status:** Round 1 Research

---

## 1. Access Control Matrix Theory (Lampson 1971)

### Source

Butler W. Lampson, "Protection," *Proceedings of the 5th Princeton Conference on Information Sciences and Systems*, p. 437, 1971. Republished in *ACM SIGOPS Operating Systems Review* 8(1):18--24, 1974.

### Formal Definition

The access control matrix is an abstract, formal security model that characterizes the protection state of a computer system as a triple:

**Definition (Protection State).** A protection state is a triple (S, O, A) where:
- **S** is a finite set of *subjects* (active entities: users, processes, domains)
- **O** is a finite set of *objects* (passive entities requiring protection: files, memory pages, I/O devices), with S included in O (subjects are also objects)
- **A** is the *access matrix*, a mapping A: S x O -> P(R), where R is a finite set of *access rights* (e.g., read, write, execute, own) and P(R) is the power set of R

Each element A[s, o] specifies the set of access rights that subject s holds over object o. The matrix is sparse in practice; a literal two-dimensional array implementation would have excessive memory requirements.

### Implementation Decompositions

The access matrix admits two canonical decompositions:

1. **By column (Access Control Lists):** For each object o, the ACL is the list { (s, A[s,o]) | A[s,o] is not empty }. This associates with each resource the set of subjects permitted to access it.

2. **By row (Capability Lists):** For each subject s, the C-list is the list { (o, A[s,o]) | A[s,o] is not empty }. This associates with each subject the set of (object, rights) pairs it holds.

Lampson also introduced the *copy flag*, a bit attached to each access attribute controlling whether the right can be transferred to other domains.

### Application to AI Agent Harnesses

The Lampson matrix maps directly onto the agent-harness security problem:

| Matrix Concept | Harness Equivalent |
|---|---|
| Subjects (S) | AI agents, sub-agents, tool executors, the harness runtime itself |
| Objects (O) | Files, API endpoints, environment variables, credentials, network sockets, other agents |
| Rights (R) | read, write, execute, create, delete, invoke, delegate |
| A[s,o] | The specific permission set an agent holds over a given resource |

The harness configuration file (e.g., `allowed_tools`, `file_access` rules) is effectively a serialized, sparse representation of the access matrix. Each tool permission grant corresponds to a non-empty cell in the matrix.

### Key Limitations

- **Static snapshot:** The matrix captures a point-in-time protection state. It does not inherently model how the state evolves under operations (that is the domain of HRU, below).
- **No information flow:** The matrix says nothing about what happens to data after a permitted read. A subject with read access to a secret and write access to a public channel can exfiltrate freely.
- **Ambient authority:** In ACL-based implementations, subjects carry an ambient identity that grants them all rights associated with that identity, making least-privilege enforcement difficult.

---

## 2. Harrison-Ruzzo-Ullman (HRU) Undecidability Result (1976)

### Source

Michael A. Harrison, Walter L. Ruzzo, and Jeffrey D. Ullman, "Protection in Operating Systems," *Communications of the ACM* 19(8):461--471, August 1976.

### Formal Model

**Definition (HRU Protection System).** A protection system is a tuple (R, C) where:
- **R** is a finite set of generic rights
- **C** is a finite set of commands

A *configuration* is a triple Q = (S, O, P) where:
- S is the current set of subjects
- O is the current set of objects (S included in O)
- P is the access matrix, P: S x O -> P(R)

Each command c in C has the form:

```
command c(x1, ..., xk)
  if r1 in P[xs1, xo1] and ... and rm in P[xsm, xom]
  then
    op1; op2; ...; opn
end
```

where each op_i is one of six *primitive operations*:
1. **enter r into P[s, o]** -- add right r to cell (s, o)
2. **delete r from P[s, o]** -- remove right r from cell (s, o)
3. **create subject s'** -- add a new subject
4. **create object o'** -- add a new object
5. **destroy subject s'** -- remove a subject
6. **destroy object o'** -- remove an object

### The Safety Problem

**Definition (Safety).** A protection system with initial configuration Q0 is *safe* for a right r if there is no reachable configuration Q in which r appears in a cell of P where it was not present in Q0. Informally: can the system ever leak right r to an unauthorized (subject, object) pair?

### The Undecidability Theorem

**Theorem (HRU 1976).** The safety problem for the general HRU model is undecidable.

*Proof sketch.* Harrison, Ruzzo, and Ullman showed that any Turing machine can be simulated by an HRU protection system. The access matrix encodes the tape, subjects encode the head position and state, and commands encode transitions. Since the halting problem for Turing machines is undecidable, and safety can be reduced to halting, safety is undecidable.

### Decidable Subcases

**Theorem (HRU 1976, corrected by Tripunitara & Li 2013).** Safety is decidable for *mono-operational* HRU systems, where each command contains exactly one primitive operation.

**Complexity.** The safety problem for mono-operational systems is NP-complete.

*Note:* The original HRU paper contained a proof error: it assumed mono-operational systems are monotonic for safety analysis (i.e., that delete operations can be ignored). Tripunitara and Li (IEEE TDSC, 2013) showed this assumption is faulty and provided corrected proofs. Delete and destroy operations cannot be ignored in the safety analysis.

**Additional decidable case:** Monotonic systems (those with no delete or destroy operations) also have a decidable safety problem.

### Application to AI Agent Harnesses

The HRU result has profound implications for harness security:

1. **General sandbox security is unprovable.** If the harness allows agents to create new resources, grant permissions, and invoke arbitrary command sequences, proving that no sequence of operations can leak a credential is equivalent to solving the halting problem. You cannot write a static analyzer that answers "will this agent configuration ever leak my API key?" for all possible execution traces.

2. **Restrict to decidable subcases.** Practical harness designs should aim for mono-operational or monotonic permission systems:
   - **Mono-operational:** Each harness command does exactly one thing (grant one permission, revoke one permission, create one resource). No compound operations.
   - **Monotonic:** Permissions are only granted at initialization and never expanded at runtime. The agent cannot create new subjects or grant new rights. This is the model most sandbox implementations actually use.

3. **Static permission sets are analyzable.** If the harness freezes the access matrix before the agent starts executing (no runtime permission changes), safety becomes trivially decidable: just inspect the initial matrix.

### Key Limitations

- The NP-completeness of mono-operational safety means that even in the decidable case, verification does not scale well for large permission sets.
- The model assumes a closed system; it does not account for side channels or information flow.

---

## 3. Capability-Based Security (Dennis & Van Horn 1966)

### Source

Jack B. Dennis and Earl C. Van Horn, "Programming Semantics for Multiprogrammed Computations," *Communications of the ACM* 9(3):143--155, March 1966.

Key subsequent work:
- Mark S. Miller, Ka-Ping Yee, and Jonathan Shapiro, "Capability Myths Demolished," Technical Report SRL2003-02, Johns Hopkins University, 2003.
- Robert N.M. Watson et al., "Capsicum: Practical Capabilities for UNIX," *USENIX Security Symposium*, 2010.

### Formal Definition

**Definition (Capability).** A capability is an unforgeable token that both *designates* (names) an object and *authorizes* a specific set of operations on that object. Possession of a capability is both necessary and sufficient for exercising the authorized rights.

In Dennis and Van Horn's framework:
- Each process contains a pointer to a *C-list* (capability list)
- Each capability in the C-list names an object and specifies the permitted access rights
- A process executes within a *sphere of protection* (domain) defined by its C-list
- Capabilities can be selectively delegated to other processes

### Capabilities vs. ACLs

| Property | ACL Systems | Capability Systems |
|---|---|---|
| Authority location | Centralized, attached to objects | Distributed, held by subjects |
| Designation | Separated from authorization | Unified with authorization |
| Ambient authority | Present (identity implies rights) | Absent (only explicit capabilities grant access) |
| Least privilege | Difficult (all-or-nothing identity) | Natural (pass only needed capabilities) |
| Confused deputy | Vulnerable (see Section 7) | Resistant (authority travels with designation) |
| Revocation | Easy (modify central ACL) | Requires indirection (caretaker pattern) |

### The Three Myths (Miller, Yee, Shapiro 2003)

Miller et al. demolished three widely believed myths about capabilities:

1. **The Equivalence Myth:** "ACL systems and capability systems are formally equivalent." *False.* The equivalence holds only for static snapshots; the dynamic security properties diverge fundamentally. Capabilities enforce the *principle of least authority* (POLA) structurally, while ACLs cannot without additional mechanism.

2. **The Confinement Myth:** "Capability systems cannot enforce confinement." *False.* Object-capability systems can enforce confinement through careful construction of the initial capability graph.

3. **The Irrevocability Myth:** "Capability-based access cannot be revoked." *False.* Revocation is achievable through *caretaker* or *membrane* patterns that interpose a revocable intermediary.

### The E Language and Object Capabilities

Mark S. Miller's E programming language (1997) implemented the *object-capability model* (ocap), where:
- Object references serve as capabilities
- No ambient authority exists; all authority derives from the initial capability endowment
- The language enforces capability discipline through its semantics (no global mutable state, no reflection that bypasses encapsulation)

### Capsicum (FreeBSD)

Capsicum (Watson et al., 2010) brings capability-based security to UNIX:
- **Capability mode:** Once a process enters capability mode, it cannot access any global namespace (no open(), no connect()). It can only derive new file descriptors from existing ones.
- **Capabilities as extended file descriptors:** A capability is a file descriptor augmented with a rights mask.
- Integrated into FreeBSD since version 10.0; used by tcpdump, dhclient, chromium, and others.

### Application to AI Agent Harnesses

Capability-based security is arguably the most natural model for agent harness design:

1. **Agent initialization as capability endowment.** When the harness spawns an agent, it passes a specific set of capabilities (file handles, API tokens, tool references). The agent cannot acquire capabilities it was not given.

2. **No ambient authority.** The agent should not be able to discover resources by name; it should only operate on resources explicitly provided. This eliminates entire classes of path-traversal and environment-variable-sniffing attacks.

3. **Delegation with attenuation.** When an agent delegates a sub-task, it should pass a *subset* of its own capabilities (attenuated capabilities). The sub-agent cannot escalate beyond what was delegated.

4. **Revocation through membranes.** The harness can wrap each capability in a revocable proxy. If the agent misbehaves, all its capabilities can be revoked simultaneously by revoking the membrane.

5. **Capsicum as implementation model.** A harness that enters Capsicum capability mode after initialization gets kernel-enforced capability discipline. The agent process literally cannot open files or network connections not provided by the harness.

### Key Limitations

- Capability systems require careful initial setup; if the initial capability graph is too permissive, the system provides no protection.
- Capability delegation creates accountability challenges: tracking who delegated what to whom requires explicit audit infrastructure.
- Most existing tool ecosystems assume ambient authority (environment variables, configuration files in well-known paths), making capability discipline hard to retrofit.

---

## 4. Information Flow Control (Denning 1976)

### Source

Dorothy E. Denning, "A Lattice Model of Secure Information Flow," *Communications of the ACM* 19(5):236--243, May 1976.

Key subsequent work:
- Joseph A. Goguen and Jose Meseguer, "Security Policies and Security Models," *IEEE Symposium on Security and Privacy*, pp. 11--20, 1982.
- Andrew C. Myers and Barbara Liskov, "A Decentralized Model for Information Flow Control," *Proceedings of the 16th ACM Symposium on Operating Systems Principles (SOSP)*, pp. 129--142, 1997.

### Denning's Lattice Model

**Definition (Security Class Lattice).** A secure information flow model is defined by a tuple (SC, <=, join, meet) where:
- **SC** is a finite set of *security classes* (labels)
- **<=** is a partial order (the "dominates" relation) on SC
- **join** (written as the "least upper bound" operator) gives the unique minimal element dominating both arguments
- **meet** (written as the "greatest lower bound" operator) gives the unique maximal element dominated by both arguments

The quadruple (SC, <=, join, meet) must form a *lattice*: for every pair of elements a, b in SC, both join(a,b) and meet(a,b) exist and are unique.

**Definition (Secure Information Flow).** Information may flow from object a (with class c_a) to object b (with class c_b) only if c_a <= c_b. That is, information flows upward in the lattice.

**Example.** The classic military lattice:
```
Top Secret
    |
  Secret
    |
Confidential
    |
Unclassified
```
Information flows upward: Unclassified data can be written to a Secret container, but Secret data cannot flow to an Unclassified container.

### Noninterference (Goguen & Meseguer 1982)

**Definition (Noninterference).** A system satisfies noninterference if and only if, for a deterministic program P:

For all memory states M1, M2:
  (M1 =_L M2) and (P, M1) ->* M1' and (P, M2) ->* M2'
  implies M1' =_L M2'

Where =_L denotes equivalence at the Low security level. In plain language: if two initial states are identical from the perspective of a Low observer, then after executing any program, the resulting states remain identical from the Low observer's perspective, regardless of any differences in High-level inputs.

This formalizes the intuition that "High actions have no observable effect on Low outputs."

**Limitations of noninterference:**
- Too strict for practical systems: it forbids even statistical aggregates of sensitive data.
- Does not compose well; interleaving noninterfering components can create interference.
- Pre-existing classified information at system startup can leak while formally satisfying the property.
- Covert channels (timing, resource consumption) can violate the spirit while satisfying the letter.

### Decentralized Label Model (Myers & Liskov 1997)

**Definition (DLM Label).** A label L is a set of *policies*. Each policy is a pair (owner, {reader1, reader2, ...}) where:
- The *owner* is a principal who controls the policy
- The *readers* are principals permitted to observe the labeled data

**Information flow rule:** Data labeled L1 may flow to a location labeled L2 only if, for every policy in L1, there is a corresponding policy in L2 with the same or fewer readers.

**Declassification:** An owner may add readers to their own policy component, thereby declassifying the data from their perspective. Because labels may have multiple owners, no single owner can unilaterally declassify data without the other owners' policies also permitting it.

**Implementation:** The Jif language (an extension of Java) enforces DLM labels through static type checking, catching most information flow violations at compile time rather than runtime.

### Application to AI Agent Harnesses

Information flow control addresses the central question that access control matrices cannot: *what happens to data after a permitted read?*

1. **Credential flow tracking.** Label each credential with a security class. The harness can statically verify that no execution path carries a credential-labeled value to a tool output or log file labeled at a lower security class.

2. **Noninterference for multi-tenant harnesses.** If multiple users share a harness instance, noninterference guarantees that User A's secrets cannot influence User B's observable outputs. The harness must ensure that agent memory, tool outputs, and cached state are partitioned by security class.

3. **DLM for fine-grained sharing.** In multi-agent systems, the DLM allows each agent (as a principal) to label data it produces with its own policy: "Agent-Researcher created this; only Agent-Reviewer and Agent-Researcher may read it." This enables controlled collaboration without a central authority.

4. **Lattice structure for tool permissions.** Tool outputs can be assigned security classes based on the sensitivity of the data they access. A tool reading a database labeled "Internal" produces output labeled "Internal." If the agent then tries to pass that output to a tool connected to the public internet (labeled "Public"), the lattice ordering forbids it.

### Key Limitations

- Static information flow analysis is conservative: it may reject safe programs.
- Dynamic information flow tracking (tainting) incurs runtime overhead and label explosion.
- Covert channels (timing side channels, resource consumption) are not captured by the lattice model.
- Declassification is the pragmatic escape hatch, but each declassification point is a potential security vulnerability.

---

## 5. Bell-LaPadula (Confidentiality) and Biba (Integrity)

### Sources

- David Elliott Bell and Leonard J. LaPadula, "Secure Computer Systems: Mathematical Foundations" and "Secure Computer Systems: A Mathematical Model," MITRE Technical Reports MTR-2547, 1973. Unified exposition published 1976.
- Kenneth J. Biba, "Integrity Considerations for Secure Computer Systems," MITRE Technical Report MTR-3153, 1977. (Often cited as ESD-TR-76-372.)

### Bell-LaPadula Model (BLP) -- Confidentiality

BLP is a state-machine model enforcing *mandatory access control* for confidentiality. Every subject s has a *clearance level* C(s) and every object o has a *classification level* C(o), drawn from a lattice of security levels.

**Property 1: Simple Security Property (ss-property, "No Read Up").**
A subject s may read object o only if C(s) >= C(o).
A subject cannot read data classified above its clearance.

**Property 2: Star Property (*-property, "No Write Down").**
A subject s may write to object o only if C(o) >= C(s).
A subject cannot write data to a container classified below its clearance, as this would declassify the information.

**Property 3: Discretionary Security Property (ds-property).**
Access must also be permitted by the discretionary access control matrix (the Lampson matrix).

**Basic Security Theorem (BST).** If the initial state is secure (satisfies ss, *, and ds), and every state transition preserves all three properties, then every reachable state is secure.

**Tranquility Properties:**
- *Strong tranquility:* Security levels never change during system operation.
- *Weak tranquility:* Security levels never change in a way that violates the security policy.

**Criticism of the BST (McLean 1990).** John McLean demonstrated that the Basic Security Theorem can be proven for systems that are obviously insecure (his "System Z" counterexample), because the theorem says nothing about *functionality*; it only says that if each transition is secure, the sequence is secure. A system that downgrades every object before reading it satisfies the BST trivially.

### Biba Model -- Integrity

Biba is the *dual* of Bell-LaPadula, addressing integrity rather than confidentiality. Every subject s has an *integrity level* I(s) and every object o has an integrity level I(o).

**Property 1: Simple Integrity Property ("No Read Down").**
A subject s may read object o only if I(o) >= I(s).
A subject cannot read data of lower integrity, as it might be corrupted or untrustworthy.

**Property 2: Star Integrity Property ("No Write Up").**
A subject s may write to object o only if I(s) >= I(o).
A subject cannot write to a container of higher integrity, as it might corrupt trusted data.

**Property 3: Invocation Property.**
A subject at a given integrity level cannot invoke (call) a subject at a higher integrity level.

### The Fundamental Tension

BLP and Biba impose *opposite* constraints:

| Rule | BLP (Confidentiality) | Biba (Integrity) |
|---|---|---|
| Read | No read up | No read down |
| Write | No write down | No write up |

A subject that obeys both models simultaneously can only read and write at exactly its own level, which is impractical. This is the *confidentiality-integrity tension*.

### Application to AI Agent Harnesses

The BLP/Biba tension manifests acutely in agent systems:

**The agent's dilemma.** An AI coding agent must:
- Read external content from the internet, user-provided documents, and untrusted repositories (low integrity under Biba)
- Protect API keys, credentials, and internal configuration (high confidentiality under BLP)
- Produce code that will be committed to a trusted repository (high integrity under Biba)
- Potentially read internal documentation and proprietary code (high confidentiality under BLP)

Under strict BLP + Biba, the agent would need to operate at the lowest integrity level (because it reads untrusted input) and the highest confidentiality level (because it reads secrets), leaving it unable to write *anywhere useful*.

**Practical resolutions for harness design:**

1. **Compartmentalization.** Separate the agent into sub-processes at different security levels. A "reader" sub-process operates at low integrity / high confidentiality; a "writer" sub-process operates at high integrity / lower confidentiality. Communication between them passes through a *guard* that sanitizes and validates.

2. **Trusted downgrader / upgrader.** The harness itself acts as a trusted component that can deliberately violate BLP or Biba rules under controlled conditions. For example, the harness may read a credential (high confidentiality) and inject it into an API call without exposing it to the agent's context window.

3. **Dual-lattice labeling.** Assign each piece of data both a confidentiality label and an integrity label. The harness enforces BLP rules on confidentiality labels and Biba rules on integrity labels independently.

4. **Lipner's combined model.** Steven Lipner (1982) showed how to combine BLP and Biba using a single lattice with both confidentiality and integrity components, allowing subjects to have different effective levels for reading vs. writing.

### Key Limitations

- McLean's critique applies: formal compliance with BLP does not guarantee meaningful security.
- Covert channels are not addressed.
- The models assume a fixed, hierarchical lattice; real-world security requirements often involve non-hierarchical compartments.
- The strict models are too restrictive for practical use; every real deployment involves carefully controlled exceptions (trusted subjects, guards, sanitizers).

---

## 6. Saltzer & Schroeder Design Principles (1975)

### Source

Jerome H. Saltzer and Michael D. Schroeder, "The Protection of Information in Computer Systems," *Proceedings of the IEEE* 63(9):1278--1308, September 1975.

### The Eight Principles

#### Principle 1: Economy of Mechanism

> "Keep the design as simple and small as possible."

The protection system's architecture should be straightforward and minimal. Complex designs impede the thorough inspection and examination necessary for security validation.

**Harness application:** The harness's security-critical path (the code that enforces permissions, mediates tool access, and manages credentials) must be as small as possible. Every line of code in the security boundary is attack surface. This argues for a thin harness with a minimal TCB, rather than a feature-rich harness with security bolted on.

#### Principle 2: Fail-Safe Defaults

> "Base access decisions on permission rather than exclusion."

The default state should deny access. Security schemes should explicitly identify conditions that *permit* access, not conditions that *deny* it. A harness should be secure immediately upon installation, before any configuration.

**Harness application:** An unconfigured agent should have zero tool access, zero file access, and zero network access. Permissions are granted explicitly. If a permission check encounters an error or ambiguity, the result is denial.

#### Principle 3: Complete Mediation

> "Every access to every object must be checked for authority."

No access request may bypass the validation mechanism. In client-server models, the server must perform all access checking because users can create modified clients.

**Harness application:** Every tool invocation, every file read, every API call must pass through the harness's permission check. There must be no "fast path" that skips validation. The agent is the untrusted client; the harness is the server that mediates all access. Caching of permission decisions is dangerous if the underlying state can change.

#### Principle 4: Open Design

> "The design should not depend on the ignorance of potential attackers."

Security should rely on the secrecy of specific, easily-changeable items (keys, passwords) rather than on the secrecy of the mechanism itself. The harness's security architecture should be publicly auditable.

**Harness application:** The harness's sandboxing mechanism, permission model, and credential management approach should be open-source and publicly documented. Security should derive from the key material (API tokens, encryption keys) and the permission configuration, not from obscurity of the harness code.

#### Principle 5: Separation of Privilege

> "Where feasible, a protection mechanism that requires two keys to unlock it is more robust than one that allows access to the presenter of only a single key."

Requiring multiple independent conditions for access ensures that compromising one condition does not grant full access.

**Harness application:** High-risk operations (credential access, network egress, file deletion) should require multiple confirmations: both the agent's request *and* human approval, or both a valid tool configuration *and* a runtime policy check. This is the theoretical basis for human-in-the-loop approval workflows.

#### Principle 6: Least Privilege

> "Every program and every user of the system should operate using the least set of privileges necessary to complete the job."

This limits damage from accidents, errors, or attacks. Only the smallest program portion requiring elevated privileges should possess them.

**Harness application:** An agent performing code review needs read access to source files and nothing else. An agent performing deployment needs write access to deployment manifests and credentials for one specific environment, not global admin access. The harness should support per-task capability profiles, not a single permission level per agent.

#### Principle 7: Least Common Mechanism

> "Minimize the mechanisms common to more than one user and depended on by all users."

Shared mechanisms create information flow channels and unintended interactions. Shared resources (temp directories, shared caches, common log files) are risk vectors.

**Harness application:** Each agent session should have isolated temporary storage, isolated environment variables, and isolated credential stores. Shared caches between agent sessions can leak information. A shared tool execution environment across agents creates a covert channel.

#### Principle 8: Psychological Acceptability

> "It is essential that the human interface be designed for ease of use, so that users routinely and automatically apply the protection mechanisms correctly."

If security mechanisms are burdensome, users will circumvent them. Security should match users' mental models.

**Harness application:** Permission configuration should be intuitive and declarative. If setting up proper sandboxing requires a 200-line YAML file, developers will run agents in permissive mode. The harness should offer sensible presets (e.g., "read-only code review" profile, "full development" profile) with clear, human-readable permission summaries. Approval prompts should clearly state what action is requested and what resources are at risk.

### Key Limitations

- The principles are design heuristics, not formal properties. They cannot be mechanically verified.
- Principles sometimes conflict: economy of mechanism (simplicity) versus complete mediation (checking everything) requires engineering judgment.
- Psychological acceptability is inherently subjective and context-dependent.

---

## 7. The Confused Deputy Problem (Hardy 1988)

### Source

Norm Hardy, "The Confused Deputy: (or why capabilities might have been invented)," *ACM SIGOPS Operating Systems Review* 22(4):36--38, October 1988.

### The Original Problem

Hardy described a Fortran compiler named FORT running on a timesharing system. FORT was installed in a privileged system directory (SYSX) and therefore had write access to all files in that directory, including the billing file (BILL). FORT also accepted a user-specified output file for debugging listings.

A user invoked FORT and specified the output file as `(SYSX)BILL`. The system permitted the write because *FORT* had access to files in SYSX; the system never checked whether the *user* had such access. The billing file was overwritten.

### Formal Definition

**Definition (Confused Deputy).** A confused deputy is a computer program that is tricked by another party (with fewer privileges) into misusing its own authority. The vulnerability arises when *designation* (naming a resource) is separated from *authorization* (having permission to access it). The deputy receives a designation from an untrusted source and applies its own authority to act on that designation, without verifying that the original requestor was authorized.

The core issue is that the access check answers the wrong question: "Does the *deputy* have access?" instead of "Does the *requestor on whose behalf the deputy acts* have access?"

### Capability-Based Solution

In a capability system, the user would pass a *capability* (an unforgeable token combining designation and authorization) for the output file. If the user does not possess a capability for `(SYSX)BILL`, it cannot pass one. The compiler never needs to exercise its own authority; it simply uses the capability provided. Designation and authorization travel together, eliminating the confusion.

### Prompt Injection as Confused Deputy

Prompt injection attacks on AI agents are a modern instantiation of the confused deputy problem:

| Hardy's Scenario | AI Agent Scenario |
|---|---|
| Compiler (FORT) with system-level file access | AI agent with credentials, file access, tool invocations |
| User provides a filename | Untrusted content provides instructions embedded in documents, web pages, error messages |
| Compiler writes to the named file using its own authority | Agent executes the injected instructions using its own credentials |
| Billing file overwritten | Secrets exfiltrated, files modified, unauthorized API calls made |

The structural parallel is exact:

1. **Delegated authority:** The agent holds legitimate credentials and permissions delegated by the user or organization.
2. **Untrusted designation:** The agent processes content from untrusted sources (web pages, user documents, API responses) that may contain adversarial instructions.
3. **Authority confusion:** The agent cannot distinguish between legitimate instructions from its principal (the user) and injected instructions from adversarial content, so it applies its full authority to execute adversarial instructions.

### Application to AI Agent Harnesses

1. **Capability-based tool invocation.** Rather than the agent choosing which tool to call by name (designation) and the harness checking whether the agent is allowed (authority), the harness should provide the agent with *capability tokens* for specific tools. The agent can only invoke tools for which it holds a capability, and the capability limits the operations available.

2. **Intent verification, not just permission validation.** The confused deputy problem reveals that traditional access control (checking "is the agent allowed to do X?") is insufficient. The correct question is "did the *user* intend for the agent to do X?" This is fundamentally harder for AI agents because the agent's "intent" is shaped by its entire context, including potentially adversarial content.

3. **Input provenance tracking.** The harness should tag every piece of content entering the agent's context with its provenance (user-provided, tool-output, web-fetched, system-prompt). High-authority actions should only be triggered by high-provenance inputs.

4. **Action context validation.** Reject actions inconsistent with the current task context. If the agent is performing code review and suddenly requests to write to a credentials file, the harness should flag this as a potential confused deputy scenario.

### Key Limitations

- The confused deputy framing assumes a clear distinction between the deputy's authority and the requestor's authority. In AI agents, the "requestor" is diffuse; the agent's behavior emerges from the entire context window, making it impossible to attribute individual actions to specific inputs.
- Capability-based solutions help but do not fully solve the problem: even with capabilities, the agent might be tricked into using a legitimately-held capability for an adversarial purpose.
- There is no known complete solution to prompt injection, much as there is no complete solution to the confused deputy in systems with ambient authority.

---

## 8. Trusted Computing Base (Orange Book, DoD 1985)

### Source

U.S. Department of Defense, "Trusted Computer System Evaluation Criteria," DoD 5200.28-STD (the "Orange Book"), December 1985. Initially issued as CSC-STD-001-83 in August 1983. Published by the National Computer Security Center (NCSC).

Related foundational work:
- James P. Anderson, "Computer Security Technology Planning Study," ESD-TR-73-51, 1972 (the "Anderson Report," introducing the reference monitor concept).

### Trusted Computing Base (TCB)

**Definition (TCB).** The *Trusted Computing Base* of a computer system is the totality of protection mechanisms within the system, including hardware, firmware, and software, the combination of which is responsible for enforcing a security policy. A TCB consists of one or more components that together enforce a unified security policy over a product or system.

**Key properties of the TCB:**
- It must be **isolated** from the rest of the system to prevent unauthorized interference.
- Its **correctness** is critical: a flaw in the TCB undermines the entire system's security.
- It should be **minimal**: the smaller the TCB, the more feasible it is to verify its correctness.

### The Reference Monitor

**Definition (Reference Monitor).** The reference monitor is an abstract machine that mediates all access of subjects to objects, checking each request against an authorization database. It was introduced by James P. Anderson in 1972.

**Reference monitor properties (the NEAT properties):**
1. **Non-bypassable (Always invoked):** Every access request must pass through the reference monitor. There is no way around it.
2. **Evaluable (Verifiable):** The reference monitor must be small enough to be subject to analysis and tests whose completeness can be assured.
3. **Always invoked:** (redundant with non-bypassable in some formulations)
4. **Tamperproof:** The reference monitor cannot be altered by untrusted code.

A *security kernel* is the hardware, firmware, and software that implements the reference monitor concept in a real system.

### TCSEC Evaluation Divisions

| Division | Name | Key Requirements |
|---|---|---|
| D | Minimal Protection | Evaluated but fails to meet any higher division |
| C1 | Discretionary Security Protection | User identification/authentication, discretionary access control, user-data separation |
| C2 | Controlled Access Protection | Granular DAC, individual accountability, audit trails, object reuse controls, resource isolation |
| B1 | Labeled Security Protection | Informal security policy model, sensitivity labels, mandatory access control over selected subjects/objects |
| B2 | Structured Protection | Formally documented security policy, MAC extended to all subjects/objects, covert channel analysis, strengthened authentication |
| B3 | Security Domains | Reference monitor requirements met, minimized complexity, security administrator role, automated intrusion detection, trusted path |
| A1 | Verified Design | Functionally identical to B3, plus formal design specification and verification techniques |

### Fundamental Objectives

The TCSEC establishes four core evaluation objectives:
1. **Security Policy:** An explicit, well-defined security policy must be enforced.
2. **Accountability:** Individual actions must be traceable through identification, authentication, and auditing.
3. **Assurance:** Hardware and software mechanisms must be independently evaluable.
4. **Documentation:** Security guides, trusted facility manuals, and design documentation must exist.

### Application to AI Agent Harnesses

The TCB/reference monitor framework maps directly onto harness architecture:

**The harness IS the TCB.** In an agent system, the harness runtime, its permission enforcement logic, its credential management, and its tool mediation layer collectively form the Trusted Computing Base. The agent itself is *untrusted code* running within the protection boundary established by the TCB.

| TCB Concept | Harness Equivalent |
|---|---|
| TCB | Harness runtime + permission engine + credential vault |
| Untrusted code | The AI agent (LLM outputs, tool-use decisions) |
| Reference monitor | The harness's tool invocation interceptor that checks every action |
| Security kernel | The minimal set of harness code that enforces the security policy |
| Security policy | The permission configuration (allowed tools, file access rules, network policies) |
| Audit trail | The session log recording all agent actions and harness decisions |

**Reference monitor properties applied to the harness:**

1. **Non-bypassable:** There must be no way for the agent to invoke a tool, read a file, or make a network request without the harness intercepting and authorizing it. If the agent can shell out to a subprocess that is not mediated, the reference monitor property is violated.

2. **Tamperproof:** The agent must not be able to modify the harness's permission enforcement logic. If the agent can edit the harness configuration file or inject code into the harness process, the TCB is compromised.

3. **Verifiable:** The harness's security-critical code must be small enough to audit. This argues for a layered architecture where the security kernel (permission checks, credential management) is separated from convenience features (UI, logging, prompt management) and kept minimal.

**TCSEC-inspired evaluation criteria for harnesses:**

- **C2 equivalent:** Individual agent sessions are accountable through audit logs. Credentials are not reused across sessions (object reuse protection). Granular per-tool permissions.
- **B1 equivalent:** Every tool output and file is labeled with sensitivity levels. The harness enforces mandatory access control based on labels, not just discretionary permissions.
- **B3 equivalent:** The harness meets reference monitor requirements. The security-critical code is minimized. Anomalous agent behavior triggers automated alerts. Users interact with the harness through a trusted path that cannot be spoofed by the agent.

### Key Limitations

- The TCSEC was designed for multi-user operating systems, not for AI agent systems. The threat model assumed human adversaries, not adversarial content processed by the system itself.
- The formal verification requirements at A1 are impractical for most software; even simplified verification of harness security kernels is expensive.
- The Orange Book was superseded by the Common Criteria (ISO/IEC 15408) in 2005, which uses Protection Profiles and Security Targets rather than fixed evaluation classes. A modern harness evaluation framework would need to define its own Protection Profile.
- The TCB concept assumes a clear boundary between trusted and untrusted code. In agent systems, this boundary is blurred by the agent's ability to generate code, modify its own prompts, and interact with external systems in unpredictable ways.

---

## Synthesis: Cross-Cutting Themes

### Theme 1: The Undecidability Wall

The HRU result establishes a hard theoretical limit: in a general access control system, you cannot prove that a permission will never leak. This means harness security must be achieved through *restriction to decidable subcases*, not through general-purpose verification. Practically, this translates to:

- Fix the permission set at initialization (monotonic system)
- Disallow runtime permission escalation
- Keep commands mono-operational
- Accept that security is a design constraint on the permission model, not a property that can be verified after the fact

### Theme 2: The Confidentiality-Integrity Dilemma

The BLP/Biba tension is the central theoretical challenge for agent harness security. The agent must read low-integrity content (the whole point of an agent that can browse the web, read documents, and process user input) while protecting high-confidentiality secrets (API keys, internal code). The theoretical models say you cannot do both simultaneously without trusted intermediaries (guards, sanitizers, compartments). Every practical harness must implement some form of compartmentalization or trusted downgrading.

### Theme 3: Capabilities Over ACLs

The access control matrix, the confused deputy problem, and capability theory all converge on the same conclusion: identity-based access control (ACLs) is structurally vulnerable to confused deputy attacks, which is exactly what prompt injection exploits. Capability-based designs, where authority is carried by unforgeable tokens rather than derived from ambient identity, are the natural security architecture for agent systems.

### Theme 4: The Harness as TCB

The Orange Book's TCB concept, Anderson's reference monitor, and Saltzer & Schroeder's complete mediation principle all point to the same architectural requirement: the harness must be a small, tamperproof, non-bypassable mediator sitting between the untrusted agent and all resources. The agent is untrusted code. The harness is the security kernel. This is not a metaphor; it is the direct application of 50 years of security architecture theory.

### Theme 5: Information Flow Beyond Access Control

The Denning lattice, noninterference, and the DLM all address a question that access control matrices cannot: what happens to data after a permitted read? For agent harnesses, this means that granting read access to a credential is not the end of the security story. The harness must also ensure that the credential value does not flow to unauthorized outputs (logs, tool arguments, agent responses to users without clearance). This requires either static analysis of information flow paths or runtime taint tracking.

---

## Citation Index

| # | Citation | Year |
|---|---|---|
| 1 | Lampson, B.W. "Protection." *Proc. 5th Princeton Conf. on Information Sciences and Systems.* | 1971 |
| 2 | Anderson, J.P. "Computer Security Technology Planning Study." ESD-TR-73-51. | 1972 |
| 3 | Bell, D.E. and LaPadula, L.J. "Secure Computer Systems: Mathematical Foundations." MITRE MTR-2547. | 1973 |
| 4 | Saltzer, J.H. and Schroeder, M.D. "The Protection of Information in Computer Systems." *Proc. IEEE* 63(9). | 1975 |
| 5 | Harrison, M.A., Ruzzo, W.L., and Ullman, J.D. "Protection in Operating Systems." *CACM* 19(8). | 1976 |
| 6 | Denning, D.E. "A Lattice Model of Secure Information Flow." *CACM* 19(5). | 1976 |
| 7 | Biba, K.J. "Integrity Considerations for Secure Computer Systems." MITRE MTR-3153. | 1977 |
| 8 | Goguen, J.A. and Meseguer, J. "Security Policies and Security Models." *IEEE S&P.* | 1982 |
| 9 | Lipner, S.B. "Non-Discretionary Controls for Commercial Applications." *IEEE S&P.* | 1982 |
| 10 | U.S. DoD. "Trusted Computer System Evaluation Criteria." DoD 5200.28-STD (Orange Book). | 1985 |
| 11 | Dennis, J.B. and Van Horn, E.C. "Programming Semantics for Multiprogrammed Computations." *CACM* 9(3). | 1966 |
| 12 | Hardy, N. "The Confused Deputy." *ACM SIGOPS Operating Systems Review* 22(4). | 1988 |
| 13 | McLean, J. "The Specification and Modeling of Computer Security." *IEEE Computer* 23(1). | 1990 |
| 14 | Miller, M.S. "The E Programming Language." | 1997 |
| 15 | Myers, A.C. and Liskov, B. "A Decentralized Model for Information Flow Control." *SOSP.* | 1997 |
| 16 | Miller, M.S., Yee, K., and Shapiro, J. "Capability Myths Demolished." Technical Report SRL2003-02, JHU. | 2003 |
| 17 | Watson, R.N.M. et al. "Capsicum: Practical Capabilities for UNIX." *USENIX Security.* | 2010 |
| 18 | Tripunitara, M.V. and Li, N. "The Foundational Work of Harrison-Ruzzo-Ullman Revisited." *IEEE TDSC.* | 2013 |

---

## Web Sources Consulted

- [Access Control Matrix -- Wikipedia](https://en.wikipedia.org/wiki/Access_control_matrix)
- [HRU (security) -- Wikipedia](https://en.wikipedia.org/wiki/HRU_(security))
- [Bell-LaPadula Model -- Wikipedia](https://en.wikipedia.org/wiki/Bell%E2%80%93LaPadula_model)
- [Biba Model -- Wikipedia](https://en.wikipedia.org/wiki/Biba_Model)
- [Non-interference (security) -- Wikipedia](https://en.wikipedia.org/wiki/Non-interference_(security))
- [Confused Deputy Problem -- Wikipedia](https://en.wikipedia.org/wiki/Confused_deputy_problem)
- [TCSEC -- Wikipedia](https://en.wikipedia.org/wiki/Trusted_Computer_System_Evaluation_Criteria)
- [Reference Monitor -- Wikipedia](https://en.wikipedia.org/wiki/Reference_monitor)
- [Saltzer and Schroeder Design Principles -- Security Reference Architecture](https://nocomplexity.com/documents/securityarchitecture/architecture/saltzer_designprinciples.html)
- [Saltzer and Schroeder, The Protection of Information in Computer Systems -- MIT](https://web.mit.edu/saltzer/www/publications/protection/)
- [Object-capability model -- Wikipedia](https://en.wikipedia.org/wiki/Object-capability_model)
- [E (programming language) -- Wikipedia](https://en.wikipedia.org/wiki/E_(programming_language))
- [Capsicum: Practical Capabilities for UNIX -- Cambridge](https://www.cl.cam.ac.uk/research/security/capsicum/)
- [Myers and Liskov, A Model for Decentralized Information Flow Control](https://www.cs.cornell.edu/andru/papers/iflow-sosp97/paper.html)
- [Confused Deputy -- AARM Specification](https://aarm.dev/threats/confused-deputy)
- [Capability Myths Demolished -- Agoric](https://papers.agoric.com/papers/capability-myths-demolished/abstract/)
- [HRU Lecture Notes -- Purdue](https://www.cs.purdue.edu/homes/ninghui/courses/Spring05/lectures/lecture06.pdf)
- [Denning, A Lattice Model of Secure Information Flow -- CACM](https://dl.acm.org/doi/10.1145/360051.360056)
- [Lampson, Protection -- UCSD CSE](https://cseweb.ucsd.edu/classes/fa01/cse221/papers/lampson-protection-osr74.pdf)
- [Capsicum: Practical Capabilities for UNIX -- USENIX](https://www.usenix.org/legacy/event/sec10/tech/full_papers/Watson.pdf)
- [Goguen and Meseguer, Security Policies and Security Models -- Purdue](https://www.cs.purdue.edu/homes/ninghui/readings/AccessControl/goguen_meseguer_82.pdf)
- [Prompt Injection in AI Agent Systems -- Palo Alto Unit 42](https://unit42.paloaltonetworks.com/ai-agent-prompt-injection/)
- [Designing Agents to Resist Prompt Injection -- OpenAI](https://openai.com/index/designing-agents-to-resist-prompt-injection/)
