/**
 * Tiny localStorage wrapper. Everything is best-effort: if storage is blocked
 * (private browsing, full quota) the app keeps working, it just won't remember.
 */
const PREFIX = 'mealmind:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function clearAll() {
  try {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
