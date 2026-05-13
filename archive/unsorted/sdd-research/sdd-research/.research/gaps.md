# Gap Analysis

## Contradictions Found

1. **Star count discrepancies**: Axis 1 reports conflicting GitHub star counts for the same tools from different sources. The redreamality.com comparison article listed OpenSpec at 4.1k stars vs. the GitHub topics page showing 29.7k stars. Similarly, Spec Kit was listed at 39.3k vs. 76k. These are likely temporal differences (the article was written months before the research), but readers should treat star counts as approximate.

2. **PAUL's anti-subagent stance vs. community endorsement of multi-agent patterns**: Axis 5 documents PAUL's explicit position that "subagents produce ~70% quality work that needs cleanup," while Axis 7 documents QuantumBlack/McKinsey's finding that multi-agent review with specialized roles catches errors that execution agents miss. Both positions cite experience-based evidence but reach opposing conclusions about subagent value for implementation. **Follow-up 1 partially resolves this**: PAUL's actual source code shows it DOES use subagents for discovery/research while restricting them from implementation — confirming the nuanced position that subagents excel at review/research but are weaker for code generation.

3. **SDD as waterfall vs. SDD as agile**: Axis 7 documents the heated debate. Marmelab and multiple HN commenters argue SDD IS waterfall, while Thoughtworks and HN commenter 4ndrewl argue the fast iteration cycle makes it fundamentally different. Both sides have valid points and neither has empirical data to settle it.

4. **Context management strategy disagreement**: Axis 5 documents GSD/Agent Teams Lite aggressively spawning fresh contexts vs. Pilot Shell actively managing compaction within long sessions. Both claim superior reliability but no comparative data exists. **Follow-up 1 adds detail**: Pilot Shell's compaction hooks capture plan state before auto-compaction fires and re-inject it after, while GSD pre-packs dispatch prompts with all necessary artifacts. These are genuinely different architectural choices, not contradictions — they suit different workflow patterns (long exploratory sessions vs. batch execution).

5. **Spec Kit file count**: Axis 2 mentions "8+ artifacts per spec" from the Thoughtworks review, while Axis 3's comparison table lists constitution, spec, plan, tasks, research, data-model, and contracts as the file types. These are consistent but the "8+" vs. enumerated list creates minor ambiguity about exact count.

6. **BMAD scale-adaptive intelligence**: Prior research described "scale-adaptive intelligence" as a key feature. **Follow-up 2 reveals** this is primarily manual track selection between Full Lifecycle (4-phase) and Quick Flow paths, with some CSV-driven project-type classification adjusting required sections. The marketing claim of automatic adaptation overstates the actual mechanism.

## Unanswered Questions

1. **How do these tools handle mid-implementation requirement changes?** Context.md's Key Question #1 asks about human-in-the-loop placement, which was well-covered. But the sub-question of "what happens when requirements change DURING execution" is only partially addressed — OpenSpec's delta system, PAUL's UNIFY and decimal phases (2.1, 2.2 for interruptions, per Follow-up 1), and GSD's reassessment after each slice are documented, but most tools appear to have no answer. This is flagged as a critical gap by Axis 3 and Axis 7.

2. **What are the actual cost implications (API tokens/dollars) of different approaches?** GSD-2 mentions cost tracking, but no tool publishes comparative cost data. For someone building a new tool, understanding whether fresh-context-per-task (GSD) costs 2x or 10x more than in-session (PAUL) is important and unanswered.

3. **How do these tools perform at team scale (5+ developers)?** Axis 7 explicitly flags that "most experience reports come from solo developers or very small teams." Spec Kitty's worktree isolation and BMAD's multi-agent team simulation suggest team-scale designs, but no evidence of team-scale usage was found. **Follow-up 2 adds**: BMAD's Party Mode and team bundles (e.g., `team-fullstack.yaml`) are designed for team-scale coordination, but evidence of actual team-scale usage remains absent.

4. **What is the learning curve for each tool?** Context.md asks about trade-offs, but no axis specifically investigated onboarding time or documentation quality from a new-user perspective.

