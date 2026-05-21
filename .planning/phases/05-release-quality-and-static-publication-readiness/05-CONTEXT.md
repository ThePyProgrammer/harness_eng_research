# Phase 5: Release Quality and Static Publication Readiness - Context

**Gathered:** 2026-05-21T00:00:00Z
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 delivers final release readiness for the static book/wiki site: unified publication-quality validation, a full corpus coverage matrix, clean-checkout build proof, deployable static output checks, and print/citation-friendly research presentation.

This phase does not add new discovery capabilities, rewrite corpus content, introduce runtime services, build v2 graph exploration, add analytics, or change canonical `science/` / `pillars/` sources. It hardens the static publication built by earlier phases.

</domain>

<decisions>
## Implementation Decisions

### Release Gate Bar
- **D-01:** Final publication should block on all Phase 5 quality gates: internal links, source trails, archive exclusions, citation resolution, graph target IDs, representative math snippets, coverage matrix, accessibility, print styling, clean-checkout build proof, and deployable static output checks.
- **D-02:** Release failures should be reported as a unified pass/fail summary plus grouped actionable details. Each failure should identify the failing item, path or anchor when applicable, reason, and next step.
- **D-03:** Phase 5 should add a single unified release-readiness command that runs existing and new gates in order, while preserving individual validation/build scripts for focused debugging.
- **D-04:** Treatment of v2-only deferred features is delegated to downstream planning. The implementation must avoid scope creep into advanced graph filtering, rich relationship pages, versioned releases, analytics, or automated provenance diff reports.

### Coverage Evidence
- **D-05:** The coverage matrix should prove the full v1 contract for the umbrella framework and all twelve pillars: required chapter sections, formal objects, concepts, citations, source trails, derivation coverage or rationale, and discovery/index presence.
- **D-06:** Coverage evidence should be surfaced as a generated human-readable report/page, with underlying data available to validators where useful.
- **D-07:** If canonical source support is weak for a derivation or formal claim, release may proceed only when the matrix records a source-grounded not-supported or thin-support rationale and the reader-facing page labels the limitation honestly.
- **D-08:** The coverage report should use a compact grid with drilldown details linking to pages, formal anchors, source trails, and failing diagnostics rather than a huge undifferentiated table.

### Clean Checkout Proof
- **D-09:** Clean-checkout release proof should be a documented/scripted fresh-start path that installs dependencies, runs type/check/test/validate/build/index/release gates, and verifies output without relying on preexisting artifacts.
- **D-10:** The exact command location is delegated to downstream planning. The proof may be centered in `site/`, at the repository root, or both, as long as it respects the locked project boundary: site implementation stays under `site/` and canonical corpus files remain read-only inputs.
- **D-11:** Clean-checkout proof must verify deployable output shape, not merely that Astro build succeeded. It should check generated HTML/assets and local search/graph/citation/coverage artifacts exist where expected and contain required entries.
- **D-12:** Dependency/setup failure handling is delegated to downstream planning. The chosen approach should fit the current Bun/Astro workflow and avoid unnecessary external tooling scope.

### Print Citation Style
- **D-13:** Print- and citation-friendly styling should optimize for a research paper handout: preserve title/context, formal blocks, equations, citations, source trails, URLs/anchors, and page-friendly typography while removing navigation chrome.
- **D-14:** Printed source trails should remain visible inline in compact form and include expanded source paths or URLs in a print footer or appendix.
- **D-15:** Citation-friendly print styling should apply across all research pages: homepage, umbrella/pillar chapters, formal registry, glossary, reading paths, graph/context pages, and the generated coverage report.
- **D-16:** Print styling should be validated with static checks: required print CSS/features exist, and representative pages include print-safe title/source/citation structures. Browser/PDF snapshot testing is not required unless the planner finds it cheap and reliable.

### Claude's Discretion
- Downstream planning may decide how the release report treats absent v2-only features, as long as Phase 5 does not implement v2 scope.
- Downstream planning may choose whether the clean-checkout command runs from `site/`, repository root, or both.
- Downstream planning may define dependency/setup diagnostics for the fresh-start proof.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning and Requirements
- `.planning/PROJECT.md` — Project purpose, core value, active constraints, and static academic book/wiki direction.
- `.planning/REQUIREMENTS.md` — Phase 5 maps to DESIGN-05, QUAL-01, QUAL-02, QUAL-04, and QUAL-05.
- `.planning/ROADMAP.md` — Phase 5 goal, dependency on Phase 4, success criteria, and fixed release-readiness boundary.
- `.planning/STATE.md` — Current sequencing context and accumulated deferred v2 items.
- `.planning/phases/02-book-shell-and-formal-reading-interface/02-CONTEXT.md` — Locked visual identity, formal-block source visibility, readability, accessibility, and notebook-style derivation decisions.
- `.planning/phases/03-curated-corpus-chapters-and-formal-registry/03-CONTEXT.md` — Locked chapter contract, structured formal registry, semantic stable IDs, source-tier rules, glossary/concept treatment, and derivation/source-grounding decisions.
- `.planning/phases/04-local-discovery-and-cross-corpus-exploration/04-CONTEXT.md` — Locked reading-path, local search, related-link, graph, and discovery-validation decisions that Phase 5 must harden.

