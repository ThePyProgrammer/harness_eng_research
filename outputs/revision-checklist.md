# Paper Revision Checklist

Derived from 5-reviewer panel (R1 Empiricist, R2 Theoretician, R3 Systems Builder, R4 SE Researcher, R5 Interdisciplinary Skeptic). Mean score: 4.8/10, unanimous Weak Reject.

## Status Key
- [x] DONE -- implemented in science.tex
- [ ] TODO -- not yet addressed
- [~] PARTIAL -- started but incomplete

---

## Category A: Framing & Presentation (10 items)

### Already Done
- [x] A1. Retitle "Towards a Science" -> "A Formal Framework" (ALL)
- [x] A2. Add epistemic register markers in introduction (R5)
- [x] A3. Add scope statement: framework applies to written specs; conversational mode acknowledged as outside scope (R5)
- [x] A4. Weaken info-theoretic unification claim for execution axis (R2, R5)

### Still Open
- [ ] A5. **Cut paper length ~30%** -- move extended proofs, calibration tables, full 35 principles to supplementary material (ALL) [HIGH EFFORT]
- [x] A6. **Add systematic harness comparison table** -- consolidated table showing how GSD/RAPID/Blueprint/Turing instantiate each pillar (R3, R4) [MEDIUM EFFORT]
- [x] A7. **Qualify thinker placement table** more strongly -- add note that coordinates are ordinal illustrations, not measurements (R1, R4) [LOW EFFORT]
- [x] A8. **Distinguish prediction vs. post-hoc rationalization** -- explicitly flag which framework predictions are novel vs. rationalized from existing practice (R3) [MEDIUM EFFORT]
- [x] A9. **Add per-result epistemic register tags** inline -- not just the intro paragraph but [Mathematical Fact] / [Engineering Hypothesis] / [Philosophical Observation] on individual theorems (R5) [MEDIUM EFFORT]
- [ ] A10. **Make scope restriction more prominent** -- move from Section 13.2 into a visible position in Section 1 (R5) [LOW EFFORT -- partially done in A3]

---

## Category B: Technical Corrections (10 items)

### Already Done
- [x] B1. Fix GIB equation (K -> H on left side, add Vitanyi caveat) (R2)
- [x] B2. Downgrade Governance Capacity Bound from theorem to rate-stability principle (ALL)
- [x] B3. Fix Detection Ceiling attribution (Fano, not DPI) (R2)
- [x] B4. Tighten decidability classification language (D/SD/U -> Practically Decidable / Partially Detectable / Reliably Undetectable) (R4)
- [x] B5. Fix symbol overloading (gamma -> gamma_g for governance drift) (ALL)

### Still Open
- [ ] B6. **Make Shannon primary, Kolmogorov motivational** throughout Abstraction pillar -- restructure Section 2 to lead with H(P|S) (R2, R3, R4) [HIGH EFFORT]
- [x] B7. **Drop or develop Curry-Howard-Lambek Bridge** -- either develop proof-complexity connection or reduce to a remark (R2) [MEDIUM EFFORT]
- [x] B8. **Fix Compound Degradation proof sketch** (Theorem 7.5) -- justify |mu(f_i)| ~ n^beta assumption, make Delta_H_cross mechanism precise (R2) [MEDIUM EFFORT]
- [x] B9. **Justify Governance Bifurcation ODE functional forms** -- added Engineering Hypothesis tag, functional form justification remark, and note that alternative forms preserve qualitative threshold (R1, R2, R5) [MEDIUM EFFORT]
- [x] B10. **Rename "Codebase Entropy"** -- renamed to "Coupling Complexity" with symbol Gamma, added remark explaining it is not a Shannon entropy (R2) [LOW EFFORT]
- [x] B11. **State Beta-Binomial calibration limitation** -- added remark noting zero degrees of freedom and that parameters are illustrative (R2) [LOW EFFORT]

---

## Category C: Missing Literature (5 items)

All [LOW EFFORT] -- add bib entries and brief engagement in Related Work.

