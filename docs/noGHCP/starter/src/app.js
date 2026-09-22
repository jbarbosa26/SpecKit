import { emptyState, addBook, selectBooks, setStatus } from './domain.js';
import { loadState, saveState } from './storage.js';

// Exercise: enable only after implementing and testing both status functions.
const STATUS_FEATURE_ENABLED = false;

let state = emptyState();
let ready = false;
let filter = 'all';
let storage;

const form = document.getElementById('book-form');
const title = document.getElementById('title');
const author = document.getElementById('author');
const titleError = document.getElementById('title-error');
const authorError = document.getElementById('author-error');
const formError = document.getElementById('form-error');
const statusFilter = document.getElementById('status-filter');
const bookList = document.getElementById('book-list');
const emptyMessage = document.getElementById('empty-state');
const statusMessage = document.getElementById('status-message');

function updateControls() {
  title.disabled = !ready;
  author.disabled = !ready;
  form.querySelector('button[type="submit"]').disabled = !ready;
  statusFilter.disabled = !ready || !STATUS_FEATURE_ENABLED;
  document.getElementById('status-controls').hidden = !STATUS_FEATURE_ENABLED;
}

function showFailure(message) {
  formError.textContent = message;
  statusMessage.textContent = ready
    ? 'Change not saved. Your existing library and entered text are unchanged.'
    : 'Library unavailable. Changes are blocked.';
}

function render() {
  const books = selectBooks(state, { status: filter });
  const active = document.activeElement;
  const focusedBookId = bookList.contains(active) && active.matches('[data-action="toggle"]')
    ? active.closest('li[data-book-id]').dataset.bookId
    : null;
  bookList.replaceChildren();
  let focusTarget;
  for (const book of books) {
    const item = document.createElement('li');
    item.dataset.bookId = book.id;
    const heading = document.createElement('h3');
    heading.textContent = book.title;
    const byline = document.createElement('p');
    byline.textContent = `By ${book.author}`;
    const readingStatus = document.createElement('p');
    readingStatus.textContent = book.status === 'read' ? 'Read' : 'Unread';
    item.append(heading, byline, readingStatus);
    if (STATUS_FEATURE_ENABLED) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.dataset.action = 'toggle';
      toggle.disabled = !ready;
      toggle.textContent = book.status === 'read' ? 'Mark as unread' : 'Mark as read';
      toggle.setAttribute('aria-label', `${toggle.textContent}: ${book.title} by ${book.author}`);
      item.append(toggle);
      if (book.id === focusedBookId) focusTarget = toggle;
    }
    bookList.append(item);
  }
  emptyMessage.hidden = books.length !== 0;
  emptyMessage.textContent = state.books.length === 0
    ? 'Your library is empty. Add a fictional book.'
    : 'No books match this filter.';
  // Restore only an existing toggle's focus, never steal normal add-form focus.
  if (focusedBookId) (focusTarget || statusFilter).focus();
}

function checkField(input, error, label, limit) {
  const length = input.value.trim().length;
  const valid = length >= 1 && length <= limit;
  input.setAttribute('aria-invalid', String(!valid));
  error.textContent = valid ? '' : `${label} must be 1-${limit} UTF-16 code units after trimming.`;
  return valid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!ready) {
    showFailure('Cannot add books until saved data can be loaded. Resolve the storage problem, then reload.');
    return;
  }
  formError.textContent = '';
  const titleValid = checkField(title, titleError, 'Title', 120);
  const authorValid = checkField(author, authorError, 'Author', 80);
  if (!titleValid || !authorValid) {
    showFailure('Correct the indicated fields, then try again.');
    (!titleValid ? title : author).focus();
    return;
  }
  let candidate;
  try {
    candidate = addBook(state, { title: title.value, author: author.value }, crypto.randomUUID());
    // Persistence must succeed before publishing any change or clearing input.
    saveState(storage, candidate);
  } catch {
    showFailure('Cannot add and save this book. Check the 200-book limit and browser storage availability, then retry.');
    return;
  }
  state = candidate;
  render();
  form.reset();
  statusMessage.textContent = 'Book added and saved.';
});

bookList.addEventListener('click', (event) => {
  if (!ready || !STATUS_FEATURE_ENABLED) return;
  const button = event.target.closest('button[data-action="toggle"]');
  if (!button || !bookList.contains(button)) return;
  const id = button.closest('li[data-book-id]').dataset.bookId;
  formError.textContent = '';
  let candidate;
  try {
    const book = state.books.find((entry) => entry.id === id);
    candidate = setStatus(state, id, book.status === 'read' ? 'unread' : 'read');
    saveState(storage, candidate);
  } catch {
    showFailure('Cannot change and save status. Check the status exercise and browser storage availability, then retry.');
    return;
  }
  state = candidate;
  render();
  statusMessage.textContent = 'Reading status changed and saved.';
});

statusFilter.addEventListener('change', () => {
  if (!ready || !STATUS_FEATURE_ENABLED) {
    statusFilter.value = filter;
    return;
  }
  const previous = filter;
  filter = statusFilter.value;
  try {
    render();
    if (!formError.textContent) {
      statusMessage.textContent = emptyMessage.hidden
        ? 'Library view updated. Saved data is unchanged.'
        : emptyMessage.textContent;
    }
  } catch {
    filter = previous;
    statusFilter.value = previous;
    formError.textContent = 'Cannot filter books. Complete the status filtering exercise first.';
    statusMessage.textContent = 'View unchanged. Saved data is unchanged.';
  }
});

updateControls();
try {
  // Property access itself can throw; no writable empty fallback is permitted.
  storage = window.localStorage;
  state = loadState(storage);
  ready = true;
} catch {
  emptyMessage.hidden = true;
  showFailure('Cannot load saved books. Data has not been reset. Resolve the storage problem, then reload; changes are blocked.');
}
if (ready) {
  ready = true;
  render();
  statusMessage.textContent = 'Library loaded. Accepted changes will be saved in this browser.';
}
updateControls();
