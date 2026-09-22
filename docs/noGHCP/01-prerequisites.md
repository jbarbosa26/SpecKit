# noGHCP: Manual workshop prerequisites

**No AI tools or accounts are needed.** Prepare these ordinary development
tools before the workshop; setup is outside the 390-minute lab budget.

## Tools

| Requirement | Preparation |
| --- | --- |
| Basic skills | Navigate folders, edit text, run terminal commands, and read basic JavaScript. The lab supplies templates and guided exercises. |
| Git | Install an approved current [Git release](https://git-scm.com/downloads). No GitHub account, remote repository, or publishing is required. |
| Node.js | Install the latest patched [Node.js 24 LTS](https://nodejs.org/en/download/); npm comes with it. Do not use end-of-life Node 20. |
| Editor | Any plain text/code editor. No extensions are required; leave AI assistance disabled for these exercises. |
| Shell | Windows: [PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows). macOS/Linux: Bash. Use one environment consistently; do not mix Windows and WSL paths/tools. |
| Browser | A current browser with DevTools and a disposable local profile, without account sign-in/sync. Use one app tab and fictional data. |
| Listener inspection | `Get-NetTCPConnection` on Windows, `ss` on Linux, or `lsof` on macOS, without elevation. |

You do **not** need Copilot, Claude Code, any other AI tool, Python, `uv`,
the Specify CLI, API credentials, an Azure subscription, or paid agent access.
Follow your organization's approved installation/proxy/certificate process.
Do not pipe downloaded scripts directly into a shell, bypass execution policy
or TLS checks, or run the workshop as administrator.

## Obtain the materials

Obtain a trusted copy of this repository from the instructor or an approved
checkout/download. Keep the following together:

```text
docs/noGHCP/
  README.md
  01-prerequisites.md
  02-hands-on-lab.md
  03-validation-and-handoff.md
  starter/
    package.json
    server.mjs
    index.html
    styles.css
    src/
    tests/
```

Also retain the starter's hidden `.gitignore`. If using a downloaded archive,
extract it first. Reading documents on a website is not a local starter copy.
The lab asks you for the **absolute path to the supplied `starter` folder**,
then copies only its application files into a new scratch project.

The starter has no package dependencies. Do not run `npm install`, install
global packages, download a framework, or fetch an AI-generated replacement.
Its supplied baseline already adds/lists/persists books; the exercises add the
missing status/filter and search behavior through your own edits.

## Preflight

Open an ordinary terminal. These commands only print installed versions:

```text
git --version
node --version
npm --version
```

**Expected:** each resolves, and Node prints `v24.x.x`. On Windows also run
`$PSVersionTable.PSVersion` and require PowerShell 7. If any tool is missing or
blocked, resolve that before class rather than changing machine policy.

Review the starter's `package.json` and scripts before execution. The allowed
application commands will be `npm test`, `npm run check`, and `npm start`,
using built-in Node functionality. There is no agent login, model configuration,
network API call, cloud setup, or automated specification generator.

## Ready to begin

- [ ] Git, patched Node 24, npm, and the chosen shell work.
- [ ] The documents and complete starter are available locally.
- [ ] You can edit ordinary files and inspect browser DevTools.
- [ ] A new scratch location and disposable unsynced browser profile are available.
- [ ] You can inspect a local listening socket without administrator privileges.
- [ ] You will use fictional inputs and disable AI assistance in your editor.

After this preparation the required lab can run offline. External reference
links are optional reading, not steps needed to finish. If working alone,
perform the written self-review checklists yourself and record remaining
uncertainty; do not invent a second reviewer's approval.

[noGHCP overview](./README.md) | [Next: manual hands-on lab](./02-hands-on-lab.md)
