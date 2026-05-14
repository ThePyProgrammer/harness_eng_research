# Phase 01: Site Foundation and Provenance Contract - Pattern Map

**Mapped:** 2026-05-14
**Files analyzed:** 13
**Analogs found:** 11 / 13

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `site/package.json` | config | batch | `.obsidian/plugins/harness-canvas-research/package.json` | role-match |
| `site/bun.lock` | config | batch | no exact analog | no-analog |
| `site/astro.config.mjs` | config | batch/transform | `.obsidian/plugins/harness-canvas-research/esbuild.config.mjs` | role-match |
| `site/tsconfig.json` | config | batch | `.obsidian/plugins/harness-canvas-research/tsconfig.json` | role-match |
| `site/src/content.config.ts` | config | transform | `.obsidian/plugins/harness-canvas-research/src/types.ts` plus RESEARCH.md Astro example | partial |
| `site/src/data/corpus.schema.ts` | model | transform/validation | `.obsidian/plugins/harness-canvas-research/src/types.ts` | role-match |
| `site/src/data/corpus.ts` | model | file-I/O/read-only references | `README.md`, `science/README.md`, `pillars/README.md` | role-match |
| `site/src/scripts/validate-corpus.ts` | utility | file-I/O/validation | `latex-document-skill/scripts/validate_latex.py` | exact-by-flow |
| `site/src/scripts/generate-local-indexes.ts` | utility | transform/file-I/O | `latex-document-skill/scripts/generate_chart.py` | role-match |
| `site/src/pages/inventory.astro` | component/page | request-response/static render | `README.md`, `science/README.md`, `pillars/README.md` | partial |
| `site/src/styles/phase-1.css` | component/style | request-response/static render | `.obsidian/plugins/harness-canvas-research/styles.css` | role-match |
| `site/src/content/docs/index.mdx` | component/page | request-response/static render | `README.md`, `science/README.md` | role-match |
| `site/src/content/docs/provenance-contract.mdx` | component/page/docs | request-response/static render | `docs/migration/final-papers-rearchitecture-manifest.md`, `assets/latex/README.md` | role-match |

## Pattern Assignments

### `site/package.json` (config, batch)

**Analog:** `.obsidian/plugins/harness-canvas-research/package.json`

**Package boundary and script pattern** (lines 1-10):
```json
{
  "name": "canvas-researcher",
  "version": "0.1.0",
  "description": "AI-powered research that materializes as a connected knowledge map on your canvas.",
  "main": "main.js",
  "scripts": {
    "build": "node esbuild.config.mjs",
    "dev": "node esbuild.config.mjs --watch",
    "test": "jest"
  },
```

**Dependency grouping pattern** (lines 14-27):
```json
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "esbuild": "0.25.5",
    "jest": "^29.5.0",
    "obsidian": "latest",
    "obsidian-typings": "latest",
    "ts-jest": "^29.4.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  },
  "dependencies": {
    "elkjs": "^0.11.1"
  }
```

**Apply:** Keep package metadata and scripts inside `site/`, not the repository root. Use the same small package pattern, but scripts must be Bun-oriented: `validate`, `build:astro`, `index`, `build`, and optionally `check`/`test`.

---

### `site/bun.lock` (config, batch)

**Analog:** No exact analog in the repository.

The root repository currently has no package manager lockfile for a site runtime. Planner should let Bun generate this file from `site/package.json`; do not hand-author it and do not create a root lockfile.

---

### `site/astro.config.mjs` (config, batch/transform)

**Analog:** `.obsidian/plugins/harness-canvas-research/esbuild.config.mjs`

**ES module config/import pattern** (lines 1-7):
```javascript
import * as esbuild from 'esbuild';

const prod = process.argv[2] === 'production';
const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/main.ts'],
```

**External/static build boundary pattern** (lines 12-44):
```javascript
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    'child_process',
    'fs',
    'path',
    'os',
    'crypto',
    'net',
    'http',
    'https',
    'url',
    'util',
    'events',
    'stream',
    'buffer',
    'process',
  ],
  logLevel: 'info',
  sourcemap: 'inline',
  minify: prod,
};
```

