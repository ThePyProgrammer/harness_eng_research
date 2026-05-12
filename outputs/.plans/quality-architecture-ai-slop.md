# Research Plan: Quality Architecture for AI Code Slop

## Topic

Layered defense optimization against AI-generated code defects ("slop"): taxonomy, detection theory, cost-optimal enforcement, and the formal boundary between structural and probabilistic verification.

## Research Questions

1. **What is the empirical defect rate and type distribution of AI-generated code vs. human-written code?** (CodeRabbit, GitClear, Qodo, GitHub Copilot studies, recent 2025-2026 data)

2. **What formal frameworks exist for multi-layer detection optimization?** (Signal detection theory, Bayesian filtering cascades, ensemble classifier theory, information-theoretic bounds on defect detection)

3. **How do structural vs. probabilistic enforcement mechanisms compare empirically?** (AgentSpec ICSE 2026, METR evaluations, Apollo Research scheming results, NIST CAISI findings)

4. **What is the measured reliability of LLM-as-Judge for code quality?** (Spotify Honk veto rates, inter-model agreement studies, correlated error research, judge-producer bias)

5. **What taxonomies of code defects exist, and how do AI-specific defect types relate to classical software defect classification?** (IEEE/ISO defect taxonomies, Orthogonal Defect Classification, Beizer's taxonomy, how "slop" maps to established categories)

6. **What is the economic model for code quality investment?** (Capers Jones cost-of-quality data, COCOMO defect removal efficiency, optimal stopping theory for review layers)

7. **What are the formal limits of automated defect detection?** (Rice's theorem applicability, decidability boundaries for program properties, the structural/semantic detection frontier)

8. **What defense-in-depth architectures exist in adjacent domains?** (Network security layered defense, medical diagnostic cascades, manufacturing quality control, how these inform software quality stacks)

## Researcher Agent Strategy

### Agent R1: Empirical Landscape (Contemporary)
- AI code quality measurements (2024-2026)
- CodeRabbit, GitClear, Qodo, GitHub Copilot studies
- Defect rate data, type distributions, severity profiles
- Industry adoption patterns and quality impact

### Agent R2: Formal Foundations (Theoretical)
- Signal detection theory applied to software defects
- Bayesian cascade classifiers and optimal layer selection
- Information-theoretic bounds on defect detection
- Rice's theorem and decidability limits for program properties
- Decision theory for quality investment

### Agent R3: Enforcement Mechanisms (Applied)
- AgentSpec and runtime enforcement research
- LLM-as-Judge reliability studies
- Spotify Honk, METR, Apollo Research, NIST CAISI findings
- Structural vs. prompt-based enforcement comparison
- AST analysis, type systems, formal verification tools

### Agent R4: Defect Taxonomy (Historical/Classificatory)
- Classical software defect taxonomies (IEEE 1044, ODC, Beizer, Chillarege)
- AI-specific defect categories and how they map to established classifications
- Factor analysis approaches to latent defect categories
- Cross-language and cross-domain defect patterns

### Agent R5: Adjacent Domain Defense (Interdisciplinary)
- Defense-in-depth in network security (NIST frameworks)
- Medical diagnostic cascades and screening theory
- Manufacturing quality control (Six Sigma, Taguchi methods)
- Economic models of quality (Capers Jones, COCOMO, cost of defect removal)

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources
- Contradictions between sources explicitly identified
- At least 3 formal results (theorems, bounds, or empirical laws) documented with precise citations
- Economic/cost data from at least 2 independent measurement studies
- Clear identification of what is established vs. what is novel synthesis
