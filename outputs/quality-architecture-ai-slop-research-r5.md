# Cross-Domain Defense-in-Depth for Software Quality Architecture

## Research Round 5: Formal Frameworks from Adjacent Fields

---

## 1. Network Security Defense-in-Depth: NIST Frameworks and Layer Independence

### The Formal Framework

The US National Institute of Standards and Technology codifies defense-in-depth through two primary documents: NIST SP 800-53 (Security and Privacy Controls) and the NIST Cybersecurity Framework (CSF). The core architectural principle is that no single security control should be treated as sufficient; instead, controls are layered so that the failure of any one layer does not compromise the system.

NIST SP 800-53 Rev. 5 organizes controls into 20 families (Access Control, Audit and Accountability, Configuration Management, etc.) with explicit ordering by function: Identify, Protect, Detect, Respond, Recover. This is not arbitrary taxonomy. The ordering reflects a temporal sequence: you must identify assets before you can protect them, and detection must precede response. Each layer operates on different failure modes, which is the key insight for software quality architecture.

The mathematical formulation is straightforward. If layer *i* has an independent probability of failure *p_i*, then the probability that a threat penetrates all *n* layers is:

```
P(penetration) = p_1 * p_2 * ... * p_n
```

For three layers each with 10% miss rate: 0.1^3 = 0.001, a 1000x improvement over a single layer.

### The Independence Assumption and Its Failure

This multiplicative model only holds when layers are statistically independent. In practice, they rarely are. A 2018 study by the SANS Institute found that organizations deploying multiple overlapping controls (e.g., two different antivirus products) achieved far less than the theoretical improvement because both tools shared similar detection heuristics, similar signature databases, and similar blind spots for zero-day attacks. The correlation between layer failures is the critical variable that the naive model ignores.

The corrected model introduces a correlation coefficient rho between layers:

```
P(joint failure) = p_1 * p_2 + rho * sqrt(p_1 * (1 - p_1) * p_2 * (1 - p_2))
```

When rho approaches 1, adding layers provides diminishing returns. When rho is 0 (true independence), you get the full multiplicative benefit.

### Cost-Effectiveness Studies

The Center for Internet Security (CIS) Controls framework prioritizes controls by empirical cost-effectiveness. Their data shows that the first five controls (Inventory of Hardware Assets, Inventory of Software Assets, Secure Configurations, Continuous Vulnerability Assessment, Controlled Use of Admin Privileges) address approximately 85% of known attack vectors. The remaining 15 control families address the last 15%. This is a Pareto distribution, and it recurs across every domain we examine.

### Translation to Software Quality

The direct parallel is: linters, type checkers, unit tests, integration tests, and code review are analogous to network security layers. The ordering principle (cheap/fast/broad layers first, expensive/slow/targeted layers last) maps directly. But the independence assumption is where most software quality architectures fail. A linter and a type checker are not independent detectors; they share a common failure mode (both miss semantic/logical errors). A unit test suite and a code review process may both miss the same class of integration bugs because both reason about the code in isolation.

The actionable lesson: layer effectiveness depends not on the number of layers but on the diversity of detection mechanisms across layers. Each layer should catch a genuinely different class of defect.

---

## 2. Medical Diagnostic Cascades and Screening Theory

### The Formal Framework

Medical screening theory provides perhaps the most mathematically rigorous framework for sequential testing. The core formalism uses Bayes' theorem applied iteratively:

```
P(disease | positive test) = [sensitivity * prevalence] / 
    [sensitivity * prevalence + (1 - specificity) * (1 - prevalence)]
```

Where sensitivity is the true positive rate (probability of detecting a real defect) and specificity is the true negative rate (probability of correctly passing clean code).

The WHO Wilson-Jungner screening criteria (1968, updated 2008) establish when screening is justified:

1. The condition must be an important problem (high-severity defects)
2. There must be an accepted treatment (a fix is possible)
3. Facilities for diagnosis and treatment must be available (tooling exists)
4. There must be a recognizable latent or early symptomatic stage (defects have precursors)
5. There must be a suitable test (the detection method must exist)
6. The test must be acceptable to the population (developers will tolerate it)
7. The natural history of the condition must be adequately understood (we know what defects look like)
8. There must be an agreed policy on whom to treat as patients (severity thresholds)
9. The cost of case-finding must be economically balanced against expenditure on treatment
10. Case-finding should be a continuing process, not a one-time project

