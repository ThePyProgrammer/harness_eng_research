# Peer Review: "The Accretion Category: A Novel Defect Class for AI-Generated Code"

**Reviewer perspective:** Senior researcher at a major AI lab, building and shipping LLM-based coding tools daily.

---

## 1. Summary

The paper identifies a new defect class ("accretion") defined as code changes that are individually correct, superfluous, individually defensible, and collectively harmful, arguing this emerges from statistical pattern completion in LLMs. It proves individual accretion detection is undecidable (via reduction to program equivalence), proposes aggregate detection through statistical process control on coupling complexity metrics, develops a taxonomy of 18 "slop types" across three generative factors (context blindness, completion bias, training distribution leakage), and proposes a 4-layer defense architecture with a cost-of-quality model. Empirical grounding draws on GitClear, DORA 2025, CodeRabbit, and METR data, though no primary experiments are conducted.

---

## 2. Assessment of the Paper's Model of LLM Code Generation

### What it gets right

The core observation is real and important: AI coding tools do produce code that is individually defensible but collectively degrades codebases. Anyone who has operated these systems at scale has seen exactly this. The GitClear duplication data and the DORA productivity-vs-throughput paradox are genuine signals that something is going wrong at the aggregate level. The paper deserves credit for naming this phenomenon and attempting to formalize it.

The three generative factors (context blindness, completion bias, training distribution leakage) are reasonable first-order descriptions of failure modes. Context blindness (F1) accurately captures the information bottleneck problem: the model cannot attend to what it cannot see, and effective context is always a subset of the required codebase knowledge. Training distribution leakage (F3), covering hallucinated imports and outdated APIs, is well-documented and uncontroversial.

### What it gets wrong or oversimplifies

**"Statistical pattern completion" is a stale description of modern agentic coding tools.** [MAJOR]

The paper repeatedly characterizes LLM code generation as "statistical pattern completion" producing "the most probable continuation of the context." This was a reasonable description of GitHub Copilot circa 2022. It is not an accurate description of Claude Code, OpenAI Codex (the agentic version), Cursor Agent, or Windsurf in 2026. These systems:

- Maintain multi-step plans with explicit goals and subtask decomposition
- Read codebases through tool use (file search, grep, AST analysis) before generating
- Run tests, observe failures, and iterate on their own output
- Use structured prompts that include coding standards, architectural guidelines, and project context
- Employ chain-of-thought reasoning and self-critique before committing code

The paper acknowledges these tools exist (it lists them in the introduction) but then analyzes them as if they are next-token predictors. The generative mechanism section (Definitions 4.1-4.3) models a system that generates code from a fixed context window without iterative refinement. Modern agentic tools can, and do, read the existing implementation before writing new code, run the code, observe the results, and revise. This does not eliminate accretion, but it changes the mechanism substantially. The paper's causal story ("code is produced because it is probable, not because it is necessary") is less accurate for an agent that has been explicitly instructed to "use the existing utility function at src/utils/format.ts" and has read that file.

**Completion bias (F2) conflates model architecture with system design.** [MAJOR]

The claim that "the agent's output distribution assigns higher probability to syntactically complete outputs than to semantically minimal correct outputs" treats the raw model distribution as the system output. In production, we control verbosity through system prompts, output parsers, diff-mode generation (where the model outputs only the changed lines, not complete files), and post-processing that strips boilerplate. The paper presents completion bias as intrinsic and immutable. In practice, it is a tunable system property. We have reduced completion bias substantially over the past 18 months through better prompting, RLHF targeting conciseness, and architectural changes like diff-based editing modes.

**The three-factor orthogonality claim is load-bearing but unsupported.** [MAJOR]

Proposition 4.1 asserts that F1, F2, and F3 are approximately orthogonal, then uses this to argue that interventions compose multiplicatively and the "quality stack must address all three independently." The paper admits this is an "Engineering Hypothesis" without empirical validation, but the entire defense architecture (Section 7) and several design principles depend on it. In practice, these factors are deeply entangled. Better context retrieval (addressing F1) absolutely does reduce completion bias (F2), because when the model can see that a concise utility already exists, it is far less likely to generate a verbose alternative. Similarly, better context reduces training distribution leakage (F3) because the model can see what packages are actually installed rather than hallucinating plausible ones. The factors are correlated, not orthogonal, and interventions addressing one often ameliorate others.

---

## 3. Feasibility of the 4-Layer Defense Architecture at Scale

### Layer 1 (Structural gates): Feasible [MINOR issues]

Type checking, import validation, lint, dead code detection: these are standard CI checks. The $0.50/PR cost and 2-10s latency are realistic. Most serious engineering organizations already run these. The paper is correct that this layer is always cost-effective. The only issue is the "diff budget enforcement" proposal, which is not well-defined and could be disruptive if implemented naively (sometimes the correct change is large).

### Layer 2 (Deterministic analysis): Mostly feasible [MINOR issues]

AST scanning for stubs/placeholders, clone detection, cyclomatic complexity thresholds: these are standard static analysis capabilities (SonarQube, Semgrep, etc.). The 10-60s latency is realistic. The $2.00/PR cost is plausible. Clone detection at O(n log n) via suffix trees is well-understood. The main gap is that the paper does not discuss incremental analysis; running full-codebase clone detection on every commit is expensive for large monorepos (100k+ files). Incremental approaches exist but add engineering complexity.

### Layer 3 (LLM-as-Judge): Problematic at scale [MAJOR]

This is where the paper's architecture faces serious deployment challenges that it does not address:

**Latency.** 20-120 seconds per PR is quoted, but this assumes a single LLM call. Real scope compliance checking (does the diff match the task description?) requires the model to read both the task specification and the full diff, often with surrounding context. For a 500-line diff touching 15 files, you need to include substantial context in the prompt. In practice, this means 30-90 seconds per check, and you may need multiple checks (scope compliance + abstraction audit + test quality + naming consistency = 4 calls). Total latency: 2-6 minutes per PR. At 100 PRs/day, this is manageable. At 500 PRs/day (which is common for large engineering organizations with AI-assisted development), you need significant parallelism and the cost scales to $4,000/day or roughly $1M/year for Layer 3 alone.

**False positive fatigue.** The paper correctly identifies the false positive cost trap (1.3 FTEs at 25% FP rate, 100 PRs/week) but does not propose solutions beyond noting it. In practice, 15-35% FP rates (Table 3) are unacceptable for a non-blocking layer that developers are expected to triage. After two weeks of noisy alerts, developers stop reading them. The Spotify Honk data (25% veto rate) is from a system where the agent self-corrects, not where humans triage; those are very different operational models.

**The paper ignores the cold-start and calibration problem.** Each codebase has different conventions, different architectural patterns, different definitions of "justified abstraction." An LLM-as-Judge that works well for a React frontend codebase will produce garbage findings on an embedded systems C codebase. The paper presents Layer 3 as generic, but in practice it requires per-project calibration that the paper does not account for.

### Layer 4 (Human review): Correct but obvious [MINOR]

The paper is right that human review should be reserved for high-severity flagged items. This is how code review already works. The $80/PR cost is realistic for a thorough architectural review. The paper does not add much beyond existing best practice here.

### The architecture as a whole ignores operational reality [MAJOR]

The 4-layer stack is presented as a clean cascade where each layer filters inputs to the next. Real CI/CD pipelines do not work this way. Layers 1 and 2 can block commits (synchronous gates), but Layer 3 runs asynchronously, which means code may be merged before Layer 3 results are available, especially in trunk-based development workflows with merge queues. The paper does not discuss how the defense architecture interacts with branching strategies, merge queues, deployment pipelines, or rollback mechanisms. This is not a theoretical quibble; it determines whether the architecture is deployable.

