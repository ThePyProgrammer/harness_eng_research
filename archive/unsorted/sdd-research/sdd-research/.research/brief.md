# Executive Brief: Spec-Driven Agentic Coding Workflows

*Generated: 2026-03-12 | Source: research report (~6,500 words)*

## Bottom Line

Every spec-driven development tool converges on the same four-stage pipeline (Specify → Plan → Tasks → Implement), but the decisions that actually determine quality are context management strategy, human gate placement, and whether you enforce constraints through code-level hooks or markdown specs — hooks win decisively, because agents routinely ignore markdown instructions regardless of formatting sophistication.

## Key Findings

- **Universal pipeline convergence** — all 27 tools independently arrived at Specify → Plan → Tasks → Implement, making this the field's strongest consensus. — [All tool repositories; GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- **Fresh context per task prevents quality degradation** — AI performance degrades past 40% context usage; GSD, Smart Ralph, and Agent Teams Lite all independently converged on spawning clean contexts per task. — [Context Engineering 101](https://newsletter.victordibia.com/p/context-engineering-101-how-agents)
- **Plan files ARE the prompts** — the most effective tools don't separate documentation from AI instructions; subagents read plan files directly from disk. — [codecentric GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system)
- **Code-level hooks vastly outperform prompt-level constraints** — Thoughtworks found agents "frequently ignored instructions" despite comprehensive specs; Pilot Shell's PostToolUse hooks that run linters after every edit are more reliable than any spec-based guardrail. — [Martin Fowler SDD Analysis](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- **The four-field task atom works** — files, action, verify, done — independently discovered by GSD, PAUL, Smart Ralph, and Spec Kit. "If you can't specify all four, the task is too vague." — [GSD](https://github.com/gsd-build/get-shit-done); [PAUL](https://github.com/ChristopherKahler/paul)
- **BDD acceptance criteria are the most valuable spec artifact** — Given/When/Then format provides mechanical task decomposition and clear definition of done across every mature tool. — [Kiro SDD Experience Report](https://dev.to/aws-builders/what-i-learned-using-specification-driven-development-with-kiro-pdj)
- **Spec drift is the most dangerous failure mode** — stale specs mislead agents, and only OpenSpec has mature delta-based evolution. Most tools treat specs as write-once. — [Augment Code](https://www.augmentcode.com/blog/what-spec-driven-development-gets-wrong)
- **No empirical effectiveness data exists** — zero controlled studies compare SDD approaches. All claims are self-reported or anecdotal. — [Report Confidence Assessment]

## Critical Trade-offs

1. **Fresh context vs. in-session compaction**: GSD spawns clean contexts per task; Pilot Shell manages compaction within a session. Both claim superiority — fresh contexts are simpler, compaction preserves continuity for exploratory work. No comparative data exists.
2. **Platform depth vs. breadth**: Claude Code-exclusive tools (Pilot Shell) unlock hooks, model routing, and deep integration. Multi-platform tools (Spec Kit, OpenSpec) reach more users but are limited to the lowest common denominator of slash commands + markdown.
3. **Ceremony level**: The spectrum from OpenSpec (3 commands) to BMAD (21 agents, 34 workflows) is enormous. One-size-fits-all ceremony kills developer experience — build a Quick mode for small tasks alongside a Full mode for features.

## Recommendations

1. **Enforce quality through code-level hooks (PostToolUse linters, TDD enforcement), not markdown specs** — this is the single highest-leverage investment.
2. **Use the four-field task atom** (files, action, verify, done) and fresh context per task as your execution foundation — both are independently validated by multiple tools.
3. **Keep artifact count to 2-4 files per feature** — Spec Kit's 8+ files were criticized as "repetitive, both with each other and with the code"; minimize ceremony.
4. **Never let the agent write its own specs from scratch** — "Claude implements what it wrote, not what you actually need." Human provides domain knowledge; AI structures it.
5. **Plan for spec evolution from day one** — adopt delta tracking or phase summaries; most tools fail here because they treat specs as write-once.

## Confidence & Limitations

The convergence patterns (pipeline structure, task atoms, fresh context, hooks > prompts) are high-confidence findings validated across 4+ independent tools. However, the entire field lacks empirical effectiveness data — no controlled studies compare SDD tools against each other or against unstructured AI coding. Long-term spec maintenance costs, team-scale dynamics, and API token cost implications remain completely unknown.

---
*Full report: .research/report.md*
*Research depth: deep*
