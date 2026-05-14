# Phase 1: Site Foundation and Provenance Contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14T12:25:42+08:00
**Phase:** 1-Site Foundation and Provenance Contract
**Areas discussed:** Site boundary, Stack choice, Corpus inventory, Provenance rules

---

## Site Boundary

### Static site location

| Option | Description | Selected |
|--------|-------------|----------|
| New site/ dir | Create a top-level site/ workspace; keeps app tooling isolated while relative links can still point to science/ and pillars/. | ✓ |
| docs/site dir | Keeps publication work under docs/, but risks mixing implementation with migration/documentation material already in docs/. | |
| Root app files | Package/config files at repo root; simplest commands, but weakest boundary and more likely to confuse corpus vs site ownership. | |
| You decide | Let downstream agents choose the boundary based on framework research and repo constraints. | |

**User's choice:** New site/ dir
**Notes:** The site implementation should have a clear top-level project boundary.

### Corpus relationship

| Option | Description | Selected |
|--------|-------------|----------|
| Read-only corpus refs | Site code may read/link to science/ and pillars/ at build time, but must not copy canonical source ownership into site/. | ✓ |
| Snapshot into site | Copy selected corpus excerpts into site/ data/content; easier static builds, but creates drift risk unless validation is very strong. | |
| Manual links only | Site content only stores links to corpus files; minimal coupling, but weak foundation for inventory and validation. | |
| You decide | Let downstream agents pick the corpus interaction model. | |

**User's choice:** Read-only corpus refs
**Notes:** Canonical corpus files remain source of truth outside the site workspace.

### Output scope

| Option | Description | Selected |
|--------|-------------|----------|
| Local build only | Document one local build producing static assets/indexes; leave hosting/deploy wiring for release readiness. | ✓ |
| Deploy-ready now | Add hosting-oriented output structure and config now; useful if publication target is known, but may overfit before the site shape exists. | |
| Both placeholders | Create local build plus empty deploy placeholders; signals future intent but can become unused clutter. | |
| You decide | Let downstream agents decide how much deployment shape belongs in phase 1. | |

**User's choice:** Local build only
**Notes:** Phase 1 should prove local static output, not deployment.

### Boundary enforcement

| Option | Description | Selected |
|--------|-------------|----------|
| Validation gate | Add validation/tests that fail when site inventory points to missing, archive, or disallowed canonical paths; rely on repo discipline for edits. | ✓ |
| Hard scripts | Use scripts to detect changed science/ or pillars/ files during site workflows; stronger guard, but may be awkward in normal development. | |
| Document only | Record the rule in docs and context; lighter, but weaker against accidental drift. | |
| You decide | Let the planner choose the enforcement level. | |

**User's choice:** Validation gate
**Notes:** Executable validation is required for boundary discipline.

---

## Stack Choice

### Static-site stack

| Option | Description | Selected |
|--------|-------------|----------|
| Astro/Starlight | Static-first, strong Markdown/MDX/content-data story, good fit for a custom book/wiki identity with schema validation. | ✓ |
| VitePress | Lean docs site with built-in local search; faster to scaffold, but less flexible for custom formal-object/content modeling. | |
| Docusaurus | Mature React docs platform with MDX; strong docs conventions, but heavier and more software-docs-shaped than book/editorial. | |
| You decide | Let the researcher/planner choose after comparing stacks against math, provenance, and static-search needs. | |

**User's choice:** Astro/Starlight
**Notes:** Brief research found Astro MDX/content-collection support, VitePress local search, and heavier Docusaurus docs infrastructure.

### Customization depth

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal scaffold | Keep phase 1 to scaffold, content/data schema, validation, and build scripts; defer custom theme/components to phase 2. | |
| Early theme base | Allow foundational theme tokens/layout hooks now; helps phase 2, but risks mixing foundation with visual design work. | ✓ |
| Custom shell now | Build a bespoke Astro shell immediately; more control, but too much UI scope for a foundation phase. | |
| You decide | Let downstream agents decide how much Starlight customization is appropriate. | |

**User's choice:** Early theme base
**Notes:** Early theme foundations are allowed, but the full reader-facing shell remains later-phase work.

### Package manager

| Option | Description | Selected |
|--------|-------------|----------|
| npm defaults | Lowest-friction Node baseline with package-lock and commands like npm install / npm run build. | |
| pnpm | Good reproducibility and workspace ergonomics, but adds a tool choice contributors may not already have. | |
| Bun | Fast all-in-one toolchain, but a stronger runtime bet for a research publication repo. | ✓ |
| You decide | Let downstream agents choose based on Astro/Starlight setup guidance. | |

**User's choice:** Bun
**Notes:** Bun is the preferred package manager/runner for `site/` unless research finds a hard blocker.

### Math setup

| Option | Description | Selected |
|--------|-------------|----------|
| Basic math now | Include a small KaTeX/remark-math path and fixture so the foundation proves math can render statically. | |
| Hooks only | Define where math support will go but don’t configure it yet; simpler phase 1, but less confidence for later formal content. | |
| Full math system | Configure robust theorem/math rendering now; likely spills into formal reading interface scope. | ✓ |
| You decide | Let downstream agents decide based on Astro/Starlight plugin compatibility. | |

