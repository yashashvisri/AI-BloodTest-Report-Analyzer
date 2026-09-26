from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from io import StringIO
import csv
import json

from app.database.database import get_db
from app.database.models import User
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/export/csv")
def export_reports_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Export all of the current user's blood reports and analysis results as a CSV file.
    Doctors can export all patient records.
    """
    query = db.query(BloodReport)
    if current_user.role not in ["doctor", "admin"]:
        query = query.filter(BloodReport.user_id == current_user.id)

    reports = query.order_by(BloodReport.id.desc()).all()

    if not reports:
        raise HTTPException(status_code=404, detail="No reports found to export")

    # Collect all unique parameter names across all reports
    all_params = set()
    report_analyses = {}
    for report in reports:
        analysis = db.query(ReportAnalysis).filter(ReportAnalysis.report_id == report.id).first()
        if analysis and analysis.analysis:
            data = analysis.analysis if isinstance(analysis.analysis, dict) else json.loads(analysis.analysis)
            for param in data.keys():
                all_params.add(param)
            report_analyses[report.id] = data
        else:
            report_analyses[report.id] = {}

    sorted_params = sorted(all_params)

    # Build CSV
    output = StringIO()
    writer = csv.writer(output)

    # Header row
    header = ["Report ID", "Patient Name", "File Name"]
    for param in sorted_params:
        header.extend([f"{param} (Value)", f"{param} (Status)", f"{param} (Reference)"])
    writer.writerow(header)

    # Data rows
    for report in reports:
        row = [report.id, report.patient_name, report.original_filename]
        analysis_data = report_analyses.get(report.id, {})
        for param in sorted_params:
            details = analysis_data.get(param, {})
            if isinstance(details, dict):
                row.append(details.get("value", ""))
                row.append(details.get("status", ""))
                row.append(details.get("reference_range", ""))
            else:
                row.extend(["", "", ""])
        writer.writerow(row)

    output.seek(0)

    filename = f"blood_reports_{current_user.username}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
