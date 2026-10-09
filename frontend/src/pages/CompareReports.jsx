import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const STATUS_COLOR = {
  normal: "text-emerald-700 bg-emerald-50",
  high: "text-red-700 bg-red-50",
  low: "text-amber-700 bg-amber-50",
};

const CHANGE_ICON = {
  improved: { icon: "\u2B06\uFE0F", label: "Improved", color: "text-emerald-600" },
  worsened: { icon: "\u2B07\uFE0F", label: "Worsened", color: "text-red-600" },
  unchanged: { icon: "\u2796", label: "Unchanged", color: "text-gray-400" },
  changed: { icon: "\u{1F504}", label: "Changed", color: "text-blue-600" },
  new: { icon: "\u2795", label: "New", color: "text-purple-600" },
  removed: { icon: "\u274C", label: "Removed", color: "text-gray-400" },
};

function SummaryCard({ label, value, color }) {
  return (
    <div className={`rounded-xl p-4 text-center ${color}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm font-bold mt-1">{label}</p>
    </div>
  );
}

export default function CompareReports() {
  const [reports, setReports] = useState([]);
  const [reportA, setReportA] = useState("");
  const [reportB, setReportB] = useState("");
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports/");
        setReports(res.data.reports || []);
      } catch {
        toast.error("Failed to load reports");
      } finally {
        setLoadingReports(false);
      }
    };
    fetchReports();
  }, []);

  const handleCompare = async () => {
    if (!reportA || !reportB) {
      toast.error("Please select two reports to compare");
      return;
    }
    if (reportA === reportB) {
      toast.error("Please select two different reports");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/reports/compare/${reportA}/${reportB}`);
      setComparison(res.data);
      toast.success("Comparison ready!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <span className="bg-blue-100 text-blue-700 p-2 rounded-xl">{"\u{1F4CA}"}</span>
          Compare Reports
        </h1>
        <p className="text-gray-500 font-medium mt-1">Select two blood reports to see a detailed side-by-side comparison.</p>
      </div>

      {/* Report Selectors */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Report A (Older)</label>
            <select
              value={reportA}
              onChange={e => setReportA(e.target.value)}
              disabled={loadingReports}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select a report...</option>
              {reports.map(r => (
                <option key={r.id} value={r.id}>
                  #{r.id} — {r.patient_name} ({r.original_filename})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Report B (Newer)</label>
            <select
              value={reportB}
              onChange={e => setReportB(e.target.value)}
              disabled={loadingReports}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select a report...</option>
              {reports.map(r => (
                <option key={r.id} value={r.id}>
                  #{r.id} — {r.patient_name} ({r.original_filename})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCompare}
            disabled={loading || !reportA || !reportB}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all"
          >
            {loading ? "Comparing..." : "\u{1F50D} Compare Reports"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Analyzing differences...</p>
        </div>
      )}

      {/* Results */}
      {comparison && !loading && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard label="Total Parameters" value={comparison.summary.total_params} color="bg-gray-50 text-gray-800" />
            <SummaryCard label="Improved" value={comparison.summary.improved} color="bg-emerald-50 text-emerald-800" />
            <SummaryCard label="Worsened" value={comparison.summary.worsened} color="bg-red-50 text-red-800" />
            <SummaryCard label="Unchanged" value={comparison.summary.unchanged} color="bg-gray-50 text-gray-600" />
          </div>

          {/* Report Headers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-600 uppercase">Report A</p>
              <p className="font-bold text-gray-800">{comparison.report_a.patient_name}</p>
              <p className="text-sm text-gray-500">#{comparison.report_a.id} — {comparison.report_a.filename}</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-xs font-bold text-indigo-600 uppercase">Report B</p>
              <p className="font-bold text-gray-800">{comparison.report_b.patient_name}</p>
              <p className="text-sm text-gray-500">#{comparison.report_b.id} — {comparison.report_b.filename}</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold tracking-wider">
                    <th className="py-4 px-5">Parameter</th>
                    <th className="py-4 px-5 text-center">Report A</th>
                    <th className="py-4 px-5 text-center">Report B</th>
                    <th className="py-4 px-5 text-center">Reference</th>
                    <th className="py-4 px-5 text-center">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.comparisons.map((row, idx) => {
                    const changeInfo = CHANGE_ICON[row.change] || CHANGE_ICON.unchanged;
                    return (
                      <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-gray-800 text-sm">{row.parameter}</td>
                        <td className="py-3.5 px-5 text-center">
                          {row.report_a.value ? (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLOR[row.report_a.status] || "bg-gray-50 text-gray-600"}`}>
                              {row.report_a.value}
                            </span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          {row.report_b.value ? (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLOR[row.report_b.status] || "bg-gray-50 text-gray-600"}`}>
                              {row.report_b.value}
                            </span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="py-3.5 px-5 text-center text-xs text-gray-500">{row.reference_range}</td>
                        <td className="py-3.5 px-5 text-center">
                          <span className={`text-sm font-bold ${changeInfo.color}`} title={changeInfo.label}>
                            {changeInfo.icon} {changeInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!comparison && !loading && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">{"\u{1F4CA}"}</p>
          <h3 className="text-lg font-bold text-gray-700">No Comparison Yet</h3>
          <p className="text-gray-500 mt-1">Select two reports above and click Compare to see the differences.</p>
        </div>
      )}
    </div>
  );
}
