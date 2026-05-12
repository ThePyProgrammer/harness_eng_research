# Research Plan: Temporal Architecture of AI Coding Agent Harnesses

## Topic

Formal theory of iteration speed, cycle time optimization, speculative pipelining, caching strategies, and the speed-quality Pareto frontier in AI-assisted software engineering workflows. The central claim: the correct optimization target is *verified iterations per hour* (VIH), not raw throughput or latency, and this reframing has deep implications for pipeline design, caching policy, and execution mode selection.

## Research Questions

1. **What formal scheduling models apply to multi-stage AI coding pipelines with stochastic failure and speculative execution?** (Stochastic DAG scheduling, speculative execution theory from processor architecture, job-shop scheduling with preemption.)

2. **What is the empirical relationship between iteration speed and output quality in AI-assisted coding?** (Do faster cycles increase or decrease defect rates? Is there a minimum viable cycle time below which quality degrades? What does the speed-quality Pareto frontier look like?)

3. **How do caching strategies (prompt caching, KV-cache, plan caching, context caching) interact, and what are the formal tradeoffs between staleness and computation savings?** (Cache invalidation as a formal problem; staleness-error coupling.)

4. **What does queueing theory tell us about pipeline bottleneck identification and mitigation in sequential-parallel hybrid workflows?** (Little's Law, bottleneck analysis, theory of constraints applied to AI agent pipelines.)

5. **Under what conditions does speculative execution have positive expected value, and what are the hidden costs (state complexity, debugging difficulty, rollback overhead)?** (Speculative execution from CPU architecture transplanted to agent workflows; Tomasulo's algorithm analogy.)

6. **How should execution mode selection (Fast/Standard/Governed) be formalized, and what classification features predict the correct mode?** (Decision-theoretic mode selection; cost of misclassification in both directions.)

7. **What is the role of "fresh context" vs. incremental context in agent accuracy, and how does this interact with caching?** (Fresh Eyes effect; context accumulation as noise; information-theoretic capacity of the context window.)

8. **How do existing harnesses (GSD, RAPID, Turing, Blueprint) empirically compare on VIH, and what architectural patterns explain the differences?**

## Major Thinkers and Works

- **Stochastic scheduling:** Pinedo (Scheduling: Theory, Algorithms, and Systems), Mohring (stochastic DAG scheduling), Graham (list scheduling bounds)
- **Queueing theory:** Little (Little's Law), Kingman (GI/G/1 approximation), Hopp & Spearman (Factory Physics)
- **Speculative execution:** Tomasulo (1967), Hennessy & Patterson (Computer Architecture), Burton Smith (speculative parallelism)
- **Cache theory:** Belady (optimal replacement), Sleator & Tarjan (competitive analysis of caching), Denning (working set model)
- **AI agent efficiency:** Speculative Actions (arXiv:2510.04371), Agentic Plan Caching (arXiv:2506.14852), Prompt Caching (arXiv:2601.06007), Sherlock (arXiv:2511.00330)
- **Speed-quality tradeoffs:** Kahneman (thinking fast and slow), Fitts's Law (speed-accuracy tradeoff), cognitive load theory (Sweller)
- **Theory of Constraints:** Goldratt (The Goal), applied to software delivery by Forsgren et al. (Accelerate)

## Researcher Agent Strategy

### Agent R1: Historical and Theoretical Foundations
- Stochastic scheduling theory (Pinedo, Mohring, Graham bounds)
- Queueing theory foundations (Little's Law, bottleneck analysis, Kingman)
- Speculative execution history (Tomasulo, branch prediction, speculative parallelism)
- Cache theory (Belady, competitive analysis, working set)

### Agent R2: Empirical AI Agent Performance
- Cycle time breakdowns for existing harnesses (GSD, RAPID, Cursor, Windsurf, Devin)
- Speed-quality tradeoff data from SWE-bench, Epoch AI, Iskohm comparisons
- Prompt caching and KV-cache empirical results
- Fresh Eyes effect and context accumulation studies

### Agent R3: Contrarian and Alternative Perspectives
- "Speed kills quality" argument (protective pauses, Kahneman System 2)
- Hidden costs of speculative execution (state complexity, debugging)
- Arguments against caching (staleness, coherence bugs, false economy)
- Mode selection difficulty (automation boundaries, Ironies of Automation)

### Agent R4: Formal Methods and Optimization
- Stochastic DAG scheduling with speculative rollback (formal model)
- Cache invalidation as online optimization (competitive ratios)
- Decision-theoretic mode selection (Bayesian classification, cost-sensitive)
- VIH as a composite metric (formal definition, relationship to throughput and quality)

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources each
- Contradictions between sources explicitly identified
- At least 3 formal results (theorems, bounds, or established formulas) applicable to the pipeline scheduling problem
- Empirical data on at least 2 real AI coding agent systems
- At least 2 contrarian arguments with supporting evidence
