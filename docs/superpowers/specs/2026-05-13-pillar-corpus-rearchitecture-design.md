# Pillar Corpus Repository Rearchitecture Design

## Purpose

Reorganize this repository around its real deliverable: the formal AI coding agent harness architecture paper corpus. The current structure makes `final_papers/` the canonical output directory, but related notes, research rounds, reviews, drafts, concepts, proposals, and legacy paper versions are scattered across root-level directories. The target architecture makes `pillars/` the intellectual spine of the repository, colocating each paper with the notes and evidence that support it while keeping the root directory minimal.

This is a physical file move plan, not just a documentation/index redesign. Content should be preserved, not deleted, except for the special `logo.pdf` Git tracking rule below.

## Goals

- Make the repository browsable by pillar.
- Keep the root directory minimal.
- Move each canonical paper beside its supporting research, reviews, notes, and archived drafts.
- Preserve all substantive tracked artifacts by moving them to clearer homes.
- Demote duplicate, legacy, draft, and generated artifacts into archive folders instead of deleting them.
- Keep a migration manifest so reviewers can trace old paths to new paths.
- Remove `logo.pdf` from the Git tree while leaving the local file in place.

## Non-goals

- Rewrite or substantially edit paper contents.
- Delete substantive research, notes, drafts, reviews, or legacy paper versions.
- Preserve backwards-compatible duplicate copies at old paths.
- Build a package-style source tree. This is a paper corpus, not an application.
- Solve every ambiguous classification perfectly in the first pass. Ambiguous files can move to `archive/unsorted/` with a manifest entry.

## Chosen top-level architecture

Use `pillars/` as the corpus spine and move the umbrella paper to `science/`.

```text
/
├── README.md
├── science/
│   ├── README.md
│   ├── paper/
│   ├── synthesis/
│   ├── reviews/
│   └── archive/
├── pillars/
│   ├── README.md
│   ├── abstraction/
│   ├── information/
│   ├── reliability/
│   ├── coordination/
│   ├── temporal/
│   ├── quality/
│   ├── governance/
│   ├── economics/
│   ├── human-interaction/
│   ├── model-routing/
│   ├── security/
│   └── accretion/
├── assets/
│   ├── latex/
│   └── shared/
├── archive/
│   ├── root-legacy/
│   ├── obsolete-builds/
│   └── unsorted/
└── docs/
    └── superpowers/specs/
```

The root should ultimately contain only the corpus entry points and shared infrastructure: `README.md`, `science/`, `pillars/`, `assets/`, `archive/`, and project documentation/tool metadata that must remain rooted.

`final_papers/` is treated as the current source location, not the long-term organizing model. Its canonical contents move into `science/paper/` and `pillars/<pillar>/paper/`. Backups and drafts move into local archive folders.

## Per-pillar folder contract

Each pillar folder follows the same internal structure.

```text
pillars/<pillar>/
├── README.md
├── paper/
│   ├── <pillar>.tex
│   ├── <pillar>.bib
│   ├── <pillar>.pdf
│   ├── <pillar>.provenance.md
│   └── build/
├── notes/
│   ├── concepts/
│   ├── frameworks/
│   ├── proposals/
│   └── canvases/
├── research/
│   ├── plan.md
│   ├── raw/
│   ├── formal/
│   └── bibliography/
├── reviews/
└── archive/
    ├── drafts/
    ├── legacy/
    └── misc/
```

Rules:

- `paper/` contains the canonical publishable artifact for the pillar.
- `README.md` explains the pillar thesis, paper links, key concepts, supporting material, and cross-links.
- `notes/` contains curated intellectual material, not raw generation output.
- `research/` contains evidence-gathering, formalization, plans, and bibliography patches.
- `reviews/` contains peer reviews, critiques, audits, and rebuttal notes.
- `archive/` preserves duplicates, stale drafts, superseded versions, and low-confidence artifacts.
- Tracked build extras such as `.maf`, `.log`, `.blg`, and `.aux` move to `paper/build/` or a local archive folder unless the LaTeX workflow requires them beside the source.

## Canonical paper migration

Move the umbrella paper into `science/paper/`:

```text
final_papers/science.tex  → science/paper/science.tex
final_papers/science.bib  → science/paper/science.bib
final_papers/science.pdf  → science/paper/science.pdf
final_papers/science.maf  → science/paper/build/science.maf
```

Move umbrella backups and draft variants into `science/archive/drafts/`:

```text
final_papers/science-assembled.tex        → science/archive/drafts/science-assembled.tex
final_papers/science_backup.tex           → science/archive/drafts/science_backup.tex
final_papers/science_backup_pre_security.tex → science/archive/drafts/science_backup_pre_security.tex
final_papers/science_new.tex              → science/archive/drafts/science_new.tex
```

Move pillar papers as follows:

