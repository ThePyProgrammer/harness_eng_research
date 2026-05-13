# Axis 7: Developer Ergonomics — Configuration, Observability & Debugging

## Question
How do frameworks expose configuration to developers? What observability, logging, tracing, and debugging patterns exist? How do frameworks handle prompt engineering and prompt management?

## Findings

### 1. Configuration Exposure Patterns

#### 1.1 Hierarchical File-Based Configuration (CLI/Coding Agents)

All CLI/coding agents have converged on a **multi-tier, file-based configuration hierarchy** separating "what the agent can do" (permissions in structured config) from "what the agent should know" (behavioral instructions in Markdown).

- **Claude Code**: Four-scope JSON hierarchy -- Managed (IT-deployed, highest priority), User (`~/.claude/settings.json`), Project (`.claude/settings.json`, git-committed), Local (`.claude/settings.local.json`, gitignored). Array settings merge across scopes. Behavioral instructions in `CLAUDE.md` files. [Claude Code Settings Docs](https://code.claude.com/docs/en/settings) (Confidence: high)

- **Codex CLI**: Three-tier TOML -- system (`/etc/codex/config.toml`), user (`~/.codex/config.toml`), project (`.codex/config.toml`). Named profiles (`--profile <name>`). Behavioral instructions in `AGENTS.md`. [Codex CLI Config Basics](https://developers.openai.com/codex/config-basic/) (Confidence: high)

- **Aider**: Four equivalent surfaces -- command-line, `.aider.conf.yml`, environment variables (`AIDER_` prefix), `.env` files. Model-specific overrides in `.aider.model.settings.yml`. [Aider Configuration Docs](https://aider.chat/docs/config.html) (Confidence: high)

- **Windsurf**: `.windsurf/rules/` with `rules.md` files plus "Memories" system for persistent facts. [Context Management Strategies for Windsurf](https://iceberglakehouse.com/posts/2026-03-context-windsurf/) (Confidence: high)

- **Cline**: `.clinerules/` with YAML frontmatter for conditional activation. Rules injected into system prompt. [Cline Rules - DeepWiki](https://deepwiki.com/cline/cline/7.1-cline-rules) (Confidence: high)

#### 1.2 Configuration Fragmentation Problem

Each tool uses its own proprietary config: `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.clinerules/`, `.windsurfrules`, `.continue/rules/`. The AGENTS.md initiative proposes a community standard but adoption remains incomplete. [Optimizing Coding Agent Rules - Arize](https://arize.com/blog/optimizing-coding-agent-rules-claude-md-agents-md-clinerules-cursor-rules-for-improved-accuracy/) (Confidence: high)

#### 1.3 Programmatic Configuration (General-Purpose Frameworks)

- **Pydantic AI**: Python decorators and typed configuration, "FastAPI-like" DX. [Pydantic AI Docs](https://ai.pydantic.dev/) (Confidence: high)
- **LangGraph**: Code-first with typed state objects. LangGraph Studio UI for editing. [LangGraph](https://www.langchain.com/langgraph) (Confidence: high)
- **CrewAI**: YAML-driven role definitions. Fastest idea-to-prototype path. [AI Agent Frameworks Compared - DEV](https://dev.to/synsun/autogen-vs-langgraph-vs-crewai-which-agent-framework-actually-holds-up-in-2026-3fl8) (Confidence: high)
- **Mastra**: TypeScript-first with composite storage backends. [Mastra GitHub](https://github.com/mastra-ai/mastra) (Confidence: medium)
- **OpenAI Agents SDK**: Python-first with auto schema generation and REPL utility. [OpenAI Agents SDK Docs](https://openai.github.io/openai-agents-python/) (Confidence: high)
- **Semantic Kernel**: ServiceCollection pattern (dependency injection) for .NET developers. [Semantic Kernel Observability](https://learn.microsoft.com/en-us/semantic-kernel/concepts/enterprise-readiness/observability/) (Confidence: high)

### 2. Observability, Logging, and Tracing

#### 2.1 The OpenTelemetry Convergence

The most significant trend is convergence on **OpenTelemetry (OTel)** as the standard. OTel published semantic conventions for GenAI agent spans with `invoke_agent` and `create_agent` operations. [OpenTelemetry GenAI Agent Spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/) (Confidence: high)

Frameworks with native OTel:
- **Pydantic AI**: OTel via Pydantic Logfire. [Langfuse Pydantic AI Integration](https://langfuse.com/integrations/frameworks/pydantic-ai)
- **Mastra**: "Native OpenTelemetry support, making observability a first-class concern." [Mastra Changelog](https://mastra.ai/blog/changelog-2026-01-20)
- **AG2**: Full OTel tracing with W3C Trace Context propagation for distributed multi-agent tracing. [AG2 OpenTelemetry Tracing](https://docs.ag2.ai/latest/docs/blog/2026/02/08/AG2-OpenTelemetry-Tracing/)
- **Semantic Kernel**: Logs, metrics, and traces via `Microsoft.SemanticKernel*` activity source. [Semantic Kernel Observability](https://learn.microsoft.com/en-us/semantic-kernel/concepts/enterprise-readiness/observability/)
- **Claude Agent SDK**: Integrates with Langfuse via OTel. [Langfuse Claude Agent SDK](https://langfuse.com/integrations/frameworks/claude-agent-sdk)

#### 2.2 LangSmith vs. Langfuse

| Dimension | LangSmith | Langfuse |
|-----------|-----------|---------|
| **Open source** | Proprietary | MIT-licensed, self-hostable |
| **Framework coupling** | Tight LangChain/LangGraph (zero-config) | Framework-agnostic via OTel |
| **Performance overhead** | ~0% | ~15% |
| **Pricing** | Per root trace volume | Per data depth (Units) |
| **Data ownership** | Cloud-hosted | Full self-host option |

[LangSmith vs Langfuse - Langfuse FAQ](https://langfuse.com/faq/all/langsmith-alternative) (Confidence: high)

Other platforms: **AgentOps** (~12% overhead, session replay), **Weights & Biases Weave** (hierarchical tracing with cost attribution), **Arize Phoenix** (open-source, prompt optimization). [AI Agent Observability Tools - AIMultiple](https://aimultiple.com/agentic-monitoring)

#### 2.3 CLI Agent Observability

- **Claude Code**: OTel metrics export (`OTEL_METRICS_EXPORTER=otlp`), telemetry opt-in. Third-party `claude_telemetry` wrapper. [Claude Code Settings Docs](https://code.claude.com/docs/en/settings)
- **Codex CLI**: `log_dir` configuration for directing logs. [Codex CLI Config Basics](https://developers.openai.com/codex/config-basic/)
- **Aider**: Verbose logging modes; no native OTel. (Confidence: medium)

#### 2.4 AG2's Granular Tracing

Most granular: four instrumentation functions (`instrument_agent()`, `instrument_llm_wrapper()`, `instrument_pattern()`, `instrument_a2a_server()`). Each span carries `ag2.span.type`. [AG2 OpenTelemetry Tracing](https://docs.ag2.ai/latest/docs/blog/2026/02/08/AG2-OpenTelemetry-Tracing/) (Confidence: high)

### 3. Debugging Patterns

#### 3.1 Graph Visualization

LangGraph and AG2 enable visual debugging with state inspection at each node. LangGraph Studio allows stepping through execution and editing prompts in-place. [LangGraph Prompt Engineering in Studio](https://changelog.langchain.com/announcements/prompt-engineering-langgraph-studio) (Confidence: high)

#### 3.2 Replay and Time-Travel Debugging

- **CrewAI**: Audit logs recording every agent step, enabling replay/modification. [AI Agent Frameworks Compared - DEV](https://dev.to/synsun/autogen-vs-langgraph-vs-crewai-which-agent-framework-actually-holds-up-in-2026-3fl8) (Confidence: medium)
- **Codex CLI**: Stable `undo` with per-turn git ghost snapshots. [Codex CLI Config Basics](https://developers.openai.com/codex/config-basic/) (Confidence: high)
- **LangGraph**: Checkpointing with explicit interrupt points. [Agent Design Patterns - Lance Martin](https://rlancemartin.github.io/2026/01/09/agent_design/) (Confidence: high)

#### 3.3 Sandbox Isolation for Safe Debugging

- **Claude Code**: Configurable filesystem write/read controls, network allowlists, excluded commands. [Claude Code Settings](https://code.claude.com/docs/en/settings) (Confidence: high)
- **Codex CLI**: `sandbox_mode` with workspace-write and elevated options. [Codex CLI Config Basics](https://developers.openai.com/codex/config-basic/) (Confidence: high)

#### 3.4 Permission-Based Safety

Claude Code's permission system (`allow`, `ask`, `deny` with glob patterns) serves as both safety mechanism and debugging aid. OpenAI Agents SDK's guardrails run "input validation and safety checks in parallel with agent execution." [OpenAI Agents SDK Docs](https://openai.github.io/openai-agents-python/) (Confidence: high)

### 4. Prompt Engineering and Prompt Management

#### 4.1 Rules-as-Prompts Pattern

All major CLI agents inject developer-authored Markdown into the system prompt. Arize's research: rules significantly impact accuracy. GPT-4.1's accuracy improved substantially through ruleset optimization alone. [Optimizing Coding Agent Rules - Arize](https://arize.com/blog/optimizing-coding-agent-rules-claude-md-agents-md-clinerules-cursor-rules-for-improved-accuracy/) (Confidence: high)

| Agent | Rules File | Format | Conditional Rules |
|-------|-----------|--------|-------------------|
| Claude Code | `CLAUDE.md` | Markdown | No (always loaded) |
| Codex CLI | `AGENTS.md` | Markdown | Trust-gated |
| Aider | `.aider.conf.yml` | YAML | No |
| Cline | `.clinerules/` | MD + YAML frontmatter | Yes |
| Windsurf | `.windsurf/rules/` | Markdown | Yes |
| Cursor | `.cursorrules` | Markdown | No |

#### 4.2 Big Prompt vs. Small Prompt Architecture

Red Hat analysis identified two architectures:
- **Big Prompt**: Single comprehensive prompt with full history. Simpler, ~3.5x more input tokens. Better for capable models.
- **Small Prompt**: Multiple discrete prompts with filtered context. 2.1x more API calls but fewer tokens per request. Enables per-step tuning.

Recommendation: Start big to validate, then optimize with small prompts for cost. [Prompt Engineering: Big vs. Small - Red Hat](https://developers.redhat.com/articles/2026/02/23/prompt-engineering-big-vs-small-prompts-ai-agents) (Confidence: high)

#### 4.3 Prompt Versioning and Management

- **LangChain Hub**: Centralized template storage/versioning. [LangChain Prompt Templates Guide](https://latenode.com/blog/ai-frameworks-technical-infrastructure/langchain-setup-tools-agents-memory/langchain-prompt-templates-complete-guide-with-examples)
- **LangGraph Studio**: In-place prompt editing without code changes. [LangGraph Studio](https://changelog.langchain.com/announcements/prompt-engineering-langgraph-studio)
- **Langfuse**: Prompt evolution visibility and session-based analysis. [AIMultiple](https://aimultiple.com/agentic-monitoring)

#### 4.4 Context Engineering as Prompt Management

Emerging paradigm: curating what information reaches the model at each step rather than optimizing wording. Lance Martin: "a concise, structured guide always outperforms simply wiring in documentation tools." Best results from combining condensed knowledge (CLAUDE.md) with tools for on-demand detail. [Agent Design Patterns - Lance Martin](https://rlancemartin.github.io/2026/01/09/agent_design/) (Confidence: high)

### Feature Comparison Table

| Feature | Claude Code | Codex CLI | Aider | LangGraph | Pydantic AI | OpenAI Agents SDK | CrewAI | AG2 | Semantic Kernel | Mastra |
|---------|------------|-----------|-------|-----------|-------------|-------------------|--------|-----|-----------------|--------|
| **Config format** | JSON + MD | TOML + MD | YAML + .env | Code | Code | Code | YAML + Code | Code | DI/Code | Code (TS) |
| **Config hierarchy** | 4-tier | 3-tier | 3-location | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| **OTel native** | Partial | No | No | Via LangSmith | Yes | Built-in | Via integration | Yes | Yes | Yes |
| **Sandbox** | Yes | Yes | No | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| **Permission system** | Allow/Ask/Deny | Approval policy | No | N/A | N/A | Guardrails | N/A | N/A | N/A | N/A |
| **Prompt rules** | CLAUDE.md | AGENTS.md | YAML | Code/Studio | Code | Code | YAML | Code | Code | Code |
| **Graph visualization** | No | No | No | Yes | No | Yes | No | Yes | No | No |
| **Replay/undo** | No | Git snapshots | Git-based | Checkpoints | No | No | Audit logs | No | No | No |

## Key Unknowns

1. **GSD internal architecture**: Configuration and observability mechanisms beyond spec-driven workflow unclear.
2. **Cursor's internal tracing**: Not well-documented publicly.
3. **OTel overhead in coding agents**: No equivalent benchmarks for CLI agents where latency sensitivity differs.
4. **AGENTS.md adoption timeline**: Most tools have open issues but no confirmed implementations beyond Codex.
5. **Prompt versioning in CLI agents**: None offer formal prompt versioning; handled informally via git.
6. **smolagents debugging**: Minimalist philosophy suggests intentionally limited built-in observability.
7. **Mastra observability migration**: Full API surface not well-documented.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 25+
