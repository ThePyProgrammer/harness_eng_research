# Large Language Models Cannot Self-Correct Reasoning Yet

**Authors:** Jie Huang, Xinyun Chen, Swaroop Mishra, Huaixiu Steven Zheng, Adams Wei Yu, Xinying Song, Denny Zhou (Google DeepMind / UIUC)
**Published at:** ICLR 2024
**arXiv:** 2310.01798

## Core Thesis

LLMs **cannot intrinsically self-correct** their reasoning — that is, they cannot improve their answers by reviewing their own outputs without external feedback (oracle labels, tools, human input). In most cases, self-correction actually **degrades** performance.

## Key Findings

1. **Intrinsic self-correction hurts performance.** Across GSM8K, CommonSenseQA, and HotpotQA, every model tested (GPT-3.5, GPT-4, GPT-4-Turbo, Llama-2) performed **worse** after self-correction rounds compared to standard prompting. For example, GPT-3.5 on CommonSenseQA dropped from 75.8% to 38.1% after one round.

2. **Prior claims relied on oracle labels.** Studies like RCI (Kim et al.) and Reflexion (Shinn et al.) used ground-truth labels to decide when to stop the correction loop — the model only kept correcting when it was wrong. This artificially inflates self-correction's apparent benefit.

3. **Models are more likely to flip correct answers to incorrect ones** than vice versa. The fundamental issue: LLMs cannot reliably judge the correctness of their own reasoning.

4. **Multi-agent debate is no better than self-consistency.** When controlling for the number of model calls, multi-agent debate offers no meaningful advantage over simple self-consistency (majority voting over multiple samples). At 9 responses, self-consistency (88.2%) beats debate (83.0%) on GSM8K.

5. **Prompt design confounds results.** Some claimed self-correction improvements actually came from the feedback prompt containing more informative task instructions than the original prompt. When the initial prompt is made equally informative, self-correction again decreases performance.

## Why Self-Correction Fails (Intuition)

If a model with a well-designed prompt already gives its best answer on the first try, adding a "review your answer" prompt is just injecting noise — it biases the model away from its optimal response without providing new information.

## When Self-Correction *Can* Work

- **With external feedback:** code execution results, tool outputs, human corrections, search engine results
- **For non-reasoning tasks:** style adjustment, safety alignment, format compliance — where the model can judge quality more reliably
- **With trained verifiers:** separate models trained to detect errors

## Recommendations for Future Work

- Always compare self-correction against baselines with **equal inference cost** (e.g., self-consistency)
- Put **equal effort into initial prompt design** — don't use a weak initial prompt and a strong feedback prompt
- Focus on **external feedback mechanisms** rather than intrinsic self-correction for reasoning tasks
