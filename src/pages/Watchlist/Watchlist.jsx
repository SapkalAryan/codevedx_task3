import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import MovieCard from "../../components/MovieCard/MovieCard";
import Navbar from "../../components/Navbar/Navbar";
import {
  getWatchlist,
  removeFromWatchlist,
} from "../../services/watchlistStorage";
import { invalidateRecommendationCache } from "../../utils/recommendationEngine";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

function handleRemove(e, movieId) {
    e.preventDefault();
    e.stopPropagation();
    const updated = removeFromWatchlist(movieId);
    setWatchlist(updated);
    invalidateRecommendationCache();
  }

  return (
    <>
      <Header />

      <div className="watchlist-page">
        <h2>My Watchlist</h2>

        {watchlist.length === 0 && (
          <p className="empty-state">
            No movies saved yet. Browse and add some!
          </p>
        )}

        <div className="results-grid">
          {watchlist.map((movie) => (
            <div key={movie.id} className="watchlist-card-wrapper">
              <MovieCard movie={movie} />
              <button
                className="watchlist-remove-btn"
                onClick={(e) => handleRemove(e, movie.id)}
                aria-label="Remove from watchlist"
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

export default Watchlist;