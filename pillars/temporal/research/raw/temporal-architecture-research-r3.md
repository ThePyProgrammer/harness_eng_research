# R3: Contrarian Positions on Temporal Architecture of AI Coding Agent Harnesses

**Research Agent R3 | Contrarian and Alternative Perspectives**
**Generated: 2026-04-03**

---

## Executive Summary

This report steel-mans five contrarian positions against the temporal optimizations proposed in the paper on "Temporal Architecture of AI Coding Agent Harnesses." Each position represents a genuine threat to the paper's assumptions: that faster iteration is better, that incremental context is cheaper than fresh context, that speculative execution saves time, that mode selection can be automated, and that caching reduces cost. The strongest versions of these arguments draw on cognitive science, systems engineering, empirical software quality data, and foundational computer science theory. The paper must engage these objections seriously or risk presenting an incomplete picture.

---

## 1. "Speed Kills Quality": The Case for Protective Pauses

### 1.1 The Kahneman Framework Applied to AI Coding Cycles

Daniel Kahneman's dual-process theory (Kahneman, 2011) distinguishes System 1 (fast, automatic, intuitive) from System 2 (slow, deliberate, analytical). System 1 is efficient but error-prone; it "can only deliver strong conclusions at lightning speed if it never pauses to wonder whether the evidence is flawed or inadequate" and "must treat available evidence as reliable and sufficient." System 2 catches errors but requires deliberate engagement and cognitive effort.

Applied to AI coding agent harnesses, the argument runs as follows: fast iteration cycles (sub-minute edit-test loops) keep both the agent and the human operator in a System 1 mode of interaction. The human reviews AI output quickly, approves changes quickly, and moves on. The deliberate, slow analysis that System 2 provides (questioning assumptions, checking edge cases, reasoning about architectural implications) never gets activated because the pace of interaction does not create space for it.

This is not merely a human-factors concern. If the harness architecture is optimized to minimize latency at every stage, the entire system (human + agent + feedback loop) may converge on locally optimal but globally suboptimal solutions. The agent produces code that passes tests quickly; the human approves it quickly; neither pauses to ask whether the approach is correct at a deeper level.

### 1.2 Incubation Effects in Problem-Solving

Graham Wallas (1926) proposed four stages of creative problem-solving: preparation, incubation, illumination, and verification. The incubation stage, where the problem is set aside, has been empirically validated: 29 out of 39 experiments reviewed found a significant incubation effect (Sio and Ormerod, 2009). Research published in Frontiers in Psychology found that unconscious processes actively contribute during incubation periods; this is not merely forgetting and re-approaching, but genuine cognitive work happening below conscious awareness (Ritter and Dijksterhuis, 2014).

Sleep studies have demonstrated that insight can be "dramatically enhanced by a period of sleep following initial work on a problem." Positive mood broadens associative networks, and when followed by an incubation period, "dramatically enhances the likelihood of generating a creative solution."

The implication for harness design: a temporal architecture that eliminates all pauses between writing and shipping may inadvertently eliminate the incubation stage. Complex bugs, architectural misalignments, and subtle design flaws often surface not during active work but during the gaps between work sessions. A harness that runs continuously without protective pauses may produce more code faster while missing the insights that emerge from stepping away.

### 1.3 Yerkes-Dodson Law and Time Pressure

The Yerkes-Dodson law (1908) establishes an inverted-U relationship between arousal/stress and performance. Critically, the optimal arousal level depends on task complexity: "simple tasks performed best when arousal levels are relatively high, and complex tasks best performed when arousal levels are lower." For highly complex or novel tasks, performance "can worsen as arousal increases, producing a mostly downward slope with little or no 'rising' phase."

Software engineering tasks, particularly architectural decisions, debugging complex systems, and reasoning about concurrency, are unambiguously on the "complex" end of the spectrum. Time pressure acts as an arousal mechanism. A harness architecture that optimizes for speed creates implicit time pressure on every decision in the loop, pushing the system toward the descending limb of the Yerkes-Dodson curve precisely when complex reasoning is most needed.

### 1.4 Empirical Evidence: Faster AI Coding Correlates with Higher Defect Rates

The GitClear 2025 report, analyzing 211 million lines of code, found that as AI coding tool adoption increased:

- **Code churn** (code revised within two weeks of commit) grew from 3.1% in 2020 to 5.7% in 2024, nearly doubling
- **Code cloning** increased 4x, with copy/paste exceeding refactored ("moved") code for the first time in history
- **Refactoring declined** from 24.1% of changes in 2020 to 9.5% in 2024

The Google DORA 2024 and 2025 reports found what they term the "AI Productivity Paradox": AI coding assistants boost individual output (21% more tasks completed, 98% more pull requests merged) but organizational delivery stability drops by 7.2% for every 25% increase in AI adoption. AI-coauthored pull requests show approximately 1.7x more issues than human-only pull requests.

These findings are consistent with the "speed kills quality" thesis. The harness paper's temporal optimizations, by further accelerating cycles that are already producing measurable quality degradation, may amplify rather than mitigate these effects.

### 1.5 The "Move Fast and Break Things" Critique

Facebook's original motto became a cautionary tale. As the platform scaled to 500 billion API calls per day, Zuckerberg changed the motto to "move fast with stable infrastructure," implicitly acknowledging that speed without stability creates compounding costs. The broader critique: speed-first development is "a high-interest payday loan; it buys optics today and compounds debt tomorrow." Hurrying creates tight coupling, higher technical debt, and system complexity that actually slows down development over time.

The counterargument is worth noting: an empirical study of 70 VC-backed startups found technical debt explains only 5.2% of variance in development velocity at the company level. However, this study examined the ZIRP era of venture-funded startups, a context where growth trumped sustainability. For long-lived production systems (the primary use case of AI coding harnesses), the debt accumulation story is more compelling.

### 1.6 Synthesis: The Protective Pause as Quality Infrastructure

The strongest version of this argument is not that speed is always bad, but that the temporal architecture should include deliberate protective pauses, analogous to code freezes, cooling-off periods, and mandatory review gates. Mat Ryer argues for "cool-down periods" in development teams: "Critical thinking takes time. We need to consider the idea if we want to be sure it's worth doing. The moments after the idea emerges, when we are fizzing with that addictive feeling of urgency and anticipation, is when we are most susceptible to brash decisions."

A harness that can go fast should also know when to go slow. The paper's temporal architecture may need a "governed pause" mode as a first-class temporal primitive, not a speed bump but a quality-generating mechanism.

---

## 2. "Fresh Eyes Is Worth the Cost": The Case Against Incremental Context

### 2.1 The GSD Accuracy Advantage

The paper reports that the GSD (Get Stuff Done) approach, which starts each cycle with fresh context, achieves 17.1% higher accuracy than incremental approaches that carry context forward. The incremental approach saves 8-12 minutes per cycle on re-reading. The paper frames this as a tradeoff favoring incrementalism for most cases.

The contrarian position inverts this framing: 17.1% is an enormous accuracy advantage. In domains where correctness matters (financial systems, medical software, security-critical code, infrastructure), a 17% accuracy difference is the difference between acceptable and unacceptable. The 8-12 minute re-read cost is a small price to pay for substantially better outcomes. Framing it as a "tax" prejudges the question; it could equally be framed as an "investment" with measurable returns.

### 2.2 The "Lost in the Middle" Phenomenon

Liu et al. (2023, published TACL 2024) demonstrated that language model performance "can degrade significantly when changing the position of relevant information," with accuracy highest when relevant information appears at the beginning or end of input and "significantly degrading when models must access relevant information in the middle of long contexts, even for explicitly long-context models."

This finding has direct implications for incremental context approaches. As a coding agent works through a task incrementally, the context window accumulates: initial instructions, early code changes, intermediate reasoning, tool outputs, error messages, and corrections. The critical information (the current state of the code, the remaining task requirements) may be buried in the middle of this accumulated context, precisely where models perform worst.

### 2.3 Context Rot: Every Model Gets Worse

Chroma's 2025 research on "context rot" formalized what practitioners had observed informally: as input length increases, output quality decreases, and this is universal. Testing 18 frontier models (including GPT-4.1, Claude Opus 4, Gemini 2.5 Pro, Qwen3-235B), they found that "every single one gets worse as input length increases."

Key mechanisms identified:

