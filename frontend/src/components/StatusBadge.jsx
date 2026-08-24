function StatusBadge({ status }) {
  const styles = {
    Normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
    Low: "bg-amber-50 text-amber-700 border-amber-200",
    "Not Found": "bg-slate-50 text-slate-600 border-slate-200"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
        styles[status] || "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;