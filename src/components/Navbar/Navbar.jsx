import { NavLink } from "react-router-dom";
import { FaHome, FaBookmark, FaSearch } from "react-icons/fa";

function Navbar() {
    return (
        <nav className="bottom-nav">

            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
                end
            >
                <FaHome />
                <span>Home</span>
            </NavLink>

            <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
            >
                <FaBookmark />
                <span>Watchlist</span>
            </NavLink>

            <NavLink
                to="/search"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
            >
                <FaSearch />
                <span>Search</span>
            </NavLink>

        </nav>
    );
}

export default Navbar;