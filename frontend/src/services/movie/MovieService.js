import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  searchMovies,
  discoverMovies,
  getGenres,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
} from "../tmdb";

const MovieService = {
  async getTrending() {
    return await getTrendingMovies();
  },

  async getPopular() {
    return await getPopularMovies();
  },

  async getTopRated() {
    return await getTopRatedMovies();
  },

  async search(query) {
    return await searchMovies(query);
  },

  async discover(filters, page = 1) {
    return await discoverMovies(filters, page);
  },

  async getGenres() {
    return await getGenres();
  },

  async getDetails(id) {
    return await getMovieDetails(id);
  },

  async getCredits(id) {
    return await getMovieCredits(id);
  },

  async getVideos(id) {
    return await getMovieVideos(id);
  },

  async getSimilar(id) {
    return await getSimilarMovies(id);
  },

};

export default MovieService;