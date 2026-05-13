# Codebase Structure

**Analysis Date:** 2026-05-13

## Directory Layout

```text
harness_eng/
├── science/            # Umbrella paper, synthesis, reviews, and drafts
├── pillars/            # Pillar-specific papers, notes, research, reviews, archives
├── assets/             # Shared tracked LaTeX assets and resources
├── archive/            # Preserved legacy root and obsolete artifacts
├── docs/               # Migration notes and design manifests
├── research/           # Repository-wide research material and findings
├── concepts/           # Cross-cutting concept notes
├── proposals/          # Proposal documents
├── canvases/           # Canvas artifacts and framework maps
└── .planning/          # Generated codebase mapping docs
```

## Directory Purposes

**`science/`:**
- Purpose: Hosts the canonical umbrella paper and the cross-pillar synthesis program.
- Contains: `paper/`, `synthesis/`, `reviews/`, and `archive/`.
- Key files: `science/README.md`, `science/paper/science.tex`, `science/paper/science.bib`, `science/paper/science.pdf`.

**`pillars/`:**
- Purpose: Hosts the per-dimension canonical papers and their supporting material.
- Contains: One directory per pillar, each with `paper/`, `notes/`, `research/`, `reviews/`, and `archive/`.
- Key files: `pillars/README.md`, `pillars/abstraction/README.md`, `pillars/coordination/paper/coordination_architecture.tex`, `pillars/quality/paper/quality_architecture.tex`.

**`assets/`:**
- Purpose: Stores shared tracked assets used by the LaTeX corpus.
- Contains: `latex/` and other reusable resources.
- Key files: `assets/latex/README.md`, `assets/latex/googledeepmind.cls`, `assets/latex/google.cls`.

**`archive/`:**
- Purpose: Preserves legacy root files, obsolete build helpers, and ambiguous material.
- Contains: `root-legacy/`, `obsolete-builds/`, and `unsorted/`.
- Key files: `archive/root-legacy/README.md`, `archive/obsolete-builds/generate_pdf.py`.

**`docs/`:**
- Purpose: Holds migration manifests and repository rearchitecture notes.
- Contains: migration documentation and planning records.
- Key files: `docs/migration/final-papers-rearchitecture-manifest.md`.

**`research/`:**
- Purpose: Holds repository-wide research artifacts that are not pillar-specific.
- Contains: research projects, findings, plans, reports, and state files.
- Key files: `research/harness-frameworks/`, `research/gsd-complaints/`.

**`concepts/`:**
- Purpose: Stores cross-cutting concept notes that feed multiple pillars.
- Contains: conceptual markdown notes.
- Key files: `concepts/harness-engineering.md`, `concepts/sdd-ontology.md`.

**`proposals/`:**
- Purpose: Stores proposal documents, especially around quality and slop-related improvements.
- Contains: proposal markdown files.
- Key files: `proposals/gsd-desloppification.md`, `proposals/gsd-pain-points.md`.

**`canvases/`:**
- Purpose: Stores canvas-format artifacts and framework comparison maps.
- Contains: `.canvas` files and framework comparison directories.
- Key files: `canvases/harness_landscape.canvas`, `canvases/frameworks/`.

## Key File Locations

**Entry Points:**
- `README.md`: Repository overview and navigation.
- `science/README.md`: Umbrella corpus overview and canonical paper entry point.
- `pillars/README.md`: Pillar contract and directory expectations.
- `science/paper/science.tex`: Canonical umbrella paper source.
- `pillars/*/paper/*.tex`: Canonical pillar paper sources.

**Configuration:**
- `assets/latex/googledeepmind.cls`: Shared LaTeX class used by the corpus.
- `assets/latex/README.md`: Notes about tracked assets and local-only logo files.
- `docs/migration/final-papers-rearchitecture-manifest.md`: Path migration map.

**Core Logic:**
- `science/paper/science.tex`: Cross-pillar framework and unified argument.
- `pillars/*/paper/*.tex`: Pillar-specific formal frameworks and empirically grounded papers.
- `pillars/*/research/`: Supporting formal and raw research that informs the paper sources.

**Testing:**
- `latex-document-skill/tests/`: Dedicated LaTeX skill tests for the sibling skill repository.
- No repo-local automated test suite is detected for the corpus itself.

## Naming Conventions

**Files:**
- Canonical pillar papers use snake_case with the pillar topic, such as `coordination_architecture.tex`, `quality_architecture.tex`, and `security_architecture.tex`.
- Research files use descriptive prefixes and revision suffixes, such as `coordination-architecture-research-r1.md` and `quality-architecture-ai-slop-formal-r2.md`.
- Reviews use `*-review.md` or `*-review-<persona>.md` naming, such as `accretion-category-review-formalist.md`.

**Directories:**
- Pillar directories use kebab-case for multiword names, such as `human-interaction/` and `model-routing/`.
- Canonical paper subtrees are consistently named `paper/`, `notes/`, `research/`, `reviews/`, and `archive/`.

## Where to Add New Code

**New Feature:**
- Primary code: `science/paper/` for cross-corpus additions, or `pillars/<pillar>/paper/` for pillar-specific additions.
- Tests: `science/reviews/` for umbrella validation, or `pillars/<pillar>/reviews/` for pillar validation.

**New Component/Module:**
- Implementation: add a new pillar directory under `pillars/` using the existing `paper/` + `notes/` + `research/` + `reviews/` + `archive/` contract.
- If the work is cross-cutting, place supporting synthesis in `science/synthesis/` and review material in `science/reviews/`.

**Utilities:**
- Shared helpers: `assets/latex/` for common LaTeX classes and shared resources.
- Legacy or one-off helpers: `archive/obsolete-builds/` if they are no longer canonical.

## Special Directories

**`archive/`:**
- Purpose: Holds preserved material that should not be treated as live sources.
- Generated: No.
- Committed: Yes.

**`science/archive/` and `pillars/*/archive/`:**
- Purpose: Hold drafts, backups, and legacy artifacts near their owning corpus area.
- Generated: Mixed; some files are build fragments, others are preserved drafts.
- Committed: Yes.

**`assets/latex/`:**
- Purpose: Shared LaTeX class and asset store.
- Generated: No.
- Committed: Yes, except local-only `logo.pdf` files noted in `assets/latex/README.md`.

**`.planning/codebase/`:**
- Purpose: Holds generated repository-mapping documents such as this one.
- Generated: Yes.
- Committed: Typically yes when the mapping task requires it.

---

*Structure analysis: 2026-05-13*