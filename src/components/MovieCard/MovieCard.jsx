import { Link } from "react-router-dom";

function MovieCard({ movie }) {

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">

            <img
                src={
                    movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750"
                }
                alt={movie.title}
            />

            <h4>{movie.title}</h4>

            <span>
                ⭐ {movie.vote_average.toFixed(1)}
            </span>

        </Link>
    );
}

export default MovieCard;