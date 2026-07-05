import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function Header() {
  return (
    <header className="app-header">
      <div className="app-header-brand">
        <span className="app-header-logo">🎬</span>
        <h1 className="app-header-title">Cine Buddy</h1>
      </div>

      <Link to="/my-movies" className="app-header-btn" aria-label="My Movies">
        <FaCheckCircle />
      </Link>
    </header>
  );
}

export default Header;