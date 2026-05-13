# Human-AI Teaming and Learning to Defer: Empirical and Contemporary Research

Research compiled: 2026-04-03

---

## 1. Bansal et al. (2021): "Does the Whole Exceed Its Parts?"

**Source**: [ACM Digital Library](https://dl.acm.org/doi/10.1145/3411764.3445717) / [arXiv:2006.14779](https://arxiv.org/abs/2006.14779) / [PDF](https://idl.cs.washington.edu/files/2021-AIExplanationsTeamPerformance-CHI.pdf)

**Publication**: CHI Conference on Human Factors in Computing Systems (CHI '21), May 2021, Yokohama, Japan

**Authors**: Gagan Bansal, Tongshuang Wu, Joyce Zhou, Raymond Fok, Besmira Nushi, Ece Kamar, Marco Tulio Ribeiro, Daniel S. Weld

### Experimental Setup

The study conducted mixed-method user studies across three common-sense tasks:
1. **Sentiment analysis of book reviews** (binary classification)
2. **Sentiment analysis of beer reviews** (binary classification)
3. **LSAT logical reasoning questions** (multiple choice)

In each task, an AI system with accuracy comparable to human participants was deployed. Participants were recruited via Amazon Mechanical Turk. The study compared multiple conditions: human-alone, AI-alone, human-AI with confidence only, and human-AI with various explanation types (feature-based, example-based, and decision-boundary explanations).

### Key Findings

**The central result**: While all human-AI teams showed complementary performance (the team exceeded either party alone), none of the explanation conditions produced accuracy significantly higher than the simple baseline of showing the AI's confidence score alone.

Specifically:
- Explanations increased team performance when the AI system was correct; participants were more likely to accept the correct recommendation
- Explanations *decreased* accuracy on examples where the AI system was wrong, because participants also accepted incorrect recommendations at higher rates
- The net improvement from explanations over confidence-only display was minimal to zero
- Complementary improvements from AI augmentation were observed but "were not increased by explanations"

**On the mechanism of failure**: Explanations increased the probability that humans would accept the AI's recommendation *regardless of its correctness*. This is a critical finding for harness design: providing richer information does not inherently improve human override decisions; it can instead amplify anchoring to the AI's suggestion.

### Implications for Harness Design

The study demonstrates that confidence calibration, not explanation richness, is the primary lever for human-AI complementary performance. A well-calibrated confidence signal allows humans to know when to override; elaborate explanations of model reasoning often fail to help humans identify when the AI is wrong. This finding directly informs deferral policy design in AI coding harnesses: the quality of the uncertainty signal matters more than the verbosity of the justification.

---

## 2. Mozannar & Sontag (2020): "Consistent Estimators for Learning to Defer to an Expert"

**Source**: [ICML 2020 Proceedings](https://proceedings.mlr.press/v119/mozannar20b.html) / [arXiv:2006.01862](https://arxiv.org/abs/2006.01862) / [GitHub](https://github.com/clinicalml/learn-to-defer)

**Publication**: 37th International Conference on Machine Learning (ICML 2020), July 2020

**Authors**: Hussein Mozannar, David A. Sontag

### The Formal Framework

Mozannar and Sontag formalize learning to defer as the joint optimization of a classifier h and a rejector r. The system must decide, for each input x: (a) have the model predict, or (b) defer to a human expert. The 0-1 loss formulation of the system loss is:

```
L_{0-1}(h, r) = E_{(x,y)~P, m~M|(x,y)} [ I[h(x) != y] * I[r(x) = 0] + I[m != y] * I[r(x) = 1] ]
```

where:
- `h(x)` is the classifier's prediction
- `r(x) = 0` means the classifier predicts; `r(x) = 1` means defer to expert
- `m` is the expert's decision (sampled from M given x, y)
- `I[...]` is the indicator function

This formulation captures the key insight: the cost of deferral is not a fixed constant (as in Chow's reject option) but depends on the expert's actual performance on that specific instance.

### Relationship to Chow (1970) Reject Option

Chow's 1970 framework established the foundational idea: an optimal classifier can abstain from prediction when the conditional expected risk exceeds a rejection cost threshold. Chow's rule minimizes the error rate for a given reject rate (and vice versa), rejecting an instance if the highest posterior probability falls below a threshold t.

The cost structure follows: `t = (C_r - C_c) / (C_e - C_c)`, where C_e, C_r, and C_c denote the costs of error, rejection, and correct recognition respectively.

Mozannar and Sontag generalize this in two important ways:
1. The rejection cost is not fixed but depends on the *expert's* accuracy on that specific instance
2. The framework is *learning-theoretic*: it does not require known class posteriors but learns from samples of expert decisions

### Key Theoretical Results

Their central contribution is a **consistent surrogate loss** for cost-sensitive learning that generalizes the cross entropy loss. Their approach reduces learning to defer to cost-sensitive learning, where the cost of misclassification on instance x depends on whether the expert would have been correct.

The consistency guarantee ensures that as the number of training samples grows, the learned deferral policy converges to the Bayes-optimal policy (the one minimizing the true system loss). This is a stronger guarantee than most practical learning-to-defer methods provide.

### Practical Significance for Coding Harnesses

The framework establishes that optimal deferral requires knowing (or learning) the human expert's error pattern, not just the AI's uncertainty. For a coding harness, this means the deferral policy should model developer competence per-task-type, not just LLM confidence. The optimal boundary between "agent handles autonomously" and "defer to human" depends on the specific developer's likely accuracy, which varies by domain, file familiarity, and complexity.

---

## 3. Raghu et al. (2019): Direct Uncertainty Prediction and Algorithmic Triage

**Sources**:
- Blog: [Direct Uncertainty Prediction for Medical Second Opinions](https://maithraraghu.com/blog/2019/Direct_Uncertainty_Prediction/)
- Paper: [arXiv:1903.12220](https://arxiv.org/abs/1903.12220) ("The Algorithmic Automation Problem: Prediction, Triage, and Human Effort")
- Semantic Scholar: [Direct Uncertainty Prediction paper](https://www.semanticscholar.org/paper/Direct-Uncertainty-Prediction-for-Medical-Second-Raghu-Blumer/2826ac3621fdd599303c97cb9e32f165521967b2)

**Authors**: Maithra Raghu, Katy Blumer, Greg Corrado, Jon Kleinberg, Ziad Obermeyer, Sendhil Mullainathan

### The Core Innovation: Separating Prediction from Uncertainty

The fundamental insight is that uncertainty estimation should be *decoupled* from the prediction task itself. Rather than inferring uncertainty from a classifier's output distribution (the standard approach), Raghu et al. propose training a dedicated model (Direct Uncertainty Prediction, or DUP) directly on scalar uncertainty scores.

As Raghu explains: "If we have a target measure of spread in mind, we can train a new model directly on the scalar uncertainty score."

The contrast with the standard approach (Uncertainty via Classification, or UVC):
- **UVC**: Train a classifier, then compute spread measures (variance, entropy, disagreement) from its predicted distribution
- **DUP**: Train a separate model directly on actual uncertainty scores from ground truth disagreement data

DUP is shown to be mathematically unbiased when latent features exist that humans (but not the model) can observe, whereas UVC produces biased uncertainty estimates in this regime.

### Medical Application: Diabetic Retinopathy

The evaluation focused on fundus photograph analysis for diabetic retinopathy grading on a five-class scale (grades 1-5), with grade 3+ indicating referable cases requiring immediate clinical attention.

DUP consistently outperformed UVC across:
- Holdout test sets
- Adjudicated datasets with consensus labels
- Ranking studies measuring agreement with gold-standard diagnoses

### The Algorithmic Triage Framework (1903.12220)

The companion 2019 paper formalizes the broader problem: "Automation is broader than just a comparison of human versus algorithmic performance on a task; it also involves the decision of which instances of the task to give to the algorithm in the first place."

This frames automation as an optimization problem over task allocation, showing that even basic heuristics for this allocation can lead to meaningful performance gains in medical AI applications.

### Implications for Coding Harnesses

Direct uncertainty prediction suggests that coding harnesses should not rely on LLM token probabilities or self-reported confidence as the sole deferral signal. Instead, a separate model trained on historical patterns of agent success/failure (conditioned on task features) may produce more reliable deferral decisions than the LLM's own uncertainty estimates.

---

## 4. Madras, Pitassi, & Zemel (2018): "Predict Responsibly"

**Source**: [NeurIPS 2018](https://proceedings.neurips.cc/paper/2018/hash/09d37c08f7b129e96277388757530c72-Abstract.html) / [arXiv:1711.06664](https://arxiv.org/abs/1711.06664) / [PDF](https://www.cs.toronto.edu/~zemel/documents/NIPS_Predict_Responsibly.pdf) / [GitHub](https://github.com/dmadras/predict-responsibly)

**Authors**: David Madras, Toniann Pitassi, Richard Zemel

### Framework: Fairness-Aware Deferral

Madras et al. extend learning to defer by incorporating fairness constraints. Their two-stage framework consists of:
1. An automated classifier that processes each input
2. A "PASS" mechanism that routes selected instances to a downstream human decision-maker

The key innovation is that the deferral decision itself is subject to fairness requirements. The model jointly optimizes for accuracy and fairness, with deferral as a lever to achieve both. The objective creates a Pareto frontier where improved fairness need not sacrifice accuracy.

### COMPAS Experimental Results

Testing on the COMPAS recidivism prediction dataset, the study demonstrates:

- For each deferral rate, the learning-to-defer model achieves higher classification accuracy than either the standalone model or the human decision-maker alone
- The best learning-to-defer models outperform both the human decision-maker and a baseline binary classifier
- Critically: "Although the decision-maker is less accurate than the model, the most accurate result is not to replace the decision-maker, but to use a decision-maker-model mixture, and only when the model is adaptive (i.e., learns to defer) is the potential of this mixture unlocked"

### The Biased Expert Problem

A crucial finding concerns what happens when the human expert is biased:
- Deferral to **unbiased experts** consistently enhanced both fairness and overall system performance
- Deferral to **biased experts** did not improve fairness and sometimes worsened outcomes
- Even when working with inconsistent or biased users, the learning-to-defer framework "still greatly improve[s] the accuracy and/or fairness of the entire system" compared to the expert alone

The results are shown across various hyperparameter settings (alpha_fair, gamma_defer/gamma_reject) to illustrate accuracy/fairness tradeoffs. Each plotted line connects several points (each a median of 5 runs at one setting), and only the Pareto front is shown.

### Implications for Coding Harnesses

This work has direct relevance: if a coding agent defers to a developer who has systematic biases (e.g., always approving code that compiles, never checking edge cases), the deferral may not improve system outcomes. Harness design must account for the quality of the human decision-maker, not just the AI's uncertainty. The fairness dimension also applies to coding: deferral policies that systematically route certain code types (security-critical, infrastructure) differently than others must be designed with awareness of potential disparate outcomes.

---

## 5. Vodrahalli et al. (2022): Do Humans Actually Benefit from AI Explanations?

**Sources**:
- [arXiv:2107.07015](https://arxiv.org/abs/2107.07015) ("Do Humans Trust Advice More if it Comes from AI?")
- [AAAI/ACM AIES 2022](https://dl.acm.org/doi/10.1145/3514094.3534150)
- [NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/file/1968ea7d985aa377e3a610b05fc79be0-Paper-Conference.pdf) ("Uncalibrated Models Can Improve Human-AI Collaboration")
- [Stanford CICL Lab](https://cicl.stanford.edu/publication/vodrahalli2022humans/)

**Authors**: Kailas Vodrahalli, Roxana Daneshjou, Tobias Gerstenberg, James Zou

### Study 1: "Do Humans Trust Advice More if it Comes from AI?" (AIES 2022)

**Methodology**: Recruited over 1,100 crowdworkers across several experimental settings to characterize how humans use AI suggestions relative to equivalent suggestions from peer humans.

**Key empirical findings**:

1. **Source attribution is secondary**: The source itself (AI vs. human) does not determine whether participants heed advice. Instead, participants' *beliefs about how well AI vs. humans perform on a given task* determine whether they use the advice.

2. **Three instance-level factors and one task-level factor** drive advice utilization:
   - (Instance) The person's confidence in their own answer
   - (Instance) The advice confidence level
   - (Instance) Whether the person's initial response agrees with the advice
   - (Task) The person's prior belief about human vs. AI performance on this task type

3. **Activation-integration model**: The researchers propose a two-stage model where participants first decide whether to activate (attend to) the advice, then decide to what extent to integrate it. When participants do choose to heed the advice, they use it similarly regardless of whether it comes from AI or humans.

### Study 2: "Uncalibrated Models Can Improve Human-AI Collaboration" (NeurIPS 2022)

The counterintuitive finding: showing AI models as *more confident than they actually are* (even when the original AI is well-calibrated) can improve human-AI team performance measured as the accuracy and confidence of the human's final prediction after seeing AI advice.

The researchers:
1. Modeled human behavior using empirical data from collaboration experiments
2. Demonstrated this human model allows optimization of AI advice presentation
3. Showed both in simulation and empirically that modified (overconfident) advice improves overall system performance

This directly contradicts the naive assumption that perfect calibration is always optimal for human-AI teams. The finding suggests the optimal confidence display depends on the human's decision process, not just the AI's true uncertainty.

### Combined Implications

These two studies together paint a nuanced picture: humans do not process AI advice as rational Bayesian updaters. They use heuristic activation-integration processes that depend on prior beliefs about AI capability, their own confidence, and the displayed confidence level. For coding harnesses, this means:
- Displaying raw LLM token probabilities is unlikely to produce optimal developer decisions
- The confidence display should be tuned to the human decision process, not just calibrated to ground truth
- Developer beliefs about "what AI is good at" (a task-level prior) will systematically bias their override decisions

---

## 6. Empirical Studies on AI Coding Tools

### 6.1 DORA 2025 State of AI-Assisted Software Development

**Source**: [DORA Report 2025](https://dora.dev/dora-report-2025/) / [Google Cloud Blog](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) / [Faros.ai Analysis](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025)

**Key Statistics**:

| Metric | Value |
|--------|-------|
| Developers using AI tools | 95% |
| Individual task completion increase | +21% |
| Pull requests merged increase | +98% |
| Pull request size growth | +154% |
| Code review time increase | +91% |
| Bug rate increase | +9% |
| Daily task contexts handled increase | +9% |
| Daily PRs processed increase | +47% |
| Organizational delivery metrics change | Flat |

**The Amplification Effect**: The research demonstrates that AI amplifies existing organizational patterns: strengthening high performers while compounding dysfunction in struggling teams. The core finding is that while individual coding accelerates, review capacity does not automatically scale to match, creating a bottleneck. Without end-to-end visibility, teams optimize locally (making code generation faster) while the actual constraint shifts to review, integration, and deployment.

**Stability Tradeoff**: AI adoption continues to have a negative relationship with software delivery stability, confirming that AI-accelerated code generation can expose weaknesses downstream. Without robust automated testing, mature version control practices, and fast feedback loops, increased change volume leads to instability.

**The Seven Archetypes**: The 2025 report replaced traditional performance tiers (low/medium/high/elite) with seven distinct archetypes based on multidimensional performance patterns, acknowledging that developer team performance is not a single linear dimension.

### 6.2 Sonar 2026 State of Code Developer Survey

**Source**: [Sonar Press Release](https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/) / [Sonar Blog](https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding) / [IT Pro Coverage](https://www.itpro.com/software/development/software-developers-not-checking-ai-generated-code-verification-debt)

**Sample**: Over 1,100 developers surveyed globally

**The Verification Gap**:

| Metric | Value |
|--------|-------|
| Developers who don't fully trust AI output | 96% |
| Developers who always verify AI code before committing | 48% |
| Developers who use AI daily (among those who tried it) | 72% |
| AI-generated share of all committed code | 42% |
| Expected AI share by 2027 | 65% |

The headline finding: "96% Don't Fully Trust Output, Yet Only 48% Verify It." This represents a critical disconnect between stated beliefs and actual behavior. Developers express significant doubt about AI-generated code yet fail to consistently validate it through review processes.

**Effectiveness Ratings by Task**:

| Task | Usage Rate | "Very/Extremely Effective" Rating |
|------|-----------|-----------------------------------|
| New code development | 90% | 55% |
| Writing documentation | N/A | 74% |
| Explaining/understanding code | N/A | 66% |
| Generating tests | N/A | 59% |
| Refactoring | 72% | 43% |

**AI Usage by Project Type**:
- Prototypes: 88%
- Customer-facing apps: 73%
- Mission-critical services: 58%

**Review Effort**: More than one-third of respondents say reviewing AI-generated code requires more effort than reviewing code written by human peers.

### 6.3 METR Studies: Benchmark Scores vs. Real-World Mergeability

**Source**: [METR Blog Post (March 2026)](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/) / [METR Experienced Developer Study (July 2025)](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) / [arXiv:2507.09089](https://arxiv.org/pdf/2507.09089)

#### Study 1: SWE-bench Verified PRs vs. Maintainer Merge Decisions (March 2026)

**Methodology**: METR hired 4 maintainers from repos used in SWE-bench Verified (scikit-learn, Sphinx, pytest) to review AI-generated PRs that passed the benchmark's automated grader.

**Key Statistics**:

| Metric | Value |
|--------|-------|
| AI-generated PRs reviewed | 296 |
| Human "golden" patches reviewed (baseline) | 47 |
| SWE-bench Verified issues covered | 95 of 500 (19%) |
| Unadjusted gap (grader vs. maintainer) | 24.2 percentage points (SE: 2.7) |
| Golden baseline maintainer pass rate | 68% |
| Approximate merge rate after baseline adjustment | ~50% of test-passing PRs would not merge |

**Agents Evaluated**: Claude 3.5 Sonnet (Old), Claude 3.7 Sonnet, Claude 4 Opus, Claude 4.5 Sonnet, GPT-5

**Leading rejection reasons**: Code quality issues, breaks to existing code, core functionality failures.

The key quote: "Roughly half of test-passing SWE-bench Verified PRs would not be merged into main by repo maintainers."

METR explicitly notes they "do not claim that this represents a fundamental capability limitation" since agents were not given the opportunity to iterate on feedback as a human developer would. However, "a naive interpretation of benchmark scores may lead one to overestimate how useful agents are without more elicitation or human feedback."

#### Study 2: AI Impact on Experienced Developer Productivity (July 2025)

**Methodology**: Randomized controlled trial with 16 experienced open-source developers (from repos averaging 22,000+ stars), completing 246 real issues (bug fixes, features, refactors) averaging 2 hours each, using primarily Cursor Pro with Claude 3.5/3.7 Sonnet.

**Core Finding**: Developers took **19% longer** with AI tools than without, contradicting both developer expectations and expert forecasts.

**The Perception Gap**: Developers expected AI to accelerate their work by 24%, yet experienced a 19% slowdown. Most striking: even after the slowdown, developers still believed AI had sped them up by 20%, revealing significant misperception.

**Quality Control**: Developers "submitted similar quality PRs with and without AI," ruling out quality degradation as an explanation for the time increase.

**Important Caveat**: "We do not claim that our developers or repositories represent a majority or plurality of software development work."

### 6.4 GitHub Copilot Productivity Studies

#### Peng et al. (2023): "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot"

**Source**: [arXiv:2302.06590](https://arxiv.org/abs/2302.06590)

**Methodology**:
- 95 professional programmers recruited via Upwork
- 45 in treatment group (Copilot access), 50 in control
- 35 developers from both groups completed the task and survey
- Task: implement an HTTP server in JavaScript as quickly as possible
- Demographics: mostly ages 25-34, primarily from India and Pakistan, average 6 years coding experience

**Key Result**: The treatment group completed the task 55.8% faster than the control group. No effect on whether the task was completed (binary completion rate was similar).

**Heterogeneous Effects**: Copilot benefited less experienced, high-workload, and older developers more.

**Methodological Concerns** (noted in broader literature):
1. **External validity**: Upwork freelancers on a single JavaScript task may not represent enterprise development workflows
2. **Task scope**: Implementing an HTTP server is a well-defined, relatively constrained task; real-world development involves ambiguous requirements, multi-file changes, and integration concerns
3. **Completion rate confound**: Only 35 of 95 recruited developers completed the study, introducing potential selection bias
4. **Single-task design**: Does not capture long-term effects on code quality, maintenance burden, or team dynamics
5. **SDLC phase coverage**: The study focuses on the implementation phase only; as noted in the literature, "most publications focusing on GenAI in software development focus primarily on the Implementation phase of the SDLC, leaving an end-to-end evaluation of GenAI's impact mostly out of sight"

#### Ziegler et al. (2024): "Measuring GitHub Copilot's Impact on Productivity"

**Source**: [Communications of the ACM, March 2024](https://cacm.acm.org/research/measuring-github-copilots-impact-on-productivity/) / [ACM DL](https://dl.acm.org/doi/10.1145/3633453)

**Methodology**: Analyzed 2,631 survey responses from developers using GitHub Copilot, matched to IDE interaction measurements.

**Key Findings**:
- GitHub Copilot has an acceptance rate of 27% (fraction of shown completions that are accepted)
- Mean daily completions accepted per user (DCPU) exceeds 312
- Acceptance rate of shown suggestions is a better predictor of perceived productivity than alternative measures
- Acceptance rate varies significantly across the developer population and over time

**Methodological Note**: The study measures *perceived* productivity via survey responses and correlates it with acceptance rate. It does not independently measure actual productivity (code quality, time-to-completion, or defect rates). The finding that acceptance rate predicts perceived productivity is informative about developer experience but does not establish that higher acceptance rates correspond to better software outcomes.

### 6.5 GitClear Analysis: Code Quality Degradation (2024-2025)

**Source**: [GitClear 2025 Research](https://www.gitclear.com/ai_assistant_code_quality_2025_research) / [Report Summary](https://www.jonas.rs/2025/02/09/report-summary-gitclear-ai-code-quality-research-2025.html)

**Dataset**: 211 million lines of structured code change data, January 2020 through December 2024. Repos owned by Google, Microsoft, Meta, and enterprise C-Corps.

**Key Metrics**:

| Metric | 2020 | 2024 | Change |
|--------|------|------|--------|
| Moved (refactored) code share | 24.1% | 9.5% | -60.6% relative |
| Copy/pasted code share | 8.3% | 12.3% | +48.2% relative |
| Added (new) code share | 39% | 46% | +17.9% relative |
| Code revised within 2 weeks | 3.1% | 5.7% | +83.9% relative |
| All new code churn (2-week window) | 5.5% | 7.9% | +43.6% relative |
| Code revised after >1 month | 30% | 20% | -33.3% relative |

**The Duplication Explosion**: The number of code blocks with 5 or more duplicated lines increased by **8x** during 2024. This is the single most dramatic metric in the report.

**The Refactoring Collapse**: 2024 is the first year when the introduction of repeated code is greater than refactoring activity. The decline from 24.1% moved code to 9.5% represents a fundamental shift in development practices.

**Direct Quote**: "AI-assisted code has contributed to a measurable decline in code quality" with optimization focused on "rapid feature implementation rather than long-term maintainability."

---

## 7. Confidence Calibration in AI Systems

### 7.1 Foundational Work: Guo et al. (2017)

**Source**: [arXiv:1706.04599](https://arxiv.org/abs/1706.04599) ("On Calibration of Modern Neural Networks")

**Core Finding**: Modern deep neural networks are poorly calibrated, despite achieving high accuracy. Unlike networks from the previous decade, current models are systematically overconfident.

**Formal Definition**: A model is perfectly calibrated if, among all instances where the model predicts class k with confidence p, exactly a fraction p of those instances actually belong to class k. Formally: P(Y = k | p_hat = p) = p for all p in [0,1].

**Expected Calibration Error (ECE)**: The standard metric partitions predictions into bins by confidence level and computes the weighted average of the gap between confidence and accuracy within each bin.

**Temperature Scaling**: A single-parameter post-hoc calibration method that divides logits by a learned temperature T before the softmax. T > 1 softens the distribution (reduces overconfidence); T < 1 sharpens it. Guo et al. found this "surprisingly effective" on most datasets, despite requiring only a single scalar parameter learned on a held-out validation set.

**Platt Scaling**: A two-parameter method (slope and intercept) that fits a logistic regression on the model's logits to produce calibrated probabilities. Temperature scaling can be viewed as a constrained special case of Platt scaling.

**Key Insight for Harnesses**: Depth, width, weight decay, and Batch Normalization are important factors influencing calibration. Neural networks can overfit to NLL (negative log likelihood) without overfitting to 0/1 loss, meaning "overfitting manifests in probabilistic error rather than classification error." Models can be highly accurate but systematically misrepresent their own uncertainty.

### 7.2 LLM Self-Calibration: Kadavath et al. (2022)

**Source**: [arXiv:2207.05221](https://arxiv.org/abs/2207.05221) ("Language Models (Mostly) Know What They Know")

**Key Findings**:
- Larger language models are well-calibrated on diverse multiple-choice and true/false questions when provided in the right format
- Models can be trained to predict P(IK) ("I Know" probability) without reference to any particular proposed answer
- Models perform well at predicting P(IK) and partially generalize across tasks, though they struggle with calibration of P(IK) on new tasks
- P(IK) probabilities increase appropriately when relevant source materials appear in the context
- P(IK) increases in the presence of hints toward solutions for mathematical word problems

**The "Mostly" Qualification**: The title is carefully chosen. While LLMs show promising self-knowledge capabilities, their calibration degrades on novel task types and can be systematically manipulated. The observations "lay the groundwork for training more honest models."

### 7.3 Post-RLHF Calibration Degradation (2024 Research)

**Sources**: [EMNLP 2024](https://aclanthology.org/2024.emnlp-main.1007.pdf) / [NAACL 2024 Survey](https://aclanthology.org/2024.naacl-long.366.pdf) / [arXiv:2502.11028](https://arxiv.org/html/2502.11028v3)

**Critical Finding**: After fine-tuning with reinforcement learning from human feedback (RLHF), the calibration of language models degrades significantly. This is directly relevant to coding harnesses because all frontier models used in agents (Claude, GPT-4, etc.) are RLHF-tuned.

**Overconfidence Pattern**: LLM-based models "tend to produce overconfident predictions and exhibit significant miscalibration when subjected to jailbreak attacks." More broadly, the "confidence gap" between stated confidence and actual accuracy is a consistent finding across multiple studies.

**Adaptive Temperature Scaling (ATS)**: A post-hoc method that predicts a temperature parameter *per token* rather than using a single global temperature. This yields significant improvements for RLHF-tuned models (tested on Llama-2-7b-Chat and Qwen-7b-Chat).

### Synthesis: What Miscalibration Means for Human-AI Teams

The empirical literature converges on a troubling cycle:
1. Modern LLMs are miscalibrated (especially after RLHF), tending toward overconfidence
2. Overconfident AI systems induce automation bias in human collaborators (Bansal et al. 2021)
3. Humans cannot reliably detect when overconfident AI is wrong (Vodrahalli et al. 2022)
4. The resulting human-AI team performs worse than either party alone when the AI outperforms the human (Vaccaro et al. 2024)

Breaking this cycle requires either: (a) better calibration of the AI's expressed confidence, (b) training humans to discount AI confidence appropriately, or (c) structural mechanisms (like mandatory deferral on high-uncertainty instances) that bypass the human's susceptibility to anchoring.

---

## 8. The Complementarity Gap: When Adding Humans Helps vs. Hurts

### 8.1 Vaccaro, Almaatouq, & Malone (2024): Meta-Analysis

**Source**: [Nature Human Behaviour (2024)](https://www.nature.com/articles/s41562-024-02024-1) / [arXiv:2405.06087](https://arxiv.org/abs/2405.06087)

**Authors**: Michelle Vaccaro, Abdullah Almaatouq, Thomas Malone (MIT)

**Methodology**: Preregistered systematic review and meta-analysis of 106 experimental studies reporting 370 effect sizes, covering papers from January 2020 through June 2023.

**The Headline Finding**: On average, human-AI combinations performed **significantly worse** than the best of humans or AI alone (Hedges' g = -0.23, 95% CI [-0.39, -0.07], p = 0.005). However, they outperformed humans working alone (g = 0.64, p < 0.001).

This means: adding AI to a human improves performance, but adding a human to AI typically degrades it.

**When Combinations Help vs. Hurt**:

| Condition | Effect Size | Direction |
|-----------|------------|-----------|
| AI outperforms humans alone | g = -0.54 | Significant loss |
| Humans outperform AI alone | g = +0.46 | Significant gain |
| Decision tasks (85% of studies) | g = -0.27 | Significant loss |
| Creation tasks (10% of studies) | g = +0.19 | Positive (non-significant) |

The difference between decision tasks and creation tasks was statistically significant (p = 0.006).

**Critical Asymmetry**: When humans outperform AI alone, combining them produces a medium-sized gain. When AI outperforms humans alone, combining them produces a medium-sized *loss*. This asymmetry suggests that humans lack judgment about when to trust versus override AI suggestions in domains where the AI is stronger.

**Division of Labor**: Only 3 of 100+ experiments tested true task decomposition (where humans and AI handle different subtasks). These showed positive but non-significant effects (g = 0.22, n = 4 effect sizes), suggesting that the potential of human-AI *complementarity* (as opposed to mere *combination*) remains largely unexplored.

### 8.2 Automation Bias: The Primary Failure Mode

**Source**: [Springer AI & Society (2025)](https://link.springer.com/article/10.1007/s00146-025-02422-7) / [ScienceDirect (2025)](https://www.sciencedirect.com/science/article/pii/S0268401225000076)

Automation bias refers to the tendency of humans to over-rely on automated systems, accepting their outputs without sufficient scrutiny. Key empirical findings from the literature:

1. **First impressions matter**: Encountering system strengths first leads to increased reliance and more errors; encountering weaknesses first reduces errors but causes underestimation of system capabilities
2. **Time pressure amplifies bias**: Anchoring bias increases in human-AI collaboration when decision-making time is limited
3. **Cognitive delegation**: Unrestricted access to AI can improve immediate performance while degrading unassisted performance when AI is removed, consistent with "negative human cognitive drift"
4. **Masking effect**: High-performance metrics in hybrid systems can mask dangerous overreliance where "automation bias and the inheritance of AI-driven errors result in a net loss of human analytical competence"

### 8.3 DeepMind Safety Research: Conditions for Complementarity

**Source**: [DeepMind Safety Research (Medium)](https://deepmindsafetyresearch.medium.com/human-ai-complementarity-a-goal-for-amplified-oversight-0ad8a44cae0a)

DeepMind's framework identifies two mechanisms for complementarity:
1. **Rater Assistance**: AI helps human raters through critiques or evidence
2. **Hybridization**: Combining human and AI judgments based on relative capability predictions

**Key finding**: "Achieving human-AI complementarity is difficult and does not happen by default."

**On the limits of explanation**: "Simply providing this additional information does not reliably reduce over-reliance or lead to complementarity across studies."

**Success condition**: "AI quoted evidence increased human accuracy above baseline" when the AI handled subtasks rather than full judgments. This suggests complementarity requires task decomposition, not just advice-giving.

### 8.4 Fok et al. (2023/2024): The Verifiability Thesis

**Source**: [arXiv:2305.07722](https://arxiv.org/abs/2305.07722) ("In Search of Verifiability: Explanations Rarely Enable Complementary Performance in AI-Advised Decision Making")

This paper surveyed 21 studies where explanations did not enable verification and found that **none** achieved complementary performance. In contrast, 5 studies showing complementary performance all involved explanations that supported answer verification.

**The core thesis**: "Explanations can enable complementary performance in AI-advised decision making to the extent they allow a decision maker to verify an AI's recommendation."

**On why most explanations fail**: "The AI may make a bad decision for a credible reason...Hence, explanations which clearly reveal model error to the human are rare."

**Task structure determines verifiability**: Tasks resembling NP-complete problems with easy-to-verify solutions (maze solving, factoid QA from trusted sources) succeeded. Tasks with irreducible aleatoric uncertainty (recidivism prediction, sentiment analysis) fundamentally resist verification regardless of explanation quality.

**Crucial distinction**: An unfaithful explanation enabling verification can outperform a faithful explanation that does not. Faithfulness to the model's internal reasoning is neither necessary nor sufficient for complementary performance; what matters is whether the explanation reduces the human's verification cost.

---

## 9. Cross-Source Contradictions and Tensions

### Contradiction 1: Does AI Improve Developer Productivity?

| Source | Finding |
|--------|---------|
| Peng et al. (2023) | 55.8% faster task completion with Copilot |
| DORA 2025 | +21% individual tasks, +98% PRs merged |
| METR (July 2025) | 19% *slower* for experienced developers on real tasks |
| Sonar 2026 | 42% of code is AI-generated but only 55% rate it effective |

These findings are not strictly contradictory: Peng et al. tested a single well-defined task on freelancers; DORA measured volume metrics at the organizational level; METR tested experienced developers on their own complex repos. The pattern suggests AI accelerates *constrained, well-defined coding tasks* while potentially slowing down *complex, context-heavy work in familiar codebases*. The METR finding that developers *believed* they were faster even when slower is especially concerning for self-report studies.

### Contradiction 2: Is Calibration Good or Bad for Human-AI Teams?

| Source | Finding |
|--------|---------|
| Bansal et al. (2021) | Confidence calibration is the key lever; explanations do not help |
| Vodrahalli et al. (2022) | *Uncalibrated* (overconfident) models can improve team performance |
| Guo et al. (2017) | Modern networks are systematically miscalibrated |
| Kadavath et al. (2022) | LLMs are "mostly" well-calibrated but degrade on novel tasks |

The resolution: "calibration" in the Bansal et al. sense means providing *some* confidence signal (versus none); the Vodrahalli result suggests the *optimal* confidence signal for human decision-making may not be perfectly calibrated to ground truth. The human decision process is not Bayesian, so the optimal display depends on the human's heuristic processing, not just the AI's epistemic state.

### Contradiction 3: Do Humans Add Value to AI Systems?

| Source | Finding |
|--------|---------|
| Vaccaro et al. (2024) | Human-AI teams perform *worse* than best-alone (g = -0.23) |
| Madras et al. (2018) | Learning-to-defer models with human experts outperform either alone |
| DeepMind (2024) | Complementarity is achievable but "does not happen by default" |
| METR (2026) | ~50% of test-passing PRs need human revision before merging |

The resolution lies in *how* the human is integrated. Simply showing an AI output and asking a human to approve/reject (the most common experimental paradigm, and the most common harness design) produces negative complementarity. Structured task decomposition, learned deferral policies, and verification-enabling interfaces can achieve positive complementarity. The question is not "should there be a human?" but "what role should the human play?"

---

## 10. Synthesis: Implications for AI Coding Agent Harness Design

### 10.1 The Learning-to-Defer Framework Applied to Coding

The Mozannar-Sontag framework suggests coding harnesses should implement:

1. **Per-instance deferral decisions** based on the joint estimate of (a) the AI agent's likely error on this specific task and (b) the developer's likely error on this specific task
2. **Expert-aware loss functions** that model the developer's strengths and weaknesses (not just the AI's uncertainty)
3. **Consistent surrogate losses** that converge to optimal deferral policies as more interaction data accumulates

### 10.2 Calibration as a Design Requirement

The evidence demands:
- **Post-hoc calibration** of LLM confidence signals (temperature scaling, Platt scaling) before presenting them to developers
- **Separate uncertainty models** (following Raghu et al.'s DUP approach) rather than relying on the LLM's self-reported confidence
- **Human-calibrated displays** (following Vodrahalli et al.) that optimize for the developer's decision process, not raw accuracy

### 10.3 Structural Mechanisms Over Information Provision

The complementarity gap research consistently shows:
- Providing more information (explanations, reasoning traces) rarely improves human override decisions
- *Structural* mechanisms (mandatory deferral zones, verification-enabling interfaces, task decomposition) are more effective
- The harness should enforce deferral on high-uncertainty instances rather than presenting high-uncertainty outputs and hoping the developer notices

### 10.4 The Verification Bottleneck

The empirical coding studies (DORA 2025, Sonar 2026, GitClear 2025, METR 2025-2026) converge on a common finding: AI dramatically increases code generation throughput while creating verification bottlenecks that current human-review processes cannot absorb. The 91% review time increase (DORA), the 48% never-verify rate (Sonar), and the 50% non-mergeable PR rate (METR) all point to the same structural problem: the harness accelerates the wrong phase of the development lifecycle.

### 10.5 The Automation Bias Trap

Every empirical study of human-AI interaction in this review identifies automation bias as the primary failure mode. For coding harnesses, this manifests as:
- Developers accepting AI-generated code without adequate review (Sonar: 52% do not always verify)
- Developers *believing* AI improved their performance when it did not (METR: +20% perceived vs. -19% actual)
- Code duplication and refactoring collapse as developers accept generated code rather than integrating it thoughtfully (GitClear: 8x duplication increase, 60% refactoring decline)

---

## Sources (Complete List)

1. [Bansal et al. 2021 - "Does the Whole Exceed Its Parts?" (ACM)](https://dl.acm.org/doi/10.1145/3411764.3445717)
2. [Mozannar & Sontag 2020 - "Consistent Estimators for Learning to Defer" (ICML)](https://proceedings.mlr.press/v119/mozannar20b.html)
3. [Raghu et al. 2019 - "The Algorithmic Automation Problem" (arXiv)](https://arxiv.org/abs/1903.12220)
4. [Raghu et al. 2019 - Direct Uncertainty Prediction Blog](https://maithraraghu.com/blog/2019/Direct_Uncertainty_Prediction/)
5. [Madras et al. 2018 - "Predict Responsibly" (NeurIPS)](https://proceedings.neurips.cc/paper/2018/hash/09d37c08f7b129e96277388757530c72-Abstract.html)
6. [Vodrahalli et al. 2022 - "Do Humans Trust Advice More if it Comes from AI?" (AIES)](https://arxiv.org/abs/2107.07015)
7. [Vodrahalli et al. 2022 - "Uncalibrated Models Can Improve Human-AI Collaboration" (NeurIPS)](https://proceedings.neurips.cc/paper_files/paper/2022/file/1968ea7d985aa377e3a610b05fc79be0-Paper-Conference.pdf)
8. [DORA 2025 State of AI-Assisted Software Development](https://dora.dev/dora-report-2025/)
9. [DORA 2025 Analysis (Faros.ai)](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025)
10. [Sonar 2026 State of Code Developer Survey](https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/)
11. [Sonar Blog Post on AI Code Verification](https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding)
12. [METR 2026 - SWE-bench PRs and Maintainer Review](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/)
13. [METR 2025 - AI Impact on Experienced Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
14. [Peng et al. 2023 - GitHub Copilot Productivity (arXiv)](https://arxiv.org/abs/2302.06590)
15. [Ziegler et al. 2024 - Measuring Copilot's Impact (CACM)](https://cacm.acm.org/research/measuring-github-copilots-impact-on-productivity/)
16. [GitClear 2025 AI Code Quality Research](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
17. [GitClear Report Summary (jonas.rs)](https://www.jonas.rs/2025/02/09/report-summary-gitclear-ai-code-quality-research-2025.html)
18. [Guo et al. 2017 - "On Calibration of Modern Neural Networks" (arXiv)](https://arxiv.org/abs/1706.04599)
19. [Kadavath et al. 2022 - "Language Models (Mostly) Know What They Know" (arXiv)](https://arxiv.org/abs/2207.05221)
20. [Vaccaro et al. 2024 - Human-AI Meta-Analysis (Nature Human Behaviour)](https://www.nature.com/articles/s41562-024-02024-1)
21. [Fok et al. 2023 - "In Search of Verifiability" (arXiv)](https://arxiv.org/abs/2305.07722)
22. [DeepMind Safety Research - Human-AI Complementarity (Medium)](https://deepmindsafetyresearch.medium.com/human-ai-complementarity-a-goal-for-amplified-oversight-0ad8a44cae0a)
23. [Chow 1970 - Optimal Reject Rules (via JMLR review)](https://jmlr.org/papers/volume24/21-0048/21-0048.pdf)
24. [Automation Bias Review - Springer AI & Society 2025](https://link.springer.com/article/10.1007/s00146-025-02422-7)
25. [LLM Calibration Survey - NAACL 2024](https://aclanthology.org/2024.naacl-long.366.pdf)
26. [Adaptive Temperature Scaling - EMNLP 2024](https://aclanthology.org/2024.emnlp-main.1007.pdf)
27. [IT Pro - Sonar Verification Gap Coverage](https://www.itpro.com/software/development/software-developers-not-checking-ai-generated-code-verification-debt)
