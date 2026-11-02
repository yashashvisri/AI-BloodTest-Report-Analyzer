from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.database import get_db
from app.database.models import User
from app.database.report_models import BloodReport
from app.api.auth import get_current_user
from app.services.progress_manager import progress_manager

router = APIRouter()

@router.get("/progress/{report_id}")
async def get_report_progress_stream(
    report_id: int,
    token: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Stream real-time analysis progress using Server-Sent Events (SSE).
    Clients connect via EventSource to observe live OCR, parsing, and AI steps.
    """
    report = db.query(BloodReport).filter(BloodReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return StreamingResponse(
        progress_manager.stream_progress(report_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
