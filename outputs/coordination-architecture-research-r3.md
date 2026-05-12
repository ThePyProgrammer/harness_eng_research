# Merge Conflict Theory and Detection for Multi-Agent Software Engineering Coordination

**Research Round 3: Coordination Architecture**
**Date: 2026-04-03**

---

## 1. Merge Conflict Taxonomies

The software engineering literature recognizes several distinct layers of merge conflict, each requiring different detection and resolution strategies.

### 1.1 Textual Conflicts (Line-Level Overlap)

The most basic conflict type: two branches modify the same lines of the same file. Standard three-way merge (as in `git merge`) operates purely on textual diff hunks. When hunks overlap, the merge tool cannot determine which version to keep and reports a conflict. Textual merge is language-agnostic and fast but suffers from high false-positive rates; reordering methods in a class, for instance, triggers a textual conflict even when the changes are semantically independent.

**Key reference:** Mens (2002), "A State-of-the-Art Survey on Software Merging," IEEE TSE 28(5), pp. 449-462.

### 1.2 Structural Conflicts (AST-Level)

Structural conflicts arise when changes restructure code in ways that textual diff cannot represent. For example, one developer moves a method to a different class while another modifies its body. Semistructured merge tools like FSTMerge (Apel et al., 2011) parse code into ASTs and merge at the node level, which reduces false positives for reorderable elements (method definitions, import statements). Accioly, Borba, and Cavalcanti (2018) studied 70,047 merges from 123 GitHub Java projects and identified 9 structural conflict patterns, expressed in terms of the kinds of changes to involved components (e.g., EditSameMC, SameSignatureMC).

**Key reference:** Accioly, P., Borba, P., and Cavalcanti, G. (2018), "Understanding semi-structured merge conflict characteristics in open-source Java projects," Empirical Software Engineering 23(4), pp. 2236-2262. DOI: 10.1007/s10664-017-9586-1.

### 1.3 Dependency Conflicts (Package/Import)

These occur when one branch adds a dependency that another branch's changes are incompatible with, or when import statements conflict. Build-level conflict detection (Kn et al., ASE 2022) uses static analysis on merged code to detect compilation failures that textual merge misses. Brun et al. (2011) specifically measured build conflicts in their Crystal study and found rates of 1% to 10% across projects.

### 1.4 API Conflicts (Signature Changes)

One branch changes a method signature while another branch adds calls to the old signature. These are a subclass of dependency conflicts but merit separate treatment because they are among the most common causes of post-merge build failures. IntelliMerge (Shen et al., 2019) specifically targets refactoring-related API conflicts using graph-based matching.

### 1.5 Semantic Conflicts (Behavioral Incompatibility)

The most insidious type: changes merge cleanly at the textual and structural level but produce incorrect behavior. Martin Fowler's definition: "a situation where changes can be safely merged on a textual level but cause the program to behave differently." Sousa, Dillig, and Lahiri (2018) formalized semantic conflict-freedom and built SafeMerge, a tool that uses compositional verification combining lightweight dependence analysis with precise relational reasoning. Evaluated on 52 real-world merge scenarios from GitHub, SafeMerge verified correctness in 75% of benchmarks and identified 11 real violations that textual merge tools missed entirely.

**Key reference:** Sousa, M., Dillig, I., and Lahiri, S.K. (2018), "Verifying Semantic Conflict-Freedom in Three-Way Program Merges," OOPSLA 2018, Article 165. arXiv: 1802.06551.

Newer work by Cavalcanti et al. (2024, Automated Software Engineering) compares static analyses for improved semantic conflict detection, finding that Program Dependence Graph (PDG) analysis on the merged version (annotated with per-developer change metadata) can detect data-flow and control-flow interference between changes made by different developers.

**Connection to multi-agent coordination:** In a multi-agent code generation setting, semantic conflicts are the primary risk because agents operating on separate files can introduce behavioral incompatibilities that no textual or structural merge tool will catch. This motivates the need for lightweight semantic checks as part of the coordination layer.

---

## 2. ConGra: Benchmarking Automatic Conflict Resolution (Zhu et al., 2024)

**Full citation:** Zhu, Y., et al. (2024), "CONGRA: Benchmarking Automatic Conflict Resolution," arXiv:2409.14121.

### 2.1 Methodology

ConGra introduces a conflict-graded benchmarking scheme that classifies conflicts based on code operations extracted via syntax tree analysis. Conflicts are categorized into seven types derived from three primary categories:

1. **Text (T):** At least one side contains only comment changes (CMT).
2. **Functional (F):** At least one side contains function body definitions (FBD).
3. **Syntax (S):** Differences in type definitions, function prototypes, and variable declarations.

These combine into seven permutations: T-only, F-only, S-only, F+T, S+T, F+S, and F+S+T.

### 2.2 Dataset

- **44,948 conflict scenarios** from 34 real-world open-source projects
- **23,334 conflict files** across 34 repositories
- Languages: 14 C/C++ projects, 11 Java projects, 9 Python projects
- Sources include Linux Kernel, Android, ReactOS, MySQL, JDK, TensorFlow, PyTorch, and Django

### 2.3 Quantitative Results

Selected results (Accuracy for Python / Java / C / C++):

| Model | Python | Java | C | C++ |
|-------|--------|------|---|-----|
| Llama3-8B (general) | 75.82% | 82.93% | 72.45% | 78.13% |
| DeepSeek-V2 (general) | 75.07% | 84.38% | 54.42% | 70.86% |
| GLM-3-turbo (general, 128K) | 57.05% | 62.52% | 58.86% | 64.10% |
| CodeLlama-7B (code-specialized) | 50.68% | 73.61% | 59.09% | 64.28% |
| CodeLlama-34B (code-specialized) | 61.47% | 70.82% | 67.75% | 69.83% |
| DeepSeek-Coder (code-specialized) | 56.49% | 74.52% | 62.36% | 62.33% |

### 2.4 Two Counterintuitive Findings

**Finding 1: General-purpose LLMs outperform code-specialized LLMs.** Llama3-8B and DeepSeek-V2 surpass all code-specialized LLMs in precision across all four languages. The authors attribute this to general models being trained on broader corpora that include merge-related content (issue discussions, PR descriptions, commit messages) providing richer context for conflict resolution.

**Finding 2: Simpler conflicts are harder for LLMs.** Models perform paradoxically worse on text-only (T) or single-category conflicts than on the most complex combined conflicts (F+S+T). The explanation: simple conflicts provide insufficient contextual guidance information, while complex conflicts contain more structural cues that LLMs can leverage.

### 2.5 Limitations

- Evaluation is limited to exact-match accuracy against ground-truth resolutions; functionally equivalent but textually different resolutions are counted as failures.
- The grading scheme is based on syntactic categories and does not capture semantic difficulty.
- Context window limitations mean very large conflicts may be truncated.

**Connection to multi-agent coordination:** ConGra's finding that general-purpose LLMs outperform code-specialized ones suggests that the coordination agent resolving inter-agent conflicts should use a general model with broad training, not necessarily a code-tuned variant. The paradox about simple conflicts being harder implies that agents need richer context injection even for apparently trivial merges.

---

## 3. Probabilistic Models of Merge Conflict Frequency

### 3.1 Theoretical Framework

Given parallel diffs Delta_1, ..., Delta_k applied concurrently, the probability of at least one conflict can be modeled as:

```
P(conflict) = 1 - Product_{l < l'} P(compatible(Delta_l, Delta_l'))
```

