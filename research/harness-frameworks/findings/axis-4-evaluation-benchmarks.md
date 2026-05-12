# Axis 4: Evaluation Methodologies and Benchmarks

## Question
What evaluation methodologies, benchmarks, and metrics exist (or could be developed) to measure the effectiveness of coding agent harnesses across the full software development lifecycle — beyond just code generation correctness?

## Findings

### Benchmark Comparison Table

| Benchmark | Year | Scope | Primary Metric | SDLC Stages Covered | Agent-Agnostic? | Key Limitation |
|-----------|------|-------|----------------|---------------------|-----------------|----------------|
| **SWE-bench / Verified** | 2023-24 | Single GitHub issue resolution | Pass rate (tests pass) | Execution only | Yes | ~75% saturation on Verified subset [SWE-bench](https://www.swebench.com/SWE-bench/) |
| **SWE-bench Pro** | 2025 | Enterprise long-horizon tasks | Pass@1 across 1,865 problems | Execution | Yes | Best models <25%; no planning eval [SWE-Bench Pro](https://arxiv.org/abs/2509.16941) |
| **SWE-EVO** | 2025-26 | Multi-commit software evolution | Resolution rate + Fix Rate | Requirements, Planning, Execution | Yes | Only 48 tasks; Python-only [SWE-EVO](https://arxiv.org/abs/2512.18470) |
| **FeatureBench** | 2025-26 | Feature-level development | Test-driven pass rate | Planning, Execution | Yes | SOTA only 11%; 200 instances [FeatureBench](https://arxiv.org/abs/2602.10975) |
| **DPAI Arena** | 2025 | Multi-workflow developer tasks | Task completion + quality | Execution, Verification, Review | Yes | Still maturing [DPAI Arena](https://blog.jetbrains.com/blog/2025/10/28/introducing-developer-productivity-ai-arena-an-open-platform-for-ai-coding-agents-benchmarks/) |
| **SWT-Bench** | 2024 | Test generation, repair, coverage | Test gen/repair/coverage | Verification only | Yes | Narrow focus [Tessl](https://tessl.io/blog/8-benchmarks-shaping-the-next-generation-of-ai-agents) |
| **Terminal-Bench** | 2025 | CLI competence | Reliability across shell tasks | Execution | Yes | CLI-only [Tessl](https://tessl.io/blog/8-benchmarks-shaping-the-next-generation-of-ai-agents) |
| **tau-Bench** | 2024 | Long-horizon conversational workflows | Pass^k (reliability over trials) | Execution, Policy adherence | Yes | Domain-specific [Tessl](https://tessl.io/blog/8-benchmarks-shaping-the-next-generation-of-ai-agents) |
| **DevAI** | 2024-25 | AI development tasks | Independent + Dependency-Aware | Requirements, Execution | Yes | 55 tasks; AI-specific [Agent-as-a-Judge](https://arxiv.org/html/2410.10934v2) |
| **SPICE-Bench** | 2025 | SWE-bench quality labeling | ICA accuracy (87.3%), TCA (68.5%) | Meta-evaluation | Yes | Labels benchmarks, not agents [SPICE](https://arxiv.org/abs/2507.09108) |

### Coverage by Workflow Stage

| Stage | Coverage | Assessment |
|---|---|---|
| **Requirements Generation** | Almost none. DevAI has hierarchical requirements for eval, but no benchmark evaluates requirement *generation*. | **Critical gap** |
| **Roadmap/Plan Generation** | Minimal. Node F1 and Edge F1 for tool sequence planning exist [LLM Agent Eval Survey](https://arxiv.org/html/2507.21504v1). No benchmark scores plan quality. | **Critical gap** |
| **Human-AI Discussion** | None. tau-Bench evaluates conversational policy adherence, not collaborative planning. | **Critical gap** |
| **Phase Planning** | Weak. PlanQualityMetric from DeepEval evaluates plan logic/completeness [DeepEval](https://deepeval.com/guides/guides-ai-agent-evaluation). Not in major benchmarks. | **Significant gap** |
| **Phase Execution** | Strong. SWE-bench, FeatureBench, SWE-bench Pro, DPAI Arena, Terminal-Bench. | Well-covered |
| **Phase Verification** | Moderate. SWT-Bench covers test gen/repair. DPAI Arena includes review. Agent-as-a-Judge evaluates steps [Agent-as-a-Judge](https://arxiv.org/abs/2410.10934). | Partially covered |

### Evaluation Methodology Patterns

**Three-Tier Grader Architecture (Anthropic)**: Code-based graders (unit tests, static analysis), Model-based graders (LLM rubrics), Human graders (transcript review). [Anthropic Evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) **Confidence: High**

**Agent-as-a-Judge**: Uses agentic evaluator systems to assess full trajectories. ~90% agreement with humans vs. ~70% for LLM-as-a-Judge. Reduces cost by ~97% ($1,297 to $31 for 55 tasks). Notable: planning modules in the judge were *counterproductive*. [Agent-as-a-Judge](https://arxiv.org/abs/2410.10934) **Confidence: High** (ICML 2025)

**Trajectory-Based Evaluation (Google Cloud)**: trajectory_exact_match, trajectory_precision. Detects silent failures where correct outputs mask flawed reasoning. [Google Cloud Agent Eval](https://cloud.google.com/blog/topics/developers-practitioners/a-methodical-approach-to-agent-evaluation) **Confidence: High**

**LLM-as-a-Judge for SE**: 26 publications by Aug 2025 [LLM-as-a-Judge for SE](https://arxiv.org/pdf/2510.24367). 80% agreement with human preferences at 500x-5,000x lower cost. 53.3% of teams with deployed AI agents use this pattern. Known weakness: hallucinated confidence in specialized domains.

### Proposed Metrics for Under-Evaluated Stages

**Requirements Generation**: Completeness Score, Ambiguity Index, Consistency Score, Traceability Coverage. Field "lacks methodological standardization." [Quality Assessment of Software Requirements Using AI](https://www.sciencedirect.com/science/article/pii/S0950584925003180) **Confidence: Medium**

**Plan/Roadmap Quality**: PlanQualityMetric, Node F1, Edge F1, Progress Rate, Step Success Rate, Normalized Edit Distance. [LLM Agent Eval Survey](https://arxiv.org/html/2507.21504v1); [DeepEval](https://deepeval.com/guides/guides-ai-agent-evaluation) **Confidence: Medium**

**Verification Completeness**: Test Coverage Delta (SWT-Bench), Defect Discovery Rate, Fix Rate (SWE-EVO), Escape Rate, Dependency-Aware Performance (DevAI: drops from 44.8% to 29.0%). **Confidence: Medium-High**

### Benchmark Contamination Concerns

SPICE found 32.67% of SWE-bench successes were due to solution leakage and 31.08% to weak test suites [SPICE](https://arxiv.org/abs/2507.09108). Mutation approaches show models overestimated by >50% on public benchmarks [Saving SWE-Bench](https://arxiv.org/abs/2510.08996).

### Evaluation Methodology Recommendations

1. **Multi-layer grading**: Combine deterministic tests, LLM-as-Judge, and Agent-as-a-Judge
2. **Evaluate trajectories, not just outcomes**: Detect silent failures
3. **Hierarchical requirement DAGs**: DevAI's approach enables nuanced, non-binary evaluation
4. **Benchmark across complexity tiers**: SWE-bench Verified (75% SOTA) to FeatureBench (11% SOTA)
5. **Contamination controls**: SPICE + mutation-based approaches
6. **Stage-specific evals**: Purpose-built for requirements, roadmap, and discussion stages
7. **Track cost-efficiency**: Token consumption, latency, API cost per successful task

### Conflicting Information

- **SWE-bench saturation**: ~75% reported, but SPICE suggests actual performance significantly lower due to leakage.
- **Planning modules**: Agent-as-a-Judge found planning *counterproductive* in judges, while Anthropic relies heavily on upfront planning for execution. Different contexts (evaluation vs. task execution).

### Key Unknowns

1. No benchmark for evaluating requirements generation quality in coding agent contexts
2. No benchmark for roadmap/plan generation quality as standalone artifacts
3. No benchmark for human-AI collaborative discussion
4. Harness-level evaluation (independent of model) is undefined
5. Cross-stage coherence metrics are absent
6. Long-term codebase impact (tech debt, maintainability) unmeasured
7. Contamination correction factors not standardized
8. Whether multi-agent outperforms single-agent across SDLC stages remains open

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 19
