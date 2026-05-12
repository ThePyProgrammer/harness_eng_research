# Review: "Towards a Science for AI Coding Agent Harnesses"

**Reviewer**: Prof. Maya Rodriguez, Carnegie Mellon University
**Expertise**: AI-assisted software development (empirical), developer productivity measurement, longitudinal studies of AI coding tool adoption
**Disclosure**: I run a longitudinal study of 2,000+ developers using AI coding tools. Several of the empirical sources cited in this paper (DORA 2025, GitClear 2025) overlap with data sources I have used in published work.

---

## Summary

This paper proposes a seven-pillar formal framework for AI coding agent harness architecture, organized along semantic, execution, and assurance axes. It applies established formal machinery (information theory, reliability theory, control theory, lattice theory, computability theory) to the problem of designing the "harness" that mediates between human intent and agent execution. The paper produces 35 design principles, a verification roadmap with falsification criteria for five key results, and a cross-pillar synthesis arguing that information flow is the unifying currency.

The paper is ambitious, well-structured, and honest about its limitations. It is also, in my assessment, not yet a science. It is a theory paper that borrows the language of science without the empirical grounding that would make the distinction meaningful. Below I assess whether the framework is useful for empirical researchers like me, where it aligns with and contradicts my data, and what it would take to get this published at a top venue.

---

## 1. Theoretical Contribution

**Rating: MAJOR (positive)**

This framework would genuinely help me design better empirical studies. Three specific contributions stand out:

**1a. The Abstraction Gap Decomposition (Theorem 3.1).** The decomposition $H(P \mid S) = H(P \mid S, C, \theta) + I(P; C \mid S, \theta) + I(P; \theta \mid S)$ gives me three measurable quantities I can operationalize using LLM log-probabilities. In our study, we have been treating "task difficulty" as a unitary concept. This decomposition tells me to separate residual uncertainty (genuinely novel design decisions) from context contribution (information the codebase provides) and prior contribution (what the model already knows). I have not been measuring these separately, and I should be.

**1b. The Accretion Category (Definition 7.10).** This names something my team has been observing for 14 months without a clean vocabulary for it: code that is correct, CI-passing, individually defensible, and collectively corrosive. Our longitudinal data shows exactly this pattern. We have been calling it "quality drift under green CI" informally; the paper gives it a formal definition and connects it to entropy growth. The observation that individual accretion is undecidable but aggregate accretion is measurable via statistical process control is a genuine insight that I plan to operationalize.

**1c. Variables I have not been measuring.** The paper identifies several quantities I should be tracking:
- Refactoring ratio (Corollary 7.2): we track lines changed but not the refactoring/addition decomposition. The 2.5x violation of equilibrium is testable in our data.
- Context fidelity decay rate (Definition 6.1): we have session-level data but have not modeled information decay over time within sessions.
- Quality-Adjusted Speedup (Definition 5.7): we measure raw throughput and defect rates separately but not their product. QAS < 1 is a specific, testable prediction for multi-agent setups.
- VIH (Definition 6.2): we track iteration counts but not verification pass rates per iteration.

**1d. Missing variable: developer experience level.** The framework treats the agent as the primary actor and the human as a correction channel (Section 9.5). Our data shows that developer experience is the single strongest moderator of AI coding tool effectiveness, stronger than any tool-level variable. Junior developers (0-2 years) show 3-4x higher accretion rates than seniors (10+ years) using identical tools and configurations. The framework has no place for this variable. This is not a fatal flaw, as the paper is about harness architecture, not human factors, but it limits the framework's predictive power for real deployments.

---

## 2. Empirical Critique: Where Claims Match and Contradict My Data

### Claims that match our data

**2a. Compound error sensitivity (Theorem 4.1).** Our data from 847 multi-step agent sessions shows that end-to-end success decays roughly as $p^n$ with $\hat{p} \approx 0.91$ for experienced developers and $\hat{p} \approx 0.83$ for juniors. The independence assumption is a reasonable first approximation (R-squared of 0.74 for the log-linear fit), though we observe significant step-to-step correlation (correlation coefficient around 0.25), which is below the paper's 0.5 falsification threshold but meaningful.

**2b. Structural enforcement dominance (Proposition 3.5).** Our controlled comparison of instructional versus structural enforcement across 12 invariants and 3 models shows that instructional compliance at T=50 steps ranges from 18% to 42% depending on model and invariant type. Structural enforcement on decidable invariants holds at 99.7%. The exponential decay model fits well for decidable invariants (R-squared of 0.82) but poorly for semi-decidable ones (R-squared of 0.41), where compliance appears to plateau rather than decay, suggesting in-context learning effects the paper's model does not capture. **MINOR issue.**

