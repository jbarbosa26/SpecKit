# Tasks: Library & Reading Status

**Feature**: `001-library-reading-status` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

**Legend**: `[P]` = parallelizable (touches different files, no ordering dependency). Tasks are grouped into phases organized **by user story**. Within each story, **tests come before implementation** (test-first per Constitution Principle II): write the failing test, then make it pass.

## Phase: Setup

- **T001** Initialize the monorepo layout `backend/` and `frontend/` with TypeScript 5.x and Node.js 20 toolchains. (`package.json`, `tsconfig.base.json`)
- **T002** [P] Configure the backend project: Express + better-sqlite3 deps and scripts. (`backend/package.json`, `backend/tsconfig.json`)
- **T003** [P] Configure the frontend project: Vite + TypeScript SPA scaffold. (`frontend/package.json`, `frontend/vite.config.ts`)
- **T004** [P] Set up Vitest + Supertest and a shared test script. (`backend/vitest.config.ts`, `frontend/vitest.config.ts`)
- **T005** [P] Add linting/formatting and a `quickstart.md` stub. (`.editorconfig`, `specs/001-library-reading-status/quickstart.md`)

## Phase: Foundational

- **T006** Create the SQLite database initializer and migration for `books`, `shelves`, and `book_shelves`. (`backend/src/models/db.ts`)
- **T007** Add the Express app shell with structured logging middleware for key actions. (`backend/src/api/app.ts`)
- **T008** [P] Add the typed API client and app shell in the SPA. (`frontend/src/services/apiClient.ts`, `frontend/src/main.ts`)
- **T009** [P] Establish a shared test harness (in-memory SQLite fixture + render helpers). (`backend/tests/helpers/db.ts`, `frontend/tests/helpers/render.ts`)

## Phase: User Story 1 - Track books and reading status (P1)

> Implements FR-001..FR-005 and FR-010. Entities: Book, ReadingStatus.

- **T010** [P] Contract test for `POST /books` (including the duplicate title+author warning) and `GET /books`. (`backend/tests/contract/books.contract.test.ts`)
- **T011** [P] Unit test for the Book model and status defaulting to `Want to Read`. (`backend/tests/unit/book.model.test.ts`)
- **T012** [P] Integration test: add a book, add a duplicate title+author and assert the warning (FR-010), change status, reload, assert persistence. (`backend/tests/integration/library.flow.test.ts`)
- **T013** Implement the Book model and `ReadingStatus` type. (`backend/src/models/book.ts`)
- **T014** Implement the library service (add — with a duplicate title+author warning per FR-010 — list, change status). (`backend/src/services/library.ts`)
- **T015** Implement the books API endpoints. (`backend/src/api/books.ts`)
- **T016** [P] Component test for the Library page list + status control. (`frontend/tests/library.page.test.ts`)
- **T017** Implement the Library page UI (add form, list, status selector). (`frontend/src/pages/Library.ts`)

> **Checkpoint**: US1 independently functional — a user can add books, set status, and see the persisted list.

## Phase: User Story 2 - Organize books into shelves (P2)

> Implements FR-006..FR-008. Entities: Shelf, Book↔Shelf assignment.

- **T018** [P] Contract test for `POST /shelves`, `GET /shelves/:id`, and assignment endpoints. (`backend/tests/contract/shelves.contract.test.ts`)
- **T019** [P] Unit test for the Shelf model and many-to-many assignment. (`backend/tests/unit/shelf.model.test.ts`)
- **T020** [P] Integration test: assign a book to two shelves and remove from one. (`backend/tests/integration/shelf.flow.test.ts`)
- **T021** Implement the Shelf model and `book_shelves` access. (`backend/src/models/shelf.ts`)
- **T022** Implement the shelf service (create, assign, unassign, view). (`backend/src/services/shelf.ts`)
- **T023** Implement the shelves API endpoints. (`backend/src/api/shelves.ts`)
- **T024** [P] Component test for the Shelf page. (`frontend/tests/shelf.page.test.ts`)
- **T025** Implement the Shelf page UI (create shelf, assign, view). (`frontend/src/pages/Shelf.ts`)

> **Checkpoint**: US2 independently functional — books can be grouped into shelves and viewed per shelf, on top of US1.

## Phase: User Story 3 - Search and filter the library (P3)

> Implements FR-009. Depends on Book (US1) and Shelf (US2).

- **T026** [P] Contract test for `GET /search?q=&status=&shelf=`. (`backend/tests/contract/search.contract.test.ts`)
- **T027** [P] Unit test for search/filter logic (title/author match, status, shelf). (`backend/tests/unit/search.service.test.ts`)
- **T028** [P] Integration test: combined term + shelf filter narrows results. (`backend/tests/integration/search.flow.test.ts`)
- **T029** Implement the search service (query, status filter, shelf filter). (`backend/src/services/search.ts`)
- **T030** Implement the search API endpoint. (`backend/src/api/search.ts`)
- **T031** [P] Component test for the Search page and filters. (`frontend/tests/search.page.test.ts`)
- **T032** Implement the Search page UI (search box, status + shelf filters). (`frontend/src/pages/Search.ts`)

> **Checkpoint**: US3 independently functional — users can search and filter across the full library.

## Phase: Polish

- **T033** [P] Accessibility pass: keyboard navigation + WCAG 2.1 AA audit across all pages. (`frontend/src/components/`)
- **T034** [P] Verify structured logging on add/status/shelf/search actions. (`backend/src/api/app.ts`)
- **T035** [P] Performance check against SC-002/SC-003 with a 1,000-book fixture. (`backend/tests/integration/performance.test.ts`)
- **T036** Finalize `quickstart.md` so a new contributor runs BookNook in under 10 minutes. (`specs/001-library-reading-status/quickstart.md`)

## Dependencies & parallel execution

- **Phase order is sequential**: Setup → Foundational → US1 → US2 → US3 → Polish. Each user-story checkpoint yields a working increment.
- **Within a phase**, tasks marked `[P]` touch different files and may run concurrently; the test tasks (`[P]`) for a story can all be written in parallel before implementation begins.
- **Implementation tasks are ordered**: model → service → API → UI, because each depends on the previous (e.g. T015 needs T014 needs T013).
- US2 assignment relies on the Book model (T013); US3 search relies on both Book (T013) and Shelf (T021).
