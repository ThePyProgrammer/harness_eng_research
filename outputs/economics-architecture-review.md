# Peer Review: Economics Architecture for AI Coding Agent Harnesses

**Reviewer:** Simulated Reviewer (Reviewer 6)
**Date:** 2026-04-03
**Paper:** Economics Architecture for AI Coding Agent Harnesses

---

## 1. Summary

This paper presents a formal economics framework for AI coding agent harnesses, built around five interlocking results: the Token Budget Allocation Problem (TBAP) with a water-filling solution, the Model Tier Selection Problem (MTSP) as a GAP variant, queueing economics for dual-regime (interactive vs. autonomous) model selection, a formal Jevons paradox for token markets, and the CVIH efficiency metric with quasi-concavity and budget separation properties. The paper derives seven design principles, proves a Weakest-Link theorem and Cache-First principle, and calibrates all models against April 2026 pricing data. The overall contribution is a synthesis paper that applies well-established optimization and economic theory to the specific structure of multi-stage AI coding pipelines, yielding several actionable design principles.

---

## 2. Strengths

- **Well-motivated problem.** The paper opens with a crisp quantitative argument: multi-stage agentic coding pipelines consuming millions of tokens per session create a first-order cost problem that no existing harness addresses. The harness comparison table (Table 1) is effective at establishing the gap.

- **Clean formal structure.** The TBAP formulation, log-transformation, KKT-based Equal Marginal Rate theorem, and water-filling analogy are presented cleanly and correctly. The progression from axioms to definitions to theorems is textbook-quality in its organization.

- **Honest scope claims.** The paper explicitly states (Section 1, "Scope and novelty") that it does not claim to have invented portfolio theory, queueing theory, or the Jevons paradox. This intellectual honesty is refreshing and sets appropriate expectations.

- **Contrarian positions section.** Section 12 engages four common objections fairly and grades each on a strength scale. The "Developer Time Dominates Token Cost" objection is particularly well-handled, with the regime-dependent resolution being both correct and non-obvious.

- **Actionable output.** The seven design principles are concrete enough to implement. The JASP decomposition (enumerate model assignments, solve convex inner problem) is practical for real harness systems.

---

## 3. Weaknesses

### FATAL

**(F1) The composition argument in Proposition 3.2 (concavity of log-transformed objective) is incomplete and potentially incorrect as stated.**

The paper claims that since log is "concave and non-decreasing on (0,1]" and $q_k$ is concave, the composition $\log \circ q_k$ is concave, citing Boyd & Vandenberghe Section 3.2.4. However, the Boyd & Vandenberghe composition rule (Section 3.2.4) states that $f(g(x))$ is concave when $f$ is concave and *non-decreasing* and $g$ is concave. The function $\log$ is indeed concave and non-decreasing on $(0, \infty)$, so the composition result does hold. But the proof text says "concave non-decreasing function ($\log$ on $(0,1]$)" in a parenthetical that restricts the domain to $(0,1]$ without justification. Since $q_k$ maps to $[0,1]$ by axiom, the range is indeed within $(0,1]$ when $r_k > 0$, so the domain restriction is actually fine. However, the proof conflates two things: (a) the non-decreasingness of log on the relevant domain and (b) the requirement that the outer function be non-decreasing for the composition rule. The conclusion is correct, but the proof text is confusing enough that a reader could mistakenly believe it relies on log being non-decreasing only on $(0,1]$ (it is non-decreasing everywhere on its domain). I am downgrading this from FATAL to MAJOR upon further reflection, since the mathematical result holds; the exposition is simply misleading.

**Revised severity: MAJOR** (see M1 below).

**(F2) The graceful degradation bound (Proposition 7.5, Equation 16) appears to lack a derivation.**

The proposition states:
$$Q^*(\alpha B^*) \geq (Q^*(B^*))^{1/\alpha^{\beta}}$$
where $\beta \in (0,1)$ "depends on the quality function family." No proof or derivation is provided, only the assertion that "for exponential saturation functions, $\beta \approx 0.5$--$0.7$." This is problematic:

1. The bound is presented as a proposition but has no proof sketch, even informal.
2. The exponent $1/\alpha^{\beta}$ with $\alpha < 1$ means $1/\alpha^{\beta} > 1$, so we are raising $Q^*(B^*) \in (0,1]$ to a power greater than 1, yielding a number *smaller* than $Q^*(B^*)$. The bound says quality at reduced budget is at least as large as this smaller number. This is the right direction for a lower bound, but the tightness is uncharacterized.
3. The parameter $\beta$ is unspecified and depends on an unspecified "quality function family," making the bound non-falsifiable.
4. The paper claims the bound "establishes that quality degrades sub-exponentially with budget cuts," but without a derivation, this is an unsupported claim.

**Severity: FATAL.** Either provide a proof (at least a sketch) or remove the proposition and replace it with an empirical observation.

### MAJOR

**(M1) The concavity composition argument is correct but poorly explained (promoted from F1).**

See the discussion under F1. The proof of Proposition 3.2 should be rewritten to clearly state: (1) $\log$ is concave and non-decreasing on $(0, \infty)$; (2) $q_k$ is concave on $\mathbb{R}_{>0}$ and maps into $(0,1] \subset (0, \infty)$; (3) by the concave composition rule (Boyd & Vandenberghe 3.2.4), $\log \circ q_k$ is concave. The current parenthetical "($\log$ on $(0,1]$)" is an unnecessary and confusing restriction.

**(M2) The Weakest-Link theorem (Theorem 3.5) conflates two distinct results.**

The theorem statement begins with "the product $\prod_k q_k(r_k)$ is maximized when the marginal contributions are equalized" (which is the EMR result, Theorem 3.3) and then pivots to the AM-GM inequality. These are related but different claims:

- The EMR theorem says marginal quality-per-dollar is equalized at optimality.
- The AM-GM inequality says, for fixed sum of qualities, the product is maximized when qualities are equal.

The AM-GM result applies to the quality *values*, not directly to the budget allocation. The connection between "equalize quality values" and "optimal budget allocation" requires the additional step that concave quality functions + budget constraint imply a mapping from budget equalization to quality equalization, which is only true in the symmetric case (identical quality functions and prices). The theorem statement should be clearer about when the AM-GM bound is tight vs. when it is merely a bound.

**(M3) The stage independence assumption is acknowledged but not adequately analyzed.**

Section 13 (Limitations) notes that the multiplicative quality model assumes stage independence and that "correlated failures are common." This is correct, but the paper does not quantify the impact of this assumption. In a real pipeline, a poor planning stage does not just reduce $q_1$; it also reduces the effective quality function $q_k(\cdot)$ for all downstream stages (the input to stage $k$ is degraded). The multiplicative model $\prod_k q_k(r_k)$ assumes that each $q_k$ depends only on its own token allocation $r_k$, not on upstream outputs. This is a strong assumption. The paper should either:

1. Provide a sensitivity analysis showing that the main results (EMR, Weakest-Link) are robust to moderate correlations, or
2. Formalize the correlated model (e.g., $q_k(r_k, q_{k-1})$) and show which results survive.

Without this, the entire formal framework rests on an assumption that the paper itself identifies as empirically dubious.

**(M4) The elasticity estimate ($\epsilon \approx 1.19$) is under-supported.**

The paper estimates price elasticity of demand for tokens using "publicly available data" showing a 10x price reduction and 100-500x consumption growth. The midpoint formula for arc elasticity yields $\epsilon \approx 1.1$--$1.3$. Several concerns:

1. The consumption growth estimate ("100--500x") spans half an order of magnitude. The elasticity estimate is highly sensitive to which end of this range is used.
2. The paper itself notes that this "conflates intensive margin ... and extensive margin." This is not just an econometric quibble; the Jevons paradox argument specifically requires the intensive margin elasticity to exceed unity (the extensive margin is a different phenomenon, namely new use cases). If most of the consumption growth is extensive-margin (new users, new applications), the intensive-margin elasticity could be well below 1, invalidating the Jevons argument for existing users.
3. No confidence interval or sensitivity analysis is provided for the point estimate.

The Jevons result (Theorem 6.1) is mathematically correct as a conditional: *if* $\epsilon > 1$, *then* spend increases as prices fall. But the empirical claim that $\epsilon > 1$ for token markets is not established rigorously enough to support the strong design principle "Budget for Jevons."

**(M5) The CVIH budget separation theorem (Theorem 7.3) has a gap.**

The proof assumes that $B^*_Q$ is in the interior (i.e., $Q'(B^*_Q) = 0$). But if quality functions have a finite asymptote (as the exponential saturation family does with $\lim_{r \to \infty} q(r) = 1$), then $Q^*(B) \to 1$ as $B \to \infty$ without ever reaching a finite optimum. In that case, $B^*_Q = \infty$, and the statement $B^*_{\text{CVIH}} < B^*_Q$ is trivially true but uninformative. The theorem should clarify whether $B^*_Q$ is assumed to be finite, and if so, what quality function properties guarantee finiteness (e.g., a quality function that peaks and then declines, as suggested by the "context rot" discussion).

**(M6) The MTSP NP-hardness proof sketch (Proposition 4.2) is insufficiently detailed.**

The proof sketch claims a "reduction from the standard GAP" but does not specify how "bin capacities" map to "capability thresholds." GAP's NP-hardness involves both bin capacities and item sizes/profits; the MTSP has capability constraints $\gamma_k^{(\sigma(k))} \geq \gamma_k^{\min}$ and a multiplicative quality constraint. The multiplicative constraint is structurally different from GAP's additive constraints. A more detailed reduction is needed, or the authors should cite a specific GAP variant whose structure matches the MTSP more closely.

**(M7) The "Cache-First principle" (Theorem 8.3) overstates its conclusion.**

The theorem claims that "among all cost optimization levers ... caching has the unique property of reducing cost with zero quality impact." This is presented as a theorem, but the claim that cached tokens deliver "identical model behavior" is an empirical property of current LLM provider implementations, not a mathematical result. If a provider changed their caching implementation (e.g., using approximate caching with lossy compression), this "theorem" would be falsified. It would be more honest to frame this as an empirical observation or engineering principle rather than a formal theorem.

### MINOR

**(m1) The pricing table (Table 2) lists Claude Opus 4 and Claude Sonnet 4 as April 2026 models.**

Verify that these model names and prices are accurate as of the stated date. Model naming conventions and pricing change frequently; if the paper is published after a pricing change, the calibration section loses credibility. Consider adding a "prices verified as of [specific date]" note.

**(m2) The paper does not define the Hill function's concavity condition precisely.**

Equation 12 states the Hill function $q(r) = r^n / (r^n + K_d^n)$. The paper claims "for $n \leq 1$, this is concave." This is correct, but the paper uses $n$ as the Hill coefficient without noting that for $n > 1$, the Hill function is sigmoidal (S-shaped) and violates axiom (Q4). Since $n > 1$ is common in biological dose-response curves, this restriction should be stated explicitly.

**(m3) The flow-state step function (Equation 13) is a simplification.**

The paper models the cost of developer waiting as a step function with a hard threshold at 120--180 seconds. In practice, the transition is likely sigmoidal rather than discontinuous. This simplification is acknowledged implicitly but not explicitly discussed. A brief note explaining why the step-function approximation is adequate for the model selection result would strengthen the argument.

**(m4) Unused bibliography entries.**

Several bibliography entries appear unused in the main text: `stigler1961`, `knuth1974`, `little1961`, `wirth1995`, `kuhn1955`, `cox1961`, `hassin2003`, `khintchine1932`, `waterfilling1968`, `vonneumann1947`, `kruchten1995`, `marshall1890`, `ross2023`, `anthropic2025claude`, `openai2025pricing`, `google2025pricing`. If these are not cited, they should be removed to avoid inflating the reference list.

**(m5) The `vanryzin1991` bibliography entry is misattributed.**

The entry is cited as `vanryzin1991` in the text (the $c\mu$ priority rule) but the actual author in the bib entry is "Van Mieghem, Jan A." and the year is 1995, not 1991. The key name does not match the actual reference. This should be corrected.

**(m6) Minor notation: the paper uses $\mathbf{r} > \mathbf{0}$ without defining this notation.**

It is clear from context that this means $r_k > 0$ for all $k$, but the notation should be defined explicitly, especially since the paper is otherwise careful with definitions.

**(m7) The abstract mentions "90--95% cache hit rates" but the body text (Section 8.2) attributes this specifically to Claude Code (Anthropic).**

The abstract presents it as a general figure, which is misleading. The abstract should either cite the source or qualify it as provider-specific.

**(m8) Sentence in line 472 uses a comma splice.**

"...a slower, frontier model for autonomous batch processing, the opposite of the naive..." should use a semicolon or period, or be restructured.

---

## 4. Specific Line-by-Line Issues

| Line(s) | Severity | Issue |
|----------|----------|-------|
| 72 (abstract) | MINOR | "3--5 tiers, 5--8 stages" should clarify these are the practical ranges, not the formal bounds |
| 167 | MINOR | "context rot" is attributed to `\citep{chroma2025rot}` which is a tech report from "Chroma Research"; verify this is a real, accessible source |
| 251 | MAJOR | Concavity proof parenthetical "($\log$ on $(0,1]$)" is misleading (see M1) |
| 291--298 | MAJOR | Weakest-Link theorem mixes EMR with AM-GM (see M2) |
| 339 | MINOR | The capability modifier $\gamma_k^{(i)}$ linearly scales quality: $q_k^{(i)}(r) = \gamma_k^{(i)} \cdot q_k(r)$. This multiplicative scaling means a model with $\gamma = 0.5$ on a stage where base quality is 0.9 yields effective quality 0.45. Is this calibrated against empirical model comparisons, or is it a modeling convenience? |
| 361--362 | MAJOR | NP-hardness proof sketch insufficient (see M6) |
| 438 | MINOR | The $c\mu$ rule citation `vanryzin1991` points to Van Mieghem 1995 (see m5) |
| 509--515 | MAJOR | Elasticity estimation under-supported (see M4) |
| 572 | MINOR | The claim "strict concavity of $V$ implying strict quasi-concavity of the ratio" needs more justification; strict quasi-concavity of $V(B)/B$ requires that $V''(B)B < 0$, which is verified in the appendix proof but not in the main text |
| 584 | MAJOR | Budget separation proof assumes finite $B^*_Q$ (see M5) |
| 596--599 | FATAL | Graceful degradation bound lacks proof (see F2) |
| 636 | MAJOR | Cache-First "theorem" is an empirical property, not a mathematical result (see M7) |

---

## 5. Questions for the Authors

1. **Stage correlations.** Have you considered a Bayesian network or graphical model for stage dependencies? The multiplicative independence assumption is the paper's biggest modeling gap. Even a simple two-stage correlated model (e.g., $Q = q_1(r_1) \cdot q_2(r_2, q_1)$) could show whether the EMR result degrades gracefully with correlation.

2. **Elasticity decomposition.** Can you decompose the $\epsilon \approx 1.19$ estimate into intensive and extensive margins? If the extensive margin dominates, the Jevons argument applies to the market but not to individual organizations (an organization that does not adopt new use cases will not experience Jevons-style demand expansion).

3. **Dynamic reallocation.** The paper acknowledges static optimization as a limitation. Have you explored whether the EMR condition can serve as a real-time rebalancing rule (analogous to portfolio rebalancing in finance)? The concavity of the objective suggests that gradient-based online updates would converge.

4. **Quality function validation.** Have you fit exponential saturation or Hill functions to actual pipeline stage data? The framework's practical value hinges on whether these parametric families capture real quality-vs-token curves. A single worked example with real data would substantially strengthen the paper.

5. **The 300x claim.** The abstract and Section 10 claim a "300x price reduction over three years" when caching is included. This appears to be a composite figure (roughly 10x from price cuts and roughly 30x from caching at 90%+ hit rates). Is this multiplicative composition justified? Caching was available (in some form) in 2023 as well; the net new caching benefit is likely less than 30x.

6. **Behavioral adoption.** Section 13 mentions behavioral barriers to adoption. Have you considered a simplified version of the framework (e.g., just the Cache-First principle + a two-tier model routing heuristic) that captures most of the value with minimal cognitive overhead? The gap between the formal optimum and "good-enough heuristics" is critical for adoption.

---

## 6. Missing Related Work

- **LLM cost estimation and prediction.** There is growing work on predicting LLM inference costs before execution (e.g., token count estimation, cost prediction models). This is relevant to the TBAP's practical feasibility, since the optimal allocation requires knowing quality functions before running the pipeline.

- **Mixture of Experts and sparse models.** MoE architectures change the cost structure (only a fraction of parameters are activated per token). The pricing implications of MoE are not discussed but are increasingly relevant as providers adopt sparse architectures.

- **Token-level budget control.** Some systems (e.g., OpenAI's `max_tokens` parameter, Anthropic's `max_tokens`) allow per-call token budget limits. The paper does not discuss how these API-level controls interact with the TBAP's stage-level allocations.

- **Multi-agent cost allocation.** Work on cost allocation in multi-agent systems (from cooperative game theory, Shapley values) is relevant to assigning cost responsibility across pipeline stages, which could inform the "raise the floor" principle.

- **Cloud cost optimization (FinOps) literature.** While the paper cites the FinOps Foundation survey, it does not engage with the substantial academic and practitioner literature on cloud cost optimization, spot pricing, reserved instances, etc. The token market has structural similarities to cloud compute markets.

---

## 7. Overall Assessment

The paper identifies a real and important gap: no existing AI coding agent harness includes a formal cost optimization layer. The formal framework is mostly correct and well-organized. The design principles are actionable. However, the paper has one fatal issue (the unproven graceful degradation bound) and several major issues (incomplete composition proof exposition, conflated Weakest-Link theorem, under-supported elasticity estimate, budget separation proof gap, Cache-First theorem framing, insufficient NP-hardness reduction, and unaddressed stage correlation impact). The contribution is primarily synthesis and application, which is valuable but must be done impeccably to justify publication; the current proof gaps and unsupported claims undermine that standard.

---

## 8. Recommendation

**Major Revision.**

The paper addresses a genuinely important problem with a well-structured formal approach. The fatal issue (F2) must be resolved by either proving the graceful degradation bound or removing it. The major issues (M1--M7) each require substantive revision. Most are fixable within a single revision cycle. The paper would benefit significantly from:

1. A worked example with real pipeline data validating the quality function assumptions.
2. A sensitivity analysis for the stage independence assumption.
3. A more rigorous elasticity estimate (or honest downgrading of the Jevons claim from "empirically confirmed" to "plausible but not established").
4. Clearer separation between formal theorems and empirical observations (especially the Cache-First principle).

With these revisions, the paper would make a solid contribution to the AI coding agent literature and to the emerging field of LLM cost engineering.

---

**Confidence:** 4/5 (high confidence in the formal assessment; moderate confidence in the empirical calibration assessment, as I do not have access to proprietary token consumption data).
