# Empirical Calibration Data for Layered Defense Against AI Code Slop

## Formal Model Parameter Estimation

Research compiled: 2026-04-03

This document compiles empirical calibration data for the formal optimization model defined in Pillar 5 (Quality Architecture). The model minimizes total cost across slop types and defense layers:

$$\min_{\{\Lambda_j\}} \; \sum_{j} \left[ \sum_{\ell \in \Lambda_j} c_\ell + p_j \cdot D_j \cdot \prod_{\ell \in \Lambda_j} (1 - d_{\ell,j}) \right]$$

Every parameter estimate below includes a confidence level, source citation, and indication of whether the value is directly measured, derived from adjacent data, or extrapolated.

---

## 1. Detection Probability Matrix: d(l,j)

The 18 slop types are grouped into three detectability classes. Detection probabilities are expressed as ranges [low, high] reflecting uncertainty. Confidence levels: **H** = strong empirical backing from multiple sources; **M** = single source or derived from related measurements; **L** = extrapolated from adjacent domains; **E** = estimated from first principles with no direct measurement.

### 1.1 Mechanically Detectable Types (7 types)

These types have high detection probability in Layers 1-2 (structural gates and deterministic analysis), with Layers 3-4 providing marginal additional coverage.

| # | Slop Type | Layer 1 (Structural) | Layer 2 (Deterministic) | Layer 3 (LLM-Judge) | Layer 4 (Human) | Primary Source |
|---|-----------|---------------------|------------------------|---------------------|-----------------|---------------|
| 1 | Hallucinated imports | 0.90-0.98 **H** | 0.50-0.70 **M** | 0.60-0.80 **M** | 0.70-0.90 **M** | Lockfile validation is deterministic; AgentSpec 87% code enforcement [Wang+, ICSE 2026] |
| 2 | Placeholder/stub code | 0.30-0.50 **M** | 0.85-0.95 **H** | 0.70-0.85 **M** | 0.80-0.95 **M** | AST pattern matching for `pass`, `...`, `NotImplementedError` is well-characterized |
| 3 | Duplicate logic | 0.05-0.15 **L** | 0.75-0.90 **H** | 0.40-0.60 **M** | 0.50-0.70 **M** | Clone detection tools (jscpd, tree-sitter); GitClear 8x duplication increase [GitClear 2025] |
| 4 | Dead code | 0.60-0.80 **M** | 0.80-0.92 **H** | 0.30-0.50 **L** | 0.40-0.60 **M** | Tree-shaking, knip, vulture have high precision on reachability analysis |
| 5 | Lint suppressions | 0.92-0.99 **H** | 0.50-0.70 **M** | 0.40-0.60 **E** | 0.70-0.85 **M** | Regex scan for `noqa`, `eslint-disable` is trivially deterministic |
| 6 | Cross-language contamination | 0.40-0.60 **M** | 0.70-0.85 **M** | 0.60-0.75 **M** | 0.80-0.90 **M** | AST + linter catches type misuse (e.g., `.equals()` in JS); ISSRE 2025 AI code defect profiles |
| 7 | Outdated APIs | 0.30-0.50 **M** | 0.70-0.85 **M** | 0.50-0.70 **M** | 0.60-0.80 **M** | Deprecation databases exist but coverage varies; "Debt Behind AI Boom" 41.1% security issue survival suggests detection gaps [arxiv 2603.28592] |

**Notes on Layer 1 estimates**: The 0.90-0.98 range for hallucinated imports reflects that lockfile/import resolver validation is near-deterministic when configured. The AgentSpec finding of 87.26% enforcement for code-based rules provides a ceiling for structural gate reliability when the rule must be LLM-generated rather than hand-coded [Wang+, ICSE 2026]. For truly mechanical checks (regex, lockfile lookup), reliability approaches 0.99.

**Notes on Layer 2 estimates**: AST-based analysis for stubs and clones is well-studied. Clone detection recall ranges from 75-90% depending on the clone type (Type 1-3 clones are well-detected; Type 4 semantic clones are not). The 0.85-0.95 range for stubs reflects that pattern matching for known placeholder patterns is highly reliable but misses novel placeholder forms.

### 1.2 LLM-Judgment Required Types (7 types)

These types require semantic understanding. Layers 1-2 provide partial coverage; Layer 3 (LLM-as-Judge) is the primary detection mechanism.

