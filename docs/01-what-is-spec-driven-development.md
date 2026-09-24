# What Is Spec-Driven Development?

Specifications often drift away from the software they describe. **Spec-Driven Development (SDD)** addresses that problem by keeping intent explicit, versioned, and reviewable throughout delivery. A specification describes the desired behavior and constraints; a technical plan explains the design; tasks connect that design to implementation and verification.

The specification is authoritative about **intended behavior**, not proof of **actual behavior**. Natural-language requirements are not literally executable. Tools such as GitHub Spec Kit help an AI agent turn them into plans, code, and tests, but engineers must review the interpretation, run independent checks, and reconcile differences.

The useful principle is **code should serve agreed intent**. SDD does not remove engineering judgment, guarantee deterministic generation, or establish security, compliance, or production readiness by producing documents.

---

## Why Now?

SDD is not a new wish. Three pressures make disciplined specification particularly useful in AI-assisted development:

1. **AI accelerates implementation, including mistakes.** Precise requirements and bounded tasks make generated changes easier to inspect. Models can still misunderstand requirements or invent assumptions.

2. **Constraints cross team boundaries.** Security, reliability, accessibility, performance, and data-handling decisions need a shared record rather than scattered chat history.

3. **Requirements change.** Updating the specification first exposes the impact on contracts, tests, and implementation. It does not make wholesale regeneration safe; incremental changes still need regression checks.

The benefit is a more inspectable delivery process, not a promise that better prompts eliminate defects.

---

## Core Principles

SDD rests on a handful of principles that, taken together, distinguish it from ad-hoc prompting.

- **Shared intent.** Product, engineering, design, and AI tooling work from the same reviewed requirements.
- **Testable outcomes.** Define observable acceptance criteria, failure behavior, and explicit exclusions. Surface unknowns rather than silently guessing.
- **WHAT/WHY before HOW.** Separate user outcomes from design choices, while recording genuine constraints imposed by an existing system.
- **Research-driven context.** Inspect current code, contracts, dependencies, and organizational standards before proposing a change.
- **Traceability.** Connect requirement identifiers to design decisions, tasks, implementation changes, and verification evidence.
- **Continuous refinement.** Feed review findings, tests, incidents, and operational observations back into the artifacts.
- **Controlled exploration.** Compare alternative implementations in isolated workspaces or deliberately created branches, with the same acceptance criteria.

---

## The SDD Workflow at a Glance

SDD is a loop, not a waterfall. It starts with a rough idea and refines it through structured phases, with the artifacts versioned in branches and reviewed like code.

The flow moves from a governing **constitution**, into **specify** (WHAT/WHY), through **clarify**, into **plan** (HOW), then **tasks**, an **analyze** consistency check, and gated **implementation and verification**. Findings can send you back to any earlier artifact.

```text
Constitution → Specify → Clarify → Plan → Tasks → Analyze → Implement + verify
                   ↑                                           |
                   └────────── reviewed feedback ───────────────┘
```

Each step has a different responsibility:

| Step | Reviewable result |
| --- | --- |
| Constitution | `.specify/memory/constitution.md`: governing principles and review gates, amendable through review. |
| Specify / clarify | `spec.md`: user stories, requirements, acceptance criteria, scope, and resolved ambiguities. |
| Plan | `plan.md`: architecture, interfaces, constraints, and justified trade-offs; supporting research or contracts where needed. |
| Tasks | `tasks.md`: ordered work, dependencies, verification tasks, and links back to requirements. |
| Analyze | Consistency findings across the artifacts, not proof that the software works or is secure. |
| Implement / verify | Source changes, reviewed diffs, test results, manual checks, and unresolved risks. |

Version these artifacts alongside the implementation. A checked task box is not evidence that its acceptance criteria passed. For example, BookNook's **FR-006** requires safe storage-failure behavior: the plan defines error propagation, tasks cover storage and UI changes, and evidence must show a failed save neither changes the displayed state nor reports success.

