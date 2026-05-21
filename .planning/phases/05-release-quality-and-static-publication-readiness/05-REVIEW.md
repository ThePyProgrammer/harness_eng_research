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
  critical: 2
  warning: 1
  info: 0
  total: 3
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-05-21T00:00:00Z
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Reviewed the release-readiness page, coverage matrix generation, release gate orchestration, static output validators, fixture validators, tests, package scripts, and atlas CSS. The main defects are false-negative paths in the output-shape release gate: same-page missing anchors are skipped, local asset links are accepted without existence checks, and malformed percent-encoded links can throw instead of producing structured diagnostics.

## Critical Issues

### CR-01: Same-page broken hash links are skipped by output-shape validation

**File:** `site/src/scripts/validate-output-shape.ts:347`

**Issue:** Fragment validation only runs when the link is not same-page (`!href.startsWith('#')`) or when the same-page link literally starts with `#missing`. Any real same-page broken anchor such as `<a href="#release-diagnostics">` is counted as a local link but never checked unless it happens to use the test-only `#missing` prefix. This lets deployable pages pass the release gate with broken table-of-contents, diagnostic, and in-page navigation links.

**Fix:** Validate every fragment once the target page is known; do not special-case same-page anchors by prefix.

```ts
if (fragment) {
  fragmentsChecked += 1;
  const expectedId = decodeURIComponent(fragment);
  if (!targetPage.ids.has(expectedId) && !targetPage.ids.has(`${expectedId}-heading`) && !Array.from(targetPage.ids).some((id) => id.endsWith(`-${expectedId}`)) && !isKnownGeneratedButUnanchoredFragment(expectedId)) {
    addError(
      errors,
      page.relativePath,
      'html.fragment',
      displayPath(page.absolutePath, distDir),
      `Local href ${href} points to missing anchor #${expectedId}`,
      'Add the target id to the generated page or update the link fragment.',
    );
  }
}
```

Also add a regression test with `<a href="#not-present">Broken same-page anchor</a>` so this cannot regress back to the current test-only behavior.

### CR-02: Local asset hrefs are considered valid without checking the file exists

**File:** `site/src/scripts/validate-output-shape.ts:327-330`

**Issue:** When a local link does not resolve to a generated HTML page, the validator silently accepts it if `isDeployableAssetPath(pathPart)` returns true. It never verifies that `/missing.css`, `/missing.js`, `/favicon.svg`, or another local deployable asset actually exists in `site/dist`. The release output-shape gate can therefore pass with broken stylesheet/script/image/download links, which violates the deployable-static-output contract.

**Fix:** For deployable asset paths, require `existsSync(normalizedTarget)` before continuing; otherwise emit the same `html.href` diagnostic.

```ts
if (normalizedTarget && isDeployableAssetPath(pathPart) && existsSync(normalizedTarget)) {
  continue;
}
```

Add a regression test that writes `<a href="/missing.css">Missing CSS</a>` or a page asset reference and expects an `html.href` diagnostic.

## Warnings

### WR-01: Malformed percent-encoded local hrefs can crash validation instead of producing diagnostics

**File:** `site/src/scripts/validate-output-shape.ts:287,349`

**Issue:** `decodeURIComponent(pathPart)` and `decodeURIComponent(fragment)` are called without handling `URIError`. A malformed local link such as `<a href="/%E0%A4%A">` or `<a href="#%E0%A4%A">` can throw out of `validateOutputShape()`. In direct CLI use this becomes a generic top-level failure; in `runReleaseReadiness()` the validator exception is not caught by `buildValidatorGateResult`, so the release readiness run can abort instead of returning a structured `output-shape` diagnostic with the failing page and field.

**Fix:** Decode through a safe helper that records an `html.href` or `html.fragment` diagnostic and skips only the malformed link.

```ts
function safeDecodeUriComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
```

Use this helper in `resolveHrefTarget()` and fragment validation, adding an `OutputShapeError` when decoding fails.

---

_Reviewed: 2026-05-21T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
