## Reviewer 3: The Systems Builder (Industry Research Scientist)

### Summary

This paper proposes a unified formal framework for AI coding agent harness architecture, organized around seven "pillars" (Abstraction, Information, Reliability, Coordination, Temporal, Quality, Governance) and linked through information-theoretic concepts. The framework applies established mathematical machinery (Kolmogorov complexity, Shannon entropy, reliability theory, control theory, lattice theory, etc.) to the specific problem domain of harness design, yielding 35 design principles organized by implementation effort. While ambitious in scope and honest about its limitations, the paper is essentially a 100-page theoretical exercise that lacks the empirical validation needed to demonstrate that this formalization is more useful than the practitioner intuitions it aims to replace.

### Strengths

- **Structural enforcement dominance is genuinely useful.** The result that instructional compliance decays as $(1-\epsilon)^T$ while structural enforcement achieves compliance of 1 is the single most actionable insight in the paper. I have personally observed this in production: prompt-based constraints fail at scale; filesystem permissions, tool restrictions, and output filters do not. The paper gives a clean formal justification for what practitioners have learned through painful experience, and the cost-of-failure threshold formula ($L^* = (c_s - c_p)/\epsilon$) is something I could immediately use to prioritize enforcement investments.

- **Compound error sensitivity framing is high-leverage.** The observation that elasticity equals pipeline length $n$, meaning a 1% improvement in per-step quality yields an $n$% improvement end-to-end, is both non-obvious and has direct implications. The weakest-link priority corollary (improve the step with lowest $p_i$ first) is the kind of result that changes how you allocate engineering effort. I have watched teams invest in better merge strategies when they should have invested in better task decomposition.

- **The paper is unusually honest about its weaknesses.** The evidence quality assessment (Table 6), the explicit "Very Low" ratings for unmeasured quantities (VIH, governance capacity, accretion detection), and the detailed verification roadmap with falsification criteria in Section 12 are refreshing. Most papers in this space overclaim; this one underclaims, which paradoxically makes it more trustworthy.

- **The three-tier information architecture description is accurate.** The active/searchable/hidden tier model with the fresh context dominance result matches what I see in production harnesses. The specific claim that optimal context is 0.15W to 0.40W of window capacity, while not empirically validated, aligns with our internal measurements (we see diminishing returns above roughly 0.25W for code generation tasks).

- **The contrarian positions section (Section 13) is intellectually serious.** Steelmanning the Bitter Lesson, the Suchman/Wittgenstein critique of formalization, and the Naur theory-preservation problem shows genuine engagement with the strongest objections. The acknowledgment that "the empirical evidence is strongest for the problems the framework addresses and weakest for the solutions it proposes" is exactly right.

- **The Accretion Category identifies a real phenomenon.** Code that is "functionally correct, superfluous, individually defensible, and collectively harmful" is the defining quality problem of the AI coding era. The connection to GitClear's 8x duplication increase and refactoring collapse is compelling. Naming this failure mode and placing it in a formal taxonomy is a contribution, even though detection remains unsolved.

- **Cross-pillar connections are sometimes illuminating.** The interaction between context staleness and coordination (more agents means faster codebase evolution means faster context invalidation, creating a feedback loop) is a non-obvious insight that explains real production failures I have seen. The Governance Information Budget as an integrating concept, while imperfect, provides a useful mental model.

- **The tiered principle organization (Immediately Actionable / Requires Investment / Aspirational) is practitioner-friendly.** P1 through P13 are things a team could implement next sprint. This is rare in academic papers.

### Weaknesses

- **MAJOR: The framework is almost entirely unvalidated empirically.** This is the elephant in the room. The paper identifies this honestly (Section 10, Table 6), but the problem is severe. Of the key quantitative claims, exactly zero have been tested in a controlled experiment on a production harness. The optimal context budget, VIH, governance capacity, structural enforcement threshold, accretion detection rates, cache-staleness EOQ -- all are theoretical predictions with no empirical grounding. The verification roadmap is commendable but represents 2-4 years of future work. Until that work is done, this is a hypothesis paper, not a science paper. The title "Towards a Science" is appropriate, but the paper should be evaluated as a research agenda rather than established results.

- **MAJOR: The Kolmogorov complexity foundation is theoretically elegant but practically vacuous.** The abstraction gap $\mathcal{G}(S,P) = K(P|S)$ is uncomputable by definition. The paper acknowledges this and offers the Shannon operationalization $H(P|S)$, but that quantity is model-dependent (a property of the model-specification pair, not the specification alone). The Spec-Code Convergence Theorem is mathematically clean but tells practitioners nothing they did not already know: complex logic requires detailed specifications. The seL4 example and the sorting-function example are good illustrations, but the formal machinery adds no predictive power beyond the intuition. The $(\sigma, \kappa)$ coordinate system and the "thinker placement" table (Dijkstra, Hoare, Lamport, Knuth, Brooks) are qualitative at best and subjective at worst; the paper itself notes the values are "ordinal estimates" that may not be "stable across formalizations."

