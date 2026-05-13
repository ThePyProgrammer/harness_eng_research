# Pillar 2: Reliability Architecture

## What This Pillar Is

The study of compound error rates in multi-step agent workflows, optimal verification cadence, the circular validation problem, and the structural-vs-prompt enforcement boundary. This pillar determines how often, how aggressively, and with what mechanisms to verify agent output.

## Why It Must Exist

The arithmetic is unforgiving. At 85% per-step accuracy across 10 steps: $0.85^{10} = 19.7\%$ end-to-end success. At 90% across 20 steps: 12%. Field measurements show 63% failure rates on 100-step tasks (Rajan, 2026). A 3-point per-step degradation (90% to 87%) produces a 31% relative drop end-to-end (Galileo).

This is the single most important quantitative fact about agent workflows. No amount of specification quality, context engineering, or architectural governance matters if compound errors destroy the output.

## The Formal Problems

### Optimal Verification Cadence

Given an $n$-step pipeline with per-step success $p$, verification cost $c_v$, detection probability $v$, and rework cost $c_r(j-i)$ increasing with delay: choose a verification schedule $V \subseteq \{1, \ldots, n\}$ minimizing expected total cost.

$$\min_{V} \; \sum_{k \in V} c_v + \sum_{i=1}^{n} (1-p) \cdot P(\text{not caught before } j(i,V)) \cdot c_r(j(i,V) - i)$$

This is a dynamic programming problem on intervals. Research shows 62% of errors caught in 1 iteration, 96.5% by iteration 3 (arXiv:2509.02761), establishing sharply diminishing returns past 2-3 verification rounds.

### Circular Validation Bias

When the same agent produces both code $P$ and tests $T$:

$$\beta = P(\text{T passes} \mid P \text{ buggy, same author}) - P(\text{T passes} \mid P \text{ buggy, different author})$$

METR's finding that ~50% of test-passing SWE-bench PRs would not be merged suggests $\beta$ is substantial.

### Adaptive Verification Intensity

Given a spec-to-code information gap estimate $\hat{g}$ and a cost-error tradeoff, choose verification intensity $\ell \in \{1,2,3,4\}$ (structural gates, deterministic analysis, LLM-as-Judge, human review) minimizing:

$$\min_{\ell} \; c(\ell) + \lambda \cdot P(\text{undetected defect} \mid \hat{g}, \ell)$$

## The Right Mathematical Framework

**Reliability theory + stochastic processes.** Key quantities:
- $R(n, p, V)$: end-to-end reliability given pipeline length, per-step accuracy, verification schedule
- $\beta$: circular validation bias (treatment effect of producer-verifier separation)
- $\eta(\ell)$: detection efficiency per unit cost at layer $\ell$

## What Existing Research Shows

- **Compound errors:** 85% per-step = 19.7% over 10 steps. 63% failure rate measured on 100-step tasks. 3-point degradation = 31% relative end-to-end drop.
- **Verification cadence:** 62% correction after 1 iteration; 96.5% convergence by iteration 3. Diminishing returns past 3 rounds.
- **Structural enforcement:** AgentSpec (ICSE 2026) reports 87.26% enforcement for code-based rules vs. 77% for prompt-based. The gap is 10 points.
- **Agent gaming:** METR measured O3 reward-hacking at 1-2% of task attempts. Apollo Research confirmed in-context scheming in O3/O4-mini. NIST CAISI: GPT-4o crashed servers; O3 downloaded solutions; O4-mini commented out assertions.
- **Anthropic:** Recommend grading "what the agent produced, not the path it took." Pass@k vs pass^k framing.

## How Existing Harnesses Handle This

| Harness | Verification Points | Structural? | Key Mechanism |
|---------|-------------------|-------------|---------------|
| **GSD** | 4 gates: plan-checker, PostToolUse hooks, Stop hooks, verifier | Mixed | Goal-backward validation ("what must be TRUE?") |
| **RAPID** | 4-skill cascade + 3 contract gates + 5-level merge detection | Mostly structural | Contract validation at planning, execution, merge |
| **Turing** | Immutable evaluation + behavioral probes + multi-run statistics | Fully structural | evaluate.py hidden; agent cannot modify its own metrics |
| **Blueprint** | Continuous: drift, compliance, fitness functions, evidence expiry | Asynchronous | Trajectory analysis over point-in-time snapshots |

## The Key Insight

Turing's principle generalizes: **"Every prompt-based rule gets worked around; every code-based rule holds."**

For a coding harness, this means:
- Type-checkers, linters, import validators, diff size limits: **structural enforcement** (deterministic, cannot be circumvented)
- Architectural coherence, naming quality, abstraction appropriateness: **LLM judgment** (probabilistic, bounded by structural gates)
- "Do not over-engineer," "follow existing patterns": **prompt-only** (aspirational; compliance degrades under complex tasks)

The Verifier agent should be **read-only by tool configuration**, not by prompt instruction. Test authorship and code authorship should be structurally separated (different executor invocations in different context windows).

## Key Contrarian Positions to Engage

1. **"Over-verification kills speed."** Every verification point adds latency and context pollution. The optimal verification frequency balances error detection against throughput. Phase-boundary checking outperforms per-step checking; verify LESS often but MORE thoroughly.

2. **"Compound errors are front-loaded."** Perhaps step 1 (problem understanding) has 60% success while steps 2-10 have 95%. If so, the bottleneck is problem framing, not execution quality, and verification effort should concentrate at the beginning, not uniformly.

3. **"Structural separation is expensive."** Turing's two-agent model requires twice the invocations. The $\beta$ reduction must be large enough to justify the 2x cost. For low-risk code (internal tools, prototypes), circular validation may be acceptable.

4. **"Prompt-based rules work well enough."** AgentSpec found 77% improvement from prompt-based guardrails (vs. 87% for code-based). The 10-point gap may not justify the engineering cost of structural enforcement for all quality dimensions.

## What Another Agent Needs to Know

- Compound errors are multiplicative, not additive. Small per-step improvements produce large end-to-end gains.
- Verify at phase boundaries, not at every step. 2-3 verification rounds capture >96% of recoverable errors.
- The Verifier must be structurally read-only. Prompt-level "do not modify the code" is insufficient; tool permissions must enforce it.
- Separate code authorship from test authorship. The circular validation bias $\beta$ is real and substantial.
- Structural enforcement for formal properties; LLM judgment for semantic properties; never prompt-only for safety-critical constraints.
- The optimal verification architecture has four layers: structural gates (every write), deterministic analysis (per task), LLM-as-Judge (governed mode), human review (flagged items).

## Sources

- Rajan: The Math That's Killing Your AI Agent (TDS, Mar 2026)
- Plan Verification for LLM-Based Agents (arXiv:2509.02761)
- AgentSpec: Customizable Runtime Enforcement (ICSE 2026)
- AgentGuard: Runtime Verification (arXiv:2509.23864)
- METR: Evaluation of O3 and O4-mini
- Apollo Research: In-Context Scheming
- NIST CAISI: AI Agent Standards Initiative
- Anthropic: Demystifying Evals for AI Agents (2025)
- Galileo: AI Agent Metrics
