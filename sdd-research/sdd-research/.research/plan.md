# Research Plan

## Depth Configuration
- **Depth**: deep
- **Target axes**: 7
- **Follow-up policy**: up to 2 automatic follow-ups per axis if gaps found

## Topic
Comparative analysis of spec-driven agentic coding workflows — examining ~20 existing implementations to understand their philosophies, patterns, trade-offs, and prompt engineering approaches, with the goal of informing the design of a new custom workflow.

## Research Axes

### Axis 1: Tool Landscape & Architecture Survey
- **Question**: What spec-driven agentic coding tools exist, what are their repos/maturity levels, and how are they architecturally structured at a high level?
- **Search Strategy**: Search GitHub for each named tool (OpenSpec, GSD, PAUL, OpenKit, GitHub Spec Kit, Tasker, SpecPulse, spec-driven-agentic-development, cc-sdd, Shotgun, ContextKit, agentic-code, Pilot Shell, spec-kitty, lean-spec, smart-ralph, ai-factory, spec-kit-plus, spec-kit-command-cursor, mcp-server-spec-driven-development). For each: read README, check stars/activity, identify tech stack, note file structure. Also search for any unlisted tools via queries like "spec driven development claude code", "agentic coding workflow", "claude code slash commands spec".
- **Source Priority**: GitHub repos (READMEs, directory structures), npm/PyPI listings, blog posts announcing tools
- **Exclusions**: Non-spec-driven tools, simple code generation wrappers, tools with zero activity/abandoned without meaningful design
- **Output Format**: Structured catalog — one entry per tool with: name, repo URL, platform target (Claude Code / Cursor / generic), tech stack, maturity (stars, last commit, version), installation method, 2-3 sentence summary of approach
- **Target Length**: Full catalog of all ~20+ tools, roughly 1-2 paragraphs per tool

### Axis 2: Workflow Pipeline & Human-in-the-Loop Design
- **Question**: How does each tool structure the journey from requirements to working code, and where do they place human decision points vs. automated steps?
- **Search Strategy**: For each tool, read its primary workflow documentation — look for pipeline diagrams, step-by-step guides, command sequences. Search for terms like "workflow", "pipeline", "phases", "steps", "human review", "approval" in each repo. Pay special attention to how tools handle: spec creation → planning → execution → verification loops.
- **Source Priority**: Tool documentation, CLAUDE.md files, slash command definitions, workflow diagrams, blog posts explaining the philosophy
- **Exclusions**: Implementation details of individual commands (covered in other axes)
- **Output Format**: Comparison narrative organized by pipeline pattern (linear, iterative, parallel). Include a pipeline diagram summary for the most distinct approaches.
- **Target Length**: 4-6 paragraphs of narrative analysis plus a comparison table of pipeline stages across tools

### Axis 3: Spec Format & Schema Design
- **Question**: How do different tools define and structure requirements/specs — what formats, schemas, and information models do they use, and what trade-offs result?
- **Search Strategy**: For each tool, find the spec/requirements file format — look for template files, schema definitions, example specs. Search repos for "spec", "schema", "template", "requirements", "yaml", "frontmatter". Examine: what fields are required vs. optional, how specs reference code, how specs evolve over time, whether specs are human-authored or AI-generated or collaborative.
- **Source Priority**: Template files in repos, schema definitions, example projects, documentation on spec authoring
- **Exclusions**: Internal implementation schemas not exposed to users
- **Output Format**: Feature comparison table (columns: tool name, format type, required fields, optional fields, spec evolution mechanism, notable design choices) plus narrative analysis of design philosophies
- **Target Length**: Comparison table covering all tools + 3-5 paragraphs analyzing patterns and trade-offs

### Axis 4: Quality Guardrails & Verification Strategies
- **Question**: What mechanisms do these tools use to ensure code quality, catch errors, enable rollback, and verify that generated code meets the spec?
- **Search Strategy**: Search each repo for: "test", "verify", "validate", "commit", "rollback", "checkpoint", "lint", "review", "quality", "guard". Look for pre/post-execution hooks, testing strategies, atomic commit patterns, verification loops, CI integration. Pay attention to: does the tool run tests automatically? Does it verify against the spec? Can it roll back failed changes?
- **Source Priority**: Source code of verification/testing modules, documentation on quality features, CLAUDE.md guardrail instructions
- **Exclusions**: General testing frameworks not specific to the tool's workflow
- **Output Format**: Tiered analysis — group tools by sophistication of their guardrails (basic → moderate → comprehensive). Include specific examples of guardrail implementations.
- **Target Length**: 4-6 paragraphs with concrete code/config examples where illuminating

