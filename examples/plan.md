# Implementation Plan: Library & Reading Status

**Status:** Illustrative design, pending human review; no implementation or passing
test result is supplied here. **Spec:** [spec.md](./spec.md).
**Governance:** [constitution.md](./constitution.md), document version 2.0.0,
distinct from **Spec Kit v1.0.1**.

## Architecture — HOW

Implement base **US1 (add/list/persist)** and **US2 (toggle/filter)** as a single-user
local browser demo. Use the latest patched **Node.js 24 LTS**, plain HTML/CSS and
JavaScript ES modules, **zero third-party JavaScript dependencies**, browser
`localStorage`, and built-in `node:test` with `node:assert/strict`.

The Node server serves static files only; book data never travels to it. There
is no application API, database, authentication, cloud deployment, MCP, telemetry,
external asset, delete operation, import, or export. All data and test fixtures
are fictional. Search is absent until the separate CR-001 section below.

This is a teaching design, not production readiness, a security certification,
or a claim of WCAG compliance. The browser profile, agent service, and local
machine remain trust boundaries. Do not send real data or secrets to an agent.

## Fixed Application Files and Scripts

These are the **ten files to implement in the student's scratch project**, not
files supplied by this documentation repository. No bundler, install hook,
dependency installation, build command, lint command, or extra test framework.

| File | Responsibility |
| --- | --- |
| `package.json` | Private ES-module package with exactly the scripts below |
| `server.mjs` | Import-safe restricted static HTTP server |
| `index.html` | Semantic form, list, filter, error/status regions; external script/style |
| `styles.css` | Layout, readable errors, visible keyboard focus |
| `src\domain.js` | Pure validation, immutable updates, selection |
| `src\storage.js` | Injected storage adapter and bounded decoding |
| `src\app.js` | Browser wiring, UUID creation, persist-before-publish, safe rendering |
| `tests\domain.test.js` | Domain contracts and boundary tests |
| `tests\storage.test.js` | Decode, persistence, failures, and preservation tests |
| `tests\server.test.js` | Import-safe server, HTTP allowlist/denial/header tests |

Required `package.json` content when the student scaffolds the app:

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

There are no `dependencies` or `devDependencies`; **no `npm install` is needed**.
`check` is syntax checking, not linting, runtime verification, or a security audit.
Spec Kit artifacts and the root `.gitignore` are repository housekeeping,
separate from these ten application/test files. Inspect
`.specify\feature.json` for the actual feature directory, rather than assuming a
branch or a generated filename. Supporting artifacts depend on the workflow.

## State Model and Validation

Persist only the key **`booknook:v1`**, containing JSON with this exact shape:

```text
{ version: 1, books: [ { id, title, author, status } ] }
```

- State and each book must be non-null record objects, not arrays. Require all
  specified own fields, no extra fields, and correct types; do not coerce values.
  `version` must be the number `1`; `books` must be an array of at most 200 books.
- Titles/authors are strings. `addBook` trims input, then enforces title length
  1–120 and author length 1–80 using JavaScript `.length` (UTF-16 code units).
  `validateState` rejects untrimmed saved values instead of changing them.
- `id` must match canonical lowercase UUID v4:
  `^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`.
  IDs are unique; duplicate titles/authors are allowed without warning.
  The UI supplies `crypto.randomUUID()`; domain tests inject fixed valid IDs.
- `status` is exactly `unread` or `read`. New books start `unread` and prepend.
  Status updates preserve order. Reject a 201st book, unknown IDs, missing/extra
  fields, unsupported versions, invalid statuses, and duplicate IDs.
- Validation never mutates input. Updates return new state and books arrays;
  status changes do not mutate the old book. Selection returns a new array.
  Filter state is held only in the UI, defaults to `all`, and is never saved.
- Raw storage must be `null` or a string; reject strings longer than **100000
  UTF-16 code units before JSON parsing**. Only `null` means absent. An empty
  string or parsed `null` is corruption, not a fresh library.