**Apply:** Use ESM imports and a single exported config object. For Astro, combine this local ESM style with RESEARCH.md lines 249-262: import `starlight`, `remark-math`, `rehype-katex`, and `defineConfig`; configure static Markdown math and Starlight. Do not add SSR adapters.

---

### `site/tsconfig.json` (config, batch)

**Analog:** `.obsidian/plugins/harness-canvas-research/tsconfig.json`

**Strict TypeScript baseline** (lines 1-17):
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "lib": ["ES2021", "DOM"],
    "baseUrl": ".",
    "paths": {
      "obsidian": ["node_modules/obsidian/obsidian.d.ts"]
    }
  },
  "include": ["src/**/*.ts"]
}
```

**Apply:** Preserve strict mode and ES module targeting. Adjust includes for Astro (`src/**/*.ts`, `src/**/*.astro`, `src/**/*.mdx` as supported by Astro defaults) and avoid a broad root-level config.

---

### `site/src/content.config.ts` (config, transform)

**Analog:** `.obsidian/plugins/harness-canvas-research/src/types.ts` plus RESEARCH.md content collection example.

**Type module export pattern** (lines 1-13):
```typescript
// Shared types for Canvas Researcher Plugin

export interface CanvasResearcherSettings {
  backendUrl: string;
  pythonPath: string;
  researchOutputFolder: string;
}

export const DEFAULT_SETTINGS: CanvasResearcherSettings = {
  backendUrl: 'ws://127.0.0.1:8765/ws',
  pythonPath: '',
  researchOutputFolder: 'Canvas Research',
};
```

**Research-provided Astro schema pattern** (01-RESEARCH.md lines 331-348):
```typescript
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const corpus = defineCollection({
  loader: file('src/data/corpus.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
  }),
});

export const collections = { corpus };
```

**Apply:** If using Astro collections, import schemas directly from concrete paths; no barrel module exists. If inventory remains TypeScript literal data, keep `content.config.ts` minimal for docs collections only.

---

### `site/src/data/corpus.schema.ts` (model, transform/validation)

**Analog:** `.obsidian/plugins/harness-canvas-research/src/types.ts`

**Discriminated union / finite status pattern** (lines 21-42):
```typescript
export type OutboundMessage =
  | { type: 'research_request'; prompt: string; sessionId: string }
  | { type: 'cancel'; sessionId: string }
  | { type: 'vault_search'; sessionId: string; query: string; index: VaultIndexEntry[] }
  | { type: 'organize_request'; sessionId: string; findings: OrganizeNodeInput[]; vaultNodes: OrganizeNodeInput[] }
  | { type: 'drill_request'; sessionId: string; parentNodeId: string; parentContent: string; siblingContent: string; prompt: string }
  | { type: 'synthesis_request'; sessionId: string; nodeIds: string[]; nodeContents: string[]; prompt: string };

// Server -> Client
export type InboundEvent =
  | { type: 'status'; sessionId: string; message: string }
  | { type: 'progress'; sessionId: string; message: string }
  | { type: 'node_preview'; sessionId: string; nodeId: string; title: string; summary: string; sources: NodeSource[] }
  | { type: 'research_complete'; sessionId: string }
  | { type: 'error'; sessionId: string; message: string; retryable: boolean }
  | { type: 'organize_complete'; sessionId: string; topics: TopicAssignment[]; edges: EdgeAssignment[] }
  | { type: 'vault_results'; sessionId: string; results: VaultResult[] }
  | { type: 'drill_result'; sessionId: string; parentNodeId: string; nodeId: string; title: string; summary: string; sources: NodeSource[] }
  | { type: 'drill_complete'; sessionId: string; parentNodeId: string }
  | { type: 'synthesis_result'; sessionId: string; nodeId: string; title: string; summary: string };

export type ConnectionState = 'connected' | 'disconnected' | 'reconnecting';
```

**Plain data interface pattern** (lines 91-105):
```typescript
export interface VaultResult {
  path: string;
  score: number;
}

export interface VaultIndexEntry {
  path: string;
  content: string;
}

