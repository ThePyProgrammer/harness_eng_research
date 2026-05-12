# Axis 5: Context Window Management, Memory & Cross-Session State

## Question
How do harnesses manage context window limits, implement long-term memory, handle conversation compression, and maintain state across sessions? What memory architectures exist (RAG, summarization, structured stores, vector DBs)?

## Findings

### 1. The Core Problem: Context Rot and Token Budgets

Every agent harness confronts the same fundamental constraint: LLMs are stateless, context windows are finite, and as conversations grow, model performance degrades. JetBrains research found that "as the context grows, language models often struggle to make good use of all the information" and that both observation masking and summarization achieved over 50% cost reduction compared to unmanaged context baselines. [Cutting Through the Noise: Smarter Context Management for LLM-Powered Agents](https://blog.jetbrains.com/research/2025/12/efficient-context-management/) (Confidence: HIGH)

Spotify's engineering team documented "context rot" as a significant production concern: "the systematic degradation of model recall as tokens accumulate -- as agent conversations hit 100K+ tokens, they forget system prompts and lose track of user preferences." [Context Engineering (Honk, Part 2) | Spotify Engineering](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2/) (Confidence: HIGH)

### 2. Within-Session Context Management Strategies

#### 2.1 Conversation Compaction / Summarization

**Claude Code** triggers auto-compaction when the context window reaches approximately 95% capacity. Clears older tool outputs first, then summarizes. `/compact` with optional focus argument. CLAUDE.md content fully survives compaction. [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) / [Compaction - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction) (Confidence: HIGH)

**Anthropic's Compaction API** (beta `compact-2026-01-12`) provides server-side compaction as a first-class API feature. Configurable trigger threshold, custom compaction prompts. [Compaction - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction) (Confidence: HIGH)

**Cline** uses `maxAllowedSize = Math.max(contextWindow - 40_000, contextWindow * 0.8)`. Auto Compact at ~80% creates comprehensive summary. Previously 30% of system prompt was consumed by MCP server instructions; now replaced with a `load_mcp_documentation` tool that retrieves ~8,000 tokens only when needed. [Context Management - Cline](https://docs.cline.bot/prompting/understanding-context-management) (Confidence: HIGH)

**OpenAI Codex CLI** compacts conversations once tokens exceed a threshold. Memory system runs a two-phase pipeline: Phase 1 extracts structured `raw_memory` and `rollout_summary` into SQLite; Phase 2 spawns a consolidation sub-agent that updates `MEMORY.md`, `memory_summary.md`, and `skills/` directories. [Memory System | openai/codex | DeepWiki](https://deepwiki.com/openai/codex/3.7-memory-system) (Confidence: HIGH)

#### 2.2 Observation Masking

JetBrains identified observation masking as surprisingly effective: preserves reasoning and action history while replacing older environment observations with brief placeholders. In four of five settings, "agents using observation masking paid less per problem and often performed better," boosting solve rates by 2.6% while being 52% cheaper. LLM summarization, by contrast, caused agents to run 13-15% longer. [Cutting Through the Noise](https://blog.jetbrains.com/research/2025/12/efficient-context-management/) (Confidence: HIGH)

#### 2.3 Redundant Content Elimination

**Cline** removes outdated file versions from context -- when users read the same file multiple times, framework removes older reads, leaving only latest version. Prioritized over truncating messages to maximize prompt caching efficiency. [Inside Cline's Framework](https://cline.bot/blog/inside-clines-framework-for-optimizing-context-maintaining-narrative-integrity-and-enabling-smarter-ai) (Confidence: HIGH)

#### 2.4 Subagent Context Isolation

**Claude Code** subagents get fresh, completely separate context windows. Their work does not bloat the main conversation's context. [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) (Confidence: HIGH)

**GSD** takes this further with "fresh context windows per task" and "fractal memory that scales across sessions." [Taming the AI Brain: How GSD Tackles Claude Code's Memory Woes](https://www.oreateai.com/blog/taming-the-ai-brain-how-gsd-tackles-claude-codes-memory-woes/39a8da0698bc1ae4d87a18f542439eb1) (Confidence: MEDIUM)

### 3. Codebase Indexing and Smart Context Selection

#### 3.1 Aider's Repository Map

Aider builds a concise map using **tree-sitter** to extract symbol definitions. A **NetworkX MultiDiGraph** with **PageRank** personalization selects the most relevant portions that fit within the active token budget (default: ~1K tokens via `--map-tokens`). [Repository map | aider](https://aider.chat/docs/repomap.html) (Confidence: HIGH)

#### 3.2 Cursor's Merkle Tree Indexing

Cursor builds a semantic index using a **Merkle tree-based architecture** for efficient re-indexing. Effective context ~120K tokens. Performance degrades beyond ~500K lines of code. [Windsurf vs Cursor - Qodo](https://www.qodo.ai/blog/windsurf-vs-cursor/) (Confidence: MEDIUM)

#### 3.3 Windsurf's Cascade Engine

Preprocesses codebase into a dependency graph using static analysis and runtime heuristics. RAG automatically indexes the entire codebase. Effective context ~100K tokens. [Windsurf vs Cursor](https://windsurf.com/compare/windsurf-vs-cursor) (Confidence: MEDIUM)

### 4. Cross-Session Memory and Persistent State

#### 4.1 File-Based Memory (CLAUDE.md Pattern)

**Claude Code**: CLAUDE.md files (project instructions) loaded at session start + **auto memory** notes stored in `~/.claude/projects/<project>/memory/` with `MEMORY.md` entrypoint (first 200 lines loaded). `/remember` reviews session memories and proposes updates. [How Claude remembers your project](https://code.claude.com/docs/en/memory) (Confidence: HIGH)

**OpenAI Codex**: AGENTS.md hierarchy (global/project/subdirectory). Memory system writes to filesystem: `MEMORY.md`, `memory_summary.md`, `raw_memories.md`, `skills/`. Memory pollution detection marks contaminated threads and triggers forgetting passes. [Memory System | openai/codex | DeepWiki](https://deepwiki.com/openai/codex/3.7-memory-system) (Confidence: HIGH)

#### 4.2 Database-Backed Memory

**LangGraph**: Two-tiered -- short-term as thread-scoped checkpoints, long-term in custom namespaces via `BaseStore`. Three psychological memory types: **semantic** (facts), **episodic** (few-shot examples), **procedural** (refined system prompts). Backends: MongoDB, Redis, PostgreSQL. [Memory overview - LangChain](https://docs.langchain.com/oss/python/langgraph/memory) (Confidence: HIGH)

**CrewAI**: Three-layer -- short-term (ChromaDB with RAG), long-term (SQLite3), entity memory (RAG for people/places/concepts). Unified Memory class with composite scoring blending semantic similarity, recency, and importance. [Memory - CrewAI](https://docs.crewai.com/en/concepts/memory) (Confidence: HIGH)

**Semantic Kernel**: Volatile and non-volatile memory. **Whiteboard memory** extracts requirements, proposals, decisions from messages, surviving chat history truncation. Recommended persistence: Azure Cosmos DB. [Adding memory to Semantic Kernel Agents](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-memory) (Confidence: HIGH)

**OpenAI Agents SDK**: Session memory with `SQLiteSession`, `RedisSession`, `SQLAlchemySession`. No durable semantic memory built-in -- needs external solutions like Mem0. [Sessions - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/sessions/) (Confidence: HIGH)

#### 4.3 Working Memory / Structured State

**Mastra**: Three processors: **MessageHistory**, **SemanticRecall** (vector search), **WorkingMemory** (schema-validated state). **Observational memory** compresses old messages using configurable model (default: Gemini 2.5 Flash). [Agent Memory | Mastra Docs](https://mastra.ai/docs/agents/agent-memory) (Confidence: HIGH)

**Letta**: OS analogy with kernel context (system-managed) and user context (message buffer). Memory blocks with size limits, read-only protection, and system tools (`memory_replace`, `memory_rethink`, `memory_append`). [Anatomy of a Context Window | Letta](https://www.letta.com/blog/guide-to-context-engineering) (Confidence: HIGH)

#### 4.4 Lightweight / No Built-In Memory

- **AutoGen/AG2**: Message list only; cross-session depends on external integrations.
- **Pydantic AI**: No built-in; third-party options include `hindsight-pydantic-ai` and MongoDB.
- **smolagents**: No built-in memory handling.

### 5. Memory Architecture Comparison Table

| Framework | Within-Session | Cross-Session | Codebase Indexing | Storage Backend | Memory Types |
|---|---|---|---|---|---|
| **Claude Code** | Auto-compaction ~95%; subagent isolation | CLAUDE.md + auto memory | File tools (no pre-indexing) | Filesystem | Working, Declarative, Learned |
| **Codex CLI** | Compaction; ~192K window | Two-phase pipeline to MEMORY.md/skills | File tools + bash | SQLite + filesystem | Raw, rollout summaries, skills |
| **Aider** | Token-budgeted repo map | None (stateless) | Tree-sitter + PageRank | In-memory graph | Repo map only |
| **Cursor** | Semantic embeddings; ~120K | Workspace indexing persists | Merkle tree + embeddings | Local cache | Semantic index |
| **Windsurf** | RAG over Cascade; ~100K | Workspace indexing persists | Static analysis dep graph | Proprietary | Semantic + structural |
| **Cline** | Auto-compact ~80%; redundant removal | .clinerules for handoff | None built-in | In-memory | Conversation + snapshots |
| **LangGraph** | Thread checkpoints; message trimming | Namespace BaseStore; semantic/episodic/procedural | N/A | MongoDB, Redis, PostgreSQL | Semantic, Episodic, Procedural |
| **CrewAI** | RAG short-term (ChromaDB) | SQLite3 long-term; entity RAG | N/A | ChromaDB + SQLite3 | Short-term, Long-term, Entity |
| **Semantic Kernel** | ChatHistory; Whiteboard memory | AgentThread + Cosmos DB | N/A | Azure Cosmos DB | Volatile, Non-volatile, Whiteboard |
| **Claude Agent SDK** | Server-side compaction API | Session persistence via session_id | N/A | Anthropic-managed | Conversation + compaction |
| **OpenAI Agents SDK** | Session message history | SQLite/Redis/SQLAlchemy sessions | N/A | Various | Session history only |
| **Mastra** | MessageHistory + observational compression | SemanticRecall + WorkingMemory | N/A | LibSQL | Message, Semantic, Working, Observational |
| **Pydantic AI** | External: sliding window or summarization | External: MongoDB, Hindsight | N/A | Developer-chosen | None built-in |
| **smolagents** | None built-in | None built-in | N/A | Developer-chosen | None built-in |
| **Letta** | Memory blocks with limits; OS-style | Persistent memory blocks | N/A | Managed | Memory blocks |

### 6. Emerging Patterns

- **Graph-based memory** emerging as alternative to vector stores. Vector DBs treat memories independently; graph preserves connections across time. ICLR 2026 MemAgents workshop explores this. [Vector Databases vs. Graph RAG](https://machinelearningmastery.com/vector-databases-vs-graph-rag-for-agent-memory-when-to-use-which/) (Confidence: MEDIUM)

- **Hybrid observation masking + selective summarization** identified as optimal by JetBrains. [Cutting Through the Noise](https://blog.jetbrains.com/research/2025/12/efficient-context-management/) (Confidence: HIGH)

- **Skills as lazy-loaded context** adopted by Claude Code and Codex: descriptions loaded on demand, keeping them out of base context. [Context Engineering for Coding Agents | Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html) (Confidence: HIGH)

- **Memory pollution detection** (Codex): marks threads contaminated by unreliable sources and triggers selective forgetting. Novel safety mechanism. [Memory System | openai/codex | DeepWiki](https://deepwiki.com/openai/codex/3.7-memory-system) (Confidence: HIGH)

## Key Unknowns

1. **Cursor and Windsurf internals**: Closed-source; detailed algorithms not publicly documented.
2. **Compaction quality metrics**: No framework benchmarks what percentage of important information survives compaction.
3. **Graph memory in production**: Unclear if any shipping coding agent uses graph memory.
4. **smolagents memory roadmap**: Minimal documentation; unclear if by design or planned.
5. **Cross-agent memory conflicts**: How multi-agent systems handle contradictory memories is not well documented.
6. **Effective context thresholds**: Multiple sources cite 50-70% of advertised window, but degradation curves vary by model.
7. **Mastra observational memory performance**: No benchmarks comparing compression quality across models.

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 20+
