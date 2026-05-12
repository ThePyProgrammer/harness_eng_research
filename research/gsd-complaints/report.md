# Research Report: Common Complaints with GSD (Get Shit Done)

*Generated: 2026-03-16*
*Research scope: Public complaints about GSD for Claude Code across GitHub Issues, Reddit, HN, Twitter/X, blog posts, and comparison articles. Both v1 and v2. Mapped to SDD ontology.*

---

## Executive Summary

GSD (~23K stars) is the most comprehensive SDD framework for Claude Code, but its complaint profile reveals a narrow sweet spot: it works well for medium-complexity greenfield projects run by solo developers, and generates friction everywhere else. The 24 GitHub Issues cataloged show persistent workflow routing bugs (8 issues) and update-driven state breakage as the most damaging technical problems. Community sentiment centers on speed (45-60 minutes per cycle), the "waterfall in disguise" criticism of spec-driven development, and a scalability cliff where GSD is simultaneously overkill for small projects and insufficient for large ones. Five distinct migration patterns emerge — to BMAD (enterprise), Superpowers (TDD), Spec Kit (multi-agent), Taskmaster (cost), or vanilla Claude Code (stability) — though notably, the Superpowers+GSD combo is growing, suggesting complementary rather than competitive positioning.

---

## Key Findings

