# Economics Architecture Research R5: Contrarian Positions, Jevons Paradox, and Behavioral Economics

**Research Dimension**: Steelmanning and evaluating four contrarian positions against economics-aware harness design, with evidence from resource economics, behavioral economics, and empirical industry data.

**Date**: 2026-04-03

---

## 1. The Jevons Paradox in AI Computing

### 1.1 Historical Foundations

William Stanley Jevons observed in *The Coal Question* (1865) that James Watt's improvements to the steam engine, rather than reducing coal consumption, massively increased it by making steam power economically viable for new applications. The Khazzoom-Brookes postulate (formalized by Saunders, 1992) generalized this: energy efficiency gains, under neoclassical growth assumptions, increase total energy consumption through three mechanisms: (1) the direct rebound effect (cheaper use per unit encourages more use), (2) income effects (savings freed up are spent on other energy-consuming activities), and (3) macroeconomic multiplier effects (productivity gains drive GDP growth, which increases aggregate demand).

Sorrell (2009), in "Jevons' Paradox Revisited: The Evidence for Backfire from Improved Energy Efficiency" (*Energy Policy* 37(4): 1456-1469), concluded that while evidence for full "backfire" (rebound > 100%) is "far from conclusive," economy-wide rebound effects are "larger than is conventionally assumed." He identified five macroeconomic rebound channels: embodied energy, responding effects, output effects, energy market effects, and composition effects.

### 1.2 Wirth's Law: The Software Counterpart

Niklaus Wirth's 1995 "A Plea for Lean Software" articulated the computing analog: software gets slower faster than hardware gets faster. Empirical evidence is striking:

- Microsoft Office 2007 performed the same task at *half the speed* on a 2007 computer as Office 2000 on a 2000 computer, despite 7 years of Moore's Law gains.
- The Linux kernel grew from 170,000 lines (1.0, 1994) to 27.8 million lines (2020) to nearly 40 million lines (2024).
- The original iPhone (2007) ran apps under 10-20 MB; by the 2020s, apps like Instagram demand hundreds of megabytes with continuous background processes.

This pattern is directly relevant to AI coding agents: as models become cheaper and faster, the natural tendency is to use them more expansively (larger contexts, more iterations, multi-agent architectures), potentially consuming any efficiency gains.

### 1.3 The Jevons Paradox in AI Token Economics: Empirical Evidence

The data is now unambiguous. Token prices have collapsed:

| Date | Model | Input Cost/1M Tokens | Reduction from GPT-4 Launch |
|------|-------|---------------------|---------------------------|
| Mar 2023 | GPT-4 | $30.00 | baseline |
| Nov 2023 | GPT-4 Turbo | $10.00 | 3x |
| May 2024 | GPT-4o | $5.00 | 6x |
| Jul 2024 | GPT-4o mini | $0.15 | 200x |
| Jan 2025 | DeepSeek R1 | $0.55 | 55x (frontier-class) |
| Mar 2026 | GPT-5.4 | $2.50 | 12x (frontier) |
| Mar 2026 | Gemini 2.0 Flash | $0.10 | 300x |
| 2026 | DeepSeek V3.2 (cache) | $0.07 | 430x |

Yet total AI spending has exploded. Enterprise AI cloud spending tripled from $11.5B (2024) to $37B (2025). The five largest hyperscalers committed $660-690B in capital expenditure for 2026, nearly doubling the ~$365B spent in 2025. Google's internal token consumption grew 130-fold over 18 months.

The NavyaAI cost report (2026) captures the paradox precisely: "Tokens got 99.7% cheaper. So why did your AI bill triple?" The answer is consumption expansion. Each price threshold unlocked new use categories:

- **$30-60/M tokens**: Only premium, high-value workflows justified
- **$5-15/M tokens**: Enterprise chatbots became viable
- **$0.50-3/M tokens**: Automated workflows economically feasible
- **$0.02-0.55/M tokens**: Always-on multi-agent systems rational

