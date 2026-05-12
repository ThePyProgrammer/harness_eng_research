# Peer Review Evidence: "Towards a Science for AI Coding Agent Harnesses"

Research agent findings for peer review of the synthesis paper. Organized by verification task.

---

## 1. Cross-Reference of Key Claims Against Cited Sources

### 1.1 GitClear 2025: "8x duplication increase" and "60% refactoring collapse"

**Paper claims (Section 1, line 80):**
> "GitClear's analysis of 211 million changed lines found an 8x increase in code duplication and a 60% collapse in refactoring activity."

**Verification result: MOSTLY ACCURATE, with nuance.**

- The "211 million changed lines" figure is confirmed. GitClear analyzed 211 million changed lines of code authored between January 2020 and December 2024.
- The "8x increase in code duplication" is confirmed, but needs qualification: the 8x figure refers specifically to code blocks with 5 or more duplicated lines during 2024, not to overall duplication rate. The broader duplication metric (lines classified as "copy/pasted") rose from 8.3% to 12.3%, which is roughly a 1.5x increase. The paper conflates these two different metrics.
- The "60% collapse in refactoring activity" is confirmed: refactoring fell from ~25% of changed lines in 2021 to under 10% in 2024, which is approximately a 60% reduction (from 25% to ~10%).

**Assessment:** The paper should clarify that the "8x" refers to duplicated code *blocks* of 5+ lines, not overall duplication rates. The current phrasing could mislead readers into thinking the overall duplication rate increased eightfold.

### 1.2 DORA 2025: "21% throughput increase" and "negative stability correlation"

**Paper claims (Section 1, line 80):**
> "DORA 2025 reported that AI adoption increased throughput by 21% while having a negative relationship with software delivery stability."

**Also (Section 5, QAS discussion):**
> "Calibration against DORA 2025 data suggests that naive AI-assisted parallelism frequently yields QAS < 1: throughput up 21%, but review time up 91%, PR size up 154%, and bug rates up 9%."

**Verification result: PARTIALLY INACCURATE; important nuance missing.**

- The "21%" figure is confirmed but mischaracterized. The DORA report found "21% more tasks completed" at the individual level, not a 21% increase in organizational throughput. This is a meaningful distinction. The paper in Section 10 (empirical foundations) correctly notes "telemetry from over 10,000 developers," but the throughput metric conflates individual task completion with system-level throughput.
- The "negative relationship with software delivery stability" is confirmed. The DORA 2025 report explicitly states that AI adoption continues to have a negative relationship with software delivery stability.
- The "review time up 91%" and "PR size up 154%" figures appear in secondary analyses of DORA data and are confirmed by multiple sources.
- The "bug rates up 9%" figure could not be independently verified from the primary DORA report; it may come from a secondary analysis.

**Assessment:** The paper should distinguish between individual task completion (21% more tasks completed) and organizational throughput. The DORA report itself notes that organizational delivery metrics stayed flat despite individual productivity gains, which actually *strengthens* the paper's QAS < 1 argument but for different reasons than stated.

### 1.3 Kim et al. 2025: "17.2x error amplification" and "saturation at 45%"

**Paper claims (Section 5):**
> "Kim et al. found empirical amplification of 17.2x for independent agents, far exceeding the theoretical maximum of k under independence."

> "saturation of scaling benefits at approximately 45% of the task completion rate"

**Verification result: ACCURATE.**

- The 17.2x error amplification for independent ("bag of agents") configurations is confirmed from the paper "Towards a Science of Scaling Agent Systems" (arXiv:2512.08296).
- The centralized coordination reducing this to 4.4x is also confirmed.
- The saturation at ~45% is confirmed: "coordination yields diminishing or negative returns (beta=-0.408, p<0.001) once single-agent baselines exceed ~45%."
- The 180 configurations across 5 architectures and 3 LLM families is confirmed.

**Assessment:** This is the most accurately cited empirical source in the paper. No corrections needed.

