# Implementation Plan: Library & Reading Status

**Branch**: `001-library-reading-status` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

## Summary

Deliver the BookNook core — tracking books and reading status (US1), organizing books into shelves (US2), and searching/filtering the library (US3) — as a single-user, offline-capable web application. A TypeScript Express API exposes book and shelf operations backed by a local SQLite file; a Vite + TypeScript single-page app provides the UI. Work proceeds test-first, story by story, so each user story is independently shippable.

## Technical Context

| Field | Value |
| --- | --- |
| **Language/Version** | TypeScript 5.x on Node.js 20 LTS |
| **Primary Dependencies** | Vite (frontend build/dev), Express (API), better-sqlite3 (storage driver) |
| **Storage** | SQLite (single local file) |
| **Testing** | Vitest (unit/component) + Supertest (API contract/integration) |
| **Target Platform** | Modern browsers + a local Node.js 20 server |
| **Project Type** | Web application (separate `frontend/` + `backend/`) |
| **Performance Goals** | Library list renders < 100 ms for 1,000 books; search returns < 200 ms for 1,000 books |
| **Constraints** | Offline-capable; local-only data; no external network services |
| **Scale/Scope** | Single user; up to ~10,000 books; ~6 screens |

## Constitution Check

| Principle | How the plan complies | Gate |
| --- | --- | --- |
| I. Spec-First & Traceable | Every task in `tasks.md` references an FR or user story; API contracts derive from the spec. | PASS |
| II. Test-First (NON-NEGOTIABLE) | Vitest + Supertest tests are authored before implementation in each phase. | PASS |
| III. Simplicity & YAGNI | Three small dependencies (Vite, Express, better-sqlite3), each tied to a requirement; no ORM, no auth. | PASS |
| IV. Accessible & Consistent UX | Shared component set; keyboard nav and WCAG 2.1 AA validated in the Polish phase. | PASS |
| V. Observable & Documented | Structured logging on key actions; a `quickstart.md` runnable in < 10 minutes. | PASS |

## Project Structure

```text
backend/
├── src/
│   ├── models/          # Book, Shelf, ReadingStatus (data access)
│   ├── services/        # library, shelf, search business logic
│   └── api/             # Express routes for books, shelves, search
└── tests/
    ├── contract/        # Supertest API contract tests
    ├── integration/     # cross-service flows
    └── unit/            # model/service unit tests

frontend/
├── src/
│   ├── components/      # reusable, accessible UI components
│   ├── pages/           # Library, Shelf, Search screens
│   └── services/        # typed API client
└── tests/               # Vitest component/unit tests

specs/001-library-reading-status/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/          # books.openapi, shelves.openapi, search.openapi
└── tasks.md
```

## Complexity Tracking

No violations; all gates pass. The design uses the minimum set of dependencies needed to satisfy the spec, a single SQLite file for storage, and a conventional web-app split. There is no speculative abstraction to track.
