# Gap Analysis

*Analysis of findings from 4 axes on GSD complaints and community sentiment.*

## Contradictions Found

1. **GSD is "overkill" vs "not deep enough"**: Axis 2 reports GSD is overkill for small projects (45-60 min per cycle), while the codecentric deep-dive positions it as suited only for "small to medium-sized projects" — implying it's also insufficient for large ones. The sweet spot appears narrow: medium-complexity greenfield projects.

2. **v1 architecture acknowledged as broken, yet v1 still recommended**: The GSD creator confirmed v1 was "fighting the tool" with no real context control ([GSD-2 GitHub](https://github.com/gsd-build/gsd-2)), yet v1 remains the more documented, more installed version. Axis 4 found no first-person accounts of v2 onboarding, making it unclear whether v2 actually resolves the complaints.

3. **Token cost framing**: Axis 1 documents excessive token consumption as a bug (#120: "100 agents eating 10k tokens in 60 seconds"), while Axis 2 frames it as an inherent design trade-off ("the token expenditure is no joke" but worthwhile). The reality likely depends on project size — bug for simple tasks, acceptable for complex ones.

## Unanswered Questions

1. **GSD v2 complaint profile**: Nearly all complaints target v1. v2 is too new for a meaningful complaint corpus. Does v2 actually fix the routing bugs, state management failures, and CC coupling issues?

2. **Silent churn rate**: Multiple axes note the absence of "I switched from GSD" narratives. Users who leave may simply stop talking about it rather than writing migration posts.

3. **Discord feedback**: GSD has an active Discord (`/gsd:join-discord`). This is likely the richest complaint source but is inaccessible to web search.

4. **Cost per project type**: No source quantifies GSD's actual token cost for different project sizes (small/medium/large) vs vanilla Claude Code.

5. **Superpowers + GSD combo effectiveness**: Multiple sources describe using both together. Whether this is complementary or a signal that GSD alone is insufficient is unresolved.

## Thin Areas

1. **Reddit sentiment nearly absent**: Despite extensive searching, Reddit threads discussing GSD specifically were almost non-existent across all 4 axes. Community may concentrate on Discord/X/GitHub.

2. **Brownfield/existing codebase experience**: Axis 4 found the CLAUDE.md conflict (Issue #50) but few detailed accounts of using GSD on large existing codebases beyond "SDD is mostly unusable for large codebases" (marmelab, about SDD generally).

3. **Windows-specific complaints**: Axis 1 found 3 Windows issues but Axes 2-4 found no community discussion of Windows friction — likely because the GSD community skews macOS/Linux.

4. **Multi-user/team usage**: Only one GitHub Issue (#243) and the maintainer's "solo-dev workflow" response were found. Real-world team usage patterns are undocumented.

## Citation Audit

### Unsourced Claims Detected
- No significant unsourced factual claims detected across the 4 axes. All major findings cite GitHub Issues, blog posts, or comparison articles.

### Coverage Summary
- Axis 1 (GitHub Issues): All claims sourced (24 GitHub Issues)
- Axis 2 (Community Sentiment): All claims sourced (12+ sources)
- Axis 3 (Competitive Weaknesses): All claims sourced (15+ sources)
- Axis 4 (Onboarding Friction): All claims sourced (15+ sources)
- **Total: ~66 sources across all 4 axes**

No unsourced claims detected — all findings meet citation requirements.

## Follow-up Research Needed

**No — gaps are structural.** The unanswered questions (v2 complaints, Discord feedback, silent churn) cannot be resolved through additional web search — they require access to Discord, direct user interviews, or waiting for v2 to accumulate a complaint corpus. The thin areas (Reddit absence, Windows, teams) reflect genuine community composition rather than insufficient research effort.
