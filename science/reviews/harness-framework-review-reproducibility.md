# Peer Review: Reproducibility Assessment

**Paper:** "A Formal Framework for AI Coding Agent Harness Architecture"
**Authors:** Pragnition Labs (anonymized)
**Reviewer:** Reviewer 5 (Reproducibility)
**Date:** 2026-04-03

---

## 1. Summary

This paper presents a ten-pillar formal framework for AI coding agent harness architecture, applying information theory, reliability theory, control theory, and related mathematical machinery to the problem of harness design. The framework spans 4795 lines of LaTeX (~426KB), includes 63 formal results across 10 pillars, and proposes 35 design principles. The paper draws on a mix of well-established mathematical results, industry reports, and recent empirical studies to construct what it calls "engineering hypotheses" amenable to future testing.

From a reproducibility standpoint, this is a primarily theoretical paper with no accompanying code, data, or experimental artifacts. It cites empirical sources to calibrate its formal models but conducts no original experiments. The paper is admirably transparent about this gap, with an entire section (Section 10, "Empirical Foundations") cataloguing evidence quality in a four-tier scheme and a detailed verification roadmap (Section 12.3) proposing five falsifiable experiments. This transparency is rare and commendable, but it does not substitute for the missing evidence.

---

## 2. Reproducibility Assessment

### 2.1 What CAN Be Reproduced

**Mathematical results (high reproducibility).** The purely mathematical claims (compound error sensitivity with elasticity n, Shannon chain rule decomposition, AM-GM weakest-link theorem, KKT equal marginal rate, Jevons condition) are standard derivations from established theory. Any researcher with a graduate-level background in information theory and optimization can verify these. The proofs are provided as sketches, but the full versions in Appendix C are sufficiently detailed. I spot-checked the compound error sensitivity proof, the submodularity argument, and the KKT derivation; all are correct.

**The epistemic register system.** The paper's three-register system (Mathematical Fact / Engineering Hypothesis / Philosophical Observation) is well-executed. Where I checked, the register labels were accurate. This is the single best reproducibility feature of the paper: it lets a reader know exactly which claims are definitional, which are testable, and which are speculative.

**The verification roadmap.** Section 12.3 provides concrete experimental designs with falsification criteria for the five most important results. These experiments are well-specified enough that an independent team could execute them. The estimated resource requirements (\$5K-\$50K in API costs, 3-18 months) are realistic.

**April 2026 pricing data (Economics pillar).** The pricing table in Section 8.11 (Claude Opus 4 at \$15/Mtok, Sonnet 4 at \$3/Mtok, GPT-4.1 at \$2/Mtok, Gemini 2.5 Pro at \$1.25/Mtok, etc.) is verifiable against current public pricing pages and appears accurate as of the paper's date.

### 2.2 What CANNOT Be Reproduced

**Optimal context budget (0.15W-0.40W).** This claim is derived from a power-law degradation model fit to three data points from a single model (Llama-3.1-70B), sourced from Du et al. 2025. The paper itself acknowledges this is "Very Low" evidence quality. The degradation function parameters have wide ranges (alpha in [0.3, 0.5], W_eff in [0.1W, 0.7W]) that are insufficiently constrained. No code for the model fitting is provided. An independent researcher could not reproduce these estimates without the raw data and fitting procedure.

**The "8x increased duplication" claim.** The paper states code blocks with 5+ duplicated lines "increased approximately 8x." The GitClear 2025 report uses the phrase "4x growth in code clones" in its title and reports duplication rising from 8.3% to 12.3%. The 8x figure appears to refer to the count of duplicated code blocks specifically (not the overall rate), which is a different metric. The paper's phrasing could lead readers to conflate the overall duplication rate increase (which is ~1.5x, from 8.3% to 12.3%) with the block-count increase (which may be the 8x figure). The attribution is not wrong per se, but the presentation risks overstatement.

**"40-60% of committed code is AI-generated."** The abstract states this as a converging estimate. The cited sources: GitClear 2025 does not directly measure the percentage of AI-generated code; SonarSource 2026 reports 42%; GitHub 2024 reports 46% of code written by Copilot users (not of all committed code). The range is a synthesis of non-comparable metrics from different methodologies. An independent researcher would struggle to derive "40-60%" from the cited sources alone.

**VIH (Verified Iterations per Hour).** The paper acknowledges VIH has "never been measured in any production harness." This is a proposed metric, not an empirical finding. It cannot be reproduced because it has never been produced.

