# Axis 3: Competitive Weaknesses — Why Users Switch Away

## Question
What do users say when comparing GSD unfavorably to alternatives? What are the dealbreakers that drive migration away from GSD?

## Findings

### Comparison Table

| # | Complaint About GSD | Category | Alternative That Solves It | Evidence | Confidence |
|---|---------------------|----------|---------------------------|----------|------------|
| 1 | **No built-in TDD enforcement** — Code can be written without tests, no mechanism to delete untested code | Philosophy | **Superpowers** — Deletes code written before tests, enforces red-green-refactor | [Superpowers Plugin Review](https://www.geeky-gadgets.com/claude-code-superpowers-plugin/); [Superpowers explained](https://blog.devgenius.io/superpowers-explained-the-claude-plugin-that-enforces-tdd-subagents-and-planning-c7fe698c3b82) | HIGH |
| 2 | **Not enterprise-ready** — Lacks role separation, structured handoffs, team coordination | Philosophy | **BMAD** — 21 agents, 50+ workflows, explicit role separation. Rated "Enterprise Ready: Yes" | [SDD Framework Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop) | HIGH |
| 3 | **Solo-developer only; no team coordination** — Documentation acknowledges "no built-in team coordination" | Philosophy | **BMAD** (Party Mode, structured handoffs); **Taskmaster** (task-list for team visibility) | [Context Rot: GSD vs BMAD vs Taskmaster](https://blog.themenonlab.com/blog/context-rot-ai-coding-agents) | HIGH |
| 4 | **Assumes upfront decomposition** — Phase structure constraining for exploratory projects | Philosophy | **Taskmaster** — PRD-first with flexible decomposition. **Vanilla Claude Code** — no constraints | [Context Rot comparison](https://blog.themenonlab.com/blog/context-rot-ai-coding-agents); [GSD Lesson](https://ccforeveryone.com/gsd) | HIGH |
| 5 | **Significant token/cost overhead** — Each subagent needs 5K-15K bootstrap tokens. Agent teams use ~7x more tokens | Implementation | **Taskmaster** — Selective tool loading saves ~16%. **Vanilla CC** — no subagent overhead | [Subagent Cost Explosion](https://www.aicosts.ai/blog/claude-code-subagent-cost-explosion-887k-tokens-minute-crisis); [Context Rot](https://blog.themenonlab.com/blog/context-rot-ai-coding-agents) | HIGH |
| 6 | **Questionable value-add over vanilla prompting** — "precious little of what GSD added in terms of value, other than blowing through tokens" | Philosophy | **Vanilla Claude Code with CLAUDE.md** — "vanilla cc is better than any workflows with smaller tasks" | [HN discussion](https://news.ycombinator.com/item?id=47086847); [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) | MEDIUM |
| 7 | **Fragile compatibility with Claude Code updates** — Commands broke on CC updates (colon syntax, skills migration) | Implementation | **Spec Kit** — Agent-agnostic, 18+ agents, not coupled to one runtime | [Issue #218](https://github.com/gsd-build/get-shit-done/issues/218); [Spec Kit guide](https://intuitionlabs.ai/articles/spec-driven-development-spec-kit) | HIGH |
| 8 | **Auto-answering bug** — v1.22.0 auto-answers all interactive questions | Implementation | **Any alternative** — GSD-specific regression | [Issue #803](https://github.com/gsd-build/get-shit-done/issues/803) | HIGH |
| 9 | **Narrower platform support** — 3 runtimes vs Spec Kit's 18+ | Implementation | **Spec Kit** — 18+ agent support, 70.8K stars, largest community | [Spec Kit guide](https://intuitionlabs.ai/articles/spec-driven-development-spec-kit) | HIGH |
| 10 | **Overkill for quick tasks** — Full cycle takes 45-60 minutes | Philosophy | **Vanilla CC** — no setup. **Ralph Loop** — fast autonomous iteration | [GSD Lesson](https://ccforeveryone.com/gsd); [SDD Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop) | HIGH |
| 11 | **No continuous code review** — Lacks inter-task review blocking on quality | Philosophy | **Superpowers** — "requesting-code-review" skill between tasks, critical issues block progress | [Superpowers Complete Guide](https://www.pasqualepillitteri.it/en/news/215/superpowers-claude-code-complete-guide) | MEDIUM |
| 12 | **v1 was "just prompts"** — No real context control, relied entirely on LLM following instructions | Implementation | **GSD v2** (self-fix); **Taskmaster** (actual CLI); **BMAD** (structured handoffs) | [GSD v2 GitHub](https://github.com/gsd-build/gsd-2); [The New Stack](https://thenewstack.io/beating-the-rot-and-getting-stuff-done/) | HIGH |
| 13 | **Impractical for existing codebases** — "often impractical to introduce retroactively" to large codebases | Philosophy | **Vanilla CC with CLAUDE.md** — works with any codebase. **Cursor rules** — no spec generation | [SDD Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop) | MEDIUM |
| 14 | **Less granular progress tracking** — Phase structure less granular than task-level | Implementation | **Taskmaster** — Task-list interface with dependency-aware status | [Context Rot](https://blog.themenonlab.com/blog/context-rot-ai-coding-agents) | MEDIUM |
| 15 | **"Process feels laborious"** — Structured approaches "remove all the magic" | Philosophy | **Vanilla CC** — direct interaction. **Superpowers** — quality floor without explicit phase management | [HN discussion](https://news.ycombinator.com/item?id=47000206) | MEDIUM |

### Migration Patterns

**Pattern 1: Solo Dev → Enterprise — GSD to BMAD.** When projects need role separation, documented requirements, and structured handoffs. Multiple comparisons rate BMAD "Enterprise Ready: Yes" vs GSD's "Partial." [SDD Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop)

**Pattern 2: Quality-Conscious — GSD to Superpowers.** Developers who prioritize testing discipline choose Superpowers' mandatory TDD gates over GSD's execution speed. Increasingly used together — Superpowers for quality, GSD for execution. [Superpowers Review](https://www.geeky-gadgets.com/claude-code-superpowers-plugin/)

**Pattern 3: Multi-Tool Teams — GSD to Spec Kit.** Teams using multiple AI agents (Cursor, Copilot, Windsurf, Claude Code) find GSD's 3-runtime support limiting vs Spec Kit's 18+. [Spec Kit Guide](https://intuitionlabs.ai/articles/spec-driven-development-spec-kit)

**Pattern 4: Stability-Frustrated — GSD to Vanilla Claude Code.** GSD's CC coupling creates fragility on updates. Some users conclude CLAUDE.md provides "good enough" structure without breakage risk. [Issue #218](https://github.com/gsd-build/get-shit-done/issues/218)

**Pattern 5: Cost-Conscious — GSD to Taskmaster or Vanilla.** Subagent architecture means ~7x token usage. Taskmaster's selective loading or vanilla CC are more economical. [AICosts.ai](https://www.aicosts.ai/blog/claude-code-subagent-cost-explosion-887k-tokens-minute-crisis)

## Key Unknowns

1. **Direct migration stories are scarce** — very few "I switched FROM GSD TO X" narratives found.
2. **GSD v2 may address many v1 complaints** — unclear how many criticisms still apply.
3. **Superpowers + GSD combo usage growing** — unclear if this signals GSD insufficiency or genuine complementarity.
4. **Cursor-specific comparison data thin** — minimal GSD-vs-Cursor-with-rules found.
5. **Real-world GSD cost data absent** — $7x token figure is about CC subagents generally, not GSD specifically.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 15+
