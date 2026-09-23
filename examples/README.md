# BookNook — Illustrative SDD Artifacts

These documents describe the workshop's **reviewed illustrative design** for BookNook, a single-user local browser reading-list demo. They support the [hands-on walkthrough](../docs/03-walkthrough-and-lab.md) using **Spec Kit v1.0.1**. They are not known-good generated outputs, guaranteed agent results, or an executable application. Design review does not establish implementation correctness or record student approval.

The toolkit baseline is the [v1.0.1 release](https://github.com/github/spec-kit/releases/tag/v1.0.1); consult its [immutable README source](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/README.md). The constitution's **document version 2.0.0** is independent of the toolkit version and remains **illustrative and unratified**.

## Read in workflow order

The commands below are **Copilot agent-session skills**, not terminal commands. The original track uses `.github\skills\speckit-<name>\SKILL.md`. In the **[noGHCP CLI-and-manual track](../docs/noGHCP/README.md)**, the official pinned Specify CLI and helpers seed generic scaffolding; students write and review the content and implement extensions themselves. Its `.manual\commands\speckit.<phase>.md` files are agent Markdown guidance, not executable slash commands. Use the [manual phase equivalents](../docs/noGHCP/README.md#slash-command-phases-and-their-no-ai-equivalents), without an AI tool or custom runner. The application contracts are shared, but the supplied US1 starter and manual exercises have their own instructions.

| Artifact | Purpose | Copilot-track skill (not used in noGHCP) |
| --- | --- | --- |
| [`constitution.md`](./constitution.md) | Principles, early security/accessibility constraints, and teaching governance | `/speckit-constitution` |
| [`spec.md`](./spec.md) | User needs, scope, requirements, and acceptance criteria: WHAT/WHY | `/speckit-specify` |
| [`plan.md`](./plan.md) | Architecture, fixed module contracts, risks, and verification approach: HOW | `/speckit-plan` |
| [`tasks.md`](./tasks.md) | Reviewable, test-first implementation work grouped by user story | `/speckit-tasks` |

**In the Copilot track's agent chat**, use `/speckit-clarify` to resolve specification ambiguity before planning. After tasks, use `/speckit-analyze` and human review before `/speckit-implement`. Analysis is read-only artifact analysis, **not an operating-system sandbox or proof of safety**. `/speckit-converge` appends remediation tasks rather than changing the application; review those tasks before another implementation slice. In noGHCP, humans perform these reviews and edits; structural helper checks do not assess requirement quality or replace test evidence.

The student owns the decisions; a peer or facilitator reviews the scope, risks, contracts, and evidence. A `[P]` task marker is only a candidate for parallel work: inspect shared files and dependencies first. No command result replaces human review.

## Base scope and later change

The base feature is **Library & Reading Status**:

| Iteration | Story | Scope |
| --- | --- | --- |
| Base | **US1 — P1** | Validate, add, list, and persist fictional books across refresh |
| Base | **US2 — P2** | Toggle read/unread and filter all/unread/read; default all; filter not persisted |
| Second iteration only | **CR-001 / US3 / FR-011** | Add title OR author case-insensitive substring search in the separate 60-minute change module |

**Search is absent from the base implementation and base acceptance criteria.** For the later change, trim the query, combine search with status filtering using AND, let a blank query match all, do not persist the query, and show a no-match message. Amend the existing feature's spec, plan, and tasks before implementation; do not create a new feature directory for this change.

The base requirement set is **FR-001–FR-010**: validated add/list, versioned persistence, status changes, status filtering, the 200-book limit, safe storage failures, inert text rendering, accessible keyboard interaction, the restricted local server, and empty/no-match feedback. There are no shelves or additional application features.

## Design baseline

- Use the **latest patched Node.js 24 LTS**, plain HTML/CSS/browser JavaScript ES modules, and **zero third-party JavaScript dependencies**. Tests use built-in `node:test` and `node:assert/strict`; persistence uses browser `localStorage`.
- The planned student's application uses `npm start`, `npm test`, and `npm run check` for the Node server, tests, and syntax checks respectively. No `npm install`, bundler, build, or lint command is required. These examples do not contain that application or those scripts.
- The static server binds exactly **`127.0.0.1:4173`**. Browse to **`http://127.0.0.1:4173`**, not `localhost`. Allow only GET/HEAD and the six planned static routes; enforce the exact Host, restrictive CSP, `nosniff`, and `no-referrer`. Never derive filesystem paths from request paths.
- Store only `{version:1,books:[]}` under **`booknook:v1`**. Each book has only `id`, `title`, `author`, and `status`; the constitution defines validation and preservation rules. Storage is origin-specific, unencrypted, and not a backup.
- Treat saved data as untrusted. Preserve invalid storage, block writes, and show an accessible error; never silently reset or pretend an in-memory update was saved. A failed write must not change displayed book state. Render book values with `textContent`, not HTML.
- Include labeled controls, visible focus, keyboard operation, and accessible feedback from the first slice, alongside security and data-preservation tests—not as final polish.
- Use **fictional data only**. No authentication, cloud deployment, MCP, APIs, database, telemetry, external assets, delete operation, import, or export. Do not put secrets or real reading histories into agent prompts or logs. No production-readiness, compliance, or WCAG-certification claim is made.

## Workshop budget

The nine modules total **390 minutes (6.5 hours)**: **20 + 35 + 45 + 45 + 35 + 80 + 50 + 60 + 20**. Prework and breaks are excluded. These are facilitator budgets, **not measured completion times or timing guarantees**; agent output and repair time vary.

| Module | Minutes |
| --- | ---: |
| Workspace | 20 |
| Constitution and threats | 35 |
| Specify and clarify | 45 |
| Plan and contracts | 45 |
| Tasks and analyze | 35 |
| Gated implementation | 80 |
| Security and acceptance | 50 |
| Controlled search change — second iteration | 60 |
| Handoff | 20 |
| **Total** | **390** |

The second iteration includes review and tests, not just code generation. If a slice fails, retain non-sensitive diagnostics and repair that slice; do not skip safety gates to meet the clock. Facilitators must rehearse the current agent UI and record model/runtime versions before teaching; this reference is not evidence of a validated full-class run.

## Actual artifact locations

The reference filenames here are not an output manifest. In the student's project, the constitution belongs at `.specify\memory\constitution.md`. A feature path such as `specs\001-library-reading-status\` is **illustrative**: inspect **`.specify\feature.json`** and the actual created directory before opening or editing its `spec.md`, `plan.md`, and `tasks.md`.

Do not assume a particular number or slug, or that `research.md`, `data-model.md`, `contracts\`, and `quickstart.md` are all created. Review whichever artifacts the workflow actually produces and ensure the agreed contracts are documented.

The fresh noGHCP lab explicitly selects `specs\001-booknook`; confirm that `.specify\feature.json` still identifies that directory before using its literal paths. That track authors six documents: the constitution, `spec.md`, `plan.md`, `tasks.md`, `quickstart.md`, and `checklists\requirements.md`. They are additional to reviewed generic `.manual` guidance and managed `.specify` templates, scripts, workflow definitions, and metadata. Keep the shared scaffolding trackable, preserve `.specify\.gitignore`, and leave the local feature pointer ignored. Generated guidance/workflow files are not executed.

**Spec Kit v1.0.1 core does not initialize Git or create feature branches.** Feature selection uses `.specify\feature.json`, not the current branch. Git initialization in a student's scratch project is a separate manual step. Do not add extensions, MCP, publishing tasks as issues, automatic commits, or pushes to this baseline; any optional local checkpoint commit needs explicit student approval.

## Human review checkpoints

These checkboxes are intentionally unchecked; only a reviewer with actual evidence should mark their own copy.

- [ ] Student owner and peer/facilitator reviewed the base scope, threats, accessibility, and spec → plan → tasks consistency before implementation.
- [ ] Fixed export scaffolds and behavior tests demonstrate genuine red → green evidence; import errors were not treated as legitimate red.
- [ ] Storage preservation, failed-write behavior, inert rendering, restricted serving, refresh persistence, and keyboard/error feedback were exercised.
- [ ] CR-001 was reviewed separately, its artifacts and tests were updated, and remaining limitations were recorded without certification or completion claims.

## See also

- [Walkthrough & Hands-On Lab](../docs/03-walkthrough-and-lab.md) — guided prompts, terminal commands, checks, and recovery.
- [Project overview](../README.md) — context for this Spec-Driven Development repository.
