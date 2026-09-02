from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.models import User
from app.api.auth import get_current_user
from pydantic import BaseModel
import json

from app.database.database import get_db
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis

router = APIRouter()

@router.get("/{patient_name}")
def get_trends(patient_name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reports = db.query(BloodReport).filter(BloodReport.patient_name == patient_name, BloodReport.user_id == current_user.id).order_by(BloodReport.id.asc()).all()
    
    if not reports:
        raise HTTPException(status_code=404, detail="No reports found for this patient.")

    trends_data = []

    for idx, report in enumerate(reports):
        analysis = db.query(ReportAnalysis).filter(ReportAnalysis.report_id == report.id).first()
        if analysis and analysis.analysis:
            data_point = {"name": f"Test {idx + 1}"}
            # extract values from analysis.analysis
            # analysis format: {"Hemoglobin": {"value": "12.5", "status": "Normal", ...}}
            # Need to parse float if possible
            for param, details in analysis.analysis.items():
                if isinstance(details, dict) and 'value' in details:
                    val = details['value']
                    if val is not None:
                        # Try to clean non-numeric characters (like "mg/dL")
                        cleaned = ''.join(c for c in str(val) if c.isdigit() or c == '.')
                        try:
                            if cleaned:
                                data_point[param] = float(cleaned)
                        except:
                            pass
            
            trends_data.append(data_point)

    return {"patient_name": patient_name, "trends": trends_data}
