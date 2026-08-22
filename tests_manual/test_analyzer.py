from app.ocr.ocr_service import extract_text_from_pdf
from app.parser.blood_parser import extract_blood_parameters
from app.services.analyzer import analyze_parameters

text = extract_text_from_pdf("sample.pdf")

parameters = extract_blood_parameters(text)

analysis = analyze_parameters(parameters)

print()

print("=" * 70)
print("BLOOD REPORT ANALYSIS")
print("=" * 70)

for test_name, result in analysis.items():

    print(
        f"{test_name:<15}"
        f"{result['value']}"
        f"   {result['status']}"
        f"   ({result.get('reference_range','-')})"
    )