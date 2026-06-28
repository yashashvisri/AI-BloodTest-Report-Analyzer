from app.ocr.ocr_service import extract_text_from_pdf
from app.parser.blood_parser import extract_blood_parameters
from app.services.analyzer import analyze_parameters
from app.ai.gemini_service import analyze_blood_report


def analyze_report(file_path: str):

    # OCR
    extracted_text = extract_text_from_pdf(file_path)

    # Parameter Extraction
    parameters = extract_blood_parameters(extracted_text)

    # Analysis
    analysis = analyze_parameters(parameters)

    # AI Summary
    ai_summary = analyze_blood_report(analysis)

    return {
        "ocr_text": extracted_text,
        "parameters": parameters,
        "analysis": analysis,
        "ai_summary": ai_summary
    }