All invalid inputs throw an `Error`; **schema-error text is not a test contract**.
Tests check rejection, valid results, immutability, and preservation. Tests of an
injected storage exception may check that the same exception propagates.

## Fixed ES Module Contracts

These signatures bind the lab tests; they are not implementation snippets.

### `src\domain.js`

| Named export | Contract |
| --- | --- |
| `emptyState()` | Return a fresh `{version:1,books:[]}`, including a fresh array on every call. |
| `validateState(value)` | Return the valid state unchanged, or throw `Error`; never mutate or silently normalize persisted input. |
| `addBook(state,{title,author},id)` | Validate state, exact title/author input fields, strings and ID; trim input; enforce uniqueness/limit; return new state with an `unread` book prepended, or throw. |
| `setStatus(state,id,status)` | Validate state, known ID and requested status; return new state with the matching book updated, preserving order, or throw. |
| `selectBooks(state,{status='all'}={})` | Validate state/options; return a new array in existing order, filtering only for `unread`/`read`. `all` includes every book; other status options throw. No query support in the base. |

No browser globals, storage calls, time/randomness, or DOM operations in this module.
Tests may freeze or clone inputs to detect mutation. A returned array need not
deep-clone unchanged books, but consumers must not mutate them.

### `src\storage.js`

| Named export | Contract |
| --- | --- |
| `STORAGE_KEY` | The string `'booknook:v1'`. |
| `decodeState(raw)` | `null` returns `emptyState()`; otherwise require a bounded string, `JSON.parse` it, and call `validateState`. Reject corruption; never replace it with empty state. |
| `loadState(storage)` | Call `storage.getItem(STORAGE_KEY)`, then `decodeState`. Return validated state; propagate read/parse/validation exceptions. Never write during load. |
| `saveState(storage,state)` | Validate state, obtain `raw` with `JSON.stringify`, and reject `raw.length > 100000` before calling `storage.setItem(STORAGE_KEY, raw)`; return `undefined` after a successful write. Propagate validation, serialization, size-limit, and storage exceptions. |

Measure the serialized string in **UTF-16 code units**, not bytes or the summed
input-field lengths. Escaping can expand otherwise valid values beyond the read
limit. Reject before `setItem`, preserving existing bytes and unrelated keys.
This is a bounded-save failure, not permission to truncate or strip input.

Inject fake storage into tests; there is **no global `localStorage` access** in
this module. It does not clear/remove keys, log raw data, recover silently, or
decide whether UI writes are allowed. The UI owns that readiness gate.

### `src\app.js` — Browser Adapter

No exported UI API is required. Obtain `window.localStorage` **inside a try/catch**:
access to the property itself can throw, before `getItem` is called. Load first;
only a validated successful load (including genuine absence) enables mutations.

For add/status operations: prevent a form's default action first, build a
validated candidate state, call `saveState`, **then and only then** replace
committed state, render it, clear successful add input, and announce success.
On failure, keep the committed books/status/order and form input; show an
accessible error. A status control must not retain an optimistically changed
value after a failed write. There is no writable empty fallback.

Use DOM creation and **`textContent`** for book values, including restored data.
No `innerHTML`, `eval`, inline handlers, inline scripts/styles, or remote assets.
Load an external module script and stylesheet. Associate labels and field errors
(`aria-describedby` and `aria-invalid` where appropriate), provide visible focus,
and use an **`aria-live="polite"`** status region. Give status actions a meaningful
accessible name; keep focus useful after rerendering. Empty/no-match messages
must not replace a storage-error message.

### Storage State and UI Transitions