### Sequential Test Ordering

In medical diagnostics, tests are ordered by a specific principle: maximize the ratio of information gained to cost incurred at each step. Cheap, high-sensitivity, low-specificity tests come first (screening), followed by expensive, high-specificity tests (confirmation). This is formalized as the expected value of sample information (EVSI) framework from decision theory.

A mammogram (cheap, ~87% sensitivity, ~90% specificity) precedes a biopsy (expensive, ~99% sensitivity, ~99% specificity). The mammogram eliminates the vast majority of the healthy population from further testing. If you reversed this order and biopsied everyone, the cost would be astronomical and the harm (unnecessary surgical procedures) would be enormous.

The formal ordering criterion is:

```
Priority(test_i) = [Information_gain(test_i)] / [Cost(test_i)]
```

Where information gain is the expected reduction in entropy about the defect state.

### The Base Rate Problem

The single most important insight from screening theory is the base rate effect. Even a highly specific test produces mostly false positives when the prevalence of the condition is low. If a linter has 99% specificity but only 1% of code lines contain defects, then for every 10,000 lines: 100 defective lines are flagged (99 correctly), 9,900 clean lines produce 99 false positives. Nearly half of all positives are false.

This is why screening programs use multi-stage cascades: the first stage raises the effective prevalence for the second stage. After a positive mammogram, the prevalence in the tested subpopulation jumps from ~0.5% to ~10%, making the biopsy's positive predictive value much higher.

### Translation to Software Quality

This translates directly. A fast linter that flags many potential issues (high sensitivity, lower specificity) should run first. Its output then feeds into a more expensive analysis (e.g., an LLM-based review) that operates on a pre-filtered set where the "prevalence" of real issues is much higher. Running the expensive analysis on all code is the equivalent of biopsying every patient.

The Wilson-Jungner criteria also provide a useful filter. Criterion 6 ("acceptable to the population") is why overly aggressive linting rules get disabled by developers, defeating the layer entirely. Criterion 9 (cost balance) is why 100% code coverage mandates often produce negative ROI: the marginal cost of testing trivial getters exceeds the expected cost of the defects they might contain.

### Cautionary Tale

The key failure mode in medical screening that transfers to software: the cascade can amplify false positives through the system. If each stage has even a small false positive rate, and downstream stages trust upstream "positive" signals, the system can generate significant wasted effort investigating non-issues. This is the "alert fatigue" problem, well-documented in both medicine and DevOps monitoring.

---

## 3. Manufacturing Quality Control

### 3a. Statistical Process Control (SPC) and Shewhart Charts

Walter Shewhart's control charts (1924) distinguish between common-cause variation (inherent to the process) and special-cause variation (assignable to a specific event). A process is "in control" when it exhibits only common-cause variation. The formal criterion: a measurement falling outside the control limits (typically mean +/- 3 sigma) indicates special-cause variation.

The mathematical foundation:

```
UCL = X_bar + 3 * (sigma / sqrt(n))
LCL = X_bar - 3 * (sigma / sqrt(n))
```

Where X_bar is the process mean, sigma is the process standard deviation, and n is the sample size. The 3-sigma limits mean that roughly 99.73% of in-control observations fall within bounds; a point outside indicates a process shift with high confidence.

The Western Electric rules extend this with additional patterns: two of three consecutive points beyond 2-sigma, four of five beyond 1-sigma, eight consecutive points on one side of the center line. These detect trends and shifts before a full 3-sigma excursion.

For software quality, SPC suggests tracking defect rates per sprint, per module, or per developer over time. A module whose defect rate suddenly exceeds its historical control limits is exhibiting special-cause variation; something changed (a new contributor, a refactoring, a dependency update) and warrants investigation. This is fundamentally different from asking "is the defect rate low enough?" (a specification limit question) versus "has something changed?" (a process stability question).

