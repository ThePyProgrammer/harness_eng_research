# Citation Verification: "Towards a Science for AI Coding Agent Harnesses"

Verification performed: 2026-04-02

---

## 1. Gonzalez 2026 ("A sufficiently detailed spec is code")

**Reference key:** `gonzalez2026spec`

**EXISTS:** Yes

**Publication:** Blog post by Gabriella Gonzalez on "Haskell for all," published March 2026. Not a peer-reviewed paper; it is a blog post that was widely discussed on Hacker News and Lobsters.

**CLAIMS MATCH:** Partially

- The core thesis attributed to Gonzalez ("a sufficiently detailed spec converges on code") matches the blog post's title and argument. Gonzalez argues that detailed specifications devolve into pseudocode/slop and are functionally equivalent to code.
- The YAML case study exists in the blog post (Gonzalez uses YAML as a central example of a spec that is extremely detailed yet still fails to produce conformant implementations).
- **KEY DISCREPANCY:** The specific numbers cited in the paper (3,388 lines of spec vs 16,063 lines of code, yielding a 4.7:1 ratio) could not be independently verified from the blog post or any secondary source. The blog's content was inaccessible via direct fetch (403), and no secondary discussion (HN, daily.dev, DEV Community) reproduces these specific numbers. These figures may come from the blog post itself (which I could not fully retrieve) or may be fabricated/misattributed.

**SOURCE URL:** https://haskellforall.com/2026/03/a-sufficiently-detailed-spec-is-code

**VERDICT:** The work exists and the qualitative claim matches, but the specific quantitative data (3,388 / 16,063 / 4.7:1) needs independent verification against the full blog post text.

---

## 2. Kim 2025 ("Scaling LLM Agents")

**Reference key:** `kim2025scaling`

**EXISTS:** Yes

**Publication:** Yubin Kim et al., "Towards a Science of Scaling Agent Systems," arXiv:2512.08296, December 2025. 18 authors. Note: the paper title in the citing work ("Scaling LLM Agents") does not exactly match the real title ("Towards a Science of Scaling Agent Systems").

**CLAIMS MATCH:** Yes (with minor caveats)

- Independent agents amplify errors 17.2x: **Confirmed.**
- Centralised coordination reduces to 4.4x: **Confirmed.**
- Capability saturation at ~45% single-agent performance: **Confirmed.**
- Beta = -0.408, p < 0.001: **Confirmed** from the full HTML version of the paper.
- "Defined four coordination topologies": **Partially correct.** The paper defines five canonical architectures: Single-Agent, Independent MAS, Centralized MAS, Decentralized MAS, and Hybrid MAS. If you exclude Single-Agent and count only multi-agent topologies, you get four. This is a reasonable interpretation but slightly imprecise.

**SOURCE URL:** https://arxiv.org/abs/2512.08296

**VERDICT:** Highly accurate citation. Minor quibble on "four topologies" (there are four multi-agent topologies plus Single-Agent, totaling five architectures).

---

## 3. METR 2026 SWE-bench study

**Reference key:** `metr2026swebench`

**EXISTS:** Yes

**Publication:** METR research note, "Many SWE-bench-Passing PRs Would Not Be Merged into Main," published 2026-03-10. Not a peer-reviewed paper; it is a research note from METR (an AI safety organization).

**CLAIMS MATCH:** Yes

- The claim that "~50% of test-passing PRs would not be merged" matches METR's findings. METR found approximately a 24-percentage-point gap between automated grading pass rates (~74%) and maintainer merge rates (~50%).
- METR had 4 maintainers from 3 SWE-bench Verified repositories (scikit-learn, Sphinx, pytest) review 296 AI-generated pull requests.
- METR notes that even 68% of actual human-written patches would be re-accepted, indicating inherent subjectivity in code review.

**SOURCE URL:** https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/

**VERDICT:** Accurate citation.

---

## 4. GitClear 2025

**Reference key:** `gitclear2025quality`

**EXISTS:** Yes

**Publication:** GitClear, "AI Copilot Code Quality: 2025 Data Suggests 4x Growth in Code Clones," industry research report analyzing 211 million changed lines of code (2020-2024). Not a peer-reviewed paper; it is an industry report from a code analytics company.

**CLAIMS MATCH:** Partially

- "17% maintainability drops": Found in at least one secondary summary (Specifys.ai report summary states "maintainability index dropped by 17%"), but this specific number does not appear in the GitClear report summary on jonas.rs. The primary GitClear report page was inaccessible (403). This figure may come from a derived metric rather than a direct GitClear claim.
- "Refactoring declining from 25% to <10%": **Confirmed with slight variance.** The actual GitClear numbers are: "moved" (refactored) lines decreased from 24.1% in 2020 to 9.5% in 2024. The paper rounds 24.1% to 25% and <10% is consistent with 9.5%.
- "Bug rates rising 12% at 6 months": Found in at least one secondary source stating "12% higher over 6 months," but could not verify this directly from the primary GitClear report. The jonas.rs summary instead references Google's finding of "7.2% decrease in delivery stability for every 25% increase in AI adoption," which is a different metric.

**KEY DISCREPANCY:** The 17% maintainability drop and 12% bug rate increase at 6 months appear in secondary summaries but could not be verified against the primary GitClear report (which was access-restricted). These may be from a different section of the full report, or they may be interpolated/misattributed from other sources.

**SOURCE URL:** https://www.gitclear.com/ai_assistant_code_quality_2025_research

**VERDICT:** The source exists and the refactoring decline claim is accurate. The 17% maintainability and 12% bug rate claims need verification against the full report.

---

## 5. Vericoding 2025

**Reference key:** `vericoding2025`

**EXISTS:** Yes

**Publication:** Bursuc, Ehrenborg, Lin et al., "A benchmark for vericoding: formally verified program synthesis," arXiv:2509.22908, September 2025. Affiliated with BAIF and MIT. Accepted at POPL 2026 / Dafny 2026 workshop.

**CLAIMS MATCH:** Yes

- 82% success rate on Dafny specifications: **Confirmed.** The benchmark tested LLM performance across three formal verification languages: Lean (27%), Verus/Rust (44%), and Dafny (82%).
- Human-spec/AI-implementation/formal-verification pipeline: **Confirmed.** The benchmark contains 12,504 human-written formal specifications; LLMs generate code implementations that must pass formal verification.
- The paper also found that adding natural-language descriptions does not significantly improve performance, and Dafny verification improved from 68% to 96% over the past year.

**SOURCE URL:** https://arxiv.org/abs/2509.22908

**VERDICT:** Accurate citation.

---

## 6. Kleppmann 2025 (formal methods + AI)

**Reference key:** `kleppmann2025formal`

**EXISTS:** Yes

**Publication:** Martin Kleppmann, "Prediction: AI will make formal verification go mainstream," blog post published 2025-12-08 on martin.kleppmann.com. Not a peer-reviewed paper.

**CLAIMS MATCH:** Yes

- Kleppmann explicitly predicts that "AI will bring formal verification, which for decades has been a bit of a fringe pursuit, into the software engineering mainstream."
- He argues that LLMs are becoming skilled at writing proof scripts, which will drastically reduce verification costs. He cites the seL4 microkernel (20 person-years to verify) as an example of historical cost barriers.
- He argues that rather than humans reviewing AI code, AI should prove its code correct, and that proof checkers provide a natural safeguard against hallucination.

**SOURCE URL:** https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html

**VERDICT:** Accurate citation, though note this is a blog post, not an academic publication.

---

## 7. Congdon 2025 (formal methods + AI)

**Reference key:** `congdon2025formal`

**EXISTS:** Yes

**Publication:** Ben Congdon, "The Coming Need for Formal Specification," blog post published 2025-12-12 on benjamincongdon.me. Not a peer-reviewed paper.

**CLAIMS MATCH:** Partially

- Congdon does not independently predict that AI will make formal verification mainstream. Rather, he **endorses Kleppmann's prediction** and extends it with his own arguments.
- Congdon outlines an aspirational workflow: high-level system specs spawn TLA+ models, critical components receive formal Rocq proofs, less critical components are LLM-audited against TLA+ specifications.
- He argues that formal verification expertise is extremely scarce and that CS curricula should include it.
- He separately (in "Software Engineering in 2026," 2025-12-29) argues that LLMs without strong guidelines generate greedy solutions leading to spaghettification.

