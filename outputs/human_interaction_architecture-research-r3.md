# Human Interaction Architecture: Situated Action & HCI Theory (Contrarian/Alternative)

## Research Document R3: Against Formal Optimization of Human-AI Interaction

**Dimension:** Situated Action, HCI, and Cognitive Science perspectives on human-agent interaction in coding harnesses

**Stance:** Contrarian. This document steelmans the arguments against reducing human-AI interaction to formal optimization models (Bayesian or otherwise). It draws on situated action theory, distributed cognition, phenomenology, and empirical HCI research to show what formal models structurally cannot capture.

---

## 1. Lucy Suchman's Situated Action (1987/2007)

### The Core Critique

Lucy Suchman's *Plans and Situated Actions: The Problem of Human-Machine Communication* (1987; revised as *Human-Machine Reconfigurations*, 2007) is the foundational critique of plan-based models of human action. Working at Xerox PARC, Suchman conducted ethnographic studies of users interacting with a state-of-the-art photocopier equipped with an "expert help system," discovering that interaction breakdowns were not user failures but design failures rooted in false assumptions about how humans act.

The central thesis: "every course of action depends in essential ways upon its material and social circumstances" (Suchman 1987, p. 50). Plans are not deterministic programs that humans execute; they are "resources for situated action but do not in any strong sense determine its course" (Suchman 1987, p. 52). Real human behavior is contingent, improvisational, and responsive to changing circumstances in ways that no pre-specified plan can anticipate.

Suchman's argument operates at two levels:

1. **Ontological:** Human action is fundamentally different from machine computation. Humans navigate contingency through environmental cues, social context, and embodied know-how. Machines follow pre-specified instruction sequences.

2. **Epistemological:** The planning model (favored by AI researchers) treats plans as the cause of behavior. Suchman shows that plans are better understood as *retrospective rationalizations* of behavior. As she observed, "Instructions filter out everything that was actually done that instructions fail to mention," treating all other actions as irrelevant noise. Plans make sense primarily *after* action occurs, when we can identify which behaviors proved relevant.

### Application to Gate-Based Harness Interaction

A coding harness that operates on an approve/reject gate model is, in Suchman's terms, a classic planning system. It assumes:

- The developer has a pre-formed plan (the specification/prompt)
- The agent executes toward that plan
- The developer evaluates output against the plan
- The decision is binary: accept or reject

This model fails for the same reasons Suchman's photocopier failed. Real developer behavior during code review is situated: the developer's understanding of what they want evolves as they see what the agent produces. The specification is a resource for action, not a program for it. Developers routinely discover what they actually need by seeing what they *don't* need. The approve/reject gate cannot capture the iterative refinement of understanding that constitutes real programming work.

### What a "Situated" Harness Would Look Like

A harness design informed by situated action theory would:

- Support continuous mutual adjustment rather than discrete gates
- Enable the developer to modify goals mid-stream without restarting
- Treat breakdowns as informative rather than as failures to be minimized
- Recognize that the developer's "plan" is always provisional and evolving
- Provide rich contextual cues rather than forcing binary decisions

The deep problem for formal optimization: you cannot write a utility function over situated action because the goal itself is being constructed through the interaction. Optimizing for a fixed objective misunderstands the fundamental nature of the activity.

---

## 2. Peter Naur's "Programming as Theory Building" (1985)

### The Argument

Peter Naur's 1985 paper argues that the essential thing about programming is not the code artifact but the *theory* (mental model) the programmer holds. This theory encompasses:

- What the program does and why
- How the program maps onto the real-world problem domain
- How design decisions were made and what alternatives were rejected
- How the program should evolve in response to new requirements

In Naur's words: "Programming in essence is building a certain kind of theory, a theory of how certain affairs of the world will be handled by a computer program." The theory is the programmer's comprehensive understanding, following Gilbert Ryle's concept: a person who possesses a theory can answer questions about the concept, detect misconceptions, and suggest modifications.

The critical claim: "an essential part of any program, the theory of it, is something that could not conceivably be expressed, but is inextricably bound to human beings." This is not merely a practical difficulty; it is a principled impossibility. The theory cannot be fully captured in documentation, comments, or the code itself.

### Theory Death

When all developers who hold the theory of a program leave, the program experiences what Naur calls "death." The actual state of death "becomes visible when demands for modification of the program cannot be intelligently answered." Revival, meaning the reconstruction of the theory purely from documentation and code, "is strictly impossible" (Naur 1985). New developers must either work alongside theory holders or effectively start over.

### The AI Code Generation Problem: Comprehension Debt

