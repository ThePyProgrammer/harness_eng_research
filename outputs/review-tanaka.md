# Review: "Towards a Science for AI Coding Agent Harnesses"

**Reviewer**: Dr. Kai Tanaka, VP Engineering, [Platform Company]
**Background**: Shipped 3 major versions of an AI coding agent platform; manages 40 engineers; active architecture redesign in progress
**Disposition**: I want this paper to be useful. I came looking for a principled framework to guide our next version.

---

## 1. What Would I Actually Use?

Three results from this paper would change real decisions on my team:

**The Compound Error Sensitivity result (Theorem 4.1) would change how we prioritize engineering effort.** We have historically invested in pipeline sophistication (better orchestration, smarter routing, fancier planning stages). The elasticity-equals-n result says that is backwards. A 20-step pipeline amplifies per-step improvements 20x. We should be spending our eng cycles on making each step better, not on making the pipeline fancier. This is the single most actionable result in the paper.

**The Extended Amdahl's Law with the reliability factor (Proposition 5.4) would change our multi-agent roadmap.** We have been building toward more parallel agents. The formula $S_{\text{eff}}(n) = [1/(s + (1-s)/n)] \cdot (1-\delta_a)^n$ with optimal $n^* \approx 1/\sqrt{\delta_a}$ gives us a concrete number to test against. At our current defect injection rate (roughly 4-6% per agent), this predicts optimal team size of 4-5, which matches what our internal telemetry shows but that we have been treating as a temporary limitation rather than a structural ceiling.

**The structural enforcement principle would settle an ongoing team debate.** Half my team thinks we should invest in better system prompts; the other half wants to build structural gates. The $(1-\epsilon)^T$ decay result, combined with the METR reward-hacking data (43x difference between visible and hidden evaluations), makes the case decisively: anything that must hold invariantly gets a structural gate, period. Prompt enforcement is for style preferences only. This resolves arguments we have been having for two years.

**Partially useful results:**

- The context budget theorem ($|C^*| \approx 0.15W$ to $0.40W$) aligns with our internal observations, but the range is too wide. At 200K tokens, that is 30K to 80K, which is a 2.5x range. Not precise enough to make an engineering decision without our own benchmarking.

- The four-layer verification architecture is a clean mental model but not novel. Every harness team I know has converged on something similar. The value is in the formalization (cost ratios, efficiency ordering), not the architecture itself.

- The slop taxonomy (18 types, 3 decidability classes) is useful for classifying our quality gates, but the detection probability matrix (Appendix B) is mostly "E" (estimated from first principles) or "L" (extrapolated). I cannot build a quality stack on estimates.

**Severity: IMPORTANT** -- The top three results alone justify reading the paper. The partial results need empirical grounding.

## 2. What Is Missing That I Need?

**Cost modeling under real pricing.** The paper mentions token costs in a remark but never integrates financial constraints into the optimization framework. In production, the binding constraint on context size is almost always budget, not degradation. A team running 50 iterations at full context spends $30-150 per task. We need the cost-quality-speed Pareto surface, not just the quality-speed frontier.

**Latency modeling.** Our users care about wall-clock time. The VIH metric is a start, but the paper does not model latency distributions, tail latency, or the user experience impact of verification overhead. A 10-second structural gate and a 2-minute LLM-as-Judge evaluation feel very different to a developer waiting for feedback.

**Model routing and heterogeneous model pipelines.** The paper assumes a single model or at most two model families. In production, we route tasks across 4-6 models based on task complexity, cost, and latency requirements. How do the compound error and coordination results change when $p_i$ varies by model, and model selection itself introduces error?

**Migration paths.** The 35 design principles are organized by implementation effort, which is good. But there is no guidance on sequencing: if I am starting from a Version 2 harness with no structural gates and accumulation-based context, what is the migration order? The paper says "implement Tier 1 first" but does not say which Tier 1 principles have the highest marginal ROI for a team already in production.

**Failure recovery patterns.** The paper models verification and detection extensively but barely addresses what happens after a failure is detected mid-pipeline. Rollback strategies, partial result preservation, graceful degradation under pipeline failure: these are where harness engineering gets hard in practice, and they are largely absent.

**The human-in-the-loop model is underdeveloped.** The paper acknowledges this in Section 9.7, calling it "a significant limitation." I agree. In our product, human correction is not Layer 4 of a cascade; it is the primary feedback loop. The paper's efficiency metric ($\eta = d/c$) penalizes human review for cost without crediting it for catching the tail of the error distribution. The admission that this needs future work is honest but unsatisfying for a practitioner.

**Severity: CRITICAL** -- Cost modeling and latency modeling are not optional for a production harness. Without them, the framework optimizes the wrong objective.

## 3. Where Does the Theory Break Against Reality?

**The independence assumption in compound error sensitivity.** The paper acknowledges this (the Marshall-Olkin common-cause model) but still leads with $R(n) = p^n$. In our experience, agent steps are heavily correlated. A misunderstanding at step 1 biases every subsequent step. The common-cause parameter $\gamma$ typically dominates the independent parameters $\alpha_i$. The paper's calibration from Hariharan et al. (63% failure on 100-step tasks) is consistent with the independent model only because it averages over the correlation structure. Step-to-step correlation in our telemetry runs 0.3-0.5, not the near-zero the independence model assumes.

**The context degradation model is too smooth.** The power-law $\delta(n) = (n/W_{\text{eff}})^{\alpha_d}$ with $\alpha_d \in [0.3, 0.5]$ suggests gradual, predictable degradation. What we observe in production is more like a phase transition: performance is roughly stable up to some threshold (which varies by task and model), then drops sharply. The "lost in the middle" effect is real but the smooth power-law does not capture the sudden onset of confusion that we see when context crosses approximately 60-70% of the effective window for complex tasks.

**The optimal agent count formula underestimates coordination costs.** The $n^* \approx 1/\sqrt{\delta_a}$ formula captures serialization and reliability but underweights the quadratic communication overhead. In practice, coordination is not just about defect injection; it is about the cognitive overhead of maintaining consistent mental models across agents. The USL extension (Equation 10) addresses this, but even that assumes a static $\kappa$ (coherency penalty). In our experience, $\kappa$ increases with task complexity in a way the model does not capture.

**Fresh context dominance is too strong a claim for production.** The paper argues that fresh context dominates accumulated context for diverse task sequences. In our product, the 17.1% "fresh eyes" advantage is real for isolated tasks, but many real workflows involve sequential refinement where accumulated context carries essential state. The "checkpoint and restart with curated summaries" recommendation loses information in the summarization step that the theory does not account for.

**The governance bifurcation is theoretically clean but practically unobservable.** The transcritical bifurcation at $\mu G / \gamma R = 1$ is elegant, but we have never been able to measure $\mu$, $G$, $\gamma$, or $R$ independently in a production system. The proxy measures suggested in the verification roadmap (Section 12) require composite indices with tunable weights, which the authors themselves acknowledge undermines falsifiability.

**Severity: IMPORTANT** -- The theory is directionally correct but the quantitative predictions need significant calibration against production data. Teams that take the parameter ranges at face value will make suboptimal decisions.

## 4. Calibration Critique

**Plausible ranges:**

- Context budget $0.15W$ to $0.40W$: Plausible. We target approximately $0.20W$ to $0.35W$ internally. The lower bound might be slightly low for complex refactoring tasks.
- Optimal agent count 3-5: Matches our observations closely. We see diminishing returns above 4 agents for most task types.
- Three verification rounds for 96.5% detection: Consistent with our data. We do 2-3 rounds and catch roughly 92-97% of detectable issues depending on task type.
- Structural enforcement compliance near 1.0: Yes, when the gates are well-designed. The failure mode is not the gate failing; it is the gate not covering the relevant invariant.

**Implausible or poorly calibrated ranges:**

