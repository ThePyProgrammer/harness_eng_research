# OpenAI's Codex Harness: 1M Lines Without Manual Code

OpenAI published 'Harness Engineering: Leveraging Codex in an Agent-First World' (February 2026), documenting how a small team used Codex agents to construct a million-line production codebase over five months via ~1,500 automated pull requests — without writing a single line of manual code [1][2]. Their methodology works depth-first: decomposing goals into atomic building blocks (design, code, review, test), prompting agents to construct each block, then composing them into more complex tasks [1]. A key innovation was encoding 'golden principles' — opinionated mechanical rules for consistency — directly into the repository, making the codebase optimized for agent legibility rather than human readability first [1][3]. They also built a recurring cleanup process to maintain codebase quality across agent runs. This represents the most ambitious real-world validation that harness engineering can replace traditional development workflows at scale, though the approach demands rigorous spec infrastructure to maintain coherence [2].

## Sources
- [1] https://openai.com/index/harness-engineering/
- [2] https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/
- [3] https://www.nxcode.io/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026
