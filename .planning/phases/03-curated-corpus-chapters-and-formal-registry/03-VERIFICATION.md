---
phase: 03-curated-corpus-chapters-and-formal-registry
verified: 2026-05-19T10:14:53Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Read representative curated chapters against their canonical TeX/PDF sources."
    expected: "The umbrella and selected pillar chapters accurately preserve canonical claims, derivation meaning, citation intent, and source-tier labeling without overstating support."
    why_human: "Automated checks prove coverage, source paths, anchors, and rendering, but cannot judge scholarly correctness of the curated prose against the papers."
---

# Phase 3: Curated Corpus Chapters and Formal Registry Verification Report

**Phase Goal:** Researchers can read the source-grounded umbrella framework and all twelve pillar chapters with consistent formal objects, derivations, citations, glossary concepts, and source trails.
**Verified:** 2026-05-19T10:14:53Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can read a curated umbrella framework page and curated chapter pages for all twelve pillars grounded in canonical corpus sources. | VERIFIED | `site/src/data/chapters.ts` exports 13 parsed chapter records; `bun run build` generated `/corpus/umbrella/` plus all twelve pillar pages including `/corpus/accretion/`; chapter source trails are built from canonical `corpusEntries` paths. |
| 2 | Each pillar chapter presents the pillar problem, core model, key notation, definitions, formal claims, derivation/proof context, interpretation, related pillars, and source trail. | VERIFIED | `chapterSeeds` in `site/src/data/chapters.ts` contains all 12 pillar owners and maps every seed to the required ten `sections`; `site/src/data/formal-registry.test.ts` asserts all `requiredChapterSections` for all expected owners. |
| 3 | User can deep-link to consistent anchorable definition blocks and theorem-like blocks for theorems, propositions, lemmas, assumptions, and related formal claims. | VERIFIED | `site/src/pages/corpus/[slug].astro` renders formal object IDs directly into `DefinitionBlock`, `TheoremBlock`, and `DerivationWalkthrough`; `formalObjectIdSchema` accepts owner-prefixed semantic IDs and rejects paper/line-number IDs. |
| 4 | User can inspect source-supported derivation walkthroughs or derivation sections and follow citations or formal blocks back to source files, PDFs, bibliography entries, and supporting source trails. | VERIFIED | `derivationCoverageByOwner` covers every expected owner; `validateFormalRegistry` requires supported entries to target derivation/equation objects and chapter derivation contexts; `SourceTrail` is rendered for formal blocks and section source lists link to repository paths. |
| 5 | User can browse a glossary/concept index and a formal object registry covering definitions, theorem-like claims, citations, and concepts with normalized terms, aliases, notation, and owning pillars. | VERIFIED | `/formal-registry/index.astro` renders `formalRegistry` grouped by owner/kind with stable anchor links; `/glossary/index.astro` renders `ConceptCard` entries from `conceptRegistry`; tests assert aliases, notation, owners, related formal objects, and related concepts. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `site/src/data/formal-registry.ts` | Registry-first formal objects, citations, source trails, and derivation coverage | VERIFIED | Contains 50 validated formal objects, citation records, canonical source trails, and all-owner derivation matrix. |
| `site/src/data/chapters.ts` | Umbrella plus twelve curated chapter contracts | VERIFIED | Contains `chapterSeeds` for `umbrella` and all twelve pillar owner IDs; parsed by `parseChapterRegistry`. |
| `site/src/data/concepts.ts` | Glossary/concept registry | VERIFIED | Contains canonical concept entries, aliases, notation, owner IDs, reciprocal related concepts, and formal object links. |
| `site/src/pages/corpus/[slug].astro` | Registry-backed static chapter route | VERIFIED | Uses `getStaticPaths`, `getChapterByOwner`, `formalObjectLookup`, and `conceptLookup`; renders required chapter sections, formal blocks, concepts, citations, source panel, and footer nav. |
| `site/src/pages/formal-registry/index.astro` | Formal object registry page | VERIFIED | Renders `Browse formal registry`, groups by corpus owner and formal kind, and uses `FormalObjectList`. |
| `site/src/pages/glossary/index.astro` | Glossary/concept index page | VERIFIED | Renders concept aliases and `ConceptCard` entries from typed registry data. |
| `site/src/scripts/validate-formal-registry.ts` | Strict registry validation gate | VERIFIED | Validates schemas, duplicate IDs, expected owners, source paths, archive canonical misuse, required sections, derivation coverage, and relation targets. |
| `site/src/data/formal-registry.test.ts` | All-owner data coverage tests | VERIFIED | 14 tests include FORM-01 through FORM-10 coverage, D-01 section checks, all-owner derivation matrix checks, and reciprocal concept links. |
| `site/src/scripts/validate-formal-registry.test.ts` | Validation failure regression tests | VERIFIED | Mutated fixtures prove duplicate IDs, invalid owners/statuses, missing paths, archive canonical misuse, broken targets, missing fields, and invalid derivation coverage fail. |
| `site/src/components/formal/formal-components.test.ts` | Reader-facing component/route regression tests | VERIFIED | Verifies route/component source contracts and negative checks against Phase 4 scope creep. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `site/package.json` | `site/src/scripts/validate-formal-registry.ts` | `validate` script chain | WIRED | `bun run build` invoked `bun run validate`, which ran both corpus and formal registry validators successfully. |
| `site/src/pages/corpus/[slug].astro` | `site/src/data/chapters.ts` | `getChapterByOwner(entry.id)` | WIRED | `getStaticPaths()` resolves every corpus entry to a strict chapter record; build generated all 13 routes. |
| `site/src/pages/corpus/[slug].astro` | `site/src/data/formal-registry.ts` | `formalObjectLookup` and `formalObjectIds` | WIRED | Chapter formal object IDs are resolved and rendered as formal blocks with `id={object.id}`. |
| `site/src/pages/corpus/[slug].astro` | `site/src/data/concepts.ts` | `conceptLookup` and `conceptIds` | WIRED | Chapter concept IDs resolve to `ConceptCard` renderings. |
| `site/src/pages/formal-registry/index.astro` | `/corpus/{slug}/#{object.id}` | `FormalObjectList` anchor links | WIRED | Registry page groups `formalRegistry` entries and links rows back to chapter anchors. |
| `site/src/pages/glossary/index.astro` | `site/src/data/concepts.ts` | `conceptRegistry.map` | WIRED | Glossary renders all typed concept cards and alias links. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|---|---|---|---|---|
| `site/src/pages/corpus/[slug].astro` | `chapter`, `formalObjects`, `concepts` | Parsed registries from `chapters.ts`, `formal-registry.ts`, `concepts.ts` | Yes — no route fallback; strict missing-target errors; build generated 13 pages | FLOWING |
| `site/src/pages/formal-registry/index.astro` | `formalRegistry` | `parseFormalRegistry([...])` export with 50 objects | Yes — grouped by owner/kind and rendered in build | FLOWING |
| `site/src/pages/glossary/index.astro` | `conceptRegistry` | `parseConceptRegistry([...])` export with 14 concepts | Yes — alias and concept-card rendering in build | FLOWING |
| `site/src/scripts/validate-formal-registry.ts` | `formalRegistry`, `chapterRegistry`, `conceptRegistry`, `derivationCoverageByOwner` | Typed registry exports | Yes — CLI reported 50 objects, 13 chapters, 14 concepts, 0 errors | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|---|---|---|---|
| Full test suite passes | `cd /home/prannayag/harness_eng/site && bun run test` | 8 files, 60 tests passed | PASS |
| Static build and validation pass | `cd /home/prannayag/harness_eng/site && bun run build` | Validation passed; 21 pages built; Pagefind index generated | PASS |
| Astro type check passes | `cd /home/prannayag/harness_eng/site && bun run check` | 0 errors, 0 warnings, 0 hints | PASS |
| Built Phase 3 outputs contain expected anchors/pages | `test/grep` against `dist/corpus/umbrella`, `dist/corpus/accretion`, `dist/formal-registry`, `dist/glossary` | All checks succeeded | PASS |

