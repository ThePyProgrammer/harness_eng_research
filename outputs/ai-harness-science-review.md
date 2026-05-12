# Peer Review: "Towards a Science for AI Coding Agent Harnesses"

## Panel Summary

| Reviewer | Persona | Score | Recommendation |
|----------|---------|-------|----------------|
| R1 | The Empiricist (Senior ML Researcher) | 5/10 | Weak Reject |
| R2 | The Theoretician (Info Theory Professor) | 5/10 | Weak Reject |
| R3 | The Systems Builder (Industry Researcher) | 5/10 | Weak Reject |
| R4 | The SE Researcher (ICSE/FSE Veteran) | 4/10 | Weak Reject |
| R5 | The Interdisciplinary Skeptic (Phil + CS) | 5/10 | Weak Reject |

**Mean score: 4.8/10. Unanimous Weak Reject.**

---

## I. Consensus Issues (All 5 Reviewers Agree)

### 1. FATAL: Zero Empirical Validation
Every reviewer flagged the absence of original experiments as the single most damaging weakness. The paper presents 63 formal results, derives 35 design principles, and proposes five experiments, but completes none. The verification roadmap (Section 12.2) is praised universally as the best part of the paper, but it is a promissory note.

> **R1**: "A science requires experiments. This paper has none."
> **R3**: "Until that work is done, this is a hypothesis paper, not a science paper."
> **R4**: "At minimum, one of the five proposed experiments should have been conducted."

### 2. MAJOR: "Science" Framing Oversells the Contribution
All reviewers agree the paper is more accurately described as a "formal framework" or "research agenda." The title "Towards a Science" sets expectations the paper cannot meet.

> **R5**: "What the paper actually provides is a formal vocabulary for engineering reasoning, which is valuable but is not the same thing as science."
> **R1**: "The paper would score substantially higher if it retitled itself 'A Formal Framework.'"

### 3. MAJOR: Governance Capacity Bound Is Analogy, Not Theorem
All reviewers identified Proposition 8.1 as the paper's most problematic formal claim. It is labeled a structural analogy to Shannon's channel coding theorem but treated as load-bearing for design principles.

> **R2**: "The 'governance channel' has no defined alphabet, transition matrix, or coding scheme. This is a queue stability condition, not a channel coding result."
> **R3**: "Calling this a 'structural analogy' and then deriving design implications from it (as though it were a theorem) is misleading."
> **R4**: "How tight is this analogy? Architectural drift is neither stationary nor ergodic."

### 4. MAJOR: Kolmogorov Complexity Is Decorative
The paper defines core quantities via K(P|S) but immediately pivots to Shannon entropy H(P|S) for all practical purposes. Multiple reviewers note that removing Kolmogorov would lose approximately zero predictive power.

> **R2**: "If the Kolmogorov framework were removed and replaced by Shannon throughout, the paper would lose approximately zero predictive power."
> **R3**: "The Spec-Code Convergence Theorem tells practitioners nothing they did not already know: complex logic requires detailed specifications."

### 5. MAJOR: Paper Is Too Long
At ~3683 lines / ~100 pages with appendices, all reviewers consider the paper unpublishable at this length.

> **R3**: "A focused 30-page paper covering the three strongest results with empirical grounding would be more impactful than 100 pages of theory without validation."
> **R4**: "Seven pillars could each be a separate paper with proper empirical grounding."

### 6. MINOR: Symbol Overloading
Despite the disambiguation table, all reviewers flag the reuse of delta, gamma, kappa, sigma, and n as a readability problem.

### 7. Strength: Unusual Intellectual Honesty
All reviewers praise the self-assessment, evidence quality table, contrarian engagement, and verification roadmap. This paper knows what it lacks.

---

## II. The Reviewer Discussion: Points of Disagreement

### Debate 1: Is the Accretion Category Novel?

**R1, R3, R5 (YES):** The Accretion Category identifies a genuinely new defect class, code that is correct, unnecessary, individually defensible, and collectively harmful, arising from statistical pattern completion rather than intentional authorship. This is absent from classical taxonomies.