- **MAJOR: The paper conflates analogy with derivation throughout the execution axis.** The authors acknowledge this to their credit (Section 9.1: "the information-theoretic framing is a valid interpretation but not the generative formalism"), but the paper still presents $R(n) = p^n$ as an "information destruction" result and the governance capacity bound as a "structural analogy" to Shannon's channel coding theorem. The governance capacity bound is the most egregious case: Shannon's theorem requires a precisely defined channel with stationary transition probabilities and a finite input alphabet; the "governance channel" has none of these properties. Calling this a "structural analogy" and then deriving design implications from it (as though it were a theorem) is misleading. The bifurcation analysis of the governance dynamics is more rigorous, but the specific ODE model ($dC/dt = \mu G(1-C)^\beta - \gamma R(1-C)$) is unfitted to any data.

- **MAJOR: The 35 design principles are a mix of novel formalization and restatement of known best practices.** "Budget Context, Do Not Maximize It" (P1) -- known since the Lost in the Middle paper. "Fix the Weakest Link First" (P5) -- basic reliability engineering. "Three Verification Rounds, Then Stop" (P6) -- the pesticide paradox, known for decades. "Cheap Layers First" (P11) -- Smith's rule from scheduling theory, applied to QA by Capers Jones in the 1990s. "Separate Code Authorship from Test Authorship" (P9) -- standard practice in security-critical development. The paper's contribution is grounding these in formal models, but the principles themselves would not surprise any senior harness engineer. The genuinely novel principles (P27: AI as formalism translator; P31: detect accretion not just defects; P35: accept residual theory loss) are in Tier 3 (Aspirational), meaning they depend on unvalidated research or nonexistent tooling.

- **MAJOR: The paper does not model the economics of harness operation, which is the binding constraint in practice.** The paper mentions token costs in a remark (Section 3.4) and notes that "the binding constraint on context size is often financial rather than degradation-based," but then proceeds to develop the entire Information pillar without integrating cost. At current pricing, a 200K-token context costs $0.60 to $3.00 per call. A team running 50 iterations per task at full context spends $30 to $150 per task. In my experience, cost is the first thing practitioners optimize, not context quality or governance capacity. A framework that does not model cost-quality tradeoffs is incomplete in a way that limits its practical utility. The cost-of-quality model in the Quality pillar (Section 7.17) is a step in the right direction but is disconnected from the token economics that dominate harness operation.

- **MINOR: The paper is far too long for its contribution density.** At approximately 100 pages (including appendices), this is a monograph, not a conference or journal paper. The appendices (cross-pillar theorem index, extended empirical calibration, extended formal definitions, extended proofs) add rigor but could be published separately. A focused 30-page paper covering the three strongest results (structural enforcement dominance, compound error sensitivity, context budget optimization) with the empirical grounding they deserve would be more impactful than 100 pages of theory without validation. The seven-pillar structure forces coverage of every dimension, but some pillars (Abstraction, Governance) are more speculative than others (Reliability, Information) and should be clearly flagged as such.

- **MINOR: The seven-pillar decomposition is presented as productive but its completeness is underargued.** The paper explicitly excludes security architecture, user interface design, and cost management, noting these "merit their own formal treatment." But cost is not a peripheral concern; it is arguably the most important harness design variable. Similarly, the human-in-the-loop interaction model (acknowledged as a "significant limitation" in Section 9.7) is not a missing pillar but a missing foundation: the entire framework models the harness as a feedforward system when in practice the dominant quality mechanism is the human correction cycle. The paper's own analysis (Section 9.7) admits that "human review is the only verification mechanism that can catch novel error categories, redirect the agent when it is solving the wrong problem entirely, and supply tacit knowledge." A framework that treats human interaction as a Layer 4 afterthought rather than the central feedback mechanism misrepresents how harnesses actually work.

- **MINOR: The Accretion Category, while a real phenomenon, is defined in a way that makes detection provably impossible.** The paper defines accretion defects as requiring the existence of "a smaller change $\Delta' \subset \Delta$ satisfying the same requirement" (Definition 7.9), then notes that "individual accretion detection is undecidable (requires exhibiting a smaller sufficient change, reducing to program equivalence)." This is intellectually honest but practically unhelpful. If the phenomenon cannot be detected at the individual change level and can only be measured via aggregate statistical process control on entropy proxies, then the formalization adds no detection capability beyond what practitioners already do (monitor duplication rates, complexity trends, etc.). The contribution is naming and classifying, not solving.

