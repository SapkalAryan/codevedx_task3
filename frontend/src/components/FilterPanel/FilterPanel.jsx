import { useEffect, useRef, useState } from "react";
import MovieService from "../../services/movie";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1950;

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
  { code: "de", label: "German" },
];

const RATING_OPTIONS = [7, 8, 9];

function FilterPanel({ filters, onChange }) {
  const [genres, setGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(true);

  useEffect(() => {
    loadGenres();
  }, []);

  async function loadGenres() {
    const data = await MovieService.getGenres();
    setGenres(data.genres || []);
    setGenresLoading(false);
  }

  function toggleGenre(genreId) {
    const current = filters.genres || [];

    const updated = current.includes(genreId)
      ? current.filter((id) => id !== genreId)
      : [...current, genreId];

    onChange({ ...filters, genres: updated });
  }


  function handleRatingChange(value) {
    onChange({
      ...filters,
      minRating: value ? Number(value) : undefined,
    });
  }

  function handleLanguageChange(value) {
    onChange({
      ...filters,
      language: value || undefined,
    });
  }

  function handleAdultToggle(checked) {
    onChange({ ...filters, includeAdult: checked });
  }

  const yearFrom = filters.yearFrom ?? MIN_YEAR;
  const yearTo = filters.yearTo ?? CURRENT_YEAR;

  const sliderRef = useRef(null);
  const draggingThumb = useRef(null);

  function toPercent(value) {
    return ((value - MIN_YEAR) / (CURRENT_YEAR - MIN_YEAR)) * 100;
  }

  function toValue(percent) {
    return Math.round(
      MIN_YEAR + (percent / 100) * (CURRENT_YEAR - MIN_YEAR)
    );
  }

  function getPercentFromPointer(clientX) {
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    return Math.min(100, Math.max(0, percent));
  }

  function handleTrackPointerDown(e) {
    if (e.target === sliderRef.current) {
      const percent = getPercentFromPointer(e.clientX);
      const value = toValue(percent);
      const distFrom = Math.abs(value - yearFrom);
      const distTo = Math.abs(value - yearTo);
      draggingThumb.current = distFrom <= distTo ? "from" : "to";
      updateValue(draggingThumb.current, value);
      sliderRef.current.setPointerCapture(e.pointerId);
    }
  }

  function handleThumbPointerDown(e, thumb) {
    e.stopPropagation();
    draggingThumb.current = thumb;
    e.currentTarget.setPointerCapture(e.pointerId);
    sliderRef.current.addEventListener("pointermove", handlePointerMove);
    sliderRef.current.addEventListener("pointerup", handlePointerUpCapture);
  }

  function handlePointerUpCapture() {
    draggingThumb.current = null;
    sliderRef.current.removeEventListener("pointermove", handlePointerMove);
    sliderRef.current.removeEventListener("pointerup", handlePointerUpCapture);
  }

  function handlePointerMove(e) {
    if (!draggingThumb.current) return;
    const percent = getPercentFromPointer(e.clientX);
    const value = toValue(percent);
    updateValue(draggingThumb.current, value);
  }

  function updateValue(thumb, value) {
    if (thumb === "from") {
      onChange({
        ...filters,
        yearFrom: Math.min(value, yearTo - 1),
      });
    } else {
      onChange({
        ...filters,
        yearTo: Math.max(value, yearFrom + 1),
      });
    }
  }

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <h4>Genre</h4>

        {genresLoading ? (
          <p className="filter-loading">Loading genres...</p>
        ) : (
          <div className="genre-pills">
            {genres.map((genre) => {
              const selected = (filters.genres || []).includes(genre.id);

              return (
                <button
                  key={genre.id}
                  type="button"
                  className={selected ? "genre-pill active" : "genre-pill"}
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

            <div className="filter-group">
        <h4>Language</h4>

        <select
          value={filters.language || ""}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="">Any language</option>

          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Minimum Rating</h4>

        <select
          value={filters.minRating || ""}
          onChange={(e) => handleRatingChange(e.target.value)}
        >
          <option value="">Any rating</option>

          {RATING_OPTIONS.map((rating) => (
            <option key={rating} value={rating}>
              {rating}+
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Year</h4>

        <div className="year-range-display">
          <span>{yearFrom}</span>
          <span>{yearTo}</span>
        </div>

        <div
          className="year-slider-track"
          ref={sliderRef}
          onPointerDown={handleTrackPointerDown}
        >
          <div
            className="year-slider-fill"
            style={{
              left: `${toPercent(yearFrom)}%`,
              width: `${toPercent(yearTo) - toPercent(yearFrom)}%`,
            }}
          />

          <div
            className="year-thumb"
            style={{ left: `${toPercent(yearFrom)}%` }}
            onPointerDown={(e) => handleThumbPointerDown(e, "from")}
          />

          <div
            className="year-thumb"
            style={{ left: `${toPercent(yearTo)}%` }}
            onPointerDown={(e) => handleThumbPointerDown(e, "to")}
          />
        </div>
      </div>

      <div className="filter-group filter-checkbox">
        <label>
          <input
            type="checkbox"
            checked={filters.includeAdult || false}
            onChange={(e) => handleAdultToggle(e.target.checked)}
          />
          Include adult content
        </label>
      </div>
    </div>
  );
}

export default FilterPanel;