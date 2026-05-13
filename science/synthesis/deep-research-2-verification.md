# Verification Architecture for AI Coding Agent Harnesses

## The Compound Error Problem: What the Numbers Say

The arithmetic is unforgiving. When each step in a multi-step agent workflow has independent accuracy *p*, the end-to-end success probability is *p^n*. At 85% per-step accuracy across 10 steps, you get 0.85^10 = 19.7%. At 95% accuracy across 20 steps, you get 36%. At 90% across 20 steps, 12%.

These are not hypothetical. Field measurements reported in early 2026 show that real-world agent failure rates on 100-step tasks reach approximately 63%, even when per-step hallucination rates appear small in isolation (Rajan, 2026). Chaining just three components at 90% reliability each drives overall accuracy to roughly 73% (Elementum AI). The compounding is not linear; it is multiplicative, and it punishes long pipelines disproportionately.

The mechanism is straightforward: LLMs process sequences one token at a time, using previous outputs as inputs for the next step. Small inaccuracies propagate forward, accumulate, and eventually cascade. In multi-agent systems, the problem worsens through oscillation (ping-pong handoffs), conflicting writes, and memory poisoning across agent boundaries (Concentrix, 2025).

A critical monitoring insight: when per-step accuracy drops from 90% to 87% on a 10-step task, overall success falls from 35% to 24%. That 3-point per-step degradation produces a 31% relative drop end-to-end (Galileo).

## Verification Frequency: The Cadence Tradeoff

Checking every step is expensive. Each verification call adds context window consumption, latency (network round-trips compound across tool calls), and the risk of context pollution where verification output displaces useful working context. Checking only at the end misses errors that have already compounded past recovery.

Research on iterative plan verification (Judge-Planner architectures) offers a concrete data point: 62% of sequences are corrected after a single verification iteration, with 96.5% convergence by iteration 3 (arxiv:2509.02761). This suggests that verification has sharply diminishing returns past 2-3 rounds, and that early checking captures the majority of recoverable errors.

Anthropic's internal evaluation framework recommends grading "what the agent produced, not the path it took," combining code-based graders (deterministic), model-based graders (semantic), and human graders (calibration). Their pass@k vs pass^k framing reveals a fundamental tension: one-shot reliability demands different architecture than aggregate reliability over many runs (Anthropic, 2025).

The practical heuristic emerging from this research: verify at phase boundaries (not at every step), with heavier scrutiny at irreversible decision points. Reversible actions tolerate post-hoc correction; irreversible actions require pre-hoc gates.

## Four Verification Architectures Compared

**GSD** implements sequential gates: plan-checker (pre-execution), verifier (post-execution), PostToolUse hooks (during execution), and Stop hooks (at completion). This is a belt-and-suspenders approach, catching errors at four distinct points. The cost is latency from serialized checks.

**RAPID** layers a 4-skill review cascade (scope, unit-test, bug-hunt, UAT) with contract validation at three gates (post-plan, during execution, pre-merge) and 5-level merge conflict detection. RAPID's insight is that different verification skills catch different error classes; no single check suffices. The tradeoff is agent spawn overhead and context duplication across reviewers.

**Turing** takes a structurally different approach: immutable evaluation infrastructure (evaluate.py is hidden from the training agent), behavioral probes, statistical validation through multi-run median aggregation, and tool restriction via whitelisted commands. Turing's core principle is that every prompt-based rule eventually gets worked around, but every code-based rule holds. The evaluation file is not protected by instructions; it is protected by filesystem permissions and tool restrictions.

**Blueprint** implements continuous governance: drift detection comparing intended architecture against actual code, compliance auditing against accepted Architecture Decision Records, fitness functions as CI-runnable tests, and evidence expiry tracking. Blueprint operates on a longer timescale (across sessions, not within a single execution) and catches architectural erosion rather than per-step errors.

## Structural vs. Prompt-Based Verification

The AgentSpec study (ICSE 2026) reports successfully enforcing 87.26% of risky code through runtime enforcement, using a combination of LLM-generated rules and manual predicate functions. Prompt engineering alone achieved up to 77% improvement in code security (ScienceDirect, 2025), but with substantially less determinism.

