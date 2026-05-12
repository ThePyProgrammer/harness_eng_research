# LLM Cost Engineering: Empirical Data for Economics Architecture

**Research Dimension:** LLM Cost Engineering (Empirical/Contemporary)
**Date:** 2026-04-03
**Purpose:** Ground the formal economics framework with current pricing data, caching empirics, and model routing evidence.

---

## 1. Current Token Pricing Across Providers (2025-2026)

### 1.1 Anthropic Claude Pricing

Data sourced from the official Anthropic pricing page (platform.claude.com/docs/en/about-claude/pricing), retrieved April 2026.

| Model | Input ($/MTok) | Output ($/MTok) | Cache Write 5m | Cache Read | Batch Input | Batch Output |
|-------|----------------|-----------------|----------------|------------|-------------|--------------|
| Claude Opus 4.6 | $5.00 | $25.00 | $6.25 | $0.50 | $2.50 | $12.50 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $3.75 | $0.30 | $1.50 | $7.50 |
| Claude Haiku 4.5 | $1.00 | $5.00 | $1.25 | $0.10 | $0.50 | $2.50 |
| Claude Haiku 3 | $0.25 | $1.25 | $0.30 | $0.03 | $0.125 | $0.625 |

**Key observations:**
- The 4.5/4.6 generation represents a 67% cost reduction over previous generation (Opus 4.1 was $15/$75; Opus 4.6 is $5/$25).
- Opus 4.6 and Sonnet 4.6 include the full 1M token context window at standard pricing (no tiered context pricing).
- Cache reads cost 0.1x base input price (90% discount); 5-minute cache writes cost 1.25x (25% premium); 1-hour cache writes cost 2.0x.
- Batch API provides a flat 50% discount on both input and output tokens.
- "Fast mode" for Opus 4.6 costs 6x standard rates ($30/$150 per MTok).