- **MINOR: The database concurrency control analogy for multi-agent coordination (Section 5.8) is imprecise in a way that could mislead.** The paper maps agent tasks to database transactions and files to data items, then notes that "the key difference is cost granularity." But the differences go much deeper: database transactions have ACID guarantees enforced by the DBMS; agent tasks have no such guarantees. Database isolation levels are implemented by the storage engine; agent "isolation" is implemented by convention (git branches, worktrees) with no formal correctness proof that the isolation is actually achieved. The paper's Table 4 maps isolation levels to agent mechanisms, but the mapping is suggestive rather than formal. An agent working on a git branch does not have "Read Committed" isolation in any rigorous sense; it has something weaker that resembles it under favorable conditions.

- **MINOR: Several notation overloads create unnecessary confusion despite the disambiguation table.** $\delta$ is used for context degradation, relaxation operator, and (with subscript) agent defect rate. $\gamma$ is used for common-cause failure and drift propensity. $\kappa$ is used for compression coordinate and coherency penalty. $\sigma$ is used for specificity and serialization fraction. The disambiguation table (Section 1) helps, but in a 100-page paper with dense mathematics, this is a readability problem that diligent notation discipline could have avoided.

### Detailed Comments

**Does this framework help someone building a harness TODAY?**

Partially. The Tier 1 principles (P1-P13) are immediately actionable and well-grounded. A team that implemented P1 (budget context), P5 (fix weakest link), P8 (read-only verifier), P9 (separate code and test authorship), and P14 (structural enforcement) would see measurable improvement. The formal backing adds confidence that these are not just anecdotal best practices.

However, the framework does not help with the hardest harness design questions I face daily: How do I route between different models for different task types? How do I set token budgets that balance quality against cost? When should I use a single large model versus many small ones? How do I handle the feedback loop between the user and the agent? These are the questions that consume most of my engineering time, and the framework is silent on all of them.

**The 35 design principles: novel or restatements?**

Roughly 20 of the 35 are formalizations of known best practices (P1-P2 on context management, P5-P7 on verification, P8-P11 on layer ordering, P17 on coupling-based decomposition). About 10 are novel formalization of less-widely-known insights (P14 on structural enforcement threshold, P15 on per-step quality investment priority, P19 on QAS measurement, P21 on refactoring ratio maintenance, P24 on governance velocity matching). About 5 are genuinely aspirational and depend on unvalidated research (P27 on AI as formalism translator, P29 on VIH threshold for persistent state, P31 on accretion detection, P33 on governance measurement, P35 on residual theory loss).

**Post-hoc rationalization vs. prediction.**

The paper cites Claude Code, Cursor, Codex, GSD, and RAPID as production harnesses whose design choices the framework "explains." But it is not clear whether the framework predicted any of these design choices or merely post-hoc rationalized them. The three-tier information architecture, the fresh context dominance pattern, and the structural enforcement pattern all emerged from practice before this framework existed. The framework's value is in unifying these observations under a common formalism, but the paper should be more explicit that this is synthesis of existing practice, not prediction of novel design choices.

The one area where the framework makes falsifiable predictions that could distinguish it from post-hoc rationalization is the quantitative claims: optimal context at 0.15W-0.40W, optimal agent count at $1/\sqrt{\delta_a}$, governance bifurcation at $\mu G / \gamma R = 1$. These are specific enough to test. Until they are tested, the framework's predictive power is undemonstrated.

**Cost analysis is inadequate.**

The paper's treatment of economics is scattered across remarks and parentheticals rather than being a first-class concern. The Remark on "Cost as a hard constraint" (Section 3.4) acknowledges that "the binding constraint on context size is often financial rather than degradation-based" but then does not integrate this into the optimization framework. In production, I often make decisions like "use a cheaper model for the planning step and a more expensive model for the coding step" or "limit context to 50K tokens not because of degradation but because each call costs $0.75." These are the dominant harness design decisions, and the framework cannot help with them.

The cost-per-PR table in the appendix (Table B.2) is useful but disconnected from the formal framework. A unified cost model that integrates token costs, compute costs, human review costs, and defect escape costs would be the single most valuable addition to this paper.

**Is the seven-pillar decomposition the right one?**

The semantic/execution/assurance axis decomposition is reasonable, but I would argue for a different factoring:

1. The Abstraction and Information pillars could be a single pillar ("Specification and Context") without loss.
2. Cost/Economics should be a pillar, not a footnote.
3. Human Interaction should be a pillar, not a limitation section.
4. The Governance pillar tries to do too much: it covers theory preservation (a philosophical problem), cascade control (an engineering problem), decision survival analysis (a management problem), and the ratchet lattice (a formal methods problem). These are four different concerns that happen to share the word "governance."

**Is the Accretion Category genuinely useful for practitioners?**

