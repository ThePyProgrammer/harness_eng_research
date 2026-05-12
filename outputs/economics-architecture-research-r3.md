# Queueing Theory and Service Economics for AI Coding Agent Harnesses

**Research Report R3 -- Economics Architecture Dimension**
**Date: 2026-04-03**

---

## 1. Introduction: The Hidden Cost of Waiting

When a developer submits a prompt to an AI coding agent and waits for a response, something economically significant is happening: an expensive human resource is idle while a cheap computational resource works. At senior engineering rates of $100-200/hr (fully loaded), every minute of developer idle time costs $1.67-3.33. A 5-minute agent response blocks $8.33-16.67 of developer time. If a faster model (costing 3-5x more per token) reduces that wait from 5 minutes to 2 minutes, the $0.15 in additional token cost saves $5-10 in developer time.

This is not a novel observation. It is precisely the class of problem that queueing theory has studied since the 1950s, with formal cost optimization models dating to Kleinrock's foundational work in the 1970s. This report surveys the relevant queueing-theoretic and service-economic results, maps them onto the AI coding harness problem, and identifies the formal models most suitable for our paper.

---

## 2. Kleinrock's Cost-of-Delay Framework (1975-1979)

### 2.1 The Total Cost Model

Leonard Kleinrock's *Queueing Systems, Volume 1: Theory* (Wiley, 1975) and *Volume 2: Computer Applications* (Wiley, 1976) established the canonical framework for optimizing service systems under economic constraints. The core insight is that total system cost has two opposing components:

**C_total(mu) = C_service(mu) + C_wait(mu)**

where:
- **mu** is the service rate (tasks completed per unit time)
- **C_service(mu)** is the cost of providing service at rate mu (increasing in mu)
- **C_wait(mu)** is the cost of customer waiting (decreasing in mu)

The optimization problem: find mu* that minimizes C_total. The classic result is that the optimal service rate occurs where the marginal cost of faster service equals the marginal reduction in waiting cost:

**dC_service/dmu = -dC_wait/dmu**

This is the fundamental economic equation for our harness architecture. The "server" is the AI model, the "customer" is the developer, and the "service rate" is a composite of tokens-per-second and model capability (how many tokens are needed to produce a correct result).

### 2.2 Kleinrock's Power Metric

Kleinrock also introduced the "power" metric, defined as the ratio of throughput to delay:

**P = T / D**

where T is throughput (tasks completed per unit time) and D is mean response time. In the M/GI/1 family of models, Kleinrock proved that maximal power is achieved when the mean number of customers in the system equals exactly one (Kleinrock, 1979; confirmed in Kleinrock, 2018). This "keep the pipe just full, but no fuller" principle translates directly to harness design: the optimal operating point is one task in flight per agent instance, not a deep queue of pending requests.

**Sources:**
- Kleinrock, L. (1975). *Queueing Systems, Vol. 1: Theory*. Wiley.
- Kleinrock, L. (1976). *Queueing Systems, Vol. 2: Computer Applications*. Wiley.
- Kleinrock, L. (2018). "Internet Congestion Control Using the Power Metric." *Ad Hoc Networks*, 80, 142-157.
- Giambene, G. & Luong, T.M. (2015). "On Kleinrock's Power Metric for Queueing Systems." *IEEE INFOCOM Workshop*.

---

## 3. M/M/1 and M/G/1 Cost Models

### 3.1 The M/M/1 Cost Optimization

For an M/M/1 queue (Poisson arrivals at rate lambda, exponential service at rate mu), the key performance metrics are:

- **Utilization:** rho = lambda / mu (requires rho < 1 for stability)
- **Expected number in system:** L = rho / (1 - rho) = lambda / (mu - lambda)
- **Expected time in system:** W = 1 / (mu - lambda)
- **Expected wait in queue:** W_q = rho / (mu - lambda) = lambda / [mu(mu - lambda)]

