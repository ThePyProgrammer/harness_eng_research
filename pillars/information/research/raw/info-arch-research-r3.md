# Harness Engineering and Context Management Practices

## Research Dimension: How Production Coding Agent Harnesses Manage Context

---

## 1. Anthropic's Context Engineering Framework (September 2025)

### Source: Anthropic Engineering, "Effective Context Engineering for AI Agents" (Sep 29, 2025)

Anthropic's engineering team published a comprehensive guide reframing the discipline from "prompt engineering" (crafting isolated instructions) to "context engineering" (curating optimal token sets during inference). The guiding principle: **"Find the smallest set of high-signal tokens that maximize the likelihood of some desired outcome."**

### The Four Components of Context

Rather than a formally labeled three-tier hierarchy, Anthropic organizes context into four functional components, each with distinct engineering considerations:

1. **System Prompts**: Static instructions establishing agent identity and behavior. Anthropic recommends working at the "right altitude," balancing between overly prescriptive step-by-step logic and vaguely aspirational guidance. Prompts should be organized with XML tags (`<background_information>`, `<instructions>`) or Markdown headers, striving for the "minimal set of information that fully outlines expected behavior." The advice: start with a minimal prompt on the best available model, then iterate based on observed failures rather than designing comprehensive prompts upfront.

2. **Tools**: The agent's interface to external state. Tools must be "self-contained, robust to error, and extremely clear on intended use." Anthropic warns against bloated tool sets, advocating for a "minimal viable set of tools" with clear decision boundaries and no functional overlap. Tool descriptions consume context tokens; every unnecessary tool is a tax on the agent's attention budget.

3. **Examples (Few-Shot)**: Described as "the pictures worth a thousand words" for LLMs. Anthropic recommends 3-5 diverse, canonical examples showing expected behavior rather than exhaustive edge case coverage.

4. **Message History**: The dynamic, growing portion of context subject to curation and compaction. This is where context management becomes critical for long-horizon tasks.

### Context Retrieval Strategies

Anthropic distinguishes two retrieval paradigms:

- **Pre-inference (embedding-based)**: Traditional RAG, loading relevant context before the agent acts.
- **Just-in-time (agentic search)**: Agents autonomously discover and load context during execution using tools, following a "progressive disclosure" pattern where lightweight identifiers are loaded first, with full data fetched only when needed.

The recommended approach is hybrid: pre-load essential architectural context, then let agents pull additional detail as needed through tool calls.

### Long-Horizon Context Management: Three Techniques

For tasks spanning many tool calls or multiple sessions, Anthropic identifies three complementary techniques:

**Compaction**: Summarize conversations approaching context limits, then reinitiate with the compressed summary. This is the "first lever" for maintaining coherence. Key guidance: preserve architectural decisions, unresolved bugs, and implementation details; discard redundant tool outputs and duplicate messages. Tool result clearing (replacing old tool outputs with placeholders) is the "safest, lightest touch" form of compaction. Anthropic advises tuning carefully on complex traces, maximizing recall first, then improving precision.

**Structured Note-Taking (Agentic Memory)**: Agents write persistent notes outside the context window (NOTES.md files, to-do lists, strategic maps) that can be pulled back in at later times. This decouples working memory from the context window's token budget. Anthropic reports that Claude maintains "tallies, maps, strategic notes across thousands of steps" using this pattern.

**Sub-Agent Architectures**: Specialized sub-agents handle focused tasks with clean context windows, returning condensed summaries of 1,000 to 2,000 tokens to the coordinating agent. This achieves separation of concerns: detailed exploration context stays isolated from the lead agent's planning context.

### The "Context Rot" Problem

Anthropic explicitly names "context rot," the phenomenon where accumulated low-quality tokens degrade model performance. They frame context as a "precious, finite resource" with an "attention budget" that follows a performance gradient rather than a hard cliff. The transformer's n-squared pairwise attention mechanism means every additional token interacts with every other token, making bloat exponentially costly.

**Citation**: Anthropic Engineering. "Effective Context Engineering for AI Agents." anthropic.com/engineering/effective-context-engineering-for-ai-agents (Sep 29, 2025).

---

## 2. ETH Zurich: AGENTS.md Files Mostly Do Not Help (February 2026)

### Source: Gloaguen, Mundler, Muller, Raychev, Vechev. "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?" arXiv:2602.11988 (Feb 12, 2026)

