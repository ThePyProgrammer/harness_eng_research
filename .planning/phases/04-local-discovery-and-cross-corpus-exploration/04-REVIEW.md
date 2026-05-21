---
phase: 04-local-discovery-and-cross-corpus-exploration
reviewed: 2026-05-21T10:47:16Z
depth: standard
files_reviewed: 20
status: fixed
findings:
  critical: 4
  warning: 1
  info: 1
  total: 6
fix_commit: 98a7854
---

# Phase 04: Code Review Report

**Depth:** standard  
**Files reviewed:** 20  
**Status:** fixed

## Summary

The advisory code review found TypeScript/Astro validation blockers in the Phase 4 discovery implementation. I verified the findings by running:

```bash
cd site && bun run check
```

The check reproduced 6 TypeScript errors. The fixes were applied in commit `98a7854`.

## Findings and Resolution

### CR-01: `relations.ts` readonly tuple assigned to mutable relation metadata

**File:** `site/src/data/relations.ts`

`allFamilies` is declared `as const`, but `RelationTypeRecord.allowedSourceFamilies` expects a mutable array.

**Resolution:** Spread the tuple when assigning `allowedSourceFamilies`.

### CR-02: page search records omitted required `aliases`

**File:** `site/src/scripts/generate-local-indexes.ts`

`pageRecords()` returned `DiscoverySearchRecord[]` without `aliases`, while the parsed output type requires `aliases: string[]`.

**Resolution:** Added `aliases: []` to page search records.

### CR-03: chapter relation targets were typed as arbitrary strings

**Files:**
- `site/src/data/discovery.schema.ts`
- `site/src/components/discovery/RelatedLinks.astro`

`RelationTarget.id` was previously an unconstrained string, so chapter targets could not safely index maps keyed by corpus owner IDs.

**Resolution:** Changed `relationTargetSchema` to a discriminated union that narrows chapter IDs to `ownerIdSchema` and preserves stricter IDs for formal objects, concepts, citations, and reading paths.

### CR-04: invalid relation direction fixture did not compile

**File:** `site/src/scripts/validate-discovery.test.ts`

The negative test intentionally injects invalid fixture data, but the mutation was rejected at TypeScript compile time.

**Resolution:** Localized the type escape to the invalid fixture values with `as never`.

### WR-01: graph validation conflated registry nodes with generated graph nodes

**File:** `site/src/scripts/validate-discovery.ts`

Neighborhood validation checked against registry target IDs instead of generated graph node IDs.

**Resolution:** Validate neighborhood IDs against the generated `nodeIds` set.

### IN-01: unused `chapterRegistry` import

**File:** `site/src/scripts/generate-local-indexes.ts`

**Resolution:** Removed the unused import.

## Verification After Fix

All checks pass after commit `98a7854`:

```bash
cd site && bun run check
cd site && bun run build
cd site && bun test
```

Results:

- `astro check`: 0 errors, 0 warnings, 0 hints
- `bun run build`: passed
- `bun test`: 116 pass, 0 fail
