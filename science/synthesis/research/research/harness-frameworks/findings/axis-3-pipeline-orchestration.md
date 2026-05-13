# Axis 3: Multi-Stage Pipeline Orchestration

## Question
How are multi-stage software development pipelines (requirements → roadmap → discussion → planning → execution → verification) orchestrated in practice, and what are the key design decisions for stage boundaries, state passing, error recovery, and human-in-the-loop integration?

## Findings

### 1. Pipeline Topology and Stage Boundaries

- **Sequential (pipeline) orchestration** is the dominant pattern for SDLC-mimicking agent workflows. Each stage has clear input/output contracts, measurable latency, and isolated failure modes. Stage boundaries create natural checkpoints for human review. [Agent Orchestration Patterns](https://dev.to/jose_gurusup_dev/agent-orchestration-patterns-swarm-vs-mesh-vs-hierarchical-vs-pipeline-b40) **Confidence: High**

- **MetaGPT** implements the fullest SDLC pipeline: Product Manager -> Architect -> Project Manager -> Engineer -> QA Engineer. Each role produces structured document artifacts consumed via a publish-subscribe shared message pool. [MetaGPT (ICLR 2024)](https://arxiv.org/html/2308.00352v7) **Confidence: High**

- **ChatDev** uses three phases (design -> coding -> testing), decomposed into subtasks via "chat chain" where instructor-assistant agent pairs communicate iteratively. Unlike MetaGPT's document-based handoffs, ChatDev uses dialogue-based communication. [ChatDev (ACL 2024)](https://arxiv.org/html/2307.07924v5) **Confidence: High**

- **Key limitation of strict pipelines**: they cannot handle tasks where execution order depends on intermediate results. An orchestrator-worker or router pattern is needed instead. [Agent Orchestration Patterns](https://dev.to/jose_gurusup_dev/agent-orchestration-patterns-swarm-vs-mesh-vs-hierarchical-vs-pipeline-b40) **Confidence: High**

### 2. State Management and Inter-Stage Contracts

- **Typed schemas at every boundary** are the primary recommendation. Replace natural language ambiguity with machine-checkable contracts (TypeScript/Zod or Pydantic). Invalid messages should fail fast. [GitHub Blog: Multi-agent workflows](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/) **Confidence: High**

- **LangGraph uses reducer-driven state schemas** built on Python's `TypedDict` with `Annotated` types. Each state field is paired with a reducer function. Nodes receive complete state and return updated versions. [Mastering LangGraph State Management](https://sparkco.ai/blog/mastering-langgraph-state-management-in-2025) **Confidence: High**

- **Google ADK uses shared `InvocationContext`**: The `output_key` pattern writes an agent's final response to a named key in `session.state`. For parallel agents, all children share `session.state` but get distinct branch paths. [Google ADK Multi-agent](https://google.github.io/adk-docs/agents/multi-agents/) **Confidence: High**

- **CrewAI Flows** support unstructured (dictionary) and structured (Pydantic) state. The `@persist` decorator enables automatic state recovery using SQLite. [CrewAI Flows](https://docs.crewai.com/en/concepts/flows) **Confidence: High**

- **Structured vs. dialogue-based communication**: MetaGPT's structured approach reduces information loss compared to ChatDev's dialogue approach, resulting in measurably better code generation outcomes. [MetaGPT Paper](https://arxiv.org/html/2308.00352v7) **Confidence: High**

### 3. Error Recovery and Failure Handling

- **Multi-agent failures stem from structural deficiency, not model limitation**. Recommended approach: fail fast at boundaries, retry or escalate (never propagate bad state), validate every interface. [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/) **Confidence: High**

- **LangGraph checkpointing** provides fault-tolerance: restart from last successful step. Persistent checkpointers (PostgresSaver) ensure data integrity during restarts. [Mastering LangGraph Checkpointing](https://sparkco.ai/blog/mastering-langgraph-checkpointing-best-practices-for-2025) **Confidence: High**

- **MetaGPT uses executable feedback with bounded retries**: Engineers test iteratively; maximum 3 retries. [MetaGPT Paper](https://arxiv.org/html/2308.00352v7) **Confidence: High**

- **ChatDev's termination conditions**: subtasks conclude after either two unchanged consecutive code modifications or 10 communication rounds. [ChatDev Paper](https://arxiv.org/html/2307.07924v5) **Confidence: High**

- **Anthropic's long-running agent recovery**: relies on git history — identify problematic commit, reset to last known-good state, update prompt/plan, resume. "Accept that agents will eventually go off-track." [The Human On the Loop](https://dotnetting.net/2026/02/the-human-on-the-loop-a-practical-guide-to-agentic-engineering/) **Confidence: High**

### 4. Human-in-the-Loop Integration

- **Three positioning models**: (1) **Humans Outside** — manage only the "why"; (2) **Humans In** — directly inspect/correct artifacts (creates bottlenecks); (3) **Humans On** (recommended) — make agents better through harness engineering. [Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html) **Confidence: High**

- **LangGraph interrupts** pause execution and wait for human input. The `Command` primitive allows humans to inject state updates before resuming. [LangGraph Interrupts](https://dev.to/jamesbmour/interrupts-and-commands-in-langgraph-building-human-in-the-loop-workflows-4ngl) **Confidence: High**

- **Microsoft's AI-led SDLC**: human oversight at five points — PR review, deployed revision URL evaluation, code quality assessment, SRE incident approval, daily operational summary. "Just because we could have dynamic decision-making doesn't mean we should" for infrastructure. [Microsoft AI-Led SDLC](https://techcommunity.microsoft.com/blog/appsonazureblog/an-ai-led-sdlc-building-an-end-to-end-agentic-software-development-lifecycle-wit/4491896) **Confidence: High**

- **Action schemas constrain agent autonomy** to pre-defined, reviewable options using discriminated unions. Agents must return exactly one valid action. [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/) **Confidence: High**

### 5. Multi-Context Window and Long-Running Orchestration

- **Anthropic's two-agent harness**: Initializer Agent sets up environment with comprehensive feature lists in JSON; subsequent Coding Agents make incremental progress. State passes via `claude-progress.txt`, git history, and structured JSON feature lists. [Effective Harnesses for Long-Running Agents (Anthropic)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) **Confidence: High**

- **JSON over Markdown** recommended for inter-window specifications — prevents inappropriate changes or overwriting. [Anthropic Harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) **Confidence: High**

- **Verification is a critical failure point**: agents tend to mark features complete without proper testing. Solutions include browser automation (Puppeteer MCP) and feature status tracking that only updates after careful validation. [Anthropic Harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) **Confidence: High**

### 6. Orchestration Pattern Selection

- **AutoGen** provides five patterns: sequential, concurrent, group chat, handoff, and magentic (manager with dynamic task ledger). [AutoGen Patterns](https://microsoft.github.io/autogen/0.2/docs/tutorial/conversation-patterns/) **Confidence: High**

- **MCP is emerging as the enforcement layer** for inter-agent contracts. Defines explicit input/output schemas for every tool, validating calls before execution. [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/) **Confidence: Medium**

- **Hybrid approach recommended**: Static DAG workflows for predictable pipelines; agents branch only where data demands adaptive planning. [Agents At Work: 2026 Playbook](https://promptengineering.org/agents-at-work-the-2026-playbook-for-building-reliable-agentic-workflows/) **Confidence: High**

### 7. Mapping to the Six Workflow Stages

- **Requirements Generation**: MetaGPT's Product Manager generates PRDs. Microsoft's Spec Kit translates user stories into plans. Both emphasize persistent, structured, versioned specifications.
- **Roadmap/Planning**: MetaGPT's Architect produces system design. Anthropic creates JSON feature lists with 200+ itemized features, all initially "failing."
- **Discussion/Review**: ChatDev's "communicative dehallucination" — assistant proactively seeks clarification. HULA (Atlassian/JIRA) enables engineers to refine LLM coding plans. [HULA (ICSE SEIP 2025)](https://arxiv.org/abs/2411.12924)
- **Execution**: All frameworks converge on bounded, incremental execution. Anthropic recommends single-feature focus per context window.
- **Verification**: ChatDev splits into static review and dynamic testing. MetaGPT uses executable feedback with 3-retry max. Anthropic emphasizes browser automation beyond unit tests.

### Conflicting Information

- **Dialogue vs. structured document communication**: MetaGPT claims structured outputs reduce information loss; ChatDev's dialogue enables richer clarification. Likely resolved by context: structured for formal handoffs, dialogue for within-stage refinement.
- **Human-in-the-loop vs. human-on-the-loop**: Martin Fowler recommends oversight, while Microsoft maintains explicit approval gates. These represent a spectrum based on task criticality.

### Key Unknowns

1. **Cross-framework interoperability**: No source addressed composing agents from different frameworks in a single SDLC pipeline.
2. **Optimal stage granularity**: No empirical study comparing fine-grained vs. coarse-grained pipeline decompositions.
3. **State schema versioning**: No concrete patterns for versioning inter-stage contracts as pipelines evolve.
4. **Cost-quality tradeoffs of verification depth**: No quantified cost vs. quality data for verification strategies.
5. **Feedback loops from verification back to requirements**: No mature pattern described.
6. **Empirical validation at scale**: Large-scale comparisons across frameworks remain sparse.
7. **Model-specific vs. agent-agnostic boundaries**: Systematic guidance on adapting pipeline designs to different LLM capabilities was not found.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 16
