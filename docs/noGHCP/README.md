# noGHCP

**A fully manual, no-AI spec-driven development workshop.** You write the
requirements, make decisions, review documents, edit code, and run checks
yourself. No GitHub Copilot, Claude Code, other AI assistant, model, account,
API key, or subscription is required.

Use **Git, Node.js 24 LTS, a browser, and any text editor**. You do not need
Python, `uv`, the Specify CLI, VS Code, an Azure subscription, or a cloud service.
After obtaining the tools and workshop materials, the required exercises can
be completed locally without internet access.

## Follow these documents in order

| Order | Document | What you do |
| --- | --- | --- |
| 1 | [Prerequisites](./01-prerequisites.md) | Prepare ordinary development tools and obtain the local starter. |
| 2 | [Hands-on lab](./02-hands-on-lab.md) | Write and review the artifacts, then manually implement status changes and filtering. |
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
| 1. Copy and inspect the baseline | 30 | [Lab](./02-hands-on-lab.md#checkpoint-1) |
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

Git records a local comparison baseline; Node serves static files and runs its
built-in tests; the browser stores fictional books locally; your editor changes
plain text files. None of those actions calls an AI service. There are no npm
dependencies or package-install steps for the application.

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

This is a **manual SDD companion**, organized around the constitution, spec,
plan, tasks, review, implementation, and evidence concepts used by
[Spec Kit 1.0.1](https://github.com/github/spec-kit/tree/9118ed15a0ba65053469a94c560ea5d233f75884).
Students create similarly named Markdown artifacts by hand. It is not an
AI-free mode of the Specify CLI and does not execute agent slash commands.
Those document folders do not constitute a CLI-initialized Spec Kit project.

The original [Copilot track](../03-walkthrough-and-lab.md) remains separate.
This manual track requires neither its setup nor any of its agent instructions.

[Begin prerequisites](./01-prerequisites.md) | [All workshop tracks](../../README.md)
