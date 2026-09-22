import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, validateState } from '../src/domain.js';
import { STORAGE_KEY, decodeState, loadState, saveState } from '../src/storage.js';

const id = (number) => `00000000-0000-4000-8000-${number.toString(16).padStart(12, '0')}`;
const book = (number = 1) => ({ id: id(number), title: 'Orbit', author: 'Ada', status: 'unread' });
const existing = { version: 1, books: [{ ...book(), status: 'read' }, book(2)] };
const saved = JSON.stringify(existing);

function fakeStorage(raw = saved) {
  const values = new Map([['unrelated', 'keep this exact value']]);
  if (raw !== null) values.set(STORAGE_KEY, raw);
  return {
    values, calls: [], readError: null, writeError: null,
    getItem(key) {
      this.calls.push(['get', key]);
      if (this.readError) throw this.readError;
      return this.values.has(key) ? this.values.get(key) : null;
    },
    setItem(key, value) {
      this.calls.push(['set', key, value]);
      if (this.writeError) throw this.writeError;
      this.values.set(key, value);
    },
    removeItem(key) { this.calls.push(['remove', key]); this.values.delete(key); },
    clear() { this.calls.push(['clear']); this.values.clear(); },
  };
}

function escapeHeavyState(targetLength) {
  const state = {
    version: 1,
    books: Array.from({ length: 200 }, (_, i) => ({
      ...book(i), title: 'x'.repeat(120), author: 'a'.repeat(80),
    })),
  };
  let remaining = targetLength - JSON.stringify(state).length;
  assert.ok(remaining >= 0);
  for (const entry of state.books) {
    entry.title = Array.from({ length: 120 }, () => {
      if (remaining >= 5) { remaining -= 5; return '\u0000'; }
      if (remaining > 0) { remaining -= 1; return '"'; }
      return 'x';
    }).join('');
  }
  assert.equal(remaining, 0);
  assert.equal(validateState(state), state);
  assert.equal(JSON.stringify(state).length, targetLength);
  return state;
}

test('S01 FR-002 key is exact; only null loads fresh empty states without writes', () => {
  assert.equal(STORAGE_KEY, 'booknook:v1');
  const storage = fakeStorage(null);
  const first = loadState(storage);
  const second = decodeState(null);
  assert.deepEqual(first, emptyState());
  assert.deepEqual(second, first);
  assert.notEqual(first, second);
  assert.notEqual(first.books, second.books);
  assert.deepEqual(storage.calls, [['get', STORAGE_KEY]]);
  assert.equal(storage.values.has(STORAGE_KEY), false);
  assert.equal(storage.values.get('unrelated'), 'keep this exact value');
});

test('S01 FR-002 load/save/refresh preserves exact books, status and order', () => {
  const storage = fakeStorage();
  const loaded = loadState(storage);
  assert.deepEqual(loaded, existing);
  assert.deepEqual(storage.calls, [['get', STORAGE_KEY]]);
  const candidate = {
    version: 1,
    books: [{ ...book(3), title: '<b>Orbit</b>', author: 'A  B' }, ...loaded.books],
  };
  const before = structuredClone(candidate);
  assert.equal(saveState(storage, candidate), undefined);
  assert.deepEqual(storage.calls[1], ['set', STORAGE_KEY, JSON.stringify(candidate)]);
  assert.deepEqual(loadState(storage), candidate);
  assert.deepEqual(candidate, before);
  assert.equal(storage.values.get('unrelated'), 'keep this exact value');
  assert.deepEqual(storage.calls.map(([operation]) => operation), ['get', 'set', 'get']);
});

test('S02 FR-006 all corrupt loads preserve original data and unrelated keys, with zero writes', () => {
  const invalidStates = [
    null, [], {}, { version: 1 }, { books: [] }, { version: 2, books: [] },
    { version: '1', books: [] }, { version: 1, books: [], extra: true },
    { version: 1, books: null }, { version: 1, books: [book(), book()] },
    { version: 1, books: Array.from({ length: 201 }, (_, i) => book(i)) },
  ];
  for (const key of ['id', 'title', 'author', 'status']) {
    const missing = book();
    delete missing[key];
    invalidStates.push({ version: 1, books: [missing] });
  }
  for (const patch of [
    { extra: true }, { status: 'invalid' }, { id: 'not-a-uuid' },
    { title: ' Orbit ' }, { author: false }, { title: '' },
  ]) invalidStates.push({ version: 1, books: [{ ...book(), ...patch }] });
  const invalidRaw = ['', ' ', '{broken', ...invalidStates.map((value) => JSON.stringify(value)),
    'x'.repeat(100001), undefined, 1, false, {}, new String(saved)];
  for (const raw of invalidRaw) {
    const storage = fakeStorage();
    storage.values.set(STORAGE_KEY, raw);
    const before = new Map(storage.values);
    assert.throws(() => loadState(storage), Error);
    assert.deepEqual(storage.values, before);
    assert.deepEqual(storage.calls, [['get', STORAGE_KEY]]);
  }
});