- **Attention dilution**: Transformer attention is quadratic; 100K tokens means 10 billion pairwise relationships. "Information that was highly attended at 1,000 tokens may be functionally ignored at 100,000 tokens."
- **Distractor interference**: "Semantically similar but irrelevant content actively misleads the model," causing degradation beyond what context length alone explains. Adding just 10% irrelevant content reduced accuracy by 23%.
- **The U-shaped curve**: Models show "high accuracy for information at the start and end of context, 30%+ lower accuracy for information in the middle."

Context rot is "an architectural property of transformer-based attention, not a capability gap that training solves." This is a fundamental constraint, not a temporary limitation.

### 2.4 Context Window Pollution in Incremental Coding

Incremental context accumulates what might be called "context pollution": previous reasoning that is no longer relevant, superseded code versions, error messages from earlier attempts, and intermediate states that were stepping stones rather than destinations. Each of these adds tokens that dilute attention and increase the probability of distractor interference.

Anthropic's own engineering guidance on context engineering for AI agents emphasizes that the key question is "how do I keep irrelevant tokens out?" rather than "how do I fit more tokens in?" Recommendations include isolating search into subagents that return only precise results and using compact diffs rather than full file contents. These are mitigation strategies for the fundamental problem that more context is not better context.

### 2.5 When Fresh Context Wins: A Decision Framework

The fresh-context approach wins when:

1. **Task complexity is high**: Complex tasks benefit from the full re-read because the model can form a coherent understanding without interference from accumulated intermediate states
2. **Previous attempts have failed**: Failed reasoning paths in context can anchor the model toward the same failures (a form of anchoring bias in LLMs)
3. **The task has changed direction**: If requirements or approach have shifted mid-stream, accumulated context contains misleading signals from the old direction
4. **Correctness is more valuable than speed**: The 17.1% accuracy advantage compounds over multiple dependent steps in a pipeline
5. **The accumulated context exceeds ~50K tokens**: At this point, context rot effects become significant even in frontier models

The paper should consider that the "break-even point" where incremental context becomes net-negative may occur earlier than expected, and that for many real-world tasks, paying the re-read cost is the rational choice.

---

## 3. "Speculative Execution Has Hidden Costs": Beyond Wasted Tokens

### 3.1 The CPU Analogy and Its Warning

Speculative execution in CPUs was considered a pure optimization for over two decades. Processors would predict which branch of a conditional would be taken, execute instructions along that predicted path, and discard the results if the prediction was wrong. The only cost appeared to be wasted work on mispredicted branches.

Then, in January 2018, Spectre and Meltdown were disclosed. These vulnerabilities exploited the fact that speculative execution, while discarding architectural state on misprediction, left traces in microarchitectural state (cache lines, branch predictor state) that could be observed through timing side channels. The vulnerabilities affected "nearly every computer chip manufactured in the last two decades," with Intel processors since 1995 being potentially vulnerable to Meltdown. Spectre, in particular, is "harder to exploit than Meltdown, but it is also harder to mitigate."

The lesson for AI coding harnesses: speculative execution creates state changes that are difficult to fully reverse, and the consequences of incomplete reversal may not surface for a long time. In the CPU case, it took over 20 years for the security implications to be discovered.

### 3.2 Branching State Complexity

When speculative execution encounters a branch, it must track both the speculative state and the committed state, ready to discard one. When a second branch appears within speculative execution, the complexity compounds: "a new conditional block needs to be opened, creating a new code split before the previous one is resolved. Such subsequent code splits increase the cost of speculation management."

In an AI coding harness, speculative execution might involve starting work on subtask B while subtask A is still being verified. If subtask B depends on assumptions about A's outcome, the speculative work creates a branching state space. If A's verification fails or produces unexpected results, the speculative work on B may need to be discarded, partially revised, or carefully reconciled. The complexity of managing this reconciliation grows combinatorially with the number of concurrent speculative paths.

### 3.3 Debugging Difficulty

Speculative execution makes debugging harder because the system's state at any point includes both committed and speculative components. When something goes wrong, the developer (or the agent) must reason about which path was speculative, what assumptions it was based on, and whether a failure arose from the speculative path itself or from the interaction between speculative and committed state.

In CPU architectures, this debugging difficulty manifests as the need for "detailed verification models" that "add complexity to the verification task." In software systems, speculative execution patterns (optimistic concurrency, speculative prefetching, predictive processing) are notoriously difficult to debug because the causal chain of events includes hypothetical branches that may or may not have been taken.

