# Phase 5: Release Quality and Static Publication Readiness - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-21T00:00:00Z
**Phase:** 5-Release Quality and Static Publication Readiness
**Areas discussed:** Release gate bar, Coverage evidence, Clean checkout proof, Print citation style

---

## Release Gate Bar

### Hard blockers

| Option | Description | Selected |
|--------|-------------|----------|
| All quality gates | Block release on links, source trails, archive exclusions, citations, graph targets, math fixtures, coverage matrix, accessibility, print styling, and clean-checkout build. | ✓ |
| Integrity gates only | Block only on correctness/provenance issues such as links, source trails, archive exclusions, citations, graph targets, math fixtures, and coverage; keep accessibility/print as advisory. | |
| Tiered severity | Classify failures as blocker/warning/info so the builder can publish with documented warnings when acceptable. | |
| You decide | Let downstream planning choose the exact blocking/advisory split from the roadmap and current validation patterns. | |

**User's choice:** All quality gates
**Notes:** Phase 5 should use a strict release bar.

### Failure reporting

| Option | Description | Selected |
|--------|-------------|----------|
| Summary plus details | Show an overall pass/fail summary plus grouped diagnostics with exact failing item, source path/anchor, reason, and next step. | ✓ |
| Raw tool output | Let each underlying validator print its own errors without a unified release report. | |
| Machine report first | Prioritize a JSON/manifest report for automation, with only a short console summary for humans. | |
| You decide | Let downstream planning choose the reporting shape while preserving all blocker details. | |

**User's choice:** Summary plus details
**Notes:** Existing validators already use actionable diagnostics; release reporting should keep that pattern.

### Command shape

| Option | Description | Selected |
|--------|-------------|----------|
| Unified release command | Add a single publish-readiness command that runs existing and new gates in order, while keeping individual scripts available. | ✓ |
| Extend existing build | Make `bun run build` perform every release gate so normal builds are always release-grade. | |
| Separate gate scripts | Keep separate commands for links, math, coverage, accessibility, print, and clean checkout; document the sequence. | |
| You decide | Let downstream planning pick the command wiring from current package scripts. | |

**User's choice:** Unified release command
**Notes:** Clean-checkout readiness needs one obvious command, but individual scripts remain useful for debugging.

### Deferred v2 handling

| Option | Description | Selected |
|--------|-------------|----------|
| Ignore v2 scope | Do not validate or warn about v2-only features such as richer interactive graph filtering, advanced relationship pages, versioned releases, analytics, or provenance diff reports. | |
| Warn if absent | Mention v2 features as non-blocking omissions in the release report. | |
| Track placeholders | Require explicit placeholder pages or roadmap notices for deferred v2 capabilities. | |
| You decide | Let downstream planning decide how to avoid confusing users about deferred capabilities. | ✓ |

**User's choice:** You decide
**Notes:** Planner has discretion, but must not implement v2 scope.

---

## Coverage Evidence

### Matrix scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full contract evidence | For umbrella plus all twelve pillars, prove required chapter sections, formal objects, concepts, citations, source trails, derivation coverage/rationale, and discovery/index presence. | ✓ |
| Minimum chapter contract | Only prove each owner has required chapter sections and at least one formal object/concept/citation/source trail. | |
| Reader-facing coverage | Focus the matrix on what users can inspect: pages, navigation, search visibility, graph/related links, and source links. | |
| You decide | Let downstream planning choose the coverage dimensions from requirements and existing registries. | |

**User's choice:** Full contract evidence
**Notes:** Coverage should close the entire v1 contract, not just minimum page existence.

### Matrix surfacing

| Option | Description | Selected |
|--------|-------------|----------|
| Generated report page | Generate a static human-readable coverage page/report in the site output, with source data available to validators. | ✓ |
| CLI report only | Keep coverage evidence in terminal output and fail/pass results only; no reader-facing page. | |
| Data artifact only | Produce JSON/CSV coverage artifacts for automation, without a polished human page. | |
| You decide | Let downstream planning choose the report format. | |

**User's choice:** Generated report page
**Notes:** Researchers should be able to inspect publication evidence.

### Weak source support

| Option | Description | Selected |
|--------|-------------|----------|
| Require rationale | Allow release only if the matrix records a source-grounded not-supported/thin-support rationale and the page labels the limitation. | ✓ |
| Block release | Fail release whenever any pillar lacks strong derivation/formal-claim support. | |
| Warn only | Keep weak-support cases as warnings so the site can publish if the page exists. | |
| You decide | Let downstream planning apply existing Phase 3 derivation coverage rules. | |

**User's choice:** Require rationale
**Notes:** Source honesty is required when canonical support is thin.

### Display density

| Option | Description | Selected |
|--------|-------------|----------|
| Compact with drilldown | Show pass/fail/status per coverage dimension in a compact grid, with drilldown rows linking to pages, formal anchors, source trails, and failing diagnostics. | ✓ |
| Detailed rows only | List every formal object, concept, citation, source trail, and search/graph record directly in one large table. | |
| High-level only | Show one status per corpus owner and rely on validators for detail. | |
| You decide | Let downstream planning choose the display density. | |

