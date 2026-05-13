# Contrarian and Alternative Perspectives on Information Architecture for Coding Agents

## Research Report, Round 5

---

## 1. "Context Is Overrated; The Prior Does the Work"

### 1.1 The Bimodal Abstraction Gap Hypothesis

The strongest version of this argument holds that for common programming patterns (CRUD endpoints, authentication flows, form validation, pagination), the model's parametric knowledge already contains so much information that specification quality barely matters. The interesting question is whether this creates a genuinely bimodal distribution: trivial for common patterns, enormous for novel logic.

**Evidence supporting bimodality:**

Research on parametric vs. contextual knowledge in LLMs (Longpre et al., "Entity-Based Knowledge Conflicts in Question Answering," EMNLP 2021; and the more recent "Task Matters: Knowledge Requirements Shape LLM Responses to Context-Memory Conflict," arXiv:2506.06485, 2025) establishes that LLMs have two distinct knowledge channels: parametric knowledge stored in weights during training, and contextual knowledge injected at inference time. The interaction between these channels is task-dependent, not uniform.

Specifically, the 2025 study finds that "the impact of context-memory conflict depends highly on the task's intended knowledge reliance." For tasks where the LLM's parametric memory is rich (common patterns, well-documented APIs, standard architectures), external context provides marginal value. For tasks requiring domain-specific or novel information, context becomes essential.

**The CRUD evidence:** Consider what the model "knows" about a standard REST CRUD endpoint. The training corpus contains millions of examples in every major framework. A specification like "create a CRUD API for users with email and name fields using Express.js" provides perhaps 50 bits of genuinely novel information (the entity name, field names, framework choice). The implementation requires roughly 2,000-4,000 bits (using the Hindle et al. 2012 code entropy measurements of ~2 bits/token for 1,000-2,000 tokens). But nearly all of those bits are recoverable from the model's prior; the conditional entropy H(Code|Spec) is extremely low because I(Weights;Code) is extremely high.

For novel logic (a custom reconciliation algorithm, a domain-specific state machine, a bespoke consistency protocol), the prior contributes almost nothing. The model has never seen this particular algorithm. Here, H(Code|Spec) approaches H(Code), and the spec must carry nearly all the information.

**The ETH Zurich AGENTS.md study** (Gloaguen et al., "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?", arXiv:2602.11988, February 2026) provides indirect but striking evidence for this bimodality. Testing 138 tasks from 12 niche Python repositories:

| Condition | Success Rate Delta | Cost Increase |
|---|---|---|
| LLM-generated AGENTS.md | -0.5% to -2% | +20-23% |
| Human-written AGENTS.md | +4% (average) | +19% |
| No context file | Baseline | Baseline |

The key insight: LLM-generated context files actually *hurt* performance while increasing cost. The researchers conclude: "practitioners should omit LLM-generated context files entirely and limit human-written instructions to non-inferable details, such as highly specific tooling or custom build commands." This directly supports the prior-does-the-work thesis for common patterns; the model already knows how Python projects work, and restating that knowledge creates noise.

### 1.2 When Context Optimization Actually Matters

The bimodal hypothesis implies a strategic allocation principle: invest context engineering effort proportional to the novelty of the task.

Google Research's work on sufficient context in RAG (published on the Google Research Blog, 2024) found that "sometimes models generate correct answers when context is rated as insufficient," because "insufficient context can still be useful by bridging gaps in the model's knowledge or clarifying ambiguities." This suggests a nuanced picture: even for novel tasks, partial context can be useful if it resolves the highest-entropy decisions.

**Practical implication:** A triage function should classify tasks by novelty. For tasks where the model's prior is strong (common patterns, standard library usage, well-known frameworks), minimal context is optimal; adding more creates distraction. For novel logic, aggressive context provision is essential because the prior is weak. The crossover point, where context investment transitions from wasteful to critical, is the key engineering parameter.

### 1.3 The Counterargument: Priors Are Stale and Generic

The prior-does-the-work argument has a significant weakness: the model's training data reflects the *average* codebase, not *your* codebase. Even for CRUD, your project's conventions (error handling style, naming patterns, authentication middleware stack, database abstraction layer) require contextual grounding.