### Probe Execution

No Phase 3 probe scripts were declared or discovered for this static site content phase. Probe execution skipped.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| FORM-01 | 03-01, 03-02, 03-05 | Curated umbrella framework page grounded in `science/paper/` | SATISFIED | `umbrella` chapter exists; source trail includes `science/paper/science.tex`, `.pdf`, and `.bib`; build generated `/corpus/umbrella/`. |
| FORM-02 | 03-03, 03-04, 03-05 | Curated chapter pages for all twelve pillars | SATISFIED | `chapterRegistry` has 12 non-umbrella curated chapters; build generated all twelve pillar pages. |
| FORM-03 | all plans | Each pillar chapter includes required problem/model/notation/definition/claim/derivation/interpretation/related/source sections | SATISFIED | `requiredChapterSections` test covers all expected owners; `chapters.ts` maps every seed to the ten-section contract. |
| FORM-04 | all plans | Consistent anchorable definition blocks | SATISFIED | Formal registry includes definition objects per owner; corpus route renders `DefinitionBlock id={object.id}`. |
| FORM-05 | all plans | Consistent theorem-like blocks | SATISFIED | Pillar objects include theorem/proposition/lemma/corollary claims; `TheoremBlock` supports typed `kind` labels and stable IDs. |
| FORM-06 | all plans | Derivation walkthroughs/sections where supported | SATISFIED | All-owner `derivationCoverageByOwner` matrix is validated; supported entries require derivation/equation objects and chapter derivation-context references. |
| FORM-07 | all plans | Readable citation references and bibliography entries | SATISFIED | `citations` records exist per paper; corpus route renders `CitationRef`; source trails include bibliography paths where present. |
| FORM-08 | all plans | Citation/formal block traceability to canonical sources/PDFs/source trails | SATISFIED | `SourceTrail` is rendered in formal blocks; `validateSourceTrail` checks project-relative path existence and archive-canonical misuse. |
| FORM-09 | all plans | Glossary/concept index normalizes terms, aliases, notation, owners | SATISFIED | `/glossary/` renders `conceptRegistry` with aliases, notation, owner IDs, related objects, and reciprocal concepts. |
| FORM-10 | all plans | Formal object registry/index | SATISFIED | `/formal-registry/` renders definitions, theorem-like claims, derivations/equations, citations grouped by owner/kind with stable links. |