### 3b. Six Sigma DMAIC

Six Sigma's DMAIC cycle (Define, Measure, Analyze, Improve, Control) provides a structured improvement methodology. The "Six Sigma" target is 3.4 defects per million opportunities (DPMO), corresponding to a process capability index Cpk >= 2.0.

The defect rate calculation:

```
DPMO = (Number of defects / (Number of units * Number of opportunities per unit)) * 1,000,000
DPO = Defects / Opportunities
Yield = (1 - DPO) * 100%
```

For software, this maps to: if a "unit" is a function and an "opportunity" is a possible defect type (null reference, off-by-one, resource leak, etc.), then a module with 50 functions and 10 opportunity types per function has 500 opportunities. Finding 5 defects gives DPMO = 10,000, roughly a 3.8-sigma process.

The practical value of DMAIC for harness engineering is the insistence on measurement before improvement. The "Measure" phase establishes a baseline. Without it, you cannot determine whether an intervention (adding a new linter rule, a new test category, a new review step) actually improved the defect escape rate. Most software teams skip this step entirely, adding quality gates on intuition rather than data.

### 3c. Taguchi Methods

Genichi Taguchi's contribution was the concept of robust design: instead of controlling every input variable, design the system so that its output is insensitive to variation in uncontrolled inputs (noise factors). The formal tool is the signal-to-noise ratio (S/N):

```
S/N = -10 * log10(mean squared deviation from target)
```

Taguchi's loss function is also critical:

```
L(y) = k * (y - T)^2
```

Where y is the actual value, T is the target, and k is a cost constant. This says that quality loss is not a step function (good/bad at a specification limit) but a continuous quadratic function; being close to the target is always better than being far from it, even if both are "within spec."

For software quality, this challenges the binary pass/fail mentality. A test suite that passes does not mean the code is equally good as another passing suite. A function with cyclomatic complexity 8 is measurably closer to the "target" than one with complexity 14, even if both are below a threshold of 15. Quality layers that report continuous metrics (not just pass/fail) enable Taguchi-style optimization.

### 3d. The Cost of Quality Model

Philip Crosby and Armand Feigenbaum formalized the Cost of Quality (CoQ) into four categories:

1. **Prevention costs**: Training, process design, tooling investment (linter configuration, test infrastructure, CI/CD setup)
2. **Appraisal costs**: Inspection, testing, code review (running the tests, reviewing PRs, static analysis)
3. **Internal failure costs**: Rework, debugging, re-testing (fixing bugs found before release)
4. **External failure costs**: Production incidents, customer support, reputation damage, security breaches

The empirical finding across manufacturing is that total CoQ follows a U-shaped curve: too little prevention/appraisal investment leads to high failure costs, but excessive prevention/appraisal eventually costs more than the failures it prevents. The optimal point is typically around 15-25% of total project cost spent on prevention and appraisal combined, with the split favoring prevention over appraisal by roughly 2:1.

The American Society for Quality (ASQ) data from manufacturing consistently shows that $1 spent on prevention saves $10 in appraisal and $100 in external failure costs. This 1:10:100 ratio has been replicated across industries and is the strongest empirical justification for investing in upstream quality gates.

---

## 4. Economic Models of Software Quality

### Capers Jones' Defect Removal Data

Capers Jones' longitudinal studies (spanning 1975-2015, covering roughly 25,000 software projects) established the cost escalation curve for defect removal by phase:

| Phase | Relative Cost to Fix |
|-------|---------------------|
| Requirements | 1x |
| Design | 3-6x |
| Coding | 10x |
| Testing | 15-40x |
| Production | 30-100x |

Jones also measured defect removal efficiency (DRE) by technique:

| Technique | Typical DRE |
|-----------|------------|
| Formal inspections | 55-65% |
| Static analysis | 40-55% |
| Unit testing | 25-35% |
| Integration testing | 35-45% |
| System testing | 25-35% |
| All combined | 95-99% |

The critical insight is that no single technique exceeds about 65% DRE. Achieving 95%+ requires combining multiple techniques, and the combination is roughly additive (not multiplicative) because techniques overlap in what they detect.

