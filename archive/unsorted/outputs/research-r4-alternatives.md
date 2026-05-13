# R4: Alternative Paradigms — The Third Way

## Executive Summary

Between the two poles of the abstraction debate — Dijkstra's insistence on formal languages and the LLM community's embrace of natural language — lies a rich landscape of intermediate representations. These "third way" approaches share a common insight: the hard problem is not coding but *thinking precisely about what a system should do*. This report surveys formal specification languages, type-theoretic approaches, behavioral specifications, visual formalisms, and emerging AI-era hybrids. It then synthesizes expert views on where the abstraction boundary should sit and examines why formal methods have not gone mainstream — and whether AI might finally change that.

The central finding is that **AI does not eliminate the need for precision; it shifts who (or what) bears the cost of producing it.** The most promising harness architectures will likely combine human-authored specifications at intermediate abstraction levels with AI-driven implementation and verification — a pattern already emerging under the name "vericoding."

---

## 1. Formal Specification Languages

### 1.1 TLA+ and Lamport's Vision

**Core thesis.** Leslie Lamport's career-spanning argument is that *thinking above the code* is the essential discipline of programming. In his Microsoft Research talk "Thinking Above the Code," Lamport distinguishes three sub-tasks: (1) deciding *what* the program should do, (2) deciding *how* it should do it (the algorithm), and (3) encoding the algorithm in a programming language. He argues that most bugs and design failures originate in tasks (1) and (2), yet the profession obsesses over task (3).

**TLA+ as the right level.** TLA+ (Temporal Logic of Actions) is Lamport's answer: a mathematical language for writing down the ideas that go into a program *before* any coding begins. It uses set theory, predicate logic, and temporal operators to describe system behavior at the algorithm level. Crucially, Lamport resists making TLA+ more like a programming language — in "The Future of TLA+" (July 2024, co-authored with Stephan Merz and Chris Newcombe), he argues that the most common user requests to make TLA+ "more like a programming language" are a *hindrance*, not a help. The point is to think differently from how one codes.

**Critique of informal specs.** Lamport illustrates the problem with informal specifications through personal experience: when asked to write up a correctness check informally using "informal English, a little math," he found that "the more I started writing, the more tricky I realized it was. And I decided that I needed to write a TLA+ specification of it." The issue is that natural language hides ambiguity; formal language forces confrontation with it.

**Critique of code-level thinking.** In a Quanta Magazine interview (2022), Lamport stated: "the problem is thinking programmatically, as expressed in what I'm now calling coding languages, instead of thinking outside of that box. And the way to think outside of that box is to think mathematically." He explicitly frames this as the *hardest* part of engineering — "I don't know how to teach you about abstraction" — while the coding itself is mechanical.

**Industrial adoption.** The landmark success story is AWS. Chris Newcombe et al. published "How Amazon Web Services Uses Formal Methods" (CACM, April 2015), reporting that seven teams used TLA+ and all found high value. The model checker discovered subtle bugs in DynamoDB that no other technique could have found — the shortest error trace exhibiting one data-loss bug included 35 high-level steps. Since then, TLA+ has spread within AWS and to other organizations including Microsoft, Intel, and Elastic.

**Relevance to harness design.** Lamport's vision implies that the ideal human-AI interface is *not* natural language and *not* code — it is a formal specification at the algorithm level. A harness implementing this vision would accept TLA+-level specs from humans and delegate implementation to AI.

### 1.2 Alloy and Jackson's "Lightweight Formal Methods"

**The Alloy philosophy.** Daniel Jackson's Alloy language, described in *Software Abstractions: Logic, Language, and Analysis* (MIT Press, revised 2012), represents the "lightweight formal methods" movement. The key insight: replace conventional analysis based on theorem proving with **fully automated analysis** that gives designers immediate feedback. Alloy explores a finite but enormous space of cases (billions or more) using SAT/SMT solvers rather than requiring complete proofs.

**Sufficient formalism.** Jackson's approach takes from formal specification the idea of a precise and expressive notation based on a tiny core of simple and robust concepts, but it accepts incompleteness in exchange for usability. This "agile modeling" philosophy trades the guarantee of full correctness for the practical benefit of catching most bugs with minimal overhead.

**Why this matters.** Alloy demonstrates that formal methods need not be all-or-nothing. The question for harness design is not "full formalism or none?" but "what level of formalism yields the best cost-benefit ratio?" Alloy's answer — automated model checking over bounded instances — is directly analogous to how property-based testing works, suggesting a practical middle ground.

### 1.3 Z Notation and VDM — Lessons from Failure

**What they were.** Z notation (developed at Oxford) and VDM (Vienna Development Method) were classical formal specification languages from the 1970s-80s that used set theory and predicate logic to specify software systems before implementation.

**Why they failed to gain mainstream adoption:**
- **Mathematical complexity:** Both required extensive mathematical training. The learning curve was steep enough that only safety-critical domains (aerospace, nuclear, medical) found the investment worthwhile.
- **Cost-effectiveness:** Stepwise refinement required rewriting specifications repeatedly, and proving each refinement step valid consumed enormous time.
- **Tool limitations:** Z notation could not generate code directly (unlike B and VDM), reducing its practical utility for developers.
- **Technical gaps:** Z could not handle concurrency, timing, or algorithmic constraints — exactly the properties modern distributed systems need to specify.
- **Cultural mismatch:** Most software development processes are incompatible with writing complete formal specifications upfront — if design and development happen iteratively, heavyweight formal methods do not apply.