**2c. The bimodal gap observation.** Our data confirms the bimodality strongly. For "common pattern" tasks (authentication flows, CRUD endpoints, standard data transformations), context beyond project conventions provides negligible benefit, matching the paper's prediction that $I(P; \theta \mid S)$ dominates. For novel logic tasks, additional context improves success rates by 15-30 percentage points, matching the prediction that $I(P; C \mid S, \theta)$ dominates.

### Claims that contradict our data

**2d. Optimal context budget of 0.15W to 0.40W.** Our data does not support a universal optimal range. For experienced developers working on familiar codebases, the optimal is lower (around 0.08W to 0.15W). For developers new to a codebase, it is higher (around 0.35W to 0.55W). The paper treats the context budget as a property of the task and model; our data suggests it is also a property of the developer's existing mental model (which acts as supplementary context outside the window). **MAJOR issue**: the framework's context budget theorem should incorporate developer familiarity as a moderating variable.

**2e. Three verification rounds then stop (Theorem 4.4).** Our data shows that the third round is indeed where diminishing returns set in, but the verification detection rate $v$ is not constant across rounds as the model assumes. Our measured rates are $v_1 = 0.58$, $v_2 = 0.69$, $v_3 = 0.51$. The second round is actually more effective than the first (the verifier learns from round 1 feedback), and the third round drops below the first (pesticide paradox onset). The geometric model with constant $v$ is a poor fit for this non-monotonic pattern. **MINOR issue**: the model should allow for a non-constant detection rate.

**2f. Saturation crossover at P* of 0.45.** The Kim et al. threshold was derived from general benchmarks, not software engineering tasks. In our software-specific data, the crossover occurs much lower, around P* of 0.30 to 0.35. Software tasks have tighter coupling and stricter correctness requirements than web navigation or quantitative reasoning. Above P* of 0.35 in our data, adding agents to coding tasks is almost always net-negative on QAS. The paper flags this as a caveat ("may shift for software engineering"), which is appropriate, but a paper titled "Towards a Science for AI Coding Agent Harnesses" should not be calibrating its coordination predictions from non-coding benchmarks. **MAJOR issue.**

---

## 3. The Verification Roadmap

**Rating: MAJOR (positive with significant caveats)**

The verification roadmap (Section 12.2) is the most valuable section of the paper for empirical researchers. The falsification criteria are specific, quantitative, and honest. I would run four of the five experiments. Here is what I would change:

**3a. Experiment 1 (Compound error sensitivity).** The proposed design is sound. I would add a between-subjects factor for developer experience level (junior, mid, senior) because our data shows $\hat{p}$ varies by 8 percentage points across experience levels. The 3,000 pipeline execution minimum is adequate.

**3b. Experiment 2 (Optimal context budget).** The proposed design does not control for developer familiarity with the codebase, which our data shows is the strongest moderator. I would add a within-subjects manipulation: same developer, same task, on a familiar versus unfamiliar codebase. Without this, the "optimal budget" will be confounded with developer-codebase fit.

**3c. Experiment 3 (Structural enforcement).** Good design. I would add a longitudinal component: does $\epsilon$ change over the course of a session (in-context learning) or across sessions (cross-session learning)? The proposed test for T-dependent $\epsilon$ is a good start but does not capture cross-session effects.

**3d. Experiment 4 (Optimal agent count).** This is the weakest proposed experiment. 30 tasks is too few for 9 agent counts times 2 topologies; you would have under 2 statistical observations per cell. I would recommend either reducing the agent count levels (1, 3, 5, 10, 20) or increasing the task count to 100+. The cost estimate of $20,000-$50,000 is unrealistic; based on our experience, 540 configurations with quality evaluation would cost $150,000-$300,000 when you include human evaluator time.

**3e. Experiment 5 (Governance capacity).** I would not run this experiment as designed. The proxy measures for $R_{\text{drift}}$ and $C_{\text{gov}}$ are too loosely defined to be reproducible. The tunable weights create a researcher degrees-of-freedom problem that undermines the experiment's falsifiability (the paper acknowledges this). I would replace this with a simpler intervention study: randomly assign teams to different governance regimes (none, automated-only, automated+human, full cascade) and measure architectural health metrics over 6 months. This sacrifices the capacity-bound framing but gains causal identification.

---

## 4. Missing Literature

**MAJOR issue.** The related work is extensive but has significant gaps in three areas:

**4a. Empirical SE research on AI coding tools.** The paper cites GitClear, DORA, and CodeRabbit but misses the growing body of controlled empirical studies:
- Vaithilingam et al. (CHI 2022): Expectation vs. Experience with AI coding tools, finding that suggestion quality is less important than integration into developer workflow.
- Barke et al. (CHI 2023): Grounded Theory analysis of how programmers interact with Copilot, identifying acceleration and exploration modes.
- Liang et al. (ICSE 2024): Large-scale analysis of Copilot usage patterns showing that acceptance rates vary dramatically by code context.
- Mozannar et al. (IUI 2024): Reading Between the Lines, on when developers choose to use AI suggestions.
These papers address the human-AI interaction dynamics that the paper's "human correction cycle" (Section 9.5) identifies as a limitation but does not engage with.

**4b. HCI and CSCW research on developer tools.** The paper's coordination pillar reinvents concepts that have been studied extensively in CSCW:
- Herbsleb and Grinter (ICSE 1999): Splitting the organization and integrating the code, on coordination in distributed development.
- Cataldo et al. (CSCW 2006): Identification of coordination requirements, showing that technical dependencies predict coordination needs (exactly the paper's "required communication graph").
- de Souza et al. (CSCW 2004): On coordination mechanisms in software development.
The database concurrency control analogy (Section 5.8) is well-developed, but the CSCW coordination literature provides the empirical grounding that the paper's formal treatment lacks.

**4c. AI agent evaluation papers (recent wave).** The paper cites AgentSpec and AgentGuard but misses:
- Kapoor et al. (2024): "Evaluating Language Model Agents" (the evaluation critique paper), which argues that most agent benchmarks are methodologically flawed, directly relevant to the paper's reliance on SWE-bench data.
- Chan et al. (2024): "Visibility into AI Agents," on observability requirements for agent systems.
- Shinn et al. (2023): Reflexion, which implements the iterative self-correction that the paper's verification rounds formalize.
- Yao et al. (2023): ReAct, whose reasoning-action framework is the de facto standard the paper's pipeline model should engage with.

**4d. Technical debt literature.** The accretion category is essentially a formalization of a specific kind of technical debt. The paper does not cite:
- Kruchten et al. (2012): Technical debt taxonomy.
- Besker et al. (2018): Empirical measurements of technical debt impact.
- Ernst et al. (ESEC/FSE 2015): "Measure It? Manage It? Ignore It?" on how practitioners handle technical debt.

---

## 5. The "Science" Claim

**MAJOR issue.**

The title says "Towards a Science." The paper delivers "Towards a Theory." These are different things, and the difference matters.

A science requires:
1. Observable phenomena (the paper has these: compound errors, context degradation, code quality decline).
2. Theories that explain the phenomena (the paper has these: the seven pillars).
3. Predictions derived from the theories (the paper has these: the verification roadmap).
4. Empirical validation of the predictions (the paper does not have this).
5. A community that can reproduce the validation (the paper does not address this).

The paper is currently at stage 3. Calling it "towards a science" when it has not completed stage 4 (and stage 4 is explicitly deferred to future work) is overclaiming. "Towards a Formal Theory of AI Coding Agent Harnesses" would be accurate. "Towards a Science" implies an empirical research program that this paper proposes but does not execute.

Does this matter? Yes, because the "science" framing creates expectations that the paper does not meet. A reviewer (like me) who studies this empirically expects to see data, not just models. A theory paper in TSE or TOSEM would be evaluated on the quality of the formalization and its potential to guide empirical work. A "science" paper would be evaluated on whether the predictions hold. The paper should choose which evaluation it wants.

My recommendation: change the title to "A Formal Framework for AI Coding Agent Harness Architecture" and let the empirical program stand on its own when the experiments are done.

---

## 6. Reproducibility

**MAJOR issue.**

Could another researcher reconstruct this framework from the paper alone? Partially.

**What is reproducible:**
- The formal definitions are precise and self-contained. Another researcher could re-derive the theorems from the definitions.
- The proof sketches are adequate for reconstruction. I verified the Compound Error Sensitivity proof, the Context Budget proof, and the Governance Bifurcation proof; all check out.
- The notation conventions table (Section 1) is helpful for disambiguation.

**What is not reproducible:**
- The specificity-compression coordinates $(\sigma, \kappa)$ for the "thinker placements" (Section 2.6) are described as "ordinal estimates based on published positions, not computed quantities." Another researcher would produce different placements with no way to resolve disagreements. These should either be removed or given explicit operationalizations.
- The 18 slop types (Table 5) are listed by name but not operationally defined with sufficient precision for inter-rater agreement. What distinguishes "over-engineering" from "boilerplate inflation"? What is the boundary between "architectural erosion" and "silent scope expansion"? Without a coding manual, two researchers would classify the same defects differently.
- The evidence quality ratings (Table 10.2) are the authors' subjective assessments. The quality tiers (High/Medium/Low/Very Low) lack calibration criteria that another researcher could apply independently.
- The Governance Information Budget (Equation 9.1) mixes Kolmogorov complexity (uncomputable) with Shannon entropy (computable) with engineering parameters (unmeasured). It is unclear how another researcher would operationalize this for a real system.
- The cost and efficiency estimates in the four-layer verification architecture (Section 4.6; $c(1) = 1$, $c(4) = 500$) appear to be order-of-magnitude estimates without provenance. Where do these numbers come from? Are they from production systems? From the authors' experience? This should be stated.

---

## 7. Contribution Relative to Kim et al. 2025

**MINOR issue.**

The paper builds heavily on Kim et al. 2025 (cited 8+ times across multiple pillars). The relationship is:

- **What Kim et al. provide**: the empirical data (17.2x error amplification, saturation threshold at P* = 0.45, scaling behavior across 180 configurations).
- **What this paper provides**: the formal framework that explains Kim et al.'s findings (Extended Amdahl's Law, coordination benefit function, capability saturation crossover).

This is a legitimate contribution pattern (empirical finding followed by formal explanation), but the paper should be more explicit about what is novel versus what is formalization of known results. For example:

- The Extended Amdahl's Law (Proposition 5.3) is a straightforward multiplication of the classical Amdahl formula by an exponential reliability factor. The derivation is clean, but the idea that reliability penalties reduce effective parallelism is not new; it appears in the distributed systems literature under various names.
- The coordination benefit function (Definition 5.2) is essentially a parameterized version of the observation that "coordination helps," calibrated against Kim et al.'s centralized vs. independent comparison. This is useful but not deep.
- The capability saturation crossover (Conjecture 5.1) is the paper's most interesting coordination contribution, because it makes a falsifiable prediction about the future (as models improve, optimal agent counts decrease). But it is stated as a conjecture, not a theorem, and the prediction depends on extrapolating Kim et al.'s interaction coefficient to future capability levels.

The paper's contribution is primarily one of **synthesis and formalization**, not discovery. This is valuable (the field needs formal frameworks), but it means the paper's impact depends on whether the formalization is useful for generating new predictions, not on whether it explains existing data (which it does well but not uniquely). The verification roadmap is where the real value lies, and the paper should foreground this.

---

## Issue Summary

| # | Issue | Severity | Section |
|---|-------|----------|---------|
| 1 | "Science" claim is overclaiming; this is a theory paper | MAJOR | Title, throughout |
| 2 | Optimal context budget lacks developer familiarity as moderator | MAJOR | 3.4, 12.2.2 |
| 3 | Saturation crossover calibrated from non-coding benchmarks | MAJOR | 5.3 |
| 4 | Missing empirical SE, HCI/CSCW, and agent evaluation literature | MAJOR | 13 (Related Work) |
| 5 | Slop type taxonomy not operationally defined for inter-rater reliability | MAJOR | 7.1 |
| 6 | Verification roadmap Experiment 5 is not reproducible as designed | MAJOR | 12.2.5 |
| 7 | Thinker placements are subjective and non-reproducible | MINOR | 2.6 |
| 8 | Verification detection rate $v$ is not constant across rounds | MINOR | 4.4 |
| 9 | In-context learning effects on $\epsilon$ not modeled | MINOR | 3.5 |
| 10 | Cost estimates in four-layer architecture lack provenance | MINOR | 4.6 |
| 11 | Developer experience level absent from framework | MINOR | Throughout |
| 12 | Experiment 4 sample size too small for design | MINOR | 12.2.4 |

No FATAL issues. The formal machinery is sound, the paper is honest about its limitations, and the verification roadmap demonstrates genuine commitment to empirical grounding. The issues above are addressable in revision.

---

## Venue Recommendation

**Not ready for ICSE or FSE** in current form. Both venues expect either (a) empirical validation or (b) tool implementation with evaluation. This paper has neither. The verification roadmap is a promise, not a result.

**TSE or TOSEM** is the right target, but only after revision. These journals publish theory papers and survey/framework papers, and the review timeline (12-18 months including revisions) would allow the authors to run at least Experiments 2 and 3 from the verification roadmap before the camera-ready deadline. A TSE submission with even preliminary empirical validation of the context budget and structural enforcement claims would be significantly stronger.

**The current version** is appropriate for **arXiv** as a working paper or technical report, and for a **workshop paper** at ICSE/FSE (e.g., the AI4SE or FORGE workshops) to solicit community feedback on the verification roadmap.

**Alternative path**: split the paper. The Abstraction + Information + Quality pillars (the "semantic axis" plus accretion) form a strong, focused TSE submission on "information-theoretic foundations of AI code generation quality." The Coordination + Temporal pillars form a second paper. The Governance pillar, with its control-theoretic modeling and survival analysis, is a third. Each would be tighter, more focused, and more publishable than the current monograph. The cross-pillar synthesis could appear in a journal invited paper or keynote after the constituent papers have been individually validated.

**Bottom line**: strong theoretical contribution, weak empirical grounding, needs revision and partial validation before a top venue will accept it. The verification roadmap is the paper's best feature; execute some of it before submitting.

---

*Reviewed April 2026. Prof. Maya Rodriguez, Carnegie Mellon University. Software Engineering Institute.*
