# Peer Review: Quality Architecture for AI-Generated Code

## Summary

The paper presents a formal framework for layered defense against AI-generated code defects ("slop"). It combines computability theory (Rice's theorem), information theory (Data Processing Inequality), decision theory (optimization), and diversity theory (correlated failures) into a coherent model, calibrated against eight empirical studies. The paper introduces the Accretion Category as a novel defect class and proves several useful results about detection ceilings, optimal layer ordering, and compound degradation.

---

## Evaluation

### Novelty and Significance

**Rating: STRONG** -- The synthesis is novel and timely. No prior work combines these formal tools for the specific problem of AI code quality defense. The Accretion Category (correct, unnecessary, individually defensible, collectively harmful) is a genuine conceptual contribution that fills a gap in classical taxonomies. The compound degradation theorem formalizes an important intuition about codebase health.

**MINOR**: The individual formal results are applications of established theorems (DPI, FKG, submodularity, Rice's theorem), not new mathematics. The paper acknowledges this ("theory and position paper") but should be more explicit about the boundary between established results and novel application.

### Formal Rigor

**Rating: GOOD with caveats**

1. **MINOR**: Theorem 5.1 (Compound Degradation) -- the proof sketch is incomplete. The claim that entropy grows "superlinearly" depends on the growth rate of $|\mu(f_i)|$ with $n$, but the sublinear growth assumption ($n^\beta$) is not justified. Under what conditions does modification context actually grow sublinearly? If coupling is local (bounded-degree dependency graph), $|\mu(f_i)|$ could be $O(1)$, and entropy growth would be linear, not superlinear. The superlinearity claim needs either a stronger assumption or empirical support.

2. **MINOR**: The Gaussian copula model (Theorem 6.2) is a modeling choice, not a derived result. The paper should note that the copula choice affects the correlation penalty quantitatively. Other copula families (Clayton, Frank) would give different penalty magnitudes.

3. **MINOR**: Definition 5.1 (Codebase Entropy) defines $|\mu(f_i)|$ as the minimum modification context, but "minimum" is not well-defined without specifying the modification task. Different modifications to the same file require different context sets. The definition should either fix a modification distribution or use the expected modification context.

4. **MINOR**: The three-factor orthogonality claim (Proposition 3.3) is stated without empirical validation. The paper correctly identifies the ISSRE 2025 dataset as a validation candidate but should more clearly label this as a hypothesis rather than a proposition.

### Empirical Grounding

**Rating: GOOD**

1. **MAJOR**: The detection probability matrix (Table 3) is a central artifact of the paper, but many entries have confidence level E (estimated from first principles) or L (extrapolated). The paper should include a sensitivity analysis: how do the ROI prescriptions change if the E/L estimates are off by 50%? If the conclusions are robust to estimation error, that strengthens the paper substantially. If not, the paper should acknowledge which prescriptions depend on low-confidence estimates.

2. **MINOR**: The "41% of production code is AI-generated" claim is used as motivation but acknowledged as "methodologically soft." The paper should be clearer about what aspects of the analysis depend on the absolute rate versus the relative quality differential (which is better established).

3. **MINOR**: The cost estimates (Table 4) assume developer loaded cost of $80/hr. These should be parameterized, since they vary significantly by region and company. The ROI rankings may be robust to cost variations, but this should be verified.

### Logical Gaps

1. **MAJOR**: The Enforcement Gap Theorem (Theorem 8.2) claims that an LLM achieving P=1 for a semantic property would "constitute a decision procedure, contradicting Rice's theorem." This is technically incorrect: Rice's theorem applies to Turing machines deciding properties of all programs. An LLM is a fixed-weight transformer that produces outputs for finite-length inputs; it is not a Turing machine, and its failure to decide a property for some input does not contradict Rice's theorem. The correct argument is probabilistic: the space of programs is unbounded, the LLM's training distribution is finite, and out-of-distribution inputs will cause errors. The proof should be corrected.

2. **MINOR**: The paper does not adequately address the temporal dynamics of defect detection. As LLMs improve, some Semi-decidable types may become Decidable (better reasoning about intent) or the detection probabilities may shift. The decidability classification should be stated as contingent on current capabilities, not as permanent.

### Missing Related Work

1. **MINOR**: The paper does not cite the formal verification literature on abstract interpretation (Cousot & Cousot), which is the standard framework for sound over-approximation of semantic properties. This is directly relevant to the Quasi-Semantic class.

2. **MINOR**: The software clone detection literature (Roy & Cordy's taxonomy of clone types I-IV) should be cited when discussing duplicate logic detection, as different clone types have very different detection decidability.

3. **MINOR**: The paper mentions "reflexion models" for architectural erosion but does not cite Murphy, Notkin, and Sullivan's original reflexion model paper (1995, 2001), which is the canonical reference.

### Writing Quality

**Rating: GOOD**. Clear structure, appropriate formalism level, good use of examples. The paper avoids em dashes as specified. Some overfull hbox warnings in the compiled PDF should be fixed for final version.

---

## Issue Summary

| # | Issue | Severity | Section |
|---|-------|----------|---------|
| 1 | Sensitivity analysis needed for low-confidence detection estimates | MAJOR | 7 |
| 2 | Rice's theorem argument in Enforcement Gap proof is technically incorrect | MAJOR | 8 |
| 3 | Compound Degradation superlinearity assumption unjustified | MINOR | 9 |
| 4 | Gaussian copula is a modeling choice, not derived | MINOR | 10 |
| 5 | Codebase entropy definition needs modification distribution | MINOR | 9 |
| 6 | Three-factor orthogonality is hypothesis, not proposition | MINOR | 3 |
| 7 | Absolute AI code percentage claim dependency unclear | MINOR | 1 |
| 8 | Cost estimates should be parameterized | MINOR | 7 |
| 9 | Missing related work: abstract interpretation, clone types, reflexion models | MINOR | 13 |
| 10 | Temporal dynamics of decidability classification not addressed | MINOR | 15 |
| 11 | Novel vs established contribution boundary could be sharper | MINOR | 1 |

## Recommendation

**Accept with revisions.** Fix the two MAJOR issues (sensitivity analysis, Rice's theorem proof), address the MINOR issues where feasible, and the paper makes a solid contribution. The formal framework is sound, the empirical calibration is honest about its limitations, and the practical prescriptions are well-motivated.
