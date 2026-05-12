# Information Architecture Research R4: Reuse Discovery and Semantic Code Search

**Research dimension:** Before a coding agent creates function `g`, determine whether an existing function `f_j` in the codebase is functionally equivalent or adaptable. This is approximate nearest-neighbor search in a semantic embedding space.

**Date:** 2026-04-02

---

## 1. Code Embedding Models for Semantic Similarity

The core requirement is generating dense vector representations of code that capture functional semantics, not just syntactic form. Several families of models exist, each with distinct architectures and trade-offs.

### 1.1 CodeBERT (Feng et al., 2020)

CodeBERT is the foundational bimodal pre-trained model for programming language (PL) and natural language (NL). It uses the RoBERTa-base architecture (12 layers, 12 attention heads per layer, head size 64) and is trained with a hybrid objective combining masked language modeling and replaced token detection on NL-PL pairs across six programming languages (Feng et al., "CodeBERT: A Pre-Trained Model for Programming and Natural Languages," EMNLP 2020 Findings).

**Benchmark results on clone detection (BigCloneBench):**
- F1: 92.2%
- Precision: ~94%, Recall: ~90%
- On SemanticCloneBench: Precision 67.3% (Python) / 62.5% (Java); Recall 92.3% (Python) / 68.18% (Java)

**Key limitation:** Generalizability decreases significantly when evaluating on code snippets and functionality IDs not seen during model building (Sonnekalb et al., "Generalizability of Code Clone Detection on CodeBERT," ASE 2022). Fine-tuning with contrastive learning improves F1 by +0.22.

**POJ-104 code similarity (MAP@R):** 82.67

### 1.2 GraphCodeBERT (Guo et al., 2021)

Extends CodeBERT by incorporating semantic-level code structure via data flow graphs during pre-training. This allows the model to capture variable dependencies and data movement patterns that pure token-based models miss.

**POJ-104 MAP@R:** 85.16 (a +2.49 improvement over CodeBERT)

### 1.3 UniXcoder (Guo et al., 2022)

A unified cross-modal pre-trained model that incorporates both AST structure and code comments during training. Consistently achieves state-of-the-art results on clone detection and code search tasks, outperforming encoder-only models (CodeBERT, GraphCodeBERT) and encoder-decoder models (PLBART, CodeT5).

**POJ-104 MAP@R:** 90.52 (a +7.85 improvement over CodeBERT)

**Cross-language MRR:** 38.08 average across multiple programming languages, with per-language results ranging from 24.94 to 54.64.

### 1.4 CodeT5 / CodeT5+ (Wang et al., 2021; Wang et al., 2023)

CodeT5 is an identifier-aware encoder-decoder model. CodeT5+ extends this to a family of models (2B, 6B, 16B parameters) using a "shallow encoder, deep decoder" architecture with decoders initialized from CodeGen-mono models.

**CodeT5+ benchmark gains (EMNLP 2023):**
- +3.2 average MRR on 8 text-to-code retrieval tasks
- +2.1 average Exact Match on 2 line-level code completion tasks

### 1.5 StarCoder / StarEncoder (Li et al., 2023)

StarCoder is a 15.5B parameter model trained on 80+ programming languages with 8K context length and multi-query attention. The BigCode community released StarEncoder specifically for code embeddings.

**Notable finding:** LoRACode (2025) showed that LoRA configurations with rank 32 and lower performed better than or on par with GraphCodeBERT, CodeBERT, StarCoder, and UniXcoder for semantic code search, suggesting that parameter-efficient fine-tuning can match or exceed full model performance for embedding tasks.

### 1.6 Voyage-Code-2 (2024)

A commercial embedding model optimized for code retrieval with 16K context window.

**Performance:** 14.52% improvement over OpenAI v3 large and Cohere English v3 on 11 code retrieval tasks. 5.21% enhancement over general-purpose embeddings on general corpora.

### 1.7 CodeXEmbed (Liu et al., 2024)

