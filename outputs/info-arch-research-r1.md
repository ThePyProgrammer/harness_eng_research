# Information Theory & Formal Foundations for Context Selection in Coding Agents

## Research Report, Round 1

---

## 1. Shannon Information Theory Applied to Spec-to-Code Translation

### 1.1 Foundational Framework

Shannon's 1948 paper "A Mathematical Theory of Communication" (Bell System Technical Journal, Vol. 27, pp. 379-423, 623-656) established the entropy of a discrete source as:

```
H = -sum_i p(i) * log2(p(i))
```

where the sum runs over all symbols i with probability p(i), and the logarithm base 2 yields entropy in bits. Shannon defined the *bit* (binary digit, a term suggested by John Tukey) as the fundamental unit of information: the amount gained from learning the outcome of a fair coin flip.

For a communication channel with capacity C bits per second, Shannon's channel coding theorem (Theorem 11 in the 1948 paper) guarantees that reliable communication is possible at rates below C, and impossible above it. This establishes a hard information-theoretic floor on the bandwidth required to transmit any message, including a specification or a program.

### 1.2 The Entropy of Natural Language (Specifications)

Shannon (1951), "Prediction and Entropy of Printed English" (Bell System Technical Journal, Vol. 30, pp. 50-64), measured the entropy of English text using human prediction experiments:

| Condition | Entropy (bits/character) |
|-----------|-------------------------|
| First-order (independent letters) | 4.14 |
| Statistical effects up to 8 letters | ~2.3 |
| Full long-range context (100 chars) | **0.6 to 1.3** |

The 0.6-1.3 bits/character bound was obtained by having human subjects guess successive characters in text sequences, exploiting all statistical regularities they could perceive. This remains the canonical estimate of English entropy for over seven decades.

**Recent LLM-based measurements** (Bialek et al., "Large Language Models and the Entropy of English," arXiv:2512.24969, December 2025) used four models (OLMo 2 1B, Llama 3.2 1B, Qwen3 8B, DCLM 1.7B) to measure code length L(N) as a function of context length N. Key findings:

- At N=100 characters, results fall within Shannon's original bounds of 0.6-1.3 bits/char.
- At large context lengths (N > 10^3), the conditional entropy *continues to decrease* with no sign of a plateau up to approximately N = 10^4 characters.
- This suggests Shannon's estimate may have been an *upper bound*, and that the true entropy of English could be lower than 0.6 bits/char when long-range dependencies are fully exploited.
- Different text sources (C4 corpus, Wikipedia, poetry) showed qualitatively similar decay patterns, though poetry approached a genuine plateau faster.

### 1.3 The Entropy of Source Code

**Hindle et al. (ICSE 2012), "On the Naturalness of Software"** established the foundational measurement:

- **Java source code: 3-4 bits/token** (cross-entropy measured with smoothed trigram models)
- Cross-entropy declined rapidly with n-gram order, saturating around trigrams (n=3) or 4-grams
- The decline pattern was strikingly similar to that observed for English text corpora
- 10-fold cross-validation was used; cross-project entropy (training on one Java project, testing on another) was measured across 10 Java projects

The CACM 2016 expanded version noted that code is "roughly 8-16 times more predictable than English," though this comparison requires care because the token vocabularies differ (English words vs. code tokens).

**Hellendoorn and Devanbu (FSE 2017), "Are Deep Neural Networks the Best Choice for Modeling Source Code?"** refined these measurements:

| Model | Cross-entropy (bits/token) |
|-------|---------------------------|
| Nested cache (n-gram with scope) | 1.92 |
| Dynamic LSTM/300 | 3.93 |
| Combined best model | **1.25** |

The dramatic result: carefully adapted n-gram models with nested scope awareness *surpassed* LSTM-based deep learning models, achieving 1.25 bits/token, which is remarkably low. This suggests that code has substantial local structure that scope-aware statistical models can exploit effectively.

### 1.4 The Entropy Gap: Spec to Code

The spec-to-code translation problem can be framed information-theoretically as a *channel* where:

- **Input**: a natural language specification S with entropy H(S)
- **Output**: source code C with entropy H(C)
- **Translation**: requires generating H(C) - I(S;C) bits of information not present in the specification, where I(S;C) is the mutual information between spec and code

The **entropy gap** is the information that must be *invented* during code generation:

```
Gap = H(C) - I(S;C) = H(C|S)
```

This is the conditional entropy of the code given the specification: the information content of implementation decisions that are not determined by the spec. Concrete estimates:

- A typical specification might be 500 tokens at ~1 bit/token (English entropy) = ~500 bits of information
- The corresponding implementation might be 2000 tokens at ~2 bits/token (code entropy, using modern models) = ~4000 bits
- If the mutual information captures half the code's entropy, the gap is ~2000 bits of "implementation decisions" the model must resolve

These decisions include: choice of data structures, variable naming, error handling patterns, API selection, algorithmic details, and style conventions. Each is a point where the model must either *retrieve* the answer from context or *generate* it from its training distribution.

**Connection to Kolmogorov complexity**: The Kolmogorov complexity K(C) of a program C is the length of the shortest program that produces C. For source code, K(C) is related to but distinct from Shannon entropy; K(C) measures the incompressible information content of a specific program, while H measures the average over a distribution. Research on software reuse (Poulin, arXiv:cs/0508023) introduced an entropy parameter H in [0,1] for problem domains, where low-entropy domains yield highly similar programs amenable to component reuse, and high-entropy domains require substantial novel code.

---

## 2. Formal Properties of the Context Selection Problem

### 2.1 Problem Statement

Given:
- A finite context window of W tokens
- A codebase of total size T >> W tokens, decomposed into retrievable units (files, functions, classes, etc.) U = {u_1, u_2, ..., u_n}
- A coding task (query) q
- A task success probability P(success | C, q) for context subset C subset_of U
- A degradation function delta(|C|) capturing the empirically observed decrease in LLM performance as context grows

**Objective**: Select C* = argmax_{C : |C| <= W} P(success | C, q) - delta(|C|)

### 2.2 Reduction to Maximum Coverage / Submodular Maximization

The context selection problem is structurally analogous to the **maximum weighted coverage problem**, which is NP-hard. The reduction is as follows:

