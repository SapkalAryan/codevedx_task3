const STORAGE_KEY = "cinebuddy_watched";

export function getWatched() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWatched(movie) {
  const current = getWatched();
  const already = current.some((m) => m.id === movie.id);
  if (already) return current;

  const updated = [movie, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromWatched(movieId) {
  const updated = getWatched().filter((m) => m.id !== movieId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isWatched(movieId) {
  return getWatched().some((m) => m.id === movieId);
}