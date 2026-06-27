from fastapi import FastAPI
from app.api.users import router as users_router
from app.api.reports import router as reports_router

app = FastAPI()

app.include_router(
    users_router,
    prefix="/users",
    tags=["Users"]
)

app.include_router(
    reports_router,
    prefix="/reports",
    tags=["Reports"]
)

@app.get("/")
def home():
    return {
        "message": "Blood Report AI API Running"
    }