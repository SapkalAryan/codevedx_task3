import { getTrendingMovies, getSimilarMovies, discoverMovies, searchMovies } from "../services/tmdb";
import { getWatched } from "../services/watchedStorage";
import { getWatchlist } from "../services/watchlistStorage";
import { getRecentSearches } from "../services/recentSearchesStorage";

const SESSION_CACHE_KEY = "cinebuddy_rec_cache";

export async function getRecommendations(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fall through to fresh fetch
      }
    }
  }

  const watched = getWatched();
  const watchlist = getWatchlist();
  const searches = getRecentSearches();

  const hasSignals =
    watched.length > 0 || watchlist.length > 0 || searches.length > 0;

  if (!hasSignals) {
    const trending = await getTrendingMovies();
    const results = (trending.results || []).slice(0, 10);
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(results));
    return results;
  }

  const excludeIds = new Set([
    ...watched.map((m) => m.id),
    ...watchlist.map((m) => m.id),
  ]);

  const pools = {};

  function scoreMovie(movie, points) {
    if (excludeIds.has(movie.id)) return;
    if (!movie.poster_path) return;
    if (pools[movie.id]) {
      pools[movie.id].score += points;
    } else {
      pools[movie.id] = { ...movie, score: points };
    }
  }

  // --- Signal 1: Watched movies (strongest — 3 points each) ---
  const recentWatched = watched.slice(0, 3);
  const similarResults = await Promise.all(
    recentWatched.map((m) =>
      getSimilarMovies(m.id).then((data) => data.results || [])
    )
  );
  similarResults.forEach((movies) => {
    movies.forEach((m) => scoreMovie(m, 3));
  });

  // --- Signal 2: Watchlist genres (medium — 2 points each) ---
  if (watchlist.length > 0) {
    const watchlistGenreIds = [
      ...new Set(
        watchlist.flatMap((m) => m.genres?.map((g) => g.id) || m.genre_ids || [])
      ),
    ];

    if (watchlistGenreIds.length > 0) {
      const discoverData = await discoverMovies(
        { genres: watchlistGenreIds },
        1
      );
      (discoverData.results || []).forEach((m) => scoreMovie(m, 2));
    }
  }

  // --- Signal 3: Search history (weakest — 1 point each) ---
  const recentSearches = searches.slice(0, 4);
  const searchResults = await Promise.all(
    recentSearches.map((q) =>
      searchMovies(q, 1).then((data) => (data.results || []).slice(0, 5))
    )
  );
  searchResults.forEach((movies) => {
    movies.forEach((m) => scoreMovie(m, 1));
  });

  const sorted = Object.values(pools)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const results = sorted.length > 0 ? sorted : (await getTrendingMovies()).results?.slice(0, 10) || [];

  sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(results));
  return results;
}

export function invalidateRecommendationCache() {
  sessionStorage.removeItem(SESSION_CACHE_KEY);
}