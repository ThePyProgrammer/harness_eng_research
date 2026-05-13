# Temporal Architecture of AI Coding Agent Harnesses: Empirical Data

## Research Round 2: Cycle Times, Speed-Quality Tradeoffs, Caching, Fresh Eyes, Speculative Actions

---

## 1. Cycle Time Breakdowns for AI Coding Harnesses

### 1.1 GSD Harness: 45-60 Minute Structured Cycles

The GSD (Get Stuff Done) harness enforces a deliberate phase structure within each cycle:

| Phase | Duration | Purpose |
|-------|----------|---------|
| Context Loading | 8-12 min | Load project state, read planning artifacts, restore session context |
| Research | 5-10 min | Codebase analysis, dependency mapping, approach investigation |
| Planning | 5-8 min | Generate PLAN.md with wave-based parallelization strategy |
| Execution | 10-15 min | Implement changes across files with subagent dispatch |
| Verification | 8-12 min | Run tests, lint, type-check, validate against UAT criteria |
| Human Review | 5-15 min | Developer inspects diffs, approves or requests changes |

Total cycle: 41-72 minutes, with a practical center of 45-60 minutes.

The key architectural insight is that *each phase has a distinct temporal signature*. Context loading is I/O-bound (reading files, parsing state). Research is LLM-reasoning-bound. Execution is tool-call-bound. Verification is environment-bound (running test suites, CI).

### 1.2 RAPID: Parallel Set Approach

RAPID takes a fundamentally different temporal strategy: instead of sequential phases within one agent, it parallelizes across *sets* (independent work units). Each set gets its own Git worktree, its own agent context, and its own execution timeline. Sets within the same wave run concurrently; waves run sequentially.

This means RAPID's effective cycle time per unit of work is:

- Per-set cycle: similar to GSD (discuss, plan, execute, verify per set)
- But throughput multiplied by parallelism factor (number of concurrent sets)
- Merge phase adds overhead: conflict detection, resolution, validation

### 1.3 Cursor: Agent-First Architecture (2.0+)

Cursor 2.0 (early 2026) shipped a redesigned agent-centric interface with several temporal characteristics:

- **Response latency**: 43ms average for code suggestions (Windsurf: 60ms)
- **Background Agents**: Run in isolated Ubuntu VMs, up to 8 concurrent agents via Git worktrees
- **Session duration**: Most tasks complete in under 30 seconds; complex tasks run autonomously for minutes to hours
- **Planner/Worker separation**: Planners continuously explore the codebase and create tasks; Workers execute without coordinating with each other
- **Scale achieved**: Projects generating 7.4K-14.6K commits and 550K-1.2M lines of code over days to weeks

Cursor's blog on scaling agents notes "hundreds of workers run concurrently" on large projects, with a Solid-to-React migration taking "over three weeks" with +266K/-193K edits (Cursor, "Scaling long-running autonomous coding," 2026).

### 1.4 Windsurf: SWE-grep Context Retrieval

Windsurf's temporal architecture prioritizes context retrieval speed:

- **Fast Context (SWE-grep)**: Retrieves semantically relevant code context 10x faster than traditional agentic search
- **Parallelism**: 8 parallel tool calls per turn across just 4 turns (vs. sequential search patterns)
- **SWE-1.5 model**: 950 tokens/second, 13x faster than Sonnet 4.5, 6x faster than Haiku 4.5
- **Architecture**: RAG-based, selectively pulling in relevant context rather than loading everything

### 1.5 Devin: Compound AI System

Devin's temporal profile from Cognition's 2025 Performance Review:

- **Agent Compute Unit (ACU)**: 15 minutes of active work per unit
- **Security fixes**: 1.5 minutes vs. 30 minutes for human developers (20x speedup)
- **Language migrations**: 3-4 hours vs. 30-40 hours for humans (10x improvement)
- **PR merge rate**: 67% (up from 34% previous year)
- **Speed improvement**: 4x faster at problem-solving year-over-year
- **Architecture**: Compound AI system with Planner (high-reasoning model), Coder (code-specialized model), and Critic (adversarial review model)
- **Sweet spot**: Tasks with clear requirements that would take a junior engineer 4-8 hours

### 1.6 Empirical Bottlenecks

The paper "What Limits Agentic Systems Efficiency?" (arXiv:2510.16276, Bian et al. 2025) provides the most rigorous bottleneck decomposition:

