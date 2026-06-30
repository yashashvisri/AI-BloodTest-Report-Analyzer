import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis

from app.services.report_service import analyze_report
from app.schemas.analysis import AnalysisResponse

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==========================================================
# Upload Report
# ==========================================================

@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED
)
def upload_report(
    patient_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    extension = os.path.splitext(file.filename)[1]

    unique_filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    report = BloodReport(
        patient_name=patient_name,
        original_filename=file.filename,
        stored_filename=unique_filename,
        file_path=file_path,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {

        "message": "Report uploaded successfully",

        "report": {

            "id": report.id,

            "patient_name": report.patient_name,

            "filename": report.original_filename

        }

    }


# ==========================================================
# Get All Reports
# ==========================================================

@router.get("/")
def get_all_reports(
    db: Session = Depends(get_db)
):

    reports = db.query(BloodReport).all()

    return {

        "total_reports": len(reports),

        "reports": reports

    }


# ==========================================================
# Get Single Report
# ==========================================================

@router.get("/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (

        db.query(BloodReport)

        .filter(BloodReport.id == report_id)

        .first()

    )

    if report is None:

        raise HTTPException(

            status_code=404,

            detail="Report not found."

        )

    return report


# ==========================================================
# Delete Report
# ==========================================================

@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (

        db.query(BloodReport)

        .filter(BloodReport.id == report_id)

        .first()

    )

    if report is None:

        raise HTTPException(

            status_code=404,

            detail="Report not found."

        )

    if os.path.exists(report.file_path):

        os.remove(report.file_path)

    db.delete(report)

    db.commit()

    return {

        "message": "Report deleted successfully."

    }


# ==========================================================
# AI Analysis
# ==========================================================

@router.post(
    "/analyze/{report_id}",
    response_model=AnalysisResponse
)
def analyze_blood_report_api(

    report_id: int,

    db: Session = Depends(get_db)

):

    report = (

        db.query(BloodReport)

        .filter(BloodReport.id == report_id)

        .first()

    )

    if report is None:

        raise HTTPException(

            status_code=404,

            detail="Report not found."

        )

    result = analyze_report(

        db=db,

        report_id=report.id,

        file_path=report.file_path

    )

    return result


# ==========================================================
# Get Saved Analysis
# ==========================================================

@router.get("/analysis/{report_id}")
def get_saved_analysis(

    report_id: int,

    db: Session = Depends(get_db)

):

    analysis = (

        db.query(ReportAnalysis)

        .filter(

            ReportAnalysis.report_id == report_id

        )

        .first()

    )

    if analysis is None:

        raise HTTPException(

            status_code=404,

            detail="Analysis not found."

        )

    return {

        "report_id": analysis.report_id,

        "ocr_text": analysis.ocr_text,

        "parameters": analysis.parameters,

        "analysis": analysis.analysis,

        "ai_summary": analysis.ai_summary,

        "cached": True

    }