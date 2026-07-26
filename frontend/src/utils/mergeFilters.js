export function mergeFilters(yourFilters, partnerFilters, genreMode) {
  const merged = {};

  // --- Genres ---
  const yourGenres = yourFilters.genres || [];
  const partnerGenres = partnerFilters.genres || [];
  const allGenres = [...new Set([...yourGenres, ...partnerGenres])];

  if (allGenres.length) {
    merged.genres = allGenres;
    merged.genreMode = genreMode; // "any" | "both" — read by discoverMovies caller
  }

  // --- Year range: intersection ---
  const yourFrom = yourFilters.yearFrom;
  const partnerFrom = partnerFilters.yearFrom;
  const yourTo = yourFilters.yearTo;
  const partnerTo = partnerFilters.yearTo;

  const combinedFrom = [yourFrom, partnerFrom].filter(Boolean);
  const combinedTo = [yourTo, partnerTo].filter(Boolean);

  if (combinedFrom.length) {
    merged.yearFrom = Math.max(...combinedFrom);
  }

  if (combinedTo.length) {
    merged.yearTo = Math.min(...combinedTo);
  }

  // --- Min rating: stricter (max) wins ---
  const ratings = [yourFilters.minRating, partnerFilters.minRating].filter(
    Boolean
  );

  if (ratings.length) {
    merged.minRating = Math.max(...ratings);
  }

  // --- Language: OR between the two ---
  const languages = [...new Set(
    [yourFilters.language, partnerFilters.language].filter(Boolean)
  )];

  if (languages.length === 1) {
    merged.language = languages[0]; // single language, native param works
  } else if (languages.length === 2) {
    merged.languageOptions = languages; // conflict, needs client-side OR filter
  }

  // --- Adult: only if both allow it ---
  merged.includeAdult = Boolean(
    yourFilters.includeAdult && partnerFilters.includeAdult
  );

  return merged;
}