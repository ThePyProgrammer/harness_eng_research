# What Is Code Slop?

## Definition

**Slop** is structurally plausible but low-quality code produced by AI coding agents — code that passes CI, looks reasonable in a PR, and is "individually defensible," but cumulatively degrades codebase health.

The term was named Merriam-Webster's 2025 Word of the Year, defined broadly as "digital content of low quality that is produced usually in quantity by means of artificial intelligence." In code, it describes the specific artifacts that AI agents leave behind: unnecessary abstractions, hallucinated imports, redundant logic, verbose comments, and architectural drift that compounds silently across hundreds of commits.

## Three Properties

Academic research (MINT Lab) identifies three prototypical properties that distinguish slop from ordinary bad code:

1. **Superficial competence** — It *looks* right. The syntax is valid, the variable names are reasonable, the structure follows familiar patterns. A quick glance at a PR won't catch it. This is what makes slop dangerous: it passes the "does this look okay?" test that most code review relies on.

2. **Asymmetric effort** — It is trivially easy to produce and disproportionately hard to verify. An AI agent generates 200 lines of a CRUD service in seconds; a human reviewer needs 15 minutes to determine that 170 of those lines are unnecessary wrapper code around a 30-line implementation.

3. **Mass producibility** — AI agents generate code at a volume and speed that overwhelms traditional quality gates. When 41% of production code is AI-generated and each piece carries a 1.7x higher issue rate, the aggregate effect is not a few bad files — it's systematic codebase degradation.

## How Slop Differs from Human Bad Code

Human-written bad code and AI slop are not the same problem:

| Dimension | Human Bad Code | AI Slop |
|-----------|---------------|---------|
| **Visibility** | Usually *obviously* bad — visible shortcuts, TODO hacks, "I'll fix this later" | *Plausible enough to continue* — passes review because it looks competent |
| **Root cause** | Knowledge gaps, time pressure, deliberate trade-offs | **Context blindness** — the agent doesn't know what already exists in the codebase |
| **Pattern** | Idiosyncratic to the individual developer | **Systematic** — the same model produces the same types of issues across all codebases |
| **Volume** | Self-limiting (humans write code slowly) | **Unbounded** — agents generate faster than humans can review |
| **Unique artifacts** | None that are structurally impossible for humans | Hallucinated imports, cross-language contamination, silent scope expansion |
| **Natural friction** | Code reviews, hallway conversations, "does this feel right?" | AI speed **eliminates the protective pause** between writing and shipping |

The core insight: human bad code is a *local* problem (one developer, one decision). AI slop is a *systemic* problem — each individual change is defensible, but the aggregate effect is architectural rot that no single PR reveals.

## The 18 Types

Slop manifests in 18 distinct patterns, organized by severity:

### CRITICAL — Immediate production risk

**1. Hallucinated Imports / Phantom Packages** — The AI generates import statements for packages or APIs that literally do not exist. Commercial models hallucinate packages ~5.2% of the time; open-source models ~21.7%. This has spawned "slopsquatting" — attackers register the hallucinated package names on npm/PyPI and inject malware.

**2. Security Vulnerabilities That Look Functional** — Code that works correctly under normal conditions but fails catastrophically under adversarial input. Unsanitized SQL, XSS-vulnerable output, improper auth flows. AI-generated code contains 2.74x more security vulnerabilities than human-written code. 65-75% of AI-generated functions contain at least one security flaw in benchmarks.

### HIGH — Causes bugs, test failures, or maintenance burden

**3. Placeholder / Stub Code** — Unfinished implementations: `pass`, `...`, `NotImplementedError`, empty catch blocks. The agent scaffolds a function signature but never fills in the body.

**4. Duplicate Logic Proliferation** — The agent creates a new `formatDate()` utility when one already exists three directories away. This is the direct consequence of context blindness: the agent generates code "regardless of whether the correct function already exists."

**5. Happy-Path Error Handling** — `try/catch` blocks that merely log errors without recovery. Missing null checks on API responses. Edge cases and boundary conditions ignored because the agent optimizes for the obvious flow.

