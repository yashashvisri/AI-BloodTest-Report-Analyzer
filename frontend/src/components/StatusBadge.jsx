function StatusBadge({ status }) {

  const styles = {

    Normal: "bg-green-100 text-green-700",

    High: "bg-red-100 text-red-700",

    Low: "bg-yellow-100 text-yellow-700",

    "Not Found": "bg-gray-200 text-gray-600"

  };

  return (

    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        styles[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>

  );

}

export default StatusBadge;