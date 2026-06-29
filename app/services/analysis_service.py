from sqlalchemy.orm import Session

from app.database.analysis_models import ReportAnalysis


def save_analysis(
    db: Session,
    report_id: int,
    ocr_text: str,
    parameters: dict,
    analysis: dict,
    ai_summary: str
):

    existing = (
        db.query(ReportAnalysis)
        .filter(ReportAnalysis.report_id == report_id)
        .first()
    )

    if existing:
        return existing

    record = ReportAnalysis(
        report_id=report_id,
        ocr_text=ocr_text,
        parameters=parameters,
        analysis=analysis,
        ai_summary=ai_summary,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record