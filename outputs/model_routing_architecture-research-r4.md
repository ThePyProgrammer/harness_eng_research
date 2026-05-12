# Model Routing Architecture for AI Coding Agent Harnesses: Research Brief R4

## Online Learning, Bandit Algorithms, and Adaptive Systems for Model Escalation

**Scope:** Formal foundations for adaptive model selection -- deciding when to switch from a cheap model to an expensive one mid-task in an AI coding agent harness.

---

## 1. Multi-Armed Bandit Foundations

### 1.1 The Classical Problem

The multi-armed bandit (MAB) problem, formalized by Robbins (1952) in "Some Aspects of the Sequential Design of Experiments," captures the fundamental exploration-exploitation tradeoff: a learner sequentially selects among K actions ("arms"), observing stochastic rewards, and seeks to maximize cumulative reward over T rounds.

**Mapping to model routing:** Each LLM (e.g., Haiku, Sonnet, Opus) is an arm. The reward for pulling arm i on round t is defined as:

    r_i(t) = quality_i(task_t) - lambda * cost_i

where quality_i measures task completion quality, cost_i is the inference cost, and lambda is a cost-sensitivity parameter. The router must learn which model maximizes this net reward for each incoming task, without knowing the reward distributions in advance.

### 1.2 The Lai-Robbins Lower Bound

Lai & Robbins (1985), "Asymptotically Efficient Adaptive Allocation Rules," established the fundamental lower bound on bandit regret. For any consistent policy (one that plays each suboptimal arm o(n^a) times for all a > 0), the expected number of plays of suboptimal arm i satisfies:

    E[N_i(T)] >= (1 - o(1)) * ln(T) / KL(mu_i, mu*)

where KL(mu_i, mu*) is the Kullback-Leibler divergence between the reward distribution of arm i and the optimal arm. The regret therefore grows as:

    R(T) >= sum_{i: Delta_i > 0} (Delta_i * ln(T)) / KL(mu_i, mu*)

where Delta_i = mu* - mu_i is the gap between optimal and suboptimal arms.

**Implication for model routing:** The lower bound tells us that any routing policy must incur at least O(ln T) regret. The constant depends on how distinguishable the models are from each other (the KL divergence). If two models produce similar quality at different costs, the router needs more samples to distinguish them, and regret per suboptimal model grows as 1/KL(mu_i, mu*).

### 1.3 UCB1: Upper Confidence Bound Algorithm

Auer, Cesa-Bianchi & Fischer (2002), "Finite-time Analysis of the Multiarmed Bandit Problem" (Machine Learning, 47, 235-256), introduced the UCB1 algorithm with the first non-asymptotic regret bound for bandits.

**Algorithm:** At each round t, select the arm maximizing:

    UCB_i(t) = hat{mu}_i + sqrt(2 * ln(t) / n_i(t))

where hat{mu}_i is the empirical mean reward and n_i(t) is the number of times arm i has been played.

**Regret bound (Theorem 1):** For K arms with rewards in [0,1]:

    E[R_n] <= sum_{i: Delta_i > 0} (8 * ln(n) / Delta_i) + (1 + pi^2/3) * sum_{j=1}^{K} Delta_j

This yields O(K ln(n) / Delta) regret, matching the Lai-Robbins lower bound up to constants for the problem-dependent case.

**Key properties for model routing:**
- UCB1 requires no prior knowledge of reward distributions
- The confidence width sqrt(2 ln(t) / n_i) shrinks as O(1/sqrt(n_i)), providing automatic exploration
- Minimax optimal regret (problem-independent) is O(sqrt(KT ln K))

### 1.4 Thompson Sampling

Thompson (1933) originally proposed the Bayesian approach; modern analysis came from Agrawal & Goyal (2012) and Kaufmann, Korda & Munos (2012).

**Algorithm:** Maintain a posterior distribution over each arm's mean reward. At each round, sample from each posterior and play the arm with the highest sample.

**Regret bounds:**
- Agrawal & Goyal (2012, COLT): First proof of logarithmic regret for Thompson Sampling on Bernoulli bandits. For the N-armed case:
  E[R(T)] = O((sum_{i: Delta_i > 0} 1/Delta_i^2)^2 * ln T)
- Kaufmann, Korda & Munos (2012, ALT): Proved asymptotic optimality, matching the Lai-Robbins lower bound. The expected regret satisfies:
  E[R(T)] <= (1 + epsilon) * sum_i ln(T) / d(mu_i, mu*) + O(N / epsilon^2)
  where d(mu_i, mu*) is the KL divergence for Bernoulli distributions.

**Empirical superiority:** Thompson Sampling consistently outperforms UCB in practice due to its more aggressive exploration when uncertain and faster convergence when the posterior concentrates. Kaufmann et al. showed it achieves the lowest regret among computationally efficient algorithms for Bernoulli bandits.

**Relevance to model routing:** Thompson Sampling is particularly attractive because:
1. It naturally handles the exploration-exploitation tradeoff without tuning exploration parameters
2. It can incorporate prior beliefs about model quality (e.g., "Opus is probably better than Haiku for complex tasks")
3. It adapts gracefully as model capabilities change over time

### 1.5 Lattimore & Szepesvari (2020) as Modern Reference

"Bandit Algorithms" (Cambridge University Press, 2020) provides the definitive modern treatment. Key results consolidated:

- **Stochastic bandits:** Minimax regret is Theta(sqrt(KT)) for the worst case; instance-dependent regret is Theta(sum_i ln(T) / Delta_i) for known gap structure
- **Adversarial bandits (Exp3):** Auer et al. (2002b, SIAM J. Computing) showed the Exp3 algorithm achieves O(sqrt(KT ln K)) regret against adversarial reward sequences
- **Lower bounds:** Information-theoretic lower bounds via change-of-measure arguments
- **Linear bandits:** Extension to settings where reward is a linear function of features, directly relevant to contextual model routing

