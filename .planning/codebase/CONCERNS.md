# Codebase Concerns

**Analysis Date:** 2026-05-13

## Tech Debt

**Obsidian canvas integration depends on internal APIs and `any` escape hatches:**
- Issue: The plugin relies on private/unstable canvas methods (`getData`, `setData`, `requestSave`, `importData`) and uses broad `any` types to reach into Obsidian internals.
- Files: `/.obsidian/plugins/harness-canvas-research/src/main.ts`, `/.obsidian/plugins/harness-canvas-research/src/canvas/CanvasAdapter.ts`, `/.obsidian/plugins/harness-canvas-research/src/canvas/LayoutEngine.ts`, `/.obsidian/plugins/harness-canvas-research/src/ui/ChatboxPanel.ts`
- Impact: Small Obsidian API changes can break node placement, layout, linked-file creation, or save flows without compile-time detection.
- Fix approach: Isolate all canvas-specific access behind one adapter layer, replace ad hoc `any` usage with narrowed interfaces, and add a single compatibility test for each Obsidian API touchpoint.

**Session orchestration is concentrated in one large plugin entry point:**
- Issue: `src/main.ts` owns backend launch, websocket lifecycle, session tracking, node placement, drill-down, synthesis, vault-search orchestration, linked-file creation, and canvas mutation handling in one file.
- Files: `/.obsidian/plugins/harness-canvas-research/src/main.ts`
- Impact: Event handling is fragile to modify, especially when adding new message types or changing the research flow; regressions can cross session cleanup, UI state, and canvas state at once.
- Fix approach: Split event routing, session state, and canvas mutation logic into separate services with explicit boundaries and dedicated tests.

**Backend process discovery assumes local tooling layout:**
- Issue: The backend launcher and Python workers assume a local Claude CLI at `~/.local/bin/claude`, a small set of PATH locations, and a local Python/uv installation.
- Files: `/.obsidian/plugins/harness-canvas-research/src/transport/BackendLauncher.ts`, `/.obsidian/plugins/harness-canvas-research/backend/research.py`, `/.obsidian/plugins/harness-canvas-research/backend/organize.py`, `/.obsidian/plugins/harness-canvas-research/backend/synthesize.py`
- Impact: Users on nonstandard installs or locked-down systems will fail at startup or see silent reconnect churn when the backend cannot launch.
- Fix approach: Centralize executable discovery, surface explicit configuration validation in settings, and fail fast with a structured diagnostic page before trying to reconnect.

**Vault search loads the full vault into memory:**
- Issue: The frontend builds an in-memory lowercase index for every markdown file and sends the entire index over WebSocket on each search.
- Files: `/.obsidian/plugins/harness-canvas-research/src/transport/VaultIndexer.ts`, `/.obsidian/plugins/harness-canvas-research/src/main.ts`, `/.obsidian/plugins/harness-canvas-research/backend/vault_search.py`
- Impact: Large vaults will increase startup latency, memory usage, WebSocket payload size, and search round-trip time.
- Fix approach: Move to incremental indexing, keep only lightweight term statistics in memory, and send a query-specific subset instead of the full corpus.

**Canvas write serialization hides failures from callers:**
- Issue: `WriteQueue.enqueue()` catches write errors and logs them, but it does not propagate the failure back to the caller.
- Files: `/.obsidian/plugins/harness-canvas-research/src/canvas/WriteQueue.ts`
- Impact: The research flow can continue as if a canvas mutation succeeded when it actually failed, leaving missing nodes, broken edges, or partially saved canvas state.
- Fix approach: Return rejected promises to the caller or expose a failure callback so session cleanup and UI state can react to a failed mutation.

## Known Bugs

**Synthesis input truncates when node IDs and contents diverge:**
- Symptoms: `run_synthesis_session()` zips `node_ids` and `node_contents`; any mismatch silently drops extra nodes from the synthesis prompt.
- Files: `/.obsidian/plugins/harness-canvas-research/backend/synthesize.py`, `/.obsidian/plugins/harness-canvas-research/src/main.ts`
- Trigger: A future caller that constructs mismatched arrays, or a partial failure before prompt assembly.
- Workaround: Validate list lengths before synthesis and return a structured error instead of truncating.

**Research and organize passes depend on brittle JSON-only model output:**
- Symptoms: The backend only accepts JSON lines in `research.py` and a single JSON object in `organize.py`/`synthesize.py`; commentary, malformed fences, or multiline JSON are discarded or fail parsing.
- Files: `/.obsidian/plugins/harness-canvas-research/backend/research.py`, `/.obsidian/plugins/harness-canvas-research/backend/organize.py`, `/.obsidian/plugins/harness-canvas-research/backend/synthesize.py`
- Trigger: Model output that includes extra prose, formatting, or partial JSON.
- Workaround: Keep prompts strict and add schema validation plus retry/repair logic for malformed responses.