**Generated tests can share the implementation's mistaken assumptions.** Review expected results against the requirements, add negative and boundary cases, and use independent human checks. Passing tests establish only what those tests actually exercised.

This repository pins **Spec Kit v1.0.1**. Its default Copilot skills use hyphenated names such as `/speckit-specify`, `/speckit-plan`, and `/speckit-tasks`. Core selects the active feature through `.specify/feature.json`, independently of the current Git branch. Git initialization and automatic feature branches require an **opt-in Git extension**; core does neither. See the [pre-work and command reference](02-spec-kit-breakdown.md) before running the workflow.

---

## Development Phases

SDD adapts to where you are in a product's life. The same methodology supports building from nothing, exploring alternatives, and evolving existing systems.

| Phase | What It Means | Typical Use |
| --- | --- | --- |
| **0-to-1 (Greenfield)** | Build and verify a first implementation from agreed intent. | New products and bounded proofs of concept. |
| **Creative Exploration** | Compare implementations against shared acceptance criteria. | Technology choices, architecture experiments, and UX alternatives. |
| **Iterative Enhancement (Brownfield)** | Specify a bounded change against existing behavior and contracts. | Existing products, modernization, and incremental delivery. |

---

## How Templates Raise Quality

Structured templates make omissions easier to notice:

- **Clarification markers** expose unknowns for a decision.
- **Separate specification and plan sections** distinguish intent from design.
- **Checklists** prompt reviewers to examine scope, completeness, and quality.
- **Constitution checks** require justification for deviations and added complexity.
- **Verification tasks** put acceptance and failure cases into the work breakdown. State testing requirements explicitly rather than assuming tests will always be generated.

These are process aids, not enforcement boundaries. A checklist cannot replace code review, an executable test, or a security control.

---

## The Constitution

The **constitution** records the team's governing principles: quality and testing expectations, simplicity, accessibility, performance and security baselines, and organizational obligations. It should identify concrete review gates rather than promise qualities that have not been demonstrated.

It is stable, not immutable. Amend it deliberately, review the impact on existing artifacts, and distinguish required policy from current implementation gaps. In brownfield work, do not mistake an insecure legacy practice for an acceptable standard.

---

## A Microsoft-Informed Architecture Lens

The [Microsoft Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/) provides five useful review dimensions. Use them proportionately; this mapping is not Microsoft endorsement, a compliance assessment, or a requirement to provision Azure.

| Pillar | Specification: required outcome | Plan, tasks, and implementation evidence |
| --- | --- | --- |
| **Reliability** | Failure behavior, availability needs, and acceptable data loss. | Design recovery paths; test failures and restoration against agreed recovery objectives. |
| **Security** | Protected assets, trust boundaries, allowed actions, and data handling. | Threat model, least-privilege design, security tests, and reviewed controls. |
| **Cost Optimization** | Cost constraints and accountable owners. | Compare alternatives; measure usage and review alerts. A budget is not a spending cap. |
| **Operational Excellence** | Support, change approval, diagnostics, and recovery expectations. | Reviewable changes, appropriate automation, safe diagnostic practices, and rehearsed runbooks. |
| **Performance Efficiency** | Measurable response-time, capacity, and resource limits. | State workload assumptions; run representative boundary and performance tests. |

