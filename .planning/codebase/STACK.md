# Technology Stack

**Analysis Date:** 2026-05-13

## Languages

**Primary:**
- Markdown - Repository documentation, pillar READMEs, research notes, migration docs, and corpus navigation in `README.md`, `docs/`, `research/`, `science/`, and `pillars/`.
- LaTeX - Canonical paper sources and shared document templates in `pillars/*/paper/*.tex`, `final_papers/`, `assets/latex/`, and the `latex-document-skill/assets/templates/` tree.

**Secondary:**
- Bash - Build, conversion, packaging, and utility scripts in `latex-document-skill/scripts/*.sh`, `latex-document-skill/setup.sh`, and `latex-document-skill/tests/*.sh`.
- Python 3 - Document automation and validation utilities in `latex-document-skill/scripts/*.py` and `latex-document-skill/tests/*.py`.
- JSON/YAML-like config formats - Data exchange for scripts and metadata files in the skill and corpus tooling.

## Runtime

**Environment:**
- Mixed documentation workspace, not a single application runtime.
- TeX toolchain runtime for LaTeX compilation via `pdflatex`, `xelatex`, `lualatex`, `bibtex`, `biber`, `latexmk`, and `texfot` as orchestrated by `latex-document-skill/scripts/compile_latex.sh`.
- Python 3 runtime for the document skill utilities and tests in `latex-document-skill/scripts/` and `latex-document-skill/tests/`.

**Package Manager:**
- No repository-level package manager detected at the root.
- Python dependencies are managed with `pip` through `latex-document-skill/requirements.txt`.
- Lockfile: missing.

## Frameworks

**Core:**
- LaTeX document classes and packages - The repository is centered on LaTeX papers and templates in `pillars/*/paper/*.tex`, `final_papers/`, and `latex-document-skill/assets/templates/`.
- KOMA-Script, Beamer, exam, tikzposter, book, article, extarticle - Document-class families used across templates in `latex-document-skill/assets/templates/`.

**Testing:**
- pytest - Python test runner used in `latex-document-skill/tests/test_python_scripts.py` and `latex-document-skill/tests/test_pdf_forms.py`.
- Bash-based integration tests - Script-level validation in `latex-document-skill/tests/test_compile_latex.sh`, `latex-document-skill/tests/test_pdf_utils.sh`, `latex-document-skill/tests/test_analysis_tools.sh`, and `latex-document-skill/tests/test_templates.sh`.

**Build/Dev:**
- TeX Live toolchain - Primary build system for LaTeX PDFs, including `pdflatex`, `xelatex`, `lualatex`, `latexmk`, `biber`, `makeindex`, and `makeglossaries`.
- Pandoc - Format conversion in `latex-document-skill/scripts/convert_document.sh`.
- Poppler - PDF page extraction and preview generation in `latex-document-skill/scripts/compile_latex.sh`, `latex-document-skill/scripts/pdf_to_images.sh`, and `latex-document-skill/scripts/pdf_merge.sh`.
- ImageMagick - Image resizing and manipulation for document workflows in `latex-document-skill/setup.sh` and related utilities.
- qpdf - PDF encryption, merge, optimize, and page extraction workflows referenced by `latex-document-skill/scripts/pdf_encrypt.sh`, `latex-document-skill/scripts/pdf_merge.sh`, and `latex-document-skill/scripts/pdf_optimize.sh`.

## Key Dependencies

**Critical:**
- `matplotlib` - Used by `latex-document-skill/scripts/generate_chart.py` for chart generation.
- `numpy` - Used by `latex-document-skill/scripts/generate_chart.py` for numeric chart data handling.
- `pandas` - Used by `latex-document-skill/scripts/csv_to_latex.py` and `latex-document-skill/scripts/generate_chart.py` for CSV ingestion and tabular transformation.
- `jinja2` - Used by `latex-document-skill/scripts/mail_merge.py` for advanced template rendering.
- `pypdf` - Used by `latex-document-skill/scripts/pdf_check_form.py`, `latex-document-skill/scripts/pdf_extract_fields.py`, `latex-document-skill/scripts/pdf_fill_form.py`, `latex-document-skill/scripts/pdf_fill_annotations.py`, and `latex-document-skill/scripts/pdf_validate_boxes.py`.

**Infrastructure:**
- `chktex` - LaTeX linting support via `latex-document-skill/scripts/latex_lint.sh` and `.chktexrc` at `latex-document-skill/.chktexrc`.
- `latexdiff` - Version diffing support via `latex-document-skill/scripts/latex_diff.sh`.
- `graphviz` - `.dot` rendering via `latex-document-skill/scripts/graphviz_to_pdf.sh`.
- `mermaid-cli` - Mermaid diagram rendering via `latex-document-skill/scripts/mermaid_to_image.sh`.
- Java runtime - Required for PlantUML rendering via `latex-document-skill/scripts/plantuml_to_pdf.sh`.
- `curl` - BibTeX fetching from external identifiers in `latex-document-skill/scripts/fetch_bibtex.sh`.

## Configuration

**Environment:**
- Tooling is configured by script discovery rather than a central application config.
- `latex-document-skill/setup.sh` bootstraps system dependencies and Python packages from `latex-document-skill/requirements.txt`.
- `latex-document-skill/scripts/install_deps.sh` maps logical package names to platform-specific package manager packages.
- LaTeX lint behavior is tuned by `latex-document-skill/.chktexrc`.
- Repository layout and canonical document locations are described in `README.md` and the pillar-specific `README.md` files.

**Build:**
- `latex-document-skill/scripts/compile_latex.sh` is the primary build entry point for `.tex` to PDF and PNG preview generation.
- `latex-document-skill/scripts/convert_document.sh` wraps Pandoc for Markdown, DOCX, HTML, LaTeX, and PDF conversion.
- `latex-document-skill/scripts/pdf_to_images.sh` and `latex-document-skill/scripts/pdf_merge.sh` support page rendering and document assembly.
- Shared LaTeX assets live in `assets/latex/`, while document sources and outputs are organized under `science/`, `pillars/`, `final_papers/`, `papers/`, and `archive/`.

## Platform Requirements

**Development:**
- Python 3.7+ for the LaTeX skill scripts and tests.
- A TeX Live distribution with `pdflatex`, `xelatex`, `lualatex`, `biber`, `latexmk`, `makeindex`, `makeglossaries`, and `texfot` available or installable.
- Poppler utilities for `pdftoppm` and `pdfinfo`.
- ImageMagick for image preprocessing.
- Pandoc for cross-format conversion.
- Optional Node.js 18+ for Mermaid rendering, Java for PlantUML, Graphviz for `.dot` diagrams, and `chktex` / `latexdiff` for quality workflows.

**Production:**
- Static document corpus stored in git; outputs are PDFs, PNG previews, and preserved artifacts under `science/`, `pillars/`, `final_papers/`, `papers/`, `outputs/`, and `archive/`.
- No server runtime, container orchestration, or application hosting stack detected.

---

*Stack analysis: 2026-05-13*