# Review: "Towards a Science for AI Coding Agent Harnesses"

**Reviewer:** Prof. Amara Osei, INRIA
**Expertise:** Programming languages, formal verification (Coq, Lean 4), correct-by-construction development
**Date:** 2026-04-03

---

## Summary

This paper proposes a seven-pillar formal framework for reasoning about AI coding agent harness architecture, using information theory as the unifying currency. The paper draws from Kolmogorov complexity, Shannon information theory, reliability theory, control theory, lattice theory, and computability theory. It is ambitious in scope, spanning 35 design principles across seven architectural dimensions, with a commendable empirical verification roadmap.

I read this paper because the Abstraction pillar and the Curry-Howard-Lambek discussion promised a serious engagement with formal methods. What I found is a paper that uses formal methods vocabulary extensively, sometimes correctly and sometimes loosely, but ultimately does not produce formal methods results. The paper is aware of this (Section 12 on scope and framing), but the tension between formal aspiration and engineering reality runs through every section.

---

## 1. The Abstraction Pillar: Is Kolmogorov Complexity the Right Foundation?

**Rating: MAJOR**

The paper defines the abstraction gap as $\mathcal{G}(S, P) = K(P \mid S)$ and then immediately acknowledges that $K(P \mid S)$ is uncomputable. This is intellectually honest as far as it goes. The standard move in the algorithmic information theory literature is to use $K$ as a theoretical reference point and then operationalize via computable approximations. The paper does this, pivoting to Shannon entropy $H(P \mid S)$ in the Information pillar. So far, so good.

The problem is subtler than mere uncomputability. The paper treats $K(P \mid S)$ as if it were a well-defined quantity for a given specification-program pair. But Kolmogorov complexity is defined up to an additive constant that depends on the choice of universal Turing machine. For asymptotic arguments (where $O(\log n)$ terms wash out), this is fine. For the kind of concrete, finite reasoning the paper wants to do (placing thinkers on a $(\sigma, \kappa)$ coordinate plane, computing specific gap values), the additive constant matters. The paper never addresses this. The "thinker placement" table (Dijkstra at $\sigma \approx 0.95$, Lamport at $\sigma \approx 0.78$) assigns specific numerical values to quantities that are undefined up to a machine-dependent constant. These are presented as "ordinal estimates," but even ordinal comparisons require that the additive constant not swap the ordering, which is not guaranteed for small differences.

The Shannon operationalization is more defensible, but introduces its own problem: $H(P \mid S)$ depends on a probability distribution over programs. Which distribution? The paper implicitly uses the LLM's output distribution conditioned on $S$, which is a reasonable engineering choice but ties the "abstraction gap" to a specific model's capabilities rather than to an intrinsic property of the specification-code relationship. This is a significant conceptual shift from the Kolmogorov formulation (which is model-independent) that the paper does not adequately flag.

The foundation is not fundamentally flawed, but it is less solid than the paper suggests. The Kolmogorov framing provides good intuitions and clean asymptotic results (the Convergence Theorem). The Shannon framing provides measurability. Neither provides what the paper sometimes implies: a precise, computable, model-independent measure of the specification-code gap.

## 2. The Curry-Howard-Lambek Bridge: Genuine Insight or Name-Dropping?

**Rating: MINOR**

The paper presents the Curry-Howard-Lambek correspondence table correctly. The standard mapping (propositions to types, proofs to programs, implication to function types, dependent products and sums to their categorical counterparts) is accurately stated. The citation to Martin-Lof, Wadler, and Lambek is appropriate.

The insight the paper draws, that "a specification is a proposition and an implementation is a proof," is correct and well-known. The further observation that $K(P \mid S)$ measures "proof complexity" under this reading is a nice connection, though it is more of a restatement than a novel result.

What the paper does not do, and what a formal methods researcher would want, is use the correspondence to derive anything. In the Curry-Howard reading, refinement is proof construction. The Galois connection tower is a tower of abstractions. These are powerful ideas that could yield concrete results about agent-mediated refinement. For instance: under what conditions does an LLM's autoregressive generation process correspond to a valid refinement step? When does the output of an LLM-mediated "proof search" (code generation) actually inhabit the type (satisfy the specification)? The paper does not ask these questions, let alone answer them.