A generalist embedding model family for multilingual and multi-task code retrieval. CodeXEmbed-2B is initialized from Gemma-2-2b-it; CodeXEmbed-7B from Mistral-7B-Instruct-v0.3. In certain in-domain categories (Code-to-Text), CodeXEmbed outperforms Voyage-Code-002.

### 1.8 Jina Code Embeddings (2025)

jina-code-embeddings-1.5b, a 1.54B parameter model built on Qwen2.5-Coder-1.5B with last-token pooling. Achieves 79.04% overall average and 78.94% MTEB Code average. Competitive with larger alternatives despite fewer parameters.

### Summary Table: POJ-104 Code Similarity (MAP@R)

| Model | MAP@R | Architecture |
|-------|-------|-------------|
| CodeBERT | 82.67 | Encoder-only (RoBERTa-base) |
| GraphCodeBERT | 85.16 | Encoder-only + data flow |
| UniXcoder | 90.52 | Cross-modal (AST + comments) |
| CodeT5+ | +3.2 MRR gain (text-to-code) | Encoder-decoder |

---

## 2. State of the Art in Code Clone Detection (Types 1-4)

### 2.1 Clone Type Taxonomy

The standard taxonomy (Roy & Cordy, 2007) classifies code clones into four types:

- **Type 1 (Exact):** Identical code segments; only whitespace, layout, and comments differ.
- **Type 2 (Parameterized):** Structurally identical but with renamed identifiers, changed types, or modified literals.
- **Type 3 (Near-miss):** Type 2 clones with added, removed, or modified statements. Subdivided by syntactic similarity: Very Strong Type 3 (VST3, >90% similar), Strong Type 3 (ST3, 70-90%), Medium Type 3 (MT3, 50-70%), Weakly Type 3 (WT3, <50%).
- **Type 4 (Semantic):** Functionally equivalent code with entirely different implementations. The hardest to detect and the most relevant to the reuse discovery problem.

### 2.2 Detection Technique Categories

From the surveys (Ain et al., "A Systematic Review on Code Clone Detection," IEEE Access 2019; Roy & Cordy, 2007):

1. **Textual:** Treat source code as character streams. Simple but fragile; only effective for Type 1.
2. **Token-based (Lexical):** Parse code into token streams and compare. Tools: CCFinder, CCFinderX, SourcererCC. Effective for Types 1-3 with high similarity.
3. **Tree-based (AST):** Compare abstract syntax tree subtrees. Tools: Deckard, NiCad, CloneWorks. Robust to formatting and identifier changes.
4. **Graph-based:** Use control-flow graphs (CFG) or program dependence graphs (PDG). Can capture deeper semantic relationships but computationally expensive.
5. **Metric-based:** Extract numeric metrics from code fragments and compare vectors. Lightweight but lower precision.
6. **Embedding-based (Neural):** Learn dense representations from large code datasets. The current frontier for Type 3 and Type 4 detection.

### 2.3 Tool Performance on BigCloneBench (Svajlenko & Roy, ICSME 2015)

BigCloneBench contains 40,528 Java source files and over 6 million clone pairs across 10 functionalities with all four clone types.

**Key recall figures:**

| Tool | Type 1 | Type 2 | VST3 | ST3 | MT3 | WT3/T4 | Precision |
|------|--------|--------|------|-----|-----|---------|-----------|
| NiCad | 100% | 100% | 96% | ~95% | Lower | Low | High |
| SourcererCC | 100% | ~100% | 93% (general), 99% (intra-project), 86% (inter-project) | Good | Lower | Low | 86% |
| CCFinderX | ~90%+ | ~90%+ | N/A (no Type 3 support) | N/A | N/A | N/A | High |
| Deckard | Moderate | Moderate | 37% | Poor | Poor | Poor | 58% overall |
| iClones | Good | Good | Good | Moderate | Lower | Low | Good |