Agentic workflows multiply token usage 50-500x compared to single queries. The result: per-unit costs fell 99.7%, but total bills grew 3x.

DeepSeek R1's release in January 2025 is the canonical Jevons example for AI. Trained for approximately $5.58M using 2,048 GPUs (vs. 100,000+ for comparable models), it matched frontier benchmarks at dramatically lower cost. Microsoft CEO Satya Nadella declared "Jevons paradox strikes again!" Within days, Meta raised 2025 AI spending to $60-65B, and Microsoft reported a $13B AI revenue run rate (up 175% YoY). Efficiency did not reduce infrastructure investment; it accelerated it.

### 1.4 Implications for Harness Economics

The Jevons paradox has a crucial implication for the paper: **cost optimization does not become unnecessary as prices fall; it becomes more necessary, because falling prices drive usage expansion that outpaces the price reduction.** This is the strongest counterargument to Position 2 ("prices are falling so optimization is wasted effort").

---

## 2. Contrarian Position 1: "Cost Optimization Is Premature; Quality Matters More"

### 2.1 Steelman (Strongest Version)

Software defects in production are catastrophically expensive. The NIST 2002 study estimated software bugs cost the U.S. economy $59.5 billion annually (0.6% of GDP). The IBM Systems Sciences Institute's cost escalation model (widely cited, if empirically contested) suggests defects found post-release cost 4-5x more than those found during design, and up to 100x more during maintenance. The IBM/Ponemon 2025 Cost of a Data Breach Report found the average U.S. data breach cost reached $10.22 million, with healthcare breaches averaging $7.42 million.

If an AI coding agent introduces a subtle security vulnerability by choosing a cheaper, less capable model, the expected cost of that single defect could dwarf years of token savings. For safety-critical, regulated, or security-sensitive code (aerospace under DO-178C, medical devices under IEC 62304, financial systems under SOX), the argument is nearly airtight: quality requirements are non-negotiable, and any cost optimization that risks quality is irrational.

Therefore: **stop optimizing for cost and just use the best model for everything.**

### 2.2 Counterargument

The steelman fails on three grounds:

**First, the 1:10:100 rule is poorly supported empirically.** The Register (2021) and Hacker News discussions documented that the IBM Systems Sciences Institute study "doesn't exist" as a formal published study; the original data is from no later than 1981 and possibly as old as 1967. The NIST 2002 figure ($59.5B) is real, but it measures aggregate cost of *all* software testing inadequacy, not the marginal cost of model selection in AI agents.

**Second, the argument conflates all code as equally critical.** DO-178C itself defines five criticality levels (A through E), with Level E requiring minimal assurance. IEC 62304 defines Classes A, B, and C. The Pareto principle applies: 20% of code modules produce 80% of system failures. A well-designed harness applies tiered quality, not uniform maximum quality, precisely because most code (boilerplate, configuration, tests, documentation) does not carry safety-critical risk.

**Third, cost optimization and quality optimization are not opposed; they are complementary.** A harness that routes boilerplate generation to a cheaper model frees budget to run more expensive models (with more verification passes) on security-critical code. The choice is not "optimize cost OR optimize quality" but rather "allocate quality investment where it matters most."

### 2.3 Evidence Assessment

The quality-over-cost argument has genuine validity for *safety-critical code paths* (validity: 3/5 for general code, 5/5 for regulated/safety-critical). But it does not follow that cost optimization should be abandoned entirely. Instead, it motivates *tiered quality architectures*, which is precisely what economics-aware harness design provides.

---

## 3. Contrarian Position 2: "Token Prices Are Falling So Fast That Cost Optimization Is Wasted Engineering Effort"

### 3.1 Steelman

The data is real and dramatic. Token costs for GPT-4-equivalent capability have fallen roughly 300x in three years (March 2023 to March 2026). The cost-efficiency frontier reached $0.14 per million tokens by August 2025, down from $37.50 at GPT-4's launch; a 99.7% reduction. If this trajectory continues at even a fraction of its pace (analysts project 3-5x annual reductions through 2027, tapering to 1.5-2x thereafter), then any optimization logic built today will be solving a problem that barely exists in 18 months.