The seL4 example (8,700 lines of C, 200,000 lines of Isabelle/HOL proof) is well-chosen and correctly illustrates the gap between implementation and verification. The $(\sigma, \kappa)$ placement is reasonable.

Verdict: the correspondence is used correctly but shallowly. It provides a nice conceptual frame for thinking about the specification-code relationship, but the paper extracts no formal results from it. This is name-dropping in the sense that the correspondence is invoked for authority rather than for technical leverage, but it is honest name-dropping (the paper does not claim novel results from the correspondence).

## 3. Spec-Code Convergence: Correct but How Much Does It Matter?

**Rating: MINOR**

Theorem 2.1 is correct. The proof sketch is sound: for incompressible $P$, if $K(P \mid S) \leq c$, then $|S| \geq |P| - O(\log |P|)$. This follows directly from the chain rule for Kolmogorov complexity and Chaitin's incompleteness theorem. I have no objections to the mathematics.

The paper correctly acknowledges (in the subsequent remark) that the theorem applies to incompressible programs, and that most real programs are highly compressible. Hindle et al.'s result (code has lower cross-entropy than English prose) means that the vast majority of production code is far from incompressible. The theorem's "sharp design implication" (the harness designer must provide all the information) applies only to the novel, domain-specific tail of the code distribution.

This does not make the theorem irrelevant. It does mean that the paper's design principles should be more explicit about when the convergence theorem matters (novel business logic, proprietary algorithms, domain-specific rules) and when it does not (boilerplate, standard patterns, well-known algorithms). The paper's concrete example (proprietary pricing algorithm with 47 business rules) is well-chosen, but the design principles section does not consistently distinguish between the compressible and incompressible regimes.