**R4 (NO):** "The concept of individually correct but collectively harmful code is well-established in the technical debt literature: Cunningham 1992, Kruchten et al. 2012, Fowler's code smells. The novelty is at best incremental: accretion describes an increased *rate* of a known phenomenon under a new generation mechanism."

**R2 (NEUTRAL):** "The concept is interesting but the definition makes detection provably impossible, so the contribution is naming, not solving."

**Resolution:** The paper should position the Accretion Category explicitly against Kruchten's design debt taxonomy and Fowler's code smells, acknowledging the conceptual overlap while arguing that the generative mechanism (statistical completion vs. intentional choice) and the decidability status (individual detection is undecidable) distinguish it from prior work.

### Debate 2: Does Formalizing Known Practices Add Value?

**R3 (SKEPTICAL):** "Roughly 20 of the 35 principles are formalizations of known best practices. 'Budget Context' was known since Lost in the Middle. 'Fix the Weakest Link' is basic reliability engineering."

**R2, R5 (PARTIALLY):** The compound error sensitivity (elasticity = n) and structural enforcement dominance ((1-epsilon)^T) are cases where formalism adds genuine value, producing non-obvious quantitative predictions. But the governance bifurcation and Conway's Law as graph containment are "tautologies dressed as theorems" (R5).

**R1 (YES, IF TESTED):** "The paper's contribution is grounding principles in formal models. This is valuable if the formal models make correct predictions. We can't evaluate that without experiments."

**Resolution:** The paper should explicitly distinguish three categories of principles: (a) novel predictions of the framework (testable, not yet tested), (b) formalized restatements of known practice (value is precision, not novelty), (c) philosophical observations (value is conceptual, not predictive). Currently these are mixed without labels.

### Debate 3: Is the Information-Theoretic Unification Real?

**R2, R5 (NO for 3/7 pillars):** The paper concedes that for Reliability, Coordination, and Temporal, the information-theoretic framing is "valid but retrospective." Calling compound errors "information destruction" is relabeling, not unification.

**R1 (MIXED):** "The cross-pillar synthesis (Section 9) is the strongest part of the paper. The GIB as an integrating concept works, even if the individual pillars use native formalisms."

**R3 (PRAGMATIC):** "The cross-pillar connections (staleness-coordination feedback, FKG amplification) are genuinely non-obvious. I don't care if they're 'truly' information-theoretic; they're useful."

**Resolution:** Weaken the claim from "information is the unifying currency" to "information theory provides a shared vocabulary and identifies cross-pillar constraints, while three pillars retain their native formalisms as the primary analytical tools." This is more honest and barely changes the paper's substance.

### Debate 4: Suchman/Wittgenstein -- Genuine Challenge or Boundary Condition?

**R5 (GENUINE CHALLENGE):** "If meaning is constituted by use, K(P|S) is not well-defined for conversational specifications. The paper's scope of applicability may be narrower than presented."

**R1, R3 (BOUNDARY CONDITION):** "The framework applies to written specifications and documented contexts. Conversational interaction is a different mode that the framework doesn't claim to cover."

**R4 (IRRELEVANT):** "This is philosophy, not SE. The practical question is whether the formal models predict measured outcomes."

**Resolution:** The paper should explicitly scope its applicability to written, stable specifications and acknowledge that the dominant mode of AI agent interaction (conversational) is outside this scope. This is already partially done in Section 13.2 but should be moved to the introduction.

### Debate 5: Should the Paper Be Split?

**R3 (YES):** Split into a focused 25-30 page paper with empirical validation of 3 results, plus a technical report for the full framework.

**R4 (YES):** "Reduce scope to 3-4 pillars and develop them with empirical calibration."

**R1, R2, R5 (MAYBE):** The cross-pillar synthesis is the unique contribution; splitting risks losing it. But the current length is untenable.

**Resolution:** The paper should remain unified but cut ~30% of content, focusing on the strongest results (structural enforcement, compound error sensitivity, context budget, governance bifurcation). Move extended proofs, calibration tables, and the full 35 principles to supplementary material.

