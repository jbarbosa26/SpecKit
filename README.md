# Spec-Driven Development with GitHub Spec Kit

A self-contained learning sample that explains **Spec-Driven Development (SDD)** and
**[GitHub Spec Kit](https://github.com/github/spec-kit)**, then walks you through it
hands-on. The workflow is **agent-agnostic**: the lab covers **two scenarios** — **with
GitHub Copilot** (VS Code) and **without Copilot** (any other supported agent, e.g.
Claude Code or Gemini CLI). Use it to understand the methodology, run a guided lab end
to end, and adopt SDD on a project you already have.

Spec-Driven Development flips the traditional model: instead of treating specifications
as disposable scaffolding, the **specification becomes the primary, executable artifact**
and code becomes its generated expression. Spec Kit is the open-source toolkit (the
`specify` CLI plus a set of `/speckit.*` commands) that operationalizes SDD inside your
repository and your AI coding agent.

> This is a **documentation/teaching** sample. There is nothing to build or run here —
> the deliverables are the guides below plus a set of illustrative example artifacts.
> You install Spec Kit and do the hands-on work in your own scratch project.

## Who this is for

- Engineers and teams evaluating or adopting SDD — with GitHub Copilot or another supported AI agent.
- Anyone who wants a concrete, command-by-command walkthrough of Spec Kit.
- Teams with an **existing** codebase who want to retrofit SDD incrementally.

## What's inside

| Doc | What it covers |
| --- | --- |
| [docs/01 — What Is Spec-Driven Development?](./docs/01-what-is-spec-driven-development.md) | The methodology: the "power inversion," core principles, development phases, and when to use SDD. Start here for the *why*. |
| [docs/02 — Spec Kit Toolkit Breakdown](./docs/02-spec-kit-breakdown.md) | The toolkit: installing the `specify` CLI, the `/speckit.*` commands, the artifacts it produces, on-disk layout, and the **GitHub Copilot integration**. Start here for the *what*. |
| [docs/03 — Walkthrough & Hands-On Lab](./docs/03-walkthrough-and-lab.md) | A guided, ~45–60 min lab that takes the example app ("BookNook") from constitution → spec → plan → tasks → implement, covering **two scenarios** (with GitHub Copilot and without Copilot, e.g. Claude Code / Gemini CLI). Start here for the *how*. |
| [docs/04 — Adapting an Existing Project](./docs/04-adapting-existing-projects.md) | A practical brownfield guide: initialize Spec Kit in place, encode existing conventions in a constitution, and roll SDD out feature by feature. |
| [examples/](./examples/) | Illustrative SDD artifacts for the lab's BookNook example — a sample [constitution](./examples/constitution.md), [spec](./examples/spec.md), [plan](./examples/plan.md), and [tasks](./examples/tasks.md). |

Suggested reading order: **01 → 02 → 03 → 04**. If you just want to get your hands
dirty, jump to the [hands-on lab](./docs/03-walkthrough-and-lab.md) and refer back to
01/02 as needed.

## Prerequisites

To do the hands-on lab you'll need:

- **[Python 3.11+](https://www.python.org/downloads/)** (Git recommended but optional — used only when Spec Kit's git integration is enabled)
- **[uv](https://docs.astral.sh/uv/)** (recommended) or **[pipx](https://pipx.pypa.io/)** to install the Specify CLI
- **A supported AI coding agent** — **[GitHub Copilot](https://github.com/features/copilot)** in **VS Code** (Scenario A), or another supported agent such as **Claude Code** or **Gemini CLI** (Scenario B)
- **[Node.js 20 LTS](https://nodejs.org/)** — only needed for the `/speckit.implement` step of the lab

Reading the conceptual docs (01, 02, 04) requires none of the above.

## Quick start

```bash
# 1. Install the Specify CLI (replace vX.Y.Z with the latest release tag:
#    https://github.com/github/spec-kit/releases)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z

# 2. Scaffold a new project, wired up for your agent via --integration:
#    Scenario A — with GitHub Copilot:
specify init booknook --integration copilot
#    Scenario B — without Copilot (e.g. Claude Code, or gemini):
#    specify init booknook --integration claude
cd booknook

# 3. Drive the workflow with the SAME slash commands, in your agent:
#    Scenario A: VS Code GitHub Copilot Chat (agent mode)
#    Scenario B: the `claude` (or `gemini`) CLI launched inside the project
#    /speckit.constitution  ->  /speckit.specify  ->  /speckit.plan
#    ->  /speckit.tasks      ->  /speckit.implement
```

> On Windows PowerShell the commands are identical — for the final step use `Set-Location booknook` (or `cd booknook`, which also works).

> The workflow is identical across agents — only the `--integration <key>`, which tool
> you launch, and the per-agent command syntax differ. Run `specify integration list` to
> see every supported agent. See the lab's
> [Choose your agent](./docs/03-walkthrough-and-lab.md#part-1--initialize-the-project)
> step for a full comparison table.

The full, explained version of these steps lives in the
[Walkthrough & Hands-On Lab](./docs/03-walkthrough-and-lab.md).

## The Spec Kit command flow

| Step | Command | Produces |
| --- | --- | --- |
| 1. Principles | `/speckit.constitution` | `.specify/memory/constitution.md` |
| 2. Specify (what/why) | `/speckit.specify` | `specs/<###-feature>/spec.md` in a new numbered feature directory (matching git branch optional) |
| 3. Clarify *(optional)* | `/speckit.clarify` | resolved ambiguities recorded in the spec |
| 4. Plan (how) | `/speckit.plan` | `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` |
| 5. Tasks | `/speckit.tasks` | `tasks.md` (dependency-ordered, `[P]` = parallel-safe) |
| 6. Analyze *(optional)* | `/speckit.analyze` | cross-artifact consistency & coverage report |
| 7. Implement | `/speckit.implement` | working code that satisfies the tasks |
| 8. Converge *(optional)* | `/speckit.converge` | assesses the codebase against spec/plan/tasks and appends remaining work as new tasks |

Optional extras: `/speckit.checklist` (quality checklists — "unit tests for English")
and `/speckit.taskstoissues` (push tasks to GitHub Issues). See
[docs/02](./docs/02-spec-kit-breakdown.md) for details.

## References

- [GitHub Spec Kit repository](https://github.com/github/spec-kit)
- [Spec Kit documentation](https://github.github.io/spec-kit/)
- [Spec-Driven Development methodology deep-dive](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [Supported AI coding agent integrations](https://github.github.io/spec-kit/reference/integrations.html)
- [GitHub Copilot documentation](https://docs.github.com/en/copilot)

## License

Released under the [MIT License](./LICENSE).
