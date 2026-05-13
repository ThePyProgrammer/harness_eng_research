# Trusted Computing Base, Threat Models, and Adversarial Robustness Formalization

**Formalization Round 2: Security Architecture for AI Agent Harnesses**
**Date: 2026-04-03**

---

## 1. Trusted Computing Base Theory and the Reference Monitor Concept

### 1.1 Formal Definition of the Trusted Computing Base

The Trusted Computing Base (TCB) is defined in DoD 5200.28-STD (the "Orange Book," 1985) as:

> The totality of protection mechanisms within a computer system, including hardware, firmware, and software, the combination of which is responsible for enforcing a computer security policy.

More precisely, a component $c$ belongs to the TCB if and only if the incorrect functioning of $c$ can cause a violation of the system's security policy $\Pi$. Equivalently (Lampson et al. 1992):

    TCB = { c in System | failure(c) => possible_violation(Pi) }

The complementary characterization: any component outside the TCB can misbehave arbitrarily without violating the security policy, provided the TCB functions correctly.

**The TCB Minimality Principle.** The Orange Book (class B3 and above) requires that the TCB be structured to exclude code not essential to security policy enforcement. The formal justification is:

1. **Verification surface.** The effort to verify the TCB scales (at minimum) linearly with its size, and in practice superlinearly due to interaction complexity. A TCB of size $|T|$ measured in lines of code requires verification effort $V(|T|)$ where $V$ is at least $\Omega(|T|)$ and empirically $O(|T|^{1.5})$ to $O(|T|^2)$.

2. **Defect density.** Empirical defect rates in verified code are approximately 0.1-1.0 defects per KLOC (McConnell 2004). The expected number of residual security-relevant defects in the TCB is proportional to $|T|$:

        E[defects] = d * |T| / 1000

    where $d$ is the defect density per KLOC. Minimizing $|T|$ directly minimizes the expected defect count.

3. **Formal verification feasibility.** The seL4 microkernel (approximately 10,000 lines of C) has been formally verified to its specification, demonstrating that a sufficiently small TCB can be exhaustively analyzed. By contrast, a monolithic OS kernel of $10^6$+ lines remains beyond practical formal verification.

### 1.2 The Reference Monitor Concept (Anderson 1972)

James Anderson's Computer Security Technology Planning Study (ESD-TR-73-51, 1972), commissioned by the USAF, introduced the reference monitor as the abstract mechanism that mediates all access by subjects to objects. A reference validation mechanism (RVM) is a concrete implementation of the reference monitor concept.

