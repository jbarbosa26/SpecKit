# Adapting an Existing Project to Spec-Driven Development

Most teams don't get to start fresh. They have a codebase with years of history, hard-won conventions, a flaky-but-trusted test suite, a CI pipeline nobody wants to touch, and tribal knowledge that lives in people's heads. This guide is about retrofitting **Spec-Driven Development (SDD)** with [GitHub Spec Kit](https://github.com/github/spec-kit) onto exactly that kind of **brownfield** project. Spec Kit is agent-agnostic — this guide uses **GitHub Copilot** as the primary example, but every step works the same with any of the 30+ supported agents (Claude Code, Gemini CLI, Codex CLI, Cursor, and more); just swap the integration key.

The greenfield happy path — where `/speckit.specify` generates an app from scratch — is covered elsewhere (see [Further reading](#further-reading)). Brownfield is a different problem:

- You are **not** generating an application from nothing. You are introducing SDD as the workflow for **new changes**.
- The hard part is **encoding the system you already have** into the constitution and into each spec, so the agent respects existing modules, contracts, and constraints instead of reinventing them.
- Adoption is **incremental** — feature by feature. Do **not** attempt a "big-bang" rewrite or try to retro-spec your entire codebase. That path leads to a giant pile of speculative documents nobody trusts.

The goal: every *net-new* change flows through a spec, while the existing system's reality is captured once (in the constitution) and referenced continually (in each spec and plan).

---

## Before you start — assess readiness

SDD leans heavily on a few things already being in place. The agent's safety net during implementation is **your existing tests and CI**, and the quality of every spec depends on how well you can articulate current conventions.

Run through this checklist before initializing anything:

- [ ] Reasonably clean git history and a clean working tree (no giant uncommitted changes in flight).
- [ ] An existing test suite and CI you can lean on as a regression safety net.
- [ ] Conventions you can capture — documented (CONTRIBUTING, lint configs) or tribal (in someone's head).
- [ ] An agreed, thin **pilot feature** to be the first SDD slice.
- [ ] GitHub Copilot available to the team in VS Code.

### Signals you're ready vs. fix first

| Signal you're ready | Fix first |
| --- | --- |
| Working tree is clean; you can branch freely | Uncommitted experiments everywhere; unclear what's shippable |
| Tests run locally and in CI, mostly green | No tests, or CI is red and ignored |
| Lint/format configs exist and are enforced | Style is "whatever the last commit did" |
| A small, valuable pilot feature is identified | The only candidate is a 6-month epic |
| Team has agreed to try SDD on new work | Adoption is a surprise to the team |
| Copilot is set up in VS Code for contributors | Tooling access is unresolved |

You don't need a perfect score. But the more "fix first" rows you have, the more value you'll get from addressing them before — not during — your first spec.

---

## Step 1 — Initialize Spec Kit in place

Spec Kit installs as the `specify` CLI. Prerequisites: **Python 3.11+**, **uv** (or pipx), and a supported agent — for GitHub Copilot the agent key is `copilot`. **Git** is recommended (optional; required only for Spec Kit's git extension / feature branches).

Install the CLI (use a real release tag in place of `vX.Y.Z`):

> Shell commands below are identical on macOS/Linux (bash/zsh) and Windows PowerShell.

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```

Initialize **in place** inside your existing repository. The `--here` flag targets the current directory; `--force` allows merging the scaffold into a non-empty directory. Copilot is the example here — swap `copilot` for any agent key (e.g. `claude`, `gemini`, `codex`, `cursor-agent`), or run `specify integration list` to see them all:

```bash
specify init . --here --force --integration copilot
```

### What gets added

The Copilot integration is **additive** — it scaffolds new files alongside your code:

- `.specify/` — memory (`constitution.md`), scripts, templates, and integration config (`integration.json`, `integration-catalogs.yml`, `init-options.json`).
- `.github/agents/speckit.*.agent.md` — the primary command definition files, invoked as `/speckit.*` in VS Code Copilot Chat.
- `.github/prompts/speckit.*.prompt.md` — companion prompt files for the same commands.
- `.vscode/settings.json`.
- **(Optional, manual)** `.github/copilot-instructions.md` — Copilot's repo-wide custom-instructions file. Spec Kit does **not** generate this; you can create it yourself to give Copilot durable context (see [Step 2](#step-2--capture-the-system-you-already-have-in-a-constitution)). Other agents use an equivalent context file — `CLAUDE.md` (Claude), `GEMINI.md` (Gemini), or `AGENTS.md` (Codex).

A few brownfield-specific cautions:

- **Existing files are merged, not clobbered.** If you already have a `.vscode/settings.json` or a per-agent context file, modified files are preserved — review the diff to confirm.
- **Commit the scaffold on its own branch/PR.** Don't bury the Spec Kit scaffold inside a feature change. Land it separately so the team can review exactly what arrived and why.
- **`.gitignore` considerations.** Decide deliberately what to track. The `specs/` directory and constitution should be **versioned** (they're reviewed like code); transient agent output need not be.

---

## Step 2 — Capture the system you already have in a constitution

This is the most important brownfield step. The **constitution** (`.specify/memory/constitution.md`) is the set of non-negotiable principles every spec, plan, and task must honor. In a greenfield project it captures aspirations. In a brownfield project it must capture **reality** — the standards your code already follows — or the agent will happily contradict your own system.

Encode the *existing* standards, not the ones you wish you had:

- Language and runtime versions actually in use.
- Framework and library choices already committed to.
- Testing requirements (coverage gates, test-first expectations, required suites).
- Security and compliance rules (authn/authz patterns, data handling, regulatory constraints).
- Performance budgets and SLAs.
- Code-review gates and branch-protection rules.
- Deployment and release policy.

Use `/speckit.constitution` and have Copilot **read the repo first**, then draft principles that reflect current practice and flag gaps:

```text
/speckit.constitution Read this repository before drafting. Inspect the key
config files (package.json / pyproject.toml / go.mod, the CI workflows under
.github/workflows, CONTRIBUTING.md, and the lint/format configs such as
.eslintrc, .prettierrc, ruff.toml). Draft a constitution that documents the
standards we ALREADY follow — runtime versions, framework choices, our existing
test and coverage requirements, our auth and data-handling rules, our review
gates, and our deployment policy. Where current practice is inconsistent or
undocumented, do NOT invent a rule — instead list it under an "Open Questions /
Gaps" section so we can decide deliberately. Keep principles concrete and
testable, not aspirational.
```

Review the draft as a team and refine it. The constitution will be referenced by every later step, so the time spent here pays back repeatedly.

You can also (optionally) create `.github/copilot-instructions.md` by hand and seed it with durable repo facts (directory layout, "use the existing `Result<T>` error type", "all DB access goes through the repository layer") so Copilot has that context on every interaction, even outside the Spec Kit commands. Spec Kit doesn't generate this file — it's Copilot's own custom-instructions mechanism. If you use a different agent, put the same facts in its context file instead (`CLAUDE.md`, `GEMINI.md`, or `AGENTS.md`).

---

## Step 3 — Pick a thin, real pilot feature

Your first SDD slice should prove the workflow without betting the product on it. Choose something **small, valuable, low-blast-radius**, that still **touches representative parts of the stack** (an endpoint, a service, persistence, a test) so the team sees the full loop.

| Good pilot candidates | Bad pilot candidates |
| --- | --- |
| Add a single new endpoint to an existing service | Re-architect the auth system |
| A small, well-bounded enhancement to one module | A cross-cutting rewrite of the data layer |
| A feature with clear acceptance criteria | A vague "make it faster" epic |
| Something covered by — or easy to cover with — tests | An area with zero test coverage and high risk |
| A change one reviewer can fully understand in a PR | A multi-team, multi-month initiative |

The pilot's job is to build confidence and reveal friction, not to deliver the biggest possible win.

---

## Step 4 — Specify the change against existing reality

Now run `/speckit.specify`. Each invocation creates a **numbered feature directory** `specs/<###-name>/` containing `spec.md` (and a matching feature branch when Spec Kit's git integration is enabled and git is present). The brownfield twist: your prompt must **explicitly reference what already exists** so the spec integrates instead of reinventing.

```text
/speckit.specify Add the ability for a signed-in user to export their profile
as JSON. Integrate with the EXISTING UserService and the current authentication
middleware — do not introduce a new auth mechanism. Reuse the existing
serialization conventions in src/serializers. The export endpoint must live
alongside the current profile routes. Record the systems this feature depends on
(UserService, the auth middleware, the existing rate limiter) under Assumptions
and Key Entities so they are explicit.
```

Tips that matter for brownfield specs:

- Use the **Assumptions** section to record existing systems and behaviors the feature depends on, and any legacy quirks you're choosing to preserve.
- Use **Key Entities** to name the existing modules/contracts the change touches, so the plan stays anchored to them.
- Run **`/speckit.clarify`** before planning. Legacy behavior is full of ambiguity ("what does the current endpoint do when the user is unverified?"). Resolve those questions while they're cheap, before they're baked into a plan.

---

## Step 5 — Plan within existing architecture

`/speckit.plan` turns the spec into a technical plan. In brownfield, the plan must **reuse the current stack and patterns** — same frameworks, same layering, same conventions — unless there's a justified reason to deviate.

```text
/speckit.plan Implement this using our existing stack and patterns only. Honor
the constitution. Reuse UserService, the current auth middleware, and our
existing test framework. Do NOT introduce any new framework, library, or service
without recording a justification in the plan's Complexity Tracking section.
Add an "as-is vs to-be" note in research.md describing the current behavior of
the profile routes and exactly what changes.
```

- Point Copilot at the plan template's **Complexity Tracking** section. Any new dependency or architectural deviation should be justified there — this is your guardrail against scope creep and unwanted frameworks.
- Capture **as-is vs. to-be** notes in `research.md`. Documenting current behavior before describing the change is invaluable when a reviewer asks "what did this break?"
- The plan may also produce `data-model.md`, `quickstart.md`, and `contracts/` — make sure these describe integration with existing contracts, not parallel new ones.

---

## Step 6 — Tasks, analyze, implement incrementally

Generate the work breakdown, optionally check it for consistency, then implement:

```text
/speckit.tasks
/speckit.analyze
/speckit.implement
```

- `/speckit.tasks` writes `tasks.md`. Tasks marked **`[P]`** are parallel-safe (independent files/areas); the rest are ordered.
- `/speckit.analyze` (optional) checks the spec, plan, and tasks for consistency and coverage gaps before you write code — cheap insurance in a complex existing system.
- `/speckit.implement` executes the tasks.

Brownfield discipline during implementation:

- **Lean on the existing test suite and CI as your safety net.** Run them continuously; they are how you know the agent didn't regress legacy behavior.
- **Implement behind a branch and PR.** Create a feature branch for the change so it maps naturally to a reviewable pull request.
- **Keep changes reviewable.** Small, coherent diffs beat one enormous commit — especially while the team is still learning to trust the workflow.
- Optionally run **`/speckit.taskstoissues`** to turn the task list into GitHub issues so work is tracked in your normal system.

This whole loop is the **Iterative Enhancement (Brownfield)** phase: add features iteratively, modernize legacy areas opportunistically, and adapt your processes as you go — rather than rewriting wholesale.

---

## Encoding team standards with presets & extensions

Spec Kit can be tailored so generated artifacts match your house style automatically.

- **Presets** customize how the spec/plan/tasks **templates behave**. Use them to bake in organizational or regulatory standards: a mandatory security-review gate, test-first task ordering, required sections (e.g., a rollback plan), or compliance checklists. Once a preset encodes your conventions, every spec the team produces follows them by default.
- **Extensions** add **new commands or capabilities** beyond the built-in set — for example, Jira integration, a post-implementation code-review command, or traceability reporting that links tasks back to requirements. Extensions live under `.specify/extensions/templates/` and are managed with `specify extension add` (there is no `extensions.yml`).
- **Project-local template overrides** live in `.specify/templates/overrides/`. Use these for one-off tweaks specific to this repository when a full preset is overkill.

For brownfield teams, a preset that enforces "respect the constitution, justify new dependencies, and include an as-is/to-be section" is a high-leverage early investment.

---

## An incremental adoption roadmap

Adopt SDD in phases, each with a clear exit criterion. Don't move on until the current phase is genuinely working.

| Phase | Focus | Exit criteria |
| --- | --- | --- |
| **Phase 0 — Pilot** | Run one thin feature end-to-end through the full `/speckit.*` loop | Pilot shipped via spec → plan → tasks → implement; team agrees the loop is worth repeating |
| **Phase 1 — Codify** | Refine the constitution to match reality; add a preset for house style | Constitution reviewed and merged; preset enforces required sections and dependency gates |
| **Phase 2 — Roll out** | Expand to a squad/team; specs reviewed in PRs | Multiple features delivered via SDD; specs are reviewed like code; reviewers comfortable with the artifacts |
| **Phase 3 — Default** | SDD is the standard for all net-new features; modernize legacy opportunistically | New work defaults to a spec; legacy areas refactored under specs as they're touched |

---

## Working as a team

SDD works best when spec artifacts are treated as first-class, reviewed code:

- **One branch + PR per feature.** Create a branch and PR per feature, and review the `spec.md`, `plan.md`, and `tasks.md` alongside the implementation.
- **Constitution changes go through review.** A change to your principles affects every future feature; it deserves the same scrutiny as a schema migration.
- **Keep `specs/` in the repo.** Versioned specs give you history, blame, and traceability — don't relegate them to a wiki.
- **Align task breakdown with your issue tracker.** Use `/speckit.taskstoissues` (or your own mapping) so Spec Kit's tasks show up where the team already plans work.

---

## Common pitfalls & how to avoid them

- **Trying to retro-spec the entire existing codebase.** Don't. SDD is for *new changes*. Capture the existing system once in the constitution; spec only what you're about to change.
- **Writing an aspirational constitution.** A constitution that describes the system you wish you had will constantly conflict with the system you have. Encode current reality; track gaps separately.
- **Letting the agent introduce unwanted new dependencies.** Use the plan's **Complexity Tracking** section and constitution gates to force justification for any new framework or service.
- **Skipping `/speckit.clarify` on legacy ambiguity.** Undocumented legacy behavior is the #1 source of bad specs. Clarify before you plan.
- **Not committing the scaffold separately.** Land `specify init` on its own PR so the team can review what changed without it being tangled in a feature.
- **Ignoring existing tests and CI.** They are your regression safety net. If you bypass them, you lose the main thing that makes brownfield SDD safe.

---

## Brownfield adoption checklist

Copy this into an issue and work through it:

- [ ] Repo readiness assessed (clean tree, tests/CI, conventions identified, pilot chosen, Copilot available).
- [ ] Spec Kit initialized in place: `specify init . --here --force --integration copilot`.
- [ ] Scaffold committed on its own branch/PR and reviewed.
- [ ] `.gitignore` reviewed; `specs/` and constitution are versioned.
- [ ] Constitution drafted via `/speckit.constitution` to reflect **existing** standards, with gaps flagged.
- [ ] (Optional) `.github/copilot-instructions.md` (or your agent's context file: `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`) manually seeded with durable repo facts.
- [ ] Thin pilot feature selected (small, valuable, representative).
- [ ] `/speckit.specify` run, referencing existing modules/contracts; Assumptions & Key Entities filled in.
- [ ] `/speckit.clarify` run to resolve legacy ambiguity.
- [ ] `/speckit.plan` run; reuses existing stack; new deps justified in Complexity Tracking; as-is/to-be noted in `research.md`.
- [ ] `/speckit.tasks` (and optional `/speckit.analyze`) run; `[P]` tasks identified.
- [ ] `/speckit.implement` run behind a branch/PR; existing tests + CI green.
- [ ] (Optional) `/speckit.taskstoissues` run to track work in GitHub.
- [ ] Preset/extension/overrides considered for house style and brownfield workflow.
- [ ] Adoption roadmap phase and exit criteria agreed with the team.

---

## Further reading

- [01 — What is Spec-Driven Development](01-what-is-spec-driven-development.md)
- [02 — Spec Kit breakdown](02-spec-kit-breakdown.md)
- [03 — Walkthrough and lab](03-walkthrough-and-lab.md)
- [Project overview](../README.md)
- Official Spec Kit repository: <https://github.com/github/spec-kit>
- Official Spec Kit documentation: <https://github.github.io/spec-kit/>