The Moore's Law analogy is instructive: nobody optimizes for transistor count anymore, because transistors became so cheap that the effort was better spent elsewhere. Similarly, engineering effort invested in token cost routing, budget management, and cost monitoring has an opportunity cost. That engineering time could instead improve agent reliability, context management, or output quality, all of which have compounding long-term returns.

Therefore: **don't build cost optimization infrastructure; prices will solve the problem for you.**

### 3.2 Counterargument

This position fails on four grounds:

**First, the Jevons paradox is empirically confirmed in AI.** As documented in Section 1.3, total AI spending tripled (2024-2025) even as per-token costs fell 99.7%. Each price threshold unlocks new usage patterns. Agentic workflows consume 50-500x more tokens than single queries. A team that currently spends $1,000/month on AI coding assistance will not spend $3/month when prices fall 300x; they will deploy always-on agents across every PR, every code review, every documentation task, and spend $5,000/month. The 73% of teams that already lack real-time cost tracking (AICosts.ai, 2026) are particularly vulnerable to this consumption expansion.

**Second, unit cost vs. total cost is the critical distinction.** Bandwidth costs fell 99.99% from the late 1990s to today, yet bandwidth optimization remains a multi-billion-dollar industry. AWS egress costs alone can total $1.48M annually for an AI service provider. CDN pricing optimization is more important in 2026 than in 2000, not less, because volume has grown faster than unit costs have fallen. The same pattern is playing out in AI tokens.

**Third, frontier model costs are not falling as fast as commodity models.** While GPT-4-equivalent capability fell 300x, *frontier* capability (the best model available at any given time) fell only ~12x (GPT-4 at $30 to GPT-5.4 at $2.50). If quality requirements push teams toward frontier models (and they do for complex reasoning tasks), the cost reduction is much more modest.

**Fourth, cost optimization infrastructure provides value beyond direct savings.** Budget visibility, usage tracking, and model routing create observability that improves debugging, quality monitoring, and resource planning. The FinOps Foundation (2023) found that 48.5% of organizations are still at the "Crawl" stage of cloud cost maturity, and the primary challenge is "empowering engineers" with cost visibility. The same infrastructure that enables cost optimization enables quality optimization and capacity planning.

### 3.3 Evidence Assessment

The "falling prices" argument has moderate validity for *commodity tasks* on a 12-18 month horizon (validity: 2/5). It is weak for *frontier tasks*, weak at *organizational scale* (hundreds of PRs/day), and fails to account for the Jevons paradox. The evidence clearly favors building cost awareness infrastructure.

---

## 4. Contrarian Position 3: "Developer Time Is the Real Cost; Token Cost Is Noise"

### 4.1 Steelman

AI engineer salaries in the U.S. average $129,000-$150,000 (BLS, Glassdoor, ZipRecruiter, 2026), with AI specialists earning 18.7% more than in 2024. At a fully-loaded cost of $80-120/hour, a developer waiting 30 seconds for an AI response "costs" $0.67-$1.00 in idle time. A typical LLM API call costs $0.001-$0.05.

The ratio in interactive workflows is stark: developer time cost outweighs token cost by 20-1000x per interaction. The GitHub Copilot research (2024) found developers completed tasks 55.8% faster with AI assistance, reducing average completion time from 2h41m to 1h11m. The productivity delta (90 minutes saved) at $100/hour is worth $150. The token cost for that session might be $0.50-$2.00.

If you optimize token costs by 50% (saving $0.25-$1.00) but add 5 seconds of routing latency per request (costing $0.14 in developer idle time across 100 requests = $14), you have a net loss. GitHub Copilot research also found it takes 11 weeks for developers to fully realize productivity gains; any friction from cost optimization could delay or diminish that ramp-up.

Therefore: **optimize for developer speed and experience; token costs are a rounding error.**

### 4.2 Counterargument

