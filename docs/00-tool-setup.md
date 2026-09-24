# Shared CLI installation and PATH setup

Use this guide with either track's prerequisites:
[Copilot](./02-spec-kit-breakdown.md) or
[noGHCP](./noGHCP/01-prerequisites.md). It covers **PowerShell 7, Bash, and
Windows Command Prompt (`cmd.exe`)**; follow the
[shell conventions](../README.md#command-line-shell-options).

The application still needs no `npm install`. These instructions install
**development tools**, not BookNook dependencies.

## Choose an installation route

| Situation | Route |
| --- | --- |
| An approved uv installation already works | Use your track's pinned `uv tool install` command, then add the uv tool executable directory to PATH below. |
| The usual uv installer/package manager is unavailable, but pip is approved | Prepare the isolated environment below, install **uv with pip**, then use your track's `uv tool install` command. Both executable directories need to be on PATH. |
| You want to install Specify without uv | Prepare the isolated environment, then use your track's pinned **pip alternative**. uv is not required for this route or the workshop's core CLI/helper operations. |

Choose **one manager for Specify**. Do not use pip to modify uv-managed tool
environments, or install a second copy to conceal a broken first installation.
Installing uv with pip and Specify with `uv tool install` is supported: they
live in separate environments.

These are alternative **approved installation methods**, not ways around
organizational restrictions. Both Specify installers need Git, access to the
pinned GitHub source, and an approved Python package index for dependencies.
pip cannot bypass a blocked GitHub/PyPI endpoint or a prohibition on the tools.
Use your organization's proxy/certificate/index configuration; ask IT for an
approved distribution if needed. Never use administrator privileges, `sudo pip`,
`--break-system-packages`, disabled TLS verification, or an execution-policy
bypass.

## Prepare an isolated pip environment

Skip this section if uv already works and you will use only the uv route.
Otherwise, create **one new tool environment outside every project**. This
keeps pip away from system Python and application environments, including on
systems with an externally managed Python installation.

First verify the base interpreter: **Python 3.12 for noGHCP**, or **3.11+ for
Copilot**. In the Windows blocks, `python` must be that approved interpreter;
in Bash, `python3` must be. If necessary, use its approved absolute path for
the creation command, or `py -3.12` on Windows / `python3.12` on macOS/Linux
when those commands are installed. Do not let pip select a different Python
version silently.

Run **one** block. It refuses an existing `speckit-tools` directory; if you
already created this exact workshop environment, skip creation and use
[the PATH-only commands](#pip-environment-path) instead. Otherwise choose a
different unused name and use it consistently in every command below.
Stop on any error; preserve partial work rather than recreating over it.

**Terminal - Windows PowerShell 7**
```powershell
$tools = Join-Path $HOME 'speckit-tools'
if (Test-Path -LiteralPath $tools) { throw 'Existing speckit-tools: inspect it or choose an unused name.' }
python -m venv $tools
if ($LASTEXITCODE -ne 0) { throw 'Environment creation failed; stop and inspect the error.' }
$env:Path = (Join-Path $tools 'Scripts') + ';' + $env:Path
```

**Terminal - macOS/Linux Bash**
```bash
if [ -e "$HOME/speckit-tools" ] || [ -L "$HOME/speckit-tools" ]; then
  printf '%s\n' 'Stop: existing speckit-tools. Inspect it or choose an unused name.' >&2
else
  python3 -m venv "$HOME/speckit-tools" &&
    export PATH="$HOME/speckit-tools/bin:$PATH" && hash -r
fi
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
if exist "%USERPROFILE%\speckit-tools" (
  echo Stop: existing speckit-tools. Inspect it or choose an unused name.
) else (
  python -m venv "%USERPROFILE%\speckit-tools" && ^
    set "PATH=%USERPROFILE%\speckit-tools\Scripts;%PATH%"
)
```

**Terminal - all shells, after successful preparation**
```text
python --version
python -c "from pathlib import Path; import sys; print(sys.executable); sys.exit(0 if sys.prefix != sys.base_prefix and Path(sys.prefix).resolve() == (Path.home() / 'speckit-tools').resolve() else 'Stop: use the dedicated workshop environment')" && python -m pip --version
```

Require the chosen Python version and paths inside **your `speckit-tools`
environment** before any pip install. Here and in the linked installation
examples, `python -m pip` means this environment's Python, even on macOS/Linux.
No `Activate.ps1`, activation-policy change, or bare global `pip` command is
needed. If you changed the environment name, update the verification path too.

If pip alone is missing from the **verified environment**, run
`python -m ensurepip --upgrade`, then repeat `python -m pip --version`.
If Python's `venv`/`ensurepip` support is unavailable (some Linux distributions
package it separately), obtain the approved matching package from IT rather
than installing into system Python.

## Install uv with pip when needed

Use this only for the **pip-installed uv route**, after the environment check
above. Use your organization's approved uv version/index when required.

**Terminal - all shells, verified `speckit-tools` environment**
```text
python -m pip install uv
uv --version
```

This avoids the standalone download-and-execute installer and requires no
admin rights. It does not override application-control policy. If pip cannot
obtain an approved uv wheel for your platform, ask for an approved binary;
do not install a new compiler toolchain just to finish setup.

Now return to your track's **pinned Specify installation**:
[Copilot](./02-spec-kit-breakdown.md#2-install-the-pinned-workshop-toolkit) or
[noGHCP](./noGHCP/01-prerequisites.md#install-and-verify-the-official-cli).
Use its uv command if you installed uv; use its pip alternative if you chose
pip-only. Both pin Spec Kit **1.0.1** to the same source commit.

## Add executable directories to PATH

PATH contains **directories**, not executable filenames. Preserve existing
entries. These commands affect only the current terminal; repeat them in
each new terminal, including Terminal B and editor terminals, unless you
make the entries persistent as described below.

### Pip environment PATH

For Specify installed by pip, or uv installed by pip, add the environment's
`Scripts` directory on Windows or `bin` directory on macOS/Linux. These
PATH-only commands are safe to reuse after creating the environment:

**Terminal - Windows PowerShell 7**
```powershell
$bin = Join-Path $HOME 'speckit-tools\Scripts'
if (-not (Test-Path -LiteralPath (Join-Path $bin 'python.exe'))) { throw 'Workshop Python is missing; inspect the environment first.' }
$env:Path = "$bin;$env:Path"
```

**Terminal - macOS/Linux Bash**
```bash
if [ -x "$HOME/speckit-tools/bin/python" ]; then
  export PATH="$HOME/speckit-tools/bin:$PATH"
  hash -r
else
  printf '%s\n' 'Stop: workshop Python is missing. Inspect the environment first.' >&2
fi
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
if exist "%USERPROFILE%\speckit-tools\Scripts\python.exe" (
  set "PATH=%USERPROFILE%\speckit-tools\Scripts;%PATH%"
) else (
  echo Stop: workshop Python is missing. Inspect the environment first.
)
```

With that interpreter selected, this also prints the exact pip scripts
directory, without guessing a Python-version-specific installation path:

**Terminal - all shells, verified pip environment**
```text
python -c "import sysconfig; print(sysconfig.get_path('scripts'))"
```

### Specify installed by uv

uv's own executable and the executables installed by `uv tool install` can
live in **different directories**. First require `uv --version` to succeed;
after a successful Specify install, obtain the actual tool executable
directory with `uv tool dir --bin`, not the directory of a cached environment.
Do not assume it is always `~/.local/bin`; uv supports location overrides.

**Terminal - Windows PowerShell 7**
```powershell
$bin = uv tool dir --bin
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath (Join-Path $bin 'specify.exe'))) {
  throw 'Cannot find the uv-installed Specify executable; inspect installation output.'
}
$env:Path = "$bin;$env:Path"
```

**Terminal - macOS/Linux Bash**
```bash
if bin="$(uv tool dir --bin)" && [ -x "$bin/specify" ]; then
  export PATH="$bin:$PATH"
  hash -r
else
  printf '%s\n' 'Stop: cannot find the uv-installed Specify executable.' >&2
fi
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
for /f "delims=" %I in ('uv tool dir --bin') do @if exist "%I\specify.exe" (set "PATH=%I;%PATH%") else (echo Stop: specify.exe was not found in the uv tool directory.)
```

The Command Prompt block uses interactive `%I` syntax, not batch-file `%%I`.
If uv reports an error or no directory, stop; do not treat an older `specify`
elsewhere on PATH as a successful install. Finish with the resolution/version
checks below.

### Keep PATH entries for future terminals

For **uv-installed tool executables**, uv can update supported shell/user
configuration for you:

**Terminal - all shells, uv route only**
```text
uv tool update-shell
```

Review its reported change and restart your terminal application/editor.
This does **not** replace the separate PATH entry for pip-installed uv in
`speckit-tools`, and is not a repair command for a pip-only Specify install.

For **pip-installed tools or another approved tool directory on Windows**,
you can instead add its absolute directory under **Environment Variables ->
User variables -> Path -> New**, preserving all existing entries, or use
one of these equivalent commands. Paste only a reviewed **absolute directory
path without surrounding quotes** when prompted. These update **User** PATH,
not Machine PATH, and do not modify the current shell:

**Terminal - Windows PowerShell 7**
```powershell
$bin = Read-Host 'Absolute path to the approved Scripts or tool directory'
if (-not [IO.Path]::IsPathFullyQualified($bin) -or $bin.Contains(';') -or
    -not (Test-Path -LiteralPath $bin -PathType Container)) {
  throw 'Use an existing absolute directory without semicolons.'
}
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if (($userPath -split ';') -notcontains $bin) {
  $updated = if ([string]::IsNullOrEmpty($userPath)) { $bin } else { "$bin;$userPath" }
  [Environment]::SetEnvironmentVariable('Path', $updated, 'User')
}
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
pwsh -NoProfile -Command ^
  "$bin = Read-Host 'Absolute path to the approved Scripts or tool directory';" ^
  "if (-not [IO.Path]::IsPathFullyQualified($bin) -or $bin.Contains(';') -or -not (Test-Path -LiteralPath $bin -PathType Container)) { throw 'Use an existing absolute directory without semicolons.' };" ^
  "$userPath = [Environment]::GetEnvironmentVariable('Path', 'User');" ^
  "if (($userPath -split ';') -notcontains $bin) { $updated = if ([string]::IsNullOrEmpty($userPath)) { $bin } else { $bin + ';' + $userPath }; [Environment]::SetEnvironmentVariable('Path', $updated, 'User') }"
```

Do not use `setx PATH "%PATH%;..."`: it can truncate PATH and copy the combined
Machine/User value into User PATH. Do not replace the full existing PATH.

For **Bash**, add the following line once, using your editor, to the **existing
startup file your terminal actually loads**: typically `~/.bashrc` for
interactive non-login shells; a login shell reads the first existing file of
`~/.bash_profile`, `~/.bash_login`, and `~/.profile`. Do not blindly create a
new login profile that would hide an existing one. Preserve its other content.

**File content - existing Bash startup file, pip environment route**
```bash
export PATH="$HOME/speckit-tools/bin:$PATH"
```

For another approved executable directory, use its actual absolute path in
the same `export PATH="directory:$PATH"` form. For uv's tool executable
directory, prefer `uv tool update-shell` and review the file it changes.

Close and reopen **Windows Terminal/VS Code/the terminal application**, not
just a tab that inherits an old process environment. Recheck command resolution.
Windows Machine PATH entries can still take precedence over User entries;
use the current-session prepend commands if needed, and review conflicting
installations with IT rather than deleting or overwriting them blindly.

## Verify resolution and diagnose missing tools

Confirm which executables the shell will actually run:

**Terminal - Windows PowerShell 7**
```powershell
Get-Command python, git, node, npm, pwsh, specify -All | Format-List Name, CommandType, Source
```

**Terminal - macOS/Linux Bash**
```bash
type -a python3 git node npm specify
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
where.exe python
where.exe git
where.exe node
where.exe npm
where.exe pwsh
where.exe specify
```

For the uv route, also locate `uv` with `Get-Command uv -All`, `type -a uv`,
or `where.exe uv` respectively, and run `uv --version`. For the pip route,
repeat the environment/Python/pip checks before installing or reinstalling.

**Terminal - all shells**
```text
git --version
node --version
npm --version
specify --version
specify check
```

Require `specify 1.0.1`, Node `v24.x.x`, and the intended executable paths.
`specify check` reports availability, not account entitlement or a successful
classroom rehearsal. Missing unused AI tools is not an installation failure.

| Symptom | Action |
| --- | --- |
| `uv` installed with pip but not found | Reapply the pip environment PATH block; verify that `python -m pip --version` points to that environment, not another Python installation. |
| `specify` installed with uv but not found | Add the directory printed by `uv tool dir --bin`; uv being on PATH is not sufficient. |
| `specify` installed with pip but not found | Add the verified environment's scripts directory; do not use `uv tool update-shell` for this route. |
| Wrong Specify version or multiple matches | Inspect the resolution output and prepend the chosen installation's directory for this terminal. Do not run a force reinstall against an unidentified installation. |
| `python`/`python3` launches the Microsoft Store or an unexpected version | Check Windows App execution aliases and the approved Python installer's PATH settings with IT. Helpers can look for `python3` as well as `python`; an alias is not proof that Python works. |
| Git, Node/npm, or `pwsh` is missing | Use the approved installer's PATH option, or add its actual executable directory using the PATH instructions above. Typical Windows locations include Git's `cmd` directory, Node's installation directory, and PowerShell's installation directory; verify your locations instead of assuming them. npm ships with Node. |
| A project `.ps1`/`.sh` helper is not found | Run from the correct scratch project and use the lab's explicit relative path (`pwsh -NoProfile -File` from Command Prompt). Do not add the repository, `.`, or unreviewed project scripts to global PATH. |

Do not relocate/delete the tool environment or its base Python during the
workshop: installed launchers can refer to absolute interpreter paths.

## Sources

- [Pinned Spec Kit package metadata](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/pyproject.toml): `specify-cli` 1.0.1, Python >=3.11, and the `specify` console entry point.
- [Python virtual environments](https://docs.python.org/3/library/venv.html): pip isolation and running without activation.
- [uv installation, including pip](https://docs.astral.sh/uv/getting-started/installation/#pypi) and [tool executable directories](https://docs.astral.sh/uv/concepts/tools/#tool-executables).

[All tracks](../README.md) | [Copilot prerequisites](./02-spec-kit-breakdown.md) | [noGHCP prerequisites](./noGHCP/01-prerequisites.md)
