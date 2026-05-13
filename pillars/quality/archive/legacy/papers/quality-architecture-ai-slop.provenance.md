# Provenance: Quality Architecture for AI-Generated Code

## Metadata
- **Date:** 2026-04-03
- **Source document:** pillars/5-quality-architecture.md
- **Slug:** quality-architecture-ai-slop
- **Pipeline:** research-paper (8-stage)

## Research Rounds

### Stage 2: Deep Research (5 parallel agents)
- R1: Empirical AI code quality landscape (8 studies)
- R2: Formal detection theory (signal detection, cascades, information theory, Rice's theorem)
- R3: Enforcement mechanisms (AgentSpec, Spotify Honk, METR, Apollo, NIST CAISI, ETH Zurich)
- R4: Defect taxonomy history (IEEE 1044, ODC, Beizer, CWE, AI-specific taxonomies)
- R5: Adjacent domain defense (network security, medical screening, manufacturing QC, economics)

### Stage 3: Formalization Research (3 parallel agents)
- F1: Information-theoretic foundations (DPI, FKG, submodularity, Turing enforcement)
- F2: Type-theoretic classification and metrics (formal taxonomy, codebase entropy, DRE composition, CoQ model)
- F3: Empirical calibration data (18x4 detection matrix, cost estimates, ROI calculations, correlation data)

## Sources Consulted vs Accepted

- **Web searches:** ~100+ queries across 8 research agents
- **Primary sources identified:** 30+
- **Sources cited in paper:** 28 (quality-architecture.bib)
- **Key calibration points:** CodeRabbit (470 PRs), GitClear (211M lines), Spotify Honk (1,500+ PRs), METR (1,160+ attempts), AgentSpec (750 scenarios), Veracode (100+ LLMs), Apollo Research (scheming rates), NIST CAISI (enforcement attacks)

## Verification Status

- **Peer review conducted:** Yes (simulated, outputs/quality-architecture-ai-slop-review.md)
- **MAJOR issues found:** 2 (Rice's theorem proof, sensitivity analysis)
- **MAJOR issues fixed:** 2/2
- **MINOR issues found:** 9
- **MINOR issues addressed:** 5/9 (orthogonality hypothesis labeling, compound degradation assumption, missing related work, temporal dynamics, cost parameterization)
- **Compilation:** Successful (tectonic, warnings only: overfull hbox)

## Intermediate Research Files

| File | Description |
|------|-------------|
| outputs/.plans/quality-architecture-ai-slop.md | Research plan |
| outputs/quality-architecture-ai-slop-research-r1.md | R1: Empirical landscape |
| outputs/quality-architecture-ai-slop-research-r2.md | R2: Formal detection theory |
| outputs/quality-architecture-ai-slop-research-r3.md | R3: Enforcement mechanisms |
| outputs/quality-architecture-ai-slop-research-r4.md | R4: Defect taxonomy |
| outputs/quality-architecture-ai-slop-research-r5.md | R5: Adjacent domain defense |
| outputs/quality-architecture-ai-slop-formal-r1.md | F1: Information-theoretic foundations |
| outputs/quality-architecture-ai-slop-formal-r2.md | F2: Type-theoretic classification |
| outputs/quality-architecture-ai-slop-formal-r3.md | F3: Empirical calibration data |
| outputs/quality-architecture-ai-slop-review.md | Peer review |

## Final Deliverables

| File | Description |
|------|-------------|
| papers/quality-architecture-ai-slop.pdf | Final compiled paper |
| papers/quality-architecture-ai-slop.provenance.md | This file |
| quality-architecture.tex | LaTeX source |
| quality-architecture.bib | Bibliography (28 entries) |
