# Cine Buddy — Complete Project Documentation

**Version:** Checkpoint 2  
**Stack:** React 19 · Vite · React Router v7 · CSS · TMDB API · LocalStorage  
**Type:** Frontend-only Web Application (no backend)

---

## Table of Contents

1. Project Overview
2. Folder Structure
3. File-by-File Breakdown
4. Data Storage (What, Where, How)
5. Pages — Purpose and Operations
6. Features — How They Work End to End
7. API Layer — TMDB Integration
8. Algorithm — Recommendation Engine
9. Frontend vs Backend Reality
10. Known Limitations and Future Plans

---

## 1. Project Overview

Cine Buddy is a mobile-first movie discovery application. Users can browse trending and top-rated movies, get personalized recommendations based on their activity, search for movies by name or filter criteria, run a "Match Search" that combines two people's preferences, view full movie details, save movies to a watchlist, and mark movies as watched.

The application is entirely frontend — there is no server, no database, and no user authentication. All user data (watchlist, watched movies, recent searches) is stored in the browser's LocalStorage and lives only on the user's device.

---

## 2. Folder Structure

```
movie-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                  — App entry point
│   ├── App.jsx                   — Root component
│   ├── routes.jsx                — Route definitions
│   │
│   ├── pages/
│   │   ├── Browse/
│   │   │   └── Browse.jsx        — Home page
│   │   ├── Search/
│   │   │   └── Search.jsx        — Search page (Simple + Match modes)
│   │   ├── MovieDetails/
│   │   │   └── MovieDetails.jsx  — Individual movie page
│   │   └── Watchlist/
│   │       └── Watchlist.jsx     — Saved movies page
│   │
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx        — "Cine Buddy" top bar
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx        — Fixed bottom navigation
│   │   ├── MovieCard/
│   │   │   └── MovieCard.jsx     — Poster card (used in rows and grids)
│   │   ├── MovieRow/
│   │   │   └── MovieRow.jsx      — Horizontal scrolling row of cards
│   │   └── FilterPanel/
│   │       └── FilterPanel.jsx   — Reusable filter UI (genre, year, rating, language, adult)
│   │
│   ├── features/
│   │   └── recommended/
│   │       ├── components/
│   │       │   ├── RecommendedMovies.jsx  — Wrapper with backdrop + header
│   │       │   ├── RecommendedStack.jsx   — Card stack orchestrator
│   │       │   ├── StackCard.jsx          — Individual draggable card
│   │       │   └── MovieDescription.jsx   — Title, rating, overview, View Details button
│   │       ├── hooks/
│   │       │   └── useCardSwipe.js        — Drag + fly-out logic
│   │       └── constants/
│   │           └── swipeConfig.js         — Threshold, duration, rotation constants
│   │
│   ├── services/
│   │   ├── tmdb.js                   — All TMDB API fetch functions
│   │   ├── recentSearchesStorage.js  — LocalStorage: recent search terms
│   │   ├── watchlistStorage.js       — LocalStorage: saved movies
│   │   └── watchedStorage.js         — LocalStorage: watched movies
│   │
│   ├── utils/
│   │   ├── genreSort.js              — Sorts movies by genre match count
│   │   ├── mergeFilters.js           — Merges two people's filters for Match Search
│   │   └── recommendationEngine.js   — Fetches + scores + caches recommendations
│   │
│   └── styles/
│       └── style.css                 — Single global stylesheet
│
├── index.html
├── vite.config.js
├── package.json
└── .env                              — VITE_TMDB_API_KEY (never committed to git)
```

---

## 3. File-by-File Breakdown

### Entry Points

**`src/main.jsx`**  
Mounts the React app into `index.html`'s `#root` div. Wraps everything in `<BrowserRouter>` for client-side routing. Imports the global stylesheet.

**`src/App.jsx`**  
Minimal root component. Renders `<AppRoutes />` only — no layout logic here.

**`src/routes.jsx`**  
Defines all client-side routes using React Router v7:
- `/` → Browse
- `/search` → Search
- `/watchlist` → Watchlist
- `/movie/:id` → MovieDetails

