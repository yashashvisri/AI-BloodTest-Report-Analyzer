from app.ocr.ocr_service import extract_text_from_pdf
from app.parser.blood_parser import extract_blood_parameters
from app.services.analyzer import analyze_parameters
from app.services.report_generator import generate_report

text = extract_text_from_pdf("sample.pdf")

parameters = extract_blood_parameters(text)

analysis = analyze_parameters(parameters)

report = generate_report(analysis)

print(report)