**The lesson.** Z and VDM proved that *correctness is not enough* — a specification approach must also be practical, incremental, and compatible with how software is actually built. This lesson directly informed the lightweight formal methods movement.

### 1.4 Quint — Modern Executable Specification

**What it is.** Quint, developed by Informal Systems, is an executable specification language inspired by TLA+ but with a TypeScript-influenced syntax designed for usability. It is based on the Temporal Logic of Actions (TLA) but provides an alternative surface syntax that aims to be more approachable to working engineers.

**Key features:**
- **Minimal and regular syntax** — easier target for developer tooling and static analysis than TLA+.
- **Non-determinism and temporal formulas** — extends standard programming with constructs for specifying protocol environments (networks, faults, time).
- **Model checking** — automatically explores all possible system states to detect bugs, race conditions, and invariant violations before deployment.
- **Simulation and testing** — randomized simulations of specifications.
- **TLA+ interoperability** — can transpile to TLA+ for use with the TLC model checker.

**Significance for harness design.** Quint represents the cutting edge of making formal specification accessible to mainstream developers. Its TypeScript-like syntax deliberately lowers the barrier to entry while preserving formal semantics. This is exactly the kind of "intermediate representation" that a harness might target — formal enough for verification, readable enough for human authoring.

---

## 2. Type-Theoretic Approaches

### 2.1 Dependent Types: Types as Specifications

**The core idea.** In languages with dependent types (Agda, Idris, Lean, Coq/Rocq), types can refer to *values*, allowing the type system to express arbitrarily precise properties. A function's type signature can specify not just "takes a list, returns a list" but "takes a list of length n, returns a sorted list of length n." The type checker then verifies these properties at compile time.

**Edwin Brady's vision — Type-Driven Development.** Edwin Brady, creator of Idris, articulated a development methodology where types are the *primary* design artifact. In *Type-Driven Development with Idris* (Manning, 2017), Brady argues that types serve as "built-in documentation the compiler can use to check data relationships." The workflow is:
1. Write the type (specification) first.
2. Let the type checker guide implementation through interactive development.
3. Refine types to capture more properties as understanding deepens.

This approach collapses the distinction between specification and implementation — the type *is* the specification, and a program that type-checks *is* a proof of conformance.

**Idris 2.** Idris 2, implemented in itself, pushes dependent types further with quantitative type theory, which tracks not just *what* values flow through a program but *how many times* they are used — enabling linear types alongside dependent types and opening the door to resource-safe systems programming.

### 2.2 Lean 4 and the AI Revolution in Formal Mathematics

**Current state.** Lean 4, developed by Leonardo de Moura at Microsoft Research, has become the focal point of AI-assisted formal verification. As of May 2025, the Lean mathematical library (mathlib) had formalized over 210,000 theorems and 100,000 definitions.

**AI breakthroughs:**
- **AlphaProof (DeepMind, 2024):** Proved mathematical statements in Lean 4 at roughly IMO silver-medal level.
- **Multiple systems (2025):** Achieved gold-medal equivalent performance with formally verified Lean 4 proofs at IMO 2025.
- **DeepSeek-Prover-V2 (2025):** An open-source 671B parameter model that achieved 88.9% pass rate on the MiniF2F-test benchmark.
- **Harmonic AI:** Raised $100M to build "hallucination-free" AI using Lean 4 as a backbone. Their system Aristotle generates Lean 4 proofs and formally verifies them before responding.

**Industrial use.** AWS uses Lean for verification-guided development of Cedar, their authorization policy language, creating executable models and proving security properties.

**Significance.** Lean 4 demonstrates that the boundary between specification and proof is dissolving. AI can now traverse it in both directions — generating proofs from specifications and generating specifications from informal descriptions. This is the most concrete evidence that AI might make formal methods mainstream.

### 2.3 Refinement Types: Lightweight Dependent Types

**LiquidHaskell.** Refinement types decorate ordinary types with logical predicates — e.g., `{v:Int | v > 0}` for positive integers. LiquidHaskell, developed at UC San Diego, has been used to specify and verify properties of over 10,000 lines of Haskell code from popular libraries including containers, bytestring, text, and xmonad.

**Key advantage.** Verification is automated via SMT solvers (typically Z3), requiring no manual proof writing. LiquidHaskell proves 96% of recursive functions terminating while requiring only 1.7 lines of termination annotations per 100 lines of code. This is "sufficient formalism" at the type level — more precise than Haskell's standard types but far less onerous than full dependent types.

**Advanced capabilities.** Refinement Reflection enables equational reasoning, and has been used to verify that instances of Monoid, Applicative, Functor, and Monad typeclasses satisfy key algebraic laws. Proof by Logical Evaluation uses techniques from model checking and abstract interpretation to automate this reasoning.

### 2.4 Session Types: Specifying Communication Protocols

**What they are.** Session types are type-theoretic specifications of communication protocols in concurrent or distributed systems. A session type describes the sequence of messages sent or received from the perspective of one participant, including the types and order of messages exchanged.

**Practical application.** Recent research has applied multiparty session types (MPST) to implement the TCP protocol, with an MPST-based implementation of a subset of a TCP server in Rust tested for interoperability against the Linux TCP stack. This demonstrates that protocol specifications can be embedded directly in types and verified statically.

**Relevance.** Session types are particularly relevant for harness design because harnesses mediate communication between human intent, AI agents, and execution environments — exactly the kind of multi-party protocol that session types formalize.

