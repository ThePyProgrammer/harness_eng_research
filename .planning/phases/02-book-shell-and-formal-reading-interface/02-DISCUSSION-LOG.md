# Phase 2: Book Shell and Formal Reading Interface - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18T04:46:13Z
**Phase:** 2-Book Shell and Formal Reading Interface
**Areas discussed:** Homepage framing, Book navigation, Visual identity, Formal blocks

---

## Homepage Framing

### First-screen emphasis

| Option | Description | Selected |
|--------|-------------|----------|
| Orient fast | Lead with a concise explanation of what the corpus is, then immediately show the book spine and source-grounded structure. Recommended because Phase 2 needs clarity before Phase 3 content scaling. | |
| Make a thesis | Open like an editorial manifesto: a strong argument for harness architecture as a research field before showing navigation. | |
| Show the map | Lead with the umbrella-plus-twelve-pillar corpus map, making the site feel like an atlas from the first screen. | ✓ |
| You decide | Let Claude choose the homepage emphasis based on the roadmap, existing Starlight baseline, and researcher audience. | |

**User's choice:** Show the map
**Notes:** Homepage should be visually map-led rather than text-led.

### Map form

| Option | Description | Selected |
|--------|-------------|----------|
| Pillar constellation | Umbrella framework in the center, twelve pillars around it, with short labels and links. Recommended for a visual research atlas feel. | ✓ |
| Book spine map | A linear chapter spine that visually shows overview → umbrella → pillars, prioritizing readable progression over network-like structure. | |
| System diagram | A layered architecture diagram showing how concepts, pillars, formal objects, citations, and source trails relate. | |
| You decide | Let Claude choose the map form that best fits Phase 2 and leaves richer graph exploration for Phase 4. | |

**User's choice:** Pillar constellation
**Notes:** The homepage map should align with the scholarly-atlas direction.

### Pillar click target

| Option | Description | Selected |
|--------|-------------|----------|
| Chapter shell | Go to a dedicated pillar chapter shell with summary, source links, provenance treatment, and room for formal content. Recommended because BOOK-02/05 need pillar navigation before Phase 3 fills content. | |
| Inventory detail | Go to the existing inventory-style source metadata view, keeping Phase 2 mostly structural. | ✓ |
| Inline expand | Expand the constellation node in place with a summary and links, minimizing page count but weakening the book-spine feel. | |
| You decide | Let Claude choose the target behavior that best supports the linear book interface. | |

**User's choice:** Inventory detail
**Notes:** Phase 2 should not pretend full chapter content exists yet.

### Supporting content

| Option | Description | Selected |
|--------|-------------|----------|
| Provenance strip | Add a compact promise of source-grounding: canonical sources, PDFs, bibliography/source trails, and archive distinction. Recommended because it reinforces Phase 2 provenance UI without duplicating Phase 1. | |
| Intro essay | Pair the map with a richer editorial introduction explaining why the corpus matters before users browse. | ✓ |
| Reader cards | Show a few entry cards such as start with umbrella, browse pillars, inspect sources, and view inventory. | |
| You decide | Let Claude pick the supporting homepage content that best complements a map-led first screen. | |

**User's choice:** Intro essay
**Notes:** The map should be paired with explanatory editorial framing.

---

## Book Navigation

### Main spine priority

| Option | Description | Selected |
|--------|-------------|----------|
| Overview to pillars | A clear linear path: homepage/overview → umbrella framework → twelve pillars. Recommended because it directly satisfies BOOK-02 and fits the existing Starlight sidebar. | ✓ |
| Source categories | Navigation grouped by canonical, supporting, synthesis/review, and provenance material, foregrounding source type over chapter order. | |
| Research questions | Navigation organized around reader questions such as build harnesses, scaling agents, cost/latency, and hardening; note that full reading paths are Phase 4. | |
| You decide | Let Claude choose a navigation spine that best fits Phase 2 scope. | |

**User's choice:** Overview to pillars
**Notes:** Linear book reading stays centered on overview, umbrella, and pillars.

### Pillar order

| Option | Description | Selected |
|--------|-------------|----------|
| Inventory order | Use the existing explicit corpus order from `site/src/data/corpus.ts`: Abstraction through Accretion. Recommended to avoid creating a second ordering source. | |
| Conceptual arc | Reorder pillars into a narrative arc from abstraction/information through execution, production, economics, and degradation. | ✓ |
| Alphabetical | Make lookup predictable, but weaken the book-like reading sequence. | |
| You decide | Let Claude choose the order that best supports both source consistency and reader comprehension. | |

**User's choice:** Conceptual arc
**Notes:** Planning must define the conceptual arc explicitly.

### Phase 2 pillar pages

| Option | Description | Selected |
|--------|-------------|----------|
| Source detail page | A lightweight page per pillar with summary, canonical PDF/source links, source-status treatment, and previous/next navigation. Recommended because it reconciles inventory-detail clicks with BOOK-02/03/05. | ✓ |
| Empty chapter shell | Create visible chapter placeholders with headings and navigation only, leaving most substance for Phase 3. | |
| Inventory anchors | Keep one inventory page and deep-link to each entry, minimizing pages but making previous/next navigation weaker. | |
| You decide | Let Claude choose the minimal page shape that satisfies Phase 2 without stealing Phase 3 content work. | |

**User's choice:** Source detail page
**Notes:** Source-detail pages should be expandable into full chapters later.

### Previous/next prominence

