# Research Context

## Topic
AI Harness Frameworks for Metaprompting of Coding Agents

## Scope & Parameters
- **Agent coverage**: Agent-agnostic frameworks with additional Claude/Anthropic-specific depth. Research should identify patterns that generalize across LLM backends while noting where Claude-specific capabilities (e.g., extended thinking, tool use, system prompts) enable differentiated harness designs.
- **Workflow stages in scope**: Requirements generation, roadmap generation, human-AI phase discussion, phase planning, phase execution, and phase verification.
- **Existing tools in scope**: Survey of existing harness frameworks (GSD, RAPID, Aider, SWE-agent, OpenHands, Devon, Cursor, Windsurf, and others) plus theoretical optimization frameworks.
- **Research angles**: Comprehensive — prompt engineering, architecture patterns, and evaluation methods.

## Depth Level
Standard (4-5 research axes, moderate detail, 1 follow-up if gaps found)

## Target Audience
Academic publication — structured for a research paper or conference submission. Should follow academic conventions: clear problem statement, related work, methodology, findings, and future directions.

## Key Questions to Answer
1. What architectural patterns exist for orchestrating multi-stage coding agent pipelines (requirements → roadmap → discussion → planning → execution → verification)?
2. How do existing harness frameworks (GSD, RAPID, SWE-agent, OpenHands, etc.) structure their metaprompts, and what patterns correlate with higher output quality?
3. What evaluation methodologies and benchmarks can measure harness effectiveness across the full software development lifecycle, not just code generation?
4. How do prompt engineering techniques for metaprompting differ from standard prompting, and what are the unique challenges of "prompts that generate prompts"?
5. What optimization strategies (ablation, feedback loops, adaptive prompting, contract-based interfaces) show the most promise for improving harness performance?
6. How do harness designs need to adapt across different LLM backends, and which patterns are truly agent-agnostic?

## Constraints & Preferences
- Must be rigorous enough for academic publication
- Should include both empirical landscape survey AND theoretical optimization frameworks
- Agent-agnostic patterns should be clearly distinguished from Claude-specific optimizations
- The six workflow stages (requirements, roadmap, discussion, planning, execution, verification) form the structural backbone of the analysis

## Output Format Preference
Academic research report — structured sections suitable for a conference paper or journal submission, with clear methodology, findings, and contribution statements.
