from sqlalchemy.orm import Session

from app.ocr.ocr_service import extract_text_from_pdf
from app.parser.blood_parser import extract_blood_parameters
from app.services.analyzer import analyze_parameters
from app.ai.gemini_service import analyze_blood_report

from app.services.analysis_service import (
    save_analysis,
    get_analysis
)


def analyze_report(
    db: Session,
    report_id: int,
    file_path: str
):
    """
    Complete Blood Report Analysis Pipeline

    1. Check cached analysis
    2. OCR
    3. Extract Parameters
    4. Rule-based Analysis
    5. Gemini AI Summary
    6. Save Analysis
    """

    # ----------------------------------------
    # Check if analysis already exists
    # ----------------------------------------

    existing = get_analysis(
        db=db,
        report_id=report_id
    )

    if existing:

        return {

            "report_id": report_id,

            "ocr_text": existing.ocr_text,

            "parameters": existing.parameters,

            "analysis": existing.analysis,

            "ai_summary": existing.ai_summary,

            "cached": True

        }

    # ----------------------------------------
    # OCR
    # ----------------------------------------

    extracted_text = extract_text_from_pdf(
        file_path
    )

    # ----------------------------------------
    # Extract Blood Parameters
    # ----------------------------------------

    parameters = extract_blood_parameters(
        extracted_text
    )

    # ----------------------------------------
    # Analyze Parameters
    # ----------------------------------------

    analysis = analyze_parameters(
        parameters
    )

    # ----------------------------------------
    # Generate AI Summary
    # ----------------------------------------

    ai_summary = analyze_blood_report(
        analysis
    )

    # ----------------------------------------
    # Save Analysis to Database
    # ----------------------------------------

    save_analysis(
        db=db,
        report_id=report_id,
        ocr_text=extracted_text,
        parameters=parameters,
        analysis=analysis,
        ai_summary=ai_summary
    )

    # ----------------------------------------
    # Return Fresh Analysis
    # ----------------------------------------

    return {

        "report_id": report_id,

        "ocr_text": extracted_text,

        "parameters": parameters,

        "analysis": analysis,

        "ai_summary": ai_summary,

        "cached": False

    }