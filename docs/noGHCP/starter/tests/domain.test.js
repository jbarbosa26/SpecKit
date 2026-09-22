import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, validateState, addBook, setStatus, selectBooks } from '../src/domain.js';

const id = (number) => `00000000-0000-4000-8000-${number.toString(16).padStart(12, '0')}`;
const book = (number = 1) => ({ id: id(number), title: 'Orbit', author: 'Ada', status: 'unread' });
const library = (count) => ({ version: 1, books: Array.from({ length: count }, (_, i) => book(i)) });

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

test('D01 FR-001 emptyState returns distinct states and arrays', () => {
  const first = emptyState();
  const second = emptyState();
  assert.deepEqual(first, { version: 1, books: [] });
  assert.deepEqual(second, first);
  assert.notEqual(second, first);
  assert.notEqual(second.books, first.books);
  first.books.push(book());
  assert.equal(second.books.length, 0);
});

test('D01 FR-001 add trims only input, prepends unread, permits duplicate text and is immutable', () => {
  const state = freeze({ version: 1, books: [book()] });
  const input = freeze({ title: ' \tOrbit\n', author: ' Ada ' });
  const next = addBook(state, input, id(2));
  assert.deepEqual(next, { version: 1, books: [book(2), book()] });
  assert.notEqual(next, state);
  assert.notEqual(next.books, state.books);
  assert.deepEqual(state, { version: 1, books: [book()] });
  assert.deepEqual(input, { title: ' \tOrbit\n', author: ' Ada ' });
  assert.equal(validateState(next), next);
  const literal = addBook(emptyState(), { title: '<b>Orbit</b>', author: 'A  B' }, id(3));
  assert.equal(literal.books[0].title, '<b>Orbit</b>');
  assert.equal(literal.books[0].author, 'A  B');
});

test('D01 FR-001 accepts 1/120 title and 1/80 author UTF-16 units', () => {
  for (const [title, author] of [
    ['X', 'A'], ['x'.repeat(120), 'a'.repeat(80)],
    ['\u{1f680}'.repeat(60), '\u{1f680}'.repeat(40)],
    [' x ', ' a '],
  ]) {
    const next = addBook(emptyState(), { title, author }, id(1));
    assert.equal(next.books[0].title, title.trim());
    assert.equal(next.books[0].author, author.trim());
  }
});

test('D01 FR-001 rejects invalid fields, shapes and lengths without mutation', () => {
  const state = freeze(library(1));
  const invalid = [
    null, undefined, [], '', {}, { title: 'X' }, { author: 'A' },
    { title: 'X', author: 'A', extra: true },
    { title: '', author: 'A' }, { title: ' \n\t', author: 'A' },
    { title: 'X', author: '' }, { title: 'X', author: '\t ' },
    { title: 'x'.repeat(121), author: 'A' },
    { title: 'X', author: 'a'.repeat(81) },
    { title: '\u{1f680}'.repeat(61), author: 'A' },
    { title: 'X', author: '\u{1f680}'.repeat(41) },
    { title: 1, author: 'A' }, { title: 'X', author: false },
    { title: new String('X'), author: 'A' },
  ];
  for (const input of invalid) {
    freeze(input);
    assert.throws(() => addBook(state, input, id(2)), Error);
  }
  assert.deepEqual(state, library(1));
  assert.throws(() => addBook({ version: 2, books: [] }, { title: 'X', author: 'A' }, id(2)), Error);
});

test('D01/D02 FR-001 FR-006 enforce lowercase v4 UUID type, length, version and variant', () => {
  const input = { title: 'X', author: 'A' };
  for (const variant of ['8', '9', 'a', 'b']) {
    const validId = `abcdef01-2345-4678-${variant}abc-0123456789ab`;
    const next = addBook(emptyState(), input, validId);
    assert.equal(next.books[0].id, validId);
    assert.equal(validateState(next), next);
  }
  const invalid = [
    '', null, 1, new String(id(1)), id(1).slice(1), `${id(1)}x`, `${id(1)}\n`,
    ` ${id(1)}`, `${id(1)} `, id(1).replaceAll('-', ''),
    'ABCDEF01-2345-4678-8abc-0123456789ab',
    'abcdef01-2345-3678-8abc-0123456789ab',
    'abcdef01-2345-4678-7abc-0123456789ab',
    'abcdef01-2345-4678-cabc-0123456789ab',
    'gbcdef01-2345-4678-8abc-0123456789ab',
  ];
  for (const badId of invalid) {
    assert.throws(() => addBook(emptyState(), input, badId), Error);
    assert.throws(() => validateState({ version: 1, books: [{ ...book(), id: badId }] }), Error);
  }
  const prior = freeze(library(1));
  assert.throws(() => addBook(prior, input, id(0)), Error);
  assert.deepEqual(prior, library(1));
});

