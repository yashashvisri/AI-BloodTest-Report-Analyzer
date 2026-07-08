import { useRef, useState } from "react";
import api from "../services/api";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);

  function chooseFile() {
    fileInputRef.current.click();
  }

  function handleFileChange(event) {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }

  async function uploadReport() {
    if (!patientName.trim()) {
      alert("Please enter patient name.");
      return;
    }

    if (!selectedFile) {
      alert("Please choose a PDF.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("patient_name", patientName);
      formData.append("file", selectedFile);

      const response = await api.post("/reports/upload", formData);

      setReportId(response.data.report.id);

      alert(
        `Report Uploaded Successfully!\n\nReport ID : ${response.data.report.id}`
      );
    } catch (error) {
      console.error(error);
      alert("Upload Failed.");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeReport() {
    try {
      setLoading(true);

      const response = await api.post(`/reports/analyze/${reportId}`);

      setAnalysisResult(response.data);

    } catch (error) {
      console.error(error);
      alert("Analysis Failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center py-10">

      <div className="bg-white rounded-2xl shadow-xl w-[800px] p-10">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          AI Blood Test Report Analyzer
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Upload your blood report and receive an AI-powered analysis.
        </p>

        <input
          type="text"
          placeholder="Enter Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="mt-8 w-full border rounded-lg p-3"
        />

        <div className="mt-8 border-2 border-dashed border-blue-300 rounded-xl p-10 text-center">

          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={chooseFile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
          >
            Choose PDF
          </button>

          {selectedFile && (
            <p className="mt-5 text-green-700 font-semibold">
              {selectedFile.name}
            </p>
          )}

        </div>

        <button
          onClick={reportId ? analyzeReport : uploadReport}
          disabled={loading}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          {loading
            ? "Processing..."
            : reportId
            ? "Analyze Report"
            : "Upload Report"}
        </button>

        {analysisResult && (
          <div className="mt-10 bg-slate-100 rounded-xl p-6">

            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Analysis Result
            </h2>

            <pre className="whitespace-pre-wrap text-sm overflow-auto">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>

          </div>
        )}

      </div>

    </div>
  );
}

export default Home;