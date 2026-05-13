# Peer Review: "A Formal Framework for AI Coding Agent Harness Architecture"

**Reviewer 1: The Empiricist**
**Venue:** Conference on Software Engineering Foundations
**Date:** 2026-04-03

---

## 1. Summary

This paper presents a ten-pillar formal framework for AI coding agent harness architecture, covering Abstraction, Information, Reliability, Coordination, Temporal, Quality, Governance, Economics, Human Interaction, and Model Routing. The authors apply established mathematical machinery (information theory, reliability theory, control theory, lattice theory, survival analysis, portfolio theory, bandit algorithms) to the problem domain, producing approximately 63 named results across the pillars and 35 derived design principles. The paper is ambitious in scope, intellectually stimulating, and commendably transparent about its own epistemic status, explicitly labeling claims as "Mathematical Facts," "Engineering Hypotheses," or "Philosophical Observations." However, the central problem is that this is a theory paper in a domain that desperately needs experiments, and the ratio of formal apparatus to empirical validation is approximately 60:1 by page count. The paper's own Section 10 and the verification roadmap in Section 12 constitute the most honest self-indictment I have seen in a submission: the authors essentially acknowledge that six of their most important quantitative claims have "Very Low" evidence quality, meaning zero direct empirical measurement.

---

## 2. Strengths

- **Remarkable scope and coherence.** Synthesizing ten architectural dimensions into a unified framework with shared formal vocabulary is a genuine contribution. The cross-pillar connections (abstraction gap chain, compound error cascade, structural enforcement principle) are non-obvious and potentially valuable.

- **Epistemic honesty is exemplary.** The three-register system (Mathematical Fact, Engineering Hypothesis, Philosophical Observation) is a model for how speculative technical papers should be written. The paper repeatedly flags when it is crossing from derivation to conjecture. The Evidence Quality Assessment table (Table in Section 10) is unusually candid: six major claims rated "Very Low."

- **The verification roadmap (Section 12.3) is outstanding.** Five concrete experiments with explicit falsification criteria, sample size requirements, cost estimates, and expected timelines. This is exactly what a theory paper should provide if it cannot yet run the experiments. Most theory papers hand-wave about "future empirical work"; this one writes the experimental protocol.

- **Correct application of existing theory.** The mathematical results that are labeled "Mathematical Facts" are indeed correct: the compound error elasticity $\mathcal{E}(R,p) = n$ is a differentiation identity; the Shannon chain rule decomposition holds exactly; the submodular greedy approximation guarantee is a well-known result. The paper does not overclaim mathematical novelty.

