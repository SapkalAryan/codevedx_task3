import { useMemo } from "react";
import { useWatchlistContext } from "../context/WatchlistContext";
import WatchlistService from "../services/watchlist";

export default function useWatchlist(movie) {
  const { watchlist } = useWatchlistContext();

  const inWatchlist = useMemo(() => {
    if (!movie) return false;

    return watchlist.some((m) => m.id === movie.id);
  }, [movie, watchlist]);

  function add() {
    if (!movie) return;
    WatchlistService.add(movie);
  }

  function remove() {
    if (!movie) return;
    WatchlistService.remove(movie);
  }

  function toggle() {
    if (!movie) return;
    WatchlistService.toggle(movie);
  }

  return {
    inWatchlist,
    add,
    remove,
    toggle,
  };
}