This position is correct for interactive use but wrong for autonomous and batch workloads, and it becomes increasingly wrong at scale.

**First, the usage-mode distinction is critical:**

| Mode | Developer Waiting? | Cost Ratio (Dev:Token) | Optimization Value |
|------|-------------------|----------------------|-------------------|
| Interactive (IDE completion) | Yes | 100-1000:1 | Low (latency matters more) |
| Background (agent working while dev does other work) | Partially | 1-10:1 | Medium |
| Autonomous (CI/CD pipeline, overnight batch) | No | 0:1 (token only) | High |
| Multi-agent (parallel agents on separate tasks) | No | 0:1 (token only) | Very High |

For autonomous agents in CI/CD pipelines, there is no developer idle time cost. Token cost *is* the cost. Coding agents on Claude Opus 4 cost approximately $9,000/month at typical volumes. A 5% tool failure rate with 3 retries per failure adds 15% to total call count. Organizations report average cost overruns of 340% above initial estimates (AICosts.ai, 2026).

**Second, the "noise" argument fails at organizational scale.** A single developer's monthly token spend might be $50-200 (indeed noise against a $12,000 monthly salary). But an organization running 200 PRs/day with autonomous agents might spend $50,000-$200,000/month on tokens. At that scale, a 3x cost reduction from intelligent routing saves $100,000-$400,000/month, which funds 1-3 additional engineers.

**Third, AI coding tool quality concerns complicate the "just go fast" argument.** Research on Copilot found that developers with AI access saw "a significantly higher bug rate" while throughput remained consistent. Speed without quality is not productivity. Cost-aware routing that matches model capability to task complexity may actually *improve* quality by ensuring complex tasks get frontier models rather than being routed uniformly to a mid-tier model chosen for speed.

### 4.3 Evidence Assessment

The developer-time argument is valid for interactive, single-developer workflows (validity: 4/5 for interactive use). It is invalid for autonomous/batch workloads (validity: 1/5) and weakens significantly at organizational scale (validity: 2/5 for 50+ developer teams). The paper should explicitly distinguish these regimes.

---

## 5. Contrarian Position 4: "Model Routing Adds Complexity That Isn't Worth It"

### 5.1 Steelman

Model routing introduces real engineering complexity with real failure modes:

**Routing collapse**: Recent research (2026) on LLM router degeneration shows that routers trained to predict scalar performance scores suffer from "objective-decision mismatch," where small prediction errors flip relative model orderings, causing systematic defaulting to the most expensive model. This means the routing system costs engineering effort to build and maintain but may not actually reduce costs.

**Retry amplification**: If a router sends a task to a too-weak model that fails, the task must be retried on a stronger model. The failed attempt's tokens are wasted, and the retry adds latency. At scale, retry storms (retries hitting a degraded provider repeatedly) can stack up requests, drive up token usage, and slow the entire system. Each retry incurs a "compaction cost."

**Maintenance burden**: Models evolve rapidly. A routing heuristic tuned for Claude 3.5 Sonnet vs. GPT-4 may be wrong for Claude 4 vs. GPT-5.4. Routing logic requires continuous recalibration as model capabilities shift, creating an ongoing maintenance tax.

**Simplicity has value**: "Just use the best model" is a one-line configuration. Model routing is a distributed systems problem with monitoring, fallback logic, and calibration requirements. For small teams, the complexity overhead may exceed the savings.

Therefore: **just use the best model you can afford and focus engineering effort on higher-value problems.**

### 5.2 Counterargument

**First, the price differential is enormous.** The gap between frontier and commodity models is roughly 60x ($2.50/M for GPT-5.4 vs. $0.07/M for DeepSeek V3.2 cache, or $15/M for Claude Opus 4.5 vs. $0.25/M for Haiku-class models). Even a naive routing heuristic (e.g., "use cheap model for files < 100 lines, expensive model for complex refactoring") captures substantial savings without sophisticated ML-based routing.

