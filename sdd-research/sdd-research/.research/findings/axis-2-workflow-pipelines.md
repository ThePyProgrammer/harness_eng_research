# Axis 2: Workflow Pipeline & Human-in-the-Loop Design

## Question
How does each tool structure the journey from requirements to working code, and where do they place human decision points vs. automated steps?

## Findings

## 1. The Universal Pipeline: Convergence Around a Four-Stage Core

Nearly every spec-driven development (SDD) tool converges on a variation of the same fundamental pipeline: **Specify -> Plan -> Tasks -> Implement**, with differences emerging in how rigidly phases are enforced, where human gates are placed, and whether additional stages (verification, archival, reconciliation) bookend the process. As the GitHub Blog describes it, the approach works because it "separates the stable 'what' from the flexible 'how,'" allowing agents to execute well-defined intent rather than interpret vague directives. [Spec-driven development with AI: Get started with a new open source toolkit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

The Martin Fowler/Thoughtworks analysis introduces a useful maturity taxonomy: **spec-first** (specs written before code but discarded afterward), **spec-anchored** (specs persist and evolve with features), and **spec-as-source** (specs are the primary artifact, humans never edit generated code). Most current tools operate at the spec-first level, with only Tessl explicitly pursuing spec-as-source. [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

**Confidence: High** -- the four-stage pattern is documented consistently across GitHub Spec Kit, OpenSpec, cc-sdd, SpecPulse, Spec Kitty, ContextKit, and spec-kit-plus.

---

## 2. Linear Pipelines: Strict Phase Gates with Human Approval

Several tools enforce a strictly linear progression where each phase must complete before the next begins, with explicit human approval gates between stages.

### GitHub Spec Kit (the reference implementation)
Pipeline: **Constitution -> Specify -> Plan -> Tasks -> Implement**. The constitution establishes immutable architectural principles. Each subsequent phase produces markdown artifacts that the human reviews before triggering the next slash command. Pull requests are never merged automatically. [Spec-driven development with AI](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) The Thoughtworks review noted it created an "overwhelming review burden" because of the volume of generated documentation (8+ artifacts per spec). [Understanding SDD: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

### cc-sdd (Kiro-style commands)
Pipeline: **Steering -> Spec-init -> (Validate-gap) -> Spec-design -> (Validate-design) -> Spec-tasks -> Spec-impl**. Uses EARS (Easy Approach to Requirements Syntax) format for requirements. Optional validation commands (`/kiro:validate-gap`, `/kiro:validate-design`) serve as human-triggered quality gates. Supports a `-y` flag to skip confirmations for automation scenarios. [cc-sdd GitHub](https://github.com/gotalab/cc-sdd)

### Tasker
Pipeline: **Specify -> Plan -> Execute**. Distinguishes itself through exhaustive specification capture using "reduce-while loops that continue until all requirement categories are covered." The Plan phase uses a six-step decomposition protocol producing a directed acyclic graph (DAG) of task dependencies. Checkpoints are created before each execution batch, enabling `tasker stop` and `tasker resume` for human intervention. [Tasker GitHub](https://github.com/Dowwie/tasker)

### mcp-server-spec-driven-development
Pipeline: **Generate-requirements -> Generate-design -> Generate-code**. The most minimal linear pipeline found -- three MCP prompts that chain sequentially. The first accepts a high-level description and produces EARS-format requirements; subsequent phases are fully automated, generating design and then code with human review expected between phases but not enforced by the tool. [mcp-server-spec-driven-development GitHub](https://github.com/formulahendry/mcp-server-spec-driven-development)

### spec-driven-agentic-development (marcelsud)
Pipeline: **`/spec:create` -> `/spec:execute`**. The simplest two-command workflow found. Creates `context.md`, `requirements.md` (EARS format), and `tasks.md` in a single generation step, then executes implementation. Human review is implicit between the two commands. [spec-driven-agentic-development GitHub](https://github.com/marcelsud/spec-driven-agentic-development)

**Confidence: High** -- these pipelines are directly documented in each tool's README and command structure.

---

## 3. Iterative Loop Pipelines: Cycles with Built-in Feedback

### GSD (Get Shit Done)
Pipeline: **Discuss -> Plan -> Execute -> Verify** (repeating loop per phase within a milestone). GSD was explicitly designed as a reaction to perceived over-engineering in tools like BMAD and Spec Kit. Its creator stated: "I'm a solo developer. I don't write code -- Claude Code does. But other SDD tools seem to complicate everything." [GSD Framework comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop)

The Discuss phase captures design preferences through clarifying questions. The Plan phase spawns 4 parallel research investigators (stack, features, architecture, pitfalls), then generates 2-3 atomic task plans validated against requirements. Execute runs plans in dependency-ordered "waves" with each executor getting a fresh 200k-token context window. Verify uses goal-backward validation ("what must be TRUE?") rather than task-completion checking. [GSD GitHub](https://github.com/gsd-build/get-shit-done)

Human gates: project initialization questions, discuss-phase approval, verification acceptance. Automated: research, planning, wave-based parallel execution, atomic git commits per task.

### PAUL (Plan-Apply-Unify Loop)
Pipeline: **Plan -> Apply -> Unify** (mandatory closed loop, repeated per work unit). Every plan must reach closure through the Unify step -- "no shortcuts" are permitted. The Plan phase defines acceptance criteria in BDD Given/When/Then format before any tasks; Apply executes sequentially with checkpoint pauses; Unify generates a SUMMARY.md comparing planned vs. actual outcomes and records deferred issues. The framework explicitly prioritizes in-session context over subagent parallelization, arguing that subagents "start context-gathering from scratch" and produce "~70% quality" results requiring rework. [PAUL GitHub](https://github.com/ChristopherKahler/paul)

Human gates: plan approval before Apply, checkpoint pauses during execution, verification via `/paul:verify`. PAUL uses a companion system called CARL (Context Augmentation & Reinforcement Layer) that dynamically loads rules based on context.

### Smart Ralph (Ralph Wiggum Loop)
Pipeline: **Triage (optional) -> Research -> Requirements -> Design -> Tasks -> Implementation** with the Ralph Loop executing tasks as: **Make it work -> Refactor -> Test -> Quality Gates**. Named after the agentic loop pattern, its philosophy is: "Ralph doesn't overthink. Ralph just does the next task." The default flow pauses after each spec artifact for human approval, but `--quick` mode auto-generates everything. Each execution phase uses specialized sub-agents with fresh context, preventing token bloat. Tasks support `[P]` markers for parallel work and `[VERIFY]` markers for explicit verification steps. [Smart Ralph GitHub](https://github.com/tzachbon/smart-ralph)

**Confidence: High** -- GSD and PAUL loop structures are extensively documented; Smart Ralph's loop pattern is well-described in its repository.

---

## 4. Parallel Execution Pipelines: Multi-Agent Orchestration

### BMAD (Breakthrough Method for Agile AI-Driven Development)
Pipeline: **Analysis -> Planning -> Solutioning -> Implementation**, coordinated across 12+ specialized AI agents (Analyst, PM, Architect, Developer, UX Designer, Scrum Master, QA, etc.). The Analyst creates a project brief; the PM transforms it into a PRD with epic definitions; the Architect designs the system architecture; the Scrum Master "shards" the PRD into hyper-detailed story files; the Developer agent implements from individual stories. [BMAD Method GitHub](https://github.com/bmad-code-org/BMAD-METHOD)

BMAD has the highest human decision intensity of all tools surveyed, with approval gates between each agent handoff. It includes "Adversarial Review" and "Party Mode" (multiple agent personas collaborating in one session). Scale-adaptive intelligence automatically adjusts planning depth based on project complexity. [BMAD 6-Step AI Dev Workflow](https://www.theaistack.dev/p/bmad)

### Spec Kitty
Pipeline: **Constitution -> Specify -> Plan -> (Research) -> Tasks -> Implement -> Review -> Merge**. Distinctive features include a live Kanban dashboard with four lanes (planned -> doing -> for_review -> done), git worktree isolation for each work package, and a multi-agent orchestration model. Work packages execute in isolated worktrees under `.worktrees/`, preventing merge conflicts during parallel development. A review gate (`/spec-kitty.review`) evaluates code against acceptance criteria before approval. [Spec Kitty GitHub](https://github.com/Priivacy-ai/spec-kitty)

Supports 12 AI agents and includes an external orchestrator for parallel work package execution across multiple agents simultaneously. This is the only tool found that provides a persistent visual dashboard for tracking pipeline state.

### spec-kit-command-cursor (SDD Cursor Commands v5.0)
Pipeline: Three pathways -- **Quick** (`/brief -> /evolve -> /refine`), **Full** (`/research -> /specify -> /plan -> /tasks -> /implement`), and **Parallel** (`/sdd-full-plan -> /execute-parallel --until-finish`). Uses six specialized subagents (explorer, planner, implementer, verifier, reviewer, orchestrator), with background subagents enabling true parallel development. The orchestrator manages a DAG of task dependencies, detects file conflicts via `touchedFiles` declarations, and prevents simultaneous edits to the same resources. Includes deadlock detection for circular dependencies. [spec-kit-command-cursor GitHub](https://github.com/madebyaris/spec-kit-command-cursor)

**Confidence: High** for Spec Kitty and spec-kit-command-cursor (detailed README docs); **Medium** for BMAD (full orchestration details require deeper documentation than the README provides).

---

## 5. Minimalist Pipelines: Lightweight by Design

### OpenSpec
Pipeline: **Propose -> Apply -> Archive**. Three slash commands (`/opsx:propose`, `/opsx:apply`, `/opsx:archive`). Propose generates a proposal.md, specs directory, design.md, and tasks.md. The framework is explicitly described as "fluid not rigid" -- humans can revisit and modify any artifact throughout development without phase-gate restrictions. Completed features are archived with date-stamped directories. Designed specifically for existing codebases where multiple changes coexist. [OpenSpec GitHub](https://github.com/Fission-AI/OpenSpec/) / [openspec.dev](https://openspec.dev/)

### LeanSpec
Pipeline: **Discover -> Design -> Implement -> Validate**. Enforces a token constraint: specs stay under approximately 2,000 tokens. Positions itself as "agile SDD" that avoids the "multi-step workflows, rigid templates" of heavier tools. Provides a Kanban board (`lean-spec board`), smart search, and project health metrics, but minimal process enforcement. [LeanSpec GitHub](https://github.com/codervisor/lean-spec)

### Pilot Shell
Pipeline: **Plan -> Implement (TDD) -> Verify**, triggered by a single `/spec` command. Replaces Claude Code's built-in plan mode. The Plan phase uses semantic search exploration plus a plan-reviewer sub-agent. Implementation enforces strict TDD (RED -> GREEN -> REFACTOR) in isolated git worktrees. Verification uses a unified review sub-agent that auto-fixes findings and squash-merges to main. Uses model routing: Opus for planning, Sonnet for implementation. Has a separate bugfix workflow: **Investigate -> Test-before-fix -> Verify**. [Pilot Shell GitHub](https://github.com/maxritter/pilot-shell)

**Confidence: High** -- each tool's documentation clearly describes a deliberately minimal approach.

---

## 6. Hybrid and Extended Pipelines

### SpecPulse
Pipeline: **Pulse (init) -> Spec -> Plan -> Tasks -> Execute -> Status/Validate**. Six phases with 11 commands that work identically across 8 AI platforms. Separates concerns into a CLI layer (reliable file structure creation) and an AI enhancement layer (content generation). Each phase has a corresponding validate command (`/sp-spec validate`, `/sp-plan validate`, `/sp-task validate`). Fully automated execution is possible via `/sp-execute all`. [SpecPulse GitHub](https://github.com/specpulse/specpulse)

### ContextKit
Pipeline: **Business Case -> Technical Architecture -> Implementation Tasks -> Development**. Four-phase methodology with "supervised autonomy" -- specialized quality agents handle accessibility, localization, and modern code checks automatically during the development phase. Includes a backlog management system (`/ctxk:bckl:add-idea`, `/ctxk:bckl:prioritize-ideas`). Quick workflow alternative (`/ctxk:plan:quick`) for smaller tasks bypasses the full pipeline. [ContextKit GitHub](https://github.com/FlineDev/ContextKit)

### Shotgun
Pipeline: **Research -> Specify -> Plan -> Tasks -> Export**. Router-driven flow with two user-facing modes: Planning (checkpoints at each phase, human confirmation required) and Drafting (runs end-to-end without intermediate confirmations). The key differentiator is that it reads "your entire repository before generating specs," discovering existing patterns and dependencies automatically. Exports generate `AGENTS.md` files formatted for specific AI tools. [Shotgun GitHub](https://github.com/shotgun-sh/shotgun)

### spec-kit-plus (Panaversity)
Pipeline: **Constitution -> Specify -> (Clarify) -> Plan -> (Analyze) -> Tasks -> (Checklist) -> Implement**. Extends GitHub's Spec Kit with multi-agent support (16+ AI agents), cloud-native patterns (Docker, Kubernetes, Dapr, Ray), and specialized subagents (Spec Architect, PHR/ADR Curator). Treats "specifications, architecture history, prompt history, tests, and automated evaluations" as first-class production artifacts. [spec-kit-plus GitHub](https://github.com/panaversity/spec-kit-plus)

### Agent Factory (Panaversity)
Pipeline: **Parallel Research (subagents) -> Write Specifications -> Refine via Interview -> Task-Based Implementation**. Uses native Claude Code capabilities (CLAUDE.md memory, subagents, Tasks, Hooks). The refinement phase uses `ask_user_question` tool calls to surface ambiguities before implementation. [Agent Factory SDD Chapter](https://agentfactory.panaversity.org/docs/General-Agents-Foundations/spec-driven-development)

**Confidence: High** for SpecPulse, ContextKit, Shotgun; **Medium** for spec-kit-plus and Agent Factory (less detailed workflow documentation).

---

## 7. Pipeline Diagram Summary: Five Distinct Architectural Patterns

```
PATTERN A: STRICT LINEAR (cc-sdd, Spec Kit, Tasker, mcp-server-sdd)
  Requirements ──[HUMAN GATE]──> Design ──[HUMAN GATE]──> Tasks ──[HUMAN GATE]──> Code

PATTERN B: ITERATIVE LOOP (GSD, PAUL)
  ┌──> Discuss/Plan ──[HUMAN GATE]──> Execute ──> Verify ──[HUMAN GATE]──┐
  │                                                                       │
  └───────────────────── (next phase) ◄───────────────────────────────────┘

PATTERN C: MULTI-AGENT ORCHESTRATION (BMAD, Spec Kitty, spec-kit-command-cursor)
  Analyst ──> PM ──> Architect ──> Scrum Master ──> Developer(s) [parallel]
       └─[HUMAN GATE at each handoff]─┘       └─[Review + Merge gate]─┘

PATTERN D: FLUID/MINIMAL (OpenSpec, LeanSpec, Pilot Shell)
  Propose ──[optional review]──> Apply ──> Archive
  (any artifact modifiable at any time; minimal phase enforcement)

PATTERN E: MODE-SWITCHED (Shotgun)
  [Planning Mode]: Research ──[checkpoint]──> Spec ──[checkpoint]──> Plan ──[checkpoint]──> Tasks
  [Drafting Mode]:  Research ──────────────────────────────────────────────> Tasks (no stops)
```

---

## 8. Where Human Decision Points Cluster

Across all tools surveyed, human decision points cluster at three critical junctures:

- **Post-specification approval**: Every tool except Ralph Loop in `--quick` mode requires human sign-off on what will be built. This is the most universal gate.
- **Pre-implementation architectural review**: Most tools (Spec Kit, cc-sdd, ContextKit, BMAD, Tasker, PAUL) insert a gate after technical planning but before task generation.
- **Post-implementation verification**: GSD's verify phase, PAUL's unify phase, Spec Kitty's review/merge gates, and Pilot Shell's verification sub-agent all enforce quality checks after code is generated.

The tools that automate the most (Ralph Loop `--quick`, mcp-server-sdd, LeanSpec) push human review to the edges -- initial intent and final acceptance -- while making intermediate phases fully autonomous.

The Thoughtworks analysis warns that elaborate workflows may create a "false sense of control" -- extensive templates and review gates don't reliably prevent agent hallucinations or oversights, and tools lack flexible workflows for varying problem sizes. [Understanding SDD: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

---

## 9. Context Management as a Hidden Decision Point

A critical but often overlooked dimension is how tools manage LLM context windows, which indirectly determines where human intervention becomes necessary:

- **GSD** gives each executor a fresh 200k-token context window, preventing quality degradation. Plans are limited to 2-3 tasks sized to fit ~50% of a context window. [GSD GitHub](https://github.com/gsd-build/get-shit-done)
- **Smart Ralph** uses specialized sub-agents with fresh context per phase, passing compressed state via `.ralph-state.json`. [Smart Ralph GitHub](https://github.com/tzachbon/smart-ralph)
- **PAUL** explicitly rejects subagent parallelization due to quality concerns, keeping work in-session. [PAUL GitHub](https://github.com/ChristopherKahler/paul)
- **Pilot Shell** monitors context usage and auto-compacts at ~83.5%, preserving plan and task state to persistent memory before compaction triggers. [Pilot Shell GitHub](https://github.com/maxritter/pilot-shell)
- **LeanSpec** constrains specs to ~2,000 tokens precisely to prevent "context rot." [LeanSpec GitHub](https://github.com/codervisor/lean-spec)

**Confidence: High** -- these mechanisms are explicitly documented in each tool.

---

## Key Unknowns

1. **OpenKit**: No tool specifically named "OpenKit" was found in the spec-driven development ecosystem despite multiple search queries. This may be a confusion with OpenSpec, Spec Kit, or a tool under a different name. **Insufficient sources found for: OpenKit.**

2. **PAUL adoption data**: While PAUL's architecture is well-documented, no usage statistics, community size, or real-world case studies were found beyond the repository itself.

3. **"agentic-code" as a named tool**: Searches for a standalone project named "agentic-code" returned only the GitHub topic page. This may refer to a concept rather than a specific tool. **Insufficient sources found for: agentic-code as a discrete tool.**

4. **Long-term spec maintenance**: The Thoughtworks analysis notes that most tools operate at spec-first level (specs discarded after implementation), with only Tessl pursuing spec-as-source. Whether the other tools' specs actually survive beyond initial implementation in practice remains undocumented.

5. **Comparative quality metrics**: No tool publishes quantitative comparisons of code quality, defect rates, or developer satisfaction relative to other SDD approaches. The GSD repository mentions "used by engineers at Amazon, Google, Shopify and Webflow" but provides no verification. [GSD GitHub](https://github.com/gsd-build/get-shit-done)

6. **Conflicting information on BMAD complexity**: The comparison article describes BMAD as requiring "substantial upfront documentation effort" while the BMAD README claims "Scale-adaptive intelligence" that adjusts planning depth automatically. These may be reconcilable (adaptive depth within a complex framework) but the tension is worth noting. [BMAD GitHub](https://github.com/bmad-code-org/BMAD-METHOD) vs [SDD Framework comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop)

7. **Tasker vs Taskmaster AI disambiguation**: The original query listed "Tasker" which maps to the Dowwie/tasker repository. "Taskmaster AI" (referenced in the Rick Hightower comparison article) appears to be a separate, more widely-known tool focused on task management rather than full SDD pipeline orchestration. The relationship between these is unclear.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 25+