```text
final_papers/abstraction_architecture/*        → pillars/abstraction/paper/
final_papers/information_architecture/*        → pillars/information/paper/
final_papers/reliability_architecture/*        → pillars/reliability/paper/
final_papers/coordination_architecture/*       → pillars/coordination/paper/
final_papers/temporal_architecture/*           → pillars/temporal/paper/
final_papers/quality_architecture/*            → pillars/quality/paper/
final_papers/governance_architecture/*         → pillars/governance/paper/
final_papers/economics_architecture/*          → pillars/economics/paper/
final_papers/human_interaction_architecture/*  → pillars/human-interaction/paper/
final_papers/model_routing_architecture/*      → pillars/model-routing/paper/
final_papers/security_architecture/*           → pillars/security/paper/
final_papers/accretion_category/*              → pillars/accretion/paper/
```

For each paper directory, route build products into `paper/build/` when preserving them.

## Existing pillar notes

Current numbered pillar notes become seed material for new pillar READMEs or local notes:

```text
pillars/1-information-architecture.md       → pillars/information/README.md or notes/concepts/original-pillar-note.md
pillars/2-reliability-architecture.md       → pillars/reliability/README.md or notes/concepts/original-pillar-note.md
pillars/3-coordination-architecture.md      → pillars/coordination/README.md or notes/concepts/original-pillar-note.md
pillars/4-temporal-architecture.md          → pillars/temporal/README.md or notes/concepts/original-pillar-note.md
pillars/5-quality-architecture.md           → pillars/quality/README.md or notes/concepts/original-pillar-note.md
pillars/6-governance-architecture.md        → pillars/governance/README.md or notes/concepts/original-pillar-note.md
pillars/7-economics-architecture.md         → pillars/economics/README.md or notes/concepts/original-pillar-note.md
pillars/8-human-interaction-architecture.md → pillars/human-interaction/README.md or notes/concepts/original-pillar-note.md
pillars/9-model-routing-architecture.md     → pillars/model-routing/README.md or notes/concepts/original-pillar-note.md
pillars/10-security-architecture.md         → pillars/security/README.md or notes/concepts/original-pillar-note.md
pillars/README.md                           → pillars/README.md, rewritten as the corpus pillar index
```

Abstraction and accretion do not currently have matching numbered pillar notes, so generate new `README.md` files for them from their paper summaries and supporting artifacts.

## Outputs and research artifact migration

Move `outputs/` artifacts by naming pattern and topic.

```text
outputs/<pillar>-research-r*.md     → pillars/<pillar>/research/raw/
outputs/<pillar>-formal-r*.md       → pillars/<pillar>/research/formal/
outputs/<pillar>-review*.md         → pillars/<pillar>/reviews/
outputs/<pillar>-pillar-section.tex → pillars/<pillar>/archive/drafts/
outputs/.plans/<pillar>.md          → pillars/<pillar>/research/plan.md
outputs/.drafts/<pillar>*.md        → pillars/<pillar>/archive/drafts/
```

Examples:

```text
outputs/info-arch-research-r*.md                 → pillars/information/research/raw/
outputs/info-arch-formal-r*.md                   → pillars/information/research/formal/
outputs/info-arch-review.md                      → pillars/information/reviews/
outputs/reliability-architecture-research-r*.md  → pillars/reliability/research/raw/
outputs/coordination-architecture-formal-r*.md   → pillars/coordination/research/formal/
outputs/quality-architecture-ai-slop-review.md   → pillars/quality/reviews/
outputs/accretion-category-review*.md            → pillars/accretion/reviews/
```

Science and cross-pillar artifacts move under `science/`:

```text
outputs/science-*.md/.tex
outputs/harness-*.md
outputs/perspective-*.md
outputs/deep-research-*.md
outputs/formal-harness-theory-roadmap.md
outputs/formalizable-problems.md
outputs/unified-harness-design.md
  → science/synthesis/, science/reviews/, or science/archive/drafts/
```

Bibliography patches move to the nearest pillar `research/bibliography/` when clearly scoped, otherwise to `science/synthesis/bibliography/`.

## Concepts, frameworks, proposals, canvas notes

Curated support material moves near the most relevant pillar.

```text
concepts/what-is-slop.md                         → pillars/quality/notes/concepts/
frameworks/desloppify.md                         → pillars/quality/notes/frameworks/
proposals/gsd-desloppification.md                → pillars/quality/notes/proposals/
ai-harness-abstraction-gap-research.md           → pillars/abstraction/research/raw/
sdd-research/Large_Language_Models_*.md          → pillars/reliability/research/raw/
Canvas Research/2026-03-17-LLM-as-Judge-*.md     → pillars/quality/notes/canvases/
Canvas Research/2026-03-17-Compound-Error-*.md   → pillars/reliability/notes/canvases/
Canvas Research/2026-03-17-Anthropics-Harness-*.md → pillars/coordination/notes/canvases/
```

Cross-cutting material should live in `science/synthesis/` and be referenced from pillar READMEs rather than forced into one pillar:

```text
concepts/harness-engineering.md → science/synthesis/concepts/
concepts/sdd-ontology.md        → science/synthesis/concepts/
canvases/*.canvas               → science/synthesis/canvases/ or pillar-local notes/canvases/ based on topic
```

## Legacy root clutter and old paper versions

Preserve root-level paper artifacts by moving them to pillar-local or central archive folders.

