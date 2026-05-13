# Desloppify: Analysis

*Agent harness for systematic post-hoc codebase quality improvement. v0.9.9, March 2026.*

## What It Is

Desloppify is a Python CLI tool (2.4K stars, MIT license) that combines mechanical static analysis with LLM-powered subjective review to produce a scored, prioritized queue of code quality issues. It operates as a **scan → plan → next → fix → resolve** loop designed for AI coding agents to execute autonomously across multiple sessions.

It is **purely post-hoc** — it analyzes code that already exists and produces cleanup tasks. It has no pre-hoc prevention, no generation-time back-pressure, and no agent lifecycle integration.

## Architecture

### Five-Layer Import Hierarchy

```
Layer 5: app/           CLI commands, thin entry points
Layer 4: intelligence/  LLM subjective review, coaching, integrity checks
Layer 3: languages/     29 language plugins (8 full, 21+ generic)
Layer 2: engine/        Detectors, scoring, planning, state, work queue
Layer 1: base/          Config, enums, registry, discovery, output
```

Each layer imports only downward. Detectors needing language context use `engine.hook_registry.get_lang_hook(...)` for dynamic dispatch.

Sources: [GitHub source tree](https://github.com/peteromallet/desloppify/tree/main/desloppify)

### Core Data Model

| Concept | Definition |
|---------|-----------|
| **Finding** | A detected issue: detector name, tier (T1-T4), category, file path, description |
| **Detector** | Named analysis algorithm registered in `base/registry.py`. Pure function: `detect_*(data, config) → list[dict]` |
| **Tier** | Severity level: T1 (minor) → T4 (architectural). T4 receives highest scoring weight |
| **Zone** | File classification: production, test, config, generated, script, vendor. Zones affect scoring weight |
| **Phase** | Scan stage: structural → style → security. Each runs extractors → detectors → normalization |
| **LangConfig** | Static per-language contract: phases, detectors, thresholds |
| **LangRun** | Per-invocation mutable state: zone maps, dependency graphs, complexity metrics |

### Data Flow

```
scan: Config → Phases → Findings → merge into language-specific state JSON
  ↓
plan: State → Reconciliation → Prioritized plan.json (clusters + deferred)
  ↓
review: State + Plan → LLM analysis → merged findings (subjective layer)
  ↓
next: Display highest-priority item with coaching narrative
  ↓
fix: Agent or human resolves the issue
  ↓
resolve: Attestation + state update → score recalculation
```

## Two Analysis Layers

### Mechanical Detection (25% of health score)

Deterministic, language-aware analysis using tree-sitter parsing and built-in detectors:

- Dead code (unused functions, classes, variables, imports)
- Code duplication / copy-paste blocks
- Cyclomatic complexity and function length
- Dependency cycles
- Unused dependencies
- Unreachable code paths

**Full plugin support** (deep detectors + auto-fixers): TypeScript, Python, C#, C++, Dart, GDScript, Go, Rust

**Generic support** (linter + tree-sitter): Ruby, Java, Kotlin, Julia, and 18+ additional languages

Sources: [GitHub](https://github.com/peteromallet/desloppify), [PyPI](https://pypi.org/project/desloppify/)

### Subjective Analysis (75% of health score)

LLM-powered review across multiple quality dimensions. Since v0.9.5, subjective analysis is the **primary driver** of the health score (75/25 split), based on learnings from a 200K LOC codebase where mechanical issues were insufficient quality signals.

Dimensions reviewed:
- **Naming consistency** — identifier conventions across the codebase
- **Abstraction appropriateness** — are abstractions justified by usage?
- **Module boundary violations** — does code respect architectural boundaries?
- **Error handling patterns** — consistency and completeness
- **Convention drift** — deviations from established codebase patterns
- **Cohesion** — do modules have clear, focused responsibilities?

Uses a two-phase "Observe → Judge" pattern (added v0.9.8): the LLM first observes code without scoring, then judges with structured criteria. This separation reduces premature anchoring on scores.

Sources: [X post on v0.7.2](https://x.com/peteromallet/status/2026650361285718124), [v0.9.8 release](https://github.com/peteromallet/desloppify/releases)

## Scoring System

### Health Score

- Target: >98 = "a codebase a seasoned engineer would respect"
- v1.0 goal: score of 100 = "most world-class engineers agree is very well designed"
- v2.0 goal: score of 100 = "considered holistically beautiful"
- Weighted: 75% subjective quality, 25% mechanical cleanliness

Sources: [X post on scoring vision](https://x.com/peteromallet/status/2023122331879567704)

### Anti-Gaming Mechanisms

The scoring system's most distinctive feature is its resistance to manipulation:

1. **Attestation on resolve** — When marking an issue fixed, the agent must provide an explicit attestation: `--attest 'I have actually [DESCRIBE THE CONCRETE CHANGE] and I am not gaming the score by resolving without fixing.'`

2. **Penalized dismissals** — Dismissing issues without fixing them *lowers* the score rather than being neutral. You can't improve the score by hiding problems.

3. **Cross-checked subjective assessments** — LLM subjective scores are validated against mechanical findings to catch inconsistencies.

4. **Persistent state** — `.desloppify/` directory maintains state across sessions, preventing "clean scan" gaming where each scan starts fresh.

5. **Numeric target redaction** (v0.9.8) — Penalty messages don't reveal numeric targets, preventing agents from reverse-engineering the scoring to game it.

6. **Judgment-required detectors excluded from auto-clustering** (v0.9.5) — Issues requiring human judgment can't be bulk-resolved by automation.

Sources: [GitHub README](https://github.com/peteromallet/desloppify), [v0.9.8 release notes](https://github.com/peteromallet/desloppify/releases)

## CLI Commands

| Command | Purpose |
|---------|---------|
| `desloppify scan --path .` | Analyze codebase, generate issue queue |
| `desloppify next` | Display highest-priority fix with coaching |
| `desloppify backlog` | View broader work not in active queue |
| `desloppify plan` | Reorder priorities, cluster related issues |
| `desloppify resolve fixed <id> --note '...' --attest '...'` | Mark issue fixed with attestation |
| `desloppify exclude <path>` | Exclude vendor/build/generated directories |
| `desloppify update-skill [agent]` | Install workflow guide for claude/cursor/codex/copilot/windsurf/gemini |
| `desloppify detect` | Ad-hoc detector query |

### The Loop

The core workflow is deliberately simple:
1. Run `next` — it tells you what to fix, which file, and the resolve command
2. Fix it
3. Run `resolve` with attestation
4. Run `next` again

This loop runs across sessions because state persists in `.desloppify/`.

## Living Plan System (v0.9.5+)

Issues are organized into two queues:
- **Execution queue** — What `next` draws from. Actively prioritized, clustered by relatedness.
- **Backlog** — Broader issues deferred from immediate execution. Viewable via `backlog`.

The `plan` command allows reordering priorities, clustering related issues, and deferring work. Plans have explicit `action_type` and `execution_policy` fields (v0.9.9).

## Agent Integration

Desloppify installs a structured skill prompt via `update-skill [agent]`. The prompt includes:
- Installation instructions
- Workflow explanation (the scan → next → fix → resolve loop)
- Directive against substituting agent's own analysis for desloppify's findings
- Emphasis on equal effort for large refactors and small fixes

Supports: Claude Code, Cursor, Codex, Copilot, Windsurf, Gemini CLI.

## Known Limitations

1. **Resource intensive** — Reviews can consume 1.2M+ tokens and take 30+ minutes on medium codebases. [Fresh/Brewed review](https://freshbrewed.science/2026/03/05/codeclean.html)

2. **Churn risk** — Sometimes produces "complete rewrites" causing significant code churn rather than targeted fixes. [Fresh/Brewed review](https://freshbrewed.science/2026/03/05/codeclean.html)

3. **State-model coupling** — A $1,000 bounty challenge revealed that the codebase conflates raw issue records with derived scoring and decision logs in a single mutable document, creating non-commutative behavior where operation ordering changes outcomes. [GitHub issue #204](https://github.com/peteromallet/desloppify/issues/204)

4. **Creator doesn't fully understand the code** — The creator stated: "I didn't write any of the ~91k lines of code in this repo and I barely understand most of it." The tool is itself largely AI-generated. [GitHub issue #204](https://github.com/peteromallet/desloppify/issues/204)

5. **No pre-hoc capability** — Purely reactive. Cannot prevent slop during generation, only clean it up afterward.

6. **No harness integration** — Standalone tool. Does not integrate into GSD, Superpowers, or other framework lifecycles without wrapper code.

## Version History Highlights

| Version | Date | Key Addition |
|---------|------|-------------|
| v0.9.9 | Mar 13, 2026 | Auto-resolve for deleted files, cluster semantics, 5,367 tests |
| v0.9.8 | Mar 12, 2026 | C++ & Rust full support, Observe→Judge review, anti-gaming redaction, 5,266 tests |
| v0.9.5 | Mar 11, 2026 | Julia support, 75/25 subjective/mechanical rebalance, Living Plan, 5,022 tests |
| v0.7.2 | ~Feb 2026 | 28 language support, subjective scoring bias |
| v0.8.0 | ~Mar 2026 | Multi-day autonomous operation, agent planning tools |

Rapid iteration: 13 releases in ~6 weeks, 739 commits, 99.5% Python.

## Slop Types Addressed

| Slop Type | Detection Layer | Coverage |
|-----------|----------------|----------|
| Dead code / unreachable statements | Mechanical | Full — tree-sitter + detectors |
| Duplicate logic proliferation | Mechanical | Full — duplication detectors |
| Hallucinated imports / unused imports | Mechanical | Partial — unused import detection, not registry verification |
| God functions (complexity) | Mechanical | Full — cyclomatic complexity + function length |
| Dependency cycles | Mechanical | Full — dependency graph analysis |
| Over-engineering / premature abstraction | Subjective | Partial — "abstraction appropriateness" dimension |
| Naming / convention drift | Subjective | Full — naming consistency dimension |
| Architectural integrity erosion | Subjective | Full — module boundary + cohesion dimensions |
| Error handling patterns | Subjective | Full — error handling consistency dimension |
| Boilerplate inflation | Both | Partial — complexity metrics + subjective review |
| Placeholder / stub code | Mechanical | Partial — depends on language plugin depth |
| Security vulnerabilities | Mechanical | Partial — depends on language plugin |
| Verbose comments | Neither | Not addressed |
| Silent scope expansion | Neither | Not addressed (no diff/prompt awareness) |
| Cross-language contamination | Neither | Not addressed |
| Data model mismatches | Neither | Not addressed |
| Meaningless tests | Neither | Not addressed |
| Lint suppression escape hatches | Neither | Not addressed |
| Outdated API / deprecated usage | Neither | Not addressed |

**Coverage: ~10/18 slop types addressed** (6 mechanical, 4 subjective). The 8 unaddressed types require either generation-time awareness (scope expansion, cross-language), runtime verification (data model mismatches), or test-specific analysis (meaningless tests) that a post-hoc scanner cannot provide.

## See Also

- [[what-is-slop|What Is Code Slop?]] — Full 18-type taxonomy
- [[gsd-desloppification|GSD Improvement Proposal]] — How to integrate Desloppify into GSD's pipeline
- [[de-sloppification-report|De-Sloppification Research Report]] — Three-stage defense model
- [Desloppify Canvas](../canvases/desloppify.canvas) — Visual architecture diagram
