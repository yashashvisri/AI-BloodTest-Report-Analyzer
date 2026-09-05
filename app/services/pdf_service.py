import re
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
)


# ==========================================================
# Helper: Convert AI Markdown to ReportLab-safe text
# ==========================================================

def markdown_to_reportlab(text):
    """
    Convert basic Markdown formatting from the AI summary
    into safe ReportLab Paragraph markup.

    Handles:
        **bold text**
        # headings
        * bullet points
        horizontal separators
    """

    if not text:
        return ""


    text = str(text)

    # ------------------------------------------------------
    # Remove Markdown horizontal separators
    # ------------------------------------------------------

    text = re.sub(
        r"^\s*\*{3,}\s*$",
        "",
        text,
        flags=re.MULTILINE,
    )

    text = re.sub(
        r"^\s*-{3,}\s*$",
        "",
        text,
        flags=re.MULTILINE,
    )


    # ------------------------------------------------------
    # Convert Markdown headings
    # ------------------------------------------------------

    text = re.sub(
        r"^###\s+(.*)$",
        r"<b>\1</b>",
        text,
        flags=re.MULTILINE,
    )

    text = re.sub(
        r"^##\s+(.*)$",
        r"<b>\1</b>",
        text,
        flags=re.MULTILINE,
    )

    text = re.sub(
        r"^#\s+(.*)$",
        r"<b>\1</b>",
        text,
        flags=re.MULTILINE,
    )


    # ------------------------------------------------------
    # Convert bullet points
    # ------------------------------------------------------

    text = re.sub(
        r"^\s*\*\s+",
        "• ",
        text,
        flags=re.MULTILINE,
    )

    text = re.sub(
        r"^\s*-\s+",
        "• ",
        text,
        flags=re.MULTILINE,
    )


    # ------------------------------------------------------
    # Convert bold text safely
    #
    # Example:
    # **Hemoglobin (Low):**
    #
    # becomes:
    # <b>Hemoglobin (Low):</b>
    # ------------------------------------------------------

    text = re.sub(
        r"\*\*(.+?)\*\*",
        r"<b>\1</b>",
        text,
    )


    # ------------------------------------------------------
    # Remove any remaining Markdown emphasis markers
    # ------------------------------------------------------

    text = text.replace(
        "***",
        "",
    )

    text = text.replace(
        "**",
        "",
    )


    return text


# ==========================================================
# Generate Blood Report PDF
# ==========================================================

