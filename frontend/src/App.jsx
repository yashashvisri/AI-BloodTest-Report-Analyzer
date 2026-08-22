import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import History from "./pages/History";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">

      <Navbar />

      <main className="flex-1">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/history"
            element={<History />}
          />

        </Routes>

      </main>

      <Footer />

    </div>
  );
}

export default App;