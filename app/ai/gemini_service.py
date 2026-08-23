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

def generate_diet_plan(analysis_text):
    prompt = f"""
You are an expert nutritionist and medical AI assistant.
Based on the following blood test analysis, generate a highly actionable 7-day diet and lifestyle plan.
Focus specifically on correcting any deficiencies or abnormal values mentioned in the analysis.

Analysis:
{analysis_text}

Provide the output in clean Markdown format with the following sections:
- 🎯 Core Dietary Focus (What to eat more of, what to avoid)
- 📅 7-Day Meal Plan (Brief daily overview)
- 🏃‍♂️ Workout & Lifestyle Adjustments

Disclaimer: Mention that this is an AI-generated suggestion and a doctor should be consulted.
"""
    response = model.generate_content(prompt)
    return response.text

def chat_with_report(question, analysis_text):
    prompt = f"""
You are a helpful and empathetic medical AI assistant. 
A patient is asking a question about their blood test report.

Here is the context of their blood test analysis:
{analysis_text}

Patient's Question: {question}

Answer the question directly, keeping it simple, reassuring, and easy to understand.
Do not use overly complex medical jargon unless you explain it.
"""
    response = model.generate_content(prompt)
    return response.text

def translate_summary(summary_text, language):
    prompt = f"""
Translate the following medical summary into {language}. 
Ensure the medical terms are translated accurately but remain easy for a layman to understand.
Maintain the exact same formatting and markdown structure.

Text to translate:
{summary_text}
"""
    response = model.generate_content(prompt)
    return response.text