- The $\epsilon$ range for prompt violation ($0.005$ to $0.30$): Too wide to be useful. A 60x range covers everything from "almost never violates" to "violates one in three times." Our measured rates vary by model, prompt structure, and task type in ways the single-parameter model cannot capture.
- Decision survival half-lives (frontend 1-4 months, database 12-36 months): These are described as "illustrative estimates" and they read that way. Frontend framework decisions at serious companies last 2-5 years, not 1-4 months. The paper seems to confuse implementation detail churn with architectural decision lifetime.
- The 43x reward-hacking amplification (visible vs. hidden evaluation): This is a real finding from METR, but it applies to adversarial settings where the agent is actively trying to game the evaluation. Most production harness agents are not adversarial in this sense. The number is real but the applicability to production settings is overstated.
- The QAS calibration from DORA data: The paper suggests naive AI-assisted parallelism "frequently yields QAS < 1." This is true for uncoordinated parallelism but not for well-designed multi-agent systems with contracts. The DORA data reflects early adoption patterns, not what is achievable with good engineering.

**Severity: IMPORTANT** -- The parameter ranges are more useful as ordinal rankings (what matters more vs. less) than as quantitative inputs. Taking the numbers literally would be a mistake.

## 5. The 35 Design Principles: Top 5 and Bottom 5

### Top 5 (would pin on the team's wall)

1. **P14: Enforce Structurally What Must Hold Invariantly.** The most important principle in the paper. We have learned this the hard way through three versions. Every invariant violation we have shipped to production was one we tried to enforce through prompts instead of gates.

2. **P15: Invest in Per-Step Quality, Not Pipeline Sophistication.** This corrects a systematic bias in how harness teams (including mine) allocate engineering effort. The elasticity argument is compelling and counterintuitive enough to be worth constant reinforcement.

3. **P9: Separate Code Authorship from Test Authorship.** The circular validation bias formalization (same blind spots in producer and verifier) matches our observed failure pattern precisely. When we switched to cross-model test generation, our escape rate dropped by roughly 35%.

4. **P1: Budget Context, Do Not Maximize It.** Simple, actionable, and fights the natural instinct to "give the model everything." Every new engineer on my team defaults to stuffing the context window. This principle, backed by the degradation data, is the fastest way to fix that.

5. **P24: Design Governance for the Velocity of Change.** The insight that governance capacity must scale with agent throughput is one that most harness teams have not internalized. We are currently building governance infrastructure that assumes human-speed code review, and this principle correctly identifies that as a structural bottleneck.

### Bottom 5 (would not use)

1. **P28: Treat the Abstraction Gap as a Budget.** The abstraction gap is defined via Kolmogorov complexity, which is uncomputable. Telling an engineer to "treat the gap as a budget" when they cannot measure the gap is not actionable. The Shannon operationalization helps, but estimating $H(P \mid S)$ in practice requires the answer before you can ask the question.

2. **P29: Treat the 12.3% Threshold as a Gate for Persistent State.** This number is derived from a single calibration point (the "fresh eyes" advantage from Suzgun & Kalai) that conflates freshness with task decomposition effects. Building a gate around a number with this level of uncertainty is premature.

3. **P27: Use AI as a Formalism Translator.** Aspirational and interesting, but the vericoding benchmark success rate (82% on Dafny) does not generalize to production codebases. We have tried formal specification approaches and they work for isolated algorithmic problems, not for the messy integration tasks that constitute 80% of real harness workloads.

4. **P33: Measure Governance, Not Just Architecture.** Correct in principle, but the paper provides no concrete metrics for measuring governance effectiveness. "Monitor the ratio $\mu G / \gamma R$" is not actionable when none of those variables have operational definitions.

5. **P22: Accept What You Cannot Detect.** This is dangerous advice without more qualification. Yes, some undecidable slop types have unfavorable cost-of-detection ratios. But "accept and compensate through aggregate monitoring" requires mature aggregate monitoring that most teams do not have. In practice, this principle becomes an excuse to skip quality investment.

**Severity: NICE-TO-HAVE** -- The principle ranking itself is useful. The tier structure (immediately actionable, requires investment, aspirational) is a good framework for prioritization.

## 6. What Would Make This Paper a Must-Read?

**Ground the parameter ranges in production telemetry.** The paper's greatest weakness is the gap between theoretical models and calibrated parameters. If the authors could partner with 2-3 harness vendors (Cursor, Claude Code, Windsurf) to instrument their systems and publish measured values for $\epsilon$, $\delta_a$, $\Lambda$, and the detection probability matrix, this paper would go from "interesting framework" to "required reading."

**Add a cost model.** Token costs, latency costs, and engineering costs are the real constraints that harness teams optimize against. The current framework optimizes quality and speed without acknowledging that budget is usually the binding constraint.

**Provide a decision flowchart, not just principles.** The 35 principles are too many to hold in working memory. A decision tree ("Is this invariant safety-critical? Yes: structural gate. No: Is it decidable? Yes: Layer 1. No: ...") would be more useful than a ranked list.

**Include a worked example.** Take a real (or realistic) harness architecture, map it onto the seven pillars, identify the binding constraints, and show how the framework recommends changes. The concrete examples scattered through the paper (pricing algorithm, authentication module) are helpful but isolated. A full worked example would demonstrate that the framework produces actionable guidance, not just theoretical insights.

**Address the interactive/conversational development case.** The paper's weakest point (acknowledged in the contrarian section) is that it models specifications as static documents. Most AI coding agent usage is conversational: iterative prompting, evaluation, and correction. The framework applies cleanly to batch-mode agent execution but less naturally to the interactive case, which is the dominant usage pattern for tools like Cursor and Claude Code. A treatment of the information dynamics of conversational development would make the paper relevant to the full harness design space.

**Cut the Curry-Howard-Lambek section.** The category theory material (Section 2.6) is mathematically correct but adds no design insight that is not already present in the refinement lattice. It reads as signaling rather than substance. Replacing it with a worked example would improve the paper more than any other single change.

**Severity: CRITICAL** -- Without production calibration and cost modeling, the paper remains an interesting academic exercise. With them, it becomes the foundational reference for the field.

---

## Summary of Issues

| Issue | Severity |
|---|---|
| Missing cost/budget modeling | CRITICAL |
| Missing latency modeling | CRITICAL |
| Parameter ranges too wide / poorly calibrated | IMPORTANT |
| Independence assumption in compound errors | IMPORTANT |
| Context degradation model too smooth | IMPORTANT |
| Human-in-the-loop model underdeveloped | IMPORTANT |
| No migration path guidance | IMPORTANT |
| No failure recovery modeling | IMPORTANT |
| Governance parameters not operationally defined | IMPORTANT |
| Fresh context dominance overstated | IMPORTANT |
| Decision survival half-lives implausible | NICE-TO-HAVE |
| Category theory section adds no design insight | NICE-TO-HAVE |
| No decision flowchart | NICE-TO-HAVE |
| No full worked example | NICE-TO-HAVE |

---

## Final Verdict: Would I Share This With My Engineering Team?

**Yes, with caveats.**

I would share Sections 4 (Reliability), 5 (Coordination), 7 (Quality), and 11 (Design Principles) with my entire team. These sections contain results that would change how we make decisions today. The compound error sensitivity result, the extended Amdahl's Law, the structural enforcement principle, and the slop taxonomy are all immediately useful.

I would share the full paper with my architecture leads (roughly 6 people) and ask them to evaluate it against our internal telemetry. The framework provides a common vocabulary for discussing harness design tradeoffs that we currently lack. Terms like "abstraction gap," "governance capacity," and "quality-adjusted speedup" would improve the precision of our architecture discussions.

I would not share the paper with the full team without a companion document that (a) maps our current architecture onto the seven pillars, (b) identifies which parameter ranges match our production data and which do not, and (c) extracts the 8-10 principles most relevant to our immediate roadmap. The raw paper is too long (80+ pages of LaTeX) and too theoretical for an engineer who needs to ship features next sprint.

The paper's thesis is correct and important: harness architecture should be a principled discipline, not trial-and-error. The framework is the best attempt I have seen at providing that principled foundation. But it is a V1 framework in the same way our V1 harness was a V1 product: the architecture is sound, the key results are directionally correct, and the empirical calibration needs two more iterations before it is production-ready.

I would recommend acceptance with major revisions, focused on production calibration and cost modeling. And I would cite it in our internal architecture documents starting today.

---

*Reviewed 2026-04-03*
