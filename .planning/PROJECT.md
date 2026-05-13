# Harness Architecture Book Wiki

## What This Is

A static, book-like research website for the AI coding agent harness architecture corpus. It presents the umbrella framework and all twelve pillar papers as an accessible academic wiki: clear chapter navigation, formal definitions, theorem statements, derivations, citations, source trails, local search, and graph-style cross-links between concepts.

The site is optimized for researchers who want rigorous mathematical structure without digging through every LaTeX source first. It should feel stylistic and editorial, but with its own identity rather than a close copy of Thinking Machines Lab.

## Core Value

Researchers can understand, navigate, and cross-reference the corpus's formal pillar definitions, theorems, and derivations without losing the rigor of the canonical papers.

## Requirements

### Validated

- ✓ The repository contains a canonical umbrella paper under `science/paper/` — existing corpus
- ✓ The repository contains twelve pillar areas under `pillars/`, each with canonical paper/supporting material structure — existing corpus
- ✓ Pillar focus areas are already named and summarized in `README.md` and `pillars/README.md` — existing corpus
- ✓ Canonical paper sources and PDFs exist for the main research corpus under `science/` and `pillars/*/paper/` — existing corpus
- ✓ Supporting notes, research, reviews, and archives live beside their owning pillar — existing corpus

### Active

- [ ] Build a static book-style website for the harness architecture corpus
- [ ] Cover the umbrella science framework and all twelve pillars in v1
- [ ] Curate website pages from canonical LaTeX papers plus supporting README, notes, and research material
- [ ] Present each pillar with accessible academic prose, notation, definitions, theorem/proposition/lemma statements, assumptions, derivations, and interpretation
- [ ] Provide book-like chapter navigation across overview, pillars, glossary, bibliography, and reading paths
- [ ] Provide graph-style cross-links between pillars, concepts, definitions, and theorems
- [ ] Provide local static search over pages, definitions, theorems, glossary entries, and citations
- [ ] Use a distinctive, stylistic, book-like visual identity rather than cloning Thinking Machines Lab
- [ ] Preserve clear source trails back to canonical corpus files and papers

### Out of Scope

- Dynamic user accounts, comments, or collaborative editing — v1 is a static research publication, not a community wiki
- Server-side database or CMS — the corpus already lives in git and should remain source-controlled
- Exact visual cloning of Thinking Machines Lab — the requested direction is an original identity, not a brand copy
- Full automatic LaTeX semantic extraction as the only content pipeline — v1 should be curated from canonical sources to maintain readability and rigor
- Editing archived corpus material as source content — archives are preservation artifacts, not canonical sources
- Rewriting the underlying research papers — the website explains and organizes the existing corpus

## Context

This is a brownfield repository organized as a Markdown/LaTeX research corpus, not an application runtime. The canonical material lives in `science/paper/` and `pillars/*/paper/`, while supporting notes, research, reviews, and archives live beside each pillar.

The current pillar set is:

1. Abstraction — specification-to-code abstraction gaps, refinement, and formal interfaces
2. Information — context selection, degradation, tiered memory, and reuse discovery
3. Reliability — compound error, verification scheduling, structural enforcement, and adaptive verification
4. Coordination — multi-agent decomposition, merge conflicts, ownership, and quality-adjusted speedup
5. Temporal — verified iterations per hour, staleness, speculation, caching, and speed-quality tradeoffs
6. Quality — AI code slop, layered defense, detection limits, accretion, and cost of quality
7. Governance — governance capacity, ratchets, decision survival, and theory preservation
8. Economics — token budgets, model-tier selection, queueing economics, CVIH, and caching economics
9. Human Interaction — human attention allocation, autonomy boundaries, trust calibration, and supervision decay
10. Model Routing — stage-specific model assignment, cross-model diversity, cascades, and escalation
11. Security — sandboxing, credential flow, prompt injection, output filtering, and defense-in-depth
12. Accretion — individually plausible but collectively harmful AI-generated code

The requested product direction is a static book site with curated hybrid content: canonical papers remain the source of truth, but the web pages should be written as readable research chapters. The primary audience is researchers, so rigor, definitions, theorem clarity, derivations, citations, and source traceability matter more than onboarding simplicity.

## Constraints

- **Source of truth**: Canonical content comes from `science/paper/` and `pillars/*/paper/` — website pages must link back to these sources rather than becoming untraceable forks
- **Coverage**: v1 must include the umbrella paper and all twelve pillars — a narrow one-pillar demo is insufficient
- **Math depth**: v1 should include full derivations where the corpus supports them — definitions-only summaries are too shallow
- **Format**: v1 should be static — avoids unnecessary server/runtime complexity for a research publication
- **Navigation**: The site must support both book-chapter reading and wiki/graph-style exploration — researchers need linear and associative paths
- **Search**: Search must be local/static — no hosted search service or database required for v1
- **Visual identity**: The site should be original and book-like — inspired by high-end research/editorial sites, but not a close clone
- **Repository discipline**: Do not treat `archive/` material as active source unless a page explicitly discusses provenance

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use a static book site as v1 output | The corpus is source-controlled research material and does not need accounts, mutable state, or a database | — Pending |
| Cover all twelve pillars in v1 | The site should function as a wiki spine for the whole corpus, not a single polished sample | — Pending |
| Use curated hybrid content | Direct LaTeX extraction alone would preserve source proximity but likely hurt readability; curated pages can keep source trails while explaining the math | — Pending |
| Optimize for researchers | The user prioritized academic rigor, definitions, theorems, and derivations over practitioner onboarding | — Pending |
| Use an original book-like visual identity | The user wants stylistic and book-like, but chose own identity rather than close Thinking Machines mimicry | — Pending |
| Include both chapter navigation and graph links | Linear reading supports book-like study; graph links support wiki-style cross-pillar exploration | — Pending |
| Include local static search in v1 | Researchers need to find definitions, theorem statements, glossary entries, and citations quickly | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-13 after initialization*
