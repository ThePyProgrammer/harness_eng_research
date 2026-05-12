# Peer Review: "Towards a Science for AI Coding Agent Harnesses"

**Reviewer:** Simulated AI Research Peer Review (Feynman Protocol)
**Date:** 2026-04-02
**Artifact:** `main.tex` (with `main.bib`, 50 references)
**Verdict:** MAJOR REVISION REQUIRED

---

## Summary

The paper proposes a formal mathematical framework for reasoning about the "abstraction gap" between human-language specifications and executable code, applied to the design of AI coding agent harnesses. The central formalization defines the gap as conditional Kolmogorov complexity $\mathcal{G}(S, P) = K(P \mid S)$, proves properties (monotonicity, additivity, convergence), and extends to multi-agent systems via the taxonomy of Kim et al. (2025). A two-dimensional specificity-compression metric places 16 thinkers on the spectrum. Six design principles are derived.

The paper is ambitious in scope and well-structured. The synthesis of information theory, type theory, refinement calculus, cognitive science, and contemporary AI tools into a unified framework is genuinely valuable. However, several issues must be addressed before the paper can be considered rigorous.

---

## Issue 1: The Abstraction Gap Is Known, Not Novel

**Severity: MAJOR**

The definition $\mathcal{G}(S, P) = K(P \mid S)$ is presented as if it were a new contribution, but conditional Kolmogorov complexity has been used to measure information gaps since Kolmogorov (1965) and is standard in algorithmic information theory (Li and Vitanyi, *An Introduction to Kolmogorov Complexity and Its Applications*, 4th ed. 2019). The properties in Theorem 3.1 (minimality, maximality, monotonicity, additivity) are all direct consequences of well-known results (chain rule, symmetry of information).

**What IS novel** is the *application* of these tools to the spec-code relationship and the connection to agent harness design. The paper should be honest about this: the information-theoretic machinery is established; the contribution is the application and the synthesis.

**Revision:** Reframe Section 3 to say explicitly: "We do not claim novelty for the information-theoretic results themselves, which are standard (Li and Vitanyi, 2019). Our contribution is their application to the specification-code relationship in the context of AI coding agents." Add the Li-Vitanyi textbook to the bibliography.

---

## Issue 2: Theorem 3.1(c) Monotonicity Proof Has a Gap

**Severity: MAJOR**

