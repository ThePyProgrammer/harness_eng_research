# Phase 01: Site Foundation and Provenance Contract - Research

**Researched:** 2026-05-14
**Domain:** Static documentation site foundation, corpus provenance validation, typed inventory, local indexes
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

## Implementation Decisions

### Site Boundary
- **D-01:** Create a new top-level `site/` workspace for the static site project. Do not place application/package files at the repository root or under `docs/`.
- **D-02:** Treat `science/` and `pillars/` as read-only canonical inputs during site builds. Site code may read/link to those paths, but must not move, replace, or take ownership of canonical corpus files.
- **D-03:** Phase 1 should prove local static output only. Deployment-specific wiring and hosting configuration are deferred to release readiness.
- **D-04:** Enforce corpus boundary discipline through validation gates. Phase 1 should include executable validation that catches invalid inventory/source references rather than relying on docs alone.

### Stack Choice
- **D-05:** Prefer Astro/Starlight as the static-site baseline for research and planning. It should be treated as the default unless research finds a hard blocker for the project’s math, provenance, or static output needs.
- **D-06:** Use Bun as the package manager and command runner for the new `site/` workspace unless framework research finds a hard blocker.
- **D-07:** Allow an early theme base in phase 1, but do not build the full custom reader-facing shell. Theme work should be limited to foundations that unblock later book/design phases.
- **D-08:** Set up the full static math-rendering toolchain in phase 1. Formal block design and large-scale formal content still belong to later phases, but math rendering should not be left as a placeholder.

### Corpus Inventory
- **D-09:** Optimize the phase-1 inventory for the source contract, not navigation data or the full formal object registry.
- **D-10:** Author the initial inventory as explicit typed data under `site/`, not as a fully generated filesystem scan.
- **D-11:** Validation must require the inventory to cover the umbrella framework plus all twelve pillar areas before phase 1 can pass.
- **D-12:** Each inventory entry must include core provenance metadata: id, kind, title, slug, summary, canonical `.tex` path, canonical PDF path, bibliography path when present, and source status.

### Provenance Rules
- **D-13:** Missing required canonical source paths must hard-fail validation with clear diagnostics naming the inventory entry and path.
- **D-14:** Provenance metadata is file-level in phase 1. Stable section anchors and formal-object anchors are deferred to the formal registry/content phases.
- **D-15:** Provenance validation must be both executable and documented: include a script/command and contributor-facing documentation for what the contract requires.

