# Harness Tools: Paper Framework vs. Existing Practice

## What the Paper Suggests vs. What Already Exists

The paper's six design principles operate at a different altitude than the existing harness documentation in this repo. The repo documents **operational harness engineering** (hooks, agents, lint gates, context isolation). The paper provides **a theory of why certain harness designs should work better than others**. The interesting question is where the theory predicts tools that don't yet exist.

---

## Mapping: Design Principles to Existing Tools

| Paper Principle | Existing Coverage in This Repo | Gap? |
|----------------|-------------------------------|------|
| P1: Operate at the specification level | OpenSpec, Spec Kit, Kiro (spec-first); GSD's REQUIREMENTS.md + PLAN.md | Partial. Specs exist but are NL prose, not formal. |
| P2: Support multiple formalism levels | ANTI-SLOP.md has Always/Ask/Never tiers; QUALITY-STACK.md detects linters/type-checkers | Partial. Multiple tools, but not multiple *specification* formalisms. |
| P3: Use AI as a formalism translator | No existing tool does this. | **Full gap.** |
| P4: Employ continuous verification | PostToolUse hooks, Stop hooks, back-pressure, plan-checker, gsd-verifier | Well covered. The strongest area. |
| P5: Select topology by task structure | GSD has 12+ specialized agents; fresh 200K context per task; but topology is fixed (centralised orchestrator) | Partial. Agent specialization exists, but topology selection is static. |
| P6: Preserve the theory | Conversation logs persist in Claude Code; GSD archives PLAN.md + VERIFICATION.md | Partial. Artifacts are preserved, but not the *reasoning* behind design choices. |

---

## What Needs to Be Built: Tools the Paper Predicts

The paper's framework, combined with the repo's gap analysis, suggests five tools that don't exist in any current harness. These aren't incremental improvements to GSD (like the de-sloppification proposal); they're structurally new capabilities.

### 1. Formalism Translator (from P3 + Convergence Theorem)

**What it is:** An agent that takes a natural language specification (REQUIREMENTS.md, user stories, a prompt) and produces a *formal* specification in the appropriate formalism for the component's criticality level, for human review.

**Why:** The paper's convergence theorem says that for complex programs, the specification must contain essentially all the information of the implementation. Current harnesses (GSD, Cursor, Claude Code) accept NL specs and jump straight to code. The translation step (NL to formal spec to code) is missing. The vericoding pattern (82% on Dafny) shows this works.

**Concretely:**
- For API contracts: generate OpenAPI schemas or Zod schemas from NL descriptions
- For state machines: generate XState or statechart definitions from "the user flow should..."
- For data models: generate Prisma/Drizzle schemas with constraints from "we need a table for..."
- For invariants: generate property-based test skeletons (fast-check / Hypothesis) from "this function should always..."

**How it differs from existing tools:** GSD's `gsd-phase-researcher` researches *how* to implement; this tool would produce a *reviewable formal artifact* between the spec and the code. The human reviews the schema/statechart/contract, not the code. Reviewing is cheaper than authoring (the paper's key insight for P3).

**Integration point:** New stage between S6 (Architecture) and S7 (Task Decomposition) in the SDD ontology. Call it S6.5: Formal Contract Generation.

### 2. Sigma-Adaptive Verification Selector (from P2 + Uncanny Valley)

**What it is:** A tool that, given a component and its specification, selects the appropriate verification intensity based on the component's criticality and the specification's formality level.

**Why:** The paper's uncanny valley observation predicts that semi-formal specs (sigma 0.3-0.45) produce the worst outcomes: too formal to be flexible, too informal to be verified. Current harnesses apply the same verification to everything (run the linter, run the tests). The theory says verification should scale with formalism level.

**Concretely:**
- NL spec (sigma < 0.3): shallow verification (lint + type-check + snapshot tests)
- Contract spec (sigma 0.5-0.7): medium verification (property-based tests + contract conformance + mutation testing on the contract boundary)
- Formal spec (sigma > 0.7): deep verification (proof obligations + model checking + exhaustive test generation from the spec)

