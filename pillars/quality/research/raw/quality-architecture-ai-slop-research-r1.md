# Empirical Landscape of AI-Generated Code Quality (2024-2026)

Research compiled: 2026-04-03

---

## 1. CodeRabbit: State of AI vs Human Code Generation (December 2025)

**Source**: [CodeRabbit Blog](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report) / [BusinessWire press release](https://www.businesswire.com/news/home/20251217666881/en/CodeRabbits-State-of-AI-vs-Human-Code-Generation-Report-Finds-That-AI-Written-Code-Produces-1.7x-More-Issues-Than-Human-Code)

### Methodology
- **Sample**: 470 real-world open-source GitHub pull requests
- **Breakdown**: 320 AI-co-authored PRs, 150 human-only PRs
- **Analysis tool**: CodeRabbit's structured issue taxonomy
- **Metric**: Issues per 100 PRs, using statistical rate ratios

### Key Findings

| Category | AI vs Human Ratio |
|---|---|
| Overall issues per PR | 1.68x (10.83 vs 6.45) |
| Logic and correctness | 1.75x |
| Readability | 3.0x |
| Error handling / exception paths | ~2.0x |
| Security issues (aggregate) | up to 2.74x |
| Concurrency and dependency correctness | ~2.0x |
| Formatting problems | 2.66x |
| Naming inconsistencies | ~2.0x |
| Excessive I/O operations | ~8.0x |

**Severity distribution**: Critical and major defects appear 1.4-1.7x more frequently in AI-authored PRs.

**Security-specific breakdown**:
- Improper password handling: 1.88x
- Insecure object references: 1.91x
- XSS vulnerabilities: 2.74x
- Insecure deserialization: 1.82x

### Limitations and Caveats
- The researchers explicitly acknowledge they "cannot guarantee all the PRs we labelled as human authored were actually authored only by humans," relying on co-authorship signals to identify AI contributions.
- All 470 PRs were from open-source repositories, which may not represent enterprise codebases.
- CodeRabbit is itself an AI code review tool; the study was conducted by a company with a commercial interest in demonstrating the need for AI code review.
- Human developers produce the same error types; AI simply generates them at higher volumes. This is a rate difference, not a categorical one.

---

## 2. GitClear: AI Copilot Code Quality Reports (2024 and 2025)

**Sources**: [GitClear 2025 Research](https://www.gitclear.com/ai_assistant_code_quality_2025_research) / [2025 PDF Report](https://gitclear-public.s3.us-west-2.amazonaws.com/GitClear-AI-Copilot-Code-Quality-2025.pdf) / [Report Summary by jonas.rs](https://www.jonas.rs/2025/02/09/report-summary-gitclear-ai-code-quality-research-2025.html)

### Methodology
- **2024 report**: ~153 million changed lines, January 2020 through December 2023
- **2025 report**: 211 million changed lines, January 2020 through December 2024
- **Sources**: Repos owned by Google, Microsoft, Meta, and enterprise C-Corps
- **Classification**: GitClear's proprietary code change operation taxonomy (added, moved, copy/pasted, updated, deleted)
- GitClear has classified approximately 1 billion lines of code over 5 years from commercial customers and popular open-source repos

### The Refactoring Collapse

| Metric | 2020 | 2024 | Change |
|---|---|---|---|
| Code addition (% of changes) | 39% | 46% | +7 pp |
| Copy/pasted lines (% of changes) | 8.3% | 12.3% | +48% relative |
| Refactored (moved) lines (% of changes) | 24.1% | 9.5% | -14.6 pp |
| Code churn (new code revised within 2 weeks) | 3.1% | 5.7% | +84% relative |
| All new code revised within 2 weeks | 5.5% | 7.9% | +44% relative |
| Long-lived code (revised 30+ days later) | 30% | 20% | -10 pp |

### Code Cloning
- Duplicated code blocks (5+ duplicated lines) rose **eightfold** compared to pre-AI baselines by 2024.
- For the first time in the dataset's history, developers are pasting code more often than they are refactoring or reusing it.
- Reference finding: "57.1% of co-changed cloned code was involved in bugs" (cited 2023 study on clone-related defects).

### Correlated Metric
- Google DORA correlation: 7.2% decrease in delivery stability per 25% increase in AI adoption rate (cited in the report).

### Limitations and Caveats
- Correlation, not causation. GitClear cannot definitively attribute code quality changes to AI tool adoption; other industry trends (remote work, hiring patterns, turnover) may contribute.
- The classification of "moved" vs "copy/pasted" lines depends on GitClear's proprietary heuristics, which are not independently validated.
- The dataset skews toward large tech companies and popular open-source repos; smaller teams may show different patterns.
- The report does not isolate AI-generated code from human-generated code within the same repos; it measures ecosystem-wide trends during the period of AI coding tool adoption.

---

## 3. Qodo: State of AI Code Quality 2025

**Source**: [Qodo Report](https://www.qodo.ai/reports/state-of-ai-code-quality/) / [Full PDF](https://www.qodo.ai/wp-content/uploads/2025/06/2025-State-of-AI-Code-Quality.pdf)

### Methodology
- **Sample**: 609 developers surveyed
- **Period**: 2025
- **Type**: Self-reported survey (perceptions, not measured code outcomes)
- No stated margin of error, confidence intervals, or response rate

### Adoption
- 82% use AI coding tools daily or weekly
- 59% regularly use 3+ AI tools
- 65% report at least 25% of commits are AI-generated or AI-influenced
- 15% say over 80% of their code is AI-influenced

### The Hallucination Quadrant
- 76.4% of developers fall into the "high hallucinations, low confidence" quadrant
- Only 3.8% experience both low hallucinations and high confidence in shipping AI code
- 25% estimate that 1 in 5 AI suggestions contain errors
- Low-hallucination users are 2.5x more likely to ship without review

### Quality Perceptions
- 59% say AI improved code quality; 21% report degradation
- When teams report "considerable" productivity gains, 70% also report better quality (a 3.5x increase over teams without productivity gains)
- With AI review in the loop, quality improvements reach 81% (vs 55% without review)
- Without speed gains, AI-review teams still see double the quality improvement (36% vs 17%)

### Context Problems
- 65% say AI misses context during refactoring
- 60% report context issues with testing/writing
- 54% using manual context selection still experience context misses
- 33% with autonomous selection still experience misses

### Testing
- 27% of non-AI-testing developers feel confident in their test suite
- 61% of AI-testing users feel confident (34-point gap)

### Limitations and Caveats
- Entirely self-reported perceptions; no independent code analysis
- No details on representativeness or sampling frame
- 609 developers is a modest sample for generalizable claims
- The "quality improvement" findings are perceptions, not measured defect rates
- Qodo is an AI code quality company; the survey serves marketing purposes

---

## 4. GitHub Copilot: Productivity and Quality Studies

### 4a. GitHub's RCT on Code Quality (November 2024)

**Source**: [GitHub Blog](https://github.blog/news-insights/research/does-github-copilot-improve-code-quality-heres-what-the-data-says/)

**Methodology**:
- Randomized controlled trial
- Phase 1: 243 developers with 5+ years Python experience; 202 valid submissions (104 with Copilot, 98 without)
- Phase 2: 25 top developers conducted 1,293 blind reviews
- Task: Build API endpoints for a web server evaluated against 10 unit tests

**Results**:
- Functionality: 53.2% greater likelihood of passing all 10 unit tests (p<0.01)
- Readability: 13.6% more lines per error (18.2 vs 16.0 lines per readability error, p=0.002)
- Readability improvement: +3.62% (p=0.003)
- Reliability improvement: +2.94% (p=0.01)
- Maintainability improvement: +2.47% (p=0.041)
- Conciseness improvement: +4.16% (p=0.002)
- Approval rate: 5% more likely to approve (p=0.014)

**Limitations**:
- Funded and conducted by GitHub (the Copilot vendor)
- "Code errors" were defined narrowly as readability issues, excluding functional bugs
- Single task (API endpoints), not representative of diverse development work
- The authors themselves hypothesize other studies failed to find quality improvements "because developers may have lacked the opportunity or incentive to focus on quality"
- Small, controlled environment vs. real-world production conditions

### 4b. GitHub's Productivity Claims (2022-2025)

- "Code up to 55% faster" (original 2022 claim, widely cited)
- Longitudinal study found 26.08% increase in completed tasks for Copilot group
- Copilot acceptance rate: approximately 30% of suggestions accepted
- 20M+ all-time users by mid-2025

---

## 5. Additional Empirical Studies (2024-2026)

### 5a. "Debt Behind the AI Boom" (arxiv, March 2026)

**Source**: [arxiv](https://arxiv.org/html/2603.28592v1)

**Methodology**:
- 6,275 GitHub repositories with 100+ stars
- 304,362 verified AI-authored commits
- Time period: January 2024 to October 2025
- Languages: Python, JavaScript, TypeScript
- Tools studied: GitHub Copilot, Claude, Cursor, Gemini, Devin
- Static analysis before and after each commit to attribute introduced issues

**Total Issues Identified**: 484,606 distinct issues across 3,841 repositories

**Issue Type Breakdown**:
- Code smells: 431,850 (89.1%)
- Runtime bugs: 28,149 (5.8%)
- Security issues: 24,607 (5.1%)

**Commit-Level Defect Rates** (% of commits introducing issues):

| Tool | % Commits with Issues | Avg Issues per Commit |
|---|---|---|
| GitHub Copilot | 17.3% | not specified separately |
| Claude | 18.7% | 1.96 (highest) |
| Cursor | 27.4% | not specified separately |
| Gemini | 28.7% | not specified separately |
| Devin | 19.2% | 0.87 (lowest) |

**Technical Debt Lifecycle** (issue survival at repository HEAD):
- Overall survival rate: 24.2%
- Security issues survive longest: 41.1%
- Runtime bugs: 30.3%
- Code smells: 22.7%
- Surviving issues per 100 AI commits: 37.25 overall
- AI introduces twice as many security issues as it resolves

**Aging pattern**: Issues surviving 3-6 months actually have a slightly higher rate (41.23 per 100 commits) than those under 3 months (39.92), suggesting security and runtime bugs are disproportionately persistent.

### 5b. Human-Written vs AI-Generated Code (ISSRE 2025)

**Source**: [arxiv](https://arxiv.org/abs/2508.21634) / [GitHub replication](https://github.com/dessertlab/Human_vs_AI_Code_Quality)

**Methodology**:
- 500,000+ code samples
- Languages: Python and Java
- LLMs tested: ChatGPT, DeepSeek-Coder, Qwen-Coder
- Classification: Orthogonal Defect Classification + Common Weakness Enumeration
- Accepted to IEEE ISSRE 2025

**Key Findings**:
- AI-generated code is generally simpler and more repetitive
- AI code is more prone to unused constructs and hardcoded debugging artifacts
- Human-written code exhibits greater structural complexity but higher maintainability issue concentration
- Distinct defect profiles between AI and human code necessitate specialized QA practices

### 5c. Security Vulnerabilities in AI-Generated Code (Springer, 2025)

**Source**: [arxiv](https://arxiv.org/abs/2510.26103) / [Springer](https://link.springer.com/chapter/10.1007/978-981-95-3537-8_9)

**Methodology**:
- 7,703 files from public GitHub repositories explicitly attributed to AI tools
- Tool distribution: ChatGPT (91.52%), GitHub Copilot (7.50%), Amazon CodeWhisperer (0.52%), Tabnine (0.46%)
- Analysis tool: CodeQL static analysis

**Results**:
- 4,241 CWE instances across 77 distinct vulnerability types
- 87.9% of AI-generated code does not contain identifiable CWE-mapped vulnerabilities
- Python vulnerability rates: 16.18%-18.50% (highest)
- JavaScript: 8.66%-8.99%
- TypeScript: 2.50%-7.14% (lowest)
- GitHub Copilot showed better security density for Python (1,739 lines per CWE)
- 39% of collected files used AI tools for documentation generation

### 5d. Veracode 2025 GenAI Code Security Report

**Source**: [Veracode Report](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/) / [Veracode Blog](https://www.veracode.com/blog/genai-code-security-report/)

**Methodology**:
- 80 coding tasks: 4 languages x 4 CWEs x 5 examples each
- Tested against 100+ LLMs of varying sizes, release dates, and training sources
- CWEs selected from OWASP Top 10

**Results**:
- AI-generated code introduced risky security flaws in 45% of tests
- Java: 72% security failure rate (highest)
- CWE-80 (Cross-site scripting): 86% failure rate
- CWE-117 (Log injection): 88% failure rate
- Models improved at writing functional/syntactically correct code over time but showed no improvement at writing secure code

### 5e. Survey of Bugs in AI-Generated Code (arxiv, December 2025)

**Source**: [arxiv](https://arxiv.org/html/2512.05239v1)

**Methodology**:
- Systematic literature review of 72 peer-reviewed studies (2020-2025)
- Top venues: ICSE, ASE, NeurIPS

**Bug Taxonomy** (8 categories, by study frequency):
1. Functional bugs (56/72 studies) -- logic and semantic errors
2. Syntax bugs (32/72 studies) -- grammatical violations
3. Reliability bugs (21/72 studies) -- performance and stability
4. Code style/standards issues
5. Hallucination -- "factually incorrect or fictitious" code that appears syntactically correct
6. System bugs -- memory, I/O, database, hardware, configuration
7. Test bugs -- assertion and test code failures
8. Unspecified bugs

**Cross-study finding**: "Around 40% of GitHub Copilot-generated code contained vulnerabilities" in security-focused studies.

**Bug detection methods across the literature**: Static analysis (32%), manual inspection (22%), dynamic analysis (20%).

---

## 6. Defect Type Distributions: What Goes Wrong Most Often

Synthesizing across all studies, the defect landscape of AI-generated code shows consistent patterns:

**Tier 1 -- Pervasive (appear across nearly all studies)**:
- Logic and correctness errors (business logic, control flow, off-by-one)
- Code duplication and DRY violations
- Naming and readability degradation
- Missing or incorrect error handling

**Tier 2 -- Structurally Predictable (appear in most security-focused studies)**:
- XSS vulnerabilities (CWE-79/80)
- Injection flaws (SQL, code, log)
- Insecure deserialization
- Improper authentication/authorization
- Insufficient randomness (CWE-330)

**Tier 3 -- Subtle and Persistent (harder to detect, longer-lived)**:
- Performance pathologies (excessive I/O at ~8x, per CodeRabbit)
- Concurrency bugs
- Hardcoded debugging artifacts left in production
- Unused constructs
- Security issues that survive at 41.1% (per "Debt Behind the AI Boom")

**Key pattern**: AI does not introduce novel defect categories. It amplifies the rate of known defect types, with disproportionate amplification in areas requiring whole-system reasoning (security, concurrency, I/O patterns, refactoring).

---

## 7. Industry Adoption and Measured Quality Impacts

### Stack Overflow 2025 Developer Survey (49,000+ responses)

**Source**: [Stack Overflow 2025 Survey](https://survey.stackoverflow.co/2025/ai) / [Blog](https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/)

- 84% of developers using or planning to use AI tools (up from 76% in 2024)
- 51% of professional developers use AI tools daily
- Trust in AI accuracy: 29% (down from 40% previously)
- Positive sentiment: 60% (down from 72% year-over-year)
- 66% cite frustration with "AI solutions that are almost right, but not quite"
- 45% say debugging AI-generated code is more time-consuming
- 72% say vibe coding is not part of their professional work
- 75% would still ask a person when they don't trust AI answers

### Sonar 2026 State of Code Developer Survey

**Source**: [Sonar Report](https://www.sonarsource.com/state-of-code-developer-survey-report.pdf) / [Press Release](https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/)

- AI accounts for 42% of all committed code; developers expect 65% by 2027
- 96% of developers do not fully trust AI output
- Only 48% always verify AI code before committing (the "verification gap")
- 95% spend at least some effort reviewing/testing/correcting AI output
- 59% rate that review effort as "moderate" or "substantial"
- 38% say reviewing AI code requires more effort than reviewing human code (vs 27% who say less)
- 88% cite negative impacts: code that "looks correct but isn't reliable" (53%) or is "unnecessary and duplicative"
- 25% of developers report using agentic AI tools regularly

### The Adoption Paradox

Multiple surveys converge on the same tension: adoption is near-universal (80-84%), but trust is declining (29-40% trust, depending on measure), and verification effort is substantial. The productivity gains (55% faster coding, 26% more completed tasks, 60% more PRs merged) come with a corresponding increase in review burden (91% more PR review time in high-adoption teams, per Index.dev analysis).

---

## 8. The "41% of Production Code Is AI-Generated" Claim

### Origin and Methodology

The 41% figure has multiple possible attribution paths:

1. **GitClear analysis (2025)**: GitClear's analysis of 211 million changed lines from 2020-2024 informs industry-wide estimates about AI-generated code volume. The 41% figure appears to derive from or be consistent with their analysis of code composition trends, though GitClear's primary claim is about code quality degradation, not a direct "41% is AI-generated" measurement.

2. **Sonar 2026 survey**: Reports "42% of all committed code" is AI-generated, based on developer self-reporting (not code analysis). This is close enough to the 41% figure to suggest the same underlying data or convergent estimates.

3. **GitHub's own data**: GitHub has separately claimed that "46% of code" is written by Copilot users with Copilot assistance, but this measures the AI's contribution within the Copilot-using population, not across all code globally.

### Methodological Problems

The 41% claim is problematic for several reasons:

- **Acceptance rate vs shipped code**: GitHub reports ~30% acceptance rate for Copilot suggestions. Code that is generated by AI, modified by humans, and then committed occupies a grey zone in attribution.
- **Self-reporting bias**: Sonar's 42% figure comes from developer self-assessment, which may overcount (AI helped me think about it) or undercount (I forgot the autocomplete suggested this).
- **Definition ambiguity**: "AI-generated" can mean anything from "the LLM wrote the entire function" to "Copilot autocompleted a variable name." No study rigorously defines the threshold.
- **Population vs sample**: The statistic implicitly claims a global figure but derives from specific populations (GitClear's enterprise-skewed dataset, Sonar's survey respondents, GitHub's user base).

### Best Available Interpretation

The most defensible reading: among developers who use AI coding tools (which is ~80% of surveyed developers), somewhere between 30-46% of committed code involves meaningful AI contribution. The "41%" figure is a reasonable midpoint estimate but should not be treated as a precise measurement.

---

## 9. Contradictions and Tensions Across Studies

### GitHub vs GitClear (the central contradiction)

GitHub's RCT (2024) found statistically significant quality improvements with Copilot (readability +3.62%, reliability +2.94%, maintainability +2.47%). GitClear's longitudinal analysis of 211M lines found refactoring collapsed from 24.1% to 9.5%, code cloning grew 48%, and churn nearly doubled. These findings are not necessarily incompatible:

- GitHub measured a controlled, single-task scenario with experienced developers incentivized to focus on quality.
- GitClear measured ecosystem-wide trends in real production codebases over years.
- The implication: AI tools can produce higher-quality code in ideal conditions, but in practice, the way they are used degrades codebase health over time.

### CodeRabbit vs GitHub

CodeRabbit found 1.7x more issues in AI-authored PRs. GitHub found 5% higher approval rates. The difference likely stems from measurement scope: CodeRabbit measured all issue types including style and maintainability; GitHub measured narrow readability metrics and functional test passage. Both can be simultaneously true.

### Qodo's Optimism vs Stack Overflow's Skepticism

Qodo: 59% say AI improved code quality. Stack Overflow: 66% frustrated with "almost right" AI code, trust at 29%. The difference: Qodo's framing emphasizes productivity-quality correlation among satisfied users; Stack Overflow captures the full population including developers who tried and were disappointed.

### Security: Consistent Signal

Across all security-focused studies, the signal is consistent and unambiguous: AI-generated code has significantly worse security properties than human-written code. Whether measured at 2.74x (CodeRabbit), 45% failure rate (Veracode), 40% vulnerability rate (meta-analysis), or 41.1% survival rate for security issues ("Debt Behind the AI Boom"), every study that examines security finds material degradation.

---

## 10. Summary of Key Measurements

| Metric | Value | Source | Date |
|---|---|---|---|
| Issues per PR (AI vs human) | 10.83 vs 6.45 (1.68x) | CodeRabbit | Dec 2025 |
| Security vulnerability ratio | 2.74x more in AI code | CodeRabbit | Dec 2025 |
| Excessive I/O problems | ~8x more in AI code | CodeRabbit | Dec 2025 |
| Refactoring share of changes | 24.1% (2020) to 9.5% (2024) | GitClear | Feb 2025 |
| Code cloning share | 8.3% (2020) to 12.3% (2024) | GitClear | Feb 2025 |
| Duplicated code blocks | 8x increase | GitClear | Feb 2025 |
| Code churn (2-week revision) | 3.1% (2020) to 5.7% (2024) | GitClear | Feb 2025 |
| AI commits introducing issues | 17.3%-28.7% depending on tool | Debt Behind AI Boom | Mar 2026 |
| Security issue survival rate | 41.1% | Debt Behind AI Boom | Mar 2026 |
| Total issues in AI commits | 484,606 across 304k commits | Debt Behind AI Boom | Mar 2026 |
| Security failure rate (LLMs) | 45% of tasks | Veracode | Jul 2025 |
| Java security failure rate | 72% | Veracode | Jul 2025 |
| XSS mitigation failure | 86% of cases | Veracode | Jul 2025 |
| Developer trust in AI accuracy | 29% | Stack Overflow | Dec 2025 |
| Developers who always verify AI code | 48% | Sonar | Jan 2026 |
| AI share of committed code | ~41-42% | GitClear / Sonar | 2025-2026 |
| Copilot suggestion acceptance rate | ~30% | GitHub | 2024 |
| Hallucination + low confidence | 76.4% of developers | Qodo | 2025 |

---

## 11. What This Means for Quality Architecture

The empirical picture, taken in aggregate, points to several structural conclusions:

1. **AI code is not categorically bad; it is systematically undertested.** The defect types are known, the rates are measurable, and the patterns are predictable. This is an engineering problem, not a philosophical one.

2. **The verification bottleneck is the real problem.** Code generation accelerated; code review, testing, and security analysis did not keep pace. Sonar's finding that 96% don't trust AI output but only 48% verify it is the single most important datapoint for anyone designing quality systems.

3. **Security is the non-negotiable failure mode.** Every study agrees. AI-generated code has materially worse security properties, and security issues survive longest in production (41.1% persistence). Any quality architecture that treats AI code the same as human code in security review is empirically indefensible.

4. **Refactoring collapse is a leading indicator of technical debt accumulation.** GitClear's finding that refactoring dropped from 24.1% to 9.5% of changes while cloning rose from 8.3% to 12.3% suggests that AI tools optimize for code addition over code improvement. This pattern will compound.

5. **Tool-level differences matter.** "Debt Behind the AI Boom" found defect introduction rates ranging from 17.3% (Copilot) to 28.7% (Gemini). Treating "AI-generated code" as monolithic obscures actionable differences.

6. **The productivity-quality tradeoff is real but not fixed.** Qodo's data shows that teams with AI review see 81% quality improvement vs 55% without. The tooling and process wrapper around AI generation determines whether the quality cost is paid.
