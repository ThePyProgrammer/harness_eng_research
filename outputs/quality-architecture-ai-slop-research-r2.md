# R2: Formal Foundations for Multi-Layer Defect Detection Optimization

## Research Agent: Formal/Theoretical Foundations

This document surveys the mathematical frameworks, theorems, and formal results relevant to designing optimal layered defense systems for code quality, with specific application to the AI slop detection problem defined in Pillar 5.

---

## 1. Signal Detection Theory (SDT) Applied to Software Defects

### 1.1 The Neyman-Pearson Lemma and Optimal Detection

**Theorem (Neyman-Pearson, 1933).** For testing a simple null hypothesis H0 against a simple alternative H1 at significance level alpha, the likelihood ratio test (LRT) is the most powerful test. That is, among all tests with false positive rate at most alpha, the LRT maximizes the detection probability (true positive rate).

- **Authors:** Jerzy Neyman and Egon Pearson, 1933. "On the Problem of the Most Efficient Tests of Statistical Hypotheses," Philosophical Transactions of the Royal Society A, 231:289-337.
- **Application to layered defense:** Each defense layer is a binary detector (defect present / absent). The Neyman-Pearson lemma tells us that for any single layer with a fixed false alarm budget, the optimal detector is the likelihood ratio test. This means each layer should be designed to compute the best available likelihood ratio for the defect types it targets, not arbitrary heuristic scores. When a layer uses a threshold on cyclomatic complexity or clone detection similarity, it is implicitly approximating a likelihood ratio.
- **Limitations:** Requires known distributions under both hypotheses (defect-present and defect-absent). In practice, the "signal" distribution for code defects is poorly characterized and non-stationary; new AI models produce new defect distributions. The lemma applies to a single binary test, not directly to cascaded multi-stage detection.

### 1.2 ROC Curves and d-Prime for Detector Characterization

**Framework.** Signal Detection Theory (Green & Swets, 1966) provides the ROC (Receiver Operating Characteristic) curve as a complete characterization of a detector's performance across all possible thresholds. The sensitivity parameter d' (d-prime) measures the separation between the "noise" (clean code) and "signal+noise" (defective code) distributions, normalized by their common standard deviation.

- **Authors:** David M. Green and John A. Swets, "Signal Detection Theory and Psychophysics," Wiley, 1966.
- **Application:** Each defense layer can be characterized by its ROC curve for each defect type. The d' value quantifies how inherently detectable a defect type is by a given mechanism. For example:
  - Hallucinated imports (lockfile validation): d' is effectively infinite (deterministic detection, ROC hugs the upper-left corner).
  - Over-engineering (LLM judgment): d' is likely in the range 1.0-2.0, meaning substantial overlap between "defective" and "acceptable" distributions.
  - Meaningless tests: d' may be below 0.5 for any current automated detector.
- **Key insight:** The ROC framework makes explicit that there is no "accuracy" for a detector independent of the threshold chosen. The same LLM-as-Judge layer at a strict threshold catches few false positives but misses many real defects; at a lax threshold it catches more defects but generates review fatigue. The optimal threshold depends on the cost ratio D_j / c_ell from the Pillar 5 formulation.
- **Limitations:** Assumes stationary distributions. Code defect distributions shift as AI models are updated, as codebases evolve, and as developers adapt to quality gates.

### 1.3 Optimal Threshold Selection

**Result.** Given costs C_FA for false alarms and C_miss for missed detections, and prior probability pi of a defect being present, the optimal threshold lambda* for a likelihood ratio test satisfies:

    lambda* = (C_FA / C_miss) * ((1 - pi) / pi)

- **Application:** In the layered defense context, this tells us that layers targeting high-cost defects (security vulnerabilities, D_j large) should use lower thresholds (more sensitive, more false alarms tolerated), while layers targeting low-cost defects (redundant comments) should use higher thresholds (more specific, fewer false alarms). This directly informs the Pillar 5 decision about which layers "block" vs. "flag."