---

## 4. Assessment of the "Coupling Complexity" Metric

### Theoretical soundness

The definition (mean log-coupling-degree) is mathematically clean and the remark correctly distinguishing it from Shannon entropy shows care. The accretion rate (coupling complexity change per unit of code change) is a reasonable derivative metric. The compound degradation proposition (superlinear growth from cross-change coupling) is an interesting theoretical prediction, even if it is labeled an engineering hypothesis.

### Practical computability [MAJOR]

The metric requires computing mu(f_i), the minimum set of files a developer must understand to correctly modify f_i. The paper acknowledges this must be approximated via "static analysis of import/call graphs" and specifically via "the transitive closure of the import graph." This is where things break down for real codebases:

**Transitive closure is too coarse.** In a typical Node.js monorepo, the transitive closure of the import graph from any file in the API layer reaches virtually every file in the project (through shared types, utility functions, configuration). This makes Gamma(C) approximately log2(n) for most files, and the metric becomes insensitive to actual coupling changes. You need a more nuanced approximation (e.g., weighted by call frequency, or bounded by depth) to get useful signal.

**Dynamic languages resist static analysis.** For Python, Ruby, and JavaScript (which together represent most AI-generated code), import/call graph extraction is approximate at best. Dynamic imports, monkey-patching, dependency injection, and reflection all create edges invisible to static analysis. The metric's accuracy degrades precisely for the languages where AI code generation is most prevalent.

**Comparison to existing metrics.** The paper does not compare coupling complexity to metrics already deployed at scale:

- **SonarQube cognitive complexity** is computed per-function, runs incrementally, and is already integrated into thousands of CI pipelines. It measures a different thing (within-function complexity vs. between-file coupling), but it is actually computable.
- **CodeClimate maintainability** combines duplication, complexity, and file length into a single score with established thresholds.
- **Dependency fan-out** (which the paper itself proposes as one of four aggregate signals) is cheaper to compute and more directly actionable than the full coupling complexity metric.

The paper's own Section 6.4 (Dependency Fan-Out Trends) essentially proposes a cheaper, more practical alternative to its own headline metric, without acknowledging the tension.

### Scalability constraints [MAJOR]

Computing Gamma(C) at "weekly cadence" (as proposed in Section 6.5) requires building the full dependency graph and computing transitive closures. For a monorepo with 50,000+ files, this is a non-trivial computation. For polyglot codebases (which are increasingly common), you need language-specific parsers for every language in the repo. The paper presents this as a simple monitoring task; in practice, it is a significant infrastructure investment that competes for the same engineering resources as the features the AI is generating.

---

## 5. Missing Perspective: Technology Improvement Trajectory

This is the paper's most significant blind spot. [MAJOR]

### Context windows and retrieval

The paper's "context blindness" (F1) is modeled as a static property of the generation process. In reality, effective context has expanded dramatically and continues to expand:

- Context windows have grown from 4K tokens (GPT-3.5, early 2023) to 200K+ tokens (Claude, Gemini) in production. 1M+ token contexts are available in some configurations.
- RAG-based codebase indexing (used by Cursor, Cody, and built into Claude Code's tool use) means the agent can search and retrieve relevant code before generating. The "context deficit" |K \ K_hat| is shrinking rapidly.
- Codebase-aware generation (where the agent reads the target file, its imports, its tests, and related files before writing) is now standard in agentic tools. This directly reduces duplicate logic, naming drift, and architectural erosion (all F1 types).

The paper does not model the rate at which F1 is being mitigated by improvements in retrieval and context handling. If effective context doubles every 12-18 months (a reasonable extrapolation from the past three years), several of the F1-loaded slop types may become rare within 2-3 years without any explicit defense architecture.

### RLHF and instruction following

Completion bias (F2) is being directly targeted by training improvements. RLHF/RLAIF with human preferences for conciseness, models trained specifically to produce minimal diffs, and post-training optimization for "do exactly what was asked, nothing more" are active areas of investment at every major lab. The paper treats F2 as a fundamental property of statistical generation. It is better understood as a training objective alignment problem that is being actively solved.

### Agentic self-correction

Modern agentic tools already implement rudimentary versions of what the paper proposes as external defenses. Claude Code, for example, can be configured with project-specific rules that instruct it to check for existing utilities before creating new ones, to minimize diff size, and to prefer modifying existing code over creating new files. These are not external defense layers; they are generation-time interventions that reduce accretion at the source. The paper's framework does not account for generation-time quality improvements, only post-generation detection.

### The implication

The paper presents accretion as a structural consequence of statistical generation that requires external defense architectures to address. A more nuanced view is that accretion is a current-generation problem being actively mitigated by improvements in the underlying technology. The paper's defense architecture may be addressing a problem that is shrinking faster than the architecture can be deployed. This does not invalidate the framework (the problem is real today), but it significantly affects the cost-benefit analysis of investing in the proposed 4-layer defense.

---

## 6. Issue Severity Ratings

| # | Issue | Severity |
|---|-------|----------|
| 1 | "Statistical pattern completion" is a stale characterization of modern agentic coding tools; the causal model does not match how these systems actually work in production | MAJOR |
| 2 | Completion bias (F2) is presented as intrinsic and immutable; in practice it is a tunable system property being actively reduced through training and system design | MAJOR |
| 3 | Three-factor orthogonality (Proposition 4.1) is load-bearing but unsupported, and likely wrong (the factors are correlated, and interventions on one ameliorate others) | MAJOR |
| 4 | Layer 3 (LLM-as-Judge) cost, latency, and false-positive analysis is incomplete; deployment at scale (500+ PRs/day) faces serious operational challenges the paper ignores | MAJOR |
| 5 | The 4-layer cascade does not account for real CI/CD pipeline mechanics (async execution, merge queues, trunk-based development) | MAJOR |
| 6 | Coupling complexity metric is impractical to compute on real codebases due to transitive closure coarseness, dynamic language limitations, and scalability constraints; no comparison to existing deployed metrics | MAJOR |
| 7 | No account of technology improvement trajectory: context windows, RAG, RLHF for conciseness, agentic self-correction are all actively reducing accretion; the defense architecture may be solving a shrinking problem | MAJOR |
| 8 | No primary empirical validation: no labeled dataset, no experiments, no measured precision/recall for any proposed detector | MAJOR |
| 9 | The 18-type taxonomy is admittedly derived from practitioner intuition without statistical validation; CFA has not been done | MINOR |
| 10 | The undecidability result (Theorem 5.1) is correct but practically irrelevant; undecidability of the general case does not prevent highly effective heuristic detection in practice (cf. type checking, which is undecidable in general but works fine for real programs) | MINOR |
| 11 | The refactoring ratio equilibrium threshold (r >= 0.20) is extrapolated from one dataset (GitClear) without validation across different codebase types, team sizes, or development workflows | MINOR |
| 12 | Cost-of-quality ratios (1:3:100 for decidable, 1:15:100 for partially detectable, 1:50:30 for undetectable) are "extrapolated qualitatively" from Boehm's 1981 data, which predates AI code generation by four decades | MINOR |
| 13 | The paper's METR merge-gap interpretation is more careful than most (noting the 68% baseline for human patches), but still overstates the AI-attributable gap by not controlling for task difficulty distribution in SWE-bench vs. real-world PRs | MINOR |

---

## 7. Verdict: Weak Accept

The paper identifies a real and important problem that practitioners are experiencing daily. The core insight (individually correct changes can collectively degrade codebases, and AI generation accelerates this) is valuable and worth publishing. The formal framework, while imperfect, provides useful vocabulary and conceptual structure for discussing a phenomenon that currently lacks adequate terminology.

However, the paper's causal model of LLM code generation is outdated, its proposed defense architecture has not been tested against operational reality, its headline metric is impractical to compute, and it does not account for the rapid pace of improvement in the underlying technology. The paper reads as if it was written by someone who has studied AI coding tools from the outside (reading reports, analyzing data) rather than someone who builds and operates them daily.

The mathematical results are sound where they claim to be mathematical facts, and the paper is commendably honest about labeling engineering hypotheses separately. The contrarian positions section (Section 10) is unusually strong and shows intellectual rigor. The verification roadmap (Table 4) with explicit falsification criteria is excellent practice.

**Why not "Borderline" or "Weak Reject":** The problem is real, the naming is useful, and the formal framework (even if imperfect) advances the conversation beyond anecdote. The paper's insistence on separating mathematical facts from engineering hypotheses is a model other papers should follow.

**Why not "Accept":** Eight MAJOR issues, no primary empirical validation, and a causal model that does not accurately describe the systems it claims to analyze.

---

## 8. What Would Make This Paper Useful to Someone Building Coding Tools

1. **Update the generative model to match modern agentic architectures.** The paper should model a system that reads context, plans, generates, tests, and iterates, not a next-token predictor with a fixed context window. The accretion phenomenon still exists in agentic systems, but the mechanism is different (the agent may choose a suboptimal plan, not just a suboptimal completion), and the intervention points are different (you can improve the planning step, not just add post-hoc detection).

2. **Replace coupling complexity with something computable.** Dependency fan-out trend (which the paper already proposes as a secondary signal) is more practical than the headline metric. Alternatively, propose a weighted, depth-bounded variant of coupling complexity that does not require full transitive closure and can be computed incrementally. Compare it empirically to SonarQube cognitive complexity and CodeClimate maintainability on a real codebase.

3. **Benchmark the 4-layer defense on a real CI/CD pipeline.** Pick 3-5 open-source projects with active AI-assisted development. Implement Layers 1-3. Measure false positive rates, latency impact on developer workflow, and (most importantly) whether the aggregate metrics (coupling complexity, refactoring ratio, clone frequency, fan-out) actually trend differently with and without the defense layers enabled. Without this, the architecture is speculative.

4. **Model the technology improvement curve.** Add a section that explicitly models how improvements in context windows, retrieval, and training objectives affect the accretion rate over time. Provide a framework for estimating when (or whether) each slop type will become rare enough that dedicated detection is no longer cost-effective. This would make the paper a living guide rather than a snapshot.

5. **Focus on the aggregate detection insight, which is genuinely novel and useful.** The strongest contribution is the shift from per-change defect detection to longitudinal codebase health monitoring (Section 6). This insight is practical, actionable, and not well-served by existing tools. A paper focused on "statistical process control for codebase health under AI-assisted development" with actual experiments would be immediately useful to every team shipping AI coding tools.

6. **Provide concrete integration recipes for common CI systems.** The paper operates at a level of abstraction too high for practitioners to act on. A section showing "here is how to implement the multi-signal detection approach in GitHub Actions / GitLab CI / Buildkite, here are the specific tools for each signal, here are the thresholds we recommend starting with" would make the paper a reference rather than a position piece.

7. **Engage with the generation-time intervention opportunity.** The entire paper frames defenses as post-generation detection. But the most cost-effective intervention point is during generation: system prompts that enforce minimality, tool-use patterns that check for existing implementations before creating new ones, diff-mode generation that forces minimal changes. These are being deployed today and are dramatically cheaper than Layer 3 (LLM-as-Judge). A framework that integrates generation-time quality with post-generation detection would be substantially more useful.

---

*Reviewed 2026-04-03. Reviewer declares no financial conflict of interest. The reviewer works on production LLM-based coding tools and has direct experience with several of the phenomena described in the paper.*
