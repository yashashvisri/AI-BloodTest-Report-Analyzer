import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";
import DoctorDashboard from "./pages/DoctorDashboard";\nimport Settings from "./pages/Settings";
import ReportDetails from "./pages/ReportDetails";
import NotFound from "./pages/NotFound";


function App() {

  return (

    <div className="min-h-screen flex flex-col bg-slate-100">
      <ScrollToTop />
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

          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </main>

      <Footer />

    </div>

  );

}


export default App;