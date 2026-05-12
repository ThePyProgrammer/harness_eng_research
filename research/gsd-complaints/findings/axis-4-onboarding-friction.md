# Axis 4: Onboarding & Learning Curve — First-Time User Friction

## Question
What specific friction do new users encounter when installing, configuring, and running GSD for the first time? What makes the learning curve steep?

## Findings

### Friction Funnel: Install Through First Verification

#### 1. Pre-Installation: Decision Overload
Users must decide between GSD v1 (`npx get-shit-done-cc`) and v2 (`npm install -g gsd-pi`) with no prominent "which version?" guide. The two have fundamentally different architectures. [GSD-2 GitHub](https://github.com/gsd-build/gsd-2)

**Type:** Documentation gap · **Confidence:** Medium

#### 2. Installation: Runtime and Scope Decisions
Installer requires choosing runtime (Claude Code/OpenCode/Gemini/Codex/all) and scope (global/local). Local installations had a confirmed bug where scripts still referenced `$HOME/.claude/` instead of local paths. [Issue #1069](https://github.com/gsd-build/get-shit-done/issues/1069)

**Type:** Design friction + bug · **Confidence:** High

#### 3. Installation: Docker/Container Path Failures
Tilde paths (`~/.claude/`) don't expand in containers. Users must set `CLAUDE_CONFIG_DIR` before installing — not surfaced during install. [DeepWiki](https://deepwiki.com/gsd-build/get-shit-done/2.1-installation)

**Type:** Environmental friction · **Confidence:** High

#### 4. Post-Installation: Commands Not Appearing
After CC updates, GSD commands show "unknown skill." Caused by CC 2.1.x breaking changes to command discovery (commands/ → skills/ migration, disallowing colons). User: "I can't get any gsd slash commands to show up." [Issue #218](https://github.com/gsd-build/get-shit-done/issues/218)

**Type:** Broken (external dependency) · **Confidence:** High (3+ confirmed users)

#### 5. Post-Installation: Config Chicken-and-Egg
`/gsd:set-profile` errored because `.planning/config.json` didn't exist yet. Classified as priority: critical. [Issue #264](https://github.com/gsd-build/get-shit-done/issues/264)

**Type:** Was broken, now fixed (PR #421) · **Confidence:** High

#### 6. First Run: 6 Foundational Concepts to Learn
Before being productive, users must understand: Context Engineering (file ecosystem), XML-Structured Plans, Multi-Agent Orchestration, Wave Execution, Atomic Git Commits, and Phase-Based Iteration. README acknowledges: "The complexity is in the system, not in your workflow." [GSD README](https://github.com/gsd-build/get-shit-done)

**Type:** Design friction (steep curve) · **Confidence:** High

#### 7. First Run: 15+ Commands, No Clear Starting Point
Users scanning the command list see 15+ options with no obvious entry point. Onboarding UX was later improved to suggest `/gsd:new-project` instead of `/gsd:help`. [GSD README](https://github.com/gsd-build/get-shit-done)

**Type:** Design friction · **Confidence:** High

#### 8. First Project: 45-60 Minute Questionnaire
`/gsd:new-project` quizzes about goals, codebase, then optionally spawns research agents. Tutorial warns: "45-60 minutes, grab a coffee during the long steps." [CC For Everyone](https://ccforeveryone.com/gsd); [Esteban Torres blog](https://estebantorr.es/blog/2026/2026-02-03-a-gsd-system-for-claude-code/)

**Type:** Design friction · **Confidence:** High

#### 9. First Project: Brownfield Projects Ignore GSD Methodology
With a pre-existing CLAUDE.md, GSD's rules aren't injected — Claude prioritizes the existing file. User: "GSD assumes Claude will follow its methodology, but Claude prioritizes rules in the project's CLAUDE.md file." Nothing warns the user. [Issue #50](https://github.com/gsd-build/get-shit-done/issues/50)

**Type:** Design gap · **Confidence:** High

#### 10. First Phase: `.planning/` Directory Structure Is Opaque
GSD creates `.planning/` with PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, config.json, plus subdirectories. Users confused about what to commit to git. One worried sharing planning files "might mess things up for other teammates." Maintainer confirmed GSD is "designed around a solo-dev workflow." [Issue #243](https://github.com/gsd-build/get-shit-done/issues/243)

**Type:** Documentation gap + design limitation · **Confidence:** High

#### 11. First Phase: Discuss Phase Auto-Answers Questions
In GSD 1.22.0 + CC 2.1.63, `/gsd:discuss-phase` auto-answered all questions silently. Users expected dialogs but everything was completed without input. Root cause: CC runtime regression. [Issue #803](https://github.com/gsd-build/get-shit-done/issues/803)

**Type:** Broken (external dependency) · **Confidence:** High

#### 12. First Execution: Permission Model Tension
README suggests `--dangerously-skip-permissions` for "frictionless automation." Without it, every file operation triggers a dialog, breaking GSD's multi-agent workflow. But the flag name signals risk. [GSD README](https://github.com/gsd-build/get-shit-done)

**Type:** Design friction (inherent to CC security model) · **Confidence:** Medium

#### 13. First Execution: Model Alias Resolution Failures
Users configuring `executor_model: "sonnet"` hit 404 errors — CC Task tool doesn't resolve aliases. "Teams can't guarantee which model runs their tasks." [Issue #991](https://github.com/gsd-build/get-shit-done/issues/991)

**Type:** Broken (integration gap) · **Confidence:** High

#### 14. First Verification: "Plans Are Prompts" Paradigm Shift
PLAN.md files are executable prompts for subagents, not documentation. CC For Everyone tutorial explicitly teaches this distinction, indicating it's a common confusion point. [CC For Everyone](https://ccforeveryone.com/gsd)

**Type:** Conceptual friction · **Confidence:** Medium

#### 15. Ongoing: Version Coupling Between GSD and Claude Code
GSD functionality tightly coupled to CC versions. CC 2.1.x broke command discovery, CC 2.1.63 broke interactive dialogs. Users cannot determine which GSD version is compatible with which CC version. Two major breakages within ~6 weeks. [Issue #218](https://github.com/gsd-build/get-shit-done/issues/218); [Issue #803](https://github.com/gsd-build/get-shit-done/issues/803)

**Type:** Systemic fragility · **Confidence:** High

### Summary of Friction Types

| Type | Count | Severity |
|------|-------|----------|
| Design friction (steep curve, conceptual) | 6 | Medium-High |
| Broken (external dependency / integration) | 4 | High-Critical |
| Documentation gap | 3 | Medium |
| Design gap / limitation | 2 | Medium-High |

## Key Unknowns

1. **v2 onboarding experience unknown** — GSD v2 claims "gentler on-ramp" with step mode but no first-person accounts found.
2. **Token cost surprise** — Multiple issues ask about unexpected consumption, but no detailed new-user accounts found.
3. **Command discovery rate** — Unknown what % of users find the right starting command vs. trying random commands.
4. **Drop-off rate** — No data on how many users install GSD and never complete their first project.
5. **Reddit/Discord sentiment** — Almost no Reddit threads about GSD friction found; Discord likely contains richer data.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 15+
