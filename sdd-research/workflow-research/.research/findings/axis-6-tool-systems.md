# Axis 6: Tool Systems — Dispatch, Extensibility & Plugin Architectures

## Question
How are tools defined, discovered, dispatched, and extended across frameworks? What role does MCP (Model Context Protocol) play? How do frameworks handle tool composition, schema validation, permission models, sandboxing, and tool result processing?

## Findings

### 1. Tool Definition Patterns

#### 1.1 Schema-First (JSON Schema)

**MCP** defines tools as JSON objects with `name`, `description`, `inputSchema` (JSON Schema 2020-12), optional `outputSchema`, `annotations` (behavioral hints), and `execution` metadata. [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) (Confidence: **High**)

**OpenAI function calling** uses `type: "function"`, `name`, `description`, `parameters` (JSON Schema), with `strict: true` for schema conformance. [OpenAI Function Calling Docs](https://platform.openai.com/docs/guides/function-calling) (Confidence: **High**)

#### 1.2 Decorator / Introspection Patterns

- **Pydantic AI**: `@agent.tool` (with RunContext) and `@agent.tool_plain`. Schemas from Python type hints. [Pydantic AI Function Tools](https://ai.pydantic.dev/tools/) (Confidence: **High**)
- **OpenAI Agents SDK**: `@function_tool`, JSON schemas from type annotations via Pydantic. Docstrings parsed for parameter descriptions. [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/) (Confidence: **High**)
- **Smolagents**: `@tool` decorator and `Tool` base class with `forward()` method. [Smolagents GitHub](https://github.com/huggingface/smolagents) (Confidence: **High**)
- **Claude Agent SDK**: `@tool` decorator returning `SdkMcpTool` instances (in-process MCP servers). [Claude Agent SDK MCP Docs](https://platform.claude.com/docs/en/agent-sdk/mcp) (Confidence: **High**)
- **Semantic Kernel**: `[KernelFunction]` and `[Description]` C# attributes. [Semantic Kernel Agent Functions](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-functions) (Confidence: **High**)
- **Mastra**: `createTool()` with Zod schemas for input/output. [Mastra createTool Reference](https://mastra.ai/reference/tools/create-tool) (Confidence: **High**)
- **AG2**: Separates `register_for_llm` (callable by model) and `register_for_execution` (runnable by agent). [AG2 Tool API](https://docs.ag2.ai/latest/docs/api-reference/autogen/tools/Tool/) (Confidence: **High**)

#### 1.3 Text-Based (No Function Calling)

**Aider** deliberately avoids function calling. Uses text-based "edit formats" (whole file, unified diff, search/replace blocks) because "GPT is worse at editing code if you use [structured formats like JSON]." [Aider Edit Formats](https://aider.chat/docs/more/edit-formats.html) (Confidence: **High**)

### 2. Tool Discovery

#### 2.1 MCP Discovery Protocol

`tools/list` (JSON-RPC with cursor-based pagination). Servers declare `tools` capability and emit `notifications/tools/list_changed`. [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) (Confidence: **High**)

#### 2.2 Deferred / On-Demand Loading

- **Claude Code**: Auto-enables "Tool Search" when MCP descriptions exceed 10% of context window. `defer_loading: true`. [Claude Agent SDK MCP Docs](https://platform.claude.com/docs/en/agent-sdk/mcp) (Confidence: **High**)
- **OpenAI Agents SDK**: `ToolSearchTool`, `@function_tool(defer_loading=True)`, `tool_namespace()`. [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/) (Confidence: **High**)
- **Pydantic AI**: `ExternalToolset`, `PreparedToolset`, `FilteredToolset` for dynamic selection. [Pydantic AI Toolsets](https://ai.pydantic.dev/toolsets/) (Confidence: **High**)

### 3. Tool Dispatch

Most frameworks use an agentic loop: prompt -> model reasons -> model emits tool_use -> harness executes -> result fed back -> loop continues.

- **Claude Code**: Built-in tools in dispatch map. Independent tool calls execute in parallel. [Claude Code Tool Reference](https://www.vtrivedy.com/posts/claudecode-tools-reference) (Confidence: **High**)
- **LangGraph ToolNode**: Prebuilt graph node dispatching from `AIMessage.tool_calls`. Handles parallel execution, error handling, state injection. Schema validation catches hallucinated parameters. [LangGraph ToolNode Source](https://github.com/langchain-ai/langgraph/blob/main/libs/prebuilt/langgraph/prebuilt/tool_node.py) (Confidence: **High**)
- **Smolagents dual dispatch**: `CodeAgent` generates Python (AST-interpreted via `LocalPythonExecutor`). `ToolCallingAgent` uses JSON tool calls. [Smolagents DeepWiki](https://deepwiki.com/huggingface/smolagents) (Confidence: **High**)
- **Codex CLI**: All tool calls through `process_exec_tool_call`, routed by `SandboxType`. [Codex CLI Sandbox DeepWiki](https://deepwiki.com/openai/codex/6.4-sandboxing-and-security-policies) (Confidence: **High**)
- **MCP dispatch**: `tools/call` JSON-RPC with `name` and `arguments`. Returns `content` (text, image, audio, resource) + `isError` flag. [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) (Confidence: **High**)

### 4. The Role of MCP

MCP serves as the **universal tool interoperability layer**:

- **Architecture**: JSON-RPC 2.0 client-server. Three transport modes: stdio (local), SSE (streaming HTTP), HTTP. [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25) (Confidence: **High**)
- **Three primitives**: Resources (application-controlled data), Prompts (user-controlled templates), Tools (model-controlled functions). [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25/server) (Confidence: **High**)
- **Adoption**: Claude Code, Claude Agent SDK, Codex CLI, Cline, Semantic Kernel (v1.28.1+), Pydantic AI (`MCPServerToolset`), Mastra, OpenAI Agents SDK, smolagents (`ToolCollection.from_mcp()`). [Multiple sources] (Confidence: **High**)
- **2026 Roadmap**: Transport scalability, agent-to-agent communication, governance, enterprise readiness. [MCP 2026 Roadmap](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) (Confidence: **High**)

### 5. Tool Composition

- **Pydantic AI**: Richest composition model -- `CombinedToolset`, `FilteredToolset`, `PrefixedToolset`, `RenamedToolset`, `ApprovalRequiredToolset`, `WrapperToolset`. Chainable via fluent methods. [Pydantic AI Toolsets](https://ai.pydantic.dev/toolsets/) (Confidence: **High**)
- **Agents-as-Tools**: OpenAI Agents SDK `agent.as_tool()` wraps agents as callable tools. [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/) (Confidence: **High**)
- **Tool chaining failure handling**: Cascading failure is primary bottleneck. Best practice: Pydantic or JSON Schema validation between every tool call. [Tool Chaining Failures](https://futureagi.substack.com/p/how-tool-chaining-fails-in-production) (Confidence: **Medium**)

### 6. Schema Validation

| Framework | Input Validation | Output Validation | Mechanism |
|-----------|-----------------|-------------------|-----------|
| **MCP** | `inputSchema` required; servers MUST validate | `outputSchema` optional | JSON Schema |
| **OpenAI** | `strict: true` enforces | Model response validated | JSON Schema |
| **Pydantic AI** | Pydantic model/type hints | `ToolReturn`/`ModelRetry` | Pydantic |
| **LangGraph** | `ToolNode` validates args | State-based | Pydantic + JSON Schema |
| **Smolagents** | Type hints; JSON for LLM | `output_type` on Tool | Python types |
| **Mastra** | Zod `inputSchema` | Zod `outputSchema` | Zod |
| **Claude Agent SDK** | `@tool` type-safe schema | Via message loop | JSON Schema (MCP) |
| **Semantic Kernel** | .NET type system + attributes | Return type validation | .NET types |

### 7. Permission Models

#### 7.1 Human-in-the-Loop Approval

- **Claude Code**: Three modes (Default, Auto-accept edits, Plan mode). Allowlisting in `.claude/settings.json`. [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works) (Confidence: **High**)
- **Codex CLI**: Three modes (Read-only, Auto, Full Access/`--yolo`). Destructive MCP calls always require approval. [Codex Agent Approvals](https://developers.openai.com/codex/agent-approvals-security/) (Confidence: **High**)
- **Cline**: Per-action GUI approval. Shift+Tab toggles auto-approve. [Cline GitHub](https://github.com/cline/cline) (Confidence: **High**)

#### 7.2 Programmatic Permission Control

- **Claude Agent SDK**: `allowedTools` whitelist with wildcards, `permissionMode` levels. [Claude Agent SDK MCP](https://platform.claude.com/docs/en/agent-sdk/mcp) (Confidence: **High**)
- **Pydantic AI**: `ApprovalRequiredToolset`, `FilteredToolset`. [Pydantic AI Toolsets](https://ai.pydantic.dev/toolsets/) (Confidence: **High**)
- **OpenAI Agents SDK**: `needs_approval`, `is_enabled`. [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/) (Confidence: **High**)

#### 7.3 MCP Annotations

`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` -- explicitly **informational only**, not enforcement. Clients must treat annotations as untrusted unless from trusted servers. [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) (Confidence: **High**)

### 8. Sandboxing

- **Codex CLI**: Most rigorous -- Apple Seatbelt (macOS), Landlock + seccomp-BPF (Linux), restricted tokens (Windows). Network off by default. Protected paths read-only. [Codex Security](https://developers.openai.com/codex/security/) (Confidence: **High**)
- **Claude Code/Cursor**: Command whitelisting rather than OS-level sandboxing. [Agent Sandboxes Deep Dive](https://pierce.dev/notes/a-deep-dive-on-agent-sandboxes) (Confidence: **High**)
- **Smolagents**: AST-based interpretation (no eval/exec), import whitelist, function whitelist, 200K operation limit, 10s timeout. Remote: E2B, Docker, WASM. [Smolagents DeepWiki](https://deepwiki.com/huggingface/smolagents) (Confidence: **High**)
- **OpenAI Agents SDK**: `container_auto`/`container_reference` with network policies. [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/) (Confidence: **High**)

### 9. Tool Result Processing

- **MCP**: Multimodal -- `TextContent`, `ImageContent`, `AudioContent`, `ResourceLink`, `structuredContent` (JSON). `isError` flag for actionable errors. [MCP Tools Spec](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) (Confidence: **High**)
- **OpenAI Agents SDK**: Text, `ToolOutputImage`, `ToolOutputFileContent`. Custom `failure_error_function`. [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/) (Confidence: **High**)
- **Pydantic AI**: `ToolReturn` for success, `ModelRetry` for retriable errors, `DeferredToolRequests` for upstream execution. [Pydantic AI Toolsets](https://ai.pydantic.dev/toolsets/) (Confidence: **High**)

### Comparison Table: Tool System Features

| Feature | Claude Code | Codex CLI | Aider | Cline | OpenAI Agents SDK | LangGraph | Pydantic AI | Smolagents | Semantic Kernel | Mastra | AG2 |
|---------|-------------|-----------|-------|-------|-------------------|-----------|-------------|------------|-----------------|--------|-----|
| **MCP Support** | Native | Config | No | Yes | HostedMCPTool | Via LangChain | MCPServerToolset | from_mcp() | v1.28.1+ | Native | No evidence |
| **Deferred Loading** | Auto (10%) | No | N/A | No | ToolSearchTool | No | PreparedToolset | No | No | No | No |
| **Permission Model** | Allowlist+modes | 3 modes | N/A | Per-action | needs_approval | Custom | ApprovalToolset | N/A | Custom | Custom | Custom |
| **Sandboxing** | Whitelist | Kernel-level | None | Approval | Container | None | None | AST interp | None | None | None |
| **Parallel Dispatch** | Yes | Yes | No | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

## Key Unknowns

1. **MCP permission enforcement gap**: Annotations are "informational only." SEP-1880 for scope requirements not yet adopted. (Confidence: **Low**)
2. **Cross-framework tool portability**: Tools require adapter layers between frameworks. (Confidence: **Low**)
3. **AG2 and MCP**: No clear evidence of native MCP integration. (Confidence: **Low**)
4. **Aider tool extensibility**: No plans for MCP or plugin mechanism documented. (Confidence: **Low**)
5. **Runtime schema enforcement**: Actual enforcement varies by MCP server implementation. (Confidence: **Medium**)
6. **Cursor/Windsurf tool architectures**: Closed-source; not publicly documented. (Confidence: **Low**)
7. **MCP output schema adoption**: `outputSchema`/`structuredContent` is new; adoption unclear. (Confidence: **Low**)

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 25+
