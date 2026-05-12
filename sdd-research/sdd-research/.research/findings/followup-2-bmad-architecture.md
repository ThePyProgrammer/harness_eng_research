# BMAD-METHOD Internal Architecture: Deep Dive

## 1. Agent Persona System

### 1.1 Agent Definition Structure (YAML Schema)

BMAD agents are defined as declarative YAML files (`*.agent.yaml`) that compile into executable markdown with embedded XML activation blocks. Each agent definition contains five primary sections:

**`metadata`** -- Identity and discovery properties:
- `id`: compiled output path (e.g., `_bmad/bmm/agents/pm.md`)
- `name`: character name (e.g., "John", "Winston", "Amelia")
- `title`: role title (e.g., "Product Manager", "System Architect")
- `icon`: emoji identifier
- `module`: parent module (e.g., `bmm`, `core`)
- `capabilities`: comma-separated capability string
- `hasSidecar`: whether persistent memory state is maintained

[Source: GitHub BMAD-METHOD src/bmm/agents/](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/bmm/agents)

**`persona`** -- The core prompt engineering payload with four fields:
- `role`: functional description (e.g., "Product Manager specializing in collaborative PRD creation through user interviews")
- `identity`: backstory establishing expertise depth (e.g., "Product management veteran with 8+ years launching B2B and consumer products")
- `communication_style`: behavioral directive controlling tone (e.g., "Asks 'WHY?' relentlessly like a detective on a case. Direct and data-sharp, cuts through fluff")
- `principles`: multi-line YAML block of behavioral constraints (e.g., "PRDs emerge from user interviews, not template filling")

[Source: PM agent YAML](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/agents/pm.agent.yaml)

**`critical_actions`** -- Startup instructions executed before any user interaction. The Developer agent (Amelia) has eight critical actions including: "READ the entire story file BEFORE any implementation", "Execute tasks/subtasks IN ORDER as written", and "NEVER lie about tests being written or passing". [Source: Dev agent YAML](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/agents/dev.agent.yaml)

**`menu`** -- Array of workflow triggers, each with:
- `trigger`: 2-letter code + fuzzy match string (e.g., `CP or fuzzy match on create-prd`)
- `exec`: path to workflow file with `{project-root}` variable
- `description`: human-readable menu item text
- Optional `data`: path to supplementary data files

**`prompts`** -- Reusable prompt templates with `id` and `content` fields. The QA agent (Quinn) includes a `welcome` prompt that explains capabilities and suggests when to use the agent vs. the advanced TEA module. [Source: QA agent YAML](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/agents/qa.agent.yaml)

### 1.2 Complete Agent Roster

**BMM Module (8 agents):**

| Agent ID | Name | Title | Communication Style |
|----------|------|-------|-------------------|
| analyst | Mary | Business Analyst | "Excitement of a treasure hunter" while maintaining analytical rigor |
| architect | Winston | System Architect | "Calm, pragmatic tones, balancing 'what could be' with 'what should be'" |
| dev | Amelia | Senior Implementation Engineer | "Ultra-succinct. Speaks in file paths and AC IDs. No fluff, all precision" |
| pm | John | Product Manager | "Asks 'WHY?' relentlessly like a detective on a case" |
| qa | Quinn | QA Engineer | "Practical and straightforward. 'Ship it and iterate' mentality" |
| quick-flow-solo-dev | Barry | Quick Flow Solo Dev | "Direct, confident. Uses tech slang. No fluff, just results" |
| sm | Bob | Scrum Master | "Crisp and checklist-driven. Zero tolerance for ambiguity" |
| ux-designer | Sally | UX Designer | "Paints pictures with words. Empathetic advocate with creative storytelling flair" |

[Source: BMAD-METHOD default-party.csv](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/teams/default-party.csv)

**Core Module (1 agent):**
- `bmad-master` -- "Master Task Executor, Knowledge Custodian, and Workflow Orchestrator" -- the meta-agent that lists tasks/workflows and orchestrates party mode. [Source: Core agents directory](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/core/agents)

