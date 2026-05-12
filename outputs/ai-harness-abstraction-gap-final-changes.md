# Final Change Report: "Towards a Science for AI Coding Agent Harnesses"

Synthesized from six perspective reviews: (1) Harness Engineer, (2) Formal Methods, (3) Multi-Agent Systems, (4) HCI/CogSci, (5) Philosophy, (6) Uncomputability Skeptic.

---

## Phase 1: Consensus and Conflict Map

### Universal Consensus (all 6 perspectives agree)

1. **The formalism-to-principles connection is loose.** Every reviewer, from the harness engineer ("operationally vacuous") to the formal methods reviewer ("vocabulary, not derivation") to the uncomputability skeptic ("the design principles could be derived from simpler, testable premises"), flags that the six design principles do not actually follow from the formal machinery. They could be motivated by informal arguments with equal force.

2. **Section 5 (multi-agent extension) is underdeveloped.** All reviewers note that this section contains no original formal result. The MAS reviewer calls it "grafted-on"; the formal methods reviewer notes the "Proposition" label is misleading for empirical observations; the harness engineer says "the formalism cannot absorb the best available empirical data"; the uncomputability skeptic notes the chain rule decomposition works identically under any information measure.

3. **The thinker placement values are not computed quantities.** All reviewers who engage with the table acknowledge that the sigma/kappa values are ordinal vibes, not measurements. The "uncanny valley" claim rests on eyeballing these estimates.

### Strong Consensus (4-5 perspectives agree)

4. **The paper overstates Theorem 3.1 as a contribution** (Perspectives 1, 2, 3, 6). These are known properties of Kolmogorov complexity (chain rule, conditional complexity definition, independence bound) with variables renamed. The introduction and abstract frame them as contributions.

5. **The Curry-Howard "gap of perspective, not of kind" claim is a conflation** (Perspectives 2, 4, 5, 6). Formal isomorphism is not practical identity. This is the paper's strongest philosophical claim and its weakest philosophical argument.

6. **The cognitive science content in Section 6 is superficial** (Perspectives 1, 4, 5; partially 3). System 1/2 is misapplied, mentalese is oversimplified, Miller's 7 +/- 2 is misused, Sapir-Whorf is unsupported. The section functions as rhetorical decoration.

7. **The contrarian section (Section 7) does not genuinely engage** (Perspectives 4, 5; partially 1, 3). The contrarian positions are catalogued in ~50 words each and then domesticated by absorbing them into the paper's own sigma framework. Suchman and Wittgenstein would reject the sigma parameter itself.

8. **Kappa can go negative** (Perspectives 2, 6). The definition kappa(S) = 1 - |S|/K(P) produces negative values when |S| > K(P), contradicting the stated range [0,1]^2. The seL4 full-verification example (200k lines Isabelle for 8.7k lines C) would produce kappa far below zero.

### Genuine Disagreements

**A. Is K-complexity necessary, or should the paper switch to Shannon entropy?**
- Formal methods (P2): K is partially load-bearing (Theorem 3.3 convergence result is the one novel corollary; NID universality is correctly attributed).
- Uncomputability skeptic (P6): Every theorem survives Shannon restatement, and most become stronger (exact equalities instead of O(log n) fudge factors). K provides nothing operationally useful beyond "conceptual scaffolding."

**B. Is the paper's value in practical guidance or conceptual framing?**
- Harness engineer (P1): The paper produces zero actionable insights beyond "write better prompts."
- Philosopher (P5): The conceptual framing is the most interesting part, but it is underdeveloped. The Naur, Suchman, and Wittgenstein engagements could be genuinely illuminating if taken seriously.

**C. Is Section 6 (Cognitive Constraint) salvageable?**
- HCI/CogSci (P4): The section is "superficial" and would not survive peer review at any cognitive science venue. Every claim is cherry-picked.
- Formal methods (P2): Does not engage with this section (treats it as outside scope).

**D. Is Section 5 (Multi-Agent) worth keeping?**
- MAS researcher (P3): Either develop genuine formal results (information-theoretic coordination cost model, composition theorems, redundancy-as-error-correction) or demote to half-page future work.
- Harness engineer (P1): The Kim et al. empirical data is useful even without formalization.

