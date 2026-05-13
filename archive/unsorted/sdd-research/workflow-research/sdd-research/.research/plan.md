# Research Plan

## Depth Configuration
- **Depth**: deep
- **Target axes**: 7
- **Follow-up policy**: up to 2 automatic follow-ups if gaps found

## Topic
State-of-the-art agent harness landscape — architecture patterns, commonalities, and divergences across modern AI agent frameworks, with emphasis on CLI/coding agent harnesses.

## Research Axes

### Axis 1: Core Agent Loop Architectures
- **Question**: How do different agent harnesses structure their core reasoning/action loop, and what are the trade-offs between approaches (ReAct, plan-then-execute, state machines, DAGs, hierarchical orchestration)?
- **Search Strategy**: Search for architecture docs, design blog posts, and source code of each framework's main loop. Key queries: "{framework} agent loop architecture", "{framework} reasoning loop design", "ReAct vs plan-and-execute agents 2025 2026", "agent state machine architecture", "LangGraph agent loop", "Claude Code agent loop", "Aider architecture"
- **Source Priority**: Framework source code & docs > architecture blog posts > academic papers > community discussions
- **Exclusions**: Skip marketing comparisons and superficial "top 10 frameworks" listicles. Skip pre-2025 architectural descriptions if the framework has significantly changed since.
- **Output Format**: Pattern catalog — each loop pattern described with diagram-like textual description, list of frameworks using it, and trade-off analysis
- **Target Length**: 30-40 bullet points organized by pattern type, plus a comparison table

### Axis 2: Multi-Agent Coordination & Orchestration
- **Question**: How do frameworks handle multi-agent orchestration — fan-out/fan-in, hierarchical delegation, peer-to-peer, shared memory, supervisor patterns? Where do they agree/diverge?
- **Search Strategy**: Search for multi-agent patterns in each framework. Key queries: "multi-agent orchestration {framework}", "CrewAI agent coordination", "AutoGen AG2 multi-agent", "LangGraph multi-agent supervisor", "Claude Agent SDK multi-agent", "hierarchical agent delegation patterns", "agent swarm architecture"
- **Source Priority**: Framework docs & source code > architecture papers > blog posts with code examples
- **Exclusions**: Skip toy demos (e.g., "two chatbots talking to each other"). Focus on production-oriented coordination patterns.
- **Output Format**: Pattern catalog with concrete examples from frameworks. Comparison table of coordination primitives per framework.
- **Target Length**: 25-35 bullet points plus comparison table

### Axis 3: Planning & Task Decomposition
- **Question**: How do agent harnesses break down complex tasks? What planning representations do they use (flat task lists, dependency graphs, phase trees, DAGs)? How is replanning handled?
- **Search Strategy**: Key queries: "GSD phase planning architecture", "agent task decomposition patterns", "AI agent planning representations", "LangGraph plan-and-execute", "Aider task planning", "coding agent task breakdown", "agent replanning strategies", "RAPID wave planning"
- **Source Priority**: Framework source code & planning docs > design documents > blog posts showing planning output examples
- **Exclusions**: Skip classical AI planning literature (STRIPS, HTN) unless directly referenced by a framework. Focus on LLM-era planning patterns.
- **Output Format**: Narrative analysis per pattern type, with concrete examples of plan representations from specific frameworks
- **Target Length**: 25-35 bullet points organized by representation type

### Axis 4: Execution Monitoring, Verification & Recovery
- **Question**: How do frameworks handle execution monitoring, output verification, error recovery, rollback, and checkpoint/resume? What verification strategies exist (self-check, separate verifier agents, test execution, human review)?
- **Search Strategy**: Key queries: "agent error recovery patterns", "agent checkpoint resume", "GSD verification phase", "coding agent rollback", "agent execution monitoring", "LLM agent self-correction", "agent output verification strategies", "Claude Code error handling"
- **Source Priority**: Framework docs & source code > engineering blog posts > academic papers on agent reliability
- **Exclusions**: Skip generic software error handling patterns — focus on agent-specific recovery and verification.
- **Output Format**: Pattern catalog organized by concern (monitoring, verification, recovery, checkpointing), with framework examples
- **Target Length**: 25-30 bullet points plus a verification strategy comparison table

