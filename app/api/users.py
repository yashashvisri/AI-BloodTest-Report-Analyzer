import os
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.report_models import BloodReport

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
def upload_report(
    patient_name: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

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
        "report_id": report.id,
        "patient_name": report.patient_name,
        "original_filename": report.original_filename,
        "stored_filename": report.stored_filename
    }