# Automation Supervision & Human Factors: Historical and Theoretical Foundations

## Research Document R1: Primary Source Analysis for AI Coding Agent Harness Design

---

## 1. Bainbridge's Ironies of Automation (1983)

### Original Formulation

Lisanne Bainbridge's "Ironies of Automation," published in *Automatica* (Vol. 19, No. 6, pp. 775-779), identifies a set of paradoxes that emerge when designers automate industrial processes. The central argument is that automation does not eliminate human problems; it transforms them into harder problems.

**The Core Irony:** "The designer's view of the human operator may be that the operator is unreliable and inefficient, so should be eliminated from the system" (Bainbridge, 1983). Yet the resulting automated system still requires human oversight, creating a role that is cognitively harder than the original task.

**Irony of Monitoring:** "It is impossible for even a highly motivated human being to maintain effective visual attention towards a source of information on which very little happens, for more than about half an hour" (Bainbridge, 1983). Automation that works reliably most of the time creates precisely this sustained-monitoring demand.

**Irony of Skill Degradation:** "Physical skills deteriorate when they are not used, particularly the refinements of gain and timing" (Bainbridge, 1983). Operators relegated to monitoring lose the very skills they need for manual intervention during automation failures.

**Irony of Training:** "The most successful automated systems, with rare need for manual intervention, may need the greatest investment in human operator training" (Bainbridge, 1983). The better the automation, the less operators practice, and the more training they need to stay competent.

**Irony of Knowledge Retrieval:** "Efficient retrieval of knowledge from long-term memory depends on frequency of use" (Bainbridge, 1983, via Friedrichsen 2024). When operators stop performing tasks regularly, they lose rapid access to technical knowledge they once possessed.

**Irony of Failure Camouflage:** "Automatic control can 'camouflage' system failure by controlling against the variable changes, so that trends do not become apparent until they are beyond control" (Bainbridge, 1983). Automation can mask developing problems until they become crises.

### The Generational Problem

Bainbridge raises a particularly disturbing long-term concern: "Present generation of automated systems, which are monitored by former manual operators, are riding on their skills, which later generations of operators cannot be expected to have" (Bainbridge, 1983, via Friedrichsen). Current developers reviewing AI-generated code still have hard-won coding skills. Future developers who grew up delegating to AI will not.

### Proposed Mitigation (from 1983)

Bainbridge's own solution is striking: "One possibility is to allow the operator to use hands-on control for a short period in each shift. If this suggestion is laughable then simulator practice must be provided" (Bainbridge, 1983). This maps directly to the idea that developers using AI agents should periodically write code manually to maintain skills.

### Modern Reinterpretations

Strauch (2017) revisited Bainbridge's ironies in "Ironies of Automation: Still Unresolved After All These Years" (*IEEE Transactions on Human-Machine Systems*, Vol. 47, No. 4, pp. 419-433) and found that the ironies remain fully unresolved across aviation, autonomous vehicles, and other domains. Workload spikes still occur "when people need to intervene or make changes to the system's operations, increasing workload at often difficult times, even though workload is reduced in already low workload periods" (Strauch, 2017).

Friedrichsen (2024) explicitly maps the ironies to AI coding agents: "Today, we see another massive push towards automation using agentic AI leveraging LLMs... Human skills will deteriorate if they leave the actual working to the agentic AI solutions and move into a pure overseer role most of the time. Eventually, the former experts will become beginners who once were experts."

### Application to Code Review in AI-Assisted Development

The core paradox applies with particular force to code review of AI-generated code:

1. **Monitoring Paradox:** A developer reviewing AI-generated code is in the exact position Bainbridge described: monitoring an automated system that works correctly most of the time, expected to catch the rare but consequential error. Yet sustained monitoring of mostly-correct output is precisely what humans cannot do reliably.

2. **Skill Degradation Spiral:** As developers delegate more coding to AI agents, their own coding skills atrophy. But detecting subtle bugs in AI-generated code requires exactly the deep coding expertise that disuse erodes. The automation creates a feedback loop that progressively degrades the very capability it depends on.

3. **By-the-time-they-notice Problem:** Automation can mask accumulating technical debt, architectural drift, and subtle logic errors. By the time a developer notices something is wrong, the codebase may have drifted far from its intended design, and the developer may lack the current skill to diagnose or fix the problem.

---

## 2. Parasuraman, Sheridan & Wickens (2000): Types and Levels of Automation

### The Four-Stage Model

Parasuraman, Sheridan, and Wickens published "A Model for Types and Levels of Human Interaction with Automation" in *IEEE Transactions on Systems, Man, and Cybernetics, Part A: Systems and Humans* (Vol. 30, No. 3, pp. 286-297). Their framework proposes that automation can be applied to four broad classes of functions, corresponding to stages of human information processing:

1. **Information Acquisition:** Sensing and registration of input data
2. **Information Analysis:** Cognitive processing, working memory integration, inference
3. **Decision and Action Selection:** Choosing among alternatives
4. **Action Implementation:** Execution of the chosen action

### The Ten-Level Automation Scale

Building on Sheridan and Verplanck (1978), the model proposes that within each stage, automation can vary along a continuum from fully manual to fully automatic:

| Level | Description |
|-------|-------------|
| 1 | The computer offers no assistance; the human does everything |
| 2 | The computer offers a complete set of alternatives |
| 3 | The computer narrows the alternatives down to a few |
| 4 | The computer suggests a recommended alternative |
| 5 | The computer executes the suggested alternative if the human approves |
| 6 | The computer executes the alternative; the human can veto within a limited time |
| 7 | The computer executes automatically, then informs the human |
| 8 | The computer executes automatically; informs the human only if asked |
| 9 | The computer executes automatically; informs the human only if it decides to |
| 10 | The computer decides everything, acts autonomously, ignoring the human |

### Key Theoretical Contribution

The critical insight is that "automation does not merely supplant but changes human activity and can impose new coordination demands on the human operator" (Parasuraman et al., 2000). Different stages tolerate different levels of automation. The authors argue that high-level automation of information acquisition and analysis is generally safer than high-level automation of decision selection and action implementation, because the consequences of automation failure at later stages are more severe and harder to recover from.

### Mapping to Code Review

| Stage | Code Review Task | Current AI Agent Level | Recommended Level |
|-------|-----------------|----------------------|-------------------|
| **Information Acquisition** | Gathering code diffs, test results, CI status, related issues | Levels 7-9 (agents auto-gather context) | High automation appropriate (5-7); agents should surface relevant information automatically |
| **Information Analysis** | Understanding code semantics, detecting patterns, identifying risks | Levels 4-6 (AI highlights potential issues) | Medium automation appropriate (3-5); AI should narrow attention but human must comprehend |
| **Decision Selection** | Accept, reject, request changes, identify architectural concerns | Levels 2-4 (AI recommends but human decides) | Low-medium automation (2-4); human judgment essential for consequential decisions |
| **Action Implementation** | Merging, deploying, filing issues | Levels 5-7 (auto-merge with human veto) | Context-dependent (3-6); routine changes tolerate more automation |

The model predicts that AI coding agents operating at Levels 7-10 for decision selection will produce the most severe human performance consequences, as operators will lose situation awareness of the decision rationale and be unable to intervene effectively when the agent makes incorrect architectural choices.

---

## 3. Endsley's Situation Awareness Theory

### The Three Levels of Situation Awareness

Mica Endsley's foundational definition (originally Endsley, 1988, 1995; updated 2017) defines SA as: "the perception of the elements in the environment within a volume of time and space, the comprehension of their meaning, and the projection of their status in the near future."

**Level 1, Perception:** Noticing the status, attributes, and dynamics of relevant elements. In code review: seeing the code diff, test results, changed files, modified APIs.

**Level 2, Comprehension:** Integrating perceived elements to understand the current situation. In code review: understanding *why* a change was made, whether it achieves its goal, how it interacts with existing code, whether it introduces risks.

**Level 3, Projection:** Anticipating future states based on current understanding. In code review: predicting how the change will behave under edge cases, estimating long-term maintenance burden, anticipating integration issues with other concurrent work.

### The Out-of-the-Loop Performance Problem

Endsley and Kiris (1995), "The Out-of-the-Loop Performance Problem and Level of Control in Automation" (*Human Factors*, Vol. 37, No. 2, pp. 381-394), demonstrated empirically that automation degrades situation awareness through multiple mechanisms:

**Passive vs. Active Processing:** "The shift from active to passive processing was most likely responsible for decreased SA under automated conditions" (Endsley & Kiris, 1995). When operators shift from doing to monitoring, their information processing becomes passive, and comprehension suffers.

**Selective SA Degradation:** Their experiments showed that "only level 2 SA, understanding and comprehension, was negatively impacted; Level 1 SA was unaffected" (Endsley & Kiris, 1995). Operators could perceive low-level data (they were effectively monitoring the system), but "they had less comprehension of what the data meant in relation to operational goals." This is a critical finding: *monitoring preserves perception but degrades comprehension*.

**Performance Consequences:** "Low SA corresponded with out-of-the-loop performance decrements in decision time following a failure of the expert system" (Endsley & Kiris, 1995). When automation failed, operators with degraded SA took significantly longer to diagnose and respond.

**Level of Control Matters:** "The out-of-the-loop performance problem was significantly greater under full automation than under intermediate levels of automation" (Endsley & Kiris, 1995). Intermediate automation, which kept operators in the active decision-making loop, preserved SA better. "By implementing functions at a lower level of automation, leaving the operator involved in the active decision making loop, situation awareness remained at a higher level and subjects were more able to assume manual control when needed."

