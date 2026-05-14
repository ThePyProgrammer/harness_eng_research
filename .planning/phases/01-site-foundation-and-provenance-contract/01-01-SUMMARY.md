---
phase: 01-site-foundation-and-provenance-contract
plan: 01
subsystem: site-foundation
tags: [astro, starlight, bun, markdown-math, katex, static-site]

requires: []
provides:
  - Bun-scoped Astro/Starlight workspace under site/
  - Static Astro configuration with build-time remark-math and rehype-katex pipeline
  - Foundation landing page documenting corpus boundary and stable commands
  - MDX math fixture proving static math rendering during build
  - Bun lockfile for workspace-local reproducible dependency resolution
affects: [phase-1-inventory, phase-1-provenance-validation, phase-2-book-shell, phase-4-local-search]

tech-stack:
  added: [astro, '@astrojs/starlight', bun, katex, remark-math, rehype-katex, pagefind, zod, typescript, vitest, '@astrojs/check', '@types/bun']
  patterns:
    - Isolated site package boundary under site/ only
    - Static Astro output with no SSR adapter
    - Starlight docs content loaded through docsLoader/docsSchema
    - Build-time Markdown math rendering through remark-math and rehype-katex

key-files:
  created:
    - site/package.json
    - site/bun.lock
    - site/astro.config.mjs
    - site/tsconfig.json
    - site/src/content.config.ts
    - site/src/content/docs/index.mdx
    - site/src/content/docs/math-fixture.mdx
  modified: []

key-decisions:
  - "Use site/ as the only package/application boundary for the static website foundation."
  - "Configure static Astro/Starlight output with build-time math plugins and no SSR adapter."
  - "Document bun run validate and bun run build as stable future-facing commands even though later plans provide their script targets."

patterns-established:
  - "Site workspace isolation: package files, lockfile, Astro config, and TypeScript config live under site/."
  - "Foundation docs stay contractual and concise rather than becoming the full reader-facing book shell."
  - "MDX math fixtures verify inline and block math through the static build pipeline."

requirements-completed: [FOUND-01, FOUND-02, FOUND-07]

duration: 6min
completed: 2026-05-14T08:37:52Z
---

# Phase 1 Plan 01: Site Foundation and Provenance Contract Summary

**Bun-scoped Astro/Starlight static site foundation with build-time KaTeX math rendering and a documented read-only corpus boundary**

## Performance

- **Duration:** 6 min
- **Started:** 2026-05-14T08:32:12Z
- **Completed:** 2026-05-14T08:37:52Z
- **Tasks:** 2 completed
- **Files modified:** 7 created, 0 modified

## Accomplishments

- Created an isolated `site/` workspace with Bun-local dependencies, scripts, lockfile, strict TypeScript config, and Starlight docs content configuration.
- Configured Astro for static output with `remark-math` and `rehype-katex`, avoiding SSR adapters, hosted services, databases, CMS integrations, accounts, or root package files.
- Added a foundation landing page that states the `site/` boundary, read-only `science/paper/` and `pillars/*/paper/` inputs, stable validation/build commands, and the `Inspect Corpus Inventory` CTA.
- Added an MDX math fixture containing inline `$E = mc^2$` and block summation math that passes the Astro static build.

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold isolated Astro/Starlight site workspace** - `168463a` (feat)
2. **Task 2: Add foundation landing page and math fixture** - `3cb2685` (feat)

**Plan metadata:** committed separately after summary creation.

## Files Created/Modified

- `site/package.json` - Bun-scoped package boundary, dependency set, and stable scripts for dev/check/validate/index/build/test.
- `site/bun.lock` - Bun-generated reproducible dependency resolution for the isolated site workspace.
- `site/astro.config.mjs` - Static Astro/Starlight configuration with docs sidebar entries and build-time math plugins.
- `site/tsconfig.json` - Strict Astro TypeScript baseline for future site code.
- `site/src/content.config.ts` - Minimal Starlight docs collection configuration using `docsLoader()` and `docsSchema()`.
- `site/src/content/docs/index.mdx` - Foundation page documenting corpus ownership boundaries and future stable commands.
- `site/src/content/docs/math-fixture.mdx` - Inline and block math fixture for the build-time math pipeline.

## Decisions Made

- Kept all application/package files inside `site/` to preserve the repository root as a LaTeX/Markdown corpus rather than a web application workspace.
- Used Astro/Starlight static output with build-time math plugins and no SSR adapter to satisfy the static v1 constraint.
- Left `validate` and `index` script targets pointing at later-plan files as required by the plan interface; only `build:astro` and `check` are expected to pass in Plan 01.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `bun run build:astro` emitted a non-blocking Starlight message for the generated 404 route and a sitemap warning because no `site` URL is configured. Static output still completed successfully. Deployment-specific configuration is explicitly deferred by D-03, so no change was made.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None found in created/modified files.

## Threat Flags

None - the plan introduced a static site package boundary and authored MDX pages only; no new server endpoint, auth path, file mutation path, or schema trust boundary beyond the planned static Markdown/MDX build surface.

## Verification

- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-aeec524c56a7f1d4e/site && bun install`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-aeec524c56a7f1d4e/site && bun run check`
- `cd /home/prannayag/harness_eng/.claude/worktrees/agent-aeec524c56a7f1d4e/site && bun run build:astro`
- Acceptance grep/file checks for package boundary, scripts, math plugins, strict TypeScript, landing page copy, corpus paths, and math fixture content.

## Self-Check: PASSED

- FOUND: `site/package.json`
- FOUND: `site/bun.lock`
- FOUND: `site/astro.config.mjs`
- FOUND: `site/tsconfig.json`
- FOUND: `site/src/content.config.ts`
- FOUND: `site/src/content/docs/index.mdx`
- FOUND: `site/src/content/docs/math-fixture.mdx`
- FOUND: task commit `168463a`
- FOUND: task commit `3cb2685`

## Next Phase Readiness

Plan 02 can add the explicit typed corpus inventory and inventory page against the established `site/` boundary. Plan 03/04 can provide `src/scripts/validate-corpus.ts` and `src/scripts/generate-local-indexes.ts` so the already-declared `bun run build` command becomes fully executable.

---
*Phase: 01-site-foundation-and-provenance-contract*
*Completed: 2026-05-14T08:37:52Z*