### 3.4 Rollback Costs Are Not Zero

The paper may treat speculative execution rollback as cheap: if the speculation was wrong, discard the results and proceed correctly. But rollback has costs beyond the wasted computation:

1. **State pollution**: Even discarded speculative work may leave traces (created files, partial writes, modified caches, logged events) that need cleanup
2. **Opportunity cost**: While executing speculatively, the system could have been doing verified work
3. **Cognitive overhead**: The human in the loop must understand that some of what they are seeing is speculative, track which results are committed vs. tentative, and reason about the implications of rollback
4. **Compounding errors**: If speculation A feeds into speculation B, and A is wrong, B's work is not just wasted but may have produced artifacts (test results, cached computations) that persist and mislead

### 3.5 The Complexity Budget

Every system has a finite complexity budget. Speculative execution consumes a significant portion of it: the harness must implement prediction logic, state tracking, rollback mechanisms, reconciliation protocols, and monitoring for all of these. This complexity is not free; it competes with other uses of engineering effort and creates additional surface area for bugs.

The contrarian argument: for many workloads, the time saved by speculative execution is modest (perhaps 10-30% per cycle), while the complexity cost is substantial and ongoing. A simpler sequential architecture may be slower per cycle but more reliable, easier to debug, and cheaper to maintain. The speculative execution optimization may only be justified for very high-volume, highly predictable workloads where the prediction accuracy is consistently above 90%.

---

## 4. "Mode Selection Is Hard to Automate": The Ironies of Automation

### 4.1 Bainbridge's Ironies (1983)

Lisanne Bainbridge's "Ironies of Automation" (1983), with over 1,800 citations, identified a set of paradoxes that arise when human tasks are automated. The core irony relevant to mode selection:

> "If the decisions can be fully specified then a computer can make them more quickly, taking into account more dimensions and using more accurately specified criteria than a human operator can. There is therefore no way in which the human operator can check in real-time that the computer is following its rules correctly."

But the deeper irony is worse:

> "If the computer is being used to make the decisions because human judgement and intuitive reasoning are not adequate in this context, then which of the decisions is to be accepted? The human monitor has been given an impossible task."

Applied to harness mode selection: the paper proposes that the harness automatically selects between Fast, Standard, and Governed modes based on task characteristics. But this creates Bainbridge's double bind. If the mode selection rules can be fully specified, they can be automated, but the human cannot verify in real-time that the selection is correct. If the mode selection requires judgment that cannot be fully specified (which is likely, given the fuzzy boundaries between modes), then automating it with heuristics will produce systematic errors at the classification boundary, and the human tasked with overseeing the automation will lack the context to catch those errors.

### 4.2 The Fuzzy Classification Boundary

The boundary between "trivial change" (Fast mode), "standard task" (Standard mode), and "critical system change" (Governed mode) is not crisp. Consider:

- A one-line configuration change that affects authentication behavior
- A "simple" refactoring that inadvertently changes method signatures across an API boundary
- A documentation update that reflects a misunderstanding of system behavior
- A test fix that masks a real bug by changing expected values

Each of these might appear trivial by surface metrics (lines changed, files touched, AST diff size) but has deep implications. The features that distinguish genuinely trivial changes from deceptively simple ones are precisely the features that are hardest to extract automatically: semantic impact, architectural coupling, historical context of why the code exists, and domain-specific risk assessment.

### 4.3 Automation Bias

Research on automation bias shows that humans interacting with automated classification systems tend to over-trust the system's judgment (Goddard et al., 2012). The 2024 research on human-AI decision-making found that "non-specialists, who stand to gain the most from clinical decision support systems, are also the most susceptible to automation bias."

In the harness context: if the mode selector says "Fast mode," the developer is likely to accept that classification without scrutiny, especially under time pressure. The mode selector thus becomes a single point of failure for quality; a wrong classification that sends a critical change through Fast mode (skipping verification gates) could introduce defects that would have been caught in Governed mode. The developer, having delegated the classification decision to the harness, has reduced their own situational awareness and is less likely to catch the error.

### 4.4 The Feature Engineering Problem

To automate mode selection, the harness needs features that predict the appropriate mode. Candidate features might include:

