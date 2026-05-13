# Follow-up 2: Practical Harness Engineering Ecosystem (2025-2026)

## Question
What practical harness engineering frameworks exist beyond the academic/research tools surveyed in Axis 1, and how do they compare in philosophy, architecture, and developer adoption?

## Context
The HumanLayer article "Skill Issue: Harness Engineering for Coding Agents" crystallizes a 2026 consensus: **the harness, not the model, is the bottleneck**. This follow-up maps the practitioner-focused harness ecosystem that has emerged alongside the academic frameworks already surveyed.

## The HumanLayer Framework: Six Configuration Levers

Source: [HumanLayer Blog](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

The article defines the fundamental equation: `coding agent = AI model(s) + harness`, where the harness is the runtime environment and peripheral systems through which a model interacts with its environment. It identifies six configuration levers:

### 1. CLAUDE.md / AGENTS.md Files
- Markdown files at repo root injected into system prompts
- **ETH Zurich finding**: human-written agentfiles gave only ~4% improvement; LLM-generated ones *hurt* performance while using 20%+ more tokens
- Best practices: keep under 60 lines, avoid auto-generation, use progressive disclosure, remain universally applicable

### 2. MCP Servers (Model Context Protocol)
- Tool descriptions injected into system prompts — security risk from untrusted servers
- Too many tools push agents into "the dumb zone" (context window pollution)
- Better to use CLI commands already in training data than duplicate via MCP
- Anthropic's tool search enables progressive tool disclosure

### 3. Skills
- Reusable knowledge modules with on-demand activation (SKILL.md files)
- Support recursive file structures for organized information architecture
- **Security concern**: skill registries have distributed malicious skills — treat like untrusted npm packages

### 4. Sub-Agents
- Isolated sessions preventing context pollution in parent threads
- Key benefits: context isolation, coherency maintenance, cost optimization (cheaper models for sub-tasks)
- **Chroma's context rot research**: performance degrades at longer context lengths, especially with low semantic similarity

### 5. Hooks
- Automated scripts at lifecycle events (notifications, approval logic, verification)
- Example: biome formatting + TypeScript checks — silent on success, surfacing errors only on failure

### 6. Back-Pressure Mechanisms
- Verification systems: type checking, builds, tests, code coverage, UI interaction testing
- **Critical principle**: verification must be context-efficient — only surface errors, not passing test output

### What Didn't Work (Anti-Patterns)
- Upfront harness design before encountering real failures
- Installing dozens of skills/MCP servers "just in case"
- Running full test suites after every agent action (4,000+ line context pollution)
- Micro-optimizing tool access across sub-agents

### What Did Work
- Start simple, add configuration only upon failure
- Test, iterate, discard unhelpful components
- Distribute battle-tested configurations team-wide
- Optimize iteration speed over first-attempt success

### Key Research Citation
- **Terminal Bench 2.0**: Models can be over-fitted to their training harness; Opus achieved #33 in Claude Code but #5 in a different harness — demonstrating that harness matters as much as model

---

## Spec-Driven Development (SDD) Frameworks

The 2025-2026 period saw an explosion of spec-driven frameworks that formalize the harness around specifications as first-class artifacts. The core thesis: **specifications become the source of truth, code becomes their expression**.

### OpenSpec
- **Creator**: Fission AI (YC-backed)
- **Repo**: [github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)
- **Philosophy**: Lightweight, universal, no API keys or MCP required
- **Architecture**: `openspec/` folder in repo with:
  - `openspec/specs/` — spec library organized by capability
  - `openspec/changes/` — per-feature change tracking (proposal.md, design.md, tasks.md, spec deltas)
- **Workflow**: Generate proposal.md (why) → specs/ (requirements/scenarios) → design.md (technical approach) → tasks.md (implementation checklist)
- **Storage**: Markdown-based filesystem, lives alongside source code in Git ("living documentation")
- **Compatibility**: Works with 20+ tools including Claude Code, Cursor, GitHub Copilot
- **Differentiator**: Purely spec-focused — no execution engine, no agent orchestration, just the specification layer
- **Sources**: [openspec.dev](https://openspec.dev/), [YC Launch](https://www.ycombinator.com/launches/Pdc-openspec-the-spec-framework-for-coding-agents)

### GitHub Spec Kit
- **Creator**: GitHub (official)
- **Repo**: [github.com/github/spec-kit](https://github.com/github/spec-kit)
- **Philosophy**: Preemptively outline requirements before handing off to AI agents
- **Architecture**: `.specify/` directory with:
  - `spec.md` — project goals and requirements
  - `plan.md` — approach and architecture
  - `tasks/` — individual work units from plan
  - `constitution.md` (optional) — project principles/standards
- **Workflow**: Three slash commands: `/specify` (generate spec) → `/plan` (technical implementation plan) → tasks (small, reviewable chunks)
- **Key Feature**: AGENT_CONFIG registry system supporting 16+ AI coding assistants with format variations
- **Differentiator**: Agent-agnostic abstraction layer; research agents gather context during specification
- **Martin Fowler coverage**: [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- **Sources**: [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/), [Microsoft Dev Blog](https://developer.microsoft.com/blog/spec-driven-development-spec-kit)

### Kiro (Amazon)
- **Creator**: Amazon (built on Amazon Bedrock, powered by Claude Sonnet)
- **Site**: [kiro.dev](https://kiro.dev/)
- **Philosophy**: Full IDE with spec-driven development built in, not a plugin
- **Architecture**: Three-phase spec workflow:
  1. Generate user stories with acceptance criteria
  2. Create technical design with diagrams and schemas
  3. Break work into trackable implementation tasks
- **Key Features**: MCP support, steering rules, agentic chat, hooks system
- **Differentiator**: Only full IDE purpose-built for SDD; not an AWS service despite Amazon backing
- **Note**: Not open-source — commercial product in public preview
- **Sources**: [InfoQ](https://www.infoq.com/news/2025/08/aws-kiro-spec-driven-agent/), [The New Stack](https://thenewstack.io/aws-kiro-testing-an-ai-ide-with-a-spec-driven-approach/)

### BMAD Method (Breakthrough Method for Agile AI-Driven Development)
- **Repo**: [github.com/bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **Philosophy**: Full lifecycle from ideation through agentic implementation with specialized AI agents
- **Architecture**: Two-phase approach:
  1. **Agentic Planning**: Specialized agents (Analyst, PM, Architect) create PRDs and architecture docs
  2. **Context-Engineered Development**: Scrum Master agent transforms plans into "hyper-detailed development stories" — self-contained story files with full architectural context, implementation guidelines, embedded rationale, and testing criteria
- **Key Innovation**: "Epic sharding" — systematic decomposition of PRD into self-contained knowledge packages
- **Differentiator**: Most role-heavy approach; each AI agent has a distinct persona and responsibility boundary
- **Sources**: [docs.bmad-method.org](https://docs.bmad-method.org/), [GMO Research Blog](https://recruit.group.gmo/engineer/jisedai/blog/the-bmad-method-a-framework-for-spec-oriented-ai-driven-development/)

### Taskmaster AI
- **Repo**: [github.com/eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- **Philosophy**: Project management layer for AI agents — "The PM for your AI agent"
- **Architecture**: Task decomposition and dependency management:
  - Automatic PRD creation and task breakdown
  - Subtask decomposition with dependency validation
  - Multi-role AI configuration (main, research, fallback)
  - Multi-provider support (OpenAI, Anthropic, Google Gemini)
- **Key Feature**: Long-term context maintenance across large-scale projects; prevents context loss
- **Differentiator**: Task management focus rather than spec-driven; more operational than architectural
- **Claimed Result**: 90% reduction in coding errors
- **Sources**: [taskmaster.one](https://www.taskmaster.one/), [Geeky Gadgets](https://www.geeky-gadgets.com/taskmaster-ai-coding-efficiency/)

---

## Claude Code-Specific Harnesses

### GSD (Get Shit Done) — Extended Notes
Building on Axis 1 coverage, GSD has evolved significantly:
- **Stars**: ~23K on GitHub as of March 2026
- **Architecture**: Standalone CLI built on Pi SDK with direct TypeScript access to the agent harness
- **Capabilities beyond Axis 1 coverage**:
  - Clear context between tasks
  - Inject exactly the right files at dispatch time
  - Manage git branches autonomously
  - Track cost and tokens
  - Detect stuck loops and recover from crashes
  - Auto-advance through entire milestones without human intervention
- **Multi-runtime**: Supports Claude Code, OpenCode, and Gemini CLI
- **Core workflow**: discuss → plan → execute → verify (four phases)
- **Sources**: [github.com/gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done), [codecentric Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system)

### Superpowers
- **Creator**: Jesse Vincent (obra)
- **Repo**: [github.com/obra/superpowers](https://github.com/obra/superpowers)
- **Stars**: ~82K on GitHub (largest in category)
- **Philosophy**: Software development methodology as skills — turns Claude Code into "a disciplined senior developer"
- **Architecture**: Skills-based progressive disclosure:
  - Brainstorming skills activate before writing code
  - Writing-plans skills break work into 2-5 minute tasks with exact file paths
  - TDD enforcement: automatically deletes code written before tests exist
  - Code review skills for verification
- **Key Result**: Test coverage 85-95% (enterprise level) due to mandatory TDD
- **Claimed Autonomy**: ~2 hours of autonomous work without deviation from plan
- **Differentiator**: Methodology-first (TDD, brainstorming, systematic debugging) rather than spec-first or task-first
- **Sources**: [blog.fsck.com](https://blog.fsck.com/2025/10/09/superpowers/), [Superpowers 5 release](https://blog.fsck.com/2026/03/09/superpowers-5/)

### claude-code-harness (Chachamaru)
- **Repo**: [github.com/Chachamaru127/claude-code-harness](https://github.com/Chachamaru127/claude-code-harness)
- **Philosophy**: Autonomous Plan→Work→Review cycle with quality gates
- **Architecture**:
  - TypeScript guardrail engine (`core/`)
  - 5 verb skills: plan/execute/review/release/setup
  - 3 agents: worker/reviewer/scaffolder
  - Hooks system for lifecycle events
- **Key Feature**: `/harness-review` launches multiple code-reviewer sub-agents in parallel (security, performance, quality)
- **Differentiator**: Guardrail-focused — runtime enforcement of destructive write blocking, secret exposure prevention, force-push pattern detection
- **Sources**: [GitHub Architecture docs](https://github.com/Chachamaru127/claude-code-harness/blob/main/docs/ARCHITECTURE.md)

---

## Emerging Concepts

### HaaS (Harness as a Service)
- **Coined by**: vtrivedy
- **Paradigm shift**: LLM API → Harness API → Agent Query
- **Four customization inputs**: System Prompt, Tools/MCPs, Context, Subagents
- **Key metric**: Time to First Feedback (TTFF)
- **Prediction**: "Open App Store for Agents" where multiple customizable harnesses compete on developer experience
- **Source**: [vtrivedy.com](https://www.vtrivedy.com/posts/claude-code-sdk-haas-harness-as-a-service/)

### The Harness Hierarchy (2023-2026 Evolution)
1. **Prompt Engineering** (2023-2024): Single prompt optimization
2. **Context Engineering** (mid-2025): Systematic context management
3. **Harness Engineering** (2026): Full environment design for agents
- **Source**: [philschmid.de](https://www.philschmid.de/agent-harness-2026)

### Edit Format as Harness Lever
- Security researcher Can Boluk changed only the edit format used by agents across 16 LLMs using hash-based references
- Result: Grok Code Fast 1 jumped from **6.7% to 68.3%** on benchmarks
- Demonstrates that a single harness lever (edit format) can have 10x impact
- **Source**: Referenced in multiple 2026 harness engineering articles

---

## Comparative Matrix: Practical Harness Frameworks

| Framework | Type | Spec-Driven | Agent Orchestration | Multi-Runtime | TDD/Testing | Human Gates | Autonomy Level |
|---|---|---|---|---|---|---|---|
| **GSD** | CLI/Skills | Yes (full SDLC) | 12+ sub-agents | Claude/OpenCode/Gemini | UAT + verification agents | Interactive gating | High (milestone-level) |
| **Superpowers** | Skills | No (methodology) | Via Claude Code | Claude Code only | Mandatory TDD | Brainstorm approval | High (~2hr sessions) |
| **OpenSpec** | Spec Layer | Yes (spec-only) | None (spec-only) | 20+ tools | Not included | Spec review | Low (spec generation) |
| **Spec Kit** | Spec Layer | Yes (spec+plan+tasks) | None | 16+ assistants | Not included | /specify gates | Low (spec generation) |
| **Kiro** | Full IDE | Yes (built-in) | Built-in agents | Kiro only | Built-in hooks | Per-phase approval | Medium |
| **BMAD** | Multi-Agent | Yes (PRD-driven) | Analyst/PM/Architect/SM | Agent-agnostic | Story-level testing criteria | Story approval | Medium-High |
| **Taskmaster AI** | Task Manager | Partial (PRD→tasks) | Multi-role config | Multi-provider | Not primary focus | Task approval | Medium |
| **claude-code-harness** | Guardrail Harness | No (plan→work→review) | Worker/Reviewer/Scaffolder | Claude Code only | Review agents | Plan approval | Medium-High |

## Philosophical Divergences

1. **Spec-First (OpenSpec, Spec Kit, Kiro)**: Specifications are the primary artifact; code is their expression. Focus on *what* to build.

2. **Execution-First (GSD, Superpowers)**: Methodology and workflow discipline drive quality; specs emerge from structured processes. Focus on *how* to build.

3. **Guardrail-First (claude-code-harness)**: Runtime enforcement prevents bad outcomes; the harness constrains rather than guides. Focus on *preventing failure*.

4. **Role-First (BMAD)**: Specialized AI personas mirror human team roles; quality comes from separation of concerns. Focus on *who does what*.

5. **Task-First (Taskmaster AI)**: Decomposition and dependency management keep agents on track; quality comes from granularity. Focus on *staying organized*.

---

## Gaps Relative to Axis 1 Survey

1. **No head-to-head benchmarks**: No study compares GSD vs OpenSpec vs Spec Kit vs Superpowers on identical codebases
2. **Adoption metrics are self-reported**: GitHub stars (Superpowers 82K, GSD 23K) don't measure effectiveness
3. **Composability untested**: Can you layer OpenSpec (spec) + GSD (execution) + Superpowers (methodology)? No documented attempts
4. **Cost analysis absent**: Token costs per framework per project type are unquantified
5. **Long-running reliability**: Only anecdotal claims (Superpowers: "~2hr sessions", GSD: "milestone-level autonomy")
6. **Edit format research**: Can Boluk's 10x result from edit format changes warrants deeper investigation as a harness design dimension

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 28+
- Covers: HumanLayer article, OpenSpec, Spec Kit, Kiro, BMAD, Taskmaster AI, Superpowers, claude-code-harness, HaaS concept
