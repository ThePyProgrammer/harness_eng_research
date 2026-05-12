# Provenance: Security Architecture for AI Coding Agent Harnesses

**Date:** 2026-04-04
**Slug:** security_architecture
**Pillar Source:** pillars/10-security-architecture.md

## Research Rounds

### Stage 2: Deep Research (4 agents, parallel)
- **R1** (Foundational Security Theory): Lampson, HRU, Dennis & Van Horn, Denning, Saltzer & Schroeder, confused deputy, TCB
- **R2** (Agent Security Empirics): Apollo Research, NIST CAISI, METR, CodeRabbit, AgentSpec, prompt injection taxonomy, supply chain attacks
- **R3** (Production Harness Security): Codex, Claude Code, Cursor, Devin, Spotify Honk, GSD, RAPID, Aider, Amazon Q Developer
- **R4** (Contrarian & Alternatives): Rate limited before writing output file

### Stage 3: Formalization Research (2 agents, parallel)
- **F1** (Access Control Formalization): Rate limited before writing output file
- **F2** (TCB & Threat Model Formalization): TCB theory, confused deputy, BEB impossibility, STRIDE/OWASP mapping, defense-in-depth, BLP/Biba tension

## Sources Consulted vs. Accepted

| Category | Consulted | Accepted (cited) | Notes |
|----------|-----------|-------------------|-------|
| Foundational security theory | 15+ | 12 | Saltzer, Lampson, Denning, HRU, BLP, Biba, Goguen, Dennis, Hardy, Anderson, Rushby, Myers |
| Agent empirics | 8 | 6 | Apollo, NIST, METR, CodeRabbit, AgentSpec, Anthropic evals |
| Production harnesses | 9 | 6 | Codex, Claude Code, Cursor, Devin, Honk, RAPID |
| Prompt injection | 5 | 4 | Greshake, Wolf (BEB), NCSC, CVE-2025-53773 |
| Capability systems | 4 | 3 | Dennis, Miller, Watson (Capsicum) |
| Cross-pillar | 3 | 3 | Reliability, Governance, Human Interaction |

## Verification Status

| Claim | Status |
|-------|--------|
| $(1-\epsilon)^T$ decay model | Calibrated against AgentSpec, METR |
| HRU undecidability | Established theorem (1976) |
| BEB impossibility | Established theorem (Wolf et al. 2024) |
| Credential noninterference | Proven (constructive) |
| TCB correctness sufficiency | Proven (trivial) |
| Correlated defense bound | Proven (beta factor model) |
| Beta = 0.5 estimate | Order-of-magnitude, not measured |
| 2.74x XSS ratio | Single study (CodeRabbit 2025) |
| Zero broken references in PDF | Verified |

## Intermediate Research Files

| File | Lines | Agent |
|------|-------|-------|
| outputs/security-architecture-research-r1.md | 683 | R1: Foundational theory |
| outputs/security-architecture-research-r2.md | 574 | R2: Agent empirics |
| outputs/security-architecture-research-r3.md | 893 | R3: Production harnesses |
| outputs/security-architecture-formal-r2.md | 779 | F2: TCB & threats |
| outputs/.plans/security-architecture.md | 72 | Research plan |
| outputs/security-architecture-review.md | 88 | Peer review |

## Pipeline

- Stage 1 (Research Plan): Completed
- Stage 2 (Deep Research): 4/4 agents completed (R4 rate-limited before output)
- Stage 3 (Formalization): 2/2 agents completed (F1 rate-limited before output)
- Stage 4 (Write Paper): Completed
- Stage 5 (Compile): Compiled with tectonic; zero broken references
- Stage 6 (Peer Review): 0 FATAL, 0 MAJOR, 10 MINOR issues
- Stage 7 (Implement Fixes): Addressed key MINOR issues (attack surface, tool output caveat, beta estimate, METR variance, AutoHarness)
- Stage 8 (Provenance): This document
