# Pillar Corpus Rearchitecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Physically reorganize the repository so `pillars/` is the corpus spine, `science/` holds the umbrella paper, and pillar-adjacent research, notes, reviews, drafts, and archives live beside each canonical paper.

**Architecture:** This is a preserve-all migration using `git mv` for tracked files, a checked-in migration manifest for traceability, and small validation scripts after each move batch. `logo.pdf` is the exception: all tracked logo PDFs are removed from Git with `git rm --cached` and ignored, while local files remain on disk.

**Tech Stack:** Git, Bash/POSIX shell, Python 3 for validation scripts, Markdown documentation, LaTeX/Tectonic if available for optional compile checks.

---

## File structure and responsibilities

### Create

- `docs/migration/final-papers-rearchitecture-manifest.md`  
  Human-readable old-path to new-path manifest. Every moved or intentionally untracked file gets a row.

- `docs/migration/pre-migration-tracked-files.txt`  
  Snapshot of tracked files before the migration. Used for preservation validation.

- `docs/migration/post-migration-tracked-files.txt`  
  Snapshot of tracked files after the migration. Used for preservation validation.

- `science/README.md`  
  Landing page for the umbrella paper and cross-pillar synthesis material.

- `pillars/abstraction/README.md`  
  Landing page for abstraction pillar.

- `pillars/information/README.md`  
  Landing page for information pillar.

- `pillars/reliability/README.md`  
  Landing page for reliability pillar.

- `pillars/coordination/README.md`  
  Landing page for coordination pillar.

- `pillars/temporal/README.md`  
  Landing page for temporal pillar.

- `pillars/quality/README.md`  
  Landing page for quality pillar.

- `pillars/governance/README.md`  
  Landing page for governance pillar.

- `pillars/economics/README.md`  
  Landing page for economics pillar.

- `pillars/human-interaction/README.md`  
  Landing page for human interaction pillar.

- `pillars/model-routing/README.md`  
  Landing page for model routing pillar.

- `pillars/security/README.md`  
  Landing page for security pillar.

- `pillars/accretion/README.md`  
  Landing page for accretion paper.

- `archive/root-legacy/README.md`  
  Explains that this folder contains preserved root-level legacy artifacts.

- `archive/unsorted/README.md`  
  Explains that this folder contains preserved artifacts whose pillar ownership was ambiguous.

### Modify

- `README.md`  
  Update all links from `final_papers/...` to `science/...` and `pillars/<pillar>/...`. Keep this as the minimal root entry point.

- `pillars/README.md`  
  Rewrite from the old pillar note index into the new corpus pillar index.

- `.gitignore`  
  Add `logo.pdf`, `**/logo.pdf`, and `.superpowers/` so local logo files and visual companion artifacts stay untracked.

### Move

- `final_papers/science.*` to `science/paper/` or `science/archive/drafts/`.
- `final_papers/*_architecture/*` to `pillars/<pillar>/paper/`.
- `final_papers/accretion_category/*` to `pillars/accretion/paper/`.
- `outputs/*` to pillar-local `research/`, `reviews/`, or `archive/drafts/` folders.
- `concepts/`, `frameworks/`, `proposals/`, `Canvas Research/`, `canvases/`, `research/`, `papers/`, and root legacy paper files into pillar-local or central archive folders according to the design spec.

### Do not stage

- `.superpowers/`
- any local-only `logo.pdf`
- any newly generated LaTeX build products unless already tracked and intentionally preserved in the manifest.

---

## Task 1: Capture baseline and create migration scaffolding

**Files:**
- Create: `docs/migration/pre-migration-tracked-files.txt`
- Create: `docs/migration/final-papers-rearchitecture-manifest.md`
- Create: `archive/root-legacy/README.md`
- Create: `archive/unsorted/README.md`
- Modify: `.gitignore`

- [ ] **Step 1: Confirm working tree only has expected untracked companion artifacts**

Run:

```bash
git status --short
```

Expected: either clean, or only `.superpowers/` plus the untracked plan file before this plan is committed. If there are unexpected modified or untracked files, stop and ask the user before moving files.

- [ ] **Step 2: Record the baseline tracked file list**

Run:

```bash
mkdir -p docs/migration archive/root-legacy archive/unsorted
printf '# Pre-migration tracked files\n\nGenerated before the pillar corpus rearchitecture.\n\n' > docs/migration/pre-migration-tracked-files.txt
git ls-files >> docs/migration/pre-migration-tracked-files.txt
```

Expected: `docs/migration/pre-migration-tracked-files.txt` exists and includes the current tracked file list.

- [ ] **Step 3: Write the migration manifest skeleton**

Create `docs/migration/final-papers-rearchitecture-manifest.md` with exactly this initial content:

```markdown
# Final Papers Rearchitecture Manifest

This manifest records the physical file migration that reorganizes the repository around `science/` and `pillars/`.

| Old path | New path | Category | Status | Notes |
|---|---|---|---|---|
```

Run:

```bash
python - <<'PY'
from pathlib import Path
path = Path('docs/migration/final-papers-rearchitecture-manifest.md')
path.write_text("""# Final Papers Rearchitecture Manifest

This manifest records the physical file migration that reorganizes the repository around `science/` and `pillars/`.

| Old path | New path | Category | Status | Notes |
|---|---|---|---|---|
""")
PY
```

Expected: manifest exists with only the header and table header.

- [ ] **Step 4: Add ignore rules for local assets and visual companion state**

Modify `.gitignore` by appending this block if not already present:

```gitignore
# Local paper assets
logo.pdf
**/logo.pdf

# Local brainstorming companion output
.superpowers/
```

Run:

```bash
python - <<'PY'
from pathlib import Path
path = Path('.gitignore')
text = path.read_text()
block = """
# Local paper assets
logo.pdf
**/logo.pdf

# Local brainstorming companion output
.superpowers/
"""
if 'logo.pdf\n**/logo.pdf' not in text:
    path.write_text(text.rstrip() + '\n' + block)
PY
```

Expected: `.gitignore` contains `logo.pdf`, `**/logo.pdf`, and `.superpowers/`.

- [ ] **Step 5: Add archive README files**

Run:

```bash
python - <<'PY'
from pathlib import Path
files = {
    'archive/root-legacy/README.md': '# Root Legacy Archive\n\nThis directory preserves files that previously lived in the repository root but are not canonical corpus entry points after the pillar rearchitecture.\n',
    'archive/unsorted/README.md': '# Unsorted Archive\n\nThis directory preserves files whose pillar ownership was ambiguous during the initial physical migration. Files here should remain listed in the migration manifest.\n',
}
for name, content in files.items():
    path = Path(name)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
PY
```

Expected: both archive README files exist.

- [ ] **Step 6: Commit migration scaffolding**

Run:

```bash
git add .gitignore docs/migration/pre-migration-tracked-files.txt docs/migration/final-papers-rearchitecture-manifest.md archive/root-legacy/README.md archive/unsorted/README.md
git commit -m "$(cat <<'EOF'
Prepare pillar corpus migration scaffolding

Record the pre-migration tracked file list, create the migration manifest, and ignore local paper logos and brainstorming artifacts.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds. Do not stage `.superpowers/`.

---

## Task 2: Move canonical science and pillar paper artifacts

**Files:**
- Move: `final_papers/science*` to `science/`
- Move: `final_papers/*_architecture/*` to `pillars/<pillar>/paper/`
- Move: `final_papers/accretion_category/*` to `pillars/accretion/paper/`
- Modify: `docs/migration/final-papers-rearchitecture-manifest.md`

- [ ] **Step 1: Create destination directories**

Run:

```bash
mkdir -p \
  science/paper/build science/archive/drafts \
  pillars/abstraction/paper/build \
  pillars/information/paper/build \
  pillars/reliability/paper/build \
  pillars/coordination/paper/build \
  pillars/temporal/paper/build \
  pillars/quality/paper/build \
  pillars/governance/paper/build \
  pillars/economics/paper/build \
  pillars/human-interaction/paper/build \
  pillars/model-routing/paper/build \
  pillars/security/paper/build \
  pillars/accretion/paper/build
```

Expected: all target paper directories exist.

- [ ] **Step 2: Move umbrella science canonical files and drafts**

Run:

```bash
git mv final_papers/science.tex science/paper/science.tex
git mv final_papers/science.bib science/paper/science.bib
git mv final_papers/science.pdf science/paper/science.pdf
if git ls-files --error-unmatch final_papers/science.maf >/dev/null 2>&1; then git mv final_papers/science.maf science/paper/build/science.maf; fi
for f in final_papers/science-assembled.tex final_papers/science_backup.tex final_papers/science_backup_pre_security.tex final_papers/science_new.tex; do
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then git mv "$f" science/archive/drafts/"$(basename "$f")"; fi
done
```

Expected: canonical science files are under `science/paper/`; draft variants are under `science/archive/drafts/`.

- [ ] **Step 3: Move pillar paper directory contents except logo PDFs**

Run:

```bash
python - <<'PY'
from pathlib import Path
import subprocess
mapping = {
    'abstraction_architecture': 'abstraction',
    'information_architecture': 'information',
    'reliability_architecture': 'reliability',
    'coordination_architecture': 'coordination',
    'temporal_architecture': 'temporal',
    'quality_architecture': 'quality',
    'governance_architecture': 'governance',
    'economics_architecture': 'economics',
    'human_interaction_architecture': 'human-interaction',
    'model_routing_architecture': 'model-routing',
    'security_architecture': 'security',
    'accretion_category': 'accretion',
}
build_exts = {'.maf', '.log', '.blg', '.aux', '.out'}
for src_dir, pillar in mapping.items():
    src = Path('final_papers') / src_dir
    if not src.exists():
        continue
    for path in sorted(src.iterdir()):
        if path.name == 'logo.pdf':
            continue
        if path.suffix in build_exts:
            dest = Path('pillars') / pillar / 'paper' / 'build' / path.name
        else:
            dest = Path('pillars') / pillar / 'paper' / path.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['git', 'mv', str(path), str(dest)], check=True)
PY
```

Expected: all tracked non-logo paper files move to pillar-local `paper/` or `paper/build/` folders.

- [ ] **Step 4: Untrack all tracked logo PDFs without deleting local files**

Run:

```bash
git ls-files '*logo.pdf' > /tmp/tracked-logo-files.txt
if test -s /tmp/tracked-logo-files.txt; then
  xargs -a /tmp/tracked-logo-files.txt git rm --cached
fi
```

Expected: `git status --short` shows deleted tracked logo paths, and local files still exist on disk.

Verify local files still exist:

```bash
while read -r f; do test -f "$f" || echo "MISSING LOCAL LOGO: $f"; done < /tmp/tracked-logo-files.txt
```

Expected: no `MISSING LOCAL LOGO` output.

- [ ] **Step 5: Append canonical paper moves to the manifest**

Run:

```bash
python - <<'PY'
from pathlib import Path
rows = [
('| final_papers/science.tex | science/paper/science.tex | canonical paper | moved | Umbrella source |'),
('| final_papers/science.bib | science/paper/science.bib | canonical bibliography | moved | Umbrella bibliography |'),
('| final_papers/science.pdf | science/paper/science.pdf | canonical PDF | moved | Umbrella PDF |'),
('| final_papers/science.maf | science/paper/build/science.maf | build artifact | moved if tracked | Preserved build metadata |'),
('| final_papers/science-assembled.tex | science/archive/drafts/science-assembled.tex | draft | archived | Preserved assembly draft |'),
('| final_papers/science_backup.tex | science/archive/drafts/science_backup.tex | draft | archived | Preserved backup |'),
('| final_papers/science_backup_pre_security.tex | science/archive/drafts/science_backup_pre_security.tex | draft | archived | Preserved pre-security backup |'),
('| final_papers/science_new.tex | science/archive/drafts/science_new.tex | draft | archived | Preserved alternate draft |'),
]
for src, pillar in {
    'abstraction_architecture': 'abstraction',
    'information_architecture': 'information',
    'reliability_architecture': 'reliability',
    'coordination_architecture': 'coordination',
    'temporal_architecture': 'temporal',
    'quality_architecture': 'quality',
    'governance_architecture': 'governance',
    'economics_architecture': 'economics',
    'human_interaction_architecture': 'human-interaction',
    'model_routing_architecture': 'model-routing',
    'security_architecture': 'security',
    'accretion_category': 'accretion',
}.items():
    rows.append(f'| final_papers/{src}/ | pillars/{pillar}/paper/ | canonical paper directory | moved | Non-logo files moved; logo.pdf untracked locally |')
rows.append('| **/logo.pdf | local filesystem only | local asset | untracked | Removed from Git tracking, preserved on disk |')
path = Path('docs/migration/final-papers-rearchitecture-manifest.md')
path.write_text(path.read_text() + '\n'.join(rows) + '\n')
PY
```

Expected: manifest includes canonical science, pillar paper, and logo untracking rows.

- [ ] **Step 6: Verify canonical paper destinations exist**

Run:

```bash
python - <<'PY'
from pathlib import Path
required = [
 'science/paper/science.tex',
 'science/paper/science.bib',
 'science/paper/science.pdf',
 'pillars/abstraction/paper/abstraction_architecture.tex',
 'pillars/information/paper/information_architecture.tex',
 'pillars/reliability/paper/reliability_architecture.tex',
 'pillars/coordination/paper/coordination_architecture.tex',
 'pillars/temporal/paper/temporal_architecture.tex',
 'pillars/quality/paper/quality_architecture.tex',
 'pillars/governance/paper/governance_architecture.tex',
 'pillars/economics/paper/economics_architecture.tex',
 'pillars/human-interaction/paper/human_interaction_architecture.tex',
 'pillars/model-routing/paper/model_routing_architecture.tex',
 'pillars/security/paper/security_architecture.tex',
 'pillars/accretion/paper/accretion_category.tex',
]
missing = [p for p in required if not Path(p).exists()]
if missing:
    print('\n'.join(missing))
    raise SystemExit(1)