**Governance capacity bound calibration.** R_drift and C_gov lack operational definitions with demonstrated inter-rater reliability. The paper acknowledges this. The bifurcation threshold (mu*G / gamma_g*R = 1) is a theoretical construction with no empirical calibration.

**The Accretion Category.** Proposed but unvalidated. No labeled dataset exists. No precision/recall measurements have been made.

**Thinker placements in sigma-kappa space.** The paper places Dijkstra, Hoare, Lamport, Knuth, and Brooks at specific coordinate ranges. The paper explicitly flags these as "ordinal illustrations, not measurements" and notes they are "not stable across formalizations." This is honest, but the presentation in a numbered table with two-decimal-place ranges (e.g., Lamport at sigma 0.75-0.80, kappa 0.80-0.90) creates an impression of precision that the underlying formalism does not support. These placements are inherently subjective and unreproducible.

**Pipeline stage parameters (Appendix B.5).** The GSD pipeline parameters (context loading: mu=10.0 min, sigma=2.0 min, q=0.02; etc.) are described as "derived from reported ranges; no controlled measurement." These are estimates, not measurements. No source data is cited for any individual parameter.

### 2.3 Partially Reproducible Claims

**JetBrains "removing 52% of context tokens improved performance by 2.6%."** I could not find this specific claim in any JetBrains publication. JetBrains published a blog post "Cutting Through the Noise: Smarter Context Management for LLM-Powered Agents" (December 2025) discussing context optimization, but the specific 52%/2.6% figures were not locatable. The citation `jetbrains2025complexity` has a vague title ("Code Complexity and AI Assistance Study") with no URL or publication venue. This requires clarification from the authors.

**Kim et al. 2025 error amplification of 17.2x.** The paper "Towards a Science of Scaling Agent Systems" (Kim et al., arXiv:2512.08296) is real and does report scaling data, but there is a discrepancy in the bibliography. The bib entry `Kim2025` has the title "Advances in AI-Assisted Software Engineering" while `kim2025scaling` has "Scaling LLM-Based Multi-Agent Systems for Software Engineering" listed as ICML. The actual paper is an arXiv preprint, not an ICML publication. The 17.2x figure and the 45% saturation threshold appear consistent with the source, but the bibliographic metadata is inaccurate.

---

## 3. Citation Audit

I spot-checked 15 citations using web search. Results below.

### Verified (citation exists, claim is accurately attributed)

| # | Citation | Claim in Paper | Verification Status | Severity |
|---|----------|----------------|---------------------|----------|
| 1 | GitClear 2025 | 211M lines, duplication from 8.3% to 12.3%, refactoring collapsed from 25% to under 10% | **VERIFIED.** All figures match the primary source. The "8x" refers to block counts, not rates. | MINOR (imprecise attribution of 8x) |
| 2 | DORA 2025 | Individual task completion +21%, organizational throughput flat, negative correlation with stability | **VERIFIED.** The negative relationship finding is confirmed by multiple summaries of the DORA report. | CLEAN |
| 3 | GitHub 2024 RCT | Copilot generates 46% of code for users | **VERIFIED.** The 46% acceptance rate is widely reported. Note: this is 46% of code *for Copilot users*, not 46% of all committed code. | CLEAN |
| 4 | Liu et al. 2024 "Lost in the Middle" | U-shaped positional recall, models miss information in the middle of long contexts | **VERIFIED.** Published in TACL 2024, code and data available on GitHub. | CLEAN |
| 5 | Bainbridge 1983 "Ironies of Automation" | Automation paradox, operators lose skills | **VERIFIED.** Automatica 19(6):775-779, 1983. A landmark paper. | CLEAN |
| 6 | Newcombe et al. 2015 | AWS uses TLA+, formal methods at Amazon | **VERIFIED.** CACM 58(4):66-73, 2015. | CLEAN |
| 7 | SonarSource 2026 | Architecture gap, AI accounts for 42% of committed code | **VERIFIED.** The blog post and survey exist. The 42% figure is from the State of Code Developer Survey 2026. | CLEAN |
| 8 | Apollo Research 2025 | In-context scheming, o3 covert action rate 13% | **VERIFIED.** The paper is on arXiv (2412.04984). The 13% figure for o3 before anti-scheming training is confirmed. | CLEAN |
| 9 | METR 2026 SWE-bench | ~50% of test-passing PRs would not be merged; 68% of human golden patches would be merged on re-review | **VERIFIED.** METR blog post from March 2026 confirms these figures. | CLEAN |
| 10 | NIST CAISI 2025 | Agents commenting out assertions, downloading solutions, crashing servers via /dev/urandom | **VERIFIED.** NIST CAISI blog post "Cheating On AI Agent Evaluations" documents these specific behaviors. | CLEAN |
| 11 | Gloaguen et al. 2026 | AGENTS.md LLM-generated context reduced success rates by 3%, increased costs by 20% | **VERIFIED.** ETH Zurich paper on arXiv (2602.11988). The -3% and +20% cost figures match. | CLEAN |
| 12 | Chroma 2025 "Context Rot" | 18 models, monotonic degradation with context length | **VERIFIED.** Technical report at research.trychroma.com, GitHub repo available for replication. | CLEAN |
| 13 | CodeRabbit 2025 | 470 PRs, 1.68x more issues, 2.74x more XSS | **VERIFIED.** The report uses "1.7x" (10.83 vs 6.45 issues/PR). The 2.74x XSS figure is confirmed. | CLEAN |
| 14 | Gonzalez 2026 "Sufficiently detailed spec is code" | Thesis that sufficiently detailed specs converge to code | **VERIFIED.** Blog post by Gabriella Gonzalez on Haskell for All, March 2026. Note: the blog post actually *argues against* the naive version of this claim; the paper's citation is more nuanced. | CLEAN |
| 15 | Hindle et al. 2012 "On the Naturalness of Software" | Code has lower entropy than English prose | **VERIFIED.** Originally ICSE 2012, later in CACM 2016. The claim that code is repetitive and has low entropy is the paper's central finding. | CLEAN |

