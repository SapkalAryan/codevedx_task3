import { useMemo } from "react";
import { useWatchedContext } from "../context/WatchedContext";
import WatchedService from "../services/watched";

export default function useWatched(movie) {
  const { watched } = useWatchedContext();

  const inWatched = useMemo(() => {
    if (!movie) return false;

    return watched.some((m) => m.id === movie.id);
  }, [movie, watched]);

  function add() {
    if (!movie) return;
    WatchedService.add(movie);
  }

  function remove() {
    if (!movie) return;
    WatchedService.remove(movie);
  }

  function toggle() {
    if (!movie) return;
    WatchedService.toggle(movie);
  }

  return {
    inWatched,
    add,
    remove,
    toggle,
  };
}