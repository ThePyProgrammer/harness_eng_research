# Axis 1: GitHub Issues & Discussions — Bug Reports and Feature Complaints

## Question
What are the most frequently reported bugs, broken workflows, and feature complaints in the GSD GitHub repos (gsd-build/get-shit-done and gsd-build/gsd-2)?

## Findings

### Summary

Across both **gsd-build/get-shit-done** (v1, 123 open issues) and **gsd-build/GSD-2** (v2, 20+ open issues), complaints cluster into six categories: workflow/routing bugs, installation/update fragility, state management failures, platform compatibility, token/cost concerns, and git integration problems.

### Categorized Complaint Table

| # | Complaint | Category | Severity | Frequency | Status | Repo | Confidence |
|---|-----------|----------|----------|-----------|--------|------|------------|
| 1 | **Updates break existing state/milestones** — "Every update you make breaks everything, it is not able to pickup and continue working on the next milestone." | State mgmt | Critical | High (multiple reporters) | Open | [GSD-2 #528](https://github.com/gsd-build/gsd-2/issues/528) | High |
| 2 | **Infinite looping** — "it keeps asking me the same questions again and again, like an infinite loop" after V1->V2 upgrade | Workflow | Critical | High (linked to #462, #499) | Open | [GSD-2 #456](https://github.com/gsd-build/gsd-2/issues/456) | High |
| 3 | **100% CPU hang + terminal corruption** — process hangs consuming 100% CPU, "SIGTERM does not terminate the process. Only `kill -9` works," terminal left in raw mode after forced kill | Stability | Critical | Medium (4 attempts reproduced) | Open | [GSD-2 #508](https://github.com/gsd-build/gsd-2/issues/508) | High |
| 4 | **Excessive token/agent consumption** — "one bug fix generate a swarm of over 100 agents and eat up 10k tokens in about 60 seconds"; "initial project init burned through 5 hours worth of tokens before finishing planning the first phase" | Cost | High | High (7 comments) | Fixed | [v1 #120](https://github.com/gsd-build/get-shit-done/issues/120) | High |
| 5 | **Auto-answered questions** — After update to 1.22.0, `/gsd:discuss-phase` and `/gsd:settings` auto-answer all questions without user input; traced to Claude Code v2.1.63 regression | Workflow | High | Medium | Open | [v1 #803](https://github.com/gsd-build/get-shit-done/issues/803) | High |
| 6 | **Progress routing to Milestone Complete prematurely** — `/gsd:progress` returns `completed_count: 13` based only on disk directories, ignoring 4 unscaffolded phases in ROADMAP.md | Workflow | High | Medium | Open | [v1 #689](https://github.com/gsd-build/get-shit-done/issues/689) | High |
| 7 | **Subagents don't receive project CLAUDE.md** — executor/planner/researcher agents never see project-level instructions, causing "multiple vulnerabilities that would have been prevented" | Architecture | High | Medium | Fixed | [v1 #671](https://github.com/gsd-build/get-shit-done/issues/671) | High |
| 8 | **Global install corrupted by /gsd:update from $HOME** — "all ~/.claude/ paths in workflow/reference files get rewritten to ./.claude/, breaking GSD" | Installation | High | Medium | Fixed | [v1 #721](https://github.com/gsd-build/get-shit-done/issues/721) | High |
| 9 | **Phase transition skips discuss-phase** — "Both transition.md Route A and execute-phase.md suggest /gsd:plan-phase as primary" instead of routing to discuss-phase first | Workflow | High | Medium | Fixed | [v1 #530](https://github.com/gsd-build/get-shit-done/issues/530) | High |
| 10 | **Stats command broken on Windows** — 6 bugs: git data shows 0 instead of 547 commits, progress shows 100% for partial milestones, phase names truncated, regex case mismatch | Platform | Medium | Medium | Open | [v1 #1065](https://github.com/gsd-build/get-shit-done/issues/1065) | High |
| 11 | **SessionStart hook freezes Claude Code on Windows** — child process not detached properly, blocking input for ~60 seconds | Platform | High | Medium | Fixed | [v1 #466](https://github.com/gsd-build/get-shit-done/issues/466) | High |
| 12 | **init phase-op resolves to archived milestone phases** — "When the current phase has no directory yet, it finds the archived match" from a previous milestone | Workflow | Medium | Medium | Open | [v1 #1064](https://github.com/gsd-build/get-shit-done/issues/1064) | High |
| 13 | **Local install paths inconsistent** — "bash scripts continue referencing $HOME/.claude/" even with --local flag; "creates a mixed installation" | Installation | Medium | Medium | Open | [v1 #1069](https://github.com/gsd-build/get-shit-done/issues/1069) | High |
| 14 | **Remote Questions onboarding fails** — published npm package imports a `.js` module that ships only as `.ts` source, "Cannot find module" error | Packaging | High | Medium | Open | [GSD-2 #592](https://github.com/gsd-build/gsd-2/issues/592) | High |
| 15 | **Git commits not pushed in auto-mode** — "I'm finding myself constantly having to squash slice commits together and remind GSD to actually push commits to main" | Git | Medium | Low (new issue) | Open | [GSD-2 #593](https://github.com/gsd-build/gsd-2/issues/593) | Medium |
| 16 | **TS errors accumulate across milestones** — "build failed with 52 TS errors" in production, dev mode works fine; no automated build verification existed | Quality | Medium | Medium | Fixed | [GSD-2 #470](https://github.com/gsd-build/gsd-2/issues/470) | High |
| 17 | **getMilestoneInfo() always returns v1.0** — regex matches first version in roadmap, not current active milestone | State mgmt | Medium | Medium | Fixed | [v1 #853](https://github.com/gsd-build/get-shit-done/issues/853) | High |
| 18 | **UAT gaps/debug sessions never auto-resolve** — "Debug session files stay at status: investigating forever" even after resolution | Workflow | Medium | Medium | Fixed | [v1 #580](https://github.com/gsd-build/get-shit-done/issues/580) | High |
| 19 | **YAML syntax causes InputValidationError** — map-codebase.md uses YAML that Claude interprets as markdown, not Task tool instructions; Windows path issues compound it | Platform | High | Medium | Fixed | [v1 #217](https://github.com/gsd-build/get-shit-done/issues/217) | High |
| 20 | **Statusline context calculation wrong** — "hardcoded 80% scaling factor" doesn't match Claude Code's actual 83.5% usable context; hook files overwritten silently on update | Accuracy | Low | Low | Fixed | [v1 #769](https://github.com/gsd-build/get-shit-done/issues/769) | High |
| 21 | **Bun runtime incompatibility** — sharp and picomatch modules fail to load under bunx; "Seems odd that stuff like picomatch...require a specialized runtime" | Platform | Low | Low | Open | [GSD-2 #473](https://github.com/gsd-build/gsd-2/issues/473) | Medium |
| 22 | **Worktree path confusion** — `/gsd auto` launches from `.gsd/worktrees/M001-founda` instead of parent directory; "it's no longer able to find my main project" | Workflow | Medium | Low (new) | Open | [GSD-2 #595](https://github.com/gsd-build/gsd-2/issues/595) | Medium |
| 23 | **GSD commands break after Claude Code updates** — colon-syntax slash commands stop working in subdirectories after CC runtime changes | Compatibility | Critical | High | Fixed | [v1 #218](https://github.com/gsd-build/get-shit-done/issues/218) | High |
| 24 | **Archived milestones cause phase number collisions** — milestones in `<details>` blocks cause numbering conflicts with current milestone phases | State mgmt | Medium | Low | Open | [v1 #1060](https://github.com/gsd-build/get-shit-done/issues/1060) | Medium |

### Pattern Analysis

**Most Damaging Category: Workflow/Routing Bugs** (8 issues) — The GSD workflow engine (discuss → plan → execute → verify) has persistent routing fragility. Phase transitions skip steps, progress tracking misreports completion, and archived milestones interfere with current work. These bugs directly undermine the framework's core value proposition.

**Most Frustrating Category: Update/Installation Breakage** (5 issues) — Users repeatedly report that GSD updates break their existing project state. The complaint in [GSD-2 #528](https://github.com/gsd-build/gsd-2/issues/528) — "Every update you make breaks everything" — represents a pattern where path rewriting, hook overwrites, and state schema changes create upgrade anxiety.

**Platform Gaps: Windows** (3 issues) — Windows is consistently underserved: frozen input, broken git commands, incorrect regex, and path separator issues.

**Architectural: Claude Code Coupling** — Several critical bugs (auto-answered questions, command syntax breaking) stem from tight coupling to Claude Code runtime internals. When Anthropic ships CC updates, GSD can break without any GSD code change.

## Key Unknowns

1. **True issue volume**: The v1 repo has 123 open issues; only ~25 examined in depth.
2. **User churn rate**: No data on users who silently abandoned GSD without filing issues.
3. **V1 vs V2 migration pain**: Full scope of migration friction is unclear beyond the infinite looping issue.
4. **Closed issue resolution quality**: Unknown how many were truly fixed vs. closed with workarounds.
5. **Auto-mode reliability at scale**: Multiple issues suggest auto-mode has reliability problems, but true failure rate is unknown.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 24 GitHub Issues
