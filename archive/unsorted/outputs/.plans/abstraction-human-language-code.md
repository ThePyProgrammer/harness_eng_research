# Research Plan: Abstraction Between Human Language and Code — Dijkstra to AI Coding Agents

## Context

Gabriel Gonzalez's March 2026 article "A sufficiently detailed spec is code" (haskellforall.com) invokes Dijkstra's EWD 667 ("On the foolishness of natural language programming") to argue that the dream of spec-driven AI coding (Symphony, Claude Code, Codex) inevitably collapses: as you make a spec precise enough to be unambiguous, it converges on code itself. This research investigates the deeper question: **how much abstraction should exist between human language and machine language, and are the current AI coding paradigms (natural language → code generation) fundamentally misguided?**

## Questions

### Q1: Historical Foundations
What is the intellectual lineage of the argument that formal notation is categorically superior to natural language for specifying computation? (Dijkstra EWD 667, Hoare, Knuth, Brooks' "No Silver Bullet", Parnas)

### Q2: The Convergence Thesis
Is there theoretical or empirical evidence that specifications, as they become more precise, necessarily converge on code? What are the formal results (Kolmogorov complexity, algorithmic information theory, Rice's theorem)?

### Q3: Current AI Coding Paradigm
How do Claude Code, OpenAI Codex/Symphony, and open-source tools (OpenCode, Aider, Continue) actually bridge the abstraction gap? What implicit model of human-machine interaction do they assume?

### Q4: Contrarian Viewpoints
Who argues AGAINST Dijkstra/Gonzalez — that natural language CAN serve as a sufficient programming medium? What are the strongest steel-manned arguments for natural language programming in the LLM era?

### Q5: Alternative Paradigms
What intermediate representations exist between prose and code? (Formal methods, TLA+, Alloy, dependent types, proof assistants, executable specifications, Quint, Gherkin/BDD) Do these represent a viable "third way"?

### Q6: Empirical Evidence
What do we actually know from studies, benchmarks, and practitioner reports about the success/failure rates of natural language → code generation at scale?

## Strategy

**Scale:** Broad multi-faceted survey — 4 parallel researcher subagents, each covering disjoint dimensions.

| Researcher | Dimension | Questions |
|---|---|---|
| R1: Historical & Philosophical | Academic foundations, thinkers, formal arguments | Q1, Q2 |
| R2: Current Tools & Paradigms | AI coding tools, their architectures, interaction models | Q3, Q6 |
| R3: Contrarian & Pro-NL Arguments | Steel-manned opposition, LLM-era counterarguments | Q4 |
| R4: Alternative Paradigms & Formal Methods | Intermediate representations, the "third way" | Q5 |

**Expected rounds:** 1-2. Round 2 only if significant gaps remain.

## Acceptance Criteria
- [ ] All 6 key questions answered with ≥2 independent sources
- [ ] Dijkstra's EWD 667 argument accurately represented with direct quotes
- [ ] ≥3 contrarian viewpoints identified and steel-manned
- [ ] Current AI tools (Claude Code, Codex, OpenCode) analyzed with practitioner evidence
- [ ] Formal/theoretical grounding (information theory, complexity theory) included
- [ ] Contradictions between sources identified and addressed
- [ ] No single-source claims on critical findings

## Task Ledger
| ID | Owner | Task | Status | Output |
|---|---|---|---|---|
| T1 | R1 | Historical lineage: Dijkstra, Hoare, Brooks, Parnas, Knuth on formal vs natural | todo | research-r1-historical.md |
| T2 | R1 | Convergence thesis: formal results connecting spec precision to code equivalence | todo | research-r1-historical.md |
| T3 | R2 | Architecture analysis of Claude Code, Codex, Symphony, OpenCode, Aider | todo | research-r2-tools.md |
| T4 | R2 | Empirical evidence: benchmarks, studies, practitioner reports on NL→code | todo | research-r2-tools.md |
| T5 | R3 | Steel-manned contrarian arguments for natural language programming in LLM era | todo | research-r3-contrarian.md |
| T6 | R3 | Responses to Dijkstra from linguistics, HCI, cognitive science | todo | research-r3-contrarian.md |
| T7 | R4 | Survey of intermediate representations (TLA+, Alloy, Quint, dependent types) | todo | research-r4-alternatives.md |
| T8 | R4 | "Third way" analysis: executable specs, BDD, formal methods as AI bridges | todo | research-r4-alternatives.md |
| T9 | Lead | Synthesize findings into final report | todo | papers/ |
| T10 | Lead | Generate PDF from final report | todo | papers/ |

## Verification Log
| Item | Method | Status | Evidence |
|---|---|---|---|
| Dijkstra EWD 667 quotes | Direct source fetch | done | cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html |
| Gonzalez article thesis | HN/Lobsters discussion cross-reference | done | HN #47434047, lobste.rs |
| Brooks "No Silver Bullet" connection | Source cross-read | pending | — |
| AI tool empirical claims | Multiple practitioner reports | pending | — |
| Convergence thesis formal grounding | Academic sources | pending | — |
| Contrarian arguments sourced independently | ≥3 distinct sources | pending | — |

## Decision Log
- 2026-04-02: Scoped research to focus on abstraction gap + contrarian viewpoints, not general AI coding quality
- 2026-04-02: Including information theory angle (Kolmogorov complexity) per HN discussion
- 2026-04-02: Will produce PDF as final deliverable per user request
