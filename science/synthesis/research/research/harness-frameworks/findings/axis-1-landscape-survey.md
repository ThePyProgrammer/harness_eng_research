# Axis 1: Landscape Survey of Existing Harness Frameworks

## Question
What existing frameworks orchestrate LLM coding agents across multi-stage software development workflows, and how do they structure their pipelines?

## Findings

### Comparison Table: Framework x Pipeline Stages x Key Design Choices

| Framework | Pipeline Stages | Agent Model | State Management | LLM Backend | Human-in-Loop |
|---|---|---|---|---|---|
| **MetaGPT** | Requirements > Architecture > Task Distribution > Engineering > QA | Multi-agent (5 roles) | Pub-sub message pool + structured docs | Model-agnostic | Minimal |
| **ChatDev** | Designing > Coding > Testing > Documentation | Dual-agent chat pairs per phase | Chat chain mechanism | Model-agnostic | Optional |
| **GSD (Claude Code)** | Discovery > Discussion > Planning > Execution > Validation > Completion | Sub-agents (12 specialized) | File-based (.planning/ dir) + Git | Claude-specific | Interactive gating |
| **OpenHands** | Event-stream perception-action loop (continuous) | Multi-agent hierarchical | Event log with replay | Model-agnostic | Configurable |
| **SWE-agent** | Issue intake > Context retrieval > Patch generation > Evaluation | Single agent | 5-step rolling context window | Model-agnostic | None |
| **Devin** | Planning > Code generation > Self-healing/debug > Deployment | Single autonomous agent | Sandboxed environment (terminal+editor+browser) | Proprietary | Slack/PR review |
| **Aider** | Ask > Architect > Code (with auto-lint/test) | Single agent, modal | Git-based (auto-commit) | Model-agnostic | Conversational |
| **Kilo Code** | Orchestrator decomposes > Architect > Coder > Debugger | Multi-mode orchestrator | Memory Bank (repo-resident) | Model-agnostic | Approval steps |
| **Roo Code** | Plan/Act dual-mode with 5 built-in modes | Multi-mode role-driven | Recursive reasoning state | Model-agnostic | Browser verification |
| **OpenDev** | Skills discovery > Subagent compilation > Agent creation > 6-phase ReAct loop | Multi-model (5 roles) | Dual-memory (episodic + working) | Multi-model | Approval checks |
| **Cursor Agent** | Understand > Search > Plan > Apply > Verify | Single agent loop | Editor state | Model-agnostic | Inline review |
| **Windsurf Cascade** | Planning agent (background) + Action model (foreground) | Dual-agent (planner + executor) | Persistent session state | Model-agnostic | Real-time awareness |
| **AutoCodeRover** | Context retrieval (AST search) > Patch generation | Single agent, 2-stage | AST-based code representation | Model-agnostic | None |

### Notable Architectural Patterns

**Pattern 1: Role-Based Assembly Line (MetaGPT, ChatDev)**