export interface OrganizeNodeInput {
  nodeId: string;
  label: string;
  snippet: string;
}
```

**Apply:** Model corpus status as a finite enum/union: `canonical`, `missing-source`, `archive-blocked`, `provenance-only`. Export interfaces and Zod schemas from this module. Keep payloads plain and testable.

---

### `site/src/data/corpus.ts` (model, file-I/O/read-only references)

**Analogs:** `README.md`, `science/README.md`, `pillars/README.md`

**Top-level corpus inventory pattern** (`README.md` lines 7-28):
```markdown
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
```

**Umbrella metadata pattern** (`science/README.md` lines 5-13):
```markdown
## Canonical paper

- [PDF](paper/science.pdf)
- [Source](paper/science.tex)
- [Bibliography](paper/science.bib)

## Role in the corpus

The science paper presents the unified framework across the corpus: abstraction, information, reliability, coordination, temporal dynamics, quality, governance, economics, human interaction, model routing, security, and accretion.
```

**Pillar ordering and summaries** (`pillars/README.md` lines 5-18):
```markdown
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
```

**Apply:** Use these as the source ordering and summary seed. Add explicit `canonicalTex`, `canonicalPdf`, `bibliography`, and `sourceStatus` fields. Do not scan the filesystem to generate this inventory.

---

### `site/src/scripts/validate-corpus.ts` (utility, file-I/O/validation)

**Analog:** `latex-document-skill/scripts/validate_latex.py`

**CLI imports and filesystem dependency pattern** (lines 22-25):
```python
import argparse
import re
import sys
from pathlib import Path
```

**Structured validation error pattern** (lines 128-147):
```python
class ValidationError:
    """A single validation error."""

    def __init__(self, file: str, line: int, category: str, message: str):
        self.file = file
        self.line = line
        self.category = category
        self.message = message

    def __str__(self):
        return f"{self.file}:{self.line}: [{self.category}] {self.message}"

    def to_dict(self):
        return {
            "file": self.file,
            "line": self.line,
            "category": self.category,
            "message": self.message,
        }
```

**Missing file validation pattern** (lines 154-163):
```python
def validate_file(filepath: str, preamble_commands: set) -> list:
    """Validate a single batch .tex file. Returns list of ValidationError."""
    errors = []
    path = Path(filepath)
    if not path.exists():
        errors.append(ValidationError(filepath, 0, "FILE", f"File not found: {filepath}"))
        return errors

    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    filename = path.name
```

**CLI args and JSON/plain output pattern** (lines 357-377, 388-422):
```python
def main():
    parser = argparse.ArgumentParser(
        description="Validate LaTeX batch files before assembly.",
        epilog="Example: python3 validate_latex.py tmp/batch_*.tex --preamble tmp/preamble.tex",
    )
    parser.add_argument(
        "files",
        nargs="+",
        help="Batch .tex files to validate",
    )
    parser.add_argument(
        "--preamble",
        default=None,
        help="Path to the shared preamble.tex (for command/package checking)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output errors as JSON instead of plain text",
    )
    args = parser.parse_args()
```
```python
    if args.json:
        import json
        result = {
            "total_errors": len(all_errors),
            "files_checked": len(args.files),
            "errors": [e.to_dict() for e in all_errors],
        }
        print(json.dumps(result, indent=2))
    else:
        if not all_errors:
            print(f"OK: {len(args.files)} file(s) validated, 0 errors found.")
        else:
            # Group by file
            by_file = {}
            for e in all_errors:
                by_file.setdefault(e.file, []).append(e)

            print(f"ERRORS: {len(all_errors)} error(s) in {len(by_file)} file(s):\n")
```
```python
    return 1 if all_errors else 0
