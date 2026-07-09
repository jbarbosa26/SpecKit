# Feature Specification: Library & Reading Status

**Feature Branch**: `001-library-reading-status`
**Created**: 2026-06-16
**Status**: Draft
**Input**: Build the core of BookNook — let a single user track books and their reading status, organize books into shelves, and search and filter the library. Tech-agnostic.

## User Scenarios & Testing

### User Story 1 - Track books and reading status (Priority: P1)

A reader adds books to their library and tracks where each one stands: not started, in progress, or done. They can see their whole library at a glance.

**Why this priority**: This is the heart of BookNook. Without the ability to record a book and its status, no other feature has anything to act on. It delivers standalone value on its own.

**Independent Test**: With an empty library, add two books, set one to `Reading` and one to `Finished`, and confirm both appear in the list with the correct status — no shelves or search required.

**Acceptance Scenarios**:

1. **Given** an empty library, **When** the user adds a book with a title and author, **Then** the book appears in the library list with a default status of `Want to Read`.
2. **Given** a book in the library, **When** the user changes its status to `Reading`, **Then** the new status is shown and persists after a page reload.
3. **Given** several books with different statuses, **When** the user views the library, **Then** each book is listed with its current status.

### User Story 2 - Organize books into shelves (Priority: P2)

A reader groups books into named shelves (e.g. "Sci-Fi", "Borrowed", "2026 Goals") and can view the books on any one shelf.

**Why this priority**: Organization adds meaningful value but only once books exist (US1). It is independently shippable on top of the library.

**Independent Test**: With at least one book present, create a shelf named "Favorites", assign the book to it, open the shelf, and confirm the book appears there.

**Acceptance Scenarios**:

1. **Given** an existing book, **When** the user creates a shelf and assigns the book to it, **Then** the book appears when viewing that shelf.
2. **Given** a book assigned to two shelves, **When** the user views either shelf, **Then** the book appears on both.
3. **Given** a shelf with books, **When** the user removes a book from the shelf, **Then** the book remains in the library but no longer appears on that shelf.

### User Story 3 - Search and filter the library (Priority: P3)

A reader with a large library quickly finds books by searching title or author and narrowing by status or shelf.

**Why this priority**: Search and filter improve usability at scale but depend on books (US1) and benefit from shelves (US2). It is the last increment and independently testable.

**Independent Test**: With several books across statuses and shelves, search for an author's name and confirm only matching books show; then filter by status `Finished` and confirm the result set narrows correctly.

**Acceptance Scenarios**:

1. **Given** a library with many books, **When** the user searches for part of a title or author, **Then** only matching books are shown.
2. **Given** books of mixed status, **When** the user filters by `Reading`, **Then** only books with that status are shown.
3. **Given** a search term combined with a shelf filter, **When** both are applied, **Then** results match the term **and** belong to the selected shelf.

### Edge Cases

- **Duplicate title + author**: adding a book that matches an existing title and author is allowed but the user is warned first.
- **Empty library**: the library view shows a friendly empty state, not an error.
- **Very long titles**: long titles are stored in full and truncated gracefully in the list view.
- **Book on no shelf**: a book that belongs to no shelf still appears in the main library and in status filters.
- **Empty search**: clearing the search term restores the full (filter-respecting) list.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST let the user add a book with a title and an author.
- **FR-002**: The system MUST assign every new book a reading status, defaulting to `Want to Read`.
- **FR-003**: The system MUST let the user change a book's status among `Want to Read`, `Reading`, and `Finished`.
- **FR-004**: The system MUST display the library as a list showing each book's title, author, and current status.
- **FR-005**: The system MUST persist books and their status locally so they survive a reload.
- **FR-006**: The system MUST let the user create a named shelf.
- **FR-007**: The system MUST let the user assign a book to one or more shelves and remove it from a shelf.
- **FR-008**: The system MUST let the user view the books on a selected shelf.
- **FR-009**: The system MUST let the user search books by title or author and filter by status and/or shelf.
- **FR-010**: The system MUST warn the user when adding a book whose title and author match an existing book. [NEEDS CLARIFICATION: is there a maximum library size BookNook must support, and may a book ever exist with no status?]

### Key Entities

- **Book**: a record the user wants to track — has a title, an author, and one reading status; may belong to zero or more shelves.
- **Shelf**: a user-named grouping of books; a shelf contains zero or more books, and a book may appear on several shelves.
- **ReadingStatus**: the state of a book in the reader's journey — one of `Want to Read`, `Reading`, or `Finished`.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A user can add a book and see it in the library in **under 5 seconds** of interaction.
- **SC-002**: The library list renders in **under 100 ms** for a library of **1,000 books**.
- **SC-003**: A search returns matching results in **under 200 ms** for a library of **1,000 books**.
- **SC-004**: A new user can add a book, set its status, create a shelf, assign the book, and find it via search **without external documentation**.

## Assumptions

- BookNook is **single-user**; there is no authentication or sharing in this feature.
- Data is **persisted locally** and the app is usable **offline**.
- Title and author are free text; no external catalog lookup is assumed.
- "Library" means the full set of the user's books regardless of shelf membership.
