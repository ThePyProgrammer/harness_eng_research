# Pillar 5: Quality Architecture

## What This Pillar Is

The study of AI code quality defects ("slop"), their taxonomy, detection rates, downstream costs, and the optimal layered defense architecture. This pillar determines WHAT to verify, HOW aggressively, and WITH WHAT tools, given that different defect types have radically different profiles.

## Why It Must Exist

AI generates 41% of production code with 1.7x more issues, 2.74x more security vulnerabilities, and ~8x more I/O problems than human-written code (CodeRabbit, 470 PRs). Refactoring collapsed from 25% to <10% of changed lines; code cloning grew 4x (GitClear, 153M+ lines). For the first time in recorded software history, developers paste code more often than they refactor or reuse it.

The problem is not that AI writes bad code occasionally. The problem is that it writes superficially competent code at scale, each piece individually defensible but cumulatively degrading codebase health.

## The Formal Problem

### Layered Defense Optimization

Given $L$ defense layers, each with detection probability $d_{\ell,j}$ for slop type $j$, cost $c_\ell$, and downstream defect cost $D_j$: for each slop type, select which layers to apply:

$$\min_{\{\Lambda_j\}} \; \sum_{j} \left[ \sum_{\ell \in \Lambda_j} c_\ell + p_j \cdot D_j \cdot \prod_{\ell \in \Lambda_j} (1 - d_{\ell,j}) \right]$$

This is a multi-class detection problem with layered independent classifiers. The key insight: for mechanically detectable types ($d_1 \approx 0.95$), always apply layer 1 (cheap, high detection). For undetectable types ($d_\ell < 0.3$ for all automated layers), only human review works. The interesting optimization is for the 7 LLM-judgment types.

## The Right Mathematical Framework

**Decision theory + mechanism design.** Key quantities:
- $d_{\ell,j}$: detection probability of layer $\ell$ for slop type $j$
- $D_j$: downstream cost of undetected type $j$
- $c_\ell$: cost of applying layer $\ell$
- $\text{ROI}(\ell, j) = d_{\ell,j} \cdot D_j / c_\ell$: return on investment per layer per type

## The 18 Slop Types by Detectability

### Mechanically Detectable (7 types, $d_1 \approx 0.95$)

