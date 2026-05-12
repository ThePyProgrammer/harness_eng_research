# Research Plan

## Depth Configuration
- **Depth**: standard
- **Target axes**: 5
- **Follow-up policy**: 1 follow-up if gaps found

## Topic
AI Harness Frameworks for Metaprompting of Coding Agents

## Research Axes

### Axis 1: Landscape Survey of Existing Harness Frameworks
- **Question**: What existing frameworks orchestrate LLM coding agents across multi-stage software development workflows, and how do they structure their pipelines?
- **Search Strategy**: Search for SWE-agent, OpenHands (formerly OpenDevin), Devon, Aider, GSD, RAPID, Cursor agent mode, Windsurf Cascade, Cline, Continue.dev, Sweep, AutoCodeRover, Codegen agents. Look for architecture docs, blog posts, papers, and open-source repos describing their pipeline stages.
- **Source Priority**: GitHub repos (READMEs, architecture docs), academic papers (arXiv), official blog posts, developer conference talks
- **Exclusions**: Simple code-completion tools (Copilot autocomplete) that don't orchestrate multi-stage workflows. Exclude pure chat interfaces without pipeline structure.
- **Output Format**: Comparison table (framework × pipeline stages × key design choices) with narrative descriptions of notable architectural patterns
- **Target Length**: 20-30 bullet points plus a comparison matrix

### Axis 2: Metaprompt Architecture Patterns
- **Question**: What architectural patterns and prompt engineering techniques are used in metaprompting — i.e., constructing prompts that instruct an LLM to generate effective sub-prompts or orchestrate other agents — and how do these differ from standard prompting?
- **Search Strategy**: Search for "metaprompting", "prompt chaining", "prompt orchestration", "hierarchical prompting", "prompt decomposition", "meta-prompt engineering", "system prompt generation", "prompt templates for agents". Look for DSPy, LMQL, Guidance, and other programmatic prompting frameworks. Search academic literature for "automatic prompt optimization" and "prompt program synthesis".
- **Source Priority**: Academic papers (NeurIPS, ICML, ACL workshops on LLM agents), arXiv preprints on prompt optimization, DSPy documentation, blog posts from AI labs
- **Exclusions**: Basic prompt engineering tips (few-shot, chain-of-thought) unless they are specifically applied in a metaprompting context. Exclude manual prompt writing guides.
- **Output Format**: Taxonomy of metaprompting patterns with examples, organized by technique category
- **Target Length**: 15-25 bullet points with pattern descriptions

### Axis 3: Multi-Stage Pipeline Orchestration
- **Question**: How are multi-stage software development pipelines (requirements → roadmap → discussion → planning → execution → verification) orchestrated in practice, and what are the key design decisions for stage boundaries, state passing, error recovery, and human-in-the-loop integration?
- **Search Strategy**: Search for "agent pipeline orchestration", "multi-agent software development", "LLM workflow orchestration", "agentic software engineering pipeline", "AI-assisted SDLC". Look for LangGraph, CrewAI, AutoGen, MetaGPT, ChatDev pipeline designs. Search for contract/interface patterns between pipeline stages.
- **Source Priority**: Open-source framework documentation (LangGraph, CrewAI, AutoGen, MetaGPT), academic papers on multi-agent systems, software engineering conference papers (ICSE, FSE, ASE)
- **Exclusions**: Generic workflow orchestration tools (Airflow, Prefect) unless they're specifically applied to LLM agent pipelines. Exclude single-turn agent interactions.
- **Output Format**: Narrative with architectural diagrams described in text, covering state management, stage contracts, feedback loops, and failure handling
- **Target Length**: 20-25 bullet points organized by design decision category

### Axis 4: Evaluation Methodologies and Benchmarks
- **Question**: What evaluation methodologies, benchmarks, and metrics exist (or could be developed) to measure the effectiveness of coding agent harnesses across the full software development lifecycle — beyond just code generation correctness?
- **Search Strategy**: Search for "SWE-bench", "coding agent evaluation", "software engineering agent benchmark", "LLM agent evaluation framework", "code generation benchmark beyond HumanEval". Look for metrics covering requirements quality, plan quality, verification completeness. Search for "LLM-as-judge" evaluation patterns, "automated code review metrics", and "software quality metrics for AI-generated code".
- **Source Priority**: Academic papers (SWE-bench paper, agent benchmark papers), benchmark leaderboards, evaluation framework documentation, software engineering metrics literature
- **Exclusions**: Pure code generation benchmarks (HumanEval, MBPP) unless they are extended to multi-stage evaluation. Exclude benchmarks for non-coding LLM tasks.
- **Output Format**: Structured survey: existing benchmarks (what they measure, gaps), proposed metrics for under-evaluated stages, evaluation methodology recommendations
- **Target Length**: 20-25 bullet points with benchmark comparison table

### Axis 5: Optimization Strategies and Theoretical Frameworks
- **Question**: What optimization strategies (ablation studies, feedback loops, adaptive prompting, contract-based interfaces, reinforcement from human corrections, cross-model portability) show the most promise for systematically improving harness performance, and what theoretical frameworks can guide this optimization?
- **Search Strategy**: Search for "prompt optimization", "DSPy optimization", "automated prompt tuning", "OPRO", "APE automatic prompt engineer", "TextGrad", "prompt feedback loops", "self-refining prompts". Look for ablation study methodologies applied to prompts, A/B testing frameworks for agent pipelines, and "LLM cascade" optimization patterns.
- **Source Priority**: Academic papers on prompt optimization (DSPy, OPRO, APE), ML optimization literature applied to prompts, industry blog posts on production agent tuning
- **Exclusions**: Fine-tuning or RLHF approaches (focus is on prompt/harness-level optimization, not model-level). Exclude generic hyperparameter tuning unless applied to prompt systems.
- **Output Format**: Framework-oriented narrative: categorize optimization approaches by type, evidence of effectiveness, applicability to multi-stage harnesses
- **Target Length**: 15-25 bullet points with a taxonomy of optimization approaches

## Cross-Cutting Concerns
- **Agent-agnostic vs. model-specific patterns**: Each axis should note which findings generalize vs. which are tied to specific model capabilities (e.g., Claude's extended thinking, GPT's function calling format)
- **The six workflow stages**: Each axis should map findings back to the six-stage pipeline (requirements, roadmap, discussion, planning, execution, verification) where applicable
- **Academic rigor**: Findings should distinguish between empirically validated claims and anecdotal/theoretical assertions

## Expected Synthesis Structure
1. **Abstract** — Problem statement and key contributions
2. **Introduction** — Motivation for studying harness frameworks; definition of metaprompting in the SDLC context
3. **Background & Related Work** — (Axis 1 + Axis 2) Landscape of existing tools and metaprompting foundations
4. **Pipeline Architecture Patterns** — (Axis 3) Orchestration design space with taxonomy
5. **Evaluation Framework** — (Axis 4) Proposed methodology for measuring harness effectiveness
6. **Optimization Approaches** — (Axis 5) Systematic strategies for harness improvement
7. **Discussion** — Cross-cutting themes, agent-agnostic vs. specific patterns, limitations
8. **Future Directions** — Open problems and research agenda
9. **Conclusion**

## Estimated Subagents
- Primary research: 5 subagents (one per axis)
- Expected follow-up: 1 gap-filling subagent (if needed after primary research)
