# Research Plan: Information Architecture for Coding Agent Harnesses

## Topic

How information flows through coding agent harnesses, from human intent to executable code, and how that flow should be managed to maximize correctness. Encompasses context selection as submodular optimization, information-theoretic characterization of the spec-to-code gap, the reuse discovery problem, and empirical evidence on context degradation.

## Research Questions

1. **Context as optimization:** What formal properties does the context selection problem have (submodularity, monotonicity, NP-hardness), and what approximation guarantees apply?
2. **Information-theoretic gap:** How large is the measurable entropy gap between natural-language specifications and source code, and what does this imply about what a model's prior must supply?
3. **Context degradation:** What is the empirical shape of the degradation function delta(|C|) across frontier models, and how does it interact with context relevance?
4. **Reuse discovery:** What are the best available approaches to semantic code search for "should I reuse or create?" decisions, and what are their precision/recall characteristics?
5. **Tiered context architectures:** How do existing harness designs (GSD, RAPID, Turing, Blueprint) implement information tiering, and what empirical evidence supports each approach?
6. **Fresh vs. incremental context:** Is the observed advantage of fresh context (Suzgun & Kalai) a property of freshness per se, or a confound with context rot in accumulated sessions?
7. **Structural vs. prompt-based management:** What evidence exists that structural enforcement (tool permissions, filesystem isolation) outperforms instructional enforcement (system prompt directives)?

## Key Thinkers and Works

- **Shannon (1948, 1951):** Information theory foundations, English entropy estimates
- **Liu et al. (TACL 2024):** "Lost in the Middle" -- positional bias in long-context LLMs
- **Hindle et al. (ICSE 2012):** Cross-entropy of source code (naturalness of software)
- **Nemhauser, Wolsey, Fisher (1978):** Submodular optimization, greedy approximation guarantees
- **Anthropic (Sep 2025):** Context engineering framework (three-tier model)
- **ETH Zurich / Gloaguen et al. (Feb 2026):** AGENTS.md evaluation
- **JetBrains (Dec 2025):** Observation masking vs. summarization
- **Chroma Research:** Universal context degradation curves
- **Factory.ai:** Structural critique of vector retrieval for code
- **Suzgun & Kalai:** Fresh Eyes paradigm in agent evaluation
- **Feng et al. (CodeBERT, 2020):** Pre-trained models for code understanding
- **Li et al. (StarCoder, 2023):** Open-source code LLMs and embeddings

## Agent Strategy (5 Parallel Researchers)

### R1: Information Theory & Formal Foundations
- Shannon information theory applied to software
- Cross-entropy measurements of code vs. natural language
- Submodular optimization under knapsack constraints
- Formal properties of the context selection problem

### R2: Context Degradation & Long-Context LLMs
- "Lost in the Middle" and follow-up studies
- Chroma Research degradation curves
- Empirical measurements of recall vs. context length
- Position bias, attention patterns, and their architectural roots

### R3: Harness Engineering & Context Management
- Anthropic's three-tier framework
- ETH Zurich's AGENTS.md evaluation
- JetBrains observation masking
- GSD, RAPID, Turing, Blueprint approaches
- Structural vs. prompt-based context control

### R4: Reuse Discovery & Semantic Code Search
- CodeBERT, StarCoder, UniXcoder embeddings for code similarity
- Clone detection literature (Types 1-4)
- AST-based and type-signature matching
- Approximate nearest-neighbor search in embedding spaces

### R5: Contrarian & Alternative Perspectives
- "Context is overrated; the prior does the work" (bimodal abstraction gap)
- "Bigger windows will solve this" vs. degradation evidence
- Fresh Eyes vs. incremental approaches
- HCI and cognitive load perspectives on context design

## Acceptance Criteria

- All 7 research questions answered with 2+ independent sources
- Contradictions between sources explicitly identified
- At least one formal result (theorem or proof sketch) per question where applicable
- Empirical data points with specific numbers (not vague claims)
- Coverage of contrarian positions with evidence for/against
