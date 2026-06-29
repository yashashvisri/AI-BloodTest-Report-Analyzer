from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.database import engine
from app.database.base import Base


class ReportAnalysis(Base):
    __tablename__ = "report_analysis"

    id = Column(Integer, primary_key=True, index=True)

    report_id = Column(
        Integer,
        ForeignKey("blood_reports.id"),
        nullable=False
    )

    ocr_text = Column(Text, nullable=False)

    extracted_parameters = Column(Text, nullable=False)

    analysis_result = Column(Text, nullable=False)

    ai_summary = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )