import { useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const RISK_COLORS = {
  Low: { bg: "bg-emerald-100", text: "text-emerald-800", bar: "bg-emerald-500", ring: "ring-emerald-500" },
  Moderate: { bg: "bg-amber-100", text: "text-amber-800", bar: "bg-amber-500", ring: "ring-amber-500" },
  High: { bg: "bg-orange-100", text: "text-orange-800", bar: "bg-orange-500", ring: "ring-orange-500" },
  Critical: { bg: "bg-red-100", text: "text-red-800", bar: "bg-red-500", ring: "ring-red-500" },
};

function ScoreGauge({ score, riskLevel }) {
  const colors = RISK_COLORS[riskLevel] || RISK_COLORS.Moderate;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={score >= 80 ? "#059669" : score >= 60 ? "#d97706" : score >= 40 ? "#ea580c" : "#dc2626"}
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-gray-800">{score}</span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <span className={`mt-3 px-4 py-1.5 rounded-full text-sm font-bold ${colors.bg} ${colors.text}`}>
        {riskLevel} Risk
      </span>
    </div>
  );
}

function CategoryBar({ category }) {
  const colors = RISK_COLORS[category.risk] || RISK_COLORS.Moderate;
  return (
    <div className="py-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-bold text-gray-700 text-sm">{category.name}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
            {category.risk}
          </span>
          <span className="text-sm font-bold text-gray-600">{category.score}%</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${colors.bar} transition-all duration-700 ease-out`}
          style={{ width: `${category.score}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{category.summary}</p>
    </div>
  );
}

export default function HealthRiskScore({ reportId }) {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRiskScore = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/${reportId}/risk-score`);
      setRiskData(res.data.risk_assessment);
      toast.success("Health Risk Score generated!");
    } catch (err) {
      toast.error("Failed to generate risk score.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!reportId) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-teal-800 flex items-center gap-2">
          🛡️ AI Health Risk Score
        </h2>
        {!riskData && (
          <button
            onClick={fetchRiskScore}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-800 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all"
          >
            {loading ? "Analyzing..." : "Generate Risk Score"}
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-500 font-medium">AI is analyzing your health risk factors...</p>
        </div>
      )}

      {riskData && !loading && (
        <div className="space-y-8">
          {/* Overall Score */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 rounded-xl p-6 border border-gray-100">
            <ScoreGauge score={riskData.overall_score} riskLevel={riskData.risk_level} />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Overall Health Assessment</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your overall health score is <strong>{riskData.overall_score}/100</strong> based on a comprehensive
                AI analysis of your blood parameters across cardiovascular, metabolic, immune, nutritional, and organ function categories.
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          {riskData.categories && riskData.categories.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Category Breakdown</h3>
              <div className="bg-white border border-gray-100 rounded-xl p-5 divide-y divide-gray-50">
                {riskData.categories.map((cat, idx) => (
                  <CategoryBar key={idx} category={cat} />
                ))}
              </div>
            </div>
          )}

          {/* Concerns & Positives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskData.top_concerns && riskData.top_concerns.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  ⚠️ Top Concerns
                </h4>
                <ul className="space-y-2">
                  {riskData.top_concerns.map((concern, idx) => (
                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {riskData.positive_indicators && riskData.positive_indicators.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  ✅ Positive Indicators
                </h4>
                <ul className="space-y-2">
                  {riskData.positive_indicators.map((pos, idx) => (
                    <li key={idx} className="text-sm text-emerald-700 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                      {pos}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {!riskData && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Click the button above to generate a comprehensive AI-powered health risk assessment
            based on your blood report parameters.
          </p>
        </div>
      )}
    </div>
  );
}