test('S02 FR-006 accepts 100000 UTF-16 units and rejects 100001 before JSON.parse; spy restored', (t) => {
  const boundary = saved.padEnd(100000, ' ');
  assert.deepEqual(decodeState(boundary), existing);
  const original = JSON.parse;
  const parse = t.mock.method(JSON, 'parse');
  try {
    assert.throws(() => decodeState(`${boundary} `), Error);
    assert.throws(() => decodeState({}), Error);
    assert.equal(parse.mock.callCount(), 0);
  } finally {
    parse.mock.restore();
  }
  assert.equal(JSON.parse, original);
  assert.deepEqual(decodeState(saved), existing);
});

test('S02 FR-006 schema-valid escaped output of exactly 100000 units saves and round-trips', () => {
  const candidate = escapeHeavyState(100000);
  const before = structuredClone(candidate);
  const storage = fakeStorage();
  assert.equal(saveState(storage, candidate), undefined);
  assert.equal(storage.values.get(STORAGE_KEY).length, 100000);
  assert.deepEqual(loadState(storage), candidate);
  assert.deepEqual(candidate, before);
  assert.deepEqual(storage.calls.map(([operation]) => operation), ['set', 'get']);
  assert.equal(storage.values.get('unrelated'), 'keep this exact value');
});

test('S02 FR-006 escaped output of 100001 units is rejected before write and preserves nonempty bytes', () => {
  const candidate = escapeHeavyState(100001);
  const before = structuredClone(candidate);
  const storage = fakeStorage();
  const bytes = new Map(storage.values);
  assert.throws(() => saveState(storage, candidate), Error);
  assert.deepEqual(storage.values, bytes);
  assert.deepEqual(storage.calls, []);
  assert.deepEqual(candidate, before);
});

test('S02 FR-006 invalid candidate is rejected before stringify or write; spy restored', (t) => {
  const storage = fakeStorage();
  const before = new Map(storage.values);
  const stringify = t.mock.method(JSON, 'stringify');
  try {
    for (const candidate of [null, { version: 2, books: [] }, { version: 1, books: [book(), book()] }]) {
      assert.throws(() => saveState(storage, candidate), Error);
    }
    assert.equal(stringify.mock.callCount(), 0);
  } finally {
    stringify.mock.restore();
  }
  assert.deepEqual(storage.values, before);
  assert.deepEqual(storage.calls, []);
});

test('S03 FR-006 serialization exceptions propagate unchanged without writing or modifying state', (t) => {
  const storage = fakeStorage();
  const before = new Map(storage.values);
  const candidate = structuredClone(existing);
  const failure = new Error('Injected serialization failure');
  const stringify = t.mock.method(JSON, 'stringify', () => { throw failure; });
  try {
    assert.throws(() => saveState(storage, candidate), (error) => error === failure);
  } finally {
    stringify.mock.restore();
  }
  assert.deepEqual(candidate, existing);
  assert.deepEqual(storage.values, before);
  assert.deepEqual(storage.calls, []);
});

test('S03 FR-006 read access failures propagate by identity and do not reset nonempty storage', () => {
  const storage = fakeStorage();
  const before = new Map(storage.values);
  const failure = new Error('Injected read access failure');
  storage.readError = failure;
  assert.throws(() => loadState(storage), (error) => error === failure);
  assert.deepEqual(storage.values, before);
  assert.deepEqual(storage.calls, [['get', STORAGE_KEY]]);
});

test('S03 FR-006 quota/security write failures preserve prior nonempty bytes, unrelated keys and candidate', () => {
  for (const name of ['QuotaExceededError', 'SecurityError']) {
    const storage = fakeStorage();
    const before = new Map(storage.values);
    const candidate = { version: 1, books: [book(3), ...existing.books] };
    const snapshot = structuredClone(candidate);
    const failure = new Error('Injected write failure');
    failure.name = name;
    storage.writeError = failure;
    assert.throws(() => saveState(storage, candidate), (error) => error === failure);
    assert.deepEqual(storage.values, before);
    assert.deepEqual(candidate, snapshot);
    assert.deepEqual(storage.calls, [['set', STORAGE_KEY, JSON.stringify(candidate)]]);
  }
});