**CIS Module (13 agents -- Creative/Innovation Suite):**
Includes Brainstorming Coach (Carson), Creative Problem Solver (Dr. Quinn), Design Thinking Coach (Maya), Innovation Strategist (Victor), Presentation Master (Spike), Storyteller (Sophia), and historical/archetype personas: Renaissance Polymath (Leonardo di ser Piero), Surrealist Provocateur (Salvador Dali), Lateral Thinker (Edward de Bono), Mythic Storyteller (Joseph Campbell), and Combinatorial Genius (Steve Jobs). [Source: default-party.csv](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/teams/default-party.csv)

**Confidence: HIGH** -- These are verbatim from repository source files.

### 1.3 Agent Compilation Pipeline

The compilation process (`tools/cli/lib/agent/compiler.js`) transforms YAML to IDE-ready markdown in six stages:

1. **Load & Parse** -- Read `.agent.yaml`, validate against Zod schema
2. **Apply Customizations** -- Deep-merge user overrides from `_bmad/_config/customizations/{module}/agents/{name}.yaml`
3. **Variable Resolution** -- Replace `{project-root}`, `{bmad-folder}`, `{planning_artifacts}`, `{implementation_artifacts}`
4. **Template Processing** -- Format persona and menu sections using formatting templates
5. **Activation Injection** -- Insert XML activation header with party mode detection, chat vs. command mode routing, menu invocation rules, and auto-help integration
6. **Markdown Output** -- Write compiled `.md` file to `_bmad/{module}/agents/`

[Source: DeepWiki Agent System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/3-agent-system) | [Source: DeepWiki Installation System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/5-installation-system)

**Confidence: HIGH** -- Confirmed through DeepWiki analysis of source code.

### 1.4 Customization System (Deep Merge)

Users override agent properties through `.customize.yaml` files in `_bmad/_config/agents/`. Two merge strategies apply:

- **Replace** (full overwrite): `agent.metadata`, `persona` -- "the persona section replaces the entire default persona, so include all four fields if you set it"
- **Append** (additive): `memories`, `menu`, `critical_actions`, `prompts`

Changes require running `npx bmad-method install` with the "Recompile Agents" option. The installer preserves `.customize.yaml` files across updates while overwriting compiled agent files. [Source: BMad Customization Guide](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/docs/how-to/customize-bmad.md)

**Confidence: HIGH** -- From official documentation.

---

## 2. Workflow System Architecture

### 2.1 Sharded Step-File Architecture

Workflows use a "micro-file architecture" where each workflow decomposes into:

- **Entry file** (`workflow.md` or `workflow-*.md`): contains frontmatter with `stepsCompleted` tracking array, initialization instructions, and references to step files
- **Step files** (`steps/step-01-init.md`, `steps/step-02-discovery.md`, etc.): individual instruction modules loaded just-in-time
- **Data files** (`data/`): CSV-driven configuration (e.g., `project-types.csv` with columns for `key_questions`, `required_sections`, `skip_sections`, `innovation_signals`)
- **Templates** (`templates/`): output document templates

[Source: DeepWiki Workflow System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/4-workflow-system)

### 2.2 Execution Control Mechanisms

**HALT Commands**: Every step file contains a HALT directive that prevents the AI from reading ahead. When encountered, the agent must pause and wait for user input. This is fundamental to the entire architecture -- it prevents context overflow and enforces disciplined progression.

**Frontmatter State Tracking**: The `stepsCompleted` array in YAML frontmatter records which steps have finished. After each step completes, the array updates (e.g., `stepsCompleted: [01, 02]`), enabling workflows to resume from interruptions.

**Gate Requirements**: Progression requires explicit user selection. The PRD creation workflow enforces: "ONLY proceed to next step when user selects 'C'" with "FORBIDDEN to load next step until user selects 'C'" -- and proceeding without user selection is classified as a "SYSTEM FAILURE".

**Read-Ahead Prevention**: Step files contain the explicit prohibition: "FORBIDDEN to look ahead to future steps or assume knowledge from them."

[Source: PRD step-01-init.md](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/workflows/2-plan-workflows/create-prd/steps-c/step-01-init.md)

### 2.3 Conditional Sharding (Multi-Mode Workflows)

