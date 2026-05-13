# Axis 4: Quality Guardrails & Verification Strategies

## Question
What mechanisms do spec-driven agentic coding tools use to ensure code quality, catch errors, enable rollback, and verify that generated code meets the spec?

## Findings

## Tiered Analysis: From Basic to Comprehensive Guardrails

---

## Tier 1: Basic Guardrails (Specification-as-Documentation)

These tools rely primarily on structured specifications as implicit quality gates, with minimal automated enforcement of code quality post-generation.

- **mcp-server-spec-driven-development** provides a three-stage prompt pipeline (Requirements in EARS format, Design, Code) delivered via MCP server, but includes no automated testing, rollback, or verification mechanisms. Quality depends entirely on downstream AI/user implementation. [GitHub - mcp-server-spec-driven-development](https://github.com/formulahendry/mcp-server-spec-driven-development) (Confidence: high)

- **spec-driven-agentic-development** (marcelsud) produces three specification documents per feature (context.md, requirements.md in EARS format, tasks.md with TDD breakdown) via `/spec:create` and `/spec:execute` commands, but implements no explicit automated testing hooks, rollback procedures, or validation loops. Quality assurance relies on specification clarity and AI adherence to documented tasks. [GitHub - spec-driven-agentic-development](https://github.com/marcelsud/spec-driven-agentic-development) (Confidence: high)

- **lean-spec** takes a deliberately minimalist approach with specs kept under 2,000 tokens to reduce context rot. It includes a CLI `validate` command for spec integrity checks and dependency tracking via `depends_on` fields, but lacks explicit rollback or checkpoint mechanisms in its documentation. [GitHub - lean-spec](https://github.com/codervisor/lean-spec) (Confidence: medium)

- **OpenSpec** offers a `/opsx:verify` command to catch drift between planned and implemented code, an archive system (`/opsx:archive`) for traceable history of completed changes, and conventional commit standards enforcement. However, its explore mode explicitly prevents implementation to keep the planning phase clean. Detailed rollback mechanisms are not elaborated in accessible documentation. [GitHub - OpenSpec](https://github.com/Fission-AI/OpenSpec) (Confidence: medium)

---

## Tier 2: Moderate Guardrails (Structured Workflow Gates)

These tools enforce phase-based checkpoints with human approval gates and some automated validation, but primarily rely on workflow structure rather than code-level enforcement.

- **GitHub Spec Kit** introduces a "constitution" file (`.specify/memory/constitution.md`) encoding non-negotiable project principles (code style, test coverage, security, performance). The `/speckit.analyze` command performs cross-artifact consistency checking, blocking progression if plans violate constitutional principles. `/speckit.checklist` generates custom quality checklists validating requirements completeness, clarity, and consistency -- described as "unit tests for English." However, Birgitta Boeckeler's analysis on Martin Fowler's site found that agents "frequently...not follow all the instructions" despite extensive specs, and checklist enforcement is "interpreted by AI, so there is no 100% guarantee." [GitHub - spec-kit](https://github.com/github/spec-kit), [Martin Fowler - SDD Tools](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) (Confidence: high)

- **cc-sdd** (gotalab) adds a traits system -- a mixin-like mechanism that enriches commands with additional behavior. The "superpowers" trait adds code review and verification gates to the `/speckit.implement` command. It includes `validate-gap` (checks alignment between existing code and new specs) and `validate-design` (ensures design documents meet quality standards). Configuration through `.kiro/settings/` allows templates and rules to enforce domain-specific standards. [GitHub - cc-sdd](https://github.com/gotalab/cc-sdd) (Confidence: high)

- **SpecPulse** provides validation commands at every artifact level: `/sp-spec validate` for specification completeness, `/sp-plan validate` for logical sequencing and dependency mapping, `/sp-task validate` for task completeness, and `/sp-validate` for holistic cross-validation. Its "CLI-First with AI Enhancement" architecture means the CLI creates reliable structure that "never fails," with AI enhancement occurring only on CLI-created files, preventing cascading failures from AI operations. [GitHub - SpecPulse](https://github.com/specpulse/specpulse) (Confidence: medium)

- **PAUL** implements acceptance-driven development with BDD-format acceptance criteria (Given/When/Then) as first-class citizens. Every task requires four mandatory components: Files, Action, Verify (measurable validation like "curl returns 200"), and Done (acceptance criteria satisfaction). The UNIFY phase creates SUMMARY.md comparing planned versus actual outcomes. "DO NOT CHANGE" sections in PLAN.md protect files from unintended modifications, enforced by dynamic CARL rules. [GitHub - PAUL](https://github.com/ChristopherKahler/paul) (Confidence: high)

- **Shotgun** performs full codebase indexing to build a searchable repository graph before specification. In planning mode, it proposes execution plans, shows each step, and asks for confirmation before agents change files, with checkpoints at each step where users can refine or skip cascaded updates. Drafting mode skips confirmations for confident teams. [GitHub - Shotgun](https://github.com/shotgun-sh/shotgun) (Confidence: high)

- **AI Factory** implements a "Reflex Loop" (generate, evaluate, critique, refine) with `/aif-grounded` for strictly verified answers before modifications. `/aif-implement` executes tasks one by one, committing at checkpoints. `/aif-ci` sets up CI pipelines with linting, static analysis, and tests. [GitHub - AI Factory](https://github.com/lee-to/ai-factory) (Confidence: medium)

- **spec-kit-plus** treats tests and automated evaluations as first-class artifacts alongside code. The `/analyze` command performs cross-artifact consistency and coverage analysis, and `/clarify` validates specification completeness before planning. Constitutional guidelines encode quality standards. However, specific implementation details for rollback and testing integration remain unclear. [GitHub - spec-kit-plus](https://github.com/Uzmaakhter110/spec-kit-plus) (Confidence: low -- documentation gaps)

---

## Tier 3: Comprehensive Guardrails (Automated Enforcement with Hooks)

These tools go beyond workflow structure to implement automated code-level enforcement, testing integration, and robust checkpoint/rollback mechanisms.

- **GSD (Get Shit Done)** implements the most rigorous atomic commit strategy among the surveyed tools. Each task gets its own commit with semantic messaging (e.g., `feat(08-02): add email confirmation flow`), enabling `git bisect` to pinpoint exactly which task introduced a bug. Every task XML structure contains a `<verify>` tag with testable conditions (e.g., "curl -X POST localhost:3000/api/auth/login returns 200"). A plan-level "checker verifies, loop until pass" system ensures quality before execution. Each phase produces a `{phase_num}-VERIFICATION.md` documenting what passed automated checks. The `/gsd:verify-work` command runs user acceptance testing, and failed UATs spawn debug agents to find root causes and create fix plans. Plans execute in fresh 200k-token sub-agent contexts to prevent context rot. [GitHub - GSD](https://github.com/gsd-build/get-shit-done) (Confidence: high)

- **Pilot Shell** represents the most technically sophisticated hook-based enforcement system found. It implements a `tdd_enforcer.py` PreToolUse hook that checks if implementation files were modified without failing tests first. PostToolUse hooks dispatch language-specific validators (ruff + basedpyright for Python, Prettier + ESLint + tsc for TypeScript, gofmt + golangci-lint for Go) as blocking operations after every file modification. A `spec_stop_guard.py` hook blocks session termination if an active spec has PENDING or COMPLETE status, forcing verification to complete. Pre-compact hooks capture plan status and context before auto-compaction, and post-compact hooks re-inject state after. A "plan-reviewer sub-agent" validates spec completeness before approval, and a "unified review sub-agent" handles compliance, quality, and goal alignment at the end. Successful changes squash-merge to main. [GitHub - Pilot Shell](https://github.com/maxritter/pilot-shell) (Confidence: high)

- **Tasker** uses reduce-while loops that continue until all requirement categories are covered, forcing comprehensive specifications through looping pressure. Finite state machines serve as executable contracts -- "The FSM JSON is canonical; diagrams are derived." Checkpoints are created before each batch, result files track every task outcome, and git commits mark progress. `tasker stop` and `tasker resume` provide clean interruption and recovery. A six-phase task decomposition protocol (logical decomposition, physical mapping, cross-cutting concerns, task definition, dependency analysis, completeness audit) ensures "every task is small enough to verify, specific enough to implement without questions." [GitHub - Tasker](https://github.com/Dowwie/tasker) (Confidence: high)

- **spec-kitty** enforces strict test-driven development where the LLM must first generate comprehensive tests, get them approved, and only then generate implementation. The lane-based state transition system (Planned, Doing, For Review, Done) requires deterministic review feedback before task closure (v1.0.0a1 feature). Git worktrees under `.worktrees/` provide isolated workspaces per work package, allowing multiple agents to work simultaneously without merge conflicts. Tasks can move backward ("for_review" to "planned") when review feedback triggers rework. Merge commands support multiple strategies including squash, standard merge, and dry-run preview. [GitHub - spec-kitty](https://github.com/Priivacy-ai/spec-kitty) (Confidence: high)

- **ContextKit** deploys specialized quality sub-agents that activate automatically during development phases. The `run-test-suite` agent performs complete test execution with structured failure reporting; `check-accessibility` validates VoiceOver labels, color contrast, and keyboard navigation; `check-localization` validates String Catalogs; `check-error-handling` enforces ErrorKit patterns; `check-modern-code` replaces outdated APIs; and `check-code-debt` removes AI artifacts. Feature branches are mandatory -- `/ctxk:impl:start-working` requires completed planning phases. The system adapts quality agents to the detected tech stack automatically. [GitHub - ContextKit](https://github.com/FlineDev/ContextKit) (Confidence: high)

- **Smart Ralph** implements a 4-phase task execution structure (Make It Work, Refactoring, Testing, Quality Gates) with approval-gated execution by default. `[VERIFY]` markers and VE task types within plans create deliberate quality checkpoints. State preservation occurs via `.ralph-state.json` files, and a stop-watcher hook mechanism controls the agentic loop to prevent runaway execution. When Ralph "tests you" by failing in specific ways, guardrails are added to `.speckit-ralph/guardrails.md`. [GitHub - Smart Ralph](https://github.com/tzachbon/smart-ralph) (Confidence: medium)

- **spec-kit-command-cursor** introduces a critical dual-gate distinction: the **verifier** is a post-implementation completeness check ("does the code match the spec?") while the **reviewer** is a pre-merge quality gate ("is it good?"). Tasks declare `touchedFiles` to prevent concurrent edits to identical files (conflict detection). The orchestrator identifies circular dependency deadlocks and enforces per-task timeouts. `execution-checkpoint.json` enables recovery via `/execute-parallel --resume` after interruption. An `sdd-audit` skill auto-invokes when code review is requested, leveraging `checklist.md` and executable `validate.sh` helpers. [GitHub - spec-kit-command-cursor](https://github.com/madebyaris/spec-kit-command-cursor) (Confidence: medium)

---

## Tier 4: Theoretical Maximum (Multi-Agent Adversarial Verification)

- **Verified Spec-Driven Development (VSDD)** represents the most ambitious quality framework found, though it is a methodology specification (published as a GitHub Gist) rather than a shipped tool. It fuses SDD, TDD, and VDD (Verification-Driven Development) into a single pipeline. A Builder AI and an Adversarial AI ("Sarcasmotron") operate in a high-friction feedback loop, with the adversary using "zero tolerance" and "negative prompting" to find flaws. Testing requires mutation testing with high kill rates. The methodology specifies formal verification (Kani harnesses, Dafny contracts, TLA+ invariants). Convergence is reached at "Maximum Viable Refinement" when the adversary is "forced to hallucinate flaws." Every line of code must trace from Spec Requirement through Verification Property, Test Case, Implementation, Adversarial Review, to Formal Proof. [VSDD Gist](https://gist.github.com/dollspace-gay/d8d3bc3ecf4188df049d7a4726bb2a00) (Confidence: high for methodology description; low for practical implementation evidence)

---

## Cross-Cutting Patterns Observed

- **Atomic commits per task** are used by GSD, Tasker, AI Factory, and Pilot Shell, enabling `git bisect`-based debugging and surgical rollback. [GSD GitHub](https://github.com/gsd-build/get-shit-done), [Tasker GitHub](https://github.com/Dowwie/tasker)

- **Constitutional/principles files** serve as persistent guardrails in Spec Kit (constitution.md), cc-sdd (traits), spec-kit-plus, and Smart Ralph (guardrails.md). These encode non-negotiable constraints that all generated code must satisfy. [GitHub - spec-kit](https://github.com/github/spec-kit)

- **Fresh context windows per task** are used by GSD (200k clean tokens per sub-agent), ContextKit (sub-agents), and spec-kitty (worktrees) to combat context rot -- the degradation of AI output quality as conversation history grows. [GSD GitHub](https://github.com/gsd-build/get-shit-done)

- **The guardrails taxonomy** proposed by jvaneyck identifies six categories: real CI, static type systems, deterministic tooling (linters/formatters), architectural constraint testing (ArchUnit), high-quality automated tests, and code quality analysis -- with the meta-principle that guardrails must run **inside** agent loops before human review. [jvaneyck Blog](https://jvaneyck.wordpress.com/2026/02/22/guardrails-for-agentic-coding-how-to-move-up-the-ladder-without-lowering-your-bar/)

- **Claude Code hooks** (PreToolUse, PostToolUse, Stop events) provide the technical substrate that Pilot Shell, Smart Ralph, and TDD Guard use for enforcement. These intercept agent actions in real-time and can block violations before they occur. [Pilot Shell GitHub](https://github.com/maxritter/pilot-shell)

---

## Key Unknowns

1. **OpenKit**: Could not find a distinct tool by this exact name in the spec-driven development ecosystem. Search results consistently redirected to GitHub Spec Kit. It may be an alternate name, a deprecated project, or a tool not yet publicly indexed.

2. **Effectiveness data**: No tool provides published metrics on defect rates, rollback frequency, or quality improvement over baseline agentic coding. The Martin Fowler/Boeckeler analysis is the closest to empirical evaluation, and it found agents "frequently...not follow all the instructions" regardless of spec sophistication. [Martin Fowler - SDD Tools](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

3. **VSDD real-world adoption**: The adversarial refinement methodology is documented as a specification but evidence of production use or tooling that implements it fully was not found.

4. **GuardRails tool (giancarlostoro)**: This SQLite-based tool implements "gates" (mandatory verification before task closure), but full technical implementation details beyond the blog post were not found. The tool may still be in early development. [GuardRails Blog](https://giancarlostoro.com/introducing-guardrails-a-new-coding-agent-task-companion)

5. **Comparative failure rates**: No data was found comparing how often different tools' quality gates actually catch errors versus how often they are bypassed by the AI, accepted without review by the human, or produce false positives.

6. **lean-spec rollback/checkpoint mechanisms**: Documentation does not describe these features explicitly, despite the tool having a validate command.

7. **spec-kit-plus testing integration**: While tests are described as "first-class artifacts," specific implementation details for how this is enforced remain undocumented.

8. **Tessl verification depth**: Martin Fowler's analysis notes that Tessl aspires to spec-as-source (where humans edit only specs, code is generated), but its non-determinism was observed in practice -- "the same spec" produced different code on repeated generation. The verification implications of this are significant but unexplored. [Martin Fowler - SDD Tools](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

## Metadata
- Subagent completed: 2026-03-12
- Sources cited: 20+