The distinction matters because prompt-based guardrails are semantic (they understand context and nuance) but probabilistic (they can be circumvented or ignored). Code-based guardrails are deterministic (regex, AST checks, filesystem permissions) but brittle (they cannot reason about intent).

Turing's principle, that code-based rules hold while prompt-based rules erode, generalizes to a design heuristic for coding harnesses: use structural enforcement for safety-critical invariants (immutable eval files, tool whitelists, filesystem sandboxing) and prompt-based verification for quality judgments (code style, architectural fit, requirement satisfaction). Never rely on prompts alone for constraints that must not be violated.

AgentGuard (arxiv:2509.23864) formalizes this as a middleware layer that builds a Markov Decision Process from observed agent behavior and checks probabilistic safety properties at runtime. The overhead is non-trivial for complex agents, but the architecture separates the verification mechanism from the agent's own reasoning, which is the key structural insight.

## Best-of-Breed Verification Architecture

The evidence points to a three-layer approach, mapped to the SDD Ontology's pipeline stages:

**Pre-hoc prevention (before execution begins).** Structural constraints that cannot be circumvented: tool whitelists, filesystem permissions, immutable evaluation infrastructure, sandboxed execution environments. These address irreversible-action risk and agent manipulation of its own evaluation. Maps to S2 (Governing Principles) and CC6 (Guardrails).

**Ad-hoc checking (at phase boundaries during execution).** Verification at 2-3 decision points per milestone, not at every step. Contract validation (does the plan match requirements?), behavioral probes (is the agent pursuing the stated goal?), and lightweight automated tests (do the outputs parse, compile, pass smoke tests?). Diminishing returns past 3 iterations of refinement. Maps to S9 (Verification) and CC7 (Human Gates).

**Post-hoc auditing (after execution, across sessions).** Drift detection, fitness function CI tests, compliance audits against architectural decisions, statistical validation across multiple runs. These catch slow erosion that no single-execution check can detect. Maps to Blueprint's continuous governance model and Turing's multi-run aggregation.

The compound error problem is not solved by making each step more accurate (though that helps). It is solved by making the pipeline shorter (fewer steps to compound), making verification structural rather than advisory (code-based over prompt-based), and placing verification gates at the points of maximum error leverage (phase boundaries and irreversible actions) rather than uniformly across all steps.

---

Sources:
- [The Math That's Killing Your AI Agent](https://towardsdatascience.com/the-math-thats-killing-your-ai-agent/) (Rajan, TDS, March 2026)
- [AI Agent Metrics: How Elite Teams Evaluate](https://galileo.ai/blog/ai-agent-metrics) (Galileo)
- [Deterministic vs. Probabilistic AI](https://www.elementum.ai/blog/deterministic-vs-probabilistic-ai) (Elementum AI)
- [12 Failure Patterns of Agentic AI Systems](https://www.concentrix.com/insights/blog/12-failure-patterns-of-agentic-ai-systems/) (Da Costa, Concentrix, 2025)
- [AI Agents Are Failing 63% of the Time](https://liorgd.medium.com/ai-agents-are-failing-63-of-the-time-heres-the-simple-fix-no-one-talks-about-bada84805cbe) (Gd, Medium)
- [Plan Verification for LLM-Based Agents](https://arxiv.org/html/2509.02761v2) (arxiv:2509.02761)
- [AgentGuard: Runtime Verification](https://arxiv.org/html/2509.23864v1) (arxiv:2509.23864)
- [AgentSpec: Customizable Runtime Enforcement](https://cposkitt.github.io/files/publications/agentspec_llm_enforcement_icse26.pdf) (ICSE 2026)
- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic, 2025)
- [Guardrails for AI Agents](https://www.agno.com/blog/guardrails-for-ai-agents) (Agno)
- [Partnership on AI: Real-Time Failure Detection](https://partnershiponai.org/wp-content/uploads/2025/09/agents-real-time-failure-detection.pdf) (PAI, 2025)
