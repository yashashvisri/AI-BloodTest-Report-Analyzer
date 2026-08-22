import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

import AnalysisTable from "../components/AnalysisTable";
import SummaryCard from "../components/SummaryCard";


function ReportDetails() {

  const { reportId } = useParams();

  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  const [analysisResult, setAnalysisResult] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    loadReport();

  }, [reportId]);


  async function loadReport() {

    try {

      setLoading(true);


      // ------------------------------------------------------
      // Get report information
      // ------------------------------------------------------

      const reportResponse = await api.get(
        `/reports/${reportId}`
      );


      setReport(
        reportResponse.data
      );


      // ------------------------------------------------------
      // Get report analysis
      // ------------------------------------------------------

      const analysisResponse = await api.post(
        `/reports/analyze/${reportId}`
      );


      setAnalysisResult(
        analysisResponse.data
      );

    }

    catch (error) {

      console.error(
        "Report Details Error:",
        error
      );


      toast.error(
        "Failed to load report."
      );

    }

    finally {

      setLoading(false);

    }

  }


  // ----------------------------------------------------------
  // Loading State
  // ----------------------------------------------------------

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
            🩸
          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-blue-700
            "
          >
            Loading Report...
          </h2>

          <p className="text-gray-500 mt-2">
            Fetching your blood report analysis.
          </p>

        </div>

      </div>

    );

  }


  // ----------------------------------------------------------
  // Error State
  // ----------------------------------------------------------

  if (!report || !analysisResult) {

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

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-10
            text-center
          "
        >

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-gray-800
            "
          >
            Report Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            We couldn't load this blood report.
          </p>

          <button
            onClick={() => navigate("/history")}
            className="
              mt-6
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-lg
              font-semibold
            "
          >
            Back to History
          </button>

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


        {/* --------------------------------------------------
            Back Button
        -------------------------------------------------- */}

        <button
          onClick={() => navigate("/history")}
          className="
            mb-6
            text-blue-600
            hover:text-blue-800
            font-semibold
          "
        >
          ← Back to Report History
        </button>


        {/* --------------------------------------------------
            Report Header
        -------------------------------------------------- */}

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-8
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:justify-between
              md:items-center
              gap-6
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Blood Test Report
              </p>

              <h1
                className="
                  text-4xl
                  font-bold
                  text-blue-700
                  mt-2
                "
              >
                {report.patient_name}
              </h1>

            </div>


            <div
              className="
                bg-blue-50
                rounded-xl
                px-6
                py-4
              "
            >

              <p className="text-sm text-gray-500">
                Report ID
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-blue-700
                "
              >
                #{report.id}
              </p>

            </div>

          </div>


          {/* File Information */}

          <div
            className="
              mt-8
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >

            <div
              className="
                bg-slate-50
                rounded-lg
                p-4
              "
            >

              <p className="text-sm text-gray-500">
                Original File
              </p>

              <p
                className="
                  font-semibold
                  text-gray-700
                  mt-1
                  break-all
                "
              >
                {report.original_filename}
              </p>

            </div>


            <div
              className="
                bg-slate-50
                rounded-lg
                p-4
              "
            >

              <p className="text-sm text-gray-500">
                Analysis Type
              </p>

              <p
                className="
                  font-semibold
                  text-gray-700
                  mt-1
                "
              >
                {analysisResult.cached
                  ? "Cached Analysis"
                  : "Fresh Analysis"
                }
              </p>

            </div>

          </div>

        </div>


        {/* --------------------------------------------------
            Blood Parameters
        -------------------------------------------------- */}

        <AnalysisTable
          analysis={analysisResult.analysis}
        />


        {/* --------------------------------------------------
            AI Summary
        -------------------------------------------------- */}

        <SummaryCard
          summary={analysisResult.ai_summary}
        />


        {/* --------------------------------------------------
            Disclaimer
        -------------------------------------------------- */}

        <div
          className="
            mt-8
            bg-yellow-50
            border
            border-yellow-200
            rounded-xl
            p-5
          "
        >

          <p
            className="
              text-sm
              text-yellow-800
            "
          >
            ⚠️ This AI-generated analysis is for
            informational and educational purposes only.
            It is not a medical diagnosis. Please consult
            a qualified healthcare professional for medical
            advice and interpretation of your results.
          </p>

        </div>

      </div>

    </div>

  );

}


export default ReportDetails;