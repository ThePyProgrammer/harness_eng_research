# Peer Review: Human Interaction Architecture for AI Coding Agent Harnesses

**Reviewer:** Simulated Peer Review Panel
**Date:** 2026-04-03

---

## Overall Assessment

The paper presents a well-structured formal framework for human interaction in AI coding harnesses, drawing on automation supervision, signal detection theory, Bayesian decision theory, and multi-armed bandits. The synthesis of previously disjoint literatures (sampling inspection from manufacturing, vigilance research from aviation/radiology, bandit theory from ML) into a unified framework for software engineering is a genuine contribution. The paper is well-written, honest about its limitations, and properly frames itself as theory/position rather than empirical.

**Recommendation:** Accept with minor revisions.

---

## Novelty and Significance

**Rating:** STRONG

The core novelty lies in three areas:
1. **The automation supervision paradox theorem (Theorem 6.1):** Formalizing Bainbridge's qualitative ironies as a quantitative result with a concrete critical threshold is valuable. The proof is clean and the calibration from the vigilance literature is reasonable.
2. **The human interaction budget (Theorem 7.1):** Decomposing attention into review/calibration/vigilance with a provable unique optimum is the paper's most practically useful contribution.
3. **The connection between sampling inspection and software review:** Mapping Dodge-Romig/MIL-STD-105E to AI coding harness review is novel and actionable.

The application of Thompson sampling to trust calibration is competent but less novel (bandits are standard in similar settings). The Bayesian threshold result (Theorem 4.1) is standard decision theory applied to a new domain.

**Issue: MINOR** - The paper could more explicitly separate "novel synthesis" from "standard results applied." The epistemic markers ([E], [S], [C]) from the formal outputs did not make it into the paper.

---

## Formal Rigor

**Rating:** GOOD

- Theorem 3.1 (optimal triage): Correct, straightforward reduction to 0-1 knapsack.
- Theorem 3.2 (stratification): The proof sketch is adequate but the exact bound should be tightened. The claim "improvement factor approximately 1 + CV(w)^2" needs a more precise statement of conditions.
- Theorem 4.1 (threshold): Standard Bayes decision, correctly stated and proved.
- Theorem 5.1 (regret bound): Correctly cited from Agrawal-Goyal.
- Proposition 5.1 (concentration): Correct, standard posterior concentration argument.
- Theorem 6.1 (paradox): Correct and well-proved. The critical automation reliability derivation is sound.
- Theorem 7.1 (budget): Existence/uniqueness argument is correct given the stated concavity/convexity assumptions. The functional forms for Phi and g are assumed, not derived.

**Issue: MAJOR** - The paper lacks a signal detection theory section. The research and formalization rounds contain substantial SDT content (d-prime models for code review, ROC analysis, prevalence effect), but none appears in the paper body. This is a significant omission given that the entire vigilance decay argument rests on SDT foundations.

**Issue: MINOR** - The proof of Theorem 6.1 in the paper is a sketch; the full proof from the formalization output (showing g(0) = 0, g'(0) < 0, g(1) > 0, IVT) should be included in the appendix.

---

## Empirical Grounding

**Rating:** GOOD

The paper is well-grounded in empirical data: DORA 2025 statistics, Sonar 2026 verification gap, METR merge rates, Cisco/SmartBear code review data, Mackworth vigilance data, and See et al. meta-analysis. The calibration table (Table 2) is useful and honest about confidence levels.

**Issue: MINOR** - The Sonar 2026 report actually says "only 26% always verify" (not 48%); the paper cites 48% which seems to be the complementary percentage. This should be verified and corrected.

**Issue: MINOR** - The METR "19% slowdown for experienced developers" finding is mentioned in the contrarian section but not in the empirical calibration. It is an important empirical anchor for the expertise moderation discussion.

---

## Logical Gaps

**Issue: MAJOR** - The paper does not include a section on the Parasuraman-Sheridan-Wickens automation levels taxonomy, which is extensively covered in the research and directly relevant (mapping code review tasks to automation levels). This is the standard framework for reasoning about automation in human factors; omitting it weakens the related work positioning.

**Issue: MINOR** - The connection between the three formal pillars (triage, trust, vigilance) through the budget is asserted but the mathematical details of how they interact (e.g., how trust calibration error affects triage efficiency) are only sketched. The formalization output (F3) has a more complete treatment.

---

## Missing Related Work

**Issue: MINOR** - Rasmussen's SRK framework (skills-rules-knowledge) is covered in R1 but absent from the paper. It provides a useful taxonomy for predicting which types of code review tasks will degrade most under automation.

**Issue: MINOR** - Hollnagel's Safety-II perspective (human as resilience resource, not error source) deserves mention as it provides a counterpoint to the predominantly Safety-I framing (human as defect detector) in the formal framework.

---

## Style and Presentation

**Issue: MINOR** - No em dashes detected. Good.
**Issue: MINOR** - The paper is well-structured but could benefit from a notation summary table early in the paper (after Section 2).
**Issue: MINOR** - Some theorem numbering seems inconsistent between sections (Theorem 3.1, 3.2, 4.1, 5.1, etc.) but this is LaTeX auto-numbering so should be fine in the compiled output.

---

## Summary of Issues

| # | Severity | Issue |
|---|----------|-------|
| 1 | MAJOR | Missing SDT section (d-prime, ROC, prevalence effect) despite research containing extensive content |
| 2 | MAJOR | Missing Parasuraman-Sheridan-Wickens automation levels discussion |
| 3 | MINOR | Should include epistemic status markers on theorems (novel vs. applied vs. cited) |
| 4 | MINOR | Stratification bound (Thm 3.2) conditions need tightening |
| 5 | MINOR | Verify 48% Sonar statistic |
| 6 | MINOR | Include METR 19% slowdown in empirical section |
| 7 | MINOR | Add Rasmussen SRK and Hollnagel Safety-II to related work |
| 8 | MINOR | Full proof of Theorem 6.1 should be in appendix |
| 9 | MINOR | Add notation summary table |
