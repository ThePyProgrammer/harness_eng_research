# Peer Review: Security Architecture for AI Coding Agent Harnesses

**Reviewer:** Simulated Panel
**Date:** 2026-04-04

---

## Overall Assessment

The paper presents a well-structured formal framework for security architecture in AI coding agent harnesses. It successfully connects established security theory (access control, information flow, capability-based security) to the novel domain of AI agent orchestration. The empirical calibration against multiple independent studies strengthens the position considerably. The central architectural claim (agent outside TCB) is the paper's strongest contribution.

**Recommendation:** Accept with minor revisions.

---

## Detailed Evaluation

### Novelty and Significance

**MINOR:** The formal results are explicitly acknowledged as applications of established theory rather than novel mathematics. This honesty is commendable, but the paper could more explicitly articulate what is novel about the synthesis. The connection between the confused deputy problem and prompt injection, while intuitive, has been noted by others (NCSC 2023, Willison 2024). The paper's original contribution is the unified framework connecting all six formalisms, not any individual connection.

**MINOR:** The BEB impossibility framework is powerful but the paper relies heavily on it without discussing its limitations (assumes the model has non-zero probability on undesired behavior, which is true by construction for any model trained on internet data, but may not hold for future architectures that structurally separate instruction from data processing).

### Formal Rigor

**MINOR:** Theorem 3.1 (Attack Surface Bound) is essentially a tautology. Consider removing it or strengthening it with a non-trivial lower bound on attack surface given uncertainty about T.

**MINOR:** The proof of Theorem 4.1 (Credential Noninterference) assumes the tool's output "does not contain the raw credential." This assumption should be stated more carefully; some tools may leak credential-derived information (e.g., error messages that reveal which credential was used). The proof is correct given the assumption, but the assumption itself deserves scrutiny.

**MINOR:** The defense-in-depth section (Section 7) uses the beta factor model effectively but the estimate of beta = 0.5 is acknowledged as approximate. The paper should state more clearly that this is an order-of-magnitude estimate and that the qualitative conclusion (structural layers dominate) is robust to the specific beta value.

### Empirical Grounding

**MINOR:** The paper draws from five independent measurement studies, which is good diversity. However, the studies vary significantly in methodology, scale, and rigor. CodeRabbit's 470-PR study is relatively small and has acknowledged selection bias. The METR reward-hacking rates vary dramatically by benchmark (0.7% HCAST vs. 30.4% RE-Bench), suggesting task characteristics dominate model characteristics. This variance should be discussed more.

**MINOR:** The production harness survey (Table 4) is valuable but missing some harnesses that have emerged since the pillar was drafted (e.g., Windsurf, Augment). Consider noting the survey date and acknowledging the field is evolving rapidly.

### Logical Gaps

**MINOR:** The paper claims "every production harness that achieves reliable security does so structurally" but does not define "achieves reliable security" operationally. How would one measure whether a harness achieves reliable security? Without an operational definition, this claim is unfalsifiable.

**MINOR:** The paper does not address the tension between TCB minimality and TCB completeness. A minimal TCB may miss enforcement points; a complete TCB may be too large to verify. The seL4 example (10,000 LOC formally verified) is encouraging but agent harness TCBs may be significantly larger due to the diversity of enforcement mechanisms required.

### Missing Related Work

**MINOR:** No discussion of Google DeepMind's AutoHarness (March 2026), which demonstrated 100% compliance for structural enforcement on 145 TextArena games, providing additional empirical support for the central claim.

**MINOR:** The slopsquatting / supply chain attack vector is mentioned in the appendix but deserves more prominence in the main text, as it represents a qualitatively different threat from prompt injection.

### Style and Presentation

**MINOR:** No em dashes detected (good). Citation style is consistent. Mathematical notation is clear. Tables are well-formatted.

**MINOR:** The paper is somewhat long for a position paper. Consider whether the defense-in-depth section (Section 7) could be shortened, as its main point (correlated failures undermine naive multiplication of defense effectiveness) could be made more concisely.

---

## Issue Summary

| # | Severity | Section | Issue |
|---|----------|---------|-------|
| 1 | MINOR | 3.1 | Attack Surface Bound theorem is tautological |
| 2 | MINOR | 4.1 | Tool output assumption needs more careful statement |
| 3 | MINOR | 7 | Beta = 0.5 should be flagged as order-of-magnitude estimate |
| 4 | MINOR | 8 | METR variance by benchmark type deserves discussion |
| 5 | MINOR | 9 | "Achieves reliable security" needs operational definition |
| 6 | MINOR | 9 | TCB minimality vs. completeness tension unaddressed |
| 7 | MINOR | 10 | AutoHarness missing from related work |
| 8 | MINOR | App | Supply chain attacks deserve main-text treatment |
| 9 | MINOR | Overall | BEB limitations not discussed |
| 10 | MINOR | Overall | Novel contribution could be stated more explicitly |

---

## Rating

- **Novelty:** 6/10 (application of established theory; synthesis is the contribution)
- **Formal Rigor:** 8/10 (sound proofs; appropriate epistemic caveats)
- **Empirical Grounding:** 8/10 (five independent studies; sparse but diverse)
- **Logical Completeness:** 7/10 (minor gaps noted above)
- **Presentation:** 9/10 (clear, well-structured, no em dashes)
- **Overall:** 7.5/10

No FATAL or MAJOR issues identified. All issues are MINOR and addressable through targeted revisions.