### Application to AI Agent Monitoring

The implications for developers monitoring AI coding agents are direct:

- **Level 1 SA (Perception):** Developers can perceive that the AI has generated code (they can see the diff). This level is likely preserved.
- **Level 2 SA (Comprehension):** This is where degradation occurs. Developers passively reviewing AI output may see the code but not deeply understand the design rationale, the alternatives considered, or the subtle implications. The shift from writing code (active) to reviewing AI code (passive) degrades comprehension.
- **Level 3 SA (Projection):** Without deep comprehension, developers cannot project: they cannot anticipate how the code will behave under novel conditions, how it will interact with future changes, or where it will create technical debt.

The empirical finding that *intermediate* levels of automation preserve SA better than full automation suggests that AI coding agents should keep developers in the decision-making loop, not merely present finished code for approval.

---

## 4. Lee & See (2004): Trust Calibration in Automation

### Formal Framework

Lee and See's "Trust in Automation: Designing for Appropriate Reliance" (*Human Factors*, Vol. 46, No. 1, pp. 50-80) is the definitive review of trust in automated systems. Their definition: trust is "the attitude that an agent will help achieve an individual's goals in a situation characterized by uncertainty and vulnerability" (Lee & See, 2004, p. 54).

### Three Dimensions of Trustworthiness

Lee and See identify three recurring bases for trust judgments in automation:

1. **Performance:** How well the automation executes its function. For an AI coding agent: does the generated code work, pass tests, and meet requirements?
2. **Process:** The methods and algorithms the automation employs. For an AI coding agent: can the developer understand *how* the agent produced its output?
3. **Purpose:** The original design intent of the automation. For an AI coding agent: is the agent aligned with the developer's architectural goals?

### Calibration, Resolution, and Specificity

Lee and See introduce three properties of well-calibrated trust:

- **Calibration:** The correspondence between the operator's trust level and the automation's actual capability. Mis-calibrated trust produces either misuse (over-trust) or disuse (under-trust).
- **Resolution:** "A measure of how precisely a judgment of trust distinguishes between levels of automation capability" (Lee & See, 2004). Good resolution means the operator can distinguish situations where the AI is likely reliable from situations where it is not.
- **Specificity:** "The degree to which trust is associated with a particular component or aspect of the AI" (Lee & See, 2004). Good specificity means the operator trusts the AI's ability to write boilerplate code differently from its ability to make architectural decisions.

### Misuse, Disuse, and Abuse

Building on Parasuraman and Riley (1997), Lee and See describe three trust failure modes:

- **Misuse (Over-trust):** Excessive reliance on automation that exceeds its actual capability. Developers who rubber-stamp AI-generated code without thorough review.
- **Disuse (Under-trust):** Neglecting or underutilizing capable automation. Developers who rewrite all AI output from scratch, negating productivity gains.
- **Abuse:** "The automation of functions by designers and implementation by managers without due regard for the consequences for human performance" (Parasuraman & Riley, 1997). Organizations that deploy AI coding agents without considering the human factors consequences.

### Trust Dynamics

Trust operates through "analytic, analogical, and affective processes, especially emotional responses to violations or confirmations of expectations" (Lee & See, 2004). Trust develops dynamically: early positive experiences can lead to rapid over-trust, while a single dramatic failure can trigger lasting distrust. This is particularly relevant for AI coding agents, which may produce impressive initial results (building rapid trust) while harboring subtle failure modes that only manifest in edge cases.

### The Calibration Problem for AI Coding Agents

The calibration problem is especially acute for AI coding agents because:

1. **High surface quality:** AI-generated code often *looks* correct, compiles, and passes basic tests, creating a strong positive signal that inflates trust.
2. **Low-frequency failures:** The most dangerous errors (security vulnerabilities, race conditions, architectural violations) are rare, so the developer's trust is calibrated against a base rate that is misleadingly favorable.
3. **Opaque process:** LLM-based code generation is not interpretable; the developer cannot assess the *process* dimension of trust, so trust defaults to the *performance* dimension (does it work?), which is the most superficial.

Empirical evidence supports this concern: a study found that "developers using AI assistants wrote significantly less secure code than those without, yet were more likely to believe they had written secure code" (Perry et al., 2022, via Atomic Robot). This is a textbook example of mis-calibrated trust: high confidence despite objectively worse outcomes.

---

## 5. Fitts's List (1951) and Modern Critiques

### The Original MABA-MABA Framework

Paul Fitts (1951) proposed the first systematic framework for allocating functions between humans and machines, known by the acronym MABA-MABA ("Men Are Better At / Machines Are Better At"). The framework categorizes capabilities into those where humans excel (e.g., pattern recognition, flexible reasoning, improvisation) and those where machines excel (e.g., speed, consistency, sustained force, repetitive computation), then allocates accordingly.

