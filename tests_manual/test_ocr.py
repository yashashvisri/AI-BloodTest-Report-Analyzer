from app.ocr.ocr_service import extract_text_from_image

image_path = "sample.png"   # Replace with your image filename

text = extract_text_from_image(image_path)

print("\n========== OCR OUTPUT ==========\n")
print(text)