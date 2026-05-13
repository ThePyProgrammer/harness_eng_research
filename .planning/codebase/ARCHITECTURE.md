<!-- refreshed: 2026-05-13 -->
# Architecture

**Analysis Date:** 2026-05-13

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                 Canonical paper corpus                       │
├──────────────────┬──────────────────┬───────────────────────┤
│  Umbrella paper   │  Pillar papers   │  Shared LaTeX assets  │
│ `science/paper/`  │ `pillars/*/paper/`│ `assets/latex/`      │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│               Supporting research and review layer           │
│ `science/synthesis/`, `science/reviews/`, `pillars/*/notes/`,│
│ `pillars/*/research/`, `pillars/*/reviews/`                  │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Preservation / migration layer               │
│ `archive/`, `pillars/*/archive/`, `science/archive/`,         │
│ `docs/migration/`                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Umbrella framework | Defines the unified corpus and connects all pillars into one architecture | `science/README.md`, `science/paper/science.tex` |
| Pillar corpus | Stores the canonical paper plus supporting material for each architectural dimension | `pillars/README.md`, `pillars/*/paper/*.tex` |
| Shared build assets | Provides reusable LaTeX classes and local-only logo behavior for paper compilation | `assets/latex/googledeepmind.cls`, `assets/latex/README.md` |
| Synthesis material | Holds cross-pillar conceptual work, roadmaps, and reviews that feed the umbrella paper | `science/synthesis/`, `science/reviews/` |
| Migration record | Documents physical file moves and archive destinations after rearchitecture | `docs/migration/final-papers-rearchitecture-manifest.md` |
| Preserved archives | Keeps legacy root content, obsolete builds, and ambiguous artifacts for provenance | `archive/root-legacy/`, `archive/obsolete-builds/`, `archive/unsorted/` |

## Pattern Overview

**Overall:** Canonical corpus with mirrored pillar packages and a single umbrella synthesis paper.

**Key Characteristics:**
- Canonical sources live in `science/paper/` and `pillars/*/paper/`; supporting work stays beside the owning pillar in `notes/`, `research/`, and `reviews/`.
- Shared layout and typography come from `assets/latex/googledeepmind.cls`, while paper-local `googledeepmind.cls` entries are symlinks or normalized copies for local compilation.
- Legacy root-level material is not deleted; it is moved into `archive/` or pillar-local `archive/` trees and tracked in `docs/migration/final-papers-rearchitecture-manifest.md`.

## Layers

**Corpus layer:**
- Purpose: Holds the canonical deliverables that define the architecture corpus.
- Location: `science/paper/`, `pillars/*/paper/`
- Contains: `.tex`, `.bib`, `.pdf`, `.maf`, and paper-local class links.
- Depends on: `assets/latex/` and standard LaTeX packages.
- Used by: Readers, compilers, and migration tooling.

**Support layer:**
- Purpose: Captures the analytic material that justifies and extends the canonical papers.
- Location: `science/synthesis/`, `science/reviews/`, `pillars/*/notes/`, `pillars/*/research/`, `pillars/*/reviews/`
- Contains: synthesis notes, research drafts, concept notes, reviews, plans, and canvases.
- Depends on: The canonical corpus and the relevant pillar topic.
- Used by: The umbrella paper, pillar papers, and future refinement work.

**Build asset layer:**
- Purpose: Supplies shared LaTeX classes and any local-only compile prerequisites.
- Location: `assets/latex/`
- Contains: class files and README guidance for the tracked asset contract.
- Depends on: LaTeX engine resolution at build time.
- Used by: `science/paper/science.tex` and `pillars/*/paper/*.tex`.

**Preservation layer:**
- Purpose: Holds historical artifacts that no longer belong in canonical paths.
- Location: `archive/`, `science/archive/`, `pillars/*/archive/`
- Contains: legacy root papers, obsolete build helpers, drafts, and ambiguous artifacts.
- Depends on: Migration manifest entries for provenance.
- Used by: Audit, archaeology, and rebuild traceability.

## Data Flow

### Primary Request Path

1. Topic-specific research is captured in pillar-local notes and research files such as `pillars/quality/notes/frameworks/desloppify.md` and `pillars/coordination/research/raw/coordination-architecture-research-r1.md`.
2. The research is synthesized into a canonical paper source such as `pillars/quality/paper/quality_architecture.tex` or `science/paper/science.tex` (`science/paper/science.tex:1-19`, `science/paper/science.tex:72-106`).
3. The LaTeX source imports shared classes from `googledeepmind` and compiles to the canonical PDF in the same `paper/` directory (`science/paper/science.tex:1-21`, `pillars/coordination/paper/coordination_architecture.tex:1-34`).

### Cross-Pillar Synthesis Flow

1. Pillar outputs feed the umbrella synthesis through `science/synthesis/` and `science/reviews/` (`science/README.md:15-19`).
2. The umbrella paper integrates all pillars into one framework and explicitly names the eleven dimensions in the introduction (`science/paper/science.tex:78-83`, `science/paper/science.tex:102-118`).
3. Cross-pillar artifacts that no longer belong in canonical locations are redirected into `archive/` and listed in the migration manifest (`docs/migration/final-papers-rearchitecture-manifest.md:1-4`, `docs/migration/final-papers-rearchitecture-manifest.md:15-27`).

