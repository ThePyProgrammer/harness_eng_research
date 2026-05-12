# Pillar 7: Economics Architecture

## What This Pillar Is

The study of cost-quality-speed tradeoffs in AI coding agent harness operation. This pillar determines HOW TO ALLOCATE finite financial resources across context, computation, verification, and governance to maximize verified output per dollar. Unlike the other pillars which optimize within their domain (information quality, reliability, coordination, speed, defect detection, coherence), the Economics pillar operates as a **meta-constraint** that binds all others: every design choice has a token cost, every verification layer has a price, and the budget is finite.

## Why It Must Exist

Cost is the binding constraint in production. R3 (Systems Builder reviewer): "The framework does not help with the hardest harness design questions I face daily: How do I set token budgets that balance quality against cost?"

Quantitative motivation:
- At current pricing (~$0.003-$0.015 per 1K input tokens), a 200K-token context costs $0.60-$3.00 per call
- A team running 50 agent iterations per task at full context: $30-$150 per task
- RAPID's parallel execution with 4-5 agents: multiply by agent count
- GSD's 45-60 minute cycles: developer time cost dominates token cost at senior rates
- JetBrains found that 52% context reduction IMPROVED performance by 2.6% -- less is literally cheaper AND better
- The optimal context budget (Pillar 1: 0.15W-0.40W) and the financial budget often have different optima; the binding constraint is whichever is tighter

The paper's Information pillar derives quality-optimal context budgets. But in practice, the financial budget is often more restrictive than the quality budget, making the quality-optimal solution infeasible. This pillar closes that gap.

## The Formal Problem(s)

### Problem 1: Token Budget Allocation (Portfolio Optimization)

Given a total budget $B$ per task and $K$ pipeline stages (context loading, research, planning, execution, verification, governance), each consuming tokens at rate $r_k$ with quality contribution $q_k(r_k)$:

$$\max_{\{r_k\}} \; \prod_{k=1}^{K} q_k(r_k) \quad \text{subject to} \quad \sum_{k=1}^{K} p_k \cdot r_k \leq B$$

where $p_k$ is the effective price per token at stage $k$ (varies by model tier and caching). This is a constrained optimization with diminishing-returns quality functions, solvable via Lagrange multipliers when $q_k$ are concave.

The key insight: quality contributions are **multiplicative** (compound reliability, $R = \prod p_i$), but costs are **additive**. This means the marginal value of a dollar spent on the lowest-quality stage is always highest -- the same "fix the weakest link" principle from Reliability, but expressed in economic terms.

### Problem 2: Model Tier Selection (Stochastic Knapsack)

Given $M$ available models with capability $c_m$, cost-per-token $p_m$, and latency $l_m$, and $K$ pipeline stages each requiring minimum capability $c_k^{\min}$:

$$\min_{\{m_k\}} \; \sum_{k=1}^{K} p_{m_k} \cdot r_k \quad \text{subject to} \quad c_{m_k} \geq c_k^{\min}, \;\; \prod_{k} q_k(c_{m_k}) \geq Q_{\min}$$

This is a heterogeneous assignment problem: match the cheapest model that meets each stage's capability requirement, subject to a global quality floor.

### Problem 3: The Cost-Quality Pareto Frontier

The paper's Temporal pillar defines VIH = lambda_raw * p_verify. The Economics pillar extends this to:

$$\text{CVIH} = \frac{\text{VIH}}{C_{\text{total}}} = \frac{\lambda_{\text{raw}} \cdot p_{\text{verify}}}{C_{\text{total}}}$$

Cost-adjusted Verified Iterations per Hour. This is the true efficiency metric: verified iterations per dollar-hour.

## The Right Mathematical Framework

- **Portfolio theory** (Markowitz): budget allocation across stages as asset allocation with correlated returns
- **Stochastic knapsack** (Dantzig): model assignment under capability constraints
- **Queueing economics** (Kleinrock): cost of waiting (developer idle time) vs. cost of serving (compute)
- **Value of Information** (Howard): expected value of acquiring additional context before acting
- **Marginal analysis**: at optimum, marginal quality per dollar is equal across all stages

## Key Quantities

- $B$: total budget per task (hard constraint)
- $p_k$: effective price per token at stage $k$ (accounts for caching discounts)
- $r_k$: tokens consumed at stage $k$
- $q_k(r_k)$: quality contribution of stage $k$ as function of tokens spent
- $\text{CVIH}$: cost-adjusted verified iterations per hour
- $\text{ROI}(\ell, j) = d_{\ell,j} \cdot D_j / c_\ell$: return on investment for verification layer $\ell$ on defect type $j$ (from Quality pillar, now formalized as the allocation criterion)
- $\rho_{\text{cache}}$: cache hit rate (reduces effective cost; KV-cache at 92% hit rate reduces cost by 81%)

## What Existing Research Shows

