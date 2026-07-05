export function countGenreMatches(movie, pickedGenreIds) {
  if (!pickedGenreIds?.length) return 0;

  const movieGenres = movie.genre_ids || [];

  return pickedGenreIds.filter((id) => movieGenres.includes(id)).length;
}

export function sortByGenreMatchCount(movies, pickedGenreIds) {
  if (!pickedGenreIds?.length) return movies;

  return [...movies].sort(
    (a, b) =>
      countGenreMatches(b, pickedGenreIds) -
      countGenreMatches(a, pickedGenreIds)
  );
}