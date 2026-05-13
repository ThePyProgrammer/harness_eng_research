# Review: "Towards a Science for AI Coding Agent Harnesses"

## Perspective: Working Harness Engineer

Reviewer background: Ships AI coding agent harnesses. Has dealt with tool orchestration, context window management, agentic loops, error recovery, and the daily reality of LLMs producing plausible but wrong code at scale.

---

## Central Question: Does this framework help me build a better harness?

Short answer: mostly no. The formalism is intellectually interesting but operationally inert. The six design principles range from "yes, obviously" to "nice confirmation of something we already do." None of them would have changed a design decision I have made or seen made in practice.

---

## Principle-by-Principle Assessment

**P1: Operate at the Specification Level** -- OBVIOUS

Every harness team already knows that better prompts produce better code. The paper dresses this up with Kolmogorov complexity (the spec must contain the program's information), but the actionable version is just "write better prompts," which is what every user guide already says. The formalism does not tell you *how* to get users to write better specs, which is the actual hard problem.

**P2: Support Multiple Levels of Formalism** -- VALIDATING

This is a reasonable observation, and the sigma-kappa framing gives it some structure. AWS's selective TLA+ usage is a good example. But in practice, harness teams already support everything from one-line prompts to detailed markdown specs to inline type annotations. The principle confirms existing behavior without producing new design guidance. It does not tell you where the formalism boundaries should fall for a given project.

**P3: Use AI as a Formalism Translator** -- VALIDATING

The idea that AI can generate formal specs for human review (rather than requiring humans to author them) is genuinely useful framing. This is the one principle where the paper's theoretical grounding (reviewing is cheaper than authoring; the refinement lattice makes this precise) adds modest value. Still, teams building vericoding-style workflows arrived at this independently.

**P4: Employ Automatic, Continuous Verification** -- OBVIOUS

Run tests and linters on every change. This is CI/CD. The paper links it to monotonicity of the refinement lattice, but the engineering practice predates the formalism by decades. No harness engineer needed a theorem to know that automated verification catches LLM mistakes.

**P5: Select Coordination Topology by Task Structure** -- VALIDATING

The Kim et al. empirical data (17x error amplification for independent agents, capability saturation at 45%) is genuinely useful. But the principle itself ("pick the right architecture for the task") is standard systems engineering. The paper's contribution is connecting it to the abstraction gap formalism, which adds notation but not insight. The actual hard problem, automatically detecting task structure and selecting topology at runtime, is not addressed.

**P6: Preserve the Theory** -- VALIDATING

Naur's "programming as theory building" is a genuinely important and underappreciated idea. Capturing conversation logs and design rationale is good advice. But again, tools like Cursor and Claude Code already persist conversation history. The principle validates existing practice.

---

## Issues

**MAJOR: The formalism is operationally vacuous.** Kolmogorov complexity is uncomputable. The paper acknowledges this but then builds six design principles on it. The "computable proxies" mentioned (function point ratios, type-system expressiveness) are hand-waved; no concrete approximation algorithm is provided. A harness engineer cannot measure G(S, P) for a real specification-code pair, which means the framework cannot guide real-time design decisions.

**MAJOR: The paper ignores the actual hard problems of harness engineering.** Context window management, tool selection policies, error recovery strategies, cost optimization, latency budgets, permission models, sandbox security, streaming UX, rate limiting, credential management, caching strategies for repeated tool calls. These are the problems that consume 90% of harness engineering effort. The paper's abstraction gap framework has nothing to say about any of them.

**MAJOR: The "uncanny valley" observation is interesting but unsupported.** The claim that sigma in [0.3, 0.45] is a dead zone is based on eyeballing the thinker placement table, where the placements are themselves "ordinal estimates" (i.e., vibes). This is the paper's most novel empirical claim, and it rests on the weakest evidence.

**MINOR: The multi-agent extension adds notation without insight.** The paper admits it cannot connect Kim et al.'s empirical metrics to the Kolmogorov framework ("dimensional heterogeneity"), then presents the empirical findings "qualitatively." This is honest but undermines the paper's thesis that a formal framework produces actionable guidance. If the formalism cannot absorb the best available empirical data, what is it for?

**MINOR: The thinker placement is fun but not useful.** Placing Dijkstra and Karpathy on a 2D plane is a nice pedagogical device for a survey paper. It does not help me design a harness. The sigma and kappa values are made up (the paper says "ordinal estimates based on published positions"), and no practitioner will consult this table when making an engineering decision.

**MINOR: The paper conflates specification formalism with harness design.** A harness is infrastructure (tool orchestration, context management, agentic loop control). The paper is really about specification languages and their relationship to code. These are related but distinct concerns. A harness engineer's job is to make the agent effective regardless of whether the user writes in English, Gherkin, or TLA+.

---

## Summary Ratings

| Principle | Rating | Notes |
|-----------|--------|-------|
| P1: Operate at Spec Level | OBVIOUS | "Write better prompts" with math |
| P2: Multiple Formalism Levels | VALIDATING | Confirms mixed-formalism practice |
| P3: AI as Formalism Translator | VALIDATING | Best principle; modest new framing |
| P4: Continuous Verification | OBVIOUS | This is CI/CD |
| P5: Topology by Task | VALIDATING | Kim data useful; principle is standard |
| P6: Preserve the Theory | VALIDATING | Good idea, already common practice |

**Bottom line:** The paper is a competent synthesis of foundational CS theory applied to a timely topic. As a theory paper it has merit. But for a working harness engineer, the six principles are post-hoc rationalizations of decisions we already made for straightforward engineering reasons. The formalism lends mathematical prestige to intuitions without producing new actionable guidance. The paper would be stronger if it identified even one concrete case where the framework would have led to a *different* design decision than engineering intuition alone.
