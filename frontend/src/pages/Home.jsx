import { useRef, useState } from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import AnalysisTable from "../components/AnalysisTable";
import SummaryCard from "../components/SummaryCard";
import Hero from "../components/Hero";
import FeatureCards from "../components/FeatureCards";


function Home() {

  const [selectedFile, setSelectedFile] = useState(null);

  const [patientName, setPatientName] = useState("");

  const [loading, setLoading] = useState(false);

  const [reportId, setReportId] = useState(null);

  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);


  // ==========================================================
  // Choose PDF
  // ==========================================================

  function chooseFile() {

    fileInputRef.current.click();

  }


  // ==========================================================
  // Handle File Selection
  // ==========================================================

  function handleFileChange(event) {

    if (event.target.files.length > 0) {

      setSelectedFile(event.target.files[0]);

    }

  }


  // ==========================================================
  // Upload Report
  // ==========================================================

  async function uploadReport() {

    // Validate patient name

    if (!patientName.trim()) {

      toast.error(
        "Please enter patient name."
      );

      return;

    }


    // Validate file

    if (!selectedFile) {

      toast.error(
        "Please choose a PDF."
      );

      return;

    }


    try {

      setLoading(true);


      const formData = new FormData();


      formData.append(
        "patient_name",
        patientName
      );


      formData.append(
        "file",
        selectedFile
      );


      const response = await api.post(
        "/reports/upload",
        formData
      );


      // Save report ID

      setReportId(
        response.data.report.id
      );


      // Success notification

      toast.success(
        `Report uploaded successfully! Report ID: ${response.data.report.id}`
      );

    }

    catch (error) {

      console.error(
        "Upload Error:",
        error
      );


      toast.error(
        "Upload failed. Please try again."
      );

    }

    finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // Analyze Report
  // ==========================================================

  async function analyzeReport() {

    if (!reportId) {

      toast.error(
        "Please upload a report first."
      );

      return;

    }


    try {

      setLoading(true);


      const response = await api.post(
        `/reports/analyze/${reportId}`
      );


      // Save analysis result

      setAnalysisResult(
        response.data
      );


      // Success notification

      toast.success(
        "Analysis completed successfully!"
      );

    }

    catch (error) {

      console.error(
        "Analysis Error:",
        error
      );


      toast.error(
        "Analysis failed. Please try again."
      );

    }

    finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="py-10 px-6">

      <div className="max-w-7xl mx-auto">


        {/* ==================================================
            Hero
        ================================================== */}

        <Hero />


        {/* ==================================================
            Feature Cards
        ================================================== */}

        <FeatureCards />


        {/* ==================================================
            Upload Section
        ================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            shadow-xl
            p-8
            mt-10
          "
        >

          <h2
            className="
              text-3xl
              font-bold
              text-center
              text-blue-700
            "
          >
            Upload Blood Report
          </h2>


          <p
            className="
              text-center
              text-gray-500
              mt-2
            "
          >
            Upload your PDF blood report to begin analysis.
          </p>


          {/* ==================================================
              Patient Name
          ================================================== */}

          <div className="mt-8">

            <label
              className="
                block
                font-semibold
                text-gray-700
                mb-2
              "
            >
              Patient Name
            </label>


            <input
              type="text"
              placeholder="Enter patient name"
              value={patientName}
              onChange={(event) =>
                setPatientName(event.target.value)
              }
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>


          {/* ==================================================
              Upload Area
          ================================================== */}

          <div
            className="
              mt-6
              border-2
              border-dashed
              border-blue-300
              rounded-2xl
              p-12
              text-center
              bg-blue-50
            "
          >

            <input
              type="file"
              accept=".pdf,application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />


            <div className="text-5xl mb-4">
              📄
            </div>


            <h3
              className="
                text-xl
                font-semibold
                text-gray-700
              "
            >
              Upload your blood report
            </h3>


            <p
              className="
                text-gray-500
                mt-2
              "
            >
              PDF files only
            </p>


            <button
              onClick={chooseFile}
              className="
                mt-6
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-8
                py-3
                rounded-lg
                font-semibold
                transition
              "
            >
              Choose PDF
            </button>


            {/* Selected File */}

            {selectedFile && (

              <div
                className="
                  mt-6
                  bg-white
                  border
                  border-green-200
                  rounded-lg
                  p-4
                "
              >

                <p
                  className="
                    text-green-700
                    font-semibold
                  "
                >
                  ✓ Selected File
                </p>


                <p
                  className="
                    text-gray-600
                    mt-1
                    break-all
                  "
                >
                  {selectedFile.name}
                </p>

              </div>

            )}

          </div>


          {/* ==================================================
              Upload / Analyze Button
          ================================================== */}

          <button
            onClick={
              reportId
                ? analyzeReport
                : uploadReport
            }
            disabled={loading}
            className="
              mt-8
              w-full
              bg-green-600
              hover:bg-green-700
              disabled:bg-gray-400
              text-white
              py-4
              rounded-xl
              text-lg
              font-semibold
              transition
            "
          >

            {loading

              ? "Processing..."

              : reportId

              ? "Analyze Report"

              : "Upload Report"

            }

          </button>

        </div>


        {/* ==================================================
            Analysis Result
        ================================================== */}

        {analysisResult && (

          <>

            {/* Report Details */}

            <div
              className="
                bg-white
                rounded-xl
                shadow-lg
                mt-10
                p-6
              "
            >

              <h2
                className="
                  text-3xl
                  font-bold
                  text-blue-700
                "
              >
                Report Details
              </h2>


              <div className="mt-5 space-y-2">

                <p>

                  <strong>
                    Patient Name:
                  </strong>{" "}

                  {patientName}

                </p>


                <p>

                  <strong>
                    Report ID:
                  </strong>{" "}

                  {analysisResult.report_id}

                </p>


                <p>

                  <strong>
                    Analysis Source:
                  </strong>{" "}

                  {analysisResult.cached

                    ? "Cached Analysis"

                    : "Fresh Analysis"

                  }

                </p>

              </div>

            </div>


            {/* Blood Parameters */}

            <AnalysisTable
              analysis={
                analysisResult.analysis
              }
            />


            {/* AI Summary */}

            <SummaryCard
              summary={
                analysisResult.ai_summary
              }
            />

          </>

        )}

      </div>

    </div>

  );

}


export default Home;