**Second, empirical routing results are strong.** FrugalGPT demonstrated matching GPT-4 performance while reducing costs by up to 98% on some datasets through cascading (try cheap model first, escalate if confidence is low). RouteLLM (published at ICLR 2025) achieved over 2x cost reduction without substantial quality compromise. Even simple heuristic routing (not ML-based) captures the majority of savings because task difficulty follows a power law: most tasks are easy.

**Third, the complexity argument proves too much.** Load balancing, caching, and CDN routing all add complexity; nobody argues we should serve all web traffic from a single server because routing is complex. The question is whether the savings justify the complexity. At $9,000/month for a single agent on Claude Opus 4 vs. $36/month on GPT-4o-mini (a 250x difference), the savings clearly justify moderate routing complexity for any team processing more than a handful of requests per day.

**Fourth, routing does not require ML sophistication.** A simple decision tree (task type x estimated complexity -> model tier) captures 80% of the value of a sophisticated learned router. The AutoMix approach demonstrates that effective routing can be built with "a few tens, or perhaps hundreds, of examples" in an afternoon. The maintenance burden of a heuristic router is qualitatively different from (and much lighter than) a learned routing model.

**Fifth, routing failure modes are manageable.** Retry amplification is addressed by circuit breakers (stop retrying after N failures) and cascading (try cheap first, escalate once, never retry on the same tier). Routing collapse is a problem for learned routers, not heuristic routers. Maintenance burden is real but bounded: quarterly recalibration when new models launch.

### 5.3 Evidence Assessment

The complexity argument has genuine validity for very small teams (< 5 developers) and low-volume usage (validity: 3/5 for small scale). It is weak for medium-to-large teams (validity: 1/5) and fails entirely at organizational scale where the 60x price differential makes even simple routing obviously worthwhile. The paper should recommend tiered routing complexity: heuristic for small teams, learned for large.

---

## 6. Behavioral Economics of Token Budgets

### 6.1 Prospect Theory and Token Cost Perception

Kahneman and Tversky's prospect theory (1979) predicts that losses loom larger than gains (roughly 2x in most empirical studies). Applied to token budgets:

- A $50 unexpected overage on an AI bill causes more pain than a $50 savings causes pleasure.
- Teams that experience a cost spike (e.g., a runaway agent loop burning $1,410 in 6 hours, as documented by AICosts.ai) may react by imposing overly restrictive budgets, reducing AI effectiveness.
- Conversely, the "endowment effect" for existing spending patterns means teams accustomed to high token spend resist optimization, perceiving the reduction as a "loss" of capability.

This creates a bimodal distribution of organizational behavior: either over-restriction (cutting AI budgets after a scary incident) or under-management (ignoring costs until a crisis), with few teams operating in the rational middle.

### 6.2 Mental Accounting (Thaler)

Richard Thaler's mental accounting framework (1999) describes how people create non-fungible mental categories for fungible resources. In AI token economics:

- Teams may set separate "budgets" for different AI use cases (code generation, code review, documentation) that are rigid even when the marginal value of spending varies across categories. A team might constrain code generation spending while leaving documentation generation unconstrained, despite generation being higher-value.
- Monthly token budgets create artificial period boundaries. An agent that hits its budget on day 25 of the month is restricted for 5 days, regardless of the ROI of the remaining work. This is economically irrational but psychologically natural.
- The "transaction utility" concept applies: developers evaluate each API call against an internal "fair price" reference point. When a call costs more than expected (e.g., a long-context query on an expensive model), it feels like a "bad deal" even if the output value far exceeds the cost.

Leng (2024, SSRN) documented that LLMs themselves display mental accounting behaviors, including bundling gains while emphasizing losses, which has implications for agent-based financial decision-making and may recursively affect how AI agents manage their own token budgets.

### 6.3 Sunk Cost Fallacy in Agent Computation

The sunk cost fallacy is particularly insidious in AI agent loops:

