# Peer Review: "Towards a Science for AI Coding Agent Harnesses"

**Reviewer:** Dr. Marcus Chen, Microsoft Research (Developer Productivity Group)
**Date:** 2026-04-03
**Recommendation:** Major Revision

---

## Summary

This paper synthesizes seven "pillar papers" into a unified formal framework for AI coding agent harness architecture. It applies established mathematical machinery (information theory, reliability theory, control theory, lattice theory, computability theory) to the problem of designing the scaffolding around AI coding agents. The paper identifies cross-pillar connections, derives 11 design principles, and proposes a 5-experiment verification roadmap.

The ambition is commendable. The presentation is thorough and generally honest about limitations. But the central tension of the paper is never adequately resolved: it claims to be "towards a science," yet almost none of the quantitative predictions have been tested against reality. The paper is mathematics in search of data, and the question is whether the mathematics is pointed in the right direction.

---

## 1. Empirical Citation Accuracy

### GitClear 2025

**Rating: MINOR**

The paper cites GitClear's finding as "code blocks with five or more duplicated lines increased approximately 8x" and reports the overall duplication rate rising from 8.3% to 12.3%. This is correctly characterized as an observational study of 211 million changed lines. The paper appropriately notes that this is observational with no causal identification. However, the paper repeatedly uses the GitClear data to support causal claims about AI-generated code (e.g., "the primary driver of the GitClear observations" in the Accretion Category discussion, Section 7.9). The GitClear study cannot distinguish between AI-caused duplication and a secular trend toward copy-paste coding that was already underway and merely accelerated. The paper should be more careful about the inferential distance between the observed correlation and the causal mechanism it proposes.

The refactoring collapse figure ("from 25% to under 10%") is correctly reported. But the implication that AI tools caused this collapse, rather than that teams adopting AI tools were already deprioritizing refactoring (selection bias), is stated more confidently than the data supports.

### DORA 2025

**Rating: MAJOR**

The paper states: "DORA 2025 reported that individual task completion increased 21% with AI adoption, while organizational-level throughput stayed flat and software delivery stability showed a negative correlation with AI usage." This characterization requires scrutiny.

The DORA survey is a cross-sectional design with self-reported AI usage and survey-based components. The 21% figure represents perceived individual productivity gains, not measured throughput. The "negative correlation with stability" finding is correlational and could reflect reverse causation (teams with stability problems may adopt AI tools more aggressively as a response). The paper correctly notes "correlation not causation" in Table 6, but the main text (Section 1, Section 5.8) uses the DORA data as if it establishes a causal mechanism, specifically as calibration for QAS < 1.

The paper also cites "review time up 91%, PR size up 154%" in the QAS discussion, attributing these to DORA 2025. I note that these specific figures appear in secondary analyses and summaries of the DORA data rather than in the primary report, and the paper itself acknowledges that "the 'bug rates up 9%' figure appearing in secondary analyses could not be independently verified from the primary DORA report." This is honest, but the same epistemic caution should apply to the review time and PR size figures. If these are from secondary sources, they should be flagged as such.

### Kim et al. 2025

**Rating: MINOR**

The characterization of the 17.2x error amplification for independent agents is accurate, as is the saturation threshold at P* approximately 0.45. The paper correctly notes that these results are from "benchmark tasks (not production code)" and from "specific models and benchmarks." The paper uses the Kim et al. data both as calibration (for the coordination benefit function parameter alpha) and as evidence (for the 6x discrepancy between independence prediction and observed amplification). This dual use is legitimate but should be flagged: the same data cannot serve as both calibration and independent confirmation.

### METR 2026

**Rating: MINOR**

The paper reports "roughly 50% of SWE-bench test-passing pull requests would not be merged by repository maintainers" and correctly adds the crucial baseline caveat: "only about 68% of human-written 'golden patches' would be merged on re-review, so the gap attributable to AI deficiency is approximately 18 percentage points, not 50." This is a model of responsible citation. The paper also correctly identifies the limitation of the evaluator pool (4 maintainers, 3 repositories).