**Critical observation:** All traditional (non-learning) tools show sharp recall degradation from Type 1/2 to Type 3/4. NiCad and SourcererCC are the strongest traditional tools, but neither reliably detects Type 4 (semantic) clones. This is the exact gap that embedding-based approaches target.

### 2.4 Deep Learning Approaches

- **SSCD (BERT-based):** Computes representative embeddings per code fragment and uses nearest-neighbor search for high recall on Type 3 and Type 4 clones at very large scale.
- **DG-IVHFS (2023):** Achieved precision 98%, recall 97%, F1 97% on BigCloneBench; precision 98%, recall 93%, F1 95% on GoogleCodeJam.
- **CodeBERT fine-tuned:** F1 92.2% on BigCloneBench overall.
- **Contrastive pre-training (Jain et al., 2020):** Learns functional similarity through compiler transformations; outperforms other methods by 39% AUROC on adversarial clone detection benchmarks.

### 2.5 REINFOREST (Saieva, Chakraborty & Kaiser, SCAM 2024)

REINFOREST addresses cross-language code search (searching Python corpus with Java queries and vice versa) by encoding both static and dynamic runtime features.

**Key results:**
- Java-to-Python: 40.6% improvement over nearest baseline, up to 44.7% over COSAL (state-of-the-art)
- Python-to-Java: 11.5% improvement over nearest baseline
- Fine-tuned CodeBERT variant: 7.69x improvement (Java-to-Python), 9.96x (Python-to-Java)
- Dynamic runtime information encoding adds 7% (Java-to-Python) and 4.8% (Python-to-Java) improvement

**Notable contribution:** First code search method that encodes dynamic runtime information during training without requiring execution at inference time.

---

## 3. AST-Based Matching vs. Embedding-Based Approaches

### 3.1 AST-Based Strengths

- Precise for structural similarity (Types 1-3 with high syntactic overlap)
- Deterministic results; no model training required
- Robust to formatting, whitespace, and comment changes
- Well-understood theoretical foundations

### 3.2 AST-Based Limitations

- Cannot detect Type 4 (semantic) clones where different algorithms implement the same functionality
- Requires language-specific parsers for each programming language
- Subtree matching is computationally expensive on large codebases
- Creating parse trees for large codebases is time-consuming

### 3.3 Embedding-Based Strengths

- Can detect Type 4 (functional equivalence) clones
- Language-agnostic once trained on multiple languages
- Scales well with approximate nearest-neighbor indexing
- Captures semantic patterns invisible to structural analysis

### 3.4 Embedding-Based Limitations

- Requires training data and compute for model training/fine-tuning
- Results are probabilistic, not deterministic
- Can produce false positives on syntactically similar but semantically different code
- Model generalization degrades on out-of-distribution code patterns

### 3.5 Hybrid Approaches (Current Best Practice)

Recent research shows combining AST, CFG, and DFG yields the best performance:

- **AST + CFG + DFG fusion** captures syntactic structure (AST), control dependencies (CFG), and data dependencies (DFG) simultaneously
- **Functional semantic distillation** (FSD-CLCD, 2024) uses graph learning for cross-language clone detection
- **AST-based Markov Chains** (Wu et al., ASE 2022) detect semantic clones by modeling AST traversal patterns

**However, a surprising finding (2025):** "AST-Enhanced or AST-Overloaded?" (arXiv 2506.14470) questions whether hybrid graph representations actually help or harm clone detection compared to simpler embedding approaches.

### 3.6 Practical Recommendation for Reuse Discovery

For the "should I reuse or create?" decision:
- **Use AST matching as a first pass** for cheap, high-precision Type 1-3 detection
- **Use embedding-based search as a second pass** for Type 4 (functional equivalence) detection
- **Combine with type-signature matching** (Section 6) for statically typed languages

---

## 4. Approximate Nearest-Neighbor Search for Code Embeddings

### 4.1 Problem Statement

Given a code embedding vector (typically 768-dimensional for BERT-family models), find the k most similar existing code fragments in a corpus of potentially millions of functions. Exact search is O(n) per query, which is infeasible at scale.