**User's choice:** Full math system
**Notes:** Full static math rendering is desired in Phase 1, while formal block design/content expansion remains later scope.

---

## Corpus Inventory

### Inventory priority

| Option | Description | Selected |
|--------|-------------|----------|
| Source contract | A compact typed inventory proving every umbrella/pillar entry has canonical source, PDF, title, slug, and status metadata. | ✓ |
| Navigation data | Shape the inventory around future sidebar/book order and reading paths; useful, but overlaps phase 2/4. | |
| Content registry | Start modeling definitions, theorems, citations, and concepts now; powerful, but belongs more to phase 3 unless kept as placeholders. | |
| You decide | Let downstream agents choose the inventory emphasis. | |

**User's choice:** Source contract
**Notes:** Phase 1 inventory should prove source/provenance coverage first.

### Inventory authorship

| Option | Description | Selected |
|--------|-------------|----------|
| Handwritten typed data | Maintain a clear data file under site/ with all 13 corpus entries and validate it; easiest to review and curate. | ✓ |
| Generated from filesystem | Scan science/ and pillars/ automatically; less manual work, but source metadata and display ordering may be too implicit. | |
| Hybrid data+scan | Handwrite identity/order/labels, then validate against filesystem and optionally enrich discovered paths. | |
| You decide | Let downstream agents choose between authored and generated inventory. | |

**User's choice:** Handwritten typed data
**Notes:** Use explicit typed data for the initial corpus map.

### Required coverage

| Option | Description | Selected |
|--------|-------------|----------|
| Umbrella + 12 | Validation fails unless science plus all twelve pillars are present. | ✓ |
| Umbrella + samples | Use a smaller fixture first; easier, but conflicts with the v1 coverage constraint and risks a narrow demo. | |
| All discoverable dirs | Inventory every potential corpus/support directory now; more complete, but includes noncanonical material too early. | |
| You decide | Let downstream agents decide coverage pass/fail thresholds. | |

**User's choice:** Umbrella + 12
**Notes:** Phase 1 must not become a one-pillar demo.

### Required metadata

| Option | Description | Selected |
|--------|-------------|----------|
| Core provenance | id, kind, title, slug, summary, canonical tex path, canonical PDF path, bibliography path when present, and source status. | ✓ |
| Minimal paths | Only id/title/source paths; fast, but too weak for later source trails and validation. | |
| Rich chapter fields | Include later chapter fields like notation, claims, related pillars, reading paths; useful but phase-3-heavy. | |
| You decide | Let downstream agents define the required metadata fields. | |

**User's choice:** Core provenance
**Notes:** Metadata should support validation and later source trails without becoming the formal registry.

---

## Provenance Rules

### Archive path handling

| Option | Description | Selected |
|--------|-------------|----------|
| Fail by default | Any canonical source path containing /archive/ fails unless explicitly marked as provenance-only. | ✓ |
| Warn first | Archive paths emit warnings but don’t fail yet; gentler, but weakens FOUND-06. | |
| Allow with label | Permit archive paths if they have a visible label; useful for provenance pages, but too permissive for canonical inventory. | |
| You decide | Let downstream agents choose archive enforcement. | ✓ |

**User's choice:** You decide
**Notes:** Claude discretion resolves this as fail by default because it directly satisfies FOUND-06.

### Missing source behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Hard fail | Fail the validation/build command immediately with the missing inventory entry and path. | ✓ |
| Soft fail report | Generate a report but allow the build to continue; useful during drafting, but weaker for phase 1 success criteria. | |
| Dev warning only | Only warn locally; lightest option, but too easy to miss. | |
| You decide | Let downstream agents choose the missing-path behavior. | |

**User's choice:** Hard fail
**Notes:** Missing required canonical source paths should fail validation with clear diagnostics.

### Provenance depth

| Option | Description | Selected |
|--------|-------------|----------|
| Files now | Require file-level source/PDF/BibTeX paths now; defer formal-object anchors until phase 3. | ✓ |
| Anchors now | Start requiring section or object anchors immediately; stronger traceability, but needs content extraction before chapter work. | |
| Optional anchors | Allow anchors when known but don’t require them; gives future compatibility without blocking the foundation. | |
| You decide | Let downstream agents choose path vs anchor depth. | |

**User's choice:** Files now
**Notes:** Stable formal-object anchors are deferred.

### Contributor visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Document + script | Include a documented command plus validation script/test so contributors know exactly what passes. | ✓ |
| Script only | Validation exists, but the contributor contract is implicit in code. | |
| Docs only | Explain the contract without executable enforcement; easier, but not enough for success criteria. | |
| You decide | Let downstream agents decide how much documentation accompanies validation. | |

**User's choice:** Document + script
**Notes:** Provenance rules should be both executable and documented.

---

## Claude's Discretion

- Archive path handling: user selected “You decide”; default to fail-by-default for canonical source paths containing `/archive/`, except entries explicitly marked as provenance-only.

## Deferred Ideas

None.
