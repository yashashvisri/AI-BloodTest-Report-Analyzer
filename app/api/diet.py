from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.database.analysis_models import ReportAnalysis
from app.ai.gemini_service import generate_diet_plan

router = APIRouter()

@router.get("/{report_id}/diet-plan")
def get_diet_plan(report_id: int, db: Session = Depends(get_db)):
    analysis = db.query(ReportAnalysis).filter(ReportAnalysis.report_id == report_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this report.")
    
    diet_plan = generate_diet_plan(analysis.ai_summary)
    
    return {"report_id": report_id, "diet_plan": diet_plan}
