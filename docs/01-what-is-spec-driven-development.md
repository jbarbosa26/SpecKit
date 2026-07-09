# What Is Spec-Driven Development?

For decades, the working assumption of software engineering has been simple: **code is truth.** Specifications, design documents, and requirements were scaffolding — useful to get started, but disposable the moment real code existed. We wrote the spec, built the system, and then watched the document drift into irrelevance while the code marched on as the only artifact that actually mattered.

Spec-Driven Development (SDD) inverts this relationship. It performs a deliberate **power inversion**: the **specification becomes the primary, executable artifact**, and code becomes its generated expression. The spec is no longer a faded photograph of intent — it is the living source of truth from which implementations are produced, regenerated, and validated.

The mantra is short: **specifications don't serve code; code serves specifications.** Your job shifts from typing implementation details to expressing intent precisely enough that a capable system can realize it.

---

## Why Now?

SDD is not a new wish — engineers have always wanted faithful specs. What changed is that three trends finally make the inversion practical and, increasingly, necessary.

1. **AI can turn natural language into working code.** Modern models reliably translate precise, well-structured natural-language specifications into functioning implementations. The bottleneck moved from "writing the code" to "stating the intent clearly." That makes the specification the highest-leverage artifact in the entire workflow.

2. **Software complexity keeps growing.** Systems are larger, more interconnected, and more constrained by compliance, performance, and security requirements than ever. Keeping an implementation aligned with its intent across that complexity demands a systematic mechanism — not tribal memory and stale wikis.

3. **Requirements change faster than ever.** Markets, regulations, and user expectations shift mid-project. When the spec is the source of truth, a pivot becomes a **systematic regeneration** rather than a fragile manual rewrite. You change the intent, then re-derive the plan and the implementation.

Together, these trends turn "keep the spec authoritative" from an aspiration into a workable engineering discipline.

---

## Core Principles

SDD rests on a handful of principles that, taken together, distinguish it from ad-hoc prompting.

- **Specifications as the lingua franca.** The spec is the shared language of the project. Product, engineering, design, and AI tooling all converge on one precise statement of intent rather than scattered docs and Slack threads.
- **Executable specifications.** A good spec is precise, complete, and unambiguous enough to generate a working system. Vagueness isn't tolerated as "we'll figure it out later" — it's surfaced and resolved.
- **Continuous refinement.** Consistency and quality validation happen continuously, not as a one-time gate before sign-off. The spec is checked, clarified, and tightened throughout the lifecycle.
- **Research-driven context.** Specs and plans are informed by gathered context — technical constraints, dependencies, organizational standards — rather than written in a vacuum.
- **Bidirectional feedback.** Production reality flows back into the specification. What you learn from running systems, incidents, and metrics informs the next revision of intent.
- **Branching for exploration.** Because the spec is the source, you can generate **multiple implementations** from one specification — exploring different stacks, architectures, or UX directions in parallel.
- **Intent-driven development.** The **WHAT** and the **WHY** come first and stay separated from the **HOW**. Implementation choices are deliberately deferred until intent is solid.

---

## The SDD Workflow at a Glance

SDD is a loop, not a waterfall. It starts with a rough idea and refines it through structured phases, with the artifacts versioned in branches and reviewed like code.

The flow moves from a governing **constitution**, into **specify** (WHAT/WHY, no technology), through **clarify**, into **plan** (HOW/tech choices), then into discrete **tasks**, an **analyze** consistency check, and finally **implement**. Crucially, learnings feed back to **specify**, so the cycle continues as understanding deepens.

```text
        ┌───────────────────────────────────────────────────────┐
        │                                                       │
        v                                                       │
   Constitution ──> Specify ──> Clarify ──> Plan ──> Tasks ──> Analyze ──> Implement
                       ^                                                       │
                       │                                                       │
                       └───────────────── feedback ────────────────────────────┘
```

Each step produces a reviewable artifact:

- **Constitution** — the immutable governing principles for the project.
- **Specify** — what we're building and why, with no technology decisions.
- **Clarify** — resolve ambiguities and `[NEEDS CLARIFICATION]` markers.
- **Plan** — how we'll build it: stack, architecture, data model, constraints.
- **Tasks** — a decomposed, ordered list of implementable units of work.
- **Analyze** — a cross-artifact consistency and quality check.
- **Implement** — generate and integrate the code that fulfills the spec.

Because every artifact lives in version control, specs are diffed, reviewed, and approved with the same rigor as source code.

---

## Development Phases

SDD adapts to where you are in a product's life. The same methodology supports building from nothing, exploring alternatives, and evolving existing systems.

| Phase | What It Means | Typical Use |
| --- | --- | --- |
| **0-to-1 (Greenfield)** | Generate a system from scratch, starting from intent and producing a first working implementation. | New products, new services, proofs of concept that need to become real. |
| **Creative Exploration** | Produce parallel implementations from one spec to compare stacks, architectures, and UX approaches. | Evaluating technology choices, de-risking architecture, design bake-offs. |
| **Iterative Enhancement (Brownfield)** | Add features iteratively, modernize legacy code, and adapt processes — all anchored to an authoritative spec. | Existing products, modernization efforts, incremental delivery. |

---

## How Templates Raise Quality

SDD doesn't rely on the AI's good intentions — it constrains the AI with **structured templates** that consistently produce better specifications. The templates encode hard-won engineering discipline:

- **Force `[NEEDS CLARIFICATION]` markers** so the AI flags unknowns instead of silently guessing.
- **Separate WHAT from HOW**, keeping premature implementation detail out of the specification.
- **Embed checklists** that act like "unit tests for the spec" — testable conditions a spec must satisfy.
- **Add constitution "gates"** that prevent over-engineering by requiring justification for added complexity.
- **Encourage test-first thinking**, so acceptance criteria and verification are designed alongside intent, not bolted on later.

The result is that the structure of the template, not just the prompt, drives quality.

---

## The Constitution

At the heart of an SDD project is its **constitution** — a set of immutable governing principles the project commits to. It captures the non-negotiables: quality standards, testing expectations, simplicity and anti-over-engineering rules, UX consistency, performance and security baselines, and any organizational mandates.

Think of the constitution as the project's **architectural DNA.** Every specification and every plan must comply with it, and the analyze step references it to catch drift. By making principles explicit and persistent, the constitution keeps a fast-moving, AI-assisted workflow aligned with what the team actually values.

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
- **Spec-Driven Development** is structured and multi-step. Intent is captured, clarified, and refined deliberately; it is **versioned** alongside the code; and the result is **reproducible and reviewable**, because the specification — not a transient conversation — is the source of truth.

Vibe coding is excellent for exploration and momentum. SDD is what you reach for when intent must outlive the conversation that created it.

---

## Next Steps / Further Reading

SDD is a methodology, not a product — it is independent of any particular tool or AI coding agent. GitHub Spec Kit is one implementation of it, and it is itself agent-agnostic, working with 30+ agents (GitHub Copilot, Claude Code, Gemini CLI, Codex CLI, Cursor, and more).

Continue with the sibling docs in this sample:

- [`02-spec-kit-breakdown.md`](02-spec-kit-breakdown.md) — the GitHub Spec Kit toolkit and its commands.
- [`03-walkthrough-and-lab.md`](03-walkthrough-and-lab.md) — a hands-on lab to try SDD end to end.
- [`04-adapting-existing-projects.md`](04-adapting-existing-projects.md) — brownfield adoption for existing codebases.
- [Project overview](../README.md) — what this repository contains and how the docs fit together.

Official sources:

- **GitHub Spec Kit repository** — https://github.com/github/spec-kit
- **Spec Kit documentation** — https://github.github.io/spec-kit/
- **Spec-Driven Development methodology deep-dive** — https://github.com/github/spec-kit/blob/main/spec-driven.md
