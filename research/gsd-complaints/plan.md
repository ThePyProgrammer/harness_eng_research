# Research Plan

## Depth Configuration
- **Depth**: standard
- **Target axes**: 4
- **Follow-up policy**: 1 follow-up if gaps found

## Topic
Common complaints with GSD (Get Shit Done) framework for Claude Code — what users dislike, what breaks, what's frustrating, and what drives people away.

## Research Axes

### Axis 1: GitHub Issues & Discussions — Bug Reports and Feature Complaints
- **Question**: What are the most frequently reported bugs, broken workflows, and feature complaints in the GSD GitHub repos (gsd-build/get-shit-done and gsd-build/gsd-2)?
- **Search Strategy**: Search GitHub Issues for both repos, filtering by most commented and most thumbed-up. Search for "gsd-build get-shit-done issues", "gsd claude code bugs", "gsd framework broken", "gsd installation problems". Look for closed issues with "won't fix" labels. Check GitHub Discussions for pain point threads.
- **Source Priority**: GitHub Issues (primary — these are direct user complaints with reproduction steps), GitHub Discussions, release note changelogs (for bugs that were fixed, indicating they were real problems)
- **Exclusions**: Feature requests that are purely additive (not framed as "this is missing and it hurts"); issues about Claude Code itself rather than GSD specifically
- **Output Format**: Categorization table (complaint → severity → frequency → SDD stage → status: open/fixed/won't-fix) with direct quotes from issue authors
- **Target Length**: 15-25 complaints cataloged with quotes

### Axis 2: Community Sentiment — Reddit, HN, Twitter/X, Discord, Blog Posts
- **Question**: What do developers say about GSD in public forums? What frustrations, criticisms, and negative experiences are shared outside of GitHub?
- **Search Strategy**: Search Reddit (r/ClaudeAI, r/cursor, r/ChatGPTCoding) for "GSD", "get shit done claude", "gsd framework". Search Hacker News for "get shit done claude code". Search Twitter/X for "gsd claude code" complaints. Search for blog posts: "gsd review", "gsd problems", "gsd vs superpowers", "why I stopped using gsd". Search Discord channels (Claude Code community) for GSD complaints.
- **Source Priority**: Reddit threads with multiple upvotes (community validation), Hacker News discussions, blog posts with detailed experience reports, Twitter/X threads with engagement
- **Exclusions**: Positive reviews (unless they contain "but..." criticism); general Claude Code complaints not about GSD; complaints about the concept of SDD rather than GSD's implementation
- **Output Format**: Thematic narrative organized by complaint category, with direct quotes and source links. Note sentiment frequency (how many people echo each complaint).
- **Target Length**: 15-25 bullet points organized by theme, with quotes

### Axis 3: Competitive Weaknesses — Why Users Switch Away
- **Question**: What do users say when comparing GSD unfavorably to alternatives (Superpowers, Spec Kit, BMAD, Taskmaster, vanilla Claude Code, Cursor rules)? What are the dealbreakers that drive migration?
- **Search Strategy**: Search for comparison articles and threads: "gsd vs superpowers", "gsd vs spec kit", "gsd vs bmad", "gsd vs taskmaster", "switched from gsd to", "stopped using gsd", "gsd alternatives", "gsd overkill". Look for "why I switched" blog posts and Reddit threads. Search for competitive criticism in framework documentation (e.g., does Superpowers' README implicitly criticize GSD's approach?).
- **Source Priority**: Comparison blog posts, Reddit "which framework" threads, Twitter migration announcements, framework READMEs that position against GSD
- **Exclusions**: Comparisons that conclude GSD is better (we want the negative side); comparisons of frameworks that don't mention GSD
- **Output Format**: Comparison table (complaint → which alternative solves it → evidence) plus narrative on migration patterns
- **Target Length**: 10-15 competitive complaints with alternatives cited

### Axis 4: Onboarding & Learning Curve — First-Time User Friction
- **Question**: What specific friction do new users encounter when installing, configuring, and running GSD for the first time? What makes the learning curve steep?
- **Search Strategy**: Search for "gsd setup", "gsd installation problems", "gsd getting started", "gsd confusing", "gsd too many commands", "gsd overwhelmed", "gsd documentation", "npx get-shit-done-cc issues". Look for "help me understand GSD" threads. Search for tutorial blog posts that document stumbling blocks. Check GSD's own Discord/community for newbie help requests.
- **Source Priority**: "Help me" threads on Reddit/Discord, GitHub Issues tagged as questions, tutorial blog posts documenting friction, GSD documentation gaps
- **Exclusions**: Expert-level configuration complaints (covered in Axis 1); complaints about Claude Code's permission model rather than GSD
- **Output Format**: Ordered friction funnel: install → first run → first project → first phase → first execution → first verification, documenting where users get stuck at each step
- **Target Length**: 10-15 friction points ordered by the user journey stage

## Cross-Cutting Concerns
- **GSD v1 vs v2**: Note which complaints apply to v1 only, v2 only, or both. v2 may have addressed some v1 complaints.
- **GSD-specific vs Claude-inherited**: Distinguish complaints about GSD's design from complaints about Claude Code limitations that GSD can't control.
- **Severity calibration**: Dealbreaker (people leave) vs. major friction (people complain but stay) vs. minor annoyance (noted but tolerated).
- **SDD ontology mapping**: Tag each complaint with the S1-S10 stage it affects where possible.

## Expected Synthesis Structure
1. **Overview**: Landscape of GSD complaints — how many, where, what tone
2. **Complaint Taxonomy**: Categorized table with severity/frequency/stage/v2-status
3. **Top 10 Pain Points**: The most impactful complaints ranked by severity × frequency
4. **Competitive Gaps**: What alternatives do better, according to users who switched
5. **Onboarding Funnel**: Where new users get stuck, step by step
6. **Cross-Reference**: Which complaints the GSD de-sloppification proposal already addresses
7. **Unaddressed Gaps**: Complaints that neither GSD v2 nor the de-sloppification proposal covers

## Estimated Subagents
- Primary research: 4 subagents (one per axis)
- Expected follow-up: 0-1 gap-filling subagent