MetaGPT implements the most explicit multi-stage pipeline, with five sequential phases mirroring a real software company: Product Manager generates requirements documents, Architect produces system designs, Project Manager distributes tasks, Engineers implement code, and QA Engineers write tests [MetaGPT Paper](https://arxiv.org/html/2308.00352v6). Its key innovation is the publish-subscribe message pool where agents communicate through structured documents rather than freeform dialogue, reducing hallucination cascading [MetaGPT GitHub](https://github.com/FoundationAgents/MetaGPT). ChatDev uses a similar waterfall model (Designing > Coding > Testing > Documentation) but employs a "chat chain" mechanism where pairs of agents engage in dialogue at each phase [ChatDev GitHub](https://github.com/OpenBMB/ChatDev). **Confidence: High** -- both are well-documented in peer-reviewed papers.

**Pattern 2: Context-Window-Aware Phase Isolation (GSD, Anthropic Harness)**

The GSD workflow for Claude Code represents the most sophisticated mapping to the six stages in scope. It implements Discovery (requirements), Discussion (human-AI phase clarification), Planning (task decomposition), Execution (parallel task processing), Validation (phase verification), and Completion (milestone archival) as independent slash commands, each designed to run in a fresh context window [GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system). State persists via `.planning/` directory artifacts (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md) and Git commits. Anthropic's own engineering guidance recommends a two-agent architecture: an Initializer agent for first-session setup (creating feature lists in structured JSON) and a Coding agent for incremental sessions that reads progress artifacts before each cycle [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). **Confidence: High** -- primary sources from framework authors.

**Pattern 3: Agent-Computer Interface Simplification (SWE-agent, AutoCodeRover)**

SWE-agent's key contribution is the Agent-Computer Interface (ACI), which provides LLM-optimized commands (view_file, search_dir, edit_file, run_command) rather than exposing raw system interfaces [SWE-agent Paper](https://arxiv.org/abs/2405.15793). This constrains the action space to prevent common errors. AutoCodeRover extends this idea by searching through abstract syntax trees rather than raw text, enabling more semantically meaningful code navigation [AutoCodeRover - MIT AI Agent Index](https://aiagentindex.mit.edu/autocoderover/). Both operate as two-stage pipelines: context retrieval followed by patch generation. **Confidence: High** -- peer-reviewed (NeurIPS 2024 for SWE-agent).

**Pattern 4: Orchestrator-Specialist Decomposition (OpenDev, Kilo Code, Deep Agent Architecture)**

A newer pattern separates orchestration from execution using role-restricted agents. The Deep Agent Architecture uses three agent types: an Orchestrator (cannot modify code), an Explorer (read-only investigator), and a Coder (implementation specialist), communicating through a shared Context Store [Deep Agent Architecture](https://dev.to/apssouza22/a-deep-dive-into-deep-agent-architecture-for-ai-coding-assistants-3c8b). Kilo Code's Orchestrator Mode similarly decomposes tasks and routes subtasks to Architect, Coder, or Debugger specialists [Kilo Code Review](https://vibecoding.app/blog/kilo-code-review). OpenDev implements a six-phase ReAct loop per iteration (pre-check, thinking, self-critique, action, tool execution, post-processing) with five independently configurable model roles [OpenDev Harness Paper](https://arxiv.org/html/2603.05344v1). **Confidence: Medium-High** -- mix of open-source documentation and blog posts.

**Pattern 5: Event-Stream Architecture (OpenHands)**

OpenHands (formerly OpenDevin) models the entire agent-environment interaction as an event stream, capturing all actions and observations in a perception-action loop [OpenHands Paper](https://arxiv.org/abs/2407.16741). Its V1 SDK refactored from a monolithic design into modular packages with event-sourced state, deterministic replay, and typed tool systems with MCP integration [OpenHands SDK Paper](https://arxiv.org/html/2511.03690v1). It supports hierarchical multi-agent delegation where agents can spawn sub-agents for specialized tasks. This contrasts with SWE-agent's single-agent simplicity. **Confidence: High** -- multiple academic papers.

**Pattern 6: Dual-Agent Planning (Windsurf Cascade, Cursor Agent)**

IDE-embedded agents like Windsurf Cascade run a specialized planning agent continuously in the background while the selected model focuses on short-term actions [Windsurf Cascade Docs](https://docs.windsurf.com/windsurf/cascade/cascade). Cursor's agent mode implements a similar understand-search-plan-apply-verify loop [Cursor vs Windsurf Comparison](https://www.builder.io/blog/windsurf-vs-cursor). GitHub Copilot CLI now delegates to specialized agents (Explore, Task, Code Review, Plan) that can run in parallel [GitHub Copilot CLI GA](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/). **Confidence: Medium** -- commercial products with limited architectural disclosure.

### Mapping to the Six Workflow Stages

| Stage | Best Coverage | Partial Coverage | Absent |
|---|---|---|---|
| **Requirements Generation** | GSD (`/gsd:new-project`), MetaGPT (Product Manager) | Devin (requirement decomposition) | SWE-agent, AutoCodeRover |
| **Roadmap Generation** | GSD (ROADMAP.md artifact), MetaGPT (Architect phase) | ChatDev (Design phase) | Most single-agent tools |
| **Human-AI Discussion** | GSD (`/gsd:discuss-phase`), Aider (Ask/Architect modes) | Roo Code (Architect mode), Kilo Code | SWE-agent, AutoCodeRover, Devin |
| **Phase Planning** | GSD (`/gsd:plan-phase`), OpenDev (Plan Mode), Kilo Code (Orchestrator) | Cursor Agent (plan step), Windsurf (background planner) | SWE-agent |
| **Phase Execution** | All frameworks cover this stage | -- | -- |
| **Phase Verification** | GSD (`/gsd:verify-work`), Anthropic Harness (browser automation), Aider (auto-lint/test) | OpenHands (benchmark harness), SWE-agent (evaluation step) | ChatDev (limited) |

### Claude/Anthropic-Specific Capabilities

- **Extended thinking**: Claude's thinking mode enables plan-then-execute patterns where the model explicitly reasons before acting, which the OpenDev harness leverages via a dedicated "thinking" model role [OpenDev Harness Paper](https://arxiv.org/html/2603.05344v1).
- **Tool use with structured outputs**: Claude's native tool-use API enables typed tool schemas with validation, used by GSD's slash command system for permission-scoped agent execution [GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system).
- **Subagent delegation**: Claude Code's Task tool enables spawning isolated sub-agents with filtered tool schemas, a capability GSD uses for its 12 specialized agents [GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system).
- **JSON artifact resistance**: Anthropic's harness guidance specifically recommends structured JSON over markdown for feature tracking because Claude is less likely to inappropriately modify JSON structures [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).
- **GitHub Agent HQ integration**: Claude is now available as a first-class agent alongside OpenAI Codex in GitHub's multi-agent platform, enabling direct issue-to-PR workflows [GitHub Agent HQ](https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github/).

### Generalizable vs. Model-Specific Findings

**Generalizable across LLM backends:**
- The plan-execute-verify loop is universal across all surveyed frameworks
- File-based state persistence (markdown/JSON artifacts + Git) works regardless of model
- Role-restricted agents (read-only explorer, write-only coder) reduce errors across all models
- AST-based code search outperforms string matching regardless of the underlying LLM
- Context window management via phase isolation is backend-agnostic

**Model-specific advantages:**
- Extended thinking / chain-of-thought integration varies by model capability
- Tool-use API quality and structured output reliability differ across providers
- Claude's longer context windows (200K+) enable different chunking strategies than shorter-context models
- Aider reports Claude 3.7 Sonnet as its best-performing backend [Aider Website](https://aider.chat/), suggesting model-specific tuning matters

### Key Unknowns

1. **Empirical comparison of pipeline architectures**: No study directly compares multi-stage pipeline approaches (MetaGPT-style role-based vs. GSD-style phase-isolated vs. SWE-agent-style single-loop) on identical benchmarks.
2. **Human-AI discussion stage formalization**: Only GSD explicitly implements a "discussion" phase. How other frameworks handle requirement ambiguity resolution is poorly documented.
3. **Windsurf Cascade internals**: The dual planning-agent architecture is described at a high level in docs, but the actual planning algorithm and state representation are not publicly disclosed.
4. **Devin's internal architecture**: As a proprietary system, Devin's detailed pipeline structure, agent decomposition, and state management are not publicly documented beyond marketing descriptions.
5. **Cost-effectiveness of multi-agent vs. single-agent**: Kilo Code's orchestrator mode "burns through credits faster than expected" [Kilo Code Review](https://vibecoding.app/blog/kilo-code-review), but systematic cost comparisons across architectures are absent.
6. **Verification stage maturity**: Most frameworks treat verification as an afterthought (run tests, check linter). Only Anthropic's harness guidance and GSD explicitly address browser-based end-to-end verification, and empirical data on verification effectiveness is scarce.
7. **Long-running agent reliability**: Anthropic notes that agents tend to "mark features as complete without proper testing" [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), but systematic studies of false-completion rates across frameworks are unavailable.
8. **Microsoft Agent Framework's coding capabilities**: Announced late 2025, combining Semantic Kernel and AutoGen ideas with graph-based workflows [AI Multiple](https://aimultiple.com/agentic-orchestration), but its application to software development pipelines specifically is not yet well-documented.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 21
