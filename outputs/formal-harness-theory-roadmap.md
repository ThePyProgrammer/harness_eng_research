# Towards a Formal Theory of AI Coding Agent Harnesses: Research Roadmap

*What main.tex should become when it grows up.*

---

## Why main.tex Is Insufficient

The current paper formalizes one dimension (the spec-code abstraction gap) using one mathematical framework (Kolmogorov complexity). The 6-perspective review and 7 deep research axes revealed that this covers maybe 15% of what determines harness quality. The paper's own harness engineer reviewer said: "zero actionable insights." The formal methods reviewer said: "vocabulary, not derivation."

A complete formal theory of harness design needs to formalize ALL the dimensions that matter, using the RIGHT mathematical framework for each, while engaging the contrarian positions that challenge each framework's assumptions.

---

## The Six Pillars and Their Formalisms

### Pillar 1: Information Architecture (extending main.tex)

**What to formalize:** The flow of information through the harness, from human intent to executable code, including context selection, information loss at each stage, and the reuse discovery problem.

**Right formalism:** Information theory (Shannon, not Kolmogorov; the uncomputability skeptic was right that Shannon is the operational foundation). Key quantities:
- $H(P \mid S)$: conditional entropy of code given spec (the abstraction gap, now measurable)
- $I(C; P)$: mutual information between context and correct output (context relevance)
- $H(P \mid S, C)$: residual uncertainty after spec + context (what the agent must "make up")

**What main.tex got right:** The convergence theorem, the refinement lattice, the Galois connection tower.

**What main.tex missed:** Context is not a scalar. The agent sees spec $S$, context $C$ (codebase excerpts, docs, prior conversation), and prior $\theta$ (training data). The effective gap is $H(P \mid S, C, \theta)$, not $K(P \mid S)$. The context selection problem (Problem 1 in the formalizable problems) is the missing piece: how to choose $C$ to minimize $H(P \mid S, C, \theta)$ under a budget constraint.

**Contrarian research needed:**
- **"Context is overrated"**: Fresh Eyes outperforms accumulated context by 17.1% (Suzgun & Kalai). Does more context always reduce $H(P \mid S, C, \theta)$, or does context rot mean the function is non-monotone? Formalize the degradation function $\delta(|C|)$ and find the optimal context size.
- **"The prior does all the work"**: For common patterns (CRUD, auth flows, form validation), $\theta$ already contains enough information that $S$ barely matters. The abstraction gap is not uniform across task types; it is bimodal (trivial for common patterns, huge for novel logic). Research: measure $H(P \mid S, C, \theta)$ across task categories.

---

### Pillar 2: Reliability Architecture

**What to formalize:** Compound error rates, verification cadence, the circular validation problem, and the relationship between verification frequency and end-to-end success.

**Right formalism:** Reliability theory + stochastic processes. Key quantities:
- $R(n, p, V)$: end-to-end reliability of an $n$-step pipeline with per-step success $p$ and verification schedule $V$
- $\beta$: circular validation bias (same-author vs. different-author test quality)
- $\eta(\ell)$: detection efficiency of verification layer $\ell$ per unit cost

**What main.tex missed entirely:** The paper says "employ continuous verification" (Design Principle 4) without any model of what verification costs, how often to verify, or what to verify. The compound error problem ($0.85^{10} \approx 0.20$) is the single most important quantitative fact about agent workflows, and the paper does not mention it.

**Contrarian research needed:**
- **"Verification is not the bottleneck"**: Perhaps compound errors are dominated by the FIRST step (problem understanding, not execution). If step 1 has 60% success and steps 2-10 have 95%, the bottleneck is problem framing, not execution quality. Research: measure per-step error rates across the pipeline. Are they uniform or front-loaded?
- **"Over-verification kills speed"**: Every verification point adds latency and context pollution. There exists an optimal verification frequency that balances error detection against throughput. The research found phase-boundary checking outperforms per-step checking; formalize the tradeoff and find the Pareto frontier.
- **"Structural separation is expensive"**: Turing's principle (separate producer and verifier) requires two agent invocations instead of one. When is the $\beta$ reduction worth the 2x cost? Research: measure $\beta$ empirically in controlled experiments.

---

### Pillar 3: Coordination Architecture

**What to formalize:** Parallelism, topology selection, task decomposition, merge conflict probability, and the relationship between isolation and error amplification.