test('D02 FR-006 accepts valid saved states unchanged, including read status and record objects', () => {
  const state = freeze({ version: 1, books: [book(), { ...book(2), status: 'read' }] });
  assert.equal(validateState(state), state);
  const record = Object.assign(Object.create(null), { version: 1, books: [] });
  assert.equal(validateState(record), record);
});

test('D02 FR-006 rejects malformed state and book schemas without normalization or mutation', () => {
  const invalid = [
    null, undefined, [], 'state', 1, {},
    { version: 1 }, { books: [] }, { version: '1', books: [] },
    { version: 2, books: [] }, { version: 1, books: null },
    { version: 1, books: {} }, { version: 1, books: [], extra: true },
    { version: 1, books: [null] }, { version: 1, books: [[]] },
    { version: 1, books: new Array(1) },
    { version: 1, books: [book(), book()] },
  ];
  for (const key of ['id', 'title', 'author', 'status']) {
    const missing = book();
    delete missing[key];
    invalid.push({ version: 1, books: [missing] });
  }
  for (const patch of [
    { extra: true }, { title: ' Orbit' }, { title: 'Orbit\n' },
    { author: ' Ada ' }, { title: '' }, { author: '' },
    { title: 1 }, { author: null }, { status: 'READ' }, { status: '' },
    { status: false }, { title: 'x'.repeat(121) }, { author: 'x'.repeat(81) },
  ]) invalid.push({ version: 1, books: [{ ...book(), ...patch }] });
  for (const value of invalid) {
    const before = structuredClone(value);
    freeze(value);
    assert.throws(() => validateState(value), Error);
    assert.deepEqual(value, before);
  }
});

test('D02 FR-006 fields must be own keys; symbol and non-enumerable extras are rejected', () => {
  const inherited = Object.create({ version: 1, books: [] });
  assert.throws(() => validateState(inherited), Error);
  assert.throws(() => validateState(new Date()), Error);
  const extraState = { ...emptyState(), [Symbol('extra')]: true };
  assert.throws(() => validateState(extraState), Error);
  const extraBook = book();
  Object.defineProperty(extraBook, 'extra', { value: true });
  assert.throws(() => validateState({ version: 1, books: [extraBook] }), Error);
  assert.throws(() => addBook(emptyState(), { title: 'X', author: 'A', [Symbol()]: 1 }, id(1)), Error);
});

test('D05 FR-005 accepts 199 to 200, rejects 201st and oversized saved state without mutation', () => {
  const prior = freeze(library(199));
  const next = addBook(prior, { title: 'Final book', author: 'Ada' }, id(199));
  assert.equal(next.books.length, 200);
  assert.equal(next.books[0].id, id(199));
  assert.deepEqual(next.books.slice(1), prior.books);
  assert.equal(validateState(next), next);
  freeze(next);
  assert.throws(() => addBook(next, { title: 'Too many', author: 'Ada' }, id(200)), Error);
  assert.equal(next.books.length, 200);
  assert.deepEqual(prior, library(199));
  const oversized = freeze(library(201));
  assert.throws(() => validateState(oversized), Error);
  assert.deepEqual(oversized, library(201));
});

test('US1 selection: default/all return fresh arrays in saved order without mutation', () => {
  const state = freeze({ version: 1, books: [book(2), { ...book(1), status: 'read' }] });
  for (const options of [undefined, {}, { status: 'all' }, { status: undefined }]) {
    const selected = selectBooks(state, options);
    assert.deepEqual(selected, state.books);
    assert.notEqual(selected, state.books);
    selected.pop();
    assert.equal(state.books.length, 2);
  }
  const empty = emptyState();
  assert.deepEqual(selectBooks(empty), []);
  assert.notEqual(selectBooks(empty), empty.books);
});

test('US1 selection validates state, status and unknown option keys', () => {
  assert.throws(() => selectBooks({ version: 2, books: [] }), Error);
  for (const options of [
    null, [], 'all', 1, false, { status: null }, { status: 'unknown' },
    { status: 'ALL' }, { status: 1 }, { extra: true },
    { status: 'all', [Symbol()]: true },
  ]) assert.throws(() => selectBooks(emptyState(), options), Error);
});

test('Domain API presence only: learner tests establish US2 behavior', () => {
  for (const exported of [emptyState, validateState, addBook, setStatus, selectBooks]) {
    assert.equal(typeof exported, 'function');
  }
});
