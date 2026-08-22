import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

import ReportTable from "../components/ReportTable";


function History() {

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


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


  function handleView(reportId) {

    navigate(
      `/report/${reportId}`
    );

  }


  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-slate-100
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
              text-blue-700
            "
          >
            Loading Reports...
          </h2>

        </div>

      </div>

    );

  }


  return (

    <div
      className="
        min-h-screen
        bg-slate-100
        py-10
        px-6
      "
    >

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <p
            className="
              text-sm
              text-blue-600
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
            View and access your previously uploaded
            blood reports.
          </p>

        </div>


        <ReportTable
          reports={reports}
          onView={handleView}
        />

      </div>

    </div>

  );

}


export default History;