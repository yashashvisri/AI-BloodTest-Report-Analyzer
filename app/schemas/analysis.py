from pydantic import BaseModel
from typing import Dict, Any


class AnalysisResponse(BaseModel):

    report_id: int

    ocr_text: str

    parameters: Dict[str, Any]

    analysis: Dict[str, Any]

    ai_summary: str

    cached: bool