### 1.6 The Key Distinction: Model Routing Is Contextual

The standard MAB formulation assumes the best arm is fixed across all rounds. Model routing fundamentally differs: the best model depends on the task. A simple refactoring task may be best served by Haiku; a complex architectural redesign requires Opus. This makes model routing a *contextual bandit* problem.

---

## 2. Contextual Bandits for Model Routing

### 2.1 Problem Formulation

In a contextual bandit, at each round t:
1. Nature reveals a context x_t in R^d (task features)
2. The learner selects an action a_t in {1, ..., K} (a model)
3. The learner observes reward r_t(a_t) (quality - cost for the chosen model)

The goal is to compete with the best policy pi*: X -> {1, ..., K} from a policy class Pi.

**Context features for coding tasks:**
- File complexity metrics (cyclomatic complexity, lines of code, dependency count)
- Task type (refactor, debug, implement, test, documentation)
- File count and edit scope
- Language and framework
- Conversation history length
- Prior model performance on similar tasks
- User-specified quality requirements

### 2.2 LinUCB Algorithm

Li, Chu, Langford & Schapire (2010), "A Contextual-Bandit Approach to Personalized News Article Recommendation" (WWW 2010), introduced LinUCB.

**Model assumption:** The expected reward of arm a given context x is linear:

    E[r_t(a) | x_t] = x_t^T * theta_a

**Algorithm:** Maintain a ridge regression estimate hat{theta}_a for each arm and select:

    a_t = argmax_a (x_t^T * hat{theta}_a + alpha * sqrt(x_t^T * A_a^{-1} * x_t))

where A_a is the design matrix for arm a and alpha controls exploration.

**Regret bound:** O(d * sqrt(T * ln(T))) for d-dimensional context, which is near-optimal.

**Empirical result:** On Yahoo! news data (33 million events), LinUCB achieved a 12.5% click-through-rate improvement over context-free bandits.

**Application to model routing:** LinUCB maps directly: task features form the context vector x_t, each model is an arm, and the router learns linear coefficients theta_a capturing how each model's quality varies with task features. For example, theta_Opus might have a large positive coefficient for "cyclomatic complexity," indicating Opus excels on complex code.

### 2.3 Efficient Contextual Bandits: Taming the Monster

Agarwal, Hsu, Kale, Langford, Li & Schapire (2014), "Taming the Monster: A Fast and Simple Algorithm for Contextual Bandits" (ICML 2014).

**Problem:** For rich policy classes (e.g., neural networks), maintaining per-arm regression is infeasible. The paper reduces contextual bandits to cost-sensitive classification.

**Key result:** The algorithm achieves statistically optimal regret O(sqrt(KT)) while requiring only O-tilde(sqrt(KT / log N)) calls to a cost-sensitive classification oracle across all T rounds, where N is the policy class size. This is remarkable because:
1. The oracle call count is sublinear in T
2. It works for arbitrary policy classes, not just linear models
3. It is described as "the most practical contextual bandit learning algorithm for general policy classes"

**Implication for model routing:** This result means we can use any supervised learning method (random forests, neural networks, gradient-boosted trees) as a black-box oracle for the routing decision, and the contextual bandit wrapper provides formal regret guarantees. The router need not be limited to linear models.

### 2.4 Contextual Bandit Regret Bounds Summary

| Algorithm | Regret Bound | Context | Oracle Calls |
|-----------|-------------|---------|-------------|
| LinUCB (Li et al., 2010) | O(d * sqrt(T ln T)) | Linear payoffs | N/A (closed-form) |
| Thompson Sampling (Agrawal & Goyal, 2013) | O(d * sqrt(T) * polylog) | Linear payoffs | N/A (sampling) |
| Monster (Agarwal et al., 2014) | O(sqrt(KT)) | General policies | O-tilde(sqrt(KT / log N)) |
| EXP4 (Auer et al., 2002b) | O(sqrt(T * K * ln N)) | Adversarial, N experts | N per round |

### 2.5 Practical Considerations for Feature Engineering

For coding agent harnesses, the context vector must be computable *before* model invocation (to route the task). Useful features include:

- **Static features:** File size, language, framework, number of files, AST depth, import complexity
- **Task features:** Task type classification (from the user prompt), edit scope (single-line vs. multi-file), presence of test requirements
- **Historical features:** Success rate of each model on similar tasks, average latency, user satisfaction signals
- **Conversation features:** Turn count, accumulated context length, prior model used in conversation

Sample complexity results suggest O(d^2 / epsilon^2) tasks are needed to learn an epsilon-optimal routing policy in d dimensions (Zanette et al., NeurIPS 2021, "Design of Experiments for Stochastic Contextual Linear Bandits"). For a 10-dimensional feature space, this translates to roughly 1000-10000 tasks for a good policy.

---

## 3. Cascade and Sequential Testing

### 3.1 The Cascade Architecture

The cascade approach to model routing is directly inspired by Viola & Jones (2001), "Rapid Object Detection using a Boosted Cascade of Simple Features" (CVPR 2001). The key insight: arrange classifiers in stages of increasing complexity, and reject easy negatives early.

**Viola-Jones cascade structure:**
- Stage 1: 1 feature (trivially cheap)
- Stage 2: 10 features
- Stage 3: 25 features
- ... up to 38 stages, 6000 total features

Each stage has high recall (passes almost all positives) but increasing precision. The expected cost for a negative example is dominated by the first few stages.

**Mapping to model routing:** Replace "reject negative" with "accept response as good enough":
1. Send task to Haiku (cheapest model)
2. If confidence score exceeds threshold tau_1, return response
3. Otherwise, escalate to Sonnet
4. If confidence score exceeds tau_2, return response
5. Otherwise, escalate to Opus

The cascade reduces expected cost because most tasks are "easy" and are resolved by the cheap model. Only hard tasks propagate to expensive models.

### 3.2 FrugalGPT: LLM Cascading in Practice

Chen, Zaharia & Zou (2023), "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance" (arXiv:2305.05176, later published in TMLR 2024).

**Three strategies:**
1. **Prompt adaptation:** Reduce token count to lower per-query cost
2. **LLM approximation:** Cache and reuse responses for similar queries
3. **LLM cascade:** Sequentially query models from cheapest to most expensive, using a learned scoring function to decide when to stop

**The cascade mechanism:** A small scorer model evaluates the response from each LLM in the cascade. If the score exceeds a threshold, the response is returned; otherwise, the query is forwarded to the next (more expensive) model.

**Results:**
- Matches GPT-4 performance with up to 98% cost reduction
- Or improves accuracy by 4% over GPT-4 at the same cost
- Models tested include GPT-4, ChatGPT, J1-Jumbo, with costs spanning two orders of magnitude

**Limitation:** FrugalGPT does not provide formal regret bounds or optimality guarantees for the cascade thresholds.

### 3.3 Wald's Sequential Probability Ratio Test (SPRT)

Wald (1945), "Sequential Tests of Statistical Hypotheses" (Annals of Mathematical Statistics), introduced the SPRT.

**Formulation:** Given observations arriving sequentially, test H_0 vs H_1 by computing the log-likelihood ratio:

    Lambda_k = sum_{i=1}^{k} ln(f_1(x_i) / f_0(x_i))

Stop and accept H_1 when Lambda_k >= ln(B), accept H_0 when Lambda_k <= ln(A), where A = beta / (1 - alpha) and B = (1 - beta) / alpha for desired type-I error alpha and type-II error beta.

**Optimality (Wald & Wolfowitz, 1948):** The SPRT minimizes the expected sample size among all sequential tests achieving the same error probabilities. This is the strongest possible optimality result for sequential testing.

**Application to model escalation:** Formulate two hypotheses:
- H_0: "The cheap model's response is good enough" (quality >= threshold)
- H_1: "The cheap model's response is inadequate" (quality < threshold)

Evidence accumulates from quality signals (self-evaluation scores, syntactic checks, test results). The SPRT framework tells us the optimal threshold for escalation: escalate when the log-likelihood ratio crosses the boundary, and the resulting test minimizes the expected "cost of evidence gathering" (which maps to latency of quality evaluation) for fixed error rates.

### 3.4 Chernoff's Sequential Decision Framework

Chernoff (1959), "Sequential Design of Experiments," extended Wald's work to active experimentation. The key insight: the decision-maker can choose *which* experiment to run next, not just whether to stop.

**Asymptotic optimality:** Chernoff showed that actively managing the sensing/testing stage provides substantial performance gains. The optimal policy minimizes the Bayes risk:

    Risk = E[cost of observations] + E[cost of wrong decision]

**Connection to model routing:** When evaluating whether to escalate, the router can choose among multiple quality signals (syntax check, type check, test execution, self-evaluation prompt). Chernoff's framework tells us which signal to query next to most efficiently determine whether escalation is needed.

### 3.5 Optimal Stopping and the Escalation Threshold

The escalation decision is an instance of optimal stopping: given a sequence of quality signals from the current model's response, when should the router stop gathering evidence and either accept or escalate?

The general theory (see Ferguson, 2006, "Optimal Stopping and Applications") shows that the optimal stopping rule has a threshold structure: stop at the first time the posterior probability of inadequacy exceeds a threshold, where the threshold depends on the remaining cost of escalation vs. the value of additional evidence.

For model routing specifically:
- Let p_t = P(response is adequate | evidence so far)
- Let c_e = cost of escalation (inference cost of larger model + KV cache loss)
- Let c_w = cost of returning a wrong/low-quality response
- Escalate when: p_t < c_e / (c_e + c_w)

This gives a principled, cost-aware escalation threshold.

---

## 4. Online Learning with Switching Costs

### 4.1 The Core Result: Switching Costs Change the Regret Rate

Dekel, Ding, Koren & Peres (2014), "Bandits with Switching Costs: T^{2/3} Regret" (arXiv:1310.2997).

**Setting:** Standard K-armed bandit, but the learner incurs a unit cost each time they switch from one arm to another.

**Main result:** The minimax regret with switching costs is Theta-tilde(K^{1/3} * T^{2/3}).

This is a fundamental departure from the O(sqrt(KT)) rate without switching costs. The T^{2/3} rate is strictly worse, and no algorithm can do better.

**Key implication:** This result tells us that in the full-information (expert) setting, the minimax regret is Theta(sqrt(T)), but with bandit feedback and switching costs, it degrades to T^{2/3}. Learning with bandit feedback under switching costs is *provably harder* than without.

**Technical contribution:** The proof uses a novel multi-scale random walk construction that is of independent interest.

### 4.2 Improved Bounds for Stochastic Settings

Amir, Azov, Koren & Livni (2022), "Better Best of Both Worlds Bounds for Bandits with Switching Costs" (NeurIPS 2022).

**Main result:** An algorithm that simultaneously achieves:
- O(T^{2/3}) in the adversarial setting (minimax optimal)
- O(min{log(T) / Delta^2, T^{2/3}}) in the stochastic setting

**Lower bound:** Omega-tilde(min{1/Delta^2, T^{2/3}}) switching-cost regret is unavoidable for any algorithm with O(T^{2/3}) worst-case guarantee.

**Relevance:** In the model routing setting, if task difficulty is stochastic (most tasks are easy, some are hard, with stable distribution), the stochastic rate O(log T / Delta^2) is much better than the adversarial rate. This motivates assuming stationarity of the task distribution when possible.

### 4.3 The KV-Cache Invalidation Problem as a Switching Cost

When an AI coding agent switches models mid-conversation, the KV cache from the previous model is completely invalidated. This is a concrete, measurable switching cost:

**Cache invalidation mechanics:**
- Due to the autoregressive nature of LLMs, even a single-token difference invalidates the KV cache from that point onward (Nvidia Technical Blog, 2024)
- KV cache offloading can deliver up to 14x faster time-to-first-token compared to recomputing from scratch (Nvidia, 2025)
- Cache miss forces recomputation of all K/V tensors for the context, turning a cheap operation into an expensive one

**Quantifying the switching cost:** If the conversation has accumulated C tokens of context, switching from model A to model B requires:
- Discarding model A's KV cache (sunk cost)
- Re-processing all C tokens through model B's prefill (O(C) compute)
- For a 100K-token context, this can add 5-30 seconds of latency and significant compute cost

**Formal modeling:** Let s(C) be the switching cost as a function of context length C. Then the model routing problem with switching costs has modified reward:

    r_t(a_t) = quality(a_t, task_t) - lambda * cost(a_t) - gamma * s(C_t) * 1[a_t != a_{t-1}]

where gamma weights the switching cost and 1[.] indicates a model switch occurred.

### 4.4 Batched Bandits: Amortizing Switching Costs

Perchet, Rigollet, Chassang & Snowberg (2016), "Batched Bandit Problems" (Annals of Statistics, 44(2), 660-681).

**Setting:** The learner must divide T rounds into M batches. Within each batch, the same policy is used. The policy can only change between batches.

**Key result:** With O(log log T) batches, one can achieve the same minimax-optimal regret as the fully adaptive algorithm. Specifically, as few as 2-3 batches suffice to get within a constant factor of optimal.

**Implication for model routing:** Rather than re-evaluating the model choice on every task, the router can batch tasks and only reconsider the routing policy every B tasks. This:
1. Amortizes the cost of policy computation
2. Reduces switching frequency (preserving KV caches within batches)
3. Still achieves near-optimal regret if B = O(T / log log T)

**Practical translation:** For an agent processing 100 tasks per day, re-evaluating the routing policy 3-5 times per day (rather than per-task) is theoretically near-optimal and practically eliminates unnecessary model switches.

### 4.5 Context Re-Establishment Costs

Beyond KV cache invalidation, switching models mid-conversation incurs additional costs:
- **Prompt re-engineering:** Different models may require different system prompts or formatting
- **State serialization:** Tool call results, file contents, and conversation history must be re-packed
- **Behavioral discontinuity:** The new model may interpret prior context differently, leading to inconsistent behavior

These costs are harder to quantify formally but compound the basic KV cache switching cost. The batched approach (Section 4.4) is particularly valuable here: commit to a model for an entire conversation or task phase, only switching at natural breakpoints.

---

## 5. Regret Bounds and Sample Complexity

### 5.1 Expected Regret for Model Routing

Combining the results above, we can characterize the regret landscape for model routing:

**Non-contextual (fixed task distribution):**
- Lower bound: Omega(K ln T / Delta) (Lai & Robbins, 1985)
- UCB1 achieves: O(K ln T / Delta) (Auer et al., 2002)
- Thompson Sampling achieves: O(sum_i ln T / KL(mu_i, mu*)) (Kaufmann et al., 2012), asymptotically optimal

**Contextual (task-dependent routing):**
- Linear payoffs: O(d * sqrt(T ln T)) (Li et al., 2010)
- General policies: O(sqrt(KT)) (Agarwal et al., 2014)

**With switching costs:**
- Adversarial: Theta-tilde(K^{1/3} * T^{2/3}) (Dekel et al., 2014)
- Stochastic: O(min{log T / Delta^2, T^{2/3}}) (Amir et al., 2022)

**With budget constraints:**
- Bandits with Knapsacks: Optimal up to polylogarithmic factors for O(sqrt(T)) regret when all budgets are Omega(T^{1/2}) (Badanidiyuru, Kleinberg & Slivkins, 2018)

### 5.2 Sample Complexity for Learning a Routing Policy

How many tasks must the router observe before it learns an effective policy?

**Non-contextual setting:** To identify the best arm with probability at least 1 - delta, the sample complexity is O(K / Delta^2 * ln(K / delta)) (from standard best-arm identification results).

For K = 3 models (Haiku, Sonnet, Opus) with Delta = 0.1 (10% quality gap), this gives roughly 300 * ln(30) ~ 1000 tasks. This is achievable within a few days of typical agent usage.

**Contextual setting:** With d-dimensional features, the sample complexity scales as O(d^2 / epsilon^2) for an epsilon-optimal policy. For d = 10 features:
- epsilon = 0.05 (5% suboptimality): ~40,000 tasks
- epsilon = 0.10 (10% suboptimality): ~10,000 tasks
- epsilon = 0.20 (20% suboptimality): ~2,500 tasks

**Cold-start mitigation:** The cold-start problem (poor performance in early rounds) can be addressed through:
1. **Prior knowledge:** Initialize Thompson Sampling posteriors with informed priors based on model benchmarks (e.g., "Opus performs well on hard tasks")
2. **Warm-start transfer:** Transfer routing policies learned in other codebases or by other users (Springer, Cutting to the Chase with Warm-Start Contextual Bandits, 2023)
3. **Heuristic initialization:** Start with a simple rule (e.g., "use Sonnet for everything, escalate to Opus on failure") and let the bandit refine it
4. **Multi-task bandits:** Share structure across similar task types to accelerate learning (Azar et al., NeurIPS 2013)

