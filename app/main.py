from fastapi import FastAPI

app = FastAPI(
    title="Blood Report AI",
    description="AI-powered Blood Test Report Analysis System",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Blood Report AI API Running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }