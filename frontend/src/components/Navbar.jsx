import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          🏥 AI Blood Analyzer
        </h1>

        <div className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`
            }
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`
            }
          >
            📜 History
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;