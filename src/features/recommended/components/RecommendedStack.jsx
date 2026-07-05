import StackCard from "./StackCard";
import useCardSwipe from "../hooks/useCardSwipe";
import { MAX_VISIBLE_CARDS } from "../constants/swipeConfig";

function RecommendedStack({
    movies,
    activeIndex,
    setActiveIndex
}) {
    const {
        swipe,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp
    } = useCardSwipe(
        activeIndex,
        setActiveIndex,
        movies.length
    );

    const visibleMovies = movies.slice(
        activeIndex,
        activeIndex + MAX_VISIBLE_CARDS
    );

    if (activeIndex >= movies.length) {
        return (
            <div className="empty-stack">
                <div className="empty-icon">🎬</div>

                <h2>No more recommendations</h2>

                <p>
                    Search more movies or add titles to your
                    watchlist to refresh recommendations.
                </p>
            </div>
        );
    }

    return (
        <div
            className="card-stack"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {visibleMovies.map((movie, index) => (
                <StackCard
                    key={movie.id}
                    movie={movie}
                    index={index}
                    swipe={swipe}
                    active={index === 0}
                    onPointerDown={
                        index === 0
                            ? handlePointerDown
                            : undefined
                    }
                />
            ))}
        </div>
    );
}

export default RecommendedStack;