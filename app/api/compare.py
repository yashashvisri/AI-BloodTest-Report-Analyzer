from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
import json

from app.database.database import get_db
from app.database.models import User
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
from app.api.auth import get_current_user

router = APIRouter()


def parse_value(val_str):
    """Try to extract a numeric value from a parameter value string."""
    if not val_str:
        return None
    try:
        cleaned = str(val_str).strip().split()[0].replace(",", "")
        return float(cleaned)
    except (ValueError, IndexError):
        return None


@router.get("/compare/{report_id_a}/{report_id_b}")
def compare_reports(
    report_id_a: int,
    report_id_b: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Compare two blood reports side-by-side.
    Returns unified parameter list with values from both reports,
    plus change direction (improved, worsened, unchanged, new).
    """
    # Fetch both reports
    report_a = db.query(BloodReport).filter(
        BloodReport.id == report_id_a,
        or_(BloodReport.user_id == current_user.id, current_user.role.in_(["doctor", "admin"]))
    ).first()
    report_b = db.query(BloodReport).filter(
        BloodReport.id == report_id_b,
        or_(BloodReport.user_id == current_user.id, current_user.role.in_(["doctor", "admin"]))
    ).first()

    if not report_a or not report_b:
        raise HTTPException(status_code=404, detail="One or both reports not found")

    # Fetch analyses
    analysis_a = db.query(ReportAnalysis).filter(ReportAnalysis.report_id == report_id_a).first()
    analysis_b = db.query(ReportAnalysis).filter(ReportAnalysis.report_id == report_id_b).first()

    if not analysis_a or not analysis_b:
        raise HTTPException(status_code=400, detail="Both reports must be analyzed before comparing")

    data_a = analysis_a.analysis if isinstance(analysis_a.analysis, dict) else json.loads(analysis_a.analysis) if analysis_a.analysis else {}
    data_b = analysis_b.analysis if isinstance(analysis_b.analysis, dict) else json.loads(analysis_b.analysis) if analysis_b.analysis else {}

    # Build unified comparison
    all_params = sorted(set(list(data_a.keys()) + list(data_b.keys())))
    comparisons = []

    for param in all_params:
        entry_a = data_a.get(param, {})
        entry_b = data_b.get(param, {})

        if not isinstance(entry_a, dict):
            entry_a = {}
        if not isinstance(entry_b, dict):
            entry_b = {}

        val_a = entry_a.get("value", None)
        val_b = entry_b.get("value", None)
        status_a = entry_a.get("status", None)
        status_b = entry_b.get("status", None)
        ref = entry_a.get("reference_range") or entry_b.get("reference_range", "N/A")

        # Determine change direction
        num_a = parse_value(val_a)
        num_b = parse_value(val_b)
        change = "unchanged"

        if val_a is None and val_b is not None:
            change = "new"
        elif val_a is not None and val_b is None:
            change = "removed"
        elif num_a is not None and num_b is not None:
            if status_a in ["high", "low"] and status_b == "normal":
                change = "improved"
            elif status_a == "normal" and status_b in ["high", "low"]:
                change = "worsened"
            elif num_a != num_b:
                if status_b == "normal":
                    change = "improved"
                elif status_a == "normal":
                    change = "worsened"
                else:
                    change = "changed"

        comparisons.append({
            "parameter": param,
            "report_a": {"value": val_a, "status": status_a},
            "report_b": {"value": val_b, "status": status_b},
            "reference_range": ref,
            "change": change,
        })

    return {
        "report_a": {
            "id": report_a.id,
            "patient_name": report_a.patient_name,
            "filename": report_a.original_filename,
        },
        "report_b": {
            "id": report_b.id,
            "patient_name": report_b.patient_name,
            "filename": report_b.original_filename,
        },
        "comparisons": comparisons,
        "summary": {
            "total_params": len(comparisons),
            "improved": sum(1 for c in comparisons if c["change"] == "improved"),
            "worsened": sum(1 for c in comparisons if c["change"] == "worsened"),
            "unchanged": sum(1 for c in comparisons if c["change"] == "unchanged"),
        }
    }
