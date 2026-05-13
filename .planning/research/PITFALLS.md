# Pitfalls Research

**Domain:** Static academic book/wiki website for a Markdown/LaTeX formal research corpus
**Researched:** 2026-05-13
**Confidence:** HIGH for repo-specific source-of-truth risks; MEDIUM for ecosystem tooling risks verified against official MathJax, KaTeX, and Pagefind documentation

## Critical Pitfalls

### Pitfall 1: Website pages become an untraceable fork of the canonical papers

**What goes wrong:**
The website starts as curated exposition but gradually becomes a second source of truth. Definitions, theorem statements, notation, assumptions, and citations differ from `science/paper/` and `pillars/*/paper/`. Readers trust the website, paper authors trust the LaTeX, and the two disagree.

**Why it happens:**
Curated prose is easier to edit than LaTeX, so contributors patch the web pages directly. The project also explicitly rejects fully automatic LaTeX extraction as the only pipeline, which is correct for readability but dangerous without source trails and drift checks.

**How to avoid:**
- Treat canonical LaTeX sources in `science/paper/` and `pillars/*/paper/` as authoritative for formal claims.
- Put source metadata on every formal page: canonical file path, section label if available, theorem/definition identifier, and last reviewed commit/date.
- Require every website definition/theorem/lemma/proposition to include a source pointer back to the canonical paper or a deliberate `site-exposition-only` marker.
- Add a build-time drift audit that checks referenced source paths exist and that extracted labels/citation keys still resolve.
- Make roadmap Phase 1 establish content provenance before polishing design or graph features. Fancy navigation over stale math is just a faster way to mislead readers.

**Warning signs:**
- Pages contain theorem text without `source:` metadata.
- Contributors discuss “fixing the website version” of a definition instead of fixing the canonical paper or documenting an explanatory paraphrase.
- Broken links to moved paper paths after corpus reorganization.
- Multiple glossary entries define the same symbol differently across pillars.

**Phase to address:**
Phase 1: Source inventory, content model, and provenance contract. Re-check in every content expansion phase.

---

### Pitfall 2: Citation and bibliography links rot silently

**What goes wrong:**
Citation keys render as plain text, bibliography entries are missing, cross-page citation links point nowhere, or citations resolve in PDFs but not on the website. The site looks academic but cannot support audit or follow-up reading.

**Why it happens:**
LaTeX/BibTeX citation resolution is paper-local, while a static site usually needs a corpus-wide bibliography index. Pillar papers may have separate `.bib` files, duplicate keys, local macros, or references that work only in the PDF build context.

**How to avoid:**
- Build a corpus-wide citation registry from `science/paper/` and `pillars/*/paper/` bibliography files before authoring citation-heavy pages.
- Normalize citation keys globally and fail the build on unresolved citations, duplicate conflicting keys, or bibliography entries not linked from any rendered page.
- Render a bibliography page plus per-page reference lists, with each citation linking to the bibliography anchor.
- Preserve source trails: citation on website should indicate which canonical paper/section used it when relevant.
- Do not hand-maintain bibliography HTML unless it is generated from checked-in citation data.

**Warning signs:**
- `[@key]`, `\cite{key}`, or bare citation keys appear in built HTML.
- Different pillar pages link the same key to different works.
- Site search finds citation keys but not human-readable titles/authors.
- Bibliography updates require editing many page files manually.

**Phase to address:**
Phase 1: Corpus inventory and bibliography pipeline. Phase 3: Search and citation UX verification.

---

### Pitfall 3: Math rendering is optimized for demos, not for the actual corpus

**What goes wrong:**
Simple inline formulas render, but real corpus math breaks: custom macros fail, theorem environments lose numbering, aligned derivations collapse, equation references do not resolve, or notation renders differently from the PDFs. Readers lose trust because the formal layer is visibly unreliable.

**Why it happens:**
Static-site math renderers are not full LaTeX engines. Official KaTeX documentation states that KaTeX is not full LaTeX and has unsupported or constrained behavior such as no `\par`, limitations around some environments and commands, disabled-by-default trusted commands like `\href`/`\includegraphics`, and no support for `\cline`/`\multicolumn` in `{array}`. MathJax officially supports TeX input and accessible browser rendering, but still needs explicit configuration for macros, numbering, and output behavior.

**How to avoid:**
- Create a representative math fixture suite from the actual umbrella and pillar papers before choosing final rendering settings.
- Prefer MathJax for v1 if the corpus uses broad TeX features, custom macros, accessibility, equation exploration, or copy/paste of math source. Use KaTeX only if fixtures prove its stricter subset covers the corpus and speed is more important than compatibility.
- Centralize macro definitions instead of duplicating them per page.
- Add visual/build checks for theorem blocks, aligned derivations, equation labels, references, and long display equations on mobile widths.
- Keep PDFs linked as canonical fallback for every formal page.

**Warning signs:**
- Renderer choice is made from a homepage demo rather than real paper snippets.
- Pages contain raw TeX, red error boxes, missing symbols, or silently dropped environments.
- Equation references render as `??` or unlinked numbers.
- Custom macros are copied into individual pages with slight differences.

**Phase to address:**
Phase 1: Math fixture audit and renderer decision. Phase 2: Formal page templates and macro registry. Phase 4: visual regression and accessibility checks.

---

### Pitfall 4: Search indexes pages but not research intent

**What goes wrong:**
Local search technically works, but researchers cannot find definitions, theorem statements, assumptions, symbols, citation titles, or pillar concepts. Results are noisy chapter hits rather than precise entry points.

**Why it happens:**
Static search tools index generated HTML after build. Official Pagefind documentation confirms this model: build the site first, then Pagefind indexes the generated output and ships a static search bundle with no server component. That is a good fit, but naive full-page indexing over long academic chapters buries the useful targets.

**How to avoid:**
- Design searchable content units explicitly: definitions, theorem/proposition/lemma blocks, glossary entries, citation entries, and pillar pages should have stable anchors and metadata.
- Use Pagefind or equivalent after the static build, not during authoring, and make indexing part of CI/deploy.
- Exclude boilerplate navigation, repeated source panels, and footer text from the index.
- Add filters/tags for pillar, content type, notation, theorem, definition, citation, and reading path.
- Create a search quality test set: representative queries such as “CVIH”, “verification scheduling”, “prompt injection”, theorem names, symbols, and citation authors must return expected targets in the top results.

**Warning signs:**
- Search results mostly show chapter titles rather than anchored formal blocks.
- Common symbols or acronyms return dozens of indistinguishable results.
- Search works locally only when a dev server is running.
- Pagefind indexing is a manual post-build step that can be forgotten.

**Phase to address:**
Phase 3: Local search and metadata. Start content-unit metadata in Phase 1 so Phase 3 is not a retrofitting slog.

---

### Pitfall 5: Graph links become decorative spaghetti

**What goes wrong:**
The site advertises graph-style exploration, but the graph is either a hairball of every link or a sparse gimmick disconnected from the reading experience. Users cannot distinguish conceptual dependency, analogy, citation, prerequisite, contradiction, or “related topic”.

**Why it happens:**
Projects often treat graph navigation as a visualization feature rather than an information architecture problem. Formal research corpora need typed relationships and editorial constraints; otherwise every cross-link has the same weight and the graph teaches nothing.

**How to avoid:**
- Define a small relationship taxonomy before building graph UI: `defines`, `uses`, `generalizes`, `depends-on`, `contrasts-with`, `cites`, `appears-in-pillar`, `see-also`.
- Keep graph data as structured metadata near pages or generated from explicit frontmatter, not inferred purely from Markdown links.
- Use graph views as local context panels around a concept/theorem, not as the primary navigation spine.
- Set density budgets: every formal node should have enough links to explain context, not enough links to impress in a screenshot.
- Validate graph edges during build: target exists, relation type is allowed, source/target IDs are stable.

**Warning signs:**
- All edges are untyped “related” links.
- The graph is useful only on the homepage demo.
- The same concept appears as duplicate nodes because slugs changed or aliases were not modeled.
- Users rely on browser find instead of graph navigation.

**Phase to address:**
Phase 2: Cross-link model and page templates. Phase 3: graph UI after link semantics are already stable.

