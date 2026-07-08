import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-lg">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <h1 className="text-2xl font-bold">
          🩸 AI Blood Analyzer
        </h1>

        <div className="flex gap-6">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-semibold ${
                isActive
                  ? "text-yellow-300"
                  : "text-white hover:text-gray-200"
              }`
            }
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `font-semibold ${
                isActive
                  ? "text-yellow-300"
                  : "text-white hover:text-gray-200"
              }`
            }
          >
            📋 History
          </NavLink>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;