This ETH Zurich / LogicStar.ai study is the first rigorous empirical evaluation of whether repository-level context files (AGENTS.md, CLAUDE.md) actually improve coding agent performance, a practice that has become near-universal in production harnesses.

### Experimental Design

Two complementary benchmarks:

- **SWE-bench Lite**: 300 tasks from 11 popular Python repositories (no developer context files present).
- **AGENTbench**: 138 novel instances from 12 niche repositories that had developer-written context files.

Models and agents tested: Claude Code with Sonnet-4.5, Codex with GPT-5.2 and GPT-5.1 mini, Qwen Code with Qwen3-30b-coder.

### Core Results

| Context File Type | Avg. Success Rate Change | Avg. Cost Change |
|---|---|---|
| Human-written | +4% | +19% |
| LLM-generated | -3% | +20%+ |

Human-written context files produced a marginal 4% average improvement while increasing inference costs by up to 19%. LLM-generated context files actively reduced success rates by 3% on average while increasing costs by over 20%.

### Why LLM-Generated Files Hurt

The paper identifies three mechanisms of harm:

1. **Redundancy**: LLM-generated context files largely duplicated existing repository documentation (READMEs, docstrings, inline comments) rather than adding novel guidance. The agent received the same information twice, wasting token budget.

2. **Unnecessary requirements**: Context files encouraged "broader exploration (e.g., more thorough testing and file traversal)," increasing computational overhead without improving outcomes. Agents took 2.45 and 3.92 additional steps per task on the two benchmarks respectively.

3. **Increased cognitive load**: Agents spent 22% more reasoning tokens when following context file instructions, indicating the LLM perceived greater task complexity even when the underlying task was unchanged.

### Why Human-Written Files Only Marginally Help

Human-written documentation only outperformed LLM variants when existing repository documentation was removed, suggesting their primary value lies in supplementing sparse documentation, not in adding a new layer of guidance atop already-documented codebases.

### Practical Recommendation

The authors recommend: "omit LLM-generated context files for the time being" and ensure that "human-written context files should describe only minimal requirements," focusing exclusively on repository-specific tooling and essential setup information rather than comprehensive overviews.

This result directly challenges the widespread practice of auto-generating context files and aligns with the broader principle that more context is not better context.

**Citation**: Gloaguen, T., Mundler, N., Muller, M., Raychev, V., & Vechev, M. (2026). "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?" arXiv:2602.11988.

---

## 3. JetBrains: The Complexity Trap (December 2025, NeurIPS DL4Code Workshop)

### Source: JetBrains Research, "The Complexity Trap: Simple Observation Masking Is as Efficient as LLM Summarization for Agent Context Management" (NeurIPS 2025, DL4Code Workshop)

This study from JetBrains Research (building on work from their Junie agent) provides the most rigorous head-to-head comparison of context management strategies for coding agents.

### What Is Observation Masking?

Observation masking replaces old tool outputs (environment observations) with placeholders while preserving the full action and reasoning history. The agent remembers *what it did and why* without carrying the full output of every prior tool call. In their configuration, the latest 10 turns remain fully visible; earlier turns retain only action and reasoning with observations masked.

### What Is LLM Summarization?

A separate language model compresses older interaction turns into brief summaries, reducing "the resolution of all three parts of the involved turns by essentially compressing the long history." Summarization processes 21-turn batches while retaining the most recent 10 turns uncompressed.

### Experimental Setup

- **Benchmark**: SWE-bench Verified, 500 instances per test configuration.
- **Models**: Qwen3-Coder 480B (open-weight) and Gemini 2.5 Flash (proprietary), both thinking and non-thinking modes.
- **Agent runs**: Up to 250 turns per task.

### Key Results

| Metric | Observation Masking | LLM Summarization |
|---|---|---|
| Cost reduction vs. unmanaged | 52% cheaper | ~45% cheaper |
| Solve rate change (Qwen3 480B) | +2.6% vs. unmanaged | ~comparable |
| Run length effect | Baseline | 15% longer |
| Additional API cost for summarization | None | 7%+ of total cost |

In four out of five test settings, agents using observation masking paid less per problem and performed as well or better than summarization.

### Why LLM Summarization Causes Trajectory Elongation

The most striking finding: with Gemini 2.5 Flash, summarization extended agent runs to 52 turns, a full 15% longer than masking. With Qwen3-Coder 480B, summarized runs were about 15% longer than raw history and 13% longer than masking.