```

**Apply:** Port the pattern to TypeScript/Bun: collect all validation errors, support clear text diagnostics, return non-zero on error, and optionally emit JSON if useful. Hard-fail when required IDs are missing, canonical paths do not exist, paths are absolute or contain `..`, or canonical fields contain `/archive/` unless `sourceStatus === 'provenance-only'`.

---

### `site/src/scripts/generate-local-indexes.ts` (utility, transform/file-I/O)

**Analog:** `latex-document-skill/scripts/generate_chart.py`

**Input parse and failure pattern** (lines 352-367):
```python
def load_data(args):
    """Load data from JSON string or CSV file."""
    if args.data:
        try:
            return json.loads(args.data)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON data: {e}", file=sys.stderr)
            sys.exit(1)
    elif args.csv:
        try:
            df = pd.read_csv(args.csv)
            # Convert DataFrame to dict format
            return {col: df[col].tolist() for col in df.columns}
        except Exception as e:
            print(f"Error: Failed to read CSV file: {e}", file=sys.stderr)
            sys.exit(1)
```

**Output directory and status pattern** (lines 449-457):
```python
    try:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(args.output, dpi=args.dpi, bbox_inches='tight')
        print(f"Successfully created: {args.output}", file=sys.stderr)
    except Exception as e:
        print(f"Error: Failed to save output: {e}", file=sys.stderr)
        sys.exit(1)
```

**Apply:** If generating `dist/corpus-index.json`, create parent directories, write deterministic JSON from validated inventory, print operational progress to stderr, and exit non-zero on write failures. Do not write into `science/` or `pillars/`.

---

### `site/src/pages/inventory.astro` (component/page, request-response/static render)

**Analogs:** `README.md`, `science/README.md`, `pillars/README.md`

**Inventory fields to render** (`README.md` lines 15-28):
```markdown
| Pillar | Paper | Focus |
|---|---|---|
| [Abstraction](pillars/abstraction/) | [PDF](pillars/abstraction/paper/abstraction_architecture.pdf) | Specification-to-code abstraction gaps, refinement, and formal interfaces |
| [Information](pillars/information/) | [PDF](pillars/information/paper/information_architecture.pdf) | Context selection, degradation, tiered memory, and reuse discovery |
| [Reliability](pillars/reliability/) | [PDF](pillars/reliability/paper/reliability_architecture.pdf) | Compound error, verification scheduling, structural enforcement, and adaptive verification |
```

**Folder contract explanation** (`pillars/README.md` lines 20-28):
```markdown
## Folder contract

Each pillar follows the same structure:

- `paper/`: canonical source, bibliography, rendered PDF, and build metadata.
- `notes/`: curated concepts, frameworks, proposals, and canvas notes.
- `research/`: raw research, formalization notes, plans, and bibliography support.
- `reviews/`: critiques, audits, and review reports.
- `archive/`: preserved drafts, legacy versions, and miscellaneous artifacts.
```

**Apply:** Render exactly thirteen entries. Each card/row must expose title, kind, slug, source status, canonical `.tex` path, PDF path, and bibliography path when present. Use source-path monospace treatment and status text labels from UI-SPEC.

---

### `site/src/styles/phase-1.css` (component/style, request-response/static render)

**Analog:** `.obsidian/plugins/harness-canvas-research/styles.css`

**Component class naming and layout pattern** (lines 5-20):
```css
.cr-chatbox {
  position: absolute;
  bottom: var(--size-4-6);
  right: var(--size-4-6);
  width: 320px;
  max-height: 280px;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  padding: var(--size-4-3);
  box-shadow: var(--shadow-l);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: var(--size-4-2);
}
```

**Status class pattern** (lines 29-46):
```css
.cr-chatbox__status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cr-chatbox__status--connected {
  background: var(--color-green);
}

.cr-chatbox__status--disconnected {
  background: var(--color-red);
}

.cr-chatbox__status--reconnecting {
  background: var(--color-yellow);
}
```

**Accessible focus and hit target pattern** (lines 98-118):
```css
.cr-chatbox__submit {
  align-self: flex-end;
  min-height: 44px;
  min-width: 44px;
  padding: var(--size-4-2) var(--size-4-4);
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border: none;
  border-radius: var(--radius-s);
  font-size: var(--font-ui-medium);
  cursor: pointer;
}

.cr-chatbox__submit:hover {
  opacity: 0.9;
}

