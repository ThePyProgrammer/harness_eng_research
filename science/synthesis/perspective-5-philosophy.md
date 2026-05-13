# Perspective 5: Philosophy of Computer Science and Epistemology

**Reviewer stance:** Philosopher of computer science studying foundations of software, the nature of specifications, and the relationship between formal and informal knowledge.

**Central question:** Is the claim that "the gap between specification and code is a gap of perspective, not of kind" adequately defended?

**Rating: SURFACE-LEVEL**

---

## 1. The Curry-Howard Argument: Isomorphism vs. Identity (MAJOR)

The paper's strongest philosophical claim appears on line 314: Martin-Lof's type theory "proves that these are formally identical objects: the gap between specification and code is a gap of perspective, not of kind." This conflates mathematical isomorphism with practical identity in a way that would not survive scrutiny in any philosophy of mathematics seminar.

The Curry-Howard correspondence establishes a *structural isomorphism* between proofs and programs, propositions and types. It does not establish that specifications and implementations are "the same kind of thing" in any epistemically meaningful sense. A proposition (the *what*) and its proof (the *how*) are isomorphic in formal structure but play entirely different roles in mathematical practice. No working mathematician treats the statement of the Riemann Hypothesis as identical in kind to its (hypothetical) proof. The paper needs this distinction but never draws it.

The Seven Answers table (Appendix E) compounds this by listing Martin-Lof's answer as "Yes, by theorem," as though the Curry-Howard correspondence settles the philosophical question. It does not. It settles a *formal* question about structural correspondence. Whether that structural correspondence entails practical identity is precisely the philosophical work the paper declines to do.

## 2. The Contrarian Section: Genuine Engagement or Catalogue? (MAJOR)

Section 6 lists five contrarian positions in approximately 250 words total, roughly 50 words each. This is a catalogue, not an engagement. Consider the treatment of each:

**Wittgenstein (language games).** The paper correctly identifies meaning-as-use but draws no consequences from it. If meaning is constituted by use in a language game, then a prompt's meaning is not a fixed propositional content that can be measured by Kolmogorov complexity; it is a *move* whose significance depends on the shared practice of the participants. This undermines the entire information-theoretic framework, which presupposes that specifications have fixed informational content. The paper acknowledges this in one sentence and moves on.

**Suchman (situated action).** The paper states that "NL-mediated iterative development is closer to Suchman's situated actions than to formal planning." This is correct, but the implication is radical: if plans are not determinants of action but resources for action, then the refinement lattice (which models specification as a *plan* that is progressively concretised) is the wrong metaphor entirely. The paper never confronts this.

**The Bitter Lesson.** Cited but not engaged with. The paper's entire architecture privileges formal methods; the Bitter Lesson predicts this approach will lose to brute-force scaling. The paper offers no rebuttal.

The closing paragraph ("These arguments are strongest when specificity is low and weakest when formal guarantees are needed") domesticates the contrarian positions by absorbing them into the paper's own framework. This is not engagement; it is co-optation. Suchman and Wittgenstein would reject the sigma parameter itself as an illegitimate formalisation of something that resists formalisation.

## 3. Naur's "Programming as Theory Building" (MAJOR)

The paper cites Naur for Design Principle 6 ("Preserve the Theory") but drastically understates the radical implications of his position. Naur argued that the program text is a *secondary artifact*; the primary product of programming is a *theory* held in the minds of the programmers, a theory that cannot be fully externalised in any notation. If Naur is right, then the entire abstraction gap framework, which treats specifications and programs as strings whose informational relationship can be measured, misses the most important thing about software: the unwritten, unwritable knowledge that makes the code intelligible.

The paper's response is to suggest capturing "conversation logs, design rationale, specification evolution histories." But Naur's point is precisely that the theory *cannot* be captured in any artifact, textual or otherwise. Reducing his position to "save more metadata" is a misreading.

## 4. Smuggled Rationalist Epistemology (MAJOR)

The paper consistently treats formal knowledge as superior to tacit knowledge without defending this hierarchy. Section 5 frames System 2 thinking as a "feature" and System 1 as "error-prone." The cognitive constraints section presents formal notation's difficulty as beneficial because "it prevents the illusion of understanding." The "mentalese" argument suggests formal notation is closer to thought itself.

This is a rationalist epistemology (explicit, formal, propositional knowledge is epistemically primary) presented as though it were uncontroversial. It is not. The situated cognition tradition (Dreyfus, Suchman, Lave, Hutchins) has spent decades arguing that skilled practice is grounded in embodied, tacit knowledge that resists formalisation. The paper lists Hutchins and Suchman in the contrarian section but never addresses their epistemological challenge to the rationalist premise.

## 5. The Seven Answers Table: Fair or Rigged? (MINOR)

The table selects seven traditions, of which five answer "Yes" to Gonzalez's question, one says "the question is wrong" (Kay), and one says "yes, but that's a failure" (Parnas). Suchman and Wittgenstein, who would answer "No, the question presupposes a false picture of how language and action work," are excluded from the table despite appearing in the thinker placement. The framing ("The answers converge from different angles") predetermines convergence by excluding the traditions that diverge.

## 6. What Would Genuine Engagement Look Like?

The paper would need to: (a) distinguish formal isomorphism from practical identity in the Curry-Howard discussion; (b) confront the possibility that Wittgenstein and Suchman's objections undermine the *framework itself*, not just its applicability at low sigma; (c) take Naur's position seriously enough to ask whether the abstraction gap is measuring the right thing; and (d) explicitly defend the rationalist epistemology or acknowledge it as a contestable assumption.

---

**Summary:** The formal machinery is competent. The philosophical engagement is not. The paper uses thinkers like Wittgenstein, Suchman, and Naur as intellectual decoration, citing them for credibility without allowing their positions to challenge the framework's foundations. The central claim about perspective vs. kind rests on a conflation that any philosopher of mathematics would flag immediately.