### Issues Found

| # | Citation | Issue | Severity |
|---|----------|-------|----------|
| A | `jetbrains2025complexity` | **Unverifiable.** Vague title "Code Complexity and AI Assistance Study." No URL, no publication venue. The specific claim (removing 52% of context tokens improved performance by 2.6%) could not be located in any JetBrains publication. | **MAJOR** |
| B | `Kim2025` vs `kim2025scaling` | **Bibliographic inconsistency.** Two bib entries appear to reference the same research group but with different titles. `Kim2025` says "Advances in AI-Assisted Software Engineering" (generic). The actual paper is "Towards a Science of Scaling Agent Systems" (arXiv:2512.08296). Listed as ICML proceedings in `kim2025scaling` but it is an arXiv preprint. | **MAJOR** |
| C | `humanlayer2025skillissue` | **Partially verifiable.** HumanLayer's blog post "Writing a good CLAUDE.md" exists, but the specific document titled "The Skill Issue in AI Agent Development" was not found as a standalone publication. The CLAUDE.md-under-60-lines claim is consistent with HumanLayer's recommendations. | **MINOR** |
| D | `cemri2025multiagent` | **Incomplete citation.** Listed as "Cemri and others, Multi-Agent Software Engineering Coordination, 2025." No venue, no URL, no arXiv ID. A separate entry `Cemri2025` exists with "Multi-Agent Coordination for Software Engineering, arXiv preprint." Duplicate and vague. | **MINOR** |
| E | Multiple auto-generated entries | The bib file contains a comment "Auto-generated BibTeX entries for missing citation keys, Generated 2026-04-03." These entries (ji2026dualspec, jina2025submodular, lifshitz2025mav, etc.) have suspiciously vague metadata: "others" as co-authors, "arXiv preprint" with no ID, no page numbers. At least some appear to be placeholder entries rather than references to real publications. | **MAJOR** |
| F | `contextdiscipline2025` | **Phantom citation.** Author is "Various," title is "Context Discipline in LLM-Assisted Development," published as "Industry practice report." No URL, no specific publication. This looks like a placeholder for general practitioner wisdom, not a citable source. | **MINOR** |
| G | `debtboom2026` | **Phantom citation.** Author is "Industry Reports," title is "The AI Technical Debt Boom," published as "Industry analysis." No specific document is identified. | **MINOR** |
| H | `McKinney2026` | **Phantom citation.** "McKinney and others, State of AI-Assisted Software Engineering, Industry report." No specific organization, URL, or publication venue. | **MINOR** |

### Citation Audit Summary

