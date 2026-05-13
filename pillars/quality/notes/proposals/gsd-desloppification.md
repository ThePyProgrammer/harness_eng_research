# GSD De-Sloppification Improvements

*Proposed additions to the GSD framework to systematically prevent, detect, and remove code slop across the S1-S10 pipeline.*

## Premise

GSD already scores 91% on the SDD ontology coverage matrix — the highest of any framework. Its fresh-200K-per-task context isolation and plan-checker validation are strong implicit anti-slop mechanisms. But GSD has **zero explicit slop-aware tooling**. None of its 12+ agents, 20+ commands, or verification gates reference slop types, slop scoring, or slop-specific detection. The improvements below fill that gap without breaking GSD's execution-first philosophy.

---

## Improvement Map by Stage

### S1: Init — `/gsd:new-project` enhancements

#### 1.1 Auto-detect project linting stack during `map-codebase`

**Problem**: GSD's codebase mapper analyzes architecture but ignores the project's linting/formatting/type-checking configuration. Executor agents then generate code without knowing what quality tools exist.

**Proposal**: During `/gsd:map-codebase`, detect and record:
- Linter configs (`.eslintrc`, `ruff.toml`, `biome.json`, `.flake8`)
- Formatter configs (`.prettierrc`, `pyproject.toml [tool.ruff.format]`)
- Type checker configs (`tsconfig.json`, `mypy.ini`, `pyrightconfig.json`)
- Test runner configs (`jest.config`, `pytest.ini`, `vitest.config`)

Write findings to `.planning/QUALITY-STACK.md`. This file gets injected into every executor agent's context, so they know what tools to run for self-verification.

**Artifact**: `.planning/QUALITY-STACK.md`
```markdown
# Quality Stack
## Linting
- eslint (config: .eslintrc.cjs, plugins: @typescript-eslint, unused-imports)
## Formatting
- prettier (config: .prettierrc)
## Type Checking
- tsc (config: tsconfig.json, strict: true)
## Testing
- vitest (config: vitest.config.ts, coverage: v8)
## Detected Anti-Slop Tools
- knip (config: knip.json) — dead code detection
```

#### 1.2 Generate project-specific anti-slop rules in `CLAUDE.md`

**Problem**: GSD installs global skills and agents but doesn't customize the project's CLAUDE.md with anti-slop directives tailored to the detected stack.

**Proposal**: After `map-codebase`, append a `## Quality Constraints` section to CLAUDE.md with rules derived from QUALITY-STACK.md:
```markdown
## Quality Constraints
- Run `npx tsc --noEmit` before marking any task complete
- Run `npx eslint --fix` on all modified files
- Do not add `// eslint-disable` or `@ts-ignore` without documenting why
- Do not add new dependencies without checking existing ones first
- Prefer the smallest viable diff; do not refactor unrelated code
- Do not add abstractions, helpers, or utilities for one-time operations
```

These are generated from templates, not LLM-authored (per ETH Zurich findings that LLM-generated context files hurt performance).

---

### S2: Governing Principles — New artifact: `ANTI-SLOP.md`

#### 2.1 Anti-slop constitution per project

**Problem**: GSD has PROJECT.md (vision) and REQUIREMENTS.md (what to build) but no document encoding *how code should be written* — quality principles that constrain all agents.

**Proposal**: New artifact `.planning/ANTI-SLOP.md` generated during `new-project`, loaded into every executor context. Contains:

```markdown
# Anti-Slop Constitution

## Always
- Run project linters before committing
- Follow existing naming conventions (scan 3 existing files for patterns)
- Reuse existing utilities — search before creating new helpers
- Write tests that would fail if the feature broke

## Ask First
- Before adding a new dependency
- Before creating a new abstraction layer or base class
- Before modifying files outside the task scope

