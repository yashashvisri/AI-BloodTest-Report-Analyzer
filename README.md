# 🩸 AI-BloodTest-Report-Analyzer

AI-powered Blood Test Report Analysis System built using **FastAPI, PostgreSQL, SQLAlchemy, OCR, RAG, LLMs, and Docker**.

---

## 📌 Project Overview

This project automates blood test report analysis using Artificial Intelligence.

Users can upload blood report PDFs, extract text using OCR, store report data in PostgreSQL, generate embeddings for RAG-based retrieval, and receive AI-powered health insights using Large Language Models.

---

## 🚀 Current Progress

### ✅ Completed

- Project Architecture Setup
- GitHub Repository Setup
- Python Virtual Environment Setup
- FastAPI Backend Initialization
- PostgreSQL Database Configuration
- SQLAlchemy ORM Integration
- Environment Variable Management (.env)
- Database Connection Management
- User Database Model Creation
- Automatic Table Creation Script
- Docker Installation & Configuration
- Health Check API Endpoint

### 🚧 In Progress

- User Management APIs
- Blood Report Upload API

### 📅 Upcoming Features

- OCR Integration (Tesseract)
- PDF Blood Report Processing
- AI-Powered Report Analysis
- RAG Pipeline
- Vector Database Integration
- React Frontend
- Dockerized Deployment

---

## 🏗️ Project Structure

```text
AI-BloodTest-Report-Analyzer/
│
├── app/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── llm/
│   ├── models/
│   ├── ocr/
│   ├── rag/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   ├── __init__.py
│   └── main.py
│
├── data/
├── docker/
├── docs/
├── frontend/
├── scripts/
├── tests/
├── uploads/
├── vector_db/
│
├── .env
├── .gitignore
├── README.md
└── requirements.txt
```

---
