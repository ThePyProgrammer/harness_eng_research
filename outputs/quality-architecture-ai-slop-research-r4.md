# R4: Software Defect Taxonomies and Their Relationship to AI Code Slop

## Research Question

How do established software defect classification systems (IEEE 1044, ODC, Beizer, CWE) relate to the emerging taxonomy of AI-generated code defects ("slop"), and what does this mapping reveal about detection feasibility, latent structure, and the formal treatment of superficially competent code?

---

## 1. IEEE 1044: Standard Classification for Software Anomalies

### Source and Structure

IEEE 1044-2009 (revision of IEEE 1044-1993) provides a uniform approach to classifying software anomalies regardless of when they originate or are encountered in the lifecycle. The standard defines three core entities: **Failure** (observable departure from expected behavior), **Defect** (imperfection in a work product), and **Fault** (a subtype of defect classified using the same attributes). The standard's purpose is to establish a common vocabulary and attribute set supporting defect causal analysis, project management, and process improvement.

### Classification Attributes

IEEE 1044 does not prescribe a fixed list of defect "types" the way ODC does. Instead, it defines a **multi-attribute classification scheme** where each anomaly is characterized along several orthogonal dimensions:

- **Activity** -- the lifecycle activity during which the anomaly was recognized (requirements, design, coding, testing, operations)
- **Type** -- the nature of the defect (logic, computation, interface, data handling, documentation, etc.)
- **Disposition** -- the resolution state (corrected, deferred, duplicate, not a defect, etc.)
- **Impact** -- severity categories ranging from "essential operations affected" to "no significant impact," with probability bands (>70%, 40-70%, <40%) for likelihood of occurrence
- **Investigation** -- results of causal analysis upon conclusion of failure investigation
- **Phase of origin** vs. **phase of detection** -- enabling defect escape analysis

### Relevance to AI Slop

IEEE 1044's multi-attribute approach is valuable precisely because AI slop defects cut across traditional single-axis classifications. A hallucinated import is simultaneously a "type: interface" defect, "activity: coding" in origin, but "phase of detection: build" -- and its *cause* (model confabulation) has no analog in the IEEE 1044 causal vocabulary, which assumes human cognitive processes (oversight, misunderstanding, miscommunication). The standard's disposition categories also assume human agency in resolution, while AI-generated defects may require automated remediation pipelines rather than individual developer fixes.

The deeper limitation: IEEE 1044 was designed for anomalies discovered through testing and field observation. AI slop's defining characteristic -- superficial competence -- means many slop types (boilerplate inflation, naming drift, redundant comments) never register as "anomalies" under IEEE 1044 because they do not cause failures. They degrade codebase health without triggering the failure-defect-fault chain that IEEE 1044 tracks.

**Detection feasibility**: IEEE 1044 is a *recording* framework, not a detection framework. It classifies what has already been found. It provides no mechanism for discovering the kinds of latent quality degradation that characterize AI slop.

