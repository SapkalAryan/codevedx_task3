const STORAGE_KEY = "cinebuddy_watchlist";

export function getWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(movie) {
  const current = getWatchlist();
  const already = current.some((m) => m.id === movie.id);
  if (already) return current;

  const updated = [movie, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromWatchlist(movieId) {
  const updated = getWatchlist().filter((m) => m.id !== movieId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isInWatchlist(movieId) {
  return getWatchlist().some((m) => m.id === movieId);
}