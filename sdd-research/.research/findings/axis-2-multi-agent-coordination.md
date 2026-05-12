# Axis 2: Multi-Agent Coordination & Orchestration

## Question
How do frameworks handle multi-agent orchestration — fan-out/fan-in, hierarchical delegation, peer-to-peer, shared memory, supervisor patterns? Where do they agree/diverge?

## Findings

### 1. Core Orchestration Patterns: A Taxonomy

The landscape of multi-agent orchestration has converged around a small set of recognizable coordination primitives, though frameworks implement them with strikingly different abstractions.

#### Supervisor / Hierarchical Delegation

This is the most widely adopted pattern. A central orchestrator receives a task, decomposes it into subtasks, delegates to specialized agents, monitors progress, validates outputs, and synthesizes a final response [AI Agent Orchestration Patterns - Microsoft Azure](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns). **Confidence: High.**

- **LangGraph** implements this via its `langgraph-supervisor` package, where a supervisor agent coordinates specialized sub-agents, each with their own scratchpad, while the supervisor orchestrates communication and delegates based on capabilities [LangGraph Supervisor - GitHub](https://github.com/langchain-ai/langgraph-supervisor-py).
- **CrewAI** offers a `hierarchical` process mode that automatically assigns a manager agent to the crew. The manager breaks the main problem into smaller sub-tasks and assigns them to specialist agents. CrewAI enforces strict hub-and-spoke communication: all subagents communicate only with the orchestrator, never directly with each other [Hierarchical AI Agents: A Guide to CrewAI Delegation](https://activewizards.com/blog/hierarchical-ai-agents-a-guide-to-crewai-delegation).
- **Semantic Kernel** provides `GroupChatOrchestration` and `HandoffOrchestration` patterns where a group manager coordinates agents, deciding who speaks next and when the conversation is done [Semantic Kernel Agent Orchestration - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/).
- **Claude Code** uses an orchestrator agent that decomposes tasks and delegates to subagents running in isolated context windows, each with custom system prompts, specific tool access, and independent permissions [Create custom subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents).
- **Mastra** introduced a first-class supervisor pattern in February 2026 for orchestrating multiple agents, where the supervisor coordinates delegation, tracks iterations, evaluates completion, and keeps each agent's memory isolated [Mastra Agent Network vNext](https://mastra.ai/blog/vnext-agent-network).
- **Google ADK** supports a coordinator/dispatcher pattern where a central LLM agent routes to specialists via `transfer_to_agent()` calls or by wrapping agents as callable tools via `AgentTool` [Multi-agent systems - Google ADK](https://google.github.io/adk-docs/agents/multi-agents/).
- **OpenAI Codex** app orchestrates spawning specialized agents in parallel, routing follow-up instructions, waiting for results, and closing agent threads; it also provides built-in roles (`default`, `worker`, `explorer`, `monitor`) [Codex Multi-Agent Docs](https://developers.openai.com/codex/multi-agent/).

#### Fan-Out / Fan-In (Scatter-Gather / Map-Reduce)

A dispatcher distributes a task to multiple agents running in parallel (fan-out), then an aggregator collects and synthesizes the results (fan-in). **Confidence: High.**

- **LangGraph** natively supports fan-out and fan-in using regular or conditional edges. Nodes within a "superstep" execute concurrently and must all complete before the graph proceeds. The `Send` API enables dynamic, runtime task creation for map-reduce patterns [LangGraph Branching - Best Practices](https://forum.langchain.com/t/best-practices-for-parallel-nodes-fanouts/1900). LangGraph also introduced "deferred node execution" to support nodes that run only after all parallel branches complete [LangGraph Deferred Nodes](https://changelog.langchain.com/announcements/deferred-nodes-in-langgraph).
- **Semantic Kernel** offers `ConcurrentOrchestration` that broadcasts a task to all agents and collects results independently, designed for parallel analysis, independent subtasks, and ensemble decision-making [Semantic Kernel Agent Orchestration - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/).
- **Google ADK** provides `ParallelAgent` which executes sub-agents simultaneously while sharing session state. Each agent writes its data to a unique key to prevent race conditions. An aggregator agent then reads all keys [Multi-agent systems - Google ADK](https://google.github.io/adk-docs/agents/multi-agents/).
- **Mastra** provides concurrent steps through `.parallel()` control flow constructs and map steps over arrays [Mastra Workflows](https://mastra.ai/workflows).
- **Claude Code Agent Teams** supports parallel work through a shared task list. The lead creates tasks and teammates claim and work through them independently, each in their own context window. Results are synthesized by the lead [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams).
- **OpenAI Codex** supports batch processing through `spawn_agents_on_csv` which reads a CSV, spawns one worker agent per row, waits for completion, and exports combined results [Codex Multi-Agent Docs](https://developers.openai.com/codex/multi-agent/).
- **OpenAI Agents SDK** supports running multiple agents in parallel via `asyncio.gather` for independent tasks [Agent orchestration - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent/).

#### Handoff / Routing

An agent transfers control of the conversation to another agent, typically a specialist. The specialist becomes the active agent. **Confidence: High.**

- **OpenAI Agents SDK** treats handoffs as first-class primitives. Handoffs are represented as tools to the LLM (e.g., `transfer_to_refund_agent`). The triage agent routes the conversation and the specialist becomes the active agent for the rest of the turn [Handoffs - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/handoffs/).
- **AG2 (AutoGen)** defines `OnCondition` rules for explicit handoffs and `after_work` handoffs that specify what happens after an agent completes its task--hand off to another agent, revert to user, stay, or terminate [AG2 Orchestration Patterns](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/patterns/).
- **Semantic Kernel** provides `HandoffOrchestration` that dynamically passes control between agents based on context or rules, suitable for escalation, fallback, or expert handoff scenarios [Semantic Kernel Agent Orchestration - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/).
- **Google ADK** uses LLM-driven delegation where an agent generates `transfer_to_agent(agent_name='target')` and the framework intercepts and routes execution [Multi-agent systems - Google ADK](https://google.github.io/adk-docs/agents/multi-agents/).
- **Pydantic AI** supports "Programmatic Agent Hand-Off" where application code explicitly routes between agents sequentially, supporting multi-turn conversations with message history preservation [Multi-Agent Patterns - Pydantic AI](https://ai.pydantic.dev/multi-agent-applications/).

#### Peer-to-Peer / Group Chat

Multiple agents participate in a shared conversation, with some mechanism for deciding who speaks next. **Confidence: High.**

- **AG2 (AutoGen)** is the most comprehensive here, providing five group chat patterns: `DefaultPattern` (explicit handoffs only), `AutoPattern` (LLM selects next speaker), `RoundRobinPattern` (fixed rotation), `RandomPattern` (random selection), and `ManualPattern` (user selects) [AG2 Orchestration Patterns](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/patterns/). In v0.9, AG2 unified its Group Chat and Swarm patterns into a single architecture [AG2 v0.9 Release](https://docs.ag2.ai/latest/docs/blog/2025/04/28/0.9-Release-Announcement/).
- **Semantic Kernel** offers `GroupChatOrchestration` where all agents are present simultaneously and can respond to each other with shared chat history. A `KernelFunctionSelectionStrategy` enables selection of the next agent based on a kernel function. It also provides `MagenticOrchestration` inspired by Microsoft Research's MagenticOne for complex generalist multi-agent collaboration [Semantic Kernel Agent Orchestration - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/).
- **Claude Code Agent Teams** allow teammates to message each other directly, share a task list, claim work, and communicate without going through the lead, making it a rare example of genuine peer-to-peer communication in a coding agent [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams).

#### Agent-as-Tool (Nested Invocation)

One agent calls another as if it were a tool, keeping a single thread of control. The sub-agent does not take over the conversation. **Confidence: High.**

- **OpenAI Agents SDK** provides `Agent.as_tool()` where a manager agent keeps control of the conversation and calls specialist agents as tools. The sub-agent's result returns to the manager [Agent orchestration - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent/).
- **Pydantic AI** implements agent delegation where one agent invokes another through a tool function, maintaining hierarchical control. Usage is tracked across the delegation chain via `ctx.usage` [Multi-Agent Patterns - Pydantic AI](https://ai.pydantic.dev/multi-agent-applications/).
- **smolagents** wraps agents in `ManagedAgent` objects that are callable by a manager agent. The managed agents appear as tools in the manager's system prompt. The documentation explicitly recommends using `CodeAgent` for the manager and `ToolCallingAgent` for managed web search agents [Orchestrate a multi-agent system - smolagents](https://huggingface.co/docs/smolagents/examples/multiagents).
- **Google ADK** provides `AgentTool` that wraps another agent as a callable tool, executing the target agent synchronously and returning results as tool output [Multi-agent systems - Google ADK](https://google.github.io/adk-docs/agents/multi-agents/).

#### Sequential Pipeline

Agents run in a defined linear order, each processing the output of the previous one. **Confidence: High.**

- **Semantic Kernel** provides `SequentialOrchestration` that passes results from one agent to the next [Semantic Kernel Agent Orchestration - Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/).
- **Google ADK** provides `SequentialAgent` that executes sub-agents one after another in the listed order, sharing the same context [Multi-agent systems - Google ADK](https://google.github.io/adk-docs/agents/multi-agents/).
- **Mastra** provides sequential execution through `.then()` control flow constructs [Mastra Workflows](https://mastra.ai/workflows).
- **Aider** uses a two-step architect/editor pipeline where the request first goes to a main model acting as an "architect" to propose a solution, then to an "editor model" to turn the proposal into specific file editing instructions [Chat modes - Aider](https://aider.chat/docs/usage/modes.html).

#### Iterative / Loop

Agents run in cycles until a quality threshold or condition is met. **Confidence: High.**

- **Google ADK** provides `LoopAgent` that iterates sub-agents sequentially until `max_iterations` is reached or an agent signals `escalate=True` [Multi-agent systems - Google ADK](https://google.github.io/adk-docs/agents/multi-agents/).
- **OpenAI Agents SDK** describes looping between execution and evaluation agents until criteria pass as a code-based orchestration pattern [Agent orchestration - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent/).
- **Semantic Kernel** supports a maker-checker loop (a group chat variant) where one agent creates and another evaluates against defined criteria [AI Agent Orchestration Patterns - Microsoft Azure](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns).

---

### 2. Shared Memory vs. Isolated Context

This is one of the most significant architectural divergences across frameworks. **Confidence: High.**

- **LangGraph**: Explicit shared state. Each agent reads from and writes to a central state object. Reducer logic merges concurrent updates. Provides checkpointing and replay [LangGraph vs AutoGen vs CrewAI - Latenode](https://latenode.com/blog/platform-comparisons-alternatives/automation-platform-comparisons/langgraph-vs-autogen-vs-crewai-complete-ai-agent-framework-comparison-architecture-analysis-2025).
- **AG2 (AutoGen)**: Context Variables provide shared memory for agents within a group chat. All agents see the same context dictionary, enabling shared workflow state [Context Variables - AG2](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/context-variables/).
- **CrewAI**: Shared crew context, but tasks are isolated per role. A failure in one agent does not corrupt others' plans [CrewAI Open Source](https://crewai.com/open-source).
- **Google ADK**: Agents within the same invocation share `session.state`. Parallel agents must write to unique keys to avoid race conditions [Multi-agent systems - Google ADK](https://google.github.io/adk-docs/agents/multi-agents/).
- **Claude Code**: Subagents run in fully isolated context windows. Only relevant information is sent back to the orchestrator. Agent Teams are even more isolated -- each teammate is a separate Claude Code instance with its own context window [Create custom subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents).
- **Mastra**: Supervisor keeps each agent's memory isolated so parallel work does not pollute shared context [Mastra Agent Network vNext](https://mastra.ai/blog/vnext-agent-network).
- **smolagents**: Managed agents have separate tool sets and memories, allowing efficient specialization. Each subagent works independently and returns results [Orchestrate a multi-agent system - smolagents](https://huggingface.co/docs/smolagents/examples/multiagents).
- **Pydantic AI**: Agents are stateless and designed globally. Different agents can use different models and dependencies [Multi-Agent Patterns - Pydantic AI](https://ai.pydantic.dev/multi-agent-applications/).

---

### 3. CLI/Coding Agent Harnesses: A Special Case

CLI coding agents have converged on a distinctive variant of multi-agent orchestration that prioritizes git isolation and context preservation over conversational coordination. **Confidence: High.**

- **Claude Code** distinguishes between subagents (within a single session, isolated context, results return to caller) and agent teams (separate sessions, shared task list, direct inter-agent messaging). Subagents cannot spawn other subagents, preventing infinite nesting [Create custom subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents) [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams).
- **OpenAI Codex** spawns specialized agents in parallel within cloud sandboxes, each preloaded with the repository. Sub-agents inherit the parent session's sandbox policy [Codex Multi-Agent Docs](https://developers.openai.com/codex/multi-agent/).
- **Aider** uses a minimal two-agent pipeline (architect + editor) rather than full multi-agent orchestration. A feature request for deeper multi-agent support exists but has not been implemented [Chat modes - Aider](https://aider.chat/docs/usage/modes.html).
- **Cline** deliberately avoids multi-agent orchestration, calling it one of "3 pervasive patterns in coding agent development that we deliberately avoid." Its subagents are read-only research agents that cannot write files [Cline on X](https://x.com/cline/status/1960175630907306325) [Subagents - Cline](https://docs.cline.bot/features/subagents).
- **Windsurf** added multi-agent sessions and Git worktrees in Wave 13 (early 2026) [AI Coding Agents 2026 Comparison - Lushbinary](https://www.lushbinary.com/blog/ai-coding-agents-comparison-cursor-windsurf-claude-copilot-kiro-2026/).
- **Antigravity** (Google's agent-first IDE) launched with multi-agent orchestration as its defining feature -- multiple specialized agents working in parallel across editor, terminal, and browser [Agentic IDE Comparison - Codecademy](https://www.codecademy.com/article/agentic-ide-comparison-cursor-vs-windsurf-vs-antigravity).

---

### 4. Comparison Table: Coordination Primitives Per Framework

| Framework | Supervisor / Hierarchical | Fan-Out / Fan-In | Handoff / Routing | Peer-to-Peer / Group Chat | Agent-as-Tool | Sequential Pipeline | Loop / Iterative | Shared State | Context Isolation |
|---|---|---|---|---|---|---|---|---|---|
| **LangGraph** | Yes (supervisor pkg) | Yes (Send API, supersteps) | Yes (conditional edges) | Partial (via subgraph) | No (native) | Yes (linear graph) | Yes (cycles) | Shared state object w/ reducers | Per-subgraph |
| **CrewAI** | Yes (hierarchical process) | Limited | No explicit | No (hub-and-spoke only) | No | Yes (sequential process) | No | Shared crew context | Per-task isolation |
| **AG2 (AutoGen)** | Yes (DefaultPattern) | Partial | Yes (OnCondition) | Yes (5 patterns) | No | Yes | No native | Context Variables (shared dict) | Per-conversation |
| **Semantic Kernel** | Yes (GroupChat mgr) | Yes (ConcurrentOrch.) | Yes (HandoffOrch.) | Yes (GroupChatOrch., Magentic) | No | Yes (SequentialOrch.) | Yes (maker-checker) | Via orchestration runtime | Per-orchestration |
| **OpenAI Agents SDK** | Partial (agent-as-tool) | Yes (asyncio.gather) | Yes (handoffs) | No | Yes (Agent.as_tool) | Yes (chaining) | Yes (eval loop) | No shared state | Isolated per agent |
| **Claude Agent SDK / Code** | Yes (subagents, teams) | Yes (teams, bg subagents) | No explicit | Yes (agent teams) | Yes (subagent delegation) | Yes (chained subagents) | No native | No (isolated) | Strong isolation |
| **Pydantic AI** | Yes (delegation) | No native | Yes (programmatic) | No | Yes (tool function) | Yes (programmatic) | No native | Stateless agents | Isolated |
| **smolagents** | Yes (managed agents) | No native | No | No | Yes (ManagedAgent) | No native | No | Separate memories | Isolated |
| **Mastra** | Yes (supervisor) | Yes (.parallel()) | Yes (Agent Network) | No | No native | Yes (.then()) | Yes (loops) | Isolated per agent | Strong isolation |
| **Google ADK** | Yes (coordinator) | Yes (ParallelAgent) | Yes (transfer_to_agent) | No | Yes (AgentTool) | Yes (SequentialAgent) | Yes (LoopAgent) | Shared session.state | Per-agent unique keys |
| **Aider** | Architect/Editor only | No | No | No | No | Yes (2-step pipeline) | No | N/A | N/A |
| **Cline** | Read-only subagents | Limited (parallel procs) | No | No | No | No | No | N/A | Isolated |
| **Codex** | Yes (orchestrator) | Yes (spawn_agents_on_csv) | Yes (routing) | No | No | Yes | No native | Inherited sandbox policy | Cloud sandbox isolation |

---

### 5. Where Frameworks Agree

- **Supervisor pattern is universal.** Every framework with multi-agent support implements some form of hierarchical delegation. This is the lowest common denominator of multi-agent orchestration [AI Agent Orchestration Patterns - Microsoft Azure](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns).
- **Agents-as-tools is the simplest multi-agent primitive.** OpenAI Agents SDK, Pydantic AI, smolagents, and Google ADK all converge on wrapping agents as callable tools for nested invocation with single-thread-of-control semantics.
- **Context isolation is the default for production.** Claude Code, Mastra, smolagents, and Pydantic AI all default to isolated agent contexts. Even shared-state frameworks like LangGraph use reducer logic to manage concurrent updates safely.
- **Handoff semantics are converging.** OpenAI, AG2, Semantic Kernel, and Google ADK all use similar "transfer to agent X" primitives, though the implementations differ (tool calls in OpenAI, conditional edges in LangGraph, OnCondition in AG2).

### 6. Where Frameworks Diverge

- **Shared state vs. isolated context** is the deepest architectural divide. LangGraph and Google ADK provide explicit shared state objects. AG2 provides shared context variables. CrewAI shares crew context but isolates per-task. Claude Code, smolagents, and Mastra enforce strict isolation. This reflects fundamentally different assumptions about whether agents should coordinate via shared memory or message passing.
- **Peer-to-peer communication** is rare. Only AG2 (group chat patterns) and Claude Code Agent Teams (inter-teammate messaging) support genuine peer-to-peer agent communication. CrewAI explicitly forbids it. Most frameworks enforce hub-and-spoke or hierarchical communication.
- **Fan-out/fan-in sophistication varies enormously.** LangGraph provides the most sophisticated primitives (Send API, supersteps, deferred nodes). Google ADK provides clean `ParallelAgent`. Most other frameworks rely on language-level concurrency (asyncio) or external coordination.
- **CLI coding agents are conservative.** Aider uses only a 2-agent pipeline. Cline deliberately rejects multi-agent orchestration. Claude Code provides both subagents and agent teams but treats them as opt-in features. This contrasts sharply with general-purpose frameworks where multi-agent is a core selling point.
- **Dynamic vs. static orchestration.** LangGraph, AG2, and Google ADK support dynamic routing decisions at runtime (LLM decides next agent). CrewAI, Semantic Kernel's SequentialOrchestration, and Aider use static, predetermined patterns. Mastra's Agent Network explicitly embraces "the AI defines the execution plan, not you" [Mastra Agent Network vNext](https://mastra.ai/blog/vnext-agent-network).

---

### 7. Key Unknowns

- **Performance benchmarks for orchestration patterns.** No standardized benchmarks exist for comparing supervisor vs. peer-to-peer vs. fan-out/fan-in on equivalent tasks. Claims about "better performance" from any pattern are anecdotal.
- **Cursor's internal multi-agent architecture.** Cursor 2.0 introduced a subagent system for parallel task processing, but detailed documentation on its orchestration internals is not publicly available.
- **Windsurf's multi-agent implementation details.** Wave 13 added multi-agent sessions but architectural details beyond marketing descriptions are scarce.
- **Token cost comparisons across orchestration patterns.** Claude Code documents that agent teams use "significantly more tokens" than single sessions, but systematic cost comparisons across frameworks and patterns do not exist in the public literature.
- **How frameworks handle agent failure and recovery in multi-agent settings.** CrewAI mentions retry/reassignment on failure, but most frameworks do not document failure recovery strategies for multi-agent scenarios in depth.
- **Interoperability between frameworks.** The A2A (Agent-to-Agent) protocol and OpenAgents are early efforts, but cross-framework agent orchestration remains largely unsolved in practice.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 25+