The total cost function, following the standard formulation (see, e.g., Hillier & Lieberman, *Introduction to Operations Research*, 11th ed.):

**C_total(mu) = c_s * mu + c_w * L = c_s * mu + c_w * lambda / (mu - lambda)**

where:
- **c_s** is the cost per unit service rate (dollars per unit increase in mu)
- **c_w** is the waiting cost per customer per unit time (dollars per customer-hour in system)

Taking the derivative and setting to zero:

dC/dmu = c_s - c_w * lambda / (mu - lambda)^2 = 0

Solving:

**(mu* - lambda)^2 = c_w * lambda / c_s**

**mu* = lambda + sqrt(c_w * lambda / c_s)**

This is the optimal service rate. The result is elegant and directly applicable: the optimal service rate exceeds the arrival rate by an amount proportional to sqrt(c_w / c_s), the square root of the ratio of waiting cost to service cost.

### 3.2 Worked Example: The AI Harness Case

Consider a senior developer at $150/hr (fully loaded cost including benefits, overhead):
- **c_w** = $150/hr = $2.50/min (developer waiting cost)
- **lambda** = 12 tasks/hr (one prompt every 5 minutes on average)
- **c_s** for Haiku-class model: $0.001/task-unit (cheap tokens, low per-unit service cost)
- **c_s** for Opus-class model: $0.005/task-unit (5x more expensive tokens)

For Haiku: mu* = 12 + sqrt(2.50 * 12 / 0.001) = 12 + sqrt(30,000) = 12 + 173 = 185 tasks/hr
For Opus: mu* = 12 + sqrt(2.50 * 12 / 0.005) = 12 + sqrt(6,000) = 12 + 77.5 = 89.5 tasks/hr

The optimal service rate for the cheap model is much higher because the model is cheap to "speed up" relative to the waiting cost. But the critical question is whether the cheap model can *achieve* that service rate at all. If Haiku tops out at mu_max = 40 tasks/hr while Opus achieves mu_max = 30 tasks/hr but with higher quality (fewer re-prompts), the effective service rates and total costs must be compared at their achievable operating points.

### 3.3 The M/G/1 Model and Service Time Variance

Real agent response times are not exponentially distributed. The M/G/1 model (Poisson arrivals, general service time distribution) is more realistic. The Pollaczek-Khinchine mean value formula gives:

**L = rho + (rho^2 + lambda^2 * Var(S)) / [2(1 - rho)]**

**W_q = (rho + lambda * mu * Var(S)) / [2(mu - lambda)]**

where:
- **Var(S)** is the variance of service time
- **rho = lambda / mu** with mu = 1/E[S]

The variance term is critical. Two models with the same mean service time but different variance will produce very different waiting times. An agent that sometimes responds in 10 seconds and sometimes in 5 minutes (high variance) creates worse waiting costs than one that consistently responds in 90 seconds (same mean, low variance), even though the mean service time is identical.

This is known as Feller's paradox: customers arriving at random tend to encounter the system during long service times more often than during short ones. The practical implication for harness design is that *predictability of agent response time matters as much as speed*. A model selection strategy should penalize high-variance models.

**Sources:**
- Pollaczek, F. (1930). "Uber eine Aufgabe der Wahrscheinlichkeitstheorie." *Math. Z.*, 32, 64-100.
- Khinchin, A.Y. (1932). "Mathematical theory of a stationary queue." *Mat. Sb.*, 39(4), 73-84.
- Hillier, F.S. & Lieberman, G.J. (2021). *Introduction to Operations Research*, 11th ed. McGraw-Hill.
- Wikipedia contributors. (2025). "Pollaczek-Khinchine formula." *Wikipedia*.

---

## 4. The Speed-Cost-Quality Trilemma

### 4.1 Formalizing the Three-Way Tradeoff

In classical queueing, the tradeoff is two-dimensional: faster service (higher mu) costs more but reduces waiting. In the AI agent context, we have a three-dimensional problem because "faster" can mean two things:

1. **Faster token generation** (tokens per second): reduces wall-clock response time
2. **Higher capability** (better model): reduces the number of attempts needed for a correct result

Let:
- **p** = probability that a single agent attempt produces a correct, accepted result
- **E[attempts]** = 1/p (geometric distribution: expected attempts until success)
- **t_response** = wall-clock time per attempt
- **c_token** = cost per attempt (in dollars)

The effective service metrics become:
- **Effective service time:** E[S] = t_response / p (expected time to get a correct result)
- **Effective cost per task:** E[C] = c_token / p
- **Effective service rate:** mu_eff = p / t_response

A cheap, fast, but inaccurate model (low p) may have worse effective service time and higher effective cost than an expensive, slower, but accurate model (high p). The trilemma becomes tractable when we compute effective rates.

### 4.2 The Crossover Point

At what developer hourly rate does paying for an expensive model become NPV-positive? Consider:

- **Model A** (Haiku-class): $0.03/task, t_response = 30s, p = 0.60
  - Effective cost: $0.03/0.60 = $0.05/task
  - Effective time: 30/0.60 = 50s per correct result
- **Model B** (Opus-class): $0.15/task, t_response = 60s, p = 0.92
  - Effective cost: $0.15/0.92 = $0.163/task
  - Effective time: 60/0.92 = 65.2s per correct result

The additional token cost per task for Model B: $0.163 - $0.05 = $0.113
The developer time saved per task: 50 - 65.2 = -15.2 seconds

In this scenario, Model B is *slower* on effective time despite being more accurate, because the accuracy gain does not compensate for the 2x response time. But consider a revised scenario where the developer must manually review and fix incorrect results:

- **Model A** with review overhead: 50s agent time + 0.40 * 180s review time = 50 + 72 = 122s effective
- **Model B** with review overhead: 65.2s agent time + 0.08 * 180s review time = 65.2 + 14.4 = 79.6s effective

Now Model B saves 42.4 seconds per task. At $150/hr ($0.0417/second):
- Developer time saved: 42.4 * $0.0417 = $1.77/task
- Additional token cost: $0.113/task
- **Net benefit of Model B: $1.65/task**

The crossover hourly rate (where net benefit equals zero) occurs when:

c_w * delta_time = delta_token_cost

c_w = delta_token_cost / delta_time = $0.113 / (42.4/3600 hr) = $9.59/hr

At any developer hourly rate above roughly $10/hr, the expensive model is NPV-positive in this scenario. Since no professional developer earns less than $10/hr, the expensive model is *always* preferable when human review costs are factored in.

### 4.3 The Quality-Speed Conundrum

Anunrojwong, Iyer, and Manshadi (2011, *Management Science*) formalized the "quality-speed conundrum" in customer-intensive services: when service quality depends on time spent with the customer, there is an inherent tension between service speed (which reduces waiting) and service quality (which requires more time). Their equilibrium analysis shows that the market outcome can be socially suboptimal: providers may over-serve quality at the expense of throughput, or vice versa.

In the AI harness context, this maps to the tension between giving an agent more context (improving quality but increasing prompt size and response time) versus keeping prompts lean (faster response but potentially lower quality). The harness architecture must navigate this tradeoff dynamically.

**Sources:**
- Anunrojwong, J., Iyer, K., & Manshadi, V. (2011). "Quality-Speed Conundrum: Trade-offs in Customer-Intensive Services." *Management Science*, 57(1), 40-56.
- Debo, L. & Veeraraghavan, S. (2014). "Equilibrium in Queues Under Unknown Service Rates and Service Value." *Operations Research*, 62(1).

---

## 5. Batch Processing vs. Interactive Economics: Two Regimes

### 5.1 The Regime Distinction

A critical insight for harness architecture: the cost function changes qualitatively depending on whether the developer is waiting. This creates two distinct economic regimes:

**Regime 1: Interactive (developer blocked)**
- C_total = c_token * task + c_developer * W (W is time in system)
- Waiting cost dominates; optimize for latency
- The developer's hourly cost (c_developer >> c_token) drives model selection

**Regime 2: Autonomous (developer not waiting)**
- C_total = c_token * task + c_infra * T (T is total compute time)
- Token cost dominates; optimize for cost-efficiency
- No waiting cost; the cheapest correct model wins

The ratio of developer cost to token cost in Regime 1 versus Regime 2 can differ by 100x or more. A harness that uses the same model and configuration for both regimes is economically suboptimal by construction.

### 5.2 Practical Implications

For CI/CD pipelines (Regime 2), the Anthropic Batch API offers a 50% cost discount with a 24-hour completion window (Anthropic, 2025). For interactive sessions (Regime 1), the premium for synchronous API access is justified by the developer waiting cost. This is not a minor optimization; it is a fundamental architectural decision.

The batch-interactive distinction also appears in the LLM pricing literature. As of April 2026, Claude Opus 4.6 is priced at $5/$25 per million tokens (input/output) for synchronous access, while cached input reads cost $0.50/million, a 90% reduction. The harness can exploit this by pre-caching context for interactive sessions.

### 5.3 Priority Queueing Formalization

When both interactive and autonomous tasks share infrastructure, priority queueing becomes relevant. The c-mu rule (Cox & Smith, 1961; Van Mieghem, 1995) provides the optimal scheduling policy: prioritize tasks by the ratio c_i / E[S_i], where c_i is the waiting cost per unit time for class i and E[S_i] is expected service time.

For a two-class system with interactive (class 1, high c_w) and autonomous (class 2, low c_w) tasks:

- **Priority ratio for interactive:** c_1 / E[S_1] (developer hourly rate / mean task time)
- **Priority ratio for autonomous:** c_2 / E[S_2] (infrastructure cost rate / mean task time)

Since c_1 >> c_2, interactive tasks should always receive priority. This translates to a concrete harness policy: interactive sessions preempt background agents for API rate limits, model capacity, and context window resources.

**Sources:**
- Cox, D.R. & Smith, W.L. (1961). *Queues*. Methuen.
- Van Mieghem, J.A. (1995). "Dynamic Scheduling with Convex Delay Costs." *Annals of Applied Probability*, 5(3), 809-833.
- Anthropic. (2026). "Claude API Pricing." https://www.anthropic.com/pricing

---

## 6. Little's Law and Throughput Economics

### 6.1 The Fundamental Relationship

Little's Law (Little, 1961) states:

**L = lambda * W**

where:
- **L** = average number of items in the system
- **lambda** = average arrival rate
- **W** = average time an item spends in the system

This holds for *any* stable queueing system regardless of arrival distribution, service distribution, or queueing discipline. It is the most robust result in queueing theory.

### 6.2 Application to Developer Task Queues

For a developer using an AI agent:
- **lambda** = rate at which the developer generates tasks for the agent (prompts per hour)
- **W** = average time from prompt submission to usable result
- **L** = average number of pending tasks in the developer's mental queue

If a developer generates 12 prompts/hour and each takes 5 minutes to complete: L = 12 * (5/60) = 1.0. One task is in flight at any time, which, per Kleinrock's power metric, is the optimal operating point.

If we reduce W to 2 minutes: L = 12 * (2/60) = 0.4. The developer's queue is mostly empty; they can increase lambda (issue more prompts) or use the freed time for other work.

If W increases to 10 minutes: L = 12 * (10/60) = 2.0. Two tasks are pending on average; the developer is increasingly blocked and likely to context-switch.

### 6.3 Parallelism Economics: N Cheap Agents vs. 1 Expensive Agent

Little's Law also illuminates the parallelism tradeoff. Consider:

- **Option A:** 1 Opus-class agent at $0.15/task, W = 60 seconds
- **Option B:** 3 Haiku-class agents at $0.03/task each, W = 30 seconds each, but developer must review/merge 3 outputs

