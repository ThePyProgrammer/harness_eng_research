# Axis 2: Metaprompt Architecture Patterns

## Question
What architectural patterns and prompt engineering techniques are used in metaprompting — i.e., constructing prompts that instruct an LLM to generate effective sub-prompts or orchestrate other agents — and how do these differ from standard prompting?

## Findings

### 1. ORCHESTRATION ARCHITECTURE PATTERNS

#### 1.1 Conductor-Expert Architecture (Task-Agnostic Scaffolding)
The foundational metaprompting pattern, introduced by Suzgun & Kalai (Stanford/OpenAI), treats a single LLM as a "conductor" that decomposes complex tasks into subtasks, delegates each to freshly instantiated "expert" LM copies with tailored instructions, then integrates and verifies outputs. Each expert receives only relevant instructions -- the "Fresh Eyes" principle -- eliminating contextual pollution from accumulated reasoning. On GPT-4, this outperformed standard prompting by 17.1%, expert dynamic prompting by 17.3%, and multipersona prompting by 15.2% across Game of 24, Checkmate-in-One, and Python Programming Puzzles benchmarks. [Meta-Prompting: Enhancing Language Models with Task-Agnostic Scaffolding (arXiv:2401.12954)](https://arxiv.org/abs/2401.12954)
- **Confidence:** High (peer-reviewed, empirical results)
- **Agent-agnostic:** Yes
- **Workflow mapping:** Applicable across all six stages; particularly strong for phase execution and phase verification

#### 1.2 Adversarial Trinity Architecture (Meta-Prompting Protocol)
A three-agent closed-loop system consisting of a Generator (high-entropy exploration, temperature ~0.7), an Auditor (deterministic quality gate, temperature 0.0 with zero-trust blind auditing), and an Optimizer (aggregates audit reports, performs "backpropagation" in semantic space). The protocol treats prompts as optimizable source code and uses textual critiques as differentiable gradient signals. [The Meta-Prompting Protocol: Orchestrating LLMs via Adversarial Feedback Loops (arXiv:2512.15053)](https://arxiv.org/html/2512.15053)
- **Confidence:** Medium (arXiv preprint, theoretical framework)
- **Agent-agnostic:** Yes
- **Workflow mapping:** Best suited for phase verification and iterative refinement of requirements/roadmap generation

#### 1.3 Orchestrator-Workers Pattern (Anthropic)
A central LLM dynamically breaks down tasks, delegates to worker LLMs, and synthesizes results. Anthropic's multi-agent research system using Claude Opus 4 as lead with Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on internal research evaluations. Each subagent receives an objective, output format, tool/source guidance, and explicit task boundaries. [How We Built Our Multi-Agent Research System (Anthropic)](https://www.anthropic.com/engineering/multi-agent-research-system)
- **Confidence:** High (production system)
- **Model-specific:** Architecture is model-agnostic; implementation is Claude-specific

#### 1.4 Dual-Agent Harness (Initializer + Iterative Coding Agent)
For long-running agent workflows, an Initializer agent runs once to establish scaffolding (init.sh scripts, progress files, feature lists in JSON, initial git commits), then a Coding Agent executes repeatedly across discrete context windows. The initializer generates the prompting context that subsequent agents consume. [Effective Harnesses for Long-Running Agents (Anthropic)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- **Confidence:** High (production system at Anthropic)
- **Agent-agnostic:** Pattern is generic; implementation references Claude Code specifically

### 2. AUTOMATIC PROMPT OPTIMIZATION PATTERNS

#### 2.1 DSPy: Declarative Prompt Programming
Replaces manual prompt writing with programmatic modules defined by input/output signatures. Optimizers (MIPROv2, COPRO, BootstrapFewShot, SIMBA, GEPA) automatically tune prompts and weights. MIPROv2 uses Bayesian optimization; COPRO uses coordinate ascent (hill-climbing). [DSPy: The Framework for Programming -- Not Prompting -- Language Models](https://dspy.ai/) and [DSPy Optimization Overview](https://dspy.ai/learn/optimization/overview/)
- **Confidence:** High (widely adopted, Stanford NLP group)

#### 2.2 PE2: Prompt Engineering a Prompt Engineer
Uses a meta-prompt with detailed task descriptions, context specifications, and step-by-step reasoning templates, plus verbalized analogues of optimization concepts. PE2 outperforms "let's think step by step" by 6.3% on MultiArith and 3.1% on GSM8K. Published at ACL 2024. [Prompt Engineering a Prompt Engineer (arXiv:2311.05661)](https://arxiv.org/abs/2311.05661)
- **Confidence:** High (peer-reviewed)

#### 2.3 TextGrad: Textual Gradient-Based Optimization
Mirrors PyTorch's backpropagation but uses natural language feedback ("textual gradients"). Published in Nature. Improved GPT-4o zero-shot accuracy on Google-Proof QA from 51% to 55% and yielded 20% relative gains on LeetCode-Hard. [TextGrad (arXiv:2406.07496)](https://arxiv.org/abs/2406.07496)
- **CONFLICTING EVIDENCE:** A December 2025 paper argues that "the gradient analogy does not accurately explain [TextGrad's] behavior" and that iterative textual gradients are "notoriously unstable." [Textual Gradients are a Flawed Metaphor (arXiv:2512.13598)](https://arxiv.org/abs/2512.13598)

#### 2.4 RePrompt: Gradient-Descent-Like Planning Optimization
Optimizes step-by-step instructions in prompts for LLM agents based on chat history, applying a "gradient descent"-like approach to plan refinement. Specifically targets planning tasks. [RePrompt (arXiv:2406.11132)](https://arxiv.org/abs/2406.11132)
- **Confidence:** Medium (arXiv preprint)
- **Workflow mapping:** Directly relevant to roadmap generation and phase planning

### 3. PROGRAMMATIC PROMPT CONSTRUCTION FRAMEWORKS

#### 3.1 LMQL: Query Language for LLMs
SQL-like programming language with control flow and constraint-based decoding. The `where` keyword enforces constraints eagerly on each generated token. Based on "Prompting Is Programming." [LMQL](https://lmql.ai/) and [Prompting Is Programming (arXiv:2212.06094)](https://arxiv.org/abs/2212.06094)
- **Note:** SGLang outperforms LMQL by up to 6.4x in throughput. [SGLang (arXiv:2312.07104)](https://arxiv.org/html/2312.07104v1)

#### 3.2 SGLang: Structured Generation Language
DSL embedded in Python with RadixAttention for KV cache reuse and compressed finite state machines. Joined PyTorch ecosystem early 2025. [SGLang (arXiv:2312.07104)](https://arxiv.org/html/2312.07104v1)
- **Confidence:** High (NeurIPS 2024, production use)

### 4. WORKFLOW COMPOSITION PATTERNS

#### 4.1 Prompt Chaining (Sequential Decomposition)
Tasks decomposed into sequential steps where each LLM call processes prior outputs, with programmatic gates/checks at intermediate steps. [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)

#### 4.2 Routing (Input Classification to Specialized Handlers)
Input classification directs work to specialized prompt handlers, enabling per-category optimization. [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)

#### 4.3 Parallelization (Sectioning + Voting)
Sectioning breaks tasks into independent parallel subtasks; Voting runs identical prompts multiple times. "LLMs generally perform better when each consideration is handled by a separate LLM call." [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)

#### 4.4 Evaluator-Optimizer Loop
One LLM generates responses while another provides iterative feedback, analogous to human revision cycles. [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)

#### 4.5 Dynamic Task Graph Decomposition (TDAG)
Uses directed acyclic graphs with task nodes and dependencies, enabling asynchronous decomposition with dynamically generated subagents. [TDAG (Neural Networks, 2025)](https://dl.acm.org/doi/10.1016/j.neunet.2025.107200)
- **Confidence:** Medium-High (peer-reviewed journal)

### 5. TASK DECOMPOSITION TECHNIQUES FOR CODING AGENTS

#### 5.1 Blueprint2Code: Multi-Agent Pipeline
Four-stage: task preview, blueprint planning, code implementation, debugging. [Blueprint2Code (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12575318/)

#### 5.2 ADaPT: As-Needed Decomposition and Planning
Decomposes complex subtasks only when the LLM fails to execute directly — demand-driven rather than upfront decomposition. [Task Decomposition for Coding Agents](https://atoms.dev/insights/task-decomposition-for-coding-agents-architectures-advancements-and-future-directions/a95f933f2c6541fc9e1fb352b429da15)

### 6. KEY DIFFERENCES FROM STANDARD PROMPTING

| Dimension | Standard Prompting | Metaprompting |
|---|---|---|
| **Computation unit** | Single prompt -> single response | Decomposed subtasks -> synthesized output |
| **Prompt authorship** | Human writes prompts manually | LLM generates/refines sub-prompts |
| **Error handling** | Errors propagate forward linearly | Checkpoint validation, isolation, recovery |
| **Context management** | Accumulates context (noise risk) | Isolated per expert (Fresh Eyes principle) |
| **Optimization** | Intuition-based iteration | Data-driven, automated (DSPy, TextGrad, PE2) |
| **Specialization** | Generalist single prompt | Role-specific expert instances |
| **Feedback loops** | None (open-loop) | Closed-loop with auditor/evaluator agents |
| **Reproducibility** | Low (stochastic) | Higher through deterministic governance |

Sources: [Meta-Prompting Guide (createXflow)](https://createxflow.com/meta-prompting-guide-architecture-implementation/), [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)

### 7. CLAUDE/ANTHROPIC-SPECIFIC DEPTH

- **Agent Teams (Opus 4.6):** Lead agent decomposes tasks, spawns subagents with specific objectives, output formats, tool guidance, and task boundaries. Uses extended thinking for planning. [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)
- **Effort Scaling Heuristics:** Simple queries use 1 agent with 3-10 tool calls; complex research uses 10+ subagents. [Anthropic Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)
- **Tool Description as Prompt Engineering:** Anthropic recommends treating tool/API descriptions with the same rigor as system prompts. Poor tool descriptions cause agents to pursue wrong trajectories. [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- **Persistent State Artifacts:** The claude-progress.txt pattern and structured JSON feature lists serve as inter-session metaprompts. [Effective Harnesses for Long-Running Agents (Anthropic)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### Key Unknowns

1. **Empirical comparison across metaprompting patterns:** No single study systematically compares Conductor-Expert, Adversarial Trinity, Orchestrator-Workers, and Evaluator-Optimizer on identical benchmarks.
2. **Cost-performance tradeoffs at scale:** Anthropic reports 90.2% improvement with multi-agent, but token costs and latency overhead are not publicly detailed.
3. **Optimal decomposition granularity:** No established guidelines for how fine-grained task decomposition should be.
4. **Cross-model transferability of optimized prompts:** How well DSPy/PE2-optimized prompts transfer across model families is not well-studied.
5. **TextGrad's actual mechanism:** Given the December 2025 critique, the true mechanism driving its improvements remains unclear.
6. **LMQL/Guidance viability in 2026:** With SGLang outperforming by 6.4x, LMQL's position is uncertain.
7. **Formal verification of metaprompt correctness:** No frameworks provide guarantees that generated sub-prompts are semantically correct.
8. **Human-AI phase discussion patterns:** Specific metaprompting patterns for structured human-AI collaboration remain underspecified.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 18
