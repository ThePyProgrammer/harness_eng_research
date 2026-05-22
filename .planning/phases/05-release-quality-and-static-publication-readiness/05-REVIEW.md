---
phase: 05-release-quality-and-static-publication-readiness
reviewed: 2026-05-22T00:00:00Z
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
  warning: 2
  info: 0
  total: 2
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-05-22T00:00:00Z
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Reviewed the release-readiness page, release gate orchestration, coverage matrix generator, accessibility/print/output/math validators, tests, package scripts, and atlas CSS. The prior `javascript:print()` href regression is fixed on the page, and output-shape validation now rejects straightforward `javascript:` hrefs. Two validator correctness gaps remain: missing representative pages are silently skipped by accessibility/print readiness checks, and output-shape JSON validation accepts artifacts whose count fields do not match their arrays.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Accessibility and print validators silently pass when representative pages are missing

**File:** `site/src/scripts/validate-accessibility-semantics.ts:144-148`, `site/src/scripts/validate-print-readiness.ts:197-200`

**Issue:** Both validators return/continue when a representative HTML file is absent, without adding a diagnostic. That means a partial `site/dist` can pass the accessibility and print-readiness gates for omitted routes instead of failing with an actionable missing-page error. This is not just cosmetic: `reading-paths/index.html` is a representative page in both validators, but it is not one of the required artifacts in `validate-output-shape.ts`, so the combined release gate can miss that route's accessibility/print contract entirely if no other link check exposes it.

**Fix:** Treat each absent representative page as a validation error unless dist validation is explicitly skipped. For example:

```ts
if (!existsSync(absolutePath)) {
  addError(
    errors,
    page.entryId,
    'page.missing',
    `site/dist/${page.path}`,
    'Representative page does not exist in static output',
    'Run the Astro build and ensure every representative route is generated before publishing.',
  );
  return;
}
```

Apply the same pattern to `validateRepresentativePages()` in the print-readiness validator.

### WR-02: Output-shape JSON checks accept empty or inconsistent artifacts

**File:** `site/src/scripts/validate-output-shape.ts:137-167`, `site/src/scripts/validate-output-shape.test.ts:35-40`

**Issue:** The JSON validators only require count fields and array presence; they do not check that the arrays actually contain the declared number of records. As written, `coverage-matrix.json` with `{ ownerCount: 13, owners: [] }` passes output-shape validation, and the test fixture bakes in exactly that invalid shape. The same pattern applies to `corpus-index.json`, `search-index.json`, `relation-index.json`, and `reading-paths-index.json`. This can certify deployable output with empty indexes/coverage data while displaying plausible count metadata.

**Fix:** Validate count/array consistency and, for fixed corpus artifacts, the required corpus size. For example:

```ts
function arrayLengthEquals(payload: unknown, key: string, expected: number): boolean {
  return hasObjectProperty(payload, key) && Array.isArray((payload as Record<string, unknown>)[key]) && (payload as Record<string, unknown>)[key].length === expected;
}

// coverage-matrix.json
validate: (payload) => numericPropertyEquals(payload, 'ownerCount', corpusEntries.length) && arrayLengthEquals(payload, 'owners', corpusEntries.length)
  ? null
  : `coverage-matrix.json must contain ownerCount ${corpusEntries.length} and ${corpusEntries.length} owners`,
```

For variable-size indexes, compare `recordCount`, `pathCount`, or equivalent count fields to the corresponding array length.

---

_Reviewed: 2026-05-22T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
