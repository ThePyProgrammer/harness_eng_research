# External Integrations

**Analysis Date:** 2026-05-13

## APIs & External Services

**Bibliography retrieval:**
- DOI resolution and BibTeX retrieval - `latex-document-skill/scripts/fetch_bibtex.sh` fetches BibTeX entries from `https://doi.org/<doi>` using the `Accept: application/x-bibtex` header.
  - SDK/Client: `curl`
  - Auth: Not applicable
- arXiv BibTeX retrieval - `latex-document-skill/scripts/fetch_bibtex.sh` fetches entries from `https://arxiv.org/bibtex/<id>`.
  - SDK/Client: `curl`
  - Auth: Not applicable

**Diagram rendering:**
- Mermaid CLI - `latex-document-skill/scripts/mermaid_to_image.sh` invokes `npx @mermaid-js/mermaid-cli mmdc` for `.mmd` to PNG/PDF conversion.
  - SDK/Client: Node package `@mermaid-js/mermaid-cli`
  - Auth: Not applicable
- Graphviz - `latex-document-skill/scripts/graphviz_to_pdf.sh` invokes `dot`, `neato`, `circo`, `fdp`, `twopi`, or `sfdp` for `.dot` rendering.
  - SDK/Client: Graphviz binaries
  - Auth: Not applicable
- PlantUML - `latex-document-skill/scripts/plantuml_to_pdf.sh` is referenced by the skill documentation and uses Java-based PlantUML rendering.
  - SDK/Client: PlantUML JAR / Java runtime
  - Auth: Not applicable

**Document conversion and build:**
- Pandoc - `latex-document-skill/scripts/convert_document.sh` uses Pandoc for Markdown, DOCX, HTML, LaTeX, and PDF conversions.
  - SDK/Client: `pandoc`
  - Auth: Not applicable
- TeX toolchain - `latex-document-skill/scripts/compile_latex.sh` and `latex-document-skill/setup.sh` call `pdflatex`, `xelatex`, `lualatex`, `latexmk`, `bibtex`, `biber`, `makeindex`, `makeglossaries`, and `texfot`.
  - SDK/Client: TeX Live binaries
  - Auth: Not applicable

## Data Storage

**Databases:**
- None detected. The repository is a static document corpus and a local document-automation skill.

**File Storage:**
- Local filesystem only.
- LaTeX sources, references, generated PDFs, previews, and preserved archives live in `science/`, `pillars/`, `final_papers/`, `papers/`, `archive/`, `outputs/`, and `latex-document-skill/assets/`.
- Temporary working directories are created by `latex-document-skill/scripts/compile_latex.sh` and `latex-document-skill/scripts/mail_merge.py` with `mktemp`.

**Caching:**
- None detected.

## Authentication & Identity

**Auth Provider:**
- None detected.
- There is no login, SSO, OAuth, token exchange, or identity provider integration in the repository.
- External requests made by `latex-document-skill/scripts/fetch_bibtex.sh` rely on public DOI and arXiv endpoints only.

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- Script-level stderr/stdout logging only.
- `latex-document-skill/scripts/compile_latex.sh` translates LaTeX errors into human-readable diagnostics from `.log` files.
- `latex-document-skill/scripts/mail_merge.py` prints compile and merge errors per record.
- Test failures are surfaced through `pytest` and shell exit codes in `latex-document-skill/tests/`.

## CI/CD & Deployment

**Hosting:**
- Not applicable.
- The repository does not expose a web application or deployment target.

**CI Pipeline:**
- Not detected in repository files read for this audit.
- Test orchestration exists locally in `latex-document-skill/tests/run_all_tests.sh` and related test scripts.

## Environment Configuration

**Required env vars:**
- None detected.
- The scripts rely on installed binaries, not secret-bearing environment configuration.

**Secrets location:**
- None detected.
- No secret store, credentials file, or private-key material is referenced by the discovered tooling.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- HTTP GET requests to `doi.org` and `arxiv.org` from `latex-document-skill/scripts/fetch_bibtex.sh`.
- No webhook receivers or callback endpoints detected.

---

*Integration audit: 2026-05-13*