Spotify's Honk project (Spotify Engineering Blog, November 2025), which processed 1,500+ AI-generated pull requests, found that "a handful of concrete code examples heavily influences the outcome" even for routine tasks. The prior gets you 80% of the way; the last 20% (project-specific conventions) requires context. Whether that 20% matters depends on whether you need mergeable code or just a starting point.

---

## 2. "Bigger Windows Will Solve This"

### 2.1 The Naive Extrapolation

The argument is simple: as context windows grow from 8K to 32K to 128K to 1M+ tokens, the budget constraint relaxes. If your codebase is 500K tokens, a 1M-token window can hold it all. Problem solved, no curation needed.

This argument is empirically false. The evidence is overwhelming that bigger windows *amplify* degradation rather than solving it.

### 2.2 Chroma's Context Rot Research (2025)

Chroma's systematic study ("Context Rot: How Increasing Input Tokens Impacts LLM Performance," research.trychroma.com, 2025) tested 18 frontier models across all major providers (Claude Opus 4, Sonnet 4, GPT-4.1, Gemini 2.5 Pro, Qwen3 variants, and others). The core finding: **every single model gets worse as input length increases**, even when the context window is nowhere near full.

Three compounding mechanisms drive degradation:

1. **Lost-in-the-middle effect:** Models attend well to the beginning and end of context but poorly to the middle. This produces the U-shaped accuracy curve documented by Liu et al. (TACL 2024), with 30%+ accuracy drops for information positioned in the middle of a 20-document context.

2. **Attention dilution:** Transformer attention is quadratic. At 100K tokens, the attention mechanism must manage approximately 10 billion pairwise relationships. Each additional token dilutes attention across all existing tokens.

3. **Distractor interference:** Semantically similar but irrelevant content actively misleads the model. Even a single distractor reduced performance relative to needle-only baselines; multiple distractors compounded degradation further.

**The most counterintuitive finding:** Models performed better on *shuffled* haystacks than on logically structured documents across all 18 models tested. Coherent text creates more plausible-seeming distractors that compete for attention. This directly contradicts the intuition that "just give it more organized context."

### 2.3 The Needle-in-a-Haystack Illusion

The Needle-in-a-Haystack (NIAH) benchmark has created a false sense of security. Models perform well on NIAH because it tests lexical retrieval (finding a specific planted sentence), which is a narrow capability. NIAH "underestimates what most long context tasks require in practice," per Chroma's analysis.

Real coding tasks require *relational* retrieval (understanding how components connect), *inferential* retrieval (deriving implications from scattered evidence), and *compositional* retrieval (synthesizing information from multiple positions). These are categorically harder than finding a planted needle, and performance on them degrades much faster with context length.

### 2.4 Liu et al.'s Foundational Evidence

Liu et al. ("Lost in the Middle: How Language Models Use Long Contexts," TACL 2024) established the empirical baseline:

- Performance on multi-document QA with information in the middle was **lower than closed-book performance** for GPT-3.5-Turbo (56.1% closed-book baseline). The model was actively *harmed* by providing context.
- The U-shaped curve holds across all models tested, including those explicitly designed for long contexts.
- More documents (longer context) made the problem worse, not better.

### 2.5 The Implication: Curation Becomes *More* Important

As windows grow, the search space for attention grows quadratically. Without curation, you are not giving the model more useful information; you are giving it more opportunities to be distracted. The correct metaphor is not "bigger bucket holds more water" but "bigger room means more places to lose your keys."

JetBrains' research (NeurIPS DL4Code Workshop, December 2025) on context management strategies found that simple observation masking (filtering out irrelevant tool outputs) reduced costs by ~50% without degrading performance. This means roughly half the context in typical agent sessions is pure noise. The LLM-summarization strategy, despite its sophistication, could not consistently outperform simple masking, suggesting that the problem is not summarization quality but information relevance.

---

## 3. "Fresh Eyes Is Better Than Incremental"

### 3.1 The Suzgun and Kalai Evidence

Suzgun and Kalai ("Meta-Prompting: Enhancing Language Models with Task-Agnostic Scaffolding," ICLR 2024) demonstrated that meta-prompting surpasses standard prompting by 17.1%, expert (dynamic) prompting by 17.3%, and multipersona prompting by 15.2%. The architecture involves a "Conductor" model that decomposes complex problems into subtasks, each handled by a "fresh Expert" instance with its own isolated context.

The "Fresh Eyes" principle is architectural: each expert starts with a clean context containing only the specific subtask, not the accumulated history of the session. This isolation prevents context contamination between subtasks.

### 3.2 Is This Genuinely About Freshness, or Context Rot?

The 17.1% advantage likely confounds two distinct effects:

**Effect 1: Context rot prevention.** As documented by Chroma (2025), accumulated context degrades performance through attention dilution and distractor interference. By clearing context between subtasks, meta-prompting avoids the degradation that occurs in accumulated sessions. This is not "freshness" per se but "absence of rot."

**Effect 2: Task decomposition benefits.** Breaking a complex task into focused subtasks reduces intrinsic cognitive load (in the Sweller 1988 sense) regardless of context history. A model solving a focused subproblem is more likely to succeed than one solving the whole problem, even with a clean context.

Evidence from agent session analysis supports the context rot hypothesis specifically. Chroma's research found that "by 35 minutes, every agent's success rate drops, and doubling task duration quadruples the failure rate." Coding agents have three properties that maximize context rot: accumulative context (every file read, grep result, and tool output stays in the window), high distractor density, and long task horizons.

### 3.3 What Would a Properly Managed Incremental Approach Look Like?

If the "Fresh Eyes" advantage is primarily about context rot prevention, then a properly managed incremental approach could capture the benefits of both continuity and freshness:

1. **Aggressive context pruning between steps.** Rather than starting fresh, retain only the relevant outputs from previous steps while discarding exploration artifacts, failed attempts, and verbose tool outputs. JetBrains' observation masking research shows this can reduce context by 50% without performance loss.

2. **Structured memory separation.** Maintain a "working memory" (current subtask context, analogous to the fresh expert) and a "reference memory" (curated outputs from prior steps). The working memory is kept lean; the reference memory is consulted only when explicitly needed.

3. **Summarization checkpoints.** At defined intervals, compress the session history into a structured summary that captures decisions made, artifacts produced, and invariants established, then discard the raw history.

4. **Context budget enforcement.** Hard caps on context accumulation that trigger pruning when exceeded, rather than allowing unbounded growth.

The prediction: a well-managed incremental approach should match or exceed Fresh Eyes because it retains useful continuity (what was already tried, what constraints were discovered) without the rot. The Spotify Honk team's approach implicitly validates this; their system operates on individual tasks with focused context rather than maintaining long-running sessions.

---

## 4. HCI and Cognitive Load Perspectives

### 4.1 Sweller's Cognitive Load Theory (1988)

John Sweller's foundational paper "Cognitive Load During Problem Solving: Effects on Learning" (Cognitive Science, Vol. 12, Issue 2, 1988, pp. 257-285) established three categories of cognitive load:

- **Intrinsic load:** The inherent difficulty of the material, determined by the number of interacting elements that must be processed simultaneously.
- **Extraneous load:** Load imposed by poor instructional design or presentation that consumes cognitive resources without contributing to understanding.
- **Germane load:** Productive cognitive effort invested in schema construction and learning.

The central principle: working memory has a fixed capacity. When extraneous load consumes too much of that capacity, insufficient resources remain for intrinsic processing, and performance collapses.

### 4.2 The Transformer Attention Analogy

Recent research establishes a surprisingly direct analogy between human working memory limits and transformer attention constraints.

**Kim et al., "Self-Attention Limits Working Memory Capacity of Transformer-Based Models" (NeurIPS 2024)** trained vanilla decoder-only transformers on N-back tasks and found:

- Transformer models exhibit working memory capacity constraints similar to human cognitive limits.
- As task difficulty increases (larger N in N-back tasks), "the total entropy of the attention score matrix increases," indicating attention becomes more dispersed.
- This capacity limit emerges *even when the sequence length is well within the model's context window*, demonstrating that the constraint is not raw context length but attention allocation.
- Attention scores gradually aggregate to relevant positions over training, but this aggregation breaks down as the number of items to track increases.

This maps directly onto Sweller's framework:

| Cognitive Load Type | Human Working Memory | Transformer Attention |
|---|---|---|
| Intrinsic | Task complexity (element interactivity) | Number of cross-file dependencies to track |
| Extraneous | Poor presentation, irrelevant info | Distractor tokens, verbose tool outputs, stale context |
| Germane | Schema construction effort | Attention allocated to actual task-relevant tokens |

### 4.3 Cognitive Overload Attacks as Existence Proof