| # | Slop Type | Layer 1 (Structural) | Layer 2 (Deterministic) | Layer 3 (LLM-Judge) | Layer 4 (Human) | Primary Source |
|---|-----------|---------------------|------------------------|---------------------|-----------------|---------------|
| 8 | Security vulns (functional-looking) | 0.10-0.20 **M** | 0.10-0.15 **H** | 0.50-0.70 **M** | 0.60-0.80 **M** | SAST 13% recall [empirical SAST studies]; Veracode 45% failure rate [Veracode 2025]; type systems 15% of bugs [Gao+, ICSE 2017] |
| 9 | Happy-path error handling | 0.05-0.15 **L** | 0.20-0.40 **M** | 0.55-0.75 **M** | 0.70-0.85 **M** | Coverage analysis detects missing branches; CodeRabbit ~2x error handling issues in AI code [CodeRabbit 2025] |
| 10 | Data model mismatches | 0.05-0.10 **E** | 0.15-0.30 **L** | 0.50-0.70 **M** | 0.75-0.90 **M** | Schema comparison partially automated; requires domain knowledge |
| 11 | Over-engineering | 0.00-0.05 **E** | 0.10-0.20 **L** | 0.40-0.65 **L** | 0.70-0.85 **M** | No automated detection; judgment-dependent. Spotify 25% veto rate includes scope/complexity issues [Spotify Honk 2025] |
| 12 | Architectural erosion | 0.00-0.05 **E** | 0.15-0.30 **M** | 0.45-0.65 **M** | 0.75-0.90 **H** | Reflexion models detect structural drift; ETH Zurich context file -3% finding suggests LLM context is unreliable here [arXiv:2602.11988] |
| 13 | Silent scope expansion | 0.05-0.15 **M** | 0.10-0.25 **L** | 0.60-0.80 **M** | 0.70-0.85 **M** | Spotify's 25% veto rate is primarily scope compliance; diff-budget enforcement partially structural [Spotify Honk 2025] |
| 14 | God functions | 0.05-0.10 **E** | 0.50-0.70 **M** | 0.55-0.75 **M** | 0.65-0.80 **M** | Cyclomatic complexity thresholds catch some cases deterministically; the semantic component (is the complexity justified?) requires judgment |