### Unique Insights (flagged by only one perspective)

- **P2 (Formal Methods):** The proof of Theorem 3.1(c) silently invokes symmetry of information, which is non-trivial and should be made explicit.
- **P4 (HCI/CogSci):** Green and Petre's (1996) cognitive dimensions framework is the appropriate tool for analyzing specification usability, but goes unmentioned.
- **P5 (Philosophy):** The Seven Answers table (Appendix D) is rigged: it excludes Suchman and Wittgenstein (who would answer "No") while including them in the thinker placement, creating an appearance of convergence by selection.
- **P6 (Uncomputability Skeptic):** Even under the finite bound N, computing sigma requires deciding program satisfaction, which is undecidable by Rice's theorem. The finiteness fix does not actually resolve uncomputability.
- **P1 (Harness Engineer):** The paper ignores the actual hard problems of harness engineering: context window management, tool selection policies, error recovery, cost optimization, latency budgets, permission models, sandbox security, streaming UX, rate limiting, credential management, caching.

---

## Phase 2: Staged Debates

### Debate 1: Formal Methods vs. Uncomputability Skeptic -- Is K-complexity necessary?

**Formal Methods (P2):** Kolmogorov complexity provides one genuine result: Theorem 3.3, the convergence theorem, which is a novel application of Chaitin's incompleteness theorem to the spec-code relationship. The NID universality result (Theorem 3.2) gives us the canonical metric. These are properties of K that Shannon entropy does not directly provide. The universality result means K-based NID dominates every computable distance; this is a theoretically significant property even if never operationalized.

**Uncomputability Skeptic (P6):** Theorem 3.3 has a direct Shannon analogue via rate-distortion theory: if H(P | S) approaches zero, S determines P. The convergence result is cleaner in Shannon terms (no O(log n) fudge). The NID universality is never used downstream; it is a "theoretical nicety with no downstream consequence." Meanwhile, the paper already has a Shannon channel model in Section 3.4. The K foundation forces every practical application through an uncomputable-to-computable proxy whose approximation quality is never quantified.

**Formal Methods (P2):** The Shannon analogue assumes a probability distribution over programs, which is itself a modeling choice. K-complexity is distribution-free; that is its strength. The paper is a theory paper, and the K-based framework connects to a richer mathematical tradition (algorithmic information theory, Chaitin's omega, Solomonoff induction). Stripping it to Shannon would reduce the paper's theoretical depth.

**Uncomputability Skeptic (P6):** Distribution-free analysis is appropriate when you lack distributional information. But the paper's subject (LLM-mediated code generation) is inherently probabilistic. LLMs sample from learned distributions. The Shannon channel model is the natural fit. And the "richer mathematical tradition" argument is exactly my concern: the K framework provides intellectual prestige without predictive power. The paper's final sentence claims "mathematical, not merely philosophical, answers," but a framework whose central quantity is uncomputable delivers philosophical answers in mathematical notation.

**Adjudication:** The uncomputability skeptic wins on pragmatics; the formal methods reviewer wins on theoretical motivation. The resolution: keep K as the conceptual foundation (it is well-established and the convergence theorem is a legitimate, if limited, contribution), but foreground the Shannon channel model as the operational foundation. The paper should be explicit that K serves as conceptual scaffolding while Shannon provides the measurable, falsifiable quantities. The claim of "mathematical, not merely philosophical, answers" in the conclusion should be softened.

---

### Debate 2: Harness Engineer vs. Philosopher -- Is the paper valuable if it produces zero actionable insights?

**Harness Engineer (P1):** I have built harnesses. The six design principles are post-hoc rationalizations of decisions we already made for straightforward engineering reasons. "Operate at the specification level" means "write better prompts." "Continuous verification" means CI/CD. "Select topology by task" means good systems engineering. The paper would be stronger if it identified even one case where the framework would have led to a different design decision than engineering intuition alone.

**Philosopher (P5):** The value of a framework is not reducible to "would it have changed your last decision." Newton's laws did not change how builders constructed arches (they already knew how), but they provided explanatory power that enabled the Brooklyn Bridge. The abstraction gap framework, if properly developed, could explain why certain harness designs fail at scale, predict failure modes for new architectures, and unify scattered engineering intuitions under a common vocabulary. The thinker placement, despite its methodological weaknesses, is the first attempt to map the design space systematically.

**Harness Engineer (P1):** Newton's laws made quantitative predictions that could be tested and that outperformed previous theories. This framework makes no quantitative predictions because its central quantity is uncomputable. I cannot measure G(S, P) for any real specification-code pair. A framework that cannot make predictions is philosophy, not science, regardless of how many equations it contains. The title says "Towards a Science"; a science needs falsifiable claims.

**Philosopher (P5):** Fair point on falsifiability. But the paper's deeper contribution is conceptual: the Curry-Howard bridge, the refinement lattice as a unifying framework, the observation that the spec-code relationship is information-theoretic. These conceptual clarifications have value even without quantitative predictions. The problem is not that the paper does conceptual work; the problem is that it claims to do more than conceptual work. If it were honest about being a conceptual framework paper, it would be evaluated on the quality of its concepts rather than on actionable guidance it cannot provide.

**Adjudication:** Both are right about different things. The paper's value is primarily conceptual (the philosopher wins), but the paper oversells itself as providing "mathematical answers" and actionable design principles (the harness engineer's critique is valid). The resolution: reframe the paper's contribution claims. Downgrade the design principles from "derived from the formal framework" to "motivated by the formal framework and consistent with engineering practice." Add the harness engineer's challenge as an explicit limitation: the paper should identify at least one case where the framework produces a non-obvious prediction, or acknowledge that it cannot yet do so.

