# Axis 3: Planning & Task Decomposition

## Question
How do agent harnesses break down complex tasks? What planning representations do they use (flat task lists, dependency graphs, phase trees, DAGs)? How is replanning handled?

## Findings

### 1. The Spectrum of Planning Representations

Modern agent harnesses employ a surprisingly diverse range of planning representations, from implicit step-by-step reasoning to explicit DAG-structured task graphs.

**Flat Task Lists (Sequential Plans)** remain the most common starting point. LangGraph's original plan-and-execute pattern uses a simple multi-step plan where "a planner prompts an LLM to generate a multi-step plan to complete a large task," then executors handle individual steps sequentially. [Plan-and-Execute Agents - LangChain Blog](https://blog.langchain.com/planning-agents/) (Confidence: High) CrewAI similarly employs a flat list representation with explicit ordering -- tasks are defined as ordered lists passed to Crew initialization, and the sequential process executes them "according to the predefined order in the task list, with the output of one task serving as the context for the next." [Tasks - CrewAI Docs](https://docs.crewai.com/en/concepts/tasks) (Confidence: High)

**Directed Acyclic Graphs (DAGs)** represent the most architecturally sophisticated planning format in active use. The LLMCompiler architecture, implemented in LangGraph, "streams a DAG of tasks. Each task contains a tool, arguments, and list of dependencies," enabling parallel execution with variable references like `search("${1}")` to chain outputs. This achieved a claimed 3.6x speedup through parallelism and 4.65x cost reduction compared to ReAct. [LLMCompiler - LangGraph Tutorial](https://langchain-ai.github.io/langgraph/tutorials/llm-compiler/LLMCompiler/) [Plan-and-Execute Agents - LangChain Blog](https://blog.langchain.com/planning-agents/) (Confidence: High) Claude Code's Tasks feature (introduced in v2.1.16, January 2026) also supports DAGs: "a task can explicitly 'block' another. The system can determine that Task 3 (Run Tests) cannot start until Task 1 (Build API) and Task 2 (Configure Auth) are complete." [Claude Code Todos to Tasks - Rick Hightower](https://medium.com/@richardhightower/claude-code-todos-to-tasks-5a1b0e351a1c) (Confidence: High)

**Phase Trees with Wave-Based Parallelism** represent a distinctive approach pioneered by GSD (Get-Shit-Done). Work is organized into sequential phases within milestones, where each phase directory contains planning artifacts. Plans decompose into "atomic tasks grouped into waves," where "the executor groups plans into waves based on dependencies, spawns executor agents in parallel where possible." Waves run sequentially, but tasks within each wave execute in parallel. The `.planning/` directory uses a hierarchical structure with zero-padded phase numbering (including decimal insertion for urgent mid-execution discoveries like `02.1-oauth-providers`). [Phase Management Commands - GSD DeepWiki](https://deepwiki.com/gsd-build/get-shit-done/4.2-phase-management-commands) (Confidence: High)

**Variable-Assignment Plans (ReWOO)** use an interleaved format of natural-language reasoning and executable steps with variable references. The planner outputs "Plan" and "E#" lines like `E2: LLM[process previous output]`, creating implicit dependency chains through variable substitution. [Plan-and-Execute Agents - LangChain Blog](https://blog.langchain.com/planning-agents/) (Confidence: High)

**Structured Text Plans (Human-Readable Documents)** are used by coding agents that emphasize developer review. OpenDev produces plan documents with seven sections: "the objective being addressed, relevant context, which files require modification, new files to create, ordered implementation steps, acceptance criteria, and potential hazards." [Building AI Coding Agents for the Terminal - arXiv](https://arxiv.org/html/2603.05344v1) (Confidence: High) OpenAI Codex uses milestone-based markdown files (Plans.md, Prompt.md, Implement.md) where milestones should be "small enough to complete in one loop" with defined acceptance criteria. [Run long horizon tasks with Codex - OpenAI](https://developers.openai.com/cookbook/examples/codex/long_horizon_tasks) (Confidence: High)

**Implicit Plans via Function Calling** represent the trend toward eliminating explicit planning representations entirely. Semantic Kernel deprecated its Stepwise and Handlebars planners in favor of automatic function calling, where "all of the steps in the automatic planning loop are handled for you and added to the ChatHistory object." [What are Planners in Semantic Kernel - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning) (Confidence: High)

### 2. How Task Decomposition Actually Works

**CLI/Coding Agents** tend to use a delegated planning architecture:

- **Cline**: "Plan & Act" mode separates strategic thinking from implementation: Plan mode provides "read-only exploration and architecture" while Act mode enables "actual code changes." The Deep Planning feature (`/deep-planning`) "turns Cline into an architect before it becomes a builder." [Deep Planning - Cline Docs](https://docs.cline.bot/features/deep-planning) (Confidence: High)

- **Aider**: Two-inference-step approach in architect mode: "An Architect model is asked to describe how to solve the coding problem. An Editor model is given the Architect's solution and asked to produce specific code editing instructions." The architect "can describe the solution however comes naturally to it" -- free-form natural language. Yielded 85% SWE-bench score. [Separating code reasoning and editing - Aider](https://aider.chat/2024/09/26/architect.html) (Confidence: High)

- **Windsurf's Cascade**: "A specialized planning agent continuously refines the long-term plan while your selected model focuses on taking short-term actions based on that plan." Dual-track model runs planning as background process alongside execution. [Windsurf - Cascade Docs](https://docs.windsurf.com/windsurf/cascade/cascade) (Confidence: Medium)

- **Claude Code**: Three blended phases: "gather context, take action, and verify results." Not rigid stages but adaptive behaviors. [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) (Confidence: High)

**General-Purpose Agent Frameworks** offer more explicit orchestration primitives:

- **CrewAI**: Two decomposition modes: sequential and hierarchical, where a "manager" agent is "automatically created to oversee task execution, including planning, delegation, and validation." [Processes - CrewAI](https://crewai.net/posts/crewai-processes/) (Confidence: High)

- **AutoGen/AG2**: Conversation-based decomposition through group chat patterns. Planning emerges from agent interactions rather than being imposed top-down. [Conversation Patterns - AutoGen 0.2](https://microsoft.github.io/autogen/0.2/docs/tutorial/conversation-patterns/) (Confidence: High)

- **OpenAI Agents SDK**: Delegates decomposition to the LLM itself with Manager pattern (central LLM orchestrating specialists) and Decentralized/Handoff pattern. [Agent orchestration - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent/) (Confidence: High)

### 3. Code-as-Plan: The smolagents Pattern

smolagents' CodeAgent "consolidate[s] all these calls into a single block or snippet of code, letting the LLM lay out an entire plan of action at once." A supplementary planning step can be activated via `planning_interval`, where "the LLM is simply asked to update a list of facts it knows and to reflect on what steps it should take next." [Building good agents - smolagents docs](https://huggingface.co/docs/smolagents/tutorials/building_good_agents) (Confidence: High)

AlphaCodium's "flow engineering" uses a hardcoded multi-stage pipeline rather than LLM-generated plans: pre-processing phase (self-reflection, reasoning about tests, generating AI tests, enumerating solutions) feeds into code iterations phase. [Code Generation with AlphaCodium - arXiv](https://arxiv.org/abs/2401.08500) (Confidence: High)

### 4. Domain-Specific vs. General-Purpose Planning

LangChain's own analysis: "Nearly all the advanced agents we see in production actually have a very domain specific and custom cognitive architecture." Engineers "remove planning burden from LLMs through hardcoded workflows." [Planning for Agents - LangChain Blog](https://blog.langchain.com/planning-for-agents/) (Confidence: High)

Claude Agent SDK occupies a middle ground, providing subagent orchestration primitives where "the orchestrator [maintains] the global plan and a compact state" and subagents can be "chained in pipelines for deterministic workflows or run in parallel for specialization." [Building agents with the Claude Agent SDK - Anthropic](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) (Confidence: High)

Mastra provides an interesting hybrid: deterministic graph-based workflows via `.then()` chaining alongside an Agent Network (vNext) that "automatically routes and executes complex multi-agent tasks without predetermined workflows." [Beyond Workflows: Agent Network - Mastra Blog](https://mastra.ai/blog/vnext-agent-network) (Confidence: Medium)

### 5. Replanning Strategies

- **Replan-on-Failure (Reactive):** LangGraph evaluates results after execution and either "finishes with a response or generates a follow-up plan." The LLMCompiler's Joiner "dynamically replan[s] or finish[es] based on the entire graph history." [Plan-and-Execute Agents - LangChain Blog](https://blog.langchain.com/planning-agents/) (Confidence: High)

- **Guardrail-Triggered Retry:** CrewAI uses guardrails -- "When validation fails, error feedback returns to the agent, the agent attempts correction, retries continue until guardrail passes or guardrail_max_retries limit reached." [Tasks - CrewAI Docs](https://docs.crewai.com/en/concepts/tasks) (Confidence: High)

- **Verifier-Driven Fix Plans:** GSD's verifier creates "fix plans" when issues are discovered during testing. Plan-checker agent validates plans against requirements before execution. [Phase Management Commands - GSD DeepWiki](https://deepwiki.com/gsd-build/get-shit-done/4.2-phase-management-commands) (Confidence: High)

- **Planner Subagent Re-Invocation:** OpenDev treats replanning as "a first-class operation rather than an error-recovery mechanism." [Building AI Coding Agents for the Terminal - arXiv](https://arxiv.org/html/2603.05344v1) (Confidence: High)

- **Continuous Validation (Stop-and-Fix):** Codex applies continuous validation with "a stop-and-fix rule preventing cascading errors." [Run long horizon tasks with Codex - OpenAI](https://developers.openai.com/cookbook/examples/codex/long_horizon_tasks) (Confidence: High)

- **Plan Mode Re-Entry:** Cline acknowledges "planning isn't a one-time event; if new complexities emerge, don't hesitate to return to Plan Mode." [Plan Smarter, Code Faster - Cline Blog](https://cline.ghost.io/plan-smarter-code-faster-clines-plan-act-is-the-paradigm-for-agentic-coding/) (Confidence: High)

- **Periodic Reflection (smolagents):** Planning intervals where the agent is "asked to update a list of facts it knows and to reflect on what steps it should take next" at configurable intervals. [Building good agents - smolagents docs](https://huggingface.co/docs/smolagents/tutorials/building_good_agents) (Confidence: High)

- **Implicit Replanning via Function Calling Loop:** Semantic Kernel and OpenAI Agents SDK rely on the LLM's built-in iterative loop. Replanning is emergent from the ReAct cycle itself. [What are Planners in Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning) (Confidence: High)

### 6. Emerging Pattern: The Planner-Executor Separation

A clear architectural trend across almost every framework:
- **Model-level separation** (Aider): Different LLMs for reasoning vs. editing
- **Mode-level separation** (Cline, Codex): Explicit plan mode with read-only tools, then execute mode with write tools
- **Subagent separation** (OpenDev, Claude Agent SDK): Dedicated planner subagent with restricted tool access
- **Process-level separation** (CrewAI hierarchical, OpenAI Agents SDK manager): Manager agent plans and delegates
- **Background separation** (Windsurf): Planning agent runs continuously alongside execution model
- **Cost optimization**: Plan-and-execute enables "using smaller/weaker models for the execution step, only using larger/better models for the planning step" [Plan-and-Execute Agents - LangChain Blog](https://blog.langchain.com/planning-agents/)

## Key Unknowns

1. **Windsurf Cascade internals**: Almost no technical detail about the plan representation or how the planning agent communicates with the execution model.
2. **Cursor's internal planning**: Not publicly documented.
3. **Pydantic AI planning primitives**: No native planning or task decomposition primitive described in documentation.
4. **Empirical comparisons**: No systematic benchmark of DAG-based vs flat-list vs implicit function-calling planning on the same task set.
5. **Plan persistence across context windows**: "Getting agents to make consistent progress across multiple context windows remains an open problem in 2026." [Long-Running AI Agents - Zylos Research](https://zylos.ai/research/2026-01-16-long-running-ai-agents)

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 20+
