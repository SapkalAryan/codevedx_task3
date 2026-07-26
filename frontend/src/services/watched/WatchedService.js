import {
  getWatched,
  addToWatched,
  removeFromWatched,
  isWatched,
} from "../watchedStorage";

import WatchlistService from "../watchlist";

import RecommendationService from "../recommendation/RecommendationService.js";
import NotificationService from "../notification";
import { EventBus, AppEvents } from "../../events";

class WatchedService {
  getAll() {
    return getWatched();
  }

  contains(movieId) {
    return isWatched(movieId);
  }

  add(movie) {
    if (this.contains(movie.id)) {
      return false;
    }

    addToWatched(movie);

    NotificationService.watchedAdded(movie.title);

    if (WatchlistService.contains(movie.id)) {
      WatchlistService.remove(movie);
      NotificationService.removedFromWatchlist();
    }

    RecommendationService.invalidateCache();

    EventBus.emit(AppEvents.WATCHED_CHANGED);

    return true;
  }

  remove(movie) {
    const movieId = typeof movie === "object" ? movie.id : movie;
    const title = typeof movie === "object" ? movie.title : null;

    if (!this.contains(movieId)) {
      return false;
    }

    removeFromWatched(movieId);

    if (title) {
      NotificationService.watchedRemoved(title);
    }

    RecommendationService.invalidateCache();

    EventBus.emit(AppEvents.WATCHED_CHANGED);

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

export default new WatchedService();