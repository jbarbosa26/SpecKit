# Tasks: Library & Reading Status

**Status:** Illustrative, all work pending; not a generated guarantee or executable
implementation. **Spec:** [spec.md](./spec.md). **Plan:** [plan.md](./plan.md).
**Toolkit:** Spec Kit v1.0.1; [constitution](./constitution.md) document version
2.0.0 is a separate version.

These tasks apply to the student's scratch application, **not this documentation
repository**. Inspect `.specify\feature.json` to locate the active feature's
`spec.md`, `plan.md`, and `tasks.md`; do not assume a feature branch or directory
name. Keep evidence in an existing student artifact (for example its actual
`quickstart.md`, if present, or `tasks.md`); additional outputs are not guaranteed.

## Execution Rules

- Base: **US1 P1 add/list/persist**, **US2 P2 toggle/filter**, **FR-001–FR-010**.
  No search until the separately approved **CR-001 / US3 / FR-011** iteration.
- Use the [exact ten files, scripts, and exports](./plan.md#fixed-application-files-and-scripts).
  Node 24, plain JS, no third-party JavaScript dependencies; no `npm install`,
  build/lint placeholders, extra files, remote services, or implementation framework.
- Fixed importable stubs come first. Write and run behavior tests **before**
  implementing their behavior; keep the lab's starter tests and extend them.
  Missing files/exports, syntax errors, empty suites, and artificial failures are
  setup defects, not legitimate red. Include positive tests so always-throwing
  stubs cannot appear complete. Schema-error wording is not an exact contract.
- `[P]` means **only** the explicitly named disjoint-file pair may run concurrently
  after its common prerequisite. It does not authorize crossing a human gate,
  editing a shared artifact, or overlapping a test with its implementation.
- Review scripts, proposed commands, permissions, and diffs before execution.
  Do not install globally, relax approval, commit, push, publish issues, or deploy.
  Use fictional fixtures only; no authentication, cloud, MCP, telemetry, database,
  application API, external assets, delete operation, import, or export.
- These are learning/review tasks, not production-readiness or compliance claims.
  Human review checkboxes remain unchecked until actual evidence exists.

## Before Implementation — Constitution, Threats, and Acceptance

- [ ] **T001 — Review requirements and threats before code.** In the student's
  `.specify\memory\constitution.md` and active `spec.md`, `plan.md`, `tasks.md`,
  verify US1/US2, every FR-001–FR-010, the threat/evidence matrix, strict schema,
  data preservation, text-only rendering, loopback/Host/routes/headers, labels,
  field errors, live feedback, and keyboard criteria. Resolve blocking findings
  from `/speckit-analyze`; record owner and peer/facilitator review, not agent
  approval. Identify A/B/C task ranges. **Depends on:** reviewed planning inputs.
  **Evidence:** requirement and manual browser scenarios specified before behavior.

## Module 6 — Three Human-Gated Implementation Slices (80 Minutes)

Budgets **A 15 + B 30 + C 35 = 80 minutes** are facilitator allocations, not
completion guarantees. Security/accessibility begin in T001/A; the later
acceptance module verifies them rather than postponing them as polish.

### Slice A — Scaffolds and Contract Stubs (15 Minutes)

- [ ] **T002 — Establish exact runtime and export scaffolds.** In `package.json`,
  `server.mjs`, `src\domain.js`, `src\storage.js`, and `src\app.js`, create the
  plan's private ES-module package and exact three scripts. Export all five
  domain functions, `STORAGE_KEY`, the three storage functions, and `createServer`.
  Set `STORAGE_KEY='booknook:v1'`; behavior stubs may throw `Error('not implemented')`.
  Importing the server must not listen. No persistence, domain, server, or UI
  behavior implemented yet. **Depends on:** T001.
- [ ] **T003 — Scaffold accessible, CSP-compatible markup.** In `index.html` and
  `styles.css`, establish semantic labeled title/author/add/filter controls,
  list/empty/error areas, polite live feedback, field-error associations, and
  visible focus styling. Use external module script and CSS only. No search,
  inline handlers, remote assets, or UI event behavior. **Depends on:** T002.
  **FR-007/FR-008/FR-009/FR-010.**
- [ ] **T004 — Scaffold the three test files and establish real red.** In
  `tests\domain.test.js`, `tests\storage.test.js`, and `tests\server.test.js`, use
  only `node:test`/`node:assert/strict` and the fixed exports. Add the lab's domain
  starter tests, an export-presence check, and positive behavioral assertions.
  Run `npm run check` and the domain tests. Record a failure inside the intended
  stub call, not an import error. Do not add passing placeholder tests to claim
  coverage for unimplemented storage/server behavior. **Depends on:** T002/T003.
  **FR-001/FR-003/FR-004 scaffolding evidence.**
- [ ] **T005 — Review early security/accessibility structure.** Inspect
  `index.html`, `styles.css`, `src\app.js`, `src\domain.js`, `src\storage.js`,
  and `server.mjs` before behavior:
  labels/live/error/focus structure, external assets, no unsafe sinks or logging,
  no listener on import, and no global storage access in the domain/adapter.
  Compare the exact file/export/script list with `plan.md`. **Depends on:** T004.
  This is a source review, not a passing browser acceptance claim.
- [ ] **T006 — Human gate A: stop.** Student owner and peer/facilitator review
  all ten files, the scaffold diff, syntax result, and genuine red evidence.
  Keep behavior tasks pending. Explicitly authorize B only after setup faults
  are fixed. **Depends on:** T005.

### Slice B — Tested Domain and Storage (30 Minutes)

- [ ] **T007 [P] — Domain tests first.** Extend `tests\domain.test.js` for D01–D05:
  fresh empty state; title 1/120/121 and author 1/80/81; whitespace/non-strings;
  UTF-16 emoji boundaries; canonical lowercase UUID v4 case/version/variant;
  duplicate titles allowed versus duplicate IDs rejected; order and immutability;
  missing/unknown fields at state and book levels; invalid schema/version/status;
  199→200/200→201; unknown-ID status changes; all/unread/read filtering and
  empty/no-match results. Assert valid cases as well as rejection; no exact
  schema-error messages. **Depends on:** T006. **FR-001/003/004/005/006/010.**
  May run only alongside T008, which edits a different file.
- [ ] **T008 [P] — Storage tests first.** Extend `tests\storage.test.js` for
  S01–S03 using an injected fake with a fictional saved book and unrelated key.
  Test exact key, round trip, `undefined` save return, null versus empty/corrupt
  JSON, unexpected fields at both levels, wrong version/types/status/IDs,
  duplicate IDs and >200 entries. Spy on parsing to prove >100000 rejection
  happens first, restoring the spy afterward; include the 100000 boundary.
  Test schema-valid escape-heavy candidates serialized to 100000 and 100001
  UTF-16 units: the former saves and round-trips; the latter throws before
  `setItem`, preserving prior nonempty saved bytes, unrelated keys, and input
  state. Invalid candidates also cause zero writes; do not assert exact error
  wording. For corrupt loads assert raw bytes and unrelated keys unchanged,
  zero writes/removals.
  Inject read denial, quota and security save exceptions; assert propagation
  and no erase/clear/replacement. **Depends on:** T006. **FR-002/005/006.**
  May run only alongside T007; do not edit shared evidence in parallel.
- [ ] **T009 — Record red before implementing B.** Run the domain/storage tests
  against the existing stubs; record named behavioral failures and expected
  outcomes in the student's evidence artifact. A negative test passing because
  a stub always throws does not prove validation. Repair test setup only, then
  rerun if necessary. **Depends on:** both T007 and T008.
- [ ] **T010 — Implement pure domain contracts.** In `src\domain.js`, implement
  `emptyState`, `validateState`, `addBook`, `setStatus`, and `selectBooks` exactly
  as planned. Reject extra fields rather than discarding them; validate without
  mutation, trim only add input, return new state/arrays, prepend new books,
  enforce UUID uniqueness and 200 bound. No query option yet. Run D01–D05 until
  green and preserve prior tests. **Depends on:** T009.
  **US1/US2; FR-001/003/004/005/006/010.**
- [ ] **T011 — Implement injected persistence contracts.** In `src\storage.js`,
  implement `decodeState`, `loadState`, and `saveState`: bounded parse, strict
  validation and no write on load. For saves, validate, `JSON.stringify`, reject
  serialized `.length > 100000` UTF-16 units before `setItem`, then write and
  return `undefined`; exceptions propagate. No access to browser globals,
  resets, raw-data logs, silent migration, truncation, eviction, or fallback.
  Run S01–S03 plus domain regressions. **Depends on:** T010 and T009 red evidence.
  **US1/US2; FR-002/005/006.**
- [ ] **T012 — Human gate B: stop.** Review `src\domain.js`, `src\storage.js`,
  both test files, observed red → green, mutation/boundary tests and preservation
  assertions. Run syntax checks and report unimplemented server/UI work honestly;
  do not claim a completed app because focused tests pass. Student/peer authorizes
  C only after review. **Depends on:** T011.

### Slice C — Tested Restricted Server and Accessible UI (35 Minutes)

- [ ] **T013 — Server tests first.** In `tests\server.test.js`, write H01/H02:
  unstarted factory/import safety; all six route/MIME/GET/HEAD cases; wrong,
  missing and duplicate Host; disallowed methods; unknown/query/encoded/traversal
   targets; exact CSP/nosniff/referrer headers on resources and handler-generated
   errors (not Node parser-level rejections); no HEAD bodies or file disclosure.
   Use `node:http`, ephemeral **127.0.0.1** ports and
  accepted **`Host: 127.0.0.1:4173`**; close all resources after failure too.
  Run and record red against `createServer`'s stub. **Depends on:** T012.
  **FR-007/FR-009.**
- [ ] **T014 — Implement the restricted server.** In `server.mjs`, implement
  `createServer()` and direct-run-only binding to **127.0.0.1:4173**. Use a fixed
  file map relative to the module, not concatenated user paths; enforce exact
  Host/GET/HEAD/routes, rejection status, MIME, no HEAD body and security headers.
  Do not add APIs, CORS, directory listings, alternative bind addresses/ports, or
  dependency-based serving. Run H01/H02 green and all Node regressions.
  **Depends on:** T013 red evidence. **FR-007/FR-009.**
- [ ] **T015 — Implement US1 browser wiring with safety first.** In
  `src\app.js`, `index.html`, and `styles.css`, implement add/list/persist and
  empty feedback. Use `crypto.randomUUID()`, `textContent`, and a form handler
  that calls `preventDefault()` first. Catch the storage property access and
  load errors; block mutations on failed load/corruption. Build a candidate,
  save it, then publish/render/announce; failed save retains prior books and
  entered values. Associate field errors, labels/live feedback and useful focus.
  Exercise previously specified B01/B03/B04/B05, including initial unimplemented
  outcomes before wiring behavior. **Depends on:** T014 and T001 scenarios.
  **US1; FR-001/002/005/006/007/008/010.**
- [ ] **T016 — Implement US2 without weakening US1.** In `src\app.js`,
  `index.html`, and `styles.css`, wire keyboard-operable read/unread actions and
  all/unread/read filter (default all). Persist status before changing displayed
  state; on write failure restore any changed control value, keep old books,
  and show an error. Filtering never writes storage, preserves order, and
  distinguishes no-match from an empty library. Maintain focus/labels/live
  feedback. Exercise B02/B03/B05 from their prewritten scenarios.
  **Depends on:** T015. **US2; FR-002/003/004/006/008/010.**
- [ ] **T017 — Verify the integrated safe UI, not only Node tests.** Run
  `npm run check`, `npm test`, and then `npm start` in the scratch root. Open
  **http://127.0.0.1:4173** in a disposable profile. Exercise B04/B05/B06:
  literal direct/restored text, keyboard focus/errors/live feedback, headers,
  local-only resource loading and denied paths. Review `src\app.js`,
  `index.html`, `styles.css`, `server.mjs`; no `innerHTML`/`eval`, raw logs,
  remote assets, or weakened CSP. **Depends on:** T016.
  **FR-007/FR-008/FR-009.**
- [ ] **T018 — Human gate C: stop.** Review the server/UI/test diff, H01/H02
  red → green, complete current test output, and actual browser results.
  Only the owner and peer/facilitator can accept this increment. Record missing
  evidence and repair the slice instead of starting search. **Depends on:** T017.

## Module 7 — Base Security and Acceptance (50 Minutes)

- [ ] **T019 — Run base story and boundary acceptance.** Execute B01/B02 from
  `spec.md`, including add/list/refresh, duplicate titles/order, length and
  200/201 limits, read↔unread, filter reset, and distinct empty/no-match states.
  Compare results with D01–D05/S01–S02 in `tests\domain.test.js` and
  `tests\storage.test.js`; record test/evidence references for
  **FR-001/002/003/004/005/010**. **Depends on:** T018.
- [ ] **T020 — Exercise adversarial preservation and accessibility.** Execute
  B03–B06 and H01/H02. Seed corrupt fictional data, including an unknown field
  at each schema level; attempted add/status must be blocked without changing
  bytes or unrelated keys. Separately simulate storage property/read denial and
  quota/save failure with a populated library: unchanged displayed/saved books
  and form input, accessible error, no false success. Restore injected failures
  and retry explicitly. Never use `localStorage.clear()`; any reset is limited
  to the app key in the disposable profile after student approval, not an app
  feature. Check inert restored text, keyboard-only correction/focus and headers.
   Review `src\app.js`, `src\storage.js`, `server.mjs` and matching tests.
   Inspect the actual `npm start` listener with the lab's OS-specific commands;
   require only `127.0.0.1:4173`. Factory tests or HTTP success alone do not prove
   the direct entry point avoids wildcard binding.
  **Depends on:** T019. **FR-003/006/007/008/009**, all earlier safety regressions.
- [ ] **T021 — Repair only evidenced gaps.** For a failed case, add/retain its
  reproduction in the relevant existing `tests\domain.test.js`,
  `tests\storage.test.js`, or `tests\server.test.js`, or its existing browser
  evidence record; observe the failure before repairing the corresponding
  `src\domain.js`, `src\storage.js`, `src\app.js`, `server.mjs`, `index.html`, or
  `styles.css`. Rerun focused/full checks and browser evidence. If no gaps, record
  that reviewed outcome without inventing fixes. **Depends on:** T020.
- [ ] **T022 — Human base-acceptance gate.** Check every FR-001–FR-010 row in the
  plan's matrix against actual test output, browser evidence and task completion.
   Record remaining risk/limitations, not a security certification or production
   claim. Do not approve CR-001 while a base blocker is unresolved.
   Stage only the explicitly listed reviewed files using the lab's no-commit
   baseline procedure. Inspect the staged contents and keep later CR-001 edits
   unstaged until their review; the index is a comparison aid, not a backup.
  **Depends on:** T021.

## Module 8 — Later CR-001 / US3 / FR-011 (60 Minutes)

**Absent from the base.** This second iteration includes review and testing,
not an optional unreviewed implementation shortcut. Keep the existing feature
directory, ten application/test files, saved schema, server routes and scripts.

- [ ] **T023 — Specify and review CR-001 before behavior changes.** Amend the
  active feature's `spec.md`, `plan.md`, and `tasks.md` for **US3 / FR-011**:
  trimmed case-insensitive title OR author substring search, AND status,
  blank matches all permitted books, no persistence, no-match feedback.
  Review impact on US1/US2, security, accessibility, and rollback by reverting
  only the proposed change through reviewed edits, not destructive resets.
  **Depends on:** T022; human approval required before T024.
- [ ] **T024 — Search tests first.** In `tests\domain.test.js`, write D06:
  title-only and author-only matches, case/trim, empty/whitespace queries,
  combined status, no-match, order, fresh-array/immutability, and unchanged
  default call. Run against base `selectBooks` and record a genuine behavioral
  red. Prewrite B07 keyboard, no-match, stored-schema and refresh scenarios.
  **Depends on:** T023. **FR-011.**
- [ ] **T025 — Extend selection only after red.** In `src\domain.js`, extend
  `selectBooks(state,{status='all',query=''}={})` to the reviewed predicate;
  do not alter add/status/storage semantics. Run D06 and base domain tests.
  **Depends on:** T024. **FR-011 plus FR-001/003/004/005/006 regressions.**
- [ ] **T026 — Add the accessible search control.** In `index.html`,
  `src\app.js`, and only if necessary `styles.css`, add a labeled keyboard-
  accessible input and transient query state; wire filtering/live no-match
  feedback. Do not write the query to storage or introduce remote requests.
  **Depends on:** T025 and B07 scenarios. **FR-011; retain FR-007/008/010.**
- [ ] **T027 — Verify search and the entire base.** Run `npm run check` and
  `npm test`; execute B07 plus B01–B06 relevant regressions. Confirm refresh
  resets query/filter, persisted books are unchanged, storage schema has no
  unknown fields, failed saves remain safe, and no extra file/route/dependency
  appeared. Record actual evidence in the existing student artifact.
  **Depends on:** T026. **FR-001–FR-011.**
- [ ] **T028 — Human change-acceptance gate.** Review CR-001 artifacts, the
  `tests\domain.test.js` red → green evidence, domain/UI diff and regression
  results. Record accepted/incomplete status honestly and repair blockers
  before declaring the change complete. **Depends on:** T027.

## Module 9 — Handoff (20 Minutes)

- [ ] **T029 — Record evidence, limitations, and stop.** In the student's
  existing evidence artifact, link each FR to actual results and reviewed task
  IDs, record runtime/model versions and unresolved findings, and distinguish
  base completion from CR-001 completion. Stop the foreground server with
  Ctrl+C and confirm the lab listener stopped; do not terminate unrelated
  processes. Leave work for review with no automatic commits/pushes.
  **Depends on:** T028; if time ran out, mark unfinished tasks explicitly rather
  than claiming all prerequisites passed.

## Dependencies and Truthful Parallelism

```text
T001 → T002 → T003 → T004 → T005 → T006 [human gate A]
                                      ↓
                              T007 [P]   T008 [P]
                                      ↓
                 T009 → T010 → T011 → T012 [human gate B]
                                      ↓
                 T013 → T014 → T015 → T016 → T017 → T018 [human gate C]
                                      ↓
                       T019 → T020 → T021 → T022 [base acceptance]
                                      ↓
                 T023 [change review] → T024 → T025 → T026 → T027 → T028
                                      ↓
                              T029 [handoff]
```

Only **T007/T008** are parallel candidates: they edit different test files after
T006, and both finish before T009/T010. Do not let either edit shared fixtures,
evidence, or package files concurrently. There are no other `[P]` tasks:
domain tests and domain implementation share a behavioral dependency, while UI
tasks share files. New helpers/files are not needed.

US1 and US2 have separate acceptance exercises but share the same domain/storage
foundation; the three implementation slices are not three invented user stories.
The [plan's matrix](./plan.md#test-and-evidence-matrix) maps **every FR to tests,
browser evidence, and these IDs**. IDs here are illustrative; generated IDs can
differ, so identify the actual slice ranges before invoking `/speckit-implement`.

The whole workshop is **20 + 35 + 45 + 45 + 35 + 80 + 50 + 60 + 20 = 390 minutes**,
excluding prework and breaks. Read the [walkthrough](../docs/03-walkthrough-and-lab.md)
for prompts and recovery. Do not skip security, evidence, or human gates to meet
these unmeasured facilitator budgets.
