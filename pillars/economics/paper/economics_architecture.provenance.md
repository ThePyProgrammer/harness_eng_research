# Provenance Record: Economics Architecture for AI Coding Agent Harnesses

## Date
2026-04-03

## Pipeline Summary

| Stage | Description | Duration |
|-------|-------------|----------|
| Stage 1: Research Plan | Analyzed pillar 7, produced 8 research questions, 5-agent strategy | ~5 min |
| Stage 2: Deep Research | 5 parallel researcher agents (R1-R5) | ~9 min total (parallel) |
| Stage 3: Formalization | 3 parallel formalization agents (F1-F3) | ~10 min total (parallel) |
| Stage 4: Paper Writing | Synthesized all research into LaTeX + BibTeX | ~12 min |
| Stage 5: Compilation | tectonic compilation, reference verification | ~5 min |
| Stage 6: Peer Review | Simulated review (1 FATAL, 7 MAJOR, 8 MINOR issues) | ~3 min |
| Stage 7: Fixes | Addressed all FATAL and MAJOR issues, recompiled | ~10 min |
| Stage 8: Provenance | This document | ~2 min |

## Research Rounds

### Round 1: Deep Research (5 parallel agents)

| Agent | Dimension | Output File | Words |
|-------|-----------|-------------|-------|
| R1 | Historical economics (Markowitz, Kelly, Howard, Stigler, Blackwell) | `outputs/economics-architecture-research-r1.md` | ~4,760 |
| R2 | LLM cost engineering (pricing, caching, routing) | `outputs/economics-architecture-research-r2.md` | ~3,800 |
| R3 | Queueing theory and service economics (Kleinrock, developer time) | `outputs/economics-architecture-research-r3.md` | ~3,800 |
| R4 | Submodularity and optimization theory | `outputs/economics-architecture-research-r4.md` | ~4,200 |
| R5 | Contrarian positions, Jevons paradox, behavioral economics | `outputs/economics-architecture-research-r5.md` | ~3,800 |

### Round 2: Formalization Research (3 parallel agents)

| Agent | Dimension | Output File | Formal Results |
|-------|-----------|-------------|----------------|
| F1 | TBAP, EMR, Weakest-Link, Pareto frontier, VoI, CVIH | `outputs/economics-architecture-formal-r1.md` | 32 results |
| F2 | MTSP, JASP, queueing models, caching economics | `outputs/economics-architecture-formal-r2.md` | 16 defs, 8 thms |
| F3 | Jevons paradox, CVIH metric, calibration framework | `outputs/economics-architecture-formal-r3.md` | 17 defs, 10 thms |

## Sources Consulted vs. Accepted

- **Total sources identified during research:** ~80+
- **Sources cited in final paper:** 42 BibTeX entries
- **Primary academic papers:** ~25 (Markowitz, Kelly, Howard, Stigler, Blackwell, Boyd & Vandenberghe, Cover & Thomas, Nemhauser et al., Kleinrock, Jevons, Sorrell, Chen et al., Madaan et al., Ong et al., Liang et al., Zhang et al., Gao et al., etc.)
- **Industry/empirical sources:** ~10 (Anthropic, JetBrains, Chroma, METR, FinOps Foundation, IBM/Ponemon)
- **Pricing data sources:** 3 (Anthropic, OpenAI, Google; April 2026)

## Verification Status

| Check | Status |
|-------|--------|
| PDF compiles | Yes (tectonic, with expected class-file warnings) |
| Broken references (??) | 0 |
| Broken citations (?) | 0 |
| Em dashes in text | 0 (verified) |
| All cite keys matched | Yes (42/42) |
| Peer review conducted | Yes (Major Revision recommendation) |
| FATAL issues resolved | Yes (1/1: graceful degradation downgraded to conjecture) |
| MAJOR issues resolved | Yes (7/7: composition proof, Weakest-Link, independence, elasticity, budget separation, NP-hardness, Cache-First) |

## Intermediate Research Files

| File | Type |
|------|------|
| `outputs/.plans/economics-architecture.md` | Research plan |
| `outputs/economics-architecture-research-r1.md` | Research: historical economics |
| `outputs/economics-architecture-research-r2.md` | Research: LLM cost engineering |
| `outputs/economics-architecture-research-r3.md` | Research: queueing theory |
| `outputs/economics-architecture-research-r4.md` | Research: optimization theory |
| `outputs/economics-architecture-research-r5.md` | Research: contrarian positions |
| `outputs/economics-architecture-formal-r1.md` | Formalization: portfolio/TBAP |
| `outputs/economics-architecture-formal-r2.md` | Formalization: model routing/queueing |
| `outputs/economics-architecture-formal-r3.md` | Formalization: Jevons/CVIH/calibration |
| `outputs/economics-architecture-review.md` | Peer review |

## Final Deliverables

| File | Path |
|------|------|
| PDF | `final_papers/economics_architecture/economics_architecture.pdf` |
| LaTeX source | `final_papers/economics_architecture/economics_architecture.tex` |
| Bibliography | `final_papers/economics_architecture/economics_architecture.bib` |
| Provenance | `final_papers/economics_architecture/economics_architecture.provenance.md` |
