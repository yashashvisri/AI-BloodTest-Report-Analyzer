# 🩸 AI-BloodTest-Report-Analyzer

AI-powered Blood Test Report Analysis System built using **FastAPI, PostgreSQL, SQLAlchemy, OCR, RAG, LLMs, and Docker**.

---

## 📌 Project Overview

This project automates blood test report analysis using Artificial Intelligence.

Users can upload blood report PDFs, extract text using OCR, store report data in PostgreSQL, generate embeddings for RAG-based retrieval, and receive AI-powered health insights using Large Language Models.

---

# 🚀 Features

## 📄 Report Upload
- Upload Blood Test Reports (PDF)
- Upload patient information
- Automatic file storage
- Unique file naming using UUID

---

# 📊 Current Progress

| Module | Status |
|----------|---------|
| Project Setup | ✅ |
| FastAPI Backend | ✅ |
| PostgreSQL | ✅ |
| SQLAlchemy | ✅ |
| User APIs | ✅ |
| Report Upload | ✅ |
| Report CRUD | ✅ |
| Image OCR | ✅ |
| PDF OCR | ✅ |
| Blood Parameter Extraction | ✅ |
| Blood Parameter Analysis | ✅ |
| Gemini AI Integration | ✅ |
| AI Medical Summary | ✅ |
| End-to-End Analysis API | ✅ |
| Save AI Analysis | 🚧 |
| Frontend | 🚧 |
| Authentication | 🚧 |
| Docker | 🚧 |
| Deployment | 🚧 |


### 📅 Upcoming Features

- OCR Integration (Tesseract)
- PDF Blood Report Processing
- AI-Powered Report Analysis
- RAG Pipeline
- Vector Database Integration
- React Frontend
- Dockerized Deployment

---

# 📂 Project Structure

```text
AI-BloodTest-Report-Analyzer
│
├── app
│
├── ai
│   ├── __init__.py
│   └── gemini_service.py
│
├── api
│   ├── reports.py
│   └── users.py
│
├── database
│   ├── config.py
│   ├── create_tables.py
│   ├── database.py
│   ├── models.py
│   └── report_models.py
│
├── ocr
│   ├── __init__.py
│   └── ocr_service.py
│
├── parser
│   ├── __init__.py
│   └── blood_parser.py
│
├── services
│   ├── analyzer.py
│   └── report_service.py
│
├── schemas
│
├── uploads
│
├── sample.pdf
├── requirements.txt
├── README.md
└── .env
```
## ⚡ End-to-End AI Pipeline

```
Upload PDF
      │
      ▼
Save Report
      │
      ▼
OCR
      │
      ▼
Extract Text
      │
      ▼
Blood Parameter Extraction
      │
      ▼
Reference Range Analysis
      │
      ▼
Gemini AI
      │
      ▼
Medical Report
---
## ⚙️ Tech Stack

## Backend
- FastAPI
- Python 3.11
- SQLAlchemy
- PostgreSQL
- Pydantic

## AI & Machine Learning
- Tesseract OCR
- Pillow
- pdf2image
- Large Language Models (Planned)
- RAG (Planned)

## Tools
- Git
- GitHub
- GitHub Desktop
- VS Code
- Postman / Swagger UI

---

## 🗄️ Database Setup

### Database

```sql
blood_report_db
```

## Blood Reports Table

| Column | Type |
|---------|------|
| id | Integer |
| patient_name | String |
| original_filename | String |
| stored_filename | String |
| file_path | String |

```

---
## 🔗 API Endpoints

### Health Check Endpoint

```http
GET /
```

Response:

```json
{
  "message": "Blood Report AI API Running"
}
```

---
## 📖 Development Roadmap

### Phase 1: Backend Foundation ✅

- FastAPI Setup
- PostgreSQL Setup
- SQLAlchemy Setup
- Database Connectivity
- User Model Creation

### Phase 2: User Management 🚧

- Create User API
- Get Users API
- Update User API
- Delete User API

### Phase 3: Blood Report Processing

- Upload PDF
- OCR Extraction
- Data Cleaning

### Phase 4: AI Analysis

- Blood Parameter Extraction
- Health Risk Detection
- AI Generated Recommendations

### Phase 5: RAG Pipeline

- Embedding Generation
- Vector Storage
- Semantic Search

### Phase 6: Deployment

- Dockerization
- Production Deployment

---

# 🔄 Current Workflow

```text
User
   │
   ▼
Upload Blood Report
   │
   ▼
FastAPI
   │
   ├────────► Save File
   │              │
   │              ▼
   │         uploads/
   │
   └────────► Save Metadata
                   │
                   ▼
             PostgreSQL
                   │
                   ▼
             OCR Extraction
                   │
                   ▼
          Extracted Report Text
```
## 📊 Blood Report Analysis

Each parameter is compared against medical reference ranges.

Status generated:

- ✅ Normal
- 🔺 High
- 🔻 Low
- ❌ Not Found

---
## ⚡ Cached Analysis

If a report has already been analyzed:

- OCR is skipped
- Gemini API is skipped
- Cached analysis is returned instantly

---
## 🎨 Frontend (React)

Modern React frontend built using:

- React 19
- Vite
- Tailwind CSS
- Axios

Features:

- Patient Name Input
- PDF Selection
- Upload Progress
- FastAPI Integration
- Responsive Upload Interface

---
## 🎯 Project Goal

Build an end-to-end AI healthcare assistant capable of:

- Reading blood reports
- Extracting medical parameters
- Detecting abnormalities
- Answering health-related questions
- Generating AI-powered recommendations
- Generate Diet Plan 

---

# 👨‍💻 Author

**Yashashvi Srivastava**

AI/ML Engineer | Python Developer | FastAPI | Machine Learning | OCR | LLM | Generative AI

---