### 4.2 FAISS (Facebook AI Similarity Search)

Developed by Meta. The most widely deployed ANN library.

**Key features:**
- Supports multiple index types: Flat (exact), IVF (inverted file), HNSW (graph-based), PQ (product quantization)
- Built-in GPU acceleration for large-scale indexing
- IVF-PQ enables memory-efficient indexing of billions of vectors

**Performance (ANN-Benchmarks, SIFT1M):**
- HNSW index: ~95% recall@10 in 1-2ms per query on CPU
- IVF-PQ: Higher throughput but slightly lower recall
- GPU-accelerated (NVIDIA cuVS integration): Build indexes up to 12x faster at 95% recall; search latencies up to 8x lower at 95% recall
- PCA64,IMI2x10,Flat: Fastest query time at 0.12 seconds on large-scale gene embeddings

### 4.3 HNSW (Hierarchical Navigable Small Worlds)

A graph-based indexing algorithm available both standalone and within FAISS.

**Characteristics:**
- Constructs a layered graph where each layer is a subset of the previous, enabling "zoom-in" traversal
- Over all recall values, HNSW is fastest among ANN methods (ANN-Benchmarks)
- Achieves much better speed/precision operating points than IVFFlat (e.g., 0.020ms vs 0.140ms at >0.9 recall@1)
- Higher memory cost compared to quantization methods
- Best suited for interactive, low-latency applications where high recall is critical

### 4.4 ScaNN (Google's Scalable Nearest Neighbors)

Developed by Google. Introduces anisotropic vector quantization.

**Characteristics:**
- Weights dimensions differently during compression to preserve critical similarity information
- Optimized for Maximum Inner Product Search (MIPS), common in semantic similarity
- Often outperforms other methods on large-scale benchmarks with careful tuning
- Query latency typically ~2x higher than FAISS best configurations in head-to-head comparisons

### 4.5 Comparison Summary for Code Embeddings

| Library | Best For | Recall@0.95 Latency | Memory | GPU Support |
|---------|---------|---------------------|--------|-------------|
| FAISS-HNSW | Low-latency interactive search | ~1-2ms (CPU, SIFT1M) | High | Yes (cuVS) |
| FAISS-IVF-PQ | Large-scale, memory-constrained | Moderate | Low | Yes |
| ScaNN | MIPS-optimized embeddings | ~1.8s (large-scale gene) | Moderate | Limited |
| HNSW (standalone) | Highest recall, low latency | ~0.020ms at >0.9 R@1 | Highest | No |

**Recommendation for harness use:** FAISS-HNSW provides the best balance of recall, latency, and ecosystem maturity for code embedding search. For a codebase of 10K-100K functions (typical for a single large project), even a flat index with brute-force search may be fast enough (<100ms), making the ANN choice less critical than the embedding quality.

---

## 5. Semantic Code Search in Agent Contexts: The "Reuse or Create?" Decision

### 5.1 Current State of Practice

The pillar document asserts that no published work exists on applying semantic code search to the "should I reuse or create?" decision in an agent context. This appears to be correct as a formal research contribution, but several industrial implementations are converging on this capability:

#### GitHub Copilot Coding Agent (March 2026)

GitHub's Copilot coding agent now includes a semantic code search tool (GitHub Changelog, 2026-03-17).

**Implementation details:**
- Uses a code embedding model to generate vector representations of each file
- At agent startup, the task description is embedded and top-k most similar files are retrieved
- Result: approximately **3x more relevant context retrieved per task** vs. keyword-based approaches
- Tasks complete **2% faster** without quality degradation
- New embedding model delivers **37.6% lift in retrieval quality**, ~2x higher throughput, 8x smaller index size
- No configuration required; agent automatically uses semantic search when appropriate

**Limitation:** This is context retrieval for the agent, not an explicit "reuse or create?" decision gate. The agent receives relevant code as context but is not formally evaluated on whether it reuses existing functions vs. creating duplicates.