### Price (1985) Critique

Harold Price's critique argued that the Fitts list is "intrinsically flawed" as a design tool because it treats human and machine capabilities as static and context-free. Real-world function allocation must account for organizational context, task dynamics, and the fact that introducing automation qualitatively transforms the remaining human tasks.

### Dekker & Woods (2002): The Substitution Myth

Dekker and Woods' "MABA-MABA or Abracadabra? Progress on Human-Automation Co-ordination" (*Cognition, Technology & Work*, Vol. 4, pp. 240-244) delivers the most influential critique:

**The Substitution Myth:** MABA-MABA lists "foster the idea that new technology can be introduced as a simple substitution of machines for people" (Dekker & Woods, 2002). This assumption fails because automation does not simply replace human effort; it transforms the entire work system.

**Qualitative, Not Quantitative Effects:** "Quantitative 'who does what' allocation does not work because the real effects of automation are qualitative: it transforms human practice and forces people to adapt their skills and routines" (Dekker & Woods, 2002).

**Emergent New Weaknesses:** "Capitalising on some strength of automation does not replace a human weakness. It creates new human strengths and weaknesses" (Dekker & Woods, 2002). When AI writes the code, the developer does not simply stop coding; their entire relationship with the codebase changes. They gain breadth (more code reviewed per unit time) but lose depth (less intimate understanding of each change).

**The Correct Question:** "[S]ystem developers should abandon the traditional 'who does what' question of function allocation" (Dekker & Woods, 2002). Instead: "What matters is the extent to which powerful automation allows team play with its human operators."

**Design Principles for Coordination:**
Dekker and Woods propose five principles for effective human-automation coordination:
1. Observable activities among all participants
2. Directable automation (not micro-management)
3. Historical and predictive information sharing
4. Low cognitive-cost coordination
5. Cooperative teamwork rather than task division

### Implications for AI Coding Harnesses

The Dekker-Woods critique has direct implications: designing an AI coding harness should *not* begin with "what should the AI do vs. the human?" (the MABA-MABA question). Instead, the design question should be: "How do we enable the developer and the AI agent to coordinate effectively?" This reframes the harness as a coordination architecture, not a function allocation scheme.

Static allocation (e.g., "AI writes code, human reviews code") is precisely the kind of MABA-MABA thinking that Dekker and Woods criticize. Dynamic allocation, where the level of AI autonomy varies with task complexity, developer confidence, and code criticality, is what the literature supports. This aligns with Endsley's finding that intermediate automation levels preserve situation awareness better than full automation.

---

## 6. Hollnagel's Safety-II and FRAM

### Safety-I vs. Safety-II

Erik Hollnagel's Safety-II framework, articulated in *Safety-I and Safety-II: The Past and Future of Safety Management* (2014) and the NHS England white paper "From Safety-I to Safety-II" (2015), reframes safety from preventing failures to enabling success:

**Safety-I (Traditional):** Safety is defined as "a condition where the number of adverse outcomes was as low as possible." The human is treated as a hazard, a source of error to be constrained by procedures, barriers, and automation. Failures are investigated; successes are assumed to follow from compliance.

**Safety-II (Resilience Perspective):** Safety is "the ability to succeed under varying conditions." The human is treated as a resource for system flexibility and resilience. "Things do not go well because people simply follow the procedures and work as imagined. Things go well because people make sensible adjustments according to the demands of the situation" (Hollnagel, 2014).

**The Human as Resource:** Safety-I harbors the bias that "the human is usually the weak link." Safety-II inverts this: "Finding out what these [performance] adjustments are and trying to learn from them can be more important than finding the causes of infrequent adverse outcomes" (Hollnagel, 2014).

### Work-as-Imagined vs. Work-as-Done

A central Safety-II concept is that "work-as-done (WAD) will always be different from work-as-imagined (WAI)" (Hollnagel, 2014). Actual conditions cannot be fully anticipated, and successful performance depends on continuous adaptation. This gap between imagined and actual work is a source of resilience, not merely a source of error.

### The FRAM Methodology

The Functional Resonance Analysis Method (FRAM) is built on four principles:

1. **Equivalence of failures and successes:** "Failures and successes come from the same origin, i.e., everyday work variability" (Hollnagel, 2012). The same adaptations that usually produce good outcomes occasionally produce bad ones.
2. **Central role of approximate adjustments:** "The adjustments are ubiquitous and generally useful. But the very reasons that make them necessary also means that they will be approximate rather than precise" (Hollnagel, 2012).
3. **Reality of emergence:** Outcomes arise from complex interactions, not predetermined sequences.
4. **Functional resonance as complement to causality:** "The variability of everyday performance aggregates in an unexpected manner" (Hollnagel, 2012), producing amplified effects without identifiable root causes.

