# What Is Harness Engineering?

A coding agent's **harness** is its runtime environment and peripheral systems — the configuration surfaces through which an AI model interacts with its environment. The fundamental equation:

```
coding agent = AI model(s) + harness
```

The 2026 consensus is that **the harness, not the model, is the bottleneck**. Terminal Bench 2.0 demonstrated this: Opus achieved #33 in Claude Code but #5 in a different harness — same model, different results based purely on how the harness was configured.

## The Evolution

| Era | Focus | Scope |
|-----|-------|-------|
| **Prompt Engineering** (2023-2024) | Single prompt optimization | One input → one output |
| **Context Engineering** (mid-2025) | Systematic context management | What the model sees |
| **Harness Engineering** (2026) | Full environment design | Everything around the model |

## Six Configuration Levers

The [HumanLayer article](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) identifies six levers harness engineers can tune:

1. **CLAUDE.md / AGENTS.md** — Markdown files injected into system prompts. ETH Zurich found LLM-generated ones *hurt* performance (-3% success, +20% cost). Keep under 60 lines, non-inferable content only.

2. **MCP Servers** — Tool descriptions are injected into system prompts. Too many tools push agents into "the dumb zone." Prefer CLI commands already in training data.

3. **Skills** — Reusable knowledge modules loaded on demand. Treat skill registries like untrusted npm packages.

4. **Sub-Agents** — Isolated sessions preventing context pollution. Use cheaper models for sub-tasks. Context rot degrades performance at longer context lengths.

5. **Hooks** — Automated scripts at lifecycle events. The cardinal rule: **success is silent, only failures produce output**.

6. **Back-Pressure** — Verification systems (type checking, linting, tests). Must be context-efficient — only surface errors, never passing test output.

## What Didn't Work

- Upfront harness design before encountering real failures
- Installing dozens of skills/MCP servers "just in case"
- Running full test suites after every agent action (4,000+ line context pollution)
- Micro-optimizing tool access across sub-agents

## What Did Work

- Start simple, add configuration only upon failure
- Test, iterate, discard unhelpful components
- Distribute battle-tested configurations team-wide
- Optimize iteration speed over first-attempt success

## See Also

- [[what-is-slop|What Is Code Slop?]] — The quality problem harnesses must solve
- [[sdd-ontology|SDD Ontology]] — Universal framework for evaluating harness completeness
- [[gsd-desloppification|GSD Improvement Proposal]] — Applying harness engineering to slop prevention
- [[harness-frameworks-report|Harness Frameworks Research]] — Full landscape survey

## Sources

- [HumanLayer: Skill Issue](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [Anthropic: Effective Harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [ETH Zurich AGENTS.md Study](https://www.infoq.com/news/2026/03/agents-context-file-value-review/)