The LLM Bandit paper (Li, 2025) showed that new models can be incorporated with as few as 20-50 evaluations by leveraging "model identity vectors" that capture capabilities across tasks.

### 5.3 Exploration-Exploitation in Practice

In a coding agent, exploration (trying a potentially suboptimal model) has real user-facing cost: the task may fail or take longer. Strategies to manage this:

**Epsilon-greedy exploration:** With probability epsilon, try a random model; otherwise, use the current best. Simple but wasteful, as exploration is not directed.

**UCB exploration:** Exploration is automatic and decreasing. New or underexplored models get an exploration bonus that decays as 1/sqrt(n), naturally focusing exploration where uncertainty is highest.

**Thompson Sampling exploration:** Exploration probability is proportional to the posterior probability that each model is optimal. This naturally allocates more exploration to models where the router is uncertain.

**Practical recommendation:** Thompson Sampling is preferred for model routing because:
1. It explores more aggressively early on (when priors are diffuse) and converges faster
2. It can incorporate domain knowledge via informative priors
3. It handles non-stationarity better (model capabilities change with updates)

---

## 6. Dynamic Pricing and Resource Allocation Connections

### 6.1 Model Routing as Resource Allocation

Model routing is isomorphic to a resource allocation problem: given a fixed budget B for API costs, allocate tasks across models to maximize total quality:

    maximize sum_t quality(a_t, task_t)
    subject to: sum_t cost(a_t) <= B

This is a variant of the fractional knapsack problem when task quality-cost ratios are known, or a stochastic online knapsack problem when they must be learned.

### 6.2 Bandits with Knapsacks (BwK)

Badanidiyuru, Kleinberg & Slivkins (2013/2018), "Bandits with Knapsacks" (FOCS 2013; Journal version 2018, arXiv:1305.2545).

**Model:** K arms, each yielding random reward and consuming d resources. The learner has budgets B_1, ..., B_d. The game ends when any budget is exhausted.

**Algorithms:**
1. **Balanced Exploration:** Novel paradigm managing resource constraints during learning
2. **Primal-Dual with Multiplicative Updates:** Uses dual variables (shadow prices) for each resource constraint

**Key result:** Both algorithms achieve reward close to the information-theoretic optimum, with regret optimal up to polylogarithmic factors. Specifically, the optimal policy (which may depend on the full latent distribution) significantly outperforms the best fixed arm -- a key distinction from standard bandits.

**Concrete application:** The first algorithm whose regret with respect to the optimal *dynamic* policy is sublinear in the supply, for the dynamic posted pricing problem with limited inventory.

**Mapping to model routing:** The budget constraint B maps to the daily/monthly API cost budget. Each "arm" (model assignment for a task type) consumes a stochastic amount of budget. The BwK framework provides the first principled way to route tasks under budget constraints with provable regret guarantees.

### 6.3 Online Stochastic Convex Programming

Agrawal & Devanur (2014-2015), "Fast Algorithms for Online Stochastic Convex Programming" (SODA 2015).

**Setting:** Online optimization with concave objective and convex constraints, where the objective is revealed incrementally.

**Result:** A primal-dual algorithm achieving O(sqrt(T)) regret for both the random permutation model and the stochastic i.i.d. model. The approach learns dual variables (shadow prices for constraints) online and uses them to guide resource allocation decisions.

**Application:** This framework directly applies when the model routing objective is more complex than a simple budget constraint, e.g., maintaining minimum quality percentiles while minimizing cost, or satisfying latency SLAs.

### 6.4 Cloud Computing Analogies

The model routing problem has structural parallels to cloud resource management:

**Spot pricing analogy:** LLM APIs have tiered pricing (on-demand vs. batch vs. cached). The model router can be viewed as a bidder choosing between "spot instances" (cheap batch API calls to smaller models) and "on-demand instances" (expensive synchronous calls to larger models). The online competitive analysis framework (competitive ratio = cost_online / cost_optimal_offline) provides performance guarantees.

**Autoscaling analogy:** Just as cloud autoscalers dynamically adjust compute resources based on demand, the model router dynamically adjusts model selection based on task complexity. The key shared challenge is avoiding oscillation (constantly switching between models/instance types).

**Competitive ratio results:**
- Online knapsack (non-removable): Best possible competitive ratio is 2 for randomized algorithms (Wikipedia on Online Knapsack)
- Online packing LP: Competitive ratio of 1 - O(epsilon) when B = Omega(ln(m) / epsilon^2) (Buchbinder & Naor, 2009)
- These translate to model routing: with sufficient budget, the online router can achieve near-optimal allocation

### 6.5 The Knapsack Formulation for Model Routing

For a concrete formulation, consider:
- T tasks arriving over a billing period
- K models with costs c_1 < c_2 < ... < c_K
- Quality function q_k(x) for model k on task with features x
- Budget B for the billing period

**Offline optimal (LP relaxation):**

    maximize sum_{t=1}^{T} sum_{k=1}^{K} p_{tk} * q_k(x_t)
    subject to: sum_{t=1}^{T} sum_{k=1}^{K} p_{tk} * c_k <= B
                sum_{k=1}^{K} p_{tk} = 1 for all t
                p_{tk} >= 0

**Online setting:** Tasks arrive one at a time; the router must assign a model immediately. The BwK framework provides O(sqrt(T) * polylog) regret relative to the optimal online policy.

---

## 7. Practical Adaptive Systems

