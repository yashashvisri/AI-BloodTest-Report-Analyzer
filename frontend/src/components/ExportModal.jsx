import { useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

export default function ExportModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [format] = useState("csv");

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reports/export/csv", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "text/csv" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `blood_reports_export.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Reports exported successfully!");
      onClose();
    } catch (err) {
      toast.error("Export failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          &#x1F4E5; Export Report Data
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Download all your blood report data as a CSV spreadsheet. Includes patient names, blood parameters, values, statuses, and reference ranges.
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-emerald-800 font-medium">
            &#x2705; CSV format — compatible with Excel, Google Sheets, and data analysis tools.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Exporting..." : "Download CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
