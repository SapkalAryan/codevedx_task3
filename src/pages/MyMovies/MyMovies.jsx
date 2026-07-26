import Header from "../../components/Header/Header";
import MovieCard from "../../components/MovieCard/MovieCard";
import Navbar from "../../components/Navbar/Navbar";
import { useWatchedContext } from "../../context/WatchedContext";
import useWatched from "../../hooks/useWatched";

function WatchedMovie({ movie }) {
  const { remove } = useWatched(movie);

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
        aria-label="Remove from watched"
      >
        ✕
      </button>
    </div>
  );
}

function MyMovies() {
  const { watched } = useWatchedContext();

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
            <WatchedMovie
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

export default MyMovies;