- An agent that has spent 50,000 tokens on a failing approach has a "sunk cost" that should be irrelevant to the decision of whether to continue. But harness designs that track cumulative cost may inadvertently create sunk-cost pressure: "we've already spent $5 on this task, we should keep going rather than waste that investment."
- The rational policy is to evaluate expected future cost vs. expected future benefit at each step, ignoring sunk costs. But this requires the harness to implement forward-looking cost-benefit analysis, not backward-looking cost tracking.
- AICosts.ai (2026) documented real-world cases: document processing failures that burned $1,410 in 6 hours through recursive loops, and multi-agent chain reactions that wasted $23,000 in compute. These are sunk cost failures at the system level.

### 6.4 Anchoring Effects

Context window sizes (128K, 200K, 1M tokens) serve as anchors for "appropriate" usage. When Claude's context window expanded from 100K to 200K to 1M, the implicit anchor for "how much context is reasonable to include" shifted upward. This is not purely irrational (more context can improve quality), but it means context usage expands to fill available capacity, driving costs upward in a pattern consistent with the Jevons paradox.

Token pricing itself creates anchors. When GPT-4 launched at $30/M tokens, $3/M felt cheap. When GPT-4o mini launched at $0.15/M, $1.50/M felt expensive. The absolute value matters less than the reference point, which shifts as the market moves.

### 6.5 The Principal-Agent Problem

The developer who selects the model does not always pay the bill. This classic principal-agent misalignment manifests in several ways:

- Individual developers, optimizing for their own productivity, rationally choose the most capable (and expensive) model. The cost is externalized to the team or organization budget.
- 73% of teams deploy agents without real-time cost monitoring (AICosts.ai, 2026). Without visibility, the principal (budget owner) cannot observe the agent's (developer's) spending behavior.
- In many enterprise deployments, 40-60% of total AI agent cost is allocated to integration and compliance layers, making the actual token cost even less visible to the developer making model selection decisions.

The harness economics architecture directly addresses this: transparent cost attribution, per-developer and per-task cost visibility, and policy-driven model selection that balances individual developer preferences against organizational budget constraints.

---

## 7. The Premature Optimization Argument

### 7.1 What Knuth Actually Said

The full quote from Knuth's 1974 paper "Structured Programming with go to Statements" (*Computing Surveys* 6(4)):

> "Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: **premature optimization is the root of all evil.** Yet we should not pass up our opportunities in that critical 3%."

The critical caveat, nearly always omitted from the truncated quote, is "yet we should not pass up our opportunities in that critical 3%." Knuth was not arguing against optimization; he was arguing against *undirected* optimization of non-bottleneck code. He explicitly endorsed optimization of the critical path.

### 7.2 Application to Harness Economics

The question becomes: is token cost in the "critical 3%" or the "non-critical 97%"?

**For small teams and interactive use**: Token cost is likely in the non-critical 97%. A solo developer spending $100/month on API calls should focus on code quality, not routing optimization. This is genuinely premature optimization.

**For organizations at scale**: Token cost is in the critical 3%. An organization processing 200 PRs/day with autonomous agents may spend $50,000-$200,000/month. At this scale, Knuth's own principle *demands* optimization, because the cost is no longer "small."

**The FinOps parallel**: The FinOps Foundation's 2023 survey found that 48.5% of organizations are at the "Crawl" stage of cloud cost maturity. Organizations typically begin serious cost optimization when cloud spend exceeds 5-10% of IT budget or hits an absolute threshold that triggers executive attention. The same pattern will repeat for AI token costs. The question is not *whether* organizations will need cost optimization, but *when* they cross the threshold.

### 7.3 The Crossover Point

Based on the evidence, cost optimization transitions from "premature" to "necessary" roughly when:

- Autonomous (non-interactive) agent usage exceeds 50% of total token consumption
- Monthly token spend exceeds $5,000-$10,000 (enough to justify engineering attention)
- Team size exceeds 10-20 developers using AI agents daily
- Agent-hours per day exceed 100 (where even a 2x cost reduction saves $2,000-$5,000/month)

