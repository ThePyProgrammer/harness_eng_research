# Production Harness Security Implementations

**Research Dimension**: R3 -- How production AI coding harnesses implement security structurally  
**Date**: 2026-04-03  
**Scope**: OpenAI Codex, Anthropic Claude Code, Cursor, Devin, Spotify Honk, GSD, RAPID, Aider, Amazon Q Developer

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [OpenAI Codex](#2-openai-codex)
3. [Anthropic Claude Code](#3-anthropic-claude-code)
4. [Cursor](#4-cursor)
5. [Devin (Cognition)](#5-devin-cognition)
6. [Spotify Honk](#6-spotify-honk)
7. [GSD Harness](#7-gsd-harness)
8. [RAPID Harness](#8-rapid-harness)
9. [Aider](#9-aider)
10. [Amazon Q Developer](#10-amazon-q-developer)
11. [Convergent Security Patterns](#11-convergent-security-patterns)
12. [Comparison Tables](#12-comparison-tables)
13. [Key Findings and Gaps](#13-key-findings-and-gaps)
14. [Sources](#14-sources)

---

## 1. Executive Summary

This research surveys the security architectures of nine production AI coding harnesses, examining how each bounds agent capabilities, isolates execution, manages credentials, and enforces safety invariants. The central finding is a convergence toward **layered structural enforcement**: OS-level sandboxing (bubblewrap, Seatbelt, Landlock/seccomp), network isolation (disabled-by-default egress, domain allowlists, proxy-mediated access), and credential separation (secrets injected at the tool/runtime layer, never exposed in the agent's prompt context).

Three tiers of security maturity emerge:

1. **Structurally enforced** (Codex Cloud, Claude Code sandboxed, Devin VPC, Spotify Honk): Security boundaries exist in code and OS primitives; the agent cannot bypass them regardless of prompt manipulation.
2. **Hybrid structural-instructional** (Codex CLI, Claude Code default, Cursor, Amazon Q Developer): Some boundaries are structural (filesystem sandboxing), others depend on approval prompts or model-based classifiers that can be circumvented.
3. **Instructional or absent** (Aider, GSD v1, RAPID v1): Security relies on user judgment, git safety nets, or no explicit security model at all.

The strongest pattern across harnesses: **credential injection at the tool level, not the prompt level**. Codex removes secrets before the agent phase. Claude Code's web proxy translates scoped tokens into real credentials outside the sandbox. Devin encrypts secrets per-session and redacts them from the frontend. The harnesses that fail to implement this pattern (Aider, early Devin, Cursor pre-sandbox) have all experienced credential exfiltration incidents.

---

## 2. OpenAI Codex

### 2.1 Architecture Overview

Codex operates in two distinct modes with substantially different security postures:

- **Codex Cloud**: Tasks run in isolated, OpenAI-managed containers with a two-phase runtime model (setup phase with network access, agent phase with network disabled by default).
- **Codex CLI**: Local execution with OS-level sandboxing via platform-native primitives.

### 2.2 Container Isolation (Cloud)

Each cloud task proceeds through distinct phases:

1. **Container creation**: Codex creates a container and checks out the repo at the selected branch/commit SHA.
2. **Setup execution**: Runs the user's setup script with full internet access for dependency installation. Secrets are available during this phase.
3. **Agent execution**: The agent runs terminal commands in a loop, editing code and validating work. **Internet access is disabled by default.** Secrets are removed before this phase starts.

This phase separation is a critical structural enforcement: even if the agent is compromised via prompt injection during the agent phase, it has no network access to exfiltrate data and no secrets to steal. The boundary is enforced at the container level, not by instructions.

**Enforcement type**: Structural (container-level network isolation, secret removal)

### 2.3 Network Restrictions (Cloud)

When internet access is optionally enabled during the agent phase, Codex provides layered controls:

- **Domain allowlist**: Three presets -- None (manual addition only), Common Dependencies (~60+ domains covering npm, PyPI, GitHub, Maven, Docker Hub, etc.), and All (unrestricted).
- **HTTP method restrictions**: Only GET, HEAD, and OPTIONS are permitted by default. POST, PUT, PATCH, DELETE are blocked, preventing write operations to external services.
- **Proxy-mediated egress**: All outbound traffic passes through a managed proxy for security and abuse prevention.

**Enforcement type**: Structural (proxy enforcement, method filtering at network layer)

### 2.4 CLI Sandboxing

Codex CLI uses platform-native security primitives:

| Platform | Technology | Mechanism |
|----------|-----------|-----------|
| macOS | Seatbelt (sandbox-exec) | Mode-specific profiles compiled at runtime, enforced by kernel |
| Linux | Landlock + seccomp + bubblewrap | Filesystem restrictions via Landlock, syscall filtering via seccomp, namespace isolation via bubblewrap |
| Windows | Native Windows sandbox / WSL2 | OS-level egress rules with proxy-only networking |

Three sandbox modes define filesystem access:

- **read-only**: Agent can only inspect files; edits and commands require approval.
- **workspace-write** (default): Agent can read files, edit within the workspace, and run routine local commands inside the boundary.
- **danger-full-access**: Removes all filesystem and network restrictions.

Protected paths (`.git`, `.codex`, `.agents`) remain read-only even in workspace-write mode.

**Enforcement type**: Structural (OS kernel enforcement)

### 2.5 Credential Management

Codex implements a two-tier environment variable system:

- **Environment variables**: Available throughout the entire task duration (setup + agent phases).
- **Secrets**: Stored with an additional encryption layer, decrypted only for task execution, and **removed before the agent phase starts**. This is the cleanest implementation of "inject at tool level, not prompt level" observed across all harnesses.

The `shell_environment_policy` configuration provides fine-grained control:

- `inherit`: Baseline inheritance (`all`, `core`, or `none`)
- `include_only`: Whitelist-based variable filtering
- `exclude`: Glob patterns for removing specific variables

**Credential injection pattern**: Yes, fully implemented. Secrets never reach the agent context.

### 2.6 Approval Policy

Three approval levels complement the sandbox:

- **on-request**: Interactive runs pause for approval on sandbox-crossing operations.
- **untrusted**: Auto-runs safe read operations; prompts for state-mutating commands. MCP/app tools with "destructive" annotations always require approval.
- **never**: Non-interactive execution without prompts (intended for CI/automated pipelines).

The `--yolo` flag (alias for `--dangerously-bypass-approvals-and-sandbox`) removes all restrictions and is explicitly labeled as unsafe.

### 2.7 Known Vulnerabilities

- **CVE (Feb 2026)**: GitHub token vulnerability in Codex CLI/SDK/IDE Extension, patched February 5, 2026. Demonstrated that even structurally enforced systems can have implementation gaps.
- **Environment variable leakage**: Early versions relied on environment variables alone for proxy enforcement on Windows; now uses OS-level egress rules.

### 2.8 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| Container isolation (cloud) | Structural | Agent cannot access host system |
| Network disabled by default | Structural | Agent cannot exfiltrate data |
| Domain allowlist + HTTP method filter | Structural | Egress limited to approved domains/methods |
| Secret removal before agent phase | Structural | Agent never sees credentials |
| OS sandbox (CLI) | Structural | Filesystem/network/syscall restrictions |
| Approval policy | Hybrid | Human gate for boundary-crossing operations |

---

## 3. Anthropic Claude Code

### 3.1 Architecture Overview

Claude Code implements a multi-layered permission architecture with three operating modes and two distinct deployment contexts (local CLI and cloud/web). The security model has evolved significantly through 2025-2026, with the March 2026 introduction of auto mode adding a model-based classifier layer.

### 3.2 Permission Modes

**Manual approval (default)**: Claude Code uses strict read-only permissions by default. Editing files, running tests, and executing commands require explicit user approval. A fixed allowlist covers non-mutating tools: file reads, text/file-pattern search, code navigation, and plan-mode transitions.

**Auto mode**: Introduced March 2026 for Enterprise and API users. A model-based transcript classifier (running on Sonnet 4.6) evaluates each action before execution, replacing human approval for routine operations. Operates in two stages:

1. **Stage 1 (fast filter)**: Single-token yes/no classification, biased toward blocking. Catches 91.5% of safe actions without further analysis.
2. **Stage 2 (chain-of-thought)**: Full reasoning applied only to flagged actions, reducing the false positive rate from 8.5% to 0.4%.

The classifier sees only user messages and bare tool calls; Claude's own messages and tool outputs are stripped to prevent the agent from generating persuasive rationalizations that manipulate the classifier.

**Bypass mode** (`--dangerously-skip-permissions`): Executes all operations without approval. Intended for isolated/containerized environments only.

**Enforcement type**: Auto mode is instructional-structural hybrid (model-based classifier can be fooled, but defense-in-depth with input scanning reduces risk). Manual mode is human-gated. Bypass mode has no enforcement.

### 3.3 Sandboxing Architecture

Claude Code's sandbox creates two structural boundaries:

**Filesystem isolation**: OS-level controls restrict file access to designated directories. Built on:
- Linux: bubblewrap
- macOS: Seatbelt (sandbox-exec)

Write access is confined to the directory where Claude Code was started and its subfolders. Parent directories are read-only. Version 2.1.78 (Feb 2026) added protection for `.git/` and `.claude/` directories, triggering prompts even in bypass mode.

**Network isolation**: The sandbox ensures Claude can only connect to approved servers. Network requests require user approval by default.

Both mechanisms operate together by design. As the engineering blog notes: "Without network isolation, a compromised agent could exfiltrate sensitive files like SSH keys; without filesystem isolation, a compromised agent could easily escape the sandbox and gain network access."

**Enforcement type**: Structural (OS-level primitives enforce restrictions on all spawned commands, scripts, and subprocesses)

### 3.4 Credential Management

**Local CLI**: API keys and tokens are encrypted via the OS keychain or file-based credential store (`cli_auth_credentials_store` setting). The command blocklist blocks `curl` and `wget` by default to prevent credential exfiltration via network requests.

**Cloud/Web**: Authentication uses a secure proxy that translates a scoped credential inside the sandbox into the user's actual GitHub authentication token. Signing keys and credentials never enter the sandbox. The proxy validates credentials and git commands (including branch restrictions) before authenticating with GitHub.

This proxy architecture is the strongest implementation of "inject at tool level" across the surveyed harnesses, because the agent operates with a limited-scope token that has no value outside the proxy-mediated context.

**Credential injection pattern**: Yes, fully implemented in cloud mode. Partially implemented in local mode (credentials exist on-disk but are encrypted; the blocklist is an instructional/heuristic defense).

### 3.5 Auto Mode Safeguards

The auto mode classifier detects four threat categories:

1. **Destroy or Exfiltrate**: Force-pushes, mass deletions, unauthorized data transmission
2. **Degrade Security**: Disabling logging, installing persistence, modifying permissions
3. **Cross Trust Boundaries**: Running external code, scanning credential stores, unsanctioned service access
4. **Bypass Review**: Direct main-branch pushes, production deploys without authorization

Performance on real employee traffic (n=10,000):
- False positive rate: 0.4% (full pipeline)
- False negative rate: 17% (on n=52 genuinely dangerous actions)

The 17% miss rate is significant and acknowledged; it reflects cases where the classifier correctly identifies danger but misinterprets whether user consent covers the specific blast radius.

**Input-layer defense**: A server-side prompt-injection probe scans tool outputs before they reach the agent's context, adding warnings when hostile content is detected.

### 3.6 Hooks as Structural Enforcement

Claude Code hooks provide deterministic, code-based enforcement:

- **PreToolUse hooks**: Fire before any tool action. Can approve (exit 0), warn (exit 1), or **deny** (exit 2) the action.
- **Common patterns**: Blocking `rm -rf /`, `git push --force main`, `git reset --hard`, `DROP TABLE`, and custom migration commands.
- **JSON decision output**: Hooks can return structured `{ "permissionDecision": "deny", "reason": "..." }` responses.

This is true structural enforcement: the hook is code that runs deterministically before the tool call, independent of the model's reasoning.

### 3.7 Known Vulnerabilities

- **CVE (Feb 2026)**: Check Point Research disclosed critical vulnerabilities where the agent could read embedded instructions, access credentials, and send them to attacker-controlled endpoints.
- **MCP server prompt injection**: Malicious MCP servers can inject instructions via tool descriptions in the system prompt. Mitigation: isolated context windows for web fetch, trust verification for new MCP servers.

### 3.8 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| OS sandbox (bubblewrap/Seatbelt) | Structural | Filesystem + network isolation |
| Write access restriction | Structural | Writes confined to project directory |
| Protected paths (.git/, .claude/) | Structural | Config files protected even in bypass mode |
| Command blocklist (curl, wget) | Hybrid | Blocks common exfiltration commands |
| Auto mode classifier | Instructional | Model-based approval with 17% FN rate |
| Prompt injection probe | Instructional | Server-side scanning of tool outputs |
| PreToolUse hooks | Structural | Deterministic code-based deny/allow |
| Cloud proxy credential isolation | Structural | Real credentials never enter sandbox |

---

## 4. Cursor

### 4.1 Architecture Overview

Cursor rolled out agent sandboxing across macOS, Linux, and Windows in early 2026, replacing a previous allow-list-based approval system. The new model allows sandboxed agents to operate freely within controlled boundaries, requesting permission only when accessing external resources (primarily the internet).

### 4.2 Platform Implementations

| Platform | Technology | Notes |
|----------|-----------|-------|
| macOS | Seatbelt (sandbox-exec) | Dynamically generated profiles based on workspace settings and `.cursorignore` |
| Linux | Landlock + seccomp | Overlays filesystem, rewrites ignored files as read-only Landlock copies |
| Windows | Linux sandbox in WSL2 | Native Windows sandboxing targets browsers, not developer tools |

Cursor evaluated App Sandbox (rejected: requires signing every binary), containers (rejected: limits to Linux binaries), and VMs (rejected: unacceptable performance overhead) before selecting Seatbelt for macOS.

### 4.3 Access Controls

**Filesystem**: The agent has **read access to the entire filesystem** but write access only to the current project directory. Configuration files (`.vscode`, `.cursor`, `.code-workspace`, `.cursorignore`, `.git/config`, `.git/hooks`) are denied write access.

**Network**: Agents operate with restricted network access by default. Escalation (primarily for internet access) surfaces explicit sandbox constraint information and recommends permission elevation.

**Agent awareness**: Shell tool descriptions now explain sandbox constraints. Agents learn which commands run with filesystem, git, or network access based on user settings.

### 4.4 The Credential Leakage Problem

Cursor's sandbox has a fundamental design tension: broad filesystem read access is necessary because tools like npm internally read `~/.npmrc` via filesystem syscalls. However, this same read access exposes credentials stored in home directory dotfiles:

- `~/.npmrc` (npm authentication tokens)
- `~/.ssh/` (SSH keys)
- `~/.aws/credentials` (AWS credentials)
- `~/.docker/config.json` (Docker registry tokens)
- `~/.gitconfig` (Git credentials)

Critically, `.cursorignore` only protects against direct file reads by Cursor's file-reading tools. The agent can bypass this by running shell commands like `cat ~/.npmrc`, which execute within the sandbox's read-permitted scope and expose output to the LLM.

This was documented in November 2025 by Luca Becker and characterized as "a regression disguised as an improvement" for security-conscious users who maintained careful allow-lists under the previous system.

### 4.5 Known Vulnerabilities

- **CVE-2026-22708**: Critical flaw where shell built-in commands (`export`, `declare`, `typeset`, `unset`, `readonly`, `local`) execute without user approval, even with empty allowlists. Enables environment variable manipulation, PAGER hijacking, Python warning chain exploitation, and persistent `.zshrc` injection. Patched January 2026.
- **Malicious npm packages (May 2025)**: Three packages targeting Cursor downloaded 3,200+ times, harvesting Cursor credentials and fetching remote payloads.
- **MCP server credential exfiltration**: Malicious MCP tools use embedded prompt injections to silently read SSH keys, AWS credentials, npm tokens, and environment secrets.

### 4.6 Approval Fatigue Analysis

Cursor's production data (February 2026) shows sandboxing reduces developer interruptions by 40% compared to unsandboxed workflows. However, the previous allow-list system offered more granular control. The new sandbox model is binary: either the agent operates within the sandbox (with broad read access) or the user must manually approve every command.

**Credential injection pattern**: Not implemented. Credentials exist as readable files on the host filesystem. The agent has direct read access to credential stores.

### 4.7 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| OS sandbox (Seatbelt/Landlock/seccomp) | Structural | Filesystem write + network restrictions |
| .cursorignore | Hybrid | Protects direct reads but not shell bypass |
| Write-deny on config files | Structural | Prevents agent from modifying IDE/git config |
| Network escalation prompt | Instructional | Human gate for internet access |
| Agent sandbox awareness | Instructional | Model told about constraints (can be ignored) |

---

## 5. Devin (Cognition)

### 5.1 Architecture Overview

Devin is a fully autonomous cloud-hosted coding agent that operates within sandboxed VMs. Each session spins up a dedicated VM with a shell, editor, and browser. The architecture separates the DevBox (execution environment, optionally in customer VPC) from the Brain (intelligence layer in Cognition's tenant).

### 5.2 VM Isolation

- Each Devin session requires a **new, dedicated VM**, preventing cross-session contamination.
- AWS deployments use i3 bare metal EC2 instances; Azure uses Lasv3 instances.
- The DevBox-Brain separation provides an "entirely stateless system guarantee" -- no customer data is stored at rest outside the customer's environment in VPC deployments.
- Isolated Brain containers are created per session with specific authorization credentials.

**Enforcement type**: Structural (hardware-level VM isolation per session)

### 5.3 Credential Management

Devin provides a built-in Secrets vault:

1. Secrets are encrypted at rest with AES-256 and customer-managed KMS keys.
2. At session start, isolated Brain containers decrypt secrets and load them as environment variables.
3. Secrets are re-encrypted programmatically after loading.
4. Frontend displays show `[REDACTED SECRET]` for all secret values.
5. Session-scoped secrets are supported via the v3 API for automated workflows.

The vault is lightweight, comparable to GitHub Actions secrets or Vercel Environment Variables, but scoped to Devin's cloud workspaces.

### 5.4 Network Architecture

- Communication flows exclusively through HTTPS/443 outbound from the customer VPC.
- A WebSocket connection to an isolated container in Cognition's tenant handles all interactions.
- AWS WAF protects public frontend APIs.
- **Critical gap**: Devin has **unrestricted internet access by default**. This has been exploited for data exfiltration.

### 5.5 Known Vulnerabilities

Research from April-August 2025 documented four primary exfiltration vectors:

1. **Shell tool exploitation**: Prompt-injected instructions in GitHub issues cause Devin to execute `curl`/`wget` commands transmitting environment variables to attacker servers.
2. **Browser tool abuse**: Navigation to attacker-controlled URLs with sensitive data appended as parameters.
3. **Markdown image rendering**: Untrusted domains deliver images with embedded data-exfiltration requests.
4. **Slack integration tricks**: Invisible Unicode characters encode secrets within hyperlinks.

The root cause, as identified by the researchers: Devin "over-relies on the model doing the right thing" rather than enforcing architectural network controls. The recommendation to inject secrets via the environment variable manager (not chat prompts) is an instructional defense, not a structural one, because the agent can still read environment variables and transmit them over the unrestricted network.

**Credential injection pattern**: Partially implemented. Secrets are injected as environment variables (not in prompts), but the agent can read them, and unrestricted network access allows exfiltration.

### 5.6 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| Per-session VM isolation | Structural | Cross-session contamination prevented |
| DevBox-Brain separation | Structural | Stateless guarantee for customer data |
| Secrets vault (encrypted, redacted) | Hybrid | Encrypted at rest, but available as env vars at runtime |
| AES-256 + KMS encryption | Structural | Data protection at rest and in transit |
| Network access | **Absent** | Unrestricted by default; no egress controls |
| Repository access scoping | Instructional | User selects which repos Devin can access |

---

## 6. Spotify Honk

### 6.1 Architecture Overview

Honk is Spotify's internal background coding agent, built on Claude Code and Claude Agent SDK. It has generated 1,500+ merged pull requests across Spotify's codebase, handling language modernization and configuration changes with 60-90% time savings.

Honk's security philosophy is **bounded capability through simplicity**: the agent is deliberately limited in tools and access, making entire classes of misuse impossible by design.

### 6.2 Container Isolation

"The agent runs in a container with limited permissions, few binaries, and virtually no access to surrounding systems. It's highly sandboxed."

Complex operations that could be security-sensitive are handled **outside** the agent by surrounding infrastructure:
- Pushing code to repositories
- Interacting with users on Slack
- Prompt authoring and injection

This architectural separation means the agent never touches credentials for git push, Slack, or other external services.

### 6.3 Allowlisted Shell Commands

The Bash tool exposes a **strict allowlist** of commands:

- `ripgrep` (rg) for code search
- Custom MCP integration for running formatters, linters, and tests (the "Verify" tool)
- Git tool with **limited and standardized access** -- notably, the agent can **never push or change origin**

The agent does **not** have access to:
- Code search tools (beyond ripgrep)
- Documentation tools
- Dynamic context fetching mechanisms
- General-purpose shell commands

"The more tools you have, the more dimensions of unpredictability you introduce."

### 6.4 Verification as Security Layer

Honk's verification loop serves dual purposes (quality and security):

- Verifiers activate automatically based on detected project files (e.g., Maven detects `pom.xml`).
- An **LLM judge layer** evaluates diffs against original prompts, rejecting approximately 25% of proposals when agents exceed their instructions.
- All relevant verifiers must pass before a PR is created; failures prevent PR opening.

This creates a structural enforcement point: even if the agent produces unexpected code, the verification pipeline gates the output.

### 6.5 Credential Management

Honk follows the "inject at tool level" pattern through architectural separation:
- Git push credentials are managed by surrounding infrastructure, not the agent.
- Slack tokens are held by the orchestration layer.
- The agent operates within a container that simply does not have access to these credentials.

**Credential injection pattern**: Yes, fully implemented through architectural separation. The agent never possesses credentials for external services.

### 6.6 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| Container with limited binaries | Structural | Agent cannot access surrounding systems |
| Allowlisted shell commands | Structural | Only approved commands executable |
| No git push capability | Structural | Agent cannot modify remote repositories |
| External credential management | Structural | Credentials managed outside agent boundary |
| LLM judge verification | Instructional | 25% rejection rate for scope-exceeding changes |
| Verifier gate before PR | Structural | Code changes must pass all checks before merging |

---

## 7. GSD Harness

### 7.1 Architecture Overview

GSD (Get Shit Done) is a meta-prompting and spec-driven development harness for Claude Code. GSD v1 operates as a Claude Code skill/extension; GSD v2 is a standalone CLI built on the Pi SDK with direct TypeScript access to the agent harness.

GSD's security model is primarily based on **context isolation** and **sub-agent specialization** rather than OS-level sandboxing.

### 7.2 Fresh Context Per Task

GSD's auto mode creates a fresh agent session with a clean 200k-token context window for each task. Relevant files are pre-inlined into the prompt at dispatch time. This architectural choice:

- Prevents credential leakage between tasks (each session starts clean)
- Limits the blast radius of any single compromised session
- Ensures the agent only sees context relevant to its specific task

GSD v2 provides programmatic control over context clearing via TypeScript, making this a structural enforcement (the runtime clears the context, not an instruction to the model).

### 7.3 Sub-Agent Isolation ("Context Firewall")

Sub-agents (gsd-executor, gsd-verifier, gsd-researcher) operate with:

- **Schema filtering at build time**: Each sub-agent's tool allowlist is defined at the schema level. The sub-agent never sees tools outside its allowlist.
- **Fresh context per invocation**: `message_history=None` ensures each sub-agent starts with a clean context window.
- **Result condensation**: Only condensed results flow back to the parent agent, preventing intermediate noise and credential fragments from leaking upward.

This creates a "context firewall" where discrete tasks run in isolated context windows.

### 7.4 Read-Only Evaluator Pattern

GSD's evaluator agents operate with restricted tool access:

- The Planner sub-agent explores the codebase using **read-only tools only**: reading files, searching code, listing directory contents, and resolving symbol definitions.
- Quality gates with 8-question evaluators are added to planning and completion templates.
- Verification sub-agents run formatters, linters, and tests but cannot modify source code.

This is a form of least-privilege enforcement at the tool schema level.

### 7.5 Credential Handling

GSD inherits Claude Code's credential handling. It does not add additional credential management beyond:
- Forcing `RTK_TELEMETRY_DISABLED=1` for all managed invocations
- Allowing environment variable configuration via `GSD_RTK_DISABLED=1`

**Credential injection pattern**: Inherited from Claude Code. No additional separation layer.

### 7.6 Known Limitations

- **Supply chain risk**: The npm package (get-shit-done-cc) has write access to Claude's configuration directories during installation. A compromised package could inject malicious configurations.
- **No OS-level sandboxing**: GSD relies entirely on Claude Code's sandboxing infrastructure. It adds context-level isolation but not process-level or filesystem-level restrictions.
- **Instructional tool scoping**: While tool allowlists are defined at the schema level, the enforcement depends on the SDK runtime rather than OS primitives.

### 7.7 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| Fresh context per task | Structural (runtime) | Cross-task credential leakage prevented |
| Sub-agent schema filtering | Structural (SDK) | Tools restricted per agent role |
| Read-only evaluator tools | Structural (SDK) | Evaluators cannot modify source code |
| Context firewall (condensed results) | Structural (runtime) | Intermediate state does not leak to parent |
| npm package write access | **Gap** | Supply chain attack vector |

---

## 8. RAPID Harness

### 8.1 Architecture Overview

RAPID is a set-based parallel development harness that uses git worktrees for filesystem isolation, structured contracts for file access scoping, and merge-time validation for quality gates. It operates as a Claude Code skill system.

### 8.2 Worktree Isolation

Each RAPID "set" (a unit of parallel work) operates in its own git worktree:

- Worktrees provide **independent working directories** sharing the same repository history.
- Each agent session gets its own copy of the codebase in a separate filesystem path.
- Changes in one worktree cannot accidentally affect another.
- Worktrees are automatically cleaned up when the sub-agent finishes without changes.

This isolation is structural at the filesystem level: git worktrees are a git primitive, not an instruction to the model.

### 8.3 CONTRACT.json and File Access Patterns

RAPID uses structured contracts to scope file access:

- Each set defines which files and directories the agent is permitted to modify.
- The contract restricts the agent's write scope to specific patterns relevant to the task.
- File access outside the contract triggers validation failures.

This creates a least-privilege boundary: even though the agent has the technical capability to modify any file in the worktree, the harness validates that modifications stay within the contracted scope.

### 8.4 Merge-Time Validation

RAPID implements multi-level conflict detection and validation at merge time:

- **Textual conflict detection**: Standard git merge conflicts.
- **Structural conflict detection**: AST-level analysis for semantic conflicts.
- **Dependency conflict detection**: Package/dependency graph analysis.
- **API conflict detection**: Interface compatibility checks.
- **Semantic conflict detection**: Behavioral compatibility analysis.

The merge pipeline uses DAG-ordered merging, bisection recovery, and rollback capabilities. This creates a structural gate: even if an agent produces valid code within its worktree, it must pass merge validation before reaching the main branch.

### 8.5 Credential Handling

RAPID inherits Claude Code's credential handling. The worktree model provides an additional layer of separation: each worktree operates independently, reducing the surface for credential sharing between parallel agents.

**Credential injection pattern**: Inherited from Claude Code. Worktree isolation adds a filesystem-level boundary but no additional credential separation.

### 8.6 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| Git worktree isolation | Structural (git) | Filesystem separation between parallel agents |
| CONTRACT.json file scoping | Hybrid | Agent writes validated against contract |
| 5-level merge conflict detection | Structural | Conflicts caught before reaching main branch |
| DAG-ordered merge + rollback | Structural | Safe integration with recovery capability |
| Automatic worktree cleanup | Structural | No stale state between sessions |

---

## 9. Aider

### 9.1 Architecture Overview

Aider is an open-source AI pair programming tool operating in the terminal. It takes a fundamentally different approach to security: **it has none**. There is no sandboxing, no permission model, and no approval system. The agent modifies files directly based on user instructions.

### 9.2 Security Posture

Aider's security characteristics:

- **No sandbox**: Files are modified directly on the host filesystem with the user's full permissions.
- **No permission model**: No approval required for file modifications.
- **No network restrictions**: The agent communicates with LLM APIs; no restrictions on what it can access.
- **No credential isolation**: API keys are configured via environment variables (`.env` files) or CLI arguments.

### 9.3 Git Integration as Safety Net

Aider's primary safety mechanism is git integration:

- Every AI-suggested code change gets an automatic commit with a clear message.
- Users can easily revert changes via `git reset` or `git checkout`.
- The `--no-auto-commits` flag disables this, though it's not recommended.

This is a **recovery mechanism**, not a prevention mechanism. It cannot prevent credential leakage, unauthorized network access, or destructive operations.

### 9.4 Local-First Privacy

Aider supports local model execution via Ollama and OpenAI-compatible API endpoints, enabling air-gapped deployment for teams requiring data sovereignty. This eliminates the risk of code being sent to third-party model providers.

### 9.5 Known Limitations

- No protection against prompt injection
- No protection against credential exfiltration
- No protection against destructive file operations
- No audit trail beyond git commits
- File watcher added `ignore_permission_denied` option to prevent errors on restricted files, but this is a usability fix, not a security control

**Credential injection pattern**: Not implemented. API keys exist in `.env` files readable by the agent.

### 9.6 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| Git auto-commit | Recovery | Changes can be reverted after the fact |
| Local model support | Structural (optional) | Code stays local when configured |
| None (filesystem) | Absent | Full host filesystem access |
| None (network) | Absent | No egress restrictions |
| None (credentials) | Absent | No credential isolation |

---

## 10. Amazon Q Developer

### 10.1 Architecture Overview

Amazon Q Developer is AWS's AI coding assistant with autonomous agentic capabilities. Its security model centers on AWS's shared responsibility model, IAM integration, and sandbox execution for code generation.

### 10.2 Sandbox Execution

The autonomous agent executes code within an **isolated, managed sandbox environment**:

- The sandbox is configured **without credentials to access non-public internet resources**.
- Developers can use custom Docker images preloaded with dependencies.
- Shell commands execute based on a curated list specified in a **Devfile** configuration.
- The Devfile models development environment configuration and dependencies.

### 10.3 Security Controls

- **Security scanning**: Detects hard-to-identify vulnerabilities including exposed credentials and log injection attacks, with one-click remediation.
- **Plan approval**: The agent generates a plan, and the user reviews before execution.
- **IAM integration**: Inherits AWS IAM for authentication and authorization.
- **Amazon Bedrock controls**: Security controls from the underlying Bedrock platform.
- **Data isolation (Pro plan)**: No training on customer inputs.

### 10.4 Network and Execution Boundaries

- **Devfile-scoped commands**: The agent can only run commands specified in the Devfile configuration, providing a form of command allowlisting.
- **Credential-free sandbox**: The execution environment has no credentials for non-public resources.
- **Real-time code execution**: Code runs in the sandbox during generation to validate correctness.

### 10.5 Known Limitations

- Public documentation on the specific isolation technology (containers, VMs, etc.) is limited.
- The Devfile scoping relies on correct configuration by the user.
- Specific details about network egress controls during autonomous execution are not well-documented.

**Credential injection pattern**: Partially implemented. The sandbox is configured without credentials, but the extent of enforcement is unclear from public documentation.

### 10.6 Summary

| Mechanism | Type | Capability Boundary |
|-----------|------|-------------------|
| Isolated sandbox execution | Structural | Code runs in managed environment |
| Credential-free sandbox | Structural | No credentials in execution environment |
| Devfile command scoping | Hybrid | Commands limited to Devfile specification |
| Security scanning | Instructional | Post-hoc vulnerability detection |
| Plan approval | Instructional | Human review before execution |
| IAM integration | Structural | AWS identity and access controls |

---

## 11. Convergent Security Patterns

Across the nine harnesses surveyed, ten security patterns emerge with varying levels of adoption:

### Pattern 1: OS-Level Sandbox Enforcement

**Adopted by**: Codex CLI, Claude Code, Cursor, Honk (container)  
**Technology**: bubblewrap, Seatbelt, Landlock/seccomp  
**Principle**: Use kernel-level primitives to restrict filesystem and network access. The agent and all its child processes inherit these restrictions.  
**Why it works**: The enforcement boundary is below the application layer. Prompt injection cannot bypass a kernel-enforced sandbox.

### Pattern 2: Network-Disabled-by-Default

**Adopted by**: Codex Cloud (agent phase), Claude Code (default), Honk (container)  
**Principle**: The agent has no network access unless explicitly configured. Eliminates exfiltration as a default capability.  
**Why it works**: Even if the agent is fully compromised, it cannot transmit data without network access. This is the single most effective defense against credential exfiltration.  
**Counter-example**: Devin's unrestricted network access enabled all four documented exfiltration vectors.

### Pattern 3: Domain Allowlist for Egress

**Adopted by**: Codex Cloud (when internet enabled), Claude Code (web)  
**Principle**: When network access is necessary, restrict it to a curated list of approved domains.  
**Enforcement**: Proxy-mediated egress with allowlist validation. Codex additionally restricts HTTP methods to GET/HEAD/OPTIONS only.

### Pattern 4: Credential Separation (Inject at Tool Level)

**Adopted by**: Codex Cloud (secret removal), Claude Code web (proxy), Honk (external credential management), Amazon Q (credential-free sandbox)  
**Principle**: Credentials should never be accessible to the agent's context. They are injected by the runtime/proxy/orchestration layer at the point of use.  
**Strongest implementations**:
- Codex Cloud: Secrets removed before agent phase
- Claude Code web: Proxy translates scoped tokens to real credentials
- Honk: Credentials held by orchestration infrastructure

### Pattern 5: Phase Separation (Setup vs. Agent)

**Adopted by**: Codex Cloud  
**Principle**: Separate dependency installation (which needs network + secrets) from agent execution (which should have neither). A clean architectural boundary between the privileged setup phase and the restricted execution phase.

### Pattern 6: Human-in-the-Loop for Dangerous Operations

**Adopted by**: Codex CLI, Claude Code (manual mode), Cursor (pre-sandbox), Amazon Q  
**Principle**: Certain operations (destructive commands, network access, writing outside project) require explicit human approval.  
**Limitation**: Approval fatigue degrades this control over time. Cursor's production data shows developers routinely approve dangerous commands without reading them.

### Pattern 7: Model-Based Approval Classifier

**Adopted by**: Claude Code (auto mode)  
**Principle**: Replace human approval with a model-based classifier that evaluates actions against a policy. Addresses approval fatigue while maintaining a gate.  
**Limitation**: 17% false negative rate on genuinely dangerous actions. The classifier itself can be manipulated through careful prompt construction.

### Pattern 8: Allowlisted Tool/Command Sets

**Adopted by**: Honk (strict Bash allowlist), GSD (schema-filtered tools per sub-agent), Amazon Q (Devfile-scoped commands)  
**Principle**: Define an explicit set of permitted operations. Everything outside the allowlist is denied by default.  
**Strongest implementation**: Honk's approach, where the agent simply cannot access tools outside the allowlist, and the allowlist is minimal (ripgrep, verify, limited git).

### Pattern 9: Worktree/Container Isolation for Parallel Agents

**Adopted by**: RAPID (worktrees), Honk (containers), Codex Cloud (containers)  
**Principle**: Each parallel agent operates in its own isolated filesystem context. Changes in one context cannot accidentally affect another.  
**Security benefit**: Prevents cross-contamination between tasks and limits the blast radius of any compromised session.

### Pattern 10: Deterministic Hooks for Invariant Enforcement

**Adopted by**: Claude Code (PreToolUse hooks), Honk (verifier gates)  
**Principle**: Code-based hooks that fire deterministically before tool execution, enforcing invariants that cannot be bypassed by the model's reasoning.  
**Key distinction**: Unlike instructional enforcement ("never run rm -rf"), hooks execute as code and return deny decisions that the runtime respects regardless of what the model wants.

---

## 12. Comparison Tables

### 12.1 Security Mechanism Inventory

| Harness | OS Sandbox | Network Isolation | Credential Separation | Command Allowlist | Human Approval | Hooks/Gates |
|---------|-----------|------------------|----------------------|-------------------|---------------|-------------|
| Codex Cloud | Container | Disabled by default | Secrets removed before agent | Via sandbox mode | Approval policy | -- |
| Codex CLI | bubblewrap/Seatbelt/Landlock | Configurable | Env var policy | Via sandbox mode | Approval policy | -- |
| Claude Code | bubblewrap/Seatbelt | Approved servers only | Proxy (web), encrypted (local) | Blocklist (curl, wget) | Manual/Auto/Bypass | PreToolUse hooks |
| Cursor | Seatbelt/Landlock/seccomp | Restricted (default) | **Not implemented** | Write-deny on config | Escalation prompt | -- |
| Devin | Per-session VM | **Unrestricted** | Vault (encrypted, redacted) | -- | -- | -- |
| Honk | Container | Container-isolated | External management | Strict Bash allowlist | -- | LLM judge + verifiers |
| GSD | Inherited (Claude Code) | Inherited | Inherited | Schema-filtered per sub-agent | Inherited | Quality gate evaluators |
| RAPID | Inherited (Claude Code) | Inherited | Inherited | CONTRACT.json scoping | Inherited | 5-level merge validation |
| Aider | **None** | **None** | **None** | **None** | **None** | Git auto-commit (recovery) |
| Amazon Q | Docker sandbox | Credential-free sandbox | Sandbox without credentials | Devfile-scoped | Plan approval | Security scanning |

### 12.2 Structural vs. Instructional Enforcement

| Harness | Structural Mechanisms | Instructional Mechanisms | Ratio |
|---------|----------------------|-------------------------|-------|
| Codex Cloud | Container, network disable, secret removal, proxy, domain allowlist, HTTP method filter | Approval policy | 6:1 |
| Honk | Container, allowlisted commands, no-push git, external creds, verifier gate | LLM judge | 5:1 |
| Claude Code (sandboxed) | OS sandbox, write restriction, protected paths, proxy (web), hooks | Auto mode classifier, blocklist, prompt injection probe | 5:3 |
| RAPID | Worktree isolation, merge validation, cleanup | CONTRACT.json validation | 3:1 |
| GSD | Fresh context, schema filtering, read-only evaluators | Quality gate questions | 3:1 |
| Codex CLI | OS sandbox, protected paths | Approval prompts | 2:1 |
| Amazon Q | Docker sandbox, credential-free env, IAM | Plan approval, security scanning, Devfile | 3:3 |
| Cursor | OS sandbox, write-deny on config | Escalation prompt, .cursorignore (bypassable) | 2:2 |
| Devin | VM isolation, encrypted vault | Repo access scoping, dashboard injection | 2:2 |
| Aider | Git commits (recovery only) | -- | 0:0 |

### 12.3 Credential Injection Architecture

| Harness | Pattern | Implementation | Strength |
|---------|---------|---------------|----------|
| Codex Cloud | Secrets removed before agent phase | Container-level enforcement | Strong |
| Claude Code (web) | Proxy translates scoped tokens | Network-layer enforcement | Strong |
| Honk | Credentials held by orchestration | Architecture-level separation | Strong |
| Amazon Q | Sandbox has no credentials | Container-level enforcement | Moderate (limited docs) |
| Devin | Vault with env var injection | Encrypted but agent-accessible | Weak (unrestricted network) |
| Claude Code (local) | Encrypted keychain + command blocklist | Application-level enforcement | Moderate |
| Codex CLI | Env var policy with exclude patterns | Configuration-level enforcement | Moderate |
| Cursor | None | Credentials readable via shell | Absent |
| GSD / RAPID | Inherited from Claude Code | No additional separation | Inherited |
| Aider | None | API keys in .env files | Absent |

---

## 13. Key Findings and Gaps

### 13.1 The Structural Enforcement Hierarchy

The most effective security implementations share a common architecture:

1. **Innermost layer**: Agent operates in a restricted execution environment (container, VM, sandbox)
2. **Middle layer**: Network egress is disabled or allowlisted; credentials are injected at the runtime layer, not the prompt layer
3. **Outermost layer**: Human or model-based approval for operations that cross the boundary

Codex Cloud implements all three layers. Honk implements layers 1 and 2 and replaces layer 3 with verification gates. Claude Code (sandboxed + web) implements all three. The harnesses with security incidents (Devin, Cursor, early Codex CLI) typically have gaps in layer 2 (network egress or credential exposure).

### 13.2 The Approval Fatigue Problem

Every harness that relies on human approval for security-critical operations faces the same degradation curve. Cursor's data shows a 40% reduction in interruptions with sandboxing, but the remaining interruptions still suffer from fatigue. Claude Code's auto mode classifier addresses this but introduces a 17% false negative rate on dangerous actions.

The harnesses that avoid this problem entirely (Codex Cloud, Honk) do so by making approval unnecessary through structural restrictions: the agent simply cannot perform dangerous operations, so there is nothing to approve.

### 13.3 The Read-Access Credential Gap

Cursor's architecture reveals a systemic problem: development tools need broad filesystem read access to function (e.g., npm reads `~/.npmrc`, git reads `~/.gitconfig`), but this same read access exposes credentials to the agent. No harness has fully solved this tension. The closest solutions are:

- **Codex Cloud**: Eliminates the problem by running in containers where credential files do not exist.
- **Claude Code web**: Proxy-mediated credential injection means credential files are not on the sandbox filesystem.
- **Honk**: Container environment has minimal binaries and no credential files present.

Local development environments (Codex CLI, Claude Code local, Cursor) remain fundamentally exposed to this attack surface.

### 13.4 MCP as an Expanding Attack Surface

Multiple harnesses (Claude Code, Cursor) support Model Context Protocol servers, which add tool descriptions directly to the agent's system prompt. Malicious MCP servers can:

- Inject prompt instructions via tool descriptions
- Expose credentials via tool calls
- Exfiltrate data through tool interactions

Claude Code mitigates this with trust verification and isolated context windows. Cursor has no specific MCP security controls.

### 13.5 Convergence Toward Three Architectures

The surveyed harnesses converge toward three security architectures, each with distinct tradeoffs:

| Architecture | Examples | Tradeoff |
|-------------|----------|----------|
| **Sealed container** (network-off, credential-removed) | Codex Cloud, Honk | Maximum security, minimum flexibility |
| **Sandboxed local** (OS primitives, approval gates) | Claude Code, Cursor, Codex CLI | Moderate security, high flexibility |
| **Open with recovery** (git commits, no sandbox) | Aider | No security, maximum flexibility |

The industry trajectory is clearly toward sealed containers for autonomous/background agents and sandboxed local execution for interactive development.

### 13.6 Open Problems

1. **Local credential isolation**: No harness has solved the problem of giving development tools read access to credential files without exposing those credentials to the agent.
2. **Classifier reliability**: Claude Code's 17% false negative rate on dangerous actions means roughly 1 in 6 genuinely dangerous actions are approved automatically.
3. **Supply chain trust**: MCP servers, npm packages (GSD), and skill registries introduce trust boundaries that are not yet well-governed.
4. **Audit and accountability**: Most harnesses log actions but do not provide tamper-evident audit trails. Devin's VPC deployment and Claude Code's cloud mode are exceptions.
5. **Multi-agent credential scoping**: When multiple agents operate in parallel (RAPID, GSD), credential scoping per-agent is not well-defined. Worktree isolation addresses filesystem isolation but not credential isolation.

---

## 14. Sources

### OpenAI Codex
- [Introducing Codex](https://openai.com/index/introducing-codex/) -- OpenAI
- [Codex Security](https://developers.openai.com/codex/security) -- OpenAI Developers
- [Agent Approvals & Security](https://developers.openai.com/codex/agent-approvals-security) -- OpenAI Developers
- [Sandboxing Concepts](https://developers.openai.com/codex/concepts/sandboxing) -- OpenAI Developers
- [Cloud Environments](https://developers.openai.com/codex/cloud/environments) -- OpenAI Developers
- [Agent Internet Access](https://developers.openai.com/codex/cloud/internet-access) -- OpenAI Developers
- [Configuration Reference](https://developers.openai.com/codex/config-reference) -- OpenAI Developers
- [Sandboxing Architecture](https://www.mintlify.com/openai/codex/architecture/sandboxing) -- Mintlify/OpenAI
- [Codex CLI Linux Sandbox README](https://github.com/openai/codex/blob/main/codex-rs/linux-sandbox/README.md) -- GitHub
- [OpenAI Patches Codex GitHub Token Vulnerability](https://thehackernews.com/2026/03/openai-patches-chatgpt-data.html) -- The Hacker News, March 2026

### Anthropic Claude Code
- [Making Claude Code More Secure and Autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing) -- Anthropic Engineering Blog
- [Claude Code Auto Mode](https://www.anthropic.com/engineering/claude-code-auto-mode) -- Anthropic Engineering Blog
- [Security](https://code.claude.com/docs/en/security) -- Claude Code Docs
- [Hooks Reference](https://code.claude.com/docs/en/hooks) -- Claude Code Docs
- [Claude Code Permissions Guide](https://skillsplayground.com/guides/claude-code-permissions/) -- SkillsPlayground
- [Claude Code Security Best Practices](https://www.backslash.security/blog/claude-code-security-best-practices) -- Backslash Security
- [Understanding Claude Code Permissions](https://www.petefreitag.com/blog/claude-code-permissions/) -- Pete Freitag

### Cursor
- [Implementing a Secure Sandbox for Local Agents](https://cursor.com/blog/agent-sandboxing) -- Cursor Blog
- [LLM Safety and Controls](https://cursor.com/docs/enterprise/llm-safety-and-controls) -- Cursor Docs
- [The State of Cursor, November 2025: When Sandboxing Leaks Your Secrets](https://luca-becker.me/blog/cursor-sandboxing-leaks-secrets/) -- Luca Becker
- [The Agent Security Paradox: When Trusted Commands Become Attack Vectors](https://www.pillar.security/blog/the-agent-security-paradox-when-trusted-commands-in-cursor-become-attack-vectors) -- Pillar Security (CVE-2026-22708)
- [Cursor Agent Sandbox Analysis Report](https://agent-safehouse.dev/docs/agent-investigations/cursor-agent) -- Agent Safehouse
- [From .env to Leakage: Mishandling of Secrets by Coding Agents](https://www.knostic.ai/blog/claude-cursor-env-file-secret-leakage) -- Knostic

### Devin (Cognition)
- [Security at Cognition](https://docs.devin.ai/admin/security) -- Devin Docs
- [VPC Deployment Overview](https://docs.devin.ai/enterprise/vpc/overview) -- Devin Docs
- [Devin's 2025 Performance Review](https://cognition.ai/blog/devin-annual-performance-review-2025) -- Cognition Blog
- [How Devin AI Can Leak Your Secrets via Multiple Means](https://embracethered.com/blog/posts/2025/devin-can-leak-your-secrets/) -- Embrace The Red, August 2025
- [Software Development With Devin: Security, Deployment, Maintenance](https://www.datacamp.com/tutorial/devin-ai-security-deployment) -- DataCamp

### Spotify Honk
- [1,500+ PRs Later: Spotify's Journey with Our Background Coding Agent (Part 1)](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1) -- Spotify Engineering
- [Background Coding Agents: Context Engineering (Part 2)](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2) -- Spotify Engineering
- [Background Coding Agents: Predictable Results Through Strong Feedback Loops (Part 3)](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3) -- Spotify Engineering

### GSD Harness
- [GSD-2 GitHub Repository](https://github.com/gsd-build/gsd-2) -- GitHub
- [Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) -- HumanLayer Blog
- [GSD Framework: The System Revolutionizing Development with Claude Code](https://pasqualepillitteri.it/en/news/169/gsd-framework-claude-code-ai-development) -- Pasquale Pillitteri
- [AI-Powered Claude Code Extensions for DevOps: A Comparative Security Analysis](https://blog.ogunlana.net/2026/01/22/ai-powered-claude-code-extensions-for-devops-a-comparative-security-analysis/) -- Bola's Blog

### RAPID Harness
- [Git Worktree Isolation in Claude Code: Parallel Development Without the Chaos](https://medium.com/@richardhightower/git-worktree-isolation-in-claude-code-parallel-development-without-the-chaos-262e12b85cc5) -- Towards AI
- [What is Worktree Isolation in AI Agents?](https://docs.bswen.com/blog/2026-03-18-ai-agent-worktree-isolation/) -- BSWEN
- [Common Workflows](https://code.claude.com/docs/en/common-workflows) -- Claude Code Docs

### Aider
- [Aider GitHub Repository](https://github.com/Aider-AI/aider) -- GitHub
- [Git Integration](https://aider.chat/docs/git.html) -- Aider Docs
- [Options Reference](https://aider.chat/docs/config/options.html) -- Aider Docs

### Amazon Q Developer
- [Amazon Q Developer Features](https://aws.amazon.com/q/developer/features/) -- AWS
- [Security in Amazon Q Developer](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html) -- AWS Docs
- [Enhancing Code Generation with Real-Time Execution](https://aws.amazon.com/blogs/devops/enhancing-code-generation-with-real-time-execution-in-amazon-q-developer/) -- AWS DevOps Blog

### Cross-Cutting Security Research
- [Securing AI Agents: The Defining Cybersecurity Challenge of 2026](https://www.bvp.com/atlas/securing-ai-agents-the-defining-cybersecurity-challenge-of-2026) -- Bessemer Venture Partners
- [OWASP Top 10 for Agentic Applications (2026)](https://www.aikido.dev/blog/owasp-top-10-agentic-applications) -- Aikido
- [Security Best Practices When Building AI Agents](https://render.com/articles/security-best-practices-when-building-ai-agents) -- Render
- [Securing AI Agents Without Static Credentials](https://aembit.io/blog/securing-ai-agents-without-secrets/) -- Aembit
- [AI Coding Tools Exploded in 2025. The First Security Exploits Show What Could Go Wrong](https://fortune.com/2025/12/15/ai-coding-tools-security-exploit-software/) -- Fortune, December 2025
- [Building AI Coding Agents for the Terminal: Scaffolding, Harness, Context Engineering, and Lessons Learned](https://arxiv.org/html/2603.05344v1) -- arXiv
- [How to Sandbox AI Agents in 2026](https://northflank.com/blog/how-to-sandbox-ai-agents) -- Northflank
- [Harness Engineering: Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/) -- OpenAI
- [State of AI Agent Security 2026 Report](https://www.gravitee.io/blog/state-of-ai-agent-security-2026-report-when-adoption-outpaces-control) -- Gravitee
