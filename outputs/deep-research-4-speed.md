# Deep Research 4: Speed and Iteration Cycles in AI Coding Agent Harnesses

## 1. The Speed-Quality Tradeoff

The relationship between iteration speed and outcome quality is not linear. Faster cycles yield more attempts per unit time, and empirically, more attempts compensate for lower per-attempt accuracy up to a threshold. A model scoring 2% higher but taking 3x longer per response can be worse in practice for agentic loops where the model calls tools repeatedly ([AI Agents Comparison 2026](https://blog.iskohm.com/en/posts/ai-agents-comparison-2026-cursor-copilot-kilo-code-claude-code/)).

But this has a failure mode: skipping verification stages compounds errors geometrically. Each unverified step has some probability *p* of introducing a defect. Over *n* unverified steps, the probability of at least one defect is *1 - (1-p)^n*. At p=0.1 and n=5, you are almost certainly carrying a bug (41% chance). The Sherlock framework ([arXiv 2511.00330](https://arxiv.org/pdf/2511.00330)) addresses this directly with tunable speculation aggressiveness and topology-aware verifier placement, confirming that blind speed without verification is architecturally unsound.

The practical implication: optimize for *verified iterations per hour*, not raw iterations per hour.

## 2. Where Time Is Spent

A typical 45-60 minute GSD cycle breaks down roughly as follows:

| Stage | Estimated Time | Bottleneck? |
|-------|---------------|-------------|
| Context Loading (codebase read) | 8-12 min | Yes (I/O bound, scales with repo size) |
| Research (parallel agents) | 5-10 min | Partially (parallelizable, but LLM latency per call) |
| Planning (PLAN.md generation) | 5-8 min | No (single LLM call, well-structured) |
| Execution (code changes) | 10-15 min | Yes (sequential tool calls, each with round-trip latency) |
| Verification (tests, lint, review) | 8-12 min | Yes (CI/test suite runtime, not LLM-bound) |
| Human Review | 5-15 min | Variable (depends on trust level and change scope) |

The three bottlenecks are context loading, execution, and verification. Planning is relatively cheap. Research parallelizes well. Human review is outside the agent's control but can be reduced by building trust through consistent verification.

The dominant cost in execution is *round-trip latency*. Each tool call (read file, edit file, run command) involves an LLM inference plus I/O. With input-to-output ratios exceeding 100:1 in agent workflows ([KV-Cache study](https://llm-d.ai/blog/kvcache-wins-you-can-see)), the inference cost per step is heavily prefix-dominated.

## 3. Existing Approaches to Speed

**GSD** pays a steep context-loading tax (fresh 200K context per task) in exchange for zero context rot. This is the conservative choice: correctness over speed. Parallel research agents recover some time but don't address the fundamental re-reading cost.

**RAPID** attacks a different dimension: throughput via parallelism across independent sets. Each set still has its own cycle time, so latency for any single task is unchanged. The gain is wall-clock time for an entire milestone, not per-task speed.

**Turing** optimizes for autonomous iteration count. The `/loop 5m /turing:train` pattern runs experiments continuously with convergence detection as the exit condition. Speed comes from removing human latency between iterations entirely, not from making any single iteration faster.

**Blueprint** decouples governance from the development cycle. Drift detection and debt monitoring are asynchronous, non-blocking operations. This is the correct architectural pattern: verification that does not gate the critical path.

## 4. Strategies for Reducing Cycle Time Without Sacrificing Quality

**Incremental Context.** The "Don't Break the Cache" study ([arXiv 2601.06007](https://arxiv.org/html/2601.06007v1)) found that prompt caching reduces API costs by 45-80% and time-to-first-token by 13-31%. But naive full-context caching can paradoxically increase latency; only stable content (system prompt, tool definitions) should be cached. Dynamic tool results should be excluded. For GSD, this means persisting a codebase summary between sessions rather than re-reading every file, while keeping execution context fresh.

**Agentic Plan Caching.** APC ([arXiv 2506.14852](https://arxiv.org/abs/2506.14852)) extracts and reuses structured plan templates across semantically similar tasks, reducing costs by 50% and latency by 27% on average. Pre-warming the cache with offline samples mitigates cold-start overhead. This maps directly to GSD's planning phase: similar phases across projects could share plan skeletons.

**Tiered Verification.** Rather than a single verification gate at the end, run lightweight checks continuously (syntax, type checking, lint) during execution, with deep checks (full test suite, integration tests) at phase boundaries. This catches 80% of errors at 20% of the cost.

**Speculative Execution.** The Speculative Actions framework ([arXiv 2510.04371](https://arxiv.org/abs/2510.04371)) predicts likely next actions using faster models, enabling parallel execution. With up to 55% next-action prediction accuracy, roughly half of tool calls can be speculatively pre-computed. The key constraint: speculative results must be validated before downstream dependencies consume them.

**Warm Caches.** Claude Code's prompt caching already achieves 90%+ cache hit rates when the static prefix is preserved across turns. The opportunity is extending this across sessions: persisting the codebase map, dependency graph, and architectural context so that a fresh agent instance starts warm rather than cold.

## 5. The Iteration Architecture for a Best-of-Breed Harness

**Minimum viable cycle time** for a verified iteration is approximately 8-15 minutes, achievable by:

- Warm context start (skip full codebase re-read): saves 8-12 min
- Speculative execution on tool calls: saves 3-5 min on execution
- Tiered verification (inline checks, deferred deep checks): saves 5-8 min per iteration

**What can be parallelized:**
- Research across multiple files/topics (already done in GSD)
- Independent code changes across files (RAPID's approach)
- Speculative next-step execution alongside current-step verification
- Governance checks (drift, debt, compliance) as background processes

**What must be sequential:**
- Plan before execute (the plan gates what gets built)
- Execute before verify (you must have output to check)
- Verify before commit (the whole point of verification)
- Each edit to a single file (edits to the same file are inherently sequential)

**The target architecture** combines four ideas:

1. **Persistent codebase state** between sessions (warm start, not cold)
2. **Speculative pipelining** where verification of step N overlaps with execution of step N+1, with rollback if verification fails
3. **Tiered verification** with inline fast checks and batched deep checks
4. **Asynchronous governance** that monitors but never blocks the critical path

This architecture should bring a verified cycle down to 8-15 minutes for routine changes, with the full 45-60 minute cycle reserved for high-risk, cross-cutting modifications where the verification tax is justified.

---

Sources:
- [AI Agents Comparison 2026](https://blog.iskohm.com/en/posts/ai-agents-comparison-2026-cursor-copilot-kilo-code-claude-code/)
- [Sherlock: Reliable and Efficient Agentic Workflow Execution](https://arxiv.org/pdf/2511.00330)
- [Speculative Actions: A Lossless Framework for Faster Agentic Systems](https://arxiv.org/abs/2510.04371)
- [Don't Break the Cache: Prompt Caching for Long-Horizon Agentic Tasks](https://arxiv.org/html/2601.06007v1)
- [Agentic Plan Caching: Test-Time Memory for Fast and Cost-Efficient LLM Agents](https://arxiv.org/abs/2506.14852)
- [KV-Cache Wins: From Prefix Caching to Distributed Scheduling](https://llm-d.ai/blog/kvcache-wins-you-can-see)
- [SWE-bench Leaderboards](https://www.swebench.com/)
- [Epoch AI Benchmarks](https://epoch.ai/benchmarks)
