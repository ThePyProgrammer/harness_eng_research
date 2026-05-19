---
phase: 02-book-shell-and-formal-reading-interface
reviewed: 2026-05-19T14:39:00Z
depth: standard
files_reviewed: 17
files_reviewed_list:
  - site/astro.config.mjs
  - site/src/components/AtlasConstellation.astro
  - site/src/components/AtlasConstellation.test.ts
  - site/src/components/BookFooterNav.astro
  - site/src/components/SourceLinkPanel.astro
  - site/src/components/formal/CitationRef.astro
  - site/src/components/formal/DefinitionBlock.astro
  - site/src/components/formal/DerivationWalkthrough.astro
  - site/src/components/formal/SourceTrail.astro
  - site/src/components/formal/TheoremBlock.astro
  - site/src/components/formal/formal-components.test.ts
  - site/src/content/docs/formal-reading-fixture.mdx
  - site/src/content/docs/index.mdx
  - site/src/data/book-spine.test.ts
  - site/src/data/book-spine.ts
  - site/src/pages/corpus/[slug].astro
  - site/src/styles/atlas.css
findings:
  critical: 1
  warning: 1
  info: 0
  total: 2
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-05-19T14:39:00Z
**Depth:** standard
**Files Reviewed:** 17
**Status:** issues_found

## Summary

Reviewed the Phase 2 book shell and formal reading interface files, including the Astro page/component layer, book-spine data, MDX fixture, CSS, and adjacent corpus metadata used by the changed code. `astro check`, the Vitest suite, and the production build all pass, but the implementation still ships broken source/PDF provenance links and creates a real public fixture page that is absent from navigation.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Canonical source and PDF links point to routes that are not emitted by the static site

**File:** `site/src/components/SourceLinkPanel.astro:34-36`, `site/src/components/formal/SourceTrail.astro:30-32`, `site/src/content/docs/formal-reading-fixture.mdx:15-22`

**Issue:** `repositoryHref()` converts corpus-relative paths such as `science/paper/science.tex` and `pillars/temporal/paper/temporal_architecture.pdf` into site-root URLs (`/science/paper/science.tex`, `/pillars/...`). The production build does not emit these files under `site/dist` and there is no `site/public/science` or `site/public/pillars` tree, so the advertised canonical `.tex`, PDF, and bibliography links 404 in the published static site. This violates the project's source-of-truth requirement: the page claims traceability to canonical sources, but users cannot follow the links.

**Fix:** Route these links to a browsable repository URL or copy/link the canonical assets into `site/public` during the build. For example, if the intended behavior is repository browsing:

```ts
const repositoryBaseUrl = 'https://github.com/<owner>/<repo>/blob/main/';

function repositoryHref(path: string): string {
  return new URL(path, repositoryBaseUrl).toString();
}
```

Apply the same fix in both `SourceLinkPanel.astro` and `SourceTrail.astro`, and update direct fixture `sourceHref` props to use the same helper/absolute repository URLs instead of static-site-relative paths.

## Warnings

### WR-01: Formal reading fixture is published as a live content page without sidebar discoverability

**File:** `site/src/content/docs/formal-reading-fixture.mdx:1-13`

**Issue:** The fixture page is placed under `src/content/docs`, so Starlight builds it as `/formal-reading-fixture/` and Pagefind indexes it. It has no sidebar entry in `bookSidebar`, which makes it an orphaned public page, and its fixture/placeholder text can surface through direct links or search despite not being curated Phase 3 chapter content. That is a content/provenance quality problem for a research wiki: test scaffolding is being published as user-facing material.

**Fix:** Move the fixture out of publishable docs content (for example under a test fixtures directory) and keep component coverage in tests, or explicitly exclude it from publication/search. If it must remain built temporarily, add clear noindex/search exclusion metadata and either add it to a development-only sidebar section or gate it from production builds.

---

_Reviewed: 2026-05-19T14:39:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
