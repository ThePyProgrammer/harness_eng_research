# Phase 3: Curated Corpus Chapters and Formal Registry - Research

**Researched:** 2026-05-19  
**Domain:** Static Astro/Starlight formal research content, typed registries, source-grounded academic corpus curation  
**Confidence:** HIGH for existing site integration and corpus inventory; MEDIUM for exact chapter-authoring workload because final prose requires manual source curation. [VERIFIED: codebase]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
## Implementation Decisions

### Chapter Contract
- **D-01:** Every curated pillar chapter must use a full formal contract: problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, citations, and source trail.
- **D-02:** The umbrella framework page should be a unifying opening formal chapter that defines the corpus-wide architecture and explicitly points into each pillar, not merely an executive overview.
- **D-03:** Chapters should include full source-supported derivation walkthroughs where the corpus supports them, using the Phase 2 notebook-style derivation treatment.
- **D-04:** Chapter prose should use an academic explainer style: rigorous but readable research prose that defines terms, explains why the math matters, and avoids oversimplifying claims.

### Formal Registry
- **D-05:** Formal objects should be authored structured-data-first: maintain a typed registry/data source for definitions, theorem-like claims, citations, concepts, IDs, source paths, and owning pages, then render pages and indexes from it.
- **D-06:** Formal object anchors must use semantic stable IDs such as `reliability.compound-error-bound`, including owner plus concept or claim name and remaining stable across page wording changes.
- **D-07:** The registry should model a broad formal set: definitions, assumptions, theorems, propositions, lemmas, corollaries, equations/derivations, citations, glossary concepts, and source trails.
- **D-08:** Registry validation should be strict in Phase 3. Build or validation should fail for duplicate IDs, missing source paths, invalid owner IDs, broken anchors, missing required fields, or relation targets that Phase 3 owns.

### Source Grounding
- **D-09:** Curated chapters may use canonical papers as primary evidence and pillar-local notes/research/reviews plus science synthesis as supporting context when clearly labeled.
- **D-10:** Source trails should be visible inline and at section level: each formal block and major section shows source links, with a chapter-level source trail summarizing canonical and supporting inputs.
- **D-11:** When the canonical paper is thin or ambiguous, supporting notes/research/reviews may fill the section as long as the page labels the material as supporting rather than canonical.
- **D-12:** Source trails must explicitly label source tiers such as canonical, supporting research, synthesis/review, and provenance material so readers know what kind of evidence backs each passage.

### Glossary Concepts
- **D-13:** Glossary/concept entries should normalize recurring cross-corpus concepts across the umbrella and pillars, with aliases, notation, owning pillars, short definitions, and links to formal objects.
- **D-14:** Each glossary/concept entry should be a rich concept card with term, aliases, notation, owning pillar(s), concise definition, source tier links, related formal objects, and related concepts.
- **D-15:** Phase 3 should include simple static reciprocal links between concepts, chapters, and formal objects; graph views and advanced traversal remain Phase 4 scope.
- **D-16:** Concepts that appear under different names across papers should use one canonical glossary term, preserve all aliases, note owning/source contexts, and link aliases back to the canonical concept.

### Claude's Discretion
- No selected area was delegated to Claude discretion. Planner may choose implementation mechanics, but the product decisions above are locked.

### Deferred Ideas (OUT OF SCOPE)
## Deferred Ideas

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FORM-01 | User can read a curated umbrella framework page grounded in `science/paper/` | Use `corpusEntries` owner `umbrella`, `science/paper/science.tex`, `science/paper/science.pdf`, and `science/paper/science.bib` as the canonical source trail for `/corpus/umbrella/`. [VERIFIED: codebase] |
| FORM-02 | User can read curated chapter pages for all twelve pillars | `corpusEntries` contains the umbrella plus twelve pillar entries and `getStaticPaths()` already generates `/corpus/[slug]/` pages from them. [VERIFIED: codebase] |
| FORM-03 | Each pillar chapter includes the pillar problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, and source trail | Implement a typed chapter contract and validation gate so each non-umbrella entry has all required section data before publishing. [VERIFIED: codebase] |
| FORM-04 | User can identify formal definitions through consistent anchorable definition blocks | Phase 2 already provides `DefinitionBlock.astro` with an `id`, visible stable ID metadata, owner metadata, and source-trail slot. [VERIFIED: codebase] |
| FORM-05 | User can identify theorems, propositions, lemmas, assumptions, and similar formal claims through consistent anchorable theorem-like blocks | Phase 2 provides `TheoremBlock.astro`, but Phase 3 should extend it with a `kind` enum so the label is not always generic `Claim`. [VERIFIED: codebase] |
| FORM-06 | User can inspect derivation walkthroughs or derivation sections where the canonical corpus supports them | Phase 2 provides `DerivationWalkthrough.astro` with notebook-style prose/math/code cells, and canonical TeX files contain equations and proofs that can seed source-supported walkthroughs. [VERIFIED: codebase] |
| FORM-07 | User can see citation references and bibliography entries in readable academic form | Phase 2 provides `CitationRef.astro`; every `corpusEntries` item currently has a bibliography path. [VERIFIED: codebase] |
| FORM-08 | User can follow a citation or formal block back to the canonical source file, PDF, or supporting source trail | `SourceTrail.astro` renders canonical `.tex`, PDF, bibliography, source status, material kind, locator, and note rows. [VERIFIED: codebase] |
| FORM-09 | User can browse a glossary/concept index that normalizes recurring terms, aliases, notation, and owning pillars | Add a typed concept registry and generated `/concepts/` or `/glossary/` static index from registry data. [ASSUMED] |
| FORM-10 | User can browse a formal object registry or equivalent generated index of definitions, theorem-like claims, citations, and concepts | Add typed formal-object registry data plus generated registry pages and validation. [ASSUMED] |
</phase_requirements>