**Definition (Reference Monitor).** A reference monitor is a mechanism $\mathcal{M}$ that, for every access request $(s, o, a)$ where $s$ is a subject, $o$ is an object, and $a$ is an access mode, evaluates whether the request is permitted under policy $\Pi$ and either allows or denies it:

    M(s, o, a) = { allow  if Pi(s, o, a) = true
                  { deny   otherwise

The reference monitor must satisfy three properties:

1. **Complete Mediation (Always Invoked).** For all access requests $(s, o, a)$ in the system, $\mathcal{M}$ is invoked:

        forall (s, o, a) in AccessRequests : M is invoked on (s, o, a)

    No path exists from subject to object that bypasses $\mathcal{M}$.

2. **Tamperproofness (Isolation).** No subject can modify, disable, or circumvent $\mathcal{M}$:

        forall s in Subjects : ~can_modify(s, M) and ~can_disable(s, M)

3. **Verifiability.** $\mathcal{M}$ is small enough and well-structured enough to be subjected to analysis and tests, the completeness of which can be assured. Formally, there exists a tractable proof that $\mathcal{M}$ correctly implements $\Pi$:

        exists proof P : P |- (forall (s,o,a) : M(s,o,a) = Pi(s,o,a))

    where $P$ is constructable with bounded effort.

The Common Criteria (ISO/IEC 15408) operationalize verifiability through Evaluation Assurance Levels (EAL). At EAL7 (the highest), formal design verification is required: the TOE (Target of Evaluation) security functions must be formally specified and their implementation formally verified against the specification. Practical EAL7 certification is currently limited to systems with tightly focused security functionality, which reinforces the TCB minimality principle.

### 1.3 Mapping to Agent Harness Architecture

In an AI coding agent harness, the TCB and reference monitor map directly:

| Classical Concept | Agent Harness Instantiation |
|:-----------------:|:---------------------------:|
| Subjects | Agent processes, tool invocations, sub-agents |
| Objects | Files, shell, network, credentials, APIs |
| Reference Monitor | Permission system + sandbox enforcement |
| TCB | {sandbox, tool permission system, credential vault, network policy, output filter} |
| Outside TCB | The LLM agent itself, user-provided prompts, retrieved context |

**The critical architectural principle:** the agent is OUTSIDE the TCB. The agent's behavior can be arbitrarily wrong, adversarially manipulated, or hallucinated, and the security policy must still hold. This is not a convenience; it is a necessity, because:

1. The agent's behavior is not formally verifiable (it is a stochastic neural network).
2. The agent processes untrusted input (user prompts, file contents, web data).
3. The agent's output space is unbounded and unpredictable.

**Theorem (TCB Correctness Sufficiency).** If the TCB components {sandbox $S$, permission system $P$, credential vault $V$, network policy $N$, output filter $F$} correctly implement the security policy $\Pi$, then no action by the agent (whether correct, mistaken, or adversarially manipulated) can violate $\Pi$, regardless of the agent's internal state or the inputs it has received.

*Proof sketch.* By the complete mediation property, every agent action passes through $\mathcal{M} = (S, P, V, N, F)$. By tamperproofness, the agent cannot modify $\mathcal{M}$. By the correctness of $\mathcal{M}$, only actions consistent with $\Pi$ are permitted. Therefore no action violating $\Pi$ can execute. $\square$

This theorem is trivial once stated, but its architectural consequence is profound: security of an AI agent system reduces entirely to the correctness of a small, non-AI, formally verifiable TCB. The problem of "making the AI safe" is replaced by the problem of "making the sandbox correct," which is a classical software verification problem with known solutions.

### 1.4 Saltzer and Schroeder's Design Principles

Saltzer and Schroeder (1975) enumerated design principles for protection mechanisms that remain directly applicable:

1. **Economy of mechanism.** Keep the design as simple and small as possible. (= TCB minimality.)
2. **Fail-safe defaults.** Base access decisions on permission rather than exclusion. (= default-deny for agent tools.)
3. **Complete mediation.** Every access to every object must be checked for authority. (= reference monitor property 1.)
4. **Open design.** The design should not depend on the ignorance of potential attackers. (= security should not rely on prompt obfuscation or system prompt secrecy.)
5. **Separation of privilege.** Where feasible, require two keys to unlock. (= human-in-the-loop for destructive actions.)
6. **Least privilege.** Every program and user should operate with the minimum set of privileges necessary. (= tool permission scoping per task.)
7. **Least common mechanism.** Minimize shared mechanisms. (= credential isolation between agent sessions.)
8. **Psychological acceptability.** The human interface should be designed for ease of use so that users routinely apply protection. (= transparent permission prompts, not security theater.)

**References:**
- Anderson, J.P. (1972). Computer Security Technology Planning Study. ESD-TR-73-51, USAF.
- DoD (1985). Trusted Computer System Evaluation Criteria. DoD 5200.28-STD (Orange Book).
- Lampson, B., Abadi, M., Burrows, M., and Wobber, E. (1992). Authentication in Distributed Systems: Theory and Practice. ACM TOCS, 10(4).
- Saltzer, J. and Schroeder, M. (1975). The Protection of Information in Computer Systems. Proceedings of the IEEE, 63(9).
- Klein, G. et al. (2009). seL4: Formal Verification of an OS Kernel. SOSP.

---

## 2. The Confused Deputy Problem and Prompt Injection

### 2.1 Formal Definition (Hardy 1988)

Norman Hardy's "The Confused Deputy: (or why capabilities might have been invented)" (ACM SIGOPS Operating Systems Review, Vol. 22, Issue 4, October 1988) defines the confused deputy problem:

**Definition (Confused Deputy).** A confused deputy is a program $D$ that:
1. Possesses authority $A_D$ (capabilities, permissions, or access rights).
2. Receives a request $r$ from a client $C$ with lesser authority $A_C \subset A_D$.
3. Uses its own authority $A_D$ to service the request $r$, performing action $f(r)$.
4. The action $f(r)$ violates the security policy because $C$ should not have been able to cause $f(r)$ to occur.

Formally, the violation condition is:

    exists r from C : f(r) not in Authorized(A_C) but f(r) in Authorized(A_D)

The deputy $D$ has been "confused" because it exercised its own authority on behalf of a client without verifying that the client's authority is sufficient for the requested action.

**Hardy's Canonical Example.** A Fortran compiler (FORT) was installed in a privileged directory (SYSX) and had write access to all files in that directory, including the billing file (BILL). The compiler accepted a user-specified output file for debugging information. A user specified BILL as the debug output file. The compiler, using its own ambient authority rather than the user's, overwrote the billing file. The designator for the file (the filename "BILL") did not carry the authority to write to it; the compiler's implicit ambient authority was used instead.

### 2.2 The Structural Root Cause: Ambient Authority

The confused deputy arises from ambient authority: authority that is implicitly available to a program by virtue of its execution context (process identity, file system permissions, installed capabilities) rather than explicitly delegated for a specific operation.

**Definition (Ambient Authority).** A system employs ambient authority if there exists a program $P$ and an action $a$ such that:
- $P$ can perform $a$ without presenting an explicit token of authorization.
- The authorization for $a$ derives from $P$'s identity or context rather than from a transferable, unforgeable capability.

In access control list (ACL) systems, the OS checks "is process P allowed to access object O?" based on the process identity. The client's request merely names the object; it does not carry authorization. The deputy uses its own identity (and therefore its own authority) to access the object.

**Capability-Based Solution.** In a capability system (Dennis and Van Horn 1966; Miller 2006), a capability is an unforgeable reference to an object that bundles designation (identifying the object) with authorization (the right to access it):

    capability = (object_reference, access_rights)

A deputy that receives a capability from a client can only use that capability's access rights, not its own ambient authority. The confused deputy problem is structurally prevented because:

    f(r, cap_C) in Authorized(cap_C) subseteq Authorized(A_C)

The deputy cannot exceed the client's authority because the client's capability, not the deputy's identity, determines the permitted operations.

### 2.3 Prompt Injection as a Confused Deputy Attack

The parallel between Hardy's confused deputy and prompt injection in LLM agent systems is exact:

| Classical Deputy | LLM Agent |
|:----------------:|:---------:|
| Compiler (FORT) | The LLM agent |
| User | Adversarial content author |
| Compiler's ambient authority | Agent's tool permissions (file write, shell exec, API calls, credential access) |
| User-specified filename | Injected instruction in untrusted content |
| The billing file gets overwritten | Credentials exfiltrated, malicious code executed, files destroyed |

**Formal Parallel.** Let:
- $A$ be the agent with authority set $\text{Auth}(A) = \{a_1, a_2, ..., a_k\}$ (write files, execute shell, call APIs).
- $I$ be untrusted input containing an injected instruction $\iota$.
- $f_A(I)$ be the agent's action function, mapping input to actions.

The confused deputy attack succeeds when:

    f_A(I) in Auth(A) \ Auth(I_source)

That is, the adversarial input $I$ causes the agent to perform an action that is within the agent's authority but should not have been triggerable by the input source. The agent is confused because it cannot distinguish between:
- Legitimate instructions from the system prompt / user (high authority).
- Injected instructions from untrusted content (no authority).

Both arrive as tokens in the same context window. The agent processes them using the same mechanism (next-token prediction). There is no structural separation between the instruction channel and the data channel.

**Willison's Lethal Trifecta (2024).** Simon Willison identifies three conditions whose conjunction creates an exploitable confused deputy:

1. **Access to private data** (email, documents, credentials).
2. **Exposure to untrusted content** (web pages, incoming emails, user-uploaded files).
3. **Ability to act** (send emails, execute code, write files).

When all three conditions hold simultaneously, any prompt injection in the untrusted content can weaponize the agent's capabilities. This is the confused deputy pattern: the agent (deputy) has capabilities (1 and 3) and is exposed to adversarial designation (2).

### 2.4 Why Capability-Based Mitigations Are Necessary but Insufficient

The classical solution to the confused deputy, capability-based security, translates to the agent harness as scoped, per-task permissions:

- Instead of the agent having ambient "write any file" authority, each task grants a capability scoped to specific directories.
- Instead of ambient shell access, each invocation receives a capability token specifying the permitted command set.

This mitigates the deputy confusion structurally: even if a prompt injection tricks the agent into attempting a malicious action, the capability token does not authorize it.

However, in agent systems this solution is incomplete because:

1. The agent may need to determine its own capabilities dynamically (e.g., "what tools do I need for this task?"), creating a meta-level confused deputy problem.
2. The granularity of capability scoping is limited by the task description, which itself may be adversarially influenced.
3. Human-in-the-loop approval can be socially engineered ("the user said to approve all requests").

The capability approach is therefore a necessary structural mitigation (it shrinks the damage radius) but not sufficient (it does not prevent the agent from being confused within its authorized scope).

**References:**
- Hardy, N. (1988). The Confused Deputy: (or why capabilities might have been invented). ACM SIGOPS Operating Systems Review, 22(4).
- Dennis, J. and Van Horn, E. (1966). Programming Semantics for Multiprogrammed Computations. CACM, 9(3).
- Miller, M. (2006). Robust Composition: Towards a Unified Approach to Access Control and Concurrency Control. PhD Thesis, Johns Hopkins University.
- Willison, S. (2024). The Lethal Trifecta for AI Agents. simonwillison.net.
- Miller, M., Yee, K., and Shapiro, J. (2003). Capability Myths Demolished. Tech Report, Johns Hopkins University.

---

## 3. Prompt Injection Impossibility

### 3.1 The Fundamental Channel Conflation

The core vulnerability of prompt injection is a channel conflation problem: instructions and data share the same channel (the context window) with no structural delimiter that the model can enforce.

**Definition (Instruction-Data Conflation).** A system exhibits instruction-data conflation if there exists a processing mechanism $M$ and two inputs $x_{\text{instruction}}$, $x_{\text{data}}$ such that:
1. $M$ is intended to execute $x_{\text{instruction}}$ and merely process $x_{\text{data}}$.
2. There exists a $x_{\text{data}}' \neq x_{\text{data}}$ such that $M$ treats $x_{\text{data}}'$ as an instruction.
3. No structural (non-heuristic) mechanism within $M$ prevents condition (2).

For LLMs, the mechanism $M$ is next-token prediction over the concatenated context window:

    context = [system_prompt || user_message || retrieved_data]

All three components are represented as token sequences. The model applies the same attention mechanism and prediction function to all tokens. "Instructions" and "data" are semantic categories that exist only by convention (e.g., delimiters like "---BEGIN USER DATA---"), not by structural enforcement.

**The SQL Injection Parallel and Divergence.** SQL injection was a structurally identical channel conflation: SQL commands and user data shared a string concatenation channel. The solution was parameterized queries, which structurally separate the instruction channel (the prepared statement) from the data channel (the parameter bindings). As the UK NCSC (2023) observes:

> Under the hood of an LLM, there is only ever "next token" ... no distinction made between "data" or "instructions."

Parameterized queries work because the database engine has a built-in structural distinction between code and data. LLMs have no such distinction. There is no "prepared prompt" mechanism that structurally prevents the model from treating data tokens as instructions.

### 3.2 The Wolf et al. Impossibility Framework (BEB)

Wolf, Wies, Levine, and Shashua (2023, published ICML 2024) establish formal impossibility results for alignment-based defenses against adversarial prompting through the Behavior Expectation Bounds (BEB) framework.

**Setup.** Let $\mathbb{P}$ be the token distribution of an LLM over strings $\Sigma^*$. Let $B: \Sigma^* \to [-1, 1]$ be a behavior function where $B(s) = -1$ indicates maximally undesired behavior and $B(s) = 1$ indicates maximally desired behavior.

**Definition (Behavior Expectation Score).**

    B_P := E_{s ~ P}[B(s)]          (unprompted)
    B_P(s*) := E_{s ~ P(.|s*)}[B(s)]   (prompted with s*)

**Decomposition.** The LLM distribution is modeled as a two-component mixture:

    P = alpha * P_- + (1 - alpha) * P_+

where $\mathbb{P}_-$ is the "ill-behaved" component (generating text where $B(s) < 0$) and $\mathbb{P}_+$ is the "well-behaved" component. The parameter $\alpha \in (0, 1)$ represents the residual probability mass on ill-behaved outputs after alignment. Alignment (RLHF, constitutional AI, etc.) reduces $\alpha$ but cannot eliminate it entirely.

**Definition (gamma-Prompt-Misalignability).** An LLM distribution $\mathbb{P}$ is $\gamma$-prompt-misalignable with respect to behavior $B$ if for any $\epsilon > 0$ there exists a textual prompt $s^* \in \Sigma^*$ such that:

    B_P(s*) < gamma + epsilon

where $\gamma \in [-1, 0)$. That is, there exist prompts that can push the expected behavior arbitrarily close to the undesired extreme.

**Theorem 1 (Alignment Impossibility).** If behavior $B$ is $(\alpha, \beta, \gamma)$-negatively-distinguishable in $\mathbb{P}$ (meaning the ill-behaved component is distinguishable from the well-behaved component with KL divergence at least $\beta$ per token), then $\mathbb{P}$ is $\gamma$-prompt-misalignable with adversarial prompt length bounded by:

    L_1 = (1/beta) * [log(1/alpha) + log(1/epsilon) + log(4)]

**Interpretation for agent harnesses.** This theorem establishes that:
1. For any undesired behavior that has non-zero probability under the model ($\alpha > 0$), there exist adversarial prompts of bounded length that elicit that behavior.
2. The required prompt length scales as $O(\log(1/\alpha) / \beta)$. Alignment that reduces $\alpha$ (making bad behavior less probable) only increases the required adversarial prompt length logarithmically. The defense gain is sublinear in the alignment effort.
3. No amount of alignment (RLHF, constitutional AI, system prompting) can reduce $\alpha$ to exactly zero for behaviors that are in the model's training distribution.

**Theorem 2 (Misalignment Survives System Prompts).** Even when a "system prompt" $s_0$ is prepended to align the model (sampled from $\mathbb{P}_+$), the conditional distribution $\mathbb{P}(\cdot | s_0)$ remains $\gamma$-prompt-misalignable with prompt length:

    L_2 = L_1 + (beta'/beta)|s_0| + (sigma/beta) * sqrt(|s_0| / delta) + 1

where $\beta'$ measures the per-token undistinguishability of aligned and unaligned models, and $\sigma$ measures the variance of the log-likelihood ratio. The system prompt adds only a linear-in-$|s_0|$ overhead to the adversarial prompt length. Longer system prompts make attacks slightly harder but never impossible.

**Empirical Parameters.** Wolf et al. measure on LLaMA models: $\log(1/\alpha) \in [18, 30]$, $\beta \in [5, 20]$, $\sigma/\beta \in [0.35, 1]$, $\beta'/\beta \in [2, 3]$. For typical values, adversarial prompts of 10-50 tokens suffice to override alignment.

### 3.3 The Halting Problem Analogy

A stronger (but informal) impossibility argument draws on computability theory:

**Claim.** No computable classifier $C: \Sigma^* \to \{\text{safe}, \text{injection}\}$ can correctly classify all inputs for all LLM behaviors.

*Argument.* Suppose $C$ existed. Then for any program $P$ and input $x$, we could construct a prompt:

    "If program P halts on input x, output 'HALT'. Otherwise, output 'LOOP'."

If $C$ could perfectly distinguish between legitimate instructions and injections, it would need to determine whether the model's response to this prompt accurately reflects the halting behavior of $P$, which requires solving the halting problem. Therefore $C$ cannot be both sound and complete.

This argument is informal and has limitations: it assumes the LLM can simulate arbitrary computation, which finite-parameter models cannot do perfectly. However, it captures the intuition that perfect injection detection requires semantic understanding of instruction intent, which is at least as hard as the problems the instructions describe.

### 3.4 Structural Defenses as the Only Zero-Exploit Guarantee

The BEB impossibility results, the channel conflation analysis, and the NCSC's assessment converge on a single conclusion:

**Principle (Structural Defense Necessity).** Because prompt injection cannot be eliminated at the model level, security guarantees must come from structural constraints that make the harmful action impossible regardless of the agent's intent:

1. **The agent cannot take the action.** (Sandbox enforcement: file system isolation, network restrictions, process containment.)
2. **The action requires external authorization.** (Human-in-the-loop approval for destructive operations.)
3. **The credential is not accessible.** (Credential vault with scoped, time-limited tokens; the agent never sees raw secrets.)
4. **The output is validated structurally.** (Output filters that check syntactic properties, not semantic intent.)

These defenses correspond exactly to the TCB components identified in Section 1.3. The security argument does not depend on the agent behaving correctly. It depends on the reference monitor preventing incorrect behavior from causing harm.

**References:**
- Wolf, Y., Wies, N., Levine, Y., and Shashua, A. (2023). Fundamental Limitations of Alignment in Large Language Models. arXiv:2304.11082; ICML 2024.
- Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., and Fritz, M. (2023). Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection. AISec@CCS 2023.
- UK NCSC (2023). Prompt Injection Is Not SQL Injection (It May Be Worse). ncsc.gov.uk.

---

## 4. STRIDE and OWASP Threat Taxonomy for Agent Systems

### 4.1 STRIDE Mapping to Agent Threat Surfaces

STRIDE (Shostack 2014, originating at Microsoft) categorizes threats into six classes. Below we map each to the AI agent harness domain:

**S -- Spoofing Identity.**
- *Classical:* An attacker pretends to be another principal.
- *Agent mapping:* (a) System prompt spoofing: adversarial content in retrieved data impersonates the system prompt. (b) Inter-agent identity fraud: in multi-agent systems, one agent impersonates another to escalate trust. (c) Tool response spoofing: a compromised MCP server returns fabricated tool results.
- *Formal condition:* $\exists$ message $m$ attributed to principal $P$ such that $m$ was not authored by $P$.

**T -- Tampering with Data.**
- *Classical:* Unauthorized modification of data.
- *Agent mapping:* (a) Memory poisoning: adversarial content modifies the agent's persistent memory or context. (b) Tool parameter manipulation: injected instructions alter the parameters passed to tool calls. (c) Reward hacking: the agent modifies its own evaluation metrics or training signal. (d) Context window pollution: adversarial content dilutes or overwrites legitimate context.
- *Formal condition:* $\exists$ data $d$ and time $t_1 < t_2$ such that $d(t_2) \neq d(t_1)$ and the modification was not authorized by the data owner.

**R -- Repudiation.**
- *Classical:* A principal denies performing an action.
- *Agent mapping:* (a) Unlogged tool executions: the agent invokes tools without audit trail. (b) Unlogged decisions: the agent's reasoning for choosing an action is not recorded. (c) Deniable prompt injection: the attacker's injected instruction leaves no trace distinguishable from legitimate input.
- *Formal condition:* $\exists$ action $a$ performed by principal $P$ such that no evidence $E$ exists linking $P$ to $a$.

**I -- Information Disclosure.**
- *Classical:* Exposure of information to unauthorized parties.
- *Agent mapping:* (a) Credential leakage: the agent includes secrets in its output, logs, or error messages. (b) System prompt extraction: adversarial prompts trick the agent into revealing its system prompt. (c) Training data extraction: adversarial prompts cause the model to regurgitate memorized private data. (d) Side-channel exfiltration: the agent encodes secrets in benign-looking output (e.g., URLs, file names).
- *Formal condition:* $\exists$ datum $d$ with classification $\ell(d) > \ell(\text{recipient})$ such that $d$ is transmitted to recipient.

**D -- Denial of Service.**
- *Classical:* Rendering a resource unavailable.
- *Agent mapping:* (a) Denial of Wallet (DoW): adversarial input causes the agent to consume excessive API tokens, incurring financial cost. (b) Infinite loop induction: injected instructions cause the agent to enter a non-terminating reasoning cycle. (c) Context window exhaustion: adversarial content fills the context window, preventing the agent from processing legitimate instructions.
- *Formal condition:* $\exists$ attack $A$ such that the system's availability function $\text{Avail}(t) < \text{Avail}_{\min}$ for duration $\Delta t > \Delta t_{\max}$.

**E -- Elevation of Privilege.**
- *Classical:* An unprivileged principal gains higher privileges.
- *Agent mapping:* (a) Prompt injection as privilege escalation: adversarial input in untrusted data gains the agent's full capability set. This is the most direct mapping; the injected instruction has the authority of "arbitrary web content" but executes with the authority of "the agent." (b) Tool chain escalation: the agent uses tool A's output as input to tool B, where the composition grants capabilities neither tool was intended to provide alone. (c) Excessive agency: the agent autonomously decides to use capabilities beyond those required for the stated task.
- *Formal condition:* $\exists$ principal $P$ with authority $A_P$ that performs action $a \notin \text{Authorized}(A_P)$.

**Key insight:** Prompt injection maps to Elevation of Privilege (E), which is the most dangerous STRIDE category because it subsumes all others. An attacker who gains the agent's full authority can spoof, tamper, disclose, deny service, and repudiate at will.

### 4.2 OWASP Top 10 for LLM Applications (2025 Edition)

The OWASP Top 10 for LLM Applications (v2025, updated November 2024) identifies the following risk categories, which we map to harness architectural components:

| # | OWASP Category | Harness Mitigation Layer |
|:-:|:-:|:-:|
| LLM01 | Prompt Injection (direct + indirect) | Output filter, tool permission system, sandbox |
| LLM02 | Sensitive Information Disclosure | Credential vault, output filter, data classification |
| LLM03 | Supply Chain (malicious models, plugins) | Model provenance verification, MCP server allowlisting |
| LLM04 | Data and Model Poisoning | Input validation, context integrity verification |
| LLM05 | Improper Output Handling | Output filter, structured output validation |
| LLM06 | Excessive Agency | Tool permission system, human-in-the-loop gates |
| LLM07 | System Prompt Leakage | Output filter, prompt compartmentalization |
| LLM08 | Vector and Embedding Weaknesses | RAG pipeline integrity checks |
| LLM09 | Misinformation | Output verification, fact-checking pipelines |
| LLM10 | Unbounded Consumption | Rate limiting, cost budgets, timeout enforcement |

### 4.3 OWASP AI Agent Security Framework (2025)

The OWASP AI Agent Security Cheat Sheet identifies 12 threat categories specific to agentic systems, organized under 8 foundational security pillars:

**The 8 Pillars:**
1. Tool Security and Least Privilege
2. Input Validation and Prompt Injection Defense
3. Memory and Context Security
4. Human-in-the-Loop Controls
5. Output Validation and Guardrails
6. Monitoring and Observability
7. Multi-Agent Security
8. Data Protection and Privacy

These map to the STRIDE categories as documented in Section 4.1 and to the TCB components identified in Section 1.3. The key architectural recommendation is: "Grant agents the minimum tools required for their specific task" with per-tool permission scoping and explicit authorization for sensitive operations.

**References:**
- Shostack, A. (2014). Threat Modeling: Designing for Security. Wiley.
- OWASP (2024). OWASP Top 10 for LLM Applications 2025. genai.owasp.org.
- OWASP (2025). AI Agent Security Cheat Sheet. cheatsheetseries.owasp.org.

---

## 5. Defense-in-Depth Formalization

### 5.1 The Naive Independence Model

The classical argument for defense in depth assumes independent failure of security layers. Consider a system with $n$ defense layers, each with probability $p_i$ of stopping an attack:

**Definition (Series Defense Model).** The overall probability of the attack being stopped is:

    P(stopped) = 1 - prod_{i=1}^{n} (1 - p_i)

Equivalently, the probability of the attack succeeding (penetrating all layers) is:

    P(success) = prod_{i=1}^{n} (1 - p_i)

For $n$ identical layers each with effectiveness $p$:

    P(success) = (1 - p)^n

**Example.** Three independent layers, each with 90% effectiveness:
    P(success) = (0.1)^3 = 0.001

This exponential decay is seductive: each additional layer reduces the attack success probability by a factor of $(1-p)$. Adding a fourth layer reduces it to $10^{-4}$, a fifth to $10^{-5}$, and so on.

### 5.2 The Reality: Correlated Failures

The independence assumption is rarely valid in security systems. Layers often share:

1. **Common infrastructure.** All layers may depend on the same OS, network stack, or container runtime. A kernel vulnerability bypasses all of them.
2. **Common attack classes.** A novel technique (e.g., a new class of prompt injection) may bypass multiple detection layers simultaneously because all layers use similar detection heuristics.
3. **Common configuration.** Layers managed by the same team often have correlated misconfigurations.
4. **Common information.** In agent systems, all layers see the same context window, so an attack crafted to evade the input filter may also evade the output filter and the tool permission check.

**Definition (Correlated Defense Model).** Let $X_i \in \{0, 1\}$ be the indicator variable for layer $i$ failing (0 = stops attack, 1 = attack passes through). The attack succeeds if all layers fail: $\text{Success} = \prod_{i=1}^n X_i = 1$. With correlated failures:

    P(Success) = P(X_1 = 1, X_2 = 1, ..., X_n = 1)

Under independence: $P(\text{Success}) = \prod P(X_i = 1)$.

Under positive correlation: $P(\text{Success}) > \prod P(X_i = 1)$.

### 5.3 The Beta Factor Model for Correlated Failures

Reliability engineering formalizes correlated failures through the beta factor model (Fleming 1975; IEC 61508):

**Definition (Beta Factor).** For a system of $n$ redundant components, the total failure rate $Q_{\text{total}}$ decomposes into:

    Q_total = Q_I + Q_CC

where $Q_I$ is the independent failure rate and $Q_{CC}$ is the common cause failure rate. The beta factor is:

    beta = Q_CC / Q_total

If $\beta = 0$, all failures are independent. If $\beta = 1$, all failures are common-cause (the layers provide zero additional protection).

**For a dual-redundant system (n = 2):**

Under independence: $P(\text{both fail}) = q^2$ where $q$ is the per-component failure rate.

With beta factor: $P(\text{both fail}) = (1 - \beta)^2 q^2 + \beta q \approx \beta q$ for small $q$.

The common cause term $\beta q$ dominates the independent term $(1-\beta)^2 q^2$ when $q$ is small (i.e., when individual layers are effective). This means: the better each individual layer is, the more the system's actual reliability is determined by common cause failures, not by the multiplication of independent probabilities.

**For $n$ layers:**

    P(all fail) = sum_{k=1}^{n} C(n,k) * Q_k

where $Q_k$ is the probability of exactly $k$ components failing simultaneously from a common cause. In the simple beta factor model:

    P(all fail) approx (1-beta)^n * q^n + beta * q

The first term represents the independent failure scenario (exponentially small). The second term represents the common cause scenario (only linearly reduced by $\beta$).

### 5.4 Application to Agent Harness Security Layers

Consider a typical agent harness with four defense layers against prompt injection:

1. **Input sanitization** ($p_1 = 0.80$): Filter known injection patterns from retrieved content.
2. **System prompt reinforcement** ($p_2 = 0.85$): Strong system prompts instructing the model to ignore injected instructions.
3. **Output validation** ($p_3 = 0.90$): Check that the agent's proposed actions are consistent with the task.
4. **Tool permission gates** ($p_4 = 0.99$): Structural enforcement that the agent cannot perform unauthorized actions.

**Under independence (optimistic):**
    P(injection succeeds) = 0.20 * 0.15 * 0.10 * 0.01 = 3.0 * 10^{-6}

**Under correlated failure (realistic):**
Layers 1-3 are all "AI-heuristic" defenses that share common failure modes: a sufficiently novel injection technique bypasses all three. Estimate $\beta_{1-3} = 0.5$ (half of all failures are common-cause). Layer 4 is structural and shares no common failure mode with layers 1-3.

    P(layers 1-3 all fail) approx beta_{1-3} * max(q_1, q_2, q_3) = 0.5 * 0.20 = 0.10
    P(all 4 fail) = 0.10 * 0.01 = 0.001

The "realistic" estimate is 333x worse than the "optimistic" estimate ($10^{-3}$ vs. $3 \times 10^{-6}$). The correlated heuristic layers contribute almost nothing beyond the best single heuristic layer.

**Implication:** The only layer that provides genuine, uncorrelated defense is the structural layer (tool permission gates). Heuristic layers (AI-based detection, prompt engineering) may have high individual effectiveness but correlated failure modes that dramatically reduce their combined contribution.

### 5.5 Reason's Swiss Cheese Model

James Reason's Swiss Cheese Model (1990) provides the visual metaphor: each defense layer is a slice of Swiss cheese. The holes represent failure modes. An accident (successful attack) occurs when the holes in all slices align.

**The independence assumption** says the holes are randomly and independently positioned. The probability of alignment is the product of hole densities.

**The reality** is that holes are not randomly positioned. They are created by common pressures (organizational culture, shared technology, correlated design decisions) and therefore tend to cluster. In Reason's terminology, "latent conditions" create correlated holes across multiple layers.

For agent harnesses, the latent condition is the fundamental channel conflation (Section 3.1): all heuristic defense layers operate on the same token stream and share the fundamental limitation that they cannot structurally distinguish instructions from data. This latent condition correlates the holes in all non-structural defense layers.

### 5.6 When Defense-in-Depth Provides Genuine Security

Defense-in-depth provides genuine (not illusory) security improvement when:

1. **Layers have diverse failure modes.** Structural defenses (sandboxing, capability restrictions) fail for different reasons than heuristic defenses (pattern matching, LLM-based detection). Combining a structural layer with a heuristic layer provides genuine defense-in-depth because their failures are uncorrelated.

2. **Layers operate on different data.** A network-level firewall and an application-level permission system see different representations of the same request. A novel application-layer attack does not bypass the network-layer defense.

3. **Layers are maintained by different teams/processes.** This reduces correlated misconfiguration. However, it increases operational complexity.

**Formal Criterion for Genuine Defense-in-Depth:**

    cov(X_i, X_j) approx 0 for layers i, j

where $X_i, X_j$ are the failure indicators. This holds when the layers:
- Use different detection mechanisms.
- Operate on different representations of the input.
- Fail for structurally different reasons.
- Are not vulnerable to the same attack class.

**References:**
- Reason, J. (1990). Human Error. Cambridge University Press.
- Fleming, K. (1975). Reliability Analysis of a Redundant Sensor System. Nuclear Engineering and Design.
- IEC 61508 (2010). Functional Safety of Electrical/Electronic/Programmable Electronic Safety-related Systems.
- Littlewood, B. and Strigini, L. (2004). Redundancy and Diversity in Security. ESORICS.

---

## 6. Bell-LaPadula and Biba: The Confidentiality-Integrity Tension

### 6.1 The Bell-LaPadula Model (Confidentiality)

Bell and LaPadula (1973, 1976) formalized the DoD multilevel security (MLS) policy as a state machine model.

**Components.** A system state is a tuple $(b, M, f)$ where:
- $b \subseteq S \times O \times A$ is the set of current accesses (subject $s$ accessing object $o$ in mode $a$).
- $M$ is the access matrix, where $M[s, o]$ specifies the set of access modes that $s$ may exercise on $o$.
- $f = (f_S, f_C, f_O)$ is a triple of functions assigning: a maximum security level $f_S(s)$ to each subject, a current security level $f_C(s)$ to each subject, and a security classification $f_O(o)$ to each object.

**Security Levels.** Security levels form a lattice $(L, \leq)$ where $L$ is a finite set of levels (e.g., {Unclassified, Confidential, Secret, Top Secret}) and $\leq$ is a partial order (the "dominates" relation). The lattice structure supports compartmented classifications: a level is a pair (hierarchical level, set of compartments), and $\ell_1 \leq \ell_2$ iff the hierarchical level of $\ell_1$ is at most that of $\ell_2$ and the compartments of $\ell_1$ are a subset of those of $\ell_2$.

**Axiom 1: Simple Security Property (No Read Up).** A state $(b, M, f)$ satisfies the simple security property iff:

    forall (s, o, read) in b : f_S(s) >= f_O(o)

A subject can read an object only if the subject's clearance dominates the object's classification.

**Axiom 2: Star Property (No Write Down).** A state $(b, M, f)$ satisfies the *-property iff:

    forall (s, o, write) in b : f_C(s) <= f_O(o)
    forall (s, o, read) in b : f_C(s) >= f_O(o)

A subject can write to an object only if the object's classification dominates the subject's current level. Combined with the read rule, this prevents information flow from higher to lower classifications.

**Axiom 3: Discretionary Security Property.** A state $(b, M, f)$ satisfies the ds-property iff:

    forall (s, o, a) in b : a in M[s, o]

Every current access is permitted by the access matrix.

**Definition (Secure State).** A state is secure iff it satisfies the simple security property, the *-property, and the ds-property.

**Basic Security Theorem (Bell and LaPadula 1976).** If the initial state $(b_0, M_0, f_0)$ is secure, and every state transition preserves the three properties, then all reachable states are secure. The proof is by induction on the sequence of state transitions.

**Tranquility Properties.** The strong tranquility principle requires that security levels never change during system operation. The weak tranquility principle allows security level changes provided they do not violate the security properties.

### 6.2 The Biba Model (Integrity)

Biba (1977) developed an integrity model that is the formal dual of Bell-LaPadula, replacing confidentiality with integrity.

**Integrity Levels.** An integrity function $i: S \cup O \to L_I$ assigns integrity levels from a lattice $(L_I, \leq_I)$ to subjects and objects. Higher integrity means greater trustworthiness.

**Axiom 1: Simple Integrity Property (No Read Down).** A subject at integrity level $i(s)$ must not read (be influenced by) an object at a lower integrity level:

    forall (s, o, read) in b : i(s) <= i(o)

Reading low-integrity data could contaminate the subject's subsequent outputs.

**Axiom 2: Star Integrity Property (No Write Up).** A subject at integrity level $i(s)$ must not write to (modify) an object at a higher integrity level:

    forall (s, o, write) in b : i(o) <= i(s)

Low-integrity subjects must not modify high-integrity data.

**Axiom 3: Invocation Property.** A subject at integrity level $i(s)$ must not invoke (request service from) a subject at a higher integrity level:

    forall (s1, s2, invoke) : i(s1) >= i(s2) or invoke is denied

Low-integrity processes cannot invoke high-integrity processes.

### 6.3 The Tension: Why Agents Violate Both Models Simultaneously

Bell-LaPadula and Biba impose dual constraints that are formally contradictory for agent systems:

| Property | BLP (Confidentiality) | Biba (Integrity) |
|:-:|:-:|:-:|
| Read rule | No read up ($f_S(s) \geq f_O(o)$) | No read down ($i(s) \leq i(o)$) |
| Write rule | No write down ($f_C(s) \leq f_O(o)$) | No write up ($i(o) \leq i(s)$) |
| Combined | Can read down, write up | Can read up, write down |

An AI coding agent MUST:
1. **Read low-integrity input** (user prompts, PR descriptions, web content, retrieved documents). These have low integrity because they come from untrusted sources. This violates Biba's "no read down" rule.
2. **Protect high-confidentiality secrets** (API keys, credentials, private code). These have high classification. The agent should not write them to low-classification outputs. This requires BLP's "no write down" rule.

The agent must simultaneously:
- Read down in integrity (violating Biba) because that is its job: processing untrusted input.
- Not write down in confidentiality (obeying BLP) because secrets must not leak.

This creates a fundamental tension that neither model alone can resolve. The agent exists at a crossroads in the security lattice: it has high confidentiality clearance (it can access secrets) and low integrity (it processes untrusted input), which means the BLP and Biba constraints pull in opposite directions.

### 6.4 Resolution: Structural Separation of Data Path and Credential Path

The resolution is architectural, not policy-based:

**Principle (Path Separation).** The data path (untrusted input to processed output) and the credential path (secret storage to authenticated API calls) must be structurally separated such that:

1. The agent can read low-integrity input on the data path without contaminating the credential path.
2. Credentials on the credential path are never exposed on the data path.
3. The data path has low confidentiality classification (the agent's outputs are not secret).
4. The credential path has high integrity (credentials are injected by the TCB, not by the agent).

**Formal Model (Dual-Labeled Architecture).** Following Lipner (1982), assign each entity both a confidentiality level $c$ and an integrity level $i$:

    Entity = (c, i) where c in L_C and i in L_I

- Agent's context window: $(c = \text{low}, i = \text{low})$. The agent sees no secrets; its input is untrusted.
- Credential vault: $(c = \text{high}, i = \text{high})$. Secrets are confidential and trustworthy.
- Agent's tool calls: $(c = \text{low}, i = \text{low})$. Tool call parameters are visible to the user and are untrusted.
- TCB credential injection: $(c = \text{high}, i = \text{high})$. The TCB (not the agent) injects credentials into API calls.

The BLP constraint is satisfied: secrets $(c = \text{high})$ never flow to the agent's output $(c = \text{low})$ because the credential vault's content never enters the agent's context window. The agent sends a symbolic reference ("use API key X"), and the TCB resolves the reference outside the agent's observable state.

The Biba constraint is locally satisfied on the credential path: the credential vault $(i = \text{high})$ is never modified by the agent $(i = \text{low})$. The Biba constraint is intentionally violated on the data path (the agent reads low-integrity input), but this violation is contained: the data path cannot influence the credential path.

### 6.5 The Chinese Wall Model (Brewer and Nash 1989)

The Chinese Wall security policy (Brewer and Nash, IEEE S&P 1989) offers an alternative model relevant to multi-tenant agent systems.

**Data Hierarchy.** Objects are organized in three tiers:
1. **Objects** ($o$): individual data items (files, records).
2. **Company Datasets** ($\text{CD}(o)$): all objects belonging to one organization.
3. **Conflict of Interest Classes** ($\text{COI}(o)$): sets of company datasets representing competing organizations.

**Access History.** Let $N(s)$ be the set of objects that subject $s$ has previously accessed. The access history is tracked dynamically.

**Axiom CW1 (Simple Security Rule).** Subject $s$ can read object $o$ iff:
- $o$ is in the same company dataset as an object already accessed by $s$: $\exists o' \in N(s) : \text{CD}(o) = \text{CD}(o')$, OR
- $o$ belongs to a COI class in which $s$ has not accessed any object: $\forall o' \in N(s) : \text{COI}(o) \neq \text{COI}(o')$.

**Axiom CW2 (Star Property for Write).** Subject $s$ can write to object $o$ iff:
- $s$ can read $o$ by CW1, AND
- $s$ cannot currently read any object $o'$ where $\text{CD}(o') \neq \text{CD}(o)$ containing unsanitized information.

The write rule prevents indirect information flow: a subject who has read Company A's data cannot write to Company B's data (even in a different COI class), because the write might carry Company A's information.

**Application to Multi-Tenant Agent Systems.** When a single agent harness serves multiple tenants (organizations, users, projects):
- Each tenant's data is a company dataset.
- Competing tenants are in the same COI class.
- An agent session that has accessed Tenant A's codebase must not access Tenant B's codebase if they are competitors.
- Agent sessions must not carry information between tenants through persistent memory, shared context, or fine-tuning on tenant data.

This maps to the Chinese Wall model with the additional complication that the "subject" (the LLM) may retain information in its weights, making perfect compartmentalization impossible without session isolation.

**Criticism and Refinement.** Lin (1989) identified that Brewer and Nash's conflict of interest is a binary relation, not an equivalence class (partition), which can lead to inconsistencies. The Aggressive Chinese Wall Security Policy (ACWSP) corrects this. For agent systems, the practical implication is that COI classes must be defined carefully with transitive closure: if Tenant A conflicts with Tenant B, and Tenant B conflicts with Tenant C, the agent's access to A's data must also be restricted after accessing C's data.

**References:**
- Bell, D. and LaPadula, L. (1973). Secure Computer Systems: Mathematical Foundations. MITRE Technical Report 2547.
- Bell, D. and LaPadula, L. (1976). Secure Computer System: Unified Exposition and MULTICS Interpretation. MITRE Technical Report MTR-2997.
- Biba, K. (1977). Integrity Considerations for Secure Computer Systems. MITRE Technical Report MTR-3153.
- Lipner, S. (1982). Non-Discretionary Controls for Commercial Applications. IEEE Symposium on Security and Privacy.
- Brewer, D. and Nash, M. (1989). The Chinese Wall Security Policy. IEEE Symposium on Security and Privacy.
- Lin, T. (1989). Chinese Wall Security Policy: An Aggressive Model. ACSAC.

---

## 7. Synthesis: The Agent Harness Security Architecture

### 7.1 Unified Threat Model

The six formalisms developed above converge on a coherent security architecture for AI agent harnesses:

1. **From TCB theory (Section 1):** The agent is outside the TCB. Security depends on a small, verifiable set of enforcement mechanisms, not on the agent's behavior.

2. **From the confused deputy analysis (Section 2):** The agent is inherently a confused deputy. It possesses capabilities (tool access, file write, shell exec) and processes untrusted input (prompts, web content, code comments). Capability-based scoping limits the damage radius but does not prevent confusion within the authorized scope.

3. **From the impossibility results (Section 3):** Alignment-based defenses (prompt engineering, RLHF, constitutional AI) can reduce but never eliminate the probability of adversarial prompts overriding the agent's intended behavior. The BEB framework proves that adversarial prompts of bounded length always exist.

4. **From STRIDE/OWASP (Section 4):** Prompt injection is an Elevation of Privilege attack, the most dangerous STRIDE category. The OWASP Top 10 for LLMs (2025) places it as the #1 risk. The mitigation architecture maps to the TCB components.

5. **From defense-in-depth (Section 5):** Heuristic defense layers (input filtering, prompt reinforcement, output validation) have correlated failure modes because they all share the fundamental channel conflation limitation. Only structural defenses (sandboxing, capability restrictions) provide uncorrelated, genuinely additive protection.

6. **From BLP/Biba (Section 6):** The agent must read low-integrity input (violating Biba) while protecting high-confidentiality secrets (obeying BLP). The resolution is structural path separation: the data path and the credential path are architecturally distinct, with the TCB mediating all cross-path references.

### 7.2 The Security Invariants

From this synthesis, we derive the fundamental security invariants for an agent harness:

**Invariant 1 (TCB Encapsulation).** The security policy is enforced exclusively by TCB components. The agent's behavior is unconstrained within the boundary defined by the TCB.

    forall actions a : a is permitted iff TCB.authorize(a) = true

**Invariant 2 (Credential Isolation).** Raw credentials never enter the agent's observable state (context window, tool outputs, logs accessible to the agent).

    forall t : credentials intersection agent_state(t) = empty_set

**Invariant 3 (Capability Scoping).** Each agent session operates with the minimum capability set required for its task. Capabilities are granted by the TCB, not requested by the agent.

    Auth(agent, task) = min_capability_set(task)

**Invariant 4 (Complete Mediation).** Every tool invocation, file access, network request, and credential use passes through the reference monitor.

    forall actions a : a is mediated by reference_monitor

**Invariant 5 (Structural Defense Primacy).** Security-critical properties (credential confidentiality, file system boundaries, network isolation) are enforced by structural mechanisms, not by the agent's compliance with instructions.

    forall property P in SecurityCritical : P is enforced structurally, not behaviorally

**Invariant 6 (Audit Completeness).** All agent actions, tool invocations, and TCB decisions are logged with sufficient detail for post-hoc security review.

    forall actions a : exists log_entry(a) with (timestamp, subject, object, action, decision)

### 7.3 Open Problems

Several formal questions remain unresolved:

1. **Optimal TCB granularity.** How fine-grained should capability scoping be? Too coarse grants excessive authority; too fine creates usability friction and may drive users to disable protections (violating Saltzer and Schroeder's psychological acceptability principle).

2. **Dynamic capability escalation.** Many tasks require the agent to discover what capabilities it needs during execution. How can dynamic capability grants be mediated without requiring the agent to specify its own authority (which re-introduces the confused deputy)?

3. **Multi-agent trust.** In systems with multiple agents (orchestrator, sub-agents, critic agents), what is the correct trust model? The BLP/Biba framework assumes a static assignment of security levels, but agent roles may be dynamic and task-dependent.

4. **Quantifying defense-in-depth.** The beta factor model provides a framework for correlated failures, but estimating $\beta$ for AI security layers requires empirical data that largely does not exist. What is the actual correlation between prompt injection bypasses of different defense layers?

5. **Chinese Wall enforcement in stateful models.** LLMs retain information in their weights and, during a session, in their context. True Chinese Wall compartmentalization requires that no information leak between tenant-separated sessions. Can this be guaranteed without complete model re-initialization between sessions?

---

## Appendix A: Summary of Key Formal Results

| Result | Source | Statement | Agent Harness Implication |
|:-:|:-:|:-:|:-:|
| Reference Monitor Properties | Anderson (1972) | RVM must be always invoked, tamperproof, verifiable | The harness permission system must mediate all tool calls, resist agent manipulation, and be small enough to verify |
| TCB Minimality | Orange Book (1985) | Smaller TCB = smaller verification surface = fewer residual defects | Harness security components should be minimal; the agent and its runtime are outside the TCB |
| Confused Deputy | Hardy (1988) | A privileged program tricked by a less-privileged one into misusing its authority | The agent (deputy) has tool capabilities; adversarial input (less-privileged) tricks it into misusing them |
| BLP Basic Security Theorem | Bell and LaPadula (1976) | If initial state is secure and transitions preserve security properties, all reachable states are secure | If the harness correctly enforces permission checks on every transition, no reachable state leaks credentials |
| Biba Integrity Axioms | Biba (1977) | No read down, no write up | The agent violates "no read down" by design; structural path separation contains the violation |
| BEB Theorem 1 | Wolf et al. (2023) | For any behavior with $\alpha > 0$ probability, adversarial prompts of length $O(\log(1/\alpha)/\beta)$ exist | Alignment cannot eliminate prompt injection; structural enforcement is necessary |
| BEB Theorem 2 | Wolf et al. (2023) | System prompts add only $O(\|s_0\|)$ to adversarial prompt length | System prompt hardening provides linear, not exponential, defense |
| Chinese Wall Axioms | Brewer and Nash (1989) | Access constrained by history; write rule prevents cross-company information flow | Multi-tenant agent sessions must enforce tenant isolation with history-aware access control |
| Beta Factor Model | Fleming (1975) | Common cause failures dominate when individual layers are effective: $P \approx \beta q$ | Heuristic defense layers have correlated failures; structural layers provide the only uncorrelated protection |
| Lethal Trifecta | Willison (2024) | Private data + untrusted content + ability to act = exploitable confused deputy | Harness architecture must break at least one leg of the trifecta for each operation |

---

## Appendix B: Reference Bibliography

### Primary Sources (Foundational)

- Anderson, J.P. (1972). *Computer Security Technology Planning Study*. ESD-TR-73-51, Vol. I-II. USAF Electronic Systems Division.
- Bell, D.E. and LaPadula, L.J. (1973). *Secure Computer Systems: Mathematical Foundations*. MITRE Technical Report MTR-2547.
- Bell, D.E. and LaPadula, L.J. (1976). *Secure Computer System: Unified Exposition and MULTICS Interpretation*. MITRE Technical Report MTR-2997.
- Biba, K.J. (1977). *Integrity Considerations for Secure Computer Systems*. MITRE Technical Report MTR-3153.
- Brewer, D.F.C. and Nash, M.J. (1989). The Chinese Wall Security Policy. *Proceedings of the IEEE Symposium on Security and Privacy*.
- DoD (1985). *Trusted Computer System Evaluation Criteria*. DoD 5200.28-STD.
- Hardy, N. (1988). The Confused Deputy: (or why capabilities might have been invented). *ACM SIGOPS Operating Systems Review*, 22(4).
- Saltzer, J.H. and Schroeder, M.D. (1975). The Protection of Information in Computer Systems. *Proceedings of the IEEE*, 63(9).

### Primary Sources (Modern)

- Wolf, Y., Wies, N., Levine, Y., and Shashua, A. (2023). Fundamental Limitations of Alignment in Large Language Models. *arXiv:2304.11082*; ICML 2024.
- Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., and Fritz, M. (2023). Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection. *AISec@CCS 2023*.
- UK NCSC (2023). Prompt Injection Is Not SQL Injection (It May Be Worse). ncsc.gov.uk.

### Secondary Sources

- Bell, D.E. (2005). Looking Back at the Bell-La Padula Model. *ACSAC*.
- Fleming, K. (1975). Reliability Analysis of a Redundant Sensor System. *Nuclear Engineering and Design*.
- Klein, G. et al. (2009). seL4: Formal Verification of an OS Kernel. *SOSP*.
- Lampson, B., Abadi, M., Burrows, M., and Wobber, E. (1992). Authentication in Distributed Systems: Theory and Practice. *ACM TOCS*, 10(4).
- Lin, T. (1989). Chinese Wall Security Policy: An Aggressive Model. *ACSAC*.
- Lipner, S. (1982). Non-Discretionary Controls for Commercial Applications. *IEEE Symposium on Security and Privacy*.
- Littlewood, B. and Strigini, L. (2004). Redundancy and Diversity in Security. *ESORICS*.
- McConnell, S. (2004). *Code Complete*. 2nd edition. Microsoft Press.
- Miller, M.S. (2006). *Robust Composition: Towards a Unified Approach to Access Control and Concurrency Control*. PhD Thesis, Johns Hopkins University.
- Miller, M., Yee, K., and Shapiro, J. (2003). Capability Myths Demolished. Tech Report, Johns Hopkins University.
- OWASP (2024). OWASP Top 10 for LLM Applications 2025.
- OWASP (2025). AI Agent Security Cheat Sheet.
- Reason, J. (1990). *Human Error*. Cambridge University Press.
- Shostack, A. (2014). *Threat Modeling: Designing for Security*. Wiley.
- Willison, S. (2024). The Lethal Trifecta for AI Agents. simonwillison.net.
- IEC 61508 (2010). Functional Safety of Electrical/Electronic/Programmable Electronic Safety-related Systems.
