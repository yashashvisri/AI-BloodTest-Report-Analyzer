import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <span className="text-white font-extrabold text-xl">AI</span>
        </div>
        <span className="text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent tracking-tight hidden md:block">
          BloodTest Analyzer
        </span>
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="font-semibold text-gray-700 mr-2">Hi, {user.username}</span>
            {user.role === 'doctor' ? (
              <Link to="/doctor" className="font-bold text-teal-600 hover:text-emerald-700 transition-colors">
                Clinic Dashboard
              </Link>
            ) : (
              <Link to="/history" className="font-bold text-gray-500 hover:text-emerald-600 transition-colors">
                History
              </Link>
            )}
            <button onClick={logout} className="font-bold text-gray-500 hover:text-rose-600 transition-colors">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="font-bold text-gray-500 hover:text-emerald-600 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="bg-emerald-600 text-white font-bold px-5 py-2 rounded-lg shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
