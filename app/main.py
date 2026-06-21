from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Blood Report AI API Running"
    }