---
phase: 01-site-foundation-and-provenance-contract
verified: 2026-05-14T09:57:41Z
status: passed
score: 21/21 must-haves verified + 2/2 human checks approved
overrides_applied: 0
human_uat:
  status: passed
  approved: 2026-05-15T06:29:44Z
  source: 01-HUMAN-UAT.md
re_verification:
  previous_status: gaps_found
  previous_score: 20/21
  gaps_closed:
    - "Validation fails when canonical source fields point into archive paths unless the entry is provenance-only / FOUND-06 provenance exception is executable"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "MVP user-story correction"
    expected: "The team either reformats Phase 1 into the canonical MVP user-story form or explicitly accepts standard technical goal-backward verification for this foundation phase."
    why_human: "ROADMAP marks Phase 1 as mode: mvp, but the phase goal is not in the required user-story format; the local gsd-sdk user-story validator command is unavailable in this checkout."
  - test: "Visual inventory page review"
    expected: "The built /inventory/ page is readable, status is communicated by text rather than color alone, focus states are visible, and long source paths wrap without horizontal overflow on narrow screens."
    why_human: "Automated checks confirm generated HTML and CSS rules exist; browser-level visual quality still requires inspection."
---

# Phase 1: Site Foundation and Provenance Contract Verification Report

**Phase Goal:** The project has a separate, reproducible static site foundation that knows the corpus boundaries and rejects untraceable or archive-backed canonical content.
**Verified:** 2026-05-14T09:57:41Z
**Status:** passed
**Re-verification:** Yes — after FOUND-06 gap closure
**Human UAT:** Approved 2026-05-15T06:29:44Z in `01-HUMAN-UAT.md`.

## MVP Mode Guard

ROADMAP marks Phase 1 as `mode: mvp`, but the phase goal is not in the required user-story format (`As a ..., I want to ..., so that ...`). I attempted the centralized validator command:

```text
gsd-sdk query user-story.validate --story "The project has a separate, reproducible static site foundation that knows the corpus boundaries and rejects untraceable or archive-backed canonical content." --pick valid
```

It failed because this checkout's SDK/tool bridge does not expose `user-story.validate` (`Unknown command: user-story`). I therefore re-verified the previously reported blocker and the technical Phase 1 contract against ROADMAP success criteria, plan must-haves, and requirement IDs. This keeps the gap-closure result useful, but the MVP-mode format mismatch remains a human workflow decision.

## User Flow Coverage

Because the phase goal is not a valid MVP user story, these steps are derived from the builder-facing phase goal and plan-level stories rather than canonical MVP slots.

