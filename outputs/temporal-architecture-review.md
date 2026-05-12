# Peer Review: Temporal Architecture of AI Coding Agent Harnesses

**Paper:** "Temporal Architecture of AI Coding Agent Harnesses: A Formal Framework for Iteration Speed, Caching, and the Speed-Quality Pareto Frontier"
**Author:** Prannay Agrawal
**Reviewer:** Simulated peer review (rigorous, skeptical)
**Date:** 2026-04-03

---

## Overall Assessment

This paper proposes Verified Iterations per Hour (VIH) as the correct optimization target for AI coding agent harnesses, then develops a formal framework drawing on scheduling theory, queueing theory, speculative execution, and cache competitive analysis. The synthesis is competent and occasionally insightful; the VIH reframing is useful, and the EOQ-analog for cache refresh is a genuinely nice connection. However, the paper has significant issues with empirical grounding (the calibration numbers are doing more load-bearing work than they can support), several formal claims that are weaker than presented, and a contrarian section that, while structurally honest, does not fully engage the strongest versions of the objections.

**Recommendation:** Major revision. The core framework is worth publishing, but the empirical calibration needs substantial honest downgrading, and several theorems need their assumptions stated more carefully.

---

## 1. Novelty and Significance

**Rating: MINOR issues**

The individual components (stochastic scheduling, queueing theory, speculative execution, competitive analysis) are well-known. The paper's contribution is the synthesis: applying these to AI agent harnesses and proposing VIH as the unifying metric. This is a legitimate contribution, and the paper is mostly honest about it (the [E]/[S]/[C] markers help).

However, VIH = throughput x quality is not a deep insight. It is the standard "effective throughput" decomposition found in any manufacturing engineering textbook (Hopp and Spearman, which the paper cites, covers this extensively). The unit-elasticity optimality condition (Theorem 5) is a first-order condition on a product of two functions, which is undergraduate calculus. The novelty claim should be scoped more carefully: the contribution is the *application domain* and the *specific calibration*, not the mathematical machinery.

The EOQ-analog for cache refresh (Theorem 6) is the most genuinely novel connection, and the paper should lean into this more heavily.

**Issue (MINOR):** The paper oversells the mathematical novelty. The theorems marked [S] are mostly straightforward applications of known results to a new domain. This is fine, but the rhetoric should match.

---

## 2. Formal Rigor

**Rating: MAJOR issues**

### 2a. Theorem 1 (Exponential Staleness Decay)

The proof is correct given its assumptions, but the assumptions are very strong and not adequately flagged:

- **Independence assumption:** Each change independently invalidates a fraction alpha of cached context. In practice, changes are highly correlated (a refactor touches many files; a bugfix touches one). Correlated changes would produce bursty invalidation, not smooth exponential decay. The paper acknowledges this only in the Limitations section; it should be a prominently stated assumption in the theorem.

- **Fixed alpha:** The disruption fraction alpha is treated as constant. In reality, alpha varies enormously: renaming a core interface invalidates far more context than editing a comment. The multi-exponential extension in Appendix B acknowledges this but does not propagate the correction back into the main results, which all use the single-rate model.

**Issue (MAJOR):** Theorem 1's assumptions (independent changes, constant alpha) are unrealistic for the domain, and the main calibration results depend on them. The paper needs to either (a) propagate the multi-exponential model into the main results, or (b) explicitly bound the error introduced by the single-rate approximation.

### 2b. Theorem 3 (Speculation Ratio Test)

The proof sketch is correct, but the formulation elides an important subtlety. The "rollback penalty" R is defined as E[d_i + t_i^retry], where d_i is presumably detection/cleanup cost. But in agent pipelines, rollback is not clean: speculative execution may have written files, triggered CI, sent messages, or updated state. The "Spectre analogy" section (Section 5.3) correctly identifies this, but the formal model does not account for it. The theorem is stated as if rollback cost is a known scalar, when in practice it is highly state-dependent and often unknown ex ante.

**Issue (MAJOR):** The speculation ratio test assumes rollback cost R is known and well-defined. In practice, rollback cost in agent pipelines is state-dependent and often has a heavy tail. The theorem should state this as an assumption, and the calibration should discuss sensitivity to R.

### 2c. Epistemic Markers

The [E]/[S]/[C] system is a good idea and mostly used honestly. One exception:

- Theorem 2 (VIH Decomposition) is marked [S] but is trivially true by definition (VIH = verified/time = total/time x verified/total). This should be marked [E] or simply stated as a definition, not a theorem. Calling it a theorem inflates the apparent contribution.