If a human did not write the code, no theory was built during the writing. AI-generated code arrives without anyone having done the cognitive work of theory construction. This creates what recent literature calls "comprehension debt" or "cognitive debt," defined by Margaret-Anne Storey as "the erosion of the shared mental models teams need to maintain, adapt, and safely evolve systems over time."

Critically, cognitive debt "accumulates even when the AI-produced code is flawless" (Pellon 2026). It is a comprehension problem, not a code quality problem. As Addy Osmani describes it, there is a growing gap between "what your codebase contains and what your team actually comprehends."

Empirical evidence supports this concern:

- **MIT Media Lab EEG study:** LLM users showed "the weakest connectivity, the least ownership of their output, and the poorest recall" compared to unassisted or search-assisted conditions.
- **Comprehension quizzes:** Developers using AI for code generation scored 17% lower on comprehension quizzes (50% vs. 67%). The largest declines appeared in debugging tasks. However, developers using AI in a "question-driven" mode scored above 65%, suggesting methodology matters more than the tool itself (Osmani 2026).
- **Cognitive offloading correlation:** A survey of 666 participants found AI use correlated strongly with cognitive offloading (r = +0.72) and inversely with critical thinking (r = -0.75), with younger developers showing the strongest effects.

### Implications for Harness Design

Naur's framework predicts that any interaction model optimizing for code throughput will systematically degrade theory. A harness that generates code faster than the developer can build theory is, in Naur's terms, producing dead code: code for which no theory exists.

The formal optimization perspective treats code as the output. Naur insists the *theory* is the output. These are fundamentally different objective functions. Optimizing for one may actively harm the other.

---

## 3. Wittgenstein's Language Games (Philosophical Investigations, 1953)

### Meaning as Use

Ludwig Wittgenstein's *Philosophical Investigations* (1953) introduced the concept of "language games" (Sprachspiele). The foundational claim, from section 43: "For a large class of cases, though not for all, in which we employ the word 'meaning' it can be defined thus: the meaning of a word is its use in the language." Words do not have fixed meanings attached to them; they acquire meaning through the practices, rules, and contexts in which they are deployed.

A language game is not merely a linguistic activity; it encompasses "the language and the activities into which it is woven" (PI section 7). The rules of a language game are constituted by practice, not pre-specified in a formal rule book. And these games exist within what Wittgenstein calls "forms of life" (Lebensformen), the shared cultural backgrounds, customs, and practices that make mutual understanding possible: "to imagine a language means to imagine a form of life" (PI section 19).

### Human-Agent Interaction as a Language Game

When a developer writes a prompt for an AI agent, they are initiating a language game. But what kind of game is it? Consider the moves:

1. **The prompt** is a move in the game. Its meaning is not determined by its semantic content alone but by how the developer expects it to function (their intent, the context, the codebase, the unstated constraints).
2. **The agent's response** is a move. Its meaning is determined by how the developer *uses* it, not by what the model "intended."
3. **Approval/rejection** is a move that communicates something back, but its meaning is impoverished: it says "yes" or "no" without saying *why*, violating Wittgenstein's insight that understanding requires shared practice.

As Coeckelbergh (2017) argues in extending Wittgenstein to technology, we should distinguish "surface grammar" (explicit operating instructions) from "depth grammar" (the implicit cultural norms and shared understandings that make tool use meaningful). Current harness interactions operate almost entirely at the level of surface grammar. The depth grammar, including why this approach rather than another, what architectural principles are at stake, what the developer's aesthetic sensibilities require, has no formal channel.

### The Specification Problem

Wittgenstein's framework reveals a deep problem with specification languages. A specification seems to pin down meaning formally, but: "If you give a person a rule and then say 'Follow it,' the way to follow the rule is never determined by the rule itself." Any formal specification requires interpretation, and that interpretation happens within a form of life that cannot itself be formalized. The developer and the agent do not share a form of life, which means that even a "precise" specification is being interpreted through incommensurable frameworks.

As applied to prompt engineering: "Prompt design is game-rule design" (STRV 2026). Clear rules (role, goal, format, constraints) produce stronger results; unclear or missing context leads to hallucinations. But the deeper Wittgensteinian point is that the *game itself* is established through ongoing play, not through upfront specification. No amount of prompt engineering can substitute for the shared practice that grounds meaning.

---

## 4. Edwin Hutchins' Distributed Cognition (1995)

### The Framework

Edwin Hutchins' *Cognition in the Wild* (1995) argued that "cultural activity systems have cognitive properties of their own that are different from the cognitive properties of the individuals who participate in them." Cognition is not confined to individual brains; it is distributed across people, artifacts, and the environment.

