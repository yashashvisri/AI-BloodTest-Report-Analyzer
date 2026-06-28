from app.ocr.ocr_service import extract_text_from_pdf

text = extract_text_from_pdf("sample.pdf")

print("=" * 60)
print("PDF OCR OUTPUT")
print("=" * 60)

print(text)