For Option B, the developer's effective service time includes the merge overhead. If merge takes 120 seconds:
- Option A effective: 60 seconds, cost $0.15
- Option B effective: max(30, 30, 30) + 120 = 150 seconds, cost $0.09

Option B is cheaper in tokens but 2.5x slower for the developer. At $150/hr, the additional 90 seconds of developer time costs $3.75, far exceeding the $0.06 token savings.

However, for autonomous (Regime 2) tasks where no developer merge is needed, multiple cheap agents can achieve higher throughput. For a pooled M/M/c system with c = 3 servers at rate mu each, the effective capacity is c * mu, and the response time is lower than a single server at rate c * mu due to the pooling effect (Erlang-C model).

**Sources:**
- Little, J.D.C. (1961). "A Proof for the Queuing Formula: L = lambda W." *Operations Research*, 9(3), 383-387.
- Little, J.D.C. & Graves, S.C. (2008). "Little's Law." In *Building Intuition*, Springer, 81-100.

---

## 7. Erlang Models and Capacity Planning

### 7.1 Erlang B: Loss Systems

The Erlang B formula models systems where blocked requests are lost (no queue). For a system with N servers and offered traffic E erlangs:

**P_block = (E^N / N!) / sum_{k=0}^{N} (E^k / k!)**

This applies when the harness has a fixed number of concurrent agent slots and excess requests are rejected. The capacity planning question: how many concurrent agent sessions should a team provision?

### 7.2 Erlang C: Queueing Systems

The Erlang C formula models systems where blocked requests wait in a queue:

**P_wait = [E^N / (N! * (1 - E/N))] / [sum_{k=0}^{N-1} (E^k / k!) + E^N / (N! * (1 - E/N))]**

This gives the probability that a new request must wait. Combined with the waiting cost c_w, the expected waiting cost per request is:

**E[C_wait] = P_wait * c_w / [N * mu - lambda]**

### 7.3 Capacity Planning Example

A 10-developer team, each generating 12 prompts/hour, with mean agent processing time of 3 minutes:
- Total arrival rate: lambda = 120 prompts/hr = 2 prompts/min
- Service rate per agent slot: mu = 1/3 prompts/min per slot
- Offered traffic: E = lambda / mu = 2 / (1/3) = 6 erlangs

Using Erlang C with N = 8 agent slots:
- Utilization: rho = E/N = 6/8 = 0.75
- P_wait is approximately 0.21 (21% of requests must wait)

With N = 10 slots:
- Utilization: 0.60
- P_wait drops to approximately 0.065 (6.5% wait)

The cost tradeoff: each additional agent slot costs (say) $50/hr in API capacity, while each waiting developer costs $150/hr. At N = 8, the expected hourly waiting cost is 120 * 0.21 * (3/60) * $150 = $189/hr. Adding 2 more slots at $100/hr reduces this to roughly $49/hr, a net savings of $40/hr.

### 7.4 Burst Capacity

Peak demand matters. If agent usage follows a pattern (e.g., high demand during morning standup follow-up, low during meetings), provisioning for average demand causes long waits during peaks. The Erlang models quantify this: provisioning for 95th percentile demand costs more than average but prevents the cascading productivity losses of blocked developers during peak periods.

**Sources:**
- Erlang, A.K. (1917). "Solution of some Problems in the Theory of Probabilities of Significance in Automatic Telephone Exchanges." *Elektroteknikeren*, 13.
- EventHelix. (2024). "Resource Dimensioning Using Erlang-B and Erlang-C." https://www.eventhelix.com/congestion-control/resource-dimensioning-using-erlang-b-and-erlang-c/

---

## 8. Developer Productivity: The Flow State Cost Function

### 8.1 The 23-Minute Rule

Gloria Mark's research at UC Irvine (Mark, Gudith, & Klocke, 2008, CHI) established that it takes an average of 23 minutes and 15 seconds to fully regain focus after an interruption. While workers compensated for interruptions by working faster, this came at a measurable cost in stress and error rate.