### Axis 5: Context Window Management, Memory & Cross-Session State
- **Question**: How do harnesses manage context window limits, implement long-term memory, handle conversation compression, and maintain state across sessions? What memory architectures exist (RAG, summarization, structured stores, vector DBs)?
- **Search Strategy**: Key queries: "agent context window management", "LLM agent memory architecture", "conversation compression agent", "Claude Code context management", "Aider repo map context", "agent cross-session state", "agent memory patterns 2025 2026", "coding agent codebase indexing"
- **Source Priority**: Framework source code & docs > technical blog posts > academic papers on agent memory
- **Exclusions**: Skip generic RAG tutorials — focus on how agent harnesses specifically manage context for multi-step coding tasks.
- **Output Format**: Pattern catalog with concrete implementation details from frameworks. Comparison table of memory strategies.
- **Target Length**: 25-35 bullet points plus comparison table

### Axis 6: Tool Systems — Dispatch, Extensibility & Plugin Architectures
- **Question**: How are tools defined, discovered, dispatched, and extended across frameworks? What role does MCP (Model Context Protocol) play? How do frameworks handle tool composition, schema validation, and tool result processing?
- **Search Strategy**: Key queries: "MCP Model Context Protocol tools", "agent tool dispatch architecture", "LangChain tools vs MCP", "Claude Code MCP integration", "agent plugin architecture", "tool use schema validation LLM", "agent tool extensibility patterns", "Cline tool integration"
- **Source Priority**: Framework docs & MCP specification > source code > blog posts with implementation details
- **Exclusions**: Skip individual tool implementations — focus on the dispatch/extensibility architecture, not what specific tools do.
- **Output Format**: Pattern catalog organized by concern (definition, discovery, dispatch, composition, validation). Comparison table of tool system features.
- **Target Length**: 25-30 bullet points plus comparison table

### Axis 7: Developer Ergonomics — Configuration, Observability & Debugging
- **Question**: How do frameworks expose configuration to developers? What observability, logging, tracing, and debugging patterns exist? How do frameworks handle prompt engineering and prompt management?
- **Search Strategy**: Key queries: "agent framework developer experience", "agent observability tracing", "LangSmith vs Langfuse agent tracing", "agent debugging patterns", "Claude Code configuration", "agent prompt management", "coding agent developer ergonomics 2025 2026", "agent framework configuration patterns"
- **Source Priority**: Framework docs > developer blog posts > community discussions (Reddit, Discord, forums)
- **Exclusions**: Skip IDE-specific UX concerns (keybindings, UI themes) — focus on the harness/framework configuration and observability layer.
- **Output Format**: Feature comparison organized by concern (config, observability, debugging, prompt management). Narrative analysis of ergonomic patterns.
- **Target Length**: 20-25 bullet points plus feature comparison table

## Cross-Cutting Concerns
- **Convergence vs. divergence**: Where has the field settled on common patterns, and where do fundamental disagreements or novel approaches persist? (Addressed in synthesis by comparing findings across all axes)
- **Open-source vs. commercial trade-offs**: How do architectural choices differ between open-source community frameworks and commercial products?
- **CLI-first vs. IDE-embedded**: How does the deployment context (terminal vs. editor extension) influence architectural decisions and efficiency?
- **Maturity spectrum**: Which patterns are battle-tested vs. experimental across the landscape?

## Expected Synthesis Structure
1. **Executive Summary** — Key findings and landscape overview
2. **Framework Landscape Map** — Brief catalog of in-scope frameworks with positioning
3. **Core Agent Loop Patterns** — Taxonomy of loop architectures with trade-offs
4. **Multi-Agent Coordination** — Orchestration patterns and when to use each
5. **Planning & Decomposition** — How harnesses structure complex work
6. **Execution & Reliability** — Verification, recovery, and checkpoint patterns
7. **Context & Memory** — Managing information across turns and sessions
8. **Tool Ecosystems** — Dispatch, extensibility, and the MCP convergence
9. **Developer Experience** — Configuration, observability, and debugging
10. **Convergence & Divergence Analysis** — Where the field agrees and where it splits
11. **Open Questions & Emerging Patterns** — What's unsettled and what's next

## Estimated Subagents
- Primary research: 7 subagents (one per axis)
- Expected follow-up: 1-2 gap-filling subagents