### Reframing Human-Agent Interaction

A Safety-II perspective on AI coding harnesses would argue:

1. **The developer is not primarily an error-catcher.** Safety-I thinking designs the review process to catch AI errors. Safety-II thinking recognizes the developer as a resilience resource whose adaptations (interpreting requirements contextually, applying domain knowledge, making pragmatic trade-offs) are what make the system work.

2. **Performance variability is valuable.** When a developer modifies AI-generated code, adds context the AI missed, or restructures an approach, that is not "overriding" the AI; it is the normal adaptive behavior that produces success. Harness designs that minimize human modification (e.g., by making AI changes hard to edit) suppress exactly the variability that creates resilience.

3. **Learn from successful interactions, not just failures.** Instead of only analyzing cases where AI-generated code caused bugs, study cases where developer-AI collaboration produced particularly good outcomes. What adaptations did the developer make? What context did they provide? How can the harness amplify these successful patterns?

### Contradiction with Other Frameworks

There is a tension between Safety-II and frameworks like Bainbridge's Ironies. Bainbridge focuses on how automation creates new failure modes (a Safety-I perspective). Safety-II would ask: "What about the 95%+ of interactions where the developer-AI system produces successful outcomes? What adaptations are driving that success?" Both perspectives are valuable, but they lead to different design priorities. A pure Safety-I approach prioritizes error detection; a Safety-II approach prioritizes enabling effective collaboration.

---

## 7. Rasmussen's Skills-Rules-Knowledge (SRK) Framework (1983)

### The Three Levels of Cognitive Control

Jens Rasmussen's "Skills, Rules, and Knowledge; Signals, Signs, and Symbols, and Other Distinctions in Human Performance Models" (*IEEE Transactions on Systems, Man, and Cybernetics*, Vol. SMC-13, No. 3, 1983; cited over 5,000 times) distinguishes three levels of human cognitive control:

**Skill-Based Behavior:** "Without conscious control as smooth, automated and highly integrated patterns of behaviour" (Rasmussen, 1983). These are overlearned, automatic responses requiring minimal attention. Examples in coding: typing speed, IDE navigation, bracket matching, formatting conventions.

**Rule-Based Behavior:** Controlled by a "stored rule or procedure" (Rasmussen, 1983). The operator recognizes a situation and applies the appropriate rule. "Human activity in a familiar environment will not be goal-controlled; rather, it will be oriented towards the goal and controlled by a set of rules which has proven successful previously" (Rasmussen, 1983). Examples in coding: applying design patterns, following coding standards, implementing standard error handling.

**Knowledge-Based Behavior:** Required for "unfamiliar situations, faced with an environment for which no know-how or rules for control are available" (Rasmussen, 1983). This involves explicit goal formulation, planning, and reasoning from mental models. Examples in coding: designing novel architectures, debugging unfamiliar failures, evaluating trade-offs in unprecedented requirements.

### Signals, Signs, and Symbols

Rasmussen maps information representations to the three behavior levels:

- **Signals** (skill-based): Continuously varying sensory data processed without conscious interpretation. A developer's peripheral awareness of scrolling code.
- **Signs** (rule-based): Patterns that trigger stored rules. "If at position B in state X, do Y." A compiler error message that triggers a known fix.
- **Symbols** (knowledge-based): Representations used for reasoning. "Why isn't the needle moving the way I expect?" A performance anomaly that requires causal analysis.

Critically, Rasmussen emphasizes that the same information can function at different levels depending on context. A stack trace is a signal when an experienced developer glances at it and recognizes a familiar pattern; it becomes a symbol when the same developer encounters an unfamiliar failure mode and must reason about causality.

### Cognitive Efficiency and Repertoire

"The efficiency of humans in coping with complexity is largely due to the availability of a large repertoire of different mental representations of the environment from which rules to control behavior can be generated ad hoc" (Rasmussen, 1983). This repertoire develops through practice. Automation that removes practice opportunities shrinks the repertoire.

### Mapping Code Review Tasks to SRK Levels

| SRK Level | Code Review Task | Automation Impact |
|-----------|-----------------|-------------------|
| **Skill-based** | Scanning code formatting, recognizing syntax patterns, navigating diffs | These skills atrophy fastest when developers stop writing code. Without daily practice, the automatic pattern-recognition that experienced developers use to quickly scan code for "code smell" degrades. |
| **Rule-based** | Checking for common anti-patterns, verifying error handling, validating naming conventions, applying coding standards | AI can automate these rule-based checks (linters, static analysis). The risk is that developers lose the *rules* themselves, not just the skill of applying them. When rules are automated, developers may forget why the rules exist. |
| **Knowledge-based** | Evaluating architectural decisions, assessing design trade-offs, judging whether the code correctly models the domain, identifying novel security vulnerabilities | This is where human judgment is most essential and least automatable. But knowledge-based review depends on the developer having a rich mental model of the system, which is built and maintained through skill-based and rule-based engagement with the code. |

