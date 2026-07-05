import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import MovieCard from "../../components/MovieCard/MovieCard";
import { getRecommendations } from "../../utils/recommendationEngine";

function RecommendedAll() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  async function loadRecommendations() {
    const data = await getRecommendations();
    setMovies(data);
    setLoading(false);
  }

  return (
    <>
      <Header />

      <div className="search-page">
        <h1 className="page-title">Recommended For You</h1>

        {loading && <p className="loading-text">Loading...</p>}

        {!loading && movies.length === 0 && (
          <p className="empty-state">
            No recommendations yet. Start watching or saving movies!
          </p>
        )}

        {!loading && movies.length > 0 && (
          <div className="results-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </>
  );
}

export default RecommendedAll;