import pytesseract
from pdf2image import convert_from_path
from PIL import Image

# Tesseract executable
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# Poppler binaries
POPPLER_PATH = r"C:\poppler\Library\bin"


def extract_text_from_image(image_path: str):

    image = Image.open(image_path)

    text = pytesseract.image_to_string(image)

    return text


def extract_text_from_pdf(pdf_path: str):

    pages = convert_from_path(
        pdf_path,
        poppler_path=POPPLER_PATH
    )

    full_text = ""

    for page in pages:

        text = pytesseract.image_to_string(page)

        full_text += text + "\n\n"

    return full_text