### Migration / Preservation Flow

1. Legacy root content is relocated into `archive/root-legacy/` or pillar-local archive trees (`archive/root-legacy/README.md:1-3`).
2. Obsolete shared helpers such as `generate_pdf.py` are preserved in `archive/obsolete-builds/` instead of remaining at the repository root (`docs/migration/final-papers-rearchitecture-manifest.md:412-414`).
3. The manifest is the authoritative record for where a prior path now lives, so update it whenever canonical files move (`docs/migration/final-papers-rearchitecture-manifest.md:1-4`, `docs/migration/final-papers-rearchitecture-manifest.md:38-49`).

**State Management:**
- There is no application runtime state; the repository state is the filesystem layout and the canonical document sources.
- The only persistent special case is local-only `logo.pdf` behavior under `assets/latex/`, which is intentionally not tracked in Git (`assets/latex/README.md:1-6`).

## Key Abstractions

**Pillar:**
- Purpose: A bounded architectural dimension with one canonical paper and supporting material.
- Examples: `pillars/abstraction/README.md`, `pillars/coordination/README.md`, `pillars/security/README.md`
- Pattern: `paper/`, `notes/`, `research/`, `reviews/`, `archive/` contract (`pillars/README.md:20-29`).

**Umbrella paper:**
- Purpose: The top-level synthesis that unifies the pillar set.
- Examples: `science/paper/science.tex`, `science/README.md`
- Pattern: One source of cross-pillar framing, with reviews and drafts kept beside it (`science/README.md:1-24`).

**Shared class file:**
- Purpose: Reusable paper styling and build behavior for the corpus.
- Examples: `assets/latex/googledeepmind.cls`, `science/paper/googledeepmind.cls`
- Pattern: Canonical implementation in `assets/latex/`, paper-local symlink or copy for convenient compilation.

**Migration manifest:**
- Purpose: Stable path-to-path mapping for rearchitecture work.
- Examples: `docs/migration/final-papers-rearchitecture-manifest.md`
- Pattern: Treat as the source of truth when resolving old locations to new ones.

## Entry Points

**Umbrella source:**
- Location: `science/paper/science.tex`
- Triggers: Manual LaTeX compilation or corpus-wide review.
- Responsibilities: Defines the framework, references all pillars, and sets the cross-pillar narrative.

**Pillar sources:**
- Location: `pillars/*/paper/*.tex`
- Triggers: Per-pillar compilation and focused architectural review.
- Responsibilities: Present one pillar’s formal framework and empirical calibration.

**Repository navigation:**
- Location: `README.md`, `science/README.md`, `pillars/README.md`
- Triggers: Human discovery and orchestration by downstream GSD commands.
- Responsibilities: Explain corpus layout and how the pieces fit together.

## Architectural Constraints

- **Build model:** The repository is a LaTeX document corpus, not a software service; the primary execution path is compile-time rather than runtime.
- **Canonical location discipline:** Canonical papers belong in `science/paper/` or `pillars/*/paper/`; supporting material belongs beside the owning corpus unit, not in the repository root.
- **Shared class coupling:** `science/paper/science.tex` and the pillar `.tex` sources depend on the shared `googledeepmind` class, so class changes affect the whole corpus.
- **Archive immutability:** Files under `archive/` are preservation artifacts; do not treat them as active sources unless a migration task explicitly targets them.

## Anti-Patterns

### Editing archived copies instead of canonical sources

**What happens:** Work lands in `archive/` or `archive/obsolete-builds/` while the canonical source in `science/paper/` or `pillars/*/paper/` remains unchanged.
**Why it's wrong:** It breaks the one-source-of-truth model and makes the manifest diverge from the paper actually compiled.
**Do this instead:** Edit the canonical source in `science/paper/science.tex` or the relevant `pillars/*/paper/*.tex`, then update the archive only through migration.

### Adding new pillar material outside the folder contract

**What happens:** New notes, research, or review files are placed ad hoc in the repository root or beside unrelated pillars.
**Why it's wrong:** It destroys discoverability and makes the corpus impossible to navigate consistently.
**Do this instead:** Add material under the owning pillar’s `notes/`, `research/`, `reviews/`, or `archive/` subtree as described in `pillars/README.md:20-29`.

## Error Handling

**Strategy:** Preservation-first and manifest-driven.

**Patterns:**
- Keep old material in archives rather than deleting it, then record the move in `docs/migration/final-papers-rearchitecture-manifest.md`.
- Use local-only assets such as `logo.pdf` by copying or symlinking them into the paper directory without tracking them in Git (`assets/latex/README.md:1-6`).

## Cross-Cutting Concerns

**Logging:** Not applicable; the repository uses documents and manifests instead of runtime logs.

**Validation:** LaTeX compilation and review files validate the papers at build time.

**Authentication:** Not applicable; there is no service boundary or user auth layer in this repository.

---

*Architecture analysis: 2026-05-13*