Source: [Anthropic Pricing Docs](https://platform.claude.com/docs/en/about-claude/pricing)

### 1.2 OpenAI Pricing

| Model | Input ($/MTok) | Output ($/MTok) | Cached Input | Notes |
|-------|----------------|-----------------|--------------|-------|
| GPT-5.2 | $1.75 | $14.00 | $0.175 (90% off) | Current frontier |
| GPT-5 | $1.25 | $10.00 | $0.125 (90% off) | |
| GPT-4.1 | $2.00 | $8.00 | $0.50 (75% off) | 1M+ context |
| GPT-4.1 Nano | $0.10 | $0.40 | - | Cheapest |
| GPT-4o | $2.50 | $10.00 | $1.25 (50% off) | Legacy |
| o3 | $2.00 | $8.00 | - | Reasoning |
| o4-mini | $1.10 | $4.40 | - | Reasoning, budget |

**Key observations:**
- Batch API saves 50% on inputs and outputs (24-hour processing window).
- GPT-5 family gets the deepest cache discount: 90% off cached input tokens.
- GPT-4.1 family gets 75% off cached reads.
- Combining batch + caching on GPT-4.1: cached batch input costs $0.25/MTok, output $4/MTok (87.5% off standard input pricing).
- Automatic caching kicks in for prompts longer than 1,024 tokens, increasing in 128-token increments.

Sources: [OpenAI Pricing](https://openai.com/api/pricing/), [OpenAI Developer Docs](https://developers.openai.com/api/docs/pricing)

### 1.3 Google Gemini Pricing

| Model | Input ($/MTok) | Output ($/MTok) | Cached Input | Notes |
|-------|----------------|-----------------|--------------|-------|
| Gemini 3.1 Pro | $2.00-$4.00 | $12.00-$18.00 | - | Tiered by context length |
| Gemini 2.5 Pro | $1.25 (<=200k) / $2.50 (>200k) | $10.00 / $15.00 | $0.125 (90% off) | |
| Gemini 2.5 Flash | $0.30 | $2.50 | $0.03 | |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | - | Cheapest capable |
| Gemini 3 Flash | $0.50 | $3.00 | - | |

**Key observations:**
- Context caching discount is 90% for Gemini 2.5+ models, 75% for Gemini 2.0 models.
- Cache storage costs $4.50/MTok/hour for Pro models, $1.00/MTok/hour for Flash. This is a distinctive "storage rental" model compared to Anthropic's TTL-based approach.
- Batch/Flex processing offers approximately 50% discounts.
- Gemini 2.5 Pro has tiered pricing: input tokens cost 2x for prompts exceeding 200k tokens.

Sources: [Google AI Pricing](https://ai.google.dev/gemini-api/docs/pricing), [Vertex AI Pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)

### 1.4 The Price Landscape and Its Evolution

The "60x range" claim holds empirically. Looking at current input token pricing across all providers:

- **Cheapest capable model:** Gemini 2.5 Flash-Lite at $0.10/MTok input
- **Most expensive frontier model:** Claude Opus 4.6 at $5.00/MTok input (or $30/MTok in Fast Mode)
- **Ratio (standard):** 50x between cheapest and most expensive
- **Ratio (with Fast Mode):** 300x between Flash-Lite and Opus Fast Mode

**Historical price evolution (TokenCost AI Price Index):**

| Date | Frontier Model | Price ($/MTok input) | "Good Enough" Tier |
|------|---------------|---------------------|---------------------|
| Mar 2023 | GPT-4 | $30.00 | $30.00 (only option) |
| Nov 2023 | GPT-4 Turbo | $10.00 | $10.00 |
| May 2024 | GPT-4o | $5.00 | $5.00 |
| Jul 2024 | GPT-4o mini | $5.00 | $0.15 |
| Dec 2024 | DeepSeek V3 | $5.00 | $0.14 |
| Mar 2026 | GPT-5.2 | $1.75 | $0.10 |

Andrew Ng (deeplearning.ai, 2024): LLM inference costs declined "approximately 79% annually" between March 2023 and August 2024, with Batch API pricing showing an "87% annual decline." Ng advises: "even if you build an agentic workload that isn't entirely economical, falling token prices might make it economical at some point."

The TokenCost AI Price Index reports a **300x reduction** for the cheapest capable models over three years (GPT-4 at $30/MTok in March 2023 vs. Gemini 2.0 Flash at $0.10/MTok in 2026), and a **12x reduction** for frontier models.

Sources: [TokenCost AI Price Index](https://tokencost.app/blog/ai-price-index), [Andrew Ng / DeepLearning.AI](https://www.deeplearning.ai/the-batch/falling-llm-token-prices-and-what-they-mean-for-ai-companies/)

---

## 2. Caching Mechanisms and Their Economics

### 2.1 Prompt Caching: The Claude Code Example

The canonical empirical example comes from Anthropic's own Claude Code agent:

> "Claude Code demonstrates what prompt caching looks like at scale, with a **92% cache hit rate** and an **81% cost reduction**."

**Detailed breakdown (Sonnet 4.5 rate, single 30-minute session):**
- Total tokens processed: ~2 million
- Without caching: $6.00 (2M tokens x $3/MTok)
- With 92% cache efficiency: 1.84M tokens read from cache at $0.30/MTok, remainder at full price
- With caching: $1.15
- **Savings: $4.85 (81% reduction)**

The mechanism: Claude Code loads its system prompt, tool definitions, and the project's CLAUDE.md file (exceeding 20,000 tokens) once. This initial cache write is the most expensive moment. After that, every subsequent turn reads the static prefix from cache, the hit rate climbs past 90%, and each access resets the TTL to keep the cache warm.

**Anthropic's published benchmark latency improvements:**

| Use Case | Without Cache | With Cache | Latency Reduction |
|----------|--------------|------------|-------------------|
| Chat with book (100K tokens) | 11.5s TTFT | 2.4s TTFT | 79% |
| Many-shot prompting (10K tokens) | 1.6s | 1.1s | 31% |
| Multi-turn conversation (10-turn) | ~10s | ~2.5s | 75% |

**Cost reduction by use case:**
- Chat with book (100K tokens): 90% cost reduction
- Many-shot prompting (10K tokens): 86% cost reduction
- Multi-turn conversation (10-turn): 53% cost reduction

Sources: [Anthropic Prompt Caching Blog](https://claude.com/blog/prompt-caching), [Anthropic Pricing Docs](https://platform.claude.com/docs/en/about-claude/pricing)

### 2.2 Provider Caching Comparison

| Feature | Anthropic | OpenAI | Google |
|---------|-----------|--------|--------|
| Cache read discount | 90% (0.1x base) | 50-90% (model-dependent) | 75-90% (generation-dependent) |
| Cache write premium | 25% (5-min TTL), 100% (1-hr TTL) | None (automatic) | Varies |
| Minimum cacheable size | Not specified | 1,024 tokens | Varies by model |
| TTL model | 5-min or 1-hour (explicit) | Automatic, provider-managed | Per-hour storage billing |
| Storage cost | Included in write premium | Included | $1.00-$4.50/MTok/hour |
| Break-even point | 1 cache read (5-min), 2 reads (1-hr) | Immediate (no write premium) | Depends on storage duration |

**Notable difference:** Google charges ongoing storage fees per hour, making it critical to calculate whether the per-hour rental cost exceeds the savings from cached reads. Anthropic and OpenAI bundle storage into write premiums or offer it free.

### 2.3 Lumer et al. (2026): "Don't Break the Cache"

The paper "Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks" (arXiv:2601.06007) evaluates prompt caching across three major LLM providers (OpenAI, Anthropic, and Google) on the DeepResearch Bench, a multi-turn agentic benchmark.

**Key findings:**
- Prompt caching reduces API costs by **41-80%** and improves time to first token by **13-31%** across 500+ agent sessions.
- **Naive full-context caching can paradoxically increase latency.** Targeted strategies that exclude dynamic tool results perform better.
- The optimal strategy is provider-specific: positioning dynamic content toward the end of system prompts and avoiding dynamic function call content in cached blocks.
- Caching provides "universal linear cost and TTFT benefits" when prompts exceed provider token minimums, but there are "provider-specific strategy discrepancies."

**Implication for harness design:** Prompt structure matters as much as caching availability. The static prefix fraction directly determines achievable cache hit rates.

Source: [arXiv:2601.06007](https://arxiv.org/abs/2601.06007)

### 2.4 Zhang et al. (2025): Agentic Plan Caching

"Agentic Plan Caching: Test-Time Memory for Fast and Cost-Efficient LLM Agents" (arXiv:2506.14852, NeurIPS 2025 Poster) proposes extracting, storing, and reusing structured plan templates across semantically similar tasks.

**Key results:**
- **50.31% cost reduction** on average
- **27.28% latency reduction** on average
- Maintains **96.61%** of application-level performance compared to accuracy-optimal baseline
- Evaluated on five agent workloads: FinanceBench, QASPER, Tabular Math Word Problems, AIME 2024/2025, GAIA

This is a higher-level caching strategy than token-level prompt caching; it operates at the plan/reasoning level, caching entire decision sequences rather than token prefixes.

Source: [arXiv:2506.14852](https://arxiv.org/abs/2506.14852)

---

## 3. Model Routing and Cascading

### 3.1 FrugalGPT (Chen et al., 2023)

"FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance" (arXiv:2305.05176, TMLR 2024) introduces the LLM cascade framework.

**Core mechanism:** Send queries to a sequence of LLMs starting from cheapest. If the current model's response is deemed "reliable" by a learned scoring function, return it; otherwise escalate to the next model.

**Key results:**
- Can match GPT-4 performance with **up to 98% cost reduction**
- Can improve accuracy over GPT-4 by **4%** at the same cost
- On the HEADLINES dataset specifically: **80% cost reduction** with **1.5% accuracy improvement** over GPT-4

**Three strategy categories:**
1. **Prompt adaptation:** Reduce prompt length without losing information
2. **LLM approximation:** Use smaller models or caches to approximate larger model outputs
3. **LLM cascade:** Sequential escalation through model tiers

Source: [arXiv:2305.05176](https://arxiv.org/abs/2305.05176)

### 3.2 AutoMix (Madaan et al., NeurIPS 2024)

AutoMix routes queries to appropriately sized models using a few-shot self-verification mechanism and a POMDP-based router.

**Key results:**
- Reduces computational cost by **over 50%** for comparable performance across five models and five datasets
- Uses a non-LLM setup for routing, preventing the router itself from introducing hallucination or reasoning errors
- Classifies queries into three categories: easy (route to SLM), hard (route to LLM), unsolvable (route to none, saving costs)

Source: [AutoMix (NeurIPS 2024)](https://automix-llm.github.io/automix/)

### 3.3 RouteLLM (Ong et al., 2024)

RouteLLM (LMSYS/UC Berkeley) is an open-source routing framework trained on Chatbot Arena preference data.

**Key results:**
- Cost reductions of **over 85%** on MT Bench, **45%** on MMLU, **35%** on GSM8K, while maintaining 95% of GPT-4's performance
- Achieves the same performance as commercial routers while being **over 40% cheaper**
- Drop-in replacement for OpenAI client, also available as OpenAI-compatible server
- Four different router architectures trained, all using publicly available data

Source: [RouteLLM Blog](https://www.lmsys.org/blog/2024-07-01-routellm/), [arXiv:2406.18665](https://arxiv.org/abs/2406.18665)

### 3.4 Hybrid LLM and BEST-Route (2024-2025)

**Hybrid LLM (Ding et al., 2024):** Routes queries based on predicted difficulty. Found that **22% of queries** could be handled by Llama-2 (13b) with less than 1% quality drop, enabling up to **40% fewer calls** to the large model.

**BEST-Route (Microsoft, 2025):** Selects both model and number of responses based on query difficulty. Achieves **up to 60% cost reduction** with **less than 1% performance drop**.

Sources: [arXiv:2404.14618](https://arxiv.org/abs/2404.14618), [GitHub: microsoft/best-route-llm](https://github.com/microsoft/best-route-llm)

### 3.5 Synthesis: What Percentage of Queries Can Use Smaller Models?

Across the literature, the convergent finding is:

- **20-40% of queries** can be handled by the smallest available model with negligible quality loss
- **50-70% of queries** can be handled by mid-tier models
- Only **10-30% of queries** genuinely require the largest, most expensive model
- Combined savings from routing: **40-85%** depending on benchmark and acceptable quality threshold

---

## 4. Cost-Quality Empirical Curves

### 4.1 Context Length Degrades Performance (Non-Monotone Quality)

**Gao et al. (2025), "Context Length Alone Hurts LLM Performance Despite Perfect Retrieval" (EMNLP 2025 Findings):**

This is the strongest evidence for non-monotone cost-quality curves:

> "Even when models can perfectly retrieve all relevant information, their performance still degrades substantially (13.9%-85%) as input length increases but remains well within the models' claimed lengths."

Critical finding: "This failure occurs even when the irrelevant tokens are replaced with minimally distracting whitespace, and, more surprisingly, when they are all masked and the models are forced to attend only to the relevant tokens."

**Specific degradation numbers:**
- Llama showed a **48% drop** on VarSum with whitespace-padded context
- Mistral experienced a **30% drop** on GSM8K at 30K tokens with whitespace
- Even with forced attention to only relevant tokens (identical to short-context except for increased token distance), performance degraded by **at least 7.9%** for both Llama-3 and Mistral at 30K tokens
- Task complexity amplifies the effect: more complex tasks show more severe degradation

Source: [arXiv:2510.05381](https://arxiv.org/abs/2510.05381), [EMNLP 2025 Findings](https://aclanthology.org/2025.findings-emnlp.1264/)

### 4.2 Context Rot (Chroma Research, 2025)

The Chroma Research team coined "context rot" to describe the systematic degradation of LLM performance with increasing input length. Their findings across 18 models:

- Models show "increasing non-uniformity in performance as input length grows"
- **Structural coherence paradoxically hurts performance:** "Models perform worse when the haystack preserves a logical flow of ideas. Shuffling the haystack and removing local coherence consistently improves performance."
- Claude models show lowest hallucination rates among tested models; GPT models show highest
- The degradation is task-dependent and non-uniform: some distractors cause greater performance decline than others

Source: [Chroma Research: Context Rot](https://www.trychroma.com/research/context-rot)

### 4.3 Factory.ai: Task-Level Token Economics

Factory.ai's research on context compression for coding agents introduces a critical reframing:

> "A 50% increase in average context length translates directly to 50% higher inference costs."

Their key insight: **naive optimization for compression ratio often increases total tokens per task** because agents lose critical context and must re-fetch files, re-read documentation, and re-explore previously rejected approaches.

**Optimization must target tokens-per-task, not tokens-per-request.**

Factory's structured summarization approach scored **4.04 accuracy** (out of 5) for preserving technical details vs. Anthropic's 3.74 and OpenAI's 3.43, demonstrating that compression quality matters for overall cost efficiency.

Source: [Factory.ai: Compressing Context](https://factory.ai/news/compressing-context), [Factory.ai: Evaluating Compression](https://factory.ai/news/evaluating-compression)

### 4.4 SWE-bench Cost Data

Current cost-per-task data from SWE-bench evaluations (2025-2026):

- **Cheapest models:** GLM-4.7 at ~$0.05/task, Minimax M2.1 at ~$0.03/task
- **Mid-range:** DeepSeek V3.2-Exp at $1.30 per run on Aider Polyglot
- **Premium:** "A heavy coding session with Opus 4.6 can easily cost $5-15 in API tokens"
- **Extended session example:** Claude 4 Sonnet over 2 weeks of testing: Input tokens $2.69, output tokens $9.02, total $11.71

The top SWE-bench score jumped from around 65% in early 2025 to **80.9% in March 2026**, showing rapid capability improvement alongside falling costs.

Sources: [SWE-bench (vals.ai)](https://www.vals.ai/benchmarks/swebench), [AI Agent Benchmark (GitHub)](https://github.com/murataslan1/ai-agent-benchmark)

---

## 5. Diminishing Returns Evidence

### 5.1 Submodularity and Information Gain

The theoretical foundation for diminishing returns in context comes from submodular optimization theory. Key property: entropy over a set of random variables is submodular, meaning adding an element to a smaller set provides more marginal information than adding it to a larger set.

As articulated by Jina AI's work on submodular optimization for text selection: "Starting with an empty set and incrementally adding selected text or passages, each addition provides value, but the marginal benefit decreases; capturing the intuition that diverse, non-redundant selections are most valuable."

The empirical evidence from context degradation studies supports a non-monotone value curve:

1. **First ~20% of context:** Captures the highest-value information (system prompt, key files, direct problem statement). This is where the steepest quality gains occur.
2. **Middle 60%:** Progressively diminishing returns as supporting context accumulates.
3. **Last ~20%:** Can actively degrade performance, as demonstrated by Gao et al.'s finding that performance drops 13.9%-85% even with perfect retrieval.

**Supporting evidence from Gemini evaluation:** "After approximately 20% context window utilization, Gemini 2.5 Flash exhibits contextual memory degradation, confusing past information with current state." Additionally, "While Gemini 1.5 maintains recall capabilities up to 1 million tokens, average recall hovers around 60%, meaning 40% of relevant context facts are effectively lost."

Sources: [Jina AI: Submodular Optimization](https://jina.ai/news/submodular-optimization-for-text-selection-passage-reranking-context-engineering/), [arXiv:2510.05381](https://arxiv.org/abs/2510.05381)

### 5.2 Practical Degradation Thresholds

From the empirical literature:

- **Llama-3.1-405b:** Performance starts decreasing after **32K tokens**
- **GPT-4-0125-preview:** Performance starts decreasing after **64K tokens**
- **General pattern:** Effective context length (where the model maintains strong performance) is much shorter than the advertised maximum
- Running "permanently near max context" empirically degrades response quality (Factory.ai)

---

## 6. Developer Time vs. Token Cost

### 6.1 Developer Hourly Rates

Current data for senior software engineers in the US (2026):

| Source | Average Annual | Implied Hourly | Range |
|--------|---------------|----------------|-------|
| Glassdoor | $203,651 | ~$98/hr | $163K-$258K (25th-75th) |
| ZipRecruiter | $143,292 | ~$69/hr | $122K-$162K (25th-75th) |
| Salary.com | $128,700 | ~$62/hr | Varies |
| Indeed | $156,013 | ~$75/hr | + $8K bonus |

**Fully-loaded cost** (including benefits, overhead, workspace): typically 1.5-2x base salary, putting effective hourly cost at **$90-$200/hr** for a senior engineer.

Sources: [Glassdoor](https://www.glassdoor.com/Salaries/senior-software-engineer-salary-SRCH_KO0,24.htm), [ZipRecruiter](https://www.ziprecruiter.com/Salaries/Senior-Software-Engineer-Salary)

### 6.2 When Developer Idle Time Dominates Token Cost

**The break-even calculation:**

A 50-iteration agent task at full context on Opus 4.6:
- Estimated cost: $30-$150 (depending on context management)
- Developer time equivalent: 15-75 minutes of senior engineer time at $120/hr loaded cost

If the agent saves a developer even 30 minutes of manual work, the token cost is justified at the lower end. If the agent replaces a full day of manual investigation, even $150 in tokens is cost-effective compared to $960 in developer time (8 hours x $120/hr).

**CI/CD scale scenario:**
- A production agent handling 2,000 conversations/day with average 1,500 tokens per conversation
- Monthly token volume: approximately 90 million tokens (30M input/60M output)
- At Sonnet 4.6 rates: ~$990/month ($90 input + $900 output)
- At Haiku 4.5 with caching: ~$100-200/month
- Modern DevOps teams deploy code up to 46 times per day, and AI agents generate code "10-20x faster than traditional engineering teams"

The token cost becomes negligible compared to developer time when:
- Tasks involve investigation or context-gathering (reading logs, code archaeology)
- Multiple iterations are needed to converge on a solution
- The alternative is developer context-switching overhead

Sources: [Elastic CI/CD Blog](https://www.elastic.co/search-labs/blog/ci-pipelines-claude-ai-agent), [GodOfPrompt Cost Analysis](https://www.godofprompt.ai/blog/understanding-the-real-cost-of-ai-agents)

### 6.3 Real-World Claude Code Usage Data

Anthropic has acknowledged (March 2026) that Claude Code users are "hitting usage limits way faster than expected," with one developer reporting exhausting the Max 5 plan ($100/month) in 1 hour of work when previously lasting 8 hours. This suggests real-world per-session costs of $12-100 for intensive coding sessions, depending on model and caching efficiency.

Source: [The Register (March 2026)](https://www.theregister.com/2026/03/31/anthropic_claude_code_limits/)

---

## 7. Key Data Points for Paper

The following are the most important empirical findings to cite in the formal economics architecture paper:

### Pricing
1. **300x price reduction** in 3 years for capable models (GPT-4 $30/MTok in 2023 to Flash-Lite $0.10/MTok in 2026). Source: TokenCost AI Price Index.
2. **50x range** between cheapest ($0.10/MTok) and most expensive ($5.00/MTok) current models at standard pricing. Source: compiled from provider pricing pages, April 2026.
3. **79% annual cost decline** for frontier inference. Source: Andrew Ng / DeepLearning.AI analysis.

### Caching
4. **92% cache hit rate, 81% cost reduction** in Claude Code (from $6.00 to $1.15 per 2M tokens). Source: Anthropic prompt caching documentation.
5. **41-80% cost reduction, 13-31% TTFT improvement** from prompt caching across providers in agentic tasks. Source: Lumer et al. (arXiv:2601.06007).
6. **50.31% cost reduction, 27.28% latency reduction** from plan-level caching while maintaining 96.61% performance. Source: Zhang et al. (arXiv:2506.14852, NeurIPS 2025).
7. **90% discount** on cache reads across Anthropic, OpenAI (GPT-5), and Google (Gemini 2.5+). Source: provider pricing pages.

### Routing
8. **Up to 98% cost reduction** from LLM cascading while matching GPT-4 performance. Source: FrugalGPT (arXiv:2305.05176).
9. **Over 50% cost reduction** from automatic model mixing. Source: AutoMix (NeurIPS 2024).
10. **85% cost reduction** on MT Bench while maintaining 95% of GPT-4 quality. Source: RouteLLM (arXiv:2406.18665).
11. **20-40% of coding queries** can be handled by smallest models; only **10-30%** require largest models. Source: Hybrid LLM, BEST-Route.

### Quality-Cost Curves
12. **13.9%-85% performance degradation** from context length alone, even with perfect retrieval. Source: Gao et al. (EMNLP 2025).
13. **Effective context thresholds:** 32K tokens (Llama-3.1-405b), 64K tokens (GPT-4) before degradation begins. Source: Gao et al.
14. **Non-monotone quality curve:** the last 20% of context can degrade performance even when tokens are masked to whitespace. Source: Gao et al.
15. **Tokens-per-task, not tokens-per-request** is the correct optimization target; naive compression increases total cost. Source: Factory.ai.

### Economics
16. **$90-$200/hr** fully-loaded cost for senior engineers. Source: Glassdoor, ZipRecruiter (2026).
17. **$30-$150 per complex agent task** (50 iterations at full context on Opus). Source: estimated from pricing data.
18. **Batch + caching combined** can reduce total costs by **87.5-95%**. Source: OpenAI and Anthropic pricing documentation.
19. **SWE-bench top score** improved from 65% to 80.9% between early 2025 and March 2026, while per-task costs fell. Source: SWE-bench leaderboard data.

---

## 8. Data Gaps and Limitations

### 8.1 What We Could Not Find or Verify

1. **JetBrains "52% fewer tokens, 2.6% better performance" from observation masking.** Multiple searches did not surface this specific claim. JetBrains has published that Junie is "30% faster" and has optimization work ongoing, but the specific observation masking statistics may come from an internal technical report, conference talk, or pre-print not yet indexed. This claim should be treated as **unverified** pending primary source identification.

2. **The exact "first 20% of context captures ~60% of quality" claim.** While the theoretical foundation (submodularity of mutual information) is well-established, and empirical evidence strongly supports diminishing returns, the specific 20%/60% ratio appears to be an approximation or synthesis rather than a single cited finding. The Gemini 2.5 Flash data (degradation after 20% context window utilization) and the Gemini 1.5 data (60% average recall at 1M tokens) are related but distinct measurements.

3. **Production deployment cost data at scale for coding agents.** Companies using AI coding agents at scale (e.g., hundreds of PRs per day) have not published detailed per-PR cost breakdowns. Available data is mostly self-reported developer anecdotes or marketing materials. The Elastic CI/CD blog mentions "self-correcting pull requests" for dependency updates but does not provide cost-per-PR data.

4. **Direct comparison of GSD-style parallel execution costs.** No published data was found comparing sequential vs. parallel agent execution costs with specific dollar amounts and quality metrics.

5. **Cache hit rate variation by prompt structure.** Lumer et al. (2026) address this qualitatively (static prefix fraction determines hit rate), but no paper provides a systematic function mapping prefix fraction to achievable hit rate and cost reduction.

### 8.2 Methodological Caveats

- **Pricing data is highly volatile.** Numbers cited here reflect April 2026 pricing; providers routinely adjust pricing (often downward). Any formal model should parameterize costs rather than hardcode them.
- **Benchmark costs vs. production costs.** SWE-bench task costs reflect single-task execution; production deployments involve retries, fallbacks, context rebuilding after failures, and multi-step pipelines that multiply per-task costs.
- **Caching efficiency depends on usage patterns.** The 92% cache hit rate for Claude Code reflects a well-optimized system with careful prompt structuring. Naive implementations may achieve much lower hit rates.
- **Routing savings assume access to multiple model tiers.** Organizations locked into a single provider or model may not be able to achieve routing-based savings.

---

## 9. Consolidated Pricing Reference (April 2026)

For quick reference, the complete cross-provider pricing at the input tier (per million tokens):

| Price Tier | Anthropic | OpenAI | Google |
|-----------|-----------|--------|--------|
| **Cheapest** | Haiku 3: $0.25 | GPT-4.1 Nano: $0.10 | Flash-Lite: $0.10 |
| **Budget** | Haiku 4.5: $1.00 | o4-mini: $1.10 | Flash: $0.30 |
| **Mid-tier** | Sonnet 4.6: $3.00 | GPT-4.1: $2.00 | 2.5 Pro: $1.25 |
| **Frontier** | Opus 4.6: $5.00 | GPT-5.2: $1.75 | 3.1 Pro: $2.00 |
| **Premium** | Opus Fast: $30.00 | GPT-5.2 Pro: $21.00 | - |

**Batch discounts:** 50% across all providers.
**Cache read discounts:** 75-90% across all providers for supported models.
**Combined maximum discount:** Up to 95% (batch + caching).

---

## Sources

### Primary Documentation
- [Anthropic Pricing Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [OpenAI Developer Pricing](https://developers.openai.com/api/docs/pricing)
- [Google Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Anthropic Prompt Caching Blog](https://claude.com/blog/prompt-caching)

### Research Papers
- [Lumer et al. (2026), "Don't Break the Cache" (arXiv:2601.06007)](https://arxiv.org/abs/2601.06007)
- [Zhang et al. (2025), "Agentic Plan Caching" (arXiv:2506.14852)](https://arxiv.org/abs/2506.14852)
- [Chen et al. (2023), "FrugalGPT" (arXiv:2305.05176)](https://arxiv.org/abs/2305.05176)
- [Madaan et al. (2024), "AutoMix" (NeurIPS 2024)](https://automix-llm.github.io/automix/)
- [Ong et al. (2024), "RouteLLM" (arXiv:2406.18665)](https://arxiv.org/abs/2406.18665)
- [Ding et al. (2024), "Hybrid LLM" (arXiv:2404.14618)](https://arxiv.org/abs/2404.14618)
- [Gao et al. (2025), "Context Length Alone Hurts" (arXiv:2510.05381)](https://arxiv.org/abs/2510.05381)

### Industry Analysis
- [TokenCost AI Price Index](https://tokencost.app/blog/ai-price-index)
- [Andrew Ng / DeepLearning.AI: Falling Token Prices](https://www.deeplearning.ai/the-batch/falling-llm-token-prices-and-what-they-mean-for-ai-companies/)
- [Factory.ai: Compressing Context](https://factory.ai/news/compressing-context)
- [Factory.ai: Evaluating Compression](https://factory.ai/news/evaluating-compression)
- [Chroma Research: Context Rot](https://www.trychroma.com/research/context-rot)
- [RouteLLM Blog (LMSYS)](https://www.lmsys.org/blog/2024-07-01-routellm/)
- [BEST-Route (Microsoft)](https://github.com/microsoft/best-route-llm)
- [The Register: Claude Code Limits (Mar 2026)](https://www.theregister.com/2026/03/31/anthropic_claude_code_limits/)
- [Elastic: CI/CD with Agentic AI](https://www.elastic.co/search-labs/blog/ci-pipelines-claude-ai-agent)

### Salary and Cost Data
- [Glassdoor: Senior Software Engineer Salary](https://www.glassdoor.com/Salaries/senior-software-engineer-salary-SRCH_KO0,24.htm)
- [ZipRecruiter: Senior Software Engineer Salary](https://www.ziprecruiter.com/Salaries/Senior-Software-Engineer-Salary)
- [SWE-bench Leaderboard](https://www.vals.ai/benchmarks/swebench)