### COCOMO II Defect Removal Efficiency

Barry Boehm's COCOMO II model estimates defect introduction rates and removal efficiencies as functions of project characteristics. The model predicts that a project with average process maturity introduces approximately 20-25 defects per KSLOC (thousand source lines of code) and removes them at rates varying by phase:

- Design reviews: 40-60% of design defects
- Code inspections: 50-70% of coding defects  
- Unit testing: 30-50% of remaining defects
- Integration testing: 30-50% of remaining defects
- System testing: 30-50% of remaining defects

The compounding effect means that after all phases, roughly 1-5% of introduced defects escape to production. For a 100 KSLOC system with 2,500 introduced defects, this is 25-125 latent production defects.

### The Boehm Cost Escalation Curve: Still Valid?

Boehm's original 1976 finding (cost escalation of 100:1 from requirements to maintenance) has been challenged. Laurent Bossavit's "The Leprechauns of Software Engineering" (2012) traces the claim through the citation chain and finds that the original data is thin: a handful of IBM and TRW projects from the 1970s, with wide variance and questionable controls.

More recent studies paint a nuanced picture:

- **Supports the curve**: A 2014 IBM Systems Sciences Institute study still found 4-5x escalation from design to coding and 100x from design to maintenance for enterprise systems
- **Challenges the curve**: Agile and CI/CD environments show much flatter curves because the time between introduction and detection is shorter, rework is incremental, and the cost of deployment is near-zero
- **The nuanced position**: The cost escalation is real but its magnitude depends on the architecture. Monolithic systems with tightly coupled components show steep escalation. Microservice architectures with independent deployability show flatter curves because a defect in one service can be fixed and deployed without touching others

For AI-assisted development specifically, the curve may actually steepen in one dimension: AI-generated code that passes superficial review but contains subtle logical errors can embed defects deeply into a codebase. The "cost to find" component increases because the developer did not write the code and may not fully understand its behavior, making root cause analysis harder.

### Translation to Software Quality Architecture

The economic models converge on a single principle: invest in early detection. But the magnitude of the payoff depends on your deployment architecture and feedback loop speed. In a continuous deployment environment with feature flags and canary releases, the production-fix cost may be 10x rather than 100x, which changes the optimal allocation between prevention and detection layers.

---

## 5. Inspection Theory from Operations Research

### Optimal Inspection Policies

Operations research formalizes the inspection problem as: given a stream of items with defect rate p, inspection cost c_i per item, and cost of a missed defect c_d, what is the optimal inspection policy?

The single-stage solution is straightforward. Inspect if:

```
c_i < p * c_d
```

That is, inspect when the expected cost of a missed defect exceeds the cost of inspection.

For multi-stage inspection with varying defect types, the problem becomes a sequential decision process. The Bellman equation for optimal inspection at stage k:

```
V_k(state) = min(inspect_cost + E[V_{k+1}], skip_cost + p_k * defect_cost + E[V_{k+1}])
```

This dynamic programming formulation captures the key tradeoff: each inspection stage has a cost, but skipping it risks a defect escaping to a more expensive downstream stage.

### Acceptance Sampling (MIL-STD-1916)

Military Standard 1916 (which replaced MIL-STD-105E) defines acceptance sampling procedures: rather than inspecting every item, inspect a sample and accept or reject the entire lot based on the sample results. The operating characteristic (OC) curve defines the probability of accepting a lot as a function of the true defect rate:

```
P(accept) = sum_{d=0}^{c} C(n,d) * p^d * (1-p)^{n-d}
```

Where n is the sample size, c is the acceptance number (maximum defects allowed), and p is the defect rate.

The key parameters are:
- **AQL** (Acceptable Quality Level): The defect rate considered acceptable (high probability of acceptance)
- **LTPD** (Lot Tolerance Percent Defective): The defect rate considered unacceptable (low probability of acceptance)

For software, this maps to sampling-based testing strategies: you do not test every possible input, you test a sample and make inferences about the defect population. Property-based testing (QuickCheck, Hypothesis) is essentially acceptance sampling with random sample generation.

### Wald's Sequential Probability Ratio Test (SPRT)

