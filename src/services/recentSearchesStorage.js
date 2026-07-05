const STORAGE_KEY = "cinebuddy_recent_searches";
const MAX_RECENT = 4;

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query) {
  const trimmed = query.trim();

  if (!trimmed) return getRecentSearches();

  const existing = getRecentSearches().filter(
    (item) => item.toLowerCase() !== trimmed.toLowerCase()
  );

  const updated = [trimmed, ...existing].slice(0, MAX_RECENT);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export function removeRecentSearch(query) {
  const updated = getRecentSearches().filter((item) => item !== query);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export function clearRecentSearches() {
  localStorage.removeItem(STORAGE_KEY);

  return [];
}