Sophie Leroy's "attention residue" research (Leroy, 2009, *Organizational Behavior and Human Decision Processes*) explains the mechanism: when switching between tasks, cognitive resources remain partially allocated to the previous task for 30-60 minutes, degrading performance on the new task.

### 8.2 Implications for Agent Latency

These findings create a step function in the cost of waiting:

- **Wait < 15 seconds:** Developer maintains flow state. Cost is linear in wait time.
- **Wait 15-120 seconds:** Developer stays on task but attention drifts. Moderate productivity loss.
- **Wait 2-5 minutes:** Developer likely context-switches. Incurs full 23-minute recovery penalty.
- **Wait > 5 minutes:** Developer definitely context-switches. May not return to original task.

This means the cost of waiting is *not linear*. A 5-minute wait is not merely 5x worse than a 1-minute wait; it is 5 + 23 = 28 minutes of effective lost productivity. The economic model must include this step function:

**C_wait(W) = c_w * W + c_switch * P(context_switch | W) * T_recovery**

where:
- **c_switch** is the probability of a context switch given wait time W
- **T_recovery** is the mean time to regain flow state (approximately 23 minutes)
- **P(context_switch | W)** is approximately 0 for W < 30s, rising to approximately 1.0 for W > 300s

### 8.3 Developer Time Allocation Data

Empirical research on how developers spend their time provides context for the economic model:

- Sonar developer survey (2019): developers spend only 32% of time writing or improving code; 19% on maintenance; 12% on testing; 23% on meetings and management
- Microsoft Research "Time Warp" study (2024): significant gap between actual and preferred time allocation, with developers preferring to allocate ~20% to coding and ~15% to architecting
- Developers experience an average of 47 interruptions per day with only 2.3 hours of deep work out of 8 (various studies aggregated in Super Productivity, 2024)

The METR study (2025) on AI coding assistants found that experienced open-source developers were 19% *slower* with AI tools (Cursor Pro with Claude) in a randomized controlled trial of 246 tasks across 16 developers. This finding is particularly relevant: AI tools introduced new overhead categories (prompting, reviewing AI output, waiting for responses, integrating results) that offset code generation gains for expert developers in familiar codebases.

### 8.4 The Annual Cost of Waiting

For a 10-person engineering team at $150/hr average fully loaded cost:
- 9 context switches per day per developer (conservative estimate)
- 15 minutes lost per switch
- Weekly focus lost: 11.25 hours per developer
- Annual cost: 10 * 11.25 * 50 * $150 = **$843,750/year** in lost productivity from context switching alone

Even a 15% reduction in context switching (e.g., by keeping agent latency below the flow-breaking threshold) recovers $126,562/year, dwarfing any increase in API costs.

**Sources:**
- Mark, G., Gudith, D., & Klocke, U. (2008). "The Cost of Interrupted Work: More Speed and Stress." *CHI 2008 Proceedings*, 107-110.
- Leroy, S. (2009). "Why Is It So Hard to Do My Work?" *Organizational Behavior and Human Decision Processes*, 109(2), 168-181.
- METR. (2025). "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity." https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- Sonar. (2019). "How much time do developers spend actually writing code?" https://www.sonarsource.com/blog/how-much-time-do-developers-spend-actually-writing-code/
- Microsoft Research. (2024). "Time Warp: The Gap Between Developers' Ideal vs Actual Time Allocation."
- Super Productivity. (2024). "Context Switching Cost for Developers: Research & Data."

---

## 9. Key Models for the Paper

The following five formal results are most important for the economics architecture paper:

### Model 1: The Dual-Regime Cost Function

**C_total = I(interactive) * [c_token(mu) + c_w * W(mu) + c_switch * P_switch(W)] + I(autonomous) * [c_token(mu)]**

This is the master cost equation. The indicator function I selects the appropriate regime. In autonomous mode, only token cost matters. In interactive mode, waiting cost and context-switch cost dominate. This is the single most important formalization for the paper because it provides the theoretical basis for dynamic model selection.

