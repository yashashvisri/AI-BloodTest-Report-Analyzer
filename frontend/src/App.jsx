import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import History from "./pages/History";


function App() {

  return (

    <div className="min-h-screen flex flex-col bg-slate-100">

      {/* Toast Notifications */}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />

      {/* Navigation */}

      <Navbar />

      {/* Main Application */}

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

      {/* Footer */}

      <Footer />

    </div>

  );

}


export default App;