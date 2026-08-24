import { useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import MarkdownRenderer from "./MarkdownRenderer";

function DietPlan({ reportId }) {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);

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