.cr-chatbox__submit:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}
```

**Apply:** Use component-scoped class naming and explicit focus-visible outlines. Unlike the Obsidian plugin, Phase 1 must define UI-SPEC tokens directly: dominant `#F7F3EA`, secondary `#E8DDC8`, accent `#7A3E1D`, destructive `#B42318`, 4px spacing scale, and exact typography sizes.

---

### `site/src/content/docs/index.mdx` (component/page, request-response/static render)

**Analog:** `README.md`, `science/README.md`

**Repository purpose and boundary pattern** (`README.md` lines 1-5):
```markdown
# AI Coding Agent Harness Architecture Papers

This repository is a research corpus on **AI coding agent harness architecture**: the systems, controls, metrics, and formal models needed to make agentic software development reliable, secure, governable, economical, and usable.

The main deliverable is the paper corpus organized around [`science/`](science/) and [`pillars/`](pillars/). The umbrella paper gives the unified framework, while each pillar folder contains one canonical paper plus supporting research, notes, reviews, drafts, and preserved archives.
```

**Umbrella role pattern** (`science/README.md` lines 11-13):
```markdown
## Role in the corpus

The science paper presents the unified framework across the corpus: abstraction, information, reliability, coordination, temporal dynamics, quality, governance, economics, human interaction, model routing, security, and accretion.
```

**Apply:** Landing page should state the static-site boundary, show one build command and one validation command, and include the exact primary CTA copy `Inspect Corpus Inventory`. Do not expand into the full reader-facing book shell.

---

### `site/src/content/docs/provenance-contract.mdx` (component/page/docs, request-response/static render)

**Analogs:** `docs/migration/final-papers-rearchitecture-manifest.md`, `assets/latex/README.md`, `science/README.md`

**Migration/provenance table pattern** (`docs/migration/final-papers-rearchitecture-manifest.md` lines 1-10):
```markdown
# Final Papers Rearchitecture Manifest

This manifest records the physical file migration that reorganizes the repository around `science/` and `pillars/`.

| Old path | New path | Category | Status | Notes |
|---|---|---|---|---|
| final_papers/science.tex | science/paper/science.tex | canonical paper | moved | Umbrella source |
| final_papers/science.bib | science/paper/science.bib | canonical bibliography | moved | Umbrella bibliography |
| final_papers/science.pdf | science/paper/science.pdf | canonical PDF | moved | Umbrella PDF |
```

**Local-only/provenance exception pattern** (`assets/latex/README.md` lines 1-5):
```markdown
# LaTeX Assets

This directory contains shared tracked LaTeX assets for the paper corpus.

`logo.pdf` files are intentionally local-only and ignored by Git. If a paper build needs a logo file beside the source, copy or symlink the local logo into the paper directory before compiling.
```

**Archive non-canonical rule** (`science/README.md` lines 15-19):
```markdown
## Supporting material

- `synthesis/` contains cross-pillar research, concept notes, roadmaps, and perspective notes.
- `reviews/` contains reviews, audits, rebuttals, and critique material for the umbrella framework.
- `archive/` contains preserved drafts, backups, and assembly fragments. These are non-canonical unless explicitly referenced.
```

**Apply:** Document the executable contract, not just prose. Include pass/fail examples for missing canonical paths and archive-as-canonical paths. Use UI-SPEC diagnostic copy: `Entry {id}: {field} points to {path}. {reason}. {next step}.`

---

## Shared Patterns

### Static site boundary
**Source:** `01-CONTEXT.md`, `CLAUDE.md`, `README.md`
**Apply to:** All `site/` package/config/source files

- New application/package files belong under `site/` only.
- `science/` and `pillars/` are read-only canonical inputs.
- Do not create root `package.json`, root `astro.config.*`, root lockfiles, or docs-hosted site package files.

### Canonical corpus source layout
**Source:** `science/README.md`, `pillars/README.md`, `README.md`
**Apply to:** `corpus.ts`, `validate-corpus.ts`, `inventory.astro`, provenance docs

```markdown
- [PDF](paper/science.pdf)
- [Source](paper/science.tex)
- [Bibliography](paper/science.bib)
```