### Prediction About Automation-Induced Skill Degradation

The SRK framework predicts a cascading degradation:

1. **First**, skill-based behaviors atrophy (developers lose fluency with the codebase).
2. **Then**, without the perceptual grounding that skill-based engagement provides, rule-based behavior becomes less reliable (developers misapply rules because they do not perceive the relevant context).
3. **Finally**, knowledge-based behavior degrades (developers cannot reason effectively about unfamiliar situations because their mental models, which are built through skill-based and rule-based interaction, have become impoverished).

This cascade is particularly insidious because knowledge-based behavior is what code review most critically requires, and it is the most dependent on the lower levels that automation erodes first.

---

## 8. Empirical Evidence on Vigilance Decay

### Mackworth (1948): The Clock Test

Norman Mackworth's "The Breakdown of Vigilance During Prolonged Visual Search" (*Quarterly Journal of Experimental Psychology*, Vol. 1, pp. 6-21, 1948) established the vigilance decrement as a robust phenomenon. Mackworth designed a simulated radar task (the "clock test") where participants watched a pointer make small jumps around a clock face, with occasional double-jumps representing targets.

**Quantitative Findings:**
- Detection performance declined by 10-15% within the first 30 minutes (Mackworth, 1948)
- Performance continued to decline more gradually for the remaining 90 minutes of the 2-hour task
- The decrement was "robust after the first half hour on the task" across both visual and auditory modalities

### Jerison and Pickett (1963): Detection Rate Curves

Studies by Jerison and Pickett (1963), based on signal rates of approximately 30 per hour, showed:
- **Series A:** Detection declined from approximately 85% to 75%
- **Series B:** Detection declined from roughly 67% to 50%
- **Series C:** Detection declined from about 72% to 50%

These represent substantial absolute declines in detection capability during sustained monitoring tasks.

### See, Howe, Warm, and Dember (1995): Meta-Analysis

See et al.'s "Meta-analysis of the Sensitivity Decrement in Vigilance" (*Psychological Bulletin*, Vol. 117, pp. 230-249) synthesized 42 studies comprising 138 experimental conditions. This is the most comprehensive quantitative summary of vigilance research. The meta-analysis confirmed that the vigilance decrement is a genuine decline in perceptual sensitivity (not merely a shift in response criterion), establishing it as one of the most robust findings in experimental psychology.

### Warm, Parasuraman, and Matthews (2008): Vigilance as Hard Work

Warm, Parasuraman, and Matthews published "Vigilance Requires Hard Mental Work and Is Stressful" (*Human Factors*, Vol. 50, No. 3, pp. 433-441), which challenged the traditional view that vigilance tasks are "undemanding assignments requiring little mental effort." Their key findings:

- "Converging evidence using behavioral, neural, and subjective measures shows that vigilance requires hard mental work and is stressful" (Warm et al., 2008)
- The vigilance decrement is "better accounted for by resource exhaustion than by mindlessness or task disengagement"
- The decrement is "exacerbated by increasing task demands such as stimulus degradation, rate of stimulus presentation, and memory load"
- It is "associated with depleted ratings of energetic arousal, elevated reports of stress, and declines in cerebral blood flow velocity"
- "The workload of vigilance is high and sensitive to factors that increase processing demands"

This reframes vigilance from a "boring task" problem to a fundamental cognitive resource limitation. Code review of AI-generated output is not boring; it is cognitively demanding in ways that deplete attentional resources.

### The Mind-Wandering Debate

Thomson et al. (2015) proposed the "resource-control theory," arguing that "cognitive resources remain constant over time, the default state of the mind is mind-wandering, and with time-on-task our ability to exert executive control to maintain attention decreases." Recent studies show that over just 10 minutes, sustained attention begins to decline and this decline is associated with increased mind-wandering.

Hancock (2013, 2017) questioned whether the vigilance decrement as traditionally studied is an artifact of experimental design ("iatrogenically created") rather than a natural phenomenon. However, the weight of evidence supports the decrement as real, with debate focusing on the underlying mechanism (resource depletion vs. mindlessness vs. executive control failure) rather than whether the effect exists.

### Empirical Data from Software Code Review

The SmartBear/Cisco study (the largest code review study conducted, analyzing 2,500 reviews covering 3.2 million lines of code) provides domain-specific vigilance data:

- **Detection rate vs. review size:** Detection dropped from 87% for small PRs (under 100 lines) to just 28% for PRs over 1,000 lines
- **Time-on-task:** Defect detection rates "plummet after 60-90 minutes of continuous review time"
- **Average defect density:** 32 defects per 1,000 lines of code; 61% of reviews found no defects
- **Optimal review window:** 100-300 lines of code, 30-60 minutes of review time