**6. Meaningless Tests** — `assert True`. Tests with hardcoded expected values that match whatever the implementation produces. Mock-only tests that never touch real behavior. These create false confidence: test coverage goes up while actual verification goes down.

**7. Data Model Mismatches** — The agent assumes data structures based on variable names rather than actual schemas. Accessing `.user.name` when the API actually returns `.data.user.displayName`.

### MEDIUM-HIGH — Increases maintenance cost and technical debt

**8. Over-Engineering / Premature Abstraction** — Factory patterns for a single implementation. Dependency injection frameworks where a simple function call would suffice. Complex state management wrappers around standard hooks. The agent builds for hypothetical futures that will never arrive. *No automated detection tool exists for this pattern.*

**9. Outdated API / Deprecated Library Usage** — The agent's training data includes old patterns: `componentWillMount` in React, deprecated Python string formatting, removed API endpoints. The code works today but carries known vulnerabilities or will break on the next library update.

**10. Schema / Architectural Integrity Erosion** — Changes that pass all tests but violate the original design's structural intent. Extending a data model in ways that break conceptual coherence. Each change is "individually defensible" but the aggregate is architectural rot.

### MEDIUM — Degrades readability, performance, or maintainability

**11. Boilerplate Inflation** — A 200-line CRUD service class when 30 lines of direct calls would accomplish the same thing. Excessive scaffolding, redundant wrapper functions, verbose implementations of simple operations.

**12. Silent Scope Expansion** — You ask for a bug fix; the agent reorganizes all imports, adds a logging framework, and refactors three unrelated files. Spotify's data shows this is the most common reason their LLM-as-Judge vetoes agent output.

**13. Cross-Language Contamination** — Java idioms in Python code (`array.push()` instead of `list.append()`). `.equals()` comparisons in JavaScript. Ruby-style iterators in Go. The model's training on multiple languages leaks across boundaries.

**14. God Functions** — Functions exceeding 50 lines with cyclomatic complexity above 10. The agent dumps all logic into a single function rather than decomposing.

**15. Dead Code / Unreachable Statements** — Code after unconditional `return`. Variables assigned but never read. Branches that can never execute. Import statements for modules never referenced.

**16. Lint Suppression / Escape Hatches** — `# noqa`, `// eslint-disable-next-line`, `@SuppressWarnings` — the agent silences warnings rather than fixing the underlying issue.

### LOW-MEDIUM — Cosmetic but compounds over time

**17. Redundant / Verbose Comments** — `// This function adds two numbers` above `function add(a, b)`. Hedging language ("should", "might", "probably") in comments. Overconfident assertions about behavior the comment doesn't verify. *No detection tool exists for this pattern.*

**18. Naming / Convention Drift** — `getUserData`, `fetch_user_info`, and `retrieveUserRecord` coexisting in the same codebase. The agent doesn't scan for existing naming conventions before choosing names.

## How to Measure It

Three open-source tools provide quantitative slop scoring:

### AI-SLOP-Detector
Scores each file on three weighted metrics:
- **LDR (Logic Density Ratio)**: `logic_lines / total_lines` — how much of the file is actual code vs. whitespace, comments, and boilerplate. Weight: 0.40.
- **ICR (Inflation)**: `jargon_density × complexity_modifier` — detects buzzword-heavy, verbose patterns typical of AI output. Weight: 0.30.
- **DDC (Dependency Check)**: `used_imports / total_imports` — catches phantom and unused imports. Weight: 0.20.

Score thresholds: <30 CLEAN, 30-49 SUSPICIOUS, 50-69 INFLATED, 70+ CRITICAL.

### KarpeSlop
Organizes detection along three qualitative axes:
- **Noise** (Information Utility) — redundant comments, boilerplate, debug logs
- **Lies** (Information Quality) — hallucinated imports, incorrect assumptions, TODO placeholders
- **Soul** (Style/Taste) — overconfident comments, hedging language, non-idiomatic patterns

