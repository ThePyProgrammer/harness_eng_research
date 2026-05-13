# Research Report: AI Harness Frameworks for Metaprompting of Coding Agents

*Generated: 2026-03-16*
*Research scope: Agent-agnostic frameworks with Claude/Anthropic-specific depth, covering the full six-stage SDLC pipeline (requirements, roadmap, discussion, planning, execution, verification). Includes landscape survey, metaprompting patterns, orchestration architectures, evaluation methodologies, and optimization strategies.*

---

## Executive Summary

AI harness frameworks — systems that metaprompt coding agents to serve distinct roles in a software development workflow — have rapidly diversified into at least six distinct architectural patterns, from MetaGPT's role-based assembly lines to GSD's context-window-aware phase isolation. This survey of 13 frameworks, 111 sources, and multiple optimization strategies reveals three critical findings: (1) the field has converged on execution-stage tooling but left requirements generation, roadmap planning, and human-AI discussion stages severely under-instrumented, with no benchmarks for three of six SDLC stages; (2) programmatic prompt optimization frameworks like DSPy and contract-based interfaces like Agent Behavioral Contracts offer the most evidence-backed paths to systematic harness improvement; and (3) cross-model prompt portability remains an unsolved problem, with optimized prompts degrading by up to 31 percentage points when transferred between model families, making truly agent-agnostic harness design a research frontier rather than a solved engineering problem.

---

## Key Findings

1. **Only one surveyed framework covers all six SDLC stages.** GSD is the only framework that explicitly implements requirements, roadmap, discussion, planning, execution, and verification as distinct, instrumented stages. Most frameworks focus exclusively on execution. [GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system)

