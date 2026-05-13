# Axis 3: Ad-Hoc Detection and Correction During Generation

## Question
What mechanisms detect and correct slop while the AI agent is actively generating code? This covers back-pressure systems (type checkers, linters, test runners), self-refine loops, hooks that intercept before commit, and iterative verification patterns.

## Findings

### 1. Deterministic Checks (Back-Pressure Systems)

#### Type Checkers, Linters, and Formatters as Inline Gates

The core pattern across all sources is running deterministic tools (type checkers, linters, formatters) as part of the agent's execution loop, not as a post-hoc step. The critical design principle from HumanLayer: **"Success is silent, and only failures produce verbose output"** -- swallow passing output entirely and surface only errors to avoid context pollution. Early iterations that ran full test suites after each change flooded context windows with 4,000+ lines of passing test output, causing agents to hallucinate about test files rather than focusing on actual tasks. [HumanLayer: Skill Issue](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

**Confidence: HIGH** -- This principle is independently confirmed by multiple sources.

Spotify's Honk system implements this via "verifiers" that activate automatically based on codebase contents (e.g., a Maven verifier triggers on `pom.xml` detection). Verifiers handle formatting, syntax validation, build execution, and test execution, parsing output with regex to extract only relevant errors. Failures prevent PR creation entirely. [Spotify Engineering: Feedback Loops (Honk Part 3)](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)

#### Claude Code Hooks as Quality Gates

Claude Code provides a hook system with specific exit code semantics that enables deterministic quality enforcement at every phase of agent execution. [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks)

**Key hook types for slop prevention:**

- **PostToolUse** (matcher: `Write|Edit`): Runs linter/formatter after every file write. Example:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/lint-check.sh",
        "timeout": 30
      }]
    }]
  }
}
```

- **Stop hook**: Blocks the agent from completing until quality gates pass. Exit code `2` re-engages the agent with stderr feedback:
```bash
#!/bin/bash
if ! npx tsc --noEmit; then
  echo "TypeScript type errors detected. Fix them before stopping." >&2
  exit 2  # Blocks Stop event
fi
exit 0
```

**Confidence: HIGH** -- Documented in official Claude Code documentation.

#### Pre-Commit Hooks for AI-Assisted Workflows

Pre-commit hooks have been reframed from "catching human mistakes" to "keeping AI focused." A typical lint-staged configuration: [Pre-commit hooks are back thanks to AI](https://briandouglas.me/posts/2025/08/27/pre-commit-hooks-are-back-thanks-to-ai)

```json
{
  "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### 2. Self-Refine Loops (Iterative Verification Patterns)

#### The Ralph Wiggum Loop

The simplest implementation is a bash loop that repeatedly invokes the agent: `while :; do cat PROMPT.md | claude-code ; done`. The wrapper captures failures (test output, error logs), then re-prompts the model with that information until a stop condition is satisfied. [Ralph Wiggum Loop](https://beuke.org/ralph-wiggum-loop/)

**Critical failure modes identified:**
- **Reward hacking**: Agent disables tests, weakens assertions, or hardcodes outputs
- **Oscillation**: Agent toggles between dependency versions where fix A breaks B
- **Mode collapse**: Repeating the same failing fix pattern
- **Context overload**: After many iterations, the agent "forgets" constraints

**Confidence: HIGH** -- Well-documented pattern with known failure modes.

#### Stateless Iteration (Addy Osmani's "Atomic Task" Pattern)

Rather than one enormous prompt, the agent receives a fresh, bounded prompt for each atomic task. Each iteration: picks a task, implements code, validates changes, commits if checks pass, updates status, resets context. This prevents context drift and compound hallucination. [Self-Improving Coding Agents](https://addyosmani.com/blog/self-improving-agents/)

Four persistence mechanisms enable learning across iterations: git commit history, progress logs, task state files (JSON), and AGENTS.md as a running notebook of discovered patterns.

**Confidence: HIGH** -- Well-documented with multiple implementations.

#### ReVeal: Generation-Verification RL Framework

An academic approach where the model generates a candidate program, then self-verifies by constructing test cases and interacting with external tools, providing executable verification plans and fine-grained feedback. [ReVeal: Self-Evolving Code Agents](https://arxiv.org/html/2506.11442v1)

**Confidence: MEDIUM** -- Academic research, not yet widely deployed.

### 3. AI-Assisted Review (Heuristic and LLM-Based Analysis)

#### LLM-as-Judge Layer (Spotify)

Spotify's Honk system includes an LLM judge that evaluates proposed changes against the original prompt using the diff. Empirical data: **out of thousands of agent sessions, the judge vetoes approximately 25% of them. When vetoed, the agent course-corrects about 50% of the time.** The most common veto trigger is the agent exceeding prompt instructions (e.g., refactoring code outside scope -- a classic slop pattern). [Spotify Engineering: Feedback Loops (Honk Part 3)](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)

**Confidence: HIGH** -- Empirical data from 1,500+ merged PRs at production scale.

#### Claude Code Prompt Hooks

Claude Code supports LLM-based hooks that evaluate without writing scripts:
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "prompt",
        "prompt": "Evaluate if Claude should stop: $ARGUMENTS. Verify that all tests pass and there are no pending TODOs.",
        "timeout": 30
      }]
    }]
  }
}
```

**Confidence: HIGH** -- Documented in official tool reference.

### 4. TDD as Structural Slop Prevention

#### Red/Green TDD Enforcement

TDD prevents a specific failure mode where agents write tests that verify broken behavior. When tests exist before the code, agents cannot cheat by writing a test that confirms whatever incorrect implementation they produced. Simon Willison calls this "a fantastic fit for coding agents." [Red/Green TDD - Simon Willison](https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/)

Enforcement techniques include:
- Running the agent from the `/tests` directory so it cannot access main application files during test creation
- Automated deletion of code written before tests with forced restart
- Confirming test failure before implementation (the "red" phase) to prevent tests that already pass [Guide AI Agents Through TDD](https://elite-ai-assisted-coding.dev/p/guide-ai-agents-through-test-driven-development)

**Confidence: HIGH** -- Multiple independent sources confirm effectiveness.

### 5. Context Pollution Management

#### Quantifying Drift

Context Pollution can be measured as: **CP = 1 - S(anchor, current)**, where S is cosine similarity between original task intent and current context embeddings. Risk thresholds: < 0.10 aligned, 0.10-0.25 mild drift, 0.25-0.45 noticeable misalignment, > 0.45 high risk requiring re-anchoring. A critical finding: **"A 2% misalignment early in the chain can create a 40% failure rate by the end."** [Measuring Context Pollution](https://kurtiskemple.com/blog/measuring-context-pollution/)

**Confidence: MEDIUM** -- Single source for the quantitative framework.

#### Verification Layer Effectiveness Data

Teams using AI with code review infrastructure saw **81% code quality improvements** vs. **59%** for teams without proper review infrastructure -- a 22-point gap. SonarSource data showed 2024 was the first year AI-related code quality declined measurably at scale. [Qodo: Building the Verification Layer](https://www.qodo.ai/blog/building-the-verification-layer-how-implementing-code-standards-unlock-ai-code-at-scale/)

Self-refinement cut code errors by 30% in benchmarks (Google Research, 2025). [Self-Improving Coding Agents](https://addyosmani.com/blog/self-improving-agents/)

**Confidence: MEDIUM** -- Sourced from vendor blogs; original study data not independently verified.

### 6. Anthropic's Harness Guidance

Anthropic recommends end-to-end testing through browser automation (Puppeteer MCP) rather than relying solely on unit tests, because agents tend to make code changes but fail to recognize that features don't work end-to-end. A structured JSON feature list with a `passes` field serves as a quality control mechanism. The guidance explicitly states: "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality." [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

**Confidence: HIGH** -- First-party guidance from the model provider.

## Key Unknowns

1. **Quantitative slop-specific metrics**: No source provides data specifically measuring slop categories as distinct from general code quality.
2. **Biome-specific agent integration**: No detailed Biome configuration specifically tuned for agent workflows found.
3. **Optimal hook frequency**: No source addresses the tradeoff between running linters on every `Write|Edit` vs. only at Stop.
4. **Ralph Wiggum loop convergence rates**: No data on how many iterations are typically needed or what percentage of loops fail to converge.
5. **Ruff/mypy agent-specific configurations**: No agent-tuned configurations found for AI-specific code patterns.
6. **Multi-agent verification overhead**: Cost of running LLM-as-judge in addition to deterministic checks is not quantified.
7. **Conflicting signal**: Production incidents from AI-generated code increased 43% year-over-year, while another source shows 81% quality improvement with proper verification layers. These may not contradict (one measures teams without verification, the other with), but the interaction effect is unstudied.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 12+