**Token economics are highly non-linear:**
- KV-cache: 92% hit rate, 81% cost reduction for static prefixes (Anthropic, 2026)
- Prompt caching: 45-80% cost reduction, 13-31% TTFT improvement (Liang et al., 2026)
- Agentic Plan Caching: 50% cost reduction, 27% latency reduction (Zhang et al., 2025)
- JetBrains observation masking: 52% fewer tokens, 2.6% BETTER performance

**The cost curve is concave (diminishing returns):**
- First 20% of context budget captures ~60% of quality (from submodularity of mutual information)
- Last 20% of context budget may actively degrade quality (degradation-adjusted objective is non-monotone)
- Optimal spend is well below maximum in most cases

**Developer time dominates token cost for long cycles:**
- At $100/hr developer rate and 50-minute GSD cycle: $83 of developer time per cycle
- Token cost per cycle: $5-$30 (depending on model and context size)
- Developer idle time during agent execution: the hidden cost

**Model capability pricing follows steep tiers:**
- Frontier (Opus-class): ~$15/MTok input, ~$75/MTok output
- Strong (Sonnet-class): ~$3/MTok input, ~$15/MTok output  
- Fast (Haiku-class): ~$0.25/MTok input, ~$1.25/MTok output
- 60x price range between cheapest and most expensive; capability gap is much smaller for many task types

## How Existing Harnesses Handle This

| Harness | Cost Strategy | Token Budget | Model Selection |
|---------|--------------|-------------|-----------------|
| GSD | Fresh context per task (implicit budget via 200K cap) | Not explicit | Single model (inherits from user) |
| RAPID | Parallel worktrees (multiplied cost) | Not explicit | Configurable model_profile (quality/speed) |
| Turing | Autonomous loop (unbounded iterations) | Not explicit | Single model per role (researcher/evaluator) |
| Blueprint | Read-only agents (low cost per invocation) | Not explicit | Single model |
| Cursor | Background agents (cost per background task) | Tab-level budgets | Multi-model (different for autocomplete vs. agent) |
| Codex | Container per task (fixed compute cost) | Time-bounded | Single model per task |

**Key observation:** No existing harness has an explicit cost optimization layer. All treat cost as an afterthought or implicit constraint (context window cap, time limit). This is the gap.

## Key Contrarian Positions

1. **"Cost optimization is premature; quality matters more."** For high-stakes production code, the cost of a bug ($10K-$1M) dwarfs the cost of thorough verification ($50-$500). True for security-critical paths. But most code is not security-critical, and the 80% of routine code should be optimized for cost, not quality ceiling.

2. **"Token prices are falling so fast that cost optimization is a waste of engineering effort."** Prices dropped ~90% in 2024-2025 and continue falling. Counter: demand grows faster than prices fall (Jevons paradox); teams scale up usage to fill any cost savings. The ratio of quality-optimal to cost-optimal remains constant even as absolute prices change.

3. **"Developer time is the real cost; token cost is noise."** For interactive use, yes. For autonomous agents running in CI/CD pipelines at scale (hundreds of PRs per day), token cost dominates. The economic model must handle both regimes.

4. **"Model routing adds complexity that isn't worth it."** Using a single frontier model for everything is simpler. Counter: 60x price difference between tiers, with < 2x capability difference for many task types. For a 10-stage pipeline, routing 7 stages to Haiku and 3 to Opus saves ~80% of cost with < 5% quality loss on the routed stages.

## What Another Agent Writing This Pillar Needs to Know

- Start from the Quality pillar's ROI framework: ROI(l,j) = d_{l,j} * D_j / c_l. This is the unit economics of verification.
- The Information pillar's context budget theorem gives the quality-optimal context size. The Economics pillar asks: what if the quality-optimal size costs more than the budget allows?
- The Temporal pillar's VIH metric ignores cost. CVIH (cost-adjusted VIH) is the true efficiency metric.
- Caching is the highest-leverage cost lever: 81% reduction from KV-cache alone. Model the cache hit rate as a function of prompt structure (static prefix fraction).
- Developer idle time during agent execution is a hidden cost that changes the optimization: if the developer is blocked waiting, paying 3x for a faster model may be NPV-positive.
- The multiplicative structure of quality ($R = \prod p_i$) combined with the additive structure of cost ($C = \sum c_i$) creates a specific optimization shape: spend the marginal dollar where quality is lowest.

## Sources

- Anthropic (2026): Agentic coding best practices (KV-cache statistics)
- Liang et al. (2026): Prompt caching survey (arXiv:2601.06007)
- Zhang et al. (2025): Agentic Plan Caching (arXiv:2506.14852)
- JetBrains (2025): SWE-bench agent complexity analysis
- Markowitz (1952): Portfolio selection (mean-variance optimization)
- Howard (1966): Information value theory
- Kleinrock (1975): Queueing Systems, Vol. 1 (cost of delay)
