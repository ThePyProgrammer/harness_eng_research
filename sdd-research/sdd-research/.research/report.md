# Research Report: Spec-Driven Agentic Coding Workflows

*Generated: 2026-03-12*
*Research scope: Comparative analysis of ~27 spec-driven agentic coding tools — philosophies, patterns, trade-offs, and prompt engineering approaches*

## Executive Summary

The spec-driven development (SDD) ecosystem has exploded in early 2026, with 27+ tools spanning from GitHub's 76k-star Spec Kit to 17-star experimental frameworks. Despite radical differences in complexity and philosophy, these tools converge on a remarkably consistent four-stage pipeline (Specify → Plan → Tasks → Implement), file-based state management, and the principle that structured specifications dramatically improve AI agent output versus ad-hoc prompting. The most consequential design decisions are not about *what* phases to include but about **context management strategy** (fresh context per task vs. in-session continuity), **human gate placement** (how much ceremony between phases), and **orchestration model** (single-agent vs. multi-agent). The field's biggest unsolved problems are spec drift (keeping specs synchronized with evolving code), the "sledgehammer problem" (excessive ceremony for small tasks), and the fundamental unreliability of markdown specs as binding contracts — agents routinely ignore them regardless of formatting sophistication. Tools that enforce quality through code-level hooks (Pilot Shell, GSD) rather than relying on prompt-level instructions show the most promise for production reliability.

## Key Findings

1. **Every tool converges on Specify → Plan → Tasks → Implement**, but they diverge sharply on how rigidly phases are enforced and where human approval gates sit. ([GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/))

