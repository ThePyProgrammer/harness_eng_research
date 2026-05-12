# Provenance: Reliability Architecture for Multi-Step AI Agent Pipelines

## Metadata
- **Date:** 2026-04-03
- **Slug:** reliability-architecture
- **Source document:** pillars/2-reliability-architecture.md

## Pipeline Summary
- **Research rounds:** 2 (4 parallel agents in round 1; 2 formalization agents in round 2)
- **Total researcher agents:** 6
- **Peer review rounds:** 1 (simulated)
- **Revision rounds:** 1 (addressed 3 MAJOR and 9 MINOR issues)

## Sources Consulted vs. Accepted
- **Web searches performed:** ~100+ across 6 agents
- **Distinct sources cited in final paper:** 32
- **Sources consulted but not cited:** ~50+ (background reading, corroborating sources, sources with insufficient specificity)

## Verification Status
- **Formal results:** All theorem statements verified for internal consistency. Proof of equal-spacing convexity was expanded after review identified incomplete derivation.
- **Empirical calibration:** Back-solved per-step reliabilities are internally consistent across 4 benchmarks (93-99% range). Acknowledged as consistency check, not model validation.
- **Cross-study parameter sensitivity:** Break-even analysis sensitivity documented after review flagged cross-study calibration issue.

## Final Deliverables

| File | Description |
|------|-------------|
| `papers/reliability-architecture.pdf` | Final compiled paper |
| `papers/reliability-architecture.provenance.md` | This file |
| `reliability-main.tex` | LaTeX source |
| `reliability.bib` | Bibliography |
| `outputs/reliability-architecture-review.md` | Peer review |
| `outputs/reliability-architecture-research-r1.md` | R1: Theoretical foundations |
| `outputs/reliability-architecture-research-r2.md` | R2: Empirical agent failure evidence |
| `outputs/reliability-architecture-research-r3.md` | R3: Verification mechanisms |
| `outputs/reliability-architecture-research-r4.md` | R4: Contrarian perspectives |
| `outputs/reliability-architecture-formal-r1.md` | F1: Information-theoretic formalization |
| `outputs/reliability-architecture-formal-r2.md` | F2: Metrics and calibration |
| `outputs/.plans/reliability-architecture.md` | Research plan |

## Review Issues Addressed

### MAJOR (all 3 addressed)
1. **Incomplete convexity proof** (Theorem 4.3): Expanded with full second derivative computation and domain of convexity.
2. **Circular calibration**: Added explicit acknowledgment that calibration demonstrates consistency, not validation.
3. **Cross-study parameters in break-even**: Added sensitivity analysis and parameter provenance discussion.

### MINOR (6 of 9 addressed)
- Added remark on blind-spot independence assumption
- Cleaned up Markov q=0 discussion
- Added debate and Constitutional AI to related work
- Flagged verification convergence domain limitation
- Noted $47K incident as anecdotal
- Added verification domain generalization caveat

### MINOR (3 deferred)
- Abstract length (acceptable for a theory paper)
- Section 5 title (kept for consistency with formal definitions)
- Distinguishing established vs. novel results (partially addressed via framing, could be further improved)