Abraham Wald's SPRT (1945) provides the optimal sequential test: observe data points one at a time and, after each observation, either accept H0, accept H1, or continue testing. The decision boundaries are:

```
Accept H0 if: likelihood_ratio <= B = beta / (1 - alpha)
Accept H1 if: likelihood_ratio >= A = (1 - beta) / alpha
Continue if: B < likelihood_ratio < A
```

Where alpha is the false positive rate and beta is the false negative rate. Wald proved that SPRT minimizes the expected number of observations needed to reach a decision at given error rates.

For software quality, SPRT provides the formal basis for adaptive testing: run tests sequentially, and stop early when there is sufficient evidence that the code is either defective or clean. This is more efficient than running a fixed test suite to completion. Modern mutation testing frameworks implicitly use this idea when they stop testing a mutant as soon as any test kills it.

---

## 6. The Swiss Cheese Model (James Reason)

### The Framework

James Reason's Swiss Cheese Model (1990) models accident causation as a sequence of defensive layers, each with "holes" (weaknesses). An accident occurs only when the holes in all layers align, allowing a hazard to pass through every defense.

The model distinguishes:

- **Active failures**: Unsafe acts by people at the sharp end (a developer introducing a bug)
- **Latent conditions**: Organizational factors that create the holes (inadequate testing infrastructure, time pressure, unclear requirements)
- **Defenses**: Barriers designed to prevent hazards from causing harm (code review, testing, CI/CD checks)

The formal version expresses the probability of an accident as:

```
P(accident) = P(hazard) * product_i[P(hole_i | hazard reaches layer i)]
```

But critically, Reason emphasized that holes are not static. They open and close dynamically due to organizational factors, staffing changes, process drift, and complacency.

### Key Empirical Results

Reason's analysis of major accidents (Chernobyl, Challenger, Piper Alpha) consistently found that the failures were not due to a single layer failing but to systematic degradation of multiple layers simultaneously, often driven by the same organizational pressure. This is the common-mode failure problem: a deadline that causes both rushed coding and abbreviated code review creates correlated holes across two nominally independent layers.

The healthcare sector's adoption of Reason's model has generated substantial data. A 2016 Johns Hopkins study estimated that medical errors are the third leading cause of death in the US (approximately 250,000 deaths/year), despite multiple layers of defense (training, checklists, peer review, monitoring). The primary cause: the layers share common organizational failure modes (fatigue, staffing pressure, communication breakdowns).

### Translation to Software Quality

The Swiss Cheese Model provides the strongest argument against treating quality layers as independent probability reducers. In a software context:

- A sprint deadline creates correlated holes: developers write hasty code, reviewers rubber-stamp reviews, and test coverage gets cut
- An LLM generating code and an LLM reviewing that same code share common training biases; this is a textbook common-mode failure
- "Works on my machine" testing and CI testing share the same code, so environment-specific bugs pass through both

The design implication: quality layers should be deliberately constructed to have uncorrelated failure modes. Use different tools (not just different instances of the same approach), different people (author vs. reviewer), and different perspectives (unit vs. integration vs. property-based vs. fuzzing).

---

## 7. Fault Tree Analysis and Reliability Engineering

### Series vs. Parallel Redundancy

Reliability engineering distinguishes two redundancy configurations:

**Series** (all must work for the system to work):
```
R_system = R_1 * R_2 * ... * R_n
```
Adding components in series decreases reliability. Every additional component is another failure point.

**Parallel** (any one working is sufficient):
```
R_system = 1 - (1 - R_1) * (1 - R_2) * ... * (1 - R_n)
```
Adding components in parallel increases reliability. This is the redundancy model for defect detection.

Quality layers in a software pipeline are parallel defect detectors: if any one layer catches the defect, the defect is caught. The system reliability (defect detection rate) is:

```
P(detect) = 1 - (1 - d_1) * (1 - d_2) * ... * (1 - d_n)
```

Where d_i is the detection probability of layer i. With three layers each at 60% detection: P(detect) = 1 - 0.4^3 = 93.6%.

### Fault Tree Analysis (FTA)