- Number of files changed
- Lines of code modified
- Whether tests are affected
- Which directories are touched
- Complexity metrics of changed code
- Historical defect rates of affected components

But this is itself an unsolved classification problem. The features that are easy to compute (line count, file count) are poor predictors of actual risk. The features that would be good predictors (semantic impact, architectural coupling, business criticality) are expensive to compute, requiring exactly the kind of deep analysis that mode selection is supposed to enable skipping.

This creates a recursive problem: to decide how much analysis to do, you need to do analysis. The mode selector either under-invests (using cheap, inaccurate features) or over-invests (computing expensive features to decide whether to compute expensive features), partially defeating the purpose of having modes in the first place.

### 4.5 When Human Judgment Outperforms

Research consistently shows that neither pure automation nor pure human judgment universally dominates; effectiveness depends on domain, task complexity, and integration design. In the harness context, human judgment outperforms automated mode selection when:

1. **The task involves novel risk categories** that the classifier has not been trained on
2. **Organizational context matters**: a "routine" change during a compliance audit period requires Governed mode regardless of technical characteristics
3. **The change is deceptively simple**: a senior engineer's intuition that "this feels risky" captures tacit knowledge that feature-based classifiers cannot
4. **Mode selection errors are asymmetric**: misclassifying a critical change as trivial (under-governing) is far more costly than misclassifying a trivial change as critical (over-governing), and humans are better at reasoning about asymmetric costs