### 7.1 LLM Routing Systems: The Current Landscape

#### RouteLLM (Ong et al., 2024)

"RouteLLM: Learning to Route LLMs with Preference Data" (arXiv:2406.18665).

**Architecture:** Four router variants trained on Chatbot Arena preference data (55,000 samples):
1. **Similarity-Weighted (SW) Ranking:** Weighted Elo calculation based on similarity metrics
2. **Matrix Factorization:** Learns scoring functions for model-prompt pairs
3. **BERT Classifier:** Predicts which model delivers superior responses
4. **Causal LLM Classifier:** Language-model-based comparative predictor

**Cost savings (at 95% of GPT-4 performance):**
- MT Bench: 85% cost reduction (only 14% of queries routed to GPT-4 with data augmentation)
- MMLU: 45% cost reduction
- GSM8K: 35% cost reduction

**Key finding:** Matrix factorization router required only 14% GPT-4 calls for 95% GPT-4 performance with augmented training data, and was 40% cheaper than competing solutions from Martian and Unify AI.

**Transfer learning:** Router models maintain effectiveness even when the underlying strong/weak models are substituted at test time, suggesting learned routing policies generalize across model generations.

#### FrugalGPT (Chen, Zaharia & Zou, 2023)

See Section 3.2. Key result: 98% cost reduction matching GPT-4 performance through LLM cascading.

#### MetaLLM (Nguyen et al., 2024)

"MetaLLM: A High-performant and Cost-efficient Dynamic Framework for Wrapping LLMs" (arXiv:2407.10834).

**Approach:** Formulates model selection as a multi-armed bandit problem. Routes each query to the least expensive LLM likely to provide a correct answer.

**Results:**
- ~1% accuracy improvement over static model selection
- Up to 60% cost reduction on OpenAI and Bedrock platforms
- Tested on classification and multi-choice QA tasks

**Significance:** First explicit application of multi-armed bandits (not just supervised classification) to LLM routing, with an adaptable reward function balancing performance and cost.

#### LLM Bandit (Li, 2025)

"LLM Bandit: Cost-Efficient LLM Generation via Preference-Conditioned Dynamic Routing" (arXiv:2502.02743).

**Innovations:**
1. **Model identity vectors:** Compact representations of each model's capability profile
2. **Preference-tunable inference:** Users specify desired performance-cost tradeoff via a single parameter at inference time
3. **Fast cold-start:** New models incorporated with 20-50 evaluations
4. **Routing overhead:** ~5ms per decision on single GPU (negligible vs. LLM inference time of 100ms-1s)
5. **Memory efficient:** Identity vectors and routing policy require < 100MB GPU memory

#### Cascade Routing (Dekoninck, Baader & Vechev, 2024/2025)

"A Unified Approach to Routing and Cascading for LLMs" (arXiv:2410.10347; ICML 2025).

**Core contribution:** Proves formal optimality of routing and cascading strategies, and proposes "cascade routing," a unified framework that provably outperforms either approach alone.

**Key results:**
1. Derives a novel *optimal* strategy for cascading
2. Proves the optimality of an existing routing strategy
3. Identifies "good quality estimators" as the critical success factor for model selection
4. Cascade routing consistently outperforms individual approaches by a large margin

**Theoretical significance:** This is the first work to provide formal proofs of optimality for LLM routing/cascading, addressing a major gap in the literature.

#### RACER (2026)

"RACER: Risk-Aware Calibrated Efficient Routing for Large Language Models" (arXiv:2603.06616, February 2026).

**Approach:** Formulates routing as an alpha-VOR (Value of Routing) problem. Minimizes expected model set size while controlling misrouting risk.

**Key innovation:** Constructs nested model sets via augmented scoring and uses finite-sample concentration bounds to calibrate thresholds. Achieves:
- Distribution-free risk control on unseen test data
- Variable set sizes and abstention (can say "I don't know which model to use")
- Post-hoc and model-agnostic calibration (works with any base router)

#### RouterBench (Hu et al., 2024)

"RouterBench: A Benchmark for Multi-LLM Routing System" (arXiv:2403.12031).

**Contribution:** Standardized evaluation framework with 405K+ inference outcomes across representative LLMs. Provides:
- Cost-quality analytic framework using AIQ metrics and convex hull operations
- Apples-to-apples comparison across routing algorithms
- Open dataset eliminating need for real-time compute during evaluation

### 7.2 Dynamic Model Routing Survey

Moslem & Kelleher (2026), "Dynamic Model Routing and Cascading for Efficient LLM Inference: A Survey" (arXiv:2603.04445, February 2026).

**Taxonomy:** Six paradigms for routing decisions:
1. **Difficulty-aware routing:** Assess query complexity, route simple queries to cheap models
2. **Human preference alignment:** Learn from pairwise preference data (as in RouteLLM)
3. **Clustering-based:** Group queries by similarity, assign clusters to models
4. **Reinforcement learning:** Learn routing policy via reward signals
5. **Uncertainty quantification:** Route based on model confidence (as in RACER)
6. **Cascading:** Sequential model invocation with early stopping

**Design framework:** Three dimensions for understanding routing decisions:
- **When:** Pre-inference (routing), mid-inference (cascading), or post-inference (verification)
- **What signals:** Query features, model confidence, historical performance
- **How:** Classification, bandit, optimization, or hybrid methods

**Key finding:** "Well-designed routing systems can outperform even the most powerful individual models" through strategic specialization.

### 7.3 Learning to Defer

The "learning to defer" literature provides theoretical foundations for the escalation decision:

**Madras, Pitassi & Zemel (2018):** "Predict Responsibly: Improving Fairness and Accuracy by Learning to Defer" (NeurIPS 2018). Introduced a mixture-of-experts loss for learning when to defer to a human (or, in our case, a more capable model).

