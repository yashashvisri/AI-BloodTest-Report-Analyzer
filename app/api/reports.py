import os
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File

router = APIRouter()


UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
def upload_report(file: UploadFile = File(...)):
    # Generate a unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Report uploaded successfully",
        "original_filename": file.filename,
        "stored_filename": unique_filename,
        "file_path": file_path
    }