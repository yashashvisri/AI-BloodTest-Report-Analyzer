import { useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import MarkdownRenderer from "./MarkdownRenderer";

function DietPlan({ reportId }) {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  
  async function handleDownloadPDF() {
    try {
      setIsDownloading(true);
      const response = await api.get(`/diet/${reportId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `diet_plan_${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Diet Plan PDF downloaded!");
    } catch (error) {
      toast.error("Failed to download Diet Plan PDF");
    } finally {
      setIsDownloading(false);
    }
  }

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/reports/${reportId}/diet-plan`);
      setDietPlan(response.data.diet_plan);
      toast.success("Diet & Workout Plan generated!");
    } catch (error) {
      toast.error("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  if (!reportId) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-teal-100 p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-teal-800">
          🥗 Actionable Diet & Lifestyle Plan
        </h2>
        
        {!dietPlan && (
          <button
            onClick={generatePlan}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
          >
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        )}
      </div>

      {dietPlan && (
        <div className="bg-teal-50 rounded-xl p-6 border border-teal-100 relative">
          <MarkdownRenderer content={dietPlan} />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
            >
              {isDownloading ? "Generating PDF..." : "📄 Download as PDF"}
            </button>
          </div>
        </div>
      )}
      
      {!dietPlan && !loading && (
        <div className="text-center py-6">
          <p className="text-gray-500">
            Click the button above to generate a highly personalized 7-day meal and workout plan based on your blood report anomalies.
          </p>
        </div>
      )}
    </div>
  );
}

export default DietPlan;
