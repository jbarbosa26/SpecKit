# BookNook Constitution

- **Document version: 2.0.0**
- **Status: Illustrative, unratified.** No ratification date or student/peer approval is asserted.
- **Toolkit baseline: Spec Kit v1.0.1**, separate from this document's version.

BookNook is a single-user, local browser reading-list **teaching demo using fictional data only**. This constitution expresses the workshop design constraints for specifications, plans, tasks, implementation, and later changes. It is not an executable application, a guaranteed generated output, or evidence of production readiness, compliance, or WCAG certification.

Version-specific workflow references are the [Spec Kit v1.0.1 release](https://github.com/github/spec-kit/releases/tag/v1.0.1) and its [immutable README source](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/README.md). The guided VS Code Copilot path uses skills: `/speckit-constitution`, `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-analyze`, and `/speckit-implement`.

## Core Principles

### I. Spec-First, Traceable, and Human-Owned

The **student is the owner** of scope and implementation decisions and reviews the specification, plan, tasks, and evidence, with a peer when available. Record whether each review is a self-review or peer review. Work MUST trace to an agreed user story or functional requirement. Review the spec, then plan, then tasks **before implementing behavior**; resolve ambiguity instead of allowing an agent to invent scope.

Security threats, data-preservation rules, and accessibility acceptance criteria MUST be considered in the constitution/specification and carried into the first implementation slice. A later review module checks them; it does not defer them. Agent analysis assists this review but cannot approve work on a human's behalf.

### II. Test-First with Honest Evidence

Use **red → green → refactor** for behavior changes. Define the intended behavior and fixed export contracts, write focused tests, observe a failure for the intended behavior, implement the smallest change, then rerun focused and full tests before refactoring.

**Minimal importable module scaffolds with the agreed fixed exports are allowed before the failing behavior tests.** Exported function stubs may throw `Error('Not implemented')`; they MUST NOT implement the behavior under test before red evidence. Missing files, unresolved imports, missing exports, syntax errors, and broken test setup are **not legitimate behavioral red**. Repair the scaffold and rerun until the test actually exercises the intended contract. Error-message wording is not a test contract.

Use built-in `node:test` and `node:assert/strict` for domain, storage, and restricted-server behavior. Inject fake storage into tests; wire browser `localStorage` only in the UI adapter. Importing the server MUST NOT start a listener; server tests use ephemeral loopback ports, the accepted Host header, and close their resources.

Review evidence MUST distinguish the observed red failure, the subsequent green result, regression checks, and manual browser exercises. Record actual outcomes and unresolved failures, never pre-filled success claims. Keyboard operation, visible errors, refresh persistence, and inert text rendering need browser evidence as well as automated coverage.

### III. Keep the Teaching Design Small

Use the **latest patched Node.js 24 LTS**, plain HTML/CSS/browser JavaScript ES modules, browser `localStorage`, and **zero third-party JavaScript dependencies**. No frameworks, database, bundler, external assets, or speculative abstractions are needed.

The student's application package is private and uses `type: "module"`. Its scripts are `start: "node server.mjs"`, `test: "node --test"`, and syntax-only `check` for `server.mjs`, `src\domain.js`, `src\storage.js`, and `src\app.js`. No `npm install`, build, or lint step is required. These reference documents do not themselves provide runnable scripts or application code.

No authentication, cloud deployment, MCP, APIs, telemetry, delete operation, import, or export belongs in this lab. Do not add extensions or external publishing steps. Local storage is unencrypted and can be lost; it is not a secure vault or backup.

### IV. Secure Defaults and Data Preservation

Treat input, persisted data, generated code, and proposed commands as untrusted. Use fictional data even in prompts, screenshots, and diagnostics. Never include secrets or real reading histories. Review scripts, permissions, and diffs before execution; do not enable unrestricted agent or terminal approval.

**Restricted serving**

- Bind the static server exactly to **`127.0.0.1:4173`** and browse to **`http://127.0.0.1:4173`**, not `localhost`. Reject every Host except `127.0.0.1:4173`.
- Accept only **GET/HEAD** for the exact allowlist `/`, `/index.html`, `/styles.css`, `/src/app.js`, `/src/domain.js`, and `/src/storage.js`. Never concatenate request paths into filesystem paths or serve source outside the allowlist.
- Set CSP to `default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`. Also set `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`.
- Render book values with **`textContent`**, never `innerHTML` or `eval`. Form handlers call `preventDefault()` before JavaScript processing. CSP is a second layer, not a substitute for safe rendering.

**Validated storage**

- Use only the key **`booknook:v1`**, with shape `{version:1,books:[]}`. Each book has exactly `{id,title,author,status}`; reject unexpected fields and unsupported versions.
- Trim title and author; require title length **1–120** and author length **1–80**, measured in JavaScript UTF-16 code units. Use canonical lowercase UUID v4 IDs generated in the UI with `crypto.randomUUID()`. Status is only `unread` or `read`.
- Allow duplicate title/author pairs, reject duplicate IDs, prepend new books, and enforce a maximum of **200 books**. Validation and domain changes MUST NOT mutate existing state.
- Only a missing key (`null`) yields an empty state. Empty strings, malformed JSON, invalid schemas, duplicate IDs, and more than 200 books are errors. Reject raw strings longer than **100000 UTF-16 code units before JSON parsing**.
- Before saving, validate state, serialize with `JSON.stringify`, and reject serialized strings over **100000 UTF-16 code units before calling `setItem`**. Preserve existing data on rejection; even schema-valid, escape-heavy values must not produce an unreadable saved state.
- Preserve corrupt or unsupported stored data and **block writes**. Recovery requires an explicit, student-approved reset of **only this app key** in a disposable browser profile, with a warning that its fictional data will be lost. This recovery action is not an application delete feature. Never reset automatically or call `localStorage.clear()`.
- Storage-access and save exceptions propagate to visible, accessible UI errors. A failed persistence operation MUST NOT report success or change displayed book state. Do not silently fall back to in-memory success, truncate data, or evict books.
- Do not log raw book values, storage payloads, or prompts. Retain only non-sensitive diagnostic evidence needed to explain and repair a failing slice; telemetry and action logging are not requirements.

### V. Accessibility Is Part of Every Slice

Use semantic controls and explicit labels for title, author, status filters, and actions. Every action MUST be reachable and usable by keyboard with a visible focus indicator and no keyboard trap. Associate validation errors with their fields; make storage errors visible and accessible. Use an **`aria-live="polite"`** status region for meaningful feedback.

Provide clear empty-library and no-match states. Check labels, focus, form errors, status changes, filtering, and readable layout in the browser from the first slice. These exercises provide limited review evidence, **not a WCAG certification or a compliance guarantee**.

## Scope and Iteration Boundary

- **Base US1 (P1):** validated add/list/persist across refresh.
- **Base US2 (P2):** toggle read/unread; filter all/unread/read, default all. The filter is not persisted.
- **Base FR-001–FR-010:** validated add/list; versioned persistence; status changes; status filtering; 200-book bound; safe corruption/storage failure handling; inert rendering; accessible keyboard feedback; restricted local serving; empty/no-match feedback.
- **Later CR-001 / US3 / FR-011 only:** title OR author case-insensitive substring search. Trim the query; combine it with status filtering using AND; blank query matches all; never persist the query; show a no-match message.

**Search is absent from the base scope.** Introduce it only in the separately reviewed **60-minute second iteration**, amending the existing feature's spec, plan, and tasks rather than opening a new feature directory. Retain the same storage schema and all earlier safeguards.

The whole workshop has nine suggested time allocations: **20 + 35 + 45 + 45 + 35 + 80 + 50 + 60 + 20 = 390 minutes**, excluding prework and breaks. These are planning estimates, not timing guarantees. Do not bypass review or safety checks to meet the clock.

## Development Workflow and Review

1. Review the constitution, fictional-data boundary, threats, and accessibility criteria; record self-review or peer review.
2. Use `/speckit-specify` and `/speckit-clarify`, then `/speckit-plan` and `/speckit-tasks`. Review scope, fixed export contracts, dependencies, and test coverage before implementation.
3. Use `/speckit-analyze` for read-only artifact analysis. It is not an OS sandbox, security audit, or substitute for the human review.
4. Review proposed commands and permissions, then use `/speckit-implement` for a bounded, test-first slice. Review its diff, observed red → green evidence, regression results, and browser checks before accepting it.
5. If needed, `/speckit-converge` appends remediation tasks, not application changes. Review those tasks before implementing further. Preserve useful non-sensitive diagnostics and repair the failing slice instead of destructive resets or unreviewed scope expansion.
6. For CR-001, amend spec → plan → tasks first, then repeat the test/review cycle and record any unresolved limitations.

Inspect **`.specify\feature.json`** to identify the actual feature directory; example paths and supporting research/contracts documents are not guaranteed outputs. Spec Kit v1.0.1 core does not initialize Git or create feature branches, and feature selection is not driven by the current branch.

Local self-review or peer review is sufficient for the exercise; record who reviewed the work and the supporting evidence. **Publishing a pull request or issues is not required.** No automatic commits or pushes are permitted; an optional local checkpoint commit in the student's scratch project requires explicit student approval.

### Human Review Record

Leave this reference unchecked. In a student's copy, record the reviewer and actual evidence only when review occurs.

- [ ] Reviewed scope, threats, accessibility, and traceability before implementation; recorded self-review or peer review.
- [ ] Spec, plan, tasks, and fixed exports agree, with search excluded from the base.
- [ ] Behavior tests show legitimate red → green evidence, with regression checks and remaining failures recorded.
- [ ] Storage corruption and save failures preserve data/state; text rendering and restricted serving were checked.
- [ ] Browser checks cover keyboard/focus, labels, accessible errors, empty states, filtering, and refresh persistence.
- [ ] CR-001 and any constitution amendments have their own rationale, consistent artifacts, tests, and review evidence.

## Governance

These principles govern this illustrative teaching design, not an organizational policy. The student owner proposes amendments with a **rationale and document-version change** and records a self-review or peer review. Update the constitution and check consistency across the spec, plan, tasks, tests, and implementation before accepting changed behavior.

Use MAJOR for principle redefinitions/removals, MINOR for new principles or substantive sections, and PATCH for clarifications. This document's **2.0.0** revision replaces the earlier broader application, logging, and mandatory-PR assumptions with the bounded local-first teaching design and evidence-based review. Its version is independent of **Spec Kit v1.0.1**.

Do not invent ratification dates, approvals, completed checklists, or compliance claims. This reference remains **illustrative and unratified** until an actual adopting group records its own decision.
