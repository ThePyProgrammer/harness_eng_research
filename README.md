# AI Coding Agent Harness Architecture Papers

This repository is a research corpus on **AI coding agent harness architecture**: the systems, controls, metrics, and formal models needed to make agentic software development reliable, secure, governable, economical, and usable.

The main deliverable is the paper corpus organized around [`science/`](science/) and [`pillars/`](pillars/). The umbrella paper gives the unified framework, while each pillar folder contains one canonical paper plus supporting research, notes, reviews, drafts, and preserved archives.

## Canonical paper set

| Paper | Role |
|---|---|
| [**A Formal Framework for AI Coding Agent Harness Architecture**](science/paper/science.pdf) | Umbrella framework tying together all architectural dimensions |

## Pillars

| Pillar | Paper | Focus |
|---|---|---|
| [Abstraction](pillars/abstraction/) | [PDF](pillars/abstraction/paper/abstraction_architecture.pdf) | Specification-to-code abstraction gaps, refinement, and formal interfaces |
| [Information](pillars/information/) | [PDF](pillars/information/paper/information_architecture.pdf) | Context selection, degradation, tiered memory, and reuse discovery |
| [Reliability](pillars/reliability/) | [PDF](pillars/reliability/paper/reliability_architecture.pdf) | Compound error, verification scheduling, structural enforcement, and adaptive verification |
| [Coordination](pillars/coordination/) | [PDF](pillars/coordination/paper/coordination_architecture.pdf) | Multi-agent decomposition, merge conflicts, ownership, and quality-adjusted speedup |
| [Temporal](pillars/temporal/) | [PDF](pillars/temporal/paper/temporal_architecture.pdf) | Verified iterations per hour, staleness, speculation, caching, and speed-quality tradeoffs |
| [Quality](pillars/quality/) | [PDF](pillars/quality/paper/quality_architecture.pdf) | AI code slop, layered defense, detection limits, accretion, and cost of quality |
| [Governance](pillars/governance/) | [PDF](pillars/governance/paper/governance_architecture.pdf) | Governance capacity, ratchets, decision survival, and theory preservation |
| [Economics](pillars/economics/) | [PDF](pillars/economics/paper/economics_architecture.pdf) | Token budgets, model-tier selection, queueing economics, CVIH, and caching economics |
| [Human Interaction](pillars/human-interaction/) | [PDF](pillars/human-interaction/paper/human_interaction_architecture.pdf) | Human attention allocation, autonomy boundaries, trust calibration, and supervision decay |
| [Model Routing](pillars/model-routing/) | [PDF](pillars/model-routing/paper/model_routing_architecture.pdf) | Stage-specific model assignment, cross-model diversity, cascades, and escalation |
| [Security](pillars/security/) | [PDF](pillars/security/paper/security_architecture.pdf) | Sandboxing, credential flow, prompt injection, output filtering, and defense-in-depth |
| [Accretion](pillars/accretion/) | [PDF](pillars/accretion/paper/accretion_category.pdf) | Individually plausible but collectively harmful AI-generated code |

## Repository structure

```text
science/     umbrella paper, cross-pillar synthesis, reviews, and drafts
pillars/     pillar-specific papers, notes, research, reviews, and archives
assets/      shared LaTeX classes and shared resources
archive/     preserved root legacy and ambiguous artifacts
docs/        migration notes and design/implementation plans
```

## Reading paths

- **Fast overview:** start with [`science/paper/science.pdf`](science/paper/science.pdf), then read the pillar README matching your concern.
- **Building a harness:** abstraction, information, reliability, security, human interaction, governance.
- **Scaling multi-agent work:** coordination, reliability, temporal, model routing, quality.
- **Cost and latency:** economics, temporal, model routing, information.
- **Production hardening:** security, reliability, governance, quality, human interaction.
- **AI code degradation:** quality, accretion, governance, temporal.

## Archive status

Archive folders preserve drafts, backups, duplicate paper versions, build artifacts, and ambiguous material. They are retained for provenance but are not canonical unless a pillar README explicitly says otherwise.
