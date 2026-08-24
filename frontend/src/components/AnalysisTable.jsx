import StatusBadge from "./StatusBadge";

function AnalysisTable({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-10">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-gray-800">
          Blood Parameter Analysis
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
              <th className="px-8 py-5 font-semibold">Parameter</th>
              <th className="px-8 py-5 font-semibold text-center">Value</th>
              <th className="px-8 py-5 font-semibold text-center">Reference Range</th>
              <th className="px-8 py-5 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.entries(analysis).map(([parameter, details]) => (
              <tr
                key={parameter}
                className="hover:bg-emerald-50/50 transition-colors duration-200"
              >
                <td className="px-8 py-4 font-semibold text-gray-700 capitalize">
                  {parameter.replace(/_/g, " ")}
                </td>
                <td className="px-8 py-4 text-center font-medium text-gray-900">
                  {details.value !== null ? details.value : <span className="text-gray-400">--</span>}
                </td>
                <td className="px-8 py-4 text-center text-gray-500 text-sm">
                  {details.reference_range || <span className="text-gray-400">--</span>}
                </td>
                <td className="px-8 py-4 text-center flex justify-center">
                  <StatusBadge status={details.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalysisTable;