# Axis 5: Harness Framework Anti-Slop Mechanisms Mapped to SDD Ontology

## Question
How do the 6 harness frameworks (GSD, OpenSpec, Spec Kit, Kiro, BMAD, Taskmaster AI) specifically address slop prevention, and at which stages of the SDD ontology (S1-S10, CC1-CC12) do their anti-slop mechanisms operate?

## Findings

### Framework × Ontology Stage Matrix

| Stage | GSD | OpenSpec | Spec Kit | Kiro | BMAD | Taskmaster AI |
|---|---|---|---|---|---|---|
| **S1: Init** | - | - | - | - | - | - |
| **S2: Governing Principles** | XML-structured meta-prompts set agent behavior boundaries | - | `constitution.md` establishes non-negotiable project principles | Steering files (`.kiro/steering/`) with always/fileMatch/manual inclusion modes | Control Manifest with "code exclusion zones" and library mandates | - |
| **S3: Requirements** | Discussion phase captures gray-area decisions pre-plan | Proposal phase (`proposal.md`) documents "why" before "what" | `/speckit.specify` focuses on "what/why" not tech choices; `/speckit.clarify` resolves ambiguity | EARS-notation acceptance criteria auto-generated from prompts | Analyst + PM agents produce hyper-detailed requirements | PRD parsing; output quality scales with input detail |
| **S4: Discussion** | Explicit discuss phase resolves ambiguity before planning | "Review & Align" iteration with AI until consensus | `/speckit.clarify` optional clarification step | - | Multi-agent perspectives review requirements | - |
| **S5: Roadmap** | - | - | - | - | Epic sharding by Scrum Master agent | - |
| **S6: Architecture** | Research sub-agents (4 parallel) investigate stack/pitfalls | `design.md` documents technical approach | `/speckit.plan` articulates tech stack and architecture | Design doc with data flow diagrams, TypeScript interfaces, DB schemas | Architect agent produces architecture; Developer forbidden from innovating at this level | - |
| **S7: Task Decomposition** | Plan-checker agents validate atomicity; max 2 verification iterations | `tasks.md` implementation checklist | `/speckit.tasks` creates small, reviewable, testable units; `/speckit.analyze` cross-checks artifacts | Tasks auto-sequenced by dependency with test requirements | Scrum Master creates hyper-detailed story files with full context | `analyze_project_complexity` scores 1-10; auto-expands high-complexity tasks |
| **S8: Execution** | Fresh 200K context per task; atomic git commits; wave-based parallel execution | `/opsx:apply` executes numbered tasks | `/speckit.implement` executes tasks | Agent hooks auto-trigger on file save (tests, linting, security scans) | Developer Agent as "obedient craftsman" — halts and reports on conflicts | Dependency validation with `--with-dependencies` flag; status tracking |
| **S9: Verification** | `/gsd:verify-work` UAT with auto-spawned debug agents on failure | `/opsx:verify` (details undocumented) | `/speckit.checklist` quality validation ("unit tests for English") | Code diffs and agent execution history visible; manual task-by-task triggering | Pre-commit quality gate run by Scrum Master; failures sent back to Developer | Complexity reports; test coverage analysis with gap detection |
| **S10: Completion** | Atomic commits make failed work independently revertable | `/opsx:archive` moves completed work | PR generation | - | QA Agent + Product Owner Agent check PRD adherence | - |

**Confidence: High** for GSD, Spec Kit, BMAD, Kiro (well-documented repos and articles). **Medium** for OpenSpec (verify command undocumented). **Medium** for Taskmaster (quality gates less explicitly documented).

### Per-Framework Anti-Slop Philosophy

#### 1. GSD (Get Shit Done)
**Philosophy: Prevent slop through context hygiene and verification loops.**

GSD's primary anti-slop mechanism is **fresh context per task** — each executor sub-agent gets a clean 200K token window, ensuring "Task 50 has the same quality as Task 1" with no degradation from context rot [GSD GitHub](https://github.com/gsd-build/get-shit-done). The plan-checker agent validates plans against requirements before execution (max 2 iterations), and the verify-work command tests "what must be TRUE for this to work" rather than checking implementation details [codecentric Deep Dive](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system). Failed verifications auto-spawn debug agents. Size-limited documents are maintained "based on where Claude's quality degrades" [GSD GitHub](https://github.com/gsd-build/get-shit-done). GSD 2 adds programmatic control over context windows, session management, stuck-loop detection, and crash recovery [GSD-2 GitHub](https://github.com/gsd-build/gsd-2).

**Anti-slop type: Primarily pre-hoc (context freshness) + post-hoc (verify-work UAT). Explicit.**

**Stages: S4, S6, S7, S8, S9. CC1, CC2, CC4, CC6, CC7.**

#### 2. OpenSpec
**Philosophy: Prevent slop through specification rigor; quality is a side-effect of organizational clarity.**

OpenSpec relies on compartmentalization of changes (each feature gets its own folder with proposal/specs/design/tasks) and a "Review & Align" phase where changes iterate "with AI until consensus" before implementation [OpenSpec GitHub](https://github.com/Fission-AI/OpenSpec). The `tasks.md` checklist prevents "while I'm at it" refactoring [OpenSpec SDD article](https://recca0120.github.io/en/2026/03/08/openspec-sdd/). However, `/opsx:verify` exists with **no documented details**. OpenSpec explicitly positions model selection as the primary quality lever and contains no built-in linting, testing, or automated validation [OpenSpec GitHub](https://github.com/Fission-AI/OpenSpec).

**Anti-slop type: Pre-hoc (spec constraints). Mostly implicit.**

**Stages: S3, S4, S7, S9 (undocumented). CC2.**

#### 3. GitHub Spec Kit
**Philosophy: Prevent slop through gated artifact validation and constitutional governance.**

The most explicit multi-layered quality architecture. `constitution.md` establishes non-negotiable principles at S2 [Spec Kit GitHub](https://github.com/github/spec-kit). `/speckit.analyze` performs **cross-artifact consistency and coverage analysis** catching misalignments between specs, plans, and tasks [Spec Kit GitHub](https://github.com/github/spec-kit). `/speckit.checklist` generates custom quality checklists described as "unit tests for English" [GitHub Blog on SDD](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/).

**Anti-slop type: Pre-hoc (constitution + analyze gate). Explicit.**

**Stages: S2, S3, S4, S5, S7, S9. CC6, CC7.**

#### 4. Kiro
**Philosophy: Prevent slop through persistent project knowledge and event-driven quality automation.**

**Steering files** in `.kiro/steering/` encode project conventions with three inclusion modes (always, fileMatch, manual) [Kiro Docs](https://kiro.dev/docs/hooks/). **Agent hooks** provide event-driven quality enforcement: a "code-quality-enforcer" hook triggers on file save [Kiro Hook Examples](https://kiro.dev/docs/hooks/examples/). Spec workflow provides upstream constraint with EARS notation requirements [Kiro Blog](https://kiro.dev/blog/introducing-kiro/).

**Anti-slop type: Ad-hoc (hooks) + pre-hoc (steering rules). Explicit for hooks; implicit for spec workflow.**

**Stages: S2, S3, S6, S7, S8. CC6, CC12.**

#### 5. BMAD Method
**Philosophy: Prevent slop through role separation and constrained developer autonomy.**

Most distinctive mechanism: **Developer Agent as "obedient craftsman"** — explicitly forbidden from innovating at the architecture level, instructed to "halt and report" rather than make autonomous decisions [BMAD Guide](https://redreamality.com/garden/notes/bmad-method-guide/). **Scrum Master agent's pre-commit quality gate** runs validation before marking stories done [BMAD Guide](https://redreamality.com/garden/notes/bmad-method-guide/). **Epic sharding** produces self-contained story files eliminating context degradation through handoffs [BMAD GitHub](https://github.com/bmad-code-org/BMAD-METHOD). Control Manifest defines "code exclusion zones" [Applied BMAD](https://bennycheung.github.io/bmad-reclaiming-control-in-ai-dev).

**Anti-slop type: Pre-hoc (role constraints, exclusion zones) + post-hoc (pre-commit gate). Explicit.**

**Stages: S2, S3, S5, S6, S7, S8, S9, S10. CC1, CC6, CC7.**

#### 6. Taskmaster AI
**Philosophy: Prevent slop through complexity-aware task decomposition and dependency enforcement.**

Primary mechanism: **complexity analysis** — `analyze_project_complexity` scores tasks 1-10 and auto-expands high-complexity tasks [Taskmaster GitHub](https://github.com/eyaltoledano/claude-task-master). Dependency validation with `--with-dependencies` ensures correct execution order [Taskmaster GitHub](https://github.com/eyaltoledano/claude-task-master). Test coverage analysis detects gaps [Taskmaster Capabilities](https://www.sidetool.co/post/taskmaster-ai-capabilities-streamline-your-development-workflows/).

**Anti-slop type: Pre-hoc (complexity-driven decomposition) + ad-hoc (test coverage). Mix of explicit and implicit.**

**Stages: S3, S7, S8, S9. CC5, CC6.**

### Brief Contrast: Superpowers and claude-code-harness

**Superpowers** enforces strict red-green-refactor TDD where "if the agent writes code before tests, Superpowers deletes it and forces a restart" [Superpowers GitHub](https://github.com/obra/superpowers). The strongest ad-hoc enforcement mechanism in the ecosystem.

**Anthropic's harness guidance** emphasizes JSON pass/fail tracking where "it is unacceptable to remove or edit tests," startup verification rituals, and one-feature-at-a-time constraints [Anthropic Engineering Blog](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

### Cross-Cutting Capability Mapping for Anti-Slop

| CC | Most Relevant Frameworks |
|---|---|
| **CC1: Multi-Agent** | GSD (12+ sub-agents with quality roles), BMAD (role-constrained agents) |
| **CC2: Context Engineering** | GSD (fresh context per task), OpenSpec (filesystem-persistent specs), BMAD (epic sharding) |
| **CC6: Guardrails** | Spec Kit (constitution), Kiro (steering rules), BMAD (code exclusion zones), GSD (plan verification) |
| **CC7: Human Gates** | GSD (verify-work UAT), Spec Kit (clarify step), BMAD (halt-and-report) |

## Key Unknowns

- **OpenSpec `/opsx:verify`**: This command exists but its behavior is entirely undocumented.
- **Taskmaster quality gate specifics**: Claims of "test-coverage mode," "linting mode," etc. appear in secondary sources but are not clearly documented in the primary repo.
- **BMAD pre-commit gate implementation**: Specific commands the Scrum Master runs during pre-commit are not documented.
- **Kiro hook reliability**: Whether hooks can enforce hard quality gates (block commits) vs. soft suggestions is unclear.
- **None of the 6 frameworks explicitly use the term "slop"** in their documentation. Anti-slop features are framed as "preventing context rot," "maintaining consistency," or "quality assurance."

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 19+
