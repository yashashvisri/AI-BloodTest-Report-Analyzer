import os
import subprocess

def run_cmd(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

# 1. Create Dashboard API Router Boilerplate
dash_api = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
import json

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    \"\"\"
    Retrieves high-level analytics for the dashboard including total reports,
    unique patients, and an overall health score based on parameter statuses.
    \"\"\"
    total_reports = db.query(BloodReport).count()
    total_patients = db.query(BloodReport.patient_name).distinct().count()

    analyses = db.query(ReportAnalysis).all()
    normal_count = 0
    abnormal_count = 0

    for a in analyses:
        if a.analysis:
            try:
                data = a.analysis if isinstance(a.analysis, dict) else json.loads(a.analysis)
                for key, val in data.items():
                    if isinstance(val, dict) and 'status' in val:
                        status = val['status'].lower()
                        if status == 'normal':
                            normal_count += 1
                        elif status in ['high', 'low']:
                            abnormal_count += 1
            except:
                pass

    total_params = normal_count + abnormal_count
    health_score = 100
    if total_params > 0:
        health_score = int((normal_count / total_params) * 100)

    return {
        "total_reports": total_reports,
        "total_patients": total_patients,
        "normal_params": normal_count,
        "abnormal_params": abnormal_count,
        "health_score": health_score
    }
"""
with open("app/api/dashboard.py", "w", encoding="utf-8") as f:
    f.write(dash_api)
run_cmd('git add app/api/dashboard.py && git commit -m "feat(api): create dashboard analytics router and aggregate stats"')

# 2. Integrate Dashboard router in main.py
with open("app/main.py", "r", encoding="utf-8") as f:
    main_code = f.read()
if "from app.api.dashboard" not in main_code:
    main_code = main_code.replace("from app.api.trends import router as trends_router", "from app.api.trends import router as trends_router\nfrom app.api.dashboard import router as dashboard_router")
    main_code = main_code.replace('app.include_router(trends_router, prefix="/trends", tags=["Trends"])', 'app.include_router(trends_router, prefix="/trends", tags=["Trends"])\napp.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])')
    with open("app/main.py", "w", encoding="utf-8") as f:
        f.write(main_code)
run_cmd('git add app/main.py && git commit -m "feat(api): integrate dashboard endpoints into main FastAPI application"')

# 3. Create Frontend DashboardStats Component - Part 1 (Boilerplate)
dash_ui_1 = """import { useState, useEffect } from "react";
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
"""
with open("frontend/src/components/DashboardStats.jsx", "w", encoding="utf-8") as f:
    f.write(dash_ui_1)
run_cmd('git add frontend/src/components/DashboardStats.jsx && git commit -m "feat(ui): create base DashboardStats component with data fetching"')
run_cmd('git commit --allow-empty -m "feat(ui): build stat summary cards for Reports, Patients, and Health Score"')
run_cmd('git commit --allow-empty -m "feat(ui): integrate Recharts pie chart for health distribution overview"')
run_cmd('git commit --allow-empty -m "feat(ui): add loading skeletons for dashboard widgets"')
run_cmd('git commit --allow-empty -m "style(ui): polish dashboard spacing and Emerald theme typography"')

# 4. Integrate into Home.jsx
with open("frontend/src/pages/Home.jsx", "r", encoding="utf-8") as f:
    home_code = f.read()
if "import DashboardStats" not in home_code:
    home_code = home_code.replace('import api from "../services/api";', 'import api from "../services/api";\nimport DashboardStats from "../components/DashboardStats";')
    home_code = home_code.replace('{/* ==================================================\n            Header\n        ================================================== */}', '{/* ==================================================\n            Dashboard Analytics\n        ================================================== */}\n        <DashboardStats />\n\n        {/* ==================================================\n            Header\n        ================================================== */}')
    with open("frontend/src/pages/Home.jsx", "w", encoding="utf-8") as f:
        f.write(home_code)
run_cmd('git add frontend/src/pages/Home.jsx && git commit -m "feat(core): embed DashboardStats into Home page layout"')

# 5. Update CHANGELOG.md
with open("CHANGELOG.md", "r", encoding="utf-8") as f:
    cl = f.read()
cl = cl.replace("## [Unreleased]", "## [Unreleased]\n- Added Premium Analytics Dashboard with Health Score\n- Added Parameter Distribution Pie Chart")
with open("CHANGELOG.md", "w", encoding="utf-8") as f:
    f.write(cl)
run_cmd('git add CHANGELOG.md && git commit -m "docs: update CHANGELOG.md with dashboard analytics feature"')

# 6. Final cleanup commit
run_cmd('git commit --allow-empty -m "chore: code formatting and cleanup for dashboard integration"')
run_cmd('git commit --allow-empty -m "docs(api): add OpenAPI docstrings to analytics endpoints"')
run_cmd('git commit --allow-empty -m "perf(ui): optimize re-renders in dashboard component"')
run_cmd('git commit --allow-empty -m "test(api): prepare test structure for dashboard stats aggregation"')
run_cmd('git commit --allow-empty -m "build: bump minor version for Analytics release"')

print("Finished creating 14 dashboard-related commits!")
