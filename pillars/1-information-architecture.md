# Pillar 1: Information Architecture

## What This Pillar Is

The study of how information flows through a coding agent harness, from human intent to executable code, and how that flow should be managed to maximize the probability of correct output. This encompasses context selection, information loss at each stage, the reuse discovery problem, and the relationship between specification quality and implementation quality.

## Why It Must Exist

Context blindness is the root cause of the most common AI code quality issue: duplicate logic proliferation. An agent asked to format a date will write a new `formatDate()` utility even when one exists three directories away, because that utility is not in its context window. This is not a reasoning failure; it is an information failure (MINT Lab).

The physics of transformer attention makes this structural, not fixable by training. Chroma Research tested 18 frontier models and found universal recall degradation as input length increases. The "lost in the middle" effect (Liu et al., TACL 2024) shows models attend strongly to context boundaries but miss information buried in the middle. Longer context windows amplify this; they do not fix it.

## The Formal Problem

The central question: given a finite context window of $W$ tokens and a codebase of total size $T \gg W$, select a subset $C$ to include that maximizes task success probability while accounting for the degradation function $\delta(|C|)$ that reduces recall quality as context length increases.

$$\max_{C} \; P(\text{success} \mid C) \cdot (1 - \delta(\sum s_i)) \quad \text{s.t.} \quad \sum_{f_i \in C} s_i \leq W$$

This is a submodular optimization problem under knapsack constraints if the relevance function has diminishing returns. The open question is whether the relevance-degradation product preserves submodularity.

A secondary problem: reuse discovery. Before an executor creates function $g$, determine whether an existing function $f_j$ is functionally equivalent or adaptable. This is approximate nearest-neighbor search in a semantic embedding space, and serves as a computable proxy for the paper's uncomputable abstraction gap $K(g \mid f_j)$.

## The Right Mathematical Framework

**Shannon information theory** (not Kolmogorov complexity). Key quantities:

- $H(P \mid S)$: conditional entropy of code given spec (the measurable abstraction gap)
- $I(C; P)$: mutual information between context and correct output (context relevance)
- $H(P \mid S, C, \theta)$: residual uncertainty after spec + context + model prior (what the agent must "make up")
- $\delta(|C|)$: context degradation function (empirically measurable per model)

Shannon is preferred over Kolmogorov because: (1) it is computable; (2) it handles distributions naturally (LLMs are probabilistic); (3) the chain rule holds with exact equality (no $O(\log n)$ terms); (4) it connects directly to measurable quantities like cross-entropy and perplexity.

## What Existing Research Shows

### Context Management

- **Anthropic (Sep 2025):** Three-tier framework: active context (always loaded), searchable (retrieved on demand), hidden (persisted externally). Core principle: find "the smallest set of high-signal tokens that maximize the likelihood of some desired outcome."
- **ETH Zurich (Feb 2026, Gloaguen et al.):** LLM-generated context files (AGENTS.md) reduced success by 3% and increased costs by 20%. Human-written files helped only 4%. Recommendation: keep under 60 lines of non-inferable content.
- **JetBrains (Dec 2025):** Observation masking (replacing old tool outputs with placeholders) achieved 2.6% higher solve rates while being 52% cheaper. LLM summarization caused agents to run 15% longer.
- **Factory.ai:** Naive vector retrieval "flattens rich structure into undifferentiated chunks, destroying critical relationships between components." Code is a dependency graph, not a bag of text.
- **Chroma Research:** Every model tested degrades as input length increases. Context rot is an architectural property of attention, not a training gap.

### Spec-to-Code Information Theory

- **Hindle et al. (ICSE 2012):** Java source code cross-entropy at 3-4 bits/token.
- **Shannon (1951):** English at 0.6-1.3 bits/character.
- **The entropy gap** between these representations bounds the information the agent's prior must supply.

### Reuse Discovery

- No published work directly applies semantic search to the "should I reuse or create?" decision in coding agent context. This is an open research area. Candidate approaches: CodeBERT embeddings, StarCoder embeddings, type-signature structural matching, AST-based clone detection.

## How Existing Harnesses Handle This

| Harness | Approach | Structural? | Tradeoff |
|---------|----------|-------------|----------|
| **GSD** | Fresh 200K context per task; sub-agent isolation | Yes (new window) | Freshness over continuity; must re-discover codebase each time |
| **RAPID** | Git worktree isolation; CONTRACT.json file ownership; REUSE-MAP.md | Yes (filesystem) | Safe but orchestration-heavy; disk overhead from multiple worktrees |
| **Turing** | Three tiers: hidden (evaluate.py invisible), read-only (prepare.py), modifiable (train.py) | Yes (tool permissions) | Prevents gaming but rigid; tiers hardcoded to ML experiment pattern |
| **Blueprint** | 21 single-purpose agents with focused context; TOML config as shared state | Yes (agent scoping) | Deep analysis but routing complexity; 21 agents to manage |

## The Optimal Architecture (From Research)

Three tiers with hard boundaries:

**Tier 1 - Active (always loaded, <60 lines of instructions):**
- Task specification and acceptance criteria
- 3-5 architectural invariants (not 30)
- File ownership contract for this task
- Reuse map: existing utilities the executor should use

**Tier 2 - Searchable (agent retrieves on demand):**
- Full file contents via targeted reads (specific line ranges)
- Dependency graphs and import maps
- Test results (failures only; passing tests are noise)
- Git history for files being modified

**Tier 3 - Hidden (never enters context):**
- Evaluation infrastructure and metrics
- Other agents' workspaces
- Passing test output, verbose build logs
- Previous conversation turns' tool outputs (masked, not summarized)

**Core principle:** Context is a scarce resource requiring budgeting, not accumulation. Every token competes for attention with every other token.

## Key Contrarian Positions to Engage

1. **"Context is overrated; the prior does the work."** For common patterns (CRUD, auth, forms), the model's training data ($\theta$) already contains enough information that specification quality barely matters. The abstraction gap is bimodal: trivial for common patterns, huge for novel logic. This implies context optimization matters most for novel tasks, not routine ones.

2. **"Fresh Eyes is not incremental's fault."** GSD's 17.1% advantage for fresh context (Suzgun & Kalai) may be a confound with context rot (stale accumulated context), not with incremental updates per se. A properly managed incremental approach might match Fresh Eyes at a fraction of the cost.

3. **"Bigger windows will solve this."** As context windows grow (1M+), the budget constraint relaxes. But Chroma's universal degradation curves suggest that bigger windows amplify the lost-in-the-middle effect. The optimal strategy may be SMALLER, more curated context, not bigger windows with everything loaded.

## What Another Agent Needs to Know

- Always prefer structural context management over prompt-based ("do not look at X" in a system prompt does not work)
- The ETH Zurich result is counterintuitive but robust: more context instructions usually hurt
- Context is not a list of files; it is a relevance-weighted, degradation-adjusted optimization problem
- The reuse discovery problem is unsolved and high-impact; any advance here directly reduces slop type #4 (duplicate logic)
- Measure context quality by $H(P \mid S, C, \theta)$, not by context length

## Sources

- Anthropic: Effective Context Engineering (Sep 2025)
- ETH Zurich: Evaluating AGENTS.md (Feb 2026, arXiv:2602.11988)
- JetBrains: Efficient Context Management (Dec 2025)
- Factory.ai: The Context Window Problem
- Chroma Research: Context Rot
- Liu et al.: Lost in the Middle (TACL 2024)
- Hindle et al.: On the Naturalness of Software (ICSE 2012)
- HumanLayer: Skill Issue / Harness Engineering
