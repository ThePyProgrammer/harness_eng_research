# Research Plan: Security Architecture for AI Coding Agent Harnesses

## Key Research Questions

1. **Capability bounding as formal security**: How do access control matrix theory (Lampson 1971), capability-based security (Dennis & Van Horn 1966), and the principle of least privilege (Saltzer & Schroeder 1975) apply to autonomous AI agents operating with developer-level credentials? What formal results exist on the decidability and tractability of minimal capability sets?

2. **Information flow control for credential management**: How does lattice-based information flow (Denning 1976), Bell-LaPadula, and Biba apply to agent-harness credential architectures? What are the formal guarantees of noninterference, and where do covert channels break them?

3. **Structural enforcement vs. instructional enforcement**: What empirical evidence quantifies the reliability gap between prompt-based and code-based security policies? How does the $(1-\epsilon)^T$ decay model connect to established results in reliability theory and Byzantine fault tolerance?

4. **Prompt injection as an inherent vulnerability**: What is the formal relationship between prompt injection and confused deputy attacks? What impossibility results exist for defending instruction-following systems against adversarial inputs?

5. **Adversarial robustness of LLM agents**: What do Apollo Research, NIST CAISI, METR, and CodeRabbit's empirical studies reveal about the threat surface of autonomous coding agents? How do these map to classical threat taxonomies (STRIDE, OWASP)?

6. **Trusted Computing Base for harnesses**: How does the Orange Book TCB concept adapt to agent harnesses? What are the minimal components of the harness TCB, and what is the formal verification surface?

7. **Output filtering as channel capacity restriction**: How does Shannon's channel coding theorem apply to constraining agent output channels? What is the formal relationship between filter restrictiveness and task completion capability?

8. **Production harness security architectures**: How do Codex, Cursor, Claude Code, GSD, RAPID, and Spotify Honk implement security structurally? What convergent patterns emerge?

## Major Thinkers and Works

- **Saltzer & Schroeder (1975)**: Eight design principles for information protection
- **Lampson (1971)**: Access control matrix; protection rings
- **Denning (1976)**: Lattice model of secure information flow
- **Bell & LaPadula (1973)**: Mandatory access control, confidentiality
- **Biba (1977)**: Integrity model
- **Harrison, Ruzzo, Ullman (1976)**: Undecidability of the safety problem in access control
- **Dennis & Van Horn (1966)**: Capability-based addressing
- **Hardy (1988)**: Confused deputy problem
- **Goguen & Meseguer (1982)**: Noninterference
- **Orange Book (DoD 1985)**: Trusted Computing Base evaluation criteria
- **Wang et al. (AgentSpec, ICSE 2026)**: Runtime enforcement for AI agents
- **Apollo Research (2025)**: In-context scheming in frontier models
- **NIST CAISI (2025)**: Agent misbehavior taxonomy
- **METR (2025)**: Reward hacking rates in O3
- **CodeRabbit (2025)**: Vulnerability rates in AI-generated code

## Researcher Agent Strategy

### R1: Historical & Foundational Security Theory
Access control theory (Lampson, HRU), capability-based security (Dennis & Van Horn, E language, Capsicum), information flow control (Denning lattice, decentralized label model), noninterference (Goguen & Meseguer), Saltzer & Schroeder principles. Focus on formal results, impossibility theorems, and design principles.

### R2: Agent Security Empirics & Threat Landscape
Apollo Research scheming, NIST CAISI misbehavior, METR reward hacking, CodeRabbit vulnerability rates, prompt injection attack taxonomy, real-world agent security incidents. Focus on quantitative data and threat model grounding.

### R3: Production Harness Security Implementations
How Codex, Claude Code, Cursor, Devin, GSD, RAPID, Spotify Honk, Aider, and other harnesses implement sandboxing, credential management, network isolation, output filtering. Convergent patterns and structural enforcement mechanisms.

### R4: Contrarian & Alternative Perspectives
Arguments against heavy security (overhead, productivity cost, unrealistic threat models), Constitutional AI and training-based safety, the "agents aren't adversarial" position, zero-trust vs. capability-based approaches, the economic argument for accepting residual risk.

## Acceptance Criteria

- All 8 research questions answered with 2+ independent sources
- Contradictions between sources identified and documented
- Formal results (HRU undecidability, noninterference composition, structural enforcement decay) cited with precise theorem statements
- Empirical data from at least 5 independent measurement studies
- At least 3 contrarian positions engaged with steelmanned arguments