I note, however, that the paper uses this finding to support the circular validation bias claim (Definition 4.6), which is a much stronger theoretical claim than the METR data supports. The METR finding is consistent with circular validation bias but equally consistent with simpler explanations (AI-generated code has different stylistic qualities that maintainers dislike; test suites are inadequate). The paper does not adequately distinguish between these competing explanations.

---

## 2. The Empirical Verification Roadmap (Section 12.2)

### Experiment 1: Compound Error Sensitivity

**Rating: MINOR**

The design is solid. Collecting 500 pipeline executions per length bin at 6 bin values is adequate. The falsification criteria are meaningful, particularly the R-squared threshold of 0.7 for log-linearity, and the factor-of-2 tolerance on elasticity is appropriately generous. The step-to-step correlation check addresses the independence assumption directly.

One weakness: the experiment requires "partnership with a harness vendor," which is a significant access barrier. The paper should discuss whether open-source harness telemetry (from Claude Code's open-source components, or from Cursor's public API logs) could serve as a substitute. Without a realistic data access strategy, this experiment is aspirational.

### Experiment 2: Optimal Context Budget

**Rating: MINOR**

The design is well-specified. The falsification criteria are meaningful: if success is monotonically non-decreasing in context size, the core claim is falsified. The cost estimate ($5,000-$15,000 in API fees) is realistic.

One issue: the experiment controls context size but not context quality. The protocol says "adding lower-relevance items as size increases," but this conflates two effects: (a) diminishing marginal relevance and (b) degradation from context length. A cleaner design would add either relevant or irrelevant padding at each size level to separate these effects. The JetBrains finding (removing 52% of tokens improved performance by 2.6%) suggests this separation matters.

### Experiment 3: Structural Enforcement Threshold

**Rating: MAJOR**

This is the most important experiment in the roadmap, and its design has a significant flaw. The experiment measures compliance rates for 10 invariants across different enforcement types and pipeline lengths. But the "structural enforcement" condition is only implemented "where possible," and the paper acknowledges that structural enforcement is not implementable for semi-decidable and undecidable invariants.

This means the experiment can only confirm what is already obvious: that decidable properties can be enforced deterministically. The interesting question is whether the $(1-\epsilon)^T$ decay model correctly predicts instructional compliance decay, and whether $\epsilon$ is stable across pipeline lengths (as the model assumes) or itself depends on T. If agents exhibit in-context learning that makes them more likely to remember constraints as the pipeline progresses, $\epsilon$ would decrease with T, and the exponential decay model would overpredict the compliance gap. The experiment should explicitly test for T-dependent $\epsilon$.

### Experiment 4: Optimal Agent Count

**Rating: MINOR**

This is the most expensive experiment ($20,000-$50,000) and the most informative. The design is reasonable. The falsification criteria are meaningful, particularly the condition "QAS < 1 for k = 2," which would indicate that even minimal parallelism is net-negative.

The main concern is ecological validity. The experiment uses "30+ software engineering tasks of moderate complexity (2-8 hours of human developer time)." At this scale, tasks are decomposable and the coupling structure is relatively simple. The interesting case is large-scale tasks (days to weeks) where coupling is tight and coordination costs dominate. The experiment may confirm the model at small scale while missing the regime where the model is most needed.

### Experiment 5: Governance Capacity Bound

**Rating: MAJOR**

