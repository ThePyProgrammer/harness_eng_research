# Curated Initial Git History Design

## Goal

Create a clean initial git history for this research corpus with roughly 45-60 story-ordered commits. The history should make the repository navigable by intellectual unit rather than mirror the accidental current filesystem state.

## Repository Boundary

Include source-like research material:

- Core wiki notes: `Home.md`, `concepts/`, `frameworks/`, `pillars/`, `proposals/`
- Research corpora: `research/`, `sdd-research/`, `.research/findings/`, `Canvas Research/`
- Obsidian canvases: `canvases/`
- LaTeX source, bibliographies, classes, and supporting scripts
- Selected final PDFs as deliverables

Exclude non-source or externally managed material:

- `latex-document-skill/`, because it is a nested git repository
- dependency/runtime folders such as `node_modules/` and virtualenvs
- LaTeX build outputs such as `*.aux`, `*.log`, `*.out`, `*.blg`, and `*.maf`
- intermediate/generated PDFs that are not final deliverables
- local editor/cache/runtime state that is not part of the research corpus

## Commit Story

The commit sequence should follow the argument of the research:

1. Repository hygiene and ignore rules
2. Foundational wiki concepts for harness engineering, slop, and SDD
3. Framework landscape notes, comparisons, and canvases
4. Slop and de-sloppification research, including GSD proposals
5. SDD ontology and workflow research
6. Architecture pillar research by theme
7. Review rounds, critique outputs, and synthesis material
8. Final paper sources and selected rendered deliverables

Commit count is approximate. Semantic boundaries matter more than hitting exactly 50 commits.

## Execution Mechanics

Build commits from an explicit staging plan:

1. Add `.gitignore` first so dependency caches, nested repos, and build artifacts stay out of later commits.
2. Generate a candidate inventory after ignore rules are applied.
3. Classify files into story groups by path and filename.
4. Stage each commit with explicit pathspecs rather than broad `git add .`.
5. Inspect each staged diff or stat before committing.
6. Keep final PDFs separate from source commits.
7. Pause for user input when a file is ambiguous rather than hiding it in a random commit.

Do not rewrite author dates or attempt to infer historical timestamps. These commits are curated baseline history, not reconstructed development history.

## Safety Checks

Before finishing:

- Verify no nested `.git` contents, dependency folders, virtualenvs, secrets, or build logs are staged.
- Verify all intended source files are either committed or intentionally ignored.
- Verify final `git status --short` contains only intentionally untracked or ignored files.
- Keep binary deliverables isolated so future textual archaeology remains usable.
