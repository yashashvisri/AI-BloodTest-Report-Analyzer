import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TrendGraph({ patientName }) {
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [availableMetrics, setAvailableMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const fileInputRef = useRef(null);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/trends/${encodeURIComponent(patientName)}`);
      const data = response.data.trends;
      setTrendsData(data);
      
      if (data.length > 0) {
        const keys = new Set();
        data.forEach(point => {
          Object.keys(point).forEach(k => {
            if (k !== 'name') keys.add(k);
          });
        });
        const metrics = Array.from(keys).filter(k => k);
        setAvailableMetrics(metrics);
        if (metrics.length > 0 && !selectedMetric) {
          const defaultMetric = metrics.find(m => m.toLowerCase().includes('hemoglobin')) || metrics[0];
          setSelectedMetric(defaultMetric);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientName) {
      loadTrends();
    }
  }, [patientName]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading and analyzing new report...");

    try {
      // 1. Upload the file with the EXACT same patient name
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patient_name", patientName);
      
      const uploadRes = await api.post("/reports/upload", formData);
      const newReportId = uploadRes.data.report.id;

      // 2. Analyze the newly uploaded report
      await api.post(`/reports/analyze/${newReportId}`);

      // 3. Refresh the trends graph
      await loadTrends();
      
      toast.success("Successfully added and compared!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add report.", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset file input
    }
  };

  if (loading && trendsData.length === 0) {
    return <div className="text-center p-6 text-gray-500">Loading historical trends...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
          📈 Historical Trends
        </h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {availableMetrics.length > 0 && trendsData.length >= 2 && (
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {availableMetrics.map(m => (
                <option key={m} value={m}>{m.replace(/_/g, " ")}</option>
              ))}
            </select>
          )}

          {/* Hidden File Input */}
          <input 
            type="file" 
            accept="application/pdf"
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            {isUploading ? "Processing..." : "➕ Add Report to Compare"}
          </button>
        </div>
      </div>

      {trendsData.length < 2 ? (
        <div className="bg-slate-50 rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-gray-500 font-medium mb-4">
            We need at least 2 reports to generate a historical comparison graph for <span className="font-bold text-gray-700">{patientName}</span>.
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-bold transition-all"
          >
            {isUploading ? "Uploading..." : "Upload Past Report Now"}
          </button>
        </div>
      ) : (
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{fill: '#6B7280'}} tickLine={false} axisLine={{stroke: '#D1D5DB'}} />
              <YAxis tick={{fill: '#6B7280'}} tickLine={false} axisLine={{stroke: '#D1D5DB'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {selectedMetric && (
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default TrendGraph;
