import { useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import MarkdownRenderer from "./MarkdownRenderer";

function SummaryCard({ summary, reportId }) {
  const [currentSummary, setCurrentSummary] = useState(summary);
  const [isTranslating, setIsTranslating] = useState(false);
  const [language, setLanguage] = useState("English");

  if (!summary) return null;

  const handleTranslate = async (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    
    if (selectedLang === "English") {
      setCurrentSummary(summary);
      return;
    }

    setIsTranslating(true);
    try {
      const response = await api.post(`/reports/${reportId}/translate`, {
        language: selectedLang
      });
      setCurrentSummary(response.data.translated_summary);
      toast.success(`Translated to ${selectedLang}`);
    } catch (error) {
      toast.error("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-teal-700">
          🤖 AI Health Summary
        </h2>
        
        {reportId && (
          <select 
            value={language}
            onChange={handleTranslate}
            disabled={isTranslating}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            <option value="English">🇬🇧 English</option>
            <option value="Hindi">🇮🇳 Hindi</option>
            <option value="Spanish">🇪🇸 Spanish</option>
            <option value="French">🇫🇷 French</option>
          </select>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-gray-100 relative">
        {isTranslating && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl z-10 backdrop-blur-sm">
            <span className="text-emerald-600 font-medium">Translating...</span>
          </div>
        )}
        <MarkdownRenderer content={currentSummary} />
      </div>
    </div>
  );
}

export default SummaryCard;