| Bottleneck | Contribution | Key Finding |
|------------|-------------|-------------|
| Web environment latency | Up to 53.7% of total runtime | Dominates in web-interactive agents |
| LLM API latency variability | Up to 69.21x variation | Llama-3.1-405B: 6.50s to 449.89s range |
| API coefficient of variation | 3.71% (Gemini) to 135.21% (Llama-70B) | Provider choice massively affects predictability |

Their proposed SpecCache framework achieved up to 3.2x reduction in web environment overhead, with cache hit rates of 83.3% (WebWalkerQA) vs. 8.9% random baseline, and 54.0% (Frames) vs. 1.0% random.

Typical agent tasks complete in 5-6 iterations out of a maximum of 10. The median web fetch latency is approximately 6 seconds, with a median of 81 clickable subpages per root URL creating a large action space.

### 1.7 Anthropic's 2026 Agentic Coding Trends Report

Key temporal statistics from Anthropic's ecosystem data:

- Average Claude Code session length: **23 minutes** (up from 4 minutes in Q1 2025)
- Tool calls per session: **47 average**
- 78% of sessions involve multi-file edits (up from 34% in Q1 2025)
- Teams using multi-agent workflows report **2-4x faster feature delivery** (task creation to production)
- 27% of AI-assisted work consists of tasks that would not have been done otherwise

---

## 2. Speed-Quality Tradeoff Data

### 2.1 SWE-bench: Resolve Rates vs. Cost

**SWE-bench Verified Leaderboard (March 2026):**

| Agent/Model | Resolve Rate | Notes |
|-------------|-------------|-------|
| Claude Opus 4.5 | 80.9% | Top score |
| Claude Opus 4.6 | 80.8% | Near-identical |
| Gemini 3.1 Pro | 80.6% | |
| MiniMax M2.5 | 80.2% | |
| GPT-5.2 | 80.0% | |

**Note**: OpenAI stopped reporting Verified scores after finding training data contamination across all frontier models. SWE-bench Pro (1,865 problems, 41 repos) is now the recommended benchmark, where current models remain below 45% Pass@1.

**Cost per issue (OpenHands evaluation, SWE-bench Lite):**

| Model | Resolve Rate | Cost/Issue |
|-------|-------------|-----------|
| Claude 3.5 Sonnet | 27% | $0.30 |
| DeepSeek-v2.5 | Competitive | $0.003 |
| Sonar Foundation Agent | N/A (Verified) | $1.26 avg, 10.5 min avg |

**Opus 4.5 efficiency insight**: At medium effort, Opus 4.5 matched Sonnet 4.5's best SWE-bench score while using 76% fewer output tokens. At highest effort, it exceeded Sonnet 4.5 by 4.3 percentage points while consuming roughly half the tokens.

### 2.2 SWE-Effi: Resource-Aware Effectiveness

The SWE-Effi benchmark (arXiv:2509.09853) introduces resource-bounded effectiveness metrics, revealing critical speed-quality dynamics:

**Effectiveness scores by scaffold + model:**

| System | Model | Resolve Rate | EuTB (Token) | EuCB (Cost) |
|--------|-------|-------------|-------------|------------|
| Agentless | Qwen3-32B | 48% | 46.7% | 47.1% |
| AutoCodeRover | Qwen3-32B | 38% | High | Low cost |
| SWE-Agent | Qwen3-32B | N/A | 21.8% | N/A |
| SWE-Agent | GPT-4o-mini | 10% | 5.1% | N/A |

**The "expensive failures" finding**: Failed attempts consume dramatically more resources than successful ones:

| System | Model | Failed Token Usage | Successful Token Usage | Ratio |
|--------|-------|-------------------|----------------------|-------|
| SWE-Agent | GPT-4o-mini | 8.867M tokens | 1.865M tokens | 4.7x |
| AutoCodeRover | Qwen3-32B | 328K input | 25K input | 13.1x |
| OpenHands | Llama-3.3-70B | 238.9s | 79s | 3.0x |

This is the "token snowball" effect: agents stuck on unsolvable tasks consume 3-13x more resources than agents that succeed, making failure the dominant cost driver.

**Model-scaffold synergy matters enormously**: SWE-Agent achieves 21.8% effectiveness with Qwen3-32B but collapses to 5.1% with GPT-4o-mini (a 77% decline), demonstrating that effectiveness is not an inherent scaffold property but emerges from scaffold-model interaction.

