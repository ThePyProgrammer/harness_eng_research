# Research Plan: Reliability Architecture for Multi-Step Agent Workflows

## Topic

The study of compound error rates in multi-step AI agent pipelines, optimal verification scheduling, circular validation bias, and the structural-vs-prompt enforcement boundary. The central question: how should autonomous coding agents verify their own output to maximize end-to-end reliability without destroying throughput?

## Research Questions

1. **Compound error dynamics:** What are the empirically measured per-step success rates and end-to-end failure rates for multi-step LLM agent workflows? How well does the multiplicative independence model ($p^n$) hold vs. correlated-failure models?

2. **Optimal verification cadence:** What does the literature say about where to place verification checkpoints in multi-step pipelines? What are the diminishing returns curves, and what does dynamic programming or reliability theory prescribe?

3. **Circular validation bias:** How large is the bias when the same model generates both code and tests? What evidence exists from SWE-bench, METR, and related benchmarks? What structural separation approaches reduce this bias?

4. **Structural vs. prompt enforcement:** What is the empirical gap between code-enforced rules (type-checkers, tool permissions, sandboxing) and prompt-based instructions? How does AgentSpec's 87% vs 77% finding generalize?

5. **Agent gaming and reward hacking:** What documented cases exist of LLM agents circumventing evaluation criteria? How do structural defenses (immutable evaluation, read-only verifiers) compare to prompt-based constraints?

6. **Verification cost-benefit tradeoffs:** What is the cost structure of different verification layers (structural gates, static analysis, LLM-as-Judge, human review)? How should verification intensity adapt to risk level?

7. **Reliability theory foundations:** What formal frameworks from reliability engineering (series/parallel systems, Markov chains, inspection scheduling) apply to agent pipeline verification?

8. **Practical architectures:** How do existing harnesses (GSD, RAPID, Turing, Blueprint) implement verification, and what empirical results do they report?

## Researcher Agent Strategy

### Agent R1: Historical and Theoretical Foundations
- Classical reliability theory (series systems, inspection models, Barlow-Proschan)
- Software reliability growth models and their applicability to LLM pipelines
- Dynamic programming for optimal inspection scheduling
- Markov chain models of error propagation

### Agent R2: Empirical Evidence on Agent Failures
- Measured per-step and end-to-end failure rates (Rajan 2026, Galileo, SWE-bench)
- METR's O3/O4-mini evaluations
- Apollo Research in-context scheming findings
- NIST CAISI agent safety results
- Anthropic's agent evaluation methodology

### Agent R3: Verification and Enforcement Mechanisms
- AgentSpec (ICSE 2026) and AgentGuard frameworks
- Structural enforcement approaches (sandboxing, tool permission systems, immutable evaluation)
- LLM-as-Judge literature (reliability, agreement rates, calibration)
- Plan verification for LLM agents (arXiv:2509.02761)

### Agent R4: Contrarian and Alternative Perspectives
- Arguments that over-verification destroys throughput
- Evidence that errors are front-loaded (problem framing vs execution)
- Cases where prompt-based rules suffice (the 10-point gap argument)
- Cost-benefit of structural separation (2x invocation cost)
- Industry perspectives on "good enough" verification

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources
- Contradictions between sources explicitly identified
- At least 3 formal results (theorems, bounds, or empirical laws) documented with precise statements
- Agent gaming examples documented with specific citations
- Cost-benefit data for at least 2 verification layers
