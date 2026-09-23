# Adapting an Existing Project to Spec-Driven Development

Most teams inherit code, conventions, tests, and undocumented behavior. Introducing **Spec-Driven Development (SDD)** into a **brownfield** project means making new changes reviewable without discarding that history.

This guide targets **GitHub Spec Kit v1.0.1**, commit `9118ed15a0ba65053469a94c560ea5d233f75884`, with **GitHub Copilot skills in VS Code**. Other integrations can differ in syntax and permissions; swapping a name is not a complete migration procedure.

For a complete workshop without AI tools, use
[noGHCP CLI-and-manual track](./noGHCP/README.md), which uses the official pinned
Specify CLI, Python/uv, generic scaffolding, and manual spec-first extensions to a
supplied local baseline. Slash commands are agent instructions, not native
terminal operations; use the [manual phase equivalents](./noGHCP/README.md#slash-command-phases-and-their-no-ai-equivalents)
without an AI tool or custom runner. The brownfield principles below transfer,
but this guide's integration-specific commands remain for the original Copilot track.

- Adopt SDD **incrementally**, for a bounded change rather than a big-bang rewrite or an invented specification of the entire legacy system.
- Capture governing standards in the constitution; put feature-specific existing behavior, dependencies, and uncertainties in the spec and plan.
- Use tests, reviewed diffs, and human acceptance checks as evidence. Documents alone do not demonstrate correctness or compliance.

The examples extend **BookNook**, the workshop's local browser app: Node.js **24 LTS**, vanilla HTML/CSS/JavaScript, `localStorage`, no application backend, and no third-party npm dependencies. Real projects should retain their own supported stack unless a separately reviewed change justifies migration.

---

## Before you start — assess readiness

Before giving an agent write or execution access:

- [ ] Identify the repository owner, a small pilot, current conventions, and applicable security/data policies.
- [ ] Run the existing tests and CI-equivalent checks; record baseline failures. Add characterization tests for relevant undocumented behavior rather than silently treating it as correct.
- [ ] Back up tracked, untracked, and ignored files using your approved backup process; verify recovery. A branch or tracked-file commit alone does **not** protect all local data.
- [ ] Review outstanding changes and preserve them before proceeding. Do not reset, clean, delete Git metadata, or rewrite history to obtain a clean tree.
- [ ] Review unfamiliar repositories in VS Code **Restricted Mode** before trusting them. Agents are disabled there; inspect scripts, instructions, extensions, and workspace settings first.
- [ ] Use manual approvals and review inherited tool, terminal, and URL permissions. Do not enable global auto-approval. Use supported sandboxing where available; approval prompts and Git branches are not isolation boundaries.
- [ ] Exclude secrets and production data from prompts, fixtures, and diagnostics. Use fictional data for the pilot.

### Signals you're ready vs. fix first

| Signal you're ready | Fix first |
| --- | --- |
| Changes are understood and backed up; baseline is recorded | Unowned changes or no recovery path |
| Relevant tests pass, or failures are explicitly understood | CI is red and ignored; changed behavior has no checks |
| Lint/format configs exist and are enforced | Style is "whatever the last commit did" |
| A small, valuable pilot feature is identified | The only candidate is a 6-month epic |
| Team has agreed to try SDD on new work | Adoption is a surprise to the team |
| Copilot is set up in VS Code for contributors | Tooling access is unresolved |

You don't need a perfect score. But the more "fix first" rows you have, the more value you'll get from addressing them before — not during — your first spec.

---

## Step 1 — Initialize safely, or use the upgrade path

Prerequisites: **Python 3.11+**, **uv**, Git for the source-pinned installation and review workflow, and approved Copilot access in VS Code. The application runtime is separate from the CLI's Python requirement.

**Terminal — install the pinned CLI and inspect the environment:**

```powershell
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@9118ed15a0ba65053469a94c560ea5d233f75884
specify version
specify check
```

Here `--force` belongs to **uv's CLI installation**, not project initialization. Installing it can replace the CLI used by other projects; record their requirements first. The source commit is pinned, not the entire transitive dependency environment. `specify check` is a tool-availability check, not an application security or correctness test.

If `.specify` or existing Spec Kit integration files are already present, stop and use [Upgrading an existing installation](#upgrading-an-existing-installation). Do not reinitialize an installed project as a shortcut.

After backups and baseline review, create a dedicated review branch **yourself**, from the intended existing branch. Choose an unused branch name.

```powershell
git status --short
git diff
git diff --cached
git switch -c adopt-spec-kit
specify init --here --integration copilot --script ps
```

For Bash, use `specify init --here --integration copilot --script sh`; do not run both. `--here` targets the current directory. In a nonempty directory, inspect the warning and confirm only after reviewing the files at risk. Do **not** add blanket `--force` to bypass the check. If unattended initialization cannot obtain confirmation, use an interactive, reviewed session instead.

### What to inspect

Default Copilot skills setup uses bundled release assets and creates or updates:

- `.github/skills/speckit-<name>/SKILL.md`, invoked with hyphenated names such as `/speckit-specify`.
- `.specify` memory, scripts, core templates, workflow files, and integration/init metadata and manifests.
- An initial constitution template if a constitution is not already present. Feature artifacts arrive later during the workflow.

Initialization is **not overwrite-proof**: generated integration files may be replaced. Do not assume every existing customization is merged or preserved. Immediately review:

```powershell
git status --short --untracked-files=all
git diff --stat
git diff
specify integration status
```

Git diffs do not show untracked file contents or ignored files: inspect newly generated files directly and compare relevant ignored files with the backup. Review `.gitignore`; version the constitution and feature artifacts, not secrets or transient output. Propose the reviewed scaffold separately from the pilot implementation.

**Legacy mode is different.** Explicit `--integration-options="--commands"` uses dotted invocations such as `/speckit.specify` with agent/prompt files. It can create or merge `.vscode/settings.json`, including `chat.tools.terminal.autoApprove` rules. Review and remove unwanted automatic approvals before execution. Fresh skills mode does not generate those settings, but it does not remove inherited permissions either. This guide uses skills mode throughout.

Core does **not** initialize Git or create feature branches. Those capabilities belong to the optional Git extension, which is not part of this baseline. The feature workflow maintains `.specify/feature.json` independently of Git branches; check both the current branch and feature selection before changes.

---

## Step 2 — Capture the system you already have in a constitution

The **constitution** (`.specify/memory/constitution.md`) records governing principles. Ground it in repository evidence and required policy, but distinguish existing behavior from approved standards. An insecure legacy pattern is a gap to remediate, not a rule to perpetuate.

Capture:

- Language and runtime versions actually in use.
- Framework and library choices already committed to.
- Testing requirements (coverage gates, test-first expectations, required suites).
- Security and compliance rules (authn/authz patterns, data handling, regulatory constraints).
- Performance budgets and SLAs.
- Code-review gates and branch-protection rules.
- Deployment and release policy.

**Copilot Chat — read before drafting:**

```text
/speckit-constitution Read the existing repository and its applicable policies
before drafting. Inspect runtime/config files, current tests, CI, contributor
guidance, and security boundaries; do not read secrets. Distinguish observed
practice from required policy. Flag unsupported runtimes, inconsistent behavior,
and security gaps rather than endorsing them or inventing guarantees.
Record concrete testing, data-handling, dependency, and review requirements.
For BookNook retain Node 24, browser ES modules, localStorage, fictional data,
zero third-party npm dependencies, and no application backend or cloud deployment.
List unresolved decisions for review. Do not execute scripts or change the app.
```

Review the draft as a team. Amendments need review and an impact assessment; the constitution is not immutable and is not an enforcement mechanism.

Optionally maintain `.github/copilot-instructions.md` with durable repository facts; initialization does not generate it for you. Keep it consistent with the constitution, free of secrets, and subject to review.

---

## Step 3 — Pick a thin, real pilot feature

Choose something **small, valuable, low-blast-radius**, with representative domain, UI, and verification work.

| Good pilot candidates | Bad pilot candidates |
| --- | --- |
| Add title/author search to an existing local book list | Add accounts and a cloud backend as an incidental change |
| A small, well-bounded enhancement to one module | A cross-cutting rewrite of the data layer |
| A feature with clear acceptance criteria | A vague "make it faster" epic |
| Something covered by — or easy to cover with — tests | An area with zero test coverage and high risk |
| A change one reviewer can fully understand in a PR | A multi-team, multi-month initiative |

The pilot's job is to build confidence and reveal friction, not to deliver the biggest possible win.

---

## Step 4 — Specify the change against existing reality

For a genuinely new feature, `/speckit-specify` creates a numbered feature directory containing `spec.md` and updates the feature pointer. It does **not** automatically create a Git branch. Explicitly reference existing behavior and contracts so the proposal integrates rather than reinvents.

For an already specified feature, revise its existing artifacts instead of creating a duplicate feature. The workshop's **CR-001 / FR-011** search change extends the selected BookNook feature. Confirm `.specify/feature.json` first, then use this **ordinary Copilot Chat request**:

```text
Revise this feature's existing spec.md for CR-001 / US3 / FR-011; do not create
a new feature directory. Add case-insensitive substring search over book title
OR author. Trim the query; a blank query matches all books. Combine search with
the existing status filter using AND. Do not persist the query. Show a no-match
message. Preserve all existing storage, validation, and accessibility behavior.
Record the existing domain, storage, and UI boundaries and acceptance cases.
Do not change implementation files yet.
```

Tips that matter for brownfield specs:

- Use the **Assumptions** section to record existing systems and behaviors the feature depends on, and any legacy quirks you're choosing to preserve.
- Use **Key Entities** to name the existing modules/contracts the change touches, so the plan stays anchored to them.
- Run **`/speckit-clarify`** before planning. Resolve legacy ambiguity against observed behavior and approved requirements, not the agent's guesses.

---

## Step 5 — Plan within existing architecture

`/speckit-plan` develops the technical plan. Reuse the supported stack and existing contracts unless a reviewed decision justifies a change. For an existing feature, require a targeted revision and inspect the diff for accidental loss of prior decisions.

```text
/speckit-plan Revise the selected BookNook feature plan for FR-011, preserving
earlier requirements and decisions. Extend selectBooks in src/domain.js with
query='' alongside status='all'; preserve its non-mutating behavior. Wire the
search control in src/app.js and index.html, keeping text rendering safe and
keyboard access intact. Keep src/storage.js and its persisted schema unchanged.
Use Node 24 built-in tests, with no npm dependencies. Record as-is/to-be behavior,
acceptance tests, risks, and recovery steps. Do not implement yet.
```

- Use **Complexity Tracking** to justify new dependencies or architectural deviations. Review is the gate; the section cannot prevent an agent from deviating.
- Capture **as-is vs. to-be** notes in `research.md`. Documenting current behavior before describing the change is invaluable when a reviewer asks "what did this break?"
- The plan may also produce `data-model.md`, `quickstart.md`, and `contracts/` — make sure these describe integration with existing contracts, not parallel new ones.

---

## Step 6 — Tasks, analyze, implement incrementally

Run these **separately in Copilot Chat**, reviewing the result before advancing:

```text
/speckit-tasks
/speckit-analyze
/speckit-implement
```

- `/speckit-tasks` writes `tasks.md`. Require explicit test and security-review tasks linked to requirements. For an existing feature, preserve completed work and clearly identify the new delta.
- A **`[P]`** marker proposes parallel work; verify actual dependencies, shared state, and file overlap yourself.
- `/speckit-analyze` performs read-only cross-artifact analysis. Resolve material gaps before implementation. It is not a security audit or an OS sandbox.
- `/speckit-implement` directs the agent to perform tasks. Approve bounded slices, inspect commands before execution, and review resulting diffs.

Brownfield discipline during implementation:

- **Run baseline and new checks.** Tests reduce risk but cannot prove that no legacy behavior regressed. Review generated expectations independently.
- **Use a branch and PR deliberately.** Create the branch yourself; verify the feature pointer after branch changes rather than assuming it follows Git.
- **Keep changes reviewable.** Small, coherent diffs beat one enormous commit — especially while the team is still learning to trust the workflow.
- **Keep external actions separate.** Publishing issues, commits, pushes, releases, or deployments requires explicit authorization; it is not implied by implementing a task.

For BookNook, use its existing `npm test` and `npm run check` scripts, then browser acceptance checks at `http://127.0.0.1:4173`. There is no `npm install`, build, or lint step. Check search/status combinations, blank/no-match states, persistence, keyboard access, and storage failures. Use a disposable browser profile; preserve corrupt data and reset only `booknook:v1` when explicitly authorized, never all origin storage.

If a slice fails, retain diagnostics without sensitive data, stop further changes, and repair the bounded failure. Compare with your backup and restore only reviewed files when necessary; do not prescribe destructive reset/clean or history-rewrite commands.

---

## Upgrading an existing installation

**Changing the installed CLI does not regenerate a project.** Treat CLI replacement, repository integration refresh, and optional extension/preset changes as separate reviewed operations. For this workshop, remain on the pinned v1.0.1 commit.

1. **Inventory and protect.** Record `specify version` and `specify integration status`, integration mode, customizations, and baseline checks. Back up tracked/untracked/ignored data and create a review branch as above. Identify whether Copilot is the active/default integration.
2. **Install the approved CLI source.** Use the commit-pinned `uv tool install` command in Step 1, then `specify version` and `specify check`. For a future version, verify its commit and migration guidance first; do not silently follow a moving branch.
3. **Refresh the installed Copilot integration from that CLI's bundled assets:**

   ```powershell
   specify integration status
   specify integration upgrade copilot
   specify integration status
   ```

   This requires existing installation metadata and a readable integration manifest. If metadata is inconsistent, or output says **"Nothing to upgrade"** because the manifest is missing, stop for manual recovery review. Exit code zero alone does not prove a refresh occurred.

4. **Resolve customizations deliberately.** Modified managed integration files block the ordinary upgrade. Do not bypass this with `--force`: compare local changes with the pinned upstream assets, decide which behavior to retain, and manually reconcile under review before retrying. Do not edit manifest hashes to conceal changes.
5. **Review the complete result.** Upgrading the **active/default** integration also refreshes eligible shared scripts and templates; locally modified shared files can be retained and need manual reconciliation. Obsolete managed files may be removed. An inactive integration upgrade is not a complete shared-template refresh. Existing commands-mode projects stay in that mode unless deliberately migrated; upgrading is not an automatic switch to skills.
6. **Validate before adoption.** Inspect warnings, settings, status, tracked diffs, and new/ignored files. Rerun existing checks and rehearse the workflow in a disposable copy with fictional data. Upgrade can partially write files before failing; preserve diagnostics and recover from the reviewed backup rather than assuming an atomic rollback.

The ordinary core upgrade does not regenerate the constitution, feature specs, plans, tasks, or application implementation. It is **not a guarantee that every customization remains effective or compatible**. Optional extension/preset package updates are separate changes; this guide adds none. Review the [frozen upgrade guide](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/docs/upgrade.md) alongside the implementation references below.

---

## Encoding team standards

Start with the reviewed constitution and existing CI gates. Once a pilot works, consider project-local template overrides in `.specify/templates/overrides/`, or reviewed presets for shared conventions. Presets shape generated artifacts; they do not enforce policy or certify compliance.

Extensions add capabilities and can execute code or contact external systems. Treat them as supply-chain changes with explicit approval, not prerequisites for basic SDD. The workshop baseline installs no extensions, extra catalogs, or MCP servers.

---

## An incremental adoption roadmap

Adopt SDD in phases, each with a clear exit criterion. Don't move on until the current phase is genuinely working.

| Phase | Focus | Exit criteria |
| --- | --- | --- |
| **Phase 0 — Pilot** | Run one thin feature through the reviewed workflow | Acceptance evidence and regression checks reviewed; team agrees the loop is worth repeating |
| **Phase 1 — Codify** | Refine the constitution and optional template conventions | Standards, gaps, and review gates agreed; templates support them |
| **Phase 2 — Roll out** | Expand to a squad/team; specs reviewed in PRs | Multiple features delivered via SDD; specs are reviewed like code; reviewers comfortable with the artifacts |
| **Phase 3 — Default** | SDD is the standard for all net-new features; modernize legacy opportunistically | New work defaults to a spec; legacy areas refactored under specs as they're touched |

---

## Working as a team

SDD works best when spec artifacts are treated as first-class, reviewed code:

- **One branch + PR per feature.** Create a branch and PR per feature, and review the `spec.md`, `plan.md`, and `tasks.md` alongside the implementation.
- **Constitution changes go through review.** A change to your principles affects every future feature; it deserves the same scrutiny as a schema migration.
- **Keep `specs/` in the repo.** Versioned specs give you history, blame, and traceability — don't relegate them to a wiki.
- **Align tasks with normal work tracking.** Link requirements, changes, and evidence; authorize any external publication separately.

---

## Production Azure considerations — conceptual, not a lab step

**No Azure deployment was requested.** The 390-minute workshop requires no Azure subscription, creates no IaC or cloud resources, and incurs no Azure resource costs. Copilot/agent usage may cost money. BookNook is not a production architecture or a compliance deliverable.

If a separate, authorized project later targets Azure, use the [five-pillar and Zero Trust mapping](01-what-is-spec-driven-development.md#a-microsoft-informed-architecture-lens) to turn these decisions into requirements, plans, tasks, and tested evidence:

- **Identity and secrets:** prefer Managed Identity for supported workload-to-service authentication, with least-privilege RBAC. Use Key Vault for necessary secrets, keys, and certificates; never embed credentials in code, prompts, browser storage, or command lines. Managed Identity does not remove the need for authorization.
- **Connectivity:** choose public/private access, segmentation, and private endpoints from the threat model and data flows, including operational and DNS implications. Private connectivity is not a substitute for authentication or automatically the right design.
- **Data:** specify classification, permitted regions/data residency, retention/deletion, and backup handling. Keep secrets and sensitive payloads out of logs; define diagnostic access, redaction, and retention.
- **Cost:** estimate usage, assign owners, and define budgets, alerts, and response actions. Azure budgets **do not cap spending or stop consumption**.
- **Recovery:** define **RTO** (recovery time objective) and **RPO** (recovery point objective), then test restoration and failure scenarios against them. A backup policy without restore evidence is insufficient.
- **Delivery:** review IaC, identity scopes, policy checks, and deployment changes through explicit approval gates. Specify rollback, incident response, and operational ownership before release.

These are design prompts, not a complete security assessment or certification.

---

## Brownfield adoption checklist

Copy this into an issue and work through it:

- [ ] Baseline behavior/checks recorded; backups verified, including untracked/ignored files.
- [ ] Workspace, scripts, tool permissions, and data boundaries reviewed before agent execution.
- [ ] Review branch created manually; no history rewrite or destructive cleanup.
- [ ] Pinned CLI verified; safe initialization **or** separate integration-upgrade path chosen.
- [ ] Generated files, warnings, customizations, ignore rules, and inherited approvals inspected.
- [ ] Constitution reviewed against evidence and policy, with gaps explicit.
- [ ] Thin change specified or existing feature revised; active feature pointer confirmed.
- [ ] Clarifications resolved; plan preserves contracts and explains deviations.
- [ ] Tasks trace to requirements; consistency findings resolved; implementation reviewed in slices.
- [ ] Regression, negative-case, security, and human acceptance evidence reviewed.
- [ ] Recovery steps and team adoption criteria agreed; publication/deployment separately authorized.

---

## Further reading

- [01 — What is Spec-Driven Development](01-what-is-spec-driven-development.md)
- [02 — Spec Kit breakdown](02-spec-kit-breakdown.md)
- [03 — Walkthrough and lab](03-walkthrough-and-lab.md)
- [Project overview](../README.md)
**Frozen v1.0.1 implementation sources** (commit `9118ed15a0ba65053469a94c560ea5d233f75884`):

- [Upgrade guidance](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/docs/upgrade.md)
- [Copilot integration](https://github.com/github/spec-kit/tree/9118ed15a0ba65053469a94c560ea5d233f75884/src/specify_cli/integrations/copilot) and [upgrade implementation](https://github.com/github/spec-kit/blob/9118ed15a0ba65053469a94c560ea5d233f75884/src/specify_cli/integrations/_migrate_commands.py)
- [Bundled command templates](https://github.com/github/spec-kit/tree/9118ed15a0ba65053469a94c560ea5d233f75884/templates/commands)

**Live official guidance** (evolves independently of the pinned toolkit):

- [VS Code agent security](https://code.visualstudio.com/docs/agents/run/security), [approvals](https://code.visualstudio.com/docs/agents/run/approvals), and [Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)
- [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/) and [security principles](https://learn.microsoft.com/en-us/azure/well-architected/security/principles)
- [Microsoft Zero Trust](https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview)
- [Managed identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) and [Key Vault concepts](https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts)
- [Azure budgets and their limitations](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets)
