# Pillar 8: Human Interaction Architecture

## What This Pillar Is

The study of how humans and AI coding agents interact within a harness: when the human should intervene, what information the human needs to make decisions, how to allocate scarce human attention, and how to prevent the automation paradoxes (Bainbridge's ironies, skill degradation, false confidence) that arise when humans supervise systems they no longer fully understand. This pillar determines the BOUNDARY between human judgment and agent autonomy, and how that boundary should shift based on context, risk, and trust.

## Why It Must Exist

R3 (Systems Builder): "The dominant quality mechanism, treated as Layer 4 afterthought." R5 (Skeptic): "Section 9.6 admits the framework misrepresents the role of humans in practice."

The current framework models the human as Layer 4 of a verification cascade, but in production:
- Humans are active co-pilots steering the agent at every step
- The specification is an evolving conversation, not a static document (Suchman's critique)
- Human review is the ONLY mechanism that catches novel error categories, redirects when the agent solves the wrong problem, and supplies tacit knowledge
- DORA 2025: review time up 91% with AI adoption -- the human bottleneck is real and growing
- 48% of developers never verify AI output (Sonar 2026) -- the human is often absent when needed

The paper's own analysis (Section 9.6) admits: "The human correction cycle is not a layer in a cascade; it is a feedback loop that operates across all layers." This pillar formalizes that feedback loop.

## The Formal Problem(s)

### Problem 1: Optimal Attention Allocation (Bayesian Triage)

Given $N$ agent outputs per time period, human review capacity $H \ll N$, and heterogeneous risk levels $r_i$ for each output, select the subset $S \subseteq [N]$ with $|S| \leq H$ to review, maximizing expected defect detection:

$$\max_{S, |S| \leq H} \; \sum_{i \in S} P(\text{defect}_i \mid \mathbf{x}_i) \cdot D_i \cdot (d_{\text{human}} - d_{\text{auto}})$$

where $\mathbf{x}_i$ are observable features (files touched, complexity, novelty score, automated layer flags), $D_i$ is the cost of an undetected defect, and $(d_{\text{human}} - d_{\text{auto}})$ is the marginal detection rate of human review over the automated layers that have already run.

This is the Dodge-Romig sampling inspection problem applied to software: review 100% of high-risk, sample medium-risk, skip low-risk.

### Problem 2: Autonomy Boundary Selection (Asymmetric Bayesian Decision)

From the paper's Bayesian Mode Selection (Theorem 6.7):

$$\text{Choose Governed (human-reviewed) iff } P(\text{Governed needed} \mid \mathbf{x}) > \frac{c_{\text{GF}}}{c_{\text{FG}} + c_{\text{GF}}}$$

Since $c_{\text{FG}} \gg c_{\text{GF}}$ (cost of missing a needed review >> cost of unnecessary review), the threshold is low (~0.05-0.10). The problem is estimating $P(\text{Governed needed} \mid \mathbf{x})$ from observable features.

**Features for the classifier:**
- Files touched: security-critical? Cross-module? Public API?
- Task novelty: has this pattern appeared before in the codebase?
- Abstraction gap estimate: how much information must the agent supply vs. the spec?
- Agent confidence: self-reported uncertainty (calibrated, not raw)
- Automated layer flags: how many issues did Layers 1-3 find?
- Historical defect rate: for this agent on similar tasks

### Problem 3: Trust Calibration Over Time (Thompson Sampling)

The harness should learn which agent-task combinations require human oversight and which can be trusted to run autonomously. Model this as a multi-armed bandit:

- **Arm:** (agent, task-type) pair
- **Reward:** 1 if output would pass human review, 0 otherwise
- **Prior:** Beta(alpha, beta) on success probability per arm
- **Update:** Observe human review outcome, update posterior
- **Policy:** Thompson sampling to balance exploration (occasionally review trusted arms) and exploitation (skip review for consistently good arms)

Over time, the harness learns to allocate human attention to where it has highest marginal value, while maintaining enough exploration to detect trust degradation.

### Problem 4: Bainbridge's Ironies (Automation Supervision Paradox)

Bainbridge (1983) identified a fundamental tension: if the automation is reliable enough that the human rarely intervenes, the human's skills for intervening degrade. When automation fails, the human is least prepared to take over.

Applied to coding harnesses:
- If the agent is good enough that the human rubber-stamps most reviews, the human stops reading carefully
- When the agent makes a novel error (outside its training distribution), the human's degraded attention misses it
- The 48% of developers who never verify AI output (Sonar 2026) are already in this failure mode

Formally: the detection rate of human review $d_{\text{human}}(t)$ is a decreasing function of the automation reliability $p_{\text{auto}}$ over time, because the human's attention degrades with disuse:

$$d_{\text{human}}(t) = d_0 \cdot \Phi(p_{\text{auto}}, t)$$

where $\Phi$ is a vigilance decay function. The implication: the harness must occasionally present known-defective outputs to the human to maintain their detection skills (a form of "calibration testing" borrowed from radiology screening).

## The Right Mathematical Framework

- **Bayesian decision theory** (Berger): asymmetric cost decision rules for triage
- **Sampling inspection theory** (Dodge-Romig, MIL-STD-105E): adaptive inspection regimes
- **Multi-armed bandits** (Thompson, 1933): trust calibration over time
- **Signal detection theory** (Green & Swets): human detection rates as d-prime
- **Automation supervision** (Bainbridge, 1983; Parasuraman & Riley, 1997): ironies of automation
- **Fitts's list** (Fitts, 1951): allocation of functions between humans and machines

## Key Quantities

- $H$: human review capacity (reviews per unit time)
- $N$: agent output rate (outputs per unit time)
- $r_i$: risk level of output $i$ (estimated from features)
- $d_{\text{human}}$: human detection rate (varies by reviewer, degrades with automation reliability)
- $d_{\text{auto}}$: automated detection rate (Layers 1-3 combined)
- $P(\text{Governed needed} \mid \mathbf{x})$: posterior probability of needing human review
- $\Phi(p_{\text{auto}}, t)$: vigilance decay function (Bainbridge's irony)
- $\alpha_k, \beta_k$: Beta parameters for trust calibration of (agent, task-type) pair $k$

## What Existing Research Shows

**The human bottleneck is quantified:**
- DORA 2025: review time up 91% with AI adoption; PR size up 154%
- Sonar 2026: 48% of developers never verify AI output; only 26% always verify
- METR: ~50% of test-passing PRs would not be merged (18-point gap after baseline adjustment)

**Adaptive inspection works in manufacturing:**
- Dodge-Romig (1929): tightened/normal/reduced inspection based on quality history
- MIL-STD-105E: switching rules reduce inspection cost by 40-60% at same quality level
- Applied to software: Fagan's inspection method (IBM, 1976) found optimal inspection rate at ~150 LOC/hr

**Automation supervision research:**
- Bainbridge (1983): ironies of automation; skill degradation under reliable automation
- Parasuraman et al. (2000): 4-stage model of human information processing in automation
- Endsley (2017): situation awareness degrades when humans monitor rather than operate
- Lee & See (2004): trust in automation follows a calibration curve; over-trust and under-trust are both failure modes

**AI-specific human-AI interaction:**
- Bansal et al. (2021): complementary performance in human-AI teams requires accurate confidence calibration
- Mozannar & Sontag (2020): learning to defer to human; optimal deferral policy minimizes total error
- Raghu et al. (2019): direct uncertainty quantification improves human-AI team performance

## How Existing Harnesses Handle This

| Harness | Human Interaction Model | When Human Intervenes | Trust Evolution |
|---------|------------------------|----------------------|-----------------|
| GSD | Plan approval gate + phase verification | Before execution; after each phase | Static (always same gates) |
| RAPID | discuss-set + plan approval + merge approval | Before planning; before merge | Static (always same gates) |
| Cursor | Inline accept/reject per suggestion | Every suggestion (autocomplete) or task (agent) | Tab-level learning |
| Codex | PR review after completion | After task completion | None (always PR review) |
| Claude Code | Terminal interaction, approval per tool use | Per tool invocation (configurable) | Permission mode (yolo/confirm) |
| Devin | Async PR submission | After task completion | None |

**Key observation:** All existing harnesses use **static** human gates (always review at the same points). None implement adaptive triage based on learned trust or risk estimation. This is the gap.

## Key Contrarian Positions

1. **"Humans should review everything."** The throughput mismatch makes this impossible: AI generates 40-60% of code on major platforms; human review cannot scale to match. The counter: triage, not abdication. Direct human attention where marginal value is highest.

2. **"Fully autonomous agents are the goal; human-in-the-loop is a crutch."** Current agents are not reliable enough for full autonomy on production code (METR: 50% of test-passing PRs wouldn't merge). More importantly, Naur's theory preservation problem means human understanding of the codebase degrades without review interaction. Full autonomy accelerates the theory loss rate.

3. **"Trust calibration is dangerous; it creates auto-pilot complacency."** Bainbridge's irony is real. Counter: the calibration system must include deliberate "vigilance probes" (known-defective outputs) to maintain human skill, similar to how radiology AI systems inject known-positive cases.

4. **"The human interaction model should be conversational, not gate-based."** Suchman's situated action critique: real interaction is dynamic, not a series of approve/reject gates. Counter: for now, gate-based interaction is the only interaction model that can be formally analyzed and optimized. Conversational interaction is a future pillar (or extension of this one).

5. **"Developer experience level is the strongest moderator and you can't formalize it."** Junior developers (0-2 years) exhibit 3-4x higher accretion rates than senior developers using identical tools. The context budget optimum shifts from ~0.08W for experts to ~0.50W for novices. Counter: the trust calibration mechanism (Problem 3) implicitly captures developer expertise through observed defect rates, without requiring explicit experience modeling.

## What Another Agent Writing This Pillar Needs to Know

- This pillar is the BRIDGE between the formal framework and the situated, conversational reality of AI coding. It is where the Suchman/Wittgenstein critique meets engineering pragmatism.
- Start from the paper's existing Bayesian mode selection (Theorem 6.7) and the Layer 4 detection ceiling. The contribution is formalizing the human as an adaptive, degradable, finite-capacity component, not a perfect oracle.
- The Dodge-Romig connection is direct: adaptive inspection regimes that tighten/relax based on observed quality are exactly what harness human-review should implement.
- Bainbridge's ironies are the most important design constraint: any system that reduces human engagement must account for the resulting skill degradation. This is not an edge case; it is the default failure mode of successful automation.
- Trust calibration via Thompson sampling is implementable today: maintain a Beta distribution per (agent, task-type) pair, update on observed outcomes, sample to decide whether to request review.
- The paper's Governance pillar's "per-milestone deliberative" loop is the human's strategic engagement point. This pillar's "per-output triage" is the tactical engagement point. They must be coordinated.

## Sources

- Bainbridge (1983): Ironies of Automation
- Parasuraman, Sheridan & Wickens (2000): A model for types and levels of human interaction with automation
- Endsley (2017): From here to autonomy: Lessons learned from human-automation research
- Lee & See (2004): Trust in automation: designing for appropriate reliance
- Bansal et al. (2021): Does the whole exceed its parts? Complementary performance in human-AI teams
- Mozannar & Sontag (2020): Consistent estimators for learning to defer to an expert
- Dodge & Romig (1929): A method of sampling inspection
- MIL-STD-105E: Sampling procedures and tables for inspection by attributes
- Fagan (1976): Design and code inspections to reduce errors in program development
- Fitts (1951): Human engineering for an effective air navigation and traffic control system
- DORA (2025): Accelerate State of DevOps Report
- Sonar (2026): AI Code Assurance Report