### 2.5 The Curry-Howard Correspondence

**The deep connection.** Philip Wadler's influential paper "Propositions as Types" (2015, CACM) describes the fundamental correspondence: types correspond to logical formulas, programs correspond to proofs, and evaluation corresponds to proof simplification. This is not merely an analogy — it is a mathematical isomorphism discovered independently by Curry (1934), Howard (1969), and implicit in Gentzen's work (1935).

**Practical implications.** The correspondence means that:
- Writing a well-typed program in a sufficiently rich type system is *literally* constructing a proof.
- A specification expressed as a type is automatically verified by any program that inhabits it.
- The distinction between "specification language" and "programming language" dissolves at the theoretical level.

**What this means for the abstraction debate.** Curry-Howard suggests that the "right level" of abstraction might not be a separate specification language at all, but rather a type system rich enough to express specifications directly within the programming language. This is the vision that dependent types, refinement types, and session types all pursue.

---

## 3. Behavioral Specification

### 3.1 BDD / Gherkin (Dan North)

**Origins.** Behavior-Driven Development (BDD) began, in Dan North's words, "as an NLP exercise to stem the abuse of the word 'test' in TDD." In 2007, North introduced the Gherkin language, a structured natural language format for specifying software behavior.

**The Given-When-Then format.** Developed by Daniel Terhorst-North and Chris Matts:
- **Given** — the preconditions (state of the world before the behavior).
- **When** — the behavior being specified.
- **Then** — the expected changes resulting from the behavior.

**Is this the sweet spot?** Gherkin occupies a distinctive position in the abstraction spectrum:
- More formal than prose — it enforces structure and can be executed by test frameworks (Cucumber, Behave).
- More readable than code — non-technical stakeholders can read and write scenarios.
- Less formal than TLA+ — it cannot express temporal properties, invariants, or unbounded behaviors.

**Limitations.** Gherkin specifications are fundamentally example-based — they describe specific scenarios rather than universal properties. This means they share the incompleteness of testing: they can show the presence of bugs but not their absence. The formalism is "just enough" for acceptance criteria but insufficient for systems-level reasoning.

**Relevance to harness design.** Gherkin-like structured natural language is the most likely interface between non-technical stakeholders and AI coding systems. A harness might accept Given-When-Then specifications and translate them into both code and property-based tests.

### 3.2 Design by Contract (Bertrand Meyer)

**The approach.** Bertrand Meyer's Design by Contract (DbC), introduced in the Eiffel programming language, specifies software behavior through three mechanisms:
- **Preconditions** — what must be true before a function executes (the client's obligation).
- **Postconditions** — what the function guarantees after execution.
- **Class invariants** — properties that must hold for every instance at all observable points.

**The contract metaphor.** DbC uses the metaphor of a business contract: each party (caller and callee) has obligations and benefits. The precondition is the caller's obligation (and the callee's benefit), while the postcondition is the callee's obligation (and the caller's benefit).

**Meyer's position on the abstraction spectrum.** Meyer has consistently argued that contracts are the right intermediate formalism because they:
- Are embedded in the code (not in a separate specification document that can become stale).
- Are executable (contracts are checked at runtime in Eiffel).
- Are local (each contract specifies a single module boundary, not the whole system).
- Bridge specification and testing (contracts subsume assertions and can generate tests).

**Influence.** DbC has influenced code contracts in .NET, Java assertions, Python's `assert` statements, and Rust's `debug_assert!`. More fundamentally, it established the principle that specification should be *co-located with code* rather than maintained separately.

### 3.3 Property-Based Testing (QuickCheck, Hypothesis)

**The paradigm shift.** Property-based testing (PBT), pioneered by QuickCheck (Haskell, Claessen and Hughes, 2000) and popularized in Python by Hypothesis (MacIver, 2015), replaces example-based testing with property-based testing:
- **Examples** say: "Given input [3,1,2], sort returns [1,2,3]."
- **Properties** say: "For any list xs, sort(xs) is sorted AND contains the same elements as xs."

**Properties as executable specifications.** Properties are effectively formal specifications that are checked by random testing rather than proof. They begin with "for any" (universal quantification), making them structurally identical to logical propositions. The key innovation is *shrinking* — when a failing input is found, the framework automatically simplifies it to the minimal failing case.

**The specification bridge.** PBT occupies a unique position: it uses the *language of formal specification* (universal properties over domains) but the *mechanism of testing* (sampling rather than exhaustive proof). This makes it dramatically more accessible than theorem proving while capturing more design intent than example-based tests.

**Adoption.** PBT has achieved meaningful industry adoption — far more than theorem proving or model checking. QuickCheck has been used at Ericsson for telecom testing, and Hypothesis is widely used in Python open-source projects. This suggests that the "right" level of formalism for most developers is property-level, not proof-level.

### 3.4 Executable Specifications

**The idea.** Executable specifications are documents that describe system behavior in a way that is both human-readable and machine-executable, serving as a single source of truth. The key benefit: when specification *is* the test, they cannot diverge.

**Approaches:**
- **BDD/Gherkin** — human-readable scenarios that are wired to test code (the most common approach).
- **Concordion / FIT** — specification documents with embedded test data.
- **Literate programming** (Knuth) — code embedded in prose documentation.
- **Runnable specifications** (Eric Normand) — high-level descriptions written in a language that can be directly executed, avoiding translation to a lower-level representation.