- **11 of 15 spot-checked primary citations: CLEAN** (accurately attributed, source exists and is findable)
- **2 MAJOR issues**: JetBrains unverifiable claim (52%/2.6%), bibliographic inconsistency/mislabeling for Kim et al.
- **1 MAJOR concern**: Auto-generated bib entries with suspiciously vague metadata that may not correspond to real publications
- **5 MINOR issues**: Phantom "industry practice" citations with no specific source, incomplete metadata for real papers, slightly imprecise attribution of the 8x duplication figure

---

## 4. Missing Artifacts

The following artifacts are absent from the repository and would be needed for full reproducibility:

1. **No code.** There is no implementation of any formal model, no simulation code for the compound error sensitivity predictions, no optimization solver for the Token Budget Allocation Problem, no curve-fitting code for the degradation function, and no implementation of the CVIH metric. The repository contains only LaTeX source, bibliographic files, and markdown research notes.

2. **No data.** There are no raw datasets, no processed datasets, no CSV files, no Jupyter notebooks. The degradation function is fit to "three data points from a single model" but those data points are not provided in machine-readable form.

3. **No simulation or numerical verification.** The paper makes numerous quantitative predictions (e.g., "at p=0.95 and n=20, R(20) = 0.36"; "a 50% budget cut retains 65-80% of the log-quality"). These are simple calculations, but no code verifies them. A supplementary notebook performing these calculations would strengthen confidence.

4. **No reference implementation of any design principle.** The 35 design principles are stated abstractly. No harness code demonstrates their implementation.

5. **No experimental protocol scripts.** The verification roadmap (Section 12.3) describes five experiments in detail, but there are no protocol scripts, no benchmark definitions, no evaluation harness code.

---

## 5. Verdict

**Weak Reject.**

**Rationale.** This is an ambitious, intellectually serious framework paper that applies established formal machinery to a genuinely important problem. The mathematical contributions are correct, the epistemic register system is exemplary, the evidence quality self-assessment is unusually honest, and the verification roadmap shows the authors understand what validation would look like.

However, from a reproducibility standpoint, the paper fails on multiple counts:

- **Zero accompanying artifacts.** No code, no data, no simulations, no reference implementation. For a paper that claims to yield "testable predictions and design principles with information-theoretic justifications," the complete absence of any testable artifact is a significant gap. The predictions are testable *in principle*, but the paper provides no tools to test them.

- **Multiple bibliographic integrity issues.** At least one key empirical claim (JetBrains 52%/2.6%) is unverifiable. Several bibliography entries appear to be auto-generated placeholders rather than references to real publications. The Kim et al. entry has inconsistent metadata. These issues undermine confidence in the evidentiary foundation.

- **Core quantitative claims rest on Very Low evidence.** The paper's own evidence quality table (Table 4) classifies 6 of its central claims as "Very Low" (theoretical prediction only, no direct empirical measurement). While the paper is transparent about this, a framework paper that positions itself as a "science" should have at least one pillar grounded in original empirical data.

- **The "empirical validation program" is entirely aspirational.** The verification roadmap is well-specified but unexecuted. The five proposed experiments have estimated timelines of 3-18 months and costs of \$5K-\$50K. None have been started.

The paper sits in an awkward position: too empirically grounded in its rhetoric to be judged purely as theory, too devoid of data to be judged as empirical science. The mathematical results are correct but unsurprising (compound error sensitivity is a differentiation identity; the Shannon chain rule is a textbook equality). The genuinely novel contribution is the *application* and *synthesis*, which requires empirical grounding to be evaluated.

I would upgrade to Weak Accept if the authors:
(a) provide supplementary code verifying all numerical claims,
(b) fix the bibliographic issues (remove or properly source all phantom citations),
(c) execute at least one experiment from the verification roadmap (the context budget experiment is cheapest at \$5-15K), and
(d) release the degradation model fitting code and data.

---

## 6. Revision Plan for Reproducibility

### Tier 1: Required for Acceptance (estimated effort: 2-4 weeks)

1. **Fix bibliographic integrity.**
   - Locate the primary source for the JetBrains 52%/2.6% claim or remove it. If the claim comes from JetBrains' December 2025 "Cutting Through the Noise" blog post, cite it specifically with a URL.
   - Resolve the Kim2025/kim2025scaling duplication. Use the correct arXiv ID (2512.08296) and correct the venue (it is not ICML proceedings).
   - Replace or remove all phantom citations (contextdiscipline2025, debtboom2026, McKinney2026) with either specific primary sources or explicit acknowledgment that these are practitioner consensus without a citable source.
   - Audit all auto-generated bib entries. For each one, either locate the actual paper and provide an arXiv ID/DOI/URL, or remove the citation and rephrase the text.

