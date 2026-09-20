# 🩸 AI-BloodTest-Report-Analyzer

An advanced, AI-powered Blood Test Report Analysis System built using **FastAPI, React, PostgreSQL, OCR, RAG, and Large Language Models (Google Gemini)**.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](docker-compose.yml)

---

## 📌 Project Overview

This system automates blood test report analysis to empower patients and doctors. Users can upload blood report PDFs, which are scanned using OCR to extract parameters. The AI then processes these parameters to provide easy-to-understand medical summaries, personalized diet plans, and interactive capabilities like trend analysis and chatting with the report.

---

## ✨ Key Features

### 🔬 Core AI Analysis
- **📄 Automated PDF OCR** — Extracts raw medical data directly from scanned blood test reports using Tesseract.
- **🤖 AI Medical Summary (Gemini)** — Highlights abnormal parameters and explains their significance in plain English.
- **🥗 Actionable Diet & Lifestyle Plans** — Generates a personalized 7-day meal and workout plan based on the user's specific blood deficiencies.
- **📥 Diet Plan PDF Export** — Download your personalized diet plan as a beautifully formatted PDF document.
- **💬 RAG Chatbot ("Chat with your Report")** — Ask questions like "Why is my Vitamin D low?" and get answers grounded in your actual report data.
- **📈 Historical Trend Analysis** — Visually graph and track how vitals (Hemoglobin, WBC, etc.) change across multiple blood tests over time using Recharts.
- **🌍 Multi-Language Translation** — Instantly translates complex medical summaries into Hindi, Spanish, French, and more.
- **⚡ Cached Analysis** — Reports are saved in PostgreSQL to prevent redundant OCR/API calls, loading instantly on subsequent visits.
- **📊 Analysis PDF Export** — Download your complete AI-analyzed results as a formatted PDF report.

### 🔐 Authentication & Security
- **🔑 JWT Authentication** — Secure login and signup with bcrypt password hashing and JSON Web Token sessions.
- **🛡️ Role-Based Access Control (RBAC)** — Dual roles: `patient` (default) and `doctor`. Doctors get global access to all patient reports across the clinic.
- **🔒 Data Privacy & Isolation** — Every API endpoint is secured so patients can only access their own reports.

### 🏥 Clinic Dashboard (Doctor View)
- **🔍 Real-Time Patient Search** — Debounced search bar filters patients by name or document filename instantly.
- **📋 Sortable Records** — Sort the patient table by Newest, Oldest, or Alphabetically (A-Z / Z-A).
- **📄 Paginated Results** — Backend-driven pagination for efficient handling of large patient databases.
- **🏷️ Visual Status Tags** — "Analyzed" badges on each report row for quick status identification.
- **🖼️ Empty State Illustrations** — Graceful UI when no records match the search criteria.

### 👤 User Profile & Settings
- **✏️ Profile Management** — Update display name and email address from a tabbed Settings page.
- **🔐 Security Panel** — Securely change your password with bcrypt verification.
- **⚠️ Danger Zone** — Full account deletion with cascading cleanup (user data, reports, analyses, and uploaded PDFs).

### 📊 Dashboard Analytics
- **📈 Total Reports & Unique Patients** — Real-time stat cards on the home page.
- **💚 Overall Health Score** — Computed from normal vs. abnormal parameter ratios.
- **🍩 Parameter Distribution Chart** — Recharts pie chart showing Normal vs. Abnormal distribution.

### 📧 Email Notifications
- **📬 Automated Analysis Alerts** — Background email notifications triggered after every report analysis using FastAPI `BackgroundTasks`.
- **🖨️ Terminal-Friendly Mock SMTP** — Nicely formatted email previews printed to the terminal for local development.

### 🐳 Docker Support
- **🏗️ Full Containerization** — `docker-compose.yml` orchestrates PostgreSQL, FastAPI backend, and React/Nginx frontend.
- **⚡ One-Command Deploy** — `docker-compose up --build` spins up the entire stack.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 & Vite | SPA framework and build tool |
| Tailwind CSS | Modern UI with glassmorphism effects |
| Recharts | Trend graphs and pie charts |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI (Python 3.11) | REST API framework |
| PostgreSQL & SQLAlchemy | Database and ORM |
| Tesseract OCR & pdf2image | PDF text extraction |
| Google Gemini 2.5 Flash | LLM for AI analysis |
| python-jose & passlib | JWT tokens and password hashing |
| pdfkit & wkhtmltopdf | PDF report generation |
| Markdown | Diet plan formatting for PDF export |

### DevOps
| Technology | Purpose |
|---|---|
| Docker & Docker Compose | Containerization |
| Nginx | Frontend static file serving |

---

## 📂 Project Structure