**Mozannar & Sontag (2020):** "Consistent Estimators for Learning to Defer to an Expert" (ICML 2020). Proved that the Madras et al. loss is inconsistent and proposed a consistent surrogate loss based on cost-sensitive learning. The key result: the optimal deferral policy can be learned by reducing to cost-sensitive binary classification.

**Application to model routing:** "Deferring to an expert" maps directly to "escalating to a more capable model." The Mozannar & Sontag framework provides a principled training objective for the escalation classifier.

### 7.4 Google Vizier

Golovin et al. (2017), "Google Vizier: A Service for Black-Box Optimization" (KDD 2017).

Google Vizier is the de facto system for black-box optimization across Google, having serviced research efforts optimizing Search, Ads, YouTube, and more. Key features:
- Gaussian process bandits as the core algorithm
- Handles asynchronous evaluations with latencies from seconds to weeks
- Scales from tens to millions of evaluations

**Open Source Vizier (2022-2023):** Released as a standalone Python package with accompanying whitepaper at AutoML Conference 2022. Demonstrates that bandit-based adaptive experimentation can operate at massive scale in production.

**Relevance:** Vizier's architecture (centralized optimization service, asynchronous evaluation, GP bandits) is a template for a model routing service: the router maintains a GP model of each LLM's quality as a function of task features, and uses acquisition functions (UCB, EI) to decide which model to try next.

### 7.5 Netflix and Uber

**Netflix:** Uses a combination of bandits, reinforcement learning, and causal modeling for recommendation. Their "Hydra" multi-task learning system consolidates multiple specialized models into a unified architecture, reducing operational complexity while improving generalization via shared representations. Real-time adaptation uses Apache Kafka for feature updates within seconds of user interactions.

**Uber:** The DeepETA system evolved from per-region XGBoost models to a global deep neural network (DeeprETA). Key metric: median latency of 3.25ms at the highest QPS of any Uber model. The evolution from specialized to unified models with dynamic adaptation parallels the model routing challenge: when to use a fast, specialized model vs. a slow, general model.

### 7.6 Martian and Unify AI

**Martian:** Patent-pending LLM router selecting models based on uptime, skillset (e.g., math reasoning), and cost-to-performance ratio. Claims up to 98% cost savings. Received investment from Accenture (September 2024) for enterprise deployment.

**Unify AI:** Unified API across LLM providers with real-time performance benchmarks. Supports custom routing constraints on cost, latency, and output speed. Enables apples-to-apples model comparison through standardized evaluation.

Both represent commercial validation that model routing is a first-class production concern, not merely an academic exercise.

---

## 8. Synthesis: Formal Foundations for Model Routing Architecture

### 8.1 The Complete Formal Picture

The model routing problem for AI coding agent harnesses sits at the intersection of:

| Domain | Key Result | Application |
|--------|-----------|-------------|
| Multi-armed bandits | O(K ln T / Delta) regret (Auer et al., 2002) | Learning which model is best overall |
| Contextual bandits | O(d sqrt(T ln T)) regret (Li et al., 2010) | Task-dependent model selection |
| Sequential testing | SPRT minimizes expected samples (Wald, 1945) | Optimal escalation threshold |
| Switching costs | Theta(T^{2/3}) minimax regret (Dekel et al., 2014) | Cost of mid-conversation model switches |
| Batched bandits | O(log log T) batches suffice (Perchet et al., 2016) | Amortizing switching costs |
| Bandits with knapsacks | Optimal to polylog factors (Badanidiyuru et al., 2018) | Budget-constrained routing |
| Cascade classifiers | Exponential speedup on easy instances (Viola & Jones, 2001) | Cheap-model-first architecture |
| Learning to defer | Consistent surrogate loss (Mozannar & Sontag, 2020) | Training the escalation classifier |
| LLM routing | 85% cost reduction at 95% quality (Ong et al., 2024) | Empirical validation |
| Cascade routing | Provably optimal unified framework (Dekoninck et al., 2025) | Theoretical optimality |

### 8.2 Recommended Architecture

Based on the formal results, the model routing architecture should combine:

1. **Contextual Thompson Sampling** as the core routing algorithm (Agrawal & Goyal, 2013), using task features to select among models, with informative priors from benchmark performance

2. **Cascade structure** (a la FrugalGPT and Dekoninck et al.) with SPRT-based escalation thresholds, starting with the cheapest model and escalating only when quality signals indicate inadequacy

3. **Batched policy updates** (Perchet et al., 2016) to amortize switching costs, re-evaluating the routing policy at natural breakpoints (conversation boundaries, task completions)

4. **Budget-aware allocation** using the BwK framework (Badanidiyuru et al., 2018), ensuring the router respects API cost budgets while maximizing aggregate quality

5. **Warm-start initialization** using benchmark data and cross-user transfer to mitigate the cold-start problem, targeting < 100 tasks to reach near-optimal routing

### 8.3 Open Questions

1. **Non-stationarity:** Model capabilities change with provider updates. How should the router adapt? Discounted/sliding-window bandits (Garivier & Moulines, 2011) provide some theory, but practical adaptation mechanisms for LLM routing are underexplored.

2. **Multi-step tasks:** Coding tasks often span multiple model invocations. The routing decision for step t affects the context available for step t+1. This creates a Markov Decision Process (MDP), not just a bandit. Formal treatment of multi-step model routing is largely absent from the literature.

3. **Quality estimation:** All routing approaches depend on accurate quality estimation. For coding tasks, quality signals (test pass rates, syntax validity, human approval) are delayed and noisy. The interaction between quality estimation accuracy and routing optimality (identified by Dekoninck et al. as the "critical factor") deserves formal treatment.

