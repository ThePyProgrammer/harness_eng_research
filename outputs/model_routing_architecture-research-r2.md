# Model Routing Architecture for AI Coding Agent Harnesses: Research Brief (R2)

**Date:** 2026-04-03
**Scope:** Empirical data on LLM model routing for cost-quality-latency optimization in coding harnesses

---

## 1. LLM Benchmark Data Across Model Tiers (2024--2026)

### 1.1 SWE-bench Verified Results

SWE-bench Verified is the primary benchmark for evaluating real-world software engineering capability. As of early 2026, six models score within 0.8 points of each other, indicating rapid convergence among frontier models.

**Top SWE-bench Verified Scores (Feb/Mar 2026):**

| Model | SWE-bench Verified | Tier |
|-------|-------------------|------|
| Claude Opus 4.5 | 80.9% | Opus-class |
| Claude Opus 4.6 (Thinking) | 78.2--80.8% | Opus-class |
| Gemini 3.1 Pro | 78.8--80.6% | Pro/Opus-class |
| MiniMax M2.5 | 80.2% | Frontier |
| GPT-5.4 | ~78.2--80% | Frontier |
| Claude Sonnet 4.6 | 79.6% | Sonnet-class |
| GPT-5.3 Codex | 78.0% | Frontier |
| Kimi K2.5 | 76.8% | Frontier |
| DeepSeek V3.2 | 72--74% | Budget frontier |

