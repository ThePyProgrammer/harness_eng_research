# Review: Multi-Agent Systems Perspective

**Reviewer expertise:** Multi-agent systems, coordination mechanisms, MAS scaling laws

**Overall assessment of MAS contribution:** GRAFTED-ON

---

## 1. Agent Decomposition: Insight or Tautology?

**Severity: MAJOR**

The "Agent Decomposition" (Remark 4.1, formerly a Proposition, now honestly downgraded) splits the abstraction gap into an interpretation gap and a generation gap via the chain rule. The paper itself concedes this: "This is a direct application of the chain rule to the string S-hat; the agent-specific insight is the interpretation."

The problem is that the "interpretation" is not itself formalized. Any intermediate string S-hat yields this decomposition; the claim that S-hat represents the agent's "understood specification" is a naming convention, not a structural insight. In MAS research, decomposition results earn their keep by revealing something non-obvious about how the parts interact (e.g., coordination costs that grow superlinearly, information bottlenecks at specific agents). Here the decomposition holds for any string at all, making it vacuous as a contribution to multi-agent theory.

A genuine insight would require showing that the decomposition is *non-trivially constrained* by agent architecture: for instance, that the interpretation gap is bounded by the context window size, or that the generation gap exhibits phase transitions at particular capability thresholds. None of this is attempted.

## 2. Removal of the Empirical Formula (Eq. 5)

**Severity: MAJOR**

The paper acknowledges that the original Eq. 5 (connecting coordination metrics O, A_e, R to the Kolmogorov gap) was replaced with qualitative discussion because of "dimensional heterogeneity." This is an honest and correct decision; a formula mixing bits with unitless ratios would be indefensible.

However, the consequence is severe: Section 4 now contains *no formal multi-agent result*. The abstraction gap framework (Sections 2-3) has theorems with proofs. The multi-agent section has a remark that applies the chain rule, a proposition that summarizes someone else's empirical findings, and a paragraph stating that a rigorous model "remains an important open problem." The section's formal content could be written in three sentences.

The paper should either (a) develop an actual information-theoretic model of coordination overhead (even a simplified one under stated assumptions), or (b) remove the multi-agent claim from the contributions list entirely and relegate it to a brief "future work" paragraph.

## 3. Proposition 4.1: Beyond Summarizing Kim et al.?

**Severity: MAJOR**

Proposition 4.1 lists four bullet points about independent, centralised, decentralised, and hybrid MAS, with numbers taken directly from Kim et al. (17.2x error amplification, 4.4x, +9.2%, capability saturation at 45%). This is labeled a "Proposition," but it contains no derivation, no proof, and no connection to the paper's own formal apparatus.

Compare this to how the paper treats its single-agent results: Theorem 3.1 has a proof; Theorem 3.2 has a proof; Theorem 3.3 has a proof. Proposition 4.1 has a bibliography citation. The asymmetry is glaring. The numbers from Kim et al. are interesting empirical findings, but wrapping them in a "Proposition" environment does not make them a theorem of this framework.

A real connection would derive *predictions* from the abstraction gap framework that Kim et al.'s data could confirm or refute. For example: "If task decomposability (measured by mutual information between sub-tasks) exceeds threshold T, then centralised MAS should reduce the effective gap relative to SAS by at least X bits." Nothing of this form appears.

## 4. What a Real MAS Contribution Would Look Like

The paper has strong single-agent foundations (Kolmogorov complexity, refinement lattice, Curry-Howard). A genuine MAS extension would need at least some of the following:

- **Information-theoretic coordination cost model.** Define coordination overhead in bits (not turns or ratios). For instance, model the orchestrator's communication channel as a noisy channel with bounded capacity, and show that error amplification arises when sub-task specifications exceed that capacity.
- **Composition theorems.** Prove that the gap of a composed multi-agent system relates to individual agents' gaps via specific algebraic structure (not just the generic chain rule). Account for the topology of the communication graph.
- **Redundancy as error correction.** The paper mentions that independent agents provide "diverse guesses" but never formalizes this. A Shannon-theoretic model of MAS-as-repetition-code would connect redundancy rate R to effective gap reduction through coding-theoretic bounds.
- **Capability saturation as a phase transition.** The 45% saturation threshold from Kim et al. could potentially be derived as a phase transition in an information-theoretic model where single-agent capacity crosses the channel capacity for the given task distribution.

None of these are present. The gap between what the formal machinery could support and what Section 4 actually delivers is, ironically, a large abstraction gap.

## 5. Treatment of Coordination Overhead, Error Amplification, and Redundancy

**Severity: MINOR**

The paper defines these three metrics (Section 2.2) faithfully following Kim et al., which is fine as preliminary exposition. But the MAS community would expect these to be *analyzed*, not merely imported. Questions that go unaddressed:

- How does coordination overhead scale with communication graph density? The paper states T proportional to n^1.7 for centralised MAS but does not analyze whether this exponent is topology-dependent.
- Error amplification of 17.2x for independent agents is reported without any model of *why* independence amplifies errors. The abstraction gap framework should explain this (perhaps errors in decomposition increase K(P | S) superlinearly), but it does not.
- Redundancy is defined via cosine similarity of embeddings, which is an implementation detail, not an information-theoretic quantity. This is never reconciled with the paper's Kolmogorov complexity framework.

## Summary Verdict

The multi-agent extension (Section 4) occupies approximately 1.5 pages and contains one application of the chain rule (acknowledged as such), one "proposition" that lists empirical numbers from another paper, and a candid admission that the real formalization remains open. This is not a contribution to multi-agent systems theory; it is a placeholder indicating where such a contribution might eventually go.

**Rating: GRAFTED-ON.** The paper's real contributions are the single-agent abstraction gap formalization (Sections 2-3), the specificity-compression metric (Section 5), and the design principles (Section 7). Section 4 should either be developed into a genuine formal result or reduced to a future-work discussion. Its current status, halfway between a contribution and an open question, weakens the paper's otherwise strong formal identity.

**Recommendation:** If submitting to a MAS venue, the multi-agent section needs a complete rewrite with original formal results. If submitting to a software engineering or PL theory venue, demote Section 4 to a half-page discussion and remove "multi-agent extension" from the contributions list. The paper is stronger without a weak section than with one.
