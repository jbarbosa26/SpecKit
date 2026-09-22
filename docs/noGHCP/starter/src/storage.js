import { emptyState, validateState } from './domain.js';

export const STORAGE_KEY = 'booknook:v1';
const MAX_LENGTH = 100000;

export function decodeState(raw) {
  if (raw === null) return emptyState();
  if (typeof raw !== 'string' || raw.length > MAX_LENGTH) {
    throw new Error('Saved data is not a bounded string.');
  }
  return validateState(JSON.parse(raw));
}

export function loadState(storage) {
  return decodeState(storage.getItem(STORAGE_KEY));
}

export function saveState(storage, state) {
  validateState(state);
  const raw = JSON.stringify(state);
  // Escaped control characters can expand otherwise valid fields.
  if (raw.length > MAX_LENGTH) {
    throw new Error('Serialized library exceeds the storage limit.');
  }
  storage.setItem(STORAGE_KEY, raw);
}