### 1.4 METR 2026: "50% of test-passing PRs would not merge"

**Paper claims (Section 4, line 314):**
> "This result connects directly to METR's finding that roughly 50% of SWE-bench test-passing pull requests would not be merged by repository maintainers."

**Verification result: APPROXIMATELY ACCURATE, with important caveats.**

- The "roughly 50%" / "about half" figure is confirmed. METR's research found that maintainer merge decisions are about 24 percentage points lower than SWE-bench automated grader scores, with roughly half of test-passing PRs not being merged.
- However, the study is more limited than the paper implies: only 4 maintainers from 3 repositories (scikit-learn, Sphinx, pytest) reviewed 296 AI-generated PRs. This covers only 25% of SWE-bench Verified repos and 19% of issues.
- A critical baseline caveat: METR found that only about 68% of *golden patches* (the real human-written patches) would be merged by maintainers upon re-review. This means the "merge gap" is partly explained by maintainer subjectivity, not entirely by AI deficiency.

**Assessment:** The paper's use of this finding is directionally correct but overstates the precision. The paper should acknowledge that the METR study has a small evaluator pool and that the baseline merge rate for human patches is only 68%, not 100%. The paper does note "small evaluator pool" in Section 10, which is good, but the Section 4 usage lacks this qualification.

### 1.5 Liu et al. 2024 "Lost in the Middle": U-shaped recall claim

**Paper claims (Section 3, cited indirectly through context degradation discussion):**
The paper cites Liu et al. 2024 as part of the empirical evidence for the "U-shaped positional recall function" in context degradation.

**Verification result: ACCURATE.**

- Liu et al. (2024), "Lost in the Middle: How Language Models Use Long Contexts," published in TACL, volume 12, pages 157-173, confirms the U-shaped performance curve.
- The study found performance is highest when relevant information occurs at the beginning or end of the input context, with a 30%+ accuracy drop when the answer document moved from position 1 to position 10 in a 20-document context.
- The connection to the serial-position effect (Ebbinghaus, 1913) is noted in the original paper.

**Assessment:** Accurately cited. This is one of the stronger empirical foundations in the paper.

---

## 2. Formal Consistency Check

### 2.1 Theorem Consistency Between Synthesis and Pillar Papers

Based on comparing the synthesis paper's theorem statements against the pillar synthesis notes:

**Consistent:**
- **Spec-Code Convergence (Theorem 2.1):** The synthesis paper's statement matches the pillar paper's `thm:convergence` exactly: for incompressible P, $|S| \geq |P| - O(\log |P|)$.
- **Compound Error Sensitivity (Theorem 4.1):** Elasticity = n. Matches `thm:sensitivity` in the Reliability pillar.
- **Optimal Checkpoint Count (Theorem 4.2):** $k^* \approx \sqrt{n(1-p)c_0/c_v}$. Matches `thm:optcheckpoints`.
- **Extended Amdahl's Law (Theorem 5.1):** Matches `thm:amdahl` and `thm:nstar`.
- **Governance Capacity Bound (Theorem 8.1):** Matches `thm:capacity`.
- **Tacit Divergence Conjecture (Conjecture 8.1):** Matches `conj:tacit`.

**Minor inconsistency found:**
- **Circular Validation Bias (Definition 4.2):** The synthesis paper writes the residual bias as $\beta = \beta_A (1 - \beta_{A'})$, while the Reliability pillar synthesis notes list `thm:bias` as "Bias Decomposition: $\beta = \beta_A(1 - \beta_{A'})$." These match. However, the synthesis paper says "when $A = A'$ (self-verification), $\beta_{A'} = \beta_A$ for the shared blind-spot categories, yielding zero bias reduction on those categories." This is imprecise: $\beta = \beta_A(1 - \beta_A)$ is not zero; it would be zero only if $\beta_A = 1$. What the text means is that for the *shared blind-spot categories specifically*, the verifier's detection rate for those categories is zero (since they share the blind spot), so there is zero bias reduction *on those particular categories*. The formula applies to the overall bias, not category-specific bias. This could confuse readers.