The researchers hypothesize that summaries "hide signs indicating that the agent should already stop trying to solve the problem." Raw tool outputs contain failure signals (error messages, repeated patterns, lack of progress) that an agent can recognize as indicators to abandon an approach. LLM-generated summaries smooth over these signals, encouraging the agent to keep going past the point of diminishing returns.

### The Hybrid Approach

Combining both techniques (observation masking as primary defense, selective summarization on older masked content) reduced costs by 7% vs. pure observation masking and 11% vs. pure summarization, while maintaining the +2.6% solve rate improvement.

### Architectural Implication

Simpler, deterministic context management (observation masking) outperforms expensive, non-deterministic context management (LLM summarization). This is a recurring theme: structural mechanisms beat generative mechanisms for context control.

**Citation**: JetBrains Research. "The Complexity Trap: Simple Observation Masking Is as Efficient as LLM Summarization for Agent Context Management." Fourth Deep Learning for Code Workshop, NeurIPS 2025. arXiv:2508.21433.

---

## 4. Factory.ai: Why Naive Vector Retrieval Destroys Code Structure

### Source: Factory.ai, "The Context Window Problem: Scaling Agents Beyond Token Limits"

Factory.ai's analysis targets the structural failure mode of embedding-based retrieval applied to code, arguing that standard RAG techniques designed for natural language documents are fundamentally mismatched with software's structural nature.

### The Structural Destruction Argument

Factory identifies three specific failures of naive vector retrieval for code:

**Flattening of structure**: "Code is not merely text. It is a web of dependencies, inheritance hierarchies, and architectural patterns. Vector embeddings flatten this rich structure into undifferentiated chunks, destroying critical relationships between components." When a codebase is chunked and embedded, the dependency graph, call hierarchy, and module boundaries are lost entirely.

**Multi-hop reasoning failure**: Software understanding requires tracing chains of dependencies. A developer debugging a bug starts with a small set of potentially relevant files, then follows references, imports, definitions, and call graphs to discover the full relevant set. Vector search returns disconnected fragments "without the connective tissue" needed for this traversal. The retrieval process is single-hop by nature; code comprehension is inherently multi-hop.

**Active harm from noise**: "Flooding an LLM with dozens of irrelevant files actively harms its reasoning capabilities." This connects to the attention budget concept from Anthropic's framework: irrelevant retrieved chunks do not merely waste tokens; they degrade the model's ability to attend to genuinely relevant content.

### Scale Reality Check

- Frontier models offer 1 to 2 million token context windows.
- A typical enterprise monorepo spans several million tokens.
- Factory cites Chroma's study of 18 LLMs finding that "models do not use their context uniformly; instead, their performance grows increasingly unreliable as input length grows."

Even with million-token windows, naive context stuffing collides with a hard wall at enterprise scale.

### Factory's Five-Layer Context Stack

Instead of raw retrieval, Factory proposes a layered architecture treating context as a scarce resource:

1. **Repository Overviews**: Architectural summaries (project structure, key packages, build commands, core files, directory tree) injected at session start. This gives the LLM architectural orientation that would otherwise cost thousands of exploratory tokens.
2. **Semantic Search**: Code-tuned embeddings for initial file candidate identification (acknowledging this is useful as a first step, not a complete solution).
3. **File System Commands**: Targeted retrieval with line-number specificity, enabling precise extraction rather than whole-file inclusion.
4. **Enterprise Integrations**: Sentry, Notion, Datadog, Slack; connecting code context to operational and organizational context.
5. **Hierarchical Memory**: User and organizational preference persistence across sessions.

The key insight: vector retrieval is useful as one layer in a multi-layer system, not as the primary or sole retrieval mechanism. Code comprehension requires structural navigation tools (AST traversal, call graph walking, import chain following) that embedding similarity cannot provide.

**Citation**: Factory.ai. "The Context Window Problem: Scaling Agents Beyond Token Limits." factory.ai/context-window-problem.

---

## 5. Existing Harness Implementations: Structural Context Management Patterns

### 5.1 GSD (Get Shit Done): Fresh 200K Context Per Task

**Source**: gsd-build/get-shit-done (GitHub); GSD documentation

GSD implements one of the most aggressive context isolation patterns in production harnesses. Its core architectural principle: every task, every research phase, every planning step gets a clean 200K-token context window.

**Dispatch-Time Pre-loading**: Rather than letting agents discover context through exploration, GSD pre-loads the dispatch prompt with inlined task plans, slice plans, prior task summaries, dependency summaries, roadmap excerpts, and a decisions register. The LLM starts with everything it needs instead of spending tool calls reading files.

**Thin Orchestrator Pattern**: Command workflows maintain minimal context (15-30% utilization) and spawn specialized subagents with fresh 200K-token contexts for heavy operations. The orchestrator's context window stays at 30-40% usage even while complete phases (research, planning, parallel execution, verification) run in subagent contexts.

**Context Rot Prevention**: By design, no accumulated garbage persists across tasks. Each subagent starts clean, works, returns a condensed summary, and its full context is discarded.

### 5.2 RAPID: Git Worktree Isolation

**Source**: RAPID harness documentation

RAPID enforces filesystem-level isolation through git worktrees: one task, one worktree, one agent. Each set (unit of work) gets its own isolated worktree with a scoped CLAUDE.md containing only the context relevant to that specific set.

**Structural Isolation Properties**:
- Agents cannot accidentally read or modify files from other tasks.
- Each worktree has its own branch, preventing merge conflicts during parallel execution.
- Context is physically scoped by the filesystem, not by prompt instructions.

### 5.3 Spotify's Honk: Static Prompts Over Dynamic Discovery

**Source**: Spotify Engineering, "Background Coding Agents: Context Engineering (Honk, Part 2)" (Nov 2025)

Spotify's internal coding agent (Honk) has processed approximately 50 migrations with thousands of AI-generated PRs merged into production across thousands of repositories. Their context management philosophy prioritizes predictability:

**Static over dynamic**: "We prefer to have larger static prompts, which are easier to reason about. You can version-control the prompts, write tests, and evaluate their performance." Users must "condense relevant context into the prompt up front" rather than relying on agent exploration.

**Constrained tool set**: Strictly limited tool access (allowlisted bash commands, custom verify tool, limited git operations). Notably absent: code search and documentation tools. This forces all relevant context into the prompt, eliminating unpredictable context acquisition.

**Six prompt principles**: (1) Tailor to the agent's strengths, (2) state preconditions explicitly, (3) use concrete code examples, (4) define verifiable goals through tests, (5) make single changes per task, (6) solicit agent feedback on missing prompt information.

### 5.4 Anthropic's Long-Running Harness: Incremental Progress with Artifacts

**Source**: Anthropic Engineering, "Effective Harnesses for Long-Running Agents" (2025)

Anthropic's own harness for multi-session development uses a two-agent system:

**Initializer Agent**: Creates the development environment, generates an `init.sh` script, and bootstraps a `claude-progress.txt` file for tracking work history.

**Coding Agent**: Reads `claude-progress.txt` and git logs at session start to reconstruct state. Each session makes incremental progress with clean git commits and structured progress updates.

**Evolution**: Anthropic later evolved to a three-agent system (planner, generator, evaluator) inspired by GANs. The evaluator uses Playwright MCP to navigate live pages and take screenshots, addressing the self-evaluation bias problem where "agents tend to respond by confidently praising the work, even when, to a human observer, the quality is obviously mediocre."

With Opus 4.5, Anthropic reported being able to drop explicit context resets entirely, running agents as one continuous session with automatic compaction handling context growth.

### 5.5 OpenAI Codex: Sandbox Isolation with Minimal AGENTS.md

**Source**: OpenAI Engineering, "Harness Engineering: Leveraging Codex in an Agent-First World" (2025)

Codex operates within a secure, isolated container with internet access disabled during task execution. Each task gets its own ephemeral environment with logs, metrics, and traces that are torn down on completion.

**Context philosophy**: A short AGENTS.md file (roughly 100 lines) serves "primarily as a map, with pointers to deeper sources of truth elsewhere." This aligns with the ETH Zurich finding that minimal context files outperform comprehensive ones.

**Scale evidence**: From an empty repository to approximately one million lines of code in five months, with roughly 1,500 PRs opened and merged by a team of just three engineers driving Codex.

### 5.6 HumanLayer ACE-FCA: Frequent Intentional Compaction

**Source**: HumanLayer, "Advanced Context Engineering for Coding Agents" (GitHub, 2025)

The ACE-FCA framework structures the entire development workflow around context utilization, targeting 40-60% context window utilization as the optimal operating range.

**Three-phase workflow**: Research (discover relevant files and information flows) produces structured research documents. Plan (outline exact steps with precise file locations and verification procedures) produces actionable plans. Implement (execute plan phase-by-phase, compacting status back into plan after each verified phase).

**Context quality hierarchy**: (1) Correctness (invalid information damages downstream work exponentially), (2) Completeness (missing critical details), (3) Size reduction (minimize noise).

**Human leverage inversion**: Rather than reviewing implementations, human effort concentrates on validating research and plans, since downstream errors compound multiplicatively through implementation phases.

**Demonstrated results**: Fixing bugs in 300K LOC Rust codebases by non-expert developers; shipping 35K LOC features in 7 hours.

### 5.7 OPENDEV: Dual-Agent with Workload-Specialized Model Routing

**Source**: Bui, N. D. Q. "Building Effective AI Coding Agents for the Terminal." arXiv:2603.05344 (Mar 2026)

OPENDEV, an open-source Rust-based terminal agent, implements a dual-agent architecture separating planning from execution with workload-specialized model routing. Work is organized into concurrent sessions, each composed of multiple specialized sub-agents executing typed workflows (Execution, Thinking, Compaction) independently bound to user-configured LLMs. This enables fine-grained model selection with cost, latency, and capability trade-offs optimized per workflow type.

The system implements lazy tool discovery (tools are not loaded until needed, reducing baseline context cost) and adaptive context compaction that progressively reduces older observations.

---

## 6. Structural Enforcement vs. Instructional Enforcement

A recurring theme across all sources is the superiority of structural mechanisms (tool permissions, filesystem isolation, sub-agent boundaries) over instructional mechanisms (system prompt directives, CRITICAL warnings, behavioral instructions) for controlling agent behavior.

### Evidence from HumanLayer

HumanLayer's "Skill Issue" post explicitly names this distinction. Rather than adding "CRITICAL: always do XYZ" to system prompts, they engineer the harness to make correct behavior inevitable through configuration. Their six configuration levers (system prompts, tools, context management, sub-agents, hooks, back-pressure) are predominantly structural rather than instructional.

Specific example: instead of instructing the agent not to run the full test suite (which would be ignored under context pressure), they configure hooks that run tests silently on success and surface only failures. The agent never sees passing test output; it physically cannot flood its own context with 4,000 passing test results.

### Evidence from ETH Zurich (arXiv:2602.11988)

The AGENTS.md study provides indirect evidence: adding more instructions to the agent's context (even human-written ones) produced only marginal gains (+4%) while increasing costs (+19%) and reasoning tokens (+22%). The instruction-based approach to shaping agent behavior has sharply diminishing returns.

### Evidence from JetBrains

Observation masking is a structural mechanism (deterministic placeholder replacement at the harness level) while LLM summarization is a generative mechanism (asking another LLM to process context). The structural approach achieved better solve rates (+2.6%), lower costs (52% cheaper), and shorter runs (15% less trajectory elongation) than the generative approach.

### Evidence from Sandbox Architectures

OpenAI Codex disables internet access during task execution at the container level, not via system prompt instruction. RAPID isolates agents in separate git worktrees at the filesystem level, not via instructions to "only modify files in your assigned set." GSD spawns fresh 200K-token contexts per task at the SDK level, not via instructions to "forget previous context."

### Evidence from Spotify

Spotify's Honk uses allowlisted bash commands, a constrained tool set with no code search or documentation tools, and a custom verify tool. Rather than instructing the agent "do not use arbitrary bash commands," the tool simply does not exist in the agent's environment. The constraint is architectural, not instructional.

### The Underlying Principle

System prompt compliance is learned behavior (from supervised and reinforcement learning), making it "susceptible to incidental errors or adversarial manipulation." Structural enforcement operates at the execution layer, where constraints are physically impossible to bypass regardless of what the LLM generates.

This maps to a well-known principle in systems engineering: prefer mechanisms over policies. A filesystem permission is a mechanism; a documented coding standard is a policy. Mechanisms are enforced by the system; policies are enforced by participants' compliance.

---

## 7. Cross-Cutting Patterns and Synthesis

### Pattern 1: Context as Scarce Resource

Every production harness treats context tokens as a budget to be allocated, not a bucket to be filled. GSD maintains 30-40% orchestrator utilization. ACE-FCA targets 40-60%. HumanLayer warns against exceeding the "idiot zone." Factory.ai frames their entire architecture around context scarcity. Anthropic says to treat context as "precious, finite."

### Pattern 2: Fresh Context Over Accumulated Context

The dominant pattern across harnesses is resetting context rather than managing accumulated context:

- GSD: fresh 200K per task
- RAPID: isolated worktree per set
- Codex: ephemeral container per task
- Anthropic: sub-agents with clean context windows returning 1,000-2,000 token summaries
- JetBrains: observation masking effectively resets old tool output context

This aligns with the sub-agent pattern described by Simon Willison and others: "each invocation starts with a fresh context," with runtime isolation from "schema filtering at build time and message_history=None at execution time."

### Pattern 3: Compaction Artifacts Over Conversational Memory

Rather than carrying forward raw conversation history, production harnesses produce structured artifacts:

- Anthropic: `claude-progress.txt` and feature list JSON
- GSD: task summaries, dependency summaries, roadmap excerpts
- ACE-FCA: structured research documents and actionable plans
- Spotify: version-controlled static prompts

These artifacts serve as compressed, curated state that can be loaded into a fresh context without the noise of the conversation that produced them.

### Pattern 4: Minimal Instruction, Maximum Structure

The ETH Zurich finding (comprehensive AGENTS.md files hurt more than help) is confirmed by production practice:

- OpenAI Codex: ~100-line AGENTS.md serving as a "map" with pointers
- HumanLayer: CLAUDE.md under 60 lines
- Spotify: no dynamic context discovery; everything pre-loaded and static
- ETH Zurich recommendation: "only minimal requirements"

### Pattern 5: Success Should Be Silent

HumanLayer coined this principle, but it appears across harnesses:

- Spotify's verify tool only surfaces failures
- GSD's subagents return condensed results, discarding intermediate success
- OpenAI Codex's ephemeral observability stack is torn down on completion
- JetBrains' observation masking replaces old successful tool outputs with placeholders

The principle: passing results consume context tokens without adding decision-relevant information. Only failures require the agent's attention.

---

## Key Takeaways

1. **More context is not better context.** The ETH Zurich study, JetBrains' observation masking results, and Factory.ai's analysis all converge on the same finding: adding more tokens to context actively degrades performance past a threshold.

2. **Structural enforcement dominates instructional enforcement.** Every production harness that achieves reliability at scale does so through architectural constraints (sandboxes, worktrees, sub-agent boundaries, tool restrictions), not through increasingly emphatic system prompt directives.

3. **Fresh context beats managed context.** The dominant pattern is spawning new context windows rather than attempting to maintain coherence in a single growing window. Compaction is a fallback for single-session work, not the primary strategy.

4. **Context management is deterministic, not generative.** JetBrains showed that simple observation masking (deterministic placeholder replacement) outperforms LLM summarization (generative compression) while being cheaper and faster. The trend favors mechanical context control over AI-assisted context control.

5. **Artifacts bridge context resets.** The practical solution to fresh-context-per-task is structured artifacts (progress files, plan documents, research summaries) that compress the essential state from a completed context window into a loadable format for the next one.

---

## Sources

- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Sep 2025)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (2025)
- [Anthropic: Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) (2025)
- [Gloaguen et al.: Evaluating AGENTS.md (arXiv:2602.11988)](https://arxiv.org/abs/2602.11988) (Feb 2026)
- [JetBrains Research: The Complexity Trap (arXiv:2508.21433)](https://arxiv.org/abs/2508.21433) (NeurIPS DL4Code 2025)
- [JetBrains Blog: Cutting Through the Noise](https://blog.jetbrains.com/research/2025/12/efficient-context-management/) (Dec 2025)
- [Factory.ai: The Context Window Problem](https://www.factory.ai/context-window-problem)
- [HumanLayer: Skill Issue, Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [HumanLayer: Advanced Context Engineering for Coding Agents (ACE-FCA)](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)
- [Spotify Engineering: Background Coding Agents, Context Engineering (Honk Part 2)](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)
- [OpenAI: Harness Engineering, Leveraging Codex](https://openai.com/index/harness-engineering/)
- [Bui: Building AI Coding Agents for the Terminal (arXiv:2603.05344)](https://arxiv.org/abs/2603.05344) (Mar 2026)
- [GSD: Get Shit Done](https://github.com/gsd-build/get-shit-done)
- [Simon Willison: Subagents, Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/subagents/)
