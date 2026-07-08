import { useEffect, useState } from "react";
import api from "../services/api";
import ReportTable from "../components/ReportTable";

function History() {

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchReports();

  }, []);

  async function fetchReports() {

    try {

      const response = await api.get("/reports/");

      setReports(response.data.reports);

    }

    catch (error) {

      console.error(error);

      alert("Failed to load reports.");

    }

    finally {

      setLoading(false);

    }

  }

  function handleView(reportId) {

    alert(`View report ${reportId} (coming in next commit)`);

  }

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <h2 className="text-2xl font-bold">

          Loading Reports...

        </h2>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-700 mb-8">

          🩸 Blood Report History

        </h1>

        <ReportTable

          reports={reports}

          onView={handleView}

        />

      </div>

    </div>

  );

}

export default History;