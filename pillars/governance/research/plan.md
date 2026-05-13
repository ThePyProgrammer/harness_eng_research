# Research Plan: Governance Architecture for AI Coding Harnesses

## Topic
How do AI coding harnesses maintain architectural coherence over time when AI agents make changes faster than humans can evaluate? Covers architectural drift detection, decision debt and evidence expiry, theory preservation (Naur), multi-granularity governance, and the ratchet enforcement pattern.

## Research Questions

1. **What formal models exist for detecting architectural drift as a time-series problem?** (CUSUM, Bayesian online change-point detection, control charts applied to software metrics)
2. **How do decisions decay? What survival analysis models capture evidence expiry and decision debt?** (Empirical half-lives, hazard functions for technical decisions, domain-specific decay rates)
3. **What does Naur's "Programming as Theory Building" actually claim, and what are the formal limits on theory externalization?** (Information loss bounds, tacit knowledge literature from Polanyi onward, compression-fidelity tradeoffs)
4. **What enforcement architectures exist for continuous governance?** (Archgate, spec-driven development, executable ADRs, fitness functions, the ratchet pattern)
5. **How do reflexion models detect architectural conformance/divergence?** (Murphy's reflexion models, source model vs. high-level model comparison, convergence/divergence/absence classification)
6. **What is the empirical evidence on governance ROI?** (At what scale does governance pay off? What do studies show about ADR adoption, drift rates, and code quality?)
7. **How does Conway's Law interact with architectural governance?** (Organizational structure as constraint on architecture, inverse Conway maneuver, sociotechnical systems theory)
8. **What are the formal properties of multi-granularity governance?** (Synchronous vs. asynchronous vs. deliberative checking; latency-coverage tradeoffs; compositional verification)

## Major Thinkers and Works

- **Peter Naur** (1985): "Programming as Theory Building"
- **Michael Polanyi**: Tacit knowledge, "The Tacit Dimension" (1966)
- **Gail Murphy et al.**: Reflexion models for software architecture conformance (1995, 2001)
- **Len Bass, Paul Clements, Rick Kazman**: ATAM, software architecture evaluation
- **Simon Wardley**: Wardley Mapping, strategic positioning
- **Melvin Conway**: Conway's Law (1968)
- **E.S. Page**: CUSUM change-point detection (1954)
- **Ryan Adams, David MacKay**: Bayesian online change-point detection (2007)
- **Matthew Skelton, Manuel Pais**: Team Topologies, inverse Conway maneuver
- **Andrew Harmel-Law**: Architecture Advice Process (ThoughtWorks Radar 2025)
- **Neal Ford, Mark Richards**: Fitness functions for evolutionary architecture

## Researcher Agent Strategy

### Agent R1: Historical & Philosophical Foundations
- Naur's "Programming as Theory Building" (1985) and responses
- Polanyi's tacit knowledge and its application to software
- Philosophy of externalization limits (Dreyfus, Collins)
- History of ADRs (Nygard 2011) and architectural governance

### Agent R2: Formal Methods for Drift & Decay
- Change-point detection (CUSUM, BOCPD) applied to software metrics
- Survival analysis for decision validity
- Reflexion models (Murphy et al.)
- Control theory for software governance
- Statistical process control in software engineering

### Agent R3: Contemporary Tools & Practices
- Archgate, executable ADRs, spec-driven development
- Fitness functions (Building Evolutionary Architectures)
- Blueprint, GSD, RAPID governance mechanisms
- AI agent guardrails literature (2025-2026)
- Agent Decision Records (AgDR)

### Agent R4: Organizational & Contrarian
- Conway's Law empirical evidence and inverse Conway maneuver
- Team Topologies and sociotechnical architecture
- Contrarian: governance as overhead, ADRs as documentation theater
- Scale-dependent ROI of governance
- Evidence on AI-generated code quality and architectural impact

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources
- Contradictions between sources explicitly identified
- At least 3 formal models described with sufficient rigor to reproduce
- Naur's actual claims distinguished from popular misinterpretations
- At least 2 empirical studies on governance effectiveness cited
- Conway's Law engagement goes beyond surface-level citation