### Claude's Discretion
- **D-16:** Archive path handling is delegated to Claude/planner discretion. Default to strict behavior: canonical source paths containing `/archive/` should fail validation unless the entry is explicitly marked as provenance-only content.

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Site implementation lives under a clear project boundary that does not move or replace canonical `science/` or `pillars/` corpus files | Use `site/` as the only package boundary; validation reads corpus paths through project-root-relative strings and never writes to corpus directories. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| FOUND-02 | Site build uses a static-site architecture with no server-side database, CMS, accounts, or hosted search dependency | Use Astro/Starlight static prerendering with Pagefind static search/index output; do not add SSR adapters, database clients, CMS SDKs, or account/session dependencies. [CITED: https://starlight.astro.build/reference/configuration/] [CITED: https://pagefind.app/] |
| FOUND-03 | Site has a structured corpus inventory covering the umbrella framework and all twelve pillars | Implement explicit typed inventory with thirteen required ids: umbrella plus the twelve pillars listed in `pillars/README.md`. [VERIFIED: /home/prannayag/harness_eng/pillars/README.md] |
| FOUND-04 | Site content schema requires canonical source metadata for pillar chapters and formal objects | Use TypeScript/Zod schemas for inventory and provenance fields; Astro content collections also support Zod schema validation for content/data entries. [CITED: https://docs.astro.build/en/guides/content-collections/] |
| FOUND-05 | Site validation fails when required canonical source paths are missing | Implement a Bun/TypeScript validation script that checks path existence for required canonical `.tex`, PDF, and bibliography metadata. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md] |
| FOUND-06 | Site validation prevents archive paths from being treated as canonical sources unless explicitly marked as provenance content | Implement strict archive rejection for canonical fields containing `/archive/` unless `sourceStatus` is `provenance-only`; archive directories are non-canonical in project docs. [VERIFIED: /home/prannayag/harness_eng/science/README.md] [VERIFIED: /home/prannayag/harness_eng/pillars/README.md] |
| FOUND-07 | Site has a documented build command that produces static HTML assets and local indexes reproducibly | Define one command such as `bun run build` that runs validation, Astro build, and static index generation. [CITED: https://docs.astro.build/en/reference/cli-reference/] [CITED: https://pagefind.app/docs/running-pagefind/] |
</phase_requirements>

## Summary

Use a new top-level `site/` workspace with Astro 6.3.2, Starlight 0.39.2, Bun 1.3.12, TypeScript 6.0.3, Zod 4.4.3, and a static math/search toolchain. [VERIFIED: npm registry] [VERIFIED: local environment] This stack matches the locked Phase 1 decision to prefer Astro/Starlight and Bun, and no hard blocker was found for static output, local indexes, typed provenance metadata, or build-time validation. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md] [CITED: https://starlight.astro.build/reference/configuration/]

The key planning point is that Phase 1 is not “build the book.” It is “build the contract that prevents the future book from lying.” The foundation should create a minimal Starlight site, an explicit thirteen-entry corpus inventory, a provenance validator, static math rendering, and a documented one-command build that emits HTML and local indexes without a server, database, CMS, accounts, or hosted search. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]

**Primary recommendation:** Plan a thin `site/` package with `bun run validate`, `bun run build`, typed `src/data/corpus.ts`, generated/static index artifacts under `dist/`, and contributor docs that make provenance failure cases explicit. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]

## Project Constraints (from CLAUDE.md)

