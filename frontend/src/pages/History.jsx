import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

import ReportTable from "../components/ReportTable";
import ExportModal from "../components/ExportModal";


function History() {

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);
  const [showExport, setShowExport] = useState(false);

  const navigate = useNavigate();


  // ==========================================================
  // Fetch Reports
  // ==========================================================

  useEffect(() => {

    fetchReports();

  }, []);


  async function fetchReports() {

    try {

      setLoading(true);

      const response = await api.get(
        "/reports/"
      );

      setReports(
        response.data.reports
      );

    }

    catch (error) {

      console.error(
        "History Error:",
        error
      );

      toast.error(
        "Failed to load reports."
      );

    }

    finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // View Report
  // ==========================================================

  function handleView(reportId) {

    navigate(
      `/report/${reportId}`
    );

  }


  // ==========================================================
  // Delete Report
  // ==========================================================

  async function handleDelete(reportId) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone."
    );


    if (!confirmed) {

      return;

    }


    try {

      setDeletingId(reportId);


      await api.delete(
        `/reports/${reportId}`
      );


      // Remove deleted report from UI

      setReports(
        (currentReports) =>
          currentReports.filter(
            (report) =>
              report.id !== reportId
          )
      );


      toast.success(
        "Report deleted successfully."
      );

    }

    catch (error) {

      console.error(
        "Delete Report Error:",
        error
      );


      if (
        error.response &&
        error.response.status === 404
      ) {

        toast.error(
          "Report not found."
        );

      }

      else {

        toast.error(
          "Failed to delete report."
        );

      }

    }

    finally {

      setDeletingId(null);

    }

  }


  // ==========================================================
  // Loading State
  // ==========================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-gray-50
          flex
          justify-center
          items-center
        "
      >

        <div className="text-center">

          <div className="text-5xl mb-4">
            📋
          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-teal-700
            "
          >
            Loading Reports...
          </h2>

        </div>

      </div>

    );

  }


  // ==========================================================
  // Page
  // ==========================================================

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        py-10
        px-6
      "
    >

      <div className="max-w-7xl mx-auto">


        {/* ==================================================
            Header
        ================================================== */}

        <div className="mb-8">

          <p
            className="
              text-sm
              text-emerald-600
              font-semibold
              uppercase
              tracking-wide
            "
          >
            Patient Records
          </p>


          <h1
            className="
              text-4xl
              font-bold
              text-gray-800
              mt-2
            "
          >
            🩸 Blood Report History
          </h1>


          <p
            className="
              text-gray-500
              mt-2
            "
          >
            View and manage your previously uploaded
            blood reports.
          </p>

        </div>

        {reports.length > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowExport(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
            >
              &#x1F4E5; Export as CSV
            </button>
          </div>
        )}


        {/* ==================================================
            Empty State
        ================================================== */}

        {reports.length === 0 ? (

          <div
            className="
              bg-white
              rounded-2xl
              shadow-lg
              p-12
              text-center
            "
          >

            <div className="text-6xl mb-5">
              📄
            </div>


            <h2
              className="
                text-2xl
                font-bold
                text-gray-800
              "
            >
              No Reports Found
            </h2>


            <p
              className="
                text-gray-500
                mt-2
              "
            >
              Upload a blood report to see it here.
            </p>


            <button
              onClick={() => navigate("/")}
              className="
                mt-6
                bg-emerald-600
                hover:bg-teal-700
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
              "
            >
              Upload Report
            </button>

          </div>

        ) : (

          <ReportTable
            reports={reports}
            onView={handleView}
            onDelete={handleDelete}
            deletingId={deletingId}
          />

        )}

      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}

    </div>

  );

}


export default History;
