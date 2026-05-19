# Phase 3: Curated Corpus Chapters and Formal Registry - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19T06:43:11Z
**Phase:** 3-Curated Corpus Chapters and Formal Registry
**Areas discussed:** Chapter contract, Formal registry, Source grounding, Glossary concepts

---

## Chapter contract

### Minimum chapter shape

| Option | Description | Selected |
|--------|-------------|----------|
| Full formal contract | Every chapter must include problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, citations, and source trail. | ✓ |
| Tiered contract | Require core sections everywhere, but allow lighter derivations or formal-claim sections where the canonical paper is thinner. | |
| Narrative first | Keep chapters readable with flexible sectioning, then include formal objects opportunistically where they fit. | |
| You decide | Let downstream planning define the chapter contract from the roadmap and existing corpus structure. | |

**User's choice:** Full formal contract
**Notes:** The chapter contract should be uniform and rigorous across the pillar set.

### Umbrella page role

| Option | Description | Selected |
|--------|-------------|----------|
| Unifying chapter | Treat the umbrella as the opening formal chapter that defines the corpus-wide architecture and explicitly points into each pillar. | ✓ |
| Executive overview | Make the umbrella page more synthetic and shorter, with the formal depth concentrated in pillar chapters. | |
| Equal chapter | Treat the umbrella exactly like a thirteenth chapter with the same contract and depth as each pillar. | |
| You decide | Let downstream planning choose the umbrella treatment while preserving source grounding. | |

**User's choice:** Unifying chapter
**Notes:** The umbrella should introduce and connect the corpus-wide architecture.

### Derivation depth

| Option | Description | Selected |
|--------|-------------|----------|
| Show full walkthroughs | Include full source-supported derivation walkthroughs where the corpus supports them, using Phase 2's notebook-style derivation treatment. | ✓ |
| Explain only key steps | Summarize the mathematical argument and link to source/PDF for complete details. | |
| Appendix-style depth | Keep main chapter lighter and place detailed derivations at the bottom of each page. | |
| You decide | Let planners decide derivation depth per chapter based on corpus material. | |

**User's choice:** Show full walkthroughs
**Notes:** Full derivation detail matters where source support exists.

### Prose style

| Option | Description | Selected |
|--------|-------------|----------|
| Academic explainer | Rigorous but readable research prose that defines terms, explains why the math matters, and avoids oversimplifying claims. | ✓ |
| Paper-like formal | Stay close to the canonical paper voice with dense theorem/proof structure and minimal explanatory smoothing. | |
| Wiki concise | Short reference-style sections optimized for scanning and lookup rather than long-form reading. | |
| You decide | Let downstream planning tune prose style while keeping the full formal contract. | |

**User's choice:** Academic explainer
**Notes:** The content should stay rigorous while being readable as a research chapter.

---

## Formal registry

### Authoring model

| Option | Description | Selected |
|--------|-------------|----------|
| Structured data first | Maintain a typed registry/data source for definitions, theorem-like claims, citations, concepts, IDs, source paths, and owning pages, then render pages/indexes from it. | ✓ |
| MDX blocks first | Author formal objects inline in MDX chapters with component props, then derive the registry from page content where practical. | |
| Generated extraction | Try to parse LaTeX/corpus sources into registry entries automatically, with curation only as cleanup. | |
| You decide | Let downstream research choose the authoring model. | |

**User's choice:** Structured data first
**Notes:** Registry data should be a primary artifact, not an afterthought extracted from prose.

### ID style

| Option | Description | Selected |
|--------|-------------|----------|
| Semantic stable IDs | Human-readable IDs like `reliability.compound-error-bound` that include owner plus concept/claim name and remain stable across page wording changes. | ✓ |
| Numbered IDs | Use paper-like numbering such as Definition 3.1 or Theorem 7.2 as the primary ID. | |
| Source-line IDs | Anchor IDs to source path and approximate LaTeX location, prioritizing provenance over readability. | |
| You decide | Let downstream planning choose ID conventions while ensuring stable anchors. | |

**User's choice:** Semantic stable IDs
**Notes:** IDs should be durable targets for later search and graph work.

### Object types

| Option | Description | Selected |
|--------|-------------|----------|
| Broad formal set | Definitions, assumptions, theorems, propositions, lemmas, corollaries, equations/derivations, citations, glossary concepts, and source trails. | ✓ |
| Core claims only | Model definitions, theorem-like claims, citations, and concepts; leave equations/derivations mostly page-local. | |
| Minimal index set | Only model definitions, theorem-like claims, and citations needed by the required registry. | |
| You decide | Let downstream planning decide object types from corpus inspection. | |

**User's choice:** Broad formal set
**Notes:** Phase 3 registry should be broad enough to support formal pages, glossary, and later discovery.

### Validation strictness

| Option | Description | Selected |
|--------|-------------|----------|
| Fail on broken registry | Build/validate should fail for duplicate IDs, missing source paths, invalid owner IDs, broken anchors, missing required fields, or relation targets that Phase 3 owns. | ✓ |
| Warn first | Emit warnings for incomplete registry entries during Phase 3, then harden in Phase 5. | |
| Manual review | Keep registry validation light and rely on human review of curated chapters. | |
| You decide | Let planner choose validation strictness based on implementation cost. | |

