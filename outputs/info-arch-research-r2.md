# Context Degradation and Long-Context LLM Behavior

## Research Dimension: Empirical Patterns of Information Loss in Extended Context Windows

---

## 1. The "Lost in the Middle" Effect

### Source: Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (TACL 2024)

Nelson F. Liu, Kevin Lin, John Hewitt, Ashwin Paranjape, Michele Bevilacqua, Fabio Petroni, and Percy Liang (Stanford, Sapienza University of Rome) published a landmark study measuring how LLMs use information at different positions within their context window. The paper appeared in Transactions of the Association for Computational Linguistics, Volume 12, 2024, pages 157-173.

### Experimental Setup

The study used two primary tasks:
- **Multi-document question answering**: placing the answer-containing document at different positions among 10, 20, or 30 total documents.
- **Key-value retrieval**: a synthetic task requiring exact lookup of a value given a key, embedded among many key-value pairs.

Models tested included GPT-3.5-Turbo, GPT-4, Claude 1.3, MPT-30B-Instruct, and LLaMA-2 variants.

### Core Results: The U-Shaped Curve

Performance follows a characteristic U-shaped curve based on the position of relevant information:

| Position (20-doc context) | Approximate Accuracy |
|---|---|
| Position 1 (beginning) | ~75% |
| Position 5 | ~62% |
| Position 10 (middle) | ~55% |
| Position 15 | ~63% |
| Position 20 (end) | ~72% |

Key numerical findings:
- **30%+ accuracy drop** when the answer document moves from position 1 to position 10 in a 20-document context.
- GPT-3.5-Turbo's performance on multi-document QA with information in the middle was **lower than its closed-book performance** (i.e., answering without any documents at all; 56.1% closed-book baseline). The model was actively harmed by providing context.
- The effect holds for **all models tested**, including those explicitly designed and trained for long contexts.

### Position Bias Dynamics

- **Primacy bias**: strong preference for information at the very beginning of the context.
- **Recency bias**: secondary preference for information at the end.
- As context length increases, the primacy effect tends to dominate, potentially masking the recency effect entirely. Short contexts show clear recency; long contexts shift toward primacy dominance.
- These patterns are strikingly similar to the **serial position effect** in human memory research (Ebbinghaus, 1885), where people preferentially recall items from the beginning and end of a study list.

### Implications

The "lost in the middle" effect means that simply having a large context window is insufficient. The *position* of information within that window matters as much as whether the information is present at all.

---

## 2. Chroma Research: "Context Rot" (2025)

### Source: Hong, Kelly; Troynikov, Anton; Huber, Jeff. "Context Rot: How Increasing Input Tokens Impacts LLM Performance." Chroma Research, July 2025.

The Chroma team conducted the most comprehensive systematic study of context degradation across frontier models to date, testing 18 models across multiple task types.

### Models Tested (18 total)

| Provider | Models |
|---|---|
| Anthropic | Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7, Claude Sonnet 3.5, Claude Haiku 3.5 |
| OpenAI | o3, GPT-4.1, GPT-4.1 mini, GPT-4.1 nano, GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo |
| Google | Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.0 Flash |
| Alibaba | Qwen3-235B-A22B, Qwen3-32B, Qwen3-8B |

### Universal Degradation Finding

**Every single one of the 18 frontier models exhibited performance degradation as input length increased.** Not some, not most; all of them. This is the study's central empirical claim.

### Shape of the Degradation Function

The degradation is:
- **Monotonic but non-linear**: performance declines at every increment, not just near the limit.
- **Early-onset**: a 1M-token context window still shows degradation at 50K tokens. Models rot well before their advertised limits.
- **Task-dependent in magnitude**: simple lexical matching degrades less steeply than semantic reasoning tasks.
- **Compounded by distractors**: adding semantically similar but irrelevant content causes degradation beyond what context length alone explains. A single distractor reduces performance; four distractors compound the degradation.

### Model-Specific Behaviors

- **Claude models**: strong performance until approximately 8,000 words, then degradation begins. More conservative responses, higher abstention rates under ambiguity. Claude Opus refused tasks around 2,500 words in some configurations.
- **GPT models**: GPT-3.5 Turbo showed a 60.29% refusal rate. GPT-4.1 refusal rate was 2.55%. GPT models had the highest hallucination rates overall.
- **Gemini models**: errors spiked between 500-750 words. Random word generation emerged at these thresholds. Showed the "wildest swings" in performance.
- **Qwen models**: smaller versions degraded around 5,000 words; larger models sustained longer.

### Counterintuitive Finding

