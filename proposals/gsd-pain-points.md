# GSD Pain Points

*Synthesized from 66 sources across GitHub Issues, community forums, blog posts, and competitive comparisons. March 2026.*

---

## Top 10 Pain Points (ranked by severity x frequency)

| # | Pain Point | Severity | Frequency | SDD Stage | v2 Fixes? |
|---|-----------|----------|-----------|-----------|-----------|
| 1 | Updates break state/milestones | Dealbreaker | High | S8, S10 | Unclear |
| 2 | Workflow routing skips steps / misreports | Dealbreaker | High | S4, S7, S9 | Partially |
| 3 | Claude Code coupling breakages | Dealbreaker | High | All | v2 decouples |
| 4 | 45-60 min cycle time | Major friction | High | S4-S9 | No |
| 5 | No TDD / quality enforcement | Major friction | Medium | S8, S9 | No |
| 6 | Token/cost overhead (~7x) | Major friction | Medium | S8 | v2 tracks cost |
| 7 | Solo-dev only / no team support | Major friction | Medium | All | No |
| 8 | 15+ commands, steep learning curve | Major friction | Medium | S1 | v2 simplifies |
| 9 | Overkill for small projects | Major friction | Medium-High | S3-S7 | No |
| 10 | Brownfield/existing codebase friction | Major friction | Medium | S1, S3 | Unknown |

---

## 1. Stability: Updates Break Everything

**The #1 dealbreaker.** Users report that GSD updates corrupt existing project state and milestones.

