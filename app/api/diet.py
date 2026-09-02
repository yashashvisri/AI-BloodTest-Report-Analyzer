from app.database.report_models import BloodReport
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.models import User
from app.api.auth import get_current_user
from pydantic import BaseModel

from app.database.database import get_db
from app.database.analysis_models import ReportAnalysis
from app.ai.gemini_service import generate_diet_plan

router = APIRouter()

@router.get("/{report_id}/diet-plan")
def get_diet_plan(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analysis = db.query(ReportAnalysis).join(BloodReport, ReportAnalysis.report_id == BloodReport.id).filter(ReportAnalysis.report_id == report_id, BloodReport.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this report.")
    
    diet_plan = generate_diet_plan(analysis.ai_summary)
    
    return {"report_id": report_id, "diet_plan": diet_plan}
