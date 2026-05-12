# Review: Uncomputability Skeptic Perspective

**Reviewer stance:** Information theorist / theoretical CS researcher skeptical of Kolmogorov complexity as a foundation for practical software engineering frameworks.

**Central question:** If every practical application requires a computable proxy, and the proxy's relationship to K is loose, does the uncomputable foundation add anything over just working with the proxies directly?

---

## 1. Is Kolmogorov Complexity the Right Foundation? (MAJOR)

The paper defines G(S, P) = K(P | S) and builds everything on conditional Kolmogorov complexity. But the paper itself already introduces a Shannon channel model (Section 3.4) with transition probabilities p(P | S) and channel capacity C = max I(S; P). This Shannon model is fully computable, directly measurable, and arguably more natural for reasoning about LLM-mediated translation (which is inherently probabilistic, not worst-case algorithmic).

The core insight, that "a sufficiently detailed spec is code," can be stated in Shannon-theoretic terms: if the conditional entropy H(P | S) approaches zero, S determines P (up to negligible residual uncertainty). The convergence theorem (Theorem 3.3) has a direct Shannon analogue via rate-distortion theory. The refinement lattice and Galois connection machinery are orthogonal to K and work with any information measure.

The authors gain exactly one thing from K that Shannon does not provide: the universality of NID (Theorem 3.2). But they never use this universality operationally. It remains a theoretical nicety with no downstream consequence for the design principles.

## 2. Would the Theorems Hold Under Computable Restatement? (MAJOR)

Every theorem in this paper would survive restatement in computable terms, and most would become stronger:

- **Theorem 3.1 (Gap Properties):** Monotonicity and additivity hold for Shannon conditional entropy H(P | S) with exact equality (no O(log n) fudge factors). The chain rule for Shannon entropy is exact; for Kolmogorov complexity it holds only up to O(log n).
- **Theorem 3.3 (Convergence):** Restatable as: for a uniformly random program, H(P | S) = 0 implies H(S) >= H(P). Cleaner, tighter, computable.
- **Theorem 4.1 (Refinement Lattice):** Purely order-theoretic; has nothing to do with K.
- **Remark 4.1 (Agent Decomposition):** The chain rule decomposition works identically with Shannon mutual information.

The O(log n) terms that appear throughout the K-based proofs would vanish under Shannon restatement, producing sharper results. This is the opposite of the usual tradeoff; the "more general" foundation is strictly weaker here.

## 3. The Gap Between Idealised K and Proposed Proxies (MAJOR)

The paper proposes two proxy families:
- **Function point backfiring ratios** (Table A2) for the compression axis kappa.
- **NCD with gzip** (implied by the NID definition in Section 3.2) for abstraction distance.

Neither proxy has a known, tight relationship to K:
- Function points measure language verbosity, not algorithmic information content. The LOC/FP ratio for Python vs. C tells you about syntactic sugar, not about how much of a program's algorithmic content a specification captures.
- NCD approximates NID only to the extent that the compressor approximates K. Gzip is an LZ77 variant; it captures repetition structure but misses algorithmic regularity entirely. The gap between gzip-compressed length and K(x) can be arbitrarily large.

The paper acknowledges this looseness ("ordinal estimates," "computable proxies") but never quantifies the gap or argues it is small enough to matter. This is not a minor calibration issue; it is the central epistemic question of the entire framework.

## 4. Unfalsifiability Concern (MAJOR)

G(S, P) = K(P | S) is uncomputable. The specificity sigma requires counting programs satisfying a spec, which is undecidable by Rice's theorem. The paper's fix (bounding by N to get a finite set Prog_N) does not actually resolve this: even for finite N, determining whether a program of length <= N satisfies a given specification S is undecidable in general. You cannot enumerate the satisfying set; you cannot compute sigma even for finite N.

This means: (1) you can never measure the actual abstraction gap, only approximate it; (2) you can never falsify a claim that one design reduces G more than another; (3) the framework's predictions are unfalsifiable in principle. The paper's design principles (Section 7) could be derived from simpler, testable premises.

**Severity: MAJOR.** The framework claims to provide "mathematical, not merely philosophical, answers" (final sentence of conclusion), but its central quantity cannot be computed, measured, or falsified.

## 5. Specificity Under the Finite Bound (MAJOR)

The paper defines sigma(S) = 1 - log |[[S]]_N| / log |Prog_N| for programs of length at most N. Even granting finiteness, computing |[[S]]_N| requires deciding, for each of the (up to 2^{N+1}) programs of length <= N, whether it satisfies S. By Rice's theorem, this is undecidable for any nontrivial semantic property. Bounded model checking can approximate this for specific S, but the general definition remains a fiction. The thinker placements in Table 1 are explicitly "ordinal estimates," not computed values, confirming that the metric is never actually used as defined.

**Severity: MAJOR.** The metric that organizes the paper's most visible contribution (the thinker placement) is uncomputable even after the finiteness fix.

## 6. Would a Simpler Framework Suffice? (MINOR)

Consider an alternative framework:
- **Abstraction gap:** Normalized compression distance (NCD) between spec and code, computed with a practical compressor (gzip, zstd, or a learned compressor).
- **Specificity:** Type-system expressiveness score (e.g., number of type-checkable properties) or test coverage as a proxy.
- **Compression:** Token ratio (spec tokens / code tokens).

This framework is fully computable, directly measurable, and would yield the same six design principles. The principles ("operate at the specification level," "support multiple formalism levels," "use AI as formalism translator") follow from software engineering common sense and the empirical data the paper cites, not from K-theoretic proofs. The theorems dress up these insights in formalism that adds intellectual prestige but no predictive or explanatory power beyond what the computable proxies already provide.

---

## Rating

**Foundational choice: DEFENSIBLE.**

The Kolmogorov complexity foundation is not *necessary*: every theorem either survives computable restatement or is never operationalized. A Shannon-theoretic or direct empirical framework would yield the same design principles with tighter bounds and falsifiable predictions. However, the K-based framework is *defensible* in that it provides a universal upper bound (the NID universality theorem) and connects to a well-developed mathematical tradition. The paper would be stronger if it were honest that K serves as a conceptual scaffolding rather than a computational tool, and if it foregrounded the Shannon channel model (which it already has in Section 3.4) as the operational foundation.

The most damaging issue is the unfalsifiability problem: a framework whose central quantity cannot be measured, even in principle, risks being a "theory of everything that predicts nothing." The authors should either provide concrete, computable instantiations with quantified approximation bounds, or reframe the contribution as purely conceptual rather than claiming "mathematical answers."