**The divergence problem.** The deepest argument for executable specifications is that separate specifications and implementations inevitably diverge. As Eric Normand puts it: "With runnable specifications you avoid this problem of maintaining separate specifications and code implementations that can diverge from each other."

---

## 4. Visual Formalisms

### 4.1 Statecharts (David Harel)

**The invention.** David Harel introduced statecharts in 1987 as a "visual formalism for complex systems." His key insight was that conventional state-transition diagrams, while intuitive, fail to scale — they suffer from exponential state explosion in complex systems.

**Three key extensions.** Statecharts extend conventional state diagrams with:
1. **Hierarchy** (depth) — states can contain sub-states, enabling abstraction.
2. **Orthogonality** (concurrency) — parallel regions can execute simultaneously.
3. **Broadcast communication** — regions can synchronize via events.

**Harel's argument for visual formalism.** Harel's fundamental claim is that visual representations can be *fully formal* — they are "full-fledged visual formalisms, complete with rigorous semantics," not mere informal sketches. When coupled with computerized graphics, statecharts enable viewing descriptions at different levels of detail, making "even very large specifications manageable and comprehensible."

**Recognition.** Statecharts won the Stevens Award in Software Development Methods (1996) and the first Israel Prime Minister's Prize for Software (1997). They were incorporated into UML as state machine diagrams and continue to be used in reactive systems design (notably via the XState library in JavaScript/TypeScript).

**Modern relevance.** Statecharts are experiencing a renaissance in UI development through XState, which provides a formal state machine framework for JavaScript. This demonstrates that visual formal methods can achieve mainstream adoption when embedded in practical tooling.

### 4.2 Petri Nets

**Formal models of concurrency.** Petri nets, invented by Carl Adam Petri in 1962, are directed bipartite graphs with two types of elements (places and transitions) that model concurrent, asynchronous, distributed, and nondeterministic systems.

**Visual formalism with mathematical rigor.** Unlike informal flow charts, Petri nets have exact mathematical definitions of their execution semantics and a well-developed theory for process analysis. They can be used as a visual communication aid while simultaneously serving as a formal model amenable to automated analysis.

**Practical applications.** Petri nets have been successfully applied in performance evaluation, communication protocols, distributed software systems, manufacturing control, and workflow management. Colored Petri Nets (CPN) extend the basic formalism with data types, providing a richer graphical language for modeling concurrent systems.

**Limitations.** While theoretically powerful, Petri nets suffer from the same adoption barriers as other formal methods — they require specialized knowledge and tooling, and their visual notation becomes unwieldy for large systems despite theoretical composability.

### 4.3 Category Theory Diagrams (Bartosz Milewski)

**Category theory as programming foundation.** Bartosz Milewski's *Category Theory for Programmers* (freely available online and as a book) argues that category theory provides the mathematical language to talk about *structure* in software. Key concepts — functors, natural transformations, monads, adjunctions — map directly to programming patterns.

**The visual dimension.** Milewski emphasizes visual reasoning: "I am very visual and I like pictures." Category theory is inherently diagrammatic — commutative diagrams express relationships between mathematical objects in a way that is simultaneously visual and fully formal. String diagrams, a category-theoretic visual language, have been proposed as a foundation for compositional reasoning about programs.

**Practical impact.** While category theory itself remains niche, its concepts have deeply influenced Haskell's design (monads, functors, applicatives) and are increasingly visible in Scala, Kotlin, and even TypeScript through libraries like fp-ts. The visual/diagrammatic tradition of category theory suggests that formal specification need not be purely textual.

---

## 5. AI-Era Hybrid Approaches

### 5.1 Structured Prompting as Proto-Specification

**Structured Chain-of-Thought (SCoT).** Recent research proposes SCoT prompting, which constructs intermediate reasoning steps using programming structures (sequential, branch, loop). The LLM first generates an SCoT — essentially a structured pseudocode plan — then produces the final code. This mirrors how human developers benefit from structured programming, and the SCoT artifact is effectively an intermediate representation between natural language and code.

**Structured outputs.** Modern LLMs (GPT-5.2, Claude) can return structured data in JSON format, and prompt engineering increasingly involves defining schemas, roles, and constraints — moving beyond "just describe what you want" toward "specify the structure of what you want." This trend represents an emergent, informal convergence toward specification-like interfaces for AI.

**Implication for harness design.** The most effective AI coding interfaces are already evolving toward structured intermediate representations. The question is whether these will remain ad hoc (schema-per-task) or converge on reusable specification formalisms.

### 5.2 Spec-Then-Verify: The Vericoding Pattern

**The concept.** "Vericoding," coined in a September 2025 paper presented at POPL 2026, describes using LLMs to generate formally verified code from formal specifications. This contrasts with "vibe coding," which generates potentially buggy code from natural language descriptions.

**The VeriCoding Benchmark.** The benchmark contains 12,504 formal specifications across three languages:
- **Dafny:** 3,029 specifications, 82% success rate with off-the-shelf LLMs (up from 68% to 96% over the past year).
- **Verus/Rust:** 2,334 specifications, 44% success rate.
- **Lean:** 7,141 specifications, 27% success rate.

**The workflow.** The vericoding workflow is:
1. Human writes formal specification (preconditions, postconditions, invariants).
2. LLM generates implementation code.
3. Formal verifier checks that the code satisfies the specification.
4. If verification fails, LLM iterates on the implementation.