---

### Pages

**`src/pages/Browse/Browse.jsx`**  
The home page. On mount, fires three concurrent API calls via `Promise.all`: `getRecommendations()` (recommendation engine), `getTrendingMovies()`, `getTopRatedMovies()`. Manages a `loading` state that shows a loading screen until all three resolve. Renders `<Header>`, `<RecommendedMovies>`, two `<MovieRow>` sections (Trending Now, Highest Rated), and `<Navbar>`.

**`src/pages/Search/Search.jsx`**  
The most complex page in the app. Contains two search modes toggled by a tab row:

*Simple Search:* A pill-shaped text input with a circular filter icon button. Typing triggers a 500ms debounced query update. Filter changes also debounce 500ms. When both query and filters are empty, recent searches are shown. When either has a value, results load. The mode of the TMDB call depends on what's filled: name only → `searchMovies`, filters only → `discoverMovies`, both → `searchMovies` then client-side filter application. Results paginate via IntersectionObserver on a sentinel div at the bottom.

*Match Search:* Two people each set their own filter preferences using a shared `<FilterPanel>` toggled by "You / Partner" tabs. A "Find Matches" button fires `mergeFilters()` then `discoverMovies()` with the merged result. "Load More" button handles manual pagination. Genre matching can be toggled between "Any genre picked" (OR) and "Must match both" (AND/intersection).

**`src/pages/MovieDetails/MovieDetails.jsx`**  
Loads when a user taps any movie card. Reads the movie ID from URL params (`useParams`). Fires four concurrent TMDB calls on mount: movie details, credits, videos, similar movies. Also checks LocalStorage to set initial watchlist and watched button states. Renders: full-bleed backdrop with gradient overlay and back button, poster overlaid on the hero section, title, director, rating, year, runtime, genre pills, overview, action buttons (Add to Watchlist + Mark Watched side by side), trailer thumbnail (YouTube link), cast list (top 6), production companies, official website link, similar movies row.

**`src/pages/Watchlist/Watchlist.jsx`**  
Reads saved movies from `watchlistStorage.getWatchlist()` on mount into local state. Displays them in a 2-column grid by reusing `.results-grid` and `<MovieCard>`. Each card has an overlaid ✕ remove button positioned absolutely. Removing a movie calls `removeFromWatchlist()` and updates local state immediately — no page reload needed.

---

### Shared Components

**`src/components/Header/Header.jsx`**  
A simple static bar showing the 🎬 emoji and "Cine Buddy" title. Appears at the top of Browse, Search, and Watchlist pages. Handles `env(safe-area-inset-top)` padding for notched iPhones via CSS.

**`src/components/Navbar/Navbar.jsx`**  
Fixed bottom navigation with three `<NavLink>` elements (Home, Watchlist, Search). Uses React Router's `NavLink` which automatically applies an `active` class to the link matching the current route — this drives the red active icon color in CSS without any manual state.

**`src/components/MovieCard/MovieCard.jsx`**  
A `<Link>` wrapping a poster image, title, and star rating. Navigates to `/movie/:id` on tap. Used in both `<MovieRow>` (horizontal scroll context, fixed width) and `.results-grid` (grid context, fluid width — CSS handles the sizing difference via the `.results-grid .movie-card` override rule).

**`src/components/MovieRow/MovieRow.jsx`**  
Maps an array of movies into a horizontal flexbox row of `<MovieCard>` components. Used in Browse (Trending, Highest Rated) and MovieDetails (Similar Movies). Hides the scrollbar via CSS while keeping scroll functionality.

**`src/components/FilterPanel/FilterPanel.jsx`**  
A controlled component — it owns no state of its own. Takes `filters` (object) and `onChange` (function) as props. The parent always owns the filter state; FilterPanel just renders it and calls `onChange` with updated values. Fetches genre list from TMDB on first mount. Contains: genre multi-select pills, custom dual-handle year range slider (1950–2026), minimum rating dropdown (7+/8+/9+), original language dropdown (8 common languages), adult content checkbox.

The year slider is fully custom: a single track div with two absolutely-positioned thumb divs and a fill div between them. Dragging uses `setPointerCapture` on the thumb itself so events continue regardless of where the pointer moves on screen — solving the "sticks when moving off the track" problem.

---

### Recommendation Feature

**`src/features/recommended/components/RecommendedMovies.jsx`**  
Wrapper for the entire recommendation section. Holds `activeIndex` state tracking which card is currently on top. Renders a backdrop div (keyed to `activeMovie.id` so it remounts and fade-animates on each swipe), the section header with "See All" button (links to `/search`), and a flex row containing `<RecommendedStack>` and `<MovieDescription>`.

**`src/features/recommended/components/RecommendedStack.jsx`**  
Slices the movie array to show only `MAX_VISIBLE_CARDS` (4) at a time starting from `activeIndex`. Maps visible movies to `<StackCard>` components with their position index. When `activeIndex >= movies.length`, renders `<EmptyStack>` instead.

**`src/features/recommended/components/StackCard.jsx`**  
Renders one card in the stack. The top card (index 0) receives pointer event handlers from `useCardSwipe`. Its position, rotation, and fly-out animation are applied via inline styles computed from the swipe state. Non-top cards are positioned via a `positions` array (offset left and scaled down progressively) and are non-interactive.

**`src/features/recommended/components/MovieDescription.jsx`**  
Shows the active movie's title, star rating, year, and a 4-line-clamped overview. Keyed to `movie.id` so it re-mounts with a fade-in animation on every card change. Contains the "View Details" button which navigates to `/movie/:id`.

**`src/features/recommended/hooks/useCardSwipe.js`**  
Custom hook encapsulating all swipe logic. Tracks: `dragging` (boolean), `offsetX` (pixels moved), `flyOut` (boolean), `direction` (+1/-1). On pointer down, records start X. On pointer move, updates offsetX. On pointer up, checks if offsetX exceeds `SWIPE_THRESHOLD` (120px) — if yes, sets `flyOut: true`, waits `FLY_DURATION` (350ms) then increments `activeIndex` (clamped to `movieCount`) and resets. Also guards against re-triggering while a fly-out is already in progress.

**`src/features/recommended/constants/swipeConfig.js`**  
Single source of truth for all magic numbers: `MAX_RECOMMENDED_MOVIES = 10`, `MAX_VISIBLE_CARDS = 4`, `SWIPE_THRESHOLD = 120`, `CARD_ROTATION_FACTOR = 0.08`, `RETURN_DURATION = 250`, `FLY_DURATION = 350`.

---

### Services

**`src/services/tmdb.js`**  
All TMDB API calls live here. Reads `VITE_TMDB_API_KEY` from environment variables. Every function is a simple async fetch returning `response.json()`. No caching at this layer — caching is handled one level up in `recommendationEngine.js` for recommendations. Functions:

| Function | Endpoint | Used By |
|---|---|---|
| `getTrendingMovies()` | `/trending/movie/week` | Browse, Recommendation fallback |
| `getPopularMovies()` | `/movie/popular` | (available, not currently used in UI) |
| `getTopRatedMovies()` | `/movie/top_rated` | Browse |
| `searchMovies(query, page)` | `/search/movie` | Search (Simple mode), Recommendation Engine |
| `getGenres()` | `/genre/movie/list` | FilterPanel |
| `discoverMovies(filters, page)` | `/discover/movie` | Search (filters-only, Match Search), Recommendation Engine |
| `getMovieDetails(id)` | `/movie/{id}` | MovieDetails |
| `getMovieCredits(id)` | `/movie/{id}/credits` | MovieDetails (cast + director) |
| `getMovieVideos(id)` | `/movie/{id}/videos` | MovieDetails (trailer) |
| `getSimilarMovies(id)` | `/movie/{id}/similar` | MovieDetails, Recommendation Engine |