---

### Pitfall 6: Content maintainability collapses under twelve pillars

**What goes wrong:**
The first one or two pages are polished, then the remaining pillars become inconsistent: different theorem styles, missing derivations, uneven source trails, inconsistent notation tables, and ad hoc frontmatter. The site never reaches credible v1 coverage of all twelve pillars.

**Why it happens:**
The project requires umbrella plus all twelve pillars in v1. A hand-crafted editorial approach is valuable, but without templates and acceptance checklists, it scales linearly with contributor attention and fails at the boring middle.

**How to avoid:**
- Build a pillar page contract before writing all pages: summary, source trail, notation, definitions, assumptions, theorem/proposition list, derivations, interpretation, related pillars, citations.
- Create one golden pillar page, then use it as the template for every pillar.
- Track coverage in a generated inventory table: page exists, source paths linked, definitions count, theorem count, derivations present, citations resolved, graph links present, search anchors present.
- Prefer boring consistency over bespoke layouts per pillar.
- Reject v1 completion if any pillar lacks formal content coverage, even if the homepage looks finished.

**Warning signs:**
- Only one pillar has full theorem/derivation treatment.
- Page frontmatter differs by author or day.
- Pillar pages use different names for the same fields: `source`, `sources`, `canonical`, `paper`.
- Roadmap prioritizes visual polish before proving all-pillar content throughput.

**Phase to address:**
Phase 1: Content schema and coverage inventory. Phase 2: Pillar page production using a locked template.

---

### Pitfall 7: Overbuilding interactivity for a static publication

**What goes wrong:**
The project drifts into accounts, comments, live graph databases, hosted search, server-side CMS behavior, or complex client-side state. Build and deployment become fragile while the core academic value remains unfinished.

**Why it happens:**
“Wiki” and “graph” trigger product instincts from community platforms and knowledge-base apps. But the project context explicitly scopes v1 as a static research publication: no accounts, no server-side database/CMS, no collaborative editing, and local static search.

**How to avoid:**
- Keep v1 static: generated HTML, static assets, local search index, no runtime database.
- Treat interactivity as progressive enhancement: search, collapsible proofs, local graph panels, copy links, and citation popovers are enough.
- Require every interactive feature to answer: does this improve comprehension, source traceability, or navigation of formal content?
- Defer comments, live editing, user personalization, analytics-heavy recommendation, and remote search services.
- Keep the repository as the CMS; use git review for content changes.

**Warning signs:**
- A database appears in architecture diagrams for v1.
- Graph implementation requires a server to answer basic page navigation questions.
- Developers spend more time on animation/state management than on source trails, math fixtures, and search quality.
- “We can add accounts later easily” appears in planning despite being out of scope.

**Phase to address:**
Phase 0/1: Architecture guardrails and out-of-scope enforcement. Reassess before any graph/search implementation.

---

### Pitfall 8: Visual identity damages readability of formal math

**What goes wrong:**
The site looks stylish but is hostile to study: low contrast, small type, narrow or overly wide measure, fragile dark-mode math, decorative typography in formulas, cramped theorem blocks, or mobile layouts that cut off equations. It feels designed for screenshots rather than researchers.

**Why it happens:**
The requirement asks for a distinctive, book-like identity and explicitly not a clone of Thinking Machines Lab. Teams can overcorrect into visual novelty and forget that formal math pages are reading tools, not campaign pages.

**How to avoid:**
- Design from representative dense pages, not the homepage.
- Establish typography tokens for prose, code, inline math, display math, theorem labels, captions, footnotes, and bibliography entries.
- Test long equations, aligned derivations, nested lists, theorem/proof blocks, citation-heavy paragraphs, and side notes in light/dark modes.
- Use horizontal scrolling for unavoidable long equations, but avoid making normal derivations require it.
- Validate accessibility: contrast, focus states, keyboard navigation, skip links, semantic headings, and math renderer accessibility behavior.

**Warning signs:**
- Design review uses only marketing-style overview pages.
- Equations overflow cards or disappear behind sidebars.
- Theorem/proof blocks are visually pretty but hard to scan.
- Dark mode changes math color without checking renderer output.