- Each retrievable unit u_i "covers" a set of information needs for task q
- The value of including u_i depends on what other units are already selected (diminishing returns: if u_j already provides similar information, u_i's marginal value decreases)
- The constraint |C| <= W is a cardinality (or more precisely, a knapsack) constraint since units have varying sizes

### 2.3 Submodularity Analysis

**Definition**: A set function f: 2^N -> R is *submodular* if for all A subset_of B subset_of N and element i not in B:

```
f(A union {i}) - f(A) >= f(B union {i}) - f(B)
```

This is the *diminishing returns* property. A function is *monotone* if f(A) <= f(B) whenever A subset_of B.

**Claim: The "information coverage" component of context selection is plausibly submodular.**

Arguments for submodularity:
1. **Redundancy**: Adding a file that overlaps with already-selected files provides less marginal information. If f(C) measures the total unique information relevant to q covered by C, this naturally satisfies diminishing returns.
2. **Facility location analogy**: The function f(S) = sum_i max_{j in S} sim(i,j) (where sim measures similarity between information need i and context unit j) is provably submodular (this is the facility location function, a standard submodular function).
3. **Lin and Bilmes (ACL 2011)** proved that a class of functions combining coverage and diversity for document summarization are monotone nondecreasing and submodular. Their formulation:

```
L(S) = alpha * sum_{i in V} min(sum_{j in S} w_{ij}, alpha_i * sum_{j in V} w_{ij})
    + (1 - alpha) * sum_{k} sum_{i in P_k} sqrt(sum_{j in S intersect P_k} w_{ij})
```

The first term rewards coverage (how well S represents the full document set V), and the second rewards diversity across partition clusters P_k. Both terms are submodular, and their weighted combination preserves submodularity.

**Complications that may break pure submodularity:**
1. **Dependency ordering**: In code, file A may only be useful if file B (which defines types used in A) is also included. This introduces *complementarity*, which violates submodularity.
2. **Coherence requirements**: A half-included module may be worse than no inclusion at all, introducing non-monotonicity.
3. **The degradation term delta(|C|)**: If delta is convex (performance degrades faster as context grows), then the net objective f(C) - delta(|C|) may not be submodular even if f is.

### 2.4 Approximation Guarantees

**Theorem (Nemhauser, Wolsey, Fisher, 1978)**: For a nondecreasing submodular function f with f(empty) = 0, subject to cardinality constraint |S| <= K, the greedy algorithm (iteratively adding the element with maximum marginal gain) produces a solution S_greedy satisfying:

```
f(S_greedy) >= (1 - ((K-1)/K)^K) * f(S_optimal)
```

As K -> infinity, this converges to:

```
f(S_greedy) >= (1 - 1/e) * f(S_optimal) approximately 0.632 * f(S_optimal)
```

This bound is **tight**: there exist submodular functions where the greedy algorithm achieves exactly this ratio and no better. Moreover, under standard complexity assumptions (P != NP), no polynomial-time algorithm can achieve a ratio better than (1 - 1/e + epsilon) for any constant epsilon > 0.

**For matroid constraints** (generalizing cardinality constraints): Calinescu, Chekuri, Pal, and Vondrak (2011) showed that a continuous greedy algorithm combined with pipage rounding achieves (1 - 1/e) approximation for monotone submodular maximization subject to a matroid constraint. This is relevant because the context selection constraint may be a partition matroid (e.g., at most k files from each module).

**For knapsack constraints** (varying unit sizes): The greedy algorithm still achieves (1 - 1/e) approximation for submodular maximization subject to a knapsack constraint, using a density-ordered greedy approach (marginal gain divided by cost).

### 2.5 Application to LLM Context Engineering

Jina AI (2025) explicitly formulated context engineering as submodular optimization, proposing:

- **Text selection**: Given a lengthy document and a token budget, select the subset of passages maximizing coverage of relevant information
- **Passage reranking**: Reorder candidate passages by relevance, then apply greedy submodular selection for diversity
- The lazy greedy algorithm (maintaining a priority queue of marginal gains, recomputing only when necessary) reduces practical complexity to O(nk log n) versus brute-force combinatorial search

**Sub-SA (arXiv:2407.05693)** applies submodular optimization to in-context learning example selection, combining a reward term (representativeness) with a penalty term (diversity) under a fixed annotation budget.

### 2.6 The Degradation Function delta(|C|)

Empirical evidence for context-length degradation is strong:

**Liu et al. (TACL 2024), "Lost in the Middle"**:
- Models exhibit a U-shaped performance curve; accuracy is highest when relevant information appears at the beginning or end of context, and drops 20-30+ percentage points when it is buried in the middle
- With 20 documents in context, GPT-3.5-Turbo's multi-document QA accuracy fell *below its closed-book performance*, meaning added context actively hurt the model
- The effect is not limited to weak models; even explicitly long-context models show significant degradation

**Context Discipline Study (arXiv:2601.11564)**:
- Tested Llama-3.1-70B, Qwen1.5-14B, Mixtral-8x7B across context lengths of 4K, 10K, and 15K words
- Llama-3.1-70B showed average degradation of 150% at 4K words, 446% at 10K, and 720% at 15K
- The relationship is described as "non-linear," following a "linear-quadratic trajectory typical of standard Transformer architectures"

**Attention dilution mechanism**: Transformer attention weights must sum to 1.0 across all tokens. In a 1K-token context, each token receives ~0.1% average attention; in a 100K-token context, each token receives ~0.001% average attention. Rotary Position Embedding (RoPE) introduces additional decay, creating systematic primacy and recency biases.

**Context-length-independent degradation**: Even when irrelevant tokens are replaced with whitespace (forcing the model to attend only to relevant content), performance still drops 13.9% as input length increases, suggesting the degradation is partly architectural, not purely an information retrieval problem.

A reasonable model for delta:

```
delta(|C|) = alpha * |C|^beta   where beta in [1, 2]
```

with the exponent reflecting the linear-to-quadratic trajectory observed empirically. The net objective then becomes:

```
max_{C : |C| <= W} f(C) - alpha * |C|^beta
```

This is a *regularized* submodular maximization problem. The penalty term makes the objective non-monotone, meaning standard greedy guarantees do not directly apply. However, algorithms for non-monotone submodular maximization (e.g., the double-greedy algorithm of Buchbinder et al., 2015) achieve 1/2 approximation guarantees.

---

## 3. Cross-Entropy Measurements: Source Code vs. Natural Language

### 3.1 Comparative Table

| Source | Measurement | Value | Model/Method | Citation |
|--------|------------|-------|--------------|----------|
| English text | Entropy per character | 4.14 bits | First-order (letter frequencies) | Shannon 1951 |
| English text | Entropy per character | ~2.3 bits | 8-letter context | Shannon 1951 |
| English text | Entropy per character | 0.6-1.3 bits | Full human prediction (100 chars) | Shannon 1951 |
| English text | Code length per character | < 0.6 bits (still decreasing) | LLMs at N > 10^4 context | Bialek et al. 2025 |
| English text (enwik8) | Bits per character | 0.99 | 24-layer Transformer-XL | Dai et al. 2019 |
| English text (text8) | Bits per character | 1.08 | Transformer-XL | Dai et al. 2019 |
| Java source code | Cross-entropy per token | 3-4 bits | Smoothed trigram | Hindle et al. 2012 |
| Source code (Java) | Cross-entropy per token | 1.92 bits | Nested cache n-gram | Hellendoorn & Devanbu 2017 |
| Source code (Java) | Cross-entropy per token | 3.93 bits | Dynamic LSTM/300 | Hellendoorn & Devanbu 2017 |
| Source code (Java) | Cross-entropy per token | **1.25 bits** | Combined best | Hellendoorn & Devanbu 2017 |

### 3.2 Interpreting the Comparison

**Critical caveat**: The units differ. Shannon measured *bits per character* for English; Hindle et al. measured *bits per token* for code. A code token (identifier, keyword, operator) carries more raw information than a single character. For a fair comparison:

- English at ~1 bit/character with average word length ~5 characters gives roughly ~5 bits/word
- Code at ~2-4 bits/token where tokens average ~4-6 characters gives roughly similar bits-per-character ratios
- Hindle et al.'s claim that code is "8-16x more predictable than English" refers to the per-token comparison, which is valid within the modeling framework but requires tokenization-aware interpretation

### 3.3 What the Numbers Mean for Coding Agents

The relatively low entropy of source code has direct implications:

1. **Code is highly predictable given local context.** At 1.25 bits/token (Hellendoorn & Devanbu's best), knowing the preceding tokens leaves very little uncertainty about the next token. This is why code completion works so well.

2. **The information content of "which code to write" is modest.** A 100-line function (~500 tokens) at 2 bits/token contains ~1000 bits of information, equivalent to ~125 bytes. The specification for that function, even if short (50 English words at ~10 bits/word), contains ~500 bits. The gap is only ~500 bits, a relatively small number of binary decisions.

3. **Context selection is high-leverage because code entropy is conditional.** The measured entropies above are conditional on local context. The *unconditional* entropy of code is much higher. This means providing the right context can dramatically reduce the uncertainty the model faces, while providing wrong or irrelevant context wastes the budget and invokes degradation penalties.

4. **The entropy continues to decrease with more context** (per the Bialek et al. 2025 finding for English, and plausibly even more so for code given its structured dependencies). This creates a genuine optimization problem: more context reduces per-token entropy but increases degradation. The optimum lies at a nontrivial interior point.

### 3.4 Structural Entropy of Generated Code

Recent work (arXiv:2508.14288, "Measuring LLM Code Generation Stability via Structural Entropy") extends entropy analysis to the *output distribution* of code generation:

- Pairs entropy with abstract syntax tree (AST) analysis
- Collects depth-bounded subtrees from generated ASTs and treats their relative frequencies as a probability distribution
- Low structural entropy indicates consistent outputs (the model confidently generates similar programs)
- High structural entropy indicates the model alternates between different programming structures

This connects directly to the spec-to-code entropy gap: when the specification underdetermines the implementation (high H(C|S)), the model's output distribution will have high structural entropy, manifesting as inconsistent generations across samples.

---

## 4. Synthesis: Toward a Formal Framework

### 4.1 The Information-Theoretic Context Selection Problem

Combining the three research threads, the context selection problem for a coding agent can be stated as:

**Given** a task q (specification) with information content I(q), a codebase with total information T_info, and a context window of W tokens:

1. **Estimate** the conditional entropy H(Code | q, C) for each candidate context set C
2. **Minimize** this conditional entropy (making the code maximally predictable given spec + context)
3. **Subject to** the constraint |C| <= W and the degradation penalty delta(|C|)

The optimal context is the one that maximizes the mutual information I(Code; C | q) between the context and the target code, conditioned on the specification, minus the degradation cost:

```
C* = argmax_{|C| <= W} [ I(Code; C | q) - delta(|C|) ]
```

### 4.2 Submodularity of Mutual Information

Mutual information I(X; S) where S is a subset of random variables is known to be submodular when the variables are jointly Gaussian (Krause and Guestrin, 2005). For code, the joint distribution is not Gaussian, but the diminishing-returns intuition holds: the first relevant file provides the most information gain; subsequent overlapping files provide progressively less.

### 4.3 Practical Implications

| Property | Implication for Harness Design |
|----------|-------------------------------|
| Code entropy is low (~1-4 bits/token) | Context selection has high leverage; the right context makes code nearly deterministic |
| Entropy gap H(C\|S) is finite and modest | The number of "decisions" a model must make is bounded; context should target those decision points |
| Context selection is (approximately) submodular | Greedy algorithms with (1-1/e) guarantees are applicable |
| Degradation delta(|C|) is superlinear | There exists an optimal context size strictly less than W; overfilling the window is actively harmful |
| Lost-in-the-middle effect | Context *ordering* matters, not just content; place high-value items at beginning and end |
| Mutual information is measurable | Can use LLM log-probabilities to empirically estimate I(Code; C \| q) and optimize context selection online |

---

## 5. Open Questions and Future Directions

1. **Empirical measurement of I(Code; C | q)**: No study has directly measured the mutual information between codebase context and generated code, conditioned on a specification. This is feasible using LLM log-probabilities and would provide the first empirical characterization of the context selection value function.

2. **Is the context selection function truly submodular for code?** The dependency structure of codebases (imports, type definitions, call graphs) introduces complementarities that may violate submodularity. Measuring the degree of violation would determine whether (1-1/e) guarantees hold in practice.

3. **Optimal delta characterization**: The degradation function needs more precise characterization across models and task types. Is it convex? Does it depend on the relevance of the context, or purely on length?

4. **The information bottleneck perspective**: The context window can be viewed as an information bottleneck (Tishby et al., 2000) between the full codebase and the generated code. The IB objective, minimizing I(C; Codebase) while maximizing I(C; Code), provides an alternative formalization that may yield tighter bounds.

5. **Tokenizer effects**: Different tokenizers produce different entropy measurements (arXiv:2601.09039). Bits-per-byte (BPB) as a tokenizer-agnostic metric would enable fairer cross-model and cross-language comparisons.

---

## References

1. Shannon, C.E. (1948). "A Mathematical Theory of Communication." Bell System Technical Journal, 27(3), 379-423; 27(4), 623-656.
2. Shannon, C.E. (1951). "Prediction and Entropy of Printed English." Bell System Technical Journal, 30(1), 50-64.
3. Hindle, A., Barr, E.T., Su, Z., Gabel, M., & Devanbu, P. (2012). "On the Naturalness of Software." ICSE 2012. [PDF](https://earlbarr.com/publications/naturalness.pdf)
4. Hindle, A., Barr, E.T., Gabel, M., Su, Z., & Devanbu, P. (2016). "On the Naturalness of Software." Communications of the ACM, 59(5).
5. Hellendoorn, V.J. & Devanbu, P. (2017). "Are Deep Neural Networks the Best Choice for Modeling Source Code?" FSE 2017, pp. 763-773. [Summary](https://ml4code.github.io/publications/hellendoorn2017deep/)
6. Nemhauser, G.L., Wolsey, L.A., & Fisher, M.L. (1978). "An Analysis of Approximations for Maximizing Submodular Set Functions--I." Mathematical Programming, 14(1), 265-294. [Springer](https://link.springer.com/article/10.1007/BF01588971)
7. Lin, H. & Bilmes, J. (2011). "A Class of Submodular Functions for Document Summarization." ACL-HLT 2011, pp. 510-520. [ACL Anthology](https://aclanthology.org/P11-1052/)
8. Calinescu, G., Chekuri, C., Pal, M., & Vondrak, J. (2011). "Maximizing a Monotone Submodular Function Subject to a Matroid Constraint." SIAM Journal on Computing, 40(6), 1740-1766.
9. Liu, N.F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2024). "Lost in the Middle: How Language Models Use Long Contexts." TACL 2024. [ACL Anthology](https://aclanthology.org/2024.tacl-1.9/)
10. Bialek, W. et al. (2025). "Large Language Models and the Entropy of English." arXiv:2512.24969. [arXiv](https://arxiv.org/abs/2512.24969)
11. Dai, Z. et al. (2019). "Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context." ACL 2019. [arXiv](https://arxiv.org/abs/1901.02860)
12. Chen, M. et al. (2021). "Evaluating Large Language Models Trained on Code." arXiv:2107.03374. [arXiv](https://arxiv.org/abs/2107.03374)
13. Poulin, J. (2005). "Software Libraries and Their Reuse: Entropy, Kolmogorov Complexity, and Zipf's Law." arXiv:cs/0508023. [arXiv](https://arxiv.org/abs/cs/0508023)
14. Jina AI (2025). "Submodular Optimization for Text Selection, Passage Reranking & Context Engineering." [Blog](https://jina.ai/news/submodular-optimization-for-text-selection-passage-reranking-context-engineering/)
15. Bielik, P., Raychev, V., & Vechev, M. (2016). "PHOG: Probabilistic Model for Code." ICML 2016. [PMLR](https://proceedings.mlr.press/v48/bielik16.html)
16. Context Discipline Study (2025). arXiv:2601.11564. [arXiv](https://arxiv.org/abs/2601.11564)
