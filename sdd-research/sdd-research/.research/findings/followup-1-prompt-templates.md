# Prompt Templates, Agent Definitions & Slash Command Implementations in Spec-Driven Coding Tools

## Deep Structural Analysis with Verbatim Excerpts

---

## 1. GSD (Get Shit Done) — Agent Definition Architecture

**Repository:** [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)

GSD provides 12 specialized agent definitions in its `agents/` directory and 32 slash commands in `commands/gsd/`. The architecture follows a "thin orchestrator" pattern where orchestrators use only 10-15% of context and spawn agents with fresh 200k-token contexts. [DeepWiki: GSD](https://deepwiki.com/gsd-build/get-shit-done)

### Agent Files (700-1300 lines each)

The 12 agents are: `gsd-codebase-mapper`, `gsd-debugger`, `gsd-executor`, `gsd-integration-checker`, `gsd-nyquist-auditor`, `gsd-phase-researcher`, `gsd-plan-checker`, `gsd-planner`, `gsd-project-researcher`, `gsd-research-synthesizer`, `gsd-roadmapper`, `gsd-verifier`. [Source: agents/ directory](https://github.com/gsd-build/get-shit-done/tree/main/agents)

### GSD Planner — Key Architectural Patterns

The planner agent (`gsd-planner.md`, ~1319 lines) embodies several critical design patterns. [Source: gsd-planner.md](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-planner.md)

**Core philosophy:** "Plans are executable prompts, not documents." Plans target ~50% context usage to maintain quality throughout execution. Each plan contains 2-3 tasks maximum.

**Discovery Protocol with explicit levels:**
- Level 0: Skip (established patterns only)
- Level 1: Quick verification (syntax/version confirmation)
- Level 2: Standard research (2-3 options, 15-30 min)
- Level 3: Deep dive (architectural decisions, 1+ hour)

**Task Structure (described as "non-negotiable"):** Every task requires four sub-elements: `<files>` (exact paths), `<action>` (specific implementation), `<verify>` (automated command), `<done>` (acceptance criteria). No vague instructions permitted.

**Wave-Based Parallelism:** Tasks with no dependencies form Wave 1 (parallel). The system explicitly prefers vertical slices (feature-complete per plan) over horizontal layers (all models, then all APIs, then all UIs).

**Execution Flow (sequential):** Load project state -> load codebase context -> identify phase -> mandatory discovery -> read project history (digest + selected full SUMMARYs) -> gather phase context -> break into tasks -> build dependency graph -> assign waves -> group into plans -> derive must_haves -> estimate scope -> write PLAN.md files -> validate -> update ROADMAP.md -> git commit.

### GSD Verifier — Goal-Backward Verification

The verifier agent demonstrates a distinctive "trust code, not claims" philosophy. [Source: gsd-verifier.md](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-verifier.md)

**Three-level verification:** Existence (file exists), Substantive Implementation (not a stub), and Proper Wiring/Integration (connected to the system).

**Anti-pattern detection:** The verifier explicitly checks for stubs, orphaned code, and incomplete connections rather than accepting SUMMARY.md assertions at face value.

**Output format:** Creates `VERIFICATION.md` with observable truth verification matrix, artifact status (missing/stub/verified), key link wiring checks, requirements coverage assessment, and structured gaps in YAML frontmatter for downstream consumption.

### GSD Nyquist Auditor — Test Gap Analysis

Named after the Nyquist sampling theorem, this agent fills validation gaps in completed phases. [Source: gsd-nyquist-auditor.md](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-nyquist-auditor.md)

**Key constraint:** Implementation files are read-only; only test files and VALIDATION.md may be modified. Implementation bugs trigger escalation, never fixes. Maximum 3 debug iterations per failing test before escalation to human review.

**Three return formats:** GAPS FILLED (complete success), PARTIAL (some escalations), ESCALATE (full escalation).

### GSD Executor — Deviation Handling

The executor operates with four auto-fix rules for deviations encountered during plan execution:
1. Auto-fix bugs
2. Add critical functionality
3. Fix blockers
4. Escalate architectural decisions (requires human approval)

The system includes "analysis paralysis guards" to prevent endless reading without action, and authentication gate recognition for operations requiring credentials.

### GSD Slash Commands

The 32 commands span the full project lifecycle. [Source: commands/gsd/](https://github.com/gsd-build/get-shit-done/tree/main/commands/gsd)

The `execute-phase` command uses a lean orchestrator (~15% token budget) that discovers plans, analyzes dependencies, then delegates full execution context to fresh subagents. The `--gaps-only` flag restricts execution to plans marked with `gap_closure: true` in their YAML frontmatter. [Source: execute-phase.md](https://github.com/gsd-build/get-shit-done/blob/main/commands/gsd/execute-phase.md)

The `plan-phase` command supports flags including `--research` (force re-research), `--skip-research`, `--gaps` (gap closure mode reading VERIFICATION.md), `--skip-verify`, and `--prd <file>` (substitute PRD/acceptance criteria). [Source: plan-phase.md](https://github.com/gsd-build/get-shit-done/blob/main/commands/gsd/plan-phase.md)

---

## 2. PAUL (Plan-Apply-Unify Loop) — CARL Integration & Command Templates

**Repository:** [ChristopherKahler/paul](https://github.com/ChristopherKahler/paul)

PAUL implements a three-phase iterative loop (Plan -> Apply -> Unify) with 26 slash commands, 21 workflow files, and a distinctive dynamic rule injection system called CARL. [DeepWiki: PAUL](https://deepwiki.com/ChristopherKahler/paul)

### CARL Domain File — Verbatim Rule Definitions

The CARL (Context Augmentation & Reinforcement Layer) system uses a domain file (`src/carl/PAUL`) with environment-variable-style rule definitions. [Source: src/carl/PAUL](https://github.com/ChristopherKahler/paul/blob/main/src/carl/PAUL)

Verbatim excerpt of the rule hierarchy:

```
# Rule 0: Scope
PAUL_RULE_0=PAUL governs structured AI development via Plan-Apply-Unify loop. Requires .paul/ directory.

# MUST (critical)
PAUL_RULE_1=LOAD BEFORE EXECUTE: Before ANY /paul:* command, MUST Read the command file
  (~/.claude/paul-framework/src/commands/{name}.md) AND its execution_context workflow file.
  NEVER execute PAUL commands from memory or inference - always load the actual files first.
  If files cannot be loaded, STOP and inform user.
PAUL_RULE_2=No implementation code without approved PLAN.md. Research/exploration OK.
  Violation = stop, request approval.
PAUL_RULE_3=Every APPLY must be followed by UNIFY. UNIFY reconciles plan vs actual, updates
  STATE.md, logs decisions.
PAUL_RULE_4=Respect PLAN.md "Boundaries" / "DO NOT CHANGE" sections. Stop and confirm before
  modifying protected items.

# SHOULD (quality)
PAUL_RULE_7=Tasks require verification criteria: <verify>[proof of success]</verify>.
  No verify = cannot complete.
PAUL_RULE_9=Use BDD acceptance criteria: Given [precondition] / When [action] / Then [outcome].

# MAY (patterns)
PAUL_RULE_10=Size tasks for single session (~50% context). Split larger tasks during planning.
PAUL_RULE_12=Urgent work uses decimal phases (2.1, 2.2). Integers = planned, decimals = interruptions.
```

**Architectural insight:** The rules use a RFC 2119-style priority system (MUST/SHOULD/MAY) giving the AI agent explicit guidance on which rules are inviolable versus advisory. The CARL manifest registers recall keywords (`plan phase`, `apply phase`, `PLAN.md`, `STATE.md`) so rules auto-activate contextually rather than consuming static prompt space.

### PAUL Command Template Structure

Commands use YAML frontmatter + XML-like semantic sections. Here is the verbatim `/paul:plan` command. [Source: src/commands/plan.md](https://github.com/ChristopherKahler/paul/blob/main/src/commands/plan.md)

```markdown
---
name: paul:plan
description: Enter PLAN phase for current or new plan
argument-hint: "[phase-plan]"
allowed-tools: [Read, Write, Glob, AskUserQuestion]
---

<objective>
Create or continue a PLAN for the specified phase.
**When to use:** Starting new work or resuming incomplete plan.
</objective>

<execution_context>
@~/.claude/paul-framework/workflows/plan-phase.md
@~/.claude/paul-framework/templates/PLAN.md
@~/.claude/paul-framework/references/plan-format.md
</execution_context>

<context>
$ARGUMENTS
@.paul/PROJECT.md
@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>
Follow workflow: @~/.claude/paul-framework/workflows/plan-phase.md
</process>

<success_criteria>
- [ ] PLAN.md created in correct phase directory
- [ ] All acceptance criteria defined
- [ ] STATE.md updated with loop position
</success_criteria>
```

**Pattern demonstrated:** Commands are "thin wrappers" — they answer "what to do" while workflows answer "how to do it." The `<execution_context>` section uses `@`-references to load static resources (workflows, templates), while `<context>` loads dynamic project state. This separation ensures commands fit on one screen while complex logic lives in dedicated workflow files. [Source: src/rules/commands.md](https://github.com/ChristopherKahler/paul/blob/main/src/rules/commands.md)

### PAUL Apply Command — Checkpoint System

The `/paul:apply` command demonstrates structured checkpoint handling. [Source: src/commands/apply.md](https://github.com/ChristopherKahler/paul/blob/main/src/commands/apply.md)

Verbatim checkpoint handling excerpt:

```xml
<step name="handle_checkpoints">
When a checkpoint task is reached:

**checkpoint:decision**
- Present decision context and options
- Wait for user selection
- Record decision
- Continue execution

**checkpoint:human-verify**
- Present what was built
- Present verification steps
- Wait for "approved" or issue description
- If issues: address and re-verify
- Continue execution

**checkpoint:human-action**
- Present required action
- Wait for "done" confirmation
- Continue execution
</step>
```

### PAUL Unify Command — Loop Closure

The `/paul:unify` command closes the Plan-Apply-Unify loop with an explicit visual confirmation. [Source: src/commands/unify.md](https://github.com/ChristopherKahler/paul/blob/main/src/commands/unify.md)

Verbatim output template:

```
Loop Closed
════════════════════════════════════════

Plan: {plan-path}
Summary: {summary-path}

PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓

Next: [phase complete message or next plan]

════════════════════════════════════════
```

### PAUL Task Type Classification

Tasks in PLAN.md files are typed to govern execution behavior:

| Type | Execution | Pause? | Use Case |
|------|-----------|--------|----------|
| `auto` | Fully autonomous | No | Straightforward implementation |
| `checkpoint:human-verify` | Pause for visual/functional inspection | Yes | Output requires human eyes |
| `checkpoint:decision` | Pause for option selection | Yes | Architectural choice |
| `checkpoint:human-action` | Pause for unavoidable manual step | Yes | External credential or physical action |

Every `auto` task requires four sub-elements: `<files>`, `<action>`, `<verify>`, `<done>`. Missing any element means the task is "too vague to execute."

---

## 3. Pilot Shell — Lifecycle Hooks & Rule System

**Repository:** [maxritter/pilot-shell](https://github.com/maxritter/pilot-shell)

Pilot Shell implements the most comprehensive hook-based enforcement system among these tools, with 17 rule files, 13 hook scripts, 2 review agents, and 8 command definitions. [Source: pilot/](https://github.com/maxritter/pilot-shell/tree/main/pilot)

### Hook Architecture — hooks.json

The hook system covers 7 lifecycle events with precise tool matchers. [Source: pilot/hooks/hooks.json](https://github.com/maxritter/pilot-shell/blob/main/pilot/hooks/hooks.json)

Verbatim hook configuration (condensed):

```json
{
  "hooks": {
    "SessionStart": [
      { "matcher": "startup|clear|compact", "hooks": [
        { "type": "command", "command": "bun ... hook claude-code context", "timeout": 15 },
        { "type": "command", "command": "bun ... hook claude-code user-message", "async": true }
      ]},
      { "matcher": "clear", "hooks": [
        { "type": "command", "command": "uv run python .../session_clear.py" }
      ]},
      { "matcher": "compact", "hooks": [
        { "type": "command", "command": "uv run python .../post_compact_restore.py" }
      ]}
    ],
    "PreToolUse": [
      { "matcher": "Bash|WebSearch|WebFetch|Grep|Task", "hooks": [
        { "type": "command", "command": "uv run python .../tool_redirect.py" }
      ]}
    ],
    "PostToolUse": [
      { "matcher": "Write|Edit|MultiEdit", "hooks": [
        { "type": "command", "command": "uv run python .../file_checker.py" }
      ]},
      { "matcher": "Read|Write|Edit|MultiEdit|Bash|Task|Skill|Grep|Glob", "hooks": [
        { "type": "command", "command": "uv run python .../context_monitor.py" }
      ]}
    ],
    "Stop": [
      { "hooks": [
        { "type": "command", "command": "uv run python .../spec_stop_guard.py" },
        { "type": "command", "command": "bun ... hook claude-code summarize", "async": true }
      ]}
    ],
    "PreCompact": [
      { "hooks": [
        { "type": "command", "command": "uv run python .../pre_compact.py" }
      ]}
    ]
  }
}
```

**Key pattern:** The `PostToolUse` hooks fire on every substantive tool call (`Read|Write|Edit|MultiEdit|Bash|Task|Skill|Grep|Glob`) to monitor context usage. The `PreToolUse` hooks on `Bash|WebSearch|WebFetch|Grep|Task` implement tool redirection (e.g., forcing Probe CLI before grep). The `Stop` hook implements a stop guard that prevents premature session termination during active `/spec` workflows.

### TDD Enforcer Hook — Verbatim Implementation

The `tdd_enforcer.py` is a PostToolUse hook that fires on `Write|Edit` operations. [Source: pilot/hooks/tdd_enforcer.py](https://github.com/maxritter/pilot-shell/blob/main/pilot/hooks/tdd_enforcer.py)

Key implementation patterns:

```python
def run_tdd_enforcer() -> int:
    """Run TDD enforcement and return exit code."""
    hook_data = json.load(sys.stdin)
    tool_name = hook_data.get("tool_name", "")
    if tool_name not in ("Write", "Edit"):
        return 0

    file_path = tool_input.get("file_path", "")
    if should_skip(file_path):  # Excludes .md, .json, .yaml, infra dirs, etc.
        return 0
    if is_test_file(file_path):  # Already editing a test
        return 0
    if is_trivial_edit(tool_name, tool_input):  # Import-only or constant-only changes
        return 0

    # Language-specific test file detection
    if file_path.endswith(".py"):
        if has_related_failing_test(project_dir, file_path):
            return 0  # Failing test exists - TDD is being followed
        if has_python_test_file(file_path):
            return 0  # Test file exists
        return warn(f"No test file found for '{module_name}' module",
                    f"Consider creating test_{module_name}.py first.")
```

**Architectural insight:** The enforcer uses `decision:block` output to inject structured JSON reminders into the conversation without halting execution. It checks pytest's `lastfailed` cache to detect whether TDD is being practiced (a failing test exists for the module being edited). The `is_trivial_edit()` function distinguishes import-only changes, constant additions, and code removals from substantive edits.

### Task and Workflow Rules — Verbatim Complexity Triage

The task-and-workflow rules file defines when to use structured workflows versus direct execution. [Source: pilot/rules/task-and-workflow.md](https://github.com/maxritter/pilot-shell/blob/main/pilot/rules/task-and-workflow.md)

Verbatim complexity triage:

```markdown
| Complexity | Action |
|------------|--------|
| **Trivial** (single file, obvious fix) | Execute directly |
| **Moderate** (2-5 files, clear scope) | Use TaskCreate/TaskUpdate to track, then execute |
| **High** (architectural, 10+ files) | **Ask user** if they want `/spec` or quick mode |

**NEVER auto-invoke `/spec` or `Skill('spec')`.** The user MUST explicitly type `/spec`.
```

**Deviation handling during `/spec` implementation:**

```markdown
| Type | Trigger | Action | User Input? |
|------|---------|--------|-------------|
| **Bug / Missing Critical / Blocking** | Code errors, missing validation | Auto-fix inline | No |
| **Architectural** | Structural change (new DB table, switching libraries) | **STOP** — AskUserQuestion | **Yes** |
```

### Pilot Shell /spec Workflow Dispatch

The `/spec` command implements a multi-phase dispatch system with configurable toggles. [Source: pilot/rules/task-and-workflow.md](https://github.com/maxritter/pilot-shell/blob/main/pilot/rules/task-and-workflow.md)

Verbatim workflow:

```
/spec -> Dispatcher -> Detect type (LLM intent) -> Feature: Skill('spec-plan')
                                                 -> Bugfix:  Skill('spec-bugfix-plan')
       -> Skill('spec-implement')   -> TDD loop for each task
       -> Feature: Skill('spec-verify')        -> Tests, code review, 1 review agent
       -> Bugfix:  Skill('spec-bugfix-verify') -> Tests, quality checks, fix confirmation
```

**Zero-interaction mode:** When `$PILOT_WORKTREE_ENABLED=false`, `$PILOT_PLAN_QUESTIONS_ENABLED=false`, and `$PILOT_PLAN_APPROVAL_ENABLED=false`, the entire `/spec` workflow runs completely autonomously from invocation to verified completion.

### Development Practices Rules — Constraint Classification

Pilot Shell introduces a novel "constraint classification" framework in its rules. [Source: pilot/rules/development-practices.md](https://github.com/maxritter/pilot-shell/blob/main/pilot/rules/development-practices.md)

Verbatim excerpt:

```markdown
When exploring a problem or codebase, classify constraints you encounter:

- **Hard** — non-negotiable (physical limits, external contracts, security requirements, deadlines)
- **Soft** — preferences or conventions — negotiable if trade-off is stated explicitly
- **Ghost** — past constraints baked into the current approach that **no longer apply**

Ghost constraints are the most valuable to find: they lock out options nobody thinks are
available. Ask "why can't we do X?" — if nobody can point to a current requirement, it
may be a ghost.
```

**Pattern demonstrated:** This is meta-cognitive prompting — teaching the AI to question assumptions systematically during debugging and exploration.

### Context Management Rules

Pilot Shell's context management enforces quality preservation under token pressure. [Source: pilot/rules/context-management.md](https://github.com/maxritter/pilot-shell/blob/main/pilot/rules/context-management.md)

Core principle: "Context level is NEVER a valid reason to skip a workflow step." The system uses a three-stage mechanism: PreCompact hook captures state to memory, compaction summarizes conversation, and SessionStart hook re-injects context.

### Debugging Methodology

From `development-practices.md`:

```markdown
**3+ failed fixes = architectural problem.** Question the pattern, don't fix again.

**Revert-First:** When something breaks during implementation:
1. **Revert** — undo the change that broke it. Clean state.
2. **Delete** — can the broken thing be removed entirely?
3. **One-liner** — minimal targeted fix only.
4. **None of the above** -> stop, reconsider the approach.
```

---

## 4. GitHub Spec Kit — Multi-Agent Templates & Extension Hooks

**Repository:** [github/spec-kit](https://github.com/github/spec-kit)

Spec Kit provides 9 command templates, 6 document templates, and supports 20 different AI agents. It is the most broadly compatible SDD tool, generating agent-specific command files across Claude Code, Gemini, Copilot, Cursor, Windsurf, Kiro, and many others. [Source: AGENTS.md](https://github.com/github/spec-kit/blob/main/AGENTS.md)

### Spec Template — BDD-First Feature Specifications

The spec template enforces prioritized, independently testable user stories with BDD acceptance criteria. [Source: templates/spec-template.md](https://github.com/github/spec-kit/blob/main/templates/spec-template.md)

Verbatim excerpt of the user story structure:

```markdown
### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g.,
  "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]
```

**Architectural insight:** Each user story is required to be "independently testable" — meaning implementing just ONE story should yield a viable MVP. This constrains spec authors to write genuinely decomposable features rather than tightly-coupled story clusters.

### Plan Template — Constitution Gate Pattern

The plan template introduces a "Constitution Check" as a hard gate before implementation begins. [Source: templates/plan-template.md](https://github.com/github/spec-kit/blob/main/templates/plan-template.md)

Verbatim structure:

```markdown
## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
```

**Pattern demonstrated:** The "Constitution" pattern creates an inviolable set of project-level constraints (e.g., "max 3 sub-projects") that must be explicitly justified if violated. This provides architectural guardrails without rigidity.

### Constitution Template

The constitution template is deliberately minimal — placeholder-based so each project defines its own principles. [Source: templates/constitution-template.md](https://github.com/github/spec-kit/blob/main/templates/constitution-template.md)

```markdown
# [PROJECT_NAME] Constitution

## Core Principles

### [PRINCIPLE_1_NAME]
[PRINCIPLE_1_DESCRIPTION]
...

## Governance

[GOVERNANCE_RULES]

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE]
```

### Plan Command — Handoff Definitions & Agent Scripts

The `/speckit.plan` command demonstrates Spec Kit's handoff and agent-script patterns. [Source: templates/commands/plan.md](https://github.com/github/spec-kit/blob/main/templates/commands/plan.md)

Verbatim YAML frontmatter:

```yaml
---
description: Execute the implementation planning workflow using the plan template
handoffs:
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: speckit.checklist
    prompt: Create a checklist for the following domain...
scripts:
  sh: scripts/bash/setup-plan.sh --json
  ps: scripts/powershell/setup-plan.ps1 -Json
agent_scripts:
  sh: scripts/bash/update-agent-context.sh __AGENT__
  ps: scripts/powershell/update-agent-context.ps1 -AgentType __AGENT__
---
```

**Pattern demonstrated:** The `handoffs` field defines typed transitions between agent commands. Each handoff specifies a label, target agent, prompt, and whether to auto-send. The `agent_scripts` field uses an `__AGENT__` placeholder that gets replaced with the actual agent name at runtime, enabling the same template to work across all 20 supported agents.

### Implement Command — Extension Hooks & Checklist Gates

The `/speckit.implement` command is the most elaborate command template, covering pre-execution hooks, checklist validation, ignore file generation, and task execution. [Source: templates/commands/implement.md](https://github.com/github/spec-kit/blob/main/templates/commands/implement.md)

Verbatim extension hook handling:

```markdown
**Check for extension hooks (before implementation)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_implement` key
- Filter to only hooks where `enabled: true`
- For each executable hook, output based on its `optional` flag:
  - **Optional hook** (`optional: true`):
    ```
    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Prompt: {prompt}
    ```
  - **Mandatory hook** (`optional: false`):
    ```
    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}
    Wait for the result of the hook command before proceeding.
    ```
```

Verbatim checklist gate:

```markdown
**If any checklist is incomplete**:
- Display the table with incomplete item counts
- **STOP** and ask: "Some checklists are incomplete. Do you want to proceed
  with implementation anyway? (yes/no)"
- Wait for user response before continuing
```

**Technology-aware ignore file generation:** The implement command includes comprehensive pattern lists for 15+ languages/platforms (Node.js, Python, Java, Go, Rust, Kotlin, C++, Swift, R, etc.) and generates appropriate `.gitignore`, `.dockerignore`, `.eslintignore`, etc. based on detected project technologies.

### Specify Command — Agent Behavior Summary

The `/speckit.specify` command demonstrates the "no implementation details" constraint. [Source: templates/commands/specify.md](https://github.com/github/spec-kit/blob/main/templates/commands/specify.md)

Key behavioral constraints:
- No implementation details: Exclude frameworks, APIs, languages, code structure
- Focus on WHAT and WHY: Business stakeholder language, user value emphasis
- Testable requirements: Every specification element must be verifiable
- Maximum 3 `[NEEDS CLARIFICATION]` markers allowed, presented as formatted tables with options
- Quality validation with max 3 iterative cycles

### Agent File Template — Auto-Generated Context

The `agent-file-template.md` creates per-project development guidelines auto-generated from all feature plans. [Source: templates/agent-file-template.md](https://github.com/github/spec-kit/blob/main/templates/agent-file-template.md)

```markdown
# [PROJECT NAME] Development Guidelines
Auto-generated from all feature plans. Last updated: [DATE]

## Active Technologies
[EXTRACTED FROM ALL PLAN.MD FILES]

## Project Structure
[ACTUAL STRUCTURE FROM PLANS]

## Recent Changes
[LAST 3 FEATURES AND WHAT THEY ADDED]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
```

**Pattern demonstrated:** The manual additions markers allow human overrides to survive auto-regeneration, solving the "generated file vs. custom rules" conflict.

### Multi-Agent Support Architecture

Spec Kit supports 20 AI agents through a unified template system with agent-specific adaptations. [Source: AGENTS.md](https://github.com/github/spec-kit/blob/main/AGENTS.md)

| Agent | Directory | Format | Argument Placeholder |
|-------|-----------|--------|---------------------|
| Claude Code | `.claude/commands/` | Markdown | `$ARGUMENTS` |
| Gemini CLI | `.gemini/commands/` | TOML | `{{args}}` |
| GitHub Copilot | `.github/agents/` | Markdown | `$ARGUMENTS` |
| Cursor | `.cursor/commands/` | Markdown | `$ARGUMENTS` |
| Windsurf | `.windsurf/workflows/` | Markdown | `$ARGUMENTS` |
| Kiro CLI | `.kiro/prompts/` | Markdown | `$ARGUMENTS` |

---

## Cross-Tool Pattern Analysis

### Pattern 1: Thin Orchestrator / Fat Agent
All four tools use some form of this pattern. GSD is most explicit (10-15% context for orchestrators, fresh 200k for agents). PAUL delegates from thin commands to workflow files. Pilot Shell dispatches through `/spec` to skill-specific phases. Spec Kit uses handoff definitions.

### Pattern 2: Task Atomicity with Mandatory Sub-Elements
Both GSD and PAUL require four sub-elements per task: `<files>`, `<action>`, `<verify>`, `<done>`. This pattern prevents vague task definitions and ensures every task is independently verifiable.

### Pattern 3: BDD Acceptance Criteria as First-Class Citizens
All four tools use Given/When/Then BDD format. PAUL calls this "Acceptance-Driven Development (A.D.D.)." Spec Kit's spec template requires each user story to be independently testable. GSD's verifier checks acceptance criteria against actual code artifacts.

### Pattern 4: Constitution/Boundary Guards
Spec Kit has explicit "Constitution" files with gate checks. PAUL uses `<boundaries>` / "DO NOT CHANGE" sections in PLAN.md. Pilot Shell's stop guard prevents premature session termination. GSD's verifier checks for scope creep.

### Pattern 5: Loop Closure Enforcement
PAUL is most explicit with its mandatory UNIFY phase (every APPLY must close with UNIFY). GSD uses SUMMARY.md artifacts paired with VERIFICATION.md. Pilot Shell's `/spec` workflow enforces PENDING -> COMPLETE -> VERIFIED status progression.

### Pattern 6: Context-Aware Rule Injection
PAUL's CARL system injects rules dynamically via recall keywords rather than static prompts. Pilot Shell's hooks fire based on tool matchers. Both solve the "static rules eat context" problem differently.

### Pattern 7: Escalation Classification
All tools distinguish between auto-fixable issues and those requiring human judgment:
- GSD: Bug/critical/blocker (auto) vs. architectural (escalate)
- PAUL: `auto` tasks vs. `checkpoint:decision` / `checkpoint:human-verify`
- Pilot Shell: Bug/missing/blocking (auto-fix inline) vs. architectural (STOP + AskUserQuestion)
- Spec Kit: Optional hooks (present to user) vs. mandatory hooks (auto-execute)

---

## Key Unknowns

1. **GSD Agent XML Structure:** The actual XML tags (`<role>`, `<philosophy>`, `<tool_strategy>`, `<output_formats>`) mentioned in prior research were not directly observable in the agent files accessed. The agents are 700-1300 lines each — the full internal structure of the executor and planner agents was not fully extractable due to WebFetch summarization limitations. **Confidence: Medium** — the tags likely exist within the files but the tool truncated/summarized them.

2. **Pilot Shell Model Routing:** Prior research indicated Opus for planning and Sonnet for implementation, but the actual model routing configuration was not found in the rule or hook files examined. This may be configured in `pilot/claude.json` or `pilot/settings.json` which were not fetched. **Confidence: Low.**

3. **PAUL Workflow File Contents:** The 21 workflow files (e.g., `apply-phase.md`, `plan-phase.md`, `unify-phase.md`) contain the detailed "how to do it" logic that commands delegate to. Only summaries were obtainable. These likely contain the most detailed prompt engineering content in the PAUL system. **Confidence: Medium.**

4. **Spec Kit Spec-Reviewer Agent:** The `spec-reviewer.md` agent operates under a strict budget of 12 or fewer tool calls and uses `git diff` as primary information source. The full prompt content defining its adversarial review stance was only partially extracted. **Confidence: Medium.**

5. **GSD Runtime Adaptations:** GSD's installer transforms agent files for different runtimes (Codex gets `.toml` configurations with `sandbox_mode`, Gemini gets tool name mapping). The actual transformation templates were not examined. **Confidence: Low.**

6. **Pilot Shell's `tool_redirect.py`:** This PreToolUse hook fires on `Bash|WebSearch|WebFetch|Grep|Task` and implements tool redirection (likely forcing Probe CLI before grep/glob). The actual redirection logic was not fetched. **Confidence: Low.**

---

## Sources

- [GSD Repository](https://github.com/gsd-build/get-shit-done)
- [GSD Agents Directory](https://github.com/gsd-build/get-shit-done/tree/main/agents)
- [GSD Commands Directory](https://github.com/gsd-build/get-shit-done/tree/main/commands/gsd)
- [GSD gsd-planner.md](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-planner.md)
- [GSD gsd-verifier.md](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-verifier.md)
- [GSD gsd-nyquist-auditor.md](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-nyquist-auditor.md)
- [GSD gsd-executor.md](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-executor.md)
- [GSD execute-phase.md](https://github.com/gsd-build/get-shit-done/blob/main/commands/gsd/execute-phase.md)
- [GSD plan-phase.md](https://github.com/gsd-build/get-shit-done/blob/main/commands/gsd/plan-phase.md)
- [GSD DeepWiki Analysis](https://deepwiki.com/gsd-build/get-shit-done)
- [PAUL Repository](https://github.com/ChristopherKahler/paul)
- [PAUL CARL Domain File](https://github.com/ChristopherKahler/paul/blob/main/src/carl/PAUL)
- [PAUL CARL Manifest](https://github.com/ChristopherKahler/paul/blob/main/src/carl/PAUL.manifest)
- [PAUL plan.md Command](https://github.com/ChristopherKahler/paul/blob/main/src/commands/plan.md)
- [PAUL apply.md Command](https://github.com/ChristopherKahler/paul/blob/main/src/commands/apply.md)
- [PAUL unify.md Command](https://github.com/ChristopherKahler/paul/blob/main/src/commands/unify.md)
- [PAUL Command Rules](https://github.com/ChristopherKahler/paul/blob/main/src/rules/commands.md)
- [PAUL DeepWiki Analysis](https://deepwiki.com/ChristopherKahler/paul)
- [Pilot Shell Repository](https://github.com/maxritter/pilot-shell)
- [Pilot Shell hooks.json](https://github.com/maxritter/pilot-shell/blob/main/pilot/hooks/hooks.json)
- [Pilot Shell tdd_enforcer.py](https://github.com/maxritter/pilot-shell/blob/main/pilot/hooks/tdd_enforcer.py)
- [Pilot Shell task-and-workflow.md](https://github.com/maxritter/pilot-shell/blob/main/pilot/rules/task-and-workflow.md)
- [Pilot Shell development-practices.md](https://github.com/maxritter/pilot-shell/blob/main/pilot/rules/development-practices.md)
- [Pilot Shell context-management.md](https://github.com/maxritter/pilot-shell/blob/main/pilot/rules/context-management.md)
- [Pilot Shell verification.md](https://github.com/maxritter/pilot-shell/blob/main/pilot/rules/verification.md)
- [Spec Kit Repository](https://github.com/github/spec-kit)
- [Spec Kit AGENTS.md](https://github.com/github/spec-kit/blob/main/AGENTS.md)
- [Spec Kit spec-template.md](https://github.com/github/spec-kit/blob/main/templates/spec-template.md)
- [Spec Kit plan-template.md](https://github.com/github/spec-kit/blob/main/templates/plan-template.md)
- [Spec Kit constitution-template.md](https://github.com/github/spec-kit/blob/main/templates/constitution-template.md)
- [Spec Kit agent-file-template.md](https://github.com/github/spec-kit/blob/main/templates/agent-file-template.md)
- [Spec Kit specify.md Command](https://github.com/github/spec-kit/blob/main/templates/commands/specify.md)
- [Spec Kit implement.md Command](https://github.com/github/spec-kit/blob/main/templates/commands/implement.md)
- [Spec Kit plan.md Command](https://github.com/github/spec-kit/blob/main/templates/commands/plan.md)
