# noGHCP: Official CLI scaffolding and manual development

[Overview](./README.md) -> [Prerequisites](./01-prerequisites.md) ->
**02: Manual lab** -> [03: Validation, change, handoff](./03-validation-and-handoff.md)

You are the author, implementer, and reviewer. The official Spec Kit 1.0.1 CLI
and local helpers scaffold files; no AI tool generates their substantive content
or implements code. Complete the Python, uv-or-pip, and CLI
[prework](./01-prerequisites.md).

**Slash-command labels are not terminal commands.** The generic integration
writes `.manual/commands/speckit.<phase>.md` guidance. A normal agent interprets
those instructions; here you perform the phases using the supported native
operations below. There is no built-in AI-free `/speckit.*` executor. See the
[phase mapping](./README.md#slash-command-phases-and-their-no-ai-equivalents).

The supplied application already adds, lists, and persists fictional books
(US1). You will **specify new status/filter behavior before implementing it**
(US2), then repeat the process for search (US3). Do not claim that you wrote the
supplied infrastructure or tested an exercise that remains incomplete.

| Checkpoint | Minutes | Exit evidence |
| --- | ---: | --- |
| [1. Initialize and inspect the baseline](#checkpoint-1) | 30 | CLI scaffolding and supplied US1 baseline work |
| [2. Write rules and intent](#checkpoint-2) | 60 | Human-authored constitution, requirements, decisions |
| [3. Plan, decompose, review](#checkpoint-3) | 50 | Explicit contracts, tasks, and traceability |
| [4. Implement status/filter](#checkpoint-4) | 110 | Observed red/green and manual UI evidence |
| [5. Validate](./03-validation-and-handoff.md#checkpoint-5) | 60 | Security, browser, and failure evidence |
| [6. Search and handoff](./03-validation-and-handoff.md#checkpoint-6) | 80 | Reviewed second iteration and handoff |

Total: **390 minutes**, excluding prework/breaks. This document covers the first
250 minutes. These are facilitator budgets, not a guarantee of completion.

## How to follow the instructions

- **Terminal** means PowerShell 7, Bash, or Windows Command Prompt (`cmd.exe`)
  in your scratch project. **All shells** marks commands that are identical in
  all three. **File content** means edit the named file with your text editor.
- Command Prompt uses `--script ps` and launches the reviewed Windows helpers
  and guarded setup through **PowerShell 7 (`pwsh`)**; it must still be installed.
  Follow the [shell conventions](../../README.md#command-line-shell-options):
  `cmd` blocks are for an interactive prompt, and continuation carets (`^`)
  must have no trailing spaces. Run only one shell variant for each step.
- **Terminal A** runs ordinary commands and later the foreground server.
  **Terminal B** is a second shell in the same folder when A is serving.
  Apply the [PATH setup](../00-tool-setup.md#add-executable-directories-to-path)
  in both terminals, or restart the terminal application after persistent changes.
- Write your own decisions into the provided templates. Replace every
  `[YOUR ...]` field; do not mark evidence passed before observing it.
- A partner may review your work. Solo students use the same concrete
  self-review questions and label the result as self-review, not peer approval.
- No application dependency install, account, remote repository, commit, push,
  deployment, or AI tool is required. Do not change machine security policy.
- Do not install Spec Kit extensions/presets or execute its generated workflow.
  Read helper scripts before running them; their outputs establish structure,
  not human review, semantic correctness, or completion.

<a id="checkpoint-1"></a>
## Checkpoint 1: Initialize and inspect the baseline - 30 minutes

Complete [prework](./01-prerequisites.md) first. In your file manager locate the
provided `docs/noGHCP/starter` folder and copy its **absolute path**. The commands
below initialize a **new** project with the generic integration, then copy only
the starter's known application files without replacing the scaffolding.
Use only your shell's block; never use `--here --force` to repurpose an existing
project. Keep the new project outside the teaching repository.

**Terminal - all shells**
```text
specify --version
specify check
```

Require `specify 1.0.1`. Missing agent executables in the availability report is
not a reason to install them. If any `SPECIFY_INIT_DIR`, `SPECIFY_FEATURE`, or
`SPECIFY_FEATURE_DIRECTORY` environment override is set from previous work, use
a fresh shell without those overrides before continuing; they can redirect
native helpers to a different project or feature.

**Terminal - Windows PowerShell 7**
```powershell
foreach ($name in @('SPECIFY_INIT_DIR', 'SPECIFY_FEATURE', 'SPECIFY_FEATURE_DIRECTORY')) {
  if ([Environment]::GetEnvironmentVariable($name)) { throw "Remove the stale $name override in this shell first." }
}
$source = Read-Host 'Absolute path to the supplied docs\noGHCP\starter folder'
$source = (Resolve-Path -LiteralPath $source -ErrorAction Stop).Path
$entries = @('.gitignore', 'package.json', 'server.mjs', 'index.html', 'styles.css', 'src', 'tests')
foreach ($required in $entries) {
  if (-not (Test-Path -LiteralPath (Join-Path $source $required))) {
    throw "Incomplete starter: $required is missing."
  }
}
$parent = Join-Path $HOME 'speckit-labs'
New-Item -ItemType Directory -Path $parent -Force -ErrorAction Stop | Out-Null
$destination = Join-Path $parent 'booknook-manual'
if (Test-Path -LiteralPath $destination) { throw 'Choose a new scratch destination; preserve existing work.' }
Set-Location $parent -ErrorAction Stop
specify init booknook-manual --integration generic --integration-options="--commands-dir .manual/commands" --script ps
if ($LASTEXITCODE -ne 0) { throw 'Initialization failed; inspect output and preserve partial work.' }
foreach ($entry in $entries) {
  if (Test-Path -LiteralPath (Join-Path $destination $entry)) {
    throw "Unexpected existing $entry; do not overwrite it."
  }
}
foreach ($entry in $entries) {
  Copy-Item -LiteralPath (Join-Path $source $entry) -Destination $destination -Recurse -ErrorAction Stop
}
Set-Location $destination -ErrorAction Stop
git init
if ($LASTEXITCODE -ne 0) { throw 'Git initialization failed; stop and inspect the scratch project.' }
Get-Location
```

**Terminal - macOS/Linux Bash**
```bash
read -r -p 'Absolute path to the supplied docs/noGHCP/starter folder: ' source
parent="$HOME/speckit-labs"
destination="$HOME/speckit-labs/booknook-manual"
(
  set -euo pipefail
  if [ -n "${SPECIFY_INIT_DIR:-}${SPECIFY_FEATURE:-}${SPECIFY_FEATURE_DIRECTORY:-}" ]; then
    printf '%s\n' 'Stop: remove stale SPECIFY overrides in this shell first.'; exit 1
  fi
  [[ "$source" = /* ]] || { printf '%s\n' 'Stop: use an absolute starter path.'; exit 1; }
  for entry in .gitignore package.json server.mjs index.html styles.css src tests; do
    [ -e "$source/$entry" ] || { printf 'Missing starter entry: %s\n' "$entry"; exit 1; }
  done
  [ ! -e "$destination" ] && [ ! -L "$destination" ] ||
    { printf '%s\n' 'Stop: preserve the existing destination; choose a fresh one.'; exit 1; }
  mkdir -p "$parent" || exit 1
  cd "$parent" || exit 1
  specify init booknook-manual --integration generic --integration-options="--commands-dir .manual/commands" --script sh || exit 1
  for entry in .gitignore package.json server.mjs index.html styles.css src tests; do
    [ ! -e "$destination/$entry" ] && [ ! -L "$destination/$entry" ] ||
      { printf 'Stop: do not overwrite %s\n' "$entry"; exit 1; }
  done
  for entry in .gitignore package.json server.mjs index.html styles.css src tests; do
    cp -R "$source/$entry" "$destination/" || exit 1
  done
  cd "$destination" || exit 1
  git init || exit 1
  pwd || exit 1
) && cd "$destination"
```

The Command Prompt variant runs the same guards and copy operations in a
PowerShell 7 child process, then changes the **Command Prompt's** directory only
if that process succeeds. No policy bypass or extra script file is needed.

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
pwsh -NoProfile -Command ^
  "$ErrorActionPreference = 'Stop';" ^
  "foreach ($name in @('SPECIFY_INIT_DIR', 'SPECIFY_FEATURE', 'SPECIFY_FEATURE_DIRECTORY')) { if ([Environment]::GetEnvironmentVariable($name)) { throw ('Remove the stale ' + $name + ' override in this shell first.') } };" ^
  "$source = Read-Host 'Absolute path to the supplied docs\noGHCP\starter folder';" ^
  "$source = (Resolve-Path -LiteralPath $source).Path;" ^
  "$entries = @('.gitignore', 'package.json', 'server.mjs', 'index.html', 'styles.css', 'src', 'tests');" ^
  "foreach ($entry in $entries) { if (-not (Test-Path -LiteralPath (Join-Path $source $entry))) { throw ('Incomplete starter: ' + $entry + ' is missing.') } };" ^
  "$parent = Join-Path $env:USERPROFILE 'speckit-labs';" ^
  "New-Item -ItemType Directory -Path $parent -Force | Out-Null;" ^
  "$destination = Join-Path $parent 'booknook-manual';" ^
  "if (Test-Path -LiteralPath $destination) { throw 'Choose a new scratch destination; preserve existing work.' };" ^
  "Set-Location $parent;" ^
  "specify init booknook-manual --integration generic --integration-options='--commands-dir .manual/commands' --script ps;" ^
  "if ($LASTEXITCODE -ne 0) { throw 'Initialization failed; inspect output and preserve partial work.' };" ^
  "foreach ($entry in $entries) { if (Test-Path -LiteralPath (Join-Path $destination $entry)) { throw ('Unexpected existing ' + $entry + '; do not overwrite it.') } };" ^
  "foreach ($entry in $entries) { Copy-Item -LiteralPath (Join-Path $source $entry) -Destination $destination -Recurse };" ^
  "Set-Location $destination;" ^
  "git init;" ^
  "if ($LASTEXITCODE -ne 0) { throw 'Git initialization failed; stop and inspect the scratch project.' };" ^
  "Get-Location" && cd /d "%USERPROFILE%\speckit-labs\booknook-manual"
```

**Gate:** the printed location is your new scratch folder, not the teaching
repository. If copying failed, inspect the error and preserve partial work;
do not continue in the old directory or delete an unrelated folder.

Core initialization does not create Git history or branches; the commands above
run `git init` explicitly. No optional Git extension is installed.

Inspect `.manual/commands/` (ten guidance files), `.specify/templates/`,
`.specify/memory/constitution.md`, the chosen shell's helpers, and managed
`.specify/.gitignore`. Preserve its exclusion for the machine-local
`.specify/feature.json` pointer while keeping shareable templates/scripts tracked.
The generated `.specify/workflows/` content is not executed in this track.

**Terminal - all shells: confirm the selected integration**
```text
specify integration status
```

**Expected:** the generic integration and its local guidance files, not Copilot
or Claude. A file such as `.manual/commands/speckit.specify.md` is Markdown,
not an executable. Do not type `/speckit.specify` into the terminal.

Open the scratch folder in your editor with AI features disabled. Inspect
`package.json`: three scripts, no dependencies or install hooks. Inspect the
supplied server/storage code before executing it.

**Terminal - all shells, scratch root**
```text
node --version
npm test
npm run check
```

**Expected:** Node `v24.x.x`, the supplied baseline suite passes, and syntax
checks pass. Passing baseline tests establish only the supplied US1 behavior:
they do **not** claim that status/filter/search are implemented. No `npm install`.

Start the application with `npm start`, then open
`http://127.0.0.1:4173` in a disposable, unsigned-in browser profile. Use one tab.
Add fictional `Orbit` by `Ada` and `Harbor` by `Bo`, then refresh. The newest book
is first and both remain saved. Status/filter controls are intentionally
unavailable until the exercise is complete. Search is absent.

Stop your server with Ctrl+C. If port 4173 is occupied, stop only your own earlier
server, or ask the instructor to resolve the conflict. Do not change the bind
address, choose another port, or kill an unknown process.

**Review:** describe what works, what is deliberately missing, and where saved
data lives. **Failure:** resolve baseline failures before extending it.

<a id="checkpoint-2"></a>
## Checkpoint 2: Write governing rules and new behavior - 60 minutes

### 2.1 Constitution phase: edit the initialized template

Manual equivalent of `/speckit.constitution`: open the initialized
`.specify/memory/constitution.md` in your editor. On this fresh project, replace
its sample placeholders with the workshop content below and your decisions.
Read each principle and record a concrete reason for it. Do not reinitialize
the project to revise the constitution.

**File content - `.specify/memory/constitution.md`**
```markdown
# BookNook manual-track constitution

Document version: 1.0.0 (not the Spec Kit software version)
Author/reviewer: [YOUR initials; identify self-review or peer review]

1. Specify new behavior before code; link requirements, tasks, and evidence.
2. Keep this a local, single-user demo with fictional data and one browser tab.
3. Use Node 24, plain browser JavaScript, and built-in tests; no new dependencies.
4. Validate input and saved data; preserve data and input when operations fail.
5. Render text safely, maintain keyboard access, and retain the restricted server.
6. Test new behavior before implementing it; record real failures and results.
7. Do not use AI tools, accounts, cloud resources, or production data.
8. Review changes manually. Staging a reviewed local comparison snapshot is
   allowed; no commit or publication is required.

Why these constraints matter: [YOUR explanation of two concrete risks]
Amendment rule: record rationale, impact, and human review before changing a rule.
```

**Gate:** explain why local storage is untrusted and why a failed save must not
show success. Do not promise encryption, backups, production readiness, or
security/accessibility certification.

### 2.2 Specify phase: scaffold, then write the specification

The base is supplied, so record it as existing behavior. Your first **new**
feature is US2: status changes and filtering.

Manual equivalent of `/speckit.specify`: inspect the native feature-creation
helper, preview its target, then create the template **once**. These blocks
require a fresh project with no `specs` directory. Existing numbered features
can change the allocated number even if `001` is requested.

**Terminal - PowerShell 7**
```powershell
if (Test-Path '.\specs') { throw 'Stop: this first-run step requires a fresh specs directory.' }
$expected = Join-Path (Get-Location).Path 'specs\001-booknook\spec.md'
$preview = & '.\.specify\scripts\powershell\create-new-feature.ps1' -Json -DryRun -Number 1 -ShortName booknook 'BookNook manual feature' | ConvertFrom-Json
if ($preview.BRANCH_NAME -ne '001-booknook' -or
    [IO.Path]::GetFullPath($preview.SPEC_FILE) -ne $expected) {
  throw 'Unexpected feature target; inspect the project and environment before writing.'
}
$feature = & '.\.specify\scripts\powershell\create-new-feature.ps1' -Json -Number 1 -ShortName booknook 'BookNook manual feature' | ConvertFrom-Json
if ($feature.BRANCH_NAME -ne '001-booknook' -or
    [IO.Path]::GetFullPath($feature.SPEC_FILE) -ne $expected) {
  throw 'Unexpected created feature; do not continue with a hard-coded path.'
}
$feature
Get-Content '.\.specify\feature.json'
```

**Terminal - Bash**
```bash
(
  set -euo pipefail
  [ ! -e specs ] && [ ! -L specs ] ||
    { printf '%s\n' 'Stop: this is a first-run step for a fresh project.'; exit 1; }
  preview=$(bash .specify/scripts/bash/create-new-feature.sh --json --dry-run --number 1 --short-name booknook 'BookNook manual feature')
  python3 -X utf8 -c 'import json,pathlib,sys; d=json.loads(sys.argv[1]); assert d["BRANCH_NAME"]=="001-booknook"; assert pathlib.Path(d["SPEC_FILE"]).resolve()==pathlib.Path("specs/001-booknook/spec.md").resolve(); print(sys.argv[1])' "$preview"
  result=$(bash .specify/scripts/bash/create-new-feature.sh --json --number 1 --short-name booknook 'BookNook manual feature')
  python3 -X utf8 -c 'import json,pathlib,sys; d=json.loads(sys.argv[1]); assert d["BRANCH_NAME"]=="001-booknook"; assert pathlib.Path(d["SPEC_FILE"]).resolve()==pathlib.Path("specs/001-booknook/spec.md").resolve(); print(sys.argv[1])' "$result"
  cat .specify/feature.json
)
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
pwsh -NoProfile -Command ^
  "$ErrorActionPreference = 'Stop';" ^
  "if (Test-Path '.\specs') { throw 'Stop: this first-run step requires a fresh specs directory.' };" ^
  "$expected = Join-Path (Get-Location).Path 'specs\001-booknook\spec.md';" ^
  "$preview = & '.\.specify\scripts\powershell\create-new-feature.ps1' -Json -DryRun -Number 1 -ShortName booknook 'BookNook manual feature' | ConvertFrom-Json;" ^
  "if (-not $preview -or $preview.BRANCH_NAME -ne '001-booknook' -or [IO.Path]::GetFullPath($preview.SPEC_FILE) -ne $expected) { throw 'Unexpected feature target; inspect the project and environment before writing.' };" ^
  "$feature = & '.\.specify\scripts\powershell\create-new-feature.ps1' -Json -Number 1 -ShortName booknook 'BookNook manual feature' | ConvertFrom-Json;" ^
  "if (-not $feature -or $feature.BRANCH_NAME -ne '001-booknook' -or [IO.Path]::GetFullPath($feature.SPEC_FILE) -ne $expected) { throw 'Unexpected created feature; do not continue with a hard-coded path.' };" ^
  "$feature; Get-Content '.\.specify\feature.json'"
```

**Expected:** JSON `BRANCH_NAME: "001-booknook"`, `FEATURE_NUM: "001"`, and
`SPEC_FILE` inside this project's `specs/001-booknook`. `BRANCH_NAME` is legacy
helper terminology here, **not proof of a Git branch**. The helper copies the
spec template and writes `.specify/feature.json` with `feature_directory`.
No AI interpretation or specification content has been generated.

If preview, JSON parsing, or target verification fails, stop. Do not discard
existing work or blindly repeat creation. Use the verified feature path for
all remaining steps; this fresh-project lab expects `specs/001-booknook`.
Open its newly created `spec.md`, replace the sample content with the following
bounded workshop specification, and supply your own answers.

**File content - `specs/001-booknook/spec.md`**
```markdown
# BookNook: manual feature specification

## Existing baseline (US1, preserve rather than reimplement)
Add/list/persist fictional books, newest first, with unique lowercase UUID v4 IDs.
Trim title to 1..120 and author to 1..80 UTF-16 code units; duplicates in text allowed.
Saved shape: {version:1,books:[{id,title,author,status}]} at key booknook:v1.
Statuses are unread/read; new books are unread. Maximum 200 books.
Only a missing saved key means empty; corruption and storage failures are errors.
Keep validation, data preservation, accessible feedback, and restricted serving.

## New US2: reader changes status and selects a view
FR-003: change a known book to read or unread without changing other books/order.
Reject unknown IDs and unsupported statuses; never mutate earlier state.
FR-004: show all, unread, or read books, preserving order in a new array.
Default to all; invalid filters are errors. Do not persist the filter.

## Acceptance examples
Given Orbit/Ada is unread, when I mark it read, then only its status changes.
Given that saved change, when I refresh, then its read status remains.
Given read and unread books, when I select unread, then only unread books appear.
Given a populated library with no matches, show a no-match message, not empty-library text.
Given a failed write, keep the prior displayed/stored status and show an accessible error.
[YOUR additional Given/When/Then case for keyboard operation or an invalid input]

## Decisions made by the human author
Status filter after refresh: all.
Duplicate titles: allowed; IDs identify books.
Out of scope now: search, delete, imports/exports, auth, cloud, database, telemetry.
[YOUR question, decision, reason, and affected acceptance case]

## Baseline requirements to preserve
FR-001: validated add/list, IDs, order and immutability.
FR-002: versioned refresh persistence.
FR-005: 200-book limit without eviction/truncation.
FR-006: strict bounded storage; errors preserve bytes, displayed state and input.
FR-007: direct/restored values remain inert text.
FR-008: labels, visible focus, keyboard access and accessible feedback.
FR-009: loopback-only static assets, exact Host/routes/methods/security headers.
FR-010: distinct empty and no-match feedback; neither masks errors.
```

### 2.3 Clarify phase: human questions and answers

Manual equivalent of `/speckit.clarify`: clarify with a partner or yourself.
What happens if a book is
already read, the ID does not exist, or a save fails? Write answers in
**Decisions**, not only in conversation. The contract permits a fresh immutable
state with the same status; an unknown ID is an error.

**Gate 2:** every new behavior has an observable outcome and explicit failure
case. The baseline/new-feature distinction is clear. Search is still excluded.
**Failure:** correct the document now; do not let implementation decide silently.

<a id="checkpoint-3"></a>
## Checkpoint 3: Plan, tasks, and human analysis - 50 minutes

### 3.1 Turn the requirements into a plan

Manual equivalent of `/speckit.plan`: run the inspected native helper, then
edit the returned plan file. The helper seeds a missing plan and preserves an
existing one; it does not infer architecture or regenerate your decisions.

**Terminal - PowerShell 7**
```powershell
& '.\.specify\scripts\powershell\setup-plan.ps1' -Json
```

**Terminal - Bash**
```bash
bash .specify/scripts/bash/setup-plan.sh --json
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
pwsh -NoProfile -File ".\.specify\scripts\powershell\setup-plan.ps1" -Json
```

**Expected:** `FEATURE_SPEC`, `IMPL_PLAN`, `SPECS_DIR`, and `BRANCH` refer to
the selected `001-booknook` feature. Verify them before editing. If they point
elsewhere, stop and inspect the pointer and environment; changing Git branches
alone does not select the feature. Replace only the fresh plan's placeholders
with the human-authored plan below, not an existing project's decisions.

Read the supplied ten files, especially `src/domain.js`, `src/app.js`, and their
tests. The two exercise exports already exist, so a failing behavior test need
not be a missing-file or syntax error.

**File content - `specs/001-booknook/plan.md`**
```markdown
# US2 implementation plan

Keep package.json, server.mjs, index.html, styles.css, src/domain.js,
src/storage.js, src/app.js and the three existing test files.
Keep npm start, npm test, npm run check; no installs, build tools, or new files.

setStatus(state,id,status):
- validate state with validateState;
- accept only read/unread and an existing ID;
- return new state/array and a new changed book; preserve other values/order.

selectBooks(state,options={}):
- validate state and a plain or null-prototype, non-array options object;
- allow only the status option; default status to all;
- allow all/read/unread, otherwise throw Error;
- return a fresh filtered array in existing order; do not mutate state.

UI:
- set STATUS_FEATURE_ENABLED to true only after domain tests pass;
- reuse the supplied safe status/filter event handlers and accessible controls;
- do not change persistence, server, or the saved schema.

Failure behavior and non-goals:
- never weaken validation/tests, reset saved data, or report a failed save as success.
- error-message wording is not an exact test contract.
- no search until a separately specified change.

Requirement -> task -> evidence:
FR-003 -> T01/T02/T04 -> [YOUR test names and manual status/save-failure checks]
FR-004 -> T01/T03/T04 -> [YOUR filter/default/order/refresh checks]
Baseline FRs -> T05 -> [YOUR regression evidence]

Risk/recovery: [YOUR likely mistake, how to detect it, and the smallest repair]
```

Derive the operations before reading a solution: a status update is a mapping
over books with one changed object; a filter is a predicate that selects books
without changing them. Explain why mutating `book.status` in the original array
would violate the plan.

### 3.2 Write tasks and an evidence record

Manual equivalent of `/speckit.tasks`: first ask the native task-setup helper
for the feature and template information. It requires a spec and plan but
**does not create `tasks.md`** or decompose requirements.

**Terminal - PowerShell 7**
```powershell
$taskInfo = & '.\.specify\scripts\powershell\setup-tasks.ps1' -Json | ConvertFrom-Json
$expectedFeature = Join-Path $PWD 'specs\001-booknook'
if (-not $taskInfo -or [IO.Path]::GetFullPath($taskInfo.FEATURE_DIR) -ne $expectedFeature) {
  throw 'Task setup did not select the expected feature; stop before copying.'
}
$taskInfo | Format-List FEATURE_DIR, TASKS_TEMPLATE
[IO.File]::Copy($taskInfo.TASKS_TEMPLATE, (Join-Path $expectedFeature 'tasks.md'), $false)
```

**Terminal - Bash**
```bash
(
  set -euo pipefail
  task_info=$(bash .specify/scripts/bash/setup-tasks.sh --json)
  python3 -X utf8 -c 'import json,sys; from pathlib import Path; d=json.loads(sys.argv[1]); feature=Path("specs/001-booknook").resolve(); assert Path(d["FEATURE_DIR"]).resolve()==feature; print(json.dumps({k:d[k] for k in ("FEATURE_DIR","TASKS_TEMPLATE")})); data=Path(d["TASKS_TEMPLATE"]).read_text(encoding="utf-8"); output=(feature/"tasks.md").open("x", encoding="utf-8"); output.write(data); output.close()' "$task_info"
)
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
pwsh -NoProfile -Command ^
  "$ErrorActionPreference = 'Stop';" ^
  "$taskInfo = & '.\.specify\scripts\powershell\setup-tasks.ps1' -Json | ConvertFrom-Json;" ^
  "$expectedFeature = Join-Path $PWD 'specs\001-booknook';" ^
  "if (-not $taskInfo -or [IO.Path]::GetFullPath($taskInfo.FEATURE_DIR) -ne $expectedFeature) { throw 'Task setup did not select the expected feature; stop before copying.' };" ^
  "$taskInfo | Format-List FEATURE_DIR, TASKS_TEMPLATE;" ^
  "[IO.File]::Copy($taskInfo.TASKS_TEMPLATE, (Join-Path $expectedFeature 'tasks.md'), $false)"
```

**Expected:** helper JSON includes `FEATURE_DIR`, `AVAILABLE_DOCS`,
`TASKS_TEMPLATE`, and `TASKS_TEMPLATE_CONTENT`; the blocks display the selected
feature/template paths without dumping the full template content.
This unextended project uses the bundled task template. The copy refuses an
existing `tasks.md`: edit that file yourself instead of overwriting it.
Remove sample tasks and replace them with the actual workshop tasks below.

**File content - `specs/001-booknook/tasks.md`**
```markdown
# US2 tasks

- [ ] T01: add and review status/filter tests; observe real behavioral failures.
- [ ] T02: implement setStatus after T01; preserve state, identity and order.
- [ ] T03: implement selectBooks status filtering after T01.
- [ ] T04: run domain tests, enable the supplied UI, and verify keyboard/refresh behavior.
- [ ] T05: run all tests and syntax checks; complete browser/security regressions.
- [ ] T06: review evidence and remaining limits before accepting US2.

T02 and T03 both edit domain.js: complete sequentially in this exercise.
Completion means observed evidence, not merely that code was typed.
```

**File content - `specs/001-booknook/quickstart.md`**
```markdown
# Human-run evidence

Environment: [YOUR OS, shell, Node version, browser; no account details]
Reviewer: [YOUR initials and self-review/peer-review method]

| Requirement | Command or browser action | Actual result | Pending issue |
| --- | --- | --- | --- |
| Supplied US1 baseline | npm test; add/list/refresh | [YOUR observation] | |
| FR-003/004 red | new tests against exercise gaps | [YOUR failing test names] | |
| FR-003/004 green | tests after manual implementation | pending | |
| Browser/security | document 03 exercises | pending | |

Do not include raw storage payloads, secrets, or invented passes.
```

### 3.3 Checklist and analyze phases: separate structure from judgment

Manual equivalent of `/speckit.checklist`: in your editor create
`specs/001-booknook/checklists/requirements.md` (create the `checklists`
directory if needed). Use the bundled `.specify/templates/checklist-template.md`
as a format reference; replace its example items with these questions:

```markdown
# Human requirements-quality checklist
- [ ] Each new FR has an observable acceptance case and an explicit failure case.
- [ ] Baseline behavior and the new status/filter work are clearly separated.
- [ ] Constraints and terminology agree across constitution, spec, plan and tasks.
- [ ] Task order and planned evidence cover every requirement.
- [ ] No placeholder, unresolved ambiguity, or unapproved scope change remains.
Reviewer, observations, and corrections: [YOUR actual review]
```

Mark items only after reading the artifacts. These are requirements-quality
checks, not claims that application tests have passed.

For the **structural part** of the `/speckit.analyze` phase, run:

**Terminal - PowerShell 7**
```powershell
& '.\.specify\scripts\powershell\check-prerequisites.ps1' -Json -RequireTasks -IncludeTasks
```

**Terminal - Bash**
```bash
bash .specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
```

**Terminal - Windows Command Prompt (`cmd.exe`)**
```cmd
pwsh -NoProfile -File ".\.specify\scripts\powershell\check-prerequisites.ps1" -Json -RequireTasks -IncludeTasks
```

**Expected:** the selected `FEATURE_DIR` and `AVAILABLE_DOCS`, including
`tasks.md`. Missing files fail the helper. Placeholder text and contradictory
requirements can still pass it: this is **not** the semantic `/speckit.analyze`
workflow. Complete the human review next.

**Manual analysis checklist:** check that each FR has a test/action; task order
matches the plan; only planned files change; each failure has a visible outcome;
and the constitution still holds. Record at least one question considered and
its resolution, or explain why no correction was needed.

**Gate 3:** no unresolved scope, integrity, or accessibility conflict; placeholders
have real human decisions. **Failure:** repair the documents before coding.

<a id="checkpoint-4"></a>
## Checkpoint 4: Implement the extension manually - 110 minutes

Budget: tests/red 25, status/filter code 45, UI and regression 25, review 15.
Work in the scratch copy, not the supplied starter.
This is the manual equivalent of `/speckit.implement`: you execute the edits
and tests below. No native helper reads the tasks and writes the implementation.

### 4.1 Add tests first

Append the following to `tests/domain.test.js`. The supplied file already
imports `test`. Each callback imports its own assertions/functions to avoid
depending on other fixture names.

**File content - append to `tests/domain.test.js`**
```javascript
test('FR-003: manual status update preserves earlier state and rejects invalid changes', async () => {
  const assert = (await import('node:assert/strict')).default;
  const { emptyState, addBook, setStatus } = await import('../src/domain.js');
  const id = '11111111-1111-4111-8111-111111111111';
  const otherId = '22222222-2222-4222-8222-222222222222';
  const original = addBook(emptyState(), { title: 'Orbit', author: 'Ada' }, id);
  const before = structuredClone(original);
  const changed = setStatus(original, id, 'read');
  assert.equal(changed.books[0].status, 'read');
  assert.notStrictEqual(changed, original);
  assert.notStrictEqual(changed.books, original.books);
  assert.notStrictEqual(changed.books[0], original.books[0]);
  assert.deepEqual(original, before);
  assert.equal(setStatus(changed, id, 'unread').books[0].status, 'unread');
  assert.throws(() => setStatus(original, otherId, 'read'));
  assert.throws(() => setStatus(original, id, 'finished'));
});

test('FR-004: manual status filtering preserves order and validates options', async () => {
  const assert = (await import('node:assert/strict')).default;
  const { emptyState, addBook, setStatus, selectBooks } = await import('../src/domain.js');
  const id = '11111111-1111-4111-8111-111111111111';
  const otherId = '22222222-2222-4222-8222-222222222222';
  const first = setStatus(addBook(emptyState(), { title: 'Orbit', author: 'Ada' }, id), id, 'read');
  const state = addBook(first, { title: 'Harbor', author: 'Bo' }, otherId);
  const before = structuredClone(state);
  assert.deepEqual(selectBooks(state, { status: 'read' }).map(b => b.id), [id]);
  assert.deepEqual(selectBooks(state, { status: 'unread' }).map(b => b.id), [otherId]);
  assert.deepEqual(selectBooks(state).map(b => b.id), [otherId, id]);
  assert.notStrictEqual(selectBooks(state), state.books);
  assert.deepEqual(selectBooks(emptyState(), { status: 'read' }), []);
  for (const options of [null, [], 'read', new Date(0), new Map(),
    Object.create({ status: 'read' }), { status: 'finished' }, { unknown: true }]) {
    assert.throws(() => selectBooks(state, options));
  }
  assert.deepEqual(state, before);
});
```

**Terminal - all shells**
```text
node --test tests/domain.test.js
```

**Expected red:** the new tests fail because status/filter behavior is not yet
implemented. Imports and syntax must work, and existing baseline tests stay
green. Record the actual failure names. A deliberately thrown exercise error
identifies the missing behavior; it is not a successful implementation.

**Failure:** if a module is missing or a test never executes, repair test setup.
Do not weaken assertions or pre-fill a passing result.

### 4.2 Implement from the contracts

In `src/domain.js`, locate `setStatus` and `selectBooks`. Write their bodies
using your plan. Preserve the other exports and validation rules. For status,
validate first, reject an unknown ID, then create a new array with only the
matching book copied and changed. For filtering, validate the options and use
a predicate to return a fresh array.

Attempt the code before opening the reference solution. Explain which line
satisfies each FR and why the original state remains unchanged.

<details>
<summary>Optional reference solution: replace only the two exercise functions</summary>

```javascript
export function setStatus(state, id, status) {
  validateState(state);
  if (status !== 'read' && status !== 'unread') {
    throw new Error('Status must be read or unread.');
  }
  if (!state.books.some(book => book.id === id)) {
    throw new Error('Unknown book.');
  }
  return {
    version: 1,
    books: state.books.map(book => book.id === id ? { ...book, status } : book)
  };
}

export function selectBooks(state, options = {}) {
  validateState(state);
  if (options === null || typeof options !== 'object' || Array.isArray(options) ||
      Reflect.ownKeys(options).some(key => key !== 'status')) {
    throw new Error('Invalid filter options.');
  }
  const prototype = Object.getPrototypeOf(options);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error('Expected plain filter options.');
  }
  const { status = 'all' } = options;
  if (!['all', 'unread', 'read'].includes(status)) {
    throw new Error('Invalid status filter.');
  }
  return state.books.filter(book => status === 'all' || book.status === status);
}
```

The map copies the changed book rather than mutating it. The filter creates a
new array even when `all` is selected. Both use the existing validator; neither
touches storage, the DOM, time, or randomness.

</details>

Run the domain tests again. Investigate failures against the written contract,
not by deleting tests. Record the observed green result only when it occurs.

### 4.3 Enable and inspect the supplied UI

In `src/app.js`, change exactly:

```javascript
const STATUS_FEATURE_ENABLED = false;
```

to:

```javascript
const STATUS_FEATURE_ENABLED = true;
```

The safe event handlers and accessible controls are already supplied. Read
them: a candidate state is saved **before** the displayed state and success
message change. A failed save retains the old data and user input. Enabling
the flag is not permission to rewrite storage or expose the server.

**Terminal - all shells**
```text
npm test
npm run check
npm start
```

In the disposable profile, add `Orbit`/`Ada` and `Harbor`/`Bo`. Mark Orbit read;
switch between all/read/unread; refresh. Status persists, filter resets to all.
Use Tab/Shift+Tab and Enter/Space with visible focus. Stop your server with Ctrl+C.

**Gate 4:** meaningful status/filter tests and all baseline tests pass; actual
browser observations agree with your spec; no unrelated file changed. Mark
T01-T04 only when supported by evidence; T05/T06 remain pending for validation.

**Failure:** identify the smallest failing requirement, repair its code or an
incorrectly written requirement through explicit review, and repeat checks.
Do not introduce a silent fallback or claim that passing unit tests proves UI
behavior. Keep work uncommitted.

[Next: validation, manual search change, and handoff](./03-validation-and-handoff.md)