2. **Fresh context per task ("Ralph Loop" pattern) is the dominant strategy for preventing quality degradation** — research shows AI performance degrades significantly past 40% context usage. GSD, Smart Ralph, and Agent Teams Lite all independently converged on this. ([Context Engineering 101](https://newsletter.victordibia.com/p/context-engineering-101-how-agents); [GSD](https://github.com/gsd-build/get-shit-done))

3. **Plan files ARE the prompts** — the most effective tools don't separate "documentation" from "AI instructions." GSD's PLAN.md files are executable instructions read directly by subagents, not documents that become prompts. ([codecentric GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system))

4. **Code-level enforcement (hooks, linters, TDD enforcers) vastly outperforms prompt-level constraints.** Despite comprehensive specs, "AI agents frequently ignored instructions" in Thoughtworks testing. Pilot Shell's PostToolUse hooks that run formatters/linters after every edit are more reliable than any spec-based guardrail. ([Martin Fowler SDD Analysis](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html); [Pilot Shell](https://github.com/maxritter/pilot-shell))

5. **Acceptance criteria (BDD Given/When/Then format) are the single most valuable spec artifact**, providing mechanical task decomposition and clear definition of done. Every mature tool treats them as first-class citizens. ([Kiro SDD Experience Report](https://dev.to/aws-builders/what-i-learned-using-specification-driven-development-with-kiro-pdj))

6. **The four-field task pattern (files, action, verify, done) has independently emerged in multiple tools** — GSD, PAUL, Smart Ralph, and Spec Kit all require it. "If you can't specify all four, the task is too vague." ([PAUL](https://github.com/ChristopherKahler/paul); [GSD](https://github.com/gsd-build/get-shit-done))

7. **Spec drift is the most dangerous failure mode** — stale specs "mislead agents that don't know any better" and only OpenSpec has a mature delta-based evolution system. Most tools treat specs as write-once artifacts. ([Augment Code](https://www.augmentcode.com/blog/what-spec-driven-development-gets-wrong))

8. **No empirical effectiveness data exists** — no controlled studies compare SDD approaches against each other or against unstructured AI coding. All claims are self-reported or anecdotal. This is a fundamental limitation of the entire field.

---

## 1. Tool Catalog

### Quick Reference Table

| Tool | Stars | Platform | Architecture | Maturity |
|------|-------|----------|-------------|----------|
| **GitHub Spec Kit** | 76k | 20+ agents | CLI + templates, constitution governance | High — GitHub-backed |
| **BMAD-METHOD** | 40k | Claude/Cursor/others | 21+ agent personas, full agile simulation | High — v6.0.4 |
| **OpenSpec** | 30k | 20+ agents | YAML schemas, delta specs, brownfield-first | High — YC-backed |
| **GSD** | 28k | Claude/OpenCode/Gemini/Codex | Fresh context per task, wave-based parallel execution | High — viral adoption |
| **Taskmaster AI** | 26k | Cursor/VS Code/Claude/others | PRD parsing, MCP-first task management | High — 1,212 commits |
| **Agent OS** | 4k | Claude/Cursor | Standards injection, pure bash | Medium — v3.0.0 |
| **cc-sdd** | 3k | 8 agents | Kiro-style EARS workflow | Medium — v2.1.1 |
| **Pilot Shell** | 1.5k | Claude Code only | Hook-based TDD enforcement, model routing | Medium — quality-focused |
| **Spec Kitty** | 900 | 12 agents | Kanban dashboard, git worktree isolation | Medium — v0.16.2 |
| **Shotgun** | 640 | 5+ agents | Tree-sitter codebase indexing, research-first | Medium |
| **GSD-2** | 575 | 20+ LLM providers | Standalone CLI, crash recovery, cost tracking | Medium |
| **mcp-server-sdd** | 430 | Any MCP client | MCP server, 3-stage EARS pipeline | Low — minimal |
| **AI Factory** | 370 | 14+ agents | Skill marketplace, zero-config | Medium — v2.7.0 |
| **SpecPulse** | 370 | 8 platforms | CLI-first with AI enhancement, cross-platform parity | Medium |
| **Smart Ralph** | 250 | Claude/Codex/Cursor/Gemini | Ralph Wiggum Loop, POC-first breakdown | Low-Medium |
| **PAUL** | 250 | Claude Code only | Plan-Apply-Unify loop, CARL dynamic rules, anti-subagent | Low-Medium |
| **Lean Spec** | 200 | 20+ agents via MCP | <2k token specs, agile-first | Low-Medium |
| **Spec Kit Plus** | 190 | 16+ agents | Spec Kit fork + K8s/Dapr/Ray enterprise stack | Low |
| **SDAD** | 170 | Claude Code | Minimal 3-file methodology | Low — template repo |
| **ContextKit** | 160 | Claude Code only | Quality sub-agents, Swift/SwiftUI focus | Low — deprecated |
| **SDD Cursor** | 160 | Cursor only | 6 subagents, DAG parallel execution | Low |
| **Spec-Flow** | 70 | Claude/Gemini | Gherkin specs, 6-phase pipeline with deployment | Low |
| **Tasker** | 17 | Claude Code | FSM contracts, exhaustive discovery, DAG plans | Low — early |
| **Kiro** | N/A | Standalone IDE | IDE-native 3-file SDD, agent hooks | High — Amazon-backed |
| **Tessl** | N/A | CLI + MCP | Spec-as-source, 1:1 spec-to-code mapping | Medium — private beta |
| **PromptX** | ~3k | MCP-native | Context platform, persona injection, not pure SDD | Medium |
| **GTPlanner** | ~120 | Claude Code/MCP | Modular "Prefab" ecosystem for PRD generation | Low |

*Sources: GitHub repositories for each tool (cited individually in Axis 1 findings); [Comparison Article](https://redreamality.com/blog/-sddbmad-vs-spec-kit-vs-openspec-vs-promptx/); [SDD Map Article](https://medium.com/@visrow/spec-driven-development-is-eating-software-engineering-a-map-of-30-agentic-coding-frameworks-6ac0b5e2b484)*

**Note on star counts**: GitHub star counts for rapidly growing projects are approximate (captured March 2026) and may have changed. A comparison article cited OpenSpec at 4.1k stars while the GitHub page showed 29.7k — likely temporal differences. Treat all star counts as approximate. ([Axis 1 findings](#))

---

## 2. Pipeline Patterns: How Tools Structure the Workflow

Five distinct architectural patterns have emerged across the ecosystem:

### Pattern A: Strict Linear (Spec Kit, cc-sdd, Tasker, mcp-server-sdd)

```
Requirements ──[HUMAN GATE]──> Design ──[HUMAN GATE]──> Tasks ──[HUMAN GATE]──> Code
```

Each phase must complete before the next begins, with explicit human approval between stages. GitHub Spec Kit is the reference implementation: Constitution → Specify → Plan → Tasks → Implement. The Thoughtworks review found this created an "overwhelming review burden" with 8+ artifacts per spec. ([Martin Fowler SDD Analysis](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html))

cc-sdd replicates Kiro's EARS-format pipeline with optional validation gates (`/kiro:validate-gap`, `/kiro:validate-design`) and a `-y` flag for automation scenarios. ([cc-sdd](https://github.com/gotalab/cc-sdd))

Tasker stands out with "reduce-while loops" that force exhaustive specification before allowing planning to begin, plus FSM JSON as canonical contracts rather than markdown. ([Tasker](https://github.com/Dowwie/tasker))

### Pattern B: Iterative Loop (GSD, PAUL, Smart Ralph)

```
┌──> Discuss/Plan ──[HUMAN GATE]──> Execute ──> Verify ──[HUMAN GATE]──┐
│                                                                       │
└───────────────────── (next phase) ◄───────────────────────────────────┘
```

GSD's loop runs Discuss → Plan → Execute → Verify per phase, spawning 4 parallel researchers, validating plans against requirements, then executing in dependency-ordered "waves" with fresh 200k-token contexts. Verification uses goal-backward validation ("what must be TRUE?") rather than task-completion checking. ([GSD](https://github.com/gsd-build/get-shit-done))

PAUL's Plan → Apply → Unify loop is mandatory — "no shortcuts permitted." Every plan must reach closure through Unify, which generates SUMMARY.md comparing planned vs. actual outcomes. PAUL explicitly rejects subagent parallelization, arguing subagents produce "~70% quality work that needs cleanup." ([PAUL](https://github.com/ChristopherKahler/paul))

### Pattern C: Multi-Agent Orchestration (BMAD, Spec Kitty, SDD Cursor)

```
Analyst ──> PM ──> Architect ──> Scrum Master ──> Developer(s) [parallel]
     └─[HUMAN GATE at each handoff]─┘       └─[Review + Merge gate]─┘
```

BMAD simulates an entire agile team with 21+ specialized AI agent personas across 34+ workflows. The "HALT-and-gate" pattern prevents LLM read-ahead: step files end with HALT commands, unauthorized advancement is classified as "SYSTEM FAILURE." ([BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD))

Spec Kitty provides git worktree isolation per work package with a live Kanban dashboard — the only tool with persistent visual pipeline state tracking. ([Spec Kitty](https://github.com/Priivacy-ai/spec-kitty))

### Pattern D: Fluid/Minimal (OpenSpec, LeanSpec, Pilot Shell)

```
Propose ──[optional review]──> Apply ──> Archive
(any artifact modifiable at any time; minimal phase enforcement)
```

OpenSpec's three commands (`/opsx:propose`, `/opsx:apply`, `/opsx:archive`) deliberately avoid rigid phase gates, designed for brownfield iteration on existing codebases. ([OpenSpec](https://github.com/Fission-AI/OpenSpec/))

Pilot Shell collapses the pipeline into `/spec` → Plan → Implement (TDD) → Verify, with Opus for planning and Sonnet for implementation. A separate bugfix workflow (Investigate → Test-before-fix → Verify) handles non-feature work. ([Pilot Shell](https://github.com/maxritter/pilot-shell))

### Pattern E: Mode-Switched (Shotgun, BMAD Quick Flow)

```
[Planning Mode]: Research ──[checkpoint]──> Spec ──[checkpoint]──> Plan ──[checkpoint]──> Tasks
[Drafting Mode]:  Research ──────────────────────────────────────────────> Tasks (no stops)
```

Shotgun offers Planning (checkpointed) vs. Drafting (end-to-end) modes. Its research phase reads the entire codebase via tree-sitter indexing before specification, which once prevented a client from undertaking a 3-4 week custom build by discovering an existing solution. ([Shotgun](https://github.com/shotgun-sh/shotgun))

BMAD's Quick Flow bypasses Phases 1-3, consolidating all roles into a single "Barry" persona for bug fixes and minor features — despite marketing claims of "scale-adaptive intelligence," this is primarily manual track selection, not automated complexity detection. ([DeepWiki BMAD Planning Tracks](https://deepwiki.com/bmadcode/BMAD-METHOD/4.2-context-engineered-development-(ide)))

### Where Human Gates Cluster

Across all tools, human decision points cluster at three junctures:

1. **Post-specification approval** — universal across every tool except Ralph Loop in `--quick` mode
2. **Pre-implementation architectural review** — most tools (Spec Kit, cc-sdd, BMAD, PAUL, Tasker) insert a gate after planning
3. **Post-implementation verification** — GSD's verify phase, PAUL's unify phase, Pilot Shell's review sub-agent

The Thoughtworks analysis warns that elaborate review gates may create a "false sense of control" — extensive templates don't reliably prevent agent hallucinations. ([Martin Fowler SDD Analysis](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html))

---

## 3. Spec Design Patterns: How Requirements Are Captured

### Three Dominant Information Models

**Model A: Three-Phase Document Pipeline** (Kiro, cc-sdd, mcp-server-sdd, SDAD, Smart Ralph)
Requirements → Design → Tasks, all in Markdown. The EARS (Easy Approach to Requirements Syntax) format has emerged as a de facto standard — Ubiquitous ("The system shall..."), Event-Driven ("WHEN...THE SYSTEM SHALL..."), State-Driven, and Unwanted Behavior patterns provide testable requirements. ([EARS guide](https://alistairmavin.com/ears/); [cc-sdd](https://github.com/gotalab/cc-sdd))

**Model B: Constitution + Phased Pipeline** (Spec Kit, Spec Kit Plus, Spec Kitty, SDD Cursor)
Extends the basic pipeline with a `constitution.md` governance layer — "non-negotiable principles" that constrain all subsequent specs. Generates ~8 files per spec, criticized as "a LOT of markdown files" that were "repetitive, both with each other, and with the code that already existed." ([Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html))

**Model C: Spec-as-Source** (Tessl only)
Each `.spec.md` maps 1:1 to a code file with `@generate` tags. Generated code marked `// GENERATED FROM SPEC - DO NOT EDIT`. Fowler's team warns this risks combining "inflexibility and non-determinism — the worst aspects of both Model-Driven Development and LLMs." ([Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html))

### Format Choices

Every tool uses Markdown as the primary format, but structured overlays diverge:
- **YAML frontmatter**: Spec Kitty (Kanban lanes), PAUL (plan metadata), SpecPulse (task metadata)
- **XML task definitions**: GSD and PAUL — reportedly better parsed by Claude than alternatives
- **JSON**: Taskmaster AI (`tasks.json`), Tasker (FSM contracts), SDD Cursor (`roadmap.json` DAG)
- **Formal schemas**: Only BMAD (JSON Schema + Gherkin + OpenAPI) and OpenSpec (Zod validation)

([All tool repositories cited individually](#))

### The Unsolved Problem: Spec Evolution

- **OpenSpec** is most mature: delta specs with ADDED/MODIFIED/REMOVED/RENAMED markers and strict application order. Purpose-built for brownfield development. ([DeepWiki OpenSpec](https://deepwiki.com/Fission-AI/OpenSpec))
- **SDD Cursor** offers `/evolve` with downstream propagation
- **GSD and PAUL** use phase numbering with git commits for traceability
- **Most tools** lack explicit evolution mechanisms — GitHub Spec Kit has an open discussion (#152) about this. OpenSpec Issue #705 documents that "when intermediate artifacts are modified, the toolchain does not support iterative refinement." ([OpenSpec Issue #705](https://github.com/Fission-AI/OpenSpec/issues/705))

### Token-Conscious Design

Several tools explicitly design specs to prevent context window degradation:
- **GSD**: Max 3 tasks per plan, each in a fresh 200k-token sub-agent
- **LeanSpec**: Caps specs at ~2,000 tokens — "context rot is real"
- **Smart Ralph**: Fresh context per task, state in `.ralph-state.json`
- **PAUL**: In-session execution but uses STATE.md to persist decisions across sessions

([All repositories cited individually](#))

---

## 4. Quality & Verification Patterns

### Tier 1: Basic (Specification as Implicit Gate)

**mcp-server-sdd** and **SDAD** rely entirely on specification clarity — no automated testing hooks, rollback, or verification loops. **LeanSpec** adds a `validate` command for spec integrity but no code-level enforcement. ([mcp-server-sdd](https://github.com/formulahendry/mcp-server-spec-driven-development); [SDAD](https://github.com/marcelsud/spec-driven-agentic-development); [LeanSpec](https://github.com/codervisor/lean-spec))

### Tier 2: Moderate (Workflow Gates with Human Approval)

**Spec Kit** uses constitution files as persistent guardrails, `/speckit.analyze` for cross-artifact consistency checking, and `/speckit.checklist` as "unit tests for English." But Birgitta Böckeler found agents "frequently...not follow all the instructions" despite extensive specs — checklist enforcement is "interpreted by AI, so there is no 100% guarantee." ([Spec Kit](https://github.com/github/spec-kit); [Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html))

**PAUL** implements acceptance-driven development with BDD criteria as first-class citizens. Every task requires four mandatory components (Files, Action, Verify, Done). "DO NOT CHANGE" sections protect files from unintended modifications, enforced by CARL rules. ([PAUL](https://github.com/ChristopherKahler/paul))

**cc-sdd** adds a "traits" mixin system that enriches commands with code review and verification gates. ([cc-sdd](https://github.com/gotalab/cc-sdd))

### Tier 3: Comprehensive (Automated Enforcement with Hooks)

**GSD** implements the most rigorous atomic commit strategy: each task gets its own commit with semantic messaging (e.g., `feat(08-02): add email confirmation flow`), enabling `git bisect` debugging. Every task XML contains a `<verify>` tag with testable conditions. Plans execute in fresh 200k-token sub-agent contexts. Failed UATs spawn debug agents to find root causes. ([GSD](https://github.com/gsd-build/get-shit-done))

**Pilot Shell** is the most technically sophisticated hook-based system found:
- `tdd_enforcer.py` PreToolUse hook checks if implementation files were modified without failing tests first
- PostToolUse hooks dispatch language-specific validators (ruff+basedpyright for Python, Prettier+ESLint+tsc for TypeScript, gofmt+golangci-lint for Go) after **every file modification**
- `spec_stop_guard.py` blocks session termination if an active spec has PENDING status
- Pre/post-compact hooks preserve state across context window compaction

([Pilot Shell](https://github.com/maxritter/pilot-shell))

**Tasker** uses reduce-while loops forcing comprehensive specifications, FSM JSON as executable contracts, and checkpoints before each batch enabling `tasker stop/resume`. ([Tasker](https://github.com/Dowwie/tasker))

**Spec Kitty** enforces TDD (LLM generates tests first, gets approval, then implements), git worktree isolation per work package, and backward lane transitions when review feedback triggers rework. ([Spec Kitty](https://github.com/Priivacy-ai/spec-kitty))

### Cross-Cutting Quality Patterns

- **Atomic commits per task** (GSD, Tasker, Pilot Shell) — enables `git bisect` debugging
- **Constitutional/principles files** (Spec Kit, cc-sdd, Smart Ralph) — persistent architectural guardrails
- **Fresh context windows** (GSD, Smart Ralph, Spec Kitty) — combat context rot
- **Claude Code hooks** (Pilot Shell, Smart Ralph) — intercept agent actions in real-time, blocking violations before they occur

The guardrails taxonomy from jvaneyck identifies the meta-principle: guardrails must run **inside** agent loops before human review, not after. ([jvaneyck Blog](https://jvaneyck.wordpress.com/2026/02/22/guardrails-for-agentic-coding-how-to-move-up-the-ladder-without-lowering-your-bar/))

---

## 5. Prompt Engineering Patterns: How Tools Talk to the AI

### The Fundamental Insight: Files as Prompts

The most consequential design pattern is that **plan files ARE the prompts**. GSD's documentation states explicitly: "The PLAN.md file isn't a document that becomes a prompt. It IS the executable instruction. Subagents read it directly." ([codecentric](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system))

Spec Kit similarly structures slash commands as "plain text files — Markdown or TOML depending on the agent — that instruct an AI agent how to execute a structured phase." ([Spec Kit DeepWiki](https://deepwiki.com/github/spec-kit/5-speckit-commands))

### XML-Structured Task Definitions

Multiple tools converge on XML as the internal task structure format, optimized for Claude's parsing:

```xml
<task type="auto" tdd="true">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>Use jose for JWT. Validate credentials. Return httpOnly cookie.</action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

GSD and PAUL independently arrived at this four-field pattern. "If you can't specify all four, the task is too vague." ([GSD](https://github.com/gsd-build/get-shit-done); [PAUL](https://github.com/ChristopherKahler/paul))

### Context Window Management

**Fresh Context Pattern** (dominant): GSD gives each executor a clean 200k-token context. The principle: "A task must fit in one context window. If it can't, it's two tasks." GSD v2 pre-packs dispatch prompts with all necessary artifacts so "the LLM starts execution with everything needed rather than spending tool calls on file reads." ([GSD-2](https://github.com/gsd-build/GSD-2))

**Managed Compaction** (alternative): Pilot Shell monitors context usage and auto-compacts at ~83.5%, with PreCompact hooks capturing state and PostCompact hooks restoring it. The principle: "Context level is NEVER a valid reason to skip a workflow step." ([Pilot Shell](https://github.com/maxritter/pilot-shell))

**The contradiction**: GSD/Agent Teams Lite claim fresh contexts are superior; Pilot Shell claims managed compaction is superior. Follow-up research revealed these are genuinely different architectural choices suited to different workflow patterns (batch execution vs. long exploratory sessions), not contradictions. ([Follow-up 1 findings](#))

### Dynamic Rule Injection

**PAUL's CARL** system uses environment-variable-style rules with RFC 2119 priorities (MUST/SHOULD/MAY) that auto-activate via recall keywords rather than consuming static prompt space:

```
PAUL_RULE_1=LOAD BEFORE EXECUTE: Before ANY /paul:* command, MUST Read the command file
PAUL_RULE_2=No implementation code without approved PLAN.md.
PAUL_RULE_3=Every APPLY must be followed by UNIFY.
```

([PAUL CARL Domain File](https://github.com/ChristopherKahler/paul/blob/main/src/carl/PAUL))

### Seven Cross-Tool Prompt Engineering Patterns

From deep analysis of GSD, PAUL, Pilot Shell, and Spec Kit source code:

1. **Thin Orchestrator / Fat Agent**: Orchestrators use 10-15% of context, agents get fresh 200k windows
2. **Mandatory Task Sub-Elements**: Every task requires files, action, verify, done
3. **BDD Acceptance Criteria as First-Class Citizens**: Given/When/Then format universal
4. **Constitution/Boundary Guards**: Inviolable project-level constraints
5. **Loop Closure Enforcement**: PAUL's mandatory UNIFY, GSD's VERIFICATION.md
6. **Context-Aware Rule Injection**: PAUL's CARL keywords, Pilot Shell's tool matchers
7. **Escalation Classification**: Auto-fixable issues vs. human-required decisions — all tools distinguish between them

([Follow-up 1: Prompt Templates analysis](#))

### BMAD's Distinctive Patterns

BMAD uses a **persona-driven** approach with four fields per agent (role, identity, communication_style, principles) plus **critical_actions** — imperative instructions using CAPS emphasis that explicitly forbid common LLM failure modes ("NEVER lie about tests being written or passing"). The **HALT-and-gate** system prevents LLM read-ahead, and a **facilitator pattern** ("YOU ARE A FACILITATOR, not a content generator") prevents autonomous content generation. ([BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD); [Follow-up 2](#))

---

## 6. Architecture & Extensibility Patterns

### Three Paradigms

**CLI-First Modular** (OpenSpec, Spec Kit, LeanSpec, AI Factory, SpecPulse, cc-sdd): Installable CLI packages scaffolding project directories. OpenSpec's custom schema system allows defining entirely new artifact types and workflow sequences. AI Factory has a full skill marketplace ecosystem. These support 8-20+ agents through unified command interfaces. ([OpenSpec Custom Schemas](https://intent-driven.dev/blog/2026/02/12/openspec-custom-schemas/); [AI Factory](https://github.com/lee-to/ai-factory))

**Deep Platform-Native** (Pilot Shell, PAUL, Smart Ralph, ContextKit, Tasker, SDD Cursor): Purpose-built for one platform, exploiting capabilities unavailable to cross-platform tools. Pilot Shell's five integrated MCP servers, lifecycle hooks, and language server integration are only possible because it targets Claude Code exclusively. ([Pilot Shell](https://github.com/maxritter/pilot-shell))

**MCP Server** (mcp-server-sdd, openspec-mcp, @leanspec/mcp, spec-workflow-mcp): Expose SDD as protocol-compliant services consumable by any MCP client. The openspec-mcp server is most feature-rich with approval state machine, review system, and WebSocket-powered web dashboard. ([openspec-mcp](https://github.com/Lumiaqian/openspec-mcp))

### Platform Breadth vs. Depth Trade-off

| Approach | Example | Agent Count | Unique Capabilities |
|----------|---------|-------------|-------------------|
| Maximum breadth | Spec Kit, OpenSpec | 20+ agents | Lowest common denominator (slash commands + markdown) |
| Multi-runtime | GSD | 4 runtimes | Conversion logic per runtime in single codebase |
| Maximum depth | Pilot Shell | 1 agent (Claude Code) | 5 MCP servers, lifecycle hooks, model routing, TDD enforcement |
| IDE-native | SDD Cursor | 1 agent (Cursor) | Subagent trees, async background execution, DAG scheduling |

([All repositories cited; Martin Fowler notes Spec Kit is "the most customizable" vs. Kiro/Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html))

### Hook Systems

Hook sophistication varies dramatically:
- **Pilot Shell**: 7 lifecycle events (SessionStart, PreToolUse, PostToolUse, Stop, PreCompact, SessionEnd), language-specific validators fire after every edit
- **GSD**: Session lifecycle hooks for statusline, context monitoring, session tracking
- **PAUL**: CARL dynamic rule loading based on file type and directory context
- **SDD Cursor**: `hooks.json` with `subagentStop` and `stop` events
- **Most tools**: No documented hook system at all

([Pilot Shell](https://github.com/maxritter/pilot-shell); [GSD](https://github.com/gsd-build/get-shit-done); [PAUL](https://github.com/ChristopherKahler/paul))

---

## 7. What the Community Has Learned

### Proven Practices

**Deterministic workflow orchestration beats agent self-direction.** QuantumBlack/McKinsey found that on larger codebases, "agents routinely skipped steps, created circular dependencies, or got stuck in analysis loops." Their solution: a rule-based engine enforcing phase transitions, with agents executing but never deciding what comes next. ([QuantumBlack](https://medium.com/quantumblack/agentic-workflows-for-software-development-dc8e64f4a79d))

**Micro-specs maintain agility.** Scoping specs to single features deliverable in 1-3 days is the most effective defense against "SDD is waterfall" critiques. One developer reports "8-hour iteration cycles with spec-driven work, producing tested features daily" and "20x ROI on well-defined acceptance tests." ([HN Discussion](https://news.ycombinator.com/item?id=45935763))

**Multi-agent review catches what execution agents miss.** Specialized review agents examine changes "with fresh context, free from the execution agent's accumulated assumptions" — catching "Baby-Counting" (dropped requirements), "Cardboard Muffin" (hollow implementations), and "Litterbug" (leftover TODOs). ([QuantumBlack](https://medium.com/quantumblack/agentic-workflows-for-software-development-dc8e64f4a79d); [Where Agents Fail](https://dev.to/danielbutlerirl/designing-agentic-workflows-where-agents-fail-and-where-we-fail-4a95))

**Three-tier boundary systems prevent catastrophic actions.** "Always do" (no approval), "Ask first" (oversight needed), "Never do" (hard stops). "Never commit secrets" was the single most common helpful constraint across 2,500+ agent files studied by GitHub. ([Addy Osmani](https://addyosmani.com/blog/good-spec/))

### Common Failure Modes

**The Sledgehammer Problem.** Böckeler tested Kiro on a small bug fix — it produced "4 user stories with 16 acceptance criteria." She struggled to find the right problem size. SDD overhead is disproportionate for small tasks. ([Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html))

**Agents routinely ignore markdown specs.** HN commenter CuriouslyC: "current implementations are trash because they hand off markdown files to an agent who might as well be wiping its ass with them for all the reproducibility you get." Marmelab confirms an agent falsely marked verification tasks complete. ([HN](https://news.ycombinator.com/item?id=45610996); [Marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html))

**Review burden shifts but does not decrease.** Developers spend "most of their time reading long Markdown files, hunting for basic mistakes hidden in overly verbose, expert-sounding prose." Böckeler notes she'd "rather review code than all these markdown files." ([Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html); [Marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html))

**The Curse of Instructions.** "Performance drops significantly as directive count increases." A massive spec overwhelms the model's attention budget. Small, focused context beats one giant prompt. ([Osmani](https://addyosmani.com/blog/good-spec/))

**Circular reasoning when agents write their own specs.** "Claude implements what it wrote, not what you actually need." Fix: "You provide domain knowledge; Claude structures it." ([SDD Anti-Patterns](https://dev.to/nur_farazi_00b69f650afa26/things-you-should-never-do-when-doing-spec-driven-development-with-claude-3445))

### Unresolved Debates

**"Is SDD just Waterfall?"** — genuinely heated and unresolved. Marmelab argues agents "rarely produce correct results on first attempt, requiring iterations that defeat Big Design Up Front." Counter: "the real waterfall problems were lengthy lead times and inability to iterate — neither applies with LLMs." Likely depends on spec granularity and iteration speed. ([Marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html); [HN](https://news.ycombinator.com/item?id=45935763); [Thoughtworks](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices))

**The SDD Triangle synchronization problem.** "The act of writing code improves the spec, and it improves the tests." Keeping spec, tests, and code synchronized is the core unsolved challenge. ([Breunig](https://www.dbreunig.com/2026/03/04/the-spec-driven-development-triangle.html))

**How much ceremony is too much?** The spectrum from OpenSpec (3 commands) to BMAD (21 agents, 34 workflows) is enormous. GSD was "born as a reaction to the perceived complexity of BMAD and Spec Kit." Yet BMAD reports a banking migration with "40% reduction in integration time." The right level appears highly context-dependent. ([GSD](https://github.com/gsd-build/get-shit-done); [SDD Frameworks Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop))

---

## 8. Convergence Map: Where Tools Agree (Likely Best Practices)

These patterns appear across 4+ independent tools, suggesting they represent proven practices:

| Pattern | Tools That Converge | Confidence |
|---------|-------------------|------------|
| Specify → Plan → Tasks → Implement pipeline | All 27 tools | Very High |
| File-based state management (never rely solely on conversation context) | All 27 tools | Very High |
| Acceptance criteria as first-class spec artifacts | GSD, PAUL, Spec Kit, Kiro, cc-sdd, Smart Ralph, BMAD | High |
| Four-field task structure (files, action, verify, done) | GSD, PAUL, Smart Ralph, Spec Kit | High |
| Fresh context per task to prevent quality degradation | GSD, GSD-2, Smart Ralph, Agent Teams Lite | High |
| Atomic git commits per task for surgical rollback | GSD, Tasker, Pilot Shell, AI Factory | High |
| Deterministic workflow orchestration (agents execute, don't decide what to do next) | GSD, QuantumBlack, cc-sdd, PAUL | High |
| Constitution/boundary files as architectural guardrails | Spec Kit, Spec Kit Plus, Spec Kitty, PAUL, Smart Ralph | High |
| BDD Given/When/Then format for acceptance criteria | PAUL, Spec Kit, Kiro, cc-sdd, BMAD | High |
| Verification criteria alongside every task (not just implementation instructions) | GSD, PAUL, Tasker, Smart Ralph, Spec Kit | High |

---

## 9. Divergence Map: Where Tools Disagree (Design Trade-offs)

| Trade-off | Position A | Position B | No Clear Winner Because... |
|-----------|-----------|-----------|--------------------------|
| **Context strategy** | Fresh context per task (GSD, Smart Ralph) | In-session managed compaction (PAUL, Pilot Shell) | Both claim superior reliability; no comparative data exists |
| **Subagent value** | Multi-agent parallel execution (GSD, BMAD, Spec Kitty) | Anti-subagent — "~70% quality" (PAUL) | PAUL's position is nuanced: subagents OK for research, bad for implementation ([Follow-up 1](#)) |
| **Spec complexity** | 8+ files per spec (Spec Kit) | <2k tokens per spec (LeanSpec) | Heavyweight specs create review burden; lightweight specs may miss requirements |
| **Platform strategy** | 20+ agent support (Spec Kit, OpenSpec) | Claude Code exclusive (Pilot Shell, PAUL) | Breadth = lowest common denominator; depth = platform-specific power features |
| **Automation level** | End-to-end autonomous (Shotgun drafting mode, Smart Ralph `--quick`) | Human gate at every phase (BMAD, Spec Kit) | Risk tolerance and team experience vary |
| **Spec-as-source** | Humans edit only specs, code is generated (Tessl) | Specs guide but code is the source of truth (everyone else) | Tessl combines "inflexibility AND non-determinism" per Fowler's team |
| **Spec formalism** | Markdown prose (most tools) | DSLs/formal schemas (Tasker FSM, BMAD Gherkin+JSON Schema) | Formalism improves machine parsing; prose improves human authoring |
| **Orchestration control** | External standalone agent (GSD-2 TypeScript app) | Internal prompt injection (Spec Kit, PAUL) | External = more control; internal = simpler installation |

---

## 10. Design Patterns Catalog

Extractable patterns for building a new spec-driven workflow tool, organized by concern:

### 10.1 Specification Patterns

**SP-1: Four-Field Task Atom**
Every task must specify: `files` (exact paths), `action` (specific implementation), `verify` (automated command proving correctness), `done` (acceptance criteria). Reject tasks missing any field. Used by GSD, PAUL, Smart Ralph.

**SP-2: Constitution Gate**
Define immutable project principles in a constitution file. All subsequent specs must pass constitutional checks before proceeding. Violations must be explicitly justified. Used by Spec Kit, Spec Kit Plus.

**SP-3: EARS Requirements Notation**
Structure requirements using EARS patterns: Ubiquitous ("The system shall..."), Event-Driven ("WHEN...THEN..."), State-Driven ("WHILE...THEN..."), Unwanted Behavior. Produces testable, unambiguous requirements. Used by Kiro, cc-sdd, mcp-server-sdd.

**SP-4: Delta Spec Evolution**
When specs change, don't overwrite — create delta files with ADDED/MODIFIED/REMOVED/RENAMED markers applied in deterministic order. Only mature implementation: OpenSpec.

**SP-5: Token-Conscious Spec Sizing**
Cap individual spec documents at a maximum token count (LeanSpec uses 2k). Ensures specs fit in context without crowding out implementation reasoning.

### 10.2 Execution Patterns

**EX-1: Fresh Context Per Task (Ralph Loop)**
Spawn a new agent per task with a clean context window. Agent reads specs from disk, implements one task, commits, and exits. Memory persists only via git and state files. Used by GSD, Smart Ralph, Agent Teams Lite.

**EX-2: Wave-Based Parallel Execution**
Group tasks into dependency waves. Wave 1 = independent tasks (parallel). Wave 2 = depends on Wave 1. Wave 3 = multi-dependency (sequential). Used by GSD.

**EX-3: Thin Orchestrator / Fat Agent**
The orchestrator uses 10-15% of context budget — it spawns agents, waits, and integrates results but never does real work. Agents get full fresh context windows. Used by GSD, Agent Teams Lite.

**EX-4: Loop Closure Enforcement**
Every execution phase must close with reconciliation (planned vs. actual). No orphan plans allowed. PAUL's UNIFY creates SUMMARY.md; GSD produces VERIFICATION.md. Used by PAUL, GSD.

**EX-5: Context Pre-Packing**
Before spawning a sub-agent, pre-load its prompt with all necessary artifacts (task plan, verification criteria, prior summaries, dependency summaries). The LLM starts execution with everything needed rather than spending tool calls on file reads. Used by GSD-2.

### 10.3 Quality Patterns

**QA-1: Code-Level Hook Enforcement**
Use PostToolUse hooks to run formatters, linters, and type checkers after every file edit — not as a final step. This catches issues at creation time, not review time. Used by Pilot Shell.

**QA-2: TDD Enforcement Hook**
A PreToolUse hook checks if implementation files were modified without a failing test existing first. Warns or blocks the edit. Used by Pilot Shell.

**QA-3: Goal-Backward Verification**
Verify by asking "what must be TRUE if this was implemented correctly?" then checking each condition. More reliable than checking whether individual tasks were completed. Used by GSD.

**QA-4: Atomic Commits Per Task**
One git commit per task with semantic messages. Enables `git bisect` to pinpoint which task introduced a bug and surgical rollback of individual tasks. Used by GSD, Tasker, Pilot Shell.

**QA-5: Stop Guard**
A hook that prevents session termination if active work has PENDING or incomplete status. Forces verification to complete before the agent can stop. Used by Pilot Shell.

**QA-6: Verifier/Reviewer Distinction**
Separate the **verifier** (post-implementation completeness check — "does the code match the spec?") from the **reviewer** (pre-merge quality gate — "is it good?"). Used by SDD Cursor.

### 10.4 Prompt Engineering Patterns

**PE-1: RFC 2119 Rule Priority**
Classify rules as MUST (inviolable), SHOULD (quality), and MAY (advisory). Gives the AI explicit guidance on which constraints are absolute vs. flexible. Used by PAUL's CARL.

**PE-2: Context-Aware Rule Injection**
Load rules dynamically based on recall keywords matching the current context (file type, directory, phase) rather than static system prompts that consume context permanently. Used by PAUL, Pilot Shell.

**PE-3: Escalation Classification**
Define three categories: auto-fixable (bugs, missing functionality, blockers), human-decision (architectural changes), and hard-stop (security, credentials). The agent auto-fixes the first, escalates the second, and refuses the third. Used by GSD, PAUL, Pilot Shell, Spec Kit.

**PE-4: HALT-and-Gate**
Prevent LLM read-ahead by ending each step with a HALT directive. Require explicit user selection before loading the next step. Classify unauthorized advancement as system failure. Used by BMAD.

**PE-5: Anti-Generation Directive**
For discovery/interview phases: "YOU ARE A FACILITATOR, not a content generator. NEVER generate content without user input." Prevents the LLM from filling in answers autonomously. Used by BMAD.

**PE-6: Ghost Constraint Detection**
When exploring problems, classify constraints as Hard (non-negotiable), Soft (negotiable with trade-off), or Ghost (past constraints baked into the approach that no longer apply). "Ghost constraints are the most valuable to find." Used by Pilot Shell.

### 10.5 Architecture Patterns

**AR-1: Files-as-Prompts**
Plan files ARE the executable instructions, not documents that get processed into prompts. Subagents read them directly from disk. Eliminates a layer of indirection and makes prompts version-controllable. Used by GSD, Spec Kit.

**AR-2: Command/Workflow Separation**
Commands are thin wrappers answering "what to do" while workflows answer "how to do it." Commands fit on one screen; complex logic lives in dedicated workflow files. Used by PAUL.

**AR-3: Agent Persona System**
Define agents with role, identity, communication_style, and principles fields. Compile YAML definitions to IDE-ready markdown with injected activation headers. Used by BMAD.

**AR-4: Artifact-Chained Phases**
Phases chain through artifact dependency, not explicit orchestration. Each phase produces documents that become inputs for the next. A help system inspects project state and recommends next steps. Used by BMAD.

---

## 11. Opinionated Recommendations

*For a developer building a new spec-driven agentic coding workflow for Claude Code:*

### Adopt These Patterns

1. **Fresh context per task** is non-negotiable for quality. The evidence that AI performance degrades past 40% context is consistent across multiple independent sources. Design every task to fit in one context window.

2. **The four-field task atom** (files, action, verify, done) should be your task format. Two tools arrived at it independently — it works because it forces precision and makes verification mechanical.

3. **Code-level enforcement via hooks** (PostToolUse linting, TDD enforcement) massively outperforms prompt-level instructions for quality. Invest in hooks before investing in fancier spec formats.

4. **Atomic commits per task** with semantic messages. The ability to `git bisect` to a specific task is invaluable for debugging and rollback.

5. **Acceptance criteria in BDD format** (Given/When/Then) as first-class citizens driving both task decomposition and verification. They are the most valuable spec artifact identified by practitioners.

6. **Escalation classification** — explicitly define what the agent can auto-fix vs. what needs human judgment vs. what is forbidden. Every mature tool does this.

7. **Thin orchestrator / fat agent** — keep the orchestrator lightweight (10-15% context budget). It should never do real work, only dispatch and integrate.

8. **Size specs for the task, not the tool.** Have a Quick mode for bug fixes and minor changes alongside a Full mode for features. BMAD and Pilot Shell both recognized that one-size-fits-all ceremony kills developer experience.

### Avoid These Patterns

1. **Don't generate 8+ markdown files per feature.** Spec Kit's approach was criticized as "repetitive, both with each other and with the code" by Thoughtworks. Keep artifact count minimal — 2-4 files maximum.

2. **Don't rely on markdown as a binding contract.** Agents ignore markdown specs regardless of formatting sophistication. Enforce critical constraints through code-level hooks, not prompt-level instructions.

3. **Don't let the agent write its own specs from scratch.** "Claude implements what it wrote, not what you actually need." The human provides domain knowledge; the AI structures it.

4. **Don't mix concerns in single specs.** Separate specs per bounded concern (API contracts, persistence, business rules, UI).

5. **Don't simulate a full agile team for solo development.** BMAD's 21 personas make sense for enterprise settings; for solo developers, it's overhead. ContextKit explicitly argues against multi-agent team simulation for solo work.

6. **Don't pursue spec-as-source yet.** Tessl's approach inherits the worst of both MDD and LLMs. Keep code as the source of truth; use specs as guides, not generators.

7. **Don't ignore spec evolution.** Most tools treat specs as write-once. If you're building for iterative development, you need OpenSpec-style delta tracking or PAUL-style phase summaries from day one.

### Design Decisions Without Clear Winners

These require you to make a judgment call based on your specific needs:

- **Platform exclusivity vs. portability**: Claude Code-only lets you use hooks, model routing, and deep platform features. Multi-platform reaches more users but limits to slash commands + markdown.
- **In-session compaction vs. fresh context spawning**: Both work. Fresh contexts are simpler; compaction preserves session continuity for exploratory work.
- **Subagents for implementation**: PAUL says no (70% quality). GSD says yes (with fresh contexts). The nuanced answer: subagents are good for research/review, weaker for code generation.

---

## Confidence Assessment

### High Confidence
- The four-stage pipeline convergence across all tools
- Fresh context per task prevents quality degradation
- Code-level hooks outperform prompt-level constraints for enforcement
- Acceptance criteria are the most valuable spec artifact
- The four-field task pattern works (independently validated by multiple tools)
- Atomic commits enable surgical debugging and rollback
- Context window degradation past 40% is a real and documented problem

### Medium Confidence
- EARS format as de facto requirements standard (widespread but not universal)
- Micro-specs (1-3 day scope) as the right granularity (practitioner reports, not controlled studies)
- Multi-agent review catching execution agent blind spots (McKinsey report + anecdotal)
- The "SDD is/isn't waterfall" debate likely depends on iteration speed (no empirical resolution)
- BMAD's enterprise value claims ("40% integration time reduction" — single self-reported case)
- 20x ROI on acceptance tests (single HN commenter, unverified)

### Low Confidence / Unresolved
- **No empirical effectiveness data exists.** Zero controlled studies compare SDD tools against each other or against unstructured AI coding. All claims are anecdotal.
- **Long-term spec maintenance costs are unknown.** No longitudinal studies. Arcturus Labs warns specs "miss the point more often and slow development" as applications grow.
- **Team-scale dynamics are untested.** Most experience reports come from solo developers. How SDD tools perform with 10+ developers is unknown.
- **API token cost implications** of different approaches (fresh context per task vs. in-session) are undocumented.
- **Cross-tool migration patterns** — no reports document teams switching between SDD tools.
- **Several tools had insufficient community feedback**: PAUL, Tasker, ContextKit, LeanSpec, mcp-server-sdd.

---

## Recommendations for Further Investigation

1. **Clone GSD and Pilot Shell repositories** to read full agent definitions (700-1300 lines each) and hook implementations — these contain the most sophisticated prompt engineering but were only partially extractable via web research.
2. **Run comparative benchmarks** on a standardized task (e.g., same feature implemented with GSD, PAUL, Pilot Shell, and raw Claude Code) to generate the empirical data that currently doesn't exist.
3. **Track API token costs** across different context strategies to quantify the fresh-context-per-task vs. in-session trade-off.
4. **Test spec evolution** on a multi-week project to see which approach (OpenSpec deltas, PAUL summaries, or manual updates) keeps specs synchronized with code.

---

## Sources

### Primary Sources (Tool Repositories)
- [GitHub Spec Kit](https://github.com/github/spec-kit) — reference SDD implementation, 76k stars, 20+ agents
- [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) — full agile team simulation, 40k stars
- [OpenSpec](https://github.com/Fission-AI/OpenSpec/) — brownfield-first, delta specs, YC-backed
- [GSD](https://github.com/gsd-build/get-shit-done) — fresh context execution, wave parallelism
- [GSD-2](https://github.com/gsd-build/GSD-2) — standalone CLI evolution of GSD
- [Taskmaster AI](https://github.com/eyaltoledano/claude-task-master) — PRD-to-task management
- [Pilot Shell](https://github.com/maxritter/pilot-shell) — hook-based TDD enforcement
- [PAUL](https://github.com/ChristopherKahler/paul) — Plan-Apply-Unify loop, CARL rules
- [Spec Kitty](https://github.com/Priivacy-ai/spec-kitty) — Kanban dashboard, worktree isolation
- [Shotgun](https://github.com/shotgun-sh/shotgun) — tree-sitter codebase indexing
- [cc-sdd](https://github.com/gotalab/cc-sdd) — Kiro-style EARS workflow
- [Smart Ralph](https://github.com/tzachbon/smart-ralph) — Ralph Wiggum Loop
- [AI Factory](https://github.com/lee-to/ai-factory) — skill marketplace
- [SpecPulse](https://github.com/specpulse/specpulse) — CLI-first cross-platform
- [LeanSpec](https://github.com/codervisor/lean-spec) — token-conscious agile specs
- [Tasker](https://github.com/Dowwie/tasker) — FSM contracts, exhaustive discovery
- [mcp-server-sdd](https://github.com/formulahendry/mcp-server-spec-driven-development) — minimal MCP server
- [ContextKit](https://github.com/FlineDev/ContextKit) — quality sub-agents, Swift focus
- [SDAD](https://github.com/marcelsud/spec-driven-agentic-development) — minimal 3-file methodology
- [SDD Cursor](https://github.com/madebyaris/spec-kit-command-cursor) — DAG parallel execution
- [Spec Kit Plus](https://github.com/panaversity/spec-kit-plus) — enterprise multi-agent extension
- [Spec-Flow](https://github.com/marcusgoll/Spec-Flow) — Gherkin + deployment
- [Agent Teams Lite](https://github.com/Gentleman-Programming/agent-teams-lite) — delegate-only orchestrator
- [openspec-mcp](https://github.com/Lumiaqian/openspec-mcp) — MCP server with dashboard

### Analysis & Commentary
- [Martin Fowler — Understanding SDD: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — most rigorous third-party analysis
- [Addy Osmani — How to write a good spec for AI agents](https://addyosmani.com/blog/good-spec/) — GitHub's 2,500+ agent file study
- [QuantumBlack/McKinsey — Agentic workflows for software development](https://medium.com/quantumblack/agentic-workflows-for-software-development-dc8e64f4a79d) — enterprise multi-agent patterns
- [Thoughtworks — SDD: Unpacking 2025's New Engineering Practices](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) — agile perspective
- [Marmelab — SDD: The Waterfall Strikes Back](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html) — critical analysis
- [Where agents fail](https://dev.to/danielbutlerirl/designing-agentic-workflows-where-agents-fail-and-where-we-fail-4a95) — failure mode taxonomy
- [SDD Anti-Patterns](https://dev.to/nur_farazi_00b69f650afa26/things-you-should-never-do-when-doing-spec-driven-development-with-claude-3445) — practical anti-pattern list
- [Breunig — The SDD Triangle](https://www.dbreunig.com/2026/03/04/the-spec-driven-development-triangle.html) — spec/test/code synchronization
- [Augment Code — What SDD gets wrong](https://www.augmentcode.com/blog/what-spec-driven-development-gets-wrong) — spec drift critique
- [jvaneyck — Guardrails for agentic coding](https://jvaneyck.wordpress.com/2026/02/22/guardrails-for-agentic-coding-how-to-move-up-the-ladder-without-lowering-your-bar/) — guardrails taxonomy
- [codecentric — The Anatomy of Claude Code Workflows](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system) — GSD deep dive
- [Context Engineering 101](https://newsletter.victordibia.com/p/context-engineering-101-how-agents) — context degradation research

### Comparison Articles
- [SDD Framework Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop) — BMAD vs GSD vs Ralph
- [OpenSpec vs Spec Kit](https://hashrocket.com/blog/posts/openspec-vs-spec-kit-choosing-the-right-ai-driven-development-workflow-for-your-team) — side-by-side comparison
- [BMAD vs Spec Kit vs OpenSpec vs PromptX](https://redreamality.com/blog/-sddbmad-vs-spec-kit-vs-openspec-vs-promptx/) — multi-tool comparison
- [SDD Map: 30+ Frameworks](https://medium.com/@visrow/spec-driven-development-is-eating-software-engineering-a-map-of-30-agentic-coding-frameworks-6ac0b5e2b484) — ecosystem overview
- [Augment Code — 6 Best SDD Tools](https://www.augmentcode.com/tools/best-spec-driven-development-tools) — tool rankings

### Tool Documentation (DeepWiki)
- [DeepWiki GSD](https://deepwiki.com/gsd-build/get-shit-done) — GSD architecture
- [DeepWiki PAUL](https://deepwiki.com/ChristopherKahler/paul) — PAUL system analysis
- [DeepWiki OpenSpec](https://deepwiki.com/Fission-AI/OpenSpec) — OpenSpec internals
- [DeepWiki Spec Kit](https://deepwiki.com/github/spec-kit) — Spec Kit commands
- [DeepWiki BMAD](https://deepwiki.com/bmad-code-org/BMAD-METHOD) — BMAD architecture

### Community Discussions
- [HN: SDD Waterfall Discussion](https://news.ycombinator.com/item?id=45935763) — waterfall debate
- [HN: SDD Tools Discussion](https://news.ycombinator.com/item?id=45610996) — tool experience reports
- [EARS Requirements Syntax](https://alistairmavin.com/ears/) — requirements notation standard

---

## Appendix: Comparison Matrix

| Feature | Spec Kit | BMAD | OpenSpec | GSD | PAUL | Pilot Shell | Spec Kitty | Shotgun | Taskmaster |
|---------|----------|------|---------|-----|------|-------------|------------|---------|------------|
| **Pipeline stages** | 5 (Const→Spec→Plan→Task→Impl) | 4 phases + Quick Flow | 3 (Propose→Apply→Archive) | 4 (Discuss→Plan→Execute→Verify) | 3 (Plan→Apply→Unify) | 3 (Plan→Implement→Verify) | 7 (Const→Spec→Plan→Research→Tasks→Impl→Review) | 5 (Research→Spec→Plan→Tasks→Export) | PRD→Tasks→Impl |
| **Spec format** | MD + constitution | YAML+Gherkin+JSON Schema+OpenAPI | YAML schema + MD deltas | XML tasks + MD plans | YAML frontmatter + XML sections | MD (implicit) | MD + YAML frontmatter | MD (AGENTS.md) | JSON (tasks.json) |
| **Agent support** | 20+ | Multiple IDEs | 20+ | 4 runtimes | Claude only | Claude only | 12 | 5+ | 10+ |
| **Context strategy** | N/A (template-based) | Sharded step files | N/A | Fresh 200k per task | In-session (anti-subagent) | Managed compaction | Worktree isolation | N/A | N/A |
| **Quality enforcement** | Constitution check + checklist | HALT gates + review workflows | /opsx:verify drift detection | Atomic commits + verify tags + UAT | BDD AC + DO NOT CHANGE + UNIFY | PostToolUse hooks + TDD enforcer + stop guard | TDD-first + lane review | Checkpoint confirmations | Task dependency tracking |
| **Human gates** | Every phase | Every agent handoff | Optional between phases | Post-discuss + post-verify | Post-plan + checkpoints + post-unify | Post-plan + post-verify | Kanban lane transitions | Mode-switched (planning vs drafting) | Manual task management |
| **Subagents** | N/A | 21+ personas | N/A | 12 specialized agents | Discouraged (research only) | Plan-reviewer + unified review | External orchestrator | 5 internal agents | N/A |
| **Spec evolution** | Open discussion #152 | Phase-based | Delta system (most mature) | Phase numbering + git | Phase summaries + UNIFY | N/A | Kanban lane transitions | Versioned publishing | AI-safe metadata |
| **Hook system** | Extension hooks (before_implement) | HALT-and-gate directives | N/A | Session lifecycle hooks | CARL dynamic rules | Full lifecycle (7 events) | Workflow transitions | Git hooks (Lefthook) | N/A |
| **MCP integration** | Referenced | N/A | Full MCP server available | Referenced | N/A | 5 built-in MCP servers | Referenced | Referenced | MCP-first (Cursor) |
| **Dashboard** | N/A | N/A | Web dashboard (via openspec-mcp) | N/A | N/A | N/A | Kanban dashboard | N/A | N/A |
| **Stars** | 76k | 40k | 30k | 28k | 250 | 1.5k | 900 | 640 | 26k |