**KEY DISCREPANCY:** Attributing the "AI will make formal verification mainstream" prediction to Congdon independently is slightly misleading; he is building on and agreeing with Kleppmann's earlier post (published 4 days prior).

**SOURCE URL:** https://benjamincongdon.me/blog/2025/12/12/The-Coming-Need-for-Formal-Specification/

**VERDICT:** The source exists and the general sentiment is correct, but the claim is derivative of Kleppmann rather than an independent prediction.

---

## 8. Hindle 2012 ("naturalness of software")

**Reference key:** `hindle2012naturalness`

**EXISTS:** Yes

**Publication:** Abram Hindle, Earl Barr, Zhendong Su, Mark Gabel, Premkumar Devanbu, "On the Naturalness of Software," ICSE 2012. Also republished in Communications of the ACM. Peer-reviewed conference paper at a top venue.

**CLAIMS MATCH:** Yes

- Java source code cross-entropy at 3-4 bits/token: **Confirmed.** The paper reports "strikingly low entropy (between 3 and 4 bits)" using smoothed n-gram models on Java code. This is a well-established and widely cited finding.
- The paper demonstrated that code is more repetitive than natural language, and built a simple code completion engine for Eclipse based on this insight.

**SOURCE URL:** https://earlbarr.com/publications/naturalness.pdf

**VERDICT:** Accurate citation of a landmark, well-established paper.

---

## 9. Li & Vitanyi 2004 (NID)

**Reference key:** `li2004similarity`

**EXISTS:** Yes

**Publication:** M. Li, X. Chen, X. Li, B. Ma, and P.M.B. Vitanyi, "The Similarity Metric," IEEE Transactions on Information Theory, vol. 50, no. 12, pp. 3250-3264, December 2004. Peer-reviewed journal paper.

**CLAIMS MATCH:** Yes

- Normalised Information Distance universality theorem: **Confirmed.** The paper proves that the normalized information distance (NID), based on Kolmogorov complexity, is universal in that it minorizes every computable distance in a certain class, thereby discovering all computable similarities.
- The paper also introduces practical approximation via compression (replacing Kolmogorov complexity with real-world compressor output lengths).

**SOURCE URL:** https://homepages.cwi.nl/~paulv/papers/similarity.pdf

**VERDICT:** Accurate citation of a foundational information theory paper.

---

## 10. Newcombe 2015 (AWS TLA+)

**Reference key:** `newcombe2015amazon`

**EXISTS:** Yes

**Publication:** Chris Newcombe, Tim Rath, Fan Zhang, Bogdan Munteanu, Marc Brooker, Michael Deardeuff, "How Amazon Web Services Uses Formal Methods," Communications of the ACM, vol. 58, no. 4, April 2015. Also available as "Use of Formal Methods at Amazon Web Services" (earlier version).

**CLAIMS MATCH:** Partially / Uncertain

- The paper does describe AWS's use of TLA+ for S3, DynamoDB, EBS, and an internal distributed lock manager. It contains a table with TLA+/PlusCal specification line counts for various AWS systems.
- **"TLA+ specs compress 20-100x relative to implementation":** This specific ratio could not be verified from accessible versions of the paper. The paper's table lists specification sizes (reportedly ranging from several hundred to a few thousand lines of TLA+/PlusCal), but the paper does not explicitly state a "20-100x compression" ratio. This ratio may be a reasonable inference (AWS services involve tens of thousands to millions of lines of implementation code, while TLA+ specs are hundreds to low thousands of lines), but it does not appear to be a direct claim in the paper.
- The 20-100x figure may come from informal talks, presentations, or community interpretation rather than from the paper text itself.

**KEY DISCREPANCY:** The "20-100x" compression ratio appears to be an extrapolation or community interpretation rather than a direct finding stated in the paper.

**SOURCE URL:** https://cacm.acm.org/research/how-amazon-web-services-uses-formal-methods/