Each pairwise compatibility probability P(compatible(Delta_l, Delta_l')) depends on:
- **File overlap:** Whether the diffs touch the same files
- **Hunk proximity:** Whether changed regions are within merge-distance of each other
- **Dependency coupling:** Whether changed components have data/control flow dependencies

### 3.2 Calibration Data from Large-Scale Studies

**Brun et al. (2011)** studied 9 open-source systems totaling 3.4 million lines of code with 550,000 development versions. They found that 17% of merge operations required human assistance for textual conflicts, with build conflict rates of 1-10% and test conflict rates adding further failures on top of that.

**Kasi and Sarma (2013)** reported merge conflict rates of 7.6% to 19.3% across projects, with build conflict rates of 2% to 15%.

**Ghiotto et al. (2018)** analyzed 2,731 open-source Java projects on GitHub and found that 75% of conflicting merges involved only 1-2 conflicting chunks, while resolution was frequently trivial: 50% of chunks were resolved by choosing version 1, and 25% by choosing version 2. Only the remaining 25% required genuine integration.

**Prediction models:** Owhadi-Kareshk et al. (2019) studied 744 repositories across 7 programming languages and built predictive models using features including: number of references to other files, number of references to the file involved in the merge, number of non-core contributor authors, and total number of authors involved. They found that both social factors (developer roles, contributor types) and technical factors (file size, code churn) significantly predict conflict likelihood.

### 3.3 Google Monorepo Context

Google's monorepo (as of 2015) contained 2 billion lines of code with 40,000 commits per day by over 10,000 engineers. Their trunk-based development model minimizes long-lived branches, which significantly reduces merge conflicts compared to branch-heavy workflows. Specific conflict rate data has not been published, but the architectural choice of trunk-based development itself constitutes empirical evidence that minimizing branch divergence time is the most effective conflict reduction strategy.

**Key references:**
- Brun, Y., Holmes, R., Ernst, M.D., and Notkin, D. (2011), "Proactive Detection of Collaboration Conflicts," ESEC/FSE 2011, pp. 168-178.
- Kasi, B.K. and Sarma, A. (2013), "Cassandra: Proactive conflict minimization through optimized task scheduling," ICSE 2013.
- Ghiotto, G., Murta, L., Barber, M., and van der Hoek, A. (2018), "On the Nature of Merge Conflicts: A Study of 2,731 Open Source Java Projects Hosted by GitHub," IEEE TSE.

**Connection to multi-agent coordination:** The pairwise compatibility model maps directly to multi-agent task assignment. If k agents produce k diffs, the probability of conflict grows roughly as O(k^2) in the number of agent pairs. The empirical finding that 75% of conflicts are trivial (resolvable by choosing one version) suggests that a lightweight auto-resolution layer could handle most inter-agent conflicts, reserving human review for the 25% requiring genuine integration.

---

## 4. AST-Level and Program Analysis Approaches

### 4.1 GumTree (Falleri et al., 2014)

GumTree computes fine-grained edit scripts between two ASTs, supporting four operation types: insert, delete, move, and update. The algorithm operates in two phases: (1) top-down matching of isomorphic subtrees as anchor mappings, then (2) bottom-up matching of remaining unmatched nodes. Performance is practical: mean running times of 20ms on Jenkins and 74ms on JQuery, with only marginal overhead beyond parsing.

Compared to textual diff (which only computes additions and deletions at line granularity), GumTree can detect moved code blocks and variable renames as atomic operations rather than delete-plus-insert pairs. This is critical for reducing false positives in merge conflict detection.

**Key reference:** Falleri, J.-R., Morandat, F., Blanc, X., Martinez, M., and Monperrus, M. (2014), "Fine-grained and Accurate Source Code Differencing," ASE 2014. DOI: 10.1145/2642937.2642982.

### 4.2 Program Dependence Graph (PDG) Analysis

PDG-based approaches construct data-flow and control-flow dependency graphs for the merged program version, annotated with metadata indicating which developer modified each instruction. When a data or control flow path connects an instruction changed by developer A to one changed by developer B, the tool reports potential interference.

Cavalcanti et al. (2024) compared multiple static analyses for semantic conflict detection and found that PDG analysis on the annotated merge version achieves better precision than simpler approaches, while avoiding the heavyweight construction of System Dependence Graphs (SDGs) required by earlier techniques.

### 4.3 Structured vs. Textual: Empirical Comparison

JDime (Apel et al., 2012) demonstrated a 39% reduction in reported merge conflicts when using structured (AST-based) merge compared to unstructured (textual) merge for Java programs. However, structured merge has higher computational cost and language-specific implementation requirements.

**Connection to multi-agent coordination:** AST-level diffing is directly applicable to multi-agent merge. If each agent's output is parsed into an AST, GumTree-style matching can identify semantically equivalent but textually different changes (e.g., two agents both adding the same import statement in different positions). The 20-74ms runtime makes it feasible as an online check during agent coordination.

---

## 5. Operational Transformation and CRDTs

### 5.1 Operational Transformation (OT)

OT treats editing as a sequence of operations that must be transformed relative to concurrent operations. If user A inserts at position 5 while user B deletes positions 2-4, A's operation is transformed to "insert at position 3." OT requires a central authority to serialize operations, which makes it unsuitable for peer-to-peer architectures but well-suited for centralized coordination (as in Google Docs).

### 5.2 CRDTs (Conflict-Free Replicated Data Types)

CRDTs embed sufficient metadata in the data structure itself to guarantee automatic convergence across all replicas without coordination. For text editing, each character is assigned a unique ID that determines its position relative to neighbors, enabling concurrent inserts without conflicts.

**Practical implementations:**
- **Zed editor** uses CRDTs for real-time multiplayer code editing, syncing cursors, selections, and edits across participants.
- **Yjs** provides a modular CRDT framework for web applications, syncing changes in milliseconds even offline.
- **Automerge** implements CRDTs with a JSON data model in Rust with WebAssembly bindings.

### 5.3 Limitations for Programming Languages

CRDTs guarantee convergence but not correctness. Two agents concurrently adding conflicting function signatures will converge to a document containing both signatures, which is syntactically invalid. Specific limitations include:

1. **Semantic validity:** CRDTs preserve all concurrent edits, but code requires mutual consistency (a function call must match its definition). CRDTs have no mechanism to enforce cross-edit invariants.
2. **Tree structure anomalies:** Generic tree CRDTs can produce anomalous results for concurrent structural edits. Peritext (Ink & Switch, 2021) demonstrated that even rich-text formatting requires specialized CRDTs beyond plain-text solutions.
3. **Memory overhead:** CRDTs for text editing only grow in size (tombstones for deleted characters); Yjs implements optimizations but the fundamental overhead remains.
4. **Granularity mismatch:** Character-level CRDTs are too fine-grained for code, where the meaningful unit of change is a statement, function, or file. No production CRDT operates at AST-node granularity for general programming languages.

**Connection to multi-agent coordination:** CRDTs are compelling for real-time pair-programming scenarios (as Zed demonstrates) but are a poor fit for the multi-agent code generation problem, where agents produce complete file-level changes asynchronously. The lock-then-merge model (with conflict detection and resolution) is more appropriate when agents work on separate branches and submit completed work for integration. However, a CRDT-inspired approach could work at a higher abstraction level: treating "task completion" as the unit of replication rather than individual characters.

---

## 6. Empirical Data on Merge Conflict Rates

### 6.1 Key Studies and Findings

| Study | Dataset | Textual Conflict Rate | Key Finding |
|-------|---------|----------------------|-------------|
| Brun et al. (2011) | 9 projects, 3.4M LOC, 550K versions | 17% of merges | Build conflicts: 1-10% additional |
| Kasi & Sarma (2013) | Multiple projects | 7.6-19.3% | Substantial variation across projects |
| Ghiotto et al. (2018) | 2,731 Java projects on GitHub | ~20% of merges | 75% resolved by choosing one version |
| Accioly et al. (2018) | 123 Java projects, 70,047 merges | Varies | 9 structural conflict patterns identified |
| Owhadi-Kareshk et al. (2019) | 744 repos, 7 languages | Varies | Largest multi-language prediction study |

### 6.2 Predictive Factors

The literature identifies these factors as statistically significant predictors of merge conflict (p < 0.05):

- **Number of file cross-references:** Files with many incoming and outgoing references have higher conflict rates
- **Number of authors:** The "too many cooks" effect; more contributors to a file increases conflict probability
- **Non-core contributor ratio:** Changes from peripheral contributors conflict more often
- **Change spread:** The number of program elements affected by a change
- **Branch lifetime:** Longer-lived branches accumulate more divergence and more conflicts
- **File coupling:** Files frequently changed together have correlated conflict patterns

### 6.3 Bug Correlation

The empirical evidence on the relationship between merge conflicts and software quality is striking. Code associated with merge conflicts is 2x more likely to contain bugs. When merge conflicts require manual intervention, the associated code is 26x more likely to have a bug. In 75.23% of merge conflict cases, a developer needed to reflect on program logic to resolve the conflict.

**Connection to multi-agent coordination:** The 26x bug multiplier for manually-resolved conflicts is perhaps the most important finding for multi-agent systems. If agents generate conflicts that require human resolution, the resulting code is dramatically more likely to be buggy. This strongly motivates architectural approaches that prevent conflicts (task partitioning, file ownership) over approaches that detect and resolve them after the fact.

---

## 7. Semantic Merge Tools

### 7.1 JDime (Apel et al., 2012)

JDime is a structured merge tool for Java that auto-tunes between unstructured and structured merge depending on conflict presence. When no conflicts exist, it uses fast textual merge; when conflicts arise, it switches to AST-level merging.

- **Conflict reduction:** 39% fewer reported conflicts compared to textual merge
- **Approach:** Three-way AST merge with auto-tuning
- **Language support:** Java only
- **Computational cost:** Higher than textual merge but practical for interactive use

**Key reference:** Apel, S., Liebig, J., Brandl, B., Lengauer, C., and Kastner, C. (2012), "Semistructured merge: rethinking merge in revision control systems," ESEC/FSE 2011. Also: "Structured merge with auto-tuning: Balancing precision and performance," ASE 2012.

### 7.2 IntelliMerge (Shen et al., 2019)

IntelliMerge is a graph-based, refactoring-aware merging algorithm that builds program element graphs to detect method renames, moves, and signature changes as refactoring operations rather than conflicting edits.

- **Conflict reduction:** 58.90% fewer conflicts than GitMerge; 11.84% fewer than jFSTMerge
- **Precision:** 88.48% (auto-merged results that are correct)
- **Recall:** 90.22% (correct merges that are successfully auto-merged)
- **Language support:** Java
- **Key innovation:** Graph-based matching detects refactoring operations that confuse textual and basic structural merge tools

**Key reference:** Shen, B., Zhang, W., Zhao, H., Liang, G., Jin, Z., and Wang, Q. (2019), "IntelliMerge: a refactoring-aware software merging technique," OOPSLA 2019. DOI: 10.1145/3360596.

### 7.3 SemanticMerge (Semantic Designs)

SemanticMerge is a commercial tool that parses code into a semantic model and performs merge at the level of program elements (classes, methods, properties) rather than text lines. It supports multiple languages including C#, Java, C, C++, and others through language-specific parsers.

- **Approach:** Full semantic parsing with language-specific analyzers
- **Key advantage:** Can automatically resolve moves, renames, and reorderings that cause spurious textual conflicts
- **Limitation:** Requires language-specific parser support; commercial licensing
- **Performance data:** Limited published academic evaluation compared to JDime and IntelliMerge

### 7.4 LLM-Based Approaches (Zhang et al., 2022)

Microsoft Research explored using pre-trained language models to resolve both textual and semantic merge conflicts (ISSTA 2022). Their approach treats conflict resolution as a sequence-to-sequence translation task. Results showed promise for textual conflicts but limited ability to resolve semantic conflicts without program analysis support.

**Connection to multi-agent coordination:** IntelliMerge's 88.48% precision and 90.22% recall represent the current best automated merge performance. For a multi-agent coordination system, this suggests that approximately 10% of automated merges will either fail (requiring manual intervention) or produce incorrect results. The coordination layer must therefore include verification stages after automated merge, not just conflict detection. The ConGra results further suggest that using a general-purpose LLM as a fallback resolver (when structured tools fail) is a viable strategy.

---

## 8. Synthesis: Implications for Multi-Agent Code Generation

### 8.1 The Conflict Landscape for Multi-Agent Systems

Multi-agent code generation amplifies every category of merge conflict:

- **Textual conflicts** are frequent because agents operating on separate tasks often need to modify shared files (configuration, routing tables, component registries)
- **Structural conflicts** arise when agents independently refactor overlapping code
- **Semantic conflicts** are the dominant risk, because agents lack awareness of each other's behavioral changes

### 8.2 Recommended Architecture

Based on the literature, a multi-agent coordination layer should implement a tiered detection and resolution pipeline:

**Tier 1: Prevention (highest priority).** Assign file ownership to agents, partition tasks to minimize overlap, and use short-lived branches (trunk-based development principles). The empirical data shows that branch lifetime is the strongest predictor of conflict frequency.

**Tier 2: Structural detection.** Use GumTree-style AST diffing (20-74ms overhead) to detect structural conflicts before merge. This catches 39% more true conflicts than textual merge alone.

**Tier 3: Automated resolution.** Apply IntelliMerge-style graph matching for refactoring-aware merge (88.48% precision). For remaining conflicts, use a general-purpose LLM (per ConGra's finding that general LLMs outperform code-specialized ones at conflict resolution).

**Tier 4: Semantic verification.** Run lightweight PDG-based analysis on the merged result to detect data-flow and control-flow interference. SafeMerge demonstrated 75% verification success on real merges.

**Tier 5: Human escalation.** Reserve for the approximately 10-15% of conflicts that automated tools cannot resolve, recognizing that manually-resolved conflicts carry a 26x higher bug rate and require additional testing.

### 8.3 Open Problems

1. **Calibrating P(conflict) for agent-generated code:** No existing study measures conflict rates for AI-generated parallel changes. Agent-generated code may have different statistical properties than human-authored code (more formulaic, potentially more overlap in boilerplate).

2. **Semantic conflict detection at scale:** SafeMerge works on individual merge scenarios but has not been evaluated on continuous integration pipelines with hundreds of concurrent changes.

3. **CRDT-inspired coordination:** Could a higher-level CRDT (operating on task-level or API-contract-level abstractions rather than character-level text) provide the convergence guarantees of CRDTs without the semantic invalidity problems?

4. **Feedback loops:** ConGra's finding that simple conflicts are harder for LLMs suggests that conflict difficulty is not monotonic. The coordination layer needs adaptive strategies that inject more context for apparently simple merges.

---

## Sources

- Accioly, P., Borba, P., and Cavalcanti, G. (2018). [Understanding semi-structured merge conflict characteristics in open-source Java projects](https://link.springer.com/article/10.1007/s10664-017-9586-1). Empirical Software Engineering 23(4).
- Apel, S., Liebig, J., Brandl, B., Lengauer, C., and Kastner, C. (2012). [Structured merge with auto-tuning: Balancing precision and performance](https://www.se.cs.uni-saarland.de/projects/jdime/). ASE 2012.
- Brun, Y., Holmes, R., Ernst, M.D., and Notkin, D. (2011). [Proactive Detection of Collaboration Conflicts](https://cs.uwaterloo.ca/~rtholmes/papers/fse_2011_brun.pdf). ESEC/FSE 2011, pp. 168-178.
- Cavalcanti, G., et al. (2024). [Comparing static analyses for improved semantic conflict detection](https://link.springer.com/article/10.1007/s10515-025-00580-y). Automated Software Engineering.
- Falleri, J.-R., Morandat, F., Blanc, X., Martinez, M., and Monperrus, M. (2014). [Fine-grained and Accurate Source Code Differencing](https://hal.science/hal-01054552/document). ASE 2014.
- Ghiotto, G., Murta, L., Barber, M., and van der Hoek, A. (2018). [On the Nature of Merge Conflicts: A Study of 2,731 Open Source Java Projects](https://leomurta.github.io/papers/ghiotto2018.pdf). IEEE TSE.
- Owhadi-Kareshk, M., et al. (2019). [Predicting Merge Conflicts in Collaborative Software Development](https://arxiv.org/pdf/1907.06274). arXiv:1907.06274.
- Shen, B., Zhang, W., Zhao, H., Liang, G., Jin, Z., and Wang, Q. (2019). [IntelliMerge: a refactoring-aware software merging technique](https://dl.acm.org/doi/10.1145/3360596). OOPSLA 2019.
- Sousa, M., Dillig, I., and Lahiri, S.K. (2018). [Verifying Semantic Conflict-Freedom in Three-Way Program Merges](https://arxiv.org/abs/1802.06551). OOPSLA 2018.
- Zhang, W., et al. (2022). [Using Pre-trained Language Models to Resolve Textual and Semantic Merge Conflicts](https://dl.acm.org/doi/abs/10.1145/3533767.3534396). ISSTA 2022.
- Zhu, Y., et al. (2024). [CONGRA: Benchmarking Automatic Conflict Resolution](https://arxiv.org/abs/2409.14121). arXiv:2409.14121.
- Zed Blog. [How CRDTs make multiplayer text editing part of Zed's DNA](https://zed.dev/blog/crdts).
- Ink & Switch. [Peritext: A CRDT for Rich-Text Collaboration](https://www.inkandswitch.com/peritext/).
