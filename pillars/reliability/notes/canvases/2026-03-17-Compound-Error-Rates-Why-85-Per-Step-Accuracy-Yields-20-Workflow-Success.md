# Compound Error Rates: Why 85% Per-Step Accuracy Yields 20% Workflow Success

A critical but underappreciated gap in harness frameworks is compound error propagation: an agent achieving 85% accuracy per individual action — seemingly strong performance — results in only ~20% end-to-end success rate across a 10-step workflow due to multiplicative probability (0.85^10 ≈ 0.20) [1][2]. Most agent failures do not trigger visible errors because the system returns successful status codes even when results are wrong — an agent may retrieve the wrong document, select the wrong tool, or pass incorrect parameters while traditional monitoring shows nominal completion [1][3]. Debugging is fundamentally harder than traditional software because failures are non-deterministic, distributed across multi-step chains, and produce no stack traces [3]. LangSmith introduced 'deep agent' debugging in December 2025 with AI-assisted trace analysis, while Langfuse captures nested traces for inspecting model calls, tool usage, and execution paths [3]. The implication for spec design is that verification checkpoints must be embedded at every step boundary, not just at final output — transforming specs from endpoint-focused documents into pipeline-aware orchestration plans [2].

## Sources
- [1] https://composio.dev/blog/why-ai-agent-pilots-fail-2026-integration-roadmap
- [2] https://dev.to/deiu/the-three-things-wrong-with-ai-agents-in-2026-492m
- [3] https://www.braintrust.dev/articles/best-ai-agent-debugging-tools-2026
