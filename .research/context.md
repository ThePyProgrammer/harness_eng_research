# Research Context

## Topic
Common complaints with GSD (Get Shit Done) framework for Claude Code — what users dislike, what breaks, what's frustrating, and what drives people away.

## Scope & Parameters
- **In scope**: All public complaints — GitHub Issues, GitHub Discussions, Reddit (r/ClaudeAI, r/cursor, r/ChatGPTCoding), Hacker News, Twitter/X, Discord, blog posts, comparison articles ("why I switched from GSD to X")
- **In scope**: Both GSD v1 (get-shit-done) and GSD-2 (gsd-2) complaints
- **In scope**: Competitive weaknesses relative to Superpowers, Spec Kit, BMAD, Taskmaster, and other harnesses
- **Out of scope**: Feature requests that aren't framed as complaints; positive reviews; general Claude Code complaints unrelated to GSD

## Depth Level
Standard — 4-5 research axes with detailed categorization

## Target Audience
Harness engineers evaluating GSD or building improvements to it. The output should inform the existing GSD de-sloppification improvement proposal.

## Key Questions to Answer
1. **What are the most frequently reported issues?** — Categorized by type (bugs, UX friction, missing features, documentation gaps, philosophy disagreements)
2. **Which SDD stages (S1-S10) generate the most complaints?** — Map complaints to the ontology to identify which stages are weakest
3. **What drives users to switch away from GSD?** — Competitive loss reasons, dealbreakers, migration patterns
4. **What do power users complain about vs. newcomers?** — Are the pain points different for experienced users vs. first-time installers?
5. **What complaints overlap with the de-sloppification proposal?** — Do users already report slop-related issues that the proposed improvements would address?

## Constraints & Preferences
- Categorize complaints by severity (dealbreaker / major friction / minor annoyance) and frequency (common / occasional / rare)
- Map findings to SDD ontology stages where possible
- Include direct quotes where available
- Distinguish between complaints about GSD specifically vs. complaints about Claude Code that GSD inherits
- Note which complaints GSD v2 addresses vs. which remain open

## Output Format Preference
- Detailed categorization table (complaint → severity → frequency → SDD stage → addressed by v2?)
- Narrative summary of themes
- Cross-reference with existing gsd-desloppification.md and gsd-pain-points.md