**User's choice:** Compact with drilldown
**Notes:** The report should be readable while preserving detail.

---

## Clean Checkout Proof

### Proof threshold

| Option | Description | Selected |
|--------|-------------|----------|
| Fresh clone script | A documented/scripted proof path installs dependencies, runs type/check/test/validate/build/index/release gates, and verifies deployable static output from no prior artifacts. | ✓ |
| Current checkout only | Run the full release command in the current repo and document dependencies, without simulating a fresh clone. | |
| Manual checklist | Provide a human checklist for installing dependencies, building, and checking output without automating the clean-checkout proof. | |
| You decide | Let downstream planning choose the clean-checkout verification method. | |

**User's choice:** Fresh clone script
**Notes:** QUAL-05 is specifically fresh-start reproducibility.

### Command location

| Option | Description | Selected |
|--------|-------------|----------|
| Inside site boundary | Keep the proof centered on `site/` commands and outputs, with repository-root source paths read as inputs. | |
| Repository root | Add a root-level release command that orchestrates the site build and any corpus checks from the top of the repo. | |
| Both contexts | Support both root and `site/` commands so either workflow works. | |
| You decide | Let downstream planning choose based on current scripts and dependency layout. | ✓ |

**User's choice:** You decide
**Notes:** Planner should preserve the `site/` implementation boundary and read-only canonical corpus model.

### Output assertions

| Option | Description | Selected |
|--------|-------------|----------|
| Verify output shape | Check generated HTML/assets plus local indexes/search/graph/citation/coverage artifacts exist where expected and contain required entries. | ✓ |
| Build success enough | Treat successful `bun run build` and release validation as sufficient. | |
| Manifest only | Generate a manifest of expected output files but do not inspect contents deeply. | |
| You decide | Let downstream planning choose exact output assertions. | |

**User's choice:** Verify output shape
**Notes:** Deployable static output must be checked, not inferred from build success alone.

### Dependency/setup handling

| Option | Description | Selected |
|--------|-------------|----------|
| Actionable diagnostics | Fail with clear messages about missing Bun/Node/tooling, install command, and which release step failed. | |
| Assume tooling | Assume Bun and site dependencies are present; let raw command failures surface. | |
| Auto-install all | Try to install any missing external tooling automatically. | |
| You decide | Let downstream planning choose the dependency failure contract. | ✓ |

**User's choice:** You decide
**Notes:** Planner may define the setup failure contract.

---

## Print Citation Style

### Print goal

| Option | Description | Selected |
|--------|-------------|----------|
| Research paper handout | Printed pages preserve title/context, formal blocks, equations, citations, source trails, URLs/anchors, and page-friendly typography while removing navigation chrome. | ✓ |
| Clean reading print | Focus on readable prose and math with minimal decorative/navigation elements; keep citations but reduce source-trail detail. | |
| Source appendix print | Print each page with a prominent source/citation appendix and provenance details, even if it makes output longer. | |
| You decide | Let downstream planning choose the print treatment from DESIGN-05 and existing atlas CSS. | |

**User's choice:** Research paper handout
**Notes:** Print should support researcher sharing and annotation.

### Source trails in print

| Option | Description | Selected |
|--------|-------------|----------|
| Visible inline plus footer | Keep compact source labels near formal blocks and include expanded source paths/URLs in a print footer or appendix. | ✓ |
| Inline only | Print source labels exactly where they appear on screen, without extra expanded footer details. | |
| Appendix only | Move detailed source trails to an end appendix and keep the body cleaner. | |
| You decide | Let downstream planning balance print length and provenance visibility. | |

**User's choice:** Visible inline plus footer
**Notes:** Preserves Phase 2 source visibility in print form.

### Page scope

| Option | Description | Selected |
|--------|-------------|----------|
| All research pages | Apply print/citation styling to homepage, umbrella/pillar chapters, formal registry, glossary, reading paths, graph/context pages, and coverage report. | ✓ |
| Chapter pages only | Prioritize umbrella and pillar chapters plus formal objects, leaving discovery/coverage pages with basic print behavior. | |
| Printable exports | Create dedicated print/export views instead of styling all existing pages. | |
| You decide | Let downstream planning decide the page set based on implementation complexity. | |

**User's choice:** All research pages
**Notes:** Release readiness should cover the full research site.

### Print validation

| Option | Description | Selected |
|--------|-------------|----------|
| Static CSS checks | Add automated checks that required print CSS/features exist and representative pages include print-safe title/source/citation structures. | ✓ |
| Manual review only | Document a manual print-preview checklist and rely on human inspection. | |
| Browser snapshots | Add browser-based print/PDF snapshot checks for representative pages. | |
| You decide | Let downstream planning choose validation depth. | |

**User's choice:** Static CSS checks
**Notes:** Practical validation for a static site without browser E2E.

---

## Claude's Discretion

- Treatment of absent v2-only features in the release report.
- Clean-checkout command location: `site/`, repository root, or both.
- Dependency/setup failure diagnostics for fresh-start proof.

## Deferred Ideas

None — discussion stayed within phase scope.
