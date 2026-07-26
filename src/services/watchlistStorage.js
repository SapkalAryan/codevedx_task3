import BaseStorage from "./storage/BaseStorage";

const storage = new BaseStorage("cinebuddy_watchlist");

export function getWatchlist() {
  return storage.getAll();
}

export function addToWatchlist(movie) {
  const current = storage.getAll();

  if (current.some((m) => m.id === movie.id)) {
    return current;
  }

  return storage.save([movie, ...current]);
}

export function removeFromWatchlist(movieId) {
  return storage.save(
    storage.getAll().filter((movie) => movie.id !== movieId)
  );
}

export function isInWatchlist(movieId) {
  return storage.getAll().some((movie) => movie.id === movieId);
}