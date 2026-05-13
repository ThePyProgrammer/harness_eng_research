# Research Report: De-Sloppification of AI-Generated Code

*Generated: 2026-03-16*
*Research scope: Code-specific slop in AI coding agent output — taxonomy, prevention (pre-hoc), detection during generation (ad-hoc), and cleanup (post-hoc), mapped to the SDD ontology for harness engineers.*

---

## Executive Summary

AI-generated code now constitutes ~41% of production code but introduces 1.7x more quality issues than human-written code, with specific multipliers of 2.74x for security vulnerabilities and ~8x for I/O performance problems. "Slop" — structurally plausible but low-quality code that passes CI while cumulatively degrading codebase health — has emerged as the defining quality challenge of AI-assisted development. This report identifies 18 distinct slop types organized by severity, catalogs 25 pre-hoc prevention techniques mapped to SDD ontology stages, documents ad-hoc detection mechanisms including Spotify's LLM-as-Judge (which vetoes 25% of agent sessions), and evaluates 14 post-hoc cleanup tools. The central finding: **verification infrastructure is the decisive factor** — teams with proper verification see 81% quality improvement vs. 59% without, a 22-point gap that represents the harness engineer's primary lever.

---

## Key Findings

1. **AI slop differs fundamentally from human code quality issues** — it is "plausible enough to continue" while cumulatively degrading architectural coherence, unlike human bad code which is usually obviously bad. [Without Guardrails, AI Coding Turns Into Chaos](https://dev.to/naysmith/without-guardrails-ai-coding-turns-into-chaos-3l7j)

2. **18 distinct slop types identified**, ranging from CRITICAL (hallucinated imports, security vulnerabilities) to LOW (naming drift, verbose comments). Three open-source scoring tools exist: AI-SLOP-Detector, KarpeSlop, and Desloppify. [KarpeSlop](https://github.com/CodeDeficient/KarpeSlop) | [AI-SLOP-Detector](https://github.com/flamehaven01/AI-SLOP-Detector) | [Desloppify](https://github.com/peteromallet/desloppify)

3. **LLM-generated AGENTS.md files hurt performance** — ETH Zurich study across 5,694 PRs found they decrease success by 3% while increasing cost by 20%. Only non-inferable, command-oriented rules help. [InfoQ](https://www.infoq.com/news/2026/03/agents-context-file-value-review/)

4. **"Success is silent" is the cardinal rule of back-pressure** — running full test suites after every agent action caused 4,000+ lines of context pollution; only surfacing errors preserves agent focus. [HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

5. **Spotify's LLM-as-Judge vetoes 25% of agent sessions**, with the agent course-correcting ~50% of the time. The most common veto: scope expansion beyond the original prompt. [Spotify Engineering](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)

6. **TDD is "a fantastic fit for coding agents"** — writing tests before code prevents the failure mode where agents write tests that verify broken behavior. [Simon Willison](https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/)

7. **"Slopsquatting" is an emerging security threat** — ~20% of AI-suggested package dependencies point to nonexistent libraries, which attackers can register. [Trend Micro](https://www.trendmicro.com/vinfo/us/security/news/cybercrime-and-digital-threats/slopsquatting-when-ai-agents-hallucinate-malicious-packages)

8. **None of the 6 SDD frameworks explicitly target "slop"** — anti-slop features are uniformly framed as "preventing context rot" or "quality assurance," suggesting the concept has not yet been formalized in harness engineering.

---

## Detailed Analysis

### 1. What Is Code Slop?

"Slop" was named Merriam-Webster's 2025 Word of the Year, defined as "digital content of low quality that is produced usually in quantity by means of artificial intelligence" [TechCrunch](https://techcrunch.com/2025/12/15/merriam-webster-names-slop-the-word-of-the-year/). Academic research identifies three prototypical properties: **superficial competence** (it looks right), **asymmetric effort** (easy to produce, hard to verify), and **mass producibility** [MINT Lab](https://mintresearch.org/reports/ai-slop/).

The fundamental difference from human code quality issues is **plausibility masking incoherence**. Human bad code is usually obviously bad — visible corner-cutting under deadline pressure. AI slop is "individually defensible" but produces aggregate architectural rot. Human friction (code reviews, hallway conversations) naturally caught incremental drift; AI's speed eliminates that protective pause [Without Guardrails](https://dev.to/naysmith/without-guardrails-ai-coding-turns-into-chaos-3l7j).

**Context blindness** is the root cause. AI generates code "regardless of whether the correct function, pattern, or abstraction already exists" [Dev.to](https://dev.to/alex_aslam/ai-is-your-copilot-not-your-architect-a-senior-developers-guide-to-prompt-engineering-for-code-2e75). If the context window is incomplete, the agent reinvents rather than reuses.

**Uniquely AI artifacts** include hallucinated imports (commercial models: ~5.2%, open-source: ~21.7%), cross-language contamination, and silent scope expansion [Augment Code](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes).

#### Slop Taxonomy by Severity

| Severity | Slop Types |
|----------|-----------|
| **CRITICAL** | Hallucinated imports / phantom packages; Security vulnerabilities that look functional |
| **HIGH** | Placeholder/stub code; Duplicate logic proliferation; Happy-path error handling; Meaningless tests; Data model mismatches |
| **MEDIUM-HIGH** | Over-engineering / premature abstraction; Outdated API / deprecated usage; Architectural integrity erosion |
| **MEDIUM** | Boilerplate inflation; Silent scope expansion; Cross-language contamination; God functions; Dead code; Lint suppression |
| **LOW-MEDIUM** | Redundant / verbose comments; Naming / convention drift |

Sources: [KarpeSlop](https://github.com/CodeDeficient/KarpeSlop), [AI-SLOP-Detector](https://github.com/flamehaven01/AI-SLOP-Detector), [Augment Code](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes), [Sentry Playbook](https://develop.sentry.dev/sdk/getting-started/playbooks/development/reviewing-ai-generated-code/), [CodeRabbit](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)

#### Quantitative Scoring

**AI-SLOP-Detector** scores files on three metrics [AI-SLOP-Detector](https://github.com/flamehaven01/AI-SLOP-Detector):
- **LDR** (Logic Density Ratio): `logic_lines / total_lines` (weight: 0.40)
- **ICR** (Inflation): `jargon_density × complexity_modifier` (weight: 0.30)
- **DDC** (Dependency Check): `used_imports / total_imports` (weight: 0.20)
- Thresholds: <30 CLEAN, 30-49 SUSPICIOUS, 50-69 INFLATED, 70+ CRITICAL

#### The Numbers

- AI generates ~41% of production code but increases churn by 20% [CodeRabbit](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- Change failure rates rose ~30% with AI adoption [CodeRabbit](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- 65-75% of AI functions contain security vulnerabilities in benchmarks [Dev.to](https://dev.to/the_nortern_dev/the-most-valuable-skill-in-2026-isnt-writing-code-it-is-deleting-it-53j1)
- 71% of developers do not merge AI code without manual review [NetCorp](https://www.netcorpsoftwaredevelopment.com/blog/ai-generated-code-statistics)

---

### 2. The Three-Stage Defense Model

#### Stage 1: Pre-Hoc Prevention (Before Generation)

**At S1 (Init)** — Keep CLAUDE.md under 60 lines. Anthropic: *"For each line, ask: 'Would removing this cause Claude to make mistakes?' If not, cut it."* [Anthropic Best Practices](https://code.claude.com/docs/en/best-practices). The ETH Zurich study (138 repos, 5,694 PRs) found LLM-generated context files decrease success by 3% and increase cost by 20% [InfoQ](https://www.infoq.com/news/2026/03/agents-context-file-value-review/).

**At S2 (Governing Principles)** — Structure constraints as Always / Ask First / Never tiers [O'Reilly](https://www.oreilly.com/radar/how-to-write-a-good-spec-for-ai-agents/). Add explicit anti-over-engineering directives: `Prefer the smallest viable diff; do not refactor unrelated code` [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/). Use commands over prose — tool mentions increase tool usage from 0.01 to 1.6 times per task [DEV Community](https://dev.to/alexefimenko/i-analyzed-a-lot-of-ai-agent-rules-files-most-are-making-your-agent-worse-2fl).

**At S3-S4 (Requirements/Discussion)** — Spec-driven development provides guardrails: once you have a spec, "the agent can execute without feedback" [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/). Separate planning from implementation with Plan Mode [Anthropic](https://code.claude.com/docs/en/best-practices). Include explicit non-goals [Blake Crosley](https://blakecrosley.com/blog/agents-md-patterns).

**At S6-S7 (Architecture/Tasks)** — Point to exemplar files: "Examples beat abstractions" [Anthropic](https://code.claude.com/docs/en/best-practices). Break complex tasks into chained prompts; delegate investigations to subagents [Anthropic](https://code.claude.com/docs/en/best-practices).

#### Stage 2: Ad-Hoc Detection (During Generation)

**Deterministic back-pressure** is the strongest mechanism. Run linters/type-checkers with the "success is silent" principle — only surface errors [HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents). Claude Code hooks provide this via PostToolUse (matcher: `Write|Edit`) and Stop hooks with exit code 2 [Claude Code Hooks](https://code.claude.com/docs/en/hooks). Spotify's Honk uses auto-activating "verifiers" based on codebase contents [Spotify](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3).

**LLM-as-Judge** adds a heuristic layer. Spotify's judge vetoes ~25% of sessions; most common trigger is scope expansion [Spotify](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3).

**TDD enforcement** prevents agents from writing tests that verify broken behavior. Techniques: run agent from `/tests` directory, auto-delete code before tests, confirm test failure before implementation [Simon Willison](https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/) [TDD Guide](https://elite-ai-assisted-coding.dev/p/guide-ai-agents-through-test-driven-development).

**Self-refine loops** work on average (30% error reduction) but have critical failure modes: reward hacking, oscillation, mode collapse, context overload [Ralph Wiggum Loop](https://beuke.org/ralph-wiggum-loop/) [Addy Osmani](https://addyosmani.com/blog/self-improving-agents/).

**Context pollution**: CP = 1 - S(anchor, current). A 2% early misalignment can cause 40% failure by chain end [Context Pollution](https://kurtiskemple.com/blog/measuring-context-pollution/). Aggressive `/clear` between tasks is essential [Anthropic](https://code.claude.com/docs/en/best-practices).

#### Stage 3: Post-Hoc Cleanup (After Generation)

A five-gate layered workflow:

| Gate | Tool (JS/TS) | Tool (Python) | Tool (Java) | Catches |
|------|-------------|---------------|-------------|---------|
| 1. Fast lint | ESLint + unused-imports | Ruff (`--fix`) | — | Hallucinated imports, unused vars |
| 2. Dead code | Knip | Vulture | OpenRewrite | Unused exports, orphaned files |
| 3. Duplicates | jscpd | jscpd | jscpd | Boilerplate inflation |
| 4. Dependencies | Knip | pip-audit | OWASP dep-check | Phantom packages, vulnerabilities |
| 5. AI review | SonarQube (MCP) | SonarQube | SonarQube | Semantic issues, complexity |

Leading tools: Knip (JS/TS, 100+ framework plugins) [Knip](https://knip.dev/), Ruff (Python, 10-100x faster) [Ruff](https://docs.astral.sh/ruff/linter/), OpenRewrite (Java, deterministic LST transforms) [OpenRewrite](https://docs.openrewrite.org/). SonarQube 2026.1 adds MCP Server for agent integration [SonarQube](https://www.sonarsource.com/resources/library/how-to-guide-for-ai-code-assurance/).

Meta's SCARF: 100M+ lines deleted over 5 years using symbol-level analysis (~50% more detection than file-level) [Meta](https://engineering.fb.com/2023/10/24/data-infrastructure/automating-dead-code-cleanup/).

---

### 3. How SDD Frameworks Address Slop

None of the 6 frameworks explicitly use the term "slop."

| Framework | Primary Anti-Slop Mechanism | Philosophy | Type |
|---|---|---|---|
| **GSD** | Fresh 200K context per task; plan-checker; verify-work UAT | Context hygiene + verification | Explicit |
| **OpenSpec** | Spec compartmentalization; task checklists | Spec rigor → quality as side-effect | Implicit |
| **Spec Kit** | constitution.md; /analyze cross-checking; /checklist | Constitutional governance | Explicit |
| **Kiro** | Steering files; agent hooks on file save | Event-driven enforcement | Explicit |
| **BMAD** | Developer as "obedient craftsman"; code exclusion zones | Role constraints | Explicit |
| **Taskmaster** | Complexity scoring (1-10); dependency validation | Complexity-aware decomposition | Mix |

**Strongest anti-slop mechanisms by stage:**
- S2 (Principles): Spec Kit (constitution.md), Kiro (steering files), BMAD (Control Manifest)
- S7 (Tasks): Spec Kit (/analyze), GSD (plan-checker), BMAD (epic sharding)
- S8 (Execution): GSD (fresh context), Kiro (hooks), BMAD (halt-and-report)
- S9 (Verification): GSD (verify-work), Spec Kit (checklist), BMAD (pre-commit gate)

Sources: [GSD GitHub](https://github.com/gsd-build/get-shit-done), [Spec Kit GitHub](https://github.com/github/spec-kit), [Kiro Docs](https://kiro.dev/docs/hooks/), [BMAD Guide](https://redreamality.com/garden/notes/bmad-method-guide/), [OpenSpec GitHub](https://github.com/Fission-AI/OpenSpec), [Taskmaster GitHub](https://github.com/eyaltoledano/claude-task-master)

**Notable contrast**: Superpowers enforces the most aggressive stance — mandatory TDD where code before tests is automatically deleted [Superpowers](https://github.com/obra/superpowers).

---

### 4. Tooling Gaps

Two major slop types have **no dedicated detection tooling**:

1. **Over-engineering / premature abstraction** — Cyclomatic complexity is too coarse. No tool detects "factory pattern for a single implementation."

2. **Verbose / redundant comments** — No tool targets comment quality. `// This function adds two numbers` above `function add(a, b)` has zero automated detection.

No benchmark exists comparing tool effectiveness on AI-generated code specifically versus human-written code.

---

## Comparisons & Trade-offs

### Prevention vs. Cleanup: Where to Invest

| Dimension | Pre-Hoc | Ad-Hoc | Post-Hoc |
|-----------|---------|--------|----------|
| **Cost** | Cheapest (config) | Medium (hooks+tools) | Most expensive |
| **Effectiveness** | High for known types | High for deterministic | High for measurable |
| **Coverage** | Cannot prevent all | Limited by context efficiency | Cannot fix architectural rot |
| **Best for** | Over-engineering, scope creep | Imports, formatting | Dead code, duplicates, deps |

### Context Efficiency Tradeoff

| Approach | Context Cost | Recommendation |
|----------|-------------|----------------|
| Full test suite every action | 4,000+ lines (destructive) | Never |
| Linter on every Write/Edit | Low (errors only) | Recommended |
| Type checker on Stop only | Zero during work | Acceptable |
| LLM-as-Judge on every PR | ~tokens per review | Where budget allows |

---

## Confidence Assessment

### High Confidence
- AI code produces 1.7x more issues, 2.74x more security vulnerabilities (CodeRabbit, 470 PRs)
- ETH Zurich: LLM-generated AGENTS.md hurts performance (138 repos, 5,694 PRs)
- "Success is silent" principle (independently confirmed by HumanLayer, Spotify, Anthropic)
- Spotify LLM-as-Judge vetoes 25% of sessions (1,500+ merged PRs)
- TDD as effective anti-slop for agents (Simon Willison, multiple sources)
- Knip, Ruff, Vulture, OpenRewrite effectiveness (widespread adoption)
- Claude Code hooks and exit code semantics (official documentation)
- Meta SCARF: 100M+ lines deleted (engineering blog with detailed methodology)

### Medium Confidence
- Context pollution formula CP = 1 - S(anchor, current) (single source)
- Self-refinement cuts errors by 30% (vendor blog, not independently verified)
- Teams with verification see 81% vs 59% quality improvement (Qodo vendor report)
- AI generates ~41% of production code (single report)
- 65-75% of AI functions contain security vulnerabilities (dev community post)
- CleanAI, Byteable, CodeAnt AI effectiveness (limited independent reviews)

### Low Confidence / Unresolved
- **Interaction effects between prevention layers** — no study on combining hooks + CLAUDE.md + spec-driven + TDD
- **Model-specific slop profiles** — hallucination rates vary 5.2-21.7% but no mapping per model
- **Optimal hook frequency** — no guidance on per-edit vs. Stop-only linting
- **Over-engineering detection** — no tool exists; problem real but unsolved
- **Comment slop detection** — no tool targets verbose/redundant comments
- **Longitudinal architectural rot** — no controlled study on degradation rate

---

## Recommendations for Harness Engineers

### Immediate Actions (This Week)

1. **Audit your CLAUDE.md** — Cut to <60 lines. Remove self-evident instructions and repository structure descriptions. Keep only non-inferable commands.

2. **Add three anti-slop rules**:
   ```
   Prefer the smallest viable diff; do not refactor unrelated code.
   Do not add abstractions, helpers, or utilities for one-time operations.
   Do not add comments unless the logic is non-obvious.
   ```

3. **Install a PostToolUse hook** for formatting/linting:
   ```json
   {
     "hooks": {
       "PostToolUse": [{
         "matcher": "Write|Edit",
         "hooks": [{"type": "command", "command": "npx prettier --write $FILE && npx eslint --fix $FILE", "timeout": 30}]
       }]
     }
   }
   ```

4. **Install a Stop hook** for type checking:
   ```bash
   #!/bin/bash
   if ! npx tsc --noEmit 2>/dev/null; then
     echo "Type errors detected. Fix before stopping." >&2
     exit 2
   fi
   ```

### Medium-Term Actions (This Month)

5. **Adopt spec-driven development** — Use OpenSpec, Spec Kit, or equivalent to capture requirements before code generation.

6. **Set up post-hoc cleanup gates** — Add Knip (JS/TS) or Vulture+Ruff (Python) to CI. Run jscpd for duplicates. Consider SonarQube with AI Code Assurance.

7. **Enforce TDD in skills/prompts** — Write tests first, confirm they fail (red), then implement (green).

8. **Separate writer and reviewer sessions** — Fresh context for code review avoids self-bias.

### Strategic Actions (This Quarter)

9. **Evaluate framework anti-slop coverage** against the ontology matrix — identify which stages lack quality gates.

10. **Build slop-specific metrics** — Track LDR, DDC, and lint suppression count as leading indicators.

11. **Monitor for slopsquatting** — Add package registry verification to dependency audit.

---

## Sources

### Primary Sources — Tools & Frameworks
- [Knip](https://knip.dev/) — JS/TS dead code detection, supersedes ts-prune + depcheck
- [Ruff](https://docs.astral.sh/ruff/linter/) — Python linter/formatter, 10-100x faster
- [Vulture](https://github.com/jendrikseipp/vulture) — Python dead code finder with confidence scoring
- [OpenRewrite](https://docs.openrewrite.org/) — Java deterministic refactoring via Lossless Semantic Trees
- [jscpd](https://github.com/kucherenko/jscpd) — Cross-language duplicate detection (150+ languages)
- [SonarQube AI Code Assurance](https://www.sonarsource.com/resources/library/how-to-guide-for-ai-code-assurance/) — AI-generated code auto-detection
- [KarpeSlop](https://github.com/CodeDeficient/KarpeSlop) — AI slop linter (Noise/Lies/Soul axes)
- [AI-SLOP-Detector](https://github.com/flamehaven01/AI-SLOP-Detector) — Quantitative slop scoring (LDR/ICR/DDC)
- [Desloppify](https://github.com/peteromallet/desloppify) — Mechanical + LLM-based slop cleanup

### Primary Sources — Research & Data
- [CodeRabbit: State of AI vs Human Code](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report) — 470 PR study, 1.7x issue multiplier
- [MINT Lab: AI Slop Definitions](https://mintresearch.org/reports/ai-slop/) — Academic definition framework
- [ETH Zurich AGENTS.md Study](https://www.infoq.com/news/2026/03/agents-context-file-value-review/) — 138 repos, 5,694 PRs
- [Spotify Honk Feedback Loops](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3) — LLM-as-Judge, 1,500+ PRs
- [Meta SCARF](https://engineering.fb.com/2023/10/24/data-infrastructure/automating-dead-code-cleanup/) — 100M+ lines deleted
- [Qodo State of AI Code Quality](https://www.qodo.ai/reports/state-of-ai-code-quality/) — 81% vs 55% quality improvement

### Primary Sources — Harness Engineering Guidance
- [Anthropic: Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices) — CLAUDE.md guidance, Plan Mode, verification
- [Anthropic: Effective Harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — JSON feature lists, e2e testing
- [Anthropic: Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Tool design, token efficiency
- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks) — PostToolUse, Stop hooks, exit codes
- [HumanLayer: Skill Issue](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — Six levers, "success is silent"

### Secondary Sources — Practitioner Guides
- [Addy Osmani: Self-Improving Coding Agents](https://addyosmani.com/blog/self-improving-agents/) — Stateless iteration, atomic tasks
- [Simon Willison: Red/Green TDD](https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/) — TDD as anti-slop
- [GitHub Blog: Great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — Anti-over-engineering directives
- [GitHub Blog: Spec-Driven Development](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — Spec Kit as quality contract
- [Blake Crosley: AGENTS.md Patterns](https://blakecrosley.com/blog/agents-md-patterns) — Diff budgets, non-goals
- [O'Reilly: Good Spec for AI Agents](https://www.oreilly.com/radar/how-to-write-a-good-spec-for-ai-agents/) — Always/Ask First/Never tiers
- [Ralph Wiggum Loop](https://beuke.org/ralph-wiggum-loop/) — Self-refine with failure modes
- [Beyond the Vibes](https://blog.tedivm.com/guides/2026/03/beyond-the-vibes-coding-assistants-and-agents/) — CI gate non-negotiables
- [Augment Code: 8 Failure Patterns](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes) — Hallucinated APIs, security
- [Sentry: Reviewing AI-Generated Code](https://develop.sentry.dev/sdk/getting-started/playbooks/development/reviewing-ai-generated-code/) — Production playbook
- [Trend Micro: Slopsquatting](https://www.trendmicro.com/vinfo/us/security/news/cybercrime-and-digital-threats/slopsquatting-when-ai-agents-hallucinate-malicious-packages) — Supply chain attacks
- [Measuring Context Pollution](https://kurtiskemple.com/blog/measuring-context-pollution/) — CP formula
- [DEV: Rules Files Analysis](https://dev.to/alexefimenko/i-analyzed-a-lot-of-ai-agent-rules-files-most-are-making-your-agent-worse-2fl) — Commands vs prose
- [Agentic AI Prompting](https://ranthebuilder.cloud/blog/agentic-ai-prompting-best-practices-for-smarter-vibe-coding/) — Positive instructions
- [TDD Guide for AI Agents](https://elite-ai-assisted-coding.dev/p/guide-ai-agents-through-test-driven-development) — Red/green enforcement
- [Composio: Claude Code Skills](https://composio.dev/content/top-claude-skills) — Conditional skill loading
- [Pre-commit hooks and AI](https://briandouglas.me/posts/2025/08/27/pre-commit-hooks-are-back-thanks-to-ai) — Reframed for agents
- [Qodo: Verification Layer](https://www.qodo.ai/blog/building-the-verification-layer-how-implementing-code-standards-unlock-ai-code-at-scale/) — 81% improvement data
- [ReVeal: Self-Evolving Code Agents](https://arxiv.org/html/2506.11442v1) — Generation-verification RL

### Secondary Sources — Framework Documentation
- [GSD GitHub](https://github.com/gsd-build/get-shit-done) — Fresh context, plan-checker, verify-work
- [GSD-2 GitHub](https://github.com/gsd-build/gsd-2) — Programmatic context control
- [codecentric GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system)
- [OpenSpec GitHub](https://github.com/Fission-AI/OpenSpec) — Spec compartmentalization
- [Spec Kit GitHub](https://github.com/github/spec-kit) — Constitution, analyze, checklist
- [Kiro Docs: Hooks](https://kiro.dev/docs/hooks/) — Agent hooks, steering files
- [Kiro Hook Examples](https://kiro.dev/docs/hooks/examples/) — Code quality enforcer
- [BMAD GitHub](https://github.com/bmad-code-org/BMAD-METHOD) — Role constraints, epic sharding
- [BMAD Guide](https://redreamality.com/garden/notes/bmad-method-guide/) — Developer as obedient craftsman
- [Applied BMAD](https://bennycheung.github.io/bmad-reclaiming-control-in-ai-dev) — Code exclusion zones
- [Taskmaster GitHub](https://github.com/eyaltoledano/claude-task-master) — Complexity analysis
- [Taskmaster Capabilities](https://www.sidetool.co/post/taskmaster-ai-capabilities-streamline-your-development-workflows/) — Test coverage
- [Superpowers GitHub](https://github.com/obra/superpowers) — Mandatory TDD enforcement
- [Anthropic Engineering Blog](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Harness design principles
- [Byteable Blog](https://byteable.ai/blog/best-tools-for-autonomous-javascript-codebase-cleanup-2025) — Autonomous cleanup
- [CleanAI](https://www.cleanai.pro/) — AI code cleanup tool
- [CodeAnt AI](https://docs.codeant.ai/control_center/dead_code) — Dead code detection
- [Moderne](https://www.moderne.ai/technology) — OpenRewrite at scale
- [eslint-plugin-unused-imports](https://www.npmjs.com/package/eslint-plugin-unused-imports) — Autofix unused imports
- [depcheck](https://github.com/depcheck/depcheck) — Unused npm dependencies
- [Agent Instruction Patterns](https://elements.cloud/blog/agent-instruction-patterns-and-antipatterns-how-to-build-smarter-agents/) — Positive vs negative
- [SD Times: Cost of AI Slop](https://sdtimes.com/ai/the-cost-of-ai-slop-in-lines-of-code/) — Industry framing
- [AI-Generated Code Statistics 2026](https://www.netcorpsoftwaredevelopment.com/blog/ai-generated-code-statistics) — Developer trust data
- [Without Guardrails](https://dev.to/naysmith/without-guardrails-ai-coding-turns-into-chaos-3l7j) — Plausibility masking
- [Merriam-Webster: Slop](https://techcrunch.com/2025/12/15/merriam-webster-names-slop-the-word-of-the-year/) — Word of the Year 2025
- [SonarQube 2026.1](https://www.almtoolbox.com/blog/sonarqube-2026-1-release/) — MCP Server
- [OpenSpec SDD](https://recca0120.github.io/en/2026/03/08/openspec-sdd/) — Task checklist
- [SDD Comparison](https://redreamality.com/blog/-sddbmad-vs-spec-kit-vs-openspec-vs-promptx/) — Framework cross-reference