**Issue (MINOR):** Theorem 2 is definitional, not a synthesis result.

### 2d. VIH Optimal Speed (Theorem 5)

The theorem assumes p_verify is a smooth, differentiable, monotonically decreasing function of lambda_raw. This is a strong functional form assumption. In practice, verification pass rates may have discontinuities (e.g., dropping a verification stage entirely causes a step change). The exponential degradation model is convenient but unjustified beyond a single citation to Yerkes-Dodson, which is about animal behavior under electric shock, not software quality under time pressure.

**Issue (MAJOR):** The exponential degradation model for p_verify(lambda) is assumed without adequate justification. The paper should either provide direct empirical evidence for this functional form in agent pipelines, or clearly mark it as a modeling choice with unknown error.

---

## 3. Empirical Grounding

**Rating: MAJOR issues (bordering on FATAL for some claims)**

This is the paper's weakest dimension. The calibration numbers are presented with a precision that suggests empirical measurement, but most are derived from secondary sources through chains of interpretation, not from direct measurement.

### 3a. The 17.1% "Fresh Eyes" Advantage

This number is the linchpin of the context freshness model, the persistent-state-is-VIH-negative finding, and the 12.3% threshold. It comes from Suzgun and Kalai (2024), a paper about meta-prompting (decomposing tasks across expert instances). The paper interprets "fresh expert instances outperform accumulated-context prompting by 17.1%" as measuring context staleness. But meta-prompting's advantage likely comes from *task decomposition and specialization*, not from context freshness per se. A fresh expert instance has both fresh context AND a narrower task scope. The paper conflates these two effects.

**Issue (MAJOR):** The 17.1% figure is reinterpreted from a meta-prompting paper to measure context staleness. This conflation is not justified. The "Fresh Eyes" advantage likely includes task decomposition effects that are not related to context decay. Since this number is load-bearing (it determines the 12.3% threshold, the VIH-negativity of persistent state, and the calibrated decay rate Lambda), the error propagates throughout the paper.

### 3b. The Stage Parameters (Table 1)

The paper presents specific means, standard deviations, failure rates, and distribution families for six pipeline stages, sourced as "empirical" from GSD. But:

- No sample size is given. Are these from 10 runs? 1000?
- No confidence intervals.
- No description of measurement methodology.
- The choice of log-normal distributions for all stages is stated without justification or goodness-of-fit testing.

If these are rough estimates from the author's experience running GSD, they should be presented as such, not as "empirical stage parameters."

**Issue (MAJOR):** Table 1 presents calibration numbers without sample sizes, confidence intervals, or methodology. If these are estimates, they should be labeled as estimates. If they are measurements, the methodology should be described.

### 3c. The 92% Cache Hit Rate

Cited from Anthropic's 2026 agentic coding trends report. This is a vendor-reported statistic about their own product. It may be accurate, but using a vendor's self-reported number as a calibration input without caveat is not best practice.

**Issue (MINOR):** Vendor-reported statistics should be flagged as such.

### 3d. The 34% Cycle Time Reduction

The headline finding ("VIH-optimal strategy reduces cycle time by 34%") is computed by summing three independent optimizations (speculative pipelining 8.5 min, tiered verification 4.8 min, async governance 8.0 min = 21.3 min, though the table says 19.3 min). The summation assumes these optimizations are additive, with no interaction effects. In practice, speculative pipelining and tiered verification interact (speculation accuracy depends on verification depth), and async governance changes the pipeline structure that speculation operates on.

**Issue (MAJOR):** The 34% reduction assumes additivity of independent optimizations. No interaction analysis is provided. The discrepancy between 21.3 min (sum of components) and 19.3 min (stated combined saving) is unexplained.

### 3e. Cherry-Picking Concern

The paper calibrates against GSD (45-60 min cycles), Claude Code (92% cache hit rate), SWE-bench (80.9% resolve rate), and Devin (67% merge rate). Each number is drawn from a different system, at a different time, under different conditions. The paper uses whichever system provides the most convenient number for each parameter. This is not outright dishonest (the sources are cited), but it means the "calibrated" model has never been validated against any single system end-to-end.

**Issue (MAJOR):** The calibration is a patchwork of numbers from different systems. No single system has been measured end-to-end against the model's predictions.

---

## 4. Logical Gaps and Unsupported Claims

### 4a. "VIH is the correct optimization target"

The paper asserts this but does not prove it. VIH ignores: cost per iteration, severity of failures that escape verification, long-term code maintainability, developer experience, and architectural quality. The Limitations section acknowledges some of this, but the title, abstract, and introduction all present VIH as *the* correct target, not *a useful* target.

