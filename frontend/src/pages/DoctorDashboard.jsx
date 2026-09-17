import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function DoctorDashboard() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/?search=${debouncedSearch}&sort_by=${sortBy}&page=${page}&limit=10`);
      setReports(res.data.reports || res.data); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [debouncedSearch, sortBy, page]);

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-800">Clinic Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and analyze patient records securely.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <input 
            type="text" 
            placeholder="Search patients..." 
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-gray-700"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex justify-center items-center backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        )}
        
        {reports.length === 0 && !loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 rounded-full p-6 mb-4">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700">No records found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold tracking-wider">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Patient Name</th>
                  <th className="py-4 px-6">Document</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-emerald-50/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-700">#{r.id}</td>
                    <td className="py-4 px-6 font-bold text-teal-800">{r.patient_name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 max-w-[200px] truncate" title={r.original_filename}>{r.original_filename}</td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Analyzed</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => navigate(`/report/${r.id}`)} className="text-teal-600 font-bold hover:text-teal-800 hover:underline">View Analysis &rarr;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500 font-medium">Showing page {page}</p>
        <div className="flex gap-2">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition"
          >
            Previous
          </button>
          <button 
            disabled={reports.length < 10} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
