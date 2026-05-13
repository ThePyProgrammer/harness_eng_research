# Gap Analysis

## Contradictions Found

1. **LangGraph: DAG vs. directed graph with cycles.** Axis 1 notes that some sources describe LangGraph as "DAG-based" while LangGraph's own documentation emphasizes support for cycles (loops). Axis 1 correctly flags this: "The 'DAG' label in some comparisons is technically inaccurate." Multiple axes treat LangGraph as supporting cycles, which aligns with primary documentation.

2. **Semantic Kernel planning direction.** Axis 1 documents that Semantic Kernel deprecated its Stepwise and Handlebars planners in favor of ReAct-style auto function calling. Axis 3 confirms this convergence. However, Axis 2 still lists Semantic Kernel as providing five distinct orchestration patterns (including GroupChat and Magentic), suggesting the deprecation applies specifically to single-agent planning, not multi-agent orchestration. These are compatible claims but could confuse readers without clarification.

3. **CrewAI context isolation.** Axis 2 states CrewAI has "shared crew context, but tasks are isolated per role." Axis 5 describes CrewAI as having three separate memory layers (short-term ChromaDB, long-term SQLite3, entity RAG). These are different aspects of the same system but their interaction is not fully clarified -- specifically, whether the shared crew context is the ChromaDB short-term memory or something separate.

4. **Observation masking vs. summarization effectiveness.** Axis 5 cites JetBrains research showing observation masking outperforms LLM summarization (which caused 13-15% longer runs). However, nearly every CLI coding agent (Claude Code, Cline, Codex) uses summarization/compaction as their primary strategy, not observation masking. This contradiction between research findings and industry practice deserves attention.

5. **Single-agent vs. multi-agent effectiveness.** Follow-up 1 surfaces a tension: research (M3MAD-Bench) shows multi-agent debate "cannot exceed the accuracy of its strongest participant," yet the industry positions 2026 as "the year of multi-agent operations." This conflict between empirical evidence and market momentum is a significant unresolved tension in the field.

## Unanswered Questions

1. ~~**Convergence vs. divergence synthesis.**~~ **RESOLVED by Follow-up 1.** Comprehensive synthesis of convergence points (ReAct as baseline, MCP as standard, OTel for observability, human-in-the-loop, multi-model, context engineering) and active divergences (workflow graphs vs. open-loop, single vs. multi-agent, programming model fragmentation, abstraction level).

2. ~~**Open-source vs. commercial trade-offs.**~~ **RESOLVED by Follow-up 1.** Analyzed as a spectrum: open-source cores with monetization via operational infrastructure (LangSmith, Azure, CrewAI Enterprise). Commercial frameworks bundle identity, checkpointing, compliance tooling.

3. ~~**CLI-first vs. IDE-embedded architectural influences.**~~ **RESOLVED by Follow-up 1.** Delegation vs. suggestion as core split; context management divergence; feedback loop determinism (exit codes vs. visual inspection); CI/CD integration; hybrid usage pattern dominant in practice.

4. ~~**Maturity spectrum.**~~ **RESOLVED by Follow-up 1.** Four-tier spectrum identified from battle-tested (LangGraph 1.0, MCP, OTel infrastructure) to experimental (multi-agent debate at scale, persistent agent communities).

5. **Continue (IDE extension) architecture.** Still not covered. Architectural details remain undocumented beyond `.continue/rules/` directories.

## Thin Areas (Post-Follow-up Assessment)

1. **Cursor internals.** Still unknown (closed-source). Inherent limitation, not a researchable gap.

2. **Windsurf internals.** Still mostly unknown (closed-source). Some high-level details from marketing/comparison sources.

3. **Continue (IDE extension).** Still not covered. Low-priority given its smaller market presence.

4. ~~**Google ADK coverage.**~~ **RESOLVED by Follow-up 2.** Now has comprehensive coverage: PlanReActPlanner/BuiltInPlanner for planning, 3-layer Session/State/Memory architecture, OTel from v1.17+, code-first + YAML config, 4-language SDKs.

5. ~~**Strands Agents (AWS).**~~ **RESOLVED by Follow-up 2.** Now covered: model-driven planning with ReAct/ReWOO, SessionManager with File/S3/AgentCore backends, OTel native, 3-line agent ergonomics, 4 multi-agent primitives (agents-as-tools, handoffs, swarms, graphs).

6. **Letta.** Only covered in Axis 5 (memory architecture). Not explored in other axes. Low-priority as it is more of a specialized memory framework than a general agent harness.

7. ~~**A2A protocol.**~~ **RESOLVED by Follow-up 2.** Comprehensive coverage: HTTPS/JSON-RPC architecture, Agent Card discovery, relationship to MCP (complementary), framework adoption status (ADK and Strands native; LangGraph lacks native support), current limitations.

8. **Benchmarks.** Still a gap. Follow-up 1 adds some data (Microsoft Agent Framework benchmarks, LangChain State of AI survey metrics) but systematic cross-framework benchmarks remain scarce industry-wide.

## Citation Audit

### Unsourced Claims Detected
- Axis 1: "Built in TypeScript" (Claude Code) -- not explicitly sourced in findings (minor, factually correct)
- Follow-up 1: All claims well-sourced (15+ sources)
- Follow-up 2: All claims well-sourced (20+ sources)

### Axes with Full Citation Coverage
- Axis 1: Nearly all claims sourced (20+ sources)
- Axis 2: All major claims sourced (25+ sources)
- Axis 3: All major claims sourced (20+ sources)
- Axis 4: All major claims sourced (20+ sources)
- Axis 5: All major claims sourced (20+ sources)
- Axis 6: All major claims sourced (25+ sources)
- Axis 7: All major claims sourced (25+ sources)
- Follow-up 1: All claims sourced (15+ sources)
- Follow-up 2: All claims sourced (20+ sources)

No unsourced claims detected -- all findings meet citation requirements (one minor exception in Axis 1 noted above).

## Follow-up Research Needed

**No further follow-ups needed.** The 2 follow-up subagents successfully addressed the identified gaps:
- Follow-up 1 resolved convergence/divergence, maturity, open-source/commercial, and CLI/IDE questions
- Follow-up 2 resolved Google ADK, Strands Agents, and A2A protocol coverage gaps

Remaining thin areas (Cursor/Windsurf internals, Continue, Letta) are either inherent limitations of closed-source products or low-priority items that would not significantly improve the overall research quality.
