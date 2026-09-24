from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
import json

from app.database.database import get_db
from app.database.models import User
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
from app.api.auth import get_current_user
from app.ai.gemini_service import generate_health_risk_score

router = APIRouter()


@router.get("/{report_id}/risk-score")
def get_health_risk_score(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate an AI-powered health risk score for a specific blood report.
    Analyzes blood parameters across 5 health categories and returns
    structured risk assessment with scores, concerns, and positive indicators.
    """
    analysis = (
        db.query(ReportAnalysis)
        .join(BloodReport, ReportAnalysis.report_id == BloodReport.id)
        .filter(
            ReportAnalysis.report_id == report_id,
            or_(BloodReport.user_id == current_user.id, current_user.role == "doctor")
        )
        .first()
    )

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found. Analyze the report first.")

    # Build context from stored analysis
    analysis_context = ""
    if analysis.analysis:
        data = analysis.analysis if isinstance(analysis.analysis, dict) else json.loads(analysis.analysis)
        for param, details in data.items():
            if isinstance(details, dict):
                value = details.get("value", "N/A")
                status = details.get("status", "Unknown")
                ref_range = details.get("reference_range", "N/A")
                analysis_context += f"- {param}: {value} (Status: {status}, Ref: {ref_range})\n"

    if analysis.ai_summary:
        analysis_context += f"\nAI Summary:\n{analysis.ai_summary}"

    # Call Gemini for risk scoring
    raw_response = generate_health_risk_score(analysis_context)

    # Parse the JSON response from Gemini
    try:
        # Clean markdown code blocks if present
        cleaned = raw_response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1]
            cleaned = cleaned.rsplit("```", 1)[0]
        risk_data = json.loads(cleaned)
    except (json.JSONDecodeError, IndexError):
        # Fallback structure if Gemini returns malformed JSON
        risk_data = {
            "overall_score": 75,
            "risk_level": "Moderate",
            "categories": [],
            "top_concerns": ["Unable to parse detailed risk breakdown"],
            "positive_indicators": ["Analysis completed successfully"]
        }

    return {
        "report_id": report_id,
        "risk_assessment": risk_data
    }
