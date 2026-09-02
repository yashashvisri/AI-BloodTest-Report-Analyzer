from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
from app.database.models import User
from app.api.auth import get_current_user
import json

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Retrieves high-level analytics for the dashboard including total reports,
    unique patients, and an overall health score based on parameter statuses.
    """
    total_reports = db.query(BloodReport).filter(BloodReport.user_id == current_user.id).count()
    total_patients = db.query(BloodReport.patient_name).filter(BloodReport.user_id == current_user.id).distinct().count()

    analyses = db.query(ReportAnalysis).join(BloodReport, ReportAnalysis.report_id == BloodReport.id).filter(BloodReport.user_id == current_user.id).all()
    normal_count = 0
    abnormal_count = 0

    for a in analyses:
        if a.analysis:
            try:
                data = a.analysis if isinstance(a.analysis, dict) else json.loads(a.analysis)
                for key, val in data.items():
                    if isinstance(val, dict) and 'status' in val:
                        status = val['status'].lower()
                        if status == 'normal':
                            normal_count += 1
                        elif status in ['high', 'low']:
                            abnormal_count += 1
            except:
                pass

    total_params = normal_count + abnormal_count
    health_score = 100
    if total_params > 0:
        health_score = int((normal_count / total_params) * 100)

    return {
        "total_reports": total_reports,
        "total_patients": total_patients,
        "normal_params": normal_count,
        "abnormal_params": abnormal_count,
        "health_score": health_score
    }
