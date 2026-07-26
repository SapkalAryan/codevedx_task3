import { createContext, useContext, useEffect, useState } from "react";
import WatchedService from "../services/watched";
import { EventBus, AppEvents } from "../events";

const WatchedContext = createContext(null);

export function WatchedProvider({ children }) {
  const [watched, setWatched] = useState([]);

  const refresh = () => {
    setWatched(WatchedService.getAll());
  };

  useEffect(() => {
    refresh();

    const unsubscribe = EventBus.on(
      AppEvents.WATCHED_CHANGED,
      refresh
    );

    return unsubscribe;
  }, []);

  const value = {
    watched,
    count: watched.length,
    refresh,
  };

  return (
    <WatchedContext.Provider value={value}>
      {children}
    </WatchedContext.Provider>
  );
}

export function useWatchedContext() {
  const context = useContext(WatchedContext);

  if (!context) {
    throw new Error(
      "useWatchedContext must be used inside WatchedProvider"
    );
  }

  return context;
}