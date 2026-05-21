# Phase 5: Release Quality and Static Publication Readiness - Research

**Researched:** 2026-05-21  
**Domain:** Astro/Starlight static publication release validation, coverage reporting, print styling, and clean-checkout build proof  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Deferred Ideas (OUT OF SCOPE)
## Deferred Ideas

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DESIGN-05 | Site has print- or citation-friendly page styling for research use. [CITED: .planning/REQUIREMENTS.md] | Use `@media print`, `@page`, chrome suppression, URL/source-trail preservation, and static DOM/CSS checks. [CITED: developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing] [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |
| QUAL-01 | Build validates internal links, source trails, archive exclusions, citation resolution, and graph target IDs. [CITED: .planning/REQUIREMENTS.md] | Extend existing strict validators and add a release orchestrator that groups actionable diagnostics. [VERIFIED: codebase read] |
| QUAL-02 | Build or test fixtures verify representative math snippets from the umbrella paper and multiple pillar papers. [CITED: .planning/REQUIREMENTS.md] | Add source-snippet fixtures against `science/paper/science.tex` and selected `pillars/*/paper/*.tex`, then assert rendered/static registry math anchors exist. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [VERIFIED: codebase read] |
| QUAL-04 | Coverage matrix confirms the umbrella framework and all twelve pillars meet the minimum chapter/content contract. [CITED: .planning/REQUIREMENTS.md] | Generate coverage from `corpusEntries`, `chapterRegistry`, `conceptRegistry`, `formalRegistry`, citations, derivation coverage, reading paths, and graph/search index data. [VERIFIED: codebase read] |
| QUAL-05 | Clean checkout can install dependencies, build the site, generate local search/graph/citation indexes, and produce deployable static output. [CITED: .planning/REQUIREMENTS.md] | Use Bun lockfile install, existing Astro/Starlight static build, Pagefind post-build indexing, and output-shape verification. [CITED: bun.sh/docs/cli/install] [CITED: docs.astro.build/en/guides/deploy/] [CITED: pagefind.app/docs/] [VERIFIED: codebase read] |
</phase_requirements>

## Summary

Phase 5 should not invent a second build system; it should formalize the current Bun/Astro/Starlight workflow into a strict release gate that composes existing validators, targeted new validators, static output checks, and a generated coverage report. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [VERIFIED: codebase read] The site already has the right primitives: `site/package.json` runs validation, Astro build, index generation, and Vitest; `validate-corpus.ts`, `validate-formal-registry.ts`, and `validate-discovery.ts` already expose structured errors with `entryId`, `field`, `path`, `reason`, and `nextStep`. [VERIFIED: codebase read]

The planner should add a single `release` or `release:check` command under `site/` that runs gates in an explicit order: dependency/build environment preflight, existing validators, representative math/source fixtures, coverage artifact generation, Astro type/build/test commands, local index generation, internal link/output-shape validation, print/static accessibility checks, and final grouped pass/fail reporting. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [VERIFIED: codebase read] This command should preserve focused scripts so failures remain debuggable. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]

**Primary recommendation:** Implement one TypeScript release orchestrator in `site/src/scripts/` plus focused validators/generators for coverage, output shape/internal links, representative math snippets, and print readiness; wire it through `site/package.json` without adding new runtime services or new dependencies. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [VERIFIED: codebase read]

## Project Constraints (from CLAUDE.md)

