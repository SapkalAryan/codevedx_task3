import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecommendedStack from "./RecommendedStack";
import MovieDescription from "./MovieDescription";

function RecommendedMovies({ movies = [] }) {

    const displayMovies = movies.slice(0, 10);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeMovie = displayMovies[activeIndex];
    const navigate = useNavigate();

    return (
        <div className="recommended-wrapper">

            <div
                className="recommended-backdrop"
                style={{
                    backgroundImage: activeMovie?.backdrop_path
                        ? `
                        linear-gradient(
                            rgba(0,0,0,.55),
                            rgba(0,0,0,.75)
                        ),
                        url(
                            https://image.tmdb.org/t/p/original${activeMovie.backdrop_path}
                        )`
                        : "none"
                }}
                key={activeMovie?.id ?? "no-movie"}
            />

            <div className="recommended-header">

                <h2>Recommended</h2>

                <button
                    className="see-all-btn"
                    onClick={() => navigate("/recommended")}
                >
                    See All
                </button>

            </div>

            <div className="recommended-content">

                <RecommendedStack
                    movies={displayMovies}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                />

                <MovieDescription
                    movie={activeMovie}
                />

            </div>

        </div>
    );
}

export default RecommendedMovies;