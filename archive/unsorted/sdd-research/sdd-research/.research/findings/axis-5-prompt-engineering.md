# Axis 5: Prompt Engineering & Agent Orchestration

## Question
How do spec-driven agentic coding tools prompt the AI, manage context windows, chain prompts, and orchestrate multiple agents or sub-agents?

## Findings

## 1. The Fundamental Prompting Architecture: Files-as-Prompts

The most consequential design insight across these tools is that **plan files ARE the prompts**. Rather than embedding instructions in system messages or inline chat, tools like GSD externalize their prompt engineering entirely into structured markdown and XML files that agents read from disk.

GSD (Get Shit Done) exemplifies this most clearly. Its `PLAN.md` files are described explicitly: "The PLAN.md file isn't a document that becomes a prompt. It IS the executable instruction. Subagents read it directly." [GSD Repository](https://github.com/gsd-build/get-shit-done) The system structures agent identity through markdown files in `.claude/agents/` with XML sections including `<role>`, `<philosophy>`, `<tool_strategy>`, and `<output_formats>`. GSD maintains twelve agent definitions covering Researcher, Planner, Executor, Verifier, and others. [GSD Deep Dive - codecentric](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system) (Confidence: High)

GitHub Spec Kit takes a similar but more standardized approach. Its `/speckit.*` commands are "plain text files -- Markdown or TOML depending on the agent -- that instruct an AI agent how to execute a structured phase of development." Each command file contains YAML frontmatter (description, handoffs, pre-execution scripts) and a markdown body with a numbered instruction outline, placeholder tokens substituted at build time (`{SCRIPT}`, `{ARGS}`, `$ARGUMENTS`, `__AGENT__`). [Spec Kit DeepWiki - speckit Commands](https://deepwiki.com/github/spec-kit/5-speckit-commands) (Confidence: High)

OpenSpec uses a two-tier template architecture: agent skill templates that install into `.claude/skills/` or `.cursor/rules/` and schema artifact templates for output formatting. A key pattern is that templates teach AI agents to query dynamically -- parsing JSON from `openspec status --json` and fetching instructions via `openspec instructions --json` -- rather than hardcoding steps. This keeps templates schema-agnostic. [OpenSpec Template System - DeepWiki](https://deepwiki.com/Fission-AI/OpenSpec/8.7-template-system) (Confidence: High)

## 2. XML-Structured Prompt Formatting

Several tools have converged on XML as the internal prompt structure format, optimized for Claude's comprehension characteristics. GSD's task definitions use rigid XML with verifiable outcomes:

```xml
<task type="auto" tdd="true">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT (not jsonwebtoken - CommonJS issues).
    Validate credentials against users table.
    Return httpOnly cookie on success.
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

This four-field task structure (files, action, verify, done) appears across multiple tools. PAUL independently arrived at the same pattern, stating: "If you can't specify all four, the task is too vague." [PAUL Repository](https://github.com/ChristopherKahler/paul) (Confidence: High)

The XML formatting serves a specific purpose: it eliminates ambiguity in how the AI parses multi-part instructions. Agent definitions follow the pattern of `Frontmatter + Prompt body` with XML sections, creating a predictable parsing structure that LLMs handle more reliably than prose. [GSD Framework - CC for Everyone](https://ccforeveryone.com/gsd) (Confidence: Medium)

## 3. Context Window Management: The Fresh-Context Pattern

The dominant strategy across these tools is aggressive context isolation -- spawning fresh agent instances with clean context windows for each unit of work rather than maintaining long-running sessions. This addresses what GSD calls "context rot":

> "0-30% context: Peak quality... 50%+: Starts rushing... 70%+: Hallucinations."

[GSD Context Rot Prevention](https://hoangyell.com/get-shit-done-explained/)

**GSD v2** implements this most rigorously as a TypeScript application that programmatically controls agent sessions. Its auto mode "reads `.gsd/STATE.md`, determines the next unit of work, creates a fresh agent session, injects a focused prompt with all relevant context pre-inlined, and when the LLM finishes, auto mode reads disk state again and dispatches the next unit. Every task gets a clean 200k-token context window with no accumulated garbage." The foundational principle is: "A task must fit in one context window. If it can't, it's two tasks." [GSD-2 Repository](https://github.com/gsd-build/GSD-2) (Confidence: High)

**Agent Teams Lite** explicitly contrasts its approach with single-context tools: "while others run everything in a single conversation context, Agent Teams Lite uses the Task tool to spawn fresh-context sub-agents, keeping the orchestrator's context window clean." The orchestrator "NEVER does real work directly -- not just SDD phases, but ANY task. It delegates everything to sub-agents, tracks state, and synthesizes summaries." [Agent Teams Lite Repository](https://github.com/Gentleman-Programming/agent-teams-lite) (Confidence: High)

**Smart Ralph** manages context through task isolation: "Each task runs independently, allowing the model to reset its conversation context and focus only on the current task without carrying forward irrelevant prior context." State tracking happens via `.ralph-state.json` separately from conversation context. [Smart Ralph Repository](https://github.com/tzachbon/smart-ralph) (Confidence: High)

**Pilot Shell** takes a different approach -- rather than avoiding context saturation, it actively manages compaction boundaries. Before Claude Code's auto-compaction fires, hooks capture the active plan, task list, and key decisions to persistent memory. After compaction, restoration hooks reload everything. The system rescales Claude Code's native ~16.5% compaction buffer into a display range with warnings at 80% and 90% effective usage. [Pilot Shell Repository](https://github.com/maxritter/pilot-shell) (Confidence: High)

**GSD v2** pre-loads dispatch prompts with essential artifacts before execution -- task plans with verification criteria, slice plans, prior task summaries, dependency summaries, roadmap excerpts, and decision registers -- so "the LLM starts execution with everything needed rather than spending tool calls on file reads." This is a form of context pre-packing that maximizes the value of each context window. [GSD-2 Repository](https://github.com/gsd-build/GSD-2) (Confidence: High)

## 4. Prompt Chaining: Sequential Artifact Pipelines

Every tool examined implements some form of sequential phase pipeline where each stage's output feeds the next stage's input. The canonical pattern is **Specify -> Plan -> Tasks -> Implement -> Verify**, though implementations vary in granularity and enforcement.

**GitHub Spec Kit** structures this as an "artifact pipeline": `/speckit.constitution` -> `/speckit.specify` -> `/speckit.clarify` -> `/speckit.plan` -> `/speckit.tasks` -> `/speckit.implement`. Each command reads outputs from previous phases and produces inputs for the next. Templates embed constraints -- `spec-template.md` requires `FR-XXX` and `SC-XXX` identifiers with mandatory `[NEEDS CLARIFICATION]` markers preventing assumptions; `plan-template.md` includes "Phase -1 Constitution Gates" that must be passed or justified. [Spec Kit DeepWiki](https://deepwiki.com/github/spec-kit/5-speckit-commands) (Confidence: High)

**mcp-server-spec-driven-development** implements a minimal three-step chain via MCP tools: `generate-requirements` (user input -> requirements.md using EARS format) -> `generate-design-from-requirements` (requirements -> design.md) -> `generate-code-from-design` (design -> code files). This enforces "a traceable path from requirements through design to implementation." [MCP Server SDD Repository](https://github.com/formulahendry/mcp-server-spec-driven-development) (Confidence: High)

**Tasker** uses "reduce-while loops" in its specification phase -- loops that continue until all requirement categories are covered, creating "loop pressure" that forces comprehensive documentation before planning begins. Task decomposition then follows six structured phases: logical decomposition, physical mapping, cross-cutting concerns, task definition, dependency analysis, and completeness audits. [Tasker Repository](https://github.com/Dowwie/tasker) (Confidence: High)

**PAUL** enforces loop closure through its UNIFY reconciliation step: "Never skip UNIFY. Every plan needs closure." UNIFY creates SUMMARY.md documenting built work, compares planned vs. actual execution, records decisions and deferred issues, and updates STATE.md with accumulated context. PAUL's companion CARL (Context Augmentation & Reinforcement Layer) is a "dynamic rule injection system" that "loads rules just-in-time based on what you're doing" and removes them when inactive, preventing context bloat from static prompts. [PAUL Repository](https://github.com/ChristopherKahler/paul) (Confidence: High)

**Shotgun** implements a five-phase internal pipeline -- Research -> Spec -> Plan -> Tasks -> Export -- where "each phase uses a separate specialized agent with prompts tailored specifically for that phase." Its Research phase is distinctive: by reading the entire codebase via tree-sitter indexing before specification begins, it prevented a client from undertaking a 3-4 week custom build by discovering an existing solution (LiteLLM Proxy). [Shotgun Repository](https://github.com/shotgun-sh/shotgun) (Confidence: High)

## 5. Multi-Agent Orchestration Patterns

Three distinct orchestration patterns have emerged across these tools:

### Pattern A: Thin Orchestrator with Wave-Based Parallel Execution (GSD)

GSD's orchestrator "never does heavy lifting. It spawns agents, waits, integrates results." Execution uses wave-based parallelization -- Wave 1 runs independent plans simultaneously, Wave 2 executes plans dependent on Wave 1, and Wave 3 handles multi-dependency plans sequentially. The result: "thousands of lines of code written across parallel executors... your main context window stays at 30-40%." GSD bundles three specialized subagents: **Scout** (fast codebase reconnaissance), **Researcher** (web research synthesis), and **Worker** (general-purpose isolated execution). Communication between agents happens "exclusively via files." [GSD Repository](https://github.com/gsd-build/get-shit-done) and [GSD-2 Repository](https://github.com/gsd-build/GSD-2) (Confidence: High)

### Pattern B: Delegate-Only Orchestrator with Specialized Sub-Agents (Agent Teams Lite)

Agent Teams Lite defines 9 specialized sub-agents, each a pure Markdown skill file: Init, Explorer, Proposer, Spec Writer, Designer, Task Planner, Implementer, Verifier, and Archiver. Every sub-agent begins by reading `.atl/skill-registry.md` to discover project conventions and coding skills. Critical MCP calls (`mem_search`, `mem_save`, `mem_get_observation`) are "inlined directly in skills -- no multi-hop file references" because "inlining prevents non-Claude models from breaking multi-hop dependency chains." Sub-agents return structured JSON payloads with status, executive_summary, artifacts, next_recommended actions, and risks. [Agent Teams Lite Repository](https://github.com/Gentleman-Programming/agent-teams-lite) (Confidence: High)

### Pattern C: Model-Routed Sub-Agent System (Pilot Shell, spec-kit-command-cursor)

Pilot Shell routes different phases to different model capabilities: **Opus** for planning (deep reasoning), **Sonnet** for plan verification and implementation (fast, cost-effective with clear specs). It uses named sub-agents: plan-reviewer (validates spec completeness), unified review (compliance + quality + goal alignment), and orchestrator (mechanical checks and fixes). [Pilot Shell Repository](https://github.com/maxritter/pilot-shell) (Confidence: High)

**spec-kit-command-cursor** implements hierarchical subagent trees for Cursor: 6 subagents (sdd-explorer, sdd-planner, sdd-implementer, sdd-verifier, sdd-reviewer, sdd-orchestrator) where background agents (implementer, orchestrator) run asynchronously while foreground agents block. The architecture supports "subagent trees where subagents spawn their own subagents (orchestrator -> implementers -> verifiers)." Conflict detection tracks `touchedFiles` preventing parallel edits to the same file. [spec-kit-command-cursor Repository](https://github.com/madebyaris/spec-kit-command-cursor) (Confidence: High)

## 6. State Management and Cross-Session Persistence

All tools face the challenge of maintaining coherent project state across multiple agent sessions, and they have converged on file-based state management with varying degrees of sophistication.

**GSD v2** uses `.gsd/STATE.md` as its primary dashboard, read first by its state machine on every loop iteration. The directory includes `M001-ROADMAP.md` (milestone plan), `S01-PLAN.md` (slice task decomposition), `T01-SUMMARY.md` (task outcome with YAML frontmatter), `DECISIONS.md` (append-only architectural decision register), and `PROJECT.md` (living documentation). It includes crash recovery: "Lock files track current units; if a session dies, the next auto invocation synthesizes a recovery briefing from surviving tool call artifacts." [GSD-2 Repository](https://github.com/gsd-build/GSD-2) (Confidence: High)

**ContextKit** maintains project understanding through structured documentation: `Context.md` serves as "the source of truth that every ContextKit command reads" and is automatically included via CLAUDE.md so "every new chat starts with full project context." Feature directories (numbered `001-UserAuthentication/`, `002-FixLoginButton.md`, etc.) store Spec.md, Tech.md, and Steps.md that survive across sessions. [ContextKit Repository](https://github.com/FlineDev/ContextKit) (Confidence: High)

**Spec-Kitty** maintains state through Kanban-style frontmatter in work package files (lane: "planned" | "doing" | "for_review" | "done") and uses git worktrees for true parallel execution isolation -- each work package operates in a separate `.worktrees/` directory. [Spec Kitty Repository](https://github.com/Priivacy-ai/spec-kitty) (Confidence: High)

**SpecPulse** tracks state through feature state files that allow seamless context switching via `/sp-continue`, with each task referencing files, dependencies, and success criteria for AI reference. Its CLI-First architecture means CLI operations always succeed independently of AI performance -- "AI then enhances these foundations without risking data loss." [SpecPulse Repository](https://github.com/specpulse/specpulse) (Confidence: Medium)

## 7. Prompt Template Engineering: Constraints and Guardrails

The most effective tools don't just tell agents what to do -- they constrain what agents must NOT do and enforce structural completeness.

**Spec Kit** templates embed hard constraints: the specification template "explicitly instructs to focus on WHAT users need and WHY, while avoiding HOW to implement (no tech stack, APIs, code structure)." Requirements must use `FR-XXX` identifiers and include mandatory `[NEEDS CLARIFICATION]` markers. The plan template includes "Phase -1 Constitution Gates" -- constitutional principles that must be passed or explicitly justified before proceeding. [Spec Kit DeepWiki](https://deepwiki.com/github/spec-kit) (Confidence: High)

**OpenSpec's** template system separates context into distinct semantic layers: `template` (output format), `context` (project configuration), `rules` (per-artifact constraints), `dependencies` (graph + completion state), and `unlocks` (artifacts this one enables). This separation ensures "AI agents can distinguish instructional material from required output format." [OpenSpec Template System - DeepWiki](https://deepwiki.com/Fission-AI/OpenSpec/8.7-template-system) (Confidence: High)

**PAUL** enforces boundary protection with "DO NOT CHANGE" sections in plans, blocking agents from modifying protected areas. Skills must load before the APPLY phase begins, and state consistency checks run at every phase transition. [PAUL Repository](https://github.com/ChristopherKahler/paul) (Confidence: Medium)

**Spec Kit Plus** elevates prompt history itself to a first-class artifact alongside specifications, architecture history, tests, and automated evaluations. This means the evolution of how agents are prompted is tracked as deliberately as code changes. [Spec Kit Plus Repository](https://github.com/panaversity/spec-kit-plus) (Confidence: Medium)

## 8. Cross-Tool Convergences and Divergences

**Universal convergences:**
- Every tool studied uses some form of specification-before-implementation pipeline
- File-based state management is universal; no tool relies solely on in-memory conversation context
- All tools generating task breakdowns include verification criteria alongside implementation instructions
- The four-field task pattern (files, action, verify, done) or close variants appear across GSD, PAUL, Smart Ralph, and others

**Key divergences:**
- **Orchestration control**: GSD v2 is a standalone TypeScript application that programmatically controls agent sessions (external orchestration), while most others operate as prompt-injection frameworks within existing agents (internal orchestration). [GSD-2 Repository](https://github.com/gsd-build/GSD-2) vs. [Spec Kit Repository](https://github.com/github/spec-kit)
- **Context strategy**: GSD and Agent Teams Lite aggressively spawn fresh contexts; Pilot Shell instead manages compaction boundaries within long-running sessions. Both approaches claim superior reliability.
- **Multi-agent vs. single-agent**: Shotgun and mcp-server-spec-driven-development assume a single agent consuming generated specs, while GSD, Agent Teams Lite, and spec-kit-command-cursor implement true multi-agent coordination with parallel execution.
- **PAUL's anti-subagent stance**: PAUL explicitly minimizes subagent usage for implementation, noting "~70% quality" for subagent outputs requiring cleanup, reserving subagents only for "discovery and research -- their job IS to gather context." [PAUL Repository](https://github.com/ChristopherKahler/paul)
- **Agent universality**: OpenSpec supports 20+ AI tools through a template transformation layer, Spec Kit supports 20+ through format adapters (Markdown, TOML, Agent format), while PAUL and Pilot Shell are Claude Code-specific. [OpenSpec Repository](https://github.com/Fission-AI/OpenSpec), [Spec Kit Repository](https://github.com/github/spec-kit)

## Key Unknowns

1. **Actual verbatim system prompts**: Despite extensive searching, most repositories do not publish their complete system prompt or agent definition text in documentation. The GSD planner agent definition (`agents/gsd-planner.md`) and other agent files exist but their full content is not exposed through README or documentation pages -- one must clone the repositories and read the files directly.

2. **Token budget allocation**: While GSD mentions keeping orchestrator context at "30-40%", no tool publishes precise token budgets per phase or how they calculate context allocation across sub-agents. The heuristic of "2-3 tasks per plan at ~50% of fresh context capacity" from GSD is the most specific guidance found.

3. **Model-specific prompt adaptations**: While tools like Pilot Shell route different phases to different models (Opus vs. Sonnet), none publish how they adjust prompt phrasing for different model capabilities. OpenSpec and Spec Kit transform command file formats (Markdown vs. TOML) for different tools, but whether the instructional content itself differs per model is undocumented.

4. **Empirical comparison data**: No controlled studies comparing the effectiveness of fresh-context-per-task (GSD pattern) vs. managed-compaction (Pilot Shell pattern) were found. Both approaches are advocated based on practitioner experience rather than measured outcomes.

5. **"lean-spec" tool**: Despite searching, limited prompt engineering details were found for lean-spec beyond its token-conscious approach.

6. **"ai-factory" as a specific SDD tool**: The Agent Factory / Panaversity resource is an educational framework about SDD principles rather than a standalone tool. Factory.ai is a commercial platform (not open source). Neither exposes prompt engineering details.

7. **Conflict resolution in multi-agent writes**: While spec-kit-command-cursor mentions `touchedFiles` conflict detection and GSD uses wave-based dependency ordering, the exact mechanisms for resolving concurrent file edit conflicts in parallel agent scenarios are not documented in detail.

8. **Long-term spec drift management**: How these tools handle specifications that become outdated as implementation reveals new requirements is addressed conceptually (PAUL's UNIFY, GSD's reassessment after each slice) but practical patterns for large-scale spec evolution remain underspecified.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 20+