---

## 2. Bayesian Cascade Classifiers: Theory of Optimal Sequential Filtering

### 2.1 The Viola-Jones Cascade Architecture

**Result (Viola & Jones, 2001).** A cascade of classifiers of increasing complexity can achieve high detection rates with very low false positive rates by rapidly rejecting easy negatives in early stages. For a K-stage cascade where each stage has detection rate d_k and false positive rate f_k:

    Overall detection rate: D = product(d_k, k=1..K)
    Overall false positive rate: F = product(f_k, k=1..K)

For a 32-stage cascade achieving F = 10^-6, each stage needs only f_k ~ 0.65. To maintain D ~ 0.90, each stage needs d_k ~ 0.997.

- **Authors:** Paul Viola and Michael Jones, "Rapid Object Detection using a Boosted Cascade of Simple Features," CVPR 2001.
- **Application to code quality:** This is the direct mathematical model for the four-layer quality stack in Pillar 5. Layer 1 (structural gates, ~2s) rejects obviously clean code quickly (high f_1, say 0.3, meaning 70% of code passes without triggering). Layer 2 (deterministic analysis, ~10s) catches more subtle issues. Layer 3 (LLM-as-Judge, ~30s) is expensive and only sees code that survived cheaper layers. The multiplicative false positive reduction means that even if each LLM judgment layer has a 20% false positive rate, three independent such layers would yield 0.8% overall false positive rate.
- **Key optimization insight:** The cascade should be ordered by the ratio of cost to information gain. Cheap, fast layers with even modest discrimination should come first because they filter the input space for expensive layers.
- **Limitations:** The original Viola-Jones theory assumes a single defect class (face vs. non-face). The code quality problem is multi-class (18 defect types), requiring type-specific cascade paths. Also, "optimal design of a whole cascade is still an open problem" (Viola & Jones, 2001).

### 2.2 CASCARO and Cost-Optimal Cascading

**Result (CASCARO, Seyedi et al., 2021).** For a sequential cascade of classifiers of increasing cost, examples should be submitted to the cheapest classifier first and forwarded to the next classifier only if prediction confidence is below a threshold. The optimal forwarding threshold balances the cost of misclassification against the cost of invoking the next classifier.

- **Authors:** Seyedi et al., "CASCARO: Cascade of classifiers for minimizing the cost of prediction," Pattern Recognition Letters, 2021.
- **Application:** This formalizes the "escalation" logic in the quality stack. A lint check (cost ~0.1s) that flags a potential issue with low confidence should escalate to AST analysis (cost ~1s); if still uncertain, escalate to LLM judgment (cost ~10s). The framework provides the optimal confidence thresholds for each escalation decision.

### 2.3 Wald's Sequential Probability Ratio Test (SPRT)

**Theorem (Wald, 1945; Wald & Wolfowitz, 1948).** The Sequential Probability Ratio Test is optimal in the sense of requiring the minimum expected number of observations to reach a decision for given Type I and Type II error probabilities. The SPRT computes a running likelihood ratio and stops when it crosses an upper threshold (decide H1: defect present) or lower threshold (decide H0: no defect).

- **Authors:** Abraham Wald, "Sequential Tests of Statistical Hypotheses," Annals of Mathematical Statistics, 16(2):117-186, 1945. Optimality proof: Wald and Wolfowitz, 1948.
- **Application:** Each layer in the defense stack can be modeled as accumulating evidence about defect presence. The SPRT framework says that rather than running every layer to completion, the system should stop as soon as accumulated evidence crosses a threshold. This is especially relevant for LLM-as-Judge layers: if the first LLM review gives very high confidence of a defect, there is no need for a second opinion. If confidence is ambiguous, invoke a second (diverse) LLM reviewer. This is the formal basis for adaptive review depth.
- **Key result for practice:** The SPRT's expected sample size is strictly less than any fixed-sample-size test achieving the same error rates. Translation: an adaptive quality stack that decides how many layers to invoke per-item will always be cheaper than a fixed stack that runs all layers on every item.

