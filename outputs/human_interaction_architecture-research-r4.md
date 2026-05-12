# Signal Detection & Inspection Theory: Formal/Mathematical Foundations for Human Code Review in AI Coding Harnesses

## Research Document R4: Signal Detection, Sampling Inspection, and Vigilance Theory

---

## 1. Signal Detection Theory: The Formal Framework

### 1.1 Origins and Core Model (Green & Swets, 1966)

Signal Detection Theory (SDT) was formalized by Green and Swets in *Signal Detection Theory and Psychophysics* (1966, Wiley). The framework emerged from radar operator research during WWII and was adopted into psychophysics to address a fundamental limitation of classical threshold theory: the inability to separate a subject's true perceptual sensitivity from their response bias (Green & Swets, 1966).

The core model posits two overlapping probability distributions along an internal decision axis:

- **Noise distribution** $N(\mu_n, \sigma)$: the internal response when no signal is present
- **Signal+Noise distribution** $N(\mu_{s+n}, \sigma)$: the internal response when a signal is present

The observer sets a **criterion** (decision threshold) $\lambda$ along this axis. On each trial, the observer reports "signal present" if their internal response exceeds $\lambda$, and "noise" otherwise.

### 1.2 Key Parameters

**Sensitivity (d-prime):**

$$d' = \frac{|\mu_{s+n} - \mu_n|}{\sigma}$$

For equal-variance Gaussian distributions, this simplifies to the practical computation:

$$d' = z(H) - z(F)$$

where $H$ is the hit rate (proportion of signal trials correctly identified), $F$ is the false alarm rate (proportion of noise trials incorrectly called signals), and $z(\cdot)$ is the inverse of the standard normal cumulative distribution function (Green & Swets, 1966; Macmillan & Creelman, 2005).

Interpretation of d-prime values:
- $d' = 0$: chance performance (signal and noise distributions completely overlap)
- $d' = 1$: moderate sensitivity
- $d' = 2$: good sensitivity
- $d' = 3$: excellent sensitivity
- $d' = 4.65$: near-perfect (corresponds to approximately 99.99% correct in 2AFC)

**Criterion (beta and c):**

The likelihood ratio criterion:

$$\beta = \frac{f_{s+n}(\lambda)}{f_n(\lambda)} = \frac{\phi(z(H) - d')}{\phi(z(H))}$$

where $\phi$ is the standard normal probability density function. An unbiased observer sets $\beta = 1$. Values $\beta > 1$ indicate conservative responding (fewer false alarms, more misses); $\beta < 1$ indicates liberal responding.

The location criterion $c$ (Macmillan & Creelman, 2005) is often preferred:

$$c = -\frac{1}{2}[z(H) + z(F)]$$

where $c = 0$ represents an unbiased observer, $c > 0$ is conservative, and $c < 0$ is liberal.

**ROC Curves:**

The Receiver Operating Characteristic curve plots the hit rate against the false alarm rate across all possible criterion values. The area under the ROC curve (AUC) provides a criterion-free measure of sensitivity, ranging from 0.5 (chance) to 1.0 (perfect discrimination). For equal-variance Gaussian SDT:

$$AUC = \Phi\left(\frac{d'}{\sqrt{2}}\right)$$

where $\Phi$ is the standard normal CDF (Green & Swets, 1966).

### 1.3 The Four Outcomes

| | Signal Present | Signal Absent |
|---|---|---|
| **"Yes" Response** | Hit (H) | False Alarm (F) |
| **"No" Response** | Miss (1-H) | Correct Rejection (1-F) |

This 2x2 matrix is the foundation of all SDT analysis and maps directly to code review: a defect is the "signal," clean code is "noise," and the reviewer must classify each code segment.

---

## 2. SDT Applied to Code Review

### 2.1 The Code Review Detection Problem

Code review is formally a signal detection task. For each unit of code under review, the reviewer must decide: does this contain a defect (signal) or is it correct (noise)? The mapping is direct:

- **Hit**: Reviewer correctly identifies a defect
- **Miss**: Reviewer fails to identify a defect (defect escapes)
- **False Alarm**: Reviewer flags correct code as defective
- **Correct Rejection**: Reviewer correctly passes clean code

### 2.2 Estimated d-prime for Code Review

No published study has directly computed d-prime for code reviewers using formal SDT methodology. However, we can derive estimates from the empirical literature on defect detection rates.

**From Fagan Inspection data (Fagan, 1976):** IBM's original trials found inspections detected 82% of errors. If we assume a false alarm rate of approximately 15% (based on the finding that 75% of code review comments address maintainability rather than true bugs; Beller et al., 2014), then:

$$d' = z(0.82) - z(0.15) = 0.915 - (-1.036) = 1.95$$

**From the Cisco/SmartBear study (Cohen, 2006):** At optimal review rates (fewer than 200 LOC, under 60 minutes), defect detection reached 70-90%. Taking a midpoint of 80% hit rate with an estimated 10% false alarm rate:

$$d' = z(0.80) - z(0.10) = 0.842 - (-1.282) = 2.12$$

**From Capers Jones data (Jones, 1996):** Formal inspections achieve 60-65% detection; informal inspections detect fewer than 50%. For informal review (50% detection, 20% false alarm estimate):

$$d' = z(0.50) - z(0.20) = 0 - (-0.842) = 0.84$$

These derived values place code review sensitivity in the range $d' \approx 0.8$ to $2.1$, comparable to many professional detection tasks (radiology typically achieves $d' \approx 1.5$ to $3.0$ depending on lesion type and imaging modality).

### 2.3 Factors Affecting d-prime and Criterion

**Review Rate and d-prime:** The Cisco study found that inspection rates below 300 LOC/hour produced the best defect detection. Above 500 LOC/hour, a significant percentage of defects are missed (Cohen, 2006). Fagan (1976) recommended approximately 150 LOC/hour. Jureczko et al. (2020) confirmed that review rates at or below 200 LOC/hour identify nearly two-thirds of defects.

This rate sensitivity suggests that d-prime degrades rapidly with increased inspection speed, likely because faster review converts the task from a "successive discrimination" (comparing current code against a mental standard) to a cursory scan, reducing the signal-to-noise ratio of the reviewer's internal representation.

**Review Size and d-prime:** The Cisco study analyzed 2,500 code reviews covering 3.2 million lines of code and found a "sweet spot" around 200 lines of code for maximum defect detection. Beyond 400 lines, defect detection rates collapse. This is consistent with the vigilance literature (Section 6), suggesting that d-prime degrades with prolonged task exposure.

**Review Duration:** Defect detection rates drop sharply after 60-90 minutes of continuous review (Cohen, 2006). This aligns with Mackworth's (1948) finding of 10-15% detection decline in the first 30 minutes (Section 6.1).

**Code Complexity:** Higher complexity code represents a harder detection task (lower base d-prime) because the signal (defect) is embedded in noisier surroundings. The analogy to SDT is direct: complex code increases the variance of both signal and noise distributions, reducing their separation.

**Changeset Size and Comment Density:** Empirical data shows a negative correlation ($r = -0.33$ to $-0.42$) between changeset size and comment density (review thoroughness), suggesting that d-prime decreases faster than linearly with review size (Uchoa et al., 2021).

---

## 3. Dodge-Romig Sampling Inspection (1929)

### 3.1 Historical Context

Harold F. Dodge and Harry G. Romig developed their sampling inspection tables at Bell Telephone Laboratories in the late 1920s and early 1930s, publishing the definitive *Sampling Inspection Tables: Single and Double Sampling* (Dodge & Romig, 1944/1959). Their key innovation was demonstrating that a target outgoing quality level could be guaranteed by inspecting only a fraction of items, with the required fraction depending on the incoming quality level.

### 3.2 Core Concepts and Formulas

**Average Outgoing Quality (AOQ):**

Under rectifying inspection (rejected lots are 100% screened and defective items replaced), the average quality of outgoing material is:

$$AOQ = \frac{P_a \cdot p \cdot (N - n)}{N}$$

where:
- $P_a$ = probability of accepting the lot under the sampling plan
- $p$ = incoming fraction defective (process average)
- $N$ = lot size
- $n$ = sample size

When $N \gg n$, this simplifies to $AOQ \approx P_a \cdot p$.

**Average Outgoing Quality Limit (AOQL):**

The AOQL is the maximum value of the AOQ function across all possible incoming quality levels:

$$AOQL = \max_p \left[\frac{P_a(p) \cdot p \cdot (N - n)}{N}\right]$$

This is the key insight: regardless of how bad the incoming quality is, the outgoing quality can never exceed the AOQL, because worse incoming lots are more likely to be rejected and 100% inspected. The AOQL represents the worst-case average outgoing quality.

**Lot Tolerance Percent Defective (LTPD):**

The LTPD is the quality level at which the probability of lot acceptance is exactly the consumer's risk $\beta$ (conventionally set at 0.10):

$$P_a(p = LTPD) = \beta = 0.10$$

This means lots at the LTPD quality level have a 90% chance of being rejected, providing strong protection against poor-quality shipments.

**Average Total Inspection (ATI):**

For single sampling with rectifying inspection:

$$ATI = n + (1 - P_a)(N - n)$$

This quantifies the expected inspection workload. When quality is good ($P_a$ high), ATI approaches $n$ (just the sample). When quality is poor ($P_a$ low), ATI approaches $N$ (nearly 100% inspection).

For double sampling:

$$ATI = n_1 P_{a_1} + (n_1 + n_2) P_{a_2} + N(1 - P_{a_1} - P_{a_2})$$

### 3.3 The Probability of Acceptance

For a single sampling plan with sample size $n$ and acceptance number $c$, the probability of acceptance for incoming quality $p$ follows the binomial distribution:

$$P_a = \sum_{i=0}^{c} \binom{n}{i} p^i (1-p)^{n-i}$$

For finite lot sizes, the hypergeometric distribution applies:

$$P_a = \sum_{i=0}^{c} \frac{\binom{D}{i}\binom{N-D}{n-i}}{\binom{N}{n}}$$

where $D$ is the number of defective items in the lot.

### 3.4 The Dodge-Romig Insight for AI Harnesses

The fundamental insight is quantitative and powerful: you do not need to inspect everything to guarantee a quality level. If the process average is good (low $p$), you inspect less. If the process average deteriorates, you inspect more. The AOQL guarantee holds regardless.

This maps directly to AI coding agent output: if the agent's "process average" (defect rate) is low and stable, a small sample of its output can be reviewed. If defects start appearing, the review fraction must increase. The mathematical framework provides exact sample sizes for any desired quality guarantee.

---

## 4. MIL-STD-105E Switching Rules

### 4.1 Overview

MIL-STD-105E (1989), standardized as ANSI/ASQ Z1.4 and ISO 2859-1, is the most widely used acceptance sampling standard. It extends Dodge-Romig's framework with adaptive switching rules that automatically adjust inspection intensity based on recent quality history.

### 4.2 The Three Inspection Levels

**Normal Inspection:** The default starting state. Used when there is no evidence that the supplier's quality deviates from the Acceptable Quality Level (AQL). A lot of a given size is sampled according to the standard's tables.

**Tightened Inspection:** Larger sample sizes and/or tighter acceptance criteria. Applied when recent evidence suggests quality problems.

**Reduced Inspection:** Smaller sample sizes. Applied when sustained good quality has been demonstrated, reducing inspection cost without sacrificing quality protection.

### 4.3 Switching Rules

**Normal to Tightened:** Switch when 2 out of 5 consecutive lots are rejected under normal inspection.

**Tightened to Normal:** Switch back after 5 consecutive lots are accepted under tightened inspection.

**Normal to Reduced:** Switch when all of the following are met:
1. 10 consecutive lots have been accepted under normal inspection
2. The total number of nonconforming items across those 10 lots is below the limit specified in Table VIII of the standard
3. Production is at a steady rate

**Reduced to Normal:** Switch back if any lot is rejected, production becomes irregular, or other conditions warrant.

**Discontinue Inspection:** If 10 consecutive lots remain on tightened inspection without reverting to normal, inspection is discontinued and the supplier must take corrective action.

### 4.4 Operating Characteristic Curves

The OC curve for a sampling plan plots $P_a$ (probability of acceptance) against $p$ (incoming fraction defective). The MIL-STD-105E scheme OC curve (combining normal, tightened, and reduced inspection under the switching rules) is steeper than any single plan's OC curve, approaching the ideal step function that accepts all lots at or below the AQL and rejects all lots above the AQL.

For the Quick Switching System (QSS-1), the composite probability of acceptance is:

$$P_{scheme} = \frac{P_T}{(1 - P_N) + P_T}$$

where $P_N$ and $P_T$ are the probabilities of acceptance under normal and tightened plans respectively (Romboski, 1969).

For normal-tightened schemes:

$$P_{scheme} = \frac{a \cdot P_N + b \cdot P_T}{a + b}$$

where $a$ and $b$ are steady-state probabilities of being in the normal and tightened states respectively.

### 4.5 Numerical Example

For lot sizes 151-280 with AQL = 1.0% (code letter G):
- **Normal plan:** $n = 50$, $c = 1$
- **Tightened plan:** $n = 80$, $c = 1$
- **Scheme performance:** effective AQL $\approx 0.5\%$, LTPD $\approx 2.85\%$

### 4.6 Cost Reduction from Adaptive Inspection

The reduced inspection level samples fewer items from each lot, while the switching rules ensure that this reduced scrutiny is only applied when quality has been demonstrably good. The ATI formula quantifies the savings:

$$ATI_{scheme} = \sum_{states} \pi_s \cdot ATI_s$$

where $\pi_s$ is the steady-state probability of being in inspection state $s$. When the process average is well below the AQL (the typical scenario for a well-tuned process), the system spends most of its time in reduced inspection, and the ATI can be a fraction of what 100% inspection or even fixed-rate normal inspection would require. Montgomery (2009) notes that for processes running at quality levels well within specification, the scheme can reduce inspection volume substantially compared to fixed-rate sampling, as the system naturally gravitates toward reduced inspection.

---

## 5. Adaptation of Sampling Inspection to Software

### 5.1 Fagan's Inspection Method (IBM, 1976)

Michael Fagan developed the formal software inspection process at IBM, first documented in an internal technical report (June 10, 1976) and published in the IBM Systems Journal (Vol. 15, Issue 3, pp. 182-211). Key quantitative findings:

- **Detection rate:** 82% of errors detected before unit testing in original IBM trials
- **Optimal inspection rate:** approximately 150 LOC/hour (Fagan, 1976); broadly confirmed at 150-200 LOC/hour by subsequent studies
- **Cost savings:** up to 25% reduction in development resources
- **Early detection economics:** remediation costs are 10x to 100x lower when defects are caught during inspection vs. maintenance
- **Industry confirmation:** AT&T (200+ developers) reported 14% productivity increase and 90% defect decrease; Aetna Insurance found 82% of program errors caught in inspections with 20% resource savings; IBM's Orbit project achieved approximately 1% of normally expected error rates using 11 inspection levels (Cohen, 2006)

Fagan's method includes defined roles (moderator, author, reader, inspector), entry/exit criteria, and systematic preparation, making it the most structured analogue to acceptance sampling in software engineering.

### 5.2 What Is a "Lot" in Software?

Mapping Dodge-Romig/MIL-STD-105E concepts to software review requires defining the unit of inspection:

| Manufacturing Concept | Software Analogue | Rationale |
|---|---|---|
| Lot | A Pull Request (PR) or changeset | A discrete unit of work submitted for review |
| Item within lot | A file, function, or code hunk within the PR | Individual inspectable units |
| Defect | A bug, vulnerability, or design flaw | The "signal" to be detected |
| Process average | Agent's historical defect rate | Baseline quality level |
| Inspection station | Human reviewer workstation | The review environment |

The PR is the natural "lot" because it represents a coherent unit of work with a defined boundary, just as a manufacturing lot represents a batch produced under nominally identical conditions.

### 5.3 Worked Example: Dodge-Romig AOQL Plan for AI Agent Output

**Scenario:** An AI coding agent produces PRs averaging 10 files each. Historical data shows the agent introduces defects in approximately 5% of files (process average $\bar{p} = 0.05$). We want to guarantee AOQL = 3% (no more than 3% of files leaving review contain defects, on average).

**Step 1: Determine the sampling plan.**

Using the AOQL formula with $N = 10$ (files per PR), we need a plan $(n, c)$ where:

$$AOQL = \max_p \left[\frac{P_a(p) \cdot p \cdot (N - n)}{N}\right] \leq 0.03$$

For $n = 4$, $c = 0$ (sample 4 files, accept if 0 defects found):

$$P_a(p) = (1-p)^4$$

The AOQ function becomes:

$$AOQ(p) = \frac{(1-p)^4 \cdot p \cdot (10 - 4)}{10} = 0.6p(1-p)^4$$

Taking the derivative and setting to zero:

$$\frac{d}{dp}[0.6p(1-p)^4] = 0.6[(1-p)^4 - 4p(1-p)^3] = 0$$
$$(1-p) - 4p = 0 \implies p = 0.2$$

$$AOQL = 0.6 \times 0.2 \times (0.8)^4 = 0.6 \times 0.2 \times 0.4096 = 0.0492$$

This is 4.9%, which exceeds our 3% target. We need a larger sample.

For $n = 6$, $c = 0$:

$$AOQ(p) = \frac{(1-p)^6 \cdot p \cdot 4}{10} = 0.4p(1-p)^6$$

Maximum at $p = 1/7 \approx 0.143$:

$$AOQL = 0.4 \times 0.143 \times (0.857)^6 = 0.4 \times 0.143 \times 0.394 = 0.0225$$

This gives AOQL = 2.25%, which meets our 3% target.

**Step 2: Compute ATI at the process average.**

At $\bar{p} = 0.05$:

$$P_a = (1 - 0.05)^6 = 0.95^6 = 0.735$$
$$ATI = 6 + (1 - 0.735)(10 - 6) = 6 + 0.265 \times 4 = 7.06 \text{ files}$$

**Step 3: Compare to 100% inspection.**

At 100% inspection: ATI = 10 files per PR (always).
At $\bar{p} = 0.05$: ATI = 7.06 files per PR.
**Savings: 29.4% reduction in review volume** while guaranteeing AOQL $\leq$ 3%.

If the agent's quality improves to $\bar{p} = 0.02$:

$$P_a = 0.98^6 = 0.886$$
$$ATI = 6 + 0.114 \times 4 = 6.46 \text{ files}$$

**Savings: 35.4%** with better incoming quality.

**Step 4: Apply MIL-STD-105E-style switching.**

- **Normal inspection:** Sample 6 of 10 files ($c = 0$)
- **Tightened inspection:** Sample 8 of 10 files ($c = 0$), triggered after 2 of 5 PRs contain defects in the sample
- **Reduced inspection:** Sample 3 of 10 files ($c = 0$), allowed after 10 consecutive clean PRs

Under reduced inspection at $\bar{p} = 0.02$:

$$P_a = 0.98^3 = 0.941$$
$$ATI = 3 + 0.059 \times 7 = 3.41 \text{ files}$$

**Savings under reduced inspection: 65.9%** of review volume eliminated while maintaining quality protection through the switching rules.

---

## 6. Vigilance Research

### 6.1 Mackworth's Clock Test (1948)

Norman Mackworth's Clock Test is the foundational experiment in vigilance research. Designed to simulate radar operator conditions, participants observed a clock-like display where a pointer moved in regular steps, with occasional double-steps as the target signal (Mackworth, 1948).

**Key quantitative findings:**
- Detection rates declined 10-15% in the first 30 minutes of the task
- Performance continued to decline more gradually over the remaining 90 minutes (total task: 2 hours)
- The decline was most prominent within the first 30 minutes, followed by a steadier decline for the remainder
- Across Mackworth's experimental series, detection declined from approximately 85% to as low as 50%, depending on the condition (Series A: ~85% to ~75%; Series B: ~67% to ~50%; Series C: ~72% to ~50%)

This "vigilance decrement" has been replicated in hundreds of subsequent studies, making it one of the most reliable findings in attention research (Warm, Parasuraman, & Matthews, 2008).

### 6.2 See et al. (1995) Meta-Analysis

See, Warm, Dember, and Howe (1995) conducted a comprehensive meta-analysis of the sensitivity decrement in vigilance, analyzing 42 studies encompassing 138 experimental conditions. Published in *Psychological Bulletin* (Vol. 117, pp. 230-249).

**Key findings:**

The meta-analysis revealed significant effects of three task-related factors, qualified by a three-way interaction:

1. **Type of discrimination:** simultaneous vs. successive
2. **Type of stimulus:** sensory vs. cognitive/symbolic
3. **Event rate:** slow vs. fast

The critical distinction: sensory tasks involve predesignated changes in physical stimulus characteristics (e.g., changes in intensity), whereas cognitive tasks use symbolic or alphanumeric stimuli (See et al., 1995, p. 232).

**Quantitative effect sizes:**
- For simultaneous discriminations with symbolic stimuli at high event rates: predicted effect size (sensitivity decrement) $\approx 0.5$
- For sequential discriminations with sensory stimuli at high event rates: predicted effect size $\approx 1.0$
- At slow event rates: effect sizes near zero regardless of task type

**Major conclusion:** "The vigilance decrement may be accompanied by a reduction in perceptual sensitivity in the context of a wide variety of tasks and displays... the sensitivity decrement may be much more prevalent than previously believed" (See et al., 1995). This overturned the prior consensus that most vigilance decrements reflected criterion shifts rather than true sensitivity loss.

Code review is a *cognitive, successive discrimination task* (comparing current code against internalized standards, with symbolic stimuli), which based on See et al.'s taxonomy should show sensitivity decrements that increase with event rate (review speed).

### 6.3 Warm, Parasuraman & Matthews (2008)

Published in *Human Factors* (Vol. 50, pp. 433-441), this influential review consolidated evidence from four research areas:

1. **Task type studies:** Confirmed that successive and simultaneous vigilance tasks both deplete attentional resources
2. **Perceived mental workload:** Subjective reports consistently show that vigilance workload is high and increases with processing demands
3. **Neural measures:** Transcranial Doppler sonography (TCD) reveals that the vigilance decrement is paralleled by a decline in cerebral blood flow velocity (CBFV) in the middle cerebral arteries, providing direct physiological evidence for resource depletion
4. **Task-induced stress:** Vigilance tasks reduce task engagement and increase distress, with these changes rising with task difficulty

The central thesis: "Vigilance requires hard mental work and is stressful" (Warm et al., 2008). This directly challenged the "mindlessness" theory (Robertson et al., 1997; Manly et al., 1999), which held that vigilance decrements arise from underarousal and inattention in monotonous tasks.

The resource theory implication for code review: reviewing AI agent output is not a passive, low-effort task. It is cognitively demanding, resource-depleting, and actively stressful. Designing harnesses that treat review as "just glancing at the output" will produce predictable performance failures.

### 6.4 Vigilance Decline Curves: Quantitative Summary

| Source | Task | Time Period | Detection Decline |
|---|---|---|---|
| Mackworth (1948) | Clock Test | First 30 min | 10-15% absolute drop |
| Mackworth (1948) | Clock Test | Full 2 hours | Up to 35% absolute drop |
| See et al. (1995) | Meta-analysis (42 studies) | Varies | Effect size 0.5-1.0 (d-prime units) |
| Warm et al. (2008) | Resource depletion | Progressive | CBFV decline parallels performance |

An important qualifier: the vigilance decrement becomes significant within the first 15 minutes under high task-demand conditions (Warm et al., 2008), and research on the Continuous Temporal Expectancy Task (CTET) shows measurable decrements emerging within 3 minutes of continuous performance (Skinner & Giesbrecht, 2024).

Research on discrimination tasks has further identified that an event rate at or above 24 events per minute significantly reduces sensitivity (Parasuraman & Davies, 1977). For code review, "event rate" maps to the density of decision points per unit time (how many code constructs the reviewer must evaluate per minute).

---

## 7. Fatigue and Code Review: Empirical Evidence

### 7.1 The Cisco/SmartBear Study (Cohen, 2006)

The largest empirical study of code review, analyzing 2,500 reviews across 3.2 million lines of code at Cisco Systems:

- **Optimal review size:** fewer than 200 LOC at a time (not to exceed 400 LOC)
- **Optimal review rate:** below 300 LOC/hour (rates below 500 still acceptable; above 500 significantly degrades detection)
- **Review duration limit:** after approximately 60 minutes, reviewers stop finding additional defects
- **Expected yield at optimal parameters:** 70-90% of defects found

The 60-minute wall is strikingly consistent with Mackworth's finding that the vigilance decrement becomes robust after the first 30 minutes, with the Cisco reviewers showing a combined effect of vigilance decrement and accumulated decision fatigue.

### 7.2 Review Volume and Quality (Kononenko, Baysal et al.)

Baysal, Kononenko, Holmes, and colleagues investigated code review processes across large open-source projects (WebKit, Google Blink) and at Mozilla:

- Both technical factors (patch size) and nontechnical factors (author experience, reviewer workload) significantly impact review duration and outcome (Baysal et al., 2015)
- Reviewers with shorter review queues are more likely to reject a patch (higher quality threshold), suggesting that workload causes criterion shifts toward more lenient acceptance (Kononenko et al., 2016)
- Interestingly, 81% of surveyed developers disagreed that workload affects their review decisions, demonstrating poor metacognitive awareness of their own performance degradation

This discrepancy between self-perception and measured behavior is a classic finding in SDT research: observers are typically unaware of their criterion shifts.

### 7.3 Changeset Size Effects

Uchoa et al. (2021) found negative correlations ($r = -0.33$ to $-0.42$) between changeset size and comment density, with defect detection effectiveness declining faster than linearly with growing changeset size.

McIntosh, Kamei et al. found that low code review coverage and participation produce components with up to 2 additional post-release defects (low coverage) and up to 5 additional post-release defects (low participation) compared to well-reviewed components.

### 7.4 Code Review Effectiveness Benchmarks

| Method | Detection Rate | Source |
|---|---|---|
| Formal inspections (Fagan) | 60-65% | Jones (1996), 12,000+ projects |
| Informal inspections | <50% | Jones (1996) |
| Unit testing (alone) | 25% | Jones (1996) |
| Function testing (alone) | 35% | Jones (1996) |
| Integration testing (alone) | 45% | Jones (1996) |
| Formal review at 200 LOC/hr | ~60% of defects found | Jureczko et al. (2020) |
| Cisco study (optimal conditions) | 70-90% | Cohen (2006) |
| IBM Orbit (11 inspection levels) | ~99% | Cohen (2006), citing IBM data |

### 7.5 Nature of Review Findings

A critical nuance: up to 75% of code review comments address software evolvability and maintainability rather than functional bugs (Beller et al., 2014). This means the "defect detection rate" for functional bugs alone is substantially lower than the headline figures, which count all types of findings. In SDT terms, the signal space is broader than just "bugs," and reviewers may be optimizing their criterion for a different signal class than defect detection.

---

## 8. Radiology and Aviation Screening Analogues

### 8.1 Radiology: Signal Detection in Medical Imaging

Radiology has been the primary domain for SDT application outside the laboratory for over five decades (Swets & Pickett, 1982; Metz, 1978). Key findings with direct relevance to code review:

**Double Reading Protocols:**

European mammography screening guidelines mandate independent double reading by two radiologists. The rationale is quantified by the Gilbert et al. (2008) study of 28,204 women:

| Metric | Single + CAD | Double Reading |
|---|---|---|
| Cancer detection rate | 7.02/1000 | 7.06/1000 |
| Sensitivity | 87.2% | 87.7% |
| Specificity | 96.9% | 97.4% |
| Recall rate | 3.9% | 3.4% |

The differences in sensitivity and specificity were not statistically significant, but the recall rate difference was ($p = 0.001$). This demonstrates that a human-plus-machine approach (single reader + CAD) can achieve comparable detection to two independent human readers, at the cost of slightly higher false alarm rates.

**Computer-Aided Detection (CAD):**

CAD systems serve as a "second reader" by identifying areas of concern for the radiologist to re-examine. However, CAD generates approximately 400 false positive marks for each true positive mark (Gilbert et al., 2008). This extreme false alarm rate causes a "cry-wolf" effect where operators begin ignoring CAD alerts.

In automated baggage screening, false alarm rates of 15-20% combined with positive predictive values of 0.3 resulted in operators ignoring approximately half of true automation alarms on difficult targets (Sterchi et al., 2020). This is a direct warning for AI coding harnesses: if the harness or automated checks flag too many false positives, human reviewers will develop learned inattention to alerts.

### 8.2 The Prevalence Effect

One of the most critical findings for AI harness design is the **prevalence effect** (Wolfe et al., 2005). When targets are rare, observers search for shorter periods and have dramatically elevated miss rates:

| Target Prevalence | Miss Rate | Source |
|---|---|---|
| 50% | 7% | Wolfe et al. (2005) |
| 10% | 16% | Wolfe et al. (2005) |
| <1% | 30% | Wolfe et al. (2005) |
| Real-world radiology (~0.3%) | Up to 30% | Rich et al. (2008) |
| Real-world baggage screening | Up to 95% | Evans et al. (2017) |

The prevalence effect is explained in SDT terms as a criterion shift, not a sensitivity change: when targets are rare, observers shift their criterion to be more conservative (higher $\beta$, higher $c$), reducing false alarms but dramatically increasing misses.

**This is directly relevant to AI agent output:** If the AI agent produces high-quality output most of the time (low defect prevalence), human reviewers will naturally shift their criterion toward "accept everything," causing the defect escape rate to increase precisely when the reviewer's vigilance is most needed. This is a formal prediction from SDT, not mere speculation.

**Mitigation strategies from radiology and aviation:**

1. **Vigilance probes (Threat Image Projection, TIP):** Airport security uses TIP, which superimposes known threat images onto X-ray scans at random intervals. Screeners who miss these known threats receive immediate feedback. This maintains both d-prime (through practice) and criterion placement (through awareness that signals exist).

2. **Double reading:** Two independent reviewers examine the same material. Disagreements are adjudicated by a third reader or a panel. This reduces individual-reviewer criterion shift effects.

3. **Batch injection of known positives:** Inserting known-defective code samples into the review stream at controlled rates to maintain reviewer calibration and prevent the prevalence effect from degrading performance.

### 8.3 Aviation Baggage Screening: Quantitative SDT Data

Halbherr et al. (2013) and Wolfe et al. (2013) studied airport baggage screeners using SDT measures:

- Screeners showed a high miss rate for difficult targets: 51.6% hit rate for high-difficulty guns, 32.5% for high-difficulty knives
- Easy targets were found much more reliably: 75.3% for low-difficulty guns, 56.9% for low-difficulty knives
- Time-on-task within a 200-bag session reduced hit rates from 60.2% to 52.2% (approximately 8 percentage point decline)
- False alarm rates also declined over the session (from 18.8% to 13.5%), suggesting a conservative criterion shift rather than pure sensitivity loss
- Night work reduced accuracy ($A'$) from 0.808 to 0.785 ($p < 0.001$)
- Sleep deprivation reduced hit rate from 57.3% to 53.8% ($p = 0.008$)

The pattern of simultaneous decline in both hits and false alarms with time on task is the SDT signature of a criterion shift (more conservative responding), not a sensitivity decline. Accuracy ($A'$, a nonparametric sensitivity measure) remained essentially unchanged over the session.

---

## 9. Optimal Inspection Policies Under Capacity Constraints

### 9.1 The Fundamental Constraint: H << N

When human review capacity $H$ is much smaller than the total output volume $N$ from AI agents, we face a constrained optimization problem: how should we allocate the limited inspection budget to minimize total defect escape cost?

### 9.2 Deming's kp Rule

W. Edwards Deming derived a binary inspection criterion: given a process with known fraction defective $p$, cost of inspection per item $k_1$, and cost of a defect escaping to the field $k_2$, the optimal policy is:

- If $p < k_1 / k_2$: **inspect nothing** (the cost of finding defects exceeds the cost of letting them through)
- If $p > k_1 / k_2$: **inspect everything** (the cost of escaped defects exceeds the inspection cost)

This "all-or-nothing" result assumes a single homogeneous process and ignores sampling as a third option. When the process is monitored by control charts (SPC) and remains in statistical control, sampling provides the intermediate option that Deming's simplified analysis excludes.

### 9.3 Risk-Based Stratified Sampling

When items (code changes) vary in risk, the operations research literature strongly favors **stratified sampling** over uniform random sampling.

**Stratified Inspection Allocation:**

Partition the population of code changes into $K$ strata based on risk level (e.g., complexity, file criticality, agent confidence):

$$N = \sum_{k=1}^{K} N_k$$

For each stratum $k$ with estimated defect rate $p_k$ and defect cost $c_k$, the expected cost of an uninspected item is:

$$E[\text{escape cost}]_k = p_k \cdot c_k$$

The optimal allocation of $H$ inspection units across strata to minimize total expected escape cost, using Neyman allocation adapted for unequal costs:

$$h_k \propto N_k \cdot p_k \cdot c_k \cdot \sigma_k$$

where $\sigma_k$ is the standard deviation within stratum $k$. In practice, for Bernoulli (defect/no-defect) outcomes, $\sigma_k = \sqrt{p_k(1-p_k)}$.

**Simplified risk-weighted allocation:** Inspect stratum $k$ with probability:

$$\pi_k = \min\left(1, \frac{H \cdot w_k}{\sum_{j=1}^{K} w_j \cdot N_j}\right)$$

where $w_k = p_k \cdot c_k$ is the risk weight for stratum $k$.

### 9.4 Defect Escape Rate Under Constrained Inspection

If we inspect a fraction $f$ of items uniformly at random with a reviewer having sensitivity $d'$ (which maps to a hit rate $H_r$ and false alarm rate $F_r$), the overall defect escape rate is:

$$P(\text{escape}) = p \cdot [(1-f) + f \cdot (1 - H_r)]$$
$$= p \cdot [1 - f \cdot H_r]$$

The first term accounts for uninspected items (defects always escape), and the second for inspected items where the reviewer misses the defect.

For a reviewer with $d' = 2.0$ and unbiased criterion ($c = 0$), $H_r \approx 0.84$ and $F_r \approx 0.16$. If we can only inspect $f = 0.20$ (20%) of output:

$$P(\text{escape}) = p \cdot [1 - 0.20 \times 0.84] = p \cdot 0.832$$

Thus, inspecting 20% of output with a moderately good reviewer reduces the defect escape rate by only 16.8%. This highlights why uniform random sampling is a poor strategy when capacity is severely constrained.

**With risk-based stratification**, if we allocate all inspection capacity to the highest-risk 20% of code (which might contain 60% of defects):

$$P(\text{escape}) \approx 0.6p \cdot (1 - H_r) + 0.4p = 0.6p \times 0.16 + 0.4p = 0.096p + 0.4p = 0.496p$$

This reduces the defect escape rate by 50.4%, a threefold improvement over uniform sampling for the same inspection budget.

### 9.5 Dynamic Sampling Strategies

Research in semiconductor manufacturing (Purdy et al., 2014) demonstrates that dynamic sampling strategies, where the inspection rate adapts based on recent quality data and risk models, are superior to fixed-rate policies. Their linear programming model optimizes inspection capacity allocation across process tools to minimize "Wafers at Risk" while respecting capacity constraints.

The analogous approach for AI harness design:

1. **Maintain a running estimate** of each agent's defect rate (analogous to a process control chart)
2. **Apply switching rules** (MIL-STD-105E style) to adjust review intensity based on recent history
3. **Stratify by risk** (file criticality, change complexity, agent confidence scores)
4. **Allocate human attention** to the strata with the highest expected defect cost

### 9.6 Formal Result: The Value of Information

The expected value of perfect information (EVPI) for inspecting a single item with defect probability $p$ and escape cost $c$:

$$EVPI = p \cdot c$$

The expected value of sample information (EVSI) for an imperfect inspection with hit rate $H_r$:

$$EVSI = p \cdot c \cdot H_r$$

The inspection is worthwhile if:

$$EVSI > k_1 \implies p \cdot c \cdot H_r > k_1$$

This generalizes Deming's kp rule to incorporate imperfect inspection: the break-even defect rate is:

$$p^* = \frac{k_1}{c \cdot H_r}$$

Items with $p > p^*$ should be inspected; items with $p < p^*$ should not be, from a pure cost-optimization perspective.

---

## 10. Synthesis: An Integrated Framework for AI Harness Review

### 10.1 The Complete Model

Combining SDT, Dodge-Romig, MIL-STD-105E, and vigilance research yields a comprehensive framework for human review in AI coding harnesses:

**Layer 1: Signal Detection (per-item review quality)**
- Reviewer performance characterized by $(d', c)$ or equivalently $(H_r, F_r)$
- d-prime for code review estimated at 0.8-2.1 depending on conditions
- d-prime degrades with: review speed (above 300 LOC/hr), review duration (beyond 60 minutes), and review volume (beyond 200 LOC per session)
- Criterion shifts toward conservative (accept-everything) with: low defect prevalence, high workload, reviewer fatigue

**Layer 2: Sampling Plan (which items to inspect)**
- Dodge-Romig AOQL plans guarantee maximum outgoing defect rate
- MIL-STD-105E switching rules adapt inspection intensity to observed quality
- Risk-based stratification allocates scarce human attention to highest-risk items

**Layer 3: Vigilance Management (sustaining performance over time)**
- Schedule review sessions at 60 minutes maximum
- Keep individual review batches under 200 LOC
- Inject vigilance probes (known-defective samples) to maintain calibration
- Monitor reviewer performance metrics to detect criterion drift

### 10.2 Key Design Implications

1. **The prevalence trap:** As AI agents improve, defects become rarer, triggering the prevalence effect and degrading human detection. Paradoxically, better AI output leads to worse human review unless actively countered.

2. **The switching rule imperative:** Fixed-rate review is wasteful for good agents and insufficient for bad ones. Adaptive switching rules, formally derived from MIL-STD-105E, provide mathematically optimal adjustment.

3. **The cry-wolf problem:** Automated checks with high false alarm rates (like radiology CAD at 400:1) degrade rather than enhance human performance. AI-generated warnings must be calibrated for high positive predictive value.

4. **The stratification dividend:** Risk-based sampling with the same inspection budget achieves 3x better defect capture than uniform sampling (Section 9.4 analysis).

5. **The vigilance cost:** Human review is cognitively expensive (Warm et al., 2008), not free. Harness design must budget reviewer cognitive resources as carefully as compute resources.

---

## References

- Baysal, O., Kononenko, O., Holmes, R., & Godfrey, M. W. (2015). Investigating technical and non-technical factors influencing modern code review. *Empirical Software Engineering*, 21(3), 932-959.
- Beller, M., Bacchelli, A., Zaidman, A., & Juergens, E. (2014). Modern code reviews in open-source projects: Which problems do they fix? *Proceedings of the 11th Working Conference on Mining Software Repositories* (MSR 2014).
- Cohen, J. (2006). *Best Kept Secrets of Peer Code Review*. SmartBear Software. (Cisco case study)
- Dodge, H. F., & Romig, H. G. (1944/1959). *Sampling Inspection Tables: Single and Double Sampling* (2nd ed.). Wiley.
- Fagan, M. E. (1976). Design and code inspections to reduce errors in program development. *IBM Systems Journal*, 15(3), 182-211.
- Gilbert, F. J., et al. (2008). Single reading with computer-aided detection for screening mammography. *New England Journal of Medicine*, 359, 1675-1684.
- Green, D. M., & Swets, J. A. (1966). *Signal Detection Theory and Psychophysics*. Wiley.
- Halbherr, T., Schwaninger, A., Budgell, G. R., & Wales, A. (2013). Airport security screener competency: A cross-sectional and longitudinal analysis. *International Journal of Aviation Psychology*, 23(2), 113-129.
- Jones, C. (1996). *Applied Software Measurement: Assuring Productivity and Quality* (2nd ed.). McGraw-Hill.
- Jureczko, M., et al. (2020). Code review effectiveness: An empirical study on selected factors influence. *IET Software*, 14(7), 731-740.
- Kononenko, O., Baysal, O., Holmes, R., & Godfrey, M. W. (2016). Code review quality: How developers see it. *Proceedings of the 38th International Conference on Software Engineering* (ICSE 2016).
- Mackworth, N. H. (1948). The breakdown of vigilance during prolonged visual search. *Quarterly Journal of Experimental Psychology*, 1(1), 6-21.
- Macmillan, N. A., & Creelman, C. D. (2005). *Detection Theory: A User's Guide* (2nd ed.). Lawrence Erlbaum Associates.
- McIntosh, S., Kamei, Y., Adams, B., & Hassan, A. E. (2014). The impact of code review coverage and code review participation on software quality. *Proceedings of the 11th Working Conference on Mining Software Repositories* (MSR 2014).
- Metz, C. E. (1978). Basic principles of ROC analysis. *Seminars in Nuclear Medicine*, 8(4), 283-298.
- MIL-STD-105E (1989). *Sampling Procedures and Tables for Inspection by Attributes*. U.S. Department of Defense.
- Montgomery, D. C. (2009). *Introduction to Statistical Quality Control* (6th ed.). Wiley.
- Parasuraman, R., & Davies, D. R. (1977). A taxonomic analysis of vigilance performance. In R. R. Mackie (Ed.), *Vigilance: Theory, Operational Performance, and Physiological Correlates* (pp. 559-574). Plenum Press.
- Purdy, M., et al. (2014). Optimized allocation of defect inspection capacity with a dynamic sampling strategy. *Computers & Operations Research*, 53, 178-188.
- Romboski, L. D. (1969). *An investigation of quick switching systems*. Ph.D. dissertation, Rutgers University.
- See, J. E., Warm, J. S., Dember, W. N., & Howe, S. R. (1995). Meta-analysis of the sensitivity decrement in vigilance. *Psychological Bulletin*, 117(2), 230-249.
- Skinner, A. T., & Giesbrecht, B. (2024). Beyond detection rate: Understanding the vigilance decrement using signal detection theory. *Frontiers in Cognition*, 3, 1505046.
- Sterchi, Y., Hattenschwiler, N., Michel, S., & Schwaninger, A. (2020). Automation reliability, human-machine system performance, and operator compliance in airport security screening. *Applied Ergonomics*, 84, 103028.
- Swets, J. A., & Pickett, R. M. (1982). *Evaluation of Diagnostic Systems: Methods from Signal Detection Theory*. Academic Press.
- Uchoa, A., et al. (2021). Predicting design impactful changes in modern code review. *IEEE/ACM 43rd International Conference on Software Engineering* (ICSE 2021).
- Warm, J. S., Parasuraman, R., & Matthews, G. (2008). Vigilance requires hard mental work and is stressful. *Human Factors*, 50(3), 433-441.
- Wolfe, J. M., Horowitz, T. S., & Kenner, N. M. (2005). Rare items often missed in visual searches. *Nature*, 435, 439-440.
- Wolfe, J. M., Brunelli, D. N., Rubinstein, J., & Horowitz, T. S. (2013). Prevalence effects in newly trained airport checkpoint screeners. *Journal of Experimental Psychology: Applied*, 19(3), 223-232.