- Canonical content comes from `science/paper/` and `pillars/*/paper/`; website pages must link back to these sources rather than becoming untraceable forks. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- v1 must include the umbrella paper and all twelve pillars; a narrow one-pillar demo is insufficient. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- v1 should include full derivations where the corpus supports them; Phase 1 only prepares math rendering and provenance structure, not full derivation content. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]
- v1 must remain static and avoid unnecessary server/runtime complexity. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- Navigation must eventually support book-chapter reading and wiki/graph-style exploration; Phase 1 must not implement the full navigation experience. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md] [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]
- Search must be local/static with no hosted search service or database for v1. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- Visual identity should be original and book-like, not a close clone of Thinking Machines Lab; Phase 1 UI is limited to foundation/provenance surfaces. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]
- Do not treat `archive/` material as active source unless a page explicitly discusses provenance. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]
- Before file-changing implementation work, use the GSD workflow entry points; this research was requested by the GSD phase workflow and writes only the requested planning artifact. [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Static site foundation | Static build system | Browser / Client | Astro/Starlight owns HTML generation; client receives static pages with minimal JS. [CITED: https://starlight.astro.build/reference/configuration/] |
| Corpus inventory | Static build system | Repository filesystem | Typed inventory lives under `site/`; validation resolves paths against repository corpus files. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md] |
| Provenance validation | Static build system | Repository filesystem | Build-time script must fail before publishing invalid source references. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| Math rendering foundation | Static build system | Browser / Client | Prefer build-time Markdown math rendering with KaTeX CSS; avoid runtime-only math placeholders. [CITED: https://github.com/remarkjs/remark-math/blob/main/readme.md] [CITED: https://katex.org/docs/autorender] |
| Local search/index baseline | Static build system | Browser / Client | Pagefind indexes built static HTML and emits static search assets; browser reads generated index without a server. [CITED: https://pagefind.app/docs/running-pagefind/] |
| Phase 1 UI surfaces | Static build system | Browser / Client | Minimal landing/inventory/diagnostic docs are rendered statically and constrained by UI-SPEC. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | 6.3.2, modified 2026-05-13 | Static site framework and build CLI | Astro supports content-focused static sites, content collections, and build-time generation. [VERIFIED: npm registry] [CITED: https://docs.astro.build/en/guides/content-collections/] |
| `@astrojs/starlight` | 0.39.2, modified 2026-05-08 | Documentation/book-style site foundation | Starlight provides docs navigation, default Pagefind search, static prerender defaults, and plugin hooks. [VERIFIED: npm registry] [CITED: https://starlight.astro.build/reference/configuration/] |
| `typescript` | 6.0.3, modified 2026-04-16 | Type-safe inventory, validation scripts, and config | The project conventions favor type-safe TypeScript where TypeScript is used. [VERIFIED: npm registry] [VERIFIED: /home/prannayag/harness_eng/CLAUDE.md] |
| `zod` | 4.4.3, modified 2026-05-04 | Runtime schema validation for inventory/provenance metadata | Astro content collections use Zod schemas, and Zod also fits standalone validation scripts. [VERIFIED: npm registry] [CITED: https://docs.astro.build/en/guides/content-collections/] |
| `katex` | 0.16.46, modified 2026-05-13 | Static math rendering output and CSS | KaTeX renders TeX math to HTML and has official auto-render/server-rendering documentation. [VERIFIED: npm registry] [CITED: https://katex.org/docs/autorender] |
| `remark-math` | 6.0.0, modified 2023-11-20 | Markdown math parsing | The remark-math project provides the Markdown math syntax extension used before KaTeX rendering. [VERIFIED: npm registry] [CITED: https://github.com/remarkjs/remark-math/blob/main/readme.md] |
| `rehype-katex` | 7.0.1, modified 2024-08-19 | Build-time math-to-KaTeX HTML transform | The remark-math docs identify `rehype-katex` as the KaTeX HTML rendering plugin for Markdown math. [VERIFIED: npm registry] [CITED: https://github.com/remarkjs/remark-math/blob/main/packages/rehype-katex/readme.md] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `pagefind` | 1.5.2, modified 2026-04-12 | Post-build static search index generation | Use in `bun run build` after Astro emits `dist/`; Starlight also enables Pagefind by default. [VERIFIED: npm registry] [CITED: https://pagefind.app/docs/running-pagefind/] |
| `vitest` | 4.1.6, modified 2026-05-11 | Fast unit tests for validation and inventory rules | Use for validator unit tests and negative fixtures if planner includes automated tests. [VERIFIED: npm registry] |
| `@astrojs/check` | 0.9.9, modified 2026-04-28 | Astro type/content checking | Use in a `check` script to catch Astro/content typing issues before build. [VERIFIED: npm registry] |
| `starlight-links-validator` | 0.24.0, modified 2026-04-27 | Validate internal links in Markdown/MDX | Add only if Phase 1 includes enough internal source/documentation links to justify it; full link hardening is Phase 5. [VERIFIED: npm registry] [CITED: https://github.com/HiDeoo/starlight-links-validator] |
| `@types/bun` | 1.3.14, modified 2026-05-13 | Bun runtime types for validation scripts | Use if scripts import Bun APIs. [VERIFIED: npm registry] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro/Starlight | VitePress or Docusaurus | Context locked Astro/Starlight as default, and no hard blocker was found; do not re-open unless implementation hits math/static-output blockers. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md] |
| Pagefind | Hosted Algolia DocSearch | Hosted search violates Phase 1/v1 local-static search constraints. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] [CITED: https://starlight.astro.build/guides/site-search/] |
| Explicit typed inventory | Generated filesystem scan | Context locks explicit typed data under `site/`; generated scanning can miss provenance semantics and make invalid source ownership look automatic. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md] |
| Build-time KaTeX pipeline | Browser-only auto-render | Build-time rendering better supports static output, source review, and representative fixture validation; auto-render is documented but creates runtime dependence. [CITED: https://github.com/remarkjs/remark-math/blob/main/readme.md] [CITED: https://katex.org/docs/autorender] |

**Installation:**
```bash
cd site
bun add astro @astrojs/starlight typescript zod katex remark-math rehype-katex pagefind
bun add -d vitest @astrojs/check @types/bun
```

**Version verification:** Package versions above were checked with `npm view [package] version time.modified` on 2026-05-14. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```text
Developer runs `bun run build` inside site/
        |
        v
`bun run validate`
        |
        +--> Load explicit typed corpus inventory (`site/src/data/corpus.ts`)
        |       |
        |       +--> Enforce 13 required entries: umbrella + 12 pillars
        |       +--> Validate required fields: id/kind/title/slug/summary/source paths/status
        |       +--> Reject missing canonical files
        |       +--> Reject `/archive/` canonical paths unless provenance-only
        |
        v
Astro/Starlight static build
        |
        +--> Minimal landing page
        +--> Corpus inventory page
        +--> Provenance contract/diagnostics docs
        +--> Build-time Markdown math via remark-math + rehype-katex + KaTeX CSS
        |
        v
`dist/` static HTML assets
        |
        v
Pagefind/static local index generation
        |
        v
Deployable static output with no database, CMS, accounts, server runtime, or hosted search
```

This data flow keeps corpus files as read-only inputs and places all site ownership under `site/`. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]

### Recommended Project Structure

```text
site/
├── package.json                 # Bun scripts and workspace-local dependencies
├── bun.lock                     # Reproducible dependency resolution
├── astro.config.mjs             # Astro/Starlight config, static output, math plugins
├── tsconfig.json                # Strict TypeScript settings for site code
├── src/
│   ├── content.config.ts         # Astro content collection schemas if docs/content are loaded through collections
│   ├── data/
│   │   ├── corpus.ts             # Explicit thirteen-entry corpus inventory
│   │   └── corpus.schema.ts      # Zod schema and expected ids/source-status enum
│   ├── pages/
│   │   └── inventory.astro       # Minimal inventory/status surface
│   ├── styles/
│   │   └── phase-1.css           # UI-SPEC tokens and Phase 1-only theme foundations
│   └── scripts/
│       ├── validate-corpus.ts    # Hard-fail provenance validator
│       └── generate-local-indexes.ts # Optional lightweight JSON index if separate from Pagefind
└── src/content/docs/
    ├── index.mdx                 # Landing/foundation page
    └── provenance-contract.mdx   # Contributor-facing provenance docs and failure examples
```

This structure keeps package files out of the repository root and `docs/`, satisfying D-01. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]

### Pattern 1: Explicit Typed Inventory

**What:** Represent the umbrella framework and each pillar as literal typed data with required provenance fields and source status. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]

**When to use:** Use for all Phase 1 corpus references; do not generate the first inventory from a scan. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]

**Example:**
```typescript
// Source: Astro/Zod content-schema pattern cited from https://docs.astro.build/en/guides/content-collections/
import { z } from 'zod';

export const sourceStatusSchema = z.enum(['canonical', 'missing-source', 'archive-blocked', 'provenance-only']);
export const corpusEntrySchema = z.object({
  id: z.string(),
  kind: z.enum(['umbrella', 'pillar']),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  canonicalTex: z.string(),
  canonicalPdf: z.string(),
  bibliography: z.string().optional(),
  sourceStatus: sourceStatusSchema,
});
```

### Pattern 2: Fail-Fast Provenance Validation

**What:** Validate required entry coverage, required fields, filesystem existence, and archive-path restrictions before Astro build. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]

**When to use:** Run in every build/check command before generating HTML so invalid source references cannot produce a successful static site. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]

**Example:**
```typescript
// Source: Phase requirement FOUND-05/FOUND-06 in /home/prannayag/harness_eng/.planning/REQUIREMENTS.md
const archivePattern = /(^|\/)archive(\/|$)/;

if (archivePattern.test(entry.canonicalTex) && entry.sourceStatus !== 'provenance-only') {
  throw new Error(
    `Entry ${entry.id}: canonicalTex points to ${entry.canonicalTex}. ` +
    'Archive paths cannot be canonical sources. Move the reference to paper/ or mark provenance-only.'
  );
}
```

### Pattern 3: Static Math Pipeline

**What:** Configure Markdown math parsing with `remark-math` and HTML rendering with `rehype-katex`, and include KaTeX CSS in the site. [CITED: https://github.com/remarkjs/remark-math/blob/main/readme.md]

**When to use:** Use in Phase 1 for fixture pages and future formal content readiness; do not wait until full formal registry work. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]

**Example:**
```javascript
// Source: remark-math docs, https://github.com/remarkjs/remark-math/blob/main/readme.md
import starlight from '@astrojs/starlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { defineConfig } from 'astro/config';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [starlight({ title: 'Harness Architecture Book Wiki' })],
});
```

### Pattern 4: One Documented Static Build Command

**What:** Make `bun run build` the reproducible command that validates, builds static HTML, and emits local indexes. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]

**When to use:** Document this on the Phase 1 landing/provenance page and in `site/package.json`. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]

**Example:**
```json
{
  "scripts": {
    "validate": "bun run src/scripts/validate-corpus.ts",
    "build:astro": "astro build",
    "index": "pagefind --site dist",
    "build": "bun run validate && bun run build:astro && bun run index"
  }
}
```

### Anti-Patterns to Avoid

- **Root package sprawl:** Do not create root `package.json`, root `astro.config.*`, or root lockfiles for this phase; site tooling belongs under `site/`. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]
- **Filesystem scan as authority:** Do not make “whatever files exist” the source contract; explicit inventory is locked. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]
- **Archive as canonical fallback:** Do not resolve missing canonical paths to `archive/` files; archive material is non-canonical unless explicitly provenance-only. [VERIFIED: /home/prannayag/harness_eng/science/README.md] [VERIFIED: /home/prannayag/harness_eng/pillars/README.md]
- **Hosted search or SSR creep:** Do not add Algolia, Typesense server, database, account, CMS, SSR adapter, or runtime graph database in Phase 1. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]
- **Full reader shell scope creep:** Do not implement full chapter prose, graph exploration, formal object registry, or polished book navigation in Phase 1. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Docs/static site shell | A custom Vite app/router/docs sidebar | Astro + Starlight | Starlight already provides static docs conventions, sidebar config, built-in Pagefind search, and plugin hooks. [CITED: https://starlight.astro.build/reference/configuration/] |
| Schema validation | Manual ad-hoc `if` checks for every field | Zod schema plus targeted provenance checks | Zod provides typed runtime schema validation; targeted logic should cover path existence and archive policy. [CITED: https://docs.astro.build/en/guides/content-collections/] |
| Local full-text indexing | Custom inverted index/search UI in Phase 1 | Pagefind/Starlight Pagefind baseline | Pagefind indexes static HTML after build and emits static assets with no server. [CITED: https://pagefind.app/docs/running-pagefind/] |
| Math HTML rendering | Regex-based TeX-to-HTML conversion | remark-math + rehype-katex + KaTeX | The unified/remark ecosystem already handles Markdown math parsing and KaTeX rendering. [CITED: https://github.com/remarkjs/remark-math/blob/main/readme.md] |
| Internal link validation | Custom Markdown link parser | `starlight-links-validator` if needed | The plugin validates internal links in Markdown/MDX for Starlight. [CITED: https://github.com/HiDeoo/starlight-links-validator] |

**Key insight:** The hard part is provenance correctness, not website mechanics. Use standard static-site, search, math, and validation primitives so implementation effort goes into the corpus contract. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]

## Common Pitfalls

### Pitfall 1: Treating Phase 1 as a reader UI phase
**What goes wrong:** Work expands into chapter design, polished book navigation, search UX, graph exploration, or formal object registry. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]
**Why it happens:** Starlight makes it easy to start building pages before the source contract is solid. [ASSUMED]
**How to avoid:** Limit UI to landing, inventory, and provenance diagnostics as required by the UI-SPEC. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]
**Warning signs:** Tasks mention theorem registry, reading paths, graph UI, citation influence, or full chapter content. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]

### Pitfall 2: Using archive paths as convenient replacements
**What goes wrong:** Missing canonical `.tex`, PDF, or bibliography paths are silently resolved to `archive/` files. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]
**Why it happens:** The migration manifest records old-to-new paths and many preserved artifacts exist, so scans can find plausible old material. [VERIFIED: /home/prannayag/harness_eng/docs/migration/final-papers-rearchitecture-manifest.md]
**How to avoid:** Reject `/archive/` in canonical fields unless the whole entry is explicitly `provenance-only`. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]
**Warning signs:** Validator code has a fallback search, glob scan, or “first matching file” behavior. [ASSUMED]