FTA works top-down from an undesired event (defect escapes to production) through AND/OR gates to basic events (individual layer failures). The minimal cut sets identify the smallest combinations of basic events that cause the top event.

For a quality pipeline with layers L1, L2, L3 in series (defect must pass through all to escape):

```
Top event: Defect Escape
  AND gate:
    L1 fails to detect
    L2 fails to detect
    L3 fails to detect
```

The minimal cut set is {L1_fail, L2_fail, L3_fail}. The system is vulnerable only when all three fail simultaneously.

But if layers share a common cause (e.g., all are LLM-based and share the same blind spots):

```
Top event: Defect Escape
  OR gate:
    AND gate: L1_fail, L2_fail, L3_fail (independent failures)
    Common cause event: shared_blind_spot (all fail together)
```

The common cause event creates a single-point failure that bypasses the redundancy entirely. The beta-factor model quantifies this:

```
P(common cause failure) = beta * P(individual failure)
```

Where beta ranges from 0 (fully independent) to 1 (fully correlated). Typical engineering values for beta in nuclear and aerospace applications range from 0.01 to 0.1 for well-designed diverse systems.

### Translation to Software Quality

If all your quality layers are LLM-based, beta could be very high (0.3-0.8), meaning the effective defect escape rate is much worse than the naive multiplicative model predicts. Diversity in detection mechanism (LLM review + static analysis + property-based testing + human review) drives beta down. This is the formal justification for using fundamentally different technologies at each layer rather than multiple instances of the same approach.

---

## 8. Common Principles of Defense-in-Depth Across Domains

### Principle 1: Cheap, Broad Layers First (The Screening Principle)

Every domain places the cheapest, fastest, broadest detection mechanism first. Network security puts firewalls before intrusion detection systems. Medicine puts questionnaires before blood tests before biopsies. Manufacturing puts visual inspection before measurement before destructive testing.

For software: static analysis (milliseconds, zero runtime cost) before unit tests (seconds) before integration tests (minutes) before manual review (hours).

### Principle 2: Layer Independence Determines System Effectiveness

The mathematical gain from adding layers depends almost entirely on the correlation between layer failures. All domains recognize this. Nuclear engineering mandates "diversity" (different technologies, different suppliers, different design teams) for redundant safety systems. Medicine uses "orthogonal" tests that detect different biomarkers.

For software: a linter, a type checker, and a unit test suite are moderately independent (they catch different defect classes). Three different LLMs reviewing the same code are weakly independent (they share training data, architectural biases, and prompt-sensitivity patterns).

### Principle 3: The Diminishing Returns Curve

Every domain exhibits the same pattern: the first few layers provide dramatic improvement, and each subsequent layer provides less. Network security's CIS data (5 controls handle 85% of attacks), medicine's screening cascade (first test eliminates 90% of the healthy population), manufacturing's Pareto principle (20% of defect types cause 80% of failures).

For software: a type system and a basic test suite together catch perhaps 70-80% of defects. Adding linting gets to 85%. Adding code review gets to 90%. Getting from 90% to 99% requires significant additional investment, and from 99% to 99.9% is an order of magnitude more.

### Principle 4: Common-Mode Failures Are the Dominant Risk

Reason's Swiss Cheese Model, reliability engineering's common-cause failure analysis, and network security's correlation studies all converge: the primary risk is not that individual layers fail but that they fail together for the same reason. Organizational pressure (deadlines, understaffing) is the most common common-mode failure across all domains.

For AI-assisted software development, a new common-mode failure emerges: model homogeneity. When the same foundation model (or closely related models) both generates and reviews code, the detection layer inherits the generation layer's blind spots. This is the software equivalent of having the same engineering firm design and inspect a bridge.

### Principle 5: Continuous Monitoring Outperforms Point-in-Time Inspection

SPC's control charts, network security's continuous monitoring (NIST CSF "Detect" function), and medicine's longitudinal screening programs all show that ongoing process monitoring catches degradation earlier than periodic batch inspection. The formal reason: process drift is continuous, so detection should be too.