**Potential inconsistency:**
- **Structural Enforcement Boundary (Theorem 4.3):** The synthesis paper writes the threshold as $L^* = (c_s - c_p)/\epsilon$, while the Reliability pillar notes list `thm:threshold` as $L^* = (c_s - c_p)/(\delta - \delta_s)$. These use different notation: the synthesis uses $\epsilon$ (per-step prompt violation probability), while the pillar uses $\delta - \delta_s$ (difference between prompt and structural violation rates). The synthesis version implicitly assumes $\delta_s = 0$ (structural enforcement has zero violation probability), which is consistent with the text but should be noted as a simplification.

### 2.2 Symbol Consistency

- **$P$**: Used consistently to mean "program" (target code) throughout.
- **$S$**: Used consistently to mean "specification" throughout.
- **$p$**: Used as "per-step success probability" in the Reliability pillar, and also as "probability that current stage's output is correct" in the Temporal pillar (Speculation Ratio Test). These are compatible uses.
- **$\epsilon$**: Used as "per-step instruction violation probability" in Information/Reliability, and as "per-agent error rate" ($\epsilon = 1 - p$) in Coordination. These are different quantities denoted by the same symbol. The Coordination section defines $\epsilon = 1 - p$ explicitly, so this is not ambiguous in context, but the dual use across sections could cause confusion.
- **$\delta$**: Used as "context degradation function" in Information, "per-agent defect injection rate" in Coordination, and "distortion measure" in Governance. Three different meanings for the same symbol across different sections. This is a symbol collision that should be addressed.
- **$n$**: Used as "pipeline length" in Reliability, "number of agents" in Coordination, and "number of individually CI-passing changes" in Quality (Compound Degradation). These are different quantities but used in different contexts with clear local definitions.

**Assessment:** The most problematic symbol collision is $\delta$, which takes three distinct meanings across sections. This should be disambiguated, perhaps by using subscripts ($\delta_{\text{ctx}}$, $\delta_{\text{inj}}$, $\delta_{\text{dist}}$) or different letters.

### 2.3 Theorems from Pillars Missing from Synthesis

The following significant pillar results are absent from the synthesis paper:

1. **Universality of NID (Theorem `thm:nid` from Abstraction):** The normalized information distance and its universality property are not mentioned. This is arguably foundational for the "information as unifying currency" thesis.
2. **Code Dependencies Break Submodularity (Proposition `prop:break` from Information):** The synthesis mentions submodularity but not its failure conditions, which are practically important.
3. **Write Skew Theorem (`thm:write-skew` from Coordination):** The synthesis mentions write skew informally but does not state the formal theorem.
4. **Conway's Law Graph-Theoretic Form (`thm:conway` from Coordination):** Mentioned informally but the formal theorem statement is absent from the theorem index.
5. **Governance Bifurcation (`thm:bifurcation` from Governance):** The transcritical bifurcation is mentioned in prose but not listed in the cross-pillar theorem index (Appendix A).
6. **DRE Cascade Theorem (`thm:drecascade` from Quality):** Defect Removal Efficiency composition under independence is missing.
7. **Double Bottleneck Theorem (`thm:bottleneck` from Governance):** $I(T;G) \leq I(T;(D,A,R)) \leq I(T;L)$, which directly supports the information-theoretic thesis, is not mentioned.
8. **Ratchet Effect / Refactoring Ratio Threshold (from Quality):** The Quality pillar has a specific corollary `cor:refactoring` about the pre-AI vs. post-AI refactoring ratio (0.24 vs. 0.095), which would strengthen the GitClear discussion.

---

## 3. Assessment of "Information as Unifying Currency" Thesis

### Per-Pillar Analysis

