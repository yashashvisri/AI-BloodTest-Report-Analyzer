import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import History from "./pages/History";
import ReportDetails from "./pages/ReportDetails";


function App() {

  return (

    <div className="min-h-screen flex flex-col bg-slate-100">

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />

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

          <Route
            path="/report/:reportId"
            element={<ReportDetails />}
          />

        </Routes>

      </main>

      <Footer />

    </div>

  );

}


export default App;