---

## III. Consolidated Severity Ratings

| Issue | Severity | Reviewers | Fix Required |
|-------|----------|-----------|--------------|
| No empirical validation | FATAL | All 5 | Conduct at least 1 experiment OR retitle as "framework" |
| "Science" framing | MAJOR | All 5 | Retitle to "Formal Framework" |
| Governance Capacity as "theorem" | MAJOR | All 5 | Downgrade to "Principle" with explicit analogy caveats |
| Kolmogorov decorative | MAJOR | R1,R2,R3,R4 | Make Shannon primary; K as motivation only |
| GIB mixes K and H | MAJOR | R2 | Use H(P|S) consistently in GIB equation |
| Accretion vs. tech debt literature | MAJOR | R4 | Position against Kruchten, Fowler explicitly |
| Overloaded symbols | MAJOR | All 5 | Deduplicate critical symbols (delta, gamma) |
| No Threats to Validity | MAJOR | R4 | Add construct/internal/external/conclusion threats |
| Decidability language imprecise | MAJOR | R4 | Distinguish formal decidability from practical detectability |
| Detection Ceiling attribution | MINOR | R2 | Fix: Fano's inequality, not DPI |
| Paper length | MINOR | All 5 | Cut ~30%, move appendices to supplement |
| Thinker placement false precision | MINOR | R1,R4 | Qualify as ordinal/illustrative |
| Info-theoretic unification oversold | MINOR | R2,R5 | Weaken claim for execution axis |
| VIH unmeasured | MINOR | R1,R3,R4 | Add explicit caveat in every use |

---

## IV. Concrete Revision Plan

### Priority 1: Framing (address in revision)
1. **Retitle**: "Towards a Science" -> "Towards a Formal Framework" (or "A Formal Framework for...")
2. **Add scope statement in introduction**: explicitly state the framework applies to written/stable specifications; conversational interaction is acknowledged as outside scope
3. **Add epistemic register markers**: tag each major result as [Mathematical Fact], [Engineering Hypothesis], or [Philosophical Speculation]

### Priority 2: Technical Corrections (address in revision)
4. **GIB equation**: replace K(P|S) with H(P|S) on left side, or add explicit asymptotic equivalence caveat via Vitanyi
5. **Governance Capacity Bound**: relabel from Theorem/Proposition to "Design Principle" or "Capacity Heuristic"; reframe proof as queue stability argument, not Shannon analogy
6. **Detection Ceiling**: fix attribution from DPI to Fano's inequality
7. **Decidability classification**: add paragraph distinguishing formal decidability (Rice) from practical detectability (tool capabilities)
8. **Kolmogorov framework**: restructure Abstraction pillar to lead with Shannon; position K as motivational ideal in a clearly labeled remark
9. **Symbol deduplication**: rename at minimum delta_a -> epsilon_a, and use gamma_cc for common-cause vs gamma_g for governance drift

### Priority 3: Missing Sections (add)
10. **Threats to Validity**: add proper section following construct/internal/external/conclusion framework
11. **Accretion vs. Tech Debt**: add 1-2 paragraphs positioning against Cunningham 1992, Kruchten 2012, Fowler; argue the generative mechanism and decidability status are the novel contributions
12. **VIH caveats**: add explicit "unmeasured metric" qualifier in every design principle that references VIH

### Priority 4: Length Reduction (if submitting to venue)
13. Move full proofs appendix to supplementary material
14. Move extended calibration tables to supplementary material
15. Compress the 35 principles to a table + the 10 most novel ones in prose
16. Move 3 of 7 contrarian positions to supplementary material

---

## Sources

All reviews based on primary reading of `final_papers/science.tex` (3683 lines). Individual reviews:
- `outputs/r1-empiricist.md`
- `outputs/r2-theoretician.md`
- `outputs/r3-systems-builder.md`
- `outputs/r4-se-researcher.md`
- `outputs/r5-interdisciplinary-skeptic.md`
