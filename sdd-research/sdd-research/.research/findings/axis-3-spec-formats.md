# Axis 3: Spec Format & Schema Design

## Question
How do different tools define and structure requirements/specs — what formats, schemas, and information models do they use, and what trade-offs result?

## Findings

## Feature Comparison Table

| Tool | Format Type | Core Spec Files | Required Fields / Sections | Spec Evolution Mechanism | Notable Design Choices |
|------|------------|----------------|---------------------------|------------------------|----------------------|
| **GitHub Spec Kit** | Markdown in `.specify/` dir | `spec.md`, `plan.md`, `tasks/`, `constitution.md`, `research.md`, `data-model.md`, `contracts/` | Goals, user journeys, architecture, task breakdown | Spec evolution via `/speckit.evolve`; discussion thread #152 | Constitution as governance layer; ~8 files per spec; CLI-driven phases ([GitHub Spec Kit repo](https://github.com/github/spec-kit)) |
| **OpenSpec** | YAML schema + Markdown in `openspec/` dir | `proposal.md`, `specs/` (delta), `design.md`, `tasks.md`, `.openspec.yaml` | Schema name, creation timestamp, proposal intent/scope | Delta specs with ADDED/MODIFIED/REMOVED/RENAMED markers; archive merges deltas into main spec | Custom schemas via `schema.yaml`; brownfield-first with delta specs; dependency-driven artifact state machine (BLOCKED/READY/DONE) ([OpenSpec repo](https://github.com/Fission-AI/OpenSpec/); [DeepWiki](https://deepwiki.com/Fission-AI/OpenSpec)) |
| **GSD (Get Shit Done)** | XML tasks + Markdown in `.planning/` dir | `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `{phase}-CONTEXT.md`, `{phase}-PLAN.md` | Task: `<name>`, `<files>`, `<action>`, `<verify>`, `<done>` | Phase-numbered plans; each task = separate git commit; max 3 tasks per plan | XML task format optimized for Claude; wave-based parallelism; 200k fresh tokens per sub-agent; anti-context-rot design ([GSD repo](https://github.com/gsd-build/get-shit-done)) |
| **Taskmaster AI** | JSON (`tasks.json`) | `tasks.json` with flat + nested structure | `id`, `title`, `description`, `status`, `priority` | AI-safe metadata preservation; complexity analysis commands | MCP-first (Cursor integration); JSON-native; optional `metadata` for external system links; subtask nesting ([Task Structure docs](https://docs.task-master.dev/capabilities/task-structure)) |
| **Kiro (AWS)** | Markdown in `.kiro/specs/` | `requirements.md`, `design.md`, `tasks.md` | EARS-format requirements, user stories, acceptance criteria | Requirements-first or design-first bidirectional workflow | EARS notation standard; 3-file simplicity; steering files (`product.md`, `tech.md`, `structure.md`); tightest scope of all tools ([Kiro docs](https://kiro.dev/docs/specs/feature-specs/); [Martin Fowler comparison](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)) |
| **cc-sdd** | Markdown in `.kiro/specs/` | `requirements.md`, `design.md`, `tasks.md` | EARS-format requirements; Design-ID + Trace-Matrix | Kiro-compatible; steering -> spec-init -> validate-gap -> spec-design -> validate-design -> spec-tasks -> spec-impl | Kiro-style but agent-agnostic; EARS patterns (Ubiquitous, Event-Driven, State-Driven, Optional, Unwanted); trace matrix for design-to-requirements mapping ([cc-sdd repo](https://github.com/gotalab/cc-sdd)) |
| **PAUL** | YAML frontmatter + XML sections in `.paul/` | `PROJECT.md`, `ROADMAP.md`, `STATE.md`, `phases/PLAN.md`, `phases/SUMMARY.md` | Plan: `<objective>`, `<context>`, `<acceptance_criteria>`, `<tasks>`, `<boundaries>` | Phase-numbered plans with summaries; `/paul:unify` mandatory closure | BDD acceptance criteria (Given/When/Then); `<boundaries>` for protected code; in-session execution (no sub-agents for implementation); AC-first development ([PAUL repo](https://github.com/ChristopherKahler/paul)) |
| **Tessl** | `.spec.md` files (1:1 with code files) | `{component}.spec.md` per code module | Description, Capabilities with `@test` links, API section | Bidirectional: spec-to-code and code-to-spec via `@generate`/`@describe` | Spec-as-source paradigm; `// GENERATED FROM SPEC - DO NOT EDIT` comments; 1:1 spec-to-file mapping; `@use` for spec composition ([Tessl launch blog](https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry/); [Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)) |
| **Spec Kitty** | Markdown with YAML frontmatter in `kitty-specs/` | `spec.md`, `plan.md`, `tasks.md`, `tasks/WP##.md` (up to 10 work packages), optional `research.md`, `data-model.md`, `contracts/` | Lane (`planned`/`doing`/`for_review`/`done`) in frontmatter per work package | Kanban lane transitions; git worktrees for isolation; auto-merge | Kanban-native; deterministic lane transitions; flat frontmatter-driven state; specs as repo-native git artifacts ([Spec Kitty repo](https://github.com/Priivacy-ai/spec-kitty)) |
| **Smart Ralph** | Markdown in `./specs/{name}/` | `research.md`, `requirements.md`, `design.md`, `tasks.md`, `.progress.md`, `.ralph-state.json` | User stories, acceptance criteria, architecture patterns, task breakdown | `.ralph-state.json` loop state; `.progress.md` tracking; state file deleted on completion | POC-first task sequencing; fresh context per task; also offers `ralph-speckit` plugin using Spec Kit conventions ([Smart Ralph repo](https://github.com/tzachbon/smart-ralph)) |
| **Tasker** | Markdown + JSON (FSMs) in structured dirs | Specification, Plan (`plan.md` with DAG), task results | FSM JSON for state machines; exhaustive requirement categories via reduce-while loops | Checkpoints before each batch; result files tracking outcomes; git commits for progress | FSM JSON as canonical contract; ADRs alongside specs; 6-phase task decomposition (logical decomposition -> physical mapping -> cross-cutting concerns -> task definition -> dependency analysis -> completeness audit) ([Tasker repo](https://github.com/Dowwie/tasker); [Gonzo Engineer intro](https://gonzo.engineer/posts/introducing-tasker)) |
| **SpecPulse** | Markdown + YAML frontmatter in `.specpulse/specs/` | Per-feature dirs (e.g., `specs/001-user-authentication/`) | Problem statement, functional/non-functional requirements, API contracts, acceptance criteria, success metrics | 11 cross-platform commands (`/sp-pulse`, `/sp-spec`, `/sp-plan`, `/sp-execute`) | 8-platform parity; semantic organization over rigid schemas; task-level metadata with unique IDs and status tracking ([SpecPulse repo](https://github.com/specpulse/specpulse)) |
| **Pilot Shell** | Markdown (implicit structure) | Plan files registered via `pilot register-plan` | Task list, status tracking (PENDING/COMPLETE) | Git worktrees for isolation; squash merge on completion | Claude Code exclusive; TDD enforcement hooks; no formal spec schema (workflow-driven rather than document-driven); quality hooks (lint/format/typecheck) as enforcement ([Pilot Shell repo](https://github.com/maxritter/pilot-shell)) |
| **Shotgun** | Markdown in `.shotgun/` | AGENTS.md files per stage | Codebase-aware context, staged PR instructions | Versioned spec publishing to workspace | Codebase graph analysis before spec generation; staged PRs with file-by-file instructions; export to Cursor/Claude/Windsurf formats ([Shotgun repo](https://github.com/shotgun-sh/shotgun)) |
| **Spec Kit Plus** | Markdown + JSON (extends Spec Kit) | Spec Kit files + `/sp.constitution`, `/sp.clarify`, `/sp.analyze`, `/sp.checklist` | Spec Kit fields + quality checklists, prompt history, evaluation artifacts | Spec Kit evolution + `/sp.analyze` cross-artifact consistency checks | Fork of Spec Kit for multi-agent AI systems; first-class treatment of architecture history, prompt history, and evaluations; Kubernetes/Dapr/Ray stack templates ([Spec Kit Plus repo](https://github.com/panaversity/spec-kit-plus)) |
| **LeanSpec** | Markdown in `.lean-spec/` | Small spec documents (<2,000 tokens each) | `depends_on`, `related` metadata fields | Living documents designed for frequent updates | Token-conscious (under 2,000 tokens per spec); anti-context-rot; agile-first; intentionally minimal schema ([LeanSpec repo](https://github.com/codervisor/lean-spec)) |
| **spec-kit-command-cursor** | Markdown + JSON in `.sdd/` | `spec.md`, `plan.md`, `tasks.md`, `roadmap.json` (DAG), `research.md`, `feature-brief.md` | Task DAG with `id`, `name`, `description`, `dependencies`, `touchedFiles` | `/evolve` command with `changelog.md`; downstream propagation | Cursor-native; JSON roadmap with DAG dependencies and parallel conflict prevention via `touchedFiles`; subagent trees with DAG execution ([spec-kit-command-cursor repo](https://github.com/madebyaris/spec-kit-command-cursor)) |
| **spec-driven-agentic-development** | Markdown in `features/{name}/` | `context.md`, `requirements.md`, `tasks.md` | EARS-formatted requirements, context/technical decisions, TDD task breakdown | Slash commands `/spec:create` and `/spec:execute` | Minimal 3-file approach; EARS format; optimized for Claude Code `.claude/commands/` integration ([spec-driven-agentic-development repo](https://github.com/marcelsud/spec-driven-agentic-development)) |
| **mcp-server-spec-driven-development** | Markdown in `specs/` | `requirements.md`, `design.md` + implementation code | EARS-format requirements, architectural design | Linear pipeline: requirements -> design -> code | MCP server protocol; no rigid schema; emphasis on traceability between stages; tool-agnostic via MCP ([mcp-server-sdd repo](https://github.com/formulahendry/mcp-server-spec-driven-development)) |
| **ContextKit** | Markdown in `Context/Features/` | `Spec.md`, `Tech.md`, `Steps.md` (or single `.md` for quick tasks) | User stories, acceptance criteria, success metrics, file-by-file tasks with S001-S999 numbering | Sequential numbering (001-, 002-) for development history tracking | Claude Code exclusive; parallel execution markers `[P]`; explicit uncertainty marking; quality agents for accessibility/localization/privacy ([ContextKit repo](https://github.com/FlineDev/ContextKit)) |
| **BMAD-METHOD** | YAML workflows + Markdown + JSON Schema + Gherkin | `requirements.md`, `architecture.md`, JSON Schema files (`user.schema.json`), Gherkin `.feature` files, `openapi.yml` | Per-agent role outputs; JSON Schema for data models; Gherkin for behavior specs | 34+ workflows with deterministic phase transitions; 12+ specialized agent roles | Most complex: simulates full agile team (PM, Architect, Developer, UX, Scrum Master); JSON Schema + Gherkin + OpenAPI; "version control for intent" ([BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD)) |

---

## Narrative Analysis of Design Philosophies

### 1. The Fundamental Tension: Rigor vs. Lightweight Agility

The most significant axis of differentiation across these tools is the trade-off between specification thoroughness and developer friction. At one extreme, **BMAD-METHOD** simulates an entire agile team with 12+ AI agent personas, producing JSON Schema data models, Gherkin behavior specifications, and OpenAPI contracts -- a level of formalism borrowed from enterprise software engineering [BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD). At the other extreme, **LeanSpec** deliberately caps individual spec documents at under 2,000 tokens, arguing that "context rot is real" and that heavyweight specs degrade AI agent output quality [LeanSpec repo](https://github.com/codervisor/lean-spec). **GSD** takes a middle position, using structured XML for task definitions but limiting plans to a maximum of 3 tasks each, with 200k fresh tokens allocated per sub-agent to prevent context degradation [GSD repo](https://github.com/gsd-build/get-shit-done).

Martin Fowler's team tested Kiro and Spec Kit on a real bug fix and found both tools excessive for small tasks -- Kiro converted a minor issue into "4 user stories with 16 acceptance criteria," leading to the observation that "neither of them is suitable for the majority of real life coding problems" [Martin Fowler SDD comparison](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html). This critique highlights a fundamental problem: tools designed for feature-scale work impose ceremony that becomes counterproductive for bug fixes and small changes.

### 2. Three Dominant Information Models

The tools cluster into three distinct information models (Confidence: **High**):

**Model A: Three-Phase Document Pipeline (requirements -> design -> tasks)**. This is the most common pattern, used by **Kiro**, **cc-sdd**, **mcp-server-spec-driven-development**, **spec-driven-agentic-development**, and **Smart Ralph**. All produce Markdown documents in a linear progression. The EARS (Easy Approach to Requirements Syntax) format has emerged as a de facto standard for the requirements phase, with its structured patterns -- Ubiquitous ("The system shall..."), Event-Driven ("WHEN...THE SYSTEM SHALL..."), State-Driven ("WHILE...THE SYSTEM SHALL..."), and Unwanted Behavior patterns -- providing testable, unambiguous requirements that AI agents can decompose into tasks [EARS official guide](https://alistairmavin.com/ears/); [cc-sdd repo](https://github.com/gotalab/cc-sdd). Kiro originated this three-file model, and cc-sdd explicitly maintains Kiro compatibility while adding a Trace-Matrix for mapping requirements to design elements [cc-sdd repo](https://github.com/gotalab/cc-sdd).

**Model B: Constitution/Governance + Phased Pipeline**. **GitHub Spec Kit** and its derivatives (**Spec Kit Plus**, **spec-kit-command-cursor**, **Spec Kitty**) extend the basic pipeline with a `constitution.md` governance layer -- a set of "non-negotiable principles" that constrain all subsequent specs [GitHub Spec Kit repo](https://github.com/github/spec-kit); [Microsoft Dev Blog](https://developer.microsoft.com/blog/spec-driven-development-spec-kit). Spec Kit generates approximately 8 files per spec (including `research.md`, `data-model.md`, `contracts/`), which was criticized as "a LOT of markdown files" that were "repetitive, both with each other, and with the code that already existed" [Martin Fowler SDD comparison](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html). **Spec Kit Plus** further extends this with prompt history and automated evaluations as first-class artifacts [Spec Kit Plus repo](https://github.com/panaversity/spec-kit-plus).

**Model C: Spec-as-Source (Bidirectional Mapping)**. **Tessl** takes the most radical approach: each `.spec.md` file maps 1:1 to a code file, with `@generate` tags directing code generation and `// GENERATED FROM SPEC - DO NOT EDIT` comments in output files. Specs include Description, Capabilities (with `@test` links), and API sections [Tessl launch blog](https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry/). The Martin Fowler analysis noted this approach inherits potential "downsides of both MDD [Model-Driven Development] and LLMs: Inflexibility _and_ non-determinism," since generating code from identical specs multiple times can produce different results [Martin Fowler SDD comparison](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html).

### 3. Format Choices and Their Implications

**Markdown dominance**: Every single tool uses Markdown as its primary spec format, reflecting both human readability and the reality that LLMs process natural language well. However, tools diverge in how they add structure atop Markdown (Confidence: **High**):

- **YAML frontmatter** is used by Spec Kitty (for Kanban lane tracking), PAUL (for plan metadata like phase/type/autonomous flags), and SpecPulse (for task metadata) [Spec Kitty repo](https://github.com/Priivacy-ai/spec-kitty); [PAUL repo](https://github.com/ChristopherKahler/paul).
- **XML task definitions** are used by GSD and PAUL, specifically because XML structures are reportedly better parsed by Claude models than alternative formats [GSD repo](https://github.com/gsd-build/get-shit-done).
- **JSON** appears in Taskmaster AI (`tasks.json` as the primary format), Tasker (FSM JSON as canonical state machine contracts), and spec-kit-command-cursor (`roadmap.json` with DAG dependencies) [Task Structure docs](https://docs.task-master.dev/capabilities/task-structure); [Tasker repo](https://github.com/Dowwie/tasker).
- **Formal schemas** are only used by BMAD-METHOD (JSON Schema for data models, Gherkin for behaviors, OpenAPI for APIs) and OpenSpec (Zod validation schemas for structural correctness) [BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD); [DeepWiki OpenSpec](https://deepwiki.com/Fission-AI/OpenSpec).

### 4. Spec Evolution: The Unsolved Problem

How specs change over time is handled with strikingly different levels of sophistication (Confidence: **Medium**):

- **OpenSpec** is the most mature here, with its delta spec system using ADDED/MODIFIED/REMOVED/RENAMED markers and a strict archive application order (RENAMED -> REMOVED -> MODIFIED -> ADDED) to prevent conflicts [DeepWiki OpenSpec](https://deepwiki.com/Fission-AI/OpenSpec). This is purpose-built for brownfield development where specs must track changes to existing systems.
- **spec-kit-command-cursor** offers an `/evolve` command that produces a `changelog.md` with "downstream propagation" when specs change [spec-kit-command-cursor repo](https://github.com/madebyaris/spec-kit-command-cursor).
- **GSD** and **PAUL** use phase numbering to version plans sequentially, with git commits providing atomic traceability [GSD repo](https://github.com/gsd-build/get-shit-done).
- **Most tools** lack explicit evolution mechanisms, treating specs as write-once documents for a single feature cycle. GitHub Spec Kit has an open discussion (#152) about how to handle spec evolution, suggesting this remains an unsolved design challenge [Spec Kit Discussion #152](https://github.com/github/spec-kit/discussions/152).

### 5. Human-Authored vs. AI-Generated vs. Collaborative

The authorship model reveals a philosophical split (Confidence: **High**):

- **Human-authored, AI-consumed**: Tessl's spec-as-source model expects humans to maintain specs as the primary artifact, with code derived from them [Tessl launch blog](https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry/).
- **AI-generated, human-approved**: Most tools (Spec Kit, OpenSpec, GSD, Kiro) have the AI draft specs from high-level descriptions, with humans reviewing and approving before implementation proceeds. cc-sdd makes this explicit: "Approve requirements/design upfront, then AI implements exactly as specified" [cc-sdd repo](https://github.com/gotalab/cc-sdd).
- **Iterative collaboration**: Tasker uses "reduce-while loops that continue until all requirement categories are covered," forcing an iterative back-and-forth between human and AI until the specification is exhaustive [Tasker repo](https://github.com/Dowwie/tasker). GSD's discuss phase similarly captures implementation preferences through structured questioning [GSD repo](https://github.com/gsd-build/get-shit-done).

### 6. Context Engineering as Anti-Degradation Strategy

Several tools explicitly design their spec formats around preventing AI context window degradation:

- **GSD** limits plans to 3 tasks and runs each in a fresh sub-agent with 200k tokens, ensuring "zero context rot" [GSD repo](https://github.com/gsd-build/get-shit-done).
- **LeanSpec** caps specs at 2,000 tokens specifically to preserve AI output quality [LeanSpec repo](https://github.com/codervisor/lean-spec).
- **Smart Ralph** executes tasks with "fresh context per task" [Smart Ralph repo](https://github.com/tzachbon/smart-ralph).
- **PAUL** keeps implementation in-session (no sub-agents) but uses `STATE.md` to persist decisions across sessions, and reserves sub-agents only for research/discovery [PAUL repo](https://github.com/ChristopherKahler/paul).
- **Spec Kitty** and **Pilot Shell** use git worktrees to provide isolation, preventing cross-feature context contamination [Spec Kitty repo](https://github.com/Priivacy-ai/spec-kitty); [Pilot Shell repo](https://github.com/maxritter/pilot-shell).

### 7. The Acceptance Criteria Spectrum

Tools range from informal to highly structured acceptance criteria:

- **PAUL** mandates BDD-format Given/When/Then criteria with identifiers (AC-1, AC-2) that tasks must cross-reference [PAUL repo](https://github.com/ChristopherKahler/paul).
- **Kiro/cc-sdd** use EARS notation for structured, testable requirements [Kiro docs](https://kiro.dev/docs/specs/feature-specs/).
- **BMAD-METHOD** goes furthest with Gherkin `.feature` files for executable behavior specifications [BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD).
- **Tasker** uses FSM JSON as canonical acceptance contracts -- state machines that "shape acceptance criteria during implementation and produce documentation for ongoing understanding" [Tasker repo](https://github.com/Dowwie/tasker).
- **GSD** uses simple `<verify>` and `<done>` XML tags per task [GSD repo](https://github.com/gsd-build/get-shit-done).

### 8. Platform Coupling vs. Portability

A clear divide exists between tools built for one agent and those targeting portability (Confidence: **High**):

- **Exclusive**: Pilot Shell and ContextKit are Claude Code-only [Pilot Shell repo](https://github.com/maxritter/pilot-shell); [ContextKit repo](https://github.com/FlineDev/ContextKit). Taskmaster AI originated as Cursor-first via MCP [Taskmaster repo](https://github.com/eyaltoledano/claude-task-master).
- **Portable**: OpenSpec works with 20+ tools [OpenSpec site](https://openspec.pro/). SpecPulse supports 8 platforms with identical commands [SpecPulse repo](https://github.com/specpulse/specpulse). Spec Kit supports 22+ agent platforms [GitHub Spec Kit repo](https://github.com/github/spec-kit). cc-sdd supports Claude Code, Codex, OpenCode, Cursor, Copilot, Gemini CLI, and Windsurf [cc-sdd repo](https://github.com/gotalab/cc-sdd).

---

## Key Unknowns

1. **"OpenKit"** -- No tool by this exact name was found in the spec-driven development ecosystem. It may be a confusion with GitHub Spec Kit, or a tool that has been renamed or does not yet exist publicly.

2. **"agentic-code"** -- No specific tool by this name was found despite targeted searching. It may refer to a concept rather than a specific tool.

3. **"ai-factory"** -- No specific spec-driven development tool by this name was found. The term may refer to a broader concept or an internal/private tool.

4. **BMAD-METHOD internal spec schemas** -- While BMAD is known to use JSON Schema, Gherkin, and OpenAPI, the exact required fields and template structures are documented on their separate docs site (`docs.bmad-method.org`), which returned only a landing page. The full specification would require reading their `llms-full.txt` consolidated documentation file.

5. **Tasker's FSM JSON schema** -- The exact JSON schema for finite state machine contracts is documented in `docs/protocol.md` in the repository but was not publicly rendered in any documentation page fetched.

6. **Spec evolution maturity** -- For most tools beyond OpenSpec, how specs handle requirements changes mid-implementation is either undocumented or explicitly acknowledged as an open problem (GitHub Spec Kit Discussion #152).

7. **Empirical effectiveness comparisons** -- No controlled studies comparing these spec formats' impact on code quality, agent accuracy, or developer productivity were found. Claims of effectiveness are self-reported by tool authors.

8. **Long-term maintenance burden** -- How these spec artifacts age over months/years of a real project is not documented for any tool. The concern raised by Martin Fowler's team ("I'd rather review code than all these markdown files") suggests spec maintenance may be a significant hidden cost.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 25+
