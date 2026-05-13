# Synthesis: Best-of-Breed AI Coding Agent Harness

## 1. What to Take from Each System

### From GSD: The Execution Core

- **Fresh-context-per-task isolation.** Each executor gets a clean 200K window. This is the single most validated anti-slop pattern; context rot degrades recall past 100K tokens (Spotify), and the "Fresh Eyes" principle outperforms accumulated context by 17.1% (Suzgun & Kalai).
- **Plan files as executable prompts.** PLAN.md is not documentation that becomes a prompt; it IS the prompt. The four-field task pattern (files, action, verify, done) independently emerged in GSD, PAUL, Smart Ralph, and Spec Kit.
- **Goal-backward verification.** GSD's verifier asks "what must be TRUE?" rather than "did you complete the task?" This catches scope drift and partial implementations that task-completion checking misses.
- **Wave-based parallelism within phases.** Dependency-ordered waves allow parallel execution where safe, sequential execution where required, without the overhead of full DAG orchestration.

**Not taking:** The rigid S1-S10 sequential pipeline. 45-60 minute cycles are too slow. The pipeline should allow skipping stages for simple tasks.

### From RAPID: The Parallelism Engine

- **Git worktree isolation with file ownership contracts.** CONTRACT.json declares which files each set owns. This is the missing coordination primitive that makes parallel agent work safe without shared state. No other system has this.
- **DAG-ordered merges with 5-level conflict detection.** Textual, structural, dependency, API, and semantic conflict tiers allow automated resolution of easy conflicts and escalation of hard ones. This is more sophisticated than any merge tooling in competing systems.
- **Crash recovery via disk artifacts.** Every state transition writes to disk. Recovery reads disk state, not memory. This makes the harness resumable after any failure (process crash, context window exhaustion, model API timeout).

**Not taking:** The 26-agent count. Most are thin wrappers. Consolidate to fewer agents with broader capability.

### From Blueprint: The Governance Layer

- **ADR lifecycle state machine.** Proposed, Accepted, Deprecated, Superseded, with transition rules. This is the missing "why" documentation that prevents agents from contradicting previous architectural decisions.
- **Continuous drift detection.** Comparing intended architecture (ADRs + ARCHITECTURE.md) against actual code via reflexion models. Not a one-time audit but trajectory analysis.
- **Fitness functions as CI-runnable tests.** Converting architectural invariants into executable checks that run in CI. This bridges the gap between "we decided X" and "the codebase actually follows X."

**Not taking:** The 42 skills and 21 agents. Blueprint's granularity is appropriate for human architects doing deliberate governance work, but an automated harness needs a smaller surface area. Take the data model and lifecycle, not the interaction surface.

### From Turing: The Structural Integrity Principle

- **Two-agent separation with permission asymmetry.** The researcher writes code; the evaluator can only read. This structural guarantee prevents the failure mode where the agent writing code also writes the tests that validate it, producing tests that verify broken behavior.
- **Immutable evaluation infrastructure.** Eval scripts, metrics collection, and baseline comparisons cannot be modified by the agent under evaluation. This principle generalizes beyond ML: any verification gate should be structurally immutable to the agent being verified.

**Not taking:** The ML-specific experiment loop. The principle (structural separation of producer and verifier) is universal; the implementation (train.py modification loop) is domain-specific.

### From External Frameworks

- **Spec Kit's constitution.md pattern.** A short, version-controlled document of Always/Ask/Never rules that constrains all agents. More effective than long CLAUDE.md files (ETH Zurich: LLM-generated context files decrease success by 3%).
- **Kiro's file-save hooks.** Event-driven quality enforcement on every write, not just at phase boundaries.
- **Desloppify's slop scoring.** Quantitative measurement of code quality degradation (LDR, ICR, DDC metrics) enables data-driven decisions about verification intensity.

---

## 2. The Unified Architecture

### Lifecycle: Three Modes, One State Model

The harness operates in three modes selected by task complexity:

| Mode | Trigger | Pipeline | Agents |
|------|---------|----------|--------|
| **Fast** | Single-file change, clear intent | Execute + Verify | 1 executor, 1 verifier |
| **Standard** | Multi-file feature, bounded scope | Specify + Plan + Execute + Verify | 3-5 agents |
| **Governed** | Cross-cutting, architectural | Advise + Specify + Plan + Execute + Verify + Record | 5-8 agents + governance |