**Phase to address:**
Phase 2: Design system and formal content templates. Phase 4: accessibility and responsive QA.

---

### Pitfall 9: Archive material leaks into active site content

**What goes wrong:**
Archived or obsolete files are indexed, linked, or summarized as if they are current. Readers encounter stale versions, duplicate pages, or contradictory claims from preservation artifacts.

**Why it happens:**
The repository intentionally preserves legacy and obsolete artifacts under `archive/`, `science/archive/`, and pillar-local `archive/`. Static site generators and search indexers often glob Markdown/TeX broadly unless told not to.

**How to avoid:**
- Default-deny content inclusion. Explicitly enumerate active source roots and exclude all archive paths unless a provenance page intentionally discusses them.
- Make the migration manifest a lookup aid, not a content source.
- Add build checks that fail if active pages source formal claims from `archive/` without an explicit provenance exception.
- Exclude archive paths from search indexing.

**Warning signs:**
- Search returns archived root-legacy pages before current pillar pages.
- Build config uses broad globs like `**/*.md` without path filters.
- Page source trails point into `archive/obsolete-builds/`.
- Old paper titles appear as duplicate chapters.

**Phase to address:**
Phase 1: Source selection and archive exclusion rules. Phase 3: search exclusion verification.

---

### Pitfall 10: Build reproducibility is treated as optional

**What goes wrong:**
The website builds on one laptop but not in CI or on another machine. Math macros, bibliography generation, symlinked class files, local-only assets, and search indexing produce different outputs depending on environment.

**Why it happens:**
The current corpus is primarily a LaTeX document repository, with local-only behavior such as untracked `logo.pdf` and paper-local class links. Adding a static site introduces a second build pipeline that can accidentally depend on local filesystem state.

**How to avoid:**
- Define a single site build command that includes page generation, math rendering configuration, bibliography/citation validation, graph metadata validation, and Pagefind indexing.
- Pin package versions and renderer versions.
- Treat local-only paper assets as paper-build concerns unless explicitly needed by the website.
- Run CI from a clean checkout and fail on missing generated artifacts, unresolved links, unresolved citations, math render errors, or search index absence.
- Document which generated files are committed versus produced during deploy.

**Warning signs:**
- Developers must run manual commands in undocumented order.
- Search works in preview but deployed site has no index.
- Build output changes because local PDFs, logos, or symlinks differ.
- CI skips math/citation checks because “content is static”.

**Phase to address:**
Phase 1: Build contract and CI skeleton. Phase 4: full release verification.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hand-copy theorem text into pages without source IDs | Fast first pages | Silent drift from canonical papers | Never for formal statements |
| Use broad content globs over the whole repo | Quick site population | Archives, drafts, and obsolete files leak into navigation/search | Never for v1 |
| Duplicate math macros per page | Local fixes are easy | Inconsistent notation and renderer failures | Only for one-off prototypes, then consolidate before Phase 2 |
| Manually maintain bibliography HTML | Avoids citation tooling upfront | Broken citations and duplicate references | Never beyond a throwaway spike |
| Build one highly polished pillar first without a coverage template | Great demo | Remaining eleven pillars become inconsistent or unfinished | Acceptable only as a golden template spike with explicit extraction of reusable schema |
| Add graph visualization before typed link metadata | Impressive screenshots | Useless hairball navigation | Never; metadata first |
| Rely on hosted search out of convenience | Easy relevance tuning | Violates static/local search constraint and adds service dependency | Not for v1 |

## Integration Gotchas

Common mistakes when connecting corpus sources to static-site tooling.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| LaTeX source to web pages | Assuming LaTeX can be rendered directly as readable web prose | Curate pages, but attach every formal claim to canonical source metadata |
| Math renderer | Choosing by speed benchmark or default theme demo | Run real corpus fixtures through MathJax/KaTeX and choose based on compatibility, accessibility, and maintainability |
| Bibliography | Treating each pillar paper bibliography independently | Build a corpus-wide citation registry with duplicate/conflict detection |
| Static search | Indexing whole pages only | Index structured anchors for definitions, theorems, glossary terms, citations, and pillar concepts |
| Graph links | Inferring all relationships from Markdown links | Store typed relationships explicitly and validate IDs during build |
| Archives | Letting generator crawl archived Markdown/TeX | Explicitly exclude archive paths and require provenance exceptions |
| PDFs | Treating PDFs as replacement for web formal pages | Link PDFs as canonical fallback while rendering accessible web explanations |