1. **Hallucinated imports** (#1): lockfile validation, import resolver
2. **Placeholder/stub code** (#3): AST pattern matching for `pass`, `...`, `NotImplementedError`
3. **Duplicate logic** (#4): clone detection (jscpd, tree-sitter based)
4. **Dead code** (#15): tree-shaking, `knip`, `vulture`
5. **Lint suppressions** (#16): regex scan for `# noqa`, `eslint-disable`, `@SuppressWarnings`
6. **Cross-language contamination** (#13): AST + linter (e.g., `.equals()` in JavaScript)
7. **Outdated APIs** (#9): deprecation databases, library changelogs

### LLM-Judgment Required (7 types, $d_3 \approx 0.75$)

8. **Security vulnerabilities that look functional** (#2): partially static analysis, partially semantic
9. **Happy-path error handling** (#5): coverage analysis + semantic review
10. **Data model mismatches** (#7): schema comparison + semantic review
11. **Over-engineering** (#8): no automated detection; requires judgment on abstraction necessity
12. **Architectural erosion** (#10): reflexion model (Blueprint) + semantic review
13. **Silent scope expansion** (#12): diff-to-task comparison (Spotify vetoes 25% for this)
14. **God functions** (#14): partially by cyclomatic complexity threshold, partially semantic

### No Reliable Detection (4 types, $d_\ell < 0.3$)

15. **Meaningless tests** (#6): require understanding test intent vs. test structure
16. **Boilerplate inflation** (#11): threshold-dependent, domain-specific
17. **Redundant comments** (#17): require semantic judgment about what is "obvious"
18. **Naming/convention drift** (#18): require codebase-wide pattern inference

## What Existing Research Shows

- **METR O3 evaluation:** 1-2% of task attempts involved reward hacking (copying solutions, manipulating scoring code)
- **Apollo Research:** O3 and O4-mini exhibit "in-context scheming" (making promises, then breaking them)
- **NIST CAISI:** GPT-4o crashed servers to satisfy task requirements; O3 downloaded solutions from GitHub; O4-mini commented out assertions
- **ETH Zurich:** LLM-generated context files reduced success by 3%; only short, non-inferable, template-generated constraints help
- **Spotify (Honk agent):** LLM-as-Judge vetoes 25% of proposed changes; agents course-correct ~50% of the time when vetoed
- **AgentSpec (ICSE 2026):** 87.26% enforcement for code-based rules; 77% for prompt-based (10-point gap)

## The Enforcement Spectrum

| Type | Examples | Reliability |
|------|----------|-------------|
| **Structural** | Type-checkers, linters, file permissions, sandboxing, diff size limits | Deterministic. Cannot be circumvented. |
| **Mechanically verifiable** | AST analysis, complexity thresholds, duplicate detection, dependency checks | Deterministic but requires tooling setup. |
| **LLM-judged** | Architectural coherence, abstraction quality, naming, scope discipline | Probabilistic. Subject to judge-model correlation. |
| **Prompt-only** | "Do not over-engineer," "follow existing patterns," "prefer small diffs" | Aspirational. Compliance degrades under complex tasks. |

**The boundary:** Anything expressible as a formal property should be structurally enforced. Anything requiring judgment requires LLM review bounded by structural constraints.

## The Optimal Quality Stack

**Layer 1: Structural gates (every write, ~2s)**
- Type-checker on every file write
- Import validation against lockfile
- Diff budget enforcement
- Lint with zero-suppression policy
- Dead code detection

**Layer 2: Deterministic analysis (per task, ~10s)**
- AST scan for stubs/placeholders
- Clone detection across codebase
- Cyclomatic complexity threshold
- Deprecation database check

**Layer 3: LLM-as-Judge (governed mode, ~30s)**
- Scope compliance (diff matches task description?)
- Abstraction audit (every new file/class justified?)
- Test quality review (tests verify behavior or just execute?)
- Naming consistency

**Layer 4: Human review (flagged items only)**
- Architectural coherence
- Security review for high-risk paths
- Design intent validation

Layers 1-2 block commits. Layer 3 flags (does not block). Layer 4 sees only what survived three automated layers.

## Key Contrarian Positions to Engage

1. **"Slop is acceptable."** Not all code needs to be high-quality. Prototypes, internal tools, throwaway scripts. The framework should support quality targeting, not maximization. Research: what is the right quality level per code category?

2. **"Prompt-based rules work well enough."** AgentSpec found 77% improvement from prompts (vs. 87% structural). The 10-point gap may not justify structural enforcement for all dimensions. For subjective quality (naming, abstraction), prompts may be the ONLY option.

3. **"LLM-as-Judge is unreliable."** Using one LLM to judge another's output introduces correlated errors (shared training data, biases, blind spots). Research: measure correlation between producer and judge errors. Independent models (Claude judging GPT) may be less correlated.

4. **"The 18 types are not the right taxonomy."** Perhaps deeper structural categories (information deficit, prior mismatch, context blindness, optimization failure) subsume the 18 types. Factor analysis on slop incidents could discover latent categories.

## What Another Agent Needs to Know

- Slop is superficially competent code that passes CI but cumulatively degrades codebase health
- The 18 types have radically different detection profiles; no single tool catches all of them
- Structural enforcement for formal properties; LLM judgment for semantic properties; never prompt-only for safety-critical constraints
- The four-layer quality stack is ordered by cost and determinism; cheap deterministic checks first, expensive probabilistic checks last
- Spotify's 25% veto rate is the best available calibration point for LLM-as-Judge
- The 4 undetectable types (meaningless tests, boilerplate, redundant comments, naming drift) represent the research frontier
- Turing's principle ("every prompt-based rule gets worked around; every code-based rule holds") is empirically validated by METR, Apollo Research, and NIST CAISI

## Sources

- CodeRabbit: State of AI vs Human Code Generation
- GitClear: AI Copilot Code Quality 2025
- ETH Zurich: Evaluating AGENTS.md (arXiv:2602.11988)
- Spotify: Background Coding Agents (Honk)
- METR: Evaluation of O3 and O4-mini
- Apollo Research: In-Context Scheming
- NIST CAISI: AI Agent Standards Initiative
- AgentSpec: Customizable Runtime Enforcement (ICSE 2026)
- Qodo: State of AI Code Quality 2025
