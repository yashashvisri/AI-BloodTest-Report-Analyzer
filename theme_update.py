import os
import subprocess

def run_cmd(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1
replace_in_file('frontend/src/components/Navbar.jsx', [('blue-600', 'emerald-600'), ('indigo-600', 'teal-600'), ('blue-50', 'emerald-50'), ('blue-700', 'emerald-700')])
run_cmd('git add frontend/src/components/Navbar.jsx && git commit -m "style(theme): update Navbar to Emerald/Teal medical theme"')

# 2
replace_in_file('frontend/src/components/Hero.jsx', [('blue-600', 'emerald-600'), ('indigo-700', 'teal-700'), ('blue-900', 'emerald-900'), ('blue-500', 'emerald-500'), ('blue-200', 'emerald-200'), ('blue-400', 'emerald-400'), ('blue-50', 'emerald-50')])
run_cmd('git add frontend/src/components/Hero.jsx && git commit -m "style(theme): update Hero section gradient to modern Emerald"')

# 3
replace_in_file('frontend/src/components/FeatureCards.jsx', [('blue-400', 'emerald-400'), ('blue-50', 'emerald-50'), ('blue-200', 'emerald-200'), ('blue-600', 'emerald-600'), ('blue-100', 'emerald-100'), ('blue-800', 'emerald-800')])
run_cmd('git add frontend/src/components/FeatureCards.jsx && git commit -m "style(theme): update FeatureCards interactive highlights to Emerald"')

# 4
replace_in_file('frontend/src/pages/Home.jsx', [('slate-100', 'gray-50'), ('blue-700', 'teal-700'), ('blue-600', 'emerald-600'), ('indigo-600', 'teal-600'), ('blue-300', 'emerald-300'), ('blue-50', 'emerald-50'), ('blue-500', 'emerald-500'), ('blue-100', 'emerald-100')])
run_cmd('git add frontend/src/pages/Home.jsx && git commit -m "style(theme): update Home page layout and upload zone to Emerald/Teal"')

# 5
replace_in_file('frontend/src/components/AnalysisTable.jsx', [('blue-700', 'teal-700'), ('blue-50', 'emerald-50')])
run_cmd('git add frontend/src/components/AnalysisTable.jsx && git commit -m "style(theme): update AnalysisTable accents to Emerald"')

# 6
replace_in_file('frontend/src/components/SummaryCard.jsx', [('blue-700', 'teal-700'), ('blue-500', 'emerald-500'), ('blue-600', 'emerald-600')])
run_cmd('git add frontend/src/components/SummaryCard.jsx && git commit -m "style(theme): update SummaryCard typography and focus rings to Emerald"')

# 7
replace_in_file('frontend/src/components/DietPlan.jsx', [('green-100', 'teal-100'), ('green-700', 'teal-800'), ('green-600', 'teal-600'), ('green-50', 'teal-50')])
run_cmd('git add frontend/src/components/DietPlan.jsx && git commit -m "style(theme): transition DietPlan from generic green to medical Teal"')

# 8
replace_in_file('frontend/src/components/ReportChat.jsx', [('blue-100', 'teal-100'), ('blue-700', 'teal-700'), ('blue-600', 'teal-600'), ('blue-400', 'teal-400'), ('blue-500', 'teal-500')])
run_cmd('git add frontend/src/components/ReportChat.jsx && git commit -m "style(theme): update ReportChat UI to Teal accents"')

# 9
replace_in_file('frontend/src/components/TrendGraph.jsx', [('blue-700', 'teal-700'), ('blue-500', 'teal-500'), ('blue-600', 'emerald-600'), ('#2563EB', '#059669'), ('blue-50', 'emerald-50')])
run_cmd('git add frontend/src/components/TrendGraph.jsx && git commit -m "style(theme): update Recharts TrendGraph line and buttons to Emerald"')

# 10
replace_in_file('frontend/src/pages/ReportDetails.jsx', [('slate-100', 'gray-50'), ('blue-600', 'emerald-600'), ('blue-800', 'emerald-800'), ('blue-700', 'teal-700'), ('blue-50', 'emerald-50'), ('blue-300', 'emerald-300')])
run_cmd('git add frontend/src/pages/ReportDetails.jsx && git commit -m "style(theme): update ReportDetails layout background and headers"')

# 11
replace_in_file('frontend/src/pages/History.jsx', [('slate-100', 'gray-50'), ('blue-600', 'emerald-600'), ('blue-700', 'teal-700')])
run_cmd('git add frontend/src/pages/History.jsx && git commit -m "style(theme): update History page layout and headers"')

# 12
replace_in_file('frontend/src/components/ReportTable.jsx', [('slate-50', 'gray-50'), ('blue-50/50', 'emerald-50/50'), ('blue-600', 'emerald-600'), ('blue-900', 'emerald-900'), ('blue-100', 'emerald-100'), ('blue-700', 'emerald-700')])
run_cmd('git add frontend/src/components/ReportTable.jsx && git commit -m "style(theme): update ReportTable hover states and buttons to Emerald"')

# 13
replace_in_file('frontend/src/components/MarkdownRenderer.jsx', [('blue-400', 'emerald-400'), ('blue-50', 'emerald-50')])
run_cmd('git add frontend/src/components/MarkdownRenderer.jsx && git commit -m "style(theme): update MarkdownRenderer blockquotes to Emerald theme"')

# 14
replace_in_file('frontend/index.html', [('<title>Vite + React</title>', '<title>AI Blood Report Analyzer</title>')])
run_cmd('git add frontend/index.html && git commit -m "style(seo): update index.html title for branding"')

# 15
replace_in_file('frontend/src/components/StatusBadge.jsx', [('gray-600', 'gray-700'), ('red-200', 'red-300'), ('yellow-200', 'yellow-300'), ('green-200', 'green-300')])
run_cmd('git add frontend/src/components/StatusBadge.jsx && git commit -m "style(theme): refine StatusBadge border weights for higher contrast"')

print("Successfully created 15 commits!")
