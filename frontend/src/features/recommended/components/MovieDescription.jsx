import { useNavigate } from "react-router-dom";

function MovieDescription({ movie }) {
const navigate = useNavigate();

    if (!movie) return null;

    const year = movie.release_date
        ? movie.release_date.slice(0, 4)
        : null;

    return (

        <div className="movie-info" key={movie.id}>

            <h2>{movie.title}</h2>

            <div className="movie-meta">

                {movie.vote_average > 0 && (
                    <span className="movie-meta-rating">
                        ⭐ {movie.vote_average.toFixed(1)}
                    </span>
                )}

                {year && <span>{year}</span>}

            </div>

            <p> {movie.overview || "No description available."} </p>

            <button
                className="view-details-btn"
                onClick={() => navigate(`/movie/${movie.id}`)}
            >
                View Details
            </button>
        </div>

    );

}

export default MovieDescription;