No orphaned Phase 3 requirements were found: `.planning/REQUIREMENTS.md` maps exactly FORM-01 through FORM-10 to Phase 3, and all are claimed across plan frontmatter.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---:|---|---|---|
| None | — | Stub/debt-marker scan found no actionable `TBD`, `FIXME`, `XXX`, `TODO`, `HACK`, placeholder copy, empty UI returns, or hardcoded empty data in Phase 3 implementation files. | None | No blocker or warning. |

### Human Verification Required

#### 1. Scholarly source-faithfulness review

**Test:** Read the umbrella chapter plus representative pillar chapters such as Reliability, Security, Accretion, and one thin/ambiguous pillar alongside their canonical `.tex`/PDF/bibliography sources.
**Expected:** Curated prose, derivation explanations, theorem-like statements, citations, and source-tier labels accurately preserve canonical rigor and do not overclaim beyond source support.
**Why human:** Tests can verify that source trails exist, source files resolve, and sections render, but cannot judge whether the mathematical interpretation and academic prose are faithful to the papers.

### Gaps Summary

No automated blocker gaps found. The phase goal is implemented at the codebase level: data exists, is substantive, is wired into static routes, validates strictly, builds successfully, and has passing tests. Final status is `human_needed` only because scholarly correctness of curated formal prose requires human review.

---

_Verified: 2026-05-19T10:14:53Z_
_Verifier: Claude (gsd-verifier)_
