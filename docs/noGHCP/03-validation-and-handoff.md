# noGHCP: Validate, change and hand off BookNook

[Series overview](./README.md) -> [01: Prework](./01-prerequisites.md) -> [02: Lab](./02-hands-on-lab.md) -> **03: Validation and handoff**

Continue in your CLI-initialized scratch `booknook-manual` project after Gate 4, not in the teaching repository. The supplied starter already implemented US1; you have manually implemented US2 status/filter behavior and changed `STATUS_FEATURE_ENABLED` to `true`. T05/T06 remain pending for the base validation and acceptance below; search is still absent. This document budgets **140 minutes**: checkpoint 5 (60), checkpoint 6 search (60), handoff (20). With document 02's 250 minutes, the total is **390**, excluding prework/breaks. These are facilitator budgets, not measured classroom results.

This track uses the official pinned Specify CLI for scaffolding and supported helpers, then [manual equivalents of the slash-command phases](./README.md#slash-command-phases-and-their-no-ai-equivalents): use your editor, browser and ordinary shells, with no AI tools or accounts. **Terminal A** runs only your foreground server. **Terminal B** runs checks and Git commands. Both use the scratch root; browser-console snippets run only in the disposable profile. No additional installation or application dependencies are needed. `.manual/commands/speckit.<phase>.md` files are guidance, not executable terminal slash commands; generated workflow definitions are not executed. Do not run `specify workflow run`, install extensions/presets, or publish tasks as issues.

Terminal commands labeled **all shells** work unchanged in **PowerShell 7,
Bash, and Windows Command Prompt (`cmd.exe`)**. Choose one shell's listener
check and HTTP probe below. Command Prompt still requires the PowerShell 7
installation from prework for Spec Kit helpers; see the
[shell conventions](../../README.md#command-line-shell-options).

**Confirm the active feature before editing:** inspect `.specify/feature.json` and the actual feature directory. The fresh lab requires `specs/001-booknook`; the pointer, not the current Git branch or a helper's legacy `BRANCH_NAME` label, identifies the selected feature. If the pointer is missing or selects another directory, stop and reconcile the intended workspace/feature before using the literal paths below. Do not blindly edit `001-booknook`, overwrite a changed pointer, or rerun initialization to conceal a mismatch.

Keep the six human-authored documents: `.specify/memory/constitution.md`, `specs/001-booknook/{spec,plan,tasks,quickstart}.md`, and `specs/001-booknook/checklists/requirements.md`. Preserve the reviewed generic `.manual` guidance and managed `.specify` scaffolding as well. The requirements checklist is human review; `check-prerequisites` checks structural file prerequisites, not semantic quality or acceptance. In `quickstart.md`, copy and fill this evidence row for each gate; use actual observations, never raw storage dumps:

```text
| FR / test or browser case | Command / action | Expected | Observed / date | Self or peer reviewer | Gap / next action |
| ... | ... | ... | NOT RUN | ... | ... |
```

Self-review is valid for a solo learner; a peer can independently reproduce results. Passing tests or reviewing documents does not certify security, accessibility or production readiness.

<a id="checkpoint-5"></a>
## Checkpoint 5: Validate the base - 60 minutes

Budget: server/listener 15, normal/keyboard 15, adversarial storage 25, review/index 5. Repair failures before proceeding; do not count setup faults as successful denials.

### Start, inspect the real listener, probe HTTP

**Terminal B - all shells, scratch root, baseline regression**
```text
npm test
npm run check
```
Require green supplied US1 tests and your US2 tests; a missing module or syntax error is a setup fault, not exercise evidence.

**Terminal A - all shells, scratch root**
```text
npm start
```
Leave A running. If port 4173 is occupied, stop only your earlier server using its terminal's Ctrl+C. Do not kill unknown processes, change ports or bind another interface. Continue checks in B.

**Terminal B - Windows PowerShell 7**
```powershell
$listeners = @(Get-NetTCPConnection -State Listen -LocalPort 4173 -ErrorAction Stop)
if ($listeners.Count -ne 1 -or $listeners[0].LocalAddress -ne '127.0.0.1') {
  throw 'Expected exactly one listener at 127.0.0.1:4173; stop and inspect.'
}
$listeners | Select-Object LocalAddress, LocalPort, OwningProcess
```
**Terminal B - Windows Command Prompt (`cmd.exe`)**
```cmd
netstat -ano | findstr /R /C:":4173 .*LISTENING"
```
**Terminal B - Linux Bash**
```bash
ss -ltnp 'sport = :4173'
```
**Terminal B - macOS Bash**
```bash
lsof -nP -iTCP:4173 -sTCP:LISTEN
```
**Gate:** exactly one listener at `127.0.0.1:4173`, correlated with your Node process. `*`, `0.0.0.0`, `::` or another address fails even if HTTP works. **Failure:** stop your server and repair binding; if inspection is unavailable, use an approved OS equivalent, not privilege elevation or HTTP success as binding proof. **Next:** run this raw-target probe (no extra file).

In Command Prompt, read **Local Address** and **PID**, not Foreign Address.
No matching row fails the gate. The command includes IPv4 and IPv6 listeners,
so an additional wildcard listener must not be ignored.

**Terminal B - PowerShell 7 or Bash**
```text
node --input-type=module -e "
import assert from 'node:assert/strict';
import { request } from 'node:http';
const probe=(path,method='GET',host='127.0.0.1:4173')=>new Promise((resolve,reject)=>{
  const req=request({hostname:'127.0.0.1',port:4173,path,method,headers:{Host:host}},res=>{
    let body=''; res.setEncoding('utf8'); res.on('data',part=>body+=part);
    res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));
  });
  req.on('error',reject); req.setTimeout(3000,()=>req.destroy(new Error('probe timeout'))); req.end();
});
const q=String.fromCharCode(39);
const expected=['default-src '+q+'none'+q,'script-src '+q+'self'+q,'style-src '+q+'self'+q,'connect-src '+q+'none'+q,'base-uri '+q+'none'+q,'form-action '+q+'none'+q,'frame-ancestors '+q+'none'+q].sort();
const headers=r=>{
  assert.deepEqual((r.headers['content-security-policy']||'').split(';').map(x=>x.trim()).filter(Boolean).sort(),expected);
  assert.equal(r.headers['x-content-type-options'],'nosniff');
  assert.equal(r.headers['referrer-policy'],'no-referrer');
};
for(const [path,type] of [['/','text/html'],['/index.html','text/html'],['/styles.css','text/css'],['/src/app.js','text/javascript'],['/src/domain.js','text/javascript'],['/src/storage.js','text/javascript']]){
  for(const method of ['GET','HEAD']){
    const r=await probe(path,method); assert.equal(r.status,200,path); headers(r);
    assert.equal(r.headers['content-type'],type+'; charset=utf-8');
    if(method==='HEAD') assert.equal(r.body,''); else assert.ok(r.body.length>0);
  }
}
for(const [path,method,host,status] of [
  ['/','POST','127.0.0.1:4173',405],['/','GET','localhost:4173',400],
  ['/','HEAD','attacker.invalid:4173',400],['/missing','HEAD','127.0.0.1:4173',404]]){
  const r=await probe(path,method,host); assert.equal(r.status,status); headers(r);
  if(status===405) assert.equal(r.headers.allow,'GET, HEAD');
  if(method==='HEAD') assert.equal(r.body,'');
}
for(const path of ['/package.json','/.git/config','/.env','/.specify/memory/constitution.md','/specs/','/../package.json','/%2e%2e/package.json','/index.html?x=1','/src/../index.html','/%69ndex.html','http://127.0.0.1:4173/index.html']){
  const r=await probe(path); assert.equal(r.status,404,path); headers(r);
}
console.log('PASS: routes, raw-target/Host/method denials, HEAD, MIME and headers');
"
```

Command Prompt cannot use the multiline quoted argument above. Use this
equivalent **single-line** probe instead; percent signs are constructed in
JavaScript so the shell cannot expand encoded paths as environment variables.

**Terminal B - Windows Command Prompt (`cmd.exe`)**
```cmd
node --input-type=module -e "import assert from 'node:assert/strict'; import { request } from 'node:http'; const probe=(path,method='GET',host='127.0.0.1:4173')=>new Promise((resolve,reject)=>{ const req=request({hostname:'127.0.0.1',port:4173,path,method,headers:{Host:host}},res=>{ let body=''; res.setEncoding('utf8'); res.on('data',part=>body+=part); res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body})); }); req.on('error',reject); req.setTimeout(3000,()=>req.destroy(new Error('probe timeout'))); req.end(); }); const q=String.fromCharCode(39),p=String.fromCharCode(37); const expected=['default-src '+q+'none'+q,'script-src '+q+'self'+q,'style-src '+q+'self'+q,'connect-src '+q+'none'+q,'base-uri '+q+'none'+q,'form-action '+q+'none'+q,'frame-ancestors '+q+'none'+q].sort(); const headers=r=>{ assert.deepEqual((r.headers['content-security-policy']||'').split(';').map(x=>x.trim()).filter(Boolean).sort(),expected); assert.equal(r.headers['x-content-type-options'],'nosniff'); assert.equal(r.headers['referrer-policy'],'no-referrer'); }; for(const [path,type] of [['/','text/html'],['/index.html','text/html'],['/styles.css','text/css'],['/src/app.js','text/javascript'],['/src/domain.js','text/javascript'],['/src/storage.js','text/javascript']]){ for(const method of ['GET','HEAD']){ const r=await probe(path,method); assert.equal(r.status,200,path); headers(r); assert.equal(r.headers['content-type'],type+'; charset=utf-8'); if(method==='HEAD') assert.equal(r.body,''); else assert.ok(r.body.length>0); } } for(const [path,method,host,status] of [['/','POST','127.0.0.1:4173',405],['/','GET','localhost:4173',400],['/','HEAD','attacker.invalid:4173',400],['/missing','HEAD','127.0.0.1:4173',404]]){ const r=await probe(path,method,host); assert.equal(r.status,status); headers(r); if(status===405) assert.equal(r.headers.allow,'GET, HEAD'); if(method==='HEAD') assert.equal(r.body,''); } for(const path of ['/package.json','/.git/config','/.env','/.specify/memory/constitution.md','/specs/','/../package.json','/'+p+'2e'+p+'2e/package.json','/index.html?x=1','/src/../index.html','/'+p+'69ndex.html','http://127.0.0.1:4173/index.html']){ const r=await probe(path); assert.equal(r.status,404,path); headers(r); } console.log('PASS: routes, raw-target/Host/method denials, HEAD, MIME and headers');"
```

**Gate:** PASS/exit zero; inspect error bodies for no file paths, stacks or file contents. Unit server tests must additionally cover missing/repeated Host and parser rejection. The probe's well-formed requests reach the application handler, whose errors need security headers; malformed requests rejected by Node's parser need rejection/no disclosure, not those headers. **Failure:** repair the contract/tests and rerun, never relax the allowlist. **Next:** browser evidence.

### Normal use and keyboard evidence

Create a **disposable, unsigned-in, unsynced browser profile**, one application tab at exactly **`http://127.0.0.1:4173`**, not localhost. Keep the profile across reloads. No real data or concurrent-tab claims.

| Browser action, in order | Required observation |
| --- | --- |
| Open with no saved key | Genuine empty-library message, no corruption error |
| Tab to title/author, add fictional `Orbit` / `Ada` | Trimmed values, unread status, visible focus, polite success |
| Add `Harbor` / `Bo`, then another `Orbit` / `Ada` | Newest first, duplicates allowed, three distinct IDs |
| Toggle either way; choose all/unread/read | Correct ordered subset, only chosen book changes |
| Refresh with non-default filter | Same books/status/order; filter resets to all |
| Submit blank/whitespace values, then correct | Associated field error, no new book, usable focus/input |
| Make all unread; choose read | No-match message distinct from empty library |
| Inspect Network/DOM/accessibility tree | Only local allowlisted assets; labels, field associations, polite live region |

Use Tab/Shift+Tab and Enter/Space for **every** action, including toggles and correction; check visible/useful focus and no traps after rerendering. Record keyboard/tree versus actual screen-reader testing honestly. A denied automatic `/favicon.ico` request is acceptable, not an allowlist expansion. **Gate:** observe all results, not just absence of console errors. **Failure:** fix and repeat. **Next:** bounded adversarial fixtures.

### Consent, limits and inert text

Read/type every console fixture; **never bypass DevTools paste protection**. If paste is blocked, type reviewed code or use the storage editor where suitable. Every fixture intentionally modifies only fictional app data at this origin. Create a fictional sentinel key `booknook-lab-sentinel` = `unchanged` in the storage editor; it must survive every fixture/reset. Before each independent fixture, record evidence then use this explicit, key-only reset; refusal means stop that fixture. Never clear the profile/site/all storage.

**Browser console - scoped reset with consent**
```javascript
if (location.origin !== 'http://127.0.0.1:4173') throw new Error('Wrong origin');
if (confirm('Discard ONLY booknook:v1 fictional data in this disposable profile?')) {
  localStorage.removeItem('booknook:v1');
  location.reload();
}
```
**Browser console - seed 199 valid books after reset**
```javascript
if (location.origin !== 'http://127.0.0.1:4173') throw new Error('Wrong origin');
localStorage.setItem('booknook:v1', JSON.stringify({
  version: 1, books: Array.from({ length: 199 }, (_, i) => ({
    id: `${i.toString(16).padStart(8, '0')}-0000-4000-8000-000000000000`,
    title: `Fiction ${i + 1}`, author: 'Lab Author', status: 'unread'
  }))
}));
location.reload();
```
Add book 200 through the form: accepted. Attempt 201: visible cap error, 200 books/unchanged storage and entered values, no eviction; toggle/filter still work. After a reset, repeat the fixture with length **201**: persisted over-cap data must show a load error, block add/toggle and preserve bytes, not truncate.

Reset. Directly enter title `<img src=x onerror=alert(1)>`, author `<b>Lab</b>`. Require literal text, no injected `img`/`b`, dialog or `x` request, before/after refresh. CSP blocking execution alone is insufficient; inspect DOM nodes and `textContent` rendering code.

**Browser console - separate schema-valid persisted tampering after reset**
```javascript
if (location.origin !== 'http://127.0.0.1:4173') throw new Error('Wrong origin');
localStorage.setItem('booknook:v1', JSON.stringify({ version: 1, books: [{
  id: '11111111-1111-4111-8111-111111111111',
  title: '<img src=x onerror=alert(1)>', author: '<b>Lab</b>', status: 'unread'
}]}));
location.reload();
```
Require the same inert DOM. Then use the storage editor to add an unexpected book field and reload: accessible corruption error, blocked mutations and unchanged raw value; no field stripping or successful empty state. Repeat with an extra top-level field.

After separate consented resets, set the key to empty text, malformed `{`, wrong version, duplicate IDs and invalid status; reload each. Every case must visibly block writes and retain the original bytes. Only removal of the key yields a ready empty library. Record named tests for missing/extra keys/types, saved trimming, UUID case/version/variant, title 1/120/121 and author 1/80/81, and `'\u{1f600}'.repeat(60)` versus 61 UTF-16 titles. Also review positive/negative 100000/100001 raw-input and escaped-output tests: pre-parse bound, no failed-save write, prior nonempty data/unrelated keys/input preserved. Unit tests supplement, not replace, the UI gate.

**Gate:** each applicable UI result and boundary test is recorded. **Failure:** retain corrupt bytes while diagnosing; do not reset until preservation evidence is captured. **Next:** failures without corruption.

### Storage failures: observable UI, not just fake-adapter tests

Reset with consent, add `Orbit` / `Ada`, and note displayed/stored values locally without sharing dumps. Verify the sentinel still exists.

**Browser console - scoped write failure**
```javascript
(() => {
  if (location.origin !== 'http://127.0.0.1:4173') throw new Error('Wrong origin');
  const original = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    if (key === 'booknook:v1') throw new DOMException('Lab write failure', 'QuotaExceededError');
    return original.call(this, key, value);
  };
})();
```
Try add and toggle: accessible errors, prior books/status/order/storage unchanged, entered values preserved, no success. Reload removes the override; verify the original data/sentinel and explicitly retry an action, which should now save. No automatic retry/reset.

For the next two cases separately, set a Sources breakpoint at the **first startup storage access** in `src/app.js`, reload, pause before access, then inject the relevant failure. Never inject after load and call that startup evidence.

**Browser console - while paused, read failure**
```javascript
(() => {
  if (location.origin !== 'http://127.0.0.1:4173') throw new Error('Wrong origin');
  const original = Storage.prototype.getItem;
  Storage.prototype.getItem = function (key) {
    if (key === 'booknook:v1') throw new DOMException('Lab read failure', 'SecurityError');
    return original.call(this, key);
  };
})();
```
Resume; require accessible load error and blocked add/toggle, no writable empty fallback or overwritten data. Remove breakpoint/reload to restore; verify original books and sentinel. Repeat the pause/reload sequence for the property itself:

**Browser console - while paused, property-access failure**
```javascript
if (location.origin !== 'http://127.0.0.1:4173') throw new Error('Wrong origin');
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  get() { throw new DOMException('Lab storage access denied', 'SecurityError'); }
});
```
Resume: same load-error/write-blocking UI, not an uncaught exception. Remove breakpoint and reload; verify preserved books/sentinel. **Gate:** record each visible failure and restored result. **Failure:** uncertain injection timing is not a pass; repeat with careful self-review or a peer. Fix failures and rerun affected browser checks, the HTTP probe, `npm test` and `npm run check` in B.

### Preserve a reviewed no-commit index baseline

Review DOM sinks, storage catches, all three test files, server map and package scripts (`start`, `test`, `check` only; no dependencies). Map FR-001..010 to actual evidence in `quickstart.md`; preserve the US2 red/green record from document 02 and leave unfinished items pending. Reconcile the human requirements review in `checklists/requirements.md`. Only after base approval inspect files for secrets and stage the explicit list below in the scratch project.

In **`specs/001-booknook/tasks.md`**, mark **T05** complete only after the test, syntax, browser and security regressions above pass with observed evidence in **`specs/001-booknook/quickstart.md`**. Then self-review or peer-review the evidence and remaining limits before accepting US2 and marking **T06** complete. Record the reviewer and acceptance decision before staging. If a required check is missing or fails, keep the corresponding task pending and repair/repeat it; do not create the index baseline or start CR-001 yet.

Review `.manual`, `.specify`, and `specs` contents before staging, including hidden files. Keep shared command guidance, templates, scripts, memory, default workflow definitions, and configuration/init/integration metadata and manifests trackable. A data-only guidance or workflow file is not executed merely because it is tracked. Preserve the managed `.specify/.gitignore`, which excludes the machine-local feature pointer.

**Terminal B - all shells: inspect before staging**
```text
git check-ignore .specify/feature.json
git status --short --untracked-files=all
git status --short --ignored
```
**Gate:** `git check-ignore` prints `.specify/feature.json`, and it is not already tracked. If not, stop and inspect the managed ignore file and index before staging. Review unexpected files individually; do not force-add the pointer or hide unexplained files with broad new ignore patterns.

**Terminal B - all shells: stage the reviewed baseline**
```text
git add -- .gitignore .manual .specify specs package.json server.mjs index.html styles.css src/domain.js src/storage.js src/app.js tests/domain.test.js tests/storage.test.js tests/server.test.js
git ls-files --cached
git --no-pager diff --cached --stat
git --no-pager diff --cached
git --no-pager diff --exit-code
git status --short
```
**Gate 5:** the index contains `.gitignore`, the six named human-authored documents, the reviewed generic `.manual` guidance and managed shared `.specify` scaffolding/metadata, and the ten explicitly listed application/test files. It does not contain `.specify/feature.json`, secrets, or unexplained extras. The six authored documents are not the whole generated-file inventory. The staged diff is the reviewed US1+US2 base; the unstaged diff exits zero, with no unexplained untracked files. Inspect directories before staging; never `git add .`. Staging is neither publishing nor durable history/browser backup. **Failure:** inspect unexplained files/changes, do not hide them. **Next:** preserve this index unchanged throughout CR-001; no further staging, commits or pushes.

Stop your server with Ctrl+C in A before the change.

<a id="checkpoint-6"></a>
## Checkpoint 6: Search and handoff - 80 minutes

Search budget (60 minutes): artifacts/review 20, red/implementation 20, regression 15, acceptance 5; handoff uses the remaining 20 minutes below. Extend the existing feature by hand, not a new directory or architecture. Reconfirm `.specify/feature.json` still selects `specs/001-booknook`. CR-001 is an amendment: do not rerun `specify init`, `create-new-feature`, `setup-plan`, or `setup-tasks`, and do not recopy templates over reviewed artifacts. These are manual phase equivalents, not native slash-command execution.

### Write and review the change before code

In your editor, append this editable template to **`specs/001-booknook/spec.md`**. Fill the rationale/reviewer, read each decision, and write why literal matching and non-persistence suit this local demo.

```text
## CR-001: US3 / FR-011 - Search
Rationale: [human explanation of the need and chosen scope]
US3: As a reader, I want to find books by title or author while retaining my
status filter, so that I can narrow my reading list without changing it.
FR-011: Trim a string query; use literal case-insensitive title OR author
substring matching, AND the selected status. Blank query matches all books
allowed by status. Preserve order; return a fresh array without mutating state.
Decisions: defaults remain status='all', query=''; reject invalid state/options,
unknown option keys, invalid status and non-string query. Use simple toLowerCase,
not regex, fuzzy matching or locale/accent folding. Never persist query/filter.
Given Orbit/Ada is read and newer Harbor/Bo is unread:
- When query is " ORB " or "ADA", then only Orbit matches.
- When query is "ada" AND status is unread, then nothing matches.
- When query is whitespace AND status is unread, then only Harbor matches.
- When query is "o" AND status is all, then Harbor precedes Orbit.
- When query is ".*", then neither matches; punctuation is literal.
- When both controls are cleared/reset, then both books appear in saved order.
Given saved books, when reloading, then books/status remain but query/filter reset.
Given no matches, then provide polite text distinct from a truly empty library;
never hide a load/save error. Search must be labeled and keyboard accessible.
Unchanged: FR-001..010, exact schema/key/bounds, scripts, routes and file list.
Decision explanation / self or peer reviewer / unresolved questions: [...]
```

Revise **`plan.md`** by hand: allow only `status` and `query` in `selectBooks` options; describe the combined predicate and default compatibility. Change only `src/domain.js`, `tests/domain.test.js`, `index.html` and `src/app.js`; query stays in UI memory. Reuse safe rendering, focus, no-match/live feedback and the failed-load readiness gate. No server/storage/other domain API changes.

Append these dependency tasks to **`tasks.md`**; retain earlier completed tasks. Add matching pending evidence rows to **`quickstart.md`**, not fabricated passes.

```text
- [ ] CR1 / FR-011: review US3 decisions and spec/plan/test traceability.
- [ ] CR2 / FR-011, after CR1: append D06 below; run and record behavioral red.
- [ ] CR3 / FR-011, after CR2: derive/implement selection; run D06 and base tests.
- [ ] CR4 / FR-008/010/011, after CR3: wire labeled search and run browser B07.
- [ ] CR5 / FR-001..011, after CR4: repeat security/regressions; review diff/evidence.
```

**Pre-code gate:** self-review or peer-review every FR-011 decision against D06 and B07 below. Check FR-004 filtering, FR-006 error preservation, FR-008 keyboard access and FR-010 messages remain covered. Update `checklists/requirements.md` with the human review of this amendment; record reviewer, gaps and resolutions without treating a helper's successful exit as quality evidence. In B run `git --no-pager diff` and `git status --short`: only manual artifacts should have changed so far. Resolve contradictions before writing tests or implementation.

### Observe red, then write the predicate

Append this **independent** test to the existing file, not a fourth test file. It uses the starter's existing top-level `test` import; all other imports and identifiers are scoped inside the callback, so existing assertion imports or UUID constant names do not matter.

**File content - append to `tests/domain.test.js`**
```javascript
test('FR-011: title OR author search AND status, ordered and immutable', async () => {
  const assert = (await import('node:assert/strict')).default;
  const { emptyState, addBook, setStatus, selectBooks } = await import('../src/domain.js');
  const id1 = '11111111-1111-4111-8111-111111111111';
  const id2 = '22222222-2222-4222-8222-222222222222';
  const id3 = '33333333-3333-4333-8333-333333333333';
  const first = addBook(emptyState(), { title: 'Orbit', author: 'Ada' }, id1);
  const state = addBook(setStatus(first, id1, 'read'), { title: 'Harbor', author: 'Bo' }, id2);
  const before = structuredClone(state);
  assert.deepEqual(selectBooks(state, { query: ' ADA ' }).map(b => b.id), [id1]);
  assert.deepEqual(selectBooks(state, { query: ' ORB ' }).map(b => b.id), [id1]);
  assert.deepEqual(selectBooks(state, { status: 'unread', query: 'ada' }), []);
  assert.deepEqual(selectBooks(state, { status: 'read', query: 'ada' }).map(b => b.id), [id1]);
  assert.deepEqual(selectBooks(state, { status: 'unread', query: ' ' }).map(b => b.id), [id2]);
  assert.deepEqual(selectBooks(state, { query: 'o' }).map(b => b.id), [id2, id1]);
  for (const options of [undefined, {}, { query: '' }, { query: '   ' }]) {
    const selected = selectBooks(state, options);
    assert.deepEqual(selected, state.books);
    assert.notStrictEqual(selected, state.books);
    assert.notStrictEqual(selectBooks(state, options), selected);
  }
  for (const query of ['absent', '.*']) assert.deepEqual(selectBooks(state, { query }), []);
  const literal = addBook(state, { title: 'Literal .*', author: 'Cy' }, id3);
  assert.deepEqual(selectBooks(literal, { query: '.*' }).map(b => b.id), [id3]);
  assert.deepEqual(selectBooks(emptyState(), { query: 'o' }), []);
  for (const options of [null, [], 4, 'o', new Date(0), new Map(),
    Object.create({ status: 'read' }), { extra: true }, { status: 'done' },
    { query: null }, { query: 4 }, { query: [] }, { [Symbol('extra')]: true }]) {
    assert.throws(() => selectBooks(state, options), Error);
  }
  assert.throws(() => selectBooks({ ...state, version: 2 }, { query: 'o' }), Error);
  assert.deepEqual(state, before);
});
```
**Terminal B:** run `node --test tests/domain.test.js`, then `npm test`. **Red gate:** record the FR-011 failure from the base rejecting `query`; prior cases remain green. Missing imports/syntax errors are setup faults. If search already passes, investigate and record the premature implementation, not invented red.

Keep all supplied baseline and US2 tests unchanged: this exercise only appends D06. The baseline tests remain valid after search is implemented; no existing assertion needs editing or deletion.

**Attempt first:** in `src/domain.js`, write your own replacement for `selectBooks`. Derive two booleans from the spec: status matches **AND** (title matches **OR** author matches). Validate before normalizing; normalize the query once, not stored books. Explain why a blank substring matches every string and why `filter` preserves order while returning a new array. Keep options validation: a plain or null-prototype record, only `status`/`query` keys, valid status, string query. Do not change any other domain API.

<details>
<summary>Optional reference solution - open after attempting and explaining your predicate</summary>

Replace the whole existing exported function, not the entire module. `validateState` is already in module scope. Defaults preserve old calls; `Reflect.ownKeys` also rejects unknown symbol keys. Compare this implementation with your decisions and tests rather than treating a copied answer as evidence.

```javascript
export function selectBooks(state, options = {}) {
  validateState(state);
  if (options === null || typeof options !== 'object' || Array.isArray(options) ||
      Reflect.ownKeys(options).some(key => key !== 'status' && key !== 'query')) {
    throw new Error('Invalid selection options');
  }
  const prototype = Object.getPrototypeOf(options);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error('Expected plain selection options');
  }
  const { status = 'all', query = '' } = options;
  if (!['all', 'unread', 'read'].includes(status) || typeof query !== 'string') {
    throw new Error('Invalid status or query');
  }
  const needle = query.trim().toLowerCase();
  return state.books.filter(book => {
    const statusMatches = status === 'all' || book.status === status;
    const textMatches = book.title.toLowerCase().includes(needle) ||
      book.author.toLowerCase().includes(needle);
    return statusMatches && textMatches;
  });
}
```

</details>

**Terminal B:** rerun `node --test tests/domain.test.js`, `npm test` and `npm run check`. Record D06 red -> green and regression results in `quickstart.md`. Do not remove old tests or weaken assertions to get green.

### Wire the search UI by hand

Make these exact edits in the supplied starter. Keep `let state = emptyState();`, `let ready = false;` and Gate 4's `STATUS_FEATURE_ENABLED = true`. Reuse the existing `render()` and `updateControls()` functions; do not reimplement storage or status handlers.

1. In `index.html`, immediately after the status-filter control's closing `</select>`, add the following, outside the add-book form. The input starts disabled until a successful load.

```html
<label for="search-query">Search title or author</label>
<input id="search-query" type="search" disabled>
```

2. In `src/app.js`, replace `let filter = 'all';` with:

```javascript
let filter = 'all';
let query = '';
```

Immediately after `const statusFilter = document.getElementById('status-filter');`, add:

```javascript
const searchInput = document.querySelector('#search-query');
```

3. In `updateControls()`, add `searchInput.disabled = !ready;` immediately after `title.disabled = !ready;`. In `render()`, replace `const books = selectBooks(state, { status: filter });` with:

```javascript
const books = selectBooks(state, { status: filter, query });
```

Keep the rest of `render()` unchanged: list construction, `textContent`, empty/no-match messages and useful focus handling. Never render an empty-success message over a load error.
4. Immediately before the first standalone `updateControls();` call, after the status-filter listener, add:

```javascript
searchInput.addEventListener('input', () => {
  if (!ready) return;
  query = searchInput.value;
  render();
  if (!formError.textContent) {
    statusMessage.textContent = emptyMessage.hidden
      ? 'Library view updated. Saved data is unchanged.'
      : emptyMessage.textContent;
  }
});
```

The supplied status-filter listener already preserves outstanding errors and announces empty/no-match results; leave it unchanged. The new search listener follows the same rule, never saves or clears form input, and uses the `ready` guard and `updateControls()` to remain blocked after failed startup loading. Do not add a second state or storage path.

### B07: search acceptance and unchanged safety

In B run `npm test` and `npm run check`; in A run `npm start`. In B repeat checkpoint 5's listener check and HTTP probe. In the disposable profile, reset only with consent, then add `Orbit`/`Ada` (toggle to read) followed by `Harbor`/`Bo` (unread).

| Action, using the keyboard | Required observation |
| --- | --- |
| Tab to labeled search; type ` ORB `, then `ADA` | Only Orbit; focus stays in search while typing |
| Keep `ada`; set status to unread | Polite no-match text, not empty-library or storage-error replacement |
| Replace query with spaces, status still unread | Only Harbor |
| Set all and query `o` | Harbor then Orbit |
| Clear search and set all; try `.*`, then `absent` | Both in order when cleared; neither for either literal nonmatch |
| Leave a non-default query/filter, reload | Empty search and all filter; saved books/status/order unchanged |
| Inspect `booknook:v1` before/after search/filter | Same raw value, exact version/books schema; no query/filter fields |

Repeat checkpoint 5's keyboard, limits, direct/persisted inert-text, corruption and property/read/write-failure gates. On failed load, search remains disabled; on failed save, searching/filtering must preserve the error and committed books/input. Verify no remote assets. **Gate 6:** record D06/B07/base/security evidence and reviewer; inspect `git --no-pager diff` for only approved CR-001 changes. **Failure:** repair and repeat; mark incomplete rather than erasing tests or replacing the index. **Next:** handoff.

<a id="handoff"></a>
## Handoff - 20 minutes (checkpoint 6's final segment)

Budget: evidence 8, demonstration/review 7, shutdown/reflection 5.

**Terminal B - all shells, while A still serves**
```text
npm test
npm run check
git --no-pager diff --check
git --no-pager diff --cached --check
git status --short
git --no-pager diff --cached
git --no-pager diff
```
The **staged** diff shows the base; the **unstaged** diff shows CR-001 against it. Review both and all untracked files separately; neither diff alone is the whole project. Do not stage the change or commit/push.

- The six human-authored documents agree, including the requirements checklist; spec decisions, plan contracts and dependency tasks map FR-001..011 to actual test/browser/security evidence, self/peer reviewers and explicit remaining gaps. Shared generated scaffolding remains reviewed and tracked; the local feature pointer remains ignored.
- Exactly ten app/test files and three npm scripts; no dependencies/install step. Red evidence is behavioral, not missing modules; analysis/checklists never substitute for execution.
- Explain save-before-display, strict bounded schema, failed-load write blocking, inert rendering, real listener/Host/route/header controls and their limits.
- Demonstrate a cold restart: Ctrl+C **your** server in A, run `npm start` in A, repeat listener/probe checks in B and demonstrate add/toggle/search at the exact origin.
- No production/WCAG certification, encryption/backup, multi-tab conflict handling, multi-user isolation or cloud deployment is claimed. A real-data service requires redesign and review.

**Manual equivalent of `/speckit.converge` (reference label, not a terminal command):** reconcile FR-001..011, the constitution, spec, plan, tasks, and requirements checklist with the actual test/browser/security evidence in `quickstart.md`. Distinguish missing evidence from a demonstrated defect. Only if gaps remain, append new **pending** remediation tasks with requirement IDs, dependencies, and the required recheck; preserve earlier tasks and evidence. Record no additional work when the review finds none, without claiming certification. This is human assessment, not native semantic analysis or automatic code writing. Any later repair needs a separate reviewed implementation slice and regression checks; do not silently change the application or the staged base during handoff.

**Final gate:** you or a peer can follow recorded evidence and reproduce the demo. **Failure:** list unfinished work and the last verified gate, not a fabricated pass. Stop only your foreground server with Ctrl+C in A, then close the disposable profile. Preserve scratch artifacts/index; no broad deletion or Git reset.

After the required tools and workshop materials are available, these CLI-initialized manual exercises run locally offline. No AI service/account, workflow execution, commit or publication is required. These instructions are not a claim that browser checks or a classroom rehearsal occurred. Return to the [noGHCP overview](./README.md).
