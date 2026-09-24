# Student prerequisites and Spec Kit 1.0.1 quick reference

**This brief is for the Copilot track.** To complete the workshop without any AI
tool or agent account, use the separate
[noGHCP prerequisites](./noGHCP/01-prerequisites.md) and
[instruction series](./noGHCP/README.md) instead. That route still installs the
official pinned Specify CLI with Python and either uv or pip, uses generic scaffolding and
supported shell helpers, and performs the development phases manually.

**Complete this brief before the workshop.** Setup is not part of the
390-minute hands-on lab. No Azure subscription or application API key is
required. You do need internet access and an organization-approved AI coding
agent with sufficient usage allowance.

[Prework](#prework-start-here) | [Readiness check](#readiness-check) |
[CLI reference](#cli-reference) | [Start the lab](./03-walkthrough-and-lab.md)

## Prework: start here

### 1. Bring the right tools and access

| Requirement | Preparation |
| --- | --- |
| Basic skills | Navigate folders, edit text, run terminal commands, and read basic JavaScript. SDD experience is not required. |
| Git | Install a current approved [Git release](https://git-scm.com/downloads). Git is required for this lab's review/checkpoint workflow, even though Spec Kit core can work without it. |
| Python | Install a supported, patched [Python version](https://www.python.org/downloads/), **3.11 or newer**, the CLI's minimum. |
| CLI installer | Use approved [uv](https://docs.astral.sh/uv/getting-started/installation/) or pip in a dedicated tool environment. The [shared setup guide](./00-tool-setup.md) includes pip alternatives and installing uv with pip when its usual installer is unavailable. |
| Node.js | Install the latest patched **24.x LTS** from [Node.js](https://nodejs.org/en/download/). Node 20 is end-of-life; do not use it for this workshop. npm is included. |
| Editor and agent | Install current approved [VS Code](https://code.visualstudio.com/docs/setup/setup-overview), sign in to GitHub Copilot, and confirm that Chat **agent mode** and workspace skills are allowed by your organization's policy. |
| Shell and browser | Windows: [PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) or Command Prompt (`cmd.exe`), with PowerShell 7 installed for Spec Kit helpers. macOS/Linux: Bash. Use a current browser with DevTools and a disposable profile for fictional lab data. |
| Listener inspection | Confirm access to `Get-NetTCPConnection` (Windows PowerShell), `netstat` and `findstr` (Windows Command Prompt), `ss` (Linux), or `lsof` (macOS), without elevated privileges. The lab checks the actual server bind address, not just whether a page loads. |

Follow the [shell conventions](../README.md#command-line-shell-options).
Command Prompt uses the Windows `--script ps` templates and launches reviewed
helpers with `pwsh`; there is no `--script cmd` option.

Use your employer's approved installation and certificate/proxy configuration.
Do not pipe a downloaded script directly into a shell, bypass execution policy,
disable TLS verification, or run the workshop as administrator. If installation
is blocked by policy, contact IT before starting.

Check that your Copilot account has the required capabilities and enough
requests for an extended lab. A free plan's allowance might not be sufficient.
Org policies can disable agents even when basic chat works. Confirm sign-in
through the product UI; never put a token into a prompt, source file, screenshot,
or command-line argument. Alternative agents require their own approved
accounts and permissions; they do not remove usage costs or data-handling rules.

### 2. Install the pinned workshop toolkit

**Terminal, any directory - all shells (PowerShell 7, Bash, or Command Prompt):**

```text
git --version
node --version
npm --version
```

Check Python with `python --version` on Windows or `python3 --version` on
macOS/Linux. Check PowerShell 7 with `$PSVersionTable.PSVersion` in PowerShell
or `pwsh --version` in Command Prompt. If a command is missing, complete the
corresponding installation and open a fresh terminal before continuing.

Choose an installer using the [shared setup guide](./00-tool-setup.md).
For the uv route, require `uv --version` to work; if the normal installer is
unavailable, use the guide's approved
[pip installation of uv](./00-tool-setup.md#install-uv-with-pip-when-needed).
For pip-only, prepare and verify the dedicated environment first and require
`python -m pip --version` to point there; uv is not required.

Install the verified **Spec Kit 1.0.1** source using **one** route:

**Terminal - all shells, uv route**
```text
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884
```

**Terminal - all shells, pip alternative in the prepared tool environment**
```text
python -m pip install "specify-cli @ git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884"
```

Apply the matching [PATH commands](./00-tool-setup.md#add-executable-directories-to-path),
then verify the resolved executable and CLI:

**Terminal - all shells**
```text
specify version
specify --help
specify check
```

**Expected:** `specify version` identifies CLI version `1.0.1`. The commit is the
source behind the [1.0.1 release](https://github.com/github/spec-kit/releases/tag/v1.0.1).
The source pin includes bundled templates, but does not lock every transitive
Python dependency, editor version, model, or generated output.

`specify check` reports tool availability, not provenance, account entitlement,
security, or workshop readiness. Missing unrelated agents are not a reason to
install every tool it lists. VS Code Copilot is the guided path; the separate
Copilot CLI is not required.

If `specify` is not found after a successful **uv** installation, add the
directory reported by `uv tool dir --bin` using the shared PATH commands.
For future terminals, uv can update supported shell/user configuration:

**Terminal - all shells, uv route only**
```text
uv tool update-shell
```

For a **pip** installation, add the verified tool environment's `Scripts`
(Windows) or `bin` (macOS/Linux) directory instead; `uv tool update-shell` is
not a pip PATH repair. Restart the terminal application/editor after persistent
changes and retry `specify version`. Inspect command resolution before
reinstalling: a different `specify` earlier on PATH can hide the correct one.

If a different version really is installed in the selected environment,
deliberately replace **that tool environment**, not your project files.
Use only its installer:

**Terminal - all shells, uv reinstall**
```text
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884
```

**Terminal - all shells, pip alternative in the verified tool environment**
```text
python -m pip install --force-reinstall "specify-cli @ git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884"
```

**Terminal - all shells, after a successful replacement**
```text
specify version
```

`--force` and `--force-reinstall` apply to tool installation, never project
initialization. Do not use pip inside a uv-managed environment.
Do not run an unpinned install or `specify self upgrade` during class. CLI
installation and upgrading an existing project's generated files are separate
operations; see the [brownfield guide](./04-adapting-existing-projects.md).

### 3. Establish safe agent permissions

Open only an empty, dedicated workshop folder, not your home directory or a
production repository. Review a downloaded repository before granting
[Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust).
Restricted Mode intentionally disables agents; do not trust an unfamiliar
project merely to dismiss a warning.

In VS Code, select manual tool permissions and review existing user/workspace
terminal auto-approval rules. **Do not choose Allow all, Bypass Approvals, or
Autopilot for the student exercises.** Use session-scoped approval for understood
actions. Where your platform supports agent sandboxing, use it under your
organization's policy; approvals alone are not a sandbox.

Keep cloud tools, additional MCP servers, and unrelated extensions out of the
lab. Use fictional book titles and authors only. Agent context can leave your
machine even when the app is local. `.gitignore` is not a data-loss-prevention
or prompt-context boundary.

## Readiness check

You are ready when each item is true:

- [ ] Git, Python >=3.11, Node 24.x, and npm resolve in a fresh terminal.
- [ ] The selected installer works: uv, or pip in the verified tool environment.
- [ ] PATH resolves the intended `specify` in each terminal and the editor.
- [ ] Your chosen shell works; on Windows, `pwsh --version` reports PowerShell 7.
- [ ] `specify version` shows `1.0.1`.
- [ ] VS Code Copilot can respond in agent mode under the intended account.
- [ ] Your organization permits this workflow and you know your usage limits.
- [ ] You can open browser DevTools in a disposable profile.
- [ ] You have a separate scratch location, no production data/credentials in it,
  and manual approvals enabled.

If any item is blocked, resolve it before starting. Working with a partner in
an approved environment is preferable to bypassing policy. Record which checks
you performed yourself; observing a partner does not count as independently
completing the hands-on acceptance checks.

## CLI reference

**Terminal:** initialize only a **new** project directory. Run one shell variant,
not all three. The lab explains the subsequent Git setup and checkpoints.

PowerShell:

```powershell
specify init booknook --integration copilot --script ps
Set-Location booknook
specify integration status
```

Bash:

```bash
specify init booknook --integration copilot --script sh
cd booknook
specify integration status
```

Command Prompt (`cmd.exe`, with PowerShell 7 installed for the generated helpers):

```cmd
specify init booknook --integration copilot --script ps && cd /d booknook && specify integration status
```

**Expected:** default Copilot skills under
`.github/skills/speckit-<name>/SKILL.md`, shared `.specify/` infrastructure, and
the selected shell's helpers. Core 1.0.1 does not initialize Git or make feature
branches. The active feature is selected through `.specify/feature.json`
(or `SPECIFY_FEATURE_DIRECTORY`), not by switching Git branches alone.

| Integration selection at init | Where to interact | Invocation example |
| --- | --- | --- |
| `--integration copilot` (guided path) | VS Code Copilot agent chat | `/speckit-specify` |
| `--integration claude` | Approved Claude Code session in the project | `/speckit-specify` |
| `--integration gemini` | Approved Gemini CLI session in the project | `/speckit.specify` |
| Copilot with `--integration-options="--commands"` (legacy, not this lab) | VS Code Copilot chat | `/speckit.specify` |

These are **chat invocations**, not executable terminal commands. Claude and
Gemini are reference AI integrations, not complete alternate workshop tracks.
The separate [noGHCP series](./noGHCP/README.md) uses the CLI's `generic`
integration with `--integration-options="--commands-dir .manual/commands"`.
Its `.manual/commands/speckit.<phase>.md` files are guidance, not executable
slash commands or native `specify` subcommands. Use that series'
[manual phase equivalents](./noGHCP/README.md#slash-command-phases-and-their-no-ai-equivalents);
do not execute generated workflows or install an AI interpreter/custom runner.
Do not mix integration modes or assume every agent has the same permission UI.
Legacy Copilot commands mode generates `.github/agents/`, `.github/prompts/`,
and VS Code settings including script auto-approvals; review/remove those
approvals before applying this workshop's manual-review baseline.

Within a project, `specify integration list` and `specify integration status`
show installed integration information; `specify integration list --catalog`
lists catalog entries. Do not install extra integrations or run external-write
commands such as taskstoissues just to explore. The complete guided command
sequence is in the [lab](./03-walkthrough-and-lab.md).

## Sources and version boundary

Baseline reviewed **September 22, 2026**. Release-specific claims use frozen
1.0.1 source:

- [CLI reference](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/docs/reference/core.md)
  and [integration reference](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/docs/reference/integrations.md).
- [Copilot integration implementation](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/src/specify_cli/integrations/copilot/__init__.py)
  and [legacy VS Code settings](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/templates/vscode-settings.json).
- Live references: [VS Code agent security](https://code.visualstudio.com/docs/agents/run/security),
  [tool approvals](https://code.visualstudio.com/docs/agents/run/approvals),
  [agent skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills),
  [uv tool management](https://docs.astral.sh/uv/concepts/tools/), and
  [Node support status](https://nodejs.org/en/about/previous-releases).

[Back to overview](../README.md) | [Begin the hands-on lab](./03-walkthrough-and-lab.md)
