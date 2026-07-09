# BookNook Constitution

BookNook is a personal reading-list / home library web application. This constitution defines the non-negotiable principles that govern every specification, plan, task, and change. All later phases (`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) must comply.

## Core Principles

### I. Spec-First & Traceable

Every change starts from a specification. No implementation work begins without an approved spec, and each unit of work MUST trace back to a specific functional requirement or user story. Pull requests reference the requirement IDs (e.g. `FR-003`, `US1`) they satisfy. Untraceable work is rejected.

### II. Test-First (NON-NEGOTIABLE)

Tests are written and approved **before** implementation. The workflow is strict red-green-refactor: a failing test exists first, the minimum code makes it pass, then the design is refactored. No production code is merged without a test that would have failed before it.

### III. Simplicity & YAGNI

Choose the simplest design that satisfies the spec. No speculative features, abstractions, or configuration "for later." Every new dependency MUST be justified in the plan against a concrete requirement; if a requirement can be met without it, it is not added.

### IV. Accessible & Consistent UX

The interface MUST be keyboard-navigable, responsive, and meet **WCAG 2.1 AA**. UI is built from a consistent, reusable component set so interactions, labels, and focus behavior are predictable across screens. Accessibility is part of the definition of done, not a follow-up.

### V. Observable & Documented

Key user actions (add book, change status, assign shelf, search) emit **structured logs** with enough context to diagnose issues. Every feature ships with a quickstart that a new contributor can run end-to-end in **under 10 minutes**.

## Additional Constraints

- BookNook is a **web application** with **data persisted locally** to the user's machine.
- It is **single-user** and **offline-capable**; no external network services are required to use it.
- These constraints are intentionally tech-agnostic — specific frameworks, languages, and storage engines are chosen in the implementation plan, not here.

## Development Workflow

- All changes go through **pull request review**; at least one reviewer approves.
- **All tests MUST be green** before merge (Principle II).
- Each PR is checked for **constitution compliance** — spec traceability, test-first evidence, simplicity, accessibility, and observability.
- Specs are the source of truth: when behavior changes, update the spec first and regenerate plan and tasks.

## Governance

This constitution supersedes other practices. Amendments require a documented rationale, review approval, and a version bump per semantic versioning (MAJOR for principle removals/redefinitions, MINOR for new principles or sections, PATCH for clarifications). Compliance is verified at PR review and during `/speckit.analyze`.

**Version**: 1.0.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