For software: CI/CD pipelines that run on every commit outperform periodic quality audits. But the SPC insight adds nuance: track not just "did tests pass?" but "how is the defect introduction rate trending?" A module whose defect rate is rising but still within limits is exhibiting a trend that warrants investigation before it crosses the threshold.

---

## 9. Cautionary Tales: Assumptions That Don't Transfer

### The Independence Fallacy

The most dangerous assumption to import from other domains is that layers are independent. In network security, a firewall and an IDS are designed by different teams, use different detection methods, and operate at different network layers; their independence is engineered. In a typical software quality pipeline, all layers operate on the same artifact (the source code), may be configured by the same person, and are subject to the same organizational pressures. Independence must be deliberately constructed, not assumed.

### The Static Topology Assumption

Reliability engineering models typically assume a fixed system topology. In software, the quality pipeline is itself software, subject to configuration drift, dependency updates, and human modification. A linter rule that gets disabled "temporarily" during a crunch, a test suite that slowly becomes unmaintained, a code review process that becomes perfunctory under deadline pressure: these are dynamic topology changes that reliability models don't naturally capture.

### The Rational Actor Assumption

Operations research models often assume that the decision-maker will implement the optimal policy. In practice, developers disable warnings, skip tests, merge without review, and ignore static analysis findings. The Wilson-Jungner criterion 6 ("acceptable to the population") is the medical field's acknowledgment that the best screening test is useless if patients refuse it. Quality layers that developers consistently bypass provide zero defect detection regardless of their theoretical effectiveness.

### The Measurability Assumption

Manufacturing quality control works because defects are countable, classifiable, and their costs are estimable. Software defects resist this treatment. A null pointer exception is easy to count; a subtle race condition that manifests once per million requests is hard to count; an architectural decision that makes the system harder to modify is nearly impossible to count. The Cost of Quality model requires quantified costs at each level, and for software, the external failure cost estimation is often speculative.

### The Cost Curve May Be Flatter Than Claimed

As noted in the Boehm section, the 100:1 cost escalation from requirements to production is based on thin evidence and may not apply in modern CI/CD environments. Organizations that design their quality architecture around a steep cost curve may over-invest in early prevention at the expense of fast detection and recovery. The optimal strategy depends on your actual cost curve, not the textbook one.

---

## 10. Synthesis: A Formal Framework for Software Quality Layers

Drawing from all domains, the design principles for a layered quality architecture are:

1. **Order by cost-effectiveness ratio**: Information gained per unit cost, highest first (screening theory)
2. **Maximize inter-layer independence**: Different detection mechanisms, different failure modes, diverse technology (reliability engineering)
3. **Track process stability, not just pass/fail**: Use SPC-style trending to detect degradation before threshold violations (manufacturing)
4. **Account for common-mode failures**: Identify shared organizational and technical failure modes that can defeat multiple layers simultaneously (Swiss Cheese Model)
5. **Measure defect removal efficiency per layer**: Without measurement, you cannot optimize allocation (Six Sigma DMAIC, Capers Jones)
6. **Design for acceptability**: Layers that developers bypass provide zero value; friction must be below the tolerance threshold (Wilson-Jungner)
7. **Prefer prevention over detection**: The 1:10:100 cost ratio favors investment in preventing defect introduction over detecting defects after introduction (Cost of Quality)
8. **Use adaptive stopping**: Don't run the full cascade when early layers provide sufficient confidence (Wald's SPRT)
9. **Model the correlation structure explicitly**: The naive multiplicative model overstates the benefit of correlated layers; use beta-factor or similar correlation models to estimate true system effectiveness (fault tree analysis)
10. **Treat the quality pipeline itself as a system subject to degradation**: Monitor the monitors (SPC applied to the quality process itself)

The mathematical framework that best captures all of these is a Bayesian network with correlated layer nodes, where each node has empirically estimated detection probability and cost, and the edges encode correlation structure. The optimal pipeline configuration is then the one that minimizes expected total cost (prevention + appraisal + internal failure + external failure) subject to a target defect escape rate constraint.

This is, fundamentally, a constrained optimization problem. The domains above provide the tools to formulate it; the engineering challenge is estimating the parameters for your specific codebase and team.
