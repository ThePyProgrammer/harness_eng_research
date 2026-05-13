# Harness Engineering Wiki

A research wiki on AI coding agent harnesses — how they work, how to prevent code slop, and how the major frameworks compare.

*212 sources · 21+ frameworks · 18 slop types · 10-stage SDD ontology*

---

## Core Concepts

- [[what-is-slop|What Is Code Slop?]] — Definition, 18-type taxonomy, scoring tools, key statistics
- [[harness-engineering|What Is Harness Engineering?]] — The 2026 consensus: `coding agent = AI model(s) + harness`
- [[sdd-ontology|The SDD Ontology]] — 10-stage pipeline + 12 cross-cutting capabilities unifying all frameworks

## Framework Analyses

- **[[gsd]]** — Execution-first (23K stars) · [Canvas](../../science/synthesis/canvases/frameworks/gsd.canvas)
- **[[openspec]]** — Spec-first, YC-backed · [Canvas](../../science/synthesis/canvases/frameworks/openspec.canvas)
- **[[speckit]]** — Agent-agnostic SDD, GitHub · [Canvas](../../science/synthesis/canvases/frameworks/speckit.canvas)
- **[[kiro]]** — Purpose-built IDE, Amazon · [Canvas](../../science/synthesis/canvases/frameworks/kiro.canvas)
- **[[bmad]]** — Role-first multi-agent · [Canvas](../../science/synthesis/canvases/frameworks/bmad.canvas)
- **[[taskmaster]]** — Task-first decomposition · [Canvas](../../science/synthesis/canvases/frameworks/taskmaster.canvas)
- **[[desloppify]]** — Post-hoc cleanup harness · [Canvas](../../pillars/quality/notes/canvases/desloppify.canvas)

## De-Sloppification

- [[what-is-slop|Slop Taxonomy]] — 18 types from CRITICAL to LOW-MEDIUM
- [[de-sloppification-report|Research Report]] — Three-stage defense model (pre-hoc, ad-hoc, post-hoc)
- [[desloppify|Desloppify Analysis]] — Post-hoc cleanup tool, 10/18 slop types, anti-gaming scoring
- [[gsd-desloppification|GSD Improvement Proposal]] — 13 changes across S1-S10, covering 18/18 slop types

## Research

### Harness Frameworks (Research Project 1)
- [[harness-frameworks-report|Full Report]] — 13 frameworks, 6 architectural patterns, 111 sources
- [[harness-frameworks-gaps|Gap Analysis]]
- Findings: [[axis-1-landscape-survey|Landscape]] · [[axis-2-metaprompt-patterns|Metaprompting]] · [[axis-3-pipeline-orchestration|Orchestration]] · [[axis-4-evaluation-benchmarks|Evaluation]] · [[axis-5-optimization-strategies|Optimization]] · [[followup-1-human-ai-discussion|Discussion Patterns]] · [[followup-2-practical-harness-ecosystem|Practical Ecosystem]]

### De-Sloppification (Research Project 2)
- [[de-sloppification-report|Full Report]] — 18 slop types, three-stage defense, 73 sources
- [[de-sloppification-gaps|Gap Analysis]]
- Findings: [[axis-1-taxonomy-of-code-slop|Taxonomy]] · [[axis-2-pre-hoc-prevention|Pre-Hoc]] · [[axis-3-ad-hoc-detection|Ad-Hoc]] · [[axis-4-post-hoc-cleanup|Post-Hoc]] · [[axis-5-framework-anti-slop|Framework Mapping]]

## Proposals

- [[gsd-desloppification|GSD De-Sloppification]] — 13 improvements, 4 implementation waves
- [[gsd-pain-points|GSD Pain Points]] — Known friction areas

## Canvases

- [Harness Landscape](../../science/synthesis/canvases/harness_landscape.canvas) — Master canvas: patterns, ontology, ecosystem, slop, improvements
- [SDD Ontology](../../science/synthesis/canvases/sdd-ontology.canvas) — 10 stages, 12 capabilities, 6 frameworks scored
- [Desloppify](../../pillars/quality/notes/canvases/desloppify.canvas) — Architecture, loop, scoring, anti-gaming
- Framework canvases: [GSD](../../science/synthesis/canvases/frameworks/gsd.canvas) · [OpenSpec](../../science/synthesis/canvases/frameworks/openspec.canvas) · [Spec Kit](../../science/synthesis/canvases/frameworks/speckit.canvas) · [Kiro](../../science/synthesis/canvases/frameworks/kiro.canvas) · [BMAD](../../science/synthesis/canvases/frameworks/bmad.canvas) · [Taskmaster](../../science/synthesis/canvases/frameworks/taskmaster.canvas)
