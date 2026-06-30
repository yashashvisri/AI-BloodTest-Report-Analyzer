from sqlalchemy.orm import Session

from app.ocr.ocr_service import extract_text_from_pdf
from app.parser.blood_parser import extract_blood_parameters
from app.services.analyzer import analyze_parameters
from app.ai.gemini_service import analyze_blood_report
from app.services.analysis_service import save_analysis


def analyze_report(
    db: Session,
    report_id: int,
    file_path: str
):
    """
    Complete Blood Report Analysis Pipeline

    PDF
      ↓
    OCR
      ↓
    Parameter Extraction
      ↓
    Analyzer
      ↓
    Gemini AI
      ↓
    Save to Database
    """

    # OCR
    extracted_text = extract_text_from_pdf(file_path)

    # Extract Parameters
    parameters = extract_blood_parameters(extracted_text)

    # Analyze Parameters
    analysis = analyze_parameters(parameters)

    # AI Summary
    ai_summary = analyze_blood_report(analysis)

    # Save Analysis
    save_analysis(
        db=db,
        report_id=report_id,
        ocr_text=extracted_text,
        parameters=parameters,
        analysis=analysis,
        ai_summary=ai_summary
    )

    return {
        "ocr_text": extracted_text,
        "parameters": parameters,
        "analysis": analysis,
        "ai_summary": ai_summary
    }