```markdown
- `paper/`: canonical source, bibliography, rendered PDF, and build metadata.
- `archive/`: preserved drafts, legacy versions, and miscellaneous artifacts.
```

### Archive blocking
**Source:** `science/README.md` lines 15-19; `README.md` lines 49-51
**Apply to:** `validate-corpus.ts`, provenance docs, inventory statuses

```markdown
- `archive/` contains preserved drafts, backups, and assembly fragments. These are non-canonical unless explicitly referenced.
```

```markdown
Archive folders preserve drafts, backups, duplicate paper versions, build artifacts, and ambiguous material. They are retained for provenance but are not canonical unless a pillar README explicitly says otherwise.
```

### CLI validation and exit behavior
**Source:** `latex-document-skill/scripts/validate_latex.py`
**Apply to:** `validate-corpus.ts`, tests for validation if included

```python
if not path.exists():
    errors.append(ValidationError(filepath, 0, "FILE", f"File not found: {filepath}"))
    return errors
```

```python
return 1 if all_errors else 0
```

### Error reporting style
**Source:** `latex-document-skill/scripts/validate_latex.py`, `latex-document-skill/scripts/generate_chart.py`, UI-SPEC
**Apply to:** `validate-corpus.ts`, `generate-local-indexes.ts`

```python
print(f"Error: Failed to save output: {e}", file=sys.stderr)
sys.exit(1)
```

Use UI-SPEC diagnostic copy for provenance failures:
```text
Entry security: canonicalTex points to pillars/security/archive/security_architecture.tex. Archive paths cannot be canonical sources. Move the reference to pillars/security/paper/ or mark the entry as provenance-only.
```

### TypeScript model style
**Source:** `.obsidian/plugins/harness-canvas-research/src/types.ts`
**Apply to:** `corpus.schema.ts`, `corpus.ts`, validator payload types

```typescript
export interface VaultIndexEntry {
  path: string;
  content: string;
}
```

```typescript
export type ConnectionState = 'connected' | 'disconnected' | 'reconnecting';
```

### CSS interaction and accessibility
**Source:** `.obsidian/plugins/harness-canvas-research/styles.css`; UI-SPEC
**Apply to:** `phase-1.css`, `inventory.astro`, docs pages

```css
.cr-chatbox__submit {
  min-height: 44px;
  min-width: 44px;
}

.cr-chatbox__submit:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}
```

Phase 1 must use the UI-SPEC color and typography tokens rather than Obsidian variables.

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md and framework conventions instead):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `site/bun.lock` | config | batch | Repository has no Bun lockfile or root package lockfile for a static site runtime. Let Bun generate it. |
| `site/src/pages/inventory.astro` | component/page | request-response/static render | No Astro/Starlight page exists. Use README table/content patterns plus Astro conventions from RESEARCH.md. |
| `site/src/content/docs/*.mdx` | component/page/docs | request-response/static render | No MDX/Starlight docs exist. Use Markdown docs structure and Starlight conventions from RESEARCH.md. |

## Metadata

**Analog search scope:** repository root, `.obsidian/plugins/harness-canvas-research/`, `latex-document-skill/scripts/`, `latex-document-skill/tests/`, `README.md`, `science/README.md`, `pillars/README.md`, `docs/migration/`, `assets/latex/`.
**Files scanned:** 40+ candidate files from `find` over config, TypeScript, Python, shell, Markdown, CSS, Astro/MDX patterns.
**Strong analogs read:** 11 files.
**Pattern extraction date:** 2026-05-14

## Implementation Notes for Planner

1. This repository has no exact static-site analog. Do not pretend otherwise. Copy local patterns for boundaries, typed data, validation behavior, provenance docs, and accessible CSS; use Astro/Starlight conventions from RESEARCH.md for framework-specific syntax.
2. The foundation is contractual: validation must fail before build output lies about corpus provenance.
3. Keep all implementation under `/home/prannayag/harness_eng/site/`; the canonical corpus remains under `/home/prannayag/harness_eng/science/` and `/home/prannayag/harness_eng/pillars/`.