Through detailed ethnographic analysis of naval navigation teams, Hutchins demonstrated that the cognitive system performing navigation was the *entire team plus their instruments*, not any individual navigator. A system "that is larger than an individual may have cognitive properties in their own right that cannot be reduced to the cognitive properties of individual persons" (Hutchins 1995, p. 266). Navigation tools as cognitive artifacts "have cognitive properties that are radically different from the cognitive properties of the person alone."

### The Human-Agent-Harness as a Cognitive System

Applying Hutchins' framework to a coding harness, the relevant cognitive system is:

**Human + Agent + IDE + Codebase + Tests + Version Control + Harness Orchestrator**

This system has emergent cognitive properties that no component possesses alone. The human contributes theory, judgment, aesthetic sensibility, and domain knowledge. The agent contributes pattern matching, code generation, and vast recall. The IDE contributes structural representation. Tests contribute verification. The harness contributes orchestration and workflow.

### Where Errors Arise

Distributed cognition predicts that errors arise at the *interfaces* between components, not within components. This means:

1. **Specification errors:** Failures of translation between human intent and prompt language (human-to-harness interface)
2. **Generation errors:** Failures of the agent to produce code matching the prompt (harness-to-agent interface)
3. **Integration errors:** Failures to connect generated code with existing codebase (agent-to-codebase interface)
4. **Comprehension errors:** Failures of the human to understand generated code (agent-to-human interface)
5. **Verification errors:** Failures of the test suite to catch problems (code-to-test interface)

A formal model that focuses only on agent error rates misses most of the cognitive system. The harness is not a pipeline delivering code; it is a cognitive infrastructure in which understanding is produced (or fails to be produced) at every interface.

### Where Intelligence Resides

In the distributed cognition framework, intelligence is a property of the *system*, not of any component. The question "How intelligent is the AI agent?" is, from this perspective, malformed. The right question is: "How intelligent is the human-agent-harness system, and how robust is it to perturbation at each interface?"

This has direct consequences for optimization. Optimizing the agent's code quality while degrading the human-agent interface (e.g., by increasing output volume beyond the human's comprehension capacity) may reduce the intelligence of the *system* even while increasing the intelligence of one component.

---

## 5. Design Patterns for Human-AI Interaction

### The Three Major Frameworks

Three industry-leading frameworks codify design principles for human-AI interaction:

**Microsoft HAX Guidelines (Amershi et al. 2019, CHI Best Paper):** 18 guidelines organized by interaction phase:

- *Initially:* G1: Make clear what the system can do. G2: Make clear how well the system can do what it can do.
- *During Interaction:* G3: Time services based on context. G4: Show contextually relevant information. G5: Match relevant social norms. G6: Mitigate social biases.
- *When Wrong:* G7: Support efficient invocation. G8: Support efficient dismissal. G9: Support efficient correction. G10: Scope services when in doubt. G11: Make clear why the system did what it did.
- *Over Time:* G12: Remember recent interactions. G13: Learn from user behavior. G14: Update and adapt cautiously. G15: Encourage granular feedback. G16: Convey consequences of user actions. G17: Provide global controls. G18: Notify users about changes.

**Google PAIR Guidebook:** Organized around mental models and user expectations. Key patterns include setting expectations for adaptation, onboarding in stages, planning for co-learning, and accounting for user expectations of human-like interaction. Central insight: "Hiding how a product works can set users up for confusion and broken trust," but explaining capabilities requires balancing technical detail against accessibility.

**Apple HIG for Machine Learning:** Distinguishes between implicit feedback (arising naturally from interaction) and explicit feedback (solicited responses). Key principle: ML features should provide immediate value when users make corrections. Recognizes that implicit feedback "tends to reinforce people's behavior, which can improve the user experience in the short term, but may worsen it in the long term."

### How Current Coding Harnesses Fare

Current coding harnesses (Cursor, Claude Code, Copilot Workspace, Aider, etc.) violate many of these established guidelines:

| Guideline | Status in Typical Harnesses |
|---|---|
| G1: Make clear what system can do | Partial; capabilities are vague and context-dependent |
| G2: Communicate quality level | Poor; no confidence scores or error rate disclosure |
| G8: Support efficient dismissal | Variable; some tools insert suggestions intrusively |
| G9: Support efficient correction | Poor; editing AI output often harder than writing from scratch |
| G11: Explain why | Poor; rationale for code choices rarely provided |
| G15: Encourage granular feedback | Poor; most feedback is binary (accept/reject) |
| G17: Provide global controls | Improving; most harnesses now offer model/permission settings |