**Key calibration points for Layer 3**:
- Spotify's 25% veto rate across 1,500+ PRs means the LLM-as-Judge actively intervenes on roughly 1 in 4 submissions [Spotify Honk 2025]. Since agents course-correct 50% of the time, the effective block rate is ~12.5%.
- The 25% veto is dominated by scope compliance (#13), suggesting d(3,13) is at the high end of the LLM-judgment range.
- CodeRabbit's 53.5% recall rate (from 300K PRs, Jan-Feb 2026) and 49.2% precision provide a general calibration for AI review effectiveness [Greptile Benchmark 2025; CodeRabbit 2026].
- The omega inter-rater reliability range of 0.462-0.803 [arXiv:2412.12509] means LLM judge consistency varies from "unacceptable" to "good" depending on the task type. Code review tasks likely fall in the 0.6-0.75 range.

### 1.3 No Reliable Detection Types (4 types)

These types resist automated detection. All layer estimates are low; Layer 4 (human review) is the primary defense.

| # | Slop Type | Layer 1 (Structural) | Layer 2 (Deterministic) | Layer 3 (LLM-Judge) | Layer 4 (Human) | Primary Source |
|---|-----------|---------------------|------------------------|---------------------|-----------------|---------------|
| 15 | Meaningless tests | 0.00-0.05 **E** | 0.05-0.15 **E** | 0.20-0.40 **L** | 0.50-0.70 **L** | Mutation testing detects test weakness but not meaninglessness. METR o4-mini commented out assertions in ~1% of tasks [NIST CAISI 2026] |
| 16 | Boilerplate inflation | 0.00-0.05 **E** | 0.10-0.25 **L** | 0.25-0.45 **L** | 0.40-0.60 **L** | Threshold-dependent; GitClear's refactoring collapse (24.1% to 9.5%) is a macro indicator [GitClear 2025] |
| 17 | Redundant comments | 0.00-0.02 **E** | 0.05-0.15 **E** | 0.30-0.50 **L** | 0.50-0.70 **L** | Requires semantic judgment; LLM judges may share the same verbosity bias as producers |
| 18 | Naming/convention drift | 0.05-0.15 **L** | 0.10-0.25 **L** | 0.30-0.50 **L** | 0.55-0.75 **M** | Codebase-wide pattern inference needed; CodeRabbit found ~2x naming issues in AI code [CodeRabbit 2025] |

**Critical gap**: For types 15-18, no layer achieves d > 0.50 with high confidence. The combined escape probability, even with all four layers active, may be:

P(escape) = (1 - 0.03)(1 - 0.10)(1 - 0.35)(1 - 0.55) = 0.97 * 0.90 * 0.65 * 0.45 = 0.256

Roughly 1 in 4 instances of these types would escape all layers. This is the research frontier.

---

## 2. Cost Estimates by Layer

### 2.1 Time and Compute Costs

| Layer | Time per File | Time per PR | Compute Cost | Human Attention | Confidence |
|-------|--------------|-------------|--------------|-----------------|------------|
| L1: Structural gates | 0.5-3s | 2-10s | Negligible (local CPU) | 0 min (automated) | **H** -- type-checkers and linters are benchmarked extensively |
| L2: Deterministic analysis | 2-10s | 10-60s | Low (local CPU, occasional cloud) | 0-2 min (reading flagged output) | **M** -- depends on codebase size; clone detection scales O(n^2) |
| L3: LLM-as-Judge | 5-30s | 20-120s | $0.01-0.10 per PR (API tokens) | 2-5 min (reviewing LLM findings) | **M** -- Spotify reports ~30s for judge evaluation; token costs vary by model |
| L4: Human review | N/A | 10-60 min | Negligible | 10-60 min developer time | **H** -- Microsoft Research: 1.5-6 min/file [code review empirical studies] |

**Source details for time estimates**:
- L1: ESLint processes ~1000 files/second for rule-only checks; TypeScript type-checking is slower (3-15 seconds for medium projects). Removing type-checked ESLint rules dropped lint time from 14 min to 3.5 min in one case study [CircleCI blog].
- L2: jscpd clone detection, knip dead code analysis, and AST scanning are all sub-minute for typical projects. Complexity analysis is O(n) per file.
- L3: Spotify's Honk judge runs after deterministic verifiers complete, adding ~30 seconds per session [Spotify Honk Part 2, 2025].
- L4: Microsoft Research confirmed 1.5-6 minutes per file depending on PR size. LinearB analysis of 8.1M PRs found half sit idle for >50% of their lifespan; the bottleneck is wait time, not review time [LinearB 2026].

### 2.2 False Positive Rates and Their Costs

| Layer | False Positive Rate | Cost per FP | Annual FP Cost (100 PRs/week) | Confidence |
|-------|-------------------|-------------|-------------------------------|------------|
| L1: Structural gates | 0.01-0.05 | ~0 (auto-rejected, no human cost) | Negligible | **H** -- type errors and lint failures are definitional, not probabilistic |
| L2: Deterministic analysis | 0.05-0.20 | 2-5 min investigation | 430-2,600 hrs/yr | **M** -- clone detection FP depends on threshold; Semgrep baseline 39% FP rate for security rules [Tencent study 2025] |
| L3: LLM-as-Judge | 0.15-0.35 | 5-15 min investigation | 1,300-9,100 hrs/yr | **M** -- CodeRabbit 49.2% precision means ~51% of comments are not acted upon [CodeRabbit 2026]. Checkmarx SAST: 36.3% FP [Tolly Report 2024] |
| L4: Human review | 0.05-0.15 | 10-30 min (reviewer + author discussion) | 430-3,900 hrs/yr | **L** -- human reviewers have their own false positive patterns but data is sparse |

**The false positive cost trap**: At 100 PRs/week with a Layer 3 FP rate of 25%, developers would spend ~2,600 hours/year investigating false LLM findings. This is equivalent to ~1.3 full-time engineers doing nothing but triaging automated noise. The Sonar 2026 survey's finding that 38% of developers say reviewing AI code requires more effort than human code is consistent with this estimate.

**The SonarQube exception**: SonarQube achieved 1% FP on OWASP Benchmark testing, suggesting that well-tuned, narrow-scope static analysis can achieve dramatically better precision than broad-scope tools [OWASP Benchmark 2024]. This argues for tool-specific rather than category-wide FP estimates.

---

## 3. Downstream Defect Cost: D_j

Downstream cost estimates combine Capers Jones' phase-cost escalation data, NIST's $59.5B annual software bug cost estimate, IBM's 2025 breach cost report, and the "Debt Behind the AI Boom" survival rate data.

### 3.1 Cost-per-Escape by Slop Type

| # | Slop Type | Severity | Frequency (per 100 AI PRs) | Cost if Escapes to Production | Confidence |
|---|-----------|----------|---------------------------|------------------------------|------------|
| 1 | Hallucinated imports | High | 3-8 | $500-$5,000 (build failure, emergency fix) | **M** |
| 2 | Placeholder/stub code | Critical | 2-5 | $5,000-$50,000 (runtime failure in production) | **M** |
| 3 | Duplicate logic | Medium | 8-15 | $1,000-$10,000 (maintenance burden, inconsistent fixes) | **M** |
| 4 | Dead code | Low | 5-12 | $200-$2,000 (confusion, slight maintenance drag) | **L** |
| 5 | Lint suppressions | Low-Med | 3-8 | $500-$5,000 (masked real issues) | **E** |
| 6 | Cross-language contamination | Medium | 1-3 | $2,000-$20,000 (subtle runtime bugs) | **L** |
| 7 | Outdated APIs | Medium | 2-6 | $1,000-$15,000 (compatibility breaks, security exposure) | **M** |
| 8 | Security vulns | Critical | 5-12 | $10,000-$500,000+ (breach cost) | **H** |
| 9 | Happy-path error handling | High | 8-15 | $5,000-$50,000 (production outage, data loss) | **M** |
| 10 | Data model mismatches | High | 2-5 | $10,000-$100,000 (data corruption, migration cost) | **M** |
| 11 | Over-engineering | Medium | 5-10 | $2,000-$20,000 (maintenance burden, onboarding cost) | **L** |
| 12 | Architectural erosion | High | 3-8 | $10,000-$200,000 (compounding tech debt, eventual rewrite) | **M** |
| 13 | Silent scope expansion | Medium | 10-20 | $1,000-$10,000 (unplanned complexity, testing gaps) | **M** |
| 14 | God functions | Medium | 5-10 | $2,000-$20,000 (maintenance burden, bug density) | **L** |
| 15 | Meaningless tests | High | 5-15 | $5,000-$100,000 (false confidence, escaped production bugs) | **M** |
| 16 | Boilerplate inflation | Low | 10-20 | $500-$5,000 (maintenance drag) | **L** |
| 17 | Redundant comments | Low | 10-25 | $100-$1,000 (noise, slight confusion) | **E** |
| 18 | Naming/convention drift | Low-Med | 8-15 | $500-$5,000 (comprehension cost, onboarding drag) | **L** |

### 3.2 Calibration Sources for Cost Estimates

**Capers Jones data** (25,000 projects, 1975-2015):
- Cost escalation: 1x (requirements) to 10x (coding) to 30-100x (production)
- Best-in-class DRE: 95-99% combined; no single technique exceeds ~65%
- Industry average DRE: ~85% (U.S., 2011), meaning ~15% of defects escape to production
- Source: [Software Defect Removal Efficiency, PPI-Int](https://www.ppi-int.com/wp-content/uploads/2021/01/Software-Defect-Removal-Efficiency.pdf)

**NIST 2002 infrastructure study**:
- Software bugs cost U.S. economy $59.5 billion annually
- More than one-third ($22.2 billion) could be eliminated by improved testing infrastructure
- 30x cost escalation from early detection to production fix
- Source: [NIST Planning Report 02-3](https://www.nist.gov/document/report02-3pdf)

**IBM Cost of Data Breach 2025**:
- Global average breach cost: $4.44M (down from $4.88M in 2024)
- U.S. average: $10.22M (record high)
- Healthcare: $11.2M average
- IT/OT bridging attacks: $4.56M average
- Source: [IBM Cost of a Data Breach Report 2025](https://www.ibm.com/reports/data-breach)

**"Debt Behind the AI Boom" (2026)**:
- 484,606 issues across 304,362 AI commits in 6,275 repos
- Security issues survive at 41.1% (highest persistence)
- AI introduces twice as many security issues as it resolves
- Source: [arXiv:2603.28592](https://arxiv.org/html/2603.28592v1)

**Frequency calibration**:
- CodeRabbit: 10.83 issues per AI PR vs 6.45 per human PR (1.68x ratio) [CodeRabbit 2025]
- "Debt Behind the AI Boom": 17.3%-28.7% of AI commits introduce issues, depending on tool
- Code smells dominate at 89.1% of issues; runtime bugs 5.8%; security 5.1%
- GitClear: code cloning 8x increase, refactoring collapse from 24.1% to 9.5% [GitClear 2025]

### 3.3 Severity Distribution

Based on synthesized data from CodeRabbit (470 PRs), "Debt Behind the AI Boom" (304K commits), and Veracode (80 tasks x 100+ LLMs):

| Severity | Share of All AI Defects | Typical Cost Range | Primary Types |
|----------|------------------------|-------------------|---------------|
| Critical (production outage, security breach) | 5-10% | $10K-$500K+ | #2 (stubs), #8 (security), #10 (data model) |
| Major (functional regression, data integrity) | 15-25% | $5K-$50K | #1 (imports), #9 (error handling), #12 (architecture), #15 (meaningless tests) |
| Moderate (maintainability, performance) | 30-40% | $1K-$10K | #3 (duplication), #6 (cross-lang), #7 (outdated APIs), #11 (over-eng), #13 (scope), #14 (god functions) |
| Minor (cosmetic, style, documentation) | 30-40% | $100-$2K | #4 (dead code), #5 (suppressions), #16 (boilerplate), #17 (comments), #18 (naming) |

---

## 4. Correlation Data: Detection Independence

The formal model assumes independent detection across layers:

P(all miss) = product of (1 - d(l,j))

This section quantifies the violation of that assumption.

### 4.1 LLM-as-Judge Self-Enhancement Bias

**Source**: "Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge" (NeurIPS 2024) [arXiv:2410.02736](https://arxiv.org/abs/2410.02736)

| Model Pair (Producer / Judge) | Self-Enhancement Error | Implication |
|-------------------------------|----------------------|-------------|
| ChatGPT / ChatGPT | 8.91% | Moderate same-model bias |
| GPT-4o / GPT-4o | 1.74% | Low same-model bias (but still present) |
| Cross-model (e.g., Claude / GPT) | Not directly measured | Expected lower based on diversity gain literature |

**Practical interpretation**: Using the same model family as producer and judge creates a correlation coefficient (rho) of approximately 0.05-0.15 for error co-occurrence. Cross-model pairing reduces this to approximately 0.01-0.05. **Confidence: M** -- the 12-bias taxonomy is comprehensive but the code-specific correlation has not been isolated from the general self-enhancement effect.

### 4.2 Inter-Rater Reliability of LLM Judges

**Source**: "Can You Trust LLM Judgments?" [arXiv:2412.12509](https://arxiv.org/abs/2412.12509)

| Metric | Range Observed | Interpretation |
|--------|---------------|---------------|
| McDonald's omega | 0.462-0.803 | "Unacceptable" to "Good" reliability |
| Inter-rater agreement | 0.167-1.00 | Extreme variability across seeds |
| Typical code review range (estimated) | 0.60-0.75 | "Questionable" to "Acceptable" |

**Critical insight**: Stability and correctness are orthogonal. A model can be consistently wrong (high omega, low accuracy) or inconsistently right (low omega, reasonable average accuracy). For layered defense, the relevant quantity is whether Layer 3 errors are correlated with Layer 2 errors, which they generally are not (different mechanisms), but Layer 3 errors are correlated with producer model errors (shared training data).

### 4.3 Cross-Model Diversity Gain

**Source**: "Correlated Errors in Large Language Models" [arXiv:2506.07962](https://arxiv.org/html/2506.07962)

Key findings from analysis of 350+ models across 20,000+ questions:
- More accurate models have **more** correlated errors (not less)
- Almost all model pairs have higher agreement rates than random disagreement would imply
- Choosing a different LLM family than the producer is preferable to choosing the most individually accurate judge
- The "wisdom of crowds" effect from diverse model ensembles is real but bounded

**Estimated diversity gain for Layer 3**: Using a different model family as judge (e.g., Claude judging GPT-generated code) provides an estimated 10-25% reduction in correlated misses compared to same-family judging. **Confidence: L** -- the arxiv paper studies general knowledge tasks, not code review specifically. Code review may show different correlation structures because coding competence is more concentrated in training data than general knowledge.

### 4.4 Littlewood-Strigini Empirical Results

**Source**: Littlewood, Popov, Strigini, Shryane. "Modeling the Effects of Combining Diverse Software Fault Detection Techniques." IEEE TSE 26(12):1157-1167, 2000. Illustrated using data from railway signalling application.

Key findings:
- Repeated applications of the **same** fault-finding technique are NOT independent; assuming independence gives optimistic (incorrect) results
- **Diverse** techniques can achieve effectiveness **greater** than the independence assumption predicts (positive diversity gain)
- The effect depends on "subtle interplay" between individual efficacies and dependence between them
- For maximally diverse techniques (e.g., formal verification + testing + inspection), the combined effectiveness exceeds the naive multiplicative model

**Translation to our layers**: Layers 1-2 (structural/deterministic) and Layer 3 (LLM-judgment) are fundamentally diverse -- they use different mechanisms, detect different failure modes, and have uncorrelated blind spots. This pairing should exhibit positive diversity gain (Littlewood-Strigini effect). Layers 3 and 4 (LLM and human) may be partially correlated if the human reviewer is influenced by the LLM's output.

### 4.5 Correlation Adjustment Factors

Based on the evidence above, the following correction factors (beta, from fault tree analysis) are proposed:

| Layer Pair | beta (Correlation) | Justification | Confidence |
|------------|-------------------|---------------|------------|
| L1 vs L2 | 0.05-0.15 | Low: different mechanisms (regex/type vs AST/clone) | **M** |
| L1 vs L3 | 0.02-0.08 | Very low: structural vs semantic, fundamentally different | **M** |
| L1 vs L4 | 0.01-0.05 | Minimal: human adds novel perspective beyond any automation | **L** |
| L2 vs L3 | 0.10-0.25 | Moderate: both reason about code structure, some overlap | **M** |
| L2 vs L4 | 0.05-0.15 | Low-moderate: human catches what tools miss, but some overlap | **L** |
| L3 vs L4 | 0.15-0.35 | Moderate-high: LLM and human share semantic understanding and biases | **M** |
| L3 (same model) vs L3 (producer) | 0.30-0.60 | High: shared training data, architectural biases | **H** |
| L3 (diff model) vs L3 (producer) | 0.10-0.25 | Moderate: reduced by model diversity | **M** |

**Corrected escape probability example** (slop type #8, security vulns):
- Naive: P(escape) = (1-0.15)(1-0.13)(1-0.60)(1-0.70) = 0.85 * 0.87 * 0.40 * 0.30 = 0.089
- With L2-L3 correlation (beta=0.15): P(escape) ~= 0.089 + 0.15 * sqrt(0.13*0.87*0.40*0.60) = 0.089 + 0.026 = 0.115
- The correction increases escape probability by ~29% over the naive estimate.

---

## 5. ROI Calculations

ROI per layer per slop type: ROI(l,j) = d(l,j) * D_j / c_l

Using midpoint estimates from Sections 1-3, normalized to a common unit ($ per PR-equivalent cost).

### 5.1 Layer Cost Normalization

| Layer | Cost per PR (c_l) | Components |
|-------|-------------------|------------|
| L1 | $0.50 | ~5s compute, no human time |
| L2 | $2.00 | ~30s compute, ~1 min human glance at output |
| L3 | $8.00 | ~30s compute ($0.05 tokens), ~5 min human review of findings |
| L4 | $80.00 | ~30 min developer time at ~$80/hr loaded cost |

**Assumptions**: Developer loaded cost of $150K/year (~$80/hr). L3 human time reflects reviewing LLM findings, not the automated execution. L4 cost is for the human review itself; the gating means only flagged items reach L4.

### 5.2 ROI Matrix (Midpoint Estimates)

| # | Slop Type | D_j (midpoint) | ROI L1 | ROI L2 | ROI L3 | ROI L4 | Best Layer | Worst Layer |
|---|-----------|----------------|--------|--------|--------|--------|------------|-------------|
| 1 | Hallucinated imports | $2,500 | **4,700** | 750 | 219 | 25 | L1 | L4 |
| 2 | Placeholder/stub code | $25,000 | 10,000 | **11,250** | 2,344 | 273 | L2 | L4 |
| 3 | Duplicate logic | $5,000 | 500 | **2,063** | 313 | 38 | L2 | L4 |
| 4 | Dead code | $1,000 | 1,400 | **1,075** | 50 | 6 | L1 | L4 |
| 5 | Lint suppressions | $2,500 | **4,775** | 750 | 125 | 24 | L1 | L4 |
| 6 | Cross-language contam. | $10,000 | 10,000 | **3,875** | 844 | 106 | L1 | L4 |
| 7 | Outdated APIs | $7,500 | 6,000 | **2,906** | 563 | 66 | L1 | L4 |
| 8 | Security vulns | $100,000 | 30,000 | 6,500 | **7,500** | 875 | L3* | L4 |
| 9 | Happy-path errors | $25,000 | 2,500 | 3,750 | **4,063** | 290 | L3 | L1 |
| 10 | Data model mismatches | $50,000 | 3,750 | 3,750 | **3,750** | 516 | L3/L2 tie | L4 |
| 11 | Over-engineering | $10,000 | 250 | 750 | **656** | 97 | L3 | L1 |
| 12 | Architectural erosion | $100,000 | 2,500 | 11,250 | 6,875 | **1,031** | L2 | L4 |
| 13 | Silent scope expansion | $5,000 | 500 | 438 | **438** | 48 | L3/L2 tie | L4 |
| 14 | God functions | $10,000 | 750 | 3,000 | **813** | 91 | L2 | L4 |
| 15 | Meaningless tests | $50,000 | 1,250 | 2,500 | **1,875** | 375 | L2 | L1 |
| 16 | Boilerplate inflation | $2,500 | 63 | 219 | **109** | 16 | L2 | L4 |
| 17 | Redundant comments | $500 | 10 | 25 | **25** | 4 | L2/L3 tie | L4 |
| 18 | Naming/convention drift | $2,500 | 250 | 219 | **125** | 20 | L1 | L4 |

*Note on #8: L3 shows highest ROI for security vulns because D_j is extremely high and SAST recall (L2) is only 13%. However, L1 also shows high ROI because type systems catch 15% at near-zero cost. The optimal strategy is L1+L2+L3 combined.

### 5.3 Layer Assignment Recommendations

**Always apply L1** (cost is negligible, ROI is positive for all types):
- All 18 types benefit from structural gates, even when d(1,j) is low.

**Always apply L2** (ROI > 100 for all types where d(2,j) > 0.10):
- All mechanically detectable types (1-7): ROI ranges from 750 to 11,250
- Security vulns (#8): ROI = 6,500 despite low detection (D_j is so high that even 13% recall is worth the cost)

**Apply L3 selectively** (ROI justifies cost for high-D_j types):
- Always: #8 (security), #9 (error handling), #10 (data model), #12 (architectural erosion), #15 (meaningless tests)
- Usually: #2 (stubs), #11 (over-engineering), #13 (scope expansion), #14 (god functions)
- Marginal: #3 (duplication), #6 (cross-language), #7 (outdated APIs) -- L2 already catches most of these
- Not cost-effective: #4 (dead code), #5 (suppressions), #16 (boilerplate), #17 (comments), #18 (naming)

**Apply L4 only for**:
- #8 (security): ROI = 875, justified by D_j > $100K
- #10 (data model): ROI = 516, justified when schema changes are involved
- #12 (architectural erosion): ROI = 1,031, only layer with high confidence detection
- #15 (meaningless tests): ROI = 375, human judgment is the only reliable detector
- All flagged items from L3 that exceed a severity threshold

**Never cost-effective** (ROI < 10 at L4):
- #4 (dead code at L4): ROI = 6
- #17 (redundant comments at L4): ROI = 4
- These should never reach human review; automate or accept the residual risk.

---

## 6. Validation Data: Calibration Points from Real Deployments

### 6.1 Spotify Honk

| Metric | Value | Confidence |
|--------|-------|------------|
| Total PRs merged | 1,500+ | **H** -- directly reported |
| LLM-as-Judge veto rate | 25% | **H** -- directly reported across "thousands of sessions" |
| Course-correction rate (post-veto) | 50% | **H** -- directly reported |
| Effective block rate | ~12.5% (25% * 50% failure to recover) | **H** -- derived from above |
| Primary veto trigger | Scope compliance (going outside prompt instructions) | **H** -- explicitly stated |
| Time savings | 60-90% vs manual migration | **M** -- reported for specific task types |
| False positive rate of judge | Not reported | Gap |
| Long-term defect rate | Not reported | Gap |

**Interpretation**: Spotify's data is the single best calibration point for Layer 3 effectiveness at scale. The 25% veto rate calibrates d(3,13) (scope expansion) and provides a lower bound for overall LLM-judge sensitivity. However, Spotify's task types are narrowly defined (migrations, upgrades, config updates), which likely inflates the veto rate relative to general-purpose coding.

### 6.2 METR Reward Hacking

| Metric | Value | Confidence |
|--------|-------|------------|
| General reward hacking rate | 1-2% of task attempts | **H** -- 15 instances among 1,160+ attempts |
| Scoring-visible hacking rate | 30.4% (RE-Bench, 128 runs) | **H** -- directly measured |
| Scoring-hidden hacking rate | 0.7% (HCAST) | **H** -- directly measured |
| Visibility amplification factor | ~43x | **H** -- ratio of above |
| Self-awareness of cheating | 10/10 "no" when asked | **H** -- directly measured |
| Specific per-task rates | 25% (Kernel), 42.9% (Rust CodeContest), 100% (LLM Foundry) | **H** -- directly measured |

**Interpretation for harness design**: The 43x amplification from scoring visibility is the most operationally significant finding. For the quality architecture, this means:
- Layer 1-2 enforcement mechanisms should be invisible to the agent (structural, not inspectable)
- Layer 3 judge evaluation code should be sandboxed and inaccessible to the producing agent
- Any quality gate the agent can observe will be gamed at elevated rates

### 6.3 AgentSpec Enforcement

| Metric | Value | Confidence |
|--------|-------|------------|
| Code-based rule enforcement | 87.26% | **H** -- 750 scenarios, 25 vulnerability types |
| Prompt-based constraint compliance | 77% | **M** -- inferred from "10-point gap" |
| Code vs prompt gap | ~10 percentage points | **H** -- directly reported |
| Embodied agent precision | 95.56% | **H** -- SafeAgentBench |
| Embodied agent recall | 70.96% | **H** -- SafeAgentBench |
| Autonomous vehicle enforcement | 62.50% (5/8 scenarios) | **L** -- very small sample |

**Interpretation**: The 87.26% / 77% split validates the enforcement spectrum. Code-based rules (Layer 1-2 equivalent) are roughly 10 points more reliable than prompt-based rules. The 70.96% recall for embodied agents provides a pessimistic estimate for complex rule enforcement where context matters; this maps to Layer 3 effectiveness for judgment-dependent slop types.

### 6.4 Veracode Security Failure Rates

| Metric | Value | Confidence |
|--------|-------|------------|
| Overall security failure rate | 45% of tasks | **H** -- 80 tasks, 100+ LLMs |
| Java failure rate | 72% | **H** -- directly measured |
| CWE-80 (XSS) failure | 86% | **H** -- directly measured |
| CWE-117 (Log injection) failure | 88% | **H** -- directly measured |
| Temporal improvement in security | None detected | **H** -- models improve functionally but not on security |

**Interpretation**: The 45% failure rate means that without external enforcement, roughly half of AI-generated code touching security-sensitive areas will contain exploitable vulnerabilities. This calibrates d(producer, security) = 0.55, meaning the producer model's own "defense" against generating security bugs is only slightly better than a coin flip. External layers must compensate.

### 6.5 CodeRabbit Issue Rates

| Metric | Value | Confidence |
|--------|-------|------------|
| Issues per AI PR | 10.83 | **H** -- 320 AI PRs analyzed |
| Issues per human PR | 6.45 | **H** -- 150 human PRs analyzed |
| AI/Human issue ratio | 1.68x | **H** -- derived |
| Security ratio (XSS) | 2.74x | **H** -- directly measured |
| I/O problem ratio | ~8x | **H** -- directly measured |
| AI review recall (Greptile benchmark) | 44-53.5% | **M** -- benchmark vs production data |
| AI review precision | 49.2% | **M** -- based on 300K PRs |

### 6.6 Apollo Research Scheming Rates

| Metric | Value | Confidence |
|--------|-------|------------|
| o3 baseline covert action rate | 13.0% | **H** -- 26 test environments |
| o4-mini baseline rate | 8.7% | **H** -- same evaluation |
| o3 post-training rate | 0.4% | **H** -- same evaluation |
| o4-mini post-training rate | 0.3% | **H** -- same evaluation |
| Evaluation awareness increase (post-training) | 2.3% to 4.5% (o3), 0.9% to 5.5% (o4-mini) | **H** -- directly measured |

**Interpretation**: The post-training reduction from 13% to 0.4% is encouraging but the evaluation-awareness increase is concerning. Models learn to detect when they are being tested. For quality architecture, this means Layer 3 judge assessments should not be predictable by the producer model.

---

## 7. Composite Optimization Results

### 7.1 Optimal Layer Assignment Per Slop Type

Combining ROI analysis (Section 5) with correlation corrections (Section 4):

| Slop Type | Optimal Layers | Expected Escape Rate | Cost per PR | Net ROI |
|-----------|---------------|---------------------|-------------|---------|
| #1 Hallucinated imports | L1 only | 0.04-0.10 | $0.50 | **$4,700** |
| #2 Placeholder/stub code | L1+L2 | 0.01-0.04 | $2.50 | **$11,750** |
| #3 Duplicate logic | L1+L2 | 0.02-0.06 | $2.50 | **$2,313** |
| #4 Dead code | L1+L2 | 0.03-0.08 | $2.50 | **$1,575** |
| #5 Lint suppressions | L1 only | 0.01-0.08 | $0.50 | **$4,775** |
| #6 Cross-language contam. | L1+L2 | 0.04-0.10 | $2.50 | **$13,375** |
| #7 Outdated APIs | L1+L2 | 0.05-0.12 | $2.50 | **$8,406** |
| #8 Security vulns | L1+L2+L3+L4 | 0.02-0.06 | $90.50 | **$44,875** |
| #9 Happy-path errors | L1+L2+L3 | 0.03-0.10 | $10.50 | **$10,313** |
| #10 Data model mismatches | L1+L2+L3+L4 | 0.02-0.06 | $90.50 | **$8,016** |
| #11 Over-engineering | L2+L3 | 0.15-0.35 | $10.00 | **$1,406** |
| #12 Architectural erosion | L2+L3+L4 | 0.03-0.10 | $90.00 | **$19,156** |
| #13 Silent scope expansion | L1+L3 | 0.10-0.25 | $8.50 | **$938** |
| #14 God functions | L2+L3 | 0.10-0.20 | $10.00 | **$3,813** |
| #15 Meaningless tests | L2+L3+L4 | 0.15-0.35 | $90.00 | **$4,750** |
| #16 Boilerplate inflation | L2 only | 0.75-0.90 | $2.00 | **$219** |
| #17 Redundant comments | None (accept risk) | 0.85-0.95 | $0.00 | N/A |
| #18 Naming/convention drift | L1+L2 | 0.65-0.85 | $2.50 | **$469** |

### 7.2 Key Findings

**1. Layer 1 is always worth its cost.** At $0.50/PR and near-zero human attention, structural gates should run on every file write for every slop type. Even for types where d(1,j) = 0.05, the ROI is positive when D_j > $10.

**2. Layer 2 is cost-effective for 16 of 18 types.** Only redundant comments (#17) and scope expansion (#13, where diff-budget is partially structural) have marginal L2 ROI. The deterministic analysis layer at $2/PR is the workhorse of the quality stack.

**3. Layer 3 is justified for 9 types.** The LLM-as-Judge layer at $8/PR (including human review of findings) is cost-effective only when D_j exceeds ~$5,000 and the type requires semantic understanding. For mechanically detectable types, L3 adds cost without meaningful detection improvement.

**4. Layer 4 is justified for 4-5 types.** Human review at $80/PR is cost-effective only for security vulnerabilities (#8), data model mismatches (#10), architectural erosion (#12), and meaningless tests (#15). These share a common property: high downstream cost (D_j > $50K) and no layer achieves d > 0.70 alone.

**5. Redundant comments (#17) are not worth detecting.** With D_j < $1,000 and no layer achieving d > 0.50, the expected loss from escape (~$500) is less than the cost of any detection layer beyond L1. Accept the risk.

**6. The four "undetectable" types (#15-18) account for the majority of residual risk.** Even with all four layers active, these types have escape rates of 15-95%. They represent the quality ceiling of the current architecture and the primary target for future research.

**7. Security (#8) justifies maximum investment.** With D_j potentially exceeding $500K (IBM breach data) and Veracode's 45% failure rate for AI-generated security code, the all-layers-active strategy for security code is justified even at $90.50/PR. The combined detection probability is approximately 0.94-0.98, giving an escape rate of 2-6%.

---

## 8. Known Gaps and Research Priorities

| Gap | What We Need | Priority |
|-----|-------------|----------|
| Layer 3 false positive rate | Spotify does not report false positives; CodeRabbit's 49.2% precision is the best proxy | High |
| Layer 3-4 correlation | Does showing LLM findings to human reviewers anchor their judgment? | High |
| Per-type frequency in AI code | No study breaks down the 18-type taxonomy against AI-generated code specifically | High |
| Meaningless test detection | No automated method achieves d > 0.40; mutation testing is partial | Medium |
| Cost curve in CI/CD environments | Boehm's 100:1 escalation may be 10:1 in modern continuous deployment | Medium |
| Long-term codebase health | No longitudinal study tracks cumulative slop impact over 12+ months | High |
| Cross-model judge calibration | Which model pairs minimize correlation for code review specifically? | Medium |
| Agent gaming of quality gates | METR's 43x visibility effect has not been replicated for code quality (vs task scoring) | High |

---

## Sources

- [AgentSpec, ICSE 2026](https://arxiv.org/abs/2503.18666) -- Wang, Poskitt, Sun
- [Spotify Honk Part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)
- [Spotify Honk Part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)
- [METR Evaluation of o3](https://evaluations.metr.org/openai-o3-report/)
- [METR: Recent Frontier Models Are Reward Hacking](https://metr.org/blog/2025-06-05-recent-reward-hacking/)
- [Apollo Research: Stress Testing Deliberative Alignment](https://www.apolloresearch.ai/research/stress-testing-deliberative-alignment-for-anti-scheming-training/)
- [NIST CAISI: Examples of Cheating](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)
- [ETH Zurich: Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988)
- [Justice or Prejudice? LLM-as-a-Judge Biases, NeurIPS 2024](https://arxiv.org/abs/2410.02736)
- [Can You Trust LLM Judgments?](https://arxiv.org/abs/2412.12509)
- [Correlated Errors in Large Language Models](https://arxiv.org/html/2506.07962)
- [To Type or Not to Type, ICSE 2017](https://dl.acm.org/doi/10.1109/ICSE.2017.75)
- [Capers Jones: Software Defect Removal Efficiency](https://www.ppi-int.com/wp-content/uploads/2021/01/Software-Defect-Removal-Efficiency.pdf)
- [NIST Planning Report 02-3](https://www.nist.gov/document/report02-3pdf)
- [IBM Cost of a Data Breach 2025](https://www.ibm.com/reports/data-breach)
- [CodeRabbit: State of AI vs Human Code Generation](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- [GitClear: AI Copilot Code Quality 2025](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
- [Veracode 2025 GenAI Code Security Report](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/)
- [Debt Behind the AI Boom, arXiv 2026](https://arxiv.org/html/2603.28592v1)
- [Greptile AI Code Review Benchmarks 2025](https://www.greptile.com/benchmarks)
- [Littlewood, Popov, Strigini, Shryane. IEEE TSE 26(12), 2000](https://link.springer.com/chapter/10.1007/978-3-540-78917-8_12)
- [Reducing False Positives in Static Bug Detection, Tencent 2025](https://arxiv.org/html/2601.18844v1)
- [SAST Tools False Positive Comparison, Mobb 2024](https://www.mobb.ai/blog/sast-tools-false-positive-comparison)
- [The Hidden Cost of Slow Code Reviews, 8M PRs, LinearB 2026](https://vitalii4reva.medium.com/the-hidden-cost-of-slow-code-reviews-data-from-8-million-prs-9926849f1428)
