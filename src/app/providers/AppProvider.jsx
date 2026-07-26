import { WatchlistProvider } from "../../context/WatchlistContext";
import { WatchedProvider } from "../../context/WatchedContext";

export default function AppProvider({ children }) {
  return (
    <WatchlistProvider>
      <WatchedProvider>
        {children}
      </WatchedProvider>
    </WatchlistProvider>
  );
}