- Site work must keep canonical content in `science/paper/` and `pillars/*/paper/`; website pages must link back rather than becoming untraceable forks. [CITED: CLAUDE.md]
- v1 must cover the umbrella paper and all twelve pillars. [CITED: CLAUDE.md]
- v1 should include full derivations where the corpus supports them; definitions-only summaries are too shallow. [CITED: CLAUDE.md]
- The v1 site must remain static and avoid unnecessary server/runtime complexity. [CITED: CLAUDE.md]
- Navigation must support both book-chapter reading and wiki/graph-style exploration. [CITED: CLAUDE.md]
- Search must be local/static with no hosted search service or database for v1. [CITED: CLAUDE.md]
- The visual identity must be original and book-like, not a close clone of another research site. [CITED: CLAUDE.md]
- Do not treat `archive/` material as active source unless a page explicitly discusses provenance. [CITED: CLAUDE.md]
- Site implementation remains a static document/book project under `site/`; no server runtime, container orchestration, or application hosting stack is present. [CITED: CLAUDE.md] [VERIFIED: codebase read]
- TypeScript is strict in the site/plugin conventions; keep TS code type-safe and avoid implicit `any`. [CITED: CLAUDE.md]
- Use structured user-actionable errors at CLI/script boundaries; CLI scripts should print errors to stderr and exit non-zero on failure. [CITED: CLAUDE.md]
- Preserve adjacent style rather than reformatting unrelated code. [CITED: CLAUDE.md]
- GSD workflow enforcement says file-changing work should stay within GSD workflow context. [CITED: CLAUDE.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Unified release-readiness command | Static build/tooling tier | Browser/static output | The command orchestrates install/check/test/validate/build/index/output checks before publication; it does not run in the reader's browser. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |
| Source trail/archive/citation/graph validation | Static build/tooling tier | Corpus data tier | The source of truth is typed registry data plus canonical repository files; failures should block build. [VERIFIED: codebase read] [CITED: CLAUDE.md] |
| Coverage matrix/report | Static build/tooling tier | Browser/static output | Build tooling computes coverage from registries, then renders or emits human-readable static evidence. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |
| Representative math fixtures | Static build/tooling tier | Corpus source tier | Fixtures compare expected math/source snippets against canonical `.tex` files and rendered/formal registry anchors. [CITED: .planning/REQUIREMENTS.md] [VERIFIED: codebase read] |
| Clean-checkout proof | Static build/tooling tier | Package manager/runtime tier | Bun install/check/build/index commands prove reproducibility from tracked source and lockfile. [CITED: bun.sh/docs/cli/install] [VERIFIED: codebase read] |
| Print/citation styling | Browser/static output | Static build/tooling tier | CSS controls print presentation; validators only verify required structures and selectors exist. [CITED: developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing] [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |
| Deployable output shape verification | Static build/tooling tier | Static hosting/CDN tier | Astro emits static `dist/`; release checks should assert expected HTML/assets/index artifacts exist before deployment. [CITED: docs.astro.build/en/guides/deploy/] [VERIFIED: codebase read] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `bun` | local 1.3.12 | Package install, script runner, TypeScript script execution. [VERIFIED: environment probe] | Existing project has `bun.lock`, uses Bun scripts, and Bun documents `bun install --frozen-lockfile` / `bun ci` for reproducible lockfile installs. [VERIFIED: codebase read] [CITED: bun.sh/docs/cli/install] |
| `astro` | project ^6.3.2; npm latest 6.3.6 modified 2026-05-20 | Static site build. [VERIFIED: npm registry] | Astro CLI documents `astro build` as building the site for deployment, and Astro deployment docs identify `dist` as the default output. [CITED: docs.astro.build/en/reference/cli-reference/] [CITED: docs.astro.build/en/guides/deploy/] |
| `@astrojs/starlight` | project/latest 0.39.2 modified 2026-05-08 | Documentation/book shell integration. [VERIFIED: npm registry] | Existing site uses Starlight; official Starlight docs support project CSS through the `customCss` array. [VERIFIED: codebase read] [CITED: starlight.astro.build/guides/css-and-tailwind/] |
| `typescript` | project/latest 6.0.3 modified 2026-04-16 | Type-safe release validators and generated reports. [VERIFIED: npm registry] | Current validators and data registries are TypeScript; extending them preserves schema/type patterns. [VERIFIED: codebase read] |
| `vitest` | project ^4.1.6; npm latest 4.1.7 modified 2026-05-20 | Existing unit test runner for validators/data/components. [VERIFIED: npm registry] | The site already has multiple `*.test.ts` files and `site/package.json` maps `test` to `vitest run`. [VERIFIED: codebase read] |
| `pagefind` | project/latest 1.5.2 modified 2026-04-12 | Static local search artifact generation. [VERIFIED: npm registry] | Pagefind official docs say it runs after a static generator and `--site` points to the output directory. [CITED: pagefind.app/docs/] |
| `zod` | project/latest 4.4.3 modified 2026-05-04 | Schema validation for registries and generated artifacts. [VERIFIED: npm registry] | Existing corpus/formal/discovery schemas already parse and validate data with Zod. [VERIFIED: codebase read] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `katex` | project ^0.16.46; npm latest 0.16.47 modified 2026-05-16 | Math rendering assets. [VERIFIED: npm registry] | Keep for existing math pipeline and static output checks for representative math content. [VERIFIED: codebase read] |
| `remark-math` | project/latest 6.0.0 modified 2023-11-20 | Markdown math parsing. [VERIFIED: npm registry] | Already configured in `astro.config.mjs`; do not replace during release hardening. [VERIFIED: codebase read] |
| `rehype-katex` | project/latest 7.0.1 modified 2024-08-19 | HTML math rendering from parsed math. [VERIFIED: npm registry] | Already configured in `astro.config.mjs`; release checks should verify output, not switch renderers. [VERIFIED: codebase read] |
| `@astrojs/check` | project/latest 0.9.9 modified 2026-04-28 | Astro diagnostics/type checks. [VERIFIED: npm registry] | Existing `check` script uses `astro check`; Astro docs describe it as running diagnostics against the project. [CITED: docs.astro.build/en/reference/cli-reference/] [VERIFIED: codebase read] |
| `@types/bun` | project/latest 1.3.14 modified 2026-05-13 | Bun types for TS scripts/tests. [VERIFIED: npm registry] | Existing dev dependency; no new dependency needed. [VERIFIED: codebase read] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TypeScript release scripts under `site/src/scripts/` | Shell-only orchestration | Shell is fine for top-level command chaining, but TypeScript can import existing validators and preserve typed diagnostics. [VERIFIED: codebase read] [ASSUMED] |
| Static DOM/output checks with Node/Bun filesystem parsing | Browser/PDF snapshot tests | Browser/PDF snapshots can catch visual regressions but add tool complexity; context explicitly says they are not required unless cheap and reliable. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |
| Generated JSON + static Astro coverage page | CLI-only coverage table | CLI-only output is less reader-inspectable; context requires a generated human-readable report/page with validator-usable data where useful. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |

**Installation:**
```bash
cd site
bun install --frozen-lockfile
```

**Version verification:** npm registry checks confirmed the current/latest package versions listed above, and no checked package exposes an npm `scripts.postinstall` value. [VERIFIED: npm registry]

## Package Legitimacy Audit

> No new external packages are recommended for Phase 5; use the existing site dependency stack. [VERIFIED: codebase read] Slopcheck in this environment checked PyPI rather than npm for Node package names, so its [SLOP]/[SUS] verdicts are not used as authoritative npm legitimacy signals. [VERIFIED: tool output] All package rows below were verified on npm with source repositories and no npm postinstall script output. [VERIFIED: npm registry]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `@astrojs/starlight` | npm | Created 2023-05-08 | npm downloads not captured by `npm view downloads` in this session | github.com/withastro/starlight | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `astro` | npm | Created 2021-03-13 | npm downloads not captured by `npm view downloads` in this session | github.com/withastro/astro | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `katex` | npm | Created 2014-09-15 | npm downloads not captured by `npm view downloads` in this session | github.com/KaTeX/KaTeX | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `pagefind` | npm | Created 2022-04-27 | npm downloads not captured by `npm view downloads` in this session | github.com/Pagefind/pagefind | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `rehype-katex` | npm | Created 2017-03-03 | npm downloads not captured by `npm view downloads` in this session | github.com/remarkjs/remark-math | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `remark-math` | npm | Created 2017-02-21 | npm downloads not captured by `npm view downloads` in this session | github.com/remarkjs/remark-math | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `zod` | npm | Created 2020-03-07 | npm downloads not captured by `npm view downloads` in this session | github.com/colinhacks/zod | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `@astrojs/check` | npm | Created 2023-07-31 | npm downloads not captured by `npm view downloads` in this session | github.com/withastro/astro | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `typescript` | npm | Created 2012-10-01 | npm downloads not captured by `npm view downloads` in this session | github.com/microsoft/TypeScript | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `vitest` | npm | Created 2021-12-03 | npm downloads not captured by `npm view downloads` in this session | github.com/vitest-dev/vitest | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |
| `@types/bun` | npm | Created 2023-12-15 | npm downloads not captured by `npm view downloads` in this session | github.com/DefinitelyTyped/DefinitelyTyped | Unusable for npm in this session | Approved as existing dependency; no new install decision. [VERIFIED: npm registry] |

**Packages removed due to slopcheck [SLOP] verdict:** none; no new packages recommended, and slopcheck results were ecosystem-mismatched for npm. [VERIFIED: tool output]  
**Packages flagged as suspicious [SUS]:** none for npm; slopcheck did not provide usable npm verdicts. [VERIFIED: tool output]

## Architecture Patterns

### System Architecture Diagram

```text
Clean checkout / developer release command
        |
        v
Bun install with committed bun.lock
        |
        v
Unified release orchestrator (site/src/scripts/release-readiness.ts)
        |
        +--> Existing validators
        |       +--> corpus inventory/source paths/archive exclusions
        |       +--> formal registry/source trails/derivation coverage/relations
        |       +--> discovery/search fixtures/graph target IDs
        |
        +--> New release validators
        |       +--> representative math snippets from canonical .tex sources
        |       +--> internal link and anchor validation over dist/*.html
        |       +--> deployable output shape and required index artifacts
        |       +--> print CSS and print-safe DOM structure checks
        |       +--> coverage matrix generation/validation
        |
        +--> Astro check + Vitest + Astro static build
        |
        +--> Local index generation (corpus/search/relation/reading-path/graph + Pagefind)
        |
        v
Grouped release report
        |
        +--> PASS: deployable dist/ with coverage/search/graph/citation artifacts
        |
        +--> FAIL: grouped diagnostics with path/anchor/reason/next step
```
[VERIFIED: codebase read] [CITED: docs.astro.build/en/guides/deploy/] [CITED: pagefind.app/docs/]

### Recommended Project Structure

```text
site/
├── package.json                         # add release/readiness scripts here [VERIFIED: codebase read]
├── src/
│   ├── data/                            # existing typed corpus/chapter/formal/discovery inputs [VERIFIED: codebase read]
│   ├── pages/
│   │   └── release-readiness.astro       # generated/human-readable coverage report page [ASSUMED]
│   ├── scripts/
│   │   ├── release-readiness.ts          # unified release orchestrator [ASSUMED]
│   │   ├── generate-coverage-matrix.ts   # coverage JSON generation [ASSUMED]
│   │   ├── validate-output-shape.ts      # dist/internal link/index artifact checks [ASSUMED]
│   │   ├── validate-math-fixtures.ts     # canonical source math snippet checks [ASSUMED]
│   │   └── validate-print-readiness.ts   # static CSS/DOM print checks [ASSUMED]
│   └── styles/
│       └── atlas.css                    # extend with @media print and @page [VERIFIED: codebase read] [CITED: developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing]
└── dist/                                # default Astro build output [CITED: docs.astro.build/en/guides/deploy/]
```

### Pattern 1: Import Existing Validators, Do Not Re-parse by Shell

**What:** The release orchestrator should import `validateCorpus`, `validateFormalRegistry`, and `validateDiscovery` and normalize their existing error shapes into grouped release diagnostics. [VERIFIED: codebase read]

**When to use:** Use this for QUAL-01 and the final all-gates pass/fail summary. [CITED: .planning/REQUIREMENTS.md]

**Example:**
```typescript
// Source: existing site/src/scripts/validate-corpus.ts and validate-formal-registry.ts [VERIFIED: codebase read]
type ReleaseDiagnostic = {
  gate: string;
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
};

function fromValidationError(gate: string, error: { entryId: string; field: string; path: string; reason: string; nextStep: string }): ReleaseDiagnostic {
  return { gate, ...error };
}
```

### Pattern 2: Coverage Matrix as Data First, Page Second

**What:** Generate a typed coverage matrix from existing registries, write JSON for validation/output-shape checks, and render a compact report page from the same data. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [VERIFIED: codebase read]

**When to use:** Use this for QUAL-04 and for human release evidence. [CITED: .planning/REQUIREMENTS.md]

**Example:**
```typescript
// Source: existing data registries: corpus.ts, chapters.ts, concepts.ts, formal-registry.ts [VERIFIED: codebase read]
type OwnerCoverage = {
  ownerId: string;
  hasChapter: boolean;
  sectionKeysPresent: string[];
  formalObjectCount: number;
  conceptCount: number;
  citationCount: number;
  sourceTrailCount: number;
  derivationStatus: 'supported' | 'not-supported' | 'mixed' | 'missing';
  discoveryPresent: boolean;
};
```

### Pattern 3: Static Output Shape Check After Build and Indexing

**What:** Validate `dist/` after Astro build and local index generation, not before. [CITED: docs.astro.build/en/guides/deploy/] [CITED: pagefind.app/docs/]

**When to use:** Use this for QUAL-05 because success criteria require deployable output shape, generated HTML/assets, and local search/graph/citation/coverage artifacts. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]

**Example:**
```typescript
// Source: Astro docs for default dist output and Pagefind docs for post-build site indexing [CITED: docs.astro.build/en/guides/deploy/] [CITED: pagefind.app/docs/]
const requiredDistArtifacts = [
  'index.html',
  'corpus/umbrella/index.html',
  'formal-registry/index.html',
  'glossary/index.html',
  'graph/index.html',
  'corpus-index.json',
  'search-index.json',
  'relation-index.json',
  'reading-paths-index.json',
  'graph-index.json',
  'pagefind/pagefind.js',
];
```

### Pattern 4: Print CSS in Existing Visual System

**What:** Add print rules to `atlas.css` using `@media print` and optional `@page`; hide navigation chrome while preserving content, source trails, URLs, formal blocks, equations, and citations. [CITED: developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing] [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]

**When to use:** Use this for DESIGN-05 across pages already importing `atlas.css`. [VERIFIED: codebase read]

**Example:**
```css
/* Source: MDN print media guidance [CITED: developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing] */
@media print {
  @page {
    margin: 0.75in;
  }

  .book-spine-panel,
  .book-footer-nav,
  .graph-neighborhood__cta {
    display: none !important;
  }

  a[href]::after {
    content: " (" attr(href) ")";
  }
}
```

### Anti-Patterns to Avoid

- **Adding a separate release framework:** The project already has Bun, Astro, Starlight, Vitest, Pagefind, and typed TS validators; extra orchestration dependencies would increase clean-checkout risk without solving Phase 5 requirements. [VERIFIED: codebase read] [ASSUMED]
- **Only checking Astro build success:** The locked decision requires generated HTML/assets and local search/graph/citation/coverage artifacts to exist and contain required entries. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]
- **Coverage as a huge unstructured table:** The locked decision requires compact grid plus drilldown details linking to pages, formal anchors, source trails, and diagnostics. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]
- **Browser-only print validation:** The locked decision says static checks are sufficient and browser/PDF snapshots are not required unless cheap and reliable. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]
- **Treating archive paths as valid canonical sources:** Project constraints and existing validators forbid canonical archive sources unless explicitly marked as provenance content. [CITED: CLAUDE.md] [VERIFIED: codebase read]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Static site generation | Custom HTML emitter | Astro/Starlight existing build | Existing config already outputs static pages and Starlight integrates the book shell. [VERIFIED: codebase read] [CITED: docs.astro.build/en/guides/deploy/] |
| Math rendering | Custom TeX-to-HTML renderer | Existing `remark-math` + `rehype-katex` + `katex` pipeline | Existing Astro config already wires the math pipeline; Phase 5 should validate representative math, not replace rendering. [VERIFIED: codebase read] |
| Search indexing | Custom client search engine | Existing Pagefind post-build integration plus generated search index | Pagefind is already in dependencies and official docs support post-static-generator indexing. [VERIFIED: codebase read] [CITED: pagefind.app/docs/] |
| Schema validation | Ad hoc object checks | Existing Zod schemas and validators | Current validators already parse corpus/formal/discovery shapes and emit actionable diagnostics. [VERIFIED: codebase read] |
| Release diagnostic format | Free-form logs only | Existing `{ entryId, field, path, reason, nextStep }` pattern | Locked decisions require actionable grouped details; existing validators already have this shape. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [VERIFIED: codebase read] |
| Print rendering engine | PDF/screenshot automation by default | CSS `@media print` plus static checks | The phase explicitly does not require browser/PDF snapshot testing unless cheap and reliable. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |

**Key insight:** Phase 5 is release hardening, not feature expansion; the planner should compose and verify existing typed registries, static pages, and build artifacts rather than introduce a parallel publication system. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [VERIFIED: codebase read]

## Common Pitfalls

### Pitfall 1: Release command hides the failing subsystem
**What goes wrong:** A monolithic `release` script exits with a generic failure and forces maintainers to rerun everything manually. [ASSUMED]  
**Why it happens:** Orchestration is added as shell chaining without preserving diagnostics. [ASSUMED]  
**How to avoid:** Normalize all validator failures into grouped diagnostics with gate name, item, path/anchor, reason, and next step. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]  
**Warning signs:** Output says only `Command failed` or `validation failed` without `entryId`, `field`, `path`, `reason`, and `nextStep`. [VERIFIED: codebase read]

### Pitfall 2: Coverage matrix duplicates validation logic but drifts
**What goes wrong:** The report says coverage passes while validators fail, or vice versa. [ASSUMED]  
**Why it happens:** Report generation and validation compute coverage independently. [ASSUMED]  
**How to avoid:** Generate one coverage data model and consume it for both the static page and release gate. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]  
**Warning signs:** Separate hard-coded owner lists or section key lists appear outside schemas/registries. [VERIFIED: codebase read]

### Pitfall 3: Internal link validation misses hash anchors
**What goes wrong:** Pages exist, but deep links to formal objects, graph nodes, citations, or glossary concepts break. [ASSUMED]  
**Why it happens:** Validators only check file paths and ignore `#id` fragments. [ASSUMED]  
**How to avoid:** Parse rendered `dist/**/*.html`, collect element IDs, and verify every local `href` path plus fragment. [ASSUMED]  
**Warning signs:** Search and graph indexes point to `#formal-id` or `#concept-id`, but output-shape checks only assert the page file exists. [VERIFIED: codebase read]