#### Cursor Semantic Search (2025-2026)

Cursor built a custom embedding model trained on agent session traces.

**Implementation details:**
- Chunks code using AST-aware splitting (traverses AST depth-first, splits into subtrees within token limits)
- Trains embedding model to align similarity scores with LLM-generated rankings derived from agent work sessions
- Stores chunk embeddings in Turbopuffer (vector database optimized for code)
- Uses Merkle tree hashing for efficient incremental index updates
- Combines grep-based regex search with semantic search ("hybrid approach leads to the best outcomes")

**Performance:**
- **12.5% average accuracy improvement** (6.5% to 23.5% depending on model)
- Code retention increased by **0.3% overall**, rising to **2.6% on large codebases** (1,000+ files)
- Dissatisfied user requests decreased by 2.2% without semantic search

#### Other Tools

- **Serena:** MCP server providing semantic code retrieval at the symbol level; enhances token efficiency when combined with coding agents
- **grepai:** Privacy-first semantic code search CLI that provides agents with a semantic map of the codebase
- **Probe:** Combines ripgrep speed with tree-sitter AST parsing for AI-friendly code search
- **claude-context (Zilliz):** Code search MCP for Claude Code using Milvus vector database

### 5.2 The Gap: No Formal "Reuse Gate"

The critical distinction: all existing implementations provide **context retrieval** (giving the agent relevant code to read), not **reuse enforcement** (actively preventing the agent from creating duplicate functionality). The difference is:

1. **Context retrieval (current):** "Here are similar functions; the agent may or may not use them."
2. **Reuse gate (missing):** "Function f_j with similarity score 0.93 already exists. Before creating g, the agent must either (a) call f_j, (b) adapt f_j, or (c) justify why a new function is needed."

This is the novel contribution identified in the pillar document. No published work formalizes this as a decision gate in the agent's action space. The closest analog is the DeRep technique (2025) for detecting and mitigating repetition in LLM-generated code, but this operates at the token/pattern level, not at the function-level semantic equivalence level.

### 5.3 LLM-Based Clone Detection

Recent work (arXiv 2308.01191) surveys LLM capabilities for clone detection directly:
- Advanced LLMs excel at detecting complex semantic clones, surpassing traditional methods
- Chain-of-thought prompting noticeably enhances detection performance
- This suggests a hybrid approach: use embedding-based ANN search for fast candidate retrieval, then use an LLM for high-precision verification of the top candidates

---

## 6. Type-Signature Structural Matching

### 6.1 Hoogle: The Gold Standard

Hoogle (Mitchell, 2008) is the Haskell API search engine that allows searching by approximate type signature. Given a query like `(a -> b) -> [a] -> [b]`, Hoogle returns `map` and related functions.

**How it works:**
- Combines signature matching with keyword matching
- Uses **approximate** type signature matching, not exact
- Handles type class constraints and unification
- Searches across all packages and libraries on Stackage

**Effectiveness:** In Haskell's strong, expressive type system, type signatures are remarkably discriminating. A function's type often uniquely identifies its behavior (up to parametricity). This is the theoretical ideal for reuse discovery; if you know what type you need, you can find existing implementations with high precision.

### 6.2 Idris Type-Directed Search

Idris' `:search` command implements similar functionality with a more complex type matching algorithm. It handles dependent types, type class constraints, and unification, going beyond Hoogle's capabilities for richer type systems.

### 6.3 Applicability to Mainstream Languages

The challenge: mainstream languages (Python, JavaScript, TypeScript, Java, Go) have much weaker type systems than Haskell or Idris.

**TypeScript and Rust** offer the best opportunities in mainstream languages:
- TypeScript: Structural typing with generics provides enough information for meaningful signature matching
- Rust: Strong typing with traits and lifetimes provides discriminating signatures
- Java: Nominal typing with generics is moderately useful but less discriminating than structural typing