This experiment is methodologically the weakest. The proxy measures for R_drift and C_gov are complex composites with arbitrary weights. The paper acknowledges this weakness with the falsification criterion that inter-rater reliability must exceed 0.6 (Cohen's kappa), but this is setting a very low bar. If the operationalization of the theoretical quantities requires composite indices with tunable weights, the theory's predictive power is substantially weakened; you can always fit a composite index to data by adjusting the weights.

More fundamentally, the experiment conflates the governance capacity bound (an information-theoretic threshold result) with a regression model (correlating proxy measures with architectural health). These are different kinds of claims. The threshold result says: "above a critical ratio, divergence is unbounded." The experiment tests: "is there a correlation between the ratio and health metrics?" A correlation does not validate a threshold result. A proper test would identify repositories that crossed the threshold and verify that architectural health degraded sharply afterward, not gradually and proportionally.

The 12-18 month timeline is realistic for the longitudinal component but makes this the least likely experiment to be executed. Without this experiment, the governance capacity bound remains a metaphor dressed in mathematics.

---

## 3. Uncalibrated Parameters

**Rating: MAJOR**

This is the paper's most pervasive weakness. I identify the following formal results that present specific numerical predictions without any calibration data:

1. **Optimal context budget** ($|C^*| \approx 0.15W$ to $0.40W$): derived from a power-law degradation model fit to synthetic benchmark data. No production harness has measured the optimal context size directly.

2. **Structural enforcement $\epsilon$**: The paper uses $\epsilon = 0.23$ from AgentSpec and $\epsilon = 0.02$ as a "typical" value in worked examples. These differ by an order of magnitude. Which is the right regime? The paper does not resolve this.

3. **Optimal agent count** ($n^* \approx 1/\sqrt{\delta_a}$): requires knowing $\delta_a$ (per-agent defect injection rate). The paper uses $\delta_a \approx 0.05$ to get $n^* \approx 4-5$, but $\delta_a$ has not been measured for any production harness.

4. **Governance capacity** ($C_{gov}$, $R_{drift}$): both quantities are "undefined operationally" (the paper's own assessment in Table 6).

5. **Context fidelity decay rate** ($\Lambda$): calibrated against Suzgun et al.'s 17.1% "Fresh Eyes" advantage, which the paper itself acknowledges "likely conflates freshness with task decomposition effects." An upper bound derived from a confounded measurement is not a calibration.

6. **Decision survival Weibull parameters**: described as "illustrative estimates derived from practitioner experience." No controlled longitudinal study is cited.

7. **Verification layer costs and detection rates** (Table in Section 4.4): Layer 1 detection rate of 0.95, Layer 4 cost of 500. Where do these numbers come from? They are presented as if they were measured, but no source is cited.

8. **VIH Amdahl bound** ($VIH^{max} \approx 4.0$): calibrated using Devin's PR merge rate as a proxy for $p_{verify}$. A product's merge rate is not the same as per-iteration verification probability.

The paper is honest about many of these gaps (Table 6 rates six items as "Very Low" quality). But the gap between the mathematical precision of the theorems and the evidentiary vacuum surrounding their parameters undermines the paper's central claim. A theorem that says $n^* \approx 1/\sqrt{\delta_a}$ is only useful if $\delta_a$ can be measured. Without calibration, the formal machinery generates precise predictions from imprecise inputs, which is a recipe for false confidence.

**How problematic is this?** Very. The paper's design principles (Section 11) present specific recommendations ("Scale Agents to $n^* \approx 1/\sqrt{\delta_a}$") that require parameter values the paper cannot provide. A practitioner reading P5 would ask: "What is $\delta_a$ for my system?" and receive no answer. The framework is predictive in form but not yet predictive in practice.

---

## 4. Evidence Quality Assessment Table (Table 6)

**Rating: MINOR**

The evidence quality table (Table 6) is one of the paper's strengths. It is unusually candid for this kind of work. The four-tier grading scheme (High, Medium, Low, Very Low) is appropriate, and the "Key Gap" column adds real value.

However, I have three concerns:

**a) GitClear is overrated at "High."** The GitClear study has a large sample (211M lines), but it is a single-platform observational study with no causal identification. There is no control group, no natural experiment, no instrumental variable. By the standards of empirical software engineering, this is a descriptive study, not a quasi-experimental one. I would rate it "Medium-High" at best. The "High" rating appears driven by sample size alone, without adequate weight given to internal validity.

**b) METR is appropriately rated "Medium,"** but the key gap description is incomplete. The METR study's evaluator pool (4 maintainers, 3 repositories) is not just "small"; it raises questions about whether the "would not merge" judgments reflect genuine quality problems or idiosyncratic maintainer preferences. The paper notes this but the table does not capture the severity.

**c) Apollo Research and NIST CAISI are correctly rated "Low,"** but the paper draws strong conclusions from them (Section 4.7, "Adversarial Collapse of Prompt Enforcement"). The 30.4% reward-hacking rate from METR's RE-Bench evaluation is compelling, but this is a single study in a specific benchmark environment. The NIST CAISI findings are a workshop consensus report, not an empirical study. The paper should not use a "Low"-rated source to support a claim labeled as an empirical result.

