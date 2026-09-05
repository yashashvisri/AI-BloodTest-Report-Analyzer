from app.database.report_models import BloodReport
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.models import User
from app.api.auth import get_current_user
from pydantic import BaseModel

from app.database.database import get_db
from app.database.analysis_models import ReportAnalysis
from app.ai.gemini_service import generate_diet_plan

router = APIRouter()

@router.get("/{report_id}/diet-plan")
def get_diet_plan(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analysis = db.query(ReportAnalysis).join(BloodReport, ReportAnalysis.report_id == BloodReport.id).filter(ReportAnalysis.report_id == report_id, or_(BloodReport.user_id == current_user.id, current_user.role == 'doctor')).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this report.")
    
    diet_plan = generate_diet_plan(analysis.ai_summary)
    
    return {"report_id": report_id, "diet_plan": diet_plan}

@router.get("/{report_id}/download")
def download_diet_pdf(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analysis = db.query(ReportAnalysis).join(BloodReport, ReportAnalysis.report_id == BloodReport.id).filter(
        ReportAnalysis.report_id == report_id,
        or_(BloodReport.user_id == current_user.id, current_user.role == 'doctor')
    ).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    report = db.query(BloodReport).filter(BloodReport.id == report_id).first()
    
    # Check if a diet plan actually exists in the AI summary or needs regeneration
    diet_content = analysis.ai_summary  # Using AI Summary as fallback if diet isn't stored separately
    
    pdf_buffer = generate_diet_pdf(patient_name=report.patient_name, report_id=report.id, diet_plan=diet_content)
    
    filename = f"diet_plan_{report.id}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