print('canonical paper destinations ok')
PY
```

Expected: `canonical paper destinations ok`.

- [ ] **Step 7: Commit canonical paper migration**

Run:

```bash
git add -A science pillars docs/migration .gitignore
git commit -m "$(cat <<'EOF'
Move canonical papers into science and pillar folders

Relocate the umbrella paper and pillar papers into the new corpus spine, preserve build artifacts under paper/build, and untrack logo PDFs while leaving local copies available.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds. `git status --short` may show local untracked logo PDFs and `.superpowers/`; those must remain unstaged.

---

## Task 3: Move existing pillar notes and create pillar README skeletons

**Files:**
- Move/modify: `pillars/*.md`
- Create/modify: `pillars/<pillar>/README.md`
- Modify: `docs/migration/final-papers-rearchitecture-manifest.md`

- [ ] **Step 1: Create pillar support directories**

Run:

```bash
for p in abstraction information reliability coordination temporal quality governance economics human-interaction model-routing security accretion; do
  mkdir -p "pillars/$p/notes/concepts" "pillars/$p/research/raw" "pillars/$p/research/formal" "pillars/$p/research/bibliography" "pillars/$p/reviews" "pillars/$p/archive/drafts" "pillars/$p/archive/legacy" "pillars/$p/archive/misc"
done
```

Expected: support directories exist for every pillar.

- [ ] **Step 2: Move numbered pillar notes into note archives**

Run:

```bash
git mv pillars/1-information-architecture.md pillars/information/notes/concepts/original-pillar-note.md
git mv pillars/2-reliability-architecture.md pillars/reliability/notes/concepts/original-pillar-note.md
git mv pillars/3-coordination-architecture.md pillars/coordination/notes/concepts/original-pillar-note.md
git mv pillars/4-temporal-architecture.md pillars/temporal/notes/concepts/original-pillar-note.md
git mv pillars/5-quality-architecture.md pillars/quality/notes/concepts/original-pillar-note.md
git mv pillars/6-governance-architecture.md pillars/governance/notes/concepts/original-pillar-note.md
git mv pillars/7-economics-architecture.md pillars/economics/notes/concepts/original-pillar-note.md
git mv pillars/8-human-interaction-architecture.md pillars/human-interaction/notes/concepts/original-pillar-note.md
git mv pillars/9-model-routing-architecture.md pillars/model-routing/notes/concepts/original-pillar-note.md
git mv pillars/10-security-architecture.md pillars/security/notes/concepts/original-pillar-note.md
```

Expected: numbered pillar notes become `original-pillar-note.md` files.

- [ ] **Step 3: Write pillar README files**

Run:

```bash
python - <<'PY'
from pathlib import Path
pillars = {
'abstraction': ('Abstraction Architecture', 'Specification-to-code abstraction gaps, refinement, and formal interfaces.', 'abstraction_architecture'),
'information': ('Information Architecture', 'Context selection, degradation, tiered memory, and reuse discovery.', 'information_architecture'),
'reliability': ('Reliability Architecture', 'Compound error, verification scheduling, structural enforcement, and adaptive verification.', 'reliability_architecture'),
'coordination': ('Coordination Architecture', 'Multi-agent decomposition, merge conflicts, ownership, and quality-adjusted speedup.', 'coordination_architecture'),
' temporal'.strip(): ('Temporal Architecture', 'Verified iterations per hour, staleness, speculation, caching, and speed-quality tradeoffs.', 'temporal_architecture'),
'quality': ('Quality Architecture', 'AI code slop, layered defense, detection limits, accretion, and cost of quality.', 'quality_architecture'),
'governance': ('Governance Architecture', 'Governance capacity, ratchets, decision survival, and theory preservation.', 'governance_architecture'),
'economics': ('Economics Architecture', 'Token budgets, model-tier selection, queueing economics, CVIH, and caching economics.', 'economics_architecture'),
'human-interaction': ('Human Interaction Architecture', 'Human attention allocation, autonomy boundaries, trust calibration, and supervision decay.', 'human_interaction_architecture'),
'model-routing': ('Model Routing Architecture', 'Stage-specific model assignment, cross-model diversity, cascades, and escalation.', 'model_routing_architecture'),
'security': ('Security Architecture', 'Sandboxing, credential flow, prompt injection, output filtering, and defense-in-depth.', 'security_architecture'),
'accretion': ('The Accretion Category', 'A defect class for individually plausible but collectively harmful AI-generated code.', 'accretion_category'),
}
for slug, (title, thesis, paper_slug) in pillars.items():
    path = Path('pillars') / slug / 'README.md'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"""# {title}

## Canonical paper

- [PDF](paper/{paper_slug}.pdf)
- [Source](paper/{paper_slug}.tex)
- [Bibliography](paper/{paper_slug}.bib)

## Thesis

{thesis}

## Supporting material

- `notes/` contains curated concepts, frameworks, proposals, and canvas notes.
- `research/` contains raw research, formalization notes, plans, and bibliography support.
- `reviews/` contains critiques, audits, and review reports.
- `archive/` contains preserved drafts, legacy versions, and low-confidence artifacts.

## Cross-links

See the root README and `../README.md` for the full pillar map.
""")
PY
```

Expected: every pillar has a README with canonical paper links.

- [ ] **Step 4: Rewrite `pillars/README.md` as the pillar index**

Run:

```bash
python - <<'PY'
from pathlib import Path
Path('pillars/README.md').write_text("""# Pillars

This directory is the spine of the AI coding agent harness architecture corpus. Each pillar folder contains the canonical paper, supporting notes, research artifacts, reviews, and preserved archives for that architectural dimension.

| Pillar | Focus |
|---|---|
| [Abstraction](abstraction/) | Specification-to-code abstraction gaps, refinement, and formal interfaces |
| [Information](information/) | Context selection, degradation, tiered memory, and reuse discovery |
| [Reliability](reliability/) | Compound error, verification scheduling, structural enforcement, and adaptive verification |
| [Coordination](coordination/) | Multi-agent decomposition, merge conflicts, ownership, and quality-adjusted speedup |
| [Temporal](temporal/) | Verified iterations per hour, staleness, speculation, caching, and speed-quality tradeoffs |
| [Quality](quality/) | AI code slop, layered defense, detection limits, accretion, and cost of quality |
| [Governance](governance/) | Governance capacity, ratchets, decision survival, and theory preservation |
| [Economics](economics/) | Token budgets, model-tier selection, queueing economics, CVIH, and caching economics |
| [Human Interaction](human-interaction/) | Human attention allocation, autonomy boundaries, trust calibration, and supervision decay |
| [Model Routing](model-routing/) | Stage-specific model assignment, cross-model diversity, cascades, and escalation |
| [Security](security/) | Sandboxing, credential flow, prompt injection, output filtering, and defense-in-depth |
| [Accretion](accretion/) | Individually plausible but collectively harmful AI-generated code |

## Folder contract

Each pillar follows the same structure:

- `paper/`: canonical source, bibliography, rendered PDF, and build metadata.
- `notes/`: curated concepts, frameworks, proposals, and canvas notes.
- `research/`: raw research, formalization notes, plans, and bibliography support.
- `reviews/`: critiques, audits, and review reports.
- `archive/`: preserved drafts, legacy versions, and miscellaneous artifacts.
""")
PY
```

Expected: `pillars/README.md` is a concise index of pillar folders.

- [ ] **Step 5: Append pillar note moves to the manifest**

Run:

```bash
python - <<'PY'
from pathlib import Path
moves = [
('pillars/1-information-architecture.md', 'pillars/information/notes/concepts/original-pillar-note.md'),
('pillars/2-reliability-architecture.md', 'pillars/reliability/notes/concepts/original-pillar-note.md'),
('pillars/3-coordination-architecture.md', 'pillars/coordination/notes/concepts/original-pillar-note.md'),
('pillars/4-temporal-architecture.md', 'pillars/temporal/notes/concepts/original-pillar-note.md'),
('pillars/5-quality-architecture.md', 'pillars/quality/notes/concepts/original-pillar-note.md'),
('pillars/6-governance-architecture.md', 'pillars/governance/notes/concepts/original-pillar-note.md'),
('pillars/7-economics-architecture.md', 'pillars/economics/notes/concepts/original-pillar-note.md'),
('pillars/8-human-interaction-architecture.md', 'pillars/human-interaction/notes/concepts/original-pillar-note.md'),
('pillars/9-model-routing-architecture.md', 'pillars/model-routing/notes/concepts/original-pillar-note.md'),
('pillars/10-security-architecture.md', 'pillars/security/notes/concepts/original-pillar-note.md'),
]
path = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with path.open('a') as f:
    for old, new in moves:
        f.write(f'| {old} | {new} | pillar note | moved | Preserved as original pillar note |\n')
    for p in ['abstraction','information','reliability','coordination','temporal','quality','governance','economics','human-interaction','model-routing','security','accretion']:
        f.write(f'| generated | pillars/{p}/README.md | navigation | created | Pillar landing page |\n')
PY
```

Expected: manifest includes pillar note moves and generated README rows.

- [ ] **Step 6: Commit pillar notes and README skeletons**

Run:

```bash
git add pillars docs/migration/final-papers-rearchitecture-manifest.md
git commit -m "$(cat <<'EOF'
Create pillar landing pages and move original notes

Turn the old numbered pillar notes into pillar-local concept notes and add consistent landing pages for every corpus pillar.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds.

---

## Task 4: Move generated research, formalization, review, and draft artifacts

**Files:**
- Move: `outputs/*.md`, `outputs/*.tex`, `outputs/*.bib`, `outputs/.plans/*`, `outputs/.drafts/*`
- Modify: `docs/migration/final-papers-rearchitecture-manifest.md`

- [ ] **Step 1: Move pillar-scoped output files by pattern**

Run:

```bash
python - <<'PY'
from pathlib import Path
import subprocess
rules = [
    ('coordination-architecture', 'coordination'),
    ('economics-architecture', 'economics'),
    ('governance-architecture', 'governance'),
    ('human_interaction_architecture', 'human-interaction'),
    ('info-arch', 'information'),
    ('model_routing_architecture', 'model-routing'),
    ('quality-architecture-ai-slop', 'quality'),
    ('reliability-architecture', 'reliability'),
    ('security-architecture', 'security'),
    ('temporal-architecture', 'temporal'),
    ('accretion-category', 'accretion'),
    ('ai-harness-abstraction-gap', 'abstraction'),
]
manifest_rows = []
for prefix, pillar in rules:
    for path in sorted(Path('outputs').glob(prefix + '*')):
        if path.is_dir():
            continue
        name = path.name
        if 'research-r' in name:
            dest = Path('pillars') / pillar / 'research' / 'raw' / name
            category = 'raw research'
        elif 'formal-r' in name:
            dest = Path('pillars') / pillar / 'research' / 'formal' / name
            category = 'formal research'
        elif 'review' in name or 'rebuttal' in name or 'checklist' in name:
            dest = Path('pillars') / pillar / 'reviews' / name
            category = 'review'
        elif name.endswith('.bib'):
            dest = Path('pillars') / pillar / 'research' / 'bibliography' / name
            category = 'bibliography'
        elif name.endswith('.tex'):
            dest = Path('pillars') / pillar / 'archive' / 'drafts' / name
            category = 'draft'
        else:
            dest = Path('pillars') / pillar / 'archive' / 'misc' / name
            category = 'misc output'
        dest.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['git', 'mv', str(path), str(dest)], check=True)
        manifest_rows.append((str(path), str(dest), category, 'moved'))
# Plans
plan_map = {
    'coordination-architecture.md': 'coordination',
    'economics-architecture.md': 'economics',
    'governance-architecture.md': 'governance',
    'human_interaction_architecture.md': 'human-interaction',
    'info-arch-coding-agents.md': 'information',
    'model_routing_architecture.md': 'model-routing',
    'quality-architecture-ai-slop.md': 'quality',
    'reliability-architecture.md': 'reliability',
    'security-architecture.md': 'security',
    'temporal-architecture.md': 'temporal',
    'accretion-category.md': 'accretion',
}
for filename, pillar in plan_map.items():
    path = Path('outputs/.plans') / filename
    if path.exists():
        dest = Path('pillars') / pillar / 'research' / 'plan.md'
        subprocess.run(['git', 'mv', str(path), str(dest)], check=True)
        manifest_rows.append((str(path), str(dest), 'research plan', 'moved'))
for path in sorted(Path('outputs/.drafts').glob('*')) if Path('outputs/.drafts').exists() else []:
    if path.is_dir():
        continue
    lower = path.name.lower()
    pillar = 'abstraction' if 'abstraction' in lower else 'accretion' if 'accretion' in lower else None
    if pillar:
        dest = Path('pillars') / pillar / 'archive' / 'drafts' / path.name
    else:
        dest = Path('science') / 'archive' / 'drafts' / path.name
    subprocess.run(['git', 'mv', str(path), str(dest)], check=True)
    manifest_rows.append((str(path), str(dest), 'draft', 'moved'))
manifest = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with manifest.open('a') as f:
    for old, new, category, status in manifest_rows:
        f.write(f'| {old} | {new} | {category} | {status} | Pattern-based output migration |\n')
PY
```

Expected: pillar-prefixed output files are moved into matching pillar folders.

- [ ] **Step 2: Move science and cross-pillar outputs**

Run:

```bash
python - <<'PY'
from pathlib import Path
import subprocess
prefixes = ['science-', 'sci-', 'harness-', 'perspective-', 'deep-research-', 'formal-harness-', 'formalizable-', 'unified-harness-', 'r1-', 'r2-', 'r3-', 'r4-', 'r5-', 'review-']
rows = []
for path in sorted(Path('outputs').glob('*')):
    if path.is_dir():
        continue
    name = path.name
    if not any(name.startswith(prefix) for prefix in prefixes):
        continue
    if 'review' in name or 'rebuttal' in name or 'audit' in name:
        dest = Path('science') / 'reviews' / name
        category = 'science review'
    elif name.endswith('.tex'):
        dest = Path('science') / 'archive' / 'drafts' / name
        category = 'science draft'
    elif name.endswith('.bib'):
        dest = Path('science') / 'synthesis' / 'bibliography' / name
        category = 'bibliography'
    else:
        dest = Path('science') / 'synthesis' / name
        category = 'synthesis'
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['git', 'mv', str(path), str(dest)], check=True)
    rows.append((str(path), str(dest), category))
manifest = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with manifest.open('a') as f:
    for old, new, category in rows:
        f.write(f'| {old} | {new} | {category} | moved | Science/cross-pillar output migration |\n')
PY
```

Expected: science and cross-pillar output files are moved under `science/`.

- [ ] **Step 3: Move remaining tracked outputs to unsorted archive**

Run:

```bash
python - <<'PY'
from pathlib import Path
import subprocess
rows = []
for path in sorted(Path('outputs').rglob('*')):
    if path.is_dir():
        continue
    tracked = subprocess.run(['git', 'ls-files', '--error-unmatch', str(path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if tracked.returncode != 0:
        continue
    rel = path.relative_to('outputs')
    dest = Path('archive') / 'unsorted' / 'outputs' / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['git', 'mv', str(path), str(dest)], check=True)
    rows.append((str(path), str(dest)))
manifest = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with manifest.open('a') as f:
    for old, new in rows:
        f.write(f'| {old} | {new} | unsorted output | archived | Preserved because no deterministic pillar mapping matched |\n')
PY
```

Expected: no tracked files remain under `outputs/`, except untracked ignored local files if any.

- [ ] **Step 4: Verify tracked outputs are gone**

Run:

```bash
if git ls-files 'outputs/*' | grep .; then
  echo 'Tracked outputs remain; inspect before committing.'
  exit 1
fi
```

Expected: no output and exit code 0.

- [ ] **Step 5: Commit output artifact migration**

Run:

```bash
git add -A outputs science pillars archive docs/migration/final-papers-rearchitecture-manifest.md
git commit -m "$(cat <<'EOF'
Move research outputs beside corpus pillars

Relocate generated research, formalization, reviews, drafts, and cross-pillar synthesis into pillar-local folders or the science synthesis area.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds.

---

## Task 5: Move concepts, proposals, canvases, research projects, and legacy papers

**Files:**
- Move: `concepts/*`, `frameworks/*`, `proposals/*`, `Canvas Research/*`, `canvases/*`, `sdd-research/*`, `research/*`, `papers/*`, root legacy files
- Modify: `docs/migration/final-papers-rearchitecture-manifest.md`

- [ ] **Step 1: Move curated concepts, frameworks, proposals, and selected research notes**

Run:

```bash
mkdir -p science/synthesis/concepts science/synthesis/canvases pillars/quality/notes/concepts pillars/quality/notes/frameworks pillars/quality/notes/proposals pillars/abstraction/research/raw pillars/reliability/research/raw
for move in \
  'concepts/what-is-slop.md:pillars/quality/notes/concepts/what-is-slop.md' \
  'frameworks/desloppify.md:pillars/quality/notes/frameworks/desloppify.md' \
  'proposals/gsd-desloppification.md:pillars/quality/notes/proposals/gsd-desloppification.md' \
  'ai-harness-abstraction-gap-research.md:pillars/abstraction/research/raw/ai-harness-abstraction-gap-research.md' \
  'concepts/harness-engineering.md:science/synthesis/concepts/harness-engineering.md' \
  'concepts/sdd-ontology.md:science/synthesis/concepts/sdd-ontology.md'; do
  old=${move%%:*}
  new=${move#*:}
  if git ls-files --error-unmatch "$old" >/dev/null 2>&1; then
    mkdir -p "$(dirname "$new")"
    git mv "$old" "$new"
  fi
done
if git ls-files --error-unmatch sdd-research/Large_Language_Models_Cannot_Self-Correct_Reasoning_Yet_summary.md >/dev/null 2>&1; then
  git mv sdd-research/Large_Language_Models_Cannot_Self-Correct_Reasoning_Yet_summary.md pillars/reliability/research/raw/Large_Language_Models_Cannot_Self-Correct_Reasoning_Yet_summary.md
fi
```

Expected: curated notes move to science or pillar-local folders.

- [ ] **Step 2: Move Canvas Research notes by topic**

Run:

```bash
python - <<'PY'
from pathlib import Path
import subprocess
rules = [
    ('LLM-as-Judge', 'quality'),
    ('Compound-Error', 'reliability'),
    ('Anthropics-Harness', 'coordination'),
    ('OpenAIs-Codex', 'model-routing'),
    ('Lightweight-Harness', 'economics'),
    ('Six-Area-Spec', 'governance'),
]
rows = []
base = Path('Canvas Research')
if base.exists():
    for path in sorted(base.glob('*.md')):
        pillar = None
        for token, target in rules:
            if token in path.name:
                pillar = target
                break
        if pillar:
            dest = Path('pillars') / pillar / 'notes' / 'canvases' / path.name
            category = 'canvas note'
        else:
            dest = Path('science') / 'synthesis' / 'canvas-research' / path.name
            category = 'cross-pillar canvas note'
        dest.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['git', 'mv', str(path), str(dest)], check=True)
        rows.append((str(path), str(dest), category))
manifest = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with manifest.open('a') as f:
    for old, new, category in rows:
        f.write(f'| {old} | {new} | {category} | moved | Topic-based Canvas Research migration |\n')
PY
```

Expected: `Canvas Research/*.md` files move to pillar-local or science synthesis folders.

- [ ] **Step 3: Move canvas files**

Run:

```bash
python - <<'PY'
from pathlib import Path
import subprocess
rules = {
    'desloppify.canvas': 'pillars/quality/notes/canvases/desloppify.canvas',
    'harness_landscape.canvas': 'science/synthesis/canvases/harness_landscape.canvas',
    'sdd-ontology.canvas': 'science/synthesis/canvases/sdd-ontology.canvas',
    'test.canvas': 'archive/unsorted/canvases/test.canvas',
}
rows = []
for old, new in rules.items():
    path = Path('canvases') / old
    if path.exists() and subprocess.run(['git','ls-files','--error-unmatch',str(path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0:
        dest = Path(new)
        dest.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['git','mv',str(path),str(dest)], check=True)
        rows.append((str(path), str(dest)))
manifest = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with manifest.open('a') as f:
    for old, new in rows:
        f.write(f'| {old} | {new} | canvas | moved | Topic-based canvas migration |\n')
PY
```

Expected: tracked canvas files move to science, quality, or archive.

- [ ] **Step 4: Move legacy paper versions and root paper clutter**

Run:

```bash
mkdir -p archive/root-legacy/main pillars/coordination/archive/legacy/root-coord-main pillars/reliability/archive/legacy/root-reliability-main
for f in main.tex main.bib main.pdf main.log main.blg main.maf; do
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then git mv "$f" "archive/root-legacy/main/$f"; fi
done
for f in coord-main.tex coord-main.bib coord-main.pdf; do
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then git mv "$f" "pillars/coordination/archive/legacy/root-coord-main/$f"; fi
done
for f in reliability-main.tex reliability-main.pdf reliability-main.maf reliability.bib; do
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then git mv "$f" "pillars/reliability/archive/legacy/root-reliability-main/$f"; fi
done
if git ls-files --error-unmatch 00README.json >/dev/null 2>&1; then git mv 00README.json archive/root-legacy/00README.json; fi
if git ls-files --error-unmatch Home.md >/dev/null 2>&1; then git mv Home.md archive/root-legacy/Home.md; fi
```

Expected: root legacy files move to archive locations.

- [ ] **Step 5: Move `papers/` legacy versions by topic**

Run:

```bash
python - <<'PY'
from pathlib import Path
import subprocess
rules = [
    ('abstraction', 'abstraction'),
    ('info-arch', 'information'),
    ('reliability', 'reliability'),
    ('coordination', 'coordination'),
    ('temporal', 'temporal'),
    ('quality', 'quality'),
    ('governance', 'governance'),
]
rows = []
base = Path('papers')
if base.exists():
    for path in sorted(base.rglob('*')):
        if path.is_dir():
            continue
        if subprocess.run(['git','ls-files','--error-unmatch',str(path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode != 0:
            continue
        rel = path.relative_to(base)
        lower = str(rel).lower()
        pillar = None
        for token, target in rules:
            if token in lower:
                pillar = target
                break
        if pillar:
            dest = Path('pillars') / pillar / 'archive' / 'legacy' / 'papers' / rel
            category = 'legacy paper'
        else:
            dest = Path('archive') / 'unsorted' / 'papers' / rel
            category = 'unsorted legacy paper'
        dest.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['git','mv',str(path),str(dest)], check=True)
        rows.append((str(path), str(dest), category))
manifest = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with manifest.open('a') as f:
    for old, new, category in rows:
        f.write(f'| {old} | {new} | {category} | archived | Preserved legacy papers content |\n')
PY
```

Expected: tracked legacy `papers/` files move into pillar archive folders or unsorted archive.

- [ ] **Step 6: Move tracked `research/` and remaining `sdd-research/` into science or unsorted archive**

Run:

```bash
python - <<'PY'
from pathlib import Path
import subprocess
roots = ['research', 'sdd-research']
rows = []
for root in roots:
    base = Path(root)
    if not base.exists():
        continue
    for path in sorted(base.rglob('*')):
        if path.is_dir():
            continue
        if subprocess.run(['git','ls-files','--error-unmatch',str(path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode != 0:
            continue
        rel = path.relative_to(base)
        lower = str(rel).lower()
        if 'de-sloppification' in lower or 'slop' in lower:
            dest = Path('pillars/quality/research/raw') / root / rel
            category = 'quality research'
        elif 'harness-framework' in lower or 'framework' in lower:
            dest = Path('science/synthesis/research') / root / rel
            category = 'cross-pillar research'
        else:
            dest = Path('archive/unsorted') / root / rel
            category = 'unsorted research'
        dest.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['git','mv',str(path),str(dest)], check=True)
        rows.append((str(path), str(dest), category))
manifest = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with manifest.open('a') as f:
    for old, new, category in rows:
        f.write(f'| {old} | {new} | {category} | moved | Preserved research project artifact |\n')
PY
```

Expected: no tracked substantive research files remain in old `research/` or `sdd-research/` paths.

- [ ] **Step 7: Append explicit curated move rows to manifest**

Run:

```bash
python - <<'PY'
from pathlib import Path
rows = [
('concepts/what-is-slop.md', 'pillars/quality/notes/concepts/what-is-slop.md', 'concept note'),
('frameworks/desloppify.md', 'pillars/quality/notes/frameworks/desloppify.md', 'framework note'),
('proposals/gsd-desloppification.md', 'pillars/quality/notes/proposals/gsd-desloppification.md', 'proposal'),
('ai-harness-abstraction-gap-research.md', 'pillars/abstraction/research/raw/ai-harness-abstraction-gap-research.md', 'raw research'),
('concepts/harness-engineering.md', 'science/synthesis/concepts/harness-engineering.md', 'cross-pillar concept'),
('concepts/sdd-ontology.md', 'science/synthesis/concepts/sdd-ontology.md', 'cross-pillar concept'),
('Home.md', 'archive/root-legacy/Home.md', 'legacy root note'),
('00README.json', 'archive/root-legacy/00README.json', 'legacy root metadata'),
]
path = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with path.open('a') as f:
    for old, new, category in rows:
        f.write(f'| {old} | {new} | {category} | moved if tracked | Explicit curated migration rule |\n')
PY
```

Expected: manifest includes curated move rows.

- [ ] **Step 8: Commit concepts and legacy migration**

Run:

```bash
git add -A concepts frameworks proposals 'Canvas Research' canvases papers research sdd-research archive science pillars docs/migration/final-papers-rearchitecture-manifest.md
git commit -m "$(cat <<'EOF'
Move notes and legacy artifacts into corpus structure

Colocate concepts, frameworks, proposals, canvas notes, research projects, and old paper versions with the relevant pillar or archive.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds.

---

## Task 6: Write science and corpus navigation READMEs

**Files:**
- Modify: `README.md`
- Create/modify: `science/README.md`
- Modify: `pillars/README.md`
- Modify: `pillars/<pillar>/README.md`

- [ ] **Step 1: Write `science/README.md`**

Run:

```bash
python - <<'PY'
from pathlib import Path
Path('science/README.md').write_text("""# Science Paper

This directory contains the umbrella paper for the AI coding agent harness architecture corpus and the cross-pillar synthesis material that supports it.

## Canonical paper

- [PDF](paper/science.pdf)
- [Source](paper/science.tex)
- [Bibliography](paper/science.bib)

## Role in the corpus

The science paper presents the unified framework across the corpus: abstraction, information, reliability, coordination, temporal dynamics, quality, governance, economics, human interaction, model routing, security, and accretion.

## Supporting material

- `synthesis/` contains cross-pillar research, concept notes, roadmaps, and perspective notes.
- `reviews/` contains reviews, audits, rebuttals, and critique material for the umbrella framework.
- `archive/` contains preserved drafts, backups, and assembly fragments. These are non-canonical unless explicitly referenced.

## Related directories

- [`../pillars/`](../pillars/) contains the pillar-specific papers and supporting material.
- [`../assets/`](../assets/) contains shared LaTeX assets and other shared resources.
""")
PY
```

Expected: science README links to canonical umbrella files.

- [ ] **Step 2: Rewrite root `README.md` with new paths**

Run:

```bash
python - <<'PY'
from pathlib import Path
Path('README.md').write_text("""# AI Coding Agent Harness Architecture Papers

This repository is a research corpus on **AI coding agent harness architecture**: the systems, controls, metrics, and formal models needed to make agentic software development reliable, secure, governable, economical, and usable.

The main deliverable is the paper corpus organized around [`science/`](science/) and [`pillars/`](pillars/). The umbrella paper gives the unified framework, while each pillar folder contains one canonical paper plus supporting research, notes, reviews, drafts, and preserved archives.

## Canonical paper set

| Paper | Role |
|---|---|
| [**A Formal Framework for AI Coding Agent Harness Architecture**](science/paper/science.pdf) | Umbrella framework tying together all architectural dimensions |

## Pillars

| Pillar | Paper | Focus |
|---|---|---|
| [Abstraction](pillars/abstraction/) | [PDF](pillars/abstraction/paper/abstraction_architecture.pdf) | Specification-to-code abstraction gaps, refinement, and formal interfaces |
| [Information](pillars/information/) | [PDF](pillars/information/paper/information_architecture.pdf) | Context selection, degradation, tiered memory, and reuse discovery |
| [Reliability](pillars/reliability/) | [PDF](pillars/reliability/paper/reliability_architecture.pdf) | Compound error, verification scheduling, structural enforcement, and adaptive verification |
| [Coordination](pillars/coordination/) | [PDF](pillars/coordination/paper/coordination_architecture.pdf) | Multi-agent decomposition, merge conflicts, ownership, and quality-adjusted speedup |
| [Temporal](pillars/temporal/) | [PDF](pillars/temporal/paper/temporal_architecture.pdf) | Verified iterations per hour, staleness, speculation, caching, and speed-quality tradeoffs |
| [Quality](pillars/quality/) | [PDF](pillars/quality/paper/quality_architecture.pdf) | AI code slop, layered defense, detection limits, accretion, and cost of quality |
| [Governance](pillars/governance/) | [PDF](pillars/governance/paper/governance_architecture.pdf) | Governance capacity, ratchets, decision survival, and theory preservation |
| [Economics](pillars/economics/) | [PDF](pillars/economics/paper/economics_architecture.pdf) | Token budgets, model-tier selection, queueing economics, CVIH, and caching economics |
| [Human Interaction](pillars/human-interaction/) | [PDF](pillars/human-interaction/paper/human_interaction_architecture.pdf) | Human attention allocation, autonomy boundaries, trust calibration, and supervision decay |
| [Model Routing](pillars/model-routing/) | [PDF](pillars/model-routing/paper/model_routing_architecture.pdf) | Stage-specific model assignment, cross-model diversity, cascades, and escalation |
| [Security](pillars/security/) | [PDF](pillars/security/paper/security_architecture.pdf) | Sandboxing, credential flow, prompt injection, output filtering, and defense-in-depth |
| [Accretion](pillars/accretion/) | [PDF](pillars/accretion/paper/accretion_category.pdf) | Individually plausible but collectively harmful AI-generated code |

## Repository structure

```text
science/     umbrella paper, cross-pillar synthesis, reviews, and drafts
pillars/     pillar-specific papers, notes, research, reviews, and archives
assets/      shared LaTeX classes and shared resources
archive/     preserved root legacy and ambiguous artifacts
docs/        migration notes and design/implementation plans
```

## Reading paths

- **Fast overview:** start with [`science/paper/science.pdf`](science/paper/science.pdf), then read the pillar README matching your concern.
- **Building a harness:** abstraction, information, reliability, security, human interaction, governance.
- **Scaling multi-agent work:** coordination, reliability, temporal, model routing, quality.
- **Cost and latency:** economics, temporal, model routing, information.
- **Production hardening:** security, reliability, governance, quality, human interaction.
- **AI code degradation:** quality, accretion, governance, temporal.

## Archive status

Archive folders preserve drafts, backups, duplicate paper versions, build artifacts, and ambiguous material. They are retained for provenance but are not canonical unless a pillar README explicitly says otherwise.
""")
PY
```

Expected: root README no longer links to `final_papers/`.

- [ ] **Step 3: Verify all Markdown links resolve**

Run:

```bash
python - <<'PY'
from pathlib import Path
import re
missing = []
for md in [Path('README.md'), Path('science/README.md'), Path('pillars/README.md'), *Path('pillars').glob('*/README.md')]:
    text = md.read_text()
    for link in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
        if '://' in link or link.startswith('#'):
            continue
        target = (md.parent / link).resolve()
        if not target.exists():
            missing.append((str(md), link))
