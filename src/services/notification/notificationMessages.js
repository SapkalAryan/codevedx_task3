const notificationMessages = {
  watchlistAdded: (title) =>
    `Added "${title}" to Watchlist`,

  watchlistRemoved: (title) =>
    `Removed "${title}" from Watchlist`,

  watchedAdded: (title) =>
    `Marked "${title}" as Watched`,

  watchedRemoved: (title) =>
    `Removed "${title}" from Watched`,

  removedFromWatchlist:
    "Removed from Watchlist",

  networkError:
    "Network Error. Please try again.",

  unknownError:
    "Something went wrong.",

  loginRequired:
    "Please login to continue.",

  sessionExpired:
    "Your session has expired.",
};

export default notificationMessages;