### 2.3 Iteration Count and Quality Correlation

Research reveals clear diminishing returns in multi-agent iteration:

- Multi-agent code verification improves accuracy by 39.7 percentage points over single agents
- But each additional agent yields diminishing gains: +14.9pp, +13.5pp, +11.2pp
- Static-analysis warnings and cognitive complexity rise by roughly 18% and 39% with sustained agent use
- More than three out of every four maintenance iterations introduce some form of regression (Alibaba SWE-CI study)
- Agents can spend 47 iterations on variations of the same command, burning through tokens on a $30 learning experience for a $0.50 problem

### 2.4 DORA 2025: AI Adoption Quality Impact

Google's 2025 DORA report on AI-assisted software development:

- AI adoption surged to 90% of software professionals (14% increase YoY)
- Median 2 hours daily spent working with AI
- Positive relationship between AI adoption and software delivery throughput
- Negative relationship between AI adoption and software delivery stability
- 45% say debugging AI-generated code is more time-consuming
- 59% report positive influence on code quality (subjective)
- Bug rates per PR appear unchanged with AI adoption

### 2.5 The Iskohm Observation

The Iskohm AI Agents Comparison 2026 discusses how agent cycles "might take 3 turns or 300 depending on complexity," highlighting that raw benchmark scores miss the temporal dimension. The core insight: a model scoring marginally higher but taking significantly longer can be worse for agentic loops where iteration speed compounds. This aligns with SWE-Effi's resource-bounded effectiveness metrics, which penalize high-scoring but slow/expensive agents.

---

## 3. Prompt Caching and KV-Cache Empirical Results

### 3.1 "Don't Break the Cache" (arXiv:2601.06007)

Liang et al. (January 2026) present the first comprehensive evaluation of prompt caching for agentic workloads:

**Headline findings across 500+ agent sessions:**

| Metric | Range | Conditions |
|--------|-------|------------|
| API cost reduction | 41-80% | Across OpenAI, Anthropic, Google |
| TTFT improvement | 13-31% | Across providers |
| System prompt size tested | 10,000 tokens | DeepResearch Bench |
| Prompt sizes tested (ablation) | 500-50,000 tokens | |
| Tool call counts tested | 3-50 calls | |

**Three caching strategies compared:**
1. Full context caching (cache everything)
2. System prompt only caching
3. Caching that excludes dynamic tool results

The key finding for harness design: caching strategy choice depends on the ratio of static to dynamic content in the prompt. Agents with large, stable system prompts and tool definitions benefit most from full context caching.

### 3.2 Agentic Plan Caching (arXiv:2506.14852)

Zhang et al. (NeurIPS 2025) introduce a fundamentally different caching target: not tokens, but plans.

**Results:**
- **Cost reduction**: 50.31% average across agent applications
- **Latency reduction**: 27.28% average
- **Performance**: Maintained (no degradation from plan reuse)

**How it works**: Extracts plan templates from completed agent executions, uses keyword matching to find similar new requests, then adapts templates with lightweight models. The key insight is that the Plan stage incurs the majority of LLM compute cost and is often repeated across similar tasks.

This differs from KV-cache prompt caching: prompt caching saves on token-level redundancy (same prefix = cached KV states), while plan caching saves on reasoning-level redundancy (similar task = reusable plan structure).

### 3.3 Production KV-Cache Economics

**Manus AI (production agent, 2025):**
- Average input-to-output token ratio: **~100:1**
- Context grows with every step; output (structured function calls) stays short
- With Claude Sonnet: cached input = $0.30/MTok, uncached = $3.00/MTok (10x difference)
- KV-cache hit rate described as "the single most important metric for a production-stage AI agent"
- Prompt must be append-only; even a single-token difference invalidates cache from that point forward

**Claude Code (production agent, 2026):**
- **92% cache hit rate** in production
- **81% cost reduction** from caching
- Prompt assembly order: System Prompt (static) -> Tool Definitions (static) -> Chat History (dynamic) -> Current input
- Every turn reads the static prefix from cache; hit rate climbs past 90%, each access resets TTL

**General production findings:**
- Cache hit rates >90% achievable for stable prefixes
- Input-to-output ratios exceeding 100:1 are typical in agent workflows (Manus blog)
- 87.4% cache hit rate translates to tangible cost savings in production