The 63% of developers who report that "AI tools lack context of codebase" as a primary limitation (GitHub Copilot research) reflects systematic failure on G4 (show contextually relevant information). The 66% who "don't trust the output or answers" reflects failure on G1 and G2.

These are not novel discoveries. The guidelines distill over 20 years of HCI research. That current harnesses violate them suggests the field is optimizing for the wrong variables: code throughput rather than interaction quality.

---

## 6. Conversational vs. Gate-Based Interaction

### Clark's Grounding Theory

Herbert H. Clark's *Using Language* (1996) and his earlier work with Susan Brennan (Clark & Brennan 1991) established that "language use is really a form of joint action," not a pipeline of information transfer. Communication succeeds through *grounding*, "the collaborative process through which participants try to reach mutual belief" about what has been communicated (Clark & Brennan 1991).

Grounding operates through a two-phase process: *presentation* (one party offers an utterance) and *acceptance* (the other demonstrates understanding through acknowledgments, relevant next turns, back-channel responses, or repair initiations). The *principle of least collaborative effort* states that participants minimize total effort in both phases, accounting for the work of *both* parties.

Critically, the costs of grounding vary by medium. Clark and Brennan identify constraints that different media impose on grounding: co-presence, visibility, audibility, cotemporality, simultaneity, sequentiality, reviewability, and revisability. Each constraint affects how easily participants can establish and repair mutual understanding.

### The Gate Model as Communication Medium

An approve/reject gate is a communication medium with specific grounding constraints:

- **No cotemporality:** The developer sees the finished product, not the process
- **No simultaneity:** Only one party acts at a time
- **Minimal back-channel:** No "uh huh" or "wait, not that" during generation
- **Low expressiveness:** The response vocabulary is {accept, reject}, sometimes {accept, reject, edit}
- **High repair cost:** If rejected, the developer must re-specify from scratch or manually edit

This is, in Clark's framework, an extremely costly medium for grounding. The principle of least collaborative effort predicts that developers will compensate by over-specifying prompts (front-loading effort into the presentation phase because the acceptance phase is so impoverished) or by accepting suboptimal output to avoid the repair cost.

### Conversational Alternatives

Recent research on Programming with Interactive Grounding (PING) demonstrates the value of conversational approaches. PING leverages inline code comments for bidirectional communication during generation. In a user study with 12 programmers, "PING outperformed GitHub Copilot and Multi-Turn Program Synthesis in task success rate by 16.7% and 58.3%, respectively" (2025).

Conversational interaction enables:

- **Progressive grounding:** Understanding develops incrementally, not in a single shot
- **Mid-course correction:** The developer can redirect without rejecting entirely
- **Explanatory repair:** The developer can ask *why* a choice was made
- **Ambiguity resolution:** As research notes, "users' natural language descriptions of intent often map to multiple valid code implementations, requiring iterative clarifications"

### The Formalizability Tradeoff

Gate-based interaction is more formalizable: each gate is a discrete decision point amenable to Bayesian modeling. Conversational interaction is less formalizable but more effective at establishing common ground. This is the core tension: the interaction model that is easiest to optimize formally is also the one that is poorest at supporting the cognitive work of mutual understanding.

---

## 7. Interruption, Flow, and Context Switching

### The Empirical Foundation

**Mark, Gudith, & Klocke (2008), "The Cost of Interrupted Work: More Speed and Stress" (CHI 2008):**

The landmark finding: "It takes an average of 23 minutes and 15 seconds to get back to the task after an interruption." Workers completed interrupted tasks about 7% faster but at the cost of "significantly higher workload, higher stress, more frustration" as measured by NASA TLX scales. Interruptions do not merely delay work; they fundamentally alter the quality and experience of the work.

**Parnin & Rugaber (2011), "Resumption Strategies for Interrupted Programming Tasks":**

Analysis of 10,000 recorded programming sessions from 86 programmers, supplemented by a survey of 414 programmers, revealed:

- Only 10% of sessions resumed programming activity within 1 minute of an interruption
- Only 7% of sessions involved no navigation to other code locations before editing resumed
- A Georgia Tech study found programmers take 10-15 minutes to start editing code after resuming from an interruption