### Axis 5: Prompt Engineering & Agent Orchestration
- **Question**: How do these tools prompt the AI, manage context windows, chain prompts, and orchestrate multiple agents or sub-agents?
- **Search Strategy**: This is the deepest technical axis. For each tool, find: system prompts, CLAUDE.md content, agent definitions, prompt templates, context management strategies. Search for: "system prompt", "CLAUDE.md", "agent", "subagent", "context", "prompt", "chain", "orchestrat". Look at how tools handle: context window limits, information density, prompt decomposition, multi-turn interactions, agent specialization.
- **Source Priority**: Actual prompt text and CLAUDE.md files in repos (primary source of truth), documentation on agent architecture, source code of orchestration logic
- **Exclusions**: Generic LLM prompting advice not specific to spec-driven workflows
- **Output Format**: Deep narrative analysis organized by prompting strategy pattern. Include verbatim prompt excerpts where they reveal interesting design choices.
- **Target Length**: 6-8 paragraphs — this is a core axis for the target audience

### Axis 6: Extensibility, Modularity & Platform Integration
- **Question**: How customizable and extensible are these tools — what plugin systems, hooks, MCP integrations, and configuration options do they offer, and how do they integrate with different platforms?
- **Search Strategy**: For each tool, examine: plugin/hook systems, MCP server implementations, configuration files, customization documentation. Search for: "plugin", "hook", "MCP", "extension", "config", "customize", "settings", "cursor", "rules". Compare Claude Code-native tools vs. cross-platform tools vs. Cursor-specific tools.
- **Source Priority**: Configuration schemas, plugin APIs, MCP server definitions, platform-specific integration code
- **Exclusions**: UI/UX differences between platforms (focus on architectural extensibility)
- **Output Format**: Comparison table of extensibility features + narrative analysis of architectural patterns (monolithic vs. modular vs. micro-service style)
- **Target Length**: 3-5 paragraphs plus comparison table

### Axis 7: Community Reception, Failure Modes & Emergent Lessons
- **Question**: What has the developer community learned from using these tools — what works well, what fails, and what patterns have emerged as best practices or anti-patterns?
- **Search Strategy**: Search GitHub issues/discussions for each tool. Search broader community: "spec driven development" on Reddit, Hacker News, X/Twitter, dev blogs. Look for: common complaints, feature requests, success stories, failure modes, "lessons learned" posts. Search for: "doesn't work", "broken", "love this", "switched from", "better than".
- **Source Priority**: GitHub issues and discussions (direct user feedback), blog posts and forum discussions, X/Twitter threads, Hacker News comments
- **Exclusions**: Marketing content, AI-generated reviews with no substance
- **Output Format**: Narrative organized as: proven patterns (what works) → common failure modes (what doesn't) → open debates (unresolved trade-offs). Include specific quotes/examples where they add color.
- **Target Length**: 5-7 paragraphs with concrete examples

## Cross-Cutting Concerns
- **Claude Code vs. Cursor vs. Generic**: Many tools target a specific platform — synthesis should identify which patterns are platform-specific vs. universally applicable
- **Maturity spectrum**: Tools range from weekend projects to mature systems — weight analysis accordingly
- **Philosophy spectrum**: Tools range from "AI does everything" to "human controls everything" — map this spectrum explicitly
- **Prompt engineering as the hidden differentiator**: The quality of prompts is often the biggest differentiator but hardest to assess from outside — prioritize finding actual prompt content

## Expected Synthesis Structure
The final report should be organized as:

1. **Executive Summary** — Key findings in 1 page
2. **Tool Catalog** — Quick-reference table of all tools examined (from Axis 1)
3. **Pipeline Patterns** — How tools structure the workflow (from Axis 2)
4. **Spec Design Patterns** — How requirements are captured (from Axis 3)
5. **Quality & Verification Patterns** — How tools ensure correctness (from Axis 4)
6. **Prompt Engineering Patterns** — How tools talk to the AI (from Axis 5)
7. **Architecture & Extensibility Patterns** — How tools are built (from Axis 6)
8. **What the Community Has Learned** — Proven practices and pitfalls (from Axis 7)
9. **Convergence Map** — Where tools agree (likely best practices)
10. **Divergence Map** — Where tools disagree (design trade-offs)
11. **Design Patterns Catalog** — Extractable patterns for building a new tool
12. **Opinionated Recommendations** — "If building a new tool, do X, avoid Y"
13. **Comparison Matrix** — Feature-by-feature table (appendix)

## Estimated Subagents
- Primary research: 7 subagents (one per axis)
- Expected follow-up: 3-5 gap-filling subagents (deep mode, complex topic)
