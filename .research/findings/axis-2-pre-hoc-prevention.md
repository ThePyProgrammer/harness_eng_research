# Axis 2: Pre-Hoc Prevention at the Harness Level

## Question
What harness-level techniques prevent slop from being generated in the first place? This includes prompt engineering, CLAUDE.md/AGENTS.md constraints, skill design, system prompt patterns, agent behavioral contracts, and spec-driven guardrails.

## Findings

### S1: Init — Session Initialization & Context Loading

**1. Minimal CLAUDE.md files (High Confidence)**
Anthropic's official documentation states: *"For each line, ask: 'Would removing this cause Claude to make mistakes?' If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"* Recommended size: 50-100 lines in root with `@imports` for detailed sections. [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**2. Omit LLM-generated context files entirely (High Confidence)**
ETH Zurich study (Feb 2026) across 138 repositories and 5,694 PRs found LLM-generated AGENTS.md files *decrease* task success by 3% and *increase* cost by 20%. Human-written files showed marginal +4% success but +19% cost. Researchers recommend limiting to "non-inferable details only" — custom build commands, tooling quirks, domain knowledge. Repository structure overviews are explicitly useless: agents discover file structures on their own. [New Research Reassesses the Value of AGENTS.md Files - InfoQ](https://www.infoq.com/news/2026/03/agents-context-file-value-review/)

**3. Exclude self-evident instructions (High Confidence)**
Anthropic explicitly lists what to exclude: "Standard language conventions Claude already knows," "Anything Claude can figure out by reading code," and "Self-evident practices like 'write clean code.'" [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**4. Conditional skill loading (Medium Confidence)**
Every skill adds tokens to context. Recommendation: load skills on demand, reformat prose-based skills as structured checklists — a 300-word skill reformatted as 20-line checklist often produces equal or better results with fewer tokens. [Top 10 Claude Code Skills - Composio](https://composio.dev/content/top-claude-skills)

### S2: Governing Principles — Behavioral Contracts & Constraints

**5. Three-tier action classification: Always / Ask First / Never (High Confidence)**
Addy Osmani advocates structuring agent constraints as three tiers:
- **Always**: "Always run tests before commits," "Always follow naming conventions"
- **Ask First**: "Ask before modifying database schemas," "Ask before adding new dependencies"
- **Never**: "Never commit secrets," "Never remove a failing test without approval"
[How to Write a Good Spec for AI Agents - O'Reilly](https://www.oreilly.com/radar/how-to-write-a-good-spec-for-ai-agents/)

**6. Explicit anti-over-engineering directives (High Confidence)**
Claude Opus specifically tends to over-engineer by "creating extra files, adding unnecessary abstractions, or building in flexibility that wasn't requested." Anthropic recommends: *"keep solutions minimal."* Concrete rules:
- `Prefer the smallest viable diff; do not refactor unrelated code`
- `Minimize blast radius; don't refactor adjacent code unless it meaningfully reduces risk`
- `Any refactor without coverage must be extremely small and mechanically verifiable`
[How to Write a Great agents.md - GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) | [AGENTS.md Patterns - Blake Crosley](https://blakecrosley.com/blog/agents-md-patterns)

**7. Diff budgets (Medium Confidence)**
Setting explicit limits on lines changed per iteration forces the agent to "edit like a disciplined contributor — propose a patch, keep it small, explain intent." Mechanically prevents boilerplate inflation. [AGENTS.md Patterns - Blake Crosley](https://blakecrosley.com/blog/agents-md-patterns)

**8. Commands over prose in rules files (High Confidence)**
"Commands are unambiguous — the agent knows exactly what to run." Instructions without verification commands are suggestions, not rules. Specific tool mentions in context files increase agent tool usage from 0.01 to 1.6 times per task. [I Analyzed Dozens of AI Agent Rules Files - DEV Community](https://dev.to/alexefimenko/i-analyzed-a-lot-of-ai-agent-rules-files-most-are-making-your-agent-worse-2fl)

### S3: Requirements — Spec-Driven Guardrails

**9. Spec-driven development with GitHub Spec Kit (High Confidence)**
The spec becomes "a contract for how your code should behave and serves as the source of truth." Key insight: once you have a spec, "you have all of the guardrails set up in advance and the agent can execute without feedback." [Spec-Driven Development with AI - GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

**10. Non-goals and invariants in task descriptions (Medium Confidence)**
Explicit "constraints, non-goals, and invariants" alongside task descriptions. Non-goals directly prevent scope creep and over-engineering. [AGENTS.md Patterns - Blake Crosley](https://blakecrosley.com/blog/agents-md-patterns)

### S4: Discussion — Plan-Before-Code Patterns

**11. Plan Mode separation (High Confidence)**
Anthropic's best practice: "Separate research and planning from implementation to avoid solving the wrong problem." Four-phase workflow: Explore → Plan → Implement → Commit. [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**12. Interview-driven spec generation (Medium Confidence)**
Before coding, have the agent interview the developer about technical implementation, UI/UX, edge cases, concerns, and tradeoffs. Write spec to SPEC.md, then fresh session implements with clean context. [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**13. Ask for assumptions and risks before code (High Confidence)**
*"List your assumptions, the plan, and any potential risks."* Prevents hallucinated imports, unnecessary abstractions, and bloated solutions by forcing reasoning before generating. [Agentic AI Prompting Best Practices - Ran the Builder](https://ranthebuilder.cloud/blog/agentic-ai-prompting-best-practices-for-smarter-vibe-coding/)

### S5-S6: Roadmap & Architecture — Pattern Anchoring

**14. Point to exemplar files, not abstract rules (High Confidence)**
"Examples beat abstractions — point to real files that show your best patterns and also call out legacy files to avoid." Constrains agent to existing patterns rather than inventing new ones. [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**15. Positive instructions over negations (Medium Confidence)**
"Add correlation-id headers to all outbound requests" works better than "Don't forget to add headers." Semantically similar negative rules actively confuse agents. [Agentic AI Prompting Best Practices](https://ranthebuilder.cloud/blog/agentic-ai-prompting-best-practices-for-smarter-vibe-coding/) | [Agent Instruction Patterns - Elements.cloud](https://elements.cloud/blog/agent-instruction-patterns-and-antipatterns-how-to-build-smarter-agents/)

### S7: Task Decomposition — Scoping Constraints

**16. Break complex tasks into chained prompts (High Confidence)**
Sequential prompts where each builds on verified output prevent speculative abstractions. [Agentic AI Prompting Best Practices](https://ranthebuilder.cloud/blog/agentic-ai-prompting-best-practices-for-smarter-vibe-coding/)

**17. Scope investigations narrowly or delegate to subagents (High Confidence)**
Open-ended "investigate X" prompts fill context with noise. Subagents run in separate context windows and report summaries. [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

### S8: Execution — Runtime Guardrails

**18. Deterministic hooks for formatting and linting (High Confidence)**
Unlike CLAUDE.md instructions which are advisory, hooks guarantee the action happens. PostToolUse hooks running formatters after every edit means "you'll never have to remind the AI to format its code again."
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "command": "npx prettier --write $FILE"
    }]
  }
}
```
[Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks) | [Claude Code Hooks Tutorial - Blake Crosley](https://blakecrosley.com/blog/claude-code-hooks-tutorial)

**19. Emphasis markers for critical rules (Medium Confidence)**
`IMPORTANT:` or `YOU MUST` before anti-slop rules in CLAUDE.md increases compliance. Overuse dilutes effectiveness. [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**20. Tool design: minimize overlap and enforce token-efficient returns (High Confidence)**
"If humans can't decisively pick which tool fits a situation, agents produce unnecessary variations." Verbose tool outputs cascade into verbose code. [Effective Context Engineering - Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

### S9: Verification — Feedback Loop Constraints

**21. Provide verification criteria up front (High Confidence)**
"Claude performs dramatically better when it can verify its own work." Without criteria, agents produce "something that looks right but actually doesn't work." [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**22. Writer/Reviewer session separation (Medium Confidence)**
Separate sessions — one implements, another reviews with fresh context. "A fresh context improves code review since Claude won't be biased toward code it just wrote." [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**23. Static analysis as CI gates (High Confidence)**
Non-negotiable foundations: formatting (ruff, Prettier), linting, type checking (mypy), security scanning (bandit, gosec) enforced via CI/CD. [Beyond the Vibes - tedivm](https://blog.tedivm.com/guides/2026/03/beyond-the-vibes-coding-assistants-and-agents/)

### S10: Completion — Session Hygiene

**24. Aggressive context clearing between tasks (High Confidence)**
"If you've corrected Claude more than twice on the same issue, the context is cluttered with failed approaches. Run `/clear` and start fresh." Long sessions with accumulated corrections are a primary slop source. [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

**25. Treat CLAUDE.md like code: review, prune, test (Medium Confidence)**
"If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost." [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)

### Conflicting Information

- **ETH Zurich vs. practitioner consensus**: Study suggests AGENTS.md provides marginal benefit at best. Practitioners treat context files as essential. Resolution: *what* you put in the file matters — non-inferable, command-oriented rules help; prose overviews and boilerplate hurt.
- **Emphasis markers**: Anthropic recommends them; ETH Zurich/rules analysis community warns overuse causes "instruction fatigue." Both agree: works in moderation.

## Key Unknowns

1. **Quantified slop metrics**: No measurement of specific slop categories before vs. after applying these techniques.
2. **Model-specific tuning**: How anti-slop rules should differ between Opus, Sonnet, and Haiku beyond Opus over-engineering tendency.
3. **Interaction effects between techniques**: No study on whether combining multiple techniques produces additive or diminishing returns.
4. **Skill design anti-patterns**: Limited published research on how SKILL.md content causes or prevents slop.
5. **Compaction and slop**: Whether auto-compaction loses anti-slop instructions during summarization.
6. **Hook performance at scale**: Whether PostToolUse hooks cause meaningful latency in large codebases.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 15+
