import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookmark, FaRegBookmark, FaPlay } from "react-icons/fa";

import MovieService from "../../services/movie";
import MovieRow from "../../components/MovieRow/MovieRow";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import useWatchlist from "../../hooks/useWatchlist";
import useWatched from "../../hooks/useWatched";


function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  const {
    inWatchlist,
    toggle: toggleWatchlist,
  } = useWatchlist(movie);

  const {
    inWatched,
    toggle: toggleWatched,
  } = useWatched(movie);

  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
    window.scrollTo(0, 0);
  }, [id]);

  async function loadAll() {
    setLoading(true);

    const [detailsData, creditsData, videosData, similarData] =
      await Promise.all([
        MovieService.getDetails(id),
        MovieService.getCredits(id),
        MovieService.getVideos(id),
        MovieService.getSimilar(id),
      ]);

    setMovie(detailsData);
    setCredits(creditsData);
    setSimilar(similarData.results || []);

    const officialTrailer =
      videosData.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      ) || videosData.results?.find((v) => v.site === "YouTube");

    setTrailer(officialTrailer || null);
    setLoading(false);
  }

  function handleWatchlistToggle() {
    toggleWatchlist();
  }

  function handleWatchedToggle() {
    toggleWatched();
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="loading-screen">
        <p>Movie not found.</p>
      </div>
    );
  }

  const director = credits?.crew?.find((p) => p.job === "Director");
  const cast = credits?.cast?.slice(0, 6) || [];

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : null;

  return (
    <>
      <Header />

      <div className="movie-details-page">

        <div className="details-backdrop">
          {movie.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt=""
            />
          )}
          <div className="details-backdrop-overlay" />

          <button
            className="details-back-btn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </button>
        </div>

        <div className="details-hero">
          <img
            className="details-poster"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750"
            }
            alt={movie.title}
          />

          <div className="details-core-info">
            <h1 className="details-title">{movie.title}</h1>

            {director && (
              <p className="details-director">
                Directed by <span>{director.name}</span>
              </p>
            )}

            <div className="details-meta-row">
              {movie.vote_average > 0 && (
                <span className="details-rating">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
              )}
              {year && <span className="details-meta-chip">{year}</span>}
              {runtime && (
                <span className="details-meta-chip">{runtime}</span>
              )}
            </div>

            <div className="details-genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="details-genre-pill">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="details-body">

          {movie.overview && (
            <div className="details-section">
              <h3>Overview</h3>
              <p>{movie.overview}</p>
            </div>
          )}

          <div className="details-action-row">
            <button
              className={
                inWatchlist
                  ? "watchlist-btn watchlist-btn-added"
                  : "watchlist-btn"
              }
              onClick={handleWatchlistToggle}
            >
              {inWatchlist ? <FaBookmark /> : <FaRegBookmark />}
              {inWatchlist ? "Saved" : "Watchlist"}
            </button>

            <button
              className={
                inWatched
                  ? "watched-btn watched-btn-active"
                  : "watched-btn"
              }
              onClick={handleWatchedToggle}
            >
              {inWatched ? "✓ Watched" : "Mark Watched"}
            </button>
          </div>

          {trailer && (
            <div className="details-section">
              <h3>Trailer</h3>
              <a
                className="trailer-thumbnail"
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                  alt="Trailer thumbnail"
                />
                <div className="trailer-play-icon">
                  <FaPlay />
                </div>
              </a>
            </div>
          )}

          {cast.length > 0 && (
            <div className="details-section">
              <h3>Cast</h3>
              <ul className="cast-list">
                {cast.map((member) => (
                  <li key={member.id} className="cast-item">
                    <span className="cast-name">{member.name}</span>
                    {member.character && (
                      <span className="cast-character">
                        as {member.character}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {movie.production_companies?.length > 0 && (
            <div className="details-section">
              <h3>Production</h3>
              <p className="details-production">
                {movie.production_companies.map((c) => c.name).join(", ")}
              </p>
            </div>
          )}

          {movie.homepage && (
            <div className="details-section">
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="details-homepage-btn"
              >
                Official Website
              </a>
            </div>
          )}

          {similar.length > 0 && (
            <div className="details-section">
              <h3>Similar Movies</h3>
              <MovieRow movies={similar} />
            </div>
          )}

        </div>
      </div>

      <Navbar />
    </>
  );
}

export default MovieDetails;