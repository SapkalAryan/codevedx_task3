import BaseStorage from "./storage/BaseStorage";

const storage = new BaseStorage("cinebuddy_recent_searches");
const MAX_RECENT = 4;

export function getRecentSearches() {
  return storage.getAll();
}

export function addRecentSearch(query) {
  const trimmed = query.trim();

  if (!trimmed) {
    return storage.getAll();
  }

  const updated = [
    trimmed,
    ...storage
      .getAll()
      .filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, MAX_RECENT);

  return storage.save(updated);
}

export function removeRecentSearch(query) {
  return storage.save(
    storage.getAll().filter((item) => item !== query)
  );
}

export function clearRecentSearches() {
  return storage.clear();
}