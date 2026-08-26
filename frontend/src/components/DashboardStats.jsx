import { useState, useEffect } from "react";
import api from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-32 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 mb-8">
        <LoadingSpinner className="w-8 h-8 text-teal-600" />
      </div>
    );
  }

  if (!stats || stats.total_reports === 0) return null;

  const pieData = [
    { name: "Normal", value: stats.normal_params, color: "#059669" }, // emerald-600
    { name: "Abnormal", value: stats.abnormal_params, color: "#e11d48" } // rose-600
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-center items-center text-center">
        <p className="text-gray-500 font-medium mb-1">Total Reports</p>
        <h3 className="text-4xl font-black text-emerald-700">{stats.total_reports}</h3>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 flex flex-col justify-center items-center text-center">
        <p className="text-gray-500 font-medium mb-1">Unique Patients</p>
        <h3 className="text-4xl font-black text-teal-700">{stats.total_patients}</h3>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-center items-center text-center">
        <p className="text-gray-500 font-medium mb-1">Overall Health Score</p>
        <h3 className="text-4xl font-black text-emerald-700">{stats.health_score}%</h3>
        <p className="text-xs text-gray-400 mt-2">Based on parameter ratios</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center h-40">
        <p className="text-xs text-gray-500 font-medium mb-2">Parameter Distribution</p>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" innerRadius={25} outerRadius={40} paddingAngle={5}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
