# Peer Review: Model Routing Architecture for AI Coding Agent Harnesses

**Reviewer:** Automated Peer Review (Claude Opus 4.6)
**Date:** 2026-04-03
**Recommendation:** MAJOR REVISION

---

## Summary

The paper presents a formal framework for model routing in AI coding agent harnesses, casting the problem of selecting which LLM to use at each pipeline stage as a combination of combinatorial optimization, copula-based diversity analysis, sequential testing, and contextual bandits. It synthesizes five main contributions: (1) the Heterogeneous Stage Assignment Problem, (2) a Cross-Model Diversity Theorem, (3) a Pipeline Crossover Theorem, (4) an Adaptive Escalation Framework, and (5) a Cascade Routing Architecture. The paper is explicitly positioned as a "theory and position paper" that applies classical results to a new domain.

---

## Strengths

1. **Well-scoped problem with real economic motivation.** The 1000x price range across model tiers, combined with task-dependent capability gaps, is a genuine and underexplored optimization opportunity. The paper makes a compelling case that this is not a toy problem.

2. **Honest self-assessment.** The limitations section (Section 12) is unusually forthright. The paper acknowledges that quality estimation is unsolved, that routing collapse is a real failure mode, that independence assumptions are violated, and that the bandit framework is insufficient for multi-step dependencies. This intellectual honesty strengthens the paper.

3. **Strong contrarian section.** Section 10 presents objections in their strongest form before responding. The engagement with routing collapse (objection 5) and the "single-model simplicity wins" argument (objection 1) is substantive, not strawmanned.

4. **Good synthesis of classical tools.** The paper connects the Hungarian algorithm, FKG inequality, Gaussian copulas, Wald's SPRT, contextual bandits, and Bandits with Knapsacks into a coherent framework. Each piece is well-motivated and clearly positioned.

5. **Empirical calibration tables.** Tables 1, 3, and 4 provide concrete, sourced numbers that ground the formal results.

6. **No em dashes.** The paper consistently uses commas, semicolons, colons, and parentheses for parenthetical constructions. Good.

---

## Issues

### MAJOR Issues

#### M1. The LSAP reduction in Theorem 3.1 is incorrect as stated.

**Severity: MAJOR**

The Hungarian algorithm solves the Linear Sum Assignment Problem (LSAP) for *square* bipartite matching: it assigns $n$ workers to $n$ jobs, one-to-one. But model routing is not a one-to-one assignment. Multiple stages can (and typically should) use the same model. There are $M$ models and $K$ stages where typically $K > M$, and the assignment $\sigma: \mathcal{K} \to \mathcal{M}$ is a general function, not an injection.

The reduction as stated ("define the assignment cost as $c_k(m)$ if $q_k(m)$ meets the per-stage quality threshold") gives the correct *answer* (because the unconstrained minimization over $\mathcal{M}^K$ decomposes into $K$ independent per-stage minimizations when the objective is additive), but the *reduction to LSAP* is wrong. When stages can share models, the problem is not a matching problem at all; it is $K$ independent minimizations, each trivially $O(M)$, for total time $O(MK)$. The LSAP is only the right formulation if each model can serve at most one stage (capacity constraints), which is not stated.

Either (a) add capacity constraints and make the matching semantics explicit, or (b) acknowledge that without capacity constraints the problem decomposes trivially and the LSAP reduction is unnecessary. The claim of $O((MK)^3)$ complexity is misleading when the actual complexity is $O(MK)$.

#### M2. Theorem 5.1 (Pipeline Crossover) has an implicit circularity in $n^*$.

**Severity: MAJOR**

The expression for the crossover length is given as:

$$n^* = \frac{\log\left(1 - (1 - q_e^n)^{1/r}\right)}{\log q_c}$$

This defines $n^*$ implicitly, since $n$ appears on both sides. The paper states this is a "closed-form expression" (in the abstract: "with closed-form expression as a function of per-step quality"), but it is not closed-form; it is an implicit equation that must be solved numerically or by fixed-point iteration.

In the proof, the numerical example correctly evaluates both sides for $n = 3$ and $n = 4$ to bracket the crossover, confirming the result. But the abstract's claim of a "closed-form expression" should be corrected to "implicit characterization" or the equation should be replaced with an approximate closed form (e.g., by taking a first-order Taylor expansion around the crossover point).

