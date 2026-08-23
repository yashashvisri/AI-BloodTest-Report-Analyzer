# 🩸 AI-BloodTest-Report-Analyzer

An advanced, AI-powered Blood Test Report Analysis System built using **FastAPI, React, PostgreSQL, OCR, RAG, and Large Language Models (Google Gemini)**.

---

## 📌 Project Overview

This system automates blood test report analysis to empower patients and doctors. Users can upload blood report PDFs, which are scanned using OCR to extract parameters. The AI then processes these parameters to provide easy-to-understand medical summaries, personalized diet plans, and interactive capabilities like trend analysis and chatting with the report.

---

## 🚀 Key Features

*   **📄 Automated PDF OCR:** Extracts raw medical data directly from scanned blood test reports.
*   **🤖 AI Medical Summary (Gemini):** Automatically highlights abnormal parameters and explains their significance in plain English.
*   **🥗 Actionable Diet & Lifestyle Plans:** Instantly generates a personalized 7-day meal and workout plan based on the user's specific blood deficiencies.
*   **💬 RAG Chatbot ("Chat with your Report"):** Allows users to ask questions (e.g., "Why is my Vitamin D low?") and get answers based strictly on their report context.
*   **📈 Historical Trend Analysis:** Uses Recharts to visually graph and track how a patient's vitals (e.g., Hemoglobin, WBC) change across multiple blood tests over time.
*   **🌍 Multi-Language Support:** Instantly translates complex medical summaries into Hindi, Spanish, French, and more.
*   **⚡ Cached Analysis:** Reports are saved in PostgreSQL to prevent redundant OCR and API calls, loading instantly on subsequent visits.
*   **📊 PDF Export:** Users can download their AI-analyzed results as a beautifully formatted PDF.

---

## 🛠️ Tech Stack

### Frontend
*   React 19 & Vite
*   Tailwind CSS (Glassmorphism & Modern UI)
*   Recharts (Trend Graphing)
*   React Hot Toast

### Backend
*   FastAPI (Python 3.11)
*   PostgreSQL & SQLAlchemy
*   Tesseract OCR (pdf2image)
*   Google Gemini 2.5 Flash API (LLM)

---

## 📂 Project Structure

```
AI-BloodTest-Report-Analyzer/
│
├── app/
│   ├── ai/          # Gemini AI integration, Prompts (Diet, Chat, Translate)
│   ├── api/         # FastAPI routes (reports, diet, chat, trends, translate)
│   ├── database/    # SQLAlchemy models & session
│   ├── ocr/         # Tesseract OCR processing
│   ├── parser/      # Regex-based blood parameter extraction
│   └── main.py      # FastAPI entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI (TrendGraph, ReportChat, DietPlan)
│   │   └── pages/      # Views (Home, History, ReportDetails)
│   └── package.json
│
├── tests_manual/    # Testing scripts
├── uploads/         # Secure local storage for PDFs
├── requirements.txt
└── README.md
```

---

## 🔗 API Endpoints

### Core Endpoints
*   `GET /health`: System health check
*   `POST /reports/upload`: Uploads and saves PDF to the database
*   `POST /reports/analyze/{id}`: Runs OCR and Gemini Analysis
*   `GET /reports/{id}/download`: Generates a PDF of the analysis

### Advanced AI Endpoints
*   `GET /reports/{id}/diet-plan`: Generates AI Diet Plan
*   `POST /reports/{id}/chat`: RAG Chat with the blood report
*   `POST /reports/{id}/translate`: Translates summary into target language
*   `GET /trends/{patient_name}`: Aggregates historical parameter data

---

## 🏁 How to Run Locally

### 1. Backend Setup
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
```
*Create a `.env` file with `DATABASE_URL` and `GEMINI_API_KEY`.*
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 👨‍💻 Author

**Yashashvi Srivastava**