| Load/save condition | Display and write policy | Preservation/recovery |
| --- | --- | --- |
| Key missing: `getItem` returns `null` | Ready, genuine empty state; mutations enabled | Do not write an empty state just for loading. |
| Valid version-1 data | Ready, show books in saved order | Default filter `all`; reads/filtering never write. |
| Empty string, malformed JSON, oversized text, wrong schema/version/fields, duplicate IDs, or >200 books | Block mutations; show visible accessible load error, not a successful empty state | Keep original bytes and unrelated keys untouched. No silent migration/reset. |
| Storage property access or `getItem` throws | Block mutations; show storage-unavailable error | Do not pretend to load successfully or substitute writable memory state. Retry by reload after access is restored. |
| Candidate fails validation or serialization/bounded-output check | Retain committed state; show field/general error as appropriate | No write, no success, no input clearing. Correct the candidate before retry. |
| `setItem` throws, including quota/security denial | Retain committed/displayed state and entered values; no success | Do not delete/evict anything to make room; retry only by an explicit user action after the cause is fixed. |
| `setItem` succeeds | Publish candidate and announce success | Refresh must restore exactly the committed books/status/order. |

Corruption remains write-blocking until an **explicit student-approved reset of
only `booknook:v1` in a disposable profile**, followed by reload. Warn that its
fictional data will be lost. This is a lab recovery action, not an app delete
feature. **Never use `localStorage.clear()`**, reset another key/profile, log the
payload, or use recovery as a way to bypass a failed preservation test.

## Restricted Static Server Contract

`server.mjs` exports **`createServer()`**, returning an **unstarted `node:http`
Server**. Importing it never binds or starts anything. Direct invocation alone
listens on **`127.0.0.1:4173`**. Determine direct execution using the module file
and invoked script path; do not assume the current working directory. A port
collision is an error, not permission to choose another port/interface.

Browse to **`http://127.0.0.1:4173`**, not `localhost`: storage and the Host check
are origin-specific. The only fixed request-target/file mappings are:

| Exact route | Fixed file | Content-Type |
| --- | --- | --- |
| `/` | `index.html` | `text/html; charset=utf-8` |
| `/index.html` | `index.html` | `text/html; charset=utf-8` |
| `/styles.css` | `styles.css` | `text/css; charset=utf-8` |
| `/src/app.js` | `src\app.js` | `text/javascript; charset=utf-8` |
| `/src/domain.js` | `src\domain.js` | `text/javascript; charset=utf-8` |
| `/src/storage.js` | `src\storage.js` | `text/javascript; charset=utf-8` |

Resolve fixed file paths relative to `server.mjs`. **Never concatenate a request
path into a filesystem path**. Match the raw request target against the exact
map; do not decode/normalize traversal into an allowed path. Query strings,
encoded alternatives, directory requests, absolute targets, and unknown routes
are not additional allowlist entries.

1. Require exactly one Host header with value **`127.0.0.1:4173`**. Reject missing,
   repeated, or other values with 400; loopback binding alone is not this check.
2. Accept only **GET/HEAD**. Reject other methods with 405 and `Allow: GET, HEAD`.
3. Serve mapped resources with 200, and reject unknown targets with 404. No SPA
   fallback, listing, CORS enablement, uploads, write handlers, or data API.
4. HEAD returns the same status/headers as GET but no response body, including
   denial responses. Server/file failures produce a generic error, not paths,
   stack traces, or raw input.
5. Set these headers on served resources and application-handler error responses.
   Node can reject malformed HTTP before invoking the handler; for parser-level
   rejections, require rejection/no disclosure, not application response headers:

```text
Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
```

CSP is defense in depth, **not a substitute for `textContent`**. Forms must call
`preventDefault()` before JS processing because `form-action 'none'` prohibits
navigation. Successful use must not require weakening headers.

Server tests call `createServer()`, listen on an **ephemeral port on `127.0.0.1`**,
and send **`Host: 127.0.0.1:4173`** explicitly for accepted cases. The Host policy
does not change to the test port. Use `node:http` requests when exact raw targets
or duplicate headers matter; URL clients may normalize traversal. Close response
streams, connections, and server handles through test cleanup, including on
assertion failure. Never let tests claim the shared lab port or bind all interfaces.