- **Strong engagement with contrarian positions.** Section 13 steelmans seven objections (Bitter Lesson, Suchman's situated action, governance-as-overhead, Naur on theory preservation) and responds to each with nuance rather than dismissal. The cross-cutting assessment acknowledging that evidence is strongest for the problems and weakest for the solutions is refreshingly honest.

- **Information-as-unifying-currency is a productive framing.** The observation that all ten pillars reason about information flow, while the generative formalisms differ by axis, is a genuinely useful organizational insight.

- **The Accretion Category is a well-motivated concept.** The definition of code that is (i) functionally correct, (ii) superfluous, (iii) individually defensible, and (iv) collectively harmful captures a real phenomenon that existing defect taxonomies miss. The connection to GitClear's 8x duplication increase is compelling.

---

## 3. Weaknesses

### FATAL

**F1. No experiments were conducted.** This is a 416KB paper proposing a "formal framework" for an engineering domain, and it contains zero original experiments. Every quantitative claim is either a mathematical identity (trivially true by construction), a parameter estimate borrowed from someone else's study, or an assertion without any empirical backing at all. The paper acknowledges this; I am escalating it to FATAL because the paper's title promises a "framework" that "yields testable predictions and design principles with information-theoretic justifications," but the predictions remain untested and the justifications remain theoretical. A framework that has not been tested against reality is a hypothesis, not a contribution. The verification roadmap is admirable but does not substitute for actually running even one of the five proposed experiments.

**F2. The claimed numerical ranges are unvalidated.** The optimal context budget of $0.15W$--$0.40W$ (Theorem 3.4) is derived from a power-law degradation model fit to three data points from a single model (Llama-3.1-70B), as the paper itself admits in Appendix B.6. The $\alpha_d \in [0.3, 0.5]$ range is a curve fit, not a derived result. The paper then uses this range throughout, as though it were established. Similarly, the optimal agent count $n^* \approx 1/\sqrt{\delta_a}$ (Theorem 5.3) depends on $\delta_a$, which is described as "unmeasured in production" (line 771). The governance bifurcation threshold $\mu G / \gamma_g R = 1$ (Theorem 8.8) depends on four quantities, none of which have operational definitions with demonstrated inter-rater reliability. These are not minor calibration issues; they are the central quantitative predictions of the paper.

### MAJOR

**M1. Many "theorems" are definitions or tautologies wearing formal clothing.** The Compound Error Sensitivity "Theorem" (Theorem 4.1) states that the elasticity of $p^n$ with respect to $p$ is $n$. This is a one-line differentiation exercise, not a theorem. The Abstraction Gap Decomposition (Theorem 3.2) is the Shannon chain rule applied twice. The VIH Tangency Condition (Theorem 6.8) is the standard first-order condition for maximizing a ratio. The Weakest-Link Theorem (Theorem 9.4) is the AM-GM inequality. The Jevons Condition (Theorem 9.7) is $dS/dp = D(1-\epsilon)$. Calling these "theorems" inflates the paper's apparent contribution. They are correct, useful observations, but labeling them as theorems suggests novelty that is not present. By my count, at least 15 of the 63 named results are restatements of textbook identities in domain-specific notation.

**M2. Cherry-picking and overinterpretation of empirical sources.** The paper relies heavily on a small number of empirical sources, and several are used beyond their warranted scope:

- **GitClear 2025** is observational data with no causal identification. The 8x duplication increase is correlational; the paper itself notes that "alternative explanations include the concurrent shift toward microservices and template-based scaffolding" (Section 12.1). Yet the paper treats the 8x figure as established throughout the Quality and Governance pillars without this caveat.

- **DORA 2025** reports correlation, not causation. The finding that "software delivery stability showed a negative correlation with AI usage" could reflect reverse causation (struggling teams adopt AI). The paper's own Section 12.1 notes this, but the statistic is deployed uncaveated in at least four other locations (Sections 1, 5.9, 6, 10).

- **The "bug rates up 9%" figure** is cited from "secondary analyses" that "could not be independently verified from the primary DORA report" (Section 5.9). Using an unverifiable statistic in a formal framework paper is poor practice, even with the caveat.

- **METR 2026** used 4 evaluators across 3 repositories. The paper correctly notes the small evaluator pool but then treats the "50% of test-passing PRs would not be merged" finding as a primary empirical anchor for circular validation bias. This is a moderate-confidence finding being used for high-confidence conclusions.

**M3. The information-theoretic framing is retrospective, not generative, for half the pillars.** The paper acknowledges this (Section 11.1): "Calling compound errors 'information destruction' is accurate but retrospective; the results would stand unchanged without the information-theoretic gloss." This is true for the entire execution axis (Reliability, Coordination, Temporal). The $p^n$ compound error result is probability theory. The Extended Amdahl's Law is parallel computing. The VIH metric is scheduling theory. The information-theoretic wrapping adds terminology but no explanatory or predictive power for these pillars. The paper would be stronger if it forthrightly presented the execution-axis pillars in their native formalisms and reserved the information-theoretic unification for where it genuinely generates insight (the semantic and assurance axes).

**M4. The Tacit Divergence "Conjecture" (Proposition 8.2) is not testable.** The paper models tacit knowledge as a continuous random variable and derives that $R_{\text{tacit}}(D) \to \infty$ as $D \to 0$ from standard rate-distortion theory for Gaussian sources. The entire weight of the claim rests on whether the continuous-source model is appropriate for tacit knowledge, and the paper correctly notes that "if tacit knowledge is better modeled as a discrete source with finite entropy, the divergence result does not hold and the formalization is misleading." This is a philosophical claim dressed as a formal result. It should be presented as a modeling assumption, not as a proposition.

**M5. The slop taxonomy lacks validation.** The 18 slop types in 3 decidability classes (Table in Section 7.1) are proposed without any validation study. There is no labeled dataset, no inter-rater reliability measurement, no precision/recall evaluation of any detector for any slop type. The three-factor latent structure (Context Blindness, Completion Bias, Training Distribution Leakage) is proposed without confirmatory factor analysis on any dataset. The decidability classifications are acknowledged as "practical detectability, not formal decidability" (Section 7.1), but the paper then uses "D/SD/U" labels throughout as though they were established categories. The entire Quality pillar's formal apparatus rests on this unvalidated taxonomy.

**M6. VIH has never been measured.** The paper's central temporal metric, Verified Iterations per Hour, is proposed in Definition 6.1, used throughout the Temporal and Economics pillars, and is the basis for several design principles (P6, P19, P29). The footnote to Definition 6.1 states: "VIH has not, to our knowledge, been measured in any production harness." A metric that has never been measured cannot be a reliable basis for design principles. The paper should either measure VIH in at least one harness or clearly demote these principles to conjectural status.

### MINOR

**m1. Notation overload.** The notation table (Section 1) lists six symbols that are reused across pillars with different meanings ($\delta$, $\gamma$, $\kappa$, $\sigma$, $\epsilon$, $n$). This is a 416KB paper; finding unique symbols is not hard. The reuse creates unnecessary cognitive load and increases the risk of confusion in cross-pillar arguments.

**m2. The thinker placement table (Section 2.5) is not quantitative.** The paper places Dijkstra at $\hat{\sigma} \approx 0.95$, Lamport at $\hat{\sigma} \approx 0.78$, etc., then correctly notes that "the precise numerical values are not [stable across formalizations]." If the numerical values are not meaningful, they should not be presented in a table with two decimal places. This gives a false impression of precision.

**m3. The Uncanny Valley of Specification (Section 2.7) is pure speculation.** The hypothesis that $\sigma \in [0.3, 0.45]$ is an "uncanny valley" is derived from "ordinal placements" of five thinkers and the observation that semi-formal notations are "widely criticized." This is anecdote elevated to hypothesis elevated to named concept, without any empirical measurement of developer productivity at different formalism levels. The paper acknowledges this ("a controlled study would be needed to test it"), but the concept receives its own subsection and a name, which lends it more weight than its evidential basis warrants.

**m4. The Curry-Howard remark (Section 2.4) is a placeholder.** The paper notes the Curry-Howard-Lambek connection between specifications-as-propositions and implementations-as-proofs, then says "We note this connection but do not develop it further; a full treatment ... would be a substantial contribution in its own right." This is accurate, but mentioning it without development adds pagecount without content. Either develop it or remove it.

**m5. The vigilance decay parameters (Section 10.5) are calibrated from radiology and aviation, not software review.** The paper acknowledges this ("calibrated from analogue domains, not software review studies") but then uses the parameters ($\eta = 1.5$, $\gamma = 1.0$, $\xi_0 = 30$ minutes) to derive concrete predictions about the automation supervision paradox for coding harnesses. The analogue-domain transfer is plausible but unvalidated. The quantitative predictions ($p^* \approx 0.59$, vigilance collapse within 5 minutes at 95% automation reliability) should carry explicit uncertainty bounds reflecting the domain transfer.

**m6. The paper uses the `googledeepmind` document class.** The authors are listed as "Pragnition Labs." Using another organization's LaTeX template without affiliation raises presentation concerns.

---

## 4. Specific Claims Requiring Experimental Validation

1. **Optimal context budget $|C^*| \approx 0.15W$--$0.40W$** (Theorem 3.4, Section 3). Derived from a power-law model fit to three data points from one model. No controlled experiment measuring task success as a function of context size across models. The paper's own verification roadmap specifies this experiment; it should have been run.

2. **Structural enforcement compliance = 1; instructional compliance = $(1-\epsilon)^T$** (Proposition 3.6, Section 3). The exponential decay prediction is a mathematical identity given constant $\epsilon$, but the assumption of constant $\epsilon$ is untested. Agents may exhibit in-context learning (decreasing $\epsilon$ with $T$) or rule fatigue (increasing $\epsilon$). No measurement of $\epsilon$ for any enforcement mechanism exists.

3. **Optimal agent count $n^* \approx 1/\sqrt{\delta_a}$** (Theorem 5.3, Section 5). The per-agent defect injection rate $\delta_a$ is "unmeasured in production." The formula is correct given its assumptions, but those assumptions are empirically empty.

4. **Governance bifurcation at $\mu G / \gamma_g R = 1$** (Theorem 8.8, Section 8). Four parameters, zero operational definitions. The paper's own roadmap notes this is "the methodologically weakest" experiment and concedes that "the proxy measures can be adjusted post hoc to fit the data, which undermines falsifiability."

5. **VIH as a production metric** (Definition 6.1, Section 6). Never measured in any harness. The VIH-optimal operating point, the Amdahl bound on VIH, and the VIH tangency condition are all predictions about a quantity whose empirical distribution is unknown.

6. **The 18 slop types and their decidability classification** (Section 7.1). No labeled dataset, no inter-annotator agreement study, no detector validation. The three-factor latent structure (F1, F2, F3) is proposed without factor analysis.

7. **The Accretion Category's compound degradation rate** (Theorem 7.5, Section 7.6). The quadratic growth term $\binom{n}{2} \cdot \Delta\Gamma_{\text{cross}}$ depends on the assumption that "changes add code without refactoring." This assumption is falsifiable but unfalsfied. No measurement of $\Delta\Gamma_{\text{cross}}$ exists.

8. **The cache-staleness EOQ refresh interval** (Theorem 6.6, Section 6.7). The analogy to Economic Order Quantity is elegant but entirely untested. No measurement of staleness cost or optimal refresh interval in any production caching system for LLM prompts.

9. **The context fidelity decay rate $\Lambda$** (Theorem 6.1, Section 6.1). Calibrated against the 17.1% "Fresh Eyes" advantage from a single study (Suzgun and Kalai 2024), which the paper notes "likely conflates freshness with task decomposition effects." This is a single data point with a confound used to calibrate a core temporal parameter.

10. **The vigilance decay function $\Phi(p_{\text{auto}}, t)$** (Definition 10.5, Section 10.5). Functional form proposed, not validated for software review. Parameters borrowed from radiology and aviation screening. The automation supervision paradox threshold ($p^* \approx 0.59$) is a model prediction, not an empirical finding.

11. **The detection ceiling $d_{\ell,j} \leq I(X; D_j)/H(D_j)$** (Theorem 7.7, Section 7.7). Computing $I(X; D_j)$ requires knowledge of the joint distribution of observable features and defect status, which is not available in practice. The bound is correct in principle but uncomputable for any specific defect type.

12. **The refactoring ratio equilibrium at $r \approx 0.24$** (Corollary 7.6, Section 7.6). Derived from GitClear data (observational, no causal ID). The claim that the post-AI state at $r \approx 0.095$ "violates the bound by approximately 2.5x" assumes the pre-AI ratio was an equilibrium, which is not established.

---

## 5. Verdict: **Weak Reject**

The paper is intellectually ambitious, well-written, and commendably honest about its limitations. The unified framework is a plausible organizational scheme for the harness design space, and the cross-pillar connections are genuinely interesting. However, the ratio of formal apparatus to empirical grounding is far too high for a paper claiming to contribute to an engineering discipline. The core problem is not that the mathematics is wrong (it is not) but that the mathematics is disconnected from measurement. A framework built on unmeasured quantities and unvalidated functional forms is an invitation to further research, not a publishable result.

The paper's strongest contribution -- the verification roadmap with falsification criteria -- paradoxically argues against its own readiness for publication: the authors have specified exactly which experiments need to be run and have not run any of them. I would welcome a revised version that includes results from at least two of the five proposed experiments (the context budget validation and the structural enforcement measurement are the most feasible, requiring 2-6 months and $5K-15K by the authors' own estimates).

---

## 6. Revision Plan: What Experiments Would Make This Publishable

### Minimum for Resubmission (2 of 5)

**Experiment 1: Context Budget Validation (Priority: Highest, Feasibility: Highest)**
- 200+ coding tasks, 10 context sizes from 5% to 100% of $W$, 3 frontier models, 5 repetitions per condition.
- Plot success rate vs. context fraction. Confirm or falsify the unimodal prediction with peak at $[0.15, 0.40]W$.
- Estimated cost: $5K-$15K in API fees; 2-4 months.
- This single experiment would validate or falsify the paper's most frequently cited quantitative claim.

**Experiment 2: Structural vs. Instructional Enforcement (Priority: High, Feasibility: High)**
- 10 invariants (4 decidable, 3 semi-decidable, 3 undecidable), 2 enforcement mechanisms each, pipeline lengths $T \in \{10, 20, 30, 50, 75, 100\}$, 3 models, 30 trials per condition.
- Plot compliance rate vs. $T$ for both enforcement types. Estimate $\epsilon$. Test whether the constant-$\epsilon$ model fits or whether $\epsilon(T)$ is needed.
- Estimated cost: 4-6 months of engineering; moderate compute.
- This would validate the paper's most widely invoked design principle.

### Desirable for Full Validation (3 of 5)