---

## 3. Information-Theoretic Bounds on Defect Detection

### 3.1 The Data Processing Inequality (DPI)

**Theorem (Cover & Thomas, 1991).** For a Markov chain X -> Y -> Z, the mutual information satisfies I(X; Z) <= I(X; Y). That is, no processing of data can increase the information about the source.

- **Authors:** Thomas M. Cover and Joy A. Thomas, "Elements of Information Theory," Wiley, 1991.
- **Application to layered defense:** Consider X = true defect state, Y = code features available to a detector, Z = detector output. The DPI tells us that a detector can never extract more information about the defect state than is present in the features it observes. This has two critical implications:
  1. **Feature sufficiency:** If a defense layer only sees the diff (not the full file context, not the task description, not the test suite), the DPI bounds how much it can know about certain defect types. This formally justifies why context-rich layers (LLM with full repo context) can detect defects that context-poor layers (line-level linters) provably cannot.
  2. **Pipeline information loss:** Each abstraction step (source code -> AST -> metrics -> threshold decision) loses information. The DPI says this loss is irrecoverable within that pipeline. Different pipelines observing different features can recover complementary information, which is the formal justification for diverse detection layers.
- **Limitations:** The DPI is an inequality, not an equality. It says what cannot be done, not what can be achieved. Actual mutual information between code features and defect presence must be estimated empirically.

### 3.2 Mutual Information as a Universal Detection Performance Indicator

**Result (Zhou, 2017; various).** The mutual information I(X; Y) between the true system state X and extracted features Y serves as a universal upper bound on fault detection performance. The larger the mutual information preserved by a feature extraction method, the better the achievable fault detection performance, regardless of the specific classifier used.

- **Application:** This provides a principled way to evaluate and compare defense layers. Rather than comparing detection rates (which depend on thresholds), compare the mutual information each layer's features carry about each defect type. A layer that preserves high MI for security vulnerabilities but low MI for naming drift should be assigned to security detection, not naming review.

### 3.3 Fano's Inequality and Detection Error Bounds

**Theorem (Fano, 1961).** For any estimator of a discrete random variable X from observation Y, the probability of error P_e satisfies:

    H(P_e) + P_e * log(|X| - 1) >= H(X | Y) = H(X) - I(X; Y)

Where H denotes entropy and I denotes mutual information.

- **Authors:** Robert Fano, "Transmission of Information," MIT Press, 1961.
- **Application:** Fano's inequality provides a lower bound on the detection error rate for any detector, given the mutual information between defect state and available features. If I(defect; features) is low for a given defect type and feature set, Fano's inequality proves that no classifier (no matter how sophisticated, including any future AI) can achieve low error rates. This is the information-theoretic formalization of why some defect types are in the "no reliable detection" category: the features available to automated systems simply do not carry enough information about those defect types.

---

## 4. Rice's Theorem and the Limits of Automated Program Analysis

### 4.1 Rice's Theorem

**Theorem (Rice, 1953).** For any non-trivial semantic property P of programs (i.e., P is true for some programs and false for others, and P depends only on the function computed, not on the program text), it is undecidable whether an arbitrary program has property P.

- **Author:** Henry Gordon Rice, "Classes of Recursively Enumerable Sets and Their Decision Problems," Transactions of the American Mathematical Society, 74(2):358-366, 1953.
- **Application to code quality:** Rice's theorem establishes that no automated tool can perfectly decide any interesting semantic property of arbitrary programs. This includes:
  - "Does this function handle all error cases?" (the happy-path error handling defect)
  - "Is this abstraction necessary?" (the over-engineering defect)
  - "Does this test meaningfully verify behavior?" (the meaningless test defect)
  - "Does this code do what the task description asks?" (the scope compliance check)
  All of these are non-trivial semantic properties, and Rice's theorem proves they are undecidable in general.