These findings establish that programming is an activity with extremely high context-switching costs. The mental model (Naur's "theory") that a programmer holds during active work is fragile and expensive to reconstruct.

### Flow State and Harness Interaction

Csikszentmihalyi's flow model identifies four conditions for optimal performance: a clear goal held in working memory, immediate feedback, challenge-skill balance, and a protected time window. Research reports that "when flow conditions exist, engineers report 3.4x higher productivity and increased work satisfaction."

Mihaly Csikszentmihalyi's research indicates achieving flow takes approximately 15 minutes of uninterrupted focus. This means a single review gate, if it breaks the developer's concentration, can cost 15+ minutes of recovery time. If the harness presents review gates every 5 minutes, the developer may *never* achieve flow.

### The Review Gate Paradox

This creates a paradox: review gates exist to maintain quality and human oversight, but each gate is a potential interruption that degrades the cognitive state required for quality oversight. A developer who is constantly context-switching between "reviewing AI output" and "thinking about the problem" cannot do either well.

The cost structure:
- **No review gates:** Developer loses oversight, comprehension debt accumulates
- **Frequent review gates:** Developer loses flow, review quality degrades, interruption stress accumulates
- **Infrequent review gates:** Large batches of AI output overwhelm review capacity

There is no formal optimum that resolves this trilemma because the variables (flow state, review quality, comprehension depth) are not independent and their interactions are non-linear and person-dependent.

---

## 8. Developer Experience and Expertise Moderation

### The Dreyfus Model of Skill Acquisition

Stuart and Hubert Dreyfus's five-stage model (1980; elaborated in *Mind Over Machine*, 1986) describes the progression from novice to expert:

1. **Novice:** Relies on context-free rules and step-by-step instructions. Slow, deliberate, effortful.
2. **Advanced Beginner:** Recognizes situational aspects beyond formal rules. Begins pattern recognition.
3. **Competent:** Organizes information, develops routines, makes deliberate plans. Can feel overwhelmed.
4. **Proficient:** Develops intuitive perspective; directly senses what is relevant in a situation.
5. **Expert:** Acts intuitively without reflective decision-making. "When things are proceeding normally, experts don't solve problems and don't make decisions; they do what normally works" (Dreyfus & Dreyfus 1986).

The key transition is from rule-following (stages 1-3) to intuitive perception (stages 4-5). Experts do not apply formal rules faster; they perceive situations differently. Their knowledge is embodied, contextual, and largely tacit.

### Empirical Evidence on Experience as a Moderating Variable

**METR Randomized Controlled Trial (2025):** 16 experienced open-source developers (averaging 5 years on their repositories) using AI tools took 19% longer to complete tasks. These were highly experienced developers working in familiar codebases. Developers anticipated AI would accelerate their work by 24% and, after the 19% slowdown, still believed it saved them 20%. The acceptance rate was below 44%, meaning most AI-generated code was rejected, and "developers often had to review, test, and modify code, only to reject it in the end."

**Fastly Survey (July 2025, n=791):** Senior developers (10+ years) ship approximately 2.5x more AI-generated code than juniors (0-2 years). Specifically, 32% of seniors report over half their shipped code is AI-generated vs. 13% of juniors. Nearly 30% of seniors edit AI output significantly enough to offset time savings, vs. only 17% of juniors. Despite greater editing demands, 59% of seniors believe AI accelerates shipping vs. 49% of juniors.

**Google Internal RCT (2024):** ~100 software engineers found that developers using AI completed tasks approximately 21% faster on average. Senior developers saw slightly larger gains, "leveraging AI more effectively on complex codebase tasks, whereas juniors might have been overwhelmed or not known how to best use it."

**GitClear Longitudinal Analysis (2024-2025):** Code churn (percentage of lines revised within two weeks) grew from 3.1% in 2020 to 5.7% in 2024. Refactoring dropped from 24.1% of changed lines in 2020 to 9.5% in 2024. Copy-pasted code surged from 8.3% to 12.3% (a 48% relative increase). Code duplication roughly quadrupled.

**CodeRabbit Analysis:** AI-co-authored code contained 1.7x more major issues and 2.74x more security vulnerabilities than human-written code.

**Stack Overflow 2025 Developer Survey:** Experienced developers were the most cautious about AI tool accuracy, with the lowest "highly trust" rate (2.6%) and the highest "highly distrust" rate (20%).

**Cognitive Offloading Study (n=666):** AI use correlated strongly with cognitive offloading (r = +0.72) and inversely with critical thinking (r = -0.75), with younger developers showing the strongest effects.

### The Experience Paradox

The data reveals a paradox: the developers who benefit most from AI (seniors who can evaluate, edit, and contextually deploy AI output) are the ones who need it least. The developers who might seem to benefit most (juniors for whom AI generates code they couldn't write) are the ones most harmed by the cognitive debt it creates. Juniors who accept AI-generated code without building theory are, in Naur's framework, accumulating dead code and stunting the very skill development (theory building) that would make them effective senior developers.

The Dreyfus model predicts this: novices rely on explicit rules and are precisely the users most likely to treat AI output as authoritative (it looks like expert output). Experts rely on tacit perception and are better positioned to recognize when AI output "feels wrong," even before they can articulate why.

A formal interaction model that treats all developers as interchangeable will systematically under-serve both populations: over-gating experts (who perceive problems intuitively and find gates interruptive) and under-gating novices (who need more scaffolded understanding, not more code).

---

## 9. Critique of Formal Optimization of Human Interaction

### The Phenomenological Tradition

The philosophical case against formalizing human-AI interaction draws on three converging traditions:

**Hubert Dreyfus (1972, 1992)** identified three false assumptions underlying AI: the psychological assumption (the mind computes on discrete symbols), the epistemological assumption (all activity can be formalized as predictive rules), and the ontological assumption (reality consists of independent atomic facts). His arguments come from the phenomenological tradition of Martin Heidegger, who argued that "our being is highly context-bound, making the two context-free assumptions false."

Dreyfus argued that expert knowledge is fundamentally different from rule-following: experts perceive situations holistically and respond intuitively, in ways that cannot be captured by any formal procedure. The ceteris paribus problem (specifying "everything else being equal") represents "the background of human knowledge, and what constitutes 'everything else equal' in any situation can never be fully spelled out without regress."

**Michael Polanyi (1966)** established that "we know more than we can tell." Tacit knowledge, the knowledge embedded in practice, embodied skill, and contextual awareness, is "inextricably personal and context-dependent." His classic example: "The skill of a driver cannot be replaced by a thorough schooling in the theory of the motorcar." Formal models can only capture what can be made explicit; Polanyi's paradox says the most important knowledge resists such capture.

**James C. Scott (1998)** in *Seeing Like a State* showed how centralized formal schemes fail when they ignore local, practical knowledge (metis). High modernist projects, from Soviet collectivization to planned cities, fail because they treat legibility (amenability to formal measurement and control) as a virtue in itself, destroying the very local knowledge that makes systems work. Scott's key insight: "Certain forms of knowledge and control require a narrowing of vision." The advantage of tunnel vision "is that it brings into sharp focus certain limited aspects of an otherwise far more complex and unwieldy reality," but this very simplification destroys essential information.

### The Irreducible Qualitative Dimension

The convergence of these critiques identifies what formal models structurally miss:

1. **Situatedness (Suchman):** The goals of interaction are constructed *through* interaction, not specified in advance. A utility function requires a fixed objective; situated action has no fixed objective.

2. **Tacit Theory (Naur/Polanyi):** The most valuable output of programming (the theory, the understanding) is not measurable by any code metric. Optimizing measurable code properties may degrade unmeasurable comprehension.

3. **Meaning in Practice (Wittgenstein):** The meaning of specifications, prompts, and code is determined by use in a form of life, not by formal semantics. Two people can agree on the syntax of a specification and disagree completely on what it means in practice.

4. **Systemic Cognition (Hutchins):** Intelligence is a property of the human-agent-harness system, not of any component. Optimizing components independently may degrade system-level performance.

5. **Embodied Expertise (Dreyfus):** Expert judgment operates through perception and intuition, not through rule application. A Bayesian model of review decisions treats every review as a calculation; the expert experiences review as perception.

6. **Local Knowledge (Scott):** Every developer, every codebase, every team has specific local knowledge that resists formalization. A universal optimization model is, in Scott's terms, a high modernist scheme that will fail precisely where local conditions diverge from the model's assumptions.

### Specific Arguments Against Bayesian Interaction Models

A Bayesian model of human-AI interaction (e.g., modeling developer trust as a prior updated by evidence of agent quality) faces the following structural limitations:

**The Prior Problem:** What is the developer's prior over code quality? This is not a single number; it is a situated, contextual, evolving judgment that depends on the specific codebase, the specific task, the developer's current cognitive state, their fatigue level, their relationship with the code, and dozens of other factors that vary moment to moment.

**The Likelihood Problem:** The developer's ability to evaluate AI output is itself variable and depends on flow state, domain familiarity, comprehension depth, time pressure, and the specific nature of the code. There is no stable likelihood function.

**The Utility Problem:** What is the developer optimizing? Not a single objective. They are simultaneously optimizing for code correctness, comprehension, maintainability, aesthetic satisfaction, learning, team alignment, architectural coherence, and their own cognitive comfort. These objectives are incommensurable and their relative weights shift constantly.

**The Independence Problem:** Bayesian models typically assume conditional independence of observations. But each review decision changes the developer's understanding, which changes how they interpret subsequent output. The observations are deeply dependent on the sequence of prior observations.

**The Measurement Problem:** The key variables (comprehension, theory quality, cognitive state) are not observable. Any formal model must proxy them with observable quantities (approval rates, time-to-review, edit distance), and these proxies may be systematically misleading. The METR study demonstrates this: developers *believed* AI made them faster when it made them 19% slower.

### The Steelman: Why Formalization Actively Harms

The strongest version of the argument is not that formal models are incomplete (which is trivially true) but that the act of formalization changes the system in harmful ways. When you optimize for a metric:

1. **Goodhart's Law applies:** The metric becomes the target and ceases to be a good metric. If you optimize for approval rate, developers learn to approve more; if you optimize for review time, developers learn to review faster (but less carefully).

2. **Legibility displaces quality:** Scott's framework predicts that making interaction "legible" to formal models requires stripping it of the contextual richness that makes it effective. A harness designed for formal measurement will constrain interaction to what can be measured, not to what is useful.

3. **Flow is sacrificed:** Every measurement point is a potential interruption. Instrumenting the developer's cognitive process (even passively, through timing and approval tracking) changes the experience of that process.

4. **The map replaces the territory:** When a formal model of interaction becomes the basis for design decisions, developers begin interacting with the *model's assumptions* rather than with the actual problem. This is what Suchman observed with the Xerox copier: the machine's model of the user became the constraint that the user had to navigate, rather than the task itself.

---

## 10. Synthesis: What Formal Models Miss and Why It Matters

### Contradictions Between Sources

Several notable contradictions emerge from this research:

1. **Productivity direction:** Google's internal RCT found AI tools make developers 21% faster; METR's RCT found they make experienced developers 19% slower. This 40-percentage-point gap likely reflects differences in task type (enterprise greenfield vs. mature OSS maintenance), developer familiarity with AI tools, and codebase complexity. Both findings are credible, meaning the effect of AI on productivity is not a stable quantity but a situated, contextual outcome, precisely what Suchman's framework predicts.

2. **Experience moderation direction:** Fastly data shows seniors ship 2.5x more AI code; METR data shows experienced developers are slowed. This contradiction dissolves if we distinguish "ships AI code" from "is faster with AI code." Seniors may ship more AI code *despite* it being slower per-task because they deploy it selectively, while still spending more total time on review and editing.

3. **Code quality:** GitHub's own research claims AI improves readability by 3.62% and maintainability by 2.47%. GitClear's independent analysis shows code churn doubling and refactoring plummeting. These measure different things (local quality of individual suggestions vs. aggregate quality of codebases over time) and the contradiction suggests that local quality improvements can coexist with systemic quality degradation.

4. **Trust calibration:** Google's DORA report found a 7.2% decrease in delivery stability for every 25% increase in AI adoption, while the same organization promotes AI tools for developer productivity. The contradiction between institutional advocacy and institutional measurement is itself evidence that formal metrics (productivity gains) are being privileged over qualitative outcomes (comprehension, stability).

### The Fundamental Asymmetry

Formal models can capture what is measurable, repeatable, and context-free. The most important aspects of human-AI interaction in programming are unmeasurable (comprehension), unrepeatable (situated), and deeply contextual (dependent on specific developers, codebases, and moments). This is not a temporary limitation awaiting better instrumentation; it is a structural feature of the phenomenon.

The contrarian position is not that formal models are useless. It is that they are *dangerous* when treated as sufficient. A harness designed entirely around formal optimization of interaction will, in Suchman's terms, embody a model of the developer that fails to account for the essential resources of effective programming, producing interaction breakdowns that the formal model is structurally unable to detect.

The alternative is not to abandon formalism but to subordinate it to the qualitative: design the interaction for situated, embodied, theory-building humans first, then use formal models to measure what you can within that design. The formal model should be an instrument for the designer, not a substitute for understanding.

---

## Sources

### Primary Sources (Books and Foundational Papers)

- Suchman, L. (1987). *Plans and Situated Actions: The Problem of Human-Machine Communication.* Cambridge University Press.
- Suchman, L. (2007). *Human-Machine Reconfigurations: Plans and Situated Actions.* 2nd edition. Cambridge University Press.
- Naur, P. (1985). "Programming as Theory Building." *Microprocessing and Microprogramming* 15(5): 253-261. [PDF](https://gwern.net/doc/cs/algorithm/1985-naur.pdf)
- Wittgenstein, L. (1953). *Philosophical Investigations.* Translated by G.E.M. Anscombe. Basil Blackwell.
- Hutchins, E. (1995). *Cognition in the Wild.* MIT Press. [MIT Press](https://mitpress.mit.edu/9780262581462/cognition-in-the-wild/)
- Clark, H.H. (1996). *Using Language.* Cambridge University Press.
- Clark, H.H. & Brennan, S.E. (1991). "Grounding in Communication." In L.B. Resnick et al. (Eds.), *Perspectives on Socially Shared Cognition.* APA. [PDF](https://web.stanford.edu/~clark/1990s/Clark,%20H.H.%20_%20Brennan,%20S.E.%20_Grounding%20in%20communication_%201991.pdf)
- Dreyfus, H.L. (1972/1992). *What Computers Still Can't Do: A Critique of Artificial Reason.* MIT Press. [MIT Press](https://mitpress.mit.edu/9780262540674/what-computers-still-cant-do/)
- Dreyfus, H.L. & Dreyfus, S.E. (1986). *Mind Over Machine: The Power of Human Intuition and Expertise in the Era of the Computer.* Free Press.
- Dreyfus, S.E. (2004). "The Five-Stage Model of Adult Skill Acquisition." *Bulletin of Science, Technology & Society* 24(3): 177-181.
- Polanyi, M. (1966). *The Tacit Dimension.* University of Chicago Press.
- Scott, J.C. (1998). *Seeing Like a State: How Certain Schemes to Improve the Human Condition Have Failed.* Yale University Press.
- Csikszentmihalyi, M. (1990). *Flow: The Psychology of Optimal Experience.* Harper & Row.

### Empirical Studies

- Mark, G., Gudith, D., & Klocke, U. (2008). "The Cost of Interrupted Work: More Speed and Stress." *CHI '08: Proceedings of the SIGCHI Conference on Human Factors in Computing Systems,* 107-110. [PDF](https://ics.uci.edu/~gmark/chi08-mark.pdf)
- Parnin, C. & Rugaber, S. (2011). "Resumption Strategies for Interrupted Programming Tasks." *Software Quality Journal* 19(1): 5-34. [Springer](https://link.springer.com/article/10.1007/s11219-010-9104-9)
- Amershi, S., Weld, D., Vorvoreanu, M., et al. (2019). "Guidelines for Human-AI Interaction." *CHI 2019.* [ACM](https://dl.acm.org/doi/10.1145/3290605.3300233)
- Becker, S., Rush, A., et al. (2025). "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity." METR. [METR Blog](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) | [arXiv](https://arxiv.org/abs/2507.09089)
- GitClear (2025). "AI Copilot Code Quality: Evaluating 2024's Increased Defect Rate." [GitClear](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
- Fastly (2025). "Vibe Shift in AI Coding: Senior Developers Ship 2.5x More Than Juniors." [Fastly Blog](https://www.fastly.com/blog/senior-developers-ship-more-ai-code)
- Stack Overflow (2025). "2025 Developer Survey: AI Section." [Stack Overflow](https://survey.stackoverflow.co/2025/ai)

### Design Guidelines and Frameworks

- Google PAIR (2019, updated 2024). "People + AI Guidebook." [PAIR](https://pair.withgoogle.com/guidebook/)
- Apple (2024). "Human Interface Guidelines: Machine Learning." [Apple Developer](https://developer.apple.com/design/human-interface-guidelines/machine-learning)
- Microsoft (2019, updated 2024). "HAX Toolkit: Guidelines for Human-AI Interaction." [Microsoft HAX](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)

### Contemporary Analysis

- Osmani, A. (2026). "Comprehension Debt: The Hidden Cost of AI Generated Code." [AddyOsmani.com](https://addyosmani.com/blog/comprehension-debt/)
- Pellon, M. (2026). "Cognitive Debt: The AI Risk Nobody's Measuring." [MichellePellon.com](https://michellepellon.com/blog/2026-02-23-cognitive-debt)
- Storey, M-A. (2026). "How Generative and Agentic AI Shift Concern from Technical Debt to Cognitive Debt." [MargaretStorey.com](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/)
- Coeckelbergh, M. (2017). "Technology Games: Using Wittgenstein for Understanding and Evaluating Technology." *Science and Engineering Ethics* 24: 1503-1519. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6209041/)
- STRV (2026). "Language Games and LLMs: What Wittgenstein Can Teach Us." [STRV Blog](https://www.strv.com/blog/language-games-and-llms-what-wittgenstein-can-teach-ai-engineers)
- Nutrient.io (2025). "Peter Naur's Legacy: Mental Models in the Age of AI Coding." [Nutrient Blog](https://www.nutrient.io/blog/peter-naur-legacy-mental-models-age-ai-coding/)
