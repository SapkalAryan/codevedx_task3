const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

export async function getTrendingMovies() {
  const response = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );

  return response.json();
}

export async function getPopularMovies() {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}`
  );

  return response.json();
}

export async function getTopRatedMovies() {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
  );

  return response.json();
}

export async function searchMovies(query, page = 1) {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );

  return response.json();
}

export async function getGenres() {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  );

  return response.json();
}

export async function discoverMovies(filters = {}, page = 1) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    page,
    include_adult: filters.includeAdult ?? false,
  });

  if (filters.genres?.length) {
    const joiner = filters.genreMode === "both" ? "," : "|";
    params.set("with_genres", filters.genres.join(joiner));
  }

  if (filters.yearFrom) {
    params.set("primary_release_date.gte", `${filters.yearFrom}-01-01`);
  }

  if (filters.yearTo) {
    params.set("primary_release_date.lte", `${filters.yearTo}-12-31`);
  }

  if (filters.language) {
    params.set("with_original_language", filters.language);
  }

  if (filters.minRating) {
    params.set("vote_average.gte", filters.minRating);
  }

  const response = await fetch(`${BASE_URL}/discover/movie?${params}`);

  return response.json();
}

export async function getMovieDetails(id) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
  );
  return response.json();
}

export async function getMovieCredits(id) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
  );
  return response.json();
}

export async function getMovieVideos(id) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
  );
  return response.json();
}

export async function getSimilarMovies(id) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`
  );
  return response.json();
}