---
phase: 01-site-foundation-and-provenance-contract
plan: 03
subsystem: site-foundation
tags: [provenance-validation, corpus-inventory, bun, vitest, docs]

requires:
  - Typed corpus schema and thirteen-entry inventory from Plan 01-02
  - Bun-scoped Astro/Starlight workspace from Plan 01-01
provides:
  - Executable corpus provenance validator for canonical paths
  - Negative validation coverage for missing ids, missing paths, archive paths, absolute paths, and parent traversal
  - Contributor-facing provenance contract documentation with exact diagnostics
affects: [phase-1-provenance-validation, phase-2-book-shell, phase-4-local-search]

tech-stack:
  added: []
  patterns:
    - Structured validation errors with exact UI-SPEC diagnostic formatting
    - Bun CLI validator with plain and JSON output modes
    - Filesystem validation against project-root-relative canonical paths

key-files:
  created:
    - site/src/scripts/validate-corpus.ts
    - site/src/scripts/validate-corpus.test.ts
    - site/src/content/docs/provenance-contract.mdx
  modified:
    - .gitignore

key-decisions:
  - "Validate provenance by collecting all structured errors rather than failing after the first invalid entry."
  - "Resolve inventory paths against the repository root while printing only project-relative paths in diagnostics."
  - "Treat site/dist/ as generated Astro build output and ignore it alongside site/.astro/."

patterns-established:
  - "Every validator diagnostic formats as: Entry {id}: {field} points to {path}. {reason}. {next step}."
  - "Canonical inventory path fields are checked for absolute paths, parent traversal, archive segments, file extension, and filesystem existence."

requirements-completed: [FOUND-04, FOUND-05, FOUND-06, FOUND-07]

duration: 8min
completed: 2026-05-14T09:05:26Z
---

# Phase 1 Plan 03: Executable Provenance Gate Summary

**Bun-powered corpus provenance validator that rejects missing, unsafe, and archive-backed canonical references before static publication**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-14T08:57:20Z
- **Completed:** 2026-05-14T09:05:26Z
- **Tasks:** 3 completed
- **Files modified:** 3 created, 1 modified

## Accomplishments

- Added `site/src/scripts/validate-corpus.test.ts` with RED-first negative coverage for missing required ids, archive-as-canonical paths, missing filesystem paths, absolute paths, and parent traversal.
- Implemented `site/src/scripts/validate-corpus.ts` with exported `ValidationError`, `ValidationResult`, `validateCorpus()`, and `formatValidationError()` interfaces/functions for tests and CLI reuse.
- Validator now parses entries through the Zod schema, requires all expected corpus ids exactly once, rejects duplicate ids, and validates `canonicalTex`, `canonicalPdf`, and optional `bibliography` paths.
- Added path safety checks for project-root-relative paths, parent traversal, archive segments unless `sourceStatus === 'provenance-only'`, required file suffixes, and filesystem existence.
- Implemented Bun CLI behavior with plain success/errors by default, optional `--json`, stdout on success, stderr on failure, and non-zero exit for invalid provenance.
- Authored `site/src/content/docs/provenance-contract.mdx` documenting the executable contract, required fields, canonical path rules, and exact pass/fail diagnostics.
- Added `site/dist/` to `.gitignore` because `bun run build:astro` generates static build output locally.

## Task Commits

Each task was committed atomically:

1. **Task 1: Test negative provenance validation cases** - `35d5be5` (test)
2. **Task 2: Implement fail-fast corpus validator CLI** - `44ddb59` (feat)
3. **Task 3: Document executable provenance contract** - `baf719a` (docs)

**Plan metadata:** committed separately after summary creation.

## Files Created/Modified

- `site/src/scripts/validate-corpus.ts` - Executable validator, reusable validation types/functions, path safety checks, schema parsing, plain/JSON CLI output, and process exit behavior.
- `site/src/scripts/validate-corpus.test.ts` - Vitest coverage for valid inventory, missing ids, archive-as-canonical exact diagnostic, missing source paths, absolute paths, parent traversal, and all-error collection.
- `site/src/content/docs/provenance-contract.mdx` - Contributor documentation for the provenance gate, inventory fields, canonical path rules, and exact validation diagnostics.
- `.gitignore` - Added `site/dist/` for generated Astro build output.

## Decisions Made

- Collected all validator errors in one run so contributors can fix a batch of inventory issues without repeated fail/repair cycles.
- Kept diagnostic paths project-relative only; the validator resolves against the filesystem internally but does not print absolute host paths.
- Used a security-specific archive fix step for the required UI-SPEC diagnostic and a generic owning-paper-directory fix step for other entries.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed site dependencies before RED verification**
- **Found during:** Task 1
- **Issue:** `bun run test -- src/scripts/validate-corpus.test.ts` failed because `vitest` was not installed in the worktree-local `site/node_modules`.
- **Fix:** Ran `bun install` inside `site/`, restoring dependencies declared in `site/package.json` without changing package manifests.
- **Files modified:** None tracked.
- **Commit:** N/A

**2. [Rule 3 - Blocking] Ignored generated Astro static output**
- **Found during:** Task 3
- **Issue:** `bun run build:astro` generated untracked `site/dist/` output, leaving the worktree dirty after required verification.
- **Fix:** Added `site/dist/` to `.gitignore` as generated static build output.
- **Files modified:** `.gitignore`
- **Commit:** `baf719a`

## Issues Encountered

- RED verification failed as expected with four failing tests against the temporary validator skeleton.
- `bun run build:astro` still emits the known non-blocking Starlight 404 message and sitemap warning because no `site` URL is configured; static build completes successfully.
- No authentication gates or external service setup were encountered.

## User Setup Required

None.

## Known Stubs

None found in created/modified files.

## Threat Flags

None - the plan introduced the planned build-time filesystem validation trust boundary only. No new network endpoints, authentication paths, file mutation paths, or schema changes outside the planned validator surface were added.

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a765b66c8d100dd4e/site && bun run test -- src/scripts/validate-corpus.test.ts` - 6 tests passed.
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a765b66c8d100dd4e/site && bun run validate` - `OK: 13 corpus entries validated, 0 errors found.`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-a765b66c8d100dd4e/site && bun run build:astro` - 4 static pages built successfully.
- Acceptance grep checks passed for required validator exports, archive/path/missing-source reason strings, exact OK message, provenance docs examples, `science/paper/`, `pillars/*/paper/`, and `sourceStatus`.

## Self-Check: PASSED

- FOUND: `site/src/scripts/validate-corpus.ts`
- FOUND: `site/src/scripts/validate-corpus.test.ts`
- FOUND: `site/src/content/docs/provenance-contract.mdx`
- FOUND: `.gitignore`
- FOUND: `.planning/phases/01-site-foundation-and-provenance-contract/01-03-SUMMARY.md`
- FOUND: task commit `35d5be5`
- FOUND: task commit `44ddb59`
- FOUND: task commit `baf719a`

## Next Phase Readiness

Plan 04 can rely on `bun run validate` as an executable provenance gate before generating local static indexes or adding inventory-driven pages.

---
*Phase: 01-site-foundation-and-provenance-contract*
*Completed: 2026-05-14T09:05:26Z*
