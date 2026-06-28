from app.ai.gemini_service import analyze_blood_report

parameters = {
    "hemoglobin": 12.5,
    "rbc": 5.2,
    "wbc": 9000,
    "platelets": 150000,
    "esr": 5,
    "pcv": 57.5
}

response = analyze_blood_report(parameters)

print(response)