4. **Adversarial robustness:** If the task distribution shifts adversarially (e.g., a user deliberately submits hard tasks to drain budget), the T^{2/3} adversarial switching-cost regret (Dekel et al., 2014) applies. Practical defenses are needed.

5. **Privacy and personalization:** User-specific routing policies raise privacy concerns. Differential privacy for bandit algorithms (Tossou & Dimitrakakis, 2016) may be relevant but adds regret overhead.

---

## References

### Multi-Armed Bandit Foundations
- Robbins, H. (1952). Some Aspects of the Sequential Design of Experiments. Bulletin of the AMS, 58, 527-535.
- Lai, T.L. & Robbins, H. (1985). Asymptotically Efficient Adaptive Allocation Rules. Advances in Applied Mathematics, 6(1), 4-22.
- Auer, P., Cesa-Bianchi, N. & Fischer, P. (2002). Finite-time Analysis of the Multiarmed Bandit Problem. Machine Learning, 47, 235-256.
- Auer, P., Cesa-Bianchi, N., Freund, Y. & Schapire, R. (2002b). The Nonstochastic Multiarmed Bandit Problem. SIAM Journal on Computing, 32(1).
- Agrawal, S. & Goyal, N. (2012). Analysis of Thompson Sampling for the Multi-armed Bandit Problem. COLT 2012.
- Kaufmann, E., Korda, N. & Munos, R. (2012). Thompson Sampling: An Asymptotically Optimal Finite-Time Analysis. ALT 2012.
- Lattimore, T. & Szepesvari, C. (2020). Bandit Algorithms. Cambridge University Press.

### Contextual Bandits
- Li, L., Chu, W., Langford, J. & Schapire, R. (2010). A Contextual-Bandit Approach to Personalized News Article Recommendation. WWW 2010.
- Agrawal, S. & Goyal, N. (2013). Thompson Sampling for Contextual Bandits with Linear Payoffs. ICML 2013.
- Agarwal, A., Hsu, D., Kale, S., Langford, J., Li, L. & Schapire, R. (2014). Taming the Monster: A Fast and Simple Algorithm for Contextual Bandits. ICML 2014.
- Zanette, A. et al. (2021). Design of Experiments for Stochastic Contextual Linear Bandits. NeurIPS 2021.

### Sequential Testing and Optimal Stopping
- Wald, A. (1945). Sequential Tests of Statistical Hypotheses. Annals of Mathematical Statistics.
- Wald, A. & Wolfowitz, J. (1948). Optimum Character of the Sequential Probability Ratio Test. Annals of Mathematical Statistics.
- Chernoff, H. (1959). Sequential Design of Experiments. Annals of Mathematical Statistics.
- Viola, P. & Jones, M. (2001). Rapid Object Detection using a Boosted Cascade of Simple Features. CVPR 2001.

### Switching Costs and Batched Bandits
- Dekel, O., Ding, J., Koren, T. & Peres, Y. (2014). Bandits with Switching Costs: T^{2/3} Regret. arXiv:1310.2997.
- Perchet, V., Rigollet, P., Chassang, S. & Snowberg, E. (2016). Batched Bandit Problems. Annals of Statistics, 44(2), 660-681.
- Amir, I., Azov, G., Koren, T. & Livni, R. (2022). Better Best of Both Worlds Bounds for Bandits with Switching Costs. NeurIPS 2022.

### Resource Allocation and Budget Constraints
- Badanidiyuru, A., Kleinberg, R. & Slivkins, A. (2013/2018). Bandits with Knapsacks. FOCS 2013; arXiv:1305.2545.
- Agrawal, S. & Devanur, N. (2014-2015). Fast Algorithms for Online Stochastic Convex Programming. SODA 2015.
- Immorlica, N., Singla, A. & Slivkins, A. (2019). Adversarial Bandits with Knapsacks. FOCS 2019.

### Learning to Defer
- Madras, D., Pitassi, T. & Zemel, R. (2018). Predict Responsibly: Improving Fairness and Accuracy by Learning to Defer. NeurIPS 2018.
- Mozannar, H. & Sontag, D. (2020). Consistent Estimators for Learning to Defer to an Expert. ICML 2020.

### LLM Routing Systems
- Chen, L., Zaharia, M. & Zou, J. (2023). FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance. arXiv:2305.05176; TMLR 2024.
- Hu, Q. et al. (2024). RouterBench: A Benchmark for Multi-LLM Routing System. arXiv:2403.12031.
- Ong, I. et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. arXiv:2406.18665.
- Nguyen, Q.H. et al. (2024). MetaLLM: A High-performant and Cost-efficient Dynamic Framework for Wrapping LLMs. arXiv:2407.10834.
- Dekoninck, J., Baader, M. & Vechev, M. (2024/2025). A Unified Approach to Routing and Cascading for LLMs. arXiv:2410.10347; ICML 2025.
- Li, Y. (2025). LLM Bandit: Cost-Efficient LLM Generation via Preference-Conditioned Dynamic Routing. arXiv:2502.02743.
- RACER (2026). Risk-Aware Calibrated Efficient Routing for Large Language Models. arXiv:2603.06616.
- Moslem, Y. & Kelleher, J.D. (2026). Dynamic Model Routing and Cascading for Efficient LLM Inference: A Survey. arXiv:2603.04445.

### Practical Systems
- Golovin, D. et al. (2017). Google Vizier: A Service for Black-Box Optimization. KDD 2017.
- Song, X. et al. (2022). Open Source Vizier: Towards Reliable and Flexible Hyperparameter and Blackbox Optimization. AutoML Conference 2022.
