import { createContext, useContext, useEffect, useState } from "react";
import WatchlistService from "../services/watchlist";
import { EventBus, AppEvents } from "../events";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);

  const refresh = () => {
    setWatchlist(WatchlistService.getAll());
  };

  useEffect(() => {
    refresh();

    const unsubscribe = EventBus.on(
      AppEvents.WATCHLIST_CHANGED,
      refresh
    );

    return unsubscribe;
  }, []);

  const value = {
    watchlist,
    count: watchlist.length,
    refresh,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlistContext() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error(
      "useWatchlistContext must be used inside WatchlistProvider"
    );
  }

  return context;
}