Source: [SWE-bench Verified Leaderboard](https://llm-stats.com/benchmarks/swe-bench-verified), [SWE-bench](https://www.swebench.com/)

**Cost-adjusted performance (SWE-bench bash-only scaffold):**

| Model | Resolution Rate | Total Cost | Avg Cost/Instance |
|-------|----------------|-----------|-------------------|
| Claude 4.5 Opus (high reasoning) | 76.8% | $376.95 | $0.75 |
| Gemini 3 Flash (high reasoning) | 75.8% | $177.98 | $0.36 |
| MiniMax M2.5 (high reasoning) | ~75% | $36.64 | $0.073 |

Source: [SWE-bench Results Viewer](https://www.swebench.com/viewer.html)

**Key insight:** MiniMax M2.5 achieves comparable resolution rates at 10x lower cost per instance than Claude Opus, illustrating the extreme variability of cost-effectiveness across models.

**Contamination concern:** OpenAI has stopped reporting SWE-bench Verified scores after finding training data contamination across frontier models, recommending SWE-bench Pro instead. On SWE-bench Pro, GPT-5.4 leads at 57.7% vs. Opus 4.5's 45.89%. Source: [SWE-Bench Pro Leaderboard](https://www.morphllm.com/swe-bench-pro)

### 1.2 HumanEval Scores by Model Tier

HumanEval measures functional correctness on 164 programming problems from docstrings.

| Model | HumanEval | Tier | Approximate Price (input/output per MTok) |
|-------|-----------|------|------------------------------------------|
| Claude Sonnet 4.5 | 97.6% | Sonnet-class | $3/$15 |
| Claude 3.5 Sonnet | 92.0% | Sonnet-class | $3/$15 |
| GPT-4o | 90.2% | Mid-tier | $2.50/$10 |
| Claude 3 Haiku | 88.4% | Haiku-class | $0.25/$1.25 |
| GPT-4o mini | 87.2% | Mini/Haiku-class | $0.15/$0.60 |
| Claude 3 Opus | 84.9% | Opus-class (legacy) | $15/$75 |

Source: [HumanEval Leaderboard](https://llm-stats.com/benchmarks/humaneval), [Vellum LLM Leaderboard](https://vellum.ai/llm-leaderboard)

**Critical observation for routing:** On HumanEval (single-function problems), the gap between Haiku-class (88.4%) and Sonnet-class (97.6%) is only ~9 percentage points. On SWE-bench (multi-file real-world bugs), the structural gap between tiers is much larger, confirming the thesis that the capability gap is highly task-dependent.

### 1.3 LiveCodeBench Results

LiveCodeBench uses fresh competitive programming problems from LeetCode, AtCoder, and Codeforces, preventing contamination.

**LiveCodeBench pass@1 (March 2026):**

| Model | Score |
|-------|-------|
| Gemini 3 Pro Preview (high) | 91.7% |
| Gemini 3 Flash Preview (Reasoning) | 90.8% |
| DeepSeek V3.2 Speciale | 89.6% |
| GPT-5.4 Pro | ~88.3% (weighted) |
| Claude Opus 4.6 | ~79.3% (weighted) |
| Gemini 3.1 Pro | ~77.8% (weighted) |

Source: [LiveCodeBench Leaderboard](https://artificialanalysis.ai/evaluations/livecodebench), [BenchLM.ai](https://benchlm.ai/coding)

### 1.4 Aider Leaderboard

Aider's polyglot benchmark tests on 225 challenging Exercism exercises across C++, Go, Java, JavaScript, Python, and Rust, with emphasis on code editing capabilities.

**Aider Polyglot Scores (2025--2026):**

| Model | Score | Cost per Run |
|-------|-------|-------------|
| GPT-5 (high) | 88.0% | $29.08 |
| GPT-5 (medium) | 86.7% | $17.69 |
| o3-pro (high) | 84.9% | $146.32 |
| Gemini 2.5 Pro Preview (32k thinking) | 83.1% | $49.88 |
| GPT-5 (low) | 81.3% | $10.37 |
| DeepSeek R1 (Reasoner) | 74.2% | $1.30 |
| Claude Opus 4 (32k thinking) | 72.0% | $65.75 |
| DeepSeek V3.2 Chat | 70.2% | $0.88 |
| Claude Sonnet 3.7 (32k thinking) | 64.9% | $36.83 |
| GPT-4o mini | 3.6% | -- |

Source: [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/)

**Routing-critical data points:**
- DeepSeek V3.2 at $0.88/run achieves 70.2%, while Claude Opus 4 at $65.75/run achieves 72.0%. The 75x cost difference buys only 1.8 percentage points.
- GPT-4o mini catastrophically fails at 3.6%, confirming that Haiku-class models cannot handle complex multi-file editing tasks.
- The cost-performance Pareto frontier is dominated by DeepSeek R1 ($1.30, 74.2%) and GPT-5 medium ($17.69, 86.7%).

### 1.5 Task-Dependent Capability Gap

The data across benchmarks supports a quantified version of the "task-dependent capability gap" thesis:

| Task Type | Haiku-class vs. Frontier Gap | Evidence |
|-----------|---------------------------|----------|
| Single-function generation (HumanEval) | ~9 pp (88% vs 97%) | Haiku-class achieves ~90% of frontier |
| Multi-file real-world bugs (SWE-bench) | 5--8 pp at frontier, catastrophic for small models | GPT-4o mini: 3.6% on Aider |
| Competitive programming (LiveCodeBench) | ~12 pp between tiers | Reasoning models dominate |
| Merge conflict resolution | General models > code-specialized | ConGra: LLama3-8B outperforms CodeLlama-34B |

**For boilerplate code generation, smaller models achieve ~87--90% of frontier quality.** For complex multi-file reasoning, frontier models are qualitatively better, and small models effectively cannot perform the task at all.

---

## 2. Best-of-N Sampling Results

### 2.1 Pass@K Methodology and the Codex Foundation

The pass@k metric was formalized by Chen et al. (2021) in the original Codex paper. The unbiased estimator is:

```
pass@k = 1 - C(n-c, k) / C(n, k)
```

where n = total samples, c = correct samples, C is the binomial coefficient.

**Original Codex Results (Chen et al., 2021):**

| Model | pass@1 | pass@100 |
|-------|--------|----------|
| Codex-12B | 28.8% | 70.2--72.3% |
| Codex-S (fine-tuned) | 37.7% | 77.5% (with test selection) |

The improvement from pass@1 to pass@100 is 2.4x (28.8% to 70.2%), demonstrating massive headroom from sampling diversity. However, the 100x increase in samples yields only a 2.4x improvement, showing logarithmic-scale diminishing returns.

**Temperature-sampling interaction (Chen et al., 2021):** The optimal temperature increases with k. For pass@1, low temperature (T=0.2) is optimal; for pass@100, high temperature (T=0.8) is optimal. At T=0.6, the authors found a reasonable compromise across all k values.

Source: [Evaluating Large Language Models Trained on Code](https://arxiv.org/pdf/2107.03374)

### 2.2 Pass@K vs. Pass^K Distinction

**Pass@K** (OR semantics): "At least one of K attempts succeeds." Used in benchmarks.

**Pass^K** (AND semantics): "All K sequential steps succeed." Reflects production agent reliability.

**Mathematical definitions:**
- Pass@k = 1 - C(n-c, k) / C(n, k) -- probability of at least one success
- Pass^k = (c/n)^k -- probability of all k attempts succeeding

**Illustrative example (from Schmid, 2025):**
For an agent with 70% single-attempt success rate, k=3:
- Pass@3 = 97% (at least one success in three tries)
- Pass^3 = 34.3% (all three consecutive operations succeed)

This distinction is critical for multi-step agent pipelines: a coding agent that reads a file, edits it, and runs tests has three sequential steps. Even at 90% per-step reliability, Pass^3 = 0.9^3 = 72.9%. At 80% per-step, Pass^5 = 0.8^5 = 32.8%.

Source: [Pass@k vs Pass^k: Understanding Agent Reliability](https://www.philschmid.de/agents-pass-at-k-pass-power-k)

### 2.3 Stiennon et al. (2020) on Best-of-N in RLHF

Stiennon et al. (2020) introduced best-of-N sampling with learned reward models for the summarization domain. The methodology:
1. Generate N candidate completions from a policy model
2. Score each with a trained reward model
3. Select the highest-scoring candidate

The reward model was trained on human preference data (pairwise comparisons). This established the template for all subsequent best-of-N work, showing that a reward model trained on human preferences could reliably select better outputs from a pool of candidates.

Source: [Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325) (NeurIPS 2020)

### 2.4 Cobbe et al. (2021) on Training Verifiers

Cobbe et al. (2021) introduced GSM8K and demonstrated that verification-based selection dramatically outperforms raw sampling:

**Key results:**
- A 6B-parameter model with a trained verifier reached ~55% accuracy on GSM8K
- This roughly doubled the performance of a GPT-3 model fine-tuned directly on the dataset
- A 6B verifier-augmented model matched or exceeded a 175B finetuned baseline, representing an effective 30x increase in model capacity through verification
- Verification scales more effectively with increased data than finetuning alone

**Methodology:** At test time, 100 candidate solutions are generated (test@100); a separately trained verifier transformer estimates correctness probability for each; the highest-scoring solution is selected. Test@100 performance peaked within the first few epochs of verifier training.

Source: [Training Verifiers to Solve Math Word Problems](https://arxiv.org/abs/2110.14168)

### 2.5 Best-of-N Diminishing Returns

Empirical data on how improvement scales with N:

**General pattern:** Using a reward model with Best-of-N shows a 20.7% increase in accuracy from N=1 to N=16, with performance plateauing beyond N=16.

**Reward hacking at large N:** As N grows, reward model errors accumulate. The absolute count of false positives (unacceptable responses rated as good) inflates from 104 at N=1 to 210 at N=32. The mean ground-truth reward improves, but practical reliability degrades.

**Code generation specifically (from HumanEval data):**
- ChatGPT: pass@1=7.3%, pass@3=12.7%, pass@5=13.3% (minimal gain from 3 to 5)
- DeepSeek-Coder: pass@1=9.7%, pass@3=13.3%, pass@5=14.5%
- CodeGemma 7B: substantial gains from pass@1 to pass@10, indicating it benefits greatly from sampling diversity

Source: [Top Pass (2024)](https://arxiv.org/html/2408.05715v1), [Regularized Best-of-N Sampling (2024)](https://arxiv.org/html/2404.01054v1)

### 2.6 Budget Reallocation: Smaller Model x N vs. Larger Model x 1

Hassid et al. (2024), published at ICLR 2025, investigated whether generating multiple samples from a smaller model beats a single sample from a larger model under fixed compute budgets:

**Key findings:**
- 13B model generating 5 outputs outperformed 70B model generating 1 output by up to 15% on HumanEval, MBPP, and APPS
- 7B and 13B models substantially outperformed 34B and 70B variants across all compute budgets on HumanEval and MBPP
- Performance gaps reached 5--15% in the small-budget regime
- 7B/13B achieved 60% accuracy using approximately one-quarter the wall time of larger models

**Computational cost ratios (normalized to 7B=1.0):**

| Model | FLOPs | Wall Time |
|-------|-------|-----------|
| 7B | 1.0x | 1.0x |
| 13B | 1.95x | 1.69x |
| 34B | 5.08x | 7.58x |
| 70B | 10.41x | 14.19x |

**Critical caveat:** When unit tests are unavailable, ranking-based selection from smaller models falls short of single output from larger ones. The budget reallocation advantage depends on having a reliable verifier.

Source: [The Larger the Better? Improved LLM Code-Generation via Budget Reallocation](https://arxiv.org/abs/2404.00725) (ICLR 2025)

---

## 3. Production Model Routing Implementations

### 3.1 Cursor: Task-Specific Model Routing

Cursor serves over 400 million predictions per day and handles over 1 million QPS at peak, making it the largest-scale production example of model routing for coding.

**Architecture:**
- Developer machine (local context collection, AES-256 encryption)
- Cloudflare Edge Network (load balancing)
- AWS API Gateway (auth, rate limiting)
- Context enrichment engine (codebase embeddings via Turbopuffer)
- **Model selection router** (choosing optimal AI model per task)
- AI inference (Fireworks for custom models / OpenAI / Anthropic / Google)

**Model routing by task type:**

| Feature | Model Class | Latency Target | Key Metric |
|---------|------------|----------------|------------|
| Autocomplete (Tab) | Custom fine-tuned models on Fireworks | < 1 second | Acceptance rate |
| Background summarization | OpenAI GPT variants | Best effort | Cost efficiency |
| Chat/reasoning | Claude, GPT-4, Gemini | Seconds | Quality |
| Agent/Composer (multi-file) | Frontier models (Claude Opus, GPT-5) | Minutes | Correctness |

**Tab RL system (September 2025):** Cursor integrated RL directly into the Tab model's policy. The reward structure: +0.75 for accepted suggestions, -0.25 for rejected, 0 for silence. The model should only suggest when estimated acceptance probability exceeds 25%. Result: 21% fewer suggestions, 28% higher accept rate. New models deploy several times per day, with training loops completing in 1.5--2 hours.

**Hidden routing:** Even when a user selects a specific model, some requests (particularly background summarization) may be routed to different providers based on task routing logic.

Source: [How Cursor Serves Billions of AI Code Completions](https://blog.bytebytego.com/p/how-cursor-serves-billions-of-ai), [Improving Cursor Tab with online RL](https://cursor.com/blog/tab-rl)

### 3.2 Claude Code: User-Directed Model Selection with Adaptive Thinking

Claude Code provides model routing through explicit user control with intelligent defaults:

**Available models:** Opus 4.6, Sonnet 4.6, Haiku 4.5. Switch via `/model` command; takes effect immediately.

**Adaptive thinking:** Instead of routing between models, Claude Code routes between thinking depths within a single model session:
- Effort levels: low, medium, high (persist across sessions), max (Opus 4.6 only, does not persist)
- At high effort, Claude almost always thinks; at lower effort, it may skip thinking for simple problems
- `thinking: {type: "adaptive"}` is the recommended mode for Opus 4.6 and Sonnet 4.6

**OpusPlan strategy:** Automatically switches to Opus 4.6 for architecture/planning, then back to Sonnet 4.6 for code generation based on the plan. This is a form of automatic two-tier routing.

**Fast mode (beta):** Opus 4.6 with 2.5x higher output tokens/second at 6x pricing ($30/$150 per MTok vs. $5/$25 standard).

Source: [Model configuration - Claude Code](https://code.claude.com/docs/en/model-config), [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode)

### 3.3 GitHub Copilot: Auto Model Selection

GitHub Copilot implements "Auto" model selection that routes requests based on task type, capacity, and subscription level:

**Routing behavior:**
- Prioritizes model availability from a rotating set: GPT-4.1, GPT-5 mini, GPT-5.2-Codex, Claude Haiku 4.5, Claude Sonnet 4.5
- "Smart Mode" routes each request to the most appropriate model variant or reasoning depth based on prompt type
- Unlimited access to base model (GPT-4o); premium requests allocated per plan (300 for Pro, 300 for Business, 1,000 for Enterprise)

**Available models:** GPT-4o, Claude Sonnet 4/4.5, Claude Opus 4.5/4.6, Claude Haiku 4.5, Gemini 2.5 Pro, Gemini 3.1 Pro, Gemini 3 Flash

Source: [Choosing the Right Model in GitHub Copilot](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/choosing-the-right-model-in-github-copilot-a-practical-guide-for-developers/4491623), [GitHub Docs: Supported AI models](https://docs.github.com/en/copilot/reference/ai-models/supported-models)

### 3.4 OpenAI Codex: Model-Specific Optimization

OpenAI Codex recommends task-based model selection:
- **GPT-5.4:** Recommended default for most tasks (coding, reasoning, tool use)
- **GPT-5.4-mini:** Faster, lower-cost option for "lighter coding tasks or subagents"
- **GPT-5.2-Codex:** Optimized for "agentic coding in Codex," including context compaction for long-horizon work, stronger large-scale refactoring, and improved Windows environment performance

Source: [Introducing Codex](https://openai.com/index/introducing-codex/), [Codex Models](https://developers.openai.com/codex/models)

### 3.5 RouteLLM: Empirical Cost Savings from Routing (ICLR 2025)

RouteLLM (Ong et al., ICLR 2025) provides the most rigorous empirical data on routing cost savings:

**Results:**

| Benchmark | Cost Savings | Quality Preservation |
|-----------|-------------|---------------------|
| MT Bench | 3.66x (at 50% threshold) | 95% of GPT-4 quality |
| MT Bench | 2.49x (at 80% threshold) | Higher quality preserved |
| MMLU | 1.41x | 92% quality |
| GSM8K | 1.49x | 87% quality |

**Router architectures tested:**
1. Similarity-Weighted Ranking: Best on MT Bench without augmentation
2. Matrix Factorization: Highest APGR (0.802) with augmented data
3. BERT Classifier: 50.2% APGR improvement with data augmentation
4. Causal LLM (Llama 3 8B): Best on GSM8K with augmented data (25.3% improvement)

**Key finding:** With data augmentation from an LLM judge, routers achieved 95% quality with only 14% strong-model calls, a 75% cost reduction. Routers outperformed commercial offerings (Unify AI, Martian) by >40% in cost efficiency at equivalent quality levels.

**Generalization:** Routers exhibited strong generalization, maintaining performance even when routing between LLMs not included in training.

Source: [RouteLLM: Learning to Route LLMs with Preference Data](https://arxiv.org/abs/2406.18665) (ICLR 2025)

---

## 4. API Pricing and Cost Data (2025--2026)

### 4.1 Current Pricing Tiers

**Anthropic Claude Models (April 2026):**

| Model | Input/MTok | Output/MTok | 5m Cache Write | 1h Cache Write | Cache Read |
|-------|-----------|-------------|----------------|----------------|------------|
| Haiku 3 | $0.25 | $1.25 | $0.30 | $0.50 | $0.03 |
| Haiku 3.5 | $0.80 | $4.00 | $1.00 | $1.60 | $0.08 |
| Haiku 4.5 | $1.00 | $5.00 | $1.25 | $2.00 | $0.10 |
| Sonnet 4.6 | $3.00 | $15.00 | $3.75 | $6.00 | $0.30 |
| Opus 4.6 | $5.00 | $25.00 | $6.25 | $10.00 | $0.50 |
| Opus 4.1 (legacy) | $15.00 | $75.00 | $18.75 | $30.00 | $1.50 |
| Opus 4.6 Fast Mode | $30.00 | $150.00 | -- | -- | -- |

Source: [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

**OpenAI Models:**

| Model | Input/MTok | Output/MTok |
|-------|-----------|-------------|
| GPT-4o mini | $0.15 | $0.60 |
| GPT-4o | $2.50 | $10.00 |
| o3 | $2.00 | $8.00 |
| GPT-5.4 | $2.50 | $15.00 |

Source: [OpenAI Pricing](https://openai.com/api/pricing/)

**Google Gemini Models:**

| Model | Input/MTok | Output/MTok |
|-------|-----------|-------------|
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 |
| Gemini 2.5 Flash | $0.30 | $2.50 |
| Gemini 3 Flash Preview | $0.50 | $3.00 |
| Gemini 2.5 Pro | $1.25 | $10.00 |
| Gemini 3 Pro Preview | $2.00 | $12.00 |

Source: [Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing)

**DeepSeek Models:**

| Model | Input/MTok | Output/MTok |
|-------|-----------|-------------|
| DeepSeek V3.2 (cache hit) | $0.028 | $0.42 |
| DeepSeek V3.2 (cache miss) | $0.28 | $0.42 |
| DeepSeek V3.2-Exp | $0.028 | -- |

Source: [DeepSeek Pricing](https://api-docs.deepseek.com/quick_start/pricing)

### 4.2 The 60x+ Price Range

The full price range across model tiers (input pricing):

| Tier | Representative Model | Input Price | Ratio to Cheapest |
|------|---------------------|-------------|-------------------|
| Budget | DeepSeek V3.2-Exp | $0.028/MTok | 1x |
| Budget | Gemini 2.5 Flash-Lite | $0.10/MTok | 3.6x |
| Haiku-class | GPT-4o mini | $0.15/MTok | 5.4x |
| Haiku-class | Claude Haiku 3 | $0.25/MTok | 8.9x |
| Mid-tier | Claude Haiku 4.5 | $1.00/MTok | 35.7x |
| Sonnet-class | Claude Sonnet 4.6 | $3.00/MTok | 107x |
| Opus-class | Claude Opus 4.6 | $5.00/MTok | 178x |
| Premium | Claude Opus 4.6 Fast | $30.00/MTok | 1,071x |

The actual range from cheapest (DeepSeek V3.2-Exp at $0.028) to most expensive (Opus 4.6 Fast at $30) is over **1,000x**. Even within Anthropic's own lineup, the range from Haiku 3 ($0.25) to Opus 4.6 ($5.00) is 20x on input and 20x on output.

### 4.3 Latency Data

**Throughput and latency comparison (Artificial Analysis, 2026):**

| Model | Output Speed (tok/s) | Latency (s) |
|-------|---------------------|-------------|
| Mercury 2 | 881 | 4.32 |
| Qwen3.5 0.8B | 398 | 0.28 |
| Gemini 3.1 Flash-Lite | 233 | 7.88 |
| GPT-4o (Nov) | 137 | 0.88 |
| Claude Haiku 4.5 | 92 | 11.35 |
| GPT-5.4 (xhigh) | 70 | 148.04 |
| Claude Sonnet 4.6 | 45 | 2.00 |
| Claude Opus 4.6 | 42 | 1.93 |
| GPT-4o mini | 35 | 3.72 |

Source: [Artificial Analysis Leaderboard](https://artificialanalysis.ai/leaderboards/models)

**TTFT data (earlier generation):**
- Claude Haiku (3.5 era): 0.36s TTFT, 135 tok/s
- Claude Sonnet (3.5 era): 0.64s TTFT
- Claude Haiku 4.5: 639ms TTFT, sub-second total latency (952ms)

**Extended thinking impact on latency:** Reasoning models (GPT-5.2 Thinking, Claude Opus 4.6 extended thinking, Gemini 2.5 Pro thinking mode) introduce an additional "thinking" phase that can add seconds to minutes to TTFT, depending on problem complexity. Opus 4.6 Fast Mode addresses this with 2.5x higher output tokens/second but at 6x cost.

### 4.4 Prompt Caching Economics

**Anthropic cache pricing multipliers:**

| Operation | Multiplier | Break-even |
|-----------|-----------|------------|
| 5-min cache write | 1.25x input price | Pays off after 1 cache read |
| 1-hour cache write | 2.0x input price | Pays off after 2 cache reads |
| Cache read (hit) | 0.1x input price | -- |

**Performance impact:** Prompt caching reduces TTFT by 80--90% for requests with long shared system prompts.

**Batch API:** 50% discount on all token types. Opus 4.6 batch: $2.50/$12.50 per MTok (vs. $5/$25 standard).

Source: [Anthropic Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

### 4.5 KV-Cache Invalidation and Model Switching Costs

**Fundamental constraint:** KV caches are model-specific. Switching from Sonnet to Opus (or between any two different models) completely invalidates the cached prefix. There is no cross-model cache sharing.

**Prefix matching requirements:** Standard prompt caching requires exact token-level prefix matching. A single changed character, even whitespace, invalidates the cache from that point onward. This is mathematically necessary because attention key/value matrices depend on token position and all preceding tokens.

**Practical implication for routing:** A harness that routes between models must account for the "cache penalty" of switching. If a long system prompt (e.g., 10,000 tokens) is cached with Model A, switching to Model B requires a full re-computation of that prefix. At Sonnet 4.6 pricing, re-processing 10K tokens costs $0.03; at Opus 4.6, $0.05. For frequent switches in a conversation, these costs compound.

**Provider-side constraints:** Cached prefix requests must be routed to GPU clusters with matching tensor parallelism configurations. This requires coordination between orchestration and cache storage backends.

Source: [Caching for LLMs](https://mbrenndoerfer.com/writing/caching-prompt-semantic-invalidation-hit-rates-llm), [IBM: What is Prompt Caching?](https://www.ibm.com/think/topics/prompt-caching)

---

## 5. Temperature and Sampling Diversity

### 5.1 Temperature-Quality Tradeoff in Code Generation

**Chen et al. (2021) foundational finding:** Optimal temperature scales with k in pass@k. For pass@1, T=0.2 is optimal (exploit the learned distribution). For pass@100, T=0.8 is optimal (explore diverse solutions). T=0.6 provides a reasonable compromise.

**Mechanism:** Higher temperature smooths the output distribution, increasing diversity of sampled outputs. Lower temperature concentrates the distribution, reducing diversity but increasing individual sample quality.

### 5.2 Adaptive Temperature (AdapT) for Code Generation

Peng et al. (2023) proposed AdapT, which dynamically adjusts temperature per-token:
- **Challenging tokens** (code block beginnings): higher temperature (a ~= 0.8)
- **Confident tokens** (easily inferred): lower temperature (b ~= 0.5 for pass@k, b ~= 0.01--0.3 for pass@1)

**Results:**

| Model | Metric | AdapT | Baseline | Improvement |
|-------|--------|-------|----------|-------------|
| CodeGeeX-13B | pass@15 (HumanEval) | 40.9% | 36.0% | +13.6% |
| InCoder-6B | pass@15 (HumanEval) | 35.3% | 32.9% | +7.3% |
| CodeGen-2B | pass@15 (MBPP) | 48.2% | 47.0% | +2.6% |

AdapT outperformed standard temperature sampling across all tested settings and model sizes (2B to 13B parameters), with the largest gains on harder problems.

Source: [Hot or Cold? Adaptive Temperature Sampling for Code Generation](https://arxiv.org/html/2309.02772v3)

### 5.3 TURN: Automated Temperature Optimization

Zhou et al. (2025) introduced TURN (Turning Point Temperature Selection), an entropy-based algorithm that predicts optimal temperature without labeled validation data:

**Key results:**
- Hit rate: 11/13 models had predicted temperatures within the optimal range on MBPP
- Average performance drop vs. grid-searched optimal: 0.59%
- Outperformed best fixed-temperature baselines by 0.4% average accuracy on MBPP
- Even with modest sampling (40 examples), TURN showed minimal variance and only 0.2% performance degradation

**Optimal temperature ranges identified:**
- General-purpose models: T = 0.7--0.9
- Code-specific models: T = 0.7--1.3
- Task-finetuned models: T = 0.9--1.5

**Fixed temperature baseline:** T=0.9 produced only 0.9% mean performance drop across models but showed high variance, confirming that one-size-fits-all temperature settings are suboptimal.

Source: [Optimizing Temperature for Language Models with Multi-Sample Inference](https://arxiv.org/html/2502.05234v1)

### 5.4 Implications for Best-of-N Routing

The temperature-diversity tradeoff directly informs routing strategy:

1. **For best-of-N with N > 1:** Use higher temperatures (0.7--1.0) to maximize diversity
2. **For single-sample generation:** Use lower temperatures (0.2--0.5) to maximize individual quality
3. **Adaptive per-token temperature is superior** to fixed temperature across all regimes
4. **When routing to a cheaper model with N > 1 samples:** The temperature should be higher than when using a single sample from an expensive model

---

## 6. Multi-Agent Verification

### 6.1 Lifshitz et al. (2025): Multi-Agent Verification (MAV)

This paper introduces a novel scaling dimension: scaling the number of verifiers rather than the number of candidate solutions.

**BoN-MAV Algorithm:**
1. Generate N candidate solutions using a generator LLM
2. Score each candidate with M different Aspect Verifiers (AVs), each prompted to verify different aspects
3. Aggregate verification scores across all AVs
4. Select the candidate with the highest aggregate score

**Key results (N=16 candidates):**

| Domain | BoN-MAV Range | Self-Consistency Range | Improvement |
|--------|--------------|----------------------|-------------|
| MATH | 66.0--76.3% | 59.0--77.3% | Up to +7% |
| MMLU-Pro | 66.7--75.7% | 63.3--76.3% | Up to +3.4% |
| GPQA diamond | 42.0--59.0% | 40.0--59.0% | Up to +5% |
| HumanEval | 80.0--92.0% | 79.0--95.0% | Mixed |

**Scaling to 256 outputs (MATH, Gemini-1.5-Flash):**
- Base accuracy: 52.7%
- Baselines plateaued: ~61%
- BoN-MAV reached: 69% (nearly double the improvement of baselines)

**Weak-to-strong generalization:**

| Generator | Domain | Improvement |
|-----------|--------|-------------|
| Gemini-1.5-Pro | MMLU-Pro | +8.0% (64.7% to 72.3%) |
| GPT-4o | MMLU-Pro | +7.3% (68.0% to 75.7%) |
| GPT-4o | MATH | +5.0% (68.3% to 76.3%) |
| GPT-4o | GPQA diamond | +5.0% (54.0% to 59.0%) |

**Self-improvement results (same model as generator and verifier base):**
- GPT-4o-mini: +7% on MATH, +8% on GPQA diamond
- Gemini-1.5-Flash: +6.3% on MATH

**Critical finding for routing:** "Domain-specific subset selection outperformed using all 20 verifiers," demonstrating that targeted, heterogeneous verification ensembles outperform homogeneous or exhaustive approaches. This directly supports the routing thesis: diverse model ensembles (different models verifying different aspects) are more effective than multiple runs of the same model.

Source: [Multi-Agent Verification: Scaling Test-Time Compute with Multiple Verifiers](https://arxiv.org/html/2502.20379)

### 6.2 Zhu et al. (2024): ConGra -- General-Purpose Models Outperform Specialists

ConGra benchmarked 44,948 conflict cases from 34 large-scale open-source projects across C, C++, Java, and Python.

**Counterintuitive finding:** General-purpose LLMs outperform code-specialized LLMs at merge conflict resolution.

**Python Results:**

| Model | Type | Accuracy | Precision |
|-------|------|----------|-----------|
| LLama3-8B | General | 75.82% | 77.45% |
| DeepSeek-V2 | General | 75.07% | 75.53% |
| CodeLlama-34B | Code-specialized | 61.47% | 62.34% |
| DeepSeek-Coder | Code-specialized | 56.49% | 57.31% |
| CodeLlama-7B | Code-specialized | 50.68% | 59.92% |

**Java Results:**

| Model | Type | Accuracy | Precision |
|-------|------|----------|-----------|
| DeepSeek-V2 | General | 84.38% | 84.40% |
| LLama3-8B | General | 82.93% | 83.00% |
| DeepSeek-Coder | Code-specialized | 74.52% | 74.60% |
| CodeLlama-7B | Code-specialized | 73.61% | 73.66% |
| CodeLlama-34B | Code-specialized | 70.82% | 71.03% |

**Additional finding:** Longer context support does not guarantee better performance. GLM-3-Turbo (128K context) was generally outperformed by LLama3-8B (8K context).

**Routing implication:** For tasks like merge conflict resolution that require semantic understanding of code intent, general-purpose models should be preferred over code-specialized ones. A router that defaults to code-specialized models for all code tasks would make suboptimal choices.

Source: [ConGra: Benchmarking Automatic Conflict Resolution](https://arxiv.org/html/2409.14121v1) (OpenReview)

### 6.3 Kim et al. (2025): Scaling Laws for Multi-Agent Systems

Kim et al. (2025) derived quantitative scaling principles for agent systems, formalizing when multi-agent coordination helps vs. hurts.

**Three major effects:**

1. **Tool-coordination tradeoff** (beta = -0.267, p < 0.001): Tool-heavy tasks suffer disproportionately from multi-agent overhead.

2. **Capability saturation** (beta = -0.404, p < 0.001): When single-agent performance exceeds ~45% accuracy, additional agents yield diminishing or negative returns.

3. **Topology-dependent error amplification:**

| Architecture | Error Amplification Factor | Coordination Overhead |
|-------------|---------------------------|----------------------|
| Single Agent | 1.0x (baseline) | 0% |
| Centralized | 4.4x | 285% |
| Hybrid | 5.1x | 515% |
| Decentralized | 7.8x | 263% |
| Independent | 17.2x | 58% |

**Performance by domain:**

| Domain | Best Architecture | Improvement | Worst Architecture | Degradation |
|--------|------------------|------------|-------------------|-------------|
| Finance-Agent (parallelizable) | Centralized | +80.8% | -- | -- |
| BrowseComp-Plus (web) | Decentralized | +9.2% | Centralized | +0.2% |
| PlanCraft (sequential reasoning) | -- | -- | All multi-agent | -39% to -70% |

**Efficiency (success per 1,000 tokens):**
- Single Agent: 67.7
- Independent: 42.4
- Decentralized: 23.9
- Centralized: 21.5
- Hybrid: 13.6

**Turn count scaling:** Total reasoning turns follow power-law growth: T = 2.72 * (n + 0.5)^1.724 with R^2 = 0.974. The super-linear exponent (1.724) indicates quadratic message complexity.

**Predictive framework:** The scaling model achieves 87% correct architecture selection on held-out configurations, substantially exceeding random choice (20%) or capability-only models (54%).

**Key routing implication:** For sequential coding tasks (the majority of harness operations), multi-agent variants degrade performance by 39--70%. This strongly favors single-agent execution with model routing over multi-agent coordination for most coding tasks.

Source: [Towards a Science of Scaling Agent Systems](https://arxiv.org/abs/2512.08296)

---

## 7. Synthesis: Quantified Routing Principles

Drawing on all six dimensions of research, the following routing principles emerge with empirical support:

### 7.1 Task Complexity Determines Optimal Tier

| Task Complexity | Recommended Tier | Cost (approx.) | Quality vs. Frontier |
|----------------|-----------------|----------------|---------------------|
| Autocomplete, boilerplate | Haiku-class / custom fine-tuned | $0.15--$1/MTok | ~87--90% |
| Single-file edits, refactoring | Sonnet-class | $3/MTok | ~95--98% |
| Multi-file reasoning, architecture | Opus-class | $5--15/MTok | ~100% (defines frontier) |
| Verification, review | Diverse ensemble (general-purpose) | Variable | Can exceed single-model |

### 7.2 Routing Achieves 2--4x Cost Savings

RouteLLM demonstrates 2--4x cost savings with 92--95% quality preservation. The routing "dial" allows teams to choose between ~25% savings at 99.5% quality and ~70% savings at 95% quality.

### 7.3 Best-of-N is Most Effective with Verification

- Without verification: best-of-N plateaus at N~16 and degrades beyond due to reward hacking
- With verification (Cobbe et al.): effective 30x model capacity increase
- With multi-agent verification (Lifshitz et al.): up to 20% improvement for small models, 10% for large
- Budget reallocation (13B x 5 > 70B x 1) works only when unit tests or verifiers are available

### 7.4 Cache Invalidation Creates Switching Costs

Model switching invalidates all cached KV state. The optimal routing strategy should minimize model switches within a conversation/task, preferring to "commit" to a model tier for the duration of a coherent sub-task and switching only at natural boundaries (e.g., between planning and execution phases).

### 7.5 Temperature Should Track Sampling Strategy

| Strategy | Optimal Temperature | Rationale |
|----------|-------------------|-----------|
| Single greedy generation | T = 0.0--0.2 | Maximize individual quality |
| Best-of-N (N <= 5) | T = 0.6--0.8 | Balance quality and diversity |
| Best-of-N (N > 10) | T = 0.8--1.0 | Maximize diversity for coverage |
| Adaptive per-token | Varies by position | +13.6% on pass@15 vs. fixed |

### 7.6 Sequential Tasks Favor Single-Agent Routing Over Multi-Agent

Kim et al. (2025) demonstrate that for sequential reasoning tasks, all multi-agent variants degrade performance by 39--70%. Coding is primarily sequential. Model routing (selecting the right single model per task) is empirically superior to multi-agent coordination for most coding harness operations.

---

## Sources

### Benchmarks and Leaderboards
- [SWE-bench Verified Leaderboard](https://llm-stats.com/benchmarks/swe-bench-verified)
- [SWE-bench](https://www.swebench.com/)
- [SWE-Bench Pro Leaderboard](https://www.morphllm.com/swe-bench-pro)
- [HumanEval Leaderboard](https://llm-stats.com/benchmarks/humaneval)
- [LiveCodeBench Leaderboard](https://artificialanalysis.ai/evaluations/livecodebench)
- [LiveCodeBench (original)](https://livecodebench.github.io/leaderboard.html)
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/)
- [BenchLM.ai Coding](https://benchlm.ai/coding)
- [Artificial Analysis Models Leaderboard](https://artificialanalysis.ai/leaderboards/models)
- [Vellum LLM Leaderboard](https://vellum.ai/llm-leaderboard)

### Pricing
- [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [DeepSeek Pricing](https://api-docs.deepseek.com/quick_start/pricing)

### Papers
- Chen et al., "Evaluating Large Language Models Trained on Code," arXiv:2107.03374 (2021)
- Stiennon et al., "Learning to summarize from human feedback," NeurIPS 2020
- Cobbe et al., "Training Verifiers to Solve Math Word Problems," arXiv:2110.14168 (2021)
- Lifshitz et al., "Multi-Agent Verification: Scaling Test-Time Compute with Multiple Verifiers," arXiv:2502.20379 (2025)
- Zhu et al., "ConGra: Benchmarking Automatic Conflict Resolution," arXiv:2409.14121 (2024)
- Kim et al., "Towards a Science of Scaling Agent Systems," arXiv:2512.08296 (2025)
- Ong et al., "RouteLLM: Learning to Route LLMs with Preference Data," ICLR 2025
- Hassid et al., "The Larger the Better? Improved LLM Code-Generation via Budget Reallocation," ICLR 2025
- Peng et al., "Hot or Cold? Adaptive Temperature Sampling for Code Generation," arXiv:2309.02772 (2023)
- Zhou et al., "Optimizing Temperature for Language Models with Multi-Sample Inference," arXiv:2502.05234 (2025)
- Lyu et al., "Top Pass: Improve Code Generation by Pass@k-Maximized Code Ranking," arXiv:2408.05715 (2024)

### Production Implementations
- [How Cursor Serves Billions of AI Code Completions](https://blog.bytebytego.com/p/how-cursor-serves-billions-of-ai)
- [Improving Cursor Tab with online RL](https://cursor.com/blog/tab-rl)
- [Claude Code Model Configuration](https://code.claude.com/docs/en/model-config)
- [Anthropic Fast Mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode)
- [GitHub Copilot: Supported AI Models](https://docs.github.com/en/copilot/reference/ai-models/supported-models)
- [OpenAI Codex](https://openai.com/index/introducing-codex/)
- [RouteLLM GitHub](https://github.com/lm-sys/RouteLLM)
- [Pass@k vs Pass^k](https://www.philschmid.de/agents-pass-at-k-pass-power-k)

### Routing and Caching
- [Caching for LLMs: Prompt, Semantic, and Invalidation](https://mbrenndoerfer.com/writing/caching-prompt-semantic-invalidation-hit-rates-llm)
- [Anthropic Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [RouteLLM Blog (LMSYS)](https://www.lmsys.org/blog/2024-07-01-routellm/)
- [Not-Diamond Awesome AI Model Routing](https://github.com/Not-Diamond/awesome-ai-model-routing)