---

## 5. VIH and QAS: Unmeasured Metrics

**Rating: MAJOR**

The paper introduces two novel metrics, Verified Iterations per Hour (VIH) and Quality-Adjusted Speedup (QAS), and builds substantial theoretical apparatus around them. Neither has been measured in any production environment.

**VIH:** The paper includes a footnote (footnote in Definition 6.2) stating: "VIH has not, to our knowledge, been measured in any production harness. It is proposed here as a metric, not reported as an empirical finding." This is appropriately transparent. However, the footnote is easy to miss, and the subsequent analysis (VIH optimality, Amdahl bound on VIH, VIH tangency condition) treats VIH as if it were an established metric with known properties. A reader who follows the mathematical development may forget that the entire edifice rests on an unmeasured quantity.

The VIH Amdahl bound ($VIH^{max} \approx 4.0$) is presented with spurious precision. It depends on $f \approx 0.20$ (verification time fraction, source unclear) and $p_{verify} \approx 0.67$ (Devin's PR merge rate, which is not the same thing as per-iteration verification probability). This is a back-of-envelope calculation presented in theorem-proof format.

**QAS:** The calibration against DORA 2025 data (individual task completion up 21%, review time up 91%, PR size up 154%) is suggestive but indirect. QAS is defined as $(T_1 \cdot Q_1) / (T_k \cdot Q_k)$, which requires measuring both time and quality with and without AI assistance. The DORA data provides survey-based estimates of individual productivity, not controlled measurements of time and quality. The claim that "naive AI-assisted parallelism frequently yields QAS < 1" is plausible but not demonstrated.

**Is the paper transparent enough?** Partially. The VIH footnote and the "Very Low" evidence rating for VIH in Table 6 are honest. But the QAS discussion in Section 5.8 does not carry equivalent disclaimers. The sentence "Calibration against DORA 2025 data suggests that naive AI-assisted parallelism frequently yields QAS < 1" reads as if QAS has been calculated from the DORA data, when in fact the DORA data merely contains findings that are consistent with QAS < 1 under certain assumptions. These are different epistemic states.

**Recommendation:** The paper should add a prominent subsection, parallel to the VIH footnote, making explicit that QAS is a proposed metric that has never been computed from production data. The DORA-based "calibration" should be relabeled as a "consistency check" or "plausibility argument."

---

## 6. Overall Assessment: Science or Mathematics in Search of Data?

**Rating: MAJOR**

The honest answer is: both, and the paper is more transparent about this than most theory papers in software engineering. But "transparent" is not the same as "resolved."

**What the paper does well:**

- The cross-pillar synthesis (Section 9) is genuine intellectual contribution. The identification of the structural enforcement principle across four pillars, the compound error cascade linking three pillars, and the Governance Information Budget as an integrating concept are valuable organizational insights, independent of whether the specific parameter values are correct.
- The decidability classification of slop types (Section 7.1) is a genuinely useful taxonomic contribution. The tripartite partition (Decidable, Semi-decidable, Undecidable) has immediate design implications regardless of parameter calibration.
- The Accretion Category (Definition 7.7) identifies a real phenomenon that existing defect taxonomies miss. The characterization of "code that is correct, unnecessary, individually defensible, and collectively harmful" captures something practitioners recognize but lack vocabulary for.
- The evidence quality table (Table 6) and the explicit acknowledgment of calibration gaps (Section 10.3) set a standard that other theory papers should follow.

**What the paper does not do:**

- It does not validate a single quantitative prediction against production data.
- It does not demonstrate that the formal framework generates predictions that would be non-obvious to a competent harness engineer working from intuition and experience.
- It does not show that the mathematical machinery is necessary for the design insights. Many of the 11 design principles (budget context, enforce structurally, invest in per-step quality, verify with independent methods) are well-known engineering heuristics. The paper provides formal justification for these heuristics, which has intellectual value, but it does not demonstrate that the formal justification changes any design decision.

**The core question:** Does formalizing engineering intuition as theorems, when the theorems' parameters are unmeasured, constitute "science"? The paper's own framing is careful: the title says "Towards a Science," and the abstract says "we do not claim that the formal models presented here are complete or fully validated." This framing is appropriate. But 2,450 lines of LaTeX create an impression of completeness that the epistemic foundations do not support.

The paper is most convincing when it treats formal models as organizing devices for engineering knowledge, and least convincing when it treats them as predictive instruments. The gap between these two roles is the gap between a useful framework and a science.

---

## Issue Summary

| # | Issue | Section | Rating | Description |
|---|-------|---------|--------|-------------|
| 1 | GitClear causal inference | 1, 7.9 | MINOR | Observational data used to support causal claims about AI-generated code |
| 2 | DORA characterization | 1, 5.8 | MAJOR | Cross-sectional survey data treated as causal evidence for QAS < 1 |
| 3 | Kim et al. dual use | 5.2, 5.4 | MINOR | Same data used for calibration and confirmation |
| 4 | METR circular bias attribution | 4.6 | MINOR | Finding consistent with circular bias but also with simpler explanations |
| 5 | Verification roadmap Exp 3 flaw | 12.2.3 | MAJOR | Does not test T-dependent epsilon; only confirms obvious decidable cases |
| 6 | Verification roadmap Exp 5 design | 12.2.5 | MAJOR | Composite proxy with tunable weights; correlation test does not validate threshold result |
| 7 | Uncalibrated parameters (systemic) | Throughout | MAJOR | 8+ formal results present numbers without calibration; precision without accuracy |
| 8 | GitClear overrated in evidence table | 10.4 | MINOR | Should be Medium-High, not High; no causal identification |
| 9 | Low-rated sources supporting strong claims | 4.7 | MINOR | Apollo/NIST (rated Low) used to support "empirical result" framing |
| 10 | VIH transparency adequate but buried | 6.2-6.4 | MAJOR | Footnote disclaimer is insufficient for the weight the metric carries |
| 11 | QAS "calibration" is a misnomer | 5.8 | MAJOR | DORA consistency check presented as metric calibration |
| 12 | Predictive utility undemonstrated | Throughout | MAJOR | No evidence that formal framework changes design decisions vs. intuition |
| 13 | Verification layer parameters unsourced | 4.4 | MINOR | Detection rates and costs presented without citation |
| 14 | Context fidelity calibration confounded | 6.1 | MINOR | Fresh Eyes advantage conflates freshness with decomposition effects |

**FATAL issues:** 0
**MAJOR issues:** 7
**MINOR issues:** 7

---

## Recommendation

**Major Revision.** The paper should:

1. **Downgrade causal language.** Throughout the text, replace causal claims with consistency claims when the evidence is observational. "The GitClear data is consistent with the Accretion Category prediction" is defensible; "the primary driver of the GitClear observations" is not.

2. **Source all parameter values.** Every numerical parameter used in worked examples (detection rates, costs, epsilon values, delta_a) must either cite a source or be explicitly labeled as an illustrative assumption. The current mix of sourced and unsourced values is confusing.

3. **Fix Experiment 3.** Add a test for T-dependent epsilon. The current design cannot distinguish between "exponential decay" and "constant low compliance" as explanations for the observed compliance gap.

4. **Redesign Experiment 5.** Replace the composite proxy approach with a simpler threshold test: identify repositories where drift visibly exceeded governance capacity (by some independent measure) and verify that architectural degradation followed.

5. **Elevate VIH/QAS disclaimers.** Move the "unmeasured metric" disclaimer from a footnote to a prominent remark following each definition. Add equivalent disclaimers for QAS.

6. **Add a "non-obvious predictions" section.** Identify 3-5 predictions of the framework that contradict engineering intuition or conventional wisdom, and specify how they could be tested. If the framework only formalizes what practitioners already know, its scientific contribution is substantially diminished.

7. **Reconsider the evidence quality ratings.** GitClear should be Medium-High. The paper should add a column or note indicating which "Low" or "Very Low" rated sources support claims presented as established results elsewhere in the paper.

The paper has genuine intellectual value as an organizing framework. Its contribution would be strengthened, not weakened, by a more modest framing of its current epistemic status.

---

*Dr. Marcus Chen*
*Microsoft Research, Developer Productivity Group*
*April 2026*