5. **How do tools handle cross-cutting concerns in specs?** Axis 7 mentions the anti-pattern of "mixing concerns in single specs" but the positive pattern — how to properly structure cross-cutting concerns like auth, logging, or error handling across multiple specs — is not well-documented by any tool.

## Thin Areas

1. **Several tools from the original list were not found**: "OpenKit" was not found by any axis (consistently flagged across axes 1-7). "agentic-code" was not found as a specific tool. "ai-factory" was found as a tool (lee-to/ai-factory) but was thin on architectural details in some axes. These may simply not exist as public projects.

2. **Prompt engineering actual content — SUBSTANTIALLY IMPROVED by Follow-up 1**: The follow-up deep-dive extracted verbatim prompt content from GSD (12 agents, 700-1300 line definitions), PAUL (26 commands with XML sections and CARL domain rules using RFC 2119 priorities), Pilot Shell (17 rules, 13 hooks including TDD enforcer and stop guard), and Spec Kit (9 commands with handoff-based agent transitions). Seven cross-tool patterns were identified including Thin Orchestrator/Fat Agent, Mandatory Task Sub-Elements, and Context-Aware Rule Injection. **Remaining gap**: Full internal XML structure of GSD's 700-1300 line agent files and Pilot Shell's model routing configuration could not be fully extracted.

3. **Empirical effectiveness data is entirely absent**: No axis found controlled studies, A/B tests, or quantitative comparisons of SDD approaches vs. alternatives. All effectiveness claims are self-reported by tool authors or based on anecdotal community reports. This is a fundamental limitation of the entire research.

4. **Commercial tools (Kiro, Tessl, Shotgun) are under-documented**: These tools have limited public documentation compared to fully open-source tools. Kiro's hook API, Tessl's MCP server details, and Shotgun's commercial features are not fully accessible.

5. **BMAD-METHOD internal details — SUBSTANTIALLY IMPROVED by Follow-up 2**: The follow-up revealed BMAD's agent persona system (YAML definitions with 5 sections: metadata, persona, critical_actions, menu, prompts), its 6-stage compilation pipeline, the HALT-and-gate workflow execution pattern, Party Mode's orchestrated multi-agent conversations, and the sharded step-file architecture. **Remaining gaps**: The exact XML activation header content, full party mode orchestration prompts, sidecar persistent memory system, and CIS creative agent definitions remain partially opaque.

## Citation Audit

### Unsourced Claims Detected
- No significant unsourced claims were detected across axes or follow-ups. All research met the minimum 5-source requirement for deep research.

### Coverage Summary
- Axis 1: All claims sourced (30+ sources)
- Axis 2: All claims sourced (25+ sources)
- Axis 3: All claims sourced (25+ sources)
- Axis 4: All claims sourced (20+ sources)
- Axis 5: All claims sourced (20+ sources)
- Axis 6: All claims sourced (25+ sources)
- Axis 7: All claims sourced (30+ sources)
- Follow-up 1: All claims sourced (34 source URLs)
- Follow-up 2: All claims sourced (15+ sources)

## Follow-up Research Completed

Both recommended follow-ups were executed:

1. **Prompt file deep-dive** (Follow-up 1): Successfully extracted verbatim prompt content and structural analysis from GSD, PAUL, Pilot Shell, and GitHub Spec Kit. Identified 7 cross-tool prompt engineering patterns. Substantially fills the "thin prompt engineering" gap.

2. **BMAD architecture analysis** (Follow-up 2): Successfully documented BMAD's agent persona system, workflow architecture, Party Mode, and scale-adaptive intelligence. Revealed the HALT-and-gate pattern, sharded step-file architecture, and YAML-to-markdown compilation pipeline. Substantially fills the "BMAD internal details" gap.

**No further follow-up research is needed.** Remaining gaps (full GSD agent file internals, Pilot Shell model routing config, BMAD activation header) would require cloning repositories and reading source files directly — beyond the scope of web-based research.
