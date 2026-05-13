# Gap Analysis

*Updated after follow-up research on human-AI discussion patterns and practical harness ecosystem survey.*

## Contradictions Found

1. **TextGrad mechanism**: Axis 2 reports TextGrad's Nature publication showing 20% gains on LeetCode-Hard, but also cites a December 2025 paper (arXiv:2512.13598) arguing "the gradient analogy does not accurately explain its behavior" and that iterative textual gradients are "notoriously unstable." Axis 5 cites TextGrad positively. The contradiction is unresolved — the mechanism may work empirically without the gradient metaphor being accurate.

2. **Self-refinement effectiveness**: Axis 5 reports Self-Refine achieving 5-40% improvements (NeurIPS), but also notes models "fail to identify own failings" in open-ended settings. This suggests self-refinement is effective for well-defined tasks but degrades for open-ended ones — relevant since several SDLC stages (requirements, discussion) are inherently open-ended.

3. **Planning modules value**: Axis 4 reports Agent-as-a-Judge found planning modules *counterproductive* in evaluation judges, while Axes 1 and 3 describe Anthropic's harness heavily relying on upfront planning. Likely different contexts (planning for evaluation vs. planning for task execution) but the tension deserves explicit discussion.

4. **Dialogue vs. structured communication**: Axis 3 notes MetaGPT claims structured document outputs reduce information loss vs. ChatDev's dialogue approach, yet ChatDev's dialogue enables "communicative dehallucination" (67% hallucination reduction). Follow-up research adds a third option: spec-driven development (GitHub Spec Kit, Kiro, Tessl) which converts discussion into structured artifact generation with human gates. Both cite favorable results for their own approach. The tension is real — no head-to-head comparison exists.

5. **SIMBA vs MIPROv2**: Axis 5 reports SIMBA claimed as superior to MIPROv2 in internal DSPy experiments, but MIPROv2 remains more widely adopted and independently validated.

## Unanswered Questions

1. **How do harness designs need to adapt across different LLM backends?** (Context Q6) — Axis 1 notes some model-specific advantages and Axis 5 discusses PromptBridge, but no comprehensive framework for adapting harnesses across backends was found. PromptBridge is the closest, but it's a preprint with limited validation.

2. **What are the unique challenges of "prompts that generate prompts"?** (Context Q4) — Axis 2 covers metaprompting patterns well, but the specific failure modes and challenges unique to metaprompting (vs. standard prompting) are mostly described at a high level. No empirical study of metaprompt failure taxonomies was found.

3. **How to optimize the human-AI discussion stage specifically** — *Partially addressed by follow-up*. HULA (82% plan approval rate), Spec Kit (structured /specify→/plan→/tasks pipeline), and communicative dehallucination (67% hallucination reduction) provide concrete patterns. However, no automated prompt optimization (DSPy/TextGrad) has been applied to the discussion stage, and no benchmark evaluates discussion quality.

4. **How to evaluate practical harness frameworks comparatively** — Follow-up 2 maps 8+ practical frameworks (GSD, OpenSpec, Spec Kit, Kiro, BMAD, Taskmaster AI, Superpowers, claude-code-harness) but no head-to-head benchmarks exist on identical codebases.

5. **Composability of harness layers** — Can you layer OpenSpec (spec) + GSD (execution) + Superpowers (methodology)? No documented attempts found.

6. **Edit format as a harness lever** — Can Boluk's finding that changing only the edit format jumped Grok from 6.7% to 68.3% is profound but under-investigated as a systematic harness design dimension.

## Thin Areas

1. **Human-AI discussion stage**: *Significantly strengthened by follow-up research.* Now includes HULA (Atlassian, ICSE SEIP 2025), Spec Kit (GitHub), communicative dehallucination (ChatDev, ACL 2024), multi-agent RE systems, and interaction pattern research. Still thin on: evaluation metrics (only plan approval rate exists), optimization strategies, and head-to-head comparisons.

2. **Cost analysis**: Token costs, latency overhead, and cost-effectiveness comparisons remain unquantified. Only Kilo Code's anecdotal "burns through credits" observation and LLM cascade routing's ~60% cost reduction were found.

3. **Long-term impact**: No research on technical debt accumulation, maintainability degradation, or architectural drift from AI-generated code over multiple pipeline iterations (noted in Axis 4).

4. **Cross-stage optimization composition**: Axis 5 explicitly notes that no research studies how prompt optimizations at one stage propagate or interfere with downstream stages. This is a fundamental question for multi-stage harness optimization.

5. **Practical framework effectiveness claims**: Superpowers claims 85-95% test coverage and ~2hr autonomous sessions; GSD claims milestone-level autonomy; Taskmaster claims 90% error reduction. All self-reported with no independent validation.

6. **HaaS (Harness as a Service) concept**: Emerging paradigm (vtrivedy) predicting an "Open App Store for Agents" — still purely conceptual with no implementations.

7. **Philosophical divergence implications**: Five distinct harness philosophies identified (spec-first, execution-first, guardrail-first, role-first, task-first) but no guidance on which philosophy suits which project type.

## Citation Audit

### Unsourced Claims Detected
- No significant unsourced factual claims detected across all axes and follow-ups.

### Coverage Summary
- Axis 1: All major claims sourced (21 sources)
- Axis 2: All major claims sourced (18 sources)
- Axis 3: All major claims sourced (16 sources)
- Axis 4: All major claims sourced (19 sources)
- Axis 5: All major claims sourced (22 sources)
- Follow-up 1: All major claims sourced (15 sources)
- Follow-up 2: All major claims sourced (28+ sources)
- **Total: ~139 sources across all findings**

No unsourced claims detected — all findings meet citation requirements.

## Follow-up Research Completed

1. **Follow-up 1: Human-AI Discussion Patterns** — Filled the primary gap. Added HULA production metrics, Spec Kit framework, communicative dehallucination quantification, requirements elicitation research landscape, interaction pattern findings, and proposed evaluation metrics. Remaining gaps (evaluation benchmarks, automated optimization of discussion) are genuine research opportunities rather than missing coverage.

2. **Follow-up 2: Practical Harness Ecosystem** — Mapped 8+ practitioner-focused frameworks (GSD, OpenSpec, Spec Kit, Kiro, BMAD, Taskmaster AI, Superpowers, claude-code-harness) plus emerging concepts (HaaS, harness hierarchy evolution, edit format as lever). Identified five philosophical divergences across frameworks. Key finding: the 2026 consensus is that harness engineering is the primary bottleneck, not model capability. Added the HumanLayer article's six configuration levers (CLAUDE.md, MCP, Skills, Sub-Agents, Hooks, Back-Pressure) and anti-patterns.
