# Research Context

## Topic
State-of-the-art agent harness landscape — architecture patterns, commonalities, and divergences across modern AI agent frameworks, with emphasis on CLI/coding agent harnesses.

## Scope & Parameters
- **Primary scope:** CLI/coding agent harnesses — GSD (GetShitDone), OpenSpec, Aider, Claude Code internals, Cursor agent mode, Windsurf, Cline/Continue, Codex CLI, and similar coding-focused agent orchestrators
- **Secondary scope:** General-purpose agent frameworks (LangGraph, CrewAI, AutoGen/AG2, Semantic Kernel, Claude Agent SDK, OpenAI Agents SDK, Mastra, Pydantic AI, smolagents) for broader architectural comparison
- **Coverage:** Both open-source and commercial frameworks
- **Recency:** Focus on current state (early 2026) — the field moves fast

## Depth Level
**Deep** — 6+ research axes, thorough detail, up to 2 automatic follow-ups to fill gaps. Comprehensive treatment of architecture, planning/execution patterns, and developer ergonomics across all in-scope frameworks.

## Target Audience
Developer building their own agent harness. Wants a thorough, neutral knowledge base to inform design decisions — not prescriptive recommendations.

## Key Questions to Answer
1. **Agent loop architectures:** How do different harnesses structure the core agent loop (ReAct, plan-then-execute, state machines, DAGs, hierarchical)? What are the trade-offs?
2. **Multi-agent coordination:** How do frameworks handle multi-agent orchestration — fan-out/fan-in, hierarchical delegation, peer-to-peer, shared memory? Where do they agree/diverge?
3. **Planning & task decomposition:** How do harnesses break down complex tasks? What planning representations do they use (task lists, dependency graphs, phase trees)?
4. **Execution, verification & recovery:** How do frameworks handle execution monitoring, output verification, error recovery, rollback, and checkpoint/resume?
5. **Context & memory management:** How do harnesses manage context windows, long-term memory, conversation compression, and cross-session state?
6. **Tool dispatch & extensibility:** How are tools defined, dispatched, and extended? Plugin/MCP architectures, permission models, sandboxing approaches.
7. **Developer ergonomics:** Configuration patterns, observability/debugging, prompt engineering patterns, and how frameworks expose control to developers.
8. **Consensus vs. divergence:** Where has the field converged on common patterns, and where do fundamental disagreements or novel approaches exist?

## Constraints & Preferences
- **Neutral, non-opinionated tone** — present patterns and trade-offs without prescribing a "best" approach
- **Cite sources** — reference specific framework documentation, blog posts, papers, and code where possible
- **Pattern-first organization** — organize findings by architectural pattern/concern, not by framework; use frameworks as illustrative examples within each pattern
- No exclusions on framework type — commercial and open-source both welcome

## Output Format Preference
- **Pattern catalog with narrative analysis** — organized by architectural concern/pattern area
- Each pattern section should: describe the pattern, list which frameworks use it, explain trade-offs, and cite sources
- Supplemented with comparison tables where they add clarity
- A synthesis section identifying convergence points and open divergences across the field