**Linked-file creation can race on folder and file existence checks:**
- Symptoms: The code checks for folder/file existence and then creates them in separate steps before writing the linked markdown file.
- Files: `/.obsidian/plugins/harness-canvas-research/src/main.ts`
- Trigger: Concurrent sessions or an external vault change between the existence check and the write.
- Workaround: Treat folder creation and file creation as idempotent operations and handle "already exists" errors explicitly.

**Disconnect/reconnect transitions can leave stale local state behind:**
- Symptoms: The websocket client reconnects automatically after close, but session state lives in several plugin-side maps that are only cleaned up for some message types.
- Files: `/.obsidian/plugins/harness-canvas-research/src/transport/WebSocketClient.ts`, `/.obsidian/plugins/harness-canvas-research/src/main.ts`, `/.obsidian/plugins/harness-canvas-research/src/ui/ChatboxPanel.ts`
- Trigger: Backend crashes mid-session, websocket churn, or an error path that skips the expected completion event.
- Workaround: Introduce a session teardown routine that clears maps and UI activity on hard disconnects and nonretryable failures.

**Group-kill logic is platform-sensitive:**
- Symptoms: `BackendLauncher.kill()` uses a negative PID to terminate the process group and falls back to direct kill if that fails.
- Files: `/.obsidian/plugins/harness-canvas-research/src/transport/BackendLauncher.ts`
- Trigger: Platforms or shells without POSIX process-group semantics, or a child process that never reports a PID.
- Workaround: Provide a platform-aware shutdown path and test it on Windows as well as POSIX hosts.

## Security Considerations

**Local WebSocket server has no authentication:**
- Risk: Any local process that can reach `ws://127.0.0.1:8765/ws` can trigger research, organize, drill, or synthesis jobs that consume Claude credits and access vault-derived context.
- Files: `/.obsidian/plugins/harness-canvas-research/backend/main.py`, `/.obsidian/plugins/harness-canvas-research/src/settings.ts`, `/.obsidian/plugins/harness-canvas-research/src/transport/WebSocketClient.ts`
- Current mitigation: Binding to localhost only.
- Recommendations: Require a per-session token, validate the first message, and reject requests that do not match the plugin-generated secret.

**Backend launcher accepts an arbitrary executable override:**
- Risk: The Python path setting can point to any executable path the user provides, and the launcher executes it directly.
- Files: `/.obsidian/plugins/harness-canvas-research/src/transport/BackendLauncher.ts`, `/.obsidian/plugins/harness-canvas-research/src/settings.ts`
- Current mitigation: None beyond manual user configuration.
- Recommendations: Validate that the override points to a Python/uv binary, display the resolved path in settings, and warn when the path resolves outside expected locations.

**Backend loads ambient environment variables on startup:**
- Risk: `load_dotenv()` pulls configuration from a `.env` file in the backend process working directory, which can silently alter model credentials or runtime behavior.
- Files: `/.obsidian/plugins/harness-canvas-research/backend/main.py`
- Current mitigation: Startup warning when `CLAUDE_CODE_OAUTH_TOKEN` is missing.
- Recommendations: Prefer explicit env configuration in the Obsidian settings flow and avoid loading ambient dotenv files unless the user opts in.

**Claude CLI invocation inherits local process context:**
- Risk: The backend delegates to the local Claude CLI and shell-discovered executables, so the effective trust boundary is the user’s workstation, not the plugin.
- Files: `/.obsidian/plugins/harness-canvas-research/backend/research.py`, `/.obsidian/plugins/harness-canvas-research/backend/organize.py`, `/.obsidian/plugins/harness-canvas-research/backend/synthesize.py`, `/.obsidian/plugins/harness-canvas-research/src/transport/BackendLauncher.ts`
- Current mitigation: Local-only execution and user-provided auth.
- Recommendations: Document the trust model in the plugin settings UI and surface clear warnings when the backend is launched.

## Performance Bottlenecks

**Vault indexing scales linearly with vault size and content length:**
- Problem: `VaultIndexer.buildIndex()` reads every markdown file, lowercases the entire content, and keeps the whole index resident in memory.
- Files: `/.obsidian/plugins/harness-canvas-research/src/transport/VaultIndexer.ts`
- Cause: The implementation is optimized for small vaults and does no incremental or selective indexing.
- Improvement path: Add incremental refresh, store only searchable fingerprints or term maps, and cap the indexed content kept per file.

**Layout and canvas mutation are serialized on the UI thread:**
- Problem: Layout application, canvas mutation, and animation all occur inside the plugin process with write serialization.
- Files: `/.obsidian/plugins/harness-canvas-research/src/canvas/LayoutEngine.ts`, `/.obsidian/plugins/harness-canvas-research/src/canvas/WriteQueue.ts`, `/.obsidian/plugins/harness-canvas-research/src/main.ts`
- Cause: The code intentionally avoids overlapping writes, but large sessions will queue many mutations and visual updates.
- Improvement path: Batch node creation and edge creation more aggressively, reduce intermediate imports, and make layout work chunkable for large result sets.

