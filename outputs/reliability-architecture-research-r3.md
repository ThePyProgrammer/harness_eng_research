# Verification and Enforcement Mechanisms for AI Agent Workflows

## Research Round 3: Structural vs. Prompt Enforcement, Measured Effectiveness

---

## 1. AgentSpec: Runtime Enforcement via Domain-Specific Language

**Source**: Wang, Poskitt, Sun. "AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents." ICSE 2026 (IEEE/ACM 48th International Conference on Software Engineering), Rio de Janeiro. [arXiv:2503.18666](https://arxiv.org/abs/2503.18666).

### Framework Design

AgentSpec is a lightweight domain-specific language (DSL) for specifying and enforcing runtime constraints on LLM agents. Each rule contains three components:

1. **Triggering event**: when to evaluate (before action execution, after observation, at task completion)
2. **Predicate conditions**: what to check (constraints expressed in the DSL)
3. **Enforcement mechanisms**: what to do on violation (block, modify, alert)

The system hooks into LangChain's execution pipeline at three decision points: `AgentAction` (before execution), `AgentStep` (after observation), and `AgentFinish` (task completion). ANTLR4 parses rules and evaluates predicates against agent trajectories.

### Measured Effectiveness

The critical finding is the gap between manually authored rules and LLM-generated rules:

| Domain | Manual Rules | LLM-Generated (o1) | Notes |
|--------|-------------|-------------------|-------|
| Code execution (RedCode-Exec) | >90% unsafe executions prevented | 87.26% risky code identified | CodeAct framework |
| Embodied robotics (SafeAgentBench) | 100% hazardous actions eliminated | 95.56% precision, 70.96% recall | Robotic arm control |
| Autonomous vehicles (FixDrive) | 100% compliance enforced | 62.50% (5/8 scenarios) | Apollo system |

The 87.26% figure represents LLM-generated code-based rules identifying risky code in the code agent domain. Manual, hand-authored rules achieved over 90% prevention. This gap (roughly 87% vs. 90%+) illustrates a core finding: code-based enforcement significantly outperforms prompt-based approaches, but automated rule generation still lags behind expert-crafted rules, particularly in complex domains like autonomous driving (62.50%).

### Architectural Insight

AgentSpec demonstrates the principle that enforcement through code (deterministic rule evaluation) produces measurably higher compliance than enforcement through prompts (probabilistic LLM behavior). The DSL creates a hard boundary: the agent cannot circumvent a code-based rule through clever prompting or hallucination.

---

## 2. AgentGuard: Dynamic Probabilistic Assurance via MDP Modeling

**Source**: Koohestani, Roham. "AgentGuard: Runtime Verification of AI Agents." Delft University of Technology / JetBrains Research. [arXiv:2509.23864](https://arxiv.org/abs/2509.23864). Presented at AgenticSE 2025 (ASE 2025).

### Core Concept: Dynamic Probabilistic Assurance

AgentGuard shifts verification from a binary (pass/fail) paradigm to continuous probabilistic monitoring. Rather than asking "will this agent fail?" it asks "what is the probability of failure within given constraints?"

### Architecture (Four Components)

1. **Trace Monitor and Event Abstractor**: Captures raw agent I/O; converts it into formal state-transition events corresponding to an underlying state model.
2. **Online Model Learner**: Continuously updates a Markov Decision Process (MDP) with observed transition probabilities as the agent operates.
3. **Probabilistic Model Checker**: Verifies quantitative properties against PCTL (Probabilistic Computation Tree Logic) specifications.
4. **Dashboard and Actuator**: Presents assurance guarantees to human overseers; triggers alerts or interventions.

### Formal Model: Agentic MDP

The system constructs an AMDP tuple (S, A, P, R, gamma) where:

- **S** (states) captures agent progress, context, artifacts, memory, and conversation history
- **A** (actions) corresponds to discrete tool invocations
- **P** (transitions) reflects outcome uncertainty, learned online
- **R** (rewards) makes agent goals explicit through incentive structures

### Key Metrics

- **P_max**: Success probability (predicting fix likelihood)
- **E_min**: Expected cycles to completion (estimating time and cost)
- **Failure probability**: Probability of specific failure modes without taking certain corrective actions

### Integration Model

AgentGuard is framework-agnostic middleware that sits atop existing agentic frameworks (AutoGen, LangGraph) without intrusion. Agent tools trigger calls that log transitions, enabling the MDP to be built and updated without modifying the agent's core logic.

### Limitation

The proof-of-concept demonstrates feasibility but does not report extensive empirical results with measured effectiveness numbers. This is a framework contribution, not yet an empirical validation at scale.

---

## 3. LLM-as-Judge: Reliability, Biases, and Calibration

### Agreement Rates

Multiple studies report varying reliability depending on domain and configuration:

| Condition | Agreement Rate | Source |
|-----------|---------------|--------|
| Abstained samples (selective evaluation) | 0.815 inter-annotator agreement | ICLR 2025, "Trust or Escalate" |
| Evaluated samples (after filtering) | 0.902 inter-annotator agreement | Same study |
| Expert knowledge tasks (law, medicine) | 64-68% LLM-human alignment | Multilingual LLM-as-Judge study, EMNLP 2025 |
| Inter-expert human baselines | ~72-75% | Same study |
| Code judging (pairwise) | >10% accuracy shift from position swap | Position bias systematic study |

Out of 54 LLMs tested as judges, 27 achieved Tier 1 performance, with 23 exhibiting human-like judgment patterns. However, domain specificity creates pronounced alignment gaps.

**Source**: [Survey on LLM-as-a-Judge](https://arxiv.org/abs/2411.15594); [Systematic Study of Position Bias](https://arxiv.org/abs/2406.07791); [Justice or Prejudice: Quantifying Biases](https://llm-judge-bias.github.io/).

### Documented Biases

1. **Position bias**: Judges systematically favor responses based on presentation order. Swapping order in pairwise code judging shifts accuracy by more than 10%. Magnitude depends on model family, context window, and quality gap between candidates.

2. **Verbosity bias**: LLM judges prefer verbose, formal, or fluent outputs regardless of substantive quality. This is an artifact of generative pretraining and RLHF alignment.

3. **Sycophancy / Agreeableness bias**: True positive rates exceed 96%, but true negative rates fall below 25%. This inflates apparent reliability in class-imbalanced settings; the judge almost never says "no."

4. **Self-preference bias**: An LLM judge assigns higher scores to outputs that are more "familiar" to its own policy, as measured by lower perplexity. The judge prefers text that looks like its own generations.

### Calibration Challenges

Existing confidence estimation methods tend to overestimate human agreement, even with the strongest judge models. A method called "Simulated Annotators" estimates confidence through in-context learning and improves both calibration and failure prediction without external supervision.

### Practical Guidance

- Binary outputs produce more stable evaluations than numeric scoring
- Reproducible scoring templates with documented chain-of-thought reasoning improve consistency
- Inter-judge reliability should be measured with Cohen's Kappa or Krippendorff's Alpha
- The CALM framework systematically quantifies 12 key biases using automated and principle-guided modification
- One study spanning 15 LLM judges, 22 tasks, ~40 solution-generating models, and over 150,000 evaluation instances measured repetition stability, position consistency, and preference fairness

### Implication for Harness Design

LLM-as-Judge is useful but unreliable as a sole verification mechanism. Its failure modes (sycophancy, position bias, self-preference) are systematic, not random. Structural enforcement should handle safety-critical constraints; LLM judges can supplement for subjective quality assessment where approximate agreement is acceptable.

---

## 4. Structural Enforcement Approaches

### The Fundamental Distinction

The core argument from multiple sources: **prompts are probabilistic suggestions; code enforcement is deterministic**.

A prompt-based guardrail says "do not do X" and the model follows because that response is statistically likely given the system prompt. A code-based enforcement layer intercepts tool calls before execution, checks them against policies defined in code, and makes a deterministic decision (permit, deny, or defer for human approval). The model does not get a vote.

**Source**: [Cisco: Prompt Injection is the New SQL Injection](https://blogs.cisco.com/ai/prompt-injection-is-the-new-sql-injection-and-guardrails-arent-enough); [DEV: Your Agent's Guardrails Are Suggestions](https://dev.to/brianrhall/your-agents-guardrails-are-suggestions-not-enforcement-2c8k).

### Attack Success Rates Against Prompt-Based Safety

Researchers have demonstrated attack success rates exceeding 90% against production guardrail systems using prompt injection. Every mitigation based on input filtering, output guardrails, and system prompt hardening is probabilistic; researchers consistently demonstrate bypasses within weeks of new guardrails being deployed.

### Sandboxing Approaches

Three tiers of isolation, ordered by strength:

1. **MicroVMs** (Firecracker, Kata Containers): Dedicated kernels per workload; strongest isolation boundary
2. **gVisor**: User-space kernel with syscall interception; lighter than full VMs
3. **Hardened containers**: Adequate only for trusted code; insufficient for adversarial agent scenarios

**Source**: [Northflank: How to Sandbox AI Agents in 2026](https://northflank.com/blog/how-to-sandbox-ai-agents); [NVIDIA: Practical Security Guidance for Sandboxing Agentic Workflows](https://developer.nvidia.com/blog/practical-security-guidance-for-sandboxing-agentic-workflows-and-managing-execution-risk/).

### Tool Permission Systems

Capability-based security explicitly grants access to specific APIs rather than blanket permissions. Modern systems implement:

- **Fine-grained filesystem access**: read-only mounts, workspace-scoped writes
- **Network egress controls**: preventing data exfiltration
- **Stateful policies**: "agent may check out a shopping cart under $50 only once" (constraining not just what tools are available, but the conditions under which they can be invoked)
- **Rate limiting per tool**: preventing resource exhaustion

### OWASP Agentic AI Top 10 (2026)

The OWASP framework identifies five primary attack surfaces for AI agents: prompt injection, memory poisoning, tool misuse, supply chain attacks, and data exfiltration. Key recommendations:

- Treat agents as managed Non-Human Identities (each agent gets its own Client ID and credentials)
- Apply least privilege per tool (scope, rate limits, allowed data types)
- Require explicit confirmation for destructive actions
- Run tools in sandboxed environments with egress controls

**Source**: [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html).

### Immutable Evaluation Infrastructure

For ML experiment harnesses specifically, immutability serves a dual purpose (integrity and reproducibility):

- **lakeFS**: Maintains immutable snapshots of data at any point in time, enabling exact environment recreation and rollback
- **Three pillars of ML reproducibility**: Input data, code/parameters, and execution environment must all remain stable
- **Read-only evaluation scripts**: Preventing the agent-under-test from modifying the scoring mechanism

The analogy to SQL injection is instructive: SQL injection was solved at the architectural level with parameterized queries that created a hard boundary between code and data. The database engine itself enforces the separation. Similarly, immutable evaluation infrastructure creates a hard boundary between the agent's outputs and the evaluation mechanism.

---

## 5. Plan Verification Methods

**Source**: Hariharan, Dongre, Hakkani-Tur, Tur. "Plan Verification for LLM-Based Embodied Task Completion Agents." [arXiv:2509.02761](https://arxiv.org/abs/2509.02761).

### Judge-Planner Iterative Framework

The system uses two collaborating LLM agents in a verification loop:

1. **Judge LLM**: Analyzes action sequences step by step; flags actions that appear redundant, irrelevant, contradictory, or otherwise unjustified; provides natural language explanations for each flag.
2. **Planner LLM**: Receives the judge's critique and revises the plan accordingly.
3. **Iteration**: The cycle repeats until no further issues are detected or iteration limits are reached.

### Measured Performance

**Zero-shot results** (single-pass judge evaluation):

| Judge Model | Recall | Precision |
|-------------|--------|-----------|
| GPT-4o-mini | 80% | 93% |
| DeepSeek-R1 | 68% | 100% |
| Gemini 2.5 | 74% | 90% |
| LLaMA 4 Scout | 74% | 85% |

**Iterative results** (best performing judge-planner pairs):

| Configuration | Recall | Precision |
|---------------|--------|-----------|
| GPT-4o-mini judge + DeepSeek-R1 planner | 90% | 80% |
| Gemini 2.5 judge + Gemini 2.5 planner | 89% | 99% |

### Convergence Speed

- 62% of sequences require no further modifications after iteration 1
- 89% converge by iteration 2
- 96.5% cumulative convergence by iteration 3
- Only 3.5% benefit from rounds 4-5

### Error Types Detected

The framework identifies: redundant actions, contradictory steps, irrelevant objects, incomplete sequences, and premature operations. It struggles with context-dependent redundancies and multi-step preparations.

### Limitations

- Evaluated only on household tasks (TEACh dataset, 100 episodes, 15 task types, 1,408 human-generated actions); generalization to other domains is untested
- Zero-shot prompting is susceptible to LLM biases and hallucinations
- Lacks environmental grounding (no visual or physical simulation feedback)
- Computational overhead may be prohibitive for large-scale applications

### Complementary Work: Bridging LLM Planning and Formal Methods

A related paper, "Bridging LLM Planning Agents and Formal Methods: A Case Study in Plan Verification" ([arXiv:2510.03469](https://arxiv.org/abs/2510.03469)), explores using formal methods (model checking) to verify LLM-generated plans, creating a bridge between the probabilistic outputs of LLMs and the deterministic guarantees of formal verification.

---

## 6. Multi-Agent Verification Architectures

### Multi-Agent Verification (MAV): Scaling Test-Time Compute

**Source**: Lifshitz (ArdaLabs.AI), McIlraith (University of Toronto, Vector Institute), Du (Harvard). "Multi-Agent Verification: Scaling Test-Time Compute with Multiple Verifiers." [arXiv:2502.20379](https://arxiv.org/abs/2502.20379).

#### BoN-MAV Algorithm

1. Sample n candidate outputs from a generator LLM
2. Collect binary approval votes from m aspect verifiers for each output
3. Select the output with the highest aggregated approval score

Aspect Verifiers (AVs) are off-the-shelf LLMs prompted to verify different aspects of outputs. They require no additional training and can be freely combined.

#### Measured Results

| Benchmark | Baseline | BoN-MAV (best) | Improvement |
|-----------|----------|----------------|-------------|
| MATH (competition-level) | 52.7% (Gemini-1.5-Flash) | 69% (256 candidates) | +16.3pp |
| General (smaller models) | varies | up to +20pp | significant |
| General (larger models) | varies | up to +10pp | meaningful |

Key finding: **diverse verifier sets outperform querying the same verifier multiple times**. Using heterogeneous verification models produces better results than homogeneous ensembles.

#### Weak-to-Strong Generalization

The most striking result: weaker models can effectively verify stronger ones. GPT-4o (strong generator) improved substantially when evaluated by verifiers based on smaller models (Gemini-1.5-Flash, GPT-4o-mini). This suggests that combining multiple weaker verifiers improves even stronger LLMs, a form of scalable oversight.

### Debate-Based Verification

**Source**: Irving, Christiano, Amodei. "AI Safety via Debate." [arXiv:1805.00899](https://arxiv.org/abs/1805.00899).

The original proposal (2018): train agents via self-play on a zero-sum debate game where two agents make short statements, then a human judges which agent provided the most true, useful information. Theoretically, debate with optimal play can answer any question in PSPACE given polynomial-time judges.

#### Empirical Reality

Subsequent empirical testing has produced mixed results:

- Initial experiments on the QuALITY dataset with human debaters and judges **failed to significantly improve judge accuracy** in one-turn and two-turn debates
- Debate proved effective with strong human debaters but **ineffective when humans were replaced with GPT-4 debaters**
- More recent work showed promising results with LLM debaters and judges using inference-time debate, RL training of debaters, and supervised training of the judge
- Human participants interacting with unreliable LLM dialog assistants through chat **substantially outperformed both the model alone and their own unaided performance**

**Source**: [Scalable AI Safety via Doubly-Efficient Debate](https://arxiv.org/abs/2311.14125); [Knowledge Divergence and the Value of Debate for Scalable Oversight](https://arxiv.org/html/2603.05293).

### Constitutional AI as Self-Verification

**Source**: Bai et al. "Constitutional AI: Harmlessness from AI Feedback." Anthropic, 2022. [arXiv:2212.08073](https://arxiv.org/abs/2212.08073).

Constitutional AI (CAI) provides a set of principles (a "constitution") against which the model evaluates its own outputs. The training process involves:

1. **Supervised phase**: Model generates self-critiques and revisions against constitutional principles; finetunes on revised responses
2. **RL phase**: Model evaluates paired samples against the constitution; trains a preference model from AI-generated preferences

#### Verification Limitations

The fundamental critique: the model "grades its own homework." Independent verification of whether deployed behavior matches the constitution is not documented. Critics argue that replacing human feedback with AI self-critique removes elements that provide democratic legitimacy and external accountability.

CAI is effective at training time for shaping model behavior but does not constitute runtime verification. It is a training methodology, not an enforcement mechanism.

### Plan-Execute-Verify-Replan (PEVR)

A common orchestration pattern uses independent verification agents within multi-agent workflows:

- **Planner agent**: generates a plan
- **Executor agent(s)**: carry out plan steps
- **Verifier agent**: evaluates whether collective results satisfy the original query
- **Replanner**: adjusts based on verification feedback

Task-specific evaluator models generally outperform general-purpose models as verifiers. Specialized verifiers achieve the highest performance on benchmark tasks.

**Source**: [Verified Multi-Agent Orchestration](https://arxiv.org/html/2603.11445); [PwC: Validating Multi-Agent AI Systems](https://www.pwc.com/us/en/services/audit-assurance/library/validating-multi-agent-ai-systems.html).

---

## 7. Formal Verification of Agent Outputs

### Static Analysis of AI-Generated Code: Empirical Results

#### CodeRabbit Study (December 2025)

Analysis of 470 real-world open source pull requests:

- AI-generated PRs contain **~1.7x more issues** on average than human-written PRs
- Critical and major defects up to 1.7x higher in AI-authored changes
- Logic and correctness issues rise 75%
- Security vulnerabilities rise 1.5-2x
- Performance inefficiencies appear **nearly 8x more often** in AI-generated code

**Source**: [CodeRabbit State of AI vs Human Code Generation Report](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report).

#### University of Naples Large-Scale Study (August 2025)

Over 500,000 code samples in Python and Java comparing human developers against ChatGPT, DeepSeek-Coder, and Qwen-Coder:

- AI-generated code is generally simpler and more repetitive
- More prone to unused constructs and hardcoded debugging artifacts
- Contains more high-risk security vulnerabilities
- Human-written code exhibits greater structural complexity

**Source**: [Human-Written vs. AI-Generated Code: A Large-Scale Study](https://arxiv.org/abs/2508.21634).

#### Technical Debt Study (April 2026)

Tracking 304,362 AI-authored commits:

- 484,606 distinct issues identified
- Code smells account for 89.1% of all issues
- More than 15% of commits from every AI coding assistant introduce at least one issue

**Source**: [Debt Behind the AI Boom](https://arxiv.org/html/2603.28592v1).

### Formal Specification Generation: AutoSpec

**Source**: [AutoSpec: Automated Specification Frameworks](https://www.emergentmind.com/topics/autospec).

AutoSpec automates synthesis of formal specifications (invariants, preconditions, postconditions) for program verification. The iterative loop:

1. Static analysis decomposes the program to direct LLM attention
2. LLM generates candidate specifications
3. Program verifier validates candidates
4. Failed specifications feed back into the next generation round

**Results**: Successfully verifies 79% of benchmark programs (199/251), a 1.592x improvement (59.2% more programs) over prior techniques. Handles programs with arrays, pointers, nested loops, and function calls.

Subsequent work (SLD-Spec, 2025) improved upon AutoSpec for complex loop constructs with better verification success rates and runtime efficiency.

### Emerging Integration Pattern

The field is converging on a hybrid approach where LLMs generate code and candidate formal specifications simultaneously, and traditional verification tools (type checkers, static analyzers, model checkers) validate the specifications. This creates a pipeline:

1. LLM generates code + annotations/specifications
2. Static analyzer checks for common defects (linting, type errors)
3. Formal verifier attempts to prove specifications hold
4. Failures feed back to the LLM for iterative refinement

The key insight: LLMs are good at generating candidate specifications but poor at verifying them. Traditional tools are poor at generating specifications but excellent at verifying them. The combination leverages the strengths of both.

---

## Cross-Cutting Analysis: The Structural vs. Prompt Enforcement Boundary

### The Evidence Base

| Enforcement Type | Measured Effectiveness | Failure Mode |
|-----------------|----------------------|--------------|
| Prompt-based guardrails | >90% attack success rate against them | Probabilistic; bypassed by injection |
| Code-based rules (AgentSpec, manual) | >90% prevention rate | Incomplete specification; legitimate edge cases |
| Code-based rules (AgentSpec, LLM-generated) | 62-87% depending on domain | Rule quality varies by domain complexity |
| Immutable infrastructure | ~100% for what it covers | Covers integrity, not correctness |
| LLM-as-Judge verification | 64-90% agreement with humans | Sycophancy, position bias, self-preference |
| Multi-agent verification (BoN-MAV) | +10-20pp over single verifier | Compute cost scales with verifier count |
| Plan verification (iterative judge-planner) | 89-90% recall at convergence | Domain-specific; limited to action sequence errors |
| Formal verification (AutoSpec) | 79% of benchmark programs verified | Limited to programs with formal specifications |

### Design Principles Emerging from the Literature

1. **Structural enforcement for safety; probabilistic methods for quality.** Safety-critical constraints (do not delete production data, do not exceed budget) should be enforced through code, sandboxing, and capability restrictions. Quality judgments (is this code well-structured, is this response helpful) can use LLM-based evaluation with appropriate calibration.

2. **Defense in depth, not defense in kind.** Layering multiple enforcement mechanisms of different types (sandboxing + tool permissions + LLM judge + formal verification) produces more robust systems than multiple instances of the same mechanism (three LLM judges).

3. **Diverse verifiers outperform homogeneous ensembles.** The MAV finding that heterogeneous verifiers beat multiple queries to the same verifier has broad implications. Type checkers, linters, LLM judges, and human reviewers catch different classes of errors.

4. **Iteration converges fast.** Both plan verification (96.5% by iteration 3) and AutoSpec (iterative specification refinement) show that verification loops converge quickly. Two to three rounds capture most available improvement.

5. **The weak-to-strong generalization finding matters.** If weaker models can verify stronger ones, then verification does not require capabilities equal to the system being verified. This supports architectures where lightweight, specialized verifiers assess the output of more powerful generators.

6. **Immutability is the strongest guarantee.** Read-only evaluation scripts, immutable data snapshots, and containerized evaluation environments provide guarantees that no prompt or adversarial input can circumvent. They enforce a hard boundary between the system under test and the measurement apparatus.

---

## Key Citations

1. Wang, Poskitt, Sun. "AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents." ICSE 2026. [arXiv:2503.18666](https://arxiv.org/abs/2503.18666)
2. Koohestani. "AgentGuard: Runtime Verification of AI Agents." AgenticSE / ASE 2025. [arXiv:2509.23864](https://arxiv.org/abs/2509.23864)
3. Li et al. "A Survey on LLM-as-a-Judge." 2024. [arXiv:2411.15594](https://arxiv.org/abs/2411.15594)
4. Ye et al. "Judging the Judges: A Systematic Study of Position Bias in LLM-as-a-Judge." IJCNLP-AACL 2025. [arXiv:2406.07791](https://arxiv.org/abs/2406.07791)
5. "Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge." [Project page](https://llm-judge-bias.github.io/)
6. Hariharan, Dongre, Hakkani-Tur, Tur. "Plan Verification for LLM-Based Embodied Task Completion Agents." [arXiv:2509.02761](https://arxiv.org/abs/2509.02761)
7. Lifshitz, McIlraith, Du. "Multi-Agent Verification: Scaling Test-Time Compute with Multiple Verifiers." 2025. [arXiv:2502.20379](https://arxiv.org/abs/2502.20379)
8. Irving, Christiano, Amodei. "AI Safety via Debate." 2018. [arXiv:1805.00899](https://arxiv.org/abs/1805.00899)
9. Bai et al. "Constitutional AI: Harmlessness from AI Feedback." 2022. [arXiv:2212.08073](https://arxiv.org/abs/2212.08073)
10. CodeRabbit. "State of AI vs Human Code Generation Report." December 2025. [Report](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
11. "Human-Written vs. AI-Generated Code: A Large-Scale Study of Defects, Vulnerabilities, and Complexity." August 2025. [arXiv:2508.21634](https://arxiv.org/abs/2508.21634)
12. "Debt Behind the AI Boom: A Large-Scale Empirical Study of AI-Generated Code in the Wild." April 2026. [arXiv:2603.28592](https://arxiv.org/html/2603.28592v1)
13. OWASP AI Agent Security Cheat Sheet. [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
14. Northflank. "How to Sandbox AI Agents in 2026." [Blog](https://northflank.com/blog/how-to-sandbox-ai-agents)
15. NVIDIA. "Practical Security Guidance for Sandboxing Agentic Workflows." [Blog](https://developer.nvidia.com/blog/practical-security-guidance-for-sandboxing-agentic-workflows-and-managing-execution-risk/)
16. "Bridging LLM Planning Agents and Formal Methods." [arXiv:2510.03469](https://arxiv.org/abs/2510.03469)
17. "Scalable AI Safety via Doubly-Efficient Debate." [arXiv:2311.14125](https://arxiv.org/abs/2311.14125)
18. AutoSpec framework. [Emergent Mind](https://www.emergentmind.com/topics/autospec)
