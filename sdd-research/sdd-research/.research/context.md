# Research Context

## Topic
Comparative analysis of spec-driven agentic coding workflows — examining ~20 existing implementations to understand their philosophies, patterns, trade-offs, and prompt engineering approaches, with the goal of informing the design of a new custom workflow.

## Scope & Parameters
**In scope:**
- All named implementations: OpenSpec, GSD, PAUL, OpenKit, GitHub Spec Kit, Tasker, SpecPulse, spec-driven-agentic-development, cc-sdd, Shotgun, ContextKit, agentic-code, Pilot Shell, spec-kitty, lean-spec, smart-ralph, ai-factory, spec-kit-plus, spec-kit-command-cursor, mcp-server-spec-driven-development
- Any additional notable spec-driven workflows discovered during research
- Claude Code as the primary platform (slash commands, MCP servers, CLAUDE.md patterns)
- Cross-platform patterns where they inform good design (Cursor rules, etc.)

**Out of scope:**
- General AI coding assistants that don't use spec-driven approaches
- Non-agentic code generation tools (simple autocomplete, etc.)
- Pricing/business model comparisons (focus is on technical design)

## Depth Level
**Deep** — 6+ research axes, thorough detail, up to 2 automatic follow-ups per axis if gaps found.

## Target Audience
A developer building their own spec-driven agentic coding workflow for Claude Code. Needs actionable technical insights, not surface-level overviews.

## Key Questions to Answer
1. **Workflow philosophy**: How does each tool structure the spec → plan → execute pipeline? What gets human review vs. what's automated? Where do they put the "human in the loop"?
2. **Spec format & schema**: How are requirements/specs defined — markdown, YAML, structured JSON, conversation-driven? What information does each spec format capture and what does it omit?
3. **Quality guardrails**: How does each tool ensure code quality — testing strategies, verification steps, rollback mechanisms, atomic commits, pre/post-execution checks?
4. **Extensibility & architecture**: Plugin systems, MCP integration, customization hooks — how modular and adaptable is each tool?
5. **Prompt engineering philosophies**: How does each tool prompt the AI? System prompts, context management, prompt chaining, agent delegation strategies, context window management?
6. **Philosophical convergences & divergences**: Where do these tools agree (likely best practices) vs. where do they diverge (design trade-offs with no clear winner)?
7. **What works and what doesn't**: Based on community feedback, issues, and design analysis — what patterns have proven effective and what are common failure modes?

## Constraints & Preferences
- Primary platform focus: Claude Code (CLI slash commands, MCP servers, CLAUDE.md conventions)
- All focus areas selected: workflow philosophy, spec format, quality guardrails, extensibility, AND prompt engineering philosophies
- Developer is building their own tool — needs to understand "why" behind design decisions, not just "what"
- Emphasis on extractable patterns and lessons, not just descriptions

## Output Format Preference
**Comprehensive deliverable combining all three formats:**
1. **Comparison matrix**: Feature-by-feature table across all implementations for quick reference
2. **Narrative analysis**: Detailed writeup of each tool's approach, philosophy, and trade-offs
3. **Opinionated recommendations**: Clear "adopt this pattern, skip that approach" guidance
4. **Design patterns catalog**: Best patterns extracted from across all tools, organized as a reusable reference for building a new workflow