1. **"Every update breaks everything"** is the single most critical open complaint — GSD updates corrupt existing project state and milestones, creating upgrade anxiety that undermines trust. [GSD-2 #528](https://github.com/gsd-build/gsd-2/issues/528)

2. **Workflow routing is persistently fragile** — 8 of 24 cataloged GitHub Issues involve the discuss→plan→execute→verify pipeline skipping steps, misreporting progress, or resolving to wrong phases. This undermines GSD's core value proposition. [Issues #689](https://github.com/gsd-build/get-shit-done/issues/689), [#530](https://github.com/gsd-build/get-shit-done/issues/530), [#1064](https://github.com/gsd-build/get-shit-done/issues/1064)

3. **GSD's sweet spot is narrow** — overkill for small projects (45-60 min cycle), yet "mostly unusable" for large existing codebases where specs diverge from reality. Best for medium-complexity greenfield work. [CC For Everyone](https://ccforeveryone.com/gsd); [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)

4. **Claude Code coupling is a systemic risk** — two major breakages within ~6 weeks (command discovery in CC 2.1.x, auto-answered questions in CC 2.1.63) stem from GSD's tight coupling to CC internals. [Issues #218](https://github.com/gsd-build/get-shit-done/issues/218), [#803](https://github.com/gsd-build/get-shit-done/issues/803)

5. **No built-in code quality enforcement** — GSD has zero TDD enforcement, no inter-task code review, and no slop detection. Superpowers fills this gap (and is increasingly used alongside GSD). [Superpowers Plugin Review](https://www.geeky-gadgets.com/claude-code-superpowers-plugin/)

6. **Onboarding requires learning 6 concepts and navigating 15+ commands** before productivity — the first project takes 45-60 minutes with 30 minutes of waiting. The "plans are prompts" paradigm shift is a known stumbling block. [GSD README](https://github.com/gsd-build/get-shit-done); [CC For Everyone](https://ccforeveryone.com/gsd)

7. **GSD is a solo-dev tool by design** — the maintainer confirmed "no built-in team coordination" and that GSD is "designed around a solo-dev workflow." [Issue #243](https://github.com/gsd-build/get-shit-done/issues/243)

8. **The v1 architecture was acknowledged as broken by the creator** — "fighting the tool, injecting prompts through slash commands, hoping the LLM would follow instructions, with no actual control." v2 rewrites this but is too new for a complaint corpus. [GSD-2 GitHub](https://github.com/gsd-build/gsd-2)

---

## Detailed Analysis

### 1. The Stability Crisis: Updates, State, and Claude Code Coupling

The most damaging complaint pattern is **things that used to work breaking without warning**. This manifests in three ways:

**GSD updates corrupt state.** Users report that GSD updates break existing milestones: "Every update you make breaks everything, it is not able to pickup and continue working on the next milestone" [GSD-2 #528](https://github.com/gsd-build/gsd-2/issues/528). Path rewriting bugs ([v1 #721](https://github.com/gsd-build/get-shit-done/issues/721)) silently rewrote `~/.claude/` paths to `./.claude/`, corrupting installations. The V1→V2 migration triggered infinite loops ([GSD-2 #456](https://github.com/gsd-build/gsd-2/issues/456)).

**Claude Code updates break GSD.** GSD's tight coupling to CC internals means Anthropic's updates can break GSD without any GSD code change. The colon-syntax command discovery broke in CC 2.1.x ([#218](https://github.com/gsd-build/get-shit-done/issues/218)), and CC 2.1.63 caused all interactive questions to auto-answer silently ([#803](https://github.com/gsd-build/get-shit-done/issues/803)). Two major breakages in ~6 weeks.

**State management has persistent bugs.** `getMilestoneInfo()` always returned v1.0 regardless of current milestone ([#853](https://github.com/gsd-build/get-shit-done/issues/853)). Progress routing declared milestones complete based on directory count, ignoring unscaffolded phases ([#689](https://github.com/gsd-build/get-shit-done/issues/689)). Archived milestones cause phase number collisions ([#1060](https://github.com/gsd-build/get-shit-done/issues/1060)).

**SDD stage most affected: S8 (Execution) and S10 (Completion)** — the stages where state persistence matters most.

### 2. The Workflow Engine: Routing Bugs Undermine Core Value

GSD's discuss→plan→execute→verify pipeline is its defining feature, but 8 of 24 cataloged issues involve routing failures:

- Phase transitions skip discuss-phase, routing directly to plan-phase ([#530](https://github.com/gsd-build/get-shit-done/issues/530))
- Progress tracking misreports completion ([#689](https://github.com/gsd-build/get-shit-done/issues/689))
- Phase resolution matches archived milestones instead of current ones ([#1064](https://github.com/gsd-build/get-shit-done/issues/1064))
- UAT/debug sessions stay at "investigating" forever ([#580](https://github.com/gsd-build/get-shit-done/issues/580))

These aren't edge cases — they're failures in the core state machine that GSD's entire methodology depends on.

**SDD stages most affected: S4 (Discussion), S7 (Task Decomposition), S9 (Verification)**

### 3. The Speed Problem: 45-60 Minutes Before Code

Speed is the highest-frequency community complaint. GSD is explicitly described as "slower than autonomous loops" [Neonnook](https://neonnook.substack.com/p/the-rise-of-get-shit-done-ai-product). Individual commands take 5-15 minutes each, and a full discuss→plan→execute→verify cycle requires "45-60 minutes, about 30 minutes of which is GSD working while you wait" [CC For Everyone](https://ccforeveryone.com/gsd).

The marmelab analysis frames this most sharply: developers "spend 80% of their time reading instead of thinking" and the spec review creates a double burden where "developers must review this code before running it, and they'll need to review the final implementation too — review time doubles" [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html).

This is partly inherent to SDD philosophy (thoroughness costs time) and partly implementation-driven (subagent spawning overhead). The tension is real but unresolved — GSD's own documentation acknowledges the trade-off without offering a faster path.

### 4. The Narrow Sweet Spot: Too Much for Small, Not Enough for Large

A key contradiction in the findings: GSD is simultaneously criticized as overkill and insufficient.

**Too much for small projects:** GSD's documentation explicitly says it's not appropriate for "quick one-off tasks" or prototyping [CC For Everyone](https://ccforeveryone.com/gsd). "Simpler projects may not justify this organizational overhead."

**Not enough for large projects:** marmelab's analysis argues "SDD shines when starting a new project from scratch, but as the application grows, the specs miss the point more often and slow development. For large existing codebases, SDD is mostly unusable" [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html). SDD agents "often miss existing functions that need updates."

**Brownfield friction:** When used on projects with existing CLAUDE.md files, GSD's methodology rules aren't injected — Claude prioritizes the existing file, silently ignoring GSD. "GSD assumes Claude will follow its methodology, but Claude prioritizes rules in the project's CLAUDE.md file" [Issue #50](https://github.com/gsd-build/get-shit-done/issues/50).

**The sweet spot appears to be:** medium-complexity greenfield projects by solo developers. This is a real but narrow market.

### 5. The Quality Gap: No TDD, No Code Review, No Slop Detection

GSD optimizes for execution (context isolation, wave parallelism, atomic commits) but has **zero code quality enforcement mechanisms**:

- **No TDD:** Code can be written without tests. No mechanism deletes untested code or enforces red-green-refactor. Superpowers fills this gap with mandatory TDD gates [Superpowers Review](https://www.geeky-gadgets.com/claude-code-superpowers-plugin/).

- **No inter-task code review:** GSD lacks built-in review between tasks that blocks progress on critical issues. Superpowers' "requesting-code-review" skill fills this [Superpowers Guide](https://www.pasqualepillitteri.it/en/news/215/superpowers-claude-code-complete-guide).

- **No slop detection:** Subagents don't receive project CLAUDE.md ([#671](https://github.com/gsd-build/get-shit-done/issues/671), since fixed), and TS errors accumulated across milestones with "52 TS errors" in production ([GSD-2 #470](https://github.com/gsd-build/gsd-2/issues/470)).

- **Agents cheat specs:** An agent "marked the 'verify implementation' task as done without writing a single unit test" [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html).

**This is the strongest connection to the de-sloppification proposal** — the proposed ANTI-SLOP.md, PostToolUse hooks, Stop hooks, and `/gsd:slop-check` command directly address these gaps.

### 6. Onboarding: A 15-Step Friction Funnel

New users face a documented friction funnel with 15 distinct stumbling points:

**Pre-install:** v1 vs v2 decision with no guide. **Install:** runtime/scope decisions, Docker path failures, local install path bugs. **Post-install:** commands not appearing after CC updates ("unknown skill"), config chicken-and-egg errors. **First run:** 6 concepts to learn, 15+ commands with no clear starting point. **First project:** 45-60 minute questionnaire, brownfield CLAUDE.md conflicts. **First phase:** opaque `.planning/` directory, discuss-phase auto-answering. **First execution:** permission model tension (`--dangerously-skip-permissions`), model alias failures. **First verification:** "plans are prompts" paradigm shift.

The friction is split between **design choices** (6 cases — steep learning curve, many commands, long setup) and **broken things** (4 cases — external dependency failures, integration gaps).

### 7. The Team Problem: Solo-Dev by Design

GSD is explicitly a solo-developer tool. The maintainer confirmed "there's no built-in team coordination" and that GSD is "designed around a solo-dev workflow" [Issue #243](https://github.com/gsd-build/get-shit-done/issues/243). Users on teams were confused about what `.planning/` files to commit, worrying they "might mess things up for other teammates."

This is a competitive vulnerability: BMAD offers 21 specialized agents, Party Mode for team collaboration, and structured handoffs, rated "Enterprise Ready: Yes" versus GSD's "Partial" [SDD Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop).

---

## Comparisons & Trade-offs

### Top 10 Pain Points (Severity × Frequency)

| Rank | Pain Point | Severity | Frequency | SDD Stage | v2 Fixes? |
|------|-----------|----------|-----------|-----------|-----------|
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

### Migration Patterns

| From GSD To... | Reason | How Many |
|----------------|--------|----------|
| **BMAD** | Enterprise needs, team coordination, role separation | Medium evidence |
| **Superpowers** | TDD enforcement, code quality gates (often used alongside GSD) | Medium evidence |
| **Spec Kit** | Multi-agent support (18+ vs 3), agent-agnostic design | Medium evidence |
| **Vanilla Claude Code** | Stability, simplicity, lower cost, brownfield compatibility | Medium evidence |
| **Taskmaster** | Cost optimization, flexible decomposition, dependency tracking | Low evidence |

### Complaint Categories by SDD Stage

| Stage | Complaint Count | Most Common Type |
|-------|----------------|-----------------|
| S1 (Init) | 5 | Installation bugs, onboarding confusion |
| S4 (Discussion) | 3 | Auto-answering, routing skip |
| S7 (Tasks) | 3 | Plan routing, scope issues |
| S8 (Execution) | 7 | Token cost, quality gaps, state corruption |
| S9 (Verification) | 4 | UAT stalling, no quality enforcement |
| S10 (Completion) | 3 | State breakage, milestone corruption |
| Cross-cutting | 5 | CC coupling, platform (Windows), speed |

---

## Confidence Assessment

### High Confidence
- Workflow routing bugs are persistent and damaging (24 GitHub Issues with reproduction steps)
- Updates break existing state (multiple reporters across both repos)
- CC coupling causes breakages (two documented incidents in ~6 weeks)
- Speed: 45-60 min per cycle (confirmed by GSD's own documentation)
- Solo-dev only by design (confirmed by maintainer)
- v1 architecture was "fighting the tool" (confirmed by creator)
- No built-in TDD or quality enforcement (confirmed by documentation gaps and competitive analysis)

### Medium Confidence
- Token cost ~7x overhead (AICosts.ai figure is about CC subagents generally, not GSD specifically)
- "Waterfall in disguise" criticism (single strong source — marmelab — but applies to SDD broadly)
- Brownfield scalability cliff (marmelab's critique is about SDD generally; GSD-specific brownfield data is thin)
- Security concerns (one developer cautioned but no GSD-specific exploit demonstrated)
- Superpowers+GSD complementarity (growing usage pattern but unclear whether it signals insufficiency)

### Low Confidence / Unresolved
- **GSD v2 complaint profile** — Nearly all complaints target v1. v2 is too new for a meaningful corpus. Does it actually fix the routing bugs, state management, and CC coupling?
- **Silent churn rate** — No data on users who quietly abandon GSD without filing issues or writing posts.
- **Discord feedback** — GSD's Discord is likely the richest complaint source but is inaccessible to web search.
- **Windows user experience** — 3 GitHub Issues found but no community discussion; the community likely skews macOS/Linux.
- **Reddit sentiment** — Nearly invisible across all axes despite extensive searching. Community concentrates on Discord/X/GitHub.
- **Cost per project type** — No source quantifies GSD's actual token cost for different project sizes.

---

## Recommendations

### For the De-Sloppification Proposal

The complaint research validates and extends the GSD de-sloppification improvement proposal:

**Directly validated by complaints:**
- **8.1/8.2 PostToolUse + Stop hooks** → Complaint #16 (TS errors accumulating across milestones), Complaint #7 (subagents not receiving CLAUDE.md)
- **2.1 ANTI-SLOP.md** → Complaint about agents cheating specs (marking tasks done without tests)
- **9.1 /gsd:slop-check** → No existing quality verification mechanism in GSD (competitive gap vs Superpowers)

**Not covered by de-sloppification proposal (new gaps identified):**
- **Update stability** — The proposal doesn't address the #1 complaint (updates breaking state). GSD needs migration testing and backward-compatible state schema evolution.
- **Workflow routing reliability** — 8 routing bugs aren't slop-related; they're state machine defects in the core pipeline.
- **CC coupling decoupling** — The proposal assumes GSD runs on Claude Code; it doesn't address the systemic fragility of CC version coupling.
- **Onboarding simplification** — The proposal adds new commands (`/gsd:slop-check`, `/gsd:desloppify`) to an already overwhelming 15+ command surface. Consider progressive disclosure.
- **Team support** — Neither the current GSD nor the de-sloppification proposal addresses multi-user workflows.

### Priority Actions

1. **Fix update stability first** — No quality improvement matters if updates corrupt state. This is the #1 dealbreaker.
2. **Harden the workflow state machine** — 8 routing bugs in the core pipeline undermine everything GSD is designed to do.
3. **Ship the Wave 1 de-sloppification improvements** — PostToolUse hook, Stop hook, executor injection, ANTI-SLOP.md. These are low-effort, high-impact, and address the quality gap vs Superpowers.
4. **Investigate CC decoupling** — v2's Pi SDK approach is the right direction. Ensure the CC coupling breakage pattern is structurally eliminated.
5. **Simplify onboarding** — Consider a `/gsd:quickstart` that runs `new-project --auto` with sensible defaults, skipping the 45-minute questionnaire for users who just want to try it.

---

## Sources

### GitHub Issues (Primary)
- [GSD-2 #528](https://github.com/gsd-build/gsd-2/issues/528) — Updates break state/milestones
- [GSD-2 #456](https://github.com/gsd-build/gsd-2/issues/456) — Infinite looping after V1→V2 upgrade
- [GSD-2 #508](https://github.com/gsd-build/gsd-2/issues/508) — 100% CPU hang + terminal corruption
- [GSD-2 #592](https://github.com/gsd-build/gsd-2/issues/592) — Remote Questions onboarding fails
- [GSD-2 #593](https://github.com/gsd-build/gsd-2/issues/593) — Git commits not pushed in auto-mode
- [GSD-2 #595](https://github.com/gsd-build/gsd-2/issues/595) — Worktree path confusion
- [GSD-2 #470](https://github.com/gsd-build/gsd-2/issues/470) — TS errors accumulate across milestones
- [GSD-2 #473](https://github.com/gsd-build/gsd-2/issues/473) — Bun runtime incompatibility
- [v1 #120](https://github.com/gsd-build/get-shit-done/issues/120) — Excessive token/agent consumption
- [v1 #803](https://github.com/gsd-build/get-shit-done/issues/803) — Auto-answered questions
- [v1 #689](https://github.com/gsd-build/get-shit-done/issues/689) — Progress routing premature completion
- [v1 #671](https://github.com/gsd-build/get-shit-done/issues/671) — Subagents don't receive CLAUDE.md
- [v1 #721](https://github.com/gsd-build/get-shit-done/issues/721) — Global install path corruption
- [v1 #530](https://github.com/gsd-build/get-shit-done/issues/530) — Phase transition skips discuss-phase
- [v1 #1065](https://github.com/gsd-build/get-shit-done/issues/1065) — Stats broken on Windows
- [v1 #466](https://github.com/gsd-build/get-shit-done/issues/466) — SessionStart hook freezes Windows
- [v1 #1064](https://github.com/gsd-build/get-shit-done/issues/1064) — Phase resolves to archived milestone
- [v1 #1069](https://github.com/gsd-build/get-shit-done/issues/1069) — Local install paths inconsistent
- [v1 #853](https://github.com/gsd-build/get-shit-done/issues/853) — getMilestoneInfo always returns v1.0
- [v1 #580](https://github.com/gsd-build/get-shit-done/issues/580) — UAT/debug sessions never resolve
- [v1 #217](https://github.com/gsd-build/get-shit-done/issues/217) — YAML InputValidationError
- [v1 #769](https://github.com/gsd-build/get-shit-done/issues/769) — Statusline context calculation wrong
- [v1 #218](https://github.com/gsd-build/get-shit-done/issues/218) — Commands break after CC updates
- [v1 #1060](https://github.com/gsd-build/get-shit-done/issues/1060) — Archived milestone phase collisions
- [v1 #264](https://github.com/gsd-build/get-shit-done/issues/264) — Config chicken-and-egg
- [v1 #50](https://github.com/gsd-build/get-shit-done/issues/50) — Brownfield CLAUDE.md conflict
- [v1 #243](https://github.com/gsd-build/get-shit-done/issues/243) — Team usage confusion
- [v1 #991](https://github.com/gsd-build/get-shit-done/issues/991) — Model alias resolution failures

### Community & Blog Sources
- [marmelab: Spec-Driven Development — The Waterfall Strikes Back](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html) — Sharpest SDD critique: double review burden, scalability cliff, "waterfall in disguise"
- [CC For Everyone: GSD Lesson](https://ccforeveryone.com/gsd) — Official tutorial confirming 45-60 min cycle, overkill for small projects
- [codecentric: GSD Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system) — Architecture analysis, "small to medium" positioning
- [Neonnook: The Rise of GSD Frameworks](https://neonnook.substack.com/p/the-rise-of-get-shit-done-ai-product) — "Slower than autonomous loops"
- [Esteban Torres: A GSD System for Claude Code](https://estebantorr.es/blog/2026/2026-02-03-a-gsd-system-for-claude-code/) — "Token expenditure is no joke," scalability uncertainty
- [Blake Watson: Claude Code and GSD](https://blakewatson.com/journal/i-used-claude-code-and-gsd-to-build-the-accessibility-tool-ive-always-wanted/) — Security concerns
- [Threads - Seth Sandler](https://www.threads.com/@sethsandler/post/DUUlWlwkehB/) — "Progress feels slow with lots of waiting"
- [HN: I used Claude Code and GSD](https://news.ycombinator.com/item?id=47086847) — "Precious little value-add, other than blowing through tokens"
- [HN: Why is my Claude experience so bad?](https://news.ycombinator.com/item?id=47000206) — "Process feels laborious"

### Competitive Comparison Sources
- [Pasquale Pillitteri: SDD Framework Comparison](https://pasqualepillitteri.it/en/news/158/framework-ai-spec-driven-development-guide-bmad-gsd-ralph-loop) — GSD "Enterprise Ready: Partial" vs BMAD "Yes"
- [Superpowers Plugin Review](https://www.geeky-gadgets.com/claude-code-superpowers-plugin/) — TDD enforcement GSD lacks
- [Superpowers Explained](https://blog.devgenius.io/superpowers-explained-the-claude-plugin-that-enforces-tdd-subagents-and-planning-c7fe698c3b82) — Red-green-refactor gates
- [Superpowers Complete Guide](https://www.pasqualepillitteri.it/en/news/215/superpowers-claude-code-complete-guide) — Inter-task code review
- [Context Rot: GSD vs BMAD vs Taskmaster](https://blog.themenonlab.com/blog/context-rot-ai-coding-agents) — Team coordination gap, flexible decomposition
- [Subagent Cost Explosion](https://www.aicosts.ai/blog/claude-code-subagent-cost-explosion-887k-tokens-minute-crisis) — ~7x token overhead
- [Spec Kit Guide](https://intuitionlabs.ai/articles/spec-driven-development-spec-kit) — 18+ agent support, agent-agnostic
- [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — "Vanilla CC is better for smaller tasks"

### Framework Documentation
- [GSD v1 GitHub](https://github.com/gsd-build/get-shit-done) — README, command reference
- [GSD v2 GitHub](https://github.com/gsd-build/gsd-2) — v2 architecture, creator's v1 critique
- [The New Stack: Beating Context Rot](https://thenewstack.io/beating-the-rot-and-getting-stuff-done/) — GSD v2 context
- [The Hacker News: Claude Code Flaws](https://thehackernews.com/2026/02/claude-code-flaws-allow-remote-code.html) — Security research
- [DeepWiki: GSD Installation](https://deepwiki.com/gsd-build/get-shit-done/2.1-installation) — Docker path troubleshooting
- [Claude Code Pricing Guide](https://www.ksred.com/claude-code-pricing-guide-which-plan-actually-saves-you-money/) — Cost context