**Issue (MAJOR):** The paper claims VIH is "the correct optimization target" (abstract, intro, conclusion) but does not justify this claim against alternatives. A more defensible claim would be that VIH is a useful intermediate metric that captures one important tradeoff.

### 4b. The 12.3% Threshold

This is presented as if it were a general finding, but it is entirely parameter-dependent: 12.3% = 7.0 min / 56.8 min. Change the cycle time or the time saved by persistent state, and the threshold changes. This is fine as an illustrative calculation, but the paper elevates it to a "design principle" (Principle 6) without noting its sensitivity to input parameters.

**Issue (MINOR):** The 12.3% threshold is parameter-specific, not a general result. It should be presented as an example calculation, not a fixed threshold.

### 4c. Prop 2 (Speed-Quality Tradeoff) as [C]

The proposition states "in general, p_verify is a decreasing function of lambda_raw" and marks it as [C] (conjecture). The supporting evidence is: DORA 2025, GitClear, and Yerkes-Dodson. But DORA measures organizational metrics (not per-iteration quality), GitClear measures code churn (not verification pass rates), and Yerkes-Dodson is about mice and electric shocks. None directly measures the relationship between iteration speed and verification pass rate in agent pipelines. The [C] marking is honest, but the evidence paragraph oversells its relevance.

**Issue (MINOR):** The evidence for the speed-quality tradeoff is indirect. The [C] marking is appropriate, but the evidence discussion should be more forthright about its indirectness.

### 4d. Amdahl's Law Application (Section 4.3)

The paper applies Amdahl's Law with f = 0.20 (verification as serial fraction) and uses Devin's 67% PR merge rate as a proxy for p_verify. These are from different systems. Applying Amdahl's Law also assumes that non-verification stages can be fully parallelized, which is false (execution depends on planning, which depends on research). The bound VIH_max = 4.0 is thus doubly unreliable.

**Issue (MINOR):** The Amdahl's Law bound mixes parameters from different systems and assumes full parallelizability of non-verification stages.

---

## 5. Missing Related Work

### 5a. Software estimation literature

The paper's core concern (how fast can you go without sacrificing quality) has a deep literature in software estimation and lean software development. McConnell's *Software Estimation: Demystifying the Black Art* (2006) and Reinertsen's *The Principles of Product Development Flow* (2009) are directly relevant. Reinertsen in particular formalizes the cost-of-delay framework that is structurally similar to VIH.

**Issue (MAJOR):** Reinertsen's *Principles of Product Development Flow* (2009) is a major omission. His cost-of-delay and batch-size optimization framework is the direct ancestor of the paper's approach, applied to product development rather than agent pipelines.

### 5b. Multi-armed bandit / explore-exploit

The mode selection problem (Section 7) is structurally an explore-exploit problem. The paper uses a Bayesian decision framework but does not engage the bandit literature (Thompson sampling, UCB), which provides online learning approaches that avoid the feature engineering problem the paper identifies.

**Issue (MINOR):** The bandit literature is relevant to mode selection and is not cited.

### 5c. Concurrent work on agent scheduling

The paper cites Sherlock (2025) and ContextBranch (2025) in the bibliography but does not discuss them in the text. If they are relevant enough to cite, they should be discussed; if not, they should be removed.

**Issue (MINOR):** Phantom citations in the bibliography (cited but not discussed).

### 5d. Empirical software engineering on AI code quality

The paper cites DORA 2025 and GitClear but misses several relevant empirical studies on AI-assisted code quality, including Murali et al. (2024) on Copilot code quality, and the growing body of work on LLM-generated code maintainability.

**Issue (MINOR):** Missing recent empirical work on AI-generated code quality.

---

## 6. Writing Quality

**Rating: MINOR issues**

The paper is well-organized, clearly written, and appropriately formal. The [E]/[S]/[C] epistemic markers are a genuine contribution to honest scientific communication. The contrarian section is structurally laudable. A few notes:

- The abstract is too long and tries to include every result. A shorter abstract focusing on VIH and one or two key findings would be more effective.
- Section 5.3 (Spectre analogy) is well-written but slightly overextended. The analogy is made clearly in two sentences; the enumerated list of risks could be compressed.
- The paper uses "we" throughout but has a single author. This is standard in mathematics but slightly awkward in CS.
- Some notation is introduced and used only once (e.g., MRS is defined in the preamble but never used in the text).

**Issue (MINOR):** Abstract too long; unused notation (MRS macro defined but apparently not used); minor verbosity in Section 5.3.

---

## 7. Contrarian Engagement

