# Round 2 Rebuttal: Author vs. Reviewers D, E, F

**Date:** 2026-04-03

---

## The Arguments

### Argument 1: Title ("Science" vs. "Framework")

**Rodriguez (E):** "This is a theory paper, not a science. The distinction matters. Recommend changing to 'A Formal Framework.'"

**Author rebuttal:** The word "Towards" is doing important work. We are not claiming to have established a science; we are arguing that harness design *can be studied scientifically*. The verification roadmap is the "towards" part. The title signals aspiration, not achievement.

**Tanaka (D):** "I do not care what you call it. Call it a framework, call it a science, call it a cookbook. Does it help me build a better harness? Partially yes."

**Osei (F):** "It is neither a formal methods paper nor a standard SE paper. It is a foundational architecture paper. The title is fine for TSE/TOSEM."

**Resolution:** The title stays, but we add an explicit footnote or remark acknowledging the distinction between "towards a science" (the paper's goal) and "a science" (which requires empirical validation). Rodriguez's point about reviewer expectations is well taken.

---

### Argument 2: Developer Experience as Missing Variable

**Rodriguez (E):** "Developer experience is the single strongest moderator. Junior developers show 3-4x higher accretion rates than seniors. The framework has no place for this variable."

**Author rebuttal:** The framework models the harness architecture, not the human using it. Developer experience enters through the model's prior ($I(P; \theta | S)$ changes with how well the developer can prompt) and through the human correction cycle (Section 9.7). Adding it as a first-class variable would change the paper from a harness architecture paper to a sociotechnical systems paper.

**Tanaka (D):** "Rodriguez is right. In my product, the same harness performs radically differently for juniors vs. seniors. Your framework predicts the same optimal context budget for both, but Rodriguez's data says the optimum is 0.08W-0.15W for seniors and 0.35W-0.55W for juniors. That is a 3-4x range driven entirely by a variable your framework ignores."

**Author rebuttal:** Fair. We should acknowledge this as a limitation and note that developer familiarity acts as supplementary context outside the window, effectively shifting the context budget optimum.

**Resolution:** Add a remark to the context budget section acknowledging developer familiarity as a moderating variable, citing Rodriguez's data ranges. Add to Limitations section.

---

### Argument 3: Saturation Crossover Threshold

**Rodriguez (E):** "P* of 0.45 is from general benchmarks, not software engineering. Our software-specific data shows P* of 0.30-0.35. A paper about coding harnesses should not calibrate from non-coding benchmarks."

**Tanaka (D):** "Agree. Our internal data shows the crossover even lower for tightly coupled codebases. P* of 0.25-0.30 for monorepo tasks."

**Author rebuttal:** Kim et al. is the best available multi-agent scaling data. We flag this as a caveat, but we should update the presentation. P* of 0.45 becomes the general benchmark value; we add a note that software-specific P* is likely 0.25-0.35 based on tighter coupling and stricter correctness requirements.

**Resolution:** Update the saturation crossover discussion to present 0.30-0.35 as the software-specific estimate, with 0.45 as the general benchmark baseline. Cite Rodriguez's observation.

---

### Argument 4: Cost Modeling

**Tanaka (D):** "Cost modeling is CRITICAL. The binding constraint in production is almost always budget, not degradation."

**Rodriguez (E):** "Cost is out of scope for a theory paper. Adding it would double the paper's length."

**Osei (F):** "Cost is orthogonal to the formal framework. It constrains the Pareto frontier but does not change its shape."

**Author rebuttal:** Cost is acknowledged in the Remark after the Context Budget Theorem. We agree it is important but it is a separate optimization problem. Adding full cost modeling would require a financial model of token pricing, which changes quarterly and varies by provider.

**Tanaka (D):** "At minimum, the design principles should note which principles have cost implications. P1 (context budgeting) saves money. P14 (structural enforcement) costs engineering time upfront but saves operational cost. P9 (separate authorship) doubles model costs. Your principles are silent on cost."

**Resolution:** Add brief cost annotations to the most cost-sensitive design principles. Note in the Limitations section that cost optimization is a binding production constraint not addressed by the framework.

---

### Argument 5: The Kolmogorov Foundation

**Osei (F):** "The additive constant problem undermines the thinker placements. The shift from K to H is inadequately flagged."

**Rodriguez (E):** "I do not care about the Kolmogorov vs. Shannon distinction. Give me measurable quantities."

**Tanaka (D):** "The Abstraction pillar produces zero actionable guidance. I would cut it to 2 pages and call it 'theoretical motivation.'"

**Author rebuttal to Osei:** The thinker placements are explicitly described as "ordinal estimates." We add a remark noting that the additive constant makes specific numerical values meaningful only as relative orderings, not absolute positions. The K-to-H shift is flagged in the Remark after Definition 2.1. We can make this more prominent.

**Author rebuttal to Tanaka:** The Abstraction pillar justifies why context engineering matters (the gap decomposition), why specifications can be shorter than implementations (compressibility), and why formal specifications are better prompts (vericoding). These are not directly actionable but they explain *why* the actionable results in other pillars work.

**Osei (F) to Tanaka:** "The Abstraction pillar is the theoretical foundation. Without it, the Information pillar's gap decomposition has no mathematical grounding. You cannot cut the foundation because the building stands on it."

**Tanaka (D):** "The building stands fine on Shannon entropy alone. The Kolmogorov detour adds intellectual prestige but no structural support."

**Resolution:** Add a remark explicitly connecting K to H (the Abstraction pillar motivates the Information pillar's operationalization). Acknowledge the additive constant limitation on thinker placements. Do not cut the pillar, but note in its introduction that its primary role is providing theoretical grounding for the computable results in subsequent sections.

---

### Argument 6: Structural Enforcement as Verification

**Osei (F):** "The structural enforcement principle is the paper's strongest contribution, but it lacks formal definitions, connections to runtime verification, and a taxonomy of enforceable properties."

**Rodriguez (E):** "Our data shows structural enforcement at 99.7% compliance. The theory says 100%. The 0.3% gap matters for safety-critical applications."

**Tanaka (D):** "The 0.3% is agent workarounds, not gate failures. Agents find creative ways around structural restrictions (creating temporary files, using unexpected tool paths). Your model assumes the gate is perfect; reality has loopholes."

**Author rebuttal:** The 0.3% gap is real and important. We should add a remark noting that structural enforcement achieves compliance approaching 1.0 in practice, with the residual gap coming from enforcement coverage (not all invariants are structurally enforced) and agent workarounds (clever tool usage that bypasses gates). The formal model assumes a closed enforcement boundary; production systems have leaky boundaries.

**Resolution:** Add a paragraph acknowledging the enforcement gap in practice and connecting it to Osei's point about a taxonomy of enforceable vs. non-enforceable properties.

---

### Argument 7: The Paper's Identity

**Rodriguez (E):** "Split into three focused papers (semantic axis, execution axis, assurance axis) for top venue publication."

**Osei (F):** "The unified treatment is the contribution. Splitting would lose the cross-pillar connections."

**Tanaka (D):** "I need the unified treatment. Three separate papers means three literature searches to find the same insights."

**Author rebuttal:** We agree with Osei and Tanaka. The cross-pillar synthesis (Section 9) is the primary contribution. The individual pillar results are applications of known mathematics; the synthesis is novel.

**Resolution:** No structural change. Acknowledge in the paper that the individual pillar results could each support a focused paper, but the unified framework is the contribution.

---

## Consolidated Changes to Apply

| # | Change | Source | Priority |
|---|--------|--------|----------|
| R1 | Add footnote to title: "towards" signals aspiration, not achievement | Rodriguez | Medium |
| R2 | Add developer familiarity as moderator for context budget | Rodriguez, Tanaka | High |
| R3 | Update P* from 0.45 to 0.30-0.35 for software tasks | Rodriguez, Tanaka | High |
| R4 | Add cost annotations to cost-sensitive design principles | Tanaka | Medium |
| R5 | Add remark on additive constant for thinker placements | Osei | Medium |
| R6 | Add remark on K-to-H transition being model-dependent | Osei | Medium |
| R7 | Add paragraph on structural enforcement gap (0.3% residual) | Rodriguez, Tanaka, Osei | High |
| R8 | Add developer experience to Limitations | Rodriguez | Medium |
| R9 | Note Abstraction pillar's role as theoretical grounding | Tanaka, Osei | Low |
