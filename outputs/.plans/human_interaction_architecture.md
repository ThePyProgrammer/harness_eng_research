# Research Plan: Human Interaction Architecture for AI Coding Agent Harnesses

## Topic
How humans and AI coding agents interact within a harness: optimal attention allocation, autonomy boundary selection, trust calibration over time, and mitigation of automation supervision paradoxes (Bainbridge's ironies). Formalizes the human as an adaptive, degradable, finite-capacity component rather than a perfect oracle.

## Key Research Questions

1. **Optimal Attention Allocation:** How should a harness triage N agent outputs for a human with review capacity H << N? What does sampling inspection theory (Dodge-Romig, MIL-STD-105E) tell us about adaptive inspection regimes for software, and what are the provable bounds on defect escape rate under capacity constraints?

2. **Autonomy Boundary Selection:** How should the boundary between human-reviewed and autonomous execution shift based on observable features (file risk, novelty, agent confidence, automated layer flags)? What is the optimal asymmetric decision threshold given that missing a needed review costs far more than an unnecessary one?

3. **Trust Calibration Dynamics:** How should a harness learn which (agent, task-type) pairs require human oversight over time? What do multi-armed bandit formulations (Thompson sampling, UCB) offer, and what are the convergence guarantees and regret bounds?

4. **Bainbridge's Ironies in Coding:** How does reliable automation degrade human vigilance in code review? What does the automation supervision literature (Bainbridge 1983, Parasuraman & Riley 1997, Endsley 2017) predict about skill decay, and what countermeasures (vigilance probes, calibration testing) are effective?

5. **Signal Detection Theory for Code Review:** Can human code review performance be modeled as a signal detection problem (d-prime, ROC curves)? How do factors like fatigue, automation reliability, and review volume affect detection rates? What does the radiology/aviation screening literature tell us?

6. **Human-AI Complementarity:** When does the human-AI team outperform either alone? What does the learning-to-defer literature (Mozannar & Sontag 2020, Madras et al. 2018) formalize about optimal deferral policies? How does confidence calibration affect team performance (Bansal et al. 2021)?

7. **Situated Action vs. Gate-Based Interaction:** What is the tension between Suchman's situated action critique (interaction is dynamic and contextual) and the formal gate-based models amenable to optimization? Can these be reconciled, or is there a fundamental tradeoff between formal tractability and interaction fidelity?

8. **Empirical State of Human Review in AI Coding:** What do DORA 2025, Sonar 2026, METR, and other empirical studies actually show about human review behavior, throughput bottlenecks, and defect detection rates in AI-assisted development?

## Major Thinkers, Works, and Formal Results

### Automation Supervision
- **Lisanne Bainbridge (1983):** "Ironies of Automation" -- the canonical paper on automation supervision paradoxes
- **Raja Parasuraman, Thomas Sheridan, Christopher Wickens (2000):** 4-stage model of human information processing in automation
- **Mica Endsley (2017):** Situation awareness theory; degradation under monitoring-only roles
- **John Lee & Neville See (2004):** Trust calibration in automation; over-trust/under-trust dynamics
- **Paul Fitts (1951):** Fitts's List; allocation of functions between humans and machines
- **Erik Hollnagel (2012):** FRAM (Functional Resonance Analysis Method); Safety-II thinking

### Signal Detection & Human Factors
- **David Green & John Swets (1966):** Signal Detection Theory (SDT); d-prime, ROC analysis
- **James Reason (1990):** Human error taxonomy; Swiss cheese model
- **Jens Rasmussen (1983):** Skills-Rules-Knowledge framework for human performance

### Human-AI Interaction (ML/AI-Specific)
- **Gagan Bansal et al. (2021):** Complementary performance in human-AI teams
- **Hussein Mozannar & David Sontag (2020):** Learning to defer to an expert; optimal deferral
- **Maithra Raghu et al. (2019):** Direct uncertainty quantification for human-AI teams
- **David Madras et al. (2018):** Predict responsibly; fairness-aware learning to defer
- **Kailas Vodrahalli et al. (2022):** Do humans benefit from AI explanations?

### Bayesian Decision Theory & Sampling
- **James Berger (1985):** Statistical Decision Theory and Bayesian Analysis
- **Harold Dodge & Harry Romig (1929):** Sampling inspection methods
- **MIL-STD-105E:** Military standard for acceptance sampling
- **Michael Fagan (1976):** Software inspection methods at IBM

### Bandit Theory
- **William Thompson (1933):** Thompson sampling (original)
- **Peter Auer, Nicolo Cesa-Bianchi, Paul Fischer (2002):** UCB1 and finite-time regret bounds
- **Shipra Agrawal & Navin Goyal (2012):** Thompson sampling analysis for the stochastic bandit

### Situated Action & HCI Theory
- **Lucy Suchman (1987/2007):** Plans and Situated Actions; critique of plan-based interaction
- **Peter Naur (1985):** Programming as Theory Building
- **Ludwig Wittgenstein (1953):** Philosophical Investigations; language games, forms of life
- **Edwin Hutchins (1995):** Distributed cognition; Cognition in the Wild

## Researcher Agent Strategy

### Agent R1: Automation Supervision & Human Factors (Historical/Theoretical)
**Dimension:** The automation supervision literature from Bainbridge through modern AI
- Bainbridge's ironies: original formulation, empirical evidence, modern reinterpretations
- Parasuraman/Sheridan/Wickens 4-stage model applied to code review
- Endsley's situation awareness theory and its degradation under automation
- Lee & See's trust calibration framework
- Fitts's List and its modern critiques
- Hollnagel's Safety-II perspective on human-automation interaction
- Rasmussen's SRK framework applied to code review tasks

### Agent R2: Human-AI Teaming & Learning to Defer (Empirical/Contemporary)
**Dimension:** Recent ML research on human-AI collaboration
- Bansal et al. complementary performance results
- Mozannar & Sontag learning-to-defer formalization
- Raghu et al. uncertainty quantification results
- Madras et al. fairness-aware deferral
- Vodrahalli et al. on AI explanations
- Empirical studies on developer behavior with AI tools (DORA 2025, Sonar 2026, METR)
- GitHub Copilot productivity studies and their methodology critiques

### Agent R3: Situated Action & HCI Theory (Contrarian/Alternative)
**Dimension:** Critiques of formal/gate-based interaction models
- Suchman's situated action critique and its implications
- Naur's theory building and tacit knowledge in code comprehension
- Wittgenstein's language games applied to human-agent communication
- Hutchins' distributed cognition: the human-agent-harness as a cognitive system
- Design patterns for human-AI interaction (Google PAIR, Apple HIG for ML)
- Conversational vs. gate-based interaction paradigms
- Developer experience research on interruption, flow, and context switching

### Agent R4: Signal Detection & Inspection Theory (Formal/Mathematical)
**Dimension:** The mathematical foundations of human detection and sampling
- Signal detection theory (Green & Swets): d-prime models for code review
- ROC analysis applied to defect detection
- Dodge-Romig sampling inspection: original theory and modern extensions
- MIL-STD-105E switching rules and their adaptation to software
- Fagan inspection method: empirical data on optimal review rates
- Vigilance research: sustained attention decline curves (Mackworth 1948, See et al. 1995)
- Fatigue models for code review (Spadini et al. 2020)

### Agent R5: Bandit Theory & Bayesian Decision (Formal/Mathematical)
**Dimension:** The optimization and learning theory for trust calibration
- Thompson sampling: regret bounds, Bayesian optimality
- UCB approaches: when exploration bonus is preferable
- Contextual bandits: incorporating features into trust decisions
- Bayesian decision theory: asymmetric costs, minimax, Bayes risk
- Online learning with expert advice: sleeping experts for dynamic trust
- Restless bandits: modeling changing agent reliability over time
- Connection to clinical trial design: adaptive randomization and stopping rules

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources each
- Contradictions between sources explicitly identified and documented
- At least 3 empirical data points for vigilance decay / review effectiveness
- The Bainbridge-to-coding-harness mapping is grounded in at least 2 published studies
- The learning-to-defer connection has formal definitions with proofs or proof sketches
- Sampling inspection theory adaptation has a concrete worked example
- Each contrarian position has a steelmanned version with empirical support
- Coverage of at least 25 distinct primary sources across all agents