Below these thresholds, Knuth's principle applies: focus engineering effort elsewhere. Above them, Knuth's principle also applies, but in the opposite direction: this is the critical 3%, and optimization is warranted.

---

## 8. Positions for Paper: Validity Ratings

### Position 1: "Cost optimization is premature; quality matters more."

**Validity: 3/5 (context-dependent)**

- **Genuinely valid** for safety-critical, regulated, and security-sensitive code. The IBM/Ponemon breach cost data ($10.22M average in the U.S.) makes the risk calculus real.
- **Overstated** for general-purpose code. The 1:10:100 escalation ratio is poorly supported empirically. Most code is not safety-critical.
- **False dichotomy**: Cost optimization and quality optimization are complementary, not opposed. Tiered quality is the resolution.
- **Paper recommendation**: Acknowledge the argument's validity for critical code; use it to motivate tiered quality routing rather than universal cost optimization.

### Position 2: "Token prices are falling so fast that cost optimization is wasted effort."

**Validity: 2/5 (weak)**

- **The strongest evidence against this position**: The Jevons paradox is now empirically confirmed in AI (99.7% price drop, 3x spending increase). Bandwidth fell 99.99% and bandwidth optimization is a bigger industry than ever. Total AI infrastructure spend is approaching $700B despite (because of) falling unit costs.
- **The strongest evidence for this position**: Frontier model costs fell 12x in 3 years; for teams using only frontier models on low volume, the savings from routing may not justify the engineering effort. Cost reductions of 3-5x annually through 2027 will further erode the case for complex optimization.
- **Genuinely ambiguous**: The pace of decline means optimization logic has a short shelf life and must be designed for recalibration, not permanence.
- **Paper recommendation**: Reject the strong form ("don't optimize at all"). Accept the weak form ("don't build permanent, complex optimization; build lightweight, adaptable cost awareness").

### Position 3: "Developer time is the real cost; token cost is noise."

**Validity: 4/5 for interactive use, 1/5 for autonomous use**

- **Genuinely valid**: For interactive, developer-in-the-loop workflows, the developer's hourly cost ($80-120) dwarfs per-query token cost ($0.001-$0.05). Any routing latency that slows the developer is counter-productive.
- **Invalid for autonomous workflows**: CI/CD pipeline agents, batch processing, overnight multi-agent runs have zero developer idle-time cost. Token cost *is* the marginal cost. At $9,000/month for a single agent on Opus 4, this is not noise.
- **The critical insight**: The ratio flips based on usage mode. This is the strongest argument for usage-mode-aware cost optimization rather than uniform policies.
- **Paper recommendation**: Use this position to motivate the latency-vs-cost tradeoff dimension in the economics architecture. Interactive mode optimizes for speed; autonomous mode optimizes for cost.

### Position 4: "Model routing adds complexity that isn't worth it."

**Validity: 3/5 for small scale, 1/5 for large scale**

- **Genuinely valid concerns**: Routing collapse (routers defaulting to expensive models), retry amplification (failed cheap attempts plus expensive retries costing more than direct expensive calls), and maintenance burden (recalibration as models evolve) are real failure modes.
- **Overwhelmed by the price differential**: 60-250x price differences between model tiers mean even a simple, imperfect heuristic router saves substantially. FrugalGPT achieved up to 98% cost reduction on some datasets; RouteLLM (ICLR 2025) achieved >2x reduction without substantial quality loss.
- **Complexity is tierable**: A simple decision tree is not a distributed systems nightmare. The complexity argument applies to sophisticated learned routers, not to "if boilerplate, use cheap model."
- **Paper recommendation**: Present routing as a spectrum from simple heuristic (low complexity, captures 80% of savings) to learned router (high complexity, captures remaining 20%). Recommend heuristic routing as default, learned routing for high-volume organizations.

---

## 9. Summary of Evidence Quality