**Significance.** Vericoding represents the most concrete realization of the "third way" — humans specify, AI implements, formal tools verify. The 82% success rate on Dafny demonstrates this is not speculative but practically achievable today.

### 5.3 Martin Kleppmann's Prediction: AI Makes Formal Verification Mainstream

**The argument.** In a widely-discussed December 2025 blog post, Martin Kleppmann (author of *Designing Data-Intensive Applications*) predicted that AI will bring formal verification into the software engineering mainstream. Three converging factors:

1. **Cost reduction.** AI-generated proofs demolish the economic barrier that made formal verification unviable. The seL4 microkernel required 20 person-years for 8,700 lines of C — AI could collapse this cost by orders of magnitude.

2. **New necessity.** AI-generated code *needs* formal verification because human review cannot scale to the volume of code AI produces. As Kleppmann notes: "it doesn't matter if they hallucinate nonsense" in proof attempts — the proof checker catches invalid proofs, while valid proofs provide genuine guarantees.

3. **Inherent compatibility.** Proof checkers are small, verified codebases that provide an ideal oracle for validating LLM outputs. The probabilistic nature of LLMs is neutralized by the deterministic nature of proof checking.

**The vision.** Kleppmann envisions developers "specifying in a high-level, declarative way the properties that we want" and letting AI handle both implementation and proof. This mirrors how "we don't bother looking at the machine code generated by a compiler" — the formal guarantee replaces human inspection.

### 5.4 Ben Congdon: The Coming Need for Formal Specification

**The bottleneck shift.** Ben Congdon (December 2025) argues that as AI reduces the cost of code generation, the bottleneck shifts to verification and maintenance. His proposed future stack:
1. High-level English specification.
2. TLA+ models at various component levels.
3. Formal proofs (using Rocq/Coq) for load-bearing components.
4. LLM audits for remaining components against specs.

**The expertise gap.** Congdon identifies the critical obstacle: formal verification expertise is vanishingly rare — "probably fit every TLA+ expert in the world in a large schoolbus." Without broader education in formal methods (ideally in undergraduate CS curricula), AI-generated formal specs remain unverifiable by most practitioners.

**The multi-level abstraction argument.** Congdon argues that code alone is insufficient for reasoning about large systems, drawing an analogy: "modeling all the individual molecules of a car" doesn't effectively predict braking distance. Systems need multiple levels of abstraction — maps at different scales that remain consistent with reality. Formal specifications provide these higher-level maps.

### 5.5 Intent-Based Programming

**The research direction.** Intent-based programming seeks to capture programmer intent at a level higher than code — what the programmer *wants to achieve* rather than *how to achieve it*. This is related to but distinct from natural language programming: intent specifications may use structured, constrained formats rather than free prose.

**Current manifestations:**
- **GitHub Copilot Workspace** and similar tools that take issue descriptions and produce implementation plans before code.
- **Structured Chain-of-Thought** prompting that generates algorithmic plans before implementations.
- **Constraint-based systems** where users specify what properties the output should have, and AI searches for satisfying implementations.

**The gap.** Intent-based programming currently lacks a standard formalism. The intent is typically expressed in natural language (with all its ambiguities) or in code (with all its implementation detail). The "third way" approaches in this report — specification languages, rich type systems, property-based specifications — all represent potential formalisms for capturing intent.

---

## 6. Expert Views on the Right Abstraction Level

### 6.1 Leslie Lamport: Specification as a Separate Discipline

Lamport's position is the most uncompromising: the right level of abstraction is mathematical specification, and it is a *separate discipline* from programming. "The hardest part of writing a specification is choosing the proper abstraction," he acknowledges, and this is a skill learned through experience, not taught through syntax.

Lamport critiques both poles: informal specifications hide ambiguity and breed bugs, while code-level thinking traps engineers in implementation details when they should be reasoning about algorithms. TLA+ is his proposed solution — a language for expressing ideas "in a completely rigorous fashion" while remaining above the code level.

**For harness design:** Lamport's view suggests a harness should enforce a specification-first workflow where implementation cannot begin until a formal spec exists.

### 6.2 Daniel Jackson: Concept Design as the Right Abstraction Level

In *The Essence of Software* (Princeton, 2021), Jackson proposes **concepts** as the fundamental unit of software design. A concept is a "nano-service" — a small, free-standing behavioral protocol that provides coherent value and composes with other concepts without mutual dependence.

Jackson's key argument is that software success depends on compelling usage scenarios, and the right abstraction level is *concept design* — identifying which concepts a system needs, how they compose, and what their operational principles are. This is higher than code (concepts are language-independent) but lower than informal requirements (concepts have precise behavioral definitions).

**For harness design:** Jackson's framework suggests that the interface between human and AI should be at the concept level — humans identify and compose concepts, AI implements them. This aligns with the emerging pattern of "product specifications" that describe what, not how.

### 6.3 Bertrand Meyer: Contracts as the Middle Ground

Meyer's Design by Contract places the specification boundary *at module interfaces* — not at the system level (too abstract to verify locally) and not at the statement level (too detailed to communicate intent). Preconditions and postconditions capture exactly what a module promises and expects, embedded directly in code.

Meyer has consistently argued that this co-location of specification and implementation is essential — separate specification documents inevitably diverge from code. Contracts are "just enough" formalism: they are executable, local, and compositional.