| Step | Expected | Evidence in codebase | Status |
|------|----------|----------------------|--------|
| Work inside static site boundary | Builder works under `site/` without root package files or corpus mutation | `site/package.json`, `site/astro.config.mjs`, `site/tsconfig.json`, and `site/bun.lock` live under `site/`; boundary check confirmed no root `package.json` or `bun.lock`. | VERIFIED |
| Run one build command | `bun run build` validates provenance, builds static HTML, writes local indexes | `site/package.json` chains `bun run validate && bun run build:astro && bun run index`; `cd /home/prannayag/harness_eng/site && bun run build` completed successfully. | VERIFIED |
| Inspect inventory output | Static inventory page renders the real thirteen-entry corpus inventory | `site/src/pages/inventory.astro` imports `corpusEntries` and `sourceStatusLabels`; build produced `/home/prannayag/harness_eng/site/dist/inventory/index.html`. | VERIFIED |
| Reject untraceable/archive-backed canonical content | Missing canonical paths and unmarked archive canonical paths fail validation, while explicitly provenance-only archive paths are allowed | Spot-checks showed missing path `ok: false`, canonical archive path `ok: false`, and provenance-only archive fixture `ok: true`. | VERIFIED |

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Builder can work inside a clearly bounded static site project without moving or replacing canonical `science/` or `pillars/` corpus files. | VERIFIED | Site package/config/source files are under `/home/prannayag/harness_eng/site`; boundary check confirmed no root `package.json` or `bun.lock`; generated outputs are under `site/dist`. |
| 2 | Builder can run one documented command that produces static HTML assets and local indexes without database, CMS, accounts, server runtime, or hosted search dependency. | VERIFIED | `site/package.json` defines `build`; `bun run build` completed, building 5 static pages, `dist/corpus-index.json`, and Pagefind local index files. Dependencies include Astro/Starlight and Pagefind, not DB/CMS/account services. |
| 3 | Builder can inspect a structured inventory covering the umbrella framework and all twelve pillars with required canonical source metadata. | VERIFIED | `site/src/data/corpus.ts` exports 13 parsed entries; `site/src/data/corpus.schema.ts` requires `canonicalTex`, `canonicalPdf`, and `sourceStatus`; `/inventory/` renders the typed inventory. |
| 4 | Validation fails when required canonical source paths are missing. | VERIFIED | `validate-corpus.ts` resolves paths against the repo root and checks `existsSync`; spot-check with `science/paper/does-not-exist.tex` returned `ok: false` and the expected missing-source diagnostic. |
| 5 | Validation prevents archive paths from being treated as canonical sources unless explicitly marked as provenance content. | VERIFIED | `validate-corpus.ts` computes `isProvenanceArchive = entry.sourceStatus === 'provenance-only' && archivePathPattern.test(pathValue)`; unmarked archive fixture fails, while provenance-only archive fixture with `science/archive/drafts/science-assembled.tex` returns `ok: true`. |
| 6 | Explicit provenance-only archive handling required by FOUND-06 and plan docs is executable. | VERIFIED | The previous gap is closed: `site/src/scripts/validate-corpus.test.ts` includes `allows provenance-only entries to reference existing archive paths`, and the inline runtime spot-check returned `{ "ok": true, "matchingErrors": [] }`. |
| 7 | Static Markdown math renders through the build-time math pipeline. | VERIFIED | `site/astro.config.mjs` wires `remarkMath` and `rehypeKatex`; `math-fixture.mdx` contains inline and block math; build generated `/math-fixture/index.html`. |
| 8 | Inventory source statuses are finite and include canonical, missing-source, archive-blocked, and provenance-only. | VERIFIED | `sourceStatusSchema` enum and `sourceStatusLabels` define exactly those four statuses; tests reject `archived`. |
| 9 | Generated local indexes live under `site/dist` and do not write into `science/` or `pillars/`. | VERIFIED | `generate-local-indexes.ts` resolves output inside site root and rejects paths outside `site/`; build wrote `/home/prannayag/harness_eng/site/dist/corpus-index.json`. |
| 10 | D-07 Phase 1 UI uses approved early foundation tokens and responsive path wrapping. | VERIFIED | `phase-1.css` defines required colors, spacing, typography, focus outline, `overflow-wrap: anywhere`, and `@media (max-width: 720px)` rules. |

**Score:** 21/21 must-haves verified and 2/2 human checks approved. Automated gap closure is complete, and the human verification items are recorded as passed in `01-HUMAN-UAT.md`.

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `site/package.json` | Bun-scoped package boundary and stable scripts | VERIFIED | Scripts include `validate`, `build:astro`, `index`, `build`, and `test`; full test and build commands passed. |
| `site/bun.lock` | Bun-generated dependency resolution | VERIFIED | File exists under `site/`. |
| `site/astro.config.mjs` | Static Astro/Starlight config with math plugins | VERIFIED | Uses static output, Starlight, `remarkMath`, and `rehypeKatex`; no SSR adapter found. |
| `site/src/content/docs/index.mdx` | Foundation docs and one-command build documentation | VERIFIED | Documents `bun run validate`, `bun run build`, corpus boundary, no server/CMS/hosted search, and `/inventory/` CTA. |
| `site/src/content/docs/math-fixture.mdx` | Math fixture | VERIFIED | Contains inline `$E = mc^2$` and block summation math. |
| `site/src/data/corpus.schema.ts` | Zod schema, types, expected ids, status labels | VERIFIED | Requires canonical metadata and defines 13 expected ids plus finite status labels. |
| `site/src/data/corpus.ts` | Explicit thirteen-entry inventory | VERIFIED | Contains umbrella plus all twelve pillars with canonical `.tex`, `.pdf`, `.bib`, and canonical status. |
| `site/src/data/corpus.test.ts` | Schema and coverage tests | VERIFIED | Tests expected ids, finite status set, required metadata, entry count, unique coverage, and canonical statuses. |
| `site/src/scripts/validate-corpus.ts` | Executable provenance validator | VERIFIED | Substantive and wired; rejects missing/unsafe/unmarked archive paths and now allows explicit provenance-only archive references. |
| `site/src/scripts/validate-corpus.test.ts` | Negative validation fixtures and provenance exception coverage | VERIFIED | Covers missing ids, missing paths, archive-as-canonical, canonical directory rules, absolute paths, traversal, all-error collection, and provenance-only archive allowance. |
| `site/src/content/docs/provenance-contract.mdx` | Contributor-facing provenance contract | VERIFIED | Documents exact pass/fail examples and the provenance-only archive exception now implemented by code. |
| `site/src/scripts/generate-local-indexes.ts` | Deterministic corpus JSON index writer | VERIFIED | Exports builder/writer, writes `corpus-index.json`, guards output under `site/`, no timestamps. |
| `site/src/scripts/generate-local-indexes.test.ts` | Index-generation tests | VERIFIED | Tests entry count, ordering, required entries, normalized internal paths, and `..` rejection. |
| `site/src/pages/inventory.astro` | Static inventory page | VERIFIED | Imports real inventory and labels, renders title/kind/slug/status/source/PDF/bibliography fields. |
| `site/src/styles/phase-1.css` | UI-SPEC foundation tokens | VERIFIED | Required colors, spacing, typography, visible focus, path wrapping, and responsive stacking present. |