**User's choice:** Fail on broken registry
**Notes:** Registry validation should follow the existing hard provenance-gate pattern.

---

## Source grounding

### Allowed source tiers

| Option | Description | Selected |
|--------|-------------|----------|
| Canonical plus support | Canonical papers are primary, with pillar-local notes/research/reviews and science synthesis allowed as supporting context when clearly labeled. | ✓ |
| Canonical only | Only use `science/paper/` and `pillars/*/paper/` for chapter claims; supporting material can be linked but not used to explain. | |
| All non-archive corpus | Use any non-archive repository material as evidence if it seems relevant. | |
| You decide | Let downstream research decide allowed source tiers. | |

**User's choice:** Canonical plus support
**Notes:** Canonical material remains primary, but supporting corpus work can fill context if labeled.

### Source trail visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Inline and section trails | Each formal block and major section shows visible source links, with a chapter-level source trail summarizing canonical and supporting inputs. | ✓ |
| Chapter-level only | Keep individual sections clean and rely on a detailed source trail panel at the bottom or side of each chapter. | |
| Formal objects only | Show source links on definitions/theorems/derivations/citations, but not every prose section. | |
| You decide | Let downstream planning balance source density and readability. | |

**User's choice:** Inline and section trails
**Notes:** Source visibility should be granular, not hidden only in a bottom panel.

### Thin canonical sections

| Option | Description | Selected |
|--------|-------------|----------|
| Mark evidence gaps | Keep the full chapter contract, but explicitly mark unsupported or thin sections as source gaps rather than inventing missing rigor. | |
| Use support to fill | Use notes/research/reviews to fill gaps as long as they are labeled as supporting rather than canonical. | ✓ |
| Omit weak sections | Skip required-looking sections when source support is weak, even if that makes chapters uneven. | |
| You decide | Let downstream agents decide case by case. | |

**User's choice:** Use support to fill
**Notes:** Supporting material can complete the chapter contract, but must not masquerade as canonical paper evidence.

### Source tier labels

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit source tier labels | Label canonical, supporting research, synthesis/review, and provenance material directly in the source trail so readers know what kind of evidence backs each passage. | ✓ |
| Footnote labels | Keep labels out of the main flow and explain source tier in footnotes or source notes. | |
| One combined trail | List all source files together without tier labels to reduce visual noise. | |
| You decide | Let downstream planning decide the visual treatment. | |

**User's choice:** Explicit source tier labels
**Notes:** Readers should see what kind of evidence backs a passage or object.

---

## Glossary concepts

### Concept scope

| Option | Description | Selected |
|--------|-------------|----------|
| Cross-corpus concepts | Normalize recurring concepts across the umbrella and pillars, with aliases, notation, owning pillars, short definitions, and links to formal objects. | ✓ |
| Per-pillar terms | Keep concepts mostly owned by individual pillar chapters, with limited cross-pillar normalization. | |
| Notation focused | Prioritize symbols, variables, and mathematical notation over broader prose concepts. | |
| You decide | Let downstream planning infer concept scope from corpus inspection. | |

**User's choice:** Cross-corpus concepts
**Notes:** Concepts should span the corpus rather than remain isolated per chapter.

### Entry contract

| Option | Description | Selected |
|--------|-------------|----------|
| Rich concept cards | Term, aliases, notation, owning pillar(s), concise definition, source tier links, related formal objects, and related concepts. | ✓ |
| Lean glossary | Term, aliases, owning pillar, and concise definition only; leave relationships to Phase 4. | |
| Formal-only entries | Only include terms that correspond to a definition, theorem, citation, or explicit notation in the registry. | |
| You decide | Let downstream planning decide the entry contract. | |

**User's choice:** Rich concept cards
**Notes:** Concept entries should be useful research objects, not just term definitions.

### Pre-graph cross-linking

| Option | Description | Selected |
|--------|-------------|----------|
| Static reciprocal links | Add simple static links both ways between concepts, chapters, and formal objects; reserve graph views and advanced traversal for Phase 4. | ✓ |
| Concept pages only | Link from concept entries to chapters/formal objects, but do not add many backlinks inside chapter pages yet. | |
| Minimal links | Keep concept entries browsable but avoid relationship work until Phase 4. | |
| You decide | Let downstream planning choose the cross-link density. | |

**User's choice:** Static reciprocal links
**Notes:** Phase 3 should create enough static relationships for Phase 4 to build on without implementing graph views.

### Alias handling

| Option | Description | Selected |
|--------|-------------|----------|
| Canonical term plus aliases | Choose one canonical glossary term, preserve all aliases, note owning/source contexts, and link aliases back to the canonical concept. | ✓ |
| Keep separate entries | Avoid over-normalizing; keep paper-specific terms separate unless the source explicitly equates them. | |
| Merge aggressively | Normalize similar terms into one entry whenever they appear conceptually related, even if terminology differs. | |
| You decide | Let downstream agents normalize aliases case by case. | |

**User's choice:** Canonical term plus aliases
**Notes:** Alias normalization should preserve source terminology while giving readers one canonical lookup target.

---

## Claude's Discretion

None.

## Deferred Ideas

None — discussion stayed within phase scope.
