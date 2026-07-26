import Header from "../../components/Header/Header";
import MovieCard from "../../components/MovieCard/MovieCard";
import Navbar from "../../components/Navbar/Navbar";
import useWatchlist from "../../hooks/useWatchlist";
import { useWatchlistContext } from "../../context/WatchlistContext";

function Watchlist() {
  const { watchlist } = useWatchlistContext();

  function WatchlistMovie({ movie }) {
    const { remove } = useWatchlist(movie);

    function handleRemove(e) {
      e.preventDefault();
      e.stopPropagation();
      remove();
    }

    return (
      <div className="watchlist-card-wrapper">
        <MovieCard movie={movie} />

        <button
          className="watchlist-remove-btn"
          onClick={handleRemove}
          aria-label="Remove from watchlist"
        >
          ✕
        </button>
      </div>
    );
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
            <WatchlistMovie
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      </div>

      <Navbar />
    </>
  );
}

export default Watchlist;