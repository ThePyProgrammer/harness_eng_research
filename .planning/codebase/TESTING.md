# Testing Patterns

**Analysis Date:** 2026-05-13

## Test Framework

**Runner:**
- TypeScript plugin tests use **Jest 29** with **ts-jest** in `.obsidian/plugins/harness-canvas-research/package.json` and `.obsidian/plugins/harness-canvas-research/jest.config.ts`.
- Python backend and LaTeX tooling use **pytest**. The backend declares `pytest` and `pytest-asyncio` in `.obsidian/plugins/harness-canvas-research/backend/pyproject.toml`; the LaTeX skill includes pytest-based checks in `latex-document-skill/tests/test_python_scripts.py` and `latex-document-skill/tests/README.md`.

**Assertion Library:**
- Jest assertions for TypeScript tests.
- Pytest assertions for Python tests.

**Run Commands:**
```bash
npm test                           # Run plugin Jest suite in .obsidian/plugins/harness-canvas-research/
python -m pytest backend/tests      # Run backend pytest suite in .obsidian/plugins/harness-canvas-research/backend/
python -m pytest latex-document-skill/tests/test_python_scripts.py  # Run LaTeX script tests
```

## Test File Organization

**Location:**
- Tests are co-located by subsystem: `tests/*.test.ts` for the plugin and `backend/tests/test_*.py` for the backend.
- The LaTeX utility package keeps tests in `latex-document-skill/tests/` and focuses on script-level behavior.

**Naming:**
- TypeScript tests use `<feature>.test.ts`, such as `tests/layout-engine.test.ts`, `tests/ws-client.test.ts`, `tests/canvas-adapter.test.ts`, and `tests/settings.test.ts`.
- Python tests use `test_<module>.py`, such as `backend/tests/test_research.py`, `backend/tests/test_organize.py`, `backend/tests/test_vault_search.py`, and `latex-document-skill/tests/test_python_scripts.py`.

**Structure:**
```text
tests/
├── mocks/
│   └── obsidian.ts
├── canvas-adapter.test.ts
├── layout-engine.test.ts
├── ws-client.test.ts
└── settings.test.ts

backend/tests/
├── test_research.py
├── test_organize.py
└── test_vault_search.py

latex-document-skill/tests/
├── README.md
├── test_python_scripts.py
└── (additional script tests as needed)
```

## Test Structure

**Suite Organization:**
```typescript
describe('LayoutEngine', () => {
  let engine: LayoutEngine;
  let mockLayout: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    engine = new LayoutEngine();
    const elkInstance = new ELK();
    mockLayout = elkInstance.layout as jest.Mock;
  });

  describe('computeLayout', () => {
    it('returns positions map where every non-group node ID has x,y coordinates', async () => {
      // arrange
      // act
      // assert
    });
  });
});
```

**Patterns:**
- Group tests with nested `describe` blocks by method or feature, as in `tests/layout-engine.test.ts`, `tests/ws-client.test.ts`, and `backend/tests/test_research.py`.
- Prefer helper factories for repeated test data, such as `makeNode()` and `makeElkResult()` in `tests/layout-engine.test.ts`, `_make_assistant_message()` in `backend/tests/test_research.py`, and fixtures like `sample_csv` in `latex-document-skill/tests/test_python_scripts.py`.
- Reset mocks in `beforeEach`; restore spies in `afterEach` where needed. See `tests/layout-engine.test.ts` and `tests/ws-client.test.ts`.

## Mocking

**Framework:**
- Jest mocks for the plugin, including `jest.mock(...)`, `jest.fn()`, fake timers, and a custom `MockWebSocket` class in `tests/ws-client.test.ts`.
- Python uses `unittest.mock.AsyncMock`, `MagicMock`, and `patch` in `backend/tests/test_research.py` and `backend/tests/test_organize.py`.

**Patterns:**
```typescript
jest.mock('elkjs/lib/elk.bundled', () => {
  const mockLayout = jest.fn();
  const mockELK = jest.fn().mockImplementation(() => ({
    layout: mockLayout,
  }));
  (mockELK as any)._mockLayout = mockLayout;
  return { default: mockELK };
});
```

```python
with patch("research.query") as mock_query:
    mock_query.return_value = _async_gen(assistant_msg, _make_result_message())
    await run_research_session(mock_ws, "test", "s1")
```

**What to Mock:**
- Mock external boundaries: Obsidian internals, WebSocket transport, ELK layout, Claude Agent SDK calls, filesystem/CLI subprocesses, and browser timers.
- Use synthetic canvas objects and plain dictionaries for layout and mutation tests in `tests/canvas-adapter.test.ts`, `tests/layout-engine.test.ts`, and `backend/tests/test_organize.py`.

**What NOT to Mock:**
- Do not mock the pure utility functions being verified, such as `src/types.ts` helpers (`shouldCreateLinkedFile`, `sanitizeFileName`, `buildLinkedFileContent`) or layout math in `src/canvas/SubNodePlacer.ts`; test them as-is.

## Fixtures and Factories

**Test Data:**
```python
@pytest.fixture
def sample_csv(temp_dir):
    csv_path = temp_dir / "data.csv"
    csv_path.write_text(
        "name,age,score\n"
        "Alice,25,95.5\n"
        "Bob,30,87.3\n"
    )
    return csv_path
```

**Location:**
- Python fixtures live in the test module that uses them, especially `latex-document-skill/tests/test_python_scripts.py`.
- The backend uses small inline factories rather than a shared fixture module, as in `backend/tests/test_research.py` and `backend/tests/test_organize.py`.

## Coverage

**Requirements:**
- No explicit coverage gate or minimum threshold was detected in `package.json`, `jest.config.ts`, or `pyproject.toml`.
- Coverage is therefore behavior-driven: tests exist to lock down core flows, edge cases, and CLI boundaries rather than to satisfy a numeric percentage.

**View Coverage:**
```bash
npm test -- --coverage          # Plugin coverage, if needed locally
python -m pytest --cov          # Python coverage, if pytest-cov is installed
```

## Test Types

**Unit Tests:**
- Most tests are unit-style and isolate a single module or function: `tests/canvas-adapter.test.ts`, `tests/settings.test.ts`, `backend/tests/test_vault_search.py`, and the pure-function portions of `latex-document-skill/tests/test_python_scripts.py`.

**Integration Tests:**
- Integration coverage appears at module boundaries and CLI entry points. Examples include `tests/layout-engine.test.ts` exercising ELK graph shaping, `tests/ws-client.test.ts` exercising WebSocket lifecycle handling, `backend/tests/test_research.py` exercising async query streaming, and `latex-document-skill/tests/test_python_scripts.py` invoking scripts with `subprocess.run`.

**E2E Tests:**
- No browser or full Obsidian E2E harness was detected.

## Common Patterns

**Async Testing:**
```python
@pytest.mark.asyncio
async def test_research_complete_on_result(mock_ws):
    with patch("research.query") as mock_query:
        mock_query.return_value = _async_gen(_make_result_message())
        await run_research_session(mock_ws, "test", "s1")
```

```typescript
it('calls setData with interpolated positions over multiple frames', async () => {
  const animPromise = engine.animateLayout(mockCanvas, targets, 500);
  rafCallback!(currentTime);
  await animPromise;
});
```

**Error Testing:**
```python
with pytest.raises(ValueError, match="Bar chart requires"):
    generate_chart.plot_bar(data, ax)
```

```typescript
expect(() => client.send(msg)).not.toThrow();
```

- CLI scripts are tested by checking exit codes and stderr/stdout text, as in `latex-document-skill/tests/test_python_scripts.py`.
- WebSocket reconnection behavior is validated with fake timers in `tests/ws-client.test.ts`.
- Layout behavior is validated with deterministic mocked ELK responses in `tests/layout-engine.test.ts`.

---

*Testing analysis: 2026-05-13*