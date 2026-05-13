# Coding Conventions

**Analysis Date:** 2026-05-13

## Naming Patterns

**Files:**
- Obsidian plugin modules use PascalCase filenames that mirror exported classes, such as `src/canvas/CanvasAdapter.ts`, `src/canvas/LayoutEngine.ts`, `src/canvas/NodePlacer.ts`, `src/ui/ChatboxPanel.ts`, and `src/transport/WebSocketClient.ts`.
- Python backend modules use snake_case filenames, such as `backend/main.py`, `backend/research.py`, `backend/organize.py`, `backend/drill.py`, `backend/synthesize.py`, and `backend/vault_search.py`.
- Test files follow the source filename plus `.test.ts` / `test_*.py`, such as `tests/layout-engine.test.ts`, `tests/ws-client.test.ts`, `backend/tests/test_research.py`, and `latex-document-skill/tests/test_python_scripts.py`.

**Functions:**
- Use `camelCase` for TypeScript methods and helpers, such as `computeLayout`, `buildCanvasUpdate`, `applyMutation`, `setConnectionState`, and `sanitizeFileName` in `src/canvas/LayoutEngine.ts`, `src/canvas/CanvasAdapter.ts`, `src/ui/ChatboxPanel.ts`, and `src/types.ts`.
- Use `snake_case` for Python functions, such as `run_research_session`, `run_organize_pass`, `run_drill_session`, `run_synthesis_session`, `score_vault_results`, and `render_template` in `backend/research.py`, `backend/organize.py`, `backend/drill.py`, `backend/synthesize.py`, `backend/vault_search.py`, and `latex-document-skill/scripts/mail_merge.py`.
- Prefer verbs that describe the effect: `buildCanvasUpdate`, `createLinkedFileIfNeeded`, `scheduleReconnect`, `generate_output_name`, `extract_preamble_packages`.

**Variables:**
- Use descriptive camelCase for TS locals and fields, such as `reconnectDelay`, `sessionPrompts`, `activeSessions`, `groupedNodeIds`, and `nodeById`.
- Use snake_case for Python locals and parameters, such as `session_id`, `parent_content`, `vault_nodes`, and `result_text`.
- Prefer boolean names that read as predicates, such as `canWriteViaInternalAPI`, `intentionalClose`, `isDrill`, `submitEnabled`, and `inputEnabled`.

**Types:**
- Use PascalCase for TypeScript interfaces and classes, such as `CanvasResearcherSettings`, `CanvasNode`, `TopicAssignment`, `EdgeAssignment`, `WebSocketClient`, and `LayoutEngine` in `src/types.ts` and `src/canvas/LayoutEngine.ts`.
- Keep Python data structures lightweight and dictionary-based unless a class adds behavior; backend payloads remain plain dicts in `backend/*.py`.

## Code Style

**Formatting:**
- TypeScript code is written in strict mode via `tsconfig.json` in `.obsidian/plugins/harness-canvas-research/tsconfig.json` (`"strict": true`). Keep new TS code type-safe and avoid introducing implicit `any`.
- The plugin code uses 2-space indentation, semicolons, single-quoted imports, and compact inline object literals in places like `src/canvas/LayoutEngine.ts` and `src/ui/ChatboxPanel.ts`.
- Python code uses standard PEP 8 spacing and docstrings. Keep functions short and avoid deeply nested branching where a small helper can isolate the behavior.

**Linting:**
- TypeScript files include explicit `eslint-disable-next-line @typescript-eslint/no-explicit-any` comments where Obsidian internals force untyped access, as seen in `src/main.ts`, `src/canvas/CanvasAdapter.ts`, and `src/ui/ChatboxPanel.ts`.
- Prefer targeted suppression over broad disabling. If `any` is unavoidable for Obsidian canvas internals, localize the suppression to the smallest line or block.
- No repository-wide formatter config was detected at the root; preserve the prevailing style in adjacent files instead of reformatting unrelated code.

## Import Organization

**Order:**
1. External/runtime imports first, such as `obsidian`, `fastapi`, `claude_agent_sdk`, `elkjs`, `numpy`, and `matplotlib`.
2. Internal relative imports next, such as `./types`, `./canvas/CanvasAdapter`, or `from drill import run_drill_session`.
3. Type-only imports should use `import type` in TypeScript when only interfaces are needed, as in `src/main.ts`, `src/settings.ts`, and `tests/layout-engine.test.ts`.

**Path Aliases:**
- TypeScript path aliases are minimal; `tsconfig.json` only maps `obsidian` to the bundled type definitions in `.obsidian/plugins/harness-canvas-research/tsconfig.json`.
- Prefer relative imports for plugin modules and Python modules; no shared alias system is present.

## Error Handling

