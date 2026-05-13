# Perspective Review 4: HCI and Cognitive Science

**Reviewer stance:** HCI and cognitive science researcher studying human-computer interaction, distributed cognition, and the psychology of programming.

**Focus question:** Are the cognitive science claims (System 1/2, mentalese, Miller's law, Sapir-Whorf) deployed with the nuance these fields require, or are they cherry-picked to support a predetermined conclusion?

---

## Overall Rating: SUPERFICIAL

The paper's Section 5 ("The Cognitive Constraint") compresses four major cognitive science frameworks into a single page of unsupported assertions, each selectively deployed to reinforce the paper's prior commitment to formalism. None of the four claims would survive peer review in a cognitive science venue.

---

## Finding 1: System 1/System 2 Misapplication (MAJOR)

The paper claims that "natural language specifications invite System 1 processing" while "formal specifications force System 2 engagement," treating the difficulty of formal notation as "a feature." This is a loose analogy of exactly the kind Kahneman himself has cautioned against. The dual-process framework describes cognitive mechanisms, not a normative design prescription. Several problems:

- Experts reading familiar formal notation (e.g., experienced Haskell programmers reading type signatures) can process it fluently, which is characteristic of System 1. The paper conflates unfamiliarity with deliberateness.
- System 2 engagement is not inherently more accurate; it is effortful and subject to its own biases (anchoring, motivated reasoning). Forcing System 2 is not a universal good.
- The HCI literature on expertise (Dreyfus, Chi, Ericsson) shows that expert performance depends on pattern recognition (System 1), not on perpetual deliberation. The paper's framing implies that all programmers should remain in effortful novice mode.

The claim that "difficulty is a feature" is a desirable-difficulty argument (Bjork, 1994) presented without any of the conditions under which desirable difficulties actually improve learning versus simply imposing cost.

## Finding 2: Mentalese Argument is Oversimplified (MAJOR)

The paper claims that "NL specifications are doubly lossy" because thought occurs in mentalese, and that "formal notation may be closer to mentalese." This misrepresents Pinker's Language of Thought hypothesis in several ways:

- Pinker's mentalese is not a formal language; it is a hypothetical neural representational medium. Claiming that mathematical notation is "closer to mentalese" is unsupported by anything in Pinker's work or any subsequent cognitive science.
- The paper ignores that the mentalese hypothesis is contested (Churchland, Barsalou's perceptual symbol systems, embodied cognition broadly). Presenting it as established fact is misleading.
- Even granting mentalese, the "double lossy" claim assumes that formal notation bypasses the thought-to-language translation step, which would require formal notation to be a transparent encoding of thought. No evidence is offered for this.

## Finding 3: Miller's "Magical Number Seven" Misapplied (MINOR)

The paper claims that "working memory holds 7 +/- 2 chunks" and that "specifications must be hierarchically decomposable into chunks of this size," then asserts that "formal specifications enforce explicit chunking" while "prose specifications are poorly chunked."

This misapplies Miller's result in two ways. First, the 7 +/- 2 finding concerns short-term memory capacity for unrelated items, not the structure of design documents. Cowan (2001) revised the estimate to roughly 4 chunks. Second, the claim that formal specifications are better chunked than prose is an empirical assertion with no citation. Well-structured prose (with headers, bullet points, cross-references) can be chunked effectively; poorly structured formal specifications can overwhelm working memory just as easily. The Green and Petre (1996) cognitive dimensions framework would be the appropriate tool here, but it goes unmentioned.

## Finding 4: Sapir-Whorf Application Unsupported (MINOR)

The paper invokes "the weak Sapir-Whorf hypothesis applied to programming" to argue that "the specification language shapes what can be specified." This is a reasonable intuition, but:

- The weak Sapir-Whorf hypothesis in linguistics concerns habitual thought patterns, not logical expressibility. Any Turing-complete language can express anything another can.
- The relevant programming-language-specific literature (Iverson, yes, but also Felleisen 1991 on expressiveness, Krishnamurthi on language design) draws much more careful distinctions between what is expressible in principle versus what is convenient in practice. The paper collapses this distinction.
- Applying Sapir-Whorf to specification languages specifically (as opposed to programming languages) requires its own argument, which is not provided.

## Finding 5: Thinker Placement Table Treats HCI Figures Unfairly (MAJOR)

The placement table (Table 1) systematically disadvantages HCI and situated cognition thinkers:

- **Suchman** is placed at sigma 0.1-0.3, reducing her entire research program to "low specificity." Her actual argument is that plans are fundamentally different in kind from specifications, not that they are imprecise specifications. The paper's framework cannot represent this objection because it assumes all intellectual positions map onto a single specificity axis.
- **Kay** gets "dyn." for both axes with no further analysis, despite decades of published work on end-user programming, Smalltalk's live-object model, and STEPS (a concrete system with measurable properties).
- **Wittgenstein** gets dashes, effectively excluding him from the quantitative framework while still listing him to create an appearance of breadth.
- **Chollet** gets "var." with minimal engagement, despite ARC being one of the most concrete operationalisations of abstraction and reasoning measurement available.

These thinkers are included for rhetorical breadth but excluded from the paper's actual analytical apparatus. Their positions are acknowledged in Section 6 ("Contrarian Analysis") but framed as objections to be accommodated rather than as alternative frameworks with equal standing.

## Finding 6: "Formal = Better" Conflicts with HCI Research (MAJOR)

The paper's deep structure assumes that higher specificity (higher sigma) is normatively better, with low-sigma approaches acceptable only when "formal guarantees are not needed." This conflicts with decades of HCI research:

- **Situated cognition** (Suchman, Lave, Hutchins): action is fundamentally improvised, and plans are post-hoc rationalisations. Formal specifications cannot capture the situated nature of real work.
- **Ecological rationality** (Gigerenzer, Todd): heuristics that ignore information can outperform optimal strategies in uncertain environments. Less-specified approaches may be better adapted to uncertain requirements.
- **Repair and bricolage** (Orr, 1996; Levi-Strauss): real programming practice involves improvisation, repair, and creative reuse, none of which map onto refinement lattices.

The paper briefly acknowledges distributed cognition (Section 6) but treats it as a "contrarian" position rather than as the mainstream HCI view, which it has been for over 30 years.

---

## Summary

The cognitive science content in Section 5 functions as rhetorical decoration rather than as genuine engagement with the relevant literatures. Each framework is invoked in its most simplified, paper-friendly form, stripped of the caveats, controversies, and boundary conditions that actual cognitive scientists would insist on. The thinker placement table gives the appearance of intellectual pluralism while systematically disadvantaging positions that challenge the paper's formalist commitments. A revision should either engage these frameworks with the depth they require (which would likely complicate the paper's conclusions) or remove them and let the information-theoretic results stand on their own.