The PRD workflow exemplifies conditional sharding with three step directories:
- `steps-c/` -- Create mode (15 steps from initialization through completion)
- `steps-v/` -- Validate mode (13-step validation process)
- `steps-e/` -- Edit mode (refinement of existing documents)

Each shard maintains its own step sequence while sharing the parent workflow's context and configuration variables. The workflow entry file detects which mode to use and routes to the appropriate step directory. [Source: DeepWiki Workflow System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/4-workflow-system) | [Source: GitHub PRD workflow directory](https://api.github.com/repos/bmad-code-org/BMAD-METHOD/contents/src/bmm/workflows/2-plan-workflows/create-prd)

**Confidence: HIGH** -- Confirmed through repository structure inspection.

### 2.4 Complete Workflow Map (20+ Workflows Across 4 Phases + Quick Flow)

**Phase 1 -- Analysis (Optional):**
- `bmad-brainstorming` --> `brainstorming-report.md`
- `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research` --> research findings
- `bmad-create-product-brief` --> `product-brief.md`

**Phase 2 -- Planning:**
- `bmad-create-prd` --> `PRD.md` (15 steps in create mode)
- `bmad-validate-prd` --> validation report
- `bmad-edit-prd` --> updated `PRD.md`
- `bmad-create-ux-design` --> `ux-spec.md`

**Phase 3 -- Solutioning:**
- `bmad-create-architecture` --> `architecture.md` with ADRs
- `bmad-create-epics-and-stories` --> epic files with stories
- `bmad-check-implementation-readiness` --> PASS/CONCERNS/FAIL gate decision

**Phase 4 -- Implementation:**
- `bmad-sprint-planning` --> `sprint-status.yaml`
- `bmad-create-story` --> `story-[slug].md`
- `bmad-dev-story` --> code + tests (10-step TDD workflow)
- `bmad-code-review` --> approval or feedback
- `bmad-correct-course` --> updated plan
- `bmad-sprint-status` --> status update
- `bmad-retrospective` --> learnings document

**Quick Flow (Parallel Track -- bypasses Phases 1-3):**
- `bmad-quick-spec` --> `tech-spec.md`
- `bmad-quick-dev` --> code + tests
- `bmad-quick-dev-new-preview` --> unified experimental flow

**Cross-Cutting:**
- `bmad-document-project` --> project documentation
- `bmad-generate-project-context` --> `project-context.md`
- `bmad-qa-generate-e2e-tests` --> end-to-end test suite

[Source: Workflow Map reference doc](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/docs/reference/workflow-map.md)

### 2.5 Artifact Flow (How Workflows Chain Together)

Workflows chain through **artifact dependency**, not explicit orchestration. Each phase produces documents that become inputs for the next phase:

- Phase 1 outputs (`product-brief.md`, research findings) feed into Phase 2
- Phase 2 outputs (`PRD.md`, `ux-spec.md`) feed into Phase 3
- Phase 3 outputs (`architecture.md`, epics) feed into Phase 4
- Phase 4 operates iteratively, with `sprint-status.yaml` tracking cycle state

The `bmad-help` skill provides contextual routing between phases. After workflow completion, agents auto-invoke `/bmad-help` which inspects project state and recommends next steps. This creates a continuous discovery loop without hard-coded workflow chaining.

The `bmad-check-implementation-readiness` workflow serves as a formal gate between solutioning and implementation, validating alignment between PRD, UX spec, architecture, and epics before allowing development to begin.