#### M3. The FKG inequality is invoked but never actually applied.

**Severity: MAJOR**

The abstract and Section 4 claim to "extend the FKG inequality to model routing." The FKG inequality is a correlation inequality on distributive lattices that lower-bounds the expectation of a product of increasing functions. But the actual proof of Theorem 4.1 uses the *monotonicity of the Gaussian copula in $\rho$*, which is a different (and simpler) result. The FKG inequality is never stated, never applied, and plays no role in the proof.

This is a name-drop, not a mathematical contribution. Either (a) actually derive the diversity result from the FKG inequality on the lattice of error patterns (which would be a genuine contribution), or (b) replace references to the FKG inequality with references to copula monotonicity, which is what the proof actually uses. As it stands, the paper claims a stronger theoretical pedigree than the proof supports.

#### M4. Theorem 4.1 (Cross-Model Diversity Theorem) is essentially a restatement of copula monotonicity, not a theorem.

**Severity: MAJOR**

The "theorem" states: if $\rho_{\text{same}} > \rho_{\text{cross}}$, then $C_{\rho_{\text{same}}} > C_{\rho_{\text{cross}}}$. The proof is: the Gaussian copula is increasing in $\rho$ (cite Nelsen 2006). This is a one-line corollary of a known result, not a theorem. Calling it the "Cross-Model Diversity Theorem" overstates the contribution.

The interesting claim would be quantifying the *magnitude* of the diversity gain as a function of the failure rates and the correlation gap, or proving conditions under which cross-family verification is *cost-effective* (accounting for the additional API cost). Neither is done.

#### M5. Proposition 4.2 (Ensemble Saturation Floor) formula is unsourced and appears incorrect.

**Severity: MAJOR**

The expression given for the ensemble escape probability limit:

$$\lim_{N \to \infty} P_{\text{esc}}^{(N)} = \Phi\left(\frac{\Phi^{-1}(\phi)}{\sqrt{1 - \rho}}\right) \cdot (1 - \rho) + \rho \cdot \phi$$

This does not match standard results for the limiting behavior of exchangeable Bernoulli sequences under a Gaussian copula. Under the standard one-factor Gaussian copula model with loading $\sqrt{\rho}$, the conditional independence structure gives a different limiting form (the Vasicek/asymptotic single-risk-factor formula from credit risk). The formula as written appears to be a linear interpolation between two terms, which is not the standard derivation.

Provide a derivation or a precise citation (with equation number) for this formula. The numerical claim ("for $\phi = 0.15$ and $\rho = 0.7$, this floor is approximately 0.12") should be verified against the standard formula.

#### M6. Several bibliography entries are incomplete or have placeholder authors.

**Severity: MAJOR**

Multiple bibliography entries use "Various" as the author:
- `correlatedensemble2026`: author is "Various"
- `inferencescalingflaws2024`: author is "Various"
- `routingcollapse2026`: author is "Various"
- `complexitymetrics2025`: author is "Various"
- `racer2026`: author is "Various"

Several entries use "and others" with only the first author:
- `lifshitz2025multiagent`: "Lifshitz, Ofir and others"
- `zhu2024congra`: "Zhu, Yi and others"
- `routerbench2024`: "Hu, Qitian and others"

A paper submitted for review cannot have placeholder author fields. These must be filled with actual author lists.

Additionally, `capersjones2012` has year "1955" but the title and publisher suggest a 2012 publication. This appears to be a data entry error.

#### M7. The NP-hardness result (Theorem 3.4) has an inadequate reduction.

**Severity: MAJOR**

The theorem claims that the combined (cost + quality + latency) optimization is NP-hard, citing a reduction from "the multi-level bottleneck assignment problem" to Kuhn (1955). But Kuhn (1955) is about the Hungarian method, which solves the *tractable* case. The paper does not identify a specific NP-hardness result being reduced from, nor does it construct the reduction.

Saying "reduces from the multi-level bottleneck assignment problem, which is NP-hard" is insufficient for a formal paper. Either provide the reduction, cite a specific NP-hardness proof for the multi-level bottleneck assignment problem, or weaken the claim to a conjecture.

