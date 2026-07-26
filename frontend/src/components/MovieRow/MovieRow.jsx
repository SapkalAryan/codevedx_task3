import MovieCard from "../MovieCard/MovieCard";

function MovieRow({ movies = [] }) {

  return (
    <div className="movie-row">

      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}

    </div>
  );
}

export default MovieRow;