[Source: Workflow Map reference doc](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/docs/reference/workflow-map.md) | [Source: DeepWiki Architecture Overview](https://deepwiki.com/bmad-code-org/BMAD-METHOD)

**Confidence: HIGH** -- Well-documented in official sources.

---

## 3. Party Mode Implementation

### 3.1 Architecture

Party Mode is a **core module workflow** (`src/core/workflows/bmad-party-mode/workflow.md`) that uses "micro-file architecture with sequential conversation orchestration" across three steps: manifest loading, discussion orchestration, and graceful exit handling. [Source: Party Mode workflow](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/core/workflows/bmad-party-mode/workflow.md)

### 3.2 Agent Loading Process

1. Load configuration from `_bmad/core/config.yaml`
2. Parse `_bmad/_config/agent-manifest.csv` which contains all agent data: name, display name, title, icon, role, identity, communication style, principles, module, and file path
3. Build a complete in-memory agent roster from the CSV data
4. Each agent's personality is derived from "merged personality data" in the manifest

### 3.3 Orchestration Logic (How Agent Selection Works)

The BMad Master agent acts as orchestrator with the following selection intelligence:

- **Domain Analysis**: Analyzes user messages for domain requirements and identifies "2-3 most relevant agents for balanced perspective"
- **Direct Address**: When users address specific agents by name, that agent is prioritized with complementary agents added
- **Rotation**: Selection rotates to ensure diverse participation across the conversation
- **Character Consistency**: Agents maintain character using their documented communication styles, can reference each other naturally, and engage in cross-talk within discussion rounds
- **User Question Gate**: When an agent asks the user a direct question, "that response round immediately ends" -- waiting for user input before continuing
- **Moderation**: The bmad-master agent summarizes and redirects circular discussions

### 3.4 Team Bundles

Team configurations define which agents participate. The `team-fullstack.yaml` example:
```yaml
bundle:
  name: Team Plan and Architect
  icon: emoji-rocket
  description: Team capable of project analysis, design, and architecture.
agents:
  - analyst
  - architect
  - pm
  - sm
  - ux-designer
party: "./default-party.csv"
```

The `default-party.csv` contains the complete personality data for all 21+ agents across BMM and CIS modules, enabling any subset to be loaded for a party session. [Source: Team fullstack YAML](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/teams/team-fullstack.yaml)

### 3.5 Exit Handling

Exit triggers include: `*exit`, `goodbye`, `end party`, and `quit`. The system balances productivity with engagement based on conversation tone.

**Confidence: MEDIUM-HIGH** -- Party Mode workflow structure is confirmed from source; exact orchestration prompts within the workflow.md are summarized rather than shown verbatim due to fetch limitations.

---

## 4. Scale-Adaptive Intelligence

### 4.1 How It Actually Works

Despite marketing language about "automatic" scale adaptation, the investigation reveals that **scale adaptation is primarily a manual track selection mechanism**, not an automated complexity detection system. Users choose between two development pathways:

- **Full Lifecycle (4-Phase)**: Analysis --> Planning --> Solutioning --> Implementation. For "new application or significant feature" and "complex, multi-epic project" scenarios.
- **Quick Flow**: Bypasses Phases 1-3, consolidates roles into a single persona (Barry, the Quick Flow Solo Dev). For "bug fix, minor feature addition" and "brownfield addition to established patterns".

[Source: DeepWiki Planning Tracks](https://deepwiki.com/bmadcode/BMAD-METHOD/4.2-context-engineered-development-(ide))

### 4.2 Where Adaptation Does Occur

**Within the PRD workflow**, Step 7 (`step-07-project-type.md`) performs CSV-driven project-type classification. A `project-types.csv` file contains per-type configuration with:
- `key_questions` (discovery prompts tailored to project type)
- `required_sections` (which documentation sections to include)
- `skip_sections` (which to omit)
- `innovation_signals` (what to look for)

Project types include `api_backend` (emphasizes endpoints, authentication, schemas), `mobile_app` (platform requirements, offline capability), `saas_b2b` (multi-tenancy, enterprise integrations), and others. This dynamically adjusts the PRD content based on project classification. [Source: PRD step-07-project-type.md](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/workflows/2-plan-workflows/create-prd/steps-c/step-07-project-type.md)

### 4.3 User Skill Level Adaptation

The `bmm/module.yaml` configuration includes a `user_skill_level` selection (Beginner/Intermediate/Expert) that affects agent communication style. The Dev Story workflow specifies: "Skill level affects **tone only**, not code quality." Communication language and document output language are also configurable at the core module level.

[Source: BMM module.yaml](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/module.yaml) | [Source: Core module.yaml](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/core/module.yaml)

**Confidence: HIGH** (for the finding that it's manual track selection, not automated detection). The DeepWiki analysis explicitly states: "the decision appears manual -- users select their track during setup rather than the system automatically detecting project scope."

---

## 5. Prompt Engineering Patterns

### 5.1 Persona-Driven Behavioral Control

Each agent embeds four persona fields that collectively function as a system prompt. The pattern establishes:
- **Role**: What the agent does ("Senior Software Engineer")
- **Identity**: Why the agent is credible ("8+ years launching B2B and consumer products")
- **Communication Style**: How the agent speaks ("Ultra-succinct. Speaks in file paths and AC IDs")
- **Principles**: Behavioral constraints ("All existing and new tests must pass 100%")

This four-field pattern is consistent across all agents and represents the core prompt engineering approach.

### 5.2 Critical Actions Pattern

Beyond persona, some agents include `critical_actions` -- imperative instructions executed before any interaction. The Developer agent's eight critical actions demonstrate the pattern:

```
- "READ the entire story file BEFORE any implementation"
- "Execute tasks/subtasks IN ORDER as written in story file - no skipping, no reordering"
- "Mark task/subtask [x] ONLY when both implementation AND tests are complete and passing"
- "Run full test suite after each task - NEVER proceed with failing tests"
- "Execute continuously without pausing until all tasks/subtasks are complete"
- "NEVER lie about tests being written or passing - tests must actually exist and pass 100%"
```

These are stronger than principles -- they use imperative language with CAPS emphasis and explicitly forbid common LLM failure modes (like claiming tests pass without verification).

### 5.3 Facilitator Pattern (Anti-Generation Directive)

Workflow step files use an explicit anti-generation pattern: "YOU ARE A FACILITATOR, not a content generator" with "NEVER generate content without user input." This prevents the LLM from filling in answers autonomously and forces collaborative creation with the user.

### 5.4 HALT-and-Gate Execution Control

The most distinctive prompt engineering pattern is the HALT-and-gate system that prevents LLM read-ahead:
- Step files end with HALT commands
- Menu presentations require explicit user selection
- Unauthorized advancement is classified as "SYSTEM FAILURE"
- The instruction "FORBIDDEN to look ahead to future steps or assume knowledge from them" prevents speculative execution

### 5.5 Variable Resolution System

Path variables are resolved during compilation, creating portable agent definitions:
- `{project-root}` -- absolute project path
- `{bmad-folder}` -- installation directory name
- `{planning_artifacts}` -- output directory for phases 1-3
- `{implementation_artifacts}` -- output directory for phase 4
- `{communication_language}` -- user's preferred chat language
- `{document_output_language}` -- document output language
- `{user_skill_level}` -- beginner/intermediate/expert

### 5.6 Activation Header Injection

Every compiled agent receives an injected activation header containing:
- Party mode detection logic (collaborative vs. solo execution)
- Chat vs. command mode routing (natural conversation vs. slash command)
- Menu invocation rules (HALT before displaying options)
- Auto-help integration (invoke `/bmad-help` after workflow completion)

This header functions as the agent's initialization sequence and is injected by the compiler, not hand-written per agent. [Source: DeepWiki Agent System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/3-agent-system)

---

## 6. IDE Integration Layer

The `IdeManager` generates platform-specific command files from universal manifests:

- **Claude Code**: `.claude/commands/` -- standard markdown
- **Cursor**: `.cursor/commands/` -- standard markdown
- **GitHub Copilot**: `.github/agents/` -- split into `.agent.md` and `.prompt.md`
- **Rovo Dev**: `.rovodev/workflows/` -- YAML manifests
- **Windsurf, Gemini, Kiro**: platform-specific templates

Each IDE receives the same compiled agent content reformatted for its specific command system. The manifest system (`agents.csv`, `workflows.csv`, `tasks.csv`) provides the discovery layer that IDE generators consume. [Source: DeepWiki Installation System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/5-installation-system)

---

## 7. Module Ecosystem

Five official modules extend the core:

| Module | Code | Purpose |
|--------|------|---------|
| BMad Core | `core` | Help system, party mode, brainstorming, editorial review tasks |
| BMad Method | `bmm` | 8 agents, 20+ agile workflows, teams |
| BMad Builder | `bmb` | Custom agent and workflow creation |
| Test Architect Enterprise | `tea` | Risk-based testing, quality gates, enterprise test strategy |
| BMad Game Dev | `bmgd` | Game engine workflows (Unity/Unreal/Godot) |
| Creative Innovation Suite | `cis` | 13 creative/innovation agents |

[Source: BMAD-METHOD README](https://github.com/bmad-code-org/BMAD-METHOD) | [Source: Ry Walker Research](https://rywalker.com/research/bmad-method)

---

## 8. Key Unknowns

1. **Exact activation header content**: The XML activation block injected during compilation is described but its exact text has not been made visible. The `compileAgent()` function in `tools/cli/lib/agent/compiler.js` would reveal the precise prompt engineering, but this file was not directly accessible.

2. **Party Mode orchestration prompts**: The `workflow.md` for party mode (5,626 bytes) contains the actual orchestration instructions, but the full verbatim content was only available in summary form. The exact prompts that tell the LLM how to "select 2-3 relevant agents" and maintain character consistency remain partially opaque.

3. **Automated complexity detection specifics**: While "scale-adaptive intelligence" is prominently marketed, the investigation found it to be primarily manual track selection. Whether there is additional complexity-sensing logic embedded in step files or the help system beyond what was found in step-07-project-type.md is uncertain.

4. **Sidecar memory system**: The `hasSidecar` property exists in agent metadata, and `_memory/{agent}-sidecar/` directories are referenced in the architecture, but no agents in the BMM module currently use sidecars (`hasSidecar: false` on all). How sidecar persistent memory actually works when enabled is undocumented.

5. **CIS module agent definitions**: The 13 creative agents (including historical personas like Salvador Dali and Steve Jobs) are listed in the party CSV but their full YAML definitions and workflow integrations were not fetched.

6. **Zod validation schemas**: Agent YAML is validated against Zod schemas during compilation and in CI/CD, but the actual schema definitions were not examined. These would reveal the complete set of valid agent properties.

7. **Advanced Elicitation workflow**: Referenced in step menus as option "A (Advanced Elicitation)" and exists as `src/core/workflows/advanced-elicitation/` but its content was not examined. This appears to be a deeper discovery pattern used within other workflows.

---

## Sources

1. [BMAD-METHOD GitHub Repository](https://github.com/bmad-code-org/BMAD-METHOD)
2. [DeepWiki BMAD-METHOD Architecture](https://deepwiki.com/bmad-code-org/BMAD-METHOD)
3. [DeepWiki Agent System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/3-agent-system)
4. [DeepWiki Workflow System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/4-workflow-system)
5. [DeepWiki Installation System](https://deepwiki.com/bmad-code-org/BMAD-METHOD/5-installation-system)
6. [DeepWiki Planning Tracks](https://deepwiki.com/bmadcode/BMAD-METHOD/4.2-context-engineered-development-(ide))
7. [PM Agent YAML (raw)](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/agents/pm.agent.yaml)
8. [Dev Agent YAML (raw)](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/agents/dev.agent.yaml)
9. [QA Agent YAML (raw)](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/agents/qa.agent.yaml)
10. [Scrum Master Agent YAML (raw)](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/agents/sm.agent.yaml)
11. [Party Mode Workflow (raw)](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/core/workflows/bmad-party-mode/workflow.md)
12. [default-party.csv (raw)](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/teams/default-party.csv)
13. [Team Fullstack YAML (raw)](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/teams/team-fullstack.yaml)
14. [Workflow Map Reference](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/docs/reference/workflow-map.md)
15. [Customization Guide](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/docs/how-to/customize-bmad.md)
16. [Party Mode Documentation](https://docs.bmad-method.org/explanation/party-mode/)
17. [Ry Walker BMAD Research](https://rywalker.com/research/bmad-method)
18. [Applied BMAD - Benny Cheung](https://bennycheung.github.io/bmad-reclaiming-control-in-ai-dev)
19. [BMAD Agents Reference](https://docs.bmad-method.org/reference/agents/)
20. [PRD step-01-init.md (raw)](https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/src/bmm/workflows/2-plan-workflows/create-prd/steps-c/step-01-init.md)