| Pillar | Information Theory Usage | Assessment |
|--------|------------------------|------------|
| **Abstraction** | $K(P \mid S)$ as conditional Kolmogorov complexity; Shannon channel model for spec-to-code translation; mutual information $I(S; P)$ as channel capacity. | **Strong and natural.** Information theory is the native formalism here. The abstraction gap *is* an information quantity. |
| **Information** | $H(P \mid S)$ as computable Shannon analog; $f(C) = I(C; P \mid S, \theta)$ as context relevance; gap decomposition using chain rule. | **Strong and natural.** This pillar is explicitly about information flow. The Shannon decomposition is the central result. |
| **Reliability** | $R(n) = p^n$ framed as "information destruction." | **Somewhat forced.** Series reliability is a well-established concept from reliability engineering. Calling compound error "information destruction" is metaphorical rather than mathematically precise. The connection is that errors corrupt the information content of the pipeline's output, but $p^n$ is a probability, not an information quantity. The paper does not derive $p^n$ from information theory; it is a standard reliability result reframed in information-theoretic language. |
| **Coordination** | Error amplification as "correlated information loss across agents." | **Moderately forced.** The coordination pillar draws primarily on concurrency control, graph partitioning, and Amdahl's Law, none of which are information-theoretic. The QAS metric is a ratio of time and quality, not an information measure. The "correlated information loss" framing is imposed retrospectively rather than derived from the formalism. |
| **Temporal** | Context fidelity $\Phi(t) = e^{-\Lambda t}$ as "information decay over time." | **Moderately natural.** The exponential decay of context fidelity can be connected to mutual information decay between the cached context and the current codebase state. However, the Temporal pillar's core results (VIH, speculation ratio, cache EOQ) draw on queueing theory, scheduling theory, and inventory models, not information theory. The information framing is a valid interpretation but not the generative formalism. |
| **Quality** | Detection ceiling $d_{\ell,j} \leq I(X; D_j)/H(D_j)$ via Data Processing Inequality; FKG inequality for correlated errors. | **Strong and natural.** The Detection Ceiling theorem is a genuine information-theoretic result. The DPI application is mathematically rigorous and provides a hard bound. This is one of the strongest information-theoretic connections. |
| **Governance** | Governance capacity $C_{\text{gov}} = \max_{p(X)} I(X;Y)$ as Shannon channel capacity; rate-distortion for theory externalization. | **Strong and natural.** The governance channel capacity model is a direct application of Shannon's channel coding theorem. The rate-distortion formulation for theory preservation is mathematically precise. |

### Overall Assessment

The "information as unifying currency" thesis is **genuinely strong for 4 of 7 pillars** (Abstraction, Information, Quality, Governance) and **somewhat forced for 3** (Reliability, Coordination, Temporal). The forced connections are not *wrong* (information destruction, correlated information loss, and information decay are all valid interpretations), but they are retrospective framings rather than generative insights. The Reliability pillar's $p^n$ and the Coordination pillar's Extended Amdahl's Law would exist unchanged even if the information-theoretic framing were removed entirely.

The paper would be strengthened by acknowledging this asymmetry: the information-theoretic unification is tightest for the semantic and assurance axes (Abstraction, Information, Quality, Governance) and looser for the execution axis (Reliability, Coordination, Temporal), where the native formalisms are reliability theory, concurrency control, and scheduling theory respectively.

---

## 4. Cross-Pillar Synthesis Assessment (Section 9)

### 4.1 The Six Identified Cross-Pillar Connections

**Connection 1: Abstraction Gap Chain (Abstraction -> Information -> Quality)**
- **Assessment: GENUINE AND WELL-ARGUED.** The chain from $K(P|S)$ to $H(P|S)$ decomposition to slop types as failure modes of gap traversal is logically coherent and provides real design insight. The progression from theoretical limit (Kolmogorov) to computable operationalization (Shannon) to practical failure classification (slop taxonomy) is the paper's strongest cross-pillar narrative.