Sources: [IEEE 1044-2009](https://standards.ieee.org/standard/1044-2009.html), [IEEE Xplore](https://ieeexplore.ieee.org/document/5399061/)

---

## 2. Orthogonal Defect Classification (ODC)

### Source and Structure

Developed by Ram Chillarege at IBM Research in the late 1980s and early 1990s, ODC transforms semantic information in the defect stream into process measurements. The core insight is that defect *types* correlate with development *phases*, enabling in-process diagnostics: if you see the wrong distribution of defect types at a given phase, your process has a problem.

### The Eight Defect Types

| Defect Type | Definition | Associated Phase |
|---|---|---|
| **Function** | Missing or incorrect capability; requires formal design change | High-level design |
| **Interface** | Interaction errors with other components via calls, macros, control blocks, parameter lists | Low-level design |
| **Checking** | Logic failures to validate data/values before use, loop conditions | Low-level design / code |
| **Assignment** | Defect in a few lines of code (initialization, data structure values) | Code |
| **Algorithm** | Efficiency or correctness problems fixable by re-implementing locally without design change | Low-level design |
| **Timing/Serialization** | Shared resource and real-time management issues | Low-level design |
| **Build/Package/Merge** | Library systems, change management, version control mistakes | Build tools |
| **Documentation** | Publication and maintenance document errors | Publications |

### ODC Triggers and Qualifiers

Beyond defect type, ODC captures **triggers** (the condition under which the defect was exposed, such as "coverage," "variation," "sequencing," "interaction," "stress") and **qualifiers** (missing, incorrect, extraneous). The trigger attribute is particularly useful for AI slop analysis because AI-generated defects have characteristic trigger profiles -- they tend to survive "coverage" triggers (the code runs) but fail under "variation" and "interaction" triggers (edge cases, integration with existing code).

### Phase-Defect Correlation as a Diagnostic

ODC's key analytical power is the phase-type correlation: a high proportion of "Function" defects found late in the cycle indicates that design-phase activities were inadequate. This diagnostic applies directly to AI-assisted development: if an AI coding agent produces a disproportionate number of "Assignment" and "Checking" defects (which the ISSRE 2025 study by Cotroneo et al. confirms), the process diagnosis is that the *coding* phase is producing defects that should not exist -- the agent is generating syntactically valid but semantically wrong assignments and validation logic.

### ODC Mapping to the 18 Slop Types

| Slop Type | ODC Defect Type | ODC Qualifier | Notes |
|---|---|---|---|
| Hallucinated imports | Interface | Incorrect | References nonexistent external components |
| Placeholder/stub code | Function | Missing | Capability declared but not implemented |
| Duplicate logic | Function | Extraneous | Redundant capability that already exists |
| Dead code | Assignment | Extraneous | Code that cannot execute |
| Lint suppressions | Checking | Missing | Validation bypassed rather than implemented |
| Cross-language contamination | Assignment | Incorrect | Wrong idiom for the target language |
| Outdated APIs | Interface | Incorrect | References deprecated external interfaces |
| Security vulns (functional-looking) | Checking | Missing | Missing validation of adversarial inputs |
| Happy-path error handling | Checking | Missing/Incorrect | Insufficient condition validation |
| Data model mismatches | Interface | Incorrect | Wrong assumptions about external data contracts |
| Over-engineering | Function | Extraneous | Unnecessary capability/abstraction |
| Architectural erosion | Function | Incorrect | Design intent violated |
| Silent scope expansion | Function | Extraneous | Unrequested functionality added |
| God functions | Algorithm | Incorrect | Could be decomposed without design change |
| Meaningless tests | Checking | Incorrect | Validation logic that cannot fail |
| Boilerplate inflation | Assignment | Extraneous | Excessive code for minimal function |
| Redundant comments | Documentation | Extraneous | Comments that add no information |
| Naming/convention drift | Assignment | Incorrect | Inconsistent with codebase conventions |

This mapping reveals that AI slop clusters heavily in three ODC types: **Function** (5 slop types), **Checking** (4 slop types), and **Assignment** (4 slop types). The **Interface** category captures 3 slop types -- all related to the AI's inability to accurately model external contracts. **Algorithm** and **Documentation** each capture 1 type. **Timing/Serialization** and **Build/Package/Merge** are notably absent -- AI agents rarely introduce concurrency bugs or build system errors, which are the defect types most tied to system-level understanding that agents currently lack the context to even attempt.

### AI-ODC: The Emerging Extension

A 2025 paper by researchers (arxiv 2508.17900, published in e-Informatica 2026) proposes **AI-ODC**, extending the original ODC framework with three new attributes -- **Data** (training data quality issues), **Learning** (model training/fine-tuning defects), and **Thinking** (inference-time reasoning errors) -- plus a "Catastrophic" severity level for AI-specific failure modes. Validated on 42 Keras defects, AI-ODC represents the first formal attempt to extend Chillarege's framework for AI systems. However, AI-ODC addresses defects *in* AI systems, not defects *produced by* AI code generators -- a distinction that matters for the slop problem.

**Detection feasibility**: ODC is a classification framework applied post-discovery. Its power for AI slop lies in *diagnostics* rather than detection: by classifying discovered slop into ODC types, teams can identify which development-phase activities need strengthening. The phase-type correlation predicts that AI coding agents should produce primarily Assignment, Checking, and Algorithm defects -- which is exactly what the empirical evidence shows.

Sources: [Chillarege, ODC Concept](https://www.chillarege.com/articles/odc-concept.html), [Wikipedia: ODC](https://en.wikipedia.org/wiki/Orthogonal_Defect_Classification), [ODC v5.2 Specification](https://s3.us.cloud-object-storage.appdomain.cloud/res-files/70-ODC-5-2.pdf), [AI-ODC (arxiv 2508.17900)](https://arxiv.org/abs/2508.17900), [CMU ODC Slides](https://www.cs.cmu.edu/afs/cs/academic/class/15674-s97/www/Class6/tsld021.htm)

---

## 3. Beizer's Software Testing Defect Taxonomy

### Source and Structure

Boris Beizer's taxonomy, presented in *Software Testing Techniques* (2nd ed., 1990), is one of the earliest systematic defect classification systems. It defines ten major categories in a hierarchical four-level numbering scheme (a four-digit number specifies each unique defect type):

| Code | Category | Approximate Frequency |
|---|---|---|
| 0xxx | Planning and requirements specification | ~8% |
| 1xxx | Requirements and features | ~8% |
| 2xxx | Functionality as implemented | ~16% |
| 3xxx | Structural bugs (control flow, processing) | ~25% |
| 4xxx | Data (definition, structure, use) | ~22% |
| 5xxx | Implementation (standards, documentation) | ~5% |
| 6xxx | Integration | ~9% |
| 7xxx | Real-time and operating system | ~2% |
| 8xxx | Test definition or execution bugs | ~4% |
| 9xxx | Other / unclassified | ~1% |

The frequency data derives from Beizer's aggregation of multiple industry sources. The dominant categories -- structural bugs (~25%) and data bugs (~22%) -- together account for nearly half of all defects. This distribution has been remarkably stable across studies, though exact percentages vary by domain and methodology.

### Beizer's Hierarchy Within Categories

Each major category subdivides into three additional levels. For example, structural bugs (3xxx) break down into:
- 31xx: Control flow errors (wrong path taken)
- 32xx: Processing errors (correct path, wrong computation)
- 33xx: Initialization errors
- 34xx: Scope and coupling errors

Data bugs (4xxx) include:
- 41xx: Type and definition errors
- 42xx: Structure and access errors
- 43xx: Data value errors
- 44xx: Data flow errors

### Mapping AI Slop to Beizer

Beizer's taxonomy reveals something the ODC mapping does not: AI slop is disproportionately concentrated in Beizer's *lower-frequency* categories. Human defects cluster in structural (25%) and data (22%) bugs, the categories where algorithmic complexity and state management create the most cognitive load. AI slop, by contrast, clusters in functionality-as-implemented (2xxx), implementation/standards (5xxx), and integration (6xxx) -- categories that represent *convention adherence* and *system awareness* rather than algorithmic reasoning.

This inversion is significant. It suggests that AI agents are relatively competent at the things humans struggle with most (complex control flow, data structure manipulation) but fail systematically at things humans handle through environmental awareness: knowing what already exists (integration), following established conventions (implementation/standards), and matching intended functionality to actual requirements (functionality as implemented).

Beizer's taxonomy also includes category 8xxx (test definition or execution bugs), which directly addresses the "meaningless tests" slop type. Beizer noted that ~4% of all bugs were in tests themselves -- a category that AI-generated code likely inflates substantially, given that AI agents generate test code with the same superficial competence that characterizes their production code.

**Detection feasibility**: Beizer's taxonomy was designed as a testing guide, not a detection mechanism. Its value for AI slop is conceptual: it shows where AI defects cluster relative to the historical distribution of human defects, revealing the characteristic *shape* of AI-generated code quality problems.

Sources: [Beizer, Software Testing Techniques, 2nd ed.](https://www.amazon.com/Software-Testing-Techniques-Boris-Beizer/dp/1850328803), [Flylib: Defect Taxonomies](https://flylib.com/books/en/2.156.1/defect_taxonomies.html), [Bug Taxonomy & Stats](https://www.scribd.com/document/162294880/Bug-Taxonomy-Stats-Bugtaxst-Bbeizer)

---

## 4. CWE: Common Weakness Enumeration

### Source and Structure

The CWE, maintained by MITRE Corporation, is a community-developed catalog of software and hardware weakness types. Unlike the other taxonomies discussed here, CWE is specifically focused on security-relevant weaknesses. It organizes over 900 entries into a directed acyclic graph with four abstraction levels:

- **Pillars** -- the highest-level groupings (e.g., "Improper Input Handling," "Improper Access Control")
- **Classes** -- broad categories of errors (e.g., "Improper Input Validation," CWE-20)
- **Bases** -- specific weaknesses (e.g., "SQL Injection," CWE-89)
- **Variants** -- language- or technology-specific manifestations

### CWE Top 25 (2025) and AI Slop

The 2025 CWE Top 25 Most Dangerous Software Weaknesses clusters into three macro-categories:

1. **Untrusted Input Handling** (11 CWEs, ~60% of total risk score) -- includes SQL injection, XSS, command injection, file uploads, deserialization
2. **Memory Management Errors** (6 CWEs, ~26% of total risk score) -- buffer overflows, out-of-bounds reads/writes, primarily in C/C++
3. **Access Control** (~7 entries) -- missing authentication, improper authorization, privilege escalation

The top three specific weaknesses: CWE-79 (XSS, score 56.92), CWE-787 (out-of-bounds write, score 45.20), CWE-89 (SQL injection, score 35.88).

### AI Slop Security Dimension

CWE maps directly to slop type #15 (security vulnerabilities that look functional). The CodeRabbit data showing 2.74x more XSS vulnerabilities in AI-generated code translates directly to CWE-79 frequency inflation. The characteristic AI security failure pattern is generating code that handles *functional* requirements correctly while omitting *security* requirements -- the happy-path completion bias manifesting in the security domain.

The CWE framework also illuminates *why* AI security defects are particularly dangerous: they tend to cluster in the "Untrusted Input Handling" macro-category, which accounts for 60% of the CWE Top 25 risk score. AI agents generate functional code that processes inputs correctly under normal conditions but fails to apply the defensive programming patterns (sanitization, validation, encoding) that prevent exploitation. This is the security-specific manifestation of the "superficial competence" property.

**Detection feasibility**: Unlike the other taxonomies, CWE has a direct mapping to automated tools. SAST tools (CodeQL, Semgrep, Snyk Code) detect CWE instances with varying accuracy. CWE-79 (XSS) and CWE-89 (SQL injection) have mature detection tooling with low false-positive rates. More complex weaknesses (CWE-306: Missing Authentication, CWE-862: Missing Authorization) require contextual understanding that static analysis alone cannot provide. For AI slop, the implication is that security-related slop is the most *mechanically detectable* of the critical slop types, because CWE already has an established tooling ecosystem.

Sources: [CWE - MITRE](https://cwe.mitre.org/), [2025 CWE Top 25](https://cwe.mitre.org/top25/archive/2025/2025_cwe_top25.html), [Invicti: CWE Top 25 Analysis](https://www.invicti.com/blog/web-security/2024-cwe-top-25-list-xss-sqli-buffer-overflows)

---

## 5. Mapping the 18 Slop Types to Classical Taxonomies

### Cross-Taxonomy Mapping Table

| # | Slop Type | Detectability | IEEE 1044 Type | ODC Type | Beizer Category | CWE Relevance |
|---|---|---|---|---|---|---|
| 1 | Hallucinated imports | Mechanical | Interface | Interface/Incorrect | 6xxx Integration | -- |
| 2 | Security vulns (functional) | Partial mechanical | Logic | Checking/Missing | 3xxx Structural | CWE-79, CWE-89, CWE-787 |
| 3 | Placeholder/stub code | Mechanical | Logic | Function/Missing | 2xxx Functionality | -- |
| 4 | Duplicate logic | Mechanical | Logic | Function/Extraneous | 6xxx Integration | -- |
| 5 | Happy-path error handling | LLM-judgment | Logic | Checking/Missing | 3xxx Structural | CWE-252, CWE-754 |
| 6 | Meaningless tests | No reliable detection | Logic | Checking/Incorrect | 8xxx Test bugs | -- |
| 7 | Data model mismatches | LLM-judgment | Data | Interface/Incorrect | 4xxx Data | -- |
| 8 | Over-engineering | LLM-judgment | -- | Function/Extraneous | 5xxx Implementation | -- |
| 9 | Outdated APIs | Mechanical | Interface | Interface/Incorrect | 6xxx Integration | CWE-477 |
| 10 | Architectural erosion | LLM-judgment | -- | Function/Incorrect | 5xxx Implementation | -- |
| 11 | Boilerplate inflation | No reliable detection | -- | Assignment/Extraneous | 5xxx Implementation | -- |
| 12 | Silent scope expansion | LLM-judgment | -- | Function/Extraneous | 2xxx Functionality | -- |
| 13 | Cross-language contamination | Mechanical | Computation | Assignment/Incorrect | 5xxx Implementation | -- |
| 14 | God functions | LLM-judgment | -- | Algorithm/Incorrect | 3xxx Structural | -- |
| 15 | Dead code | Mechanical | Logic | Assignment/Extraneous | 3xxx Structural | CWE-561 |
| 16 | Lint suppressions | Mechanical | -- | Checking/Missing | 5xxx Implementation | -- |
| 17 | Redundant comments | No reliable detection | Documentation | Documentation/Extraneous | 5xxx Implementation | -- |
| 18 | Naming/convention drift | No reliable detection | -- | Assignment/Incorrect | 5xxx Implementation | -- |

### Taxonomy Gaps Revealed by the Mapping

Several slop types map poorly to all four classical taxonomies:

1. **Over-engineering (#8)** -- No classical taxonomy has a category for "correct but unnecessary complexity." IEEE 1044 classifies anomalies that cause failures; over-engineering does not cause failures. ODC's "Extraneous" qualifier is the closest fit, but ODC assumes extraneous code was *added by mistake*, not generated as a systematic pattern. Beizer's 5xxx (Implementation/Standards) is a stretch. This gap exists because classical taxonomies assume code was written intentionally by someone who chose to write it; AI agents have no concept of "choosing" to over-engineer.

2. **Architectural erosion (#10)** -- Classical taxonomies classify individual defects, not trends. Architectural erosion is a *trajectory* -- each individual change may be defect-free by any taxonomy's standard, but the aggregate violates design intent. No classical taxonomy captures this because they were designed for defect-by-defect classification, not codebase-level health assessment.

3. **Silent scope expansion (#12)** -- This is a *process* defect (the agent did more than asked) that manifests as *code* that may individually be correct. IEEE 1044, ODC, and Beizer all assume the code was written to satisfy a requirement; scope expansion means the code satisfies a *non-requirement*, which is a category none of them were designed to handle.

4. **Boilerplate inflation (#11)** -- The concept of "correct but verbose" code has no home in any classical taxonomy. All four systems treat verbosity as a style issue, not a defect. The AI era forces reclassification: when verbosity is systematic and scales with AI generation volume, it becomes a measurable quality degradation vector.

These four gaps share a common root: classical taxonomies assume **intentional authorship**. Every defect is presumed to result from a human making a decision (correctly or incorrectly). AI slop includes defects that result from *no decision at all* -- the agent fills space with plausible-looking code because that is what language models do.

---

## 6. Factor Analysis and Latent Variable Approaches

### Established Factor-Analytic Work

Factor analysis in software defect research has primarily been applied to **defect prediction** rather than defect classification. The main line of work uses latent variables to model conditional dependencies among software metrics (code complexity, coupling, churn) that predict defect likelihood. A 2021 study in Neurocomputing proposed using latent variables to capture conditional mutual dependencies between software metrics, finding that explicit modeling of metric interdependencies improved defect prediction accuracy.

More recently, topic modeling approaches (Latent Dirichlet Allocation and BERTopic) have been applied to defect reports to discover latent categories. A 2025 Nature Scientific Reports paper used BERTopic for topic modeling-based defect prediction, finding that transformer-based embeddings produced more semantically coherent defect clusters than traditional LDA.

### Latent Structure in the 18 Slop Types

Examining the 18 slop types through a factor-analytic lens suggests three latent dimensions that cut across the surface-level categories:

**Factor 1: Context Blindness** -- The agent does not know what already exists. This latent variable explains duplicate logic (#4), naming drift (#18), architectural erosion (#10), and boilerplate inflation (#11). All four arise because the agent generates code in isolation from the codebase's existing patterns, structures, and conventions. The common cause is insufficient context about the existing system.

**Factor 2: Completion Bias** -- The agent optimizes for producing output that *looks complete* rather than output that *is correct*. This explains placeholder code (#3), happy-path error handling (#5), meaningless tests (#6), redundant comments (#17), and over-engineering (#8). All five are artifacts of a language model's trained objective to produce fluent, complete-looking text. The model would rather generate a plausible-looking test than admit it cannot verify the behavior.

**Factor 3: Training Distribution Leakage** -- The agent's training data contaminates its output in ways mismatched to the current context. This explains hallucinated imports (#1), cross-language contamination (#13), outdated APIs (#9), and security vulnerabilities that look functional (#2). All four arise from the model reproducing patterns from its training distribution that are incorrect for the specific situation.

These three factors are roughly orthogonal (a defect driven by context blindness is not necessarily driven by completion bias or training leakage), which suggests they represent genuinely different underlying mechanisms rather than surface-level symptom categories. If validated empirically, this factor structure would have practical implications: each factor suggests a different intervention strategy (better context engineering for Factor 1, structured output constraints for Factor 2, retrieval-augmented generation and tool use for Factor 3).

The remaining slop types -- silent scope expansion (#12), god functions (#14), dead code (#15), lint suppressions (#16), and data model mismatches (#7) -- likely load on multiple factors or represent interaction effects between them.

### Formal Treatment Gap

No published study has performed formal factor analysis or principal component analysis on AI-generated code defect data to discover latent dimensions. The three-factor structure proposed above is hypothesis-level synthesis, not empirical finding. The ISSRE 2025 study (Cotroneo et al.) provides the closest dataset for such analysis, having classified 500K+ code samples across ODC types, but does not report factor-analytic results. This represents a clear research opportunity.

---

## 7. Emerging AI-Specific Defect Taxonomies

### Published Research

Several research efforts are converging on AI-specific defect classification:

**1. LLM Hallucinations in Practical Code Generation (ACM, July 2025)** -- Establishes a hallucination taxonomy with three major categories: Task Requirement Conflicts (the code does not match what was asked), Factual Knowledge Conflicts (the code references nonexistent APIs/packages), and Project Context Conflicts (the code ignores existing codebase patterns). Eight subcategories further refine these three dimensions. This taxonomy maps directly to slop types #1 (hallucinated imports, a Factual Knowledge Conflict), #12 (scope expansion, a Task Requirement Conflict), and #4/#18 (duplicate logic and naming drift, Project Context Conflicts).

**2. Human-Written vs. AI-Generated Code: A Large-Scale Study (ISSRE 2025, Cotroneo et al.)** -- Analyzes 500K+ code samples across Python and Java, classifying defects via ODC. Key finding: AI-generated code shows elevated Assignment and Checking defects (consistent with the slop taxonomy's emphasis on initialization errors and validation gaps), while human code shows elevated Algorithm and Function defects (consistent with human struggles with complex logic). AI-generated code is "less structurally complex but more repetitive and prone to specific defect categories, such as variable assignment errors."

**3. AI-ODC: A Defect Classification Framework for AI-Based Software Systems (e-Informatica 2026)** -- Extends ODC with three new attributes (Data, Learning, Thinking) and a Catastrophic severity level. Validated on 42 Keras defects. Important distinction: AI-ODC classifies defects *in* AI systems (bugs in ML pipelines), not defects *produced by* AI code generators. The "Thinking" attribute (inference-time reasoning errors) is potentially applicable to LLM code generation, but the paper does not explore this application.

**4. Security and Quality in LLM-Generated Code (arxiv, Feb 2025)** -- Introduces a manually vetted dataset of 200 programming tasks classified into six quality categories, finding systematic quality gaps across multiple dimensions. Focuses on the security subset of AI code defects.

**5. AI-Generated Code Is Not Reproducible (Yet) (arxiv, Dec 2025)** -- Documents the "dependency gap" -- AI-generated code references packages, versions, and APIs that do not exist or are incompatible. Only 68.3% of AI-generated projects were reproducible without manual intervention. This directly characterizes slop type #1 (hallucinated imports) with empirical scale data.

### The Taxonomy Convergence Pattern

Across these papers, a consistent three-layer structure emerges that aligns with (but refines) the three-factor latent structure proposed in Section 6:

- **Specification-level defects**: The code does not match what was asked (scope expansion, missing requirements, gold-plating). Maps to ODC "Function" type.
- **Knowledge-level defects**: The code references things that do not exist or are wrong (hallucinated imports, outdated APIs, incorrect assumptions about data shapes). Maps to ODC "Interface" and "Assignment" types.
- **Convention-level defects**: The code works but violates the existing codebase's patterns, style, and architectural intent (naming drift, architectural erosion, over-engineering). Maps to ODC "Function" (extraneous) and "Assignment" (incorrect) types.

No single published taxonomy yet integrates all three layers into a unified framework specifically for LLM-generated code defects. The field is converging but has not consolidated.

---

## 8. Superficially Competent Code: Formal Treatment

### The Concept

"Superficially competent code" describes code that passes all automated quality gates (compilation, linting, type checking, test suites, CI pipelines) while systematically degrading codebase health metrics (maintainability, cohesion, coupling, conceptual integrity). The MINT Lab's definition of slop's three properties -- superficial competence, asymmetric effort, mass producibility -- is the closest formal articulation.

### Related Formal Concepts

**Technical debt** is the most established formal analog. Ward Cunningham's original metaphor (1992) and subsequent formalization by researchers (principal, interest, interest probability) provide a financial framework for reasoning about code that works now but costs more later. However, technical debt traditionally assumes *deliberate* trade-offs -- a human developer choosing speed over quality. AI slop introduces *accidental* technical debt at scale, with no deliberate trade-off involved.

**Code health** metrics (as distinguished from code correctness) attempt to capture the non-functional quality dimension. CodeScene's research on "code health" identifies modules that are "superficially simple yet complex to understand due to their inter-dependencies," which directly parallels the slop problem. SonarSource's "technical debt ratio" (remediation cost / total development cost) quantifies the gap between current state and ideal state, but depends on rule-based detection that misses the judgment-dependent slop types.

**Self-Admitted Technical Debt (SATD)** research (ACM TOSEM, 2025) examines debt that developers explicitly acknowledge in comments. AI-generated code inverts this: the agent does not admit its debt, and may even generate confident comments asserting correctness where none exists (slop type #17, redundant/overconfident comments).

**Fitness functions** (evolutionary architecture, Ford & Parsons) provide the most actionable formal treatment: define measurable properties that code must maintain, and enforce them as automated tests. The concept of architectural fitness functions directly addresses the "passes CI but degrades health" problem by expanding the definition of "CI" to include health metrics. This is the approach taken by the quality stack in the existing research (deep-research-5-quality.md), where layers of structural gates, deterministic analysis, and LLM judgment collectively approximate a fitness function for codebase health.

### The Formal Gap

There is no published formal model that specifically characterizes the class of defects that are:
1. Undetectable by existing automated quality gates
2. Individually within acceptable quality bounds
3. Collectively degrading along measurable health dimensions
4. Produced systematically rather than sporadically

This is the formal definition of the "superficially competent code" problem. The closest related formalisms are:

- **Asymptotic code decay models** (Lehman's Laws of Software Evolution, 1974-1996) predict that software complexity increases over time unless active maintenance counteracts it. AI code generation accelerates the complexity accumulation while reducing the refactoring that counteracts it (GitClear: refactoring fell from 25% to under 10% of changes).
- **Information-theoretic code quality** (Kolmogorov complexity as a proxy for "essential complexity" vs. "accidental complexity") provides a theoretical framework: superficially competent code has high accidental complexity relative to its essential complexity. The code is longer, more abstract, and more indirected than the minimum description of its function requires.
- **Signal detection theory** applied to code review: superficially competent code maximizes the *miss rate* in the signal-detection sense -- it minimizes the features that reviewers use to distinguish good code from bad code, reducing the signal-to-noise ratio below the detection threshold.

None of these have been formally combined into a unified model of superficially competent code. The opportunity exists for a formal treatment that integrates Lehman's decay dynamics, information-theoretic complexity measures, and signal-detection characteristics into a model of AI-induced codebase degradation.

---

## 9. Synthesis: What the Cross-Taxonomy Mapping Reveals

### Key Finding 1: Classical Taxonomies Assume Intentional Authorship

Every taxonomy examined here (IEEE 1044, ODC, Beizer, CWE) was designed for a world where code is written by humans making conscious decisions. The causal vocabulary (oversight, misunderstanding, miscommunication in IEEE 1044; the phase-defect correlation in ODC; the bug-source tracking in Beizer) presumes a decision-maker who *could have* done otherwise. AI slop introduces a fundamentally different causal mechanism: statistical pattern completion that produces plausible but suboptimal output as a baseline behavior, not as an exception.

### Key Finding 2: The Detection Frontier Follows the Taxonomy Boundary

The slop types that map cleanly to classical taxonomies (hallucinated imports to ODC Interface, dead code to ODC Assignment/Extraneous, security vulns to CWE entries) are precisely the types that are mechanically detectable. The slop types that map poorly (over-engineering, architectural erosion, boilerplate inflation, meaningless tests) are the types that require LLM judgment or have no reliable detection. This is not a coincidence: classical taxonomies were built around defects that could be *observed and measured*, which are the same defects that can be *automatically detected*. The slop types that resist classification resist detection for the same reason -- they require understanding intent, which is what distinguishes quality from correctness.

### Key Finding 3: The Three-Factor Structure Suggests Three Intervention Strategies

The latent factor analysis (Section 6) suggests that the 18 slop types derive from three independent mechanisms (context blindness, completion bias, training distribution leakage), each requiring a different intervention:

- **Context blindness** requires better context engineering: codebase indexing, reuse maps, convention files, search-before-create constraints
- **Completion bias** requires structural output constraints: diff budgets, file-creation gates, mandatory justification for new abstractions, test mutation analysis
- **Training distribution leakage** requires external knowledge integration: lockfile validation, deprecation databases, retrieval-augmented generation, type-checker enforcement

This three-factor intervention model is more actionable than a flat list of 18 slop types because it targets *causes* rather than *symptoms*.

### Key Finding 4: A New Taxonomy Category Is Needed

None of the classical taxonomies have a category for "correct but unnecessary." IEEE 1044 tracks failures. ODC tracks defects that require fixes. Beizer tracks bugs. CWE tracks security weaknesses. All four assume that the classified item is *wrong* in some identifiable way. A substantial fraction of AI slop (over-engineering, boilerplate inflation, redundant comments, silent scope expansion) is not wrong -- it is *wasteful*. It increases codebase size, complexity, and maintenance burden without introducing functional errors.

The classical taxonomy closest to capturing this is Beizer's 5xxx (Implementation/Standards), which includes violations of coding standards and conventions. But "standards violation" implies a standard that was articulated and then violated. Much of AI slop violates no articulated standard -- it violates *taste*, *judgment*, and *economy of expression*, qualities that have no formal representation in any existing defect taxonomy.

This suggests the need for a new top-level defect category, something like "Accretion" or "Inflation," that captures the class of individually-acceptable changes whose aggregate effect is codebase degradation. This category would be orthogonal to correctness (the code works), orthogonal to security (the code is safe), and orthogonal to conformance (the code follows the stated rules). It would measure the gap between *what was generated* and *the minimum sufficient implementation*, a concept related to Kolmogorov complexity but applied at the software engineering level rather than the information-theoretic level.

---

## Sources

### Primary Taxonomy Sources
- [IEEE 1044-2009: Standard Classification for Software Anomalies](https://standards.ieee.org/standard/1044-2009.html)
- [Chillarege, R. ODC: A Concept for In-Process Measurements (IEEE TSE, 1992)](https://www.chillarege.com/articles/odc-concept.html)
- [ODC v5.2 for Software Design and Code](https://s3.us.cloud-object-storage.appdomain.cloud/res-files/70-ODC-5-2.pdf)
- [Beizer, B. Software Testing Techniques, 2nd ed. (Van Nostrand Reinhold, 1990)](https://www.amazon.com/Software-Testing-Techniques-Boris-Beizer/dp/1850328803)
- [MITRE CWE: Common Weakness Enumeration](https://cwe.mitre.org/)
- [2025 CWE Top 25 Most Dangerous Software Weaknesses](https://cwe.mitre.org/top25/archive/2025/2025_cwe_top25.html)

### AI-Specific Defect Research
- [Cotroneo et al. Human-Written vs. AI-Generated Code (ISSRE 2025)](https://arxiv.org/abs/2508.21634)
- [AI-ODC: A Defect Classification Framework for AI-Based Software Systems (e-Informatica 2026)](https://arxiv.org/abs/2508.17900)
- [LLM Hallucinations in Practical Code Generation (ACM, July 2025)](https://dl.acm.org/doi/pdf/10.1145/3728894)
- [Security and Quality in LLM-Generated Code (arxiv, Feb 2025)](https://www.arxiv.org/pdf/2502.01853)
- [AI-Generated Code Is Not Reproducible (Yet) (arxiv, Dec 2025)](https://arxiv.org/html/2512.22387v3)

### Supporting References
- [Wikipedia: Orthogonal Defect Classification](https://en.wikipedia.org/wiki/Orthogonal_Defect_Classification)
- [Flylib: Defect Taxonomies](https://flylib.com/books/en/2.156.1/defect_taxonomies.html)
- [Beizer Bug Taxonomy & Stats](https://www.scribd.com/document/162294880/Bug-Taxonomy-Stats-Bugtaxst-Bbeizer)
- [Invicti: CWE Top 25 Analysis](https://www.invicti.com/blog/web-security/2024-cwe-top-25-list-xss-sqli-buffer-overflows)
- [Diva Portal: Developing a Simplified and Consistent Defect Taxonomy (2021)](https://www.diva-portal.org/smash/get/diva2:1617058/FULLTEXT01.pdf)
- [BERTopic for Defect Prediction (Nature Scientific Reports, 2025)](https://www.nature.com/articles/s41598-025-11458-0)
- [MINT Lab: AI Slop Definitions and Normative Status](https://mintresearch.org/reports/ai-slop/)
- [CodeRabbit: State of AI vs Human Code Generation](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- [GitClear: AI Copilot Code Quality 2025](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
