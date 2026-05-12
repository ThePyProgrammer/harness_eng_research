# Follow-up 2: Google ADK, AWS Strands Agents & A2A Protocol

## Question
How do Google ADK, AWS Strands Agents, and the A2A protocol handle planning, memory, observability, and developer ergonomics? What is the current state of A2A for cross-framework interoperability?

## Findings

### 1. Google Agent Development Kit (ADK)

#### 1.1 Planning and Task Decomposition (Confidence: HIGH)

Two explicit planner implementations attachable to any `LlmAgent`:

- **`PlanReActPlanner`**: Structured Thought/Plan/Action/Observation loop without requiring native model thinking. Appends instructions forcing `/*PLANNING*/`, `/*ACTION*/`, `/*REASONING*/`, `/*FINAL_ANSWER*/` sections. [LLM Agents - ADK Docs](https://google.github.io/adk-docs/agents/llm-agents/)

- **`BuiltInPlanner`**: Leverages model's native thinking (e.g., Gemini thinking mode). Configured via `ThinkingConfig` with `include_thoughts=True` and `thinking_budget=256`. [LLM Agents - ADK Docs](https://google.github.io/adk-docs/agents/llm-agents/)

Structural decomposition via workflow agents: `SequentialAgent`, `ParallelAgent`, `LoopAgent` -- deterministic control-flow primitives composable hierarchically with LLM agents. [Multi-agent Systems - ADK Docs](https://google.github.io/adk-docs/agents/multi-agents/)

#### 1.2 Context and Memory Management (Confidence: HIGH)

Clean three-layer distinction:

- **Session** (`SessionService`): Single conversation's chronological `Events` (messages, tool calls, results). [Session - ADK Docs](https://google.github.io/adk-docs/sessions/session/)
- **State**: Key-value scratchpad scoped to session, ephemeral but persistable via session backend. [State - ADK Docs](https://google.github.io/adk-docs/sessions/state/)
- **Memory** (`MemoryService`): Long-term cross-session knowledge store. `add_session_to_memory()` ingests sessions; `search_memory()` queries them. Two implementations:
  - `InMemoryMemoryService`: keyword-matching, no persistence (prototyping)
  - `VertexAiMemoryBankService`: managed Google Cloud service with LLM-powered extraction and semantic search across past interactions
  [Memory - ADK Docs](https://google.github.io/adk-docs/sessions/memory/) / [Google Cloud Blog: Agent State and Memory](https://cloud.google.com/blog/topics/developers-practitioners/remember-this-agent-state-and-memory-with-adk)

Context window management: supports compaction to reduce history while preserving essential information. [Context Management - GitHub Discussion #826](https://github.com/google/adk-python/discussions/826)

#### 1.3 Observability (Confidence: HIGH)

Built-in OpenTelemetry from v1.17.0+:
- **Traces**: OTLP (gRPC) to any OTel backend. Key span: `call_llm` with prompts, responses, model parameters.
- **Logs**: Cloud Logging API with JSON payloads.
- **Metrics**: Cloud Monitoring API.

Configuration via env vars (`OTEL_SERVICE_NAME`, etc.) and `--otel_to_cloud` CLI flag. Privacy control: `ADK_CAPTURE_MESSAGE_CONTENT_IN_SPANS=false`. Vendor-neutral backends: Langfuse, Arize AX, SigNoz, Dynatrace, AgentOps. [Instrument ADK with OpenTelemetry](https://docs.cloud.google.com/stackdriver/docs/instrumentation/ai-agent-adk) / [Langfuse ADK Integration](https://langfuse.com/integrations/frameworks/google-adk)

ADK Web UI provides integrated trace views for local debugging. [ADK Docs](https://google.github.io/adk-docs/get-started/)

#### 1.4 Developer Ergonomics (Confidence: HIGH)

Two configuration paradigms:
- **Code-first** (Python, TypeScript, Go, Java): Full flexibility, primary approach
- **YAML-based Agent Config**: Declarative, with visual Agent Builder in Web UI

Tooling: CLI, Web UI with hot reloading, integrated trace views, single-command Cloud Run deployment. Runner component manages execution flow, orchestrates agent interactions via Events, coordinates with SessionService/ArtifactService/MemoryService. [ADK Technical Overview](https://google.github.io/adk-docs/get-started/about/)

### 2. AWS Strands Agents

#### 2.1 Planning (Confidence: HIGH)

Model-driven approach by default -- relies on LLM reasoning rather than developer-defined workflows. Core loop: read context → plan action → call tool → incorporate result → repeat.

Custom orchestration strategies:
- **ReAct** (default): Reason → Act → Observe → loop. "Correct, minimal path" with fastest execution.
- **ReWOO**: Plan-then-execute. Planner emits step-indexed program (`#E1...#En`). Plan-guided worker executes sequentially without reordering. Provides governance gates and ordered dependencies.
[Customize Agent Workflows - AWS Blog](https://aws.amazon.com/blogs/machine-learning/customize-agent-workflows-with-advanced-orchestration-techniques-using-strands-agents/)

Multi-agent (Strands 1.0):
- **Agents-as-Tools**: Hierarchical delegation
- **Handoffs**: Explicit control transfer with full context
- **Swarms**: Autonomous teams with shared memory, ant-colony-inspired self-organization
- **Graphs**: Explicit workflows with conditional routing and quality gates
All composable -- swarms can contain graphs, graphs can orchestrate swarms. [Introducing Strands Agents 1.0 - AWS Blog](https://aws.amazon.com/blogs/opensource/introducing-strands-agents-1-0-production-ready-multi-agent-orchestration-made-simple/)

#### 2.2 Memory (Confidence: HIGH)

`SessionManager` with automatic persistence (no manual save/load):
- `FileSessionManager`: Local filesystem
- `S3SessionManager`: Amazon S3
- `AgentCoreMemorySessionManager`: Amazon Bedrock AgentCore Memory with configurable `batch_size`
[TIL: Strands Session Persistence - DEV Community](https://dev.to/aws/til-strands-agents-has-built-in-session-persistence-3nhl)

Conversation managers for context windows:
- `SlidingWindowConversationManager`: Trims older messages
- `SummarizingConversationManager`: Summarizes older context, preserving important info. `reduce_context` called automatically on overflow.
[Conversation Management - Strands Docs](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/agents/conversation-management/)

Swarm pattern: shared memory through common context (full task, agent history, shared knowledge). [Strands Multi-Agent: Swarm - DEV Community](https://dev.to/aws/strands-multi-agent-systems-swarm-490j)

#### 2.3 Observability (Confidence: HIGH)

OTel native. Each run produces trace with spans per model call and tool call. Spans include prompt content, model parameters, token counts.

Backends: AWS X-Ray, CloudWatch, Jaeger, Grafana Tempo, Datadog, Arize AX, Langfuse. [Strands Technical Deep Dive - AWS Blog](https://aws.amazon.com/blogs/machine-learning/strands-agents-sdk-a-technical-deep-dive-into-agent-architectures-and-observability/)

Multi-persona framework: developers diagnose decision chains, data engineers aggregate for cost, AI researchers identify failure modes. [Strands Technical Deep Dive](https://aws.amazon.com/blogs/machine-learning/strands-agents-sdk-a-technical-deep-dive-into-agent-architectures-and-observability/)

#### 2.4 Developer Ergonomics (Confidence: HIGH)

Minimal boilerplate (3-line agents). `@tool` decorator for any Python function. Hot-reload during development.

Model-agnostic: Bedrock, OpenAI, Anthropic, local models -- switchable without code changes. Python-only (no TypeScript/Go/Java). [Strands Agents SDK](https://strandsagents.com/)

### 3. A2A (Agent-to-Agent) Protocol

#### 3.1 Current State (Confidence: HIGH)

Launched by Google April 2025, donated to Linux Foundation June 2025. Spec v0.3.0 released, RC v1.0 in development. 150+ supporting organizations (AWS, Microsoft, Cisco, Salesforce, SAP, ServiceNow). [Linux Foundation A2A Launch](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents)

#### 3.2 Architecture (Confidence: HIGH)

Client-server on HTTPS with JSON-RPC 2.0. Three bindings: JSON-RPC, gRPC, HTTP/REST.

Core concepts:
- **Agent Card**: JSON at `/.well-known/agent-card.json` -- identity, capabilities, skills, endpoint, auth
- **Tasks**: Work unit with lifecycle (submitted → working → completed/failed)
- **Messages**: Communication turns with Parts (text, file, structured data)
- **Artifacts**: Generated outputs

Three delivery: synchronous polling, streaming, push notifications (webhooks). [A2A Specification](https://a2a-protocol.org/latest/specification/)

#### 3.3 Relationship to MCP (Confidence: HIGH)

Explicitly complementary:
- **MCP**: Agent-to-tool (APIs, databases, resources)
- **A2A**: Agent-to-agent (opaque agents collaborate without revealing internals)

Example: inventory agent uses MCP for product DB, A2A to communicate with supplier agent. [IBM: What Is A2A](https://www.ibm.com/think/topics/agent2agent-protocol)

#### 3.4 Framework Adoption (Confidence: MEDIUM)

- **Google ADK**: Native A2A support
- **AWS Strands**: Built-in support
- **Spring AI**: Official integration via Spring Boot autoconfiguration
- **CrewAI**: Added A2A support
- **LangGraph**: No native A2A; community adapter SDK exists
[Multiple sources]

Enterprise adoption: Tyson Foods, Gordon Food Service building collaborative A2A systems. [Google Developers Blog: A2A Donation](https://developers.googleblog.com/en/google-cloud-donates-a2a-to-linux-foundation/)

#### 3.5 Limitations (Confidence: MEDIUM-HIGH)

Per IBM analysis:
- Authorization schemes not fully integrated into agent cards
- No dynamic skill-checking for unanticipated capabilities
- Limited dynamic UX negotiation
- Push notification reliability needs hardening
- Working groups expanding with real-time observability, policy controls, enterprise layers
[IBM: What Is A2A](https://www.ibm.com/think/topics/agent2agent-protocol)

### Comparative Table

| Dimension | Google ADK | AWS Strands |
|---|---|---|
| **Planning** | Explicit planners (PlanReAct, BuiltIn) + workflow agents | Model-driven; ReAct + ReWOO orchestrators |
| **Memory** | 3-layer (Session/State/Memory); Vertex AI Memory Bank | SessionManager (File/S3/AgentCore); Sliding/Summarizing |
| **Observability** | OTel built-in (v1.17+); multi-vendor | OTel native; multi-vendor |
| **Languages** | Python, TypeScript, Go, Java | Python only |
| **A2A** | Native | Built-in |

## Key Unknowns

1. ADK planner extensibility -- can custom planners be plugged in via BasePlanner?
2. Strands cross-session semantic memory beyond AgentCore
3. A2A protocol performance at scale -- no benchmarks found
4. A2A v1.0 firm release date
5. Strands multi-language SDK roadmap
6. ADK vs Strands observability depth comparison

## Metadata
- Follow-up subagent completed: 2026-03-12
- Sources cited: 20+
