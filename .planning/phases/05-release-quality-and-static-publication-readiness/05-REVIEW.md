---
phase: 05-release-quality-and-static-publication-readiness
reviewed: 2026-05-21T00:00:00Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - site/package.json
  - site/src/pages/release-readiness.astro
  - site/src/scripts/generate-coverage-matrix.test.ts
  - site/src/scripts/generate-coverage-matrix.ts
  - site/src/scripts/release-readiness.test.ts
  - site/src/scripts/release-readiness.ts
  - site/src/scripts/validate-accessibility-semantics.test.ts
  - site/src/scripts/validate-accessibility-semantics.ts
  - site/src/scripts/validate-math-fixtures.test.ts
  - site/src/scripts/validate-math-fixtures.ts
  - site/src/scripts/validate-output-shape.test.ts
  - site/src/scripts/validate-output-shape.ts
  - site/src/scripts/validate-print-readiness.test.ts
  - site/src/scripts/validate-print-readiness.ts
  - site/src/styles/atlas.css
findings:
  critical: 0
  warning: 1
  info: 0
  total: 1
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-05-21T00:00:00Z
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Reviewed the release-readiness page, release gate orchestration, coverage matrix generator, accessibility/print/output/math validators, tests, package scripts, and atlas CSS. The earlier status-copy and output-link fixes appear present, but one robustness/security-quality defect remains in the static release page and the output-shape validator's allowlist.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: JavaScript URL bypasses static output link validation

**File:** `site/src/pages/release-readiness.astro:72` and `site/src/scripts/validate-output-shape.ts:57`

**Issue:** The release-readiness page ships a `href="javascript:print()"` action, while the output-shape validator explicitly ignores `javascript:` hrefs as if they were safe external schemes. That means the deployable-output gate will not catch JavaScript URLs in generated HTML. This is the wrong contract for a static publication readiness gate: JavaScript URLs are unsafe link targets, are commonly blocked by CSP/static hosting hardening, and can regress into real XSS risk if future page data ever flows into href attributes. The current hardcoded print action should not require a JavaScript URL, and the validator should fail any static page containing one.

**Fix:** Replace the JavaScript href with a real button or a non-JavaScript print instruction, and make the output-shape validator reject `javascript:` URLs instead of ignoring them. For example:

```astro
<button class="release-readiness__print-action" type="button" onclick="window.print()">Print research handout</button>
```

and in the validator:

```ts
const ignoredHrefSchemes = /^(?:https?:|mailto:|tel:|data:)/iu;

if (/^javascript:/iu.test(href)) {
  addError(
    errors,
    page.relativePath,
    'html.href',
    displayPath(page.absolutePath, distDir),
    `Local href ${href} uses a javascript: URL`,
    'Replace JavaScript URLs with buttons or safe static links before publishing.',
  );
  continue;
}
```

---

_Reviewed: 2026-05-21T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
