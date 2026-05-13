# Tiered Context Architecture and Structural Enforcement: A Formal Treatment

**Formalization Round 3**
**Date:** 2026-04-02

---

## 1. The Three-Tier Information Model

### 1.1 Definitions and Setup

**[Grounded in: Anthropic (2025) context engineering framework; Factory.ai layered context stack; HumanLayer ACE-FCA context quality hierarchy]**

Let $\mathcal{I} = \{f_1, f_2, \ldots, f_n\}$ be the **information space** of a software project: all files, dependency edges, test results, git history entries, tool outputs, and documentation fragments available to an agent. Let $S$ be the current task specification (the agent's objective) and $\theta$ the model's parameters (fixed during inference).

An agent operates within a **context window** of capacity $W$ tokens. A **context configuration** is a subset $C \subseteq \mathcal{I}$ such that $|C| \leq W$, where $|C|$ denotes the total token cost of encoding the items in $C$.

**Definition 1 (Three-Tier Partition).** A **tiered information architecture** is a partition $\mathcal{I} = T_1 \sqcup T_2 \sqcup T_3$ with the following access semantics:

| Tier | Name | Access Cost | Persistence | Capacity Constraint |
|------|------|-------------|-------------|---------------------|
| $T_1$ | Active | $c_1 = 0$ (always loaded) | Permanent in window | $\|T_1\| \leq B_1 \ll W$ |
| $T_2$ | Searchable | $c_2 > 0$ per retrieval | Transient (loaded, used, discarded) | $\|T_2^{\text{loaded}}\| \leq B_2$ at any time |
| $T_3$ | Hidden | $c_3 = \infty$ (never loaded) | Never enters window | $\|T_3 \cap C\| = 0$ always |

The capacity constraint on $T_1$ is the critical design parameter. Empirically, production harnesses converge on $B_1 \approx 60$ lines for the active tier (HumanLayer's CLAUDE.md under 60 lines; OpenAI Codex's AGENTS.md at roughly 100 lines; ETH Zurich's recommendation of "only minimal requirements").

### 1.2 Information Value and Degradation

**[Building on: Shannon (1948) mutual information; Anthropic's "attention budget" and "context rot" concepts]**

Define the **task-conditional information value** of an item $f_i$ as:

$$v(f_i) = I(f_i; P \mid S, \theta)$$

where $P$ is the distribution over correct agent outputs and $I(\cdot; \cdot \mid \cdot)$ is conditional mutual information. Informally, $v(f_i)$ measures how much knowing $f_i$ reduces uncertainty about the correct action given the task $S$.

Define the **context degradation function** $\delta: \mathbb{R}_{\geq 0} \to [0, 1]$ as the fraction of information value lost due to attention dilution when the total context size is $|C|$. Empirical constraints on $\delta$:

- $\delta(0) = 0$ (no context, no degradation from context)
- $\delta$ is monotonically non-decreasing (more tokens, more dilution)
- $\delta$ is convex for $|C| > W/2$ (degradation accelerates past half-window; cf. Chroma's finding that "performance grows increasingly unreliable as input length grows")

The **effective information** delivered by a context configuration $C$ is:

$$V_{\text{eff}}(C) = \left(1 - \delta(|C|)\right) \cdot \sum_{f_i \in C} v(f_i)$$

This is the core tension: adding items increases the sum $\sum v(f_i)$ but also increases $\delta(|C|)$, reducing the multiplier on all items.

### 1.3 The Tier Assignment Problem

**[Novel formalization]**

**Problem (Optimal Tier Assignment).** Given the information space $\mathcal{I}$, task $S$, and capacity constraints $B_1, B_2$, find a partition $\mathcal{I} = T_1 \sqcup T_2 \sqcup T_3$ that maximizes the expected effective information across the agent's trajectory:

$$\max_{T_1, T_2, T_3} \; \mathbb{E}_\tau \left[ V_{\text{eff}}\left(T_1 \cup T_2^{\text{retrieved}}(\tau)\right) \right]$$

subject to:

1. $|T_1| \leq B_1$ (active tier capacity)
2. $|T_2^{\text{retrieved}}(\tau_t)| \leq B_2$ at each step $t$ (searchable tier loading limit)
3. $T_2^{\text{retrieved}}(\tau_t) \cap C_{t+1} = \emptyset$ unless re-retrieved (transience of Tier 2)

where $\tau = (\tau_1, \ldots, \tau_T)$ is the agent's trajectory (sequence of actions) and $T_2^{\text{retrieved}}(\tau_t) \subseteq T_2$ is the subset retrieved at step $t$.

**Proposition 1 (Greedy Tier 1 Assignment).** Under the assumption that $v(f_i)$ values are known and $\delta$ is convex, the optimal $T_1$ assignment is approximately solved by the greedy algorithm: sort items by $v(f_i) / |f_i|$ (information density), assign to $T_1$ in decreasing order until $B_1$ is exhausted.

*Proof sketch.* This is a variant of the fractional knapsack problem. With convex $\delta$, the marginal degradation cost of adding an item to $T_1$ increases with $|T_1|$. The greedy-by-density solution is optimal for fractional knapsack and approximately optimal (within a constant factor) for the integer variant when item sizes are small relative to $B_1$. $\square$

**Corollary 1.** The optimal $T_1$ contains the highest information-density items, not the highest total-information items. A 5-line architectural invariant with $v = 0.8$ dominates a 500-line file with $v = 2.0$ because its density ($0.16$ per token-line) far exceeds the file's ($0.004$ per token-line).

### 1.4 Tier 3 Justification: The Cost of Negative Information

**[Grounded in: ETH Zurich (2026) finding that LLM-generated context files actively hurt; HumanLayer's "success should be silent" principle]**

Items assigned to $T_3$ are not merely low-value; some are **negatively valued** in the context window:

$$v_{\text{effective}}(f_i \mid C) = v(f_i) - \delta'(|C|) \cdot \sum_{f_j \in C} v(f_j)$$

where $\delta'(|C|)$ is the marginal degradation per added token. When $v(f_i) < \delta'(|C|) \cdot \sum_{f_j \in C} v(f_j)$, adding $f_i$ to the context reduces total effective information. It does not merely waste space; it actively degrades the value extracted from every other item already present.

ETH Zurich's empirical finding maps directly: LLM-generated AGENTS.md files had $v \approx 0$ (redundant with existing documentation) but cost 20%+ additional tokens, pushing the system into the regime where $\delta'(|C|) \cdot \sum v(f_j)$ dominated, yielding the observed -3% success rate.

Items that belong in $T_3$ include:

- **Passing tests** (HumanLayer's "success should be silent"): $v \approx 0$ for the current task, high token cost
- **Other agents' workspaces**: zero relevance to the current agent's task, high confusion risk
- **Evaluation infrastructure**: must remain hidden to prevent gaming (an integrity constraint, not just an information constraint)
- **Old tool outputs**: already processed; information extracted into decisions or artifacts (JetBrains' observation masking operationalizes this)

---

## 2. The Context Curation Theorem

### 2.1 Setup

**[Grounded in: ETH Zurich (2026); JetBrains (2025); Anthropic's "smallest set of high-signal tokens" principle]**

Consider two context strategies for the same task $S$:

- **Curated**: $C_s \subseteq \mathcal{I}$ with $|C_s| \ll W$, constructed by selecting items with high $v(f_i)/|f_i|$
- **Uncurated**: $C_l \subseteq \mathcal{I}$ with $|C_l| \approx W$, constructed by including all potentially relevant items

Define the **information density** of a context configuration:

$$\rho(C) = \frac{\sum_{f_i \in C} v(f_i)}{|C|}$$

By construction, $\rho(C_s) \gg \rho(C_l)$ (the curated set has much higher bits-per-token).

### 2.2 Theorem Statement

**Theorem 2 (Context Curation).** Let $C_s$ and $C_l$ be curated and uncurated context configurations respectively, with $|C_s| < |C_l|$. The curated configuration delivers higher effective information whenever:

$$\frac{\rho(C_s)}{\rho(C_l)} > \frac{|C_l|}{|C_s|} \cdot \frac{1 - \delta(|C_l|)}{1 - \delta(|C_s|)}^{-1}$$

or equivalently:

$$\rho(C_s) \cdot |C_s| \cdot (1 - \delta(|C_s|)) > \rho(C_l) \cdot |C_l| \cdot (1 - \delta(|C_l|))$$

*Proof.* By definition:

$$V_{\text{eff}}(C_s) = (1 - \delta(|C_s|)) \cdot \sum_{f_i \in C_s} v(f_i) = (1 - \delta(|C_s|)) \cdot \rho(C_s) \cdot |C_s|$$

$$V_{\text{eff}}(C_l) = (1 - \delta(|C_l|)) \cdot \sum_{f_i \in C_l} v(f_i) = (1 - \delta(|C_l|)) \cdot \rho(C_l) \cdot |C_l|$$

The curated strategy wins when $V_{\text{eff}}(C_s) > V_{\text{eff}}(C_l)$, which is the stated inequality. $\square$

### 2.3 Empirical Calibration

Using the ETH Zurich data to ground the parameters:

- LLM-generated context files added roughly 20% more tokens ($|C_l|/|C_s| \approx 1.2$) but contributed near-zero unique information ($\rho(C_l) < \rho(C_s)$ due to redundancy with existing docs).
- The observed -3% success rate implies $\delta(|C_l|) - \delta(|C_s|) \geq 0.03$ for the 20% size increase, suggesting $\delta$ is steeply rising in that operating regime.
- Human-written files achieved +4% at +19% cost: the density premium $\rho(C_{\text{human}}) > \rho(C_{\text{base}})$ was sufficient to overcome the degradation cost, but only barely.

**Corollary 2 (Diminishing Returns of Context Expansion).** For any context configuration $C$, adding a set of items $\Delta$ is beneficial only when:

$$\sum_{f_i \in \Delta} v(f_i) > \frac{\delta(|C| + |\Delta|) - \delta(|C|)}{1 - \delta(|C| + |\Delta|)} \cdot V_{\text{eff}}(C)$$

As $|C|$ grows and $\delta$ steepens, the right-hand side grows rapidly, meaning each additional item must clear a higher and higher bar to justify inclusion. This formalizes the empirical observation that "more context is not better context."

---

## 3. Structural vs. Instructional Enforcement

### 3.1 The Noisy Channel Model

**[Grounded in: HumanLayer "Skill Issue" (2025); ETH Zurich (2026); JetBrains (2025); Spotify Honk (2025); OpenAI Codex (2025)]**

**Definition 2 (Instructional Enforcement).** An instructional constraint is a natural language directive $d$ included in the agent's context (system prompt, CLAUDE.md, etc.) specifying a behavioral restriction. Its compliance probability is:

$$P(\text{comply} \mid d, C, S) = 1 - \epsilon(d, C, S)$$

where $\epsilon \in (0, 1)$ is the violation probability, which depends on:

- The clarity and salience of $d$ within the full context $C$
- The degree to which complying with $d$ conflicts with the task objective $S$
- The model's instruction-following capability (a function of $\theta$)

Crucially, $\epsilon > 0$ always. Instructional enforcement is inherently probabilistic.

**Definition 3 (Structural Enforcement).** A structural constraint is a mechanism $m$ implemented at the harness or infrastructure layer that physically prevents a class of actions. Its compliance is deterministic:

$$P(\text{comply} \mid m) = 1$$

The agent cannot violate the constraint regardless of what tokens it generates, because the execution environment rejects or never surfaces the prohibited action.

### 3.2 The Compounding Reliability Gap

**Theorem 3 (Multi-Step Compliance Decay).** Consider an agent trajectory of $T$ steps, each requiring compliance with a constraint. Under instructional enforcement with per-step violation probability $\epsilon$, the probability of full-trajectory compliance is:

$$P(\text{all steps comply} \mid \text{instructional}) = (1 - \epsilon)^T$$

Under structural enforcement:

$$P(\text{all steps comply} \mid \text{structural}) = 1$$

The **reliability gap** $\Gamma(T) = 1 - (1 - \epsilon)^T$ grows with trajectory length. For $\epsilon = 0.05$ (a 5% per-step violation rate, which is conservative for complex directives):

| Trajectory Length $T$ | Instructional Compliance | Reliability Gap |
|---|---|---|
| 1 | 95.0% | 5.0% |
| 10 | 59.9% | 40.1% |
| 25 | 27.7% | 72.3% |
| 50 | 7.7% | 92.3% |
| 100 | 0.6% | 99.4% |
| 250 | $< 0.001\%$ | $\approx 100\%$ |

For long-horizon agents (JetBrains tested up to 250 turns), instructional enforcement is virtually guaranteed to fail at least once.

*Proof.* Independence of per-step compliance is an approximation; in practice, violations may be correlated (a confused agent is more likely to violate on the next step too), making the actual decay faster than $(1-\epsilon)^T$. The theorem provides a lower bound on the reliability gap. $\square$

### 3.3 Cost-Adjusted Comparison

Structural enforcement has a one-time implementation cost $c_{\text{struct}}$ (building the harness mechanism) but zero per-inference cost and zero context cost. Instructional enforcement has near-zero implementation cost (writing a sentence) but ongoing costs:

- **Context cost**: $|d|$ tokens consumed in every inference call
- **Reasoning overhead**: ETH Zurich measured +22% reasoning tokens when agents processed instructional context
- **Failure recovery cost**: $c_{\text{recover}}$ per violation, including wasted trajectory steps and potential rollback

The expected cost over a trajectory of length $T$:

$$\text{Cost}_{\text{instructional}} = T \cdot |d| \cdot c_{\text{token}} + T \cdot 0.22 \cdot c_{\text{reasoning}} + (1 - (1-\epsilon)^T) \cdot c_{\text{recover}}$$

$$\text{Cost}_{\text{structural}} = c_{\text{struct}} \quad \text{(amortized over all trajectories)}$$

For any harness running more than a handful of trajectories, structural enforcement dominates.

### 3.4 Taxonomy of Enforcement Mechanisms

Production harnesses implement structural enforcement through five categories:

| Category | Mechanism | What It Prevents | Examples |
|----------|-----------|------------------|----------|
| **Filesystem isolation** | Separate worktrees, containers | Cross-task file interference | RAPID worktrees, Codex containers |
| **Tool restriction** | Allowlisted tool sets | Unauthorized actions | Spotify Honk (no code search), Codex (no internet) |
| **Context scoping** | Fresh windows per task | Context rot, cross-task leakage | GSD 200K fresh per task, sub-agent pattern |
| **Output filtering** | Observation masking, hook-based suppression | Noise accumulation | JetBrains masking, HumanLayer silent-success hooks |
| **Interface contracts** | Typed schemas, CONTRACT.json | Interface drift across agents | RAPID contracts, typed tool schemas |

---

## 4. The Fresh Context Advantage

### 4.1 Accumulated Context Model

**[Grounded in: Anthropic's "context rot" concept; GSD's fresh-per-task pattern; JetBrains observation masking]**

Consider an agent processing a sequence of tasks $S_1, S_2, \ldots, S_T$. Under **accumulated context**, the context at task $t$ is:

$$C_t^{\text{acc}} = C_0 \cup \Delta_1 \cup \Delta_2 \cup \cdots \cup \Delta_t$$

where $C_0$ is the initial context and $\Delta_i$ is the context generated during task $S_i$ (tool outputs, reasoning traces, intermediate results).

Under **fresh context**, the context at task $t$ is:

$$C_t^{\text{fresh}} = C_0 \cup \text{select}(\mathcal{I}, S_t)$$

where $\text{select}(\mathcal{I}, S_t)$ retrieves only items relevant to the current task.

### 4.2 Context Rot Rate

**Definition 4 (Relevance Density).** The relevance density of a context configuration for task $S_t$ is:

$$\rho_t(C) = \frac{\sum_{f_i \in C} v_t(f_i)}{|C|}$$

where $v_t(f_i) = I(f_i; P_t \mid S_t, \theta)$ is the value of item $f_i$ for task $S_t$ specifically.

**Proposition 2 (Monotonic Density Decay).** Under accumulated context with diverse tasks, the relevance density decreases monotonically:

$$\rho_t(C_t^{\text{acc}}) \leq \rho_{t-1}(C_{t-1}^{\text{acc}})$$

in expectation over task sequences where successive tasks are not identical.

*Proof sketch.* Each $\Delta_i$ was generated for task $S_i$ and has high relevance for $S_i$ but (for diverse task sequences) low expected relevance for $S_t$ where $t \neq i$. As $t$ increases:

- The numerator: $\sum v_t(f_i)$ grows slowly because most accumulated items have near-zero value for $S_t$
- The denominator: $|C_t^{\text{acc}}|$ grows monotonically by at least $|\Delta_t|$ per step

The ratio therefore decreases. The rate of decrease depends on **task diversity**: if successive tasks share little relevant context, each $\Delta_i$ contributes mostly noise to future tasks. $\square$

**Definition 5 (Context Rot Rate).** The context rot rate is:

$$r_{\text{rot}}(t) = \frac{\rho_0(C_0)}{\rho_t(C_t^{\text{acc}})} - 1$$

measuring how much the relevance density has degraded relative to the initial (presumably curated) context. Under the monotonic decay proposition, $r_{\text{rot}}(t) \geq 0$ and is non-decreasing.

### 4.3 Fresh Context Theorem

**Theorem 4 (Fresh Context Dominance).** For a task sequence of length $T$ with task diversity $d > 0$ (defined as $\mathbb{E}[1 - \text{cos}(v_i, v_j)]$ for $i \neq j$ over the task-value vectors), fresh context dominates accumulated context in expected effective information:

$$\mathbb{E}\left[\sum_{t=1}^T V_{\text{eff}}(C_t^{\text{fresh}})\right] > \mathbb{E}\left[\sum_{t=1}^T V_{\text{eff}}(C_t^{\text{acc}})\right]$$

whenever $T > T^*$ where the crossover point $T^*$ satisfies:

$$T^* = \frac{c_{\text{select}}}{\mathbb{E}\left[V_{\text{eff}}(C_t^{\text{fresh}}) - V_{\text{eff}}(C_t^{\text{acc}})\right]}$$

with $c_{\text{select}}$ being the cost (in effective-information units) of the selection/retrieval process for fresh context.

*Proof sketch.* The per-task advantage of fresh context grows with $t$ (because accumulated context gets worse over time while fresh context maintains constant quality). The only cost is the selection overhead $c_{\text{select}}$. For any positive per-task advantage and finite selection cost, there exists $T^*$ beyond which the cumulative advantage dominates the cumulative selection cost. $\square$

**Remark.** Production harnesses empirically set $T^* = 1$, treating fresh context as always preferable. GSD never accumulates. Codex tears down containers per task. This suggests that in practice, $c_{\text{select}}$ is small relative to the degradation cost of even one round of accumulation.

### 4.4 Compaction as Partial Fresh Context

JetBrains' observation masking and Anthropic's compaction techniques occupy a middle ground: they partially refresh context by removing low-value items while retaining high-value ones. Formally, compaction applies a filter $\phi: C_t^{\text{acc}} \to C_t^{\text{compact}}$ where:

$$|C_t^{\text{compact}}| < |C_t^{\text{acc}}|, \quad \rho_t(C_t^{\text{compact}}) > \rho_t(C_t^{\text{acc}})$$

The compaction operator increases density by selectively removing low-density items. JetBrains' key finding, that observation masking outperforms LLM summarization, maps to the principle that $\phi$ should be a **deterministic projection** (drop tool outputs, keep actions and reasoning) rather than a **lossy generative compression** (ask an LLM to summarize). The deterministic projection preserves signal integrity; the generative compression introduces noise and, critically, smooths over failure signals that the agent needs to recognize (explaining the 15% trajectory elongation).

---

## 5. The Reuse Map as Information Compression

### 5.1 The Reuse Decision Problem

**[Grounded in: production CLAUDE.md reuse maps; Anthropic's "minimal set of high-signal tokens" principle]**

When an agent needs functionality $g$ (a function, class, or module), it faces a binary decision:

$$D_g \in \{\text{create\_new}, \text{reuse\_existing}\}$$

The correct decision depends on whether a suitable existing implementation exists in the codebase $\mathcal{F}$.

Without any context, the agent must search $\mathcal{F}$ (at cost $c_{\text{search}} \cdot |\mathcal{F}|$) to make this decision. With full codebase context, it has complete information but at the cost of $|\mathcal{F}|$ tokens and the associated degradation.

### 5.2 The Reuse Map

**Definition 6 (Reuse Map).** A reuse map is a set $R = \{(n_j, \sigma_j, \ell_j)\}_{j=1}^{|R|}$ where each entry consists of:

- $n_j$: a human-readable name or description
- $\sigma_j$: a type signature or interface summary
- $\ell_j$: a file path and location

The reuse map is a **lossy compression** of the codebase optimized for the reuse decision:

$$|R| \ll |\mathcal{F}|$$

### 5.3 Compression Quality

**Proposition 3 (Reuse Map Sufficiency).** For the reuse decision $D_g$, the reuse map $R$ is approximately sufficient:

$$I(R; D_g \mid S, \theta) \approx I(\mathcal{F}; D_g \mid S, \theta)$$

That is, the reuse map carries nearly as much information about the correct reuse decision as the full codebase does.

*Argument.* The reuse decision depends on:

1. **Existence**: Is there a component with matching semantics? The name and signature in $R$ capture this.
2. **Suitability**: Does the component's interface match the needed interface? The type signature in $R$ captures this.
3. **Location**: Where is it? The path in $R$ captures this.

What $R$ does not capture:

4. **Implementation quality**: Is the existing code well-written? This affects the decision only at the margins.
5. **Internal complexity**: What are the implementation details? Irrelevant to the reuse decision (relevant only after the decision is made, at which point the agent retrieves the full file from $T_2$).

Since factors 1-3 dominate the decision and $R$ captures all three, the information loss is small.

### 5.4 Compression Ratio and Density

For a codebase of $N$ files with an average of $L$ lines per file, and $k$ reusable components with an average reuse map entry of $e$ tokens:

$$\text{Compression ratio} = \frac{k \cdot e}{N \cdot L} \ll 1$$

Typical values: $N = 500$ files, $L = 100$ lines ($\approx 30$ tokens/line), $k = 50$ reusable components, $e = 20$ tokens per entry:

$$\text{Ratio} = \frac{50 \cdot 20}{500 \cdot 100 \cdot 30} = \frac{1{,}000}{1{,}500{,}000} \approx 0.07\%$$

The reuse map compresses the codebase by roughly 1000x while retaining nearly all information relevant to the reuse decision. This extreme compression ratio is what makes it feasible to include in $T_1$: a 1,000-token reuse map carries the reuse-decision-relevant information of a 1.5M-token codebase.

### 5.5 Connection to Tier Assignment

The reuse map is the canonical example of a $T_1$ item: extremely high information density for a specific, frequent decision class. It belongs in $T_1$ because:

- The reuse decision arises at nearly every function-creation point (high frequency)
- The map's token cost is tiny relative to $B_1$ (fits easily)
- The alternative (searching the codebase each time) costs $c_{\text{search}}$ per occurrence, which compounds across a trajectory

The full source files referenced by the map belong in $T_2$: loaded on demand when the agent decides to reuse and needs implementation details.

---

## 6. Unified Model: The Harness Information Architecture

### 6.1 Complete Formal Specification

Combining the preceding formalizations, the complete information architecture for a coding agent harness is:

$$\mathcal{H} = (W, \; T_1, T_2, T_3, \; \delta, \; \Phi, \; \mathcal{M})$$

where:

- $W$: context window capacity
- $T_1, T_2, T_3$: the three-tier partition of $\mathcal{I}$
- $\delta$: the degradation function (empirically calibrated)
- $\Phi$: the set of structural enforcement mechanisms $\{m_1, \ldots, m_p\}$
- $\mathcal{M}$: the set of compaction operators $\{\phi_1, \ldots, \phi_q\}$ for managing context growth

### 6.2 Design Invariants

The following invariants must hold throughout the agent's operation:

**I1 (Active Tier Budget).** $|T_1| \leq B_1$ at all times. No mechanism may cause $T_1$ to grow beyond its budget.

**I2 (Transience of Tier 2).** For every item $f_i$ retrieved from $T_2$ at step $t$, either $f_i$ is explicitly discarded before step $t + \tau_{\text{ttl}}$ (for some configured TTL), or a compaction operator $\phi_j$ removes it.

**I3 (Hermetic Tier 3).** No retrieval mechanism, tool call, or agent action can surface items from $T_3$. This is enforced structurally, not instructionally.

**I4 (Density Monotonicity under Compaction).** Every compaction operator $\phi_j$ satisfies $\rho_t(\phi_j(C)) \geq \rho_t(C)$: compaction never decreases relevance density.

**I5 (Structural Over Instructional).** For every constraint that the harness needs to enforce with probability $> 1 - \epsilon_{\text{threshold}}$ over $T_{\max}$ steps, there exists a structural enforcement mechanism $m_k \in \Phi$ implementing it, unless the implementation cost exceeds a budget $c_{\text{max}}$.

### 6.3 Tier Contents in Practice

Grounded in the empirical findings from production harnesses:

**$T_1$ (Active, always loaded):**

| Item | Justification | Size |
|------|---------------|------|
| Task specification | Defines the objective; $v \approx 1.0$ | 5-15 lines |
| Architectural invariants | Prevents structural violations; high $v$, low token cost | 5-10 lines |
| File ownership map | Prevents cross-boundary modifications | 5-10 lines |
| Reuse map | Compresses codebase for reuse decisions (Section 5) | 10-20 lines |
| Tool constraints | Scopes available actions | 5-10 lines |
| Output format spec | Prevents re-work from format mismatches | 3-5 lines |

Total: 33-70 lines, consistent with the empirical $B_1 \approx 60$ lines.

**$T_2$ (Searchable, loaded on demand):**

- Full file contents (retrieved when agent needs implementation details)
- Dependency graphs (retrieved when agent needs to understand impact)
- Test failures (retrieved when agent needs to debug)
- Git history (retrieved when agent needs change context)
- Documentation (retrieved when agent needs API details)

**$T_3$ (Hidden, never loaded):**

- Passing test results (success is silent)
- Other agents' workspaces (isolation boundary)
- Evaluation infrastructure (integrity constraint)
- Old tool outputs after compaction (already processed)
- LLM-generated documentation that duplicates existing docs (negative value per ETH Zurich)

---

## 7. Summary of Formal Results

| Result | Statement | Grounding |
|--------|-----------|-----------|
| **Proposition 1** | Optimal $T_1$ is greedy-by-density (knapsack) | Shannon information theory; HumanLayer/Codex practice |
| **Theorem 2** | Curated context beats uncurated when density premium overcomes size disadvantage | ETH Zurich (-3% for LLM-generated, +4% for human at +19% cost) |
| **Corollary 2** | Diminishing returns: each added item must clear a rising bar | Anthropic "attention budget"; convexity of $\delta$ |
| **Theorem 3** | Instructional compliance decays as $(1-\epsilon)^T$; structural compliance is constant at 1 | HumanLayer, Spotify, Codex structural patterns; JetBrains masking vs. summarization |
| **Proposition 2** | Accumulated context relevance density decays monotonically | Anthropic "context rot"; GSD fresh-per-task design |
| **Theorem 4** | Fresh context dominates accumulated context for sufficiently long task sequences | GSD, Codex, RAPID isolation patterns |
| **Proposition 3** | Reuse map is approximately sufficient for reuse decisions at 0.07% of codebase size | Production CLAUDE.md patterns; information sufficiency for binary decisions |

### Key Design Implications

1. **Budget $T_1$ ruthlessly.** The active tier's power comes from its smallness. Every line added dilutes every other line's effectiveness. The 60-line empirical ceiling is not arbitrary; it reflects the degradation function's steep climb.

2. **Make $T_2$ retrieval cheap and $T_2$ items transient.** The searchable tier's value depends on low retrieval cost (good indexing, structural navigation tools like AST/call-graph traversal) and strict transience (items do not accumulate).

3. **Enforce $T_3$ structurally.** The hidden tier's boundary must be a mechanism, not a policy. If an agent can access $T_3$ items by asking, the tier boundary is instructional and will eventually fail (Theorem 3).

4. **Prefer deterministic compaction.** JetBrains' observation masking (deterministic) outperformed LLM summarization (generative) on solve rate, cost, and trajectory length. Compaction operators should be projection functions, not generative models.

5. **Reset context per task.** The fresh context theorem (Theorem 4) explains why every successful production harness isolates context per task rather than accumulating across tasks. The context rot rate makes accumulation increasingly expensive.

---

## References

- Anthropic Engineering. "Effective Context Engineering for AI Agents." anthropic.com (Sep 2025).
- Anthropic Engineering. "Effective Harnesses for Long-Running Agents." anthropic.com (2025).
- Bui, N. D. Q. "Building Effective AI Coding Agents for the Terminal." arXiv:2603.05344 (Mar 2026).
- Factory.ai. "The Context Window Problem: Scaling Agents Beyond Token Limits." factory.ai.
- Gloaguen, T., Mundler, N., Muller, M., Raychev, V., & Vechev, M. "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?" arXiv:2602.11988 (Feb 2026).
- Henzinger, T. A., Jhala, R., Majumdar, R., & Sutre, G. "Lazy Abstraction." POPL (2002).
- HumanLayer. "Advanced Context Engineering for Coding Agents." GitHub (2025).
- HumanLayer. "The Skill Issue." humanlayer.dev (2025).
- JetBrains Research. "The Complexity Trap." NeurIPS DL4Code Workshop. arXiv:2508.21433 (Dec 2025).
- Jones, C. B. "Tentative Steps Toward a Development Method for Interfering Programs." ACM TOPLAS 5(4) (1983).
- Meyer, B. "Applying Design by Contract." IEEE Computer 25(10) (1992).
- OpenAI Engineering. "Harness Engineering: Leveraging Codex in an Agent-First World." (2025).
- Shannon, C. E. "A Mathematical Theory of Communication." Bell System Technical Journal 27 (1948).
- Spotify Engineering. "Background Coding Agents: Context Engineering (Honk, Part 2)." (Nov 2025).
