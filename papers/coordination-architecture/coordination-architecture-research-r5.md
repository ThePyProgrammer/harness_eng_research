# Multi-Agent Software Engineering Coordination: Empirical Evidence and Practitioner Reports

**Research Round 5: Coordination Architecture**
**Date: 2026-04-03**

---

## 1. Google DORA 2025: AI Adoption and Software Quality

**Source:** [2025 DORA State of AI-Assisted Software Development](https://dora.dev/research/2025/dora-report/), Google Cloud, December 2025. Supplementary telemetry analysis from [Faros AI](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025).

### Methodology and Sample Size

The DORA report surveyed nearly 5,000 technology professionals worldwide and drew on over 100 hours of qualitative interview data. Faros AI contributed independent telemetry analysis from over 10,000 developers, providing an objective complement to the self-reported survey data.

### Key Quantitative Results

| Metric | Change with AI Adoption |
|--------|------------------------|
| Tasks completed per developer | +21% |
| Pull requests merged | +98% |
| Code review time | +91% |
| Pull request size | +154% |
| Bug rate | +9% |
| Organizational delivery metrics | Flat |

The headline: 95% of developers now use AI tools, with 90% of organizations having adopted at least one platform. Over 80% self-report productivity gains, yet organizational delivery metrics remain flat.

### The AI Productivity Paradox

Individual developers produce more code faster, but the downstream effects consume those gains. PRs grow 154% larger, requiring 91% longer review cycles. The 9% increase in bug rate compounds through integration, testing, and maintenance. The report frames this as "AI amplifies what's already there": strong teams with good review practices absorb the increased volume; struggling teams see their bottlenecks magnified.

### Nuance and Caveats

The report acknowledges that "developers are poor estimators of their own productivity," citing alignment with Stanford and METR research findings. However, the Faros telemetry data (objective, not self-reported) largely confirms the survey findings, lending credibility to the paradox framing. One important caveat: the 90% adoption figure includes any AI usage (autocomplete, chat, search), not specifically multi-agent or autonomous coding. The bug rate increase of 9% is modest relative to the 98% increase in merged PRs, suggesting per-PR quality may actually be stable while absolute bug volume rises.

### Relevance to Coordination Architecture

The DORA findings establish a baseline problem: more code generation without corresponding review and integration scaling creates bottlenecks. Multi-agent coordination architectures must address this by building quality gates into the generation pipeline rather than deferring all validation to human reviewers.

---

## 2. Cursor's Scaling Experiments: From Locking to Planner/Worker/Judge

**Source:** [Scaling Long-Running Autonomous Coding](https://cursor.com/blog/scaling-agents), Cursor, January 2026.

### The Locking Model Collapse

Cursor's initial architecture used a flat coordination model where agents claimed tasks via file-based locking. With 20 agents operating simultaneously, effective throughput collapsed to 2-3 agents, with most time consumed by lock contention and waiting. Additional failure modes included agents holding locks indefinitely and updating shared state without proper synchronization.

### Optimistic Concurrency (Partial Fix)

Replacing locks with optimistic concurrency control (agents read freely; writes fail if state changed since last read) improved throughput but exposed a deeper problem: without hierarchy, agents became risk-averse. They avoided difficult tasks, made small safe changes, and no agent took ownership of hard problems or end-to-end implementation. The coordination mechanism was necessary but insufficient.

### Planner/Worker/Judge Topology

The breakthrough came from role separation:

- **Planners** continuously explore the codebase and create tasks. Critically, planners can spawn sub-planners, making planning itself parallel and recursive.
- **Workers** pick up tasks and focus entirely on completing them, with no inter-worker coordination required.
- **Judge** evaluates each cycle's output and determines whether to continue or terminate.

This hierarchy "solved most of our coordination problems" according to Cursor's engineering team.

### Scale and Results

| Project | Duration | Output |
|---------|----------|--------|
| Web browser from scratch | ~1 week | ~1M lines across 1,000 files |
| Solid-to-React migration | 3+ weeks | +266K/-193K line edits |
| Java LSP | Extended | 7,400 commits, 550K lines |
| Windows 7 emulator | Extended | 14,600 commits, 1.2M lines |
| Excel implementation | Extended | 12,000 commits, 1.6M lines |

Total token consumption reached into the trillions. The system ran hundreds of agents concurrently for weeks.

### Key Architectural Lessons

1. **Prompts matter more than architecture or models.** Careful prompt engineering outweighed both model selection and coordination mechanism design.
2. **Simplicity beats complexity.** Removing the "integrator" role (which merged worker outputs) eliminated a bottleneck. Workers merge their own work.
3. **Periodic resets combat drift.** Long-running agents accumulate stale context. Fresh cycles with judge-mediated resets maintain quality.
4. **Model selection matters for sustained work.** Cursor found GPT-5.2 outperformed Claude Opus 4.5 for sustained autonomous coding (though this is version-specific and likely to shift).

### Relevance to Coordination Architecture

Cursor's experiments provide the strongest empirical evidence that flat coordination fails at scale and hierarchical role separation succeeds. The planner/worker/judge pattern is directly applicable. The failure of the locking model validates the need for structural isolation (worktrees) rather than cooperative locking.

---

## 3. Worktree-Based Isolation in Practice

**Sources:** [OpenAI Codex App with Git Worktrees](https://dev.to/damogallagher/openai-shipped-a-codex-macos-app-multi-agent-threads-built-in-git-worktrees-3aoh), [Git Worktrees for Parallel AI Coding Agents](https://medium.com/@mabd.dev/git-worktrees-the-secret-weapon-for-running-multiple-ai-coding-agents-in-parallel-e9046451eb96), [Agentmaxxing: Run Multiple AI Agents in Parallel](https://vibecoding.app/blog/agentmaxxing), [Codex App Worktrees Explained](https://www.verdent.ai/guides/codex-app-worktrees-explained).

### How Tools Use Worktrees

**OpenAI Codex (macOS app, February 2026):** Each agent thread automatically receives its own git worktree upon task creation. This provides filesystem-level isolation while sharing a single `.git` directory, keeping branches synchronized without full repository clones.

**Conductor (Melty Labs):** Assigns an isolated git worktree per agent instance. Agents operate on independent branches; merges happen after completion.

**Claude Squad:** Open-source terminal multiplexer that manages concurrent Claude Code instances, each in its own worktree or tmux pane.

**Agent of Empires (community tool):** Manages Claude Code, Codex CLI, Gemini CLI, and other agents via tmux sessions with git worktree isolation.

### Benefits

- **Structural conflict prevention:** Agents cannot create merge conflicts during execution because they operate on independent filesystem copies.
- **Lightweight:** Worktrees share the `.git` directory, consuming far less disk than full clones.
- **Branch synchronization:** All worktrees share the same object store, so cross-referencing and merging are native git operations.
- **Clean rollback:** Failed agent work can be discarded by deleting the worktree and its branch.

### Failure Modes

- **Merge conflicts at integration time:** Isolation prevents conflicts during work but defers them to the merge phase. Complex multi-file refactors across agents still produce conflicts.
- **Stale base branches:** Long-running agents on worktrees can drift from main, requiring rebases that may invalidate their work.
- **Resource consumption:** Each worktree is a full checkout. Large repositories with many agents consume significant disk and I/O.
- **Semantic conflicts:** Two agents may make structurally compatible but semantically incompatible changes (e.g., both rename the same function differently in separate worktrees).

### Relevance to Coordination Architecture

Worktree isolation is now the de facto standard for multi-agent coding. It provides the structural enforcement layer that prompt-based "don't touch file X" constraints cannot reliably deliver. The key architectural question shifts from "how to prevent conflicts" to "how to merge cleanly and detect semantic conflicts."

---

## 4. Throughput Measurements: Sequential vs. Parallel

**Sources:** [Cursor Scaling Blog](https://cursor.com/blog/scaling-agents), [Parallel vs Serial Development](https://devswarm.ai/blog/parallel-vs-serial-development-a-visual-comparison), [Optimizing Sequential Multi-Step Tasks with Parallel LLM Agents](https://arxiv.org/html/2507.08944v1).

### Available Quantitative Data

Rigorous controlled experiments comparing sequential vs. parallel agent throughput on identical task sets are scarce. The available evidence:

- **Cursor's browser project:** Hundreds of agents produced ~1M lines in ~1 week. No sequential baseline exists for comparison, but the scale of output strongly implies parallelism was essential.
- **M1-Parallel (academic):** Achieved up to 2.2x speedup with early termination while preserving accuracy on sequential multi-step tasks.
- **Addy Osmani's practitioner observation:** "Three focused agents consistently outperform one generalist agent working three times as long," citing 3x throughput for simultaneous backend/frontend/test development.
- **Qualitative reports:** "Five bugs that would take five sequential hours can complete in the time of the slowest one" with parallel execution.

### What We Lack

No published controlled experiment measures features/hour or tasks/hour with the same task set run sequentially vs. in parallel with multiple agents. The closest analog is SWE-Bench (see Section 7), where multi-agent systems achieve modestly higher resolve rates than single-agent systems, but the benchmark measures correctness rather than throughput.

### The UC Irvine Context-Switching Factor

Research from UC Irvine (cited by DevSwarm) found it takes an average of 23 minutes to fully regain focus after an interruption. In sequential human-agent workflows, each agent handoff incurs this penalty. Parallel execution eliminates it by allowing the human to batch-review completed work.

### Relevance to Coordination Architecture

The throughput case for parallelism is strong but mostly qualitative. The 3x claim from focused agents is practitioner-reported, not experimentally controlled. Architecture designs should plan for 2-3x throughput gains from parallelism while recognizing that coordination overhead, merge conflicts, and review bottlenecks will consume some of that gain.

---

## 5. Contract-Based vs. Prompt-Based Coordination

**Sources:** [AgentSpec: Customizable Runtime Enforcement](https://arxiv.org/abs/2503.18666), ICSE 2026. [Progent: Programmable Privilege Control](https://arxiv.org/abs/2504.11703). [Prompt Flow Integrity](https://arxiv.org/html/2503.15547v2). [AI Agent Guardrails](https://dev.to/aws/ai-agent-guardrails-rules-that-llms-cannot-bypass-596d). [Why Prompt-Based Safety Is Not Enough](https://www.osohq.com/learn/why-prompt-based-safety-is-not-enough).

### Prompt-Based Constraint Failure

The empirical evidence on prompt-based constraint violations is sobering:

- **Prompt Flow Integrity (PFI) study:** Without structural enforcement, a ReAct agent achieved only 27.84% Secure Utility Rate on AgentDojo and 2.63% on AgentBench OS. With PFI (structural enforcement at the prompt flow level), these improved to 55.67% and 67.79% respectively. This means unstructured agents violated security constraints roughly 72% of the time.
- **AgentSpec:** Runtime enforcement prevents over 90% of unsafe code executions, achieves full compliance in autonomous driving scenarios, and eliminates hazardous actions in embodied agent tasks, all with millisecond-level overhead.
- **Progent:** Reduces attack success rates to 0% while preserving agent utility and speed through tool-level privilege control.
- **Scaling behavior:** Model performance on respecting guardrails approaches zero as the number of prompt-based constraints increases. More rules in the system message means lower compliance.

### Structural Enforcement Mechanisms

The research literature identifies several enforcement layers:

1. **Tool-call boundary enforcement (hooks):** Intercepts tool calls before execution at the framework level. The LLM cannot override a cancelled tool call.
2. **Filesystem permissions:** OS-level read/write restrictions on worktree paths.
3. **Domain-specific languages (AgentSpec, Progent):** Declarative constraint specifications externalized from the LLM, ensuring consistency across runs and model versions.
4. **Git hooks:** Pre-commit checks that reject changes violating architectural invariants.

### The Core Finding

Prompt-based constraints ("don't modify file X") are suggestions; structural constraints (filesystem permissions, hook enforcement, worktree isolation) are guarantees. The failure rate for prompt-based constraints scales with the number of constraints and the complexity of the task. For multi-agent systems where coordination correctness is critical, structural enforcement is not optional.

### Relevance to Coordination Architecture

This is perhaps the most architecturally significant finding. Any coordination system that relies on agents voluntarily respecting boundaries will fail at scale. Worktree isolation, file ownership enforcement, and hook-based validation are necessary infrastructure, not nice-to-haves.

---

## 6. Industrial Multi-Agent Deployments

**Sources:** [GitHub Copilot 2026 Guide](https://www.nxcode.io/resources/news/github-copilot-complete-guide-2026-features-pricing-agents), [Conductors to Orchestrators](https://addyosmani.com/blog/future-agentic-coding/), [AI Coding Assistants Comparison](https://intuitionlabs.ai/articles/ai-code-assistants-large-codebases).

### Current Production Topologies

**GitHub Copilot Coding Agent:** Spins up ephemeral cloud environments per task, opens PRs autonomously. Uses a single-agent-per-task model with human review at the PR boundary. Agent mode (GA March 2026) handles multi-step, multi-file tasks with terminal command execution.

**Amazon Q Developer:** Features "Agent Teams" for coordinating multiple Claude instances in parallel, with a checkpoint system for code state management and deep git workflow integration. This is the most explicitly multi-agent production system from a major vendor.

**Google Jules:** Cloud-based agent supporting concurrent task delegation with user-steerable parameters. Operates as an orchestrator model.

**Cursor 2.0 Background Agents:** Real-time dashboard for managing multiple concurrent agent tasks with the planner/worker/judge topology described in Section 2.

**JetBrains AI Assistant:** Primarily single-agent with local model support; not yet multi-agent in production.

### Common Problems Encountered

1. **Quality control gaps:** Multiple unsupervised agents produce more code than humans can effectively review.
2. **Coordination conflicts:** Agents touching shared files create merge conflicts; mitigated by workspace isolation.
3. **Context fragmentation:** Shared state across agents is non-trivial; agents become silos.
4. **Debugging opacity:** When autonomous agents fail, root-cause analysis is difficult. Teams "drop to conductor mode" for debugging.
5. **Specification quality:** Vague instructions multiply errors across parallel agents; precise specs multiply into precise implementations.

### Relevance to Coordination Architecture

The industry is converging on worktree-isolated, PR-boundary-reviewed multi-agent systems. No major vendor has deployed agents that cooperatively edit shared files in real-time. The topology is consistently: isolate, execute, review at merge boundary.

---

## 7. SWE-Bench: Multi-Agent vs. Single-Agent Results

**Sources:** [SWE-bench Leaderboards](https://www.swebench.com/), [Agentless (arXiv:2407.01489)](https://arxiv.org/abs/2407.01489), [Verdent AI 76.1%](https://jangwook.net/en/blog/en/multi-agent-swe-bench-verdent/), [Agyn Multi-Agent 72.2%](https://dev.to/nikita_benkovich_eb86e54d/coding-agent-teams-outperform-solo-agents-722-on-swe-bench-verified-4of5).

### Performance Comparison (SWE-bench Verified, 500 instances)

| System | Type | Model(s) | Resolution Rate |
|--------|------|----------|-----------------|
| LIVE-SWE-AGENT | Single agent, self-evolving | N/A | 77.4% |
| Verdent AI | Multi-agent parallel | Multiple | 76.1% |
| Agyn | Multi-agent team | GPT-5 / GPT-5-Codex | 72.2% |
| OpenHands | Single agent | GPT-5 (high reasoning) | 71.8% |
| mini-SWE-agent | Single agent | GPT-5.2 (high reasoning) | 71.8% |
| mini-SWE-agent | Single agent | GPT-5 (medium reasoning) | 65.0% |

### Agentless vs. Agent-Based

The Agentless approach (localization, repair, validation; no autonomous tool use) achieved 32.0% on SWE-bench Lite at only $0.34/issue, compared to $3.34+ for agent-based systems. This demonstrated that simple, non-agent approaches can match or exceed complex agent systems at dramatically lower cost, though more recent agent-based systems have significantly surpassed Agentless.

### Multi-Agent Architecture Details (Agyn)

The Agyn system uses four roles: Manager (coordination), Researcher (context gathering), Engineer (implementation), Reviewer (PR evaluation). Each agent operates in an isolated sandbox with independent shell access. Communication happens through GitHub artifacts (commits, PR descriptions, review comments). The 72.2% result represents a 7.2% improvement over single-agent baseline "purely from team structure" without model upgrades.

### Multi-Agent Architecture Details (Verdent AI)

Verdent uses an orchestrator that dispatches the same problem to multiple agents working in parallel with different strategies. The best solution that passes tests is selected. This is a "best-of-N" parallel exploration approach rather than a collaborative decomposition.

### Key Insight

Multi-agent systems achieve competitive but not dominant results on SWE-Bench. The highest score (77.4%) comes from a self-evolving single agent, not a multi-agent system. The multi-agent advantage appears to be in robustness and cost-efficiency for complex tasks rather than peak performance on well-defined bug fixes.

### Relevance to Coordination Architecture

SWE-Bench tasks are individual bug fixes, which are poorly suited to showcasing multi-agent coordination benefits. The real value of multi-agent systems (parallel feature development, cross-cutting refactors) is not captured by current benchmarks. Architecture decisions should not be driven solely by SWE-Bench numbers.

---

## 8. Addy Osmani's Orchestration Patterns

**Sources:** [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/), [Conductors to Orchestrators](https://addyosmani.com/blog/future-agentic-coding/), [O'Reilly CodeCon March 2026 Talk](https://talks.addy.ie/oreilly-codecon-march-2026/), [Stop Using /init for AGENTS.md](https://addyosmani.com/blog/agents-md/).

### Three-Tier Tool Stack

- **Tier 1: In-process subagents and teams** (single terminal, zero setup overhead)
- **Tier 2: Local orchestrators** (3-10 agents per codebase, worktree isolation)
- **Tier 3: Cloud async agents** (overnight task completion, PR-based handoff)

### Optimal Team Sizing

3-5 agents per team is the recommended range. Beyond this threshold, coordination overhead exceeds benefits and token costs scale linearly. The hierarchical pattern (feature leads spawn 2-3 specialists) prevents the orchestrator from becoming a context bottleneck.

### Subagents vs. Agent Teams

| Aspect | Subagents | Agent Teams |
|--------|-----------|-------------|
| Coordination | Manual dependency graph | Automatic via shared task list |
| Communication | Parent-mediated | Peer-to-peer |
| Setup | Zero overhead | Requires tooling |
| Best for | Simple decomposition | Complex parallelism |

### AGENTS.md Research

A critical finding for coordination architecture: AI-generated context files (auto-generated AGENTS.md) improve agent performance by only 2.7%, which is roughly the same information the agent would discover by reading the repository. Developer-written AGENTS.md files, by contrast, contain non-obvious tooling requirements and project-specific gotchas that meaningfully improve outcomes. When developer-written context mentioned a specific tool (e.g., `uv`), agents used it 1.6 times per task versus fewer than 0.01 times without mention.

### Failure Modes and Kill Criteria

- **Loop collapse:** Agents repeating failed approaches. Mitigation: force reflection prompts before retry, enforce MAX_ITERATIONS=8 hard limits.
- **Verification bottleneck:** "The actual constraint is no longer code generation speed but knowing with confidence whether output is correct."
- **Architecture drift:** Locally-correct code that violates system-wide constraints. Mitigation: require plan approval before implementation.
- **Kill criteria:** Reassign tasks after 3+ stuck iterations; monitor token budgets with auto-pause at 85% consumption.

### The Spec-Driven Principle

"Your spec is the leverage." Precise specifications multiply into precise implementations across parallel agents. Vague specs multiply errors exponentially. This is the single strongest leverage point for multi-agent coordination quality.

### Relevance to Coordination Architecture

Osmani's patterns synthesize the practitioner consensus: hierarchical decomposition, worktree isolation, structural enforcement via hooks, human-authored context, and spec-driven task definition. The 3-5 agent sweet spot and the tier-based tool stack provide concrete design parameters.

---

## Synthesis: Implications for Coordination Architecture Design

### Converging Evidence

1. **Flat coordination fails.** Cursor's locking experiment (20 agents collapsing to 2-3 effective) and the DORA paradox (individual gains, organizational stagnation) both demonstrate that unstructured parallelism creates bottlenecks.

2. **Hierarchical role separation works.** Planner/worker/judge (Cursor), manager/researcher/engineer/reviewer (Agyn), and feature-lead/specialist (Osmani) all converge on the same pattern: separate planning from execution from evaluation.

3. **Structural enforcement is mandatory.** Prompt-based constraints fail 72%+ of the time under adversarial conditions. Worktree isolation, filesystem permissions, and hook-based enforcement provide the guarantees that coordination requires.

4. **Optimal parallelism is bounded.** 3-5 agents per team, with hierarchical nesting for larger systems. Beyond this, coordination overhead dominates.

5. **The bottleneck has shifted.** Code generation is no longer the constraint. Verification, review, and integration are. Coordination architectures must invest disproportionately in quality gates.

6. **Specs are leverage.** The quality of task specifications determines whether parallelism multiplies value or multiplies errors.

### Open Questions

- No controlled experiment measures features/hour for sequential vs. parallel agents on identical task sets.
- SWE-Bench does not capture the coordination challenges of multi-file, multi-feature parallel development.
- The long-term maintenance cost of multi-agent-generated code is unmeasured.
- Semantic conflict detection (beyond textual merge conflicts) remains unsolved in practice.

---

## Sources

- [DORA 2025 Report](https://dora.dev/research/2025/dora-report/)
- [Faros AI: DORA Report Key Takeaways](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025)
- [Cursor: Scaling Long-Running Autonomous Coding](https://cursor.com/blog/scaling-agents)
- [Addy Osmani: The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/)
- [Addy Osmani: Conductors to Orchestrators](https://addyosmani.com/blog/future-agentic-coding/)
- [Addy Osmani: Stop Using /init for AGENTS.md](https://addyosmani.com/blog/agents-md/)
- [Agyn: Coding Agent Teams 72.2% on SWE-bench](https://dev.to/nikita_benkovich_eb86e54d/coding-agent-teams-outperform-solo-agents-722-on-swe-bench-verified-4of5)
- [Verdent AI: Multi-Agent 76.1% on SWE-bench](https://jangwook.net/en/blog/en/multi-agent-swe-bench-verdent/)
- [SWE-bench Leaderboards](https://www.swebench.com/)
- [Agentless (arXiv:2407.01489)](https://arxiv.org/abs/2407.01489)
- [AgentSpec (arXiv:2503.18666)](https://arxiv.org/abs/2503.18666)
- [Progent (arXiv:2504.11703)](https://arxiv.org/abs/2504.11703)
- [Prompt Flow Integrity (arXiv:2503.15547)](https://arxiv.org/html/2503.15547v2)
- [OpenAI Codex App with Git Worktrees](https://dev.to/damogallagher/openai-shipped-a-codex-macos-app-multi-agent-threads-built-in-git-worktrees-3aoh)
- [Agentmaxxing: Run Multiple AI Agents in Parallel](https://vibecoding.app/blog/agentmaxxing)
- [O'Reilly: Conductors to Orchestrators](https://www.oreilly.com/radar/conductors-to-orchestrators-the-future-of-agentic-coding/)
- [Optimizing Sequential Multi-Step Tasks with Parallel LLM Agents (arXiv)](https://arxiv.org/html/2507.08944v1)
