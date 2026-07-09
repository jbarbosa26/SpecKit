# Spec Kit Toolkit Breakdown

[Spec Kit](https://github.com/github/spec-kit) is an open-source toolkit from GitHub for **Spec-Driven Development (SDD)**. It is installed as the `specify` command-line interface (the *Specify CLI*) and scaffolds the SDD workflow directly into your repository so your AI coding agent can turn intent into structured specifications, plans, tasks, and working code. Spec Kit is **agent-agnostic**: it supports **30+ AI coding agents** (34 named integrations plus a `generic` bring-your-own key). This document uses **GitHub Copilot** as the primary example, but the same workflow applies to Claude Code, Gemini CLI, Codex CLI, Cursor, and many others — the only difference is which per-agent files get generated. Run `specify integration list` to see every supported agent, or consult the [official integrations reference](https://github.github.io/spec-kit/reference/integrations.html). This document is the *tooling* reference: how to install it, the commands it adds, the artifacts it produces, the on-disk layout, and how it plugs into your agent. The methodology and theory behind SDD live in the sibling doc [`01-what-is-spec-driven-development.md`](./01-what-is-spec-driven-development.md).

## Prerequisites

- **Operating system:** Linux, macOS, or Windows. Windows is fully supported — you can use `uv` and run `specify` from PowerShell.
- **Python 3.11+** — the Specify CLI runtime.
- **Git** — recommended (optional; required for the git extension / feature branches). Spec Kit can version specs and track artifacts in version control, and can create a feature branch per feature when its git integration is enabled — but git is no longer strictly required to run the workflow.
- **[`uv`](https://docs.astral.sh/uv/)** for package management (recommended), or **`pipx`** for persistent installs.
- **A supported AI coding agent.** Spec Kit supports **30+ agents** — for example `copilot` (GitHub Copilot), `claude` (Claude Code), `gemini` (Gemini CLI), `codex` (Codex CLI), and `cursor-agent` (Cursor). Run `specify integration list` to discover them all.

## Install the Specify CLI

Install persistently with `uv`, replacing `vX.Y.Z` with the latest release tag from the [releases page](https://github.com/github/spec-kit/releases):

> Shell commands below are identical on macOS/Linux (bash/zsh) and Windows PowerShell, except where a separate PowerShell block is shown explicitly.

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```

> On Windows/PowerShell, ensure uv's tool bin directory is on your `PATH` so the `specify` command resolves. You can verify the install with `specify --help`; if the command is not found, run `uv tool update-shell` and restart PowerShell.

To run a single command without a persistent install (ephemeral, one-shot):

```bash
uvx --from git+https://github.com/github/spec-kit.git specify <command>
```

> **Caution:** always install from the official Git source above. There is no official Spec Kit package on PyPI — a `specify-cli` published to PyPI is unaffiliated with GitHub Spec Kit.

### Self-management

The CLI can check for and apply its own updates:

```bash
specify self check                 # read-only update check
specify self upgrade --dry-run     # preview what would change
specify self upgrade               # upgrade to the latest release
specify self upgrade --tag vX.Y.Z  # upgrade to a specific tag
```

## Initialize a project

Create a new project pre-wired for your chosen agent. Copilot is used here as the primary example, but you can swap `copilot` for any supported agent key (e.g. `claude`, `gemini`, `codex`, `cursor-agent`):

```bash
specify init <project-name> --integration copilot
cd <project-name>
```

To initialize **in the current directory**, use either form:

```bash
specify init .
specify init --here
```

Add `--force` to merge Spec Kit into a non-empty directory:

```bash
specify init --here --force
```

Useful flags:

- `--integration <key>` — choose the AI agent integration (e.g. `copilot`, `claude`, `gemini`, `codex`, `cursor-agent`). Run `specify integration list` to see all supported keys. In non-interactive sessions the default integration is `copilot`. For a bring-your-own agent, use `--integration generic --integration-options="--commands-dir <path>"`.
- `--ignore-agent-tools` — skip checking for an installed agent (useful in CI or when the agent runs elsewhere).
- `--integration-options="--skills"` — enable skills mode for agents that support it (see the agent-integration section below).
- `--script sh|ps` — choose the helper-script flavor (also accepts `py`).

## The command workflow

After initialization, the workflow runs as slash commands inside your AI agent.

| Command | Purpose |
| --- | --- |
| `/speckit.constitution` | Create/update project governing principles (writes `.specify/memory/constitution.md`) |
| `/speckit.specify` | Define WHAT to build (requirements + user stories); creates `specs/<###-name>/spec.md` in a new numbered feature directory (a matching feature branch is created by Spec Kit's git integration when git is present) |
| `/speckit.clarify` | (Optional, recommended before plan; *formerly `/quizme`*) structured Q&A to remove ambiguity; records a Clarifications section |
| `/speckit.plan` | Provide tech stack/architecture; generates plan + design docs |
| `/speckit.tasks` | Generate an actionable, dependency-ordered `tasks.md` |
| `/speckit.analyze` | (Optional) cross-artifact consistency & coverage check (after tasks, before implement) |
| `/speckit.checklist` | (Optional) generate quality checklists ("unit tests for English") |
| `/speckit.implement` | Execute the tasks to build the feature |
| `/speckit.converge` | Assess the codebase against the spec/plan/tasks and append remaining work as new tasks |
| `/speckit.taskstoissues` | (Optional) convert tasks into GitHub issues |

### Required path: constitution → specify → plan → tasks → implement

- **`/speckit.constitution`** establishes the non-negotiable principles (architecture rules, quality bars, conventions) that constrain every later phase.
- **`/speckit.specify`** captures the *what* and *why* — user stories and requirements — and creates `specs/<###-name>/spec.md` in a new numbered feature directory (a matching feature branch is created by Spec Kit's git integration when git is present).
- **`/speckit.plan`** turns the spec into the *how*: tech stack, architecture, and supporting design docs (research, data model, contracts, quickstart).
- **`/speckit.tasks`** decomposes the plan into a dependency-ordered `tasks.md`. Tasks tagged `[P]` are parallel-safe and may be executed concurrently.
- **`/speckit.implement`** executes the tasks in order to build the feature.

### Optional quality commands

- **`/speckit.clarify`** (formerly `/quizme`) runs a structured Q&A before planning to drive out ambiguity and records the answers in a Clarifications section.
- **`/speckit.analyze`** performs a cross-artifact consistency and coverage check after tasks and before implementing.
- **`/speckit.checklist`** generates quality checklists — "unit tests for English" — to validate the specification itself.
- **`/speckit.converge`** assesses the existing codebase against the spec, plan, and tasks and appends any remaining work as new tasks — useful for closing the gap between what's built and what's specified.
- **`/speckit.taskstoissues`** converts the generated tasks into GitHub issues for tracking.

## Artifacts & on-disk layout

Spec Kit writes a small set of files that are the **source of truth** for the feature. A typical layout after initializing and specifying one feature:

```text
your-project/
├── .specify/
│   ├── memory/
│   │   └── constitution.md          # governing principles
│   ├── scripts/                     # bash and/or PowerShell helper scripts
│   ├── templates/                   # spec/plan/tasks/constitution templates
│   ├── integration.json             # active integration record
│   ├── integration-catalogs.yml     # available integration catalogs
│   └── init-options.json            # options captured at init time
└── specs/
    └── 001-example-feature/
        ├── spec.md                  # feature specification (WHAT/WHY)
        ├── plan.md                  # implementation plan (HOW)
        ├── research.md              # Phase 0 research/decisions
        ├── data-model.md            # entities/schemas
        ├── contracts/               # API/contract specs
        ├── quickstart.md            # key validation scenarios
        └── tasks.md                 # executable, dependency-ordered tasks
```

> Per-agent command and context files (e.g. `.github/agents/…` for Copilot, `.claude/…` and `CLAUDE.md` for Claude, `.gemini/…` and `GEMINI.md` for Gemini) are generated alongside `.specify/` — see [the agent-integration section](#agent-integration-copilot-and-beyond) below.

| Artifact | Role |
| --- | --- |
| `.specify/memory/constitution.md` | Project governing principles that constrain all phases |
| `specs/<###-feature-name>/spec.md` | Feature specification — the WHAT and WHY |
| `specs/<###-feature-name>/plan.md` | Implementation plan — the HOW (tech stack/architecture) |
| `specs/<###-feature-name>/research.md` | Phase 0 research and key decisions |
| `specs/<###-feature-name>/data-model.md` | Entities and schemas |
| `specs/<###-feature-name>/contracts/` | API/contract specifications |
| `specs/<###-feature-name>/quickstart.md` | Key validation scenarios |
| `specs/<###-feature-name>/tasks.md` | Executable, dependency-ordered tasks (`[P]` = parallel-safe) |
| `.specify/scripts/` | Bash and/or PowerShell automation used by the commands |
| `.specify/templates/` | Templates for spec, plan, tasks, and constitution |

## Agent integration (Copilot and beyond)

Because Spec Kit is agent-agnostic, `specify init --integration <key>` generates the *same* workflow for every agent — only the per-agent command and context files differ. All integrations also generate the shared `.specify/` infrastructure: `.specify/memory/constitution.md`, `.specify/scripts/{bash|powershell}/…`, `.specify/templates/…`, and the integration config files (`integration.json`, `integration-catalogs.yml`, `init-options.json`).

### GitHub Copilot (`--integration copilot`)

Running `specify init --integration copilot` wires the project for GitHub Copilot and generates:

- **`.github/agents/speckit.*.agent.md`** — the primary command definition files, invoked as `/speckit.*` in **VS Code GitHub Copilot Chat** (agent mode).
- **`.github/prompts/speckit.*.prompt.md`** — companion prompt files for the same commands.
- **`.vscode/settings.json`** — configured so prompt files are enabled/recommended.
- With `--integration-options="--skills"`: scaffolds skills as **`.github/skills/speckit-<name>/SKILL.md`**.

> Note: `specify init` does **not** generate `.github/copilot-instructions.md`. That file is Copilot's own custom-instructions mechanism; you may create it manually (see [`04-adapting-existing-projects.md`](./04-adapting-existing-projects.md)), but Spec Kit does not produce it.

### Other agents

Each agent gets its command files and a context file under its own directory:

| Agent | Integration key | Generated command dir | Context file |
| --- | --- | --- | --- |
| GitHub Copilot | `copilot` | `.github/agents/speckit.*.agent.md` (+ `.github/prompts/…`, `.vscode/settings.json`) | *(none generated; optional manual `.github/copilot-instructions.md`)* |
| Claude Code | `claude` | `.claude/skills/` | `CLAUDE.md` |
| Gemini CLI | `gemini` | `.gemini/commands/` (TOML) | `GEMINI.md` |
| Codex CLI | `codex` | `.agents/skills` (invoked as `$speckit-*`) | `AGENTS.md` |
| Cursor | `cursor-agent` | `.cursor/skills` | `.cursor/rules/specify-rules.mdc` |

In VS Code with Copilot, invoke the workflow by typing the commands as `/speckit.*` in Copilot Chat (agent mode). Most agents expose these as `/speckit.*` slash commands; the **GitHub Copilot CLI** uses `/agents` to select the agent (or you address it directly in a prompt), and **Codex CLI** skills mode uses `$speckit-*`.

## Customization: extensions vs presets

Customizations are resolved by priority (high → low):

| Priority | Source | Path |
| --- | --- | --- |
| 1 (highest) | Project-local overrides | `.specify/templates/overrides/` |
| 2 | Presets | `.specify/presets/templates/` |
| 3 | Extensions | `.specify/extensions/templates/` |
| 4 (lowest) | Spec Kit core | `.specify/templates/` |

- **Extensions** add NEW capabilities/commands:

  ```bash
  specify extension search
  specify extension add <name>
  ```

- **Presets** customize HOW existing templates/commands behave:

  ```bash
  specify preset search
  specify preset add <name>
  ```

**When to use which:** reach for an **extension** when you need a new command or capability that Spec Kit does not ship; reach for a **preset** when you want to change the behavior or output of an existing command/template.

## Integration management

Manage which AI agent integrations are installed and active. Start with `specify integration list` to discover every supported agent:

```bash
specify integration list               # show available/installed integrations
specify integration search <term>      # search the integration catalogs
specify integration info <key>         # show details for one integration
specify integration install <key>      # install an integration (e.g. copilot)
specify integration switch <key>       # switch the active integration
specify integration use <key>          # select the integration to use
specify integration uninstall          # remove an integration
```

Spec Kit also ships role-based **bundles** (`specify bundle …`) that group commands and configuration for a workflow; an *agnostic* bundle inherits the project's existing integration rather than pinning one.

## Development phases the toolkit supports

- **0-to-1 (greenfield):** start a brand-new project from a specification.
- **Creative Exploration:** generate parallel implementations to compare approaches.
- **Iterative Enhancement (brownfield):** apply SDD to add features to an existing codebase.

## Further reading

- [`01-what-is-spec-driven-development.md`](./01-what-is-spec-driven-development.md) — the methodology and theory behind SDD
- [`03-walkthrough-and-lab.md`](./03-walkthrough-and-lab.md) — end-to-end walkthrough and hands-on lab
- [`04-adapting-existing-projects.md`](./04-adapting-existing-projects.md) — applying Spec Kit to brownfield projects
- [`../README.md`](../README.md) — project overview
- Official repository: <https://github.com/github/spec-kit>
- Official docs site: <https://github.github.io/spec-kit/>
- Integrations reference: <https://github.github.io/spec-kit/reference/integrations.html>
- CLI reference: <https://github.github.io/spec-kit/reference/overview.html>
