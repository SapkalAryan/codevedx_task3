import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import MovieCard from "../../components/MovieCard/MovieCard";
import Navbar from "../../components/Navbar/Navbar";
import {
  getWatched,
  removeFromWatched,
} from "../../services/watchedStorage";
import { invalidateRecommendationCache } from "../../utils/recommendationEngine";

function MyMovies() {
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    setWatched(getWatched());
  }, []);

  function handleRemove(e, movieId) {
    e.preventDefault();
    e.stopPropagation();
    const updated = removeFromWatched(movieId);
    setWatched(updated);
    invalidateRecommendationCache();
  }

  return (
    <>
      <Header />

      <div className="watchlist-page">
        <h2>My Movies</h2>

        {watched.length === 0 && (
          <p className="empty-state">
            No movies marked as watched yet.
          </p>
        )}

        <div className="results-grid">
          {watched.map((movie) => (
            <div key={movie.id} className="watchlist-card-wrapper">
              <MovieCard movie={movie} />
              <button
                className="watchlist-remove-btn"
                onClick={(e) => handleRemove(e, movie.id)}
                aria-label="Remove from watched"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <Navbar />
    </>
  );
}

export default MyMovies;