# Gap Analysis

*Analysis of findings from 5 axes on de-sloppification of AI-generated code.*

## Contradictions Found

1. **ETH Zurich vs. practitioner consensus on context files**: Axis 2 reports the ETH Zurich study finding AGENTS.md provides marginal benefit (+4% success, +19% cost for human-written; -3% success for LLM-generated). Yet nearly every practitioner guide (Anthropic, GitHub, Addy Osmani) treats context files as essential. Resolution appears to be that *content quality* matters — non-inferable, command-oriented rules help; prose overviews and boilerplate hurt. Both sides agree on this nuance.

2. **AI code quality improving vs. declining**: Axis 3 cites production incidents from AI-generated code increasing 43% year-over-year, while another source shows 81% quality improvement with proper verification layers. These are not directly contradictory (one measures teams without verification, the other with), but the interaction effect is unstudied. Axis 4 corroborates with Qodo data showing 81% improvement vs 55% without review infrastructure.

3. **Emphasis markers effectiveness**: Axis 2 notes Anthropic recommends `IMPORTANT` and `YOU MUST` markers to increase compliance, while the rules analysis community warns overuse causes "instruction fatigue." Both agree the technique works in moderation — the contradiction is about optimal dosage, not mechanism.

4. **Self-refinement effectiveness**: Axis 3 reports self-refinement cut code errors by 30% (Google Research, 2025) but also documents failure modes (reward hacking, oscillation, mode collapse, context overload) in the Ralph Wiggum Loop. The tension: self-refine works on average but fails catastrophically in specific scenarios.

## Unanswered Questions

1. **Quantified slop-type-specific metrics**: No axis provides measurement of specific slop categories (dead code %, unnecessary abstraction rate, boilerplate ratio) before vs. after applying prevention/cleanup techniques. All effectiveness data measures broader "code quality" or "task success rate" as proxies.

2. **Interaction effects between prevention layers**: No study examines whether combining multiple anti-slop techniques (hooks + minimal CLAUDE.md + spec-driven + TDD) produces additive, multiplicative, or diminishing returns. This is the "three-stage defense composition" question from the research context.

3. **Model-specific slop profiles**: Axis 1 notes hallucination rates vary from 5.2% (commercial) to 21.7% (open-source), but no comprehensive mapping of which slop types are produced by which models exists.

4. **Over-engineering / unnecessary abstraction detection**: Axes 1 and 4 both flag this as a major slop type but no tool specifically detects "premature abstraction" or "unnecessary design pattern application." Complexity metrics (cyclomatic complexity) are too coarse.

5. **Comment/documentation slop detection**: Axis 4 explicitly notes no tool targets verbose or redundant comments despite this being a common AI slop pattern (Axis 1 type #6).

## Thin Areas

1. **OpenSpec /opsx:verify behavior**: Axis 5 confirms this command exists but is entirely undocumented. Its anti-slop effectiveness cannot be assessed.

2. **Taskmaster quality gate specifics**: Claims of test-coverage, linting, and duplication modes appear in secondary sources but are not clearly documented in the primary repo.

3. **LLM-aided debloating research**: Axis 4 notes a 2025 IEEE TSE paper on "Large Language Models-aided program debloating" exists but was not accessible.

4. **Context pollution quantification**: Axis 3 cites a single source for the CP = 1 - S(anchor, current) formula. The "2% misalignment → 40% failure rate" claim needs independent verification.

5. **Hook frequency optimization**: No source addresses whether running linters on every Write|Edit vs. only at Stop is optimal.

## Citation Audit

### Unsourced Claims Detected
- No significant unsourced factual claims detected across the 5 axes.

### Coverage Summary
- Axis 1 (Taxonomy): All claims sourced (13+ sources)
- Axis 2 (Pre-Hoc): All claims sourced (15+ sources)
- Axis 3 (Ad-Hoc): All claims sourced (12+ sources)
- Axis 4 (Post-Hoc): All claims sourced (14+ sources)
- Axis 5 (Framework Mapping): All claims sourced (19+ sources)
- **Total: ~73 sources across all 5 axes**

No unsourced claims detected — all findings meet citation requirements.

## Follow-up Research Needed

**No — gaps are minor.** The unanswered questions represent genuine research opportunities rather than coverage gaps. The thin areas reflect actual documentation gaps in frameworks rather than insufficient research effort. All contradictions are documented with both sides sourced.