- [x] C1. **Perry and Wolf (1992)** -- added to bib and cited in Architecture Governance subsection of Related Work (R4)
- [x] C2. **Passos et al.** -- cited in Governance/ADR Related Work subsection (R4)
- [x] C3. **Hochstein and Lindvall** -- added to bib and cited in Governance/ADR Related Work subsection (R4)
- [x] C4. **Brown et al. (2010) and Li et al. (2015)** -- added to bib and cited in Quality/Testing subsection of Related Work (R4)
- [x] C5. **Shull et al. (2002) and Boehm & Basili (2001)** -- added to bib and cited with note that 1:10:100 is disputed (R4)

---

## Category D: Missing Sections (6 items)

### Already Done
- [x] D1. Threats to Validity section (construct/internal/external/conclusion) (R4)
- [x] D2. Position Accretion Category against Cunningham 1992, Kruchten 2012, Fowler (R4)

### Still Open
- [x] D3. **Address Goodhart vulnerability concretely** -- added 3 mitigation strategies (metric rotation, triangulation, multi-granularity governance) (R5) [LOW EFFORT]
- [x] D4. **Add VIH caveats** -- added "unmeasured metric" caveat to QAS/VIH design principle; existing footnote on Definition 6.2 already flags it (R1, R3, R4) [LOW EFFORT]
- [x] D5. **Split/label Governance pillar sub-concerns** -- theory preservation (philosophical), cascade control (engineering), decision survival (management), ratchet (formal methods) (R3) [MEDIUM EFFORT]
- [x] D6. **Lead Conway's Law with optimization, not containment** -- reorder Section 5.8-5.9 to lead with balanced min-cut problem, containment theorem as corollary (R4) [MEDIUM EFFORT]

---

## Category E: Philosophical / Deep (2 items)

- [x] E1. **Defend or soften Tacit Divergence Conjecture** -- either provide concrete example of tacit knowledge with continuous-source structure, or soften from "conjecture" to "illustrative formalization" (R5) [MEDIUM EFFORT]
- [ ] E2. **Address the Suchman challenge more substantively** -- beyond "boundary condition," acknowledge that conversational AI is the dominant mode and the framework's scope is genuinely narrower than it appears (R5) [LOW EFFORT -- partially done in A3]

---

## Category F: Empirical Work (4 items)

All [HIGH EFFORT] -- requires actual experimental work, not just text edits.

- [ ] F1. **Conduct at least 1 of 5 proposed experiments** -- R4 recommends context budget experiment (2-4 months, $5-15K). Would transform paper from framework to science. (ALL)
- [ ] F2. **Validate 18 slop types taxonomy** -- labeled corpus, inter-rater reliability (kappa), coverage analysis against IEEE 1044 and ODC (R1, R4)
- [ ] F3. **Measure VIH in a production harness** -- instrument GSD or RAPID to log raw iteration rate * verification pass rate (R1, R3, R4)
- [ ] F4. **Test three-factor orthogonality** -- confirmatory factor analysis on labeled defect corpus (R1, R4)

---

## Category G: New Pillars (3 items)

- [x] G1. **Economics Architecture pillar document** (pillars/7-economics-architecture.md) (R3)
- [x] G2. **Human Interaction Architecture pillar document** (pillars/8-human-interaction-architecture.md) (R3, R5)
- [x] G3. **Model Routing Architecture pillar document** (pillars/9-model-routing-architecture.md) (R3)
- [ ] G4. **Integrate new pillars into science.tex** -- write formal LaTeX sections for Pillars 7-9 [HIGH EFFORT]

---

## Priority Matrix

### Lowest Hanging Fruit (can do in < 5 minutes each)
A7, A10, B10, B11, C1-C5, D3, D4, E2

### Medium Effort (30-60 minutes each)
A6, A8, A9, B7, B8, B9, D5, D6, E1

### High Effort (hours to days)
A5, B6, F1-F4, G4

---

## Scoreboard

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| A. Framing | 10 | 8 | 2 |
| B. Technical | 11 | 10 | 1 |
| C. Literature | 5 | 5 | 0 |
| D. Missing Sections | 6 | 6 | 0 |
| E. Philosophical | 2 | 1 | 1 |
| F. Empirical | 4 | 0 | 4 |
| G. New Pillars | 4 | 3 | 1 |
| **TOTAL** | **42** | **33** | **9** |
