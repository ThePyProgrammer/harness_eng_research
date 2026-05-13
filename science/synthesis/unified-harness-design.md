# The Complete Harness: A Unified Design from GSD + RAPID + Blueprint + Turing

*Synthesized from 7 deep research axes, 4 Pragnition Labs systems, 6 external frameworks, and the formal framework in main.tex.*

---

## The Problem Statement

The harness, not the model, is the bottleneck. Terminal Bench 2.0 proved it: same model (Opus), #33 in one harness, #5 in another. AI generates 41% of production code with 1.7x more issues, 2.74x more security vulnerabilities, and 8x more I/O problems. Refactoring collapsed from 25% to <10% of changed lines. The question is not "which model?" but "which harness?"

No single existing system solves this completely:

| System | Strength | Weakness |
|--------|----------|----------|
| **GSD** | Execution discipline, 91% SDD coverage | 45-60 min cycles, sequential, no governance |
| **RAPID** | Safe parallelism, crash recovery, contracts | No quality gates beyond review, no governance |
| **Blueprint** | Architectural governance, continuous drift detection | Not a development harness; governance overlay only |
| **Turing** | Structural integrity, anti-cheating guarantees | ML-specific, not general-purpose coding |

The unified harness combines all four.

---

## Architecture Overview

### Seven Core Agents

| Agent | Role | Tools | Source |
|-------|------|-------|--------|
| **Conductor** | Routes tasks, selects mode, manages FSM | Read, State writes | Novel |
| **Specifier** | Generates requirements + acceptance criteria in BDD format; consults ADRs | Read, Write, WebSearch | GSD researcher + Blueprint ADR check |
| **Planner** | Produces PLAN.md with wave-ordered tasks, CONTRACT.json, duplication scan | Read, Write, Grep, Glob | GSD planner + RAPID contracts |
| **Executor** | Fresh-context agent; receives PLAN.md as prompt; one per task | Read, Write, Edit, Bash | GSD executor + RAPID worktree isolation |
| **Verifier** | **Read-only** (structural, not prompt-based); goal-backward validation | Read, Bash (test execution only) | Turing's permission asymmetry |
| **Recorder** | Extracts decisions/assumptions/rejected-alternatives from logs | Read, Write | Blueprint ADR lifecycle + Naur |
| **Guardian** | Background; drift detection, slop scoring, fitness functions | Read, Bash, Grep | Blueprint continuous governance |