The monotonicity property states: if $S' $ refines $S$ ($S \sqsubseteq S'$), then $\mathcal{G}(S', P) \leq \mathcal{G}(S, P) + O(1)$.

The proof in Appendix A claims "from $S'$ we can compute $S$ using $O(1)$ bits." This is only true if the refinement relation itself is computable with bounded overhead. But the refinement ordering $\sqsubseteq$ is defined over predicate transformers, which are infinite objects. The claim that $K(S \mid S') = O(1)$ requires that $S$ is *uniquely determined* by $S'$ plus a constant-size program, which is not guaranteed by the refinement relation alone. $S \sqsubseteq S'$ means every implementation of $S'$ also implements $S$, but this does not mean $S$ can be reconstructed from $S'$ in constant space.

**Concretely:** Consider $S =$ "outputs a sorted list" and $S' =$ "outputs a sorted list using mergesort." $S' \sqsubseteq S$ (every mergesort output is a sorted list). But $K(S \mid S') \neq O(1)$ in general because knowing "use mergesort" does not tell you the *exact* specification $S$ came from (there are many specifications that mergesort refines).

**Revision:** Either (a) strengthen the hypothesis to require that $S$ is *the unique weakening* of $S'$ in some canonical sense, (b) weaken the claim to $\mathcal{G}(S', P) \leq \mathcal{G}(S, P) + O(\log n)$ which follows from the chain rule without the $K(S \mid S') = O(1)$ assumption, or (c) add a condition that the refinement chain is *constructive* (there exists a computable function from $S'$ to $S$).

---

## Issue 3: The Effective Multi-Agent Gap Formula Is Ad Hoc

**Severity: MAJOR**

Definition 5.2 defines:
$$\mathcal{G}_{\text{eff}}(\mathcal{S}_{\text{MAS}}) = \mathcal{G}(S, P) + \lambda \cdot O \cdot A_e - \mu \cdot (1 - R)$$

This is a linear combination of empirical metrics with unspecified constants $\lambda, \mu > 0$ that are described as "topology-dependent." This formula has no theoretical derivation. It is not derived from the information-theoretic framework in Section 3. It is an ad hoc empirical model dressed in the notation of the formal framework.

The paper mixes two different kinds of claims: (1) rigorous information-theoretic results (Sections 3-4), and (2) empirical observations from Kim et al. repackaged with Greek letters (Section 5). The reader expects the same level of rigor throughout.

**Revision:** Either (a) derive the formula from the Kolmogorov complexity framework (e.g., show that coordination overhead adds $O \cdot A_e$ bits of conditional complexity), (b) present it explicitly as an *empirical model* rather than a formal definition, or (c) replace it with a qualitative analysis of how topology affects the gap without pretending to have a formula. Option (b) is the most honest.

---

## Issue 4: The Specificity Metric $\sigma(S)$ Is Uncomputable

**Severity: MAJOR**

Definition 6.1 defines specificity as $\sigma(S) = 1 - \frac{\log |\llbracket S \rrbracket|}{\log |\text{Prog}|}$. This requires counting $|\llbracket S \rrbracket|$, the number of programs satisfying specification $S$. By Rice's theorem (which the paper itself cites), this quantity is not computable for nontrivial specifications. The denominator $|\text{Prog}|$ (the total number of programs) is either infinite or requires fixing a finite program space, which is not specified.

Similarly, $\kappa(S) = 1 - |S|/K(P)$ requires knowing $K(P)$, which is uncomputable.

The paper uses these metrics to assign concrete numerical values to thinkers ($\sigma = 0.78$ for Lamport, etc.), but these numbers cannot be computed even in principle. They are informal judgments presented in formal notation.

**Revision:** Acknowledge uncomputability explicitly. Reframe $\sigma$ and $\kappa$ as *idealized* measures that can be approximated in practice via computable proxies (function point ratios for $\kappa$, model-checking coverage for $\sigma$). The thinker placement table should state that values are informal estimates, not computed quantities. Consider changing the table header from "$\sigma$" to "$\hat{\sigma}$ (est.)" to signal this.

---

## Issue 5: Theorem 3.3 Proof Step 3 Has Circular Reasoning

**Severity: MINOR**

The proof of the Convergence Theorem (Appendix A.2, Step 3) states: "where the last step uses $|S| \leq |P| + O(\log |P|)$ (which we are proving) to bound $\log |S|$." This is explicitly circular. The proof uses the conclusion to establish a bound needed in an intermediate step.

The fix is straightforward: since $K(S) \leq K(P) + O(1)$ from Step 1, and $K(P) \leq |P|$, we have $K(S) \leq |P| + O(1)$, so $\log K(S) \leq \log(|P| + O(1)) = O(\log |P|)$. This does not require assuming $|S| \leq |P| + O(\log |P|)$.

**Revision:** Fix the circular step. Replace "which we are proving" with the direct bound $K(S) \leq |P| + O(1)$.

---

## Issue 6: The Thinker Placement Is Subjective

**Severity: MINOR**

Table 1 assigns specific numerical $\sigma$ values to thinkers (e.g., Dijkstra = 0.98, Karpathy = 0.10). These are not derived from any formal analysis; they are the authors' interpretive judgment of each thinker's philosophical position. The appendix provides quotes to justify the placement, but the mapping from "Dijkstra advocated formal proof" to "$\sigma = 0.98$" is not a computation.

This is acceptable for a position paper but the precision of the numbers (two significant figures) overstates the confidence. The "uncanny valley" observation ($\sigma \in [0.3, 0.45]$) is interesting but depends on these subjective assignments.

**Revision:** Either (a) present the values as ranges (e.g., Dijkstra: $\sigma \in [0.9, 1.0]$) to convey the inherent uncertainty, or (b) add a footnote to Table 1 stating that values are ordinal estimates, not cardinal measurements. The uncanny valley claim should be qualified: "Subject to the ordinal reliability of these placements, we observe a gap..."

---

## Issue 7: Missing Related Work Section

**Severity: MAJOR**

The paper has no Related Work section. Prior formalizations of the specification-code relationship are cited inline but not systematically compared:

- **Hoare-He Unifying Theories of Programming (1998):** Directly formalizes programs as predicates with refinement as the ordering. The paper cites this in the appendix but does not discuss how its framework relates to or extends UTP.
- **Abrial's B-Method and Event-B:** Industrial-strength refinement calculus with tool support. Not cited.
- **The abstract interpretation literature post-Cousot:** Decades of work on Galois connections for program analysis. The paper uses one definition from 1977 but ignores 50 years of development.
- **Felleisen et al., "Semantics Engineering with PLT Redex":** Formalization of language abstraction levels.
- **Jackson's "The Essence of Software" (2021):** Cited for one sentence but its "concept design" framework is directly relevant to the specificity dimension.

**Revision:** Add a Related Work section (1-2 pages) that positions the paper's contributions against prior formalizations, explicitly stating what is new and what is repackaged.

---

## Issue 8: The Shannon Channel Model (Section 3.4) Is Underdeveloped

**Severity: MINOR**

Section 3.4 defines the spec-to-code channel but does nothing with it. No channel capacity is computed. No rate-distortion bound is derived. The entropy comparison between English (0.6-1.3 bits/char) and Java (3-4 bits/token) compares different units (characters vs. tokens) without normalization. The section reads as a gesture toward information theory rather than a developed result.

**Revision:** Either (a) develop the channel model into a theorem with a derived capacity bound, (b) move it to a "Future Work" discussion, or (c) remove it. Currently it promises more than it delivers.

---

## Issue 9: Proposition 5.1 (Agent Decomposition) Is Trivially True

**Severity: MINOR**

The "Agent Decomposition" proposition states that $\mathcal{G}(S, P) \leq \mathcal{G}(S, \hat{S}) + \mathcal{G}(\hat{S}, P) + O(\log n)$, which is just the chain rule applied to any intermediate string $\hat{S}$. There is nothing agent-specific about this. You could replace $\hat{S}$ with any arbitrary string and the inequality would still hold.

The interpretation ("interpretation gap" and "generation gap") is useful framing, but calling it a proposition overstates its content.

**Revision:** Downgrade from Proposition to Remark, or add agent-specific structure (e.g., bounds on $\mathcal{G}(S, \hat{S})$ as a function of model capacity, context window size, or training data).

---

## Issue 10: Preamble Contains Unused Definitions

**Severity: MINOR**

The LaTeX preamble contains dozens of unused commands inherited from a previous paper template: `\AccelerometerCircle`, `\PPGCircle`, `\EDACircle`, `\BrainCircle`, `\ECGCircle`, `\RespCircle`, `\TempCircle`, `\AltCircle`, `\ali`, `\yilun`, and many duplicate package imports (`algorithm` loaded twice, `adjustbox` twice, `multirow` twice, `pifont` twice, `enumitem` twice, `minitoc` twice). This signals that the paper was assembled hastily from a template.

**Revision:** Clean the preamble. Remove all unused commands and deduplicate package imports.

---

## Issue 11: No Experiments or Evaluation

**Severity: MAJOR (for an empirical venue) / MINOR (for a position/theory paper)**

The paper has no experiments. The "Empirical Calibration" section (Section 8) reports numbers from other papers (METR, GitClear, SWE-bench) but does not conduct any original evaluation. No attempt is made to validate the framework, e.g., by:

- Computing $\mathcal{G}(S, P)$ (or an approximation) for real spec-code pairs
- Testing whether the thinker placement predicts anything about tool effectiveness
- Measuring whether the design principles improve harness performance

If the paper targets a theory/position venue (e.g., a workshop, Onward!, essay track), this is acceptable. If it targets a main conference (ICSE, FSE, PLDI), experiments are expected.

**Revision:** Either (a) add a case study computing NCD (Normalized Compression Distance, the computable approximation of NID) for real spec-code pairs from the Gonzalez experiment, AWS TLA+ specs, or seL4, or (b) frame the paper explicitly as a position/theory paper and target an appropriate venue.

---

## Strengths

1. **Genuinely interdisciplinary.** The synthesis of Dijkstra, Curry-Howard, Kolmogorov, Kahneman, Suchman, and Wittgenstein into a single framework is rare and valuable.
2. **The two-dimensional $(\sigma, \kappa)$ metric** is a real contribution. The observation that TLA+ and English are both concise but differ in specificity is insightful and non-obvious.
3. **The "uncanny valley of specification"** ($\sigma \in [0.3, 0.45]$) is an interesting empirical observation that deserves further investigation.
4. **The contrarian analysis (Section 7)** is unusually honest for a formal methods paper. The steel-manned arguments for NL programming are presented fairly.
5. **The verification roadmap (Appendix F)** is practical and shows the authors have thought about mechanization.
6. **The multi-agent extension** using Kim et al. is timely and relevant.

---

## Concrete Revision Plan

| Priority | Issue | Action |
|----------|-------|--------|
| 1 | Missing Related Work | Add 1-2 page Related Work section |
| 2 | Novelty claim | Reframe Section 3 as application of known results |
| 3 | Monotonicity proof gap | Fix Theorem 3.1(c) proof per Issue 2 |
| 4 | Ad hoc MAS formula | Reframe as empirical model, not formal definition |
| 5 | Uncomputable metrics | Add uncomputability acknowledgment; use $\hat{\sigma}$ notation |
| 6 | Circular proof step | Fix Appendix A.2 Step 3 |
| 7 | Trivial decomposition | Downgrade Prop 5.1 to Remark |
| 8 | Channel model | Develop or move to Future Work |
| 9 | Thinker precision | Use ranges, add uncertainty footnote |
| 10 | Preamble cleanup | Remove unused template artifacts |
| 11 | No experiments | Add NCD case study OR frame as position paper |

---

## Overall Assessment

The paper attempts something valuable: bringing mathematical rigor to a question that has been debated informally for decades. The information-theoretic and lattice-theoretic foundations are sound (if not novel). The synthesis across CS, HCI, and cognitive science is genuinely impressive. The design principles are practical and well-motivated.

However, the paper currently suffers from a mismatch between the rigor of its formal sections (high) and its applied sections (low). The multi-agent gap formula is ad hoc, the thinker placements are subjective, the specificity metric is uncomputable, and the monotonicity proof has a gap. These issues are all fixable.

**Recommendation:** Major revision. Fix the proof gaps, add Related Work, be honest about what is novel vs. applied, and either add experiments or explicitly frame as a position paper. The core contribution (applying algorithmic information theory to harness design, the $(\sigma, \kappa)$ metric, the uncanny valley observation) is strong enough to carry the paper if the presentation is tightened.

---

## Sources

- Li, M. and Vitanyi, P. *An Introduction to Kolmogorov Complexity and Its Applications*, 4th ed. Springer, 2019.
- Kim, Y. et al. "Towards a Science of Scaling Agent Systems." arXiv:2512.08296, 2025. https://arxiv.org/abs/2512.08296
- Gonzalez, G. "A sufficiently detailed spec is code." Haskell for All, 2026. https://haskellforall.com/2026/03/a-sufficiently-detailed-spec-is-code
- METR. "Many SWE-bench-Passing PRs Would Not Be Merged." 2026. https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged/
- Back, R.J.R. "Correctness preserving program refinements." Mathematisch Centrum, 1980.
- Morgan, C. *Programming from Specifications.* Prentice Hall, 1994.
- Cousot, P. and Cousot, R. "Abstract interpretation." POPL 1977.
- Hoare, C.A.R. and He, J. *Unifying Theories of Programming.* Prentice Hall, 1998.
- Newcombe, C. et al. "How Amazon Web Services Uses Formal Methods." CACM, 2015. https://cacm.acm.org/research/how-amazon-web-services-uses-formal-methods/
