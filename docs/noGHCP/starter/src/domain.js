const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function checkRecord(value, required, optional = []) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Expected a record.');
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error('Expected a plain record.');
  }
  const keys = Reflect.ownKeys(value);
  if (!required.every((key) => Object.hasOwn(value, key)) ||
      keys.some((key) => !required.includes(key) && !optional.includes(key))) {
    throw new Error('Unexpected or missing fields.');
  }
}

function checkText(value, limit) {
  if (typeof value !== 'string' || value !== value.trim() ||
      value.length < 1 || value.length > limit) {
    throw new Error('Expected trimmed text within the field limit.');
  }
}

function checkId(id) {
  if (typeof id !== 'string' || id.length !== 36 || !UUID_V4.test(id)) {
    throw new Error('Expected a canonical lowercase UUID v4.');
  }
}

export function emptyState() {
  return { version: 1, books: [] };
}

export function validateState(value) {
  checkRecord(value, ['version', 'books']);
  if (value.version !== 1 || !Array.isArray(value.books) || value.books.length > 200) {
    throw new Error('Invalid version or library size.');
  }
  const ids = new Set();
  for (const book of value.books) {
    checkRecord(book, ['id', 'title', 'author', 'status']);
    checkId(book.id);
    checkText(book.title, 120);
    checkText(book.author, 80);
    if (book.status !== 'unread' && book.status !== 'read') {
      throw new Error('Invalid reading status.');
    }
    if (ids.has(book.id)) throw new Error('Duplicate book ID.');
    ids.add(book.id);
  }
  return value;
}

export function addBook(state, input, id) {
  validateState(state);
  checkRecord(input, ['title', 'author']);
  if (typeof input.title !== 'string' || typeof input.author !== 'string') {
    throw new Error('Title and author must be strings.');
  }
  const title = input.title.trim();
  const author = input.author.trim();
  checkText(title, 120);
  checkText(author, 80);
  checkId(id);
  if (state.books.length === 200 || state.books.some((book) => book.id === id)) {
    throw new Error('Library is full or the ID already exists.');
  }
  return {
    version: 1,
    books: [{ id, title, author, status: 'unread' }, ...state.books],
  };
}

export function setStatus(state, id, status) {
  // Exercise: implement the status contract before enabling the UI flag.
  throw new Error('Exercise: implement setStatus');
}

export function selectBooks(state, options = {}) {
  validateState(state);
  checkRecord(options, [], ['status']);
  const { status = 'all' } = options;
  if (!['all', 'unread', 'read'].includes(status)) {
    throw new Error('Invalid status filter.');
  }
  if (status === 'all') return [...state.books];
  // Exercise: implement read/unread selection without changing saved state.
  throw new Error('Exercise: implement status filtering');
}
