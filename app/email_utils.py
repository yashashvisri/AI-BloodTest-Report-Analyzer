import smtplib
from email.message import EmailMessage
import os

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")

def send_analysis_email(to_email: str, patient_name: str, report_id: int):
    print(f"Mocking email send to {to_email} for report {report_id}...")
    if not SMTP_USER or not SMTP_PASS:
        print("Skipping actual SMTP send: SMTP credentials not configured in .env")
        return
    
    msg = EmailMessage()
    msg.set_content(f"Hello {patient_name},\n\nYour blood test report #{report_id} has been fully analyzed by our AI system.\nLog in to your dashboard to view the insights, trend graphs, and actionable diet plans.\n\nStay Healthy,\nAI BloodTest Team")
    
    msg["Subject"] = f"Your Blood Report Analysis is Ready - #{report_id}"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
        server.quit()
        print("Email sent successfully!")
    except Exception as e:
        print("Failed to send email:", e)
