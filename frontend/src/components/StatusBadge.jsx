function StatusBadge({ status }) {
  const styles = {
    Normal: "bg-green-50 text-green-700 border-green-200",
    High: "bg-red-50 text-red-700 border-red-200",
    Low: "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Not Found": "bg-gray-50 text-gray-600 border-gray-200"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
        styles[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;