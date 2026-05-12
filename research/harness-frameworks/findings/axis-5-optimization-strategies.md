# Axis 5: Optimization Strategies and Theoretical Frameworks

## Question
What optimization strategies (ablation studies, feedback loops, adaptive prompting, contract-based interfaces, reinforcement from human corrections, cross-model portability) show the most promise for systematically improving harness performance, and what theoretical frameworks can guide this optimization?

## Findings

### Category A: Automated Prompt Search and Optimization

- **OPRO (Optimization by PROmpting)**: Uses LLMs as black-box optimizers. Generates new candidate prompts from meta-prompts with previous candidates and scores. Outperforms human-designed prompts by up to 8% on GSM8K, up to 50% on Big-Bench Hard. Limited effectiveness with small-scale LLMs. [OPRO (arXiv)](https://arxiv.org/abs/2309.03409) | [Revisiting OPRO](https://aclanthology.org/2024.findings-acl.100/) **Confidence: High** (ICLR 2024). Agent-agnostic.

- **APE (Automatic Prompt Engineer)**: Black-box optimization via generate-evaluate-select. Achieves human-level on 24/24 instruction induction tasks (0.765 vs. 0.749 human). [APE (arXiv)](https://arxiv.org/abs/2211.01910) **Confidence: High**. Agent-agnostic.

- **CAPO (Cost-Aware Prompt Optimization)**: Genetic algorithm with AutoML techniques. 93.7% on GSM8K (from 78.1% baseline), 56.3% on SST-5 (from 44.6%). [Promptolution (arXiv)](https://arxiv.org/html/2512.02840v1) **Confidence: Medium** (preprint). Agent-agnostic.

- **TextGrad**: "Differentiation" via text — LLM-generated natural language feedback as "textual gradients." Published in Nature. 20% relative gains on LeetCode-Hard. [TextGrad (arXiv)](https://arxiv.org/abs/2406.07496) | [Stanford HAI](https://hai.stanford.edu/news/textgrad-autograd-text) **Confidence: High**. Agent-agnostic.

### Category B: Programmatic Optimization Frameworks (DSPy Ecosystem)

- **DSPy Framework**: Declarative modules with LM-driven optimizers. Improvements: ReAct agent 24%→51%, RAG 53%→61%, classification 66%→87%. [DSPy](https://dspy.ai/) | [DSPy Optimizers](https://dspy.ai/learn/optimization/optimizers/) **Confidence: High** (Stanford NLP). Agent-agnostic.

- **MIPROv2**: Bayesian optimization across three stages: bootstrapping, grounded proposal, discrete search. Data-aware and demonstration-aware. [DSPy Optimizers](https://dspy.ai/learn/optimization/optimizers/) **Confidence: High.**

- **SIMBA**: Samples mini-batches, identifies high-variability examples, uses self-reflection for improvement rules. Agent from 35%→60%. Reported as more sample-efficient than MIPROv2 (internal experiments). [SIMBA - DSPy](https://dspy.ai/api/optimizers/SIMBA/) | [DSPy SIMBA Explained](https://blog.mariusvach.com/posts/dspy-simba) **Confidence: Medium** (not independently verified).

- **GEPA (Reflective Prompt Evolution)**: LM reflection on trajectories to identify gaps. Up to 11% gain over prior DSPy optimizers. [GEPA (Zoonop)](https://zoonop.com/articles/dspys-upcoming-gepa-optimizer-shows-up-to-11-performance-gain-in-llm-prompt-optimization) **Confidence: Medium.**

### Category C: Feedback Loops and Self-Refinement

- **Self-Refine**: Iterative FEEDBACK→REFINE loop using single LLM. 5%→40%+ improvement across seven tasks. [Self-Refine (arXiv)](https://arxiv.org/abs/2303.17651) | [Self-Refine Project](https://selfrefine.info/) **Confidence: High** (NeurIPS). Critical caveat: models often fail to identify their own failings in open-ended settings.

- **SICA (Self-Improving Code Agents)**: Agents edit their own agent script — prompts, heuristics, architecture. 17-53% improvements on coding tasks. [Yohei Nakajima](https://yoheinakajima.com/better-ways-to-build-self-improving-ai-agents/) **Confidence: Medium.**

- **Self-Generated In-Context Examples**: Successful trajectories stored and used as in-context examples for future tasks. ALFWorld: 73%→89%. [Yohei Nakajima](https://yoheinakajima.com/better-ways-to-build-self-improving-ai-agents/) **Confidence: Medium.** Agent-agnostic.

### Category D: Contract-Based Interfaces and Formal Specifications

- **Agent Behavioral Contracts (ABC)**: Design-by-Contract for AI agents. Preconditions, hard/soft invariants, governance policies, recovery mechanisms. 1,980 sessions across 7 models: hard constraint compliance 88-100%, behavioral drift bounded below 0.27, reliability index >0.90. Recovery transforms exponential compliance decay into linear. Introduces (p,δ,k)-satisfaction. [ABC (arXiv)](https://arxiv.org/html/2602.22302) **Confidence: Medium-High** (substantial empirical evaluation). Agent-agnostic.

- **ContractSpec + AgentAssert**: YAML-based DSL for contract specification with sub-10ms per-action overhead. Supports hard/soft constraint separation. [ABC (arXiv)](https://arxiv.org/html/2602.22302) **Confidence: Medium-High.**

### Category E: Cross-Model Portability

- **PromptBridge**: Two-stage framework — MAP-RPE (reflection-driven optimization) + transformation learning between model pairs. 27.39% improvement on SWE-Bench Verified when transferring to o3. Demonstrates that prompts optimized for one LLM degrade significantly on others (99.39% on GPT-5 → 68.70% on Llama-3.1-70B). [PromptBridge (arXiv)](https://arxiv.org/html/2512.01420v1) **Confidence: Medium.**

- **Current reality**: Prompt portability effectively does not exist. Different training corpora, tokenization, role tags, and alignment make prompts model-specific. [Portability of LLM Prompts](https://vivekhaldar.com/articles/portability-of-llm-prompts/) **Confidence: High.**

### Category F: Adaptive Prompting and Dynamic Selection

- **Hierarchical Prompting Taxonomy (HPT)**: Universal task complexity measure with five prompting strategies. Adaptive HPF selects dynamically. [HPT (arXiv)](https://arxiv.org/html/2406.12644v2) **Confidence: Medium.**

- **RL-Based Adaptive Prompt Selection**: RL dynamically optimizes prompt policy per input based on context and complexity. [Deep RL-Driven Prompting (MDPI)](https://www.mdpi.com/2076-3417/16/3/1514) **Confidence: Medium.**

- **LLM Cascade/Routing**: Routes simpler queries to cheaper models. ~60% cost reduction with comparable performance. [LLM Cascades (OpenReview)](https://openreview.net/forum?id=6okaSfANzh) | [Unified Cascading (OpenReview)](https://openreview.net/forum?id=AAl89VNNy1) **Confidence: High.**

### Category G: Ablation Study Methodologies

- **AblationBench**: Evaluates automated ablation planning. Frontier LLMs identify only 38% of original ablations. Chain-of-thought outperforms agent-based approaches for ablation planning. [AblationBench (arXiv)](https://arxiv.org/pdf/2507.08038) **Confidence: Medium.**

- **Ablation as foundational methodology**: Fastest way to separate real performance drivers from accidental gains in multi-stage production pipelines. [Ablation Studies for AI Decisions (Medium)](https://medium.com/@adnanmasood/ablation-studies-the-operating-system-for-trustworthy-ai-decisions-b99300d3bd32) **Confidence: High.**

### Theoretical Frameworks

- **Prompt Search Space Complexity (ACL 2025)**: Prompts function as selectors extracting task-relevant information from LLM hidden state during CoT. Naive CoT can *hinder* performance. Optimal prompt search yields >50% improvement on reasoning tasks. [Why Prompt Design Matters (ACL 2025)](https://aclanthology.org/2025.acl-long.1562/) **Confidence: High.**

- **Behavioral Drift Bounds**: ABC models drift as Ornstein-Uhlenbeck stochastic process. When recovery rate γ exceeds drift rate α, drift is bounded to D* = α/γ. Multi-agent composition has quantified probabilistic degradation bounds. [ABC (arXiv)](https://arxiv.org/html/2602.22302) **Confidence: Medium-High.**

- **Meta-Prompting as Inference-Time Scaling**: DSPy's programmatic optimization raised accuracy from 46.2% to 64.0% on prompt evaluation. Treats optimization as continuous improvement, not one-shot design. [Meta-Prompting (IntuitionLabs)](https://intuitionlabs.ai/articles/meta-prompting-llm-self-optimization) **Confidence: Medium.**

### Most Promising Approaches (Ranked)

1. **DSPy + SIMBA/MIPROv2** — strongest evidence for systematic, repeatable optimization
2. **Contract-Based Interfaces (ABC)** — uniquely addresses behavioral drift across long workflows
3. **TextGrad** — Nature-published, strong on code optimization
4. **Self-Refine with stored trajectories** — practical, no extra infrastructure
5. **LLM Cascade Routing** — critical cost optimization at scale
6. **PromptBridge** — essential for model-agnostic harnesses

### Conflicting Information

- **Self-refinement effectiveness**: 5-40% improvements reported, but models "fail to identify own failings" in open-ended settings. Works well for well-defined tasks, degrades for open-ended ones.
- **SIMBA vs MIPROv2**: SIMBA claimed superior internally, but MIPROv2 is more widely adopted and validated.
- **OPRO scalability**: Up to 50% improvements with large models, but limited with small-scale LLMs.

### Key Unknowns

1. **Composition effects**: No research on how prompt optimizations at one stage propagate to downstream stages.
2. **Optimization stability over time**: Unknown how stable optimized prompts remain as models update.
3. **Human-AI discussion optimization**: No strategies found targeting the interactive discussion stage.
4. **Cost of optimization**: Computational cost of optimization loops (DSPy, OPRO, TextGrad) rarely quantified.
5. **Contract enforcement + prompt optimization interaction**: Whether contracts improve or constrain automated optimization is unexplored.
6. **Adaptive prompting at harness level**: No framework dynamically adapts strategies across an entire multi-stage harness.
7. **Reinforcement from human corrections at prompt level**: No validated framework for incorporating human corrections without model fine-tuning.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 22
