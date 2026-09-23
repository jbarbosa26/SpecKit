# noGHCP

**A no-AI workshop using the official Spec Kit CLI and manual development.** You write the
requirements, make decisions, review documents, edit code, and run checks
yourself. No GitHub Copilot, Claude Code, other AI assistant, model, account,
API key, or subscription is required.

Install **Git, Python 3.12, uv, Spec Kit 1.0.1, Node.js 24 LTS, a browser, and
any text editor**. You do not need VS Code, an Azure subscription, or a cloud
service. After installing tools and obtaining the materials, the documented
scaffolding, helper scripts, editing, and application exercises run locally.

**Important limitation:** Spec Kit's `/speckit.*` slash commands are agent
instructions, not native `specify` subcommands. Installing the CLI, Python, and
Node does not make those workflows execute without an agent. This track
therefore uses the official CLI and helpers for their supported operations and
explicit manual equivalents for the slash-command phases. It does **not**
introduce a custom slash-command runner or secretly call an AI tool.

## Follow these documents in order

| Order | Document | What you do |
| --- | --- | --- |
| 1 | [Prerequisites](./01-prerequisites.md) | Install the pinned CLI and local runtimes; obtain the starter. |
| 2 | [Hands-on lab](./02-hands-on-lab.md) | Initialize with the CLI, run native helpers, write/review artifacts, then implement status changes and filtering manually. |
| 3 | [Validation, change, and handoff](./03-validation-and-handoff.md) | Exercise security/failure cases, specify and implement search, and record evidence. |

The supplied [BookNook starter](./starter/) is a small, working **add/list/persist
baseline**, not a completed workshop solution. Status changes, status filtering,
and search are exercises. You specify these extensions **before** implementing
them. This is incremental SDD on existing code, not a claim that you authored
the supplied server and storage infrastructure from scratch.

You can work alone with the concrete self-review gates or pair with another
student. All decisions and acceptance results are human-owned. Reference
solutions appear after the coding instructions in collapsible sections: attempt
the exercise first, then compare the solution with your specification.

## Six checkpoints

| Checkpoint | Minutes | Instructions |
| --- | ---: | --- |
| 1. Initialize and inspect the baseline | 30 | [Lab](./02-hands-on-lab.md#checkpoint-1) |
| 2. Write intent and governing rules | 60 | [Lab](./02-hands-on-lab.md#checkpoint-2) |
| 3. Plan, decompose, and review | 50 | [Lab](./02-hands-on-lab.md#checkpoint-3) |
| 4. Implement status/filter manually | 110 | [Lab](./02-hands-on-lab.md#checkpoint-4) |
| 5. Validate the result | 60 | [Validation](./03-validation-and-handoff.md#checkpoint-5) |
| 6. Specify search, implement, hand off | 80 | [Change and handoff](./03-validation-and-handoff.md#checkpoint-6) |
| **Total** | **390** | **6.5 hours; prework and breaks are additional** |

These are facilitator budgets, not measured completion guarantees. Do not
bypass a review or hide failures to meet the clock. The route includes
copyable document templates, concrete test cases, manual coding steps, and
expected results; no AI-generated intermediate artifact is needed.

## What the tools do

`specify init` installs local scaffolding with the `generic` integration. Python
runs the CLI; its PowerShell/Bash helpers create feature/plan scaffolds and
report structural prerequisites. Git records a local comparison baseline;
Node serves static files and runs built-in tests. Humans supply the actual
content and decisions. None of the documented steps calls an AI service.
There are no npm dependencies or package-install steps for BookNook.

## Slash-command phases and their no-AI equivalents

**The left column contains reference labels, not terminal commands.** Generic
initialization writes their guidance to `.manual/commands/speckit.<phase>.md`.
Read those files as background; do not execute them or install an agent to
interpret them. The lab supplies the exact supported terminal commands.

| Phase label | Operation in this track |
| --- | --- |
| `/speckit.constitution` | Edit the initialized constitution template and record human decisions. |
| `/speckit.specify` | Run `create-new-feature`, inspect its JSON/path, then write the spec. |
| `/speckit.clarify` | Answer the documented questions yourself or with a peer; update the spec. |
| `/speckit.plan` | Run `setup-plan`, then write architecture and contracts. |
| `/speckit.tasks` | Run `setup-tasks` to locate the template; create and write tasks manually. |
| `/speckit.checklist` | Create a requirements-quality checklist and review it yourself. |
| `/speckit.analyze` | Run structural prerequisite checks, then perform human cross-document analysis. |
| `/speckit.implement` | Make the guided code edits and run tests yourself. |
| `/speckit.converge` | Compare actual evidence with the artifacts; append unresolved work if necessary. |

Structural success is not semantic analysis, AI generation, implementation, or
proof that requirements are satisfied. External-write phases such as
`taskstoissues` and agent-dispatch workflows are outside this workshop.

The final BookNook contracts match the [shared application plan](../../examples/plan.md):
strict data validation, a 200-book limit, visible failures without silent data
loss, safe text rendering, accessible controls, and a restricted
`http://127.0.0.1:4173` server. Shared examples' agent commands are not instructions
for this track.

Use a separate scratch project, one application tab, a disposable unsynced
browser profile, and fictional data only. Local browser storage is not encrypted
storage, a backup, or a production architecture. Nothing here deploys resources,
publishes issues, commits changes automatically, or certifies security/WCAG
conformance.

## Relationship to Spec Kit 1.0.1

This track installs the official toolkit and uses its bundled artifacts at
[Spec Kit 1.0.1](https://github.com/github/spec-kit/tree/9118ed15a0ba65053469a94c560ea5d233f75884).
The generic integration does not require an agent executable. The project is
CLI-initialized, while specification content, clarification, analysis, and code
remain human work. That is different from executing native slash commands.
Do not install extensions/presets or run the generated agent-dispatch workflow.

The original [Copilot track](../03-walkthrough-and-lab.md) remains separate.
This track requires neither Copilot's setup nor an AI interpreter for the
generated guidance. Use this series' manual operations instead.

[Begin prerequisites](./01-prerequisites.md) | [All workshop tracks](../../README.md)