### Pitfall 4: Pagefind runs before static HTML exists
**What goes wrong:** Search artifacts are missing or stale while build appears successful. [ASSUMED]  
**Why it happens:** Pagefind is a post-static-generator indexer and needs a built output directory. [CITED: pagefind.app/docs/]  
**How to avoid:** Keep release order as validate/check/test, Astro build, generated local indexes, Pagefind, output-shape checks. [CITED: pagefind.app/docs/] [VERIFIED: codebase read]  
**Warning signs:** `pagefind/` is absent from `dist/` after release, or output checks run before `bun run index`. [VERIFIED: codebase read]

### Pitfall 5: Print CSS removes source context
**What goes wrong:** Printed pages look clean but lose source trails, URLs, citation anchors, or formal block provenance. [ASSUMED]  
**Why it happens:** Generic print styles hide asides/links without distinguishing navigation chrome from research provenance. [ASSUMED]  
**How to avoid:** Hide navigation/sidebar chrome, not `.formal-source-trail`, `.source-panel`, formal blocks, citations, or URLs; use link URL expansion for print. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [CITED: developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing]  
**Warning signs:** `@media print` contains broad selectors like `aside { display: none }` while source trails live in side panels or detail components. [VERIFIED: codebase read]

### Pitfall 6: Clean checkout proof relies on local artifacts
**What goes wrong:** Release passes on the maintainer machine but fails for a fresh clone. [ASSUMED]  
**Why it happens:** The proof depends on existing `node_modules`, `dist`, generated indexes, or untracked files. [ASSUMED]  
**How to avoid:** Script a fresh-start path using committed `bun.lock`, delete/rebuild generated output as part of proof, and verify artifacts after generation. [CITED: bun.sh/docs/cli/install] [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]  
**Warning signs:** Release docs say “run build” but never mention install/frozen lockfile or output artifact verification. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]

## Code Examples

Verified patterns from current code and official sources:

### Reusing Validator Diagnostic Shape
```typescript
// Source: validate-corpus.ts / validate-formal-registry.ts / validate-discovery.ts [VERIFIED: codebase read]
export interface ReleaseGateError {
  gate: 'corpus' | 'formal-registry' | 'discovery' | 'coverage' | 'math' | 'output' | 'print';
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}
```

### Bun Clean-Checkout Install
```bash
# Source: Bun install docs [CITED: bun.sh/docs/cli/install]
cd site
bun install --frozen-lockfile
bun run release
```

### Astro Static Output Expectation
```bash
# Source: Astro deployment docs [CITED: docs.astro.build/en/guides/deploy/]
cd site
bun run build:astro
# Default output is dist/ unless outDir changes.
```

### Pagefind Post-Build Indexing
```bash
# Source: Pagefind docs [CITED: pagefind.app/docs/]
cd site
bun run build:astro
pagefind --site dist
# Pagefind creates a pagefind/ artifact directory inside the output site.
```

### Print CSS Check Targets
```typescript
// Source: MDN print CSS guidance and Phase 5 print decisions [CITED: developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing] [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]
const requiredPrintSignals = [
  '@media print',
  '@page',
  'a[href]::after',
  '.book-spine-panel',
  '.book-footer-nav',
  '.formal-source-trail',
  '.formal-block',
];
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Treating static build success as release readiness | Build success plus validation of provenance, registry relations, generated indexes, coverage, internal links, math fixtures, print readiness, and output shape | Locked in Phase 5 context on 2026-05-21 | Planner must include gates beyond `astro build`. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |
| Runtime or hosted search validation | Static local search/index validation using generated data and Pagefind after build | Established by earlier phases and current package scripts | Release proof should check static artifacts only. [VERIFIED: codebase read] [CITED: pagefind.app/docs/] |
| Hidden CLI-only coverage | Generated human-readable coverage report plus data consumed by validators | Locked in Phase 5 context on 2026-05-21 | Planner must create both report surface and machine-readable coverage evidence. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |
| Visual-only print judgment | Static print CSS/DOM feature checks, with browser/PDF snapshots optional | Locked in Phase 5 context on 2026-05-21 | Planner should not block on Playwright/PDF tooling unless it is cheap and reliable. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] |

**Deprecated/outdated:**
- Adding hosted search, runtime graph databases, analytics, versioned releases, or automated provenance diff reports is out of v1/Phase 5 scope. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]
- Treating `archive/` as canonical active source is forbidden unless explicitly provenance-labeled. [CITED: CLAUDE.md] [VERIFIED: codebase read]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | TypeScript release scripts are preferable to shell-only orchestration because they can import existing validators and preserve typed diagnostics. | Standard Stack / Architecture Patterns | If wrong, planner may overbuild TS orchestration; shell wrappers could suffice if they call existing JSON CLIs. |
| A2 | Internal link validation should parse rendered HTML and verify local hash fragments. | Common Pitfalls | If wrong, planner may spend too much effort; however broken anchors are directly relevant to formal-object deep links. |
| A3 | No new external packages are needed for Phase 5. | Standard Stack / Package Audit | If wrong, planner may need a human verification checkpoint for any added package. |
| A4 | Broad print selectors can accidentally hide research provenance structures. | Common Pitfalls | If wrong, print validation may be too conservative, but preserving source trails is a locked requirement. |

## Open Questions (RESOLVED)

1. **Where should the unified command live? — RESOLVED**
   - Decision: The canonical implementation lives under `site/`: `site/src/scripts/release-readiness.ts` with `release`, `release:json`, and `release:clean-proof` scripts in `site/package.json`. No repository-root wrapper is planned for Phase 5. This implements D-10 while preserving the locked project boundary that site implementation stays under `site/` and canonical corpus files remain read-only inputs.
   - Reflected by plans: 05-01 creates the initial `site/` command; 05-06 completes final orchestration and clean-checkout proof wiring.

2. **Which math snippets are representative enough? — RESOLVED**
   - Decision: Use umbrella plus `reliability`, `information`, `coordination`, `economics`, and `security` fixtures. This satisfies QUAL-02 by covering the umbrella paper and multiple pillar papers while keeping the fixture set bounded and source-grounded.
   - Reflected by plans: 05-03 requires default fixtures for exactly those owner IDs and maps each fixture to canonical `.tex` snippets plus existing formal registry IDs.

3. **Should coverage report be a static page, JSON artifact, or both? — RESOLVED**
   - Decision: Produce both: render the human-readable `/release-readiness/` static page from typed coverage data at Astro build time, and write machine-readable `dist/coverage-matrix.json` during release after `build:astro` and local index generation so later output-shape validation sees the artifact. The JSON is generated output, not checked-in source.
   - Reflected by plans: 05-02 creates the page and coverage generator; 05-05 validates `coverage-matrix.json` in `dist`; 05-06 orders `build:astro` and `index` before `writeCoverageMatrix({ outputDir: "dist" })` and output-shape validation.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Clean-checkout install/scripts | ✓ | 1.3.12 | Use documented install prerequisite; no npm fallback recommended because project uses `bun.lock`. [VERIFIED: environment probe] [VERIFIED: codebase read] |
| Node.js | npm registry checks / Astro ecosystem | ✓ | v24.14.0 | Bun runs project scripts; Node remains available for ecosystem tooling. [VERIFIED: environment probe] |
| npm | Registry/package verification | ✓ | 11.9.0 | Bun for project installs; npm only for metadata verification. [VERIFIED: environment probe] |
| Pagefind CLI | Static search indexing | Not globally available | — | Use local project dependency via `bun run index`, which invokes `pagefind` from `node_modules/.bin`. [VERIFIED: environment probe] [VERIFIED: codebase read] |
| ctx7 | Documentation lookup fallback | ✗ | — | Used official docs via WebFetch instead. [VERIFIED: environment probe] |
| slopcheck | Package legitimacy audit | Present but npm audit unusable | CLI ran against PyPI for Node packages | Treat slopcheck verdicts as non-authoritative for npm in this session and rely on official docs/npm registry/source repos/postinstall checks; gate any new package with human verification. [VERIFIED: tool output] |

**Missing dependencies with no fallback:** none for the recommended no-new-package implementation. [VERIFIED: environment probe] [ASSUMED]

**Missing dependencies with fallback:**
- Global `pagefind` is absent, but the site has `pagefind` in dependencies and `bun run index` can resolve the local binary after install. [VERIFIED: environment probe] [VERIFIED: codebase read]
- Context7 CLI is absent, but official documentation was fetched directly. [VERIFIED: environment probe] [CITED: docs.astro.build/en/guides/deploy/] [CITED: starlight.astro.build/guides/css-and-tailwind/] [CITED: pagefind.app/docs/] [CITED: bun.sh/docs/cli/install]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Static publication has no accounts/authentication in Phase 5. [CITED: .planning/REQUIREMENTS.md] |
| V3 Session Management | no | Static publication has no sessions in Phase 5. [CITED: .planning/REQUIREMENTS.md] |
| V4 Access Control | no | No protected runtime resources; release checks should ensure static-only output and no server dependency. [CITED: .planning/REQUIREMENTS.md] |
| V5 Input Validation | yes | Use existing Zod schemas and typed validators for registry/build data; reject malformed paths, relations, IDs, and artifacts. [VERIFIED: codebase read] |
| V6 Cryptography | no | Phase does not add cryptographic features. [CITED: .planning/REQUIREMENTS.md] |
| V8 Data Protection | yes | Preserve source provenance and avoid publishing archive/canonical confusion; no secrets should be needed for static build. [CITED: CLAUDE.md] [VERIFIED: codebase read] |
| V12 File and Resources | yes | Validate repository-relative paths, block parent traversal/absolute paths in registry data, and constrain generated output under `site/`. [VERIFIED: codebase read] |

### Known Threat Patterns for Static Publication Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Path traversal in source metadata | Tampering | Existing validators reject absolute paths and `..` traversal; preserve and extend that pattern. [VERIFIED: codebase read] |
| Archive material promoted as canonical | Tampering / Information disclosure | Keep archive path checks build-blocking unless explicitly provenance-only. [CITED: CLAUDE.md] [VERIFIED: codebase read] |
| Broken internal links or anchors mislead readers | Integrity | Parse generated HTML and validate local paths/fragments after build. [ASSUMED] |
| Dependency drift in clean checkout | Tampering / Supply chain | Use committed `bun.lock` and `bun install --frozen-lockfile`/`bun ci`. [CITED: bun.sh/docs/cli/install] [VERIFIED: codebase read] |
| Accidental introduction of runtime services | Architecture/security drift | Keep output static, no server database/CMS/accounts/hosted search. [CITED: .planning/REQUIREMENTS.md] [CITED: CLAUDE.md] |

## Sources

### Primary (HIGH confidence)
- `/home/prannayag/harness_eng/.planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md` - locked decisions, phase boundary, release gates, coverage, clean checkout, print styling. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]
- `/home/prannayag/harness_eng/.planning/REQUIREMENTS.md` - DESIGN-05, QUAL-01, QUAL-02, QUAL-04, QUAL-05 definitions and out-of-scope boundaries. [CITED: .planning/REQUIREMENTS.md]
- `/home/prannayag/harness_eng/CLAUDE.md` - project constraints, stack, conventions, architecture, GSD workflow. [CITED: CLAUDE.md]
- Codebase files read: `site/package.json`, `site/astro.config.mjs`, `site/src/scripts/validate-corpus.ts`, `site/src/scripts/validate-formal-registry.ts`, `site/src/scripts/validate-discovery.ts`, `site/src/scripts/generate-local-indexes.ts`, `site/src/data/corpus.ts`, `site/src/data/chapters.ts`, `site/src/data/formal-registry.ts`, `site/src/styles/atlas.css`, selected page files. [VERIFIED: codebase read]
- Astro official docs: static deploy output and CLI build/check behavior. [CITED: docs.astro.build/en/guides/deploy/] [CITED: docs.astro.build/en/reference/cli-reference/]
- Bun official docs: install, frozen lockfile, `bun ci`, lifecycle script behavior. [CITED: bun.sh/docs/cli/install]
- Pagefind official docs: runs after static generator, `--site` output directory, creates `pagefind/`. [CITED: pagefind.app/docs/]
- Starlight official docs: custom CSS through `customCss` array. [CITED: starlight.astro.build/guides/css-and-tailwind/]
- MDN print CSS guidance: `@media print`, `media="print"`, `@page`. [CITED: developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing]

### Secondary (MEDIUM confidence)
- npm registry metadata for existing project packages: versions, modified dates, creation dates, source repos, and postinstall checks. [VERIFIED: npm registry]
- Environment probes for Bun/Node/npm/Pagefind/ctx7/slopcheck availability. [VERIFIED: environment probe]

### Tertiary (LOW confidence)
- Planner-level recommendations about exact file names, fixture selection, and report URL are marked [ASSUMED] where not locked by context or current code. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Existing dependencies and package scripts were read from `site/package.json`, versions were checked with npm, and official docs confirmed Astro/Bun/Pagefind/Starlight behavior. [VERIFIED: codebase read] [VERIFIED: npm registry] [CITED: docs.astro.build/en/guides/deploy/] [CITED: bun.sh/docs/cli/install]
- Architecture: HIGH - Phase 5 context locks the release-gate/coverage/clean-checkout/print responsibilities, and codebase validators already implement the diagnostic/data patterns. [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md] [VERIFIED: codebase read]
- Pitfalls: MEDIUM - Several pitfalls are based on common release-engineering failure modes and are marked [ASSUMED], while mitigations are grounded in locked decisions and current code. [ASSUMED] [CITED: .planning/phases/05-release-quality-and-static-publication-readiness/05-CONTEXT.md]

**Research date:** 2026-05-21  
**Valid until:** 2026-06-20 for existing stack/release architecture; re-check npm/Bun/Astro/Pagefind versions before changing dependencies. [ASSUMED]
