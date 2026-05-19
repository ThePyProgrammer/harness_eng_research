# Phase 4: Local Discovery and Cross-Corpus Exploration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19T09:27:07Z
**Phase:** 4-Local Discovery and Cross-Corpus Exploration
**Areas discussed:** Reading paths, Search behavior, Related-link semantics, Graph context view

---

## Reading paths

### Primary feel

| Option | Description | Selected |
|--------|-------------|----------|
| Guided essay | Each path is a short narrative route with why this sequence matters, then ordered links into chapters and formal objects. | |
| Route map | A visual/map-like path emphasizing the scholarly atlas identity, with compact annotations for each stop. | ✓ |
| Compact index | A minimal list of links grouped by topic; fastest to build, but weaker as a research guide. | |
| You decide | Let the planner choose the presentation that best fits the existing Phase 2/3 components. | |

**User's choice:** Route map
**Notes:** Reading paths should feel like atlas-style route maps.

### Route structure

| Option | Description | Selected |
|--------|-------------|----------|
| Recommended route | One ordered path per theme, with optional side trails. | |
| Branching map | A hub-and-spoke or branching graph where readers choose their own traversal. | ✓ |
| Depth tiers | Separate quick, standard, and deep routes for each theme. | |
| You decide | Let the planner choose based on the final Phase 3 registry and available relationship data. | |

**User's choice:** Branching map
**Notes:** Paths should support exploratory branching rather than a single fixed sequence.

### Node detail

| Option | Description | Selected |
|--------|-------------|----------|
| Why + link | Show why the stop matters plus a direct link to the chapter, concept, or formal object anchor. | ✓ |
| Dense preview | Show title, type, short summary, source tier, related objects, and link. | |
| Link only | Keep nodes compact and rely on destination pages for explanation. | |
| You decide | Let the planner balance density and visual clarity with the Phase 2 atlas style. | |

**User's choice:** Why + link
**Notes:** Keep map nodes lightweight and useful.

### Authoring model

| Option | Description | Selected |
|--------|-------------|----------|
| Curated data | Author each required path as structured data, referencing registry IDs and links. | ✓ |
| Generated first | Generate paths from relationship metadata. | |
| Hybrid | Curate top-level path structure, then fill related objects from metadata. | |
| You decide | Let the planner choose based on Phase 3 data shape. | |

**User's choice:** Curated data
**Notes:** Preserve editorial intent for the five required paths.

---

## Search behavior

### Optimization target

| Option | Description | Selected |
|--------|-------------|----------|
| Balanced discovery | Blend pages, formal objects, concepts, citations, and reading paths so search works for both exact lookup and exploration. | ✓ |
| Formal lookup | Prioritize definitions, theorem-like claims, equations, and stable anchors over broader page matches. | |
| Concept discovery | Prioritize glossary/concept matches, aliases, notation, and related pillars for exploratory research. | |
| Citation lookup | Prioritize bibliography/citation search and where-cited anchors. | |

**User's choice:** Balanced discovery
**Notes:** Search should work for both exact and exploratory use.

### Result organization

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped types | Group results by Pages, Formal Objects, Concepts, Citations, and Reading Paths, with best matches surfaced first in each group. | ✓ |
| Single ranked list | One relevance-ranked stream across all result types. | |
| Primary + filters | Show a ranked list with type filters/tabs. | |
| You decide | Let the planner choose based on Pagefind/Astro constraints and available index metadata. | |

**User's choice:** Grouped types
**Notes:** Preserve type distinctions in results.

### Formal-object result detail

| Option | Description | Selected |
|--------|-------------|----------|
| Type + snippet | Show object type, stable ID/title, owner chapter/pillar, matched snippet, and direct anchor link. | ✓ |
| Dense card | Show type, ID, statement summary, source tier, related concepts, and owner. | |
| Minimal hit | Show title and destination only. | |
| You decide | Let planner pick result density after seeing Phase 3 registry fields. | |

**User's choice:** Type + snippet
**Notes:** Formal-object hits need enough context before click-through.

### Search quality checks

| Option | Description | Selected |
|--------|-------------|----------|
| Expected anchors | Fixtures assert representative queries return specific pages or formal-object anchors for each required result class. | ✓ |
| Smoke queries | Only assert that representative queries return any result. | |
| Manual checklist | Document examples for human verification without automated checks. | |
| You decide | Let planner set exact test depth based on index tooling. | |

