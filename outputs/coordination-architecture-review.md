# Peer Review: Coordination Architecture for Multi-Agent Software Engineering

**Paper:** "Coordination Architecture for Multi-Agent Software Engineering: Error Amplification, Task Decomposition, and Quality-Adjusted Speedup"

**Reviewer:** Simulated adversarial peer reviewer

**Date:** 2026-04-03

**Recommendation:** Major revision

---

## Summary

The paper develops a formal framework for reasoning about coordination in multi-agent LLM-based software engineering systems. It synthesizes distributed systems theory (concurrency control, isolation levels), graph partitioning (Cheeger, METIS), reliability engineering (Amdahl extensions), and assume-guarantee contracts into a unified model. Four principal contributions are claimed: a corrected error amplification model, task decomposition as balanced min-cut, a five-level merge conflict PGM, and a Quality-Adjusted Speedup (QAS) metric. The paper is grounded in empirical data from Kim et al. (2025), DORA 2025, and Cursor (2026).

The paper is ambitious, well-structured, and intellectually honest about its epistemic status. The synthesis is genuinely useful. However, it has several significant issues that weaken the formal claims and empirical grounding.

---

## 1. Novelty and Significance

**Rating: Solid, but overclaimed in places**

The genuine contributions are:

1. The application of assume-guarantee contracts to multi-agent code generation is novel and practically useful. The composition theorem (Theorem 5.1/Thm. Composition) is the strongest formal result in the paper.

2. The QAS metric is a meaningful conceptual contribution. Demonstrating regimes where QAS < 1 is valuable for the practitioner audience.

3. The Conway's Law graph-containment formalization is elegant and, to my knowledge, new.

4. The Cut-Conflict Bridge lemma connecting partition quality to conflict rate is a useful conceptual link, even if the formal content is thin.

However:

- **MAJOR [M1].** The error amplification model (Theorem 3.1 / Thm. error-amp) is presented as a "corrected" version of a prior claim, but the correction amounts to observing that the binomial expansion gives $A_e = k - \binom{k}{2}\epsilon + O(\epsilon^2)$. This is elementary probability; the "correction" is of a strawman (the original incorrect claim $A_e \geq k$ is the paper's own R1 draft, not a claim from the literature). Presenting the correction of one's own earlier error as a contribution inflates the novelty.

- **MINOR [m1].** The mapping of database isolation levels to agent mechanisms (Section 6 / Sec. concurrency) is a useful pedagogical device but not formally novel. The observation that git worktrees provide snapshot isolation is well-known in the version control literature. The paper should acknowledge this more clearly.

---

## 2. Formal Rigor

### 2.1 Theorem 3.1 (Error Amplification, Corrected)

**Rating: Sound**

The proof is correct. The binomial expansion, monotonicity via the derivative, and the asymptotic are all standard. The full proof in Appendix A is clean and complete.

**MINOR [m2].** The expansion in Equation (3) uses $O(\epsilon^2)$ to absorb all higher-order terms. This is fine for the asymptotic, but the paper also uses $k - \binom{k}{2}\epsilon$ as a numerical approximation at $\epsilon = 0.3$. At this error rate, the $O(\epsilon^2)$ terms are not negligible (e.g., $\binom{5}{3}(0.3)^2 = 0.9$). The paper should note that the two-term expansion is inaccurate for the "practical error rates" of $\epsilon \approx 0.2$-$0.3$ it discusses, or provide the exact formula throughout.

### 2.2 Composition Theorem (Theorem 5.5 / Thm. composition)

**Rating: Sound with a significant caveat**

The rely-guarantee proof is correct for the stated assumptions. The circular discharge (Step 2) is the key step and is handled properly.

**MAJOR [M2].** The theorem assumes that G3 (each agent's modifications compile and pass tests scoped to $F_i$) holds in isolation against the snapshot. The proof then invokes "compositionality of type checking" to conclude the merged result compiles. This compositionality property is stated without proof and is not universally true.

Specifically, compositionality of type checking requires that the type system is modular (i.e., separate compilation is sound). This holds for languages with proper module systems (e.g., Java, Rust), but not for languages with implicit dependencies (e.g., Python with duck typing, JavaScript with dynamic imports, C with header inclusion). Since multi-agent coding tools frequently target Python and JavaScript, the theorem's applicability is narrower than presented.

The paper should either:
(a) add a language restriction to the theorem statement (e.g., "for languages with sound separate compilation"), or
(b) weaken Claim 3 to "the merged codebase type-checks at all statically-typed call sites."

### 2.3 Cut-Conflict Bridge Lemma (Lemma 4.5 / Lem. bridge)

**Rating: Weak**

**MAJOR [M3].** This lemma is central to the paper's thesis (partition quality determines conflict rate), but its formal content is almost vacuous. It states that conflict probability is bounded by $\alpha \cdot W_{\text{cut}}$, where $\alpha$ is "some constant $> 0$ that depends on the coupling-to-conflict conversion rate." The proof sketch says the bound holds "by construction of the composite coupling metric." This is a tautology: the lemma says conflicts are bounded by a calibrated coupling metric, and the proof says the metric is calibrated to predict conflicts.

For this to be a real result, one would need:
(a) an independent definition of coupling weight $w(u,v)$ (e.g., from static analysis or co-change history), and
(b) an empirical or theoretical bound on $\alpha$ that relates this independent metric to observed conflict rates.

The paper acknowledges that $\alpha$ is uncalibrated for agent-generated code (line 372), but this admission weakens the entire Section 4 (Task Decomposition) chain of reasoning. Without a calibrated $\alpha$, Theorem 4.7 (Decomposition Quality Bounds Conflict Rate) is formally correct but empirically meaningless: it says conflicts are bounded by $\beta$ times an unknown quantity.

### 2.4 QAS Calibration Arithmetic

**Rating: Arithmetic is correct; interpretation is problematic**

**MAJOR [M4].** The QAS calibration against Kim et al. data (Section 8.4) computes $d(k)_{\text{indep}} = \min(1, 17.2 \times 0.20) = 1.0$. This treats the error amplification factor as a direct multiplier on the defect rate, i.e., $d(k) = A_e \cdot d(1)$.

But $A_e$ is defined (Definition 2.2) as the ratio of system error probability to single-agent error probability: $A_e = (1 - R_{\text{sys}}) / \epsilon$. This is not the same as the defect-rate multiplier. The system error probability is the probability that *at least one* agent produces an error; the defect rate is the fraction of delivered features containing defects. These are different quantities unless every system error produces exactly one defect and every defect is delivered.

In practice, a system error (one agent's output is wrong) may be caught by testing, review, or the merge process, and not delivered as a defect. Conversely, a single system error may produce multiple defects if the erroneous output is integrated into other agents' work.

The equation $d(k) = A_e \cdot d(1)$ conflates error probability with defect rate. This makes the QAS = 0 result for independent agents too pessimistic (the min-clamp to 1.0 is a consequence of this conflation, not of the actual system behavior). The paper should either:
(a) define a separate defect-rate amplification model that accounts for error detection and filtering, or
(b) explicitly state the assumption that all errors become delivered defects and acknowledge this as a worst-case bound.

### 2.5 Achievability Bound (Theorem 5.8 / Thm. achievability)

**Rating: Formally correct; union bound is loose**

**MINOR [m3].** The union bound $P(\text{weak correct}) \geq 1 - (1-\gamma)\rho\binom{k}{2}(1-d_5)$ counts each potential conflict site independently. For $k = 10$ agents with $\gamma = 0.5$, this gives $P \geq 1 - 0.5 \times 0.15 \times 45 \times 0.25 = 1 - 0.844 = 0.156$, which is a near-useless bound. The union bound becomes vacuous (negative probability) well before reaching team sizes that the paper discusses as practical.

The paper should note the regime where the bound becomes vacuous and discuss tighter alternatives (e.g., Bonferroni-type corrections or explicit correlation modeling).

### 2.6 Optimal Agent Count Derivation (Theorem 3.3 / Thm. nstar)

**Rating: Sound for the approximation regime; presentation issue**

**MINOR [m4].** The proof derives $n^* \approx 1/\sqrt{\delta}$ by assuming "small $s$." But the intermediate step from $(1-s)/(n^2 s + n(1-s)) = \delta$ to $1/n^2 \approx \delta$ requires not just small $s$ but also $n \gg (1-s)/s$, which for small $s$ means $n$ must be very large, contradicting the result $n^* \approx 4$. The approximation is actually valid when $n^2 s \ll n(1-s)$, i.e., $ns \ll 1$, which for $s = 0.1$ and $n = 4$ gives $0.4 \ll 1$, which is marginal.

The paper should verify the approximation numerically for the parameter values it discusses (e.g., $s = 0.1$, $\delta = 0.05$) and report the exact $n^*$ alongside the approximation.

---

## 3. Empirical Grounding

**MAJOR [M5].** The paper relies heavily on Kim et al. (2025), which is a preprint (arXiv:2512.08296). The 180-configuration study is comprehensive, but the confidence intervals are only reported for two of the four architecture types (Independent and Centralized). Decentralized and Hybrid lack CIs. The paper should flag which of its calibrations rest on point estimates without uncertainty quantification.

**MAJOR [M6].** The DORA 2025 data is from a survey of ~5,000 professionals supplemented by telemetry from 10,000+ developers. The paper uses this data to calibrate QAS, but the DORA report measures *human developers assisted by AI tools*, not *multi-agent LLM systems operating autonomously*. The paper acknowledges this partially ("treating AI-assisted development as a form of agent parallelism" in R3, Section 4.3), but the tex file does not clearly flag this gap. The DORA QAS calibration is measuring a fundamentally different thing from the multi-agent QAS the paper defines.

**MINOR [m5].** The Cursor (2026) citation is a blog post, not a peer-reviewed source. The claim that "a flat coordination model with 20 agents collapsed to effective throughput of 2 to 3 agents due to lock contention" is a powerful motivating observation, but its reliability depends on how precisely Cursor reported their metrics. The paper should note this as practitioner evidence, not empirical data.

**MINOR [m6].** The Lesenich et al. (2017) reference for the 26x bug multiplier is cited indirectly ("via Accioly et al., 2018" in the research notes; "Lesenich et al." in the tex tables). The original citation is missing from the bibliography (coord-main.bib). This is a critical empirical claim used in Corollary 5.4 (Contract Value) and should be properly cited.

---

## 4. Logical Gaps and Unsupported Claims

**MAJOR [M7].** The "fundamental inequality" presented in Section 11.1:

$$S_{\text{eff}} = \frac{n}{1 + \sigma(n-1) + \kappa n(n-1)} \cdot (1-\delta)^n \cdot (1 - \alpha W_{\text{cut}})$$

is never derived. The first two factors come from Section 3 (USL + reliability). The third factor $(1 - \alpha W_{\text{cut}})$ appears to be a probability of successful integration, but its relationship to the PGM in Section 5 is not formalized. Specifically:

- The PGM gives conflict *count* as $\alpha W_{\text{cut}}$ (Lemma bridge), not a probability. For the third factor to be a probability, $\alpha W_{\text{cut}}$ must be in $[0,1]$, which is not guaranteed and not verified for any realistic parameter values.
- The multiplicative combination of USL throughput, reliability, and integration success assumes independence of these three factors. But errors (factor 2) and conflicts (factor 3) are correlated: errors by one agent can cause conflicts with others.

The paper should either derive this inequality rigorously or present it as a heuristic model, not as the "central result."

**MAJOR [M8].** The phase transition conjecture (Conjecture 3.5) claims a "sharp" transition. The Kim et al. regression model gives a smooth interaction coefficient ($\beta = -0.408$), which does not imply a sharp transition. A phase transition in the physics sense requires a discontinuity or divergence in some order parameter or its derivative. The conjecture as stated is about the sign change of a partial derivative, which is a crossover, not a phase transition. The percolation analogy is suggestive but not justified.

**MINOR [m7].** The paper states that contracts act as "static communication channels" (Section 7, end). This is a useful metaphor but is somewhat misleading: contracts convey information about interfaces, not about the content of changes. An agent modifying a function body in a way that changes its semantics (without changing its signature) would satisfy the contract while violating the other agent's behavioral assumptions. The paper should distinguish interface-level contracts from behavioral contracts more carefully.

---

## 5. Missing Related Work

**MAJOR [M9].** The paper omits several relevant lines of work:

1. **Fekete et al. (2005), "Making Snapshot Isolation Serializable"** is referenced in R2 but missing from the paper's bibliography and discussion. This is directly relevant to Section 6, which discusses how to close the gap from snapshot isolation to serializability. The paper's contracts are essentially the agent analogue of Fekete's promotion technique.

2. **Herlihy and Wing (1990), "Linearizability"** is referenced in R2 (Section 4.1) as the basis for the strong correctness definition, but missing from the bibliography. The paper cites Herlihy (1991) for wait-free synchronization, which is a different paper.

3. **Chatterjee et al. (2025) or similar recent work on LLM-agent coordination protocols.** The multi-agent LLM coordination space has produced several concurrent papers in 2025-2026 that this paper does not engage with.

**MINOR [m8].** The paper cites McKinney (2026) "The Mythical Agent-Month" but does not engage with it substantively beyond a one-line mention. Given that the paper's Extended Amdahl's Law directly formalizes McKinney's argument, a more thorough comparison would strengthen the positioning.

---

## 6. Style Compliance

**No em dashes found.** The paper uses commas, semicolons, colons, and parentheses throughout. Compliant.

**Epistemic status markers.** All theorems, definitions, lemmas, and conjectures carry epistemic markers (\established{}, \synthesis{}, \conjectured{}). The Conjecture is correctly marked. Compliant.

**Honest framing.** The paper is explicit about being a "theory and position paper" without new experiments. The verification roadmap (Section 11.2) is unusually honest for this genre. Compliant and commendable.

**MINOR [m9].** Some notation inconsistency: the variable $\alpha$ is used for three different things: (1) the coupling-to-conflict conversion rate in Lemma bridge, (2) the module-to-agent assignment function in Section 7, and (3) the coupling growth rate in Section 9.2. While context disambiguates, this overloading is confusing in a paper with a formal notation table. The notation table in Appendix B only lists one meaning.

**MINOR [m10].** The paper uses "3 to 5 agents" and "3-5 agents" inconsistently. Pick one convention.

---

## 7. Mathematical Errors

### 7.1 Amdahl Extension

**No errors found.** The extension $S_{\text{eff}} = S(n) \cdot (1-\delta)^n$ is correctly stated and the optimal $n^*$ derivation is algebraically correct (subject to the approximation regime noted in [m4]).

### 7.2 PGM Factoring

**MINOR [m11].** The PGM (Definition 5.1) assumes pairwise conditional independence of conflicts given diffs. The paper acknowledges this limitation in R1 Section 7.3 and briefly in the tex. However, the specific consequence is underexplored: if agent $A_i$ modifies a widely-imported utility file, its diff creates correlated conflicts with *all* other agents. This violates pairwise independence and could cause the actual conflict count to exceed the PGM prediction by a factor proportional to the graph's maximum degree. The paper should quantify this deviation or at least bound it.

### 7.3 QAS Calibration Arithmetic

The DORA QAS arithmetic (Section 8.3) is checked:
- $1.98 \times (0.9455 / 0.95) = 1.98 \times 0.9953 = 1.97$. **Correct.**

The Kim et al. calibration (Section 8.4):
- $d(k)_{\text{central}} = \min(1, 4.4 \times 0.20) = 0.88$. **Correct arithmetically**, but see [M4] for the conceptual issue.
- $\text{QAS}_{\text{central}} = S(k) \times (1 - 0.88)/(1 - 0.20) = S(k) \times 0.12/0.80 = S(k) \times 0.15$. **Correct.**

### 7.4 Cheeger Corollary

**MINOR [m12].** Corollary 4.3 in R1 (not reproduced verbatim in the tex) states that spectral partitioning achieves conductance "at most $2\sqrt{\phi^*}$" by chaining both sides of Cheeger. The derivation says: spectral cut has conductance $\leq \sqrt{2\lambda_2}$, and $\lambda_2 \leq 2\phi^*$ (from the left Cheeger bound), so conductance $\leq \sqrt{2 \cdot 2\phi^*} = 2\sqrt{\phi^*}$. This is correct. The tex file's presentation (Theorem cheeger) avoids this derivation and simply states the Cheeger bounds, which is fine.

### 7.5 Coordination Benefit Calibration

The computation $4.4/17.2 \approx 0.256$ and $\alpha \cdot I(\text{central}) \approx -\ln(0.256) \approx 1.36$ nats. **Correct.** ($-\ln(0.256) = 1.362$.)

### 7.6 Sensitivity Analysis Numbers

For $k=5$, $p_c = 0.10$: $R(5) = 0.9^{10}$.
$0.9^{10} = 0.34868...$, reported as 0.349. **Correct.**

For $k=5$, $p_c = 0.20$: $R(5) = 0.8^{10}$.
$0.8^{10} = 0.10737...$, reported as 0.107. **Correct.**

$G(5) = 5 \times 0.107 \times 0.95 = 0.508$. **Correct.**

For $k=3$, $p_c = 0.15$: $R(3) = 0.85^3$.
$0.85^3 = 0.614125$, reported as 0.614. **Correct.**

$G(3) = 3 \times 0.614 \times 0.95 = 1.7499$, reported as 1.75. **Correct.**

### 7.7 Partition Half-Life

$\mathbb{E}[\tau_{1/2}] = (0.5 - 0.1) / (0.01 \times 0.2) = 0.4 / 0.002 = 200$. **Correct.**
$\mathbb{E}[\tau_{1/2}] = 0.4 / (0.01 \times 0.6) = 0.4 / 0.006 = 66.67 \approx 67$. **Correct.**

---

## 8. Issue Summary

### FATAL Issues

None. The paper has no results that are provably wrong. Its issues are in overclaiming, conceptual conflation, and under-specification.

### MAJOR Issues

| ID | Issue | Section | Fix |
|----|-------|---------|-----|
| M1 | "Corrected" error amplification is correction of own draft, not literature | Sec. 3 | Reframe: present as an observation about the independent model's inadequacy, not as a correction |
| M2 | Composition theorem assumes compositionality of type checking without restriction | Sec. 6 / App. A | Add language restriction or weaken Claim 3 |
| M3 | Cut-Conflict Bridge lemma is near-tautological without calibrated $\alpha$ | Sec. 4.6 | Acknowledge explicitly; frame as a modeling assumption, not a lemma |
| M4 | QAS calibration conflates error probability with defect rate | Sec. 8.4 | Define defect-rate amplification model or state worst-case assumption |
| M5 | Selective CI reporting from Kim et al.; two of four architectures lack CIs | Sec. 9 tables | Flag which calibrations are point estimates |
| M6 | DORA data measures human+AI, not autonomous multi-agent; conflated in QAS calibration | Sec. 8.3 | Add clear caveat; label as analogy, not calibration |
| M7 | Fundamental inequality is not derived; multiplicative independence assumed without justification | Sec. 11.1 | Derive rigorously or label as heuristic |
| M8 | Phase transition conjecture is a crossover, not a phase transition | Sec. 3.3 | Weaken claim to "crossover" or justify the sharp-transition claim |
| M9 | Missing related work: Fekete et al. (2005), Herlihy & Wing (1990) | Sec. 10 | Add citations; engage with Fekete's serializable snapshot isolation |

### MINOR Issues

| ID | Issue | Section |
|----|-------|---------|
| m1 | Git worktrees as snapshot isolation is known; acknowledge prior art | Sec. 6 |
| m2 | Two-term expansion inaccurate at practical $\epsilon$ values | Sec. 3 |
| m3 | Union bound becomes vacuous for modest $k$ and $\gamma$ | Sec. 6.6 |
| m4 | $n^*$ approximation marginally valid at stated parameter values | Sec. 3 / App. A |
| m5 | Cursor citation is a blog post, not peer-reviewed | Sec. 1 |
| m6 | Lesenich et al. (2017) missing from bibliography | Bibliography |
| m7 | "Static communication channel" metaphor conflates interface and behavioral contracts | Sec. 7 |
| m8 | McKinney (2026) deserves more substantive engagement | Sec. 10 |
| m9 | $\alpha$ overloaded for three different meanings | Notation / App. B |
| m10 | Inconsistent use of "3 to 5" vs "3-5" | Throughout |
| m11 | PGM pairwise independence violated by hub files; deviation unquantified | Sec. 5 |
| m12 | Cheeger corollary derivation in R1 is correct but omitted from tex (fine, just noting) | Sec. 4.3 |

---

## 9. Verdict

This is a strong theory/position paper that synthesizes distributed systems concepts into a useful framework for multi-agent software engineering. The core ideas (contracts reduce conflict scaling, QAS can be negative, partition quality matters) are sound and important. The formal presentation is generally clean, and the epistemic honesty is well above average for this genre.

However, the paper overclaims in several areas: the "fundamental inequality" is heuristic rather than derived; the Cut-Conflict Bridge lemma is near-vacuous without calibration; the QAS calibration conflates distinct quantities; and the phase transition language is too strong for what the evidence supports. The composition theorem needs a language restriction.

After addressing the MAJOR issues (most of which require reframing and caveating rather than new results), this would be a publishable paper at a software engineering venue (ICSE, FSE, ASE) or a formal methods venue interested in agent systems.

**Recommendation: Major revision.** Address M1-M9. The MINOR issues are quality-of-life improvements that would strengthen the paper but are not blockers.
