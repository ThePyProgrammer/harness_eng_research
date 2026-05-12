# Follow-up 1: Human-AI Discussion Patterns in Software Development

## Question
What patterns, frameworks, and research exist for structured human-AI collaborative discussion in software development workflows — specifically for requirements elicitation, design decisions, and phase planning? How can this interactive discussion stage be optimized and evaluated?

## Findings

### 1. HULA: Human-in-the-Loop LLM Agents (Atlassian/ICSE SEIP 2025)

- **HULA** is the most mature production deployment of structured human-AI discussion for software development. It creates coding plans (file lists + changes) for work items, which engineers review, provide feedback on, and regenerate. Deployed within JIRA at Atlassian. [HULA Blog - Atlassian](https://www.atlassian.com/blog/atlassian-engineering/hula-blog-autodev-paper-human-in-the-loop-software-development-agents) | [HULA Paper (arXiv)](https://arxiv.org/pdf/2411.12924) **Confidence: High** (ICSE SEIP 2025, production deployment)

- **Performance metrics**: In real-world deployment, practitioners approved 433/527 generated coding plans (82% plan approval rate). Pull requests were created for 95/376 code-generated issues (25% raised PR rate), and 56 PRs were successfully merged (59% merge rate). [HULA - ICSE 2025](https://conf.researchr.org/details/icse-2025/icse-2025-software-engineering-in-practice/53/Human-In-the-Loop-Software-Development-Agents) **Confidence: High**

- **Interaction pattern**: Engineer receives generated plan → reviews → provides direct edits or textual feedback → HULA regenerates. This is a structured feedback loop, not open-ended dialogue. **Confidence: High**

### 2. Spec-Driven Development (GitHub Spec Kit, Kiro, Tessl)

- **Spec Kit** is an open-source toolkit for spec-driven development that structures human-AI interaction into three phases: `/specify` (generates full spec from high-level prompt), `/plan` (creates technical implementation plan), `/tasks` (breaks into actionable tasks). Works with GitHub Copilot, Claude Code, and Gemini CLI. [Spec-Driven Development - GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) **Confidence: High** (production tool from GitHub)

- **The specification approach** uses `requirements.md`, `design.md`, and `tasks.md` files as the source of truth for agent behavior, turning vague prompts into clear intent. This has been adopted by Kiro, Tessl, and GitHub Spec Kit. [How Spec-Driven Development Improves AI Coding Quality - Red Hat](https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality) **Confidence: High**

- **Key insight**: Spec-driven development transforms the "discussion" stage into a structured artifact generation pipeline with human gates, rather than freeform dialogue. **Confidence: High**

### 3. Communicative Dehallucination (ChatDev)

- **Communicative dehallucination** prompts the assistant agent to actively request more detailed suggestions from the instructor before providing a formal response. The mechanism reduces code hallucinations by 67% compared to single-step AI generation. [ChatDev (ACL 2024)](https://arxiv.org/html/2307.07924v5) | [ChatDev (ACL Anthology)](https://aclanthology.org/2024.acl-long.810/) **Confidence: High** (ACL 2024, peer-reviewed)

- **Pattern**: Rather than answering directly, the agent asks clarifying questions first, continues communication based on those details, then provides its response. This is a proactive clarification-before-commitment pattern. **Confidence: High**

### 4. Requirements Elicitation with LLMs

- **LLMs for RE is rapidly growing**: Studies increased by 136% from 2023 to 2024. Human–AI Collaboration (HAIC) refers to bidirectional interactions where both human expertise and AI contribute to RE outcomes. [LLMs for RE: Systematic Literature Review (arXiv)](https://arxiv.org/html/2509.11446v1) **Confidence: High** (systematic review)

- **AI agents can generate clarifying questions** and suggestions to help stakeholders articulate needs, propose relevant examples or scenarios, and translate informal documentation into formal requirement specifications. [AI for RE: Industry Adoption (arXiv)](https://arxiv.org/html/2511.01324v1) **Confidence: High**

- **Multi-agent RE systems**: Deploy AI agents to generate user stories from initial requirements, assess and improve their quality, and prioritize them. Some integrate with agile tools like Jira. [AI-based Multiagent for Requirements Elicitation (arXiv)](https://arxiv.org/html/2409.00038v1) **Confidence: Medium-High**

- **Current limitations**: AI struggles with complex business logic, organizations lack training on effective AI tool usage for elicitation, and integration with existing processes remains challenging. GPT-based models dominate (90%), with zero-shot (44%) and few-shot (29%) strategies most common. Interactive prompting is only 5% — a major gap. [LLMs for RE (arXiv)](https://arxiv.org/html/2509.11446v1) **Confidence: High**

### 5. Interaction Patterns for AI-Assisted Development

- **Insert expansion patterns**: Equipping LLMs with structured interaction patterns (insert expansion, turn-taking facilitation, debugging workflows) leads to lowered conversation barriers and 5x improvement in bug resolution rates. [Interaction Patterns for Debugging (arXiv)](https://arxiv.org/html/2402.06229v1) **Confidence: Medium-High**

- **Human-AI collaboration has evolved** from simple Q&A to structured interactions mirroring pair programming dynamics, with clear specifications serving as shared context. [AI Pair Programming in 2025 (Naveck)](https://www.naveck.com/blog/how-ai-pair-programming-transforming-development-teams/) **Confidence: Medium**

- **Challenges and future directions for HITL agents**: A 2025 survey on human-in-the-loop software development agents identifies trust calibration, feedback integration, and maintaining developer agency as key open challenges. [HITL Challenges (arXiv)](https://arxiv.org/html/2506.11009) **Confidence: Medium-High**

### 6. AI and Agile: Workshop Findings

- **XP2025 Workshop research roadmap**: Identifies human-AI collaboration in agile ceremonies (sprint planning, retrospectives, requirements workshops) as an emerging research area needing structured investigation. [AI and Agile: XP2025 Workshop (arXiv)](https://arxiv.org/html/2508.20563v1) **Confidence: Medium** (workshop paper, research agenda)

### 7. Evaluation Metrics for Discussion Quality

- **No established metrics exist specifically for human-AI discussion in software development**. However, adjacent fields provide candidates:

- **Plan approval rate** (HULA: 82%) — measures whether generated artifacts are acceptable after discussion. [HULA Paper](https://arxiv.org/pdf/2411.12924) **Confidence: High**
- **Containment rate** — percentage of interactions fully resolved by AI without human escalation (enterprise targets 70-90%). [AI Evaluation Metrics 2026 (MasterOfCode)](https://masterofcode.com/blog/ai-agent-evaluation) **Confidence: Medium** (from conversational AI, not SE-specific)
- **Conversation flow** — measures context-aware dialogue maintenance. [AI Evaluation Metrics](https://masterofcode.com/blog/ai-agent-evaluation) **Confidence: Medium**
- **Defect density post-discussion** — whether discussed plans produce fewer defects than undiscussed ones. [CodeRabbit 2026 Quality Shift](https://www.coderabbit.ai/blog/2025-was-the-year-of-ai-speed-2026-will-be-the-year-of-ai-quality) **Confidence: Low** (proposed, not validated)
- **AI-SQE 2026 workshop** (co-located with ICSE 2026) is specifically addressing "AI for Software Quality Evaluation: Judgment, Metrics, Benchmarks." [AI-SQE 2026](https://conf.researchr.org/home/icse-2026/ai-sqe-2026) **Confidence: High** (upcoming venue)

### 8. Optimization Strategies for the Discussion Stage

Based on synthesized findings, the most promising optimization approaches are:

1. **Structured artifact generation** (Spec Kit pattern): Convert freeform discussion into `/specify → /plan → /tasks` pipeline with human gates at each step. Most mature and adopted approach.
2. **Communicative dehallucination** (ChatDev pattern): Force agents to ask clarifying questions before committing to responses. 67% reduction in hallucinations.
3. **Plan-feedback loops** (HULA pattern): Generate plan → human reviews → provides feedback → regenerate. 82% approval rate in production.
4. **Multi-agent requirements elicitation**: Deploy specialized agents for user story generation, quality assessment, and prioritization.
5. **Interaction pattern design** (conversation analysis patterns): Apply insert expansion and turn-taking facilitation patterns from HCI research.

### Key Unknowns

1. **No benchmark exists for evaluating human-AI discussion quality** in software development. HULA's plan approval rate is the closest metric but measures artifact quality, not discussion process quality.
2. **Optimal dialogue structure**: Whether structured artifact-based interaction (Spec Kit) or freeform dialogue with dehallucination (ChatDev) produces better outcomes is untested.
3. **Discussion stage optimization via DSPy/TextGrad**: No research applies automated prompt optimization to the interactive discussion stage specifically.
4. **Cross-stage impact**: Whether higher-quality discussions lead to measurably better downstream planning and execution is assumed but not empirically validated.
5. **Developer trust and agency**: How to calibrate trust in AI suggestions during discussion without either over-reliance or under-utilization remains an open HCI challenge.
6. **Interactive prompting is only 5%** of RE research — the vast majority uses zero/few-shot, leaving the discussion-oriented interaction mode severely under-studied.

## Metadata
- Subagent completed: 2026-03-16
- Sources cited: 15
