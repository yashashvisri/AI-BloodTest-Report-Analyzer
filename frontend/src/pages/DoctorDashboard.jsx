import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function DoctorDashboard() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/reports/").then(res => setReports(res.data.reports));
  }, []);

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-teal-800 mb-6">🩺 Doctor Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, Doctor. Here are all patient reports across the clinic.</p>
      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500 uppercase text-xs">
              <th className="py-3">Report ID</th>
              <th>Patient Name</th>
              <th>File</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                <td className="py-4 font-semibold">#{r.id}</td>
                <td>{r.patient_name}</td>
                <td className="text-sm text-gray-500">{r.original_filename}</td>
                <td>
                  <button onClick={() => navigate(`/report/${r.id}`)} className="text-emerald-600 font-bold hover:underline">View Analysis</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
