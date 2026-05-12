# Axis 1: Core Agent Loop Architectures

## Question
How do different agent harnesses structure their core reasoning/action loop, and what are the trade-offs between approaches (ReAct, plan-then-execute, state machines, DAGs, hierarchical orchestration)?

## Findings

### 1. The ReAct Loop (Reason + Act)

**Structure:** `Prompt -> Think -> Act -> Observe -> (repeat until done)`

The ReAct pattern is the most prevalent agent design pattern today. The agent receives a prompt, articulates its reasoning ("Thought"), executes an action such as a tool call ("Action"), observes the result ("Observation"), and uses the new information to inform subsequent steps in a tight feedback loop [Navigating Modern LLM Agent Architectures](https://www.wollenlabs.com/blog-posts/navigating-modern-llm-agent-architectures-multi-agents-plan-and-execute-rewoo-tree-of-thoughts-and-react). The loop terminates when the model produces a response with no tool calls, or when a max-turns/budget limit is hit [How the agent loop works - Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/agent-loop).

**Frameworks using this pattern:**
- **Claude Code / Claude Agent SDK**: The SDK runs a straightforward ReAct loop -- Claude evaluates the prompt, calls tools to take action, receives the results, and repeats until the task is complete. "Steps 2 and 3 repeat as a cycle. Each full cycle is one turn" [How the agent loop works - Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/agent-loop). The loop ends when Claude produces output with no tool calls.
- **OpenAI Codex CLI**: Follows the same pattern -- user input becomes a prompt, the model generates a response or tool call, the tool executes in a sandbox, and results feed back [Codex CLI - OpenAI Developers](https://developers.openai.com/codex/cli/). Written in Rust for performance [How Codex is Built - Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-codex-is-built).
- **OpenAI Agents SDK**: The Runner executes a structured loop: call LLM, check if output is final (text with no tool calls), if not process tool calls or handoffs and re-run [Running Agents - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/running_agents/). Exceeding `max_turns` raises a `MaxTurnsExceeded` exception.
- **smolagents (Hugging Face)**: Implements a ReAct-based `MultiStepAgent` where each step the agent thinks, acts, and observes. The `CodeAgent` variant generates Python code for actions, while `ToolCallingAgent` uses JSON tool calls [smolagents Guided Tour](https://huggingface.co/docs/smolagents/en/guided_tour). The logic fits in approximately 1,000 lines of code [smolagents GitHub](https://github.com/huggingface/smolagents).
- **Pydantic AI**: Agents reason, call tools, observe results, and reason again in a stochastic loop with type-safe validation at each step [Pydantic AI Docs](https://ai.pydantic.dev/).
- **Cline**: An open-source VS Code extension that "takes a series of steps, evaluates the result, fixes its own issues, and continues" with human-in-the-loop approval for every file change [Cursor vs Windsurf vs Cline - UI Bakery](https://uibakery.io/blog/cursor-vs-windsurf-vs-cline).

**Trade-offs** (Confidence: HIGH):
- Strengths: Self-correcting when unexpected errors occur; tight feedback loop; simple to implement; adaptable to dynamic tasks [ReAct vs Plan-and-Execute - DEV Community](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9).
- Weaknesses: Each cycle requires sending the full conversation history, accumulating tokens; 2,000-3,000 tokens average per task with 3-5 API calls typical; risk of context window exhaustion on long tasks [ReAct vs Plan-and-Execute - DEV Community](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9).

---

### 2. Plan-then-Execute

**Structure:** `Analyze Goal -> Generate Full Plan -> Execute Steps Sequentially -> (Replan if needed)`

The agent commits to a complete strategy before taking any action. A planning phase decomposes the task into subtasks, then an executor tackles each step sequentially, with optional replanning based on intermediate results [LangChain Blog - Planning Agents](https://blog.langchain.com/planning-agents/).

**Frameworks using this pattern:**
- **Semantic Kernel (historical)**: Originally used a `FunctionCallingStepwisePlanner` that planned the full sequence, then executed. The stepwise and Handlebars planners have since been deprecated in favor of Auto Function Calling (`FunctionChoiceBehavior.Auto()`), which is essentially a ReAct-style loop [What are Planners - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning). This is a notable convergence toward ReAct.
- **GSD (Get Shit Done)**: Uses a four-phase funnel -- discuss, plan, execute, verify -- where the planning prompt performs gap analysis and generates a prioritized TODO list with no implementation, then the building prompt implements tasks [GSD Deep Dive - Codecentric](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system).
- **Aider (Architect Mode)**: Separates reasoning from editing in a two-phase process. An "Architect" model describes how to solve the problem, then an "Editor" model translates that into specific code edits. This achieved 85% pass rate with o1-preview + DeepSeek pairing [Separating Code Reasoning and Editing - Aider](https://aider.chat/2024/09/26/architect.html).

**Trade-offs** (Confidence: HIGH):
- Strengths: Enforces explicit long-term planning; enables different models for different stages (strong reasoner for planning, fast model for execution); 92% completion rate vs 85% for ReAct [ReAct vs Plan-and-Execute - DEV Community](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9).
- Weaknesses: 3,000-4,500 tokens average, 5-8 API calls typical, $0.09-0.14 per task (vs $0.06-0.09 for ReAct); if the initial plan is flawed, the executor may not recover without explicit replanning logic [ReAct vs Plan-and-Execute - DEV Community](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9).

---

### 3. State Machine / Graph-Based Orchestration

**Structure:** `Define Nodes (agents/functions) -> Define Edges (transitions/conditions) -> Compile Graph -> Execute with State Passing`

The workflow is modeled as a directed graph where nodes represent agents, functions, or decision points, and edges dictate data flow. State is a typed schema passed between nodes, with conditional edges routing execution based on the current state [LangGraph Architecture - Medium](https://medium.com/@shuv.sdr/langgraph-architecture-and-design-280c365aaf2c).

**Frameworks using this pattern:**
- **LangGraph**: The canonical example. Developers define nodes as functions, edges as transitions (standard or conditional), and a centralized `StateGraph` maintains context. Before execution, the graph undergoes compilation that validates connections, identifies cycles, and optimizes paths. The compiled graph becomes immutable [LangGraph AI Framework 2025 - Latenode](https://latenode.com/blog/ai-frameworks-technical-infrastructure/langgraph-multi-agent-orchestration/langgraph-ai-framework-2025-complete-architecture-guide-multi-agent-orchestration-analysis). Supports loops (cycles in the graph) with safeguards against infinite loops.
- **Mastra**: Uses a graph-based workflow engine with intuitive syntax (`.then()`, `.branch()`, `.parallel()`). Workflows are DAGs where steps can be agents, simple functions, or control flow logic [Mastra Docs](https://mastra.ai/docs). Separates "workflow agents" (deterministic graph execution) from individual agents (ReAct-style tool-calling loops).
- **Google ADK**: Offers workflow agents (Sequential, Parallel, Loop) for deterministic pipelines alongside LLM-driven dynamic routing for adaptive decision-making [Definitive Guide to Agentic Frameworks 2026 - Softmax](https://blog.softmaxdata.com/definitive-guide-to-agentic-frameworks-in-2026-langgraph-crewai-ag2-openai-and-more/).

**Trade-offs** (Confidence: HIGH):
- Strengths: Finest-grained control over execution; explicit state management; supports durable execution with crash-and-resume; cleanly expresses loops, branches, and parallel execution [LangGraph Review - Sider](https://sider.ai/blog/ai-tools/langgraph-review-is-the-agentic-state-machine-worth-your-stack-in-2025).
- Weaknesses: Higher development complexity; abstraction layers can obscure implementation details; overkill for simple single-agent tasks [AI Agent Frameworks Compared - Arsum](https://arsum.com/blog/posts/ai-agent-frameworks/).

---

### 4. Conversation-Driven Multi-Agent Orchestration

**Structure:** `Define Agents with Roles -> Establish Communication Channel (GroupChat/Swarm) -> Agents Exchange Messages -> Coordinator Synthesizes`

Multiple agents participate in a shared conversation, each contributing specialized knowledge. A coordinator or turn-taking protocol determines which agent speaks next [AI Agent Frameworks Compared - Arsum](https://arsum.com/blog/posts/ai-agent-frameworks/).

**Frameworks using this pattern:**
- **AG2 (formerly AutoGen)**: Centers on `ConversableAgent` instances that talk to each other in structured conversations. AG2 v0.9 unified the previous GroupChat and Swarm into a single GroupChat pattern with multiple orchestration modes: `AutoPattern` (LLM-selected next speaker), `RoundRobinPattern`, `RandomPattern`, and `ManualPattern` [AG2 v0.9 Release](https://docs.ag2.ai/latest/docs/blog/2025/04/28/0.9-Release-Announcement/). Includes handoff mechanisms where agents can transfer control to another agent, revert to user, stay for another iteration, or terminate [Building Swarm-based agents with AG2](https://docs.ag2.ai/latest/docs/blog/2024/11/17/Swarm/).
- **Semantic Kernel (Group Chat / Magentic)**: Supports five orchestration patterns: Concurrent (broadcast task to all agents), Sequential (pass results in order), Handoff (dynamic control transfer), Group Chat (coordinated group conversation), and Magentic (inspired by MagenticOne for complex generalist collaboration) [Semantic Kernel Agent Orchestration - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/).

**Trade-offs** (Confidence: MEDIUM):
- Strengths: Excels in scenarios requiring deep negotiation; natural for brainstorming and collaborative problem-solving; each agent maintains its own specialized context [Comparing Open-Source AI Agent Frameworks - Langfuse](https://langfuse.com/blog/2025-03-19-ai-agent-comparison).
- Weaknesses: Communication overhead between agents; verbose for single-agent scenarios; harder to debug than single-loop approaches; steeper learning curve [AI Agent Frameworks Compared - Arsum](https://arsum.com/blog/posts/ai-agent-frameworks/).

---

### 5. Role-Based Sequential/Hierarchical Orchestration

**Structure:** `Define Agents with Roles/Backstories -> Assign Tasks -> Execute (Sequential or Manager-Delegated)`

Agents are organized as a "crew" where each has a defined role. In sequential mode, tasks execute in order with output flowing as context. In hierarchical mode, a manager agent coordinates, delegates, and validates [Sequential Processes - CrewAI](https://docs.crewai.com/en/learn/sequential-process).

**Frameworks using this pattern:**
- **CrewAI**: The primary example. Sequential process executes tasks in predefined order. Hierarchical process introduces a manager agent that allocates tasks based on agent capabilities, reviews outputs, and assesses completion. Tasks are not pre-assigned in hierarchical mode [Hierarchical Process - CrewAI](https://docs.crewai.com/how-to/hierarchical-process). Senior agents can override junior decisions and redistribute resources [CrewAI Framework 2025 - Latenode](https://latenode.com/blog/ai-frameworks-technical-infrastructure/crewai-framework/crewai-framework-2025-complete-review-of-the-open-source-multi-agent-ai-platform).
- **MetaGPT**: Uses role-based message passing to a shared pool with structured input/output and role persistence [AI Agent Frameworks Compared - Arsum](https://arsum.com/blog/posts/ai-agent-frameworks/).

**Trade-offs** (Confidence: HIGH):
- Strengths: Fastest development speed; intuitive mental model (team metaphor); high-level abstractions handle orchestration automatically [Definitive Guide to Agentic Frameworks 2026 - Softmax](https://blog.softmaxdata.com/definitive-guide-to-agentic-frameworks-in-2026-langgraph-crewai-ag2-openai-and-more/).
- Weaknesses: Less granular control than graph-based approaches; trades explicit control for rapid deployment; harder to customize execution flow [Definitive Guide to Agentic Frameworks 2026 - Softmax](https://blog.softmaxdata.com/definitive-guide-to-agentic-frameworks-in-2026-langgraph-crewai-ag2-openai-and-more/).

---

### 6. Handoff-Based Agent Routing

**Structure:** `Agent A processes -> Determines next agent -> Hands off with context -> Agent B continues`

**Frameworks using this pattern:**
- **OpenAI Agents SDK**: Provides five core primitives -- Agents, Handoffs, Guardrails, Sessions, Tracing. The Runner processes: first agent calls LLM, runs tools, does a handoff to a second agent, second agent runs more tools, produces output [Running Agents - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/running_agents/).
- **Semantic Kernel (Handoff pattern)**: Dynamically passes control between agents based on context or rules for escalation, fallback, or expert handoff scenarios [Semantic Kernel Agent Orchestration - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/).

**Trade-offs** (Confidence: MEDIUM):
- Strengths: Clean composition model; each agent has focused scope; simple mental model; easy tracing.
- Weaknesses: Limited orchestration sophistication for complex workflows; handoff decisions depend on agent reasoning quality.

---

### 7. ReWOO (Reasoning Without Observation)

**Structure:** `Generate complete tool-usage script with placeholders -> Execute tools sequentially -> Final synthesis`

The model generates a complete tool-usage plan in a single pass with placeholder variables (#E1, #E2) referencing future results. After planning concludes, an executor runs tools sequentially, then a final synthesis step produces the answer [Navigating Modern LLM Agent Architectures](https://www.wollenlabs.com/blog-posts/navigating-modern-llm-agent-architectures-multi-agents-plan-and-execute-rewoo-tree-of-thoughts-and-react).

**Trade-offs** (Confidence: MEDIUM):
- Strengths: Reduces token consumption and latency through upfront planning; avoids repeated prompt overhead.
- Weaknesses: Sacrifices adaptability -- unexpected results during execution may derail the predefined sequence; best for routine, templatable workflows.

---

### 8. Context-Isolated Parallel Orchestration (Emerging)

**Structure:** `Orchestrator spawns specialized agents -> Each gets fresh context window -> Agents communicate via files/artifacts -> Orchestrator synthesizes`

**Frameworks using this pattern:**
- **GSD**: Deploys four parallel researchers, a planner, wave-based parallel executors, and verifiers. Each execution unit receives its own fresh context window built from project artifacts rather than accumulated chat history, directly addressing "context rot" [GSD Deep Dive - Codecentric](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system).
- **Claude Code (subagents)**: Each subagent starts with a fresh conversation (no prior message history). Only its final response returns to the parent as a tool result, keeping the main agent's context lean [How the agent loop works - Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/agent-loop).
- **Claude Code / Codex (Agent Teams, Feb 2026)**: Both support multi-agent workflows where sub-agents each get a dedicated context window. They share a task list with dependency tracking and can message each other [Codex vs Claude Code 2026 - Leanware](https://www.leanware.co/insights/codex-vs-claude-code).

**Trade-offs** (Confidence: MEDIUM):
- Strengths: Eliminates context rot; enables true parallelism; each agent has full context budget for its subtask.
- Weaknesses: Communication limited to file artifacts; coordination overhead; requires careful dependency management.

---

## Comparison Table

| Pattern | Control Granularity | Setup Complexity | Adaptability | Token Efficiency | Multi-Step Tasks | Example Frameworks |
|---|---|---|---|---|---|---|
| **ReAct** | Low (model decides) | Low | High (self-correcting) | Low (accumulates history) | Good | Claude Code, Codex CLI, OpenAI Agents SDK, smolagents, Pydantic AI, Cline |
| **Plan-then-Execute** | Medium (plan constrains) | Medium | Medium (requires replan) | Medium | Very Good | Aider (Architect), GSD (plan phase), historical SK |
| **State Machine/Graph** | Very High (developer defines) | High | Medium (predefined paths) | High (scoped state) | Excellent | LangGraph, Mastra, Google ADK |
| **Conversation Multi-Agent** | Medium (coordinator manages) | High | High (emergent) | Low (shared context) | Good | AG2/AutoGen, Semantic Kernel |
| **Role-Based Hierarchical** | Medium (manager delegates) | Low-Medium | Medium | Medium | Good | CrewAI, MetaGPT |
| **Handoff Routing** | Medium (handoff rules) | Low | Medium | Medium | Good | OpenAI Agents SDK, Semantic Kernel |
| **ReWOO** | Low (single-pass plan) | Low | Low (no mid-execution adaptation) | Very High | Limited | Research implementations |
| **Context-Isolated Parallel** | High (orchestrator controls) | High | Medium | High (fresh windows) | Excellent | GSD, Claude Code subagents |

## Convergence Trends (Confidence: HIGH)

Multiple sources confirm a convergence toward graph-based orchestration. LangGraph pioneered it, but CrewAI, AutoGen v0.4/AG2, and others are adopting graph or workflow-based execution models because "graphs cleanly express loops, branches, and parallel execution -- the building blocks of agent behavior" [AI Agent Frameworks Compared - Arsum](https://arsum.com/blog/posts/ai-agent-frameworks/). Simultaneously, frameworks that started with explicit planning (Semantic Kernel's stepwise planner) have deprecated those approaches in favor of ReAct-style auto function calling [What are Planners - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning). This suggests a middle ground is forming: graph-based structure for workflow control with ReAct-style loops at individual nodes.

**Conflicting information noted:** Some sources describe LangGraph as strictly DAG-based, while LangGraph's own documentation emphasizes support for cycles (loops), making it a directed graph with cycle support rather than a strict DAG.

## CLI/Coding Agent Harness Specifics

The CLI/coding agent harnesses overwhelmingly use **ReAct as their core inner loop**, with differentiation happening at higher levels:

- **Claude Code**: Pure ReAct loop with subagent delegation for context isolation. Built in TypeScript.
- **Codex CLI**: Same ReAct loop with sandboxed tool execution. Built in Rust.
- **Aider**: ReAct for standard mode; two-phase Plan-then-Execute in Architect mode.
- **Cursor (Agent Mode)**: ReAct with plan, edit, diff, approval cycle.
- **Windsurf (Cascade)**: ReAct with persistent "Flow" context across sessions.
- **GSD**: Higher-level Discuss-Plan-Execute-Verify orchestration wrapping context-isolated parallel agents.

## Key Unknowns

1. **Detailed internal loop implementation of Cursor and Windsurf**: These are closed-source products and their exact agent loop architectures are not publicly documented.
2. **Quantitative performance comparisons across patterns**: Independent benchmarks comparing all patterns under controlled conditions are scarce.
3. **Continue/Cline deep architecture**: Detailed architectural documentation of Cline's internal reasoning loop beyond "step-evaluate-fix-continue" was not found.
4. **Mastra's internal agent loop**: The details of how individual Mastra agents internally iterate require deeper source code inspection.
5. **Real-world performance of ReWOO vs ReAct at scale**: Production deployment data is limited.
6. **How the emerging Agent Teams/Swarm patterns (Feb 2026) compare in practice**: Too recent for independent evaluation data.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 20+