Key structural constraints:
- **Verifier is read-only by tool configuration**, not by prompt instruction (Turing's principle: "every prompt-based rule gets worked around; every code-based rule holds")
- **Executor cannot modify pre-existing test files** (prevents circular validation where agents write tests that pass against broken code)
- **Guardian runs asynchronously**, never blocking the development cycle

### Three Execution Modes

| Mode | When | Pipeline | Cycle Time Target |
|------|------|----------|-------------------|
| **Fast** | Single-file, clear intent, no ADR impact | Execute + Verify | 3-5 min |
| **Standard** | Multi-file feature, bounded scope | Specify + Plan + Execute + Verify | 8-15 min |
| **Governed** | Cross-cutting, architectural, new patterns | Advise + Specify + Plan + Execute + Verify + Record | 20-30 min |

Mode selection is automatic (file count, dependency count, ADR impact) with user override. The 45-60 minute cycle problem is solved by not applying Governed mode to everything.

### State Model (File-Based, Crash-Recoverable)

```
.harness/
  state.json            # FSM: {mode, phase, wave, status}
  CONTRACT.json         # File ownership per active task (RAPID)
  CONSTITUTION.md       # Always/Ask/Never rules (Spec Kit pattern)
  QUALITY-STACK.md      # Detected linters/formatters/type-checkers
  adrs/                 # Architecture Decision Records (Blueprint)
  plans/                # PLAN.md per task (executable prompts)
  theories/             # THEORY.md per task (extracted rationale)
  metrics/              # Slop scores, gap measurements, error history
  worktrees/            # Registry of active git worktrees (RAPID)
```

All state persists as files. Recovery reads disk, not memory. Git tracks state history. No database dependencies.

---

## Six Dimensions of the Harness

### 1. Context Architecture

**The problem:** Context blindness causes duplicate logic (slop type #4), the single most common AI code quality issue. Agents don't know what already exists.

**Research finding:** ETH Zurich showed LLM-generated context files *hurt* performance (-3% success, +20% cost). Chroma's 18-model study found universal degradation with unmanaged context. The answer is budgeting, not accumulation.

**This harness's approach:**

| Tier | Contents | Access |
|------|----------|--------|
| **Active** (in context window) | PLAN.md, CONSTITUTION.md, QUALITY-STACK.md, owned source files | Direct injection |
| **Searchable** (on demand) | Full codebase via Grep/Glob, ADRs, THEORY.md from prior phases | Agent-initiated search |
| **Hidden** (structurally invisible) | Other executors' worktrees, verification infrastructure, metrics history | Cannot access |

From GSD: fresh 200K context per executor (no context rot).
From RAPID: worktree isolation (each executor sees only its own branch).
From Turing: hidden tier (verification scripts invisible to executor).
From Blueprint: ADRs as searchable reference (not injected, but available).

The Planner runs a **duplication scan** before execution (from the GSD de-sloppification proposal): search the codebase for existing implementations matching planned function/component names, write a REUSE-MAP.md that the executor receives in its active context.

### 2. Verification Architecture

**The problem:** 85% per-step accuracy yields ~20% success over 10 steps. But checking every step is expensive (context pollution, latency). 

**Research finding:** 62% of errors are caught in one verification iteration; 96.5% by iteration 3. Phase-boundary checking outperforms per-step checking in cost-effectiveness. Structural enforcement outperforms prompt-based (87.26% vs 77% enforcement rate, AgentSpec ICSE 2026).

**This harness's approach (four layers):**

1. **Structural gates** (every write): PostToolUse hooks run linter + type-checker on every Write/Edit. Success is silent; only errors surface. Cost: ~2s per write. (From Kiro + GSD de-sloppification)

2. **Deterministic analysis** (per task completion): Dead code detection, import resolution, diff size check, lint suppression count. Stop hook blocks completion until passed. (From GSD stop hooks)

3. **Goal-backward verification** (per wave): Read-only Verifier agent asks "what must be TRUE for this to be correct?" rather than "did you complete the checklist?" Bounded retry (max 2 replans). (From GSD verifier + Turing read-only principle)

4. **Continuous governance** (background): Guardian runs drift detection against ADRs, slop scoring, fitness function checks. Does not block; flags issues for human review. (From Blueprint)

**Adaptive intensity:** High-information-gap tasks (executor "made up" a lot relative to the spec) get routed to aggressive verification. Low-gap tasks (near-transcription) get fast verification. Gap estimated via token-ratio proxy between spec and output.

### 3. Parallelism Architecture

**The problem:** Kim et al. found independent agents amplify errors 17.2x. But sequential execution (GSD) is slow. Capability saturation occurs at ~45% single-agent performance.

**Research finding:** RAPID's worktree isolation converts the problem from "N agents on shared state" (error amplification) to "N agents on disjoint state with a merge phase" (error concentrated at merge, where 5-level detection absorbs it). Cursor's failed experiment with 20 agents on shared state (effective throughput: 2-3) validates isolation-over-coordination.

**This harness's approach:**

- **Within a wave:** Parallel executors in isolated worktrees (RAPID). Each owns disjoint files via CONTRACT.json. No shared state during execution.
- **Between waves:** Sequential (GSD). Wave N+1 starts only after wave N merges.
- **Merge:** DAG-ordered with 5-level conflict detection (textual, structural, dependency, API, semantic). High-confidence conflicts auto-resolved; low-confidence escalated.
- **Governance preflight:** Before parallel execution begins, CONTRACT.json is validated against accepted ADRs (Blueprint). Architectural violations caught at planning time, not post-merge.

### 4. Speed Architecture

**The problem:** GSD takes 45-60 minutes per cycle. Adding governance and formal specs makes it worse.

**Research finding:** Three biggest speed opportunities: agentic plan caching (27% latency reduction, 50% cost reduction), prompt caching on stable content (45-80% cost reduction), speculative pipelining (55% next-action prediction accuracy).

**This harness's approach:**

- **Three modes** eliminate unnecessary ceremony. Fast mode (3-5 min) for trivial changes. Standard mode (8-15 min) for features. Governed mode (20-30 min) only for architectural changes.
- **Persistent codebase state** (.harness/QUALITY-STACK.md, REUSE-MAP, ARCHITECTURE.md): computed once, updated incrementally. No re-reading the full codebase per task.
- **Parallel execution** within waves (from RAPID): N tasks in parallel is N times faster than sequential.
- **Asynchronous governance** (from Blueprint): Guardian runs in background, never blocking execution.
- **Speculative pipelining** (future): Start planning wave N+1 while executing wave N (requires CONTRACT.json for N+1 to not conflict with N).

### 5. Quality Architecture (Anti-Slop)

**The problem:** 18 distinct slop types. 7 mechanically detectable, 7 require LLM judgment, 4 have no reliable detection tool.

**Research finding:** Turing/NIST evidence is unambiguous: agents cheat when given the opportunity. O3 downloaded solutions from GitHub. O4-mini commented out assertions. Structural enforcement is the only reliable defense for formal properties.

**This harness's approach (layered by cost and determinism):**

| Layer | Enforcement | Catches | Cost |
|-------|-------------|---------|------|
| **1. Structural gates** (hooks) | Type-checker, linter, import resolver, diff size limit | Hallucinated imports, type errors, lint violations | ~2s/write |
| **2. Deterministic analysis** (per task) | Dead code detector, duplication scanner, dependency checker | Dead code, duplicates, unused deps | ~10s/task |
| **3. LLM-as-Judge** (Governed mode only) | Separate agent reviews for architectural coherence, scope creep, over-engineering | Silent scope expansion, premature abstraction, architectural drift | ~30s/task |
| **4. Human review** (flagged items only) | Developer sees only what survived three automated layers | Everything automated layers miss | Variable |

**The generalized Turing principle:** The agent that writes code never writes the tests that validate it. Test generation is a separate task assigned to a different executor in a different context window. This eliminates circular validation.

### 6. Governance Architecture (Theory Preservation)

**The problem:** When AI generates 41% of code, architectural decisions are made faster than humans can evaluate them. Each individual change is "defensible" but the aggregate is drift.

**Research finding:** 23% of architectural decision evidence goes stale within 2 months (Blueprint data). Point-in-time audits miss trajectories. Ratchet enforcement (once an ADR is accepted, violations block CI) is the most effective mechanism.

**This harness's approach:**

- **Per-generation** (synchronous): Structural gates check every write against CONSTITUTION.md rules and accepted ADRs. (From Blueprint compliance auditing)
- **Per-phase** (asynchronous): Recorder agent extracts decisions, assumptions, and rejected alternatives from executor logs into THEORY.md. Guardian runs drift detection. (From Blueprint + Naur)
- **Per-milestone** (deliberative): Full architectural review with devil's advocate challenge before accepting new ADRs. Evidence expiry monitoring triggers re-evaluation. (From Blueprint lifecycle)

**What gets preserved:**
- THEORY.md: Decisions made, assumptions, rejected alternatives, invariants discovered
- ADRs: Formal architectural decisions with rationale, status, evidence, trigger conditions for revisitation
- CONSTITUTION.md amendments: Data-driven rule evolution from metrics/error history (the self-improving harness)

---

## What This Harness Does That No Individual System Does

1. **Parallel execution with pre-flight governance.** CONTRACT.json validated against ADRs before executors spawn. Architectural violations caught at planning time.

2. **Structural producer-verifier separation.** The Verifier is read-only by tool configuration. Test authorship and code authorship are separate executor tasks. No circular validation.

3. **Adaptive verification intensity.** Spec-to-code information gap estimates route high-risk tasks to aggressive verification, low-risk tasks to fast verification.

4. **Self-improving constraints.** Metrics accumulate; Guardian proposes CONSTITUTION.md amendments and new ADRs where failures concentrate. The harness learns from its own error patterns.

5. **Three-mode execution.** Simple changes get Fast mode (3-5 min). Features get Standard (8-15 min). Architectural changes get Governed (20-30 min). No more 45-60 min cycles for every task.

6. **Theory preservation as a first-class artifact.** Not just "save logs" but structured extraction of decisions/assumptions/alternatives with evidence tracking and expiry.

---

## Implementation Priority

| Phase | What | Why First |
|-------|------|-----------|
| **1** | Conductor + Executor + Verifier (read-only) + CONSTITUTION.md + structural hooks | Core loop with the generalized Turing principle. Validates the architecture. |
| **2** | Planner + CONTRACT.json + worktree isolation + merge | Unlocks parallelism. Biggest speed gain. |
| **3** | Guardian + ADR lifecycle + drift detection | Architectural governance. Prevents drift at scale. |
| **4** | Recorder + THEORY.md + adaptive verification | Theory preservation and risk-proportional effort. |
| **5** | Self-improving loop (metrics-driven CONSTITUTION.md amendments) | Requires enough metrics history to be meaningful. |

---

## Sources

Research documents:
- `outputs/deep-research-1-context.md` (context engineering)
- `outputs/deep-research-2-verification.md` (compound errors)
- `outputs/deep-research-3-parallelism.md` (coordination)
- `outputs/deep-research-4-speed.md` (iteration cycles)
- `outputs/deep-research-5-quality.md` (anti-slop)
- `outputs/deep-research-6-governance.md` (architectural governance)
- `outputs/deep-research-7-synthesis.md` (best-of-breed design)

Pragnition Labs systems:
- GSD (~/pragnition/get-shit-done)
- RAPID v6.0.0 (~/pragnition/RAPID)
- Blueprint v2.0.8 (~/pragnition/blueprint)
- Turing v4.4.0 (~/pragnition/turing)
