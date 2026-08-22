from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.users import router as users_router
from app.api.reports import router as reports_router


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

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

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