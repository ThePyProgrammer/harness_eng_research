# Consolidated Peer Review: Towards a Science for AI Coding Agent Harnesses (Expanded Version)

**Date:** 2026-04-03
**Paper:** `final_papers/science.tex` (2453 lines, ~180KB, expanded self-contained synthesis)
**Review type:** Three-persona adversarial review with deliberation

---

## Reviewer Summary

| Reviewer | Role | Recommendation | FATAL | MAJOR | MINOR |
|----------|------|---------------|-------|-------|-------|
| Prof. Elena Voss | Formal methods, ETH Zurich | Weak Accept | 0 | 4 | 11 |
| Dr. Marcus Chen | SE Empiricist, Microsoft Research | Major Revision | 0 | 7 | 7 |
| Sarah Okafor | Staff Architect, AI Tooling | Accept with minor revisions | 0 | 2 | 7 |

**Total unique issues:** 0 FATAL, 13 MAJOR, 25 MINOR

---

## Deliberation

**Chair:** Three reviews in. Voss is weak accept on formal grounds; Chen wants major revision for empirical gaps; Okafor accepts enthusiastically on practitioner grounds. Let us find consensus.

**Voss:** My four MAJOR issues are: (1) the governance bifurcation proof sketch has a linearization error at $C=1$; (2) the governance capacity principle is still used too aggressively after being disclaimed; (3) symbol overloading is pervasive ($\delta$, $\gamma$, $\kappa$, $\sigma$ each with 2-3 meanings); (4) the tacit divergence conjecture is mathematically ill-posed. Of these, (1) is a fixable error, (3) is notation hygiene, and (2) and (4) are epistemic framing issues. None are fatal to the contribution.

**Chen:** I have seven MAJOR issues but they cluster into two themes: (a) the paper uses correlational data to support causal claims (DORA, GitClear) without adequate hedging, and (b) the verification roadmap has two weak experiments (3 and 5). On theme (a), the paper has already improved its DORA characterization ("individual task completion" rather than "throughput") and added the METR baseline caveat. What remains is systematic: every time the paper says "AI adoption caused X," it should say "AI adoption is associated with X." On theme (b), Experiment 5 (governance capacity) is fundamentally undermined by the composite proxy measures, and Experiment 3 needs a $T$-dependent $\epsilon$ test.

**Okafor:** My two MAJOR issues are: (1) the human correction cycle is systematically underestimated; the paper treats humans as Layer 4 of a cascade rather than the central feedback mechanism; (2) cost management is absent but interacts with the context budget theorem and agent count optimization.

**Voss:** I agree with Okafor on the human-in-the-loop point. The paper is formally clean about verification cascades but misses that in practice the cascade is interleaved with human steering. This is a modeling limitation, not a formal error.

**Chen:** I partially agree with Okafor on cost. But I would not call it a MAJOR issue; the paper explicitly scopes out cost management in Section 1. The question is whether the scoping is adequate, and I think a paragraph acknowledging cost as a hard constraint on the context budget optimum would suffice.

**Okafor:** Fair. A paragraph that says "the optimal context budget may be further constrained by financial cost" would address my concern.

**Voss:** On the information unification thesis: the paper's Section 9.1 now honestly acknowledges the asymmetry (strong for 4/7 pillars, retrospective for 3). But the abstract and conclusion still overstate. This is a MINOR fix (edit two paragraphs).

**Chen:** Agreed. The abstract says "the unifying currency across all seven pillars is information." It should say "across the semantic and assurance axes" or similar qualifier.

**All three:** Consensus: **Accept with major revisions.** The paper makes a genuine contribution as an organizing framework. The formal machinery is mostly sound (with the bifurcation proof error fixable). The cross-pillar synthesis is the strongest section. The empirical gaps are honestly acknowledged but the verification roadmap needs strengthening for Experiments 3 and 5.

---

## Consolidated MAJOR Issues (for revision)

| # | Issue | Reviewers | Fix |
|---|-------|-----------|-----|
| M1 | Governance bifurcation proof sketch: $C=1$ fixed point claimed unstable, but linearization shows it is stable | Voss | Fix the proof sketch; $C=1$ is stable but unreachable for $\beta > 1$ |
| M2 | Governance capacity principle used uncritically after epistemic disclaimer | Voss | Add back-references to the disclaimer at each subsequent use |
| M3 | Symbol overloading: $\delta$, $\gamma$, $\kappa$, $\sigma$ each have 2-3 meanings | Voss | Systematic notation table in preliminaries; subscripts where needed |
| M4 | Tacit divergence conjecture is mathematically ill-posed | Voss | Specify concrete source model (e.g., mixture of discrete + continuous) |
| M5 | DORA data used with causal language despite correlational design | Chen | Replace "caused" / "produced" with "associated with" / "correlated with" |
| M6 | Experiment 3 cannot test $T$-dependent $\epsilon$ | Chen | Add $\epsilon(T)$ test to Experiment 3 design |
| M7 | Experiment 5 uses composite proxy measures that undermine threshold claims | Chen | Acknowledge this limitation; propose simpler proxy |
| M8 | Abstract and conclusion overstate information unification (claim uniform across all 7) | Voss, Chen | Qualify: "strongest along semantic and assurance axes" |
| M9 | Human correction cycle treated as Layer 4 rather than central mechanism | Okafor | Add subsection acknowledging human-in-the-loop as dominant quality lever |
| M10 | Cost management absent but interacts with context budget and agent count | Okafor | Add paragraph on cost as hard constraint |
| M11 | Uncalibrated parameters throughout (verification costs, decay rates, etc.) | Chen | Label all uncalibrated parameters explicitly |
| M12 | Design principle count inconsistency (abstract says 10, body has 11) | Okafor, Voss | Fix abstract to say 11 |
| M13 | Extended Amdahl (Theorem 5.3) should be "Proposition" given violated assumptions | Voss | Relabel as Proposition |

---

## Key MINOR Issues (selected)

- Conway's Law "theorem" is a tautology (Voss)
- Theory Externalization Bound is a definition, not a theorem (Voss)
- Detection Ceiling should cite Fano's inequality, not just DPI (Voss)
- "Codebase entropy" misnomer (it is a complexity measure, not Shannon entropy) (Voss)
- GitClear data used causally despite observational design (Chen)
- Kim et al. data used for both calibration and confirmation (Chen)
- VIH footnote is adequate but buried (Chen)
- Abstraction pillar produces no actionable guidance (Okafor)
- Accretion "category" name misleading (no category theory) (Okafor)
- P11 is aspirational (accretion detection undecidable) (Okafor)

---

## Revision Plan

**Priority 1 (must fix):** M1 (proof error), M3 (symbols), M8 (abstract/conclusion), M12 (principle count)
**Priority 2 (should fix):** M2 (capacity disclaimers), M5 (causal language), M9 (human-in-loop), M10 (cost), M13 (Amdahl relabel)
**Priority 3 (nice to have):** M4 (conjecture), M6/M7 (experiments), M11 (parameter labels)

---

## Sources

- Individual reviews: `outputs/review-voss.md`, `outputs/review-chen.md`, `outputs/review-okafor.md`
- Research evidence: `outputs/science-harness-synthesis-research.md`
