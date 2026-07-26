import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "../watchlistStorage";

import RecommendationService from "../recommendation/RecommendationService.js";
import NotificationService from "../notification";
import { EventBus, AppEvents } from "../../events";

class WatchlistService {
  getAll() {
    return getWatchlist();
  }

  contains(movieId) {
    return isInWatchlist(movieId);
  }

  add(movie) {
    if (this.contains(movie.id)) {
      return false;
    }

    addToWatchlist(movie);

    NotificationService.watchlistAdded(movie.title);

    RecommendationService.invalidateCache();

    EventBus.emit(AppEvents.WATCHLIST_CHANGED);

    return true;
  }

  remove(movie) {
    const movieId = typeof movie === "object" ? movie.id : movie;
    const title = typeof movie === "object" ? movie.title : null;

    if (!this.contains(movieId)) {
      return false;
    }

    removeFromWatchlist(movieId);

    if (title) {
      NotificationService.watchlistRemoved(title);
    }

    RecommendationService.invalidateCache();

    EventBus.emit(AppEvents.WATCHLIST_CHANGED);

    return true;
  }

  toggle(movie) {
    if (this.contains(movie.id)) {
      this.remove(movie);
      return false;
    }

    this.add(movie);
    return true;
  }
}

export default new WatchlistService();