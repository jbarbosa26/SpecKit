# Feature Specification: Library & Reading Status

**Status:** Illustrative, pending human review; not generated output or an implemented application.

**Toolkit baseline:** Spec Kit v1.0.1.

**Related artifacts:** [constitution](./constitution.md), [plan](./plan.md), [tasks](./tasks.md).

## Purpose and Scope — WHAT and WHY

BookNook lets a single reader maintain a small reading list on their own machine.
The workshop uses **fictional data only**, including every fixture, title, and
author below. Reliable feedback matters more than feature count: the application
must not claim to have saved a change that it could not preserve.

The base is **US1 / US2 and FR-001–FR-010 only**. No authentication, sharing,
cloud deployment, application API, database, MCP, telemetry, external assets,
shelves, delete operation, import, or export is in scope. The separately proposed
search change at the end is **absent from the base**.

This specification defines observable outcomes and data-integrity constraints.
Runtime, filenames, storage mechanism, exported functions, and HTTP controls are
HOW decisions in the [implementation plan](./plan.md). The local-only boundary
is a requirement, not a claim of confidentiality, production readiness, or
accessibility/compliance certification.

## Base User Stories

### US1 — Add, list, and persist books (Priority: P1)

A reader records a title and author, sees their books newest first, and finds
the same list after refreshing. This provides value without status controls or
search.

**Independent acceptance exercise:**

1. Given no saved list, opening the application shows a clear empty-library
   message, not an error.
2. Adding fictional `Orbit` by `Ada` creates a book with a unique identifier and
   displays its trimmed title/author and status `unread`. Adding fictional
   `Harbor` by `Bo` puts it first.
3. Refreshing preserves the books, their order, and their statuses. Adding another
   `Orbit` by `Ada` is allowed without a duplicate-title warning or confirmation.
4. Blank or overlong input produces field-associated feedback without changing
   the saved list; the 201st book is rejected without removing an existing book.
5. If loading fails or saved data is invalid, an accessible error replaces any
   claim that an empty library loaded successfully, and writes are blocked.
   If saving fails, the previously displayed/saved books and entered values remain;
   there is no success announcement.

### US2 — Toggle and filter reading status (Priority: P2)

A reader marks a book `read` or `unread` and views all books or just one status.
This builds on US1 without introducing another entity or persisted preference.

**Independent acceptance exercise:**

1. Given the US1 fixture, changing `Orbit` to `read` changes only that book's
   status. Refreshing preserves it; changing it back to `unread` also persists.
2. The initial filter is `all`. Selecting `read` or `unread` shows exactly that
   subset in the existing newest-first order. Returning to `all` restores the list.
3. A filter with no results shows a no-match message distinct from an empty
   library. Filtering does not change saved books or their order.
4. Refreshing resets the filter to `all`, not the saved statuses.
5. A failed status save leaves the prior displayed status and stored list intact.
   All actions, including correction after an error, work with keyboard alone.

## Base Functional Requirements

| ID | Required observable behavior |
| --- | --- |
| **FR-001** | **Validated add/list.** Accept title and author as strings, trim both, require title length 1–120 and author length 1–80 in UTF-16 code units, and list title/author/status. Assign a unique canonical lowercase UUID v4; new books start `unread` and are prepended. Duplicate title/author pairs are allowed; duplicate IDs are invalid. Invalid input leaves the prior list unchanged. |
| **FR-002** | **Versioned persistence.** Preserve all accepted books, statuses, and order locally across refresh. Use version 1 of the data contract below; a successful save is a prerequisite to displaying or announcing a successful change. |
| **FR-003** | **Status changes.** Toggle an existing book between `unread` and `read`, preserving other books and order. Unknown IDs and all other status values are rejected without changing existing data. |
| **FR-004** | **Status filtering.** Offer `all`, `unread`, and `read`, defaulting to `all`. Filtering is a view of saved books, retains order, and is never persisted. |
| **FR-005** | **Bounded library.** Support at most 200 books. Accept the 200th; reject the 201st and reject saved lists already exceeding 200. Never silently truncate or evict. |
| **FR-006** | **Safe corruption and storage failures.** Only absence of saved data means an empty library. Empty text, malformed or invalid saved data, unexpected fields/version, duplicate IDs, and oversized lists are errors. Reject saved text over 100000 UTF-16 code units before parsing. Reject a change whose serialized representation exceeds that same limit before replacing any saved data, even when its fields are valid. Preserve invalid saved data and block writes; surface access/read/write errors visibly and accessibly. A failed save preserves prior displayed books, stored data, and form input; no silent reset, in-memory-success fallback, or raw-data logging. |
| **FR-007** | **Inert text.** Treat all titles/authors, including restored values containing HTML-like text, as text, never executable markup or script. |
| **FR-008** | **Keyboard and accessible feedback.** Provide labeled controls, visible focus, keyboard operation without traps, field-associated errors, and polite live status feedback. Errors and success must be distinguishable without relying only on color. |
| **FR-009** | **Local-only restricted serving.** Serve only approved application assets at the designated loopback origin. Reject other hosts, methods, and routes; prevent exposure of arbitrary local files and apply browser security headers. No app-origin remote connections or remote assets are required or permitted. |
| **FR-010** | **Empty/no-match feedback.** Distinguish a genuinely empty library from a populated library with no books matching the status filter. Neither message may hide a load/save failure. |

