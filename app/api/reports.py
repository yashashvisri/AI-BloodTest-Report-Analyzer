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
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session
from app.database.models import User
from app.api.auth import get_current_user

from app.database.database import get_db
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis

from app.services.report_service import analyze_report
from app.services.pdf_service import generate_report_pdf

from app.schemas.analysis import AnalysisResponse


# ==========================================================
# Router
# ==========================================================

router = APIRouter()


UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


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

    extension = os.path.splitext(
        file.filename
    )[1]

    unique_filename = (
        f"{uuid.uuid4()}{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    report = BloodReport(
        patient_name=patient_name,
        original_filename=file.filename,
        stored_filename=unique_filename,
        file_path=file_path,
        user_id=current_user.id
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role == "doctor":
        reports = db.query(BloodReport).all()
    else:
        reports = (
            db.query(BloodReport)
            .filter(BloodReport.user_id == current_user.id)
            .all()
        )

    return {

        "total_reports": len(reports),

        "reports": reports

    }


# ==========================================================
# Get Saved Analysis
# ==========================================================

@router.get(
    "/analysis/{report_id}"
)
def get_saved_analysis(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    analysis = (

        db.query(ReportAnalysis)
        .join(BloodReport, ReportAnalysis.report_id == BloodReport.id)
        .filter(
            ReportAnalysis.report_id == report_id,
            BloodReport.user_id == current_user.id
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

        "ai_summary": analysis.ai_summary

    }


# ==========================================================
# Analyze Blood Report
# ==========================================================

@router.post(
    "/analyze/{report_id}",
    response_model=AnalysisResponse
)
def analyze_blood_report_api(
    report_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    report = (

        db.query(BloodReport)

        .filter(
            BloodReport.id == report_id,
            BloodReport.user_id == current_user.id
        )

        .first()

    )

    if report is None:

        raise HTTPException(

            status_code=404,

            detail="Report not found."

        )

    result = analyze_report(
        file_path=report.file_path,
        db=db,
        report_id=report.id
    )

    background_tasks.add_task(send_analysis_email, current_user.email, report.patient_name, report.id)
    return {

        "report_id": report.id,

        **result

    }


# ==========================================================
# Download PDF Report
# ==========================================================

@router.get(
    "/{report_id}/download"
)
def download_report_pdf(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ------------------------------------------------------
    # Find report
    # ------------------------------------------------------

    report = (

        db.query(BloodReport)

        .filter(
            BloodReport.id == report_id,
            BloodReport.user_id == current_user.id
        )

        .first()

    )

    if report is None:

        raise HTTPException(

            status_code=404,

            detail="Report not found."

        )


    # ------------------------------------------------------
    # Find saved analysis
    # ------------------------------------------------------

    saved_analysis = (

        db.query(ReportAnalysis)
        .join(BloodReport, ReportAnalysis.report_id == BloodReport.id)
        .filter(
            ReportAnalysis.report_id == report_id,
            BloodReport.user_id == current_user.id
        )

        .first()

    )

    if saved_analysis is None:

        raise HTTPException(

            status_code=404,

            detail=(
                "Analysis not found. "
                "Analyze the report before downloading the PDF."
            )

        )


    # ------------------------------------------------------
    # Prepare analysis data
    # ------------------------------------------------------

    analysis_result = {

        "analysis": saved_analysis.analysis,

        "ai_summary": saved_analysis.ai_summary,

    }


    # ------------------------------------------------------
    # Generate PDF
    # ------------------------------------------------------

    try:

        pdf_buffer = generate_report_pdf(

            patient_name=report.patient_name,

            report_id=report.id,

            original_filename=report.original_filename,

            analysis_result=analysis_result,

        )

    except Exception as error:

        print(
            f"PDF generation error: {error}"
        )

        raise HTTPException(

            status_code=500,

            detail="Failed to generate PDF report."

        )


    # ------------------------------------------------------
    # File name
    # ------------------------------------------------------

    filename = (
        f"blood_report_{report.id}.pdf"
    )


    # ------------------------------------------------------
    # Return PDF
    # ------------------------------------------------------

    return StreamingResponse(

        pdf_buffer,

        media_type="application/pdf",

        headers={

            "Content-Disposition": (
                f'attachment; filename="{filename}"'
            )

        }

    )


# ==========================================================
# Get Single Report
# ==========================================================

@router.get(
    "/{report_id}"
)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    report = (

        db.query(BloodReport)

        .filter(
            BloodReport.id == report_id,
            BloodReport.user_id == current_user.id
        )

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

@router.delete(
    "/{report_id}"
)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ------------------------------------------------------
    # Find report
    # ------------------------------------------------------

    report = (

        db.query(BloodReport)

        .filter(
            BloodReport.id == report_id,
            BloodReport.user_id == current_user.id
        )

        .first()

    )

    if report is None:

        raise HTTPException(

            status_code=404,

            detail="Report not found."

        )


    # ------------------------------------------------------
    # Delete associated analysis
    # ------------------------------------------------------

    analysis = (

        db.query(ReportAnalysis)
        .join(BloodReport, ReportAnalysis.report_id == BloodReport.id)
        .filter(
            ReportAnalysis.report_id == report_id,
            BloodReport.user_id == current_user.id
        )

        .first()

    )

    if analysis is not None:

        db.delete(analysis)


    # ------------------------------------------------------
    # Delete stored PDF
    # ------------------------------------------------------

    if (
        report.file_path
        and os.path.exists(report.file_path)
    ):

        os.remove(
            report.file_path
        )


    # ------------------------------------------------------
    # Delete report
    # ------------------------------------------------------

    db.delete(report)


    # ------------------------------------------------------
    # Commit
    # ------------------------------------------------------

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(

            status_code=500,

            detail="Failed to delete report."

        )


    return {

        "message": "Report deleted successfully.",

        "report_id": report_id

    }