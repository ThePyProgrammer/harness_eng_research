---
phase: 03-curated-corpus-chapters-and-formal-registry
reviewed: 2026-05-19T00:00:00Z
depth: standard
files_reviewed: 18
files_reviewed_list:
  - site/package.json
  - site/src/components/formal/ConceptCard.astro
  - site/src/components/formal/formal-components.test.ts
  - site/src/components/formal/FormalObjectList.astro
  - site/src/components/formal/TheoremBlock.astro
  - site/src/data/book-spine.test.ts
  - site/src/data/chapters.ts
  - site/src/data/concepts.ts
  - site/src/data/corpus.schema.ts
  - site/src/data/formal-registry.schema.ts
  - site/src/data/formal-registry.test.ts
  - site/src/data/formal-registry.ts
  - site/src/pages/corpus/[slug].astro
  - site/src/pages/formal-registry/index.astro
  - site/src/pages/glossary/index.astro
  - site/src/scripts/validate-formal-registry.test.ts
  - site/src/scripts/validate-formal-registry.ts
  - site/src/styles/atlas.css
findings:
  critical: 0
  warning: 2
  info: 0
  total: 2
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-05-19T00:00:00Z
**Depth:** standard
**Files Reviewed:** 18
**Status:** issues_found

## Summary

Reviewed the Phase 3 formal registry data, schema, validator, Astro pages/components, tests, and atlas styling. The implementation is mostly structured, but two correctness gaps remain: corpus chapter concept cards emit broken intra-page links for concepts that are not rendered on that page, and the validator does not validate citation records' own schema or source trails even though citation provenance is part of the public source-trail contract.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Corpus chapter concept cards generate broken related-concept anchors

**File:** `site/src/components/formal/ConceptCard.astro:75-78`

**Issue:** `ConceptCard` always renders related concepts as same-page anchors (`href="#${conceptId}"`). That works on `/glossary/`, where every concept card is rendered, but `site/src/pages/corpus/[slug].astro:230-232` reuses the component while passing only `chapter.conceptIds`. The umbrella concept has `relatedConceptIds` for every pillar in `site/src/data/concepts.ts:176`, while the umbrella chapter renders only `harness-architecture` from `site/src/data/chapters.ts:53`; similarly, pillar chapter pages render the harness concept whose related pillar concepts are mostly absent from the page. Result: many published corpus-page links point to IDs that do not exist on that page, breaking the wiki-style cross-link contract.

**Fix:** Make `ConceptCard` route related concepts to a page that actually contains the target, or pass page-local concept IDs and fall back to `/glossary/` for absent IDs. For example:

```astro
interface Props {
  concept: ConceptRecord;
  ownerLookup: OwnerLookup;
  formalObjectLookup: FormalObjectLookup;
  conceptLookup: ConceptLookup;
  localConceptIds?: string[];
}

const { concept, ownerLookup, formalObjectLookup, conceptLookup, localConceptIds = [] } = Astro.props;
const localConceptIdSet = new Set(localConceptIds);

// ...
return (
  <a href={localConceptIdSet.has(conceptId) ? `#${conceptId}` : `/glossary/#${conceptId}`}>
    {related?.term ?? conceptId}
  </a>
);
```

Then pass `localConceptIds={concepts.map((item) => item.id)}` from `site/src/pages/corpus/[slug].astro` and keep glossary links local by passing the full registry ID set.

### WR-02: Formal registry validator skips citation record schema and source-trail validation

**File:** `site/src/scripts/validate-formal-registry.ts:310-323`

**Issue:** `validateFormalRegistry` validates formal objects, chapters, concepts, and their source trails, then only uses `citationInput` as an ID set in `validateTargets`. It never validates each citation record against `citationRecordSchema`, and it never calls `validateSourceTrail` for `citationInput`. A citation can therefore have a malformed shape or a missing/archive/absolute/traversal source path while `bun run validate` still reports success, even though citations are exposed as source-backed records in the corpus pages (`site/src/pages/corpus/[slug].astro:236-241`) and the project requires source-of-truth links back to canonical material.

**Fix:** Import `citationRecordSchema`, validate citation shapes, and run source-trail validation for citations before target validation. For example:

```ts
import {
  chapterRecordSchema,
  citationRecordSchema,
  conceptRecordSchema,
  // ...
} from '../data/formal-registry.schema';

function validateCitationRecords(
  citationInput: CitationRecord[],
  repoRoot: string,
  errors: FormalRegistryValidationError[],
): void {
  for (const citation of citationInput) {
    const result = citationRecordSchema.safeParse(citation);
    if (!result.success) {
      addError(errors, citation.id ?? 'citation', 'schema', citation.id ?? 'unknown', result.error.message, 'Fix the citation record shape.');
      continue;
    }
    validateSourceTrail(citation.id, sourceOwnerFromPath(citation.sourceTrail[0]?.path ?? '') ?? citation.id, citation.sourceTrail, repoRoot, errors);
  }
}

// In validateFormalRegistry, before validateTargets:
validateCitationRecords(citationInput, repoRoot, errors);
```

If citation ownership should be explicit rather than inferred from paths, add an `ownerId` to `CitationRecord` and use that for `validateSourceTrail`.

---

_Reviewed: 2026-05-19T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