**How it differs from existing tools:** GSD's QUALITY-STACK.md detects *what tools exist*. This tool would select *which tools to run and how aggressively*, based on the formality of the specification for that component. A Zod-schemaed API endpoint gets schema conformance testing. A prose-described utility gets lint + basic tests. A TLA+-specified protocol gets model checking.

**Integration point:** Extension to S9 (Verification) in the SDD ontology. The Stop hook selects its gate intensity based on the spec type.

### 3. Abstraction Gap Monitor (from the Shannon Channel Model + S5)

**What it is:** A runtime metric that estimates the information-theoretic distance between the specification and the generated code, using NCD (normalised compression distance) as a computable proxy for the paper's uncomputable G(S, P).

**Why:** The paper identifies the abstraction gap as the central design parameter but admits it's uncomputable. The Shannon channel model section suggests computable proxies. NCD with a practical compressor (zstd) gives a rough, cheap estimate. If the NCD between spec and code is high, the agent is "filling in a lot of information from its prior," which correlates with slop risk. If NCD is low, the spec is already close to code and the agent's job is mostly transcription, which is safer.

**Concretely:**
- After each executor produces code, compute NCD(spec_text, code_text) using zstd compression
- Track this metric per phase, per task, per file
- Flag tasks where NCD exceeds a threshold (calibrated against historical pass/fail data) as "high-gap, high-slop-risk"
- Route high-gap tasks to more aggressive verification (connecting to Tool 2)

**How it differs from existing tools:** No existing harness measures the *information distance* between what was asked and what was produced. GSD's verifier checks goal achievement (did the output match the spec?), but it doesn't measure how much the agent had to "make up" along the way. This metric would be the first operational instantiation of the paper's core concept.

**Integration point:** New cross-cutting capability (CC13: Gap Monitoring) in the SDD ontology. Feeds into the verification selector.

### 4. Dynamic Topology Selector (from P5 + Kim et al. Empirical Findings)

**What it is:** A tool that selects agent coordination topology (single-agent, independent MAS, centralised MAS) based on task characteristics, rather than using a fixed topology for all tasks.

**Why:** Kim et al. found that independent agents amplify errors 17.2x while centralised coordination reduces this to 4.4x, but capability saturation occurs at ~45% single-agent performance. GSD uses a fixed centralised topology (orchestrator dispatches specialized agents). The theory says this is suboptimal: parallelisable tasks with well-specified subtasks should use independent agents; complex tasks requiring coordination should use centralised; tasks within single-agent capability should skip multi-agent overhead entirely.

**Concretely:**
- Estimate task complexity from the PLAN.md (lines changed, files touched, dependency count)
- Estimate task decomposability (can subtasks be specified independently?)
- If complexity is low and single-agent capability is high: single agent, no orchestrator overhead
- If complexity is high and decomposable: independent parallel agents with final aggregation
- If complexity is high and tightly coupled: centralised orchestrator with review rounds
- If complexity exceeds all agent capability: flag for human decomposition

**How it differs from existing tools:** GSD always uses the same topology: orchestrator + specialized sub-agents. Cursor uses a single agent. Claude Code uses a single agent with optional sub-agents. No harness dynamically selects topology. This would be the first implementation of the paper's P5.

**Integration point:** Modifies S8 (Execution) in the SDD ontology. The executor command inspects the PLAN.md and selects topology before dispatching.

### 5. Theory Preservation System (from P6 + Naur)

**What it is:** A structured system for capturing the *reasoning* behind design decisions, not just the decisions themselves, with automatic extraction from agent conversation logs.

**Why:** Naur's "programming as theory building" (which the paper acknowledges cannot be fully captured, but partially preserved) suggests that the most valuable artifact is not the code or the spec but the *theory* connecting them: why this approach was chosen, what alternatives were rejected, what assumptions were made. Current harnesses preserve conversation logs but don't extract structured knowledge from them.