**For harness design:** DbC-style contracts are the most practical intermediate representation for AI coding — they can be written by humans at module boundaries and verified by AI-generated implementations. This is essentially what Dafny does, and the 82% vericoding success rate on Dafny supports Meyer's intuition.

### 6.4 David Harel: Visual Formalisms

Harel's argument is that visual representations can achieve full formal rigor while being more cognitively accessible than textual notations. Statecharts demonstrate this: they are simultaneously pictures (intuitive) and formal objects (with rigorous semantics that support model checking).

Harel's vision challenges the assumption that formalism requires text. For reactive systems (UIs, protocols, embedded systems), visual state machines may be the most natural specification medium.

**For harness design:** A harness for reactive system development might accept statechart diagrams as input specifications, with AI implementing the transition logic. XState in the JavaScript ecosystem already approximates this pattern.

### 6.5 Edwin Brady: Types as the Bridge

Brady's type-driven development makes the type signature the primary specification artifact. The workflow — write the type, let the type checker guide implementation, refine types as understanding deepens — collapses the spec-implementation gap entirely.

Brady's vision is that the compiler should be a *collaborator*: given a sufficiently precise type, it can narrow the space of valid implementations, suggest case splits, and verify completeness. This is remarkably similar to how AI coding assistants work, suggesting that dependent types might be the natural formal interface for AI-assisted development.

**For harness design:** A harness based on dependent types would have humans write rich type signatures and AI fill in implementations that the type checker guarantees correct.

### 6.6 Robert Harper: Types as Organizing Principle

Harper's *Practical Foundations for Programming Languages* (Cambridge, 2012, 2016) establishes types as the "central organizing principle of the theory of programming languages." In Harper's framework, a language feature is completely defined by its *statics* (type rules governing use) and its *dynamics* (evaluation rules governing execution). Soundness — the absence of ill-defined programs — follows naturally from this dual definition.

Harper's contribution to the abstraction debate is the insistence that *types are not decorations on programs but the fundamental organizing structure*. This means that making types more expressive (dependent types, refinement types, session types) is not an add-on but the natural evolution of the specification-implementation relationship.

### 6.7 Philip Wadler: Propositions as Types

Wadler's account of the Curry-Howard correspondence — that types are propositions, programs are proofs, and evaluation is proof simplification — reveals that the spec-code distinction is, at a deep mathematical level, an illusion. Writing a program in a sufficiently rich type system *is* proving a theorem, and verifying a specification *is* type-checking.

**The implication:** The "right" level of abstraction is whatever level of type expressiveness captures the properties you care about. Simple types capture data structure; refinement types capture numeric bounds; dependent types capture arbitrary logical properties; session types capture protocol conformance. The question is not "spec vs. code" but "how expressive should the type system be?"

### 6.8 Conor McBride: Correct by Construction

McBride, through his work on Epigram and contributions to Agda, articulates the "correct by construction" vision: rather than writing programs and then verifying them, structure the program's type so that only correct programs can be expressed. This is "not an attempt to strap a more powerful type system to standard functional programming constructs — it's rather an attempt to rethink programming."

McBride's practical contribution is showing that dependent types need not be impractical: bidirectional type checking facilitates interactive development, and proof automation can discharge routine obligations. The remaining challenge is making these techniques accessible to mainstream developers.

### 6.9 Tony Hoare: Unifying Theories of Programming

Hoare's later work on Unifying Theories of Programming (UTP, with He Jifeng, 1998) sought to place diverse programming paradigms on a common mathematical foundation. The radical insight: in UTP, **programs are predicates** — there is no distinction between programs and specifications at the semantic level.

This collapses the abstraction hierarchy entirely: a specification is just a loose predicate (many programs satisfy it), and a program is a tight predicate (only one execution trace satisfies it). Refinement is the process of tightening predicates. The "right" level of abstraction is wherever you are in the refinement chain.

Hoare was also instrumental in proposing the **Verified Software Initiative**, a cooperative international project directed at large-scale software verification — recognizing that formal methods needed both theoretical advances and practical engineering to achieve mainstream impact.

### 6.10 Peter Naur: Programming as Theory Building

Naur's 1985 paper "Programming as Theory Building" presents the most radical challenge to the entire specification enterprise. His claim: a program is not its source code, and the knowledge needed to develop and maintain it *cannot be fully externalized* in specifications, documentation, or code.

**The theory.** A program embodies a *theory* — "the knowledge a person must have in order not only to do certain things intelligently but also to explain them, to answer queries about them, to argue about them." This theory includes how the real world maps to the program, which parts of the world are relevant, and why certain design decisions were made. Naur claims this theory is fundamentally tacit knowledge that cannot be captured in text.

**The implication for specifications.** If Naur is right, no intermediate representation — however formal — can fully bridge the gap between human intent and code. The theory lives in the minds of developers, and the health of a program is "entangled with the continuity of the people who hold its theory."

**The challenge for AI.** Naur's argument suggests that even if AI can perfectly translate specifications into code, the specifications themselves are lossy representations of the underlying theory. The deepest form of the abstraction problem is not "what language should specs be written in?" but "can the theory behind a system be externalized at all?"

**For harness design:** Naur's view suggests that harnesses should preserve and make accessible the *reasoning* behind decisions, not just the decisions themselves. Commit messages, design documents, conversation logs with AI — these are all partial externalizations of the theory. A good harness would curate and search this theory-level knowledge.

---

## 7. Why Formal Methods Haven't Gone Mainstream (And Whether AI Changes This)

### 7.1 The Historical Barriers

