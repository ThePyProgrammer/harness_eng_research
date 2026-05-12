# Pillar 9: Model Routing Architecture

## What This Pillar Is

The study of how a harness selects, configures, and composes multiple AI models across pipeline stages to optimize the cost-quality-latency tradeoff. This pillar determines WHICH MODEL to use for each task, HOW TO CONFIGURE it (temperature, system prompt, tool access), and WHEN TO SWITCH between models mid-pipeline. It treats the model as a variable, not a constant, in the harness optimization problem.

## Why It Must Exist

R3 (Systems Builder): "How do I route between different models for different task types? When should I use a single large model versus many small ones?"

The model landscape as of early 2026:
- 60x price range between cheapest (Haiku-class, ~$0.25/MTok input) and most expensive (Opus-class, ~$15/MTok input)
- Capability gap is task-dependent: for boilerplate generation, Haiku is 90%+ as good as Opus; for novel architecture decisions, Opus is qualitatively better
- Latency varies 5-10x across tiers (Haiku: ~0.5s TTFT; Opus: ~3-5s TTFT)
- Cross-model diversity is REQUIRED for reliable verification (paper's FKG inequality: same-model judging has correlated blind spots)
- SWE-bench: Pass@5 substantially exceeds Pass@1, suggesting that running multiple cheap attempts may dominate a single expensive attempt

No existing harness formalizes model selection as an optimization problem. All use either a single model (GSD, Blueprint) or hardcoded tier assignments (Cursor's autocomplete vs. agent split). This is a missed optimization of large magnitude.

## The Formal Problem(s)

### Problem 1: Stage-Level Model Assignment (Heterogeneous Assignment)

Given $K$ pipeline stages, $M$ available models, and per-stage quality functions $q_k(m)$, latency functions $l_k(m)$, and cost functions $c_k(m)$:

$$\min_{\{m_k\}_{k=1}^K} \; \sum_{k=1}^{K} c_k(m_k) \quad \text{subject to} \quad \prod_{k=1}^{K} q_k(m_k) \geq Q_{\min}, \;\; \max_k l_k(m_k) \leq L_{\max}$$

This is a combinatorial optimization with $M^K$ candidates, but with structure: quality is multiplicative (compound reliability), cost is additive, and latency is max (pipeline bottleneck). For small $M$ and $K$ (typical: $M = 3$ tiers, $K = 6$ stages), exact enumeration is feasible ($3^6 = 729$ combinations).

### Problem 2: Cross-Model Diversity Enforcement (Verification Independence)

From the paper's FKG inequality and Structural Separation Theorem: the verification model must have low blind-spot overlap with the production model. Formally, minimize the correlated escape probability:

$$P_{\text{esc}} = C_{\rho}(1 - d_{\text{prod}}, 1 - d_{\text{verify}})$$

where $C_\rho$ is the Gaussian copula with correlation $\rho$. For same-family models, $\rho$ is high (~0.7-0.9). For cross-family models, $\rho$ is lower (~0.3-0.5). The diversity gain:

$$\Delta_{\text{div}} = P_{\text{esc}}^{\text{same}} - P_{\text{esc}}^{\text{cross}}$$

is always positive and can be substantial (the paper's Section 7.7 shows a weak independent detector outperforms a strong correlated one).

**Constraint:** The verification model must be from a different model family than the production model. This is a hard constraint, not an optimization variable.

### Problem 3: Adaptive Model Escalation (Online Learning)

During execution, the harness may encounter tasks that exceed the assigned model's capability. The escalation policy decides when to switch to a more capable (and expensive) model:

$$\text{Escalate from } m_{\text{cheap}} \text{ to } m_{\text{expensive}} \text{ when: } P(\text{success} \mid m_{\text{cheap}}, \mathbf{x}) < \frac{c_{\text{cheap}} + c_{\text{rework}}}{c_{\text{expensive}}}$$

where $c_{\text{rework}}$ is the expected cost of fixing a failed cheap attempt. If the cheap model's expected success is low enough that the expected rework cost exceeds the premium for the expensive model, escalate immediately.

**Observable signals for escalation:**
- Agent self-reported uncertainty (if calibrated)
- Number of retries/self-corrections in current task
- Complexity metrics of the files being modified
- Historical success rate on similar tasks with this model

### Problem 4: Pass@K vs. Pass^K Tradeoff (Anthropic's Distinction)

From Anthropic's evaluation methodology (2026):
- **Pass@K:** Any correct output in K attempts (OR semantics). Relevant for code generation where you pick the best.
- **Pass^K:** Correct outputs across ALL K attempts (AND semantics). Relevant for multi-step pipelines where every step must succeed.

For single-stage tasks: run K cheap attempts and pick the best (Pass@K strategy). If $q_{\text{cheap}} = 0.6$ and $q_{\text{expensive}} = 0.85$:
- Pass@1 expensive: 0.85
- Pass@3 cheap: $1 - (1-0.6)^3 = 0.936$ at ~1/5 the cost

For multi-stage pipelines: each stage must succeed (Pass^K), so $R = \prod q_i^K$ for K stages with same model. The cheap model's advantage from sampling disappears because errors compound:
- 5-stage Pass@1 expensive: $0.85^5 = 0.444$
- 5-stage Pass@1 cheap: $0.60^5 = 0.078$

**The crossover:** There exists a pipeline length $n^*$ beyond which a single expensive-model attempt dominates K cheap-model attempts. For $q_e = 0.85, q_c = 0.60$: $n^* \approx 3$ stages. Beyond 3 stages, expensive dominates cheap-with-sampling.

## The Right Mathematical Framework

- **Assignment problems** (Kuhn-Munkres): optimal matching of models to stages
- **Copula theory** (Sklar): modeling correlated detection failures across model families
- **Best-of-N sampling** (Stiennon et al., 2020): statistical properties of selecting the best from multiple attempts
- **Online learning** (Auer et al., 2002): adaptive escalation without knowing task difficulty a priori
- **Cascade classifiers** (Viola-Jones, 2004): stage-wise model selection with early rejection

## Key Quantities

- $q_k(m)$: quality (success probability) of model $m$ at stage $k$
- $c_k(m)$: cost (tokens * price) of model $m$ at stage $k$
- $l_k(m)$: latency of model $m$ at stage $k$
- $\rho(m_i, m_j)$: blind-spot correlation between models $m_i$ and $m_j$
- $n^*$: pipeline length crossover where expensive-single dominates cheap-sampled
- $\Delta_{\text{div}}$: diversity gain from cross-model verification

## What Existing Research Shows

**Model capability is task-dependent:**
- HumanEval: Haiku-class models score 85%+; frontier models score 92%+ (diminishing returns for boilerplate)
- SWE-bench Verified: frontier models plateau at ~77%; smaller models at ~40-50% (large gap for integration tasks)
- LiveCodeBench: 38.9% for best models (novel competitive-programming-style problems; no model is reliable)
- The gap between models is largest for novel, complex, multi-file tasks and smallest for single-function, well-defined tasks

**Cross-model verification is empirically validated:**
- Multi-Agent Verification (Lifshitz et al., 2025): diverse verifier ensembles outperform homogeneous ones
- Weaker models can verify stronger models (the verifier doesn't need to produce the code, only evaluate it)
- ConGra (Zhu et al., 2024): general-purpose LLMs outperform code-specialized LLMs at merge conflict resolution

**Best-of-N sampling is effective:**
- SWE-bench: Pass@5 substantially exceeds Pass@1 (Anthropic, 2026)
- The value of sampling depends on error independence; if errors are correlated (same prompt, same model), Pass@K improvement is sublinear
- Temperature scaling affects diversity: higher temperature increases diversity but decreases per-sample quality

**Model routing in production:**
- Cursor uses different models for autocomplete (fast, cheap) vs. agent tasks (capable, expensive)
- OpenAI Codex uses a single model per task but selects task granularity
- Anthropic's prompt caching documentation implies heavy use of KV-cache, which ties the user to a single provider/model family per conversation

## How Existing Harnesses Handle This

| Harness | Model Selection | Cross-Model | Adaptive? |
|---------|----------------|-------------|-----------|
| GSD | Inherits user's model; configurable model_profile (quality/balanced/budget) | No | No |
| RAPID | Configurable model_profile per project | No | No |
| Turing | researcher (read/write) vs. evaluator (read-only); same model family | No (same family) | No |
| Blueprint | Single model; persona applied uniformly | No | No |
| Cursor | Autocomplete (fast/cheap) vs. agent (capable/expensive) | No | Partially (model switch at UI level) |

**Key observation:** No existing harness implements formal model routing. The opportunity is large: 60x cost range with task-dependent capability gaps.

## Key Contrarian Positions

1. **"Single model is simpler and the complexity of routing isn't worth it."** Complexity has costs: debugging multi-model pipelines is harder; prompt compatibility across model families is non-trivial; caching strategies differ. Counter: the 60x price differential is too large to ignore. Even a crude 2-tier routing (cheap for simple, expensive for complex) saves 50-80%.

2. **"Frontier models will be cheap enough that routing is unnecessary."** Prices are falling, but so are the costs of competing models. The ratio between tiers is approximately constant even as absolute prices fall. And demand scales with price drops (Jevons paradox).

3. **"Cross-model verification adds latency and API complexity."** True. Each additional model API is a dependency, a failure point, and a latency source. Counter: the FKG inequality shows same-model judging is systematically biased. The latency cost of cross-model verification is a one-time per-review cost; the quality benefit applies to every defect caught.

4. **"Best-of-N sampling wastes tokens on bad outputs."** At $q = 0.6$, running 5 attempts wastes 2-3 attempts on average. Counter: the EXPECTED cost of 5 cheap attempts is still less than 1 expensive attempt for most task types. The waste is real but economically rational.

5. **"You can't predict task difficulty accurately enough for routing to work."** Task difficulty estimation is noisy. Counter: even a noisy classifier with 70% accuracy provides substantial routing value (the cost savings from correctly routing 70% of tasks to cheap models far exceed the quality loss from misrouting 30%). The threshold for useful routing is low.

## What Another Agent Writing This Pillar Needs to Know

- The FKG inequality (from Quality pillar) is the strongest theoretical argument for cross-model verification. Same-model judging has $P(\text{both miss}) \geq P(\text{producer misses}) \times P(\text{judge misses})$; independence UNDERESTIMATES escape probability.
- The Pass@K vs. Pass^K distinction (from Anthropic's evaluation work) is critical: sampling helps for single-stage tasks but HURTS for multi-stage pipelines due to compound error. The crossover point ($n^*$) determines when to switch strategy.
- Temperature is the key parameter for best-of-N diversity. But temperature interacts with model capability: high temperature on a weak model produces diverse garbage; on a strong model, it produces diverse high-quality outputs.
- Provider lock-in through KV-cache: switching models mid-conversation invalidates the cache. Model routing must account for cache economics: switching costs $R_{\text{cache miss}}$ per transition.
- The Coordination pillar's cross-model requirement for verification is a HARD constraint: the verifier must be from a different family. This means the harness must maintain API access to at least 2 model providers.
- RAPID's `model_profile` config (quality/speed) is the simplest form of routing. The contribution here is making it formal, adaptive, and stage-aware rather than a global setting.

## Sources

- Anthropic (2026): Agent evaluation methodology (Pass@K vs. Pass^K)
- Lifshitz et al. (2025): Multi-Agent Verification (arXiv)
- Zhu et al. (2024): ConGra -- context-grounded conflict resolution
- Stiennon et al. (2020): Learning to summarize from human feedback (best-of-N)
- Auer et al. (2002): Finite-time analysis of the multi-armed bandit problem
- Viola & Jones (2004): Robust real-time face detection (cascade classifiers)
- Kim et al. (2025): Scaling laws for multi-agent systems (arXiv:2512.08296)
- Sklar (1959): Fonctions de repartition a n dimensions et leurs marges (copula theory)