**Research payloads can become very large:**
- Problem: The plugin sends vault index data, finding lists, and node content arrays over WebSocket in a single request path.
- Files: `/.obsidian/plugins/harness-canvas-research/src/main.ts`, `/.obsidian/plugins/harness-canvas-research/backend/main.py`, `/.obsidian/plugins/harness-canvas-research/backend/organize.py`
- Cause: The backend expects complete payloads rather than streaming or paging.
- Improvement path: Pass identifiers and fetch details server-side, or chunk large payloads before sending.

## Fragile Areas

**Message protocol is spread across frontend and backend with no schema enforcement:**
- Files: `/.obsidian/plugins/harness-canvas-research/src/types.ts`, `/.obsidian/plugins/harness-canvas-research/src/main.ts`, `/.obsidian/plugins/harness-canvas-research/backend/main.py`, `/.obsidian/plugins/harness-canvas-research/backend/research.py`, `/.obsidian/plugins/harness-canvas-research/backend/organize.py`, `/.obsidian/plugins/harness-canvas-research/backend/synthesize.py`
- Why fragile: A field rename or shape change can break the whole pipeline without a compiler-level contract across TypeScript and Python.
- Safe modification: Introduce a versioned JSON schema and validate every inbound and outbound event against it.
- Test coverage: Unit tests exist, but there is no protocol-level integration test that exercises the real frontend-backend handshake.

**Canvas layout code assumes node shapes and dimensions remain stable:**
- Files: `/.obsidian/plugins/harness-canvas-research/src/canvas/LayoutEngine.ts`, `/.obsidian/plugins/harness-canvas-research/src/canvas/NodePlacer.ts`, `/.obsidian/plugins/harness-canvas-research/src/canvas/SubNodePlacer.ts`, `/.obsidian/plugins/harness-canvas-research/src/main.ts`
- Why fragile: Layout calculations depend on fixed width/height assumptions and parent-node geometry, so rendering changes can produce overlapping nodes or invalid group bounds.
- Safe modification: Centralize node sizing constants and assert bounds before mutating canvas data.
- Test coverage: There are layout tests, but they do not cover live canvas geometry in Obsidian.

**Linked-file generation depends on a heuristic source threshold:**
- Files: `/.obsidian/plugins/harness-canvas-research/src/types.ts`, `/.obsidian/plugins/harness-canvas-research/src/main.ts`
- Why fragile: `shouldCreateLinkedFile()` is a simple source-count check, which can generate files for low-quality sources or suppress files for highly relevant two-source findings.
- Safe modification: Replace the threshold with a scored relevance rule or a user-configurable policy.
- Test coverage: Helper tests exist, but policy behavior is not covered end-to-end.

## Test Coverage Gaps

**No real integration test covers the plugin/backend/canvas boundary:**
- What's not tested: A full research session that starts the backend, opens a websocket, streams node previews, writes to a real canvas file, and completes organize/layout.
- Files: `/.obsidian/plugins/harness-canvas-research/tests/*.test.ts`, `/.obsidian/plugins/harness-canvas-research/backend/tests/*.py`
- Risk: Cross-process regressions will slip past unit tests, especially around WebSocket sequencing and canvas mutation order.
- Priority: High

**No test covers auth or localhost exposure for the websocket server:**
- What's not tested: Rejection of unauthorized local clients, token validation, or malformed first-message handling.
- Files: `/.obsidian/plugins/harness-canvas-research/backend/main.py`
- Risk: The server currently trusts any local WebSocket peer.
- Priority: High

**No test covers file-creation races and vault permission failures:**
- What's not tested: Concurrent linked-file creation, folder creation collisions, or permission-denied behavior in real vaults.
- Files: `/.obsidian/plugins/harness-canvas-research/src/main.ts`
- Risk: Users may see missing linked files or silent partial canvas updates.
- Priority: Medium

**No test exercises large-vault indexing performance:**
- What's not tested: Startup cost, memory growth, or WebSocket payload size for large vaults.
- Files: `/.obsidian/plugins/harness-canvas-research/src/transport/VaultIndexer.ts`, `/.obsidian/plugins/harness-canvas-research/backend/vault_search.py`
- Risk: The current approach can degrade sharply as vault size grows.
- Priority: Medium

**LaTeX corpus has strong documentation, but the active repo’s runtime boundary is sparse:**
- What's not tested: The core corpus is documentation-heavy, but the operational runtime surface is concentrated in the Obsidian plugin and backend.
- Files: `/.obsidian/plugins/harness-canvas-research/tests/*.test.ts`, `/.obsidian/plugins/harness-canvas-research/backend/tests/*.py`, `/.planning/codebase/CONCERNS.md`
- Risk: A well-documented corpus can still hide brittle behavior in the executable plugin path.
- Priority: Medium

---

*Concerns audit: 2026-05-13*
