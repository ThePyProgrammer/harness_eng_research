# Provenance Record: Coordination Architecture Paper

**Date:** 2026-04-03
**Title:** Coordination Architecture for Multi-Agent Software Engineering: Error Amplification, Task Decomposition, and Quality-Adjusted Speedup

## Pipeline Summary

| Stage | Description | Agents | Duration |
|-------|-------------|--------|----------|
| 1 | Research plan | 0 (manual) | - |
| 2 | Deep research (parallel) | 5 | ~5 min each |
| 3 | Formalization research (parallel) | 3 | ~3-6 min each |
| 4 | Paper writing | 1 | ~12 min |
| 5 | Compilation (tectonic) | 0 | <1 min |
| 6 | Peer review | 1 | ~3.5 min |
| 7 | Fix implementation | 0 (manual edits) | - |
| 8 | Recompilation | 0 | <1 min |

## Research Rounds

### Round 2 (Deep Research): 5 Parallel Agents
- **R1:** Error amplification and topology theory (Kim et al., reliability engineering, USL, swarm intelligence)
- **R2:** Graph partitioning and task decomposition (Cheeger, KL, FM, METIS, software clustering)
- **R3:** Merge conflict theory and detection (5-level taxonomy, ConGra, PGMs, AST tools, CRDTs)
- **R4:** Distributed coordination theory (concurrency control, isolation levels, mechanism design, Conway's Law, Lamport, consensus)
- **R5:** Empirical evidence and practitioner reports (DORA 2025, Cursor, worktree tools, SWE-Bench, Osmani patterns)

### Round 3 (Formalization): 3 Parallel Agents
- **F1:** Information-theoretic and probabilistic foundations (error amplification model, Extended Amdahl, PGM, topology optimization)
- **F2:** Type-theoretic and contract-based formalization (assume-guarantee, isolation levels as type system, coordination cost algebra, correctness conditions, Conway formalization)
- **F3:** Metrics, empirical calibration, and verification (calibration tables, coupling dynamics, throughput model, QAS, verification roadmap)

## Sources Consulted

### Primary Academic Sources (with full bibliographic data)
1. Kim et al. (2025), arXiv:2512.08296
2. Amdahl (1967), AFIPS
3. Gunther (2008), arXiv:0808.1431
4. Kernighan & Lin (1970), Bell System Technical Journal
5. Karypis & Kumar (1998), SIAM J. Sci. Comput.
6. Fiduccia & Mattheyses (1982), DAC
7. Fiedler (1973), Czech. Math. J.
8. Arora, Rao, Vazirani (2009), J. ACM
9. Conway (1968), Datamation
10. Bernstein, Hadzilacos, Goodman (1987), Addison-Wesley
11. Berenson et al. (1995), SIGMOD
12. Fekete et al. (2005), ACM TODS
13. Lamport (1978), CACM
14. Herlihy & Wing (1990), ACM TOPLAS
15. Herlihy (1991), ACM TOPLAS
16. Fischer, Lynch, Paterson (1985), J. ACM
17. Meyer (1992), Computer
18. Henzinger, Qadeer, Rajamani (2002), CAV
19. Jones (1983), IFIP Congress
20. Benveniste et al. (2018), Found. Trends EDA
21. Brun et al. (2011), ESEC/FSE
22. Kasi & Sarma (2013), ICSE
23. Ghiotto et al. (2018), IEEE TSE
24. Accioly et al. (2018), Empirical SE
25. Sousa, Dillig, Lahiri (2018), OOPSLA
26. Zhu et al. (2024), arXiv:2409.14121
27. Falleri et al. (2014), ASE
28. Shen et al. (2019), OOPSLA
29. Apel et al. (2012), ASE/FSE
30. Cemri et al. (2025), arXiv:2503.13657
31. MacCormack, Baldwin, Rusnak (2012), Research Policy
32. Lee, Oveis Gharan, Trevisan (2012), J. ACM
33. Andreev & Racke (2006), Theory Comput. Syst.
34. Mitchell & Mancoridis (2006), IEEE TSE
35. Murphy, Notkin, Sullivan (2001), IEEE TSE
36. Martin (1994), ROAD
37. Lehman (1980), Proc. IEEE
38. Brooks (1975), Addison-Wesley
39. Ongaro & Ousterhout (2014), USENIX ATC
40. Lesenich et al. (2017), ASE
41. Gustafson (1988), CACM

### Practitioner and Industry Sources
42. DORA 2025 (Google Cloud)
43. Cursor (2026), blog post
44. Osmani (2025/2026), blog posts and O'Reilly talk
45. McKinney (2026), O'Reilly Radar
46. AgentSpec (2025), arXiv:2503.18666

## Verification Status

- **Compilation:** Successful (tectonic, no errors, only overfull/underfull hbox warnings)
- **Peer review:** 0 FATAL, 9 MAJOR, 12 MINOR issues identified
- **Fixes applied:** All 9 MAJOR issues addressed (M1-M9); key MINOR issues addressed (m2, m5, m6, m9)
- **Post-fix compilation:** Successful
- **Final page count:** 24 pages
- **All arithmetic verified:** Correct per reviewer

## Intermediate Research Files

| File | Description |
|------|-------------|
| `outputs/.plans/coordination-architecture.md` | Research plan |
| `outputs/coordination-architecture-research-r1.md` | Error amplification research |
| `outputs/coordination-architecture-research-r2.md` | Graph partitioning research |
| `outputs/coordination-architecture-research-r3.md` | Merge conflict research |
| `outputs/coordination-architecture-research-r4.md` | Distributed coordination research |
| `outputs/coordination-architecture-research-r5.md` | Empirical evidence research |
| `outputs/coordination-architecture-formal-r1.md` | Information-theoretic formalization |
| `outputs/coordination-architecture-formal-r2.md` | Contract-based formalization |
| `outputs/coordination-architecture-formal-r3.md` | Metrics and calibration |
| `outputs/coordination-architecture-review.md` | Peer review |