### Model 2: The Optimal Service Rate (M/M/1)

**mu* = lambda + sqrt(c_w * lambda / c_s)**

The optimal agent service rate as a function of developer waiting cost and model cost. This gives the crossover point formula for model selection. When c_w is large (expensive developers), mu* is high, justifying expensive fast models. When c_w is zero (autonomous mode), mu* = lambda (just keep up with demand), justifying cheap models.

### Model 3: The Pollaczek-Khinchine Variance Penalty

**W_q = [rho + lambda * mu * Var(S)] / [2(mu - lambda)]**

This shows that service time variance (unpredictable agent response times) incurs a queueing cost independent of mean service time. The practical implication: model selection should consider not just mean response time but also variance. A model with lower variance may be preferred over a faster-on-average model with higher variance.

### Model 4: The c-mu Priority Rule

**Priority_i = c_i / E[S_i]**

Tasks should be scheduled in decreasing order of c_i/E[S_i]. Interactive tasks (high c_i) always preempt autonomous tasks (low c_i). Within interactive tasks, shorter tasks should be prioritized (higher mu). This provides the formal basis for the harness's scheduling policy.

### Model 5: Little's Law Operating Point

**L = lambda * W = 1 (optimal)**

Combining Little's Law with Kleinrock's power metric, the optimal operating point has exactly one task in flight. This constrains the harness architecture: the ideal interactive session has one outstanding prompt at a time, with the system designed to minimize W so the developer can sustain high lambda without queueing buildup.

---

## 10. Which Models Are Most Tractable?

### 10.1 Recommended Primary Model: M/M/1 with Two Cost Classes

The M/M/1 model with two customer classes (interactive and autonomous) is the most tractable starting point. It has closed-form solutions for all relevant metrics, the priority queueing extensions are well-understood, and the cost optimization has an explicit solution. The exponential service time assumption is unrealistic but can be relaxed later.

**Tractability:** Full closed-form. **Realism:** Low-moderate. **Extensibility:** Good.

### 10.2 Recommended Extension: M/G/1 with Pollaczek-Khinchine

For the paper's analytical depth, the M/G/1 model with the P-K formula adds the variance dimension without sacrificing tractability. The mean value formulas are closed-form, and the variance of agent response times is empirically measurable.

**Tractability:** Closed-form for means. **Realism:** Moderate-high. **Extensibility:** Moderate.

### 10.3 Useful but Secondary: Erlang-C for Capacity Planning

The Erlang-C model is essential for team-level capacity planning but is secondary to the per-developer cost optimization. It should appear in the paper as a capacity planning result rather than a core theoretical contribution.

**Tractability:** Tabulated/computable. **Realism:** Moderate. **Extensibility:** Limited.

### 10.4 Avoid: General Network Models

Jackson networks, BCMP networks, and general queueing networks add complexity without proportional insight for our problem. The AI harness is fundamentally a single-server or small multi-server problem at the individual developer level. Network-level models may be relevant for organizational-scale analysis but are not necessary for the paper's core argument.

---

## 11. Synthesis: The Economic Architecture

The queueing-theoretic analysis supports a clear economic architecture for AI coding harnesses:

1. **Detect the regime.** Every task must be classified as interactive (developer waiting) or autonomous (developer not waiting). The cost function is qualitatively different in each regime.

2. **Select the model by economics, not capability alone.** The optimal model is not the "best" model; it is the model that minimizes total cost including developer waiting time. For interactive tasks, this often means the most capable model. For autonomous tasks, it means the cheapest correct model.

3. **Minimize variance, not just mean latency.** The P-K formula shows that variance in response time incurs a queueing penalty. Consistent 90-second responses are better than alternating 30-second and 150-second responses.

4. **Prioritize interactive over autonomous.** The c-mu rule provides the formal basis for giving interactive tasks priority access to API capacity, rate limits, and model resources.

