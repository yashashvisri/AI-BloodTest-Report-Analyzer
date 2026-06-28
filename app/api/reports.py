import os
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.report_models import BloodReport
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException

from app.services.report_services import analyze_report
router = APIRouter()

UPLOAD_FOLDER = "uploads"

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==========================
# Upload Blood Report
# ==========================
@router.post("/upload", status_code=201)
def upload_report(
    patient_name: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Generate a unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save report metadata to database
    report = BloodReport(
        patient_name=patient_name,
        original_filename=file.filename,
        stored_filename=unique_filename,
        file_path=file_path
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "message": "Report uploaded successfully",
        "report": {
            "id": report.id,
            "patient_name": report.patient_name,
            "original_filename": report.original_filename,
            "stored_filename": report.stored_filename,
            "file_path": report.file_path
        }
    }


# ==========================
# Get All Blood Reports
# ==========================
@router.get("/")
def get_reports(db: Session = Depends(get_db)):

    reports = db.query(BloodReport).all()

    return {
        "total_reports": len(reports),
        "reports": reports
    }

# ==========================
# Get Report By ID
# ==========================
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

# ============================================
# Delete Report
# ============================================
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

    # Delete uploaded file
    if os.path.exists(report.file_path):
        os.remove(report.file_path)

    # Delete database record
    db.delete(report)
    db.commit()

    return {
        "message": "Report deleted successfully"
    }


@router.post("/analyze/{report_id}")
def analyze_report(
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

    # OCR
    extracted_text = extract_text_from_pdf(
        report.file_path
    )

    # Parameter Extraction
    parameters = extract_blood_parameters(
        extracted_text
    )

    # Analyzer
    analysis = analyze_parameters(
        parameters
    )

    # Gemini
    ai_summary = analyze_blood_report(
        analysis
    )

    return {

        "report_id": report.id,

        "parameters": parameters,

        "analysis": analysis,

        "ai_summary": ai_summary

    }