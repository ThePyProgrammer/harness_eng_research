# Peer Review: Governance Architecture for AI Coding Harnesses

**Paper:** Governance Architecture for AI Coding Harnesses: Drift, Decay, and the Limits of Externalization
**Date:** 2026-04-03

---

## Overall Assessment

A strong theory/position paper that applies established mathematical frameworks (information theory, control theory, survival analysis, lattice theory) to the governance problem in AI coding harnesses. The central governance capacity bound is the paper's most compelling result. The honest engagement with contrarian positions and the explicit acknowledgment of empirical gaps elevate the paper above typical position papers in this space.

**Recommendation:** Accept with major revisions.

---

## Novelty and Significance

**MINOR.** The mathematical machinery is established; the novelty is in application. The paper acknowledges this explicitly ("the formal results are novel in their *application* to governance architecture"). This is honest framing. The governance capacity bound (Theorem 4.3) and the bifurcation analysis (Theorem 5.3) are the most significant contributions, providing actionable design guidance.

**MINOR.** The paper would benefit from more clearly distinguishing which results are straightforward restatements of known theorems vs. genuinely novel synthesis. The "epistemic status" markers from the formalization research (established/synthesis/conjectured) were partially carried through but could be more systematic.

---

## Formal Rigor

**MAJOR.** The governance channel capacity analogy (Section 4) needs more careful treatment. Shannon's channel coding theorem applies to discrete memoryless channels with well-defined input/output alphabets and transition probabilities. The "governance channel" has none of these properties rigorously defined. The paper acknowledges this in the conclusion ("the 'channel' and 'capacity' of governance are not directly measurable") but the theorems in Section 4 are stated as if they are rigorous results rather than suggestive analogies. Either:
  - (a) Downgrade Theorem 4.3 to a "Principle" or "Heuristic" with a clear statement that it is an analogy, not a proof, or
  - (b) Define the channel formally enough that the theorem statement is rigorous (specifying $X$, $Y$, and $p(Y|X)$ concretely for at least one governance scenario).

**MAJOR.** Conjecture 3.3 (Tacit Divergence) is the paper's most philosophically important claim but its formal status is unclear. The statement $R_{\text{tacit}}(D) = \Omega(\log(1/D))$ as $D \to 0$ requires specifying the source distribution and distortion measure for tacit knowledge. Without these, the conjecture is not falsifiable. The paper should either:
  - (a) Provide a concrete example (e.g., a model of design rationale as a source with specific distributional assumptions) where the divergence can be computed, or
  - (b) More clearly frame this as a philosophical claim motivated by rate-distortion theory rather than a mathematical conjecture.

**MINOR.** The proof of Theorem 5.1 (Cascade Governance Stability) claims that "the combined characteristic polynomial factors approximately into three independent polynomials." The word "approximately" does a lot of work here. The conditions under which this approximation holds (and the error bounds) should be stated more precisely, or the theorem should be weakened to "the system is approximately stable" with defined error terms.

**MINOR.** The dynamics equation (10) in Section 5.4 uses $(1-C)^\beta$ for the governance term but $(1-C)$ for the drift term. The asymmetry should be motivated more carefully. Why does governance have diminishing returns but drift does not?

---

## Empirical Grounding

**MAJOR.** The decision survival calibration table (Section 7.3) presents Weibull parameters with specific numerical values ($\alpha = 2.1$, $\lambda = 3.5$ for frontend frameworks, etc.) but the paper admits these are "derived from practitioner experience and ecosystem analysis rather than controlled longitudinal studies." Presenting specific numerical parameters without empirical calibration data risks creating false precision. The paper should either:
  - (a) Present these as ranges rather than point values (e.g., $\alpha \in [1.5, 2.5]$), or
  - (b) Remove the specific numbers and present the qualitative ordering only (frontend < API < database < security), or
  - (c) Add a more prominent disclaimer that these are illustrative examples, not calibrated parameters.

**MINOR.** The GitClear data is cited as showing "8x increase in code duplication" but the actual data shows copy-paste rates rising from 8.3% to 12.3% (a ~50% increase in rate). The "8x" figure applies specifically to 5+ line duplicated blocks. This distinction matters for calibrating the formal models. Clarify which metric is being used.

---

## Logical Gaps

**MINOR.** The paper moves between "drift as KL divergence" (Definition 2.2) and "drift as violation count" (in the control theory sections) without formally connecting the two. Are violation counts a sufficient statistic for KL divergence? Under what conditions?

**MINOR.** The connection between the ratchet (Section 6) and the survival analysis (Section 7) is stated informally ("a decision's evidence expiry window should be proportional to its domain-specific median lifetime") but not formalized. How does the relaxation operator $\delta$ consume the survival function $S(t)$? A concrete definition would strengthen the integration.

---

## Missing Related Work

**MINOR.** The paper does not engage with the spec-driven development literature (Griffin & Carroll, InfoQ 2026; Sathyanarayana et al., arXiv 2026), which directly addresses how specifications can serve as governance mechanisms. This is relevant to the "governance channel capacity" discussion: specs-as-source potentially increases $C_{\text{gov}}$ by making governance constraints machine-readable.

**MINOR.** The statistical process control literature (Shewhart charts, EWMA) is absent from the paper despite being directly relevant to drift detection. The research outputs covered this; the paper should at least mention SPC as an operationalization of the CUSUM/BOCPD framework.

**MINOR.** No mention of the World Economic Forum's 2026 findings on the AI agent governance gap (81% operational, only 14.4% with security approval). This would strengthen the empirical motivation.

---

## Writing Quality

**MINOR.** Section 11 (Contrarian Positions) is excellent but could be more tightly integrated with the formal framework. Each contrarian position should explicitly reference which theorem or definition it challenges, creating a clearer dialogue between the formal results and their critics.

**MINOR.** The abstract is long (250+ words). Consider tightening to 200 words.

**MINOR.** A few em dashes appear in the rendered PDF (e.g., in the bibliography formatting). The text itself avoids them, but check the bib entries.

---

## Summary of Issues

| Issue | Severity | Section |
|-------|----------|---------|
| Governance channel not rigorously defined | MAJOR | 4 |
| Tacit Divergence conjecture not falsifiable | MAJOR | 3.1 |
| Survival calibration presents false precision | MAJOR | 7.3 |
| Cascade stability "approximately" undefined | MINOR | 5.2 |
| Asymmetric dynamics equation unmotivated | MINOR | 5.4 |
| KL divergence vs. violation count disconnect | MINOR | 2.3, 5 |
| Ratchet-survival connection informal | MINOR | 6.3, 7 |
| Missing SDD related work | MINOR | 9 |
| Missing SPC discussion | MINOR | 5, 9 |
| Missing WEF governance gap data | MINOR | 1 |
| 8x vs. 50% duplication metric confusion | MINOR | 1 |
| Abstract too long | MINOR | Abstract |
| Contrarian section loosely connected to formalism | MINOR | 11 |
| Epistemic status markers inconsistent | MINOR | Throughout |

---

## Verdict

3 MAJOR issues, 11 MINOR issues. The MAJOR issues are all addressable without restructuring the paper. The governance channel analogy needs honest framing (is it a theorem or a principle?), the tacit divergence conjecture needs either a concrete model or philosophical reframing, and the survival parameters need ranges instead of point values. The paper's intellectual honesty about empirical gaps is its greatest strength; extending that honesty to the formal claims would make it substantially stronger.