**The cost barrier.** The cost of proof is typically an order of magnitude greater than the cost of specification, and the cost of specification alone often exceeds a project's budget. The seL4 microkernel — 8,700 lines of C, 20 person-years of verification, 200,000 lines of Isabelle proof — illustrates the economics that kept formal methods marginal.

**The education barrier.** Formal methods require mathematical intuition that most software engineers do not develop in their training. Hillel Wayne identifies the first stumbling block as the logical implication operator — a basic concept that many programmers never encounter. The UI/UX of formal tools compounds this: core contributors have technical skills, not usability expertise.

**The culture barrier.** Twenty years ago, automated testing and code review were niche practices; now they are universal. Formal methods face a similar adoption curve but with steeper barriers. Wayne frames it as a "flossing problem" — everyone agrees formal methods are good practice, but the individual cost-benefit calculation doesn't favor adoption.

**The process barrier.** Most software development is iterative and exploratory. Heavyweight formal methods require complete upfront specifications, which is incompatible with agile, design-thinking, and lean startup approaches. This is not merely a cultural preference — it reflects genuine uncertainty in requirements.

**The scope barrier.** Full formal verification of real systems is practically impossible — the state space is too large, the specifications too complex, and the formal models too distant from actual execution environments (OS, network, hardware). Partial verification is possible but requires judgment about where to invest effort.

### 7.2 What the Lightweight Movement Learned

The lightweight formal methods movement (Alloy, TLA+, property-based testing, model checking) responded to each barrier:

| Barrier | Heavyweight Response | Lightweight Response |
|---------|---------------------|---------------------|
| Cost | Full proof (20 person-years) | Bounded model checking (days) |
| Education | PhD in type theory | Weekend tutorial (TLA+ Toolbox) |
| Culture | Formal development process | Spot-check critical algorithms |
| Process | Complete upfront spec | Incremental specification |
| Scope | Verify everything | Verify the scary parts |

The key insight: **partial application of formal methods at critical points yields most of the benefit at a fraction of the cost.** AWS's experience validates this — they use TLA+ for the distributed protocol layer (where bugs are subtle and catastrophic) but not for UI code (where bugs are visible and cheap to fix).

### 7.3 How AI Changes the Equation

AI potentially addresses every historical barrier simultaneously:

1. **Cost:** AI can generate proofs, specifications, and model-checking configurations at near-zero marginal cost. The VeriCoding benchmark shows 82% success on Dafny specifications today.

2. **Education:** AI can serve as a "formalism translator" — accepting informal descriptions and producing formal specifications. Humans review formal specs (which is "vastly easier and quicker than writing proofs by hand," per Kleppmann) rather than authoring them from scratch.

3. **Culture:** If formal verification is automatic and free, the cost-benefit calculation flips. It becomes more expensive *not* to verify than to verify.

4. **Process:** AI can generate specifications incrementally, maintaining formal models that evolve alongside code — addressing the incompatibility with agile processes.

5. **Scope:** AI can generate proofs for more of the system than humans could afford to verify manually, widening the scope of practical formal methods.

**The critical question:** Who reviews the specification? Kleppmann and Congdon both identify this as the remaining bottleneck. AI can generate code and proofs, but someone must verify that the specification captures the right properties. This requires domain expertise and formal methods literacy — suggesting that the human role shifts from "programmer" to "specification reviewer."

### 7.4 The Emerging Architecture

The most likely near-term architecture for AI-assisted formally verified development:

```
Human Intent (English + domain knowledge)
    |
    v
[AI Formalization Layer] -- translates to --
    |
    v
Formal Specification (TLA+ / Dafny / Lean types / Contracts)
    |
    v  (human review of spec)
    |
    v
[AI Implementation Layer] -- generates --
    |
    v
Code + Proofs
    |
    v
[Formal Verifier] -- checks proofs against spec --
    |
    v
Verified Implementation
```

This architecture preserves human authority at the specification level while delegating implementation and verification to AI. The intermediate representation — the formal specification — is the key artifact, serving as both the contract between human and AI and the oracle for verification.

---

## 8. Synthesis: Implications for Harness Design

The research in this report converges on several principles for harness design:

1. **The harness should operate at the specification level, not the code level.** Lamport, Jackson, Meyer, and the vericoding movement all agree that the human's primary artifact should be a specification — whether TLA+ models, type signatures, contracts, or property definitions.

2. **Multiple levels of formalism should coexist.** Not every part of a system needs the same level of rigor. Gherkin for acceptance criteria, contracts for module interfaces, TLA+ for distributed protocols, dependent types for critical data structures. The harness should support this spectrum.

3. **AI should translate between levels.** The historical barrier to formal methods was the cost of formalization. AI can serve as the "formalism translator" — accepting informal intent and producing formal specifications for human review. This is the key enabler.

4. **Verification should be automatic and continuous.** Proof checkers, model checkers, and property-based test generators should run automatically on every change. AI-generated proofs are validated by deterministic checkers, neutralizing hallucination risk.

5. **The theory must be preserved.** Naur's insight that programs embody theories suggests that harnesses should capture and curate the reasoning behind decisions — not just the decisions themselves. Conversation logs, design rationale, commit messages, and specification evolution histories are all part of this theory.

6. **Visual and textual formalisms should coexist.** Harel's statecharts demonstrate that formal specification need not be textual. The harness should support visual specifications (state machines, sequence diagrams, data flow graphs) as first-class artifacts alongside textual ones.

---

## 9. Source Index

### Formal Specification Languages
- Lamport, L. "Thinking Above the Code." Microsoft Research. [Link](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/07/leslie_lamport.pdf)
- Lamport, L., Merz, S., Newcombe, C. "The Future of TLA+" (July 2024). [Link](https://lamport.azurewebsites.net/tla/future.pdf)
- Lamport, L. *Specifying Systems: The TLA+ Language and Tools for Hardware and Software Engineers.* Addison-Wesley, 2002. [Link](https://lamport.azurewebsites.net/tla/book-02-08-08.pdf)
- Lamport, L. Interview, Quanta Magazine (2022). [Link](https://www.quantamagazine.org/computing-expert-says-programmers-need-more-math-20220517/)
- Lamport, L. Changelog Interview #552. [Link](https://changelog.com/podcast/552)
- Newcombe, C. et al. "How Amazon Web Services Uses Formal Methods." CACM, April 2015. [Link](https://cacm.acm.org/research/how-amazon-web-services-uses-formal-methods/)
- Jackson, D. *Software Abstractions: Logic, Language, and Analysis.* MIT Press, revised 2012. [Link](https://mitpress.ublish.com/book/software-abstractions)
- Jackson, D. *The Essence of Software: Why Concepts Matter for Great Design.* Princeton University Press, 2021. [Link](https://essenceofsoftware.com/)
- Quint specification language, Informal Systems. [Link](https://quint-lang.org/)

### Type-Theoretic Approaches
- Brady, E. *Type-Driven Development with Idris.* Manning Publications, 2017. [Link](https://www.manning.com/books/type-driven-development-with-idris)
- Idris 2 programming language. [Link](https://www.idris-lang.org/)
- Lean 4 programming language. [Link](https://lean-lang.org/)
- LeanDojo: AI-Driven Formal Theorem Proving. [Link](https://leandojo.org/)
- Vazou, N. et al. "LiquidHaskell: Experience with Refinement Types in the Real World." SIGPLAN Notices, 2014. [Link](https://dl.acm.org/doi/10.1145/2775050.2633366)
- Harper, R. *Practical Foundations for Programming Languages.* Cambridge University Press, 2nd ed., 2016. [Link](https://www.cambridge.org/core/books/practical-foundations-for-programming-languages/3D852B5A14F48F85C60B95A0BBCAB7D9)
- Wadler, P. "Propositions as Types." CACM, 2015. [Link](https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf)
- McBride, C. "Epigram: Practical Programming with Dependent Types." [Link](https://www.semanticscholar.org/paper/Epigram:-Practical-Programming-with-Dependent-Types-McBride/81a25ed362ffda45797bef2459b5b0196baaddef)
- Altenkirch, T., McBride, C. "Why Dependent Types Matter." [Link](https://plv.mpi-sws.org/plerg/papers/why-dependent-types-2up.pdf)

### Behavioral Specification
- North, D. Behavior-Driven Development. [Link](https://en.wikipedia.org/wiki/Behavior-driven_development)
- Fowler, M. "Given When Then." [Link](https://martinfowler.com/bliki/GivenWhenThen.html)
- Meyer, B. "Design by Contract." [Link](https://se.inf.ethz.ch/~meyer/publications/old/dbc_chapter.pdf)
- Claessen, K., Hughes, J. QuickCheck. [Link](https://hypothesis.works/articles/what-is-property-based-testing/)
- MacIver, D. Hypothesis library. [Link](https://hypothesis.works/)

### Visual Formalisms
- Harel, D. "Statecharts: A Visual Formalism for Complex Systems." Science of Computer Programming, 1987. [Link](https://www.state-machine.com/doc/Harel87.pdf)
- Milewski, B. *Category Theory for Programmers.* [Link](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)
- Petri nets overview. [Link](https://en.wikipedia.org/wiki/Petri_net)

### AI-Era and Formal Methods Adoption
- Kleppmann, M. "Prediction: AI will make formal verification go mainstream." December 2025. [Link](https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html)
- Congdon, B. "The Coming Need for Formal Specification." December 2025. [Link](https://benjamincongdon.me/blog/2025/12/12/The-Coming-Need-for-Formal-Specification/)
- "A Benchmark for Vericoding: Formally Verified Program Synthesis." POPL 2026. [Link](https://arxiv.org/abs/2509.22908)
- "Formal Reasoning Meets LLMs." CACM. [Link](https://cacm.acm.org/research/formal-reasoning-meets-llms-toward-ai-for-mathematics-and-verification/)
- Wayne, H. "Why Don't People Use Formal Methods?" [Link](https://www.hillelwayne.com/post/why-dont-people-use-formal-methods/)
- "A Manifesto for Applicable Formal Methods." Software and Systems Modeling, 2023. [Link](https://link.springer.com/article/10.1007/s10270-023-01124-2)

### Foundational
- Naur, P. "Programming as Theory Building." 1985. [Link](https://pages.cs.wisc.edu/~remzi/Naur.pdf)
- Hoare, C.A.R., He, J. *Unifying Theories of Programming.* Prentice Hall, 1998. [Link](https://en.wikipedia.org/wiki/Unifying_Theories_of_Programming)
- Jones, C.B., Misra, J. *Theories of Programming: The Life and Works of Tony Hoare.* ACM Books, 2021. [Link](https://dl.acm.org/doi/book/10.1145/3477355)
- Curry-Howard correspondence. [Link](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence)