> "Every update you make breaks everything, it is not able to pickup and continue working on the next milestone."
> — [GSD-2 #528](https://github.com/gsd-build/gsd-2/issues/528)

**How it manifests:**
- Path rewriting bugs silently rewrite `~/.claude/` to `./.claude/`, corrupting installations [v1 #721](https://github.com/gsd-build/get-shit-done/issues/721)
- V1→V2 migration triggers infinite loops: "it keeps asking me the same questions again and again" [GSD-2 #456](https://github.com/gsd-build/gsd-2/issues/456)
- Hook files overwritten silently on update [v1 #769](https://github.com/gsd-build/get-shit-done/issues/769)
- `getMilestoneInfo()` regex matched first version in roadmap, not current milestone [v1 #853](https://github.com/gsd-build/get-shit-done/issues/853)

**Root cause:** No migration testing, no backward-compatible state schema evolution, no version compatibility matrix.

---

## 2. Workflow Routing: The Core Pipeline Is Fragile

8 of 24 cataloged GitHub Issues involve the discuss→plan→execute→verify state machine failing. This directly undermines GSD's core value proposition.

- Phase transitions skip discuss-phase, routing directly to plan-phase [v1 #530](https://github.com/gsd-build/get-shit-done/issues/530)
- `/gsd:progress` declares milestones complete based on directory count, ignoring unscaffolded phases [v1 #689](https://github.com/gsd-build/get-shit-done/issues/689)
- Phase resolution matches archived milestones instead of current ones [v1 #1064](https://github.com/gsd-build/get-shit-done/issues/1064)
- UAT/debug sessions stay at "investigating" forever even after resolution [v1 #580](https://github.com/gsd-build/get-shit-done/issues/580)
- Archived milestones cause phase number collisions [v1 #1060](https://github.com/gsd-build/get-shit-done/issues/1060)
- 100% CPU hang with terminal corruption — "SIGTERM does not terminate the process. Only `kill -9` works" [GSD-2 #508](https://github.com/gsd-build/gsd-2/issues/508)

---

## 3. Claude Code Coupling: Systemic Fragility

GSD is tightly coupled to Claude Code's internal APIs. When Anthropic ships CC updates, GSD breaks without any GSD code change. **Two major breakages within ~6 weeks:**

- CC 2.1.x broke command discovery — colon-syntax slash commands stopped working. "I can't get any gsd slash commands to show up — unknown skill" [v1 #218](https://github.com/gsd-build/get-shit-done/issues/218)
- CC 2.1.63 caused `/gsd:discuss-phase` and `/gsd:settings` to auto-answer all questions without displaying UI [v1 #803](https://github.com/gsd-build/get-shit-done/issues/803)
- SessionStart hook froze Claude Code input on Windows by spawning an undetached child process [v1 #466](https://github.com/gsd-build/get-shit-done/issues/466)

**GSD's creator acknowledged the root cause:** v1 was "fighting the tool — injecting prompts through slash commands, hoping the LLM would follow instructions, with no actual control over context windows, sessions, or execution." [GSD-2 GitHub](https://github.com/gsd-build/gsd-2)

v2's Pi SDK approach structurally decouples from CC internals — but v2 is too new to confirm the fix at scale.

---

## 4. Speed: 45-60 Minutes Before Code

The highest-frequency community complaint.

> "progress feels slow with lots of waiting"
> — [Threads - Seth Sandler](https://www.threads.com/@sethsandler/post/DUUlWlwkehB/)

- Individual commands take 5-15 minutes each [CC For Everyone](https://ccforeveryone.com/gsd)
- Full discuss→plan→execute→verify cycle: "45-60 minutes, about 30 minutes of which is GSD working while you wait" [CC For Everyone](https://ccforeveryone.com/gsd)
- GSD is explicitly "slower than autonomous loops" like Ralph Loop [Neonnook](https://neonnook.substack.com/p/the-rise-of-get-shit-done-ai-product)
- Specs create a double review burden: "developers must review this code before running it, and they'll need to review the final implementation too. Review time doubles." [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)

---

## 5. No Code Quality Enforcement

GSD optimizes for execution speed and context isolation but has **zero code quality mechanisms**:

- **No TDD enforcement** — code can be written without tests. Superpowers fills this with mandatory red-green-refactor that deletes code written before tests. [Superpowers Review](https://www.geeky-gadgets.com/claude-code-superpowers-plugin/)
- **No inter-task code review** — no mechanism blocks progress on quality issues between tasks. Superpowers' "requesting-code-review" skill fills this. [Superpowers Guide](https://www.pasqualepillitteri.it/en/news/215/superpowers-claude-code-complete-guide)
- **No slop detection** — no linting hooks, no type-check gates, no dead code scanning
- **Agents cheat specs** — an agent "marked the 'verify implementation' task as done without writing a single unit test" [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)
- **TS errors accumulated silently** — "build failed with 52 TS errors" in production; dev mode worked fine [GSD-2 #470](https://github.com/gsd-build/gsd-2/issues/470)
- **Subagents didn't receive CLAUDE.md** — executor/planner/researcher agents never saw project-level instructions, causing "multiple vulnerabilities that would have been prevented" [v1 #671](https://github.com/gsd-build/get-shit-done/issues/671) (since fixed)

**Connection to [[gsd-desloppification|de-sloppification proposal]]:** The proposed ANTI-SLOP.md, PostToolUse hooks, Stop hooks, and `/gsd:slop-check` directly address this gap.

---

## 6. Token/Cost Overhead

- "one bug fix generated a swarm of over 100 agents and eat up 10k tokens in about 60 seconds" [v1 #120](https://github.com/gsd-build/get-shit-done/issues/120)
- "initial project init burned through 5 hours worth of tokens before finishing planning the first phase" [v1 #120](https://github.com/gsd-build/get-shit-done/issues/120)
- Each subagent needs 5K-15K tokens for context bootstrapping. Agent teams use ~7x more tokens than single-agent sessions. [Subagent Cost Explosion](https://www.aicosts.ai/blog/claude-code-subagent-cost-explosion-887k-tokens-minute-crisis)
- "the token expenditure is no joke" — framed as worthwhile by some, but a dealbreaker for others [Esteban Torres](https://estebantorr.es/blog/2026/2026-02-03-a-gsd-system-for-claude-code/)

v2 adds per-unit token/cost tracking with budget ceilings that pause auto-mode, but doesn't reduce the underlying token consumption.

---

## 7. Solo-Dev Only

> "there's no built-in team coordination"
> — GSD maintainer, [Issue #243](https://github.com/gsd-build/get-shit-done/issues/243)

- GSD is "designed around a solo-dev workflow" [Issue #243](https://github.com/gsd-build/get-shit-done/issues/243)
- Users confused about what `.planning/` files to commit: "might mess things up for other teammates" [Issue #243](https://github.com/gsd-build/get-shit-done/issues/243)
- Rated "Enterprise Ready: Partial" vs BMAD's "Yes" [SDD Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop)
- BMAD offers 21 agents, Party Mode, structured handoffs; Taskmaster offers task-list for team visibility [Context Rot comparison](https://blog.themenonlab.com/blog/context-rot-ai-coding-agents)

---

## 8. Steep Learning Curve

**6 concepts to learn before being productive:** Context Engineering (file ecosystem), XML-Structured Plans, Multi-Agent Orchestration, Wave Execution, Atomic Git Commits, Phase-Based Iteration. The README acknowledges: "The complexity is in the system, not in your workflow." [GSD README](https://github.com/gsd-build/get-shit-done)

**15+ commands with no clear starting point.** Onboarding UX was later improved to suggest `/gsd:new-project` instead of `/gsd:help`. [GSD README](https://github.com/gsd-build/get-shit-done)

**"Plans are prompts" paradigm shift.** PLAN.md files are executable prompts for subagents, not documentation. CC For Everyone tutorial explicitly teaches this distinction, indicating it's a known stumbling block. [CC For Everyone](https://ccforeveryone.com/gsd)

**v1 vs v2 confusion.** Users must choose between two fundamentally different architectures with no prominent "which version?" guide. [GSD-2 GitHub](https://github.com/gsd-build/gsd-2)

---

## 9. Overkill for Small Projects

GSD's own documentation acknowledges: not appropriate for "quick one-off tasks" or prototyping. "Simpler projects may not justify this organizational overhead." [CC For Everyone](https://ccforeveryone.com/gsd)

> "there was precious little of what GSD added in terms of value, other than the author saying it did some process stuff and blew through a bunch of tokens"
> — [HN discussion](https://news.ycombinator.com/item?id=47086847)

---

## 10. Brownfield / Existing Codebase Friction

- With a pre-existing CLAUDE.md, GSD's methodology rules aren't injected — "GSD assumes Claude will follow its methodology, but Claude prioritizes rules in the project's CLAUDE.md file" [Issue #50](https://github.com/gsd-build/get-shit-done/issues/50)
- "SDD shines when starting from scratch, but as the application grows, the specs miss the point more often. For large existing codebases, SDD is mostly unusable." [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)
- SDD agents "often miss existing functions that need updates" [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)

---

## Additional Issues

### Platform: Windows (3 issues)
- Stats command broken — 6 sub-bugs including git data showing 0, progress at 100% for partial milestones [v1 #1065](https://github.com/gsd-build/get-shit-done/issues/1065)
- SessionStart hook froze input for ~60 seconds [v1 #466](https://github.com/gsd-build/get-shit-done/issues/466)
- YAML syntax + Windows path issues caused InputValidationError [v1 #217](https://github.com/gsd-build/get-shit-done/issues/217)

### Installation Bugs
- Local install paths inconsistent — "bash scripts continue referencing $HOME/.claude/" with --local flag [v1 #1069](https://github.com/gsd-build/get-shit-done/issues/1069)
- Docker/container tilde path expansion failures — must set `CLAUDE_CONFIG_DIR` manually [DeepWiki](https://deepwiki.com/gsd-build/get-shit-done/2.1-installation)
- Remote Questions onboarding fails — npm package ships `.ts` but imports `.js` [GSD-2 #592](https://github.com/gsd-build/gsd-2/issues/592)
- Model alias resolution failures — `executor_model: "sonnet"` causes 404 errors [v1 #991](https://github.com/gsd-build/get-shit-done/issues/991)

### Git Integration
- Auto-mode doesn't push commits: "constantly having to squash slice commits together and remind GSD to actually push" [GSD-2 #593](https://github.com/gsd-build/gsd-2/issues/593)
- Worktree path confusion — `/gsd auto` launches from wrong directory [GSD-2 #595](https://github.com/gsd-build/gsd-2/issues/595)

### Security
- "I don't think using this directly on your machine is a super great idea. _I_ did it." — risk from including external prompts without monitoring [Blake Watson](https://blakewatson.com/journal/i-used-claude-code-and-gsd-to-build-the-accessibility-tool-ive-always-wanted/)
- Broader CC security research shows malicious repos can exploit hooks, MCP servers, and env vars [The Hacker News](https://thehackernews.com/2026/02/claude-code-flaws-allow-remote-code.html)

### Philosophy: "Waterfall in Disguise"
- marmelab titled their SDD analysis "The Waterfall Strikes Back" — arguing SDD frameworks repeat waterfall mistakes by attempting to remove developers from development [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)
- Specs generate "many repetitions, imaginary corner cases, and overkill refinements" [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)
- "In most cases, SDD adds little benefit. Sometimes, it even increases the cost of feature development." [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)

---

## Migration Patterns: Why Users Leave

| To... | Reason | Evidence Level |
|-------|--------|----------------|
| **BMAD** | Enterprise needs, team coordination, role separation | Medium |
| **Superpowers** | TDD enforcement, code quality (often used *alongside* GSD) | Medium |
| **Spec Kit** | Multi-agent support (18+ vs 3), agent-agnostic | Medium |
| **Vanilla Claude Code** | Stability, simplicity, lower cost, brownfield works | Medium |
| **Taskmaster** | Cost optimization, flexible decomposition | Low |

---

## What the De-Sloppification Proposal Addresses (and What It Doesn't)

### Addressed by [[gsd-desloppification|the proposal]]
- No TDD / quality enforcement → ANTI-SLOP.md, PostToolUse hooks, Stop hooks
- Subagents missing CLAUDE.md → executor anti-slop injection
- TS errors accumulating → Stop hook type-check gate
- Agents cheating specs → plan-checker slop gates
- No slop detection → `/gsd:slop-check`, desloppify integration

### NOT addressed (new gaps from this research)
- **Update stability** — #1 dealbreaker. Needs migration testing, backward-compatible state schemas.
- **Workflow routing bugs** — 8 state machine defects. Not slop-related; infrastructure problems.
- **CC coupling fragility** — Systemic risk from tight runtime coupling.
- **Command surface overload** — Adding `/gsd:slop-check` and `/gsd:desloppify` to 15+ commands without progressive disclosure.
- **Team support** — Neither GSD nor the proposal addresses multi-user workflows.
- **Speed** — 45-60 min cycle time is inherent to the SDD approach. No proposal addresses this.
- **Brownfield friction** — CLAUDE.md conflict and spec drift on large codebases remain unresolved.

## See Also

- [[gsd-desloppification|GSD De-Sloppification Proposal]] — 13 quality improvements across S1-S10
- [[what-is-slop|What Is Code Slop?]] — The quality problem GSD currently doesn't address
- [[desloppify|Desloppify]] — Post-hoc tool that could power `/gsd:slop-check`
- [[sdd-ontology|SDD Ontology]] — The S1-S10 framework these pain points map to
- [[de-sloppification-report|De-Sloppification Research]] — Three-stage defense model