**Connection 2: Compound Error Cascade (Reliability -> Coordination -> Temporal)**
- **Assessment: GENUINE BUT SOMEWHAT SHALLOW.** The connection between $p^n$ (Reliability) and $(1-\delta)^n$ in Extended Amdahl (Coordination) is genuine; they share the same exponential degradation structure. However, the link to VIH (Temporal) is looser: VIH = $\lambda_{\text{raw}} \cdot p_{\text{verify}}$ is a product of rate and quality, not a compound error expression. The paper frames this as "the rate at which compound errors occur," but VIH does not model compounding; it models the tradeoff at a single decision point.

**Connection 3: Structural Enforcement Principle (Information, Reliability, Quality, Coordination)**
- **Assessment: GENUINE AND IMPORTANT.** This is the paper's most practically relevant cross-pillar finding. The convergent appearance of the structural-over-instructional enforcement principle in four independent pillars is strong evidence that it reflects a real phenomenon, not an artifact of the framework. The table (Table 3) documenting the manifestation in each pillar is effective.

**Connection 4: Four-Layer Defense Architecture (Reliability, Quality)**
- **Assessment: GENUINE BUT NARROW.** This is really a two-pillar connection, not a cross-pillar synthesis. The alignment between the Reliability verification layers and Quality defense layers is noted but arguably reflects the fact that both pillars address the same problem (catching defects) from different angles, so convergence is expected rather than revelatory.

**Connection 5: Governance Capacity as Macro Constraint (Governance, Reliability)**
- **Assessment: GENUINE AND INSIGHTFUL.** The structural analogy between per-step compound errors and system-level governance capacity is the paper's deepest theoretical contribution. Both are threshold phenomena with the same mathematical form (rate of degradation vs. capacity for correction), and both yield the same design prescription (invest in correction capacity, not post-hoc repair). This connection genuinely unifies micro (per-step) and macro (system-level) perspectives.

**Connection 6: Information as Unifying Currency (all seven)**
- **Assessment: PARTIALLY FORCED.** See Section 3 above. Strong for 4 pillars, retrospectively imposed on 3.

### 4.2 Obvious Cross-Pillar Connections That Were Missed

1. **Quality (Accretion) <-> Governance (Ratchet):** The Accretion Category (individually CI-passing changes that collectively degrade) is the *content* that the governance ratchet tries to prevent. But the paper does not explicitly connect the Quality pillar's Compound Degradation Theorem to the Governance pillar's ratchet mechanism. How does the ratchet pattern interact with accretion? If the ratchet adds constraints to prevent accretion, does it risk ossification? This tension is unexplored.

2. **Temporal (Context Fidelity) <-> Coordination (Multi-Agent Staleness):** The paper mentions that context fidelity decay rate $\Lambda$ increases with the number of concurrent agents, but does not formalize the interaction. There should be a cross-pillar result: $\Lambda(k) = \Lambda_0 \cdot g(k)$ for some increasing function $g$, connecting the Temporal and Coordination pillars quantitatively.

3. **Abstraction (Refinement Lattice) <-> Governance (Constraint Lattice):** Both pillars use lattice-theoretic structures (Galois connections for abstraction, closure operators for governance), but the paper does not explore whether there is a formal relationship between the specification refinement lattice and the governance constraint lattice. Are governance constraints a form of specification refinement?

4. **Information (Reuse Discovery) <-> Coordination (Task Decomposition):** If task decomposition follows the coupling graph's min-cut, then agents in each partition need to discover reusable code within their partition. The Reuse Discovery Problem should be decomposition-aware, but this connection is absent.

5. **Quality (FKG Inequality / Correlated Errors) <-> Coordination (Error Amplification):** The Quality pillar's FKG inequality for correlated judge-producer errors and the Coordination pillar's empirical error amplification (17.2x exceeding independence predictions) are likely driven by the same underlying phenomenon: shared failure modes. The paper does not connect these formally, even though the Coordination pillar's "correlation multiplier" could potentially be bounded using the FKG framework from the Quality pillar.

---

## 5. Design Principles Assessment (Section 11)