Note: `gsd-sdk query verify.artifacts` reported `site/src/scripts/validate-corpus.test.ts` missing pattern `missing required corpus entry` because the test text is capitalized as `Missing required corpus entry`. Manual verification confirms the substantive test exists and passes.

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `site/package.json` | `site/astro.config.mjs` | `build:astro` invokes Astro | VERIFIED | `build:astro` is `astro build`; full build succeeded. |
| `site/astro.config.mjs` | `site/src/content/docs/math-fixture.mdx` | remark/rehype math pipeline | VERIFIED | Math plugins are configured; fixture page built. |
| `site/src/data/corpus.ts` | `site/src/data/corpus.schema.ts` | `parseCorpusEntries` | VERIFIED | `corpusEntries` is exported by parsing the literal array through the schema. |
| `site/package.json` | `site/src/scripts/validate-corpus.ts` | `validate` script | VERIFIED | `validate` is `bun run src/scripts/validate-corpus.ts`; command succeeded. |
| `site/src/scripts/validate-corpus.ts` | `site/src/data/corpus.ts` | imports `corpusEntries` | VERIFIED | Validator imports `corpusEntries`, `expectedCorpusIds`, and `parseCorpusEntries`. |
| `site/package.json` | `site/src/scripts/generate-local-indexes.ts` | `index` script | VERIFIED | `index` runs generator and Pagefind when HTML exists; full build succeeded. |
| `site/src/pages/inventory.astro` | `site/src/data/corpus.ts` | imports `corpusEntries` for static rendering | VERIFIED | Direct import present and page renders mapped entries. |
| `site/src/styles/phase-1.css` | `site/src/pages/inventory.astro` | stylesheet import and class names | VERIFIED | Page imports CSS and uses `phase-inventory__*` classes. |

## Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `site/src/pages/inventory.astro` | `corpusEntries` | `site/src/data/corpus.ts` parsed through `parseCorpusEntries()` | Yes — explicit 13-entry inventory | VERIFIED |
| `site/src/scripts/generate-local-indexes.ts` | `entries` in `buildCorpusIndex()` | default `corpusEntries` import | Yes — writes all 13 entries to `site/dist/corpus-index.json` | VERIFIED |
| `site/src/scripts/validate-corpus.ts` | `entries` in `validateCorpus()` | default `corpusEntries` import plus optional test fixtures | Yes — validates real inventory and injected invalid fixtures | VERIFIED |

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full site test suite passes | `cd /home/prannayag/harness_eng/site && bun run test` | 3 test files, 18 tests passed | PASS |
| Full build validates, builds HTML, emits indexes | `cd /home/prannayag/harness_eng/site && bun run build` | Validation OK, 5 static pages built, `corpus-index.json` written, Pagefind indexed 4 pages | PASS |
| Boundary and outputs exist | `test ! -f /home/prannayag/harness_eng/package.json && test ! -f /home/prannayag/harness_eng/bun.lock && test -f .../site/dist/index.html && test -f .../site/dist/inventory/index.html && test -f .../site/dist/corpus-index.json && test -d .../site/dist/pagefind` | Command exited 0 | PASS |
| Validator JSON output works | `cd /home/prannayag/harness_eng/site && bun run validate -- --json` | Returned `{ "ok": true, "total_entries": 13, "total_errors": 0, "errors": [] }` | PASS |
| Missing canonical source fails | Bun inline `validateCorpus()` fixture with `science/paper/does-not-exist.tex` | Returned `ok: false` with missing-path diagnostic | PASS |
| Unmarked archive canonical source fails | Bun inline `validateCorpus()` fixture with `pillars/security/archive/security_architecture.tex` and `sourceStatus: 'canonical'` | Returned `ok: false` with archive-path diagnostic | PASS |
| Provenance-only archive exception works | Bun inline `validateCorpus()` fixture with `science/archive/drafts/science-assembled.tex` and `sourceStatus: 'provenance-only'` | Returned `ok: true` and no matching errors | PASS |

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FOUND-01 | 01-01, 01-04 | Site implementation lives under clear boundary and does not move/replace corpus files | SATISFIED | Site package/config/source are under `site/`; no root package files; generator output constrained to `site/`. |
| FOUND-02 | 01-01, 01-04 | Static-site architecture with no DB/CMS/accounts/hosted search dependency | SATISFIED | Astro static output, Starlight docs, Pagefind local index; no server adapter or external service dependency. |
| FOUND-03 | 01-02, 01-04 | Structured corpus inventory covering umbrella and all twelve pillars | SATISFIED | `expectedCorpusIds` and `corpusEntries` contain 13 entries; tests and generated index confirm count. |
| FOUND-04 | 01-02, 01-03 | Schema requires canonical source metadata | SATISFIED | `corpusEntrySchema` requires `canonicalTex` and `canonicalPdf`; tests reject missing `canonicalTex`; bibliography optional. |
| FOUND-05 | 01-03 | Validation fails when required canonical source paths are missing | SATISFIED | `existsSync` check and spot-check missing source diagnostic; tests cover missing path. |
| FOUND-06 | 01-03 | Validation prevents archive paths from being treated as canonical sources unless explicitly marked as provenance content | SATISFIED | Unmarked archive paths fail; `sourceStatus: 'provenance-only'` archive fixture succeeds; test coverage exists. |
| FOUND-07 | 01-01, 01-03, 01-04 | Documented build command produces static HTML and local indexes reproducibly | SATISFIED | `index.mdx` documents `bun run build`; package script builds static HTML, deterministic `corpus-index.json`, and Pagefind index; command passed. |

No orphaned Phase 1 requirements were found: FOUND-01 through FOUND-07 are declared in plans and mapped in `/home/prannayag/harness_eng/.planning/REQUIREMENTS.md`.

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | - | - | No blocker or warning anti-patterns found in the re-verified gap files. |

## Human Verification Completed

### 1. MVP user-story correction

**Test:** Decide whether Phase 1 should be verified in MVP mode. If yes, reformat the phase goal into `As a ..., I want to ..., so that ...` and re-run verification.

**Expected:** The phase has a canonical user-story goal or the team explicitly accepts standard technical goal-backward verification for this foundation phase.

**Result:** PASS — human approval accepts standard technical goal-backward verification for this foundation phase.

### 2. Visual inventory page review

**Test:** Open `/inventory/` from the built site and inspect focus states, status labels, and narrow-screen source-path wrapping.

**Expected:** Inventory rows are readable, status is communicated by text rather than color alone, and long paths wrap without horizontal overflow.

**Result:** PASS — human approval accepts the built inventory page visual review.

## Gaps Summary

The previous FOUND-06 gap is closed. The validator now implements the provenance-only archive exception described by the requirement and docs, the focused test suite covers it, and runtime spot-checks confirm the behavior.

Automated tests and build pass. Human follow-up for the MVP-mode goal-format mismatch and browser-level visual review is complete, so the phase is marked `passed`.

---

_Verified: 2026-05-14T09:57:41Z_
_Verifier: Claude (gsd-verifier)_
