# Research Report: SOTA Agent Harness Landscape

*Generated: 2026-03-12*
*Research scope: Architecture patterns, commonalities, and divergences across modern AI agent frameworks, with emphasis on CLI/coding agent harnesses*

## Executive Summary

The AI agent framework landscape in early 2026 has converged on several foundational patterns -- ReAct as the baseline agent loop, MCP as the universal tool protocol (97M+ monthly downloads), OpenTelemetry for observability, and human-in-the-loop as a deployment requirement -- while remaining deeply divided on orchestration philosophy (workflow graphs vs. open-loop autonomy), multi-agent utility (empirical evidence vs. market momentum), and the right level of framework abstraction. CLI/coding agents have emerged as a distinct architectural subspecies, preferring context isolation, git-based rollback, and test-driven verification over the shared-state and conversational coordination patterns favored by general-purpose frameworks. The field is maturing rapidly, with LangGraph reaching 1.0 GA and the A2A protocol nearing v1.0, but cross-framework interoperability, standardized benchmarks, and reliable long-context agent execution remain open problems.

## Key Findings

1. **ReAct is table stakes, not a differentiator.** Every major framework implements Reason-Act-Observe as its baseline execution pattern. Differentiation happens at higher orchestration layers. [AI Agent Frameworks Compared -- Arsum](https://arsum.com/blog/posts/ai-agent-frameworks/)

2. **MCP has won the agent-to-tool layer.** With 97 million monthly SDK downloads and adoption by every major AI provider, MCP is the universal tool interoperability standard. Agent-to-agent communication (A2A) remains contested. [MCP vs A2A Guide -- DEV Community](https://dev.to/pockit_tools/mcp-vs-a2a-the-complete-guide-to-ai-agent-protocols-in-2026-30li)

3. **External verification outperforms self-reflection.** Research shows that without external feedback, LLM self-correction consistently *decreases* accuracy. The most effective agent systems invest in test execution, linting, and schema validation rather than introspective self-critique. [The Research on LLM Self-Correction -- Vadim's Blog](https://vadim.blog/the-research-on-llm-self-correction)

4. **Shared state vs. isolated context is the deepest architectural divide.** LangGraph and Google ADK provide explicit shared state objects; Claude Code, smolagents, and Mastra enforce strict context isolation. This reflects fundamentally different assumptions about inter-agent coordination. [Multiple sources]

5. **The planner-executor separation is a universal trend.** Whether implemented as different models (Aider), different modes (Cline, Codex), subagent delegation (Claude Agent SDK), or background processes (Windsurf), separating reasoning from execution is converging across frameworks. [LangChain Blog](https://blog.langchain.com/planning-agents/)

6. **Multi-agent orchestration has questionable empirical support.** Research shows multi-agent debate "cannot exceed the accuracy of its strongest participant," yet the industry positions 2026 as "the year of multi-agent operations." [M3MAD-Bench -- arXiv](https://arxiv.org/html/2601.02854v1)

7. **Context engineering has replaced prompt engineering.** The focus has shifted from optimizing individual prompt wording to curating what information reaches the model at each step -- RAG, MCP, skills, and long-context windows are components of a unified context pipeline. [Context Engineering Overview -- SmartScope](https://smartscope.blog/en/blog/context-engineering-overview/)

8. **Observation masking outperforms summarization in research, but practice disagrees.** JetBrains found observation masking boosted solve rates 2.6% while being 52% cheaper, yet nearly every shipping CLI agent uses summarization/compaction as its primary strategy. [JetBrains Research Blog](https://blog.jetbrains.com/research/2025/12/efficient-context-management/)

## Detailed Analysis

### 1. Framework Landscape Map

The in-scope frameworks span a spectrum from minimal-abstraction SDKs to opinionated orchestration platforms:

**CLI/Coding Agent Harnesses:**
- **Claude Code / Claude Agent SDK** (Anthropic): ReAct core with subagent delegation and agent teams. TypeScript-based CLI with IDE extensions. Strong context isolation.
- **OpenAI Codex CLI**: ReAct loop in Rust with kernel-level sandboxing. Cloud-sandboxed multi-agent support. Memory system with pollution detection.
- **Aider**: Text-based edit formats (deliberately no function calling). Two-phase architect/editor pipeline. Tree-sitter repo map with PageRank.
- **Cursor**: Closed-source IDE agent with Merkle tree-based semantic indexing. Agent mode with subagent system (2.0).
- **Windsurf (Cascade)**: Dual-track planning agent alongside execution model. RAG over dependency graph. Multi-agent sessions added in Wave 13.
- **Cline**: Open-source VS Code extension with per-action human approval. Deep Planning mode. Deliberately rejects multi-agent orchestration.
- **GSD (Get Shit Done)**: Four-phase funnel (discuss-plan-execute-verify) with wave-based parallel execution and context-isolated subagents.

**General-Purpose Agent Frameworks:**
- **LangGraph** (LangChain): Graph-based state machine. Only 1.0 GA release among major frameworks. Most mature checkpointing and time-travel debugging.
- **CrewAI**: Role-based teams with sequential/hierarchical processes. YAML-driven. Fastest idea-to-prototype. Higher token consumption (27,684 tokens/run vs. 7,006 for MS Agent Framework). [Choosing an Agent Framework -- DEV Community](https://dev.to/lukaszgrochal/choosing-an-agent-framework-in-2026-a-data-driven-decision-guide-1mkk)
- **AG2 (formerly AutoGen)**: Conversation-based multi-agent with five group chat patterns. Unified GroupChat and Swarm in v0.9. Most granular OTel tracing. [AG2 v0.9 Release](https://docs.ag2.ai/latest/docs/blog/2025/04/28/0.9-Release-Announcement/)
- **Semantic Kernel** (Microsoft): .NET-first with five orchestration patterns. Deprecated explicit planners in favor of auto function calling. Merging with AutoGen into Microsoft Agent Framework (beta, GA ~March 2026).
- **OpenAI Agents SDK**: Minimal abstraction. Five primitives: Agents, Handoffs, Guardrails, Sessions, Tracing. Provider-locked.
- **Pydantic AI**: "FastAPI-like" developer experience. Type-safe with richest tool composition model (CombinedToolset, FilteredToolset, etc.).
- **smolagents** (Hugging Face): ~1,000 lines of code. CodeAgent generates Python; ToolCallingAgent uses JSON. ManagedAgent for multi-agent.
- **Mastra**: TypeScript-first. Graph-based workflows with Agent Network for dynamic routing. Native MCP and OTel.
- **Google ADK**: Explicit planners (PlanReAct, BuiltIn) + workflow agents (Sequential, Parallel, Loop). 3-layer memory. 4-language SDKs.
- **AWS Strands Agents**: Model-driven planning (ReAct/ReWOO). 3-line agent boilerplate. Four multi-agent primitives. OTel native. Python only.
- **Letta**: Specialized memory framework with OS-style kernel/user context distinction.

### 2. Core Agent Loop Patterns

Eight distinct loop architectures are in active use, each with different trade-offs for control, adaptability, and token efficiency:

**ReAct (Reason + Act)** is the most prevalent. The agent thinks, acts via a tool call, observes the result, and loops until done. Used by Claude Code, Codex CLI, OpenAI Agents SDK, smolagents, Pydantic AI, and Cline. Strengths: self-correcting, simple to implement, adaptable. Weaknesses: accumulates context (2,000-3,000 tokens average per task), risks context window exhaustion on long tasks. [Navigating Modern LLM Agent Architectures -- Wollen Labs](https://www.wollenlabs.com/blog-posts/navigating-modern-llm-agent-architectures-multi-agents-plan-and-execute-rewoo-tree-of-thoughts-and-react)

**Plan-then-Execute** commits to a strategy before taking action. Used by Aider (Architect mode, 85% SWE-bench), GSD, and historically Semantic Kernel. Achieves higher completion rates (92% vs. 85% for ReAct) but at higher cost ($0.09-0.14 vs. $0.06-0.09 per task). [ReAct vs Plan-and-Execute -- DEV Community](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9)

**State Machine / Graph-Based Orchestration** provides the finest-grained control. LangGraph is the canonical example, with Mastra and Google ADK also using graph-based workflows. Developers define nodes (agents/functions), edges (transitions/conditions), and compile an immutable graph. Supports durable execution with crash-and-resume. [LangGraph Architecture -- Medium](https://medium.com/@shuv.sdr/langgraph-architecture-and-design-280c365aaf2c)

*Note: Some sources describe LangGraph as "DAG-based," but LangGraph's own documentation emphasizes support for cycles (loops), making it a directed graph with cycle support rather than a strict DAG.* [LangGraph Docs]

**Conversation-Driven Multi-Agent** (AG2, Semantic Kernel) organizes agents in shared conversations with turn-taking protocols. **Role-Based Hierarchical** (CrewAI, MetaGPT) uses a team metaphor with manager delegation. **Handoff-Based Routing** (OpenAI Agents SDK, Semantic Kernel) transfers control between specialized agents. **ReWOO** generates a complete tool-usage plan in a single pass with placeholder variables, sacrificing adaptability for token efficiency. [Multiple sources]

**Context-Isolated Parallel Orchestration** is an emerging pattern where each agent gets a fresh context window, communicating via file artifacts. Pioneered by GSD and Claude Code subagents, this directly addresses "context rot" -- the systematic degradation of model recall as tokens accumulate. [Spotify Engineering](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2/)

| Pattern | Control | Setup Complexity | Adaptability | Token Efficiency | Example Frameworks |
|---|---|---|---|---|---|
| ReAct | Low | Low | High | Low | Claude Code, Codex, smolagents |
| Plan-then-Execute | Medium | Medium | Medium | Medium | Aider, GSD |
| State Machine/Graph | Very High | High | Medium | High | LangGraph, Mastra, ADK |
| Conversation Multi-Agent | Medium | High | High | Low | AG2, Semantic Kernel |
| Role-Based Hierarchical | Medium | Low-Medium | Medium | Medium | CrewAI |
| Handoff Routing | Medium | Low | Medium | Medium | OpenAI Agents SDK |
| Context-Isolated Parallel | High | High | Medium | High | GSD, Claude Code |

CLI/coding agents overwhelmingly use ReAct as their core inner loop, with differentiation at higher orchestration layers. This contrasts with general-purpose frameworks where the loop architecture itself is the primary differentiator.

### 3. Multi-Agent Coordination

The supervisor/hierarchical delegation pattern is universal -- every framework with multi-agent support implements some form of it. Beyond this common denominator, coordination patterns diverge significantly.

**Fan-out/fan-in** sophistication varies enormously. LangGraph provides the most sophisticated primitives (Send API, supersteps, deferred nodes for map-reduce). Google ADK offers clean `ParallelAgent` with shared session state. Claude Code Agent Teams use a shared task list where teammates claim work independently. Most others rely on language-level concurrency (`asyncio.gather`). [Multiple sources]

**Handoff semantics are converging** across OpenAI Agents SDK, AG2, Semantic Kernel, and Google ADK -- all use similar "transfer to agent X" primitives, though implementations differ (tool calls in OpenAI, conditional edges in LangGraph, `OnCondition` in AG2, `transfer_to_agent()` in ADK). [Multiple sources]

**Agents-as-tools** is the simplest multi-agent primitive. OpenAI Agents SDK (`Agent.as_tool()`), Pydantic AI, smolagents (`ManagedAgent`), and Google ADK (`AgentTool`) all converge on wrapping agents as callable tools with single-thread-of-control semantics. [Multiple sources]

**Peer-to-peer communication is rare.** Only AG2 (five group chat patterns) and Claude Code Agent Teams (direct inter-teammate messaging) support genuine peer-to-peer agent communication. CrewAI explicitly enforces hub-and-spoke only. [Multiple sources]

**CLI coding agents are conservative.** Aider uses only a 2-agent pipeline. Cline deliberately rejects multi-agent orchestration, calling it one of "3 pervasive patterns in coding agent development that we deliberately avoid." Claude Code provides both subagents and agent teams but treats them as opt-in. This contrasts sharply with general-purpose frameworks where multi-agent is a core selling point. [Cline on X](https://x.com/cline/status/1960175630907306325)

The **shared state vs. isolated context** split is the deepest architectural divide:

| Approach | Frameworks | Mechanism |
|---|---|---|
| Shared state object | LangGraph, Google ADK | Central state with reducers / unique keys |
| Shared context variables | AG2 | Shared dictionary |
| Shared crew context | CrewAI | Per-task isolation within shared context |
| Strict isolation | Claude Code, Mastra, smolagents, Pydantic AI | Independent context windows |

### 4. Planning & Task Decomposition

Planning representations range from implicit reasoning to explicit DAG-structured task graphs:

**Flat task lists** remain the most common starting point (LangGraph plan-and-execute, CrewAI sequential). **DAGs** represent the most architecturally sophisticated format -- LLMCompiler streams DAGs with dependency chains, achieving 3.6x speedup and 4.65x cost reduction vs. ReAct. Claude Code Tasks (v2.1.16) support explicit blocking relationships between tasks. [LangChain Blog](https://blog.langchain.com/planning-agents/) / [Rick Hightower -- Medium](https://medium.com/@richardhightower/claude-code-todos-to-tasks-5a1b0e351a1c)

**Phase trees with wave-based parallelism** (GSD) organize work into sequential phases with tasks grouped into parallelizable waves. **Variable-assignment plans** (ReWOO) use interleaved reasoning and executable steps with variable references. **Structured text plans** (OpenDev, Codex) produce human-readable documents with objectives, context, files, and acceptance criteria. [Multiple sources]

A notable trend: **Semantic Kernel deprecated its explicit planners** in favor of automatic function calling -- where planning is implicit in the ReAct cycle. This represents a philosophical position that capable models don't need explicit planning scaffolding. However, this deprecation applies specifically to single-agent planning; Semantic Kernel retained five distinct multi-agent orchestration patterns (GroupChat, Handoff, Sequential, Concurrent, Magentic). [What are Planners -- Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning)

**Replanning strategies** cluster into seven patterns:
1. Replan-on-failure (LangGraph, LLMCompiler Joiner)
2. Guardrail-triggered retry (CrewAI)
3. Verifier-driven fix plans (GSD)
4. Planner subagent re-invocation (OpenDev -- treats replanning as first-class)
5. Continuous validation / stop-and-fix (Codex)
6. Plan mode re-entry (Cline)
7. Periodic reflection (smolagents `planning_interval`)
8. Implicit replanning via ReAct cycle (Semantic Kernel, OpenAI Agents SDK)

LangChain's own analysis confirms: "Nearly all the advanced agents we see in production actually have a very domain specific and custom cognitive architecture." Engineers "remove planning burden from LLMs through hardcoded workflows." [Planning for Agents -- LangChain Blog](https://blog.langchain.com/planning-for-agents/)

### 5. Execution Monitoring, Verification & Recovery

**Verification is the differentiator**, not self-reflection. The research is unambiguous: without external feedback, asking an LLM to review and correct its own answers consistently *decreases* accuracy (Huang et al., 2023). The Reflexion pattern's gains came from test feedback, not introspection. Best-of-N sampling often outperforms iterative refinement at similar token cost. [The Research on LLM Self-Correction -- Vadim's Blog](https://vadim.blog/the-research-on-llm-self-correction)

**Test execution** is the gold standard for coding agents. Aider's automatic lint-test-fix loop, Claude Code's test running, and Codex's continuous validation with stop-and-fix rules all use exit codes as objective pass/fail signals. Test execution-based verification achieved 62.8-64.0% on 500 SWE-bench tasks (agent-verify study). [agent-verify -- GitHub](https://github.com/SeungyounShin/agent-verify)

**Error recovery architectures** vary in sophistication:
- **Semantic Kernel Graph**: Most sophisticated -- 13 classified error types, 8 recovery actions, three-state circuit breaker, `ResourceGovernor` with adaptive limits. [SK Graph -- Error Handling](https://skgraph.dev/how-to/error-handling-and-resilience/)
- **LangGraph**: Three-tier (retry with backoff → fallback tools → human escalation). Anti-pattern: tools returning empty results cause hallucination. [Production Multi-Agent System](https://markaicode.com/langgraph-production-agent/)
- **Mastra**: Two-level retry with lifecycle callbacks and model fallbacks.
- **Claude Agent SDK**: Handles tool denial gracefully; reports stop reasons; sessions resumable.

**Rollback mechanisms** split into git-based and session-level:

| Agent | Mechanism | Limitations |
|---|---|---|
| Cursor | Automatic checkpoints (separate from git) | Silent restoration failures reported |
| Claude Code | `/rewind` with 3 modes (code+conversation, conversation, code) | Bash commands (`rm`, `mv`) not tracked |
| Windsurf | Named checkpoints, per-step revert | Reverts currently irreversible |
| Cline | Workspace snapshots per step | Compare and Restore UI |
| Codex CLI | Standard git workflows | Patch-based (`git diff`/`git apply`) |

**LangGraph provides the most comprehensive checkpoint/resume**: checkpointers save snapshots at each super-step with time-travel replay from any checkpoint and execution forking. Backends: in-memory, SQLite, PostgreSQL. [Persistence -- LangGraph Docs](https://docs.langchain.com/oss/python/langgraph/persistence)

### 6. Context Window Management, Memory & Cross-Session State

Every agent harness confronts the same fundamental constraint: LLMs are stateless, context windows are finite, and performance degrades as conversations grow. Spotify documented "context rot" as a production concern -- recall degrades as tokens exceed 100K+. [Spotify Engineering](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2/)

**Within-session strategies:**

*Conversation compaction/summarization* is the dominant approach. Claude Code triggers auto-compaction at ~95% capacity (CLAUDE.md content survives). Cline compacts at ~80% and reduced MCP server prompt overhead from 30% to an on-demand `load_mcp_documentation` tool (~8K tokens). Codex CLI runs a two-phase memory pipeline: extract structured memory into SQLite, then consolidate into MEMORY.md and skills/ directories. [Multiple sources]

*Observation masking* (JetBrains) replaces older environment observations with placeholders while preserving reasoning history. Boosted solve rates 2.6% while 52% cheaper. LLM summarization caused agents to run 13-15% longer. **Yet nearly every shipping CLI agent uses summarization, not observation masking** -- a significant disconnect between research findings and industry practice that may reflect engineering inertia or different optimization targets. [JetBrains Research](https://blog.jetbrains.com/research/2025/12/efficient-context-management/)

*Subagent context isolation* (Claude Code, GSD) gives each subagent a fresh context window, preventing context bloat in the main conversation.

**Codebase indexing strategies diverge by agent type:**
- Aider: Tree-sitter symbol extraction + NetworkX graph with PageRank personalization (~1K tokens)
- Cursor: Merkle tree-based semantic index (effective ~120K tokens, degrades >500K LOC)
- Windsurf: Static analysis dependency graph with RAG (~100K tokens)
- Claude Code/Codex: No pre-indexing; rely on file tools with on-demand access

**Cross-session memory architectures:**

| Approach | Frameworks | Mechanism |
|---|---|---|
| File-based (Markdown) | Claude Code (CLAUDE.md + auto memory), Codex (AGENTS.md + MEMORY.md) | Loaded at session start; git-committed or gitignored |
| Database-backed | LangGraph (MongoDB/Redis/PostgreSQL), CrewAI (ChromaDB + SQLite3), Semantic Kernel (Cosmos DB), OpenAI Agents SDK (SQLite/Redis) | Semantic/episodic/procedural memory types |
| Working memory | Mastra (schema-validated state + vector search), Letta (OS-style kernel/user context blocks) | Structured, typed, size-limited |
| No built-in | AG2, Pydantic AI, smolagents | External integration required |

**Emerging patterns:**
- **Memory pollution detection** (Codex): marks contaminated threads and triggers selective forgetting. Novel safety mechanism. [Memory System -- openai/codex -- DeepWiki](https://deepwiki.com/openai/codex/3.7-memory-system)
- **Graph-based memory** as alternative to vector stores -- preserving connections across time rather than treating memories independently. [ICLR 2026 MemAgents Workshop]
- **Skills as lazy-loaded context** (Claude Code, Codex): descriptions loaded on demand, keeping them out of base context. [Martin Fowler -- Context Engineering](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)

### 7. Tool Ecosystems — Dispatch, Extensibility & MCP

**MCP (Model Context Protocol)** has become the universal tool interoperability layer. Architecture: JSON-RPC 2.0 client-server with three transport modes (stdio, SSE, HTTP). Three primitives: Resources (application-controlled data), Prompts (user-controlled templates), Tools (model-controlled functions). Adopted by Claude Code, Codex CLI, Cline, Semantic Kernel, Pydantic AI, Mastra, OpenAI Agents SDK, smolagents, Google ADK, and AWS Strands. [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)

**Tool definition patterns** cluster into three groups:
1. **Schema-first** (MCP, OpenAI function calling): JSON Schema for input/output
2. **Decorator/introspection** (Pydantic AI `@agent.tool`, OpenAI Agents SDK `@function_tool`, smolagents `@tool`, Claude Agent SDK `@tool`, Mastra `createTool()` with Zod): Schemas generated from type hints
3. **Text-based** (Aider): Deliberately avoids function calling, using text-based edit formats because "GPT is worse at editing code if you use [structured formats like JSON]." [Aider Edit Formats](https://aider.chat/docs/more/edit-formats.html)

**Deferred/on-demand tool loading** is an emerging optimization for managing tool sprawl. Claude Code auto-enables Tool Search when MCP descriptions exceed 10% of context window. OpenAI Agents SDK provides `ToolSearchTool`. Pydantic AI offers `PreparedToolset` and `FilteredToolset`. Most other frameworks lack this capability. [Multiple sources]

**Permission models** are a distinguishing feature of CLI agents:
- Claude Code: Allow/Ask/Deny with glob patterns across 4-tier settings
- Codex CLI: Three modes (Read-only, Auto, Full Access)
- Cline: Per-action GUI approval
- MCP annotations (`readOnlyHint`, `destructiveHint`) are explicitly informational only -- not enforced. This is a significant security gap. [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)

**Sandboxing** varies dramatically. Codex CLI provides the most rigorous protection with OS kernel-level sandboxing (Apple Seatbelt on macOS, Landlock + seccomp-BPF on Linux). Claude Code and Cursor use command whitelisting. smolagents uses AST-based interpretation with import/function whitelists. Most general-purpose frameworks provide no sandboxing. [Agent Sandboxes Deep Dive -- Pierce](https://pierce.dev/notes/a-deep-dive-on-agent-sandboxes)

**Pydantic AI offers the richest tool composition model**: `CombinedToolset`, `FilteredToolset`, `PrefixedToolset`, `RenamedToolset`, `ApprovalRequiredToolset`, `WrapperToolset` -- all chainable via fluent methods. This level of composability is unique among frameworks. [Pydantic AI Toolsets](https://ai.pydantic.dev/toolsets/)

### 8. Developer Experience — Configuration, Observability & Debugging

**Configuration has bifurcated** between CLI agents (hierarchical file-based) and general-purpose frameworks (programmatic/code-first):

CLI agents converged on **multi-tier configuration** separating permissions (structured config) from behavioral instructions (Markdown): Claude Code has 4-tier JSON + CLAUDE.md, Codex has 3-tier TOML + AGENTS.md, Aider has 4 equivalent surfaces (CLI, YAML, env vars, .env). Each tool uses its own proprietary format -- `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.clinerules/`, `.windsurfrules`, `.continue/rules/` -- creating fragmentation. The AGENTS.md initiative proposes standardization but adoption is incomplete. [Optimizing Coding Agent Rules -- Arize](https://arize.com/blog/optimizing-coding-agent-rules-claude-md-agents-md-clinerules-cursor-rules-for-improved-accuracy/)

General-purpose frameworks use programmatic configuration: Pydantic AI (Python decorators), LangGraph (typed state objects), CrewAI (YAML), Mastra (TypeScript), Semantic Kernel (.NET dependency injection).

**OpenTelemetry convergence** is the most significant observability trend. OTel published semantic conventions for GenAI agent spans (`invoke_agent`, `create_agent`). Frameworks with native OTel: Pydantic AI (via Logfire), Mastra, AG2 (most granular -- four instrumentation functions), Semantic Kernel, Claude Agent SDK (via Langfuse), Google ADK (from v1.17), AWS Strands. [OpenTelemetry GenAI Agent Spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/)

**LangSmith vs. Langfuse** represents a proprietary-vs-open divide: LangSmith offers zero-config LangChain/LangGraph integration but is proprietary and cloud-hosted; Langfuse is MIT-licensed, self-hostable, and framework-agnostic via OTel, but carries ~15% overhead. [Langfuse FAQ](https://langfuse.com/faq/all/langsmith-alternative)

**Debugging patterns** include graph visualization (LangGraph Studio, AG2), replay/time-travel debugging (LangGraph checkpoints, Codex git snapshots, CrewAI audit logs), and sandbox isolation (Claude Code filesystem controls, Codex sandbox modes).

**Rules-as-prompts** -- injecting developer-authored Markdown into system prompts -- is universal among CLI agents and measurably impacts accuracy. Arize research shows GPT-4.1's accuracy improved substantially through ruleset optimization alone. [Arize Blog](https://arize.com/blog/optimizing-coding-agent-rules-claude-md-agents-md-clinerules-cursor-rules-for-improved-accuracy/)

**Big Prompt vs. Small Prompt architecture** (Red Hat): Big Prompt (single comprehensive prompt) uses ~3.5x more input tokens but is simpler; Small Prompt (multiple discrete prompts with filtered context) uses 2.1x more API calls but fewer tokens per request. Recommendation: start big, optimize with small. [Red Hat Developers](https://developers.redhat.com/articles/2026/02/23/prompt-engineering-big-vs-small-prompts-ai-agents)

### 9. Convergence & Divergence Analysis

**Where the field has converged:**

| Pattern | Evidence | Confidence |
|---|---|---|
| ReAct as baseline loop | Every major framework implements it | High |
| MCP as tool standard | 97M+ monthly downloads; all major providers | High |
| OTel for observability | 89% of teams; OTel GenAI semantic conventions | High |
| Human-in-the-loop required | Progressive autonomy pattern is recommended deployment | High |
| Multi-model as default | 75%+ of teams use multiple models | High |
| Context engineering > prompt engineering | RAG, MCP, skills, long-context as unified pipeline | High |
| Planner-executor separation | Universal trend across framework types | High |

**Where the field remains divided:**

| Divergence | Tension | Confidence |
|---|---|---|
| Workflow graphs vs. open-loop autonomy | Reliability vs. flexibility; "most 'agents' aren't actually agents" | High |
| Single-agent vs. multi-agent | Empirical evidence vs. market momentum | High |
| Shared state vs. isolated context | Coordination via shared memory vs. message passing | High |
| Programming model | Graphs, role-teams, conversation, pipeline, minimal-runner | High |
| Abstraction level | OpenAI "nothing more" vs. LangGraph substantial abstraction | High |
| Agent-to-agent protocol | A2A (Google) vs. ACP (IBM, merged) vs. AG-UI (frontend) | Medium |

**The CLI vs. IDE divide** influences architecture more than any framework choice:
- CLI: autonomous delegation, context as scarce resource, binary feedback via exit codes, CI/CD integrability
- IDE: interactive suggestion, persistent state (richer but noisier), visual inspection feedback, human-attended sessions
- Hybrid usage dominates: IDE for ~80% active coding, CLI for ~20% parallelizable/automated tasks
[Why CLIs Are Better for AI Coding Agents -- Firecrawl](https://www.firecrawl.dev/blog/why-clis-are-better-for-agents)

**Open-source vs. commercial** is not a binary divide but a spectrum. All major frameworks are open-source at core; monetization diverges into observability SaaS (LangSmith), enterprise tiers (CrewAI Enterprise), and cloud consumption (Azure, AWS). Commercial additions bundle identity management, checkpointing, and compliance tooling. Protocol governance is trending toward neutral ground (Linux Foundation AAIF co-founded by OpenAI, Anthropic, Google, Microsoft, AWS). [AI Agent Protocols 2026 -- ruh.ai](https://www.ruh.ai/blogs/ai-agent-protocols-2026-complete-guide)

**Maturity tiers:**
- **Battle-tested**: LangGraph 1.0, MCP, OTel infrastructure, ReAct with guardrails
- **Stable, active development**: CrewAI 1.9, OpenAI Agents SDK, Google ADK, AWS Strands 1.0
- **High potential, pre-GA**: Microsoft Agent Framework (beta, "topped every metric" at 7,006 tokens/run), A2A protocol v1.0
- **Experimental**: Online evaluations (only 37% of teams), multi-agent debate at scale, persistent agent communities

### 10. Emerging Protocols: A2A and Cross-Framework Interoperability

The **A2A (Agent-to-Agent) Protocol** -- launched by Google, donated to Linux Foundation, with 150+ supporting organizations -- addresses the agent-to-agent communication layer that MCP doesn't cover. Architecture: HTTPS with JSON-RPC 2.0, three bindings (JSON-RPC, gRPC, HTTP/REST). Core concepts: Agent Cards (discovery at `/.well-known/agent-card.json`), Tasks (work units with lifecycle), Messages (communication turns), Artifacts (generated outputs). [A2A Specification](https://a2a-protocol.org/latest/specification/)

MCP and A2A are explicitly complementary:
- **MCP**: Agent-to-tool (APIs, databases, resources)
- **A2A**: Agent-to-agent (opaque agents collaborate without revealing internals)

Framework adoption varies: Google ADK and AWS Strands have native A2A support. CrewAI and Spring AI have added integrations. LangGraph lacks native support but has a community adapter. A2A's current limitations include incomplete authorization integration, no dynamic skill-checking, and unproven push notification reliability. [IBM: What Is A2A](https://www.ibm.com/think/topics/agent2agent-protocol)

## Comparisons & Trade-offs

### Framework Selection Decision Matrix

| If you need... | Consider | Trade-off |
|---|---|---|
| Maximum control, durable execution | LangGraph | Highest complexity, steepest learning curve |
| Fastest prototype | CrewAI | Higher token consumption, less fine-grained control |
| Minimal abstraction | OpenAI Agents SDK | Provider-locked, limited orchestration |
| Type safety, composable tools | Pydantic AI | No built-in multi-agent orchestration |
| CLI coding automation | Claude Code / Codex CLI | Different sandboxing, permission, and memory models |
| Code reasoning + editing | Aider | No function calling, minimal multi-agent |
| .NET enterprise | Semantic Kernel | API churn during Microsoft Agent Framework migration |
| Multi-language support | Google ADK (4 languages) | Google Cloud ties for advanced memory |
| AWS ecosystem | Strands Agents | Python only, newer ecosystem |

### Planning Representation Trade-offs

| Representation | Parallelism | Human Readability | Replanning | Frameworks |
|---|---|---|---|---|
| Flat task list | None | High | Simple (reorder) | LangGraph, CrewAI |
| DAG | High | Medium | Complex | LLMCompiler, Claude Code Tasks |
| Phase tree + waves | Wave-level | High | Verifier-driven | GSD |
| Variable-assignment | Sequential | Low | None (single-pass) | ReWOO |
| Structured document | None | Very High | Manual | OpenDev, Codex |
| Implicit (function calling) | None | N/A | Automatic | Semantic Kernel |

## Confidence Assessment

### High Confidence

- ReAct is the universal baseline agent loop pattern, used by every major framework
- MCP has achieved dominant market position for agent-to-tool interoperability (97M+ monthly SDK downloads, adopted by all major providers)
- External verification (tests, linters, schema validation) is more effective than LLM self-reflection (supported by Huang et al. 2023, Reflexion analysis, agent-verify study)
- The planner-executor separation is a converging architectural trend across framework types
- OpenTelemetry is becoming the standard observability layer for agent frameworks (89% team adoption, OTel GenAI semantic conventions)
- Human-in-the-loop is a production deployment requirement, not a limitation (progressive autonomy as recommended pattern)
- CLI/coding agents form a distinct architectural subspecies prioritizing context isolation, git-based rollback, and test-driven verification
- Context engineering has superseded prompt engineering as the primary optimization target

### Medium Confidence

- Microsoft Agent Framework benchmarks (7,006 tokens/run, lowest among tested) may shift at GA
- Multi-agent debate's inability to exceed its strongest participant (M3MAD-Bench) may not generalize to all multi-agent coordination patterns
- A2A will achieve broad cross-framework adoption (150+ supporting organizations, but LangGraph lacks native support)
- Observation masking will eventually replace summarization as the primary context management strategy in shipping products
- The AGENTS.md initiative will achieve meaningful cross-tool configuration standardization
- Graph-based memory will emerge as a practical alternative to vector stores for agent applications

### Low Confidence / Unresolved

- **Cursor and Windsurf internal architectures**: Closed-source. All claims about their internals are based on marketing materials and indirect observation, not documentation or source code. Reported details should be treated as approximate.
- **Cross-framework performance benchmarks**: No standardized benchmarks exist for comparing agent patterns, orchestration approaches, or framework implementations under controlled conditions. Token consumption and completion rate comparisons are based on isolated studies.
- **Production failure rates**: No published data on real-world checkpoint recovery success rates, agent failure modes in production, or verification strategy effectiveness at scale.
- **Long-context agent execution**: "Getting agents to make consistent progress across multiple context windows remains an open problem in 2026." ([Zylos Research](https://zylos.ai/research/2026-01-16-long-running-ai-agents))
- **Compaction quality**: No framework benchmarks what percentage of important information survives summarization/compaction.
- **Multi-agent coordination at scale**: Whether multi-agent approaches provide genuine value beyond what single-agent + tools achieves for most production use cases.
- **Continue (IDE extension) architecture**: Not covered in research; architectural details remain undocumented.
- **Letta coverage**: Only explored for memory architecture, not other axes.
- **MCP permission enforcement**: Annotations are informational only; no enforcement mechanism exists in the specification.

## Recommendations

*Since the research context indicates a developer building their own agent harness, these are areas for further investigation rather than prescriptive recommendations:*

### Areas for Further Investigation

1. **Start with ReAct, add structure when needed.** Every framework begins here. The architectural decision is what you layer on top -- explicit planning, graph-based workflows, or multi-agent coordination. The research suggests adding complexity only when simpler approaches measurably fail.

2. **Invest in verification infrastructure over self-reflection.** The evidence strongly favors "plumbing, not mirrors" -- test execution, linting, and schema validation provide reliable signals; LLM self-critique does not.

3. **Evaluate observation masking vs. summarization.** The JetBrains research showing masking outperforming summarization deserves attention, given that almost no shipping agent uses it. This may represent an underexploited optimization.

4. **Build for MCP compatibility.** The protocol has achieved escape velocity. Any tool system should at minimum consume MCP servers, ideally expose its own tools as MCP.

5. **Consider context isolation as the default for multi-agent.** Shared state (LangGraph, ADK) is powerful but introduces complexity. Context isolation (Claude Code, GSD, Mastra) is simpler and avoids "context rot." The choice depends on whether agents need real-time shared state or can coordinate through artifacts.

6. **Plan for A2A.** The protocol is pre-1.0 but has strong institutional backing. Designing agent interfaces that could expose Agent Cards and task lifecycle management positions for future interoperability.

7. **Watch the Microsoft Agent Framework.** Its beta benchmarks (lowest token usage, highest consistency) are notable. If those hold at GA (~March 2026), it could shift the landscape significantly.

8. **Standardize observability early.** OTel integration is non-negotiable for production. Choosing a backend (Langfuse for open-source self-host, LangSmith for LangChain ecosystem, or cloud-native options) is secondary to ensuring traces are captured.

## Sources

### Primary Sources — Framework Documentation & Specifications

- [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) — Tool definition, dispatch, annotation, and result schemas in the Model Context Protocol
- [MCP Specification (Root)](https://modelcontextprotocol.io/specification/2025-11-25) — Protocol architecture, transport modes, and three primitives (Resources, Prompts, Tools)
- [How the Agent Loop Works — Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/agent-loop) — ReAct loop implementation, streaming messages, stop reasons, session resumption
- [Claude Agent SDK MCP Integration](https://platform.claude.com/docs/en/agent-sdk/mcp) — Tool decorator, deferred loading, permission modes, allowedTools whitelist
- [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works) — Agent loop, permission system, context gathering, verification, compaction
- [Claude Code Memory](https://code.claude.com/docs/en/memory) — CLAUDE.md, auto memory, /remember command
- [Claude Code Checkpointing](https://code.claude.com/docs/en/checkpointing) — /rewind command, three restoration modes, session forking
- [Claude Code Settings](https://code.claude.com/docs/en/settings) — Four-scope JSON hierarchy, permission patterns, OTel export
- [Create Custom Subagents — Claude Code](https://code.claude.com/docs/en/sub-agents) — Isolated context windows, custom system prompts, tool access control
- [Orchestrate Teams — Claude Code](https://code.claude.com/docs/en/agent-teams) — Shared task list, direct messaging, lead/teammate roles
- [Compaction — Claude API](https://platform.claude.com/docs/en/build-with-claude/compaction) — Server-side compaction API, configurable trigger thresholds
- [Codex CLI Features](https://developers.openai.com/codex/cli/features/) — JSON Lines events, undo with git ghost snapshots
- [Codex CLI — OpenAI Developers](https://developers.openai.com/codex/cli/) — ReAct loop, sandboxed execution
- [Codex Multi-Agent Docs](https://developers.openai.com/codex/multi-agent/) — Orchestrator, spawn_agents_on_csv, built-in roles
- [Codex Agent Approvals & Security](https://developers.openai.com/codex/agent-approvals-security/) — Three approval modes, MCP call handling
- [Codex Security](https://developers.openai.com/codex/security/) — Kernel-level sandboxing (Seatbelt, Landlock, seccomp-BPF)
- [Codex CLI Config Basics](https://developers.openai.com/codex/config-basic/) — Three-tier TOML, named profiles, sandbox modes
- [Running Agents — OpenAI Agents SDK](https://openai.github.io/openai-agents-python/running_agents/) — Runner loop, max_turns, handoff processing
- [Agent Orchestration — OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent/) — Manager pattern, agents-as-tools, handoffs, parallel execution
- [Handoffs — OpenAI Agents SDK](https://openai.github.io/openai-agents-python/handoffs/) — First-class handoff primitives, transfer_to_ pattern
- [Guardrails — OpenAI Agents SDK](https://openai.github.io/openai-agents-python/guardrails/) — Input/output/tool guardrails, tripwire mechanism
- [Tracing — OpenAI Agents SDK](https://openai.github.io/openai-agents-python/tracing/) — Built-in tracing, LLM generations, tool calls, custom events
- [Sessions — OpenAI Agents SDK](https://openai.github.io/openai-agents-python/sessions/) — SQLiteSession, RedisSession, SQLAlchemySession
- [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/) — @function_tool, deferred loading, ToolSearchTool, needs_approval
- [LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence) — Checkpointers, InMemorySaver, SQLite, PostgreSQL
- [LangGraph Time Travel](https://docs.langchain.com/oss/python/langgraph/use-time-travel) — Replay from any checkpoint, execution forking
- [LangGraph Memory Overview](https://docs.langchain.com/oss/python/langgraph/memory) — Thread-scoped, namespace BaseStore, semantic/episodic/procedural
- [LangGraph Deferred Nodes](https://changelog.langchain.com/announcements/deferred-nodes-in-langgraph) — Fan-out/fan-in with deferred execution
- [LangGraph Supervisor — GitHub](https://github.com/langchain-ai/langgraph-supervisor-py) — Supervisor agent coordinating sub-agents
- [AG2 v0.9 Release](https://docs.ag2.ai/latest/docs/blog/2025/04/28/0.9-Release-Announcement/) — Unified GroupChat and Swarm, five orchestration patterns
- [AG2 Orchestration Patterns](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/patterns/) — AutoPattern, RoundRobin, Random, Manual, Default
- [AG2 Context Variables](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/context-variables/) — Shared memory for group chat agents
- [AG2 OpenTelemetry Tracing](https://docs.ag2.ai/latest/docs/blog/2026/02/08/AG2-OpenTelemetry-Tracing/) — Four instrumentation functions, W3C Trace Context
- [What Are Planners — Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning) — Planner deprecation, auto function calling
- [Semantic Kernel Agent Orchestration](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/) — Five patterns: Concurrent, Sequential, Handoff, GroupChat, Magentic
- [Semantic Kernel Observability](https://learn.microsoft.com/en-us/semantic-kernel/concepts/enterprise-readiness/observability/) — OTel logs, metrics, traces
- [Adding Memory to SK Agents](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-memory) — Whiteboard memory, volatile/non-volatile
- [SK Graph Error Handling](https://skgraph.dev/how-to/error-handling-and-resilience/) — 13 error types, circuit breaker, ResourceGovernor
- [CrewAI Tasks](https://docs.crewai.com/en/concepts/tasks) — Ordered task list, guardrails with retry
- [CrewAI Processes](https://docs.crewai.com/en/learn/sequential-process) — Sequential and hierarchical process modes
- [CrewAI Memory](https://docs.crewai.com/en/concepts/memory) — Short-term (ChromaDB), long-term (SQLite3), entity (RAG)
- [Pydantic AI Docs](https://ai.pydantic.dev/) — Agent architecture, tools, toolsets, multi-agent
- [Pydantic AI Toolsets](https://ai.pydantic.dev/toolsets/) — Combined, Filtered, Prefixed, Renamed, Approval, Wrapper
- [Pydantic AI Multi-Agent](https://ai.pydantic.dev/multi-agent-applications/) — Programmatic hand-off, delegation
- [smolagents Guided Tour](https://huggingface.co/docs/smolagents/en/guided_tour) — MultiStepAgent, CodeAgent, ToolCallingAgent
- [smolagents Multi-Agent](https://huggingface.co/docs/smolagents/examples/multiagents) — ManagedAgent, manager/worker pattern
- [Mastra Agent Memory](https://mastra.ai/docs/agents/agent-memory) — MessageHistory, SemanticRecall, WorkingMemory
- [Mastra Agent Network vNext](https://mastra.ai/blog/vnext-agent-network) — Supervisor pattern, dynamic routing, memory isolation
- [Mastra Error Handling](https://mastra.ai/docs/workflows/error-handling) — Two-level retry, lifecycle callbacks, model fallbacks
- [Mastra createTool](https://mastra.ai/reference/tools/create-tool) — Zod schema input/output
- [Google ADK — LLM Agents](https://google.github.io/adk-docs/agents/llm-agents/) — PlanReActPlanner, BuiltInPlanner
- [Google ADK — Multi-Agent Systems](https://google.github.io/adk-docs/agents/multi-agents/) — Sequential, Parallel, Loop, transfer_to_agent, AgentTool
- [Google ADK — Session](https://google.github.io/adk-docs/sessions/session/) — SessionService, Events
- [Google ADK — State](https://google.github.io/adk-docs/sessions/state/) — Key-value session state
- [Google ADK — Memory](https://google.github.io/adk-docs/sessions/memory/) — MemoryService, InMemory, VertexAI Memory Bank
- [Instrument ADK with OTel](https://docs.cloud.google.com/stackdriver/docs/instrumentation/ai-agent-adk) — Traces, logs, metrics via OTel
- [Strands Agents — Customize Workflows](https://aws.amazon.com/blogs/machine-learning/customize-agent-workflows-with-advanced-orchestration-techniques-using-strands-agents/) — ReAct, ReWOO orchestration strategies
- [Strands Agents 1.0](https://aws.amazon.com/blogs/opensource/introducing-strands-agents-1-0-production-ready-multi-agent-orchestration-made-simple/) — Agents-as-tools, handoffs, swarms, graphs
- [Strands Conversation Management](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/agents/conversation-management/) — SlidingWindow, Summarizing conversation managers
- [Strands Session Persistence](https://dev.to/aws/til-strands-agents-has-built-in-session-persistence-3nhl) — File, S3, AgentCore backends
- [Strands Technical Deep Dive](https://aws.amazon.com/blogs/machine-learning/strands-agents-sdk-a-technical-deep-dive-into-agent-architectures-and-observability/) — OTel native, multi-persona observability
- [A2A Protocol Specification](https://a2a-protocol.org/latest/specification/) — Architecture, Agent Cards, Tasks, Messages, Artifacts
- [Aider Repository Map](https://aider.chat/docs/repomap.html) — Tree-sitter, NetworkX, PageRank personalization
- [Aider Separating Reasoning and Editing](https://aider.chat/2024/09/26/architect.html) — Architect/Editor pipeline, 85% SWE-bench
- [Aider Edit Formats](https://aider.chat/docs/more/edit-formats.html) — Text-based edit formats, no function calling
- [Aider Lint/Test](https://aider.chat/docs/usage/lint-test.html) — Automatic lint-test-fix loop
- [Aider Configuration](https://aider.chat/docs/config.html) — CLI, YAML, env vars, .env files
- [Cline Context Management](https://docs.cline.bot/prompting/understanding-context-management) — Auto-compact at 80%, load_mcp_documentation tool
- [Cline Deep Planning](https://docs.cline.bot/features/deep-planning) — Plan & Act mode, architect-first approach
- [Cline Subagents](https://docs.cline.bot/features/subagents) — Read-only research agents
- [Letta — Anatomy of a Context Window](https://www.letta.com/blog/guide-to-context-engineering) — OS analogy, memory blocks, kernel/user context

### Secondary Sources — Analysis, Research & Blog Posts

- [Navigating Modern LLM Agent Architectures — Wollen Labs](https://www.wollenlabs.com/blog-posts/navigating-modern-llm-agent-architectures-multi-agents-plan-and-execute-rewoo-tree-of-thoughts-and-react) — Taxonomy of agent loop patterns
- [ReAct vs Plan-and-Execute — DEV Community](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9) — Quantitative comparison of patterns (tokens, costs, completion rates)
- [Planning Agents — LangChain Blog](https://blog.langchain.com/planning-agents/) — LLMCompiler DAG, ReWOO, plan-and-execute patterns
- [Planning for Agents — LangChain Blog](https://blog.langchain.com/planning-for-agents/) — Domain-specific cognitive architectures in production
- [The Research on LLM Self-Correction — Vadim's Blog](https://vadim.blog/the-research-on-llm-self-correction) — Meta-analysis showing self-correction decreases accuracy without external feedback
- [Cutting Through the Noise — JetBrains Research](https://blog.jetbrains.com/research/2025/12/efficient-context-management/) — Observation masking vs. summarization benchmarks
- [Context Engineering (Honk Part 2) — Spotify Engineering](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2/) — Context rot in production at 100K+ tokens
- [Context Engineering for Coding Agents — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html) — Skills as lazy-loaded context
- [Agent Design Patterns — Lance Martin](https://rlancemartin.github.io/2026/01/09/agent_design/) — Context engineering, condensed knowledge + tools
- [AI Agent Orchestration Patterns — Microsoft Azure](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) — Supervisor, maker-checker, consensus patterns
- [The Anatomy of Claude Code Workflows — Codecentric](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system) — GSD four-phase funnel analysis
- [AI Agent Frameworks Compared — Arsum](https://arsum.com/blog/posts/ai-agent-frameworks/) — Cross-framework architectural comparison
- [Definitive Guide to Agentic Frameworks 2026 — Softmax](https://blog.softmaxdata.com/definitive-guide-to-agentic-frameworks-in-2026-langgraph-crewai-ag2-openai-and-more/) — Framework positioning and trade-offs
- [Comparing Open-Source AI Agent Frameworks — Langfuse](https://langfuse.com/blog/2025-03-19-ai-agent-comparison) — Multi-agent orchestration comparison
- [Open Source AI Agent Frameworks — OpenAgents](https://openagents.org/blog/posts/2026-02-23-open-source-ai-agent-frameworks-compared) — Programming model fragmentation analysis
- [Choosing an Agent Framework in 2026 — DEV Community](https://dev.to/lukaszgrochal/choosing-an-agent-framework-in-2026-a-data-driven-decision-guide-1mkk) — Data-driven comparison with token benchmarks
- [AutoGen vs LangGraph vs CrewAI 2026 — DEV Community](https://dev.to/synsun/autogen-vs-langgraph-vs-crewai-which-agent-framework-actually-holds-up-in-2026-3fl8) — Framework comparison with audit/replay analysis
- [State of AI Agents — LangChain](https://www.langchain.com/state-of-agent-engineering) — Industry survey: observability adoption, multi-model usage, deployment patterns
- [M3MAD-Bench — arXiv](https://arxiv.org/html/2601.02854v1) — Multi-agent debate accuracy ceiling research
- [Building AI Coding Agents for the Terminal — arXiv](https://arxiv.org/html/2603.05344v1) — OpenDev planning document structure
- [Run Long Horizon Tasks with Codex — OpenAI](https://developers.openai.com/cookbook/examples/codex/long_horizon_tasks) — Milestone-based planning, continuous validation
- [How Codex Is Built — Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-codex-is-built) — Codex CLI Rust implementation
- [Memory System — openai/codex — DeepWiki](https://deepwiki.com/openai/codex/3.7-memory-system) — Two-phase memory pipeline, pollution detection
- [Codex CLI Sandbox — DeepWiki](https://deepwiki.com/openai/codex/6.4-sandboxing-and-security-policies) — Sandbox routing by type
- [GSD Phase Management — DeepWiki](https://deepwiki.com/gsd-build/get-shit-done/4.2-phase-management-commands) — Wave-based parallel execution, decimal phase insertion
- [Taming the AI Brain — OreateAI](https://www.oreateai.com/blog/taming-the-ai-brain-how-gsd-tackles-claude-codes-memory-woes/39a8da0698bc1ae4d87a18f542439eb1) — GSD fractal memory, fresh context windows
- [Claude Code Todos to Tasks — Rick Hightower](https://medium.com/@richardhightower/claude-code-todos-to-tasks-5a1b0e351a1c) — DAG-based task blocking
- [Hierarchical AI Agents: CrewAI Delegation — ActiveWizards](https://activewizards.com/blog/hierarchical-ai-agents-a-guide-to-crewai-delegation) — Hub-and-spoke enforcement
- [Cline on Multi-Agent — X](https://x.com/cline/status/1960175630907306325) — Deliberate rejection of multi-agent patterns
- [AI Agents in Production — 47Billion](https://47billion.com/blog/ai-agents-in-production-frameworks-protocols-and-what-actually-works-in-2026/) — Progressive autonomy deployment pattern
- [LangGraph vs CrewAI vs OpenAI Agents SDK 2026 — Particula](https://particula.tech/blog/langgraph-vs-crewai-vs-openai-agents-sdk-2026) — "Most agents aren't agents, they're workflows"
- [The Agentic Framework Landscape — Swept AI](https://www.swept.ai/post/the-agentic-framework-landscape-what-actually-matters) — Enterprise operational maturity analysis
- [MCP vs A2A Guide — DEV Community](https://dev.to/pockit_tools/mcp-vs-a2a-the-complete-guide-to-ai-agent-protocols-in-2026-30li) — Protocol positioning and adoption
- [AI Agent Protocols 2026 — ruh.ai](https://www.ruh.ai/blogs/ai-agent-protocols-2026-complete-guide) — Protocol governance, NIST standards initiative
- [Linux Foundation A2A Launch](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents) — 150+ organizations, institutional backing
- [IBM: What Is A2A](https://www.ibm.com/think/topics/agent2agent-protocol) — Complementary to MCP, current limitations
- [Google Cloud: Agent State and Memory](https://cloud.google.com/blog/topics/developers-practitioners/remember-this-agent-state-and-memory-with-adk) — ADK three-layer memory architecture
- [Why CLIs Are Better for AI Coding Agents — Firecrawl](https://www.firecrawl.dev/blog/why-clis-are-better-for-agents) — CLI vs IDE architectural influences
- [CLI vs IDE Coding Agents — DEV Community](https://dev.to/forgecode/cli-vs-ide-coding-agents-choose-the-right-one-for-10x-productivity-5gkc) — Context management, feedback loops, CI/CD
- [Optimizing Coding Agent Rules — Arize](https://arize.com/blog/optimizing-coding-agent-rules-claude-md-agents-md-clinerules-cursor-rules-for-improved-accuracy/) — Rules-as-prompts impact on accuracy
- [Prompt Engineering: Big vs Small — Red Hat](https://developers.redhat.com/articles/2026/02/23/prompt-engineering-big-vs-small-prompts-ai-agents) — Token/API call trade-offs
- [LangSmith vs Langfuse — Langfuse FAQ](https://langfuse.com/faq/all/langsmith-alternative) — Open-source vs proprietary observability comparison
- [OpenTelemetry GenAI Agent Spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/) — OTel semantic conventions for agent instrumentation
- [AI Agent Observability Tools — AIMultiple](https://aimultiple.com/agentic-monitoring) — AgentOps, W&B Weave, Arize Phoenix
- [Claude Code Hooks Guide — DataCamp](https://www.datacamp.com/tutorial/claude-code-hooks) — PreToolUse, PostToolUse lifecycle hooks
- [Claude Agent SDK Monitoring with OTel — SigNoz](https://signoz.io/docs/claude-agent-monitoring/) — OTel span types
- [Langfuse ADK Integration](https://langfuse.com/integrations/frameworks/google-adk) — OTel-based ADK observability
- [Langfuse Claude Agent SDK](https://langfuse.com/integrations/frameworks/claude-agent-sdk) — OTel-based Claude SDK observability
- [agent-verify — GitHub](https://github.com/SeungyounShin/agent-verify) — Test execution verification at 62.8-64.0% on SWE-bench
- [Inside Cline's Framework](https://cline.bot/blog/inside-clines-framework-for-optimizing-context-maintaining-narrative-integrity-and-enabling-smarter-ai) — Redundant content elimination, prompt caching
- [A Deep Dive on Agent Sandboxes — Pierce](https://pierce.dev/notes/a-deep-dive-on-agent-sandboxes) — Command whitelisting vs kernel-level sandboxing
- [Tool Chaining Failures — FutureAGI](https://futureagi.substack.com/p/how-tool-chaining-fails-in-production) — Cascading failure as primary bottleneck
- [Long-Running AI Agents — Zylos Research](https://zylos.ai/research/2026-01-16-long-running-ai-agents) — Cross-context-window progress as open problem
- [Vector Databases vs Graph RAG — Machine Learning Mastery](https://machinelearningmastery.com/vector-databases-vs-graph-rag-for-agent-memory-when-to-use-which/) — Graph-based memory emerging
- [MCP 2026 Roadmap](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) — Transport scalability, agent-to-agent, governance
- [Context Engineering Overview — SmartScope](https://smartscope.blog/en/blog/context-engineering-overview/) — Shift from prompt to context engineering
- [Building Agents with Claude Agent SDK — Anthropic](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) — Orchestrator pattern, pipeline/parallel subagents
- [Codex vs Claude Code 2026 — Leanware](https://www.leanware.co/insights/codex-vs-claude-code) — Agent Teams, dedicated context windows
- [Codex vs Cursor 2026 — Morph](https://www.morphllm.com/comparisons/codex-vs-cursor) — Hybrid IDE/CLI usage patterns
- [Introduction to Task Guardrails in CrewAI — Analytics Vidhya](https://www.analyticsvidhya.com/blog/2025/11/introduction-to-task-guardrails-in-crewai/) — Function-based and LLM-based guardrails
- [Context Management Strategies for Windsurf](https://iceberglakehouse.com/posts/2026-03-context-windsurf/) — Windsurf rules and memories
- [Cline Rules — DeepWiki](https://deepwiki.com/cline/cline/7.1-cline-rules) — YAML frontmatter conditional activation
- [Building Good Agents — smolagents](https://huggingface.co/docs/smolagents/tutorials/building_good_agents) — Planning interval, code-as-plan
- [Code Generation with AlphaCodium — arXiv](https://arxiv.org/abs/2401.08500) — Flow engineering, hardcoded multi-stage pipeline
- [LangGraph AI Framework 2025 — Latenode](https://latenode.com/blog/ai-frameworks-technical-infrastructure/langgraph-multi-agent-orchestration/langgraph-ai-framework-2025-complete-architecture-guide-multi-agent-orchestration-analysis) — Graph compilation, immutability
- [CrewAI Framework 2025 — Latenode](https://latenode.com/blog/ai-frameworks-technical-infrastructure/crewai-framework/crewai-framework-2025-complete-review-of-the-open-source-multi-agent-ai-platform) — Senior agents, resource redistribution
- [LangGraph Review — Sider](https://sider.ai/blog/ai-tools/langgraph-review-is-the-agentic-state-machine-worth-your-stack-in-2025) — Durable execution, crash-and-resume
- [Production Multi-Agent System with LangGraph](https://markaicode.com/langgraph-production-agent/) — Three-tier error recovery, empty result anti-pattern
- [LangGraph Architecture — Medium](https://medium.com/@shuv.sdr/langgraph-architecture-and-design-280c365aaf2c) — State machine design, conditional edges
- [Windsurf vs Cursor — Qodo](https://www.qodo.ai/blog/windsurf-vs-cursor/) — Merkle tree indexing, context windows
- [OpenAI Function Calling Docs](https://platform.openai.com/docs/guides/function-calling) — strict mode, JSON Schema parameters
- [Plan Smarter Code Faster — Cline Blog](https://cline.ghost.io/plan-smarter-code-faster-clines-plan-act-is-the-paradigm-for-agentic-coding/) — Plan mode re-entry as replanning
- [Windsurf Cascade Docs](https://docs.windsurf.com/windsurf/cascade/cascade) — Dual-track planning, named checkpoints
- [Cursor Checkpoints](https://cursor.com/docs/agent/chat/checkpoints) — Automatic checkpoints, silent failure reports
- [AI Coding Agents 2026 — Lushbinary](https://www.lushbinary.com/blog/ai-coding-agents-comparison-cursor-windsurf-claude-copilot-kiro-2026/) — Windsurf Wave 13 multi-agent
- [Agentic IDE Comparison — Codecademy](https://www.codecademy.com/article/agentic-ide-comparison-cursor-vs-windsurf-vs-antigravity) — Antigravity multi-agent launch
- [Cursor vs Windsurf vs Cline — UI Bakery](https://uibakery.io/blog/cursor-vs-windsurf-vs-cline) — Cline step-evaluate-fix-continue loop
- [LangGraph Prompt Engineering in Studio](https://changelog.langchain.com/announcements/prompt-engineering-langgraph-studio) — In-place prompt editing
- [Claude Code Tools Reference — vtrivedy](https://www.vtrivedy.com/posts/claudecode-tools-reference) — Built-in tool dispatch map, parallel execution
- [Strands Multi-Agent: Swarm — DEV Community](https://dev.to/aws/strands-multi-agent-systems-swarm-490j) — Shared memory through common context
- [Google Developers Blog: A2A Donation](https://developers.googleblog.com/en/google-cloud-donates-a2a-to-linux-foundation/) — Tyson Foods, Gordon Food Service early adopters
- [Mastra Changelog 2026-01-20](https://mastra.ai/blog/changelog-2026-01-20) — Native OTel support announcement
- [LangChain Prompt Templates Guide — Latenode](https://latenode.com/blog/ai-frameworks-technical-infrastructure/langchain-setup-tools-agents-memory/langchain-prompt-templates-complete-guide-with-examples) — LangChain Hub, centralized versioning