### 3.4 Implications for Harness Temporal Architecture

The caching data reveals a fundamental tension in harness design:

1. **Append-only context** maximizes cache hits but accumulates noise (see Section 4)
2. **Context reset** loses cache but gains fresh reasoning quality
3. **Compaction** (Claude Code's approach) tries to split the difference by summarizing history while preserving cache-friendly prefix structure

The optimal cycle length is partially determined by when cache savings from continuation are outweighed by quality loss from context accumulation. This is the core temporal tradeoff.

---

## 4. Fresh Eyes Effect

### 4.1 Meta-Prompting: The 17.1% Advantage (Suzgun & Kalai, 2024)

Suzgun and Kalai's meta-prompting paper (arXiv:2401.12954) provides the foundational measurement:

**GPT-4 performance improvements with meta-prompting (fresh expert instances):**

| Comparison | Improvement |
|-----------|-------------|
| vs. Standard prompting | **+17.1%** |
| vs. Expert (dynamic) prompting | **+17.3%** |
| vs. Multipersona prompting | **+15.2%** |

Tested on Game of 24, Checkmate-in-One, and Python Programming Puzzles.

**The mechanism**: When the Conductor delegates to an Expert, it creates a new API call with a fresh context window. The Expert sees only the specific instruction, not the accumulated conversation history. This prevents the "doubling-down on mistakes" pattern where errors in step N bias step N+1.

The 15.2% advantage over multipersona prompting is particularly significant: multipersona uses different personas but within the *same* context window, while meta-prompting gives each expert a *fresh* context. The difference (15.2pp) isolates the "fresh eyes" contribution from the "expert specialization" contribution.

### 4.2 Context Rot (Chroma, 2025)

Chroma's systematic study of 18 frontier models (GPT-4.1, Claude Opus 4, Gemini 2.5, and others) established that *every model* exhibits performance degradation as input context length increases:

- Adding 10% irrelevant content to prompts reduced accuracy by 23%
- The "lost-in-the-middle" effect causes 30%+ accuracy drops for information positioned in the middle of context
- Attention dilution is quadratic: 100K tokens means 10 billion pairwise attention relationships
- Distractor interference: semantically similar but irrelevant content actively misleads the model

### 4.3 Context Discipline (arXiv:2601.11564)

Abbasi et al. (December 2025) quantified latency degradation from irrelevant context:

**Llama-3.1-70B average latency degradation:**
- 4,096 words of noise: 150.54% slower
- 10,000 words of noise: 446.02% slower
- 15,000 words of noise: 719.64% slower

**Qwen1.5-14B average latency degradation:**
- 4,096 words of noise: 324.56% slower
- 15,000 words of noise: 701.03% slower

Accuracy impact was modest (0.5-1.5 percentage point decline), but latency degradation was catastrophic, suggesting the primary cost of noise is computational, not reasoning quality.

### 4.4 Agent Drift: Quantified Degradation Over Time

The "Agent Drift" paper (arXiv:2601.04170) provides the most detailed temporal degradation data:

**Drift onset:**
- Median: 73 interactions (IQR: 52-114) before detectable drift
- ~50% of agents affected by 600 interactions
- Acceleration: ASI declines 0.08 points per 50 interactions initially, increasing to 0.19 points per 50 interactions by interaction 300-400

**Performance impact (drifted vs. baseline):**

| Metric | Baseline | Drifted | Change |
|--------|----------|---------|--------|
| Task success rate | 87.3% | 50.6% | -42.0pp |
| Response accuracy | 91.2% | 68.5% | -24.9pp |
| Completion time | 8.7 min | 14.2 min | +63.2% |
| Human interventions | 0.31/task | 0.98/task | +216.1% |
| Token usage | 12,400 | 18,900 | +52.4% |
| Inter-agent conflicts | 0.08/task | 0.47/task | +487.5% |

**Behavioral boundary decline**: 46% over 500 interactions. Response consistency: 45% decline.

**Mitigation effectiveness:**
- Episodic Memory Consolidation: 51.9% drift reduction
- Drift-Aware Routing: 63.0% drift reduction
- Adaptive Behavioral Anchoring: 70.4% drift reduction
- All combined: 81.5% drift reduction (at 23% computational overhead)

### 4.5 ContextBranch: Version Control for Conversations

ContextBranch (arXiv:2512.13914) applies Git-like branching semantics to LLM conversations:

- Conversation branching improves response quality by 2.5% overall
- Large effects on focus and context awareness
- Reduces context size by 58.1%
- Forces explicit choice between "continue in polluted context" and "branch to fresh context preserving relevant history"

### 4.6 Multi-Turn Performance Degradation

Research demonstrates an average **39% performance drop** when instructions are delivered across multiple turns (vs. single-turn), with models making premature assumptions and failing to course-correct.

### 4.7 Synthesis: The Fresh Eyes Temporal Budget

The data suggests a fundamental tradeoff:

- **Fresh context advantage**: 17.1% accuracy improvement (Suzgun & Kalai), 42pp task success advantage (drift paper), 23% accuracy loss from just 10% noise (Chroma)
- **Fresh context cost**: Lost cache (81% cost reduction gone), lost accumulated knowledge, re-reading overhead (8-12 min context loading)
- **Optimal reset frequency**: Drift onset at ~73 interactions suggests resetting before this threshold; the GSD 45-60 minute cycle may empirically approximate this boundary

---

## 5. Speculative Actions

### 5.1 Speculative Actions Framework (arXiv:2510.04371)

Zhou et al. (October 2025) propose speculative execution for agent systems, inspired by CPU speculative execution and LLM speculative decoding:

**Prediction accuracy by domain:**

| Domain | Accuracy | Predictions |
|--------|----------|-------------|
| Chess | 54.7% | 3 predictions avg |
| E-Commerce | 22-38% | API-dependent |
| HotpotQA | 46% | Top-3 predictions |
| OS Tuning | High (convergence-based) | Continuous |

**Latency improvements:**
- Chess: 19.5% average time savings
- OS Tuning: convergence in ~15 seconds (Actor+Speculator) vs. 200 seconds (Actor-only), a 20x speedup
- OS Tuning p95 latency: 37.93ms (speculative) vs. 54.00ms (sequential)
- Theoretical maximum: 50% latency reduction under ideal conditions (p=1)

**Cost dynamics:**
- OS Tuning: 84,568 tokens ($1.18) for combined system vs. 205,794 tokens ($2.24) for speculator-only baseline
- Speculation uses "Speculators" (faster/smaller models) and "Actors" (full models that validate)

### 5.2 DualSpec: Heterogeneous Speculation for Research Agents (arXiv:2603.07416)

Ji et al. (March 2026) extend speculative actions specifically for deep research agents:

- **Up to 3.28x end-to-end speedup** while maintaining accuracy
- Key insight: Search and Visit actions have fundamentally different reasoning requirements
- Entropy-based analysis reveals Search decisions have higher uncertainty (harder to predict)
- Uses a lightweight, confidence-based semantic verifier instead of strict action matching
- Addresses limitation of uniform speculation strategies

### 5.3 SpecCache: Speculative Caching (arXiv:2510.16276)

Bian et al. combine speculation with caching for web-interactive agents:

- Cache hit rates: 83.3% (WebWalkerQA), 54.0% (Frames) vs. 1-9% random baseline
- Up to 58x improvement over random caching strategy
- 3.2x reduction in web environment overhead

### 5.4 Learning Next Action Predictors (arXiv:2603.05923)

March 2026 work on learning action predictors from human-computer interaction data, suggesting that prediction models can be trained from behavioral traces rather than requiring domain-specific heuristics.

### 5.5 Implications for Harness Design

The speculative actions data suggests several harness optimizations:

1. **Pre-compute likely next steps during human review** (the 5-15 min review phase in GSD): With 46-55% prediction accuracy, roughly half of speculated work can be reused
2. **Use smaller models as speculators**: The cost of wrong speculation (wasted cheap compute) is far less than the latency of sequential execution
3. **Domain-dependent accuracy**: Structured domains (chess: 54.7%) predict better than open-ended ones (e-commerce: 22-38%)
4. **Combine with caching**: SpecCache's 58x cache hit improvement shows speculation and caching are synergistic

---

## Summary of Key Numbers

| Metric | Value | Source |
|--------|-------|--------|
| GSD cycle time | 45-60 min | Harness architecture |
| Claude Code session length | 23 min avg (up from 4 min) | Anthropic 2026 Report |
| Cursor background agents | Up to 8 concurrent | Cursor docs |
| Devin security fix speedup | 20x vs. human | Cognition 2025 Review |
| Prompt cache cost reduction | 41-80% | arXiv:2601.06007 |
| Prompt cache TTFT improvement | 13-31% | arXiv:2601.06007 |
| Plan cache cost reduction | 50.31% avg | arXiv:2506.14852 |
| Plan cache latency reduction | 27.28% avg | arXiv:2506.14852 |
| Claude Code cache hit rate | 92% | Anthropic engineering |
| Manus input:output ratio | ~100:1 | Manus blog |
| Fresh eyes advantage | 17.1% over standard prompting | Suzgun & Kalai 2024 |
| Context noise penalty | 23% accuracy loss from 10% noise | Chroma 2025 |
| Agent drift onset | 73 interactions median | arXiv:2601.04170 |
| Drift task success decline | 87.3% to 50.6% | arXiv:2601.04170 |
| Speculative action accuracy | 46-55% | arXiv:2510.04371 |
| DualSpec speedup | Up to 3.28x | arXiv:2603.07416 |
| Failed task token multiplier | 3-13x vs. successful | arXiv:2509.09853 |
| Multi-agent diminishing returns | +14.9pp, +13.5pp, +11.2pp per agent | Multi-agent verification |
| Multi-turn performance drop | 39% average | Context management research |
| SWE-bench Verified top score | 80.9% (Claude Opus 4.5) | Leaderboard March 2026 |
| SWE-bench cost per issue | $0.003-$1.26 range | OpenHands, Sonar |

---

## Sources

- [Don't Break the Cache (arXiv:2601.06007)](https://arxiv.org/abs/2601.06007)
- [Agentic Plan Caching (arXiv:2506.14852)](https://arxiv.org/abs/2506.14852)
- [Speculative Actions (arXiv:2510.04371)](https://arxiv.org/abs/2510.04371)
- [DualSpec (arXiv:2603.07416)](https://arxiv.org/abs/2603.07416)
- [What Limits Agentic Systems Efficiency (arXiv:2510.16276)](https://arxiv.org/abs/2510.16276)
- [Meta-Prompting: Suzgun & Kalai (arXiv:2401.12954)](https://arxiv.org/abs/2401.12954)
- [Context Discipline (arXiv:2601.11564)](https://arxiv.org/abs/2601.11564)
- [Agent Drift (arXiv:2601.04170)](https://arxiv.org/html/2601.04170)
- [SWE-Effi (arXiv:2509.09853)](https://arxiv.org/abs/2509.09853)
- [SWE-bench Pro (arXiv:2509.16941)](https://arxiv.org/abs/2509.16941)
- [ContextBranch (arXiv:2512.13914)](https://arxiv.org/html/2512.13914v1)
- [Context Rot (Chroma Research, 2025)](https://www.trychroma.com/research/context-rot)
- [Devin 2025 Performance Review](https://cognition.ai/blog/devin-annual-performance-review-2025)
- [Anthropic 2026 Agentic Coding Trends Report](https://resources.anthropic.com/2026-agentic-coding-trends-report)
- [Cursor: Scaling Long-Running Autonomous Coding](https://cursor.com/blog/scaling-agents)
- [Cursor Parallel Agents Docs](https://cursor.com/docs/configuration/worktrees)
- [Manus: Context Engineering for AI Agents](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenHands SWE-bench Evaluation at 30x Speed](https://openhands.dev/blog/evaluation-of-llms-as-coding-agents-on-swe-bench-at-30x-speed)
- [SWE-bench Verified Leaderboard](https://www.swebench.com/)
- [SWE-bench Verified (Epoch AI)](https://epoch.ai/benchmarks/swe-bench-verified)
- [Iskohm AI Agents Comparison 2026](https://blog.iskohm.com/en/posts/ai-agents-comparison-2026-cursor-copilot-kilo-code-claude-code/)
- [Google DORA 2025 Report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)
- [Learning Next Action Predictors (arXiv:2603.05923)](https://arxiv.org/abs/2603.05923)
- [Windsurf vs Cursor 2026 (NxCode)](https://www.nxcode.io/resources/news/windsurf-vs-cursor-2026-ai-ide-comparison)
- [SWE-bench Pro Leaderboard (Morph)](https://www.morphllm.com/swe-bench-pro)