2. **Structured document communication outperforms dialogue for inter-stage handoffs.** MetaGPT's publish-subscribe message pool with structured artifacts produces measurably better code than ChatDev's freeform dialogue approach, though dialogue enables "communicative dehallucination" that reduces hallucinations by 67% *within* stages. [MetaGPT (ICLR 2024)](https://arxiv.org/html/2308.00352v7); [ChatDev (ACL 2024)](https://arxiv.org/html/2307.07924v5)

3. **DSPy's programmatic optimization demonstrates the strongest evidence for systematic harness improvement**, with improvements of 24%→51% on ReAct agents, 53%→61% on RAG systems, and 66%→87% on classification tasks. [DSPy](https://dspy.ai/)

4. **Agent Behavioral Contracts bound behavioral drift in multi-step workflows**, achieving 88-100% hard constraint compliance across 1,980 sessions and 7 models, with recovery mechanisms transforming exponential compliance decay into linear. [ABC (arXiv)](https://arxiv.org/html/2602.22302)

5. **Current benchmarks cover only 2 of 6 SDLC stages well.** Phase execution is well-benchmarked (SWE-bench, FeatureBench); verification is partially covered (SWT-Bench). Requirements generation, roadmap quality, and human-AI discussion have **zero dedicated benchmarks**. [SWE-bench](https://www.swebench.com/SWE-bench/); [FeatureBench](https://arxiv.org/abs/2602.10975)

6. **SWE-bench results are significantly inflated**: 32.67% of successes attributed to solution leakage and 31.08% to weak test suites, suggesting actual agent capability is substantially lower than reported leaderboard numbers. [SPICE](https://arxiv.org/abs/2507.09108)

7. **Prompt portability across models does not exist in practice.** Prompts optimized for GPT-5 (99.39%) degraded to 68.70% on Llama-3.1-70B. PromptBridge partially addresses this with 27.39% improvement on cross-model transfer, but the field remains early. [PromptBridge (arXiv)](https://arxiv.org/html/2512.01420v1); [Portability of LLM Prompts](https://vivekhaldar.com/articles/portability-of-llm-prompts/)

8. **The "Fresh Eyes" principle in metaprompting outperforms accumulated-context approaches by 17.1%**, demonstrating that isolating each sub-task's context rather than sharing the full conversation history produces better results. [Meta-Prompting (arXiv:2401.12954)](https://arxiv.org/abs/2401.12954)

---

## Detailed Analysis

### 1. The Harness Landscape: Six Architectural Patterns

The survey identified 13 active frameworks orchestrating coding agents across multi-stage workflows. These cluster into six distinct architectural patterns:

**Pattern A: Role-Based Assembly Line.** MetaGPT and ChatDev assign specialized agent roles (Product Manager, Architect, Engineer, QA) to sequential pipeline stages. MetaGPT's key innovation is a publish-subscribe message pool where agents communicate through structured documents rather than freeform dialogue, reducing hallucination cascading [MetaGPT (ICLR 2024)](https://arxiv.org/html/2308.00352v7). ChatDev uses instructor-assistant dialogue pairs at each phase with a "chat chain" mechanism [ChatDev (ACL 2024)](https://arxiv.org/html/2307.07924v5). Both are peer-reviewed and well-validated.

**Pattern B: Context-Window-Aware Phase Isolation.** GSD and Anthropic's recommended harness architecture design each SDLC stage to run in a fresh context window, with state persisting via file-based artifacts (`.planning/` directory, JSON feature lists, Git commits) rather than in-memory conversation [GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system). Anthropic's two-agent harness (Initializer + iterative Coding Agent) recommends structured JSON over markdown because Claude is less likely to inappropriately modify JSON structures [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

**Pattern C: Agent-Computer Interface Simplification.** SWE-agent's ACI provides LLM-optimized commands (view_file, search_dir, edit_file) that constrain the action space, while AutoCodeRover searches through ASTs rather than raw text for semantically meaningful code navigation [SWE-agent (NeurIPS 2024)](https://arxiv.org/abs/2405.15793); [AutoCodeRover](https://aiagentindex.mit.edu/autocoderover/). Both operate as two-stage pipelines (context retrieval → patch generation).

**Pattern D: Orchestrator-Specialist Decomposition.** The Deep Agent Architecture separates concerns with an Orchestrator (cannot modify code), Explorer (read-only), and Coder (implementation), communicating through a shared Context Store [Deep Agent Architecture](https://dev.to/apssouza22/a-deep-dive-into-deep-agent-architecture-for-ai-coding-assistants-3c8b). OpenDev uses five independently configurable model roles with a six-phase ReAct loop [OpenDev (arXiv)](https://arxiv.org/html/2603.05344v1).

**Pattern E: Event-Stream Architecture.** OpenHands models agent-environment interaction as an event stream with deterministic replay, event-sourced state, and hierarchical multi-agent delegation [OpenHands Paper](https://arxiv.org/abs/2407.16741); [OpenHands SDK](https://arxiv.org/html/2511.03690v1).

**Pattern F: Dual-Agent Planning.** IDE-embedded agents (Windsurf Cascade, Cursor) run a planning agent continuously in the background while the action model handles short-term execution [Windsurf Docs](https://docs.windsurf.com/windsurf/cascade/cascade); [Cursor vs Windsurf](https://www.builder.io/blog/windsurf-vs-cursor).

#### Coverage Gap: The Six-Stage Pipeline

A critical finding is the uneven coverage across SDLC stages:

| Stage | Well-Covered By | Gap Assessment |
|-------|----------------|----------------|
| Requirements Generation | GSD, MetaGPT | Most frameworks skip this |
| Roadmap Generation | GSD, MetaGPT | Absent in single-agent tools |
| Human-AI Discussion | GSD, HULA, Aider | Severely under-implemented |
| Phase Planning | GSD, OpenDev, Kilo Code | Partially covered |
| Phase Execution | All 13 frameworks | Well-covered |
| Phase Verification | GSD, Anthropic Harness, Aider | Mostly afterthought |

### 2. Metaprompting: How Prompts That Generate Prompts Differ

Metaprompting — constructing prompts that instruct an LLM to generate or orchestrate sub-prompts — differs from standard prompting along seven critical dimensions:

| Dimension | Standard Prompting | Metaprompting |
|---|---|---|
| Computation unit | Single prompt → single response | Decomposed subtasks → synthesized output |
| Prompt authorship | Human writes manually | LLM generates/refines sub-prompts |
| Error handling | Linear propagation | Checkpoint validation, isolation, recovery |
| Context management | Accumulated (noise risk) | Isolated per expert ("Fresh Eyes") |
| Optimization | Intuition-based | Data-driven (DSPy, TextGrad, PE2) |
| Feedback loops | None (open-loop) | Closed-loop with auditor/evaluator |
| Reproducibility | Low (stochastic) | Higher via deterministic governance |

Sources: [Meta-Prompting Guide](https://createxflow.com/meta-prompting-guide-architecture-implementation/); [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)

The **Conductor-Expert architecture** (Suzgun & Kalai) is the foundational pattern: a single LLM "conductor" decomposes tasks, delegates to freshly instantiated "expert" copies with tailored instructions, then integrates and verifies outputs. The "Fresh Eyes" principle — each expert receives only relevant instructions — outperformed standard prompting by 17.1% and multipersona prompting by 15.2% [Meta-Prompting (arXiv:2401.12954)](https://arxiv.org/abs/2401.12954).

Anthropic's **Orchestrator-Workers pattern** demonstrates the scalability of this approach: Claude Opus 4 as lead with Claude Sonnet 4 subagents outperformed single-agent Opus 4 by 90.2% on internal research evaluations. Key design elements include explicit task boundaries, output format specifications, and tool/source guidance per subagent [Anthropic Multi-Agent Research](https://www.anthropic.com/engineering/multi-agent-research-system).

Anthropic also recommends treating **tool descriptions as prompt engineering** — poor tool descriptions cause agents to pursue wrong trajectories, making tool schema design as critical as system prompt design [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents).

### 3. Pipeline Orchestration: State, Contracts, and Failure Recovery

**State management** is the central design decision in multi-stage harnesses. The dominant recommendation across sources is typed schemas at every stage boundary, replacing natural language ambiguity with machine-checkable contracts [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/). Implementations vary:

- **LangGraph**: Reducer-driven `TypedDict` state with `Annotated` types [LangGraph State](https://sparkco.ai/blog/mastering-langgraph-state-management-in-2025)
- **Google ADK**: Shared `InvocationContext` with `output_key` pattern [Google ADK](https://google.github.io/adk-docs/agents/multi-agents/)
- **CrewAI**: Pydantic-based state with `@persist` decorator for SQLite recovery [CrewAI Flows](https://docs.crewai.com/en/concepts/flows)
- **GSD/Anthropic**: File-based artifacts (JSON feature lists, markdown documents) persisted via Git [Anthropic Harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

**Error recovery** follows a consistent philosophy across frameworks: multi-agent failures stem from structural deficiency, not model limitation [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/). Strategies include fail-fast at boundaries (never propagate bad state), bounded retries (MetaGPT: max 3), conversation termination conditions (ChatDev: 2 unchanged modifications or 10 rounds), and git-based rollback for long-running agents [MetaGPT (ICLR 2024)](https://arxiv.org/html/2308.00352v7); [ChatDev (ACL 2024)](https://arxiv.org/html/2307.07924v5).

**Human-in-the-loop integration** follows three models articulated by Martin Fowler: "Humans Outside" (manage the "why"), "Humans In" (inspect artifacts directly, creates bottlenecks), and "Humans On" (improve agents through harness engineering, recommended) [Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html). Microsoft's AI-led SDLC maintains explicit human approval gates at five pipeline points, noting "just because we could have dynamic decision-making doesn't mean we should" for infrastructure [Microsoft AI-Led SDLC](https://techcommunity.microsoft.com/blog/appsonazureblog/an-ai-led-sdlc-building-an-end-to-end-agentic-software-development-lifecycle-wit/4491896).

**The emerging consensus** is a hybrid approach: static DAG workflows for predictable pipeline stages, with agent-driven branching only where intermediate results genuinely demand adaptive planning [Agents At Work: 2026 Playbook](https://promptengineering.org/agents-at-work-the-2026-playbook-for-building-reliable-agentic-workflows/). MCP (Model Context Protocol) is emerging as the enforcement layer for inter-agent contracts, defining explicit input/output schemas validated before execution [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/).

### 4. The Human-AI Discussion Stage: The Least Instrumented Phase

Follow-up research identified three concrete patterns for the discussion stage, which remains the most under-studied SDLC phase:

**HULA (Atlassian, ICSE SEIP 2025)** is the most mature production deployment. Engineers receive generated coding plans, review them, provide feedback or direct edits, and HULA regenerates. In production: 82% plan approval rate (433/527), 25% raised PR rate, 59% merge rate [HULA Paper](https://arxiv.org/pdf/2411.12924); [HULA Blog](https://www.atlassian.com/blog/atlassian-engineering/hula-blog-autodev-paper-human-in-the-loop-software-development-agents).

**Spec-Driven Development (GitHub Spec Kit, Kiro, Tessl)** transforms discussion into structured artifact generation: `/specify` → `/plan` → `/tasks`, with human gates at each step. Uses `requirements.md`, `design.md`, and `tasks.md` as the source of truth [Spec-Driven Development (GitHub Blog)](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/); [Red Hat](https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality).

**Communicative Dehallucination (ChatDev)** prompts agents to request detailed suggestions from the instructor before responding, reducing hallucinations by 67% [ChatDev (ACL 2024)](https://arxiv.org/html/2307.07924v5).

A critical gap: interactive prompting constitutes only 5% of requirements engineering research with LLMs, with zero-shot (44%) and few-shot (29%) dominating [LLMs for RE (arXiv)](https://arxiv.org/html/2509.11446v1). The discussion-oriented interaction mode remains severely under-studied.

### 5. Evaluation: A Landscape of Gaps

The evaluation landscape is dominated by execution-stage benchmarks:

| Benchmark | SOTA Performance | Stages Covered | Key Issue |
|-----------|-----------------|----------------|-----------|
| SWE-bench Verified | ~75% | Execution | 32.67% leakage + 31.08% weak tests [SPICE](https://arxiv.org/abs/2507.09108) |
| SWE-bench Pro | <25% | Execution | No planning eval [SWE-bench Pro](https://arxiv.org/abs/2509.16941) |
| FeatureBench | 11% | Planning + Execution | SOTA very low [FeatureBench](https://arxiv.org/abs/2602.10975) |
| SWE-EVO | Varies | Req + Planning + Exec | 48 tasks only [SWE-EVO](https://arxiv.org/abs/2512.18470) |
| SWT-Bench | Varies | Verification | Test generation only [Tessl](https://tessl.io/blog/8-benchmarks-shaping-the-next-generation-of-ai-agents) |

Three evaluation methodology patterns show promise:

1. **Three-Tier Grader Architecture (Anthropic)**: Code-based graders (deterministic), model-based graders (LLM rubrics), human graders (transcript review) [Anthropic Evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents).

2. **Agent-as-a-Judge (ICML 2025)**: Agentic evaluator systems assessing full trajectories achieve ~90% agreement with humans (vs. ~70% for LLM-as-Judge) at 97% lower cost. Notably, planning modules in the judge were *counterproductive* due to error propagation [Agent-as-a-Judge](https://arxiv.org/abs/2410.10934).

3. **Trajectory-Based Evaluation (Google Cloud)**: Metrics like trajectory_exact_match and trajectory_precision detect "silent failures" where correct outputs mask incorrect processes [Google Cloud Agent Eval](https://cloud.google.com/blog/topics/developers-practitioners/a-methodical-approach-to-agent-evaluation).

**Critical benchmarking gaps**: No benchmarks exist for requirements generation quality, roadmap/plan generation as standalone artifacts, human-AI discussion quality, cross-stage coherence, or harness-level evaluation independent of the underlying model.

### 6. Optimization: Systematic Approaches to Harness Improvement

#### Programmatic Optimization (Strongest Evidence)

**DSPy** replaces manual prompt writing with declarative modules optimized by data-driven algorithms. Its optimizer ecosystem includes MIPROv2 (Bayesian optimization), SIMBA (mini-batch introspective ascent, 35%→60% on agent tasks), and GEPA (reflective prompt evolution, up to 11% gains) [DSPy](https://dspy.ai/); [DSPy Optimizers](https://dspy.ai/learn/optimization/optimizers/). DSPy is agent-agnostic and the most widely validated framework for systematic prompt optimization.

**OPRO** uses LLMs themselves as optimizers, generating new candidate prompts from meta-prompts containing previous candidates and scores, achieving up to 50% improvement on Big-Bench Hard [OPRO (arXiv)](https://arxiv.org/abs/2309.03409). However, it shows limited effectiveness with small-scale LLMs [Revisiting OPRO](https://aclanthology.org/2024.findings-acl.100/).

**TextGrad** applies natural language feedback as "textual gradients" for optimization, with 20% relative gains on LeetCode-Hard, published in Nature [TextGrad (arXiv)](https://arxiv.org/abs/2406.07496). However, a December 2025 critique argues the gradient analogy "does not accurately explain" its behavior and that iterative textual gradients are "notoriously unstable" [Textual Gradients Critique (arXiv:2512.13598)](https://arxiv.org/abs/2512.13598). The mechanism may work empirically despite the flawed metaphor.

#### Contract-Based Interfaces (Unique Contribution)

**Agent Behavioral Contracts (ABC)** bring Design-by-Contract principles to AI agents, formalizing behavioral expectations as preconditions, hard/soft invariants, and recovery mechanisms. Across 1,980 sessions and 7 models: hard constraint compliance 88-100%, behavioral drift bounded below 0.27, reliability index >0.90. The framework models drift as an Ornstein-Uhlenbeck stochastic process, proving that when recovery rate γ exceeds drift rate α, drift is bounded to D* = α/γ [ABC (arXiv)](https://arxiv.org/html/2602.22302). This is uniquely applicable to multi-stage harnesses where behavioral drift across pipeline stages is a fundamental challenge.

#### Self-Refinement (With Caveats)

Self-Refine's iterative FEEDBACK→REFINE loop achieves 5-40% improvements across seven tasks [Self-Refine (NeurIPS)](https://arxiv.org/abs/2303.17651). However, models often fail to identify their own failings in open-ended settings. This is particularly relevant because several SDLC stages (requirements, discussion) are inherently open-ended, suggesting self-refinement is best applied to well-defined stages like execution and verification.

#### Cost Optimization

LLM Cascade/Routing achieves ~60% cost reduction by routing simpler queries to cheaper models [LLM Cascades (OpenReview)](https://openreview.net/forum?id=6okaSfANzh). This is critical for multi-stage harnesses where each stage may have different complexity requirements.

#### Cross-Model Portability

PromptBridge demonstrates that cross-model prompt transfer is possible but challenging, achieving 27.39% improvement on SWE-Bench Verified when transferring to o3 [PromptBridge (arXiv)](https://arxiv.org/html/2512.01420v1). The current reality: prompt portability effectively does not exist — changing models requires re-evaluation and re-tuning [Portability of LLM Prompts](https://vivekhaldar.com/articles/portability-of-llm-prompts/).

#### Theoretical Foundation

An ACL 2025 paper provides theoretical grounding: prompts function as selectors that extract task-relevant information from an LLM's hidden state during chain-of-thought reasoning. Naive CoT prompts like "think step by step" can *hinder* performance because they force models to self-discover effective reasoning paths through enormous search spaces. Optimal prompt search yields >50% improvement on reasoning tasks [Why Prompt Design Matters (ACL 2025)](https://aclanthology.org/2025.acl-long.1562/).

### 7. Agent-Agnostic vs. Model-Specific Patterns

**Patterns that generalize across LLM backends:**
- Plan-execute-verify loop (universal across all 13 frameworks)
- File-based state persistence (markdown/JSON + Git)
- Role-restricted agents (read-only explorer, write-only coder)
- AST-based code search over string matching
- Context window management via phase isolation
- Typed schemas at stage boundaries
- Bounded retries with termination conditions

**Patterns requiring model-specific adaptation:**
- Extended thinking / chain-of-thought integration (varies by model capability)
- Tool-use API quality and structured output reliability
- Context window size (Claude 200K+ enables different chunking strategies)
- JSON vs. markdown artifact resistance (Claude-specific recommendation)
- Subagent delegation mechanisms (Claude Code Task tool, OpenAI function calling)

---

## Comparisons & Trade-offs

### Communication Patterns: Structured Documents vs. Dialogue vs. Spec-Driven

| Approach | Best For | Evidence | Limitation |
|----------|----------|----------|------------|
| Structured documents (MetaGPT) | Inter-stage handoffs | Reduces information loss [ICLR 2024] | Rigid; cannot handle ambiguity |
| Dialogue (ChatDev) | Within-stage refinement | 67% hallucination reduction via dehallucination [ACL 2024] | Slower; higher token cost |
| Spec-driven (Spec Kit) | Requirements → Plan pipeline | 82% plan approval rate [HULA/ICSE 2025] | Requires human gates; not autonomous |

No head-to-head comparison exists. The likely resolution: structured documents for *between*-stage contracts, dialogue for *within*-stage refinement, and spec-driven for human-facing discussion stages.

### Optimization Approaches: Applicability to SDLC Stages

| Approach | Best-Suited Stages | Evidence Strength | Cost |
|----------|-------------------|-------------------|------|
| DSPy/MIPROv2 | All stages (modular) | High (Stanford NLP, wide adoption) | Moderate (optimization loop cost) |
| ABC Contracts | Planning, Execution, Verification | Medium-High (1,980 sessions) | Low (sub-10ms overhead) |
| TextGrad | Execution, Verification | High (Nature) but disputed mechanism | Moderate |
| Self-Refine | Execution, Verification (well-defined) | High (NeurIPS) with caveats | Low |
| LLM Cascade | All stages (cost optimization) | High (multiple papers) | Reduces cost ~60% |
| PromptBridge | Cross-model transfer | Medium (preprint) | High (two-stage process) |

---

## Confidence Assessment

### High Confidence
- MetaGPT's role-based architecture and pub-sub communication improve code generation quality (ICLR 2024, peer-reviewed)
- DSPy's programmatic optimization produces measurable, repeatable improvements across diverse tasks (Stanford NLP, widely adopted)
- The "Fresh Eyes" principle in metaprompting outperforms accumulated-context approaches (peer-reviewed, empirical results)
- SWE-bench results are significantly inflated by contamination (SPICE: 32.67% leakage, 31.08% weak tests)
- Phase execution is well-benchmarked; requirements, roadmap, and discussion stages have zero benchmarks
- Prompt portability across models does not exist in practice
- Agent-as-a-Judge achieves ~90% human agreement at 97% lower cost (ICML 2025)
- Communicative dehallucination reduces code hallucinations by 67% (ACL 2024)
- HULA achieves 82% plan approval rate in production at Atlassian (ICSE SEIP 2025)
- Typed schemas at stage boundaries are the consensus recommendation for reliable pipelines

### Medium Confidence
- Agent Behavioral Contracts' drift bounds (substantial empirical evaluation but preprint, not yet peer-reviewed)
- SIMBA outperforms MIPROv2 (internal DSPy experiments, not independently verified)
- PromptBridge achieves 27.39% improvement on cross-model transfer (preprint, limited validation)
- OPRO's effectiveness is limited to large-scale LLMs (one replication study)
- OpenDev's six-phase ReAct loop with multi-model roles (preprint)
- Spec-driven development improves AI coding quality (industry adoption, limited empirical comparison)

### Low Confidence / Unresolved
- **TextGrad's mechanism**: Published in Nature with empirical gains, but the gradient metaphor is disputed. The true mechanism remains unclear.
- **Self-refinement for open-ended tasks**: Effective for well-defined tasks (5-40% gains), but models fail to identify their own failings in open-ended settings. Applicability to requirements and discussion stages is uncertain.
- **Planning modules' value**: Agent-as-a-Judge found planning modules counterproductive in evaluation, while Anthropic's harness relies on upfront planning for execution. The resolution may be context-dependent, but no study has isolated the variable.
- **Cross-stage optimization composition**: No research exists on how optimizing prompts at one stage affects downstream stages. This is a fundamental unknown for multi-stage harness optimization.
- **Cost-effectiveness of multi-agent vs. single-agent architectures**: Anecdotal reports of high costs (Kilo Code) but no systematic comparisons.
- **Long-term codebase impact**: No research on technical debt accumulation from AI-generated code over multiple pipeline iterations.

---

## Recommendations

Based on the synthesis of findings, we identify the following research directions for optimizing AI harness frameworks:

### Immediate Opportunities

1. **Build stage-specific benchmarks.** The most impactful contribution would be benchmarks for requirements generation, plan/roadmap quality, and human-AI discussion — the three stages with zero existing evaluation. DevAI's hierarchical requirement DAG approach and HULA's plan approval rate provide starting points.

2. **Apply DSPy optimization to multi-stage harnesses.** DSPy's modular architecture maps naturally to pipeline stages. Each stage can be defined as a DSPy module with input/output signatures, enabling per-stage optimization with system-level evaluation. No published work has applied DSPy to a full SDLC harness.

3. **Implement Agent Behavioral Contracts across pipeline stages.** ABC's drift bounds and recovery mechanisms directly address the challenge of maintaining coherent behavior across long multi-step workflows. The ContractSpec DSL (sub-10ms overhead) is production-ready.

4. **Adopt structured artifact communication for inter-stage handoffs** with dialogue-based communication for within-stage refinement. Use JSON over markdown for critical state artifacts.

### Medium-Term Research Agenda

5. **Study cross-stage optimization composition.** How do prompt optimizations at the requirements stage propagate to downstream planning and execution? This is the fundamental open question for multi-stage harness optimization.

6. **Develop cross-model harness portability.** PromptBridge shows the approach is feasible but immature. A harness-level abstraction that separates model-agnostic patterns from model-specific prompt tuning would be a significant contribution.

7. **Formalize the human-AI discussion stage.** Apply conversation analysis patterns (insert expansion, turn-taking facilitation) to structured SDLC discussion. Evaluate whether spec-driven (Spec Kit), plan-feedback (HULA), or communicative dehallucination (ChatDev) produces better downstream outcomes.

### Long-Term Research Questions

8. **Develop harness-level evaluation independent of the underlying model.** No methodology exists to measure whether a harness improves *any given model's* performance across the SDLC, holding the model constant.

9. **Study long-term codebase impact.** Technical debt accumulation, maintainability degradation, and architectural drift from repeated AI-generated code iterations are unmeasured.

10. **Investigate the interaction between contract enforcement and prompt optimization.** Whether behavioral contracts improve or constrain the effectiveness of automated prompt optimization is unexplored territory.

---

## Sources

### Academic Papers (Peer-Reviewed)

- [MetaGPT: Meta Programming for Multi-Agent Collaborative Framework (ICLR 2024)](https://arxiv.org/html/2308.00352v7) — Role-based assembly line architecture for multi-stage software development
- [ChatDev: Communicative Agents for Software Development (ACL 2024)](https://arxiv.org/html/2307.07924v5) — Chat chain mechanism and communicative dehallucination (67% hallucination reduction)
- [SWE-agent: Agent-Computer Interfaces (NeurIPS 2024)](https://arxiv.org/abs/2405.15793) — Agent-Computer Interface design for constrained action spaces
- [Meta-Prompting: Enhancing Language Models with Task-Agnostic Scaffolding](https://arxiv.org/abs/2401.12954) — Conductor-Expert architecture, "Fresh Eyes" principle (17.1% improvement)
- [TextGrad: Automatic Differentiation via Text (Nature)](https://arxiv.org/abs/2406.07496) — Textual gradient-based optimization (20% gains on LeetCode-Hard)
- [Textual Gradients are a Flawed Metaphor (arXiv:2512.13598)](https://arxiv.org/abs/2512.13598) — Critique of TextGrad's gradient analogy
- [Self-Refine: Iterative Refinement with Self-Feedback (NeurIPS)](https://arxiv.org/abs/2303.17651) — Self-refinement loop (5-40% improvements)
- [OPRO: Optimization by PROmpting (ICLR 2024)](https://arxiv.org/abs/2309.03409) — LLMs as black-box optimizers
- [Revisiting OPRO: Limitations with Small-Scale LLMs](https://aclanthology.org/2024.findings-acl.100/) — OPRO scalability constraints
- [PE2: Prompt Engineering a Prompt Engineer (ACL 2024)](https://arxiv.org/abs/2311.05661) — Meta-prompt optimization
- [Agent-as-a-Judge (ICML 2025)](https://arxiv.org/abs/2410.10934) — Agentic evaluation (~90% human agreement, 97% cost reduction)
- [Why Prompt Design Matters and Works (ACL 2025)](https://aclanthology.org/2025.acl-long.1562/) — Theoretical foundation for prompt search space complexity
- [HULA: Human-In-the-Loop Software Development Agents (ICSE SEIP 2025)](https://arxiv.org/pdf/2411.12924) — 82% plan approval rate in production at Atlassian
- [SGLang: Structured Generation Language (NeurIPS 2024)](https://arxiv.org/html/2312.07104v1) — 6.4x throughput improvement over LMQL
- [TDAG: Multi-Agent Framework (Neural Networks 2025)](https://dl.acm.org/doi/10.1016/j.neunet.2025.107200) — Dynamic task graph decomposition
- [LLMs for Requirements Engineering: Systematic Literature Review](https://arxiv.org/html/2509.11446v1) — 136% growth in RE+LLM studies; interactive prompting only 5%
- [LLM-as-a-Judge for Software Engineering](https://arxiv.org/pdf/2510.24367) — 26 publications, 80% human agreement at 500-5000x lower cost

### Preprints and Technical Reports

- [OpenHands Platform Paper](https://arxiv.org/abs/2407.16741) — Event-stream architecture for coding agents
- [OpenHands SDK V1](https://arxiv.org/html/2511.03690v1) — Modular event-sourced state with MCP integration
- [OpenDev Harness Paper](https://arxiv.org/html/2603.05344v1) — Six-phase ReAct loop with 5 model roles
- [Agent Behavioral Contracts (ABC)](https://arxiv.org/html/2602.22302) — Design-by-Contract for AI agents (88-100% compliance, drift bounds)
- [PromptBridge](https://arxiv.org/html/2512.01420v1) — Cross-model prompt transfer (27.39% improvement)
- [SWE-bench Pro](https://arxiv.org/abs/2509.16941) — Enterprise-scale coding agent benchmark
- [SWE-EVO](https://arxiv.org/abs/2512.18470) — Multi-commit software evolution benchmark
- [FeatureBench](https://arxiv.org/abs/2602.10975) — Feature-level development benchmark (SOTA: 11%)
- [SPICE](https://arxiv.org/abs/2507.09108) — SWE-bench quality labeling (32.67% leakage)
- [Saving SWE-Bench](https://arxiv.org/abs/2510.08996) — Benchmark mutation showing >50% overestimation
- [CAPO/Promptolution](https://arxiv.org/html/2512.02840v1) — Cost-aware prompt optimization via genetic algorithms
- [The Meta-Prompting Protocol](https://arxiv.org/html/2512.15053) — Adversarial Trinity architecture
- [RePrompt](https://arxiv.org/abs/2406.11132) — Gradient-descent-like planning optimization
- [APE: Automatic Prompt Engineer](https://arxiv.org/abs/2211.01910) — Generate-evaluate-select prompt optimization
- [AI for RE: Industry Adoption](https://arxiv.org/html/2511.01324v1) — Practitioner perspectives on AI in requirements engineering
- [AI-based Multiagent for Requirements Elicitation](https://arxiv.org/html/2409.00038v1) — Multi-agent user story generation
- [HITL Challenges and Future Directions](https://arxiv.org/html/2506.11009) — Trust, feedback, developer agency
- [AI and Agile: XP2025 Workshop](https://arxiv.org/html/2508.20563v1) — Research roadmap for AI in agile ceremonies
- [Interaction Patterns for Debugging](https://arxiv.org/html/2402.06229v1) — 5x bug resolution improvement with structured patterns
- [LLM Agent Evaluation Survey](https://arxiv.org/html/2507.21504v1) — Node F1, Edge F1 for planning evaluation
- [AblationBench](https://arxiv.org/pdf/2507.08038) — LLMs identify only 38% of ablations
- [Hierarchical Prompting Taxonomy](https://arxiv.org/html/2406.12644v2) — Adaptive prompting strategy selection
- [Quality Assessment of Software Requirements Using AI](https://www.sciencedirect.com/science/article/pii/S0950584925003180) — RE quality metrics

### Industry Sources and Documentation

- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Two-agent harness, JSON over markdown, verification patterns
- [Anthropic: Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents) — Prompt chaining, routing, parallelization, evaluator-optimizer patterns
- [Anthropic: How We Built Our Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system) — Orchestrator-Workers (90.2% improvement)
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Three-tier grader architecture
- [GitHub Blog: Multi-agent workflows often fail](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/) — Typed schemas, action schemas, MCP contracts
- [GitHub Blog: Spec-Driven Development Toolkit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — Spec Kit for structured requirements
- [Google Cloud: Methodical Approach to Agent Evaluation](https://cloud.google.com/blog/topics/developers-practitioners/a-methodical-approach-to-agent-evaluation) — Trajectory-based evaluation
- [Martin Fowler: Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html) — Three human-in-the-loop positioning models
- [Microsoft: AI-Led SDLC](https://techcommunity.microsoft.com/blog/appsonazureblog/an-ai-led-sdlc-building-an-end-to-end-agentic-software-development-lifecycle-wit/4491896) — Five-point human oversight in agentic SDLC
- [DSPy Official](https://dspy.ai/) — Programmatic prompt optimization framework
- [DSPy Optimizers](https://dspy.ai/learn/optimization/optimizers/) — MIPROv2, SIMBA, COPRO, GEPA
- [GSD Workflow Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system) — Six-stage Claude Code workflow architecture
- [HULA Blog (Atlassian)](https://www.atlassian.com/blog/atlassian-engineering/hula-blog-autodev-paper-human-in-the-loop-software-development-agents) — Production deployment metrics
- [SWE-bench](https://www.swebench.com/SWE-bench/) — Primary coding agent benchmark
- [DeepEval Agent Evaluation](https://deepeval.com/guides/guides-ai-agent-evaluation) — PlanQualityMetric and agent eval framework
- [DPAI Arena (JetBrains)](https://blog.jetbrains.com/blog/2025/10/28/introducing-developer-productivity-ai-arena-an-open-platform-for-ai-coding-agents-benchmarks/) — Linux Foundation-governed multi-workflow benchmark
- [Red Hat: How Spec-Driven Development Improves AI Coding Quality](https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality) — Specification-based approach validation
- [Portability of LLM Prompts](https://vivekhaldar.com/articles/portability-of-llm-prompts/) — Empirical reality of prompt non-portability
- [LLM Cascades (OpenReview)](https://openreview.net/forum?id=6okaSfANzh) — ~60% cost reduction with cascade routing
- [Unified Cascading and Routing (OpenReview)](https://openreview.net/forum?id=AAl89VNNy1) — Theoretical optimal cascade strategy
- [Agents At Work: 2026 Playbook](https://promptengineering.org/agents-at-work-the-2026-playbook-for-building-reliable-agentic-workflows/) — Hybrid static DAG + agent-driven branching
- [AI-SQE 2026 Workshop (ICSE 2026)](https://conf.researchr.org/home/icse-2026/ai-sqe-2026) — Upcoming venue for AI software quality evaluation

### Framework Documentation and Repositories

- [MetaGPT GitHub](https://github.com/FoundationAgents/MetaGPT)
- [ChatDev GitHub](https://github.com/OpenBMB/ChatDev)
- [AutoCodeRover (MIT AI Agent Index)](https://aiagentindex.mit.edu/autocoderover/)
- [Windsurf Cascade Docs](https://docs.windsurf.com/windsurf/cascade/cascade)
- [LangGraph State Management](https://sparkco.ai/blog/mastering-langgraph-state-management-in-2025)
- [LangGraph Checkpointing](https://sparkco.ai/blog/mastering-langgraph-checkpointing-best-practices-for-2025)
- [Google ADK Multi-agent](https://google.github.io/adk-docs/agents/multi-agents/)
- [CrewAI Flows](https://docs.crewai.com/en/concepts/flows)
- [AutoGen Conversation Patterns](https://microsoft.github.io/autogen/0.2/docs/tutorial/conversation-patterns/)
- [Aider](https://aider.chat/)
- [Self-Refine Project](https://selfrefine.info/)
- [SIMBA - DSPy](https://dspy.ai/api/optimizers/SIMBA/)
- [LMQL](https://lmql.ai/)