Mode selection is automatic based on: files touched (1 vs. many), dependency count, whether existing ADRs are affected.

### Core Agents (7 total)

1. **Conductor** -- Routes tasks, selects mode, manages lifecycle. Owns the state machine.
2. **Specifier** -- Generates requirements with acceptance criteria in BDD format. Consults ADRs for architectural constraints.
3. **Planner** -- Produces PLAN.md with four-field tasks, wave ordering, and file ownership declarations. Runs duplication scan against codebase.
4. **Executor** -- Fresh-context agent that receives PLAN.md as its prompt. One per wave-task. Cannot modify eval infrastructure.
5. **Verifier** -- Read-only agent (Turing's principle). Runs goal-backward validation, linters, type-checkers, tests. Structurally cannot modify the code it evaluates.
6. **Recorder** -- Extracts decisions, assumptions, and rejected alternatives from executor logs. Writes THEORY.md and updates ADRs.
7. **Guardian** -- Continuous background agent. Runs drift detection, fitness function checks, and slop scoring on every commit.

### State Model

All state persists as files on disk (RAPID's crash-recovery pattern):

```
.harness/
  state.json          # FSM state: {mode, phase, wave, status}
  CONTRACT.json       # File ownership per active task (from RAPID)
  CONSTITUTION.md     # Always/Ask/Never rules (from Spec Kit)
  QUALITY-STACK.md    # Detected linters/formatters/type-checkers
  adrs/               # Architecture Decision Records (from Blueprint)
  plans/              # PLAN.md per task (executable prompts)
  theories/           # THEORY.md per task (extracted rationale)
  metrics/            # Slop scores, gap measurements, verification history
```

State transitions follow: `idle -> specifying -> planning -> executing -> verifying -> recording -> idle`. Failure at any stage writes a recovery checkpoint and can resume.

### Execution Flow (Standard Mode)

```
Conductor receives task
  -> Specifier generates spec + acceptance criteria
  -> Planner produces PLAN.md with waves + CONTRACT.json
  -> For each wave:
       Executors spawn in parallel (fresh context, isolated worktrees)
       Each executor reads only: PLAN.md, CONSTITUTION.md, owned files
       PostToolUse hooks run linters on every Write/Edit (Kiro pattern)
  -> Verifier runs goal-backward validation (read-only, cannot modify code)
  -> If verification fails: replan failed tasks only (bounded retry, max 2)
  -> Recorder extracts decisions to THEORY.md, updates ADRs if architectural
  -> Guardian runs slop score + drift check
  -> DAG-ordered merge of worktree branches (RAPID's 5-level conflict detection)
```

---

## 3. Novel Capabilities from Composition

### Parallel Execution with Architectural Governance

No existing system combines RAPID's parallel worktrees with Blueprint's ADR checking. In this harness, CONTRACT.json (file ownership) is validated against accepted ADRs before execution begins. If a task's planned file modifications would violate an architectural invariant (e.g., "the API layer never imports from the persistence layer"), the Planner is forced to restructure before any executor spawns. Governance happens at planning time, not as a post-hoc audit.

### Adaptive Verification Intensity

Combine Desloppify's slop scoring with the abstraction gap monitor concept. After each executor produces code, compute the information distance between the spec and the output. High-gap tasks (the executor "made up" a lot) get routed to aggressive verification: property-based tests, mutation testing, manual review flag. Low-gap tasks (near-transcription from a detailed spec) get fast verification: lint + type-check + snapshot. This replaces uniform verification with risk-proportional effort.

### Structural Quality Enforcement (Generalized Turing Principle)

Turing's researcher/evaluator separation generalizes to all coding: the agent that writes code must never write or modify the tests that validate that code. In this harness, the Verifier agent is structurally read-only (tool permissions enforced, not prompt-requested). Test generation for new features is a separate task assigned to a different executor in a different context window. This eliminates the circular validation failure mode where agents write tests that pass against broken implementations.

### Self-Improving Harness

The metrics/ directory accumulates data: which task types fail verification most often, which slop types recur, which CONSTITUTION.md rules get violated. The Guardian agent periodically analyzes this data and proposes CONSTITUTION.md amendments or new ADRs. This closes the loop: the harness learns from its own error patterns and tightens constraints where failures concentrate. Not AI self-correction (which research shows fails without external signal), but data-driven rule evolution.

---

## 4. What to Explicitly NOT Include

| Excluded | From | Reason |
|----------|------|--------|
| Rigid S1-S10 pipeline | GSD | The "sledgehammer problem": excessive ceremony for simple tasks. Mode selection replaces fixed pipeline. |
| 26 agents | RAPID | Agent proliferation increases coordination overhead without proportional benefit. 7 agents with clear boundaries. |
| 42 skills | Blueprint | Skills are lazy-loaded context; most are thin wrappers. Keep the data model, cut the interaction surface. |
| LLM-as-Judge for every session | Spotify pattern | 25% veto rate is impressive but doubles token cost. Reserve for Governed mode only. |
| Self-reflection loops | General | Research is unambiguous: without external feedback, self-correction decreases accuracy. All verification uses external signals (tests, linters, type-checkers). |
| Shared state between agents | LangGraph/ADK pattern | Context isolation outperforms shared state for coding tasks. Agents communicate through file artifacts, not in-memory state. |
| Dynamic topology selection | Paper proposal | Premature. The complexity of selecting topology per-task exceeds the benefit until empirical data from the metrics/ directory justifies it. Start with the three-mode system; add dynamic topology later if data warrants. |
| Observation masking | JetBrains research | Despite 2.6% solve rate improvement in research, every shipping CLI agent uses summarization. The engineering cost of switching is not justified by the marginal gain. |

---

## 5. Key Architectural Decisions

### ADR-001: File-Based State Over In-Memory State
**Status:** Accepted
**Context:** Agent processes crash (context exhaustion, API timeouts, model errors). In-memory state is lost on crash. RAPID demonstrated that disk-persisted state enables crash recovery without external databases.
**Decision:** All harness state persists as JSON/Markdown files in `.harness/`. No database dependencies. State transitions are atomic file writes.
**Consequence:** Slightly slower state access. Recovery is free. Git tracks state history.

### ADR-002: Fresh Context Per Executor Over Accumulated Context
**Status:** Accepted
**Context:** Context rot degrades LLM recall past 100K tokens (Spotify). Fresh Eyes outperforms accumulated context by 17.1% (Suzgun & Kalai). GSD's fresh-200K pattern achieves 91% SDD coverage.
**Decision:** Every executor agent receives a fresh context window containing only PLAN.md, CONSTITUTION.md, QUALITY-STACK.md, and owned source files. No conversation history from prior phases.
**Consequence:** Executors cannot reference discussions from the Specify phase. The Planner must encode all relevant context into PLAN.md.

### ADR-003: Structural Permission Enforcement Over Prompt-Based Constraints
**Status:** Accepted
**Context:** Agents routinely ignore prompt-level instructions (ThoughtWorks SDD evaluation). Turing's ML harness uses tool-permission asymmetry to enforce separation. Code-level hooks outperform spec-based guardrails (Pilot Shell evidence).
**Decision:** The Verifier agent is configured with read-only tool permissions (Read, Bash for test execution only). The Executor cannot modify files in `tests/` that existed before its invocation. Enforcement is structural (tool configuration), not instructional (prompt text).
**Consequence:** Requires the harness to track pre-existing test files per executor session. Adds startup overhead (~2s per executor).

### ADR-004: Three Execution Modes Over One Fixed Pipeline
**Status:** Accepted
**Context:** GSD's 45-60 minute cycles are too slow for trivial changes. BMAD's "Quick Flow" and Pilot Shell's mode switching demonstrate that adaptive ceremony reduces friction without sacrificing quality on complex tasks.
**Decision:** Fast/Standard/Governed modes with automatic selection based on scope metrics (file count, dependency count, ADR impact). Users can override.
**Consequence:** Mode selection logic becomes a potential failure point. Wrong mode selection wastes time (too much ceremony) or misses quality issues (too little). The metrics/ feedback loop should calibrate mode boundaries over time.

### ADR-005: CONTRACT.json File Ownership Over Implicit Coordination
**Status:** Accepted
**Context:** Parallel agent execution without coordination produces merge conflicts and semantic contradictions. RAPID's CONTRACT.json declares file ownership per task, preventing concurrent modification. No other system has this primitive.
**Decision:** The Planner generates CONTRACT.json declaring which files each parallel executor may modify. The harness enforces this via PreToolUse hooks that reject writes to unowned files.
**Consequence:** Requires the Planner to decompose tasks along file boundaries, which occasionally produces suboptimal task splits. The tradeoff (safe parallelism at the cost of slightly less natural decomposition) is worth it.
