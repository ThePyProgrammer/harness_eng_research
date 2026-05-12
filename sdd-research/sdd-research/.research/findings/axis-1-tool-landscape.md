# Axis 1: Tool Landscape & Architecture Survey

## Question
What spec-driven agentic coding tools exist, what are their repos/maturity levels, and how are they architecturally structured at a high level?

## Findings

# Catalog of Spec-Driven Agentic Coding Tools (March 2026)

## Methodology

This catalog was assembled through systematic web searches of GitHub repositories, topic pages, comparison articles, and project documentation. Every factual claim is sourced. The tools are organized roughly by maturity (stars as a proxy), with architectural notes and platform support for each.

---

## Tier 1: Major Ecosystem Players (10,000+ stars)

### 1. GitHub Spec Kit
- **Repo**: [github/spec-kit](https://github.com/github/spec-kit)
- **Stars**: 76,000 | **Forks**: 6,500 | **Commits**: 604
- **Platform**: Agent-agnostic -- supports 20+ agents including Claude Code, Cursor, Copilot, Gemini CLI, Windsurf, Kiro CLI, Qwen Code
- **Tech Stack**: Python 3.11+, installed via `uv tool install specify-cli`
- **Maturity**: High. GitHub-backed, MIT licensed, active development, 530 open issues
- **Architecture**: Four-phase gated pipeline: Constitution (immutable principles) -> Specify -> Plan -> Tasks -> Implement. Slash commands (`/speckit.specify`, `/speckit.plan`, etc.) drive workflow. Generates markdown spec artifacts that become the "source of truth" for agents. [GitHub Blog - SDD Toolkit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- **Philosophy**: Intent-driven development where specifications precede implementation. Multi-step refinement rather than one-shot generation. No vendor lock-in.
- **Confidence**: HIGH

### 2. BMAD-METHOD
- **Repo**: [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **Stars**: 40,300 | **Forks**: 4,900 | **Contributors**: 124
- **Platform**: Claude Code, Cursor, and other AI IDEs
- **Tech Stack**: JavaScript (94.4%), Node.js v20+; installed via `npx bmad-method install`
- **Maturity**: High. v6.0.4 (March 2026), 24 releases, active Discord community
- **Architecture**: Multi-agent simulation with 21+ specialized AI agent personas (PM, Architect, Developer, UX, Scrum Master, QA). 34+ workflows organized around agile methodology. "Party Mode" enables multiple agent collaboration in single sessions. Scale-adaptive intelligence adjusts from bug fixes to enterprise systems. [BMAD-METHOD Repo](https://github.com/bmad-code-org/BMAD-METHOD)
- **Philosophy**: "Agentic Agile Driven Development" -- simulates a full human agile team with specialized roles. Most complete SDD framework with lifecycle coverage from brainstorming through deployment. [Comparison Article](https://redreamality.com/blog/-sddbmad-vs-spec-kit-vs-openspec-vs-promptx/)
- **Confidence**: HIGH

### 3. OpenSpec (Fission AI, YC-backed)
- **Repo**: [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)
- **Stars**: 29,700 | **Latest Release**: v1.2.0 (Feb 23, 2026)
- **Platform**: 20+ AI assistants including Claude Code, GitHub Copilot, Cursor, Windsurf
- **Tech Stack**: TypeScript (98.7%), Node.js 20.19.0+; installed via `npm install -g @fission-ai/openspec@latest`
- **Maturity**: High. YC-launched, 29.7k stars in under 6 months
- **Architecture**: Adds an `openspec/` folder with a spec library (`openspec/specs/`) organized by capability, and a changes system (`openspec/changes/`) where each feature gets a proposal, design, implementation tasks, and spec deltas. Artifact-guided workflow with commands like `/opsx:propose`. Fluid iteration without rigid phase gates. [OpenSpec Repo](https://github.com/Fission-AI/OpenSpec)
- **Philosophy**: Brownfield-first -- designed for iterating on existing codebases (1->n) rather than greenfield (0->1). Lightweight single source of truth rather than distributing specs across many files. [Comparison Article](https://redreamality.com/blog/-sddbmad-vs-spec-kit-vs-openspec-vs-promptx/)
- **Confidence**: HIGH

### 4. GSD (Get Shit Done) v1
- **Repo**: [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)
- **Stars**: 28,300 | **Forks**: 2,400
- **Platform**: Claude Code (primary), OpenCode, Gemini CLI, Codex
- **Tech Stack**: JavaScript/Node.js; installed via `npx get-shit-done-cc@latest`
- **Maturity**: High. Viral adoption, active maintenance
- **Architecture**: Context engineering system with fresh context windows per execution unit (~200k tokens). XML-structured plans with embedded verification. Wave-based parallel task execution with dependency awareness. Multi-agent orchestration with parallel researchers, planners, and executors. State persisted in `STATE.md`. Phases: Initialize -> Discuss -> Plan -> Execute -> Verify. [GSD Repo](https://github.com/gsd-build/get-shit-done)
- **Philosophy**: Execution-first, "the complexity is in the system, not in your workflow." Context isolation prevents quality degradation across extended sessions. Atomic git commits per task.
- **Confidence**: HIGH

### 5. Taskmaster AI (claude-task-master)
- **Repo**: [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- **Stars**: 25,900 | **Forks**: 2,500 | **Commits**: 1,212
- **Platform**: Cursor, Windsurf, VS Code, Claude Code, Roo, Amazon Q CLI
- **Tech Stack**: TypeScript/JavaScript, npm monorepo; `npm install -g task-master-ai` or MCP integration
- **Maturity**: High. 1,212 commits, active development, MCP-compliant
- **Architecture**: AI-powered task management with PRD parsing. Selective tool loading in 3 modes: core (7 tools), standard (15), all (36) to optimize context window usage. Supports 10+ LLM providers (Anthropic, OpenAI, Gemini, Perplexity, xAI, etc.). Task decomposition from PRDs, dependency tracking, complexity analysis. [Taskmaster Repo](https://github.com/eyaltoledano/claude-task-master)
- **Philosophy**: Task management layer rather than full workflow orchestrator. PRD-first approach -- parses existing requirement documents into actionable tasks. Emphasis on fitting into existing IDE workflows via MCP.
- **Confidence**: HIGH

---

## Tier 2: Established Tools (1,000 - 10,000 stars)

### 6. Agent OS
- **Repo**: [buildermethods/agent-os](https://github.com/buildermethods/agent-os)
- **Stars**: 4,100 | **Forks**: 702 | **Version**: v3.0.0 (Jan 2026)
- **Platform**: Claude Code, Cursor, Antigravity
- **Tech Stack**: Shell (100%); pure bash scripts, no dependencies
- **Architecture**: Standards injection system with four functions: Discover Standards (surfaces patterns from codebase), Deploy Standards (contextual injection), Shape Spec (structured planning), Index Standards (maintains discoverable collections). In v3, spec creation defers to the AI agent's plan mode. [Agent OS Website](https://buildermethods.com/agent-os)
- **Philosophy**: Not a full SDD framework -- focuses on injecting codebase standards into AI agent context so specs reflect actual project conventions. "Any language, any framework."
- **Confidence**: HIGH

### 7. cc-sdd
- **Repo**: [gotalab/cc-sdd](https://github.com/gotalab/cc-sdd)
- **Stars**: 2,800 | **Forks**: 227 | **Version**: v2.1.1 (Feb 2026), 16 contributors
- **Platform**: 8 agents -- Claude Code (with subagents), Cursor, Gemini CLI, Codex CLI, GitHub Copilot, Qwen Code, OpenCode, Windsurf
- **Tech Stack**: TypeScript (99.3%); installed via `npx cc-sdd@latest --claude --lang en`
- **Architecture**: Kiro-style workflow: Requirements -> Design -> Tasks -> Implementation. EARS-format requirements, Mermaid diagram architecture visualization, task dependency tracking for parallel execution. Supports 13 languages. Cross-session project memory via steering files. [cc-sdd Repo](https://github.com/gotalab/cc-sdd)
- **Philosophy**: Brings Kiro's structured workflow to non-Kiro agents. Team-aligned templates with customizable rules.
- **Confidence**: HIGH

### 8. Pilot Shell
- **Repo**: [maxritter/pilot-shell](https://github.com/maxritter/pilot-shell)
- **Stars**: 1,500
- **Platform**: Claude Code (exclusively)
- **Tech Stack**: Claude Code plugin system
- **Architecture**: Quality-first enforcement layer on top of Claude Code. Linting, formatting, and type checking as enforced hooks on every edit. TDD mandatory. Opus for planning, Sonnet for implementation. Plan-reviewer sub-agent validates completeness. Unified spec-reviewer for deep code review. `/spec` starts a task, `/sync` learns the codebase. [Pilot Shell Repo](https://github.com/maxritter/pilot-shell)
- **Philosophy**: "Claude Code is powerful. Pilot Shell makes it reliable." Focus on production-grade code with automated quality gates rather than just spec generation.
- **Confidence**: HIGH

---

## Tier 3: Growing Tools (100 - 1,000 stars)

### 9. Spec Kitty
- **Repo**: [Priivacy-ai/spec-kitty](https://github.com/Priivacy-ai/spec-kitty)
- **Stars**: 898 | **Version**: v0.16.2 stable / v1.0.0a1 alpha (Feb 2026)
- **Platform**: 12 agents -- Claude, Cursor, GitHub Copilot, Gemini CLI, and 8 others
- **Tech Stack**: Python 3.11+; `pip install spec-kitty-cli` or `uv tool install spec-kitty-cli`
- **Architecture**: Linear workflow: spec -> plan -> tasks -> implement -> review -> merge. Artifacts stored in `kitty-specs/` directories. Git worktree isolation for parallel work. Real-time Kanban dashboard with automatic state transitions. 13 slash commands per agent. External orchestration for multi-agent coordination. [Spec Kitty Repo](https://github.com/Priivacy-ai/spec-kitty)
- **Philosophy**: "Spec-Driven Development for serious software developers." Emphasis on worktree isolation preventing branch contention, and real-time visibility via Kanban dashboard.
- **Confidence**: HIGH

### 10. Shotgun
- **Repo**: [shotgun-sh/shotgun](https://github.com/shotgun-sh/shotgun)
- **Stars**: 639 | **License**: MIT
- **Platform**: Cursor, Claude Code, Windsurf, Codex, Lovable
- **Tech Stack**: Python 3.11+, tree-sitter for code parsing, PostHog analytics; `uvx shotgun-sh@latest`
- **Architecture**: Router-driven with 5 specialized agents: Research -> Specify -> Plan -> Tasks -> Export. Full codebase indexing via tree-sitter before spec generation. Two modes: Planning (checkpointed) and Drafting (end-to-end). Generates structured `AGENTS.md` specs. LLM-agnostic (OpenAI, Anthropic, Gemini). [Shotgun Repo](https://github.com/shotgun-sh/shotgun)
- **Philosophy**: "Codebase-aware specs so agents don't derail." Research-first -- discovers existing patterns and external solutions before planning. Splits features into staged PRs with file-by-file instructions.
- **Confidence**: HIGH

### 11. GSD-2 (standalone CLI)
- **Repo**: [gsd-build/GSD-2](https://github.com/gsd-build/GSD-2)
- **Stars**: 575
- **Platform**: 20+ LLM providers via Pi SDK (Anthropic, OpenAI, Gemini, OpenRouter, GitHub Copilot, Bedrock, Azure, Groq, etc.)
- **Tech Stack**: TypeScript, built on Pi SDK; `npm install -g gsd-pi`
- **Architecture**: "The evolution of GSD -- now a real coding agent." State-driven automation with `.gsd/` as source of truth on disk. Fresh context per task (~200k tokens). Branch-per-slice git strategy with squash merges. Three specialized subagents: Scout (recon), Researcher (web), Worker (execution). 13 bundled extensions. Hierarchy: Milestone -> Slice -> Task, through Research -> Plan -> Execute -> Complete -> Reassess. [GSD-2 Repo](https://github.com/gsd-build/GSD-2)
- **Philosophy**: Move from prompt-layer orchestration (GSD v1) to a true standalone agent that can clear context, manage git, track costs, detect stuck loops, and recover from crashes autonomously.
- **Confidence**: HIGH

### 12. mcp-server-spec-driven-development
- **Repo**: [formulahendry/mcp-server-spec-driven-development](https://github.com/formulahendry/mcp-server-spec-driven-development)
- **Stars**: 428
- **Platform**: VS Code, VS Code Insiders, Cursor, Claude Code, any MCP-compatible environment
- **Tech Stack**: TypeScript (89.2%), Node.js 20+; `npx -y mcp-server-spec-driven-development@latest`
- **Architecture**: MCP server exposing 3 prompt-based tools for a three-stage workflow: EARS-format requirements generation -> design document creation -> code implementation. Lightweight and protocol-native. [MCP SDD Repo](https://github.com/formulahendry/mcp-server-spec-driven-development)
- **Philosophy**: Minimal MCP-first approach. "Not just Vibe Coding." Creates traceable path from requirements through design to implementation using existing MCP infrastructure.
- **Confidence**: HIGH

### 13. AI Factory
- **Repo**: [lee-to/ai-factory](https://github.com/lee-to/ai-factory)
- **Stars**: 371 | **Version**: v2.7.0 (Mar 2026), 22 releases
- **Platform**: 14+ agents -- Claude Code, Cursor, Windsurf, Roo Code, Kilo Code, Antigravity, OpenCode, Warp, Zencoder, Codex CLI, Copilot, Gemini CLI, Junie, Qwen Code
- **Tech Stack**: TypeScript 51.4%, Shell 23.2%, Python 13.8%; `npm install -g ai-factory` or `npx ai-factory init`
- **Architecture**: Skill-based modular system with slash commands (`/aif-plan`, `/aif-implement`, `/aif-fix`). Community skill marketplace via skills.sh. Zero-configuration setup, stack-agnostic. [AI Factory Repo](https://github.com/lee-to/ai-factory)
- **Philosophy**: "Stop configuring. Start building." AI follows plans, not random exploration. Predictable, resumable, reviewable.
- **Confidence**: HIGH

### 14. SpecPulse
- **Repo**: [specpulse/specpulse](https://github.com/specpulse/specpulse)
- **Stars**: 366 | **Version**: 2.7.5
- **Platform**: 8 agents -- Claude Code, Gemini CLI, Windsurf, Cursor, GitHub Copilot, OpenCode, Crush, Qwen Code
- **Tech Stack**: Python 3.11+; `pip install specpulse`
- **Architecture**: CLI-first with AI enhancement. 11 commands (`/sp-pulse`, `/sp-spec`, `/sp-plan`, `/sp-task`, `/sp-execute`, etc.). CLI foundation ensures reliable file/directory operations even if AI fails. All platforms get identical `/sp-*` prefix commands. [SpecPulse Repo](https://github.com/specpulse/specpulse)
- **Philosophy**: Universal platform support with CLI fallback protection. Team collaboration across different AI platforms on the same project.
- **Confidence**: HIGH

### 15. Smart Ralph
- **Repo**: [tzachbon/smart-ralph](https://github.com/tzachbon/smart-ralph)
- **Stars**: 249 | **Commits**: 153
- **Platform**: Claude Code (primary), Codex, Cursor, Gemini
- **Tech Stack**: JavaScript/TypeScript, Claude Code plugin system
- **Architecture**: Combines Ralph Wiggum loop (iterative execution) with structured spec workflow. Two methodologies: Ralph-specum (custom) and Ralph-speckit (GitHub Spec Kit methodology). Specialized sub-agents for Research, Requirements, Design, and Execution. Codebase indexing to discover existing components. Fresh context per task with approval checkpoints. [Smart Ralph Repo](https://github.com/tzachbon/smart-ralph)
- **Philosophy**: "Turns vague feature ideas into structured specs, then executes them task-by-task." POC-first task breakdown strategy. Self-contained execution loop.
- **Confidence**: HIGH

### 16. PAUL
- **Repo**: [ChristopherKahler/paul](https://github.com/ChristopherKahler/paul)
- **Stars**: 247 | **Forks**: 26 | **License**: MIT
- **Platform**: Claude Code (exclusively -- anti-multi-agent philosophy)
- **Tech Stack**: JavaScript/TypeScript, npm; `npx paul-framework`
- **Architecture**: Three-phase loop: PLAN -> APPLY -> UNIFY. Every plan closes with UNIFY (reconcile planned vs actual, update STATE.md, log decisions). BDD-format acceptance criteria (Given/When/Then) as first-class citizens. CARL integration for dynamic context rule injection. State in `.paul/` directory with PROJECT.md, ROADMAP.md, STATE.md, and numbered phase plans. [PAUL Repo](https://github.com/ChristopherKahler/paul)
- **Philosophy**: "Quality over speed-for-speed's-sake." Mandatory loop closure -- no orphan plans. In-session context prioritized over subagent spawning ("subagents produce ~70% quality work that needs cleanup"). Acceptance-Driven Development (A.D.D.).
- **Confidence**: HIGH

### 17. Lean-Spec
- **Repo**: [codervisor/lean-spec](https://github.com/codervisor/lean-spec)
- **Stars**: 197 | **Version**: v0.2.27 (Mar 2026), 22 releases
- **Platform**: Claude Code, Cursor, Windsurf, GitHub Copilot (via MCP server)
- **Tech Stack**: TypeScript 48.2%, Rust 47.8%; `npx lean-spec init` or `npm install -g lean-spec`; requires Node.js 20+, pnpm 10+
- **Architecture**: Small, focused documents (<2,000 tokens each). MCP server integration. Kanban board (`lean-spec board`), web UI dashboard, project metrics. Spec dependency tracking via `depends_on` and `related` metadata. Agent Skills framework teaches AI assistants SDD methodology. [Lean-Spec Repo](https://github.com/codervisor/lean-spec)
- **Philosophy**: Agile principles applied to SDD -- "living documents that grow with your code." Small specs lead to better AI output. Lightweight enough that specs actually get updated.
- **Confidence**: HIGH

### 18. Spec Kit Plus
- **Repo**: [panaversity/spec-kit-plus](https://github.com/panaversity/spec-kit-plus)
- **Stars**: 191 | **Forks**: 88
- **Platform**: 16+ agents including Claude Code, Cursor, Gemini, Copilot, Windsurf, Amazon Q, Amp
- **Tech Stack**: Python; `pip install specifyplus` or `uv tool install specifyplus`
- **Architecture**: Fork of github/spec-kit extended with patterns for multi-agent AI systems. Adds OpenAI Agents SDK, MCP, A2A protocol, Kubernetes, Dapr, and Ray support. Treats specifications, architecture history, prompt history, tests, and automated evaluations as first-class artifacts. [Spec Kit Plus Repo](https://github.com/panaversity/spec-kit-plus)
- **Philosophy**: Bridge from spec-driven individual development to scalable multi-agent AI systems. Enterprise production-ready stack focus.
- **Confidence**: HIGH

### 19. spec-driven-agentic-development
- **Repo**: [marcelsud/spec-driven-agentic-development](https://github.com/marcelsud/spec-driven-agentic-development)
- **Stars**: 166 | **Forks**: 22 | **Last commit**: Jan 2025
- **Platform**: Claude Code (via `.claude/` directory structure)
- **Tech Stack**: Pure methodology -- markdown files and Claude slash commands; installed via `npx degit marcelsud/spec-driven-agentic-development/.claude .claude`
- **Architecture**: Minimal spec framework. Feature specs organized as `features/[name]/` with context.md, requirements.md, and tasks.md. Four commands: `/spec:create`, `/spec:execute`, `/spec:list`, `/spec:status`. EARS-formatted requirements, TDD task breakdown. [SDAD Repo](https://github.com/marcelsud/spec-driven-agentic-development)
- **Philosophy**: Lightweight methodology reference rather than heavy framework. Optimized for drop-in use with Claude Code's native command system.
- **Confidence**: HIGH

### 20. ContextKit
- **Repo**: [FlineDev/ContextKit](https://github.com/FlineDev/ContextKit)
- **Stars**: 160 | **Last commit**: Nov 2024
- **Platform**: Claude Code (exclusively)
- **Tech Stack**: Markdown-based system with bash installer; `curl -fsSL ... | bash`
- **Architecture**: Four-phase methodology: Business Case specification -> Technical architecture planning -> Implementation task breakdown (S001-S999 numbering) -> Quality-driven development with specialized agents. Built-in quality agents for build validation, testing, accessibility, localization. Auto-context preservation across sessions. [ContextKit Repo](https://github.com/FlineDev/ContextKit)
- **Note**: README indicates "no longer actively maintained" -- evolved into PlanKit
- **Philosophy**: Swift/SwiftUI focused. Proactive planning intelligence. Constitutional compliance embedded in templates.
- **Confidence**: MEDIUM (project deprecated/evolved)

### 21. spec-kit-command-cursor
- **Repo**: [madebyaris/spec-kit-command-cursor](https://github.com/madebyaris/spec-kit-command-cursor)
- **Stars**: 158 | **Version**: v5.0
- **Platform**: Cursor IDE 2.5+ (exclusively)
- **Tech Stack**: Cursor IDE plugin
- **Architecture**: 6 specialized subagents (foreground + background execution), 5 domain-specific skills with progressive context loading. Async execution with DAG support. Background subagents allow parent agent to continue working. Subagents can spawn their own subagents for true parallel DAG execution. File conflict detection, deadlock detection, per-task timeouts. [SDD Cursor Repo](https://github.com/madebyaris/spec-kit-command-cursor)
- **Philosophy**: Cursor-native SDD with advanced orchestration. Multi-pass research with web search, documentation deep-dives, and confidence scoring.
- **Confidence**: HIGH

---

## Tier 4: Niche / Emerging Tools (<100 stars or not separately enumerable)

### 22. Spec-Flow
- **Repo**: [marcusgoll/Spec-Flow](https://github.com/marcusgoll/Spec-Flow)
- **Stars**: 71 | **Version**: v11.9.0 (Dec 2025)
- **Platform**: Claude Code (primary), Gemini CLI (via extension)
- **Tech Stack**: JavaScript/Node.js, requires Git 2.39+, Python 3.10+, yq 4.0+; `npx spec-flow init`
- **Architecture**: Six-phase pipeline: Specification (Gherkin scenarios) -> Planning -> Tasks (20-30 TDD tasks with dependencies) -> Implementation (specialist agents for backend/frontend/database) -> Optimization (quality gates: performance, security, accessibility, coverage) -> Deployment (staging/production with rollback). Domain Memory system persists state to disk. Auto-compacting notes. Epics with parallel sprints and locked API contracts. Voting-based code reviews across agents. [Spec-Flow Repo](https://github.com/marcusgoll/Spec-Flow)
- **Philosophy**: End-to-end lifecycle coverage from idea to deployment. Token budgets, auditable artifacts, quality gates at every phase.
- **Confidence**: HIGH

### 23. Tasker
- **Repo**: [Dowwie/tasker](https://github.com/Dowwie/tasker)
- **Stars**: 17 | **Version**: v0.1.0 (Feb 2026)
- **Platform**: Claude Code (registered as Claude Code plugin)
- **Tech Stack**: Go (60.8%), Python (36.7%), Shell; installed via curl script
- **Architecture**: Three-stage pipeline: Specify (exhaustive intent capture with reduce-while loops) -> Plan (DAG of verified tasks) -> Execute (validate against specs). Steel thread architecture validation. Finite state machines as contracts serving dual purpose (acceptance criteria + documentation). ADR decision registry. Resumable checkpoints via `tasker stop/resume`. [Tasker Repo](https://github.com/Dowwie/tasker)
- **Philosophy**: Exhaustive discovery over speed. Steel thread validation catches foundational flaws early. Contracts expressed as FSMs rather than plain text.
- **Confidence**: HIGH

---

## Additional Notable Tools (Not in Original Scope but Discovered)

### 24. Kiro (Amazon)
- **Website**: [kiro.dev](https://kiro.dev/)
- **Repo**: [kirodotdev/Kiro](https://github.com/kirodotdev/Kiro)
- **Platform**: Standalone IDE (VS Code/Code OSS fork)
- **Architecture**: Three-phase spec workflow (Requirements -> Design -> Tasks) baked into IDE UI. Agent hooks triggered by file changes or commits. Steering rules for AI behavior. MCP support. Claude Sonnet 4.0 integration via Bedrock. [Martin Fowler SDD Analysis](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- **Philosophy**: IDE-native SDD -- the simplest/most lightweight approach. Designed for AWS-centric teams.
- **Confidence**: HIGH

### 25. Tessl
- **Website**: [tessl.io](https://tessl.io/)
- **Repo**: [tesslio/spec-driven-development-tile](https://github.com/tesslio/spec-driven-development-tile)
- **Platform**: CLI + MCP server, enterprise focus
- **Architecture**: 1:1 spec-to-code file mapping using tags (@generate, @test). Marks generated code as read-only. Spec Registry with 10,000+ pre-built specs. MCP-compatible. Multi-dimensional specs (process specs, context specs, intent definition). [Martin Fowler SDD Analysis](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- **Philosophy**: Pursuing "spec-as-source" -- humans edit only specs, code remains AI-generated. Enterprise Java ecosystem focus.
- **Confidence**: MEDIUM (private beta, limited public data)

### 26. PromptX
- **Repo**: [Deepractice/PromptX](https://github.com/Deepractice/PromptX)
- **Stars**: ~3,000
- **Platform**: MCP-native, works with Claude, Cursor, and other MCP-compatible agents
- **Architecture**: Context platform with persona injection via MCP. Long-term memory with network graph, engram editor, cue word browser. 8 built-in specialist roles. Accepted at WWW Companion '26 conference. [PromptX Repo](https://github.com/Deepractice/PromptX)
- **Philosophy**: "Treat AI as a person, not software." Abstracts technical syntax through conversational interfaces and dynamic context injection. Not a pure SDD tool but a context engineering platform.
- **Confidence**: MEDIUM

### 27. GTPlanner
- **Repo**: [OpenSQZ/GTPlanner](https://github.com/OpenSQZ/GTPlanner)
- **Stars**: ~122
- **Platform**: Claude Code (plugin), MCP-compatible
- **Tech Stack**: Python 3.10+
- **Architecture**: Modular "Prefab" ecosystem for PRD generation. Standardized SOPs with reusable AI functional modules. Agent PRDs that AI can understand as standard operating procedures. [GTPlanner Repo](https://github.com/OpenSQZ/GTPlanner)
- **Philosophy**: "Determinism, Composability, and Freedom." Rapid prototyping via composable specification modules.
- **Confidence**: MEDIUM

---

## Architectural Patterns Summary

Across these 27 tools, several recurring architectural patterns emerge:

**1. Workflow Pipeline Depth**:
- **Minimal** (3 stages): Kiro, mcp-server-sdd, Tasker -- Requirements -> Design -> Tasks
- **Standard** (4 stages): Spec Kit, cc-sdd, OpenSpec -- Specify -> Plan -> Tasks -> Implement
- **Extended** (5-6 stages): GSD, Spec-Flow, Shotgun -- adds Research and/or Verification/Deployment phases
- **Full lifecycle**: BMAD -- 34+ workflows covering brainstorming to deployment

**2. Context Management Strategy**:
- **Fresh context per task**: GSD, GSD-2, Smart Ralph -- each task gets a clean context window
- **In-session continuity**: PAUL -- keeps work in one session, avoids subagent spawning
- **State persistence on disk**: GSD-2 (`.gsd/`), PAUL (`.paul/`), Spec Kit (spec files)
- **Context compaction**: Lean-Spec (<2k tokens per spec), Spec-Flow (auto-compacting notes)

**3. Agent Orchestration Model**:
- **Single-agent focused**: PAUL, Pilot Shell, ContextKit -- prioritize quality in one session
- **Multi-agent specialized**: BMAD (21+ agent personas), Shotgun (5 specialized agents), GSD-2 (3 subagents)
- **Platform-agnostic**: Spec Kit (20+ agents), cc-sdd (8 agents), AI Factory (14+ agents)

**4. Spec Artifact Organization**:
- **Single source file**: OpenSpec (per-capability specs), Tessl (1:1 spec-to-code mapping)
- **Multi-file per feature**: Spec Kit (constitution + spec + plan + tasks), SDAD (context + requirements + tasks)
- **Directory hierarchy**: GSD (milestone/slice/task), Spec-Flow (epic/sprint structure)

**5. Installation/Integration Pattern**:
- **npx one-liner**: GSD, cc-sdd, BMAD, Spec-Flow, AI Factory
- **pip/uv install**: Spec Kit, Spec Kitty, SpecPulse, Lean-Spec, Shotgun
- **MCP server**: mcp-server-sdd, Lean-Spec, Tessl, PromptX
- **IDE-native**: Kiro (standalone IDE), spec-kit-command-cursor (Cursor plugin)

---

## Key Unknowns

1. **"OpenKit"**: No tool by this exact name was found in any search. This may be a confusion with "Spec Kit" or "OpenSpec," or it may be a very small/private project. Insufficient sources found for: OpenKit.

2. **"agentic-code"**: No standalone GitHub repo by this exact name was found in the spec-driven development context. The term appears generically across many projects. Insufficient sources found for: agentic-code as a specific named tool.

3. **Tessl pricing and maturity**: Tessl is in private beta and publishes limited technical details. Star counts for their main repo are not publicly visible. [Tessl Website](https://tessl.io/)

4. **ContextKit successor (PlanKit)**: ContextKit's README states it evolved into PlanKit, but no public PlanKit repository was discovered. [ContextKit Repo](https://github.com/FlineDev/ContextKit)

5. **Real-world production usage data**: None of these tools publish adoption metrics beyond GitHub stars. No independent surveys of SDD tool usage in production environments were found.

6. **Head-to-head benchmarks**: No rigorous comparative benchmarks (e.g., code quality, time-to-ship, defect rates) exist comparing these tools against each other or against unstructured AI coding.

7. **Star count accuracy**: GitHub star counts for rapidly growing projects (OpenSpec, BMAD, Spec Kit) are approximate and may differ from the figures cited here by the time of reading, as they were captured from cached search results dated early March 2026.

8. **Conflicting star counts**: The comparison article at redreamality.com listed OpenSpec at 4.1k stars and Spec Kit at 39.3k stars, while the GitHub topics page showed OpenSpec at 29.7k and Spec Kit at 76k. These discrepancies are likely due to different snapshot dates (the comparison article may have been written months earlier), but the magnitude of growth is notable.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 30+