## Summary

Phase 3 should not add a new runtime or CMS; it should expand the existing static Astro/Starlight site under `site/` by adding structured TypeScript registry data, strict validation, and generated static pages. [VERIFIED: codebase] The existing implementation already has Bun scripts for `validate`, `build`, `index`, and `test`, static Astro output, Starlight integration, KaTeX math rendering, a corpus inventory, book-spine ordering, source-detail pages, and reusable formal components. [VERIFIED: codebase]

The key planning move is to separate two artifacts: a typed registry that owns durable IDs, sources, citations, concepts, and relations; and curated chapter content that renders those registry entries into readable academic prose. [ASSUMED] This prevents page prose from becoming the only source of formal-object truth and lets validation catch duplicate IDs, invalid owners, missing paths, broken relation targets, and missing required section data before publication. [VERIFIED: codebase]

The canonical corpus is rich enough for Phase 3: a local audit found formal environments, equations, proofs, and BibTeX files across the umbrella and all twelve pillar papers. [VERIFIED: codebase] The umbrella source alone contains 54 definition environments, 47 theorem environments, 41 proposition environments, 12 corollary environments, 5 observation environments, 3 conjecture environments, 97 equation-like environments, 55 proof environments, and 345 BibTeX entries. [VERIFIED: codebase] The pillar papers collectively contain many more formal environments and bibliographies, but the planner should budget chapter curation work as content-heavy, not merely component wiring. [VERIFIED: codebase]

**Primary recommendation:** Use existing Astro/Starlight/Bun/Zod/Vitest infrastructure, add `site/src/data/formal-registry.schema.ts`, `site/src/data/formal-registry.ts`, `site/src/data/chapters.ts`, `site/src/data/concepts.ts`, a `validate-formal-registry.ts` strict gate integrated into `bun run validate`, and expand `/corpus/[slug].astro` plus generated registry/glossary pages from that data. [VERIFIED: codebase]

## Project Constraints (from CLAUDE.md)