**Experiment 3: Compound Error Sensitivity**
- Requires harness vendor partnership. Instrument pipelines to log per-step success/failure across $n \in \{5, 10, 15, 20, 30, 50\}$.
- Test linearity of $\ln R(n)$ vs. $n$ and estimate step-to-step error correlation.
- This validates the foundation of the Reliability pillar.

**Experiment 4: Optimal Agent Count**
- 30+ tasks, $k \in \{1, 2, 3, 4, 5, 7, 10, 15, 20\}$ agents, 2 topologies.
- Measure QAS. Confirm or falsify the unimodal prediction with peak at $1/\sqrt{\delta_a}$.
- Most expensive experiment ($20K-$50K), but directly tests the Coordination pillar's central claim.

**Experiment 5: Governance Capacity**
- Longitudinal study of 20+ open-source repositories with ADRs and measurable AI adoption.
- Construct proxy measures for drift rate and governance capacity. Test whether the ratio predicts architectural health.
- The methodologically weakest experiment; consider demoting this from the paper's claims until the proxy measures can be pre-registered and validated.

### Additional Validation Needed

- **Slop taxonomy validation:** Construct a labeled dataset of AI-generated code defects, have 3+ annotators label them using the 18-type taxonomy, compute inter-rater reliability, and run confirmatory factor analysis on the three-factor structure.
- **VIH measurement:** Instrument at least one production harness to measure raw iteration rate and verification pass rate. Report the distribution of VIH across task types.
- **Vigilance decay calibration:** Run a controlled study where developers review AI-generated code under varying automation reliability conditions. Measure detection rates over time. Validate or falsify the radiology-derived parameters.

### Presentation Changes

- Demote textbook identities (compound error elasticity, chain rule decomposition, AM-GM weakest link) from "Theorem" to "Observation" or "Fact."
- Remove or substantially reduce the thinker placement table and the Uncanny Valley subsection unless empirical evidence for the claimed productivity gap at $\sigma \in [0.3, 0.45]$ is provided.
- Consolidate the notation to eliminate symbol reuse across pillars.
- Add sensitivity analyses for the key quantitative predictions, showing how the optimal context budget, optimal agent count, and governance threshold change under plausible parameter perturbations.
- For every design principle grounded in an unmeasured parameter, add an explicit caveat stating the parameter's evidence quality rating from Table 10.1.

---

**Confidence:** 4/5. I have read the entire paper carefully and am confident in the technical assessment. My uncertainty is about whether the framework's organizational value (as a taxonomy and a research agenda) is sufficient to justify publication without experiments, and reasonable reviewers may disagree on this point. I lean toward requiring at least preliminary experimental validation before publication in a top venue.