The paper should consider that mode selection may be one of those tasks where partial automation with human override (Bainbridge's "human monitor" pattern) is more appropriate than full automation, at least until classification accuracy can be empirically validated.

---

## 5. "Caching Is a False Economy": When the Cure Is Worse Than the Disease

### 5.1 Phil Karlton's Law

"There are only two hard things in Computer Science: cache invalidation and naming things." This quip, attributed to Phil Karlton and popularized by Martin Fowler, captures a real engineering truth: caching introduces a fundamental consistency problem that is easy to underestimate. "Without effective invalidation, caches risk delivering stale data that can compromise application correctness and performance."

The tradeoff is inherent: "Frequent invalidation provides fresh data but lower performance, while rare invalidation provides better performance but risks stale data." There is no free lunch; every caching strategy is a bet about the staleness-tolerance of the consumer.

### 5.2 Staleness Bugs Are Subtle and Compound

Cache staleness bugs are among the hardest to detect and diagnose because:

1. **They are intermittent**: The bug only manifests when the cache contains stale data, which depends on the timing of updates and accesses
2. **They are state-dependent**: Reproducing the bug requires recreating the specific cache state that caused it
3. **They look correct**: The cached data was correct at some point; the error is that it is no longer current, which may not be obvious from inspection
4. **They compound**: A stale cache entry used as input to a computation produces a stale result, which may itself be cached, creating cascading staleness

In an AI coding harness, caching might include: cached file contents (which may have been modified by another process), cached AST parses (which are stale if the file changed), cached test results (which may not reflect current code state), cached dependency graphs (which change with any structural modification), and cached LLM responses (which are stale if the prompt context has changed).

Each cached item introduces a potential coherence violation. When multiple cached items interact (a cached dependency graph used to select files, whose cached contents are sent to the LLM with a cached system prompt), the probability of at least one stale item approaches 1 as the number of cached items grows.

### 5.3 False Cache Hits in AI Systems

In traditional caching, a cache hit either returns the correct data or clearly wrong data (wrong type, missing fields). In AI coding harnesses, a "false cache hit" is more insidious: the cached result looks plausible but reflects a previous state that no longer applies. Examples:

- Cached analysis of a function's behavior, where the function has since been modified
- Cached test results from a previous run, where dependencies have changed
- Cached LLM completions for a prompt that is semantically similar but meaningfully different from the current prompt
- Cached file hashes used for change detection, where the hash function collides or the file was modified and restored

Semantic similarity matching for cache keys (which would be necessary for LLM response caching) introduces an additional error mode: two prompts that appear similar enough to share a cached response may have subtle differences that change the correct answer. The cache hit rate becomes a misleading metric; high hit rates may include false hits that introduce errors.

### 5.4 Infrastructure Overhead

Caching infrastructure is not free. It requires:

- **Memory/storage**: Cache entries consume resources proportional to their number and size
- **Eviction logic**: Deciding what to evict (LRU, LFU, TTL, size-based) requires implementation and tuning
- **Invalidation logic**: Knowing when cached data is stale requires tracking dependencies between cached items and their sources
- **Consistency checks**: Verifying that cached data matches source data adds latency that partially offsets cache benefits
- **Monitoring and debugging**: Cache hit rates, staleness metrics, and coherence checks add observability requirements

For small-to-medium workloads, "modern databases are incredibly fast for simple queries, and the overhead of checking the cache, deserializing data, and managing cache keys can actually be slower than just hitting the database." Analogously, for small-to-medium AI coding tasks, the overhead of cache management may exceed the savings from avoided re-computation.

### 5.5 The Coherence Problem at Scale

As the number of cached items grows, maintaining coherence becomes combinatorially harder. Each cached item may depend on multiple source items, and each source item may affect multiple cached items. The dependency graph of cache invalidation mirrors the dependency graph of the software being developed, which is itself complex and incompletely known.

Cache coherency in multi-core processors is solved by hardware cache controllers that implement protocols like MESI (Modified, Exclusive, Shared, Invalid). These protocols are well-understood but required decades of engineering to get right, and they operate in a domain (memory locations with well-defined read/write semantics) far simpler than the domain of AI coding artifacts (files, AST nodes, test results, LLM responses, dependency graphs).

### 5.6 When Caching Is Not Worth It

The contrarian position is not that caching is always wrong, but that its benefits are often overstated and its costs understated, particularly for:

1. **Rapidly changing data**: If the underlying code changes frequently (as it does during active development), cache hit rates are low and staleness risk is high
2. **Low-latency sources**: If the uncached operation is already fast (reading a local file, parsing a small AST), caching adds complexity without meaningful speedup
3. **High-correctness requirements**: If stale data causes cascading errors (wrong code generated from stale context), the cost of a single cache coherence failure may exceed the cumulative savings from thousands of cache hits
4. **Small workloads**: For tasks involving fewer than 50-100 files, the re-computation cost is small and the cache management overhead is proportionally large

The paper should provide empirical evidence of cache hit rates and staleness rates in real coding workflows to substantiate the claimed benefits, rather than assuming caching is beneficial a priori.

---

## Cross-Cutting Theme: The Optimization Trap

A theme connecting all five contrarian positions is what might be called the "optimization trap": the tendency to optimize observable metrics (speed, latency, throughput) at the expense of less-observable but equally important properties (correctness, maintainability, debuggability, coherence). Each proposed temporal optimization in the paper (faster cycles, incremental context, speculative execution, automated mode selection, aggressive caching) improves a measurable metric while potentially degrading a harder-to-measure property.

The DORA findings crystallize this: AI adoption improves individual throughput metrics while degrading organizational stability metrics. The temporal architecture paper risks replicating this pattern at the harness level, building an engine that goes faster while being harder to steer.

The strongest version of the contrarian meta-argument: temporal architecture should optimize for the quality of decisions, not the speed of decisions. Speed is a means, not an end. A harness that makes excellent decisions slowly will outperform one that makes mediocre decisions quickly, because the cost of fixing bad decisions (rework, debugging, incident response) dwarfs the cost of making decisions slightly slower.

---

## Sources

### Section 1: Speed Kills Quality
- [Thinking, Fast and Slow, Wikipedia](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow)
- [System 1 and 2: Thinking fast? Slow down, Neurofied](https://neurofied.com/thinking-fast-slow-down-system-1-and-2/)
- [Incubation (psychology), Wikipedia](https://en.wikipedia.org/wiki/Incubation_(psychology))
- [Creativity: the unconscious foundations of the incubation period, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3990058/)
- [Incubation and Intuition in Creative Problem Solving, Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.01076/full)
- [Yerkes-Dodson Law, Simply Psychology](https://www.simplypsychology.org/what-is-the-yerkes-dodson-law.html)
- [Yerkes-Dodson law, Wikipedia](https://en.wikipedia.org/wiki/Yerkes%E2%80%93Dodson_law)
- [From law to folklore: Work stress and the Yerkes-Dodson Law, ResearchGate](https://www.researchgate.net/publication/282239292_From_law_to_folklore_Work_stress_and_the_Yerkes-Dodson_Law)
- [AI Copilot Code Quality: 2025 Data, GitClear](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
- [Announcing the 2025 DORA Report, Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)
- [DORA Accelerate State of DevOps Report 2024](https://dora.dev/research/2024/dora-report/)
- [The Hidden Cost of Move Fast and Break Things, AlterSquare](https://altersquare.io/hidden-cost-move-fast-break-things-system-200k-users/)
- [Why you shouldn't move fast and break things, LeadDev](https://leaddev.com/velocity/why-you-shouldnt-move-fast-and-break-things)
- [Why you should introduce a cool-down period, Mat Ryer](https://medium.com/@matryer/why-you-should-introduce-a-cool-down-period-in-your-team-cb28e0186d64)
- [The Art of Thought: Wallas 1926, The Marginalian](https://www.themarginalian.org/2013/08/28/the-art-of-thought-graham-wallas-stages/)

### Section 2: Fresh Eyes Is Worth the Cost
- [Lost in the Middle: How Language Models Use Long Contexts, arXiv](https://arxiv.org/abs/2307.03172)
- [Lost in the Middle, ACL Anthology](https://aclanthology.org/2024.tacl-1.9/)
- [Context Rot, Chroma Research](https://research.trychroma.com/context-rot)
- [Context Rot: Why LLMs Degrade as Context Grows, Morph](https://www.morphllm.com/context-rot)
- [Context Discipline and Performance Correlation, arXiv](https://arxiv.org/html/2601.11564v1)
- [Effective context engineering for AI agents, Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Context Engineering for AI Agents: Part 2, Phil Schmid](https://www.philschmid.de/context-engineering-part-2)

### Section 3: Speculative Execution Has Hidden Costs
- [Spectre (security vulnerability), Wikipedia](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability))
- [Meltdown and Spectre](https://meltdownattack.com/)
- [Spectre Attacks: Exploiting Speculative Execution](https://spectreattack.com/spectre.pdf)
- [How the Spectre and Meltdown Hacks Really Worked, IEEE Spectrum](https://spectrum.ieee.org/how-the-spectre-and-meltdown-hacks-really-worked)
- [Meltdown and Spectre: decades-old CPU design flaws, Bitdefender](https://businessinsights.bitdefender.com/meltdown-and-spectre-decades-old-cpu-design-flaws-put-businesses-at-risk)
- [Speculative execution, Wikipedia](https://en.wikipedia.org/wiki/Speculative_execution)
- [Understanding Speculative Execution Vulnerabilities, Linux Security](https://linuxsecurity.com/features/what-is-a-speculative-execution-vulnerability)

### Section 4: Mode Selection Is Hard to Automate
- [Ironies of Automation, Wikipedia](https://en.wikipedia.org/wiki/Ironies_of_Automation)
- [Ironies of automation, ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/0005109883900468)
- [Ironies of Automation: Still Unresolved After All These Years, ResearchGate](https://www.researchgate.net/publication/319196629_Ironies_of_Automation_Still_Unresolved_After_All_These_Years)
- [The ironies of automation: design lessons from 1983, Medium](https://medium.com/design-bootcamp/the-ironies-of-automation-07d265bee942)
- [Bending the Automation Bias Curve, Oxford Academic](https://academic.oup.com/isq/article/68/2/sqae020/7638566)
- [Exploring automation bias in human-AI collaboration, Springer](https://link.springer.com/article/10.1007/s00146-025-02422-7)

### Section 5: Caching Is a False Economy
- [Two Hard Things, Martin Fowler](https://martinfowler.com/bliki/TwoHardThings.html)
- [Cache invalidation really is one of the hardest problems, Surfing Complexity](https://surfingcomplexity.blog/2022/11/25/cache-invalidation-really-is-one-of-the-hardest-things-in-computer-science/)
- [The Hidden Cost of Bad Caching, DEV Community](https://dev.to/nk_sk_6f24fdd730188b284bf/the-hidden-cost-of-bad-caching-why-more-cache-isnt-always-better-466b)
- [Why Caching Does not Always Improve Performance, GeeksforGeeks](https://www.geeksforgeeks.org/system-design/why-caching-does-not-always-improve-performance/)
- [Cache Coherence Problem, ScienceDirect](https://www.sciencedirect.com/topics/computer-science/cache-coherence-problem)
