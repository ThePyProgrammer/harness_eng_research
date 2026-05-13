<!-- GSD:project-start source:PROJECT.md -->
## Project

**Harness Architecture Book Wiki**

A static, book-like research website for the AI coding agent harness architecture corpus. It presents the umbrella framework and all twelve pillar papers as an accessible academic wiki: clear chapter navigation, formal definitions, theorem statements, derivations, citations, source trails, local search, and graph-style cross-links between concepts.

The site is optimized for researchers who want rigorous mathematical structure without digging through every LaTeX source first. It should feel stylistic and editorial, but with its own identity rather than a close copy of Thinking Machines Lab.

**Core Value:** Researchers can understand, navigate, and cross-reference the corpus's formal pillar definitions, theorems, and derivations without losing the rigor of the canonical papers.

### Constraints

- **Source of truth**: Canonical content comes from `science/paper/` and `pillars/*/paper/` — website pages must link back to these sources rather than becoming untraceable forks
- **Coverage**: v1 must include the umbrella paper and all twelve pillars — a narrow one-pillar demo is insufficient
- **Math depth**: v1 should include full derivations where the corpus supports them — definitions-only summaries are too shallow
- **Format**: v1 should be static — avoids unnecessary server/runtime complexity for a research publication
- **Navigation**: The site must support both book-chapter reading and wiki/graph-style exploration — researchers need linear and associative paths
- **Search**: Search must be local/static — no hosted search service or database required for v1
- **Visual identity**: The site should be original and book-like — inspired by high-end research/editorial sites, but not a close clone
- **Repository discipline**: Do not treat `archive/` material as active source unless a page explicitly discusses provenance
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- Markdown - Repository documentation, pillar READMEs, research notes, migration docs, and corpus navigation in `README.md`, `docs/`, `research/`, `science/`, and `pillars/`.
- LaTeX - Canonical paper sources and shared document templates in `pillars/*/paper/*.tex`, `final_papers/`, `assets/latex/`, and the `latex-document-skill/assets/templates/` tree.
- Bash - Build, conversion, packaging, and utility scripts in `latex-document-skill/scripts/*.sh`, `latex-document-skill/setup.sh`, and `latex-document-skill/tests/*.sh`.
- Python 3 - Document automation and validation utilities in `latex-document-skill/scripts/*.py` and `latex-document-skill/tests/*.py`.
- JSON/YAML-like config formats - Data exchange for scripts and metadata files in the skill and corpus tooling.
## Runtime
- Mixed documentation workspace, not a single application runtime.
- TeX toolchain runtime for LaTeX compilation via `pdflatex`, `xelatex`, `lualatex`, `bibtex`, `biber`, `latexmk`, and `texfot` as orchestrated by `latex-document-skill/scripts/compile_latex.sh`.
- Python 3 runtime for the document skill utilities and tests in `latex-document-skill/scripts/` and `latex-document-skill/tests/`.
- No repository-level package manager detected at the root.
- Python dependencies are managed with `pip` through `latex-document-skill/requirements.txt`.
- Lockfile: missing.
## Frameworks
- LaTeX document classes and packages - The repository is centered on LaTeX papers and templates in `pillars/*/paper/*.tex`, `final_papers/`, and `latex-document-skill/assets/templates/`.
- KOMA-Script, Beamer, exam, tikzposter, book, article, extarticle - Document-class families used across templates in `latex-document-skill/assets/templates/`.
- pytest - Python test runner used in `latex-document-skill/tests/test_python_scripts.py` and `latex-document-skill/tests/test_pdf_forms.py`.
- Bash-based integration tests - Script-level validation in `latex-document-skill/tests/test_compile_latex.sh`, `latex-document-skill/tests/test_pdf_utils.sh`, `latex-document-skill/tests/test_analysis_tools.sh`, and `latex-document-skill/tests/test_templates.sh`.
- TeX Live toolchain - Primary build system for LaTeX PDFs, including `pdflatex`, `xelatex`, `lualatex`, `latexmk`, `biber`, `makeindex`, and `makeglossaries`.
- Pandoc - Format conversion in `latex-document-skill/scripts/convert_document.sh`.
- Poppler - PDF page extraction and preview generation in `latex-document-skill/scripts/compile_latex.sh`, `latex-document-skill/scripts/pdf_to_images.sh`, and `latex-document-skill/scripts/pdf_merge.sh`.
- ImageMagick - Image resizing and manipulation for document workflows in `latex-document-skill/setup.sh` and related utilities.
- qpdf - PDF encryption, merge, optimize, and page extraction workflows referenced by `latex-document-skill/scripts/pdf_encrypt.sh`, `latex-document-skill/scripts/pdf_merge.sh`, and `latex-document-skill/scripts/pdf_optimize.sh`.
## Key Dependencies
- `matplotlib` - Used by `latex-document-skill/scripts/generate_chart.py` for chart generation.
- `numpy` - Used by `latex-document-skill/scripts/generate_chart.py` for numeric chart data handling.
- `pandas` - Used by `latex-document-skill/scripts/csv_to_latex.py` and `latex-document-skill/scripts/generate_chart.py` for CSV ingestion and tabular transformation.
- `jinja2` - Used by `latex-document-skill/scripts/mail_merge.py` for advanced template rendering.
- `pypdf` - Used by `latex-document-skill/scripts/pdf_check_form.py`, `latex-document-skill/scripts/pdf_extract_fields.py`, `latex-document-skill/scripts/pdf_fill_form.py`, `latex-document-skill/scripts/pdf_fill_annotations.py`, and `latex-document-skill/scripts/pdf_validate_boxes.py`.
- `chktex` - LaTeX linting support via `latex-document-skill/scripts/latex_lint.sh` and `.chktexrc` at `latex-document-skill/.chktexrc`.
- `latexdiff` - Version diffing support via `latex-document-skill/scripts/latex_diff.sh`.
- `graphviz` - `.dot` rendering via `latex-document-skill/scripts/graphviz_to_pdf.sh`.
- `mermaid-cli` - Mermaid diagram rendering via `latex-document-skill/scripts/mermaid_to_image.sh`.
- Java runtime - Required for PlantUML rendering via `latex-document-skill/scripts/plantuml_to_pdf.sh`.
- `curl` - BibTeX fetching from external identifiers in `latex-document-skill/scripts/fetch_bibtex.sh`.
## Configuration
- Tooling is configured by script discovery rather than a central application config.
- `latex-document-skill/setup.sh` bootstraps system dependencies and Python packages from `latex-document-skill/requirements.txt`.
- `latex-document-skill/scripts/install_deps.sh` maps logical package names to platform-specific package manager packages.
- LaTeX lint behavior is tuned by `latex-document-skill/.chktexrc`.
- Repository layout and canonical document locations are described in `README.md` and the pillar-specific `README.md` files.
- `latex-document-skill/scripts/compile_latex.sh` is the primary build entry point for `.tex` to PDF and PNG preview generation.
- `latex-document-skill/scripts/convert_document.sh` wraps Pandoc for Markdown, DOCX, HTML, LaTeX, and PDF conversion.
- `latex-document-skill/scripts/pdf_to_images.sh` and `latex-document-skill/scripts/pdf_merge.sh` support page rendering and document assembly.
- Shared LaTeX assets live in `assets/latex/`, while document sources and outputs are organized under `science/`, `pillars/`, `final_papers/`, `papers/`, and `archive/`.
## Platform Requirements
- Python 3.7+ for the LaTeX skill scripts and tests.
- A TeX Live distribution with `pdflatex`, `xelatex`, `lualatex`, `biber`, `latexmk`, `makeindex`, `makeglossaries`, and `texfot` available or installable.
- Poppler utilities for `pdftoppm` and `pdfinfo`.
- ImageMagick for image preprocessing.
- Pandoc for cross-format conversion.
- Optional Node.js 18+ for Mermaid rendering, Java for PlantUML, Graphviz for `.dot` diagrams, and `chktex` / `latexdiff` for quality workflows.
- Static document corpus stored in git; outputs are PDFs, PNG previews, and preserved artifacts under `science/`, `pillars/`, `final_papers/`, `papers/`, `outputs/`, and `archive/`.
- No server runtime, container orchestration, or application hosting stack detected.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Obsidian plugin modules use PascalCase filenames that mirror exported classes, such as `src/canvas/CanvasAdapter.ts`, `src/canvas/LayoutEngine.ts`, `src/canvas/NodePlacer.ts`, `src/ui/ChatboxPanel.ts`, and `src/transport/WebSocketClient.ts`.
- Python backend modules use snake_case filenames, such as `backend/main.py`, `backend/research.py`, `backend/organize.py`, `backend/drill.py`, `backend/synthesize.py`, and `backend/vault_search.py`.
- Test files follow the source filename plus `.test.ts` / `test_*.py`, such as `tests/layout-engine.test.ts`, `tests/ws-client.test.ts`, `backend/tests/test_research.py`, and `latex-document-skill/tests/test_python_scripts.py`.
- Use `camelCase` for TypeScript methods and helpers, such as `computeLayout`, `buildCanvasUpdate`, `applyMutation`, `setConnectionState`, and `sanitizeFileName` in `src/canvas/LayoutEngine.ts`, `src/canvas/CanvasAdapter.ts`, `src/ui/ChatboxPanel.ts`, and `src/types.ts`.
- Use `snake_case` for Python functions, such as `run_research_session`, `run_organize_pass`, `run_drill_session`, `run_synthesis_session`, `score_vault_results`, and `render_template` in `backend/research.py`, `backend/organize.py`, `backend/drill.py`, `backend/synthesize.py`, `backend/vault_search.py`, and `latex-document-skill/scripts/mail_merge.py`.
- Prefer verbs that describe the effect: `buildCanvasUpdate`, `createLinkedFileIfNeeded`, `scheduleReconnect`, `generate_output_name`, `extract_preamble_packages`.
- Use descriptive camelCase for TS locals and fields, such as `reconnectDelay`, `sessionPrompts`, `activeSessions`, `groupedNodeIds`, and `nodeById`.
- Use snake_case for Python locals and parameters, such as `session_id`, `parent_content`, `vault_nodes`, and `result_text`.
- Prefer boolean names that read as predicates, such as `canWriteViaInternalAPI`, `intentionalClose`, `isDrill`, `submitEnabled`, and `inputEnabled`.
- Use PascalCase for TypeScript interfaces and classes, such as `CanvasResearcherSettings`, `CanvasNode`, `TopicAssignment`, `EdgeAssignment`, `WebSocketClient`, and `LayoutEngine` in `src/types.ts` and `src/canvas/LayoutEngine.ts`.
- Keep Python data structures lightweight and dictionary-based unless a class adds behavior; backend payloads remain plain dicts in `backend/*.py`.
## Code Style
- TypeScript code is written in strict mode via `tsconfig.json` in `.obsidian/plugins/harness-canvas-research/tsconfig.json` (`"strict": true`). Keep new TS code type-safe and avoid introducing implicit `any`.
- The plugin code uses 2-space indentation, semicolons, single-quoted imports, and compact inline object literals in places like `src/canvas/LayoutEngine.ts` and `src/ui/ChatboxPanel.ts`.
- Python code uses standard PEP 8 spacing and docstrings. Keep functions short and avoid deeply nested branching where a small helper can isolate the behavior.
- TypeScript files include explicit `eslint-disable-next-line @typescript-eslint/no-explicit-any` comments where Obsidian internals force untyped access, as seen in `src/main.ts`, `src/canvas/CanvasAdapter.ts`, and `src/ui/ChatboxPanel.ts`.
- Prefer targeted suppression over broad disabling. If `any` is unavoidable for Obsidian canvas internals, localize the suppression to the smallest line or block.
- No repository-wide formatter config was detected at the root; preserve the prevailing style in adjacent files instead of reformatting unrelated code.
## Import Organization
- TypeScript path aliases are minimal; `tsconfig.json` only maps `obsidian` to the bundled type definitions in `.obsidian/plugins/harness-canvas-research/tsconfig.json`.
- Prefer relative imports for plugin modules and Python modules; no shared alias system is present.
## Error Handling
- Use `try/catch` around network, file, and CLI boundaries, then convert failures into user-visible status updates or structured error events. Examples: `backend/research.py`, `backend/drill.py`, `backend/synthesize.py`, `latex-document-skill/scripts/mail_merge.py`, `latex-document-skill/scripts/generate_chart.py`, and `latex-document-skill/scripts/validate_latex.py`.
- WebSocket-facing backend handlers send JSON error payloads with a `retryable` flag. Follow the existing split: transient failures in `backend/research.py` and `backend/drill.py` use `retryable: True`; deterministic failures in `backend/synthesize.py` and `backend/main.py` organize flow use `retryable: False`.
- Canvas writes use a fallback strategy in `src/canvas/CanvasAdapter.ts`: validate internal API support once, then fall back to `vault.process()` when direct canvas mutation is unavailable.
- Prefer returning structured results or sentinel values rather than throwing across module boundaries. For example, `backend/vault_search.py` filters and ranks results, while `src/canvas/CanvasAdapter.ts` returns capability state through `isInternalAPIAvailable()`.
- CLI scripts should print errors to `stderr` and exit non-zero on failure, as in `latex-document-skill/scripts/csv_to_latex.py` and `latex-document-skill/scripts/validate_latex.py`.
## Logging
- Use `console.debug` for session/state tracing, `console.info` for capability detection, `console.error` for recoverable failures, and `console.warn` for environmental warnings when appropriate. See `src/main.ts`, `src/canvas/CanvasAdapter.ts`, `src/transport/WebSocketClient.ts`, and `src/ui/ChatboxPanel.ts`.
- Python backend modules log progress and parse diagnostics to stderr, not stdout, so JSON payloads and CLI outputs stay separable. See `backend/research.py`, `backend/organize.py`, `backend/drill.py`, and `backend/synthesize.py`.
- Keep logs specific and operational: session IDs, node IDs, response lengths, and failure reasons are logged in `backend/*.py` and `src/main.ts`.
## Comments
- Comment why a workaround exists, especially when interacting with Obsidian internals or external tools. Examples include the `@ts-ignore` on the bundled `elkjs` import in `src/canvas/LayoutEngine.ts` and the `any`-based Obsidian canvas access in `src/main.ts`.
- Use comments to document invariants, fallbacks, or ordering constraints, such as the write-serialization guarantee in `src/canvas/WriteQueue.ts` and the compound-graph behavior in `src/canvas/LayoutEngine.ts`.
- Avoid duplicating what the code already says; prefer comments that explain the reason for a non-obvious choice.
- Exported TS classes and major methods commonly carry docblocks in `src/canvas/LayoutEngine.ts`, `src/canvas/CanvasAdapter.ts`, `src/canvas/WriteQueue.ts`, and `src/ui/ChatboxPanel.ts`. Keep that style for new exported behavior.
- Python scripts use module docstrings and function docstrings for CLI behavior and test purpose, as in `backend/main.py`, `backend/research.py`, and `latex-document-skill/scripts/validate_latex.py`.
## Function Design
- Keep functions focused on one responsibility. Stateful orchestration lives in classes like `src/main.ts` and `src/ui/ChatboxPanel.ts`; pure utilities live in `src/types.ts`, `src/canvas/SubNodePlacer.ts`, and `latex-document-skill/scripts/*.py`.
- Split layout, placement, serialization, and UI code into dedicated modules instead of adding more branches to `src/main.ts`.
- Prefer explicit parameters over global access when the function can be tested in isolation. Examples: `computeLayout(nodes, edges, topics)` in `src/canvas/LayoutEngine.ts` and `score_vault_results(query, index)` in `backend/vault_search.py`.
- Keep payloads in plain objects/arrays so tests can construct them directly, as in `src/types.ts` and `backend/tests/test_organize.py`.
- Return plain data structures or `Promise<void>` when the side effect is the important outcome. Examples: `buildCanvasUpdate(...) : void`, `animateLayout(...) : Promise<void>`, and `run_research_session(...) : None`.
- Return `null` or `false` for capability checks and optional lookups instead of throwing, as in `CanvasAdapter.getCurrentCanvas()` and `CanvasAdapter.isInternalAPIAvailable()`.
## Module Design
- Prefer one primary class or a small set of related pure helpers per module. `src/canvas/LayoutEngine.ts` exports `LayoutEngine`, `src/canvas/NodePlacer.ts` exports `NodePlacer` plus `formatNodeText`, and `src/types.ts` exports shared payload types plus small pure helpers.
- Python modules export a single coroutine or a narrow set of helpers: `run_research_session` in `backend/research.py`, `run_organize_pass` in `backend/organize.py`, and `score_vault_results` in `backend/vault_search.py`.
- No barrel/export-index pattern was detected. Import modules directly from their concrete paths.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```text
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
- Canonical sources live in `science/paper/` and `pillars/*/paper/`; supporting work stays beside the owning pillar in `notes/`, `research/`, and `reviews/`.
- Shared layout and typography come from `assets/latex/googledeepmind.cls`, while paper-local `googledeepmind.cls` entries are symlinks or normalized copies for local compilation.
- Legacy root-level material is not deleted; it is moved into `archive/` or pillar-local `archive/` trees and tracked in `docs/migration/final-papers-rearchitecture-manifest.md`.
## Layers
- Purpose: Holds the canonical deliverables that define the architecture corpus.
- Location: `science/paper/`, `pillars/*/paper/`
- Contains: `.tex`, `.bib`, `.pdf`, `.maf`, and paper-local class links.
- Depends on: `assets/latex/` and standard LaTeX packages.
- Used by: Readers, compilers, and migration tooling.
- Purpose: Captures the analytic material that justifies and extends the canonical papers.
- Location: `science/synthesis/`, `science/reviews/`, `pillars/*/notes/`, `pillars/*/research/`, `pillars/*/reviews/`
- Contains: synthesis notes, research drafts, concept notes, reviews, plans, and canvases.
- Depends on: The canonical corpus and the relevant pillar topic.
- Used by: The umbrella paper, pillar papers, and future refinement work.
- Purpose: Supplies shared LaTeX classes and any local-only compile prerequisites.
- Location: `assets/latex/`
- Contains: class files and README guidance for the tracked asset contract.
- Depends on: LaTeX engine resolution at build time.
- Used by: `science/paper/science.tex` and `pillars/*/paper/*.tex`.
- Purpose: Holds historical artifacts that no longer belong in canonical paths.
- Location: `archive/`, `science/archive/`, `pillars/*/archive/`
- Contains: legacy root papers, obsolete build helpers, drafts, and ambiguous artifacts.
- Depends on: Migration manifest entries for provenance.
- Used by: Audit, archaeology, and rebuild traceability.
## Data Flow
### Primary Request Path
### Cross-Pillar Synthesis Flow
### Migration / Preservation Flow
- There is no application runtime state; the repository state is the filesystem layout and the canonical document sources.
- The only persistent special case is local-only `logo.pdf` behavior under `assets/latex/`, which is intentionally not tracked in Git (`assets/latex/README.md:1-6`).
## Key Abstractions
- Purpose: A bounded architectural dimension with one canonical paper and supporting material.
- Examples: `pillars/abstraction/README.md`, `pillars/coordination/README.md`, `pillars/security/README.md`
- Pattern: `paper/`, `notes/`, `research/`, `reviews/`, `archive/` contract (`pillars/README.md:20-29`).
- Purpose: The top-level synthesis that unifies the pillar set.
- Examples: `science/paper/science.tex`, `science/README.md`
- Pattern: One source of cross-pillar framing, with reviews and drafts kept beside it (`science/README.md:1-24`).
- Purpose: Reusable paper styling and build behavior for the corpus.
- Examples: `assets/latex/googledeepmind.cls`, `science/paper/googledeepmind.cls`
- Pattern: Canonical implementation in `assets/latex/`, paper-local symlink or copy for convenient compilation.
- Purpose: Stable path-to-path mapping for rearchitecture work.
- Examples: `docs/migration/final-papers-rearchitecture-manifest.md`
- Pattern: Treat as the source of truth when resolving old locations to new ones.
## Entry Points
- Location: `science/paper/science.tex`
- Triggers: Manual LaTeX compilation or corpus-wide review.
- Responsibilities: Defines the framework, references all pillars, and sets the cross-pillar narrative.
- Location: `pillars/*/paper/*.tex`
- Triggers: Per-pillar compilation and focused architectural review.
- Responsibilities: Present one pillar’s formal framework and empirical calibration.
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
### Adding new pillar material outside the folder contract
## Error Handling
- Keep old material in archives rather than deleting it, then record the move in `docs/migration/final-papers-rearchitecture-manifest.md`.
- Use local-only assets such as `logo.pdf` by copying or symlinking them into the paper directory without tracking them in Git (`assets/latex/README.md:1-6`).
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
