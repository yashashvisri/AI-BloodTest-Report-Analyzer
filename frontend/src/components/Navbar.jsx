import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const navLink = "text-sm font-semibold text-white/50 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5";
  const activeLink = "text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg";

  return (
    <nav className="nav-glass sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">AI</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight hidden md:block">
            BloodTest <span className="text-emerald-400">Analyzer</span>
          </span>
        </Link>
        <div className="flex gap-1 items-center">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === 'doctor' ? (
                <Link to="/doctor" className={navLink}>Clinic</Link>
              ) : (
                <Link to="/history" className={navLink}>History</Link>
              )}
              <Link to="/compare" className={navLink}>Compare</Link>
              <Link to="/settings" className={navLink}>Settings</Link>
              {user.role === "admin" && (
                <Link to="/admin" className={navLink}>Admin</Link>
              )}
              <button onClick={logout} className={`${navLink} !text-rose-400/60 hover:!text-rose-400`}>Logout</button>
              <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={navLink}>Login</Link>
              <Link to="/signup" className="btn-primary text-white text-sm font-bold px-5 py-2 rounded-xl shadow-lg">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
