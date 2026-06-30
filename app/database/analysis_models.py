from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, JSON

from sqlalchemy.sql import func

from app.database.base import Base


class ReportAnalysis(Base):
    __tablename__ = "report_analysis"

    id = Column(Integer, primary_key=True, index=True)

    report_id = Column(
        Integer,
        ForeignKey("blood_reports.id"),
        nullable=False,
        unique=True
    )

    ocr_text = Column(Text, nullable=False)

    parameters = Column(JSON, nullable=False)

    analysis = Column(JSON, nullable=False)

    ai_summary = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )