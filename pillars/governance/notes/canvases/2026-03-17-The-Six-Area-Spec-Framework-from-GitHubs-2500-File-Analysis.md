# The Six-Area Spec Framework from GitHub's 2,500-File Analysis

GitHub's analysis of over 2,500 agent configuration files identified six essential areas that the most effective AI agent specs cover: Commands (full executable commands with flags like `npm test`, `pytest -v`), Testing (framework, file locations, coverage expectations), Project Structure (explicit directory mappings), Code Style (real code snippets over prose descriptions), Git Workflow (branch naming, commit format, PR requirements), and Boundaries (a three-tier system of Always Do / Ask First / Never Do) [1][2]. The three-tier boundary system was a standout finding — rather than a flat list of don'ts, top-performing specs stratified constraints into actions the agent should take autonomously, actions requiring human approval (e.g., modifying DB schemas), and hard stops (e.g., 'never commit secrets,' the single most common constraint in the dataset) [1][3]. HumanLayer research further suggests frontier LLMs degrade after ~150–200 instructions, recommending 5–6 phases of 30–50 requirements each rather than monolithic specs [4].

## Sources
- [1] https://addyosmani.com/blog/good-spec/
- [2] https://www.oreilly.com/radar/how-to-write-a-good-spec-for-ai-agents/
- [3] https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents
- [4] https://www.chatprd.ai/learn/prd-for-ai-codegen
