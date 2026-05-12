# Provenance: Information Architecture for AI Coding Agent Harnesses

## Date
2026-04-02

## Source Material
Based on `/pillars/1-information-architecture.md` from the harness engineering project.

## Research Rounds

### Round 1: Deep Research (5 parallel agents)
| Agent | Dimension | Output |
|-------|-----------|--------|
| R1 | Information theory & formal foundations | `outputs/info-arch-research-r1.md` |
| R2 | Context degradation & long-context LLMs | `outputs/info-arch-research-r2.md` |
| R3 | Harness engineering & context management | `outputs/info-arch-research-r3.md` |
| R4 | Reuse discovery & semantic code search | `outputs/info-arch-research-r4.md` |
| R5 | Contrarian & alternative perspectives | `outputs/info-arch-research-r5.md` |

### Round 2: Formalization Research (3 parallel agents)
| Agent | Dimension | Output |
|-------|-----------|--------|
| F1 | Information-theoretic formalization | `outputs/info-arch-formal-r1.md` |
| F2 | Degradation function formalization | `outputs/info-arch-formal-r2.md` |
| F3 | Tiered architecture formalization | `outputs/info-arch-formal-r3.md` |

## Sources Consulted vs. Accepted

### Primary academic sources (accepted)
- Shannon (1948, 1951): Information theory foundations
- Hindle et al. (ICSE 2012): Code entropy measurements
- Hellendoorn & Devanbu (FSE 2017): Refined code entropy
- Liu et al. (TACL 2024): Lost in the middle
- Nemhauser, Wolsey, Fisher (1978): Submodular optimization
- Buchbinder et al. (2015): Non-monotone submodular maximization
- Krause & Guestrin (2008): Mutual information submodularity in GPs
- Lin & Bilmes (ACL 2011): Submodular document summarization
- Sweller (1988): Cognitive load theory
- Tishby et al. (2000): Information bottleneck
- Kim et al. (NeurIPS 2024): Transformer working memory limits
- Xiao et al. (ICLR 2024): Attention sinks
- Kuratov et al. (NeurIPS 2024): BABILong benchmark
- Hsieh et al. (COLM 2024): RULER benchmark
- Feng et al. (EMNLP 2020): CodeBERT
- Guo et al. (ACL 2022): UniXcoder
- Wang et al. (EMNLP 2023): CodeT5+

### Industry/practitioner sources (accepted with caveats)
- Chroma Research (2025): Context rot, 18 model study
- Anthropic (2025): Context engineering framework
- Gloaguen et al. (arXiv 2026): AGENTS.md evaluation
- JetBrains (NeurIPS DL4Code 2025): Observation masking
- Du et al. (EMNLP 2025): Context length hurts
- Factory.ai: Structural critique of vector RAG
- Spotify (2025): Honk context engineering
- HumanLayer (2025): ACE-FCA, skill issue
- OpenAI (2025): Codex harness engineering
- ByteRover (2025): Vector RAG failure analysis
- Bialek et al. (arXiv 2025): LLM English entropy

### Sources consulted but not directly cited
- Poulin (arXiv cs/0508023): Software reuse entropy
- Jain et al. (2020): Contrastive code representation
- Context Discipline Study (arXiv 2601.11564)
- Multiple additional clone detection and code search papers from R4

## Verification Status
- **Theorems 4.1 (Decomposition), 5.1 (Budget)**: Formally proved
- **Theorem 3.1 (Submodularity)**: Conditional on supermodularity assumption; sufficient conditions given
- **Theorem 3.3 (Non-monotonicity)**: Constructive proof provided in revision
- **Proposition 3.4 (Greedy approx)**: Holds for linearized surrogate; gap to multiplicative objective acknowledged
- **Proposition 6.4 (Fresh context)**: Proof sketch provided; formal proof deferred
- **Theorem 6.3 (Compliance decay)**: Proved under independence assumption (flagged)
- **Degradation function fit**: 3 data points, 1 model; limitations acknowledged
- **Positional recall fit**: 6 parameters, 1 study; limitations acknowledged

## Peer Review
Simulated peer review conducted (Stage 6). 1 FATAL, 6 MAJOR, 16 MINOR issues identified.
All FATAL and MAJOR issues addressed in revision (Stage 7).

## Intermediate Research Files
- `outputs/.plans/info-arch-coding-agents.md` (research plan)
- `outputs/info-arch-research-r1.md` through `r5.md` (5 research files)
- `outputs/info-arch-formal-r1.md` through `r3.md` (3 formalization files)
- `outputs/info-arch-review.md` (peer review)