| Topic | Evidence Quality | Key Gap |
|-------|-----------------|---------|
| Jevons paradox in AI | **Strong**: multiple independent data sources confirm consumption expansion | Causal mechanism hard to isolate from general AI adoption growth |
| Token price trajectories | **Strong**: precise historical pricing data available | Future trajectory uncertain (3-5x vs. 10x annual decline) |
| Cost of software bugs | **Mixed**: NIST aggregate data is real; the 1:10:100 ratio is poorly sourced | Need better empirical studies on AI-generated bug costs specifically |
| Developer time vs. token cost | **Moderate**: salary data is solid; interaction-level time-motion data is sparse | No published time-motion studies of developer-agent interaction costs |
| Model routing performance | **Strong**: FrugalGPT, RouteLLM, AutoMix all peer-reviewed with reproducible results | Routing collapse research is new (2026); long-term maintenance data absent |
| Behavioral economics of AI costs | **Weak to Moderate**: theoretical frameworks are well-established; application to AI token economics is mostly analogical | No published empirical studies on prospect theory / mental accounting specifically in token budget contexts |
| FinOps / cloud cost maturity | **Strong**: FinOps Foundation survey data, industry benchmarks | AI-specific FinOps maturity data not yet available |

---

## 10. Key Citations

### Foundational
- Jevons, W.S. (1865). *The Coal Question*. Macmillan.
- Knuth, D.E. (1974). Structured programming with go to statements. *Computing Surveys*, 6(4), 261-301.
- Kahneman, D. & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. *Econometrica*, 47(2), 263-292.
- Thaler, R.H. (1999). Mental accounting matters. *Journal of Behavioral Decision Making*, 12(3), 183-206.
- Wirth, N. (1995). A plea for lean software. *Computer*, 28(2), 64-68.
- Sorrell, S. (2009). Jevons' Paradox revisited: The evidence for backfire from improved energy efficiency. *Energy Policy*, 37(4), 1456-1469.
- Saunders, H.D. (1992). The Khazzoom-Brookes postulate and neoclassical growth. *The Energy Journal*, 13(4), 131-148.

### AI Token Economics
- TokenCost (2026). AI Price Index: LLM Costs Dropped 300x (2023-2026). https://tokencost.app/blog/ai-price-index
- NavyaAI (2026). Tokens got 99.7% cheaper. So why did your AI bill triple? https://www.navyaai.com/reports/ai-cost-report-token-prices-vs-ai-bill
- AICosts.ai (2026). The AI Agent Cost Crisis: Why 73% of Teams Are One Prompt Away from Budget Disaster. https://www.aicosts.ai/blog/ai-agent-cost-crisis-budget-disaster-prevention-guide
- Ramp (2025). The cost of AI is decreasing. https://ramp.com/velocity/ai-is-getting-cheaper

### Model Routing
- Chen, L., Zaharia, M., & Zou, J. (2023). FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance. *arXiv:2305.05176*.
- Ong, I., et al. (2025). RouteLLM: Learning to Route LLMs with Preference Data. *ICLR 2025*.
- Routing collapse research (2026). When Routing Collapses: On the Degenerate Convergence of LLM Routers. *arXiv:2602.03478*.

### Developer Productivity
- Peng, S., et al. (2023). The Impact of AI on Developer Productivity: Evidence from GitHub Copilot. *arXiv:2302.06590*.
- IBM/Ponemon Institute (2025). Cost of a Data Breach Report 2025.
- NIST (2002). The Economic Impacts of Inadequate Infrastructure for Software Testing. *Planning Report 02-3*.

### Cloud/Infrastructure Economics
- IDC (2025). Artificial Intelligence Infrastructure Spending to Reach $758Bn USD Mark by 2029.
- Futurum Group (2026). AI Capex 2026: The $690B Infrastructure Sprint.
- FinOps Foundation (2023). State of FinOps Survey.
- SIGARCH (2024). The Jevons Paradox: Why Efficiency Alone Won't Solve Our Data Center Carbon Challenge.

### Behavioral Economics and AI
- Leng, Y. (2024). Folk Economics in the Machine: LLMs and the Emergence of Mental Accounting. *SSRN Working Paper*.