## Never
- Add `// eslint-disable`, `# noqa`, `@SuppressWarnings` without justification
- Generate placeholder/stub implementations (`pass`, `...`, `NotImplementedError`)
- Add comments that restate what the code does
- Import packages without verifying they exist in package.json/requirements.txt
```

**Integration**: Loaded by executor agents via `read_first` section of every PLAN.md.

---

### S6: Architecture — New agent: `gsd-duplication-scanner`

#### 6.1 Pre-execution duplicate detection

**Problem**: Duplicate logic proliferation (slop type #3) is the most common AI slop caused by context blindness. GSD's 4 parallel researchers investigate stack/features/architecture/pitfalls but none check for existing utilities, helpers, or patterns the executor should reuse.

**Proposal**: New agent `gsd-duplication-scanner` runs after plan-phase, before execute-phase. For each PLAN.md, it:
1. Extracts the planned function/component names
2. Searches the codebase for existing implementations with similar signatures or names
3. Produces `{N}-REUSE-MAP.md` listing existing code the executor should use instead of reinventing

**Artifact**: `.planning/{N}-REUSE-MAP.md`
```markdown
# Reuse Map for Phase 8

## Existing Utilities to Use
- `src/utils/formatDate.ts` — date formatting (don't create new)
- `src/hooks/useAuth.ts` — authentication state (don't wrap)
- `src/api/client.ts` — HTTP client with interceptors (don't create fetch wrapper)

## Existing Patterns to Follow
- Components use `src/components/Button.tsx` as exemplar
- API routes follow `src/api/routes/users.ts` pattern
```

**Integration**: Injected into executor context alongside PLAN.md. Costs one subagent spawn per phase (~30s), prevents hours of cleanup.

---

### S7: Task Decomposition — Plan-checker slop gates

#### 7.1 Slop-type checklist in plan validation

**Problem**: The plan-checker validates plans against *requirements* (does the plan achieve the phase goal?) but not against *slop patterns* (will the plan produce clean code?).

**Proposal**: Add a slop-specific validation pass to `gsd-plan-checker`. After requirement validation, check each PLAN.md for:

| Check | What It Catches | Action |
|-------|----------------|--------|
| New file creates helper/util with <3 callers | Over-engineering (#4) | Flag: "Consider inlining" |
| Plan creates new abstraction layer | Premature abstraction (#4) | Flag: "Justify or simplify" |
| No `<verify>` references existing linter/type-checker | Missing back-pressure | Require: add lint/type-check command |
| Plan modifies files outside stated scope | Silent scope expansion (#7) | Block: "Reduce scope to listed files" |
| Plan adds new dependency | Potential hallucinated import (#1) | Require: `<verify>` includes `npm ls <pkg>` or equivalent |

**Implementation**: Add a `<slop_checks>` section to the plan-checker agent definition. Max 1 additional iteration (total still capped at 3 including the existing 2 requirement iterations).

#### 7.2 Diff budget in PLAN.md frontmatter

**Problem**: No mechanism limits the size of changes per task, allowing boilerplate inflation.

**Proposal**: Add optional `max_lines_changed` field to PLAN.md YAML frontmatter. Default: 300 lines. The executor's `<verify>` section checks `git diff --stat` against this limit. If exceeded, executor must justify or split the task.

```yaml
---
phase: 8
task: 3
max_lines_changed: 200
---
```

---

### S8: Execution — New hooks and executor constraints

#### 8.1 PostToolUse lint hook (auto-installed)

**Problem**: GSD installs a Prettier hook but no linting hook. Formatting is enforced; code quality is not.

**Proposal**: During `new-project`, auto-generate a PostToolUse hook based on QUALITY-STACK.md:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": ".claude/get-shit-done/hooks/quality-gate.sh",
        "timeout": 30
      }]
    }]
  }
}
```

`quality-gate.sh` runs the detected linter/formatter with `--fix` and returns only errors (success is silent). Generated from QUALITY-STACK.md, not hardcoded.

#### 8.2 Stop hook: type-check + dead-import gate

**Problem**: Executors can complete tasks with type errors or hallucinated imports because no hook blocks completion.

**Proposal**: Auto-install a Stop hook that blocks task completion until:
1. Type checker passes (`tsc --noEmit` / `mypy` / `pyright`)
2. No unresolvable imports exist
3. No new lint suppressions were added without justification

```bash
#!/bin/bash
# quality-stop-gate.sh — generated from QUALITY-STACK.md
ERRORS=""
if [ -f "tsconfig.json" ]; then
  TSC_OUT=$(npx tsc --noEmit 2>&1) || ERRORS="$ERRORS\nType errors:\n$TSC_OUT"
fi
if [ -n "$ERRORS" ]; then
  echo -e "$ERRORS" >&2
  exit 2  # Re-engage agent
fi
exit 0
```

#### 8.3 Executor agent anti-slop injection

**Problem**: Executor agents get PLAN.md + phase context but no explicit anti-slop directives.

**Proposal**: Prepend the following to every executor dispatch (templated, not LLM-generated):

```xml
<anti_slop>
  <rule>Search the codebase for existing implementations before creating new helpers, utils, or wrappers.</rule>
  <rule>Do not add comments that restate what the code does. Only comment non-obvious logic.</rule>
  <rule>Do not add error handling for scenarios that cannot occur in the current architecture.</rule>
  <rule>Verify all imports resolve to real packages in the project's dependency file.</rule>
  <rule>If your diff exceeds {max_lines_changed} lines, split the work or justify the size.</rule>
  <reuse_map file=".planning/{N}-REUSE-MAP.md" />
</anti_slop>
```

This fits GSD's existing XML-structured prompt pattern and adds ~200 tokens per dispatch.

---

### S9: Verification — New command: `/gsd:slop-check`

#### 9.1 Dedicated slop detection pass

**Problem**: `/gsd:verify-work` checks goal achievement (did we build what the phase promised?) but not code quality (did we build it cleanly?).

**Proposal**: New command `/gsd:slop-check [N]` that runs after execute-phase and before or alongside verify-work. Spawns a `gsd-slop-auditor` agent that:

1. **Runs deterministic checks** (from QUALITY-STACK.md):
   - Dead code detection (Knip / Vulture)
   - Duplicate detection (jscpd on modified files)
   - Lint suppression count (diff against pre-phase baseline)
   - Unused dependency check
   - Import resolution verification

2. **Runs heuristic checks** (LLM-based):
   - Scan for over-engineering: "Are there abstractions with only 1 concrete implementation?"
   - Scan for scope expansion: compare modified files against PLAN.md's stated file list
   - Scan for comment slop: flag `// This function...` tautological comments
   - Scan for naming drift: compare new identifiers against existing naming conventions

3. **Produces** `.planning/{N}-SLOP-REPORT.md`:

```markdown
# Slop Report — Phase 8

## Deterministic Findings
- ✅ No dead code detected (Knip)
- ✅ No duplicate blocks >10 lines (jscpd)
- ⚠️ 2 new lint suppressions added (was 5, now 7)
  - `src/api/handler.ts:42` — `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
  - `src/utils/parse.ts:18` — `// eslint-disable-next-line no-unused-vars`
- ❌ 1 unused dependency: `lodash` added but only `_.get` used (suggest: optional chaining)

## Heuristic Findings
- ⚠️ `src/services/UserServiceFactory.ts` — factory pattern with 1 implementation (over-engineering?)
- ⚠️ 3 files modified outside PLAN scope: `.env.example`, `README.md`, `package.json`
- ✅ No tautological comments detected
- ✅ Naming conventions consistent with existing codebase

## Slop Score
LDR: 0.72 (CLEAN) · DDC: 0.95 (CLEAN) · ICR: 0.18 (CLEAN)
Overall: 28/100 (CLEAN)

## Recommended Actions
1. Remove lodash; replace `_.get(obj, path)` with optional chaining
2. Justify or remove UserServiceFactory — single implementation doesn't need factory pattern
3. Document why lint suppressions are needed or fix the underlying issues
```

#### 9.2 Integrate slop score into verify-work

**Problem**: verify-work produces pass/fail on functional goals but doesn't surface quality issues.

**Proposal**: If `{N}-SLOP-REPORT.md` exists when verify-work runs, include the slop score in UAT.md. If slop score > 50 (INFLATED), flag as a verification warning. If > 70 (CRITICAL), block completion.

---

### S10: Completion — Cumulative slop tracking

#### 10.1 Slop trend in milestone audit

**Problem**: `/gsd:audit-milestone` checks definition-of-done but not cumulative code health across all phases.

**Proposal**: During `audit-milestone`, aggregate all `{N}-SLOP-REPORT.md` files and produce a trend:

```markdown
## Slop Trend
| Phase | Score | Dead Code | Duplicates | Lint Suppressions | Scope Expansion |
|-------|-------|-----------|------------|-------------------|-----------------|
| 70    | 22    | 0         | 0          | +1                | 0 files         |
| 71    | 28    | 0         | 0          | +2                | 3 files         |
| 72    | 45    | 2 exports | 1 block    | +0                | 0 files         |
| 73    | 31    | 0         | 0          | +1                | 1 file          |
| Trend | ↗️    |           |            |                   |                 |
```

If the trend is rising across phases, the audit flags "slop drift" as a milestone health concern.

#### 10.2 New command: `/gsd:desloppify [N]`

**Problem**: No GSD command exists for cleaning up existing slop. Post-hoc cleanup requires manual tool configuration.

**Proposal**: New command that reads `{N}-SLOP-REPORT.md` and auto-generates a cleanup plan:
1. Creates a quick-mode plan addressing each finding
2. Runs Knip/Vulture for dead code removal
3. Runs jscpd to identify and consolidate duplicates
4. Removes unjustified lint suppressions
5. Produces atomic commits per cleanup action

This is essentially `/gsd:quick` but scoped to the slop report's findings, with the cleanup plan auto-generated rather than user-described.

---

## New Agent Definitions

| Agent | Role | Stage | Tool Privileges |
|-------|------|-------|-----------------|
| `gsd-duplication-scanner` | Pre-execution duplicate/reuse detection | S6→S8 | Read, Grep, Glob (read-only) |
| `gsd-slop-auditor` | Post-execution slop detection and scoring | S9 | Read, Grep, Glob, Bash (lint/type-check commands only) |
| `gsd-desloppifier` | Cleanup executor for slop report findings | S10 | Read, Write, Edit, Bash, Grep, Glob |

## New Artifacts

| Artifact | Stage | Content |
|----------|-------|---------|
| `.planning/QUALITY-STACK.md` | S1 | Detected linters, formatters, type checkers, test runners |
| `.planning/ANTI-SLOP.md` | S2 | Always/Ask First/Never rules for code quality |
| `.planning/{N}-REUSE-MAP.md` | S6 | Existing code to reuse, patterns to follow |
| `.planning/{N}-SLOP-REPORT.md` | S9 | Deterministic + heuristic slop findings with score |

## New Commands

| Command | Stage | Purpose |
|---------|-------|---------|
| `/gsd:slop-check [N]` | S9 | Run slop detection on a completed phase |
| `/gsd:desloppify [N]` | S10 | Auto-generate and execute cleanup plan from slop report |

## New Hooks (Auto-Installed)

| Hook | Event | Purpose |
|------|-------|---------|
| `quality-gate.sh` | PostToolUse (Write\|Edit) | Run linter/formatter, surface errors only |
| `quality-stop-gate.sh` | Stop | Block completion on type errors / unresolved imports |

---

## Implementation Priority

### Wave 1 — Highest Impact, Lowest Effort
1. **8.1 PostToolUse lint hook** — Catches hallucinated imports, formatting, unused vars in real-time. Single shell script.
2. **8.2 Stop hook** — Blocks type errors from shipping. Single shell script.
3. **8.3 Executor anti-slop injection** — ~200 tokens per dispatch, prevents the most common slop patterns.
4. **2.1 ANTI-SLOP.md** — Template-based, no agent logic needed.

### Wave 2 — Medium Impact, Medium Effort
5. **1.1 Quality stack detection** — Extends codebase mapper agent with quality tool discovery.
6. **7.1 Plan-checker slop gates** — Adds a validation pass to existing agent.
7. **6.1 Duplication scanner** — New agent but simple (read-only search + report).

### Wave 3 — High Impact, Higher Effort
8. **9.1 `/gsd:slop-check`** — New command + new agent + deterministic tool integration.
9. **10.2 `/gsd:desloppify`** — New command orchestrating cleanup from slop report.
10. **10.1 Slop trend in milestone audit** — Aggregation logic across phase reports.

### Wave 4 — Polish
11. **1.2 Auto-generate CLAUDE.md quality section** — Template-driven from QUALITY-STACK.md.
12. **7.2 Diff budget** — YAML frontmatter field + verify section check.
13. **9.2 Slop score in verify-work** — Integration point, minimal new logic.

---

## What This Does NOT Change

- GSD's core discuss→plan→execute→verify cycle remains unchanged
- Fresh 200K context per task remains the primary anti-slop mechanism
- Plan-checker's 2-iteration requirement validation is extended, not replaced
- No new mandatory human gates — slop-check is advisory by default, blocking only at CRITICAL (>70) scores
- No dependency on external SaaS tools — all deterministic checks use project-local tooling
- Autonomous mode (`/gsd:autonomous`) continues to work — slop-check runs as part of the verify step

## Slop Types Addressed

| Slop Type | Severity | Prevention Mechanism | GSD Stage |
|-----------|----------|---------------------|-----------|
| Hallucinated imports | CRITICAL | Stop hook import verification; executor rule | S8, S9 |
| Security vulns | CRITICAL | Existing Nyquist validation + SAST in quality-gate.sh | S7, S8 |
| Placeholder/stub code | HIGH | Executor anti-slop rule; slop-check heuristic | S8, S9 |
| Duplicate logic | HIGH | Duplication scanner + REUSE-MAP.md | S6, S8 |
| Happy-path errors | HIGH | Existing Nyquist validation (test scaffolding) | S7 |
| Meaningless tests | HIGH | TDD enforcement in ANTI-SLOP.md ("tests that would fail") | S2, S9 |
| Data model mismatches | HIGH | Type-check Stop hook; strict mode enforcement | S8 |
| Over-engineering | MEDIUM-HIGH | Plan-checker slop gate; slop-check heuristic | S7, S9 |
| Deprecated APIs | MEDIUM-HIGH | Quality-gate.sh deprecation warnings | S8 |
| Architectural erosion | MEDIUM-HIGH | ANTI-SLOP.md "Ask First" rules; scope expansion check | S2, S9 |
| Boilerplate inflation | MEDIUM | Diff budget; slop-check LDR score | S7, S9 |
| Silent scope expansion | MEDIUM | Plan-checker scope gate; slop-check file list diff | S7, S9 |
| Dead code | MEDIUM | Slop-check Knip/Vulture pass; desloppify cleanup | S9, S10 |
| Lint suppression | MEDIUM | Stop hook suppression check; slop-check count | S8, S9 |
| Verbose comments | LOW-MEDIUM | Executor anti-slop rule; slop-check heuristic | S8, S9 |
| Naming drift | LOW-MEDIUM | Slop-check naming consistency scan | S9 |
| Cross-language contamination | MEDIUM | Quality-gate.sh language-specific linting | S8 |
| God functions | MEDIUM | Complexity check in quality-gate.sh | S8 |

**Coverage: 18/18 slop types addressed** (vs. 0/18 explicitly addressed today).

## See Also

- [[what-is-slop|What Is Code Slop?]] — Full 18-type taxonomy this proposal addresses
- [[desloppify|Desloppify Analysis]] — Post-hoc tool that can power proposals 9.1 and 10.2
- [[gsd|GSD Framework]] — The framework being improved
- [[sdd-ontology|SDD Ontology]] — The S1-S10 / CC1-CC12 framework these improvements map to
- [[de-sloppification-report|De-Sloppification Research Report]] — Research backing these proposals