**User's choice:** Expected anchors
**Notes:** QUAL-03 should be tested with expected pages/anchors.

---

## Related-link semantics

### Relationship coverage

| Option | Description | Selected |
|--------|-------------|----------|
| Conceptual links | Emphasizes defines, uses, extends, contrasts, supports, and applies-to across concepts/formal objects/pillars. | |
| Source links | Prioritize cited-by, sourced-from, appears-in, and bibliography relationships for provenance traversal. | |
| Learning links | Prioritize prerequisite, next, related-reading, and deeper-dive relationships for reader journeys. | |
| Full taxonomy | Model conceptual, source/provenance, and learning relationships. | ✓ |

**User's choice:** Full taxonomy
**Notes:** Phase 4 should cover all major relation families.

### Taxonomy control

| Option | Description | Selected |
|--------|-------------|----------|
| Closed set | A fixed set of allowed relation types validated at build time, with clear labels and directionality. | |
| Extensible set | Start with core relation types but allow new labels when authored. | ✓ |
| Grouped families | Validate families like conceptual/source/learning, while allowing subtypes. | |
| You decide | Let the planner pick the validation model. | |

**User's choice:** Extensible set
**Notes:** Use a defined starting taxonomy but allow validated growth.

### Page presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Typed sections | Grouped sections like Builds on, Contrasts with, Cited by, Next readings, each using readable labels from the taxonomy. | ✓ |
| Inline chips | Compact relation chips near each object or section. | |
| Context panel | A side or below-content panel for all local relationships. | |
| You decide | Let planner choose per page type. | |

**User's choice:** Typed sections
**Notes:** Related links should be readable sections, not only chips.

### Validation depth

| Option | Description | Selected |
|--------|-------------|----------|
| Targets + types | Validate relation type definitions, source IDs, target IDs, directionality, and display labels. | ✓ |
| Targets only | Only fail for missing target IDs. | |
| Strict reciprocal | Require every relationship to define or generate reciprocal backlinks. | |
| You decide | Let planner choose exact validation depth. | |

**User's choice:** Targets + types
**Notes:** Validation should prevent both broken targets and relation taxonomy drift.

---

## Graph context view

### v1 exposure

| Option | Description | Selected |
|--------|-------------|----------|
| Local neighborhoods | Per-page or per-object neighborhoods showing immediate related concepts, formal objects, pillars, citations, and paths. | |
| Global overview | A corpus-wide static graph overview. | |
| Data artifact | Generate JSON graph data for inspection and future UI, with minimal reader-facing visualization. | |
| Both local/global | Expose local neighborhoods plus a high-level global overview. | ✓ |

**User's choice:** Both local/global
**Notes:** v1 should include both reader-facing local context and a high-level corpus overview.

### Interactivity level

| Option | Description | Selected |
|--------|-------------|----------|
| Static + links | Generated static diagrams/HTML with clickable nodes and links, no runtime database or heavy client graph engine. | ✓ |
| Light filtering | Static data with client-side type filters and highlighting. | |
| Data-first | Primarily expose graph JSON plus simple rendered summaries. | |
| You decide | Let planner choose based on static-site constraints and graph size. | |

**User's choice:** Static + links
**Notes:** Keep graph surfaces static and link-driven.

### Local neighborhood emphasis

| Option | Description | Selected |
|--------|-------------|----------|
| Typed proximity | Show the current node centered, with nearby nodes grouped or styled by type and relationship labels visible enough to explain why they connect. | |
| Path discovery | Emphasize next readings and route-map branches over formal relation labels. | ✓ |
| Source trail | Emphasize source/citation/provenance edges over conceptual exploration. | |
| You decide | Let planner choose based on page layout and relationship data. | |

**User's choice:** Path discovery
**Notes:** Local graph views should help readers decide what to visit next.

### Graph validation

| Option | Description | Selected |
|--------|-------------|----------|
| IDs + render | Validate node IDs, relation targets/types, required node labels, and that generated graph artifacts/pages can render. | ✓ |
| IDs only | Only validate target IDs and relation existence. | |
| Full snapshots | Snapshot generated graph outputs. | |
| You decide | Let planner choose validation depth. | |

**User's choice:** IDs + render
**Notes:** Validation should cover metadata integrity and generated surface renderability.

---

## Claude's Discretion

None.

## Deferred Ideas

None — discussion stayed within phase scope.
