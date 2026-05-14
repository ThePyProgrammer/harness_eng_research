# Phase 1: Site Foundation and Provenance Contract - Context

**Gathered:** 2026-05-14T12:25:42+08:00
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 delivers a separate, reproducible static-site foundation under a clear project boundary. It establishes the site workspace, static build baseline, typed corpus inventory, source metadata contract, math-rendering foundation, and validation gates that prove canonical corpus paths exist and archive material is not treated as canonical source content.

This phase does not build the reader-facing book interface, full chapter prose, search UX, graph exploration, formal object registry, or release/deployment workflow. Those belong to later phases.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning and Requirements
- `.planning/PROJECT.md` — Project purpose, core value, active requirements, constraints, and key decisions.
- `.planning/REQUIREMENTS.md` — v1 requirement definitions; Phase 1 maps to FOUND-01 through FOUND-07.
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, dependencies, and phase boundaries.
- `.planning/STATE.md` — Current project state and concerns affecting Phase 1.

### Codebase Maps
- `.planning/codebase/STACK.md` — Current repository stack; no root application runtime/package manager exists yet.
- `.planning/codebase/STRUCTURE.md` — Existing corpus directory layout and where canonical files live.
- `.planning/codebase/ARCHITECTURE.md` — Corpus architecture, source-of-truth boundaries, archive rules, and migration/provenance patterns.

### Corpus Structure References
- `README.md` — Repository-level corpus navigation and context.
- `science/README.md` — Umbrella framework area overview and source organization.
- `pillars/README.md` — Pillar directory contract and active pillar set.
- `docs/migration/final-papers-rearchitecture-manifest.md` — Migration/provenance record for resolving legacy paths and archive destinations.

### Umbrella Framework Canonical Sources
- `science/paper/science.tex` — Canonical umbrella framework source.
- `science/paper/science.pdf` — Canonical umbrella framework PDF.
- `science/paper/science.bib` — Umbrella bibliography source.

### Pillar Canonical Sources
- `pillars/abstraction/paper/abstraction_architecture.tex` — Abstraction pillar canonical source.
- `pillars/abstraction/paper/abstraction_architecture.pdf` — Abstraction pillar canonical PDF.
- `pillars/abstraction/paper/abstraction_architecture.bib` — Abstraction pillar bibliography.
- `pillars/accretion/paper/accretion_category.tex` — Accretion pillar canonical source.
- `pillars/accretion/paper/accretion_category.pdf` — Accretion pillar canonical PDF.
- `pillars/accretion/paper/accretion_category.bib` — Accretion pillar bibliography.
- `pillars/coordination/paper/coordination_architecture.tex` — Coordination pillar canonical source.
- `pillars/coordination/paper/coordination_architecture.pdf` — Coordination pillar canonical PDF.
- `pillars/coordination/paper/coordination_architecture.bib` — Coordination pillar bibliography.
- `pillars/economics/paper/economics_architecture.tex` — Economics pillar canonical source.
- `pillars/economics/paper/economics_architecture.pdf` — Economics pillar canonical PDF.
- `pillars/economics/paper/economics_architecture.bib` — Economics pillar bibliography.
- `pillars/governance/paper/governance_architecture.tex` — Governance pillar canonical source.
- `pillars/governance/paper/governance_architecture.pdf` — Governance pillar canonical PDF.
- `pillars/governance/paper/governance_architecture.bib` — Governance pillar bibliography.
- `pillars/human-interaction/paper/human_interaction_architecture.tex` — Human Interaction pillar canonical source.
- `pillars/human-interaction/paper/human_interaction_architecture.pdf` — Human Interaction pillar canonical PDF.
- `pillars/human-interaction/paper/human_interaction_architecture.bib` — Human Interaction pillar bibliography.
- `pillars/information/paper/information_architecture.tex` — Information pillar canonical source.
- `pillars/information/paper/information_architecture.pdf` — Information pillar canonical PDF.
- `pillars/information/paper/information_architecture.bib` — Information pillar bibliography.
- `pillars/model-routing/paper/model_routing_architecture.tex` — Model Routing pillar canonical source.
- `pillars/model-routing/paper/model_routing_architecture.pdf` — Model Routing pillar canonical PDF.
- `pillars/model-routing/paper/model_routing_architecture.bib` — Model Routing pillar bibliography.
- `pillars/quality/paper/quality_architecture.tex` — Quality pillar canonical source.
- `pillars/quality/paper/quality_architecture.pdf` — Quality pillar canonical PDF.
- `pillars/quality/paper/quality_architecture.bib` — Quality pillar bibliography.
- `pillars/reliability/paper/reliability_architecture.tex` — Reliability pillar canonical source.
- `pillars/reliability/paper/reliability_architecture.pdf` — Reliability pillar canonical PDF.
- `pillars/reliability/paper/reliability_architecture.bib` — Reliability pillar bibliography.
- `pillars/security/paper/security_architecture.tex` — Security pillar canonical source.
- `pillars/security/paper/security_architecture.pdf` — Security pillar canonical PDF.
- `pillars/security/paper/security_architecture.bib` — Security pillar bibliography.
- `pillars/temporal/paper/temporal_architecture.tex` — Temporal pillar canonical source.
- `pillars/temporal/paper/temporal_architecture.pdf` — Temporal pillar canonical PDF.
- `pillars/temporal/paper/temporal_architecture.bib` — Temporal pillar bibliography.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `science/paper/` and `pillars/*/paper/`: Canonical `.tex`, `.pdf`, and `.bib` files to inventory and validate from the new site workspace.
- `science/README.md` and `pillars/README.md`: Existing human-readable structure summaries that can seed inventory labels and pillar ordering.
- `docs/migration/final-papers-rearchitecture-manifest.md`: Existing provenance/migration record to consult when distinguishing canonical paths from preserved archive material.

### Established Patterns
- Canonical paper sources live only in `science/paper/` and `pillars/*/paper/`; supporting material stays beside the owning corpus unit.
- Archive material under `archive/`, `science/archive/`, and `pillars/*/archive/` is preservation content, not active canonical source material.
- The repository currently has no root application runtime or package manager; site tooling should be isolated in the new `site/` boundary.
- Current corpus validation is document/build-time oriented; Phase 1 introduces the first site-specific executable provenance validation.

### Integration Points
- New site implementation should connect to existing corpus paths by relative read-only references from `site/`.
- The documented build command should live in or route through the `site/` workspace and produce static HTML assets plus local indexes without a server runtime, database, CMS, accounts, or hosted search dependency.
- Validation should run against the typed inventory and filesystem paths, proving umbrella plus twelve-pillar coverage and rejecting invalid canonical/archive references.

</code_context>

<specifics>
## Specific Ideas

- The site workspace should be `site/`.
- The preferred stack is Astro/Starlight with Bun.
- Phase 1 may include early theme foundations but must not absorb the full book UI/design phase.
- Phase 1 should set up a full static math-rendering toolchain rather than leaving math rendering as a later placeholder.
- The corpus inventory should be explicit typed data with thirteen required entries: umbrella framework plus twelve pillars.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Site Foundation and Provenance Contract*
*Context gathered: 2026-05-14T12:25:42+08:00*
