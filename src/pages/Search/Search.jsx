import { useEffect, useRef, useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import MovieCard from "../../components/MovieCard/MovieCard";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import MovieService from "../../services/movie";
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
} from "../../services/recentSearchesStorage";
import { sortByGenreMatchCount } from "../../utils/genreSort";
import { mergeFilters } from "../../utils/mergeFilters";

const SEARCH_STATE_KEY = "cinebuddy_search_state";

function loadSearchState() {
  try {
    const raw = sessionStorage.getItem(SEARCH_STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function hasActiveFilters(filters) {
  return Boolean(
    filters.genres?.length ||
      filters.yearFrom ||
      filters.yearTo ||
      filters.minRating ||
      filters.language
  );
}

function applyClientFilters(movies, filters) {
  const filtered = movies.filter((movie) => {
    if (filters.genres?.length) {
      const movieGenres = movie.genre_ids || [];
      const matchesGenre = filters.genres.some((id) =>
        movieGenres.includes(id)
      );
      if (!matchesGenre) return false;
    }

    if (filters.yearFrom || filters.yearTo) {
      const year = movie.release_date
        ? Number(movie.release_date.slice(0, 4))
        : null;
      if (!year) return false;
      if (filters.yearFrom && year < filters.yearFrom) return false;
      if (filters.yearTo && year > filters.yearTo) return false;
    }

    if (filters.minRating && movie.vote_average < filters.minRating) {
      return false;
    }

    if (filters.language && movie.original_language !== filters.language) {
      return false;
    }

    return true;
  });

  return sortByGenreMatchCount(filtered, filters.genres);
}

function Search() {
  const restored = loadSearchState();

  const [mode, setMode] = useState(restored.mode ?? "simple");

  // --- Simple Search state ---
  const [query, setQuery] = useState(restored.query ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(restored.query ?? "");
  const [filters, setFilters] = useState(restored.filters ?? {});
  const [debouncedFilters, setDebouncedFilters] = useState(
    restored.filters ?? {}
  );
  const [isSimpleFilterOpen, setIsSimpleFilterOpen] = useState(
    restored.isSimpleFilterOpen ?? false
  );
  const [results, setResults] = useState(restored.results ?? []);
  const [page, setPage] = useState(restored.page ?? 1);
  const [totalPages, setTotalPages] = useState(restored.totalPages ?? 1);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const sentinelRef = useRef(null);
  const skipInitialFetchRef = useRef(
    Boolean(restored.results && restored.results.length > 0)
  );

  // --- Match Search state ---
  const [activePerson, setActivePerson] = useState(
    restored.activePerson ?? "you"
  );
  const [yourFilters, setYourFilters] = useState(restored.yourFilters ?? {});
  const [partnerFilters, setPartnerFilters] = useState(
    restored.partnerFilters ?? {}
  );
  const [isMatchFilterOpen, setIsMatchFilterOpen] = useState(
    restored.isMatchFilterOpen ?? false
  );
  const [genreMode, setGenreMode] = useState(restored.genreMode ?? "any");
  const [matchResults, setMatchResults] = useState(
    restored.matchResults ?? []
  );
  const [matchPage, setMatchPage] = useState(restored.matchPage ?? 1);
  const [matchTotalPages, setMatchTotalPages] = useState(
    restored.matchTotalPages ?? 1
  );
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchSearched, setMatchSearched] = useState(
    restored.matchSearched ?? false
  );

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }
    setPage(1);
    runSearch(1, true);
  }, [debouncedQuery, debouncedFilters]);

  // --- Persist Search page state across navigation ---
  useEffect(() => {
    const snapshot = {
      mode,
      query: debouncedQuery,
      filters: debouncedFilters,
      results,
      page,
      totalPages,
      isSimpleFilterOpen,
      activePerson,
      yourFilters,
      partnerFilters,
      isMatchFilterOpen,
      genreMode,
      matchResults,
      matchPage,
      matchTotalPages,
      matchSearched,
    };
    sessionStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(snapshot));
  }, [
    mode,
    debouncedQuery,
    debouncedFilters,
    results,
    page,
    totalPages,
    isSimpleFilterOpen,
    activePerson,
    yourFilters,
    partnerFilters,
    isMatchFilterOpen,
    genreMode,
    matchResults,
    matchPage,
    matchTotalPages,
    matchSearched,
  ]);

  async function runSearch(pageToFetch, replace) {
    const trimmedQuery = debouncedQuery.trim();
    const filtersActive = hasActiveFilters(debouncedFilters);

    if (!trimmedQuery && !filtersActive) {
      setResults([]);
      setTotalPages(1);
      return;
    }

    setLoading(true);

    try {
      let data;
      if (trimmedQuery) {
        data = await MovieService.search(trimmedQuery, pageToFetch);
      } else {
        data = await MovieService.discover(
          debouncedFilters,
          pageToFetch
        );
      }

      let fetchedResults = data.results || [];

      if (trimmedQuery && filtersActive) {
        fetchedResults = applyClientFilters(fetchedResults, debouncedFilters);
      } else if (!trimmedQuery && debouncedFilters.genres?.length) {
        fetchedResults = sortByGenreMatchCount(
          fetchedResults,
          debouncedFilters.genres
        );
      }

      setResults((prev) =>
        replace ? fetchedResults : [...prev, ...fetchedResults]
      );
      setTotalPages(data.total_pages || 1);
    } finally {
      setLoading(false);
    }
  }

  function loadNextPage() {
    if (loading || page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    runSearch(nextPage, false);
  }

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNextPage();
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, totalPages, loading]);

  function handleRecentClick(term) {
    setQuery(term);
    setDebouncedQuery(term);
  }

  function handleRemoveRecent(term) {
    setRecentSearches(removeRecentSearch(term));
  }

  function handleSearchSubmit() {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (results.length > 0) {
      const updated = addRecentSearch(trimmed);
      setRecentSearches(updated);
    }
  }

  // --- Match Search logic ---

  async function runMatchSearch(pageToFetch, replace) {
    const merged = mergeFilters(yourFilters, partnerFilters, genreMode);
    setMatchLoading(true);
    setMatchSearched(true);

    try {
      const data = await MovieService.discover(
        merged,
        pageToFetch
      );
      let fetchedResults = data.results || [];

      if (merged.languageOptions) {
        fetchedResults = fetchedResults.filter((movie) =>
          merged.languageOptions.includes(movie.original_language)
        );
      }

      if (merged.genres?.length && genreMode === "any") {
        fetchedResults = sortByGenreMatchCount(fetchedResults, merged.genres);
      }

      setMatchResults((prev) =>
        replace ? fetchedResults : [...prev, ...fetchedResults]
      );
      setMatchTotalPages(data.total_pages || 1);
    } finally {
      setMatchLoading(false);
    }
  }

  function handleFindMatches() {
    setMatchPage(1);
    runMatchSearch(1, true);
  }

  function handleMatchLoadMore() {
    if (matchLoading || matchPage >= matchTotalPages) return;
    const nextPage = matchPage + 1;
    setMatchPage(nextPage);
    runMatchSearch(nextPage, false);
  }

  const activeFilters = activePerson === "you" ? yourFilters : partnerFilters;
  const setActiveFilters =
    activePerson === "you" ? setYourFilters : setPartnerFilters;

  const showRecent =
    mode === "simple" && !query.trim() && !hasActiveFilters(debouncedFilters);

  return (
    <>
      <Header />

      <div className="search-page">
        <div className="search-header">
          <h1>Search</h1>
          <div className="mode-tabs">
            <button
              className={mode === "simple" ? "mode-tab active" : "mode-tab"}
              onClick={() => setMode("simple")}
            >
              Simple Search
            </button>
            <button
              className={mode === "match" ? "mode-tab active" : "mode-tab"}
              onClick={() => setMode("match")}
            >
              Match Search
            </button>
          </div>
        </div>

        {mode === "simple" && (
          <div className="simple-search-section">
            <div className="search-bar-row">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search movies by name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                />
                <button
                  className="search-submit-btn"
                  onClick={handleSearchSubmit}
                  aria-label="Search"
                >
                  🔍
                </button>
              </div>

              <button
                className={
                  hasActiveFilters(filters)
                    ? "filter-icon-btn active"
                    : "filter-icon-btn"
                }
                onClick={() => setIsSimpleFilterOpen((prev) => !prev)}
                aria-label="Toggle filters"
              >
                <FaSlidersH />
                {hasActiveFilters(filters) && (
                  <span className="filter-badge-dot" />
                )}
              </button>
            </div>

            {isSimpleFilterOpen && (
              <FilterPanel filters={filters} onChange={setFilters} />
            )}

            {showRecent && recentSearches.length > 0 && (
              <div className="recent-searches">
                <h4>Recent Searches</h4>
                <div className="recent-pills">
                  {recentSearches.map((term) => (
                    <div key={term} className="recent-pill">
                      <button onClick={() => handleRecentClick(term)}>
                        {term}
                      </button>
                      <span onClick={() => handleRemoveRecent(term)}>✕</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showRecent && (
              <div className="results-grid">
                {results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}

            {!showRecent && !loading && results.length === 0 && (
              <p className="empty-state">No movies found.</p>
            )}

            {loading && <p className="loading-text">Loading...</p>}

            <div ref={sentinelRef} />
          </div>
        )}

        {mode === "match" && (
          <div className="match-search-section">
            <div className="person-tabs">
              <button
                className={
                  activePerson === "you" ? "person-tab active" : "person-tab"
                }
                onClick={() => setActivePerson("you")}
              >
                You
              </button>
              <button
                className={
                  activePerson === "partner"
                    ? "person-tab active"
                    : "person-tab"
                }
                onClick={() => setActivePerson("partner")}
              >
                Partner
              </button>
            </div>

            <div className="search-bar-row match-filter-row">
              <p className="active-person-label">
                Setting filters for:{" "}
                <strong>
                  {activePerson === "you" ? "You" : "Partner"}
                </strong>
              </p>
              <button
                className={
                  hasActiveFilters(activeFilters)
                    ? "filter-icon-btn active"
                    : "filter-icon-btn"
                }
                onClick={() => setIsMatchFilterOpen((prev) => !prev)}
                aria-label="Toggle filters"
              >
                <FaSlidersH />
                {hasActiveFilters(activeFilters) && (
                  <span className="filter-badge-dot" />
                )}
              </button>
            </div>

            {isMatchFilterOpen && (
              <FilterPanel
                filters={activeFilters}
                onChange={setActiveFilters}
              />
            )}

            <div className="genre-mode-toggle">
              <span>Genre matching:</span>
              <button
                className={
                  genreMode === "any" ? "mode-tab active" : "mode-tab"
                }
                onClick={() => setGenreMode("any")}
              >
                Any genre picked
              </button>
              <button
                className={
                  genreMode === "both" ? "mode-tab active" : "mode-tab"
                }
                onClick={() => setGenreMode("both")}
              >
                Must match both
              </button>
            </div>

            <button className="find-matches-btn" onClick={handleFindMatches}>
              Find Matches
            </button>

            {matchLoading && matchResults.length === 0 && (
              <p className="loading-text">Loading...</p>
            )}

            {matchSearched && !matchLoading && matchResults.length === 0 && (
              <p className="empty-state">No matching movies found.</p>
            )}

            {matchResults.length > 0 && (
              <div className="results-grid">
                {matchResults.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}

            {matchResults.length > 0 && matchPage < matchTotalPages && (
              <button
                className="load-more-btn"
                onClick={handleMatchLoadMore}
                disabled={matchLoading}
              >
                {matchLoading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        )}
      </div>

      <Navbar />
    </>
  );
}

export default Search;