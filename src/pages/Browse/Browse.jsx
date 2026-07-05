import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import MovieRow from "../../components/MovieRow/MovieRow";
import RecommendedMovies from "../../features/recommended/components/RecommendedMovies";
import Header from "../../components/Header/Header";
import { getPopularMovies, getTopRatedMovies, getTrendingMovies } from "../../services/tmdb";
import { getRecommendations } from "../../utils/recommendationEngine";

function Browse() {

  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);



async function loadMovies() {

    const [recommendedData, trendingData, topRatedData] = await Promise.all([
      getRecommendations(),
      getTrendingMovies(),
      getTopRatedMovies(),
    ]);

    setRecommended(recommendedData);
    setTrending(trendingData.results.slice(0, 10));
    setTopRated(topRatedData.results.slice(0, 10));
    setLoading(false);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  if (loading) {
    return (
      <>
        <div className="loading-screen">
          Loading Movies...
        </div>
        <Navbar />
      </>
    );
  }

  return (
    <>
      <Header/>
      <div className="browse-page">


        <section>
          <RecommendedMovies movies={recommended} />
        </section>

        <section>
          <h2>Trending Now</h2>

          <MovieRow movies={trending} />
        </section>

        <section>
          <h2>Highest Rated</h2>

          <MovieRow movies={topRated} />
        </section>

      </div >

      <Navbar />
    </>
  );
}

export default Browse;