---

### Debate 3: HCI/CogSci vs. Formal Methods -- Is Section 6 (Cognitive Constraint) salvageable?

**HCI/CogSci (P4):** Every cognitive science claim in Section 6 is a caricature. System 1/2 is misapplied (experts process formal notation via System 1; difficulty is not always a feature). Mentalese is contested and formal notation is not "closer to mentalese" by any published evidence. Miller's 7 +/- 2 is about short-term memory for unrelated items, not document structure. Sapir-Whorf is about habitual thought patterns, not logical expressibility. The section uses cognitive science as rhetorical ammunition for a conclusion (formal = better) that the cited researchers would not endorse.

**Formal Methods (P2):** The cognitive science section is outside my scope, but I note that Section 6 is not load-bearing for the formal results. The theorems stand regardless of whether System 1/2 is correctly applied. If the cognitive science is wrong, remove it; the paper loses nothing formal.

**HCI/CogSci (P4):** Exactly. It is decorative. But it is also actively misleading: it creates the impression that cognitive science supports the paper's formalist commitments, when the mainstream HCI position (situated cognition, distributed cognition, ecological rationality) actually challenges them. Removing the section is better than leaving a misleading one.

**Adjudication:** The HCI/CogSci reviewer wins decisively. Section 6 should be either (a) removed entirely and replaced with a single paragraph acknowledging cognitive factors, or (b) substantially rewritten with proper engagement (citing Cowan 2001 instead of Miller, acknowledging Dreyfus on expertise, engaging Green and Petre's cognitive dimensions, noting that the desirable-difficulty claim requires conditions from Bjork 1994). Option (a) is safer for a theory paper; option (b) would require a genuine co-author with cognitive science expertise.

---

### Debate 4: MAS Researcher vs. Everyone -- Is Section 5 worth keeping?

**MAS Researcher (P3):** Section 5 contains one application of the chain rule (acknowledged as such), one "Proposition" that lists Kim et al.'s empirical numbers without derivation, and a candid admission that the real formalization remains open. This is a placeholder, not a contribution. The "Proposition" label is misleading for what is an empirical summary. A real MAS contribution would need composition theorems, information-theoretic coordination cost models, or redundancy-as-error-correction formalization.

**Harness Engineer (P1):** The Kim et al. data (17x error amplification, capability saturation at 45%) is genuinely useful information for harness designers. The section's value is in surfacing these findings, not in the formal framing. Keep it, but strip the formal pretensions.

**Formal Methods (P2):** I agree with the MAS reviewer that "Proposition 5.1" is mislabeled. The asymmetry with the proved theorems in Sections 3-4 is glaring. Relabel it as an empirical summary.

**Uncomputability Skeptic (P6):** The chain rule decomposition works identically under Shannon entropy. Nothing in the MAS section requires K-complexity. This further undermines the paper's claim that K is the necessary foundation.

**Adjudication:** The MAS researcher wins on formal grounds. The section should be retained but substantially reshaped: (a) remove "multi-agent extension" from the contributions list in the introduction; (b) relabel Proposition 5.1 as an empirical finding or observation; (c) explicitly frame the section as "applying the framework to multi-agent systems, drawing on empirical findings" rather than "extending the formal framework to multi-agent systems"; (d) move the honest admission about dimensional heterogeneity to the front of the section rather than burying it after the claim of extension. The Kim et al. data is valuable and should stay, but the formal packaging should match the actual content.

---

## Phase 3: Final Prioritized Change Report

### MUST-DO (paper is unpublishable without these)

**M1. Fix the kappa range violation.**
- Section: Definition 5.1, line ~389
- Change: Either (a) clamp kappa to [0,1] with kappa(S) = max(0, 1 - |S|/K(P)), (b) redefine to use a ratio that is naturally bounded, or (c) change the stated range from [0,1]^2 to allow negative kappa and update all downstream discussion. The current definition is internally inconsistent.
- Supporting perspectives: P2, P6
- Dissent: None

**M2. Relabel contributions to match actual content.**
- Sections: Abstract (line 99), Introduction (lines 120-126), Conclusion (lines 537-543)
- Change: (a) Theorem 3.1 should be presented as "known properties of K applied to the spec-code relationship," not as a novel theorem. (b) Remove "multi-agent extension" from the contributions list or reframe as "application of the framework to multi-agent findings." (c) The CHL discussion should be described as "literature synthesis," not as a contribution. (d) The final sentence ("mathematical, not merely philosophical, answers") should be softened to acknowledge the gap between the uncomputable framework and practical measurement.
- Supporting perspectives: P1, P2, P3, P5, P6 (5 of 6)
- Dissent: None

**M3. Fix "Proposition 5.1" labeling.**
- Section: Section 5 (multi-agent), line ~365
- Change: Relabel from "Proposition" to "Empirical Summary" or "Observation," since it contains no proof, no derivation, and no connection to the paper's own formal apparatus. It is a bibliography citation in proposition clothing.
- Supporting perspectives: P2, P3, P6
- Dissent: None

**M4. Distinguish formal isomorphism from practical identity in the CHL discussion.**
- Section: Section 4.2, line 314
- Change: The sentence "Martin-Lof's intuitionistic type theory proves that these are formally identical objects: the gap between specification and code is a gap of perspective, not of kind" conflates structural isomorphism with practical identity. Revise to: "Under Martin-Lof's type theory, specifications and implementations are structurally isomorphic (propositions and proofs, types and terms). The gap is one of perspective within a unified formal framework, though this structural correspondence does not entail that specifications and implementations play the same role in practice."
- Supporting perspectives: P2, P5
- Dissent: None directly, though the philosopher (P5) would want even more careful treatment

**M5. Address uncomputability of sigma under the finite bound.**
- Section: Definition 5.1, line ~386-392
- Change: The paper claims the bound N makes sigma computable over a finite set, but computing |[[S]]_N| requires deciding whether each program of length <= N satisfies S, which is undecidable by Rice's theorem even for finite N. Add an explicit acknowledgment that even the bounded version is in general undecidable, and that the thinker placements are expert ordinal estimates, not approximations of a computable quantity.
- Supporting perspectives: P6; supported implicitly by P1, P2
- Dissent: None

**M6. Acknowledge unfalsifiability as a limitation.**
- Section: Conclusion or a new "Limitations" subsection
- Change: The framework's central quantity G(S,P) = K(P|S) is uncomputable. No claim that one design reduces G more than another can be empirically falsified. The paper should explicitly acknowledge this as a limitation and state whether it views the framework as (a) conceptual scaffolding that motivates computable proxies, or (b) a formal foundation awaiting computable instantiation with proved approximation bounds. Currently, it oscillates between these without committing.
- Supporting perspectives: P1, P6; implicitly P2
- Dissent: None

### SHOULD-DO (significantly strengthens the paper)

**S1. Foreground the Shannon channel model as the operational foundation.**
- Section: Section 3.4 (currently a short subsection), plus a new paragraph in the Introduction
- Change: The paper already has a Shannon channel model. Promote it: present K as the conceptual foundation and Shannon as the operational, measurable counterpart. Show that the key theorems survive Shannon restatement. This addresses the unfalsifiability concern without abandoning the K framework.
- Supporting perspectives: P6, P1; partially P2
- Dissent: P2 notes that K is distribution-free while Shannon requires distributional assumptions, which is a legitimate theoretical distinction. The paper should acknowledge this tradeoff.

**S2. Rewrite or remove Section 6 (Cognitive Constraint).**
- Section: Section 6, lines 434-446
- Change: Option A (recommended): Remove entirely; replace with a single paragraph acknowledging that cognitive factors constrain the practical operating point on the abstraction spectrum, citing Kahneman and Iverson without the unsupported specific claims. Option B: Substantially rewrite with proper engagement (Cowan 2001 for working memory, Dreyfus/Chi/Ericsson for expertise, Green and Petre 1996 for cognitive dimensions, Bjork 1994 for desirable difficulty conditions). Do not claim "formal notation may be closer to mentalese" without evidence.
- Supporting perspectives: P4, P5, P1
- Dissent: None of the six perspectives defend the section's current content

**S3. Genuinely engage the contrarian positions in Section 7.**
- Section: Section 7 (Contrarian Analysis), lines 448-463
- Change: Expand from ~250 words to ~500-750 words. For each position, state the strongest version of the objection and explain what it would mean for the framework if correct. For Suchman: if plans are resources for action rather than determinants, then the refinement lattice may be the wrong metaphor for iterative AI-mediated development. For Wittgenstein: if meaning is use, then a prompt's informational content is not fixed (undermining the K-based measurement premise). For the Bitter Lesson: state explicitly whether the framework predicts scaling will or will not obsolete formal methods, and on what timescale.
- Supporting perspectives: P5, P4
- Dissent: P1 would prefer the space be used for practical content instead

**S4. Reshape Section 5 (Multi-Agent) to match its actual content.**
- Section: Section 5, lines 334-376
- Change: (a) Open with the honest admission about dimensional heterogeneity (currently buried at line 361). (b) Present the Kim et al. findings as empirical context, not as formal results. (c) Frame the section as "What the abstraction gap framework suggests about multi-agent coordination" rather than "Extension to Multi-Agent Systems." (d) Move genuine formal multi-agent results to future work. (e) Consider removing the "Agent Decomposition" remark or noting explicitly that it holds for any intermediate string and has no agent-specific mathematical content.
- Supporting perspectives: P3, P2, P6
- Dissent: P1 wants the Kim data kept prominently, which this change preserves

**S5. Add at least one concrete case where the framework produces a non-obvious prediction or recommendation.**
- Section: New material in Section 8 (Design Principles) or a dedicated subsection
- Change: The harness engineer's challenge is sharp: name one design decision the framework would change. Candidates: (a) predict that vericoding-style workflows should outperform pure NL at a quantifiable sigma threshold; (b) predict that mixed-formalism harnesses should show non-linear quality improvements as sigma crosses specific thresholds; (c) derive a concrete recommendation for when to switch from single-agent to multi-agent topology based on task complexity metrics. Even a speculative prediction with stated assumptions would be stronger than the current position of pure post-hoc rationalization.
- Supporting perspectives: P1; implicitly P6
- Dissent: P5 argues the paper's value is conceptual and predictions are premature. This is fair, but even a conceptual paper benefits from demonstrating that its concepts could in principle produce predictions.

**S6. Fix the Seven Answers table (Appendix D).**
- Section: Appendix D, lines 745-768
- Change: Either (a) include Suchman and Wittgenstein in the table (their answers would be "No, the question presupposes a false picture of specification" and "The question's meaning depends on its use," respectively), or (b) remove the framing that "the answers converge from different angles," since convergence is achieved by excluding the traditions that diverge.
- Supporting perspectives: P5
- Dissent: None explicitly, but other reviewers did not focus on this

### CONSIDER (improves the paper but reasonable people disagree)

**C1. Make the proof of Theorem 3.1(c) explicit about symmetry of information.**
- Section: Appendix A, proof of Theorem 3.1(c), line ~576-589
- Change: The step K(P | S') <= K(S | S') + K(P | S) + O(log n) uses the symmetry of information implicitly. Make the appeal explicit with a citation to Li and Vitanyi.
- Supporting perspectives: P2
- Dissent: None, but this is a minor technical point that most readers will not notice

**C2. Engage Green and Petre's (1996) cognitive dimensions framework.**
- Section: If Section 6 is retained (see S2)
- Change: Cognitive dimensions (viscosity, visibility, premature commitment, hidden dependencies, etc.) are the standard HCI framework for evaluating notation design. The paper's claims about formal vs. informal notation usability should be grounded in this framework rather than in pop-cognitive-science (System 1/2, mentalese).
- Supporting perspectives: P4
- Dissent: P2 and P1 would prefer the cognitive section be removed rather than expanded

**C3. Discuss the thinker placement as a pedagogical device rather than a measurement.**
- Section: Section 5.2, lines 396-427
- Change: The table is fun and useful for framing the design space. But calling the sigma/kappa values "estimates" implies they approximate something computable, which they do not. Reframe as: "We use the two-dimensional framework to organize the positions of major thinkers qualitatively. The placements reflect our reading of their published positions and are intended as a pedagogical device for mapping the design space, not as measurements."
- Supporting perspectives: P1, P6
- Dissent: P5 finds the thinker placement the paper's most interesting contribution and would resist downgrading it to "merely pedagogical"

**C4. Add treatment of HCI thinkers with more depth.**
- Section: Section 5.2 and Appendix E
- Change: Suchman (sigma 0.1-0.3) is reduced to "low specificity," but her argument is that plans and specifications are fundamentally different in kind. Kay gets "dyn." with no analysis. Chollet gets "var." despite ARC being a concrete operationalization. Wittgenstein gets dashes. These thinkers are included for breadth but excluded from the analytical apparatus.
- Supporting perspectives: P4, P5
- Dissent: P1 would remove the thinker placement entirely rather than expand it; P2 is indifferent

**C5. Strengthen the "uncanny valley" claim or weaken its framing.**
- Section: Section 5.3, lines 429-432
- Change: The uncanny valley observation (gap at sigma 0.3-0.45) is the paper's most novel empirical claim. It currently rests on eyeballing ordinal estimates in a 16-row table. Either (a) provide additional evidence (e.g., from the software engineering literature on semi-formal methods), or (b) present it as a hypothesis to be tested rather than a finding.
- Supporting perspectives: P1, P6
- Dissent: P5 finds this observation genuinely interesting and would not want it weakened

**C6. Acknowledge the paper's rationalist epistemological commitment.**
- Section: Introduction or new subsection
- Change: The paper treats formal, explicit, propositional knowledge as epistemically primary. This is a contestable philosophical position (the situated cognition tradition argues that skilled practice is grounded in embodied, tacit knowledge). The paper should either (a) explicitly defend this commitment, or (b) acknowledge it as an assumption and note the traditions that contest it.
- Supporting perspectives: P5, P4
- Dissent: P2 would consider this scope creep for a theory paper. P1 is indifferent.

---

## Summary of Change Volume

| Tier | Count | Approximate revision effort |
|------|-------|-----------------------------|
| MUST-DO | 6 | Medium (mostly rewriting claims, fixing definitions) |
| SHOULD-DO | 6 | Substantial (Section 6 rewrite/removal, Section 5 reshape, new material) |
| CONSIDER | 6 | Light to moderate (mostly framing adjustments) |

The MUST-DO changes are primarily about honesty: making the contribution claims match the actual content, fixing a definitional inconsistency, and acknowledging a fundamental limitation. The SHOULD-DO changes address the two weakest sections (Cognitive Constraint and Multi-Agent) and the strongest external critique (unfalsifiability/operationalization). The CONSIDER changes improve intellectual rigor but involve judgment calls where reasonable perspectives diverge.
