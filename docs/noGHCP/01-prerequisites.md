# noGHCP: Spec Kit CLI and manual-workshop prerequisites

**No AI tools or accounts are needed.** Prepare these ordinary development
tools before the workshop; setup is outside the 390-minute lab budget.
You will use the official CLI for scaffolding and its shell helpers for
mechanical steps, then write, review, and implement the artifacts yourself.

**Capability boundary:** Spec Kit 1.0.1 does not execute `/speckit.*` workflows
as native terminal commands. They are agent instructions. The lab provides
manual equivalents for those phases, not a custom or hidden AI runtime.

## Tools

| Requirement | Preparation |
| --- | --- |
| Basic skills | Navigate folders, edit text, run terminal commands, and read basic JavaScript. The lab supplies templates and guided exercises. |
| Git | Install an approved current [Git release](https://git-scm.com/downloads). No GitHub account, remote repository, or publishing is required. |
| Python | Use a current patched [Python 3.12.x](https://www.python.org/downloads/) for this lab. Spec Kit's minimum is 3.11; Python 3.12 is the workshop baseline. |
| CLI installer | Use approved [uv](https://docs.astral.sh/uv/getting-started/installation/) or pip in a dedicated Python 3.12 tool environment. The [shared setup guide](../00-tool-setup.md) also shows how to install uv with pip if its usual installer is unavailable. |
| Specify CLI | Install **Spec Kit 1.0.1** from the pinned official source using the commands below. |
| Node.js | Install the latest patched [Node.js 24 LTS](https://nodejs.org/en/download/); npm comes with it. Do not use end-of-life Node 20. |
| Editor | Any plain text/code editor. No extensions are required; leave AI assistance disabled for these exercises. |
| Shell | Windows: [PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) or Command Prompt (`cmd.exe`), with PowerShell 7 installed for the helpers and guarded setup. macOS/Linux: Bash. Use one environment consistently; do not mix Windows and WSL paths/tools. |
| Browser | A current browser with DevTools and a disposable local profile, without account sign-in/sync. Use one app tab and fictional data. |
| Listener inspection | `Get-NetTCPConnection` in Windows PowerShell, `netstat` and `findstr` in Windows Command Prompt, `ss` on Linux, or `lsof` on macOS, without elevation. |

You do **not** need Copilot, Claude Code, another AI tool, API credentials,
an Azure subscription, or paid agent access. Python runs the toolkit; uv or pip
installs it. Node runs the application and tests. They do not execute agent prompts.
Follow your organization's approved installation/proxy/certificate process.
Do not pipe downloaded scripts directly into a shell, bypass execution policy
or TLS checks, or run the workshop as administrator.

Use the [shell conventions](../../README.md#command-line-shell-options).
Command Prompt selects `--script ps` and runs the reviewed PowerShell helpers
with `pwsh`; Spec Kit 1.0.1 does not supply a `--script cmd` variant.

## Obtain the materials

Obtain a trusted copy of this repository from the instructor or an approved
checkout/download. Keep the following together:

```text
docs/noGHCP/
  README.md
  01-prerequisites.md
  02-hands-on-lab.md
  03-validation-and-handoff.md
  starter/
    package.json
    server.mjs
    index.html
    styles.css
    src/
    tests/
```

Also retain the starter's hidden `.gitignore`. If using a downloaded archive,
extract it first. Reading documents on a website is not a local starter copy.
The lab asks you for the **absolute path to the supplied `starter` folder**,
then initializes a new Spec Kit project and copies only the supplied application
files into it without overwriting the generated scaffolding.

The starter has no npm dependencies. Do not run `npm install`, install unrelated
global packages, download a framework, or fetch an AI-generated replacement.
Its supplied baseline already adds/lists/persists books; the exercises add the
missing status/filter and search behavior through your own edits.

## Install and verify the official CLI

Open an ordinary terminal. These commands only print installed versions.

**Terminal - all shells (PowerShell 7, Bash, or Command Prompt)**
```text
git --version
node --version
npm --version
```

Then run your shell's additional version checks:

**Terminal - Windows PowerShell 7**
```powershell
python --version
$PSVersionTable.PSVersion
```

**Terminal - macOS/Linux Bash**
```bash
python3 --version
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
python --version
pwsh --version
```

Require the approved Python 3.12 patch and Node `v24.x.x` (plus PowerShell 7
on Windows, even when using Command Prompt). Resolve missing tools before
class without changing execution policy or disabling TLS.

Choose an installer with the [shared setup guide](../00-tool-setup.md).
The uv route needs `uv --version` to work; use
[pip to install uv](../00-tool-setup.md#install-uv-with-pip-when-needed) if that
approved method is available instead of the normal installer. The pip-only
route needs the guide's dedicated **Python 3.12** environment and its pip,
but does not need uv. Do not install into system Python or an application's
environment.

Run **one** installation alternative:

**Terminal - all shells, uv route**
```text
uv tool install --python 3.12 specify-cli --from git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884
```

**Terminal - all shells, pip alternative in the prepared Python 3.12 environment**
```text
python -c "import sys; sys.exit(0 if sys.version_info[:2] == (3, 12) else 'Use the Python 3.12 workshop environment')" && python -m pip install "specify-cli @ git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884"
```

After successful installation, apply the route's
[PATH commands](../00-tool-setup.md#add-executable-directories-to-path) and
verify the selected executable:

**Terminal - all shells**
```text
specify --version
specify init --help
specify check
```

**Expected:** `specify 1.0.1`; init help includes `--integration`,
`--integration-options`, and `--script`. `specify check` reports tool availability,
not readiness or document quality. Missing AI agents is acceptable: this track
selects `generic`, which does not require an agent executable.

If `specify` is not found, fix PATH **before reinstalling**. For uv, add the
directory from `uv tool dir --bin`; `uv tool update-shell` can persist it.
For pip, add the verified environment's `Scripts` or `bin` directory instead.
The shared guide supplies commands for all three shells and persistence.
Restart the terminal application/editor after persistent changes; each terminal
must resolve the intended installation.

If another version is actually installed in that environment, first review
other projects' needs, then deliberately replace only the tool environment
using **one** matching installer:

**Terminal - all shells, uv reinstall**
```text
uv tool install --python 3.12 --force specify-cli --from git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884
```

**Terminal - all shells, pip alternative in the verified Python 3.12 environment**
```text
python -c "import sys; sys.exit(0 if sys.version_info[:2] == (3, 12) else 'Use the Python 3.12 workshop environment')" && python -m pip install --force-reinstall "specify-cli @ git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884"
```

**Terminal - all shells, after a successful replacement**
```text
specify --version
```

Here `--force` (uv) and `--force-reinstall` (pip) belong to tool installation,
**not** project initialization. Do not use pip inside a uv-managed environment.
The source pin includes Spec Kit's bundled templates; it does not lock every
transitive Python dependency. Do not run an unpinned install or upgrade in class.
Tool installation needs network access; finish it in advance for offline work.

Review the starter's `package.json` and scripts before execution. The allowed
application commands will be `npm test`, `npm run check`, and `npm start`,
using built-in Node functionality. Review the CLI-generated helper scripts before
running them as well. There is no agent login, model configuration, cloud setup,
or AI-generated specification. Do not install extensions/presets or run
`specify workflow run`: the presence of generated workflow files does not make
agent execution a manual operation.

## Ready to begin

- [ ] Git, Python 3.12, patched Node 24, npm, and the chosen shell work.
- [ ] The selected installer works: uv, or pip in the verified Python 3.12 tool environment.
- [ ] PATH resolves the intended `specify` in each workshop terminal.
- [ ] On Windows, `pwsh --version` reports PowerShell 7, including for Command Prompt users.
- [ ] `specify --version` reports `1.0.1`, with the expected init options.
- [ ] The documents and complete starter are available locally.
- [ ] You can edit ordinary files and inspect browser DevTools.
- [ ] A new scratch location and disposable unsynced browser profile are available.
- [ ] You can inspect a local listening socket without administrator privileges.
- [ ] You will use fictional inputs and disable AI assistance in your editor.

After successful installation and material preparation, the documented generic
scaffold and helper operations use bundled local assets. External reference
links are optional reading, not steps needed to finish. If working alone,
perform the written self-review checklists yourself and record remaining
uncertainty; do not invent a second reviewer's approval.

## Frozen toolkit references

- [Spec Kit 1.0.1 core CLI](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/docs/reference/core.md).
- [Generic integration](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/src/specify_cli/integrations/generic/__init__.py):
  writes Markdown command guidance; does not execute an agent.
- [Slash-command templates](https://github.com/github/spec-kit/tree/9118ed15a0ba65053469a94c560ea5d233f75884/templates/commands):
  instructions normally interpreted by an agent, not extra CLI subcommands.

[noGHCP overview](./README.md) | [Next: manual hands-on lab](./02-hands-on-lab.md)
