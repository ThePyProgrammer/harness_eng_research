# The SDD Ontology

A universal taxonomy for evaluating coding agent harnesses. Encompasses 10 pipeline stages and 12 cross-cutting capabilities, derived from analyzing 6 frameworks: GSD, OpenSpec, Spec Kit, Kiro, BMAD, and Taskmaster AI.

## 10 Pipeline Stages

| Stage | Name | What It Does |
|-------|------|-------------|
| S1 | **Init** | Bootstrap project structure, install tooling, configure runtime |
| S2 | **Governing Principles** | Establish values, constraints, coding standards (e.g., constitution.md) |
| S3 | **Requirements** | Capture what to build and why — user stories, acceptance criteria |
| S4 | **Discussion** | Interactive dialogue to surface ambiguities and align decisions |
| S5 | **Roadmap** | Decompose project into ordered phases or milestones |
| S6 | **Architecture** | Define technical approach, component design, data flow |
| S7 | **Task Decomposition** | Break design into discrete, executable work units |
| S8 | **Execution** | AI agent(s) write code following the plan |
| S9 | **Verification** | Validate implementation meets requirements |
| S10 | **Completion** | Archive, tag release, prepare for next iteration |

## 12 Cross-Cutting Capabilities

| CC | Name | Description |
|----|------|-------------|
| CC1 | **Multi-Agent** | Multiple specialized agents with distinct roles |
| CC2 | **Context Engineering** | Managing context window limits (isolation, fresh contexts) |
| CC3 | **Multi-Runtime** | Supporting multiple AI backends or IDEs |
| CC4 | **Git Integration** | Atomic commits, branch management, release tagging |
| CC5 | **Dependencies** | Tracking task dependencies, ordering execution |
| CC6 | **Guardrails** | Runtime enforcement preventing bad outcomes |
| CC7 | **Human Gates** | Explicit approval points before proceeding |
| CC8 | **UI/UX Design** | Dedicated frontend design and visual auditing |
| CC9 | **Cost Tracking** | Monitoring AI usage costs |
| CC10 | **Pause/Resume** | State persistence across sessions |
| CC11 | **Composability** | Ability to combine with other frameworks |
| CC12 | **Autonomous Operation** | Running multiple stages without human intervention |

## Framework Coverage Scores

| Framework | Pipeline (10) | Cross-Cut (12) | Total (22) | % |
|---|---|---|---|---|
| **GSD** | 9.0 | 11.0 | **20.0** | **91%** |
| **BMAD** | 7.0 | 6.0 | **13.0** | **59%** |
| **Spec Kit** | 7.5 | 4.5 | **12.0** | **55%** |
| **OpenSpec** | 6.5 | 4.0 | **10.5** | **48%** |
| **Kiro** | 6.5 | 4.0 | **10.5** | **48%** |
| **Taskmaster** | 4.5 | 5.0 | **9.5** | **43%** |

## Five Philosophical Stances

1. **Spec-First** (OpenSpec, Spec Kit, Kiro) — Specifications are the primary artifact; code is their expression
2. **Execution-First** (GSD) — Methodology and workflow discipline drive quality
3. **Guardrail-First** (claude-code-harness) — Runtime enforcement prevents bad outcomes
4. **Role-First** (BMAD) — Specialized AI personas mirror human team roles
5. **Task-First** (Taskmaster AI) — Decomposition and dependency management keep agents on track

## See Also

- [[harness-engineering|What Is Harness Engineering?]]
- [[what-is-slop|What Is Code Slop?]]
- [SDD Ontology Canvas](../canvases/sdd-ontology.canvas) — Visual version with full coverage matrix
- [[gsd-desloppification|GSD Improvement Proposal]] — Anti-slop improvements mapped to this ontology
