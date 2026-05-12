# Peer Review: Reliability Architecture for Multi-Step AI Agent Pipelines

**Paper:** "Reliability Architecture for Multi-Step AI Agent Pipelines: Compound Errors, Verification Scheduling, and the Structural Enforcement Boundary"

**Reviewer:** Simulated (April 2026)

---

## Overall Assessment

The paper develops a formal framework for reasoning about verification in multi-step AI agent pipelines, combining classical reliability theory with contemporary empirical data. The synthesis is valuable and the formal results are mostly sound. The paper's strength is bridging the gap between well-established reliability theory and the emerging AI agent deployment landscape. Its primary weakness is that it is fundamentally a synthesis/position paper that presents no new experiments, and several of its "theorems" are straightforward applications of existing results rather than novel contributions.

**Recommendation:** Accept with minor revisions.

---

## Detailed Evaluation

### Novelty and Significance

**MINOR:** The core formal results (series reliability product law, geometric diminishing returns, cascaded detection) are well-known in reliability engineering. The contribution is in the application to AI agent pipelines and the calibration against contemporary benchmarks. The paper should be more explicit about which results are established (Theorems 3.1, 4.1) and which represent novel synthesis (the common-cause decomposition applied to agent pipelines, the enforcement transition threshold, the blind-spot model for circular validation bias).

**MINOR:** The compound error sensitivity theorem (Theorem 3.2) is just the derivative of $p^n$. While the reframing as "elasticity equals pipeline length" is pedagogically useful, calling it a theorem overstates its novelty.

### Formal Rigor

**MAJOR:** Theorem 4.3 (Equal-Spacing Optimality) proof sketch claims convexity of $g(L) = (1-p^L) \cdot c_0 \cdot L$ via $g''(L) = c_0 p^L (\ln p)^2 L > 0$. This second derivative is incomplete. The full computation of $g''(L)$ involves multiple terms from the product rule. The paper should either provide the complete derivation or acknowledge it is omitted and cite a reference. The result itself is correct (the function is indeed convex for $0 < p < 1$, $L > 0$), but the proof as stated is not rigorous.

**MINOR:** The Markov error propagation model in the appendix has a confusing passage where $q = 0$ gives $R = (p-1)^n$ which "alternates in sign." The paper acknowledges this is not meaningful but the discussion could be cleaner. Simply state that when $q = 0$ the error state is absorbing and the product law holds.

**MINOR:** The circular validation bias theorem (Theorem 5.1) assumes independent blind spots between agents A and A'. In practice, agents from the same model family share substantial blind-spot overlap. The theorem should state this independence assumption more prominently and discuss when it might fail.

### Empirical Grounding

**MAJOR:** The calibration in Table 1 (Section 3.4) back-solves for per-step reliability from end-to-end observations. This is circular: the model predicts $R = p^n$; the calibration assumes $R = p^n$ and solves for $p$. This does not validate the model; it merely demonstrates internal consistency. The paper needs either (a) independent measurements of both $p$ and $R$ to validate the model, or (b) an explicit acknowledgment that the calibration demonstrates consistency, not validation.

**MINOR:** The verification convergence data comes entirely from Hariharan et al. (2025) on household task planning (TEACh dataset). The generalization to software engineering pipelines is assumed throughout but never verified. This should be flagged as a limitation.

**MINOR:** The "$47,000 infinite loop incident" is cited from a blog post without independent verification. While illustrative, it should be flagged as anecdotal.

### Logical Gaps and Unsupported Claims

**MAJOR:** Section 6.3 (Multi-Agent Verification Economics) states that the break-even consequence for two-agent separation is "roughly 3.2x the generation cost." This relies on specific parameter choices ($d_{\text{self}} = 0.35$, $d_{\text{cross}} = 0.62$, cost ratios). These parameters are drawn from different studies (self-verification from arXiv:2512.02304; cross-verification from Hariharan et al.) under different conditions. The paper should discuss the sensitivity of this result to the parameter choices and acknowledge the cross-study calibration issue.

**MINOR:** The claim that "every documented NIST CAISI cheating instance is detectable through invariant violation checks" (Section 5.4) is stated as if this is a general result, but it may be an artifact of the specific cheating techniques observed so far. Future gaming techniques may not all reduce to invariant violations.

### Missing Related Work

**MINOR:** The paper does not cite the debate-based verification literature (Irving et al., 2018; Khan et al., 2024) beyond a passing mention. Given that debate is a prominent approach to scalable oversight, it deserves more discussion.

**MINOR:** Constitutional AI (Bai et al., 2022) as a self-verification approach is not discussed, though it is relevant to the circular validation bias section.

**MINOR:** The software testing literature on the "pesticide paradox" is referenced informally but not cited. The seven principles of software testing (ISTQB) are directly relevant.

### Writing Quality

**MINOR:** The abstract is long (250+ words). Consider tightening.

**MINOR:** Section 5 title ("The Structural Enforcement Boundary") would be clearer as "Structural vs. Prompt Enforcement."

---

## Issue Summary

| # | Issue | Severity | Section |
|---|-------|----------|---------|
| 1 | Proof sketch of equal-spacing convexity is incomplete | MAJOR | 4.2 |
| 2 | Calibration table is circular (consistency, not validation) | MAJOR | 3.4 |
| 3 | Break-even analysis uses cross-study parameters without discussing sensitivity | MAJOR | 6.3 |
| 4 | Distinguish established vs. novel results more clearly | MINOR | Throughout |
| 5 | Sensitivity theorem framed as novel but is $d/dp(p^n)$ | MINOR | 3.2 |
| 6 | Circular bias independence assumption needs prominence | MINOR | 5.1 |
| 7 | Verification convergence data from single domain | MINOR | 4.3 |
| 8 | NIST cheating detectability claim may not generalize | MINOR | 5.4 |
| 9 | Missing related work: debate, Constitutional AI, ISTQB | MINOR | 7 |
| 10 | Markov model discussion when $q=0$ is confusing | MINOR | Appendix |
| 11 | Abstract too long | MINOR | Abstract |
| 12 | $47K incident is anecdotal | MINOR | 6.3 |