**VERDICT:** The paper exists and the qualitative claims about TLA+ at AWS are accurate. The specific "20-100x" compression ratio needs a more precise citation.

---

## 11. Novelty Assessment: Kolmogorov Complexity Applied to Specification-Code Relationship

**Claim:** The paper claims novelty in applying Kolmogorov complexity to the specification-code relationship.

**FINDINGS:**

Prior work connecting Kolmogorov complexity (KC) to software engineering exists but is limited:

1. **"Kolmogorov Complexity Justifies Software Engineering Heuristics"** (ResearchGate; could not access full text): This paper uses KC to formalize concepts like "simple" and "random" in software testing. It justifies heuristics, not the spec-code relationship directly.

2. **"On the Relationship Between Software Complexity Metrics and Kolmogorov Complexity"** (Malenezi): Applies KC to software complexity metrics but appears focused on code complexity measurement, not on the spec-to-code ratio or abstraction gap.

3. **Wikipedia / general treatments:** KC is widely discussed as the theoretical ideal for compression, and the connection to code abstraction is acknowledged informally (the shortest program for a task uses the most effective abstractions). However, this is typically discussed in the context of algorithmic information theory, not software engineering practice.

4. **Compression-based code generation research:** Emerging work on "compression by code generation" connects KC concepts to program synthesis, but this is focused on using code as a compression medium rather than analyzing the spec-to-code relationship.

5. **Li & Vitanyi's NID (cited in the paper itself):** The normalized information distance framework provides the mathematical machinery for comparing objects via Kolmogorov complexity, but its original application was to general similarity, not specifically to specification vs. implementation.

**VERDICT ON NOVELTY:** The specific application of Kolmogorov complexity to formalize the "abstraction gap" between specification and implementation appears to be **genuinely novel**, or at minimum, not previously published in a form discoverable through standard academic search. Prior work uses KC for software metrics, testing heuristics, and compression theory, but the specific framing of K(spec) vs K(code) as a measure of the abstraction gap does not appear in prior literature. The novelty claim appears defensible.

---

## Summary Table

| # | Citation | Exists | Claims Match | Type |
|---|----------|--------|-------------|------|
| 1 | Gonzalez 2026 | Yes | Partially (numbers unverified) | Blog post |
| 2 | Kim 2025 | Yes | Yes (minor topology count quibble) | arXiv preprint |
| 3 | METR 2026 | Yes | Yes | Research note |
| 4 | GitClear 2025 | Yes | Partially (2 of 3 claims unverified from primary) | Industry report |
| 5 | Vericoding 2025 | Yes | Yes | arXiv / POPL workshop |
| 6 | Kleppmann 2025 | Yes | Yes | Blog post |
| 7 | Congdon 2025 | Yes | Partially (derivative of Kleppmann) | Blog post |
| 8 | Hindle 2012 | Yes | Yes | ICSE / CACM (peer-reviewed) |
| 9 | Li & Vitanyi 2004 | Yes | Yes | IEEE Trans. IT (peer-reviewed) |
| 10 | Newcombe 2015 | Yes | Partially (20-100x ratio unverified) | CACM (peer-reviewed) |

## Overall Assessment

All 10 citations reference real, existing works. None are fabricated or placeholder citations. However, three citations have quantitative claims that could not be fully verified against primary sources:

1. **Gonzalez 2026:** The 3,388/16,063/4.7:1 YAML numbers need verification (blog was inaccessible for full retrieval).
2. **GitClear 2025:** The 17% maintainability drop and 12% bug rate increase appear in secondary summaries but could not be confirmed from the primary report.
3. **Newcombe 2015:** The "20-100x compression" ratio appears to be an inference or community interpretation rather than a direct finding in the paper.

The paper's mix of peer-reviewed sources (Hindle, Li & Vitanyi, Newcombe, Kim) and informal sources (blog posts by Gonzalez, Kleppmann, Congdon; industry reports from GitClear and METR) is worth noting for a paper positioning itself as academic. Five of 10 sources are blog posts or industry reports rather than peer-reviewed publications.

The Kolmogorov complexity novelty claim appears defensible based on available literature.