[Zero Trust](https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview) and the [Well-Architected security principles](https://learn.microsoft.com/en-us/azure/well-architected/security/principles) add three access-control principles: **verify explicitly, use least privilege, and assume breach**. For a production workload, translate them into identity, authorization, segmentation, detection, and recovery requirements.

Apply the same risk mindset to the development environment: review workspace content and proposed commands, give agents only the tools and access needed, and assume repository text or fetched material could contain prompt injection. A specification or a read-only analysis instruction is **not an OS sandbox**. These practices do not turn a local demo into a Zero Trust architecture.

---

## When SDD Shines / When to Be Pragmatic

SDD is a powerful discipline, but it is a tool — not a tax to apply to every keystroke.

### When SDD Shines

- **Net-new features** where intent needs to be captured clearly before building.
- **Complex or ambiguous requirements** that benefit from forced clarification and structured decomposition.
- **Multi-stack or multi-architecture exploration** where you want several implementations from one spec.
- **Teams needing traceability and review**, where intent must be versioned, diffed, and approved.
- **Modernization** of legacy systems, where an authoritative spec anchors safe, incremental change.

### When to Be Pragmatic

- **Tiny throwaway scripts** that will be deleted within the hour.
- **Trivial one-line fixes** where the intent is obvious and the change is mechanical.
- **Spikes** and quick experiments — here you can intentionally skip clarification to move fast, accepting that the result is exploratory rather than production intent.

The goal is leverage, not ceremony. Use the full loop where alignment and reproducibility matter; lighten it where they don't.

---

## Spec-Driven vs. "Vibe Coding"

It helps to contrast SDD with the increasingly common practice of **"vibe coding"** — improvising with the AI one prompt at a time.

- **Vibe coding** is prompt-by-prompt. Intent lives only in the chat history (or someone's head), the path to a result is hard to reproduce, and review is difficult because there's no durable, structured artifact of what was intended.
- **Spec-Driven Development** is structured and multi-step. Intent is captured, clarified, and **versioned** alongside the code. The process and decisions become more traceable and reviewable, even though model output may differ between runs.

Vibe coding is excellent for exploration and momentum. SDD is what you reach for when intent must outlive the conversation that created it.

---

## Next Steps / Further Reading

SDD is a methodology, not a product, and does not require AI. This repository offers **GitHub Copilot in VS Code using Spec Kit skills** and a separate **[noGHCP CLI-and-manual route](./noGHCP/README.md)**. In noGHCP, the official pinned Specify CLI and helpers seed local scaffolding; humans write and review the artifacts, then implement extensions to a supplied local baseline. Python and Specify are required, with **uv or isolated pip** as the installer; no AI tool or agent account is needed. The [shared setup guide](./00-tool-setup.md) covers both installers and PATH configuration.

Spec Kit's slash commands are agent Markdown instructions, not native terminal commands. The no-AI route provides [manual equivalents for those phases](./noGHCP/README.md#slash-command-phases-and-their-no-ai-equivalents), not a custom runner or automatic semantic analysis. Generated guidance and workflow definitions are not executed in that route.

The separate **390-minute workshop** (excluding pre-work and breaks) builds **BookNook**, a single-user local browser demo using vanilla HTML/CSS/JavaScript and `localStorage`. Node.js **24 LTS** serves static files and runs built-in tests; there is no application backend or third-party npm dependency. Use fictional data only. The workshop creates **no Azure deployments, IaC, or cloud resources and incurs no Azure resource costs**; agent usage may cost money. Its checks are learning evidence, not security, accessibility, compliance, or production-readiness certification.

Continue with the sibling docs in this sample:

- [`02-spec-kit-breakdown.md`](02-spec-kit-breakdown.md) — student pre-work and the version-specific command reference.
- [`03-walkthrough-and-lab.md`](03-walkthrough-and-lab.md) — the hands-on workshop.
- [`04-adapting-existing-projects.md`](04-adapting-existing-projects.md) — brownfield adoption for existing codebases.
- [Project overview](../README.md) — what this repository contains and how the docs fit together.

**Frozen implementation reference:** Spec Kit v1.0.1, commit `9118ed15a0ba65053469a94c560ea5d233f75884`.

- [Spec Kit methodology](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/spec-driven.md) — interpret its aspirational language with the engineering limits above.
- [Bundled workflow command templates](https://github.com/github/spec-kit/tree/9118ed15a0ba65053469a94c560ea5d233f75884/templates/commands).

**Live guidance:** the Microsoft sources above and [VS Code agent security](https://code.visualstudio.com/docs/agents/run/security) evolve independently of the frozen toolkit release.