### Pitfall 3: Letting Starlight defaults hide build-contract gaps
**What goes wrong:** A site builds, but the inventory does not prove all thirteen expected entries or required paths. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]
**Why it happens:** Static-site generators validate pages, not project-specific corpus provenance, unless custom scripts enforce it. [ASSUMED]
**How to avoid:** `build` must depend on `validate`, and validation must enumerate the required ids. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]
**Warning signs:** `bun run build` only calls `astro build`. [ASSUMED]

### Pitfall 4: Runtime-only math rendering
**What goes wrong:** Math appears only after browser scripts run, making static output and tests less deterministic. [ASSUMED]
**Why it happens:** KaTeX auto-render examples are easy to copy. [CITED: https://katex.org/docs/autorender]
**How to avoid:** Prefer build-time `remark-math` + `rehype-katex`; include KaTeX CSS. [CITED: https://github.com/remarkjs/remark-math/blob/main/readme.md]
**Warning signs:** Phase 1 relies on CDN scripts or `renderMathInElement(document.body)` as the primary math path. [CITED: https://katex.org/docs/autorender]

## Code Examples

### Astro content collection schema pattern
```typescript
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const corpus = defineCollection({
  loader: file('src/data/corpus.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
  }),
});

export const collections = { corpus };
```

### Pagefind static indexing
```bash
# Source: https://pagefind.app/docs/running-pagefind/
pagefind --site dist
```

### Starlight page exclusion from search
```markdown
---
title: Content to hide from search
pagefind: false
---
```
Source: Starlight site search docs. [CITED: https://starlight.astro.build/guides/site-search/]

### Validation diagnostic copy pattern
```text
Entry security: canonicalTex points to pillars/security/archive/security_architecture.tex. Archive paths cannot be canonical sources. Move the reference to pillars/security/paper/ or mark the entry as provenance-only.
```
Source: Phase 1 UI-SPEC. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Documentation site search backed by hosted services | Static search generated from built HTML with Pagefind | Current Starlight docs state built-in search is Pagefind and requires no configuration. [CITED: https://starlight.astro.build/guides/site-search/] | Use local indexes and avoid hosted search dependencies. |
| Unstructured Markdown/frontmatter validation | Astro content/data collections with Zod schemas | Current Astro docs show `defineCollection`, loaders, and Zod schemas. [CITED: https://docs.astro.build/en/guides/content-collections/] | Use schema validation for content/data contracts. |
| Client-side math rendering as default | Build-time Markdown math parsing plus KaTeX HTML rendering | remark-math docs identify `remark-math` with `rehype-katex` as the Markdown-to-KaTeX rendering pipeline. [CITED: https://github.com/remarkjs/remark-math/blob/main/readme.md] | Prefer deterministic static HTML math output. |

**Deprecated/outdated:**
- Hosted search for Phase 1: out of scope because v1 requires local/static search and no hosted search service. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md]
- Root-level web app setup for Phase 1: forbidden by D-01; use `site/`. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Starlight makes it easy to start building pages before the source contract is solid. | Common Pitfalls | Low; this is a planning caution, not a technical dependency. |
| A2 | Validator code with fallback glob behavior is a warning sign for provenance drift. | Common Pitfalls | Medium; if planner intentionally designs safe fallback behavior, this caution may be too strict. |
| A3 | Static-site generators validate pages, not project-specific corpus provenance, unless custom scripts enforce it. | Common Pitfalls | Low; even if some tooling can validate data, project-specific canonical/archive policy still needs custom rules. |
| A4 | Runtime-only math makes static output and tests less deterministic. | Common Pitfalls | Medium; runtime math can still be tested, but it conflicts with the desired static foundation. |

## Open Questions

1. **Should the explicit inventory be TypeScript or JSON loaded through Astro content collections?**
   - What we know: Context requires explicit typed data under `site/`, and Astro supports JSON/YAML/TOML file loaders plus Zod schemas. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md] [CITED: https://docs.astro.build/en/guides/content-collections/]
   - What's unclear: Whether the planner prefers direct TypeScript literal data for richer types or JSON data for easier non-code editing. [ASSUMED]
   - Recommendation: Use `src/data/corpus.ts` plus `corpus.schema.ts` for Phase 1 because validation logic and compile-time types are first-class; later migrate/expose generated JSON indexes as needed. [ASSUMED]

2. **Should Phase 1 include Pagefind generation if search UX is Phase 4?**
   - What we know: FOUND-07 requires static HTML assets and local indexes reproducibly, while DISC-01/DISC-02 search UX and rich indexing are Phase 4. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]
   - What's unclear: Whether “local indexes” in Phase 1 means Pagefind index only, a lightweight corpus JSON index, or both. [ASSUMED]
   - Recommendation: Generate Pagefind after build and optionally emit `dist/corpus-index.json` from the validated inventory; keep search UI tuning for Phase 4. [ASSUMED]

3. **Should link validation be included now or deferred to Phase 5?**
   - What we know: Phase 5 explicitly validates internal links; Phase 1 validates canonical source paths. [VERIFIED: /home/prannayag/harness_eng/.planning/ROADMAP.md]
   - What's unclear: Whether the planner wants `starlight-links-validator` in Phase 1 as cheap baseline hardening. [ASSUMED]
   - Recommendation: Add it only if minimal docs/source links are present and it does not distract from provenance validation; otherwise defer full link validation to Phase 5. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Package manager and command runner | ✓ | 1.3.12 | npm scripts if Bun later proves incompatible. [VERIFIED: local environment] |
| Node.js | Astro/tooling runtime | ✓ | v24.14.0 | Use Bun runtime where possible. [VERIFIED: local environment] |
| npm | Version verification / fallback package manager | ✓ | 11.9.0 | Bun. [VERIFIED: local environment] |
| Existing root web tooling | Boundary check | ✗ | none found at max depth 3 for package/astro/vitest config files | Create isolated `site/` workspace. [VERIFIED: local filesystem search] |
| Knowledge graph | Optional semantic graph context | ✗ | graphify disabled | Proceeded with planning files and codebase reads. [VERIFIED: graphify status] |

**Missing dependencies with no fallback:**
- None. [VERIFIED: local environment]

**Missing dependencies with fallback:**
- Knowledge graph unavailable because graphify is disabled; fallback was direct planning/context/corpus inspection. [VERIFIED: graphify status]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts or sessions are in scope for Phase 1. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V3 Session Management | no | No server session state is in scope. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V4 Access Control | no | Static public documentation output has no protected user resources in Phase 1. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V5 Input Validation | yes | Zod schema validation plus path allowlist/archive rejection. [CITED: https://docs.astro.build/en/guides/content-collections/] [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |
| V6 Cryptography | no | No cryptographic feature is planned; do not add custom cryptography. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] |

### Known Threat Patterns for Static Provenance Site

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Path traversal or absolute path leakage in inventory references | Information Disclosure / Tampering | Restrict inventory paths to project-root-relative strings under `science/paper/` or `pillars/*/paper/`; reject absolute paths and `..` segments. [ASSUMED] |
| Archive content promoted as canonical source | Tampering | Reject `/archive/` canonical fields unless entry is `provenance-only`. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md] |
| Broken canonical links hidden by UI | Spoofing / Repudiation | Validation must hard-fail missing required canonical paths and diagnostics must name entry and path. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md] |
| Unexpected network dependency in static site | Information Disclosure / Availability | Avoid hosted search, analytics prompts, accounts, CMS clients, and CDN-only math dependencies in Phase 1. [VERIFIED: /home/prannayag/harness_eng/.planning/REQUIREMENTS.md] [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md] |

## UI/Design Contract Findings

- Phase 1 visible surfaces are limited to a foundation/provenance layer: minimal landing page, corpus inventory page, provenance/source status treatment, and validation diagnostics documentation. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]
- Use Astro/Starlight built-ins only for Phase 1 foundation; no shadcn, no separate icon package, and no custom reader-facing shell yet. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]
- The inventory page must show exactly thirteen expected entries and expose title, kind, slug, source status, canonical `.tex` path, PDF path, and bibliography path when present. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]
- Use status labels exactly `Canonical`, `Missing source`, `Archive blocked`, and `Provenance-only`. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]
- Preserve the UI-SPEC typography, color, spacing, copywriting, keyboard, and responsive contracts; do not introduce extra-small diagnostic text below 14px. [VERIFIED: /home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md]

## Sources

### Primary (HIGH confidence)
- `/withastro/docs` via Context7 CLI - Astro content collections and Zod schema examples. [CITED: https://docs.astro.build/en/guides/content-collections/]
- `/withastro/starlight` via Context7 CLI - Pagefind search, page frontmatter, and Starlight config behavior. [CITED: https://starlight.astro.build/guides/site-search/] [CITED: https://starlight.astro.build/reference/configuration/]
- `/pagefind/pagefind` via Context7 CLI - static search CLI and generated index output. [CITED: https://pagefind.app/docs/running-pagefind/]
- `/katex/katex` via Context7 CLI - KaTeX auto-render and rendering docs. [CITED: https://katex.org/docs/autorender]
- `/remarkjs/remark-math` via Context7 CLI - Markdown math parsing and `rehype-katex` rendering pipeline. [CITED: https://github.com/remarkjs/remark-math/blob/main/readme.md]
- npm registry - versions and modified dates for Astro, Starlight, TypeScript, Zod, KaTeX, remark/rehype math, Pagefind, Vitest, Astro check, link validator, and Bun types. [VERIFIED: npm registry]
- Project planning files: `/home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-CONTEXT.md`, `/home/prannayag/harness_eng/.planning/REQUIREMENTS.md`, `/home/prannayag/harness_eng/.planning/ROADMAP.md`, `/home/prannayag/harness_eng/.planning/STATE.md`, `/home/prannayag/harness_eng/.planning/phases/01-site-foundation-and-provenance-contract/01-UI-SPEC.md`. [VERIFIED: local files]
- Project corpus docs: `/home/prannayag/harness_eng/CLAUDE.md`, `/home/prannayag/harness_eng/science/README.md`, `/home/prannayag/harness_eng/pillars/README.md`, `/home/prannayag/harness_eng/docs/migration/final-papers-rearchitecture-manifest.md`. [VERIFIED: local files]

### Secondary (MEDIUM confidence)
- `starlight-links-validator` GitHub README via WebFetch - internal link validation purpose and usage. [CITED: https://github.com/HiDeoo/starlight-links-validator]

### Tertiary (LOW confidence)
- Assumptions listed in the Assumptions Log; all are planning cautions or recommendations requiring planner judgment. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - locked by context and current package versions verified against npm registry. [VERIFIED: npm registry]
- Architecture: HIGH - phase boundaries and provenance rules are directly specified by CONTEXT, REQUIREMENTS, ROADMAP, and UI-SPEC. [VERIFIED: local planning files]
- Pitfalls: MEDIUM - core pitfalls are grounded in requirements/context; some implementation warning signs are assumed planning heuristics. [VERIFIED: local planning files] [ASSUMED]

**Research date:** 2026-05-14
**Valid until:** 2026-05-21 for package versions and static-site tooling; provenance rules remain valid until project requirements change. [ASSUMED]
