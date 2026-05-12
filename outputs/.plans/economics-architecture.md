# Research Plan: Economics Architecture for AI Coding Agent Harnesses

## Topic

Cost-quality-speed tradeoffs in AI coding agent harness operation. How to allocate finite financial resources across context, computation, verification, and governance to maximize verified output per dollar. Economics as the meta-constraint binding all other architectural pillars.

## Key Research Questions

1. **Portfolio optimization for token budgets**: What mathematical frameworks (Markowitz mean-variance, Kelly criterion, convex optimization) best model the allocation of a fixed token budget across pipeline stages with multiplicative quality returns and additive costs?

2. **Model tier selection under capability constraints**: How does the stochastic knapsack / heterogeneous assignment formulation apply to routing pipeline stages to different model tiers? What empirical evidence exists for capability-cost tradeoff curves across model tiers?

3. **Value of Information in context acquisition**: When is acquiring additional context (at token cost) NPV-positive? How does Howard's Value of Information theory formalize the decision to spend tokens on research vs. proceeding with partial information?

4. **Caching economics and non-linear cost structures**: What are the formal properties of KV-cache, prompt caching, and agentic plan caching? How do cache hit rates transform the cost optimization landscape (convexifying or non-convexifying)?

5. **Developer time vs. token cost regimes**: Under what conditions does developer idle time dominate token cost, and vice versa? How does queueing theory (Kleinrock, Erlang) formalize the latency-cost tradeoff when a developer is blocked waiting for agent output?

6. **Cost-quality Pareto frontiers**: What is the formal structure of the cost-quality Pareto frontier for agent pipelines? Can we prove properties (convexity, continuity, monotonicity) of this frontier under reasonable assumptions about stage quality functions?

7. **Jevons paradox in LLM economics**: Does empirical evidence support the claim that falling token prices lead to proportionally greater usage increases, keeping total spend constant or growing? What are the implications for harness design?

8. **Marginal analysis and the weakest-link principle**: Given multiplicative quality and additive cost, can we formally derive that the optimal allocation always invests the marginal dollar in the lowest-quality stage? What are the conditions under which this breaks down?

## Major Thinkers and Works

### Economics / Optimization
- **Markowitz (1952)**: Portfolio Selection; mean-variance optimization framework
- **Kelly (1956)**: Kelly criterion for optimal bet sizing under uncertainty
- **Dantzig (1957)**: Linear programming, knapsack problems
- **Boyd & Vandenberghe (2004)**: Convex Optimization (canonical reference for constrained optimization)

### Information Economics
- **Howard (1966)**: Information Value Theory; expected value of perfect/imperfect information
- **Stigler (1961)**: Economics of information search
- **Blackwell (1953)**: Comparison of experiments; when is one information source more valuable than another?

### Queueing Theory / Service Economics
- **Kleinrock (1975-1976)**: Queueing Systems, Vols. 1-2; cost of delay models
- **Erlang (1909)**: Queueing models for service systems
- **Kingman (1961)**: Heavy-traffic approximations for waiting times

### LLM Cost Engineering (Contemporary)
- **Anthropic (2025-2026)**: KV-cache statistics, agentic coding best practices
- **Liang et al. (2026)**: Prompt caching survey (arXiv:2601.06007)
- **Zhang et al. (2025)**: Agentic Plan Caching (arXiv:2506.14852)
- **JetBrains (2025)**: SWE-bench agent complexity analysis; observation masking
- **Chen et al. (2023-2025)**: FrugalGPT, model cascading/routing literature
- **Madaan et al. (2024)**: AutoMix; automatic model routing

### Submodularity and Diminishing Returns
- **Nemhauser, Wolsey, Fisher (1978)**: Submodular function maximization (greedy approximation)
- **Krause & Golovin (2014)**: Submodularity in machine learning survey

### Jevons Paradox / Rebound Effects
- **Jevons (1865)**: The Coal Question
- **Sorrell (2009)**: Jevons paradox revisited; rebound effects in energy economics
- **Khazzoom-Brookes postulate**: efficiency gains increase demand

## Agent Strategy (5 Parallel Researchers)

### Agent R1: Historical/Foundational Economics
**Dimension**: Classical optimization, portfolio theory, and information economics foundations
**Scope**: Markowitz portfolio theory, Kelly criterion, Howard's Value of Information, Stigler's search theory, Blackwell's comparison of experiments. How these formal frameworks apply to the token budget allocation problem. Historical evolution of resource allocation under uncertainty.

### Agent R2: LLM Cost Engineering (Empirical/Contemporary)
**Dimension**: Current state of LLM pricing, caching, and cost optimization
**Scope**: Token pricing across providers (Anthropic, OpenAI, Google), caching mechanisms (KV-cache, prompt caching, plan caching), model routing/cascading approaches (FrugalGPT, AutoMix, RouteLLM), empirical cost-quality curves. Real-world cost data from production harness deployments.

### Agent R3: Queueing Theory and Service Economics
**Dimension**: Waiting costs, latency-cost tradeoffs, developer productivity economics
**Scope**: Kleinrock's queueing economics, M/M/1 and M/G/1 cost models, developer time valuation, the economics of blocking vs. non-blocking agent execution, CI/CD pipeline cost modeling, batching and scheduling economics.

### Agent R4: Submodularity, Diminishing Returns, and Optimization Theory
**Dimension**: Mathematical structure of the cost-quality optimization problem
**Scope**: Submodular function maximization under knapsack constraints, the greedy algorithm and its approximation guarantees, concave quality functions and their implications for marginal analysis, Pareto frontier properties, the multiplicative-quality / additive-cost optimization structure.

### Agent R5: Contrarian / Jevons Paradox / Behavioral Economics
**Dimension**: Counterarguments, rebound effects, and behavioral factors
**Scope**: Jevons paradox in computing (Wirth's law, rebound effects in cloud computing), behavioral economics of cost optimization (prospect theory, mental accounting for token budgets), arguments against cost optimization (premature optimization, falling prices thesis), evidence for and against model routing complexity.

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources
- Contradictions between sources identified and documented
- At least 3 formal theorems/results identified for the formalization stage
- Empirical data on token pricing, caching hit rates, and model capability curves collected
- At least 2 contrarian positions steelmanned with evidence