**Rating: MAJOR issues**

The contrarian section (Section 9) is structurally honest: it names five objections and responds to each. However, it does not engage the strongest versions of several objections.

### 7a. "Speed kills quality" is engaged too gently

The strongest version of this argument is not Yerkes-Dodson or incubation effects. It is that *verification itself becomes less reliable under time pressure*, creating a feedback loop: faster iterations produce lower quality, AND the verification that would catch the quality loss is itself degraded. VIH assumes p_verify is observable and accurate; if verification quality degrades with speed, VIH is systematically overestimated at high speeds. The paper does not address this.

**Issue (MAJOR):** The contrarian section does not engage the strongest form of the speed-kills-quality argument: that verification fidelity itself degrades with speed, causing VIH to be overestimated.

### 7b. "Fresh Eyes is worth the cost" is well-handled

The paper acknowledges the 17.1% advantage and correctly identifies that naive persistent state is VIH-negative. This is the strongest contrarian engagement in the paper.

### 7c. "Mode selection is hard to automate" is underdeveloped

The Bainbridge reference is appropriate, but the paper does not engage with the deeper problem: mode selection requires understanding *what the task is*, which requires doing some of the task, which means the mode selection overhead is not fixed but scales with task complexity. The SPRT extension in Appendix B partially addresses this but is buried.

**Issue (MINOR):** The mode selection contrarian engagement would be stronger if the SPRT adaptive approach were in the main text rather than the appendix.

### 7d. Missing contrarian: "VIH is the wrong metric"

The most fundamental objection to the paper is not engaged at all: that VIH is the wrong optimization target. A critic could argue that the correct target is *value delivered per unit cost* (which includes developer time, compute cost, and opportunity cost of architectural debt). VIH treats all verified iterations as equally valuable, which they are not.

**Issue (MAJOR):** The paper does not engage the most fundamental contrarian position: that VIH is itself an incomplete metric. This is more important than any of the five objections the paper does address.

---

## Summary of Issues

### FATAL

None. The paper is not fatally flawed; its framework is useful and mostly honest.

### MAJOR

1. **Theorem 1 assumptions** (independence, constant alpha) are unrealistic and load-bearing.
2. **The 17.1% figure is misinterpreted** from a meta-prompting paper; conflates task decomposition with context freshness.
3. **Table 1 has no sample sizes, CIs, or methodology.**
4. **The 34% reduction assumes additivity** of interacting optimizations.
5. **Calibration is a patchwork** from different systems, never validated end-to-end.
6. **VIH is claimed as "the correct" target** rather than "a useful" target.
7. **Reinertsen's cost-of-delay framework** is a major omission from related work.
8. **The contrarian section misses the verification-fidelity feedback loop** and does not engage the objection that VIH itself is incomplete.
9. **The exponential degradation model for p_verify(lambda)** is assumed without direct empirical support.
10. **Speculation ratio test assumes known, scalar rollback cost**, which is unrealistic.

### MINOR

1. Mathematical novelty is oversold; most theorems are straightforward applications.
2. Theorem 2 is definitional, not a synthesis result.
3. The 12.3% threshold is parameter-specific, not general.
4. Evidence for speed-quality tradeoff (Prop 2) is indirect.
5. Amdahl's Law bound mixes parameters from different systems.
6. Missing bandit literature for mode selection.
7. Phantom bibliography entries (cited but not discussed).
8. Abstract too long; unused MRS macro; minor verbosity.
9. Vendor-reported statistics should be flagged.
10. Missing recent empirical work on AI code quality.

---

## Recommendation

**Major revision.** The framework is useful and the paper is worth publishing, but it needs:

1. Honest downgrading of the empirical calibration from "calibrated against production data" to "illustrative calibration using estimates from multiple sources."
2. Corrected interpretation of the 17.1% figure, or replacement with a more appropriate source.
3. Sample sizes and methodology for Table 1, or explicit labeling as estimates.
4. Interaction analysis for the combined optimization strategies.
5. Scoping VIH as "a useful metric" rather than "the correct target."
6. Engaging the verification-fidelity feedback loop and the "VIH is incomplete" objection in the contrarian section.
7. Adding Reinertsen to the related work.
8. Propagating the multi-exponential model into at least a sensitivity analysis, or bounding the single-rate approximation error.

The strongest parts of the paper (the EOQ-analog cache theorem, the speculation depth limit, the [E]/[S]/[C] epistemic markers, and the honest treatment of the Fresh Eyes objection) should be preserved and emphasized. The weakest part (the precise numerical calibration) should be reframed as illustrative rather than definitive.