if missing:
    for md, link in missing:
        print(f'{md}: missing {link}')
    raise SystemExit(1)
print('markdown links ok')
PY
```

Expected: `markdown links ok`.

- [ ] **Step 4: Commit navigation docs**

Run:

```bash
git add README.md science/README.md pillars/README.md pillars/*/README.md
git commit -m "$(cat <<'EOF'
Update corpus navigation for pillar layout

Refresh the root, science, and pillar README files so the repository navigates through the new pillar-centered corpus structure.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds.

---

## Task 7: Move shared LaTeX assets and clean empty tracked directories

**Files:**
- Move: `googledeepmind.cls`, `google.cls`
- Create/modify: `assets/latex/README.md`
- Modify: `docs/migration/final-papers-rearchitecture-manifest.md`

- [ ] **Step 1: Move shared class files into assets**

Run:

```bash
mkdir -p assets/latex
if git ls-files --error-unmatch googledeepmind.cls >/dev/null 2>&1; then git mv googledeepmind.cls assets/latex/googledeepmind.cls; fi
if git ls-files --error-unmatch google.cls >/dev/null 2>&1; then git mv google.cls assets/latex/google.cls; fi
```

Expected: tracked class files move from root to `assets/latex/`.

- [ ] **Step 2: Add assets README**

Run:

```bash
python - <<'PY'
from pathlib import Path
Path('assets/latex/README.md').write_text("""# LaTeX Assets

This directory contains shared tracked LaTeX assets for the paper corpus.

`logo.pdf` files are intentionally local-only and ignored by Git. If a paper build needs a logo file beside the source, copy or symlink the local logo into the paper directory before compiling.
""")
PY
```

Expected: `assets/latex/README.md` exists.

- [ ] **Step 3: Append asset moves to manifest**

Run:

```bash
python - <<'PY'
from pathlib import Path
path = Path('docs/migration/final-papers-rearchitecture-manifest.md')
with path.open('a') as f:
    f.write('| googledeepmind.cls | assets/latex/googledeepmind.cls | LaTeX class | moved | Shared class file |\n')
    f.write('| google.cls | assets/latex/google.cls | LaTeX class | moved | Shared class file |\n')
PY
```

Expected: manifest includes shared asset moves.

- [ ] **Step 4: Remove empty tracked-era directories from Git status if needed**

Run:

```bash
find final_papers outputs concepts frameworks proposals papers 'Canvas Research' canvases research sdd-research -type d -empty -print 2>/dev/null || true
```

Expected: command may print empty directories, but Git will not track empty directories. Do not delete local untracked directories unless the user separately approves cleanup.

- [ ] **Step 5: Commit shared asset migration**

Run:

```bash
git add -A assets docs/migration/final-papers-rearchitecture-manifest.md googledeepmind.cls google.cls
git commit -m "$(cat <<'EOF'
Move shared LaTeX assets under assets

Relocate tracked class files into assets/latex and document that logo PDFs are local-only build inputs.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds.

---

## Task 8: Final preservation and link validation

**Files:**
- Create: `docs/migration/post-migration-tracked-files.txt`
- Modify: `docs/migration/final-papers-rearchitecture-manifest.md` if validation finds missing entries

- [ ] **Step 1: Record post-migration tracked files**

Run:

```bash
printf '# Post-migration tracked files\n\nGenerated after the pillar corpus rearchitecture.\n\n' > docs/migration/post-migration-tracked-files.txt
git ls-files >> docs/migration/post-migration-tracked-files.txt
```

Expected: post-migration tracked list exists.

- [ ] **Step 2: Verify no tracked files remain in old content roots**

Run:

```bash
python - <<'PY'
import subprocess
old_roots = ['final_papers/', 'outputs/', 'concepts/', 'frameworks/', 'proposals/', 'papers/', 'Canvas Research/', 'canvases/', 'research/', 'sdd-research/']
tracked = subprocess.check_output(['git', 'ls-files'], text=True).splitlines()
remaining = [p for p in tracked if any(p.startswith(root) for root in old_roots)]
if remaining:
    print('\n'.join(remaining))
    raise SystemExit(1)
print('old content roots clear')
PY
```

Expected: `old content roots clear`.

- [ ] **Step 3: Verify no logo PDFs are tracked**

Run:

```bash
if git ls-files '*logo.pdf' | grep .; then
  echo 'logo PDFs are still tracked'
  exit 1
fi
```

Expected: no output and exit code 0.

- [ ] **Step 4: Verify local root logo file still exists if it existed before**

Run:

```bash
test -f logo.pdf && echo 'local logo.pdf preserved' || echo 'root logo.pdf not present locally; check whether it existed before migration'
```

Expected: if `logo.pdf` existed locally before migration, output is `local logo.pdf preserved`.

- [ ] **Step 5: Verify Markdown links across tracked Markdown files**

Run:

```bash
python - <<'PY'
from pathlib import Path
import re, subprocess
tracked = subprocess.check_output(['git','ls-files','*.md'], text=True).splitlines()
missing = []
for name in tracked:
    path = Path(name)
    text = path.read_text(errors='ignore')
    for link in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
        if '://' in link or link.startswith('#') or link.startswith('mailto:'):
            continue
        clean = link.split('#', 1)[0]
        if not clean:
            continue
        target = (path.parent / clean).resolve()
        if not target.exists():
            missing.append((name, link))
if missing:
    for name, link in missing:
        print(f'{name}: missing {link}')
    raise SystemExit(1)
print('tracked markdown links ok')
PY
```

Expected: `tracked markdown links ok`. If archived legacy docs contain intentionally stale relative links, either fix the links or document the exception in the manifest before continuing.

- [ ] **Step 6: Try optional LaTeX compile smoke checks if `tectonic` is available**

Run:

```bash
if command -v tectonic >/dev/null 2>&1; then
  (cd science/paper && tectonic -Z continue-on-errors science.tex)
  (cd pillars/security/paper && tectonic -Z continue-on-errors security_architecture.tex)
elif test -x "$HOME/.local/bin/tectonic"; then
  (cd science/paper && "$HOME/.local/bin/tectonic" -Z continue-on-errors science.tex)
  (cd pillars/security/paper && "$HOME/.local/bin/tectonic" -Z continue-on-errors security_architecture.tex)
else
  echo 'tectonic not installed; skipping LaTeX smoke compile'
fi
```

Expected: either compile succeeds or output says tectonic is not installed. If compile fails only because `logo.pdf` is ignored and absent in the paper directory, copy the local logo into that directory without staging it, rerun the compile, and keep the logo untracked.

- [ ] **Step 7: Check root clutter**

Run:

```bash
find . -maxdepth 1 -type f | sort
```

Expected: root files should be limited to `README.md`, `.gitignore`, local-only `logo.pdf`, and any necessary project/tool metadata. If substantive paper files remain in root, move them or document why they stay.

- [ ] **Step 8: Commit final validation artifacts**

Run:

```bash
git add docs/migration/post-migration-tracked-files.txt docs/migration/final-papers-rearchitecture-manifest.md
git commit -m "$(cat <<'EOF'
Validate pillar corpus migration

Record the post-migration tracked file list and finalize the migration manifest after link, logo, and preservation checks.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds if migration manifest or post-tracked list changed.

---

## Task 9: Final review and cleanup report

**Files:**
- No required file changes unless validation reveals an issue.

- [ ] **Step 1: Show final git status**

Run:

```bash
git status --short
```

Expected: only intentionally untracked local files remain, such as `.superpowers/` or local ignored logo files. If ignored files are hidden, run `git status --short --ignored` only for inspection and do not stage ignored files.

- [ ] **Step 2: Show recent commits**

Run:

```bash
git log --oneline -10
```

Expected: recent commits show the migration in reviewable chunks.

- [ ] **Step 3: Summarize migration results**

Report to the user:

```text
Pillar corpus migration complete.

Created:
- science/ as umbrella paper home
- pillars/<pillar>/ as per-pillar corpus folders
- assets/latex/ for shared tracked LaTeX classes
- archive/ for preserved legacy/ambiguous artifacts
- docs/migration/final-papers-rearchitecture-manifest.md

Validation:
- old tracked content roots cleared
- logo PDFs untracked and ignored
- markdown links checked
- LaTeX smoke compile: <result>

Remaining local-only files:
- <list from git status>
```

Expected: user gets a concise completion summary and knows whether any local-only files remain.

---

## Self-review checklist

- Spec coverage: The plan covers physical moves, preserve-all archive behavior, `pillars/` as spine, `science/`, per-pillar contracts, outputs, notes, legacy files, README navigation, shared assets, logo untracking, manifest, and validation.
- Placeholder scan: No unresolved placeholder markers are present. Open choices from the spec are resolved by this plan: no long-term `final_papers/README.md`, generated README skeletons for each pillar, build extras under `paper/build/`, and separate commits by migration batch.
- Safety: The plan uses `git mv`, preserves substantive files, creates a pre/post tracked-file snapshot, and excludes `.superpowers/` plus local logo PDFs from staging.
