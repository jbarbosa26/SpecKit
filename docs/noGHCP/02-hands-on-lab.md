# noGHCP: Manual spec-driven development lab

[Overview](./README.md) -> [Prerequisites](./01-prerequisites.md) ->
**02: Manual lab** -> [03: Validation, change, handoff](./03-validation-and-handoff.md)

You are the author, implementer, and reviewer. No AI tools, prompts, slash
commands, model calls, or generated specifications are involved. This is a
manual SDD companion, not an agent-free execution mode of the Specify CLI.

The supplied application already adds, lists, and persists fictional books
(US1). You will **specify new status/filter behavior before implementing it**
(US2), then repeat the process for search (US3). Do not claim that you wrote the
supplied infrastructure or tested an exercise that remains incomplete.

| Checkpoint | Minutes | Exit evidence |
| --- | ---: | --- |
| [1. Copy and inspect the baseline](#checkpoint-1) | 30 | Local project; supplied US1 baseline works |
| [2. Write rules and intent](#checkpoint-2) | 60 | Human-authored constitution, requirements, decisions |
| [3. Plan, decompose, review](#checkpoint-3) | 50 | Explicit contracts, tasks, and traceability |
| [4. Implement status/filter](#checkpoint-4) | 110 | Observed red/green and manual UI evidence |
| [5. Validate](./03-validation-and-handoff.md#checkpoint-5) | 60 | Security, browser, and failure evidence |
| [6. Search and handoff](./03-validation-and-handoff.md#checkpoint-6) | 80 | Reviewed second iteration and handoff |

Total: **390 minutes**, excluding prework/breaks. This document covers the first
250 minutes. These are facilitator budgets, not a guarantee of completion.

## How to follow the instructions

- **Terminal** means an ordinary PowerShell 7 or Bash shell in your scratch
  project. **File content** means edit the named file with your text editor.
- **Terminal A** runs ordinary commands and later the foreground server.
  **Terminal B** is a second shell in the same folder when A is serving.
- Write your own decisions into the provided templates. Replace every
  `[YOUR ...]` field; do not mark evidence passed before observing it.
- A partner may review your work. Solo students use the same concrete
  self-review questions and label the result as self-review, not peer approval.
- No application dependency install, account, remote repository, commit, push,
  deployment, or AI tool is required. Do not change machine security policy.

<a id="checkpoint-1"></a>
## Checkpoint 1: Copy and inspect the baseline - 30 minutes

Complete [prework](./01-prerequisites.md) first. In your file manager locate the
provided `docs/noGHCP/starter` folder and copy its **absolute path**. The commands
below ask for that path and create a fresh external scratch copy. Use only the
block for your shell, and do not overwrite an existing project.

**Terminal - Windows PowerShell 7**
```powershell
$source = Read-Host 'Absolute path to the supplied docs\noGHCP\starter folder'
$source = (Resolve-Path -LiteralPath $source -ErrorAction Stop).Path
foreach ($required in @('package.json', 'server.mjs', '.gitignore', 'src', 'tests')) {
  if (-not (Test-Path -LiteralPath (Join-Path $source $required))) {
    throw "Incomplete starter: $required is missing."
  }
}
$parent = Join-Path $HOME 'speckit-labs'
New-Item -ItemType Directory -Path $parent -Force | Out-Null
$destination = Join-Path $parent 'booknook-manual'
if (Test-Path -LiteralPath $destination) { throw 'Choose a new scratch destination; preserve existing work.' }
New-Item -ItemType Directory -Path $destination | Out-Null
Get-ChildItem -LiteralPath $source -Force | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $destination -Recurse -ErrorAction Stop
}
Set-Location $destination
git init
Get-Location
```

**Terminal - macOS/Linux Bash**
```bash
read -r -p 'Absolute path to the supplied docs/noGHCP/starter folder: ' source
destination="$HOME/speckit-labs/booknook-manual"
if [[ "$source" != /* ]] || [ ! -f "$source/package.json" ] ||
   [ ! -f "$source/server.mjs" ] || [ ! -f "$source/.gitignore" ] ||
   [ ! -d "$source/src" ] || [ ! -d "$source/tests" ]; then
  printf '%s\n' 'Stop: use the absolute path to a complete starter.'
elif [ -e "$destination" ] || [ -L "$destination" ]; then
  printf '%s\n' 'Stop: choose a new scratch destination; preserve existing work.'
else
  mkdir -p "$destination" &&
    cp -R "$source/." "$destination/" &&
    cd "$destination" && git init && pwd
fi
```

**Gate:** the printed location is your new scratch folder, not the teaching
repository. If copying failed, inspect the error and preserve partial work;
do not continue in the old directory or delete an unrelated folder.

Open the scratch folder in your editor with AI features disabled. Inspect
`package.json`: three scripts, no dependencies or install hooks. Inspect the
supplied server/storage code before executing it.

**Terminal - scratch root**
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

Create the following directories yourself. They are ordinary local files; no
tool discovers an active feature or generates their contents.

**Terminal - PowerShell 7**
```powershell
New-Item -ItemType Directory -Path '.specify\memory', 'specs\001-booknook' -Force | Out-Null
```

**Terminal - Bash**
```bash
mkdir -p .specify/memory specs/001-booknook
```

### 2.1 Write the constitution

Create `.specify/memory/constitution.md` in the editor and start with this
template. Read each principle and record a concrete reason for it.

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

### 2.2 Write the specification before changing code

The base is supplied, so record it as existing behavior. Your first **new**
feature is US2: status changes and filtering.

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

Clarify the scenario with a partner or yourself: what happens if a book is
already read, the ID does not exist, or a save fails? Write answers in
**Decisions**, not only in conversation. The contract permits a fresh immutable
state with the same status; an unknown ID is an error.

**Gate 2:** every new behavior has an observable outcome and explicit failure
case. The baseline/new-feature distinction is clear. Search is still excluded.
**Failure:** correct the document now; do not let implementation decide silently.

<a id="checkpoint-3"></a>
## Checkpoint 3: Plan, tasks, and human analysis - 50 minutes

### 3.1 Turn the requirements into a plan

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

**Terminal**
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

**Terminal**
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