### Modern Evidence on AI Code Review Complacency

Recent empirical findings on reviewing AI-generated code show:

- **Automation complacency rates:** When automation is consistently reliable, operators detected only approximately 30% of errors. When systems sometimes failed visibly, detection rates jumped to roughly 75% (Parasuraman, Molloy, & Singh, 1993).
- **Radiological analogue:** In studies of radiological scanning with embedded unexpected objects, 83% of expert radiologists missed a gorilla image, with over half looking directly at its location (Drew, Vo, & Wolfe, 2013). This "inattentional blindness" under expert monitoring is analogous to developers missing embedded errors in otherwise correct AI code.
- **Security code quality:** Developers using AI assistants "wrote significantly less secure code than those without, yet were more likely to believe they had written secure code" (Perry et al., 2022).
- **Automation bias:** Erroneous automated advice is followed at a 26% higher rate among groups using automated recommendations, with task inexperience correlating with increased automation bias errors (Mosier et al., 1998).
- **Alert fatigue analogue:** In cybersecurity, 67% of 4,484 daily alerts go uninvestigated; 83% are false positives. This mirrors the signal-to-noise problem in code review when most AI output is correct.
- **GitClear 2024 data:** Duplicate code and code churn increased beyond predictions; refactoring activity declined; GitHub/Accenture reported a 15% increase in pull request merge rates, raising questions about whether reviews are becoming perfunctory.

### ThoughtWorks Assessment (2025)

ThoughtWorks placed "Complacency with AI-generated code" in the **Hold** category of their Technology Radar, noting: "It's all too tempting to be less vigilant when reviewing AI suggestions after a few positive experiences with an assistant." They specifically identified the "vibe coding" pattern where "developers let AI generate code with minimal review" as a dangerous trend for production codebases.

---

## Cross-Cutting Themes and Contradictions

### Theme 1: The Monitoring Paradox is Universal

Every framework reviewed converges on a single finding: monitoring is harder than doing. Bainbridge (1983) identified it, Endsley (1995) measured it, Warm et al. (2008) explained the neurological mechanism, and the SmartBear/Cisco study quantified it for code review specifically. The paradox is that the better the AI performs, the harder monitoring becomes, because rare events are harder to detect than frequent ones.

### Theme 2: Static Allocation Fails; Dynamic Coordination Succeeds

Fitts (1951) proposed static allocation. Price (1985) and Dekker & Woods (2002) demolished it theoretically. Endsley (1995) showed empirically that intermediate automation (which dynamically involves the human) outperforms full automation. Parasuraman et al. (2000) argued for different automation levels across different processing stages. The convergent recommendation is that AI coding harnesses should not use fixed allocation ("AI writes, human reviews") but should dynamically adjust the level of AI autonomy based on task characteristics.

### Theme 3: Tension Between Safety-I and Safety-II Perspectives

There is a genuine contradiction between frameworks. Bainbridge, Endsley, Lee & See, and the vigilance literature approach the problem from a Safety-I perspective: how does automation cause new failure modes? Hollnagel's Safety-II asks the opposite question: how does the human-automation system succeed most of the time? Both perspectives are empirically grounded but lead to different design priorities:

- **Safety-I design priority:** Build error-detection mechanisms, force the developer to engage, insert friction to prevent rubber-stamping.
- **Safety-II design priority:** Study successful developer-AI collaboration, amplify the adaptive behaviors that work, design for resilience rather than error prevention.

A complete harness design must integrate both perspectives: enabling the adaptive capacity that makes most interactions successful (Safety-II) while providing the error-detection scaffolding for the rare but consequential failures (Safety-I).

### Theme 4: The SRK Cascade Predicts Long-Term Harm

Rasmussen's framework predicts that automation-induced skill degradation will cascade from skill-based through rule-based to knowledge-based behavior. This is the most concerning long-term prediction, because it suggests that the very developers whose judgment is needed for knowledge-based review will gradually lose the perceptual and procedural foundation that judgment rests on. Bainbridge's "generational problem" amplifies this: developers entering the workforce in an AI-first era may never build these foundations at all.

### Theme 5: Trust Calibration is the Central Design Challenge

Lee and See's framework suggests that the primary challenge is not building capable AI, but designing systems that enable appropriate trust calibration. The empirical evidence (Perry et al., 2022; GitClear, 2024; ThoughtWorks, 2025) uniformly shows that current calibration is poor: developers over-trust AI output. The three properties of good calibration (accuracy, resolution, specificity) provide concrete design targets for AI coding harnesses:

- **Improve calibration accuracy:** Make AI uncertainty visible; communicate confidence levels.
- **Improve resolution:** Help developers distinguish high-confidence AI output from uncertain output.
- **Improve specificity:** Help developers trust the AI differently for different task types (boilerplate vs. architecture).

---

## Summary of Sources