### MINOR Issues

#### m1. The abstract is too long and contains too many technical details.

**Severity: MINOR**

At approximately 300 words, the abstract reads like an extended summary rather than an abstract. The inline regret bounds ($O(d\sqrt{T \ln T})$, $\Theta(T^{2/3})$), the specific percentages (88-90%, 85%, 95%), and the enumeration of all five contributions make it dense to the point of being unreadable on first pass. Consider cutting to the three most novel contributions and moving details to the introduction.

#### m2. Inconsistent notation for pipeline stages.

**Severity: MINOR**

Section 2.1 defines $\mathcal{K} = \{1, \ldots, K\}$ as pipeline stages and uses $K$ for the number of stages. Section 5 reuses $K$ for the number of independent attempts in Pass@K. This overloading creates ambiguity in Theorem 5.1, where "a single expensive-model attempt dominates $K$ cheap-model attempts (at equal cost, so $K = r$)" uses $K$ differently from the pipeline stages definition. Use a different letter (e.g., $N$ or $J$) for the number of attempts.

#### m3. The "quality architecture paper in this series" (Section 4.1) is never cited.

**Severity: MINOR**

Line "The quality architecture paper in this series establishes that same-model verification underestimates escape probability via the FKG inequality." This is a forward/cross reference to an unpublished companion paper. Either cite it properly (even as a working paper) or remove the reference and make the section self-contained.

#### m4. Table 1 model data is difficult to verify.

**Severity: MINOR**

The table presents specific pricing and benchmark scores labeled "early 2026" but cites only Chen et al. (2021) for HumanEval, which predates the models listed by 4+ years. The SWE-bench Verified numbers and pricing data need specific citations. "Claude Sonnet 4.6" and "Claude Opus 4.6" are model versions that may or may not exist at the time of review; the provenance of these specific numbers should be documented.

#### m5. Corollary 4.1 (Weak Independent Beats Strong Correlated) needs tighter conditions.

**Severity: MINOR**

The corollary states the condition $\phi_P \cdot \phi_V^{\text{weak}} < C_{0.8}(\phi_P, \phi_V^{\text{strong}})$ under $\rho_{\text{cross}} \approx 0$. The assumption $\rho_{\text{cross}} \approx 0$ is unrealistic; the paper's own empirical data (Section 4.2) shows cross-family correlations of 0.3-0.5, not near zero. The numerical example should use realistic correlation values.

#### m6. Theorem 6.1 (Routing Regret Bounds) merely restates known results.

**Severity: MINOR**

Parts (a), (b), and (c) of Theorem 6.1 are direct citations of UCB1 (Auer et al., 2002), LinUCB (Li et al., 2010), and Monster (Agarwal et al., 2014). Collecting known results under a new theorem number without modification or extension is misleading; these should be stated as "Fact" or "Known Result" rather than "Theorem."

#### m7. The Viola-Jones analogy is stretched.

**Severity: MINOR**

