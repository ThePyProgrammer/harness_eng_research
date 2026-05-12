# Pillar 4: Temporal Architecture

## What This Pillar Is

The study of iteration speed, cycle time optimization, speculative pipelining, caching strategies, and the speed-quality Pareto frontier. This pillar determines how fast the harness can iterate while maintaining verified output quality.

## Why It Must Exist

GSD takes 45-60 minutes per full cycle. This is the #1 user complaint (24 open issues). But speed is not just a UX concern; it is a quality lever. Faster iterations mean more attempts per unit time, and empirically, more attempts compensate for lower per-attempt accuracy up to a threshold. A model scoring 2% higher but taking 3x longer can be worse for agentic loops (Iskohm AI Agents Comparison 2026).

The correct metric is **verified iterations per hour (VIH)**, not raw speed. Skipping verification to go faster compounds errors geometrically and destroys VIH.

## The Formal Problems

### Pipeline Scheduling with Speculative Execution

Find a schedule $\sigma$ for stages $\{S_1, \ldots, S_m\}$ with dependencies, durations $t_i$, and failure probabilities $q_i$, minimizing expected completion time while accounting for speculative rollback costs:

$$\min_{\sigma} \; \mathbb{E}[\max_i (\sigma(S_i) + t_i)]$$

Speculative overlap saves time when $t_{\text{saved}} \cdot p_{\text{success}} > t_{\text{wasted}} \cdot p_{\text{failure}}$. At 55% next-action prediction accuracy (Speculative Actions, arXiv:2510.04371), speculation has positive expected value when saved time exceeds wasted time by ratio ~0.82.

### Caching Strategy

Choose between full re-read (cost $R$, zero staleness) and incremental update (cost $r \ll R$, staleness probability $s$):

$$\min_{\pi} \; \mathbb{E}[c_{\text{context}}(\pi) + c_{\text{error}}(\pi)]$$

Optimal strategy depends on codebase change rate between tasks, estimable from git history.

## The Right Mathematical Framework

**Queueing theory + stochastic scheduling.** Key quantities:
- $\tau(m)$: expected cycle time for mode $m$
- $\text{VIH}(m)$: verified iterations per hour (the correct speed metric)
- $W(s)$: wasted work from speculative execution with success probability $s$

## What Existing Research Shows

- **Cycle time breakdown (GSD):** Context loading 8-12 min, research 5-10 min, planning 5-8 min, execution 10-15 min, verification 8-12 min, human review 5-15 min.
- **Bottlenecks:** Context loading, execution round-trip latency, and verification are the three dominant costs. Planning is cheap.
- **Agentic Plan Caching (arXiv:2506.14852):** Reusing plan templates across similar tasks reduces costs 50% and latency 27%.
- **Prompt Caching (arXiv:2601.06007):** 45-80% cost reduction, 13-31% time-to-first-token reduction. But only for stable content; naive full-context caching can increase latency.
- **Speculative Actions (arXiv:2510.04371):** 55% next-action prediction accuracy enables parallel pre-computation of likely next steps.
- **KV-Cache:** Input-to-output ratios exceeding 100:1 in agent workflows; cost is heavily prefix-dominated. Cache hit rates >90% when static prefix is preserved.
- **Fresh Eyes (Suzgun & Kalai):** 17.1% advantage for fresh context over accumulated context.

## How Existing Harnesses Handle This

| Harness | Speed Strategy | Cycle Time | Tradeoff |
|---------|---------------|------------|----------|
| **GSD** | Fresh context per task (correctness > speed) | 45-60 min | Pays steep context-loading tax; parallel research saves some time |
| **RAPID** | Parallel sets (throughput > per-task latency) | Per-set unchanged; wall-clock faster | Each set still has its own cycle; gains are on milestone, not task |
| **Turing** | Autonomous loop (`/loop 5m`) with convergence detection | Variable (auto-stops) | Removes human latency between iterations; speed through automation |
| **Blueprint** | Asynchronous governance (never blocks development) | N/A (overlay) | Governance checks run in background, never gating the critical path |

## The Target Architecture

Four strategies compose to bring verified cycle time to 8-15 minutes for routine changes:

1. **Persistent codebase state** between sessions (warm start): saves 8-12 min of context loading
2. **Speculative pipelining** (start planning wave N+1 while executing wave N): saves 3-5 min when speculation succeeds
3. **Tiered verification** (inline fast checks during execution, deep checks at phase boundaries): saves 5-8 min per iteration
4. **Asynchronous governance** (drift/debt/compliance as background processes): removes governance from the critical path entirely

**Three execution modes** eliminate unnecessary ceremony:
- **Fast** (3-5 min): single-file changes, clear intent, no ADR impact
- **Standard** (8-15 min): multi-file features, bounded scope
- **Governed** (20-30 min): cross-cutting, architectural changes

## Key Contrarian Positions to Engage

1. **"Speed kills quality."** The "protective pause" between writing and shipping may be doing quality work that fast cycles eliminate. Research needed: does cycle time reduction correlate with slop increase? Is there a minimum viable cycle time below which quality degrades?

2. **"Fresh Eyes is worth the cost."** GSD's 17.1% advantage for fresh context may justify the 8-12 min re-read tax. Perhaps incremental approaches sacrifice too much accuracy for insufficient speed gains. Research needed: compare error rates for fresh vs. incremental context on the same task set.

3. **"Speculative execution has hidden costs."** Beyond wasted tokens, speculation creates branching state that is harder to reason about and debug. The complexity cost may exceed the time savings. Research needed: measure debugging time for speculative vs. sequential pipelines.

4. **"Mode selection is hard to automate."** Wrong mode selection wastes time (too much ceremony for Fast-eligible tasks) or misses quality issues (too little for Governed-eligible tasks). The classification boundary is fuzzy. Research needed: what features predict mode requirements?

## What Another Agent Needs to Know

- Optimize for verified iterations per hour, not raw speed
- The three bottlenecks are context loading, execution round-trip, and verification
- Plan caching and prompt caching are the lowest-hanging fruit (27% and 45-80% respectively)
- Speculative execution has positive EV when prediction accuracy > ~45% and rollback is cheap
- Three execution modes (Fast/Standard/Governed) eliminate the "sledgehammer for every nail" problem
- Asynchronous governance (Blueprint pattern) is the correct architecture for quality checks that should not gate the critical path
- Measure and track VIH; it is the single metric that captures the speed-quality tradeoff

## Sources

- Iskohm: AI Agents Comparison 2026
- Sherlock: Reliable Agentic Workflow Execution (arXiv:2511.00330)
- Speculative Actions (arXiv:2510.04371)
- Don't Break the Cache (arXiv:2601.06007)
- Agentic Plan Caching (arXiv:2506.14852)
- KV-Cache Wins (llm-d.ai)
- SWE-bench Leaderboards
- Epoch AI Benchmarks
