import {
  getTrendingMovies,
  getSimilarMovies,
  discoverMovies,
  searchMovies,
} from "../tmdb";
import { getWatched } from "../watchedStorage";
import { getWatchlist } from "../watchlistStorage";
import { getRecentSearches } from "../recentSearchesStorage";

const SESSION_CACHE_KEY = "cinebuddy_rec_cache";

const RecommendationService = {
  async getRecommendations(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // Ignore invalid cache and fetch fresh data
        }
      }
    }

    const watched = getWatched();
    const watchlist = getWatchlist();
    const searches = getRecentSearches();

    const hasSignals =
      watched.length > 0 ||
      watchlist.length > 0 ||
      searches.length > 0;

    if (!hasSignals) {
      const trending = await getTrendingMovies();
      const results = (trending.results || []).slice(0, 10);

      sessionStorage.setItem(
        SESSION_CACHE_KEY,
        JSON.stringify(results)
      );

      return results;
    }

    const excludeIds = new Set([
      ...watched.map((movie) => movie.id),
      ...watchlist.map((movie) => movie.id),
    ]);

    const pools = {};

    function scoreMovie(movie, points) {
      if (excludeIds.has(movie.id)) return;
      if (!movie.poster_path) return;

      if (pools[movie.id]) {
        pools[movie.id].score += points;
      } else {
        pools[movie.id] = {
          ...movie,
          score: points,
        };
      }
    }

    // Signal 1: Recently watched movies (highest weight)
    const recentWatched = watched.slice(0, 3);

    const similarResults = await Promise.all(
      recentWatched.map((movie) =>
        getSimilarMovies(movie.id).then(
          (data) => data.results || []
        )
      )
    );

    similarResults.forEach((movies) => {
      movies.forEach((movie) => scoreMovie(movie, 3));
    });

    // Signal 2: Watchlist genres
    if (watchlist.length > 0) {
      const watchlistGenreIds = [
        ...new Set(
          watchlist.flatMap(
            (movie) =>
              movie.genres?.map((genre) => genre.id) ||
              movie.genre_ids ||
              []
          )
        ),
      ];

      if (watchlistGenreIds.length > 0) {
        const discoverData = await discoverMovies(
          { genres: watchlistGenreIds },
          1
        );

        (discoverData.results || []).forEach((movie) =>
          scoreMovie(movie, 2)
        );
      }
    }

    // Signal 3: Recent searches
    const recentSearches = searches.slice(0, 4);

    const searchResults = await Promise.all(
      recentSearches.map((query) =>
        searchMovies(query, 1).then((data) =>
          (data.results || []).slice(0, 5)
        )
      )
    );

    searchResults.forEach((movies) => {
      movies.forEach((movie) => scoreMovie(movie, 1));
    });

    const sorted = Object.values(pools)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const results =
      sorted.length > 0
        ? sorted
        : ((await getTrendingMovies()).results || []).slice(0, 10);

    sessionStorage.setItem(
      SESSION_CACHE_KEY,
      JSON.stringify(results)
    );

    return results;
  },

  invalidateCache() {
    sessionStorage.removeItem(SESSION_CACHE_KEY);
  },
};

export default RecommendationService;