Yes, as a concept and taxonomy. No, as a detection mechanism. Naming the phenomenon (code that is correct, superfluous, individually defensible, and collectively harmful) is valuable because it gives teams a vocabulary for discussing a real problem. But the paper's own analysis shows that individual accretion is undecidable, so the only path to detection is aggregate monitoring of entropy proxies (duplication rate, refactoring ratio, complexity growth). Practitioners already do this. The formal framework adds a mathematical explanation for why individual detection is impossible, which is intellectually satisfying but does not change what you build.

### Questions for Authors

1. Have you implemented any of the 35 design principles in a production harness, and if so, which ones produced measurable improvement? The paper references GSD and RAPID as production systems; surely you have before/after data on at least some principles.

2. The Extended Amdahl's Law predicts $n^* \approx 1/\sqrt{\delta_a}$, giving 4-5 agents at $\delta_a = 0.05$. Cursor reportedly found that 20 parallel agents collapsed to effective throughput of 2-3. Does the model predict Cursor's specific experience, or is this a qualitative match only?

3. The governance capacity bound is presented as a "structural analogy" to Shannon's channel coding theorem. What would it take to make this a theorem rather than an analogy? Specifically, can you define the "governance channel" with sufficient precision to state and prove a channel coding theorem for governance?

4. You claim the optimal context budget is 0.15W to 0.40W. Anthropic's own documentation suggests using much more context in some scenarios (their prompt caching documentation implies heavy context loading). How do you reconcile your framework's prediction with your own company's product guidance?

5. The paper proposes VIH (Verified Iterations per Hour) as a key metric but acknowledges it has never been measured. What is the simplest instrumentation needed to measure VIH in an existing harness, and why has no one done it yet?

6. The Accretion Category is defined as requiring the existence of a smaller sufficient change, making detection undecidable. Could you weaken the definition to something semi-decidable (e.g., requiring only that the change exceeds a threshold on some complexity measure relative to the requirement size) while preserving the concept's utility?

7. The paper treats the human as Layer 4 of a verification cascade, but Section 9.7 acknowledges that humans are actually active co-pilots steering the agent at every step. If you were to write a "Human Interaction Pillar," what would its central theorem be?

8. The bifurcation theorem (Theorem 8.7) predicts coherence collapse when $\mu G / \gamma R < 1$. Have you observed this in practice? Can you identify a specific project that crossed this threshold and experienced the predicted collapse?

9. Several of your strongest empirical anchors (GitClear, DORA, METR) bear disproportionate evidentiary weight across 3-4 pillars each. If the GitClear methodology were challenged (e.g., the 8x duplication increase were shown to be an artifact of how they count template-generated code), which parts of the framework would survive and which would need revision?

10. The paper is approximately 100 pages. If you had to cut it to 30 pages for a top venue, which sections would you keep and which would you cut?

### Overall Assessment

**Score: 5 (below borderline accept)**

**Confidence: 4 (high -- I build these systems for a living)**

The paper is intellectually ambitious, unusually honest about its limitations, and addresses a real problem (the lack of principled foundations for harness architecture). The structural enforcement principle, compound error sensitivity, and context budget results are genuinely useful formalizations. The Accretion Category names a real phenomenon. The cross-pillar synthesis identifies non-obvious interactions (staleness-coordination feedback, FKG amplification across agent boundaries).

However, the gap between the formal apparatus and empirical validation is too large for a paper claiming to establish a "science." The Kolmogorov foundations are elegant but uncomputable. The governance capacity bound is an analogy dressed as a theorem. Many of the design principles are formalizations of known practice rather than novel predictions. The economics of harness operation, the single most important practical concern, are treated as a footnote. The paper is 3x too long for its validated contribution density.

This is a serious, thoughtful research agenda masquerading as established science. The verification roadmap (Section 12.2) is the most valuable part of the paper, because it tells the community exactly what experiments would validate or falsify the framework. If those experiments were conducted and the results supported the predictions, this framework would be a landmark contribution. As it stands, it is an ambitious hypothesis.

### Recommendation

**Weak Reject**

The paper should be restructured into two publications: (1) a focused 25-30 page paper presenting the three strongest results (structural enforcement dominance, compound error sensitivity, context budget optimization) with empirical validation from at least one production harness, and (2) a technical report or monograph presenting the full seven-pillar framework as a research program. The current format, a 100-page theoretical paper with no primary empirical data, falls between a conference paper (too long, too speculative) and a textbook (too formal, too incomplete). Neither venue is well-served by the current format.

The work is clearly the product of deep thinking and wide reading. It deserves publication in some form. But the form needs to match the maturity of the evidence. Publish the validated results as a paper; publish the framework as a living document that grows as the empirical program progresses. Do not present hypotheses as science, even when the hypotheses are good ones.
