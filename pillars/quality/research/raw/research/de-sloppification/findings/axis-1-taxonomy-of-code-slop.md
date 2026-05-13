# Axis 1: Taxonomy of Code Slop

## Question
What is "slop" in the context of AI-generated code? What distinct types exist, how do they differ from human-introduced code quality issues, and what measurable indicators can detect each type?

## Findings

### Definition

"Slop" was named Merriam-Webster's 2025 Word of the Year, defined as "digital content of low quality that is produced usually in quantity by means of artificial intelligence" [Merriam-Webster names 'slop' the word of the year](https://techcrunch.com/2025/12/15/merriam-webster-names-slop-the-word-of-the-year/). In the code domain specifically, AI slop refers to structurally plausible but low-quality code artifacts that AI coding agents introduce -- patterns that pass CI and look reasonable but cumulatively degrade codebase health [The cost of AI slop in lines of code](https://sdtimes.com/ai/the-cost-of-ai-slop-in-lines-of-code/).

Academic research identifies three "prototypical properties" of slop: **superficial competence**, **asymmetric effort** (easy to produce, hard to verify), and **mass producibility** [MINT Lab -- AI Slop: Definitions and Normative Status](https://mintresearch.org/reports/ai-slop/).

### Taxonomy Table: Types of AI Code Slop

| # | Slop Type | Description | Example | Detection Method | Severity |
|---|-----------|-------------|---------|------------------|----------|
| 1 | **Hallucinated Imports / Phantom Packages** | AI generates import statements for packages or APIs that do not exist | `import { useRouter } from 'react'` instead of `'next/router'`; importing a nonexistent npm package | Static analysis flagging unresolvable imports; DDC (Dependency Check) ratio: `used_imports / total_imports` | CRITICAL |
| 2 | **Placeholder / Stub Code** | Unfinished implementations left as scaffolding: `pass`, `...`, `NotImplementedError`, empty catch blocks | A function body containing only `raise NotImplementedError` without `@abstractmethod` | Pattern matching for `pass`, `...`, `NotImplementedError`, bare `except: pass` | HIGH |
| 3 | **Duplicate Logic Proliferation** | AI creates new helper functions/components that duplicate existing ones because it lacks full codebase context | A new `formatDate()` util when one already exists in a different module | Code duplication analysis (e.g., jscpd, PMD CPD); cross-file function signature similarity | HIGH |
| 4 | **Over-Engineering / Premature Abstraction** | Unnecessary abstraction layers, design patterns, and "future-proof" structures that serve no current purpose | Complex state management library wrapper when standard React hooks suffice; factory patterns for single implementations | Cyclomatic complexity analysis; counting abstraction layers vs. concrete implementations; LLM-based subjective review | MEDIUM-HIGH |
| 5 | **Boilerplate Inflation** | Excessive scaffolding, redundant wrapper code, and verbose implementations that could be simpler | Generating a full CRUD service class with 200 lines when 30 lines of direct calls suffice | Lines of code vs. logic density ratio (LDR = `logic_lines / total_lines`); measuring code-to-functionality ratio | MEDIUM |
| 6 | **Redundant / Verbose Comments** | Over-commenting with obvious descriptions, hedging language, or overconfident assertions | `// This function adds two numbers` above `function add(a, b)` | ICR (Inflation/jargon density); pattern matching for hedging ("should", "might", "probably") and tautological comments | LOW-MEDIUM |
| 7 | **Silent Scope Expansion** | AI adds functionality beyond what was requested, restructuring files or introducing unrequested features | Prompt asks for a bug fix; AI reorganizes all imports and adds a logging framework | Diff analysis comparing prompt scope to actual changes; PR scope validation | MEDIUM |
| 8 | **Cross-Language Contamination** | Syntax or idioms from wrong languages appear in generated code | `array.push()` in Python code; `.equals()` Java pattern in JavaScript | Language-specific pattern matching (e.g., detecting `js_push`, `java_equals`, `ruby_each` patterns in Python) | MEDIUM |
| 9 | **Happy-Path Error Handling** | Error handling that only covers common scenarios, missing edge cases, null checks, and boundary conditions | `try/catch` that merely logs errors without recovery; missing null checks on API responses | Coverage analysis for error paths; testing with empty inputs, null values, boundary integers | HIGH |
| 10 | **Outdated API / Deprecated Library Usage** | AI's training data includes old patterns, producing code with deprecated APIs and known vulnerabilities | Using `componentWillMount` in React; referencing APIs removed in recent library versions | Dependency scanning for deprecation warnings; version-aware linting | MEDIUM-HIGH |
| 11 | **Meaningless Tests** | Test assertions that cannot actually fail or that only test mocks, not real behavior | `assert True`; tests with hardcoded matching values; mock-only tests that never touch real code | Test mutation analysis; checking for `assert True` equivalents; verifying assertions would fail if feature broke | HIGH |
| 12 | **Naming / Convention Drift** | Inconsistent naming conventions introduced across AI-generated code | `getUserData` alongside `fetch_user_info` and `retrieveUserRecord` in the same codebase | Style linting; naming convention consistency checks across files | LOW-MEDIUM |
| 13 | **God Functions** | Excessively long functions with high cyclomatic complexity | Functions exceeding 50 lines with cyclomatic complexity >10 | Function length + cyclomatic complexity measurement (flagged when >50 lines AND CC>10) | MEDIUM |
| 14 | **Dead Code / Unreachable Statements** | Code paths that can never execute, unused variables, unreachable branches | Code after unconditional `return`; variables assigned but never read | Static analysis for unreachable code; unused variable detection; tree-shaking analysis | MEDIUM |
| 15 | **Security Vulnerabilities That Look Functional** | Code that works correctly but fails under adversarial conditions | Unsanitized SQL queries; XSS-vulnerable output; improper password handling | SAST tools (CodeQL, Semgrep); security-focused linting; 2.74x more common in AI code per CodeRabbit data | CRITICAL |
| 16 | **Data Model Mismatches** | AI assumes data structures based on variable names rather than actual schemas | Accessing `.user.name` when the API returns `.data.user.displayName` | Runtime schema validation; TypeScript strict type checking; comparing code assumptions against actual API specs | HIGH |
| 17 | **Schema / Architectural Integrity Erosion** | Changes that technically work but violate the original design's structural intent | Extending a data model in ways that pass tests but break conceptual coherence | Architecture Decision Record (ADR) compliance checks; module boundary analysis; LLM-based architectural review | MEDIUM-HIGH |
| 18 | **Lint Suppression / Escape Hatches** | Disabled linter annotations to silence warnings rather than fix issues | `# noqa`, `// eslint-disable-next-line`, `@SuppressWarnings` | Counting lint suppression annotations; flagging new suppressions in PRs | MEDIUM |

Sources for taxonomy: [KarpeSlop](https://github.com/CodeDeficient/KarpeSlop), [AI-SLOP-Detector](https://github.com/flamehaven01/AI-SLOP-Detector), [Augment Code - 8 Failure Patterns](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes), [Sentry AI Code Review Playbook](https://develop.sentry.dev/sdk/getting-started/playbooks/development/reviewing-ai-generated-code/), [Without Guardrails, AI Coding Turns Into Chaos](https://dev.to/naysmith/without-guardrails-ai-coding-turns-into-chaos-3l7j)

### How AI-Specific Slop Differs from Human Code Quality Issues

**Plausibility masking incoherence.** The fundamental difference is that human-written bad code is usually *obviously* bad -- a developer rushing through a deadline writes code that visibly cuts corners. AI slop is "plausible enough to continue" while cumulatively degrading systemic coherence [Without Guardrails, AI Coding Turns Into Chaos](https://dev.to/naysmith/without-guardrails-ai-coding-turns-into-chaos-3l7j). Each individual AI-generated change is "individually defensible" but the aggregate effect is architectural rot. Human friction (code reviews, hallway conversations) naturally caught these incremental drifts; AI's speed eliminates that protective pause.

**Volume and uniformity.** CodeRabbit's study of 470 GitHub PRs found AI-generated code produces 1.7x more issues overall, with specific multipliers of 3x+ for readability problems, 2.74x for security vulnerabilities (XSS specifically), approximately 8x for I/O-related performance issues, and 1.75x for logic/correctness errors [CodeRabbit State of AI vs Human Code Generation Report](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report).

**Context blindness vs. knowledge gaps.** Human code quality issues typically stem from individual knowledge gaps, time pressure, or deliberate trade-offs. AI code issues stem from *context blindness* -- the agent generates a result "regardless of whether the correct function, pattern, or abstraction already exists" [AI is Your Copilot, Not Your Architect](https://dev.to/alex_aslam/ai-is-your-copilot-not-your-architect-a-senior-developers-guide-to-prompt-engineering-for-code-2e75). If the context window is incomplete, AI will reinvent rather than reuse, creating systematic duplication that humans rarely produce because humans *know their codebase*.

**Uniquely AI artifacts.** Some slop types have no real human analog: hallucinated imports (referencing packages that literally do not exist -- commercial models do this ~5.2% of the time, open-source models ~21.7%) [Augment Code](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes), cross-language contamination (Java idioms in Python), and silent scope expansion (restructuring code beyond what was requested).

### Quantitative Detection Framework

Two open-source tools provide concrete scoring systems:

**AI-SLOP-Detector** uses three core metrics per file [AI-SLOP-Detector](https://github.com/flamehaven01/AI-SLOP-Detector):
- **LDR (Logic Density Ratio)**: `logic_lines / total_lines` -- measures actual code vs. whitespace/comments/boilerplate (weight: 0.40)
- **ICR (Inflation)**: `jargon_density x complexity_modifier` -- detects buzzword-heavy, verbose patterns (weight: 0.30)
- **DDC (Dependency Check)**: `used_imports / total_imports` -- identifies phantom/unused imports (weight: 0.20)
- Scores: < 30 = CLEAN, 30-49 = SUSPICIOUS, 50-69 = INFLATED_SIGNAL, 70+ = CRITICAL_DEFICIT

**KarpeSlop** organizes detection along three axes [KarpeSlop](https://github.com/CodeDeficient/KarpeSlop):
- **Information Utility (Noise)**: redundant comments, boilerplate, debug logs
- **Information Quality (Lies)**: hallucinated imports, incorrect assumptions, TODO placeholders
- **Style/Taste (Soul)**: overconfident comments, hedging language, non-idiomatic patterns

**Desloppify** combines mechanical detection (dead code, duplication, cyclomatic complexity) with subjective LLM review (naming quality, abstraction appropriateness, module boundaries), targeting a score above 98 for code "a seasoned engineer would call beautiful" [Desloppify](https://github.com/peteromallet/desloppify).

### Key Statistics

- AI now generates ~41% of code in production but increases churn by 20% [CodeRabbit Report](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- Change failure rates rose ~30% alongside increased AI code adoption [CodeRabbit Report](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- 65-75% of AI-generated functions contained security vulnerabilities in benchmarks [The most valuable skill in 2026 isn't writing code. It is deleting it.](https://dev.to/the_nortern_dev/the-most-valuable-skill-in-2026-isnt-writing-code-it-is-deleting-it-53j1)
- 46% of developers actively distrust AI tool output accuracy [AI-Generated Code Statistics 2026](https://www.netcorpsoftwaredevelopment.com/blog/ai-generated-code-statistics)
- 71% of developers do not merge AI-generated code without manual review [AI-Generated Code Statistics 2026](https://www.netcorpsoftwaredevelopment.com/blog/ai-generated-code-statistics)

## Key Unknowns

1. **No standardized taxonomy yet exists.** Academic research notes AI slop "has so far resisted formal definition" [MINT Lab](https://mintresearch.org/reports/ai-slop/).
2. **Limited longitudinal data on architectural rot.** No controlled study measuring the rate at which AI-generated code degrades architectural coherence over time.
3. **Model-specific slop profiles.** Different LLMs likely produce different slop distributions (hallucination rates vary from 5.2% to 21.7%) but no comprehensive comparison exists.
4. **Effectiveness of pre-hoc vs. post-hoc approaches.** No comparative study measuring which approach removes more slop per unit effort.
5. **Severity calibration.** Severity levels are synthesized from tool defaults and expert opinion, not from empirical production impact studies.
6. **Interaction effects.** How multiple slop types compound is discussed qualitatively but not measured quantitatively.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 13+
