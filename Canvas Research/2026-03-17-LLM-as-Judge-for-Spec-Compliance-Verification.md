# LLM-as-Judge for Spec Compliance Verification

The LLM-as-Judge paradigm has emerged as the primary method for verifying agent output against specification requirements, with 26 publications in software engineering applications by August 2025 alone — already surpassing the prior year's total [1][2]. Addy Osmani specifically recommends using a second agent to review the first agent's output against spec quality guidelines, a pattern Anthropic has validated for criteria that resist automated testing (code style, architectural patterns, naming conventions) [3]. Practical implementations use a hybrid approach: rule-based systems handle objective checks (syntax, naming, formatting) while LLM judges assess subjective quality dimensions like test coverage adequacy and code readability [1][4]. Multi-agent judge panels — where agents assume different roles (domain expert, critic, defender) — can incorporate diverse evaluation criteria. The key gap remains calibration: LLM judges can exhibit position bias, verbosity bias, and self-enhancement bias, requiring careful prompt engineering and reference-based grounding to produce reliable assessments [2].

## Sources
- [1] https://arxiv.org/html/2508.02994v1
- [2] https://www.evidentlyai.com/llm-guide/llm-as-a-judge
- [3] https://addyosmani.com/blog/good-spec/
- [4] https://www.confident-ai.com/blog/why-llm-as-a-judge-is-the-best-llm-evaluation-method