Guo et al. ("Cognitive Overload Attack: Prompt Injection for Long Context," arXiv:2410.11272, 2024) demonstrated that the analogy is not merely metaphorical but operationally exploitable:

- By stacking irrelevant cognitive tasks before the target prompt, they induced cognitive overload where "most working memory is allocated to preceding cognitive load tasks, leaving insufficient resources for the observation task."
- Attack success rates reached 99.99% on Claude-3-Opus and 97% on JailbreakBench.
- Under cognitive stress, models defaulted to pretraining knowledge rather than following instructions.
- Performance degradation was statistically significant: t = 3.1248, p = 0.0048 as cognitive load increased.

This is essentially an adversarial demonstration that extraneous cognitive load (in Sweller's terms) can overwhelm a transformer's attention capacity, just as it overwhelms human working memory. The mechanism is analogous: irrelevant information competes for a finite processing resource.

### 4.4 Design Implications

If the CLT analogy holds, then context design for coding agents should follow the same principles that instructional designers use for human learners:

1. **Minimize extraneous load:** Remove all context that does not directly contribute to the current task. This means no boilerplate documentation, no verbose error logs from previous steps, no redundant examples. The JetBrains observation masking result (50% cost reduction, no performance loss) quantifies how much extraneous load typical agent sessions carry.

2. **Manage intrinsic load through decomposition:** When a task requires reasoning about many interacting elements (multiple files, complex dependency chains), break it into subtasks with fewer interactions. This is exactly the meta-prompting approach (Suzgun and Kalai, 2024), reinterpreted through CLT.

3. **Maximize germane load:** Ensure that the context budget is spent on information that directly supports the model's reasoning about the actual problem, such as relevant code, specific type signatures, test expectations, and project conventions.

4. **Avoid the split-attention effect:** In CLT, requiring learners to mentally integrate information from physically separated sources imposes extraneous load. For coding agents, this means presenting related information together (a function alongside its type definitions and callers) rather than requiring the model to mentally reconstruct connections from scattered fragments.

---

## 5. "Just Use RAG"

### 5.1 Why Naive Vector Retrieval Fails for Code

The argument that RAG solves the context problem for coding agents collides with a fundamental structural mismatch: vector similarity captures semantic overlap but destroys dependency structure.

**ByteRover's empirical study** ("Why Vector RAG Fails for Code: We Tested It on 1,300 Files," byterover.dev, 2025) tested 30 queries against a 1,300-file TypeScript codebase and quantified the failure:

| Metric | Vector RAG | Agentic Search | Delta |
|---|---|---|---|
| Token Usage | 8,775 | 72 | -99.2% |
| Precision | 0.053 | 0.117 | +2.2x |
| Recall | 0.108 | 0.097 | -10% |
| IoU (Accuracy) | 0.036 | 0.073 | +2x |

The precision of 0.053 means **94.7% of retrieved code chunks were irrelevant**. When a developer asked about updating the auth controller, vector RAG retrieved 5 files with "auth" keywords but only 1 was actually relevant; 80% noise in the context window.

Three failure modes are documented:

1. **Pattern matching vs. architecture:** Similarity-based systems conflate unrelated files that share keywords. "Error handling" matches dozens of files; only one is the error handler you need.

2. **The museum problem:** Embeddings cannot distinguish between active code and deprecated artifacts. `AuthController.ts` and `Old_Auth_Backup.ts` appear nearly identical in vector space.

3. **Context dilution:** Fixed top-K retrieval creates either 80% noise for simple queries (where 1-2 files suffice) or missing context for complex queries (where 15+ files are needed).

### 5.2 The Structural Argument

The core issue is that code is not a bag of tokens; it is a graph. Functions call other functions. Types constrain interfaces. Modules import dependencies. A class inherits behavior. These relationships are the *primary* information for understanding code, and vector embeddings obliterate them.

Research on graph-based alternatives (Polpichai et al., "Reliable Graph-RAG for Codebases: AST-Derived Graphs vs LLM-Extracted Knowledge Graphs," arXiv:2601.08773, January 2026) compared three paradigms:

- **(A) No-Graph Naive RAG:** Vector-only retrieval. Captures topical similarity but fails on multi-hop architectural reasoning (controller-to-service-to-repository chains, interface-driven wiring, inheritance).

- **(B) LLM-KB Graph RAG:** LLM-generated dependency graphs during indexing. Better structural awareness but introduces "large indexing overhead" and depends on LLM accuracy for graph construction.

- **(C) DKB (Deterministic AST-derived Knowledge Base):** Parses code via ASTs using Tree-sitter, adds labeled edges for inheritance (extends/implements) and dependency injection patterns, and performs bidirectional graph traversal at query time.

The DKB approach provides "more reliable coverage and multi-hop grounding than LLM-extracted graphs at substantially lower indexing cost." It deterministically constructs a code graph capturing the actual structural relationships, then expands context by traversing the graph (following callers, callees, type definitions, interface implementations) rather than searching by semantic similarity.

### 5.3 What Structure-Aware Retrieval Looks Like

The cAST system (arXiv:2506.15655, 2025) proposes chunking code by Abstract Syntax Tree structure rather than by fixed token counts. By chunking at function/class boundaries and maintaining syntactic integrity, cAST preserves the hierarchical structure that vector chunking destroys.

A properly structure-aware retrieval system for code would:

1. **Parse the codebase into an AST/dependency graph** using Tree-sitter or language-specific parsers.
2. **Index by structural role** (function definition, type declaration, import statement, test case) rather than by semantic embedding alone.
3. **Traverse the graph at query time** to expand context along dependency edges: given a function, retrieve its callers, callees, type definitions, and test cases.
4. **Rank by structural relevance** (distance in the dependency graph) rather than by cosine similarity.
5. **Respect module boundaries** to avoid retrieving structurally disconnected code that happens to use similar vocabulary.

The industry has already moved in this direction. As noted in MindStudio's analysis ("Is RAG Dead?", mindstudio.ai, 2025), "Top AI coding agents abandoned traditional RAG for file search and grep. Tools like Claude Code, Cursor, and Devin don't spin up a vector database to understand codebases; they run grep, read file trees, call find, and ask for specific files by name." This is a pragmatic acknowledgment that structural navigation (even via grep) outperforms semantic similarity for code.

---

## 6. The Uncomputability Argument

### 6.1 The Kolmogorov Framing

Some frame the spec-to-code gap using Kolmogorov complexity: the minimum length of a program that produces a given output. Since Kolmogorov complexity is uncomputable (proven via a diagonalization argument analogous to Berry's paradox), the argument goes that we cannot, in principle, determine the minimal specification for a given program. This would mean the entire enterprise of measuring and optimizing context is theoretically bounded by uncomputability.

The uncomputability of Kolmogorov complexity is genuine and well-established. As Vitanyi notes ("How Incomputable is Kolmogorov Complexity?", arXiv:2002.07674), "even though we have a well-defined notion, we cannot have a computable notion." Furthermore, "although Kolmogorov complexity is upper semi-computable, it cannot be approximated in general in a practically useful sense."

### 6.2 Is This a Genuine Obstacle or a Distraction?

**The case for distraction:** Kolmogorov complexity is about the absolute minimum description length of a *specific* string. For practical context engineering, we do not need the absolute minimum; we need "good enough." The relationship between Kolmogorov complexity and Shannon entropy is clarifying here. As established in the classical theory (Vitanyi and Li, "Shannon Information and Kolmogorov Complexity," CWI Technical Report, 2004):

- For sequences typical according to a source, Kolmogorov complexity is asymptotically close to Shannon code length.
- Expected Kolmogorov complexity over a source distribution approximates Shannon entropy.

Since LLMs are trained on distributions (not specific strings), Shannon information theory provides the relevant framework. We can compute cross-entropy, estimate mutual information, and measure the conditional entropy H(Code|Spec) using standard methods. The uncomputability of Kolmogorov complexity for individual strings is, in this view, a theoretical curiosity that does not impede practical optimization.

**The case for genuine obstacle:** The relationship between Shannon and Kolmogorov breaks down precisely where it matters most: for *atypical* sequences. Novel code (custom algorithms, domain-specific logic) is by definition atypical with respect to the training distribution. For these sequences, the Shannon framework (which averages over the distribution) may underestimate the actual complexity, while Kolmogorov complexity (which addresses the specific string) captures the true difficulty.

Pan et al. ("Understanding LLM Behaviors via Compression," arXiv:2504.09597, 2025) bridge this gap using the Kolmogorov Structure Function, interpreting "LLM compression as a two-part coding process" that reveals "how LLMs acquire and store information across increasing model and data scales, from pervasive syntactic patterns to progressively rarer knowledge elements." This suggests a hierarchy: common patterns (well-captured by Shannon) at the base, rare knowledge elements (where Kolmogorov diverges from Shannon) at the top.

### 6.3 The Practical Tradeoffs

| Dimension | Shannon Framework | Kolmogorov Framework |
|---|---|---|
| Computability | Computable from data | Uncomputable in general |
| What it measures | Average behavior over a distribution | Specific string complexity |
| Where it works well | Common patterns, typical code | Novel algorithms, unique implementations |
| Practical tools | Cross-entropy, mutual information, KL divergence | Approximations via compression (gzip, LLM perplexity) |
| Failure mode | Underestimates atypical sequence difficulty | Cannot be exactly computed |

**The pragmatic synthesis:** Use Shannon information theory as the working framework for context engineering (it is computable, gives good estimates for most code, and supports optimization). Use Kolmogorov complexity as a conceptual warning flag: when the code being generated is genuinely novel (low probability under the training distribution), Shannon-derived estimates will be optimistic, and additional context provision is warranted.

Pan et al.'s Syntax-Knowledge model provides a practical bridge: LLMs first compress pervasive syntactic patterns (high Shannon efficiency), then progressively rarer knowledge elements (where Shannon underestimates and Kolmogorov diverges). Context engineering should follow the same hierarchy: syntactic conventions require minimal context (the prior handles them); rare domain knowledge requires maximal context (the prior is insufficient).

### 6.4 Resource-Bounded Kolmogorov Complexity

There is a middle path. Resource-bounded Kolmogorov complexity restricts the computation to polynomial (or other bounded) time. This yields a notion that is "merely" exponentially hard to compute rather than uncomputable, and recent work (arXiv:2501.06802, 2025) shows that "theoretically there exist total recursive functions or transformer neural networks such that they can approximate conditional Kolmogorov complexity."

This suggests that LLMs themselves may serve as practical approximations of the Kolmogorov compressor, bounded by their computational budget (context length, parameter count, inference steps). The quality of this approximation varies by task: excellent for common patterns (where the training distribution is dense), poor for novel logic (where the distribution is sparse).

---

## 7. Synthesis: The Contrarian Map

Pulling together all six contrarian perspectives yields a coherent picture that is more nuanced than either the "context is everything" or "priors are enough" extremes:

### 7.1 What the Evidence Actually Says

1. **Context optimization matters, but only for novel tasks.** For common patterns, the prior is sufficient (ETH Zurich AGENTS.md study, parametric knowledge research). For novel logic, context is essential. The transition is bimodal, not gradual.

2. **Bigger windows make curation *more* important, not less.** Every model degrades with context length (Chroma 2025, Liu et al. 2024). The quadratic attention cost means uncurated long context is strictly worse than curated short context.

3. **Fresh Eyes works, but for the wrong reason.** The 17.1% advantage (Suzgun and Kalai, 2024) is primarily about preventing context rot, not about freshness per se. A properly pruned incremental approach should match it while retaining useful continuity.

4. **Cognitive load theory provides the correct design framework.** The intrinsic/extraneous/germane decomposition maps directly onto transformer attention constraints (Kim et al., NeurIPS 2024). Minimize extraneous context; decompose intrinsic complexity; maximize the fraction of context that is genuinely task-relevant.

5. **Naive RAG is worse than grep for code.** Vector similarity destroys dependency structure (ByteRover, 94.7% irrelevance rate). Structure-aware retrieval via AST/dependency graphs (Polpichai et al. 2026, cAST 2025) is the correct approach, and the industry has already moved to structural navigation.

6. **Shannon beats Kolmogorov for practical purposes.** Uncomputability of Kolmogorov complexity is a theoretical concern, not a practical obstacle. Shannon information theory provides computable, useful estimates for context optimization. The caveat: Shannon underestimates difficulty for genuinely novel code, where additional context investment is warranted.

### 7.2 The Uncomfortable Implication

The strongest contrarian position is not that context engineering is worthless but that it is *misallocated*. Most context engineering effort goes into common tasks where the prior is already sufficient, while novel tasks (where context is genuinely critical) receive generic treatment. A system that could reliably classify tasks by novelty and allocate context accordingly would outperform both the "max context" and "minimal context" approaches.

The ETH Zurich result, where adding context files *hurt* performance by 0.5-2% while increasing costs by 20-23%, is a direct consequence of this misallocation. The context files added information the model already knew, creating distraction for common tasks without helping with the novel ones.

### 7.3 Design Principles from the Contrarian View

1. **Classify before contextualizing.** Estimate the novelty of the task before deciding how much context to provide. Common patterns get minimal context (project conventions only); novel logic gets aggressive context provision.

2. **Curate, don't accumulate.** Every token added to context must justify its inclusion against the attention dilution cost. The 50% reduction from JetBrains' observation masking is the baseline for any production system.

3. **Navigate structure, don't search semantics.** For code, traverse the dependency graph rather than searching by similarity. The shift from vector RAG to structural tools (grep, AST parsing, file tree navigation) reflects a correct understanding of code's graph-structured nature.

4. **Enforce cognitive load budgets.** Treat context length not as a capacity to fill but as a budget to spend. Apply Sweller's principle: extraneous load (irrelevant context) directly reduces performance on intrinsic load (the actual task).

5. **Prefer fresh subtasks to long sessions.** When sessions exceed ~35 minutes or context exceeds ~50K tokens, the accumulated degradation outweighs the continuity benefits. Checkpoint and restart with curated summaries.

---

## Sources

- [Liu et al., "Lost in the Middle" (TACL 2024)](https://aclanthology.org/2024.tacl-1.9/)
- [Chroma, "Context Rot" (2025)](https://www.trychroma.com/research/context-rot)
- [Suzgun & Kalai, "Meta-Prompting" (ICLR 2024)](https://arxiv.org/abs/2401.12954)
- [Gloaguen et al., "Evaluating AGENTS.md" (arXiv 2026)](https://arxiv.org/html/2602.11988v1)
- [Kim et al., "Self-Attention Limits Working Memory Capacity" (NeurIPS 2024)](https://arxiv.org/abs/2409.10715)
- [Guo et al., "Cognitive Overload Attack" (arXiv 2024)](https://arxiv.org/html/2410.11272v1)
- [ByteRover, "Why Vector RAG Fails for Code" (2025)](https://www.byterover.dev/blog/why-vector-rag-fails-for-code-we-tested-it-on-1-300-files)
- [Polpichai et al., "Reliable Graph-RAG for Codebases" (arXiv 2026)](https://arxiv.org/abs/2601.08773)
- [cAST: Structural Chunking via AST (arXiv 2025)](https://arxiv.org/html/2506.15655v2)
- [Pan et al., "Understanding LLM Behaviors via Compression" (arXiv 2025)](https://arxiv.org/abs/2504.09597v6)
- [Vitanyi, "How Incomputable is Kolmogorov Complexity?" (arXiv 2020)](https://arxiv.org/pdf/2002.07674)
- [Vitanyi & Li, "Shannon Information and Kolmogorov Complexity" (CWI)](https://homepages.cwi.nl/~paulv/papers/info.pdf)
- [Sweller, "Cognitive Load During Problem Solving" (Cognitive Science, 1988)](https://onlinelibrary.wiley.com/doi/10.1207/s15516709cog1202_4)
- [JetBrains, "Cutting Through the Noise" (NeurIPS DL4Code 2025)](https://blog.jetbrains.com/research/2025/12/efficient-context-management/)
- [Spotify Engineering, "Context Engineering: Honk Part 2" (2025)](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)
- [MindStudio, "Is RAG Dead?" (2025)](https://www.mindstudio.ai/blog/is-rag-dead-what-ai-agents-use-instead)
- [Google Research, "Deeper Insights into RAG: Sufficient Context" (2024)](https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/)
- [Longpre et al., "Task Matters: Knowledge Requirements Shape LLM Responses" (arXiv 2025)](https://arxiv.org/html/2506.06485)
- [Unifying Scaling Laws via Conditional Kolmogorov Complexity (arXiv 2025)](https://arxiv.org/html/2501.06802v1)
- [Alignment Forum, "Beyond Kolmogorov and Shannon"](https://www.alignmentforum.org/posts/kqxEJkq5Big9nNKxy/beyond-kolmogorov-and-shannon)
- [Morph, "Context Rot: Why LLMs Degrade as Context Grows"](https://www.morphllm.com/context-rot)
