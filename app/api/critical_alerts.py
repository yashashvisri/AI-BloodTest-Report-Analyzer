from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.database import get_db
from app.database.models import User
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
from app.api.auth import get_current_user
from app.services.critical_rules import evaluate_critical_alerts

router = APIRouter()

@router.get("/{report_id}/critical-alerts")
def get_report_critical_alerts(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve critical laboratory emergency values and warning directives."""
    analysis = (
        db.query(ReportAnalysis)
        .join(BloodReport, ReportAnalysis.report_id == BloodReport.id)
        .filter(
            ReportAnalysis.report_id == report_id,
            or_(BloodReport.user_id == current_user.id, current_user.role in ["doctor", "admin"])
        )
        .first()
    )

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    alerts = evaluate_critical_alerts(analysis.parameters or {})
    return {
        "report_id": report_id,
        "has_critical_alerts": len(alerts) > 0,
        "alerts_count": len(alerts),
        "alerts": alerts
    }