### Data Integrity Contract

- **Library:** exactly `version` (number `1`) and `books` (ordered list).
- **Book:** exactly `id`, `title`, `author`, and `status`; no missing or extra fields.
  Values must meet FR-001 and FR-003. Saved title/author values must already be
  trimmed; invalid saved values are rejected, not silently repaired.
- **Identity:** canonical lowercase UUID v4 IDs are unique within the library.
  Text equality is not identity. Every book always has a status.
- **View state:** the status filter is not part of the saved library. There is no
  base search query or search control.
- **Failure:** validation does not mutate its input; invalid data is not migrated,
  sanitized into a replacement library, truncated, or overwritten automatically.

### Resolved Clarifications and Boundaries

The workshop chooses 200 books, two statuses, newest-first order, and duplicate
titles without warnings. Length means UTF-16 code units, not displayed glyphs:
60 `😀` characters fit a 120-unit title; 61 do not. Empty text is not absent data.
Unknown fields are rejected at both library and book levels, even if otherwise
harmless. Schema-error wording may vary: tests assert rejection and preservation,
**not exact error messages**.

The exercise assumes one active tab and a disposable browser profile. Concurrent
tab conflict resolution, backups, encryption, and protection from a compromised
browser/device are not provided. Normal use requires the local static server;
there is no offline installation/service-worker promise.

## Acceptance Evidence and Review

The [plan's test and evidence matrix](./plan.md#test-and-evidence-matrix) binds
every base FR to named tests/manual evidence and [concrete tasks](./tasks.md).
The following are completion criteria to verify, not pre-recorded successes:

- **SC-001:** US1 and US2 acceptance exercises pass with the fictional fixture,
  including refresh, duplicates, order, status, and filter reset.
- **SC-002:** All validation boundaries, corrupt storage, unavailable reads, and
  failed writes have observed tests; no destructive or misleading fallback occurs.
- **SC-003:** Inert text, keyboard/focus/error feedback, and restricted HTTP
  behavior have actual browser/server evidence, including denial paths.
- **SC-004:** Every FR has a reviewed test/evidence/task link; remaining limitations
  are recorded. No completion-time or certification guarantee is made.

- [ ] Reviewed the base requirements and scope; recorded self-review or peer review.
- [ ] Evidence for SC-001–SC-004 was recorded in the student's own artifacts.
- [ ] No unresolved blocking security, integrity, or accessibility finding is hidden.

## Later Change Only — CR-001 / US3 / FR-011

**Not base scope.** This is the proposed **60-minute second iteration** of the
[390-minute workshop](./README.md#workshop-budget), including artifact review,
test-first change, regression checks, and human acceptance. Amend this same
feature's spec, plan, and tasks; do not create a new feature directory.

### US3 — Find a book by title or author (Priority: P3)

A reader narrows the existing list with a case-insensitive substring query.

**FR-011:** Trim the query; match **title OR author**, then combine that result
with the status filter using **AND**. A blank query matches all books permitted
by the status filter. Preserve ordering, never persist the query, and show a
no-match message when appropriate. No fuzzy search, new storage fields, or new
application files are requested.

**Later acceptance:** With fictional `Orbit` by `Ada` marked `read` and `Harbor`
by `Bo` marked `unread`, ` ORB ` matches the first title; `ADA` matches its author.
Combining `ada` with `unread` gives no matches. A whitespace-only query with
`unread` shows `Harbor`; clearing both controls shows both books. An unmatched
query shows feedback; refresh clears query/filter but retains both books/statuses.
Keyboard operation and all base safety requirements still hold.

- [ ] CR-001 scope and updated artifacts were reviewed before changing behavior.
- [ ] FR-011 tests, browser evidence, and FR-001–FR-010 regressions were reviewed.
