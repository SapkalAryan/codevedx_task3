import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationConfig from "./services/notification/notificationConfig";

import Browse from "./pages/Browse/Browse";
import Search from "./pages/Search/Search";
import Watchlist from "./pages/Watchlist/Watchlist";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import MyMovies from "./pages/MyMovies/MyMovies";
import RecommendedAll from "./pages/RecommendedAll/RecommendedAll";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/my-movies" element={<MyMovies />} />
        <Route path="/recommended" element={<RecommendedAll />} />
      </Routes>

      <ToastContainer {...notificationConfig} />
    </>
  );
}