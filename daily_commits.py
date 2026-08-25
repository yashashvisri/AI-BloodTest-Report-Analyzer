import os
import subprocess

def run_cmd(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

# 1. LoadingSpinner.jsx
spinner_code = """export default function LoadingSpinner({ className = "w-5 h-5", color = "text-gray-500" }) {
  return (
    <svg className={`animate-spin ${className} ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}"""
with open('frontend/src/components/LoadingSpinner.jsx', 'w', encoding='utf-8') as f: f.write(spinner_code)
run_cmd('git add frontend/src/components/LoadingSpinner.jsx && git commit -m "feat(ui): create reusable LoadingSpinner component"')

# 2. Update ReportTable to use LoadingSpinner
rt_path = 'frontend/src/components/ReportTable.jsx'
with open(rt_path, 'r', encoding='utf-8') as f:
    rt_content = f.read()
rt_content = rt_content.replace('function ReportTable({', 'import LoadingSpinner from "./LoadingSpinner";\n\nfunction ReportTable({')
rt_content = rt_content.replace('<svg className="animate-spin w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\n                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>\n                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\n                        </svg>', '<LoadingSpinner />')
with open(rt_path, 'w', encoding='utf-8') as f:
    f.write(rt_content)
run_cmd('git add frontend/src/components/ReportTable.jsx && git commit -m "refactor(ui): apply LoadingSpinner to ReportTable actions"')

# 3. CHANGELOG.md
changelog = """# Changelog

## [Unreleased]
- Added LoadingSpinner component
- Added global 404 NotFound page
- Refactored UI code

## [1.0.0] - 2026-08-24
- Complete UI Theme Overhaul to Emerald/Teal
- Added RAG Chatbot ("Chat with your Report")
- Added AI-generated 7-day Diet Plans
- Added Multi-language translation support
- Added Recharts Historical Trend Graph
"""
with open('CHANGELOG.md', 'w', encoding='utf-8') as f: f.write(changelog)
run_cmd('git add CHANGELOG.md && git commit -m "docs: initialize CHANGELOG.md to track project versions"')

# 4. NotFound.jsx
not_found = """import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-8xl font-black text-teal-700 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">Sorry, the page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
        Return Home
      </Link>
    </div>
  );
}"""
with open('frontend/src/pages/NotFound.jsx', 'w', encoding='utf-8') as f: f.write(not_found)
run_cmd('git add frontend/src/pages/NotFound.jsx && git commit -m "feat(pages): create beautiful 404 NotFound page"')

# 5. App.jsx Add NotFound route
app_path = 'frontend/src/App.jsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()
app_content = app_content.replace('import ReportDetails from "./pages/ReportDetails";', 'import ReportDetails from "./pages/ReportDetails";\nimport NotFound from "./pages/NotFound";')
app_content = app_content.replace('</Routes>', '  <Route path="*" element={<NotFound />} />\n        </Routes>')
with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_content)
run_cmd('git add frontend/src/App.jsx && git commit -m "feat(core): integrate NotFound route catch-all in React Router"')

# 6. app/api/trends.py Docstrings
trends_path = 'app/api/trends.py'
with open(trends_path, 'r', encoding='utf-8') as f:
    tc = f.read()
tc = tc.replace('def get_patient_trends(', 'def get_patient_trends(\n    """\n    Retrieves historical blood report data for a specific patient to plot trend graphs.\n    Aggregates parameters chronologically across multiple reports.\n    """\n')
with open(trends_path, 'w', encoding='utf-8') as f:
    f.write(tc)
run_cmd('git add app/api/trends.py && git commit -m "docs(api): add comprehensive docstrings to trends endpoints"')

# 7. app/api/chat.py Docstrings
chat_path = 'app/api/chat.py'
with open(chat_path, 'r', encoding='utf-8') as f:
    cc = f.read()
cc = cc.replace('def chat_with_report_api(', 'def chat_with_report_api(\n    """\n    Facilitates a Q&A session with the AI context-aware of a specific blood report.\n    Returns a stream or distinct AI message addressing the patient\'s query.\n    """\n')
with open(chat_path, 'w', encoding='utf-8') as f:
    f.write(cc)
run_cmd('git add app/api/chat.py && git commit -m "docs(api): document chat endpoint RAG parameters"')

# 8. app/api/diet.py Docstrings
diet_path = 'app/api/diet.py'
with open(diet_path, 'r', encoding='utf-8') as f:
    dc = f.read()
dc = dc.replace('def generate_diet_plan_api(', 'def generate_diet_plan_api(\n    """\n    Generates a personalized 7-day diet and lifestyle plan based on deficiencies\n    found in the provided report analysis.\n    """\n')
with open(diet_path, 'w', encoding='utf-8') as f:
    f.write(dc)
run_cmd('git add app/api/diet.py && git commit -m "docs(api): add docstrings to diet plan generation logic"')

# 9. app/api/translate.py Docstrings
trans_path = 'app/api/translate.py'
with open(trans_path, 'r', encoding='utf-8') as f:
    trc = f.read()
trc = trc.replace('def translate_summary_api(', 'def translate_summary_api(\n    """\n    Translates an existing AI medical summary into the specified target language\n    using the Gemini LLM.\n    """\n')
with open(trans_path, 'w', encoding='utf-8') as f:
    f.write(trc)
run_cmd('git add app/api/translate.py && git commit -m "docs(api): document translation endpoint functionality"')

# 10. Refine README.md badges
rm_path = 'README.md'
with open(rm_path, 'r', encoding='utf-8') as f:
    rmc = f.read()
rmc = rmc.replace('## 🚀 Key Features', '![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)\n![Python](https://img.shields.io/badge/python-3.11-green.svg)\n![React](https://img.shields.io/badge/react-19-cyan.svg)\n\n## 🚀 Key Features')
with open(rm_path, 'w', encoding='utf-8') as f:
    f.write(rmc)
run_cmd('git add README.md && git commit -m "docs(readme): add project technology and version badges to README"')

print("All 10 commits completed successfully!")