## Performance Traps

Patterns that work at small scale but fail as the corpus grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Client loads full graph for every page | Slow first load, noisy UI, mobile jank | Load local neighborhood per page; lazy-load full map only if needed | Once every definition/theorem/citation becomes a node |
| Search index includes boilerplate and archives | Large index, poor relevance, stale results | Exclude nav/footer/archive content; index semantic blocks with metadata | As soon as all twelve pillars plus bibliography are indexed |
| Huge chapters without anchors | Search and deep links land at page top | Generate stable anchors for sections, definitions, theorem blocks, equations, and citations | Immediately for long academic pages |
| Heavy client-side math rendering with many equations | Slow page hydration and layout shift | Pre-render where possible or configure renderer carefully; split dense pages | Dense derivation pages with dozens of display equations |
| Decorative animations around navigation/graph | Battery drain and inaccessible navigation | Prefer static diagrams and simple progressive enhancement | Mobile and low-power devices |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Enabling trusted TeX/HTML commands blindly in math rendering | XSS or unsafe HTML if any generated/third-party content enters the pipeline | Keep content source-controlled, sanitize rendered HTML, and only enable trusted commands needed by audited corpus fixtures |
| Publishing local-only or generated artifacts accidentally | Leaks local paths, draft notes, or noncanonical assets | Use explicit include lists and clean-checkout CI builds |
| Adding third-party scripts for search/analytics/graph widgets | Privacy and supply-chain risk inconsistent with static research publication | Prefer self-hosted static bundles and no analytics by default |
| Rendering raw citation or source metadata unsanitized | Broken HTML or injection if metadata contains special characters | Escape metadata and validate schemas during build |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Book navigation only | Researchers cannot follow concept dependencies across pillars | Provide linear chapters plus typed related-concept links |
| Graph navigation only | Readers lose the argument and prerequisite order | Keep book spine as primary; graph as contextual exploration |
| Definitions without examples or interpretation | Formal content is technically present but hard to understand | Pair formal statements with interpretation and source trail |
| Theorems without assumptions | Readers misapply claims | Template theorem blocks with assumptions, statement, proof/derivation, interpretation, source |
| Search result snippets from boilerplate | Search feels broken despite indexing | Index semantic blocks and suppress nav/footer/source-panel noise |
| Visual novelty over reading comfort | Fatigue, poor comprehension, inaccessible pages | Optimize typography and layout for dense formal reading first |
| No clear canonical/source link | Readers cannot audit claims | Put source trail near every formal section, not hidden in footer |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Math rendering:** Simple equations render, but representative pillar derivations, custom macros, labels, and aligned equations have been tested.
- [ ] **Citations:** Every visible citation resolves to a bibliography entry and every bibliography anchor is linkable.
- [ ] **Source trails:** Every formal page points to canonical `science/paper/` or `pillars/*/paper/` paths, not archives.
- [ ] **Search:** Query tests for symbols, theorem names, pillar concepts, and citation authors return expected anchors in top results.
- [ ] **Graph links:** Edges are typed, validated, and useful from a concept page; not just a global visualization.
- [ ] **All-pillar coverage:** Umbrella plus all twelve pillars meet the same minimum formal-content checklist.
- [ ] **Archives:** Archive paths are excluded from page generation and search unless explicitly marked as provenance content.
- [ ] **Responsive design:** Long equations, theorem blocks, side notes, and bibliography entries work on narrow screens.
- [ ] **Accessibility:** Keyboard navigation, heading hierarchy, contrast, focus states, and math accessibility are verified.
- [ ] **Reproducibility:** Clean-checkout CI can build the site and search index without local-only assets.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Website drift from canonical papers | HIGH | Freeze content edits; build source inventory; add source metadata; diff formal statements against canonical files; repair page by page |
| Broken citations | MEDIUM | Generate global citation registry; fail unresolved keys; normalize duplicates; regenerate bibliography and page reference lists |
| Bad math rendering | MEDIUM to HIGH | Build fixture suite from failing pages; centralize macros; switch/configure renderer; add visual regression checks |
| Poor search relevance | MEDIUM | Add semantic anchors and metadata; exclude boilerplate/archive content; create query test set; rerun Pagefind after build |
| Graph spaghetti | MEDIUM | Remove global graph as primary UI; define relation taxonomy; convert edges to typed metadata; show local neighborhoods only |
| Inconsistent pillar pages | HIGH | Stop new bespoke pages; define template; audit all pages against coverage matrix; retrofit missing sections before adding features |
| Overbuilt runtime architecture | HIGH | Cut server/database features from v1; return to static build artifacts; preserve only progressive-enhancement client features |
| Visual design harms math readability | MEDIUM | Redesign from dense formal fixtures; adjust typography/layout tokens; run accessibility and responsive review |
| Archive leakage | MEDIUM | Switch from include-by-glob to explicit source list; purge generated pages/search entries; add archive path build guard |
| Nonreproducible builds | MEDIUM | Pin dependencies; create one build command; run clean CI; document generated artifacts and deployment order |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Website pages become an untraceable fork | Phase 1: Source inventory and provenance contract | Every formal page has canonical source metadata; build fails on missing source paths |
| Citation and bibliography rot | Phase 1: Citation registry; Phase 3: citation search UX | Unresolved/duplicate conflicting citations fail CI; bibliography page has stable anchors |
| Math rendering fails on real corpus | Phase 1: fixture audit and renderer decision; Phase 2: macro/template integration | Fixture suite passes for representative derivations, theorem blocks, labels, and references |
| Search indexes pages but not intent | Phase 3: Local search and metadata | Query test set returns expected definitions/theorems/citations in top results |
| Graph links become decorative spaghetti | Phase 2: typed link model; Phase 3: graph UI | Edge schema validates; graph panel explains relation types and avoids duplicate nodes |
| Content maintainability collapses | Phase 1: content schema; Phase 2: all-pillar production | Coverage matrix shows umbrella plus all twelve pillars meet minimum checklist |
| Overbuilding interactivity | Phase 0/1: architecture guardrails | Architecture contains no v1 database/accounts/server dependency; interactivity tied to comprehension/navigation |
| Visual identity damages readability | Phase 2: design system; Phase 4: QA | Dense formal pages pass responsive, contrast, keyboard, and math readability checks |
| Archive material leaks into active site | Phase 1: source selection; Phase 3: search exclusion | Archive paths absent from generated navigation/search except explicit provenance pages |
| Build reproducibility is optional | Phase 1: build contract; Phase 4: release gate | Clean checkout CI builds pages, citations, graph metadata, and search index successfully |

## Sources

- Project context: `/home/prannayag/harness_eng/.planning/PROJECT.md` — canonical sources, twelve-pillar coverage, static/local-search constraints, out-of-scope dynamic features.
- Existing architecture analysis: `/home/prannayag/harness_eng/.planning/codebase/ARCHITECTURE.md` — source-of-truth locations, archive discipline, shared LaTeX asset constraints.
- Existing concerns analysis: `/home/prannayag/harness_eng/.planning/codebase/CONCERNS.md` — local search/indexing and large-payload cautionary patterns from adjacent tooling.
- MathJax official documentation/website: `https://www.mathjax.org/`, `https://docs.mathjax.org/en/latest/output/index.html`, `https://docs.mathjax.org/en/latest/basic/accessibility.html` — TeX/MathML/AsciiMath input, browser output, and accessibility support.
- KaTeX official supported-functions documentation: `https://katex.org/docs/supported` — supported TeX subset and documented limitations/trust constraints.
- Pagefind official documentation: `https://pagefind.app/docs/` — static generated-HTML indexing model, no server component, post-build indexing workflow.

---
*Pitfalls research for: static formal research wiki site over a Markdown/LaTeX corpus*
*Researched: 2026-05-13*