### Current Site Build and Validation
- `site/package.json` — Existing Bun scripts: `validate`, `check`, `build:astro`, `index`, `build`, and `test`; Phase 5 should add or wire the unified release-readiness command here or in an equivalent orchestrator.
- `site/src/scripts/validate-corpus.ts` — Existing hard-fail provenance validator for corpus IDs, canonical paths, archive exclusions, path shape, and missing canonical files.
- `site/src/scripts/validate-formal-registry.ts` — Existing strict validation for formal object schemas, owners, chapter sections, source trails, derivation coverage, and relation targets.
- `site/src/scripts/generate-local-indexes.ts` — Existing local static index generation pattern and output-safety guard to extend for release artifacts if needed.

### Current Site Foundation and Data
- `site/astro.config.mjs` — Static Astro/Starlight configuration, math pipeline, custom CSS hook, and book sidebar wiring.
- `site/src/data/corpus.ts` — Umbrella-plus-twelve-pillar inventory with canonical source/PDF/bibliography paths and source metadata.
- `site/src/data/chapters.ts` — Chapter registry for owner coverage, sections, source trails, concepts, formal object IDs, and citations.
- `site/src/data/concepts.ts` — Concept registry for glossary coverage and concept relationships.
- `site/src/data/formal-registry.ts` — Formal objects, citations, and derivation coverage records used by coverage and validation gates.
- `site/src/data/formal-registry.schema.ts` — Typed schemas and owner/object/source-tier shapes that release validation should extend rather than bypass.
- `site/src/styles/atlas.css` — Current scholarly-atlas visual system and likely home for print/citation-friendly CSS.

### Canonical Corpus Sources
- `science/paper/science.tex` — Canonical umbrella framework source for representative math/source checks.
- `science/paper/science.pdf` — Canonical umbrella framework PDF for source trails.
- `science/paper/science.bib` — Umbrella bibliography source for citation checks.
- `pillars/*/paper/*.tex` — Canonical pillar sources for representative math/source checks and chapter coverage.
- `pillars/*/paper/*.pdf` — Canonical pillar PDFs for source trails.
- `pillars/*/paper/*.bib` — Pillar bibliography sources where present.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `site/package.json`: Current `build` already runs validation, Astro build, and local index generation; Phase 5 can add a focused release command without hiding individual scripts.
- `site/src/scripts/validate-corpus.ts`: Existing diagnostic shape includes entry, field, path, reason, and next step; release reporting should reuse that actionable pattern.
- `site/src/scripts/validate-formal-registry.ts`: Existing validator already covers much of the coverage contract, including required chapter sections and derivation coverage rationale.
- `site/src/scripts/generate-local-indexes.ts`: Existing static artifact generation safely constrains output paths under `site/`; output-shape verification can follow the same safety model.
- `site/src/data/corpus.ts`, `site/src/data/chapters.ts`, `site/src/data/concepts.ts`, and `site/src/data/formal-registry.ts`: These registries are the natural inputs for coverage matrix generation and release checks.
- `site/src/styles/atlas.css`: Current visual system should be extended for print/citation styling rather than introducing a separate design language.

### Established Patterns
- Site implementation remains isolated under `site/`; canonical `science/` and `pillars/` files are read-only inputs.
- Validation is strict and build-blocking for provenance, formal registry, source trails, derivation coverage, and target integrity.
- Diagnostics should be human-actionable, not just boolean pass/fail.
- Static output and local index generation are part of the build model; no runtime database, hosted search, CMS, accounts, analytics, or server service belongs in Phase 5.
- Prior phases prioritize visible source trails, readable formal blocks, semantic stable IDs, and source-grounded limitations.

### Integration Points
- Add a unified release-readiness command that orchestrates existing validators plus Phase 5 gates.
- Extend validation or add a release validator for internal links, citation resolution, graph targets, representative math snippets, coverage matrix completeness, accessibility/semantic checks, print CSS checks, and output shape.
- Generate a coverage matrix/report from current typed registries and expose it as a static page or report artifact.
- Add print/citation CSS and static checks for representative pages and components.
- Add fresh-start documentation or a script that proves install/build/index/release readiness from a clean checkout.

</code_context>

<specifics>
## Specific Ideas

- Final release should use a strict all-gates-blocking bar, not a soft advisory bar.
- The release command should produce a concise summary first, then grouped diagnostics with next steps.
- Coverage evidence should be reader-inspectable as a generated report/page, not hidden only in CLI output.
- Weak canonical support for derivations/formal claims is acceptable only with source-grounded rationale and visible labeling.
- Print output should feel like a research handout: navigation removed, formal content/source/citation context preserved.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 5-Release Quality and Static Publication Readiness*
*Context gathered: 2026-05-21T00:00:00Z*