- **Practical implications:** Rice's theorem does not say automated analysis is useless. It says automated analysis cannot be both sound (no false negatives) and complete (no false positives) for semantic properties. The practical response is to choose:
  - **Sound over-approximation (abstract interpretation):** Flag everything that might be a defect, accept false positives. Useful for safety-critical properties.
  - **Complete under-approximation (testing):** Only flag confirmed defects, accept false negatives. Useful for non-critical properties where false alarm cost is high.
  - **Heuristic approximation (LLM judgment):** Neither sound nor complete, but practically useful. The quality stack uses all three.
- **Limitation:** Rice's theorem applies to Turing-complete languages. For restricted languages or specific syntactic properties, decidability may be recovered.

### 4.2 Abstract Interpretation as a Principled Response to Rice's Theorem

**Framework (Cousot & Cousot, 1977).** Abstract interpretation provides a theory of sound approximation of program semantics. By computing over abstract domains (intervals, polyhedra, etc.) rather than concrete values, abstract interpretation can prove the absence of certain defect classes (null dereference, buffer overflow, arithmetic overflow) at the cost of false positives but with zero false negatives.

- **Authors:** Patrick Cousot and Radhia Cousot, "Abstract Interpretation: A Unified Lattice Model for Static Analysis of Programs by Construction or Approximation of Fixpoints," POPL 1977.
- **Application:** The seven "mechanically detectable" defect types in Pillar 5 correspond to properties amenable to sound abstract interpretation or equivalent syntactic analysis. The ASTREE analyzer (based on abstract interpretation) proved absence of runtime errors in the A380 flight control software before its maiden flight; this demonstrates that for restricted property classes, Rice's undecidability can be practically circumvented.
- **Key insight for the quality stack:** Layer 1 (structural gates) and Layer 2 (deterministic analysis) should use sound analyses wherever possible. The cost of false positives in these layers is manageable because they are cheap to re-check. Layers 3-4 handle properties where sound analysis is either impossible (Rice's theorem) or would produce intolerable false positive rates.

---

## 5. Decision Theory for Quality Investment

### 5.1 Optimal Stopping and Value of Information

**Framework (Wald, 1947; DeGroot, 1970).** The optimal stopping problem asks: given a sequential process of gathering information (running quality checks), when should one stop and make a decision (ship the code)? The value of information (VOI) for an additional check is the expected reduction in decision cost from running that check.

- **Key result (Lehrer & Wang, 2022):** Among all history-dependent fee schemes for acquiring information, the upfront scheme is optimal and generates the highest possible value of information. Translation: paying for quality checks upfront (at commit time) dominates waiting for defects to surface in production.
- **Application:** Each additional defense layer has a cost c_ell and provides information that reduces expected defect cost. The optimal stopping rule says: add another layer if and only if the expected cost reduction exceeds the layer cost. Formally, add layer ell+1 if:

      sum_j [ p_j * D_j * product(1 - d_{k,j}, k=1..ell) * d_{ell+1,j} ] > c_{ell+1}

  The left side is the expected defect cost reduction from adding layer ell+1, computed across all defect types weighted by their probability p_j and residual escape probability after existing layers.

### 5.2 Capers Jones: Empirical Defect Removal Efficiency

**Empirical law (Jones, 1996-2011).** Based on data from thousands of software projects:
- Most forms of testing alone are less than 50% efficient in finding defects.
- Formal design and code inspections exceed 65% defect removal efficiency.
- High DRE (>95%) requires a combination of inspections, static analysis, and testing; it cannot be achieved by testing alone.
- Projects with DRE below 85% will always run late, always exceed budget, and never have satisfied customers.
- Best-in-class projects achieve >99% DRE through the combination of formal inspections, static analysis, and formal testing.

- **Author:** Capers Jones, "Software Defect Removal Efficiency," 1996; "The Economics of Software Quality" (with Olivier Bonsignour), Addison-Wesley, 2011.
- **Application:** Jones' empirical data is the strongest available evidence that layered defense works and that no single technique suffices. His finding that DRE > 95% requires the combination of inspections + static analysis + testing directly validates the multi-layer architecture. The four-layer quality stack in Pillar 5 maps to Jones' categories:
  - Layer 1-2 (structural + deterministic) corresponds to static analysis (~65% DRE individually)
  - Layer 3 (LLM-as-Judge) corresponds to automated inspection (~50-65% DRE)
  - Layer 4 (human review) corresponds to formal inspection (~65%+ DRE)
  - Combined: 1 - (1-0.65)(1-0.50)(1-0.65) = ~93.9% DRE, approaching Jones' 95% threshold

---

## 6. Ensemble Classifier Theory and Diverse Detection

### 6.1 Condorcet's Jury Theorem

**Theorem (Condorcet, 1785).** If each of n independent voters has probability p > 0.5 of choosing the correct option, then the probability that the majority vote is correct:
- Strictly increases with n
- Approaches 1 as n approaches infinity

**Converse:** If p < 0.5, the majority vote probability approaches 0 as n increases.

- **Author:** Marquis de Condorcet, "Essay on the Application of Analysis to the Probability of Majority Decisions," 1785.
- **Application:** If multiple independent LLM reviewers each have >50% accuracy on a defect type, majority voting improves accuracy. Three independent reviewers each with 75% accuracy yield majority-vote accuracy of 84.4%. Five such reviewers yield 89.6%.
- **Critical limitation:** The independence assumption. Condorcet's theorem breaks down when voters (detectors) are correlated. For LLMs, this is a severe concern: models trained on similar data with similar architectures produce correlated errors. Empirical work (arxiv:2409.00094) shows that "the anticipated independence among various LLMs, including state-of-the-art models like ChatGPT 4, is not sufficiently pronounced to harness the full potential of the majority vote mechanism."

### 6.2 Kuncheva's Diversity Measures

**Result (Kuncheva & Whitaker, 2003).** Ten diversity measures for classifier ensembles were studied: the Q statistic, correlation, disagreement, double fault (pairwise), and entropy of votes, difficulty index, Kohavi-Wolpert variance, interrater agreement, generalized diversity, coincident failure diversity (non-pairwise). Key finding: "there tends only to be high negative correlation between diversity and generalization error when diversity is low and generalization error is high; as diversity increases, the correlation with generalization error decreases."

- **Authors:** Ludmila I. Kuncheva and Christopher J. Whitaker, "Measures of Diversity in Classifier Ensembles and Their Relationship with the Ensemble Accuracy," Machine Learning, 51(2):181-207, 2003.
- **Application:** For the quality stack, the practical implication is that maximizing diversity among detectors (different tools, different LLMs, different analysis paradigms) helps most when individual detectors are weak. For strong detectors (d' > 2), additional diverse detectors add diminishing value. This means:
  - For mechanically detectable types (already d ~ 0.95): diversity adds little value; one good detector suffices.
  - For LLM-judgment types (d ~ 0.75): diversity between judge models matters. Using Claude to judge GPT-generated code, or vice versa, reduces correlated failures.
  - For currently undetectable types (d < 0.3): diversity among weak detectors still yields weak ensembles; fundamentally better detection approaches are needed.

### 6.3 Littlewood and Strigini: Diverse Redundancy in Software

**Result (Littlewood & Strigini, 1993; 2004).** In diverse software systems, the assumption that independently developed versions fail independently is empirically false. Real diverse software versions exhibit "quite strongly correlated" failure processes. Under "quite plausible assumptions, it would be unreasonable even to expect software versions that were developed 'truly independently' to fail independently of one another" because some inputs are inherently more difficult, causing correlated failures across versions. However, despite correlation, diverse systems are still "a lot more reliable on average than individual versions."

For diverse fault-finding techniques specifically, Littlewood and Strigini showed that "better than independence" can actually be attained; the effectiveness of combined diverse fault-finding can exceed what independence would predict.

- **Authors:** Bev Littlewood and Lorenzo Strigini. Key publications:
  - "Validation of Ultra-High Dependability for Software-based Systems," Communications of the ACM, 36(11):69-80, 1993.
  - "Redundancy and Diversity in Security," SAFECOMP 2004.
  - "Modelling the Effects of Combining Diverse Software Fault Detection Techniques," EDCC 2008.
- **Application:** This is the most directly relevant result for the layered defense architecture. The implications are:
  1. **Do not assume independence between layers.** When Layer 2 (AST analysis) and Layer 3 (LLM review) both look at the same code, their detection failures are correlated; some defect instances are "harder" for all methods.
  2. **Despite correlation, diversity still helps.** The multiplicative escape probability formula from Pillar 5 (product of (1 - d_{ell,j})) is an optimistic lower bound on escape probability because it assumes independence. The actual escape probability is higher, but still lower than any single layer's escape rate.
  3. **For fault-finding (as opposed to fault tolerance), super-independence is possible.** Different detection techniques may find different aspects of the same defect, achieving combined detection rates that exceed independence predictions. This is a reason to use qualitatively different detection methods (static analysis + dynamic testing + LLM review) rather than multiple instances of the same method.

---

## 7. The Formal Optimization Problem

### 7.1 Precise Formulation

The layered defense optimization from Pillar 5, restated with full formal context:

**Given:**
- J defect types, each with prior probability p_j and downstream cost D_j
- L candidate defense layers, each with cost c_ell and detection probability d_{ell,j} for type j
- A correlation structure rho_{ell,ell',j} between layers for each defect type

**Find:** For each defect type j, the subset Lambda_j of layers to apply, minimizing:

    min_{Lambda_j} sum_j [ sum_{ell in Lambda_j} c_ell + p_j * D_j * P_escape(j, Lambda_j) ]

where P_escape accounts for correlation:

    P_escape(j, Lambda_j) >= product_{ell in Lambda_j} (1 - d_{ell,j})

with equality when layers are independent and strict inequality when layers are positively correlated.

### 7.2 Structural Properties of the Optimal Solution

**Observation 1 (Greedy ordering by ROI).** If layers are independent and each layer's cost is fixed regardless of which defect types it targets, the problem decomposes by defect type. For each type j, layers should be added in decreasing order of ROI_j(ell) = d_{ell,j} * D_j / c_ell until the marginal ROI drops below 1.

**Observation 2 (Cheap layers first).** In a cascade (where later layers only process items that pass earlier layers), it is optimal to order layers by c_ell / (1 - f_ell), where f_ell is the false positive rate. This generalizes the Viola-Jones insight to heterogeneous cost structures.

**Observation 3 (Shared costs across types).** When the same layer is applied to multiple defect types, its cost is amortized. This creates coupling between the per-type optimization problems, making the joint problem NP-hard in general (it reduces to a variant of weighted set cover). However, the practical problem size (18 types, 4-6 layers) is small enough for exact enumeration.

### 7.3 Connection to Inspection Allocation in Operations Research

**Result (Allocation of Screening Inspection Effort, White, 1964).** Dynamic programming can optimally allocate inspection points in multistage production systems, where each stage has a cost of inspection, a probability of detecting defects, and a cost of passing defective items to the next stage.

- **Author:** L.S. White, "Allocation of Screening Inspection Effort," Management Science, 10(2):342-352, 1964.
- **Application:** The code quality stack is formally a multistage inspection system. White's dynamic programming formulation applies directly, with "stages" corresponding to defense layers and "items" corresponding to code changes. The DP state tracks the posterior probability of each defect type given the results of earlier layers, and the decision at each stage is whether to inspect further or accept/reject.

---

## 8. Software Reliability Theory

### 8.1 Musa's Software Reliability Models

**Model (Musa, 1975; Musa & Okumoto, 1984).** The failure intensity (failures per unit time) of software decreases as defects are found and fixed, following either an exponential model (constant defect discovery rate per remaining defect) or a logarithmic model (decreasing discovery rate). The operational profile determines which defects are encountered and thus which are removed.

- **Authors:** John D. Musa, "A Theory of Software Reliability and its Application," IEEE Trans. Software Engineering, 1(3):312-327, 1975. Musa and Okumoto, "A Logarithmic Poisson Execution Time Model for Software Reliability Measurement," ICSE 1984.
- **Application:** Musa's models predict that each defense layer contributes to reliability growth proportional to its defect removal efficiency weighted by the operational profile. A critical implication: if the defense stack catches defects in proportion to their operational exposure (how often users will trigger them), reliability growth is maximized. This argues for operationally-weighted defect prioritization; not all 18 slop types are equally likely to be exercised in production.

### 8.2 Fenton and Neil: Bayesian Networks for Defect Prediction

**Framework (Fenton & Neil, 2008).** Bayesian networks enable causal modeling of software defect prediction, incorporating process factors (testing effort, development methodology, team experience) alongside product metrics (code complexity, size). Key advantage over regression-based approaches: BNs can represent causal relationships and handle missing data, avoiding the ecological fallacy of treating correlations in aggregate data as causal.

- **Authors:** Norman Fenton, Martin Neil, and David Marquez, "Using Bayesian Networks to Predict Software Defects and Reliability," Proceedings of the Institution of Mechanical Engineers, Part O: Journal of Risk and Reliability, 222(4):701-712, 2008.
- **Application:** The prior probabilities p_j in the optimization problem should not be fixed constants but should be computed from a causal model incorporating:
  - Which AI model generated the code (different models have different defect profiles)
  - The complexity of the task (harder tasks produce more defects)
  - Whether the code was generated in a single pass or iteratively refined
  - The developer's review effort before submission
  A Bayesian network encoding these factors would produce per-commit defect type probabilities, enabling adaptive layer selection: high-risk commits get more layers, low-risk commits get fewer.

---

## 9. Synthesis: What the Formal Foundations Tell Us About the Quality Stack

### 9.1 Formally Justified Design Principles

1. **Order layers by cost-effectiveness ratio** (Viola-Jones cascade theory, CASCARO). Cheap deterministic checks first, expensive probabilistic checks last. The multiplicative false-positive reduction of cascades means early cheap filtering dramatically reduces the cost of later expensive analysis.

2. **No single layer suffices** (Capers Jones empirical law, Rice's theorem). DRE > 95% requires combining inspection, static analysis, and testing. Rice's theorem proves that no single automated method can be both sound and complete for semantic defect properties.

3. **Layer independence matters but should not be assumed** (Littlewood & Strigini, Kuncheva). Different analysis paradigms (syntactic, semantic, dynamic, LLM-based) provide partially independent detection, but correlated failures are inevitable for intrinsically hard defect instances. The independence-assumption escape probability is a lower bound on actual escape probability.

4. **Adaptive depth beats fixed depth** (Wald SPRT). The system should invest more review effort in uncertain cases and less in clear cases. A fixed four-layer stack applied uniformly wastes resources on obviously clean code and under-invests in suspicious code.

5. **Some defect types have information-theoretic detection ceilings** (Data Processing Inequality, Fano's inequality). If the features available to a layer carry insufficient mutual information about a defect type, no classifier improvement can fix this; better features (more context, different representations) are needed.

6. **The optimal threshold for each layer depends on defect costs** (Neyman-Pearson, SDT). High-cost defects (security vulnerabilities) justify sensitive thresholds with more false alarms. Low-cost defects (naming drift) justify specific thresholds with more missed detections.

7. **Prior probabilities should be conditioned on context** (Fenton & Neil BNs, Musa operational profiles). Not all commits have the same defect profile. Adaptive priors based on commit metadata, AI model identity, and task complexity improve cost-effectiveness.

### 9.2 Open Problems and Research Frontier

1. **Estimating d_{ell,j} empirically.** The detection probability of each layer for each defect type has never been systematically measured for AI-generated code. The 18-type taxonomy from Pillar 5 needs a calibration dataset with known defect labels.

2. **Quantifying layer correlation.** The Littlewood-Strigini correlation structure between detection layers (linter, AST analysis, LLM review) for code defects is unknown. Measuring this requires controlled experiments where the same defective code is submitted to all layers.

3. **Optimal cascade design for multi-class detection.** The Viola-Jones theory handles binary classification; extending it optimally to 18 defect types with shared layer costs is an unsolved combinatorial optimization problem (though tractable at this scale).

4. **Non-stationary defect distributions.** As AI models improve, the defect distribution shifts. The quality stack needs to adapt its parameters without manual recalibration. Online learning approaches from sequential decision theory may apply.

5. **LLM judge-producer correlation.** When using one LLM to judge another's output, the error correlation due to shared training data is a fundamental limitation. Quantifying this correlation for code quality judgment, and determining whether cross-model diversity (Claude judging GPT output) meaningfully reduces it, is an empirical question grounded in the Condorcet/Kuncheva theoretical framework.

---

## References

1. Neyman, J. and Pearson, E. (1933). "On the Problem of the Most Efficient Tests of Statistical Hypotheses." Philosophical Transactions of the Royal Society A, 231:289-337.
2. Green, D.M. and Swets, J.A. (1966). Signal Detection Theory and Psychophysics. Wiley.
3. Viola, P. and Jones, M. (2001). "Rapid Object Detection using a Boosted Cascade of Simple Features." CVPR 2001.
4. Seyedi, S.A. et al. (2021). "CASCARO: Cascade of classifiers for minimizing the cost of prediction." Pattern Recognition Letters.
5. Wald, A. (1945). "Sequential Tests of Statistical Hypotheses." Annals of Mathematical Statistics, 16(2):117-186.
6. Wald, A. and Wolfowitz, J. (1948). "Optimum Character of the Sequential Probability Ratio Test." Annals of Mathematical Statistics, 19(3):326-339.
7. Cover, T.M. and Thomas, J.A. (1991). Elements of Information Theory. Wiley.
8. Fano, R.M. (1961). Transmission of Information. MIT Press.
9. Rice, H.G. (1953). "Classes of Recursively Enumerable Sets and Their Decision Problems." Transactions of the American Mathematical Society, 74(2):358-366.
10. Cousot, P. and Cousot, R. (1977). "Abstract Interpretation: A Unified Lattice Model for Static Analysis of Programs." POPL 1977.
11. Jones, C. (1996). "Software Defect Removal Efficiency." Software Productivity Research.
12. Jones, C. and Bonsignour, O. (2011). The Economics of Software Quality. Addison-Wesley.
13. Condorcet, M. (1785). Essay on the Application of Analysis to the Probability of Majority Decisions.
14. Kuncheva, L.I. and Whitaker, C.J. (2003). "Measures of Diversity in Classifier Ensembles and Their Relationship with the Ensemble Accuracy." Machine Learning, 51(2):181-207.
15. Littlewood, B. and Strigini, L. (1993). "Validation of Ultra-High Dependability for Software-based Systems." Communications of the ACM, 36(11):69-80.
16. Littlewood, B. and Strigini, L. (2004). "Redundancy and Diversity in Security." SAFECOMP 2004.
17. Musa, J.D. (1975). "A Theory of Software Reliability and its Application." IEEE Trans. Software Engineering, 1(3):312-327.
18. Fenton, N., Neil, M., and Marquez, D. (2008). "Using Bayesian Networks to Predict Software Defects and Reliability." Proc. IMechE Part O, 222(4):701-712.
19. White, L.S. (1964). "Allocation of Screening Inspection Effort." Management Science, 10(2):342-352.
20. Lehrer, E. and Wang, T. (2022). "The Value of Information in Stopping Problems." arXiv:2205.06583.
21. Zhou, Y. (2017). "Statistical Learning for Sparse Sensing and Agile Operation." UC Berkeley EECS Tech Report.