Models performed better with **shuffled (incoherent) haystacks** than with logically structured ones. This was consistent across all 18 models. Coherent, structured context is paradoxically harder for models to process; the structure itself creates additional confounding signals.

### Experimental Scale

- Total API calls: 194,480
- Overall non-attempt rate: 69/194,480 (0.035%)
- LongMemEval input length: ~113,000 tokens (full) vs. ~300 tokens (focused)
- LLM judge alignment: >99% agreement with human judgment

### No Consistent Winner

No single model ranked first across all experiments. Performance was "all over the place" and highly task-dependent. Claude Sonnet 4 was best on the repeated words task; GPT-4.1 was the top performer on the Needle in a Haystack task.

---

## 3. Attention Patterns and Structural Information Loss

### 3.1 The Attention Sink Phenomenon

**Source**: Xiao, Guangxuan et al., "Efficient Streaming Language Models with Attention Sinks." ICLR 2024 (MIT, Meta AI, CMU, NVIDIA).

The first few tokens in any sequence receive disproportionately large attention scores, regardless of their semantic importance. This "attention sink" is a structural artifact of the softmax function, which forces attention scores to sum to 1.0 across all tokens.

**Quantitative findings** (measured on Llama-2 family, 4096-token sequences):

| Configuration | Perplexity (Llama-2-13B) |
|---|---|
| Window attention without initial tokens (0+1024) | **5158.07** (catastrophic) |
| With 4 initial tokens retained (4+1020) | **5.40** (near-normal) |
| Initial tokens replaced with linebreak chars (4"\\n"+1020) | **5.60** (still works) |

Key observations:
- The 4096th token allocates attention to the initial token that **often exceeds half of the total attention** in most layers (except the two lowest layers).
- Removing the first 4 tokens causes perplexity to explode by ~1000x.
- **4 initial "sink" tokens are sufficient** for recovery; 1-2 are insufficient, 8 provides only marginal improvement over 4.
- The semantic content of sink tokens is irrelevant; even linebreak characters suffice. The model needs the *positions*, not the *content*.

### 3.2 Softmax Attention Dilution

As sequence length increases, the softmax function's normalization creates a fundamental pathology:

- At 10K tokens: 100 million pairwise attention relationships
- At 100K tokens: 10 billion pairwise relationships
- At 1M tokens: 1 trillion pairwise relationships

The probability mass must be distributed across all tokens. As context grows, attention weights converge toward a uniform distribution, causing:
- **Representational collapse**: token representations become increasingly indistinguishable.
- **Rank collapse**: attention scores collapse toward uniformity, causing tokens to cluster excessively.
- **Gradient dilution**: gradient paths grow as O(nL), causing exponential signal dilution through layers.

### 3.3 Is This Fixable by Training or Architecture?

The answer is: partially by architecture, minimally by training alone.

**Training-based approaches** (limited effectiveness):
- Fine-tuning on longer sequences helps but does not eliminate the U-shaped curve.
- Recurrent memory transformers, after fine-tuning, demonstrated the highest BABILong performance, processing up to 50 million tokens.

**Architectural approaches** (more promising):

| Approach | Mechanism | Status |
|---|---|---|
| Scalable-Softmax (Nakanishi, 2025) | Log(n) scaling of logits during training | Promising; controls dispersion without post-training adaptation |
| InfoScale (Li et al., 2025) | Entropy-invariance-derived scaling rules | Research stage |
| alpha-entmax (adaptive sparse attention) | Assigns exact zeros to irrelevant tokens via alpha-entmax | Theoretically sound; maintains bounded normalized entropy as sequence length grows (softmax fundamentally lacks this property) |
| Core Context Aware (CCA) attention | Globality-aware pooling + locality-preserving windowed attention | 3-6x speedups, near-linear complexity |
| Infini-attention (Google, 2024) | Compressive memory with incremental updates in recurrent fashion | Avoids discarding old segments |

The core insight: softmax attention has a **fundamental mathematical limitation** for long contexts. The normalization constraint means entropy necessarily increases with sequence length. Sparse attention methods (alpha-entmax) avoid this by allowing exact zeros, maintaining bounded entropy regardless of sequence length. This is an architectural fix, not a training fix.

---

## 4. Empirical Context Length vs. Task Performance

### 4.1 Needle in a Haystack Results

**Greg Kamradt's tests** (November 2023, widely replicated):

**GPT-4 (128K context)**:
- Recall performance started degrading above 73K tokens.
- Low recall was correlated with needle placement at 7%-50% document depth.
- Performance at context limits was substantially worse than at shorter contexts.

**Claude 2.1 (200K context)**:
- Initial testing: **27% overall retrieval accuracy** (before prompt engineering).
- After prompt adjustment (adding "Here is the most relevant sentence in the context:"): accuracy improved to **98%**.
- Facts at the very top and very bottom: nearly 100% accuracy.
- Starting at ~90K tokens, bottom-of-document recall deteriorated.

**Gemini 1.5 Pro (1M context)**:
- **>99.7% recall** up to 1 million tokens on single-needle retrieval.
- **99.2% recall** at 10 million tokens.
- Outperformed GPT-4 on 100-needle multi-needle retrieval in a single turn.

### 4.2 RULER Benchmark (NVIDIA, COLM 2024)

RULER extends needle-in-a-haystack with 13 task configurations across four categories: multi-needle retrieval, multi-hop tracing, aggregation, and question answering.

Key finding: **only about half of models claiming 32K+ context maintained satisfactory performance** at that length on multi-hop reasoning tasks. Effective capacity is typically **60-70% of the advertised maximum**.

Specific model results:
- GPT-4 scored 79.7% on word extraction, 59.0% on QA tasks (despite near-perfect vanilla NIAH scores).
- Claude Opus 4.6 scored **76% on 8-needle MRCR v2 at 1M tokens** (vs. Claude Sonnet 4.5's 18.5%; a 4x improvement).

### 4.3 BABILong Benchmark (NeurIPS 2024)

The BABILong benchmark uses 20 reasoning tasks embedded in long documents.

Central finding: **popular LLMs effectively utilize only 10-20% of their context window**, with performance declining sharply as reasoning complexity increases. Even GPT-4 (128K claimed context) experiences degradation beyond 10% of its input capacity (~12.8K tokens).

RAG-based approaches achieved only ~60% accuracy on single-fact QA, independent of context length.

### 4.4 "Context Length Alone Hurts" (Du et al., EMNLP 2025)

This study isolates context length as a variable by testing with whitespace padding and masked tokens.

**Degradation range across all models and tasks: 13.9% to 85%**, even with perfect retrieval.

| Model | Task | Degradation at 30K tokens |
|---|---|---|
| Llama-3.1-8B | Variable Summation | 59% drop (from 96% baseline) |
| Llama-3.1-8B | HumanEval | 47.6% drop |
| Llama-3.1-8B | MMLU | 24.2% drop |
| Mistral-v0.3-7B | Variable Summation | 66% drop (from 68% baseline) |
| Mistral-v0.3-7B | GSM8K | 34.2% drop |
| Mistral-v0.3-7B | HumanEval | 34.8% drop |
| GPT-4o | MMLU | 41.7% drop at 7.5K tokens |
| Claude-3.5 | MMLU | 67.6% drop at 30K tokens |

**Critical finding on retrieval vs. reasoning**: retrieval scores dropped by only 8% and 2% on Variable Summation, yet accuracy dropped 59% and 44%. The models could *find* the information but could not *use* it. Context length degrades reasoning independently of retrieval.

**Whitespace experiment**: replacing all distractor tokens with whitespace still caused substantial drops (Llama: 48% on Variable Summation; Mistral: 30% on GSM8K at 30K whitespace tokens). Even non-informative padding hurts performance.

---

## 5. Degradation-Relevance Interaction

### Does Highly Relevant Context Degrade Less Than Marginally Relevant Context?

The short answer: **no, not meaningfully**. Position and length effects dominate relevance effects.

### Evidence

1. **Du et al. (2025)** showed that even when models perfectly retrieve all relevant information, performance still degrades 13.9%-85% as input length increases. Relevance quality does not protect against position-based degradation.

2. **Liu et al. (2024)** demonstrated that the U-shaped attention curve is **independent of relevance**. Models exhibit the same positional bias regardless of how relevant the information at each position is. Attention patterns are structurally driven, not content-driven.

3. **Chroma (2025)** found that lower similarity between the needle and the question increases the rate of degradation. This suggests that highly relevant content (high needle-question similarity) degrades somewhat less steeply than marginally relevant content, but the degradation still occurs at every context length increment.

4. **Distractor interaction**: the combination of long context and semantically similar (marginally relevant) distractors is particularly devastating. Chroma found that distractors have non-uniform impact on model performance, with distinctions becoming more prominent as input length increases. Four distractors compound degradation beyond what a single distractor causes.

5. **Practical recommendation from the literature**: retrieve generously during the initial stage to maximize recall, then aggressively filter during reranking to keep only the 3-5 most relevant documents. Including marginally relevant documents in the context actively harms performance; it is better to exclude them.

### The Relevance-Position Matrix

| | Beginning | Middle | End |
|---|---|---|---|
| Highly relevant | High accuracy | Reduced (but less than marginal) | High accuracy |
| Marginally relevant | Moderate accuracy | Severely degraded | Moderate accuracy |
| Irrelevant (distractor) | Active harm; compounds degradation | Active harm; maximal degradation | Active harm; compounds degradation |

The key insight: **relevance modulates the severity of degradation but does not prevent it**. Position is the dominant factor. A highly relevant fact in the middle of a long context will still be "lost" relative to the same fact at the beginning or end, though the absolute accuracy may be higher than for a marginally relevant fact in the same position.

---

## 6. Synthesis: The Degradation Landscape

### Factors Ordered by Impact on Retrieval/Reasoning Performance

1. **Position within context** (dominant factor): beginning and end are privileged; middle is a dead zone.
2. **Total context length** (strong factor): degradation begins well before the advertised limit (effective capacity is 10-20% for reasoning, 60-70% for retrieval).
3. **Task complexity** (strong factor): simple lexical retrieval degrades less than semantic reasoning, multi-hop reasoning, or code generation.
4. **Distractor density and similarity** (moderate factor): semantically similar distractors compound degradation non-linearly.
5. **Relevance of target information** (weak-to-moderate factor): high relevance provides partial protection but does not override position or length effects.
6. **Model architecture** (variable): sparse attention and entropy-invariant scaling show promise but are not yet deployed at scale.

### The Degradation Function

Based on the aggregate evidence, the empirical degradation function has the following shape:

```
Performance = f(position, length, complexity, distractors, relevance)

Where:
- Position effect: U-shaped (high at edges, low in middle)
- Length effect: monotonically decreasing, concave (steep early, flattening)
- Complexity effect: multiplicative (harder tasks amplify all other effects)
- Distractor effect: superlinear (each additional distractor costs more)
- Relevance effect: additive offset (shifts the curve up/down, does not change shape)
```

### What This Means for Information Architecture

Context windows are not uniform containers. They are **positionally biased, length-sensitive, complexity-degrading channels** with mathematically grounded limitations rooted in the softmax attention mechanism. Any system that treats a 1M-token context window as equivalent to 1M tokens of reliable working memory is operating on a false assumption.

The practical implication: **information architecture for LLM systems must account for degradation as a first-class constraint**, not an edge case.

---

## Sources

- [Liu et al., "Lost in the Middle" (TACL 2024)](https://aclanthology.org/2024.tacl-1.9/)
- [Liu et al., arXiv preprint](https://arxiv.org/abs/2307.03172)
- [Chroma Research, "Context Rot" (2025)](https://www.trychroma.com/research/context-rot)
- [Chroma Context Rot GitHub](https://github.com/chroma-core/context-rot)
- [Du et al., "Context Length Alone Hurts" (EMNLP 2025)](https://aclanthology.org/2025.findings-emnlp.1264/)
- [Du et al., arXiv version](https://arxiv.org/abs/2510.05381)
- [Xiao et al., "Efficient Streaming Language Models with Attention Sinks" (ICLR 2024)](https://arxiv.org/abs/2309.17453)
- [BABILong Benchmark (NeurIPS 2024)](https://arxiv.org/abs/2406.10149)
- [RULER Benchmark (COLM 2024)](https://arxiv.org/pdf/2404.06654)
- [Gemini 1.5 Technical Report](https://arxiv.org/abs/2403.05530)
- [Greg Kamradt, Needle in a Haystack Tests](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)
- [Anthropic, "Long Context Prompting for Claude 2.1"](https://www.anthropic.com/news/claude-2-1-prompting)
- [Anthropic, "Effective Context Engineering for AI Agents"](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Morphic LLM, "Lost in the Middle" Analysis](https://www.morphllm.com/lost-in-the-middle-llm)
- [Morphic LLM, "Context Rot" Guide](https://www.morphllm.com/context-rot)
- [Cobus Greyling, "LLM Context Rot" (Medium)](https://cobusgreyling.medium.com/llm-context-rot-28a6d0399655)
- [Understanding AI, "Context Rot: The Emerging Challenge"](https://www.understandingai.org/p/context-rot-the-emerging-challenge)
- [Google Cloud Blog, "Needle in the Haystack and Gemini Pro"](https://cloud.google.com/blog/products/ai-machine-learning/the-needle-in-the-haystack-test-and-how-gemini-pro-solves-it)
- [Arize AI, "Needle in a Haystack Test"](https://arize.com/blog-course/the-needle-in-a-haystack-test-evaluating-the-performance-of-llm-rag-systems/)
