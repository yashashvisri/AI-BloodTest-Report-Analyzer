import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      style={{ backgroundColor: darkMode ? "#6d28d9" : "#d1d5db" }}
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-sm ${
          darkMode ? "translate-x-7" : "translate-x-0.5"
        }`}
      >
        {darkMode ? "\u{1F319}" : "\u{2600}\uFE0F"}
      </div>
    </button>
  );
}
