from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.database.analysis_models import ReportAnalysis
from app.ai.gemini_service import chat_with_report

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/{report_id}/chat")
def chat_endpoint(report_id: int, request: ChatRequest, db: Session = Depends(get_db)):
    analysis = db.query(ReportAnalysis).filter(ReportAnalysis.report_id == report_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this report.")
    
    context = f"Parameters: {analysis.parameters}\nSummary: {analysis.ai_summary}"
    answer = chat_with_report(request.question, context)
    
    return {"report_id": report_id, "answer": answer}