```
AI-BloodTest-Report-Analyzer/
│
├── app/
│   ├── ai/              # Gemini AI integration (Diet, Chat, Translate prompts)
│   ├── api/
│   │   ├── auth.py      # Login, Signup, JWT, RBAC role assignment
│   │   ├── reports.py   # Upload, Analyze, Download, Search, Paginate
│   │   ├── chat.py      # RAG Chatbot endpoint
│   │   ├── diet.py      # Diet plan generation + PDF download
│   │   ├── translate.py # Multi-language translation
│   │   ├── trends.py    # Historical trend aggregation
│   │   ├── dashboard.py # Analytics stats (reports, patients, health score)
│   │   └── users.py     # Profile update, password change, account deletion
│   ├── database/
│   │   ├── models.py          # User model (with role column)
│   │   ├── report_models.py   # BloodReport model (with user_id FK)
│   │   ├── analysis_models.py # ReportAnalysis model
│   │   └── database.py        # SQLAlchemy session & engine
│   ├── services/
│   │   └── pdf_service.py     # PDF generation (analysis + diet plan)
│   ├── email_utils.py         # Mock SMTP email notifications
│   ├── ocr/                   # Tesseract OCR processing
│   ├── parser/                # Regex-based blood parameter extraction
│   └── main.py                # FastAPI entry point & router mounting
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisTable.jsx     # Blood parameter results table
│   │   │   ├── DashboardStats.jsx    # Home page stat cards + pie chart
│   │   │   ├── DietPlan.jsx          # Diet plan display + PDF download button
│   │   │   ├── FeatureCards.jsx      # Landing page feature showcase
│   │   │   ├── Hero.jsx              # Landing page hero section
│   │   │   ├── MarkdownRenderer.jsx  # Renders AI markdown responses
│   │   │   ├── Navbar.jsx            # Navigation with role-aware links
│   │   │   ├── ReportChat.jsx        # Interactive RAG chat interface
│   │   │   ├── ReportTable.jsx       # Paginated report listing
│   │   │   ├── SummaryCard.jsx       # AI summary + translation dropdown
│   │   │   └── TrendGraph.jsx        # Historical line chart with metric selector
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Upload, analyze, and view results
│   │   │   ├── History.jsx           # Patient report history
│   │   │   ├── ReportDetails.jsx     # Full analysis view for a single report
│   │   │   ├── DoctorDashboard.jsx   # Clinic-wide search, sort, and pagination
│   │   │   ├── Settings.jsx          # Profile, security, and account management
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Signup.jsx            # Registration page
│   │   │   └── NotFound.jsx          # 404 page
│   │   └── services/
│   │       └── api.js                # Axios instance with JWT interceptor
│   ├── Dockerfile                    # Multi-stage build → Nginx
│   └── package.json
│
├── backend.Dockerfile                # Python 3.11 + wkhtmltopdf
├── docker-compose.yml                # PostgreSQL + FastAPI + Nginx
├── requirements.txt
├── .env.example
├── CHANGELOG.md
└── README.md
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user account |
| `POST` | `/auth/login` | Login and receive JWT token |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/reports/upload` | Upload a blood test PDF |
| `POST` | `/reports/analyze/{id}` | Run OCR + AI analysis |
| `GET` | `/reports/` | List reports (search, sort, paginate) |
| `GET` | `/reports/{id}` | Get single report details |
| `GET` | `/reports/{id}/download` | Download analysis as PDF |
| `DELETE` | `/reports/{id}` | Delete report and associated data |

### AI Features
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reports/{id}/diet-plan` | Generate personalized diet plan |
| `GET` | `/diet/{id}/download` | Download diet plan as PDF |
| `POST` | `/reports/{id}/chat` | Chat with your blood report (RAG) |
| `POST` | `/reports/{id}/translate` | Translate summary to another language |
| `GET` | `/trends/{patient_name}` | Get historical parameter trends |

### Dashboard & User Management
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/stats` | Aggregated analytics (reports, patients, health score) |
| `PUT` | `/users/me/profile` | Update display name and email |
| `PUT` | `/users/me/password` | Change password securely |
| `DELETE` | `/users/me` | Delete account (cascading cleanup) |

### System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |

---

## 🏁 How to Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Tesseract OCR installed
- Google Gemini API key

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/yashashvisri/AI-BloodTest-Report-Analyzer.git
cd AI-BloodTest-Report-Analyzer

# Create virtual environment
python -m venv venv
source venv/Scripts/activate   # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file from the template:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/blood_report_db
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET_KEY=your_secret_key_here
```

Start the backend:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Docker (Alternative)
```bash
docker-compose up --build
```
This spins up PostgreSQL, FastAPI, and React/Nginx in one command.

---

## 🖥️ Screenshots

| Feature | Description |
|---|---|
| 🏠 Home Page | Upload reports, view AI analysis, stat cards, and feature showcase |
| 🧪 Analysis View | Blood parameters table, AI summary, translate, diet plan, and chat |
| 🏥 Clinic Dashboard | Search, sort, paginate patient records (doctor role) |
| ⚙️ Settings | Profile management, password change, and account deletion |
| 📈 Trend Graph | Historical comparison of blood parameters across tests |

---

## 🗺️ Roadmap

- [x] PDF OCR & AI Analysis
- [x] Diet & Lifestyle Plans with PDF Export
- [x] RAG Chatbot
- [x] Historical Trend Analysis
- [x] Multi-Language Translation
- [x] JWT Authentication & RBAC
- [x] Email Notifications
- [x] User Settings & Profile Management
- [x] Clinic Dashboard with Search & Pagination
- [x] Docker Containerization
- [ ] Dark Mode Theme
- [ ] Export Full Report History as CSV
- [ ] Push Notifications (WebSocket)
- [ ] Admin Panel for User Management

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Yashashvi Srivastava**

---

*Built with ❤️ and AI*