### Per-Principle Analysis

| # | Principle | Source Cited | Formally Grounded? | Assessment |
|---|-----------|-------------|--------------------|----|
| P1 | Budget Context, Do Not Maximize It | Information, Theorem 3.2 (Context Budget) | **Yes.** Directly follows from the non-monotone optimization result. | Solid. |
| P2 | Enforce Structurally What Must Hold Invariantly | Information, Reliability, Quality, Coordination | **Yes.** Follows from $(1-\epsilon)^T$ decay and the structural enforcement boundary. | The strongest principle; supported by four independent pillars. |
| P3 | Invest in Per-Step Quality, Not Pipeline Sophistication | Reliability, Theorem 4.1 (Compound Sensitivity) | **Yes.** Directly follows from elasticity = n. | Solid, though the "not pipeline sophistication" part is an editorial addition not strictly derivable from the theorem. The theorem says per-step improvements are highly leveraged; it does not say pipeline sophistication is *not* leveraged. |
| P4 | Verify with Independent Methods | Reliability (circular bias), Quality (FKG) | **Yes.** Follows from $\beta = \beta_A(1-\beta_{A'})$ and the FKG inequality. | Solid. |
| P5 | Scale Agents to $n^* \approx 1/\sqrt{\delta}$ | Coordination, Theorem 5.1 (Extended Amdahl) | **Yes.** Directly follows from optimizing $S_{\text{eff}}(n)$. | Solid, though the practical utility depends on knowing $\delta$, which is hard to estimate. |
| P6 | Decompose Tasks Along Low-Coupling Boundaries | Coordination, Proposition 5.2 (Cut-Conflict Bridge) | **Yes.** Follows from the min-cut formulation. | Solid. |
| P7 | Match Verification Intensity to Risk | Reliability (adaptive verification), Quality (decidability) | **Partially.** The decidability classification supports different detection approaches, but the "risk matching" aspect (how to measure risk) is not formalized. | The principle is sound but the formal grounding is incomplete. Risk assessment is treated informally. |
| P8 | Design Governance for the Velocity of Change | Governance, Theorem 8.1 (Capacity Bound) | **Yes.** Directly follows from the capacity bound. | Solid. |
| P9 | Optimize for VIH, Not Raw Speed | Temporal, Proposition 6.2 (VIH Optimality) | **Yes.** Follows from VIH maximization at unit elasticity. | Solid, though the paper acknowledges VIH has never been measured in production. |
| P10 | Treat the Abstraction Gap as a Budget | Abstraction (Convergence), Information (Decomposition) | **Partially.** The Spec-Code Convergence theorem establishes a lower bound, and the gap decomposition identifies three sources. But "treating it as a budget" is a design metaphor, not a formal consequence. | The weakest grounding of the ten principles. The formal results establish that the gap exists and can be decomposed, but they do not prescribe *budgeting* as the design response. Other responses (iterative refinement, specification enrichment) are equally consistent with the formalism. |

### Principles Potentially Unsupported

- **P3** has a slight overreach: "not pipeline sophistication" is an editorial judgment, not a formal result. The compound sensitivity theorem says per-step improvements are *highly leveraged*, not that pipeline sophistication is *not* leveraged.
- **P10** is more metaphorical than formally derived. The abstraction gap decomposition identifies three sources of information, but "budget" implies resource allocation optimization, which is not formalized in the Abstraction pillar.
- **P7** relies on the decidability classification (which is well-grounded) but the risk-matching component is informal. No formal model determines what constitutes "high risk" vs. "low risk."

### Missing Principles

Given the formal framework, two design principles seem to follow from the analysis but are not explicitly stated:

1. **Detect Accretion, Not Just Defects.** The Quality pillar's Accretion Category identifies a novel defect class that passes all automated checks. No design principle addresses how to detect or prevent accretion, despite it being "the characteristic defect class of AI-generated code."

2. **Externalize Theory Before It Is Lost.** The Governance pillar's Theory Preservation Problem and Tacit Divergence Conjecture imply that theory should be externalized proactively (before context windows close, before developers leave), not reactively. This is arguably the most important governance principle but is not among the ten.

---

## 6. Summary of Key Findings

### Strengths of the Paper

1. The formal framework is impressively comprehensive, covering seven dimensions with established mathematical machinery.
2. The cross-pillar connections (especially the structural enforcement principle and the governance-reliability analogy) are genuine insights, not superficial.
3. The empirical foundations section (Section 10) is refreshingly honest about evidence quality.
4. The Governance Information Budget (Equation 9) is a compelling integrative concept.
5. The Kim et al. 2025 and Liu et al. 2024 citations are accurately used.

### Weaknesses Requiring Revision

1. **GitClear citation imprecision:** The "8x duplication" refers to blocks of 5+ duplicated lines, not overall duplication rate. Should be clarified.
2. **DORA citation mischaracterization:** "21% throughput increase" should be "21% more tasks completed at the individual level." Organizational throughput stayed flat, which is a different (and actually stronger) claim for the paper's thesis.
3. **METR finding overstated in Section 4:** The "roughly 50%" is approximately correct, but the paper should note the 68% baseline merge rate for human patches and the small evaluator pool when first introducing this finding, not only in Section 10.
4. **Symbol collision:** $\delta$ means three different things across sections. This should be disambiguated.
5. **Information-theoretic unification is asymmetric:** Strong for 4 pillars, somewhat forced for 3. The paper should acknowledge this rather than claiming uniform coverage.
6. **Missing cross-pillar connections:** At least five natural connections (Quality-Governance accretion-ratchet interaction, Temporal-Coordination staleness scaling, lattice structure parallels, decomposition-aware reuse, FKG-amplification unification) are absent.
7. **P3 and P10** are weaker than the other principles in their formal grounding.
8. **Several important pillar theorems are missing** from the synthesis (Double Bottleneck, DRE Cascade, NID Universality, governance bifurcation formal statement).

### Overall Assessment

The paper makes a credible case that harness architecture admits formal analysis, and the seven-pillar decomposition is productive. The cross-pillar synthesis is the paper's primary contribution and is largely successful, with the structural enforcement principle and the governance capacity analogy being genuinely insightful. The main risks are: (a) overselling the information-theoretic unification where it is more metaphorical than mathematical for the execution-axis pillars, (b) small inaccuracies in empirical citations that could undermine credibility with reviewers who check sources, and (c) missing cross-pillar connections that would strengthen the synthesis. The empirical calibration gap is honestly acknowledged and does not weaken the contribution, since the paper's thesis is about the *approach* (formal analysis of harness design) rather than specific quantitative predictions.

---

## Sources

- [GitClear AI Copilot Code Quality 2025](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
- [DORA Report 2025 Key Takeaways (Faros)](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025)
- [Announcing the 2025 DORA Report (Google Cloud)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)
- [DORA State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/)
- [Kim et al. 2025, "Towards a Science of Scaling Agent Systems" (arXiv:2512.08296)](https://arxiv.org/abs/2512.08296)
- [METR: Many SWE-bench-Passing PRs Would Not Be Merged](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/)
- [Liu et al. 2024, "Lost in the Middle" (ACL Anthology)](https://aclanthology.org/2024.tacl-1.9/)
- [Liu et al. 2024, "Lost in the Middle" (arXiv:2307.03172)](https://arxiv.org/abs/2307.03172)
- [GitClear AI Code Quality Research PDF](https://gitclear-public.s3.us-west-2.amazonaws.com/GitClear-AI-Copilot-Code-Quality-2025.pdf)
- [DORA 2025 Summary (Scrum.org)](https://www.scrum.org/resources/blog/dora-report-2025-summary-state-ai-assisted-software-development)
- [DORA 2025: Measuring Software Delivery After AI (RedMonk)](https://redmonk.com/rstephens/2025/12/18/dora2025/)
