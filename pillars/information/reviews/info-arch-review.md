# Peer Review: Information Architecture for AI Coding Agent Harnesses

**Paper:** "Information Architecture for AI Coding Agent Harnesses: A Formal Framework for Context Selection, Degradation, and Reuse Discovery"

**Venue:** Theory and position paper (no new experiments)

**Recommendation:** Major revision

---

## Summary

The paper presents a Shannon information-theoretic framework for reasoning about how context is selected and managed in AI coding agent harnesses. It formalizes context selection as degradation-adjusted submodular maximization, decomposes the spec-to-code "abstraction gap" using the chain rule of entropy, fits a parametric degradation function to published empirical data, proves that optimal context size is strictly less than window capacity, models structural vs. instructional enforcement of tier boundaries, and frames reuse discovery as approximate nearest-neighbor search. The paper synthesizes a wide body of practitioner literature and empirical studies into a coherent formal framework. No new experiments are conducted.

---

## 1. Novelty and Significance

**Rating: Moderate-to-Strong**

The paper's core contribution is synthesis: taking empirical observations scattered across blog posts, industry reports, and a handful of academic papers, and organizing them into a formal framework. This is valuable. The field of "context engineering" is currently guided almost entirely by practitioner intuition; any formalization, even an imperfect one, advances discourse.

The abstraction gap decomposition (Theorem 4.1) is a clean application of Shannon's chain rule. It is not mathematically novel (it is literally two applications of $H(X|Y) = H(X|Y,Z) + I(X;Z|Y)$), but the interpretation in terms of residual/context/prior contributions is well-motivated and useful for practitioners. The bimodal corollary is the paper's most actionable insight.

The context selection formalization as submodular optimization with a degradation penalty is a reasonable modeling choice. The observation that degradation breaks monotonicity (requiring different algorithmic treatment) is a genuine contribution to the optimization framing.

- MINOR: The paper somewhat oversells the novelty of applying submodular optimization to context selection, given that Jina AI (cited) independently proposed the same framing. The paper should more clearly delineate what is new beyond the degradation-adjusted extension.

---

## 2. Formal Rigor

### Theorem 3.1 (Submodularity of Context Relevance)

- MINOR: The "proof" is a tautology. It says "$f$ is submodular if and only if $g$ is supermodular" and then restates the definition of supermodularity. The theorem's real content is in the sufficient conditions (Proposition 3.2), not the theorem statement itself. The theorem should either be demoted to a remark or the proof should establish supermodularity under specific conditions rather than simply assuming it.

### Proposition 3.3 (Code Dependencies Break Submodularity)

- MINOR: The claim $f(\{u_i, u_j\}) > f(\{u_i\}) + f(\{u_j\})$ is superadditivity, not a violation of submodularity per se. Submodularity is about diminishing marginal returns for set inclusion, not about additivity. Superadditivity of a pair does not by itself violate submodularity globally. The proposition needs a corrected statement: it should show that the diminishing returns property fails for nested sets $A \subseteq B$, not just compare singletons against pairs.

### Theorem 3.3 (Non-Monotonicity of the Product Objective)

- MAJOR: The "proof" is an informal argument, not a proof. It says "when $|C|$ is large, the marginal degradation cost exceeds marginal information gain." This is a plausibility argument. A proper proof would construct a specific $C$ and $u$ where $\tilde{f}(C \cup \{u\}) < \tilde{f}(C)$, using the assumed properties of $f$ and $\delta$. The non-submodularity claim is asserted without proof at all ("the multiplicative interaction also distorts the diminishing-returns property").

### Theorem 3.4 (Greedy Approximation)

- MAJOR: This theorem relies on a "linear approximation" $\tilde{f}(C) \approx f(C) - \bar{f} \cdot \delta(|C|)$, but the actual objective is multiplicative: $f(C) \cdot (1 - \delta(|C|))$. The approximation error is not bounded anywhere. Without a bound on the approximation quality, the $1/2$-guarantee does not transfer from the approximate to the actual objective. The citation to Buchbinder et al. (2015) is for unconstrained non-monotone submodular maximization, but the paper's problem has a knapsack constraint ($|C| \leq W$), making the direct application questionable. This needs either: (a) a formal reduction showing the knapsack constraint is redundant under the stopping rule, or (b) citation of a knapsack-constrained result (e.g., Lee et al. 2010 or Feldman et al. 2011).