Factory tests choose their own listener address, so they do not prove the
direct-run bind address. During B06, inspect the actual `npm start` listener with
the [lab's OS-specific commands](../docs/03-walkthrough-and-lab.md#module-7);
require exactly `127.0.0.1:4173`, not a wildcard. A successful loopback HTTP request
alone is insufficient evidence.

## Threat Model and Trade-offs

| Boundary / threat | Planned control and evidence | Residual limitation |
| --- | --- | --- |
| Input or restored text → DOM: script/markup execution | Exact schema plus `textContent`; restrictive CSP; D02/S02/H02 and B04 | Browser extensions or compromised same-origin code are not isolated by these measures. |
| Storage → application: corrupt/oversized payloads, unknown fields | Bound before parse, strict version/keys/IDs/status/count; S02 and B03 | Local storage is unencrypted and not a backup or integrity-protected store. |
| Candidate → persistence → display: quota/access failure and misleading success | Readiness gate and persist-before-publish; S03 and B03 | Browser eviction/profile deletion may still lose data; one active tab only, no conflict resolution. |
| HTTP request → local filesystem: traversal/exposure, Host rebinding | Exact loopback, Host/method/route map, headers; H01/H02 and B06 | Not authentication; another process on the device or a compromised device remains out of scope. |
| Controls → reader: inaccessible errors, lost focus, keyboard traps | Labels, field associations, focus, live feedback; B01/B02/B05 | Manual checks cover the exercise, not every assistive technology or WCAG criterion. |
| Agent/proposed commands → workstation or external service | Fictional prompts, manual command/permission/diff review; T001/T006/T012/T018 | No sandbox guarantee; approved Copilot service may involve organization policy and licensing. |

Reliability takes precedence over silent “recovery.” Operations use three small
scripts and non-sensitive evidence, not telemetry. The 200-book/100000-unit bounds
limit work, but are not performance benchmarks. No JavaScript supply-chain
dependencies or cloud provisioning are needed; local execution does not imply
that an agent subscription is free. These are security, reliability, operations,
performance, and cost trade-offs, not Microsoft endorsement or framework compliance.

## Test and Evidence Matrix

All tests are **planned**, not claimed passing. Put FR IDs in test names. Add
positive cases as well as rejection cases: an always-throwing stub must not
masquerade as a complete validator. No exact schema-error message assertions.

| Test/evidence ID | File or exercise and required assertions |
| --- | --- |
| **D01** | `tests\domain.test.js`: fresh empty states; add trimming; title 1/120/121, author 1/80/81; blanks and non-strings; 60/61 emoji titles; valid/ineligible UUID formats including case/version/variant; allowed duplicate titles versus rejected duplicate IDs; prepending; no mutation. |
| **D02** | `tests\domain.test.js`: valid state accepted unchanged; reject missing/extra state and book fields, wrong types, untrimmed saved strings, wrong version/status/UUID, duplicate IDs; state/array/book inputs unchanged on rejection. |
| **D03** | `tests\domain.test.js`: read/unread round trip; reject unknown ID/invalid status; new state without mutating old book or reordering books. |
| **D04** | `tests\domain.test.js`: default/all/unread/read selection, new arrays in original order, no-match result, invalid filter rejection; no state mutation. |
| **D05** | `tests\domain.test.js`: 199→200 accepted, 200→201 rejected without mutation, valid 200-book stored state accepted, 201-book stored state rejected. |
| **S01** | `tests\storage.test.js`: exact key, null yields fresh empty state, valid read/save/refresh round trip, `saveState` returns `undefined`; fake storage records calls. |
| **S02** | `tests\storage.test.js`: empty/malformed/parsed-null/array JSON, extra/missing fields at both levels, unsupported version, invalid status/ID, duplicate IDs, >200 entries; oversized input rejected before parse (spy restored after test). Test 100000-unit valid JSON with padding and rejection at 100001. Preserve each corrupt raw value and unrelated key; load causes zero writes/removals. For saves, use schema-valid escape-heavy fixtures whose serialized lengths are 100000 and 100001: the former saves and round-trips; the latter throws before any `setItem` call, preserving prior nonempty saved data, unrelated keys, and input state. Invalid candidates also cause zero writes. Do not assert exact error wording. |
| **S03** | `tests\storage.test.js`: injected `getItem` access failure and `setItem` quota/security failures propagate unchanged. Use an existing fictional book, not just empty storage; assert bytes and unrelated keys remain identical and no remove/clear calls occur. |
| **H01** | `tests\server.test.js`: importing does not listen; factory returns an unstarted server; ephemeral loopback request tests cover all six routes, MIME types, GET body and HEAD no-body behavior; always close handles. |
| **H02** | `tests\server.test.js`: deny wrong/missing/duplicate Host, methods, unknown routes, traversal/encoded/query targets; never return project secrets or other files; assert CSP/nosniff/referrer headers on resources and handler-generated error/HEAD responses. Node parser-level rejections need not include application headers. |
| **B01/B02** | Browser: US1/US2 scenarios with fictional `Orbit`/`Ada` and `Harbor`/`Bo`; limits, add/status refresh, newest-first/duplicates, filter reset and empty/no-match states. |
| **B03** | Disposable-profile browser: seed corrupt app data (including extra fields), reload and try add/toggle: writes blocked and raw data unchanged. Separately simulate storage property/read failure and quota/write failure; no false success, changed books, lost input, or erased data. Restore the injected failure and retry explicitly; only approved key-specific recovery for corruption. |
| **B04** | Browser: enter fictional HTML-like text such as `<b>Orbit</b>`; it displays literally before/after refresh and creates no `b` element. Inspect rendering code for text-only sinks; headers alone are insufficient evidence. |
| **B05** | Browser keyboard-only: Tab/Shift+Tab reach title, author, add, filter, and each status action with visible focus; Enter/Space activate appropriate controls; cause/correct an error, inspect label/error associations and live feedback, check useful focus after updates and no traps. |
| **B06** | Browser/HTTP and OS listener inspection: only approved local resources load; no remote requests or CSP workarounds; exact origin used. Inspect the running process's listening address to prove only `127.0.0.1:4173`, not a wildcard; denied paths do not disclose files. |

Tests S02/S03 verify the adapter; **B03 verifies the UI publication/write-blocking
gate**, which a Node fake alone cannot prove. Fake storage must never touch a
real browser profile. Manual failure injection is limited to the disposable
profile and restored/reloaded afterward, not an application fallback feature.

| Requirement | Test / evidence | Tasks |
| --- | --- | --- |
| FR-001 | D01/D02, B01 | T007, T010, T015, T019 |
| FR-002 | S01, B01/B02 | T008, T011, T015, T016, T019 |
| FR-003 | D03, B02/B03 | T007, T010, T016, T020 |
| FR-004 | D04, B02 | T007, T010, T016, T019 |
| FR-005 | D05/S02, B01 | T007, T008, T010, T011, T015, T019 |
| FR-006 | D02/S02/S03, B03 | T007, T008, T010, T011, T015, T016, T020 |
| FR-007 | H02, B04 and rendering review | T001, T013, T014, T015, T017, T020 |
| FR-008 | B01/B02/B03/B05 | T001, T003, T005, T015, T016, T017, T020 |
| FR-009 | H01/H02, B06 | T001, T013, T014, T017, T020 |
| FR-010 | D04, B01/B02/B03 | T007, T010, T015, T016, T019 |
| **Later FR-011 only** | D06/B07 below plus base regressions | T023–T028 |

## Delivery, Validation, and Human Gates

Use the [task sequence](./tasks.md): **A: scaffold/export stubs (15 minutes)**,
**B: tested domain/storage (30)**, **C: tested server/UI (35)** in the 80-minute
implementation module. Security/accessibility requirements are reviewed before
A and embodied in the scaffold; the separate 50-minute acceptance module verifies
them, rather than introducing them as polish.

Importable throwing stubs and the exact package/scripts come **before** behavior
tests. An export-presence smoke check may pass, but it is not behavior coverage.
Record an intended assertion or unimplemented-stub failure, then implement and
rerun. Missing modules/exports, syntax errors, and zero tests are setup defects,
not legitimate red evidence. Keep the lab's starter tests and extend them.

After scaffolding, these **terminal commands** work in PowerShell 7 or Bash in
the student's scratch root (not this documentation repository):

```text
npm run check
node --test --test-name-pattern="FR-001|FR-002|FR-005|FR-006"
npm test
npm start
```

Expect syntax success, recorded behavior red before implementation, then focused
and full green only for implemented behavior; do not claim a complete suite
while server/UI work is pending. Open `http://127.0.0.1:4173` in a disposable
profile for B01–B06. Stop the foreground server with Ctrl+C at handoff; no
background service installation. Inspect proposed scripts and diffs first.

Record test name/FR, action/command, actual result, reviewer and unresolved gaps
in the student's existing evidence artifact. No raw data dumps. If a gate fails,
stop and repair that slice with non-sensitive diagnostics; do not reset the
working tree/profile, weaken tests, or skip human review to meet a time budget.

- [ ] Constitution/spec/plan/tasks agree; scope, threats, and contracts reviewed.
- [ ] Gate A: ten-file scaffold, exact exports/scripts, early labels/focus structure,
  import safety, and genuine red evidence reviewed.
- [ ] Gate B: domain/storage red → green and preservation evidence reviewed.
- [ ] Gate C: server red → green, UI/browser evidence, and complete regression run reviewed.
- [ ] Base acceptance evidence and residual risks reviewed before CR-001.

## Later CR-001 Plan — Not Part of the Base

In the separate **60-minute** second iteration, amend the existing feature's
artifacts first. Add **US3 / FR-011**, without changing storage schema, server
routes, package scripts, or application file list.

Before amendment, follow the lab's reviewed **no-commit index snapshot**.
Keep the base staged and CR-001 unstaged until its review is complete, so
`git diff` reveals the change rather than comparing only untracked files.
Staging is not publication, a backup of browser data, or durable commit history.

Extend only the domain selection signature to
`selectBooks(state,{status='all',query=''}={})`. Trim the string query and compare
case-insensitive substrings against title **OR** author; combine with status
using **AND**. A blank query matches every book allowed by the filter. Preserve
order/new-array behavior. Do not persist query or add a search endpoint.

**D06**, in `tests\domain.test.js`, covers title/author matching, case, trim, empty
and whitespace-only queries, combined status, no-match, order and immutability,
and the original omitted-options call. Write and observe red before extending
`src\domain.js`. Add a labeled search input in `index.html`, wire ephemeral query
state in `src\app.js`, and adjust `styles.css` only if necessary for focus/layout.
**B07** exercises the later spec scenarios, keyboard/live no-match feedback, and
query/filter reset across refresh; inspect stored shape for no added fields.

Run base regression tests and B03–B06 again after the change. Review and record
actual results and any unfinished work; these documents do not certify a
completed classroom run.

## Version-Specific References

- [Spec Kit v1.0.1 release](https://github.com/github/spec-kit/releases/tag/v1.0.1)
  and [immutable README](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/README.md).
- The guided workflow uses Copilot skills `/speckit-plan`, `/speckit-tasks`,
  `/speckit-analyze`, and `/speckit-implement`, not terminal commands.
  Analysis is not an OS sandbox; generated artifacts are not guaranteed approvals.
- [Full workshop](../docs/03-walkthrough-and-lab.md) and
  [timing overview](./README.md#workshop-budget): nine modules, **390 minutes**,
  excluding prework and breaks. No commits, pushes, or publishing are required.