| # | Source | Year | Key Contribution |
|---|--------|------|------------------|
| 1 | Bainbridge, L. "Ironies of Automation." *Automatica*, 19(6), 775-779. | 1983 | Core paradoxes of automation; skill degradation; monitoring impossibility |
| 2 | Rasmussen, J. "Skills, Rules, and Knowledge." *IEEE Trans. SMC*, SMC-13(3). | 1983 | Three-level cognitive control framework; automation-induced skill cascade |
| 3 | Mackworth, N.H. "The Breakdown of Vigilance." *QJEP*, 1, 6-21. | 1948 | Empirical vigilance decrement: 10-15% in first 30 minutes |
| 4 | See, J.E., Howe, S.R., Warm, J.S., Dember, W.N. "Meta-analysis of Sensitivity Decrement." *Psychological Bulletin*, 117, 230-249. | 1995 | 42-study meta-analysis confirming vigilance decrement as genuine sensitivity loss |
| 5 | Endsley, M.R. & Kiris, E.O. "Out-of-the-Loop Performance Problem." *Human Factors*, 37(2), 381-394. | 1995 | Empirical demonstration that automation degrades Level 2 SA (comprehension) |
| 6 | Parasuraman, R. & Riley, V. "Humans and Automation: Use, Misuse, Disuse, Abuse." *Human Factors*, 39, 230-253. | 1997 | Taxonomy of automation usage failures |
| 7 | Parasuraman, R., Sheridan, T.B. & Wickens, C.D. "Model for Types and Levels." *IEEE Trans. SMC-A*, 30(3), 286-297. | 2000 | Four-stage, ten-level automation taxonomy |
| 8 | Dekker, S.W.A. & Woods, D.D. "MABA-MABA or Abracadabra?" *Cognition, Technology & Work*, 4, 240-244. | 2002 | Critique of static function allocation; substitution myth |
| 9 | Lee, J.D. & See, K.A. "Trust in Automation." *Human Factors*, 46(1), 50-80. | 2004 | Trust calibration framework; performance/process/purpose dimensions |
| 10 | Warm, J.S., Parasuraman, R. & Matthews, G. "Vigilance Requires Hard Mental Work." *Human Factors*, 50(3), 433-441. | 2008 | Neurological evidence that vigilance depletes cognitive resources |
| 11 | Hollnagel, E. *Safety-I and Safety-II.* Ashgate/CRC Press. | 2014 | Safety-II perspective; humans as resilience resource; FRAM methodology |
| 12 | Strauch, B. "Ironies of Automation: Still Unresolved." *IEEE Trans. HMS*, 47(4), 419-433. | 2017 | Modern evidence that Bainbridge's ironies remain unresolved |
| 13 | Perry, N., Srivastava, M., Kumar, D. & Boneh, D. "Do Users Write More Insecure Code with AI Assistants?" Stanford/NYU. | 2022 | AI-assisted developers wrote less secure code but believed it was more secure |
| 14 | SmartBear/Cisco Code Review Study. *Best Practices for Peer Code Review.* | 2009 | Detection drops from 87% to 28% as review size increases; 60-90 min ceiling |
| 15 | ThoughtWorks Technology Radar. "Complacency with AI-generated code." | 2025 | Hold rating; warning about vibe coding and automation complacency |
| 16 | GitClear. "AI Copilot Code Quality 2025." | 2025 | Increased code churn, duplicate code, and declining refactoring with AI |
| 17 | Friedrichsen, U. "AI and the Ironies of Automation." Blog series. | 2024 | Mapping Bainbridge's ironies to modern AI agents |

---

## Methodological Notes

**Source Priority:** This document prioritizes primary sources (Bainbridge 1983, Rasmussen 1983, Endsley 1995, Lee & See 2004) over secondary summaries. Where PDFs of primary sources could not be parsed, key quotes were verified through multiple independent secondary sources.

**Quantitative Data Limitations:** Several key quantitative findings (especially from See et al. 1995 and the Jerison & Pickett curves) were available only in approximate form from secondary sources. The SmartBear/Cisco data, while widely cited, comes from a commercial white paper rather than a peer-reviewed study. The GitClear and ThoughtWorks sources are industry reports, not academic research, and should be weighted accordingly.

**Theoretical Contradictions:** The tension between Safety-I frameworks (Bainbridge, Endsley) and Safety-II frameworks (Hollnagel) is genuine, not an artifact of misunderstanding. Both camps have empirical support, and a complete theory of human-AI coding interaction must integrate insights from both.

**Generalizability Concerns:** Most vigilance and automation supervision research was conducted in aviation, process control, and military domains. The transfer to software development is plausible but has limited direct empirical validation. The SmartBear/Cisco study and Perry et al. (2022) provide the strongest domain-specific evidence, but more controlled studies of AI code review performance are needed.
