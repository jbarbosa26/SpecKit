# Spec-Driven Development with GitHub Spec Kit

An independent, security-focused workshop for learning **spec-driven development
(SDD)** with **GitHub Spec Kit 1.0.1**. Work from intent to reviewed requirements,
architecture, tasks, implementation, and evidence, then repeat the loop for a
controlled change. AI-generated artifacts are proposals to evaluate, not proof
that a system is correct, secure, or ready for production.

**Workshop baseline reviewed: September 22, 2026.** Spec Kit is pinned to the
[v1.0.1 release](https://github.com/github/spec-kit/releases/tag/v1.0.1), source
commit `9118ed15a0ba65053469a94c560ea5d233f75884`. This is the workshop's chosen
version, **not a claim that 1.0.1 is the latest release**. Current product
documentation can describe newer behavior.

## Start here

| Document | Use it for |
| --- | --- |
| [Student prerequisites and quick reference](./docs/02-spec-kit-breakdown.md) | Complete before attending: tools, agent access, safe permissions, pinned installation, and a readiness check. |
| [What is spec-driven development?](./docs/01-what-is-spec-driven-development.md) | Understand the method, its limits, and the architect's review responsibilities. |
| [Hands-on lab](./docs/03-walkthrough-and-lab.md) | Follow **390 minutes (6.5 hours)** of guided hands-on exercises, excluding prework and breaks. |
| [Adapting an existing project](./docs/04-adapting-existing-projects.md) | Apply SDD incrementally, upgrade safely, and assess the gap to production/cloud use. |
| [Reference artifacts](./examples/README.md) | Compare your constitution, specification, plan, and tasks with aligned examples; do not substitute them for your own decisions. |

Before the workshop, complete the prerequisite brief. During the workshop, keep
the lab open alongside your editor. Read the brownfield guide after completing
the lab or when applying the method to an existing codebase.

## What you will build and learn

**BookNook** is a small, single-user reading-list application. Add fictional books,
persist them in browser storage, change reading status, and filter the list.
Then use an explicit change request to add search without breaking the approved
baseline.

The required path uses **GitHub Copilot in VS Code**, Spec Kit's default
**skills** integration, **Node.js 24 LTS** on its latest security patch, plain
HTML/CSS/JavaScript, and Node's built-in test runner. No third-party JavaScript
packages, native database toolchains, Azure subscription, deployment, or API
keys are needed for the application. Your approved coding agent still requires
network access and an appropriate account/request allowance; usage may cost
money. The app itself runs at `http://127.0.0.1:4173` with fictional local data.

You will practice requirements clarification, threat modeling, architecture
tradeoffs, test-first implementation, negative/security testing, accessibility
checks, requirements-to-evidence traceability, and change control. The time
allocations are **facilitator budgets**, not a guarantee of agent response speed
or a production-readiness certification.

This repository contains teaching documents, not a completed application.
Create BookNook in a **separate scratch directory** as instructed in the lab.
There is no application build or test suite to run in this repository.

## Version-correct command flow

Install the verified 1.0.1 source using `uv`, after completing the prerequisites.
This source-commit pin avoids relying on a release tag remaining unchanged:

```text
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884
specify version
```

Initialize a **new** scratch project using the shell-specific instructions in
the lab. Spec Kit 1.0.1 bundles its core templates with the installed CLI. Its
core does **not** initialize Git or automatically create feature branches; the
lab handles Git explicitly without installing extensions.

The following are **agent-chat commands, not terminal commands**:

| Step | Default Copilot skill | Result to review |
| --- | --- | --- |
| Govern | `/speckit-constitution` | `.specify/memory/constitution.md` |
| Specify | `/speckit-specify` | `specs/<number>-<feature>/spec.md` |
| Clarify | `/speckit-clarify` | Decisions recorded in the active specification |
| Plan | `/speckit-plan` | Plan and relevant research, model, contract, and quickstart artifacts |
| Review requirements | `/speckit-checklist` | Requirements-quality questions, not application tests |
| Decompose | `/speckit-tasks` | Dependency-ordered tasks |
| Analyze | `/speckit-analyze` | Cross-artifact findings; humans resolve blocking findings |
| Implement | `/speckit-implement` | Reviewed, incremental code and test changes |
| Assess remaining work | `/speckit-converge` | Additional remediation tasks if gaps remain, not automatic code repairs |

Clarify, checklist, and analyze are optional toolkit capabilities but **required
review gates in this workshop**. Converge is a supplemental assessment, not a
replacement for running tests.

For 1.0.1, Copilot's default files live in
`.github/skills/speckit-<name>/SKILL.md`. The older dotted `/speckit.specify`
syntax belongs to Copilot's explicitly selected **commands** mode, not this
lab's default. Claude's default skills also use hyphens; Gemini uses dotted
commands. See the [integration reference](./docs/02-spec-kit-breakdown.md#cli-reference)
before switching agents. The methodology transfers; syntax, permissions, and
generated files are agent-specific.

## Security and scope

Use an ordinary user account, a disposable browser profile, fictional data, and
manual tool approvals. Inspect generated scripts and diffs before execution.
Do not enable blanket auto-approval, expose the local server, connect production
repositories or credentials, install unreviewed extensions/MCP servers, or
publish tasks with `/speckit-taskstoissues` during the lab. Ignore rules do not
prevent an AI agent from reading files.

The material applies [Microsoft Zero Trust principles](https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview)
and the [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
to engineering decisions. It is **not official Microsoft or GitHub training**.
Local browser storage and a loopback server are deliberate teaching boundaries,
not substitutes for production identity, authorization, resilient storage, or
operational controls.

## Source references

For release-specific behavior, prefer frozen source over moving documentation:

- [Spec Kit 1.0.1 source](https://github.com/github/spec-kit/tree/9118ed15a0ba65053469a94c560ea5d233f75884)
  and [core CLI reference](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/docs/reference/core.md).
- [1.0.1 Copilot integration](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/src/specify_cli/integrations/copilot/__init__.py)
  for skills defaults and legacy commands behavior.
- [Current Spec Kit documentation](https://github.github.io/spec-kit/),
  [VS Code agent security](https://code.visualstudio.com/docs/agents/run/security),
  and [Node.js support status](https://nodejs.org/en/about/previous-releases)
  are live references. Recheck them before teaching a future cohort.

## License

Released under the [MIT License](./LICENSE).
