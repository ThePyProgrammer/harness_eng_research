# Axis 4: Execution Monitoring, Verification & Recovery

## Question
How do frameworks handle execution monitoring, output verification, error recovery, rollback, and checkpoint/resume? What verification strategies exist (self-check, separate verifier agents, test execution, human review)?

## Findings

### 1. Execution Monitoring

**Confidence: High**

- **LangGraph** provides the most mature monitoring infrastructure. Every `.invoke()` call generates detailed traces showing step sequences, tool latencies, and cost accrual via LangSmith integration. The framework tracks state at each "super-step" with token budget enforcement via Pydantic validators. [Production Multi-Agent System with LangGraph](https://markaicode.com/langgraph-production-agent/)

- **Claude Agent SDK** streams typed messages throughout the agent loop: `SystemMessage`, `AssistantMessage`, `UserMessage`, and `ResultMessage` with cost, usage, session ID. OpenTelemetry integration captures every tool call and model completion as a span. [How the Agent Loop Works - Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/agent-loop) | [Claude Agent SDK Monitoring with OpenTelemetry](https://signoz.io/docs/claude-agent-monitoring/)

- **OpenAI Codex CLI** emits JSON Lines events including `thread.started`, `turn.started`, `turn.completed`, `turn.failed`, and item types covering agent messages, reasoning, command executions, file changes, and plan updates. [Codex CLI Features](https://developers.openai.com/codex/cli/features/)

- **Claude Code** uses Hooks as automated triggers at specific lifecycle points. `PreToolUse` hooks run before Claude executes an action, while `PostToolUse` hooks run after action completion. [Claude Code Hooks Guide - DataCamp](https://www.datacamp.com/tutorial/claude-code-hooks)

- **smolagents** tracks token usage and timing at each step via a `Monitor` class using `update_metrics(token_usage, timing)`. [CodeAgent - DeepWiki](https://deepwiki.com/huggingface/smolagents/4.2-codeagent)

- **OpenAI Agents SDK** includes built-in tracing enabled by default, collecting LLM generations, tool calls, handoffs, guardrails, and custom events. [Tracing - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/tracing/)

### 2. Output Verification Strategies

**Confidence: High**

A critical finding: almost every published "success" of agent self-correction is actually a success of **external verification**, not introspective self-reflection. Huang et al. (2023) found that without external feedback, asking GPT-4 to review and correct its own answers consistently **decreased** accuracy. [The Research on LLM Self-Correction - Vadim's Blog](https://vadim.blog/the-research-on-llm-self-correction)

#### Verification Strategy Comparison Table

| Strategy | Frameworks Using It | Mechanism | Effectiveness |
|----------|-------------------|-----------|---------------|
| **Test Execution** | Aider, Claude Code, Cursor, Windsurf, Codex CLI, smolagents | Run test suite after edits; feed failures back | High -- objective pass/fail signal |
| **Linting/Static Analysis** | Aider, Claude Code, Windsurf, Cline | Run type checkers and linters after generation | High -- catches syntax/type/import errors |
| **Input/Output Guardrails** | OpenAI Agents SDK, CrewAI, Pydantic AI | Validate against schemas or LLM-driven criteria | Medium-High |
| **Separate Evaluator Agent** | CrewAI, AWS Bedrock, LangGraph | Dedicated agent reviews using critique prompts | Medium |
| **Human-in-the-Loop Review** | Cline, Claude Code, Cursor, Codex CLI, LangGraph | Shows diffs for approval | High for safety |
| **Self-Check / Reflection** | General pattern (Reflexion, Self-Refine) | LLM critiques its own output | Low without external signals |
| **Structured Output Validation** | Pydantic AI, Claude Agent SDK | Pydantic schema validation of outputs; `ModelRetry` on failure | High for format correctness |

#### Framework-Specific Details

- **Aider**: Automatic lint-test-fix loop after each edit via `--lint-cmd` and `--test-cmd`. Non-zero exit triggers error feedback to LLM. [Linting and Testing - Aider](https://aider.chat/docs/usage/lint-test.html)

- **CrewAI**: Function-based and LLM-based task guardrails, chainable sequentially. Failed guardrails trigger retries. [Introduction to Task Guardrails in CrewAI](https://www.analyticsvidhya.com/blog/2025/11/introduction-to-task-guardrails-in-crewai/)

- **Pydantic AI**: `ModelRetry` mechanism -- validation failure generates `RetryPromptPart` sent back to LLM with error details. [Agents - Pydantic AI](https://ai.pydantic.dev/agent/)

- **OpenAI Agents SDK**: Input, output, and tool guardrails with tripwire mechanism. Input guardrails run in parallel with agent execution for latency optimization. [Guardrails - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/guardrails/)

- **agent-verify study**: Test execution-based verification achieved 62.8-64.0% on 500 SWE-bench tasks. [agent-verify - GitHub](https://github.com/SeungyounShin/agent-verify)

### The Reflexion Pattern and Its Limitations

Reflexion improved HumanEval from 80% to 91%, but the improvement came from **test feedback, not self-reflection**. Self-Refine shows most gains in round one; subsequent rounds yield minimal improvement. A single reflection round triples token consumption (~3,000 to ~9,000 tokens). **Best-of-N sampling** often outperforms iterative refinement at similar token cost. [The Research on LLM Self-Correction](https://vadim.blog/the-research-on-llm-self-correction)

### 3. Error Recovery Patterns

**Confidence: High**

- **Semantic Kernel Graph**: Most sophisticated -- 13 classified error types, 8 recovery actions, three-state circuit breaker (Closed/Open/Half-Open), `ResourceGovernor` with adaptive limits, `ErrorPolicyRegistry` for centralized recovery. [Error Handling - Semantic Kernel Graph](https://skgraph.dev/how-to/error-handling-and-resilience/)

- **LangGraph**: Three-tier recovery: (1) retry with exponential backoff, (2) fallback to alternative tools, (3) human-in-the-loop escalation. Anti-pattern: tools returning empty results cause hallucination -- solved by explicit `'NO_RESULTS_FOUND'` signals. [Production Multi-Agent System with LangGraph](https://markaicode.com/langgraph-production-agent/)

- **Mastra**: Two-level retry (workflow-level + step-level override), lifecycle callbacks (`onFinish`, `onError`), model fallbacks that auto-retry with backup models. [Error Handling - Mastra Docs](https://mastra.ai/docs/workflows/error-handling)

- **smolagents**: Stores errors in agent memory as `AgentError` entries, allowing LLM to see previous errors. Optional `final_answer_checks` validate outputs. When `max_steps` reached, synthesizes answer from accumulated context. [CodeAgent - DeepWiki](https://deepwiki.com/huggingface/smolagents/4.2-codeagent)

- **Claude Agent SDK**: Handles tool denial gracefully -- rejection message sent as tool result, agent typically tries different approach. Reports stop reasons including `error_max_turns`, `error_max_budget_usd`. Sessions can be resumed from where they stopped. [How the Agent Loop Works - Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/agent-loop)

- **Pydantic AI**: Distinguishes retries for transient failures from error handling for permanent failures. `ModelRetry` generates `RetryPromptPart`. Known limitation: retry decorators on individual tools may not trigger as expected. [Agents - Pydantic AI](https://ai.pydantic.dev/agent/)

### 4. Rollback Mechanisms

**Confidence: High**

Two clear categories: **git-based** (permanent) and **session-level snapshots** (ephemeral).

- **Cursor**: Automatic checkpoints before every Agent code edit, stored locally separate from git. Reported issues where restoration fails silently. [Checkpoints - Cursor Docs](https://cursor.com/docs/agent/chat/checkpoints)

- **Claude Code**: `/rewind` command (v2.0.0) with three restoration modes: restore code+conversation, conversation only, or code only. Limitation: bash commands (`rm`, `mv`, `cp`) are **not** tracked. [Checkpointing - Claude Code Docs](https://code.claude.com/docs/en/checkpointing)

- **Windsurf (Cascade)**: Named checkpoints with per-step revert. Reverts are **currently irreversible**. [Windsurf Cascade Docs](https://docs.windsurf.com/windsurf/cascade/cascade)

- **Cline**: Workspace snapshots at each step with "Compare" and "Restore" buttons. Options: "Restore Workspace Only" or "Restore Task and Workspace." [Cline GitHub](https://github.com/cline/cline)

- **OpenAI Codex CLI**: Relies on standard git workflows. Recommendation: patch-based workflows (`git diff`/`git apply`) and frequent commits. [Codex CLI Features](https://developers.openai.com/codex/cli/features/)

### 5. Checkpoint/Resume and Time Travel

**Confidence: High**

- **LangGraph**: Most comprehensive. Checkpointers save snapshots at each super-step (InMemorySaver, SQLite, PostgreSQL). **Time Travel** replays from any prior checkpoint. **Forking** creates execution branches with modified state. Failed nodes store pending writes from successful sibling nodes. [Persistence - LangGraph Docs](https://docs.langchain.com/oss/python/langgraph/persistence) | [Use Time Travel - LangGraph](https://docs.langchain.com/oss/python/langgraph/use-time-travel)

- **Claude Agent SDK**: Session persistence via `session_id`. Sessions can be resumed (`--continue`) or forked (`--continue --fork-session`). Automatic context compaction when window approaches limits. `PreCompact` hook fires before compaction. [How the Agent Loop Works - Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/agent-loop)

- **Claude Code**: Checkpoints persist across sessions. `/rewind` opens scrollable list of all prompts. Session forking creates new branch without modifying original. [Checkpointing - Claude Code Docs](https://code.claude.com/docs/en/checkpointing)

- **Mastra**: Workflow suspension with resume functionality. `stream()` method enables real-time monitoring. [Error Handling - Mastra Docs](https://mastra.ai/docs/workflows/error-handling)

### 6. Cross-Cutting Patterns

- **The Verification Imperative**: Most effective systems invest in "plumbing, not mirrors" -- verification infrastructure (test suites, linters) rather than introspective reflection. [The Research on LLM Self-Correction](https://vadim.blog/the-research-on-llm-self-correction)

- **CLI vs. General-purpose**: CLI coding agents universally rely on test execution and linting with session-level checkpoints. General-purpose frameworks provide programmatic error recovery policies and workflow-level checkpointing.

- **Cost awareness as control**: Claude Agent SDK enforces `max_turns` and `max_budget_usd`. LangGraph uses Pydantic validators for token budget caps. These prevent runaway agents.

## Key Unknowns

1. **Windsurf internal architecture**: Error recovery and checkpoint implementation details undocumented beyond user-facing features.
2. **Continue**: Very little documentation about error recovery, rollback, or verification mechanisms.
3. **Effectiveness metrics**: No comprehensive cross-framework benchmark comparing verification strategies under controlled conditions.
4. **Production failure rates**: No published data on real-world checkpoint recovery success rates.
5. **AG2/AutoGen error recovery internals**: Not well-documented compared to Semantic Kernel Graph or LangGraph.
6. **Best-of-N vs. iterative refinement in production**: Research suggests Best-of-N often outperforms, but production adoption data is scarce.
7. **Claude Code bash command limitation**: No data on how frequently untracked bash commands cause recovery failures.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 20+
