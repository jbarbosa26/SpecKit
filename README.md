# Spec-Driven Development with GitHub Spec Kit

An independent, security-focused workshop for learning **spec-driven development
(SDD)** with **GitHub Spec Kit 1.0.1**, using either Copilot or a no-AI
CLI-and-manual companion track. Work from intent to reviewed requirements, architecture, tasks,
implementation, and evidence, then repeat the loop for a controlled change.
Artifacts, whether human-written or AI-assisted, are not proof that a system
is correct, secure, or ready for production.

**Workshop baseline reviewed: September 22, 2026.** Spec Kit is pinned to the
[v1.0.1 release](https://github.com/github/spec-kit/releases/tag/v1.0.1), source
commit `9118ed15a0ba65053469a94c560ea5d233f75884`. This is the workshop's chosen
version, **not a claim that 1.0.1 is the latest release**. Current product
documentation can describe newer behavior.

## Start here

| Document | Use it for |
| --- | --- |
| [Shared CLI installation and PATH setup](./docs/00-tool-setup.md) | Choose uv or isolated pip, install uv with pip if needed, and configure executable paths for all three shells. |
| [Copilot student prerequisites and quick reference](./docs/02-spec-kit-breakdown.md) | Complete before the Copilot track: tools, agent access, safe permissions, pinned installation, and a readiness check. |
| [What is spec-driven development?](./docs/01-what-is-spec-driven-development.md) | Understand the method, its limits, and the architect's review responsibilities. |
| [Copilot hands-on lab](./docs/03-walkthrough-and-lab.md) | Follow **390 minutes (6.5 hours)** of guided exercises in VS Code, excluding prework and breaks. |
| [noGHCP: official CLI and manual workshop](./docs/noGHCP/README.md) | A separate **6.5-hour** route using the pinned Specify CLI, human-authored documents, manual coding exercises, and a local starter. No AI tools or agent accounts required. |
| [Adapting an existing project](./docs/04-adapting-existing-projects.md) | Apply SDD incrementally, upgrade safely, and assess the gap to production/cloud use. |
| [Reference artifacts](./examples/README.md) | Compare your constitution, specification, plan, and tasks with aligned examples; do not substitute them for your own decisions. |

Choose **one track** and complete its prerequisites before attending. GitHub
Copilot is required for the original VS Code instructions, **not for noGHCP**.
The noGHCP route requires Git, a current patched Python **3.12** (CLI minimum:
3.11), approved **uv or pip**, **Specify 1.0.1**, patched **Node 24 LTS**, a browser,
and any text editor. It can be completed offline after preparing the tools and materials.
Keep your chosen lab open alongside your editor.
Read the brownfield guide when applying SDD to an existing codebase.

## Command-line shell options

Both tracks include **PowerShell 7**, **Bash**, and **Windows Command Prompt
(`cmd.exe`)** instructions. Choose one shell variant for each step; do not run
all variants. Terminal blocks labeled **all shells** use the same commands in
all three. Agent-chat commands, browser-console snippets, and file content are
not terminal commands.

| Shell | Spec Kit initialization | Running generated helpers |
| --- | --- | --- |
| PowerShell 7 on Windows | `--script ps` | Invoke the reviewed `.ps1` helper in PowerShell. |
| Bash on macOS/Linux | `--script sh` | Invoke the reviewed `.sh` helper with `bash`. |
| Command Prompt on Windows | `--script ps` | Invoke the reviewed PowerShell helper with `pwsh -NoProfile -File`; guarded multi-step examples use `pwsh -NoProfile -Command`. |

Command Prompt users still need **PowerShell 7 (`pwsh`)** installed: Spec Kit
1.0.1 supplies PowerShell/Bash helpers, not a native `--script cmd` option.
The `cmd` blocks are for an **interactive Command Prompt**, not a batch file.
In continued commands, `^` must be the last character on its line, with no
trailing spaces; copy the entire block. Keep Windows and WSL tools/paths
separate, and never bypass execution policy or run as administrator.

## What you will build and learn

**BookNook** is a small, single-user reading-list application. Add fictional books,
persist them in browser storage, change reading status, and filter the list.
Then use an explicit change request to add search without breaking the approved
baseline.

The original track uses **GitHub Copilot in VS Code** with Spec Kit's skills.
In **noGHCP**, the official CLI and shell helpers seed scaffolding; students
write and review the documents and implement spec-first extensions to a supplied
add/list/persist baseline. **Slash commands are agent Markdown instructions, not
native terminal commands:** installing Python, Node, and Specify does not make
them executable without an agent. Use the clearly labeled
[manual phase equivalents](./docs/noGHCP/README.md#slash-command-phases-and-their-no-ai-equivalents),
not a custom runner or an AI tool. The shared application design uses **Node.js 24 LTS**
on its latest security patch, plain
HTML/CSS/JavaScript, and Node's built-in test runner. No third-party JavaScript
packages, native database toolchains, Azure subscription, deployment, or API
keys are needed for the application. The **Copilot track only** requires an
approved agent account, network access, and request allowance; usage may cost
money. The app runs at `http://127.0.0.1:4173` with fictional local data.

You will practice requirements clarification, threat modeling, architecture
tradeoffs, test-first implementation, negative/security testing, accessibility
checks, requirements-to-evidence traceability, and change control. The time
allocations are **facilitator budgets**, not a guarantee of agent response speed
or a production-readiness certification.

This repository contains teaching documents and a deliberately partial
[manual-track starter](./docs/noGHCP/starter/). It supplies the add/list/persist
baseline; status/filter and search remain student exercises. Work in a
**separate scratch directory** as instructed in your chosen lab.

To check the supplied starter from the repository root, without installing
packages:

**Terminal - all shells**
```text
npm --prefix docs/noGHCP/starter test
npm --prefix docs/noGHCP/starter run check
```

## Copilot track: version-correct command flow

Both tracks use the pinned official CLI. For **noGHCP**, follow its
[prerequisites](./docs/noGHCP/01-prerequisites.md) and
[generic initialization](./docs/noGHCP/02-hands-on-lab.md#checkpoint-1) instead of
the Copilot integration and agent-chat steps below. Its initializer is
`specify init booknook-manual --integration generic --integration-options="--commands-dir .manual/commands" --script ps`
(PowerShell 7 or Command Prompt; use `--script sh` for Bash), in a new scratch
location. Follow the full lab's guards and manual Git initialization; do not
initialize twice or add extensions.

Install the verified 1.0.1 source using **one** of the following alternatives,
after completing the prerequisites and
[installer preparation](./docs/00-tool-setup.md). The pip route uses a dedicated
tool environment, not system Python, and does not require uv. If only uv's
normal installer is unavailable, the guide also shows
[installing uv with pip](./docs/00-tool-setup.md#install-uv-with-pip-when-needed).
The source-commit pin avoids relying on a release tag remaining unchanged:

**Terminal - all shells, uv route**
```text
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884
```

**Terminal - all shells, pip alternative in the prepared tool environment**
```text
python -m pip install "specify-cli @ git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884"
```

Apply your route's [PATH commands](./docs/00-tool-setup.md#add-executable-directories-to-path)
so `specify` resolves in each terminal, then verify:

**Terminal - all shells**
```text
specify version
```

Initialize a **new** scratch project using the shell-specific instructions in
the lab. Spec Kit 1.0.1 bundles its core templates with the installed CLI. Its
core does **not** initialize Git or automatically create feature branches; the
lab handles Git explicitly without installing extensions.

The following are **agent-chat commands, not terminal commands**:

| Step | Copilot skill | Result to review |
| --- | --- | --- |
| Govern | `/speckit-constitution` | `.specify/memory/constitution.md` |
| Specify | `/speckit-specify` | `specs/<number>-<feature>/spec.md` |
| Clarify | `/speckit-clarify` | Decisions recorded in the active specification |
| Plan | `/speckit-plan` | Plan and relevant research, model, contract, and quickstart artifacts |
| Review requirements | `/speckit-checklist` | Requirements-quality questions, not application tests |
| Decompose | `/speckit-tasks` | Dependency-ordered tasks |
| Analyze | `/speckit-analyze` | Cross-artifact findings; humans resolve blocking findings |
| Implement | `/speckit-implement` | Reviewed, incremental code and test changes |
| Assess remaining work | `/speckit-converge` | Additional remediation tasks if gaps remain, not automatic code repairs |

Clarify, checklist, and analyze are optional toolkit capabilities but **required
review gates in this workshop**. Converge is a supplemental assessment, not a
replacement for running tests.

For 1.0.1, Copilot's default files live in
`.github/skills/speckit-<name>/SKILL.md`. The older dotted `/speckit.specify`
syntax belongs to Copilot's explicitly selected **commands** mode, not this
lab's default. Claude's default skills also use hyphens; Gemini uses dotted
commands. Those are other AI integrations, not the no-AI track. Generic
initialization writes `.manual/commands/speckit.<phase>.md` as guidance only.
[noGHCP](./docs/noGHCP/README.md) uses supported CLI scaffolding and helpers,
then replaces agent invocations with human writing, decisions, edits, and review.
Generated workflow files are not executed; do not run `specify workflow run`,
install extensions/presets, or publish tasks as issues in that track.
The [integration reference](./docs/02-spec-kit-breakdown.md#cli-reference)
distinguishes these modes.

## Security and scope

Use an ordinary user account, a disposable browser profile, and fictional data.
Inspect supplied or generated scripts and diffs before execution. For the
AI-assisted track, retain manual tool approvals.
Do not enable blanket auto-approval, expose the local server, connect production
repositories or credentials, install unreviewed extensions/MCP servers, or
publish tasks with `/speckit-taskstoissues` during the lab. Ignore rules do not
prevent an AI agent from reading files.

The material applies [Microsoft Zero Trust principles](https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview)
and the [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
to engineering decisions. It is **not official Microsoft or GitHub training**.
Local browser storage and a loopback server are deliberate teaching boundaries,
not substitutes for production identity, authorization, resilient storage, or
operational controls.

## Source references

For release-specific behavior, prefer frozen source over moving documentation:

- [Spec Kit 1.0.1 source](https://github.com/github/spec-kit/tree/9118ed15a0ba65053469a94c560ea5d233f75884)
  and [core CLI reference](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/docs/reference/core.md).
- [1.0.1 Copilot integration](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/src/specify_cli/integrations/copilot/__init__.py)
  for skills defaults and legacy commands behavior.
- [Current Spec Kit documentation](https://github.github.io/spec-kit/),
  [VS Code agent security](https://code.visualstudio.com/docs/agents/run/security),
  and [Node.js support status](https://nodejs.org/en/about/previous-releases)
  are live references. Recheck them before teaching a future cohort.

## License

Released under the [MIT License](./LICENSE).