The bimodal structure identified in the Information pillar (common patterns where the model's prior dominates versus novel logic where context is critical) is the correct engineering response to the convergence theorem. The paper should make this connection more explicit: the convergence theorem tells you that the bimodality is not an accident of current models but a fundamental information-theoretic property.

## 4. The Structural Enforcement Principle

**Rating: MAJOR (positive; the paper should go further)**

From a verification perspective, the structural enforcement principle is the paper's strongest and most important contribution. The result that instructional enforcement decays as $(1-\epsilon)^T$ while structural enforcement achieves compliance 1 is a clean, correct, and practically important result. The cross-pillar convergence (the same principle derived independently in four pillars) is compelling.

What a verification researcher wants to see, and what is missing:

(a) **A formal definition of "structural enforcement."** The paper gives examples (filesystem permissions, tool restrictions, output filtering, typed schemas) but never defines the concept precisely. In the verification literature, we would say: structural enforcement is enforcement via a safety property that is decidable and checkable at the mechanism level (the enforcement point), independent of the program being enforced. The paper's Layer 1 (structural gates) corresponds roughly to what we call "monitors" in runtime verification. The connection to runtime verification (Leucker and Schiller, 2009; Bartocci et al., 2018) is entirely absent.

(b) **A taxonomy of what can be structurally enforced.** The paper's decidability classification (7 decidable, 7 semi-decidable, 4 undecidable slop types) is a good start, but it conflates detection decidability with enforcement decidability. Some properties are decidable to detect but expensive to enforce structurally (e.g., "no function exceeds 500 lines" is trivially decidable but requires a pre-commit hook, which is structural enforcement at the repository level but not at the generation level). A finer taxonomy, distinguishing enforcement at generation time, at commit time, and at deployment time, would be more useful.

(c) **Connection to the enforcement lattice.** In runtime verification, there is a well-known hierarchy of enforceable properties: safety properties are enforceable by monitors that halt/suppress violating executions; some liveness properties are enforceable by edit automata that can buffer and reorder; and many hyperproperties are not enforceable at all. The paper's structural enforcement principle lives entirely in the safety property regime. Making this connection explicit would strengthen the formal foundation and clarify the limits of structural enforcement.

(d) **The composition problem.** The paper proves that assume-guarantee contracts compose correctly (Theorem 5.9). This is a solid result, and the proof sketch (via rely-guarantee reasoning) is correct. But the paper does not address the question: who verifies that the contracts are correct? If the contracts themselves are generated by LLMs (as they would be in a fully automated pipeline), the circular validation problem reappears at the contract level. This is the fundamental recursion problem of verified AI systems, and the paper should at least acknowledge it.

## 5. The Vericoding Pattern: 82% on Dafny Specs

**Rating: MAJOR**

The paper cites an 82% success rate for the "vericoding" pattern (human writes formal specification, AI generates implementation, formal verifier checks conformance) on Dafny benchmarks. From my experience with Lean 4 and Coq, I have several concerns.

First, 82% on Dafny benchmarks is plausible. Dafny has relatively strong automation (the Boogie/Z3 backend handles many proof obligations automatically), and Dafny specifications tend to be closer to imperative code than, say, Coq specifications. The result likely reflects Dafny's automation strength as much as the LLM's implementation ability.

Second, the result would not transfer to Coq or Lean 4 without significant degradation. Coq's proof language (Ltac/Ltac2) and Lean 4's tactic framework require substantially more structured reasoning than Dafny's annotation-based verification. My experience with LLM-assisted Lean 4 proofs suggests success rates closer to 30-50% for non-trivial specifications, and these are proofs, not implementations. For correct-by-construction development (where the specification constrains the implementation at every step), the success rate would be lower still.

Third, and most importantly, the 82% figure hides the distribution. In verification, the last 18% is where all the difficulty concentrates. Specifications that the LLM fails on are precisely the specifications where correctness matters most: complex invariants, subtle preconditions, non-obvious termination arguments. A system that succeeds on 82% of "easy" specifications and fails on 18% of "hard" ones is not 82% of a verification system; it is a system that handles the easy cases and fails exactly where you need it.

Fourth, the paper does not discuss proof repair. When the LLM generates incorrect code, how much human effort is required to fix it? In my experience with Lean 4, a wrong proof attempt can be harder to repair than starting from scratch, because the LLM's approach may be fundamentally misguided (wrong induction scheme, wrong generalization, wrong decomposition). The same likely applies to incorrect implementations: an 82% success rate with a 2x repair cost on failures could be worse than a 60% success rate with cheap failures.

The vericoding pattern is genuinely promising, but the paper presents it too optimistically. It should discuss the distribution of failures, the cost of repair, and the limits of transferability across verification frameworks.

## 6. Proof Quality: Which Are Sound, Which Hand-Wave?

### Sound proofs

- **Spec-Code Convergence (Theorem 2.1):** The proof sketch is correct. It follows directly from the chain rule for Kolmogorov complexity and basic properties of incompressible strings. A full formalization in Lean 4 would be straightforward (modulo the usual complexities of formalizing Kolmogorov complexity, which require fixing a universal Turing machine).

- **Compound Error Sensitivity (Theorem 4.1):** Trivially correct. $R = p^n$, elasticity $= n$. This is a one-line calculation.

- **Geometric Diminishing Returns (Theorem 4.4):** Correct. Standard geometric series argument.

- **Ratchet Convergence (Theorem 8.8):** Correct. Closure operators on finite lattices converge in at most $|\mathcal{R}|$ steps. This is a standard result (Knaster-Tarski, or direct argument from monotonicity and finite height).

- **Ossification Risk (Theorem 8.9):** Correct and nicely observed. The interplay between the additive ratchet and contradictory rules is a genuine design concern.

### Proof sketches that hand-wave

- **Submodularity of the context relevance function (Section 3):** The proof sketch gives sufficient conditions for submodularity but does not verify that these conditions hold for LLM-mediated code generation. Condition (a) (conditional independence of codebase units) is clearly false for real codebases. Condition (b) (joint Gaussianity) is unrealistic for discrete code representations. The paper acknowledges that code dependencies break submodularity and invokes the submodularity ratio, but the gap between theory and practice is larger than acknowledged. MINOR.

- **Optimal Checkpoint Count (Theorem 4.3):** The proof sketch uses convexity of the segment cost $g(L)$ and Schur-convexity to derive the equal-length partition. The convexity argument is correct for the stated range ($L < 2/\mu$ where $\mu = -\ln p$), which covers practical pipelines. The connection to the Young-Daly formula is a nice analogy but the correspondence is structural, not exact; the discrete nature of agent pipelines and the imperfect detection ($v < 1$) introduce complications that the proof sketch glosses over. MINOR.

- **Governance Capacity Bound (Proposition 8.3):** This is explicitly presented as a "structural analogy" to Shannon's noisy channel coding theorem, which is the right framing. The paper correctly notes that the governance channel lacks stationary transition probabilities and a finite input alphabet. But calling it a "proposition" is generous; it is a design heuristic dressed in information-theoretic language. A genuine application of the channel coding theorem would require defining the channel precisely, which the paper does not do. MAJOR.

- **Governance Bifurcation (Theorem 8.10):** The dynamical systems analysis is correct in its own terms. The transcritical bifurcation at $\mu G / \gamma R = 1$ follows from standard ODE analysis. But the ODE model itself is a strong idealization: it assumes continuous dynamics for what is fundamentally a discrete, stochastic process (individual code commits with discrete quality levels). The qualitative prediction (threshold behavior between self-correction and collapse) is plausible, but the specific bifurcation analysis is more suggestive than rigorous. MINOR.

- **Contract Composition (Theorem 5.9):** The rely-guarantee proof sketch is correct in structure, and the disjointness + interface preservation argument is standard. The caveat about dynamically-typed languages (the guarantee weakens) is appropriate. The claim about "sound separate compilation" for Rust, Java, and Go is correct for Rust and Java but more nuanced for Go (Go's compilation model handles separate compilation but its interface checking is structural, not nominal, which introduces subtleties the paper elides). MINOR.

### Proofs that need full formalization

- **The Abstraction Gap Decomposition (Theorem 3.1):** This is the Shannon chain rule applied twice, which is trivially correct for well-defined random variables. But the random variables here ($P$, $S$, $C$, $\theta$) are not precisely defined. What is the probability space? What distribution is $\theta$ drawn from? Is $\theta$ a random variable or a fixed parameter? The paper treats it both ways. For a formal treatment, this needs to be pinned down. MAJOR.

- **The Detection Ceiling (Theorem 7.6):** The application of the data processing inequality is correct in principle, but the bound $d_{\ell,j} \leq I(X; D_j)/H(D_j)$ requires careful interpretation. The detection rate $d_{\ell,j}$ is a frequentist quantity (fraction of true positives); the bound is information-theoretic. The connection requires Fano's inequality or a similar bridge result, which the proof sketch omits. MINOR.

## 7. What Formal Methods Could Contribute

If I were to collaborate with the authors, I would focus on three areas.

**First: a formalization of the structural enforcement boundary in a proof assistant.** The structural enforcement principle is the paper's most important result for verification. A Lean 4 formalization would make the result precise: define a language of enforcement mechanisms, define the property classes they can enforce, and prove that structural enforcement achieves compliance 1 for decidable properties while instructional enforcement has compliance bounded by $(1-\epsilon)^T$. This would require defining what "structural enforcement" means formally (probably as a safety monitor in the runtime verification sense) and proving that the monitor correctly enforces the property. The formalization would also clarify the scope: what properties can be structurally enforced, and what cannot?

**Second: verified contract composition for multi-agent systems.** The assume-guarantee composition theorem (Theorem 5.9) is the paper's closest approach to a genuinely useful formal verification result. A full formalization would:
- Define agent contracts in a dependently-typed language (Lean 4 or Coq)
- Prove that disjoint write sets + interface preservation imply safe composition
- Generate runnable contract checkers from the formalization (extraction in Coq, code generation in Lean 4)
- Address the "who verifies the contracts?" recursion by defining a contract specification language simple enough to be human-reviewable

This is a concrete, achievable research project that would produce both theoretical and practical contributions.

**Third: a formal treatment of the accretion category.** The paper's Accretion Category (Definition 7.8) is genuinely novel and important. But the current definition is informal: "functionally correct, superfluous, individually defensible, collectively harmful." Each of these predicates needs formal definition. "Functionally correct" is relatively easy (all tests pass, or, more formally, the program refines the specification). "Superfluous" is harder (there exists a smaller change satisfying the same requirement, which is indeed undecidable in general, as the paper notes). "Collectively harmful" requires a formal notion of codebase health, which the paper approximates via codebase entropy but does not fully develop.

A formal methods approach would define a codebase health lattice, prove that accretion is monotonically decreasing in this lattice, and characterize the decidability boundary for accretion detection at various approximation levels. This would ground the paper's claim that "individual accretion detection is undecidable; aggregate detection is feasible" in precise computability-theoretic terms.

**Additional opportunities:**

- The refinement lattice and Galois connection tower could be connected to existing formalized libraries (e.g., mathlib's order theory in Lean 4) to derive concrete refinement conditions for LLM-mediated specification descent.
- The decidability classification of slop types could be made precise via Rice's theorem and its extensions (the paper invokes Rice's theorem but does not give a formal reduction for each undecidable type).
- Session types or behavioral types could formalize the agent coordination contracts more precisely than the current assume-guarantee framework, capturing the temporal ordering of agent interactions.

---

## Issue Summary

| # | Issue | Severity | Section |
|---|-------|----------|---------|
| 1 | Kolmogorov complexity used for finite, concrete reasoning where the additive constant matters | MAJOR | 2 (Abstraction) |
| 2 | Shannon operationalization ties "abstraction gap" to model capabilities without flagging the conceptual shift | MAJOR | 2, 3 |
| 3 | Curry-Howard-Lambek invoked for framing but yields no derived results | MINOR | 2.6 |
| 4 | Spec-Code Convergence correct but relevance to typical (compressible) code underexplored in design principles | MINOR | 2.3 |
| 5 | Structural enforcement lacks formal definition; no connection to runtime verification literature | MAJOR | 3, 4, 7 |
| 6 | Vericoding 82% figure presented without distributional analysis, repair cost, or framework transferability | MAJOR | 13 (Contrarian), Principles |
| 7 | Governance capacity bound is a heuristic dressed as a proposition; the "channel" is not formally defined | MAJOR | 8 |
| 8 | Abstraction gap decomposition (Theorem 3.1) uses random variables without specifying the probability space | MAJOR | 3 |
| 9 | Contract composition proof correct but does not address recursive verification of contracts | MINOR | 5 |
| 10 | Submodularity conditions for context relevance not verified for actual LLM-mediated generation | MINOR | 3 |
| 11 | Bifurcation analysis assumes continuous ODE dynamics for discrete stochastic process | MINOR | 8 |
| 12 | No connection to runtime verification, monitor synthesis, or enforceable property hierarchies | MAJOR | Throughout |

No FATAL issues. The paper does not make false mathematical claims; its issues are of imprecision, incomplete formalization, and overselling of analogy as theorem.

---

## Verdict: What Kind of Paper Is This?

This is not a formal methods paper. It does not prove theorems in the sense that a POPL, LICS, or ITP paper would require. Its "proof sketches" range from one-line calculations (compound error sensitivity) to structural analogies (governance capacity bound). None would survive a formalization attempt without substantial additional work.

This is not a standard software engineering paper either. It is too theoretical for ICSE or FSE, where reviewers would demand controlled experiments, and the empirical verification roadmap is admirably honest about the absence of such experiments.

What it is: a **foundational architecture paper** in the mold of Perry and Wolf (1992) or Shaw and Garlan (1996), updated for the AI agent era and enriched with information-theoretic machinery. It proposes a vocabulary, a decomposition, and a set of conjectures. Some of these conjectures are dressed as theorems (the governance capacity bound), which is a weakness. But the vocabulary is useful, the decomposition is productive, and several of the results (structural enforcement, compound error sensitivity, the accretion category) are genuine contributions that the formal methods community should engage with.

**Where it belongs:** A venue like IEEE TSE, ACM TOSEM, or ESEC/FSE (as a "new ideas" or "visions" paper). It could also work as an extended version in a journal like CACM or IEEE Software, where the audience appreciates broad frameworks over narrow theorems. It does not belong at a formal methods venue (FM, CAV, POPL) in its current form, but pieces of it (the structural enforcement formalization, the contract composition, the accretion decidability analysis) could become formal methods papers with substantial additional work.

I would encourage the authors to pursue the formalization path for the structural enforcement principle specifically. That result is correct, important, practically relevant, and amenable to mechanized verification. It is also the result most likely to survive contact with real systems. A Lean 4 formalization of the enforcement boundary, connected to the runtime verification literature, would be a genuine contribution to both the formal methods and software engineering communities.

---

**Overall assessment:** Accept with major revisions. The framework is valuable and the intellectual ambition is laudable. The paper should (a) be more precise about the limits of its formal claims, (b) connect to the runtime verification literature, (c) present the vericoding results with appropriate caveats, and (d) either formalize the governance capacity bound properly or downgrade it from "proposition" to "design heuristic."