**`src/services/recentSearchesStorage.js`**  
LocalStorage abstraction for recent searches. Key: `movieapp_recent_searches`. Cap: 4 items. Deduplication is case-insensitive (searching "batman" then "Batman" keeps only the most recent). A search term is only saved when the user explicitly clicks the search button or presses Enter AND the results are non-empty. Functions: `getRecentSearches`, `addRecentSearch`, `removeRecentSearch`, `clearRecentSearches`. All functions return the updated array so callers can do `setState(addRecentSearch(term))` in one line.

**`src/services/watchlistStorage.js`**  
LocalStorage abstraction for the watchlist. Key: `movieapp_watchlist`. Stores full movie objects (not just IDs) so the Watchlist page can render posters and titles without a second API call. `addToWatchlist` deduplicates by `movie.id`. Functions: `getWatchlist`, `addToWatchlist`, `removeFromWatchlist`, `isInWatchlist`.

**`src/services/watchedStorage.js`**  
LocalStorage abstraction for watched movies. Key: `movieapp_watched`. Same structure as watchlist storage. Marking a movie as watched in `MovieDetails.jsx` also removes it from the watchlist (business rule: watched = done, no longer "to watch"). Functions: `getWatched`, `addToWatched`, `removeFromWatched`, `isWatched`.

---

### Utilities

**`src/utils/genreSort.js`**  
Two pure functions. `countGenreMatches(movie, pickedGenreIds)` counts how many of the user's picked genres appear in a movie's `genre_ids` array. `sortByGenreMatchCount(movies, pickedGenreIds)` sorts a movie array descending by that count. Returns a new array (no mutation). Used in Search results (when genre filters are active) and Match Search results to rank better-matching movies higher.

**`src/utils/mergeFilters.js`**  
`mergeFilters(yourFilters, partnerFilters, genreMode)` combines two filter objects into one for Match Search. Merge rules per field: genres → union of both sets (genreMode determines if TMDB call uses pipe-OR or comma-AND); year range → intersection (overlapping range between both people); minimum rating → max of the two (stricter wins); language → if only one person set it, use it as a native TMDB param; if both set different languages, store both as `languageOptions` for client-side filtering after fetch; adult content → AND (only if both allow it). Unset filters contribute no constraint.

**`src/utils/recommendationEngine.js`**  
The most complex utility. `getRecommendations(forceRefresh)` runs the full algorithm and returns up to 10 scored movies. Uses `sessionStorage` (not `localStorage`) for caching so recommendations refresh on each new browser session but persist through page navigations within a session. `invalidateRecommendationCache()` clears the cache — called by MovieDetails whenever the user adds to watchlist or marks as watched, so the next Browse visit reflects the new activity.

---

## 4. Data Storage (What, Where, How)

The application has no backend. All persistence is via the browser's **LocalStorage** and **SessionStorage**.

### LocalStorage (persists across sessions)

| Key | Type | Contents | Max Size | Managed By |
|---|---|---|---|---|
| `movieapp_watchlist` | JSON array | Full movie objects `{id, title, poster_path, backdrop_path, genre_ids, genres, vote_average, overview, release_date, ...}` | Unlimited | `watchlistStorage.js` |
| `movieapp_watched` | JSON array | Full movie objects (same shape as watchlist) | Unlimited | `watchedStorage.js` |
| `movieapp_recent_searches` | JSON array of strings | Search query strings e.g. `["batman", "inception", "dune"]` | Max 4 items | `recentSearchesStorage.js` |

### SessionStorage (clears when tab/browser is closed)

| Key | Type | Contents | Managed By |
|---|---|---|---|
| `movieapp_rec_cache` | JSON array | Up to 10 scored movie objects from the recommendation engine | `recommendationEngine.js` |

### What is NOT stored

- No user account or identity
- No viewing history beyond explicit "Mark Watched" actions
- No API responses cached in storage (except recommendations via sessionStorage)
- No preferences or settings

---

## 5. Pages — Purpose and Operations

### Browse (`/`)

**Purpose:** Main discovery page. Shows personalized recommendations, trending movies, and highest-rated movies.

**On mount:**
1. Calls `getRecommendations()` — checks sessionStorage cache first, runs full algorithm if cache is empty
2. Calls `getTrendingMovies()` and `getTopRatedMovies()` concurrently
3. Sets three state arrays: `recommended`, `trending`, `topRated`
4. Sets `loading = false`

**User interactions:**
- Drag a recommendation card → fly-out animation, next card comes forward, backdrop and description cross-fade
- Tap "See All" → navigates to `/search`
- Tap "View Details" in description → navigates to `/movie/:id`
- Tap any movie card in Trending/Highest Rated → navigates to `/movie/:id`

---

### Search (`/search`)

**Purpose:** Find movies by name, by filters, or by combining both people's taste preferences.

**Simple Search flow:**
1. User types in search bar → 500ms debounce fires → `debouncedQuery` updates → `useEffect` triggers `runSearch(1, true)`
2. User opens filter panel via icon button → sets filters → 500ms debounce fires → `debouncedFilters` updates → `runSearch(1, true)` again
3. `runSearch` decides: name filled → `searchMovies()` → optionally apply client-side filters + genre sort; filters only → `discoverMovies()` → genre sort; neither → clear results
4. IntersectionObserver on sentinel div triggers `loadNextPage()` when user scrolls to bottom
5. Search term saved to recent searches only when user presses Enter or clicks the search button AND results are non-empty

**Match Search flow:**
1. User picks "You" tab → opens filter panel → sets preferences → closes panel
2. User picks "Partner" tab → opens filter panel → sets preferences → closes panel
3. User optionally toggles genre matching mode (Any / Both)
4. User taps "Find Matches" → `mergeFilters()` combines both filter objects → `discoverMovies(merged)` → client-side language OR filter if both picked different languages → genre sort if mode is "any" → results displayed
5. "Load More" button fetches next page and appends

---

### Movie Details (`/movie/:id`)

**Purpose:** Full information page for a single movie.

**On mount:**
1. Reads `:id` from URL params
2. Scrolls to top (`window.scrollTo(0, 0)`)
3. Fires four concurrent TMDB calls: details, credits, videos, similar
4. Checks LocalStorage to set `inWatchlist` and `inWatched` initial button states
5. Finds the best YouTube trailer from videos response (prefers type "Trailer", falls back to any YouTube video)

**User interactions:**
- Back button → `navigate(-1)` (browser history back)
- Add to Watchlist → saves full movie object to LocalStorage, updates button to "Saved" state, invalidates recommendation cache
- Mark Watched → saves to watched storage, if movie was in watchlist removes it from there, invalidates recommendation cache
- Trailer thumbnail → opens `youtube.com/watch?v=...` in new tab
- Official Website → opens homepage in new tab
- Similar movie card → navigates to that movie's details page

---

### Watchlist (`/watchlist`)

**Purpose:** View and manage saved movies.

**On mount:** Reads all watchlist movies from LocalStorage into component state.

**User interactions:**
- Tap movie card → navigates to `/movie/:id`
- Tap ✕ on card → calls `removeFromWatchlist(movieId)`, updates state immediately (optimistic UI, no re-fetch needed)
- Watchlist toggle on MovieDetails also keeps this page in sync (both read from the same LocalStorage key)

---

## 6. Features — How They Work End to End

### Recommendation Card Stack

The stack shows 4 cards at a time from a pool of up to 10 recommendations. Cards are absolutely positioned within a relative container, offset by 35px each and scaled down 10% each level to create a depth illusion.

When the user drags the top card:
1. `useCardSwipe` tracks pointer position delta
2. Inline styles update `translateX` and `rotate` in real-time (no re-render throttling needed, CSS handles the frame rate)
3. On pointer release: if delta < 120px, card snaps back (CSS transition); if delta ≥ 120px, `flyOut` state is set
4. Fly-out: card transforms off-screen (`translateX(±150%)`) with a 350ms CSS transition
5. After 350ms, `activeIndex` increments (clamped to movie count), swipe state resets
6. `RecommendedStack` re-slices the movie array from the new `activeIndex`, new card appears at the back
7. `RecommendedMovies` re-renders with `activeMovie` pointing to the new top card — backdrop div remounts with a new `key`, triggering the `fade-in` CSS animation; `MovieDescription` also remounts due to `key={movie.id}` for its own fade

### Filter Panel (Dual-Handle Year Slider)

The slider is fully custom — no native `<input type="range">` elements. A single track div contains: a fill div (absolutely positioned, width and left computed from `toPercent()` of current yearFrom/yearTo values) and two thumb divs (absolutely positioned by `left: ${toPercent(value)}%`).

Dragging works via pointer capture: on `pointerdown` on a thumb, `e.currentTarget.setPointerCapture(e.pointerId)` is called. This tells the browser to route all subsequent pointer events to that element regardless of where the pointer physically is — the slider never "sticks" even if the user drags far above or below the track.

### Match Search Merge Algorithm

Given two filter objects (yours and partner's), `mergeFilters` produces one combined object:

```
Genres:    Union(yours, partner's) → one TMDB call with combined list
           genreMode "any" → pipe-separated (OR): "28|35|18"
           genreMode "both" → comma-separated (AND): "28,35,18"

Year:      yearFrom = max(yourFrom, partnerFrom)  ← intersection start
           yearTo   = min(yourTo, partnerTo)       ← intersection end

Rating:    minRating = max(yours, partner's)       ← stricter wins

Language:  1 language set → native TMDB param
           2 different languages → client-side OR filter after fetch

Adult:     includeAdult = yours AND partner's      ← both must allow it
```

---

## 7. API Layer — TMDB Integration

**Base URL:** `https://api.themoviedb.org/3`  
**Auth:** API key appended as `?api_key=` query param on every request  
**Images:** `https://image.tmdb.org/t/p/{size}{path}` — sizes used: `w500` (posters), `original` (backdrops), `hqdefault` via YouTube for trailer thumbnails  
**No rate limiting** is implemented client-side — TMDB's free tier allows ~40 requests/10 seconds which this app will not exceed in normal usage

**Genre IDs** are stable integers (Action = 28, Comedy = 35, Drama = 18, etc.). The genre list is fetched once per `FilterPanel` mount rather than hardcoded, in case TMDB ever adds new genres.

**`/discover/movie` filter params used:**

| Filter | TMDB Param | Notes |
|---|---|---|
| Genres (OR) | `with_genres=28\|35` | Pipe separator = OR |
| Genres (AND) | `with_genres=28,35` | Comma separator = AND |
| Year from | `primary_release_date.gte=2010-01-01` | Full date required |
| Year to | `primary_release_date.lte=2020-12-31` | Full date required |
| Language | `with_original_language=en` | ISO 639-1 code |
| Min rating | `vote_average.gte=7` | Number |
| Adult | `include_adult=false` | Boolean |

---

## 8. Algorithm — Recommendation Engine

Located in `src/utils/recommendationEngine.js`.

### Signal Sources and Weights

| Signal | Source | TMDB Call | Points per Movie |
|---|---|---|---|
| Watched movies | `watchedStorage` | `getSimilarMovies(id)` for last 3 watched | +3 |
| Watchlist genres | `watchlistStorage` | `discoverMovies({genres})` | +2 |
| Search history | `recentSearchesStorage` | `searchMovies(query)` top 5 results, last 4 queries | +1 |

### Scoring Process

1. Build `excludeIds` set from all watched + watchlist movie IDs
2. For each signal source, fetch results concurrently
3. For each result movie: if in `excludeIds` or has no poster, skip; otherwise add to a `pools` object keyed by `movie.id` with a cumulative `score`
4. A movie appearing in multiple signal pools accumulates points from each
5. Sort `pools` values descending by `score`, take top 10
6. If no signals exist (new user), fall back to trending movies

### Caching

Results are stored in `sessionStorage` under `movieapp_rec_cache`. The cache is:
- **Read** at the start of every `getRecommendations()` call
- **Written** after every successful algorithm run
- **Invalidated** (deleted) when the user adds/removes from watchlist or marks a movie as watched
- **Cleared automatically** when the browser tab is closed (sessionStorage behavior)

This means: within a session, Browse loads fast (cache hit). After any watchlist/watched action, the next Browse visit re-runs the full algorithm to reflect the change.

---

## 9. Frontend vs Backend Reality

### Current Architecture (Frontend Only)

```
User's Browser
│
├── React App (UI + State)
│   ├── Component State (useState) — ephemeral, lost on navigation
│   ├── LocalStorage — persistent, device-only
│   └── SessionStorage — session-scoped, tab-only
│
└── TMDB API (external, read-only)
    └── All movie data comes from here
        No writes, no user accounts on TMDB's end
```

### What a Full-Stack Version Would Look Like

If the project migrates to a backend (the roadmap mentions this possibility), the architecture would look like:

```
User's Browser
│
├── React App (UI only)
│   └── API calls to your own backend instead of LocalStorage
│
└── Your Backend (Node/Express or similar)
    ├── Auth (user accounts, JWT tokens)
    ├── Database (PostgreSQL / MongoDB)
    │   ├── users table
    │   ├── watchlist table (userId, movieId, addedAt)
    │   ├── watched table (userId, movieId, watchedAt)
    │   └── search_history table (userId, query, searchedAt)
    └── TMDB API calls (proxied through backend to hide API key)
```

### Migration Path

The storage abstraction layer (`watchlistStorage.js`, `watchedStorage.js`, `recentSearchesStorage.js`) was intentionally designed to make this migration easy. Every component calls functions like `addToWatchlist(movie)` and `getWatchlist()` — not `localStorage.setItem(...)` directly. To migrate:

- Replace the body of each storage service file with `fetch()` calls to your own API
- No component code changes needed
- The recommendation engine reads from these services too, so it also migrates automatically

---

## 10. Known Limitations and Future Plans

### Current Limitations

**No user accounts** — data is device-specific. Clearing browser storage wipes all watchlist/watched/search data with no recovery.

**No error handling** — if a TMDB call fails (network error, rate limit, bad ID), the app either shows a blank section or crashes. No error boundaries are implemented yet.

**No loading skeletons** — "Loading..." text is shown instead of skeleton placeholder cards. This makes the UI feel less polished during data fetches.

**Combined search limitation** — when both a text query AND filters are active in Simple Search, TMDB's `/search/movie` endpoint doesn't accept filter params. Filtering is applied client-side on the returned page of results only — not the full catalog. A search for "Batman" filtered to "Rating 8+" only checks whether the 20 Batman results on page 1 have rating 8+, not all Batman movies in TMDB.

**Recommendation cold start** — new users see trending movies rather than genuinely personalized recommendations until they build up watch/search history.

**No PWA support** — the app can't be "installed" to a mobile home screen yet. No manifest.json, no service worker.

**Genre data on watchlist** — movies saved from list endpoints (Browse/Search) have `genre_ids` (flat ID array) while movies saved from the Details page have `genres` (array of `{id, name}` objects). The recommendation engine handles both formats but this inconsistency could cause subtle bugs.

### Planned Phases

**Phase 7 — Performance:**
- Skeleton loaders on Browse, Search, Movie Details
- `loading="lazy"` on all images
- Error boundaries with graceful fallback UI

**Phase 8 — Final Polish:**
- 404 page
- Page transition animations
- Dynamic `<title>` tags per page
- PWA manifest for mobile install
- Toast notifications for watchlist/watched actions
- Active watchlist count badge on navbar

**Future (Post-Internship):**
- Full-stack migration (Node backend + database)
- Real user authentication
- Cross-device sync
- Social features (share watchlists, see what friends watched)
- Advanced recommendation (TMDB "Recommendations" endpoint, keyword matching)

---

*Document generated: July 2026*  
*Project: Cine Buddy — Internship Project*