- Canonical content comes from `science/paper/` and `pillars/*/paper/`; website pages must link back to these sources rather than becoming untraceable forks. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- v1 must include the umbrella paper and all twelve pillars; a one-pillar demo is insufficient. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- v1 should include full derivations where the corpus supports them; definitions-only summaries are too shallow. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- v1 should remain static and avoid unnecessary server/runtime complexity. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- Navigation must support both book-chapter reading and wiki/graph-style exploration. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- Search must be local/static with no hosted search service or database for v1. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- Visual identity must be original and book-like, not a close clone. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- Do not treat `archive/` material as active source unless a page explicitly discusses provenance. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- Site work belongs under `site/`; canonical `science/` and `pillars/` files should remain read-only inputs for this phase. [VERIFIED: codebase]
- Before using file-changing tools in normal implementation work, start through a GSD workflow; this research file is itself a GSD planning artifact requested by the orchestrator. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Curated umbrella and pillar chapters | Static frontend pages | Typed data layer | Astro static pages should render the reader experience, while TypeScript data should provide chapter contracts and registry lookups. [VERIFIED: codebase] |
| Formal object registry | Typed data layer | Static frontend pages | Durable IDs, owner IDs, source paths, and relations need schema validation before rendering; pages are projections of the registry. [ASSUMED] |
| Glossary/concept index | Typed data layer | Static frontend pages | Normalized terms, aliases, notation, related objects, and owners should be centralized to avoid inconsistent concept naming. [ASSUMED] |
| Source trails | Static frontend components | Typed data layer | Existing `SourceTrail.astro` and `SourceLinkPanel.astro` render visible provenance; registry data should feed them. [VERIFIED: codebase] |
| Registry validation | Build-time scripts | Type schemas | The existing provenance validator is a Bun/TypeScript CLI invoked by `bun run validate`; formal validation should follow that pattern. [VERIFIED: codebase] |
| Math and derivation rendering | Static frontend components | Markdown/MDX pipeline | `remark-math`, `rehype-katex`, KaTeX CSS, and Phase 2 formal components already provide math/formal rendering. [VERIFIED: codebase] |
| Citation display | Static frontend components | Typed registry | Bibliography paths exist in corpus metadata, but readable citation cards need curated citation entries keyed to BibTeX IDs. [VERIFIED: codebase] |
| Search and graph exploration | Deferred Phase 4 | Static index artifacts | Phase 3 should emit linkable anchors and reciprocal metadata, but advanced search/graph UX is explicitly Phase 4 scope. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md] |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | installed `^6.3.2`; registry latest `6.3.5`, modified 2026-05-18 | Static page generation and dynamic route rendering | Astro uses file-based routes, bracketed dynamic routes, and `getStaticPaths()` for static dynamic pages; the existing site already uses this pattern for `/corpus/[slug]/`. [CITED: https://docs.astro.build/en/guides/routing/] [VERIFIED: npm registry] |
| `@astrojs/starlight` | installed/latest `0.39.2`, modified 2026-05-08 | Docs/book shell, sidebar, MDX docs collection | Starlight sidebar can be configured manually with non-docs links via `label` + `link`, matching the current book-spine sidebar. [CITED: https://starlight.astro.build/guides/sidebar/] [VERIFIED: npm registry] |
| Bun | installed `1.3.12` | Package manager and script runner | Existing `site/package.json` scripts use `bun run validate`, `bun run build`, and `bun run test`. [VERIFIED: codebase] |
| Zod | installed/latest `^4.4.3`, modified 2026-05-04 | Runtime schema validation with TypeScript inference | Astro content collection schemas use Zod, and Zod exposes `parse` and `safeParse` methods for validation. [CITED: https://docs.astro.build/en/guides/content-collections/] [CITED: https://zod.dev/packages/zod] [VERIFIED: npm registry] |
| Vitest | installed/latest `^4.1.6`, modified 2026-05-11 | Unit tests for data contracts and validation scripts | Existing tests use Vitest for corpus schema, book spine, components, index generation, and validation. [VERIFIED: codebase] [VERIFIED: npm registry] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| KaTeX | installed `^0.16.46`; registry latest `0.16.47`, modified 2026-05-16 | Math rendering styles and assets | Use for all inline and block math in chapter prose and derivation walkthroughs. [VERIFIED: codebase] [VERIFIED: npm registry] |
| `remark-math` | installed/latest `^6.0.0`, modified 2023-11-20 | Markdown/MDX math parsing | Keep for MDX/static markdown math parsing. [VERIFIED: codebase] [VERIFIED: npm registry] |
| `rehype-katex` | installed/latest `^7.0.1`, modified 2024-08-19 | HTML math rendering through KaTeX | Keep for current Astro markdown pipeline. [VERIFIED: codebase] [VERIFIED: npm registry] |
| Pagefind | installed/latest `^1.5.2`, modified 2026-04-12 | Local static search index generation | Do not expand search UX in Phase 3, but preserve anchors and content so Phase 4 can index formal objects. [VERIFIED: codebase] [VERIFIED: npm registry] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TypeScript registry modules | YAML/JSON registries | YAML/JSON would be easier for non-programmers but would require separate typing/import handling; existing site already uses TypeScript data plus Zod validation. [VERIFIED: codebase] [ASSUMED] |
| Generated Astro pages from `src/pages` | Starlight docs content collection pages | Content collections are strong for docs content with shared structure, but `/corpus/[slug].astro` already owns corpus-backed dynamic routes and `getStaticPaths()` props. [CITED: https://docs.astro.build/en/guides/content-collections/] [VERIFIED: codebase] |
| Fully automatic LaTeX semantic extraction | Curated registry seeded by source audit | Requirements explicitly exclude full automatic LaTeX semantic extraction as the only pipeline because curated hybrid content is needed for readability and correctness. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |

**Installation:** No new packages are recommended for Phase 3; use the existing site dependencies. [VERIFIED: codebase]

```bash
cd /home/prannayag/harness_eng/site
bun install
```

## Package Legitimacy Audit

> Phase 3 should install no new external packages. [VERIFIED: codebase]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| Astro | npm | existing dependency | not checked | `github.com/withastro/astro` | slopcheck unusable for npm scoped ecosystem in this session | Approved as existing dependency, not newly installed. [VERIFIED: npm registry] |
| `@astrojs/starlight` | npm | existing dependency | not checked | `github.com/withastro/starlight` | slopcheck checked PyPI and falsely reported SLOP because it did not use npm ecosystem | Approved as existing dependency, not newly installed. [VERIFIED: npm registry] |
| Zod | npm | existing dependency | not checked | `github.com/colinhacks/zod` | slopcheck checked PyPI, not npm | Approved as existing dependency, not newly installed. [VERIFIED: npm registry] |
| Vitest | npm | existing dependency | not checked | `github.com/vitest-dev/vitest` | slopcheck checked PyPI and flagged SUS for a Python typosquat concern, not npm | Approved as existing dependency, not newly installed. [VERIFIED: npm registry] |
| Pagefind | npm | existing dependency | not checked | `github.com/Pagefind/pagefind` | slopcheck checked PyPI, not npm | Approved as existing dependency, not newly installed. [VERIFIED: npm registry] |
| KaTeX | npm | existing dependency | not checked | `github.com/KaTeX/KaTeX` | slopcheck checked PyPI, not npm | Approved as existing dependency, not newly installed. [VERIFIED: npm registry] |
| `remark-math` | npm | existing dependency | not checked | `github.com/remarkjs/remark-math` | slopcheck checked PyPI and falsely reported SLOP because it did not use npm ecosystem | Approved as existing dependency, not newly installed. [VERIFIED: npm registry] |
| `rehype-katex` | npm | existing dependency | not checked | `github.com/remarkjs/remark-math` | slopcheck checked PyPI and falsely reported SLOP because it did not use npm ecosystem | Approved as existing dependency, not newly installed. [VERIFIED: npm registry] |

**Packages removed due to slopcheck [SLOP] verdict:** none, because no new packages are recommended and slopcheck checked the wrong ecosystem for npm packages in this session. [VERIFIED: codebase]  
**Packages flagged as suspicious [SUS]:** none for npm; slopcheck's `vitest` SUS result was against PyPI, not npm. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```text
Canonical corpus sources
 science/paper/science.tex + .pdf + .bib
 pillars/*/paper/*.tex + .pdf + .bib
 supporting notes/research/reviews/synthesis
        |
        v
Curated TypeScript data under site/src/data/
 corpus.ts ---------------> owner/source metadata
 formal-registry.ts ------> definitions, claims, derivations, citations, source trails
 concepts.ts -------------> normalized terms, aliases, notation, related objects
 chapters.ts -------------> umbrella/pillar chapter sections and prose blocks
        |
        v
Strict build-time validation
 validate-corpus.ts + validate-formal-registry.ts
 duplicate IDs | invalid owners | missing paths | broken owned relation targets | missing fields
        |
        v
Static Astro rendering
 /corpus/[slug].astro -> chapter pages + formal blocks + source trails + footer nav
 /formal-registry/    -> generated registry index
 /glossary/           -> generated concept cards/index
        |
        v
Static output + local indexes
 bun run build -> validate -> astro build -> generate-local-indexes -> pagefind
```
[VERIFIED: codebase] [ASSUMED]

### Recommended Project Structure

```text
site/src/
├── data/
│   ├── corpus.ts                       # existing owner/source inventory [VERIFIED: codebase]
│   ├── corpus.schema.ts                # existing corpus schema [VERIFIED: codebase]
│   ├── formal-registry.schema.ts       # new Zod schemas for formal objects [ASSUMED]
│   ├── formal-registry.ts              # new registry entries [ASSUMED]
│   ├── concepts.ts                     # new glossary/concept cards [ASSUMED]
│   └── chapters.ts                     # new curated chapter contracts [ASSUMED]
├── components/formal/
│   ├── DefinitionBlock.astro           # existing [VERIFIED: codebase]
│   ├── TheoremBlock.astro              # extend with formal kind enum [VERIFIED: codebase]
│   ├── DerivationWalkthrough.astro     # existing [VERIFIED: codebase]
│   ├── SourceTrail.astro               # existing [VERIFIED: codebase]
│   ├── FormalObjectList.astro          # new registry/list projection [ASSUMED]
│   └── ConceptCard.astro               # new glossary card projection [ASSUMED]
├── pages/
│   ├── corpus/[slug].astro             # expand existing source-detail route [VERIFIED: codebase]
│   ├── formal-registry/index.astro     # new generated formal-object index [ASSUMED]
│   └── glossary/index.astro            # new generated concept index [ASSUMED]
└── scripts/
    ├── validate-corpus.ts              # existing provenance gate [VERIFIED: codebase]
    ├── validate-formal-registry.ts     # new strict registry gate [ASSUMED]
    └── generate-local-indexes.ts       # extend later only if needed [VERIFIED: codebase]
```

### Pattern 1: Registry-First Formal Objects
**What:** Author formal objects in a typed registry with stable semantic IDs, owner IDs, kind, label, statement/body, source trails, citations, related concepts, and related objects. [ASSUMED]  
**When to use:** Use for every definition, theorem-like claim, derivation/equation, citation entry, glossary concept relation, and source trail that must be indexable or deep-linkable. [ASSUMED]  
**Example:**
```typescript
// Source pattern: existing site/src/data/corpus.schema.ts uses Zod parse-time schemas. [VERIFIED: codebase]
export const formalObjectKindSchema = z.enum([
  'definition',
  'assumption',
  'theorem',
  'proposition',
  'lemma',
  'corollary',
  'equation',
  'derivation',
  'citation',
]);

export const formalObjectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+\.[a-z0-9-]+(?:-[a-z0-9]+)*$/),
  ownerId: z.enum(expectedCorpusIds),
  kind: formalObjectKindSchema,
  label: z.string().trim().min(1),
  sourceTrailIds: z.array(z.string()).min(1),
  conceptIds: z.array(z.string()).default([]),
  relatedObjectIds: z.array(z.string()).default([]),
});
```

### Pattern 2: Chapter Contract as Data, Not Page-Local Freeform
**What:** Each chapter should have a data entry with required sections: problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, citations, and source trail. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]  
**When to use:** Use for all twelve pillar pages and for the umbrella page with an adjusted opening-framework contract. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]  
**Example:**
```typescript
// Source pattern: Astro dynamic routes can pass props from getStaticPaths(). [CITED: https://docs.astro.build/en/guides/routing/]
export function getStaticPaths() {
  return corpusEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: {
      entry,
      chapter: getChapterByOwner(entry.id),
      formalObjects: getFormalObjectsByOwner(entry.id),
      concepts: getConceptsByOwner(entry.id),
    },
  }));
}
```

### Pattern 3: Strict Validation Follows Existing Provenance Gate
**What:** Extend the current validation command so `bun run validate` checks both corpus provenance and formal registry integrity. [VERIFIED: codebase]  
**When to use:** Use for duplicate IDs, missing source paths, invalid owner IDs, invalid source tiers, broken anchors, required chapter-section coverage, and relation targets owned by Phase 3. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]  
**Example:**
```typescript
// Source pattern: validate-corpus.ts returns { ok, errors } and CLI exits non-zero on failure. [VERIFIED: codebase]
const result = validateFormalRegistry();
if (!result.ok) {
  for (const error of result.errors) {
    console.error(formatFormalRegistryError(error));
  }
  process.exit(1);
}
```

### Anti-Patterns to Avoid
- **Page prose as the only registry:** If IDs, concepts, and citations live only inside prose, FORM-09/FORM-10 indexes become brittle and validation cannot prove integrity. [ASSUMED]
- **Paper numbering as stable anchors:** TeX section and theorem numbers can change as papers evolve; Phase 3 locked semantic stable IDs such as `reliability.compound-error-bound`. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]
- **Unlabeled supporting material:** Supporting notes/research/reviews may fill thin canonical areas only when clearly labeled as supporting rather than canonical. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]
- **Automatic LaTeX extraction as sole source of content:** The requirements explicitly reject full automatic LaTeX semantic extraction as the only pipeline. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]
- **Breaking existing book-spine routes:** `/corpus/[slug].astro` already uses `corpusEntries`, `bookSpine`, `SourceLinkPanel`, and `BookFooterNav`; expand it instead of replacing the navigation contract. [VERIFIED: codebase]
- **Scope creep into Phase 4:** Search UX, graph views, advanced traversal, and reading-path discovery are later-phase work. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Static route generation | A custom file emitter for chapter HTML | Astro `getStaticPaths()` | Astro static dynamic routes already produce one page per returned params object and pass props through `Astro.props`. [CITED: https://docs.astro.build/en/guides/routing/] |
| Schema validation | Ad hoc string checks scattered through pages | Zod schemas plus validation scripts | Existing project validates corpus data with Zod and central CLI errors. [VERIFIED: codebase] |
| Book/sidebar navigation | Duplicate hard-coded navigation arrays | Existing `bookSpine` / `bookSidebar` | Current sidebar and previous/next navigation already derive from `book-spine.ts`. [VERIFIED: codebase] |
| Math rendering | Custom TeX-to-HTML renderer | Existing `remark-math`, `rehype-katex`, KaTeX CSS | Existing Astro config already wires the math pipeline. [VERIFIED: codebase] |
| Formal block UI | One-off HTML for every definition/theorem | Existing formal components extended by props | Phase 2 built reusable components and fixture tests for formal reading blocks. [VERIFIED: codebase] |
| Source link formatting | Hard-coded repo URLs in every chapter | Shared source-trail component/helper | `SourceTrail.astro` and `SourceLinkPanel.astro` already centralize repository source links and source-status labels. [VERIFIED: codebase] |
| Search implementation | Hosted search or database-backed search | Existing Pagefind/local static output in later Phase 4 | v1 requires local static search with no hosted service. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |

**Key insight:** The hard part is not rendering theorem boxes; it is preserving a single, validated, source-grounded identity for each formal object while exposing that identity through chapters, indexes, citations, glossary cards, and future search/graph metadata. [ASSUMED]

## Common Pitfalls

### Pitfall 1: Confusing the Source Detail Page with a Curated Chapter
**What goes wrong:** The existing `/corpus/[slug].astro` page remains a source-detail shell with a summary and source panel, so FORM-01 through FORM-03 remain unmet. [VERIFIED: codebase]  
**Why it happens:** Phase 2 intentionally deferred full chapter substance to Phase 3. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md]  
**How to avoid:** Require `chapter.section.problem`, `chapter.section.coreModel`, `chapter.section.keyNotation`, `chapter.section.definitions`, `chapter.section.formalClaims`, `chapter.section.derivationContext`, `chapter.section.interpretation`, `chapter.section.relatedPillars`, `chapter.section.citations`, and `chapter.section.sourceTrail` for each pillar. [ASSUMED]  
**Warning signs:** Pages still show “Phase 2 source detail” copy or only the `SourceLinkPanel`. [VERIFIED: codebase]

### Pitfall 2: Registry IDs Drift from Rendered Anchors
**What goes wrong:** The registry says `reliability.compound-error-bound`, but the rendered block uses `id="compound-error"` or a generated slug, breaking FORM-04/FORM-05/FORM-10. [ASSUMED]  
**Why it happens:** Components accept arbitrary `id` strings, and Astro/Starlight heading slug generation is separate from formal block IDs. [VERIFIED: codebase]  
**How to avoid:** Render every formal block ID directly from registry `object.id` and validate uniqueness before build. [ASSUMED]  
**Warning signs:** Page source contains IDs not present in `formal-registry.ts`, or indexes link to headings instead of formal blocks. [ASSUMED]

### Pitfall 3: Treating Supporting Notes as Canonical
**What goes wrong:** A chapter uses pillar-local notes/research/reviews or science synthesis without labeling material kind, making the site look like it has canonical evidence where it does not. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]  
**Why it happens:** Supporting sources are useful for thin or ambiguous canonical sections. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]  
**How to avoid:** Model `sourceTier` as a required enum and render visible material-kind labels inline and at section level. [ASSUMED]  
**Warning signs:** Source trails show only canonical `.tex` even when prose came from `notes/`, `research/`, `reviews/`, or `science/synthesis/`. [ASSUMED]

### Pitfall 4: Underestimating Content Curation Volume
**What goes wrong:** Planning treats Phase 3 as a few component tasks, but the corpus contains hundreds of formal objects and citations that require normalization and selection. [VERIFIED: codebase]  
**Why it happens:** A local audit found 54 definitions and 47 theorems in the umbrella paper alone, plus substantial formal content across each pillar. [VERIFIED: codebase]  
**How to avoid:** Plan in waves: schema/validation first, chapter skeletons for all 13 entries second, then curated formal-object batches by pillar arc. [ASSUMED]  
**Warning signs:** A plan proposes manually editing only one or two pages before claiming all FORM requirements. [ASSUMED]

### Pitfall 5: Premature Advanced Graph/Search Work
**What goes wrong:** The implementation spends Phase 3 effort on graph visualization, interactive traversal, or search ranking instead of formal chapters and registries. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]  
**Why it happens:** Concepts and formal objects naturally create graph-shaped data. [ASSUMED]  
**How to avoid:** Emit simple static reciprocal links and valid relation metadata only; leave graph views and search UX to Phase 4. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]  
**Warning signs:** New runtime graph database, client-side graph layout library, or hosted search dependency appears in Phase 3. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]

## Code Examples

### Expand Corpus Route with Registry Props
```astro
---
// Source pattern: existing /corpus/[slug].astro already maps corpusEntries to getStaticPaths props. [VERIFIED: codebase]
export function getStaticPaths() {
  return corpusEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: {
      entry,
      chapter: getChapterByOwner(entry.id),
      formalObjects: getFormalObjectsByOwner(entry.id),
      concepts: getConceptsByOwner(entry.id),
    },
  }));
}
---
```

### Render Theorem-Like Kinds from Registry
```astro
---
// Source pattern: existing TheoremBlock.astro exposes id, label, owner, and sourceHref. [VERIFIED: codebase]
interface Props {
  id: string;
  kind: 'theorem' | 'proposition' | 'lemma' | 'assumption' | 'corollary' | 'claim';
  label: string;
  owner: string;
  sourceHref: string;
}
const typeLabel = kind[0].toUpperCase() + kind.slice(1);
---
<p class="formal-block__type">{typeLabel}</p>
```

### Validate Owned Relation Targets
```typescript
// Source pattern: existing validate-corpus.ts collects errors instead of throwing immediately. [VERIFIED: codebase]
for (const object of formalObjects) {
  for (const targetId of object.relatedObjectIds) {
    if (!formalObjectIds.has(targetId)) {
      addError(errors, object.id, 'relatedObjectIds', targetId, 'Relation target does not exist', 'Add the target object or remove the relation');
    }
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Source-detail-only pages | Curated chapters with registry-backed formal objects | Phase 3 boundary after Phase 2 | Existing source pages must become substantive chapters without losing source trails. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md] |
| Page-local theorem markup | Structured-data-first formal registry | Locked Phase 3 decision D-05 | Indexes, stable anchors, and validation derive from registry data rather than prose. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md] |
| Implicit source provenance | Visible inline, section-level, and chapter-level source trails | Locked Phase 3 decisions D-10/D-12 | Readers can distinguish canonical, supporting, synthesis/review, and provenance material. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md] |
| Definitions-only summaries | Full formal contracts with derivation/proof context where supported | Locked Phase 3 decisions D-01/D-03 | Plans must budget full chapter curation, not superficial summaries. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md] |
| Full automatic LaTeX semantic extraction | Curated hybrid content grounded in canonical sources | Requirements out-of-scope table | Avoids brittle or incorrect semantic extraction becoming the only content source. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |

**Deprecated/outdated:**
- Treating Phase 2 fixtures as content: `formal-reading-fixture.mdx` is explicitly fixture-only and not final Phase 3 chapter substance. [VERIFIED: codebase]
- Using paper numbering as anchor identity: Phase 3 requires semantic stable IDs that survive wording/numbering changes. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | TypeScript modules are preferable to YAML/JSON for Phase 3 registries. | Standard Stack / Alternatives | If non-programmer editing is a priority, YAML/JSON may be more maintainable. |
| A2 | New files should include `formal-registry.schema.ts`, `formal-registry.ts`, `concepts.ts`, and `chapters.ts`. | Summary / Project Structure | Planner may choose equivalent names, but must preserve typed registry and chapter contracts. |
| A3 | Chapter sections should be data-driven rather than page-local freeform. | Architecture Patterns | If MDX authoring is preferred, validation needs a stronger extraction/checking approach. |
| A4 | The glossary should be generated under `/glossary/` or `/concepts/`. | Phase Requirements / Project Structure | URL choice affects navigation and future search indexes. |
| A5 | The core implementation should proceed in waves: schema/validation, skeletons, then pillar batches. | Common Pitfalls | Planner may split differently, but underestimating curation volume is a delivery risk. |

## Open Questions (RESOLVED)

1. **How complete should the initial formal registry be for each paper?** RESOLVED.
   - Decision: Phase 3 must cover the umbrella and all twelve pillars with chapter-critical formal objects for definitions, theorem-like claims, citations, source trails, glossary concepts, and every source-supported equation/derivation/proof walkthrough needed by D-03 and FORM-06. It does not need to exhaustively transcribe every formal environment in every TeX file.
   - Implementation requirement: Plans must create a derivation coverage matrix keyed by owner and source path. For each owner/source where the corpus supports derivation walkthroughs, the matrix requires notebook-style derivation/equation entries with source trail IDs. For owner/source combinations that do not support a derivation walkthrough, the matrix requires an explicit source-grounded not-supported rationale in `derivationContext` rather than silently omitting derivations.
   - Source basis: D-03 requires full source-supported derivation walkthroughs where supported; FORM-06 requires derivation walkthroughs or derivation sections where the canonical corpus supports them; the project constraint says definitions-only summaries are too shallow.

2. **Should curated chapter prose live in TypeScript strings or MDX-like partials?** RESOLVED.
   - Decision: Phase 3 chapter prose lives in typed TypeScript data modules (`chapters.ts`, `formal-registry.ts`, and `concepts.ts`) as structured strings/arrays, not MDX partials.
   - Implementation requirement: Preserve the parse-at-export pattern from `03-PATTERNS.md`; all registry, chapter, and concept data must validate through Zod-backed parser exports before rendering. If future phases introduce MDX authoring, they must add equivalent extraction/validation first.
   - Source basis: D-05 locks structured-data-first formal objects; the existing `/corpus/[slug].astro` route already renders from TypeScript data; no new authoring pipeline is required for Phase 3.

3. **How should BibTeX entries be converted into readable citation cards?** RESOLVED.
   - Decision: Phase 3 uses manually curated citation display entries in the formal registry, keyed to bibliography/source paths and BibTeX keys from the canonical `.bib` files. It does not add a BibTeX parser or new dependency.
   - Implementation requirement: Citation objects must include readable title/author/year fields where curated, visible source tier labels, bibliography path/source trail IDs, and stable owner-prefixed IDs. Plans must validate citation target/source trail integrity rather than attempting automated BibTeX conversion.
   - Source basis: FORM-07 requires readable academic citation references; FORM-08 requires traceability to source files/PDFs/supporting trails; the Standard Stack recommends no new packages.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Site scripts and package manager | yes | 1.3.12 | Use npm only for metadata inspection; implementation should keep Bun scripts. [VERIFIED: environment] |
| Node.js | Astro/Vitest runtime under Bun ecosystem | yes | v24.14.0 | Bun runtime remains primary for scripts. [VERIFIED: environment] |
| npm | Registry metadata verification | yes | 11.9.0 | Bun lock/install for project work. [VERIFIED: environment] |
| Python 3 | Research audits only; not required by Phase 3 site implementation | yes | 3.14.4 | Not needed for implementation. [VERIFIED: environment] |
| ctx7 CLI | Documentation lookup fallback | no | — | Used official docs through WebFetch. [VERIFIED: environment] |
| graphify knowledge graph | Optional graph context | disabled | — | Proceeded with direct codebase/file research. [VERIFIED: environment] |

**Missing dependencies with no fallback:** none for the recommended Phase 3 implementation. [VERIFIED: environment]  
**Missing dependencies with fallback:** ctx7 CLI is missing, but official documentation was fetched directly. [VERIFIED: environment]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Static site has no accounts or authentication in v1. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V3 Session Management | no | Static site has no sessions in v1. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V4 Access Control | no | Published static content is public; no runtime access-control layer is planned. [ASSUMED] |
| V5 Input Validation | yes | Zod schemas and build-time validation for registry data, owners, paths, relation targets, and source tiers. [VERIFIED: codebase] |
| V6 Cryptography | no | Phase 3 does not introduce cryptography. [ASSUMED] |

### Known Threat Patterns for Static Registry-Driven Content

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Broken provenance link or misleading source tier | Tampering / Repudiation | Validate source paths, require source tiers, render visible source trails. [VERIFIED: codebase] |
| Archive material treated as canonical | Tampering | Reuse canonical path rules and archive exclusion in validation. [VERIFIED: codebase] |
| Duplicate formal IDs hijacking anchors | Spoofing / Tampering | Fail validation on duplicate IDs and render anchors directly from registry IDs. [ASSUMED] |
| Unescaped content injection in rendered prose | Tampering / XSS | Prefer framework-rendered content/data rather than raw `set:html`; avoid custom HTML injection. [ASSUMED] |
| Relation target drift | Tampering / Repudiation | Validate every Phase 3-owned relation target before build. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)
- `/home/prannayag/harness_eng/CLAUDE.md` — project constraints, stack notes, conventions, source-of-truth rules. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md` — locked Phase 3 decisions and scope. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/.planning/REQUIREMENTS.md` — FORM-01 through FORM-10 and out-of-scope exclusions. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/.planning/ROADMAP.md` — Phase 3 goal, dependencies, and later-phase boundaries. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/.planning/STATE.md` — Phase 3 current position and sequencing context. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/site/package.json` — scripts and dependency baseline. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/site/src/data/corpus.ts` and `corpus.schema.ts` — owner/source inventory and schema. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/site/src/pages/corpus/[slug].astro` — existing generated source-detail route. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/site/src/components/formal/*` — existing formal component library. [VERIFIED: codebase]
- `/home/prannayag/harness_eng/science/paper/science.tex` and `pillars/*/paper/*.tex` — canonical formal-object source audit. [VERIFIED: codebase]
- npm registry metadata for Astro, Starlight, Zod, Vitest, Pagefind, KaTeX, `remark-math`, and `rehype-katex`. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)
- https://docs.astro.build/en/guides/routing/ — Astro routing and `getStaticPaths()` behavior. [CITED: https://docs.astro.build/en/guides/routing/]
- https://docs.astro.build/en/guides/content-collections/ — Astro content collections, Zod schema validation, and querying entries. [CITED: https://docs.astro.build/en/guides/content-collections/]
- https://starlight.astro.build/guides/sidebar/ — Starlight sidebar configuration. [CITED: https://starlight.astro.build/guides/sidebar/]
- https://zod.dev/packages/zod — Zod package API and parse/safeParse methods. [CITED: https://zod.dev/packages/zod]

### Tertiary (LOW confidence)
- Assumed implementation mechanics around exact file names, route names, and TypeScript-vs-MDX authoring are resolved above for Phase 3; future changes should preserve equivalent validation if authoring mechanics change. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — package versions and existing usage were verified in `site/package.json`, code, environment probes, npm registry metadata, and official docs. [VERIFIED: codebase]
- Architecture: HIGH for integration points and MEDIUM for exact new module boundaries — current route/data/component patterns are verified, while proposed registry file names are recommendations. [VERIFIED: codebase] [ASSUMED]
- Pitfalls: HIGH for scope/provenance pitfalls and MEDIUM for authoring-format risks — scope and provenance are locked in planning docs, while exact content authoring ergonomics need implementation feedback. [VERIFIED: codebase] [ASSUMED]

**Research date:** 2026-05-19  
**Valid until:** 2026-06-18 for existing project integration; re-check npm registry versions before any dependency changes. [ASSUMED]
