# BookNook: a 390-minute Spec Kit hands-on lab

Build with specifications, tests and human review - not trust in generated code.
Use **Spec Kit v1.0.1 / VS Code Copilot skills**; complete [prework](./02-spec-kit-breakdown.md) first.

**Without AI tools?** Follow the separate
[noGHCP CLI-and-manual series](./noGHCP/README.md), using the official pinned
Specify CLI with Python and uv or pip, generic scaffolding, human-written artifacts, and
local coding exercises. No AI tool or agent account is required there. Slash
commands are agent instructions, not executable terminal commands; that series
provides [manual phase equivalents](./noGHCP/README.md#slash-command-phases-and-their-no-ai-equivalents).
Choose one track rather than mixing their setup instructions.

This fictional single-user reading-list demo is **not production architecture**.
No Azure/cloud, auth, application API, database, telemetry, import/export, delete or external assets.
Copilot is external: use fictional, non-sensitive content and an approved account/policy.

## Route, notation, and safety

These 390 minutes are **suggested study times**, not completion guarantees.
Prework and breaks are additional. Never skip review to catch up.

Work alone using the review gates or pair with another student. Record whether
each review is a self-review or peer review; agent output cannot approve your work.

| Module | Minutes | Elapsed budget | Exit evidence |
| --- | ---: | --- | --- |
| [1. Workspace](#module-1) | 20 | 00:00-00:20 | Pinned CLI, isolated scratch project |
| [2. Constitution and threats](#module-2) | 35 | 00:20-00:55 | Principles and trust-boundary review |
| [3. Specify and clarify](#module-3) | 45 | 00:55-01:40 | FR-001-010 and answered ambiguities |
| [4. Plan and contracts](#module-4) | 45 | 01:40-02:25 | File, module, storage, server contracts |
| [5. Tasks and analysis](#module-5) | 35 | 02:25-03:00 | Traceable tasks; no unresolved blockers |
| [6. Gated implementation](#module-6) | 80 | 03:00-04:20 | Three reviewed slices; red/green evidence |
| [7. Security and acceptance](#module-7) | 50 | 04:20-05:10 | HTTP, browser, storage, keyboard evidence |
| [8. Controlled search change](#module-8) | 60 | 05:10-06:10 | CR-001 reviewed and regression-tested |
| [9. Handoff](#module-9) | 20 | 06:10-06:30 | Evidence, limitations, stopped server |
| **Total** | **390** | **6 hours 30 minutes** | Breaks and prework additional |

- **Terminal** blocks run in your shell, never in chat.
- **Agent chat** means VS Code Copilot Chat, Agent mode. `/speckit-...` invokes a
  generated skill, not a shell command. Retain manual tool approval.
- **File content** means paste into the named file using the editor.
- **Browser console** means the disposable profile at the exact lab origin.
  Read snippets first; never bypass browser paste-safety protections.
- Use PowerShell **7** (not 5.1), Bash, or Windows Command Prompt (`cmd.exe`).
  **All shells** marks shared terminal commands; choose only one variant for
  shell-specific steps. Command Prompt still needs `pwsh` (PowerShell 7) for
  Spec Kit's Windows helpers; it uses `--script ps`, not `--script cmd`.
  Follow the [shell conventions](../README.md#command-line-shell-options).
  No policy changes/admin rights.
- Keep the teaching repository unchanged: all generated work belongs in a
  **new scratch project outside this repository**.
- Review scripts, commands, permissions, and diffs before approval. No terminal
  auto-approval, agent/TLS bypass, secrets, MCP, extension/catalog installation,
  cloud actions, or automatic commits/pushes.

Expected outputs are required outcomes, not pre-recorded results. In
`specs\<feature>\quickstart.md`, requested in module 4, record requirement,
command/action, actual result, date, and reviewer. Exclude storage dumps,
credentials, and account details.

### Reading paths in this lab

**Scratch root** means the `booknook` folder you create in module 1, not this
teaching repository, its `docs` folder, or a feature's `specs` folder. Open that
same scratch root in VS Code and use it as the working directory for terminal
commands unless a step explicitly says otherwise.

| Shell | Default scratch-root location after module 1 | Print the current directory |
| --- | --- | --- |
| Windows PowerShell 7 | `$HOME\speckit-labs\booknook` | `Get-Location` |
| Windows Command Prompt | `%USERPROFILE%\speckit-labs\booknook` | `cd` |
| macOS/Linux Bash | `$HOME/speckit-labs/booknook` | `pwd` |

File references such as `package.json` and `src\domain.js` are **relative to
that root**. Thus `.\tests\domain.test.js` on Windows and
`./tests/domain.test.js` in Bash identify the same project-relative test file.
Keep forward slashes inside JavaScript imports and browser URLs; they are not
Windows filesystem commands. An import such as `../src/domain.js` is resolved
relative to the **importing file**, not the terminal's working directory.

After module 3, **`<feature>` is a placeholder for your actual numbered feature
directory**, not a shell variable or a folder to create literally. For example,
if `.specify\feature.json` selects `specs/001-library-reading-status`, then
`specs\<feature>\plan.md` means
`specs\001-library-reading-status\plan.md`. Your number/name may differ.
Check the pointer rather than copying that example or inferring it from a Git
branch.

Links to [reference artifacts](../examples/README.md) open examples in the
teaching repository. They are comparison material, **not the generated files
in your scratch project**. The [module 4 file inventory](#file-and-script-contract)
explains when each application file should appear.

<a id="module-1"></a>
## 1. Establish the workspace  -  20 minutes

**Budget:** 8 preflight, 8 initialization, 4 review. Start in an ordinary terminal,
not one controlled by an agent.

### Verify before initializing

Prework must provide Git, Python 3.11+, Specify installed with **uv or pip**,
latest patched Node **24** LTS with npm, PowerShell 7 on Windows, VS Code, and
approved Copilot access. Apply the
[PATH setup](./00-tool-setup.md#add-executable-directories-to-path) in every
terminal, including Terminal B, or restart the editor after persistent PATH
changes. Check locally:

**Terminal  -  PowerShell 7**
```powershell
$PSVersionTable.PSVersion
python --version
git --version
node --version
npm --version
specify --version
specify check
```

**Terminal  -  Bash**
```bash
python3 --version
git --version
node --version
npm --version
specify --version
specify check
```

**Terminal  -  Windows Command Prompt (`cmd.exe`)**
```cmd
pwsh --version
python --version
git --version
node --version
npm --version
specify --version
specify check
```

For the **uv route only**, also run `uv --version`. For the **pip route**,
verify `python -m pip --version` in the prepared tool environment instead;
missing uv is not a failure for that route.

**Checkpoint:** Node prints `v24.x.x`; CLI prints `specify 1.0.1`. Record versions.
`specify check` reports tools, not Copilot entitlement/editor skill discovery.
Unused integrations need not be installed. Do not initialize with a different release.

**If failed:** return to [prework](./02-spec-kit-breakdown.md). Use this frozen official
Git source, not a similarly named registry package. Install only as approved prework;
reopen the terminal and recheck versions. Do not force-replace an existing installation.

**Terminal  -  all shells; uv route, prework recovery only**
```text
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884
```

**Terminal  -  all shells; pip alternative in the prepared tool environment**
```text
python -m pip install "specify-cli @ git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884"
```

Choose one installer. If installation succeeded but `specify` is not found,
repair PATH using the shared guide rather than installing another copy.
If uv's normal installer is unavailable, see
[installing uv with pip](./00-tool-setup.md#install-uv-with-pip-when-needed).

### Create a separate project

These commands refuse an existing `booknook`. Preserve it and choose another unused
scratch parent if necessary; never use `--here --force` on the teaching repository.

**Terminal  -  PowerShell 7**
```powershell
$labRoot = Join-Path $HOME 'speckit-labs'
New-Item -ItemType Directory -Path $labRoot -Force | Out-Null
Set-Location $labRoot
if (Test-Path '.\booknook') { throw 'Existing booknook: choose another scratch parent.' }
specify init booknook --integration copilot --script ps
if ($LASTEXITCODE -ne 0) { throw 'Initialization failed; inspect output before continuing.' }
Set-Location '.\booknook'
git init
Get-Location
Get-ChildItem '.github\skills' -Name
```

**Terminal  -  Bash**
```bash
mkdir -p "$HOME/speckit-labs"
cd "$HOME/speckit-labs" || exit 1
if [ -e booknook ]; then
  printf '%s\n' 'Existing booknook: choose another scratch parent.'
else
  specify init booknook --integration copilot --script sh &&
    cd booknook && git init && pwd && ls .github/skills
fi
```

**Terminal  -  Windows Command Prompt (`cmd.exe`)**
```cmd
if exist "%USERPROFILE%\speckit-labs\booknook" (
  echo Stop: existing booknook. Choose another scratch parent.
) else (
  if not exist "%USERPROFILE%\speckit-labs" mkdir "%USERPROFILE%\speckit-labs"
  cd /d "%USERPROFILE%\speckit-labs" && specify init booknook --integration copilot --script ps && cd booknook && git init && cd && dir /b ".github\skills"
)
```

**Checkpoint:** scratch `booknook` contains `.specify` and
`.github/skills/speckit-<name>/SKILL.md`. Core **does not initialize Git or create
feature branches**; you explicitly ran `git init`. Do not add a Git extension.

The initializer supplies toolkit templates, helpers, and Copilot skills, not
the BookNook application. For example, `.specify\templates\plan-template.md`
is a reusable template; it is not your feature's future
`specs\<feature>\plan.md`. The ten application/test files, including
`.\package.json`, are not required to exist until module 6, slice A.

Create this root ignore file in the scratch project. It is repository hygiene,
not one of the ten application/test files introduced later.

**File content  -  `.gitignore`**
```gitignore
.env
.env.*
!.env.example
node_modules/
*.pfx
*.p12
```

Keep shared `.specify/`, `.github/skills/`, and `specs/` artifacts trackable.
Preserve Spec Kit's managed `.specify/.gitignore`, which excludes the local
feature pointer. Ignore rules cannot stop agent access or protect already tracked
secrets; no credentials belong in this project.

Open **only this scratch folder** in VS Code (File -> Open Folder). Inspect skills,
helper scripts, and workspace settings before granting trust; retain terminal approval.
Confirm `/speckit-constitution` appears in chat. Do not use legacy dotted Copilot
commands or `--integration-options="--commands"`.

**If failed:** confirm the opened folder, CLI version, and skill files. Consult the
[VS Code skills guidance](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
and reload the editor if needed. If policy blocks scripts, use an approved environment,
never bypass controls. Preserve partial work and non-sensitive diagnostics while
you resolve the problem.

<a id="module-2"></a>
## 2. Constitution and threat boundaries  -  35 minutes

**Budget:** 15 drafting, 10 threat discussion, 10 human review. Location: scratch
project, Copilot Chat. Paste the complete prompt, then review the resulting file.

**Agent chat  -  constitution**
```text
/speckit-constitution
Create the BookNook constitution using these complete governing principles.
I. Spec-first and traceable: requirements, acceptance criteria, plan and tasks precede code.
Link tests/tasks to requirement/story IDs. Changes need rationale, impact review and evidence.
II. Bounded local demo: one user, fictional data, one loopback browser origin.
No cloud/deployment, auth, application API, database, telemetry, imports/exports,
delete operation, external assets or speculative features.
III. Minimal trusted surface: Node 24 LTS, vanilla HTML/CSS/browser ES modules, zero
third-party JS dependencies. Use node:test and node:assert/strict. No dependency
installation, build tools, transpilers or package lifecycle hooks.
IV. Validate every boundary: UI/storage are untrusted. Strict versioned schema,
canonical UUID v4, bounded strings, unique IDs, 200-book cap. Values are text, never HTML.
V. Preserve data on failure: distinguish missing key from corruption. Reject corrupt
storage without overwrite/repair; block writes. Failed saves never update displayed
state or report success. Accessible errors, no raw-data logging. Reset needs explicit
human consent and removes only booknook:v1 in a disposable profile.
VI. Test first, review each slice: importable scaffolds precede behavioral red tests.
Preserve red/green evidence; missing imports are not red. Inspect code/scripts/commands
before execution. Human scope gates; no automatic commits/pushes or destructive recovery.
VII. Accessible and secure defaults: labels, keyboard operation, visible focus,
polite live feedback, field-associated errors, loopback binding, exact Host/route
allowlists and restrictive headers. Accessibility exercises are not certification.
VIII. Honest operations: record actual checks, risks and runtime/model versions.
No secrets, cloud actions, paid-tool setup or unrestricted agent approval.
Governance: amendments need rationale, version/date updates and impacted artifact/test
review. Never waive principles to fit a timebox.
Write .specify/memory/constitution.md and summarize conflicts. Do not implement.
```

**Checkpoint:** inspect `.specify/memory/constitution.md` for placeholders/invented approvals.
Compare the [reference constitution](../examples/constitution.md); do not overwrite your work.

Open `.\.specify\memory\constitution.md` in the scratch project. Module 1
seeded this file from a template; this step replaces its placeholders with
your reviewed principles. Do not edit the teaching repository's
`examples\constitution.md` or the reusable templates under `.specify\templates`.

Sketch these boundaries; record controls and residual risks in the plan when created:

| Boundary / failure | Required control | Residual risk to name |
| --- | --- | --- |
| User input -> domain | Strict bounds, UUID/status/schema validation | A valid book title may still be unwanted content |
| Browser storage -> domain | Bounded parse; reject corruption; no automatic rewrite | Browser owner can alter/delete data; no confidentiality |
| Domain -> DOM | `textContent`; no HTML evaluation | CSP alone does not prove safe rendering |
| Browser -> local server | Loopback + exact Host + routes + methods | Other software on the machine remains outside isolation |
| Agent -> files/terminal | Human diff and command review | Analysis instructions are not an OS sandbox |
| Save operation -> UI | Persist candidate before publishing success | Storage can fail; no durability/backup guarantee |

Discuss Microsoft Well-Architected trade-offs: reliability (failure preservation),
security (least privilege/assume breach), operational excellence (repeatable evidence),
performance efficiency (bounds), cost optimization (no cloud/dependency provisioning).
Applying principles to this demo implies neither Microsoft endorsement nor an Azure review.

**Review gate:** explain why local storage is untrusted. Reject analytics, APIs, or cloud services.
**If failed:** repair contradictions now; displace later stretch discussion, not review.

<a id="module-3"></a>
## 3. Specify and clarify  -  45 minutes

**Budget:** 20 specification, 15 clarification, 10 acceptance review.
First capture behavior without asking the agent to implement architecture.

**Agent chat  -  specification**
```text
/speckit-specify
Describe BookNook, a single-user local fictional reading list.
US1 (P1): add books, view newest first, and retain them on refresh.
US2 (P2): toggle read/unread and filter all/unread/read.
FR-001: trimmed title 1..120 and author 1..80 JavaScript UTF-16 code units;
reject empty/whitespace-only/overlong values. Books contain only id/title/author/status.
Canonical lowercase UUID v4 IDs; reject duplicate IDs, allow duplicate title/author.
Prepend unread additions without mutating previous state.
FR-002: persist only {version:1,books:[...]}, under key booknook:v1, across refresh.
FR-003: toggle a known book between unread/read; unknown IDs are errors.
FR-004: filter all/unread/read, initially all; never persist the selected filter.
FR-005: at most 200 books; reject the 201st without truncation or eviction.
FR-006: only missing key (null) means empty. Empty string, malformed JSON, wrong
schema/fields/version, invalid books, duplicate IDs or over-cap arrays are corruption.
Reject raw input >100000 UTF-16 units before parsing. Preserve corrupt bytes and block
writes until explicit scoped reset. Read/access/write errors are visible and accessible.
Reject serialized candidate output >100000 UTF-16 units before saving, even when
its fields are valid; preserve existing data without truncating the candidate.
Failed saves preserve stored/displayed state and entered values; no false success,
silent reset, raw-data logging or successful in-memory-only fallback.
FR-007: titles/authors and persisted HTML-looking values are text; no innerHTML/eval.
Test direct entry and persisted tampering.
FR-008: labels, field errors, visible focus, keyboard operation, aria-live polite feedback;
no accessibility certification claim.
FR-009: local-only restricted static server, no application API or external assets.
FR-010: distinguish empty library and no matches for current filter.
Scope excludes search until separately approved CR-001, and excludes shelves,
deletion, import/export, auth, database, telemetry and cloud/deployment.
Write measurable Given/When/Then acceptance cases with IDs. Do not implement.
```

**Checkpoint:** locate generated `specs/<number>-<name>/spec.md`; do not assume a name.
Inspect `.specify/feature.json`: the active-feature selector, **not the Git branch**.
Record the actual path; keep plan, tasks, checklists and CR-001 in this feature.

In VS Code, open `.\.specify\feature.json` and read its `feature_directory`
value. If it is relative, resolve it from the scratch root; if it is absolute,
confirm that it points inside this scratch project. Open `spec.md` in that
directory. Module 3 creates this feature directory and specification;
clarification updates the **same** specification rather than creating a
separate clarification file. Record the real directory name for every
`specs\<feature>\...` reference below.

**Agent chat  -  clarification**
```text
/speckit-clarify
Review genuine ambiguities only; no invented features. Record answers in Clarifications
and update acceptance criteria before planning. These decisions are fixed:
length means JS UTF-16 code units after trimming, not bytes or grapheme clusters;
duplicate title/author pairs are allowed; IDs must be unique UUID v4 lowercase;
newest first; new books unread; status filter starts all and is not persisted;
null alone is absent storage, whereas empty string is corruption;
errors never silently repair/overwrite data and never claim successful saves;
corruption blocks writes; recovery is explicit removal of only booknook:v1;
200 is a hard cap, with no truncation/eviction; HTML-looking strings remain text.
No search in the initial release. Surface any conflict instead of choosing a
different policy. Do not write application code.
```

Answer sequential questions using these decisions; confirm answers appear in the spec,
not just chat. Read each acceptance case: failed saves must preserve the old list/status.

**Review gate:** FR-001-010 are observable; US1/US2 retain priority. Compare the
[reference specification](../examples/spec.md). **If failed:** edit current artifacts
and reread them; rerunning `/speckit-specify` may create another feature.

<a id="module-4"></a>
## 4. Plan exact contracts  -  45 minutes

**Budget:** 20 planning, 15 contract inspection, 10 requirements checklist.
The static server serves files; it is not a book-data API. Browser persistence is
not a server database. There is no `npm install` step.

Before sending the prompt, open the reviewed
`.\.specify\memory\constitution.md` from module 2 and
`.\specs\<feature>\spec.md` from module 3. Confirm the selection in
`.\.specify\feature.json` still points to that feature. This step asks the agent
to write **design documents**, not the JavaScript application described by
those documents.

**Agent chat  -  implementation plan**
```text
/speckit-plan
Plan, do not implement: Node 24 LTS, vanilla HTML/CSS/browser ES modules, zero
third-party JS dependencies, node:test and node:assert/strict. Exact files:
package.json, server.mjs, index.html, styles.css, src/domain.js, src/storage.js,
src/app.js, tests/domain.test.js, tests/storage.test.js, tests/server.test.js.
package.json is private:true, type:"module", with only these scripts:
start="node server.mjs"; test="node --test";
check="node --check server.mjs && node --check src/domain.js && node --check src/storage.js && node --check src/app.js".
No build/lint placeholders, install hooks, frameworks or external assets.
src/domain.js exports emptyState(), validateState(value), addBook(state,{title,author},id),
setStatus(state,id,status), selectBooks(state,{status='all'}={}).
emptyState returns fresh {version:1,books:[]}; validateState returns valid state or
throws Error without mutation. addBook/setStatus return new state or throw Error;
unknown IDs are errors. selectBooks returns a new ordered filtered array.
Error wording is not contractual. Enforce only state version/books and book
id/title/author/status, trimmed bounds, unique lowercase UUID v4, unread/read, cap 200.
src/storage.js exports STORAGE_KEY='booknook:v1', decodeState(raw),
loadState(storage), saveState(storage,state). decodeState(null) returns empty
state; otherwise reject >100000 UTF-16 code units before JSON.parse and validate.
loadState calls storage.getItem. saveState validates, stringifies, rejects serialized
output >100000 UTF-16 units before setItem, calls setItem, returns undefined; errors
propagate. This prevents JSON escaping from producing unreadable saved data.
Inject fake storage in tests; localStorage belongs only in src/app.js error handling.
UI uses crypto.randomUUID(), validates and saves candidates before display/success.
Failed saves preserve input/old state. Failed load/corruption shows accessible errors
and blocks writes: no writable empty fallback or raw-data logging.
Use textContent, no innerHTML/eval, external module/CSS. Forms preventDefault before
processing. Labels, field errors, visible focus, polite live status, keyboard, empty states.
server.mjs exports createServer(): unstarted node:http Server. Imports never listen;
direct invocation alone binds 127.0.0.1:4173.
Allow only GET/HEAD and exactly one Host 127.0.0.1:4173; reject missing, repeated
and other Host values.
Fixed map: /, /index.html, /styles.css, /src/app.js, /src/domain.js, /src/storage.js.
Match raw targets exactly, with no query strings or URL decoding/normalization.
Never concatenate URL/filesystem paths. Correct content types, bodyless HEAD,
400 for invalid Host, 405 with Allow: GET, HEAD for other methods, 404 for unknown
routes. No SPA fallback, listing, CORS or APIs.
CSP: default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none';
base-uri 'none'; form-action 'none'; frame-ancestors 'none'.
Also X-Content-Type-Options: nosniff and Referrer-Policy: no-referrer.
Set these on served resources and handler-generated errors. Node's HTTP parser
may reject malformed requests before the handler; assert rejection/no disclosure
for those responses rather than requiring application headers.
Server tests use ephemeral loopback ports, explicit accepted Host, closed resources;
test headers, allowed files and denial paths. Gates: A scaffolds/exports, B tested
domain/storage, C tested server/UI. Missing modules are not valid red.
Generate plan, research, data model, module contracts and quickstart evidence steps.
Include PowerShell 7, Bash, and Windows Command Prompt terminal alternatives in
quickstart; label identical commands for all shells and use pwsh for Windows helpers.
No OpenAPI. Explain residual risks and security/reliability/operations/performance/cost.
```

### Planning output locations

**Checkpoint:** inspect the following requested outputs in your selected
feature directory. Every path in this table is relative to the scratch root;
substitute the actual `<feature>` name recorded in module 3.

| Relative path | Created or updated by this step | What you should find and review |
| --- | --- | --- |
| `specs\<feature>\plan.md` | Main implementation plan | The chosen architecture, ten-file inventory, dependencies, risks, and constitution checks. It explains **how** to satisfy the existing specification. |
| `specs\<feature>\research.md` | Supporting design decisions | Reasons for the local-only design, built-in Node tools, strict storage handling, and rejected alternatives. It is not permission to add a framework or service. |
| `specs\<feature>\data-model.md` | Data contract | `{version:1,books:[...]}`, book fields, valid statuses, bounds, and failure rules. It describes browser data; it does not create a database or a saved-data file. |
| `specs\<feature>\contracts\` | Directory of module contracts | Files documenting the domain/storage exports and static-server behavior. Inspect the actual filenames produced; no particular contract filename is guaranteed. These are documents, not executable modules or an OpenAPI service. |
| `specs\<feature>\quickstart.md` | Run instructions and evidence record | The three npm commands, shell alternatives, browser checks, and places to record actual outcomes later. Runtime acceptance starts **pending**, not passed. |

These are the outputs requested by **this lab prompt**, not a promise that
every agent response creates an identical layout. If one is absent or uses a
different location, inspect the agent's output and request a scoped correction
or record the agreed actual path in `plan.md`. Do not invent filenames, rerun
project initialization, or create a second feature to hide a missing output.
The constitution and specification remain the inputs; application code stays
unimplemented. Compare the [reference plan](../examples/plan.md), especially
its export contracts and test matrix.

### File and script contract

The following **ten files belong in the scratch project**, not under
`specs\<feature>`, `.specify\scripts`, or the teaching repository's `examples`
directory. Module 4 describes them in the plan. Module 6, slice A creates
their initial scaffolds; later slices implement behavior and extend tests.

| Relative path | Purpose | When to expect meaningful behavior |
| --- | --- | --- |
| `package.json` | Node package metadata and the exact three npm scripts below | Slice A supplies the complete file; commands only pass when the files they check or run are ready. |
| `server.mjs` | Exports `createServer()` and serves only the fixed static routes | Slice A supplies an importable stub; slice C implements serving and direct-run loopback binding. |
| `index.html` | Page structure: labeled form, book list, filter, and feedback regions | Slice A starts the markup; slice C completes it and connects external CSS/JavaScript. |
| `styles.css` | Layout, readable feedback, and visible keyboard focus | Slice A starts the stylesheet; slice C completes the accessible presentation. |
| `src\domain.js` | Pure validation, immutable book updates, and status selection | Slice A exports function stubs; slice B implements the domain rules. |
| `src\storage.js` | Bounded decoding and an injected storage adapter | Slice A exports stubs plus `STORAGE_KEY`; slice B implements the adapter. |
| `src\app.js` | Browser event handlers, safe rendering, and save-before-display | Slice A supplies a scaffold; slice C connects the UI to domain/storage functions. |
| `tests\domain.test.js` | Domain behavior and boundary tests | Replace its slice A scaffold with the first test snippet in module 6, extend in B, then append the search test in module 8. |
| `tests\storage.test.js` | Storage validation and failure-preservation tests | Slice A creates the scaffold; slice B supplies and extends the second test snippet. |
| `tests\server.test.js` | Server import, route, Host, method, and header tests | Slice A creates the scaffold; slice C writes meaningful tests before implementing the server. |

The folders `src` and `tests` are siblings at the scratch root. The constitution,
feature documents, `.gitignore`, and managed Spec Kit scaffolding are **additional
project files**, not part of this ten-file application count. Book data will
live in browser storage, not in a new `books.json`, database, or project folder.

Review the following JSON as the contract for **`.\package.json`**. Do not
paste it into a terminal or create the application early during planning.
When slice A creates `package.json`, compare that file against this exact
content and correct deviations before running its scripts.

**File content  -  `.\package.json`, required content when scaffolded in module 6**
```json
{
  "name": "booknook",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node server.mjs",
    "test": "node --test",
    "check": "node --check server.mjs && node --check src/domain.js && node --check src/storage.js && node --check src/app.js"
  }
}
```

`"private": true` tells npm not to publish this package; it is not an access
control for local files. `"type": "module"` enables `import`/`export` in the
project's `.js` files, while `.mjs` explicitly identifies the server as an ES
module. The `node:` imports used later are Node built-ins and need no downloaded
packages.

Run npm commands from the **scratch root containing this `package.json`**.
There are no dependency sections, install hooks, build output, or required
`node_modules` directory. Do not use `npm init` or `npm install` to compensate
for a missing scaffold.

| Command, all shells | What the package script does | What it does not establish |
| --- | --- | --- |
| `npm start` | Runs `node server.mjs` in the foreground; after slice C it listens on `127.0.0.1:4173` until you stop it. | It does not run tests, build the UI, or create book-data files. Do not start it while the server is still a stub. |
| `npm test` | Runs `node --test`, which discovers the three `tests\*.test.js` files. | Passing Node tests does not prove browser rendering, keyboard behavior, or real browser-storage handling. |
| `npm run check` | Runs `node --check` on `server.mjs` and the three `src` modules. `&&` stops the sequence if a syntax check fails. | It parses those files; it does not execute application behavior, check HTML/CSS, or replace tests and manual review. |

### Requirements-quality checklist

**Agent chat  -  checklist**
```text
/speckit-checklist
Create a security/reliability/accessibility requirements-quality checklist: completeness,
clarity, consistency and measurability, not code pass status. Include UTF-16 bounds,
UUID/version/schema, null versus corruption, bounded parsing, 200 cap, storage-access/
read/write failures and preservation, inert rendering, keyboard/live/field feedback,
loopback/Host/method/route/headers, empty/no-match states, scope and manual gates.
Link findings to FRs/principles. No future-runtime passes, implementation or dependencies.
```

Locate the resulting Markdown file under
`specs\<feature>\checklists\`. Its name depends on the requested checklist
(for example, `security.md`); inspect the created file rather than assuming
the filename. Record its actual relative path in your plan/evidence notes.
Do not edit `.specify\templates\checklist-template.md`, which is reusable
toolkit scaffolding rather than your completed feature checklist.

**Review gate:** inspect requirements before completing checklist items. "Testable CSP
requirement?" differs from "CSP passed HTTP tests." **If failed:** repair spec/plan and
reevaluate. Reject framework, remote-asset, or SQLite scope drift.

<a id="module-5"></a>
## 5. Tasks and read-only analysis  -  35 minutes

**Budget:** 15 task decomposition, 10 analysis, 10 remediation and approval.

**Agent chat  -  tasks**
```text
/speckit-tasks
Generate dependency-ordered tasks: US1 P1, US2 P2, FR-001..010 links, exact paths.
Gated A: all scaffolds/importable exports; B: domain/storage red tests then green code;
C: server red tests, server/UI code, browser/keyboard evidence.
Scaffolds are not behavioral completion. Exports throw Error('not implemented');
missing imports/syntax errors are setup faults, not red.
Name tests for title 1/120/121, author 1/80/81, whitespace and UTF-16 length;
UUID canonical format/duplicates, duplicate titles, order and immutability;
null/empty/malformed/oversized storage, unexpected keys/version/status/schema;
200/201 entries, unknown ID, toggle and all/unread/read filter;
read/write failures with unchanged data and UI; direct and persisted HTML text;
keyboard focus/labels/live errors; server import safety, Host/route/method
rejection, exact CSP, nosniff and Referrer-Policy. Include explicit human reviews.
Mark [P] only where files and prerequisites permit independent work.
Do not add search, dependencies, commits or deployment. Do not implement.
```

**Agent chat  -  analysis**
```text
/speckit-analyze
Read-only review constitution/spec/plan/checklists/tasks: missing FR-001..010 coverage,
conflicts, security/accessibility gaps, untestable claims and crossed human gates.
Check exports, three npm scripts, scaffold-before-red and slice dependencies.
Report severity, locations and corrections; no file edits, code, issues or runtime claims.
```

**Checkpoint:** `specs\<feature>\tasks.md` exists; analysis reports findings, not code. It is not a
sandbox: review tool requests. Omit externally publishing `taskstoissues`.
`converge`, unnecessary here, appends remediation tasks rather than implementing fixes.

This is the task file created by `/speckit-tasks`, not a root-level `tasks.md`
or the example in this repository. Its A/B/C ranges will control module 6.
Keep it beside the existing `spec.md` and `plan.md`; use the actual generated
task identifiers rather than assuming the reference artifacts' numbering.

Fix each blocker in its artifact manually or via scoped ordinary chat; inspect and
rerun analysis. Resolve blocking/high findings before module 6. Future execution
checks stay pending; unresolved requirements-checklist failures cannot be called passes.

**Review gate:** every FR has test tasks; record generated A/B/C task ranges and stops.
**If failed/time short:** pause and record your work as incomplete until the
controls pass. You may review a partner's passing project for comparison, but
do not treat their results as your own. Never copy unreviewed code/delete diagnostics.

<a id="module-6"></a>
## 6. Implement three gated slices  -  80 minutes

**Budget:** A 15, B 30, C 35. All terminals/chat/editor use the scratch project.
Review each command; never approve "continue everything" after a slice.

Before each slice:

1. Open `specs\<feature>\tasks.md` from module 5 and identify that slice's
   pending task range. The prompts' A/B/C labels refer to these reviewed
   ranges, not to separate feature directories.
2. Keep `specs\<feature>\plan.md` and its actual contract files open for
   comparison. Use the [ten-file inventory](#file-and-script-contract) to
   distinguish application files from `.specify\scripts` toolkit helpers.
3. Save edits before running commands at the scratch root. Record the test
   name, expected result, observed result, and review decision in the existing
   `specs\<feature>\quickstart.md`; do not mark future checks as passed.

### Slice A  -  scaffolds and a real red test

**Agent chat  -  gated implementation 1 of 3**
```text
/speckit-implement
Execute ONLY slice A scaffold tasks from the current tasks.md, then STOP.
Create the exact ten planned files and exact package.json scripts. Export every
contracted domain/storage function and createServer so test imports resolve.
Behavior stubs throw Error('not implemented'); STORAGE_KEY is 'booknook:v1'.
Make server import side-effect free. Do not implement domain/storage/server/UI
behavior, write passing placeholder tests or mark behavior tasks complete.
Do not install anything, start a server, commit or push. Report files changed
and pending behavioral tasks; request human review before any later slice.
```

Inspect all ten files created by this prompt, including untracked files from
`git status --short` absent from `git diff`. Check `.\package.json` against
module 4. An importable function stub throws `Error('not implemented')` when
called, while `STORAGE_KEY` is already the real string constant; importing
`server.mjs` must not start a server.

Open **`.\tests\domain.test.js`**, which slice A just scaffolded. Replace only
its placeholder scaffold with the **complete** next snippet and save it.
If meaningful tests already exist, preserve them and integrate these cases
rather than deleting coverage. Do not put this snippet in `src\domain.js`:
it tests that module; it is not the domain implementation. Missing files or
folders at this point mean the scaffold step is incomplete.

**File content  -  `tests/domain.test.js`**
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import * as domain from '../src/domain.js';

const ID = '11111111-1111-4111-8111-111111111111';
const ID2 = '22222222-2222-4222-8222-222222222222';
const { emptyState, validateState, addBook, setStatus, selectBooks } = domain;

test('scaffold exposes the domain API', () => {
  for (const name of ['emptyState', 'validateState', 'addBook', 'setStatus', 'selectBooks']) {
    assert.equal(typeof domain[name], 'function', name);
  }
});

test('FR-001: normalized add is immutable; duplicates in title are allowed', () => {
  const initial = emptyState();
  const before = structuredClone(initial);
  const first = addBook(initial, { title: '  Orbit  ', author: '  Ada  ' }, ID);
  assert.deepEqual(initial, before);
  assert.notStrictEqual(first, initial);
  assert.deepEqual(first.books, [{ id: ID, title: 'Orbit', author: 'Ada', status: 'unread' }]);
  const second = addBook(first, { title: 'Orbit', author: 'Ada' }, ID2);
  assert.deepEqual(second.books.map(book => book.id), [ID2, ID]);
  assert.equal(first.books.length, 1);
  assert.throws(() => addBook(first, { title: 'Other', author: 'Ada' }, ID));
});

test('FR-001: trim and UTF-16 boundaries', () => {
  const initial = emptyState();
  for (const [title, author] of [['T', 'A'], ['x'.repeat(120), 'a'.repeat(80)], ['\u{1f600}'.repeat(60), 'A']]) {
    assert.equal(addBook(initial, { title, author }, ID).books.length, 1);
  }
  for (const [title, author] of [['', 'A'], ['   ', 'A'], ['T', ' '], ['x'.repeat(121), 'A'], ['T', 'a'.repeat(81)], ['\u{1f600}'.repeat(61), 'A']]) {
    assert.throws(() => addBook(initial, { title, author }, ID));
  }
  assert.throws(() => addBook(initial, { title: 'T', author: 'A' }, 'not-a-uuid'));
});

test('FR-003/004: toggle and filter do not mutate earlier state', () => {
  const first = addBook(emptyState(), { title: 'Orbit', author: 'Ada' }, ID);
  const read = setStatus(first, ID, 'read');
  assert.equal(first.books[0].status, 'unread');
  assert.equal(read.books[0].status, 'read');
  assert.deepEqual(selectBooks(read, { status: 'unread' }), []);
  assert.equal(selectBooks(read, { status: 'read' }).length, 1);
  assert.deepEqual(selectBooks(read), read.books);
  assert.notStrictEqual(selectBooks(read), read.books);
  assert.throws(() => setStatus(first, ID2, 'read'));
  assert.throws(() => setStatus(first, ID, 'finished'));
  assert.deepEqual(validateState(read), read);
});
```

**How to read this test file**

The `node:test` import supplies the test runner and `node:assert/strict`
supplies assertions. `../src/domain.js` starts from `tests\domain.test.js`,
moves up to the scratch root, then enters `src`; keep that import spelling.
The first test inspects the imported namespace to confirm that all five
named exports exist before the behavior tests call them.

| Snippet element | Why it is here |
| --- | --- |
| `ID` and `ID2` | Fixed, valid UUID v4 fixtures make results repeatable. The actual browser UI generates IDs with `crypto.randomUUID()`; tests do not need randomness. Keep these constants for module 8's appended test. |
| `structuredClone`, `deepEqual`, and `notStrictEqual` | Compare original values and object identity: an update must return new state without changing the earlier state. The ID-order assertion checks that additions are prepended. |
| `assert.throws(() => ...)` | Calls invalid operations inside a callback and requires rejection. An always-throwing stub can pass negative cases, so those cases alone are not proof of implementation. |
| `'\u{1f600}'.repeat(60)` and `repeat(61)` | This character occupies two JavaScript UTF-16 code units. The cases exercise the title's 120-unit boundary, not a byte or visible-character limit. |
| Status and selection assertions | Require independent old/new states, correct read/unread subsets, a fresh selected array, and errors for unknown IDs or unsupported statuses. |

**Terminal  -  all shells, scratch root**
```text
npm run check
node --test tests/domain.test.js
```

**Expected red:** syntax/API-export checks pass; behavior tests fail in stubs with
`not implemented`. Record a failure/test name. Missing modules/exports, syntax errors,
zero tests or deliberate false assertions are **not red**. Repair scaffolds and repeat.

These commands do not create new source files. `npm run check` checks the
scaffold's syntax; `node --test tests/domain.test.js` runs **only that test
file**, not storage/server tests or browser checks. Append the observed red
result to `specs\<feature>\quickstart.md` before requesting implementation.

### Slice B  -  domain and storage

Open **`.\tests\storage.test.js`**, also created in slice A. Replace its
placeholder scaffold with the complete snippet below, preserving any real
tests already added. Save it separately from `tests\domain.test.js`.
Its `../src/storage.js` import resolves to the existing sibling `src` folder;
do not copy test code into `src\storage.js`.

**File content  -  `tests/storage.test.js`**
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, decodeState, loadState, saveState } from '../src/storage.js';

test('FR-002/006: only null means no saved state', () => {
  assert.equal(STORAGE_KEY, 'booknook:v1');
  assert.deepEqual(decodeState(null), { version: 1, books: [] });
  for (const raw of ['', '{', 'null', '[]', '{"version":2,"books":[]}']) {
    assert.throws(() => decodeState(raw));
  }
});

test('FR-006: oversize rejected before JSON parsing', t => {
  const parser = t.mock.method(JSON, 'parse', () => { throw new Error('unexpected parse'); });
  assert.throws(() => decodeState(' '.repeat(100001)));
  assert.equal(parser.mock.callCount(), 0);
});

test('FR-006: read/write failures propagate and do not erase bytes', () => {
  const failure = new Error('simulated storage failure');
  const raw = '{"version":1,"books":[]}';
  let bytes = raw;
  const storage = {
    getItem(key) { assert.equal(key, STORAGE_KEY); return bytes; },
    setItem(key) { assert.equal(key, STORAGE_KEY); throw failure; }
  };
  assert.deepEqual(loadState(storage), { version: 1, books: [] });
  assert.throws(() => saveState(storage, { version: 1, books: [] }), error => error === failure);
  assert.equal(bytes, raw);
  storage.getItem = () => { throw failure; };
  assert.throws(() => loadState(storage), error => error === failure);
});

test('FR-006: JSON escaping cannot produce an unreadable successful save', () => {
  const state = { version: 1, books: Array.from({ length: 200 }, (_, i) => ({
    id: `${i.toString(16).padStart(8, '0')}-0000-4000-8000-000000000000`,
    title: '\u0001'.repeat(120), author: '\u0001'.repeat(80), status: 'unread'
  })) };
  assert.ok(JSON.stringify(state).length > 100000);
  let writes = 0;
  assert.throws(() => saveState({ setItem() { writes++; } }, state));
  assert.equal(writes, 0);
});
```

**What the storage tests simulate**

These tests run in Node with small **fake storage objects**, not your browser's
`localStorage`. Their JSON strings are in-memory fixtures, not files to create
or payloads to paste into the real app.

| Test | Mechanism and required outcome |
| --- | --- |
| Only `null` means missing | JavaScript `null` represents an absent key. The strings `''`, `'null'`, and invalid JSON/schema values must not become a successful empty library. |
| Oversize before parsing | `t.mock.method` temporarily replaces `JSON.parse`. Its call count must stay zero for 100001 code units, proving rejection happens **before** parsing. The test context restores its mock after the test. |
| Read/write failures propagate | The injected `getItem`/`setItem` methods check the key and throw a specific error. The adapter must propagate it and leave the original value untouched, not report an in-memory save as success. |
| Escaping cannot produce unreadable saves | Each `\u0001` occupies one input code unit but expands when JSON-encoded. The 200-book fixture exceeds the serialized-output limit even though its fields fit their bounds; `writes` must remain zero. Do not replace it with ordinary letters and lose that boundary case. |

**Terminal  -  all shells**
```text
node --test tests/storage.test.js
```

Record a behavioral failure, not an import error. These starter tests are not full coverage.

The next prompt first **extends** `tests\domain.test.js` and
`tests\storage.test.js`, then implements `src\domain.js` and
`src\storage.js`. `server.mjs`, `src\app.js`, and
`tests\server.test.js` still have no completed behavior at this gate.
Keep the existing tests and public export names; do not add another storage
module or introduce browser globals into the pure domain/adapter modules.

**Agent chat  -  gated implementation 2 of 3**
```text
/speckit-implement
Execute ONLY B, preserving copied tests. First extend domain/storage tests for:
canonical lowercase UUID v4 (reject uppercase/version/variant errors), duplicate IDs
versus allowed duplicate titles, missing/extra fields, invalid types/version/status/
schema, 200/201 entries, immutability/order, unknown ID, every status filter,
null versus empty/corrupt JSON, 100000/100001 UTF-16 units, no parse beyond the cap.
Test injected getItem, exact-key writes, saveState returning undefined, round-trip,
validate-before-setItem, escaped JSON exceeding 100000 units rejected before writing,
read/write exceptions, no overwrite on decode failure.
Error wording is not contractual. Show reviewed behavioral red before implementation.
Then implement only src/domain.js and src/storage.js to make them green.
No DOM/global localStorage in these modules; no catch-and-reset, truncation,
eviction, raw-data logging or weakened assertions. Keep server/UI as scaffolds.
Run targeted domain/storage tests and syntax checks after command approval.
Update only verified slice B task statuses and evidence, then STOP for review.
```

**Terminal  -  all shells, after reviewing the change**
```text
node --test tests/domain.test.js tests/storage.test.js
npm run check
git --no-pager diff --check
git status --short
```

**Gate B:** targeted tests pass; review new files/diffs for immutability and propagated
storage errors. Empty server tests prove nothing. **If failed:** preserve assertions,
repair B; do not approve C.

The combined `node --test` command covers the two named test files only.
`git diff --check` checks patch whitespace, not program correctness;
`git status --short` also reveals untracked files that a normal diff omits.
Update only the completed B tasks in `specs\<feature>\tasks.md` and their
evidence in `specs\<feature>\quickstart.md`.

### Slice C  -  restricted server and browser UI

This slice completes the files that A scaffolded. The agent must first write
meaningful **`.\tests\server.test.js`** cases against the importable
`createServer()` stub in **`.\server.mjs`**, then stop for your review.
The test import is relative to the test file (typically `../server.mjs`).
Tests choose temporary loopback ports and close their servers; they do not
need `npm start` or ownership of the application's fixed port 4173.
Their accepted requests still send `Host: 127.0.0.1:4173` explicitly: the
temporary socket port isolates the test, while the Host value exercises the
application's fixed request-header contract.

**Agent chat  -  gated implementation 3 of 3**
```text
/speckit-implement
Execute ONLY C. First test importable createServer in tests/server.test.js using
ephemeral 127.0.0.1 ports but explicit Host 127.0.0.1:4173. Close every server.
Test import without listening, six GET routes, bodyless HEAD, content types,
denied POST, wrong/missing/duplicate Host, unknown/query/encoded/traversal and
package/spec/.git paths. Verify exact CSP, nosniff, no-referrer on resources and
handler-generated errors; parser-level rejections need not carry those headers.
Show behavioral red; STOP for human test
approval before replacing stubs. After approval finish only this slice.
Implement direct-run 127.0.0.1:4173 binding, fixed map, Host/method checks before
serving, safe failures, no filesystem path concatenation.
UI: external module, crypto.randomUUID(), textContent, labels/field errors,
visible focus, polite live feedback, filter/empty states, preventDefault first.
Catch localStorage property access AND load errors. Corrupt/read-failed storage
blocks writes. Save before display: failed add/toggle preserves old state/input,
announces accessible error, never success. No automatic reset.
No search, inline JS/styles, unsafe rendering, external assets or extra files.
After review run npm test and npm run check. Browser acceptance stays pending until module 7.
No commits/pushes. STOP at gate.
```

After inspecting red tests, approve in ordinary chat: "The reviewed server tests are
approved; finish only slice C as previously scoped." No weaker tests/future work.

Review the resulting files by responsibility before running the complete suite:

| Relative path | What to inspect in the completed slice |
| --- | --- |
| `server.mjs` | A fixed route-to-file map, exact Host/method checks, security headers, and listening only on direct execution. Importing `createServer` must still be safe. |
| `tests\server.test.js` | Positive and denied requests, correct headers/statuses, and cleanup on failure as well as success. An ephemeral test port does not prove the direct-run server binds safely; module 7 checks that separately. |
| `index.html` and `styles.css` | External script/style references, matching control labels/IDs, visible focus, and readable errors. Their paths must match the server's allowlist. |
| `src\app.js` | Imports the existing domain/storage modules, wires controls, renders text safely, and saves a candidate before publishing UI success. A relative `./domain.js` import here stays inside `src`, unlike the tests' `../src/domain.js` import. |

The app's private UI function names and element IDs may differ between agent
outputs; inspect your generated HTML and JavaScript together rather than
assuming names from the separate noGHCP starter. The domain/storage exports
and server contract are fixed. No new backend, build directory, or fourth
test file is needed.

**Terminal  -  all shells, after code review**
```text
npm test
npm run check
git --no-pager diff --check
git status --short
```

**Gate C:** all three test files contain meaningful passing tests; syntax and ten-file
review pass. A passing test count is not a coverage measurement. Check package scripts
again: `npm start` now has an implementation.
**If failed/time short:** stop at the last verified slice and record pending tasks.
"Should work" is not module 7 evidence.

<a id="module-7"></a>
## 7. Security and acceptance evidence  -  50 minutes

**Budget:** 10 HTTP checks, 15 normal/keyboard behavior, 20 adversarial storage
checks, 5 review. Keep failures linked to FRs; repair the smallest affected slice.

### Keep the three execution locations separate

1. **Terminal A:** open the scratch root containing `.\package.json` and
   `.\server.mjs`, completed in module 6. It will run the foreground server.
2. **Terminal B:** open a second terminal at the **same root**, with the same
   PATH setup. Use it for listener inspection, the HTTP probe, tests, and Git.
   Do not type those commands into A while A is running the server.
3. **Browser DevTools:** use only the disposable profile's page at
   `http://127.0.0.1:4173`. Browser-console snippets run in that page, not in
   either terminal and not in a source file.

Save all source edits first. Use the shell's current-directory command from
[Reading paths](#reading-paths-in-this-lab) if either terminal points elsewhere.
Record the outcomes manually in the existing
`specs\<feature>\quickstart.md`. The checks do not write that document for you
or require new application files.

### Start and probe the actual server

**Terminal A  -  all shells, scratch root; leave it open**
```text
npm start
```

This runs the `start` script in the root `package.json`, which executes
`server.mjs`. Leave the terminal occupied. Opening `index.html` directly with
a `file:` URL would bypass the server and its headers and use a different
storage context; it is not the lab's browser test.

The server's six allowed request targets map to these existing files:

| Browser request path | File relative to the scratch root |
| --- | --- |
| `/` and `/index.html` | `index.html` |
| `/styles.css` | `styles.css` |
| `/src/app.js` | `src\app.js` |
| `/src/domain.js` | `src\domain.js` |
| `/src/storage.js` | `src\storage.js` |

`server.mjs`, `package.json`, `tests\`, `specs\`, `.specify\`, and `.git\`
are **not** public routes. A request for one of them must not expose its
contents. All listed source files were scaffolded in A and implemented in
B/C; the browser URL `/src/app.js` is not a new generated copy of the file.

**Checkpoint:** listen only on `127.0.0.1:4173`. If occupied, find your earlier terminal
and Ctrl+C your server. Never kill unknown processes, switch ports, or bind `0.0.0.0`.

**Terminal B  -  Windows PowerShell 7: inspect the real listening socket**
```powershell
$listeners = @(Get-NetTCPConnection -State Listen -LocalPort 4173 -ErrorAction Stop)
if ($listeners.Count -ne 1 -or $listeners[0].LocalAddress -ne '127.0.0.1') {
  throw 'Expected exactly one listener at 127.0.0.1:4173; stop and review binding.'
}
$listeners | Select-Object LocalAddress, LocalPort, OwningProcess
```

**Terminal B  -  Windows Command Prompt (`cmd.exe`)**
```cmd
netstat -ano | findstr /R /C:":4173 .*LISTENING"
```

**Terminal B  -  Linux Bash**
```bash
ss -ltnp 'sport = :4173'
```

**Terminal B  -  macOS Bash**
```bash
lsof -nP -iTCP:4173 -sTCP:LISTEN
```

**Expected:** exactly one listener, on **127.0.0.1:4173**. `0.0.0.0`, `*`, `::`,
or any other address fails the gate even if the page loads. Record the observed
address and correlate it with your started Node process. If the inspection tool
is unavailable, use an approved OS equivalent or ask IT for help; do not
elevate privileges or count an HTTP response as proof of loopback-only binding.
Keep this check pending until you can inspect the listener.
In Command Prompt, inspect the **Local Address** and **PID** columns, not the
foreign address; no matching row is a failure, not a pass. The command includes
IPv4 and IPv6 listeners so an additional wildcard listener cannot be overlooked.

PowerShell wraps the results in `@(...)` so the count check works even for a
single result; it rejects an additional listener as well as a wrong address.
The Command Prompt/Bash commands display sockets for you to inspect rather
than automatically certifying the result. The PID identifies the owning
process; it is not permission to terminate an unfamiliar process.

This portable Node HTTP probe tests Host/raw paths without browser normalization.
Run only your shell's variant.

**Terminal B  -  PowerShell 7 or Bash, scratch root**
```text
node --input-type=module -e "
import assert from 'node:assert/strict';
import { request } from 'node:http';
const probe = (path, method='GET', host='127.0.0.1:4173') => new Promise((resolve,reject) => {
  const req=request({hostname:'127.0.0.1',port:4173,path,method,headers:{Host:host}},res=>{
    let body=''; res.setEncoding('utf8'); res.on('data',part=>body+=part);
    res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));
  });
  req.on('error',reject); req.setTimeout(3000,()=>req.destroy(new Error('probe timeout'))); req.end();
});
const q=String.fromCharCode(39);
const expected=['default-src '+q+'none'+q,'script-src '+q+'self'+q,'style-src '+q+'self'+q,'connect-src '+q+'none'+q,'base-uri '+q+'none'+q,'form-action '+q+'none'+q,'frame-ancestors '+q+'none'+q].sort();
for(const path of ['/','/index.html','/styles.css','/src/app.js','/src/domain.js','/src/storage.js']){
  const r=await probe(path); assert.equal(r.status,200,path);
  assert.deepEqual(r.headers['content-security-policy'].split(';').map(x=>x.trim()).filter(Boolean).sort(),expected);
  assert.equal(r.headers['x-content-type-options'],'nosniff');
  assert.equal(r.headers['referrer-policy'],'no-referrer');
}
const head=await probe('/','HEAD'); assert.equal(head.status,200); assert.equal(head.body,'');
for(const args of [['/','POST'],['/','GET','localhost:4173'],['/','GET','attacker.invalid:4173'],['/package.json'],['/.git/config'],['/specs/'],['/../package.json'],['/%2e%2e/package.json'],['/index.html?x=1'],['/src/../index.html']]){
  const r=await probe(...args); assert.ok(r.status>=400 && r.status<500,JSON.stringify(args));
}
console.log('PASS: allowlist, denied requests, HEAD and security headers');
"
```

Command Prompt cannot use the multiline quoted argument above. Run this
equivalent **single-line** command; it constructs percent signs in JavaScript
so the shell cannot expand encoded paths as environment variables.

**Terminal B  -  Windows Command Prompt (`cmd.exe`), scratch root**
```cmd
node --input-type=module -e "import assert from 'node:assert/strict'; import { request } from 'node:http'; const probe=(path,method='GET',host='127.0.0.1:4173')=>new Promise((resolve,reject)=>{ const req=request({hostname:'127.0.0.1',port:4173,path,method,headers:{Host:host}},res=>{ let body=''; res.setEncoding('utf8'); res.on('data',part=>body+=part); res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body})); }); req.on('error',reject); req.setTimeout(3000,()=>req.destroy(new Error('probe timeout'))); req.end(); }); const q=String.fromCharCode(39),p=String.fromCharCode(37); const expected=['default-src '+q+'none'+q,'script-src '+q+'self'+q,'style-src '+q+'self'+q,'connect-src '+q+'none'+q,'base-uri '+q+'none'+q,'form-action '+q+'none'+q,'frame-ancestors '+q+'none'+q].sort(); for(const path of ['/','/index.html','/styles.css','/src/app.js','/src/domain.js','/src/storage.js']){ const r=await probe(path); assert.equal(r.status,200,path); assert.deepEqual(r.headers['content-security-policy'].split(';').map(x=>x.trim()).filter(Boolean).sort(),expected); assert.equal(r.headers['x-content-type-options'],'nosniff'); assert.equal(r.headers['referrer-policy'],'no-referrer'); } const head=await probe('/','HEAD'); assert.equal(head.status,200); assert.equal(head.body,''); for(const args of [['/','POST'],['/','GET','localhost:4173'],['/','GET','attacker.invalid:4173'],['/package.json'],['/.git/config'],['/specs/'],['/../package.json'],['/'+p+'2e'+p+'2e/package.json'],['/index.html?x=1'],['/src/../index.html']]){ const r=await probe(...args); assert.ok(r.status>=400 && r.status<500,JSON.stringify(args)); } console.log('PASS: allowlist, denied requests, HEAD and security headers');"
```

**Expected:** PASS and exit zero. Refusal is startup failure, not security success.
Repair failed requirements/tests, never loosen assertions. Server tests additionally
cover missing/duplicate Host. The OS listener check, not this HTTP probe or a
factory test's chosen address, verifies the direct-run binding.

**How the HTTP probe works**

| Part of the snippet | Explanation |
| --- | --- |
| `node --input-type=module -e` | Evaluates the quoted JavaScript directly in Node, with ES-module imports and top-level `await`. It does not create a probe file or belong in `server.mjs` or `tests\server.test.js`. |
| `probe(path, method, host)` | Sends a real request to the already-running server and collects its status, headers, and body. Raw request paths are retained so traversal/encoding cases are not normalized away by a browser. |
| Error handler and 3000 ms timeout | Network errors and stalled requests fail the check instead of counting as successful denials or waiting forever. |
| `q` and `expected` | Build the quoted CSP directives and compare their sorted values. Sorting allows directive ordering to differ, not the policy's contents. `nosniff` and `no-referrer` are checked separately. |
| Allowed-route loop and `HEAD` | Require each allowed GET to succeed and the root HEAD response to have no body. The denied-request loop requires a 4xx result; the module 6 server tests cover the more specific status/header contracts and malformed Host cases. |
| Command Prompt's `p` | Builds the percent sign used in encoded paths without letting `cmd.exe` treat it as environment-variable syntax. The single-line command performs the same checks as the multiline variant. |

Assertions stop the probe with a failure rather than printing `PASS`.
Neither variant changes browser storage. Record the command variant, outcome,
and any failing case in `specs\<feature>\quickstart.md`, not a fabricated
transcript or a new application log file.

### Normal behavior and keyboard

Create a **disposable local browser profile** via the profile menu; no sign-in/sync,
fictional data only. Open `http://127.0.0.1:4173`, not `localhost`, and retain it
across refreshes. Use **one application tab**: concurrent-tab conflict resolution
is outside this design. Inspect DevTools failures without copying raw storage data.

In DevTools, browser JavaScript appears under the page's origin and `src`
paths; these correspond to the scratch project's `src\*.js` files.
The Application/Storage panel's **Local Storage -> `http://127.0.0.1:4173`**
contains the `booknook:v1` key. Panel names vary slightly by browser.
That key is browser-profile data, **not a file under `src`, `specs`, or the
project root**. Refreshing or restarting Node does not clear it.

| Action, in order | Expected evidence |
| --- | --- |
| Fresh origin with no key | Empty-library message; no corruption error (FR-010) |
| Tab through form, enter `Orbit` / `Ada`, submit by keyboard | Visible focus and labels; unread book; polite success feedback (FR-001/008) |
| Add `River` / `Lin`; add `Orbit` / `Ada` again | Newest first; duplicate title allowed; three distinct UUIDs (FR-001) |
| Toggle a book with keyboard; select each status filter | Correct read/unread subsets; no mutation of other books (FR-003/004) |
| Refresh while a non-default filter is selected | Books/statuses persist; filter returns to all (FR-002/004) |
| Submit blank/whitespace fields | Associated visible field error; no added row; focus remains usable (FR-001/008) |
| Set filter to all; make every book unread, then select read | No-match state, distinct from an empty library (FR-010) |
| Inspect Network and headers | Only six allowlisted local assets; no application external requests (FR-009) |

Check every control with Tab/Shift+Tab and Enter/Space. Inspect accessibility-tree
labels/live regions and, if available, screen-reader announcements. Record the
method (keyboard/tree versus screen reader); this is not a WCAG audit.
An automatic browser request for `/favicon.ico` may receive 404; that is an
expected denied path, not a reason to expand the six-route allowlist.

### Scoped reset and bounded fixtures

Reset **only after recording evidence**, in the disposable profile. This discards
only app data. Never use `localStorage.clear()`, site-wide or filesystem deletion.

**Browser console  -  explicit reset, disposable profile only**
```javascript
if (location.origin !== 'http://127.0.0.1:4173') {
  throw new Error('Wrong origin');
}
if (confirm('Remove ONLY booknook:v1 fictional lab data in this disposable profile?')) {
  localStorage.removeItem('booknook:v1');
  location.reload();
}
```

The origin guard prevents the reset from running against a different origin;
it does not identify the browser profile, so confirm the disposable one first.
`confirm` asks permission before discarding the fictional library;
`removeItem` removes only this application's key, and reload exercises the
normal missing-key startup path. Cancelling leaves the value unchanged:
do not then run a replacement fixture as though you had consented.
No project file is deleted or rewritten.

Reset before each fixture. If paste is blocked, read/type the fixture or use the
storage editor; never disable protection or paste unknown website code.
Before every other console snippet, confirm the selected page still has the
exact lab origin; the snippets below do not repeat the reset's origin guard.

**Browser console  -  200 valid books (FR-005)**
```javascript
localStorage.setItem('booknook:v1', JSON.stringify({
  version: 1,
  books: Array.from({ length: 200 }, (_, i) => ({
    id: crypto.randomUUID(), title: `Fiction ${i + 1}`, author: 'Lab Author', status: 'unread'
  }))
}));
location.reload();
```

`Array.from` builds 200 valid fictional records, with generated UUIDs and
numbered titles. `JSON.stringify` serializes the versioned envelope;
`localStorage.setItem` writes it directly to the browser key, deliberately
bypassing the add form so you can test loading at the capacity boundary.
Reload then sends that stored value through your
application's normal load/validation path. Do not save this snippet as a
seed script or introduce a `books.json` file.

Try adding book 201: visible cap feedback, 200 rows, unchanged storage, no eviction.
Toggle/filter still work. Tests must reject persisted 201-entry states without truncation.

### Inert text and persisted tampering

Reset. Add title `<img src=x onerror=alert(1)>`, author `<b>Lab</b>` using the form.
Expect literal text, no new image/bold DOM element, no dialog, no `x` network
request. Inspect the DOM: a CSP-blocked event alone would not prove inert rendering.
Refresh and repeat that inspection.

Reset again, then seed a **schema-valid** persisted text attack:

**Browser console  -  untrusted but valid persisted strings (FR-007)**
```javascript
localStorage.setItem('booknook:v1', JSON.stringify({
  version: 1,
  books: [{ id: crypto.randomUUID(), title: '<img src=x onerror=alert(1)>', author: '<b>Lab</b>', status: 'unread' }]
}));
location.reload();
```

This fixture is **valid data with HTML-looking text**, unlike the corrupt
fixtures that follow. It must pass schema validation and render literally.
Inspect `src\app.js` for safe text insertion; there must not be an `img`
element created from the title. This separates safe rendering from CSP
merely blocking an injected handler.

Expect inert text/no injected elements. In the storage editor add an unexpected
book property and refresh: corruption error, blocked writes, unchanged bytes,
**not** removed properties or an empty successful library.

Reset before each case: set empty string, malformed `{`, wrong version, duplicate
IDs, or invalid status in the storage editor, then refresh. All are errors;
**deleting only the key** gives empty state. Record named tests for string/UUID
bounds, 201 entries and 100000/100001 pre-parse limits alongside browser evidence.

Use the Application/Storage panel to edit the **value of `booknook:v1`** for
these corruption cases. Do not alter `specs\<feature>\data-model.md` to make
bad input acceptable: that file records the intended contract. If a case fails,
trace decoding in `src\storage.js`, schema validation in `src\domain.js`, and
the visible load-error/write-blocking behavior in `src\app.js`.

### Storage failure without false success

Reset, add a fictional book, note its status/stored value without publishing a dump.
Inject a write failure only for this key:

**Browser console  -  scoped write-failure injection (FR-006)**
```javascript
(() => {
  const original = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    if (key === 'booknook:v1') throw new DOMException('Lab write failure', 'QuotaExceededError');
    return original.call(this, key, value);
  };
})();
```

The immediately invoked function keeps the original method in a local
variable, then replaces `Storage.prototype.setItem` for the current page.
Only writes to `booknook:v1` throw the simulated `QuotaExceededError`; other
keys call the original method with its proper receiver. This simulates a
failed save without filling the browser's quota. **Do not paste it into
`src\storage.js` or commit the injected failure to application code.**

Try add and toggle: accessible errors, unchanged displayed/stored state, preserved
input, no success message. Reload to remove the override; confirm the original remains.

For read failure, set a DevTools Sources breakpoint at the **first startup storage
access in `src/app.js`**, reload, pause before access, then run:

1. In Sources, open the page resource
   `http://127.0.0.1:4173/src/app.js`, corresponding to the scratch file
   `.\src\app.js` completed in slice C.
2. Locate the first startup expression that reads `window.localStorage` or
   passes it to `loadState`. Generated line numbers vary; set a breakpoint
   **before that expression executes**, not in a later add/toggle handler.
3. Reload and confirm execution pauses there. While paused, use the page's
   Console to run the following snippet, then resume execution.
4. Observe the load error and disabled mutations. Remove the breakpoint and
   reload before the next independent injection.

**Browser console  -  paused startup read-failure injection (FR-006)**
```javascript
(() => {
  const original = Storage.prototype.getItem;
  Storage.prototype.getItem = function (key) {
    if (key === 'booknook:v1') throw new DOMException('Lab read failure', 'SecurityError');
    return original.call(this, key);
  };
})();
```

This wrapper changes reads, not saved bytes. Throwing from `getItem` checks
that `loadState` in `src\storage.js` propagates the failure and startup code
in `src\app.js` reports it instead of enabling a writable empty list.
Running it only after the application has already loaded would not exercise
this startup case.

Resume: accessible load error, blocked writes, no overwrite/writable empty fallback.
Remove breakpoint and reload; confirm original data remains. If timing is uncertain,
repeat the pause/injection sequence and confirm the breakpoint is hit before
storage access; unit tests alone cannot pass this UI case.

Finally, pause at the same startup breakpoint again and simulate denial of the
`localStorage` property itself, before `getItem` can even be called:

**Browser console  -  paused startup property-access failure (FR-006)**
```javascript
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  get() { throw new DOMException('Lab storage access denied', 'SecurityError'); }
});
```

The accessor throws when the application first tries to obtain
`window.localStorage`, before it can call `getItem`. This tests a different
failure boundary from the previous snippet. Reload removes either temporary
JavaScript override; neither is a source-file edit or
permission to erase the stored library.

Resume: require the same accessible load error and blocked writes, not an
uncaught startup exception. Remove the breakpoint and reload to remove the
override; verify the original saved book is still present.

**Review gate:** record HTTP, named tests, keyboard method and browser results in
`specs\<feature>\quickstart.md`. Review DOM sinks, storage catches, routes and
package scripts yourself or with a peer.
Fix failures; repeat affected checks plus `npm test` / `npm run check`. Never invent evidence.

### Preserve a no-commit review baseline

After the base passes human review, stage **only the reviewed scratch files**
below. Inspect their contents for secrets first; do not use `git add .`.
This snapshots them in the local Git index without making a commit or publishing
anything. It lets the next module's `git diff` show what CR-001 actually changes.

The staged paths have different origins: `.gitignore`, `.github\skills\`,
and managed `.specify\` scaffolding came from module 1 and your later
constitution edits; `specs\<feature>\` contains the module 3-5 artifacts
and evidence; the ten application/test files came from module 6. Inspect
the directory contents before staging them. Preserve
`.specify\.gitignore` so the local `.specify\feature.json` pointer remains
ignored; if it appears in the staged files, stop and investigate.

**Terminal  -  all shells, scratch root only**
```text
git add -- .gitignore .specify .github specs package.json server.mjs index.html styles.css src tests
git --no-pager diff --cached --stat
git --no-pager diff --cached
git --no-pager diff --exit-code
```

**Expected:** the staged diff contains the reviewed baseline; the final command
exits zero with no unstaged diff. Inspect `git status --short` for unexpected
untracked files. Do not stage further changes or let the agent stage them until
CR-001 review is complete. This index snapshot is a comparison aid, not a backup
of browser data or a replacement for durable version history.

`git add` writes Git's local index (`.git\index` in this scratch repository);
do not edit that file manually. `--cached` compares the index with the last
commit, or shows staged additions if there are no commits yet. The final
`--exit-code` command compares working files with the index, **not untracked
files**. That is why the separate status/file inspection is still necessary.

<a id="module-8"></a>
## 8. Controlled change: search  -  60 minutes

**Budget:** 15 impact/spec, 10 plan/tasks, 20 tests/code, 10 regression, 5 review.
Search is not permission to redesign.

Use ordinary agent chat for the artifact amendment below. Do **not** invoke
`/speckit-specify`: CR-001 extends the existing selected feature.

### Identify the existing files to change

Reopen the root `.\.specify\feature.json` and confirm it still selects the
same `specs\<feature>` directory from module 3. The pointer is **not inside
that feature directory** and should not change for CR-001. There is no new
`CR-001` folder or separate `clarifications.md`: clarification decisions stay
in the existing specification.

| Relative path | Change-control action |
| --- | --- |
| `specs\<feature>\spec.md` | Append/reconcile US3, FR-011, clarification decisions, and measurable search acceptance cases; preserve FR-001-010. |
| `specs\<feature>\plan.md` | Explain the small selection/UI change and compatibility with the existing application. |
| `specs\<feature>\data-model.md` and the actual files under `specs\<feature>\contracts\` | Update the existing selection contract while explicitly preserving the saved schema. Amend only supporting documents actually produced in module 4. |
| `specs\<feature>\tasks.md` | Append dependent, test-first CR-001 tasks; retain completed base tasks and their evidence. |
| `specs\<feature>\quickstart.md` and the actual checklist file under `specs\<feature>\checklists\` | Add pending search/regression evidence and review questions. Record results only after performing them. |
| `tests\domain.test.js` | After artifact review, append the test below to the file created in module 6. |
| `src\domain.js`, `src\app.js`, and `index.html` | Only after red evidence and approval: extend selection, wire transient query state, and add the labeled control. Change `styles.css` only if needed for its presentation/focus. |

No functional change is needed in `src\storage.js`, `server.mjs`, or
`package.json`. Search is an in-memory view over the existing books, not an
API, persisted setting, dependency, or schema migration. Keep the staged
module 7 baseline intact while these edits remain in the working files.

**Agent chat  -  change-control request, no implementation**
```text
CR-001: extend the existing feature selected by the root .specify/feature.json.
Keep that selection and feature directory unchanged.
US3/FR-011: title OR author case-insensitive substring search; trim query;
blank matches all; AND with status; never persist query. Labeled keyboard search
and accessible no-match feedback.
Extend selectBooks(state,{status='all',query=''}={}) without breaking old calls.
Do not use regex matching, new dependencies, external services or schema changes.
Update current spec/clarifications, plan/data model/contracts, tasks, quickstart.
Preserve completed tasks; append traceable test-first tasks. Record rationale,
files, risks and regressions. No new feature/automatic branch/commit or implementation.
Return impact/diff for approval.
Do not run git add or otherwise replace the staged baseline.
```

**Checkpoint:** preserve tests/completed evidence and `{version:1,books:[...]}`.
Only selection/UI/tests need functional change; reject unrelated server/storage rewrites.
Run `git --no-pager diff` after each change to compare against the staged base;
use `git status --short` and inspect any new files separately.

**Agent chat  -  repeat analysis before accepting the change**
```text
/speckit-analyze
Read-only analyze CR-001 in the existing feature. Check US3/FR-011 traceability,
title OR author substring matching, case-insensitive and trimmed query, AND
composition with status, blank query, non-persistence, no-match feedback and
backward-compatible selectBooks calls. Preserve FR-001..010 and all safety gates.
Report conflicts/missing tests, do not implement or modify files.
```

Resolve blockers, then open **`.\tests\domain.test.js`** and append this
test **after the existing tests**, at module scope. Reuse the imports,
`ID`, `ID2`, and domain-function bindings from module 6's first snippet;
do not paste a second set of imports/constants or nest this inside another
test. If those names are missing, inspect how the earlier snippet was
integrated before proceeding. Do not replace the file or create
`specs\<feature>\tests\domain.test.js`.

**File content  -  append to `tests/domain.test.js`**
```javascript
test('FR-011: search combines title OR author with status AND', () => {
  const first = addBook(emptyState(), { title: 'Orbit', author: 'Ada' }, ID);
  const state = addBook(setStatus(first, ID, 'read'), { title: 'River', author: 'Lin' }, ID2);
  assert.deepEqual(selectBooks(state, { query: ' ADA ' }).map(b => b.id), [ID]);
  assert.deepEqual(selectBooks(state, { query: 'orb' }).map(b => b.id), [ID]);
  assert.deepEqual(selectBooks(state, { status: 'unread', query: 'Ada' }), []);
  assert.deepEqual(selectBooks(state, { status: 'read', query: 'ada' }).map(b => b.id), [ID]);
  assert.deepEqual(selectBooks(state, { query: '   ' }), selectBooks(state));
  assert.deepEqual(selectBooks(state, { query: 'absent' }), []);
  assert.deepEqual(selectBooks(state, { query: '.*' }), []);
});
```

The fixture makes Orbit/Ada read and leaves the newer River/Lin book unread.
Each assertion tests a distinct part of FR-011:

| Query/options in the snippet | Requirement being checked |
| --- | --- |
| `' ADA '` and `'orb'` | Trim/case-normalize the query and match **author OR title** by substring. |
| `status: 'unread', query: 'Ada'` | Combine the text match with status using **AND**; a read book must not leak into the unread view. |
| `status: 'read', query: 'ada'` | The same title/author match is included when status agrees. |
| Whitespace-only query | A blank query matches the original no-query selection; old calls remain compatible. |
| `'absent'` and `'.*'` | A genuine nonmatch is empty, and punctuation is literal text rather than a regular expression. |

The `.map(b => b.id)` assertions compare which fixture books were selected;
they do not change book IDs or stored data. These are Node domain tests,
not browser tests of the new control.

**Terminal  -  all shells, scratch root**
```text
node --test tests/domain.test.js
```

**Expected red:** search fails, baseline stays green. Unexpected pass? Inspect for
search slipping into the base slice; record scope breach, never invent red results.

Before implementation, a status-only `selectBooks` may ignore or reject the
new `query` option. A failure caused by that missing behavior is legitimate
red; a missing `ID`, syntax error, or wrong import path is a test-setup fault.
Record the observed failing assertion in `specs\<feature>\quickstart.md`.

**Agent chat  -  approved change implementation**
```text
/speckit-implement
Implement ONLY approved pending CR-001 tasks after reviewing red tests. Preserve
baseline tests/APIs. selectBooks query='': literal case-insensitive title OR author
substring, trimmed query, AND with status, new array/no mutation.
Labeled keyboard search, no-match/live feedback, textContent; no persisted query/filter.
No schema/dependency/server/scope changes. After command approval run npm test and
npm run check. Manual acceptance stays pending; report files/risks and STOP for
human review. No commits/pushes.
Do not stage changes; retain the reviewed index baseline for the final diff.
```

Inspect the resulting `src\domain.js` function and the matching control in
`index.html`/`src\app.js` together. The label's target and event-handler
lookup must refer to the same element. Query/filter values belong in UI
memory only; the existing save-before-display and failed-load gates must
remain intact. Do not copy private UI identifiers from the noGHCP starter
into an unrelated agent-generated implementation.

Save the files and reload the application to load the updated browser
modules. Reuse the server already running in Terminal A; do not start a
second instance. If a server restart is needed, stop only that instance
first. Record the earlier fixture evidence, then use module 7's consented
key-only reset before setting up the two-book browser scenario below.

**Regression gate:** rerun `npm test`, `npm run check`, and the module 7 HTTP probe.
In the disposable profile create `Orbit`/`Ada` (read), `River`/`Lin` (unread).
Search ` ADA ` and `orb`; expect Orbit. Combine `ada` with unread: no match.
Blank the query: status filtering still works. Search `.*`: literal no match.
Refresh: books/status persist, query is blank, filter is all. Repeat keyboard,
inert-text and write-failure checks; inspect storage to confirm no query field.

Append CR-001 red/green/browser results to the existing
`specs\<feature>\quickstart.md` without replacing base evidence, and update
only the supported CR-001 task statuses in `specs\<feature>\tasks.md`.
Keep incomplete checks pending and reject unrelated diffs. **If failed/time
short:** retain baseline evidence, mark CR-001 incomplete. Never remove failures,
reset the repository, or imply the budget guarantees completion.

<a id="module-9"></a>
## 9. Handoff and stop  -  20 minutes

**Budget:** 8 evidence review, 7 handoff review, 5 shutdown and reflection.

### Assemble the handoff from existing files

There is no new handoff document to generate. Use the existing
`specs\<feature>\quickstart.md` as the entry point, and record the actual
relative paths if any supporting artifact has a different name.

| Relative path or group | Origin and handoff purpose |
| --- | --- |
| `.specify\memory\constitution.md` | Seeded in module 1 and authored in module 2; identifies the governing constraints and human decisions. |
| `.specify\feature.json` | Local selector written during module 3; verify it still selects the reviewed feature. Keep it ignored, and record the actual feature directory in the quickstart rather than staging the pointer. |
| `specs\<feature>\spec.md` | Module 3 requirements plus module 8's CR-001 amendment; distinguishes accepted base behavior from the later change. |
| `specs\<feature>\plan.md`, `specs\<feature>\research.md`, `specs\<feature>\data-model.md`, and `specs\<feature>\contracts\` | Module 4 design artifacts, updated where CR-001 affected them. List the actual supporting filenames; do not claim absent outputs exist. |
| `specs\<feature>\checklists\` | Module 4's requirements-quality checklist(s), reviewed again for the change; not a substitute for executable evidence. |
| `specs\<feature>\tasks.md` | Module 5 tasks and later status/change updates; completed boxes must map to observed evidence. |
| `specs\<feature>\quickstart.md` | Module 4 run/evidence document, filled throughout modules 6-9; includes environment, commands, expected/actual results, review method, and remaining work. |
| The [ten application/test paths](#file-and-script-contract) at the scratch root, under `src\`, and under `tests\` | Scaffolds from module 6, completed there and amended in module 8. These are the files another reader runs, not the reference artifacts in this teaching repository. |
| `.gitignore`, `.specify\.gitignore`, `.github\skills\`, and the remaining managed `.specify\` scaffolding | Reviewed setup from module 1; preserve it and its ignore rules without treating generated instructions as test evidence. |

In `specs\<feature>\quickstart.md`, record your OS/shell, CLI/Node versions,
browser, and agent/model used without account details. Each result needs an
actual date and self/peer reviewer. The following is an **evidence-row format**,
not a claim that either example has passed; fill it with your own observations:

| Requirement | Relative file or action | Expected | Actual result/date/reviewer | Status or remaining gap |
| --- | --- | --- | --- | --- |
| FR-006 | `tests\storage.test.js`; module 7 save-failure UI exercise | Failed saves preserve data and show an error | Record the named test and separate browser observation | Not run / passed / failed, based on evidence |
| FR-011 | `tests\domain.test.js`; combined search/status browser exercise | Title OR author, AND status; query not persisted | Record red, green, and browser outcomes separately | Not run / passed / failed, based on evidence |

Do not copy the rows as pre-filled success, paste raw storage payloads, or add
extra application files just to store results.

### Review the base and change separately

Run these commands in Terminal B at the scratch root while Terminal A can
still serve the app. They print results/diffs; they do not generate a build,
create evidence files, stage changes, or make a commit.

**Terminal  -  all shells, scratch root**
```text
npm test
npm run check
git --no-pager diff --check
git status --short
git --no-pager diff
```

Review untracked files in the editor. The unstaged diff shows CR-001 against the
module 7 index snapshot; `git diff --cached` shows the staged base. Neither diff
alone includes both. No commit is required.
Later scratch-project checkpoint commits require separate, explicit approval.

In `git status --short`, the first status column describes the index and the
second describes working-file changes. For example, `AM` can mean a new
baseline file was staged in module 7 and then modified for CR-001; `??` means
an untracked file that neither diff includes. Read the actual files as well
as both diffs. Do not run `git add` now just to make the working tree look
clean: that would replace the comparison baseline.

Handoff checklist:

- The constitution, selected feature spec, clarifications, plan/contracts, checklist,
  tasks and quickstart agree, with FR-001-011 linked to actual evidence.
- The exact ten application/test files exist; scripts work without `npm install`.
- Red/green evidence distinguishes behavior failures from setup failures.
- Browser observations cover persistence, failures without data loss, tampering,
  bounds, empty/no-match states, keyboard access and search composition.
- Header/Host/allowlist checks passed against the actual server, not only mocks.
- Unfinished work is explicitly pending; nobody claims production readiness,
  WCAG certification, Azure deployment, secure backup, or multi-user isolation.

### Demonstrate a cold start and stop cleanly

1. Press Ctrl+C in the **existing server's Terminal A**. Remain at the scratch
   root containing the reviewed `package.json` and `server.mjs`.
2. Run `npm start` there again. In Terminal B, repeat module 7's listener
   inspection and your shell's HTTP probe; this checks the restarted process,
   not just the earlier test server.
3. Reload the disposable profile at `http://127.0.0.1:4173` and demonstrate
   add/toggle/search. A Node restart does not clear browser storage; use only
   the explicit consented reset if you need a fresh fictional fixture.
4. In Terminal B, rerun `node --test tests/domain.test.js` and identify the
   FR-011 result. Keep the full-suite results above as separate evidence.
   Record the demonstration in `specs\<feature>\quickstart.md`.
5. Explain how `src\app.js` saves before showing success, how
   `src\storage.js`/`src\domain.js` reject invalid state, and why real-data use
   would require redesign rather than simply exposing this local server.

Stop **your** server with Ctrl+C again. Close the disposable profile; optionally remove
only it via browser profile management. Preserve scratch files; no broad deletion/Git reset.
Recheck the listener to confirm your server is no longer listening. A
no-listener result (including PowerShell's no-matching-object error) is expected
for this shutdown check, not for module 7's running-server gate. Do not terminate
an unfamiliar process if the port is subsequently used by something else.
Continue with [brownfield adoption](./04-adapting-existing-projects.md) or
[SDD concepts](./01-what-is-spec-driven-development.md).

## Frozen sources and further reading

Frozen **v1.0.1** source: `9118ed15a0ba65053469a94c560ea5d233f75884`, reviewed 2026-09-22.
These independent upstream sources support CLI, integration, selection and workflow claims:

- [v1.0.1 release](https://github.com/github/spec-kit/releases/tag/v1.0.1).
- [Frozen CLI source: version/check and command registration](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/src/specify_cli/__init__.py).
- [Frozen Copilot integration: skills/defaults](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/src/specify_cli/integrations/copilot/__init__.py).
- [Frozen PowerShell feature creation](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/scripts/powershell/create-new-feature.ps1) and [Bash feature creation](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/scripts/bash/create-new-feature.sh).
- [Frozen implementation workflow](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/templates/commands/implement.md).

The following are living guidance, not frozen release behavior:
[Node release schedule](https://nodejs.org/en/about/previous-releases),
[Node test runner](https://nodejs.org/api/test.html),
[Microsoft Well-Architected pillars](https://learn.microsoft.com/en-us/azure/well-architected/pillars),
[Zero Trust principles](https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview),
[MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy),
and [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

Return to the [workshop overview](../README.md) or the
[student prework/reference](./02-spec-kit-breakdown.md).