2. **Provide a supplementary computational notebook.**
   - A Jupyter notebook or equivalent that computes all numerical examples in the paper: compound error tables, degradation function fits, TBAP optimization, CVIH curves, the Jevons elasticity calculation, the QAS worked example.
   - This verifies that the numbers in the paper are not transcription errors and gives future researchers a starting point.

3. **Clarify the 40-60% and 8x claims.**
   - The "40-60% of committed code is AI-generated" synthesis conflates different metrics from different sources. State each source's metric precisely and note that they are not directly comparable.
   - Clarify that the "8x" refers to the count of duplicated code blocks, not the overall duplication rate (which went from 8.3% to 12.3%, approximately 1.5x).

### Tier 2: Strongly Recommended (estimated effort: 1-3 months)

4. **Release degradation model fitting code and data.**
   - The three data points from Llama-3.1-70B used to fit the power-law degradation model.
   - The fitting procedure (least squares? maximum likelihood?).
   - Sensitivity analysis showing how the optimal context budget changes with alpha and W_eff.

5. **Execute the cheapest verification experiment.**
   - Experiment 2 (context budget validation) is estimated at \$5-15K and 2-4 months. Even a scaled-down version (50 tasks, 2 models, 5 context sizes) would provide preliminary validation.
   - Positive or negative results both strengthen the paper: positive results validate the framework; negative results demonstrate honest falsification.

6. **Provide formal definitions for currently undefined operational quantities.**
   - R_drift: operational measurement procedure with inter-rater reliability target.
   - C_gov: same.
   - VIH: instrument one production harness and report initial measurements.

### Tier 3: Ideal (estimated effort: 6-12 months)

7. **Build and release a reference harness.**
   - Implement the three-tier information architecture, the four-layer verification stack, and the token budget optimizer.
   - Demonstrate that the framework's predictions hold (or fail) in a real harness.

8. **Execute the full verification roadmap.**
   - All five experiments in Section 12.3, producing a companion empirical paper.

---

## Appendix: Detailed Citation Spot-Check Log

| Citation Key | Claimed Source | Web Search Result | Status |
|-------------|---------------|-------------------|--------|
| gitclear2025 | gitclear.com/ai_assistant_code_quality_2025_research | Found at that URL; 211M lines confirmed | Verified |
| dora2025 | cloud.google.com announcement | Found; negative stability correlation confirmed | Verified |
| github2024rct | GitHub blog | Found; 46% acceptance rate for Copilot users confirmed | Verified |
| liu2024lost | TACL 2024 | Found; arXiv:2307.03172; code on GitHub | Verified |
| bainbridge1983ironies | Automatica 19(6) | Found; ScienceDirect confirms | Verified |
| newcombe2015amazon | CACM 58(4) | Found; multiple mirrors | Verified |
| sonar2026 | sonarsource.com blog | Found; 42% AI code figure confirmed from survey | Verified |
| apollo2025scheming | Apollo Research | Found; arXiv:2412.04984; 13% o3 covert rate confirmed | Verified |
| metr2026swebench | METR blog | Found; March 2026; ~50% not merged, 68% baseline confirmed | Verified |
| nist2025cheating | NIST CAISI blog | Found; /dev/urandom, test modification documented | Verified |
| gloaguen2026agents | ETH Zurich / SRI Lab | Found; arXiv:2602.11988; -3% and +20% cost confirmed | Verified |
| chroma2025contextrot | research.trychroma.com | Found; 18 models, GitHub repo for replication | Verified |
| coderabbit2025 | CodeRabbit report | Found; 470 PRs, 1.7x issues, 2.74x XSS confirmed | Verified |
| gonzalez2026spec | Haskell for All blog | Found; March 2026 | Verified |
| hindle2012naturalness | ICSE 2012 / CACM 2016 | Found; low entropy finding confirmed | Verified |
| jetbrains2025complexity | Unknown | NOT FOUND: no matching publication | **UNVERIFIED** |
| Kim2025 | "Advances in AI-Assisted SE" | Mismatch: actual paper is "Towards a Science of Scaling Agent Systems" | **MISLABELED** |
| contextdiscipline2025 | "Various, Industry practice report" | NOT FOUND: phantom citation | **PHANTOM** |
| debtboom2026 | "Industry Reports, Industry analysis" | NOT FOUND: phantom citation | **PHANTOM** |