**Concretely:**
- After each phase, an extraction agent reads the executor's conversation log and produces:
  - **Decisions made**: "Used Redis for caching instead of in-memory because X"
  - **Assumptions**: "Assumed max 10K concurrent users based on requirements"
  - **Rejected alternatives**: "Considered GraphQL but chose REST because Y"
  - **Invariants discovered**: "The auth token must be refreshed before every API call because Z"
- These are written to `.planning/{N}-THEORY.md` and persisted across phases
- The theory document is injected into future executor contexts for the same component, so agents don't re-derive decisions or (worse) make contradictory ones

**How it differs from existing tools:** GSD preserves PLAN.md, VERIFICATION.md, and RESEARCH.md. These document *what* was planned and *whether* it worked. They don't document *why* specific choices were made. The theory document captures the rationale that otherwise lives only in conversation logs that get discarded or context-compacted. This is also where ADR (Architecture Decision Record) integration would naturally live, connecting to the blueprint system documented in your CLAUDE.md.

**Integration point:** New artifact in the SDD ontology, generated at S10 (Completion) but incrementally built during S8 (Execution). Feeds into S4 (Discussion) of subsequent phases.

---

## Comparison: Before and After

| Dimension | Current Harnesses (GSD, Spec Kit, etc.) | Paper-Informed Harnesses |
|-----------|----------------------------------------|--------------------------|
| **Specification** | NL prose (REQUIREMENTS.md, prompts) | Multi-formalism: NL for intent, formal contracts for interfaces, schemas for data |
| **Spec-to-code path** | Direct: NL prompt to code | Mediated: NL to formal spec (AI-generated, human-reviewed) to code |
| **Verification intensity** | Uniform: same lint/test/type-check for all code | Adaptive: verification scales with spec formality and component criticality |
| **Quality signal** | Binary: tests pass or fail | Continuous: NCD-based gap metric estimates how much the agent "made up" |
| **Agent topology** | Fixed: centralised orchestrator (GSD) or single agent (Claude Code) | Dynamic: topology selected per-task based on complexity and decomposability |
| **Knowledge preservation** | Artifacts (plans, verification reports) | Artifacts + structured theory (decisions, assumptions, rejected alternatives) |
| **Slop prevention model** | Post-hoc: hooks catch violations after generation | Pre-hoc + post-hoc: formal contracts prevent ambiguity; hooks catch residual violations |

---

## What the Paper Gets Wrong About Existing Practice

The paper's P1 ("operate at the specification level") assumes the bottleneck is spec quality. The repo's research tells a different story. The harness-engineering concept doc says the bottleneck is the harness, not the model or the spec. The real problems are:

1. **Context blindness** (slop type #4, duplicate logic): the agent doesn't know what already exists. No amount of spec formalism fixes this; you need reuse maps and codebase search (which GSD's de-sloppification proposal addresses).

2. **Compound error rates**: the Canvas Research on compound errors shows 85% per-step accuracy yields only 20% workflow success over 10 steps. This is a verification frequency problem, not a specification problem.

3. **Speed**: GSD takes 45-60 minutes per cycle. Adding a formalism translation step increases this. The practical constraint is iteration speed, not formal rigor.

The paper's framework is most useful not for everyday harness engineering but for the **critical-path components** where slop is unacceptable: auth systems, payment flows, data integrity constraints, distributed protocol coordination. For these, the formalism translator and sigma-adaptive verification are genuinely valuable. For the other 80% of a codebase, the existing GSD + hooks + back-pressure approach is sufficient.

---

## Recommended Build Order

1. **Formalism Translator** (highest value, addresses full gap at P3)
2. **Theory Preservation** (low implementation cost, high long-term value, connects to existing ADR/blueprint tooling)
3. **Abstraction Gap Monitor** (novel metric, enables data-driven verification decisions)
4. **Sigma-Adaptive Verification** (depends on #3 for routing signal)
5. **Dynamic Topology Selector** (most complex, least urgent until multi-agent is more mature)
