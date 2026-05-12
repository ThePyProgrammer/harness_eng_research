# Context Engineering for Coding Agent Harnesses

## The Context Blindness Problem

Coding agents produce duplicate logic, hallucinated imports, and unnecessary abstractions for a single root cause: they cannot see what already exists. An agent asked to format a date will write a new `formatDate()` utility even when one lives three directories away, because that utility is not in its context window. This is not a reasoning failure; it is an information failure. The agent generates code "regardless of whether the correct function already exists" (MINT Lab).

The physics of transformer attention makes this worse at scale. Chroma Research tested 18 frontier models (Claude Opus 4, GPT-4.1, Gemini 2.5 Pro) and found that every single one degrades as input length increases. This is not a capability gap that training solves; it is an architectural property of attention mechanisms. The "lost in the middle" effect (Liu et al., TACL 2024) shows models attend strongly to the beginning and end of context but miss information buried in the middle. Longer context windows do not fix this; they amplify it. A 200K-token context with the critical function signature at position 140K is functionally blind to it.

The ETH Zurich AGENTS.md study (February 2026) quantified the cost of naive context loading. LLM-generated context files reduced task success by 3% while increasing inference costs by 20%. Even human-written files only gained 4% success at a 19% cost increase. The recommendation: keep context files under 60 lines of non-inferable content. More context is not better context.

## Four Approaches Compared

**GSD** uses fresh 200K context per task with strict context isolation between sub-agents. Each sub-agent gets a clean window scoped to its specific phase. This prevents cross-contamination but means architectural knowledge must be re-discovered each session. The tradeoff is freshness over continuity.

**RAPID** enforces structural isolation via git worktrees (each set gets its own repo copy) and file ownership contracts (`CONTRACT.json`). Reuse maps tell agents what already exists. This is the most architecturally enforced approach: the agent literally cannot edit files outside its contract. The tradeoff is orchestration complexity and disk overhead.

**Turing** uses tiered visibility: `evaluate.py` is invisible to the research agent (hidden tier), `prepare.py` is read-only, and only `train.py` is modifiable. This prevents the agent from gaming its own evaluation, a structural guarantee that no prompt instruction can replicate. The tradeoff is rigidity; the tiers are hardcoded to the ML experiment pattern.

**Blueprint** deploys 21 single-purpose agents, each with tightly focused context, sharing state through TOML configuration files. An ADR researcher agent sees only research-relevant files; a compliance auditor sees only accepted decisions and code. Context is narrow by construction. The tradeoff is agent proliferation and routing complexity.

## What the Research Says

Anthropic's context engineering guide (September 2025) frames the core principle as finding "the smallest set of high-signal tokens that maximize the likelihood of some desired outcome." Their specific recommendations:

- **In active context**: system prompts, minimal non-overlapping tool sets, canonical examples
- **Searchable (just-in-time)**: lightweight identifiers (file paths, stored queries, links) that agents retrieve on demand, mirroring how humans use file systems
- **Hidden (persisted externally)**: agent notes, memory files, previously executed tool results

JetBrains Research (December 2025) compared two structural approaches on SWE-bench Verified. Observation masking (replacing old tool outputs with placeholders while preserving agent reasoning) achieved 2.6% higher solve rates while being 52% cheaper than unmanaged baselines. LLM summarization, by contrast, caused agents to run 15% longer, with summary calls consuming 7% of total cost per instance. The verdict: mask verbose outputs structurally rather than summarizing them with another LLM call.

Factory.ai's analysis confirms that naive vector retrieval "flattens rich structure into undifferentiated chunks, destroying critical relationships between components." Code is a dependency graph, not a bag of text fragments. Retrieval that ignores this structure actively harms agent reasoning.

## Structural Solutions vs. Prompt Solutions

The critical distinction in context management is whether a constraint is architecturally enforced or merely requested.

**Structural (enforced)**:
- Git worktree isolation (RAPID): the agent physically cannot access files outside its worktree
- Hidden file tiers (Turing): `evaluate.py` is never loaded, so the agent cannot see or modify it
- Observation masking (JetBrains): old tool outputs are replaced at the infrastructure level
- File ownership contracts: the harness rejects writes to files outside the contract
- Sub-agent context isolation (GSD, Blueprint): each agent session starts with a controlled window

**Prompt-based (hoping)**:
- "Do not modify evaluate.py" in a system prompt
- "Check for existing utilities before creating new ones"
- "Keep your changes scoped to the requested task"
- LLM-generated AGENTS.md files describing project conventions

The ETH Zurich results are the clearest evidence that prompt-based approaches fail: adding more instructions to context files degraded performance. Structural enforcement, by contrast, makes violations impossible rather than merely discouraged.

## The Optimal Context Architecture

Based on the research, a best-of-breed harness should implement three tiers with hard boundaries:

**Tier 1: Active Context (always loaded, under 60 lines of instructions)**
- Task specification and acceptance criteria
- Architectural invariants (3-5 rules, not 30)
- File ownership contract for this specific task
- Reuse map: "these utilities already exist, use them"

**Tier 2: Searchable (agent can retrieve on demand)**
- Full file contents via targeted reads (specific line ranges, not entire files)
- Dependency graphs and import maps
- Test results (failures only; passing tests are noise)
- Git history for files being modified

**Tier 3: Hidden (never enters context)**
- Evaluation infrastructure and metrics collection
- Other agents' workspaces and intermediate state
- Passing test output, linter success messages, verbose build logs
- Previous conversation turns' tool outputs (masked, not summarized)

The key engineering principle: context is a scarce resource comparable to CPU or memory. It requires budgeting, not accumulation. Every token that enters the context window competes for attention with every other token. The optimal strategy is aggressive exclusion (hide everything possible), selective retrieval (load only what the current step needs), and structural enforcement (make violations impossible rather than merely discouraged).

The harnesses that work best are the ones that treat the context window like a cockpit instrument panel: showing exactly the information needed for the current maneuver, with everything else available on request but out of sight.

---

Sources:
- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Chroma Research: Context Rot](https://www.trychroma.com/research/context-rot)
- [Liu et al.: Lost in the Middle (TACL 2024)](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630)
- [ETH Zurich AGENTS.md Study (MarkTechPost)](https://www.marktechpost.com/2026/02/25/new-eth-zurich-study-proves-your-ai-coding-agents-are-failing-because-your-agents-md-files-are-too-detailed/)
- [ETH Zurich AGENTS.md Study (InfoQ)](https://www.infoq.com/news/2026/03/agents-context-file-value-review/)
- [JetBrains Research: Efficient Context Management](https://blog.jetbrains.com/research/2025/12/efficient-context-management/)
- [Factory.ai: The Context Window Problem](https://factory.ai/news/context-window-problem)
- [HumanLayer: Harness Engineering](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [Augment Code: How to Build Your AGENTS.md](https://www.augmentcode.com/guides/how-to-build-agents-md)
