# Provenance: Governance Architecture for AI Coding Harnesses

**Date:** 2026-04-03
**Source Pillar:** `pillars/6-governance-architecture.md`

## Pipeline

| Stage | Description | Status |
|-------|-------------|--------|
| 1. Research Plan | 8 questions, 4 agent strategy | Complete |
| 2. Deep Research | 4 parallel agents (R1-R4) | Complete |
| 3. Formalization | 3 parallel agents (F1-F3) | Complete |
| 4. Paper Writing | `governance-architecture.tex` + `.bib` | Complete |
| 5. Compilation | tectonic, 17 pages | Complete |
| 6. Peer Review | 3 MAJOR, 11 MINOR issues | Complete |
| 7. Fix Implementation | All 3 MAJOR issues addressed | Complete |
| 8. Provenance | This file | Complete |

## Researcher Rounds

### Round 1: Deep Research (4 agents)
- **R1** (Historical/Philosophical): Naur, Polanyi, Dreyfus, Collins, Tsoukas, ADR history, externalization limits. ~3500 words.
- **R2** (Formal Methods): CUSUM, BOCPD, survival analysis, reflexion models, control theory, SPC. ~3500 words.
- **R3** (Contemporary Tools): Archgate, spec-driven development, fitness functions, AI guardrails, AgDR, AI code quality. ~2800 words.
- **R4** (Organizational/Contrarian): Conway's Law empirical evidence, Team Topologies, governance as overhead, ADRs as theater, ratchet rigidity, Naur unsolvability, scale-dependent governance. ~3500 words.

### Round 2: Formalization Research (3 agents)
- **F1** (Information Theory): Rate-distortion for theory loss, drift as KL divergence, governance channel capacity, extraction fidelity bounds. ~2200 words.
- **F2** (Control Theory): Cascade control, ratchet as closure operator, decision survival with competing risks, stability conditions and bifurcation. ~2200 words.
- **F3** (Metrics/Verification): GitClear calibration data, DORA metrics, governance metrics taxonomy, fitness function patterns, Goodhart's Law, uncomputability. ~2800 words.

## Sources Consulted vs. Accepted

- **Total unique sources consulted:** ~80+
- **Sources cited in final paper:** 30
- **Sources consulted but not cited:** ~50 (used for background/verification but not directly referenced)

## Key Sources by Category

### Primary (directly cited, foundational)
- Naur 1985, Polanyi 1966, Collins 2010, Tsoukas 2003
- Shannon 1948/1959, Cover & Thomas 2006, Chaitin 1974
- Page 1954, Adams & MacKay 2007, Moustakides 1986
- Murphy et al. 1995/2001, Conway 1968, Nagappan et al. 2008
- Fine & Gray 1999, Cox 1972, Tarski 1955
- Ford et al. 2017, Hellerstein et al. 2004

### Empirical (data sources)
- GitClear 2025 (211M lines, code quality)
- DORA 2025 (delivery stability)
- Le et al. 2018 (architectural decay)
- Herraiz et al. 2021 (code element lifetimes)

### Contemporary (tools and practices)
- Archgate (executable ADRs)
- me2resh/AgDR (agent decision records)
- Nygard 2011, Harmel-Law 2023 (ADR practices)

## Verification Status

| Claim | Status |
|-------|--------|
| Theory extraction bound (Thm 3.2) | Established (direct application of rate-distortion theorem) |
| Tacit divergence (Conj 3.3) | Conjectured (philosophically motivated, concrete example provided) |
| Incompressibility (Thm 3.4) | Established (algorithmic information theory) |
| Double bottleneck (Thm 3.6) | Established (data processing inequality) |
| Governance capacity bound (Thm 4.3) | Structural analogy (epistemic status explicitly noted) |
| Cascade stability (Thm 5.1) | Novel synthesis (cascade control theory applied to governance) |
| Critical governance capacity (Thm 5.2) | Novel synthesis (dynamical systems) |
| Governance bifurcation (Thm 5.3) | Novel synthesis (transcritical bifurcation analysis) |
| Ratchet convergence (Thm 6.2) | Established (Knaster-Tarski) |
| Ossification risk (Thm 6.4) | Novel synthesis (straightforward) |
| Controlled descent (Thm 6.5) | Novel synthesis |
| Survival calibration (Sec 7.3) | Illustrative estimates (ranges, not point values) |

## Intermediate Research Files

| File | Description |
|------|-------------|
| `outputs/.plans/governance-architecture.md` | Research plan |
| `outputs/governance-architecture-research-r1.md` | Historical/philosophical research |
| `outputs/governance-architecture-research-r2.md` | Formal methods research |
| `outputs/governance-architecture-research-r3.md` | Contemporary tools research |
| `outputs/governance-architecture-research-r4.md` | Organizational/contrarian research |
| `outputs/governance-architecture-formal-r1.md` | Information theory formalization |
| `outputs/governance-architecture-formal-r2.md` | Control theory formalization |
| `outputs/governance-architecture-formal-r3.md` | Metrics/verification formalization |
| `outputs/governance-architecture-review.md` | Peer review |

## Final Deliverables

| File | Description |
|------|-------------|
| `papers/governance-architecture.pdf` | Final compiled paper (17 pages) |
| `papers/governance-architecture.provenance.md` | This file |
| `governance-architecture.tex` | LaTeX source |
| `governance-architecture.bib` | Bibliography (30 entries) |
