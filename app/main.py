from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.users import router as users_router
from app.api.reports import router as reports_router

os.makedirs("uploads", exist_ok=True)


app = FastAPI(
    title="AI Blood Test Report Analyzer",
    description="AI-powered blood test report analysis API",
    version="1.0.0",
)


# ==========================================================
# CORS Configuration
# ==========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(","),

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==========================================================
# Routers
# ==========================================================

app.include_router(
    users_router,
    prefix="/users",
    tags=["Users"],
)

app.include_router(
    reports_router,
    prefix="/reports",
    tags=["Reports"],
)


# ==========================================================
# Home
# ==========================================================

@app.get("/")
def home():

    return {
        "message": "Blood Report AI API Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "AI-BloodTest-Report-Analyzer"
    }


# ==========================================================
# Exception Handlers
# ==========================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred. Please try again later.", "detail": str(exc)},
    )