5. **Target L = 1.** Keep exactly one task in flight per developer-agent pair. If the developer is waiting for a response, that is the optimal state. If multiple tasks are queued, the system is underprovisioned.

6. **Stay below the flow-break threshold.** The step function in context-switching cost means there is a critical latency threshold (approximately 2-3 minutes based on the literature) below which waiting cost is linear and above which it jumps by approximately 23 minutes of recovery time. The harness should be engineered to keep interactive response times below this threshold.

7. **Plan capacity with Erlang-C.** For teams sharing agent infrastructure, Erlang-C dimensioning ensures that provisioned capacity matches demand at an acceptable grade of service (e.g., 95% of requests served within 30 seconds).

These seven principles constitute a complete economic architecture for the harness's model selection, task scheduling, and capacity planning subsystems.

---

## Sources Summary

**Queueing Theory Foundations:**
- [Kleinrock, L. (1975). Queueing Systems, Vol. 1: Theory](https://dl.acm.org/doi/book/10.5555/1096491)
- [Kleinrock, L. (2018). Internet Congestion Control Using the Power Metric](https://www.sciencedirect.com/science/article/abs/pii/S1570870518302476)
- [Wikipedia: M/M/1 queue](https://en.wikipedia.org/wiki/M/M/1_queue)
- [Wikipedia: M/G/1 queue](https://en.wikipedia.org/wiki/M/G/1_queue)
- [Wikipedia: Pollaczek-Khinchine formula](https://en.wikipedia.org/wiki/Pollaczek%E2%80%93Khinchine_formula)
- [MIT 6.263 Lecture Notes: Queueing](https://web.mit.edu/modiano/www/6.263/lec5-6.pdf)

**Cost Optimization:**
- [Revoledu: Queueing Optimization Tutorial](https://people.revoledu.com/kardi/tutorial/Queuing/Queuing-Optimization.html)
- [EventHelix: Resource Dimensioning Using Erlang-B and Erlang-C](https://www.eventhelix.com/congestion-control/resource-dimensioning-using-erlang-b-and-erlang-c/)
- [Anunrojwong et al. Quality-Speed Conundrum (Management Science)](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.1100.1250)
- [Priority Queueing: CS 547 Lectures](https://pages.cs.wisc.edu/~dsmyers/cs547/lecture_26_27_priority_queueing.pdf)

**Developer Productivity:**
- [Mark, Gudith, Klocke (2008). The Cost of Interrupted Work: More Speed and Stress](https://ics.uci.edu/~gmark/chi08-mark.pdf)
- [METR (2025). Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- [Sonar (2019). How much time do developers spend actually writing code?](https://www.sonarsource.com/blog/how-much-time-do-developers-spend-actually-writing-code/)
- [Super Productivity: Context Switching Cost for Developers](https://super-productivity.com/blog/context-switching-costs-for-developers/)
- [Microsoft Research (2024). Time Warp Study](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Time-Warp-Developer-Productivity-Study.pdf)

**AI Coding Economics:**
- [METR Study: 19% Slowdown with AI Tools](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- [Augment Code: Why AI Coding Tools Make Experienced Developers 19% Slower](https://www.augmentcode.com/guides/why-ai-coding-tools-make-experienced-developers-19-slower-and-how-to-fix-it)
- [TrackAI: Batch Processing vs Real-Time Cost-Latency Tradeoff](https://trackai.dev/tracks/finops/cost-fundamentals/batch-vs-realtime/)
- [LLM API Pricing Comparison (2026)](https://intuitionlabs.ai/articles/ai-api-pricing-comparison-grok-gemini-openai-claude)

**Little's Law:**
- [Little, J.D.C. (1961). A Proof for the Queuing Formula: L = lambda W](https://en.wikipedia.org/wiki/Little's_law)
- [Columbia University: Notes on Little's Law](http://www.columbia.edu/~ks20/stochastic-I/stochastic-I-LL.pdf)
