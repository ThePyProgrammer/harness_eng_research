# Anthropic's Harness Pattern for Multi-Context-Window Agents

Anthropic's engineering blog details their solution for long-running agents that must work across multiple context windows — the core unsolved problem being that each new session starts with zero memory of prior work [1]. Their two-part architecture uses an initializer agent (runs only on first context window to set up environment and plan) and a coding agent (makes incremental progress each session while leaving clear artifacts) [1][2]. The critical innovation is a `claude-progress.txt` file alongside git history that enables fresh context windows to rapidly reconstruct project state. The Claude Agent SDK also implements context compaction — summarizing earlier conversation to free token budget without losing essential state [1]. Anthropic's prompting guide recommends organizing agent prompts into distinct XML sections (`<background>`, `<instructions>`, `<tools>`, `<output_format>`) to give models strong structural cues about information categories [3]. This represents a shift from treating agents as single-shot executors to designing them as session-aware, artifact-producing systems.

## Sources
- [1] https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- [2] https://parallel.ai/articles/what-is-an-agent-harness
- [3] https://addyosmani.com/blog/good-spec/
