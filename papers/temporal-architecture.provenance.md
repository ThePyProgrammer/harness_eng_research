# Provenance: Temporal Architecture of AI Coding Agent Harnesses

## Date
2026-04-03

## Research Rounds
- **Stage 2 (Deep Research):** 4 parallel agents
  - R1: Historical/theoretical foundations (scheduling, queueing, speculative execution, cache theory)
  - R2: Empirical AI agent performance (cycle times, benchmarks, caching data, fresh eyes, speculation)
  - R3: Contrarian perspectives (speed kills quality, fresh eyes worth cost, speculation hidden costs, mode selection hard, caching false economy)
  - R4: Formal methods and optimization (stochastic DAGs, cache as online optimization, mode selection, VIH, Pareto frontier)

- **Stage 3 (Formalization Research):** 2 parallel agents
  - F1: Information-theoretic foundations (context fidelity, VIH decomposition, pipeline model, cache-staleness theorem, mode selection as hypothesis testing)
  - F2: Metrics and verification (Pareto frontier, pipeline calibration, token economics, convergence, experimental verification)

## Sources Consulted
~50+ primary sources across scheduling theory, queueing theory, speculative execution, cache theory, AI agent benchmarks, cognitive science, and software engineering.

Key primary sources:
- Graham (1966, 1969): List scheduling bounds
- Mohring et al. (1984): Stochastic DAG scheduling
- Little (1961): L = lambda W
- Kingman (1961): GI/G/1 approximation
- Tomasulo (1967): Out-of-order execution
- Belady (1966): Optimal replacement
- Sleator & Tarjan (1985): Competitive analysis of caching
- Suzgun & Kalai (2024): Meta-prompting / Fresh Eyes
- Liang et al. (2026): Prompt caching evaluation
- Zhang et al. (2025): Agentic Plan Caching
- Zhou et al. (2025): Speculative Actions
- Bian et al. (2025): Agentic system efficiency limits
- Chroma (2025): Context rot
- Agent Drift (2026): Long-running degradation
- SWE-Effi (2025): Resource-aware effectiveness

## Verification Status
- Formal proofs: Sound given stated assumptions
- Empirical calibration: Illustrative only (multiple systems, no end-to-end validation)
- Peer review: Simulated, 10 MAJOR issues identified and addressed in revision
- Key limitation: 17.1% Fresh Eyes figure conflates task decomposition with context freshness; used as upper bound

## Intermediate Research Files
- `outputs/.plans/temporal-architecture.md` (research plan)
- `outputs/temporal-architecture-research-r1.md` (historical/theoretical)
- `outputs/temporal-architecture-research-r2.md` (empirical data)
- `outputs/temporal-architecture-research-r3.md` (contrarian perspectives)
- `outputs/temporal-architecture-research-r4.md` (formal methods)
- `outputs/temporal-architecture-formal-r1.md` (formalization round 1)
- `outputs/temporal-architecture-formal-r2.md` (formalization round 2)
- `outputs/temporal-architecture-review.md` (peer review)

## Final Deliverables
- `papers/temporal-architecture.pdf` (final compiled paper)
- `papers/temporal-architecture/main.tex` (LaTeX source)
- `papers/temporal-architecture/main.bib` (bibliography)