```text
main.*               → archive/root-legacy/main/
coord-main.*         → pillars/coordination/archive/legacy/root-coord-main/
reliability-main.*   → pillars/reliability/archive/legacy/root-reliability-main/
00README.json        → archive/root-legacy/
Home.md              → archive/root-legacy/ or rewritten into README if useful
papers/*             → matching pillar archive/legacy/ when matched, otherwise archive/unsorted/papers/
research/*           → matching pillar research/raw/ or science/synthesis/research/
```

The migration should favor `git mv` so history remains traceable.

## README and navigation model

### Root `README.md`

The root README remains the public entry point and should include:

- one-paragraph repository purpose,
- link to `science/paper/science.pdf`,
- pillar table linking to each pillar folder and paper,
- suggested reading paths,
- folder convention summary,
- note that archived artifacts are preserved but non-canonical.

### `science/README.md`

The science README should include:

- canonical umbrella paper links,
- relationship to the eleven pillars,
- cross-pillar synthesis notes,
- theorem/concept index if useful,
- warning that `archive/` contains non-canonical drafts and backups.

### `pillars/README.md`

The pillar index should include:

- ordered list of pillars,
- short thesis for each,
- links to `pillars/<pillar>/README.md`,
- cross-pillar dependency notes.

### `pillars/<pillar>/README.md`

Each pillar README should include:

```text
# <Pillar> Architecture

## Canonical paper
- PDF
- Source
- Bibliography

## Thesis

## Key concepts

## Supporting material
- Research
- Formalization
- Reviews
- Notes
- Archive

## Cross-links
```

## Compatibility and old paths

Do not preserve duplicate compatibility copies at old paths. That would keep the root cluttered and undermine the rearchitecture.

Instead:

- update README links to the new locations,
- preserve old content in archive folders,
- optionally leave a short `final_papers/README.md` for one transition commit explaining that the corpus moved to `science/` and `pillars/`,
- after the transition, remove `final_papers/` if it contains only redirect documentation or is no longer needed.

## Shared LaTeX assets and `logo.pdf`

Move shared LaTeX assets out of the root:

```text
googledeepmind.cls → assets/latex/googledeepmind.cls
google.cls         → assets/latex/google.cls
```

Special rule for `logo.pdf`:

- remove all tracked `logo.pdf` files from Git tracking with `git rm --cached` while leaving the local files in place,
- add `logo.pdf` and `**/logo.pdf` to `.gitignore`,
- do not delete local `logo.pdf` files,
- do not move or commit any local-only `logo.pdf` copies created by build workflows.

For each canonical paper, preserve or regenerate local logo files only as untracked build inputs if the LaTeX workflow requires them. Prefer `assets/latex/` as the canonical home for tracked class files and update build instructions to copy or symlink local untracked assets before compiling.

## Migration manifest

Create a checked-in manifest:

```text
docs/migration/final-papers-rearchitecture-manifest.md
```

Each row should include:

- old path,
- new path,
- category,
- canonical vs archive status,
- ambiguity notes if classification is uncertain.

The manifest is required because this migration moves many files and should be reviewable without reconstructing intent from `git diff --summary` alone.

## Validation plan

Before migration:

- record the tracked file list with `git ls-files`,
- identify tracked `logo.pdf` paths,
- classify files into canonical, research, review, note, draft, legacy, asset, or unsorted.

During migration:

- use `git mv` for tracked files whenever practical,
- create destination directories before moving,
- update README links after paths change,
- update LaTeX build instructions for new paths,
- untrack `logo.pdf` without deleting local files.

After migration:

- compare pre-move and post-move tracked file counts, adjusting only for intentionally untracked `logo.pdf`,
- verify every pre-move tracked file has either a new tracked path or an intentional untracked/archive decision in the manifest,
- check README links resolve,
- compile at least the umbrella paper and one representative pillar paper if LaTeX tooling is available,
- run `git status --short` and review unexpected untracked files,
- ensure `.superpowers/` is not committed if visual brainstorming artifacts were generated locally.

## Implementation sequencing

1. Create destination directories and migration manifest skeleton.
2. Move canonical science and pillar papers.
3. Move pillar notes into seed READMEs or notes.
4. Move outputs and research artifacts by pattern.
5. Move concepts, frameworks, proposals, canvas notes, and cross-cutting synthesis.
6. Move legacy root clutter and old paper versions into archive.
7. Move shared LaTeX assets and untrack `logo.pdf` while keeping the local file.
8. Rewrite root, science, and pillar READMEs.
9. Validate link integrity and tracked-file preservation.
10. Commit the migration in reviewable chunks if possible.

## Open implementation choices

These should be resolved during implementation planning, not during the design stage:

- Whether `final_papers/README.md` should exist temporarily as a transition notice.
- Whether each pillar README should be generated from the existing numbered pillar note or hand-synthesized from the canonical paper.
- Whether tracked build extras should live under `paper/build/` or `archive/build/` for each pillar.
- Whether old `papers/` content should be moved pillar-by-pillar in separate commits or as one archive commit.
