import { useRef, useState } from "react";

import toast from "react-hot-toast";

import api from "../services/api";
import DashboardStats from "../components/DashboardStats";

import StatusBadge from "../components/StatusBadge";
import AnalysisTable from "../components/AnalysisTable";
import SummaryCard from "../components/SummaryCard";
import DietPlan from "../components/DietPlan";
import HealthRiskScore from "../components/HealthRiskScore";
import ReportChat from "../components/ReportChat";
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
        "Analysis completed successfully! Email notification sent!"
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
            Dashboard Stats
        ================================================== */}
        
        <DashboardStats />

        {/* ==================================================
            Feature Cards
        ================================================== */}

        <FeatureCards />


        {/* ==================================================
            Upload Section
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 mt-10">
          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-teal-700 to-indigo-700 bg-clip-text text-transparent">
            Upload Blood Report
          </h2>
          <p className="text-center text-gray-500 mt-3 font-medium">
            Upload your PDF blood report to begin your AI analysis.
          </p>

          {/* Patient Name */}
          <div className="mt-10 max-w-2xl mx-auto">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Patient Name
            </label>
            <input
              type="text"
              placeholder="Enter patient's full name"
              value={patientName}
              onChange={(event) => setPatientName(event.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
            />
          </div>

          {/* Upload Area */}
          <div className="mt-8 max-w-2xl mx-auto border-2 border-dashed border-blue-200 rounded-3xl p-12 text-center bg-emerald-50/50 hover:bg-emerald-50 hover:border-blue-400 transition-all duration-300 group cursor-pointer" onClick={chooseFile}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
              📄
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Click to upload your report
            </h3>
            <p className="text-gray-500 mt-2 font-medium">
              PDF files only (Max 10MB)
            </p>

            <button
              onClick={(e) => { e.stopPropagation(); chooseFile(); }}
              className="mt-8 bg-white border border-blue-200 hover:border-emerald-500 text-teal-700 px-8 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all"
            >
              Browse Files
            </button>

            {/* Selected File */}
            {selectedFile && (
              <div className="mt-8 bg-white border border-green-200 rounded-xl p-5 shadow-sm inline-block w-full text-left flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-bold text-sm uppercase tracking-wide">
                    ✓ Selected File
                  </p>
                  <p className="text-gray-700 mt-1 font-medium truncate max-w-xs md:max-w-md">
                    {selectedFile.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload / Analyze Button */}
          <div className="max-w-2xl mx-auto mt-10">
            <button
              onClick={reportId ? analyzeReport : uploadReport}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-teal-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-5 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : reportId ? (
                "Analyze with AI"
              ) : (
                "Upload & Continue"
              )}
            </button>
          </div>
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
                  text-teal-700
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
              summary={analysisResult.ai_summary}
              reportId={analysisResult.report_id}
            />

            {/* Health Risk Score */}
            <HealthRiskScore reportId={analysisResult.report_id} />

            {/* Diet Plan */}
            <DietPlan reportId={analysisResult.report_id} />

            {/* Chat */}
            <ReportChat reportId={analysisResult.report_id} />

          </>

        )}

      </div>

    </div>

  );

}


export default Home;