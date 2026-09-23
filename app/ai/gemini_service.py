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

def generate_health_risk_score(analysis_data):
    """Generate a structured health risk score from blood parameters using Gemini AI."""
    prompt = f"""
You are a medical AI risk assessment engine. Analyze the following blood test parameters and generate a structured health risk score.

Blood Test Parameters:
{analysis_data}

Return your response in EXACTLY this JSON format (no markdown, no code blocks, just raw JSON):
{{
    "overall_score": <integer 0-100, where 100 is perfect health>,
    "risk_level": "<Low|Moderate|High|Critical>",
    "categories": [
        {{
            "name": "Cardiovascular Health",
            "score": <integer 0-100>,
            "risk": "<Low|Moderate|High|Critical>",
            "summary": "<one sentence explanation>"
        }},
        {{
            "name": "Metabolic Function",
            "score": <integer 0-100>,
            "risk": "<Low|Moderate|High|Critical>",
            "summary": "<one sentence explanation>"
        }},
        {{
            "name": "Immune System",
            "score": <integer 0-100>,
            "risk": "<Low|Moderate|High|Critical>",
            "summary": "<one sentence explanation>"
        }},
        {{
            "name": "Nutritional Status",
            "score": <integer 0-100>,
            "risk": "<Low|Moderate|High|Critical>",
            "summary": "<one sentence explanation>"
        }},
        {{
            "name": "Organ Function",
            "score": <integer 0-100>,
            "risk": "<Low|Moderate|High|Critical>",
            "summary": "<one sentence explanation>"
        }}
    ],
    "top_concerns": ["<concern 1>", "<concern 2>", "<concern 3>"],
    "positive_indicators": ["<positive 1>", "<positive 2>"]
}}

Be medically accurate. If parameters are mostly normal, give high scores. If there are abnormalities, reflect them precisely in the relevant category scores.
"""
    response = model.generate_content(prompt)
    return response.text
