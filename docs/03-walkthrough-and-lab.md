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

These 390 minutes are **facilitator budgets**, not measured completion claims.
Prework and breaks are additional. Never skip review to catch up.

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

Expected outputs are required outcomes, not classroom transcripts. In the generated
feature's `quickstart.md`, record requirement, command/action, actual result, date,
and reviewer. Exclude storage dumps, credentials, and account details.

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
never bypass controls. Preserve partial work/diagnostics for facilitator review.

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

**Checkpoint:** inspect feature `plan.md`, `research.md`, `data-model.md`, `contracts/`,
and `quickstart.md`. Contract filenames may vary; exports/behavior may not.
Compare the [reference plan](../examples/plan.md), especially its test matrix.

### File and script contract

Check all ten files/responsibilities against the plan prompt above. Require this package:
**File content  -  `package.json`, required content when scaffolded in module 6**
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

**Checkpoint:** `tasks.md` exists; analysis reports findings, not code. It is not a
sandbox: review tool requests. Omit externally publishing `taskstoissues`.
`converge`, unnecessary here, appends remediation tasks rather than implementing fixes.

Fix each blocker in its artifact manually or via scoped ordinary chat; inspect and
rerun analysis. Resolve blocking/high findings before module 6. Future execution
checks stay pending; unresolved requirements-checklist failures cannot be called passes.

**Review gate:** every FR has test tasks; record generated A/B/C task ranges and stops.
**If failed/time short:** reduce discussion, not controls. Review a partner's passing
project while recording your own as incomplete. Never copy unreviewed code/delete diagnostics.

<a id="module-6"></a>
## 6. Implement three gated slices  -  80 minutes

**Budget:** A 15, B 30, C 35. All terminals/chat/editor use the scratch project.
Review each command; never approve "continue everything" after a slice.

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

Inspect all files, including untracked files from `git status --short` absent from
`git diff`. Confirm module 4 exports; replace `tests/domain.test.js` scaffold below.
Later tests must extend it, not delete/weaken it.

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

**Terminal  -  all shells, scratch root**
```text
npm run check
node --test tests/domain.test.js
```

**Expected red:** syntax/API-export checks pass; behavior tests fail in stubs with
`not implemented`. Record a failure/test name. Missing modules/exports, syntax errors,
zero tests or deliberate false assertions are **not red**. Repair scaffolds and repeat.

### Slice B  -  domain and storage

Paste this second exercise over the scaffold `tests/storage.test.js`.

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

**Terminal  -  all shells**
```text
node --test tests/storage.test.js
```

Record a behavioral failure, not an import error. These starter tests are not full coverage.

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

### Slice C  -  restricted server and browser UI

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

### Start and probe the actual server

**Terminal A  -  all shells, scratch root; leave it open**
```text
npm start
```

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
is unavailable, use an approved OS equivalent with the facilitator; do not
elevate privileges or count an HTTP response as proof of loopback-only binding.
In Command Prompt, inspect the **Local Address** and **PID** columns, not the
foreign address; no matching row is a failure, not a pass. The command includes
IPv4 and IPv6 listeners so an additional wildcard listener cannot be overlooked.

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

### Normal behavior and keyboard

Create a **disposable local browser profile** via the profile menu; no sign-in/sync,
fictional data only. Open `http://127.0.0.1:4173`, not `localhost`, and retain it
across refreshes. Use **one application tab**: concurrent-tab conflict resolution
is outside this design. Inspect DevTools failures without copying raw storage data.

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

Reset before each fixture. If paste is blocked, read/type the fixture or use the
storage editor; never disable protection or paste unknown website code.

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

Expect inert text/no injected elements. In the storage editor add an unexpected
book property and refresh: corruption error, blocked writes, unchanged bytes,
**not** removed properties or an empty successful library.

Reset before each case: set empty string, malformed `{`, wrong version, duplicate
IDs, or invalid status in the storage editor, then refresh. All are errors;
**deleting only the key** gives empty state. Record named tests for string/UUID
bounds, 201 entries and 100000/100001 pre-parse limits alongside browser evidence.

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

Try add and toggle: accessible errors, unchanged displayed/stored state, preserved
input, no success message. Reload to remove the override; confirm the original remains.

For read failure, set a DevTools Sources breakpoint at the **first startup storage
access in `src/app.js`**, reload, pause before access, then run:

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

Resume: accessible load error, blocked writes, no overwrite/writable empty fallback.
Remove breakpoint and reload; confirm original data remains. If timing is uncertain,
repeat with the facilitator; unit tests alone cannot pass this UI case.

Finally, pause at the same startup breakpoint again and simulate denial of the
`localStorage` property itself, before `getItem` can even be called:

**Browser console  -  paused startup property-access failure (FR-006)**
```javascript
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  get() { throw new DOMException('Lab storage access denied', 'SecurityError'); }
});
```

Resume: require the same accessible load error and blocked writes, not an
uncaught startup exception. Remove the breakpoint and reload to remove the
override; verify the original saved book is still present.

**Review gate:** record HTTP, named tests, keyboard method and browser results in
`quickstart.md`. Peer-review DOM sinks, storage catches, routes and package scripts.
Fix failures; repeat affected checks plus `npm test` / `npm run check`. Never invent evidence.

### Preserve a no-commit review baseline

After the base passes human review, stage **only the reviewed scratch files**
below. Inspect their contents for secrets first; do not use `git add .`.
This snapshots them in the local Git index without making a commit or publishing
anything. It lets the next module's `git diff` show what CR-001 actually changes.

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

<a id="module-8"></a>
## 8. Controlled change: search  -  60 minutes

**Budget:** 15 impact/spec, 10 plan/tasks, 20 tests/code, 10 regression, 5 review.
Search is not permission to redesign.

Use ordinary agent chat for the artifact amendment below. Do **not** invoke
`/speckit-specify`: CR-001 extends the existing selected feature.

**Agent chat  -  change-control request, no implementation**
```text
CR-001: extend existing feature/directory/.specify/feature.json selection.
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

Resolve blockers; append this to `tests/domain.test.js`, reusing its imports/IDs.

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

**Terminal  -  all shells, scratch root**
```text
node --test tests/domain.test.js
```

**Expected red:** search fails, baseline stays green. Unexpected pass? Inspect for
search slipping into the base slice; record scope breach, never invent red results.

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

**Regression gate:** rerun `npm test`, `npm run check`, and the module 7 HTTP probe.
In the disposable profile create `Orbit`/`Ada` (read), `River`/`Lin` (unread).
Search ` ADA ` and `orb`; expect Orbit. Combine `ada` with unread: no match.
Blank the query: status filtering still works. Search `.*`: literal no match.
Refresh: books/status persist, query is blank, filter is all. Repeat keyboard,
inert-text and write-failure checks; inspect storage to confirm no query field.

Record CR-001 red/green/browser evidence; reject unrelated diffs. **If failed/time
short:** retain baseline evidence, mark CR-001 incomplete. Never remove failures,
reset the repository, or imply the budget guarantees completion.

<a id="module-9"></a>
## 9. Handoff and stop  -  20 minutes

**Budget:** 8 evidence review, 7 peer handoff, 5 shutdown and reflection.

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

Ctrl+C the existing server in Terminal A, then demonstrate a cold start there:
`npm start`, exact origin, add/toggle/search, and a named test in Terminal B.
Explain save-before-display, strict storage schema and redesign needed for real data.

Stop **your** server with Ctrl+C again. Close the disposable profile; optionally remove
only it via browser profile management. Preserve scratch files; no broad deletion/Git reset.
Continue with [brownfield adoption](./04-adapting-existing-projects.md) or
[SDD concepts](./01-what-is-spec-driven-development.md).

## Instructor rehearsal and recovery

The budget is not a measured classroom result. Rehearse the **entire** path before delivery:

1. Record date and OS/shell/runtime/tool/model versions; verify skills and permissions without bypass.
2. Use new scratch folder, disposable profile, pinned release; verify manual approval/slice stops.
3. Execute tests/probe/injections, breakpoints, port and storage failures; record duration/results.
4. Inspect all required test boundaries, import safety, binding, UUID/schema checks.
5. Offer reviewed instructor scratch snapshots for inspection without overwriting
   learner work. Distinguish inherited evidence from personally executed checks.
6. Add breaks outside 390 minutes. Preserve failures; repair only the affected slice,
   pair-review or schedule completion. No resets, blanket approvals or fabricated passes.

The [example artifacts](../examples/README.md) are specifications/plans, not a prevalidated application.

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