### Theorem 5.1 (Optimal Context Is Less Than Capacity)

- MINOR: The proof is correct but the "marginal exhaustion condition" in assumption (iv) essentially assumes the conclusion. The theorem says "if adding the last unit hurts more than it helps, then optimum is interior." This is close to circular. The real content would be establishing that the marginal exhaustion condition holds for the fitted degradation parameters; this is deferred to the corollary without formal verification.

### Theorem 6.3 (Multi-Step Compliance Decay)

- MINOR: The independence assumption (each step's compliance probability is independent) is unstated but critical. In practice, if an agent violates an instruction at step $t$, subsequent steps may be more or less likely to violate (due to cascading state corruption or self-correction). The $(1-\epsilon)^T$ model is a useful first approximation but should be flagged as such.

### Theorem 6.4 (Fresh Context Dominance)

- MAJOR: This theorem is stated but never proved. There is no proof sketch, no reference to a proof, and the conditions under which "fresh context dominates accumulated context" are described only informally ("for sufficiently long sequences"). The "diversity" parameter $d > 0$ is undefined. A theorem without a proof is a conjecture.

### Theorem 6.2 (Curation Beats Accumulation)

- MINOR: This "theorem" is a definition of the condition under which curation wins, not a theorem establishing that the condition holds. It says "$C_s$ delivers higher effective information whenever [inequality holds]." Any conditional statement of the form "X is better than Y whenever X is better than Y" is vacuously true.

---

## 3. Empirical Grounding

### Strengths

- The paper draws on a genuinely broad evidence base: Chroma's 18-model study, Liu et al.'s positional recall work, Du et al.'s context length findings, JetBrains' observation masking, the ETH AGENTS.md evaluation, and multiple production harness architectures. The synthesis is the paper's strongest contribution.
- The degradation function fit (Table 1) is well-presented with three candidate forms compared against observed data.

### Weaknesses

- MAJOR: The parametric fit in Table 1 is based on a single model (Llama-3.1-70B) at three data points. Three data points can fit any two-parameter model perfectly. The paper claims the power law is "best-fit" but with only three calibration points, this cannot be distinguished from overfitting. The range $\alpha \in [0.3, 0.5]$ and $W_{\text{eff}} \in [0.1W, 0.7W]$ is so wide that it is not clear the parametric form provides much predictive value.

- MAJOR: The positional recall function (Definition 4.2) has six free parameters ($\phi_0$, $A_p$, $\lambda_p$, $A_r$, $\lambda_r$, $\gamma$) fitted to a single study (Liu et al. 2024, 20-document QA). No confidence intervals, no cross-validation, no test on held-out data. This is curve-fitting presented as a model.

- MINOR: The Corollary 4.2 (bimodal distribution) is labeled a "corollary" of the abstraction gap decomposition, but it does not follow logically from the decomposition. The decomposition holds for all tasks; the claim that the gap is bimodally distributed is an empirical observation supported by the ETH study, not a formal consequence of the chain rule. It should be labeled a hypothesis or empirical observation.

- MINOR: The "superlinear distractor interference" explanation for why shuffled haystacks outperform structured ones (Section 4.5) is speculative. The quadratic reinforcement term $\binom{n_d}{2} \cdot \bar{s}_d$ is presented as an explanation without any experimental verification. This should be flagged as a proposed mechanism, not an established result.

---

## 4. Logical Gaps and Unsupported Claims

- MAJOR: The paper claims the abstraction gap decomposition terms are "all estimable from LLM log-probabilities" (Section 4.3), but $I(P;\theta|S)$ requires comparing "a trained model against a randomly initialized one." A randomly initialized transformer does not produce meaningful log-probabilities; its output is essentially uniform over vocabulary. The mutual information $I(P;\theta|S) = H(P|S) - H(P|S,\theta)$ requires estimating $H(P|S)$, the entropy of correct programs given only the spec, which requires marginalizing over all possible models. This is not straightforward and the paper does not address the practical obstacles.

- MINOR: The reuse map compression ratio ("1000x") is presented as a precise figure but is an order-of-magnitude estimate based on one hypothetical scenario (500 files, 50 reusable components). This should be flagged as illustrative, not general.

- MINOR: Section 7.4 claims vector RAG yields "94.7% irrelevance" based on a single blog post (ByteRover). This is presented as a general indictment of vector RAG for code, but one benchmark on one codebase with unspecified embedding model and chunking strategy does not support such a sweeping conclusion.

- MINOR: The cognitive load theory connection (Section 7.2) maps transformer attention phenomena onto Sweller's framework, but this analogy is loose. Intrinsic/extraneous/germane load are defined in terms of human schema acquisition; the mapping to attention entropy is suggestive but not rigorous. The Guo et al. (2024) adversarial result is interesting but demonstrates vulnerability to adversarial attack, not normal-case cognitive overload.

---

## 5. Missing Related Work

- MAJOR: The paper formalizes context selection but does not cite the extensive literature on active information acquisition / value of information in decision theory (e.g., Howard 1966, "Information Value Theory"). The context selection problem, where you decide which information to acquire before acting, is precisely the value-of-information problem. This literature provides alternative formalizations and existing results.

- MINOR: The information bottleneck connection (Section 8, brief mention of Tishby et al. 2000) deserves deeper treatment. The context window as an information bottleneck is potentially the most natural formalization, yet it gets one paragraph. Shwartz-Ziv and Tishby (2017) on deep learning and the information bottleneck is relevant but uncited.

- MINOR: The paper does not cite work on retrieval-augmented generation (RAG) from the NLP literature beyond the code-specific sources. Lewis et al. (2020, "RAG: Retrieval-Augmented Generation") and Borgeaud et al. (2022, "RETRO") address similar context selection tradeoffs in the general LLM setting.

- MINOR: For the submodularity analysis, Mirzasoleiman et al. (2015, "Lazier Than Lazy Greedy") on efficient submodular maximization and Wei et al. (2015) on submodularity in data selection are relevant but uncited.

---

## 6. Clarity and Presentation

### Strengths

- The paper is generally well-written and well-organized. The progression from definitions through theorems to design principles is logical.
- The notation section is clear and consistent.
- The "Why Shannon, Not Kolmogorov" section (2.2) is an excellent piece of expository writing that preempts a natural objection.
- Table 3 (production harness patterns and formal justifications) is an effective synthesis artifact.

### Weaknesses

- MINOR: The abstract is 278 words and tries to summarize all six contributions in detail. It reads more like an extended summary than an abstract. Consider trimming to the three most important contributions.

- MINOR: The paper uses the `googledeepmind` document class but the authors are affiliated with "Pragnition Labs" and "Affiliation 1." The template artifacts (placeholder affiliations, empty `\today{}`) should be cleaned up before submission.

- MINOR: The author list is "First Author" and "Second Author," which are obviously placeholders. This is fine for a draft but should be noted.

- MINOR: The degradation function notation is inconsistent. Definition 3.2 uses $\delta(x) = \alpha \cdot x^\beta$ with $\beta \in [1,2]$, but Section 4.3 uses $\delta(n) = (n/W_{\text{eff}})^\alpha$ with $\alpha \in [0.3, 0.5]$. The symbol $\alpha$ means different things in the two parametrizations. This is confusing and should be unified.

- MINOR: The Position Dominance Inequality (Proposition 4.4) states $\eta \leq 0.3$ but $\eta$ is not defined in the proposition or anywhere prior to it. It appears to be a relevance boost parameter but its definition is missing.

---

## 7. Bibliography Issues

- FATAL: The citation `\citet{dijkstra1978foolishness}` in Section 2.2 has no corresponding entry in the .bib file. This will cause a compilation error. Additionally, the reference appears to attribute the "abstraction gap as conditional Kolmogorov complexity" concept to Dijkstra (1978), but Dijkstra's 1978 paper "On the foolishness of 'natural language programming'" does not discuss Kolmogorov complexity or formalize the abstraction gap. The citation appears to be fabricated or misattributed.

- MINOR: The `contextdiscipline2025` entry lists the author as "Anonymous," which is non-standard for a bib entry. If this is an anonymous preprint, the actual author(s) should be identified or the entry should use the first listed author.

- MINOR: The `bialek2025entropy` entry uses "and others" for co-authors. This should list all authors or use the standard "et al." convention in the bib entry (i.e., list the first few authors explicitly).

- MINOR: Several entries use `\url{}` in the `note` field. This is functional but non-standard; the `howpublished` field or a dedicated `url` field (with the `url` or `hyperref` package) is more conventional.

- MINOR: The `dai2019transformerxl` and several other entries in the .bib file are not cited in the paper (e.g., `li2023starcoder`, `ain2019systematic`, `calinescu2011maximizing`, `suzgun2024metaprompting`, `kim2025scaling`, `bui2026opendev`, `mitchell2008hoogle`, `pan2025compression`, `vitanyi2020incomputable`). These orphaned entries should be cleaned up.

---

## 8. Summary of Issues by Severity

### FATAL (1)

1. Missing bib entry for `dijkstra1978foolishness`, likely a fabricated or misattributed citation.

### MAJOR (6)

1. Theorem 3.3 proof is informal; non-submodularity of the product objective is asserted without proof.
2. Theorem 3.4 relies on an unbounded linear approximation; the knapsack constraint makes the Buchbinder et al. citation inapplicable without further argument.
3. Theorem 6.4 (Fresh Context Dominance) is stated without proof; key parameter $d$ is undefined.
4. Degradation function fitted to 3 data points from one model; overfitting is indistinguishable from a good fit.
5. Positional recall function has 6 free parameters fitted to one study without validation.
6. Missing related work on value-of-information theory, which directly addresses the paper's core problem.

### MINOR (16)

1. Novelty relative to Jina AI's independent submodular framing not clearly delineated.
2. Theorem 3.1 proof is tautological (restates definition).
3. Proposition 3.3 conflates superadditivity with submodularity violation.
4. Theorem 5.1's marginal exhaustion condition is close to assuming the conclusion.
5. Theorem 6.3 relies on unstated independence assumption across agent steps.
6. Theorem 6.2 is a vacuous conditional, not a theorem.
7. Corollary 4.2 (bimodal distribution) does not follow from the theorem it claims to be a corollary of.
8. Superlinear distractor interference is speculative, not established.
9. $I(P;\theta|S)$ estimability claim has unaddressed practical obstacles.
10. Reuse map 1000x compression is anecdotal, not general.
11. Vector RAG indictment based on single blog post.
12. Cognitive load theory analogy is loose.
13. Abstract is overlong.
14. Template artifacts (placeholder authors, affiliations, document class).
15. Inconsistent notation for degradation function parameters ($\alpha$ reused with different meanings).
16. $\eta$ in Proposition 4.4 is undefined.

---

## 9. Recommendations for Revision

1. **Tighten the proofs.** Theorems 3.3, 3.4, and 6.4 need actual proofs, not plausibility arguments. If a formal proof is beyond scope, downgrade to conjectures or propositions with supporting evidence.

2. **Address the approximation gap in Theorem 3.4.** Either bound the error of the linear approximation, cite a result for knapsack-constrained non-monotone submodular maximization, or restate the guarantee with appropriate caveats.

3. **Validate the parametric fits.** The degradation function and positional recall model need validation on held-out data or at minimum cross-model comparison. Fitting six parameters to one dataset is not a contribution; it is an exercise.

4. **Fix the Dijkstra citation.** Identify the actual source for the Kolmogorov-complexity formulation of the abstraction gap, or remove the claim.

5. **Add value-of-information literature.** The paper's core problem (which information to acquire before acting) has a 60-year literature in decision theory. Engaging with this would strengthen the paper considerably.

6. **Unify notation.** The degradation function parameters should use consistent symbols throughout.

7. **Label claims correctly.** Empirical observations should not be labeled as corollaries of formal theorems. Conjectures should not be labeled as theorems. The paper's credibility depends on honesty about what has been proved versus what has been observed.

---

## 10. Overall Assessment

This paper tackles an important and timely problem: the lack of formal foundations for context engineering in AI coding agents. The synthesis of practitioner knowledge and empirical results into a coherent framework is genuinely valuable, and the abstraction gap decomposition, the degradation-adjusted submodular formulation, and the structural-vs-instructional enforcement analysis are all useful conceptual contributions.

However, the paper's execution falls short of its ambition. Several "theorems" are informal arguments or near-tautologies. The empirical calibration is based on too few data points to support the parametric claims. One citation appears to be fabricated. The paper would benefit significantly from (a) honest labeling of what has been proved versus conjectured versus observed, (b) tighter proofs for the core results, and (c) engagement with the value-of-information literature that directly addresses the paper's central question.

With major revisions addressing the proof gaps, empirical validation, and missing related work, this could be a strong contribution to the emerging field of formal context engineering.
