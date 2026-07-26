import BaseStorage from "./storage/BaseStorage";

const storage = new BaseStorage("cinebuddy_watched");

export function getWatched() {
  return storage.getAll();
}

export function addToWatched(movie) {
  const current = storage.getAll();

  if (current.some((m) => m.id === movie.id)) {
    return current;
  }

  return storage.save([movie, ...current]);
}

export function removeFromWatched(movieId) {
  return storage.save(
    storage.getAll().filter((movie) => movie.id !== movieId)
  );
}

export function isWatched(movieId) {
  return storage.getAll().some((movie) => movie.id === movieId);
}