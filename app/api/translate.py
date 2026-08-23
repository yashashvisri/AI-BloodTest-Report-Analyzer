from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.database.analysis_models import ReportAnalysis
from app.ai.gemini_service import translate_summary

router = APIRouter()

class TranslateRequest(BaseModel):
    language: str

@router.post("/{report_id}/translate")
def translate_endpoint(report_id: int, request: TranslateRequest, db: Session = Depends(get_db)):
    analysis = db.query(ReportAnalysis).filter(ReportAnalysis.report_id == report_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this report.")
    
    translated_text = translate_summary(analysis.ai_summary, request.language)
    
    return {"report_id": report_id, "translated_summary": translated_text}