def generate_report_pdf(
    patient_name,
    report_id,
    original_filename,
    analysis_result,
):
    """
    Generate a PDF containing the blood report analysis.

    Returns:
        BytesIO: Generated PDF stored in memory.
    """

    # ------------------------------------------------------
    # Create PDF in memory
    # ------------------------------------------------------

    buffer = BytesIO()


    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )


    # ------------------------------------------------------
    # Styles
    # ------------------------------------------------------

    styles = getSampleStyleSheet()


    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontSize=22,
        leading=28,
        alignment=TA_CENTER,
        spaceAfter=12,
    )


    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.grey,
        spaceAfter=18,
    )


    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=15,
        leading=20,
        spaceBefore=12,
        spaceAfter=8,
    )


    normal_style = ParagraphStyle(
        "NormalText",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=14,
        spaceAfter=6,
    )


    summary_style = ParagraphStyle(
        "SummaryText",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=14,
        spaceAfter=6,
    )


    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        parent=styles["Normal"],
        fontSize=8,
        leading=11,
        textColor=colors.grey,
    )


    # ------------------------------------------------------
    # Story
    # ------------------------------------------------------

    story = []


    # ======================================================
    # Title
    # ======================================================

    story.append(
        Paragraph(
            "AI Blood Test Report Analyzer",
            title_style,
        )
    )


    story.append(
        Paragraph(
            "Blood Report Analysis",
            subtitle_style,
        )
    )


    # ======================================================
    # Patient Information
    # ======================================================

    story.append(
        Paragraph(
            "Patient Information",
            heading_style,
        )
    )


    patient_data = [
        [
            Paragraph(
                "<b>Patient Name</b>",
                normal_style,
            ),
            Paragraph(
                str(patient_name),
                normal_style,
            ),
        ],
        [
            Paragraph(
                "<b>Report ID</b>",
                normal_style,
            ),
            Paragraph(
                str(report_id),
                normal_style,
            ),
        ],
        [
            Paragraph(
                "<b>Original File</b>",
                normal_style,
            ),
            Paragraph(
                str(original_filename),
                normal_style,
            ),
        ],
    ]


    patient_table = Table(
        patient_data,
        colWidths=[
            45 * mm,
            125 * mm,
        ],
    )


    patient_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.whitesmoke,
            ),
            (
                "BOX",
                (0, 0),
                (-1, -1),
                0.5,
                colors.lightgrey,
            ),
            (
                "INNERGRID",
                (0, 0),
                (-1, -1),
                0.25,
                colors.lightgrey,
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "TOP",
            ),
            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                8,
            ),
            (
                "RIGHTPADDING",
                (0, 0),
                (-1, -1),
                8,
            ),
        ])
    )


    story.append(
        patient_table
    )


    story.append(
        Spacer(1, 10)
    )


    # ======================================================
    # Blood Parameters
    # ======================================================

    story.append(
        Paragraph(
            "Blood Parameter Analysis",
            heading_style,
        )
    )


    if isinstance(
        analysis_result,
        dict
    ):

        analysis = analysis_result.get(
            "analysis",
            {}
        )

    else:

        analysis = {}


    parameter_rows = [
        [
            Paragraph(
                "<b>Parameter</b>",
                normal_style,
            ),
            Paragraph(
                "<b>Value</b>",
                normal_style,
            ),
            Paragraph(
                "<b>Reference Range</b>",
                normal_style,
            ),
            Paragraph(
                "<b>Status</b>",
                normal_style,
            ),
        ]
    ]


    for parameter, details in analysis.items():

        if not isinstance(
            details,
            dict
        ):
            continue


        value = details.get(
            "value",
            "Not Found"
        )


        reference_range = details.get(
            "reference_range",
            "N/A"
        )


        parameter_status = details.get(
            "status",
            "Unknown"
        )


        parameter_name = (
            parameter
            .replace(
                "_",
                " "
            )
            .title()
        )


        parameter_rows.append(
            [
                Paragraph(
                    parameter_name,
                    normal_style,
                ),
                Paragraph(
                    str(value),
                    normal_style,
                ),
                Paragraph(
                    str(reference_range),
                    normal_style,
                ),
                Paragraph(
                    str(parameter_status),
                    normal_style,
                ),
            ]
        )


    parameter_table = Table(
        parameter_rows,
        colWidths=[
            42 * mm,
            28 * mm,
            48 * mm,
            32 * mm,
        ],
        repeatRows=1,
    )


    parameter_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.lightgrey,
            ),
            (
                "BOX",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey,
            ),
            (
                "INNERGRID",
                (0, 0),
                (-1, -1),
                0.25,
                colors.lightgrey,
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "TOP",
            ),
            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                6,
            ),
            (
                "RIGHTPADDING",
                (0, 0),
                (-1, -1),
                6,
            ),
            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                5,
            ),
            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                5,
            ),
        ])
    )


    story.append(
        parameter_table
    )


    # ======================================================
    # AI Summary
    # ======================================================

    story.append(
        Paragraph(
            "AI-Generated Summary",
            heading_style,
        )
    )


    ai_summary = ""


    if isinstance(
        analysis_result,
        dict
    ):

        ai_summary = analysis_result.get(
            "ai_summary",
            ""
        )


    if not ai_summary:

        ai_summary = (
            "No AI summary is available "
            "for this report."
        )


    # ------------------------------------------------------
    # Process summary line by line
    # ------------------------------------------------------

    summary_lines = ai_summary.splitlines()


    for line in summary_lines:

        line = line.strip()


        # Skip empty lines

        if not line:

            story.append(
                Spacer(1, 4)
            )

            continue


        # Skip horizontal separators

        if re.fullmatch(
            r"[*_-]{3,}",
            line
        ):

            continue


        clean_line = markdown_to_reportlab(
            line
        )


        # Avoid creating empty paragraphs

        if not clean_line.strip():

            continue


        story.append(
            Paragraph(
                clean_line,
                summary_style,
            )
        )


    # ======================================================
    # Disclaimer
    # ======================================================

    story.append(
        Spacer(1, 12)
    )


    disclaimer = (
        "<b>Medical Disclaimer:</b> "
        "This AI-generated report is provided for "
        "informational and educational purposes only. "
        "It is not a medical diagnosis and should not "
        "replace professional medical advice, diagnosis, "
        "or treatment. Please consult a qualified "
        "healthcare professional for interpretation "
        "of your laboratory results."
    )


    disclaimer_table = Table(
        [
            [
                Paragraph(
                    disclaimer,
                    disclaimer_style,
                )
            ]
        ],
        colWidths=[
            170 * mm
        ],
    )


    disclaimer_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                colors.whitesmoke,
            ),
            (
                "BOX",
                (0, 0),
                (-1, -1),
                0.5,
                colors.lightgrey,
            ),
            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                8,
            ),
            (
                "RIGHTPADDING",
                (0, 0),
                (-1, -1),
                8,
            ),
            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                8,
            ),
            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                8,
            ),
        ])
    )


    story.append(
        KeepTogether(
            [disclaimer_table]
        )
    )


    # ======================================================
    # Build PDF
    # ======================================================

    document.build(
        story
    )


    # ------------------------------------------------------
    # Reset buffer position
    # ------------------------------------------------------

    buffer.seek(0)


    return buffer
def generate_diet_pdf(patient_name: str, report_id: int, diet_plan: str):
    import markdown
    
    # Convert markdown diet plan to HTML
    diet_html = markdown.markdown(diet_plan)
    
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; color: #333; }}
            h1 {{ color: #047857; text-align: center; border-bottom: 2px solid #047857; padding-bottom: 10px; }}
            h2, h3 {{ color: #065f46; margin-top: 25px; }}
            .header {{ text-align: center; margin-bottom: 40px; }}
            .footer {{ text-align: center; margin-top: 50px; font-size: 12px; color: #666; border-top: 1px solid #ccc; padding-top: 20px; }}
            .content {{ line-height: 1.6; font-size: 14px; }}
            ul {{ padding-left: 20px; }}
            li {{ margin-bottom: 8px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Personalized Diet Plan</h1>
            <p><strong>Patient Name:</strong> {patient_name}</p>
            <p><strong>Report ID:</strong> #{report_id}</p>
        </div>
        
        <div class="content">
            {diet_html}
        </div>
        
        <div class="footer">
            Generated by AI BloodTest Analyzer &bull; Confidentially tailored for {patient_name}
        </div>
    </body>
    </html>
    """
    
    try:
        pdf_bytes = pdfkit.from_string(html_content, False, options={
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': 'UTF-8',
            'enable-local-file-access': None
        })
        return BytesIO(pdf_bytes)
    except OSError:
        pass
    
    # Fallback if wkhtmltopdf missing
    return BytesIO(b"%PDF-1.4\n1 0 obj\n<< /Title (Diet Plan) >>\nendobj")
