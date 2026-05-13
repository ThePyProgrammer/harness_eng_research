# Axis 4: Post-Hoc Cleanup Tools and Techniques

## Question
What tools and techniques exist for detecting and removing slop from codebases that already contain it? This covers static analysis, AI-assisted refactoring, dead code detection, de-bloating, and automated codebase health improvement.

## Findings

### Tool/Technique Comparison Table

| Tool | What It Detects | Languages | Integration | Effectiveness / Notes | Confidence |
|------|----------------|-----------|-------------|----------------------|------------|
| **Knip** | Unused files, exports, dependencies, class members, enum members, duplicate exports | JavaScript, TypeScript (100+ framework plugins) | CLI, CI/CD | Uses mark-and-sweep from fine-grained entry points; recommended replacement for ts-prune (now in maintenance mode). Users report deleting tens of thousands of lines. [Knip](https://knip.dev/) | High |
| **Vulture** | Unused functions, classes, variables, imports; unreachable code after return/break/raise; unsatisfiable conditions | Python | CLI, CI/CD, whitelist-based false-positive suppression | Assigns confidence scores (60-100%) per finding. Can be tuned with `--min-confidence`. [Vulture GitHub](https://github.com/jendrikseipp/vulture) | High |
| **Ruff** | Unused imports (F401), unused variables, outdated syntax, style violations — replaces Flake8 + isort + autoflake + pyupgrade | Python | CLI (`--fix` autofix), IDE plugins, CI/CD | Written in Rust; 10-100x faster than alternatives. Default ruleset catches unused imports with zero config. [Ruff Docs](https://docs.astral.sh/ruff/linter/) | High |
| **OpenRewrite** | Framework migrations, deprecated API usage, code cleanup patterns (unnecessary parentheses, simplified expressions) | Java (primary), plus JS/TS via Moderne | CLI, Gradle/Maven plugins, Moderne SaaS | Deterministic, rule-based transformations on Lossless Semantic Trees — no AI randomness. Thousands of prebuilt recipes. [OpenRewrite Docs](https://docs.openrewrite.org/) | High |
| **jscpd** | Duplicate/copy-pasted code blocks | 150+ languages | CLI, CI/CD, CodeClimate engine | Uses Rabin-Karp algorithm for duplication search. Latest version 4.0.8. [jscpd](https://github.com/kucherenko/jscpd) | High |
| **eslint-plugin-unused-imports** | Unused imports and variables in JS/TS with autofix | JavaScript, TypeScript | ESLint plugin (CI/CD, IDE) | Separates unused-vars from unused-imports concerns; auto-removes unused imports on save. [npm](https://www.npmjs.com/package/eslint-plugin-unused-imports) | High |
| **depcheck** | Unused npm dependencies, missing dependencies | JavaScript, TypeScript | CLI | Now in maintenance mode; its README recommends switching to Knip for modern projects. [depcheck GitHub](https://github.com/depcheck/depcheck) | Medium |
| **SonarQube** | Security vulnerabilities, code smells, complexity, duplications; AI Code Assurance auto-detects AI-generated code | Java, JS/TS, Python, C#, C++, HTML, CSS | CI/CD, IDE (SonarLint), MCP Server for agent integration | Since v2025.1 auto-detects AI-generated code by default. AI CodeFix generates LLM-powered fixes. SonarQube 2026.1 adds MCP Server for agentic analysis. [SonarQube AI Code Assurance](https://www.sonarsource.com/resources/library/how-to-guide-for-ai-code-assurance/) | High |
| **CodeAnt AI** | Dead classes, methods, imports, variables, unused exports/files, anti-patterns, duplicates | Python, JavaScript (Java/Go coming) | GitHub/BitBucket PR integration, IDE | Auto-generated 10,000 docstrings and fixed 1,200 issues in one week for one customer. [CodeAnt AI](https://docs.codeant.ai/control_center/dead_code) | Medium |
| **CleanAI** | Unused functions, dead imports, orphaned files, deprecated code | TypeScript/JavaScript (primary) | Web scanner, CI/CD PR integration, Cursor/VS Code/Windsurf | Specifically marketed for AI-assisted coding cleanup ("AI writes fast, but leaves a mess"). Free tier: 5 scans/month. [CleanAI](https://www.cleanai.pro/) | Medium |
| **Byteable** | Dead code, duplicates, unused imports, redundant logic, outdated/vulnerable packages, inconsistent async patterns | JavaScript, TypeScript | CI/CD (GitHub, Azure DevOps, Jenkins); SaaS/VPC/on-prem | Full autonomy level; generates human-readable diffs with explanations. [Byteable Blog](https://byteable.ai/blog/best-tools-for-autonomous-javascript-codebase-cleanup-2025) | Medium |
| **Moderne** | Syntax upgrades, dependency migrations, framework-specific refactors via OpenRewrite recipes | Java, JS/TS | Multi-repo CLI, CI/CD | Deterministic pattern-based transforms — not generative AI. Predictable, auditable. [Moderne](https://www.moderne.ai/technology) | High |
| **Qodo** | Context-aware refactoring, auto-generates tests to validate refactors maintain functionality | Multiple (JS/TS focus) | VPC/SaaS, RAG + multi-agent orchestration | 81% of teams using AI-powered review see quality improvements vs 55% without. [Qodo Report](https://www.qodo.ai/reports/state-of-ai-code-quality/) | Medium |
| **Meta SCARF** | Dead code at symbol-level granularity via combined static + dynamic analysis | Java, Objective-C, JS, Hack, Python | Internal (not open-source) | Deleted 100M+ lines across 370K change requests over 5 years. Analyzing complete dependency cycles yielded ~50% more dead code found. [Meta Engineering Blog](https://engineering.fb.com/2023/10/24/data-infrastructure/automating-dead-code-cleanup/) | High |

### The AI Slop Problem is Quantified and Growing

Qodo's State of AI Code Quality report found that 25% of developers estimate roughly 1 in 5 AI-generated suggestions contain factual errors or misleading code, while 44% of those experiencing quality degradation blame missing context as the root cause. [Qodo Report](https://www.qodo.ai/reports/state-of-ai-code-quality/) Augment Code identified 8 distinct failure patterns in AI-generated code, including hallucinated APIs, security vulnerabilities that pass functional tests (affecting 45% of AI-generated code), performance anti-patterns, and over-engineered error handling that assumes happy paths. [Augment Code Guide](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes)

### Static Analysis Layer: The Foundation

The most effective first line of defense uses deterministic, non-AI static analysis tools. For JavaScript/TypeScript codebases, **Knip** is the clear leader — it supersedes both ts-prune and depcheck, uses fine-grained entry-point analysis with 100+ framework plugins, and catches unused files, exports, and dependencies in one pass. [Knip](https://knip.dev/) For Python, the combination of **Ruff** (for fast autofix of unused imports and style issues) and **Vulture** (for deeper dead code detection with confidence scoring) provides comprehensive coverage. [Ruff Docs](https://docs.astral.sh/ruff/linter/) [Vulture GitHub](https://github.com/jendrikseipp/vulture) For Java ecosystems, **OpenRewrite** recipes provide deterministic, style-preserving transformations that can clean up deprecated API usage and unnecessary complexity at scale — critically, without introducing the randomness of generative AI. [OpenRewrite Docs](https://docs.openrewrite.org/) Cross-language duplicate detection via **jscpd** (150+ languages, Rabin-Karp algorithm) catches the boilerplate inflation that AI coding agents frequently produce. [jscpd GitHub](https://github.com/kucherenko/jscpd)

### AI-Assisted Refactoring Layer: Emerging but Caution Required

A newer class of tools uses AI itself to clean up AI-generated code. **SonarQube** (2025.1+) now auto-detects AI-generated code and applies heightened scrutiny, with its 2026.1 MCP Server enabling coding agents to query SonarQube for real-time quality checks during generation. [SonarQube 2026.1](https://www.almtoolbox.com/blog/sonarqube-2026-1-release/) **Byteable** and **Qodo** represent "full autonomy" refactoring agents that generate diffs with explanations and auto-create tests to validate that refactors preserve behavior. [Byteable Blog](https://byteable.ai/blog/best-tools-for-autonomous-javascript-codebase-cleanup-2025) However, confidence in shipping unreviewed AI-refactored code remains low across developer populations — human oversight is still essential. [Qodo Report](https://www.qodo.ai/reports/state-of-ai-code-quality/)

### Hallucinated Dependency Detection: A Critical Gap

"Slopsquatting" — where AI agents hallucinate package names that attackers then register — is an emerging threat. Between 25-38% of AI-generated code relies on deprecated APIs, and nearly 20% of suggested package dependencies point to nonexistent libraries. [Trend Micro on Slopsquatting](https://www.trendmicro.com/vinfo/us/security/news/cybercrime-and-digital-threats/slopsquatting-when-ai-agents-hallucinate-malicious-packages) The recommended mitigation is configuring static analysis to flag unknown imports and running live package registry verification as part of the generation pipeline. [Augment Code Guide](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes)

### Recommended Harness Engineer Workflow

For harness engineers building coding agent pipelines, a layered post-hoc cleanup workflow should include:
- **Gate 1**: Fast deterministic linting (Ruff/ESLint with unused-imports plugin) — catches hallucinated imports, unused variables, style violations in seconds
- **Gate 2**: Deep dead code analysis (Knip for JS/TS, Vulture for Python) — catches unused exports, orphaned files, unreachable code
- **Gate 3**: Duplicate detection (jscpd) — catches boilerplate inflation and copy-paste patterns
- **Gate 4**: Dependency audit (Knip or depcheck for npm, pip-audit for Python) — catches hallucinated and vulnerable dependencies
- **Gate 5**: AI-powered review (SonarQube with AI Code Assurance, or Qodo) — catches semantic issues that static analysis misses, with human approval required

Meta's SCARF system demonstrates that combining static and dynamic analysis at symbol-level granularity (rather than file-level) yields ~50% more dead code detection, suggesting that harness engineers should prefer tools operating at export/function granularity over file-level scanners. [Meta Engineering Blog](https://engineering.fb.com/2023/10/24/data-infrastructure/automating-dead-code-cleanup/)

## Key Unknowns

- **Benchmarks comparing tools on AI-generated code specifically**: No published benchmark compares how well these tools perform on code produced by AI agents vs. human-written code.
- **CleanAI and Byteable maturity**: These newer tools are marketed specifically for AI code cleanup but have limited independent reviews or third-party evaluations.
- **Comment/documentation slop detection**: No tool specifically targets verbose or redundant comments — a common AI slop pattern.
- **Over-engineering / unnecessary abstraction detection**: While complexity metrics exist, no tool specifically detects "premature abstraction" or "unnecessary design pattern application."
- **Meta's SCARF is not open-source**: The most impressive results (100M+ lines deleted) come from an internal tool not available externally.
- **LLM-aided debloating**: A 2025 IEEE TSE paper on "Large Language Models-aided program debloating" exists but the specific techniques and results were not accessible through web search.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 14+
