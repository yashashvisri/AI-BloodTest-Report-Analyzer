import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_blood_report(parameters):

    prompt = f"""
You are an experienced medical AI assistant.

The following blood parameters were extracted from a blood report.

{parameters}

Provide:

1. Overall health summary
2. Explain abnormal values
3. Possible medical significance
4. Lifestyle recommendations
5. When to consult a doctor

Keep the explanation simple.

End with a disclaimer that this is not a medical diagnosis.
"""

    response = model.generate_content(prompt)

    return response.text