| Option | Description | Selected |
|--------|-------------|----------|
| Always visible | Show previous/next at the bottom of every overview, umbrella, and pillar page, with sidebar mirroring the same order. Recommended for a book-like reading experience. | |
| Subtle footer | Keep previous/next lightweight and rely mainly on the sidebar. | ✓ |
| Top and bottom | Expose previous/next near the header and footer for long academic pages, but risks visual noise in Phase 2 shells. | |
| You decide | Let Claude pick the prominence based on Starlight conventions and accessibility. | |

**User's choice:** Subtle footer
**Notes:** Sidebar carries primary navigation; previous/next is supporting structure.

---

## Visual Identity

### Direction

| Option | Description | Selected |
|--------|-------------|----------|
| Scholarly atlas | Warm paper tones, serif-led prose, precise diagrams, subdued accent colors, and map-like navigation. Recommended because your homepage leads with a pillar constellation. | ✓ |
| Modern lab notebook | Clean technical UI with gridded notes, marginalia, and restrained sans/mono typography. | |
| Editorial monograph | More literary book feel: strong chapter openers, large type, generous whitespace, and essay-like presentation. | |
| You decide | Let Claude choose the visual direction from the project constraints and previous decisions. | |

**User's choice:** Scholarly atlas
**Notes:** The visual system should be original and map-like.

### Decoration level

| Option | Description | Selected |
|--------|-------------|----------|
| Restrained | Mostly typography, spacing, linework, source labels, and one accent palette. Recommended for academic credibility and accessibility. | |
| Moderate | Add visible atlas motifs: constellation lines, coordinate-like dividers, marginal labels, and section ornaments. | |
| Rich | Make the site visually distinctive with dense cartographic textures and bespoke chapter treatments, at higher implementation cost. | ✓ |
| You decide | Let Claude choose the level of ornament that best balances polish with Phase 2 scope. | |

**User's choice:** Rich
**Notes:** Rich decorative treatment is desired, subject to readability.

### Typography balance

| Option | Description | Selected |
|--------|-------------|----------|
| Serif prose | Serif for body and headings, sans for navigation/labels, mono for paths/IDs. Recommended because it supports a book-like research feel. | |
| Sans interface | Sans for most UI and prose, serif only for chapter openers; cleaner but less book-like. | ✓ |
| Serif display only | Serif for headings and pull quotes, highly legible sans for dense body text. | |
| You decide | Let Claude pick typography that supports theorem blocks, math, citations, and narrow screens. | |

**User's choice:** Sans interface
**Notes:** The rich atlas identity should not imply serif-heavy body typography.

### Non-negotiable constraint

| Option | Description | Selected |
|--------|-------------|----------|
| Readable first | Decorative cartographic effects must never reduce contrast, focus visibility, math legibility, or narrow-screen readability. Recommended for DESIGN-03/04. | ✓ |
| Motion minimal | Avoid animation except subtle hover/focus transitions, preserving reduced-motion friendliness. | |
| Print neutral | Make decorative treatments easy to suppress in print/citation contexts, even though full print styling is Phase 5. | |
| You decide | Let Claude decide the hard constraint that best protects accessibility. | |

**User's choice:** Readable first
**Notes:** Accessibility and legibility override ornament.

---

## Formal Blocks

### Deliverable shape

| Option | Description | Selected |
|--------|-------------|----------|
| Component library | Reusable MDX/Astro components for definition, theorem-like claim, derivation, citation, and source trail blocks with sample fixtures. Recommended because Phase 3 can then populate content consistently. | ✓ |
| CSS patterns | Mostly stylesheet classes and examples, faster but less enforceable for later content. | |
| Rendered samples | A polished formal-reading sample page with representative blocks, but not necessarily reusable components. | |
| You decide | Let Claude choose the deliverable shape that best supports downstream content work. | |

**User's choice:** Component library
**Notes:** Phase 2 should produce reusable components, not only static examples.

### Visible metadata

| Option | Description | Selected |
|--------|-------------|----------|
| Label + source | Show block type, stable label/ID, owning pillar/page, and canonical source link. Recommended because source traceability is central and formal registry comes later. | ✓ |
| Minimal label | Only show type and title/number, keeping reading clean but hiding source trail behind the page. | |
| Full provenance | Show type, ID, source file, section/page hints, citation hooks, status, and related objects; richer but risks Phase 3/4 scope creep. | |
| You decide | Let Claude choose metadata that balances rigor and Phase 2 scope. | |

**User's choice:** Label + source
**Notes:** Formal blocks must signal source grounding visibly.

### Derivation layout

| Option | Description | Selected |
|--------|-------------|----------|
| Stepped proof rail | A vertical sequence with step labels, equations, explanatory prose, and source anchors. Recommended for legibility on desktop and narrow screens. | |
| Notebook style | Alternating prose/math cells like a research notebook; friendly but less book-like. | ✓ |
| Compact appendix | Keep derivations dense and collapsible, prioritizing scanning over guided reading. | |
| You decide | Let Claude pick a derivation presentation for academic readability. | |

**User's choice:** Notebook style
**Notes:** Derivation walkthroughs should feel like structured research notebook cells.

### Source trail visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Compact visible | Always show a compact source chip/link, with optional expanded details when available. Recommended for source trust without clutter. | |
| Expandable only | Hide provenance behind a disclosure, cleaner but weaker source-grounding signal. | |
| Always detailed | Show full source trail inline for every block, rigorous but heavy for reading. | ✓ |
| You decide | Let Claude decide the source trail treatment. | |

**User's choice:** Always detailed
**Notes:** Provenance should be visible by default inside formal blocks.

---

## Claude's Discretion

None. The user made concrete selections for all discussed areas.

## Deferred Ideas

None. Discussion stayed within Phase 2 scope.