### Desloppify
Combines mechanical detection (dead code, duplication, cyclomatic complexity) with subjective LLM review (naming quality, abstraction appropriateness, module boundaries). Targets a score above 98 for code "a seasoned engineer would call beautiful."

## The Numbers

| Statistic | Source |
|-----------|--------|
| AI generates ~41% of production code | CodeRabbit (470 PRs) |
| AI code has 1.7x more quality issues overall | CodeRabbit |
| 2.74x more security vulnerabilities (XSS specifically) | CodeRabbit |
| ~8x more I/O-related performance issues | CodeRabbit |
| 1.75x more logic/correctness errors | CodeRabbit |
| 20% higher code churn rate | CodeRabbit |
| Change failure rates rose ~30% with AI adoption | CodeRabbit |
| ~5.2% hallucinated package rate (commercial models) | Augment Code |
| ~21.7% hallucinated package rate (open-source models) | Augment Code |
| 65-75% of AI functions contain security vulnerabilities | Dev community benchmarks |
| 46% of developers distrust AI output accuracy | NetCorp 2026 survey |
| 71% do not merge AI code without manual review | NetCorp 2026 survey |
| ~20% of AI-suggested dependencies point to nonexistent packages | Trend Micro |

## Why It Matters

The defining quality challenge of 2026 is not whether AI can write code — it can. The challenge is that AI writes code *that looks right but isn't*, at a speed that outpaces every quality gate designed for human velocity. Each individual piece of slop is survivable. The aggregate — across hundreds of AI-generated commits, across a codebase growing at 41% AI contribution — is silent architectural decay that reveals itself only when the system becomes too expensive to change and too fragile to extend.

The most valuable engineering skill in 2026 isn't writing code. It's knowing what to delete.

## See Also

- [[harness-engineering|What Is Harness Engineering?]] — The harness is the lever for preventing slop
- [[sdd-ontology|SDD Ontology]] — Which pipeline stages address which slop types
- [[de-sloppification-report|De-Sloppification Research Report]] — Three-stage defense model
- [[desloppify|Desloppify]] — Post-hoc cleanup tool analysis
- [[gsd-desloppification|GSD Improvement Proposal]] — 13 changes to address 18/18 slop types

## Sources

- [Merriam-Webster: 2025 Word of the Year](https://techcrunch.com/2025/12/15/merriam-webster-names-slop-the-word-of-the-year/)
- [MINT Lab: AI Slop — Definitions and Normative Status](https://mintresearch.org/reports/ai-slop/)
- [CodeRabbit: State of AI vs Human Code Generation](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- [Augment Code: 8 AI Code Failure Patterns](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes)
- [Sentry: Reviewing AI-Generated Code Playbook](https://develop.sentry.dev/sdk/getting-started/playbooks/development/reviewing-ai-generated-code/)
- [SD Times: The Cost of AI Slop in Lines of Code](https://sdtimes.com/ai/the-cost-of-ai-slop-in-lines-of-code/)
- [Without Guardrails, AI Coding Turns Into Chaos](https://dev.to/naysmith/without-guardrails-ai-coding-turns-into-chaos-3l7j)
- [AI is Your Copilot, Not Your Architect](https://dev.to/alex_aslam/ai-is-your-copilot-not-your-architect-a-senior-developers-guide-to-prompt-engineering-for-code-2e75)
- [Trend Micro: Slopsquatting](https://www.trendmicro.com/vinfo/us/security/news/cybercrime-and-digital-threats/slopsquatting-when-ai-agents-hallucinate-malicious-packages)
- [AI-Generated Code Statistics 2026](https://www.netcorpsoftwaredevelopment.com/blog/ai-generated-code-statistics)
- [The Most Valuable Skill in 2026 Isn't Writing Code](https://dev.to/the_nortern_dev/the-most-valuable-skill-in-2026-isnt-writing-code-it-is-deleting-it-53j1)
- [KarpeSlop](https://github.com/CodeDeficient/KarpeSlop)
- [AI-SLOP-Detector](https://github.com/flamehaven01/AI-SLOP-Detector)
- [Desloppify](https://github.com/peteromallet/desloppify)
