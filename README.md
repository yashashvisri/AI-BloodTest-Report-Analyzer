# 🩸 AI-BloodTest-Report-Analyzer

An advanced, full-stack, AI-powered Blood Test Report Analysis System built with **FastAPI, React, PostgreSQL, OCR, RAG, and Large Language Models (Google Gemini)**.

[![CI/CD Pipeline](https://github.com/yashashvisri/AI-BloodTest-Report-Analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/yashashvisri/AI-BloodTest-Report-Analyzer/actions)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](docker-compose.yml)

> ⚠️ **Medical Disclaimer**: This application is an AI-assisted diagnostic exploration tool and is not intended to substitute for professional medical advice, diagnosis, or clinical treatment. Always consult qualified healthcare providers regarding laboratory results.

---

## 📌 Project Overview

Routine blood testing is essential for preventive healthcare, yet patients frequently encounter laboratory reports dense with clinical jargon and incomprehensible numerical ranges. **AI-BloodTest-Report-Analyzer** bridges the communication divide between clinical diagnostics and patient comprehension by translating complex lab results into clear, structured, and actionable medical intelligence.

The platform serves both **individual patients** seeking clarity on their health indicators and **healthcare providers** managing longitudinal patient databases with role-based clinical dashboards.

This system automates blood test report analysis to empower both patients and healthcare providers. Users can upload blood report PDFs, which are processed using OCR to extract laboratory parameters. The AI system interprets these metrics, providing plain-language medical summaries, actionable diet & lifestyle plans, interactive RAG chatting, longitudinal trend analysis, smart health risk scores, and side-by-side report comparisons.

---

## 🏛️ System Architecture

```
   [ Patient / Doctor Client ]
               │
        (React 19 + Vite)
               │ REST / JWT
               ▼
       [ FastAPI Gateway ]
        ├── Auth & RBAC Middleware
        ├── Background Notification Dispatcher
        ▼
   [ Core Services ]
    ├── OCR Ingestion (Tesseract + pdf2image)
    ├── Clinical Parsing Engine (Regex + Semantic Normalizer)
    ├── Google Gemini 2.5 Flash (Analysis, Risk Score, Diet & RAG)
    ├── Document Rendering (pdfkit / wkhtmltopdf)
    └── Relational Storage (PostgreSQL 15 via SQLAlchemy ORM)
```

---

## ✨ Key Features

### 🔬 Core AI Analysis & Diagnostics
- **🧪 Supported Biomarker Panels** — Comprehensive parsing support across Complete Blood Count (CBC), Comprehensive Metabolic Panel (CMP), Lipid Panels (HDL/LDL/Triglycerides), Thyroid Function (TSH, T3, T4), Vitamin Deficiencies (Vit D, B12), and Renal/Liver Function Tests.
- **📄 Automated PDF OCR** — Extracts raw medical data directly from scanned blood test reports using Tesseract OCR.
- **🤖 AI Medical Summary (Gemini)** — Identifies abnormal parameters and explains their clinical significance in plain, patient-friendly language.
- **🛡️ AI Health Risk Score** — Generates a 0–100 composite health risk assessment with color-coded animated SVG gauges and categorical risk evaluations (Cardiovascular, Metabolic, Hematologic, Hepatic/Renal). The scoring engine weighs parameter deviations from reference bounds against clinical severity markers to generate positive factors and actionable warnings.
- **📊 Side-by-Side Report Comparison** — Select any two historical reports to compare parameters with automated status diffs and directional indicators (⬆️ Improved, ⬇️ Worsened, ➖ Unchanged, ➕ New).
- **🥗 Actionable Diet & Lifestyle Plans** — Generates personalized 7-day nutritional plans tailored to address detected blood deficiencies.
- **📥 Diet Plan PDF Export** — Download custom diet plans as cleanly formatted PDF documents.
- **💬 RAG Chatbot ("Chat with your Report")** — Ask questions like *"Why is my Vitamin D low?"* and receive answers grounded strictly in your report data.
- **📈 Historical Trend Analysis** — Visually graph vitals over time (Hemoglobin, WBC, Cholesterol, etc.) using interactive Recharts line charts.
- **🌍 Multi-Language Translation** — Translate medical findings into Hindi, Spanish, French, and other languages.
- **⚡ Cached Analysis** — Analyses are securely persisted in PostgreSQL to prevent duplicate API processing and provide instant loading.
- **📊 Analysis PDF & CSV Export** — Export comprehensive analysis reports as formatted PDFs or raw tabular CSV spreadsheets.

### 🎨 Modern Dark Glassmorphism UI
- **🌌 Ambient Dark Theme** — Deep navy aesthetic (`#0a0f1c`) paired with frosted glass panels (`backdrop-filter: blur(16px)`).
- **✨ Animated Visual Elements** — Floating particle orbs, smooth gradient transitions, and responsive hover-lift cards.
- **🌓 Dynamic Theme Toggle** — Seamlessly switch between light and dark modes with persistent local storage.


### 🚨 Clinical Emergency Safety System
- **⚠️ Panic Value Detection Engine** — Evaluates incoming biomarkers against emergency laboratory thresholds (e.g., Hemoglobin < 7.0 g/dL, Platelets < 30,000 /cumm, Blood Sugar > 350 mg/dL).
- **🔴 Pulsing Emergency Banners** — Renders high-visibility amber/red clinical advisory banners with condition summaries and suggested physician escalation directives.
- **🛡️ Medical Action Directives** — Contextual clinical guidance reminding patients of critical lab deviations prior to routine consultation.

### 🔐 Authentication, Privacy & Clinical Security
- **🔒 Zero-Leakage Data Isolation** — All report queries strictly filter by authenticated `user_id`, guaranteeing cross-tenant patient privacy.
- **🛡️ Secure File Sanitation** — Uploaded filenames and MIME types undergo strict server-side validation to prevent path traversal and execution exploits.
- **🔑 Cryptographic Standards** — Passwords hashed with salted bcrypt algorithms; access tokens encrypted via HS256 JWT sessions.
- **🔑 JWT Authentication** — Secure user sessions via bcrypt password hashing and JSON Web Tokens.
- **🛡️ Role-Based Access Control (RBAC)** — Three-tier permissions:
  - `patient`: Isolated access to personal records and reports.
  - `doctor`: Clinic-wide visibility and search capabilities across all patients.
  - `admin`: Full administrative control with user role assignment and status management.
- **🔒 Data Privacy & Isolation** — Strict database querying enforced by user ID checks across all endpoints.

### 👑 Admin Management Panel
- **👥 User Administration** — Paginated, searchable user registry.
- **🔄 Role Elevation** — Promote or change user roles (`patient`, `doctor`, `admin`).
- **🚫 Account Moderation** — Suspend, ban, or delete accounts with cascading relationship cleanups.
- **📊 System Stats** — High-level metrics on registered users, active sessions, and analyzed documents.

### 🏥 Clinic Dashboard (Doctor View)
- **🔍 Real-Time Patient Search** — Debounced search filtering patients by name or report filename.
- **📋 Multi-Criteria Sorting** — Sort records by Newest, Oldest, or Alphabetically.
- **📄 Server-Side Pagination** — High-performance pagination for large clinical record volumes.
- **🏷️ Visual Status Badges** — Instant visual confirmation of analyzed vs. pending documents.

### 👤 User Settings & Profile
- **✏️ Profile Customization** — Update name and email address with inline validation.
- **🔐 Password Management** — Secure password changes verified against existing bcrypt hashes.
- **⚠️ Danger Zone** — Self-service cascading account deletion.

### 📧 Email Notifications
- **📬 Automated Analysis Alerts** — Background notification delivery upon completed report analysis using FastAPI `BackgroundTasks`.
- **🖨️ Local SMTP Simulation** — Cleanly formatted email terminal previews for streamlined local testing.

### 🐳 DevOps & Deployment
- **🏗️ Containerized Architecture** — `docker-compose.yml` orchestrating PostgreSQL, FastAPI backend, and React/Nginx frontend.
- **⚡ Single-Command Startup** — Spin up the entire infrastructure with `docker-compose up --build`.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 & Vite | SPA framework & high-speed development bundle |
| Tailwind CSS v4 | Custom utility-first styling & glassmorphic dark theme |
| Recharts | Interactive trend charts and analytical graphs |
| React Router v6 | Client-side routing and protected paths |
| Axios | API communication with JWT interceptors |
| React Hot Toast | Real-time notifications and system feedback |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI (Python 3.11) | High-performance asynchronous REST API framework |
| PostgreSQL & SQLAlchemy | Relational persistence with ORM modeling |
| Tesseract OCR & pdf2image | Optical character recognition on uploaded PDFs |
| Google Gemini 2.5 Flash | Large language model for clinical summarization & risk scoring |
| python-jose & passlib | JWT creation, validation, and bcrypt password hashing |
| pdfkit & wkhtmltopdf | Headless PDF rendering & document generation |

### DevOps
| Technology | Purpose |
|---|---|
| Docker & Docker Compose | Multi-container environment orchestration |
| Nginx | Production reverse proxy & frontend static serving |

---

## 📂 Project Structure

```
AI-BloodTest-Report-Analyzer/
│
├── app/
│   ├── ai/                    # Gemini AI integration (Diet, Chat, Translate, Risk Score)
│   ├── api/
│   │   ├── auth.py            # Login, Signup, JWT & RBAC dependencies
│   │   ├── admin.py           # User management, role moderation & admin stats
│   │   ├── compare.py         # Side-by-side report comparison & diffing
│   │   ├── export.py          # CSV export generation
│   │   ├── health_score.py    # AI Health Risk Score endpoint
│   │   ├── reports.py         # Upload, Analyze, Download, Search, Paginate
│   │   ├── chat.py            # RAG Chatbot endpoint
│   │   ├── diet.py            # Diet plan generation & PDF download
│   │   ├── translate.py       # Multi-language translation
│   │   ├── trends.py          # Parameter historical trend aggregation
│   │   ├── dashboard.py       # Analytics stats
│   │   └── users.py           # Profile management, security & account deletion
│   ├── database/
│   │   ├── models.py          # User model (roles, status, timestamps)
│   │   ├── report_models.py   # BloodReport model
│   │   ├── analysis_models.py # ReportAnalysis model
│   │   └── database.py        # SQLAlchemy session & database engine
│   ├── services/
│   │   └── pdf_service.py     # PDF generation (analysis reports & diet plans)
│   ├── email_utils.py         # Background email dispatching & terminal mock
│   ├── ocr/                   # Tesseract OCR PDF text extraction
│   ├── parser/                # Regex & semantic blood parameter extraction
│   └── main.py                # FastAPI app initialization & router registration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisTable.jsx     # Parameter results with status badges
│   │   │   ├── DashboardStats.jsx    # Metric cards & distribution chart
│   │   │   ├── DietPlan.jsx          # Diet plan display & PDF download
│   │   │   ├── ExportModal.jsx       # CSV export modal dialog
│   │   │   ├── FeatureCards.jsx      # Glassmorphism feature cards
│   │   │   ├── HealthRiskScore.jsx   # SVG score gauge & risk assessment
│   │   │   ├── Hero.jsx              # Hero with animated particles
│   │   │   ├── Navbar.jsx            # Frosted glass navigation with avatar
│   │   │   ├── ReportChat.jsx        # RAG interactive chat interface
│   │   │   ├── SummaryCard.jsx       # AI summary & multi-language translation
│   │   │   ├── ThemeToggle.jsx       # Light/Dark mode switch
│   │   │   └── TrendGraph.jsx        # Historical longitudinal charts
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global authentication & user session state
│   │   │   └── ThemeContext.jsx      # Dark mode state & local persistence
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Main report upload & interactive analysis
│   │   │   ├── History.jsx           # Historical report log with CSV export
│   │   │   ├── CompareReports.jsx    # Side-by-side comparison screen
│   │   │   ├── DoctorDashboard.jsx   # Clinic-wide patient management (Doctor view)
│   │   │   ├── AdminPanel.jsx        # Administrative user moderation console
│   │   │   ├── ReportDetails.jsx     # Comprehensive single-report view
│   │   │   ├── Settings.jsx          # User settings, security & deletion
│   │   │   ├── Login.jsx             # User authentication
│   │   │   └── Signup.jsx            # User registration
│   │   └── services/
│   │       └── api.js                # Axios instance with auth interceptor
│   ├── Dockerfile                    # Multi-stage production Nginx container
│   └── package.json
│
├── backend.Dockerfile                # Python 3.11 + wkhtmltopdf + dependencies
├── docker-compose.yml                # Multi-container orchestration
├── requirements.txt
├── .env.example
├── CHANGELOG.md
└── README.md
```

---

## 🔗 API Endpoints

### Authentication & Users
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user account |
| `POST` | `/auth/login` | Authenticate and obtain JWT token |
| `PUT` | `/users/me/profile` | Update profile display name and email |
| `PUT` | `/users/me/password` | Change user password securely |
| `DELETE` | `/users/me` | Delete account with cascading data deletion |

### Reports & Diagnostics
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/reports/upload` | Upload a blood test report (PDF) |
| `POST` | `/reports/analyze/{id}` | Execute OCR & AI analysis on report |
| `GET` | `/reports/` | List reports (search, sort, and paginate) |
| `GET` | `/reports/{id}` | Fetch detailed analysis for a specific report |
| `GET` | `/reports/{id}/download` | Download complete medical report as PDF |
| `GET` | `/reports/export/csv` | Export blood parameter records to CSV |
| `GET` | `/reports/progress/{id}` | Real-time SSE analysis progress stream |
| `GET` | `/reports/progress/{id}/status` | Fallback JSON polling progress endpoint |
| `GET` | `/reports/compare/{id_a}/{id_b}` | Side-by-side parameter diff of two reports |
| `DELETE` | `/reports/{id}` | Delete report, analysis, and stored PDF |

### AI Analysis & Health Features
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reports/{id}/risk-score` | Calculate AI health risk score (0-100) & risk factors |
| `GET` | `/reports/{id}/diet-plan` | Generate personalized nutritional plan |
| `GET` | `/diet/{id}/download` | Download personalized diet plan as PDF |
| `POST` | `/reports/{id}/chat` | Ask questions grounded in report data (RAG) |
| `POST` | `/reports/{id}/translate` | Translate medical summary into target language |
| `GET` | `/trends/{patient_name}` | Fetch longitudinal parameter trends over time |

### Administration & Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/stats` | Retrieve aggregate clinic metrics |
| `GET` | `/admin/users` | List all users with pagination and search |
| `PUT` | `/admin/users/{id}/role` | Update user role (`patient`, `doctor`, `admin`) |
| `PUT` | `/admin/users/{id}/status` | Update account status (`active`, `suspended`, `banned`) |
| `DELETE` | `/admin/users/{id}` | Permanently delete user and records |
| `GET` | `/admin/stats` | Fetch system-wide administrative statistics |
| `GET` | `/health` | Health check endpoint |

---

## ❓ Troubleshooting & FAQs

- **Q: TesseractNotFoundError when uploading PDF?**
  - *A:* Ensure Tesseract OCR binary is installed and present in your system PATH (or configure `pytesseract.pytesseract.tesseract_cmd`).
- **Q: wkhtmltopdf missing when exporting PDF?**
  - *A:* Install `wkhtmltopdf` package on your host OS or deploy via Docker where all binary binaries are pre-installed.
- **Q: Database connection refused?**
  - *A:* Verify PostgreSQL server is actively running on port 5432 and credentials match your `.env` configuration.

---

## 🏁 How to Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Tesseract OCR installed on host system
- Google Gemini API key

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/yashashvisri/AI-BloodTest-Report-Analyzer.git
cd AI-BloodTest-Report-Analyzer

# Create virtual environment
python -m venv venv
source venv/Scripts/activate   # Windows PowerShell: .\venv\Scripts\Activate.ps1
# source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file from the example:
```bash
cp .env.example .env
```

Set your environment variables:
```env
# Database Connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/blood_report_db

# Google Gemini API Key (Obtain from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Security & Session Management
JWT_SECRET_KEY=your_jwt_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Server Configuration
PORT=8000
HOST=127.0.0.1
DEBUG=True
```

Start the FastAPI application:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Docker Deployment (Alternative)
```bash
docker-compose up --build
```
Spins up PostgreSQL, FastAPI, and React/Nginx under a unified bridge network.

---

## 🚀 Production Deployment Guidelines

For enterprise or clinical SaaS environments:
1. **TLS / SSL Termination**: Ensure Nginx or Cloudflare terminates HTTPS before routing requests to FastAPI.
2. **Database Connection Pooling**: Configure SQLAlchemy pool size (`pool_size=20`, `max_overflow=10`) for optimal throughput.
3. **OCR Compute Allocation**: Tesseract execution consumes brief CPU spikes; ensure containers are allocated at least 2 vCPUs and 2GB RAM.
4. **Persistent Asset Storage**: Store uploaded raw PDFs and generated reports on an S3-compatible bucket or dedicated block volume.

---

## 🗺️ Roadmap & Progress

- [x] PDF OCR extraction with Tesseract
- [x] AI Medical Summarization with Google Gemini
- [x] Actionable Diet & Lifestyle Plans with PDF export
- [x] Grounded RAG Chatbot ("Chat with your Report")
- [x] Longitudinal Parameter Trend Graphs
- [x] Multi-Language Translation
- [x] JWT Authentication & Role-Based Access Control (RBAC)
- [x] Clinic Dashboard with Search, Sort & Pagination
- [x] Profile Management & Cascading Account Deletion
- [x] Background Email Notifications
- [x] Dark Mode & Glassmorphic UI Redesign
- [x] CSV Export for Report History
- [x] AI Health Risk Score Gauge & Assessment
- [x] Side-by-Side Report Comparison & Diff Analysis
- [x] Full Admin Panel for User & Role Management
- [x] Docker & Docker Compose Containerization
- [x] Real-time SSE analysis progress indicators (OCR ➔ Parser ➔ Gemini LLM ➔ Dashboard)
- [ ] Critical parameter SMS / Push notifications

---

## 🤝 Contributing Guidelines

Contributions are welcome! Please follow these standards:
1. Fork the Project Repository.
2. Create a Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request for review.

---

## 👨‍💻 Author

**Yashashvi Srivastava**
- GitHub: [@yashashvisri](https://github.com/yashashvisri)