**Right formalism:** Graph theory + mechanism design. Key quantities:
- $\rho(G)$: coupling density of the file dependency graph (determines decomposability)
- $A_e(t, k)$: error amplification factor for topology $t$ with $k$ agents
- $P_{\text{conflict}}(\Delta_1, \ldots, \Delta_k)$: merge conflict probability given parallel diffs

**What main.tex got wrong:** The multi-agent section was "grafted on" (the MAS reviewer's verdict). It cited Kim et al.'s numbers without connecting them to the formal framework. The real contribution would be deriving WHEN each topology is optimal, not just listing empirical findings.

**Contrarian research needed:**
- **"Parallelism is premature optimization"**: Cursor's failed 20-agent experiment (effective throughput: 2-3) suggests that safe parallelism is harder than it looks. Perhaps sequential execution with fast cycles (the GSD approach) beats parallel execution with slow merge reconciliation. Research: measure end-to-end throughput (features shipped per hour) for sequential vs. parallel, not just cycle time.
- **"Contracts are too rigid"**: RAPID's CONTRACT.json requires the Planner to decompose along file boundaries, which sometimes produces unnatural task splits. Perhaps soft coordination (shared memory with conflict detection, like git itself) outperforms hard isolation (worktrees with ownership). Research: compare the two approaches on the same task set.
- **"Coupling is not static"**: The file coupling graph changes as the codebase evolves. A decomposition that is optimal today may be suboptimal tomorrow. Research: how fast does the coupling graph change, and does dynamic re-decomposition provide enough benefit to justify its cost?

---

### Pillar 4: Temporal Architecture (Speed)

**What to formalize:** Cycle time optimization, speculative pipelining, caching strategies, and the speed-quality Pareto frontier.

**Right formalism:** Queueing theory + stochastic scheduling. Key quantities:
- $\tau(m)$: expected cycle time for mode $m$ (Fast/Standard/Governed)
- $\text{VIH}(m)$: verified iterations per hour (the correct speed metric, not raw speed)
- $W(s)$: wasted work from speculative execution with success probability $s$

**What main.tex missed entirely:** The paper has no concept of time. A harness that takes 45 minutes per cycle and one that takes 5 minutes per cycle may have identical abstraction gaps, but the latter enables 9x more iterations, which compounds into dramatically better outcomes. Time is not a secondary concern; it is a primary design parameter.

**Contrarian research needed:**
- **"Speed kills quality"**: Perhaps the 45-60 min cycle is not a bug but a feature. The "protective pause" between writing and shipping (mentioned in the slop taxonomy) may be doing quality work that fast cycles eliminate. Research: does cycle time reduction correlate with slop increase? Is there a minimum cycle time below which quality degrades?
- **"Caching creates stale context"**: Incremental context (don't re-read the codebase) saves time but risks acting on stale information. GSD's "Fresh Eyes" pattern pays the full re-read cost every time but avoids stale state. Research: what is the codebase change rate between tasks, and how often does stale cached context cause errors?
- **"Speculative execution has hidden costs"**: Beyond wasted tokens, speculative execution creates branching state that is harder to reason about and debug. The complexity cost of speculation may exceed the time savings. Research: in what task categories does speculation have positive expected value?

---

### Pillar 5: Quality Architecture (Anti-Slop)

**What to formalize:** The 18 slop types as a classification problem, layered defense optimization, the structural-vs-prompt enforcement boundary, and the economics of quality investment.

**Right formalism:** Decision theory + mechanism design. Key quantities:
- $d_{\ell,j}$: detection probability of layer $\ell$ for slop type $j$
- $D_j$: downstream cost of undetected slop type $j$
- $c_\ell$: cost of applying layer $\ell$
- $\text{ROI}(\ell, j) = d_{\ell,j} \cdot D_j / c_\ell$: return on investment per quality layer per slop type

**What main.tex missed entirely:** The paper's "continuous verification" principle is a single sentence. The real problem is WHAT to verify, HOW aggressively, and WITH WHAT tools, given that the 18 slop types have radically different detection profiles and downstream costs.

**Contrarian research needed:**
- **"Slop is acceptable"**: Not all code needs to be high-quality. For prototypes, internal tools, and throwaway scripts, slop is the economically rational choice. The framework should not assume quality maximization; it should support quality targeting. Research: what is the right quality level for different code categories, and how should the harness adjust?
- **"Prompt-based rules DO work (with the right framing)"**: Turing's position ("every prompt-based rule gets worked around") may be overstated. AgentSpec (ICSE 2026) found 77% improvement from prompt-based guardrails, vs. 87% for code-based. The gap is 10 points, not infinite. For subjective quality dimensions (naming, abstraction level, architectural coherence), prompt-based rules may be the ONLY option. Research: for which quality dimensions is prompt-based enforcement "good enough"?
- **"LLM-as-Judge is unreliable"**: Using one LLM to judge another's output introduces correlated errors (they share training data, biases, blind spots). The judge may systematically miss the same defects the producer introduces. Research: measure the correlation between producer and judge errors. Are independent models (e.g., Claude judging GPT) less correlated than same-model judgments?
- **"The 18 types are not the right taxonomy"**: The slop taxonomy was derived empirically, not formally. Perhaps there are deeper structural categories (information deficit, prior mismatch, context blindness, optimization failure) that subsume the 18 types and enable more principled detection. Research: perform a factor analysis on slop incidents to discover latent categories.

---

### Pillar 6: Governance Architecture

**What to formalize:** Architectural drift as a stochastic process, decision debt as a survival problem, the theory-practice gap (Naur), and the decision velocity problem.

**Right formalism:** Control theory + survival analysis. Key quantities:
- $v_t$: violation count at time $t$ (for drift detection)
- $\lambda$: decision decay rate (for evidence expiry; Blueprint data: half-life ~5.3 months)
- $\text{TCR}(t)$: theory capture rate (fraction of decisions extractable from logs)

**What main.tex touched superficially:** Design Principle 6 ("Preserve the Theory") cites Naur but reduces his radical position to "save more metadata." The paper's own philosopher reviewer called this "a misreading."

**Contrarian research needed:**
- **"Governance is overhead that slows development"**: Every governance check (ADR review, drift detection, compliance audit) adds time and cognitive load. For small teams and early-stage projects, governance may cost more than the architectural drift it prevents. Research: at what team size and codebase scale does governance have positive ROI?
- **"ADRs are documentation theater"**: Most ADRs are written once and never revisited (this is precisely the problem Blueprint's evidence expiry addresses). But does continuous governance ACTUALLY prevent drift, or does it just produce more documents? Research: compare drift rates in codebases with and without continuous governance.
- **"Naur is right and the problem is unsolvable"**: If the theory truly cannot be externalized, then THEORY.md is a lossy compression that creates a false sense of understanding. Acting on extracted "decisions" and "assumptions" may be worse than having no documentation at all (because it introduces confidently wrong beliefs). Research: measure the fidelity of automated theory extraction against ground-truth developer interviews.
- **"Conway's Law makes governance futile"**: If architecture mirrors organizational structure (and Blueprint's Conway's Law analyzer confirms this), then architectural governance without organizational governance is treating the symptom, not the cause. Research: does architectural drift correlate more strongly with team structure changes or with codebase changes?

---

## How to Move Forward

### Phase 1: Empirical Foundation (collect the data)

The biggest weakness of main.tex is that it builds theory without data. A rigorous formal theory needs empirical calibration. Priority data collection:

1. **Per-step error rates** across the pipeline (are they uniform or front-loaded?)
2. **Context relevance curves** (how does $I(C; P)$ change with context size and composition?)
3. **Circular validation bias $\beta$** (controlled experiment: same vs. different agent for code and tests)
4. **Coupling graph dynamics** (how fast does $\rho(G)$ change across commits?)
5. **Decision decay rates $\lambda$** by technology domain
6. **Slop detection rates $d_{\ell,j}$** per layer per type (currently estimated, not measured)

### Phase 2: Pillar Papers (one per dimension)

Rather than one monolithic paper, publish six focused papers, each with its own formalism, empirical calibration, and contrarian engagement:

| Paper | Title Sketch | Formalism | Key Result Target |
|-------|-------------|-----------|-------------------|
| P1 | "The Information Architecture of Coding Agent Harnesses" | Shannon IT | Optimal context budget theorem; context degradation function |
| P2 | "Compound Errors and Verification Architecture" | Reliability theory | Optimal verification cadence; circular validation bias measurement |
| P3 | "Safe Parallelism via Isolation and Contracts" | Graph theory | Decomposition algorithm; conflict probability model |
| P4 | "The Speed-Quality Pareto Frontier" | Queueing theory | Verified iterations per hour as the correct metric; speculative scheduling |
| P5 | "Layered Defense Against Code Slop" | Decision theory | Detection-cost matrix; optimal layer assignment per defect type |
| P6 | "Architectural Governance Under Decision Velocity" | Control theory | Drift detection with false-positive guarantees; evidence expiry model |

### Phase 3: Integration Paper (the unified theory)

Once the pillars are individually established, write the integration paper showing:
- How the six dimensions interact (e.g., faster cycles enable more verification iterations, which compensates for lower per-step quality)
- The global optimization problem: choose harness configuration $(C, V, t, m, \Lambda, G)$ (context, verification, topology, mode, quality layers, governance) to maximize an objective that balances all six dimensions
- The Pareto frontier: which tradeoffs are fundamental (you cannot have maximum speed AND maximum quality AND maximum parallelism) and which are resolvable through better design

### Phase 4: Contrarian Stress-Test

For each pillar, commission adversarial reviews from the perspective that most challenges it:

| Pillar | Strongest Contrarian | Their Core Objection |
|--------|---------------------|---------------------|
| P1 (Information) | Practitioner | "Context is overrated; the model's prior does the work" |
| P2 (Reliability) | Speed advocate | "Over-verification kills iteration speed" |
| P3 (Coordination) | Simplicity advocate | "Sequential with fast cycles beats parallel with merge overhead" |
| P4 (Speed) | Quality advocate | "The protective pause is doing quality work; speed kills quality" |
| P5 (Quality) | Pragmatist | "Slop is acceptable for most code; quality targeting, not maximization" |
| P6 (Governance) | Startup engineer | "Governance is overhead; move fast and fix things later" |

Each contrarian objection should be taken seriously enough to define the BOUNDARY CONDITIONS where the pillar's formalism breaks down. Good theory says not just "this is optimal" but "this is optimal WHEN X; when not-X, do something else."

---

## The Meta-Contrarian: "Formalism Itself Is the Wrong Approach"

The deepest objection is not to any individual pillar but to the entire enterprise of formalizing harness design. This objection has three variants:

**Variant 1: "Harness engineering is craft, not science."** Like cooking or carpentry, the knowledge is tacit, embodied, and learned through practice. Formalizing it strips the judgment that makes it work. (This is Naur's position applied to harness design itself, not just to programming.)

**Response needed:** Show that formalism produces at least one non-obvious, empirically validated prediction that craft knowledge alone would not have generated. The testable prediction in the paper (sigmoidal decline in pass rates as NCD increases) is a start; the verification cadence theorem and the task decomposition algorithm would be stronger.

**Variant 2: "The design space changes too fast."** By the time you formalize the 2026 harness landscape, the 2027 landscape will be different (new models, new capabilities, new failure modes). Formalism captures a snapshot; the field needs adaptive heuristics.

**Response needed:** Show that the formal results are invariant to model capabilities (e.g., the compound error theorem holds regardless of per-step accuracy; the decomposition algorithm works regardless of which model fills the executor role). The formalism should capture structural properties of the problem, not contingent properties of current models.

**Variant 3: "The Bitter Lesson, extended."** Sutton's argument applied to harness design: general methods that scale (bigger models, more compute, more data) will outperform engineered harnesses. The optimal harness is no harness; just give the model more context and let it figure it out.

**Response needed:** Terminal Bench 2.0 already refutes this for current models (same model, #33 vs. #5 depending on harness). But the argument predicts that future models will close this gap. The formal theory should identify which harness features become unnecessary as model capability increases (probably: context management, as windows grow) and which remain necessary regardless (probably: verification, because Goodhart's Law is model-independent).

---

## Recommended Next Step

Don't write the integration paper yet. Start with **Pillar 2 (Reliability)** because:
1. It has the most direct practical impact (compound errors are the #1 quality driver)
2. The mathematics is well-established (reliability theory is a mature field)
3. The data is collectible (run the same tasks with different verification schedules and measure outcomes)
4. The key result (optimal verification cadence theorem) would be the first non-obvious, falsifiable prediction from harness design theory
5. It directly addresses the harness engineer's challenge: "name one design decision the framework would change"

The verification cadence theorem would say: "Given per-step accuracy $p$ and verification cost $c_v$, the optimal number of verification points in an $n$-step pipeline is $k^* = f(p, c_v, n)$, which for typical values ($p = 0.85$, $c_v = 0.1n$) gives $k^* = 3$, meaning verify at phase boundaries, not at every step." This is a concrete, testable, non-obvious prediction that would change how harnesses are designed.
