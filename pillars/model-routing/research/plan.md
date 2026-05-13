# Research Plan: Model Routing Architecture for AI Coding Agent Harnesses

## Topic

How should an AI coding agent harness select, configure, and compose multiple AI models across pipeline stages to optimize cost-quality-latency tradeoffs? This paper formalizes model routing as a combinatorial optimization problem, establishes theoretical bounds on routing effectiveness, and connects adaptive escalation policies to online learning theory.

## Key Research Questions

1. **Optimal heterogeneous assignment:** What are the computational complexity and approximation guarantees for assigning models to pipeline stages under multiplicative quality, additive cost, and bottleneck latency constraints?

2. **Cross-model diversity for verification:** How does the FKG inequality and copula-based correlation modeling formalize the advantage of cross-family verification? What are the empirical estimates of blind-spot correlation ($\rho$) across model families?

3. **Pass@K vs. Pass^K crossover:** For what pipeline lengths does a single expensive-model attempt dominate K cheap-model attempts? How does this crossover interact with error correlation and stage dependency structure?

4. **Adaptive escalation policies:** How should a harness decide when to escalate from a cheaper model to a more expensive one mid-task? What are the regret bounds for bandit-based escalation policies?

5. **Cache economics of model switching:** What are the costs of invalidating KV-cache when switching models mid-conversation, and how does this affect optimal routing frequency?

6. **Temperature-diversity interaction:** How does temperature scaling interact with model capability in best-of-N sampling? Is there a formal relationship between temperature, per-sample quality, and ensemble diversity?

7. **Cascade classifier analogy:** To what extent does the Viola-Jones cascade paradigm (cheap rejection followed by expensive classification) apply to model routing in coding pipelines?

8. **Empirical routing gains:** What cost savings and quality impacts have been observed in production systems that implement even crude model routing (e.g., Cursor's autocomplete/agent split)?

## Major Thinkers and Works

### Assignment and Optimization
- **Kuhn (1955), Munkres (1957):** Hungarian algorithm for optimal assignment
- **Papadimitriou & Steiglitz (1982):** Combinatorial optimization complexity
- **Korte & Vygen (2018):** Combinatorial optimization (modern treatment)

### Copula Theory and Dependence Modeling
- **Sklar (1959):** Foundational theorem on copulas
- **Nelsen (2006):** Introduction to Copulas (standard reference)
- **Joe (2014):** Dependence Modeling with Copulas

### Best-of-N and Sampling
- **Stiennon et al. (2020):** Learning to summarize from human feedback (best-of-N)
- **Cobbe et al. (2021):** Training verifiers to solve math word problems (best-of-N in reasoning)
- **Nakano et al. (2021):** WebGPT: Browser-assisted QA with human feedback
- **Anthropic (2025-2026):** Pass@K vs. Pass^K evaluation methodology

### Online Learning and Bandits
- **Auer et al. (2002):** Finite-time analysis of the multi-armed bandit problem (UCB)
- **Lattimore & Szepesvari (2020):** Bandit Algorithms (comprehensive reference)
- **Slivkins (2019):** Introduction to multi-armed bandits

### Cascade and Sequential Models
- **Viola & Jones (2001/2004):** Rapid object detection using boosted cascade
- **Saberian & Vasconcelos (2014):** Boosted cascade detection
- **Wang et al. (2018):** SkipNet: Learning dynamic routing in ConNets

### Model Routing and Mixture of Experts
- **Shazeer et al. (2017):** Outrageously large neural networks (MoE)
- **Fedus et al. (2022):** Switch Transformers
- **Jiang et al. (2024):** LLM routing / model selection
- **Kim et al. (2025):** Scaling laws for multi-agent systems

### Verification and Multi-Agent
- **Lifshitz et al. (2025):** Multi-agent verification
- **Zhu et al. (2024):** ConGra: context-grounded conflict resolution
- **FKG inequality:** Fortuin, Kasteleyn, Ginibre (1971), correlation inequalities

## Parallel Research Agent Strategy

### Agent R1: Historical and Theoretical Foundations
- Origins of assignment problems (Kuhn-Munkres)
- Cascade classifier theory (Viola-Jones and extensions)
- FKG inequality: original formulation and applications outside statistical mechanics
- Copula theory foundations (Sklar's theorem, Gaussian copula properties)
- How these classical results apply to the model routing setting

### Agent R2: Empirical LLM Routing and Benchmarks
- Current LLM benchmark data (HumanEval, SWE-bench, LiveCodeBench) across model tiers
- Production routing implementations (Cursor, Codex, Claude Code model selection)
- Best-of-N empirical results from Anthropic, OpenAI, Google
- Cost/latency/quality tradeoff data from API pricing as of 2025-2026
- Temperature effects on sampling diversity and quality

### Agent R3: Contrarian and Alternative Perspectives
- Arguments against model routing (simplicity, debugging complexity, provider lock-in)
- Jevons paradox in compute economics
- Arguments that frontier models will commoditize routing
- Naur's theory building: does model switching break "theory"?
- The case for single-model simplicity from practitioner experience

### Agent R4: Online Learning and Adaptive Systems
- Bandit algorithms for adaptive model selection (UCB, Thompson Sampling)
- Contextual bandits for task-aware routing
- Regret bounds for model escalation policies
- Cache-aware switching costs in online optimization
- Connections to dynamic pricing and resource allocation

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources
- Contradictions between sources explicitly identified
- At least 30 distinct references across all agents
- Formal results (theorems, bounds) from the literature identified and contextualized
- Empirical data points for model performance across tiers collected
- At least 3 well-developed contrarian positions with steelmanned arguments