**Patterns:**
- Use `try/catch` around network, file, and CLI boundaries, then convert failures into user-visible status updates or structured error events. Examples: `backend/research.py`, `backend/drill.py`, `backend/synthesize.py`, `latex-document-skill/scripts/mail_merge.py`, `latex-document-skill/scripts/generate_chart.py`, and `latex-document-skill/scripts/validate_latex.py`.
- WebSocket-facing backend handlers send JSON error payloads with a `retryable` flag. Follow the existing split: transient failures in `backend/research.py` and `backend/drill.py` use `retryable: True`; deterministic failures in `backend/synthesize.py` and `backend/main.py` organize flow use `retryable: False`.
- Canvas writes use a fallback strategy in `src/canvas/CanvasAdapter.ts`: validate internal API support once, then fall back to `vault.process()` when direct canvas mutation is unavailable.
- Prefer returning structured results or sentinel values rather than throwing across module boundaries. For example, `backend/vault_search.py` filters and ranks results, while `src/canvas/CanvasAdapter.ts` returns capability state through `isInternalAPIAvailable()`.
- CLI scripts should print errors to `stderr` and exit non-zero on failure, as in `latex-document-skill/scripts/csv_to_latex.py` and `latex-document-skill/scripts/validate_latex.py`.

## Logging

**Framework:** `console` in TypeScript; `print(..., file=sys.stderr)` in Python.

**Patterns:**
- Use `console.debug` for session/state tracing, `console.info` for capability detection, `console.error` for recoverable failures, and `console.warn` for environmental warnings when appropriate. See `src/main.ts`, `src/canvas/CanvasAdapter.ts`, `src/transport/WebSocketClient.ts`, and `src/ui/ChatboxPanel.ts`.
- Python backend modules log progress and parse diagnostics to stderr, not stdout, so JSON payloads and CLI outputs stay separable. See `backend/research.py`, `backend/organize.py`, `backend/drill.py`, and `backend/synthesize.py`.
- Keep logs specific and operational: session IDs, node IDs, response lengths, and failure reasons are logged in `backend/*.py` and `src/main.ts`.

## Comments

**When to Comment:**
- Comment why a workaround exists, especially when interacting with Obsidian internals or external tools. Examples include the `@ts-ignore` on the bundled `elkjs` import in `src/canvas/LayoutEngine.ts` and the `any`-based Obsidian canvas access in `src/main.ts`.
- Use comments to document invariants, fallbacks, or ordering constraints, such as the write-serialization guarantee in `src/canvas/WriteQueue.ts` and the compound-graph behavior in `src/canvas/LayoutEngine.ts`.
- Avoid duplicating what the code already says; prefer comments that explain the reason for a non-obvious choice.

**JSDoc/TSDoc:**
- Exported TS classes and major methods commonly carry docblocks in `src/canvas/LayoutEngine.ts`, `src/canvas/CanvasAdapter.ts`, `src/canvas/WriteQueue.ts`, and `src/ui/ChatboxPanel.ts`. Keep that style for new exported behavior.
- Python scripts use module docstrings and function docstrings for CLI behavior and test purpose, as in `backend/main.py`, `backend/research.py`, and `latex-document-skill/scripts/validate_latex.py`.

## Function Design

**Size:**
- Keep functions focused on one responsibility. Stateful orchestration lives in classes like `src/main.ts` and `src/ui/ChatboxPanel.ts`; pure utilities live in `src/types.ts`, `src/canvas/SubNodePlacer.ts`, and `latex-document-skill/scripts/*.py`.
- Split layout, placement, serialization, and UI code into dedicated modules instead of adding more branches to `src/main.ts`.

**Parameters:**
- Prefer explicit parameters over global access when the function can be tested in isolation. Examples: `computeLayout(nodes, edges, topics)` in `src/canvas/LayoutEngine.ts` and `score_vault_results(query, index)` in `backend/vault_search.py`.
- Keep payloads in plain objects/arrays so tests can construct them directly, as in `src/types.ts` and `backend/tests/test_organize.py`.

**Return Values:**
- Return plain data structures or `Promise<void>` when the side effect is the important outcome. Examples: `buildCanvasUpdate(...) : void`, `animateLayout(...) : Promise<void>`, and `run_research_session(...) : None`.
- Return `null` or `false` for capability checks and optional lookups instead of throwing, as in `CanvasAdapter.getCurrentCanvas()` and `CanvasAdapter.isInternalAPIAvailable()`.

## Module Design

**Exports:**
- Prefer one primary class or a small set of related pure helpers per module. `src/canvas/LayoutEngine.ts` exports `LayoutEngine`, `src/canvas/NodePlacer.ts` exports `NodePlacer` plus `formatNodeText`, and `src/types.ts` exports shared payload types plus small pure helpers.
- Python modules export a single coroutine or a narrow set of helpers: `run_research_session` in `backend/research.py`, `run_organize_pass` in `backend/organize.py`, and `score_vault_results` in `backend/vault_search.py`.

**Barrel Files:**
- No barrel/export-index pattern was detected. Import modules directly from their concrete paths.

---

*Convention analysis: 2026-05-13*