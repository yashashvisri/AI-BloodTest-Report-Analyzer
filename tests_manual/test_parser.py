from app.ocr.ocr_service import extract_text_from_pdf
from app.parser.blood_parser import extract_blood_parameters

text = extract_text_from_pdf("sample.pdf")

result = extract_blood_parameters(text)

print()

print("=" * 60)

print("EXTRACTED PARAMETERS")

print("=" * 60)

for key, value in result.items():

    print(f"{key:15} : {value}")