The cascade architecture (Section 7) is described as "inspired by Viola-Jones." While both use cheap-to-expensive cascades, the Viola-Jones cascade uses trained weak classifiers at each stage to *reject* easy negatives, operating on a binary detection problem. LLM cascading operates on a generation problem where the "rejection" is a quality assessment of generated output. The analogy is apt at a high level but the formal results from Viola-Jones (Theorem 7.1's expected cost formula) apply to the detection setting, not the generation setting, without additional justification for why the acceptance probability $a_i$ is well-defined and estimable for generated text.

#### m8. Missing related work on speculative decoding.

**Severity: MINOR**

Speculative decoding (Leviathan et al., 2023; Chen et al., 2023) is a form of model routing at the token level: a small "draft" model generates tokens and a large "verification" model accepts or rejects them. This is arguably the most successful deployed form of model cascading and should be discussed in the related work, particularly since it embodies the cascade principle at a finer granularity than the paper considers.

#### m9. Missing related work on Pareto-optimal LLM serving.

**Severity: MINOR**

Recent work on Pareto-optimal model serving (e.g., Zheng et al., "Efficiently Programming Large Language Models using SGLang," 2024; Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention," 2023) addresses the systems-level cost optimization that interacts with routing decisions. The KV-cache invalidation analysis in Section 6.4 would benefit from grounding in this systems literature.

#### m10. The claim "first unified formal treatment" (abstract) is strong.

**Severity: MINOR**

The abstract claims "the first unified formal treatment of model selection for AI coding pipelines." Dekoninck et al. (2025), which the paper cites extensively, provides optimality proofs for LLM routing and cascading. Moslem and Kelleher (2026) provide a comprehensive survey. The paper's contribution is applying these to *coding* pipelines specifically, but "first unified formal treatment" oversells the novelty. Consider qualifying as "the first formal treatment specialized to multi-stage coding agent pipelines."

#### m11. The definition of blind-spot correlation (Definition 4.1) uses a correlation coefficient but the proof machinery uses a copula parameter.

**Severity: MINOR**

Definition 4.1 defines $\rho(m_i, m_j)$ as the Pearson correlation of failure indicators (binary variables). The Gaussian copula parameter $\rho$ in Theorem 4.1 is the correlation of the underlying latent Gaussian variables, not the same quantity. For binary variables, the Pearson correlation and the Gaussian copula parameter are related but not identical. This distinction matters for the numerical calibration; the empirical correlations cited from Ruis et al. (2025) may be Pearson correlations on binary outcomes rather than copula parameters.

#### m12. Latency model (Definition 2.3) uses bottleneck but should use sum for serial pipelines.

**Severity: MINOR**

The latency model $L(\sigma) = \max_k l_k(\sigma(k))$ (bottleneck) is appropriate for parallel execution. But coding agent pipelines are typically serial: plan, then implement, then test, then review. For serial pipelines, latency should be $L(\sigma) = \sum_k l_k(\sigma(k))$ (additive). The paper should clarify which execution model is assumed, or provide both formulations.

#### m13. Point estimates where ranges are needed.

**Severity: MINOR**

Several claims use suspiciously precise point estimates:
- "94.9% of queries" in the routing collapse discussion (carried from the source, acceptable)
- "$n^* \approx 3$" (the crossover occurs between 3 and 4, so stating $\approx 3$ is slightly misleading)
- "85% cost reduction at 95% quality retention" (these are single-benchmark results from RouteLLM on MT Bench, not general claims, but the paper sometimes presents them without the benchmark qualifier)

---

## Questions for the Authors

1. **On the LSAP reduction (M1):** If models have no capacity constraints (any number of stages can use the same model), why invoke the Hungarian algorithm at all? The problem decomposes into independent per-stage selections. Under what capacity model does the assignment formulation become non-trivial?

2. **On the FKG inequality (M3):** Can you provide a lattice-theoretic formulation of the model diversity problem where the FKG inequality is the operative tool, rather than simple copula monotonicity? What does the lattice look like, and what are the increasing functions?

3. **On the saturation floor (M5):** Where does the formula for Proposition 4.2 come from? Is it derived from the equicorrelated Gaussian copula model, and if so, can you provide the derivation or a specific reference?

4. **On independence (Limitation 2):** You note that the multiplicative quality model $Q = \prod q_k$ assumes independence and that errors propagate between stages. How sensitive are the assignment results (Section 3) to this assumption? If a bad plan doubles implementation failure probability, does the optimal assignment change qualitatively?

5. **On routing collapse (Section 7.3):** You identify routing collapse as the primary failure mode but propose only mitigations, not solutions. Is there a theoretical bound on the fraction of tasks that any router must send to the strongest model under realistic quality distributions? In other words, is some degree of "collapse" actually optimal?

---

## Verdict

The paper addresses a real and important problem with a well-organized formal framework. The synthesis of classical tools is valuable, and the empirical calibration provides useful grounding. However, several of the formal claims are either incorrect (the LSAP reduction), overstated (calling copula monotonicity the "FKG inequality"), or inadequately supported (the NP-hardness reduction, the saturation floor formula). The bibliography has multiple incomplete entries that are unacceptable for submission.

None of these issues are fatal in isolation; the underlying ideas are sound. But the accumulation of formal imprecisions in a paper whose primary contribution is *formal rigor* applied to a new domain undermines the core value proposition. A revision addressing the major issues (particularly M1, M3, M4, and M7) would substantially strengthen the paper.

**Recommendation: Major Revision.**