**Python and JavaScript** lack static types in practice (despite type hints), making signature matching infeasible without additional analysis.

### 6.4 Practical Approach for a Harness

A practical type-signature matching system for reuse discovery would:

1. **Extract type signatures** from function definitions (using language servers, tree-sitter, or type inference)
2. **Normalize signatures** to a canonical form (alpha-renaming type variables, sorting constraints)
3. **Index by structural signature patterns** (e.g., "takes list, returns list" or "takes two numbers, returns boolean")
4. **Combine with semantic embeddings** for functions where type signatures are ambiguous or unavailable

This is complementary to embedding-based search: type signatures provide high-precision candidates in typed languages, while embeddings handle the cases where types are insufficient or absent.

---

## 7. Synthesis: Architecture for a Reuse Discovery Subsystem

Based on the research, a practical reuse discovery system for a coding agent harness would use a **three-tier search architecture:**

### Tier 1: Type-Signature Index (fastest, highest precision for typed languages)
- Extract and normalize function signatures using language servers
- Index using a trie or hash map on canonical signature forms
- Latency: <1ms for lookup
- Precision: Very high for Haskell/Rust/TypeScript; moderate for Java; inapplicable for Python/JS

### Tier 2: AST-Structural Similarity (fast, high precision for Type 1-3 clones)
- Parse functions into ASTs using tree-sitter
- Compare using normalized subtree hashing (similar to SourcererCC's token approach)
- Latency: 10-100ms depending on corpus size
- Recall: Excellent for Type 1-3; poor for Type 4

### Tier 3: Semantic Embedding Search (moderate speed, captures Type 4 equivalence)
- Embed functions using UniXcoder or CodeT5+ (best current models for code similarity)
- Index using FAISS-HNSW for sub-millisecond ANN search
- Verify top-k candidates using LLM-based semantic comparison
- Latency: 50-500ms including embedding generation and search
- Recall: Good for all types including Type 4; precision requires LLM verification

### Decision Gate Protocol

When the agent proposes to create function `g`:

1. Extract the proposed function's signature, AST structure, and semantic embedding
2. Search all three tiers in parallel
3. If any tier returns a match above threshold:
   - Present the match(es) to the agent with similarity scores
   - Require explicit justification for creating a new function
   - Log the decision for later audit
4. If no match above threshold: proceed with creation

### Embedding Model Recommendation

Based on the benchmarks surveyed:
- **For maximum accuracy:** UniXcoder (MAP@R 90.52 on POJ-104) or CodeT5+ (best on text-to-code retrieval)
- **For production deployment:** Voyage-Code-2 (commercial, optimized latency, 16K context) or jina-code-embeddings-1.5b (open-source, competitive performance)
- **For cross-language search:** REINFOREST approach (encoding dynamic features) with fine-tuned CodeBERT backbone

### ANN Index Recommendation

- **For single-project codebases (<100K functions):** FAISS-HNSW on CPU; sub-2ms queries at >95% recall
- **For multi-repo or very large codebases:** FAISS-IVF-PQ with GPU acceleration; trades some recall for memory efficiency
- **For cloud-hosted search:** Turbopuffer (Cursor's choice) or Milvus for managed vector database

---

## 8. Open Questions and Research Gaps

1. **No formal evaluation of the "reuse gate" concept.** All existing work measures retrieval quality, not reuse decision quality. The key metric would be: "What fraction of agent-created functions could have been avoided by reusing existing code?"

2. **Threshold calibration.** What similarity score threshold triggers the reuse decision? Too low creates false positive "you should reuse this" suggestions; too high misses genuine reuse opportunities. This likely needs to be calibrated per-codebase.

3. **Adaptation detection.** Beyond exact functional equivalence, can we detect when an existing function `f_j` could be adapted (with minor modifications) to serve the purpose of proposed `g`? This is harder than clone detection and closer to program synthesis.

4. **Incremental indexing cost.** As the codebase evolves, maintaining the embedding index adds overhead. Cursor's Merkle tree approach suggests a practical solution, but the cost-benefit analysis for smaller projects is unclear.

5. **Cross-language reuse.** REINFOREST shows promise for cross-language search, but no system applies this to reuse decisions where the agent might be writing in a different language than existing implementations.

---

## Sources

- [Feng et al., "CodeBERT: A Pre-Trained Model for Programming and Natural Languages," EMNLP 2020](https://aclanthology.org/2020.findings-emnlp.139/)
- [Guo et al., "GraphCodeBERT: Pre-training Code Representations with Data Flow"](https://huang.isis.vanderbilt.edu/cs8395/readings/graphcodebert.pdf)
- [Guo et al., "UniXcoder: Unified Cross-Modal Pre-training for Code Representation," ACL 2022](https://aclanthology.org/2022.acl-long.499.pdf)
- [Wang et al., "CodeT5+: Open Code Large Language Models for Code Understanding and Generation," EMNLP 2023](https://aclanthology.org/2023.emnlp-main.68/)
- [Li et al., "StarCoder: May the Source Be With You!" 2023](https://arxiv.org/pdf/2305.06161)
- [Saieva, Chakraborty & Kaiser, "REINFOREST: Reinforcing Semantic Code Similarity for Cross-Lingual Code Search Models," SCAM 2024](https://arxiv.org/html/2305.03843v2)
- [Ain et al., "A Systematic Review on Code Clone Detection," IEEE Access 2019](https://ieeexplore.ieee.org/document/8719895/)
- [Roy & Cordy, "A Survey on Software Clone Detection Research," Queen's University TR 2007-541](https://research.cs.queensu.ca/TechReports/Reports/2007-541.pdf)
- [Svajlenko & Roy, "Evaluating Clone Detection Tools with BigCloneBench," ICSME 2015](https://clones.usask.ca/pubfiles/articles/SvajlenkoEvaluatingToolsICSME2015.pdf)
- [Sajnani et al., "SourcererCC: Scaling Code Clone Detection to Big Code," ICSE 2016](https://dl.acm.org/doi/pdf/10.1145/2884781.2884877)
- [Sonnekalb et al., "Generalizability of Code Clone Detection on CodeBERT," ASE 2022](https://arxiv.org/pdf/2208.12588)
- [LoRACode: LoRA Adapters for Code Embeddings, 2025](https://arxiv.org/html/2503.05315v1)
- [Voyage AI, "voyage-code-2: Elevate Your Code Retrieval," 2024](https://blog.voyageai.com/2024/01/23/voyage-code-2-elevate-your-code-retrieval/)
- [Liu et al., "CodeXEmbed: A Generalist Embedding Model Family," COLM 2025](https://arxiv.org/pdf/2411.12644)
- [Jina Code Embeddings 1.5b](https://jina.ai/models/jina-code-embeddings-1.5b/)
- [Mitchell, "Hoogle: Fast Type Searching," 2008](https://ndmitchell.com/downloads/slides-hoogle_fast_type_searching-09_aug_2008.pdf)
- [ANN-Benchmarks](http://ann-benchmarks.com/)
- [FAISS: A Library for Efficient Similarity Search (GitHub)](https://github.com/facebookresearch/faiss)
- [Cursor, "Improving Agent with Semantic Search"](https://cursor.com/blog/semsearch)
- [GitHub Copilot Coding Agent: Semantic Code Search, March 2026](https://github.blog/changelog/2026-03-17-copilot-coding-agent-works-faster-with-semantic-code-search/)
- [Jain et al., "Contrastive Code Representation Learning," 2020](https://ar5iv.labs.arxiv.org/html/2007.04973)
- [CoIR: A Comprehensive Benchmark for Code Information Retrieval Models](https://arxiv.org/html/2407.02883v1)
- [BigCloneBench (GitHub)](https://github.com/clonebench/BigCloneBench)
- [Microsoft CodeXGLUE](https://microsoft.github.io/CodeXGLUE/)
